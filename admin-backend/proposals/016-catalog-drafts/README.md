# Optional private catalogue drafts — not installed on shared Supabase

Own draft metadata only: create, list (UUID keyset), edit at the expected version, and archive. An archive is not a hard delete. No publisher, licence verification, Auth mutation, public table writer, registry editor or new role permission. The declared source/licence are editorial inputs, not proof of redistribution rights. Bio publication continues to use its independent approval workflow. This store is not a substitute for that workflow.

Review `apply.sql` under the dedicated private-schema owner, then the two signatures in `grant.sql`. No automatic installer. `ADMIN_CATALOG_DRAFTS_ENABLED=true` is separate from the shared-write gate and the existing AAL2/CSRF/fresh-TOTP/row ownership checks. The SQL checks `seo.draft` for SEO and `content.draft` elsewhere. No staff, settings or analytics resources are accepted here. Content-only accounts cannot edit SEO by choosing another domain for an existing draft.

Turn the flag off first to withdraw the feature without data loss. `rollback.sql` refuses to drop a nonempty store, even if the only rows are archived. No production approval, toggle or grant has been made by this implementation batch.
