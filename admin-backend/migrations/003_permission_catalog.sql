-- ISOLATED ADMIN DATABASE ONLY. Permission catalog, not an authorization API.
-- No user memberships, client grants, or privileges are created. Subject to
-- security review; changes in authorization must use reviewed commands.
begin;
insert into bc_admin_v1.admin_roles(id,description) values
 ('super_admin','Super Admin'),('admin','Admin'),('content_manager','Content Manager'),
 ('editor','Editor'),('seo_manager','SEO Manager'),('analyst','Analyst'),
 ('moderator','Moderator'),('auditor','Read-only Auditor');
insert into bc_admin_v1.admin_permissions(id,description) values
 ('dashboard.read','View permitted dashboard summaries'),
 ('staff.read','Read staff directory'),('staff.manage','Manage staff membership and roles'),
 ('content.read','Read content and drafts'),('content.draft','Create and edit own drafts'),
 ('content.review','Approve or reject another author content'),('content.reject','Reject another author content'),
 ('content.publish','Request reviewed publication'),('seo.draft','Create and edit own SEO drafts'),
 ('analytics.read','Read approved analytics'),('analytics.export','Export approved aggregates'),
 ('audit.read','Read redacted audit and security records'),('sessions.read','View permitted session metadata'),
 ('sessions.revoke','Revoke administrative sessions'),('settings.read','Read non-secret settings'),
 ('settings.manage','Request reviewed setting changes'),('system.health','Read redacted health status'),
 ('system.stop','Disable operations during an incident');
-- Super Admin receives all catalog entries. Separation, step-up, scoped access,
-- last-admin and feature switches still must be checked by future commands.
insert into bc_admin_v1.admin_role_permissions(role_id,permission_id)
 select 'super_admin',id from bc_admin_v1.admin_permissions;
insert into bc_admin_v1.admin_role_permissions(role_id,permission_id) values
 ('admin','dashboard.read'),('admin','staff.read'),('admin','content.read'),('admin','content.draft'),
 ('admin','content.review'),('admin','content.reject'),('admin','content.publish'),
 ('admin','analytics.read'),('admin','settings.read'),('admin','system.health'),
 ('content_manager','dashboard.read'),('content_manager','content.read'),('content_manager','content.draft'),
 ('content_manager','content.review'),('content_manager','content.reject'),('content_manager','content.publish'),
 ('editor','dashboard.read'),('editor','content.read'),('editor','content.draft'),
 ('seo_manager','dashboard.read'),('seo_manager','content.read'),('seo_manager','seo.draft'),
 ('analyst','dashboard.read'),('analyst','analytics.read'),('analyst','analytics.export'),
 ('moderator','dashboard.read'),('moderator','content.read'),('moderator','content.reject'),
 ('auditor','dashboard.read'),('auditor','audit.read'),('auditor','sessions.read'),('auditor','system.health');
commit;
