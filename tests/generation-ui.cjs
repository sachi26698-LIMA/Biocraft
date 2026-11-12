/** Ensure a settings change supersedes an in-flight first generation. */
const esbuild = require('esbuild');
const { JSDOM } = require('jsdom');
const assert = require('node:assert/strict');
const path = require('node:path');
async function main() {
  const dom = new JSDOM('<div id="root"></div>', { url: 'http://localhost/', pretendToBeVisual: true });
  global.window = dom.window; global.document = dom.window.document; global.HTMLElement = dom.window.HTMLElement; global.Node = dom.window.Node; global.IS_REACT_ACT_ENVIRONMENT = true;
  const calls = [];
  global.__GenerationRunner = class {
    run(job) { this.cancel(); return new Promise(resolve => { this.pending = resolve; calls.push({ job, resolve }); }); }
    cancel() { if (this.pending) { this.pending(null); this.pending = null; } }
    dispose() { this.cancel(); }
  };
  // This component consumes the regular platform context; provide a provider.
  const m = new module.constructor(path.join(process.cwd(), 'generation-ui-test.cjs'), module); m.filename = path.join(process.cwd(), 'generation-ui-test.cjs'); m.paths = module.paths;
  const wrapper = await esbuild.build({
    stdin: { contents: "export { default as Tool } from './src/tools/bio/BioTool'; export { ToolkitProvider } from './src/lib/toolkit'; export { default as React, act } from 'react'; export { createRoot } from 'react-dom/client';", resolveDir: process.cwd(), loader: 'tsx' },
    bundle: true, write: false, platform: 'node', format: 'cjs', packages: 'external',
    plugins: [{ name: 'mock-job-runner', setup(build) {
      build.onResolve({ filter: /\/lib\/generationRunner$/ }, () => ({ path: 'runner', namespace: 'mock' }));
      build.onLoad({ filter: /.*/, namespace: 'mock' }, () => ({ contents: 'export const GenerationRunner = globalThis.__GenerationRunner;', loader: 'js' }));
    } }],
  });
  m._compile(wrapper.outputFiles[0].text, m.filename);
  const { Tool, ToolkitProvider, React, act, createRoot } = m.exports;
  const root = createRoot(document.getElementById('root'));
  await act(async () => root.render(React.createElement(ToolkitProvider, null, React.createElement(Tool))));
  const click = async (element) => act(async () => element.dispatchEvent(new window.MouseEvent('click', { bubbles: true })));
  const button = (label) => [...document.querySelectorAll('button')].find(x => x.textContent.trim() === label);
  await click(button('By category'));
  await click(button('Generate 5 bios'));
  assert.equal(calls.length, 1);
  await click(button('हिन्दी'));
  assert.equal(calls.length, 2);
  assert.equal(calls[1].job.language, 'hi');
  await act(async () => { calls[1].resolve(['हिंदी नया बायो']); await Promise.resolve(); });
  assert.match(document.body.textContent, /हिंदी नया बायो/);
  assert.doesNotMatch(document.body.textContent, /Generating bios…/);
  await act(async () => root.unmount());
  console.log('PASS changing settings replaces an in-flight first generation');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
