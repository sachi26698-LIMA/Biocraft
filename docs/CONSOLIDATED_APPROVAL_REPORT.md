# CONSOLIDATED APPROVAL REPORT — BioCraft Master Admin on `jvpadtzfsuekixrquzjv`

**Status: awaiting your decision. Nothing in this report has been executed.** No
schema, role, grant, Auth setting or account has been created in the shared
project. This file supersedes `docs/MASTER_ADMIN_APPROVAL_REQUEST.md` as the
single approval artefact; the full per-file SQL is shown at the end.

Re-verified at the end of this work (read-only queries only): `bc_admin_v1`
schema **absent**, `bc_admin_executor` role **absent**, guest `anon` still sees
506 bios / 33 categories / 8 platforms — identical to owner counts. No shared
change of any kind has been made.

Verified live state at the time of writing (read-only queries only):

| Fact | Value |
|---|---|
| Project | `jvpadtzfsuekixrquzjv`, ACTIVE_HEALTHY, ap-southeast-2, PostgreSQL 17.11 |
| `public.bios` | **506 rows, all active** (unchanged) |
| Distinct `bios.source_slug` | **20** — the 20 collections |
| `public.categories` | 33 |
| `public.platforms` / `generators` / `seo_pages` | 8 / 12 / 48 |
| Guest (`anon`) visibility, checked via `set local role anon` | bios **506**, categories **33**, platforms **8** — identical to owner counts |
| Admin schema present | **No** (`bc_admin_v1` does not exist) |
| Admin accounts | **None** |
| Migrations recorded | the four original public migrations only |

Guest/`anon` sees exactly the same active rows as before, so the "works today"
baseline is captured and can be re-checked byte-for-byte after any change.

---

## 1. What changes in the shared project (complete list)

Everything is **additive and confined to a new schema**. Nothing in `public`,
`auth`, storage or any existing role is altered.

| # | Object | Effect on Production/guests |
|---|---|---|
| 1 | new schema `bc_admin_v1` | invisible to `anon`/`authenticated`; `REVOKE ALL ... FROM public, anon, authenticated` |
| 2 | 17 new tables (admin users, roles, permissions, sessions, drafts, versions, approvals, audit, security events, settings, notifications, backup records, login flows, rate limits) | none; RLS enabled with a restrictive `deny_clients` policy and all table privileges revoked |
| 3 | 31 new functions, all `SECURITY DEFINER`, `search_path=pg_catalog` (28 callable by the executor; 3 are trigger functions and get no grant) | none by default: every function ends with `REVOKE ALL ... FROM public, anon, authenticated` |
| 4 | triggers on the new tables only | none |
| 5 | `ALTER DEFAULT PRIVILEGES IN SCHEMA bc_admin_v1 ...` | per-schema only, affects **future** `bc_admin_v1` objects created by the same role. Global default ACLs (which govern `public`) are **not** touched |
| 6 | new login role `bc_admin_executor` | cannot log in to the API as a user; no table privileges; not a member of any privileged role |
| 7 | grant: `USAGE` on schema + `EXECUTE` on 28 named functions to that role | the only new capability, and it is reachable only by that role |

**Explicitly not changed:** `public.*` tables and their 10 RLS policies, guest
SELECT policies, the four existing migrations, `auth` schema, any existing role
membership, any default privilege on `public`, Auth configuration, Vercel
Production, `main`.

**Security review findings that must stay in the record**

1. `SECURITY DEFINER` functions are owned by the migration role (the dashboard
   `postgres`). That role is **not** superuser and **not** `BYPASSRLS`, but it
   owns every table in `public`. Ownership is a real privilege: these functions
   must be treated as fully trusted code. `POSTGRES`-owned definers are normal in
   Supabase, but it is a documented residual risk.
2. `authenticated` must **never** receive EXECUTE. The functions trust
   `auth.jwt()` request GUCs, which PostgREST only sets from a verified JWT — but
   a SQL-capable `authenticated` session could set them itself. `authenticated`
   today has no INSERT/UPDATE/DELETE and no `bc_admin_v1` USAGE, so it stays
   non-exploitable as long as no client grant is added. `tests/admin-privilege-review`
   and `test:admin-postgres-local` both assert this.
3. `authenticated` holds `TRIGGER` and `TEMP` on `public` (pre-existing, reported
   earlier). This approval does **not** change it, and the Admin design does not
   depend on it.
4. Rate limiting and login handoffs are stored in the Admin schema; growth is not
   automatically pruned. A cleanup job (delete rows older than 1 day) is
   recommended but not created here.

---

## 2. Is the dedicated limited login actually required? — Yes

The backend runs as a Vercel function. It needs a credential that can *only* call
the reviewed functions. Alternatives considered and rejected:

| Option | Why rejected |
|---|---|
| Use the `service_role` key over PostgREST | `service_role` is `BYPASSRLS` with write access to every `public` table. A leak = full database takeover. Violates least privilege and your "no weakening" rule. |
| Use `postgres` / DB password | Owner of every public table; same objection, larger blast radius. |
| No database at all (UI only) | Cannot deliver CRUD/analytics/audit. |
| **Dedicated `bc_admin_executor`** | Selected. No table grant, no schema CREATE, no role membership, EXECUTE on exactly 25 functions, and the server additionally refuses to start if the connected role is privileged (`assertLimitedRole`). |

Creation is `CREATE ROLE ... LOGIN PASSWORD` + `GRANT USAGE` + 25 `GRANT EXECUTE`.
The password never appears in this repository, in `VITE_*` variables or in chat;
it goes straight into Vercel Preview env vars.

---

## 3. Auth configuration — separate, also needs your decision

Real sign-in is currently impossible regardless of the schema, because:

| Setting | Now | Needed for Admin |
|---|---|---|
| `site_url` | `http://localhost:3000` | `https://<preview-origin>` |
| redirect allow-list | empty | include `https://<preview-origin>/admin/recovery` |
| email signup | **enabled** | disable (Admin-only project) or keep + rely on membership checks |
| password min length | 6 | ≥ 12 |
| `security_update_password_require_reauthentication` | false | true |
| SMTP | not configured | required for recovery e-mail |

Changing these affects the Production-connected project, so they are proposed,
not applied. TOTP is already enabled (`mfa_totp_enroll_enabled`,
`mfa_totp_verify_enabled`).

---

## 4. Super Admin provisioning (no self-service bootstrap by design)

Run **after** approval, in this order:

1. **Create the user** (Supabase Dashboard → Authentication → Users → *Add user*).
   Use the owner's real e-mail, *Auto Confirm User*, and a unique strong password.
   Copy the user UUID.
2. **Enrol TOTP** — first sign-in at `https://<origin>/admin/login`. Because the
   account has a password but no verified factor yet, the server answers the
   password step with `enrolment: true` and the UI shows a one-time setup key.
   Enter it in an authenticator app, then the 6-digit code; that call is gated by
   `bc_admin_v1.enrolment_eligible(uuid)` (enabled membership + role + live
   provider session, audited), and only then is an Admin session issued. The
   factor must show `verified` before the account can be used. Step 3
   (membership) must therefore be run **before** the first browser sign-in.

   Note the ordering: create the user (1), grant membership (3) and only then
   enrol (2). Enrolment deliberately refuses an account with no membership, so
   nothing can be enrolled by an uninvited user.
3. **Grant membership + role** (SQL Editor, exact statements):

   ```sql
   insert into bc_admin_v1.admin_users (id, enabled) values ('<USER-UUID>', true);
   insert into bc_admin_v1.admin_user_roles (user_id, role_id)
     values ('<USER-UUID>', 'super_admin');
   -- optional, audited by the application on first use; no audit row is forged here
   insert into bc_admin_v1.admin_audit_logs(actor_id, request_id, action, target_type, target_id)
     values (null, gen_random_uuid(), 'staff.bootstrap', 'staff', '<USER-UUID>');
   ```
4. **Verify** with `select * from bc_admin_v1.list_staff(10, null);` — returns one
   enabled user with `{super_admin}` once called through an authenticated session.

There is no endpoint that creates the first administrator, so a compromised
browser cannot escalate itself.

---

## 5. Rollback

| Level | Action | Effect |
|---|---|---|
| Instant off-switch | remove `ADMIN_BACKEND_ENABLED` in Vercel (Preview) | every `/api/admin/*` request returns 503; no database access |
| Revoke executor | `REVOKE ALL ON FUNCTION ... FROM bc_admin_executor;` (the 28 listed) | backend loses all capability; grants are the only path |
| Drop executor | `DROP OWNED BY bc_admin_executor; DROP ROLE bc_admin_executor;` | removes remaining privileges |
| Full removal | `admin-backend/rollback/010→001` in reverse order | drops only `bc_admin_v1` objects; refuses if any Admin table holds rows; never touches `public`/`auth` |

The rollback scripts were executed in the disposable PostgreSQL 17.11 fixture
(`test:admin-isolated-foundation`, `test:admin-postgres-local`) and reproduce a
clean reinstall.

---

## 6. Exact SQL

Each script is reproduced in full below (fenced), followed by its SHA-256 so you
can confirm the file you review is exactly what would execute. These are the same
bytes that passed the disposable PostgreSQL 17.11 suites.

### 6a. Exact permission changes (the only new capability)

```sql
-- Run as the dashboard postgres role, one transaction.
begin;
create role bc_admin_executor login password '<generated-64-char-secret>'
  nosuperuser nocreatedb nocreaterole noreplication nobypassrls inherit;
revoke all on schema bc_admin_v1 from bc_admin_executor;      -- implicit, explicit
grant usage on schema bc_admin_v1 to bc_admin_executor;
grant execute on function
  bc_admin_v1.require_actor(text),
  bc_admin_v1.open_admin_session(uuid),
  bc_admin_v1.revoke_admin_session(uuid),
  bc_admin_v1.revoke_my_sessions(uuid),
  bc_admin_v1.create_bio_draft(text,jsonb,uuid),
  bc_admin_v1.update_bio_draft(uuid,bigint,jsonb,uuid),
  bc_admin_v1.get_bio_draft(uuid),
  bc_admin_v1.submit_draft(uuid,bigint,uuid,uuid),
  bc_admin_v1.review_draft(uuid,bigint,boolean,uuid),
  bc_admin_v1.list_my_bio_drafts(integer,timestamptz,uuid),
  bc_admin_v1.list_bio_review_queue(integer,timestamptz,uuid),
  bc_admin_v1.list_staff(integer,uuid),
  bc_admin_v1.update_staff(uuid,bigint,boolean,text[],uuid),
  bc_admin_v1.list_platforms(integer,uuid),
  bc_admin_v1.list_categories(integer,uuid),
  bc_admin_v1.list_collections(integer,text),
  bc_admin_v1.list_generators(integer,uuid),
  bc_admin_v1.list_seo_pages(integer,uuid),
  bc_admin_v1.analytics_overview(),
  bc_admin_v1.list_settings(integer,text),
  bc_admin_v1.update_setting(text,jsonb,bigint,uuid),
  bc_admin_v1.list_role_catalog(),
  bc_admin_v1.list_my_sessions(integer,timestamptz),
  bc_admin_v1.list_audit_logs(integer,bigint),
  bc_admin_v1.store_login_flow(bytea,bytea,integer),
  bc_admin_v1.take_login_flow(bytea),
  bc_admin_v1.consume_rate_limit(text,bytea),
  bc_admin_v1.enrolment_eligible(uuid)
to bc_admin_executor;
-- No table, sequence, column or schema-CREATE privilege is granted.
commit;
```

28 of the 31 functions are granted; `guard_draft`, `guard_approval` and
`reject_mutation` are trigger bodies, are never called by the server, and get no
grant at all.

`require_actor(text)` is granted because the server calls it once per write as a
defence-in-depth check before the operation's own function; every function also
re-checks internally, so removing the grant would not widen access.



- `admin-backend/migrations/001_admin_foundation.sql` — `54d52c1f1d74cf492f431ee46f761313beefd6493e4ff2e918cde97ebb7c7db7`
- `admin-backend/migrations/002_workflow_integrity.sql` — `b23d6e9519ccd5ab4cecf9cbe27c8903a6d6a84ae74b7006fce3e3b08383b822`
- `admin-backend/migrations/003_permission_catalog.sql` — `37a839dc250d3a51622355e9cc03646d4e39ebeb821922d8117bffa2d5e6c3cb`
- `admin-backend/migrations/004_private_draft_commands.sql` — `554631e23e6497ee6db5ce96d37d773f127eccc6054fd4b22ee4f5b2c48ef3fa`
- `admin-backend/migrations/005_session_commands.sql` — `3b08b1446791796949fdbc61123f6b5ba59473dac79f2530261b23ed269899cb`
- `admin-backend/migrations/006_auth_controls.sql` — `d4e20279bd722c2ff694bffbfde8897d63dda2235e088119457bbbf0a0b88adb`
- `admin-backend/migrations/007_staff_commands.sql` — `d04c19d37acd213229a8f3088871fc51ae9b2f0b36602e40081437c8ef0b512d`
- `admin-backend/migrations/008_bio_edit.sql` — `a4b594c7d3479fad588c026d21a11abe037bf2e4970fd97e8449674bf895c652`
- `admin-backend/migrations/009_recovery_sessions.sql` — `7851eb4f03d97fbcdcd7f62cb00b54437233a2a064f12a911bd5d530b5c5a30b`
- `admin-backend/migrations/010_admin_module_commands.sql` — `5ac31357267a496759aa47b6838baf6ec755ae95c8dd06d0a2616529c775023b`
- `admin-backend/migrations/011_totp_enrolment.sql` — `4507ed36f5571c92e0d85f1ca017809997be760a05693d5c6306b5f0939ddb21`
- `admin-backend/rollback/001_admin_foundation.sql` — `98b80fd0cd9d0bc3cc1e87da1352a27f29771fd5dd8016d84744dffe9bda1a77`
- `admin-backend/rollback/002_workflow_integrity.sql` — `9a8b79d9fda725b9efda3cc052aab246dbcf5a5336d84ea8a692733b422b1097`
- `admin-backend/rollback/003_permission_catalog.sql` — `2d589421922666f3bd93f0c3b0a6bb6f87f77a91c9c3c620f27f0df37f0c20d1`
- `admin-backend/rollback/004_private_draft_commands.sql` — `59479d8343d2d85f7e64b9541451abed955f19d8abba95cac49723cfc718f625`
- `admin-backend/rollback/005_session_commands.sql` — `14007468a63d0e99d5f4958d42f52b1c8653c83b310312741ea4072ef0ddb822`
- `admin-backend/rollback/006_auth_controls.sql` — `50994d3db55adc9f6c96ed9db64d4468a9ccbb40a4b29955f135b78860906dec`
- `admin-backend/rollback/007_staff_commands.sql` — `65f6473b705669f5d053f4901f41d4b5ba38948eb8cd2b9e3f536ae50e7d1d8a`
- `admin-backend/rollback/008_bio_edit.sql` — `d788af5f302c37b0758536a88387a53f9f47b849de40fe46bb5f031b0d04b0ad`
- `admin-backend/rollback/009_recovery_sessions.sql` — `8297b2e082d5e82a034274ba336bc1efb1d06b7502c33cbdc5a18405d2cc0ffa`
- `admin-backend/rollback/010_admin_module_commands.sql` — `6b08e5d5895f11322e618a1aecd25ae7ff8600055d74a874964e07098c213e04`
- `admin-backend/rollback/011_totp_enrolment.sql` — `89f59839ee62c9a5cf9436d8cf6a617f2878fb37cbcd701994d13db0d84ce980`

---

### 6b. Enrolment gate semantics (011)

`bc_admin_v1.enrolment_eligible(uuid)` is the only function callable before a
second factor exists. It returns a boolean rather than raising, so that the
**denied attempt is still audited** (a raise would roll the audit row back).
Consequences that the server must — and does — enforce:

- the database adapter passes the trusted identity's `aal` claim and treats
  anything other than `[{eligible:true}]` as `403 FORBIDDEN`;
- a missing row, `false`, or a thrown error all deny; no code path treats a
  blank result as success;
- the check requires enabled membership, at least one role, and a live
  `auth.sessions` row for that user and session id;
- every attempt writes one `admin_audit_logs` row (`auth.enrolment_attempt`)
  with only `{eligible: <bool>}` — no tokens, no secrets, no email;
- the TOTP secret is never returned by the API after confirmation, and the
  otpauth URI is returned exactly once to the enrolling browser.

---

## 7. Full SQL (exact bytes to be executed)

### `001_admin_foundation.sql`

```sql
-- ISOLATED ADMIN DATABASE ONLY. Never apply to the existing public project.
-- Candidate migration: local synthetic tests only; independent security and
-- provider-specific ownership/default-ACL review required before deployment.
-- No client API, privileges, user accounts, or publication capability are created.
begin;
create schema bc_admin_v1;
revoke all on schema bc_admin_v1 from public, anon, authenticated;
-- Applies only to the executing creator role. Other creators require separate ACLs.
-- Per-schema revokes cannot remove the global default PUBLIC EXECUTE on new
-- functions. Every future function must explicitly revoke EXECUTE in the same
-- transaction; verify global and per-schema effective default ACLs. Do not
-- change global defaults on the shared project without separate approval.
alter default privileges in schema bc_admin_v1 revoke all on tables from public, anon, authenticated;
alter default privileges in schema bc_admin_v1 revoke all on sequences from public, anon, authenticated;
alter default privileges in schema bc_admin_v1 revoke execute on functions from public, anon, authenticated;

create table bc_admin_v1.admin_users (
 id uuid primary key references auth.users(id) on delete restrict,
 enabled boolean not null default false,
 version bigint not null default 1 check(version > 0),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 disabled_at timestamptz,
 check (enabled = false or disabled_at is null)
);
create table bc_admin_v1.admin_roles (
 id text primary key check(id in ('super_admin','admin','content_manager','editor','seo_manager','analyst','moderator','auditor')),
 description text not null check(length(description) between 1 and 200)
);
create table bc_admin_v1.admin_permissions (
 id text primary key check(id ~ '^[a-z][a-z0-9_.]{1,99}$'),
 description text not null check(length(description) between 1 and 200)
);
create table bc_admin_v1.admin_role_permissions (
 role_id text not null references bc_admin_v1.admin_roles(id) on delete restrict,
 permission_id text not null references bc_admin_v1.admin_permissions(id) on delete restrict,
 primary key(role_id,permission_id)
);
create table bc_admin_v1.admin_user_roles (
 user_id uuid not null references bc_admin_v1.admin_users(id) on delete restrict,
 role_id text not null references bc_admin_v1.admin_roles(id) on delete restrict,
 assigned_at timestamptz not null default now(),
 assigned_by uuid references bc_admin_v1.admin_users(id) on delete restrict,
 primary key(user_id,role_id)
);
create table bc_admin_v1.admin_sessions (
 id uuid primary key,
 user_id uuid not null references bc_admin_v1.admin_users(id) on delete restrict,
 created_at timestamptz not null default now(),
 expires_at timestamptz not null,
 revoked_at timestamptz,
 -- This field is evidence storage only; it must not be populated from a client claim.
 verified_mfa_at timestamptz,
 check(expires_at > created_at),
 check(revoked_at is null or revoked_at >= created_at),
 check(verified_mfa_at is null or verified_mfa_at >= created_at)
);
create index admin_sessions_user_idx on bc_admin_v1.admin_sessions(user_id,expires_at desc);
create table bc_admin_v1.admin_audit_logs (
 id bigint generated always as identity primary key,
 actor_id uuid references bc_admin_v1.admin_users(id) on delete restrict,
 request_id uuid not null,
 action text not null check(length(action) between 1 and 100),
 target_type text not null check(length(target_type) between 1 and 100),
 target_id text not null check(length(target_id) between 1 and 200),
 occurred_at timestamptz not null default now(),
 details jsonb not null default '{}'::jsonb check(jsonb_typeof(details)='object' and pg_column_size(details)<=4096)
);
create index admin_audit_time_idx on bc_admin_v1.admin_audit_logs(occurred_at desc,id desc);
create table bc_admin_v1.admin_settings (
 key text primary key check(key ~ '^[a-z][a-z0-9_.-]{0,99}$'),
 value jsonb not null check(pg_column_size(value)<=16384),
 version bigint not null default 1 check(version>0),
 updated_at timestamptz not null default now(),
 updated_by uuid references bc_admin_v1.admin_users(id) on delete restrict
);
create table bc_admin_v1.admin_content_versions (
 id uuid primary key default gen_random_uuid(),
 resource_type text not null check(resource_type in ('bio','category','collection','platform','generator','seo','setting')),
 resource_key text not null check(length(resource_key) between 1 and 200),
 version_number bigint not null check(version_number>0),
 payload jsonb not null check(jsonb_typeof(payload)='object' and pg_column_size(payload)<=262144),
 payload_sha256 bytea not null check(octet_length(payload_sha256)=32),
 created_by uuid not null references bc_admin_v1.admin_users(id) on delete restrict,
 created_at timestamptz not null default now(),
 unique(resource_type,resource_key,version_number)
);
create table bc_admin_v1.admin_drafts (
 id uuid primary key default gen_random_uuid(),
 version_id uuid not null unique references bc_admin_v1.admin_content_versions(id) on delete restrict,
 author_id uuid not null references bc_admin_v1.admin_users(id) on delete restrict,
 assigned_reviewer_id uuid references bc_admin_v1.admin_users(id) on delete restrict,
 state text not null default 'draft' check(state in ('draft','in_review','approved','rejected','queued','published')),
 row_version bigint not null default 1 check(row_version>0),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 check(assigned_reviewer_id is null or assigned_reviewer_id <> author_id)
);
create index admin_drafts_state_idx on bc_admin_v1.admin_drafts(state,updated_at desc,id);
create table bc_admin_v1.admin_approvals (
 id uuid primary key default gen_random_uuid(),
 draft_id uuid not null references bc_admin_v1.admin_drafts(id) on delete restrict,
 reviewer_id uuid not null references bc_admin_v1.admin_users(id) on delete restrict,
 decision text not null check(decision in ('approved','rejected')),
 reason_code text check(reason_code is null or reason_code ~ '^[a-z0-9_.-]{1,80}$'),
 created_at timestamptz not null default now()
);
create index admin_approvals_draft_idx on bc_admin_v1.admin_approvals(draft_id,created_at desc);
create table bc_admin_v1.admin_publication_jobs (
 id uuid primary key default gen_random_uuid(),
 draft_id uuid not null references bc_admin_v1.admin_drafts(id) on delete restrict,
 target_environment text not null check(target_environment in ('synthetic_preview','production')),
 state text not null default 'queued' check(state in ('queued','running','succeeded','failed','cancelled')),
 request_hash bytea not null check(octet_length(request_hash)=32),
 scheduled_at timestamptz not null,
 created_at timestamptz not null default now(),
 completed_at timestamptz,
 check ((state in ('succeeded','failed','cancelled')) = (completed_at is not null))
);
create index admin_jobs_state_schedule_idx on bc_admin_v1.admin_publication_jobs(state,scheduled_at,id);
create table bc_admin_v1.admin_notifications (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references bc_admin_v1.admin_users(id) on delete restrict,
 category text not null check(category ~ '^[a-z][a-z0-9_.-]{0,79}$'),
 message text not null check(length(message) between 1 and 1000),
 created_at timestamptz not null default now(), read_at timestamptz,
 check(read_at is null or read_at>=created_at)
);
create index admin_notifications_user_idx on bc_admin_v1.admin_notifications(user_id,created_at desc,id);
create table bc_admin_v1.admin_backup_records (
 id uuid primary key default gen_random_uuid(),
 environment text not null check(environment in ('synthetic_preview','production')),
 provider_reference text not null check(length(provider_reference) between 1 and 200),
 state text not null check(state in ('requested','completed','failed','restore_verified')),
 requested_at timestamptz not null default now(), verified_at timestamptz,
 check(state <> 'restore_verified' or verified_at is not null)
);
create table bc_admin_v1.admin_security_events (
 id bigint generated always as identity primary key,
 event_type text not null check(event_type ~ '^[a-z][a-z0-9_.-]{0,99}$'),
 request_id uuid, occurred_at timestamptz not null default now(),
 details jsonb not null default '{}'::jsonb check(jsonb_typeof(details)='object' and pg_column_size(details)<=4096)
);
create index admin_security_time_idx on bc_admin_v1.admin_security_events(occurred_at desc,id desc);

-- Immutable versions and audit/security evidence for ordinary database users.
-- Owners, superusers and BYPASSRLS remain privileged; external retention needed.
create function bc_admin_v1.reject_mutation() returns trigger
language plpgsql set search_path = pg_catalog as $$
begin raise exception 'append-only relation' using errcode='23514'; end $$;
create trigger content_no_change before update or delete on bc_admin_v1.admin_content_versions for each row execute function bc_admin_v1.reject_mutation();
create trigger content_no_truncate before truncate on bc_admin_v1.admin_content_versions for each statement execute function bc_admin_v1.reject_mutation();
create trigger approval_no_change before update or delete on bc_admin_v1.admin_approvals for each row execute function bc_admin_v1.reject_mutation();
create trigger approval_no_truncate before truncate on bc_admin_v1.admin_approvals for each statement execute function bc_admin_v1.reject_mutation();
create trigger audit_no_change before update or delete on bc_admin_v1.admin_audit_logs for each row execute function bc_admin_v1.reject_mutation();
create trigger audit_no_truncate before truncate on bc_admin_v1.admin_audit_logs for each statement execute function bc_admin_v1.reject_mutation();
create trigger security_no_change before update or delete on bc_admin_v1.admin_security_events for each row execute function bc_admin_v1.reject_mutation();
create trigger security_no_truncate before truncate on bc_admin_v1.admin_security_events for each statement execute function bc_admin_v1.reject_mutation();

-- No permissive policies, no client grants. Restrictive denial adds defense in
-- depth if a future permissive policy is accidentally introduced for clients.
do $$
declare r record;
begin
 for r in select tablename from pg_catalog.pg_tables where schemaname='bc_admin_v1' loop
  execute format('alter table bc_admin_v1.%I enable row level security',r.tablename);
  execute format('create policy deny_clients on bc_admin_v1.%I as restrictive for all to anon, authenticated using (false) with check (false)',r.tablename);
 end loop;
end $$;
revoke all on all tables in schema bc_admin_v1 from public, anon, authenticated;
revoke all on all sequences in schema bc_admin_v1 from public, anon, authenticated;
revoke all on all functions in schema bc_admin_v1 from public, anon, authenticated;
commit;
```

### `002_workflow_integrity.sql`

```sql
-- ISOLATED ADMIN DATABASE ONLY. Candidate integrity guards; no authorization,
-- identity verification, permission enforcement, audit commands or API grants.
-- Do not deploy until independently reviewed and provider-tested.
begin;
alter table bc_admin_v1.admin_approvals add constraint one_decision_per_draft unique(draft_id);
create function bc_admin_v1.guard_approval() returns trigger
language plpgsql set search_path=pg_catalog as $$
declare d bc_admin_v1.admin_drafts%rowtype;
begin
 select * into d from bc_admin_v1.admin_drafts where id=new.draft_id for update;
 if not found or d.state <> 'in_review' or d.author_id=new.reviewer_id
    or d.assigned_reviewer_id is distinct from new.reviewer_id
    or not exists (select 1 from bc_admin_v1.admin_users u where u.id=new.reviewer_id and u.enabled) then
  raise exception 'invalid reviewer or draft state' using errcode='23514';
 end if;
 return new;
end $$;
create trigger approval_guard before insert on bc_admin_v1.admin_approvals
 for each row execute function bc_admin_v1.guard_approval();
create function bc_admin_v1.guard_draft() returns trigger
language plpgsql set search_path=pg_catalog as $$
declare author uuid; decision text; old_kind text; old_key text; new_kind text; new_key text;
begin
 if tg_op='DELETE' then raise exception 'drafts cannot be deleted' using errcode='23514'; end if;
 select created_by into author from bc_admin_v1.admin_content_versions where id=new.version_id;
 if author is distinct from new.author_id then raise exception 'version author mismatch' using errcode='23514'; end if;
 if tg_op='INSERT' then
  if new.state <> 'draft' or new.row_version <> 1 then raise exception 'must start as draft' using errcode='23514'; end if;
  return new;
 end if;
 if new.id is distinct from old.id or new.author_id is distinct from old.author_id
    or new.created_at is distinct from old.created_at or new.row_version <> old.row_version+1 then
  raise exception 'invalid draft identity or version' using errcode='23514';
 end if;
 if old.state='draft' and new.state in ('draft','in_review') then
  select resource_type,resource_key into old_kind,old_key from bc_admin_v1.admin_content_versions where id=old.version_id;
  select resource_type,resource_key into new_kind,new_key from bc_admin_v1.admin_content_versions where id=new.version_id;
  if new_kind is distinct from old_kind or new_key is distinct from old_key then
   raise exception 'draft resource cannot change' using errcode='23514'; end if;
  if new.state='in_review' and new.assigned_reviewer_id is null then raise exception 'reviewer required' using errcode='23514'; end if;
 elsif old.state='in_review' and new.state in ('approved','rejected') then
  if new.version_id is distinct from old.version_id or new.assigned_reviewer_id is distinct from old.assigned_reviewer_id then
   raise exception 'reviewed version must not change' using errcode='23514'; end if;
  select a.decision into decision from bc_admin_v1.admin_approvals a
    where a.draft_id=old.id and a.reviewer_id=old.assigned_reviewer_id;
  if decision is distinct from new.state then raise exception 'matching decision required' using errcode='23514'; end if;
 else
  -- No transition to queued/published until a separately reviewed bridge exists.
  raise exception 'invalid or unavailable transition' using errcode='23514';
 end if;
 return new;
end $$;
create trigger draft_guard before insert or update or delete on bc_admin_v1.admin_drafts
 for each row execute function bc_admin_v1.guard_draft();
revoke all on function bc_admin_v1.guard_approval(), bc_admin_v1.guard_draft() from public,anon,authenticated;
commit;
```

### `003_permission_catalog.sql`

```sql
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
```

### `004_private_draft_commands.sql`

```sql
-- LOCAL SYNTHETIC FIXTURES ONLY. NOT APPROVED FOR SHARED PROJECT EXECUTION.
-- Depends on 001,002,003 and trusted Supabase request identity context.
-- No client EXECUTE grants or public APIs; no user/session bootstrap, login,
-- publish, or permission/role changes. SECURITY DEFINER owner is the migration
-- executor until a reviewed dedicated owner is configured. auth.uid()/auth.jwt()
-- are safe only when the request context is verified by an authenticated gateway;
-- a SQL-capable caller can spoof request GUCs. Do not expose these functions.
begin;
create function bc_admin_v1.require_actor(p_permission text) returns uuid
language plpgsql security definer set search_path=pg_catalog as $$
declare uid uuid; sid uuid;
begin
 uid := auth.uid();
 begin sid := (auth.jwt()->>'session_id')::uuid;
 exception when invalid_text_representation then raise exception 'not authorized' using errcode='42501'; end;
 if uid is null or sid is null or coalesce(auth.jwt()->>'aal','') <> 'aal2' then
  raise exception 'not authorized' using errcode='42501';
 end if;
 -- All future membership/role update operations must take this same user lock.
 perform 1 from bc_admin_v1.admin_users u where u.id=uid and u.enabled for update;
 if not found then raise exception 'not authorized' using errcode='42501'; end if;
 perform 1 from bc_admin_v1.admin_sessions s where s.id=sid and s.user_id=uid and s.revoked_at is null and s.expires_at > now() for update;
 if not found or not exists (select 1 from auth.sessions ps where ps.id=sid and ps.user_id=uid) or not exists (
  select 1 from bc_admin_v1.admin_user_roles ur join bc_admin_v1.admin_role_permissions rp on rp.role_id=ur.role_id
  where ur.user_id=uid and rp.permission_id=p_permission
 ) then raise exception 'not authorized' using errcode='42501'; end if;
 return uid;
end $$;

-- v1 content is a private draft only; no publication into public.bios exists.
-- Platform limits and user-facing adapter integration remain separate gates.
create function bc_admin_v1.create_bio_draft(p_key text,p_payload jsonb,p_request_id uuid) returns uuid
language plpgsql security definer set search_path=pg_catalog as $$
declare actor uuid; vid uuid; did uuid; version_no bigint; cnt integer;
begin
 actor := bc_admin_v1.require_actor('content.draft');
 if p_request_id is null or p_key is null or p_key !~ '^[a-z0-9][a-z0-9_-]{0,99}$'
    or p_payload is null or jsonb_typeof(p_payload) <> 'object' then
  raise exception 'invalid draft' using errcode='22023';
 end if;
 select count(*) into cnt from jsonb_object_keys(p_payload);
 if cnt <> 5 or not (p_payload ?& array['content','language','platform','active','featured'])
    or jsonb_typeof(p_payload->'content') is distinct from 'string'
    or length(btrim(p_payload->>'content'))=0 or octet_length(p_payload->>'content')>12000
    or jsonb_typeof(p_payload->'language') is distinct from 'string' or p_payload->>'language' not in ('en','hi','hg')
    or jsonb_typeof(p_payload->'platform') is distinct from 'string' or p_payload->>'platform' !~ '^[a-z][a-z0-9_-]{0,49}$'
    or jsonb_typeof(p_payload->'active') is distinct from 'boolean'
    or jsonb_typeof(p_payload->'featured') is distinct from 'boolean' then
  raise exception 'invalid bio fields' using errcode='22023';
 end if;
 -- Serialize version allocation for the same logical key within this database.
 perform pg_advisory_xact_lock(hashtextextended('bc_admin_v1:bio:' || p_key,0));
 select coalesce(max(version_number),0)+1 into version_no from bc_admin_v1.admin_content_versions
  where resource_type='bio' and resource_key=p_key;
 insert into bc_admin_v1.admin_content_versions(resource_type,resource_key,version_number,payload,payload_sha256,created_by)
 values('bio',p_key,version_no,p_payload,sha256(convert_to(p_payload::text,'UTF8')),actor) returning id into vid;
 insert into bc_admin_v1.admin_drafts(version_id,author_id) values(vid,actor) returning id into did;
 insert into bc_admin_v1.admin_audit_logs(actor_id,request_id,action,target_type,target_id)
 values(actor,p_request_id,'draft.create','draft',did::text);
 return did;
end $$;
create function bc_admin_v1.submit_draft(p_draft uuid,p_expected bigint,p_reviewer uuid,p_request_id uuid) returns void
language plpgsql security definer set search_path=pg_catalog as $$
declare actor uuid; d bc_admin_v1.admin_drafts%rowtype;
begin
 actor:=bc_admin_v1.require_actor('content.draft');
 if p_request_id is null then raise exception 'invalid request' using errcode='22023'; end if;
 select * into d from bc_admin_v1.admin_drafts where id=p_draft for update;
 if not found or d.author_id<>actor or d.state<>'draft' then raise exception 'not authorized' using errcode='42501'; end if;
 if p_expected is null or d.row_version<>p_expected then raise exception 'stale version' using errcode='40001'; end if;
 if p_reviewer is null or p_reviewer=actor or not exists(select 1 from bc_admin_v1.admin_users where id=p_reviewer and enabled) then
  raise exception 'invalid reviewer' using errcode='22023'; end if;
 update bc_admin_v1.admin_drafts set assigned_reviewer_id=p_reviewer,state='in_review',row_version=row_version+1,updated_at=now() where id=p_draft;
 insert into bc_admin_v1.admin_audit_logs(actor_id,request_id,action,target_type,target_id) values(actor,p_request_id,'draft.submit','draft',p_draft::text);
end $$;
create function bc_admin_v1.review_draft(p_draft uuid,p_expected bigint,p_approve boolean,p_request_id uuid) returns void
language plpgsql security definer set search_path=pg_catalog as $$
declare actor uuid; d bc_admin_v1.admin_drafts%rowtype; result text;
begin
 if p_approve is null or p_request_id is null then raise exception 'invalid request' using errcode='22023'; end if;
 actor:=bc_admin_v1.require_actor(case when p_approve then 'content.review' else 'content.reject' end);
 select * into d from bc_admin_v1.admin_drafts where id=p_draft for update;
 if not found or d.state<>'in_review' or d.author_id=actor or d.assigned_reviewer_id<>actor then
  raise exception 'not authorized' using errcode='42501'; end if;
 if p_expected is null or d.row_version<>p_expected then raise exception 'stale version' using errcode='40001'; end if;
 result := case when p_approve then 'approved' else 'rejected' end;
 insert into bc_admin_v1.admin_approvals(draft_id,reviewer_id,decision) values(p_draft,actor,result);
 update bc_admin_v1.admin_drafts set state=result,row_version=row_version+1,updated_at=now() where id=p_draft;
 insert into bc_admin_v1.admin_audit_logs(actor_id,request_id,action,target_type,target_id) values(actor,p_request_id,'draft.'||result,'draft',p_draft::text);
end $$;
-- Keyset pages contain only the caller's own bio drafts. Each page is a fresh
-- read, not a snapshot. This function is not granted to client roles.
create function bc_admin_v1.list_my_bio_drafts(p_limit integer,p_before_time timestamptz,p_before_id uuid)
returns table(draft_id uuid,resource_key text,state text,row_version bigint,created_at timestamptz,payload jsonb)
language plpgsql security definer set search_path=pg_catalog as $$
declare actor uuid;
begin
 actor:=bc_admin_v1.require_actor('content.read');
 if p_limit is null or p_limit<1 or p_limit>100 or (p_before_time is null) <> (p_before_id is null) then
  raise exception 'invalid page' using errcode='22023'; end if;
 return query select d.id,v.resource_key,d.state,d.row_version,d.created_at,v.payload
 from bc_admin_v1.admin_drafts d join bc_admin_v1.admin_content_versions v on v.id=d.version_id
 where d.author_id=actor and v.resource_type='bio'
   and (p_before_time is null or (d.created_at,d.id)<(p_before_time,p_before_id))
 order by d.created_at desc,d.id desc limit p_limit;
end $$;
revoke all on function bc_admin_v1.require_actor(text),bc_admin_v1.create_bio_draft(text,jsonb,uuid),bc_admin_v1.submit_draft(uuid,bigint,uuid,uuid),bc_admin_v1.review_draft(uuid,bigint,boolean,uuid),bc_admin_v1.list_my_bio_drafts(integer,timestamptz,uuid) from public,anon,authenticated;
commit;
```

### `005_session_commands.sql`

```sql
-- LOCAL SYNTHETIC FIXTURES ONLY. NOT APPROVED FOR SHARED PROJECT EXECUTION.
-- Requires reviewed server-only gateway/SQL roles and confirmed provider
-- auth.sessions semantics/privileges. No client EXECUTE grants. No bootstrap.
begin;
create function bc_admin_v1.open_admin_session(p_request_id uuid) returns timestamptz
language plpgsql security definer set search_path=pg_catalog as $$
declare uid uuid; sid uuid; expiry timestamptz; inserted boolean;
begin
 uid:=auth.uid();
 begin sid:=(auth.jwt()->>'session_id')::uuid;
 exception when invalid_text_representation then raise exception 'not authorized' using errcode='42501'; end;
 if uid is null or sid is null or p_request_id is null or coalesce(auth.jwt()->>'aal','')<>'aal2' then
  raise exception 'not authorized' using errcode='42501'; end if;
 perform 1 from bc_admin_v1.admin_users where id=uid and enabled for update;
 if not found or not exists(select 1 from bc_admin_v1.admin_user_roles where user_id=uid)
    or not exists(select 1 from auth.sessions where id=sid and user_id=uid) then
  raise exception 'not authorized' using errcode='42501'; end if;
 -- A revoked or expired Admin session can never be reopened under the same ID.
 -- Admin session lifetime is capped to one hour so it never outlives the
 -- provider access token (JWT exp 1h for this project). The provider session is
 -- re-verified on every request; this row only records the Admin-side grant.
 insert into bc_admin_v1.admin_sessions(id,user_id,expires_at) values(sid,uid,now()+interval '1 hour')
 on conflict(id) do nothing;
 inserted:=found;
 select least(s.expires_at,now()+interval '1 hour') into expiry from bc_admin_v1.admin_sessions s
  where s.id=sid and s.user_id=uid and s.revoked_at is null and s.expires_at>now() for update;
 if not found then raise exception 'not authorized' using errcode='42501'; end if;
 if inserted then
  insert into bc_admin_v1.admin_audit_logs(actor_id,request_id,action,target_type,target_id)
  values(uid,p_request_id,'session.open','session',sid::text);
 end if;
 return expiry;
end $$;
create function bc_admin_v1.revoke_admin_session(p_request_id uuid) returns void
language plpgsql security definer set search_path=pg_catalog as $$
declare uid uuid; sid uuid;
begin
 if p_request_id is null then raise exception 'invalid request' using errcode='22023'; end if;
 uid:=bc_admin_v1.require_actor('dashboard.read'); sid:=(auth.jwt()->>'session_id')::uuid;
 update bc_admin_v1.admin_sessions set revoked_at=now() where id=sid and user_id=uid and revoked_at is null;
 insert into bc_admin_v1.admin_audit_logs(actor_id,request_id,action,target_type,target_id)
 values(uid,p_request_id,'session.revoke','session',sid::text);
end $$;
revoke all on function bc_admin_v1.open_admin_session(uuid),bc_admin_v1.revoke_admin_session(uuid) from public,anon,authenticated;
commit;
```

### `006_auth_controls.sql`

```sql
-- LOCAL SYNTHETIC FIXTURES ONLY. No client grants, do not apply to shared DB.
-- Stores encrypted short-lived login handoffs and hashed rate-limit keys, never
-- passwords, raw tokens or raw IP addresses. Requires ingress limits and an
-- independently reviewed cleanup job before hosted use.
begin;
create table bc_admin_v1.admin_login_flows (
 flow_hash bytea primary key check(octet_length(flow_hash)=32),
 encrypted_data bytea not null check(octet_length(encrypted_data) between 29 and 8192),
 expires_at timestamptz not null
);
create index admin_login_flows_expiry_idx on bc_admin_v1.admin_login_flows(expires_at);
create table bc_admin_v1.admin_rate_limits (
 bucket text not null check(bucket in ('password-login','totp-verify','admin-api')),
 key_hash bytea not null check(octet_length(key_hash)=32),
 started_at timestamptz not null, attempts integer not null check(attempts>0),
 primary key(bucket,key_hash)
);
create index admin_rate_limits_time_idx on bc_admin_v1.admin_rate_limits(started_at);
alter table bc_admin_v1.admin_login_flows enable row level security;
alter table bc_admin_v1.admin_rate_limits enable row level security;
create policy deny_clients on bc_admin_v1.admin_login_flows as restrictive for all to anon,authenticated using(false) with check(false);
create policy deny_clients on bc_admin_v1.admin_rate_limits as restrictive for all to anon,authenticated using(false) with check(false);
revoke all on bc_admin_v1.admin_login_flows,bc_admin_v1.admin_rate_limits from public,anon,authenticated;
create function bc_admin_v1.store_login_flow(p_hash bytea,p_data bytea,p_ttl integer) returns void
language plpgsql security definer set search_path=pg_catalog as $$
begin
 if octet_length(p_hash) is distinct from 32 or octet_length(p_data) not between 29 and 8192 or p_ttl is null or p_ttl<1 or p_ttl>300 then
  raise exception 'invalid login flow' using errcode='22023'; end if;
 insert into bc_admin_v1.admin_login_flows(flow_hash,encrypted_data,expires_at) values(p_hash,p_data,now()+make_interval(secs=>p_ttl));
end $$;
create function bc_admin_v1.take_login_flow(p_hash bytea) returns bytea
language plpgsql security definer set search_path=pg_catalog as $$
declare result bytea;
begin
 if octet_length(p_hash) is distinct from 32 then raise exception 'invalid login flow' using errcode='22023'; end if;
 delete from bc_admin_v1.admin_login_flows where flow_hash=p_hash and expires_at>now() returning encrypted_data into result;
 return result;
end $$;
create function bc_admin_v1.consume_rate_limit(p_bucket text,p_hash bytea) returns boolean
language plpgsql security definer set search_path=pg_catalog as $$
declare cap integer; n integer;
begin
 if octet_length(p_hash) is distinct from 32 then raise exception 'invalid rate key' using errcode='22023'; end if;
 cap:=case p_bucket when 'password-login' then 5 when 'totp-verify' then 10 when 'admin-api' then 120 else null end;
 if cap is null then raise exception 'invalid bucket' using errcode='22023'; end if;
 insert into bc_admin_v1.admin_rate_limits(bucket,key_hash,started_at,attempts) values(p_bucket,p_hash,now(),1)
 on conflict(bucket,key_hash) do update set
 attempts=case when bc_admin_v1.admin_rate_limits.started_at<=now()-interval '1 minute' then 1 else bc_admin_v1.admin_rate_limits.attempts+1 end,
 started_at=case when bc_admin_v1.admin_rate_limits.started_at<=now()-interval '1 minute' then now() else bc_admin_v1.admin_rate_limits.started_at end
 returning attempts into n;
 return n<=cap;
end $$;
revoke all on function bc_admin_v1.store_login_flow(bytea,bytea,integer),bc_admin_v1.take_login_flow(bytea),bc_admin_v1.consume_rate_limit(text,bytea) from public,anon,authenticated;
commit;
```

### `007_staff_commands.sql`

```sql
-- LOCAL SYNTHETIC FIXTURES ONLY. No client grants. Not approved for shared DB.
-- Staff role updates use one advisory lock before membership-row locks. Any future
-- membership mutation must use the same locking discipline to enforce last-S.
begin;
create function bc_admin_v1.list_staff(p_limit integer,p_after uuid)
returns table(user_id uuid,enabled boolean,version bigint,roles text[])
language plpgsql security definer set search_path=pg_catalog as $$
declare actor uuid;
begin
 actor:=bc_admin_v1.require_actor('staff.read');
 if p_limit is null or p_limit<1 or p_limit>100 then raise exception 'invalid page' using errcode='22023'; end if;
 return query select u.id,u.enabled,u.version,coalesce(array_agg(ur.role_id order by ur.role_id) filter(where ur.role_id is not null),array[]::text[])
 from bc_admin_v1.admin_users u left join bc_admin_v1.admin_user_roles ur on ur.user_id=u.id
 where p_after is null or u.id>p_after group by u.id,u.enabled,u.version order by u.id limit p_limit;
end $$;
create function bc_admin_v1.update_staff(p_target uuid,p_version bigint,p_enabled boolean,p_roles text[],p_request uuid) returns bigint
language plpgsql security definer set search_path=pg_catalog as $$
declare actor uuid; member bc_admin_v1.admin_users%rowtype; was_super boolean; will_super boolean; super_count bigint;
begin
 perform pg_advisory_xact_lock(hashtextextended('bc_admin_v1:staff-role-mutations',0));
 actor:=bc_admin_v1.require_actor('staff.manage');
 if p_target is null or p_target=actor or p_request is null or p_version is null or p_enabled is null or p_roles is null
    or cardinality(p_roles)<1 or cardinality(p_roles)>8
    or exists(select 1 from unnest(p_roles) x where x is null or not exists(select 1 from bc_admin_v1.admin_roles where id=x))
    or (select count(distinct x) from unnest(p_roles) x)<>cardinality(p_roles) then
  raise exception 'invalid staff update' using errcode='22023'; end if;
 select * into member from bc_admin_v1.admin_users where id=p_target for update;
 if not found then raise exception 'not authorized' using errcode='42501'; end if;
 if member.version<>p_version then raise exception 'stale version' using errcode='40001'; end if;
 was_super:=exists(select 1 from bc_admin_v1.admin_user_roles where user_id=p_target and role_id='super_admin');
 will_super:='super_admin'=any(p_roles);
 -- S promotion is disabled until the separately reviewed two-person flow exists.
 if will_super and not was_super then raise exception 'super admin promotion unavailable' using errcode='42501'; end if;
 if was_super and member.enabled and (not will_super or not p_enabled) then
  select count(*) into super_count from bc_admin_v1.admin_users u join bc_admin_v1.admin_user_roles ur on ur.user_id=u.id
   where u.enabled and ur.role_id='super_admin';
  if super_count<=1 then raise exception 'last super admin' using errcode='23514'; end if;
 end if;
 update bc_admin_v1.admin_users set enabled=p_enabled,disabled_at=case when p_enabled then null else coalesce(disabled_at,now()) end,
  version=version+1,updated_at=now() where id=p_target;
 delete from bc_admin_v1.admin_user_roles where user_id=p_target;
 insert into bc_admin_v1.admin_user_roles(user_id,role_id,assigned_by) select p_target,x,actor from unnest(p_roles) x;
 insert into bc_admin_v1.admin_audit_logs(actor_id,request_id,action,target_type,target_id,details)
 values(actor,p_request,'staff.update','staff',p_target::text,jsonb_build_object('enabled',p_enabled,'roles',to_jsonb(p_roles),'version',member.version+1));
 return member.version+1;
end $$;
revoke all on function bc_admin_v1.list_staff(integer,uuid),bc_admin_v1.update_staff(uuid,bigint,boolean,text[],uuid) from public,anon,authenticated;
commit;
```

### `008_bio_edit.sql`

```sql
-- LOCAL DISPOSABLE FIXTURES ONLY; unapproved for the shared project.
-- Revision updates are private, optimistic and immutable; publication remains
-- unavailable. Platform-specific length enforcement remains at the gateway.
begin;
create function bc_admin_v1.update_bio_draft(p_draft uuid,p_expected bigint,p_payload jsonb,p_request uuid) returns bigint
language plpgsql security definer set search_path=pg_catalog as $$
declare actor uuid; d bc_admin_v1.admin_drafts%rowtype; old_version bc_admin_v1.admin_content_versions%rowtype;
 new_version uuid; version_number bigint; key_count integer;
begin
 actor:=bc_admin_v1.require_actor('content.draft');
 if p_draft is null or p_request is null or p_expected is null or p_payload is null or jsonb_typeof(p_payload)<>'object' then
  raise exception 'invalid update' using errcode='22023'; end if;
 select count(*) into key_count from jsonb_object_keys(p_payload);
 if key_count<>5 or not (p_payload ?& array['content','language','platform','active','featured'])
  or jsonb_typeof(p_payload->'content') is distinct from 'string' or length(btrim(p_payload->>'content'))=0 or octet_length(p_payload->>'content')>12000
  or jsonb_typeof(p_payload->'language') is distinct from 'string' or p_payload->>'language' not in ('en','hi','hg')
  or jsonb_typeof(p_payload->'platform') is distinct from 'string' or p_payload->>'platform' !~ '^[a-z][a-z0-9_-]{0,49}$'
  or jsonb_typeof(p_payload->'active') is distinct from 'boolean' or jsonb_typeof(p_payload->'featured') is distinct from 'boolean' then
  raise exception 'invalid bio fields' using errcode='22023'; end if;
 select * into d from bc_admin_v1.admin_drafts where id=p_draft for update;
 if not found or d.author_id<>actor or d.state<>'draft' then raise exception 'not authorized' using errcode='42501'; end if;
 if d.row_version<>p_expected then raise exception 'stale version' using errcode='40001'; end if;
 select * into old_version from bc_admin_v1.admin_content_versions where id=d.version_id;
 if old_version.resource_type<>'bio' then raise exception 'not authorized' using errcode='42501'; end if;
 perform pg_advisory_xact_lock(hashtextextended('bc_admin_v1:bio:'||old_version.resource_key,0));
 select coalesce(max(v.version_number),0)+1 into version_number from bc_admin_v1.admin_content_versions v
  where v.resource_type='bio' and v.resource_key=old_version.resource_key;
 insert into bc_admin_v1.admin_content_versions(resource_type,resource_key,version_number,payload,payload_sha256,created_by)
 values('bio',old_version.resource_key,version_number,p_payload,sha256(convert_to(p_payload::text,'UTF8')),actor) returning id into new_version;
 update bc_admin_v1.admin_drafts set version_id=new_version,row_version=row_version+1,updated_at=now() where id=p_draft;
 insert into bc_admin_v1.admin_audit_logs(actor_id,request_id,action,target_type,target_id,details)
 values(actor,p_request,'draft.update','draft',p_draft::text,jsonb_build_object('prior_version',old_version.id,'new_version',new_version));
 return d.row_version+1;
end $$;
create function bc_admin_v1.get_bio_draft(p_draft uuid)
returns table(draft_id uuid,resource_key text,state text,row_version bigint,author_id uuid,assigned_reviewer_id uuid,created_at timestamptz,payload jsonb)
language plpgsql security definer set search_path=pg_catalog as $$
declare actor uuid;
begin
 actor:=bc_admin_v1.require_actor('content.read');
 return query select d.id,v.resource_key,d.state,d.row_version,d.author_id,d.assigned_reviewer_id,d.created_at,v.payload
 from bc_admin_v1.admin_drafts d join bc_admin_v1.admin_content_versions v on v.id=d.version_id
 where d.id=p_draft and v.resource_type='bio' and (d.author_id=actor or d.assigned_reviewer_id=actor);
end $$;
create index admin_drafts_reviewer_page_idx on bc_admin_v1.admin_drafts(assigned_reviewer_id,created_at desc,id desc) where state='in_review';
create function bc_admin_v1.list_bio_review_queue(p_limit integer,p_before_time timestamptz,p_before_id uuid)
returns table(draft_id uuid,resource_key text,state text,row_version bigint,author_id uuid,created_at timestamptz,payload jsonb)
language plpgsql security definer set search_path=pg_catalog as $$
declare actor uuid;
begin
 actor:=bc_admin_v1.require_actor('content.read');
 if p_limit is null or p_limit<1 or p_limit>100 or (p_before_time is null)<>(p_before_id is null) then
  raise exception 'invalid page' using errcode='22023'; end if;
 return query select d.id,v.resource_key,d.state,d.row_version,d.author_id,d.created_at,v.payload
 from bc_admin_v1.admin_drafts d join bc_admin_v1.admin_content_versions v on v.id=d.version_id
 where d.assigned_reviewer_id=actor and d.state='in_review' and v.resource_type='bio'
  and (p_before_time is null or (d.created_at,d.id)<(p_before_time,p_before_id))
 order by d.created_at desc,d.id desc limit p_limit;
end $$;
revoke all on function bc_admin_v1.update_bio_draft(uuid,bigint,jsonb,uuid),bc_admin_v1.get_bio_draft(uuid),bc_admin_v1.list_bio_review_queue(integer,timestamptz,uuid) from public,anon,authenticated;
commit;
```

### `009_recovery_sessions.sql`

```sql
-- LOCAL DISPOSABLE FIXTURES ONLY. Not approved for shared execution.
-- Must be called only by a verified recovery gateway after successful TOTP.
-- The gateway opens the recovery session first, then revokes all Admin sessions
-- before changing provider credentials; provider/DB operations are not atomic.
begin;
create function bc_admin_v1.revoke_my_sessions(p_request_id uuid) returns integer
language plpgsql security definer set search_path=pg_catalog as $$
declare actor uuid; count_revoked integer;
begin
 if p_request_id is null then raise exception 'invalid request' using errcode='22023'; end if;
 actor:=bc_admin_v1.require_actor('dashboard.read');
 update bc_admin_v1.admin_sessions set revoked_at=now()
 where user_id=actor and revoked_at is null;
 get diagnostics count_revoked=row_count;
 insert into bc_admin_v1.admin_audit_logs(actor_id,request_id,action,target_type,target_id,details)
 values(actor,p_request_id,'session.revoke_all','staff',actor::text,jsonb_build_object('count',count_revoked,'reason','credential_recovery'));
 return count_revoked;
end $$;
revoke all on function bc_admin_v1.revoke_my_sessions(uuid) from public,anon,authenticated;
commit;
```

### `010_admin_module_commands.sql`

```sql
-- LOCAL SYNTHETIC FIXTURES ONLY. NOT APPROVED FOR SHARED PROJECT EXECUTION.
-- Read commands for authorized Admin modules plus reviewed setting/staff
-- mutations. Requires 001-003 and trusted request identity context. No client
-- grants. All functions are security definer owned by the migration executor;
-- a dedicated low-privilege owner and full grant review are required before any
-- shared use. A SQL-capable caller can spoof request GUCs.
begin;

-- Platforms are public configuration; Admin sees inactive rows as well.
create function bc_admin_v1.list_platforms(p_limit integer,p_after uuid)
returns table(id uuid,name text,slug text,description text,is_active boolean,sort_order integer)
language plpgsql security definer set search_path=pg_catalog as $$
begin
 perform bc_admin_v1.require_actor('content.read');
 if p_limit is null or p_limit<1 or p_limit>100 then raise exception 'invalid page' using errcode='22023'; end if;
 return query select p.id,p.name,p.slug,p.description,p.is_active,p.sort_order from public.platforms p
  where p_after is null or p.id>p_after order by p.id limit p_limit;
end $$;

-- Categories double as public collections for bios; the Admin list includes
-- inactive rows and the linked platform slug.
create function bc_admin_v1.list_categories(p_limit integer,p_after uuid)
returns table(id uuid,name text,slug text,description text,platform_slug text,is_active boolean,sort_order integer)
language plpgsql security definer set search_path=pg_catalog as $$
begin
 perform bc_admin_v1.require_actor('content.read');
 if p_limit is null or p_limit<1 or p_limit>100 then raise exception 'invalid page' using errcode='22023'; end if;
 return query select c.id,c.name,c.slug,c.description,p.slug,c.is_active,c.sort_order
  from public.categories c left join public.platforms p on p.id=c.platform_id
  where p_after is null or c.id>p_after order by c.id limit p_limit;
end $$;

-- Collection groups are derived from bios.source_slug, the same grouping the
-- public catalog uses. No separate collection table exists.
create function bc_admin_v1.list_collections(p_limit integer,p_after text)
returns table(source_slug text,active_bios bigint,archived_bios bigint)
language plpgsql security definer set search_path=pg_catalog as $$
begin
 perform bc_admin_v1.require_actor('content.read');
 if p_limit is null or p_limit<1 or p_limit>100 then raise exception 'invalid page' using errcode='22023'; end if;
 if p_after is not null and (p_after='' or length(p_after)>200 or p_after !~ '^[a-z0-9][a-z0-9-]*$') then
  raise exception 'invalid page' using errcode='22023'; end if;
 return query select b.source_slug,count(*) filter(where b.is_active),count(*) filter(where not b.is_active)
  from public.bios b where b.source_slug is not null
   and (p_after is null or b.source_slug>p_after)
  group by b.source_slug order by b.source_slug limit p_limit;
end $$;

create function bc_admin_v1.list_generators(p_limit integer,p_after uuid)
returns table(id uuid,name text,slug text,generator_type text,character_limit integer,is_active boolean,platform_slug text)
language plpgsql security definer set search_path=pg_catalog as $$
begin
 perform bc_admin_v1.require_actor('content.read');
 if p_limit is null or p_limit<1 or p_limit>100 then raise exception 'invalid page' using errcode='22023'; end if;
 return query select g.id,g.name,g.slug,g.generator_type,g.character_limit,g.is_active,p.slug
  from public.generators g left join public.platforms p on p.id=g.platform_id
  where p_after is null or g.id>p_after order by g.id limit p_limit;
end $$;

create function bc_admin_v1.list_seo_pages(p_limit integer,p_after uuid)
returns table(id uuid,page_slug text,title text,meta_description text,robots text,is_active boolean,updated_at timestamptz)
language plpgsql security definer set search_path=pg_catalog as $$
begin
 perform bc_admin_v1.require_actor('content.read');
 if p_limit is null or p_limit<1 or p_limit>100 then raise exception 'invalid page' using errcode='22023'; end if;
 return query select s.id,s.page_slug,s.title,s.meta_description,s.robots,s.is_active,s.updated_at
  from public.seo_pages s where p_after is null or s.id>p_after order by s.id limit p_limit;
end $$;

-- Aggregate-only reporting. No per-visitor data, no export and no retention
-- policy is implemented; values are database counts, not analytics telemetry.
create function bc_admin_v1.analytics_overview()
returns table(metric text,value bigint)
language plpgsql security definer set search_path=pg_catalog as $$
begin
 perform bc_admin_v1.require_actor('analytics.read');
 return query
  select 'bios.active',count(*) filter(where is_active) from public.bios
  union all select 'bios.archived',count(*) filter(where not is_active) from public.bios
  union all select 'categories.total',count(*) from public.categories
  union all select 'platforms.total',count(*) from public.platforms
  union all select 'generators.total',count(*) from public.generators
  union all select 'seo_pages.total',count(*) from public.seo_pages
  union all select 'admin.drafts.in_review',count(*) from bc_admin_v1.admin_drafts where state='in_review'
  union all select 'admin.drafts.approved',count(*) from bc_admin_v1.admin_drafts where state='approved'
  union all select 'admin.audit.last_24h',count(*) from bc_admin_v1.admin_audit_logs where occurred_at>now()-interval '24 hours'
  union all select 'admin.sessions.active',count(*) from bc_admin_v1.admin_sessions where revoked_at is null and expires_at>now();
end $$;

create function bc_admin_v1.list_settings(p_limit integer,p_after text)
returns table(key text,value jsonb,version bigint,updated_at timestamptz)
language plpgsql security definer set search_path=pg_catalog as $$
begin
 perform bc_admin_v1.require_actor('settings.read');
 if p_limit is null or p_limit<1 or p_limit>100 then raise exception 'invalid page' using errcode='22023'; end if;
 if p_after is not null and (p_after='' or length(p_after)>100) then raise exception 'invalid page' using errcode='22023'; end if;
 return query select s.key,s.value,s.version,s.updated_at from bc_admin_v1.admin_settings s
  where p_after is null or s.key>p_after order by s.key limit p_limit;
end $$;

-- Settings are configuration records only. They do not alter the public site,
-- provider account, deployment or RLS. Step-up freshness is enforced by the
-- server executor, not here.
create function bc_admin_v1.update_setting(p_key text,p_value jsonb,p_expected bigint,p_request uuid)
returns bigint
language plpgsql security definer set search_path=pg_catalog as $$
declare actor uuid; current_version bigint; next_version bigint;
begin
 actor:=bc_admin_v1.require_actor('settings.manage');
 if p_request is null or p_expected is null or p_key is null or p_key !~ '^[a-z][a-z0-9_.-]{0,99}$'
    or p_value is null or jsonb_typeof(p_value)<>'object' or pg_column_size(p_value)>16384 then
  raise exception 'invalid setting' using errcode='22023'; end if;
 -- Unknown keys may only be created by an explicit expected version 1; an
 -- existing key requires its exact current version. Absent rows are never
 -- silently created by a concurrent writer's stale expectation.
 select s.version into current_version from bc_admin_v1.admin_settings s where s.key=p_key for update;
 if current_version is null then
  if p_expected<>1 then raise exception 'setting unavailable' using errcode='42501'; end if;
  insert into bc_admin_v1.admin_settings(key,value,version,updated_by) values(p_key,p_value,1,actor);
  next_version:=1;
 else
  if current_version<>p_expected then raise exception 'stale version' using errcode='40001'; end if;
  next_version:=current_version+1;
  update bc_admin_v1.admin_settings set value=p_value,version=next_version,updated_at=now(),updated_by=actor where key=p_key;
 end if;
 insert into bc_admin_v1.admin_audit_logs(actor_id,request_id,action,target_type,target_id,details)
 values(actor,p_request,'setting.update','setting',p_key,jsonb_build_object('version',next_version));
 return next_version;
end $$;

-- Role catalog for the staff screen. Not an authorization boundary.
create function bc_admin_v1.list_role_catalog()
returns table(id text,description text,permissions text[])
language plpgsql security definer set search_path=pg_catalog as $$
begin
 perform bc_admin_v1.require_actor('staff.read');
 return query select r.id,r.description,
  coalesce(array_agg(rp.permission_id order by rp.permission_id) filter(where rp.permission_id is not null),array[]::text[])
  from bc_admin_v1.admin_roles r left join bc_admin_v1.admin_role_permissions rp on rp.role_id=r.id
  group by r.id,r.description order by r.id;
end $$;

-- Own session history only; users never enumerate other administrators here.
create function bc_admin_v1.list_my_sessions(p_limit integer,p_before timestamptz)
returns table(id uuid,created_at timestamptz,expires_at timestamptz,revoked_at timestamptz)
language plpgsql security definer set search_path=pg_catalog as $$
declare actor uuid;
begin
 actor:=bc_admin_v1.require_actor('dashboard.read');
 if p_limit is null or p_limit<1 or p_limit>100 or (p_before is not null and extract(epoch from p_before) is null) then raise exception 'invalid page' using errcode='22023'; end if;
 return query select s.id,s.created_at,s.expires_at,s.revoked_at from bc_admin_v1.admin_sessions s
  where s.user_id=actor and (p_before is null or s.created_at<p_before)
  order by s.created_at desc limit p_limit;
end $$;

-- Redacted audit view: no request payloads, only identifiers and outcomes.
create function bc_admin_v1.list_audit_logs(p_limit integer,p_before bigint)
returns table(id bigint,actor_id uuid,action text,target_type text,target_id text,occurred_at timestamptz,details jsonb)
language plpgsql security definer set search_path=pg_catalog as $$
begin
 perform bc_admin_v1.require_actor('audit.read');
 if p_limit is null or p_limit<1 or p_limit>100 or (p_before is not null and p_before<0) then
  raise exception 'invalid page' using errcode='22023'; end if;
 return query select a.id,a.actor_id,a.action,a.target_type,a.target_id,a.occurred_at,a.details
  from bc_admin_v1.admin_audit_logs a where p_before is null or a.id<p_before
  order by a.id desc limit p_limit;
end $$;

revoke all on function bc_admin_v1.list_platforms(integer,uuid),bc_admin_v1.list_categories(integer,uuid),
 bc_admin_v1.list_collections(integer,text),bc_admin_v1.list_generators(integer,uuid),
 bc_admin_v1.list_seo_pages(integer,uuid),bc_admin_v1.analytics_overview(),
 bc_admin_v1.list_settings(integer,text),bc_admin_v1.update_setting(text,jsonb,bigint,uuid),
 bc_admin_v1.list_role_catalog(),bc_admin_v1.list_my_sessions(integer,timestamptz),
 bc_admin_v1.list_audit_logs(integer,bigint)
 from public,anon,authenticated;
commit;
```

### `011_totp_enrolment.sql`

```sql
-- LOCAL SYNTHETIC FIXTURES ONLY. Not approved for shared execution.
-- First-factor (TOTP) enrolment gate for an account that has a password session
-- but no verified factor yet. It deliberately does NOT require aal2 (the account
-- has no second factor), but it does require an enabled Admin membership with at
-- least one role and a live provider session.
--
-- It returns a boolean instead of raising for a denied actor so that the audited
-- denial commits: a raise would roll the audit row back. The caller (the trusted
-- database adapter) MUST reject with 403 when the result is not true, and must
-- never treat a missing row as success. Invalid arguments still raise.
begin;
create function bc_admin_v1.enrolment_eligible(p_request_id uuid) returns boolean
language plpgsql security definer set search_path=pg_catalog as $$
declare uid uuid; sid uuid; eligible boolean:=false;
begin
 if p_request_id is null then raise exception 'invalid request' using errcode='22023'; end if;
 uid:=auth.uid();
 begin sid:=nullif(auth.jwt()->>'session_id','')::uuid;
 exception when invalid_text_representation then sid:=null; end;
 if uid is not null and sid is not null and coalesce(auth.jwt()->>'aal','') in ('aal1','aal2') then
  select exists(
    select 1 from bc_admin_v1.admin_users u
    where u.id=uid and u.enabled
      and exists(select 1 from bc_admin_v1.admin_user_roles r where r.user_id=u.id)
      and exists(select 1 from auth.sessions s where s.id=sid and s.user_id=uid)
  ) into eligible;
 end if;
 -- Audited for every attempt, including denials, with no token material.
 insert into bc_admin_v1.admin_audit_logs(actor_id,request_id,action,target_type,target_id,details)
 values(case when eligible then uid else null end,p_request_id,'auth.enrolment_attempt','staff',uid::text,
        jsonb_build_object('eligible',eligible));
 return eligible;
end $$;
revoke all on function bc_admin_v1.enrolment_eligible(uuid) from public,anon,authenticated;
commit;
```

---

## 8. Full rollback SQL

### `001_admin_foundation.sql`

```sql
-- ISOLATED SYNTHETIC ENVIRONMENTS ONLY. DESTRUCTIVE; NEVER RUN ON PRODUCTION.
-- In real environments retain evidence and use the reviewed incident process.
-- Refuses removal if any admin data exists; drops are explicit, without CASCADE.
begin;
do $$
declare r record; occupied boolean;
begin
 for r in select tablename from pg_catalog.pg_tables where schemaname='bc_admin_v1' loop
  execute format('select exists(select 1 from bc_admin_v1.%I)',r.tablename) into occupied;
  if occupied then raise exception 'refusing rollback: bc_admin_v1.% contains data',r.tablename; end if;
 end loop;
end $$;
drop table bc_admin_v1.admin_publication_jobs;
drop table bc_admin_v1.admin_approvals;
drop table bc_admin_v1.admin_drafts;
drop table bc_admin_v1.admin_content_versions;
drop table bc_admin_v1.admin_notifications;
drop table bc_admin_v1.admin_sessions;
drop table bc_admin_v1.admin_audit_logs;
drop table bc_admin_v1.admin_security_events;
drop table bc_admin_v1.admin_backup_records;
drop table bc_admin_v1.admin_settings;
drop table bc_admin_v1.admin_user_roles;
drop table bc_admin_v1.admin_role_permissions;
drop table bc_admin_v1.admin_permissions;
drop table bc_admin_v1.admin_roles;
drop table bc_admin_v1.admin_users;
drop function bc_admin_v1.reject_mutation();
drop schema bc_admin_v1 restrict;
commit;
```

### `002_workflow_integrity.sql`

```sql
-- ISOLATED SYNTHETIC ENVIRONMENTS ONLY. No content is removed.
begin;
drop trigger draft_guard on bc_admin_v1.admin_drafts;
drop trigger approval_guard on bc_admin_v1.admin_approvals;
drop function bc_admin_v1.guard_draft();
drop function bc_admin_v1.guard_approval();
alter table bc_admin_v1.admin_approvals drop constraint one_decision_per_draft;
commit;
```

### `003_permission_catalog.sql`

```sql
-- ISOLATED SYNTHETIC ENVIRONMENTS ONLY. Refuse removal if any membership exists.
begin;
do $$ begin
 if exists(select 1 from bc_admin_v1.admin_user_roles) then
  raise exception 'refusing rollback: role assignments exist';
 end if;
end $$;
delete from bc_admin_v1.admin_role_permissions;
delete from bc_admin_v1.admin_permissions;
delete from bc_admin_v1.admin_roles;
commit;
```

### `004_private_draft_commands.sql`

```sql
-- Synthetic fixture only. No content or audit rows are deleted.
begin;
drop function bc_admin_v1.list_my_bio_drafts(integer,timestamptz,uuid);
drop function bc_admin_v1.review_draft(uuid,bigint,boolean,uuid);
drop function bc_admin_v1.submit_draft(uuid,bigint,uuid,uuid);
drop function bc_admin_v1.create_bio_draft(text,jsonb,uuid);
drop function bc_admin_v1.require_actor(text);
commit;
```

### `005_session_commands.sql`

```sql
-- Synthetic fixture only. Sessions and audit records are retained.
begin;
drop function bc_admin_v1.revoke_admin_session(uuid);
drop function bc_admin_v1.open_admin_session(uuid);
commit;
```

### `006_auth_controls.sql`

```sql
-- Synthetic fixtures only; refuses destruction of non-empty rate/flow data.
begin;
do $$ begin
 if exists(select 1 from bc_admin_v1.admin_login_flows) or exists(select 1 from bc_admin_v1.admin_rate_limits) then
  raise exception 'refusing rollback: auth control records exist'; end if;
end $$;
drop function bc_admin_v1.store_login_flow(bytea,bytea,integer);
drop function bc_admin_v1.take_login_flow(bytea);
drop function bc_admin_v1.consume_rate_limit(text,bytea);
drop table bc_admin_v1.admin_login_flows;
drop table bc_admin_v1.admin_rate_limits;
commit;
```

### `007_staff_commands.sql`

```sql
-- Synthetic fixtures only. Memberships and audits are retained.
begin;
drop function bc_admin_v1.update_staff(uuid,bigint,boolean,text[],uuid);
drop function bc_admin_v1.list_staff(integer,uuid);
commit;
```

### `008_bio_edit.sql`

```sql
-- Synthetic fixture rollback only; preserves immutable versions and audit data.
begin;
drop function bc_admin_v1.list_bio_review_queue(integer,timestamptz,uuid);
drop index bc_admin_v1.admin_drafts_reviewer_page_idx;
drop function bc_admin_v1.get_bio_draft(uuid);
drop function bc_admin_v1.update_bio_draft(uuid,bigint,jsonb,uuid);
commit;
```

### `009_recovery_sessions.sql`

```sql
-- Synthetic fixture rollback only; retains sessions and audits.
begin;
drop function bc_admin_v1.revoke_my_sessions(uuid);
commit;
```

### `010_admin_module_commands.sql`

```sql
-- Local rollback for 010 candidate. Disposable synthetic clusters only.
begin;
drop function if exists bc_admin_v1.list_audit_logs(integer,bigint);
drop function if exists bc_admin_v1.list_my_sessions(integer,timestamptz);
drop function if exists bc_admin_v1.list_role_catalog();
drop function if exists bc_admin_v1.update_setting(text,jsonb,bigint,uuid);
drop function if exists bc_admin_v1.list_settings(integer,text);
drop function if exists bc_admin_v1.analytics_overview();
drop function if exists bc_admin_v1.list_seo_pages(integer,uuid);
drop function if exists bc_admin_v1.list_generators(integer,uuid);
drop function if exists bc_admin_v1.list_collections(integer,text);
drop function if exists bc_admin_v1.list_categories(integer,uuid);
drop function if exists bc_admin_v1.list_platforms(integer,uuid);
commit;
```

### `011_totp_enrolment.sql`

```sql
-- Local rollback for 011. Disposable synthetic clusters only.
begin;
drop function if exists bc_admin_v1.enrolment_eligible(uuid);
commit;
```
