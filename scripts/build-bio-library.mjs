#!/usr/bin/env node
/**
 * BioCraft — assemble the premium ready-made bio library.
 *
 * Reads every content module in scripts/bios/content/, runs each record through
 * the deduplication and language gate, and emits:
 *
 *   src/data/bios/records.json      accepted records, packed
 *   src/data/bios/index.json        per-category and per-language counts
 *   src/data/bios/report.json       rejections by layer, shortfall vs target
 *
 * The report is the point. It states the exact verified count and, when the
 * count is below the target, the exact shortfall by language. It never rounds
 * up and never says "complete" when it is not.
 *
 *   node scripts/build-bio-library.mjs            # build
 *   node scripts/build-bio-library.mjs --check    # fail if output is stale
 *   node scripts/build-bio-library.mjs --report   # print the report only
 */
import { mkdirSync, writeFileSync, existsSync, readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { BioDeduplicator, makeRecord } from './bios/schema.mjs';
import { SOURCE_MAP, SOURCES } from './bios/sources.mjs';

const root = dirname(fileURLToPath(new URL('../package.json', import.meta.url)));
const CONTENT_DIR = join(root, 'scripts/bios/content');
const OUT_DIR = join(root, 'src/data/bios');

const CHECK = process.argv.includes('--check');
const REPORT_ONLY = process.argv.includes('--report');

/** Targets from the brief. Reported against, never assumed. */
const TARGET = { en: 20000, hi: 15000, hg: 15000 };
const TARGET_TOTAL = TARGET.en + TARGET.hi + TARGET.hg;

/* ------------------------------------------------------------------ load */

const files = existsSync(CONTENT_DIR)
  ? readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.mjs')).sort()
  : [];

const seeds = [];
const declaredCategories = new Set();
for (const file of files) {
  const mod = await import(join(CONTENT_DIR, file));
  for (const category of mod.CATEGORIES ?? []) declaredCategories.add(category);
  const batch = Object.entries(mod)
    .filter(([key]) => key.startsWith('BATCH_'))
    .flatMap(([, value]) => value);
  for (const seed of batch) seeds.push({ ...seed, file });
}

/* ------------------------------------------------------- validate + dedupe */

const dedupe = new BioDeduplicator();
const accepted = [];
const unknownCategory = [];

for (const seed of seeds) {
  if (!declaredCategories.has(seed.category)) {
    unknownCategory.push(seed);
    continue;
  }
  if (!SOURCE_MAP.has(seed.sourceId)) {
    throw new Error(`record references unknown source ${seed.sourceId}`);
  }
  if (dedupe.consider(seed.text, seed.lang, seed.category)) {
    accepted.push(seed);
  }
}

// A seed filed under a category that is not in the declared list used to be
// dropped silently, which made a typo indistinguishable from a clean batch.
// It is a mistake in the content file, not a property of the record, so it
// fails the build rather than being counted as a rejection.
if (unknownCategory.length > 0) {
  const detail = unknownCategory
    .map((seed) => `  ${seed.file}: "${seed.category}" <- ${seed.text.slice(0, 60)}`)
    .join('\n');
  throw new Error(
    `batch content references ${unknownCategory.length} categor${unknownCategory.length === 1 ? 'y' : 'ies'} not in the declared list:\n${detail}`,
  );
}

/* ---------------------------------------------------------------- records */

const CREATED = '2026-11-09';
const records = accepted.map((seed, index) => makeRecord(seed, index, SOURCE_MAP, CREATED));

/* ------------------------------------------------------------------ stats */

const byLang = { en: 0, hi: 0, hg: 0 };
const byCategory = {};
const byScript = { Latin: 0, Devanagari: 0 };
for (const record of records) {
  byLang[record.lang]++;
  byCategory[record.category] = (byCategory[record.category] ?? 0) + 1;
  byScript[record.script]++;
}

const shortfall = {
  en: Math.max(0, TARGET.en - byLang.en),
  hi: Math.max(0, TARGET.hi - byLang.hi),
  hg: Math.max(0, TARGET.hg - byLang.hg),
};
shortfall.total = shortfall.en + shortfall.hi + shortfall.hg;

const report = {
  generated: CREATED,
  contentFiles: files,
  target: { ...TARGET, total: TARGET_TOTAL },
  verified: { byLang, byCategory, byScript, total: records.length },
  shortfall,
  complete: shortfall.total === 0,
  rejected: dedupe.summary(),
  rejectedTotal: dedupe.rejections.length,
  seeded: seeds.length,
  unknownCategory: unknownCategory.length,
  categoriesDeclared: declaredCategories.size,
  categoriesPopulated: Object.keys(byCategory).length,
  sources: SOURCES,
};

if (REPORT_ONLY) {
  console.log(JSON.stringify(report, null, 2));
  process.exit(0);
}

/* --------------------------------------------------------------- emit */

mkdirSync(OUT_DIR, { recursive: true });

/**
 * Records are packed as arrays rather than objects: 50,000 objects with 15 keys
 * each is roughly 3× the bytes of the same data in positional form, and this
 * file is on the critical path for the library page.
 */
const PACKED = records.map((r) => [
  r.id, r.text, r.lang, r.category, r.subcategory, r.tone, r.tags,
  r.script, r.chars, r.platforms, r.created, r.sourceId, r.fingerprint,
]);

function emitJson(file, value) {
  const path = join(OUT_DIR, file);
  const content = `${JSON.stringify(value)}\n`;
  if (CHECK) {
    const current = existsSync(path) ? readFileSync(path, 'utf8') : '';
    if (current !== content) {
      console.error(`STALE: src/data/bios/${file} — run: node scripts/build-bio-library.mjs`);
      process.exitCode = 1;
    }
    return;
  }
  writeFileSync(path, content);
}

emitJson('records.json', PACKED);
emitJson('report.json', report);
emitJson('index.json', {
  total: records.length,
  byLang,
  byCategory,
  byScript,
  categories: [...declaredCategories].sort(),
  complete: report.complete,
  shortfall,
});

if (CHECK) {
  if (process.exitCode !== 1) console.log('bio library up to date');
} else {
  const pct = ((records.length / TARGET_TOTAL) * 100).toFixed(1);
  console.log(`bio library: ${records.length} verified records (${pct}% of ${TARGET_TOTAL.toLocaleString()})`);
  console.log(`  English   ${byLang.en.toLocaleString().padStart(6)} / ${TARGET.en.toLocaleString()}`);
  console.log(`  Hindi     ${byLang.hi.toLocaleString().padStart(6)} / ${TARGET.hi.toLocaleString()}`);
  console.log(`  Hinglish  ${byLang.hg.toLocaleString().padStart(6)} / ${TARGET.hg.toLocaleString()}`);
  console.log(`  categories populated: ${report.categoriesPopulated} / ${declaredCategories.size}`);
  const rejected = Object.entries(report.rejected).filter(([, n]) => n > 0);
  console.log(`  rejected: ${report.rejectedTotal} (${rejected.map(([k, v]) => `${k}:${v}`).join(', ') || 'none'})`);
  if (!report.complete) {
    console.log(`  SHORTFALL: ${shortfall.total.toLocaleString()} records (en:${shortfall.en}, hi:${shortfall.hi}, hg:${shortfall.hg})`);
  }
  console.log(`wrote src/data/bios/{records,index,report}.json`);
}
