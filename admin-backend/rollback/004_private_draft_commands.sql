-- Synthetic fixture only. No content or audit rows are deleted.
begin;
drop function bc_admin_v1.list_my_bio_drafts(integer,timestamptz,uuid);
drop function bc_admin_v1.review_draft(uuid,bigint,boolean,uuid);
drop function bc_admin_v1.submit_draft(uuid,bigint,uuid,uuid);
drop function bc_admin_v1.create_bio_draft(text,jsonb,uuid);
drop function bc_admin_v1.require_actor(text);
commit;
