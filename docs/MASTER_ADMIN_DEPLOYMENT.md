# Run BioCraft on one browser origin

The public app, `/admin/login`, and `/api/admin/v1/*` must share the **frontend** HTTPS origin. Never set a browser API URL to a laptop, `localhost`, the database, or the backend preview port. Public pages always use the bundled catalogue; they do not need a Supabase connection. Admin database projections are separate.

## Development (Node 22.12+; two POSIX terminals)

1. `npm ci` then `npm run dev:admin-init` once. It creates `~/.config/biocraft/admin-local.env` **outside the checkout**, mode 0600, without overwriting an existing file. Four independent local keys are generated without being printed. Do not copy Production keys, use a service role or point this at an importer DSN.
2. In a private environment with network access to the existing Supabase project, complete that file: existing limited `ADMIN_DB_PASSWORD`, `ADMIN_ALLOWED_EMAILS` (existing confirmed account(s) only), and a publishable key for this project (`ADMIN_SUPABASE_PUBLISHABLE_KEY`, or its `VITE_SUPABASE_PUBLISHABLE_KEY` fallback). Confirm host/port/user against the table below. Set `ADMIN_ORIGIN` to the exact HTTPS **web** origin without a trailing slash. In Arena it defaults to `https://5173-${E2B_SANDBOX_ID}.e2b.app`. Outside Arena terminate TLS at a trusted reverse proxy to 5173, preserve `Host` and pass that bare hostname as `BIOCRAFT_DEV_WEB_HOST` to Vite; plain HTTP is for guest rendering/liveness, not Admin sign-in. Keep credentials out of chat, client source, test fixtures, logs and the Vite process. Do not source the private file in the frontend shell.
3. Start `npm run dev:api` and `npm run dev:web` separately. Restart the appropriate process after changing its environment. The API listens on 4190; the web server binds **strictly** to 5173. Proxy requests use the observed network peer as the rate-limit key (web clients can share that bucket); never trust client-supplied forwarding headers. Do not expose a raw Vite server to the public internet. Use Arena's authenticated Live Preview or a private development network.
4. On the **web origin**, inspect `/api/status/live` (listener only), `/api/status/content` (`source:bundled`, not database readiness), `/api/admin/v1/health?diagnose=1` (limited-role/command checks + Auth provider) and `/admin/login`. Without settings, the listener stays up but readiness is 503, not a successful connection. If readiness is 200, signed-out `/api/admin/v1/session` must still be 401. Use the existing account + verified authenticator in a first-party tab. Do not put its password or TOTP in an automated test. Login/session/limiter/audit records are normal operational writes even in editorial read-only mode.

## Vercel (configuration to set in the indicated scope, **not** changes applied by this batch)

Vite, install `npm ci`, build `npm run build`, output `dist`; Node Functions (current Production: Node 26.x). Keep `api/admin/handler.mjs`, `api/status/content.mjs`, the CA `includeFiles` and rewrites in `vercel.json`. No local HTTP listener or Vite proxy runs on Vercel. Production entrypoints are **not** replaced with a remote proxy. Pin a stable Preview alias and set its actual exact origin; a generated URL or SSO page is not verification of that alias. Scope the Preview variables to the intended branch.

| Setting | Preview | Production |
| --- | --- | --- |
| Build flag | `BIOCRAFT_ADMIN_PREVIEW=true` | `BIOCRAFT_ADMIN_PRODUCTION=true` |
| Public site | No Supabase settings required | No Supabase settings required |
| `ADMIN_ORIGIN` | `https://biocraft-git-arena-21fb7968-biocraft-sachi26698-6758s-projects.vercel.app` (Vercel-reported branch alias) | `https://biocraft-bice.vercel.app` |
| `ADMIN_BACKEND_ENABLED` | `true` to enable config/role gates | `true` |
| `ADMIN_DB_HOST`, `ADMIN_DB_PORT` | Current primary host from Dashboard Connect, `5432` (session mode) | Preserve the working assignment. Do not copy a hostname from an old incident. |
| `ADMIN_DB_USER` | `bc_admin_executor.jvpadtzfsuekixrquzjv` | Same existing limited role |
| `ADMIN_DB_PASSWORD` | Provision existing DB role password privately | Existing sensitive setting; no rotation requested |
| `ADMIN_ALLOWED_EMAILS` | Approved existing accounts only | Preserve existing allow-list |
| `ADMIN_SUPABASE_PUBLISHABLE_KEY` | Project publishable / matching anon key; leave unset only if using `VITE_SUPABASE_PUBLISHABLE_KEY` | Same rule |
| `ADMIN_COOKIE_KEY_HEX`, `ADMIN_FLOW_KEY_HEX`, `ADMIN_HASH_KEY_HEX`, `ADMIN_INGRESS_SECRET_HEX` | Four separate persistent, randomly generated 64-character lowercase hex secrets, **Preview-only values** | Preserve four separate **Production-only values** |
| `ADMIN_TRUSTED_CLIENT_HEADER` | `x-forwarded-for` (signed inside Node adapter) | Same |
| `ADMIN_SHARED_WRITES_ENABLED` | `false`; only enable with explicit shared-write approval | Set `false` for a read-only verification release. `true` only for approved mutations; on existing deployments omission retains the existing Production default of allowing authorized mutations |
| `ADMIN_PASSWORD_RESET_ENABLED`, `ADMIN_EDITORIAL_DIRECTORY_ENABLED` | Both `false` unless independently approved (directory needs its separate SQL) | Same; do not change Auth/redirects/grants as a connectivity fix |
| `ADMIN_CATALOG_DRAFTS_ENABLED` | `false` (default); separate [private catalogue SQL + two grants](../admin-backend/proposals/016-catalog-drafts/README.md) not applied | `false`; this release grants no new writes |

The stable Preview alias above was read from the Git-created Preview of `3340e94`; it is **not** a hosted verification of these local changes. Do not put the literal `${VERCEL_URL}` into an environment field. Use the actual HTTPS alias as one exact value. Leave the cross-scope `BIOCRAFT_ADMIN_ENABLED` unset when using the scope-specific flags.

No secret uses a `VITE_` prefix. `BIOCRAFT_LOCAL_API` is local only, not a Vercel setting. Do not set `NODE_TLS_REJECT_UNAUTHORIZED=0`. The [Production checkpoint](PRODUCTION_SYNC.md) records the earlier pooler incident; [main’s subsequent checkpoint](../MASTER_IMPLEMENTATION_TRACKER.md) records its repair. A change of Vercel environment requires a **new deployment** in that scope; this batch does not deploy or modify Production configuration. After a repair, test actual readiness/401 then owner sign-in with MFA, permission-appropriate reads and a separately authorized **private draft**, not destructive tests on public rows.

**Private connectivity check, without browser login or writes:** on a network that can reach Supabase, `npm run admin:check:local -- --connect` uses the same app/pool/CA/role checks and outputs only fixed diagnostic categories. Without `--connect` it only validates configuration. A `tenant_or_user_lookup` response is not a rejected Auth password. Do not share passwords or TOTP codes. This sandbox's backend does not have general outbound Supabase access; the connected-app SQL reader and the Vercel function are independent paths.

## Reproduce the local checks

- With both development processes up and Chromium installed, set `BROWSER_EXECUTABLE_PATH` to the Chromium binary and run `npm run test:admin-running-stack`. This uses the **actual** web/API processes, without credentials, a stub or writes. Use the default not-ready expectation for an unconfigured workspace.
- For isolated authorized workflows, additionally set `BIOCRAFT_TEST_PG_BIN` to the directory containing `initdb` and `postgres` (include the distribution's library path if necessary). `npm run test:admin-stack-browser` builds the guarded console, starts a marked disposable Unix-socket cluster and tests browser → TLS proxy → Node listener → limited DB login. It simulates only upstream Auth/REST. `npm run test:library-postgres-scale` runs the real importer twice against a different disposable DB. Neither accepts a hosted DB as its target.
- `npm run test:admin-build-matrix` and `npm run test:admin-bundle-secrets` rebuild/remove `dist`: run them **before**, not during, tests that use built files. With a separately built public baseline, `BASELINE_DIST=/path/to/baseline/dist npm run test:admin-public-regression` serves both builds temporarily, compares the routes and closes both test servers.
