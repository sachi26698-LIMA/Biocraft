-- Synthetic fixture only. Sessions and audit records are retained.
begin;
drop function bc_admin_v1.revoke_admin_session(uuid);
drop function bc_admin_v1.open_admin_session(uuid);
commit;
