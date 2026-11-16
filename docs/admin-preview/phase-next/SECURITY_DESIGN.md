# Administrative security design — proposal only

Nothing in this document or the preview UI is an enforced privilege. No users, admin roles, sessions, endpoints, jobs or policies are deployed by this work. The exact existing project is shared with Production; no changes to it are authorized by UI approval. See `../../master-admin-blueprint/API_CONTRACTS.md`, `TEST_PLAN.md` and `MIGRATION_MANIFEST.md` for the detailed proposed wire contracts, abuse cases and incomplete migrations.

## Trust boundary and isolation recommendation

Use a separate, Preview-scoped administrative service/gateway that validates the user's provider-issued JWT (signature, issuer, audience, expiry) and handles only named, typed operations. It must fail closed without configuration. The server must check current enabled membership, permission and required MFA assurance in the same transactional authorization boundary as each read/write, including calls made directly through PostgREST or RPC. No browser role, hidden button, CORS header, route secrecy or noindex header authorizes anything. Service credentials remain server-only and must not be shipped to clients or stored in logs. Minimize use of bypass-capable service credentials; if unavoidable, enforce equivalent authorization with an independently reviewed narrow gateway and no direct bypass.

Before connecting such a service, agree a test environment with the owner: use local synthetic fixtures first, and consider a **branch of the existing Supabase project only if the plan supports it and the user explicitly approves**. A separate project, custom staging environment, entitlement upgrade or shared-project changes are not authorized. If isolation is unavailable, do not run privileged integration or mutations. Vercel Preview URL protection is useful defense-in-depth, not application authentication. Public guest reads and existing RLS must remain intact.

## Proposed permissions (not implemented)

| Capability | Super Admin | Admin | Editor | Moderator | Analyst |
|---|---|---|---|---|---|
| Own session and permitted dashboard | yes | yes | yes | yes | yes |
| Admin membership/roles, recovery, backup request | yes, step-up + last-super-admin protection | no | no | no | no |
| User directory/status | yes | yes, within scoped authority | no | narrowly scoped moderation only if authorized | no |
| Read content and create/submit draft | yes | yes | yes | review scope only | no |
| Review another author's submitted revision | yes | yes | only if separately granted | reject/flag only; cannot approve release | no |
| Publish independently approved revision | yes | yes | no | no | no |
| Audit events | yes | explicitly granted scope only | no | no | no |
| Approved aggregate analytics/export | yes | yes | no by default | no by default | yes, privacy-scoped |

This is a suggested least-privilege matrix, subject to review. The named-permission/route mapping and conflicts-of-interest details in `API_CONTRACTS.md` must be reconciled and approved before implementation. No one approves their own work, and publishing requires an independent approval, version/concurrency checks, step-up and a default-off server kill switch. No client-side control constitutes enforcement. Hard deletion is not a default permission.

## Sessions, API and audit requirements

- MFA enrollment, recovery and step-up must be provided by an approved identity provider; enforce verified assurance, not a self-asserted flag. Define session expiry, refresh rotation, inactivity, logout/revocation and credential recovery semantics; test actual provider behavior, including inability to instantly revoke an already issued JWT if applicable. Protect cookie-backed mutations with CSRF/origin checks, secure/HttpOnly/SameSite cookies; adopt CSP and XSS defenses. Never place bearer tokens in URLs or audit logs.
- List endpoints use bounded query/filter/sort allowlists, opaque validated cursor with unique tie-breaker, stable order and explicit snapshot/consistency semantics. Enforce per-user authorization before exposing counts or rows. Never claim exact stable snapshots without implementing them. Limit body and bulk sizes; use idempotency keys, optimistic concurrency and rate limits on mutations.
- Successful state changes and append-only audit records commit together. Denied events require a separately protected security sink because failed transactions roll back. Logs exclude secrets and sensitive payloads; access, retention, alerting, tamper resistance and privileged database-owner risks require explicit review. Audit reads are themselves monitored; no fake audit entries.
- Draft, submit, independent review, publish, rollback-as-new-draft and bulk jobs require real storage, row-level rules, validation, per-item outcomes and proper audit. Real analytics must disclose source, time period, freshness and unavailable states; exports need access checks and privacy/retention rules. Backups/restores must be verified through the actual provider, not merely requested.

## Pre-implementation gates

1. Approve isolation and threat model; inventory current schema, guest policies and migration versions without mutations. Review secret handling and provider configuration without disclosing values.
2. Review/complete schema, ownership, grants, function security, audit retention, role administration and rollback. Existing review-only drafts are incomplete and must not be applied as-is.
3. In approved isolated infrastructure, exercise anonymous/authenticated nonmember, every role, stale/revoked JWT, MFA, direct RPC/PostgREST, author/self-review, concurrent role demotion, cursor, idempotency and rollback tests described in `TEST_PLAN.md`.
4. Only after independent security and owner approval connect UI, provision test identities, then stage feature-by-feature release. Never infer permission to alter the shared project or Production from this document.
