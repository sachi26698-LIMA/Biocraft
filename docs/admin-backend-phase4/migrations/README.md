# Migration review package — NOT executable or approved

This folder intentionally contains **comment-only SQL specification files**, not deployable migrations. They describe the migrations that must be engineered for the recommended separate-database architecture. They are outside `supabase/migrations`; do not copy into an auto-run directory. A comment-only file does nothing if run and is not a security control. Full role setup, credential integration, SQL functions, provider adaptations, transactional tests and reviewed deployment/rollback scripts **do not yet exist**. Claiming earlier same-database SQL is a complete migration set would be unsafe.

| Order | Intended target | Specification | Critical dependencies |
|---|---|---|---|
| 000 | Any separately authorized target | [preflight specification](000-preflight.SPEC.sql) | Read-only credential, recorded target identity; production read queries require approval. |
| 100 | Isolated admin project | [private model and roles](100-admin-model.SPEC.sql) | Approved role/provider support, independent review and no client exposure. |
| 110 | Isolated admin project | [commands, sessions and outbox](110-admin-commands.SPEC.sql) | Verified server identity integration and audited implementations, not client-supplied identity. |
| 200 | Mock public target first; later exact public target by separate approval | [target receiver](200-public-receiver.SPEC.sql) | Provider least privilege and supported workload identity; current public consumers/rollback. |
| 900 | Each exact target, not an automatic rollback | [containment and restoration](900-containment.SPEC.sql) | Manual incident approval/authority, evidence retention and tested restore. |

Full previous SQL is retained for line-by-line review and linked individually in [SQL-REVIEW.md](../SQL-REVIEW.md); none of it is a dependency of or can be safely used as the new sequence. Previous same-DB FKs, auth helpers and public RPCs are specifically rejected. New executable SQL must be written after design approval, reviewed, validated on disposable real Postgres and isolated provider instances, and approved by filename/hash/target before any apply. Missing provider capabilities block release, not excuse a service-role shortcut.
