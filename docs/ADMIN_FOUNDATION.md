# Master Admin: investigation and read-only foundation

**Status: incomplete; not deployed or provisioned.** No admin route or login is available. `admin-drafts/001-readonly-rbac.sql` is an unexecuted design draft, not a migration to run. It is not a complete admin system and must not be applied to the shared Supabase project without explicit approval and independent review.

## Findings

- The application is a static Vite/React site. `src/App.tsx` and `src/components/ToolShell.tsx` serve the guest interface; `src/lib/router.ts` and `scripts/build-shells.mjs` implement routes and static SEO shells. There is no existing administrative backend, auth UI, membership system, or audit trail.
- Supabase project `jvpadtzfsuekixrquzjv` has ten public content tables: `bios`, `captions`, `categories`, `emoji_collections`, `fonts`, `generators`, `hashtags`, `platforms`, `seo_pages`, and `symbols`. Each has RLS and one active-row guest/authenticated SELECT policy. Existing write grants are revoked. There are no deployed Edge Functions. The database branch list returned no branches.
- The collection pages can consume active `bios` from Supabase by `source_slug` using `src/lib/biosRemote.ts`. They fall back to bundled content if unconfigured or unavailable; they do not currently support an admin preview of drafts. Concurrent paging has known snapshot limitations; see `PERFORMANCE_PREVIEW.md`.
- Eight platform settings and limits are compiled in `src/tools/platforms.ts`; the twelve tool routes/components are in `src/tools/registry.ts`. Generator pools, Unicode and symbol data, website copy and route SEO are bundled code. Editing corresponding database rows would **not** automatically update those features. LinkedIn is marked English-only; broader language support varies by tool. These capabilities require explicit integration and tests before offering editing controls.
- No privacy-preserving usage, real-user performance analytics, errors, draft/publish/rollback or audit infrastructure exists. Counts of database records are not usage metrics.
- The existing Vercel Preview is connected to the shared Supabase project. A frontend branch or Preview URL does not isolate database policies, RPCs, auth users, or content. Published edits to that database can affect other clients immediately. A Supabase branch list being empty does not prove branch creation is available or allowed.

## Draft security foundation

The draft proposes a non-exposed membership table, and two narrowly scoped `SECURITY DEFINER` RPCs for an authorized user's role and aggregate content counts. Both RPCs check `auth.uid()` and current enabled membership at the database on each request. Role names are `super_admin`, `admin`, `editor`, and `analyst`; **all four have the same read-only capability in this draft**. There are no mutation APIs, role-management UI, grants for content writes, or bootstrap commands. The draft does not modify existing guest policies. Database owners/service roles can bypass these restrictions, so those credentials must remain privileged and private.

Even if applied, the RPCs would be reachable through the shared project, not restricted to Preview. Before any use: review function ownership and grants in the actual environment; design trusted first-admin provisioning and emergency recovery, MFA/session rules, comprehensive authorization, immutable audit controls, and approved draft/publish isolation. Review and test upgrades and rollback. Never pass credentials or service keys to the frontend or chat. Do not apply this draft as-is just to make a UI work.

## Tests and limitations

`npm run test:admin-draft` runs the unapplied SQL in an ephemeral local PGlite PostgreSQL-compatible database. It exercises anonymous, no-session, ordinary authenticated and disabled-member denials; all four role reads; direct writes denied; and preservation of a representative active-only guest RLS policy. `npm run typecheck` also passed. The tests use a simplified fixture, not the real schema, Supabase Auth, actual PostgREST JWT verification, network, concurrent requests or deployed project. They do not establish production security, migration safety, performance, or actual user authentication. No screenshots, admin Preview, end-to-end tests or field metrics exist for this work.

## Work remaining

A complete implementation needs server-enforced operation-level permissions and protected audit history; dedicated authentication and provisioning; draft/review/approval/rollback; bio CRUD, bulk import/export, validation and pagination; real integrations for every editable public setting and asset; safe SEO and appearance publishing; truthful aggregate usage/error reporting with privacy safeguards; backup/restore and migration procedures; responsive accessible UI; and real end-to-end, security, device and performance testing. All changes affecting the shared project require prior approval. No Production deployment or main merge is authorized.
