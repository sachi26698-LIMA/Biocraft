-- ISOLATED SYNTHETIC ENVIRONMENTS ONLY. No content is removed.
begin;
drop trigger draft_guard on bc_admin_v1.admin_drafts;
drop trigger approval_guard on bc_admin_v1.admin_approvals;
drop function bc_admin_v1.guard_draft();
drop function bc_admin_v1.guard_approval();
alter table bc_admin_v1.admin_approvals drop constraint one_decision_per_draft;
commit;
