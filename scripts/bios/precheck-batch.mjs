#!/usr/bin/env node
/**
 * Pre-build check for a batch content file.
 *
 * Why this exists: in batches 060 and 066 I re-added Hindi/Hinglish lines that
 * were already in the file. The deduper caught every one, so nothing bad ever
 * shipped — but each repeat cost a build cycle and inflated the rejection log,
 * which then made the per-batch rejection counts read worse than the work was.
 *
 * This checks the cheap things a machine can check before the expensive full
 * build:
 *   1. exact repeated text inside the file (the thing I kept doing)
 *   2. a per-language count against the balance.mjs allocation
 *   3. category names that are not in the declared 46
 *   4. length ceiling
 *   5. Hinglish lines with too few marker tokens (the gate will reject these)
 *
 * Usage: node scripts/bios/precheck-batch.mjs 067 [44 32 33]
 * Exit code 1 if any check fails, so it can gate a commit.
 */
import { readFileSync } from 'node:fs';
import {
  validateLanguage, MAX_BIO_LENGTH, MIN_BIO_LENGTH, BioDeduplicator,
  // CATEGORIES lives in batch-001; imported lazily below to avoid a cycle
} from './schema.mjs';

const batchNo = process.argv[2];
if (!batchNo) {
  console.error('usage: node scripts/bios/precheck-batch.mjs <batch number> [en hi hg]');
  process.exit(2);
}

const padded = String(batchNo).padStart(3, '0');
const file = `./content/batch-${padded}.mjs`;
const mod = await import(file);
const key = Object.keys(mod).find((k) => k.startsWith('BATCH_'));
const seeds = mod[key];

const { CATEGORIES } = await import('./content/batch-001.mjs');
const cats = new Set(CATEGORIES.map((c) => (typeof c === 'string' ? c : c.name ?? c[0])));

let fail = 0;
const problem = (msg) => { fail += 1; console.log(`  FAIL  ${msg}`); };
const ok = (msg) => console.log(`  PASS  ${msg}`);

console.log(`\nprecheck batch ${padded} — ${seeds.length} seeds\n`);

/* 1. exact repeats inside the file ------------------------------------- */
{
  const seen = new Map();
  const dupes = [];
  for (const s of seeds) {
    if (seen.has(s.text)) dupes.push(s.text);
    else seen.set(s.text, true);
  }
  if (dupes.length) {
    for (const d of dupes) problem(`exact repeat inside file: ${d.slice(0, 70)}`);
  } else {
    ok('no exact repeats inside the file');
  }
}

/* 2. per-language counts vs allocation --------------------------------- */
{
  const counts = seeds.reduce((acc, s) => ((acc[s.lang] = (acc[s.lang] ?? 0) + 1), acc), {});
  const want = process.argv.slice(3, 6).map(Number);
  const got = { en: counts.en ?? 0, hi: counts.hi ?? 0, hg: counts.hg ?? 0 };
  const line = `counts: EN ${got.en} · HI ${got.hi} · HG ${got.hg} = ${seeds.length}`;
  if (want.length === 3 && want.every(Number.isFinite)) {
    const off = ['en', 'hi', 'hg'].filter((k, i) => got[k] !== want[i]);
    if (off.length) problem(`${line} — off allocation ${want.join('/')} on ${off.join(', ')}`);
    else ok(`${line} — exactly on allocation ${want.join('/')}`);
  } else {
    console.log(`  INFO  ${line} (no allocation given)`);
  }
}

/* 3. categories --------------------------------------------------------- */
{
  const unknown = [...new Set(seeds.map((s) => s.category))].filter((c) => !cats.has(c));
  if (unknown.length) problem(`unknown categories: ${unknown.join(', ')}`);
  else ok(`all ${new Set(seeds.map((s) => s.category)).size} categories are declared`);
}

/* 4. length ------------------------------------------------------------- */
{
  const bad = seeds.filter((s) => s.text.length > MAX_BIO_LENGTH || s.text.length < MIN_BIO_LENGTH);
  if (bad.length) problem(`${bad.length} outside ${MIN_BIO_LENGTH}-${MAX_BIO_LENGTH} chars: ${bad[0].text.slice(0, 50)}`);
  else ok(`all lengths inside ${MIN_BIO_LENGTH}-${MAX_BIO_LENGTH}`);
}

/* 5. language gate ------------------------------------------------------ */
{
  const bad = seeds.map((s) => ({ s, r: validateLanguage(s.text, s.lang) })).filter((x) => !x.r.ok);
  if (bad.length) {
    for (const x of bad) problem(`${x.s.lang} gate: ${x.r.reason} — ${x.s.text.slice(0, 60)}`);
  } else {
    ok('every seed passes the language gate as written');
  }
}

/* 6. full deduper against every earlier batch --------------------------- */
// Batch 071 shipped 3 near-duplicates that every other check missed, because
// none of the earlier checks ran the deduper: the gate only asks "is this the
// right language", and the file check only compares a batch with itself. A
// batch can be perfectly balanced, in the right language, the right length, and
// still repeat an idea from batch 012.
{
  const { readdirSync } = await import('node:fs');
  const files = readdirSync('./content').filter((f) => f.endsWith('.mjs')).sort();
  const dedupe = new BioDeduplicator();
  const mine = new Set();
  for (const f of files) {
    const m = await import(`./content/${f}`);
    const k = Object.keys(m).find((x) => x.startsWith('BATCH_'));
    const isMine = f.includes(`-${padded}.mjs`);
    for (const seed of m[k] ?? []) {
      const accepted = dedupe.consider(seed.text, seed.lang, seed.category);
      if (isMine) {
        mine.add(seed);
        if (!accepted) {
          const r = dedupe.rejections[dedupe.rejections.length - 1];
          problem(`${seed.lang} ${r.layer}: ${seed.text.slice(0, 64)}`);
        }
      }
    }
  }
  const mineRejected = dedupe.rejections.filter((r) => mine.has(r) || [...mine].some((m) => m.text === r.text));
  if (mineRejected.length === 0) ok('every seed survives the full deduper against batches 001 onwards');
}

console.log(`\n${fail === 0 ? `PASS — batch ${padded} is clean to build` : `FAIL — ${fail} problem(s), fix before building`}`);
process.exit(fail === 0 ? 0 : 1);
