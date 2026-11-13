// Run after a build: ensure only the small face is hinted on matching routes.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const esbuild = require('esbuild');
(async () => {
  const result = await esbuild.build({ entryPoints: ['src/lib/bioCollections.ts'], bundle: true, write: false, platform: 'node', format: 'cjs' });
  const m = new module.constructor(path.join(process.cwd(), 'font-preload-test.cjs'), module);
  m.filename = path.join(process.cwd(), 'font-preload-test.cjs'); m.paths = module.paths;
  m._compile(result.outputFiles[0].text, m.filename);
  const href = '/fonts/noto-math/noto-sans-math-common-400.woff2';
  for (const collection of m.exports.BIO_COLLECTIONS) {
    const hasMath = collection.bios.some(bio => /[\u{1d400}-\u{1d433}\u{1d5d4}-\u{1d607}\u{1d670}-\u{1d6a3}]/u.test(bio.text));
    const shell = fs.readFileSync(path.join('dist', collection.slug, 'index.html'), 'utf8');
    assert.equal(shell.includes(`href="${href}"`), hasMath, collection.slug);
    assert.ok(!shell.includes('noto-sans-math-other-400.woff2'));
  }
  for (const route of ['stylish-name-generator', 'fancy-font-generator'])
    assert.ok(fs.readFileSync(path.join('dist', route, 'index.html'), 'utf8').includes(`href="${href}"`), route);
  const css = fs.readFileSync('src/index.css', 'utf8');
  assert.match(css, /noto-sans-math-other-400\.woff2/);
  assert.ok(fs.statSync(path.join('public', href)).size < 12000, 'critical subset remains small');
  console.log('PASS route hints load only the small common math subset');
})().catch(error => { console.error(error); process.exitCode = 1; });
