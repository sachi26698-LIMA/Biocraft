/**
 * Sitemap and robots invariants.
 *
 * There was no sitemap on this site while it served 121 routes, and /sitemap.xml
 * returned a 404. It is now generated from the route table by
 * scripts/build-sitemap.mjs. These assertions keep the generated file honest:
 * a sitemap that lists a private route is an information leak, and one that
 * lists a route the app cannot render is worse than no sitemap at all.
 */
import { readFileSync, existsSync } from 'node:fs';

let pass = 0, fail = 0;
const ok = (name, cond, extra = '') => {
  if (cond) { pass++; console.log(`  PASS  ${name}`); }
  else { fail++; console.log(`  FAIL  ${name}${extra ? ' — ' + extra : ''}`); }
};
const section = (t) => console.log(`\n${t}`);

section('1. the generated sitemap exists and parses');
ok('public/sitemap.xml exists', existsSync('public/sitemap.xml'));
const xml = readFileSync('public/sitemap.xml', 'utf8');
ok('declares the sitemap namespace', xml.includes('sitemaps.org/schemas/sitemap/0.9'));

const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
ok('contains at least 100 URLs', locs.length >= 100, `got ${locs.length}`);
ok('every URL is absolute https', locs.every((u) => u.startsWith('https://')), 'relative URL found');
ok('no duplicate URLs', new Set(locs).size === locs.length,
  `${locs.length - new Set(locs).size} duplicates`);

section('2. nothing private is exposed');
const privateUrls = locs.filter((u) => /\/(admin|api)(\/|$)/.test(new URL(u).pathname));
ok('no /admin or /api URLs', privateUrls.length === 0, privateUrls.slice(0, 3).join(', '));

section('3. every listed URL is a route the app renders');
{
  const shells = readFileSync('scripts/build-shells.mjs', 'utf8');
  const shell = readFileSync('src/components/ToolShell.tsx', 'utf8');
  const registry = readFileSync('src/tools/registry.ts', 'utf8');
  const known = new Set([
    ...[...shells.matchAll(/'(\/[a-z0-9/-]*)'/g)].map((m) => m[1]),
    ...[...shell.matchAll(/'(\/[a-z0-9-]+)'/g)].map((m) => m[1]),
    ...[...registry.matchAll(/path: '(\/[a-z0-9-]+)'/g)].map((m) => m[1]),
  ]);
  // Dynamic families: one shell per catalogue entry.
  const catalogue = JSON.parse(readFileSync('src/data/hindi-fonts/catalogue.json', 'utf8'));
  for (const f of catalogue.fonts) known.add(`/hindi-fonts/${f.slug}`);

  const paths = locs.map((u) => new URL(u).pathname);
  const unknown = paths.filter((p) => p !== '/' && !known.has(p));
  ok('no listed URL is missing from the route table', unknown.length === 0, unknown.slice(0, 3).join(', '));
  console.log(`        ${paths.length} listed URLs against ${known.size} known routes`);
}

section('4. the sitemap is complete relative to the catalogue');
{
  const catalogue = JSON.parse(readFileSync('src/data/hindi-fonts/catalogue.json', 'utf8'));
  const paths = new Set(locs.map((u) => new URL(u).pathname));
  const missing = catalogue.fonts.map((f) => `/hindi-fonts/${f.slug}`).filter((p) => !paths.has(p));
  ok(`all ${catalogue.fonts.length} Hindi specimen pages are listed`, missing.length === 0, missing.slice(0, 3).join(', '));
}

section('5. robots.txt advertises the sitemap and still blocks the console');
{
  const robots = readFileSync('public/robots.txt', 'utf8');
  ok('robots.txt points at the sitemap', /Sitemap:\s*https:\/\/\S+\/sitemap\.xml/.test(robots));
  ok('robots.txt still disallows /admin', /Disallow:\s*\/admin\b/.test(robots));
  ok('robots.txt disallows /api/admin', /Disallow:\s*\/api\/admin/.test(robots));
}

console.log(`\n${fail === 0 ? 'PASS' : 'FAIL'} ${pass} assertions — sitemap and robots are consistent`);
process.exit(fail === 0 ? 0 : 1);
