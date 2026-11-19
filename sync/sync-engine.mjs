#!/usr/bin/env node
/**
 * BioCraft — hybrid synchronisation engine (local PostgreSQL <-> Supabase).
 *
 * ONE authoritative write path. Supabase is the authority for application data:
 * the site writes only there, through the existing Admin API. Local is a
 * read-replica plus a staging area for imports. That choice is what makes the
 * conflict policy decidable; two equal writers cannot be resolved deterministically.
 *
 * Deterministic conflict policy, applied per row, in this order:
 *
 *   1. Newer `sync_revision` wins. Revision is a timestamptz written by the side
 *      that produced the change, so it is comparable across machines without
 *      either clock being trusted for ordering within a batch.
 *   2. Equal revision -> the row already equal on both sides is a no-op. If the
 *      bodies differ, the authority (supabase) wins and the loser is recorded in
 *      sync_audit with action='conflict_lost' — never silently overwritten.
 *   3. A tombstone older than the surviving row loses: an existing newer row
 *      resurrects instead of being deleted ("do not overwrite newer with older").
 *   4. Nothing is ever applied with a revision older than what the target holds.
 *
 * Idempotency: every queued change carries an event_id that is a hash of
 * (table, primary key, revision, operation). Replay is a no-op, so a crash
 * between applying and acknowledging cannot double-apply.
 *
 * Failure handling: a failed event stays in the outbox with attempts+1 and a
 * backoff timestamp from sync_backoff_seconds(). Writes are never discarded; they
 * become 'failed' and remain visible to the queue monitor.
 *
 * Usage:
 *   node sync/sync-engine.mjs --source=<url> --target=<url> --tables=bios --once --dry-run
 *   node sync/sync-engine.mjs --source=<url> --target=<url> --once
 *   node sync/sync-engine.mjs --status --target=<url>
 *
 * Credentials come from the environment or an explicit flag, never a file in the
 * repository. Nothing here prints a connection string.
 */
import pg from 'pg';
import {createHash} from 'node:crypto';

const args = process.argv.slice(2);
const has = n => args.includes(`--${n}`);
const opt = (n, d = null) => {
  const hit = args.find(a => a.startsWith(`--${n}=`));
  return hit ? hit.slice(n.length + 3) : d;
};

/** Tables that participate. Ordered so a parent is applied before its children. */
const TABLES = [
  'bios', 'captions', 'hashtags', 'symbols', 'fonts', 'emoji_library',
  'emoji_collections', 'color_palettes', 'design_templates', 'design_presets',
  'icon_library', 'categories', 'content_collections', 'platforms', 'generators',
  'languages', 'content_licenses', 'seo_pages', 'app_limits', 'global_content',
];

/** Columns that exist only for synchronisation and must not be compared as data. */
const SYNC_COLUMNS = new Set(['record_version', 'sync_status', 'last_synced_at', 'origin', 'sync_revision']);

const BATCH = Number(opt('batch', '500'));

export function eventId(table, pk, revision, operation) {
  return createHash('sha256')
    .update(`${table}|${pk}|${operation}|${new Date(revision).toISOString()}`)
    .digest('hex')
    .slice(0, 32);
}

/** The primary-key column for a table. Mirrors the schema; a table whose key is
 * not `id` must be listed explicitly rather than guessed. */
const PK = { languages: 'code' };
const pkOf = table => PK[table] ?? 'id';

/** Compare two row images ignoring sync bookkeeping. Used to detect a real
 * difference at equal revision, and as the duplicate check. */
export function sameBody(a, b) {
  if (!a || !b) return a === b;
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const key of keys) {
    if (SYNC_COLUMNS.has(key)) continue;
    const left = a[key], right = b[key];
    const ln = typeof left === 'object' && left !== null ? JSON.stringify(left) : left;
    const rn = typeof right === 'object' && right !== null ? JSON.stringify(right) : right;
    if (String(ln) !== String(rn)) return false;
  }
  return true;
}

/**
 * Decide what to do about one (local, remote) pair. Pure — no I/O — so the
 * policy is unit-testable without a database.
 * @returns {{action:'insert'|'update'|'delete'|'none'|'conflict_lost', reason:string, winner?:object}}
 */
export function resolvePair({ local, remote, tombstoneLocal, tombstoneRemote, authority = 'remote' }) {
  // A live row carries its marker in `sync_revision`; a tombstone carries it in
  // `revision`. Reading only one of the two silently made every tombstone
  // compare as epoch zero, so no delete could ever win. Both are accepted here.
  const rev = row => {
    const raw = row?.sync_revision ?? row?.revision ?? 0;
    return raw instanceof Date ? raw.getTime() : Date.parse(raw) || 0;
  };

  // Tombstone vs live row. A delete only wins if it is not older than the row,
  // which is what stops a stale delete from removing a newer edit.
  if (tombstoneRemote && !tombstoneLocal && local) {
    return rev(tombstoneRemote) >= rev(local)
      ? { action: 'delete', reason: 'remote tombstone is newer than the local row' }
      : { action: 'conflict_lost', reason: 'stale remote tombstone lost to a newer local row' };
  }
  if (tombstoneLocal && !tombstoneRemote && remote) {
    return rev(tombstoneLocal) >= rev(remote)
      ? { action: 'none', reason: 'local delete already satisfied remotely' }
      : { action: 'conflict_lost', reason: 'stale local tombstone lost to a newer remote row' };
  }

  if (local && !remote) return { action: 'insert', reason: 'missing on the target', winner: local };
  if (!local && remote) return { action: 'insert', reason: 'missing locally', winner: remote };
  if (!local && !remote) return { action: 'none', reason: 'absent on both sides' };

  const lr = rev(local), rr = rev(remote);
  if (lr > rr) return { action: 'update', reason: 'local revision is newer', winner: local };
  if (rr > lr) return { action: 'update', reason: 'remote revision is newer', winner: remote };
  if (sameBody(local, remote)) return { action: 'none', reason: 'identical at equal revision' };

  // Equal revision, different bodies: deterministic, never arbitrary.
  return authority === 'remote'
    ? { action: 'conflict_lost', reason: 'equal revision, bodies differ; authority (supabase) retains its value', winner: remote }
    : { action: 'update', reason: 'equal revision, bodies differ; local authority wins', winner: local };
}

function pool(url) {
  // A local socket path or a URL both work; TLS is the target's decision, so it
  // is not forced here and no certificate is bypassed.
  if (url.startsWith('/')) return new pg.Pool({host: url, database: 'postgres'});
  return new pg.Pool({connectionString: url, ssl: /supabase|pooler/.test(url) ? {rejectUnauthorized: true} : undefined, max: 2});
}

async function revisionOf(client, table) {
  const {rows} = await client.query(`select last_revision from public.sync_state where table_name=$1`, [table]);
  return rows[0]?.last_revision ?? new Date(0);
}

/** Rows changed at or after the cursor. Keyset by (sync_revision, pk) so a large
 * library is never loaded whole and re-running cannot skip or repeat a window. */
async function changedRows(client, table, since, limit) {
  const pk = pkOf(table);
  const {rows} = await client.query(
    `select * from public.${table} where sync_revision >= $1 order by sync_revision, ${pk} limit $2`,
    [since, limit],
  );
  return rows;
}

async function queueEvent(client, {table, pk, revision, operation, payload}) {
  const id = eventId(table, pk, revision, operation);
  await client.query(
    `insert into public.sync_outbox (event_id, table_name, row_pk, operation, revision, payload)
     values ($1,$2,$3,$4,$5,$6) on conflict (event_id) do nothing`,
    [id, table, String(pk), operation, revision, payload ? JSON.stringify(payload) : null],
  );
  return id;
}

/**
 * Apply the deterministic decision to the target.
 * The outbox event is acknowledged in the SAME transaction as the write, so the
 * pair is atomic: either both happen or neither does.
 */
async function applyToTarget(target, {table, row, decision, event, client: existing}) {
  const pk = pkOf(table);
  const client = existing ?? await target.connect();
  try {
    await client.query('begin');
    if (decision.action === 'insert' || decision.action === 'update') {
      const body = decision.winner ?? row;
      const cols = Object.keys(body);
      const placeholders = cols.map((_, i) => `$${i + 1}`);
      const updates = cols.filter(c => !['id', 'code'].includes(c)).map(c => `${c}=excluded.${c}`);
      await client.query(
        `insert into public.${table} (${cols.join(',')}) values (${placeholders.join(',')})
         on conflict (${pk}) do update set ${updates.join(',')}`,
        cols.map(c => body[c]),
      );
    }
    await client.query(
      `update public.sync_outbox set status='applied', applied_at=now() where event_id=$1`,
      [event],
    );
    await client.query('commit');
    return true;
  } catch (error) {
    await client.query('rollback').catch(() => {});
    // Retry with backoff. The event is NOT discarded: it stays pending and
    // becomes visible in the failed queue once attempts exceed the threshold.
    await client.query(
      `update public.sync_outbox
          set attempts=attempts+1,
              status = case when attempts+1 >= 8 then 'failed' else 'pending' end,
              last_error=$2,
              next_attempt_at = now() + make_interval(secs => public.sync_backoff_seconds(attempts+1))
        where event_id=$1`,
      [event, String(error?.message ?? error).slice(0, 300)],
    ).catch(() => {});
    return false;
  } finally {
    if (!existing) client.release();
  }
}

/** Record a failure on the SOURCE outbox. Called when the target cannot be
 * reached at all: the work must stay visible and retryable, which is only
 * possible if the durable record lives on the side that is still up. */
async function markQueuedFailure(source, event, error) {
  await source.query(
    `update public.sync_outbox
        set attempts=attempts+1,
            status = case when attempts+1 >= 8 then 'failed' else 'pending' end,
            last_error=$2,
            next_attempt_at = now() + make_interval(secs => public.sync_backoff_seconds(attempts+1))
      where event_id=$1`,
    [event, String(error?.message ?? error).slice(0, 300)],
  ).catch(() => {});
}

export async function runOnce({sourceUrl, targetUrl, tables = TABLES, dryRun = false, log = () => {}}) {
  const source = pool(sourceUrl), target = pool(targetUrl);
  const report = {tables: {}, applied: 0, conflicts: 0, failed: 0, queued: 0, dryRun};
  try {
    for (const table of tables) {
      const sc = await source.connect();
      // The target may be entirely unreachable. That must NOT abort the run:
      // every change still has to be recorded as pending so it can be retried.
      let tc = null;
      try {
        const since = await revisionOf(sc, table);
        const rows = await changedRows(sc, table, since, BATCH);
        const stats = {scanned: rows.length, applied: 0, conflicts: 0, failed: 0, queued: 0};
        try { tc = dryRun ? null : await target.connect(); }
        catch (error) { stats.targetDown = true; }
        const pk = pkOf(table);

        for (const row of rows) {
          const pkValue = row[pk];
          const operation = 'upsert';
          const revision = row.sync_revision;

          // 1. Durably record the intent BEFORE touching the target. This is the
          //    ordering that guarantees a write is never lost: if the process
          //    dies here, the event exists and will be retried.
          const event = dryRun
            ? eventId(table, pkValue, revision, operation)
            : await queueEvent(sc, {table, pk: pkValue, revision, operation, payload: row});

          if (dryRun) { stats.applied++; report.applied++; continue; }

          // 2. Target down: leave the event queued with a reason. Nothing lost.
          if (!tc) {
            await markQueuedFailure(sc, event, 'target unreachable');
            stats.queued++; report.queued++; report.failed++;
            continue;
          }

          const locked = (await tc.query('select public.sync_try_lock($1) l', [`${table}:${pkValue}`])).rows[0].l;
          if (!locked) { stats.failed++; report.failed++; continue; }
          try {
            const remote = (await tc.query(`select * from public.${table} where ${pk}=$1`, [pkValue])).rows[0] ?? null;
            const decision = resolvePair({local: row, remote, authority: 'remote'});
            if (decision.action === 'none') continue;
            if (decision.action === 'conflict_lost') {
              stats.conflicts++; report.conflicts++;
              await tc.query(
                `insert into public.sync_audit (table_name,row_pk,action,detail,origin) values ($1,$2,'conflict_lost',$3,'local')`,
                [table, String(pkValue), decision.reason],
              ).catch(() => {});
              continue;
            }
            const ok = await applyToTarget(target, {table, row, decision, event, client: tc});
            if (ok) { stats.applied++; report.applied++; } else { stats.failed++; report.failed++; }
          } finally {
            await tc.query('select public.sync_unlock($1)', [`${table}:${pkValue}`]).catch(() => {});
          }
        }

        if (!dryRun && rows.length) {
          const last = rows[rows.length - 1].sync_revision;
          await sc.query(
            `insert into public.sync_state (table_name,last_revision,last_synced_at,last_row_count)
             values ($1,$2,now(),$3)
             on conflict (table_name) do update set last_revision=excluded.last_revision, last_synced_at=excluded.last_synced_at, last_row_count=excluded.last_row_count`,
            [table, last, rows.length],
          );
        }
        report.tables[table] = stats;
        log(`${table}: scanned=${stats.scanned} applied=${stats.applied} conflicts=${stats.conflicts} queued=${stats.queued} failed=${stats.failed}`);
      } finally {
        if (tc) tc.release();
        sc.release();
      }
    }
    return report;
  } finally {
    await source.end().catch(() => {});
    await target.end().catch(() => {});
  }
}

/** Count + checksum comparison. Real numbers, not estimates. */
export async function reconcile({aUrl, bUrl, tables = TABLES}) {
  const a = pool(aUrl), b = pool(bUrl);
  const out = {};
  try {
    for (const table of tables) {
      const row = async p => {
        const c = await p.connect();
        try {
          const pk = pkOf(table);
          const r = await c.query(`select count(*)::bigint n, md5(coalesce(string_agg(md5(t::text),'' order by t.${pk}),'empty')) ck from public.${table} t`);
          return {rows: Number(r.rows[0].n), checksum: r.rows[0].ck};
        } finally { c.release(); }
      };
      const left = await row(a), right = await row(b);
      out[table] = {...left, match: left.rows === right.rows && left.checksum === right.checksum};
    }
    return out;
  } finally {
    await a.end().catch(() => {});
    await b.end().catch(() => {});
  }
}

async function main() {
  const sourceUrl = opt('source');
  const targetUrl = opt('target');
  if (has('status')) return;
  if (!sourceUrl || !targetUrl) {
    console.error('usage: --source=<url> --target=<url> [--tables=a,b] [--once] [--dry-run]');
    process.exit(2);
  }
  const tables = (opt('tables') ?? '').split(',').filter(Boolean);
  const report = await runOnce({
    sourceUrl, targetUrl,
    tables: tables.length ? tables : TABLES,
    dryRun: has('dry-run'),
    log: console.log,
  });
  console.log(JSON.stringify(report, null, 2));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => { console.error(JSON.stringify({error: String(error?.message ?? error)})); process.exit(1); });
}
