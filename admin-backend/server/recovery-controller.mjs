// Opt-in server-only password recovery. Provider email template must deliver a
// one-time token_hash to the admin recovery page without leaking tokens in logs,
// referrers or third-party resources. It requires an existing verified TOTP.
// Storage must be durable, encrypted and atomic one-time; limiter distributed.
// Email credential recovery and DB/provider session revocation cannot be atomic.
import {randomBytes,randomUUID,createHash,timingSafeEqual} from 'node:crypto';
import {verifyProviderIdentity,AccessError} from './identity.mjs';
import {normaliseEmail,verifyTotp} from './auth-flow.mjs';
const COOKIE='__Host-biocraft-recovery';
const common={'Cache-Control':'no-store','Content-Type':'application/json; charset=utf-8','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'};
const response=(status,code,extra={})=>{
 const headers=new Headers(common);
 for(const [key,value] of Object.entries(extra)) for(const item of [].concat(value)) headers.append(key,item);
 return new Response(JSON.stringify(code),{status,headers});
};
const setCookie=(value,maxAge)=>`${COOKIE}=${value}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`;
const clear={'Set-Cookie':setCookie('',0)};
const digest=(prefix,value)=>`${prefix}:${createHash('sha256').update(value).digest('hex')}`;
const idRe=/^[A-Za-z0-9_-]{43}$/;
async function body(request) {
 if(!/^application\/json(?:\s*;|$)/i.test(request.headers.get('content-type')??''))throw new AccessError('INVALID');
 const len=request.headers.get('content-length');if(len&&(!/^\d+$/.test(len)||Number(len)>4096))throw new AccessError('INVALID');
 const reader=request.body?.getReader();if(!reader)throw new AccessError('INVALID');let n=0,parts=[];
 try{for(;;){const {done,value}=await reader.read();if(done)break;n+=value.length;if(n>4096){await reader.cancel();throw new AccessError('INVALID')}parts.push(value)}}finally{reader.releaseLock()}
 try{const result=JSON.parse(Buffer.concat(parts.map(Buffer.from)).toString('utf8'));if(!result||typeof result!=='object'||Array.isArray(result))throw Error();return result}catch{throw new AccessError('INVALID')}
}
function only(obj,keys){if(Object.keys(obj).sort().join(',')!==keys.sort().join(','))throw new AccessError('INVALID')}
async function limit(limiter,bucket,key){let ok;try{ok=await limiter({bucket,key})}catch{throw new AccessError('UNAVAILABLE')}if(ok!==true)throw new AccessError('RATE_LIMITED')}
function idFromCookie(request){const header=request.headers.get('cookie')??'';if(header.length>8192)throw new AccessError('UNAUTHENTICATED');const values=header.split(';').map(x=>x.trim()).filter(x=>x.startsWith(`${COOKIE}=`));if(values.length!==1||!idRe.test(values[0].slice(COOKIE.length+1)))throw new AccessError('UNAUTHENTICATED');return values[0].slice(COOKIE.length+1)}
function csrfMatches(a,b){return typeof a==='string'&&typeof b==='string'&&idRe.test(a)&&idRe.test(b)&&timingSafeEqual(Buffer.from(a),Buffer.from(b))}
export function createRecoveryController({enabled=false,origin,createClient,flowStore,limiter,execute,emailAllowed,checkMembership}={}) {
 return async function(request,remoteKey){
  if(!enabled||typeof createClient!=='function'||typeof flowStore?.put!=='function'||typeof flowStore?.take!=='function'||typeof limiter!=='function'||typeof execute!=='function'||typeof emailAllowed!=='function'||typeof checkMembership!=='function')return response(503,{error:{code:'UNAVAILABLE'}});
  let url;try{url=new URL(request.url);if(new URL(origin).origin!==origin||!origin.startsWith('https://')||url.origin!==origin||request.headers.get('origin')!==origin||request.method!=='POST'||url.search)throw Error()}catch{return response(403,{error:{code:'FORBIDDEN'}})}
  if(typeof remoteKey!=='string'||remoteKey.length<1||remoteKey.length>200)return response(503,{error:{code:'UNAVAILABLE'}});
  try {
   if(url.pathname==='/api/admin/v1/auth/password-reset/request') {
    const input=await body(request);only(input,['email']);await limit(limiter,'password-login',digest('recovery-network',remoteKey));
    const email=normaliseEmail(input.email);
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>254)throw new AccessError('INVALID');
    await limit(limiter,'password-login',digest('recovery-account',email));
    if(!emailAllowed(email)) return response(202,{ok:true});
    const client=createClient();let result;
    try{result=await client.auth.resetPasswordForEmail(email,{redirectTo:`${origin}/admin/recovery`})}catch{throw new AccessError('UNAVAILABLE')}
    // Do not distinguish account presence. Provider/network failures remain honest.
    if(result?.error && (!Number.isInteger(result.error.status)||result.error.status>=500||result.error.status===429))throw new AccessError(result.error.status===429?'RATE_LIMITED':'UNAVAILABLE');
    return response(202,{ok:true});
   }
   if(url.pathname==='/api/admin/v1/auth/password-reset/exchange') {
    const input=await body(request);only(input,['tokenHash']);await limit(limiter,'password-login',digest('recovery-exchange',remoteKey));
    if(typeof input.tokenHash!=='string'||!/^[A-Za-z0-9_-]{32,512}$/.test(input.tokenHash))throw new AccessError('UNAUTHENTICATED');
    const client=createClient();let result;
    try{result=await client.auth.verifyOtp({token_hash:input.tokenHash,type:'recovery'})}catch{throw new AccessError('UNAVAILABLE')}
    if(result?.error||!result?.data?.session?.access_token||!result.data.session.refresh_token)throw new AccessError('UNAUTHENTICATED');
    let factors, initialIdentity;
    try {
     initialIdentity=await verifyProviderIdentity({token:result.data.session.access_token,provider:client,allowAal1:true,emailAllowed});
     if(!await checkMembership(initialIdentity)) throw new AccessError('UNAUTHENTICATED');
     factors=await client.auth.mfa.listFactors();
    } catch (error) {
     try{await client.auth.signOut({scope:'local'})}catch{}
     throw error;
    }
    const factor=Array.isArray(factors?.data?.totp)?factors.data.totp.find(f=>f.status==='verified'&&/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(f.id??'')):null;
    if(factors?.error||!factor){try{await client.auth.signOut({scope:'local'})}catch{};throw new AccessError('UNAUTHENTICATED')}
    const id=randomBytes(32).toString('base64url'),csrf=randomBytes(32).toString('base64url');
    try{await flowStore.put(id,{type:'password-reset',session:{access_token:result.data.session.access_token,refresh_token:result.data.session.refresh_token},userId:initialIdentity.userId,sessionId:initialIdentity.sessionId,factorId:factor.id,csrf},300)}catch{try{await client.auth.signOut({scope:'local'})}catch{};throw new AccessError('UNAVAILABLE')}
    return response(200,{mfa_required:true,csrf},{'Set-Cookie':setCookie(id,300)});
   }
   if(url.pathname==='/api/admin/v1/auth/password-reset/complete') {
    const input=await body(request);only(input,['code','csrf','password']);
    if(typeof input.password!=='string'||input.password.length<12||Buffer.byteLength(input.password)>72||/[\u0000-\u001f\u007f]/u.test(input.password))throw new AccessError('INVALID');
    const flow=await flowStore.take(idFromCookie(request));
    if(!flow||flow.type!=='password-reset'||!csrfMatches(input.csrf,flow.csrf))throw new AccessError('UNAUTHENTICATED');
    const client=createClient();let restored;
    try{restored=await client.auth.setSession({access_token:flow.session.access_token,refresh_token:flow.session.refresh_token})}catch{throw new AccessError('UNAVAILABLE')}
    if(restored?.error||!restored?.data?.session)throw new AccessError('UNAUTHENTICATED');
    try {
     const session=await verifyTotp({client,factorId:flow.factorId,code:input.code,limiter,rateKey:remoteKey});
     const identity=await verifyProviderIdentity({token:session.access_token,provider:client,emailAllowed});
     if(identity.userId!==flow.userId || identity.sessionId!==flow.sessionId) throw new AccessError('UNAUTHENTICATED');
     await execute({identity,operation:'sessionOpen',args:[randomUUID()]});
     await execute({identity,operation:'sessionRevokeAll',args:[randomUUID()]});
     let changed;try{changed=await client.auth.updateUser({password:input.password})}catch{throw new AccessError('UNAVAILABLE')}
     if(changed?.error)throw new AccessError('UNAVAILABLE');
     // If provider logout fails, all Admin sessions are already revoked but the
     // operation is reported incomplete; user must retry provider sign-out.
     let loggedOut;try{loggedOut=await client.auth.signOut({scope:'global'})}catch{throw new AccessError('UNAVAILABLE')}
     if(loggedOut?.error)throw new AccessError('UNAVAILABLE');
     return response(200,{ok:true},{'Set-Cookie':[clear['Set-Cookie'],'__Host-biocraft-admin=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0']});
    }catch(e){try{await client.auth.signOut({scope:'local'})}catch{};throw e}
   }
   return response(404,{error:{code:'NOT_FOUND'}});
  } catch(e){const code=e?.code;const status=code==='INVALID'?400:code==='UNAUTHENTICATED'?401:code==='RATE_LIMITED'?429:code==='42501'||code==='FORBIDDEN'?403:503;
   return response(status,{error:{code:status===400?'INVALID':status===401?'UNAUTHENTICATED':status===429?'RATE_LIMITED':status===403?'FORBIDDEN':'UNAVAILABLE'}},clear);}
 };
}
