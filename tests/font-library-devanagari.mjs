/**
 * /font-library — can a Hindi visitor actually find Devanagari fonts?
 *
 * The 1,908-family Google Fonts catalogue has always contained all 62 Devanagari
 * families. They were still unreachable, because the only way to narrow the list
 * was a style chip (sans-serif, serif, display, handwriting, monospace) or a
 * search box that matched the family *name* only:
 *
 *   search "hindi"      -> 1 result
 *   search "devanagari" -> 7 results
 *
 * Both are wrong answers to the question "which of these fonts can set Hindi?".
 * Every Devanagari family is a perfectly ordinary sans-serif, serif or display
 * face, so the style chips scatter them across the catalogue and no chip
 * gathers them. These assertions pin the fix.
 *
 * This file tests the data layer in src/lib/libraryApi.ts. The chip wiring is
 * checked separately by asserting the page imports and renders it.
 */
import { readFileSync, writeFileSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

let pass = 0, fail = 0;
const ok = (name, cond, extra = '') => {
  if (cond) { pass++; console.log(`  PASS  ${name}`); }
  else { fail++; console.log(`  FAIL  ${name}${extra ? ' — ' + extra : ''}`); }
};
const section = (t) => console.log(`\n${t}`);

// ---- Real query results, executed through tsx against the actual module ----
// Written to a temp file rather than passed with -e: top-level await is
// unsupported in esbuild's cjs output, and a silent SKIP here would skip the
// assertions that matter most.
const probeFile = 'tests/.tmp-font-library-probe.mjs';
const probe = `
import { fetchFontPage, DEVANAGARI_CATEGORY } from '../src/lib/libraryApi.ts';
const count = async (o) => { const r = await fetchFontPage({ ...o, limit: 500 }); return r.ok ? r.rows.length : -1; };
const out = {};
out.chip = await count({ category: DEVANAGARI_CATEGORY });
out.hindi = await count({ search: 'hindi' });
out.hindiNative = await count({ search: 'हिंदी' });
out.devanagariNative = await count({ search: 'देवनागरी' });
out.devanagari = await count({ search: 'Devanagari' });
out.serif = await count({ category: 'serif' });
out.mukta = await count({ search: 'Mukta' });
console.log(JSON.stringify(out));
`;
writeFileSync(probeFile, probe);

section('1. the data layer answers "which fonts can set Hindi?"');
let r = {};
try {
  const raw = execFileSync('npx', ['tsx', probeFile], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  r = JSON.parse(raw.trim().split('\n').filter(Boolean).pop());
} catch (err) {
  // Not a silent skip: the data assertions below are the point of this file.
  fail++;
  console.log(`  FAIL  the data layer could not be executed — ${String(err).slice(0, 120)}`);
} finally {
  rmSync(probeFile, { force: true });
}

if (Object.keys(r).length) {
  const EXPECTED = 62;
  ok(`script chip returns all ${EXPECTED} Devanagari families`, r.chip === EXPECTED, `got ${r.chip}`);
  ok('search "hindi" finds them', r.hindi === EXPECTED, `got ${r.hindi}`);
  ok('search "हिंदी" finds them', r.hindiNative === EXPECTED, `got ${r.hindiNative}`);
  ok('search "देवनागरी" finds them', r.devanagariNative === EXPECTED, `got ${r.devanagariNative}`);
  ok('search "Devanagari" finds them', r.devanagari === EXPECTED, `got ${r.devanagari}`);

  // The fix must not disturb the style chips or name matching.
  ok('style chip "serif" still returns its own set', r.serif > 0 && r.serif !== EXPECTED, `got ${r.serif}`);
  ok('name search "Mukta" still works', r.mukta >= 1 && r.mukta < 20, `got ${r.mukta}`);
}

section('2. the chip is wired into the page');
{
  const page = readFileSync('src/pages/FontLibraryPage.tsx', 'utf8');
  ok('page imports DEVANAGARI_CATEGORY', /DEVANAGARI_CATEGORY/.test(page));
  ok('page renders a script chip', /fontlib-chip-script/.test(page));
  ok('chip label is bilingual', /हिन्दी/.test(page) || /हिन्दी/.test(readFileSync('src/lib/libraryApi.ts', 'utf8')));
  ok('page links through to the self-hosted Hindi library', /href="\/hindi-fonts"/.test(page));
}

section('3. the two font libraries are distinguishable to a visitor');
{
  const api = readFileSync('src/lib/libraryApi.ts', 'utf8');
  ok('script filter is separate from style categories', /DEVANAGARI_CATEGORY/.test(api));
  ok('language-word aliases are explicit, not guessed', /हिंदी/.test(api));
}

console.log(`\n${fail === 0 ? 'PASS' : 'FAIL'} ${pass} assertions — Devanagari fonts are findable in /font-library`);
process.exit(fail === 0 ? 0 : 1);
