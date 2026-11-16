# Master Admin verification plan — proposed, not executed

All integration tests require an explicitly authorized, fully isolated backend, synthetic accounts and fixtures. Never run these mutations against the shared project. The current PGlite tests cover only limited schema/prototype behavior; no endpoint or UI listed here is implemented yet. Interpret expected HTTP codes using `API_CONTRACTS.md`.

## Identity and authorization

| ID | Setup / action | Expected |
| --- | --- | --- |
| SEC-01 | Call every route and exposed RPC as anonymous, no token, expired token, wrong issuer/audience, invalid signature | 401/403; no data or writes; no credential in response/log |
| SEC-02 | Valid ordinary authenticated account, no membership, `aal2`; invoke every method and direct RPC | denied; content and audit mutation counts unchanged |
| SEC-03 | Enabled roles S/A/E/M/Analyst each request every capability | enforce permissions matrix including denied operations and no direct table privileges |
| SEC-04 | Enabled member with `aal1`, absent `aal`, revoked/disabled membership and old role claim | denied per database state; stale claimed role cannot escalate |
| SEC-05 | Author submits, attempts own review/publish; moderator attempts approval or publish | forbidden; original revision and public row unchanged |
| SEC-06 | Concurrently demote/disable final super admins; repeated session revocations | at least one enabled S remains; race serialized; authenticated sessions follow documented revocation behavior |
| SEC-07 | Tampered, expired, reused cursor; oversized body; unknown SQL identifiers/JSON keys, duplicate idempotency key with different request | safe 400/409, no privilege bypass; no DB details leaked |
| SEC-08 | Bypass gateway and call every PostgREST RPC/table directly; spoof Origin, role fields and client metadata | same or stricter authorization; CORS and frontend controls are never trusted |
| SEC-09 | Unauthorized attempts and successful mutation; attempt delete/update/truncate audit records as clients and admins | denied attempts in separate approved security source; successful audit committed atomically; no secrets/PII; mutation denied; privileged DB owner tampering caveat documented |
| SEC-10 | Expired/no step-up for sensitive operations; token replay/logout; CSRF/XSS/CSP tests | deny sensitive request; safe session handling; no claim of immediate JWT invalidation unless verified |

## Content, workflow and release

| ID | Setup / action | Expected |
| --- | --- | --- |
| CW-01 | Create bio draft without publishing, list as admin and guest | draft visible only to authorized admin; guest result unchanged |
| CW-02 | EN, HI, HG payloads with blank, malformed, combining marks, styled Unicode and emoji; independently exercise all 8 platforms and LinkedIn headline | valid results meet each documented limit/counting unit; invalid rejected with field errors; no auto translation |
| CW-03 | Exact/normalized duplicate and concurrent insert in same collection, idempotency-key replay | appropriate duplicate warning/error; no duplicate publication, audit or counter; distinct content preserved |
| CW-04 | Draft based on revision A, concurrent publish B then approve/publish A | 409 conflict, no partial writes/audit; rebase via new revision |
| CW-05 | Author submits, non-author reviewer approves, permitted publisher publishes, switch disabled then enabled in isolated fixture only | disabled request fails; enabled request changes only allowed target fields and records actor/reviewer, prior/new revision and audit atomically |
| CW-06 | Cause public uniqueness constraint, audit insert, version comparison or resource validation to fail | whole transaction rolls back; no misleading publication record |
| CW-07 | Archive bio, fetch as anon/auth; simulate network error to collection | absent from live guest results; documented bundled fallback may be stale and is visibly identified |
| CW-08 | Select historical revision for rollback and attempt immediate publish | creates draft only; independent approval and base check required; previous state restored only after authorized publish |
| CW-09 | Bulk >100, mixed valid/invalid rows, malformed UTF-8, CSV formulas and retries | rejected/bounded by contract, safe preview/per-item outcome; CSV output cannot execute formulas; no unapproved publication |
| CW-10 | Rename category slug, change order, archive referenced category | conflict/redirect policy enforced; no cascade deletion; route/SEO snapshots unchanged unless approved release completes |
| CW-11 | Modify each platform/generator/library configuration and load public tool | only explicitly integrated, approved version used; all eight platforms retain independent limits and supported language/tool mappings |
| CW-12 | Inject HTML/script into page or metadata; fail build/CDN activation during SEO release | sanitized/rejected; no XSS; previous static HTML remains authoritative until verified successful release |

## Analytics, operations and UX

| ID | Setup / action | Expected |
| --- | --- | --- |
| AN-01 | Telemetry disabled / consent withheld; generate and search with personal text | no capture; no generated content, raw search or IP in logs/rollups |
| AN-02 | Approved events over known day/week/month boundaries, small cells and absent sources | correct labeled timezone/bucket/sample counts; suppression and unavailable are distinct from zero |
| AN-03 | Export as permitted role; unauthorized role, formula text and expired download | permitted sanitized report only, auditable scoped short-lived download, denied unauthorized/expired |
| AN-04 | Field data absent; load dashboard | unavailable, no invented p75 or claimed real-time data; lab metrics labeled |
| OP-01 | Revoke gateway/access and switch off publishing, then call direct RPC | all privileged mutation paths denied; guest read stays intact |
| OP-02 | Restore independently authorized isolated backup to clean environment | compare contents/schema/policies, run smoke tests; independently verify restore result |
| OP-03 | Service offline, cache stale, timeout, missing metrics | accessible failure/retry, no secret/error body leakage; no broken guest site or fabricated healthy state |
| UX-01 | 390, 768, 1440 px, keyboard, screen reader, contrast, dark mode and reduced motion | no clipping, proper focus/dialog return, accessible names and error announcements, WCAG contrast |
| PERF-01 | Realistic 100k-row synthetic fixtures; measure query plans, pagination latency, request counts, admin bundle, interaction long tasks | report timings and plan evidence, no unbounded fetch; compare agreed budgets |
| PERF-02 | Repeat on real Android plus field RUM after privacy approval | distinguish lab vs field; do not claim INP/LCP/CLS targets achieved without measured p75 samples |

## Locally runnable now

- `npm run test:admin-blueprint`: seven proposed foundation tables/policies, default-off switches, denied client reads, representative guest RLS, select constraints, append guards and destructive rollback in a temporary PGlite fixture.
- `npm run test:admin-draft`: older bio-only prototype and mocked gateway tests. It is a separate design, not the blueprint implementation.
- `npm run typecheck`, `npm run test:collections`, `npm run test:diagnostics`: current frontend regression checks, not full security or all tools/languages/device tests.
