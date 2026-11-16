// Server-only encrypted-cookie adapter. NOT mounted/deployed. The session
// value is a bearer credential: protect the 32-byte key, use HTTPS, rotate keys,
// never log cookies or tokens. This is NOT a server-side revocation store; the
// delegate must verify provider identity and check live DB session on every call.
import {createCipheriv,createDecipheriv,randomBytes,timingSafeEqual} from 'node:crypto';
const COOKIE='__Host-biocraft-admin'; const AAD=Buffer.from('biocraft-admin-cookie-v1');
// Cookie lifetime is bounded by the provider token and by this hard cap.
const maxAgeMs=60*60*1000;
function providerTokenExpiry(token){const parts=typeof token==='string'?token.split('.'):[];if(parts.length!==3||!parts.every(p=>/^[A-Za-z0-9_-]+$/.test(p)))return null;try{const exp=JSON.parse(Buffer.from(parts[1],'base64url').toString('utf8')).exp;return Number.isSafeInteger(exp)?exp:null}catch{return null}}
function keyValid(key){return Buffer.isBuffer(key)&&key.length===32}
function header(value,maxAge){return `${COOKIE}=${value}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`}
export function issueSessionCookie({key,accessToken,expiresAt,now=Date.now()}) {
 if(!keyValid(key)||typeof accessToken!=='string'||accessToken.length<1||accessToken.length>2200 || !Number.isSafeInteger(expiresAt) || expiresAt<=now || expiresAt>now+maxAgeMs) throw new Error('Invalid session');
 // Never mint a cookie that outlives the provider token it carries.
 const tokenExp=providerTokenExpiry(accessToken);if(tokenExp===null||expiresAt>tokenExp*1000)throw new Error('Invalid session');
 const csrf=randomBytes(32).toString('base64url'),iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',key,iv);cipher.setAAD(AAD);
 const data=Buffer.concat([cipher.update(JSON.stringify({accessToken,expiresAt,csrf}),'utf8'),cipher.final()]);
 const value=Buffer.concat([iv,cipher.getAuthTag(),data]).toString('base64url');
 if(value.length>3800)throw new Error('Session too large');
 return {setCookie:header(value,Math.floor((expiresAt-now)/1000)),csrf};
}
export const clearSessionCookie=()=>header('',0);
function decodeCookie(request,key,now) {
 const headerValue=request.headers.get('cookie');if(!headerValue || headerValue.length>8192)throw new Error('Invalid cookie');
 const values=headerValue.split(';').map(s=>s.trim()).filter(s=>s.startsWith(`${COOKIE}=`));
 if(values.length!==1)throw new Error('Invalid cookie');
 const raw=values[0].slice(COOKIE.length+1);if(!/^[A-Za-z0-9_-]{1,3800}$/.test(raw))throw new Error('Invalid cookie');
 const bytes=Buffer.from(raw,'base64url');if(bytes.length<29||bytes.toString('base64url')!==raw)throw new Error('Invalid cookie');
 const decipher=createDecipheriv('aes-256-gcm',key,bytes.subarray(0,12));decipher.setAAD(AAD);decipher.setAuthTag(bytes.subarray(12,28));
 const object=JSON.parse(Buffer.concat([decipher.update(bytes.subarray(28)),decipher.final()]).toString('utf8'));
 if(!object || typeof object.accessToken!=='string'||object.accessToken.length>2200||!Number.isSafeInteger(object.expiresAt)||object.expiresAt<=now || object.expiresAt>now+maxAgeMs || typeof object.csrf!=='string'||!/^[A-Za-z0-9_-]{43}$/.test(object.csrf))throw new Error('Invalid cookie');
 // The provider token must still be valid for the whole cookie lifetime.
 const exp=providerTokenExpiry(object.accessToken);
 if(exp===null||exp*1000<=now||object.expiresAt>exp*1000)throw new Error('Invalid cookie');
 return object;
}
const response=(status,code)=>new Response(JSON.stringify({error:{code}}),{status,headers:{'Cache-Control':'no-store','Content-Type':'application/json; charset=utf-8','X-Content-Type-Options':'nosniff'}});
export function createCookieGateway({key,origin,delegate,providerLogout}={}) {
 if(!keyValid(key)||typeof delegate!=='function')throw new Error('Invalid cookie gateway');
 let parsed;try{parsed=new URL(origin)}catch{throw new Error('Invalid origin')}
 if(parsed.protocol!=='https:'||parsed.origin!==origin||parsed.username||parsed.password)throw new Error('Invalid origin');
 return async function(request) {
  if(request.headers.has('authorization'))return response(400,'INVALID');
  let session;try{session=decodeCookie(request,key,Date.now())}catch{return response(401,'UNAUTHENTICATED')}
  const url=new URL(request.url);
  if(url.origin!==origin)return response(403,'FORBIDDEN');
  if(request.method==='GET' && url.pathname==='/api/admin/v1/csrf' && !url.search) {
   // Revalidate provider identity and DB session before returning a CSRF token.
   const check=await delegate(new Request(`${origin}/api/admin/v1/session`,{headers:{authorization:`Bearer ${session.accessToken}`}}));
   if(!check.ok)return response(check.status,check.status===401?'UNAUTHENTICATED':check.status===403?'FORBIDDEN':'UNAVAILABLE');
   return new Response(JSON.stringify({csrf:session.csrf}),{status:200,headers:{'Cache-Control':'no-store','Content-Type':'application/json; charset=utf-8','X-Content-Type-Options':'nosniff'}});
  }
  if(!['GET','HEAD'].includes(request.method)){
   if(request.headers.get('origin')!==origin)return response(403,'FORBIDDEN');
   const csrf=request.headers.get('x-csrf-token')??'';
   if(!/^[A-Za-z0-9_-]{43}$/.test(csrf)||!timingSafeEqual(Buffer.from(csrf),Buffer.from(session.csrf)))return response(403,'FORBIDDEN');
  }
  const headers=new Headers(request.headers);headers.delete('cookie');headers.delete('x-csrf-token');headers.set('authorization',`Bearer ${session.accessToken}`);
  const result=await delegate(new Request(request,{headers}));
  if(request.method==='DELETE' && url.pathname==='/api/admin/v1/session' && !url.search) {
   // Revoke Admin session first; then try provider logout. Clear browser cookie
   // even if the provider is unavailable, and report failure honestly.
   let logoutFailed=false;
   if(result.ok) {try{if(typeof providerLogout!=='function')throw new Error();await providerLogout(session.accessToken)}catch{logoutFailed=true}}
   const out=logoutFailed?response(503,'UNAVAILABLE'):result;
   out.headers.append('Set-Cookie',clearSessionCookie());
   return out;
  }
  return result;
 };
}
