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
 create function auth.uid() returns uuid language sql stable as $$select nullif(auth.jwt()->>'sub','')::uuid$$;`);
 for(const f of ['001_admin_foundation.sql','002_workflow_integrity.sql','003_permission_catalog.sql','004_private_draft_commands.sql','005_session_commands.sql']) await db.exec(fs.readFileSync(`admin-backend/migrations/${f}`,'utf8'));
 await db.exec(`insert into auth.users values('${a}'),('${b}'),('${outsider}');insert into bc_admin_v1.admin_users(id,enabled) values('${a}',true),('${b}',true);
 insert into auth.sessions(id,user_id) values('${sa}','${a}'),('${sb}','${b}');
 insert into bc_admin_v1.admin_user_roles(user_id,role_id) values('${a}','editor'),('${b}','admin');`);
 // Fixture-only explicit grants model a limited executor. No live grants made.
 await db.exec(`create role fixture_executor; grant usage on schema bc_admin_v1 to fixture_executor;
 grant execute on function bc_admin_v1.require_actor(text),bc_admin_v1.open_admin_session(uuid),bc_admin_v1.revoke_admin_session(uuid),bc_admin_v1.create_bio_draft(text,jsonb,uuid),bc_admin_v1.submit_draft(uuid,bigint,uuid,uuid),bc_admin_v1.review_draft(uuid,bigint,boolean,uuid),bc_admin_v1.list_my_bio_drafts(integer,timestamptz,uuid) to fixture_executor;`);
 // PGlite stands in for a pool connection but not a real concurrent pg pool.
 const pool={connect:async()=>{await db.exec('set role fixture_executor');return {query:(text,params)=>db.query(text,params),release:async()=>{await db.exec('reset role')}}}};
 const execute=createDatabaseExecutor(pool);
 const token=(sub,sessionId,extra={})=>['eyJhbGciOiJub25lIn0',Buffer.from(JSON.stringify({iss:'https://jvpadtzfsuekixrquzjv.supabase.co/auth/v1',aud:'authenticated',role:'authenticated',aal:'aal2',is_anonymous:false,sub,session_id:sessionId,exp:Math.floor(Date.now()/1000)+300,...extra})).toString('base64url'),'signature'].join('.');
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
 let response=await call('/api/admin/v1/bio-drafts','POST',{key:'bio-one',bio});assert.equal(response.status,201);const {draft_id}=await response.json();
 response=await call('/api/admin/v1/bio-drafts');assert.equal(response.status,200);assert.equal((await response.json()).items.length,1);
 response=await call(`/api/admin/v1/bio-drafts/${draft_id}/submit`,'POST',{expectedVersion:2,reviewerId:b});assert.equal(response.status,409);
 response=await call(`/api/admin/v1/bio-drafts/${draft_id}/submit`,'POST',{expectedVersion:1,reviewerId:b});assert.equal(response.status,200);
 response=await call(`/api/admin/v1/bio-drafts/${draft_id}/review`,'POST',{expectedVersion:2,decision:'approve'});assert.equal(response.status,403);
 response=await call(`/api/admin/v1/bio-drafts/${draft_id}/review`,'POST',{expectedVersion:2,decision:'approve'},token(b,sb));assert.equal(response.status,200);
 assert.equal((await db.query('select count(*)::int n from bc_admin_v1.admin_audit_logs')).rows[0].n,5);
 assert.equal((await call('/api/admin/v1/session','DELETE')).status,200);
 assert.equal((await call('/api/admin/v1/bio-drafts')).status,403);
 assert.equal((await call('/api/admin/v1/session','POST')).status,403);
 const unsafe=createDatabaseExecutor({connect:async()=>({query:(text,params)=>db.query(text,params),release:()=>{}})});
 await assert.rejects(unsafe({identity:{userId:a,sessionId:sa,assuranceLevel:'aal2'},operation:'list',args:[10,null,null]}),/Unsafe database executor role/);
 assert.equal((await createAdminHandler({enabled:true,provider,execute,rateLimit:async()=>false,platformRules:rules})(new Request('https://admin.example/api/admin/v1/bio-drafts',{headers:{Authorization:`Bearer ${token(b,sb)}`}}))).status,429);
 assert.throws(()=>createPostgresPool({host:'other.example',user:'limited',password:'fixture'}));
 const realPool=createPostgresPool({host:'db.jvpadtzfsuekixrquzjv.supabase.co',user:'limited',password:'fixture'});await realPool.end(); // no connection opened
 console.log('PASS local API-to-PGlite create/list/submit/review, role/session denial, audit and validation; mocked provider and fixture-only limited-role grants');
} finally {await db.close()}
