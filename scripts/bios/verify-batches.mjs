#!/usr/bin/env node
/**
 * Re-derive every batch's true accepted counts by replaying the content files
 * through the real deduplicator, in build order.
 *
 * WHY: the ledger is the resumable state of this project. Batch 012 was recorded
 * as 102 records when it actually accepted 75, because the row was written from
 * hand arithmetic instead of from the builder. The data was fine; the bookkeeping
 * was not. This script makes the counts reproducible so ledger rows can be copied
 * rather than calculated.
 *
 * Usage: node scripts/bios/verify-batches.mjs [--markdown]
 */
import { readdirSync } from 'node:fs';
import { BioDeduplicator } from './schema.mjs';

const files = readdirSync(new URL('./content/', import.meta.url))
  .filter((f) => /^batch-\d+\.mjs$/.test(f))
  .sort();

const dem = new BioDeduplicator();
const rows = [];
let cumulative = 0;

for (const file of files) {
  const mod = await import(new URL(`./content/${file}`, import.meta.url).href);
  const seeds = Object.entries(mod)
    .filter(([key]) => key.startsWith('BATCH_'))
    .flatMap(([, value]) => value);

  const startRejections = dem.rejections.length;
  let en = 0, hi = 0, hg = 0;

  for (const seed of seeds) {
    if (!dem.consider(seed.text, seed.lang, seed.category)) continue;
    if (seed.lang === 'en') en++;
    else if (seed.lang === 'hi') hi++;
    else if (seed.lang === 'hg') hg++;
  }

  const rejected = dem.rejections.slice(startRejections);
  const accepted = en + hi + hg;
  cumulative += accepted;
  rows.push({ file, seeds: seeds.length, en, hi, hg, accepted, rejected: rejected.length, cumulative, rejections: rejected });
}

const markdown = process.argv.includes('--markdown');
let totalEn = 0, totalHi = 0, totalHg = 0;

if (markdown) {
  console.log('| Batch | File | EN | HI | HG | Total | Rejected | Cumulative |');
  console.log('|---|---|---|---|---|---|---|---|');
  for (const [i, r] of rows.entries()) {
    totalEn += r.en; totalHi += r.hi; totalHg += r.hg;
    console.log(`| ${String(i + 1).padStart(3, '0')} | \`${r.file}\` | ${r.en} | ${r.hi} | ${r.hg} | ${r.accepted} | ${r.rejected} | ${r.cumulative} |`);
  }
} else {
  for (const [i, r] of rows.entries()) {
    const flag = r.rejected > 0 ? `  REJECTED ${r.rejected}` : '';
    console.log(`${String(i + 1).padStart(3, '0')}  ${String(r.seeds).padStart(3)} seeds → EN ${String(r.en).padStart(3)}  HI ${String(r.hi).padStart(3)}  HG ${String(r.hg).padStart(3)}  = ${String(r.accepted).padStart(3)}  cum ${r.cumulative}${flag}`);
    for (const rej of r.rejections) console.log(`        ✗ ${rej.layer}: ${rej.reason} — "${rej.text.slice(0, 60)}"`);
  }
  totalEn = rows.reduce((a, r) => a + r.en, 0);
  totalHi = rows.reduce((a, r) => a + r.hi, 0);
  totalHg = rows.reduce((a, r) => a + r.hg, 0);
  console.log(`\nTOTAL verified: ${cumulative}  (EN ${totalEn} · HI ${totalHi} · HG ${totalHg})`);
}
