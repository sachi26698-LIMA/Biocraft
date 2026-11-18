# BioCraft Production — connection and sync checkpoint

**2026-11-18 UTC · [Production site](https://biocraft-bice.vercel.app) · Supabase project `jvpadtzfsuekixrquzjv` · release branch `arena/21fb7968-biocraft`.** This is a dated observation, not a continuously updated status page. The guest catalogue is live. **The Admin database connection is not ready.** No new Supabase project, Admin account, MFA change, recurring hosted worker or paid upgrade was created.

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

- For an independent, read-only control-plane comparison, on an **already authorized private workstation** with the Management API token supplied by its secret manager, run `node scripts/admin-pooler-host.mjs`. This checks the primary pooler using the same metadata endpoint as the Supabase CLI. It prints **only the hostname**. It does not query the DB or change either provider. Never put a token, DSN, database password or MFA code in a message or in the repo.
- If the primary hostname differs, correct **only** Vercel Production `ADMIN_DB_HOST` to the provider-reported host and redeploy the reviewed branch. If it is the same, ask Supabase Support to verify **pooler tenant routing and custom-role resolution for `bc_admin_executor` on this project**; share the project ref, hostname, port, UTC time and the sanitized diagnostic, not credentials. The connection is deliberately left fail-closed until it works.
- Acceptance after repair: `/api/admin/v1/health` must return `200 {"ok":true}`; the diagnostic must report a reachable database and provider, limited role `ok` and commands `ok`. A signed-out `/session`, `/data-sources` or `/sync-jobs` request must remain unauthenticated. The owner must then [sign in](https://biocraft-bice.vercel.app/admin/login) with the existing account and MFA and open [Data Sources](https://biocraft-bice.vercel.app/admin/data-sources). Check both the source registry and the recent jobs table. **The hosted signed-in check remains unverified.**

## Safe operator paths

- **Do not replay the foundation migrations/seeds or reset the live DB.** The three migrations and four jobs above already ran. Check the ledger, `public.data_sources` and `public.data_sync_jobs` before doing work.
- `npm ci` and `npm run sync -- --once --dry-run` validate the three pinned standard packages without a DB. To repeat a standard source from an approved private writer, inject its `DATABASE_URL` server-side and run e.g. `npm run sync -- --once --source=fonts`. This is **not** the Admin executor. Alternatively `node scripts/export-standard-sync.mjs fonts` emits data SQL for operator review, without connecting or reading a secret. `supabase/ops/sync-catalogue.sql` reconciles the index, not source content. The optional `supabase/ops/sync-pinned-packages.sql` is an owner-authorized one-shot transfer, not a cron job or a migration; it refuses an existing `http` extension/schema and rolls back the whole operation on failure.
- **Bulk library is on hold.** Iconify (537,448 candidates), Simple Icons (3,455) and Color Name List (32,004) have no completed Production import. The database read **38,622,899 bytes (~36.8 MiB)** at one checkpoint; this is not subscription quota or free headroom. The full 572,907-row preflight estimated **2,917,423,020 additional bytes (~2.72 GiB)**, not a promise of physical space. Review actual Supabase disk/quota, a reserve for indexes/WAL/other traffic, per-source attribution and brand-use terms before approving any bulk write. No plan change is required for the work already completed.
- `npm run import:library -- --source=all --dry-run` plans without writing. A future approved writer must set `BIOCRAFT_DB_BUDGET_MIB` to a confirmed **total database ceiling** below its quota, not to a guessed amount of free space. `--limit=N` is a bounded incremental job; it **does not** mark a source completely synced.

Local evidence is separate: PGlite reconciliation and search tests; PostgreSQL worker retries/rollback and HTTP/RBAC tests; Chromium sign-in/connection retry and Data Sources/Sync Jobs fixtures at multiple viewport sizes. None required or used a real person's session.
