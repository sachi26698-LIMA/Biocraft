-- Separate approval. Only these commands; no table, role or membership grants.
begin;
grant execute on function bc_admin_v1.list_catalog_drafts(text,integer,uuid),bc_admin_v1.change_catalog_draft(text,text,uuid,bigint,jsonb,uuid) to bc_admin_executor;
commit;
