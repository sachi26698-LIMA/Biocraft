# FINAL SECURITY REVIEW — BioCraft Master Admin activation

**Scope:** a pre-execution, security-focused review of
`docs/CONSOLIDATED_APPROVAL_REPORT.md` and of the eleven migration candidates it
reproduces (`admin-backend/migrations/001`–`011`), against the live shared
project `jvpadtzfsuekixrquzjv`.

**Status: NOTHING EXECUTED.** No migration applied, no role created, no grant
issued, no account created, no Auth setting changed, no Production or `main`
change. Every statement below is either read from the repository or read from the
live project with a read-only query.

**Headline result:** the SQL is sound and additive, but the review found **four
defects that would break activation if executed as written** — two of them
fail-closed (harmless, caught on the first request), two of them functional. They
are listed in §12 with the exact corrections required before execution. Two of
the four are already fixed in code in this branch; the other two need a decision
recorded in §12 (they are documented in the approval report, not silently
patched).

Verified live at review time (read-only):

| Check | Result |
|---|---|
| `public` tables | 10, all RLS-enabled, all owned by `postgres`, all `anon=r` (`SELECT`) only |
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

## 1. Migrations 001–011: exact SQL, execution order, failure modes

Execution order is fixed and must not be reordered: `001 → 002 → 003 → 004 →
005 → 006 → 007 → 008 → 009 → 010 → 011`. Each file is a single `BEGIN … COMMIT`,
so a failure rolls the whole file back and leaves no partial object.

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

Table count reconciles exactly: 15 (001) + 2 (006) = **17**. Function count:
1 (001) + 2 (002) + 5 (004) + 2 (005) + 3 (006) + 2 (007) + 3 (008) + 1 (009) +
11 (010) + 1 (011) = **31**. Nothing in the set is `CREATE OR REPLACE`, so a
second run of any file fails loudly rather than silently redefining a function.

**No `public` object is created, altered, dropped or re-owned by any of the
eleven files.** `010` performs only `SELECT`s against `public.platforms`,
`public.categories`, `public.bios`, `public.generators`, `public.seo_pages`.

---

## 2. The 17 tables and their RLS

| Table | RLS | Policy | Client grants |
|---|---|---|---|
| `admin_users`, `admin_roles`, `admin_permissions`, `admin_role_permissions`, `admin_user_roles`, `admin_sessions`, `admin_audit_logs`, `admin_settings`, `admin_content_versions`, `admin_drafts`, `admin_approvals`, `admin_publication_jobs`, `admin_notifications`, `admin_backup_records`, `admin_security_events` | ON | `deny_clients` — **restrictive**, `FOR ALL TO anon, authenticated USING (false) WITH CHECK (false)` | revoked from `public`, `anon`, `authenticated` |
| `admin_login_flows`, `admin_rate_limits` (006) | ON | `deny_clients` — restrictive, same form | revoked identically |

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

## 3. All 31 functions — SECURITY DEFINER matrix

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
| 31 | `enrolment_eligible(uuid)` | `postgres` | `pg_catalog` | **the only pre-`aal2` function**: requires `aal ∈ {aal1,aal2}`, enabled membership, ≥1 role, live `auth.sessions` row; **returns `false` instead of raising so the denial is still audited**; the adapter converts anything but a single `true` row into `403` | exec-role | **security-sensitive** |

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
  (`revoke all on schema`), and **no** EXECUTE on any of the 31 functions.
- `anon`/`authenticated` hold `USAGE` on the `auth` schema but **no** table
  privilege on `auth.users` or `auth.sessions`, so they cannot fabricate the
  `auth.sessions` row that `require_actor`, `open_admin_session` and
  `enrolment_eligible` each require.
- Even a forged GUC therefore fails at the `auth.sessions` existence check,
  which the caller cannot write.

The residual spoofing path is a role that has both `bc_admin_v1` EXECUTE **and**
`INSERT` on `auth.sessions` — no such role exists, and `bc_admin_executor` gets
neither. This is the condition to re-verify after execution (§10).

---

## 4. Function ownership

All 31 functions are owned by the role that runs the migration, i.e.
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

## 5. The 28 grants and the 3 trigger bodies

The `GRANT EXECUTE` block is **one reviewed statement executed after `011`**,
outside the migration files. It grants exactly 28 signatures — every function in
§3 except the three trigger bodies. Verified by script: the grant block in the
approval report and `admin-backend/migrations/*.sql` agree on 28 names, and the
only three names present in the migrations but absent from the block are
`guard_approval`, `guard_draft`, `reject_mutation`.

The 3 trigger functions must **not** be granted. They are invoked by the trigger
machinery as the trigger owner; a direct EXECUTE grant would be harmless but
would widen surface for no benefit, and `guard_draft()` is the most complex
function in the set.

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
grant execute on function <28 signatures> to bc_admin_executor;
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

## 7. Super Admin creation, membership and first TOTP enrolment

Correct order — and note this is the **reverse** of what a naive reading of the
approval report implies:

1. **Create the Auth user** (Dashboard → Authentication → Users → Add user),
   auto-confirm, unique strong password. Copy the UUID.
2. **Grant membership *first*:**
   ```sql
   insert into bc_admin_v1.admin_users (id, enabled) values ('<uuid>', true);
   insert into bc_admin_v1.admin_user_roles (user_id, role_id) values ('<uuid>','super_admin');
   insert into bc_admin_v1.admin_audit_logs(actor_id, request_id, action, target_type, target_id)
     values (null, gen_random_uuid(), 'staff.bootstrap', 'staff', '<uuid>');
   ```
3. **Then** the first browser sign-in at `/admin/login` enrols TOTP. The password
   step returns `enrolment: true`; the UI shows a one-time setup key; confirming
   the first code calls `enrolment_eligible`, which now passes because step 2
   already ran; the confirming code yields an `aal2` session and the Admin cookie
   is issued.
4. **Verify:** `select * from bc_admin_v1.list_staff(10, null);` through an
   authenticated session shows one enabled user with `{super_admin}`.

Why this order is enforced, not merely recommended: `enrolment_eligible` refuses
an account with no membership, so an uninvited user can never enrol a factor, and
`open_admin_session` refuses an account with no role. There is no endpoint that
creates the first administrator, so a compromised browser cannot escalate itself.

Security properties of the enrolment path (all verified in
`test:admin-totp-enrolment` and in the real-PostgreSQL suite):

- the pending-flow cookie is `__Host-`, `HttpOnly`, `Secure`, `SameSite=Strict`,
  ≤300 s, and **single-use** (atomic `DELETE … RETURNING`);
- CSRF is compared in constant time and bound to that one flow;
- `aal1` is accepted **only** on the two enrolment routes, and only after the
  database membership gate returns `true`;
- every attempt — allowed or denied — commits exactly one
  `auth.enrolment_attempt` audit row containing only `{eligible: bool}`;
- the TOTP secret is returned once and never stored server-side, never logged,
  never put in a URL, never written to browser storage (asserted in the browser
  test: `localStorage` and `sessionStorage` stay empty, URL has no `secret`).

**Finding (defect D2, §12):** if a user's only factor is deleted or lost, they
cannot re-enrol, because `beginPasswordLogin` needs ≥1 verified factor to hand
back an `aal2`-capable flow and the enrolment route is reachable only from the
password (aal1) flow. Recovery exists for *password* reset but not for *lost
factor*. This is a real operational gap; the fix is a decision, documented in
§12.

---

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
| 1 | `REVOKE ALL ON FUNCTION … FROM bc_admin_executor` (the 28) | No — capability only |
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
| Guest `SELECT` unchanged | Live `anon` ACLs: `anon=rxtm/postgres` (`SELECT` only) on all 10 tables; policies unchanged | unchanged |
| Existing RLS untouched | Live: 10 permissive `*_public_read` policies, `USING (is_active)`; no file creates/alters/drops a `public` policy | unchanged |
| Existing default ACLs untouched | `ALTER DEFAULT PRIVILEGES` statements are all scoped `IN SCHEMA bc_admin_v1` | unchanged |
| Public site unaffected | The public app uses `anon` + PostgREST `SELECT` on `public.*`; no code path reads `bc_admin_v1`; `probeBackend` is the only Admin call and it is on `/admin*` only | unchanged |
| Production unaffected | `main` is not touched; `vercel.json` changes are Preview-only and already merged on this branch; no Production env var is read or written | unchanged |
| Vercel Production env | the executor secret goes to **Preview** only | pending (execution step) |

One asymmetry worth recording: the *public* site's data is served from the same
rows the Admin will read (`analytics_overview`, `list_collections`, etc.). The
Admin can **read** them; nothing in the 28 functions can **write** to `public`.
The only write targets are `bc_admin_v1` tables. Publishing to `public.bios` is
deliberately unimplemented (`guard_draft` has no path to `queued`/`published`).

---

## 11. Per-change classification

Legend: **A** additive · **B** potentially breaking · **S** security-sensitive.

| Change | Class | Note |
|---|---|---|
| `bc_admin_v1` schema + 17 tables + RLS + deny policies | **A** | invisible to clients; no `public` effect |
| 2 indexes in 001, 1 in 006, 1 in 008 | A | `bc_admin_v1` only |
| 31 functions + 28 EXECUTE grants | **A + S** | the grants are the only new capability in the system |
| `bc_admin_executor` role | **A + S** | can read Admin data through the 28 functions and nothing else |
| 8 triggers (append-only) + 2 workflow triggers | A | prevent mutation; no `public` effect |
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

## 12. Defects found by this review (must be resolved before execution)

**D1 — the Preview cannot reach the Admin API (functional; blocks "fully
activated").** `src/admin/backend.ts` calls `/api/admin/v1/*`, but `vercel.json`
only rewrites the single fixed path `/api/admin/v1/proxy` to the function. Every
other Admin path is served by the filesystem (a 404 HTML page), so the UI's
`health`, `session`, `auth/*`, `csrf` and module calls would never reach the
server. **Fixed in this branch**
(`api/admin/handler.mjs` rebuilds the original path from the rewrite marker;
`vercel.json` now routes `/api/admin/v1/:path*` to the function;
`test:admin-api-routing` locks the contract; `test:admin-rewrite-sim` reproduces
both hops and asserts 7 Admin API paths reach the function instead of a static
page). Hosted proof is still required — a local test cannot prove Vercel's
rewrite semantics, and the public Preview is SSO-protected, so the first hosted
check must be done by you in a signed-in browser (§13 B).

**D2 — a lost TOTP factor cannot be re-enrolled (functional + operational).**
The enrolment route is reachable only from the password (`aal1`) flow, and that
flow only opens while a verified factor exists. Fix options: (a) let the password
flow proceed to enrolment when the account has **zero** factors and an enabled
membership (already the intent of `enrolment_eligible`), or (b) require a
Super Admin to delete the stale factor in the dashboard before re-enrolment.
Recommendation: (a) plus a documented (b) fallback. Needs your decision because
it widens the pre-MFA surface by exactly one route.

**D3 — the executor's DB password policy is unspecified (security).** The role is
created with a generated password that must meet the pooler's requirements and be
rotatable. Fix: generate 40+ chars from a CSPRNG, store only in Vercel Preview
env, and record the rotation procedure (create a second role, grant, switch env,
drop the old one) before go-live.

**D4 — no cleanup job for `admin_rate_limits` / `admin_login_flows`
(operational).** Both grow monotonically; `admin_login_flows` self-cleans on
expiry only when read. Fix: a scheduled `DELETE … WHERE started_at < now() -
interval '1 day'` / `expires_at < now()`, owned by `postgres` and therefore not
executable by the backend. Recommended before real traffic, not before first
sign-in.

None of D1–D4 weakens an existing control; D1 and D2 block "fully activated",
D3 and D4 are pre-traffic hygiene.

---

## 13. Final approval checklist

Tick each line before authorising execution. SHA-256 is of the exact bytes to be
executed; verify with `sha256sum admin-backend/migrations/<file>` and compare.

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

**B. Correctness and safety**

- [ ] Order fixed: `001 → 011`, one transaction per file, stop on first failure.
- [ ] Baseline re-captured immediately before execution: bios **506** (all
      active), `source_slug` **20**, categories **33**, platforms **8**,
      generators **12**, seo_pages **48**; guest `anon` sees 506/33/8.
- [ ] `bc_admin_v1` and `bc_admin_executor` still absent.
- [ ] 17 tables, 31 functions, 3 trigger bodies, 28 granted signatures confirmed
      by catalogue query *after* execution (not by reading files).
- [ ] Every function reports `prosecdef = true` **except** the three trigger
      bodies; every one reports `proconfig` containing
      `search_path=pg_catalog`.
- [ ] `has_function_privilege('anon', …)` and `('authenticated', …)` are
      **false** for all 31; `has_schema_privilege` for `bc_admin_v1` is **false**
      for both.
- [ ] `bc_admin_executor`: `rolsuper/rolbypassrls/rolcreaterole/rolcreatedb/`
      `rolreplication` all false, zero memberships, zero table privileges, zero
      `CREATE`.
- [ ] All 10 `public` tables still `anon=r` only, still RLS on, same 10 policies,
      same 506/33/8 guest view.
- [ ] No entry in `pg_default_acl` for `public` changed.
- [ ] Corrected API routing (D1) live on Preview before "activated" is claimed.
- [ ] D2 decision recorded; D3 password policy and rotation recorded; D4 cleanup
      job scheduled or explicitly deferred.

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
3. Create `bc_admin_executor` with a generated password; apply the 28 grants;
   verify every negative privilege above.
4. Land the D1 routing fix and deploy to the existing Preview; verify
   `/api/admin/v1/health` returns 503 (disabled) and the UI fails closed.
5. Create the Super Admin Auth user, grant membership, then enrol TOTP at
   `/admin/login`, then set the Preview env vars and enable the backend.
6. Test every module against the **real** backend on the hosted Preview, capture
   the artefacts, and only then write the acceptance report.

Until that final hosted verification succeeds, this work is **not** complete and
will not be described as complete.
