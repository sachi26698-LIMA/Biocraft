/** The cooperative fallback and synchronous/worker paths share the same output. */
const esbuild = require('esbuild');
const assert = require('node:assert/strict');
const path = require('node:path');
async function main() {
  const output = await esbuild.build({ entryPoints: ['src/tools/bio/lib/generationJobs.ts'], bundle: true, write: false, platform: 'node', format: 'cjs' });
  const m = new module.constructor(path.join(process.cwd(), 'generation-steps-test.cjs'), module);
  m.filename = path.join(process.cwd(), 'generation-steps-test.cjs'); m.paths = module.paths; m._compile(output.outputFiles[0].text, m.filename);
  const { executeGeneration, generationSteps } = m.exports;
  const originalRandom = Math.random;
  const seed = () => { let n = 12345; Math.random = () => ((n = (n * 16807) % 2147483647) - 1) / 2147483646; };
  try {
    for (const mode of ['personal', 'category']) for (const language of ['en', 'hi', 'hg']) for (const emojis of [true, false]) for (const single of [true, false]) {
      const job = { mode, language, emojis, values: { name: 'Priya', role: 'Creator', niche: 'Music', city: 'Delhi' }, categoryId: 'creator', options: { limit: 80, count: 20 }, ...(single ? { exclude: ['old bio'] } : {}) };
      seed(); const expected = executeGeneration(job);
      seed(); const steps = generationSteps(job); let step = steps.next(); while (!step.done) step = steps.next();
      assert.deepEqual(step.value, expected, `${mode}/${language}/${emojis}/${single}`);
    }
  } finally { Math.random = originalRandom; }
  console.log('PASS incremental and synchronous generation agree across modes, languages, emoji and single/bulk');
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
