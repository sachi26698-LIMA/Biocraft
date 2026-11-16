-- Rollback for 012. Drops only the functions and the two tables created by
-- 012. Refuses while recovery grants or cleanup evidence exist, because deleting
-- either would remove security evidence; there is no CASCADE.
begin;
do $$
declare n integer;
begin
 select count(*) into n from bc_admin_v1.admin_recovery_grants;
 if n > 0 then raise exception 'refusing rollback: % recovery grant rows exist', n; end if;
 select count(*) into n from bc_admin_v1.admin_cleanup_runs;
 if n > 0 then raise exception 'refusing rollback: % cleanup run rows exist', n; end if;
 -- Dropping mfa_enrolled_at would make an account that had proven a factor look
 -- like a first-time enroller, which reopens the password-only path 012 closes.
 select count(*) into n from bc_admin_v1.admin_users where mfa_enrolled_at is not null;
 if n > 0 then raise exception 'refusing rollback: % accounts have a recorded enrolment', n; end if;
end $$;
drop function bc_admin_v1.consume_recovery_grant(bytea,uuid);
drop function bc_admin_v1.factor_gate(uuid);
drop function bc_admin_v1.recovery_grant_state(uuid);
drop function bc_admin_v1.issue_recovery_grant(uuid,bytea,bytea,interval,uuid);
drop function bc_admin_v1.revoke_recovery_grant(uuid,uuid);
-- The 012 replacement of 011's gate reads mfa_enrolled_at. Restore the 011 body
-- before the column is dropped, otherwise the surviving function would reference a
-- missing column and every enrolment attempt would error instead of answering.
create or replace function bc_admin_v1.enrolment_eligible(p_request_id uuid) returns boolean
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
 insert into bc_admin_v1.admin_audit_logs(actor_id,request_id,action,target_type,target_id,details)
 values(case when eligible then uid else null end,p_request_id,'auth.enrolment_attempt','staff',uid::text,
        jsonb_build_object('eligible',eligible));
 return eligible;
end $$;
revoke all on function bc_admin_v1.enrolment_eligible(uuid) from public,anon,authenticated;
drop function bc_admin_v1.reset_factor_enrolment(uuid,uuid);
drop function bc_admin_v1.cleanup_expired(text,integer,uuid);
drop trigger admin_sessions_stamp_mfa on bc_admin_v1.admin_sessions;
drop function bc_admin_v1.stamp_mfa_enrolled();
drop table bc_admin_v1.admin_recovery_grants;
drop table bc_admin_v1.admin_cleanup_runs;
alter table bc_admin_v1.admin_users drop column mfa_enrolled_at;
commit;
