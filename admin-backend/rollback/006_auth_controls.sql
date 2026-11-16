-- Synthetic fixtures only; refuses destruction of non-empty rate/flow data.
begin;
do $$ begin
 if exists(select 1 from bc_admin_v1.admin_login_flows) or exists(select 1 from bc_admin_v1.admin_rate_limits) then
  raise exception 'refusing rollback: auth control records exist'; end if;
end $$;
drop function bc_admin_v1.store_login_flow(bytea,bytea,integer);
drop function bc_admin_v1.take_login_flow(bytea);
drop function bc_admin_v1.consume_rate_limit(text,bytea);
drop table bc_admin_v1.admin_login_flows;
drop table bc_admin_v1.admin_rate_limits;
commit;
