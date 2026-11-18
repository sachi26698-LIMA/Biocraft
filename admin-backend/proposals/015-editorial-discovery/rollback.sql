-- Disable ADMIN_EDITORIAL_DIRECTORY_ENABLED and redeploy before rollback.
begin;
drop function bc_admin_v1.list_approved_bio_queue(integer,uuid);
drop function bc_admin_v1.list_eligible_bio_reviewers(integer,uuid);
commit;
