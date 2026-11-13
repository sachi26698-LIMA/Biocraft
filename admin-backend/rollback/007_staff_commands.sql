-- Synthetic fixtures only. Memberships and audits are retained.
begin;
drop function bc_admin_v1.update_staff(uuid,bigint,boolean,text[],uuid);
drop function bc_admin_v1.list_staff(integer,uuid);
commit;
