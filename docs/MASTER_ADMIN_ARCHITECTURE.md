# Master Admin architecture

The owner has chosen the existing shared Supabase project `jvpadtzfsuekixrquzjv` only. See [current boundary and review](MASTER_ADMIN_SHARED_PROJECT.md), which supersedes the separate-project recommendation in the historical Phase 4 architecture. `/admin` is currently a Preview UI, not an authenticated application. The proposed private schema separates names and grants, **not** Auth, database, operational risk or backups from Production. A Preview connected to it can affect Production. Shared security migrations and real publication require exact review and explicit approval.

```mermaid
erDiagram
 AUTH_USERS ||--o| ADMIN_USERS : identity
 ADMIN_USERS ||--o{ ADMIN_USER_ROLES : membership
 ADMIN_ROLES ||--o{ ADMIN_USER_ROLES : assigned
 ADMIN_ROLES ||--o{ ADMIN_ROLE_PERMISSIONS : grants
 ADMIN_PERMISSIONS ||--o{ ADMIN_ROLE_PERMISSIONS : included
 ADMIN_USERS ||--o{ ADMIN_SESSIONS : has
 ADMIN_USERS ||--o{ ADMIN_CONTENT_VERSIONS : creates
 ADMIN_CONTENT_VERSIONS ||--o| ADMIN_DRAFTS : snapshot
 ADMIN_DRAFTS ||--o{ ADMIN_APPROVALS : reviewed
 ADMIN_DRAFTS ||--o{ ADMIN_PUBLICATION_JOBS : queued
 ADMIN_USERS ||--o{ ADMIN_NOTIFICATIONS : receives
 ADMIN_USERS ||--o{ ADMIN_AUDIT_LOGS : actor
```

This diagram describes candidate tables only; target mapping, durable outbox, receipt, idempotency and a live session resolver and production-integrated verified identity are not implemented. No production publication connection exists.
