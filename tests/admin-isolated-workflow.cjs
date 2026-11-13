// Integrity tests only; SQL identity/authorization is not implemented.
const {PGlite}=require('@electric-sql/pglite');const fs=require('node:fs');const assert=require('node:assert/strict');
const a='11111111-1111-4111-8111-111111111111',b='22222222-2222-4222-8222-222222222222',d='33333333-3333-4333-8333-333333333333',v='44444444-4444-4444-8444-444444444444';
(async()=>{const db=new PGlite();try{
 await db.exec('create role anon;create role authenticated;create schema auth;create table auth.users(id uuid primary key)');
 for(const f of ['admin-backend/migrations/001_admin_foundation.sql','admin-backend/migrations/002_workflow_integrity.sql']) await db.exec(fs.readFileSync(f,'utf8'));
 await db.exec(`insert into auth.users values ('${a}'),('${b}');insert into bc_admin_v1.admin_users(id,enabled) values('${a}',true),('${b}',true);
 insert into bc_admin_v1.admin_content_versions(id,resource_type,resource_key,version_number,payload,payload_sha256,created_by) values('${v}','bio','test',1,'{}',decode(repeat('00',32),'hex'),'${a}');
 insert into bc_admin_v1.admin_drafts(id,version_id,author_id) values('${d}','${v}','${a}');`);
 await assert.rejects(db.exec(`update bc_admin_v1.admin_drafts set state='in_review',row_version=2 where id='${d}'`));
 await db.exec(`update bc_admin_v1.admin_drafts set state='in_review',assigned_reviewer_id='${b}',row_version=2 where id='${d}'`);
 await assert.rejects(db.exec(`insert into bc_admin_v1.admin_approvals(draft_id,reviewer_id,decision) values('${d}','${a}','approved')`));
 await assert.rejects(db.exec(`update bc_admin_v1.admin_drafts set state='approved',row_version=3 where id='${d}'`));
 await db.exec(`insert into bc_admin_v1.admin_approvals(draft_id,reviewer_id,decision) values('${d}','${b}','approved')`);
 await assert.rejects(db.exec(`insert into bc_admin_v1.admin_approvals(draft_id,reviewer_id,decision) values('${d}','${b}','rejected')`));
 await assert.rejects(db.exec(`update bc_admin_v1.admin_drafts set state='rejected',row_version=3 where id='${d}'`));
 await db.exec(`update bc_admin_v1.admin_drafts set state='approved',row_version=3 where id='${d}'`);
 await assert.rejects(db.exec(`update bc_admin_v1.admin_drafts set state='queued',row_version=4 where id='${d}'`));
 await assert.rejects(db.exec(`delete from bc_admin_v1.admin_drafts where id='${d}'`));
 await db.exec(fs.readFileSync('admin-backend/rollback/002_workflow_integrity.sql','utf8'));
 console.log('PASS local workflow integrity: reviewer assignment, self-review rejection, decision match, immutable versions and disabled publication');
}finally{await db.close()}})().catch(e=>{console.error(e);process.exitCode=1});
