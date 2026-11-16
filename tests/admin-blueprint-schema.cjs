// Offline fixture checks only; not a Supabase or security integration test.
const {PGlite}=require('@electric-sql/pglite');
const assert=require('node:assert/strict'); const fs=require('node:fs'); const path=require('node:path');
(async()=>{const db=new PGlite();try{
 await db.exec(`create role anon; create role authenticated; create schema auth;
 create table auth.users(id uuid primary key);
 create table public.bios(id uuid primary key,is_active boolean);
 alter table public.bios enable row level security; grant select on public.bios to anon,authenticated;
 create policy active_only on public.bios for select to anon,authenticated using(is_active);
 insert into public.bios values ('20000000-0000-0000-0000-000000000001',true),('20000000-0000-0000-0000-000000000002',false);
 insert into auth.users values('10000000-0000-0000-0000-000000000001');`);
 const migration=fs.readFileSync(path.join(__dirname,'../docs/master-admin-blueprint/001-private-foundation.REVIEW.sql'),'utf8');await db.exec(migration);
 const tables=['members','safety_controls','documents','revisions','publication_history','audit_events','metric_rollups'];
 let policies=await db.query("select tablename,cmd,permissive from pg_policies where schemaname='bc_admin' order by tablename");
 assert.equal(policies.rows.length,7);assert.ok(policies.rows.every(p=>p.cmd==='ALL' && p.permissive==='RESTRICTIVE'));
 for(const role of ['anon','authenticated']){await db.exec(`set role ${role}`);assert.equal((await db.query('select count(*)::int n from public.bios')).rows[0].n,1);
 for(const table of tables) await assert.rejects(db.query(`select * from bc_admin.${table}`),e=>e.code==='42501');
 await assert.rejects(db.query('insert into public.bios values (gen_random_uuid(),true)'),e=>e.code==='42501');await db.exec('reset role');}
 assert.equal((await db.query('select publish_enabled,telemetry_enabled from bc_admin.safety_controls')).rows[0].publish_enabled,false);
 await assert.rejects(db.query("insert into bc_admin.members(user_id,role) values ('10000000-0000-0000-0000-000000000001','owner')"),e=>e.code==='23514');
 await assert.rejects(db.query("insert into bc_admin.metric_rollups values(now(),'day','visits','',-1,1)"),e=>e.code==='23514');
 await db.query("insert into bc_admin.audit_events(action,request_id) values('test','30000000-0000-0000-0000-000000000001')");
 await assert.rejects(db.query('delete from bc_admin.audit_events'));await assert.rejects(db.query('truncate bc_admin.audit_events'));
 const rollback=fs.readFileSync(path.join(__dirname,'../docs/master-admin-blueprint/099-schema-removal.REVIEW.sql'),'utf8');await db.exec(rollback);
 assert.equal((await db.query("select count(*)::int n from pg_namespace where nspname='bc_admin'")).rows[0].n,0);
 assert.equal((await db.query('select count(*)::int n from public.bios')).rows[0].n,2);
 console.log('PASS blueprint schema: local RLS/grants, constraints, default switches, append guard, destructive rollback fixture');
 }finally{await db.close()}})().catch(e=>{console.error(e);process.exitCode=1});
