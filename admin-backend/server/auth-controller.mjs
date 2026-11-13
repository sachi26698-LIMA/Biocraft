// Server-only Auth HTTP controller, not mounted or deployed. The injected
// flowStore must durably encrypt tokens, enforce TTL and atomically take once.
// The injected limiter must be durable/shared and use a trusted client key.
// Never log request bodies, cookies, access tokens, refresh tokens or OTPs.
import {randomBytes,timingSafeEqual} from 'node:crypto';
import {beginPasswordLogin,verifyTotp,beginTotpEnrolment,confirmTotpEnrolment} from './auth-flow.mjs';
import {issueSessionCookie} from './session-cookie.mjs';
import {verifyEnrolmentIdentity} from './identity.mjs';
const PENDING='__Host-biocraft-pending';
const headers={'Cache-Control':'no-store','Content-Type':'application/json; charset=utf-8','X-Content-Type-Options':'nosniff'};
const cookie=(value,seconds)=>`${PENDING}=${value}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${seconds}`;
const out=(status,data,extra={})=>new Response(JSON.stringify(data),{status,headers:{...headers,...extra}});
async function json(request) {
 if(!/^application\/json(?:\s*;|$)/i.test(request.headers.get('content-type')??''))throw Error('invalid');
 const size=request.headers.get('content-length');if(size && (!/^\d+$/.test(size)||Number(size)>4096))throw Error('invalid');
 const reader=request.body?.getReader();if(!reader)throw Error('invalid');let parts=[],len=0;
 try{for(;;){const {done,value}=await reader.read();if(done)break;len+=value.length;if(len>4096){await reader.cancel();throw Error('invalid')}parts.push(value)}}finally{reader.releaseLock()}
 const body=JSON.parse(Buffer.concat(parts.map(x=>Buffer.from(x))).toString('utf8'));
 if(!body||typeof body!=='object'||Array.isArray(body))throw Error('invalid');return body;
}
function pending(request) {
 // A missing, duplicated or malformed pending cookie is an authentication
 // failure (401), never a server error, and never a 500.
 const h=request.headers.get('cookie')??'';if(h.length>8192)return null;
 const all=h.split(';').map(s=>s.trim()).filter(s=>s.startsWith(`${PENDING}=`));
 if(all.length!==1)return null;const id=all[0].slice(PENDING.length+1);
 if(!/^[A-Za-z0-9_-]{43}$/.test(id))return null;return id;
}
function same(a,b) {return typeof a==='string'&&typeof b==='string'&&/^[A-Za-z0-9_-]{43}$/.test(a)&&/^[A-Za-z0-9_-]{43}$/.test(b)&&timingSafeEqual(Buffer.from(a),Buffer.from(b));}
export function createAuthController({enabled=false,origin,key,createClient,flowStore,limiter,sessionHandler,enrolment,recovery,factorGate}={}) {
 return async function(request,remoteKey) {
  if(!enabled || !Buffer.isBuffer(key)||key.length!==32 || typeof createClient!=='function' || typeof limiter!=='function' ||
     typeof flowStore?.put!=='function' || typeof flowStore?.take!=='function' || typeof sessionHandler!=='function')return out(503,{error:{code:'UNAVAILABLE'}});
  // Establish the Admin session exactly as /auth/mfa does: bounded cookie plus a
  // database session record, or fail closed and clear the browser cookie.
  const establish=async session=>{
   const now=Date.now();let providerExpiry;
   try {const parts=session.access_token.split('.');
    if(parts.length!==3||!parts.every(p=>/^[A-Za-z0-9_-]+$/.test(p)))throw Error();
    providerExpiry=JSON.parse(Buffer.from(parts[1],'base64url').toString('utf8')).exp*1000;
    if(!Number.isSafeInteger(providerExpiry)||providerExpiry<=now)throw Error();
   } catch {return out(503,{error:{code:'UNAVAILABLE'}},{'Set-Cookie':cookie('',0)});}
   const issued=issueSessionCookie({key,accessToken:session.access_token,expiresAt:Math.min(providerExpiry,now+60*60*1000),now});
   let verified;try{verified=await sessionHandler(new Request(`${origin}/api/admin/v1/session`,{method:'POST',headers:{Authorization:`Bearer ${session.access_token}`}}));}
   catch{return out(503,{error:{code:'UNAVAILABLE'}},{'Set-Cookie':cookie('',0)});}
   if(verified.status!==200){const status=verified.status===401?401:verified.status===403?403:verified.status===429?429:503;
    return out(status,{error:{code:status===401?'UNAUTHENTICATED':status===403?'FORBIDDEN':status===429?'RATE_LIMITED':'UNAVAILABLE'}},{'Set-Cookie':cookie('',0)});}
   const response=out(200,{ok:true,csrf:issued.csrf});
   response.headers.append('Set-Cookie',cookie('',0));response.headers.append('Set-Cookie',issued.setCookie);return response;
  };
  let url;try {url=new URL(request.url);const o=new URL(origin);if(o.protocol!=='https:'||o.origin!==origin||url.origin!==origin||request.headers.get('origin')!==origin||request.method!=='POST'||url.search)throw Error();}catch{return out(403,{error:{code:'FORBIDDEN'}})}
  if(typeof remoteKey!=='string'||remoteKey.length<1||remoteKey.length>200)return out(503,{error:{code:'UNAVAILABLE'}});
  try {
   const enrolHook=typeof enrolment==='function'?enrolment:null;
   const recoverHook=typeof recovery==='function'?recovery:null;
   if(url.pathname==='/api/admin/v1/auth/login') {
    const body=await json(request);
    if(Object.keys(body).sort().join(',')!=='email,password')return out(400,{error:{code:'INVALID'}});
    const client=createClient();
    const login=await beginPasswordLogin({client,email:body.email,password:body.password,limiter,rateKey:remoteKey});
    const enrol=typeof enrolment==='function'?enrolment:null;
    // D2 hooks: `recovery` opens the Super-Admin-authorised path; `factorGate`
    // asks the database whether this account may enrol or must recover.
    const recover=recoverHook;
    const gate=typeof factorGate==='function'?factorGate:null;
    // D2: a password session with no verified factor may do exactly one of two
    // things, and the database decides which. 'enrol' means the account has never
    // proven a factor (genuinely new administrator); 'recover' means it had one
    // and lost it, which requires a Super-Admin-issued grant. Anything else fails
    // closed, so a password alone never creates a replacement factor.
    if (login.enrolmentRequired) {
     let decision=null;
     if(typeof gate==='function'){try{decision=await gate({session:login.session,attempt:'factor'});}catch{decision=null;}}
     if (decision==='enrol' && enrol) {
      const eid=randomBytes(32).toString('base64url'),ecsrf=randomBytes(32).toString('base64url');
      try {await flowStore.put(eid,{session:login.session,csrf:ecsrf,type:'password',enrolment:true},300);}
      catch {try{await client.auth.signOut({scope:'local'})}catch{};return out(503,{error:{code:'UNAVAILABLE'}});}
      return out(200,{mfa_required:false,enrolment:true,csrf:ecsrf},{'Set-Cookie':cookie(eid,300)});
     }
     if (decision==='recover' && recover) {
      // A recover decision is only actionable with a live grant; the hook proves
      // it before the pending flow is stored.
      let live=false;
      try {live=await recover({session:login.session,factorIds:login.factorIds});} catch {live=false;}
      if (!live) {try{await client.auth.signOut({scope:'local'})}catch{};return out(403,{error:{code:'FORBIDDEN'}},{'Set-Cookie':cookie('',0)});}
      const rid=randomBytes(32).toString('base64url'),rcsrf=randomBytes(32).toString('base64url');
      try {await flowStore.put(rid,{session:login.session,csrf:rcsrf,type:'recovery'},300);}
      catch {try{await client.auth.signOut({scope:'local'})}catch{};return out(503,{error:{code:'UNAVAILABLE'}});}
      return out(200,{mfa_required:false,enrolment:false,recovery:true,csrf:rcsrf},{'Set-Cookie':cookie(rid,300)});
     }
     try{await client.auth.signOut({scope:'local'})}catch{}
     return out(403,{error:{code:'FORBIDDEN'}},{'Set-Cookie':cookie('',0)});
    }
    const id=randomBytes(32).toString('base64url'),csrf=randomBytes(32).toString('base64url');
    // Store must encrypt and TTL this record; no tokens returned to browser.
    try {await flowStore.put(id,{session:login.session,factorId:login.factorIds[0]??null,csrf,type:'password',enrolment:false},300);}
    catch(e) {try{await client.auth.signOut({scope:'local'})}catch{};throw e;}
    return out(200,{mfa_required:true,enrolment:false,csrf},{'Set-Cookie':cookie(id,300)});
   }
   const enrol=typeof enrolment==='function'?enrolment:null;
   if(url.pathname==='/api/admin/v1/auth/enroll') {
    if(!enrol)return out(503,{error:{code:'UNAVAILABLE'}});
    // Enrolment is for an account that signed in with a password and has an
    // enabled Admin membership but no verified factor yet. The pending flow is
    // taken atomically, so a partial enrolment can never be replayed.
    const body=await json(request);if(Object.keys(body).sort().join(',')!=='csrf')return out(400,{error:{code:'INVALID'}});
    const flowId=pending(request);
    const flow=flowId?await flowStore.take(flowId):null;
    if(!flow||flow.type!=='password'||!same(body.csrf,flow.csrf))return out(401,{error:{code:'UNAUTHENTICATED'}},{'Set-Cookie':cookie('',0)});
    const client=createClient();let identity;
    try {identity=await verifyEnrolmentIdentity({token:flow.session.access_token,provider:client});}
    catch {return out(401,{error:{code:'UNAUTHENTICATED'}},{'Set-Cookie':cookie('',0)});}
    // Live membership and provider session are checked in the database, in one
    // transaction, before any factor is created for the account.
    try {await enrol(identity);}
    catch {return out(403,{error:{code:'FORBIDDEN'}},{'Set-Cookie':cookie('',0)});}
    const enrolmentResult=await beginTotpEnrolment({client,limiter,rateKey:remoteKey});
    const id=randomBytes(32).toString('base64url'),csrf=randomBytes(32).toString('base64url');
    await flowStore.put(id,{session:flow.session,factorId:enrolmentResult.factorId,csrf,type:'enrolment'},300);
    return out(200,{mfa_required:false,enrolment:true,otpauth_uri:enrolmentResult.otpauthUri,csrf},{'Set-Cookie':cookie(id,300)});
   }
   if(url.pathname==='/api/admin/v1/auth/enroll-confirm') {
    if(!enrol)return out(503,{error:{code:'UNAVAILABLE'}});
    const body=await json(request);if(Object.keys(body).sort().join(',')!=='code,csrf')return out(400,{error:{code:'INVALID'}},{'Set-Cookie':cookie('',0)});
    const flowId=pending(request);
    const flow=flowId?await flowStore.take(flowId):null;
    if(!flow||flow.type!=='enrolment'||!same(body.csrf,flow.csrf))return out(401,{error:{code:'UNAUTHENTICATED'}},{'Set-Cookie':cookie('',0)});
    const client=createClient();let identity;
    try {identity=await verifyEnrolmentIdentity({token:flow.session.access_token,provider:client});}
    catch {return out(401,{error:{code:'UNAUTHENTICATED'}},{'Set-Cookie':cookie('',0)});}
    try {await enrol(identity);}
    catch {return out(403,{error:{code:'FORBIDDEN'}},{'Set-Cookie':cookie('',0)});}
    const confirmed=await confirmTotpEnrolment({client,factorId:flow.factorId,code:body.code,limiter,rateKey:remoteKey});
    // The confirming code yields a fresh AAL2 session for this account.
    return establish(confirmed);
   }
   if(url.pathname==='/api/admin/v1/auth/recovery/complete') {
    // Redeem the single-use recovery code. On success the account is told to
    // re-enrol on its next sign-in: no session is minted, no factor is removed by
    // this route, and the stale factor stays until the operator clears it.
    if(!recoverHook)return out(503,{error:{code:'UNAVAILABLE'}});
    const recover=recoverHook;
    const body=await json(request);
    if(Object.keys(body).sort().join(',')!=='code,csrf')return out(400,{error:{code:'INVALID'}},{'Set-Cookie':cookie('',0)});
    const flowId=pending(request);
    const flow=flowId?await flowStore.take(flowId):null;
    if(!flow||flow.type!=='recovery'||!same(body.csrf,flow.csrf))return out(401,{error:{code:'UNAUTHENTICATED'}},{'Set-Cookie':cookie('',0)});
    const client=createClient();let identity;
    try {identity=await verifyEnrolmentIdentity({token:flow.session.access_token,provider:client});}
    catch {return out(401,{error:{code:'UNAUTHENTICATED'}},{'Set-Cookie':cookie('',0)});}
    // A wrong or exhausted code is an authentication failure (401); a refusal
    // that the database reports as a definite denial is 403. Both clear the
    // pending flow, so neither can be retried without the cookie.
    let outcome;
    try {outcome=await recover({redeem:true,identity,code:body.code});}
    catch (e) {const denied=e?.code==='FORBIDDEN';return out(denied?403:401,{error:{code:denied?'FORBIDDEN':'UNAUTHENTICATED'}},{'Set-Cookie':cookie('',0)});}
    if(outcome!==true){try{await client.auth.signOut({scope:'local'})}catch{};return out(401,{error:{code:'UNAUTHENTICATED'}},{'Set-Cookie':cookie('',0)});}
    try{await client.auth.signOut({scope:'global'});}catch{/* authorisation already recorded */}
    return out(200,{ok:true,next:'contact_operator'},{'Set-Cookie':cookie('',0)});
   }
   if(url.pathname==='/api/admin/v1/auth/mfa') {
    const body=await json(request);if(Object.keys(body).sort().join(',')!=='code,csrf')return out(400,{error:{code:'INVALID'}},{'Set-Cookie':cookie('',0)});
    const flowId=pending(request); // MUST be atomic single use
    const flow=flowId?await flowStore.take(flowId):null;
    if(!flow||!same(body.csrf,flow.csrf))return out(401,{error:{code:'UNAUTHENTICATED'}},{'Set-Cookie':cookie('',0)});
    const client=createClient();let restored;
    try{restored=await client.auth.setSession({access_token:flow.session.access_token,refresh_token:flow.session.refresh_token});}catch{return out(503,{error:{code:'UNAVAILABLE'}},{'Set-Cookie':cookie('',0)})}
    if(restored.error||!restored.data?.session)return out(401,{error:{code:'UNAUTHENTICATED'}},{'Set-Cookie':cookie('',0)});
    let session;
    try {session=await verifyTotp({client,factorId:flow.factorId,code:body.code,limiter,rateKey:remoteKey});}
    catch(e){try{await client.auth.signOut({scope:'local'})}catch{};throw e;}
    // The verified identity and DB enabled membership/session check happen in
    // the session handler. No account is logged into Admin on its failure.
    return establish(session);
   }
   return out(404,{error:{code:'NOT_FOUND'}});
  } catch(e) {
   const code=e?.code;
   const status=code==='RATE_LIMITED'?429:code==='UNAUTHENTICATED'||code==='MFA_REQUIRED'?401:503;
   return out(status,{error:{code:status===429?'RATE_LIMITED':status===401?'UNAUTHENTICATED':'UNAVAILABLE'}},{'Set-Cookie':cookie('',0)});
  }
 };
}
