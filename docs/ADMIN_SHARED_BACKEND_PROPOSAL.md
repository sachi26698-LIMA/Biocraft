# BioCraft Master Admin — shared-backend proposal for review

**Status: design proposal only. No changes to the shared project are authorized by selecting this review.** No admin panel, login, provisioning, audit log, draft workflow or content-write capability is deployed. This document does not authorize a migration, a project configuration change, or any content publication. The initial SQL in `admin-drafts/001-readonly-rbac.sql` is a locally tested *draft*, not a deployment-ready migration.

## 1. Boundary and consequence

The Vercel Preview frontend and other clients connect to the same Supabase project, `jvpadtzfsuekixrquzjv`. An admin schema, public RPC, Auth account, permission change, or content update in that project is shared infrastructure. **A Preview-only frontend does not make its backend Preview-only.** Any published content update can become visible to other consumers immediately. Restricting a UI route or checking the `Origin` header is not a security or isolation boundary; a permitted account can call the backend outside the Preview UI.

This proposal keeps the public guest site unchanged until separate approval to integrate and publish specific features. It uses no new project, database clone, custom Vercel environment, production environment-variable change, or subscription change. Its trade-off is that shared backend infrastructure cannot satisfy absolute Preview backend isolation. A future go-ahead must explicitly accept that exception; approving architecture review alone does not do so.

## 2. Verified baseline

Read-only database inspection found ten existing public content tables, all with RLS enabled and `FORCE ROW LEVEL SECURITY` disabled. All are owned by `postgres`. `anon` and `authenticated` have SELECT; `authenticated` lacks INSERT, UPDATE and DELETE on all ten. The existing policies expose active records to guest and authenticated users. PostgreSQL table owners and privileged roles can bypass ordinary RLS, so definer functions must be reviewed especially carefully. There are no existing functions named `bc_admin_context` or `bc_admin_dashboard` and no functions in `biocraft_admin_private` at the time of inspection; this does not guarantee absence of every conflicting object. No deployed Edge Functions or database branches were found in the earlier inspection.

Bio collections have a remote Supabase read path, but platform limits, tools, generator data, Unicode libraries, much content and static SEO are bundled. Rows in corresponding tables are not proof that the public implementation consumes them. `docs/ADMIN_FOUNDATION.md` records these dependencies and the current local test limits.

## 3. Proposed incremental changes, each subject to separate approval

### A. Read-only identity and counts foundation

Propose a minimal private membership record keyed to an existing trusted Supabase Auth user and holding enabled status and one of four roles. A non-exposed private schema has no direct privileges for `anon` or `authenticated`. A narrowly scoped database RPC would re-read membership for every call and return only the role; another would return aggregate content counts. No content writes, guest-policy modifications, membership creation UI, or auto-bootstrap in this phase. The available draft shows the exact initial SQL shape and names; **do not apply it as-is**. Before requesting permission to apply a final version, review whether its function owner can be constrained instead of inheriting `postgres`'s bypass privileges; inspect actual grants/default privileges, exposed schemas, function-name collisions, and Supabase/PostgREST behavior. Counts of inactive records require carefully scoped elevated access and must not be exposed to nonmembers.

The four roles in this foundation all have identical read-only count access; differentiating their capabilities is later work. A trusted authenticated account still receives no access until a separately approved membership assignment. Guests or ordinary Auth users never get membership automatically. Account onboarding requires verified identity and a documented secure owner-controlled process; no password, token or service key is requested in chat. Auth configuration, MFA availability and existing providers must be inspected before deciding how login and recovery will work. A browser session is not an authorization decision. Session expiry/logout and disabling membership must be tested separately against real Auth; a disabled membership should deny the next privileged database request even if a JWT remains valid.

**Effect if this phase were eventually applied:** adds one private schema and one private table, one private helper and two publicly exposed RPCs; changes no existing content tables, their guest policies, or rows. It still changes the shared database and its API surface. Risks include incorrectly configured function ownership, role grants, leaked inactive aggregates, cost of count queries, unaudited membership provisioning and access attempts, and cross-environment availability of RPCs. Do not call the foundation a complete or audited admin system.

### B. Audit, roles and drafts

Design a narrowly scoped operation-permission matrix and implement it server-side for each RPC, not in frontend navigation. Proposed baseline:

| Role | Read | Draft editing | Review / publish | Manage roles |
| --- | --- | --- | --- | --- |
| Analyst | permitted aggregate/reporting data | no | no | no |
| Editor | permitted admin content | yes, within assigned scope | no | no |
| Admin | permitted admin content | yes | yes, subject to approval policy | no |
| Super Admin | permitted admin content and protected audit | yes | yes, subject to approval policy | yes |

This is a proposal, not implemented policy. Exact permissions, self-approval rules and account scoping need agreement. A draft store separated from public content avoids making draft edits visible to guest clients; each draft should reference its target, author, revision and validation state, with optimistic concurrency. Store only necessary data and avoid unnecessary duplicated public datasets. Publishing requires a distinct server-authorized transaction with validation, audit entry and explicit confirmation. Under the current shared database architecture **publishing is a production-impacting content write**, even if initiated from Preview; it requires separate permission for the exact scope. Until then publish must be disabled server-side, not merely hidden.

Append-only audit records should be written transactionally with every privileged change and protected from ordinary admin alteration. Include actor ID, operation, target, timestamp, outcome and bounded change details while excluding passwords, tokens, secret keys and unnecessary personal data. Read access should be restricted and tested. Database owner/service roles can change database-resident logs; therefore don't claim absolute immutability. If tamper-evidence or retention beyond privileged database control is required, specify and approve an independent protected export or provider audit mechanism after verifying availability. Failed authentication attempts and privileged changes also require a realistic logging design without storing secrets.

### C. Content integrations

Implement and test one module at a time against real public read paths, with no silent production publication. Bio management needs permission-checked search/keyset pagination, validation per platform and language, duplicate handling, bounded imports/bulk actions, export and concurrent edit protection. Guest `bios` reads only active records; its bundled fallback can show old content on network failure. A draft cannot be advertised as publicly propagated until the actual public path is integrated and tested.

Platform/tool/library/generator/SEO/appearance settings are presently bundled: first define a versioned, validated configuration and explicit public consumers, including failure/fallback semantics and the existing per-platform limits. Ensure each tool continues to work for its actual supported platforms and languages; LinkedIn currently identifies its output as English-only. Avoid treating templates as an AI provider or claiming auto-translation. SEO changes must account for build-time HTML and indexing, not merely database records. Any public integration or publication has to be independently approved because it affects guest behavior and potentially Production data.

Usage/error analytics must be opt-in or otherwise grounded in an agreed privacy and retention policy. Record only necessary aggregate data, avoid visitor identifiers and content by default, and label missing data as unavailable. Lab results and actual field metrics must remain distinct. No field telemetry, backup capability or restoration guarantee should be claimed until the chosen provider configuration is verified and restoration tested.

## 4. Controls and testing gates before any shared migration

1. Produce the final exact migration and rollback/containment scripts as reviewable artifacts; enumerate every object and grant. Confirm a backup/restore path with the project owner, including what it covers and when it was last tested; don't assume a paid feature or create a backup elsewhere without permission.
2. Inspect actual Auth configuration without exposing secrets; decide onboarding, MFA, session expiration, recovery and trusted initial Super Admin assignment. Any Auth setting change or membership insertion requires its own explicit approval.
3. Execute full migration tests against a representative isolated local Supabase/Postgres environment, including existing policies/grants, PostgREST JWT validation, direct API access, all four roles, guest and unrelated Auth users, disabled/revoked accounts, race conditions and security-definer search paths. The PGlite fixture is a useful check, **not** that integration test.
4. Independently review privileged function ownership, grants, error handling, injection resistance, audit tampering, operational access and the publish boundary. Verify the migration is transactional and no content/policy changes are hidden inside it.
5. Obtain explicit approval for the exact proposed migration and its shared scope. Applying schema infrastructure does not authorize provisioning accounts, content writes, turning on analytics, Production env changes, deployments or merging main.
6. After any approved apply, verify grants, policies, membership denial, guest reads and audit behavior using non-destructive checks. Recheck hosted guest HTTP from an actual browser; the prior sandbox connectivity was not established. Do not create test content or identities in the shared project without specific approval.

## 5. Incident containment and rollback

For a suspected admin vulnerability, stop using the interface and have an authorized operator revoke execute on affected new RPCs and/or disable affected memberships; coordinate with the project owner before any database action. Containment SQL itself changes shared permissions and is not pre-authorized here. Disablement can block subsequent privileged RPC requests but does not by itself revoke an already issued JWT. Verify the guest site independently; do not roll back or alter its pre-existing policies as a shortcut.

A complete rollback needs dependency analysis, backup/retention decisions for membership, draft and audit data, and a separately reviewed script. Dropping new tables can destroy security history and drafts and therefore needs explicit approval; restoring existing public content also needs approval. Shared infrastructure cannot be made Preview-only by rollback of a Vercel deployment. Production deployment and main merge remain outside scope without personal approval.

## 6. Current evidence

`npm run test:admin-draft` passed locally against an ephemeral PGlite fixture: no-session, anon, ordinary authenticated, disabled-user denial, all four roles' read-only aggregate access, direct write denial and a representative guest RLS policy. `npm run typecheck`, `npm run test:collections`, and `npm run test:diagnostics` passed. The fixture does not prove real Supabase Auth/PostgREST connectivity, actual RLS behavior under deployment roles, a security audit, responsive UI, or production safety. The requested admin screenshots, Preview URL, full feature implementation and end-to-end reports do not yet exist.
