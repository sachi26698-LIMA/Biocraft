-- LOCAL SYNTHETIC FIXTURES ONLY. Not approved for shared execution.
-- First-factor (TOTP) enrolment gate for an account that has a password session
-- but no verified factor yet. It deliberately does NOT require aal2 (the account
-- has no second factor), but it does require an enabled Admin membership with at
-- least one role and a live provider session.
--
-- It returns a boolean instead of raising for a denied actor so that the audited
-- denial commits: a raise would roll the audit row back. The caller (the trusted
-- database adapter) MUST reject with 403 when the result is not true, and must
-- never treat a missing row as success. Invalid arguments still raise.
begin;
create function bc_admin_v1.enrolment_eligible(p_request_id uuid) returns boolean
language plpgsql security definer set search_path=pg_catalog as $$
declare uid uuid; sid uuid; eligible boolean:=false;
begin
 if p_request_id is null then raise exception 'invalid request' using errcode='22023'; end if;
 uid:=auth.uid();
 begin sid:=nullif(auth.jwt()->>'session_id','')::uuid;
 exception when invalid_text_representation then sid:=null; end;
 if uid is not null and sid is not null and coalesce(auth.jwt()->>'aal','') in ('aal1','aal2') then
  select exists(
    select 1 from bc_admin_v1.admin_users u
    where u.id=uid and u.enabled
      and exists(select 1 from bc_admin_v1.admin_user_roles r where r.user_id=u.id)
      and exists(select 1 from auth.sessions s where s.id=sid and s.user_id=uid)
  ) into eligible;
 end if;
 -- Audited for every attempt, including denials, with no token material.
 insert into bc_admin_v1.admin_audit_logs(actor_id,request_id,action,target_type,target_id,details)
 values(case when eligible then uid else null end,p_request_id,'auth.enrolment_attempt','staff',uid::text,
        jsonb_build_object('eligible',eligible));
 return eligible;
end $$;
revoke all on function bc_admin_v1.enrolment_eligible(uuid) from public,anon,authenticated;
commit;
