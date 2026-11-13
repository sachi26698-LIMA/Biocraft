-- REVIEW ONLY: remove proposed 002 helpers. Fails if dependent functions exist.
-- Separate approval, dependency review and containment are required.
begin;
drop function bc_admin.require_permission(text);
drop function bc_admin.role_allows(text,text);
commit;
