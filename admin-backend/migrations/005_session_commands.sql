-- LOCAL SYNTHETIC FIXTURES ONLY. NOT APPROVED FOR SHARED PROJECT EXECUTION.
-- Requires reviewed server-only gateway/SQL roles and confirmed provider
-- auth.sessions semantics/privileges. No client EXECUTE grants. No bootstrap.
begin;
create function bc_admin_v1.open_admin_session(p_request_id uuid) returns timestamptz
language plpgsql security definer set search_path=pg_catalog as $$
declare uid uuid; sid uuid; expiry timestamptz; inserted boolean;
begin
 uid:=auth.uid();
 begin sid:=(auth.jwt()->>'session_id')::uuid;
 exception when invalid_text_representation then raise exception 'not authorized' using errcode='42501'; end;
 if uid is null or sid is null or p_request_id is null or coalesce(auth.jwt()->>'aal','')<>'aal2' then
  raise exception 'not authorized' using errcode='42501'; end if;
 perform 1 from bc_admin_v1.admin_users where id=uid and enabled for update;
 if not found or not exists(select 1 from bc_admin_v1.admin_user_roles where user_id=uid)
    or not exists(select 1 from auth.sessions where id=sid and user_id=uid) then
  raise exception 'not authorized' using errcode='42501'; end if;
 -- A revoked or expired Admin session can never be reopened under the same ID.
 insert into bc_admin_v1.admin_sessions(id,user_id,expires_at) values(sid,uid,now()+interval '8 hours')
 on conflict(id) do nothing;
 inserted:=found;
 select s.expires_at into expiry from bc_admin_v1.admin_sessions s
  where s.id=sid and s.user_id=uid and s.revoked_at is null and s.expires_at>now() for update;
 if not found then raise exception 'not authorized' using errcode='42501'; end if;
 if inserted then
  insert into bc_admin_v1.admin_audit_logs(actor_id,request_id,action,target_type,target_id)
  values(uid,p_request_id,'session.open','session',sid::text);
 end if;
 return expiry;
end $$;
create function bc_admin_v1.revoke_admin_session(p_request_id uuid) returns void
language plpgsql security definer set search_path=pg_catalog as $$
declare uid uuid; sid uuid;
begin
 if p_request_id is null then raise exception 'invalid request' using errcode='22023'; end if;
 uid:=bc_admin_v1.require_actor('dashboard.read'); sid:=(auth.jwt()->>'session_id')::uuid;
 update bc_admin_v1.admin_sessions set revoked_at=now() where id=sid and user_id=uid and revoked_at is null;
 insert into bc_admin_v1.admin_audit_logs(actor_id,request_id,action,target_type,target_id)
 values(uid,p_request_id,'session.revoke','session',sid::text);
end $$;
revoke all on function bc_admin_v1.open_admin_session(uuid),bc_admin_v1.revoke_admin_session(uuid) from public,anon,authenticated;
commit;
