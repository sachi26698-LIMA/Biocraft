/** Regression: a previous collection's remote rows must not leak into a new route. */
const esbuild = require('esbuild');
const { JSDOM } = require('jsdom');
const assert = require('node:assert/strict');

async function main() {
  const output = await esbuild.build({
    stdin: { contents: "export { default as Page } from './src/pages/BioCollectionPage'; export { default as React, act } from 'react'; export { createRoot } from 'react-dom/client';", resolveDir: process.cwd(), loader: 'tsx' },
    bundle: true, write: false, platform: 'node', format: 'cjs', packages: 'external',
    plugins: [{ name: 'mock-bios-remote', setup(build) {
      build.onResolve({ filter: /\/lib\/biosRemote$/ }, () => ({ path: 'remote', namespace: 'mock-remote' }));
      build.onLoad({ filter: /.*/, namespace: 'mock-remote' }, () => ({ contents: 'export const fetchCollectionBios = (slug) => globalThis.__fetchCollectionBios(slug);', loader: 'js' }));
    } }],
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
  let resolveSecond;
  global.__fetchCollectionBios = (slug) => slug === 'instagram-bio-for-boys'
    ? Promise.resolve({ source: 'supabase', bios: [{ text: 'REMOTE UNIQUE BOYS RESULT', lang: 'en' }] })
    : new Promise((resolve) => { resolveSecond = resolve; });
  const root = createRoot(document.getElementById('root'));
  await act(async () => { root.render(React.createElement(Page, { slug: 'instagram-bio-for-boys' })); });
  assert.match(document.body.textContent, /REMOTE UNIQUE BOYS RESULT/);
  await act(async () => { root.render(React.createElement(Page, { slug: 'instagram-bio-for-girls' })); });
  assert.doesNotMatch(document.body.textContent, /REMOTE UNIQUE BOYS RESULT/, 'old remote bios persisted during navigation');
  await act(async () => { resolveSecond({ source: 'supabase', bios: [] }); });
  assert.doesNotMatch(document.body.textContent, /REMOTE UNIQUE BOYS RESULT/, 'empty remote result retained old bios');
  await act(async () => root.unmount());
  console.log('PASS collection navigation: remote rows do not leak while loading or on empty result');
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
