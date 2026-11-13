-- Synthetic fixture rollback only; preserves immutable versions and audit data.
begin;
drop function bc_admin_v1.list_bio_review_queue(integer,timestamptz,uuid);
drop index bc_admin_v1.admin_drafts_reviewer_page_idx;
drop function bc_admin_v1.get_bio_draft(uuid);
drop function bc_admin_v1.update_bio_draft(uuid,bigint,jsonb,uuid);
commit;
