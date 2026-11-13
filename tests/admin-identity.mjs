import assert from 'node:assert/strict';
import {authorizeRead,createProviderClient,AccessError} from '../admin-backend/server/identity.mjs';
const uid='11111111-1111-4111-8111-111111111111',sid='22222222-2222-4222-8222-222222222222',now=1700000000000;
const claims={iss:'https://jvpadtzfsuekixrquzjv.supabase.co/auth/v1',aud:'authenticated',role:'authenticated',aal:'aal2',is_anonymous:false,sub:uid,session_id:sid,exp:1700000100};
const token=c=>['eyJhbGciOiJub25lIn0',Buffer.from(JSON.stringify(c)).toString('base64url'),'signature'].join('.');
let calls=0;
const provider={auth:{getUser:async()=>{calls++;return {data:{user:{id:uid,is_anonymous:false}},error:null}}}};
const state={userId:uid,sessionId:sid,enabled:true,revoked:false,expiresAt:now+60000,permissions:['content.read']};
const run=(changes={},patch={})=>authorizeRead({token:token({...claims,...changes}),permission:'content.read',provider,resolveSession:async()=>state,now,...patch});
assert.deepEqual(await run(),{userId:uid,sessionId:sid});
for (const bad of [{iss:'https://elsewhere/auth/v1'},{aud:'anon'},{role:'service_role'},{aal:'aal1'},{is_anonymous:true},{exp:1700000000},{session_id:'wrong'}]) await assert.rejects(run(bad),AccessError);
await assert.rejects(run({}, {provider:{auth:{getUser:async()=>({data:{user:null},error:{message:'invalid signature'}})}}}),e=>e.code==='UNAUTHENTICATED');
await assert.rejects(run({}, {resolveSession:async()=>({...state,revoked:true})}),e=>e.code==='FORBIDDEN');
await assert.rejects(run({}, {resolveSession:async()=>({...state,permissions:[]})}),e=>e.code==='FORBIDDEN');
await assert.rejects(run({}, {resolveSession:undefined}),e=>e.code==='UNAVAILABLE');
await assert.rejects(run({}, {resolveSession:async()=>{throw Error('database offline')}}),e=>e.code==='UNAVAILABLE');
assert.throws(()=>createProviderClient('https://other.supabase.co','sb_publishable_x'));
assert.throws(()=>createProviderClient('https://jvpadtzfsuekixrquzjv.supabase.co','sb_secret_x'));
assert.throws(()=>createProviderClient('https://jvpadtzfsuekixrquzjv.supabase.co',token({role:'service_role'})));
assert(calls>0);
// Exercise the real Supabase SDK request path using an intercepted HTTP fetch;
// the fixture does not perform real JWT verification or contact Supabase.
const originalFetch = globalThis.fetch;
try {
  let observed;
  globalThis.fetch = async (url, init) => {
    observed = {url: String(url), authorization: new Headers(init.headers).get('authorization')};
    return new Response(JSON.stringify({id:uid,is_anonymous:false}), {status:200,headers:{'Content-Type':'application/json'}});
  };
  const realClient = createProviderClient('https://jvpadtzfsuekixrquzjv.supabase.co','sb_publishable_fixture');
  const jwt = token(claims);
  assert.deepEqual(await authorizeRead({token:jwt,permission:'content.read',provider:realClient,resolveSession:async()=>state,now}), {userId:uid,sessionId:sid});
  assert.equal(observed.url,'https://jvpadtzfsuekixrquzjv.supabase.co/auth/v1/user');
  assert.equal(observed.authorization,`Bearer ${jwt}`);
} finally { globalThis.fetch = originalFetch; }
console.log('PASS identity boundary with mock verification and intercepted Supabase SDK HTTP; no live auth tested');
