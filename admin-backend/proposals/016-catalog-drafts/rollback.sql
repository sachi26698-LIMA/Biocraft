-- Disable the feature first. Refuse to discard any private draft or audit data.
begin;
lock table bc_admin_v1.catalog_drafts in access exclusive mode;
do $$ begin if exists(select 1 from bc_admin_v1.catalog_drafts) then
 raise exception 'draft history exists; leave feature disabled and retain data'; end if; end $$;
drop function bc_admin_v1.change_catalog_draft(text,text,uuid,bigint,jsonb,uuid);
drop function bc_admin_v1.list_catalog_drafts(text,integer,uuid);
drop table bc_admin_v1.catalog_drafts;
commit;
