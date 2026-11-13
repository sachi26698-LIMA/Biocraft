// Run after a build: keep route hints in sync with the bundled collections.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const esbuild = require('esbuild');
(async () => {
  const result = await esbuild.build({ entryPoints: ['src/lib/bioCollections.ts'], bundle: true, write: false, platform: 'node', format: 'cjs' });
  const Module = module.constructor;
  const m = new Module(path.join(process.cwd(), 'font-preload-catalog.cjs'), module);
  m.filename = path.join(process.cwd(), 'font-preload-catalog.cjs'); m.paths = module.paths;
  m._compile(result.outputFiles[0].text, m.filename);
  const font = '/fonts/noto-math/noto-sans-math-styles-400.woff2';
  for (const collection of m.exports.BIO_COLLECTIONS) {
    const hasMath = collection.bios.some(bio => /[\u2100-\u214f\u{1d400}-\u{1d7ff}]/u.test(bio.text));
    const shell = fs.readFileSync(path.join('dist', collection.slug, 'index.html'), 'utf8');
    assert.equal(shell.includes(`href="${font}"`), hasMath, `${collection.slug} font hint`);
  }
  for (const route of ['stylish-name-generator', 'fancy-font-generator']) {
    assert.ok(fs.readFileSync(path.join('dist', route, 'index.html'), 'utf8').includes(`href="${font}"`), route);
  }
  assert.ok(!fs.readFileSync('dist/bio-generator/index.html', 'utf8').includes(`href="${font}"`));
  console.log('PASS static math-font hints match collections and font tools');
})().catch(error => { console.error(error); process.exitCode = 1; });
