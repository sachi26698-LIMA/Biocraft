-- Local rollback for 010 candidate. Disposable synthetic clusters only.
begin;
drop function if exists bc_admin_v1.list_audit_logs(integer,bigint);
drop function if exists bc_admin_v1.list_my_sessions(integer,timestamptz);
drop function if exists bc_admin_v1.list_role_catalog();
drop function if exists bc_admin_v1.update_setting(text,jsonb,bigint,uuid);
drop function if exists bc_admin_v1.list_settings(integer,text);
drop function if exists bc_admin_v1.analytics_overview();
drop function if exists bc_admin_v1.list_seo_pages(integer,uuid);
drop function if exists bc_admin_v1.list_generators(integer,uuid);
drop function if exists bc_admin_v1.list_collections(integer,text);
drop function if exists bc_admin_v1.list_categories(integer,uuid);
drop function if exists bc_admin_v1.list_platforms(integer,uuid);
commit;
