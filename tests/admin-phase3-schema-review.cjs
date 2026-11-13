// Offline disposable PGlite only. Not a real JWT, Supabase or security test.
const {PGlite}=require('@electric-sql/pglite'),assert=require('node:assert/strict'),fs=require('node:fs');
(async()=>{const db=new PGlite();try{
 await db.exec(`create role anon;create role authenticated;create schema auth;create table auth.users(id uuid primary key);
 create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
 create function auth.jwt() returns jsonb language sql stable as $$ select jsonb_build_object('aal',current_setting('request.jwt.claim.aal',true)) $$;
 create table public.bios(id uuid primary key,is_active boolean not null);create table public.platforms(id uuid primary key);create table public.categories(id uuid primary key);
 alter table public.bios enable row level security;grant select on public.bios to anon,authenticated;create policy active_only on public.bios for select to anon,authenticated using(is_active);
 insert into public.bios values('20000000-0000-0000-0000-000000000001',true),('20000000-0000-0000-0000-000000000002',false);
 insert into auth.users values('10000000-0000-0000-0000-000000000001');`);
 await db.exec(fs.readFileSync('docs/admin-backend-phase3/000-preflight.READONLY.sql','utf8'));
 for(const file of ['docs/master-admin-blueprint/001-private-foundation.REVIEW.sql','docs/master-admin-blueprint/002-authorization.REVIEW.sql','docs/admin-backend-phase3/003-operational-model.REVIEW.sql','docs/admin-backend-phase3/004-revision-guard.REVIEW.sql'])await db.exec(fs.readFileSync(file,'utf8'));
 const tables=['admin_sessions','setting_revision_fields','bio_revision_fields','revision_dependencies','idempotency_requests','jobs','job_items','metric_definitions','audit_delivery'];
 let policies=await db.query("select tablename,cmd,permissive from pg_policies where schemaname='bc_admin'");assert.equal(policies.rows.length,16);assert.ok(policies.rows.every(x=>x.cmd==='ALL'&&x.permissive==='RESTRICTIVE'));
 for(const role of ['anon','authenticated']){await db.exec(`set role ${role}`);assert.equal((await db.query('select count(*)::int n from public.bios')).rows[0].n,1);for(const table of tables)await assert.rejects(db.query(`select * from bc_admin.${table}`),e=>e.code==='42501');await db.exec('reset role');}
 // Even accidental table grant + permissive SELECT policy remains constrained
 // by restrictive deny. This simulation is not the shipped SQL.
 await db.exec('grant usage on schema bc_admin to authenticated;grant select on bc_admin.metric_definitions to authenticated;create policy simulation_allow on bc_admin.metric_definitions for select to authenticated using (true);');
 await db.exec("insert into bc_admin.metric_definitions values('visits','count','test',10,30,false); set role authenticated;");assert.equal((await db.query('select count(*)::int n from bc_admin.metric_definitions')).rows[0].n,0);await db.exec('reset role');
 await assert.rejects(db.query("insert into bc_admin.metric_definitions values('invalid','count','test',0,30,false)"),e=>e.code==='23514');
 await assert.rejects(db.query("insert into bc_admin.idempotency_requests(actor_id,operation,idempotency_key,request_hash,state,expires_at) values('10000000-0000-0000-0000-000000000001','bios.draft','30000000-0000-0000-0000-000000000001',decode(repeat('00',32),'hex'),'completed',now()+interval '1 day')"),e=>e.code==='23514');
 await db.query("insert into bc_admin.jobs(kind,requested_by,request_id) values('bulk_draft','10000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000002')");
 await assert.rejects(db.query("update bc_admin.jobs set state='succeeded'"),e=>e.code==='23514');
 await db.exec(`insert into auth.users values('10000000-0000-0000-0000-000000000002');
 insert into bc_admin.documents(id,kind,external_key) values('40000000-0000-0000-0000-000000000001','bio','test');
 insert into bc_admin.revisions(id,document_id,revision_number,author_id,payload,payload_sha256)
 values('50000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000001',1,'10000000-0000-0000-0000-000000000001','{}',decode(repeat('00',32),'hex'));`);
 await assert.rejects(db.query("update bc_admin.revisions set state='approved',reviewer_id='10000000-0000-0000-0000-000000000002',reviewed_at=now()"),e=>e.code==='23514');
 await db.query("insert into bc_admin.bio_revision_fields(revision_id,content,language) values('50000000-0000-0000-0000-000000000001','example','en')");
 await db.query("update bc_admin.revisions set state='submitted'");
 await assert.rejects(db.query("update bc_admin.bio_revision_fields set content='tampered'"),e=>e.code==='23514');
 await assert.rejects(db.query("update bc_admin.revisions set payload='{\"changed\":true}'"),e=>e.code==='23514');
 await assert.rejects(db.query("update bc_admin.revisions set state='approved',reviewer_id=author_id,reviewed_at=now()"),e=>e.code==='23514');
 await db.query("update bc_admin.revisions set state='approved',reviewer_id='10000000-0000-0000-0000-000000000002',reviewed_at=now()");
 await db.query("update bc_admin.revisions set state='published'");
 await assert.rejects(db.query('delete from bc_admin.revisions'),e=>e.code==='23514');
 const allowed={super_admin:['members.manage','content.publish','audit.read'],admin:['content.publish','content.review.approve'],editor:['content.draft','content.read'],moderator:['content.review.reject','users.moderate'],analyst:['analytics.read','analytics.export']};
 for(const [role,permissions] of Object.entries(allowed))for(const permission of permissions)assert.equal((await db.query('select bc_admin.role_allows($1,$2) ok',[role,permission])).rows[0].ok,true);
 for(const [role,permission] of [['admin','members.manage'],['editor','content.publish'],['moderator','content.review.approve'],['analyst','users.read'],['super_admin','unknown']])assert.equal((await db.query('select bc_admin.role_allows($1,$2) ok',[role,permission])).rows[0].ok,false);
 await db.exec(fs.readFileSync('docs/admin-backend-phase3/098-disable-operational.REVIEW.sql','utf8'));
 assert.equal((await db.query('select publish_enabled or telemetry_enabled as enabled from bc_admin.safety_controls')).rows[0].enabled,false);
 console.log('PASS local-only operational DDL: default deny, guest fixture, constraints, revision transitions, sample role matrix and disabled switches');
 }finally{await db.close()}})().catch(e=>{console.error(e);process.exitCode=1});
