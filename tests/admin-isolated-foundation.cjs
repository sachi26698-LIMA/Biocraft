// Disposable local PGlite only. Does not connect to a Supabase project.
const {PGlite}=require('@electric-sql/pglite');
const fs=require('node:fs'); const assert=require('node:assert/strict');
const up=fs.readFileSync('admin-backend/migrations/001_admin_foundation.sql','utf8');
const down=fs.readFileSync('admin-backend/rollback/001_admin_foundation.sql','utf8');
const uid='11111111-1111-4111-8111-111111111111';
(async()=>{const db=new PGlite();try{
 await db.exec('create role anon; create role authenticated; create schema auth; create table auth.users(id uuid primary key);');
 await db.exec(up);
 const tables=await db.query("select c.relname,c.relrowsecurity from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='bc_admin_v1' and c.relkind='r' order by c.relname");
 assert.equal(tables.rows.length,15); assert(tables.rows.every(r=>r.relrowsecurity));
 const policies=await db.query("select count(*)::int n from pg_policies where schemaname='bc_admin_v1' and permissive='RESTRICTIVE'"); assert.equal(policies.rows[0].n,15);
 const acl=await db.query("select has_schema_privilege('anon','bc_admin_v1','USAGE') a,has_schema_privilege('authenticated','bc_admin_v1','USAGE') b"); assert.deepEqual(acl.rows[0],{a:false,b:false});
 // Per-schema default REVOKE does not remove global PUBLIC function EXECUTE.
 // An accidental schema USAGE grant would expose an unrevoked new function.
 await db.exec('create function bc_admin_v1.future_probe() returns integer language sql as $$select 1$$');
 assert.equal((await db.query("select has_function_privilege('anon','bc_admin_v1.future_probe()','EXECUTE') ok")).rows[0].ok,true);
 await db.exec('revoke all on function bc_admin_v1.future_probe() from public,anon,authenticated');
 assert.equal((await db.query("select has_function_privilege('anon','bc_admin_v1.future_probe()','EXECUTE') ok")).rows[0].ok,false);
 await db.exec('drop function bc_admin_v1.future_probe()');
 await db.exec(`insert into auth.users values ('${uid}'); insert into bc_admin_v1.admin_users(id) values ('${uid}');`);
 await assert.rejects(db.exec(`insert into bc_admin_v1.admin_roles values('bogus','bad')`));
 await assert.rejects(db.exec(`insert into bc_admin_v1.admin_sessions(id,user_id,created_at,expires_at) values ('${uid}','${uid}',now(),now())`));
 await db.exec(`insert into bc_admin_v1.admin_content_versions(resource_type,resource_key,version_number,payload,payload_sha256,created_by) values('bio','synthetic',1,'{}',decode(repeat('00',32),'hex'),'${uid}');`);
 await assert.rejects(db.exec("update bc_admin_v1.admin_content_versions set resource_key='changed'"));
 await assert.rejects(db.exec('truncate bc_admin_v1.admin_content_versions'));
 await assert.rejects(db.exec(down));
 // A failing explicit transaction requires rollback before continuing.
 await db.exec('rollback');
 const exists=await db.query("select to_regclass('bc_admin_v1.admin_users') is not null as present"); assert.equal(exists.rows[0].present,true);
 // Second disposable database checks clean uninstall and repeat install.
 const empty=new PGlite();try{await empty.exec('create role anon; create role authenticated; create schema auth; create table auth.users(id uuid primary key);');await empty.exec(up);await empty.exec(down);assert.equal((await empty.query("select to_regnamespace('bc_admin_v1') is null as removed")).rows[0].removed,true);await empty.exec(up);}finally{await empty.close()}
 console.log('PASS local isolated foundation: 15 tables, deny policies, constraints, append guards, nonempty rollback refusal and empty reinstall');
}finally{await db.close()}})().catch(e=>{console.error(e);process.exitCode=1});
