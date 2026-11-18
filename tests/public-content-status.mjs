import assert from 'node:assert/strict';
import { SUPABASE_URL, publicSupabaseConfig } from '../shared/supabase-config.mjs';
import { checkPublicContent } from '../api/status/content.mjs';
const env = { VITE_SUPABASE_URL: SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_test' };
const jwt = (role, ref) => `eyJhbGciOiJIUzI1NiJ9.${Buffer.from(JSON.stringify({role,ref})).toString('base64url')}.sig`;
assert.ok(publicSupabaseConfig(SUPABASE_URL, jwt('anon','jvpadtzfsuekixrquzjv')));
assert.equal(publicSupabaseConfig(SUPABASE_URL, jwt('service_role','jvpadtzfsuekixrquzjv')),null);
assert.equal(publicSupabaseConfig(SUPABASE_URL, jwt('anon','other')),null);
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
