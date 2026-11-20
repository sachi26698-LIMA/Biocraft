/**
 * Hindi font ecosystem — is it reachable, or merely published?
 *
 * The 62 Devanagari families were built, HarfBuzz-verified and deployed, and
 * `/hindi-fonts` rendered correctly on production. It still went unnoticed,
 * because "live" and "findable" are different things:
 *
 *   - the header (/resources) listed 13 tools and no Hindi entry at all;
 *   - the global search index had no Hindi fonts, so typing a family name
 *     returned nothing;
 *   - the only inbound links were three footer rows.
 *
 * Each assertion below corresponds to one of those gaps, and each failed before
 * it was fixed. Data-level checks (licences, hashes, HarfBuzz coverage) live in
 * hindi-fonts-catalogue.mjs; this file is about discovery only.
 */
import { readFileSync, existsSync } from 'node:fs';

let pass = 0, fail = 0;
const ok = (name, cond, extra = '') => {
  if (cond) { pass++; console.log(`  PASS  ${name}`); }
  else { fail++; console.log(`  FAIL  ${name}${extra ? ' — ' + extra : ''}`); }
};
const section = (t) => console.log(`\n${t}`);

const catalogue = JSON.parse(readFileSync('src/data/hindi-fonts/catalogue.json', 'utf8'));
const fonts = catalogue.fonts;
const info = readFileSync('src/pages/info.tsx', 'utf8');
const search = readFileSync('src/lib/globalSearch.ts', 'utf8');
const footer = readFileSync('src/components/Footer.tsx', 'utf8');
const sitemap = readFileSync('public/sitemap.xml', 'utf8');

section('1. the catalogue is intact');
ok('62 families are catalogued', fonts.length === 62, `got ${fonts.length}`);
ok('every family is HarfBuzz-verified', fonts.every((f) => f.verification?.status === 'verified'));
ok('every family is OFL-1.1 or otherwise redistributable',
  fonts.every((f) => f.license?.redistribution === true));

section('2. the font files actually exist');
{
  const missing = fonts.filter((f) => !existsSync(`public${f.primaryFile.path}`));
  ok(`all ${fonts.length} primary WOFF2 files are present`, missing.length === 0,
    missing.slice(0, 3).map((f) => f.slug).join(', '));
}

section('3. "All Tools" — the header button target — lists Hindi');
{
  // The header's primary "All Tools" action points at /resources, whose body
  // is defined in info.tsx. This is the page a lost visitor actually opens.
  ok('/resources documents a Hindi fonts section', /Hindi \(Devanagari\) fonts/.test(info));
  for (const href of ['/hindi-fonts', '/hindi-font-studio', '/hindi-poster-studio', '/hindi-font-licenses']) {
    ok(`/resources links to ${href}`, info.includes(`href="${href}"`));
  }
}

section('4. global search indexes the families');
{
  // Assert the wiring, not the literal result, so this keeps working as the
  // index grows: the catalogue must be imported and registered as a domain.
  ok('globalSearch imports the Hindi catalogue', /hindiFonts\/catalogue/.test(search));
  ok('a dedicated hindi-font domain is registered', /['"]hindi-font['"]\s*:/.test(search));
  ok('search hits link to a real specimen page', /hindi-fonts\/\$\{hit\.source_id\}/.test(search));
}

section('5. footer links remain');
for (const href of ['/hindi-fonts', '/hindi-font-studio', '/hindi-poster-studio', '/hindi-font-licenses']) {
  ok(`footer links to ${href}`, footer.includes(`href: '${href}'`));
}

section('6. the library is in the sitemap');
{
  const locs = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname));
  ok('/hindi-fonts is listed', locs.has('/hindi-fonts'));
  const missing = fonts.map((f) => `/hindi-fonts/${f.slug}`).filter((p) => !locs.has(p));
  ok(`all ${fonts.length} specimen pages are listed`, missing.length === 0, missing.slice(0, 3).join(', '));
}

console.log(`\n${fail === 0 ? 'PASS' : 'FAIL'} ${pass} assertions — the Hindi font library is reachable`);
process.exit(fail === 0 ? 0 : 1);
