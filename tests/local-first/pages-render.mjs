/**
 * Phase 6: every public page renders with the database unreachable and no
 * database configuration, and makes zero network requests while doing it.
 *
 * This is a real render of the shipped source (bundled by esbuild, mounted into
 * jsdom with React's act), not a check of the HTML shell. jsdom does not execute
 * ES modules, so booting dist/index.html would prove nothing — this mounts the
 * actual page components instead.
 */
import { build } from 'esbuild';
import { JSDOM } from 'jsdom';
import assert from 'node:assert/strict';
import path from 'node:path';
import { createRequire } from 'node:module';
import { writeFileSync, mkdirSync } from 'node:fs';

const PAGES = [
  ['BioCollectionPage', 'src/pages/BioCollectionPage.tsx', { slug: 'instagram-bio-for-boys' }],
  ['BioCollectionsPage', 'src/pages/BioCollectionsPage.tsx', {}],
  ['HomePage', 'src/pages/HomePage.tsx', {}],
  ['CategoriesPage', 'src/pages/CategoriesPage.tsx', {}],
  ['FeaturesPage', 'src/pages/FeaturesPage.tsx', {}],
  ['GlobalSearchPage', 'src/pages/GlobalSearchPage.tsx', {}],
  ['FontLibraryPage', 'src/pages/FontLibraryPage.tsx', {}],
  // Hindi Font Ecosystem — every public Hindi route must render from the bundled
  // catalogue. The specimen route receives its slug the way ToolShell passes it.
  ['HindiFontsPage', 'src/pages/HindiFontsPage.tsx', {}],
  ['HindiFontSpecimenPage', 'src/pages/HindiFontSpecimenPage.tsx', { slug: 'tiro-devanagari-hindi' }],
  ['HindiFontSpecimenNotFound', 'src/pages/HindiFontSpecimenPage.tsx', { slug: 'no-such-family' }],
  ['HindiFontStudioPage', 'src/pages/HindiFontStudioPage.tsx', {}],
  ['HindiPosterStudioPage', 'src/pages/HindiPosterStudioPage.tsx', {}],
  ['HindiFontLicensesPage', 'src/pages/HindiFontLicensesPage.tsx', {}],
];

// Pages that consume shared state need the real providers the app uses, so the
// test mounts the same context tree rather than a stripped-down page.
const jsxCtx = (page) =>
  `export { default as Page } from './${page}';
   export { default as React, act } from 'react';
   export { createRoot } from 'react-dom/client';
   export { ToolkitProvider } from './src/lib/toolkit';
   export { ToolModeProvider } from './src/lib/toolMode';
   export { default as Toaster } from './src/components/Toaster';`;

const dom = new JSDOM('<div id="root"></div>', { url: 'http://localhost/', pretendToBeVisual: true });
global.window = dom.window;
global.document = dom.window.document;
global.HTMLElement = dom.window.HTMLElement;
global.Node = dom.window.Node;
// navigator is a getter-only global in this Node version; jsdom's is not needed.
global.IS_REACT_ACT_ENVIRONMENT = true;
// jsdom lacks matchMedia and IntersectionObserver; the app uses both for
// responsive layout and scroll effects. Provide inert real-shaped stand-ins.
dom.window.matchMedia = (query) => ({
  matches: false, media: query, onchange: null,
  addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent() { return false; },
});
global.matchMedia = dom.window.matchMedia;
class IO { constructor(cb) { this.cb = cb; } observe() {} unobserve() {} disconnect() {} takeRecords() { return []; } }
dom.window.IntersectionObserver = IO;
global.IntersectionObserver = IO;
class RO { constructor(cb) { this.cb = cb; } observe() {} unobserve() {} disconnect() {} }
dom.window.ResizeObserver = RO;
global.ResizeObserver = RO;
dom.window.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0);
dom.window.cancelAnimationFrame = (id) => clearTimeout(id);
dom.window.scrollTo = () => {};
dom.window.HTMLElement.prototype.scrollIntoView = () => {};

// Any attempt to reach the network is recorded and refused.
let networkCalls = [];
const refuse = (input) => {
  networkCalls.push(String(input?.url ?? input));
  return Promise.reject(new Error('network blocked'));
};
global.fetch = refuse;
dom.window.fetch = refuse;

const require = createRequire(import.meta.url);
let failures = 0;

for (const [name, file, props] of PAGES) {
  networkCalls = [];
  const built = await build({
    stdin: { contents: jsxCtx(file), resolveDir: process.cwd(), loader: 'tsx' },
    bundle: true, write: false, platform: 'node', format: 'cjs', packages: 'external',
  });
  // Write the real bundle to disk and require it: Node 22 cannot _compile a
  // multi-line bundle through the legacy wrapper reliably, and a genuine require
  // is closer to what the browser does anyway.
  const outDir = path.join(process.cwd(), 'tests/local-first/.build');
  mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, `${name}.cjs`);
  writeFileSync(outFile, built.outputFiles[0].text);
  delete require.cache[outFile];
  const { Page, React, act, createRoot, ToolkitProvider, ToolModeProvider, Toaster } = require(outFile);

  document.body.innerHTML = '<div id="root"></div>';
  const root = createRoot(document.getElementById('root'));
  await act(async () => {
    root.render(React.createElement(ToolkitProvider, null,
      React.createElement(ToolModeProvider, null,
        React.createElement(Page, props),
        React.createElement(Toaster))));
  });
  await act(async () => { await new Promise((r) => setTimeout(r, 300)); });

  const text = document.body.textContent ?? '';
  const cards = document.querySelectorAll('li, article, .bio-card, .fontlib-card, .gsearch-item').length;

  try {
    assert.ok(text.length > 200, `rendered almost nothing (${text.length} chars)`);
    assert.doesNotMatch(text, /not connected in this environment/i, 'showed a not-connected state');
    assert.doesNotMatch(text, /couldn’t be reached/i, 'showed an unreachable state');
    assert.doesNotMatch(text, /Checking the live library/i, 'showed a live-library pending state');
    assert.doesNotMatch(text, /No live bios are available/i, 'showed the empty-live state');
    assert.equal(networkCalls.length, 0, `made ${networkCalls.length} network call(s): ${networkCalls.slice(0,3).join(', ')}`);
    console.log(`PASS ${name.padEnd(26)} rendered ${String(text.length).padStart(6)} chars, ${String(cards).padStart(3)} nodes, 0 network calls`);
  } catch (error) {
    failures++;
    console.log(`FAIL ${name.padEnd(26)} ${error.message}`);
  }

  await act(async () => root.unmount());
}

console.log(failures === 0
  ? `\nPASS all ${PAGES.length} public pages render with no database and no network`
  : `\nFAIL ${failures} page(s) did not render cleanly`);
process.exit(failures === 0 ? 0 : 1);
