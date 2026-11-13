-- REVIEW ONLY. Destructive: erases all members, drafts, and audit evidence.
-- Requires separately approved backup, retention and explicit deletion approval.
-- Does not restore published content or revoke existing auth sessions.
begin;
drop function public.bc_control_publish(uuid);
drop function public.bc_control_review(uuid,boolean);
drop function public.bc_control_submit(uuid);
drop function public.bc_control_update_draft(uuid,jsonb);
drop function public.bc_control_create_draft(uuid);
drop schema biocraft_control cascade;
commit;
