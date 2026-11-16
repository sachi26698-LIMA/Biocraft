-- REVIEW ONLY. Destructive; separately approved backup/retention and explicit
-- authorization required. Erases memberships, revisions, history, audit and
-- rollups; does not reverse public content writes or revoke Auth sessions.
-- No CASCADE: unexpected external dependencies cause failure and rollback.
begin;
alter table bc_admin.documents drop constraint documents_current_revision_same_document_fk;
drop table bc_admin.publication_history;
drop table bc_admin.revisions;
drop table bc_admin.documents;
drop table bc_admin.audit_events;
drop table bc_admin.metric_rollups;
drop table bc_admin.safety_controls;
drop table bc_admin.members;
drop function bc_admin.reject_audit_mutation();
drop schema bc_admin restrict;
commit;
