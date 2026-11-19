-- Rollback for 015. Drops the eight read functions created by the migration.
--
-- Nothing else is touched, on purpose:
--   * 015 creates no table, trigger, policy, index or role, so there is nothing
--     else to reverse;
--   * it reads public.* only and never writes there, so dropping the readers
--     cannot lose a content record — every row they exposed stays in its own
--     table and simply stops having a bc_admin_v1 accessor;
--   * the EXECUTE grants for these eight signatures live in
--     admin-backend/grants/executor-grants.sql, not in the migration, so they
--     vanish with the functions and need no separate REVOKE.
--
-- No CASCADE: each function is dropped by explicit signature, so a future
-- dependency fails loudly here instead of silently removing more surface.
begin;
drop function if exists bc_admin_v1.list_translations(integer,text);
drop function if exists bc_admin_v1.list_languages();
drop function if exists bc_admin_v1.list_symbols(integer,text,text);
drop function if exists bc_admin_v1.list_emoji(integer,text);
drop function if exists bc_admin_v1.list_fonts(integer,text,text,text);
drop function if exists bc_admin_v1.list_sync_jobs(integer,timestamptz);
drop function if exists bc_admin_v1.list_data_sources(integer,text);
drop function if exists bc_admin_v1.content_library_stats();
commit;
