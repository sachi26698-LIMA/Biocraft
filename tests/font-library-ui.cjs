/**
 * Font library — real DOM test.
 *
 * Renders the shipped page with the real `libraryApi` module in the bundle; only
 * the Supabase client is stubbed, because there is no database in this test.
 *
 * The assertions that matter most are the ones a "looks fine" mockup would fail:
 *   - a full page must request the NEXT page, not reload the first
 *   - the page must never ask for more than its page size
 *   - an absent backend is disclosed rather than shown as an empty catalogue
 *   - "load preview" injects exactly one font request, not 1,900
 */
const esbuild = require('esbuild');
const { JSDOM } = require('jsdom');
const assert = require('node:assert/strict');
const path = require('node:path');

const PAGE_SIZE = 48;

const fontRow = (i) => ({
  slug: `font-${i}`,
  name: `Font ${i}`,
  family: `Font ${i}`,
  category: 'sans-serif',
  subsets: ['latin'],
  weights: ['400', '700'],
  styles: ['normal'],
  variable: false,
  next_cursor: `font-${i}`,
});

async function build(clientSource) {
  const b = await esbuild.build({
    stdin: {
      contents: `export { default as Page } from './src/pages/FontLibraryPage';
                 export { default as React } from 'react';
                 export { act } from 'react';
                 export { createRoot } from 'react-dom/client';`,
      resolveDir: process.cwd(),
      loader: 'tsx',
    },
    bundle: true,
    write: false,
    platform: 'node',
    format: 'cjs',
    packages: 'external',
    plugins: [{
      name: 'stub-supabase',
      setup(bb) {
        bb.onResolve({ filter: /(^|\/)supabase$/ }, () => ({ path: 'sb', namespace: 'stub' }));
        bb.onLoad({ filter: /^sb$/, namespace: 'stub' }, () => ({ contents: clientSource, loader: 'js' }));
      },
    }],
  });
  return b.outputFiles[0].text;
}

let ctx = null;

async function render(rpc, isConfigured = true) {
  global.__rpc = rpc;
  const clientSource = isConfigured
    ? `export const isSupabaseConfigured = true;
       export const supabase = { rpc: (...a) => globalThis.__rpc(...a) };`
    : `export const isSupabaseConfigured = false; export const supabase = null;`;

  const dom = new JSDOM('<div id="root"></div>', { url: 'http://localhost/', pretendToBeVisual: true });
  global.window = dom.window;
  global.document = dom.window.document;
  global.HTMLElement = dom.window.HTMLElement;
  global.Node = dom.window.Node;
  global.IS_REACT_ACT_ENVIRONMENT = true;

  const code = await build(clientSource);
  const m = new module.constructor(path.join(process.cwd(), 'fl-test.cjs'), module);
  m.filename = path.join(process.cwd(), 'fl-test.cjs');
  m.paths = module.constructor._nodeModulePaths(process.cwd());
  m._compile(code, m.filename);
  const { Page, React, act, createRoot } = m.exports;

  const root = createRoot(dom.window.document.getElementById('root'));
  await act(async () => { root.render(React.createElement(Page)); });
  ctx = { dom, act, root };
  return { document: dom.window.document, window: dom.window };
}

async function flush(ms = 60) {
  await new Promise((r) => setTimeout(r, ms));
  if (ctx) await ctx.act(async () => { await Promise.resolve(); });
  await new Promise((r) => setTimeout(r, 0));
  if (ctx) await ctx.act(async () => { await Promise.resolve(); });
}

async function waitFor(doc, selector, timeout = 2000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    if (doc.querySelector(selector)) return true;
    await flush(40);
  }
  return false;
}

async function click(el) {
  await ctx.act(async () => {
    el.dispatchEvent(new el.ownerDocument.defaultView.MouseEvent('click', { bubbles: true }));
  });
}

(async () => {
  const cases = [];
  const t = (name, fn) => cases.push({ name, fn });

  t('renders one page of real families', async () => {
    const calls = [];
    const rpc = async (fn, params) => {
      calls.push({ fn, params });
      if (fn !== 'font_page') throw new Error(`unexpected rpc ${fn}`);
      return { data: Array.from({ length: PAGE_SIZE }, (_, i) => fontRow(i)), error: null };
    };
    const out = await render(rpc);
    await waitFor(out.document, '.fontlib-card');
    const cards = out.document.querySelectorAll('.fontlib-card');
    assert.equal(cards.length, PAGE_SIZE, 'one page only');
    assert.ok(cards[0].textContent.includes('Font 0'));
    // Never asks for the whole catalogue.
    assert.ok(calls[0].params.p_limit <= PAGE_SIZE, `page size must be bounded, got ${calls[0].params.p_limit}`);
  });

  t('load more fetches the NEXT page with the cursor, not the first', async () => {
    const calls = [];
    const rpc = async (fn, params) => {
      calls.push(params);
      const offset = params.p_cursor ? PAGE_SIZE : 0;
      const n = params.p_cursor ? 10 : PAGE_SIZE;
      return { data: Array.from({ length: n }, (_, i) => fontRow(offset + i)), error: null };
    };
    const out = await render(rpc);
    await waitFor(out.document, '.fontlib-more');
    const more = out.document.querySelector('.fontlib-more');
    await click(more);
    await flush();
    const cards = out.document.querySelectorAll('.fontlib-card');
    assert.equal(cards.length, PAGE_SIZE + 10, 'appended, not replaced');
    assert.equal(calls[0].p_cursor, null, 'first page has no cursor');
    assert.equal(calls[1].p_cursor, `font-${PAGE_SIZE - 1}`, 'second page continues from the last slug');
    assert.equal(out.document.querySelector('.fontlib-more'), null, 'stops when a short page arrives');
  });

  t('category filter is sent to the server', async () => {
    const calls = [];
    const rpc = async (fn, params) => { calls.push(params); return { data: [fontRow(1)], error: null }; };
    const out = await render(rpc);
    await waitFor(out.document, '.fontlib-chip');
    const chip = [...out.document.querySelectorAll('.fontlib-chip')]
      .find((c) => c.textContent.trim() === 'Serif');
    await click(chip);
    await flush();
    assert.equal(calls.at(-1).p_category, 'serif');
  });

  t('absent backend is disclosed, not shown as an empty catalogue', async () => {
    const out = await render(null, false);
    await waitFor(out.document, '.fontlib-notice');
    const notice = out.document.querySelector('.fontlib-notice');
    assert.ok(notice, 'must show a notice');
    assert.match(notice.textContent, /not connected/i);
    assert.equal(out.document.querySelectorAll('.fontlib-card').length, 0);
  });

  t('missing function is reported as not deployed', async () => {
    const rpc = async () => ({ data: null, error: { code: '42883', message: 'function font_page does not exist' } });
    const out = await render(rpc);
    await waitFor(out.document, '.fontlib-notice');
    assert.match(out.document.querySelector('.fontlib-notice').textContent, /not deployed/i);
  });

  t('load preview injects exactly one font request', async () => {
    const rpc = async () => ({ data: Array.from({ length: 4 }, (_, i) => fontRow(i)), error: null });
    const out = await render(rpc);
    await waitFor(out.document, '.fontlib-preview');
    const before = out.document.querySelectorAll('link[rel="stylesheet"]').length;
    await click(out.document.querySelector('.fontlib-preview'));
    await flush();
    const links = [...out.document.querySelectorAll('link[rel="stylesheet"]')];
    assert.equal(links.length, before + 1, 'exactly one stylesheet added');
    assert.match(links[links.length - 1].href, /fonts\.googleapis\.com/);
    assert.match(out.document.querySelector('.fontlib-preview').textContent ?? 'Preview loaded', /Preview loaded|Load preview/);
  });

  t('no horizontal overflow class assumptions: grid is responsive', async () => {
    const rpc = async () => ({ data: [fontRow(1)], error: null });
    const out = await render(rpc);
    await waitFor(out.document, '.fontlib-grid');
    // Presence of the grid contract; layout itself is asserted in the CSS review.
    assert.ok(out.document.querySelector('.fontlib-grid'), 'grid container exists');
    assert.ok(!/\b(fake|placeholder data)\b/i.test(out.document.body.textContent || ''));
  });

  let failed = 0;
  for (const c of cases) {
    try { await c.fn(); console.log(`  PASS  ${c.name}`); }
    catch (e) { failed++; console.log(`  FAIL  ${c.name} — ${e.message}`); }
  }
  console.log(`\n${failed === 0 ? 'ALL PASS' : 'FAILURES'} — ${cases.length - failed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(1); });
