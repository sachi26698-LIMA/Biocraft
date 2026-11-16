-- LOCAL SYNTHETIC FIXTURES ONLY. No client grants. Not approved for shared DB.
-- Staff role updates use one advisory lock before membership-row locks. Any future
-- membership mutation must use the same locking discipline to enforce last-S.
begin;
create function bc_admin_v1.list_staff(p_limit integer,p_after uuid)
returns table(user_id uuid,enabled boolean,version bigint,roles text[])
language plpgsql security definer set search_path=pg_catalog as $$
declare actor uuid;
begin
 actor:=bc_admin_v1.require_actor('staff.read');
 if p_limit is null or p_limit<1 or p_limit>100 then raise exception 'invalid page' using errcode='22023'; end if;
 return query select u.id,u.enabled,u.version,coalesce(array_agg(ur.role_id order by ur.role_id) filter(where ur.role_id is not null),array[]::text[])
 from bc_admin_v1.admin_users u left join bc_admin_v1.admin_user_roles ur on ur.user_id=u.id
 where p_after is null or u.id>p_after group by u.id,u.enabled,u.version order by u.id limit p_limit;
end $$;
create function bc_admin_v1.update_staff(p_target uuid,p_version bigint,p_enabled boolean,p_roles text[],p_request uuid) returns bigint
language plpgsql security definer set search_path=pg_catalog as $$
declare actor uuid; member bc_admin_v1.admin_users%rowtype; was_super boolean; will_super boolean; super_count bigint;
begin
 perform pg_advisory_xact_lock(hashtextextended('bc_admin_v1:staff-role-mutations',0));
 actor:=bc_admin_v1.require_actor('staff.manage');
 if p_target is null or p_target=actor or p_request is null or p_version is null or p_enabled is null or p_roles is null
    or cardinality(p_roles)<1 or cardinality(p_roles)>8
    or exists(select 1 from unnest(p_roles) x where x is null or not exists(select 1 from bc_admin_v1.admin_roles where id=x))
    or (select count(distinct x) from unnest(p_roles) x)<>cardinality(p_roles) then
  raise exception 'invalid staff update' using errcode='22023'; end if;
 select * into member from bc_admin_v1.admin_users where id=p_target for update;
 if not found then raise exception 'not authorized' using errcode='42501'; end if;
 if member.version<>p_version then raise exception 'stale version' using errcode='40001'; end if;
 was_super:=exists(select 1 from bc_admin_v1.admin_user_roles where user_id=p_target and role_id='super_admin');
 will_super:='super_admin'=any(p_roles);
 -- S promotion is disabled until the separately reviewed two-person flow exists.
 if will_super and not was_super then raise exception 'super admin promotion unavailable' using errcode='42501'; end if;
 if was_super and member.enabled and (not will_super or not p_enabled) then
  select count(*) into super_count from bc_admin_v1.admin_users u join bc_admin_v1.admin_user_roles ur on ur.user_id=u.id
   where u.enabled and ur.role_id='super_admin';
  if super_count<=1 then raise exception 'last super admin' using errcode='23514'; end if;
 end if;
 update bc_admin_v1.admin_users set enabled=p_enabled,disabled_at=case when p_enabled then null else coalesce(disabled_at,now()) end,
  version=version+1,updated_at=now() where id=p_target;
 delete from bc_admin_v1.admin_user_roles where user_id=p_target;
 insert into bc_admin_v1.admin_user_roles(user_id,role_id,assigned_by) select p_target,x,actor from unnest(p_roles) x;
 insert into bc_admin_v1.admin_audit_logs(actor_id,request_id,action,target_type,target_id,details)
 values(actor,p_request,'staff.update','staff',p_target::text,jsonb_build_object('enabled',p_enabled,'roles',to_jsonb(p_roles),'version',member.version+1));
 return member.version+1;
end $$;
revoke all on function bc_admin_v1.list_staff(integer,uuid),bc_admin_v1.update_staff(uuid,bigint,boolean,text[],uuid) from public,anon,authenticated;
commit;
