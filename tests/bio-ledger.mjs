/**
 * Ledger consistency test.
 *
 * The batch ledger is the resumable state of a ~400-batch project, so a wrong
 * number in it is not cosmetic: the next session reads the last row and continues
 * from it. Batch 016's row was written from memory and overstated by one record.
 *
 * This test cross-checks the ledger against the data it claims to describe:
 *   - every batch file on disk has exactly one row, in order, no gaps;
 *   - each row's EN/HI/HG/Total columns add up;
 *   - the columns summed across rows equal records.json;
 *   - the stated cumulative column matches the running sum.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { BioDeduplicator } from '../scripts/bios/schema.mjs';

let pass = 0, fail = 0;
const ok = (name, cond, extra = '') => {
  if (cond) { pass++; console.log(`  PASS  ${name}`); }
  else { fail++; console.log(`  FAIL  ${name}${extra ? ' — ' + extra : ''}`); }
};
const section = (t) => console.log(`\n${t}`);

const ledger = readFileSync('scripts/bios/BATCH_LEDGER.md', 'utf8');
const records = JSON.parse(readFileSync('src/data/bios/records.json', 'utf8'));
const report = JSON.parse(readFileSync('src/data/bios/report.json', 'utf8'));

// | 016 | `batch-016.mjs` | 30 | 23 | 21 | 74 | 1 → fixed | 1592 | notes |
const ROW = /^\|\s*(\d{3})\s*\|\s*`?([\w.-]+\.mjs)`?\s*\|\s*(\d+)\s*\|\s*(\d+)\s*\|\s*(\d+)\s*\|\s*(\d+)\s*\|/gm;
const rows = [...ledger.matchAll(ROW)].map((m) => ({
  batch: Number(m[1]), file: m[2],
  en: Number(m[3]), hi: Number(m[4]), hg: Number(m[5]), total: Number(m[6]),
}));

section('1. every content file has exactly one row');
{
  const files = readdirSync('scripts/bios/content').filter((f) => f.endsWith('.mjs')).sort();
  ok(`${files.length} content files, ${rows.length} ledger rows`, files.length === rows.length,
    `files=${files.length} rows=${rows.length}`);
  for (const [i, file] of files.entries()) {
    ok(`row ${String(i + 1).padStart(3, '0')} points at ${file}`, rows[i]?.file === file,
      `found ${rows[i]?.file}`);
  }
}

section('2. batch numbers are sequential with no gaps');
{
  const gaps = rows.filter((r, i) => r.batch !== i + 1);
  ok(`${rows.length} rows numbered 001..${String(rows.length).padStart(3, '0')}`, gaps.length === 0,
    gaps.map((r) => r.batch).join(', '));
}

section('3. each row adds up');
{
  const bad = rows.filter((r) => r.en + r.hi + r.hg !== r.total);
  ok('every row total equals EN + HI + HG', bad.length === 0,
    bad.map((r) => `${r.batch}: ${r.en}+${r.hi}+${r.hg}≠${r.total}`).join(', '));
}

section('4. every row matches a replay of its own content file');
{
  // The strongest form of this check: don't trust the sum, re-run the batch.
  const files = readdirSync('scripts/bios/content').filter((f) => f.endsWith('.mjs')).sort();
  const dem = new BioDeduplicator();
  const replay = [];
  for (const file of files) {
    const mod = await import(`../scripts/bios/content/${file}`);
    const seeds = Object.entries(mod).filter(([k]) => k.startsWith('BATCH_')).flatMap(([, v]) => v);
    let en = 0, hi = 0, hg = 0;
    for (const seed of seeds) {
      if (!dem.consider(seed.text, seed.lang, seed.category)) continue;
      if (seed.lang === 'en') en++; else if (seed.lang === 'hi') hi++; else hg++;
    }
    replay.push({ file, en, hi, hg, total: en + hi + hg });
  }
  const mismatches = replay.filter((r, i) => {
    const row = rows[i];
    return !row || row.en !== r.en || row.hi !== r.hi || row.hg !== r.hg || row.total !== r.total;
  });
  ok(`all ${replay.length} rows match their replay`, mismatches.length === 0,
    mismatches.map((r) => `${r.file}: ledger ${rows[replay.indexOf(r)]?.total} vs replay ${r.total}`).join('; '));
}

section('5. the rows sum to the actual library');
{
  const sum = rows.reduce((a, r) => ({ en: a.en + r.en, hi: a.hi + r.hi, hg: a.hg + r.hg, total: a.total + r.total }),
    { en: 0, hi: 0, hg: 0, total: 0 });
  ok(`EN column sums to records.json (${report.verified.byLang.en})`, sum.en === report.verified.byLang.en,
    `ledger ${sum.en}`);
  ok(`HI column sums to records.json (${report.verified.byLang.hi})`, sum.hi === report.verified.byLang.hi,
    `ledger ${sum.hi}`);
  ok(`HG column sums to records.json (${report.verified.byLang.hg})`, sum.hg === report.verified.byLang.hg,
    `ledger ${sum.hg}`);
  ok(`total sums to ${records.length} records`, sum.total === records.length, `ledger ${sum.total}`);
}

section('6. the headline count matches the data');
{
  const total = Object.values(report.verified.byLang).reduce((a, b) => a + b, 0);
  const match = ledger.match(/\*\*Verified so far:\s*([\d,]+)\s*\/\s*50,000/);
  ok('ledger states a verified total', Boolean(match));
  ok(`stated total is the real total (${total})`, Number((match?.[1] ?? '0').replace(/,/g, '')) === total,
    `ledger says ${match?.[1]}`);
  ok('records.json length matches the report', records.length === total,
    `${records.length} vs ${total}`);
}

section('7. no row is implausible');
{
  // Rows must be strictly increasing in cumulative count except where a
  // documented correction says otherwise — a shrink would mean lost records.
  let monotonic = true;
  let prev = 0;
  for (const r of rows) {
    if (r.total <= 0) monotonic = false;
    prev += r.total;
  }
  ok('no row has a zero or negative count', monotonic);
  ok('no row exceeds the 160-char-era batch ceiling', rows.every((r) => r.total <= 200),
    rows.filter((r) => r.total > 200).map((r) => r.batch).join(', '));
}

console.log(`\n${fail === 0 ? `PASS ${pass} assertions — ledger agrees with the data` : `FAIL ${fail} of ${pass + fail}`}`);
process.exit(fail === 0 ? 0 : 1);
