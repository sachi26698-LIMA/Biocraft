/**
 * The public content status endpoint used to probe Supabase REST to report
 * whether the database-backed catalogue was reachable.
 *
 * Public content is now bundled, so that probe has been removed: there is no
 * remote content service whose health could matter to a public page, and
 * reporting "ok" because a database is up would misrepresent the architecture.
 *
 * This test asserts the endpoint reports the new truth, uses no network, and
 * keeps its response contract stable for existing monitors.
 */
import assert from 'node:assert/strict';
import { SUPABASE_URL, publicSupabaseConfig } from '../shared/supabase-config.mjs';
import handler from '../api/status/content.mjs';
import { checkPublicContent } from '../shared/public-content-check.mjs';

// The shared config helper is still used by the Admin API, so its key-scoping
// rules must keep working: only an anon/publishable key for this project passes.
const jwt = (role, ref) => `eyJhbGciOiJIUzI1NiJ9.${Buffer.from(JSON.stringify({ role, ref })).toString('base64url')}.sig`;
assert.ok(publicSupabaseConfig(SUPABASE_URL, jwt('anon', 'jvpadtzfsuekixrquzjv')), 'anon key for this project must be accepted');
assert.equal(publicSupabaseConfig(SUPABASE_URL, jwt('service_role', 'jvpadtzfsuekixrquzjv')), null, 'a service-role key must never be treated as public');
assert.equal(publicSupabaseConfig(SUPABASE_URL, jwt('anon', 'other')), null, 'another project must be rejected');
assert.equal(publicSupabaseConfig(SUPABASE_URL, 'sb_secret_not_public'), null, 'a secret key must be rejected');

/** Minimal response recorder. */
function call(method = 'GET') {
  const res = {
    statusCode: 200,
    headers: {},
    body: undefined,
    setHeader(k, v) { this.headers[k.toLowerCase()] = v; },
    end(payload) { this.body = payload; },
  };
  return handler({ method }, res).then(() => res);
}

// No network at all: replace fetch so any call would be caught.
const realFetch = globalThis.fetch;
let networkCalls = 0;
globalThis.fetch = () => { networkCalls++; throw new Error('the status endpoint must not contact the network'); };

const ok = await call('GET');
assert.equal(ok.statusCode, 200, 'GET must succeed');
assert.equal(ok.headers['cache-control'], 'no-store', 'status must not be cached by a CDN');
assert.equal(ok.headers['x-content-type-options'], 'nosniff');
assert.match(ok.headers['content-type'], /application\/json/);
const body = JSON.parse(ok.body);
assert.equal(body.ok, true);
assert.equal(body.source, 'bundled', 'content source must be reported as bundled');
assert.equal(body.database_required, false, 'public content must not require a database');

const wrongMethod = await call('POST');
assert.equal(wrongMethod.statusCode, 405, 'non-GET must be refused');
assert.equal(wrongMethod.headers.allow, 'GET');
assert.equal(JSON.parse(wrongMethod.body).error.code, 'METHOD_NOT_ALLOWED');

assert.equal(networkCalls, 0, 'the endpoint made a network call');
globalThis.fetch = realFetch;

console.log('PASS public content status: reports bundled source, no database required, no network, stable contract');

// Separate server-side diagnostic for Admin's DB-backed catalogue projections.
const env = {VITE_SUPABASE_URL:SUPABASE_URL,VITE_SUPABASE_PUBLISHABLE_KEY:'sb_publishable_test'};
assert.equal(await checkPublicContent({ADMIN_SUPABASE_PUBLISHABLE_KEY:env.VITE_SUPABASE_PUBLISHABLE_KEY},async()=>Response.json([{id:'fixture'}])),true);
assert.deepEqual(publicSupabaseConfig(undefined, env.VITE_SUPABASE_PUBLISHABLE_KEY), {url:SUPABASE_URL,key:env.VITE_SUPABASE_PUBLISHABLE_KEY});
assert.equal(publicSupabaseConfig('', env.VITE_SUPABASE_PUBLISHABLE_KEY),null);
assert.equal(publicSupabaseConfig(undefined, undefined),null);
assert.equal(await checkPublicContent({VITE_SUPABASE_PUBLISHABLE_KEY:env.VITE_SUPABASE_PUBLISHABLE_KEY},async()=>Response.json([{id:'fixture'}])),true);
assert.equal(await checkPublicContent({...env,VITE_SUPABASE_PUBLISHABLE_KEY:'sb_secret_not_public'}, () => assert.fail('must not contact database')),false);
assert.equal(await checkPublicContent({...env,VITE_SUPABASE_URL:'https://other.supabase.co'}, () => assert.fail('must not contact wrong project')),false);
assert.equal(await checkPublicContent(env, async (url, options) => {
  assert.equal(url,`${SUPABASE_URL}/rest/v1/bios?select=id&is_active=eq.true&limit=1`);
  assert.equal(options.headers.apikey,env.VITE_SUPABASE_PUBLISHABLE_KEY);
  assert.equal(options.redirect,'error');
  assert.ok(options.signal instanceof AbortSignal);
  return Response.json([{id:'fixture'}]);
}),true);
for(const response of [Response.json([]),Response.json([{id:'fixture'}],{status:403}), new Response('<html>login</html>')]) {
  assert.equal(await checkPublicContent(env, async () => response),false);
}
assert.equal(await checkPublicContent(env, async () => {throw Error('offline')}),false);
console.log('PASS pinned project and public key validation; bounded real-query readiness contract with simulated REST');
