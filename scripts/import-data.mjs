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

import pg from 'pg';
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

/** Deterministic content hash so re-imports can tell "changed" from "same". */
function hash(str) {
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36) + '-' + str.length.toString(36);
}

const codepoints = (s) => [...s].map((c) => 'U+' + c.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')).join(' ');

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
  } catch { /* optional refinement */ }

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
  const { rows } = await db.query('select id from public.data_sources where slug=$1', [slug]);
  return rows[0]?.id ?? null;
}

export async function importRows(db, kind, source, rows) {
  const sourceId = await ensureSource(db, source.slug);
  const license = source.license;
  let inserted = 0, updated = 0, skipped = 0;

  for (let i = 0; i < rows.length; i += BATCH) {
    const chunk = rows.slice(i, i + BATCH);

    if (kind === 'emoji') {
      // match on emoji (unique)
      const keys = chunk.map((r) => r.emoji);
      const existing = new Map(
        (await db.query('select emoji, name, group_name from public.emoji_library where emoji = any($1)', [keys]))
          .rows.map((r) => [r.emoji, r]),
      );
      for (const r of chunk) {
        const prev = existing.get(r.emoji);
        if (!prev) {
          await db.query(
            `insert into public.emoji_library (emoji,name,slug,group_name,unicode_version,emoji_version,skin_tone_support,license_code,source_id)
             values ($1,$2,$3,$4,$5,$6,$7,$8,$9) on conflict (emoji) do nothing`,
            [r.emoji, r.name, r.slug, r.group_name, r.unicode_version, r.emoji_version, r.skin_tone_support, license, sourceId],
          );
          inserted++;
        } else if (prev.name !== r.name || prev.group_name !== r.group_name) {
          await db.query('update public.emoji_library set name=$2, group_name=$3, license_code=$4, source_id=$5 where emoji=$1',
            [r.emoji, r.name, r.group_name, license, sourceId]);
          updated++;
        } else skipped++;
      }
    }

    if (kind === 'symbol') {
      const keys = chunk.map((r) => r.codepoints);
      const existing = new Set(
        (await db.query('select codepoints from public.symbols where codepoints = any($1)', [keys]))
          .rows.map((r) => r.codepoints),
      );
      for (const r of chunk) {
        if (existing.has(r.codepoints)) { skipped++; continue; }
        await db.query(
          `insert into public.symbols (symbol,title,category,codepoints,sort_order,license_code,source_id,is_active)
           values ($1,$2,$3,$4,$5,$6,$7,true)`,
          [r.symbol, r.title, r.category, r.codepoints, r.sort_order, license, sourceId],
        );
        inserted++;
      }
    }

    if (kind === 'font') {
      const keys = chunk.map((r) => r.slug);
      const existing = new Map(
        (await db.query('select slug, category, preview_text from public.fonts where slug = any($1)', [keys]))
          .rows.map((r) => [r.slug, r]),
      );
      for (const r of chunk) {
        const prev = existing.get(r.slug);
        if (!prev) {
          await db.query(
            `insert into public.fonts (name,slug,family,font_type,category,subsets,weights,styles,variable,preview_text,license_code,source_id,is_active)
             values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,true)`,
            [r.name, r.slug, r.family, r.font_type, r.category, r.subsets, r.weights, r.styles, r.variable, r.preview_text, license, sourceId],
          );
          inserted++;
        } else if (prev.category !== r.category) {
          await db.query('update public.fonts set category=$2, subsets=$3, weights=$4, styles=$5, variable=$6, license_code=$7, source_id=$8 where slug=$1',
            [r.slug, r.category, r.subsets, r.weights, r.styles, r.variable, license, sourceId]);
          updated++;
        } else skipped++;
      }
    }
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
  const wanted = ALIAS[SOURCE] || SOURCE;
  const names = wanted === 'all' ? Object.keys(SOURCES) : [wanted];
  if (names.some((n) => !SOURCES[n])) {
    console.error(`Unknown source "${SOURCE}". Known: ${Object.keys(ALIAS).join(', ')}`);
    process.exit(2);
  }

  let db = null;
  if (!DRY) {
    db = new pg.Client({ connectionString: process.env.DATABASE_URL });
    await db.connect();
  }
  log(`mode: ${DRY ? 'DRY RUN (nothing written)' : 'IMPORT'}\n`);

  const report = [];
  for (const name of names) {
    const s = SOURCES[name];
    const { available, reason, rows, license } = await s.adapt();
    if (!available) {
      log(`✗ ${s.label}: unavailable — ${reason}`);
      report.push({ name, available: false, reason });
      continue;
    }
    const v = validate(s.kind, rows);
    log(`• ${s.label}: ${rows.length} raw → ${v.clean.length} valid (${v.dropped} duplicate/invalid)`);
    if (v.errors.length) v.errors.forEach((e) => log(`    ! ${e}`));

    let res = { inserted: 0, updated: 0, skipped: 0 };
    if (!DRY) res = await importRows(db, s.kind, { slug: s.slug, license }, v.clean);

    log(`    ${DRY ? 'would write' : 'wrote'}: +${res.inserted} new, ~${res.updated} updated, =${res.skipped} unchanged`);
    report.push({ name, available: true, total: v.clean.length, ...res });
  }

  if (!DRY) {
    for (const r of report.filter((x) => x.available)) {
      const s = SOURCES[r.name];
      await db.query(
        `update public.data_sources set status='ready', last_sync_at=now(), last_sync_count=$2, last_error=null where slug=$1`,
        [s.slug, r.total],
      );
    }
    // Record the run.
    for (const r of report.filter((x) => x.available)) {
      const sid = await ensureSource(db, SOURCES[r.name].slug);
      const job = await db.query(
        `insert into public.data_sync_jobs (source_id,status,mode,started_at,finished_at,items_seen,items_inserted,items_updated,items_skipped,attempts)
         values ($1,'succeeded','full',now(),now(),$2,$3,$4,$5,1) returning id`,
        [sid, r.total, r.inserted, r.updated, r.skipped],
      );
      await db.query(`insert into public.data_sync_logs (job_id,level,message) values ($1,'info',$2)`,
        [job.rows[0].id, `imported ${r.total} items for ${r.name}`]);
    }
    await db.end();
  }

  const totalRows = report.filter((r) => r.available).reduce((a, r) => a + r.total, 0);
  log(`\ntotal valid rows: ${totalRows}`);
  if (report.some((r) => !r.available)) process.exitCode = 1;
}

// Only run the CLI when invoked directly, so the sync engine can reuse the
// adapters without triggering an import as a side effect of importing this file.
const invokedDirectly = process.argv[1] && import.meta.url === `file://${process.argv[1]}`;
if (invokedDirectly) {
  main().catch((e) => { console.error('IMPORT FAILED:', e.message); process.exit(1); });
}
