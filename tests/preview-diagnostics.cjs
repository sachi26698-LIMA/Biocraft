/** Deterministic component tests; these mock Supabase and do not prove live connectivity. */
const esbuild = require('esbuild');
const { JSDOM } = require('jsdom');
const assert = require('node:assert/strict');
const path = require('node:path');

async function main() {
  const output = await esbuild.build({
    stdin: { contents: "export { default as Page } from './src/pages/PreviewDiagnosticsPage'; export { default as React, act } from 'react'; export { createRoot } from 'react-dom/client';", resolveDir: process.cwd(), loader: 'tsx' },
    bundle: true, write: false, platform: 'node', format: 'cjs', packages: 'external', loader: { '.css': 'empty' },
    plugins: [{ name: 'mock-remote', setup(build) {
      build.onResolve({ filter: /\/lib\/supabase$/ }, () => ({ path: 'client', namespace: 'mock-diag' }));
      build.onResolve({ filter: /\/lib\/biosRemote$/ }, () => ({ path: 'remote', namespace: 'mock-diag' }));
      build.onLoad({ filter: /.*/, namespace: 'mock-diag' }, ({ path }) => ({ contents: path === 'client'
        ? 'export const supabase = globalThis.__diagClient;'
        : 'export const fetchCollectionBios = (...args) => globalThis.__diagFetch(...args); export const searchBios = (...args) => globalThis.__diagSearch(...args);', loader: 'js' }));
    } }],
  });
  const dom = new JSDOM('<div id="root"></div>', { url: 'http://localhost/preview-diagnostics', pretendToBeVisual: true });
  global.window = dom.window; global.document = dom.window.document; global.HTMLElement = dom.window.HTMLElement; global.Node = dom.window.Node; global.IS_REACT_ACT_ENVIRONMENT = true;
  let failure = false;
  const platformIds = ['instagram', 'facebook', 'threads', 'tiktok', 'x', 'linkedin', 'whatsapp', 'snapchat'];
  global.__diagClient = {
    auth: { getSession: async () => ({ data: { session: null }, error: null }) },
    from(table) {
      let head = false, lang;
      const q = {
        select(_fields, options) { head = !!options?.head; return q; },
        eq(field, value) { if (field === 'language') lang = value; return q; },
        limit() { return q; },
        then(resolve, reject) {
          const value = failure ? { data: null, error: { message: 'PRIVATE_CANARY_ERROR' }, status: 403, count: null }
            : table === 'platforms' ? { data: platformIds.map(slug => ({ slug })), error: null, status: 200 }
            : head ? { data: null, count: ({ en: 301, hi: 75, hg: 130 })[lang], error: null, status: 200 }
            : { data: [{ id: 'a', language: 'en' }], count: 506, error: null, status: 200 };
          return Promise.resolve(value).then(resolve, reject);
        },
      };
      return q;
    },
  };
  global.__diagFetch = async () => ({ source: 'supabase', bios: [{ text: 'test', lang: 'en' }] });
  global.__diagSearch = async ({ offset = 0, categorySlug }) => Array.from({ length: 5 }, (_, i) => ({ id: String(offset + i), category_slug: categorySlug ?? null }));
  const Module = module.constructor;
  const m = new Module(path.join(process.cwd(), 'diag-test-bundle.cjs'), module); m.filename = path.join(process.cwd(), 'diag-test-bundle.cjs'); m.paths = module.paths; m._compile(output.outputFiles[0].text, m.filename);
  const { Page, React, act, createRoot } = m.exports;
  const root = createRoot(document.getElementById('root'));
  await act(async () => { root.render(React.createElement(Page)); });
  assert.match(document.body.textContent, /NOT TESTED/);
  assert.ok(document.documentElement.classList.contains('preview-diagnostics-active'));
  const findButton = (label) => [...document.querySelectorAll('button')].find((b) => b.textContent === label);
  await act(async () => { findButton('Run All Tests').click(); await new Promise((r) => setTimeout(r, 20)); });
  assert.match(document.body.textContent, /HTTP 200 · success/);
  assert.match(document.body.textContent, /English: 301 · Hindi: 75 · Hinglish: 130/);
  assert.match(document.body.textContent, /RLS active-read permission: PASS/);
  assert.equal([...document.querySelectorAll('.preview-diag-status.status-pass')].length, 7);
  assert.equal([...document.querySelectorAll('.preview-diag-status.status-not-tested')].length, 14);
  global.__diagSearch = async ({ offset = 0 }) => Array.from({ length: 5 }, (_, i) => ({ id: String(offset + (offset === 0 && i === 4 ? 0 : i)) }));
  const paginationCard = [...document.querySelectorAll('.preview-diag-card')].find((card) => card.querySelector('h3')?.textContent === 'Pagination RPC');
  await act(async () => { paginationCard.querySelector('button').click(); await new Promise((r) => setTimeout(r, 10)); });
  assert.match(paginationCard.textContent, /FAIL/);
  failure = true;
  await act(async () => { findButton('Test Supabase Connection').click(); await new Promise((r) => setTimeout(r, 10)); });
  assert.match(document.body.textContent, /HTTP 403/);
  assert.doesNotMatch(document.body.textContent, /PRIVATE_CANARY_ERROR/);
  assert.match(document.body.textContent, /Records returned: —/);
  await act(async () => { root.unmount(); });
  assert.ok(!document.documentElement.classList.contains('preview-diagnostics-active'));
  console.log('PASS diagnostics mocked success, duplicate IDs, manual NOT TESTED, failure sanitization, cleanup and stale summary clearing');
}
main().catch((err) => { console.error(err); process.exitCode = 1; });
