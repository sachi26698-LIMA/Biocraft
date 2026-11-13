// TOTP enrolment flow, synthetic providers only. No network, no hosted Auth.
// Verifies: single-use pending flow, CSRF, AAL1 acceptance only on enrolment,
// membership gate before factor creation, bounded cookie, and fail-closed paths.
import assert from 'node:assert/strict';
import {randomBytes,createHmac} from 'node:crypto';
import {createAuthController} from '../admin-backend/server/auth-controller.mjs';
const origin='https://preview.example';
const key=randomBytes(32);
const uid='11111111-1111-4111-8111-111111111111',sid='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const b64=value=>Buffer.from(JSON.stringify(value)).toString('base64url');
const token=(claims)=>{const exp=Math.floor(Date.now()/1000)+3600;const header=b64({alg:'HS256',typ:'JWT'});
 return `${header}.${b64({iss:'https://jvpadtzfsuekixrquzjv.supabase.co/auth/v1',aud:'authenticated',role:'authenticated',is_anonymous:false,sub:uid,session_id:sid,exp,...claims})}.${createHmac('sha256','x').update('x').digest('base64url')}`};
const aal1=token({aal:'aal1'}),aal2=token({aal:'aal2'});
const flowStore=()=>{const map=new Map();return {put:async(id,v)=>{map.set(id,JSON.parse(JSON.stringify(v)))},take:async id=>{const v=map.get(id);map.delete(id);return v},peek:id=>map.get(id)}};
const enrollmentResults=[true,false,Error('db down')];
function build({enrolment='allow',sessionStatus=200,factor}){
 const store=flowStore();let enrolled=0,confirmed=0;
 const client={auth:{
  setSession:async()=>({data:{session:{access_token:aal1}},error:null}),
  getUser:async()=>({data:{user:{id:uid,is_anonymous:false}},error:null}),
  signOut:async()=>({error:null}),
  mfa:{
   enroll:async()=>{enrolled++;return factor??{data:{id:'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',totp:{qr_code:'otpauth://totp/Biocraft:admin?secret=JBSWY3DPEHPK3PXP',secret:'JBSWY3DPEHPK3PXP'}},error:null}},
   challengeAndVerify:async()=>{confirmed++;return {data:{access_token:aal2,refresh_token:'r'.repeat(20)},error:null}}},
 }};
 const app=createAuthController({enabled:true,origin,key,createClient:()=>client,flowStore:store,limiter:async()=>true,
  sessionHandler:async()=>new Response(JSON.stringify({ok:true}),{status:sessionStatus}),
  enrolment:async()=>{if(enrolment==='allow')return true;if(enrolment==='deny')throw Error('no');throw Error('down')}});
 const post=(path,body,cookie)=>{const headers={'content-type':'application/json',origin};if(cookie)headers.cookie=cookie;
  return app(new Request(`${origin}/api/admin/v1/auth/${path}`,{method:'POST',headers,body:JSON.stringify(body)}),'1.2.3.4')};
 return {post,store,counters:()=>({enrolled,confirmed})};
}
// 1. Missing wiring fails closed before any provider call.
const closed=await createAuthController({enabled:true,origin,key,createClient:()=>({}),flowStore:flowStore(),limiter:async()=>true,sessionHandler:async()=>new Response('',{status:200})})(new Request(`${origin}/api/admin/v1/auth/enroll`,{method:'POST',headers:{origin,'content-type':'application/json'},body:'{"csrf":"x"}'}),'k');
assert.equal(closed.status,503);
// 2. A password flow is required and the pending cookie is single-use.
{
 const {post,store}=build({enrolment:'allow'});
 const id=randomBytes(32).toString('base64url'),csrf=randomBytes(32).toString('base64url');
 await store.put(id,{session:{access_token:aal1,refresh_token:'r'},factorId:'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',csrf,type:'password'},300);
 const first=await post('enroll',{csrf},`__Host-biocraft-pending=${id}`);
 assert.equal(first.status,200);
 const body=await first.json();
 assert.equal(body.enrolment,true);assert.equal(body.mfa_required,false);
 assert.match(body.otpauth_uri,/^otpauth:\/\/totp\//);
 assert.equal(JSON.stringify(body).includes('JBSWY3DPEHPK3PXP')&&JSON.stringify(Object.keys(body)).includes('secret'),false);
 assert.match(first.headers.get('set-cookie'),/__Host-biocraft-pending=.+HttpOnly; Secure; SameSite=Strict; Max-Age=300/);
 assert.equal(store.peek(id),undefined);
 const replay=await post('enroll',{csrf},`__Host-biocraft-pending=${id}`);
 assert.equal(replay.status,401);assert.equal((await replay.json()).error.code,'UNAUTHENTICATED');
}
// 3. Wrong CSRF, wrong flow type and an enrolment-type flow cannot start enrolment.
{
 const {post,store,counters}=build({enrolment:'allow'});
 const id=randomBytes(32).toString('base64url'),csrf=randomBytes(32).toString('base64url');
 await store.put(id,{session:{access_token:aal1},factorId:'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',csrf,type:'password'},300);
 assert.equal((await post('enroll',{csrf:'A'.repeat(43)},`__Host-biocraft-pending=${id}`)).status,401);
 await store.put(id,{session:{access_token:aal1},factorId:'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',csrf,type:'enrolment'},300);
 assert.equal((await post('enroll',{csrf},`__Host-biocraft-pending=${id}`)).status,401);
 assert.equal(counters().enrolled,0);
}
// 4. No pending cookie, malformed cookie and duplicated cookie are rejected.
for(const cookie of [undefined,'__Host-biocraft-pending=short',`__Host-biocraft-pending=${'a'.repeat(43)}; __Host-biocraft-pending=${'b'.repeat(43)}`]) {
 const {post,counters}=build({enrolment:'allow'});
 assert.equal((await post('enroll',{csrf:'B'.repeat(43)},cookie)).status,401);
 assert.equal(counters().enrolled,0);
}
// 5. Membership gate denies before any factor is created, and DB failure too.
for(const mode of ['deny','error']) {
 const {post,store,counters}=build({enrolment:mode});
 const id=randomBytes(32).toString('base64url'),csrf=randomBytes(32).toString('base64url');
 await store.put(id,{session:{access_token:aal1},factorId:'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',csrf,type:'password'},300);
 const denied=await post('enroll',{csrf},`__Host-biocraft-pending=${id}`);
 assert.equal(denied.status,403);assert.equal((await denied.json()).error.code,'FORBIDDEN');
 assert.equal(counters().enrolled,0);
 assert.match(denied.headers.get('set-cookie'),/Max-Age=0/);
}
// 6. Enrolment accepts AAL1 but still rejects a token that fails provider verification.
{
 const {post,store,counters}=build({enrolment:'allow'});
 const id=randomBytes(32).toString('base64url'),csrf=randomBytes(32).toString('base64url');
 await store.put(id,{session:{access_token:'not.a.jwt'},factorId:'x',csrf,type:'password'},300);
 assert.equal((await post('enroll',{csrf},`__Host-biocraft-pending=${id}`)).status,401);
 assert.equal(counters().enrolled,0);
}
// 7. A provider that returns no QR/secret fails closed and creates no flow.
{
 const {post,store}=build({enrolment:'allow',factor:{data:{id:'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',totp:{}},error:null}});
 const id=randomBytes(32).toString('base64url'),csrf=randomBytes(32).toString('base64url');
 await store.put(id,{session:{access_token:aal1},factorId:'x',csrf,type:'password'},300);
 const response=await post('enroll',{csrf},`__Host-biocraft-pending=${id}`);
 assert.equal(response.status,503);assert.match(response.headers.get('set-cookie'),/Max-Age=0/);
}
// 8. Confirmation requires an enrolment flow, a valid code and re-checks membership.
{
 const {post,store}=build({enrolment:'allow'});
 const id=randomBytes(32).toString('base64url'),csrf=randomBytes(32).toString('base64url');
 await store.put(id,{session:{access_token:aal1},factorId:'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',csrf,type:'password'},300);
 assert.equal((await post('enroll-confirm',{csrf,code:'123456'},`__Host-biocraft-pending=${id}`)).status,401);
 await store.put(id,{session:{access_token:aal1},factorId:'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',csrf,type:'enrolment'},300);
 assert.equal((await post('enroll-confirm',{csrf,code:'12'},`__Host-biocraft-pending=${id}`)).status,401);
 await store.put(id,{session:{access_token:aal1},factorId:'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',csrf,type:'enrolment'},300);
 assert.equal((await post('enroll-confirm',{csrf,code:'123456'},`__Host-biocraft-pending=${id}`)).status,200);
}
// 9. Successful confirmation issues a bounded __Host admin cookie and no tokens.
{
 const {post,store,counters}=build({enrolment:'allow'});
 const id=randomBytes(32).toString('base64url'),csrf=randomBytes(32).toString('base64url');
 await store.put(id,{session:{access_token:aal1},factorId:'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',csrf,type:'enrolment'},300);
 const response=await post('enroll-confirm',{csrf,code:'123456'},`__Host-biocraft-pending=${id}`);
 assert.equal(response.status,200);
 const body=await response.json();assert.equal(body.ok,true);assert.match(body.csrf,/^[A-Za-z0-9_-]{43}$/);
 const cookies=response.headers.getSetCookie();
 const sessionCookie=cookies.find(c=>c.startsWith('__Host-biocraft-admin='));
 assert.ok(sessionCookie);assert.match(sessionCookie,/HttpOnly; Secure; SameSite=Strict/);
 assert.ok(!sessionCookie.includes(aal2));assert.equal(counters().confirmed,1);
}
// 10. A session handler rejection must not yield a usable cookie.
for(const status of [401,403,503]) {
 const {post,store}=build({enrolment:'allow',sessionStatus:status});
 const id=randomBytes(32).toString('base64url'),csrf=randomBytes(32).toString('base64url');
 await store.put(id,{session:{access_token:aal1},factorId:'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',csrf,type:'enrolment'},300);
 const response=await post('enroll-confirm',{csrf,code:'123456'},`__Host-biocraft-pending=${id}`);
 assert.equal(response.status,status);
 assert.ok(!response.headers.getSetCookie().some(c=>c.startsWith('__Host-biocraft-admin=')&&!/Max-Age=0/.test(c)));
}
// 11. Cross-origin and query-string variants are forbidden before any work.
{
 const {post}=build({enrolment:'allow'});
 const cross=await createAuthController({enabled:true,origin,key,createClient:()=>({}),flowStore:flowStore(),limiter:async()=>true,sessionHandler:async()=>new Response('',{status:200}),enrolment:async()=>true})(
  new Request(`${origin}/api/admin/v1/auth/enroll`,{method:'POST',headers:{origin:'https://evil.example','content-type':'application/json'},body:'{"csrf":"x"}'}),'k');
 assert.equal(cross.status,403);
 const query=await createAuthController({enabled:true,origin,key,createClient:()=>({}),flowStore:flowStore(),limiter:async()=>true,sessionHandler:async()=>new Response('',{status:200}),enrolment:async()=>true})(
  new Request(`${origin}/api/admin/v1/auth/enroll?x=1`,{method:'POST',headers:{origin,'content-type':'application/json'},body:'{"csrf":"x"}'}),'k');
 assert.equal(query.status,403);
 assert.equal(typeof post,'function');
}
console.log('PASS TOTP enrolment: single-use pending flow, CSRF checks, AAL1 accepted only after DB membership gate, provider fail-closed, bounded __Host cookie, no tokens or secrets returned');
