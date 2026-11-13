# Admin migration manifest — review only

**No migration is approved, applied, or ready for production.** Never run these files against the shared project. The newer `bc_admin` proposals are independent of the earlier `biocraft_control` prototype; do not apply both without a reviewed consolidation plan.

| Order | Artifact | Scope | Status / rollback |
| --- | --- | --- | --- |
| 001 | `001-private-foundation.REVIEW.sql` | Seven private tables, RLS default denial, audit mutation guards, disabled publish/telemetry switches | Local PGlite test only; destructive removal in `099-schema-removal.REVIEW.sql` deletes evidence and requires separate permission |
| 002 | `002-authorization.REVIEW.sql` | Internal role/permission allowlist and AAL2 + locked-membership guard; no API grants or account creation | Local fixture test only; `098-remove-authorization.REVIEW.sql` removes helpers, subject to dependency review |
| 003 | **Not written** | Least-privilege function ownership, direct API grants, scope-aware identity and session recency | Requires actual isolated Supabase configuration and security review |
| 004 | **Not written** | Idempotency, safely bounded resource adapters and CRUD/listing | Must include resource-specific validation, guest preservation, audit and rollback tests |
| 005 | **Not written** | Review/approval/publication and rollback-as-revision | Must fully validate all bio fields/platform limits, locking and two-person policy; no shared content writes approved |
| 006 | **Not written** | User/role administration, last-super-admin lock, secure session controls | Requires approved Auth model, real provider integration and independent review |
| 007 | **Not written** | Privacy-approved telemetry, rollups and export | Requires consent, retention, re-identification and collection decisions |
| 008 | **Not written** | Content/SEO/settings and public integrations | Requires specific release/build model and verified public consumers |

The missing files are not represented by empty or unsafe placeholder SQL. Exact SQL and rollback for them are blockers to a complete implementation, not permission to apply 001/002. Before any isolated apply obtain explicit approval of its exact file and target. Every migration targeting a shared database affects Production infrastructure regardless of the branch; current instructions forbid it. Recheck object collisions, Supabase defaults, owners and actual permissions at time of review. Preserve guest policies, retain audit evidence, test restoration separately and never use CASCADE blindly.
