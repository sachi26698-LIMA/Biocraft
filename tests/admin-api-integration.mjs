// Integration on disposable PGlite. Auth verification is explicitly mocked;
// the fixture DB role owns the schema. This is not a real Supabase/RLS test.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import {createAdminHandler} from '../admin-backend/server/api.mjs';
import {createDatabaseExecutor,createPostgresPool} from '../admin-backend/server/database.mjs';
const {PGlite}=createRequire(import.meta.url)('@electric-sql/pglite');
const a='11111111-1111-4111-8111-111111111111',b='22222222-2222-4222-8222-222222222222',outsider='33333333-3333-4333-8333-333333333333',sa='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',sb='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const db=new PGlite();
try {
 await db.exec(`create role anon;create role authenticated;create schema auth;create table auth.users(id uuid primary key);create table auth.sessions(id uuid primary key,user_id uuid not null references auth.users(id));
 create function auth.jwt() returns jsonb language sql stable as $$select coalesce(nullif(current_setting('request.jwt.claims',true),''),'{}')::jsonb$$;
 create function auth.uid() returns uuid language sql stable as $$select nullif(auth.jwt()->>'sub','')::uuid$$;
 -- Minimal synthetic public tables mirroring the real columns read by 010.
 create table public.platforms(id uuid primary key default gen_random_uuid(),name text not null,slug text not null unique,description text,is_active boolean not null default true,sort_order integer not null default 0);
 create table public.categories(id uuid primary key default gen_random_uuid(),name text not null,slug text not null unique,description text,platform_id uuid,is_active boolean not null default true,sort_order integer not null default 0);
 create table public.bios(id uuid primary key default gen_random_uuid(),content text not null,language text not null default 'en',is_active boolean not null default true,source_slug text,platform_id uuid,category_id uuid);
 create table public.generators(id uuid primary key default gen_random_uuid(),name text not null,slug text not null unique,generator_type text not null,character_limit integer,is_active boolean not null default true,platform_id uuid);
 create table public.seo_pages(id uuid primary key default gen_random_uuid(),page_slug text not null unique,title text not null,meta_description text,robots text not null default 'index,follow',is_active boolean not null default true,updated_at timestamptz not null default now());
 -- gen_random_uuid() is built into PostgreSQL 13+; PGlite provides it too.`);
 for(const f of ['001_admin_foundation.sql','002_workflow_integrity.sql','003_permission_catalog.sql','004_private_draft_commands.sql','005_session_commands.sql','006_auth_controls.sql','008_bio_edit.sql','010_admin_module_commands.sql','012_recovery_and_cleanup.sql']) await db.exec(fs.readFileSync(`admin-backend/migrations/${f}`,'utf8'));
 await db.exec(`insert into auth.users values('${a}'),('${b}'),('${outsider}');insert into bc_admin_v1.admin_users(id,enabled) values('${a}',true),('${b}',true);
 insert into auth.sessions(id,user_id) values('${sa}','${a}'),('${sb}','${b}');
 insert into bc_admin_v1.admin_user_roles(user_id,role_id) values('${a}','editor'),('${b}','admin');`);
 // Fixture-only explicit grants model a limited executor. No live grants made.
 await db.exec(`create role fixture_executor; grant usage on schema bc_admin_v1 to fixture_executor;
 grant execute on function bc_admin_v1.require_actor(text),bc_admin_v1.open_admin_session(uuid),bc_admin_v1.revoke_admin_session(uuid),bc_admin_v1.create_bio_draft(text,jsonb,uuid),bc_admin_v1.submit_draft(uuid,bigint,uuid,uuid),bc_admin_v1.review_draft(uuid,bigint,boolean,uuid),bc_admin_v1.list_my_bio_drafts(integer,timestamptz,uuid),bc_admin_v1.update_bio_draft(uuid,bigint,jsonb,uuid),bc_admin_v1.get_bio_draft(uuid),bc_admin_v1.list_bio_review_queue(integer,timestamptz,uuid),
 bc_admin_v1.list_platforms(integer,uuid),bc_admin_v1.list_categories(integer,uuid),bc_admin_v1.list_collections(integer,text),
 bc_admin_v1.list_generators(integer,uuid),bc_admin_v1.list_seo_pages(integer,uuid),bc_admin_v1.analytics_overview(),
 bc_admin_v1.list_settings(integer,text),bc_admin_v1.update_setting(text,jsonb,bigint,uuid),bc_admin_v1.list_role_catalog(),
 bc_admin_v1.list_my_sessions(integer,timestamptz),bc_admin_v1.list_audit_logs(integer,bigint),bc_admin_v1.issue_recovery_grant(uuid,bytea,bytea,interval,uuid),bc_admin_v1.revoke_recovery_grant(uuid,uuid),bc_admin_v1.reset_factor_enrolment(uuid,uuid),bc_admin_v1.cleanup_expired(text,integer,uuid) to fixture_executor;`);
 // PGlite has one login: session_user comparison is simulated here; real
 // session-user and role privilege checks run in admin-postgres-integration.
 const pool={connect:async()=>{await db.exec('set role fixture_executor');return {query:(text,params)=>db.query(text.replace('session_user=current_user','true'),params),release:async()=>{await db.exec('reset role')}}}};
 const execute=createDatabaseExecutor(pool);
 const token=(sub,sessionId,extra={})=>['eyJhbGciOiJub25lIn0',Buffer.from(JSON.stringify({iss:'https://jvpadtzfsuekixrquzjv.supabase.co/auth/v1',aud:'authenticated',role:'authenticated',aal:'aal2',is_anonymous:false,sub,session_id:sessionId,exp:Math.floor(Date.now()/1000)+300,amr:[{method:'totp',timestamp:Math.floor(Date.now()/1000)}],...extra})).toString('base64url'),'signature'].join('.');
 const provider={auth:{getUser:async(t)=>t==='invalid.signature.value'?{error:{},data:{user:null}}:{data:{user:{id:JSON.parse(Buffer.from(t.split('.')[1],'base64url')).sub,is_anonymous:false}}}}};
 const rules={instagram:{count:'unicode_code_points',max:150}};
 const handler=createAdminHandler({enabled:true,provider,execute,rateLimit:async()=>true,platformRules:rules});
 const call=(path,method='GET',body,tk=token(a,sa))=>handler(new Request(`https://admin.example${path}`,{method,headers:{Authorization:`Bearer ${tk}`,...(body!==undefined?{'Content-Type':'application/json'}:{})},...(body!==undefined?{body:JSON.stringify(body)}:{})}));
 assert.equal((await createAdminHandler()(new Request('https://admin.example/api/admin/v1/bio-drafts'))).status,503);
 assert.equal((await call('/api/admin/v1/bio-drafts','GET',undefined,token(a,sa,{aal:'aal1'}))).status,401);
 assert.equal((await call('/api/admin/v1/session','POST',undefined,token(outsider,sa))).status,403);
 assert.equal((await call('/api/admin/v1/session','POST')).status,200);
 assert.equal((await call('/api/admin/v1/session','POST',undefined,token(b,sb))).status,200);
 assert.equal((await call('/api/admin/v1/bio-drafts?limit=101')).status,422);
 const bio={content:'Hello',language:'en',platform:'instagram',active:true,featured:false};
 assert.equal((await call('/api/admin/v1/bio-drafts','POST',{key:'x',bio:{...bio,language:'bad'}})).status,422);
 assert.equal((await call('/api/admin/v1/bio-drafts','POST',{key:'bio-one',bio},token(a,sa,{amr:undefined}))).status,403);
 assert.equal((await (await call('/api/admin/v1/bio-drafts','POST',{key:'bio-one',bio},token(a,sa,{amr:undefined}))).json()).error.code,'STEP_UP_REQUIRED');
 assert.equal((await call('/api/admin/v1/bio-drafts','POST',{key:'bio-one',bio},token(a,sa,{amr:[{method:'totp',timestamp:Math.floor(Date.now()/1000)-3600}]}))).status,403);
 assert.equal((await call('/api/admin/v1/bio-drafts','POST',{key:'bio-one',bio},token(a,sa,{amr:[{method:'password',timestamp:Math.floor(Date.now()/1000)}]}))).status,403);
 let response=await call('/api/admin/v1/bio-drafts','POST',{key:'bio-one',bio});assert.equal(response.status,201);const {draft_id}=await response.json();
 response=await call('/api/admin/v1/bio-drafts');assert.equal(response.status,200);assert.equal((await response.json()).items.length,1);
 assert.equal((await call(`/api/admin/v1/bio-drafts/${draft_id}`,'GET',undefined,token(b,sb))).status,404);
 response=await call(`/api/admin/v1/bio-drafts/${draft_id}`,'PUT',{expectedVersion:1,bio:{...bio,content:'Edited'}});assert.equal(response.status,200);
 assert.equal((await (await call(`/api/admin/v1/bio-drafts/${draft_id}`)).json()).item.payload.content,'Edited');
 assert.equal((await call(`/api/admin/v1/bio-drafts/${draft_id}`,'PUT',{expectedVersion:1,bio})).status,409);
 response=await call(`/api/admin/v1/bio-drafts/${draft_id}/submit`,'POST',{expectedVersion:1,reviewerId:b});assert.equal(response.status,409);
 response=await call(`/api/admin/v1/bio-drafts/${draft_id}/submit`,'POST',{expectedVersion:2,reviewerId:b});assert.equal(response.status,200);
 assert.equal((await (await call('/api/admin/v1/bio-review-queue','GET',undefined,token(b,sb))).json()).items.length,1);
 assert.equal((await call(`/api/admin/v1/bio-drafts/${draft_id}`,'GET',undefined,token(b,sb))).status,200);
 response=await call(`/api/admin/v1/bio-drafts/${draft_id}/review`,'POST',{expectedVersion:3,decision:'approve'});assert.equal(response.status,403);
 response=await call(`/api/admin/v1/bio-drafts/${draft_id}/review`,'POST',{expectedVersion:3,decision:'approve'},token(b,sb));assert.equal(response.status,200);
 assert.equal((await db.query('select count(*)::int n from bc_admin_v1.admin_audit_logs')).rows[0].n,6);
 assert.equal((await call('/api/admin/v1/session','DELETE')).status,200);
 assert.equal((await call('/api/admin/v1/bio-drafts')).status,403);
 assert.equal((await call('/api/admin/v1/session','POST')).status,403);
 // 010 module HTTP surface: authorization, paging validation and shapes.
 const moduleGet=(path,tk=token(b,sb))=>call(path,'GET',undefined,tk);
 for(const path of ['/api/admin/v1/platforms?limit=1000','/api/admin/v1/platforms?after=not-a-uuid']) {
  const r=await moduleGet(path);assert.equal(r.status,422);assert.equal((await r.json()).error.code,'INVALID');
 }
 const unknown=await moduleGet('/api/admin/v1/platforms?unknown=1');assert.equal(unknown.status,400);assert.equal((await unknown.json()).error.code,'INVALID');
 assert.equal((await moduleGet('/api/admin/v1/platforms?limit=1&limit=2')).status,400);
 const an=await moduleGet('/api/admin/v1/analytics');assert.equal(an.status,200,JSON.stringify(await an.clone().json()));
 assert(Array.isArray((await (await moduleGet('/api/admin/v1/analytics')).json()).metrics));
 assert.equal((await moduleGet('/api/admin/v1/roles')).status,200);
 assert.equal((await moduleGet('/api/admin/v1/collections')).status,200);
 assert.equal((await moduleGet('/api/admin/v1/generators')).status,200);
 assert.equal((await moduleGet('/api/admin/v1/seo-pages')).status,200);
 // 'admin' has settings.read but not audit.read in the synthetic catalog.
 assert.equal((await moduleGet('/api/admin/v1/settings')).status,200);
 assert.equal((await moduleGet('/api/admin/v1/audit-logs')).status,403);
 await db.exec("insert into bc_admin_v1.admin_user_roles(user_id,role_id) values('"+b+"','auditor')");
 const auditPage=await moduleGet('/api/admin/v1/audit-logs');assert.equal(auditPage.status,200);assert(Array.isArray((await auditPage.json()).items));
 // Editor 'a' lacks settings.manage.
 assert.equal((await call('/api/admin/v1/settings','PUT',{key:'site.title',value:{a:1},expectedVersion:1},token(a,sa))).status,403);
 // 012 HTTP surface: recovery authorisation and bounded cleanup. A super_admin
 // membership is granted through the fixture only; no bootstrap endpoint exists.
 await db.exec("insert into bc_admin_v1.admin_user_roles(user_id,role_id) values('"+b+"','super_admin') on conflict do nothing");
 const RG=await import('../admin-backend/server/recovery-grant.mjs');
 const recoverHandler=createAdminHandler({enabled:true,provider,execute,rateLimit:async()=>true,platformRules:rules,
  recovery:{issue:x=>RG.issueRecoveryGrant({execute,...x}),revoke:x=>RG.revokeRecoveryGrant({execute,...x}),reset:x=>RG.resetFactorEnrolment({execute,...x}),cleanup:x=>RG.runCleanup({execute,...x})}});
 // B's Admin session was revoked by the earlier DELETE, and 005's insert uses
 // ON CONFLICT DO NOTHING, so the revoked row must be removed before reopening.
 await db.exec("delete from bc_admin_v1.admin_sessions where id='"+sb+"'");
 const recCall=(path,method,body,tk=token(b,sb))=>recoverHandler(new Request(`https://admin.example${path}`,{method,headers:{Authorization:`Bearer ${tk}`,'Content-Type':'application/json'},...(body!==undefined?{body:JSON.stringify(body)}:{})}));
 assert.equal((await call('/api/admin/v1/session','POST',undefined,token(b,sb))).status,200);
 const issued=await recCall('/api/admin/v1/staff/recovery','POST',{userId:a});
 assert.equal(issued.status,201);
 assert.match(issued.headers.get('cache-control'),/no-store/);
 const grantedCode=(await issued.json()).code;
 assert(RG.isWellFormedRecoveryCode(grantedCode));
 // The editor cannot authorise anyone, and nobody can authorise themselves.
 assert.equal((await recCall('/api/admin/v1/staff/recovery','POST',{userId:b},token(a,sa))).status,403);
 assert.equal((await recCall('/api/admin/v1/staff/recovery','POST',{userId:b})).status,403);
 assert.equal((await recCall('/api/admin/v1/staff/recovery','POST',{userId:b,ttlSeconds:30})).status,422);
 assert.equal((await recCall('/api/admin/v1/staff/recovery/revoke','POST',{grantId:'nope'})).status,422);
 // Completing a recovery: validated input, Super Admin only, no self-reset, and
 // the editor is refused by the database's own staff.manage check.
 assert.equal((await recCall('/api/admin/v1/staff/recovery/reset','POST',{userId:'nope'})).status,422);
 assert.equal((await recCall('/api/admin/v1/staff/recovery/reset','POST',{userId:b},token(a,sa))).status,403);
 assert.equal((await recCall('/api/admin/v1/staff/recovery/reset','POST',{userId:b})).status,403);
 const reset=await recCall('/api/admin/v1/staff/recovery/reset','POST',{userId:a});
 assert.equal(reset.status,200);
 const resetBody=await reset.json();assert.equal(typeof resetBody.reset,'boolean');
 assert.equal((await recCall('/api/admin/v1/ops/cleanup','POST',{target:'admin_audit_logs'})).status,422);
 // Argument checks reach the database: an unknown target and an oversized batch.
 assert.equal((await recCall('/api/admin/v1/ops/cleanup','POST',{target:'admin_login_flows',limit:5000})).status,422);
 const clean=await recCall('/api/admin/v1/ops/cleanup','POST',{target:'admin_login_flows',limit:10});
 assert.equal(clean.status,200);assert.equal(typeof (await clean.json()).deleted,'number');
 // The audit trail records the issuance with the actor and the target.
 const recRows=await db.query("select action,target_id from bc_admin_v1.admin_audit_logs where action like 'auth.recovery.%' or action='ops.cleanup'");
 assert(recRows.rows.some(r=>r.action==='auth.recovery.issued'&&r.target_id===a));
 assert(recRows.rows.some(r=>r.action==='ops.cleanup'));
 assert(recRows.rows.some(r=>r.action==='auth.recovery.factor_reset'));
 // The code itself is never persisted: only a 32-byte digest and an 8-byte salt.
 const stored=await db.query('select octet_length(code_hash) h, octet_length(salt) s from bc_admin_v1.admin_recovery_grants');
 assert.deepEqual(stored.rows.map(r=>({h:Number(r.h),s:Number(r.s)})),[{h:32,s:8}]);
 const unsafe=createDatabaseExecutor({connect:async()=>({query:(text,params)=>db.query(text,params),release:()=>{}})});
 await assert.rejects(unsafe({identity:{userId:a,sessionId:sa,assuranceLevel:'aal2'},operation:'list',args:[10,null,null]}),/Unsafe database executor role/);
 assert.equal((await createAdminHandler({enabled:true,provider,execute,rateLimit:async()=>false,platformRules:rules})(new Request('https://admin.example/api/admin/v1/bio-drafts',{headers:{Authorization:`Bearer ${token(b,sb)}`}}))).status,429);
 assert.throws(()=>createPostgresPool({host:'other.example',user:'limited',password:'fixture'}));
 const realPool=createPostgresPool({host:'db.jvpadtzfsuekixrquzjv.supabase.co',user:'limited',password:'fixture'});await realPool.end(); // no connection opened
 console.log('PASS local API-to-PGlite draft workflow plus 010 module reads, settings/audit authorization, paging validation, step-up denial, 012 recovery authorisation, factor reset and bounded cleanup routes; mocked provider and fixture-only limited-role grants');
} finally {await db.close()}
