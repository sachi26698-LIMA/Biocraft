// Rollback cycle on the disposable cluster, in its own fresh database so the state
// is exactly "package installed, nothing else". Proves four things the approval
// package claims: 012 refuses while its evidence exists, rollback/012 leaves a
// working 011 gate even though it drops the column that gate now reads, the whole
// package tears down to no schema, and a reinstall reproduces the same object
// counts. Nothing here touches a hosted project.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import pg from 'pg';
import {randomUUID} from 'node:crypto';

const socket = process.env.BIOCRAFT_TEST_PG_SOCKET;
if (!socket) throw new Error('BIOCRAFT_TEST_PG_SOCKET is required');
const user = process.env.USER ?? 'postgres';
const db = 'biocraft_rollback_cycle';
const migrations = ['001_admin_foundation.sql','002_workflow_integrity.sql','003_permission_catalog.sql','004_private_draft_commands.sql','005_session_commands.sql','006_auth_controls.sql','007_staff_commands.sql','008_bio_edit.sql','009_recovery_sessions.sql','010_admin_module_commands.sql','011_totp_enrolment.sql','012_recovery_and_cleanup.sql'];

const root = new pg.Client({host: socket, database: 'postgres', user});
await root.connect();
try {
  await root.query(`drop database if exists ${db}`);
  await root.query(`create database ${db}`);
} finally { await root.end(); }

const client = new pg.Client({host: socket, database: db, user});
await client.connect();
try {
  // The provider objects the migrations depend on, created exactly as in the
  // PostgreSQL suite (this cluster has no Supabase).
  await client.query(`create schema auth;
    create table auth.users(id uuid primary key);
    create table auth.sessions(id uuid primary key,user_id uuid references auth.users(id));
    create function auth.jwt() returns jsonb language sql stable as $$select coalesce(nullif(current_setting('request.jwt.claims',true),''),'{}')::jsonb$$;
    create function auth.uid() returns uuid language sql stable as $$select nullif(auth.jwt()->>'sub','')::uuid$$;`);
  await client.query(fs.readFileSync('supabase/migrations/0001_initial_schema.sql','utf8'));
  for (const name of migrations) await client.query(fs.readFileSync(`admin-backend/migrations/${name}`,'utf8'));
  await client.query(fs.readFileSync('supabase/migrations/0002_rls_policies.sql','utf8'));

  const uid = '11111111-1111-4111-8111-111111111111', sid = '22222222-2222-4222-8222-222222222222';
  await client.query('insert into auth.users values($1)',[uid]);
  await client.query('insert into auth.sessions values($1,$2)',[sid,uid]);
  await client.query("insert into bc_admin_v1.admin_users(id,enabled) values($1,true)",[uid]);
  await client.query("insert into bc_admin_v1.admin_user_roles(user_id,role_id) values($1,'editor')",[uid]);

  const rollback012 = () => client.query(fs.readFileSync('admin-backend/rollback/012_recovery_and_cleanup.sql','utf8'));

  // 1. Each of the three guards refuses, and refuses *before* dropping anything.
  await client.query('update bc_admin_v1.admin_users set mfa_enrolled_at=now() where id=$1',[uid]);
  await assert.rejects(rollback012(), /refusing rollback: 1 accounts have a recorded enrolment/);
  await client.query('rollback');
  await client.query('update bc_admin_v1.admin_users set mfa_enrolled_at=null where id=$1',[uid]);
  await client.query("insert into bc_admin_v1.admin_cleanup_runs(target,started_at,deleted) values('admin_login_flows',now(),1)");
  await assert.rejects(rollback012(), /refusing rollback: 1 cleanup run rows exist/);
  await client.query('rollback');
  await client.query('delete from bc_admin_v1.admin_cleanup_runs');
  await client.query(`insert into bc_admin_v1.admin_recovery_grants(id,user_id,issued_by,issued_at,expires_at,salt,code_hash,attempts)
    values(gen_random_uuid(),$1,$1,now(),now()+interval '5 minutes',gen_random_bytes(8),gen_random_bytes(32),0)`,[uid]);
  await assert.rejects(rollback012(), /refusing rollback: 1 recovery grant rows exist/);
  await client.query('rollback');
  await client.query('delete from bc_admin_v1.admin_recovery_grants');

  // 2. With no evidence, 012 rolls back and 011's gate still answers, even though
  //    the column its 012 replacement read is gone.
  await rollback012();
  const gone = await client.query("select count(*)::int n from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='bc_admin_v1' and p.proname in ('factor_gate','reset_factor_enrolment','cleanup_expired','consume_recovery_grant')");
  assert.equal(gone.rows[0].n, 0);
  assert.equal((await client.query("select count(*)::int n from information_schema.columns where table_schema='bc_admin_v1' and table_name='admin_users' and column_name='mfa_enrolled_at'")).rows[0].n, 0);
  await client.query('begin');
  await client.query("select set_config('request.jwt.claims',$1,true)",[JSON.stringify({sub:uid,session_id:sid,aal:'aal1',role:'authenticated'})]);
  const gate = await client.query('select bc_admin_v1.enrolment_eligible($1) as eligible',[randomUUID()]);
  await client.query('commit');
  assert.equal(gate.rows[0].eligible, true, 'the restored 011 gate must work after rollback/012');

  // 3. Full teardown in reverse order leaves no schema at all.
  // Audit rows are append-only by trigger (that is the point of 002), so the
  // teardown removes the guard with the evidence it protects: in a real project
  // this is a deliberate, reviewed drop, never something the application can do.
  for (const trigger of ['audit_no_change','audit_no_truncate','security_no_change','security_no_truncate','content_no_change','content_no_truncate','approval_no_change','approval_no_truncate']) {
    const [table] = [{audit_no_change:'admin_audit_logs',audit_no_truncate:'admin_audit_logs',security_no_change:'admin_security_events',security_no_truncate:'admin_security_events',content_no_change:'admin_content_versions',content_no_truncate:'admin_content_versions',approval_no_change:'admin_approvals',approval_no_truncate:'admin_approvals'}[trigger]];
    await client.query(`drop trigger ${trigger} on bc_admin_v1.${table}`);
  }
  await client.query('delete from bc_admin_v1.admin_audit_logs');
  await client.query('delete from bc_admin_v1.admin_security_events');
  // 001 also refuses while membership data exists; remove the fixture rows so the
  // teardown exercises the same empty-schema path a real rollback would.
  // Dependency-ordered teardown of the catalog and membership rows, which is the
  // order a real operator follows when the rollback guard reports data:
  // join tables first, then parents.
  for (const table of ['admin_user_roles','admin_role_permissions','admin_users','admin_roles','admin_permissions','admin_sessions','admin_settings','admin_notifications','admin_backup_records']) {
    await client.query(`delete from bc_admin_v1.${table}`);
  }
  for (const name of ['011_totp_enrolment.sql','010_admin_module_commands.sql','009_recovery_sessions.sql','008_bio_edit.sql','007_staff_commands.sql','006_auth_controls.sql','005_session_commands.sql','004_private_draft_commands.sql','003_permission_catalog.sql','002_workflow_integrity.sql','001_admin_foundation.sql']) {
    await client.query(fs.readFileSync(`admin-backend/rollback/${name}`,'utf8'));
  }
  assert.equal((await client.query("select count(*)::int n from pg_namespace where nspname='bc_admin_v1'")).rows[0].n, 0, 'rollback must drop the schema');
  const leftovers = await client.query("select count(*)::int n from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='bc_admin_v1'");
  assert.equal(leftovers.rows[0].n, 0);

  // 4. Reinstall reproduces the published counts.
  for (const name of migrations) await client.query(fs.readFileSync(`admin-backend/migrations/${name}`,'utf8'));
  const counts = await client.query("select (select count(*)::int from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='bc_admin_v1' and c.relkind='r') tables, (select count(*)::int from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='bc_admin_v1') functions");
  assert.equal(counts.rows[0].tables, 19);
  assert.equal(counts.rows[0].functions, 39);

  console.log('PASS rollback cycle (fresh database): all three 012 guards refuse before touching anything, rollback/012 restores a working 011 gate after dropping mfa_enrolled_at, full reverse teardown leaves no schema or function, and a clean reinstall recreates 19 tables and 39 functions');
} finally {
  await client.end();
  const cleanup = new pg.Client({host: socket, database: 'postgres', user});
  await cleanup.connect();
  try { await cleanup.query(`drop database if exists ${db}`); } finally { await cleanup.end(); }
}
