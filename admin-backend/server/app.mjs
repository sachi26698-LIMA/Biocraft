// Server-side Admin HTTP application. NOT mounted in this repository by default:
// there is no reviewed, isolated deployment target and no approved database
// credentials. Nothing here listens on a port or opens a database connection on
// import. Enabling it requires: server-only secrets, a reviewed limited DB login,
// independently reviewed SQL grants, and an approved Preview origin + proxy.
//
// Request chain:
//   /api/admin/v1/auth/*  -> auth controller (password + TOTP, encrypted flows)
//   /api/admin/v1/*       -> encrypted cookie gateway (CSRF, origin) -> API
//   any other path        -> 404 (no static file serving, no directory traversal)
//
// Failure is closed: missing configuration returns 503 for every route.
import {createProviderClient} from './identity.mjs';
import {createAuthController} from './auth-controller.mjs';
import {createRecoveryController} from './recovery-controller.mjs';
import {createCookieGateway} from './session-cookie.mjs';
import {createAdminHandler} from './api.mjs';
import {createDatabaseExecutor,createPostgresPool,assertLimitedRole} from './database.mjs';
import {createAuthStorage} from './auth-storage.mjs';
import {providerLogout} from './auth-flow.mjs';
import {createHash,createHmac,timingSafeEqual} from 'node:crypto';

const PROJECT_URL='https://jvpadtzfsuekixrquzjv.supabase.co';
const HEX64=/^[0-9a-f]{64}$/;
const key32=value=>typeof value==='string'&&HEX64.test(value)?Buffer.from(value,'hex'):null;

/** Derive the rate-limit client key from a proxy-supplied header that the
 * client cannot forge: the proxy must also compute
 *   x-admin-ingress-signature = hex(HMAC-SHA256(ingressSecret, headerValue))
 * A bare forwarded-for header is ignored, so a direct caller gets no key and is
 * rejected. Only a digest of the value is used, never the raw address. */
export function clientKey(request,{trustedHeader,ingressSecret}={}) {
 if (!trustedHeader || !Buffer.isBuffer(ingressSecret) || ingressSecret.length!==32) return null;
 const value=request.headers.get(trustedHeader);
 const signature=request.headers.get('x-admin-ingress-signature');
 if (typeof value!=='string'||value.length<1||value.length>200||typeof signature!=='string'||!/^[0-9a-f]{64}$/.test(signature)) return null;
 const expected=createHmac('sha256',ingressSecret).update(value).digest();
 if (!timingSafeEqual(expected,Buffer.from(signature,'hex'))) return null;
 return createHash('sha256').update(value).digest('hex');
}

/** Build the request handler from an explicit configuration object.
 * Expected environment (server-only, never VITE_):
 *   ADMIN_BACKEND_ENABLED=true
 *   ADMIN_ORIGIN=https://<exact-preview-origin>
 *   ADMIN_SUPABASE_PUBLISHABLE_KEY=...
 *   ADMIN_DB_USER=... ADMIN_DB_PASSWORD=...
 *   ADMIN_COOKIE_KEY_HEX / ADMIN_FLOW_KEY_HEX / ADMIN_HASH_KEY_HEX (64 hex chars)
 *   ADMIN_TRUSTED_CLIENT_HEADER=x-forwarded-for (proxy-set, HMAC-signed)
 *   ADMIN_INGRESS_SECRET_HEX=<64 hex chars shared with that proxy>
 *   ADMIN_ALLOWED_EMAILS=comma-separated (bootstrap allow-list, optional)
 */
export function createAdminApp({env=process.env,poolFactory=createPostgresPool,now=()=>Date.now()}={}) {
 const fail=reason=>{const app=()=>new Response(JSON.stringify({error:{code:'UNAVAILABLE'}}),{status:503,headers:{'Cache-Control':'no-store','Content-Type':'application/json; charset=utf-8','X-Content-Type-Options':'nosniff'}});app.configuration={enabled:false,reason};return app;};
 if (env.ADMIN_BACKEND_ENABLED!=='true') return fail('disabled');
 const origin=env.ADMIN_ORIGIN;
 if (typeof origin!=='string'||!/^https:\/\/[a-z0-9.-]{1,200}$/i.test(origin)) return fail('invalid origin');
 const cookieKey=key32(env.ADMIN_COOKIE_KEY_HEX),flowKey=key32(env.ADMIN_FLOW_KEY_HEX),hashKey=key32(env.ADMIN_HASH_KEY_HEX);
 if (!cookieKey||!flowKey||!hashKey||cookieKey.equals(flowKey)||cookieKey.equals(hashKey)||flowKey.equals(hashKey)) return fail('invalid keys');
 if (typeof env.ADMIN_SUPABASE_PUBLISHABLE_KEY!=='string'||!env.ADMIN_SUPABASE_PUBLISHABLE_KEY) return fail('missing publishable key');
 if (typeof env.ADMIN_DB_USER!=='string'||!env.ADMIN_DB_USER||typeof env.ADMIN_DB_PASSWORD!=='string'||!env.ADMIN_DB_PASSWORD) return fail('missing database credentials');
 const trustedHeader=typeof env.ADMIN_TRUSTED_CLIENT_HEADER==='string'&&/^[a-z0-9-]{1,64}$/.test(env.ADMIN_TRUSTED_CLIENT_HEADER)?env.ADMIN_TRUSTED_CLIENT_HEADER:null;
 const ingressSecret=key32(env.ADMIN_INGRESS_SECRET_HEX);
 if (!trustedHeader||!ingressSecret) return fail('missing trusted client header');
 let provider;
 try {provider=createProviderClient(PROJECT_URL,env.ADMIN_SUPABASE_PUBLISHABLE_KEY);} catch {return fail('invalid provider configuration');}
 let pool;
 try {pool=poolFactory({host:'db.jvpadtzfsuekixrquzjv.supabase.co',user:env.ADMIN_DB_USER,password:env.ADMIN_DB_PASSWORD});} catch {return fail('invalid database configuration');}
 const execute=createDatabaseExecutor(pool,{now});
 const storage=createAuthStorage({pool,encryptionKey:flowKey,hashKey});
 // Supabase clients must be per-request so sessions never leak between requests.
 const client=()=>createProviderClient(PROJECT_URL,env.ADMIN_SUPABASE_PUBLISHABLE_KEY);
 const rateLimit=({bucket,key})=>storage.limit({bucket,key});
 if (typeof storage.limit!=='function') return fail('invalid storage');
 const api=createAdminHandler({enabled:true,provider,execute,rateLimit,platformRules:PLATFORM_RULES});
 const recovery=createRecoveryController({enabled:true,origin,createClient:client,flowStore:storage,limiter:rateLimit,execute});
 const auth=createAuthController({enabled:true,origin,key:cookieKey,createClient:client,flowStore:storage,limiter:rateLimit,sessionHandler:api});
 const gateway=createCookieGateway({key:cookieKey,origin,delegate:api,providerLogout:async()=>{const sessionClient=client();await providerLogout(sessionClient)}});
 const app=async function handle(request){
  const key=clientKey(request,{trustedHeader,ingressSecret});
  if(!key) return new Response(JSON.stringify({error:{code:'UNAVAILABLE'}}),{status:503,headers:{'Cache-Control':'no-store','Content-Type':'application/json; charset=utf-8'}});
  let url;try{url=new URL(request.url)}catch{return bad(400)}
  if(url.origin!==origin) return bad(403);
  if(url.pathname.startsWith('/api/admin/v1/auth/')) return auth(request,key);
  if(url.pathname==='/api/admin/v1/health') return health();
  if(url.pathname.startsWith('/api/admin/v1/')) return gateway(request);
  return bad(404);
 };
 app.configuration={enabled:true,origin,trustedHeader,limits:{maxBodyBytes:32768}};
 app.shutdown=async()=>{await pool.end()};
 app.execute=execute;
 return app;
 function bad(status){return new Response(JSON.stringify({error:{code:status===404?'NOT_FOUND':'FORBIDDEN'}}),{status,headers:{'Cache-Control':'no-store','Content-Type':'application/json; charset=utf-8','X-Content-Type-Options':'nosniff'}})}
 function health(){return new Response(JSON.stringify({ok:true}),{status:200,headers:{'Cache-Control':'no-store','Content-Type':'application/json; charset=utf-8','X-Content-Type-Options':'nosniff'}})}
}

// Server-side platform limits used for draft text validation. These mirror the
// public app configuration and are NOT a request input.
export const PLATFORM_RULES=Object.freeze({
 instagram:{count:'unicode_code_points',max:150},
 twitter:{count:'unicode_code_points',max:160},
 facebook:{count:'unicode_code_points',max:101},
 linkedin:{count:'unicode_code_points',max:220},
 youtube:{count:'unicode_code_points',max:1000},
 tiktok:{count:'unicode_code_points',max:80},
 snapchat:{count:'unicode_code_points',max:250},
 whatsapp:{count:'unicode_code_points',max:139}
});

/** Verify the configured database role really is limited. Call once at startup
 * so a misconfigured login fails before serving any request. */
export async function verifyAdminDatabase(pool) {
 const client=await pool.connect();
 try {await client.query('begin');await assertLimitedRole(client);} finally {try{await client.query('rollback')}catch{}client.release()}
}
