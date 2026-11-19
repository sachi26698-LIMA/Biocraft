# BioCraft — hybrid local + Supabase database architecture

Status: **implemented and verified in isolation; NOT enabled in production.**
Nothing in this directory has been applied to Supabase, and production routing is
unchanged. Verified production state is still commit `f435b75`.

## What this is

One schema, two databases, one write authority.

| | Supabase `jvpadtzfsuekixrquzjv` | Local PostgreSQL |
|---|---|---|
| Role | **Authority.** All application writes land here. | Read replica + staging for licensed imports. |
| Written by | Admin API only (existing path) | Sync engine only, except staging tables |
| Auth | Provider of record (unchanged) | None; no user auth here |

The single most important decision is that **Supabase is the only authority**.
"Never simultaneous uncontrolled writes" is not achievable by discipline alone;
it is achievable by having one writer. A second equal writer makes conflicts
undecidable, and any policy would then be a guess dressed up as a rule.

## Conflict policy (deterministic, documented)

Applied per row, in order:

1. **Newer `sync_revision` wins.** A `timestamptz` written by the side that made
   the change. Comparable across machines without trusting either clock for
   intra-batch ordering.
2. **Equal revision, identical body** → no-op. This is the duplicate check.
3. **Equal revision, different body** → the authority (Supabase) keeps its value.
   The loser is written to `sync_audit` with `action='conflict_lost'` and a
   reason. It is *recorded*, not silently dropped.
4. **Tombstone older than the surviving row loses.** An existing newer row
   resurrects rather than being deleted. This is the concrete meaning of "never
   overwrite newer data with older".
5. **Nothing is ever applied with a revision older than the target holds.**

## Guarantees and how each is enforced

| Requirement | Mechanism |
|---|---|
| Idempotent | `event_id` = SHA-256 of (table, pk, revision, operation). Replay is `on conflict do nothing`. |
| No duplicate application | Acknowledging the outbox event happens **in the same transaction** as the write. |
| Never discard writes | The event is committed to the outbox **before** the target is touched (queue-first). |
| Retry with backoff | `sync_backoff_seconds()` → 5,10,20,40,80,160,320,640,1280s, capped at 3600. |
| Failed-sync queue | After 8 attempts status becomes `failed` and stays visible to `sync/health.mjs`. |
| No simultaneous writers | `pg_try_advisory_lock` per (table, row) for the duration of a batch. |
| Deletes propagate | `sync_tombstones`, because an absent row is indistinguishable from an unsent one. |
| Reconciliation | `reconcile()` compares real `count(*)` and `md5` of ordered row hashes. |
| No secret exposure | Connection strings come from the environment; nothing prints one. |
| Local isolated from prod | Separate database; migration applied to local first. |

## Proof

`tests/hybrid-sync-replication.mjs` runs **two real PostgreSQL clusters** and
exercises the real engine — 13 assertions, all passing:

```
PASS migration is additive, idempotent and adds all five sync columns
PASS inserts replicate to the second database
PASS replay is idempotent: no duplicate rows, no duplicate events
PASS newer revision wins
PASS older data never overwrites newer data
PASS conflict is deterministic: authority wins and the loser is audited
PASS tombstone ordering: stale deletes lose, newer deletes apply
PASS deletion is represented by a tombstone, not by an absent row
PASS outage: writes are queued with a recorded reason, nothing discarded
PASS backoff is monotonic and bounded: 5,10,20,40,80,160,320,640,1280 seconds
PASS recovery: queued writes apply once the target is reachable again
PASS event ids are deterministic, so replays collapse
PASS reconciliation: A=5 rows, B=5 rows
```

Two real defects were found by these tests and fixed, rather than worked around:

- Tombstones store their timestamp in `revision`, but the comparison read only
  `sync_revision`, so **every delete compared as epoch zero and no delete could
  ever win.**
- When the target database was entirely unreachable, `connect()` threw and
  aborted the run — **writes were not queued at all.** The engine was reordered
  to be queue-first, which is now what the outage test asserts.

That second bug is exactly the failure mode the requirements forbid, and it was
invisible until a target was actually taken down.

Migration safety was verified separately: applied **three times** to a database
holding 500 `global_content` + 50 `bios` + 2 `languages` rows, with **zero row
loss**, non-existent tables skipped, and existing rows stamped `epoch` so a first
sync does not falsely claim all history changed.

`tests/local-db-proxy.mjs` proves the production access path: unsigned requests
refused (401), replayed requests outside a 60s window refused, tampered bodies
refused, wrong key refused, **no configured key fails closed**, and arbitrary SQL
is impossible because the caller names an operation and never supplies SQL.

## Production access path (Phase 4)

```
browser ──▶ Vercel Admin API ──▶ Supabase (authority)
                    │
                    └──▶ local-db-proxy (HTTPS + HMAC) ──▶ local PostgreSQL
```

The frontend never learns the local host, port or credential, and never calls
anything but the Admin API. The proxy exposes four fixed read-only operations.

## What is NOT done — stated plainly

1. **No cross-database sync has executed against real Supabase.** This sandbox's
   egress proxy terminates TLS before a PostgreSQL handshake completes, so the
   second database in the tests is a second *local cluster*, not the real project.
   The SQL and logic are real; the network position is simulated.
2. **This sandbox cannot be the Phase 4 "persistent, reachable server."** It is
   ephemeral with no inbound reachability. A real host is required.
3. **The migration is not applied to Supabase.** It is additive and safe, but
   applying it is a production change and needs approval — see
   `HYBRID_SYNC_APPROVAL.md`.
4. **No production sync is enabled.** Production still serves exclusively from
   Supabase via the existing Admin API.

**Both databases are not synchronized, and this document does not claim they
are.**
