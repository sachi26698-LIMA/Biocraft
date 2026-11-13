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
let execRef=null;
const tryOpen=async({identity})=>execRef({identity,operation:'sessionOpen',args:[randomUUID()]});
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
 for(const name of ['001_admin_foundation.sql','002_workflow_integrity.sql','003_permission_catalog.sql','004_private_draft_commands.sql','005_session_commands.sql','006_auth_controls.sql','007_staff_commands.sql','008_bio_edit.sql','009_recovery_sessions.sql','010_admin_module_commands.sql','011_totp_enrolment.sql','012_recovery_and_cleanup.sql','013_publication_bridge.sql','014_module_read_surface.sql'])
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
 bc_admin_v1.list_my_sessions(integer,timestamptz),bc_admin_v1.list_audit_logs(integer,bigint),bc_admin_v1.enrolment_eligible(uuid),
 bc_admin_v1.issue_recovery_grant(uuid,bytea,bytea,interval,uuid),bc_admin_v1.revoke_recovery_grant(uuid,uuid),
 bc_admin_v1.consume_recovery_grant(bytea,uuid),bc_admin_v1.recovery_grant_state(uuid),bc_admin_v1.reset_factor_enrolment(uuid,uuid),
 bc_admin_v1.publish_bio_draft(uuid,bigint,uuid,uuid),bc_admin_v1.list_bio_publications(uuid,integer,bigint),bc_admin_v1.create_revert_draft(bigint,uuid),
 bc_admin_v1.list_my_notifications(integer,timestamptz),bc_admin_v1.mark_notifications_read(timestamptz),bc_admin_v1.list_publication_jobs(integer,uuid),
 bc_admin_v1.list_backup_records(integer,timestamptz),bc_admin_v1.list_public_bios(integer,uuid,text,text,boolean),
 bc_admin_v1.cleanup_expired(text,integer,uuid),bc_admin_v1.factor_gate(uuid) to bc_fixture_executor;
 -- Synthetic public rows so module reads have deterministic content.
 insert into public.platforms(name,slug,is_active,sort_order) values('Instagram','instagram',true,1),('Hidden','hidden',false,2);
 insert into public.categories(name,slug,is_active,sort_order,platform_id) select 'Tech','tech',true,1,id from public.platforms where slug='instagram';
 insert into public.bios(content,language,is_active,source_slug,platform_id,category_id)
  select 'Active bio','en',true,'tech-quotes',p.id,c.id from public.platforms p,public.categories c where p.slug='instagram' and c.slug='tech';
 insert into public.bios(content,language,is_active,source_slug) values('Archived bio','en',false,'tech-quotes');
 insert into public.generators(name,slug,generator_type,is_active,platform_id) select 'Bio Maker','bio-maker','bio',true,id from public.platforms where slug='instagram';
 insert into public.seo_pages(page_slug,title,is_active) values('/tech','Tech quotes',true);`);
 limited=new pg.Pool({host:socket,user:'bc_fixture_executor',database:'postgres',max:12});
 const exec=createDatabaseExecutor(limited);execRef=exec;
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
 // 011 enrolment gate, hardened by 012: an AAL1 password session is enough only
 // for enrolment, only while the membership is enabled, roled and the provider
 // session lives, AND only while the account has never proven a factor. Any
 // earlier session in this suite proves one, so the record is cleared first —
 // which is exactly what the audited reset does for a real operator.
 await admin.query('update bc_admin_v1.admin_users set mfa_enrolled_at=null where id=$1',[uid]);
 const aal1={...identity,assuranceLevel:'aal1',mfaVerifiedAt:Math.floor(Date.now()/1000)};
 assert.deepEqual(await exec({identity:aal1,operation:'enrolmentEligible',args:[randomUUID()]}),[{eligible:true}]);
 await assert.rejects(exec({identity:aal1,operation:'create',args:['aal1',JSON.stringify({content:'x',language:'en',platform:'instagram',active:true,featured:false}),randomUUID()]}),/Invalid operation/);
 await admin.query('delete from auth.sessions where user_id=$1',[uid]);
 assert.deepEqual(await exec({identity:aal1,operation:'enrolmentEligible',args:[randomUUID()]}),[{eligible:false}]);
 await admin.query('insert into auth.sessions(id,user_id) values($1,$2)',[activeSid,uid]);
 await admin.query('update bc_admin_v1.admin_users set enabled=false where id=$1',[uid]);
 assert.deepEqual(await exec({identity:aal1,operation:'enrolmentEligible',args:[randomUUID()]}),[{eligible:false}]);
 await admin.query('update bc_admin_v1.admin_users set enabled=true where id=$1',[uid]);
 await admin.query('delete from bc_admin_v1.admin_user_roles where user_id=$1',[uid]);
 assert.deepEqual(await exec({identity:aal1,operation:'enrolmentEligible',args:[randomUUID()]}),[{eligible:false}]);
 await admin.query("insert into bc_admin_v1.admin_user_roles(user_id,role_id) values($1,'editor')",[uid]);
 // An AAL2 session passes the same gate while the record is still clear.
 assert.deepEqual(await exec({identity:{...aal1,sessionId:activeSid,assuranceLevel:'aal2'},operation:'enrolmentEligible',args:[randomUUID()]}),[{eligible:true}]);
 // Once a factor is recorded, the gate refuses a fresh enrolment even for AAL2:
 // the account must go through recovery, which is the whole point of D2.
 await admin.query('update bc_admin_v1.admin_users set mfa_enrolled_at=now() where id=$1',[uid]);
 assert.deepEqual(await exec({identity:{...aal1,sessionId:activeSid,assuranceLevel:'aal2'},operation:'enrolmentEligible',args:[randomUUID()]}),[{eligible:false}]);
 await admin.query('update bc_admin_v1.admin_users set mfa_enrolled_at=null where id=$1',[uid]);
 // Every attempt commits an audit row, and no token material is stored.
 const audits=await admin.query("select actor_id,details from bc_admin_v1.admin_audit_logs where action='auth.enrolment_attempt' order by id");
 assert.equal(audits.rows.length,6);
 assert.deepEqual(audits.rows.map(r=>r.details.eligible),[true,false,false,false,true,false]);
 assert.equal(audits.rows.filter(r=>r.actor_id===null).length,4);
 assert.equal(JSON.stringify(audits.rows).includes('eyJ'),false);
 await assert.rejects(exec({identity:aal1,operation:'enrolmentEligible',args:[null]}),e=>e.code==='22023');
 // ---- 012: Super-Admin-authorised recovery and bounded cleanup ----
 const RG=await import('../admin-backend/server/recovery-grant.mjs');
 const target='dddddddd-dddd-4ddd-8ddd-dddddddddddd',tsid='eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee';
 await admin.query("insert into auth.users(id) values($1)",[target]);
 await admin.query("insert into bc_admin_v1.admin_users(id,enabled) values($1,true)",[target]);
 await admin.query("insert into bc_admin_v1.admin_user_roles(user_id,role_id) values($1,'editor')",[target]);
 await admin.query("insert into auth.sessions(id,user_id) values($1,$2)",[tsid,target]);
 await admin.query("insert into bc_admin_v1.admin_user_roles(user_id,role_id) values($1,'super_admin')",[uid]);
 const issuer={...identity,sessionId:activeSid};
 // Only a Super Admin (staff.manage) may issue, and never for their own account.
 await assert.rejects(RG.issueRecoveryGrant({execute:exec,identity:{...issuer,assuranceLevel:'aal1'},targetUserId:target}),/FORBIDDEN/);
 await assert.rejects(RG.issueRecoveryGrant({execute:exec,identity:issuer,targetUserId:uid}),/FORBIDDEN/);
 // An editor (no staff.manage) is refused by the database, not just the wrapper.
 await assert.rejects(exec({identity:{userId:target,sessionId:tsid,assuranceLevel:'aal2',mfaVerifiedAt:Math.floor(Date.now()/1000)},operation:'recoveryIssue',args:[uid,randomBytes(32),randomBytes(8),'300 seconds',randomUUID()]}),e=>e.code==='42501');
 const granted=await RG.issueRecoveryGrant({execute:exec,identity:issuer,targetUserId:target});
 assert.match(granted.code,/^[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}$/);
 assert(RG.isWellFormedRecoveryCode(granted.code));
 // A second issuance withdraws the first: one live grant per account.
 const regrant=await RG.issueRecoveryGrant({execute:exec,identity:issuer,targetUserId:target});
 assert.equal((await admin.query("select count(*)::int n from bc_admin_v1.admin_recovery_grants where user_id=$1 and revoked_at is null and consumed_at is null",[target])).rows[0].n,1);
 assert.equal(RG.isWellFormedRecoveryCode(granted.code.slice(0,4)+'-'+granted.code.slice(5,9)+'-'+granted.code.slice(10)),true);
 const recovering={userId:target,sessionId:tsid,assuranceLevel:'aal1',mfaVerifiedAt:null};
 assert.equal((await exec({identity:recovering,operation:'recoveryState',args:[randomUUID()]})).length,1);
 // The superseded code cannot be redeemed: only the newest grant is live.
 await assert.rejects(RG.redeemRecoveryCode({execute:exec,identity:recovering,code:granted.code}),e=>e.code==='UNAUTHENTICATED');
 assert.equal((await admin.query("select count(*)::int n from bc_admin_v1.admin_recovery_grants where user_id=$1 and consumed_at is not null",[target])).rows[0].n,0);
 const redeemed=await RG.redeemRecoveryCode({execute:exec,identity:recovering,code:regrant.code});
 assert.deepEqual({ok:redeemed.ok,next:redeemed.next},{ok:true,next:'factor_reset_required'});
 // Single use: the same code is refused afterwards, and nothing signed anyone in.
 await assert.rejects(RG.redeemRecoveryCode({execute:exec,identity:recovering,code:regrant.code}),e=>e.code==='UNAUTHENTICATED');
 assert.equal((await admin.query("select count(*)::int n from bc_admin_v1.admin_sessions where user_id=$1",[target])).rows[0].n,0);
 // Five wrong attempts exhaust the grant; a sixth is refused even with the right code.
 const third=await RG.issueRecoveryGrant({execute:exec,identity:issuer,targetUserId:target});
 // A well-formed code from a different grant: right shape, wrong digest, so it
 // exercises the attempt counter rather than local format rejection.
 const wrong=RG.issueRecoveryCode().code;
 assert.ok(RG.isWellFormedRecoveryCode(wrong));
 const digests=[];
 for(let i=0;i<5;i+=1){try{await RG.redeemRecoveryCode({execute:exec,identity:recovering,code:wrong});digests.push('ok');}catch(e){digests.push(e.code??'OTHER');}}
 assert.equal(digests.filter(x=>x==='UNAUTHENTICATED').length,4,digests.join(','));
 assert.equal(digests.filter(x=>x==='FORBIDDEN').length,1,digests.join(','));
 // Exhausted grants are revoked, so the correct code is now refused as
 // unauthenticated: there is no live grant left to compare against.
 await assert.rejects(RG.redeemRecoveryCode({execute:exec,identity:recovering,code:third.code}),e=>['FORBIDDEN','UNAUTHENTICATED'].includes(e.code));
 assert.equal((await admin.query("select revoked_at is not null as dead, consumed_at is null as unused from bc_admin_v1.admin_recovery_grants where id=$1",[third.grantId])).rows[0].dead,true);
 // Every attempt is audited and no code material is stored anywhere.
 const recAudit=await admin.query("select action,details from bc_admin_v1.admin_audit_logs where action like 'auth.recovery.%'");
 assert(recAudit.rows.some(r=>r.action==='auth.recovery.issued'));
 assert(recAudit.rows.some(r=>r.action==='auth.recovery.attempt'&&r.details.outcome==='ok'));
 assert(recAudit.rows.some(r=>r.action==='auth.recovery.attempt'&&r.details.outcome==='exhausted'));
 const stored=await admin.query("select code_hash,salt from bc_admin_v1.admin_recovery_grants");
 assert(stored.rows.every(r=>r.code_hash.length===32&&r.salt.length===8));
 assert.equal(JSON.stringify(stored.rows).includes(regrant.code.split('-')[0]),false);
 // ---- D2 factor gate: never-enrolled vs lost-factor, and the stamp ----
 // The target has never proven a factor, so a password session may enrol.
 assert.equal((await exec({identity:recovering,operation:'factorGate',args:[randomUUID()]}))[0].outcome,'enrol');
 // Opening an Admin session is AAL2-only, and stamps the first proof of a factor.
 await tryOpen({identity:{...recovering,assuranceLevel:'aal2',mfaVerifiedAt:Math.floor(Date.now()/1000)}});
 assert.notEqual((await admin.query("select mfa_enrolled_at from bc_admin_v1.admin_users where id=$1",[target])).rows[0].mfa_enrolled_at,null);
 // From then on the same password session must recover, not re-enrol.
 assert.equal((await exec({identity:recovering,operation:'factorGate',args:[randomUUID()]}))[0].outcome,'recover');
 // A disabled member or one with no role is denied outright.
 await admin.query("update bc_admin_v1.admin_users set enabled=false where id=$1",[target]);
 assert.equal((await exec({identity:recovering,operation:'factorGate',args:[randomUUID()]}))[0].outcome,'denied');
 await admin.query("update bc_admin_v1.admin_users set enabled=true where id=$1",[target]);
 await admin.query("delete from bc_admin_v1.admin_user_roles where user_id=$1",[target]);
 assert.equal((await exec({identity:recovering,operation:'factorGate',args:[randomUUID()]}))[0].outcome,'denied');
 // No provider session means no decision either, and every attempt is audited.
 await admin.query("insert into bc_admin_v1.admin_user_roles(user_id,role_id) values($1,'editor')",[target]);
 await admin.query("delete from auth.sessions where user_id=$1",[target]);
 assert.equal((await exec({identity:recovering,operation:'factorGate',args:[randomUUID()]}))[0].outcome,'denied');
 const gates=await admin.query("select details->>'outcome' o from bc_admin_v1.admin_audit_logs where action='auth.factor_gate' order by id");
 assert.deepEqual(gates.rows.map(r=>r.o),['enrol','recover','denied','denied','denied']);
 // ---- D2 reset: the operator closes a recovery without reopening a bypass ----
 // `reset_factor_enrolment` requires staff.manage inside the function, so an
 // editor session is refused even though the executor holds EXECUTE on it.
 await admin.query("update bc_admin_v1.admin_users set enabled=true where id=$1",[target]);
 await assert.rejects(exec({identity:{userId:target,sessionId:tsid,assuranceLevel:'aal2',mfaVerifiedAt:Math.floor(Date.now()/1000)},operation:'factorReset',args:[target,randomUUID()]}),e=>e.code==='42501');
 // A Super Admin cannot reset their own record, and only a Super Admin may reset.
 await assert.rejects(RG.resetFactorEnrolment({execute:exec,identity:issuer,targetUserId:uid}),/FORBIDDEN/);
 await assert.rejects(RG.resetFactorEnrolment({execute:exec,identity:{...issuer,assuranceLevel:'aal1'},targetUserId:target}),/FORBIDDEN/);
 // The reset itself: clears the proof, returns the account to first enrolment,
 // and is audited. The executor grant list is unchanged by it.
 const restored=await RG.resetFactorEnrolment({execute:exec,identity:issuer,targetUserId:target});
 assert.equal(restored,true);
 assert.equal((await admin.query("select mfa_enrolled_at from bc_admin_v1.admin_users where id=$1",[target])).rows[0].mfa_enrolled_at,null);
 await admin.query("insert into auth.sessions(id,user_id) values($1,$2)",[tsid,target]);
 assert.equal((await exec({identity:recovering,operation:'factorGate',args:[randomUUID()]}))[0].outcome,'enrol');
 assert.equal((await RG.resetFactorEnrolment({execute:exec,identity:issuer,targetUserId:target})),false);
 const resetAudit=await admin.query("select details from bc_admin_v1.admin_audit_logs where action='auth.recovery.factor_reset' order by id");
 assert.deepEqual(resetAudit.rows.map(r=>r.details.reset),[true,false]);
 // ---- 013: the reviewed publication bridge, end to end ----
 // Three distinct acting identities: an author, an independent reviewer and an
 // independent publisher. The bridge must refuse any two of them collapsing.
 const author='33333333-3333-4333-8333-333333333333', reviewer='44444444-4444-4444-8444-444444444444',
       publisher='55555555-5555-4555-8555-555555555555', asid='cccccccc-cccc-4ccc-8ccc-cccccccccc01',
       rsid='cccccccc-cccc-4ccc-8ccc-cccccccccc02', psid='cccccccc-cccc-4ccc-8ccc-cccccccccc03';
 for (const [person, session] of [[author,asid],[reviewer,rsid],[publisher,psid]]) {
  await admin.query('insert into auth.users(id) values($1) on conflict do nothing',[person]);
  await admin.query('insert into auth.sessions(id,user_id) values($1,$2) on conflict do nothing',[session,person]);
  await admin.query('insert into bc_admin_v1.admin_users(id,enabled) values($1,true) on conflict do nothing',[person]);
 }
 // The author needs content.draft only; the reviewer must be able to approve;
 // the publisher needs content.publish and must be a third identity — so the
 // publisher is admin (which also holds content.draft, needed below to open a
 // revert) while the reviewer stays content_manager.
 for (const [person, role] of [[author,'editor'],[reviewer,'content_manager'],[publisher,'admin']]) {
  await admin.query('delete from bc_admin_v1.admin_user_roles where user_id=$1',[person]);
  await admin.query('insert into bc_admin_v1.admin_user_roles(user_id,role_id) values($1,$2)',[person,role]);
 }

 const idFor = (person) => ({identity:{userId:person,sessionId:{[author]:asid,[reviewer]:rsid,[publisher]:psid}[person],assuranceLevel:'aal2',mfaVerifiedAt:Math.floor(Date.now()/1000)}});
 const asAuthor = idFor(author), asReviewer = idFor(reviewer), asPublisher = idFor(publisher);
 // require_actor also demands a live Admin session row, so each acting identity
 // opens one exactly as the real login flow does.
 for (const identity of [asAuthor, asReviewer, asPublisher]) await tryOpen(identity);
 // A draft with a real payload, created by the author.
 const payload = Object.freeze({content:'Published through the reviewed bridge',language:'en',platform:'instagram',active:true,featured:false});
 const pubDraft = (await exec({...asAuthor,operation:'create',args:['publication-test',JSON.stringify(payload),randomUUID()]}))[0].draft_id;
 // Not approved yet: publication is refused, and it is refused for everyone.
 await assert.rejects(exec({...asPublisher,operation:'publish',args:[pubDraft,1,null,randomUUID()]}),e=>e.code==='42501');
 // Submit, then review. The reviewer must be independent of the author.
 await exec({...asAuthor,operation:'submit',args:[pubDraft,1,reviewer,randomUUID()]});
 await exec({...asReviewer,operation:'reviewApprove',args:[pubDraft,2,randomUUID()]});
 // Three refusals: a stale version, the author publishing their own work, and a
 // publisher who was also the approver. Each fails on a distinct rule.
 await assert.rejects(exec({...asPublisher,operation:'publish',args:[pubDraft,1,null,randomUUID()]}),e=>e.code==='40001');
 await assert.rejects(exec({...asAuthor,operation:'publish',args:[pubDraft,3,null,randomUUID()]}),e=>e.code==='42501');
 await assert.rejects(exec({...asReviewer,operation:'publish',args:[pubDraft,3,null,randomUUID()]}),e=>e.code==='42501');
 // The real publication: one new row in public.bios, one draft now published.
 const before = (await admin.query('select count(*)::int n from public.bios')).rows[0].n;
 const published = (await exec({...asPublisher,operation:'publish',args:[pubDraft,3,null,randomUUID()]}))[0];
 assert.equal(published.action,'created');
 assert.equal((await admin.query('select count(*)::int n from public.bios')).rows[0].n, before+1);
 const row = await admin.query('select b.id,b.content,b.language,b.source_slug,b.is_active,p.slug platform from public.bios b join public.platforms p on p.id=b.platform_id where b.id=$1',[published.bio_id]);
 assert.equal(row.rows[0].content,payload.content);
 assert.equal(row.rows[0].source_slug,'publication-test');
 assert.equal(row.rows[0].platform,'instagram');
 assert.equal((await admin.query('select state from bc_admin_v1.admin_drafts where id=$1',[pubDraft])).rows[0].state,'published');
 // Publishing is single-shot: the draft is no longer approved, so a replay fails.
 await assert.rejects(exec({...asPublisher,operation:'publish',args:[pubDraft,4,null,randomUUID()]}),e=>e.code==='42501');
 // Idempotency: the same text in a new draft of the same key cannot duplicate a row.
 const again = (await exec({...asAuthor,operation:'create',args:['publication-test',JSON.stringify(payload),randomUUID()]}))[0].draft_id;
 await exec({...asAuthor,operation:'submit',args:[again,1,reviewer,randomUUID()]});
 await exec({...asReviewer,operation:'reviewApprove',args:[again,2,randomUUID()]});
 const republished = (await exec({...asPublisher,operation:'publish',args:[again,3,null,randomUUID()]}))[0];
 assert.equal(republished.action,'restored');
 assert.equal(republished.bio_id,published.bio_id);
 assert.equal((await admin.query('select count(*)::int n from public.bios where source_slug=$1 and md5(content)=md5($2)',['publication-test',payload.content])).rows[0].n,1);
 // Archive through the same reviewed path: is_active false, and the row survives.
 const archivedDraft = (await exec({...asAuthor,operation:'create',args:['publication-test-archive',JSON.stringify({...payload,content:'Archive me',active:true}),randomUUID()]}))[0].draft_id;
 await exec({...asAuthor,operation:'submit',args:[archivedDraft,1,reviewer,randomUUID()]});
 await exec({...asReviewer,operation:'reviewApprove',args:[archivedDraft,2,randomUUID()]});
 const created = (await exec({...asPublisher,operation:'publish',args:[archivedDraft,3,null,randomUUID()]}))[0];
 const hideDraft = (await exec({...asAuthor,operation:'create',args:['publication-test-archive',JSON.stringify({...payload,content:'Archive me',active:false}),randomUUID()]}))[0].draft_id;
 await exec({...asAuthor,operation:'submit',args:[hideDraft,1,reviewer,randomUUID()]});
 await exec({...asReviewer,operation:'reviewApprove',args:[hideDraft,2,randomUUID()]});
 const hidden = (await exec({...asPublisher,operation:'publish',args:[hideDraft,3,created.bio_id,randomUUID()]}))[0];
 assert.equal(hidden.action,'archived');
 assert.equal((await admin.query('select is_active from public.bios where id=$1',[created.bio_id])).rows[0].is_active,false);
 assert.equal((await admin.query('select count(*)::int n from public.bios where id=$1',[created.bio_id])).rows[0].n,1);
 // History is readable, append-only, and names the actor and the version.
 const history = await exec({...asPublisher,operation:'publications',args:[created.bio_id,50,null]});
 assert.equal(history.length,2);
 assert.deepEqual(history.map(r=>r.action),['archived','created']);
 await assert.rejects(admin.query("update bc_admin_v1.admin_bio_publications set action='updated' where bio_id=$1",[created.bio_id]),/append-only/);
 await assert.rejects(admin.query('delete from bc_admin_v1.admin_bio_publications where bio_id=$1',[created.bio_id]),/append-only/);
 // Rollback opens a reviewed revert draft; it does not silently rewrite the row.
 const revert = (await exec({...asPublisher,operation:'revert',args:[history[1].id,randomUUID()]}))[0].revert_draft;
 const reverting = await admin.query("select d.state,v.payload from bc_admin_v1.admin_drafts d join bc_admin_v1.admin_content_versions v on v.id=d.version_id where d.id=$1",[revert]);
 assert.equal(reverting.rows[0].state,'draft');
 assert.equal(reverting.rows[0].payload.content,'Archive me');
 assert.equal((await admin.query('select is_active from public.bios where id=$1',[created.bio_id])).rows[0].is_active,false,'a revert must not change the published row until it is itself reviewed and published');
 // An executor that is not a member of anything cannot reach the bridge at all.
 await assert.rejects(exec({identity:{userId:randomUUID(),sessionId:psid,assuranceLevel:'aal2',mfaVerifiedAt:Math.floor(Date.now()/1000)},operation:'publish',args:[pubDraft,3,null,randomUUID()]}),e=>e.code==='42501');
 // And audit evidence exists for every publication attempt that succeeded.
 const publishAudit=await admin.query("select details from bc_admin_v1.admin_audit_logs where action='draft.published' order by id");
 // Four successful publications: two new rows (the deduplicated re-publish is a
 // 'restored', not a second 'created'), then the reviewed archive.
 assert.equal(publishAudit.rows.length,4);
 assert.deepEqual(publishAudit.rows.map(r=>r.details.publication),['created','restored','created','archived']);

 // ---- 014: module read surface and the notification writer ----
 // The inbox only ever shows the caller's rows, and the writer records the three
 // events that matter: assigned, decided, published.
 const inboxAuthor = await exec({...asAuthor,operation:'notificationList',args:[50,null]});
 // Four drafts were published above, each producing one decision and exactly one
 // publication notice. Counted per category, not by row order: the two rows of a
 // single draft share a timestamp, so their relative order is not a contract.
 const byCategory = (rows) => rows.reduce((acc,row)=>({...acc,[row.category]:(acc[row.category]??0)+1}),{});
 assert.deepEqual(byCategory(inboxAuthor),{'content.published':4,'review.decided':4});
 assert.equal(inboxAuthor.every(n=>n.unread),true);
 assert.equal(inboxAuthor.every(n=>n.message.length>0 && n.message.length<=1000),true);
 const inboxReviewer = await exec({...asReviewer,operation:'notificationList',args:[50,null]});
 // One assignment per submission (four), and the reviewer is never notified of a
 // decision it made itself.
 assert.deepEqual(byCategory(inboxReviewer),{'review.assigned':4});
 // Reading and marking are scoped to the session, so one member cannot clear
 // another member's inbox: the marked count is this caller's rows only.
 const marked = Number((await exec({...asReviewer,operation:'notificationRead',args:[null]}))[0].marked);
 assert.equal(marked,4);
 assert.equal((await exec({...asReviewer,operation:'notificationList',args:[50,null]})).every(n=>!n.unread),true);
 assert.equal((await exec({...asAuthor,operation:'notificationList',args:[50,null]})).every(n=>n.unread),true,'marking must not cross accounts');
 // Keyset paging walks backwards without repeating or skipping.
 const newest = await exec({...asAuthor,operation:'notificationList',args:[1,null]});
 const older = await exec({...asAuthor,operation:'notificationList',args:[50,newest[0].created_at]});
 assert.ok(older.every(n=>new Date(n.created_at)<=new Date(newest[0].created_at)));
 assert.ok(!older.some(n=>n.id===newest[0].id),'the cursor row must not repeat');
 // A notification can never block the workflow step that produced it.
 await admin.query("alter table bc_admin_v1.admin_notifications add constraint test_only_block check (message <> 'never')");
 // Publication jobs are evidence, readable with content.read, newest first by id.
 // `admin_publication_jobs.id` defaults to gen_random_uuid(), so id order is not
 // creation order; the assertion is about completeness and shape, not order.
 const jobs = await exec({...asAuthor,operation:'publicationJobList',args:[50,null]});
 assert.equal(jobs.length,4);
 assert.equal(jobs.every(j=>j.state==='succeeded'),true);
 assert.deepEqual([...new Set(jobs.map(j=>j.resource_key))].sort(),['publication-test','publication-test-archive']);
 // 013 publishes into public.bios in the same database the public site reads, so
 // the job record says 'production'. That label is the honest one: a publication
 // is visible to guests immediately. It is not a preview copy.
 assert.equal(jobs.every(j=>j.target_environment==='production'),true);
 // Backup history is empty and says so honestly rather than erroring.
 assert.deepEqual(await exec({...asPublisher,operation:'backupList',args:[50,null]}),[]);
 // The live bio library sees inactive rows and pages by id.
 const lib = await exec({...asAuthor,operation:'bioList',args:[100,null,null,null,null]});
 assert.ok(lib.length>=2);
 assert.ok(lib.some(b=>b.is_active===false),'the library must include archived rows');
 assert.deepEqual((await exec({...asAuthor,operation:'bioList',args:[100,null,null,null,true]})).every(b=>b.is_active),true);
 // Search is an escaped, case-insensitive substring match over title and content.
 // A distinctive phrase keeps the assertion about the feature, not about words
 // that an unrelated fixture row happens to contain.
 const hits = await exec({...asAuthor,operation:'bioList',args:[100,null,'archive me',null,null]});
 assert.equal(hits.length,1);
 assert.equal(hits[0].source_slug,'publication-test-archive');
 // '%' and '_' are ordinary characters, not wildcards: no fixture content contains
 // a literal percent sign or underscore, so neither may match everything.
 assert.deepEqual(await exec({...asAuthor,operation:'bioList',args:[100,null,'%',null,null]}),[]);
 assert.deepEqual(await exec({...asAuthor,operation:'bioList',args:[100,null,'_',null,null]}),[]);
 // Case-insensitive, and an empty search is "everything", not "nothing".
 assert.equal((await exec({...asAuthor,operation:'bioList',args:[100,null,'ARCHIVE ME',null,null]})).length,1);
 assert.equal((await exec({...asAuthor,operation:'bioList',args:[100,null,'',null,null]})).length,lib.length);
 assert.equal((await exec({...asAuthor,operation:'bioList',args:[100,null,null,'en',null]})).every(b=>b.language==='en'),true);
 // Bad paging is refused, not silently clamped.
 await assert.rejects(exec({...asAuthor,operation:'bioList',args:[101,null,null,null,null]}),e=>e.code==='22023');
 await assert.rejects(exec({...asAuthor,operation:'bioList',args:[10,null,null,'xx',null]}),e=>e.code==='22023');
 // An account with no membership reads nothing at all.
 const stranger='66666666-6666-4666-8666-666666666666';
 await admin.query('insert into auth.users(id) values($1) on conflict do nothing',[stranger]);
 await admin.query('insert into bc_admin_v1.admin_users(id,enabled) values($1,false) on conflict do nothing',[stranger]);
 await assert.rejects(exec({identity:{userId:stranger,sessionId:psid,assuranceLevel:'aal2',mfaVerifiedAt:Math.floor(Date.now()/1000)},operation:'notificationList',args:[50,null]}),e=>e.code==='42501');

 // ---- cleanup: expired rows only, bounded, audited, never audit evidence ----
 const auditBefore=(await admin.query("select count(*)::int n from bc_admin_v1.admin_audit_logs")).rows[0].n;
 await admin.query("insert into bc_admin_v1.admin_login_flows(flow_hash,encrypted_data,expires_at) values(gen_random_bytes(32),gen_random_bytes(40),now()-interval '2 hours'),(gen_random_bytes(32),gen_random_bytes(40),now()+interval '1 hour')");
 await admin.query("insert into bc_admin_v1.admin_rate_limits(bucket,key_hash,started_at,attempts) values('admin-api',gen_random_bytes(32),now()-interval '2 days',3),('admin-api',gen_random_bytes(32),now(),2)");
 assert.equal((await admin.query("select count(*)::int n from bc_admin_v1.admin_login_flows")).rows[0].n>=2,true);
 const cleaned=await RG.runCleanup({execute:exec,identity:issuer,target:'admin_login_flows',limit:500});
 assert(cleaned.deleted>=1);
 assert.equal((await admin.query("select count(*)::int n from bc_admin_v1.admin_login_flows where expires_at>now()")).rows[0].n>=1,true);
 const rl=await RG.runCleanup({execute:exec,identity:issuer,target:'admin_rate_limits',limit:500});
 assert(rl.deleted>=1);
 assert.equal((await admin.query("select count(*)::int n from bc_admin_v1.admin_rate_limits where started_at>now()-interval '1 day'")).rows[0].n>=1,true);
 const auditAfter=(await admin.query("select count(*)::int n from bc_admin_v1.admin_audit_logs")).rows[0].n;
 assert(auditAfter>auditBefore,'cleanup must add audit rows, never remove them');
 // Cleanup never touches audit evidence: the gate attempts recorded earlier survive
// every delete. The exact count is asserted where the gate is exercised.
assert((await admin.query("select count(*)::int n from bc_admin_v1.admin_audit_logs where action='auth.enrolment_attempt'")).rows[0].n>=6);
 assert.equal((await admin.query("select count(*)::int n from bc_admin_v1.admin_cleanup_runs where finished_at is not null and deleted>0")).rows[0].n>=2,true);
 // Argument validation happens before any delete: a table other than the two
 // operational ones cannot even be named, and an oversized batch is refused.
 await assert.rejects(exec({identity:issuer,operation:'cleanupExpired',args:['admin_audit_logs',10,randomUUID()]}),e=>e.code==='22023');
 await assert.rejects(exec({identity:issuer,operation:'cleanupExpired',args:['admin_login_flows',100000,randomUUID()]}),e=>e.code==='22023');
 // Bounded batches: a batch of one deletes at most one row.
 await admin.query("insert into bc_admin_v1.admin_login_flows(flow_hash,encrypted_data,expires_at) select gen_random_bytes(32),gen_random_bytes(40),now()-interval '3 hours' from generate_series(1,5)");
 assert.equal((await RG.runCleanup({execute:exec,identity:issuer,target:'admin_login_flows',limit:1})).deleted,1);
 // Concurrent runs cannot both delete: the second records a skip instead.
 const [c1,c2]=await Promise.all([RG.runCleanup({execute:exec,identity:issuer,target:'admin_login_flows',limit:5}),RG.runCleanup({execute:exec,identity:issuer,target:'admin_login_flows',limit:5})]);
 assert.equal([c1.deleted,c2.deleted].filter(n=>n>0).length>=1,true);
 // Two transactions racing on one login may both obtain the lock sequentially
 // (the first commits before the second starts), so a skip is not guaranteed;
 // what is guaranteed is that no row is deleted twice and every run is recorded.
 const runs=await admin.query("select count(*)::int n, coalesce(sum(deleted),0)::int d from bc_admin_v1.admin_cleanup_runs");
 assert(runs.rows[0].n>=5);
 assert.equal(Number((await admin.query("select count(*)::int n from bc_admin_v1.admin_login_flows where expires_at<=now()")).rows[0].n),0);
 // Fails closed: wrong permission, a non-operational target, and a bad batch size.
 await admin.query("delete from bc_admin_v1.admin_user_roles where user_id=$1 and role_id in ('super_admin','admin')",[uid]);
 await admin.query("insert into bc_admin_v1.admin_user_roles(user_id,role_id) values($1,'editor') on conflict do nothing",[uid]);
 await assert.rejects(RG.runCleanup({execute:exec,identity:issuer,target:'admin_login_flows'}),e=>e.code==='42501');
 // Recovery denies a disabled or role-less account even with a valid grant shape.
 await admin.query("insert into bc_admin_v1.admin_user_roles(user_id,role_id) values($1,'super_admin') on conflict do nothing",[uid]);
 await admin.query("update bc_admin_v1.admin_users set enabled=false where id=$1",[target]);
 const dead=await RG.issueRecoveryGrant({execute:exec,identity:issuer,targetUserId:randomUUID()}).catch(e=>e);
 assert.equal(dead.code,'42501');
 console.log(`PASS PostgreSQL ${meta.rows[0].version}: fixture migrations, immutable concurrent bio edits, non-owner RBAC, session expiry, restrictive RLS, membership lock, concurrent limiter and atomic handoff and recovery revocation, 010 module reads/settings write and step-up freshness, 011 AAL1-only enrolment gate with audit, 012 Super-Admin-authorised single-use recovery (replay, supersession, five-attempt exhaustion, no session granted), the privileged audited factor reset that returns an account to first enrolment, and bounded locked cleanup that spares audit evidence. Provider Auth is mocked; no shared project used.`);
} finally {if(limited)await limited.end();await admin.end()}
