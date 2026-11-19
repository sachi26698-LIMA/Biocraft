/**
 * Regression: bios are bundled, so navigating between collections shows the new
 * collection's own entries immediately — with no request at all.
 *
 * This replaces the earlier test that mocked a remote fetch. The behaviour it
 * guarded (a previous collection's rows leaking into a new route) is now
 * structurally impossible: there is no fetch whose result could arrive late.
 * The test asserts the stronger property directly.
 */
const esbuild = require('esbuild');
const { JSDOM } = require('jsdom');
const assert = require('node:assert/strict');

async function main() {
  const output = await esbuild.build({
    stdin: {
      contents: "export { default as Page } from './src/pages/BioCollectionPage'; export { default as React, act } from 'react'; export { createRoot } from 'react-dom/client';",
      resolveDir: process.cwd(),
      loader: 'tsx',
    },
    bundle: true, write: false, platform: 'node', format: 'cjs', packages: 'external',
  });

  const Module = module.constructor;
  const testModule = new Module(require('path').join(process.cwd(), 'collection-test-bundle.cjs'), module);
  testModule.filename = require('path').join(process.cwd(), 'collection-test-bundle.cjs');
  testModule.paths = module.paths;
  testModule._compile(output.outputFiles[0].text, testModule.filename);
  const { Page, React, act, createRoot } = testModule.exports;

  const dom = new JSDOM('<div id="root"></div>', { url: 'http://localhost/', pretendToBeVisual: true });
  global.window = dom.window; global.document = dom.window.document;
  global.HTMLElement = dom.window.HTMLElement; global.Node = dom.window.Node;
  global.IS_REACT_ACT_ENVIRONMENT = true;

  // Any network attempt at all would be a failure: bios must be local.
  global.__networkCalls = 0;
  const realFetch = global.fetch;
  global.fetch = (...args) => { global.__networkCalls++; return realFetch(...args); };
  dom.window.fetch = global.fetch;

  const root = createRoot(document.getElementById('root'));

  await act(async () => { root.render(React.createElement(Page, { slug: 'instagram-bio-for-boys' })); });
  const boysText = document.body.textContent;
  const boysCards = [...document.querySelectorAll('.bio-grid > li')].map((n) => n.textContent).join('|');
  assert.ok(boysCards.length > 0, 'a real collection must render cards');
  assert.doesNotMatch(boysText, /Checking the live library/, 'no pending-live notice should appear');
  assert.doesNotMatch(boysText, /couldn’t be reached/, 'no error notice should appear');
  assert.doesNotMatch(boysText, /No live bios are available/, 'the bundled collection must never show a dead end');
  assert.match(boysText, /Showing \d+ of \d+ bios/, 'the real count must be shown');

  await act(async () => { root.render(React.createElement(Page, { slug: 'instagram-bio-for-girls' })); });
  const girlsCards = [...document.querySelectorAll('.bio-grid > li')].map((n) => n.textContent).join('|');
  assert.ok(girlsCards.length > 0, 'the next collection must render immediately');
  assert.notEqual(girlsCards, boysCards, 'the new route must show its own entries, not the previous collection');

  // Navigating back must restore the first collection exactly.
  await act(async () => { root.render(React.createElement(Page, { slug: 'instagram-bio-for-boys' })); });
  const boysAgain = [...document.querySelectorAll('.bio-grid > li')].map((n) => n.textContent).join('|');
  assert.equal(boysAgain, boysCards, 'returning to a collection must show the same bundled entries');

  assert.equal(global.__networkCalls, 0, 'rendering a collection must not make any network request');

  await act(async () => root.unmount());
  console.log('PASS collection navigation: bundled entries render per route with zero network requests');
}

main().catch((error) => { console.error(error); process.exit(1); });
