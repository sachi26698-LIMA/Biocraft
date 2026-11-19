# Master Admin — persistent execution tracker

## PR #16 integration with main (`e4b8cd1`)

The combined tree keeps the public site local-first, and keeps Admin's database and Auth readiness checks. Disposable PostgreSQL/Chromium tests passed for private catalogue drafts, MFA with synthetic upstream and 015 rollback/reinstall. The canonical inventory now covers 57 functions (52 grants and five ungranted triggers). The public no-network tests and strict pooler TLS/diagnostic tests passed. In disposable databases the standard sync passed eight checks, the two-cluster hybrid suite passed and the 200,000-row importer repeat skipped all 200,000 with zero missing provenance. No shared migration, grant or credential change was made during conflict resolution.

## Earlier branch checkpoint · 2026-11-18 UTC

`arena/21fb7968-biocraft`. Production release `dff59e3` was promoted; [actual hosted status and completed syncs](PRODUCTION_SYNC.md). The private Admin schema and existing executor are present. **Do not replay the historical bootstrap below.** The live session pooler still rejects the confirmed tenant/user (`XX000`); Auth health is not a successful Admin login.

**Local runtime batch:** `dev:api` runs the same `createAdminApp` and Node adapter as Vercel on 4190. `dev:web` runs the website on 5173 with a same-origin API proxy. Verified `/api/status/live` 200, `/admin/login` HTML 200 and `/api/admin/v1/health` JSON 503 through that proxy without credentials. `tests/admin-local-http.mjs`, adapter and pool configuration checks passed. Private local keys are separate from deployment keys; local shared writes default off. This is not a shared-project session. The current setup and release scopes are recorded in [deployment instructions](MASTER_ADMIN_DEPLOYMENT.md).

**Catalogue/API batch:** Templates reads `design_templates`, Designs reads `design_presets`; Symbols, Emoji and Languages use active-only guest projections gated by a live Admin `content.read` check. No new SQL grant. Chromium: 20 dedicated screens at 390/820/1440px (intercepted API). PGlite API integration and 48 signed-out route denials passed. The first disposable 200,000-icon run exposed four distinct source IDs colliding with hyphenated slugs; the importer now preserves Iconify’s canonical `prefix:name`. Job resume uses a pinned input digest and committed counters; wrong-input resume is refused. No live bulk job started.

**Private draft and browser batch (local only):** proposal `016-catalog-drafts` adds an owner-scoped, versioned metadata workspace in 11 domains. The native PostgreSQL 18.6 suite exercised the two limited-role commands, SEO/content separation, concurrent stale-version rejection, fresh MFA, atomic audit and refusal to roll back a nonempty store. Chromium used HTTPS Vite → actual Node listener → limited PostgreSQL; only upstream GoTrue/PostgREST were simulated. Password + TOTP yielded a Secure/Strict/HttpOnly cookie; editor module reads returned 200, staff/analytics/settings/audit 403. Template create/edit/archive reached v3 with three audit entries; missing CSRF was denied; logout returned the browser to 401. **Not hosted Auth, shared CRUD or catalogue publishing.** No 016 grant, flag or shared migration applied.

**Import scale and licence batch (disposable DB only):** `scripts/library-import-policy.json` admits explicit SPDX values; Simple Icons uses **per-mark** licences, not package CC0. Known brand sets in Iconify and incomplete attribution are held. Full local preflight: **470,679** icons + **119** brand marks + **32,004** colours = **502,802 candidates**, estimated **2,621,075,850 additional bytes** (~2.44 GiB). These supersede the earlier 572,907-candidate preflight, not the quota hold. PostgreSQL 18.6: 200,000 insertions in 64.925 s, repeat 0 inserts/updates + 200,000 skips in 9.589 s; 200,000 unique fingerprints and zero missing source/licence/attribution. As `anon`, 200 pages × 1,000 returned the whole slice once. Database size 387,236,367 bytes locally, then removed. Interrupted colour job: 10/40 committed, wrong manifest rejected; resumed at batch size 7, finished at 40 inserts, zero skips, two attempts. No shared bulk job, quota change or claim of brand-use permission.

**Final runtime and release checks:** Normal readiness now requires a limited database session, the core login commands **and** healthy Auth. Health failures and disabled reset probes release their response bodies; this fixed Chromium hanging on navigation/reload while already displaying the unavailable screen. The real two-process stack served `/admin/login` and `/api/status/live` (200); Admin readiness and guest REST readiness were 503 with the private local settings incomplete. The fail-closed sign-in/retry path passed at 390/820/1440 px. All **35 Admin routes** mounted on direct navigation and reload; intercepted module checks covered 20 dedicated + 13 original screens. **57 signed-out API routes** returned 401 before any DB/provider call in the authorization suite. TypeScript and guarded production build passed (87 HTML shells); Preview/Production off/on matrix 0/35 Admin shells in each scope. A 163-file client scan found no injected server-secret canaries or local API addresses. **52 public routes** matched the `3340e94` public build's titles, descriptions, main headings and header/footer with no page/failed-request errors. The 12 public tools passed real-browser output/copy/regeneration and phone layout checks; each route fit at 320 px. Local 001–014 security inventory (44 callable + five ungranted triggers) and all eight independent 015 library readers passed; 016 off/read-only requests never dispatched a draft mutation.

**Hosted boundary:** the [23:17 UTC readback and Support ticket](PRODUCTION_SYNC.md) distinguish healthy managed services and working guest reads from the unresolved Production pooler lookup. No real Admin password/MFA, authenticated shared CRUD or deployment of this batch. Vercel branch Preview `3340e94` was READY/STAGED; canonical Production remains `dff59e3`. Keep existing accounts/grants unchanged. This workspace has neither the private executor password/allow-list nor unrestricted Supabase egress; fill local settings only in an authorized private environment. The [two-process setup, separate Vercel scope matrix and test commands](MASTER_ADMIN_DEPLOYMENT.md) apply to this checkpoint.

### Historical implementation notes (not current deployment instructions)

### Security review blockers specific to latest candidates

- 004–007 are drafts, not a migration proposal for execution: provider session visibility, forged SQL session GUCs, definer ownership and all effective grants/default privileges need real-Postgres review. The limited-role guard is not exhaustive. Staff role edits need all other membership writers to share locking, real concurrent demotion/last-super tests, audited bootstrap and fresh step-up. Staff promotion intentionally fails closed.
- `auth-storage.mjs` requires separate injected encryption/HMAC keys, trusted request identity, retention cleanup, atomic behavior validation and bounded table growth. PGlite verifies encryption; a local PostgreSQL 17.11 test additionally verifies concurrent single-use take and rate-limit updates. Real Supabase/network behavior remains untested. Error and denied-login audit/abuse controls are incomplete. Direct DB TLS connectivity has not been tested.
- Cookie/session is 15 minutes maximum, no refresh; provider logout happens after Admin revocation, and failure is reported while the cookie is cleared. Recovery controller is implemented but unmounted and depends on a compatible provider email template, configured redirect, real Auth tests, independently reviewed DB grants and failure handling. Factor enrollment, credential rotation, pending handoff cancellation/revocation, and actual provider auth-session expiry behavior remain unimplemented or unverified. No Admin authentication should be enabled until independently reviewed.
- No public publish API exists. Bundled fallback can resurrect remotely archived bios and bundled registries/SEO require their own reviewed release strategy.

## Files in this checkpoint

- `admin-backend/migrations/001`–`012` and matching `admin-backend/rollback/` files: candidate DDL for synthetic targets only, no shared apply. 011 is the first-factor TOTP enrolment gate; 012 adds Super-Admin-authorised recovery (D2) and bounded cleanup (D4).
- `admin-backend/grants/executor-grants.sql`: the single canonical 34-signature grant list; `tests/admin-grant-inventory.mjs` keeps it and the migrations in agreement.
- `scripts/admin-executor-credential.mjs`: D3 credential generator (48 chars) plus the two-role rotation SQL; prints to stdout only.
- `admin-backend/server/{identity,auth-flow,api,database,auth-controller,auth-storage,provider-logout,session-cookie}.mjs`: unmounted server-side candidates. Tests include synthetic complete flow and staff commands; no hosted endpoint or real Auth.
- `src/admin/AdminApp.tsx` and `src/admin/backend.ts`: eight proposed role labels, no functionality enabled.
- `docs/admin-preview/current/{desktop,tablet,mobile}.png`: local Chromium screenshots, not physical devices or hosted verification.
- `tests/admin-isolated-foundation.cjs`, `tests/admin-isolated-workflow.cjs`, `tests/admin-isolated-permissions.cjs`, `admin-backend/domain/bio.mjs`, `tests/admin-bio-domain.mjs` and `package.json` test scripts.
- Nine `docs/MASTER_ADMIN_*.md` tracker and implementation records. Phase 3/4 uncommitted reviews and tests preserved.

- **D1–D4 decisions implemented** (revision 2): routing fixed and locked by two
  tests; authenticator recovery replaced by a Super-Admin-authorised single-use
  grant (migration 012, `factor_gate`, `stamp_mfa_enrolled`, recovery UI at
  `/admin/login`, Staff module issue/revoke); cleanup implemented as a bounded,
  locked, audited function; credential generator and two-role rotation scripted.
  Counts are now derived by `test:admin-grant-inventory`:

<!-- admin-sync:totals:start -->
20 tables. 49 functions = 44 callable SECURITY DEFINER + 5 trigger bodies. 44 granted signatures. 14 forward migrations, 14 rollbacks and 1 grant file (`29` SQL files).
<!-- admin-sync:totals:end -->
### Latest local implementation batch

- **Pre-execution security review** (`docs/FINAL_SECURITY_REVIEW.md`): all 31
  functions mapped to owner / fixed `search_path` / internal authorization /
  grants, the `anon`-spoofing analysis checked against live grant facts, every
  change classified, rollback data-protection audited, and a SHA-256 checklist
  for all 22 files. It found **D1** the Preview could not reach the Admin API at
  all (only the fixed `/api/admin/v1/proxy` path was rewritten while the UI calls
  `/api/admin/v1/*`), **D2** a lost TOTP factor cannot be re-enrolled, **D3** the
  executor password/rotation policy is unspecified and **D4** the flow/rate-limit
  tables have no cleanup job. D1 is fixed and locked by two new tests; D2–D4
  need a decision and are recorded, not silently patched.

- First-factor TOTP enrolment is implemented end to end and stays unmounted in
  the same fail-closed composition: `POST /auth/enroll` and
  `/auth/enroll-confirm`, a single-use pending flow, `catch` on every provider
  error, the new `011_totp_enrolment.sql` gate (enabled membership + role + live
  `auth.sessions` row, one audit row per attempt, no tokens), and a `Login.tsx`
  enrolment stage that shows the setup key exactly once. `test:admin-totp-enrolment`
  (11 groups) and the new real-PostgreSQL assertions in `test:admin-postgres-local`
  pass; `test:admin-login-flow-browser` drives the shipped bundle through
  password → enrol → confirm at 1440 px and 390 px with axe clean and no storage
  writes. Auth is still mocked and the SQL is still unapplied.
- Pool configuration hardened after review: only session-mode port 5432 is
  accepted (transaction-mode 6543 fails closed in both the app wrapper and the
  pool factory), the Supavisor hostname pattern now requires a real
  multi-label region, and `ADMIN_DB_HOST`/`ADMIN_DB_PORT` paths are covered.

- Added an unmounted recovery flow: provider recovery email and token-hash exchange, verified TOTP, server-side membership, audited Admin-session revocation before provider password change, and provider global sign-out. Synthetic SQL 009 is unapproved. Admin DB and provider cannot participate in one transaction; a password update or global sign-out failure is reported and requires operational recovery. Real email template/redirect setup, link handling, non-enumeration, real Auth and security review are not yet verified. Global sign-out affects that user's other Supabase sessions and must be disclosed in the eventual UI.
- Fixed a real SDK compatibility error: Supabase MFA verification returns `expires_in` and does not guarantee `expires_at`; the unmounted login controller now caps its cookie using JWT expiration and verifies the token before releasing the cookie. `test:admin-auth-sdk-http` exercises the actual installed SDK via intercepted synthetic HTTP for password/TOTP/recovery, not live Supabase. Local real-Postgres recovery integration confirms audited revocation before mocked password update.

### Prior local implementation batch

- Private bio draft edit/detail and an assigned-reviewer queue are implemented in unmounted APIs and candidate 008; edits create immutable versions with optimistic concurrency and transactional audit. They do not modify public bios or publish content. Provider authentication and all changes to the shared database still require real integration, review and approval.
- Hardened the SQL executor guard to reject a privileged `session_user` using `SET ROLE`, direct Admin table/column/sequence privileges, schema CREATE, dangerous role attributes and owners. This is defense in depth, not a complete effective-grant/security review. PGlite cannot represent distinct session users; its role-login check is explicitly simulated. A real local PostgreSQL 17.11 fixture validates direct limited login, `SET ROLE` rejection and table-grant rejection.
- `BIOCRAFT_TEST_PG_BIN=... LD_LIBRARY_PATH=... npm run test:admin-postgres-local`: PASS on a fresh local PostgreSQL 17.11 Unix-only cluster with synthetic auth schema, including concurrent edit (exactly one success and one conflict). Runner needs local PostgreSQL binaries; it never accesses shared Supabase. Mocked Auth remains distinct from real PostgreSQL testing.

## Executed checks

- `BIOCRAFT_TEST_PG_SOCKET=/tmp/biocraft-pg-socket npm run test:admin-postgres`: PASS on a local disposable PostgreSQL 17.11 server (synthetic Auth tables): 001–009 SQL, immutable concurrent edit conflict, restricted direct executor, own drafts, denied roles/privileges, restrictive RLS under extra permissive policy, transaction membership lock, ten concurrent rate-limit requests (five allowed), eight concurrent one-time takes (one result), and Admin session expiry. This is real PostgreSQL, not live Supabase/Auth or exhaustive concurrency/security validation. Test refuses non-disposable Unix-socket clusters and does not touch the shared project.

- Latest local run: `test:admin-full-flow`, `test:admin-staff-commands`, `test:admin-api-integration`, `test:admin-session-cookie`, the isolated foundation/workflow/permissions, private commands, auth-flow, identity, bio-domain, privilege-review, phase3-schema, blueprint, draft, collections, generation and performance suites, `typecheck`, branch-configured Preview build and `git diff --check`: PASS. Full flow uses mocked provider, PGlite and fixture-only limited-role grants; verifies sequential handoff, password/TOTP, cookie, draft and Admin logout/revocation, not hosted security. Production-dependency `npm audit --omit=dev --audit-level=moderate`: zero reported vulnerabilities.

- `npm run test:admin-private-commands`: PASS local PGlite synthetic JWT fixture: permission/session checks, own-only keyset list, draft creation, stale conflict, review, success audit and audit-failure atomic rollback; does not establish real Auth, RLS or concurrent safety.
- `npm run test:admin-auth-flow`: PASS with mock provider and limiter for password/TOTP/logout building blocks; no real Auth or session store.
- `test:admin-performance`: one local Chromium scripted pass with 4x CPU slowdown. Measured LCP and event timing samples and long tasks above; no live telemetry or field INP.
- Preview build passed; `test:admin-browser` and `test:admin-interactions` passed in local Chromium desktop/tablet/Android-emulated viewports (no Admin/Supabase requests), including selected axe checks and navigation. Not physical device or hosted acceptance.

- `npm run test:admin-identity`: PASS using mocked provider and intercepted real SDK HTTP; no hosted token or real MFA checked. Local fixture also confirmed per-schema default-privilege revoke does not remove global PUBLIC function EXECUTE.

- `npm run test:admin-isolated-foundation`: PASS (PGlite only: 15 tables/policies, constraint cases, immutable data, refuse nonempty rollback, empty reinstall).
- `npm run test:admin-isolated-workflow`: PASS (PGlite only: reviewer assignment and decision matching, self-review rejection, disabled queue/publish, rollback of guard).
- `npm run test:admin-isolated-permissions`: PASS (PGlite only: eight role definitions, selected positive/negative catalog entries, no members and clean catalog rollback; not RBAC authorization).
- `npm run test:admin-privilege-review`, `npm run test:admin-phase3-schema`, `npm run test:admin-blueprint`, `npm run test:admin-draft`: PASS (disposable local fixtures/mocks, not evidence of hosted security).
- `npm run test:collections`, `npm run test:generation`, `npm run test:performance`, `npm run typecheck`, `npm run build`, `git diff --check`: PASS. Build is the public production-mode build run locally, not a deployment or hosted performance measurement.
- `npm run test:admin-bio-domain`: PASS (standalone domain validation; not integrated with an API or real platform rules).
- `npm audit --omit=dev --audit-level=moderate`: PASS, zero reported production-dependency vulnerabilities at execution. Full `npm audit --audit-level=moderate`: FAIL, two reported development dependency vulnerabilities (one moderate, one high; Vite/esbuild chain); suggested forced Vite major upgrade not applied without regression review.

## Resume here

1. Review candidate DDL and permissions for defects with a disposable real PostgreSQL server; complete transactional session/RBAC, staff role changes and last-S locking, typed content and atomic audit commands without trusting arbitrary client claims. Specifically add concurrent authorization/demotion tests, isolation and provider tests before allowing any grants. Maintain deny-by-default until then.
2. Independently build a synthetic target release receiver with target-bound credentials, CAS, receipts, replay handling and reconciliation; do not connect to the shared project. Implement actual modules only after authenticated APIs exist.
3. Use only the existing project. Prepare final target-pinned migrations with exact SQL, impact, grants and non-destructive rollback; obtain explicit approval before shared security changes. Do not provision a new project. Test real Auth/REST/permissions only in a separately authorized safe scope.
4. Continue full test/device/performance/recovery matrix and update this file. Never infer hosted verification or user/account existence from local fixtures.

## Batch — module commands, step-up MFA freshness, server app composition

Added after commit `e902ccd` (uncommitted at time of writing):

- Candidate SQL `010_admin_module_commands.sql` (+ rollback): authorized reads for platforms, categories/collections, generators, SEO pages, aggregate analytics, settings, role catalog, own sessions and redacted audit; `update_setting` with create-once/optimistic versioning and audit. All functions are `security definer` with `search_path=pg_catalog`, every call re-checks `require_actor(<permission>)`, and EXECUTE is revoked from `public, anon, authenticated`. **Not applied to the shared project**; needs owner/grant review.
- `database.mjs`: string int8 parsing replaced by numeric type parser (fixes `settingUpdate`/count validation), new read operations; **step-up enforcement**: `create`, `draftUpdate`, `submit`, `reviewApprove`, `reviewReject`, `sessionRevokeAll`, `settingUpdate` now require a provider-observed TOTP `amr` event no older than 10 minutes. Missing/stale evidence returns `403 STEP_UP_REQUIRED` (`28000`).
- `identity.mjs`: extracts `mfaVerifiedAt` from provider-verified `amr` claims only; never trusts client values.
- `api.mjs`: `/sessions`, `/roles`, `/audit-logs`, `/analytics`, `/platforms`, `/categories`, `/collections`, `/generators`, `/seo-pages`, `GET/PUT /settings`, strict paging validation (unknown/repeated/malformed parameters rejected), `STEP_UP_REQUIRED` mapping.
- `auth-controller.mjs`: MFA cookie expiry now derives from the verified JWT `exp` (Supabase returns `expires_in`, not `expires_at`) — a real SDK compatibility bug found and fixed.
- `recovery-controller.mjs`: reviewed, hardened factor lookup and cookie header length; recovery revokes Admin sessions before the provider password change and signs out globally. Still unmounted, needs provider email template/redirect, real Auth tests and grant approval.
- `app.mjs`: full server composition (auth → recovery → cookie gateway → API) with fail-closed configuration, exact-origin gating, route allow-list, HMAC-signed trusted proxy client key, startup `assertLimitedRole` check. **Unmounted**: no deployment target, no DB credentials and no approved grants exist, so it cannot be enabled in the hosted Preview.
- `tests/admin-server-local.mjs`, `tests/admin-app-local.mjs`, `tests/admin-http-smoke.mjs`: real local HTTP socket tests of the app wrapper against a disposable PostgreSQL cluster.

Test separation: mocked-provider/PGlite suites (`admin-full-flow`, `admin-api-integration`, `admin-session-cookie`, `admin-auth-sdk-http`) are clearly labelled synthetic. Real PostgreSQL 17.11 suites (`test:admin-postgres-local`) validate SQL, roles, RLS, concurrency, limiter, handoff, recovery and 010 commands, but still use a synthetic `auth` schema and a mocked provider; they are **not** live Supabase validation.

### Session lifetime correction and evidence
- Read-only `get_auth_config` (no changes made): project `jvpadtzfsuekixrquzjv` has `jwt_exp=3600`, TOTP enroll/verify enabled, refresh-token rotation on, `site_url=http://localhost:3000` and an **empty** redirect allow-list, signup **enabled**, password minimum length 6, `security_update_password_require_reauthentication=false`, and no SMTP provider configured (so recovery e-mail delivery is unverified). These are blockers for real Admin auth and are recorded, not changed — auth configuration is shared production surface and requires approval.
- Consequence applied locally: Admin sessions and the encrypted session cookie are now capped at one hour and must not outlive the provider token; `issueSessionCookie`/`decodeCookie` read the token `exp` and reject a cookie that exceeds it. Candidate `005` records a one-hour Admin session. No refresh flow exists, so a user re-authenticates hourly.

## Batch — UI sign-in, serverless entry, platform-rule sync, proxy signature

- `src/admin/backend.ts` now contains a real same-origin client (health probe,
  `/session`, `/csrf`, CSRF-protected writes). It never handles provider tokens.
- `src/admin/Login.tsx` + `/admin/login` route: password → TOTP → session, with
  rate-limit, unavailable and unauthorized messaging. **Fails closed**: with no
  configured backend the page renders "Sign-in is not available", renders no
  credential form and issues no privileged request (verified by Chromium at
  1440/820/390 with zero `/api/admin` POSTs and zero console errors).
- `api/admin/handler.mjs` + `admin-backend/server/node-adapter.mjs` +
  `admin-backend/server/handler.mjs`: Vercel Node entry reachable only via the
  `/api/admin/v1/proxy` rewrite. It is **disabled by default** and returns 503
  until a reviewed configuration exists; inbound signature headers are stripped
  and a trusted client key is re-derived from the platform IP header.
- `vercel.json`: no-store + noindex for `/api/admin/*`; the Admin API rewrite is
  fixed-path only.
- `admin-backend/domain/platform-rules.mjs` centralizes the eight platform bio
  limits mirrored from `src/tools/platforms.ts`; `test:admin-platform-rules`
  fails on drift. The app wrapper imports it instead of duplicating limits.
- New tests: `test:admin-app-local`, `test:admin-http-smoke`,
  `test:admin-node-adapter`, `test:admin-platform-rules`,
  `test:admin-login-browser` (Chromium, local build only).

Hosted status is unchanged and **unverified**: sandbox TLS to the Vercel preview
fails before HTTP, so no hosted browser or API check has been performed. The
Preview remains UI-only; `/admin/login` correctly reports the backend as
unavailable because no schema, grants, database credential or Admin account
exists yet. See `docs/MASTER_ADMIN_BACKEND.md`.

### Local performance re-measurement (scripted Chromium, not field data)
`AUDIT_BASE=http://127.0.0.1:4178 AUDIT_DIR=docs/admin-preview/perf npm run test:admin-performance` on the freshly built local Preview:

| Profile | LCP | CLS | Longest task | DCL |
|---|---|---|---|---|
| Android-emulated (390×844, 4× CPU) | 520 ms | 0.00014 | 272 ms | 155 ms |
| Tablet (820×1100) | 476 ms | 0 | 252 ms | 134 ms |
| Desktop (1440×900) | 476 ms | 0.00060 | 195 ms | 163 ms |

The 272 ms task is initial React render of the bundled catalogue. These are single
local runs under emulation — no field/INP data, no backend latency and no
physical-device claim.

## Batch — live module wiring in the Admin UI

- `src/admin/LiveModules.tsx` renders database-backed analytics, platforms and
  categories on the Overview page **only when the Admin API reports an
  authenticated live session**. With no backend it renders nothing (no
  placeholder numbers, no fabricated rows) and the page remains the static
  bundled preview. Failure states are explicit ("Live data unavailable").
- `tests/admin-preview-browser.cjs` now allows at most one same-origin
  `/api/admin/v1/health` probe and still forbids every other privileged or
  Supabase request; desktop/tablet/mobile runs pass with zero console errors and
  no horizontal overflow.
