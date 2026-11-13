/** Stable keyset paging, server caps, exact counts, retries and concurrent changes. */
const esbuild = require('esbuild');
const assert = require('node:assert/strict');
const path = require('node:path');
async function main() {
  const output = await esbuild.build({
    entryPoints: ['src/lib/biosRemote.ts'], bundle: true, write: false, platform: 'node', format: 'cjs',
    plugins: [{ name: 'mock-client', setup(build) {
      build.onResolve({ filter: /^\.\/supabase$/ }, () => ({ path: 'client', namespace: 'mock' }));
      build.onLoad({ filter: /.*/, namespace: 'mock' }, () => ({ contents: 'export const supabase = globalThis.__paginationClient;', loader: 'js' }));
    } }],
  });
  let rows = [], calls = [], cap = 500, changeCount = false, failPage = false;
  const makeRows = (n) => Array.from({ length: n }, (_, i) => ({ id: `00000000-0000-0000-0000-${String(i + 1).padStart(12, '0')}`, created_at: '2026-01-01T00:00:00+00:00', content: `row ${i}`, language: 'en', plain_content: null, style_type: null }));
  global.__paginationClient = { from(table) {
    assert.equal(table, 'bios');
    const state = { filters: [], order: [], cursor: null, options: {} };
    const q = {
      select(columns, options = {}) { state.columns = columns; state.options = options; return q; },
      eq(k, v) { state.filters.push([k, v]); return q; },
      order(k, v) { state.order.push([k, v.ascending]); return q; },
      or(value) { state.cursor = value; return q; },
      limit(value) { return Promise.resolve(execute(value)); },
      then(resolve, reject) { return Promise.resolve(execute(null)).then(resolve, reject); },
    };
    function execute(limit) {
      calls.push({ ...state, limit });
      assert.deepEqual(state.filters, [['source_slug', 'test'], ['is_active', true]]);
      if (state.options.head) return { count: rows.length + (changeCount ? 1 : 0), error: null, data: null };
      assert.deepEqual(state.order, [['created_at', true], ['id', true]]);
      if (failPage && state.cursor) return { data: null, error: { message: 'offline' }, count: null };
      let result = rows;
      if (state.cursor) {
        const m = /^created_at\.gt\."([^"]+)",and\(created_at\.eq\."([^"]+)",id\.gt\.([0-9a-f-]+)\)$/.exec(state.cursor);
        assert.ok(m, 'valid keyset filter'); assert.equal(m[1], m[2]);
        result = rows.filter(r => r.created_at > m[1] || (r.created_at === m[1] && r.id > m[3]));
      }
      return { data: result.slice(0, Math.min(cap, limit)), count: state.options.count ? rows.length : null, error: null };
    }
    return q;
  } };
  const Module = module.constructor;
  const m = new Module(path.join(process.cwd(), 'collection-pagination-bundle.cjs'), module); m.filename = path.join(process.cwd(), 'collection-pagination-bundle.cjs'); m.paths = module.paths; m._compile(output.outputFiles[0].text, m.filename);
  const { fetchCollectionBios } = m.exports;
  rows = makeRows(0); assert.deepEqual((await fetchCollectionBios('test')).bios, []); assert.equal(calls.length, 1);
  calls = []; rows = makeRows(500); assert.equal((await fetchCollectionBios('test')).bios.length, 500); assert.equal(calls.length, 1, 'full single page needs no speculative second request');
  calls = []; cap = 200; rows = makeRows(1005); const all = await fetchCollectionBios('test');
  assert.deepEqual(all.bios.map(x => x.text), rows.map(x => x.content));
  assert.equal(calls.length, 7, 'six capped pages and one final count');
  assert.ok(calls[calls.length - 1].options.head, 'verify count after multiple requests');
  calls = []; changeCount = true; await assert.rejects(fetchCollectionBios('test'), /changed/); changeCount = false;
  calls = []; failPage = true; await assert.rejects(fetchCollectionBios('test'), /offline/); failPage = false;
  assert.equal((await fetchCollectionBios('test')).bios.length, 1005, 'a failed read can retry');
  console.log('PASS complete keyset pages, tied timestamps, server row caps, changes and fresh retries');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
