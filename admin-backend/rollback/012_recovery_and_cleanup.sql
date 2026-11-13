-- Rollback for 012. Drops only the four functions and the two tables created by
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
drop function bc_admin_v1.cleanup_expired(text,integer,uuid);
drop trigger admin_sessions_stamp_mfa on bc_admin_v1.admin_sessions;
drop function bc_admin_v1.stamp_mfa_enrolled();
drop table bc_admin_v1.admin_recovery_grants;
drop table bc_admin_v1.admin_cleanup_runs;
alter table bc_admin_v1.admin_users drop column mfa_enrolled_at;
commit;
