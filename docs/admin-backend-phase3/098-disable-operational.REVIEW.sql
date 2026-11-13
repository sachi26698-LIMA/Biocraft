-- REVIEW ONLY: example isolated-target emergency stop. NEVER apply now.
-- Run only after a separately approved runbook/target; no API exists today.
-- Does not stop already-running transactions, revoke tokens or contain a
-- compromised DB owner/service key; additionally disable the gateway and rotate
-- credentials through the provider with explicit approval. Retains evidence.
begin;
update bc_admin.safety_controls set publish_enabled=false, telemetry_enabled=false, updated_at=now() where singleton=true;
revoke all on all tables in schema bc_admin from public,anon,authenticated;
revoke all on all sequences in schema bc_admin from public,anon,authenticated;
revoke all on all functions in schema bc_admin from public,anon,authenticated;
commit;
