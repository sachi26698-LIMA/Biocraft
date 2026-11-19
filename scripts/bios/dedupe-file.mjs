#!/usr/bin/env node
/**
 * Remove internal exact duplicates from a single batch content file.
 *
 * Why: when topping up HI/HG to hit the balance.mjs allocation, I repeatedly
 * pasted lines that were already in the same file (batches 060, 066, 072, 073).
 * The deduper caught them every time, so nothing bad shipped, but it wasted
 * rounds. This keeps the FIRST occurrence and drops later copies, then reports
 * the per-language counts so the next top-up is arithmetic instead of guessing.
 *
 * Usage:
 *   node scripts/bios/dedupe-file.mjs 073          # rewrite in place
 *   node scripts/bios/dedupe-file.mjs 073 --dry    # report only
 */
import { readFileSync, writeFileSync } from 'node:fs';

const batchNo = process.argv[2];
if (!batchNo) {
  console.error('usage: node scripts/bios/dedupe-file.mjs <batch number> [--dry]');
  process.exit(2);
}
const dry = process.argv.includes('--dry');
const padded = String(batchNo).padStart(3, '0');
const path = new URL(`./content/batch-${padded}.mjs`, import.meta.url);

// Match the text argument of a seed helper: e('...', 'Category', ...
const LINE = /^\s*[ehg]\('(.+?)',\s*'[^']*'/;

const src = readFileSync(path, 'utf8');
const lines = src.split('\n');

const seen = new Map();
const keep = [];
const removed = [];

for (const line of lines) {
  const m = LINE.exec(line);
  if (!m) {
    keep.push(line);
    continue;
  }
  const text = m[1];
  const count = (seen.get(text) ?? 0) + 1;
  seen.set(text, count);
  if (count > 1) {
    removed.push(text);
    continue;
  }
  keep.push(line);
}

if (!dry && removed.length) writeFileSync(path, keep.join('\n'));

// The helpers are e(, h( and g( — single letters, not the en/hi/hg lang keys.
const helperToLang = { e: 'en', h: 'hi', g: 'hg' };
const counts = { en: 0, hi: 0, hg: 0 };
for (const line of keep) {
  const m = /^\s*([ehg])\('/.exec(line);
  if (m) counts[helperToLang[m[1]]] += 1;
}

console.log(`\nbatch ${padded}${dry ? ' (dry run)' : ''}`);
console.log(`  removed ${removed.length} internal duplicate(s)`);
for (const r of removed) console.log(`    - ${r.slice(0, 70)}`);
console.log(`  counts now: EN ${counts.en} · HI ${counts.hi} · HG ${counts.hg} = ${counts.en + counts.hi + counts.hg}`);
if (process.argv[3] && !dry) {
  console.log('  (dry flag ignored because it was positional)');
}
