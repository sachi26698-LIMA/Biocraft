# BioCraft Admin — production connection, 2026-11-09

Domain in use: **https://biocraft-bice.vercel.app**
Deployment: `dpl_JAtvgwjv2GPGU9PZte9RjePQdDnC` — READY, `PROMOTED`, aliases include
`biocraft-bice.vercel.app`. Merge commit `6f42ca7` (PR #7).

## What was actually wrong (all four fixed and deployed)

1. **The console did not exist on production.** `vite.config.ts` and
   `build-shells.mjs` gated the admin entry on `VERCEL_ENV=preview`. Production
   shipped zero admin code, so `/admin` was a blank page on the domain you use.
   Now opt-in via `BIOCRAFT_ADMIN_PRODUCTION=true`, which is set for Production.
2. **Login was open to any Supabase user.** `ADMIN_ALLOWED_EMAILS` was mentioned in
   a comment in `app.mjs` and read by nothing. Now enforced **before** the provider
   call; blank or unset fails closed at startup.
3. **The auth redirect pointed at `http://localhost:3000`** with an empty
   allow-list, so any recovery email would have linked to localhost.
4. **`/admin` was crawlable.** `robots.txt` had only `Allow: /`.

## Sign-in policy

`ADMIN_ALLOWED_EMAILS=sachi26698@gmail.com` (Production, plain).

That address is the only one that may sign in. It is verified to exist as a
confirmed Supabase user (`d63c1101-…`) with `enabled=true`, role `super_admin`,
18 permissions. Supabase **signups are now disabled** so no other account can be
self-created.

`tests/admin-allowlist.mjs` proves the important part: a denied address produces
`providerCalls=0`, i.e. its password is never sent to Supabase and it cannot
consume the real admin's rate-limit bucket. Matching is case-insensitive and exact,
so `sachi26698@gmail.com.evil.test` is rejected.

## Production environment (14 vars, all verified present in the build)

Plain: `ADMIN_ORIGIN`=`https://biocraft-bice.vercel.app`, `ADMIN_ALLOWED_EMAILS`,
`ADMIN_BACKEND_ENABLED`=`true`, `ADMIN_DB_HOST` (pooler), `ADMIN_DB_PORT`=`5432`,
`ADMIN_TRUSTED_CLIENT_HEADER`=`x-forwarded-for`, `BIOCRAFT_ADMIN_PRODUCTION`=`true`.
Sensitive/encrypted: `ADMIN_COOKIE_KEY_HEX`, `ADMIN_FLOW_KEY_HEX`,
`ADMIN_HASH_KEY_HEX`, `ADMIN_INGRESS_SECRET_HEX`, `ADMIN_DB_PASSWORD`,
`ADMIN_DB_USER`, `ADMIN_SUPABASE_PUBLISHABLE_KEY`.

The four key material values were **generated fresh for production** and are
distinct from the Preview ones. `ADMIN_DB_PASSWORD` was rotated on the
`bc_admin_executor` role and the same new value was written to both Production and
the branch Preview, so neither environment was left broken. No secret value was
read, printed, or written to this repository.

## Verified locally after the merge

| Check | Result |
|---|---|
| `tsc --noEmit` | PASS |
| Production build **with** flag | 14 admin route shells, 2 chunks |
| Production build **without** flag | 0 admin chunks (guard holds) |
| `/admin` on production build | HTTP 200, React mounted, full 13-module nav |
| Login screen desktop/tablet/mobile | PASS, no overflow, fail-closed |
| `admin-phase`, `admin-interactions`, `admin-live-modules`, `admin-lazy-error`, `admin-catalog` | PASS |
| Public regression, 48 routes | PASS, matched baseline, no errors |
| Non-browser suites | 31 PASS; remainder environmental (no Playwright Chromium, unbuilt `dist`, reused PG cluster) |

## Still NOT verified, and why

Live password + TOTP sign-in **on the deployed domain**, and any hosted HTTP call
to `/api/admin/v1/*`.

This sandbox can reach only four hosts. `example.com` and `cloudflare.com` fail
with the same mid-handshake TLS teardown as Supabase and Vercel, so this is a
generic sandbox allowlist and not a BioCraft fault. Everything reachable was
tested; the rest cannot be.

To close it, in the Admin UI at `https://biocraft-bice.vercel.app/admin`:

1. Sign in with `sachi26698@gmail.com` and your existing password.
2. Scan the QR into an authenticator app and confirm the 6-digit code.
   (`auth.mfa_factors` is currently 0 and `mfa_enrolled_at` is NULL — this is the
   genuine first-run state, so the console is login-only until you complete it.)
3. Confirm the session survives a reload, then sign out.

After enrolment every module becomes reachable, because each query passes through
`require_actor(...)` which requires `aal2`.

## Note on the earlier branch situation

`origin/main` had gained a parallel "Apple-inspired 13-module" Admin rewrite
(PR #5, branch `arena/805e3bf3-biocraft`) that had already been deployed to
production. Rather than compete with it, this work **merged it** and layered the
real backend contract, the allow-list, and the production build gate on top. That
is why production now has both the new interface and working data.

## One thing only you can decide

The `bc_admin_executor` password was rotated. If you had the previous value stored
in a password manager, replace it. The current value exists only in Vercel
(Production + branch Preview, `sensitive`). If you need it re-issued:

```bash
node scripts/admin-executor-credential.mjs --rotate
```
