/**
 * The verified bio library must be reachable by clicking, not just by URL.
 *
 * /premium-bios holds the full verified library (8,421 records, 46 categories).
 * It was live and correct for weeks while having NO inbound link anywhere on the
 * site: header, footer, homepage and search all pointed at /bio-library, which is
 * a curated 506-record registry. Visitors could not reach the larger library at
 * all. That is a content-discovery failure that no count-based test would catch,
 * because every count was right.
 *
 * This test enforces two things:
 *   1. At least one navigation surface links to /premium-bios.
 *   2. Every route the site links to is a route the app actually renders.
 *
 * It reads source files rather than a rendered DOM, so it needs no browser and
 * no bundler.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

let pass = 0, fail = 0;
const ok = (name, cond, extra = '') => {
  if (cond) { pass++; console.log(`  PASS  ${name}`); }
  else { fail++; console.log(`  FAIL  ${name}${extra ? ' — ' + extra : ''}`); }
};
const section = (t) => console.log(`\n${t}`);

const read = (p) => readFileSync(p, 'utf8');

/** Navigation surfaces a real visitor can see. */
const SURFACES = [
  'src/components/Header.tsx',
  'src/components/Footer.tsx',
  'src/components/SearchOverlay.tsx',
  'src/pages/BioLibraryPage.tsx',
  'src/pages/BioCollectionsPage.tsx',
  'src/pages/PremiumBiosPage.tsx',
];

section('1. the full verified library has an inbound link');
{
  const linking = SURFACES.filter((f) => {
    try { return /['"`]\/premium-bios/.test(read(f)); } catch { return false; }
  });
  ok('at least one navigation surface links to /premium-bios', linking.length > 0,
    `checked: ${SURFACES.join(', ')}`);
  console.log(`        linking surfaces: ${linking.join(', ') || '(none)'}`);

  // Footer specifically, because it is on every page.
  const footer = read('src/components/Footer.tsx');
  ok('the footer links to /premium-bios (every page carries it)',
    /\/premium-bios/.test(footer));
}

section('2. the curated library points at the full library');
{
  const page = read('src/pages/BioLibraryPage.tsx');
  ok('/bio-library cross-links to /premium-bios', /\/premium-bios/.test(page));
}

section('3. every linked route exists');
{
  // Route table, discovered the same way the shell decides what to render.
  const shell = read('src/components/ToolShell.tsx');
  const shells = read('scripts/build-shells.mjs');
  const known = new Set([
    ...[...shell.matchAll(/'(\/[a-z0-9-]+)'/g)].map((m) => m[1]),
    ...[...shells.matchAll(/'(\/[a-z0-9-]+)'/g)].map((m) => m[1]),
    ...[...read('src/tools/registry.ts').matchAll(/path: '(\/[a-z0-9-]+)'/g)].map((m) => m[1]),
  ]);

  // Links written in the nav surfaces above.
  const linked = new Set();
  for (const f of SURFACES) {
    let src = '';
    try { src = read(f); } catch { continue; }
    for (const m of src.matchAll(/href[:=]\s*\{?['"`](\/[a-z0-9-]+)/g)) linked.add(m[1]);
  }

  const missing = [...linked].filter((p) => p !== '/' && !known.has(p));
  ok('no navigation link points at a route the app cannot render',
    missing.length === 0, missing.join(', '));
  console.log(`        checked ${linked.size} linked routes against ${known.size} known routes`);
}

section('4. the bio data the links promise is actually present');
{
  const records = JSON.parse(read('src/data/bios/records.json'));
  const index = JSON.parse(read('src/data/bios/index.json'));
  ok('verified records are bundled', records.length > 0, `got ${records.length}`);
  ok('the bundled record count matches the reported total',
    records.length === index.total, `${records.length} vs ${index.total}`);

  // The footer label states a number. It must not drift from the data.
  const footer = read('src/components/Footer.tsx');
  const claim = footer.match(/All Verified Bios \(([\d,]+)\)/);
  if (claim) {
    const stated = Number(claim[1].replace(/,/g, ''));
    ok(`the footer's stated count (${stated.toLocaleString()}) matches the bundled data`,
      stated === index.total, `${stated} vs ${index.total}`);
  } else {
    ok('footer states no count that could drift', true);
  }
}

console.log(`\n${fail === 0 ? 'PASS' : 'FAIL'} ${pass} assertions — the verified library is reachable`);
process.exit(fail === 0 ? 0 : 1);
