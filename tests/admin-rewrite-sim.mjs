// End-to-end local simulation of the Vercel rewrite -> function path.
//
// The public Preview is SSO-protected, so hosted verification of routing is not
// possible from this sandbox. This test reproduces the exact two hops that
// Vercel performs — `/api/admin/v1/<path>` becomes
// `/api/admin/handler?__admin_path=<path>`, then the entry rebuilds the URL and
// runs the real serverless handler — and asserts the request reaches the
// application instead of a static 404 page.
import assert from 'node:assert/strict';
import http from 'node:http';
import {once} from 'node:events';
import entry, {restoreAdminUrl} from '../api/admin/handler.mjs';

const seen = [];
const server = http.createServer((req, res) => {
  // Hop 1: what vercel.json does for /api/admin/v1/:path*
  const url = new URL(req.url, 'http://127.0.0.1');
  if (/^\/api\/admin\/v1\//.test(url.pathname)) {
    const rest = url.pathname.replace('/api/admin/v1/', '');
    const query = url.search ? `&${url.search.slice(1)}` : '';
    req.url = `/api/admin/handler?__admin_path=${rest}${query}`;
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
    assert.deepEqual(JSON.parse(result.text), {error: {code: 'UNAVAILABLE'}}, path);
  }
  // The rewrite must only touch /api/admin/v1/*: a non-API path reaches the
  // entry with its URL unchanged (in production Vercel serves the SPA shell).
  await call('/admin/login');
  assert.ok(seen.includes('/admin/login'), 'rewrite must not touch non-API paths');
  assert.ok(seen.includes('/api/admin/handler?__admin_path=health'), 'API path must be rewritten');
  // The marker never survives into the application URL.
  assert.equal(restoreAdminUrl('/api/admin/handler?__admin_path=health&limit=5'), '/api/admin/v1/health?limit=5');
  console.log('PASS rewrite simulation: 7 Admin API paths reach the function as JSON 503 (disabled), not a static page');
} finally { server.close(); await once(server, 'close'); }
