# Master Admin — persistent execution tracker

## Current checkpoint — local implementation, not release ready

Latest pushed Preview is commit `98960fb`, Vercel deployment `dpl_GyXSySRAM7gNupQ1kW6A6FreXEL3` READY at `https://biocraft-p5y96wpul-sachi26698-6758s-projects.vercel.app/admin`. The subsequent code in this working tree is **not mounted, configured or deployed**; hosted interactions have not been independently verified. The Preview is a UI scratchpad, not functional Admin. No shared DB, grants, credentials, accounts or real content were changed by this local checkpoint. Existing shared project `jvpadtzfsuekixrquzjv` is the sole target; any shared security migration needs exact SQL, impact, rollback and prior explicit approval.

| Phase | Status | Actual scope and remaining work |
|---|---|---|
| Shared boundary | Owner decision recorded | Existing shared project only; public site and Admin share Production-connected data and risk. No new project. |
| Database | Partial, synthetic only | Candidate migrations 001–007 and rollbacks are local only and unapproved. Private draft/session, encrypted login handoff, rate-limit and staff routines have no live client or server grants. PGlite cannot validate real PostgreSQL concurrency, effective grants, provider-owned `auth.sessions` semantics or ownership. |
| Auth/RBAC | Partial, unmounted | Password→TOTP→encrypted cookie→session→private draft flow composed against mocked Auth/PGlite. CSRF retrieval now rechecks provider identity and live Admin session. SQL role-checks and RLS are defense in depth, not a privilege audit; SQL-capable callers can spoof JWT GUCs. Bootstrap, real provider integration, verified trusted proxy client-key extraction, distributed ingress protection, key rotation, MFA freshness, recovery, session refresh and security review remain. |
| Modules | Partial, local commands | Private draft creation/list/submit/review and staff listing/update candidate exist; staff update is not exposed via API, super-admin promotion disabled. No durable Admin UI or usable hosted APIs. Other requested modules are not implemented. |
| Workflow | Partial, publishing disabled | Mock-only draft reviews and atomic success audit; no idempotency, actual content publishing, version rollback, outbox/receiver or public-content writes. |
| Security | Not release assessed | Candidate storage has encrypted one-time handoffs and per-network/account/factor rate buckets, but no cleanup job, operational limits, real concurrency or security review. Login flow revokes local SDK state only on some failure paths; provider revocation semantics need testing. No production secrets or unreviewed grants used. |
| Testing | Local only | Synthetic end-to-end and staff tests plus local regression suite pass; no real Supabase Auth, real Postgres, concurrency, hosted browser, physical-device or independent security testing. |
| Performance | Local UI emulation only | Prior single scripted Android-emulated LCP 488 ms, CLS 0.00014 and long tasks up to 245 ms; not field data or backend measurement. No zero-lag claim. |
| Deployment | Preview UI only | No backend deployment; READY alone is not hosted interaction verification. Approval, reviewed owner/grants, real-stack verification and safe configuration are required. |

### Security review blockers specific to latest candidates

- 004–007 are drafts, not a migration proposal for execution: provider session visibility, forged SQL session GUCs, definer ownership and all effective grants/default privileges need real-Postgres review. The limited-role guard is not exhaustive. Staff role edits need all other membership writers to share locking, real concurrent demotion/last-super tests, audited bootstrap and fresh step-up. Staff promotion intentionally fails closed.
- `auth-storage.mjs` requires separate injected encryption/HMAC keys, trusted request identity, retention cleanup, atomic behavior validation and bounded table growth. PGlite test verifies encrypted values and single-use sequential take, not parallel behavior. Error and denied-login audit/abuse controls are incomplete. Direct DB TLS connectivity has not been tested.
- Cookie/session is 15 minutes maximum, no refresh; provider logout happens after Admin revocation, and failure is reported while the cookie is cleared. Recovery, factor enrollment, credential rotation, pending handoff cancellation/revocation, and provider auth-session expiry behavior remain unimplemented or unverified. No Admin authentication should be enabled until independently reviewed.
- No public publish API exists. Bundled fallback can resurrect remotely archived bios and bundled registries/SEO require their own reviewed release strategy.

## Files in this checkpoint

- `admin-backend/migrations/001`–`007` and matching `admin-backend/rollback/` files: candidate DDL for synthetic targets only, no shared apply.
- `admin-backend/server/{identity,auth-flow,api,database,auth-controller,auth-storage,provider-logout,session-cookie}.mjs`: unmounted server-side candidates. Tests include synthetic complete flow and staff commands; no hosted endpoint or real Auth.
- `src/admin/AdminApp.tsx` and `src/admin/backend.ts`: eight proposed role labels, no functionality enabled.
- `docs/admin-preview/current/{desktop,tablet,mobile}.png`: local Chromium screenshots, not physical devices or hosted verification.
- `tests/admin-isolated-foundation.cjs`, `tests/admin-isolated-workflow.cjs`, `tests/admin-isolated-permissions.cjs`, `admin-backend/domain/bio.mjs`, `tests/admin-bio-domain.mjs` and `package.json` test scripts.
- Nine `docs/MASTER_ADMIN_*.md` tracker and implementation records. Phase 3/4 uncommitted reviews and tests preserved.

## Executed checks

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
