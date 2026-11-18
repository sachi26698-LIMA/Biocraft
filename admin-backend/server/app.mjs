// Shared Admin composition used by the Vercel function and the local listener.
// Importing this module never opens a socket or a database connection.
// Activation requires explicit, server-only configuration and a limited role.
//
// Request chain:
//   /api/admin/v1/auth/*  -> auth controller (password + TOTP, encrypted flows)
//   /api/admin/v1/*       -> encrypted cookie gateway (CSRF, origin) -> API
//   any other path        -> 404 (no static file serving, no directory traversal)
//
// Failure is closed: missing configuration returns 503 for every route.
import {randomUUID} from 'node:crypto';
import {createProviderClient} from './identity.mjs';
import {createRecoveryController} from './recovery-controller.mjs';
import {createAuthController} from './auth-controller.mjs';
import {issueRecoveryGrant,revokeRecoveryGrant,runCleanup,redeemRecoveryCode,factorGate,recoveryGrantState,resetFactorEnrolment} from './recovery-grant.mjs';
import {verifyProviderIdentity} from './identity.mjs';
import {createCookieGateway} from './session-cookie.mjs';
import {createAdminHandler} from './api.mjs';
import {createPublishedCatalog} from './published-catalog.mjs';
import {createDatabaseExecutor,createPostgresPool} from './database.mjs';
import {inspectAdminDatabase,databaseReady} from './db-readiness.mjs';
export {verifyAdminDatabase} from './db-readiness.mjs';
import {createAuthStorage} from './auth-storage.mjs';
import {isEmailAllowed} from './auth-flow.mjs';
import {createProviderLogout} from './provider-logout.mjs';
import {createHash,createHmac,timingSafeEqual} from 'node:crypto';
import {PLATFORM_RULES} from '../domain/platform-rules.mjs';

import {checkPublicContent} from '../../shared/public-content-check.mjs';
import {SUPABASE_URL as PROJECT_URL} from '../../shared/supabase-config.mjs';
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
export function createAdminApp({env=process.env,poolFactory=createPostgresPool,now=()=>Date.now(),localDevelopment=false}={}) {
 // `stage` names the configuration check that failed. It is a fixed identifier
 // from this file's own vocabulary — never an environment value, never a secret —
 // so an operator can tell WHICH gate closed without reading the deployment logs.
 // The published body keeps `{error:{code:'UNAVAILABLE'}}` as its leading shape so
 // the Admin client and the existing regression tests remain correct.
 const fail=reason=>{const app=()=>new Response(JSON.stringify({error:{code:'UNAVAILABLE',stage:reason}}),{status:503,headers:{'Cache-Control':'no-store','Content-Type':'application/json; charset=utf-8','X-Content-Type-Options':'nosniff','X-Admin-Stage':reason}});app.configuration={enabled:false,reason};app.shutdown=async()=>{};return app;};
 if (env.ADMIN_BACKEND_ENABLED!=='true') return fail('disabled');
 if (env.NODE_TLS_REJECT_UNAUTHORIZED==='0') return fail('unverified TLS');
 const origin=env.ADMIN_ORIGIN;
 // A TLS-terminating proxy on a nonstandard port is supported for local
 // loopback development only. Never infer an origin from forwarding headers.
 if (typeof origin!=='string' || !(/^https:\/\/[a-z0-9.-]{1,200}$/i.test(origin) ||
   (localDevelopment && /^https:\/\/(localhost|127\.0\.0\.1):[1-9]\d{0,4}$/.test(origin)))) return fail('invalid origin');
 try { if(new URL(origin).origin!==origin) return fail('invalid origin'); } catch {return fail('invalid origin');}
 const cookieKey=key32(env.ADMIN_COOKIE_KEY_HEX),flowKey=key32(env.ADMIN_FLOW_KEY_HEX),hashKey=key32(env.ADMIN_HASH_KEY_HEX);
 if (!cookieKey||!flowKey||!hashKey||cookieKey.equals(flowKey)||cookieKey.equals(hashKey)||flowKey.equals(hashKey)) return fail('invalid keys');
 const publishableKey=env.ADMIN_SUPABASE_PUBLISHABLE_KEY ?? env.VITE_SUPABASE_PUBLISHABLE_KEY;
 if (typeof publishableKey!=='string'||!publishableKey) return fail('missing publishable key');
 if (typeof env.ADMIN_DB_USER!=='string'||!env.ADMIN_DB_USER||typeof env.ADMIN_DB_PASSWORD!=='string'||!env.ADMIN_DB_PASSWORD) return fail('missing database credentials');
 // Sign-in is closed to everyone unless an operator names the permitted accounts.
 // Failing here is deliberate: a missing allow-list is a configuration error, not
 // an invitation to fall back to "any Supabase user may try the Admin console".
 const allowList=typeof env.ADMIN_ALLOWED_EMAILS==='string'?env.ADMIN_ALLOWED_EMAILS:'';
 if (!allowList.trim()) return fail('missing admin allow-list');
 const emailAllowed=email=>isEmailAllowed(email,allowList);
 const trustedHeader=env.ADMIN_TRUSTED_CLIENT_HEADER==='x-forwarded-for'?env.ADMIN_TRUSTED_CLIENT_HEADER:null;
 const ingressSecret=key32(env.ADMIN_INGRESS_SECRET_HEX);
 if (!trustedHeader||!ingressSecret) return fail('missing trusted client header');
 if ([cookieKey,flowKey,hashKey].some(key=>key.equals(ingressSecret))) return fail('invalid keys');
 let provider;
 try {provider=createProviderClient(PROJECT_URL,publishableKey);} catch {return fail('invalid provider configuration');}
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
 const client=()=>createProviderClient(PROJECT_URL,publishableKey);
 const rateLimit=storage.limit;
 if (typeof storage.limit!=='function') return fail('invalid storage');
 // Recovery authorisation and bounded cleanup (012). The service is injected so
 // the API routes cannot mint a code without the database check that runs first.
 // `execute` is bound here, never supplied by a request, so a route cannot reach
 // the database with an identity the gateway did not verify.
 const recoveryService={
  issue:options=>issueRecoveryGrant({execute,...options}),
  revoke:options=>revokeRecoveryGrant({execute,...options}),
  reset:options=>resetFactorEnrolment({execute,...options}),
  cleanup:options=>runCleanup({execute,...options})};
 const readPublicCatalog=createPublishedCatalog(client); // fresh guest client, never an Admin JWT
 const isPreviewOrUnknownHosted=env.VERCEL_ENV==='preview'||(env.VERCEL==='1'&&env.VERCEL_ENV!=='production');
 const sharedWrites=env.ADMIN_SHARED_WRITES_ENABLED==='true' || (env.ADMIN_SHARED_WRITES_ENABLED===undefined && !localDevelopment && !isPreviewOrUnknownHosted);
 const passwordReset=sharedWrites&&env.ADMIN_PASSWORD_RESET_ENABLED==='true';
 const readSystemStatus=async()=>({
  database:'ready', // settings.read and the live session were just checked in Postgres.
  auth:'verified', // this request's token was verified by Supabase Auth.
  guest_content:await checkPublicContent(env)?'ready':'unavailable',
  runtime: ['preview','production','development'].includes(env.VERCEL_ENV)?env.VERCEL_ENV:'local',
  shared_writes:sharedWrites, password_reset:passwordReset,
  revision: /^[0-9a-f]{40}$/.test(env.VERCEL_GIT_COMMIT_SHA??'')?env.VERCEL_GIT_COMMIT_SHA.slice(0,12):null,
 });
 const api=createAdminHandler({sharedWrites,catalogDrafts:env.ADMIN_CATALOG_DRAFTS_ENABLED==='true',editorialDirectory:env.ADMIN_EDITORIAL_DIRECTORY_ENABLED==='true',readSystemStatus,enabled:true,provider,execute,rateLimit,platformRules:PLATFORM_RULES,recovery:recoveryService,readPublicCatalog,emailAllowed});
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
    const identity=await verifyProviderIdentity({token:request.session.access_token,provider:client(),allowAal1:true,emailAllowed});
    const state=await recoveryGrantState({execute,identity});
    return state!==null && state.attemptsRemaining>0;
   }
   if (request && request.attempt === 'factor' && request.session?.access_token) {
    const identity=await verifyProviderIdentity({token:request.session.access_token,provider:client(),allowAal1:true,emailAllowed});
    return await factorGate({execute,identity});
   }
   return false;
  } catch { return false; }
 };
 const auth=createAuthController({enabled:true,origin,key:cookieKey,createClient:client,flowStore:storage,limiter:rateLimit,sessionHandler:api,enrolment:sharedWrites?enrolment:null,recovery:sharedWrites?factorDecision:null,factorGate:sharedWrites?factorDecision:null,allowList});
 const recoverPassword=createRecoveryController({enabled:passwordReset,origin,createClient:client,flowStore:storage,limiter:rateLimit,execute,emailAllowed,
  checkMembership:async identity=>['enrol','recover'].includes(await factorGate({execute,identity}))});
 const gateway=createCookieGateway({key:cookieKey,origin,delegate:api,providerLogout:createProviderLogout({url:PROJECT_URL,publishableKey})});
 let readiness,authReadiness;
 const app=async function handle(request){
  const key=clientKey(request,{trustedHeader,ingressSecret});
  if(!key) return new Response(JSON.stringify({error:{code:'UNAVAILABLE'}}),{status:503,headers:{'Cache-Control':'no-store','Content-Type':'application/json; charset=utf-8'}});
  let url;try{url=new URL(request.url)}catch{return bad(400)}
  if(url.origin!==origin) return bad(403);
  if(url.pathname.startsWith('/api/admin/v1/auth/password-reset/')) {
   if(url.pathname==='/api/admin/v1/auth/password-reset/status'&&request.method==='GET'&&!url.search) {
    if(passwordReset) return health('GET');
    return new Response(JSON.stringify({error:{code:'UNAVAILABLE'}}),{status:503,headers:{'Cache-Control':'no-store','Content-Type':'application/json'}});
   }
   return recoverPassword(request,key);
  }
  if(!sharedWrites&&url.pathname==='/api/admin/v1/auth/recovery/complete'&&request.method==='POST') return bad(403);
  if(url.pathname.startsWith('/api/admin/v1/auth/')) return auth(request,key);
  if(url.pathname==='/api/admin/v1/health') {
   // A 503 from THIS branch has two distinct shapes, which makes a deployed
   // failure self-diagnosing:
   //   {error:{code:'UNAVAILABLE',stage:'...'}}  -> a configuration gate closed
   //   {error:{code:'UNAVAILABLE'}}              -> configuration was fine, but
   //      dependency readiness (limited DB commands or Auth probe) failed.
   // `?diagnose=1` additionally reports which dependency answers. It is gated on
   // the same proxy HMAC signature the rate limiter uses, so a direct caller
   // learns nothing about the deployment.
   return health(request.method,url.searchParams.get('diagnose')==='1');
  }
  if(url.pathname.startsWith('/api/admin/v1/')) return gateway(request);
  return bad(404);
 };
 app.configuration={enabled:true,origin,trustedHeader,limits:{maxBodyBytes:32768}};
 app.shutdown=async()=>{await pool.end()};
 app.execute=execute;
 // Cache an in-flight DB check as well as the result. A diagnostic and a
 // normal health check must not make duplicate login attempts during an outage.
 function dbReport() {
  if(!readiness||readiness.expires<=now()) readiness={expires:now()+10_000,result:inspectAdminDatabase(pool)};
  return readiness.result;
 }
 async function providerHealth() {
  try {
   const probe=await fetch(`${PROJECT_URL}/auth/v1/health`,{headers:{apikey:publishableKey},redirect:'error',signal:AbortSignal.timeout(3500)});
   await probe.body?.cancel();
   return probe.ok?'reachable':'unavailable';
  } catch {return 'unreachable';}
 }
 function authReport() {
  if(!authReadiness||authReadiness.expires<=now()) authReadiness={expires:now()+10_000,result:providerHealth()};
  return authReadiness.result;
 }
 app.diagnose=async()=>{
  const [database,provider]=await Promise.all([dbReport(),authReport()]);
  return {...database,provider};
 };
 return app;
 function bad(status){return new Response(JSON.stringify({error:{code:status===404?'NOT_FOUND':'FORBIDDEN'}}),{status,headers:{'Cache-Control':'no-store','Content-Type':'application/json; charset=utf-8','X-Content-Type-Options':'nosniff'}})}
 async function health(method,diagnose=false) {
  const headers={'Cache-Control':'no-store','Content-Type':'application/json; charset=utf-8','X-Content-Type-Options':'nosniff'};
  if(method!=='GET') return new Response(JSON.stringify({error:{code:'METHOD_NOT_ALLOWED'}}),{status:405,headers:{...headers,Allow:'GET'}});
  if(diagnose) {
   const diagnostics=await app.diagnose();
   const ok=databaseReady(diagnostics)&&diagnostics.provider==='reachable';
   return new Response(JSON.stringify({ok,diagnostics}),{status:ok?200:503,headers});
  }
  const ok=databaseReady(await dbReport()) && await authReport()==='reachable';
  return new Response(JSON.stringify(ok?{ok:true}:{error:{code:'UNAVAILABLE'}}),{status:ok?200:503,headers});
 }
}
