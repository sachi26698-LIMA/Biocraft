-- CANONICAL EXECUTOR GRANT LIST. Executed by a human with project access AFTER
-- migrations 001–012, never by the application, and never as the executor itself.
--
-- 43 signatures = 48 functions created by 001–014 minus the 5 trigger bodies
-- (reject_mutation, guard_draft, guard_approval, stamp_mfa_enrolled). Trigger
-- functions are invoked by the trigger machinery as the table owner and must not
-- be granted: a direct EXECUTE would widen the surface for no benefit.
--
-- `tests/admin-grant-inventory.mjs` fails if this file and the migrations ever
-- disagree, so a new function cannot be created without a decision about whether
-- the executor may call it.

grant usage on schema bc_admin_v1 to bc_admin_executor;

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
  bc_admin_v1.reset_factor_enrolment(uuid,uuid),
  bc_admin_v1.consume_recovery_grant(bytea,uuid),
  bc_admin_v1.recovery_grant_state(uuid),
  bc_admin_v1.cleanup_expired(text,integer,uuid),
  bc_admin_v1.publish_bio_draft(uuid,bigint,uuid,uuid),
  bc_admin_v1.list_bio_publications(uuid,integer,bigint),
  bc_admin_v1.create_revert_draft(bigint,uuid),
  bc_admin_v1.list_my_notifications(integer,timestamptz),
  bc_admin_v1.mark_notifications_read(timestamptz),
  bc_admin_v1.list_publication_jobs(integer,uuid),
  bc_admin_v1.list_backup_records(integer,timestamptz),
  bc_admin_v1.list_public_bios(integer,uuid,text,text,boolean)
 to bc_admin_executor;
