#!/usr/bin/env node
// D3: generate the `bc_admin_executor` password and print the exact activation
// and rotation commands. Prints secrets to STDOUT ONLY, never to a file, a log,
// the repository or a shell history file: pipe it into your password manager or
// paste it straight into the Vercel dashboard, then clear the terminal.
//
//   node scripts/admin-executor-credential.mjs            # create
//   node scripts/admin-executor-credential.mjs --rotate   # rotate (two-role)
//
// Nothing here connects to a database or to Vercel. It only produces text a human
// with project access must run deliberately.
import {randomBytes} from 'node:crypto';

const ALPHABET = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const LENGTH = 48; // > 40 as decided in D3, ~283 bits of entropy.

/** Rejection-sampled so every character is uniform (no modulo bias). */
function generate(length = LENGTH) {
  const out = [];
  while (out.length < length) {
    for (const byte of randomBytes(64)) {
      if (byte >= 256 - (256 % ALPHABET.length)) continue; // reject the biased tail
      out.push(ALPHABET[byte % ALPHABET.length]);
      if (out.length === length) break;
    }
  }
  return out.join('');
}

const rotate = process.argv.includes('--rotate');
const password = generate();

if (rotate) {
  // Rotation uses a second role so no request ever fails mid-switch and the old
  // credential can be retired only after the new one is proven.
  console.log(`-- D3 ROTATION (two-role, zero downtime). Run each block deliberately.
-- 1. Create the successor and give it exactly the same privileges as the old one.
create role bc_admin_executor_next login password '${password}'
  nosuperuser nocreatedb nocreaterole noreplication nobypassrls inherit;
grant usage on schema bc_admin_v1 to bc_admin_executor_next;
grant execute on function
  bc_admin_v1.require_actor(text),
  bc_admin_v1.enrolment_eligible(uuid),
  bc_admin_v1.factor_gate(uuid),
  bc_admin_v1.open_admin_session(uuid),
  bc_admin_v1.revoke_admin_session(uuid),
  bc_admin_v1.revoke_my_sessions(uuid),
  bc_admin_v1.store_login_flow(bytea,bytea,integer),
  bc_admin_v1.take_login_flow(bytea),
  bc_admin_v1.consume_rate_limit(text,bytea),
  bc_admin_v1.list_staff(integer,uuid),
  bc_admin_v1.update_staff(uuid,bigint,boolean,text[],uuid),
  bc_admin_v1.create_bio_draft(text,jsonb,uuid),
  bc_admin_v1.update_bio_draft(uuid,bigint,jsonb,uuid),
  bc_admin_v1.get_bio_draft(uuid),
  bc_admin_v1.submit_draft(uuid,bigint,uuid,uuid),
  bc_admin_v1.review_draft(uuid,bigint,boolean,uuid),
  bc_admin_v1.list_my_bio_drafts(integer,timestamptz,uuid),
  bc_admin_v1.list_bio_review_queue(integer,timestamptz,uuid),
  bc_admin_v1.list_platforms(integer,uuid),
  bc_admin_v1.list_categories(integer,uuid),
  bc_admin_v1.list_collections(integer,text),
  bc_admin_v1.list_generators(integer,uuid),
  bc_admin_v1.list_seo_pages(integer,uuid),
  bc_admin_v1.analytics_overview(),
  bc_admin_v1.list_settings(integer,text),
  bc_admin_v1.update_setting(text,jsonb,bigint,uuid),
  bc_admin_v1.list_role_catalog(),
  bc_admin_v1.list_my_sessions(integer,timestamptz),
  bc_admin_v1.list_audit_logs(integer,bigint),
  bc_admin_v1.issue_recovery_grant(uuid,bytea,bytea,interval,uuid),
  bc_admin_v1.revoke_recovery_grant(uuid,uuid),
  bc_admin_v1.consume_recovery_grant(bytea,uuid),
  bc_admin_v1.recovery_grant_state(uuid),
  bc_admin_v1.cleanup_expired(text,integer,uuid)
 to bc_admin_executor_next;

-- 2. Verify the successor is limited (must return true, one row):
select session_user=current_user as no_setrole,
       not r.rolsuper and not r.rolbypassrls and not r.rolcreaterole
       and not r.rolcreatedb and not r.rolreplication as limited
  from pg_roles r where r.rolname=current_user;   -- connect AS bc_admin_executor_next

-- 3. Point the Preview at the successor and redeploy:
--      ADMIN_DB_USER=bc_admin_executor_next.<project-ref>
--      ADMIN_DB_PASSWORD=<the password printed above>
--    Confirm /api/admin/v1/health is 200 and one read module returns rows.

-- 4. Retire the old login only after step 3 succeeds:
revoke all on function bc_admin_v1.require_actor(text) from bc_admin_executor; -- ... repeat for all 34
drop owned by bc_admin_executor;
drop role bc_admin_executor;

-- 5. Rename the successor so the env var stays stable for the next rotation:
alter role bc_admin_executor_next rename to bc_admin_executor;`);
} else {
  console.log(`-- D3 ACTIVATION. Review the whole report first; nothing here is executed.
-- 1. Create the executor with a generated 48-character password.
create role bc_admin_executor login password '${password}'
  nosuperuser nocreatedb nocreaterole noreplication nobypassrls inherit;
grant usage on schema bc_admin_v1 to bc_admin_executor;
-- 2. Grant EXECUTE on exactly the 34 reviewed signatures (28 from 004-011,
--    6 from 012: factor_gate, issue/revoke/consume recovery, state, cleanup).
--    The trigger bodies reject_mutation, guard_draft, guard_approval and
--    stamp_mfa_enrolled are deliberately NOT granted.
grant execute on function
  bc_admin_v1.require_actor(text),
  bc_admin_v1.enrolment_eligible(uuid),
  bc_admin_v1.factor_gate(uuid),
  bc_admin_v1.open_admin_session(uuid),
  bc_admin_v1.revoke_admin_session(uuid),
  bc_admin_v1.revoke_my_sessions(uuid),
  bc_admin_v1.store_login_flow(bytea,bytea,integer),
  bc_admin_v1.take_login_flow(bytea),
  bc_admin_v1.consume_rate_limit(text,bytea),
  bc_admin_v1.list_staff(integer,uuid),
  bc_admin_v1.update_staff(uuid,bigint,boolean,text[],uuid),
  bc_admin_v1.create_bio_draft(text,jsonb,uuid),
  bc_admin_v1.update_bio_draft(uuid,bigint,jsonb,uuid),
  bc_admin_v1.get_bio_draft(uuid),
  bc_admin_v1.submit_draft(uuid,bigint,uuid,uuid),
  bc_admin_v1.review_draft(uuid,bigint,boolean,uuid),
  bc_admin_v1.list_my_bio_drafts(integer,timestamptz,uuid),
  bc_admin_v1.list_bio_review_queue(integer,timestamptz,uuid),
  bc_admin_v1.list_platforms(integer,uuid),
  bc_admin_v1.list_categories(integer,uuid),
  bc_admin_v1.list_collections(integer,text),
  bc_admin_v1.list_generators(integer,uuid),
  bc_admin_v1.list_seo_pages(integer,uuid),
  bc_admin_v1.analytics_overview(),
  bc_admin_v1.list_settings(integer,text),
  bc_admin_v1.update_setting(text,jsonb,bigint,uuid),
  bc_admin_v1.list_role_catalog(),
  bc_admin_v1.list_my_sessions(integer,timestamptz),
  bc_admin_v1.list_audit_logs(integer,bigint),
  bc_admin_v1.issue_recovery_grant(uuid,bytea,bytea,interval,uuid),
  bc_admin_v1.revoke_recovery_grant(uuid,uuid),
  bc_admin_v1.consume_recovery_grant(bytea,uuid),
  bc_admin_v1.recovery_grant_state(uuid),
  bc_admin_v1.cleanup_expired(text,integer,uuid)
 to bc_admin_executor;
-- 3. Store the password ONLY in Vercel Preview env vars (ADMIN_DB_PASSWORD).
--    Never in the repository, a VITE_* variable, a log or a chat message.
alter role bc_admin_executor password '<rotate with --rotate after any exposure>';`);
}

console.error(`\npassword length: ${password.length} characters (D3 minimum: 40)
Run as a role that may CREATE ROLE (the project owner), never as the executor.
Clear this terminal when you are done.`);
