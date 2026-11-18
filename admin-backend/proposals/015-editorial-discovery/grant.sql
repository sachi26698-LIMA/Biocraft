-- Review and grant to the existing limited executor only (never a browser role).
begin;
grant execute on function bc_admin_v1.list_eligible_bio_reviewers(integer,uuid),bc_admin_v1.list_approved_bio_queue(integer,uuid) to bc_admin_executor;
commit;
