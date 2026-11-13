-- REVIEW ONLY. No action authorized. Revoking is immediate shared-project change.
-- Does not touch existing guest table policies or data. Keep evidence and drafts.
begin;
revoke execute on function public.bc_control_create_draft(uuid), public.bc_control_update_draft(uuid,jsonb),
 public.bc_control_submit(uuid), public.bc_control_review(uuid,boolean), public.bc_control_publish(uuid)
 from authenticated, anon, public;
update biocraft_control.settings set publish_enabled=false where singleton;
commit;
