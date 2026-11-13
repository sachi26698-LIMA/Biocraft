// REAL PostgreSQL integration, synthetic provider tables and identities only.
// Runs solely against an explicitly provisioned disposable Unix-socket cluster.
// Never connect to hosted Supabase or an existing database with this script.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {randomBytes,randomUUID} from 'node:crypto';
import pg from 'pg';
import {createDatabaseExecutor} from '../admin-backend/server/database.mjs';
import {createAuthStorage} from '../admin-backend/server/auth-storage.mjs';
import {createRecoveryController} from '../admin-backend/server/recovery-controller.mjs';
const socket=process.env.BIOCRAFT_TEST_PG_SOCKET;
if(!socket || !fs.realpathSync(socket).startsWith('/tmp/biocraft-pg-')) throw Error('A disposable local Unix socket is required');
const admin=new pg.Pool({host:socket,user:process.env.USER,database:'postgres',max:12,connectionTimeoutMillis:3000});
let limited;
const uid='11111111-1111-4111-8111-111111111111',sid='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const identity={userId:uid,sessionId:sid,assuranceLevel:'aal2',mfaVerifiedAt:Math.floor(Date.now()/1000)};
try {
 const meta=await admin.query("select current_setting('data_directory') as path, current_setting('server_version') as version, current_database() as db");
 const data=fs.realpathSync(meta.rows[0].path);
 if(!data.startsWith('/tmp/biocraft-pg-')||meta.rows[0].db!=='postgres'||fs.readFileSync(data+'/BIOCRAFT_TEST_ONLY','utf8')!=='Local disposable Biocraft test cluster only\n')throw Error('Refusing non-disposable cluster');
 const blank=await admin.query("select exists(select 1 from pg_namespace where nspname in ('bc_admin_v1','auth')) as used, exists(select 1 from pg_roles where rolname in ('anon','authenticated','bc_fixture_executor')) as roles");
 if(blank.rows[0].used||blank.rows[0].roles)throw Error('Cluster is not blank; provision a new disposable cluster');
 await admin.query(`create role anon;create role authenticated;create role bc_fixture_executor login;
 create schema auth;create table auth.users(id uuid primary key);create table auth.sessions(id uuid primary key,user_id uuid references auth.users(id));
 create function auth.jwt() returns jsonb language sql stable as $$select coalesce(nullif(current_setting('request.jwt.claims',true),''),'{}')::jsonb$$;
 create function auth.uid() returns uuid language sql stable as $$select nullif(auth.jwt()->>'sub','')::uuid$$;`);
 await admin.query(fs.readFileSync('supabase/migrations/0001_initial_schema.sql','utf8'));
 for(const name of ['001_admin_foundation.sql','002_workflow_integrity.sql','003_permission_catalog.sql','004_private_draft_commands.sql','005_session_commands.sql','006_auth_controls.sql','007_staff_commands.sql','008_bio_edit.sql','009_recovery_sessions.sql','010_admin_module_commands.sql'])
  await admin.query(fs.readFileSync(`admin-backend/migrations/${name}`,'utf8'));
 await admin.query(fs.readFileSync('supabase/migrations/0002_rls_policies.sql','utf8'));
 await admin.query(`insert into auth.users values('${uid}'); insert into auth.sessions values('${sid}','${uid}');
 insert into bc_admin_v1.admin_users(id,enabled) values('${uid}',true);
 insert into bc_admin_v1.admin_user_roles(user_id,role_id) values('${uid}','editor');
 grant usage on schema bc_admin_v1 to bc_fixture_executor;
 grant execute on function bc_admin_v1.require_actor(text),bc_admin_v1.open_admin_session(uuid),bc_admin_v1.revoke_admin_session(uuid),bc_admin_v1.create_bio_draft(text,jsonb,uuid),bc_admin_v1.submit_draft(uuid,bigint,uuid,uuid),bc_admin_v1.review_draft(uuid,bigint,boolean,uuid),bc_admin_v1.list_my_bio_drafts(integer,timestamptz,uuid),bc_admin_v1.store_login_flow(bytea,bytea,integer),bc_admin_v1.take_login_flow(bytea),bc_admin_v1.consume_rate_limit(text,bytea),bc_admin_v1.list_staff(integer,uuid),bc_admin_v1.update_staff(uuid,bigint,boolean,text[],uuid),bc_admin_v1.update_bio_draft(uuid,bigint,jsonb,uuid),bc_admin_v1.get_bio_draft(uuid),bc_admin_v1.list_bio_review_queue(integer,timestamptz,uuid),bc_admin_v1.revoke_my_sessions(uuid),
 bc_admin_v1.list_platforms(integer,uuid),bc_admin_v1.list_categories(integer,uuid),bc_admin_v1.list_collections(integer,text),
 bc_admin_v1.list_generators(integer,uuid),bc_admin_v1.list_seo_pages(integer,uuid),bc_admin_v1.analytics_overview(),
 bc_admin_v1.list_settings(integer,text),bc_admin_v1.update_setting(text,jsonb,bigint,uuid),bc_admin_v1.list_role_catalog(),
 bc_admin_v1.list_my_sessions(integer,timestamptz),bc_admin_v1.list_audit_logs(integer,bigint) to bc_fixture_executor;
 -- Synthetic public rows so module reads have deterministic content.
 insert into public.platforms(name,slug,is_active,sort_order) values('Instagram','instagram',true,1),('Hidden','hidden',false,2);
 insert into public.categories(name,slug,is_active,sort_order,platform_id) select 'Tech','tech',true,1,id from public.platforms where slug='instagram';
 insert into public.bios(content,language,is_active,source_slug,platform_id,category_id)
  select 'Active bio','en',true,'tech-quotes',p.id,c.id from public.platforms p,public.categories c where p.slug='instagram' and c.slug='tech';
 insert into public.bios(content,language,is_active,source_slug) values('Archived bio','en',false,'tech-quotes');
 insert into public.generators(name,slug,generator_type,is_active,platform_id) select 'Bio Maker','bio-maker','bio',true,id from public.platforms where slug='instagram';
 insert into public.seo_pages(page_slug,title,is_active) values('/tech','Tech quotes',true);`);
 limited=new pg.Pool({host:socket,user:'bc_fixture_executor',database:'postgres',max:12});
 const exec=createDatabaseExecutor(limited);
 await assert.rejects(createDatabaseExecutor(admin)({identity,operation:'sessionOpen',args:[randomUUID()]}),/Unsafe database executor/);
 // Even a SET ROLE down from a superuser is rejected: session_user is privileged.
 const elevated=await admin.connect();try {await elevated.query('set role bc_fixture_executor');
  const switched={connect:async()=>({query:(...args)=>elevated.query(...args),release:()=>{}})};
  await assert.rejects(createDatabaseExecutor(switched)({identity,operation:'sessionOpen',args:[randomUUID()]}),/Unsafe database executor/);
 }finally{await elevated.query('reset role');elevated.release()}
 // A direct table privilege is prohibited even if the login role is otherwise limited.
 await admin.query('grant select on bc_admin_v1.admin_users to bc_fixture_executor');
 await assert.rejects(createDatabaseExecutor(admin)({identity,operation:'sessionOpen',args:[randomUUID()]}),/Unsafe database executor/);
 await admin.query('revoke select on bc_admin_v1.admin_users from bc_fixture_executor');
 await assert.rejects(exec({identity,operation:'list',args:[20,null,null]}),e=>e.code==='42501');
 await exec({identity,operation:'sessionOpen',args:[randomUUID()]});
 const draft=await exec({identity,operation:'create',args:['realpg',JSON.stringify({content:'Synthetic bio',language:'en',platform:'instagram',active:true,featured:false}),randomUUID()]});
 assert.equal((await exec({identity,operation:'list',args:[20,null,null]}))[0].draft_id,draft[0].draft_id);
 const editPayload=JSON.stringify({content:'Concurrent edit',language:'en',platform:'instagram',active:true,featured:false});
 const edits=await Promise.allSettled([1,2].map(()=>exec({identity,operation:'draftUpdate',args:[draft[0].draft_id,1,editPayload,randomUUID()]})));
 assert.equal(edits.filter(x=>x.status==='fulfilled').length,1);assert.equal(edits.find(x=>x.status==='rejected').reason.code,'40001');
 assert.equal((await exec({identity,operation:'draftGet',args:[draft[0].draft_id]}))[0].payload.content,'Concurrent edit');
 assert.equal((await admin.query("select count(*)::int n from bc_admin_v1.admin_content_versions where resource_key='realpg'")).rows[0].n,2);
 await assert.rejects(exec({identity,operation:'staffList',args:[20,null]}),e=>e.code==='42501');
 // RLS denial even if a hypothetical future SELECT grant/policy is added locally.
 await admin.query('grant usage on schema bc_admin_v1 to authenticated;grant select on bc_admin_v1.admin_users to authenticated;create policy fixture_permissive on bc_admin_v1.admin_users for select to authenticated using(true)');
 const client=await admin.connect();try {await client.query('set role authenticated');assert.equal((await client.query('select count(*)::int n from bc_admin_v1.admin_users')).rows[0].n,0);
 await assert.rejects(client.query('select bc_admin_v1.require_actor($1)',['content.read']),e=>e.code==='42501');}finally{await client.query('reset role');client.release()}
 // A currently authorized request locks membership for its entire transaction.
 const holder=await limited.connect(),other=await admin.connect();
 try {await holder.query('begin');await holder.query("select set_config('request.jwt.claims',$1,true)",[JSON.stringify({sub:uid,session_id:sid,aal:'aal2'})]);await holder.query("select bc_admin_v1.require_actor('content.read')");
  await other.query('begin');await other.query("set local lock_timeout='250ms'");
  await assert.rejects(other.query('update bc_admin_v1.admin_users set enabled=false where id=$1',[uid]),e=>e.code==='55P03');
  await other.query('rollback');await holder.query('commit');
 } finally {await holder.query('rollback');await other.query('rollback');holder.release();other.release()}
 const storage=createAuthStorage({pool:limited,encryptionKey:randomBytes(32),hashKey:randomBytes(32)});
 const attempts=await Promise.all(Array.from({length:10},()=>storage.limit({bucket:'password-login',key:'concurrent-fixture'})));
 assert.equal(attempts.filter(Boolean).length,5);
 const flow=randomBytes(32).toString('base64url');await storage.put(flow,{secret:'synthetic'},60);
 const taken=await Promise.all(Array.from({length:8},()=>storage.take(flow)));assert.equal(taken.filter(Boolean).length,1);assert.equal(taken.find(Boolean).secret,'synthetic');
 await admin.query("update bc_admin_v1.admin_sessions set expires_at=created_at+interval '1 millisecond' where id=$1",[sid]);
 await assert.rejects(exec({identity,operation:'list',args:[20,null,null]}),e=>e.code==='42501');
 // Recovery controller uses real PostgreSQL storage/session commands but the
 // Supabase provider is mocked. No real emails or passwords are touched.
 const recoverySid='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',factor='cccccccc-cccc-4ccc-8ccc-cccccccccccc',origin='https://preview.example';
 await admin.query('insert into auth.sessions(id,user_id) values($1,$2)',[recoverySid,uid]);
 const token=['eyJhbGciOiJub25lIn0',Buffer.from(JSON.stringify({iss:'https://jvpadtzfsuekixrquzjv.supabase.co/auth/v1',aud:'authenticated',role:'authenticated',aal:'aal2',is_anonymous:false,sub:uid,session_id:recoverySid,exp:Math.floor(Date.now()/1000)+300,amr:[{method:'totp',timestamp:Math.floor(Date.now()/1000)}]})).toString('base64url'),'signature'].join('.');
 let changed=false,globalSignout=false;const provider=()=>({auth:{
  resetPasswordForEmail:async()=>({error:null}),verifyOtp:async()=>({data:{session:{access_token:'aal1',refresh_token:'fixture-refresh'}}}),
  setSession:async()=>({data:{session:{access_token:'aal1'}}}),getUser:async()=>({data:{user:{id:uid,is_anonymous:false}}}),
  mfa:{listFactors:async()=>({data:{totp:[{id:factor,status:'verified'}]}}),challengeAndVerify:async({code})=>code==='123456'?{data:{access_token:token,refresh_token:'fixture-refresh'}}:{error:{}}},
  updateUser:async()=>{assert.equal((await admin.query('select count(*)::int n from bc_admin_v1.admin_sessions where user_id=$1 and revoked_at is null',[uid])).rows[0].n,0);changed=true;return {error:null}},
  signOut:async({scope})=>{if(scope==='global')globalSignout=true;return {error:null}}
 }});
 const recovery=createRecoveryController({enabled:true,origin,createClient:provider,flowStore:storage,limiter:storage.limit,execute:exec});
 const post=(url,value,cookie)=>new Request(origin+url,{method:'POST',headers:{origin,'content-type':'application/json',...(cookie?{cookie}:{})},body:JSON.stringify(value)});
 assert.equal((await recovery(post('/api/admin/v1/auth/recovery/request',{email:'synthetic@example.com'}),'recovery-ip')).status,202);
 let exchange=await recovery(post('/api/admin/v1/auth/recovery/exchange',{tokenHash:'a'.repeat(64)}),'recovery-ip');assert.equal(exchange.status,200);
 let csrf=(await exchange.json()).csrf,cookie=exchange.headers.get('set-cookie').split(';')[0];
 assert.equal((await recovery(post('/api/admin/v1/auth/recovery/complete',{code:'000000',csrf,password:'synthetic password'},cookie),'recovery-ip')).status,401);assert.equal(changed,false);
 exchange=await recovery(post('/api/admin/v1/auth/recovery/exchange',{tokenHash:'b'.repeat(64)}),'recovery-ip');csrf=(await exchange.json()).csrf;cookie=exchange.headers.get('set-cookie').split(';')[0];
 assert.equal((await recovery(post('/api/admin/v1/auth/recovery/complete',{code:'123456',csrf,password:'synthetic password'},cookie),'recovery-ip')).status,200);
 assert(changed&&globalSignout);assert.equal((await admin.query("select count(*)::int n from bc_admin_v1.admin_audit_logs where action='session.revoke_all'")).rows[0].n,1);
 await assert.rejects(exec({identity:{...identity,sessionId:recoverySid},operation:'sessionCheck',args:[]}),e=>e.code==='42501');
 // 010 module reads run as the limited executor against real public tables. Reopen the recovered Admin session first: it was
 // revoked earlier, and an expired session intentionally cannot be reused.
 const activeSid=randomUUID();await admin.query('insert into auth.sessions(id,user_id) values($1,$2)',[activeSid,uid]);
 const active={...identity,sessionId:activeSid};
 await exec({identity:active,operation:'sessionOpen',args:[randomUUID()]});
 assert.equal((await exec({identity:active,operation:'platformList',args:[50,null]})).length,2);
 const cats=await exec({identity:active,operation:'categoryList',args:[50,null]});assert.equal(cats.length,1);assert.equal(cats[0].platform_slug,'instagram');
 const cols=await exec({identity:active,operation:'collectionList',args:[50,null]});assert.deepEqual(cols.map(c=>({s:c.source_slug,a:Number(c.active_bios),b:Number(c.archived_bios)})),[{s:'tech-quotes',a:1,b:1}]);
 assert.equal((await exec({identity:active,operation:'generatorList',args:[50,null]})).length,1);
 assert.equal((await exec({identity:active,operation:'seoList',args:[50,null]})).length,1);
 // Settings/audit need permissions the editor fixture lacks.
 await assert.rejects(exec({identity:active,operation:'settingList',args:[50,null]}),e=>e.code==='42501');
 await assert.rejects(exec({identity:active,operation:'settingUpdate',args:['site.title',JSON.stringify({v:1}),1,randomUUID()]}),e=>e.code==='42501');
 await assert.rejects(exec({identity:active,operation:'auditLogs',args:[10,null]}),e=>e.code==='42501');
 await admin.query("insert into bc_admin_v1.admin_user_roles(user_id,role_id) values($1,'admin'),($1,'auditor')",[uid]);
 // Analytics requires analytics.read, which the editor fixture lacks.
 const metrics=await exec({identity:active,operation:'analytics',args:[]});assert.equal(Number(metrics.find(m=>m.metric==='bios.active').value),1);
 assert.equal(Number(metrics.find(m=>m.metric==='bios.archived').value),1);
 assert.equal((await exec({identity:active,operation:'roleCatalog',args:[]})).length,8);
 assert((await exec({identity:active,operation:'mySessions',args:[10,null]})).length>=1);
 assert((await exec({identity:active,operation:'auditLogs',args:[10,null]})).length>=1);
 // settings.manage is super-admin only: an admin is refused, then a synthetic
 // super_admin membership (direct fixture insert, no bootstrap) succeeds.
 await assert.rejects(exec({identity:active,operation:'settingUpdate',args:['site.title',JSON.stringify({value:'x'}),1,randomUUID()]}),e=>e.code==='42501');
 await admin.query("insert into bc_admin_v1.admin_user_roles(user_id,role_id) values($1,'super_admin')",[uid]);
 const first=await exec({identity:active,operation:'settingUpdate',args:['site.title',JSON.stringify({value:'BioCraft'}),1,randomUUID()]});
 assert.equal(first[0].version,1);
 assert.equal((await exec({identity:active,operation:'settingList',args:[50,null]})).length,1);
 await assert.rejects(exec({identity:active,operation:'settingUpdate',args:['site.title',JSON.stringify({value:'x'}),5,randomUUID()]}),e=>e.code==='40001');
 const second=await exec({identity:active,operation:'settingUpdate',args:['site.title',JSON.stringify({value:'BioCraft v2'}),1,randomUUID()]});
 assert.equal(second[0].version,2);
 await assert.rejects(exec({identity:active,operation:'settingUpdate',args:['site.title',JSON.stringify({value:'stale'}),1,randomUUID()]}),e=>e.code==='40001');
 const stale={...identity,mfaVerifiedAt:Math.floor(Date.now()/1000)-3600};
 await assert.rejects(exec({identity:{...stale,sessionId:activeSid},operation:'create',args:['stale',JSON.stringify({content:'x',language:'en',platform:'instagram',active:true,featured:false}),randomUUID()]}),e=>e.code==='28000');
 await assert.rejects(exec({identity:{...active,mfaVerifiedAt:null},operation:'create',args:['none',JSON.stringify({content:'x',language:'en',platform:'instagram',active:true,featured:false}),randomUUID()]}),e=>e.code==='28000');
 console.log(`PASS PostgreSQL ${meta.rows[0].version}: fixture migrations, immutable concurrent bio edits, non-owner RBAC, session expiry, restrictive RLS, membership lock, concurrent limiter and atomic handoff and recovery revocation, 010 module reads/settings write and step-up freshness. Provider Auth is mocked; no shared project used.`);
} finally {if(limited)await limited.end();await admin.end()}
