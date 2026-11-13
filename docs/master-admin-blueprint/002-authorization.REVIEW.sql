-- REVIEW ONLY: proposed private authorization helpers. NOT DEPLOYMENT-READY.
-- Depends on 001. Grants no client access, creates no public endpoint, grants
-- no admin privileges, and makes no changes to guest tables or policies.
-- Exact owner role, permission scope, session age, isolation and role-change
-- controls remain release blockers. AAL2 alone is not proof of recent MFA.
begin;
create function bc_admin.role_allows(p_role text,p_permission text) returns boolean
language sql immutable set search_path=pg_catalog as $$
  select exists(select 1 from (values
    ('dashboard.read','super_admin,admin,editor,moderator,analyst'),
    ('users.read','super_admin,admin,moderator'),
    ('users.moderate','super_admin,admin,moderator'),
    ('members.manage','super_admin'),
    ('bios.read','super_admin,admin,editor,moderator'),
    ('content.read','super_admin,admin,editor,moderator'),
    ('content.draft','super_admin,admin,editor'),
    ('content.review.reject','super_admin,admin,moderator'),
    ('content.review.approve','super_admin,admin'),
    ('content.publish','super_admin,admin'),
    ('analytics.read','super_admin,admin,analyst'),
    ('analytics.export','super_admin,admin,analyst'),
    ('audit.read','super_admin'),
    ('system.read','super_admin,admin'),
    ('system.manage','super_admin')
  ) as p(permission,roles)
  where p.permission=p_permission and p_role = any(string_to_array(p.roles,',')))
$$;
-- Used only from carefully scoped, reviewed server functions. Locks membership
-- until the caller transaction ends so a concurrent disable/role change cannot
-- complete mid-operation. Any already-committed earlier action remains valid.
create function bc_admin.require_permission(p_permission text) returns uuid
language plpgsql volatile security definer set search_path=pg_catalog as $$
declare v_uid uuid := auth.uid(); v_role text;
begin
  if v_uid is null or coalesce(auth.jwt()->>'aal','') <> 'aal2' then
    raise exception 'Not authorized' using errcode='42501';
  end if;
  select role into v_role from bc_admin.members where user_id=v_uid and enabled for update;
  if v_role is null or not bc_admin.role_allows(v_role,p_permission) then
    raise exception 'Not authorized' using errcode='42501';
  end if;
  return v_uid;
end $$;
revoke all on function bc_admin.role_allows(text,text), bc_admin.require_permission(text) from public,anon,authenticated;
commit;
