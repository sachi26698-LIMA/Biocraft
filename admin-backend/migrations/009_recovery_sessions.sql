-- LOCAL DISPOSABLE FIXTURES ONLY. Not approved for shared execution.
-- Must be called only by a verified recovery gateway after successful TOTP.
-- The gateway opens the recovery session first, then revokes all Admin sessions
-- before changing provider credentials; provider/DB operations are not atomic.
begin;
create function bc_admin_v1.revoke_my_sessions(p_request_id uuid) returns integer
language plpgsql security definer set search_path=pg_catalog as $$
declare actor uuid; count_revoked integer;
begin
 if p_request_id is null then raise exception 'invalid request' using errcode='22023'; end if;
 actor:=bc_admin_v1.require_actor('dashboard.read');
 update bc_admin_v1.admin_sessions set revoked_at=now()
 where user_id=actor and revoked_at is null;
 get diagnostics count_revoked=row_count;
 insert into bc_admin_v1.admin_audit_logs(actor_id,request_id,action,target_type,target_id,details)
 values(actor,p_request_id,'session.revoke_all','staff',actor::text,jsonb_build_object('count',count_revoked,'reason','credential_recovery'));
 return count_revoked;
end $$;
revoke all on function bc_admin_v1.revoke_my_sessions(uuid) from public,anon,authenticated;
commit;
