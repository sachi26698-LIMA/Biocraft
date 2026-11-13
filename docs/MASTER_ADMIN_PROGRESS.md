# Master Admin — persistent execution tracker

## Current checkpoint

Branch `arena/5e351ec3-biocraft`; current checkpoint is prepared for a Preview-only deployment. The hosted Preview is UI-only: backend building blocks are not wired or deployed as APIs. Verify the current deployment separately before claiming hosted behavior. Phase 4 reviews and prior local drafts remain intact. No connected Supabase project, grants, policies, accounts, content, secrets, environment variables or deployments were changed in this checkpoint. Owner now selected shared project `jvpadtzfsuekixrquzjv` as the sole Admin target. Shared security migrations require the exact SQL, impact and rollback to be shown and explicitly approved first; no changes made. See [current shared boundary](MASTER_ADMIN_SHARED_PROJECT.md).

| Phase | Status | Completed / next executable task |
|---|---|---|
| 1 Shared boundary | **Owner decision recorded** | Use only existing shared project; no new project. Admin and public application share Production-connected database, Auth and operational risk. Read-only metadata verified exact ref and 506 bio rows. Local synthetic fixtures are isolated; connected Preview is not. |
| 2 Database | **Partially implemented, locally tested only** | Four local-only candidate migrations: 15 normalized tables, keys/constraints/indexes, RLS deny, append guards, eight-role permission catalog, and private role/session-checked draft commands. No EXECUTE grant on the new commands. Next: validate all field semantics, complete idempotency/outbox, owner/default grants and security review using real disposable Postgres, then separately approved shared-project deployment. No live admin migration has run. |
| 3 Auth/RBAC | **Partial server boundary; not integrated** | `admin-backend/server/identity.mjs` implements provider `getUser` verification, project issuer/audience/AAL checks and an injected live session/permission gate for reads; mock/SDK-intercepted tests only. `auth-flow.mjs` adds server-only provider password, verified TOTP and logout building blocks; only mocked, no secure session store or durable limiter. There is no wired session resolver, complete login/MFA flow or HTTP endpoint. Build transaction-bound RBAC and session revocation, last-S serialization, MFA freshness, logout/recovery, lockout and safe bootstrap before any access. |
| 4 Modules | **Validation utility only; modules not implemented** | `admin-backend/domain/bio.mjs` validates allowlisted text/flags, Unicode, trusted supplied platform rules and duplicate hints; independently tested but not connected to UI or backend. Existing UI remains scratchpad/static inventory only. Implement real modules against verified commands, not mocks. |
| 5 Workflow/publishing | **Partial local integrity only** | 002/004 enforce fixture session/role checks, assigned reviewer, stale-version conflict, immutable version, matching approval and transactional success audit. They are private/ungranted, use mocked identity, lack real-stack identity verification, fresh step-up, idempotency, scheduling, diff, outbox and receiver. Queue/publish transition is blocked. Implement server transactional commands and synthetic bridge independently; never connect to Production without explicit permission. |
| 6 Security | **Partial, not assessed for release** | Restrictive RLS, no client grants, basic immutable evidence guards in local fixture; prior TRIGGER/TEMP issue locally reproduced without proving live exploit. Audit sink, server-side auth, key lifecycle, real-stack negative tests, concurrency, rate limiting and independent review remain. |
| 7 Performance | **Not measured for new backend** | UI browser tests run locally only; no backend or field/real-device INP/LCP/CLS measurement. Old reports under `docs/admin-preview/` concern previous UI. |
| 8 Testing | **Local checks only** | Commands below passed, including desktop/tablet/mobile viewport browser checks; hosted Auth/MFA/RLS, real Postgres concurrency, functional API/CRUD/publish, physical-device and independent security tests not executed. |
| 9 Deployment | **Not deployed** | Requires reviewed shared-project migration set, explicit security-change approval, verified identity, secure credentials and automated gates. See [deployment](MASTER_ADMIN_DEPLOYMENT.md). |

## Files in this checkpoint

- `admin-backend/migrations/001_admin_foundation.sql`, `002_workflow_integrity.sql`, `003_permission_catalog.sql`, `004_private_draft_commands.sql` and matching `admin-backend/rollback/` files: executable candidate DDL for isolated synthetic targets, no production apply.
- `admin-backend/server/identity.mjs`, `admin-backend/server/auth-flow.mjs`, `tests/admin-identity.mjs`, `tests/admin-auth-flow.mjs`, `tests/admin-private-commands.cjs`: provider and private command building blocks, no real resolver or endpoint.
- `src/admin/AdminApp.tsx` and `src/admin/backend.ts`: eight proposed role labels, no functionality enabled.
- `docs/admin-preview/current/{desktop,tablet,mobile}.png`: local Chromium screenshots, not physical devices or hosted verification.
- `tests/admin-isolated-foundation.cjs`, `tests/admin-isolated-workflow.cjs`, `tests/admin-isolated-permissions.cjs`, `admin-backend/domain/bio.mjs`, `tests/admin-bio-domain.mjs` and `package.json` test scripts.
- Nine `docs/MASTER_ADMIN_*.md` tracker and implementation records. Phase 3/4 uncommitted reviews and tests preserved.

## Executed checks

- `npm run test:admin-private-commands`: PASS local PGlite synthetic JWT fixture: permission/session checks, own-only keyset list, draft creation, stale conflict, review, success audit and audit-failure atomic rollback; does not establish real Auth, RLS or concurrent safety.
- `npm run test:admin-auth-flow`: PASS with mock provider and limiter for password/TOTP/logout building blocks; no real Auth or session store.
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
