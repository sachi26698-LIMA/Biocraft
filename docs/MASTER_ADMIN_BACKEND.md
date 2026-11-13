# Admin backend — deployment state and exact requirements

## What exists now (branch `arena/5e351ec3-biocraft`)

| Layer | State |
|---|---|
| SQL candidate migrations `001`–`010` + rollbacks | Written, synthetic-only, **not applied** to `jvpadtzfsuekixrquzjv` |
| Server modules (`admin-backend/server/*.mjs`) | Implemented, unmounted-by-default, tested locally |
| Serverless entry `api/admin/handler.mjs` | Deployed with the branch Preview; returns **503 for every request** because no configuration exists |
| Database credentials / grants for a limited role | **Do not exist** |
| Admin accounts / memberships in the project | **None provisioned** |
| Auth configuration changes | **None made** (shared production surface) |

## Why the hosted Preview cannot sign anyone in yet

The backend fails closed. `ADMIN_BACKEND_ENABLED` is not set, and even if it were,
the following do not exist and cannot be created without explicit approval:

1. **Schema + grants** — `bc_admin_v1` and its functions must be applied to the
   shared database, and a dedicated non-owner login must be granted EXECUTE on
   exactly the reviewed function list. Applying this is a production-adjacent
   security change, so the exact SQL, impact and rollback must be approved first
   (`docs/MASTER_ADMIN_SHARED_PROJECT.md`, `admin-backend/migrations/*`).
2. **Limited database login** — `db.jvpadtzfsuekixrquzjv.supabase.co` requires
   the project's database password/user, which is not available in this
   environment and must not be committed.
3. **Admin provisioning** — an `auth.users` row plus an enabled `admin_users`
   membership and a `super_admin` role. There is deliberately no self-service
   bootstrap; creating the first administrator is a reviewed, audited action.
4. **Auth settings** — project `site_url` is `http://localhost:3000`, the
   redirect allow-list is empty, signup is enabled and the password minimum is 6
   characters. Recovery e-mail delivery is unverified (no SMTP configured).
5. **TOTP enrolment** — enabled in the project, but the first administrator must
   enrol an authenticator app before any Admin session can be issued.

## Environment variables the server needs (server-only, never `VITE_`)

```
ADMIN_BACKEND_ENABLED=true
ADMIN_ORIGIN=https://<exact deployment origin>
ADMIN_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
ADMIN_DB_USER=<dedicated limited role>            # bc_admin_executor.<project-ref> on the pooler
ADMIN_DB_PASSWORD=<secret>
ADMIN_DB_HOST=<optional; aws-<n>-<region>.pooler.supabase.com>
ADMIN_DB_PORT=<optional; only 5432 is accepted>
ADMIN_COOKIE_KEY_HEX=<64 hex chars>
ADMIN_FLOW_KEY_HEX=<64 hex chars, different>
ADMIN_HASH_KEY_HEX=<64 hex chars, different again>
ADMIN_TRUSTED_CLIENT_HEADER=x-forwarded-for
ADMIN_INGRESS_SECRET_HEX=<64 hex chars>
```

Rotating the three keys invalidates pending logins, session cookies and stored
handoffs; rotating `ADMIN_INGRESS_SECRET_HEX` alone only breaks the proxy
signature until redeployed.

## API surface (implemented, server-enforced)

- `GET /api/admin/v1/health` — liveness only.
- `POST /api/admin/v1/auth/login`, `POST /api/admin/v1/auth/mfa` — password +
  TOTP, encrypted single-use handoff, encrypted session cookie.
- `POST /api/admin/v1/auth/enroll`, `POST /api/admin/v1/auth/enroll-confirm` —
  first-factor enrolment for an account with no verified TOTP yet. The password
  flow authorises exactly one attempt; the account must hold an enabled Admin
  membership with a live provider session (`011_totp_enrolment.sql`), every
  attempt is audited, and the secret is returned once and never stored.
- `POST /api/admin/v1/auth/recovery/request|exchange|complete` — recovery with
  TOTP, Admin session revocation before the provider password change.
- `GET /api/admin/v1/session`, `GET /api/admin/v1/csrf`, `DELETE /api/admin/v1/session`.
- `GET /api/admin/v1/bio-drafts`, `GET /api/admin/v1/bio-drafts/:id`,
  `POST /api/admin/v1/bio-drafts`, `PUT /api/admin/v1/bio-drafts/:id`,
  `POST /api/admin/v1/bio-drafts/:id/submit|review`,
  `GET /api/admin/v1/bio-review-queue`.
- `GET /api/admin/v1/platforms|categories|collections|generators|seo-pages|roles|analytics|sessions|audit-logs`,
  `GET|PUT /api/admin/v1/settings`, `GET /api/admin/v1/staff`.

Writes require a provider-observed TOTP event no older than 10 minutes; missing
evidence returns `403 STEP_UP_REQUIRED`.
