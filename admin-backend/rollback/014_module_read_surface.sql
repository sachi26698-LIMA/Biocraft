-- Rollback for 014. Removes the triggers first so no event can call a function
-- that is about to disappear, then the five read functions. Rows in
-- admin_notifications are left in place: they are ordinary records, not schema.
begin;
drop trigger if exists admin_publications_notify on bc_admin_v1.admin_bio_publications;
drop trigger if exists admin_drafts_notify on bc_admin_v1.admin_drafts;
drop function bc_admin_v1.notify_draft_event();
drop function bc_admin_v1.list_public_bios(integer,uuid,text,text,boolean);
drop function bc_admin_v1.list_backup_records(integer,timestamptz);
drop function bc_admin_v1.list_publication_jobs(integer,uuid);
drop function bc_admin_v1.mark_notifications_read(timestamptz);
drop function bc_admin_v1.list_my_notifications(integer,timestamptz);
drop function bc_admin_v1.session_identity();
commit;
