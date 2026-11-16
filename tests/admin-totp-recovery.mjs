// D2 recovery handshake, synthetic providers only. No network, no hosted Auth.
//
// The rule under test: a password session alone can never mint an Admin session
// for an account that once had a factor. Recovery needs a live, single-use,
// Super-Admin-issued grant, is single-use itself, and on success only records an
// authorisation — it removes no factor and issues no cookie.
import assert from 'node:assert/strict';
import {randomBytes,createHmac} from 'node:crypto';
import {createAuthController} from '../admin-backend/server/auth-controller.mjs';
import * as RG from '../admin-backend/server/recovery-grant.mjs';

const origin='https://preview.example';
const key=randomBytes(32);
const uid='11111111-1111-4111-8111-111111111111',sid='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const b64=value=>Buffer.from(JSON.stringify(value)).toString('base64url');
const token=claims=>{const exp=Math.floor(Date.now()/1000)+3600;
 return `${b64({alg:'HS256',typ:'JWT'})}.${b64({iss:'https://jvpadtzfsuekixrquzjv.supabase.co/auth/v1',aud:'authenticated',role:'authenticated',is_anonymous:false,sub:uid,session_id:sid,exp,...claims})}.${createHmac('sha256','x').update('x').digest('base64url')}`};
const aal1=token({aal:'aal1'}),aal2=token({aal:'aal2'});
const flowStore=()=>{const map=new Map();return {put:async(id,v)=>{map.set(id,JSON.parse(JSON.stringify(v)))},take:async id=>{const v=map.get(id);map.delete(id);return v},peek:id=>map.get(id)}};

function build({hasFactor=true,grantLive=true,redeem='ok',sessionStatus=200,gate}={}) {
 const store=flowStore();
 let signedOut=0,redemptions=0,grants=0;
 const client={auth:{
  signInWithPassword:async({password})=>password==='correct'?{data:{session:{access_token:aal1,refresh_token:'r'.repeat(30)}},error:null}:{error:{},data:{}},
  signOut:async()=>{signedOut++;return {error:null}},
  getUser:async()=>({data:{user:{id:uid,is_anonymous:false}},error:null}),
  mfa:{listFactors:async()=>({data:{totp:hasFactor?[{id:'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',status:'verified'}]:[]}}),
       enroll:async()=>({data:{id:'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',totp:{qr_code:'otpauth://totp/x?secret=ABCD',secret:'ABCD'}},error:null}),
       challengeAndVerify:async()=>({data:{access_token:aal2,refresh_token:'r'.repeat(30)},error:null})}}};
 const controller=createAuthController({enabled:true,origin,key,createClient:()=>client,flowStore:store,limiter:async()=>true,
  sessionHandler:async()=>new Response(JSON.stringify({ok:true}),{status:sessionStatus}),
  enrolment:async()=>true,
  // The database decides enrol vs recover; `gate` overrides for denial cases.
  factorGate:async()=>gate ?? (hasFactor?'recover':'enrol'),
  recovery:async request=>{
   if(request?.redeem===true){redemptions++;return redeem==='ok';}
   grants++;return grantLive;
  }});
 const post=(path,body,cookie)=>{const headers={'content-type':'application/json',origin};if(cookie)headers.cookie=cookie;
  return controller(new Request(`${origin}/api/admin/v1/auth/${path}`,{method:'POST',headers,body:JSON.stringify(body)}),'1.2.3.4')};
 return {post,store,counters:()=>({signedOut,redemptions,grants})};
}

// 1. An account that HAD a factor but now reports none is routed to recovery,
//    and no Admin cookie is issued.
{
 const {post,counters}=build({hasFactor:false,gate:'recover'});
 const login=await post('login',{email:'admin@example.com',password:'correct'});
 assert.equal(login.status,200);
 const body=await login.json();
 assert.deepEqual({mfa_required:body.mfa_required,enrolment:body.enrolment,recovery:body.recovery},{mfa_required:false,enrolment:false,recovery:true});
 const cookies=login.headers.getSetCookie();
 assert.ok(!cookies.some(c=>c.startsWith('__Host-biocraft-admin=')&&!/Max-Age=0/.test(c)),'no admin cookie on recovery path');
 assert.match(cookies.find(c=>c.startsWith('__Host-biocraft-pending=')),/HttpOnly; Secure; SameSite=Strict; Max-Age=300/);
 assert.equal(body.enrolment,false);
 assert.equal(counters().grants,1);
}
// 1b. A healthy factor holder still follows the ordinary TOTP path.
{
 const {post,counters}=build({hasFactor:true});
 const login=await post('login',{email:'admin@example.com',password:'correct'});
 assert.equal(login.status,200);
 const body=await login.json();
 assert.deepEqual({mfa_required:body.mfa_required,enrolment:body.enrolment,recovery:body.recovery},{mfa_required:true,enrolment:false,recovery:undefined});
 assert.equal(counters().grants,0,'no recovery work for a normal login');
}
// 2. Without a database decision the password step fails closed and the provider
//    session is destroyed, so nothing is left to replay.
{
 const {post,counters}=build({hasFactor:false,gate:'denied'});
 const login=await post('login',{email:'admin@example.com',password:'correct'});
 assert.equal(login.status,403);
 assert.equal((await login.json()).error.code,'FORBIDDEN');
 assert.ok(counters().signedOut>=1);
 assert.ok(!login.headers.getSetCookie().some(c=>c.includes('__Host-biocraft-pending=')&&!/Max-Age=0/.test(c)));
}
// 2b. A recovery handshake that has no live grant is refused even when the
//     database says 'recover'.
{
 const {post,counters}=build({hasFactor:false,gate:'recover',grantLive:false});
 const login=await post('login',{email:'admin@example.com',password:'correct'});
 assert.equal(login.status,403);
 assert.ok(counters().signedOut>=1);
}
// 3. A genuinely new administrator (never enrolled) may enrol, but still gets no
//    Admin session until the factor is confirmed.
{
 const {post}=build({hasFactor:false,gate:'enrol'});
 const login=await post('login',{email:'admin@example.com',password:'correct'});
 assert.equal(login.status,200);
 assert.equal((await login.json()).enrolment,true);
 assert.ok(!login.headers.getSetCookie().some(c=>c.startsWith('__Host-biocraft-admin=')&&!/Max-Age=0/.test(c)));
}
// 4. Redemption requires the pending cookie, CSRF, and a recovery-type flow.
{
 const {post,store}=build();
 const id=randomBytes(32).toString('base64url'),csrf=randomBytes(32).toString('base64url');
 await store.put(id,{session:{access_token:aal1},csrf,type:'recovery'},300);
 assert.equal((await post('recovery/complete',{csrf,code:'abcd-efgh-2345'})).status,401);
 assert.equal((await post('recovery/complete',{csrf:csrf.slice(0,-1)+'A',code:'abcd-efgh-2345'},`__Host-biocraft-pending=${id}`)).status,401);
 await store.put(id,{session:{access_token:aal1},csrf,type:'password'},300);
 assert.equal((await post('recovery/complete',{csrf,code:'abcd-efgh-2345'},`__Host-biocraft-pending=${id}`)).status,401);
 assert.equal((await post('recovery/complete',{code:'abcd-efgh-2345'},`__Host-biocraft-pending=${id}`)).status,400);
}
// 5. The flow is single use, and a successful redemption issues no session.
{
 const {post,store,counters}=build();
 const id=randomBytes(32).toString('base64url'),csrf=randomBytes(32).toString('base64url');
 await store.put(id,{session:{access_token:aal1},csrf,type:'recovery'},300);
 const ok=await post('recovery/complete',{csrf,code:'abcd-efgh-2345'},`__Host-biocraft-pending=${id}`);
 assert.equal(ok.status,200);
 const body=await ok.json();
 assert.equal(body.ok,true);assert.equal(body.csrf,undefined);
 assert.equal(body.next,'contact_operator');
 assert.equal(store.peek(id),undefined,'pending flow must be consumed');
 assert.ok(!ok.headers.getSetCookie().some(c=>c.startsWith('__Host-biocraft-admin=')&&!/Max-Age=0/.test(c)));
 const replay=await post('recovery/complete',{csrf,code:'abcd-efgh-2345'},`__Host-biocraft-pending=${id}`);
 assert.equal(replay.status,401);
 assert.equal(counters().redemptions,1);
}
// 6. A rejected redemption is 401 and never reaches a success shape.
{
 const {post,store,counters}=build({redeem:'deny'});
 const id=randomBytes(32).toString('base64url'),csrf=randomBytes(32).toString('base64url');
 await store.put(id,{session:{access_token:aal1},csrf,type:'recovery'},300);
 const response=await post('recovery/complete',{csrf,code:'abcd-efgh-2345'},`__Host-biocraft-pending=${id}`);
 assert.equal(response.status,401);
 assert.equal((await response.json()).error.code,'UNAUTHENTICATED');
 assert.equal(counters().redemptions,1);
}
// 7. Cross-origin and query-string variants are refused before any work.
{
 const {post}=build();
 const app=createAuthController({enabled:true,origin,key,createClient:()=>({}),flowStore:flowStore(),limiter:async()=>true,
  sessionHandler:async()=>new Response('',{status:200}),enrolment:async()=>true,recovery:async()=>true});
 const cross=await app(new Request(`${origin}/api/admin/v1/auth/recovery/complete`,{method:'POST',headers:{origin:'https://evil.example','content-type':'application/json'},body:'{"csrf":"x"}'}),'k');
 assert.equal(cross.status,403);
 const query=await app(new Request(`${origin}/api/admin/v1/auth/recovery/complete?x=1`,{method:'POST',headers:{origin,'content-type':'application/json'},body:'{"csrf":"x"}'}),'k');
 assert.equal(query.status,403);
 assert.equal(typeof post,'function');
}
// 8. Code format: the checksum rejects a typo before a rate-limited attempt is
//    spent, and normalisation is tolerant of case and separators only.
{
 const g=RG.issueRecoveryCode();
 assert.equal(g.code.length,14);assert.equal(g.salt.length,8);assert.equal(g.codeHash.length,32);
 assert.ok(RG.isWellFormedRecoveryCode(g.code));
 assert.ok(RG.isWellFormedRecoveryCode(g.code.toUpperCase().replace(/-/g,' ')));
 assert.ok(RG.isWellFormedRecoveryCode(g.code.replace(/-/g,'')));
 const swapped=(g.code[0]==='0'?'1':'0')+g.code.slice(1);
 assert.equal(RG.isWellFormedRecoveryCode(swapped),false);
 assert.equal(RG.isWellFormedRecoveryCode('aaaaaaaaaaaa'),false);
 assert.equal(RG.normaliseRecoveryCode('ABCD-EFGH-2345'),'abcdefgh2345');
 // Crockford folding: O->0, I/L->1, U->V, so a hand-written code still matches.
 assert.equal(RG.normaliseRecoveryCode('OI-LU'),'011v');
 // Deterministic output for a fixed random source, and the digest is salted.
 const fixed=n=>Buffer.alloc(n,0);
 const one=RG.issueRecoveryCode({random:fixed}),two=RG.issueRecoveryCode({random:n=>Buffer.alloc(n,7)});
 assert.notEqual(one.codeHash.toString('hex'),two.codeHash.toString('hex'));
 assert.equal(RG.issueRecoveryCode({random:fixed}).code,one.code);
 assert.notEqual(RG.digestRecoveryCode(one.code,Buffer.alloc(8,0)).toString('hex'),
  RG.digestRecoveryCode(one.code,Buffer.alloc(8,1)).toString('hex'));
}
// 9. Simulated end-to-end: Super Admin issues, the recovering account redeems,
//    and the same code cannot be redeemed twice even with a correct salt.
{
 let stored=null;
 const execute=async({identity,operation,args})=>{
  if(operation==='recoveryIssue'){stored={salt:args[2],hash:args[1],grantId:'dddddddd-dddd-4ddd-8ddd-dddddddddddd',attempts:0};return [{grant_id:stored.grantId}];}
  if(operation==='recoveryState')return stored?[{salt:stored.salt,attempts_remaining:5-stored.attempts,expires_at:new Date(Date.now()+600000).toISOString()}]:[];
  if(operation==='recoveryRedeem'){const ok=stored&&args[0].equals(stored.hash);if(ok)stored=null;return [{outcome:ok?'ok':'mismatch'}];}
  throw Error('unexpected operation');
 };
 const issuer={userId:'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',sessionId:'cccccccc-cccc-4ccc-8ccc-cccccccccccc',assuranceLevel:'aal2',mfaVerifiedAt:Math.floor(Date.now()/1000)};
 const recovering={userId:uid,sessionId:sid,assuranceLevel:'aal1',mfaVerifiedAt:null};
 const issued=await RG.issueRecoveryGrant({execute,identity:issuer,targetUserId:uid});
 assert.equal(issued.grantId,stored.grantId);
 const first=await RG.redeemRecoveryCode({execute,identity:recovering,code:issued.code});
 assert.equal(first.ok,true);
 assert.equal(first.next,'factor_reset_required');
 await assert.rejects(RG.redeemRecoveryCode({execute,identity:recovering,code:issued.code}),e=>e.code==='UNAUTHENTICATED');
 // A Super Admin may not authorise themselves, and the wrapper refuses aal1.
 await assert.rejects(RG.issueRecoveryGrant({execute,identity:issuer,targetUserId:issuer.userId}),e=>e.code==='FORBIDDEN');
 await assert.rejects(RG.issueRecoveryGrant({execute,identity:{...issuer,assuranceLevel:'aal1'},targetUserId:uid}),e=>e.code==='FORBIDDEN');
}
// 10. Cleanup scheduling: both targets run, one failure does not skip the other,
//     and no audit table can ever be named.
{
 const seen=[];
 const execute=async({identity,operation,args})=>{
  assert.equal(identity.assuranceLevel,'aal2');
  seen.push(args[0]);
  if(args[0]==='admin_rate_limits')throw Object.assign(Error('denied'),{code:'42501'});
  return [{deleted:3}];
 };
 const identity={userId:uid,sessionId:sid,assuranceLevel:'aal2',mfaVerifiedAt:Math.floor(Date.now()/1000)};
 const batch=await RG.runCleanupBatch({execute,identity,limit:250});
 assert.deepEqual(seen,['admin_login_flows','admin_rate_limits']);
 assert.equal(batch.results[0].deleted,3);
 assert.equal(batch.results[1].error,'42501');
 await assert.rejects(RG.runCleanup({execute,identity,target:'admin_audit_logs'}),e=>e.code==='INVALID');
 await assert.rejects(RG.runCleanup({execute,identity,target:'admin_login_flows',limit:0}),e=>e.code==='INVALID');
 await assert.rejects(RG.runCleanup({execute,identity,target:'admin_login_flows',limit:1001}),e=>e.code==='INVALID');
 await assert.rejects(RG.runCleanup({execute,identity:{...identity,assuranceLevel:'aal1'},target:'admin_login_flows'}),e=>e.code==='FORBIDDEN');
}
console.log('PASS TOTP recovery: password-only path fails closed, Super-Admin grant required, single-use redemption, no session or factor change, checksum rejects typos, bounded dual-target cleanup');
