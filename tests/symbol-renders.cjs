// Observe actual SymbolCell renders when one favourite is changed.
const esbuild = require('esbuild');
const { JSDOM } = require('jsdom');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
(async () => {
  const result = await esbuild.build({
    stdin: { contents: "export { default as Panel } from './src/tools/symbols/SymbolGenerator'; export { default as React, act } from 'react'; export { createRoot } from 'react-dom/client';", resolveDir: process.cwd(), loader: 'tsx' },
    bundle: true, write: false, platform: 'node', format: 'cjs', packages: 'external',
    plugins: [{ name: 'instrument-cell', setup(build) {
      build.onLoad({ filter: /SymbolGenerator\.tsx$/ }, args => {
        const original = fs.readFileSync(args.path, 'utf8');
        const needle = '  const isRow = [...symbol.glyph].length > 6;';
        assert.ok(original.includes(needle));
        return { contents: original.replace(needle, `  globalThis.__symbolRenders++;\n${needle}`), loader: 'tsx', resolveDir: path.dirname(args.path) };
      });
    } }],
  });
  const dom = new JSDOM('<div id="root"></div>', { url: 'http://localhost/', pretendToBeVisual: true });
  global.window = dom.window; global.document = dom.window.document; global.HTMLElement = dom.window.HTMLElement; global.Node = dom.window.Node;
  global.IS_REACT_ACT_ENVIRONMENT = true; global.__symbolRenders = 0;
  const m = new module.constructor(path.join(process.cwd(), 'symbol-render-test.cjs'), module);
  m.filename = path.join(process.cwd(), 'symbol-render-test.cjs'); m.paths = module.paths; m._compile(result.outputFiles[0].text, m.filename);
  const { Panel, React, act, createRoot } = m.exports;
  const root = createRoot(document.getElementById('root'));
  await act(async () => root.render(React.createElement(Panel)));
  assert.equal(document.querySelectorAll('.symbol-cell').length, 629);
  const before = global.__symbolRenders;
  await act(async () => document.querySelector('.symbol-fav').click());
  assert.equal(global.__symbolRenders - before, 1, 'only the changed symbol re-renders');
  console.log('PASS one favourite re-renders one of 629 symbol cells');
  await act(async () => root.unmount());
})().catch(error => { console.error(error); process.exitCode = 1; });
