/**
 * Replaces the old "keyset pagination against the database" test.
 *
 * The collection page no longer pages over the network: every bio of a
 * collection is already in the bundle, so the whole set renders at once and the
 * paging grammar that existed to keep HTTP requests honest has no counterpart.
 *
 * This test asserts the replacement guarantee directly against the shipped
 * registry: a collection renders *all* of its bios (never a truncated first
 * page), and the counts shown to the user are real.
 */
const esbuild = require('esbuild');
const { JSDOM } = require('jsdom');
const assert = require('node:assert/strict');
const path = require('node:path');

async function main() {
  const built = await esbuild.build({
    entryPoints: ['src/lib/bioCollections.ts'],
    bundle: true, write: false, platform: 'node', format: 'cjs',
  });
  const Module = module.constructor;
  const dataModule = new Module(path.join(process.cwd(), 'pagination-data.cjs'), module);
  dataModule.filename = path.join(process.cwd(), 'pagination-data.cjs');
  dataModule.paths = module.paths;
  dataModule._compile(built.outputFiles[0].text, dataModule.filename);
  const { BIO_COLLECTIONS, TOTAL_BIOS, collectionBySlug } = dataModule.exports;

  // Every collection must be complete in the bundle: no page cap, no truncation.
  for (const collection of BIO_COLLECTIONS) {
    assert.ok(collection.bios.length > 0, `${collection.slug} must not be empty`);
    assert.ok(collection.bios.length <= 30, `${collection.slug} unexpectedly large: ${collection.bios.length}`);
  }
  const sum = BIO_COLLECTIONS.reduce((n, c) => n + c.bios.length, 0);
  assert.equal(sum, TOTAL_BIOS, 'per-collection counts must sum to the published total');

  // Render a real page and confirm all of its bios appear at once.
  const output = await esbuild.build({
    stdin: {
      contents: "export { default as Page } from './src/pages/BioCollectionPage'; export { default as React, act } from 'react'; export { createRoot } from 'react-dom/client';",
      resolveDir: process.cwd(), loader: 'tsx',
    },
    bundle: true, write: false, platform: 'node', format: 'cjs', packages: 'external',
  });
  const testModule = new Module(path.join(process.cwd(), 'pagination-page.cjs'), module);
  testModule.filename = path.join(process.cwd(), 'pagination-page.cjs');
  testModule.paths = module.paths;
  testModule._compile(output.outputFiles[0].text, testModule.filename);
  const { Page, React, act, createRoot } = testModule.exports;

  const dom = new JSDOM('<div id="root"></div>', { url: 'http://localhost/', pretendToBeVisual: true });
  global.window = dom.window; global.document = dom.window.document;
  global.HTMLElement = dom.window.HTMLElement; global.Node = dom.window.Node;
  global.IS_REACT_ACT_ENVIRONMENT = true;

  const slug = 'instagram-bio-for-boys';
  const expected = collectionBySlug(slug).bios.length;
  const root = createRoot(document.getElementById('root'));
  await act(async () => { root.render(React.createElement(Page, { slug })); });

  const cards = document.querySelectorAll('.bio-grid > li').length;
  assert.equal(cards, expected, `all ${expected} bios must render, got ${cards}`);
  assert.match(document.body.textContent, new RegExp(`Showing ${expected} of ${expected} bios`),
    'the shown count must be the real total');

  await act(async () => root.unmount());
  console.log(`PASS collection completeness: all ${expected} bios of ${slug} render at once, no truncation`);
}

main().catch((error) => { console.error(error); process.exit(1); });
