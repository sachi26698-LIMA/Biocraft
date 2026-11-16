# BioCraft — Phase 6 Verification Report

Branch `arena/5e351ec3-biocraft` · HEAD `64e637b` · 2026-11-09
Preview: `https://biocraft-git-arena-5e351ec3-biocraft-sachi26698-6758s-projects.vercel.app`

**Status: NOT COMPLETE.** Backend verified real and secure. Hosted and live-auth
verification are **blocked by a sandbox network allowlist**, not by a BioCraft defect.
Do not read this as a pass.

---

## 1. Root cause of every blocked item (new, decisive)

The sandbox has an **egress allowlist of four hosts**. Everything else has its TLS
handshake killed after TCP connect. Control test:

| Host | HTTP | Result |
|---|---|---|
| github.com | 200 | allowed |
| registry.npmjs.org | 200 | allowed |
| pypi.org | 200 | allowed |
| `jvpadtzfsuekixrquzjv.supabase.co` | 000 | `SSL_ERROR_SYSCALL` |
| `aws-0-ap-southeast-2.pooler.supabase.com` | 000 | `SSL_ERROR_SYSCALL` |
| **example.com** | 000 | `SSL_ERROR_SYSCALL` |
| **cloudflare.com** | 000 | `SSL_ERROR_SYSCALL` |

`curl -v` shows TCP 443 connecting, Client Hello sent, then the connection is torn down
mid-handshake.

**`example.com` failing proves this is a generic sandbox allowlist, not a Supabase or
Vercel problem.** A previous session concluded "no network egress to Supabase" from a
browser `Failed to fetch`. That conclusion was right about the effect and wrong about
the cause; the superseded diagnosis is discarded.

Consequences — these are **NOT VERIFIED**, not failed:
- hosted HTTP tests against the Preview,
- real Supabase password grant + TOTP,
- live Admin CRUD against the hosted function.

---

## 2. PASSED — verified against the real project `jvpadtzfsuekixrquzjv`

Checked through the Supabase connector (org-authorized API, outside the sandbox
allowlist) and local execution. No credentials were read or printed.

### 2.1 Backend services healthy
`auth` `db` `pooler` `rest` `pg_bouncer` → all `ACTIVE_HEALTHY`. GoTrue `v2.198.0`.
There is **no Supabase outage**. Auth is a real, running service.

### 2.2 The real admin account exists
```
user_id d63c1101-6a26-4077-8e9b-34080faa48fd · enabled true · role super_admin
18 permissions · mfa_enrolled_at NULL · auth.mfa_factors 0 · sessions 0
```
`auth.users` 1 · `admin_users` 1 · `admin_user_roles` 1 · `admin_audit_logs` 1.

TOTP is genuinely **not yet enrolled**. That is an honest first-run state, not a fault.

### 2.3 Schema contract is exact — zero drift
The backend references 44 `bc_admin_v1.*` RPCs. All 44 exist in the live database.
Database holds 49 functions; the 5 extras are trigger/gate helpers the code never calls
directly (`guard_approval`, `guard_draft`, `notify_draft_event`, `reject_mutation`,
`stamp_mfa_enrolled`).

**Called by code but missing in DB: none.**

### 2.4 RLS and role separation are real
- 20 admin tables, **RLS enabled on all 20**, one policy each.
- `bc_admin_executor`: `rolsuper=false`, `rolbypassrls=false` — a dedicated limited
  login, exactly as `app.mjs` `assertLimitedRole()` requires.
- `bc_admin_executor` has **no direct SELECT** on any of the 20 tables. It reaches data
  only through `SECURITY DEFINER` functions that first call `require_actor()`.

### 2.5 Admin schema is not exposed to the public API
| role | schema USAGE | admin_users SELECT | audit SELECT | list_staff EXECUTE | require_actor EXECUTE |
|---|---|---|---|---|---|
| `anon` | false | false | false | false | false |
| `authenticated` | false | false | false | false | false |
| `service_role` | false | false | false | false | false |
| `bc_admin_executor` | true | false | false | true | true |

A logged-in public user and the anon key cannot see or execute anything in `bc_admin_v1`.

### 2.6 MFA cannot be bypassed — proven by execution on the live DB
`require_actor()` demands a live session **and** `aal = 'aal2'`. Both bypass attempts
rejected with SQLSTATE `42501 not authorized`:

| Attempt | Rejected at | Result |
|---|---|---|
| forged claims `aal1` | line 8 (AAL check) | `42501` |
| forged claims `aal2`, no real session | line 16 (session-binding check) | `42501` |

The assurance level is not client-assertable, and a fabricated session id alone does not
open the gate. Both checks are load-bearing.

### 2.7 Permission matrix
8 roles, 18 distinct permissions. `super_admin` 18 · `admin` 10 · `content_manager` 6 ·
`auditor` 4 · `analyst` 3 · `editor` 3 · `moderator` 3 · `seo_manager` 3.
Least privilege holds: `editor` cannot publish, `moderator` cannot draft, `analyst`
cannot read content, `auditor` is read-only.

### 2.8 Env-var names are correct (naming defect ruled out)
All 12 names the server reads exist in the Preview scope:
`ADMIN_BACKEND_ENABLED` (`true`), `ADMIN_ORIGIN`, `ADMIN_DB_HOST`, `ADMIN_DB_PORT`
(`5432`), `ADMIN_DB_USER`, `ADMIN_DB_PASSWORD`, `ADMIN_SUPABASE_PUBLISHABLE_KEY`,
`ADMIN_TRUSTED_CLIENT_HEADER` (`x-forwarded-for`), `ADMIN_COOKIE_KEY_HEX`,
`ADMIN_HASH_KEY_HEX`, `ADMIN_FLOW_KEY_HEX`, `ADMIN_INGRESS_SECRET_HEX`.

`ADMIN_ORIGIN` **exactly equals** the live branch alias, so the `url.origin !== origin`
403 cannot fire. The `ADMIN_TRUSTED_CLIENT_HEADER` value matches `clientKey()`'s regex.
The ingress chain is wired correctly: `node-adapter.toWebRequest()` signs
`x-forwarded-for` with `ADMIN_INGRESS_SECRET_HEX`, discards any inbound signature, and
`app.mjs clientKey()` verifies it with a timing-safe compare.

### 2.9 All 11 Admin modules are wired to the backend
`live = backend === 'ready' || 'unauthenticated'` (AdminApp.tsx:147). When the probe
succeeds, these mount: Overview, Users, Content, Library (+LiveModules), Analytics,
Security, Settings, Categories (+SeoPages), Platforms, Generators. The
"not connected" strings still in `AdminApp.tsx` are the **fallback branch only**.

### 2.10 Automated suites
| Check | Result |
|---|---|
| `tsc --noEmit` | PASS (exit 0) |
| `test:admin-postgres` on fresh PG 18.6 cluster | PASS |
| `test:build-admin-entry` with both Preview vars | PASS — `admin-BYaEJopb.js`, 11 route shells |
| test scripts registered | 47 |

The PostgreSQL suite covers: immutable concurrent bio edits, non-owner RBAC, session
expiry, restrictive RLS, membership lock, concurrent limiter, atomic handoff, recovery
revocation, AAL1-only enrolment gate with audit, Super-Admin-authorized single-use
recovery (replay, supersession, five-attempt exhaustion), privileged factor reset, and
bounded cleanup that spares audit evidence.

---

## 3. FAILED / BLOCKED

### A. Hosted Preview verification — BLOCKED (network + SSO)
Two independent blockers, both structural:
1. Sandbox cannot reach `*.vercel.app` (§1).
2. Vercel SSO gates every Preview URL: `ssoProtection.deploymentType =
   "all_except_custom_domains"`. Every path, including `/api/admin/v1/*`, 302s to
   `vercel.com/login`.

**Not changed.** Lowering this would expose the Admin API publicly, which you forbade.
Options in §5.

### B. Real password login + TOTP — BLOCKED (network)
Auth service is healthy (§2.1) and the account is real (§2.2). The sandbox simply
cannot reach it. Nothing to fix in the app; see §4 for the exact command to run.

### C. Two real config defects found (unfixed — need your approval)
1. **Provider auth redirect is unconfigured.**
   `site_url = "http://localhost:3000"`, `uri_allow_list = ""`.
   `recovery-controller.mjs:38` calls `resetPasswordForEmail(email, {redirectTo:
   origin + '/admin/recovery'})`. Supabase only honours `redirectTo` if it is
   allow-listed, so a real recovery email would link to **localhost**.
   *Current live impact: none* — `createRecoveryController` is instantiated at
   `app.mjs:97` and **never mounted** (dead binding; `/auth/recovery/complete` is served
   by `auth-controller` and uses a Super-Admin-issued code, not email). Must be fixed
   before provider-based email recovery is ever enabled.
2. **Stray env var** `vite_supabase_publishable_key` (lowercase, sensitive, empty).
   Harmless — Vite only inlines `VITE_`-prefixed names, so it is never bundled — but it
   is duplicate noise and should be deleted.

### D. Module data will be empty until TOTP enrolment
Every module query passes through `require_actor(...)`, which requires `aal2`. An admin
with `mfa_enrolled_at = NULL` can authenticate but cannot read a single module. This is
correct fail-closed design, but it means **the console is login-only until enrolment is
completed**, and enrolment itself must be done by you (I must not handle your password
or TOTP secret).

### E. Branch drift — outside this session, please read
`origin/main` gained 2 commits I did not make:
- `8b16764` — from branch `arena/805e3bf3-biocraft` (a **different** session)
- `d0b6c87` — that branch merged as **PR #5**, deploying
  `dpl_8mSXkQHFuhkVYAViSzvV91yBiBfF` to **production**

This is a parallel Admin redesign ("Apple-inspired light UI, 13-module console") written
against a different codebase state. Production was deployed by that work, contrary to
the no-production constraint — but not by me. My branch is unchanged at `64e637b`.
**I have not merged, rebased, or touched it.** Tell me how you want these reconciled.

---

## 4. What you must run (I cannot — sandbox allowlist)

From your own machine, in the repo:

```bash
# 1. Hosted reachability, with SSO bypass token from Vercel
#    Settings → Deployment Protection → Protection Bypass for Automation
curl -sS -H "x-vercel-protection-bypass: $VERCEL_BYPASS" \
  https://biocraft-git-arena-5e351ec3-biocraft-sachi26698-6758s-projects.vercel.app/api/admin/v1/health
# expect: {"ok":true}

# 2. Real auth, no credentials in shell history
node --input-type=module -e '
const r=await fetch(process.env.SUPA+"/auth/v1/token?grant_type=password",{
  method:"POST",headers:{"apikey":process.env.SUPA_KEY,"content-type":"application/json"},
  body:JSON.stringify({email:process.env.ADMIN_EMAIL,password:process.env.ADMIN_PW})});
const j=await r.json();console.log("status",r.status,"aal",j.access_token?"token issued":"no token");'
# then enrol TOTP in the UI and confirm auth.mfa_factors has 1 verified row
```

Then, in the Admin UI at `/admin`: password → enrol authenticator → session persists →
each module loads real rows → logout clears the cookie.

---

## 5. SSO options (none applied — your decision)

The constraint is that Admin must never be public. So SSO stays on; you pick which
door moves:

1. **Custom domain on the Preview branch** (recommended). SSO is bypassed only for
   custom domains — attach e.g. `preview.biocraft.in` to this branch. Admin keeps SSO
   *and* gains the exemption. Once the project is on Pro, the same domain can sit behind
   **Vercel Authentication** scoped to that domain alone.
2. **Protection Bypass for Automation.** Generate a bypass secret and use it **only**
   in the automated hosted-HTTP test, never in client code. Keeps the human door behind
   SSO. Note the bypass token is a bearer credential — it goes in the CI secret store,
   never in the repo.
3. **Do nothing.** Admin stays fully private; hosted verification stays manual (§4).

I recommend **(1)**. It is the only option that both enables verification and keeps the
Admin API unreachable to the public internet.

---

## 6. Verdict

| Area | Verdict |
|---|---|
| Backend health, schema, RPC contract | **PASSED** |
| RLS, role separation, public exposure | **PASSED** |
| MFA enforcement / anti-bypass | **PASSED** (executed on live DB) |
| Env var names & ingress signing | **PASSED** |
| Module wiring (11/11) | **PASSED** |
| TypeScript + PG 18.6 + build gate | **PASSED** |
| Hosted HTTP end-to-end | **BLOCKED** — sandbox allowlist + SSO |
| Live password + TOTP + CRUD | **BLOCKED** — sandbox allowlist |
| Email-based recovery | **DEFECT** — `site_url` localhost; controller unmounted |
| Mobile performance re-run | **NOT RE-RUN** — no new perf measurement this pass |

**Do not call BioCraft complete.** The backend is genuinely real and genuinely
locked down, and that is now evidenced rather than asserted. The user-facing flows are
still unverified because this environment cannot reach them. §4 is the shortest path to
closing it.
