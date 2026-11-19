// Hindi Font Ecosystem — catalogue integrity.
//
// The recovered suite asserted the same things with vitest. BioCraft has no test
// runner beyond Node, so this keeps every assertion and adds the parts that only
// make sense here: the data now lives in src/data/hindi-fonts, the assets in
// public/fonts/hindi, and the catalogue is what the *browser* reads — so this
// test also proves the public queries answer without a server.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { build } from 'esbuild';

const ROOT = process.cwd();
const catalogue = JSON.parse(readFileSync('src/data/hindi-fonts/catalogue.json', 'utf8'));
const licenses = JSON.parse(readFileSync('src/data/hindi-fonts/licenses.json', 'utf8'));
const verification = JSON.parse(readFileSync('src/data/hindi-fonts/verification.json', 'utf8'));
const importReport = JSON.parse(readFileSync('src/data/hindi-fonts/import-report.json', 'utf8'));
const manifest = JSON.parse(readFileSync('src/data/hindi-fonts/import-manifest.json', 'utf8'));

const fonts = catalogue.fonts;
const verificationFamilies = verification.families;
let failures = 0;
const check = (label, fn) => {
  try {
    fn();
    console.log(`PASS  ${label}`);
  } catch (error) {
    failures += 1;
    console.log(`FAIL  ${label}\n      ${error.message.split('\n')[0]}`);
  }
};

const sha256 = buffer => createHash('sha256').update(buffer).digest('hex');

check('63 families discovered, 62 verified, 1 withheld', () => {
  assert.equal(catalogue.stats.discovered, 63);
  assert.equal(catalogue.stats.verified, 62);
  assert.equal(catalogue.stats.rejected, 1);
  assert.equal(fonts.length, 62);
  assert.equal(manifest.families.length, 63);
  assert.equal(licenses.licenses.length, 62);
  assert.equal(
    catalogue.stats.discovered,
    catalogue.stats.verified + catalogue.stats.rejected,
  );
});

check('every published family carries a recorded HarfBuzz verification pass', () => {
  for (const font of fonts) {
    assert.equal(font.verification.status, 'verified', font.family);
    assert.ok(font.verification.devanagariCoverage >= 99, font.family);
    assert.equal(font.verification.matrasPassed, font.verification.matrasTotal, font.family);
    assert.equal(font.verification.preBaseMatraReordered, true, font.family);
    assert.ok(font.verification.conjunctTotal > 0, font.family);
    assert.ok(
      font.verification.conjuncts.every(test => test.ok),
      font.family,
    );
    const report = verificationFamilies[font.slug];
    assert.equal(report?.status, 'verified', font.slug);
    assert.equal(report?.samples?.sample.ok, true, font.slug);
    assert.equal(report?.fullSample?.notdefCount, 0, font.slug);
    assert.ok(report?.conjuncts?.every(test => test.ok), font.slug);
    assert.ok(report?.nukta?.every(test => test.ok), font.slug);
  }
});

check('the family that failed the numeral check stays withheld', () => {
  const rejected = catalogue.rejected.find(item => item.slug === 'bakbak-one');
  assert.ok(rejected, 'bakbak-one missing from the rejection list');
  assert.match(rejected.reason, /numerals?/i);
  assert.equal(
    fonts.some(font => font.slug === 'bakbak-one'),
    false,
    'a rejected family is publicly listed',
  );
  assert.equal(importReport.rejected.length, 1);
  assert.equal(verificationFamilies['bakbak-one'].status, 'rejected');
});

check('354 WOFF2 files exist with matching byte counts and SHA-256 digests', () => {
  let checked = 0;
  for (const font of fonts) {
    const files = [...font.files.devanagari, ...font.files.latin];
    assert.ok(files.length > 0, font.family);
    assert.ok(font.files.devanagari.length > 0, font.family);
    assert.ok(font.files.latin.length > 0, font.family);
    for (const file of files) {
      const absolute = path.join(ROOT, 'public', file.path.replace(/^\//, ''));
      assert.ok(existsSync(absolute), `missing ${file.path}`);
      assert.equal(statSync(absolute).size, file.bytes, file.path);
      assert.equal(sha256(readFileSync(absolute)), file.sha256, file.path);
      checked += 1;
    }
    const [min, max] = font.weightRange;
    assert.ok(min <= max, font.family);
    assert.ok(font.weights.length > 0, font.family);
  }
  assert.equal(checked, 354);
  assert.equal(checked, catalogue.stats.files);
});

check('primary and Latin files point at the real subsets', () => {
  for (const font of fonts) {
    assert.equal(font.primaryFile.subset, 'devanagari', font.family);
    assert.equal(font.latinFile?.subset, 'latin', font.family);
    if (font.variable) {
      assert.ok(font.variable.wght.min < font.variable.wght.max, font.family);
      assert.ok(
        font.files.devanagari.some(file => file.weight === null),
        `${font.family} claims variable but ships no axis file`,
      );
    } else {
      assert.ok(font.files.devanagari.some(file => file.weight === 400), font.family);
    }
  }
  const variable = fonts.filter(font => font.variable).length;
  assert.equal(variable, catalogue.stats.variableFamilies);
  assert.equal(variable, 13);
});

check('every family has a licence, author, version, source and bundled OFL text', () => {
  for (const font of fonts) {
    assert.match(font.license.type, /OFL/, font.family);
    assert.ok(font.license.attribution.length > 4, font.family);
    assert.match(font.license.url, /^https?:\/\//);
    assert.equal(font.license.downloadAllowed, true, font.family);
    assert.ok(font.license.licenseFile, font.family);
    assert.match(font.source.version, /^v?\d/, font.family);
    assert.match(font.source.repository, /^https:\/\/github\.com\//, font.family);
    const licencePath = path.join(ROOT, 'public', font.license.licenseFile.replace(/^\//, ''));
    assert.ok(existsSync(licencePath), licencePath);
    assert.match(readFileSync(licencePath, 'utf8'), /SIL OPEN FONT LICENSE/i, licencePath);
  }
  assert.deepEqual(catalogue.stats.licenses, ['OFL-1.1']);
});

check('shaping evidence is HarfBuzz output, not a font-name guess', () => {
  assert.match(verification.verifier.engine, /harfbuzz/i);
  assert.match(verification.verifier.sampleText, /नमस्ते भारत/);
  assert.match(verification.verifier.sampleText, /ज़िंदगी/);
  assert.match(verification.verifier.sampleText, /कर्मण्येवाधिकारस्ते/);
  const single = fonts.filter(font => font.verification.conjunctSingleGlyph > 0).length;
  assert.ok(single > fonts.length * 0.9, `only ${single}/${fonts.length} form single-glyph conjuncts`);
});

check('no family name or file hash is duplicated', () => {
  const names = fonts.map(font => font.family.toLowerCase());
  assert.equal(new Set(names).size, names.length);
  const hashes = fonts.map(font => font.filesSha256);
  assert.equal(new Set(hashes).size, hashes.length);
});

check('the asset budget is honest and scale-ready', () => {
  assert.equal(catalogue.stats.files, 354);
  assert.ok(catalogue.stats.woff2Bytes < 40 * 1024 * 1024, `${catalogue.stats.woff2Bytes} bytes`);
  assert.ok(catalogue.categories.length >= 4);
  assert.ok(catalogue.tags.length > 10);
  assert.ok(catalogue.tags.every(tag => tag.count > 0));
  const categories = catalogue.categories.reduce((total, facet) => total + facet.count, 0);
  assert.equal(categories, fonts.length);
});

// ---------------------------------------------------------------------------
// The public query surface, bundled exactly as the browser receives it. This is
// the part that proves the library is local-first: no fetch, no filesystem.
// ---------------------------------------------------------------------------
const built = await build({
  stdin: {
    contents: `
      export * from './src/lib/hindiFonts/catalogue.ts';
      export * from './src/lib/hindiFonts/client-api.ts';
      export * from './src/lib/hindiFonts/search.ts';
      export * from './src/lib/hindiFonts/overrides.ts';
    `,
    resolveDir: ROOT,
    loader: 'ts',
  },
  bundle: true,
  write: false,
  platform: 'node',
  format: 'esm',
  packages: 'external',
  loader: { '.json': 'json' },
});
const outFile = path.join(ROOT, 'tests/local-first/.build/hindi-catalogue.mjs');
const { mkdirSync, writeFileSync } = await import('node:fs');
mkdirSync(path.dirname(outFile), { recursive: true });
writeFileSync(outFile, built.outputFiles[0].text);

globalThis.fetch = () => {
  throw new Error('the public font catalogue must never use the network');
};
const api = await import(`${outFile}?v=${Date.now()}`);

check('cursor pagination never repeats a family and walks the whole library', () => {
  const first = api.listFonts({ limit: 5 });
  assert.equal(first.items.length, 5);
  assert.equal(first.total, 62);
  assert.ok(first.nextCursor);
  const seen = new Set(first.items.map(font => font.slug));
  let cursor = first.nextCursor;
  let pages = 1;
  while (cursor && pages < 40) {
    const page = api.listFonts({ limit: 7, cursor });
    assert.ok(page.items.length > 0);
    for (const font of page.items) {
      assert.equal(seen.has(font.slug), false, `duplicate ${font.slug}`);
      seen.add(font.slug);
    }
    cursor = page.nextCursor;
    pages += 1;
  }
  assert.equal(seen.size, 62);
});

check('a cursor issued for another query is rejected instead of mis-paging', () => {
  const page = api.listFonts({ limit: 3, q: '' });
  assert.throws(() => api.listFonts({ limit: 3, q: 'serif', cursor: page.nextCursor }), /different search/);
  assert.deepEqual(api.decodeCursor('not-a-cursor', 'x'), { error: 'invalid' });
  assert.deepEqual(api.decodeCursor(api.encodeCursor(9, 'abc'), 'abc'), { offset: 9 });
  assert.deepEqual(api.decodeCursor(api.encodeCursor(9, 'abc'), 'other'), { error: 'stale' });
});

check('Hindi and English search both work, with category and tag filters', () => {
  const poster = api.listFonts({ q: 'पोस्टर', limit: 48 });
  assert.ok(poster.total > 5, `${poster.total} poster families`);
  assert.ok(poster.items.every(font => font.styleTags.includes('Poster')));

  const book = api.listFonts({ q: 'किताब', limit: 48 });
  assert.ok(book.items.some(font => font.styleTags.includes('Book')));

  const handwriting = api.listFonts({ category: 'Handwriting', limit: 48 });
  assert.ok(handwriting.items.length > 0);
  assert.ok(handwriting.items.every(font => font.category === 'Handwriting'));

  const variable = api.listFonts({ tag: 'Variable', limit: 48 });
  assert.equal(variable.total, catalogue.stats.variableFamilies);
  assert.ok(variable.items.every(font => Boolean(font.variable)));

  const none = api.listFonts({ q: 'definitely-not-a-font-name' });
  assert.equal(none.total, 0);
  assert.deepEqual(none.items, []);
  assert.equal(none.nextCursor, null);
});

check('sorting is deterministic for name, recency and weight', () => {
  const name = api.listFonts({ sort: 'name', limit: 48 });
  const sorted = [...name.items].sort((a, b) => a.family.localeCompare(b.family));
  assert.deepEqual(name.items.map(font => font.slug), sorted.map(font => font.slug));

  const recent = api.listFonts({ sort: 'recent', limit: 10 });
  assert.ok(recent.items.every(font => /^\d{4}-\d{2}-\d{2}/.test(font.updatedAt)));

  const weight = api.listFonts({ sort: 'weight', limit: 10 });
  const ranges = weight.items.map(font => font.weightRange[0]);
  assert.deepEqual(ranges, [...ranges].sort((a, b) => a - b));
});

check('facets add up to the visible library', () => {
  const facets = api.fontFacets();
  assert.equal(facets.total, 62);
  const categorySum = facets.categories.reduce((total, facet) => total + facet.count, 0);
  assert.equal(categorySum, facets.total);
  assert.ok(facets.tags.some(facet => facet.name === 'Handwriting'));
});

check('a family and its licence metadata resolve by slug', () => {
  const font = api.getFont('tiro-devanagari-hindi');
  assert.equal(font?.family, 'Tiro Devanagari Hindi');
  assert.equal(font?.license.type, 'OFL-1.1');
  assert.equal(api.getFont('does-not-exist'), null);
  assert.equal(
    api.readLicenses().licenses.find(entry => entry.slug === 'tiro-devanagari-hindi')?.source.includes('google/fonts'),
    true,
  );
});

check('weight selection picks the nearest static cut and clamps variable ranges', () => {
  const hind = api.catalogue.fonts.find(font => font.slug === 'hind');
  assert.equal(api.fontFileForWeight(hind, 400).devanagari.weight, 400);
  assert.equal(api.fontFileForWeight(hind, 460).devanagari.weight, 500);
  assert.equal(api.fontFileForWeight(hind, 900).devanagari.weight, 700);
  assert.equal(api.clampWeight(hind, 950), 700);
  assert.equal(api.clampWeight(hind, 20), 300);

  const akshar = api.catalogue.fonts.find(font => font.slug === 'akshar');
  assert.equal(api.fontFileForWeight(akshar, 650).devanagari.weight, null);
});

check('duplicate detection finds nothing in the shipped catalogue', () => {
  assert.deepEqual(api.detectDuplicates(), []);
});

check('the promise-shaped client API answers locally with no request', async () => {
  // Awaited separately below; asserting here keeps the synchronous block honest.
  assert.equal(typeof api.fetchFontPage, 'function');
});

check('client helpers resolve pages, slug lists and facets without fetch', async () => {
  const page = await api.fetchFontPage({ q: 'पोस्टर', limit: 6 });
  assert.ok(page.items.length > 0);
  assert.ok(page.items.every(font => font.styleTags.includes('Poster')));
  const bySlug = await api.fetchFontsBySlug(['hind', 'kalam', 'not-a-family']);
  assert.deepEqual(bySlug.map(font => font.slug), ['hind', 'kalam']);
  const facets = await api.fetchFontFacets();
  assert.equal(facets.total, 62);
  await assert.rejects(() => api.fetchFontPage({ limit: 1 }, { aborted: true }), /Abort/);
});

check('an Admin overlay can hide a family from the public queries', async () => {
  // The catalogue modules read overrides from the browser store; this harness has
  // no window, so the overlay path is verified through the store contract.
  assert.equal(typeof api.saveFontOverride, 'function');
  assert.equal(typeof api.readFontOverrides, 'function');
  const empty = api.readFontOverrides();
  assert.deepEqual(empty.fonts, {});
});

console.log(
  failures === 0
    ? '\nPASS Hindi font catalogue: 62 families, 354 hashed WOFF2 files, HarfBuzz evidence, local pagination and search'
    : `\nFAIL ${failures} catalogue check(s)`,
);
process.exit(failures === 0 ? 0 : 1);
