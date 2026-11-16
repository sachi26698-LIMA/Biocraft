// Tests catalog content only, not server RBAC or provider authorization.
const {PGlite}=require('@electric-sql/pglite');const fs=require('node:fs');const assert=require('node:assert/strict');
(async()=>{const db=new PGlite();try{
 await db.exec('create role anon;create role authenticated;create schema auth;create table auth.users(id uuid primary key)');
 for(const f of ['001_admin_foundation.sql','002_workflow_integrity.sql','003_permission_catalog.sql']) await db.exec(fs.readFileSync('admin-backend/migrations/'+f,'utf8'));
 assert.equal((await db.query('select count(*)::int n from bc_admin_v1.admin_roles')).rows[0].n,8);
 const check=async(role,perm,expected)=>assert.equal((await db.query('select exists(select 1 from bc_admin_v1.admin_role_permissions where role_id=$1 and permission_id=$2) ok',[role,perm])).rows[0].ok,expected);
 await check('super_admin','staff.manage',true);await check('editor','content.publish',false);await check('moderator','content.review',false);await check('moderator','content.reject',true);await check('auditor','content.draft',false);await check('analyst','analytics.read',true);
 assert.equal((await db.query('select count(*)::int n from bc_admin_v1.admin_user_roles')).rows[0].n,0);
 await db.exec(fs.readFileSync('admin-backend/rollback/003_permission_catalog.sql','utf8'));
 assert.equal((await db.query('select count(*)::int n from bc_admin_v1.admin_roles')).rows[0].n,0);
 console.log('PASS isolated permission catalog and sample denials; no authorization server or user assignments tested');
}finally{await db.close()}})().catch(e=>{console.error(e);process.exitCode=1});
