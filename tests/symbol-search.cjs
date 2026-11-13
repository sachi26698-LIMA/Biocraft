// Stable entries allow memoized cells to survive search/category changes.
const assert = require('node:assert/strict');
const esbuild = require('esbuild');
const path = require('node:path');
(async () => {
  const output = await esbuild.build({ entryPoints: ['src/tools/symbols/data/symbols.ts'], bundle: true, write: false, platform: 'node', format: 'cjs' });
  const m = new module.constructor(path.join(process.cwd(), 'symbol-search-test.cjs'), module);
  m.filename = path.join(process.cwd(), 'symbol-search-test.cjs'); m.paths = module.paths;
  m._compile(output.outputFiles[0].text, m.filename);
  const { searchSymbols, TOTAL_SYMBOLS } = m.exports;
  const all = searchSymbols('', 'all');
  assert.equal(all.length, TOTAL_SYMBOLS);
  assert.equal(new Set(all.map(s => `${s.categoryId}-${s.glyph}`)).size, all.length);
  const hearts = searchSymbols('', 'hearts');
  assert.equal(hearts.length, 27);
  assert.ok(hearts.every(s => all.includes(s)), 'entries retain identity across filtering');
  for (const term of ['heart', 'दिल']) {
    const results = searchSymbols(term, 'all');
    assert.ok(results.some(s => s.glyph === '❤️'), term);
    assert.ok(results.every(s => all.includes(s)));
  }
  assert.ok(searchSymbols('heart red', 'all').some(s => s.glyph === '❤️'));
  assert.equal(searchSymbols('no-such-symbol-xyz', 'all').length, 0);
  console.log('PASS stable symbol entries and English, Hindi and multi-term filtering');
})().catch(error => { console.error(error); process.exitCode = 1; });
