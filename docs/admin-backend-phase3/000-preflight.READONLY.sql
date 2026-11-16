-- REVIEW ONLY, read-only metadata; no secrets or content rows are queried.
-- Run only against an explicitly authorized target with a read-only role.
-- Does not prove effective privileges across every inherited role or BYPASSRLS.
begin read only;
select c.relname, c.relrowsecurity, c.relforcerowsecurity,
       pg_get_userbyid(c.relowner) as table_owner
from pg_catalog.pg_class c join pg_catalog.pg_namespace n on n.oid=c.relnamespace
where n.nspname='public' and c.relkind='r'
order by c.relname;
select tablename,policyname,roles,cmd,qual,with_check
from pg_catalog.pg_policies where schemaname='public'
order by tablename,policyname;
select table_name,grantee,privilege_type
from information_schema.role_table_grants
where table_schema='public' and grantee in ('anon','authenticated')
order by table_name,grantee,privilege_type;
select n.nspname,p.proname,pg_catalog.pg_get_function_identity_arguments(p.oid) as args,
       p.prosecdef,pg_catalog.pg_get_userbyid(p.proowner) as owner
from pg_catalog.pg_proc p join pg_catalog.pg_namespace n on n.oid=p.pronamespace
where n.nspname in ('public','bc_admin')
order by n.nspname,p.proname,args;
commit;
