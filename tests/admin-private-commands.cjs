// Synthetic PGlite only: mocked JWT claims can be forged; this tests SQL
// permission/transaction logic, NOT real authentication or production safety.
const {PGlite}=require('@electric-sql/pglite');const fs=require('node:fs');const assert=require('node:assert/strict');
const a='11111111-1111-4111-8111-111111111111',b='22222222-2222-4222-8222-222222222222',sa='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',sb='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',req='cccccccc-cccc-4ccc-8ccc-cccccccccccc';
(async()=>{const db=new PGlite();try{
 await db.exec(`create role anon;create role authenticated;create schema auth;create table auth.users(id uuid primary key);create table auth.sessions(id uuid primary key,user_id uuid not null references auth.users(id));
 create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('test.uid',true),'')::uuid$$;
 create function auth.jwt() returns jsonb language sql stable as $$select coalesce(nullif(current_setting('test.jwt',true),''),'{}')::jsonb$$;`);
 for(const f of ['001_admin_foundation.sql','002_workflow_integrity.sql','003_permission_catalog.sql','004_private_draft_commands.sql']) await db.exec(fs.readFileSync('admin-backend/migrations/'+f,'utf8'));
 await db.exec(`insert into auth.users values('${a}'),('${b}'); insert into bc_admin_v1.admin_users(id,enabled) values('${a}',true),('${b}',true);
 insert into auth.sessions(id,user_id) values('${sa}','${a}'),('${sb}','${b}');
 insert into bc_admin_v1.admin_sessions(id,user_id,expires_at) values('${sa}','${a}',now()+interval '1 hour'),('${sb}','${b}',now()+interval '1 hour');
 insert into bc_admin_v1.admin_user_roles(user_id,role_id) values('${a}','editor'),('${b}','admin');`);
 const set=async(u,s,aal='aal2')=>db.exec(`select set_config('test.uid','${u}',false),set_config('test.jwt','{"session_id":"${s}","aal":"${aal}"}',false)`);
 const payload=JSON.stringify({content:'Hello',language:'en',platform:'instagram',active:true,featured:false});
 await set(a,sa,'aal1'); await assert.rejects(db.query('select bc_admin_v1.create_bio_draft($1,$2::jsonb,$3::uuid)', ['bio1',payload,req]));
 await set(a,sa);await assert.rejects(db.query('select bc_admin_v1.create_bio_draft($1,$2::jsonb,$3::uuid)', ['bad key',payload,req]));
 await assert.rejects(db.query('select bc_admin_v1.create_bio_draft($1,$2::jsonb,$3::uuid)', ['bio1',JSON.stringify({content:'x',language:'en',platform:'instagram',active:true,featured:false,other:1}),req]));
 // Simulated audit failure must roll back both the content version and draft.
 await db.exec(`create function bc_admin_v1.test_audit_failure() returns trigger language plpgsql as $$begin raise exception 'test audit failure';end$$; create trigger test_audit_failure before insert on bc_admin_v1.admin_audit_logs for each row execute function bc_admin_v1.test_audit_failure()`);
 await assert.rejects(db.query('select bc_admin_v1.create_bio_draft($1,$2::jsonb,$3::uuid)', ['audit-failure',payload,req]));
 assert.equal((await db.query("select count(*)::int n from bc_admin_v1.admin_content_versions where resource_key='audit-failure'")).rows[0].n,0);
 await db.exec('drop trigger test_audit_failure on bc_admin_v1.admin_audit_logs; drop function bc_admin_v1.test_audit_failure()');
 let row=await db.query('select bc_admin_v1.create_bio_draft($1,$2::jsonb,$3::uuid) id',['bio1',payload,req]);const id=row.rows[0].id;
 assert.equal((await db.query('select * from bc_admin_v1.list_my_bio_drafts(10,null,null)')).rows.length,1);
 await assert.rejects(db.query('select * from bc_admin_v1.list_my_bio_drafts(101,null,null)'));
 await assert.rejects(db.query('select bc_admin_v1.submit_draft($1, $2, $3, $4)',[id,2,b,req]));
 await db.query('select bc_admin_v1.submit_draft($1, $2, $3, $4)',[id,1,b,req]);
 await assert.rejects(db.query('select bc_admin_v1.review_draft($1,$2,$3,$4)',[id,2,true,req]));
 await set(b,sb);assert.equal((await db.query('select * from bc_admin_v1.list_my_bio_drafts(10,null,null)')).rows.length,0);
 await db.query('select bc_admin_v1.review_draft($1,$2,$3,$4)',[id,2,true,req]);
 let r=await db.query('select state,row_version from bc_admin_v1.admin_drafts where id=$1',[id]);assert.equal(r.rows[0].state,'approved');assert.equal(Number(r.rows[0].row_version),3);
 assert.equal((await db.query('select count(*)::int n from bc_admin_v1.admin_audit_logs')).rows[0].n,3);
 await db.exec(`update bc_admin_v1.admin_sessions set revoked_at=now() where id='${sb}'`);
 await assert.rejects(db.query('select bc_admin_v1.create_bio_draft($1,$2::jsonb,$3::uuid)', ['bio2',payload,req]));
 assert.equal((await db.query("select has_function_privilege('authenticated','bc_admin_v1.create_bio_draft(text,jsonb,uuid)','EXECUTE') ok")).rows[0].ok,false);
 await db.exec(fs.readFileSync('admin-backend/rollback/004_private_draft_commands.sql','utf8'));
 console.log('PASS mocked SQL private draft commands: AAL, membership, session, permissions, validation, review, atomic success audit, revoke and direct execute denial');
}finally{await db.close()}})().catch(e=>{console.error(e);process.exitCode=1});
