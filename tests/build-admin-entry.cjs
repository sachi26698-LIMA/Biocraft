/**
 * Guard the Preview build's admin entry point.
 *
 * vite.config.ts emits the admin bundle only when BOTH VERCEL_ENV=preview and
 * VERCEL_GIT_COMMIT_REF=arena/5e351ec3-biocraft are set. That gate is right — the
 * public production build must never ship the console — but a local build missing
 * either variable silently produces a `dist` with no admin entry, and then every
 * Admin browser suite fails with a puzzling timeout while the public site looks
 * fine. It is easy to lose an hour to that. This turns the silent omission into an
 * immediate, explicit failure whenever the caller says it expects the console.
 */
const fs = require('node:fs');
const path = require('node:path');

const dist = path.join(process.cwd(), 'dist');
const expectAdmin = process.env.EXPECT_ADMIN_ENTRY === '1';

if (!fs.existsSync(dist)) {
  console.error('FAIL dist/ does not exist — run the build first');
  process.exit(1);
}

const assets = fs.readdirSync(path.join(dist, 'assets'));
const adminJs = assets.filter((f) => /^admin-.*\.js$/.test(f));
const shells = fs.existsSync(path.join(dist, 'admin'))
  ? fs.readdirSync(path.join(dist, 'admin')).length
  : 0;

if (expectAdmin) {
  if (adminJs.length === 0) {
    console.error(
      'FAIL EXPECT_ADMIN_ENTRY=1 but dist/assets has no admin-*.js.\n' +
        '     vite.config.ts requires BOTH:\n' +
        '       VERCEL_ENV=preview\n' +
        '       VERCEL_GIT_COMMIT_REF=arena/5e351ec3-biocraft\n' +
        '     Rebuild with both set.',
    );
    process.exit(1);
  }
  if (shells === 0) {
    console.error('FAIL admin bundle present but dist/admin/ has no route shells');
    process.exit(1);
  }
  console.log(`PASS admin entry present: ${adminJs.join(', ')}, ${shells} admin route shells`);
} else {
  if (adminJs.length > 0) {
    console.error(
      'FAIL a build without VERCEL_ENV=preview shipped an admin bundle — ' +
        'the console must not reach a non-Preview build',
    );
    process.exit(1);
  }
  console.log('PASS no admin entry in this build, as expected outside Preview');
}
