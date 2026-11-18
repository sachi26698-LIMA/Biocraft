/**
 * Global library search — real DOM test.
 *
 * Renders the actual page component (esbuild → jsdom → React), with the real
 * `searchGlobal` module bundled in. Only the Supabase network call is stubbed,
 * because the test has no database; everything else — debounce, request
 * ordering, skeletons, notices, filters, paging — is the shipped code.
 *
 * The assertion that matters most is the honest one: when the backend is absent
 * the page must SAY so, and must not present invented results.
 */
const esbuild = require('esbuild');
const { JSDOM } = require('jsdom');
const assert = require('node:assert/strict');
const path = require('node:path');

const PAGE_SIZE = 24;

/** Fake RPC that mimics search_global's contract, including the +1 probe row. */
function makeRpc(behaviour) {
  const state = { calls: [] };
  const rpc = async (fn, params) => {
    state.calls.push({ fn, params });
    assert.equal(fn, 'search_global', 'page must call search_global');
    return behaviour(params, state.calls.length);
  };
  return { rpc, state };
}

function rows(n, offset = 0, domain = 'bio') {
  return Array.from({ length: n }, (_, i) => ({
    id: `id-${offset + i}`,
    source_table: 'bios',
    source_id: `src-${offset + i}`,
    domain,
    title: `Title ${offset + i}`,
    body: `Stored body ${offset + i}`,
    language: 'en',
    category: null,
    rank: 0,
  }));
}

(async () => {
  const results = [];
  const record = (name, fn) => results.push({ name, fn });

  // ---------------------------------------------------------------- case 1
  record('renders stored results and reports a real count', async () => {
    const { rpc } = makeRpc(async () => ({ data: rows(3), error: null }));
    const out = await render(rpc, '');
    await flush();
    const items = out.document.querySelectorAll('.gsearch-item');
    assert.equal(items.length, 3, 'three stored rows should render');
    assert.ok(out.document.querySelector('.gsearch-count').textContent.includes('3'));
    assert.ok(items[0].textContent.includes('Stored body 0'));
    // Every result must be a link to real content, not a dead card.
    assert.ok(items[0].querySelector('a[href]'), 'result must link to a tool page');
  });

  // ---------------------------------------------------------------- case 2
  record('absent backend is disclosed, never faked', async () => {
    // 42883 is what Postgres returns when the migration is not applied.
    const { rpc } = makeRpc(async () => ({
      data: null,
      error: { code: '42883', message: 'function public.search_global does not exist' },
    }));
    const out = await render(rpc, 'travel');
    await waitFor(out.document, '.gsearch-notice');
    assert.equal(out.document.querySelectorAll('.gsearch-item').length, 0, 'no invented rows');
    const notice = out.document.querySelector('.gsearch-notice');
    assert.ok(notice, 'must show a notice');
    assert.match(notice.textContent, /not deployed/i);
  });

  // ---------------------------------------------------------------- case 3
  record('unconfigured client is disclosed, never faked', async () => {
    // Simulate the no-Supabase build by making the RPC unreachable: the module
    // returns 'not-configured' before any call when the client is null, which is
    // exactly what a build without env vars does.
    const out = await render(null, 'travel');
    await waitFor(out.document, '.gsearch-notice');
    const notice = out.document.querySelector('.gsearch-notice');
    assert.ok(notice, 'must show a notice when the client is absent');
    assert.match(notice.textContent, /not connected/i);
    assert.equal(out.document.querySelectorAll('.gsearch-item').length, 0);
  });

  // ---------------------------------------------------------------- case 4
  record('debounces typing into one query', async () => {
    const { rpc, state } = makeRpc(async (p) => ({
      data: p.p_query ? rows(1) : [],
      error: null,
    }));
    const out = await render(rpc, '');
    await flush();
    const before = state.calls.length;
    const input = out.document.querySelector('.gsearch-bar input');
    for (const ch of 'abc') {
      setInput(input, ch === 'a' ? 'a' : input.value + ch);
      out.window.dispatchEvent(new out.window.Event('x')); // no-op, keep loop honest
    }
    await new Promise((r) => setTimeout(r, 400));
    await flush();
    const added = state.calls.length - before;
    assert.ok(added >= 1, 'query should eventually fire');
    assert.ok(added < 3, `debounce should collapse 3 keystrokes, got ${added} calls`);
  });

  // ---------------------------------------------------------------- case 5
  record('load more appends and stops when exhausted', async () => {
    // First page returns a full page + 1 probe row => hasMore.
    const { rpc, state } = makeRpc(async (p) => {
      if (p.p_offset === 0) return { data: rows(PAGE_SIZE + 1), error: null };
      if (p.p_offset === PAGE_SIZE) return { data: rows(5, PAGE_SIZE), error: null };
      return { data: [], error: null };
    });
    const out = await render(rpc, '');
    await flush();
    assert.equal(out.document.querySelectorAll('.gsearch-item').length, PAGE_SIZE);
    const more = out.document.querySelector('.gsearch-more');
    assert.ok(more, 'load-more must appear when a probe row exists');
    await click(more);
    await flush();
    assert.equal(out.document.querySelectorAll('.gsearch-item').length, PAGE_SIZE + 5);
    assert.equal(out.document.querySelector('.gsearch-more'), null, 'must stop when exhausted');
    assert.deepEqual(state.calls.map((c) => c.params.p_offset).slice(-2), [0, PAGE_SIZE]);
  });

  // ---------------------------------------------------------------- case 6
  record('domain filter is sent to the server, not applied client-side', async () => {
    const { rpc, state } = makeRpc(async (p) => ({
      data: rows(2, 0, p.p_domain || 'bio'),
      error: null,
    }));
    const out = await render(rpc, '');
    await flush();
    const chip = [...out.document.querySelectorAll('.gsearch-chip')]
      .find((c) => c.textContent.trim() === 'Font');
    assert.ok(chip, 'font filter chip should exist');
    await click(chip);
    await flush();
    const last = state.calls.at(-1);
    assert.equal(last.params.p_domain, 'font', 'server must do the filtering');
    assert.ok(last.params.p_limit <= PAGE_SIZE + 1, 'never pulls the library');
  });

  // ---------------------------------------------------------------- case 7
  record('stale response cannot overwrite a newer query', async () => {
    let release;
    const slow = new Promise((r) => { release = r; });
    let call = 0;
    const { rpc } = makeRpc(async (p) => {
      call += 1;
      if (call === 1) { await slow; return { data: rows(3), error: null }; }
      return { data: rows(1, 9, 'font'), error: null };
    });
    const out = await render(rpc, '');
    const input = out.document.querySelector('.gsearch-bar input');
    setInput(input, 'first');
    await new Promise((r) => setTimeout(r, 300));
    setInput(input, 'second');
    await new Promise((r) => setTimeout(r, 300));
    await flush();
    release();                       // let the stale request finish late
    await flush();
    const items = out.document.querySelectorAll('.gsearch-item');
    assert.equal(items.length, 1, 'stale page must not replace the newer one');
    assert.ok(items[0].textContent.includes('Stored body 9'));
  });

  // ---------------------------------------------------------------- run
  let failed = 0;
  for (const { name, fn } of results) {
    try { await fn(); console.log(`  PASS  ${name}`); }
    catch (e) { failed++; console.log(`  FAIL  ${name} — ${e.message}`); }
  }
  console.log(`\n${failed === 0 ? 'ALL PASS' : 'FAILURES'} — ${results.length - failed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(1); });

/* --------------------------------------------------------------- harness */

let current = null;

async function build(clientMode) {
  const clientSource =
    clientMode === null
      ? `export const supabase = null;
         export const isSupabaseConfigured = false;`
      : `export const isSupabaseConfigured = true;
         export const supabase = { rpc: globalThis.__bcRpc };`;

  const bundle = await esbuild.build({
    stdin: {
      contents: `export { default as Page } from './src/pages/GlobalSearchPage';
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
      setup(b) {
        // Matches the *import specifier* ('./supabase'), not the resolved path.
        b.onResolve({ filter: /(^|\/)supabase$/ }, () => ({ path: 'sb', namespace: 'stub' }));
        b.onLoad({ filter: /^sb$/, namespace: 'stub' }, () => ({ contents: clientSource, loader: 'js' }));
      },
    }],
  });
  return bundle.outputFiles[0].text;
}

async function render(rpc, initialQuery) {
  global.__bcRpc = rpc;
  const dom = new JSDOM('<div id="root"></div>', { url: 'http://localhost/', pretendToBeVisual: true });
  global.window = dom.window;
  global.document = dom.window.document;
  global.HTMLElement = dom.window.HTMLElement;
  global.Node = dom.window.Node;
  global.IntersectionObserver = class { observe() {} disconnect() {} };
  global.IS_REACT_ACT_ENVIRONMENT = true;

  const code = await build(rpc);
  const m = new module.constructor(path.join(process.cwd(), 'gs-test.cjs'), module);
  m.filename = path.join(process.cwd(), 'gs-test.cjs');
  m.paths = module.constructor._nodeModulePaths(process.cwd());
  m._compile(code, m.filename);
  const { Page, React, act, createRoot } = m.exports;

  const root = createRoot(dom.window.document.getElementById('root'));
  await act(async () => { root.render(React.createElement(Page)); });
  if (initialQuery) {
    await act(async () => {
      setInput(dom.window.document.querySelector('.gsearch-bar input'), initialQuery);
    });
  }
  current = { dom, act, root };

  // Synthetic input setter: React listens to the native value setter.
  function setInput(el, value) {
    const setter = Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype, 'value').set;
    setter.call(el, value);
    el.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
  }
  dom.setInput = (el, v) => setInput(el, v);
  return { document: dom.window.document, window: dom.window, root };
}

function setInput(el, value) {
  // Route through the active window so React's synthetic event fires.
  const win = el.ownerDocument.defaultView;
  const setter = Object.getOwnPropertyDescriptor(win.HTMLInputElement.prototype, 'value').set;
  setter.call(el, value);
  el.dispatchEvent(new win.Event('input', { bubbles: true }));
}

async function click(el) {
  if (!current) throw new Error('no active render');
  await current.act(async () => {
    el.dispatchEvent(new el.ownerDocument.defaultView.MouseEvent('click', { bubbles: true }));
  });
}

/** Poll for a selector, letting React commit in between attempts. */
async function waitFor(document, selector, timeout = 1500) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    if (document.querySelector(selector)) return true;
    await flush(40);
  }
  return false;
}

async function flush(ms = 60) {
  // Let the debounce timer, the pending promise and React's scheduler all run,
  // then settle React inside act() so state updates are committed to the DOM.
  await new Promise((r) => setTimeout(r, ms));
  if (current) await current.act(async () => { await Promise.resolve(); });
  await new Promise((r) => setTimeout(r, 0));
  if (current) await current.act(async () => { await Promise.resolve(); });
}
