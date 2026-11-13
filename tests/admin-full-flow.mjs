// Full local composition; synthetic users, mocked Supabase Auth, disposable
// PGlite and a fixture-only executor role. This is not a hosted security test.
import assert from 'node:assert/strict';import {createRequire} from 'node:module';import {randomBytes} from 'node:crypto';import fs from 'node:fs';
import {createAuthController} from '../admin-backend/server/auth-controller.mjs';import {createAuthStorage} from '../admin-backend/server/auth-storage.mjs';import {createDatabaseExecutor} from '../admin-backend/server/database.mjs';import {createAdminHandler} from '../admin-backend/server/api.mjs';import {createCookieGateway} from '../admin-backend/server/session-cookie.mjs';
const {PGlite}=createRequire(import.meta.url)('@electric-sql/pglite');const db=new PGlite(),uid='11111111-1111-4111-8111-111111111111',sid='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',factor='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',origin='https://preview.example';
try{
 await db.exec(`create role anon;create role authenticated;create schema auth;create table auth.users(id uuid primary key);create table auth.sessions(id uuid primary key,user_id uuid references auth.users(id));
 create function auth.jwt() returns jsonb language sql stable as $$select coalesce(nullif(current_setting('request.jwt.claims',true),''),'{}')::jsonb$$;
 create function auth.uid() returns uuid language sql stable as $$select nullif(auth.jwt()->>'sub','')::uuid$$;`);
 for(const f of ['001_admin_foundation.sql','002_workflow_integrity.sql','003_permission_catalog.sql','004_private_draft_commands.sql','005_session_commands.sql','006_auth_controls.sql'])await db.exec(fs.readFileSync(`admin-backend/migrations/${f}`,'utf8'));
 await db.exec(`insert into auth.users values('${uid}');insert into auth.sessions values('${sid}','${uid}');insert into bc_admin_v1.admin_users(id,enabled) values('${uid}',true);insert into bc_admin_v1.admin_user_roles(user_id,role_id) values('${uid}','editor');
 create role fixture_executor;grant usage on schema bc_admin_v1 to fixture_executor;
 grant execute on function bc_admin_v1.require_actor(text),bc_admin_v1.open_admin_session(uuid),bc_admin_v1.revoke_admin_session(uuid),bc_admin_v1.create_bio_draft(text,jsonb,uuid),bc_admin_v1.submit_draft(uuid,bigint,uuid,uuid),bc_admin_v1.review_draft(uuid,bigint,boolean,uuid),bc_admin_v1.list_my_bio_drafts(integer,timestamptz,uuid),bc_admin_v1.store_login_flow(bytea,bytea,integer),bc_admin_v1.take_login_flow(bytea),bc_admin_v1.consume_rate_limit(text,bytea) to fixture_executor;`);
 // PGlite cannot model a distinct authenticated login; role-session check is simulated.
 const pool={connect:async()=>{await db.exec('set role fixture_executor');return {query:(q,p)=>db.query(q.replace('session_user=current_user','true'),p),release:async()=>db.exec('reset role')}}};
 const expiry=Math.floor(Date.now()/1000)+300,token=['eyJhbGciOiJub25lIn0',Buffer.from(JSON.stringify({iss:'https://jvpadtzfsuekixrquzjv.supabase.co/auth/v1',aud:'authenticated',role:'authenticated',aal:'aal2',is_anonymous:false,sub:uid,session_id:sid,exp:expiry,amr:[{method:'totp',timestamp:Math.floor(Date.now()/1000)}]})).toString('base64url'),'signature'].join('.');
 const client=()=>({auth:{signInWithPassword:async({password})=>password==='correct'?{data:{session:{access_token:'mock-aal1',refresh_token:'secret-refresh'}}}:{error:{},data:{}},
  getUser:async t=>t===token?{data:{user:{id:uid,is_anonymous:false}}}:{error:{},data:{}},setSession:async()=>({data:{session:{access_token:'mock-aal1'}}}),signOut:async()=>({error:null}),
  mfa:{listFactors:async()=>({data:{totp:[{id:factor,status:'verified'}]}}),challengeAndVerify:async({code})=>code==='123456'?{data:{access_token:token,refresh_token:'secret-refresh',expires_in:300,token_type:'bearer'}}:{error:{},data:{}}}}});
 const cookieKey=randomBytes(32),store=createAuthStorage({pool,encryptionKey:randomBytes(32),hashKey:randomBytes(32)}),executor=createDatabaseExecutor(pool);
 const admin=createAdminHandler({enabled:true,provider:client(),execute:executor,rateLimit:store.limit,platformRules:{instagram:{count:'unicode_code_points',max:150}}});
 const auth=createAuthController({enabled:true,origin,key:cookieKey,createClient:client,flowStore:store,limiter:store.limit,sessionHandler:admin});
 const req=(path,body,cookie)=>new Request(origin+path,{method:'POST',headers:{origin,'Content-Type':'application/json',...(cookie?{cookie}:{})},body:JSON.stringify(body)});
 assert.equal((await auth(req('/api/admin/v1/auth/login',{email:'staff@example.com',password:'wrong'}),'other-ip')).status,401);
 assert.equal((await auth(new Request(origin+'/api/admin/v1/auth/login',{method:'POST',headers:{origin:'https://attacker.example','Content-Type':'application/json'},body:'{}'}),'other-ip')).status,403);
 let login=await auth(req('/api/admin/v1/auth/login',{email:'staff@example.com',password:'correct'}),'synthetic-ip');assert.equal(login.status,200);
 const loginBody=await login.json();assert.equal(loginBody.mfa_required,true);assert(!JSON.stringify(loginBody).includes('secret-refresh'));
 const pending=login.headers.get('set-cookie').split(';')[0];
 const encrypted=(await db.query('select encrypted_data from bc_admin_v1.admin_login_flows')).rows[0].encrypted_data;assert(!Buffer.from(encrypted).includes(Buffer.from('secret-refresh')));
 let mfa=await auth(req('/api/admin/v1/auth/mfa',{code:'123456',csrf:loginBody.csrf},pending),'synthetic-ip');assert.equal(mfa.status,200);
 const csrf=(await mfa.json()).csrf;const all=mfa.headers.getSetCookie();const cookie=all.find(x=>x.startsWith('__Host-biocraft-admin=')).split(';')[0];assert(!cookie.includes(token));
 let providerLoggedOut=false;const gateway=createCookieGateway({key:cookieKey,origin,delegate:admin,providerLogout:async()=>{providerLoggedOut=true}});
 let created=await gateway(new Request(`${origin}/api/admin/v1/bio-drafts`,{method:'POST',headers:{cookie,origin,'x-csrf-token':csrf,'Content-Type':'application/json'},body:JSON.stringify({key:'integration',bio:{content:'Hello',language:'en',platform:'instagram',active:true,featured:false}})}));assert.equal(created.status,201);
 let listed=await gateway(new Request(`${origin}/api/admin/v1/bio-drafts`,{headers:{cookie}}));assert.equal(listed.status,200);assert.equal((await listed.json()).items.length,1);
 const logout=await gateway(new Request(`${origin}/api/admin/v1/session`,{method:'DELETE',headers:{cookie,origin,'x-csrf-token':csrf}}));assert.equal(logout.status,200);assert(providerLoggedOut);assert.match(logout.headers.get('set-cookie'),/Max-Age=0/);
 assert.equal((await gateway(new Request(`${origin}/api/admin/v1/bio-drafts`,{headers:{cookie}}))).status,403);
 assert.equal((await gateway(new Request(`${origin}/api/admin/v1/csrf`,{headers:{cookie}}))).status,403);
 assert.equal((await auth(req('/api/admin/v1/auth/mfa',{code:'123456',csrf:loginBody.csrf},pending),'synthetic-ip')).status,401);
 for(let i=0;i<5;i++)assert.equal(await store.limit({bucket:'password-login',key:'separate-key'}),true);
 assert.equal(await store.limit({bucket:'password-login',key:'separate-key'}),false);
 console.log('PASS synthetic full local flow: password→TOTP→encrypted cookie→private draft→session revocation, encrypted handoff and DB rate limiter; Auth is mocked');
}finally{await db.close()}
