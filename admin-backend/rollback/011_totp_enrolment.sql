-- Local rollback for 011. Disposable synthetic clusters only.
begin;
drop function if exists bc_admin_v1.enrolment_eligible(uuid);
commit;
