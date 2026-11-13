# Master Admin — delivery status, verified

_written 2026-11-13. Everything below is either a measured result from this
repository or an explicit statement that something was not verified. Nothing is
described as done because it was written; a feature is only marked complete if a
test in this repository exercises it._

---

## 1. The single decision that is blocking the live console

**The Admin console is built and deployed, but it cannot query the database yet.**
The reason is not a bug — it is that the Admin schema does not exist in the shared
Supabase project, and creating it needs your yes.

Confirmed this session against `jvpadtzfsuekixrquzjv` (read-only query):

| Check | Result |
|---|---|
| Admin schema `bc_admin_v1` present | **0** |
| Admin roles (`bc_admin%`) present | **0** |
| Public bios | **506**, all active |
| Collections (`source_slug`) | **20** |
| Categories / platforms | **33 / 8** |
| Public tables with RLS | **10** |

So the public site is healthy and untouched, and the Admin package has not been
applied. The console therefore shows the bundled read-only preview: it probes
`/api/admin/v1/health`, gets no answer, and says so instead of displaying invented
numbers.

**What your yes authorises** (one approval covers all of it, details in
`docs/CONSOLIDATED_APPROVAL_REPORT.md`):

1. apply migrations `001`–`014` to the shared project (new schema only; no change
   to any existing table, policy, or `public` row);
2. create the restricted `bc_admin_executor` login the server uses;
3. provision exactly one Super Admin account;
4. set the server-only environment variables in the Preview environment.

Nothing in that list deletes or rewrites content. `013` is the only file that can
write to `public.bios`, it only ever inserts or updates, and every write is behind
an independent review.

---

## 2. Preview URL

```
https://biocraft-git-arena-5e351ec3-biocraft-sachi26698-6758s-projects.vercel.app/admin
```

Deployment for this work: `dpl_EfbeVhci6ZWr1acBMzMM4Yt2ajMw` (commit `88039e2`).
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

What I need from you to finish step 1: **the email address** to provision. Nothing
else — no password.

---

## 4. Feature checklist

Legend: **Verified** = exercised by an automated test in this repository.
**Built** = implemented, typechecked, rendered in a browser against the server's
response shape, but its database half needs the approval above.

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
| Categories / Platforms / Generators | Preview only | Read from bundled data; no live command exists, and the screen says so |

### Data layer

| Item | State |
|---|---|
| 14 forward migrations, 14 rollbacks, 1 grant file (29 SQL files) | Verified, SHA-256 pinned in both documents |
| 20 tables, 49 functions = 44 callable + 5 trigger bodies | Machine-derived; a stale count fails a test |
| Rollback of every migration, including the newest first | Verified on a fresh database |
| `public` schema byte-identical after a full rollback | Verified |

---

## 5. Real test results

All numbers below are from runs in this session on this machine. PostgreSQL means a
real PostgreSQL 17.11 server on a disposable local socket — not the shared project.

| Suite | Result |
|---|---|
| 28 Node/API/domain suites | **28 passed, 0 failed** |
| PostgreSQL integration (4 legs) | **4 passed** |
| Grant inventory + document sync | **passed** (43→44 grants, both docs reproduce every file) |
| Browser: interactions (3 viewports) | **passed**, 0 errors, 0 unexpected 4xx |
| Browser: phase (workflow + axe WCAG 2.1 AA) | **passed** on phone, tablet, desktop |
| Browser: live modules (new) | **passed** on 390 px and 1440 px |
| Browser: public regression, 48 routes | **passed** — byte-identical to the `7c9e904` baseline |

Two real defects were found and fixed by these runs, which is the point of running
them: `GET /session` never returned the caller's identity (only an expiry), and the
notification writer suppressed the author's own "your draft was decided" message as
if it were noise.

### What a refused read looks like

Not an empty table. The console distinguishes, and tests assert, the difference
between *no data*, *not permitted*, and *the request failed*.

---

## 6. Performance numbers

Measured in the locally served production build, desktop 1440×900, throttled to
4× CPU on an emulated device — i.e. pessimistically.

| Measure | Desktop | Tablet | Emulated phone |
|---|---|---|---|
| DOMContentLoaded | 152 ms | 188 ms | 116 ms |
| Largest contentful paint | 532 ms | 552 ms | 540 ms |
| Cumulative layout shift | 0.0006 | 0 | 0.0001 |
| Admin shell, JS | 109.75 kB (**27.46 kB gzipped**) | | |
| Admin shell, total transfer | 107.8 kB | | |

No long task exceeded 289 ms. These are local numbers; the deployed Preview adds
network latency I cannot measure from here (the sandbox cannot reach
`*.vercel.app`).

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

## 8. Blockers

1. **The approval in §1.** Everything downstream waits on it.
2. **The Super Admin email address** — needed to provision the one account.
3. **Preview SSO.** Vercel's own protection gates the Preview URL. I cannot test
   the hosted deployment from this sandbox at all (no outbound route to
   `*.vercel.app`), so every "verified" claim above is from the local production
   build and real PostgreSQL, not from the hosted URL. I will not claim otherwise.

---

## 9. The exact minimal action required from you

Reply, in Hindi or English, with:

> **YES** — and the email address for the Super Admin.

That authorises §1 items 1–4. If you prefer to split it, the smallest first step
that unblocks anything visible is items 1 and 2 only; say so and I will do exactly
that and stop.

I will not touch Production, will not create another Supabase project, and will not
delete or rewrite any existing bio, collection, or policy.
