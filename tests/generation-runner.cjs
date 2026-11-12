/* Worker lifecycle and fallback regression checks, without measuring performance. */
const esbuild = require('esbuild');
const assert = require('node:assert/strict');
const path = require('node:path');
async function main() {
  const output = await esbuild.build({ entryPoints: ['src/tools/bio/lib/generationRunner.ts'], bundle: true, write: false, platform: 'node', format: 'cjs', define: { 'import.meta.url': '"file:///tmp/runner.js"' } });
  const m = new module.constructor(path.join(process.cwd(), 'generation-runner-test.cjs'), module); m.filename = path.join(process.cwd(), 'generation-runner-test.cjs'); m.paths = module.paths; m._compile(output.outputFiles[0].text, m.filename);
  const workers = [];
  global.Worker = class FakeWorker {
    constructor() { workers.push(this); }
    postMessage(message) { this.job = message; }
    terminate() { this.terminated = true; }
  };
  const { GenerationRunner } = m.exports;
  const job = { mode: 'personal', values: { name: 'Alex', role: 'Creator', niche: '', city: '' }, categoryId: 'creator', language: 'en', emojis: true, options: { limit: 150, count: 5 } };
  const runner = new GenerationRunner();
  const first = runner.run(job); const second = runner.run(job);
  assert.equal(await first, null); assert.equal(workers[0].terminated, true);
  workers[0].onmessage({ data: { id: workers[0].job.id, result: ['stale'] } });
  workers[1].onmessage({ data: { id: workers[1].job.id, result: ['fresh'] } });
  assert.deepEqual(await second, ['fresh']);
  const third = runner.run(job); assert.equal(workers.length, 2, 'completed worker reused');
  workers[1].onerror();
  assert.equal((await third).length, 5, 'worker error falls back to local generation');
  assert.equal(workers[1].terminated, true);
  delete global.Worker;
  const fallback = await runner.run(job); assert.equal(fallback.length, 5);
  const fresh = await runner.run({ ...job, exclude: fallback });
  assert.equal(fresh.length, 1); assert.ok(!fallback.some((bio) => bio.toLowerCase() === fresh[0].toLowerCase()));
  const cancelled = runner.run(job); runner.dispose(); assert.equal(await cancelled, null);
  console.log('PASS worker cancellation, stale results, reuse, fallback, exclusion and disposal');
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
