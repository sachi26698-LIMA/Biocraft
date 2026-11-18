# BioCraft Production — connection and sync checkpoint

**2026-11-18 UTC · [Production site](https://biocraft-bice.vercel.app) · Supabase project `jvpadtzfsuekixrquzjv` · release branch `arena/21fb7968-biocraft`.** This is a dated observation, not a continuously updated status page. The guest catalogue is live. **The Admin database connection is not ready.** No new Supabase project, Admin account, MFA change, recurring hosted worker or paid upgrade was created.

Application release: `dff59e3` (`dpl_7goSuCiVnxPzTUsXWjENt8YL2aNa`), **READY / PROMOTED** on the canonical domain. The release branch has not been merged into `main`.

## What ran on Production

Independent readback of the migration ledger (49 entries, including historical split migrations):

| Version | Migration | Change |
| --- | --- | --- |
| `20261118212115` | `bc_0009_reconcile_catalogue_sync` | Restore the missing guest RPCs, source registrations and timestamps |
| `20261118214302` | `bc_0010_library_import_provenance` | Nullable palette source FK, ISC and Unlicense entries; no existing palettes relabelled |
| `20261118215319` | `bc_0011_synced_library_search` | Search the imported emoji as well as curated collections; return real provenance and page in sort order |

The following **four** jobs were read back as `succeeded`, with one log each. “Updated” for the BioCraft catalogue means its **derived search index**, not edits to 6,649 original content records.

| Source | Seen | Inserted | Updated | Skipped |
| --- | ---: | ---: | ---: | ---: |
| BioCraft catalogue | 6,649 | 0 | 6,649 | 0 |
| Unicode 15.1 symbols | 7,775 | 7,268 | 0 | 507 |
| Unicode emoji JSON 0.9.0 | 1,914 | 1,914 | 0 | 0 |
| Google Fonts metadata 6.0.8 | 1,908 | 1,908 | 0 | 0 |

There were **1,914 package emoji, 7,897 symbols and 1,941 fonts** (33 existing plus 1,908 imported families), and 17,739 global index rows. The font package is **metadata**; no font binaries or new rights to use a typeface were imported. The import matched natural keys, skipped collisions with other sources/manual rows and did not reactivate hidden rows. The two JSON payloads matched the pinned npm files by SHA-256. The one-transaction transfer left **no `http` extension or transfer schema**.

The [guest readiness check](https://biocraft-bice.vercel.app/api/status/content) returned `{"ok":true}`. Under the `anon` database role, `😀` and `ABeeZee` were found with the correct source slugs; two consecutive relevance pages returned 5 rows each with zero overlapping IDs. `search_library` is `SECURITY INVOKER`; the guest has no Admin schema usage. These checks do not simulate an authenticated Admin.

## Admin: remaining provider-side check

The [Admin diagnostic](https://biocraft-bice.vercel.app/api/admin/v1/health?diagnose=1) reached the Auth provider. The verified-TLS **session pooler rejected tenant/user lookup before the app obtained a Postgres connection** (`XX000`, `tenant_or_user_lookup`). Vercel Production's `ADMIN_DB_HOST` matches the Dashboard-confirmed `aws-0-ap-southeast-2.pooler.supabase.com`, port `5432`; `ADMIN_DB_USER` was set to the project-scoped limited login. In Postgres that role can log in, is not expired, has CONNECT, and has the Admin reporting command grants. This does **not** prove the pooler can resolve it or that its password is correct. The direct DB hostname has no IPv4 A record. Do not guess another cluster, switch to port 6543, use `postgres` in the app, disable TLS, or reset an Auth password to address this error.

**The operator also confirmed that the independent Supabase Management API check returns the same `aws-0` host.** There is no evidence for switching hosts or rotating a password. `scripts/admin-pooler-host.mjs` is the private, read-only comparison helper for future assignment changes; never share a token, DSN, password or MFA code.

**Next action: Supabase Support.** Suggested ticket (no secrets):

> Project `jvpadtzfsuekixrquzjv` (ap-southeast-2), 2026-11-18 around 22:32 UTC: the shared session pooler at `aws-0-ap-southeast-2.pooler.supabase.com:5432` returns SQLSTATE `XX000` (tenant/user lookup) for `bc_admin_executor.jvpadtzfsuekixrquzjv` before our verified-TLS Vercel client obtains a DB session. Dashboard Connect, the primary pooler metadata and Production configuration agree on the hostname. DB, pooler and Auth service health are green. The custom Postgres role exists, has LOGIN and CONNECT, and is not expired. Please verify the project's Supavisor tenant registration and custom-role routing on the assigned cluster.

- Acceptance after repair: `/api/admin/v1/health` must return `200 {"ok":true}`; the diagnostic must report a reachable database and provider, limited role `ok` and commands `ok`. A signed-out `/session`, `/data-sources` or `/sync-jobs` request must remain unauthenticated. The owner must then [sign in](https://biocraft-bice.vercel.app/admin/login) with the existing account and MFA and open [Data Sources](https://biocraft-bice.vercel.app/admin/data-sources). Check both the source registry and the recent jobs table. **The hosted signed-in check remains unverified.**

**Read-only recheck, 23:17 UTC:** Supabase reported DB, Auth, REST and pooler `ACTIVE_HEALTHY`. The canonical guest probe still returned `ok:true`; the deployed Admin diagnostic still returned `database:unreachable`, `XX000 / tenant_or_user_lookup`, `provider:reachable`. Anonymous-role SQL first pages (limit 25, active records): templates 0, designs 0, emoji 25, symbols 25, languages 22, fonts 25. Those are page lengths, not catalogue totals or signed-in HTTP responses. All eight private 015 library commands remained executable by the limited executor, not the browser roles. Shared readback found zero icons, zero palettes, four successful jobs, zero queued/running jobs and no optional `bc_admin_v1.catalog_drafts` table. No shared migration or grant was run in the local-stack batch.

## Safe operator paths

- **Do not replay the foundation migrations/seeds or reset the live DB.** The three migrations and four jobs above already ran. Check the ledger, `public.data_sources` and `public.data_sync_jobs` before doing work.
- `npm ci` and `npm run sync -- --once --dry-run` validate the three pinned standard packages without a DB. To repeat a standard source from an approved private writer, inject its `DATABASE_URL` server-side and run e.g. `npm run sync -- --once --source=fonts`. This is **not** the Admin executor. Alternatively `node scripts/export-standard-sync.mjs fonts` emits data SQL for operator review, without connecting or reading a secret. `supabase/ops/sync-catalogue.sql` reconciles the index, not source content. The optional `supabase/ops/sync-pinned-packages.sql` is an owner-authorized one-shot transfer, not a cron job or a migration; it refuses an existing `http` extension/schema and rolls back the whole operation on failure.
- **Bulk library is on hold.** The earlier preflight counted 572,907 candidates and estimated 2,917,423,020 additional bytes (~2.72 GiB); it was **not** an import or a grant of rights. Verified against the pinned `simple-icons@16.38.0` disclaimer: package CC0 does not mean every brand mark is CC0. The local policy now requires individual declared licence and source, keeps brand guidelines when supplied, and holds logo-heavy Iconify collections and entries with incomplete attribution. Of 3,472 Simple Icons records, 3,247 have no individual licence and only 119 meet this metadata policy. The current no-write preflight is **470,679 Iconify + 119 Simple Icons + 32,004 colours = 502,802**; estimated additional bytes **2,621,075,850 (~2.44 GiB)**. This is input metadata, not a legal review, approval to redistribute, or a hosted quota measurement. The earlier live database measurement (38,622,899 bytes) also does not establish quota. No plan change, bulk job or content update was made in this batch.
- `npm run import:library -- --source=all --dry-run` plans without writing, even if a writer DSN is present. A future approved write requires `--apply`, an explicit `--source` and a private writer. The operator must set `BIOCRAFT_DB_BUDGET_MIB` to a confirmed **total database ceiling** below its quota, not to a guessed amount of free space. `--limit=N` is a bounded incremental job; it **does not** mark a source completely synced. Repeating a successful limit starts at the beginning, not the next slice. Only use `--resume-job=<job UUID>` for an interrupted job from this importer with the same source, limit, pinned package endpoint and ordered SHA-256. Its committed item counters and the remaining input determine where work resumes and how much budget it needs; there is no automatic hosted scheduler.

Local evidence is separate: PGlite reconciliation and search tests; PostgreSQL worker retries/rollback and HTTP/RBAC tests; Chromium sign-in/connection retry and Data Sources/Sync Jobs fixtures at multiple viewport sizes. None required or used a real person's session.
