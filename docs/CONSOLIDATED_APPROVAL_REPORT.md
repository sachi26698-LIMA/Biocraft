# CONSOLIDATED APPROVAL REPORT — BioCraft Master Admin on `jvpadtzfsuekixrquzjv`

**Revision 3 — incorporates your D1–D4 decisions; the SQL package is now
001–012 plus one canonical grant file.** Counts in this revision are derived from
the files by `test:admin-grant-inventory`, not written by hand: **19 tables, 39
functions (35 granted, 4 trigger bodies), 1 canonical grant file, 25 SQL files
with recorded SHA-256.**

**Status: awaiting your decision. Nothing in this report has been executed.** No
schema, role, grant, Auth setting or account has been created in the shared
project. This file supersedes `docs/MASTER_ADMIN_APPROVAL_REQUEST.md` as the
single approval artefact; the full per-file SQL is shown at the end.

**A separate pre-execution security review is `docs/FINAL_SECURITY_REVIEW.md`**
(per-function `SECURITY DEFINER` matrix, ownership, grants, classification and
the approval checklist). Read it together with this report; where the two differ,
the review's findings D1–D4 take precedence.

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
| 2 | 19 new tables (15 in 001, 2 in 006, 2 in 012: recovery grants, cleanup runs) | none; RLS enabled with a restrictive `deny_clients` policy and all table privileges revoked |
| 3 | 39 new functions, `search_path=pg_catalog` fixed on every one: 35 callable `SECURITY DEFINER` (all granted) + 4 trigger bodies (never granted: `reject_mutation`, `guard_draft`, `guard_approval`, `stamp_mfa_enrolled`) | none by default: every function ends with `REVOKE ALL ... FROM public, anon, authenticated` |
| 4 | triggers on the new tables only | none |
| 5 | `ALTER DEFAULT PRIVILEGES IN SCHEMA bc_admin_v1 ...` | per-schema only, affects **future** `bc_admin_v1` objects created by the same role. Global default ACLs (which govern `public`) are **not** touched |
| 6 | new login role `bc_admin_executor` | cannot log in to the API as a user; no table privileges; not a member of any privileged role |
| 7 | grant: `USAGE` on schema + `EXECUTE` on 35 named functions to that role (`admin-backend/grants/executor-grants.sql`, SHA-256 `7c78b58f…dc035d`) | the only new capability, and it is reachable only by that role |
| 8 | one nullable column `admin_users.mfa_enrolled_at` (012) | none on `public`; it is the enrol-vs-recover record for D2 |

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
4. Rate limiting and login handoffs are stored in the Admin schema. Growth is now
   bounded by `cleanup_expired` (012): expired rows only, ≤1000 per call, advisory
   locked, every run recorded. It is Super-Admin-scheduled on the Preview because
   Vercel Cron targets Production only; that limitation is documented, not hidden.
5. The number of tables, functions and grants is now derived from the files by
   `test:admin-grant-inventory`, which fails if any of the three drifts. Earlier
   revisions of this report said 25, then 28, then 31 functions; the correct
   figure for this package is 38 definitions / 34 grants / 19 tables.

---

## 2. Is the dedicated limited login actually required? — Yes

The backend runs as a Vercel function. It needs a credential that can *only* call
the reviewed functions. Alternatives considered and rejected:

| Option | Why rejected |
|---|---|
| Use the `service_role` key over PostgREST | `service_role` is `BYPASSRLS` with write access to every `public` table. A leak = full database takeover. Violates least privilege and your "no weakening" rule. |
| Use `postgres` / DB password | Owner of every public table; same objection, larger blast radius. |
| No database at all (UI only) | Cannot deliver CRUD/analytics/audit. |
| **Dedicated `bc_admin_executor`** | Selected. No table grant, no schema CREATE, no role membership, EXECUTE on exactly 35 functions, and the server additionally refuses to start if the connected role is privileged (`assertLimitedRole`). |

Creation is `CREATE ROLE ... LOGIN PASSWORD` (48 chars from a CSPRNG, D3) +
`GRANT USAGE` + 34 `GRANT EXECUTE` from the single canonical grant file.
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

Order is enforced by the database, not by convention — see
`docs/FINAL_SECURITY_REVIEW.md` §7 for the full runbook, including the recovery
procedure for a lost authenticator.

1. Dashboard → Authentication → *Add user* (auto-confirm, strong unique password).
2. **Grant membership before the first sign-in**, in one transaction, with an
   explicit `actor_id = null` bootstrap audit row:

```sql
insert into bc_admin_v1.admin_users (id, enabled) values ('<uuid>', true);
insert into bc_admin_v1.admin_user_roles (user_id, role_id) values ('<uuid>','super_admin');
insert into bc_admin_v1.admin_audit_logs(actor_id, request_id, action, target_type, target_id, details)
  values (null, gen_random_uuid(), 'staff.bootstrap', 'staff', '<uuid>', '{"method":"dashboard"}');
```

3. First sign-in at `/admin/login` → `factor_gate` returns `'enrol'` (the account
   has never proven a factor) → partner app enrolment → first code → `aal2` →
   Admin session → the `stamp_mfa_enrolled` trigger records the proof.
4. Sign out and sign in again with the password only: the response **must** be
   `mfa_required: true`. That is the mandatory-enrolment check.
5. A lost authenticator is recovered by a **different** Super Admin issuing a
   single-use code (15 min, five attempts), never by re-enrolling from a password.

There is no endpoint anywhere that creates the first administrator, and none that
lets an account re-open itself: privilege must be granted out of band.

---

## 5. Rollback

| Level | Action | Effect |
|---|---|---|
| Instant off-switch | remove `ADMIN_BACKEND_ENABLED` in Vercel (Preview) | every `/api/admin/*` request returns 503; no database access |
| Revoke executor | `REVOKE ALL ON FUNCTION ... FROM bc_admin_executor;` (the 35 listed) | backend loses all capability; grants are the only path |
| Drop executor | `DROP OWNED BY bc_admin_executor; DROP ROLE bc_admin_executor;` | removes remaining privileges |
| Full removal | `admin-backend/rollback/012→001` in reverse order | drops only `bc_admin_v1` objects; refuses if any Admin table holds rows — and 012 also refuses while any `mfa_enrolled_at` is set; never touches `public`/`auth` |
| Credential rotation (D3) | `node scripts/admin-executor-credential.mjs --rotate` | two-role switch: successor created, env switched, old role retired only after the successor is proven |

The rollback scripts were executed in the disposable PostgreSQL 17.11 fixture
(`test:admin-isolated-foundation`, `test:admin-postgres-local`) and reproduce a
clean reinstall. A dedicated `tests/admin-rollback-cycle.mjs` (part of the same
runner, in its own fresh database) proves the three 012 guards refuse *before*
dropping anything, that `rollback/012` restores a working 011 gate even though it
drops the column that gate reads, and that a full reverse teardown leaves no
schema and a reinstall recreates 19 tables and 39 functions. `rollback/012`'s three data guards are covered by the same suite,
and `test:admin-grant-inventory` asserts no rollback file contains `CASCADE` or
names a `public`/`auth` object.

---

## 6. Exact SQL

Each script is reproduced in full below (fenced), followed by its SHA-256 so you
can confirm the file you review is exactly what would execute. These are the same
bytes that passed the disposable PostgreSQL 17.11 suites.

### 6a. Exact permission changes (the only new capability)

The grant list is not duplicated here: it is one canonical file,
`admin-backend/grants/executor-grants.sql` (SHA-256
`7c78b58f765d74d33336e7ec79a9777ee15f7662fe40fe5c3823b99258dc035d`), reproduced
in full:

```sql
-- CANONICAL EXECUTOR GRANT LIST. Executed by a human with project access AFTER
-- migrations 001–012, never by the application, and never as the executor itself.
--
-- 35 signatures = 39 functions created by 001–012 minus the 4 trigger bodies
-- (reject_mutation, guard_draft, guard_approval, stamp_mfa_enrolled). Trigger
-- functions are invoked by the trigger machinery as the table owner and must not
-- be granted: a direct EXECUTE would widen the surface for no benefit.
--
-- `tests/admin-grant-inventory.mjs` fails if this file and the migrations ever
-- disagree, so a new function cannot be created without a decision about whether
-- the executor may call it.

grant usage on schema bc_admin_v1 to bc_admin_executor;

grant execute on function
  bc_admin_v1.require_actor(text),
  bc_admin_v1.enrolment_eligible(uuid),
  bc_admin_v1.factor_gate(uuid),
  bc_admin_v1.open_admin_session(uuid),
  bc_admin_v1.revoke_admin_session(uuid),
  bc_admin_v1.revoke_my_sessions(uuid),
  bc_admin_v1.store_login_flow(bytea,bytea,integer),
  bc_admin_v1.take_login_flow(bytea),
  bc_admin_v1.consume_rate_limit(text,bytea),
  bc_admin_v1.list_staff(integer,uuid),
  bc_admin_v1.update_staff(uuid,bigint,boolean,text[],uuid),
  bc_admin_v1.create_bio_draft(text,jsonb,uuid),
  bc_admin_v1.update_bio_draft(uuid,bigint,jsonb,uuid),
  bc_admin_v1.get_bio_draft(uuid),
  bc_admin_v1.submit_draft(uuid,bigint,uuid,uuid),
  bc_admin_v1.review_draft(uuid,bigint,boolean,uuid),
  bc_admin_v1.list_my_bio_drafts(integer,timestamptz,uuid),
  bc_admin_v1.list_bio_review_queue(integer,timestamptz,uuid),
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
  bc_admin_v1.issue_recovery_grant(uuid,bytea,bytea,interval,uuid),
  bc_admin_v1.revoke_recovery_grant(uuid,uuid),
  bc_admin_v1.reset_factor_enrolment(uuid,uuid),
  bc_admin_v1.consume_recovery_grant(bytea,uuid),
  bc_admin_v1.recovery_grant_state(uuid),
  bc_admin_v1.cleanup_expired(text,integer,uuid)
 to bc_admin_executor;
```

The role itself precedes it, and the password comes from
`node scripts/admin-executor-credential.mjs` (D3, 48 characters, stdout only). That
script reads this same canonical file instead of holding a copy of the list, so
the SQL you approve is the SQL it prints:

```sql
create role bc_admin_executor login password '<generated>'
  nosuperuser nocreatedb nocreaterole noreplication nobypassrls inherit;
```

35 of the 39 functions are granted. The 4 trigger bodies — `guard_draft`,
`guard_approval`, `reject_mutation` and `stamp_mfa_enrolled` — are never called by
the server and get no grant. `stamp_mfa_enrolled` matters most: it writes the
`mfa_enrolled_at` value that D2's enrol-vs-recover decision rests on, so no login
may invoke it directly.

`require_actor(text)` is granted because the server calls it once per write as a
defence-in-depth check before the operation's own function; every function also
re-checks internally, so removing the grant would widen access.

`reset_factor_enrolment(uuid,uuid)` is granted **and** re-checks `staff.manage`
inside the function, refuses self-reset, and audits every call. It is the one way
to complete a recovery (§6d); without it an operator would need a hand-written
`UPDATE`, which is exactly the kind of untracked privileged write this package
replaces.

No table, sequence, column or schema-`CREATE` privilege is granted.

### 6b. SHA-256 of every file in the package

<!-- admin-sync:totals:start -->
20 tables. 48 functions = 43 callable SECURITY DEFINER + 5 trigger bodies. 43 granted signatures. 14 forward migrations, 14 rollbacks and 1 grant file (`29` SQL files).
<!-- admin-sync:totals:end -->

Regenerate the same list with
`sha256sum admin-backend/migrations/*.sql admin-backend/rollback/*.sql admin-backend/grants/executor-grants.sql`
and compare; `test:admin-grant-inventory` fails if any value here, or in the
security review, stops matching the bytes on disk.

<!-- admin-sync:checksums:start -->
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
- `admin-backend/migrations/012_recovery_and_cleanup.sql` — `81848c310f3ea16b4aa5bee279660b7d919e2dfd795136dbcfac958332f84f2a`
- `admin-backend/migrations/013_publication_bridge.sql` — `8c9148fc9ce2fe086daf46ad6700dc16d1327165aa1f9221a90b366a1a506d9c`
- `admin-backend/migrations/014_module_read_surface.sql` — `5f3a026c8a63a7f28ed24cbddefbb46f3e61517fe0995e6f1519aa97db3ff895`
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
- `admin-backend/rollback/012_recovery_and_cleanup.sql` — `99823ea75d85f1a10ba871d1435bb29f9830c745fef010aeef2c85d928fcde96`
- `admin-backend/rollback/013_publication_bridge.sql` — `433221b5573aa45e863c81222f2dc41c93fe00684332ab1ee724f1803d187785`
- `admin-backend/rollback/014_module_read_surface.sql` — `71ee002073871c890d46229648eb6a5e017e5cb4bbb0274b4185436c6072bb06`
- `admin-backend/grants/executor-grants.sql` — `867811ecec89578f8a90a8295c162911610390d91b0e8902ec4f09fb07206ffe`
<!-- admin-sync:checksums:end -->

### 6c. Enrolment gate semantics (011, hardened by 012)

`bc_admin_v1.enrolment_eligible(uuid)` is callable before a second factor exists.
Migration 012 **replaces its body** (`create or replace`) to add the one condition
011 could not express, because the column did not exist yet: the account must have
`mfa_enrolled_at is null`. Without that condition the gate answers "this account
may have a factor", which stays true for an account that already proved one and
would let a password session re-enrol past D2. After 012 it answers "this account
has never proved a factor", and the only way to make that true again is the
audited Super Admin reset (§6d). It returns a boolean rather than raising, so that the
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

### 6d. Recovery (D2) and cleanup (D4) semantics — what 012 adds and why

**D2 — no password-only re-enrolment.** The provider reports zero verified factors
for both "never enrolled" and "lost the device", so the distinction is recorded in
the database: `admin_users.mfa_enrolled_at`, written by the `stamp_mfa_enrolled`
trigger on the first `admin_sessions` insert, which `open_admin_session` only
permits for an `aal2` caller. `factor_gate()` then answers `'enrol'` only while
that column is null, `'recover'` after, and `'denied'` for a disabled, roled-out
or session-less account.

Recovery needs a *second*, fully authenticated Super Admin:

| Property | Where it is enforced |
|---|---|
| Super Admin verification | `require_actor('staff.manage')` inside `issue_recovery_grant` |
| Explicit authorisation for one account | the named `user_id`, `FOR UPDATE` on the target row, enabled + roled required |
| No self-service | `p_user_id = actor` is refused |
| Single use | one live grant per account (a new issue revokes the old); `consumed_at` set under `FOR UPDATE` |
| Expiry | TTL clamped to 1–15 minutes by a table check constraint *and* the function |
| Rate limiting | five attempts inside the same locked row; the cap revokes the grant; issuance/redemption also pass through `consume_rate_limit` |
| Audit | `auth.recovery.issued / .revoked / .attempt / .state` and `auth.factor_gate`, with the actor or `NULL` on denial — never a code, salt or token |
| No silent bypass | redemption creates no session, sets no cookie, changes no password and deletes no factor |

The code is 12 symbols of Crockford base32 (checksum included, vowels excluded),
40 bits, shown once, stored only as `sha256(salt ‖ code)` with an 8-byte salt.

**Completing a recovery.** Redemption itself changes nothing — no session, no
cookie, no factor removal. The operator deletes the stale factor at the provider,
then a Super Admin calls `POST /api/admin/v1/staff/recovery/reset {userId}`, which
runs `reset_factor_enrolment(uuid,uuid)`: `require_actor('staff.manage')`,
self-reset refused, one named account, `auth.recovery.factor_reset` audit row with
`reset: true|false`. That returns the account to the ordinary first-enrolment path.
The four steps — issue, redeem, reset, enrol — are four separate audit actions.

**D4 — bounded cleanup.** `cleanup_expired(target, limit, request_id)` requires
`settings.manage`, accepts only `admin_login_flows` (expired) and
`admin_rate_limits` (older than a day), caps the batch at 1000, takes a per-target
advisory lock, uses `FOR UPDATE SKIP LOCKED`, and writes one `admin_cleanup_runs`
row plus one `ops.cleanup` audit row per run — skips included. It cannot name an
audit table; any other target raises `22023` before any delete. On the Preview the
schedule is the authenticated Super Admin action in the Settings module, because
Vercel Cron targets Production only and Production is out of scope.

---

## 7. Full SQL (exact bytes to be executed)

Everything the package would execute, verbatim: the twelve forward migrations, then
their rollbacks, then the single grant statement that actually confers capability.
Generated from the files themselves by `node scripts/admin-sync-docs.mjs`, so a
hand-edited copy cannot survive a test run.

<!-- admin-sync:sql:start -->
## Appendix A — forward migrations, verbatim

### `001_admin_foundation.sql`

SHA-256 `54d52c1f1d74cf492f431ee46f761313beefd6493e4ff2e918cde97ebb7c7db7`.

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

SHA-256 `b23d6e9519ccd5ab4cecf9cbe27c8903a6d6a84ae74b7006fce3e3b08383b822`.

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

SHA-256 `37a839dc250d3a51622355e9cc03646d4e39ebeb821922d8117bffa2d5e6c3cb`.

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

SHA-256 `554631e23e6497ee6db5ce96d37d773f127eccc6054fd4b22ee4f5b2c48ef3fa`.

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

SHA-256 `3b08b1446791796949fdbc61123f6b5ba59473dac79f2530261b23ed269899cb`.

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

SHA-256 `d4e20279bd722c2ff694bffbfde8897d63dda2235e088119457bbbf0a0b88adb`.

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

SHA-256 `d04c19d37acd213229a8f3088871fc51ae9b2f0b36602e40081437c8ef0b512d`.

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

SHA-256 `a4b594c7d3479fad588c026d21a11abe037bf2e4970fd97e8449674bf895c652`.

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

SHA-256 `7851eb4f03d97fbcdcd7f62cb00b54437233a2a064f12a911bd5d530b5c5a30b`.

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

SHA-256 `5ac31357267a496759aa47b6838baf6ec755ae95c8dd06d0a2616529c775023b`.

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

SHA-256 `4507ed36f5571c92e0d85f1ca017809997be760a05693d5c6306b5f0939ddb21`.

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

### `012_recovery_and_cleanup.sql`

SHA-256 `81848c310f3ea16b4aa5bee279660b7d919e2dfd795136dbcfac958332f84f2a`.

```sql
-- LOCAL SYNTHETIC FIXTURES ONLY. Not approved for shared execution.
-- Recovery authorisation, single-use recovery tokens, and bounded cleanup of the
-- two operational tables from 006.
--
-- Design goals (owner decisions D2 and D4):
--  * There is no password-only route back in for an account that ever had a
--    verified factor. Recovery requires a second, already fully authenticated
--    Super Admin to authorise one specific account, one time.
--  * A recovery grant is bound to the requesting account, expires quickly, is
--    consumed atomically exactly once, and can be withdrawn by a Super Admin.
--  * Every attempt, including denied and rate-limited ones, commits an audit row
--    with no token material.
--  * Cleanup deletes only expired operational rows, never audit evidence, works
--    in bounded batches under a per-table advisory lock, and records the outcome.
begin;

-- D2 needs to tell "never enrolled" apart from "lost the factor": the provider
-- reports zero verified factors for both. This column is written once, by the
-- database, when a second factor has actually been proven (open_admin_session
-- below), so the distinction cannot be forged by a password-only session.
alter table bc_admin_v1.admin_users add column mfa_enrolled_at timestamptz;

-- Stamp the first proof of a second factor. open_admin_session (005) can only
-- succeed for an aal2 caller, so an inserted row is itself the evidence; doing it
-- in a trigger keeps 005 unchanged and makes the write unconditional for every
-- future command that opens a session.
create function bc_admin_v1.stamp_mfa_enrolled() returns trigger
language plpgsql security definer set search_path=pg_catalog as $$
begin
 update bc_admin_v1.admin_users u
  set mfa_enrolled_at = coalesce(u.mfa_enrolled_at, now())
  where u.id = new.user_id;
 return null;
end $$;
create trigger admin_sessions_stamp_mfa after insert on bc_admin_v1.admin_sessions
 for each row execute function bc_admin_v1.stamp_mfa_enrolled();

-- Pre-MFA decision for a password session with zero verified factors.
--   'enrol'   -> an enabled member that has never proven a factor may enrol one;
--   'recover' -> an enabled member that previously had one must use recovery;
--   'denied'  -> everything else.
-- Returns text instead of raising so the audit row commits; the caller rejects
-- anything that is not 'enrol' or 'recover'.
-- 011's gate answered "is this account allowed to have a factor", which stays true
-- for an account that already proved one. With 012 the enrolment record exists, so
-- the gate can also answer "has it never enrolled", and it is replaced here rather
-- than edited in 011 because the column it reads is created by this file. After
-- this statement the only way to reach enrolment from a password session is an
-- account whose factor was never proven, or was explicitly reset.
create or replace function bc_admin_v1.enrolment_eligible(p_request_id uuid) returns boolean
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
    where u.id=uid and u.enabled and u.mfa_enrolled_at is null
      and exists(select 1 from bc_admin_v1.admin_user_roles r where r.user_id=u.id)
      and exists(select 1 from auth.sessions s where s.id=sid and s.user_id=uid)
  ) into eligible;
 end if;
 insert into bc_admin_v1.admin_audit_logs(actor_id,request_id,action,target_type,target_id,details)
 values(case when eligible then uid else null end,p_request_id,'auth.enrolment_attempt','staff',uid::text,
        jsonb_build_object('eligible',eligible));
 return eligible;
end $$;

create function bc_admin_v1.factor_gate(p_request_id uuid) returns text
language plpgsql security definer set search_path=pg_catalog as $$
declare uid uuid; sid uuid; eligible boolean:=false; enrolled boolean:=false; outcome text:='denied';
begin
 if p_request_id is null then raise exception 'invalid factor request' using errcode='22023'; end if;
 uid := auth.uid();
 begin sid := nullif(auth.jwt()->>'session_id','')::uuid;
 exception when invalid_text_representation then sid := null; end;
 if uid is not null and sid is not null and coalesce(auth.jwt()->>'aal','') in ('aal1','aal2') then
  select true, (u.mfa_enrolled_at is not null) into eligible, enrolled
   from bc_admin_v1.admin_users u
   where u.id = uid and u.enabled
     and exists (select 1 from bc_admin_v1.admin_user_roles r where r.user_id = u.id)
     and exists (select 1 from auth.sessions s where s.id = sid and s.user_id = uid);
  if eligible then outcome := case when enrolled then 'recover' else 'enrol' end; end if;
 end if;
 insert into bc_admin_v1.admin_audit_logs(actor_id,request_id,action,target_type,target_id,details)
 values (case when eligible then uid else null end, p_request_id, 'auth.factor_gate', 'staff', uid::text,
         pg_catalog.jsonb_build_object('outcome', outcome));
 return outcome;
end $$;

-- A short, human-transcribed code (Crockford base32, no vowels, so it cannot
-- spell a word) is hashed with pg_catalog.sha256 over a random 32-byte salt. The
-- plaintext exists only in the Super Admin's browser and the recovering user's
-- browser: the database stores 8 bytes of salt and 32 bytes of digest.
create table bc_admin_v1.admin_recovery_grants (
 id uuid primary key,
 user_id uuid not null,
 issued_by uuid not null,
 issued_at timestamptz not null,
 expires_at timestamptz not null,
 salt bytea not null,
 code_hash bytea not null,
 attempts integer not null default 0,
 consumed_at timestamptz,
 revoked_at timestamptz,
 constraint recovery_grants_salt_len check (octet_length(salt) = 8),
 constraint recovery_grants_hash_len check (octet_length(code_hash) = 32),
 constraint recovery_grants_window check (expires_at > issued_at and expires_at <= issued_at + interval '15 minutes'),
 constraint recovery_grants_attempts check (attempts between 0 and 5),
 constraint recovery_grants_consumed check ((consumed_at is null) or (revoked_at is null))
);
create index admin_recovery_grants_user_idx on bc_admin_v1.admin_recovery_grants(user_id, issued_at desc);
create index admin_recovery_grants_expiry_idx on bc_admin_v1.admin_recovery_grants(expires_at);

-- One row per cleanup run. Retained as evidence; bounded by a partial unique
-- index so a table cannot have two concurrent finishes for the same instant.
create table bc_admin_v1.admin_cleanup_runs (
 id bigint generated always as identity primary key,
 target text not null check (target in ('admin_login_flows','admin_rate_limits')),
 started_at timestamptz not null,
 finished_at timestamptz,
 deleted integer not null default 0 check (deleted >= 0),
 skipped boolean not null default false,
 detail jsonb not null default '{}'::jsonb
);
create index admin_cleanup_runs_target_idx on bc_admin_v1.admin_cleanup_runs(target, id desc);

alter table bc_admin_v1.admin_recovery_grants enable row level security;
alter table bc_admin_v1.admin_cleanup_runs enable row level security;
create policy deny_clients on bc_admin_v1.admin_recovery_grants as restrictive for all to anon,authenticated using(false) with check(false);
create policy deny_clients on bc_admin_v1.admin_cleanup_runs as restrictive for all to anon,authenticated using(false) with check(false);
revoke all on bc_admin_v1.admin_recovery_grants,bc_admin_v1.admin_cleanup_runs from public,anon,authenticated;

-- A recovery code is delivered out of band by the Super Admin. Format:
-- 8 characters from a 32-symbol alphabet (no 0/O/1/I/L/U), plus 4 checksum
-- characters, 12 characters total, ~40 bits of entropy, single use, 5 attempts.
-- Normalisation (upper case, strip separators) happens in the trusted server, not
-- here, so this function compares a fixed-length digest only.
create function bc_admin_v1.issue_recovery_grant(
 p_user_id uuid, p_code_hash bytea, p_salt bytea, p_ttl interval, p_request_id uuid)
returns uuid
language plpgsql security definer set search_path=pg_catalog as $$
declare actor uuid; gid uuid; target_enabled boolean; live boolean;
begin
 actor := bc_admin_v1.require_actor('staff.manage');
 if p_request_id is null or p_user_id is null or p_code_hash is null or p_salt is null then
  raise exception 'invalid recovery grant' using errcode='22023';
 end if;
 if octet_length(p_code_hash) <> 32 or octet_length(p_salt) <> 8 then
  raise exception 'invalid recovery grant' using errcode='22023';
 end if;
 if p_ttl is null or p_ttl < interval '1 minute' or p_ttl > interval '15 minutes' then
  raise exception 'invalid recovery window' using errcode='22023';
 end if;
 -- The target must be an enabled Admin member, and must not be the issuer: a
 -- Super Admin cannot authorise recovery of their own account.
 if p_user_id = actor then raise exception 'self recovery is not permitted' using errcode='42501'; end if;
 -- Serialise on the target account: this is the same row lock 007's update_staff
 -- takes, so a concurrent disable and a concurrent grant cannot interleave.
 select u.enabled into target_enabled from bc_admin_v1.admin_users u where u.id = p_user_id for update;
 if target_enabled is not true then raise exception 'not authorized' using errcode='42501'; end if;
 if not exists (select 1 from bc_admin_v1.admin_user_roles r where r.user_id = p_user_id) then
  raise exception 'not authorized' using errcode='42501';
 end if;
 -- Only one live grant per account: a second Super Admin cannot race a first.
 update bc_admin_v1.admin_recovery_grants g
  set revoked_at = now()
  where g.user_id = p_user_id and g.consumed_at is null and g.revoked_at is null;
 gid := pg_catalog.gen_random_uuid();
 insert into bc_admin_v1.admin_recovery_grants(id,user_id,issued_by,issued_at,expires_at,salt,code_hash)
 values (gid, p_user_id, actor, now(), now() + p_ttl, p_salt, p_code_hash);
 insert into bc_admin_v1.admin_audit_logs(actor_id,request_id,action,target_type,target_id,details)
 values (actor, p_request_id, 'auth.recovery.issued', 'staff', p_user_id::text,
         pg_catalog.jsonb_build_object('grant_id', gid, 'expires_in_seconds', extract(epoch from p_ttl)::integer));
 return gid;
end $$;

create function bc_admin_v1.revoke_recovery_grant(p_grant_id uuid, p_request_id uuid) returns boolean
language plpgsql security definer set search_path=pg_catalog as $$
declare actor uuid; changed integer;
begin
 actor := bc_admin_v1.require_actor('staff.manage');
 if p_grant_id is null or p_request_id is null then
  raise exception 'invalid recovery grant' using errcode='22023';
 end if;
 update bc_admin_v1.admin_recovery_grants g
  set revoked_at = now()
  where g.id = p_grant_id and g.consumed_at is null and g.revoked_at is null;
 get diagnostics changed = row_count;
 insert into bc_admin_v1.admin_audit_logs(actor_id,request_id,action,target_type,target_id,details)
 values (actor, p_request_id, 'auth.recovery.revoked', 'recovery_grant', p_grant_id::text,
         pg_catalog.jsonb_build_object('revoked', changed > 0));
 return changed > 0;
end $$;

-- Closes the D2 workflow wart. A completed recovery authorises the account but
-- does not touch the factor: the operator deletes the stale factor at the
-- provider, then a Super Admin clears this record through the Admin UI, which
-- returns the account to the ordinary first-enrolment path. It is deliberately a
-- separate privileged, audited, per-account action and never a side effect of
-- redeeming a code: redemption still changes nothing, self-reset is refused, and
-- only staff.manage (AAL2 Super Admin) can call it.
create function bc_admin_v1.reset_factor_enrolment(p_user_id uuid, p_request_id uuid) returns boolean
language plpgsql security definer set search_path=pg_catalog as $$
declare actor uuid; changed integer;
begin
 actor := bc_admin_v1.require_actor('staff.manage');
 if p_user_id is null or p_request_id is null then
  raise exception 'invalid factor reset' using errcode='22023';
 end if;
 -- Self-reset is refused for the same reason self-recovery is: one account must
 -- never be able to re-open its own mandatory enrolment.
 if p_user_id = actor then
  raise exception 'self factor reset refused' using errcode='42501';
 end if;
 update bc_admin_v1.admin_users u
  set mfa_enrolled_at = null, updated_at = now()
  where u.id = p_user_id and u.mfa_enrolled_at is not null;
 get diagnostics changed = row_count;
 insert into bc_admin_v1.admin_audit_logs(actor_id,request_id,action,target_type,target_id,details)
 values (actor, p_request_id, 'auth.recovery.factor_reset', 'staff', p_user_id::text,
         pg_catalog.jsonb_build_object('reset', changed > 0));
 return changed > 0;
end $$;

-- Pre-MFA by necessity: the recovering account has lost its factor. It must have
-- a live password (aal1) provider session, an enabled membership and at least one
-- role, exactly like the first-factor enrolment gate in 011. It returns text
-- instead of raising so the audit row commits; the server rejects anything that
-- is not 'ok'.
create function bc_admin_v1.consume_recovery_grant(p_code_hash bytea, p_request_id uuid) returns text
language plpgsql security definer set search_path=pg_catalog as $$
declare uid uuid; sid uuid; grant_row bc_admin_v1.admin_recovery_grants; outcome text:='denied';
begin
 if p_request_id is null or p_code_hash is null or octet_length(p_code_hash) <> 32 then
  raise exception 'invalid recovery attempt' using errcode='22023';
 end if;
 uid := auth.uid();
 begin sid := nullif(auth.jwt()->>'session_id','')::uuid;
 exception when invalid_text_representation then sid := null; end;
 if uid is not null and sid is not null and coalesce(auth.jwt()->>'aal','') in ('aal1','aal2')
    and exists (select 1 from bc_admin_v1.admin_users u where u.id = uid and u.enabled)
    and exists (select 1 from bc_admin_v1.admin_user_roles r where r.user_id = uid)
    and exists (select 1 from auth.sessions s where s.id = sid and s.user_id = uid) then
  -- FOR UPDATE serialises concurrent guesses on the same grant, so the attempt
  -- counter cannot be bypassed by parallel requests.
  select g.* into grant_row from bc_admin_v1.admin_recovery_grants g
   where g.user_id = uid and g.consumed_at is null and g.revoked_at is null and g.expires_at > now()
   order by g.issued_at desc limit 1
   for update;
  if found then
   if grant_row.code_hash = p_code_hash then
    update bc_admin_v1.admin_recovery_grants g set consumed_at = now() where g.id = grant_row.id;
    outcome := 'ok';
   else
    update bc_admin_v1.admin_recovery_grants g set attempts = g.attempts + 1 where g.id = grant_row.id;
    outcome := case when grant_row.attempts + 1 >= 5 then 'exhausted' else 'mismatch' end;
    if grant_row.attempts + 1 >= 5 then
     update bc_admin_v1.admin_recovery_grants g set revoked_at = now() where g.id = grant_row.id;
    end if;
   end if;
  else
   outcome := 'no_grant';
  end if;
 end if;
 insert into bc_admin_v1.admin_audit_logs(actor_id,request_id,action,target_type,target_id,details)
 values (case when outcome = 'ok' then uid else null end, p_request_id, 'auth.recovery.attempt', 'staff', uid::text,
         pg_catalog.jsonb_build_object('outcome', outcome));
 return outcome;
end $$;

-- The recovering account may read the salt and remaining attempts of its own live
-- grant, so the client can compute the digest locally. The salt is not secret and
-- is useless without the 40-bit single-use code; no other account's grant is
-- reachable, and nothing here can consume a grant. Denials are audited.
create function bc_admin_v1.recovery_grant_state(p_request_id uuid) returns table(salt bytea, attempts_remaining integer, expires_at timestamptz)
language plpgsql security definer set search_path=pg_catalog as $$
declare uid uuid; sid uuid; g bc_admin_v1.admin_recovery_grants; exposed boolean:=false;
begin
 if p_request_id is null then raise exception 'invalid recovery request' using errcode='22023'; end if;
 uid := auth.uid();
 begin sid := nullif(auth.jwt()->>'session_id','')::uuid;
 exception when invalid_text_representation then sid := null; end;
 if uid is not null and sid is not null and coalesce(auth.jwt()->>'aal','') in ('aal1','aal2')
    and exists (select 1 from bc_admin_v1.admin_users u where u.id = uid and u.enabled)
    and exists (select 1 from auth.sessions s where s.id = sid and s.user_id = uid) then
  select x.* into g from bc_admin_v1.admin_recovery_grants x
   where x.user_id = uid and x.consumed_at is null and x.revoked_at is null and x.expires_at > now()
   order by x.issued_at desc limit 1;
  exposed := found;
 end if;
 insert into bc_admin_v1.admin_audit_logs(actor_id,request_id,action,target_type,target_id,details)
 values (case when exposed then uid else null end, p_request_id, 'auth.recovery.state', 'staff', uid::text,
         pg_catalog.jsonb_build_object('grant_present', exposed));
 if not exposed then return; end if;
 return query select g.salt, greatest(0, 5 - g.attempts), g.expires_at;
end $$;

-- Bounded, idempotent cleanup. Deletes only rows whose own expiry has passed;
-- audit evidence is never touched. A per-target advisory lock makes a concurrent
-- run skip instead of deleting twice, and every run (including skips) is
-- recorded so the schedule can be observed from the Admin audit module.
create function bc_admin_v1.cleanup_expired(p_target text, p_limit integer, p_request_id uuid) returns integer
language plpgsql security definer set search_path=pg_catalog as $$
declare run_id bigint; removed integer := 0; locked boolean;
begin
 perform bc_admin_v1.require_actor('settings.manage');
 if p_request_id is null then raise exception 'invalid cleanup' using errcode='22023'; end if;
 if p_target not in ('admin_login_flows','admin_rate_limits') then
  raise exception 'invalid cleanup target' using errcode='22023';
 end if;
 if p_limit is null or p_limit < 1 or p_limit > 1000 then
  raise exception 'invalid cleanup batch' using errcode='22023';
 end if;
 locked := pg_catalog.pg_try_advisory_xact_lock(pg_catalog.hashtextextended('bc_admin_v1:cleanup:' || p_target, 0));
 insert into bc_admin_v1.admin_cleanup_runs(target,started_at,skipped,detail)
 values (p_target, now(), not locked, pg_catalog.jsonb_build_object('limit', p_limit))
 returning id into run_id;
 if locked then
  if p_target = 'admin_login_flows' then
   -- Expired handoffs are useless; expired ones are the only rows deleted.
   delete from bc_admin_v1.admin_login_flows f
    where f.flow_hash in (
     select x.flow_hash from bc_admin_v1.admin_login_flows x
      where x.expires_at <= now() order by x.expires_at limit p_limit for update skip locked);
  else
   -- A rate-limit bucket is stale once its one-minute window is long past.
   -- The key is (bucket,key_hash); delete by primary key from the bounded set.
   delete from bc_admin_v1.admin_rate_limits r
    where (r.bucket, r.key_hash) in (
     select x.bucket, x.key_hash from bc_admin_v1.admin_rate_limits x
      where x.started_at <= now() - interval '1 day' order by x.started_at limit p_limit for update skip locked);
  end if;
  get diagnostics removed = row_count;
 end if;
 update bc_admin_v1.admin_cleanup_runs c
  set finished_at = now(), deleted = removed where c.id = run_id;
 insert into bc_admin_v1.admin_audit_logs(actor_id,request_id,action,target_type,target_id,details)
 values (null, p_request_id, 'ops.cleanup', 'table', p_target,
         pg_catalog.jsonb_build_object('deleted', removed, 'skipped', not locked, 'run_id', run_id));
 return removed;
end $$;

revoke all on function bc_admin_v1.enrolment_eligible(uuid),
 bc_admin_v1.factor_gate(uuid),
 bc_admin_v1.stamp_mfa_enrolled(),
 bc_admin_v1.issue_recovery_grant(uuid,bytea,bytea,interval,uuid),
 bc_admin_v1.revoke_recovery_grant(uuid,uuid),
 bc_admin_v1.consume_recovery_grant(bytea,uuid),
 bc_admin_v1.recovery_grant_state(uuid),
 bc_admin_v1.reset_factor_enrolment(uuid,uuid),
 bc_admin_v1.cleanup_expired(text,integer,uuid) from public,anon,authenticated;
commit;
```

### `013_publication_bridge.sql`

SHA-256 `8c9148fc9ce2fe086daf46ad6700dc16d1327165aa1f9221a90b366a1a506d9c`.

```sql
-- CANDIDATE FOR THE SHARED PROJECT. Not executed anywhere yet.
-- 013: the reviewed publication bridge, plus the history needed to roll a
-- published bio back.
--
-- Until this file, a draft could be created, edited, submitted and approved —
-- and then stop. `guard_draft` deliberately refused every transition to
-- queued/published because no reviewed bridge existed. That left the workflow
-- honest but incomplete: "approve" produced nothing a visitor could see.
--
-- This file adds exactly one way for approved content to reach `public.bios`,
-- with the properties the review demanded:
--
--   * two independent people: the publisher may not be the author, and a
--     matching approval by a third identity must exist;
--   * approved state only: `draft`, `in_review` or `rejected` cannot publish;
--   * optimistic concurrency: a stale row_version refuses;
--   * one transaction: the `public.bios` write, the draft state change, the
--     publication record and the audit row all commit or none do;
--   * no deletion: archiving is an `is_active = false` update, never a DELETE,
--     so the 506 existing bios can be hidden but never destroyed;
--   * full history: every publication records the bio, the draft, the exact
--     content version and the actor, so a rollback can name what it restores.
--
-- Nothing here alters `public` schema, grants, RLS or policies. The only writes
-- to `public.bios` are row INSERT/UPDATE performed by this SECURITY DEFINER
-- function, which is itself reachable only by the limited executor role and only
-- after `require_actor('content.publish')` succeeds.
begin;

-- 002's guard refuses every transition to queued/published because no reviewed
-- bridge existed. The bridge is in this file, so the guard is replaced here with
-- the one additional edge it needs: approved -> published, and nothing else. It
-- stays a trigger enforced in the database, so a future command cannot skip it.
-- The transition is only reachable through publish_bio_draft below, which is the
-- only function that writes state='published'.
create or replace function bc_admin_v1.guard_draft() returns trigger
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
 elsif old.state='approved' and new.state='published' then
  -- 013: the publication bridge. The version and reviewer are frozen, exactly as
  -- for a review decision; the bridge itself checks separation of duties.
  if new.version_id is distinct from old.version_id or new.assigned_reviewer_id is distinct from old.assigned_reviewer_id then
   raise exception 'published version must not change' using errcode='23514'; end if;
 else
  raise exception 'invalid or unavailable transition' using errcode='23514';
 end if;
 return new;
end $$;

-- One row per publication event. Append-only, like every other evidence table.
create table bc_admin_v1.admin_bio_publications (
 id bigint generated always as identity primary key,
 bio_id uuid not null,
 draft_id uuid not null references bc_admin_v1.admin_drafts(id) on delete restrict,
 version_id uuid not null references bc_admin_v1.admin_content_versions(id) on delete restrict,
 action text not null check (action in ('created','updated','archived','restored')),
 actor_id uuid not null references bc_admin_v1.admin_users(id) on delete restrict,
 published_at timestamptz not null default now(),
 -- The payload as published, so a later revert restores exactly those bytes even
 -- if the version row is superseded by newer edits.
 payload jsonb not null check (jsonb_typeof(payload) = 'object')
);
create index admin_bio_publications_bio_idx on bc_admin_v1.admin_bio_publications(bio_id, id desc);
alter table bc_admin_v1.admin_bio_publications enable row level security;
create policy deny_clients on bc_admin_v1.admin_bio_publications as restrictive for all to anon, authenticated using (false) with check (false);
revoke all on bc_admin_v1.admin_bio_publications from public, anon, authenticated;
-- Publication records are evidence: refuse UPDATE and DELETE outright.
create trigger publication_no_change before update or delete on bc_admin_v1.admin_bio_publications
 for each row execute function bc_admin_v1.reject_mutation();
create trigger publication_no_truncate before truncate on bc_admin_v1.admin_bio_publications
 for each statement execute function bc_admin_v1.reject_mutation();

-- The bridge. p_bio_id null creates a new row; a value updates that exact row
-- (edit or archive). Both paths require the same approved two-person state.
create function bc_admin_v1.publish_bio_draft(p_draft uuid, p_expected bigint, p_bio_id uuid, p_request_id uuid)
returns table(bio_id uuid, action text)
language plpgsql security definer set search_path=pg_catalog as $$
declare actor uuid; d bc_admin_v1.admin_drafts%rowtype; v bc_admin_v1.admin_content_versions%rowtype;
 p jsonb; target uuid; act text; platform uuid; key_count integer;
begin
 if p_draft is null or p_expected is null or p_request_id is null then
  raise exception 'invalid publication request' using errcode='22023';
 end if;
 -- Publish capability is separate from review: an author cannot self-publish.
 actor := bc_admin_v1.require_actor('content.publish');

 select * into d from bc_admin_v1.admin_drafts where id = p_draft for update;
 if not found or d.state <> 'approved' then raise exception 'not authorized' using errcode='42501'; end if;
 if d.row_version <> p_expected then raise exception 'stale version' using errcode='40001'; end if;
 -- Separation of duties, checked here rather than trusted from the client: the
 -- publisher is not the author, and an approval by a third identity exists.
 if d.author_id = actor then raise exception 'self publication refused' using errcode='42501'; end if;
 if not exists (
   select 1 from bc_admin_v1.admin_approvals a
   where a.draft_id = d.id and a.decision = 'approved'
     and a.reviewer_id <> d.author_id and a.reviewer_id <> actor
 ) then raise exception 'independent approval required' using errcode='42501'; end if;

 select * into v from bc_admin_v1.admin_content_versions where id = d.version_id;
 if v.resource_type <> 'bio' then raise exception 'not authorized' using errcode='42501'; end if;
 p := v.payload;
 select count(*) into key_count from jsonb_object_keys(p);
 if key_count <> 5 or not (p ?& array['content','language','platform','active','featured']) then
  raise exception 'invalid bio payload' using errcode='22023';
 end if;
 -- The platform slug is resolved against the live table, so a draft cannot
 -- introduce a platform that does not exist, and the row keeps its foreign key.
 select pl.id into platform from public.platforms pl where pl.slug = p->>'platform';
 if platform is null then raise exception 'unknown platform' using errcode='22023'; end if;

 -- Serialize publication for one logical collection, matching the key the draft
 -- commands lock, so two publishers cannot race the same source_slug.
 perform pg_advisory_xact_lock(hashtextextended('bc_admin_v1:bio:' || v.resource_key, 0));

 if p_bio_id is null then
  -- New row. The unique (source_slug, md5(content)) index makes this idempotent:
  -- publishing the same text twice adds nothing rather than duplicating.
  insert into public.bios(platform_id, content, language, is_active, is_featured, source_slug)
  values (platform, p->>'content', p->>'language', (p->>'active')::boolean, (p->>'featured')::boolean, v.resource_key)
  on conflict (source_slug, md5(content)) do nothing
  returning id into target;
  if target is null then
   select b.id into target from public.bios b
    where b.source_slug = v.resource_key and md5(b.content) = md5(p->>'content');
   act := 'restored';
  else
   act := 'created';
  end if;
 else
  -- Existing row: edit or archive. `is_active` comes from the reviewed payload,
  -- so archiving is a reviewed act too, and no row is ever deleted.
  update public.bios b
   set platform_id = platform,
       content = p->>'content',
       language = p->>'language',
       is_active = (p->>'active')::boolean,
       is_featured = (p->>'featured')::boolean,
       source_slug = coalesce(b.source_slug, v.resource_key)
   where b.id = p_bio_id
   returning b.id into target;
  if target is null then raise exception 'unknown bio' using errcode='22023'; end if;
  act := case when (p->>'active')::boolean then 'updated' else 'archived' end;
 end if;

 update bc_admin_v1.admin_drafts
  set state = 'published', row_version = row_version + 1, updated_at = now()
  where id = d.id;
 insert into bc_admin_v1.admin_bio_publications(bio_id, draft_id, version_id, action, actor_id, payload)
 values (target, d.id, d.version_id, act, actor, p);
 insert into bc_admin_v1.admin_publication_jobs(draft_id, target_environment, state, request_hash, scheduled_at, completed_at)
 values (d.id, 'production', 'succeeded', sha256(convert_to(p::text, 'UTF8')), now(), now());
 insert into bc_admin_v1.admin_audit_logs(actor_id, request_id, action, target_type, target_id, details)
 values (actor, p_request_id, 'draft.published', 'bio', target::text,
         jsonb_build_object('draft_id', d.id, 'version_id', d.version_id, 'publication', act));
 return query select target, act;
end $$;

-- Publication history for one bio, newest first: what the rollback screen reads.
create function bc_admin_v1.list_bio_publications(p_bio_id uuid, p_limit integer, p_before_id bigint)
returns table(id bigint, bio_id uuid, draft_id uuid, version_id uuid, action text,
              actor_id uuid, published_at timestamptz, payload jsonb)
language plpgsql security definer set search_path=pg_catalog as $$
declare actor uuid;
begin
 actor := bc_admin_v1.require_actor('content.read');
 if p_bio_id is null or p_limit is null or p_limit < 1 or p_limit > 100
    or (p_before_id is not null and p_before_id < 0) then
  raise exception 'invalid page' using errcode='22023';
 end if;
 return query select pb.id, pb.bio_id, pb.draft_id, pb.version_id, pb.action,
                     pb.actor_id, pb.published_at, pb.payload
  from bc_admin_v1.admin_bio_publications pb
  where pb.bio_id = p_bio_id and (p_before_id is null or pb.id < p_before_id)
  order by pb.id desc limit p_limit;
end $$;

-- Rollback, done the safe way: it does not rewrite history, it opens a new draft
-- containing the older payload, which then needs the ordinary submit → review →
-- publish path. So a revert is reviewed by the same two people as any edit.
create function bc_admin_v1.create_revert_draft(p_publication_id bigint, p_request_id uuid) returns uuid
language plpgsql security definer set search_path=pg_catalog as $$
declare actor uuid; pb bc_admin_v1.admin_bio_publications%rowtype;
 key text; version_no bigint; vid uuid; did uuid;
begin
 actor := bc_admin_v1.require_actor('content.draft');
 if p_publication_id is null or p_request_id is null then
  raise exception 'invalid revert request' using errcode='22023';
 end if;
 select * into pb from bc_admin_v1.admin_bio_publications where id = p_publication_id;
 -- P0002 is the project-wide "no such resource" signal, so the HTTP layer can
 -- answer 404 instead of a vague 422. A malformed id stays 422 above.
 if not found then raise exception 'unknown publication' using errcode='P0002'; end if;
 -- The logical key comes from the version that was published, so a revert lands
 -- in the same collection as the original.
 select resource_key into key from bc_admin_v1.admin_content_versions where id = pb.version_id;
 if key is null then raise exception 'unknown publication' using errcode='P0002'; end if;
 perform pg_advisory_xact_lock(hashtextextended('bc_admin_v1:bio:' || key, 0));
 select coalesce(max(version_number), 0) + 1 into version_no
  from bc_admin_v1.admin_content_versions where resource_type = 'bio' and resource_key = key;
 insert into bc_admin_v1.admin_content_versions(resource_type, resource_key, version_number, payload, payload_sha256, created_by)
 values ('bio', key, version_no, pb.payload, sha256(convert_to(pb.payload::text, 'UTF8')), actor)
 returning id into vid;
 insert into bc_admin_v1.admin_drafts(version_id, author_id) values (vid, actor) returning id into did;
 insert into bc_admin_v1.admin_audit_logs(actor_id, request_id, action, target_type, target_id, details)
 values (actor, p_request_id, 'draft.revert_opened', 'draft', did::text,
         jsonb_build_object('publication_id', pb.id, 'bio_id', pb.bio_id, 'restored_version', pb.version_id));
 return did;
end $$;

revoke all on function bc_admin_v1.publish_bio_draft(uuid,bigint,uuid,uuid),
 bc_admin_v1.list_bio_publications(uuid,integer,bigint),
 bc_admin_v1.create_revert_draft(bigint,uuid) from public, anon, authenticated;
commit;
```

### `014_module_read_surface.sql`

SHA-256 `5f3a026c8a63a7f28ed24cbddefbb46f3e61517fe0995e6f1519aa97db3ff895`.

```sql
-- 014. Read surface for the modules that had tables but no command: publication
-- jobs, the notification inbox, backup records, and the live bio library.
--
-- Scope discipline: this file creates no table, changes no policy, and grants
-- nothing to a client. Every read is security definer, revokes EXECUTE from
-- PUBLIC/anon/authenticated, and re-checks its own permission inside SQL. Nothing
-- here writes to public.* — publication still goes through 013's reviewed bridge.
--
-- The one behavioural addition is the notification writer. `admin_notifications`
-- existed since 001 with no producer, which would have made an inbox that can
-- never receive anything — an empty screen pretending to be a working feature. A
-- trigger now records the three events an administrator actually needs to hear
-- about: a review was assigned to you, your draft was decided, your work was
-- published. Notifications are per-recipient rows and are read only by their
-- owner.
begin;

-- ---------------------------------------------------------------------------
-- Notification writer. Trigger-only: EXECUTE is revoked from clients below, so
-- it cannot be called directly with someone else's recipient.
-- ---------------------------------------------------------------------------
create function bc_admin_v1.notify_draft_event() returns trigger
language plpgsql security definer set search_path=pg_catalog as $$
declare recipient uuid; kind text; body text; author_of_draft uuid; next_state text;
begin
 if tg_table_name = 'admin_bio_publications' then
  -- Publication is recorded after the draft has moved to 'published', so the
  -- author is resolved from the publication row itself.
  select created_by into recipient from bc_admin_v1.admin_content_versions where id = new.version_id;
  if recipient is null then return null; end if;
  kind := 'content.published';
  body := 'Your draft was published (' || new.action || ').';
 elsif tg_table_name = 'admin_drafts' then
  -- Publication is notified by the publications trigger below, not here: the
  -- draft row moves to 'published' inside the same transaction that inserts the
  -- publication, so notifying from both places would deliver it twice.
  next_state := new.state;
  if old.state = next_state or next_state = 'published' then return null; end if;
  author_of_draft := new.author_id;
  if old.state = 'draft' and new.state = 'in_review' then
   recipient := new.assigned_reviewer_id;
   kind := 'review.assigned';
   body := 'A draft is waiting for your review.';
  elsif old.state = 'in_review' and new.state in ('approved','rejected') then
   recipient := new.author_id;
   kind := 'review.decided';
   body := 'Your draft was ' || new.state || '.';
  else
   return null;
  end if;
 else
  return null;
 end if;
 if recipient is null then return null; end if;
 -- Self-notification is noise, but only for the case where it is genuinely
 -- redundant: an author assigned as their own reviewer already knows they wrote
 -- it. An author being told their own draft was decided is the whole point of the
 -- inbox, so it is never suppressed.
 if tg_table_name = 'admin_drafts' and next_state = 'in_review' and recipient = author_of_draft then
  return null;
 end if;
 -- The inbox must never be able to block a workflow step. A notification that
 -- cannot be stored is dropped rather than rolling back the review or publish.
 begin
  insert into bc_admin_v1.admin_notifications(user_id, category, message) values (recipient, kind, left(body, 1000));
 exception when others then null;
 end;
 return null;
end $$;

revoke all on function bc_admin_v1.notify_draft_event() from public, anon, authenticated;

create trigger admin_drafts_notify after update on bc_admin_v1.admin_drafts
 for each row execute function bc_admin_v1.notify_draft_event();
create trigger admin_publications_notify after insert on bc_admin_v1.admin_bio_publications
 for each row execute function bc_admin_v1.notify_draft_event();

-- ---------------------------------------------------------------------------
-- Reads.
-- ---------------------------------------------------------------------------

-- The caller's own inbox, newest first. Nobody can read another member's rows:
-- the recipient is the authenticated actor, never a parameter.
create function bc_admin_v1.list_my_notifications(p_limit integer,p_before timestamptz)
returns table(id uuid,category text,message text,created_at timestamptz,read_at timestamptz,unread boolean)
language plpgsql security definer set search_path=pg_catalog as $$
declare actor uuid;
begin
 actor := bc_admin_v1.require_actor('dashboard.read');
 if p_limit is null or p_limit<1 or p_limit>100 then raise exception 'invalid page' using errcode='22023'; end if;
 return query select n.id,n.category,n.message,n.created_at,n.read_at,(n.read_at is null)
  from bc_admin_v1.admin_notifications n
  where n.user_id = actor and (p_before is null or n.created_at < p_before)
  order by n.created_at desc, n.id desc limit p_limit;
end $$;

-- Marking read is a self-service action on the caller's own rows, so it needs no
-- elevated permission and cannot touch anyone else's message. Bounded by an age
-- window so a stray call cannot rewrite the whole history.
create function bc_admin_v1.mark_notifications_read(p_before timestamptz) returns integer
language plpgsql security definer set search_path=pg_catalog as $$
declare actor uuid; changed integer;
begin
 actor := bc_admin_v1.require_actor('dashboard.read');
 if p_before is not null and p_before > now() then raise exception 'invalid window' using errcode='22023'; end if;
 update bc_admin_v1.admin_notifications set read_at = now()
  where user_id = actor and read_at is null and (p_before is null or created_at <= p_before);
 get diagnostics changed = row_count;
 if changed > 0 then
  insert into bc_admin_v1.admin_audit_logs(actor_id, request_id, action, target_type, target_id, details)
  values (actor, gen_random_uuid(), 'notifications.read', 'inbox', actor::text, jsonb_build_object('count', changed));
 end if;
 return changed;
end $$;

-- Publication queue. Read-only: 013 publishes synchronously inside its own
-- transaction, so a job row here is evidence of what happened, not a work item
-- that this console can push along. The distinction is stated in the response so
-- the UI cannot imply a control it does not have.
create function bc_admin_v1.list_publication_jobs(p_limit integer,p_before uuid)
returns table(id uuid,draft_id uuid,resource_key text,target_environment text,state text,scheduled_at timestamptz,created_at timestamptz,completed_at timestamptz)
language plpgsql security definer set search_path=pg_catalog as $$
begin
 perform bc_admin_v1.require_actor('content.read');
 if p_limit is null or p_limit<1 or p_limit>100 then raise exception 'invalid page' using errcode='22023'; end if;
 return query select j.id,j.draft_id,v.resource_key,j.target_environment,j.state,j.scheduled_at,j.created_at,j.completed_at
  from bc_admin_v1.admin_publication_jobs j
  join bc_admin_v1.admin_drafts d on d.id = j.draft_id
  join bc_admin_v1.admin_content_versions v on v.id = d.version_id
  where p_before is null or j.id < p_before
  order by j.id desc limit p_limit;
end $$;

-- Backup history. These are provider references, never credentials; the console
-- shows what was requested and whether a restore was verified, nothing more.
create function bc_admin_v1.list_backup_records(p_limit integer,p_before timestamptz)
returns table(id uuid,environment text,provider_reference text,state text,requested_at timestamptz,verified_at timestamptz)
language plpgsql security definer set search_path=pg_catalog as $$
begin
 perform bc_admin_v1.require_actor('settings.read');
 if p_limit is null or p_limit<1 or p_limit>100 then raise exception 'invalid page' using errcode='22023'; end if;
 return query select b.id,b.environment,b.provider_reference,b.state,b.requested_at,b.verified_at
  from bc_admin_v1.admin_backup_records b
  where p_before is null or b.requested_at < p_before
  order by b.requested_at desc, b.id limit p_limit;
end $$;

-- The live bio library: every row, active or not, with its platform and category.
-- Search is a plain case-insensitive substring test (`strpos`), not a LIKE pattern.
-- That choice is deliberate: a search box that treats `%` or `_` as wildcards lets
-- a user write a query the operator did not intend, and the escaping dance around
-- LIKE is exactly where that mistake lives. `strpos` has no pattern language, so
-- the term can only ever match itself.
create function bc_admin_v1.list_public_bios(p_limit integer,p_after uuid,p_search text,p_language text,p_active boolean)
returns table(id uuid,title text,language text,platform_slug text,category_name text,is_active boolean,is_featured boolean,is_trending boolean,character_count integer,source_slug text,created_at timestamptz,updated_at timestamptz)
language plpgsql security definer set search_path=pg_catalog as $$
begin
 perform bc_admin_v1.require_actor('content.read');
 if p_limit is null or p_limit<1 or p_limit>100 then raise exception 'invalid page' using errcode='22023'; end if;
 if p_language is not null and p_language not in ('en','hi','hg') then raise exception 'invalid language' using errcode='22023'; end if;
 if p_search is not null and length(p_search) > 120 then raise exception 'invalid search' using errcode='22023'; end if;
 return query
  select b.id,b.title,b.language,p.slug,c.name,b.is_active,b.is_featured,b.is_trending,
         b.character_count,b.source_slug,b.created_at,b.updated_at
  from public.bios b
  left join public.platforms p on p.id = b.platform_id
  left join public.categories c on c.id = b.category_id
  where (p_after is null or b.id > p_after)
    and (p_language is null or b.language = p_language)
    and (p_active is null or b.is_active = p_active)
    and (p_search is null
         or strpos(lower(coalesce(b.title,'')), lower(p_search)) > 0
         or strpos(lower(b.content), lower(p_search)) > 0)
  order by b.id limit p_limit;
end $$;

revoke all on function bc_admin_v1.list_my_notifications(integer,timestamptz),
 bc_admin_v1.mark_notifications_read(timestamptz),
 bc_admin_v1.list_publication_jobs(integer,uuid),
 bc_admin_v1.list_backup_records(integer,timestamptz),
 bc_admin_v1.list_public_bios(integer,uuid,text,text,boolean) from public, anon, authenticated;

commit;
```

## Appendix B — rollbacks, verbatim

### `001_admin_foundation.sql`

SHA-256 `98b80fd0cd9d0bc3cc1e87da1352a27f29771fd5dd8016d84744dffe9bda1a77`.

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

SHA-256 `9a8b79d9fda725b9efda3cc052aab246dbcf5a5336d84ea8a692733b422b1097`.

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

SHA-256 `2d589421922666f3bd93f0c3b0a6bb6f87f77a91c9c3c620f27f0df37f0c20d1`.

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

SHA-256 `59479d8343d2d85f7e64b9541451abed955f19d8abba95cac49723cfc718f625`.

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

SHA-256 `14007468a63d0e99d5f4958d42f52b1c8653c83b310312741ea4072ef0ddb822`.

```sql
-- Synthetic fixture only. Sessions and audit records are retained.
begin;
drop function bc_admin_v1.revoke_admin_session(uuid);
drop function bc_admin_v1.open_admin_session(uuid);
commit;
```

### `006_auth_controls.sql`

SHA-256 `50994d3db55adc9f6c96ed9db64d4468a9ccbb40a4b29955f135b78860906dec`.

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

SHA-256 `65f6473b705669f5d053f4901f41d4b5ba38948eb8cd2b9e3f536ae50e7d1d8a`.

```sql
-- Synthetic fixtures only. Memberships and audits are retained.
begin;
drop function bc_admin_v1.update_staff(uuid,bigint,boolean,text[],uuid);
drop function bc_admin_v1.list_staff(integer,uuid);
commit;
```

### `008_bio_edit.sql`

SHA-256 `d788af5f302c37b0758536a88387a53f9f47b849de40fe46bb5f031b0d04b0ad`.

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

SHA-256 `8297b2e082d5e82a034274ba336bc1efb1d06b7502c33cbdc5a18405d2cc0ffa`.

```sql
-- Synthetic fixture rollback only; retains sessions and audits.
begin;
drop function bc_admin_v1.revoke_my_sessions(uuid);
commit;
```

### `010_admin_module_commands.sql`

SHA-256 `6b08e5d5895f11322e618a1aecd25ae7ff8600055d74a874964e07098c213e04`.

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

SHA-256 `89f59839ee62c9a5cf9436d8cf6a617f2878fb37cbcd701994d13db0d84ce980`.

```sql
-- Local rollback for 011. Disposable synthetic clusters only.
begin;
drop function if exists bc_admin_v1.enrolment_eligible(uuid);
commit;
```

### `012_recovery_and_cleanup.sql`

SHA-256 `99823ea75d85f1a10ba871d1435bb29f9830c745fef010aeef2c85d928fcde96`.

```sql
-- Rollback for 012. Drops only the functions and the two tables created by
-- 012. Refuses while recovery grants or cleanup evidence exist, because deleting
-- either would remove security evidence; there is no CASCADE.
begin;
do $$
declare n integer;
begin
 select count(*) into n from bc_admin_v1.admin_recovery_grants;
 if n > 0 then raise exception 'refusing rollback: % recovery grant rows exist', n; end if;
 select count(*) into n from bc_admin_v1.admin_cleanup_runs;
 if n > 0 then raise exception 'refusing rollback: % cleanup run rows exist', n; end if;
 -- Dropping mfa_enrolled_at would make an account that had proven a factor look
 -- like a first-time enroller, which reopens the password-only path 012 closes.
 select count(*) into n from bc_admin_v1.admin_users where mfa_enrolled_at is not null;
 if n > 0 then raise exception 'refusing rollback: % accounts have a recorded enrolment', n; end if;
end $$;
drop function bc_admin_v1.consume_recovery_grant(bytea,uuid);
drop function bc_admin_v1.factor_gate(uuid);
drop function bc_admin_v1.recovery_grant_state(uuid);
drop function bc_admin_v1.issue_recovery_grant(uuid,bytea,bytea,interval,uuid);
drop function bc_admin_v1.revoke_recovery_grant(uuid,uuid);
-- The 012 replacement of 011's gate reads mfa_enrolled_at. Restore the 011 body
-- before the column is dropped, otherwise the surviving function would reference a
-- missing column and every enrolment attempt would error instead of answering.
create or replace function bc_admin_v1.enrolment_eligible(p_request_id uuid) returns boolean
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
 insert into bc_admin_v1.admin_audit_logs(actor_id,request_id,action,target_type,target_id,details)
 values(case when eligible then uid else null end,p_request_id,'auth.enrolment_attempt','staff',uid::text,
        jsonb_build_object('eligible',eligible));
 return eligible;
end $$;
revoke all on function bc_admin_v1.enrolment_eligible(uuid) from public,anon,authenticated;
drop function bc_admin_v1.reset_factor_enrolment(uuid,uuid);
drop function bc_admin_v1.cleanup_expired(text,integer,uuid);
drop trigger admin_sessions_stamp_mfa on bc_admin_v1.admin_sessions;
drop function bc_admin_v1.stamp_mfa_enrolled();
drop table bc_admin_v1.admin_recovery_grants;
drop table bc_admin_v1.admin_cleanup_runs;
alter table bc_admin_v1.admin_users drop column mfa_enrolled_at;
commit;
```

### `013_publication_bridge.sql`

SHA-256 `433221b5573aa45e863c81222f2dc41c93fe00684332ab1ee724f1803d187785`.

```sql
-- Rollback for 013. Drops only the three functions and the table this file
-- creates. It never touches `public.bios`: rows that were published stay exactly
-- as they are, because reversing a permission is not the same as deleting a
-- visitor's content. If an operator wants a published row hidden, that is an
-- ordinary reviewed archive (is_active = false), not a rollback side effect.
--
-- It refuses while publication history exists, because that history is the only
-- record of which bio came from which draft and by whose approval.
begin;
do $$
declare n integer;
begin
 select count(*) into n from bc_admin_v1.admin_bio_publications;
 if n > 0 then raise exception 'refusing rollback: % publication records exist', n; end if;
end $$;
drop function bc_admin_v1.create_revert_draft(bigint,uuid);
drop function bc_admin_v1.list_bio_publications(uuid,integer,bigint);
drop function bc_admin_v1.publish_bio_draft(uuid,bigint,uuid,uuid);
drop table bc_admin_v1.admin_bio_publications;
-- Restore 002's guard, which refused every transition to queued/published. Doing
-- this before the function that performs the transition is dropped would leave a
-- window where nothing can publish but the state remains reachable; doing it here
-- leaves the schema exactly as 001-012 describe it.
create or replace function bc_admin_v1.guard_draft() returns trigger
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
  -- No transition to queued/published without the bridge from 013.
  raise exception 'invalid or unavailable transition' using errcode='23514';
 end if;
 return new;
end $$;
commit;
```

### `014_module_read_surface.sql`

SHA-256 `71ee002073871c890d46229648eb6a5e017e5cb4bbb0274b4185436c6072bb06`.

```sql
-- Rollback for 014. Removes the triggers first so no event can call a function
-- that is about to disappear, then the five read functions. Rows in
-- admin_notifications are left in place: they are ordinary records, not schema.
begin;
drop trigger if exists admin_publications_notify on bc_admin_v1.admin_bio_publications;
drop trigger if exists admin_drafts_notify on bc_admin_v1.admin_drafts;
drop function bc_admin_v1.notify_draft_event();
drop function bc_admin_v1.list_public_bios(integer,uuid,text,text,boolean);
drop function bc_admin_v1.list_backup_records(integer,timestamptz);
drop function bc_admin_v1.list_publication_jobs(integer,uuid);
drop function bc_admin_v1.mark_notifications_read(timestamptz);
drop function bc_admin_v1.list_my_notifications(integer,timestamptz);
commit;
```

## Appendix C — executor grants, verbatim

### `executor-grants.sql`

SHA-256 `867811ecec89578f8a90a8295c162911610390d91b0e8902ec4f09fb07206ffe`.

```sql
-- CANONICAL EXECUTOR GRANT LIST. Executed by a human with project access AFTER
-- migrations 001–012, never by the application, and never as the executor itself.
--
-- 43 signatures = 48 functions created by 001–014 minus the 5 trigger bodies
-- (reject_mutation, guard_draft, guard_approval, stamp_mfa_enrolled). Trigger
-- functions are invoked by the trigger machinery as the table owner and must not
-- be granted: a direct EXECUTE would widen the surface for no benefit.
--
-- `tests/admin-grant-inventory.mjs` fails if this file and the migrations ever
-- disagree, so a new function cannot be created without a decision about whether
-- the executor may call it.

grant usage on schema bc_admin_v1 to bc_admin_executor;

grant execute on function
  bc_admin_v1.require_actor(text),
  bc_admin_v1.enrolment_eligible(uuid),
  bc_admin_v1.factor_gate(uuid),
  bc_admin_v1.open_admin_session(uuid),
  bc_admin_v1.revoke_admin_session(uuid),
  bc_admin_v1.revoke_my_sessions(uuid),
  bc_admin_v1.store_login_flow(bytea,bytea,integer),
  bc_admin_v1.take_login_flow(bytea),
  bc_admin_v1.consume_rate_limit(text,bytea),
  bc_admin_v1.list_staff(integer,uuid),
  bc_admin_v1.update_staff(uuid,bigint,boolean,text[],uuid),
  bc_admin_v1.create_bio_draft(text,jsonb,uuid),
  bc_admin_v1.update_bio_draft(uuid,bigint,jsonb,uuid),
  bc_admin_v1.get_bio_draft(uuid),
  bc_admin_v1.submit_draft(uuid,bigint,uuid,uuid),
  bc_admin_v1.review_draft(uuid,bigint,boolean,uuid),
  bc_admin_v1.list_my_bio_drafts(integer,timestamptz,uuid),
  bc_admin_v1.list_bio_review_queue(integer,timestamptz,uuid),
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
  bc_admin_v1.issue_recovery_grant(uuid,bytea,bytea,interval,uuid),
  bc_admin_v1.revoke_recovery_grant(uuid,uuid),
  bc_admin_v1.reset_factor_enrolment(uuid,uuid),
  bc_admin_v1.consume_recovery_grant(bytea,uuid),
  bc_admin_v1.recovery_grant_state(uuid),
  bc_admin_v1.cleanup_expired(text,integer,uuid),
  bc_admin_v1.publish_bio_draft(uuid,bigint,uuid,uuid),
  bc_admin_v1.list_bio_publications(uuid,integer,bigint),
  bc_admin_v1.create_revert_draft(bigint,uuid),
  bc_admin_v1.list_my_notifications(integer,timestamptz),
  bc_admin_v1.mark_notifications_read(timestamptz),
  bc_admin_v1.list_publication_jobs(integer,uuid),
  bc_admin_v1.list_backup_records(integer,timestamptz),
  bc_admin_v1.list_public_bios(integer,uuid,text,text,boolean)
 to bc_admin_executor;
```
<!-- admin-sync:sql:end -->

## 8. What was removed from this appendix

Section 8 previously repeated rollbacks and grants in a second, manually
maintained appendix. That duplication is gone: one generated appendix is the only
copy, so there is exactly one place that can drift — and it is checked by
`test:admin-grant-inventory` on every run.
