# BIOCRAFT — Critical Fix & Stabilisation: Final Acceptance Report

Branch `arena/92b611c5-biocraft` · 2026-11-09 · updated after merging `main`
Project: `jvpadtzfsuekixrquzjv` (existing only, no new project created)

Every row is marked **PASS**, **FAIL** or **NOT VERIFIED**. Nothing is marked PASS
that was not actually executed.

---

## 1. Production Admin URL

**https://biocraft-bice.vercel.app/admin** — deployed and live.

The Phase 1 fix is **built and committed but not yet deployed**: this branch
contains the build-gate fix, and production currently runs the previous gate.
Shipping it requires a PR merge, which is your decision (§12).

## 2. Preview Admin URL

`branches/arena/92b611c5-biocraft` Preview — currently **builds a blank console**.
This is the very defect Phase 1 fixes; it will be correct once this branch is
merged and redeployed. Not claimed as working.

---

## 3. All 14 Admin routes

| Route | Navigation | Reload |
|---|---|---|
| `/admin` | PASS | PASS |
| `/admin/login` | PASS | PASS |
| `/admin/users` | PASS | PASS |
| `/admin/bios` | PASS | PASS |
| `/admin/categories` | PASS | PASS |
| `/admin/collections` | PASS | PASS |
| `/admin/platforms` | PASS | PASS |
| `/admin/generators` | PASS | PASS |
| `/admin/content` | PASS | PASS |
| `/admin/analytics` | PASS | PASS |
| `/admin/audit-logs` | PASS | PASS |
| `/admin/security` | PASS | PASS |
| `/admin/settings` | PASS | PASS |
| `/admin/backup` | PASS | PASS |

Each asserted: HTTP 200, non-Admin title absent, React mounted children in
`#root`, >40 characters of rendered text (a blank page fails here), admin chrome
present, and no page errors or asset 404s. `tests/admin-routes-14-browser.mjs`.

### The Phase 1 defect, precisely

`vite.config.ts` and `build-shells.mjs` gated the admin entry on a hardcoded
`PREVIEW_BRANCHES` set naming two **old** branches. On this branch a Preview build
produced **0 admin chunks** while still writing 14 static shells — so every route
served a document that 404'd its own script. That is the blank page.

Fixed by replacing the branch list with one flag per scope. Verified matrix:

| Scope | Flag | chunks | shells |
|---|---|---|---|
| preview | none | 0 | 0 |
| preview | `BIOCRAFT_ADMIN_ENABLED=true` | 1 | 14 |
| production | none | 0 | 0 |
| production | `BIOCRAFT_ADMIN_PRODUCTION=true` | 1 | 14 |

Shells and chunks **never** disagree. `tests/admin-build-matrix.mjs` enforces it,
and was confirmed load-bearing by reintroducing the branch list (it failed).

---

## 4. Authentication and TOTP

| Check | Result | Evidence |
|---|---|---|
| Super Admin account exists, confirmed, not banned | **PASS** | `sachi26698@gmail.com`, `d63c1101…`, `email_confirmed_at` set |
| Exactly one admin, no duplicates | **PASS** | `auth.users` = 1, `admin_user_roles` = 1 |
| 18 Super Admin permissions | **PASS** | counted live: 18 |
| `ADMIN_ALLOWED_EMAILS` exact value | **PASS** | Production and Preview both `sachi26698@gmail.com` |
| Unauthorized login rejected | **PASS** | `tests/admin-allowlist.mjs`, `providerCalls=0` for a denied address |
| Fail-closed when allow-list unset | **PASS** | 3 fixtures in `admin-app-local` |
| Supabase Auth service live | **PASS** | GoTrue `v2.198.0`, `ACTIVE_HEALTHY` |
| TOTP enrolment / verify logic | **PASS** | `admin-totp-enrolment`, `admin-totp-recovery` |
| Rate limit / lockout | **PASS** | `password-login` cap 5, 1-min window, per-network **and** per-account |
| Session expiry | **PASS** | capped at 1 h, `requires aal2` |
| Logout / revoke | **PASS** | `admin-session-cookie`, `admin-full-flow` |
| **Real password + TOTP on the live domain** | **NOT VERIFIED** | see §11 |

**Important:** `mfa_enrolled_at` is NULL and `auth.mfa_factors` is 0. Sign-in works,
but every module stays closed until you complete the one-time TOTP enrolment — by
design, because every query passes `require_actor`, which demands `aal2`.

## 5. Password recovery

| Check | Result |
|---|---|
| `site_url` is the real domain | **PASS** — `https://biocraft-bice.vercel.app` |
| `localhost:3000` removed | **PASS** |
| Exact allow-listed redirect URIs | **PASS** — `/admin` and `/admin/*` on production and Preview + `localhost:5173` |
| Signups disabled | **PASS** — `disable_signup: true` |
| Expired / invalid / reused recovery links | **PASS** — `admin-totp-recovery` (single-use, replay, 5-attempt exhaustion) |
| **Actual email delivery** | **NOT VERIFIED** — not tested, so not claimed |

Exactly one residual localhost entry remains (`http://localhost:5173/admin`) and it
is intentional: it is the dev-server origin, not `:3000`, and it cannot be reached
from production. Say the word and it goes.

## 6. Supabase connection

| Check | Result |
|---|---|
| Project health | **PASS** — auth, db, pooler, rest, pg_bouncer all `ACTIVE_HEALTHY` |
| Schema contract | **PASS** — all 44 RPCs the backend calls exist; 0 missing |
| Admin ↔ public data bridge | **PASS** — `publish_bio_draft` writes `public.bios` after independent approval |
| `bc_app_v1` necessary? | **NO** — the site reads `public.*`, which already holds live data |
| Public tables + RLS | **PASS** — 10 tables, RLS on all, `bios_public_read` = `is_active` |
| Live public data | **PASS** — 6,750 rows (506 bios, 3,888 captions, 629 symbols, …) |
| **Public site wired to Supabase** | **NOT DONE** — see §8, needs your decision |

## 7. Database credentials

| Check | Result |
|---|---|
| Role is least-privilege | **PASS** — `bc_admin_executor`: no superuser, no BYPASSRLS, 0 memberships |
| No direct table SELECT | **PASS** — cannot read any of the 20 admin tables directly |
| Production uses correct credential | **PASS** — `ADMIN_DB_PASSWORD` + `ADMIN_DB_USER` set for production |
| Preview uses same rotated credential | **PASS** — updated in the same rotation |
| No credential in any bundle | **PASS** — 123 built files scanned, 0 values, 0 server-only names |
| Obsolete duplicate var removed | **PASS** — lowercase `vite_supabase_publishable_key` deleted |
| **Live DB connection from the deployed function** | **NOT VERIFIED** — needs one real login (§11) |

No value was ever read, printed or committed. The pooler host/port/user appear only
as non-secret identifiers.

## 8. Public website

| Check | Result |
|---|---|
| 48 public routes vs baseline | **PASS** — identical title, description, headings, header/footer, no errors |
| 12 tool pages + mobile | **PASS** — `tools-browser` |
| Guest read permissions | **PASS** — `anon` SELECT on all 10 public tables |
| Service-role key in frontend | **PASS** — absent |
| **Live Supabase read on the public site** | **BLOCKED — your decision** |

### Why this is blocked, not done

The site is not wired because wiring it as-is would **break 5 live pages**. Five
collections exist in the bundle with **zero** rows in `public.bios`:
`creator-bio`, `cute-bio`, `gamer-bio`, `hinglish-bio`, `shree-ram-bio`.

`BioCollectionPage` deliberately treats an empty live result as authoritative — an
existing test (`collection-navigation.cjs`) asserts exactly that, so users see an
honest "no live bios" message rather than stale bundled rows. Connecting Supabase
today would blank those five working pages.

I wrote the fallback fix, then **reverted it**, because flipping a tested,
deliberate product decision is yours to make, not mine. Two options:

- **A — populate first, then connect (recommended).** Add the five missing
  collections' rows, then set the two public env vars. Nothing blanks at any point.
- **B — connect now, keep bundled fallback.** I change the empty-result rule and
  rewrite that test. Pages stay full, but "empty means hidden" stops working.

## 9. Security and RLS

| Check | Result | Evidence |
|---|---|---|
| 20 admin tables RLS-enabled | **PASS** | 20/20, 1 policy each |
| Admin schema invisible to public API | **PASS** | `anon`/`authenticated`/`service_role` all lack USAGE |
| MFA bypass rejected | **PASS** | forged `aal1` → `42501`; forged `aal2` + fake session → `42501` |
| Every privileged route requires auth | **PASS** | 29 routes → 401, provider and DB untouched |
| Hostile Authorization headers rejected | **PASS** | 5 malformed shapes × 6 routes |
| Direct URL bypasses authorization | **PASS** | deep links show login gate, no privileged data |
| `robots.txt` blocks `/admin` | **PASS** | `Disallow: /admin`, `/admin/`, `/api/admin/` |
| `noindex` headers + meta | **PASS** | `X-Robots-Tag` on 3 route groups + `<meta robots>` in shell |
| No privilege escalation via URL | **PASS** | permission comes from `require_actor`, never the request |

## 10. Mobile performance (Android emulated, 390×844)

| Metric | Value | Rating |
|---|---|---|
| LCP | 440 ms | good (< 2500) |
| CLS | 0.0000 | good (< 0.1) |
| INP (approx.) | 208 ms | borderline (≤ 200 target) |
| Long tasks > 50 ms | 3 | acceptable |

Tablet LCP 540 ms / CLS 0.0247; desktop 540 ms / CLS 0.0186. CLS on tablet and
desktop is **higher than the earlier 0.0001** — a real regression introduced by the
redesigned UI, worth a dedicated pass but not a blocker (still well under 0.1).

## 11. Remaining blockers

1. **Live password + TOTP on the real domain — NOT VERIFIED.** This sandbox can
   reach only 4 hosts; `example.com` and `cloudflare.com` fail identically, so
   Supabase and Vercel are unreachable from here. Everything reachable was tested.
2. **Email delivery — NOT VERIFIED.** No delivery test was run, so no claim is made.
3. **Phase 1 fix not yet deployed** — needs a merge to `main` (§12).
4. **Public site not wired** — §8, options A or B.
5. **Total-password lockout** — a 5/minute cap exists. Supabase returns the same
   error for wrong password and unknown account, so no enumeration through login,
   but a hard lockout needs a password-verification hook. Not implemented.
6. **CLS regression** on tablet/desktop from the redesign (§10).

## 12. What needs your approval

| # | Change | Impact (Hindi) |
|---|---|---|
| 1 | Merge this branch to `main` | Production par naya build jayega jo blank-page defect fix karta hai. Bina iske live Admin routes par wahi purana risk rahega. |
| 2 | Option A: 5 collections ki rows add karna | Public site par 5 pages jo abhi bundled data se chal rahe hain, wahi dikhte rahenge. Kuch bhi blank nahi hoga. |
| 3 | Option B: public site ko Supabase se jodna | Site live data use karegi, lekin 5 collections ke pages khaali ho sakte hain jab tak rows add na hon. |
| 4 | Coarse lockout (needs a provider hook) | Galat password par account thodi der band ho jayega. Abhi sirf 5/minute ki limit hai. |

I have **not** merged, **not** enabled the public Supabase link, and **not** changed
`bc_app_v1` or any table — those need the approvals above.

## 13. Found while merging `main`

Merging `main` surfaced one pre-existing failure, reproduced identically on
`origin/main` in a clean worktree, so it was **not** caused by this branch:

- **`Copy all` on the symbol grid had no visible confirmation.** It copied the
  right text and announced it to assistive tech, but the button's own label never
  changed, so a sighted user could not tell the copy happened. Every other copy
  control in the tool swaps to a check. Fixed in `SymbolGenerator.tsx` to match.
- **The workflow test assumed every copy button is clickable.** The new
  Basic/Advanced toggle hides the combo chips behind `display: none`, giving them
  a 0×0 box that no scroll can bring into view. The test now selects visible
  buttons, so it still fails when a tool renders no usable output.

I verified the Advanced section separately: all 61 copy buttons become visible and
the combos work in Advanced mode. The product was hiding them by design.

Two harness ordering constraints are documented rather than "fixed", because the
behaviour is intentional: `test:admin-build-matrix` and `test:admin-bundle-secrets`
both build and then **delete** `dist/`, so any suite that needs a built preview
must run after them. The runs above respect that order.

## 14. Test totals

| Suite | Result |
|---|---|
| `tsc --noEmit` | **PASS** |
| Production build | **PASS** — 14 shells, 2 chunks |
| Preview build (both flag states) | **PASS** |
| Non-browser + browser suites | **54 / 54 PASS** (after merging `main`) |
| `admin-postgres` on a fresh cluster | **PASS** — PostgreSQL 18.6 |
| `build-admin-entry` both directions | **PASS** |
| New guards added | `admin-build-matrix`, `admin-routes-14`, `admin-api-authz`, `admin-bundle-secrets` |
