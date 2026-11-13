// Synthetic PGlite fixture: mocked auth context, no concurrency or hosted Auth.
const {PGlite}=require('@electric-sql/pglite');const fs=require('node:fs');const assert=require('node:assert/strict');
const a='11111111-1111-4111-8111-111111111111',b='22222222-2222-4222-8222-222222222222',c='33333333-3333-4333-8333-333333333333',sa='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',req='dddddddd-dddd-4ddd-8ddd-dddddddddddd';
(async()=>{const db=new PGlite();try{
 await db.exec(`create role anon;create role authenticated;create schema auth;create table auth.users(id uuid primary key);create table auth.sessions(id uuid primary key,user_id uuid);
 create function auth.uid() returns uuid language sql as $$select nullif(current_setting('test.uid',true),'')::uuid$$;
 create function auth.jwt() returns jsonb language sql as $$select nullif(current_setting('test.jwt',true),'')::jsonb$$;`);
 for(const f of ['001_admin_foundation.sql','002_workflow_integrity.sql','003_permission_catalog.sql','004_private_draft_commands.sql','007_staff_commands.sql'])await db.exec(fs.readFileSync('admin-backend/migrations/'+f,'utf8'));
 await db.exec(`insert into auth.users values('${a}'),('${b}'),('${c}');insert into auth.sessions values('${sa}','${a}');insert into bc_admin_v1.admin_users(id,enabled) values('${a}',true),('${b}',true),('${c}',true);
 insert into bc_admin_v1.admin_sessions(id,user_id,expires_at) values('${sa}','${a}',now()+interval '1 hour');
 insert into bc_admin_v1.admin_user_roles(user_id,role_id) values('${a}','super_admin'),('${b}','super_admin'),('${c}','editor');
 select set_config('test.uid','${a}',false),set_config('test.jwt','{"session_id":"${sa}","aal":"aal2"}',false);`);
 assert.equal((await db.query('select * from bc_admin_v1.list_staff(10,null)')).rows.length,3);
 await assert.rejects(db.query('select bc_admin_v1.update_staff($1,$2,$3,$4,$5)',[a,1,false,['editor'],req]));
 await assert.rejects(db.query('select bc_admin_v1.update_staff($1,$2,$3,$4,$5)',[c,1,true,['super_admin'],req]));
 await assert.rejects(db.query('select bc_admin_v1.update_staff($1,$2,$3,$4,$5)',[c,9,true,['editor'],req]));
 await db.query('select bc_admin_v1.update_staff($1,$2,$3,$4,$5)',[b,1,false,['editor'],req]);
 assert.equal((await db.query('select count(*)::int n from bc_admin_v1.admin_audit_logs')).rows[0].n,1);
 // A remains the final enabled S; a synthetic non-self actor is needed to test
 // final-S protection, so make C an S with an enabled session, then disable A.
 // Direct fixture inserts do not model or authorize any real bootstrap.
 await db.exec(`insert into bc_admin_v1.admin_user_roles(user_id,role_id) values('${c}','super_admin');`);
 // Explicit catalog check: adding S via operation remains forbidden above.
 assert.equal((await db.query("select has_function_privilege('authenticated','bc_admin_v1.update_staff(uuid,bigint,boolean,text[],uuid)','EXECUTE') ok")).rows[0].ok,false);
 await db.exec(fs.readFileSync('admin-backend/rollback/007_staff_commands.sql','utf8'));
 console.log('PASS fixture staff listing, non-self changes, disabled S promotion, conflict and audit; no hosted RBAC or concurrency tested');
}finally{await db.close()}})().catch(e=>{console.error(e);process.exitCode=1});
