// Composition test for the server app wrapper (no network, no deployment).
// A synthetic disposable PostgreSQL cluster is required; Auth is a stub client.
import assert from 'node:assert/strict';import fs from 'node:fs';import {randomBytes,createHmac} from 'node:crypto';import pg from 'pg';
import {createAdminApp,clientKey} from '../admin-backend/server/app.mjs';
const socket=process.env.BIOCRAFT_TEST_PG_SOCKET;
if(!socket||!fs.realpathSync(socket).startsWith('/tmp/biocraft-pg-'))throw Error('Disposable local socket required');
const keys={ADMIN_COOKIE_KEY_HEX:randomBytes(32).toString('hex'),ADMIN_FLOW_KEY_HEX:randomBytes(32).toString('hex'),ADMIN_HASH_KEY_HEX:randomBytes(32).toString('hex'),ADMIN_INGRESS_SECRET_HEX:randomBytes(32).toString('hex')};
const base={ADMIN_BACKEND_ENABLED:'true',ADMIN_ORIGIN:'https://preview.example',ADMIN_SUPABASE_PUBLISHABLE_KEY:'sb_publishable_local_fixture',ADMIN_DB_USER:'fixture',ADMIN_DB_PASSWORD:'fixture',ADMIN_TRUSTED_CLIENT_HEADER:'x-forwarded-for',...keys};
const pool=new pg.Pool({host:socket,user:process.env.USER,database:'postgres'});
try {
 // Every misconfiguration must fail closed with 503 and never open a connection.
 const badConfigs=[
  {ADMIN_BACKEND_ENABLED:'false',reason:'disabled'},
  {ADMIN_ORIGIN:'http://preview.example',reason:'invalid origin'},
  {ADMIN_COOKIE_KEY_HEX:keys.ADMIN_FLOW_KEY_HEX,reason:'invalid keys'},
  {ADMIN_SUPABASE_PUBLISHABLE_KEY:'',reason:'missing publishable key'},
  {ADMIN_DB_PASSWORD:'',reason:'missing database credentials'},
  {ADMIN_TRUSTED_CLIENT_HEADER:'',reason:'missing trusted client header'},
  {ADMIN_INGRESS_SECRET_HEX:'abc',reason:'missing trusted client header'},
 ];
 for(const patch of badConfigs){
  let opened=0;const spy=factory=>({...factory,connect:async()=>{opened++;throw Error('must not connect')}});
  const app=createAdminApp({env:{...base,...patch},poolFactory:()=>({connect:async()=>{opened++;throw Error('no')}})});
  assert.equal(app.configuration.enabled,false);
  const response=await app(new Request('https://preview.example/api/admin/v1/health'));
  assert.equal(response.status,503);
  assert.equal((await response.json()).error.code,'UNAVAILABLE');
  assert.equal(opened,0);void spy;
 }
 const app=createAdminApp({env:base,poolFactory:()=>({connect:async()=>{throw Error('no')},end:async()=>{}})});
 assert.equal(app.configuration.enabled,true);
 // A direct caller without the proxy HMAC signature has no trusted key.
 const unsigned=await app(new Request('https://preview.example/api/admin/v1/health',{headers:{'x-forwarded-for':'1.2.3.4'}}));
 assert.equal(unsigned.status,503);
 const wrongSignature=await app(new Request('https://preview.example/api/admin/v1/health',{headers:{'x-forwarded-for':'1.2.3.4','x-admin-ingress-signature':'0'.repeat(64)}}));
 assert.equal(wrongSignature.status,503);
 const secret=Buffer.from(keys.ADMIN_INGRESS_SECRET_HEX,'hex');
 const signed=async value=>({'x-forwarded-for':value,'x-admin-ingress-signature':createHmac('sha256',secret).update(value).digest('hex')});
 const key=clientKey(new Request('https://preview.example/',{headers:await signed('1.2.3.4')}),{trustedHeader:'x-forwarded-for',ingressSecret:secret});
 assert.match(key,/^[0-9a-f]{64}$/);
 assert.equal(clientKey(new Request('https://preview.example/',{headers:{'x-forwarded-for':'1.2.3.4'}}),{trustedHeader:'x-forwarded-for',ingressSecret:secret}),null);
 let request=new Request('https://preview.example/api/admin/v1/health',{headers:await signed('1.2.3.4')});
 assert.equal((await app(request)).status,200);
 // Only the configured origin and Admin API prefix are served.
 assert.equal((await app(new Request('https://attacker.example/api/admin/v1/health',{headers:await signed('1.2.3.4')}))).status,403);
 assert.equal((await app(new Request('https://preview.example/other',{headers:await signed('1.2.3.4')}))).status,404);
 assert.equal((await app(new Request('https://preview.example/api/admin/v1/../../etc/passwd',{headers:await signed('1.2.3.4')}))).status,404);
 // Unknown auth route is a 404, not a crash, and never reaches the database.
 assert.equal((await app(new Request('https://preview.example/api/admin/v1/auth/unknown',{method:'POST',headers:{...await signed('1.2.3.4'),origin:'https://preview.example','content-type':'application/json'},body:'{}'}))).status,404);
 // Unauthenticated gateway access cannot succeed without a cookie.
 assert.equal((await app(new Request('https://preview.example/api/admin/v1/bio-drafts',{headers:await signed('1.2.3.4')}))).status,401);
 console.log('PASS admin app wrapper: fail-closed configuration, signed trusted client key, origin/route gating, unauthenticated denial; no deployment or live Auth');
} finally {await pool.end()}
