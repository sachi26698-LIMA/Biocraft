/**
 * Suggests a per-language split for the next batch so the three languages
 * converge on the same percentage of their own targets.
 *
 * The point of this file is to stop me hand-guessing "EN is a bit ahead, lean
 * HI" and then overshooting in the other direction. Every batch before this
 * swung the spread back and forth instead of narrowing it.
 *
 * Usage: node scripts/bios/balance.mjs [batchSize]
 */
import { readFileSync } from 'node:fs';

const TARGET = { en: 20000, hi: 15000, hg: 15000 };
const report = JSON.parse(readFileSync('src/data/bios/report.json', 'utf8'));
const current = report.verified.byLang;

const batchSize = Number(process.argv[2] ?? 100);

/**
 * We want to pick n_en + n_hi + n_hg = batchSize so that
 * (current[k] + n[k]) / TARGET[k] is equal for all k.
 *
 * Solve for a common percentage p and allot the remainder by largest deficit.
 */
function planFor(size) {
  // Water-filling: raise p until the total new records equals the batch size.
  let lo = 0;
  let hi = 100;
  for (let i = 0; i < 60; i++) {
    const p = (lo + hi) / 2;
    let needed = 0;
    for (const k of ['en', 'hi', 'hg']) {
      needed += Math.max(0, Math.round((p / 100) * TARGET[k]) - current[k]);
    }
    if (needed > size) hi = p;
    else lo = p;
  }
  const p = lo;
  const alloc = {};
  let assigned = 0;
  for (const k of ['en', 'hi', 'hg']) {
    alloc[k] = Math.max(0, Math.round((p / 100) * TARGET[k]) - current[k]);
    assigned += alloc[k];
  }
  // Hand out (or claw back) the rounding remainder by size of gap to target p.
  let remainder = size - assigned;
  const order = ['en', 'hi', 'hg'].sort((a, b) => current[b] / TARGET[b] - current[a] / TARGET[a]);
  for (let i = 0; remainder > 0; i++) {
    alloc[order[i % 3]]++;
    remainder--;
  }
  for (let i = 0; remainder < 0; i++) {
    const k = order[2 - (i % 3)];
    if (alloc[k] > 0) {
      alloc[k]--;
      remainder++;
    }
  }
  return alloc;
}

console.log('current:', Object.fromEntries(
  Object.entries(current).map(([k, v]) => [k, `${v} (${((v / TARGET[k]) * 100).toFixed(2)}%)`]),
));

for (const size of [90, 100, 110, batchSize]) {
  const a = planFor(size);
  const after = {};
  for (const k of ['en', 'hi', 'hg']) after[k] = current[k] + a[k];
  const pct = Object.fromEntries(
    Object.entries(after).map(([k, v]) => [k, `${((v / TARGET[k]) * 100).toFixed(2)}%`]),
  );
  const spread = Math.max(...Object.entries(after).map(([k, v]) => v / TARGET[k])) -
    Math.min(...Object.entries(after).map(([k, v]) => v / TARGET[k]));
  console.log(
    `batch ${size}: EN ${a.en} HI ${a.hi} HG ${a.hg}  ->  ${pct.en} / ${pct.hi} / ${pct.hg}` +
    `  spread ${(spread * 100).toFixed(2)}pp`,
  );
}
