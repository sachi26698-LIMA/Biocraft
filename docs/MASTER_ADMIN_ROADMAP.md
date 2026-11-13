# Master Admin execution roadmap

Status and resume point: [MASTER_ADMIN_PROGRESS.md](MASTER_ADMIN_PROGRESS.md). Follow the current [shared-project decision](MASTER_ADMIN_SHARED_PROJECT.md); the Phase 4 separate-project topology is superseded. In particular, no Production mutation, no paid provisioning, no production bridge, and no unreviewed privileged API. New roles requested by the owner supersede the earlier five-role proposal, and are included in a locally tested permission catalog; no user roles or effective permissions have been assigned.

- [x] Inspect current branch, isolation proposal, current UI/API boundary, migration history and connected project inventory.
- [x] Local executable isolated schema candidate with requested 15 normalized table names, restrictive client denial and local tests; **not provider-deployed or security-approved**.
- [x] Local workflow integrity guard candidate, tests and synthetic rollback; publication transitions explicitly disabled.
- [x] Candidate eight-role permission catalog and local representative allow/deny tests; not an authorization server.
- [ ] Complete provider-specific security/ownership review and least-privilege authenticated command design; last-S concurrency and real authorization remain open.
- [ ] Complete target-specific shared-project migration review and approval; use local synthetic tests, no new project.
- [ ] Real Auth, MFA, sessions, user recovery, server RBAC, transactional audit and security tests.
- [ ] Connect overview, staff, bios, categories, collections, platforms, generators, SEO, analytics, security and settings to real shared-project backend.
- [ ] Complete validated versioning, review, scheduling, synthetic receiver, idempotency, conflict and rollback; no connection to production without separate approval.
- [ ] Hosted functional, accessibility, privacy, security, performance and disaster recovery tests with real evidence.
- [ ] Authorized Preview deployment; Production deployment/bridge/content require distinct explicit approvals.

Keep independent tasks moving even if infrastructure is blocked; don't equate schema or local integrity checks with working authenticated functionality.
