// Infinite-expansion policy guard.
//
// The platform rule is that no feature may carry an arbitrary fixed catalog cap,
// and that a request for N items must never be silently downgraded to fewer
// without saying so. These assertions exist so a future change that reintroduces
// a hardcoded 5/10/20 ladder, or a bare `slice(0, 5)`, fails here instead of
// quietly shipping.
//
// Run: node tests/infinite-expansion.cjs
const assert = require('node:assert/strict');
const {execFileSync} = require('node:child_process');
const {mkdtempSync, readFileSync, rmSync} = require('node:fs');
const {tmpdir} = require('node:os');
const {join} = require('node:path');

const out = mkdtempSync(join(tmpdir(), 'biocraft-infinite-'));
const esbuild = join(__dirname, '..', 'node_modules', '.bin', 'esbuild');

function bundle(entry, name) {
  execFileSync(esbuild, [entry, '--bundle', '--format=cjs', '--platform=node', `--outfile=${join(out, name)}`], {stdio: 'pipe'});
  return require(join(out, name));
}

const BIO = 'photography';
const TONES = ['witty', 'aesthetic', 'bold', 'inspirational', 'professional', 'minimal', 'casual', 'luxe'];

try {
  const captions = bundle('src/tools/captions/data/pools.ts', 'captions.cjs');
  const hashtags = bundle('src/tools/hashtags/data/pools.ts', 'hashtags.cjs');

  // 1. Captions were hardcoded to exactly five by `slice(0, 5)`.
  for (const n of [1, 5, 12, 18]) {
    const got = captions.generateCaptions(BIO, 'witty', 'en', {}, n);
    assert.equal(got.length, Math.min(n, got.length), `captions: never return more than asked (${n})`);
    assert.ok(got.length > 0, `captions: returned nothing for ${n}`);
    assert.equal(new Set(got).size, got.length, `captions: duplicates at ${n}`);
  }
  assert.ok(
    captions.generateCaptions(BIO, 'witty', 'en', {}, 12).length > 5,
    'captions: must be able to return more than the old hardcoded 5',
  );

  // 2. Every tone must offer materially more than the old 14-template pool.
  for (const tone of TONES) {
    const available = captions.generateCaptions(BIO, tone, 'en', {}, 1000).length;
    assert.ok(available >= 18, `captions: ${tone}/en only has ${available} unique templates (want >= 18)`);
  }

  // 3. Hashtags previously accepted only 5|10|20|30 and threw on anything else.
  for (const n of [3, 7, 33, 62]) {
    const r = hashtags.generateHashtags(BIO, 'en', n, '');
    assert.equal(new Set(r.tags.map((t) => t.toLowerCase())).size, r.tags.length, `hashtags: duplicates at ${n}`);
    assert.ok(r.tags.length > 0, `hashtags: returned nothing for ${n}`);
  }
  const fifty = hashtags.generateHashtags(BIO, 'en', 50, '');
  assert.equal(fifty.tags.length, 50, 'hashtags: must fill 50 (old maximum was 30)');

  // 4. No fixed option ladder survives in the generator UI.
  const files = [
    'src/tools/bio/BioTool.tsx',
    'src/tools/hashtags/HashtagGenerator.tsx',
    'src/tools/shared/MoodBoardTool.tsx',
  ];
  for (const f of files) {
    const src = readFileSync(f, 'utf8');
    assert.ok(!/BIO_COUNT_OPTIONS|SIZE_OPTIONS|COUNT_OPTIONS/.test(src), `${f}: fixed count ladder reintroduced`);
    assert.ok(/CountControl/.test(src), `${f}: must use the shared CountControl`);
  }

  // 5. The per-request ceiling must come from configuration, not a literal.
  const limits = readFileSync('src/lib/limits.ts', 'utf8');
  assert.ok(/VITE_GENERATION_MAX_PER_REQUEST/.test(limits), 'limits: generation ceiling must be configurable');

  console.log('PASS infinite expansion: captions and hashtags accept any count up to their curated pool, every tone carries >= 18 unique templates, no fixed 5/10/20 ladder remains, and the per-request ceiling is configurable');
} finally {
  rmSync(out, {recursive: true, force: true});
}
