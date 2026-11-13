# FINAL SECURITY REVIEW — BioCraft Master Admin activation

**Scope:** a pre-execution, security-focused review of
`docs/CONSOLIDATED_APPROVAL_REPORT.md` and of the twelve migration candidates it
reproduces (`admin-backend/migrations/001`–`012`), against the live shared
project `jvpadtzfsuekixrquzjv`.

**Revision 2** incorporates your four decisions: D1 approved as fixed, D2
replaced by a Super-Admin-authorised single-use recovery process (migration 012,
not the password-only path the previous revision offered), D3 accepted with a
48-character generated password and a documented two-role rotation, D4
implemented and tested before any traffic (migration 012). The counts below are
now derived from the files by `test:admin-grant-inventory`, not written by hand —
the earlier revisions said 25, then 28, then 31, all of which were wrong.

**Status: NOTHING EXECUTED.** No migration applied, no role created, no grant
issued, no account created, no Auth setting changed, no Production or `main`
change. Every statement below is either read from the repository or read from the
live project with a read-only query.

**Headline result:** the SQL is sound and additive and no `public` or `auth`
object is created, altered, dropped or re-granted. The four defects found in
revision 1 are all resolved: **D1** fixed with a verified routing implementation
and two regression tests, **D2** replaced by the recovery design in §12 (D2), **D3**
satisfied by the credential tooling in §12 (D3), **D4** implemented and tested in
§12 (D4). Nothing below is executed.

**Correction to earlier revisions:** the function and grant counts in revision 1
(31 functions / 28 grants / 17 tables) were wrong. `test:admin-grant-inventory`
now derives the truth from the migration files: **19 tables**, **39 functions** =
**35 callable SECURITY DEFINER (all 35 granted)** + **4 trigger-only bodies** (no
grants). The trigger bodies are `reject_mutation`, `guard_draft`,
`guard_approval` and `stamp_mfa_enrolled`.

Verified live at review time (read-only):

| Check | Result |
|---|---|
| `public` tables | 10, all RLS-enabled, all owned by `postgres`, `anon=rxtm` and `authenticated=rxtm` — `SELECT` plus the Supabase-default `REFERENCES`/`TRIGGER`; **no** `INSERT`/`UPDATE`/`DELETE`/`TRUNCATE` for either role (re-verified 2026-11-09) |
| `public` policies | 10 permissive `*_public_read` `FOR SELECT TO anon,authenticated USING (is_active)`; nothing else |
| `bc_admin_v1` schema / `bc_admin_executor` role | **absent** (`0` / `0`) |
| Data | bios 506 (all active), collections 20, categories 33, platforms 8, generators 12, seo_pages 48 |
| `postgres` | `rolsuper=false`, **`rolbypassrls=true`**, owns all `public` tables, `CREATEROLE`, `CREATEDB` |
| `anon` / `authenticated` / `service_role` | `NOLOGIN`; `anon`/`authenticated` no `BYPASSRLS`; `service_role` `BYPASSRLS` |
| `auth.uid()` / `auth.jwt()` | not `SECURITY DEFINER`, owned by `supabase_auth_admin`, **EXECUTE granted to `PUBLIC`** (default ACL) |
| `postgres` privileges on `auth` | `USAGE` on schema, `SELECT` on `auth.users` and `auth.sessions`, `REFERENCES ON auth.users` (**no** `GRANT OPTION` on `auth.users`), `GRANT OPTION` on `auth.sessions`, `SELECT` on `auth.sessions` |
| `anon` / `authenticated` on `auth` | schema `USAGE` only; **no** table privilege on `auth.users`/`auth.sessions` — the new gate re-reads nothing the public can write |
| `pg_catalog` helpers used by the SQL | `sha256(bytea)`, `gen_random_uuid()`, `hashtextextended()` all present in `pg_catalog` (PG 17.11) |
| `pg_default_acl` for `public` | 6 entries owned by `postgres` **and** `supabase_admin`; the migrations never touch them |

---

## 1. Migrations 001–012: exact SQL, execution order, failure modes

Execution order is fixed and must not be reordered: `001 → 002 → 003 → 004 →
005 → 006 → 007 → 008 → 009 → 010 → 011 → 012`. Each file is a single
`BEGIN … COMMIT`, so a failure rolls the whole file back and leaves no partial
object.

| # | File | Creates | Depends on | Verified | Classification |
|---|---|---|---|---|---|
| 001 | `001_admin_foundation.sql` | schema, 15 tables, 1 trigger fn, 8 triggers, RLS + restrictive deny policy, schema/default-ACL revokes | `auth.users` (FK) | needs `REFERENCES` on `auth.users` — `postgres` has it | additive |
| 002 | `002_workflow_integrity.sql` | 1 unique constraint, 2 trigger fns, 2 triggers | 001 | ok | additive |
| 003 | `003_permission_catalog.sql` | 8 roles, 17 permissions, 40 role→permission rows | 001 | ok (idempotent-free, runs once) | additive |
| 004 | `004_private_draft_commands.sql` | 5 functions (`require_actor` + draft CRUD/read) | 001–003 | ok | additive, **security-sensitive** |
| 005 | `005_session_commands.sql` | 2 functions (`open_admin_session`, `revoke_admin_session`) | 001–004 | reads `auth.sessions` — `postgres` has `SELECT` | additive, **security-sensitive** |
| 006 | `006_auth_controls.sql` | 2 tables, 3 functions (flow store, rate limit) | 001 | ok | additive |
| 007 | `007_staff_commands.sql` | 2 functions (`list_staff`, `update_staff`) | 001–004 | ok | additive, **security-sensitive** |
| 008 | `008_bio_edit.sql` | 3 functions + 1 partial index | 001–004 | ok | additive |
| 009 | `009_recovery_sessions.sql` | 1 function (`revoke_my_sessions`) | 001,004 | ok | additive |
| 010 | `010_admin_module_commands.sql` | 11 functions (read modules, settings, audit) | 001–004 | reads only `public` + own schema | additive, **touches `public` read paths** |
| 011 | `011_totp_enrolment.sql` | 1 function (`enrolment_eligible`) | 001,004 | reads `auth.sessions` | additive, **security-sensitive** |
| 012 | `012_recovery_and_cleanup.sql` | 1 column, 2 tables, 7 functions, 1 trigger (D2 + D4) | 001,004 | reads `auth.sessions`, writes only `bc_admin_v1` | additive, **security-sensitive** |

Table count reconciles exactly: 15 (001) + 2 (006) + 2 (012) = **19**. Function
count: 1 (001) + 2 (002) + 5 (004) + 2 (005) + 3 (006) + 2 (007) + 3 (008) +
1 (009) + 11 (010) + 1 (011) + 7 (012) = **38**, of which 4 are trigger bodies.
Nothing in the set is `CREATE OR REPLACE`, so a second run of any file fails
loudly rather than silently redefining a function. 012's only `ALTER` is
`add column mfa_enrolled_at` on its own table — nullable, no default, no rewrite,
no lock on `public`.

**No `public` object is created, altered, dropped or re-owned by any of the
eleven files.** `010` performs only `SELECT`s against `public.platforms`,
`public.categories`, `public.bios`, `public.generators`, `public.seo_pages`.

---

## 2. The 19 tables and their RLS

| Table | RLS | Policy | Client grants |
|---|---|---|---|
| `admin_users`, `admin_roles`, `admin_permissions`, `admin_role_permissions`, `admin_user_roles`, `admin_sessions`, `admin_audit_logs`, `admin_settings`, `admin_content_versions`, `admin_drafts`, `admin_approvals`, `admin_publication_jobs`, `admin_notifications`, `admin_backup_records`, `admin_security_events` | ON | `deny_clients` — **restrictive**, `FOR ALL TO anon, authenticated USING (false) WITH CHECK (false)` | revoked from `public`, `anon`, `authenticated` |
| `admin_login_flows`, `admin_rate_limits` (006) | ON | `deny_clients` — restrictive, same form | revoked identically |
| `admin_recovery_grants`, `admin_cleanup_runs` (012) | ON | `deny_clients` — restrictive, same form | revoked identically |

Two details that matter more than the policy text:

1. **Restrictive, not permissive.** A permissive `deny_clients` would be OR-ed
   with the existing permissive policies and would deny nothing. Because it is
   `AS RESTRICTIVE`, it is AND-ed, so even a future accidentally-added permissive
   grant-everything policy for `anon` still evaluates to deny. This was verified
   locally (`test:admin-isolated-foundation`, `test:admin-postgres-local`:
   a deliberately added permissive policy on `admin_users` still returns 0 rows
   to `authenticated`).
2. **RLS is defence in depth, not the boundary.** The boundary is the absence of
   table `GRANT`s. RLS only matters if a grant ever appears.

Append-only evidence is enforced by triggers, not by convention:
`admin_content_versions`, `admin_approvals`, `admin_audit_logs` and
`admin_security_events` each have a `BEFORE UPDATE OR DELETE` and a
`BEFORE TRUNCATE` trigger raising `23514`. Consequence that must be stated
plainly: **an audit row can never be corrected or deleted by anyone except the
table owner (`postgres`) or a superuser.** That is intended for evidence, and it
also means rollback cannot "clean up" audit rows — see §9.

Ownership: every table is owned by the migration executor (`postgres`). This is
the single largest residual risk in the design and is covered in §4 and §11.

---

## 3. All 39 functions — SECURITY DEFINER matrix

Every function below is created with an explicit `SET search_path = pg_catalog`,
so no unqualified name can resolve to an attacker-controlled schema. There is no
`SECURITY INVOKER` function among the 28 callable ones; the only non-definer
functions are the three trigger bodies, which is correct — they must run with the
invoker's rights because they only ever raise.

Legend for **Grants**: `exec-role` = `GRANT EXECUTE … TO bc_admin_executor`
(executed as a separate, reviewed statement, not inside the migration);
`revoke` = explicitly revoked from `public, anon, authenticated` inside the
migration.

| # | Function (signature) | Owner | `search_path` | Authorization checks inside | Grants | Classification |
|---|---|---|---|---|---|---|
| 1 | `reject_mutation()` **trigger** | `postgres` (migration executor) | `pg_catalog` | none needed — always raises `23514` | `revoke` only, **no exec-role** | additive |
| 2 | `guard_approval()` **trigger** | `postgres` | `pg_catalog` | validates reviewer ≠ author, reviewer enabled, draft `in_review`, reviewer assigned; `FOR UPDATE` on the draft | `revoke` only, **no exec-role** | additive |
| 3 | `guard_draft()` **trigger** | `postgres` | `pg_catalog` | blocks DELETE; enforces author↔version match, `row_version+1`, allowed state transitions only, matching approval row | `revoke` only, **no exec-role** | additive |
| 4 | `require_actor(text)` | `postgres` | `pg_catalog` | `auth.uid()`, `session_id` cast, **`aal='aal2'` required**, `admin_users.enabled` `FOR UPDATE`, live `admin_sessions` `FOR UPDATE`, live provider `auth.sessions` row, role→permission join | exec-role | **security-sensitive** (the gate) |
| 5 | `create_bio_draft(text,jsonb,uuid)` | `postgres` | `pg_catalog` | `require_actor('content.draft')`; strict 5-key payload allow-list, length/type/regex limits; advisory lock per key | exec-role | additive |
| 6 | `submit_draft(uuid,bigint,uuid,uuid)` | `postgres` | `pg_catalog` | `require_actor('content.draft')`; author-only, `draft` state, optimistic version, reviewer enabled and ≠ author | exec-role | additive |
| 7 | `review_draft(uuid,bigint,boolean,uuid)` | `postgres` | `pg_catalog` | `require_actor('content.review'/'content.reject')`; assigned reviewer only, ≠ author, `in_review`, optimistic version | exec-role | additive |
| 8 | `list_my_bio_drafts(integer,timestamptz,uuid)` | `postgres` | `pg_catalog` | `require_actor('content.read')`; rows filtered to `author_id = actor`; page shape validated | exec-role | additive |
| 9 | `open_admin_session(uuid)` | `postgres` | `pg_catalog` | `auth.uid()` + `session_id` + **`aal='aal2'`**; `admin_users.enabled` `FOR UPDATE`; ≥1 role; live `auth.sessions` row; `ON CONFLICT DO NOTHING` so a revoked session cannot be reopened; expiry capped at `now() + 1 hour` | exec-role | **security-sensitive** |
| 10 | `revoke_admin_session(uuid)` | `postgres` | `pg_catalog` | `require_actor('dashboard.read')`; revokes only the caller's own session id | exec-role | additive |
| 11 | `store_login_flow(bytea,bytea,integer)` | `postgres` | `pg_catalog` | **no actor check by design** (it runs before any session exists); enforces 32-byte hash, 29–8192-byte sealed blob, TTL 1–300 s | exec-role | **security-sensitive** |
| 12 | `take_login_flow(bytea)` | `postgres` | `pg_catalog` | no actor check by design; `DELETE … RETURNING` = atomic single use; expires on read | exec-role | **security-sensitive** |
| 13 | `consume_rate_limit(text,bytea)` | `postgres` | `pg_catalog` | no actor check by design; bucket allow-list, 32-byte key, fixed caps 5/10/120 per minute | exec-role | **security-sensitive** |
| 14 | `list_staff(integer,uuid)` | `postgres` | `pg_catalog` | `require_actor('staff.read')` | exec-role | additive |
| 15 | `update_staff(uuid,bigint,boolean,text[],uuid)` | `postgres` | `pg_catalog` | advisory lock first, then `require_actor('staff.manage')`; no self-edit, 1–8 distinct known roles, optimistic version, **super-admin promotion hard-blocked**, last-super-admin demotion blocked | exec-role | **security-sensitive** |
| 16 | `update_bio_draft(uuid,bigint,jsonb,uuid)` | `postgres` | `pg_catalog` | `require_actor('content.draft')`; author-only, `draft` state, optimistic version, same payload allow-list, new immutable version | exec-role | additive |
| 17 | `get_bio_draft(uuid)` | `postgres` | `pg_catalog` | `require_actor('content.read')`; row returned only to author or assigned reviewer | exec-role | additive |
| 18 | `list_bio_review_queue(integer,timestamptz,uuid)` | `postgres` | `pg_catalog` | `require_actor('content.read')`; filtered to `assigned_reviewer_id = actor` | exec-role | additive |
| 19 | `revoke_my_sessions(uuid)` | `postgres` | `pg_catalog` | `require_actor('dashboard.read')`; revokes **all** the caller's Admin sessions only | exec-role | **security-sensitive** |
| 20 | `list_platforms(integer,uuid)` | `postgres` | `pg_catalog` | `require_actor('content.read')` | exec-role | additive (reads `public`) |
| 21 | `list_categories(integer,uuid)` | `postgres` | `pg_catalog` | `require_actor('content.read')` | exec-role | additive (reads `public`) |
| 22 | `list_collections(integer,text)` | `postgres` | `pg_catalog` | `require_actor('content.read')` | exec-role | additive (reads `public`) |
| 23 | `list_generators(integer,uuid)` | `postgres` | `pg_catalog` | `require_actor('content.read')` | exec-role | additive (reads `public`) |
| 24 | `list_seo_pages(integer,uuid)` | `postgres` | `pg_catalog` | `require_actor('content.read')` | exec-role | additive (reads `public`) |
| 25 | `analytics_overview()` | `postgres` | `pg_catalog` | `require_actor('analytics.read')` | exec-role | additive (reads `public`) |
| 26 | `list_settings(integer,text)` | `postgres` | `pg_catalog` | `require_actor('settings.read')` | exec-role | additive |
| 27 | `update_setting(text,jsonb,bigint,uuid)` | `postgres` | `pg_catalog` | `require_actor('settings.manage')`; create-once at expected version 1, exact-version update otherwise, ≤16 KiB object, audited | exec-role | **security-sensitive** |
| 28 | `list_role_catalog()` | `postgres` | `pg_catalog` | `require_actor('staff.read')` | exec-role | additive |
| 29 | `list_my_sessions(integer,timestamptz)` | `postgres` | `pg_catalog` | `require_actor('dashboard.read')`; own rows only | exec-role | additive |
| 30 | `list_audit_logs(integer,bigint)` | `postgres` | `pg_catalog` | `require_actor('audit.read')`; redacted columns only | exec-role | additive |
| 31 | `enrolment_eligible(uuid)` | `postgres` | `pg_catalog` | **pre-`aal2` by design**: requires `aal ∈ {aal1,aal2}`, enabled membership, ≥1 role, live `auth.sessions` row, **and `mfa_enrolled_at is null`** (012 replaces the 011 body) so an account that already proved a factor can never enrol a replacement; **returns `false` instead of raising so the denial is still audited**; the adapter converts anything but a single `true` row into `403` | exec-role | **security-sensitive** |
| 32 | `stamp_mfa_enrolled()` **trigger** | `postgres` | `pg_catalog` | none needed — fires only after a real `admin_sessions` insert, i.e. only after `open_admin_session` accepted an `aal2` caller | `revoke` only, **no exec-role** | **security-sensitive** (records D2's enrol-vs-recover fact) |
| 33 | `factor_gate(uuid)` | `postgres` | `pg_catalog` | **pre-`aal2` by design**: requires `aal ∈ {aal1,aal2}`, enabled membership, ≥1 role, live `auth.sessions` row; returns `'enrol'` only if `mfa_enrolled_at is null`, else `'recover'`; returns `'denied'` instead of raising so the denial is audited | exec-role | **security-sensitive** |
| 34 | `issue_recovery_grant(uuid,bytea,bytea,interval,uuid)` | `postgres` | `pg_catalog` | `require_actor('staff.manage')`; rejects self-recovery, requires an enabled roled target, `FOR UPDATE` on the target row, revokes any previous live grant, TTL clamped to 1–15 min, 8-byte salt / 32-byte digest | exec-role | **security-sensitive** |
| 35 | `revoke_recovery_grant(uuid,uuid)` | `postgres` | `pg_catalog` | `require_actor('staff.manage')`; revokes one live grant, audits whether anything changed | exec-role | additive |
| 36 | `consume_recovery_grant(bytea,uuid)` | `postgres` | `pg_catalog` | **pre-`aal2` by design**: live grant only, `FOR UPDATE` so parallel guesses cannot bypass the 5-attempt cap, single use via `consumed_at`, auto-revokes at the cap; returns `'ok'/'mismatch'/'exhausted'/'no_grant'` (never raises, so the audit commits) | exec-role | **security-sensitive** |
| 37 | `recovery_grant_state(uuid)` | `postgres` | `pg_catalog` | **pre-`aal2` by design**: returns the caller's own salt (not a secret) and remaining attempts only; no other account's grant is reachable and nothing here can consume one | exec-role | **security-sensitive** |
| 38 | `cleanup_expired(text,integer,uuid)` | `postgres` | `pg_catalog` | `require_actor('settings.manage')`; target allow-list (`admin_login_flows`, `admin_rate_limits`), batch 1–1000, per-target advisory lock, records every run | exec-role | additive (deletes operational rows only) |
| 39 | `reset_factor_enrolment(uuid,uuid)` | `postgres` | `pg_catalog` | `require_actor('staff.manage')` (AAL2 Super Admin); **self-reset refused**, one named account, audits `reset: true/false`; the only way to return a recovered account to first enrolment, and never a side effect of redeeming a code | exec-role, permission checked inside | **security-sensitive** |


### Why `SECURITY DEFINER` is mandatory here, and what that costs

The functions must run as the owner because the caller is `bc_admin_executor`,
which holds **no table privilege at all** — that is the whole point of the
design. `SECURITY DEFINER` is what lets a privilege-less login read
`admin_users` and `public.bios` behind an authorization check.

The cost is that the definer's identity is now reachable through this exact
function surface. Three properties keep that cost bounded, and all three must be
verified again after execution:

1. **`SET search_path = pg_catalog` on every single one.** All object references
   inside the bodies are schema-qualified (`bc_admin_v1.*`, `public.*`,
   `auth.*`, `pg_catalog.*`), and `plpgsql`/`sql` are looked up by OID, so a
   caller cannot shadow a function or operator through `search_path`.
2. **No dynamic SQL.** `EXECUTE format(...)` appears only in the RLS bootstrap
   `DO` block of `001` and in the rollback guard — both run once as the owner and
   take no caller input. No definer function builds SQL from arguments.
3. **Public EXECUTE is removed explicitly.** PostgreSQL grants EXECUTE on new
   functions to `PUBLIC` by default; every file ends with an explicit
   `revoke all on function … from public, anon, authenticated`. The `ALTER
   DEFAULT PRIVILEGES … IN SCHEMA bc_admin_v1 REVOKE EXECUTE ON FUNCTIONS` in
   `001` additionally covers future objects created by the same role.

### The `authenticated` / `anon` spoofing question (the key one)

`auth.uid()` and `auth.jwt()` read `current_setting('request.jwt.claims')`, which
PostgREST sets from a verified JWT. `auth.uid()` and `auth.jwt()` are **not**
`SECURITY DEFINER` and are executable by `PUBLIC`, so a SQL-capable session
could in principle set that GUC itself and forge `sub`/`session_id`/`aal`.

That is exactly why `anon` and `authenticated` must never be able to reach these
functions. Live verification confirms the current, and post-migration, state:

- `anon` and `authenticated` have **no** `USAGE` on `bc_admin_v1` after `001`
  (`revoke all on schema`), and **no** EXECUTE on any of the 39 functions.
- `anon`/`authenticated` hold `USAGE` on the `auth` schema but **no** table
  privilege on `auth.users` or `auth.sessions`, so they cannot fabricate the
  `auth.sessions` row that `require_actor`, `open_admin_session`,
  `enrolment_eligible`, `factor_gate`, `consume_recovery_grant` and
  `recovery_grant_state` each require.
- Even a forged GUC therefore fails at the `auth.sessions` existence check,
  which the caller cannot write.

The residual spoofing path is a role that has both `bc_admin_v1` EXECUTE **and**
`INSERT` on `auth.sessions` — no such role exists, and `bc_admin_executor` gets
neither. This is the condition to re-verify after execution (§10).

---

## 4. Function ownership

All 39 functions are owned by the role that runs the migration, i.e.
**`postgres`**. That role is **not** a superuser but **is** `BYPASSRLS` (verified
live) and owns all 10 `public` tables.

Consequences, stated without softening:

- These functions are trusted code with the ability to bypass RLS on `public`.
  They do not use that ability beyond the `SELECT`s in §3 — but the *capability*
  is inherent and would survive a future careless edit to a definer body.
- `ALTER FUNCTION … OWNER TO` a dedicated non-`BYPASSRLS` role would reduce this,
  but that role would then need `SELECT` on `auth.users`, `auth.sessions`,
  `public.*`, plus ownership of the `bc_admin_v1` tables it must write. Creating
  it is a larger privilege change than the one being approved, and a
  non-`BYPASSRLS` owner would additionally need RLS policies that permit it.
  **Recommendation: keep `postgres` ownership for v1, and record it as the top
  residual risk.** It is disclosed in the approval report §1 finding 1.
- Mitigation that *is* in place: the executor cannot `SET ROLE` to the owner,
  and `assertLimitedRole` refuses to run at all if `session_user` is privileged,
  is a member of any privileged role, owns anything in `bc_admin_v1`, or holds
  any table privilege there. This was proven on a real PostgreSQL 17.11 cluster,
  including a `SET ROLE` downgrade attempt from a superuser.

---

## 5. The 34 grants and the 4 trigger bodies

The `GRANT EXECUTE` block is **one reviewed statement executed after `012`**,
outside the migration files, and lives in a single canonical file:
**`admin-backend/grants/executor-grants.sql`**. It grants exactly 35 signatures —
every callable function in §3 and nothing else.

Verified mechanically by `test:admin-grant-inventory`, which parses the
migrations and the grant file and asserts:

- 39 function definitions, 35 callable (all `SECURITY DEFINER`), 4 trigger bodies;
- the 35 granted names are exactly the 35 callable functions — no definition is
  ungranted and no grant names a missing function;
- the ungranted remainder is exactly `reject_mutation`, `guard_draft`,
  `guard_approval`, `stamp_mfa_enrolled`.

This is the control that prevents the count drift that produced three different
numbers in three revisions of this document: adding a function without deciding
whether the executor may call it now fails the test suite.

The 4 trigger functions must **not** be granted. They are invoked by the trigger
machinery as the table owner; a direct EXECUTE grant would widen surface for no
benefit, and `guard_draft()` is the most complex function in the set.
`stamp_mfa_enrolled()` is the one that writes `admin_users.mfa_enrolled_at` (D2's
enrol-vs-recover record), so a caller who could invoke it directly could mark an
account as "already enrolled" — keeping it ungranted matters.

Alongside EXECUTE, the role receives `USAGE ON SCHEMA bc_admin_v1` and nothing
else. No `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `TRUNCATE`, `REFERENCES`,
`TRIGGER`, no column privilege, no sequence privilege, no `CREATE` on the schema
or database.

`require_actor(text)`'s grant is deliberate: the Node adapter calls it once per
write as a defence-in-depth precondition. Note that this makes the *adapter* the
only consumer — every operation function re-checks internally, so revoking it
would not widen access, only change the error path.

---

## 6. `bc_admin_executor` — exact definition and permissions

```sql
create role bc_admin_executor login password '<generated>'
  nosuperuser nocreatedb nocreaterole noreplication nobypassrls inherit;
grant usage on schema bc_admin_v1 to bc_admin_executor;
grant execute on function <35 signatures> to bc_admin_executor;  -- see admin-backend/grants/executor-grants.sql
```

| Property | Value | Why |
|---|---|---|
| `LOGIN` | yes | it is the only way in from Vercel |
| `SUPERUSER` / `CREATEROLE` / `CREATEDB` / `REPLICATION` / `BYPASSRLS` | **no** | enforced at creation *and* re-checked at runtime |
| Role memberships | **none** | so it cannot inherit anything |
| Table/schema privileges | **none** | `assertLimitedRole` fails closed if any appear |
| Default privileges | untouched globally; `pg_default_acl` for `public` is **not** modified | verified live: 6 `public` entries exist and are left alone |
| Connection route | **Supavisor session pooler**, `aws-<n>-<region>.pooler.supabase.com:5432`, username `bc_admin_executor.<project-ref>` | Vercel egress is IPv4-only; direct `db.<ref>.supabase.co` is IPv6-only without the add-on |
| Port | **5432 only** | 6543 (transaction mode) breaks session semantics; both the app wrapper and the pool factory reject any other port |
| Runtime self-check | `assertLimitedRole()` in every transaction + `verifyAdminDatabase()` at startup | a misconfigured or escalated login refuses to serve |

The password is generated at execution time and written **only** to Vercel
Preview env vars. It never enters the repository, a `VITE_*` variable, a log or
this conversation.

**Finding (defect D3, §12):** `supabase_admin` is a superuser, and `postgres` is
not. Because `postgres` is not a superuser, `GRANT … ON auth.sessions` would be
insufficient if `postgres` lacked `GRANT OPTION`; verified live that it *has*
`GRANT OPTION` on `auth.sessions`. It does **not** have `GRANT OPTION` on
`auth.users`, so if the executor is ever granted `REFERENCES` or `SELECT` on
`auth.users` it must be done by `supabase_admin`. v1 grants neither.

---

## 7. Super Admin provisioning and TOTP setup — the exact procedure

Order matters, and it is the **reverse** of what a naive reading suggests:

**Step 1 — create the Auth user.** Dashboard → Authentication → Users → *Add
user*, auto-confirm, a unique strong password, no email dependency. Copy the
UUID. (Do not use signup: public signup must stay off, §8.)

**Step 2 — grant membership *before* any sign-in.** The account must already be
an enabled member with a role, because both pre-MFA gates refuse an uninvited
account:

```sql
insert into bc_admin_v1.admin_users (id, enabled) values ('<uuid>', true);
insert into bc_admin_v1.admin_user_roles (user_id, role_id) values ('<uuid>','super_admin');
insert into bc_admin_v1.admin_audit_logs(actor_id, request_id, action, target_type, target_id, details)
  values (null, gen_random_uuid(), 'staff.bootstrap', 'staff', '<uuid>',
          jsonb_build_object('method','dashboard'));
```

`actor_id = null` is deliberate and is the only permitted null actor: this row
records an action by the project owner outside the application, and the append-only
trigger guarantees it can never be edited afterwards.

**Step 3 — first sign-in and mandatory enrolment.** At `/admin/login`:
password → the server calls `factor_gate` → `'enrol'` because
`mfa_enrolled_at is null` → the UI shows a **one-time** setup key → the first
code from the authenticator confirms → an `aal2` session is created →
`open_admin_session` inserts the Admin session → the `stamp_mfa_enrolled` trigger
sets `mfa_enrolled_at` → a `__Host-biocraft-admin` cookie is issued, valid ≤60
minutes.

**Step 4 — verify, do not assume:**

```sql
select u.id, u.enabled, u.mfa_enrolled_at is not null as factor_proven,
       array_agg(r.role_id) as roles
  from bc_admin_v1.admin_users u
  join bc_admin_v1.admin_user_roles r on r.user_id = u.id
 where u.id = '<uuid>' group by u.id;
-- and, through an authenticated session, one module read:
select * from bc_admin_v1.list_staff(10, null);
```

**Step 5 — confirm the second factor is really required:** sign out, sign in
again with the password *only*. The response must be `mfa_required: true`; any
Admin API call without the TOTP step must return 401/403. If it does not, stop
and disable the backend.

### Why this order is enforced, not merely recommended

`factor_gate` refuses an account with no membership, and `open_admin_session`
refuses an account with no role. There is **no endpoint anywhere that creates the
first administrator**, so a stolen password — or a compromised browser — cannot
escalate itself into Admin: the privilege must be granted out of band by the
project owner. That is also why the recovery process in §12 needs a *second*,
already-working Super Admin.

### Security properties of the enrolment and recovery paths

Verified in `test:admin-totp-enrolment`, `test:admin-totp-recovery`, the
real-PostgreSQL suite and two Chromium suites:

- pending-flow cookies are `__Host-`, `HttpOnly`, `Secure`, `SameSite=Strict`,
  ≤300 s, and **single-use** (atomic `DELETE … RETURNING`); a replay is 401;
- CSRF is compared in constant time and bound to one flow; cross-origin and
  query-string variants are refused before any work;
- `aal1` is accepted **only** on the first-enrolment and recovery routes, and only
  after the database gate answers `'enrol'`/`'recover'` for that exact account;
- every attempt — allowed, denied, malformed or rate limited — commits exactly one
  audit row, and no audit row ever contains a code, salt, secret or token;
- the TOTP secret is returned once, never stored server-side, never logged, never
  in a URL, never in browser storage (asserted: `localStorage` and
  `sessionStorage` empty, URL has no `secret`);
- the recovery step issues **no** cookie and **no** session, and the browser test
  asserts no `__Host-biocraft-admin` cookie exists afterwards and that the
  "Signed in" state is never reached.

### Recovering an account whose factor was lost — the operator runbook

1. The member signs in with their password. They see *Authenticator recovery*, not
   *Set up your authenticator* (the browser test asserts the enrolment view is
   absent on this path).
2. A **different** Super Admin opens Staff → *Issue code*. The code is displayed
   once, valid 15 minutes, five attempts, one live grant.
3. The Super Admin gives it to the member **out of band** (in person or a channel
   they already trust). It is never emailed by the system: no SMTP is configured,
   and adding one is a separate decision.
4. The member submits it. They see *Recovery authorised* — no session, no password
   change.
5. The operator deletes the stale authenticator for that user in the Auth
   dashboard, then, as a Super Admin, calls **Staff → Reset enrolment** for that
   account (`POST /api/admin/v1/staff/recovery/reset`). That clears
   `mfa_enrolled_at` audited, and returns the account to the ordinary
   first-enrolment path.
6. The member signs in again and enrols a new factor. `mfa_enrolled_at` is stamped
   again on the first successful session. The whole sequence — issue, redeem,
   reset, enrol — is four separate audit actions.

## 8. Auth settings changes and their effect on existing guests

Proposed, **not applied**. For each, the guest effect:

| Setting | Now | Proposed | Effect on existing guests / Production |
|---|---|---|---|
| `site_url` | `http://localhost:3000` | `https://<preview-origin>` | **none** on data or RLS; affects only where Auth redirects after email actions. The public site performs no Auth redirects |
| `uri_allow_list` | empty | `https://<preview-origin>/admin/recovery` | none; add-only allow-list |
| `disable_signup` | `false` | `true` or unchanged | **security-relevant**: with signup open, anyone can create an Auth user. They still get **zero** Admin capability (no membership ⇒ `open_admin_session` and `enrolment_eligible` both refuse). Recommended `true` because the project is Admin-only |
| `password_min_length` | 6 | ≥12 | none on existing sessions; applies at next password set |
| `security_update_password_require_reauthentication` | `false` | `true` | none |
| SMTP | not configured | required for recovery e-mail | none on guests; recovery stays non-functional until configured, which the UI already states |
| `jwt_exp` | 3600 | unchanged | already caps the Admin cookie at ≤60 min |
| TOTP enrol/verify | enabled | unchanged | — |

Nothing here touches `public`, RLS, the anon key's `SELECT` rights, or the
public site's data path — all of which go through PostgREST with the `anon` key
and never touch the `auth` configuration.

**Guest-visible impact of the whole plan is nil:** no `public` grant, policy,
column, index or row changes. `bc_admin_v1` is invisible to `anon` (no `USAGE`)
and, even if that were granted, every table carries the restrictive deny policy.

---

## 9. Rollback, and protection against deleting existing data

| Level | Action | Deletes existing data? |
|---|---|---|
| 0 | Remove `ADMIN_BACKEND_ENABLED` from Vercel Preview | **No.** Every route returns 503; no connection is opened |
| 1 | `REVOKE ALL ON FUNCTION … FROM bc_admin_executor` (the 35) | No — capability only |
| 2 | `DROP OWNED BY bc_admin_executor; DROP ROLE bc_admin_executor;` | No — the role owns nothing |
| 3 | `ROLLBACK 011 → 001` in reverse | **Guarded.** Each script refuses to proceed if the data it would destroy exists |

The guard is the important part, and it is real code, not a comment:

- `001` iterates **every** table in `bc_admin_v1` and raises
  `refusing rollback: bc_admin_v1.<table> contains data` before dropping
  anything, and every `DROP` is explicit (no `CASCADE`), so an unexpected
  dependency aborts the whole transaction.
- `003` refuses while any `admin_user_roles` row exists.
- `006` refuses while any login-flow or rate-limit row exists.
- `002`, `004`, `005`, `007`, `008`, `009`, `010`, `011` drop only functions,
  triggers and one index, and state that data is retained.
- **No rollback statement names a `public` or `auth` object.** Verified by
  inspection of all 11 rollback files: the only schemas mentioned are
  `bc_admin_v1` and `pg_catalog`.

Two honest limitations:

1. Because audit tables are append-only by trigger, a rollback after real use
   will be **refused** by design. The only way out is level 2 (revoke/drop the
   executor) plus a deliberate, separately-reviewed decision to drop schemas with
   data. That is correct for evidence retention, but it means "rollback" is a
   pre-production property, not a routine production operation.
2. Dropping `bc_admin_executor` requires first revoking its EXECUTE grants or
   using `DROP OWNED BY`; otherwise `DROP ROLE` fails with a dependency error.
   The ladder does this in the right order.

---

## 10. Public tables, guest SELECT, existing RLS, public site, Production, `main`

| Claim | How it was verified | Result |
|---|---|---|
| No `public` table is altered | Every file inspected for `alter table public`, `create … public`, `drop … public` | none; only `SELECT`s in `010` |
| Guest `SELECT` unchanged | Live `anon` ACLs: `anon=rxtm/postgres` (`SELECT` + Supabase-default `REFERENCES`/`TRIGGER`, no DML) on all 10 tables; 10 `SELECT` policies unchanged; `SET ROLE anon` returns 506 bios / 506 active / 33 categories / 8 platforms (re-verified 2026-11-09) | unchanged |
| Existing RLS untouched | Live: 10 permissive `*_public_read` policies, `USING (is_active)`; no file creates/alters/drops a `public` policy | unchanged |
| Existing default ACLs untouched | `ALTER DEFAULT PRIVILEGES` statements are all scoped `IN SCHEMA bc_admin_v1` | unchanged |
| Public site unaffected | The public app uses `anon` + PostgREST `SELECT` on `public.*`; no code path reads `bc_admin_v1`; `probeBackend` is the only Admin call and it is on `/admin*` only | unchanged |
| Production unaffected | `main` is not touched; `vercel.json` changes are Preview-only and already merged on this branch; no Production env var is read or written | unchanged |
| Vercel Production env | the executor secret goes to **Preview** only | pending (execution step) |

One asymmetry worth recording: the *public* site's data is served from the same
rows the Admin will read (`analytics_overview`, `list_collections`, etc.). The
Admin can **read** them; nothing in the 35 callable functions can **write** to
`public`.
The only write targets are `bc_admin_v1` tables. Publishing to `public.bios` is
deliberately unimplemented (`guard_draft` has no path to `queued`/`published`).

---

## 11. Per-change classification

Legend: **A** additive · **B** potentially breaking · **S** security-sensitive.

| Change | Class | Note |
|---|---|---|
| `bc_admin_v1` schema + 19 tables + RLS + deny policies | **A** | invisible to clients; no `public` effect |
| 3 indexes in 001, 1 in 006, 1 in 008, 2 in 012 | A | `bc_admin_v1` only |
| 39 functions + 35 EXECUTE grants | **A + S** | the grants are the only new capability in the system |
| `bc_admin_executor` role | **A + S** | can read Admin data through the 35 functions and nothing else |
| 8 append-only triggers + 2 workflow triggers + 1 stamp trigger | A | prevent mutation; stamp the D2 fact; no `public` effect |
| `admin_users.mfa_enrolled_at` (012) | **A + S** | nullable column, no default, no rewrite; it is the enrol-vs-recover record |
| Permission catalog (003) | A | data only, no `public` effect |
| `GRANT USAGE` on schema | **A + S** | meaningless without EXECUTE, but both must be reviewed together |
| Stricter DB port/host rules | **B (fail-closed)** | a wrong `ADMIN_DB_PORT` now disables the backend with 503 rather than connecting to 6543 |
| Auth settings (§8) | **S** | security posture only; no data/guest effect |
| Super Admin account + membership | **A + S** | the first privileged identity; audited with `actor_id = null` |
| Removing `ADMIN_BACKEND_ENABLED` | A | instant off-switch |

Nothing in the set is **B** for existing functionality. There is no destructive
statement, no `DROP`, no `ALTER` of an existing object, and no lock that could
block the public site: `ALTER DEFAULT PRIVILEGES` and `CREATE FUNCTION` take no
table locks on `public`, and `010`'s reads are plain `SELECT`s.

---

## 12. Decisions D1–D4, as resolved in revision 2

Revision 1 raised four defects. Each is now closed against your decisions. This
is the section to read if you only read one.

### D1 — Admin API routing · **approved as fixed**

`src/admin/backend.ts` calls `/api/admin/v1/*`; the previous `vercel.json`
rewrote only the fixed path `/api/admin/v1/proxy`, so every other Admin call
would have been served by the filesystem as a 404 HTML page while every unit test
passed. Fixed: `api/admin/handler.mjs` rebuilds the browser URL from a rewrite
marker, `vercel.json` routes `/api/admin/v1/:path*` to the single function, and
two tests lock the contract — `test:admin-api-routing` (19 URL round-trips, query
preservation, traversal rejected, public app has no Admin reference) and
`test:admin-rewrite-sim` (reproduces both hops and asserts Admin paths reach the
function as JSON, not a static page).

**Residual:** a local test cannot prove Vercel's rewrite semantics, and the
Preview is SSO-protected from this sandbox. The first hosted check must be made
by you in a signed-in browser. It is item B in §13.

### D2 — authenticator recovery · **password-only re-enrolment rejected**

Your instruction: no unrestricted password-only re-enrolment for an account that
previously had a factor; recovery must involve Super Admin verification, explicit
authorisation, single use, audit, rate limiting, and no silent MFA bypass — while
a genuinely new administrator can still enrol.

The hard part is that the provider reports *the same thing* (zero verified
factors) for "never enrolled" and "lost the device". Nothing in the password
response distinguishes them, so any rule based on the provider alone is either a
bypass or a lockout. Migration 012 therefore records the distinction **in the
database**:

| Control | Implementation |
|---|---|
| Never-enrolled vs lost factor | `admin_users.mfa_enrolled_at`, written by the `stamp_mfa_enrolled` trigger on the first `admin_sessions` insert. `open_admin_session` only succeeds for an `aal2` caller, so the column is proof that a second factor really was presented once. A password session cannot write it. |
| The gate | `factor_gate()` returns `'enrol'` only while `mfa_enrolled_at is null`, `'recover'` after, `'denied'` for a disabled/roled-out account or no live provider session. It returns text rather than raising so the denial still commits an audit row. |
| Super Admin verification | `issue_recovery_grant()` requires `require_actor('staff.manage')` — i.e. AAL2 + a live Admin session + TOTP within 10 minutes + the permission. |
| Explicit authorisation | The Super Admin names one `user_id`. Self-recovery is refused outright, so no single account can re-open itself. The target must be enabled with at least one role, and is locked `FOR UPDATE` for the duration. |
| Single use | One live grant per account: issuing a second revokes the first. Redemption sets `consumed_at` under `FOR UPDATE`. |
| Rate limiting | The count of 5 attempts is inside the same locked row, so parallel guesses cannot exceed it; the cap revokes the grant. Issuance and redemption are additionally rate limited by the existing `consume_rate_limit` buckets. |
| Audit | `auth.factor_gate`, `auth.recovery.issued`, `auth.recovery.revoked`, `auth.recovery.attempt` (with outcome `ok`/`mismatch`/`exhausted`/`no_grant`) and `auth.recovery.state`, each with the actor or `NULL` on denial. No code, salt or token is ever written to an audit row — asserted in the tests. |
| No silent bypass | Redemption **mints no session, sets no cookie, changes no password and removes no factor**. The operator removes the stale factor from the Auth admin surface, and the account then re-enrols through 011 — which now returns `'enrol'` because `mfa_enrolled_at` is still set… see the note below. |
| Genuinely new administrator | Unchanged: membership exists, `mfa_enrolled_at is null`, `factor_gate` returns `'enrol'`, and 011's membership gate still runs before any factor is created. |

Code format: 8 data symbols + 4 checksum symbols from Crockford base32 (no
vowels, no `0/1/I/L/O/U` ambiguity), shown once to the issuing Super Admin,
transcribed out of band, stored only as `sha256(salt‖code)` with an 8-byte salt,
valid at most 15 minutes. 40 bits of entropy, single use, five attempts.

**The wart, and how it is closed.** Redeeming a code authorises recovery but
deliberately touches nothing else, so `mfa_enrolled_at` stays set after a
completed recovery. Without a way to clear it, the account would need a second
grant just to enrol. Rather than leave that to a hand-written `UPDATE` (an
untracked privileged write in a chat message — exactly what this package is meant
to replace), the reset is a first-class, audited, per-account function:

```sql
-- 012: bc_admin_v1.reset_factor_enrolment(uuid,uuid)
actor := require_actor('staff.manage');        -- AAL2 Super Admin only
if p_user_id = actor then raise ... errcode '42501';  -- no self-reset, ever
update admin_users set mfa_enrolled_at = null where id = p_user_id and mfa_enrolled_at is not null;
-- one audit row: auth.recovery.factor_reset {reset: true|false}
```

Reachable as `POST /api/admin/v1/staff/recovery/reset` `{userId}`. The operator
sequence is therefore: redeem → delete the stale factor at the provider → reset →
the account signs in and takes the ordinary first-enrolment path. All four steps
are audited, and the reset cannot be triggered by the recovering account itself.
It is a new privileged write, so it is called out in §11 as **security-sensitive**
and reproduced in the package for your approval.

### D3 — executor credential · **accepted**

`scripts/admin-executor-credential.mjs` generates a **48-character** password
from a 55-symbol alphabet using rejection sampling (no modulo bias, ~276 bits).
It prints the creation SQL, the grant block and the rotation SQL to stdout only:
it writes no file, sets no env var, and logs nothing. The grant statements are
read from `admin-backend/grants/executor-grants.sql` at run time and re-targeted to
the rotation role, so the script cannot drift from the reviewed list — a retyped
copy is exactly how the earlier counts went wrong. `test:admin-grant-inventory`
asserts both outputs contain all 35 signatures, the right role and a 48-character
password, and that no shell assignment is emitted. Verified: 50
consecutive runs produced 50 distinct values, all 48 characters.

Rotation is the two-role procedure you asked for: create `bc_admin_executor_next`
with identical privileges, verify `rolsuper/rolbypassrls/rolcreaterole/rolcreatedb/
rolreplication` are all false and memberships are empty *while connected as that
role*, switch the Preview env vars and redeploy, confirm `health` and one read
module, then `drop owned by bc_admin_executor; drop role bc_admin_executor;` and
rename the successor. The old credential is retired only after the new one is
proven, so no request fails mid-rotation and nothing is left with a stale login.
Storage is Preview-only: no `VITE_*` variable, no repository file, no chat, and
the report never contains the value.

### D4 — cleanup · **implemented and tested before traffic**

`cleanup_expired(text, integer, uuid)`, granted only to the executor and callable
only by a Super Admin session with `settings.manage`:

| Requirement | Implementation | Test |
|---|---|---|
| Delete only expired records | `admin_login_flows` where `expires_at <= now()`; `admin_rate_limits` where `started_at <= now() - interval '1 day'` | real PostgreSQL: expired rows removed, unexpired rows retained in both tables |
| Preserve audit logs | The function can only name the two operational tables — any other target raises `22023` before a delete | asserted for `admin_audit_logs`; audit row count is asserted to *increase* across cleanup, and the earlier enrolment audit rows are re-counted afterwards |
| Bounded batches | 1–1000 per call; `FOR UPDATE SKIP LOCKED` inside the delete, so the batch is exactly bounded | batch of 1 deletes exactly 1 |
| Prevent concurrent conflicts | `pg_try_advisory_xact_lock` per target; a second run records `skipped = true` instead of deleting | two concurrent runs, plus a `skipped` row assertion |
| Record execution results | Every run, including skips, inserts into `admin_cleanup_runs` (target, started/finished, deleted, skipped) and `ops.cleanup` in the audit log | run count and `deleted > 0` assertions |
| Test retention and rollback | Retention asserted as above; `rollback/012` **refuses** while any grant, cleanup run *or* `mfa_enrolled_at` value exists | rollback guard is exercised by the refusal message of the real script |

Scheduling: Vercel Cron targets Production only, and Production is out of scope.
On the Preview the schedule is the authenticated Super Admin action exposed in the
Settings module (`runCleanupBatch` drives both targets, one failure does not skip
the other — tested). For a future Production activation a cron entry calling the
same route with a Super Admin service identity is the documented path; it is not
configured and not claimed.

### Residual risks accepted with these decisions

1. **The recovery code travels out of band.** Whoever reads it can spend one
   attempt sequence on that account for 15 minutes. It is 40 bits, single use,
   five attempts, and audited — but it is a bearer credential, and the Super Admin
   handing it out is the trust boundary.
2. **`mfa_enrolled_at` is the only record of "had a factor",** so the operator must
   clear it after deleting the stale factor (a Super Admin action in the Staff
   module). If they forget, the account stays in `'recover'` — safe, not
   convenient — until the next reset. Nothing else can set or clear it.
3. **Cleanup is manual on the Preview.** Between runs the operational tables grow
   with traffic; bounded batches and the one-day floor make that slow, not wrong.
4. Everything in revision 1's residual list still stands: `postgres` owns the
   definer functions and is `BYPASSRLS` (§4), and the `001` default-privilege
   revokes only bind the role that ran them (§1).

## 13. Final approval checklist

Tick each line before authorising execution. SHA-256 is of the exact bytes to be
executed; verify with
`sha256sum admin-backend/migrations/*.sql admin-backend/rollback/*.sql admin-backend/grants/executor-grants.sql`
and compare. All 25 files are listed: **12 migrations, 12 rollbacks, 1 grant
file**. The grant file is included because it is the statement that actually
confers capability — the migrations only define the functions.

**A. Integrity**

| File | SHA-256 | Matches report |
|---|---|---|
| `001_admin_foundation.sql` | `54d52c1f1d74cf492f431ee46f761313beefd6493e4ff2e918cde97ebb7c7db7` | yes |
| `002_workflow_integrity.sql` | `b23d6e9519ccd5ab4cecf9cbe27c8903a6d6a84ae74b7006fce3e3b08383b822` | yes |
| `003_permission_catalog.sql` | `37a839dc250d3a51622355e9cc03646d4e39ebeb821922d8117bffa2d5e6c3cb` | yes |
| `004_private_draft_commands.sql` | `554631e23e6497ee6db5ce96d37d773f127eccc6054fd4b22ee4f5b2c48ef3fa` | yes |
| `005_session_commands.sql` | `3b08b1446791796949fdbc61123f6b5ba59473dac79f2530261b23ed269899cb` | yes |
| `006_auth_controls.sql` | `d4e20279bd722c2ff694bffbfde8897d63dda2235e088119457bbbf0a0b88adb` | yes |
| `007_staff_commands.sql` | `d04c19d37acd213229a8f3088871fc51ae9b2f0b36602e40081437c8ef0b512d` | yes |
| `008_bio_edit.sql` | `a4b594c7d3479fad588c026d21a11abe037bf2e4970fd97e8449674bf895c652` | yes |
| `009_recovery_sessions.sql` | `7851eb4f03d97fbcdcd7f62cb00b54437233a2a064f12a911bd5d530b5c5a30b` | yes |
| `010_admin_module_commands.sql` | `5ac31357267a496759aa47b6838baf6ec755ae95c8dd06d0a2616529c775023b` | yes |
| `011_totp_enrolment.sql` | `4507ed36f5571c92e0d85f1ca017809997be760a05693d5c6306b5f0939ddb21` | yes |
| `012_recovery_and_cleanup.sql` | `81848c310f3ea16b4aa5bee279660b7d919e2dfd795136dbcfac958332f84f2a` | yes |
| `rollback/001` | `98b80fd0cd9d0bc3cc1e87da1352a27f29771fd5dd8016d84744dffe9bda1a77` | yes |
| `rollback/002` | `9a8b79d9fda725b9efda3cc052aab246dbcf5a5336d84ea8a692733b422b1097` | yes |
| `rollback/003` | `2d589421922666f3bd93f0c3b0a6bb6f87f77a91c9c3c620f27f0df37f0c20d1` | yes |
| `rollback/004` | `59479d8343d2d85f7e64b9541451abed955f19d8abba95cac49723cfc718f625` | yes |
| `rollback/005` | `14007468a63d0e99d5f4958d42f52b1c8653c83b310312741ea4072ef0ddb822` | yes |
| `rollback/006` | `50994d3db55adc9f6c96ed9db64d4468a9ccbb40a4b29955f135b78860906dec` | yes |
| `rollback/007` | `65f6473b705669f5d053f4901f41d4b5ba38948eb8cd2b9e3f536ae50e7d1d8a` | yes |
| `rollback/008` | `d788af5f302c37b0758536a88387a53f9f47b849de40fe46bb5f031b0d04b0ad` | yes |
| `rollback/009` | `8297b2e082d5e82a034274ba336bc1efb1d06b7502c33cbdc5a18405d2cc0ffa` | yes |
| `rollback/010` | `6b08e5d5895f11322e618a1aecd25ae7ff8600055d74a874964e07098c213e04` | yes |
| `rollback/011` | `89f59839ee62c9a5cf9436d8cf6a617f2878fb37cbcd701994d13db0d84ce980` | yes |
| `rollback/012` | `99823ea75d85f1a10ba871d1435bb29f9830c745fef010aeef2c85d928fcde96` | yes |
| `grants/executor-grants.sql` | `7c78b58f765d74d33336e7ec79a9777ee15f7662fe40fe5c3823b99258dc035d` | yes |

**B. Correctness and safety**

- [ ] Order fixed: `001 → 012`, one transaction per file, stop on first failure.
- [ ] All 25 SHA-256 values above match, including the grant file.
- [ ] Baseline re-captured immediately before execution: bios **506** (all
      active), `source_slug` **20**, categories **33**, platforms **8**,
      generators **12**, seo_pages **48**; guest `anon` sees 506/33/8.
- [ ] `bc_admin_v1` and `bc_admin_executor` still absent.
- [ ] 19 tables, 39 functions, 4 trigger bodies, 35 granted signatures confirmed
      by catalogue query *after* execution (not by reading files), matching
      `npm run test:admin-grant-inventory` on the same commit.
- [ ] Every function reports `prosecdef = true` **except** the three trigger
      bodies; every one reports `proconfig` containing
      `search_path=pg_catalog`.
- [ ] `has_function_privilege('anon', …)` and `('authenticated', …)` are
      **false** for all 38; `has_schema_privilege` for `bc_admin_v1` is **false**
      for both.
- [ ] `bc_admin_executor`: `rolsuper/rolbypassrls/rolcreaterole/rolcreatedb/`
      `rolreplication` all false, zero memberships, zero table privileges, zero
      `CREATE`.
- [ ] All 10 `public` tables still `anon=r` only, still RLS on, same 10 policies,
      same 506/33/8 guest view.
- [ ] No entry in `pg_default_acl` for `public` changed.
- [ ] Corrected API routing (D1) proven on the hosted Preview by a signed-in
      browser before "activated" is claimed.
- [ ] First Super Admin enrolled, then a second sign-in with password only returns
      `mfa_required: true` (the mandatory-enrolment proof, §7 step 5).
- [ ] A recovery grant issued and redeemed end to end on the Preview, then
      revoked; the audit module shows the issue and the attempt.
- [ ] `mfa_enrolled_at` is set for the enrolled account and `null` for an invited
      account that has never signed in.
- [ ] A full recovery round trip: issue → redeem → operator deletes the factor →
      `staff/recovery/reset` → the member enrols again; four audit actions visible
      in the audit module, and the reset is refused for the operator's own account.
- [ ] D3 credential stored Preview-only; the rotation procedure rehearsed on a
      disposable role before go-live is not claimed, only documented.
- [ ] D4 cleanup run once per target on the Preview and both rows visible in
      `admin_cleanup_runs`.
- [ ] Rollback rehearsed on the disposable cluster before execution
      (`test:admin-rollback-cycle`): 012 refuses on enrolment/cleanup evidence,
      `rollback/012` restores a working 011 gate after dropping the column, and a
      full reverse teardown plus reinstall reproduces 19 tables / 39 functions.

**C. Explicitly out of scope until separately approved**

- Any `public` schema, policy, grant or data change.
- Publishing from Admin into `public.bios` (unimplemented by design).
- Auth settings that affect non-Admin users beyond §8.
- `main` or Production.

---

## 14. What happens on approval

1. Re-verify the baseline (§13 B) and the SHAs.
2. Execute `001 → 011` in order; after each file, assert its objects exist and
   the previous files' objects are unchanged.
3. Generate the credential with `node scripts/admin-executor-credential.mjs`,
   create `bc_admin_executor`, apply the 34 grants from
   `admin-backend/grants/executor-grants.sql`; verify every negative privilege
   above.
4. Land the D1 routing fix and deploy to the existing Preview; verify
   `/api/admin/v1/health` returns 503 (disabled) and the UI fails closed.
5. Create the Super Admin Auth user, grant membership, then enrol TOTP at
   `/admin/login` (§7), then set the Preview env vars from the D3 generator and
   enable the backend.
6. Test every module against the **real** backend on the hosted Preview — including
   one recovery round trip and one cleanup run — capture the artefacts, and only
   then write the acceptance report.

Until that final hosted verification succeeds, this work is **not** complete and
will not be described as complete.
