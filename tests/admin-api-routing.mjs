// Vercel routing contract for the Admin API.
//
// The UI calls `/api/admin/v1/<path>` with `credentials: same-origin`. Vercel
// cannot map an arbitrary-depth `/api/...` path onto one non-Next function, so
// `vercel.json` rewrites those paths to the single function with a marker query
// and the entry rebuilds the original URL. This test locks the two halves
// together: if either side drifts, every Admin request 404s at the edge while
// all unit tests still pass — the exact failure this test exists to prevent.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {restoreAdminUrl} from '../api/admin/handler.mjs';

const config = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
const rewrites = config.rewrites ?? [];

// 1. The catch-all rewrite that actually delivers API traffic must exist.
const api = rewrites.find(rule => /^\/api\/admin\/v1\//.test(rule.source ?? ''));
assert.ok(api, 'missing /api/admin/v1/:path* rewrite');
assert.equal(api.destination, '/api/admin/handler?__admin_path=:path*');
// A filesystem rewrite would shadow the function; none may match /api/admin.
for (const rule of rewrites) {
  if ((rule.destination ?? '').startsWith('/admin/index.html')) {
    assert.ok(!/^\/api\/admin/.test(rule.source ?? ''), 'admin shell must not shadow the API');
  }
}

// 2. Every URL the browser builds must round-trip through the rewrite intact.
const cases = [
  ['health', 'health'],
  ['session', 'session'],
  ['csrf', 'csrf'],
  ['auth/login', 'auth/login'],
  ['auth/mfa', 'auth/mfa'],
  ['auth/enroll', 'auth/enroll'],
  ['auth/enroll-confirm', 'auth/enroll-confirm'],
  ['auth/recovery/request', 'auth/recovery/request'],
  ['bio-drafts', 'bio-drafts'],
  ['bio-drafts/11111111-1111-4111-8111-111111111111', 'bio-drafts/11111111-1111-4111-8111-111111111111'],
  ['bio-review-queue', 'bio-review-queue'],
  ['roles', 'roles'],
  ['audit-logs', 'audit-logs'],
  ['seo-pages', 'seo-pages'],
  ['settings', 'settings'],
  ['staff', 'staff'],
  ['staff/recovery', 'staff/recovery'],
  ['staff/recovery/revoke', 'staff/recovery/revoke'],
  ['ops/cleanup', 'ops/cleanup'],
];
for (const [path, expected] of cases) {
  const forwarded = `/api/admin/handler?__admin_path=${path}`;
  assert.equal(restoreAdminUrl(forwarded), `/api/admin/v1/${expected}`, path);
}

// 3. Client query strings survive; the internal marker does not leak through.
assert.equal(restoreAdminUrl('/api/admin/handler?__admin_path=platforms&limit=50'),
  '/api/admin/v1/platforms?limit=50');
assert.equal(restoreAdminUrl('/api/admin/handler?limit=20&__admin_path=staff&after=abc'),
  '/api/admin/v1/staff?limit=20&after=abc');
assert.ok(!restoreAdminUrl('/api/admin/handler?__admin_path=settings').includes('__admin_path'));

// 4. Path traversal cannot escape the Admin API prefix.
assert.equal(restoreAdminUrl('/api/admin/handler?__admin_path=../../etc/passwd'), '/api/admin/v1/');
assert.equal(restoreAdminUrl('/api/admin/handler?__admin_path=..%2Fsecret'), '/api/admin/v1/');

// 5. The legacy single-path rewrite still resolves, and junk fails closed.
assert.equal(restoreAdminUrl('/api/admin/v1/proxy'), '/api/admin/v1');
assert.equal(restoreAdminUrl(undefined), '');
assert.equal(restoreAdminUrl(''), '');

// 6. The public app must never call the Admin API, and the Admin client must
//    only ever use the versioned prefix.
const backend = fs.readFileSync('src/admin/backend.ts', 'utf8');
assert.match(backend, /export const ADMIN_BASE = '\/api\/admin\/v1'/, 'Admin base path changed');
const app = fs.readdirSync('src/pages').map(f => fs.readFileSync(`src/pages/${f}`, 'utf8')).join('\n');
assert.ok(!/\/api\/admin/.test(app), 'public pages must not reference the Admin API');

console.log('PASS Admin API routing: catch-all function rewrite, 19 URL round-trips, query preservation, traversal rejected, public app isolated');
