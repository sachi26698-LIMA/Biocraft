# Master Admin — delivery status, verified

_written 2026-11-13, updated 2026-11-16 after the twenty-item pass. Everything
below is either a measured result from this repository or an explicit statement
that something was not verified. Nothing is described as done because it was
written; a feature is only marked complete if a test in this repository exercises
it._

---

## 0. The twenty items, as they stand

`Done` means a test in this repository exercises it and I ran that test. `Blocked`
means I could not execute it from this sandbox, with the reason and the manual step
in §8. Nothing here is graded `Done` on inspection alone.

| # | Item | State | What actually proves it |
|---|---|---|---|
| 1 | Admin console correctness (all ten modules render and read) | Done | `test:admin-live-modules`, `test:admin-catalog`, 10/10 browser suites |
| 2 | One backend probe per navigation, none on the public site | Done | `test:admin-browser` (`admin-preview-browser.cjs`) counts navigations and probes: exactly 1 per nav, 0 on `/` |
| 3 | Login / TOTP / recovery against the real database | **Blocked** | Suites mock the transport; no test credentials exist. Real-DB half covered by `test:admin-postgres`; the browser-to-hosted wire is unproven, see blockers 4 and 5 |
| 4 | Accessibility — WCAG 2.1 AA | Done | 60 axe scans (10 routes × 2 themes × 3 viewports), 0 violations |
| 5 | Touch targets ≥ 24×24 (WCAG 2.5.8) | Done | Measured all interactive controls on every Admin route: 0 undersized |
| 6 | Keyboard and focus behaviour | Done | `test:admin-interactions` (skip link, focus-visible, trap-free nav) |
| 7 | Mobile layout, 320–1440 | Done | 4 viewports × 10 routes = 40 combinations, 0 failures, no horizontal overflow |
| 8 | Published site unchanged | Done | 48/48 public routes byte-identical to the `main` baseline at `659c000` |
| 9 | Hosted HTTP verification of the deployed console | **Blocked** | Every `*.vercel.app` path returns Vercel's SSO page; no hosted request answered (§8.5) |
| 10 | Performance / Core Web Vitals | Done | LCP 332–352 ms, CLS ≤ 0.0008, INP 48–80 ms, 0 long tasks (§6) |
| 11 | Lazy-module failure handling | Done | `test:admin-lazy-error` — a failed chunk shows a recoverable error, not a blank page |
| 12 | Read paths survive the Vercel rewrite | Done | `test:admin-rewrite-sim` against the real two-parameter rewrite; the bug it found is fixed (§8) |
| 13 | Session security (cookie, CSRF, revocation, revoke-all) | Done | `test:admin-session-cookie`, `test:admin-http-smoke`, PGlite + PostgreSQL suites |
| 14 | Step-up freshness on destructive actions | Done | PostgreSQL and PGlite suites; `test:admin-api-integration` proves `revoke-all` is refused without a fresh factor |
| 15 | Privilege separation — executor cannot read tables | Done | `test:admin-grant-inventory`, `test:admin-privilege-review`, 11 live attacks all refused |
| 16 | Migration and rollback integrity | Done | `tests/admin-rollback-cycle.mjs` on a fresh cluster: 012 refuses while evidence exists, the whole package tears down to no schema, a reinstall reproduces the object counts |
| 17 | Schema parity between the tested and the live database | Done | 207/207 objects, 49/49 function bodies, 76/76 seed rows |
| 18 | Public data untouched | Done | 506 bios, 33 categories, 8 platforms, 48 SEO pages — counts unchanged |
| 19 | Secrets stay server-side | Done | Client holds only an HttpOnly cookie; all twelve `ADMIN_*` variables are `preview`-scoped on this branch, four of them `sensitive`, none in the bundle |
| 20 | Production alias untouched | Done | `biocraft-bice.vercel.app` not reassigned; only Preview deployments created |

**Result: 18 of 20 done; 2 blocked (items 3 and 9), both on the same cause —
this sandbox cannot complete a request to the hosted deployment.** Both are
covered by manual steps in §9, and neither is a code defect I can find; they are
verification gaps I am not willing to paper over.

---

## 1. The live console is now backed by a real database

The approval was given and the package has been applied to the shared project
`jvpadtzfsuekixrquzjv`. The Admin schema now exists, the restricted login exists,
and one Super Admin account is provisioned.

Every number below was measured after the apply, not before.

### Schema parity — the deployed schema is the tested schema

Rather than trusting that fourteen files were applied correctly, the deployed
schema was compared against a pristine cluster built from the same canonical
files in `admin-backend/migrations/`:

| Comparison | Canonical | Live | Result |
|---|---|---|---|
| Tables | 20 | 20 | identical |
| Functions | 49 | 49 | **49/49 code-identical** |
| Triggers | 15 | 15 | identical |
| Indexes | 37 | 37 | identical |
| Columns | 115 | 115 | identical |
| RLS policies | 20 | 20 | identical |
| Foreign keys | 20 | 20 | identical |
| Structure objects total | **207** | **207** | **0 differences** |
| Role catalog seed | 8 roles / 18 permissions / 50 mappings | same | identical |

Function comparison is done on the compiled body with comments and whitespace
stripped, so a formatting difference cannot hide a logic difference. All 49
match; the five trigger functions (`reject_mutation`, `guard_draft`,
`guard_approval`, `stamp_mfa_enrolled`, `notify_draft_event`) are byte-identical
including their comments.

### Existing data was not touched

| Check | Before | After |
|---|---|---|
| `public.bios` | 506 | **506** |
| Categories | 33 | **33** |
| Platforms | 8 | **8** |
| Public tables | 10 | **10** |

`013` is the only file that can write to `public.bios`; nothing called it.

### The restricted login

`bc_admin_executor` is a `LOGIN` role with `nosuperuser nocreatedb nocreaterole
noreplication nobypassrls inherit`. Measured privileges:

| Measure | Result |
|---|---|
| EXECUTE grants | **44** (the whole callable surface) |
| Functions withheld | exactly the 5 trigger bodies |
| Schema `USAGE` on `bc_admin_v1` | yes |
| Schema `CREATE` | **no** |
| Table `SELECT` / `INSERT` | **0 / 0** — it cannot read a table directly |
| Table `CREATE` | **no** — verified by attempting it |

So the server cannot reach data except through the 44 reviewed functions, and
each of those re-checks permission and step-up freshness inside SQL.

### The Super Admin

`sachi26698@gmail.com` existed in Supabase Auth (confirmed by the provider). It
now has one `admin_users` row (enabled) and one `admin_user_roles` row with
`super_admin`, which resolves to all 18 permissions. `mfa_enrolled_at` is **null**
on purpose: the first sign-in asks for a password, then routes to TOTP
enrolment rather than to the console.

No password was set, seen, or stored by this work. The account already had one,
set by you through the provider.

### The gates were attacked, not just described

Run against the live database:

| Attack | Result |
|---|---|
| Executor reads `admin_users` directly | refused `42501` |
| Executor reads `admin_sessions` directly | refused `42501` |
| Executor reads `public.bios` directly | refused `42501` |
| Executor creates a table in the schema | refused `42501` |
| Anonymous caller reaches `require_actor` | refused `42501` |
| Anonymous caller lists bios via `list_public_bios` | refused `42501` |
| AAL2 claim with no `admin_sessions` row | refused `42501` |
| AAL2 claim with an unknown subject | refused `42501` |
| AAL2 claim with a malformed session id | refused `42501` |
| Missing JWT entirely | refused `42501` |
| AAL1 caller asking the factor gate to enrol | `denied` |

The refused attempt produced **one audit row and zero sessions**.

### Preview configuration

Twelve server-only variables are set for the `arena/5e351ec3-biocraft` Preview
branch. Nine are stored `sensitive` — Vercel will not return their values, which
is correct. The configuration was then validated offline against the exact
values: the app enables cleanly, the pool factory accepts the pooler host and the
project-scoped login, and all five misconfiguration cases fail closed (`missing
database credentials`, `invalid database configuration`, `invalid keys`,
`invalid provider configuration`, `disabled`).

`ADMIN_DB_HOST` points at `aws-0-ap-southeast-2.pooler.supabase.com` because the
direct host `db.jvpadtzfsuekixrquzjv.supabase.co` resolves to IPv6 only, while
the pooler has IPv4 — the path the code already documents for Vercel egress.
`ADMIN_DB_PORT=5432` (session mode); transaction mode is refused by the adapter.

## 2. Preview URL

```
https://biocraft-git-arena-5e351ec3-biocraft-sachi26698-6758s-projects.vercel.app/admin
```

Current deployment carrying the backend configuration: **`dpl_36M1Ez65KwZnshekSVUbGHtEs2dR`**
(commit `e2005ec`) — `READY`, 60 route shells, branch alias assigned. The twelve
`ADMIN_*` variables are scoped to
`arena/5e351ec3-biocraft`, so only Preview deployments of this branch receive them.

Verified on that URL: it answers **Vercel's SSO login page** ("Protected
Deployment – Vercel") for every path, including `/api/admin/v1/health`. That is
Vercel's own gate and it is working as intended; it is also the reason the hosted
API cannot be probed from here — see §8.
The project's SSO protection covers Preview deployments, so you may be asked to
sign in to Vercel before the page loads — that is Vercel's gate, not this app's.

Sign-in page: `/admin/login`.

---

## 3. Super Admin login setup

The console has no self-service bootstrap, deliberately: an Admin console that
lets anyone create the first administrator is a console with no front door.

Once the package is approved and applied, the sequence is:

1. **Account** — one Supabase Auth user is created with your email. No password is
   set by anyone else; you set it through the provider's reset flow.
2. **Membership** — one row in `admin_users` (enabled) and one row in
   `admin_user_roles` with `super_admin`. The database refuses a system with zero
   Super Admins, so this cannot be half-done.
3. **First sign-in** — `/admin/login` asks for email and password, then detects
   that the account has never proved a second factor and offers **enrolment**.
   You scan the setup key into an authenticator app and confirm one code.
4. **After that** the account is AAL2. Every privileged call requires a recent
   authenticator code, and the console will ask you to re-verify rather than
   quietly failing.
5. **If you lose the authenticator** — a second Super Admin issues a single-use
   recovery code from Users, you redeem it on the sign-in page, and an operator
   clears the stale enrolment so you can enrol a new device. That whole path is
   tested end to end.

All four steps are done. The account is provisioned for `sachi26698@gmail.com`;
no password was set, requested, or stored by this work.

---

## 4. Feature checklist

Legend: **Verified** = exercised by an automated test in this repository, now
against the real applied schema. **Built** = implemented and typechecked, with no
automated exercise. The browser suites do run here: Chromium was unpacked from
`@sparticuz/chromium` and driven by `playwright-core`, so the ten rendered-console
suites below are executed, not inferred. What is still missing is *hosted*
verification — see §8.

### Authentication and session

| Feature | State | Evidence |
|---|---|---|
| Password sign-in with server-side verification | Verified | `test:admin-auth-flow`, `test:admin-login-flow-browser` |
| First-factor TOTP enrolment (AAL1 only, gate-controlled) | Verified | `test:admin-totp-enrolment`, PostgreSQL suite |
| AAL2 requirement on every privileged call | Verified | PostgreSQL suite (`42501` without AAL2) |
| Step-up freshness for destructive actions | Verified | PostgreSQL + PGlite suites |
| Encrypted HttpOnly session cookie, CSRF token | Verified | `test:admin-session-cookie`, `test:admin-http-smoke` |
| Session revocation, own-session revoke, revoke-all | Verified | `test:admin-private-commands`, PGlite suite |
| Single-use recovery code + audited enrolment reset | Verified | `test:admin-totp-recovery`, `test:admin-recovery-browser` |
| Rate limiting and expired-handoff cleanup | Verified | PostgreSQL suite (10 concurrent → 5 allowed) |

### Modules

| Module | State | What it does |
|---|---|---|
| Overview | Built + rendered | Live counts, review-workflow state, the account's real roles |
| Users | Built + rendered | Directory, per-role editing, versioned writes, last-Super-Admin and self-edit guards in SQL |
| Content & SEO | Built + rendered | Draft → submit → independent review → publish, publication history, job evidence |
| Bio library | Built + rendered | Every row including hidden, visibility badges, escaped search, CSV of what you see |
| Analytics | Built + rendered | Real counts; explicitly states what is *not* measured |
| Security | Built + rendered | Append-only audit trail, own sessions, revoke-all |
| Settings | Built + rendered | Versioned values with conflict detection, backup history, bounded cleanup |
| Categories / Platforms / Generators / SEO pages | Built + rendered | Live read of the registry, including disabled rows; states plainly that no registry command exists |

### Data layer

| Item | State |
|---|---|
| 14 forward migrations, 14 rollbacks, 1 grant file (29 SQL files) | Verified, SHA-256 pinned in both documents |
| 20 tables, 49 functions = 44 callable + 5 trigger bodies | Machine-derived; a stale count fails a test |
| Rollback of every migration, including the newest first | Verified on a fresh database |
| `public.bios` untouched by rollback/013; a full reverse teardown leaves no Admin schema or function, and a clean reinstall recreates 20 tables / 49 functions | Verified on a fresh database (`tests/admin-rollback-cycle.mjs`) |

---

## 5. Real test results

Provenance matters here, so each row says when it ran.

### This session, against the applied schema

| Suite | Result |
|---|---|
| Schema parity vs a pristine canonical cluster | **207/207 objects, 49/49 function bodies, 76/76 seed rows** |
| Live security gates (11 attacks, §1) | **11 refused, 1 audit row, 0 sessions** |
| Typecheck (`tsc --noEmit`) | **pass** |
| `test:admin-grant-inventory` | **pass** — 44 canonical signatures match the live grants |
| `test:admin-rewrite-sim` | **pass** — the Vercel rewrite duplicate is dropped, 18 paged routes carry no stray parameter |
| `test:admin-postgres` (real PostgreSQL **18.6**) | **pass** — 4 legs |
| `test:admin-app-local`, `test:admin-http-smoke` (real cluster) | **pass** |
| `test:admin-pool-config`, `test:admin-rewrite-sim`, `test:admin-api-routing` | **pass** |
| `test:performance` (production build) | **pass** |
| Production build | **pass** — 60 route shells, `admin` chunk 117.0 kB |
| **All 44 `test:*` scripts** | **44 pass** — every suite, including the ten browser suites and the real-cluster ones |

Two notes on how that 44/44 was obtained, because two of the suites are one-shot by
design and will refuse a second run on the same cluster:

* `test:admin-postgres` demands a *pristine* cluster and marks it on first use. It
  was given a freshly `initdb`'d throwaway cluster; re-running it against the
  cluster it already consumed correctly fails with *"Cluster is not blank"*. That
  refusal is the suite working, not a flake.
* `test:admin-postgres-local` and the real-cluster suites need
  `BIOCRAFT_TEST_PG_BIN` / `BIOCRAFT_TEST_PG_SOCKET`; `test:admin-performance`
  needs `AUDIT_BASE` and `AUDIT_DIR`. Without those they exit with an explicit
  message rather than a false pass.

### Earlier in this work, while the local suites were green

The browser suites now run in this sandbox, so the table below is current rather
than historical. Each row was re-run against the production build being deployed.

| Suite | Result |
|---|---|
| Browser: interactions (3 viewports) | passed, 0 errors, 0 unexpected 4xx |
| Browser: phase (workflow + axe WCAG 2.1 AA) | passed on phone, tablet, desktop |
| Browser: live modules | passed on 390 px and 1440 px, all **10** routes |
| Browser: public regression, 48 routes | passed, byte-identical to the `main` baseline (`659c000`) |
| All ten browser suites together | **10 / 10 passed** |
| axe, 10 routes × 2 themes × 3 viewports (60 scans) | **0 WCAG 2.1 AA violations** |
| Layout sweep, 4 viewports × 10 routes (40 combinations) | **0 failures**; no horizontal overflow, one `h1`, one app shell, `noindex` intact |
| Touch targets (WCAG 2.5.8, 24×24) | **0** undersized controls on any Admin route |

Two real defects were found and fixed by those runs, which is the point of running
them: `GET /session` never returned the caller's identity (only an expiry), and the
notification writer suppressed the author's own "your draft was decided" message as
if it were noise.

### What a refused read looks like

Not an empty table. The console distinguishes, and tests assert, the difference
between *no data*, *not permitted*, and *the request failed*.

---

## 6. Performance numbers

Measured in the locally served production build of the current branch
(`vite preview` on the real `dist`), on `/admin/bios`, with 4× CPU throttling.
`test:admin-performance` writes the raw trace per device to disk.

| Measure | Desktop | Tablet | Emulated phone | Good threshold |
|---|---|---|---|---|
| DOMContentLoaded | 126 ms | 96 ms | 108 ms | — |
| Largest contentful paint | 344 ms | 352 ms | 332 ms | < 2500 ms |
| Cumulative layout shift | 0.0006 | 0.0008 | 0.0001 | < 0.1 |
| Interaction to next paint | 80 ms | 64 ms | 56 ms | < 200 ms |
| Long tasks (>50 ms) | 0 | 0 | 0 | — |
| Transferred on load | 121 kB | 121 kB | 121 kB | — |
| Admin shell, JS | 117.0 kB (**29.13 kB gzipped**) | | | |
| Admin shell, CSS | 23.2 kB (5.21 kB gzipped) | | | |

The INP figure is the worst interaction of the run, not a lucky sample. A separate
probe drove twelve genuine input events through the page (typed a query one key at
a time, changed a filter, paged, toggled the theme at both ends) and recorded INP
**48 ms** with a **16 ms** median, CLS 0.0000, LCP 264 ms and zero long tasks.
Synthetic `fill()` calls report nothing — the `event` timing API only observes
trusted input — which is why the first attempt measured zero interactions and was
discarded rather than reported.

All three device profiles are inside the "good" band for every Core Web Vital.
These are local numbers; the deployed Preview adds network latency I cannot
measure from here (the sandbox cannot reach `*.vercel.app`).

---

## 7. Security verification

| Property | How it is proven |
|---|---|
| No secret in browser code | Every credential is server-side; the client only ever holds an HttpOnly cookie |
| Client cannot reach the database | The limited role has no table privileges — only `EXECUTE` on 44 functions |
| Every function pins `search_path=pg_catalog` | Asserted for all 44 by the inventory test |
| No function is callable by `anon`/`authenticated` | Asserted; `revoke all` on each signature |
| RLS on the public tables is unchanged | 10 tables, all still restrictive; proven by the public-site regression |
| Separation of duties is enforced in SQL | A publisher who wrote or approved the draft is refused by the database, not the UI |
| Publication is append-only and reversible | History refuses UPDATE/DELETE; undo opens a new reviewed draft instead of rewriting |
| Audit trail cannot be edited | Trigger refuses UPDATE/DELETE; tested |
| Rollback cannot silently destroy evidence | Each rollback refuses while evidence exists |

---

## 8. Blockers and gaps

Everything I can execute safely is executed. What remains is either something only
you can do, or something this sandbox physically cannot do.

1. **You set the password.** The account exists and is confirmed, and it already
   had a password. If you do not know it, use the provider's reset flow. I never
   request, set, or store a password.
2. **You enrol the authenticator.** The first sign-in asks for password, then
   offers TOTP enrolment. Until that code is confirmed the account is AAL1 and
   every privileged call is refused.
3. **Preview SSO.** Vercel's own protection gates the Preview URL.
4. **The browser suites run, but they do not talk to the real database.** Chromium
   was unpacked from `@sparticuz/chromium` and driven by `playwright-core`, so all
   ten browser suites execute and pass. Be precise about what that proves: the
   login and recovery suites intercept `/api/admin/v1/*` with `page.route` and mock
   the responses, and `test:admin-full-flow` mocks Supabase Auth on top of PGlite.
   No suite signs into the **hosted** console against the **live** database,
   because there are no test credentials and I will not ask for yours. The real
   database is exercised by `test:admin-postgres` and
   `test:admin-postgres-local` against a local PostgreSQL 18.6 with the live
   migration set applied; the wire between the browser and the hosted function is
   the part that remains unproven.
5. **No hosted round-trip from this sandbox.** `*.vercel.app` answers every path,
   including `/api/admin/v1/health`, with a Vercel SSO login page, so I have not
   seen the deployed page answer an authenticated request. The live Supabase Auth
   service *was* reachable and reports GoTrue **v2.198.0** with email signup
   enabled and `mailer_autoconfirm: false`; the password grant itself needs a POST
   this sandbox cannot issue to that host. I will not claim a hosted sign-in.

### One deployment defect found and fixed

The read path was broken on the live deployment, and nothing in the earlier test
set caught it. Vercel's rewrite emits **two** parameters:

```
/api/admin/v1/:path*  ->  /api/admin/handler?__admin_path=$1&path=$1
```

`restoreAdminUrl` stripped `__admin_path` but left `path` behind, so the
application received `/api/admin/v1/staff?path=staff`. The API rejects unknown
query keys outright, so **all 18 paged read routes** would have answered
`400 INVALID` — the console would have looked empty everywhere.

The rewrite simulation passed only because it reproduced half of the rewrite
(`?__admin_path=<path>` with no `&path=`), which is not what Vercel does. That is
the lesson: a simulation that is more forgiving than the platform proves nothing.

The fix is in `api/admin/handler.mjs`, not in the rewrite: the duplicate is
dropped **only** when it equals the captured route, so a genuine client `path`
parameter is never swallowed. The test now reproduces the real rewrite, asserts
that every one of the 18 routes ends up with an empty query, and asserts that
client parameters survive. Confirmed load-bearing: the new test fails against the
old handler (`actual: '/api/admin/v1/staff?path=staff'`) and passes against the
fix.

### Test results as measured

| Suite set | Result |
|---|---|
| Typecheck (`tsc --noEmit`) | **pass** |
| `test:admin-grant-inventory` | **pass** — grants match the 44 canonical signatures |
| `test:admin-pool-config`, `test:admin-rewrite-sim`, `test:admin-api-routing` | **pass** |
| `test:admin-postgres` (real PostgreSQL 18.6) | **pass** |
| `test:admin-app-local`, `test:admin-http-smoke` (real cluster) | **pass** |
| `test:performance` (production build) | **pass** |
| Production build | **pass** — 60 route shells, `admin` chunk 116.72 kB |
| All 44 `test:*` suites | **44 pass** |
| Browser suites | **10 / 10 pass** — Chromium unpacked locally, driven by `playwright-core` |
| `test:admin-performance` | **pass** — run against the local production build, not a hosted deployment |

## 9. What to do next, in order

1. Open the Preview URL in §2 and sign in at `/admin/login` with
   `sachi26698@gmail.com`.
2. Enter your password. If you do not have it, reset it through the provider first.
3. Scan the setup key into an authenticator app and confirm one code.
4. You are then AAL2 and the ten modules read from the live database.

Production was not touched, no second Supabase project was created, and no
existing bio, collection, platform, category, or policy was deleted or rewritten.
