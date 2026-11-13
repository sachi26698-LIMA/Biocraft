# Phase 4 — architecture validation and secure backend readiness

**Decision package, not authorization or deployment readiness.** No Phase 4 migration has been applied, infrastructure provisioned, account created, secret fetched, content published, or Production changed. The only runtime addition is a disposable local security experiment. The admin Preview remains a browser-only mock/scratchpad, not authentication, an admin API, or a durable backend. The user saw an earlier Preview load on Android; that is not hosted security validation.

## Recommendation and precedence

Recommend a **separate production Supabase project for the admin control plane**, with its own Auth, database, credentials and backup; a separate synthetic non-production environment; and a separately approved, narrowly authorized receiver on the existing public production target. Publish remains OFF until the public-consumer and receiver gates are independently met. This supersedes Phase 3's preference for an existing-project branch as the main test path and its unresolved production topology. A separate project does not isolate the public target from a compromised publisher. Do not create a project, branch, role, credential, migration or account without separate explicit approval.

Read in order:
1. [Architecture, release protocol, roadmap and costs](ARCHITECTURE.md)
2. [Security specification, role matrix and threat model](SECURITY.md)
3. [Complete Phase 3 and historical SQL review](SQL-REVIEW.md)
4. [Verification and incident/rollback plan](TEST-AND-RECOVERY.md)
5. [Migration package and inventory](migrations/README.md): prior actual SQL is linked, and precise new migration specifications are supplied **as non-executable design files**, not a misleading deployment-ready migration set.

The new design requires significant unimplemented SQL and code, provider capability verification, independent review and separate approvals. Where the host's supported identity, database roles, or backups cannot be established by metadata-only inspection, the design fails closed rather than inventing a capability. Actual prices, legal retention, owner identities, RPO/RTO and production target changes need owner decisions. SQL drafts in earlier phases are historical and superseded, not authorized by this document.

## Immediate decision requested

Approve or reject the proposed topology and phased design only. Approval here would **not** authorize provision, credentials, schema/grant changes, bootstrap, merging, deployment, publishing, or production access; each needs the specific later gate in the roadmap. No action is taken until explicitly authorized.
