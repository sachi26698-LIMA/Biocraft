#!/usr/bin/env node
/**
 * BioCraft — data importer
 *
 * Imports REAL catalogues from REAL npm packages that ship the upstream data.
 * Nothing here invents rows: if a package is absent the adapter reports it as
 * unavailable rather than substituting sample content.
 *
 * Every run is idempotent: rows are matched on a natural unique key and either
 * inserted, updated (only when a field actually changed) or skipped. Re-running
 * an import therefore cannot duplicate or corrupt anything.
 *
 * Usage:
 *   node scripts/import-data.mjs --source=unicode-emoji --dry-run
 *   node scripts/import-data.mjs --source=unicode-symbols --dry-run
 *   node scripts/import-data.mjs --source=google-fonts --dry-run
 *   DATABASE_URL=postgres://... node scripts/import-data.mjs --source=all
 *
 * --dry-run builds and validates every row and prints real counts, but writes
 * nothing. It is the default when no DATABASE_URL is present.
 */

import {batchCtes} from './standard-sync-sql.mjs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const args = process.argv.slice(2);
const opt = (name, def = null) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : def;
};
const has = (name) => args.includes(`--${name}`);

const SOURCE = opt('source', 'all');
const DRY = has('dry-run') || !process.env.DATABASE_URL;
const BATCH = Number(opt('batch', '500'));

/* ------------------------------------------------------------------ helpers */

const log = (...a) => console.log(...a);

/* ----------------------------------------------------------------- adapters */

/**
 * Unicode emoji — from `unicode-emoji-json`, MIT, derived from Unicode CLDR.
 * Source of truth: the package itself, loaded at runtime.
 */
export async function adaptEmoji() {
  let data;
  try {
    // The package's ESM entry is a bare .json file with no import attribute,
    // so `import()` throws ERR_IMPORT_ATTRIBUTE_MISSING. Its CJS entry point is
    // the same real data file, which require() reads correctly.
    data = require('unicode-emoji-json');
    if (data && data.default) data = data.default;
  } catch (e) {
    return { available: false, reason: `package unicode-emoji-json not readable: ${e.code || e.message}`, rows: [] };
  }
  const rows = Object.entries(data).map(([emoji, v]) => ({
    emoji,
    name: v.name,
    slug: v.slug,
    group_name: v.group,
    unicode_version: v.unicode_version,
    emoji_version: v.emoji_version,
    skin_tone_support: !!v.skin_tone_support,
  }));
  return { available: true, license: 'MIT', rows };
}

/**
 * Unicode symbols — from `@unicode/unicode-15.1.0` (the real UCD).
 * Names are not shipped as a flat map, so labels come from the code point by
 * rule, and the *category* is the genuine UCD general category.
 */
export async function adaptSymbols() {
  let mod;
  try {
    mod = await import('@unicode/unicode-15.1.0/General_Category/Symbol/code-points.mjs');
  } catch {
    return { available: false, reason: 'package @unicode/unicode-15.1.0 not installed', rows: [] };
  }
  const points = mod.default;
  // Other_Symbol is the decorative set; exclude it from the "symbol" bucket only
  // if it would duplicate. Here we keep every Symbol code point, tagged by class.
  let otherSymbol = new Set();
  try {
    otherSymbol = new Set((await import('@unicode/unicode-15.1.0/General_Category/Other_Symbol/code-points.mjs')).default);
  } catch { return {available:false,reason:'UCD subcategory missing',rows:[]}; }

  const rows = [];
  for (const cp of points) {
    const ch = String.fromCodePoint(cp);
    const hex = cp.toString(16).toUpperCase().padStart(4, '0');
    rows.push({
      symbol: ch,
      codepoints: 'U+' + hex,
      title: `U+${hex}`,
      category: otherSymbol.has(cp) ? 'other-symbol' : 'symbol',
      sort_order: cp,
    });
  }
  return { available: true, license: 'MIT', rows };
}

/**
 * Google Fonts catalogue — from `google-font-metadata`, MIT.
 * `.APIDirect` is the real API-shaped array of 1,908 families.
 */
export async function adaptFonts() {
  let f;
  try {
    f = (await import('google-font-metadata')).APIDirect ?? (await import('google-font-metadata')).default?.APIDirect;
  } catch {
    return { available: false, reason: 'package google-font-metadata not installed', rows: [] };
  }
  if (!Array.isArray(f)) return { available: false, reason: 'APIDirect export shape changed', rows: [] };

  const rows = f.map((font) => {
    const variants = font.variants || [];
    const weights = [...new Set(variants
      .map((v) => (v.match(/^(\d{3})/)?.[1] ?? (v === 'regular' ? '400' : v === 'italic' ? '400' : null)))
      .filter(Boolean))];
    const styles = [...new Set(variants.map((v) => (v.includes('italic') ? 'italic' : 'normal')))];
    return {
      name: font.family,
      family: font.family,
      slug: font.family.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      category: font.category || null,
      subsets: font.subsets || [],
      weights,
      styles,
      variable: variants.some((v) => v.includes('variable') || /\[/.test(v)),
      font_type: font.category || 'sans-serif',
      preview_text: 'The quick brown fox jumps over the lazy dog',
    };
  });
  return { available: true, license: 'MIT', rows };
}

/* ---------------------------------------------------------------- validation */

export function validate(kind, rows) {
  const errors = [];
  const seen = new Set();
  let dropped = 0;
  const clean = [];
  for (const [i, r] of rows.entries()) {
    const key = kind === 'emoji' ? r.emoji : kind === 'symbol' ? r.codepoints : r.slug;
    if (!key) { errors.push(`row ${i}: missing key`); dropped++; continue; }
    if (seen.has(key)) { dropped++; continue; }          // real duplicate inside source
    seen.add(key);
    if (kind === 'emoji' && (!r.name || !r.group_name)) { errors.push(`row ${i}: incomplete emoji`); dropped++; continue; }
    if (kind === 'font' && (!r.name || !r.slug)) { errors.push(`row ${i}: incomplete font`); dropped++; continue; }
    clean.push(r);
  }
  return { clean, errors: errors.slice(0, 10), dropped, unique: seen.size };
}

/* ------------------------------------------------------------------- writers */

async function ensureSource(db, slug) {
  const { rows } = await db.query('select id from public.data_sources where slug=$1 and status<>\'disabled\'', [slug]);
  return rows[0]?.id ?? null;
}

export async function importRows(db, kind, source, rows) {
  const sourceId = await ensureSource(db, source.slug);
  if (!sourceId) throw new Error(`Source not registered: ${source.slug}`);
  if (!Number.isSafeInteger(BATCH) || BATCH < 1 || BATCH > 5000) throw new Error('Invalid batch size');
  let inserted=0, updated=0, skipped=0;
  const sql=`${batchCtes(kind)} select a,c,n-a-c as skipped from counts`;
  for(let i=0;i<rows.length;i+=BATCH) {
    const result=await db.query(sql,[sourceId,source.license,JSON.stringify(rows.slice(i,i+BATCH))]);
    inserted+=result.rows[0].a; updated+=result.rows[0].c; skipped+=result.rows[0].skipped;
  }
  return { inserted, updated, skipped };
}

/* ---------------------------------------------------------------------- main */

export const SOURCES = {
  emoji: { slug: 'unicode-emoji-json', adapt: adaptEmoji, kind: 'emoji', label: 'Unicode Emoji' },
  symbols: { slug: 'unicode-15.1', adapt: adaptSymbols, kind: 'symbol', label: 'Unicode Symbols' },
  fonts: { slug: 'google-fonts-metadata', adapt: adaptFonts, kind: 'font', label: 'Google Fonts' },
};
const ALIAS = {
  'unicode-emoji': 'emoji',
  'unicode-symbols': 'symbols',
  'google-fonts': 'fonts',
  all: 'all',
};

async function main() {
  const wanted = Object.hasOwn(ALIAS, SOURCE) ? ALIAS[SOURCE] : SOURCE;
  const names = wanted === 'all' ? Object.keys(SOURCES) : [wanted];
  if (names.some(name => !Object.hasOwn(SOURCES,name))) throw new Error('Unknown standard source');
  if (!DRY) {
    // Use the same source lock, job accounting, retry and completion transaction
    // as the worker. Do not maintain a second, record-by-record CLI write path.
    const {runPass} = await import('./sync.mjs');
    const results = await runPass({dryRun:false,slugs:names.map(n=>SOURCES[n].slug)});
    if (results.some(r=>!r.ok)) process.exitCode = 1;
    return;
  }
  log('mode: DRY RUN (nothing written)');
  for (const name of names) {
    const source = SOURCES[name];
    const built = await source.adapt();
    if (!built.available) throw new Error(built.reason);
    const v = validate(source.kind, built.rows);
    if (!v.clean.length || v.errors.length) throw new Error(`Invalid pinned catalogue: ${source.slug}`);
    log(`${source.label}: ${built.rows.length} raw → ${v.clean.length} valid (${v.dropped} duplicates)`);
  }
}

// Only run the CLI when invoked directly, so the sync engine can reuse the
// adapters without triggering an import as a side effect of importing this file.
const invokedDirectly = process.argv[1] && import.meta.url === `file://${process.argv[1]}`;
if (invokedDirectly) {
  main().catch((e) => { console.error('IMPORT FAILED:', e.message); process.exit(1); });
}
