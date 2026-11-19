// Hindi Font Ecosystem — the browser loader and the Admin pre-flight inspector.
//
// Two things are being proved here, and neither can be proved by reading data:
//
//  1. the on-demand loader registers one weight for one family, applies the
//     family only after the file is ready, and never downloads all 62 families;
//  2. fontkit decodes a real WOFF2, shapes Hindi, and fails closed on a Latin-only
//     font or a non-font payload — the Admin's pre-flight must not trust a file
//     extension.
//
// The loader runs against a jsdom document with a fake FontFace, exactly as the
// recovered vitest suite did; the inspector runs on the real binaries in public/.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';
import { build } from 'esbuild';

const ROOT = process.cwd();
const catalogue = JSON.parse(readFileSync('src/data/hindi-fonts/catalogue.json', 'utf8'));
const font = catalogue.fonts.find(entry => entry.slug === 'hind');
const variableFont = catalogue.fonts.find(entry => entry.slug === 'akshar');

const dom = new JSDOM('<div id="root"></div>', { url: 'http://localhost/', pretendToBeVisual: true });
global.window = dom.window;
global.document = dom.window.document;
global.CustomEvent = dom.window.CustomEvent;

// --- fake FontFace, so "loaded" means the loader awaited the face ----------
const faces = [];
let failNext = false;
class MockFontFace {
  constructor(family, source, descriptors = {}) {
    this.family = family;
    this.source = source;
    this.descriptors = descriptors;
    this.status = 'unloaded';
    this.loaded = false;
    faces.push(this);
  }
  load() {
    if (failNext) {
      failNext = false;
      this.status = 'error';
      return Promise.reject(new Error('network'));
    }
    this.status = 'loaded';
    this.loaded = true;
    return Promise.resolve(this);
  }
}
global.FontFace = MockFontFace;
const cssLoads = [];
Object.defineProperty(dom.window.document, 'fonts', {
  configurable: true,
  value: {
    add: () => {},
    load: (...args) => {
      cssLoads.push(args[0]);
      return Promise.resolve([]);
    },
    check: () => true,
    ready: Promise.resolve(),
  },
});

const built = await build({
  stdin: {
    contents: `
      export * from './src/lib/hindiFonts/loader.ts';
      export * from './src/lib/hindiFonts/inspect.ts';
      export * from './src/lib/hindiFonts/import-queue.ts';
      export * from './src/lib/hindiFonts/studio-content.ts';
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
const outFile = path.join(ROOT, 'tests/local-first/.build/hindi-runtime.mjs');
const { mkdirSync, writeFileSync } = await import('node:fs');
mkdirSync(path.dirname(outFile), { recursive: true });
writeFileSync(outFile, built.outputFiles[0].text);
const api = await import(`${outFile}?v=${Date.now()}`);

let failures = 0;
const check = async (label, fn) => {
  try {
    await fn();
    console.log(`PASS  ${label}`);
  } catch (error) {
    failures += 1;
    console.log(`FAIL  ${label}\n      ${error.message.split('\n')[0]}`);
  }
};

await check('registers and awaits only the requested Devanagari weight', async () => {
  const state = [];
  api.subscribeFontState((slug, value) => state.push([slug, value]));
  const ok = await api.loadFont(font, 500);
  assert.equal(ok, true);
  assert.equal(api.fontFamilyName('hind'), 'BioCraft Hindi hind');
  assert.equal(faces.length, 1, `registered ${faces.length} faces for one weight`);
  const face = faces[0];
  assert.match(face.source, /\/fonts\/hindi\/hind\/devanagari-500\.woff2/);
  assert.equal(face.loaded, true);
  assert.match(face.descriptors.unicodeRange, /U\+0900-097F/);
  assert.equal(face.descriptors.display, 'swap');
  assert.deepEqual(state, [['hind', 'loading'], ['hind', 'loaded']]);
  assert.equal(api.fontLoadState('hind'), 'loaded');
});

await check('the Latin subset is registered with unicode-range, never preloaded', async () => {
  assert.equal(api.containsLatin('नमस्ते'), false);
  assert.equal(api.containsLatin('नमस्ते BioCraft'), true);
  faces.length = 0;
  await api.loadFont(font, 400, { latin: true });
  const latin = faces.find(face => face.source.includes('latin'));
  assert.ok(latin, 'no Latin face was registered');
  assert.equal(latin.loaded, false, 'the Latin file was eagerly downloaded');
  assert.match(latin.descriptors.unicodeRange, /U\+0000-00FF/);
});

await check('the variable range descriptor is used for variable families', async () => {
  faces.length = 0;
  await api.loadFont(variableFont, 650);
  const face = faces.find(entry => entry.source.includes('devanagari'));
  assert.equal(face.descriptors.weight, `${variableFont.variable.wght.min} ${variableFont.variable.wght.max}`);
  assert.match(face.source, /\/fonts\/hindi\/akshar\/devanagari\.woff2/);
});

await check('in-flight work is deduplicated and a failure is retried', async () => {
  // A weight this suite has not touched yet, so "one face per weight" is a real
  // assertion rather than a leftover from an earlier check.
  const weight = 600;
  faces.length = 0;
  failNext = true;
  assert.equal(await api.loadFont(font, weight), false);
  assert.equal(api.fontLoadState('hind'), 'error');
  assert.equal(await api.loadFont(font, weight), true);
  assert.equal(await api.loadFont(font, weight), true);
  const before = faces.length;
  await Promise.all([
    api.loadFont(font, weight),
    api.loadFont(font, weight),
    api.loadFont(font, weight),
  ]);
  assert.equal(faces.length, before, 'duplicate requests registered extra faces');
  // One face per weight is the contract: the retry reuses the registered face
  // (re-loading it) instead of piling up duplicates, and it re-attempts the load
  // through the CSS Font Loading API rather than caching the failure.
  assert.equal(faces.length, 1, `expected one face for one weight, got ${faces.length}`);
  // Exactly one CSS load: the retry after the failure, and nothing after it —
  // every later call reused the resolved promise.
  assert.equal(cssLoads.length, 1, `expected the retry to load once, saw ${cssLoads.length}`);
});

await check('Admin pre-flight passes a real verified Devanagari WOFF2', async () => {
  const buffer = readFileSync(path.join(ROOT, 'public/fonts/hindi/noto-sans-devanagari/devanagari.woff2'));
  const report = api.inspectFontBuffer(buffer, 'NotoSansDevanagari.woff2', 'a'.repeat(64));
  assert.notEqual(report.status, 'fail');
  assert.equal(report.family, 'Noto Sans Devanagari');
  assert.ok(report.checks.devanagariCoverage >= 99);
  assert.ok(report.checks.conjunctsSingleGlyph > 3);
  assert.equal(report.checks.numeralsRendered, 10);
  assert.equal(report.checks.matrasRendered, 8);
  assert.ok(report.variableAxes.wght, 'the wght axis was not detected');
  assert.equal(report.sha256, 'a'.repeat(64));
  assert.ok(report.bytes > 1000);
});

await check('Admin pre-flight rejects a Latin-only font with a coverage error', async () => {
  const buffer = readFileSync(path.join(ROOT, 'public/fonts/noto-math/noto-sans-math-latin-400-normal.woff2'));
  const report = api.inspectFontBuffer(buffer, 'Geist.woff2');
  assert.equal(report.status, 'fail');
  assert.ok(report.issues.some(issue => issue.code === 'devanagari_coverage'));
  assert.ok(report.checks.devanagariCoverage < 10);
});

await check('Admin pre-flight rejects a non-font payload instead of trusting the extension', async () => {
  const report = api.inspectFontBuffer(Buffer.from('not a font'), 'fake.woff2');
  assert.equal(report.status, 'fail');
  assert.equal(report.issues[0].code, 'decode_failed');
  assert.equal(report.glyphCount, 0);
});

await check('Admin pre-flight suggests a safe publish slug', async () => {
  const buffer = readFileSync(path.join(ROOT, 'public/fonts/hindi/kalam/devanagari-400.woff2'));
  const report = api.inspectFontBuffer(buffer, 'Kalam.woff2');
  assert.match(report.suggestedTheme.slug, /^[a-z0-9-]+$/);
  assert.ok(report.suggestedTheme.slug.length <= 64);
});

await check('the browser import queue stores metadata only and never a binary', async () => {
  const buffer = readFileSync(path.join(ROOT, 'public/fonts/hindi/kalam/devanagari-400.woff2'));
  const report = api.inspectFontBuffer(buffer, 'Kalam.woff2', 'b'.repeat(64));
  const staged = api.stageImport('Kalam.woff2', report);
  assert.equal(staged.persisted, true);
  assert.equal(staged.item.storedFile, null);
  assert.equal(staged.item.status, 'pending');
  const stored = dom.window.localStorage.getItem('biocraft.hindiFonts.queue.v1');
  assert.ok(stored.includes('Kalam.woff2'));
  assert.ok(!stored.includes('wOF2'), 'the font binary leaked into localStorage');
  const approved = api.setStagedStatus(staged.item.id, 'approved');
  assert.equal(approved.items[0].status, 'approved');
  const removed = api.removeStagedImport(staged.item.id);
  assert.equal(removed.items.length, 0);
});

await check('studio content is real Hindi copy and generates deterministically', async () => {
  const { BIO_LIBRARY, VIBES, SHAYARI, QUOTES, CAPTIONS, STYLISH_LATIN, generateBios, generateShayari, generateUsernames, stylishVariants } = api;
  const DEVANAGARI = /[\u0900-\u097F]/;
  for (const item of BIO_LIBRARY) {
    assert.ok(DEVANAGARI.test(item.text), item.text);
    assert.ok(VIBES.includes(item.vibe));
  }
  for (const item of SHAYARI) {
    assert.ok(DEVANAGARI.test(item.lines[0]));
    assert.ok(DEVANAGARI.test(item.lines[1]));
  }
  assert.ok(QUOTES.every(quote => DEVANAGARI.test(quote.text)));
  assert.ok(CAPTIONS.every(caption => DEVANAGARI.test(caption.text) && caption.tags.every(tag => tag.startsWith('#'))));

  const plain = generateBios('Attitude', 'सचिन', false);
  assert.ok(plain.length > 0);
  assert.ok(plain.every(bio => bio.includes('सचिन')));
  assert.ok(plain.every(bio => !/[\u{1F300}-\u{1FAFF}]/u.test(bio)));
  const decorated = generateBios('Love', 'सचिन', true);
  assert.deepEqual(generateBios('Love', 'सचिन', true), decorated);
  assert.ok(generateBios('Minimal', '   ', false).every(bio => bio.includes('आपका नाम')));

  for (const mood of VIBES) {
    const lines = generateShayari(mood, 1);
    assert.ok(lines.length > 2);
    assert.ok(lines.every(line => line.split('\n').length === 2 && DEVANAGARI.test(line)));
  }
  assert.notDeepEqual(generateShayari('Love', 1), generateShayari('Love', 2));

  const handles = generateUsernames('Sachin Kumar');
  assert.ok(handles.length > 8);
  assert.equal(new Set(handles).size, handles.length);
  for (const handle of handles) assert.match(handle, /^[a-z0-9._]{4,30}$/);
  assert.ok(generateUsernames('!!!').includes('biocraft.hindi'));

  const variants = stylishVariants('Bio 2026 हिंदी');
  assert.equal(variants.length, STYLISH_LATIN.length);
  for (const variant of variants) {
    assert.ok(variant.value.includes('हिंदी'));
    assert.notEqual(variant.value, 'Bio 2026 हिंदी');
    assert.equal([...variant.value].length, [...'Bio 2026 हिंदी'].length);
  }
});

console.log(
  failures === 0
    ? '\nPASS Hindi runtime: one-weight loader, Latin-only-when-needed, failure retry, fontkit pre-flight and device-local staging'
    : `\nFAIL ${failures} runtime check(s)`,
);
process.exit(failures === 0 ? 0 : 1);
