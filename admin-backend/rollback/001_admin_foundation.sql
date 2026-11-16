-- ISOLATED SYNTHETIC ENVIRONMENTS ONLY. DESTRUCTIVE; NEVER RUN ON PRODUCTION.
-- In real environments retain evidence and use the reviewed incident process.
-- Refuses removal if any admin data exists; drops are explicit, without CASCADE.
begin;
do $$
declare r record; occupied boolean;
begin
 for r in select tablename from pg_catalog.pg_tables where schemaname='bc_admin_v1' loop
  execute format('select exists(select 1 from bc_admin_v1.%I)',r.tablename) into occupied;
  if occupied then raise exception 'refusing rollback: bc_admin_v1.% contains data',r.tablename; end if;
 end loop;
end $$;
drop table bc_admin_v1.admin_publication_jobs;
drop table bc_admin_v1.admin_approvals;
drop table bc_admin_v1.admin_drafts;
drop table bc_admin_v1.admin_content_versions;
drop table bc_admin_v1.admin_notifications;
drop table bc_admin_v1.admin_sessions;
drop table bc_admin_v1.admin_audit_logs;
drop table bc_admin_v1.admin_security_events;
drop table bc_admin_v1.admin_backup_records;
drop table bc_admin_v1.admin_settings;
drop table bc_admin_v1.admin_user_roles;
drop table bc_admin_v1.admin_role_permissions;
drop table bc_admin_v1.admin_permissions;
drop table bc_admin_v1.admin_roles;
drop table bc_admin_v1.admin_users;
drop function bc_admin_v1.reject_mutation();
drop schema bc_admin_v1 restrict;
commit;
