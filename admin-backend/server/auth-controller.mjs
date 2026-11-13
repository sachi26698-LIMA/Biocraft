// Server-only Auth HTTP controller, not mounted or deployed. The injected
// flowStore must durably encrypt tokens, enforce TTL and atomically take once.
// The injected limiter must be durable/shared and use a trusted client key.
// Never log request bodies, cookies, access tokens, refresh tokens or OTPs.
import {randomBytes,timingSafeEqual} from 'node:crypto';
import {beginPasswordLogin,verifyTotp} from './auth-flow.mjs';
import {issueSessionCookie} from './session-cookie.mjs';
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
 const h=request.headers.get('cookie')??'';if(h.length>8192)throw Error('invalid');
 const all=h.split(';').map(s=>s.trim()).filter(s=>s.startsWith(`${PENDING}=`));
 if(all.length!==1)throw Error('invalid');const id=all[0].slice(PENDING.length+1);
 if(!/^[A-Za-z0-9_-]{43}$/.test(id))throw Error('invalid');return id;
}
function same(a,b) {return typeof a==='string'&&typeof b==='string'&&/^[A-Za-z0-9_-]{43}$/.test(a)&&/^[A-Za-z0-9_-]{43}$/.test(b)&&timingSafeEqual(Buffer.from(a),Buffer.from(b));}
export function createAuthController({enabled=false,origin,key,createClient,flowStore,limiter,sessionHandler}={}) {
 return async function(request,remoteKey) {
  if(!enabled || !Buffer.isBuffer(key)||key.length!==32 || typeof createClient!=='function' || typeof limiter!=='function' ||
     typeof flowStore?.put!=='function' || typeof flowStore?.take!=='function' || typeof sessionHandler!=='function')return out(503,{error:{code:'UNAVAILABLE'}});
  let url;try {url=new URL(request.url);const o=new URL(origin);if(o.protocol!=='https:'||o.origin!==origin||url.origin!==origin||request.headers.get('origin')!==origin||request.method!=='POST'||url.search)throw Error();}catch{return out(403,{error:{code:'FORBIDDEN'}})}
  if(typeof remoteKey!=='string'||remoteKey.length<1||remoteKey.length>200)return out(503,{error:{code:'UNAVAILABLE'}});
  try {
   if(url.pathname==='/api/admin/v1/auth/login') {
    const body=await json(request);
    if(Object.keys(body).sort().join(',')!=='email,password')return out(400,{error:{code:'INVALID'}});
    const client=createClient();
    const login=await beginPasswordLogin({client,email:body.email,password:body.password,limiter,rateKey:remoteKey});
    const id=randomBytes(32).toString('base64url'),csrf=randomBytes(32).toString('base64url');
    // Store must encrypt and TTL this record; no tokens returned to browser.
    try {await flowStore.put(id,{session:login.session,factorId:login.factorIds[0],csrf},300);} catch(e) {try{await client.auth.signOut({scope:'local'})}catch{};throw e;}
    return out(200,{mfa_required:true,csrf},{'Set-Cookie':cookie(id,300)});
   }
   if(url.pathname==='/api/admin/v1/auth/mfa') {
    const body=await json(request);if(Object.keys(body).sort().join(',')!=='code,csrf')return out(400,{error:{code:'INVALID'}},{'Set-Cookie':cookie('',0)});
    const flow=await flowStore.take(pending(request)); // MUST be atomic single use
    if(!flow||!same(body.csrf,flow.csrf))return out(401,{error:{code:'UNAUTHENTICATED'}},{'Set-Cookie':cookie('',0)});
    const client=createClient();let restored;
    try{restored=await client.auth.setSession({access_token:flow.session.access_token,refresh_token:flow.session.refresh_token});}catch{return out(503,{error:{code:'UNAVAILABLE'}},{'Set-Cookie':cookie('',0)})}
    if(restored.error||!restored.data?.session)return out(401,{error:{code:'UNAUTHENTICATED'}},{'Set-Cookie':cookie('',0)});
    let session;
    try {session=await verifyTotp({client,factorId:flow.factorId,code:body.code,limiter,rateKey:remoteKey});}
    catch(e){try{await client.auth.signOut({scope:'local'})}catch{};throw e;}
    // The verified identity and DB enabled membership/session check happen in
    // the session handler. No account is logged into Admin on its failure.
    // Supabase MFA verification returns expires_in, not necessarily expires_at.
    // The JWT exp is only used to cap cookie lifetime; the session handler must
    // still verify the token with the provider before any cookie is returned.
    const now=Date.now();let providerExpiry;
    try {const parts=session.access_token.split('.');if(parts.length!==3||!parts.every(p=>/^[A-Za-z0-9_-]+$/.test(p)))throw Error();
     const exp=JSON.parse(Buffer.from(parts[1],'base64url').toString('utf8')).exp;
     if(!Number.isSafeInteger(exp))throw Error();providerExpiry=exp*1000;
     if(session.expires_at!==undefined){if(!Number.isSafeInteger(session.expires_at))throw Error();providerExpiry=Math.min(providerExpiry,session.expires_at*1000);}
     if(!Number.isSafeInteger(providerExpiry)||providerExpiry<=now)throw Error();
    }catch{try{await client.auth.signOut({scope:'local'})}catch{};return out(503,{error:{code:'UNAVAILABLE'}},{'Set-Cookie':cookie('',0)});}
    const issued=issueSessionCookie({key,accessToken:session.access_token,expiresAt:Math.min(providerExpiry,now+60*60*1000),now});
    let verified;try{verified=await sessionHandler(new Request(`${origin}/api/admin/v1/session`,{method:'POST',headers:{Authorization:`Bearer ${session.access_token}`}}));}
    catch{try{await client.auth.signOut({scope:'local'})}catch{};return out(503,{error:{code:'UNAVAILABLE'}},{'Set-Cookie':cookie('',0)});}
    if(verified.status!==200){try{await client.auth.signOut({scope:'local'})}catch{};const status=verified.status===401?401:verified.status===403?403:verified.status===429?429:503;return out(status,{error:{code:status===401?'UNAUTHENTICATED':status===403?'FORBIDDEN':status===429?'RATE_LIMITED':'UNAVAILABLE'}},{'Set-Cookie':cookie('',0)});}
    const response=out(200,{ok:true,csrf:issued.csrf});
    response.headers.append('Set-Cookie',cookie('',0));response.headers.append('Set-Cookie',issued.setCookie);return response;
   }
   return out(404,{error:{code:'NOT_FOUND'}});
  } catch(e) {
   const code=e?.code;
   const status=code==='RATE_LIMITED'?429:code==='UNAUTHENTICATED'||code==='MFA_REQUIRED'?401:503;
   return out(status,{error:{code:status===429?'RATE_LIMITED':status===401?'UNAUTHENTICATED':'UNAVAILABLE'}},{'Set-Cookie':cookie('',0)});
  }
 };
}
