-- ISOLATED SYNTHETIC ENVIRONMENTS ONLY. Refuse removal if any membership exists.
begin;
do $$ begin
 if exists(select 1 from bc_admin_v1.admin_user_roles) then
  raise exception 'refusing rollback: role assignments exist';
 end if;
end $$;
delete from bc_admin_v1.admin_role_permissions;
delete from bc_admin_v1.admin_permissions;
delete from bc_admin_v1.admin_roles;
commit;
