/**
 * Admin bio-library dashboard test.
 *
 * Renders the real dashboard component in JSDOM with the real bundled library
 * and asserts the numbers on screen match the data on disk — the whole point of
 * a validation dashboard is that it cannot flatter the library.
 */
import { build } from 'esbuild';
import { JSDOM } from 'jsdom';
import assert from 'node:assert/strict';
import path from 'node:path';
import { createRequire } from 'node:module';
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { webcrypto } from 'node:crypto';

let pass = 0, fail = 0;
const ok = (name, cond, extra = '') => {
  if (cond) { pass++; console.log(`  PASS  ${name}`); }
  else { fail++; console.log(`  FAIL  ${name}${extra ? ' — ' + extra : ''}`); }
};
const section = (t) => console.log(`\n${t}`);

const records = JSON.parse(readFileSync('src/data/bios/records.json', 'utf8'));
const index = JSON.parse(readFileSync('src/data/bios/index.json', 'utf8'));

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: 'https://biocraft.test/admin/bio-library' });
global.window = dom.window;
global.document = dom.window.document;
Object.defineProperty(global, 'navigator', { value: dom.window.navigator, configurable: true, writable: true });
global.HTMLElement = dom.window.HTMLElement;
global.Event = dom.window.Event;
global.Blob = dom.window.Blob;
global.URL = dom.window.URL;
global.TextEncoder = TextEncoder;
// Web Crypto so the SHA-256 path (not the fallback) is exercised.
// JSDOM exposes crypto as a getter; redefine it so subtle.digest is real.
Object.defineProperty(dom.window, 'crypto', { value: webcrypto, configurable: true });
Object.defineProperty(global, 'crypto', { value: webcrypto, configurable: true });
class RO { observe() {} unobserve() {} disconnect() {} }
global.ResizeObserver = RO;
dom.window.ResizeObserver = RO;

const require = createRequire(import.meta.url);
const outDir = path.join(process.cwd(), 'tests/local-first/.build');
mkdirSync(outDir, { recursive: true });

const built = await build({
  stdin: {
    contents: `import D from ${JSON.stringify(path.resolve('src/admin/live/BioLibrary.tsx'))};
      import r from ${JSON.stringify(path.resolve('src/data/bios/records.json'))};
      import i from ${JSON.stringify(path.resolve('src/data/bios/index.json'))};
      export default D; export const records = r; export const index = i;`,
    resolveDir: process.cwd(), loader: 'tsx',
  },
  bundle: true, write: false, platform: 'node', format: 'cjs', packages: 'external', loader: { '.css': 'empty' },
});
const outFile = path.join(outDir, 'bio-admin-dashboard.cjs');
writeFileSync(outFile, built.outputFiles[0].text);
const mod = require(outFile);

const React = require('react');
const { act } = require('react');
const { createRoot } = require('react-dom/client');
global.IS_REACT_ACT_ENVIRONMENT = true;

const root = createRoot(document.getElementById('root'));
await act(async () => {
  root.render(React.createElement(mod.default, { records: mod.records, index: mod.index }));
});
// The duplicate scan is async — one SHA-256 digest per record — so it cannot be
// waited out with a fixed sleep. At 8,300 records a 600 ms sleep was sometimes
// too short, and the "scan finished" assertion below could not catch that
// because the progress text is comma-formatted ('Scanning 8,311 records…') and
// /\d+/ does not match through the comma. So: poll until the panel leaves the
// scanning state, and treat a timeout as a hard failure rather than guessing.
const SCAN_TIMEOUT_MS = 20_000;
const scanDeadline = Date.now() + SCAN_TIMEOUT_MS;
let scanFinished = false;
while (Date.now() < scanDeadline) {
  await act(async () => { await new Promise((r) => setTimeout(r, 100)); });
  const t = document.body.textContent ?? '';
  if (!/Scanning [\d,]+ records/.test(t)) { scanFinished = true; break; }
}
if (!scanFinished) throw new Error(`duplicate scan did not finish within ${SCAN_TIMEOUT_MS} ms`);

section('1. dashboard reports the true counts');
{
  const text = document.body.textContent ?? '';
  ok('shows the verified total', text.includes(index.total.toLocaleString()), `looking for ${index.total}`);
  ok('shows the 50,000 target', text.includes('50,000'));
  ok('shows the exact remaining count', text.includes(index.shortfall.total.toLocaleString()));
  ok('shows per-language counts',
    text.includes(index.byLang.en.toLocaleString()) &&
    text.includes(index.byLang.hi.toLocaleString()) &&
    text.includes(index.byLang.hg.toLocaleString()));
}

section('2. incompleteness is stated, not hidden');
{
  const text = document.body.textContent ?? '';
  ok('renders an explicit incompleteness banner', /still to be\s+written/i.test(text), 'no banner');
  ok('does not claim completion', !/library is complete/i.test(text));
}

section('3. duplicate scan runs against real data');
{
  const text = document.body.textContent ?? '';
  // Comma-formatted on purpose: the old /\d+/ here silently matched nothing once
  // the count passed a thousand, which made this assertion vacuous.
  ok('scan finished (not still running)', !/Scanning [\d,]+ records/.test(text), 'still scanning');
  ok('reports no duplicates for a clean library', /No duplicate fingerprints/i.test(text));
}

section('4. language validation panel');
{
  const text = document.body.textContent ?? '';
  ok('states all records match language and script', /All .* records match their declared language/i.test(text));
}

section('5. category table');
{
  const rows = document.querySelectorAll('.ad-table tbody tr');
  ok('lists exactly the populated categories', rows.length === Object.keys(index.byCategory).length,
    `${rows.length} vs ${Object.keys(index.byCategory).length}`);
  const first = rows[0]?.textContent ?? '';
  const top = Object.entries(index.byCategory).sort((a, b) => b[1] - a[1])[0];
  ok('top row is the largest category', first.includes(top[0]), `${first} vs ${top[0]}`);
}

section('6. export controls exist and are functional');
{
  const buttons = [...document.querySelectorAll('.ad-btn')];
  ok('has an export-library button', buttons.some((b) => /Export library JSON/i.test(b.textContent ?? '')));
  ok('has an export-report button', buttons.some((b) => /Export validation report/i.test(b.textContent ?? '')));
  ok('export button shows the live count', buttons.some((b) => (b.textContent ?? '').includes(index.total.toLocaleString())));
  ok('has a file-validation control', !!document.querySelector('input[type="file"]'));
}

section('7. no false import claim');
{
  const text = document.body.textContent ?? '';
  ok('states no upload or database write occurs', /no upload|No upload/i.test(text));
  ok('does not promise to mutate the library', !/import complete|imported \d+|published/i.test(text));
}

section('8. duplicate scan actually catches a planted duplicate');
{
  // Same text twice, differing only in punctuation/emoji: must be flagged.
  const planted = [
    ['dup-1', 'Quiet confidence, loud results, zero noise.', 'en', 'Attitude', 'Boundaries', 'Bold', ['x'], 'Latin', 44, ['instagram'], '2026-11-09', 'biocraft-original', 'f1'],
    ['dup-2', 'Quiet confidence — loud results... zero noise!! 🔥', 'en', 'Attitude', 'Boundaries', 'Bold', ['x'], 'Latin', 44, ['instagram'], '2026-11-09', 'biocraft-original', 'f2'],
    ['clean-3', 'An entirely different sentence about patience.', 'en', 'Life and reality', 'Habit', 'Calm', ['y'], 'Latin', 48, ['instagram'], '2026-11-09', 'biocraft-original', 'f3'],
  ];
  const host = document.createElement('div');
  document.body.appendChild(host);
  const r2 = createRoot(host);
  await act(async () => {
    r2.render(React.createElement(mod.default, { records: planted, index: { ...index, total: 3 } }));
  });
  await act(async () => { await new Promise((r) => setTimeout(r, 400)); });
  const text = host.textContent ?? '';
  ok('flags the planted duplicate pair', /2 records share a fingerprint/i.test(text), 'not flagged');
  ok('names both duplicate ids', text.includes('dup-1') && text.includes('dup-2'));
  ok('does not flag the distinct record', !text.includes('clean-3'));
  ok('does not claim a clean library', !/No duplicate fingerprints/i.test(text));
  await act(async () => r2.unmount());
  host.remove();
}

section('9. file validator rejects bad records instead of counting them');
{
  const good = { text: 'Steady hands, steady work, steady results.', lang: 'en', category: 'Attitude' };
  const bad = [
    { text: good.text, lang: 'en', category: 'Attitude' },                    // duplicate of the first
    { text: 'Not actually Hindi at all here.', lang: 'hi', category: 'Attitude' }, // wrong script
    { text: 'x'.repeat(200), lang: 'en', category: 'Attitude' },              // too long
    { text: 'Fine words but wrong drawer.', lang: 'en', category: 'Nonsense' }, // unknown category
  ];
  const payload = JSON.stringify([good, ...bad]);
  const file = new dom.window.File([payload], 'batch.json', { type: 'application/json' });
  const input = document.querySelector('input[type="file"]');
  Object.defineProperty(input, 'files', { value: [file], configurable: true });
  await act(async () => { input.dispatchEvent(new dom.window.Event('change', { bubbles: true })); });
  await act(async () => { await new Promise((r) => setTimeout(r, 300)); });

  const text = document.body.textContent ?? '';
  ok('accepts only the one valid record', /1 records would pass/.test(text), text.match(/\d+ records would pass/)?.[0] ?? 'no count');
  ok('rejects the duplicate', /duplicate within file/i.test(text));
  ok('rejects the fake-Hindi record', /no Devanagari/i.test(text));
  ok('rejects the over-long record', /too long/i.test(text));
  ok('rejects the unknown category', /unknown category/i.test(text));
  ok('does not claim it imported anything', !/imported|import complete/i.test(text));
}

await act(async () => root.unmount());
console.log(`\n${fail === 0 ? `PASS ${pass} assertions — admin dashboard reports the truth` : `FAIL ${fail} of ${pass + fail}`}`);
process.exit(fail === 0 ? 0 : 1);
