# Approval request — Admin backend on the existing shared project

This is a request for explicit approval. **Nothing below has been applied.** No
schema, grant, account or Auth setting has been changed in
`jvpadtzfsuekixrquzjv`.

## Why approval is required

The Admin backend needs its own schema in the same database that serves the
production public site. Per the standing instruction, that shared security
change may not be applied without exact SQL, impact and rollback being shown and
approved. The database credential needed to run it also does not exist in this
environment.

## What is requested

1. **Apply candidate migrations `001`–`010`** to `jvpadtzfsuekixrquzjv`
   (`admin-backend/migrations/`, matching non-destructive rollbacks in
   `admin-backend/rollback/`). Files:
   - `001_admin_foundation.sql` — schema `bc_admin_v1`, 15 Admin tables,
     default-deny RLS, append-only triggers, per-schema default ACL revokes.
   - `002_workflow_integrity.sql` — draft/approval state guards.
   - `003_permission_catalog.sql` — 8 roles, 18 permissions, role→permission map.
   - `004_private_draft_commands.sql` — `require_actor`, private bio draft
     create/list/submit/review.
   - `005_session_commands.sql` — Admin session open/revoke (1-hour cap).
   - `006_auth_controls.sql` — encrypted one-time login flows, DB rate limits.
   - `007_staff_commands.sql` — staff list/update with last-super-admin guard.
   - `008_bio_edit.sql` — immutable draft revisions, draft detail, review queue.
   - `009_recovery_sessions.sql` — revoke all own Admin sessions.
   - `010_admin_module_commands.sql` — module reads, settings, audit, sessions.
2. **Create one dedicated database login** (`admin_executor`), non-owner,
   non-superuser, no `BYPASSRLS`, no schema CREATE, granted `USAGE` on
   `bc_admin_v1` and `EXECUTE` on exactly the reviewed function list — no table
   privileges. Its password goes only into Vercel Preview env vars.
3. **Create the first administrator**: one existing/new `auth.users` row plus an
   enabled `bc_admin_v1.admin_users` membership with `super_admin`, enrolled in
   TOTP. This is the only bootstrap path and it is manual/audited by design.
4. **Auth settings** (separate decision): recover redirect for
   `https://<preview-origin>/admin/recovery`, and a decision on
   `security_update_password_require_reauthentication`. Current project state —
   `site_url=http://localhost:3000`, empty redirect allow-list, signup enabled,
   password minimum 6, no SMTP — blocks real sign-in and recovery e-mail.
5. **Preview-only environment variables** (never Production, never `VITE_`):
   `ADMIN_BACKEND_ENABLED`, `ADMIN_ORIGIN`, `ADMIN_SUPABASE_PUBLISHABLE_KEY`,
   `ADMIN_DB_USER`, `ADMIN_DB_PASSWORD`, `ADMIN_COOKIE_KEY_HEX`,
   `ADMIN_FLOW_KEY_HEX`, `ADMIN_HASH_KEY_HEX`, `ADMIN_TRUSTED_CLIENT_HEADER`,
   `ADMIN_INGRESS_SECRET_HEX`.

## Impact if approved

- New schema only; **no change to `public` tables, their RLS policies or guest
  privileges**, no data deletion, no Production deployment.
- New SECURITY DEFINER functions owned by the migration role; the executor role
  you approve must not be able to alter them.
- Admin audit/security tables grow with use; retention is not automated.
- `auth.sessions` must be readable by the definer functions (Supabase-owned).

## Rollback

`admin-backend/rollback/001`–`010` drop only `bc_admin_v1` objects, refuse when
Admin tables contain rows, and never touch `public`/`auth` tables. Reverting the
Vercel env vars disables the API immediately (it then returns 503).

## What stays blocked until this is approved

Real sign-in, real sessions, every module data layer, hosted API verification,
and any claim that the Master Admin is functional. Local real-PostgreSQL tests
already pass for the same SQL.
