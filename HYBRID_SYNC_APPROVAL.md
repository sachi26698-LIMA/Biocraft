# Approval required before enabling hybrid sync

Everything below is **not applied**. This is the gate, not a record of work done.

## Why approval is needed at all

Enabling sync means three production changes, each of which touches data the
requirements say must be preserved:

1. Applying `sync/schema/0001_sync_metadata.sql` to Supabase — adds 5 columns to
   up to 27 tables and 4 new tables.
2. Pointing a worker at the real project, which begins writing to it.
3. Optionally routing reads through a second database.

Items 1 and 2 are reversible (the columns are additive and unused until the
engine runs), but they are still production schema changes.

## What has been proven, and what has not

| Claim | Status |
|---|---|
| Migration is additive, idempotent, loses no rows | **Verified** on disposable PostgreSQL (3 passes, 0 loss) |
| Sync logic correct vs. real PostgreSQL × 2 | **Verified** (13/13 assertions) |
| Outage queues writes instead of discarding them | **Verified** |
| Conflict resolution deterministic and audited | **Verified** |
| Proxy rejects unsigned/replayed/tampered requests | **Verified** |
| Works against the real Supabase project | **NOT verified** — sandbox cannot complete TLS |
| A persistent production host exists | **No** — sandbox is ephemeral |

## The one thing that could still change behaviour on real Supabase

The migration adds `sync_revision timestamptz not null default 'epoch'` and two
indexes per table. On `global_content` (17,739 rows) and `symbols` (7,897) this is
cheap. But Supabase runs **RLS with 24 policies**; new columns are not protected
by policies that enumerate columns, and `sync_outbox` / `sync_audit` must not be
world-readable. Before applying, the RLS for the four new tables needs an explicit
decision:

```sql
-- Proposed, to be reviewed: deny all by default, allow the service role only.
alter table public.sync_outbox     enable row level security;
alter table public.sync_tombstones enable row level security;
alter table public.sync_state      enable row level security;
alter table public.sync_audit      enable row level security;
-- No policies are created => anon/authenticated see nothing; service role bypasses.
```

This is deliberately not baked into the migration, because enabling RLS on new
tables is a security decision that should be explicit rather than a side effect.

## Recommended order of operations

1. Back up first: the count + md5 manifest in the final report, plus a real
   `pg_dump` from an environment that has one (this sandbox does not).
2. Apply the migration to a **staging copy**, run `reconcile()` between staging
   and production, confirm every table still matches.
3. Apply to production during a quiet window; the columns are unused so no
   behaviour changes.
4. Run `sync/health.mjs` against local with sync **dry-run only** (`--dry-run`),
   and compare counts to the manifest.
5. Enable a single table (`bios`, 506 rows) as a canary. Verify `reconcile()`.
6. Widen table by table.

## Stop conditions

Abort and roll back if any of these occur:

- `reconcile()` reports `match=false` for a table that previously matched.
- Any row count decreases unexpectedly.
- `sync_audit` shows `conflict_lost` in volume — that means two writers exist,
  which the architecture forbids.
- `sync/health.mjs` exits 1 persistently.
