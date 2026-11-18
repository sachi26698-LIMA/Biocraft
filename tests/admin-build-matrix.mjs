// Admin build-matrix guard.
//
// The failure this exists to prevent is specific and was live: a Preview build
// whose branch was not in a hardcoded list emitted NO admin chunk while the
// static shells still pointed at one. Every Admin route then served a document
// that 404'd its own script — a blank page with no server error to notice.
//
// So the invariant tested here is not "does it build" but "can shells and chunks
// ever disagree". Each scope is built twice through the real vite config and the
// real build-shells script, then the two outputs are compared.
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {existsSync, readdirSync, readFileSync, rmSync} from 'node:fs';

const DIST = 'dist';

function build(env) {
  rmSync(DIST, {recursive: true, force: true});
  execFileSync('npx', ['vite', 'build'], {env: {...process.env, ...env}, stdio: 'pipe'});
  execFileSync('node', ['scripts/build-shells.mjs'], {env: {...process.env, ...env}, stdio: 'pipe'});
  const assets = existsSync(`${DIST}/assets`) ? readdirSync(`${DIST}/assets`) : [];
  const chunks = assets.filter(f => /^admin-.*\.js$/.test(f));
  const shells = existsSync(`${DIST}/admin`)
    ? ['admin', ...readdirSync(`${DIST}/admin`, {withFileTypes: true}).filter(d => d.isDirectory()).map(d => `admin/${d.name}`)]
    : [];
  return {chunks, shells};
}

const cases = [
  {
    name: 'preview, flag off',
    env: {VERCEL_ENV: 'preview', VERCEL_GIT_COMMIT_REF: 'arena/some-new-branch'},
    expectChunks: false,
  },
  {
    name: 'preview, flag on (any branch)',
    env: {VERCEL_ENV: 'preview', VERCEL_GIT_COMMIT_REF: 'arena/a-branch-that-did-not-exist-before', BIOCRAFT_ADMIN_ENABLED: 'true'},
    expectChunks: true,
  },
  {
    name: 'production, flag off',
    env: {VERCEL_ENV: 'production'},
    expectChunks: false,
  },
  {
    name: 'production, BIOCRAFT_ADMIN_PRODUCTION',
    env: {VERCEL_ENV: 'production', BIOCRAFT_ADMIN_PRODUCTION: 'true'},
    expectChunks: true,
  },
];

for (const testCase of cases) {
  const {chunks, shells} = build(testCase.env);

  // 1. The flag decides whether the console exists at all.
  assert.equal(
    chunks.length > 0,
    testCase.expectChunks,
    `${testCase.name}: expected ${testCase.expectChunks ? 'an' : 'no'} admin chunk, got [${chunks.join(', ')}]`,
  );

  // 2. Shells and chunks must agree. This is the blank-page guard.
  if (chunks.length === 0) {
    assert.equal(shells.length, 0, `${testCase.name}: ${shells.length} admin shells were written with no admin chunk — those routes would render blank`);
  } else {
    assert.deepEqual(shells.sort(), [
      'admin', 'admin/analytics', 'admin/audit-logs', 'admin/backup', 'admin/bios', 'admin/categories',
      'admin/collections', 'admin/content', 'admin/generators', 'admin/login', 'admin/platforms',
      'admin/recovery', 'admin/security', 'admin/settings', 'admin/users',
      ...JSON.parse(readFileSync('shared/admin-extra-modules.json', 'utf8')).map(({key}) => `admin/${key}`),
    ].sort());
    for (const shell of shells) {
      const shellHtml = readFileSync(`${DIST}/${shell}/index.html`, 'utf8');
      for (const chunk of chunks) {
        assert.ok(shellHtml.includes(chunk), `${testCase.name}: /${shell} does not reference ${chunk}`);
      }
    }
  }
  console.log(`ok  ${testCase.name}: chunks=${chunks.length} shells=${shells.length}`);
}

rmSync(DIST, {recursive: true, force: true});
console.log('PASS admin build matrix: flag decides the scope, shells and chunks never disagree, every shell references a real chunk');
