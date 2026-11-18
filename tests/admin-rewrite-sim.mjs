// End-to-end local simulation of the Vercel rewrite -> function path.
//
// The public Preview is SSO-protected, so hosted verification of routing is not
// possible from this sandbox. This test reproduces the exact two hops that
// Vercel performs — `/api/admin/v1/<path>` becomes
// `/api/admin/handler?__admin_path=<path>&path=<path>` (both parameters are in
// the READY deployment's route table), then the entry rebuilds the URL and runs
// the real serverless handler — and asserts the request reaches the application
// instead of a static 404 page, carrying exactly the client's own parameters.
import assert from 'node:assert/strict';
import http from 'node:http';
import {once} from 'node:events';
import entry, {restoreAdminUrl} from '../api/admin/handler.mjs';

// This test must never load an operator's enabled application.
process.env.ADMIN_BACKEND_ENABLED='false';
const seen = [];
const server = http.createServer((req, res) => {
  // Hop 1: what vercel.json does for /api/admin/v1/:path*
  const url = new URL(req.url, 'http://127.0.0.1');
  if (/^\/api\/admin\/v1\//.test(url.pathname)) {
    const rest = url.pathname.replace('/api/admin/v1/', '');
    const query = url.search ? `&${url.search.slice(1)}` : '';
    // Verbatim from the deployment route table: `?__admin_path=$1&path=$1`.
    // Reproducing only the first half is what let a stray `path` parameter
    // reach the API and fail every paged read with 400 INVALID.
    req.url = `/api/admin/handler?__admin_path=${rest}&path=${rest}${query}`;
  }
  // Hop 2: the function entry rebuilds the URL. With no ADMIN_BACKEND_ENABLED
  // the app is disabled, so every API path must answer 503 JSON.
  req.seen = req.url;
  seen.push(req.url);
  return entry(req, res);
});
server.listen(0, '127.0.0.1');
await once(server, 'listening');
const base = `http://127.0.0.1:${server.address().port}`;

async function call(path) {
  const response = await fetch(base + path, {headers: {accept: 'application/json'}});
  const text = await response.text();
  return {status: response.status, type: response.headers.get('content-type') ?? '', text};
}

try {
  for (const path of ['/api/admin/v1/health', '/api/admin/v1/session', '/api/admin/v1/csrf',
    '/api/admin/v1/auth/login', '/api/admin/v1/auth/enroll-confirm',
    '/api/admin/v1/bio-drafts', '/api/admin/v1/settings?limit=5']) {
    const result = await call(path);
    assert.equal(result.status, 503, `${path} -> ${result.status}`);
    assert.match(result.type, /application\/json/, `${path} is not JSON (static fallback would be HTML)`);
    assert.deepEqual(JSON.parse(result.text), {error: {code: 'UNAVAILABLE',...(path==='/api/admin/v1/health'?{stage:'disabled'}:{})}}, path);
  }
  // The rewrite must only touch /api/admin/v1/*: a non-API path reaches the
  // entry with its URL unchanged (in production Vercel serves the SPA shell).
  await call('/admin/login');
  assert.ok(seen.includes('/admin/login'), 'rewrite must not touch non-API paths');
  assert.ok(seen.includes('/api/admin/handler?__admin_path=health&path=health'), 'API path must be rewritten with the full Vercel rewrite');
  // The marker never survives into the application URL.
  assert.equal(restoreAdminUrl('/api/admin/handler?__admin_path=health&limit=5'), '/api/admin/v1/health?limit=5');
  // The duplicated capture must be dropped, and nothing else touched.
  assert.equal(restoreAdminUrl('/api/admin/handler?__admin_path=staff&path=staff'),
    '/api/admin/v1/staff', 'the rewrite duplicate must be dropped');
  assert.equal(restoreAdminUrl('/api/admin/handler?__admin_path=staff&path=staff&limit=25'),
    '/api/admin/v1/staff?limit=25', 'client parameters must survive');
  assert.equal(restoreAdminUrl('/api/admin/handler?__admin_path=bios&path=bios&after=abc&search=love&active=true'),
    '/api/admin/v1/bios?after=abc&search=love&active=true', 'every client parameter must survive');
  assert.equal(restoreAdminUrl('/api/admin/handler?__admin_path=x&path=something-else'),
    '/api/admin/v1/x?path=something-else', 'a divergent path parameter is a client parameter, not a duplicate');
  // No paged route may receive a parameter the API has not allow-listed.
  for (const route of ['analytics','audit-logs','backups','bio-drafts','bios','notifications',
    'publication-jobs','publications','roles','settings','staff','sessions','session',
    'platforms','categories','collections','generators','seo-pages','templates','designs','published/emoji','published/symbols','published/languages','catalog-drafts']) {
    const restored = restoreAdminUrl(`/api/admin/handler?__admin_path=${route}&path=${route}`);
    assert.equal(restored, `/api/admin/v1/${route}`, `${route} must carry no stray parameter`);
    assert.deepEqual([...new URL('https://x' + restored).searchParams.keys()], [], `${route} must have an empty query`);
  }
  console.log('PASS rewrite simulation: 7 Admin API paths reach the function as JSON 503 (disabled), not a static page;'
    + ' the Vercel rewrite duplicate is dropped and 24 routes carry no stray parameter');
} finally { server.close(); await once(server, 'close'); }
