# Security specification and threat model

## Permission matrix

S=Super Admin, A=Admin, E=Editor, M=Moderator, R=Analyst; columns are maximum proposed privileges, every request requires enabled membership and AAL2; scoped checks, MFA recency, separation and flags can further deny. All unspecified operations denied. Guest and ordinary authenticated nonmember have no access to any admin operation. R is retained from the earlier blueprint, not newly provisioned. Publishing is off for everyone now.

| Operation | S | A | E | M | R | Constraints |
|---|---|---|---|---|---|---|
| Own session and `/me` | ✓ | ✓ | ✓ | ✓ | ✓ | verified admin issuer, enabled account |
| Dashboard aggregates | ✓ | ✓ | ✓ | ✓ | ✓ | only authorized approved aggregate; no real source => unavailable |
| Staff directory | ✓ | ✓ | – | – | – | minimum fields, no credentials |
| Invite/disable, change role | ✓ | – | – | – | – | fresh step-up, two-person approval for S assignment, serialized last S, no self-elevation |
| Public user moderation | – | – | – | – | – | no source/scope approved; future design required |
| Read content and drafts | ✓ | ✓ | ✓ | ✓ | – | kind/object scope and minimum data |
| Create/edit/submit draft | ✓ | ✓ | ✓ | – | – | only own draft; allowlisted kind, expected version |
| Reject another's submission | ✓ | ✓ | – | ✓ | – | reason and audit; cannot review own |
| Approve another's submission | ✓ | ✓ | – | – | – | cannot approve own; approved digest immutable |
| Publish/rollback via new revision | ✓ | ✓ | – | – | – | cannot publish own revision; fresh step-up, independently reviewed, target/flags/bridge |
| Read approved analytics/export | ✓ | ✓ | – | – | ✓ | disabled until data source/privacy approval, exports independently gated |
| Audit read | ✓ | – | – | – | – | least detail, logged; separate independent sink custodians |
| System health | ✓ | ✓ | – | – | – | redacted |
| Config draft/review/release | ✓ | – | – | – | – | separate reviewer S; allowlist + step-up + receiver where applicable |
| Disable/incident stop | ✓ | – | – | – | – | operator can also disable out of band; re-enable requires separate approval |
| Backup request | ✓ | – | – | – | – | adapter/owner approval required; restore is not a routine admin API |
| Hard delete, arbitrary SQL/provider config, secrets | – | – | – | – | – | separate legal/operational process only |

## Authentication and API boundary

Separate production admin Auth issuer; no guest Auth relationship implies admin membership. Gateway accepts only provider-verified signatures with algorithm allowlist and key rotation, exact issuer/audience, expiry/nbf, UUID subject/session, and rejects anonymous or wrong environment. Never trust user-editable metadata, browser roles, an unverified JWT or proxy-provided identity. Prefer BFF opaque, random, HttpOnly Secure SameSite=Strict session cookie scoped to admin host; Auth refresh credentials remain encrypted server-side, never in browser/localStorage/logs. CSRF tokens plus exact Origin checks on mutations, no permissive CORS, no redirects to attacker origins, request size/rate limits, CSP and output encoding. Verify session binding, enabled membership and named operation inside every transaction; locking membership and session prevents a disable committing while a mutation is in progress. Expiry/logout/revocation removes server-side session immediately; provider JWTs can remain valid until expiration, so never use token expiry alone as revocation. A concurrent disable waits for an already-running transaction; containment must account for in-flight work.

Use AAL2 for all admin operations. For privilege changes, approval, publish, secret-sensitive system operations and recovery require provider-verified MFA step-up within 10 minutes, tied to same subject + session and server-side single-use challenge; five-minute idle and eight-hour absolute admin session maximum are proposed defaults, subject to operator approval and provider feasibility. `aal2` and token `iat` do **not** prove recent MFA. JWT `amr` and `session_id` are documented but exact MFA method/timestamp, refresh semantics and server-validated proof must be verified with the chosen provider configuration; reject missing/ambiguous/future/stale evidence and keep sensitive endpoints disabled if not provable. See [JWT claims](https://supabase.com/docs/guides/auth/jwt-fields). Factor recovery requires a separate identity-proofing/two-person process; do not promise provider recovery codes without checking actual enabled capability.

API baseline `/api/admin/v1`: named endpoints for `/me`, `/members`, `/documents`, `/revisions/{id}/submit|review|publish`, `/releases/{id}`, `/analytics`, `/audit`, `/system/health`; explicit implementation contracts in earlier [API blueprint](../master-admin-blueprint/API_CONTRACTS.md) are subordinate to this matrix. Reject unsupported endpoints. JSON allowlists, max 256 KiB, UUID idempotency key scoped to actor+operation+target, canonical request digest; reserve and persist mutation/result/audit together, 409 on same key with different digest or stale `If-Match`. Key retention and response-redaction policy must be set before enablement. 401 unauthenticated, 403 forbidden, 404 masked resources, 409 conflict, 422 invalid, 429 rate limit, 503 disabled/unavailable; return correlation ID and no secrets. Cursor pagination is stable and bounded, not a snapshot claim. Webhook worker endpoints are not browser endpoints.

## Database access and keys

Private schema is not Data API exposed; revoke PUBLIC/anon/authenticated access to tables, sequences, functions and schema; RLS enabled with no guest policy and restrictive denial as defense in depth, not a substitute for grants. Non-login object-owner and isolated narrowly granted executors are distinct, no membership path to superuser/BYPASSRLS, no client schema CREATE; SQL SECURITY DEFINER functions only where indispensable, fixed `pg_catalog` search_path plus qualified names, no uncontrolled dynamic SQL, no PUBLIC execute, no caller-controlled identity settings. RLS owners bypass unless FORCE; superuser/BYPASS always bypass. The gateway is a trusted security boundary, not a client; dedicated executor receives only named command EXECUTE and cannot impersonate arbitrary users through client-provided claims. A defensible provider-supported authenticated context design is a mandatory implementation gate; do not fake `auth.uid()` via arbitrary session GUC, or assume a service-role call proves the actor. Test owner, inherited/effective/default/column privileges, Data API exposure and actual login role separately.

Use separate environment-scoped secret storage and identities with narrowly bounded target capabilities. No secret in Vite variables, bundle, repository, logs, HTTP responses or chat; publishable keys are not authorization. Service-role and owner credentials bypass RLS and may be required for provider administration only, held by designated operators, not general gateway/worker. Confirm provider supports least-privilege execution/credential lifecycle; if not, do not deploy. Key rotation, access audit, egress restrictions, short lifetimes, emergency revocation and incident drills are required. Never claim a proprietary secret manager, mTLS, or IAM capability is configured today.

## Audit, privacy and threats

For every successful mutation, append immutable structured event in the same transaction: time, request/operation ID, target+environment, actor and role version, action, prior/new revision hashes, result and approval references; avoid content, tokens and sensitive PII. Local triggers/owner permissions deter ordinary mutation but owners can bypass them; export via durable outbox to independent append-only/retention-controlled sink, verify delivery/lag, alert and reconcile. Log denials, failed authentication and target bridge failures outside rolled-back transactions. Audit readers cannot edit/delete events; retention and redaction need policy/owner approval. Hashes alone do not prove integrity against an attacker controlling both data and hash.

| Threat | Main control | Residual/release gate |
|---|---|---|
| Forged/replayed JWT, stolen session | issuer/audience/signature, session registry, MFA + step-up, CSRF; bounded sessions | Verify real provider, active revocation and recovery semantics. |
| Malicious editor/self-review | transaction-scoped matrix, independent approver and publisher, immutable digest | Collusion and compromised S remain; independent audit. |
| Preview credential or command reaches prod | separate Auth, environment-bound identities/keys, target allowlist, no prod secrets/route | Verify deployment and network in real stack. |
| Guest role arbitrary SQL + TRIGGER/TEMP | Remove unnecessary grants only after independently approved impact analysis; restrict SQL exposure and verify all definer paths | Local reproduction is not proof of live SQL path or exploit; existing grants remain unchanged. |
| Compromised publisher | receiver limits resources/actions, target-side CAS and switch, independent auth and alert | Narrow capability can still perform authorized-looking harmful writes; approval and monitoring matter. |
| Definer/role escalation | isolated non-bypass owners, strict grants/search path, test inheritance/defaults and exposed endpoints | Provider operator can bypass; independently review. |
| Lost/replayed release messages | transactional target receipt/digest, idempotency, reconciliation | Cross-store atomicity impossible; investigate ambiguous outcomes. |
| Archive reappears | fail-safe consumer/build/tombstone strategy and old-client accounting | Offline/cached copies cannot be fully recalled. |
| Audit tamper, PII leakage, backup exposure | independent sink, restrictive retention/access, encrypted backup, minimize data | owner/sink compromise and unapproved retention; test restoration. |
| Denial of service, stale data, abused metrics | rate/size/queue caps, timeouts, backpressure, source/privacy thresholds | provider outages or differencing attacks need operational review. |
