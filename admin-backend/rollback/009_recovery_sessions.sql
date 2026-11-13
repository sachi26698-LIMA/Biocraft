-- Synthetic fixture rollback only; retains sessions and audits.
begin;
drop function bc_admin_v1.revoke_my_sessions(uuid);
commit;
