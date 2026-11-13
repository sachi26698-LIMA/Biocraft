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
import {randomUUID} from 'node:crypto';
import {createProviderClient} from './identity.mjs';
import {createAuthController} from './auth-controller.mjs';
import {createRecoveryController} from './recovery-controller.mjs';
import {issueRecoveryGrant,revokeRecoveryGrant,runCleanup,redeemRecoveryCode,factorGate,recoveryGrantState} from './recovery-grant.mjs';
import {verifyProviderIdentity} from './identity.mjs';
import {createCookieGateway} from './session-cookie.mjs';
import {createAdminHandler} from './api.mjs';
import {createDatabaseExecutor,createPostgresPool,assertLimitedRole} from './database.mjs';
import {createAuthStorage} from './auth-storage.mjs';
import {providerLogout} from './auth-flow.mjs';
import {createHash,createHmac,timingSafeEqual} from 'node:crypto';
import {PLATFORM_RULES} from '../domain/platform-rules.mjs';

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
 const fail=reason=>{const app=()=>new Response(JSON.stringify({error:{code:'UNAVAILABLE'}}),{status:503,headers:{'Cache-Control':'no-store','Content-Type':'application/json; charset=utf-8','X-Content-Type-Options':'nosniff'}});app.configuration={enabled:false,reason};app.shutdown=async()=>{};return app;};
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
 // Direct connection by default; set ADMIN_DB_HOST to the Supavisor pooler host
 // (with a project-scoped ADMIN_DB_USER) when IPv4 egress is required.
 const dbHost=typeof env.ADMIN_DB_HOST==='string'&&env.ADMIN_DB_HOST?env.ADMIN_DB_HOST:'db.jvpadtzfsuekixrquzjv.supabase.co';
 // Only session-mode 5432 is supported; an unparsable or other port fails closed
 // here as well as in the pool factory, so a misconfigured deployment never
 // starts with a transaction-mode or typo'd port.
 const dbPort=env.ADMIN_DB_PORT===undefined||env.ADMIN_DB_PORT===''?undefined:/^\d{1,5}$/.test(env.ADMIN_DB_PORT)?Number(env.ADMIN_DB_PORT):NaN;
 if(dbPort!==undefined&&dbPort!==5432) return fail('invalid database configuration');
 let pool;
 try {pool=poolFactory({host:dbHost,port:dbPort,user:env.ADMIN_DB_USER,password:env.ADMIN_DB_PASSWORD});} catch {return fail('invalid database configuration');}
 const execute=createDatabaseExecutor(pool,{now});
 const storage=createAuthStorage({pool,encryptionKey:flowKey,hashKey});
 // Supabase clients must be per-request so sessions never leak between requests.
 const client=()=>createProviderClient(PROJECT_URL,env.ADMIN_SUPABASE_PUBLISHABLE_KEY);
 const rateLimit=({bucket,key})=>storage.limit({bucket,key});
 if (typeof storage.limit!=='function') return fail('invalid storage');
 // Recovery authorisation and bounded cleanup (012). The service is injected so
 // the API routes cannot mint a code without the database check that runs first.
 // `execute` is bound here, never supplied by a request, so a route cannot reach
 // the database with an identity the gateway did not verify.
 const recoveryService={
  issue:options=>issueRecoveryGrant({execute,...options}),
  revoke:options=>revokeRecoveryGrant({execute,...options}),
  cleanup:options=>runCleanup({execute,...options})};
 const api=createAdminHandler({enabled:true,provider,execute,rateLimit,platformRules:PLATFORM_RULES,recovery:recoveryService});
 const recovery=createRecoveryController({enabled:true,origin,createClient:client,flowStore:storage,limiter:rateLimit,execute});
 // Enrolment gate: live Admin membership + provider session, checked in the DB
 // before any TOTP factor is created. It is the only pre-AAL2 database call.
 const enrolment=async identity=>{
  try {const rows=await execute({identity,operation:'enrolmentEligible',args:[randomUUID()]});
   if(!Array.isArray(rows)||rows.length!==1||rows[0].eligible!==true) throw new Error('Not eligible');
  } catch {throw new Error('Not eligible');}
 };
 // D2 decision point. Three request shapes, all fail-closed:
 //   {attempt:'factor'}  -> 'enrol' (never had a factor) or 'recover' (had one),
 //     decided from a database record, not from the browser;
 //   {session, factorIds} -> legacy pre-check kept for the recovery handshake;
 //   {redeem, identity, code} -> redeem a code; the database enforces attempts,
 //     expiry and single use, and issues no session.
 const factorDecision=async request=>{
  try {
   if (request && request.redeem === true) {
    const result=await redeemRecoveryCode({execute,identity:request.identity,code:request.code});
    return result.ok === true;
   }
   // The password step decides enrol vs recover from a database record, never
   // from what the browser claims. A 'recover' answer still needs a live grant
   // before the handshake opens, so recovery cannot be self-started.
   if (request && (request.session?.access_token) && request.attempt !== 'factor' && request.redeem !== true) {
    // A recovery handshake still requires a live grant.
    const identity=await verifyProviderIdentity({token:request.session.access_token,provider:createClient(),allowAal1:true});
    const state=await recoveryGrantState({execute,identity});
    return state!==null && state.attemptsRemaining>0;
   }
   if (request && request.attempt === 'factor' && request.session?.access_token) {
    const identity=await verifyProviderIdentity({token:request.session.access_token,provider:createClient(),allowAal1:true});
    return await factorGate({execute,identity});
   }
   return false;
  } catch { return false; }
 };
 const auth=createAuthController({enabled:true,origin,key:cookieKey,createClient:client,flowStore:storage,limiter:rateLimit,sessionHandler:api,enrolment,recovery:factorDecision,factorGate:factorDecision});
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

/** Verify the configured database role really is limited. Call once at startup
 * so a misconfigured login fails before serving any request. */
export async function verifyAdminDatabase(pool) {
 const client=await pool.connect();
 try {await client.query('begin');await assertLimitedRole(client);} finally {try{await client.query('rollback')}catch{}client.release()}
}
