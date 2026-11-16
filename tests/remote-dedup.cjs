/** Concurrent collection requests share only the in-flight read; failures and results aren't cached. */
const esbuild = require('esbuild');
const assert = require('node:assert/strict');
const path = require('node:path');
async function main() {
  const output = await esbuild.build({
    entryPoints: ['src/lib/biosRemote.ts'], bundle: true, write: false, platform: 'node', format: 'cjs',
    plugins: [{ name: 'mock-client', setup(build) {
      build.onResolve({ filter: /^\.\/supabase$/ }, () => ({ path: 'client', namespace: 'mock' }));
      build.onLoad({ filter: /.*/, namespace: 'mock' }, () => ({ contents: 'export const supabase = globalThis.__remoteClient;', loader: 'js' }));
    } }],
  });
  let calls = 0; const waits = [];
  global.__remoteClient = { from() {
    calls++;
    const q = { select: () => q, eq: () => q, order: () => q, limit: () => new Promise((resolve) => waits.push(resolve)) };
    return q;
  } };
  const Module = module.constructor;
  const m = new Module(path.join(process.cwd(), 'remote-dedup-bundle.cjs'), module); m.filename = path.join(process.cwd(), 'remote-dedup-bundle.cjs'); m.paths = module.paths; m._compile(output.outputFiles[0].text, m.filename);
  const { fetchCollectionBios } = m.exports;
  const a = fetchCollectionBios('one'), b = fetchCollectionBios('one'), other = fetchCollectionBios('two');
  assert.equal(calls, 2); assert.equal(a, b);
  waits.shift()({ data: [{ id: '00000000-0000-0000-0000-000000000001', created_at: '2026-01-01T00:00:00+00:00', content: 'one', language: 'en' }], count: 1, error: null });
  waits.shift()({ data: [], count: 0, error: null });
  assert.equal((await a).bios[0].text, 'one'); await other;
  const fresh = fetchCollectionBios('one'); assert.equal(calls, 3);
  waits.shift()({ data: null, error: { message: 'unavailable' } });
  await assert.rejects(fresh);
  const retry = fetchCollectionBios('one'); assert.equal(calls, 4);
  waits.shift()({ data: [], count: 0, error: null }); await retry;
  console.log('PASS concurrent reads deduplicated; separate slugs, fresh reads and retries work');
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
