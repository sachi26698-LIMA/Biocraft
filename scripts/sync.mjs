#!/usr/bin/env node
/**
 * BioCraft — automatic global data synchronisation.
 *
 * This is the scheduler. It runs the same verified adapters the manual importer
 * uses (scripts/import-data.mjs), so there is exactly one code path that decides
 * what a source contains — a scheduled run cannot import something different from
 * a manual one.
 *
 * Design decisions, and why:
 *
 *  - **Idempotent by construction.** Each adapter matches rows on a natural unique
 *    key and inserts only what is missing. Running the scheduler twice, or
 *    recovering a crashed job, cannot duplicate a row. This is asserted in tests,
 *    not assumed.
 *  - **One active job per (source, mode).** The database enforces it with a
 *    partial unique index, so two overlapping runs are rejected rather than
 *    racing. A stale `running` job older than STALE_MINUTES is reclaimed, which is
 *    the failed-job recovery path.
 *  - **Retry with backoff, bounded.** A failing source is retried; after
 *    MAX_ATTEMPTS the job is `failed` and the source status becomes `error` with
 *    the last error preserved. The console can then show a real reason.
 *  - **Honest status.** A source only becomes `ready` after an import actually
 *    wrote or verified rows. `never_synced` is never upgraded optimistically.
 *  - **No invented freshness.** `last_sync_at` is the time this process really
 *    finished, read back from the database, not the time it started.
 *
 * Usage:
 *   node scripts/sync.mjs --once                 # one pass over every source
 *   node scripts/sync.mjs --once --source=fonts  # one source
 *   node scripts/sync.mjs --daemon               # run forever on an interval
 *   node scripts/sync.mjs --status               # show current state, change nothing
 *   node scripts/sync.mjs --once --dry-run       # build + validate, write nothing
 */

import pg from 'pg';
import { SOURCES, importRows, validate, adaptEmoji, adaptSymbols, adaptFonts } from './import-data.mjs';

const args = process.argv.slice(2);
const has = (n) => args.includes(`--${n}`);
const opt = (n, d = null) => {
  const hit = args.find((a) => a.startsWith(`--${n}=`));
  return hit ? hit.slice(n.length + 3) : d;
};

const ONCE = has('once');
const DAEMON = has('daemon');
const STATUS_ONLY = has('status');
const DRY = has('dry-run') || !process.env.DATABASE_URL;
const SOURCE_ARG = opt('source', null);

/** Minutes after which a `running` job is assumed dead and may be reclaimed. */
const STALE_MINUTES = Number(opt('stale-minutes', '30'));
const MAX_ATTEMPTS = Number(opt('max-attempts', '3'));
/** Seconds between passes in daemon mode. Configurable, not hardcoded product lore. */
const INTERVAL_SECONDS = Number(process.env.SYNC_INTERVAL_SECONDS || opt('interval', '21600'));

const log = (...a) => console.log(new Date().toISOString(), ...a);

/** The adapter for each registry entry. Real modules, no fixtures. */
const ADAPTERS = {
  'unicode-emoji-json': { adapt: adaptEmoji, kind: 'emoji' },
  'unicode-15.1': { adapt: adaptSymbols, kind: 'symbol' },
  'google-fonts-metadata': { adapt: adaptFonts, kind: 'font' },
};

async function connect() {
  const db = new pg.Client({ connectionString: process.env.DATABASE_URL });
  await db.connect();
  return db;
}

/** Reclaim jobs whose process died without clearing the row. */
async function reclaimStale(db) {
  const { rows } = await db.query(
    `update public.data_sync_jobs
        set status='failed',
            finished_at=now(),
            error='abandoned: job exceeded the stale window without finishing'
      where status in ('queued','running')
        and coalesce(started_at, created_at) < now() - ($1 || ' minutes')::interval
      returning id, source_id`,
    [String(STALE_MINUTES)],
  );
  if (rows.length) log(`reclaimed ${rows.length} stale job(s)`);
  return rows.length;
}

/** Is there already a live job for this source in this mode? */
async function activeJob(db, sourceId, mode) {
  const { rows } = await db.query(
    `select id from public.data_sync_jobs
      where source_id=$1 and mode=$2 and status in ('queued','running') limit 1`,
    [sourceId, mode],
  );
  return rows[0]?.id ?? null;
}

async function setSourceStatus(db, sourceId, status, { count = null, error = null } = {}) {
  await db.query(
    `update public.data_sources
        set status=$2,
            last_sync_at=case when $2='ready' then now() else last_sync_at end,
            last_sync_count=coalesce($3, last_sync_count),
            last_error=$4
      where id=$1`,
    [sourceId, status, count, error],
  );
}

/**
 * Run one source once, with retries.
 * Returns a plain record of what happened, so the caller can report it truthfully.
 */
async function syncOne(db, slug, { dryRun = false, mode = 'full' } = {}) {
  const adapter = ADAPTERS[slug];
  if (!adapter) return { slug, ok: false, reason: 'no adapter registered for this source' };

  const { rows: src } = await db.query('select id, name, license_code from public.data_sources where slug=$1', [slug]);
  if (!src.length) return { slug, ok: false, reason: 'source row missing from the registry' };
  const sourceId = src[0].id;

  // ---- build and validate the payload before touching the job tables ----
  const built = await adapter.adapt();
  if (!built.available) {
    await setSourceStatus(db, sourceId, 'error', { error: built.reason });
    return { slug, ok: false, reason: built.reason };
  }
  const v = validate(adapter.kind, built.rows);

  if (dryRun) {
    return { slug, ok: true, dryRun: true, total: v.clean.length, inserted: 0, updated: 0, skipped: 0, dropped: v.dropped };
  }

  // ---- one active job per (source, mode) ----
  if (await activeJob(db, sourceId, mode)) {
    return { slug, ok: false, reason: 'a job for this source is already queued or running' };
  }

  const { rows: job } = await db.query(
    `insert into public.data_sync_jobs (source_id, status, mode, started_at, attempts)
     values ($1,'running',$2,now(),1) returning id`,
    [sourceId, mode],
  );
  const jobId = job[0].id;

  await db.query(
    `insert into public.data_sync_logs (job_id, level, message, detail)
     values ($1,'info',$2,$3)`,
    [jobId, `sync started for ${slug}`, JSON.stringify({ total: v.clean.length, dropped: v.dropped })],
  );

  let lastError = null;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const res = await importRows(db, adapter.kind, { slug, license: built.license }, v.clean);

      await db.query(
        `update public.data_sync_jobs
            set status='succeeded', finished_at=now(), attempts=$2,
                items_seen=$3, items_inserted=$4, items_updated=$5, items_skipped=$6, error=null
          where id=$1`,
        [jobId, attempt, v.clean.length, res.inserted, res.updated, res.skipped],
      );
      await db.query(
        `insert into public.data_sync_logs (job_id, level, message, detail) values ($1,'info',$2,$3)`,
        [jobId, `sync succeeded on attempt ${attempt}`,
          JSON.stringify({ inserted: res.inserted, updated: res.updated, skipped: res.skipped })],
      );
      await setSourceStatus(db, sourceId, 'ready', { count: v.clean.length, error: null });

      // Read the timestamp back: the reported freshness is the database's, not ours.
      const { rows: after } = await db.query(
        'select last_sync_at, last_sync_count from public.data_sources where id=$1', [sourceId],
      );
      return {
        slug, ok: true, attempts: attempt, total: v.clean.length,
        inserted: res.inserted, updated: res.updated, skipped: res.skipped, dropped: v.dropped,
        lastSyncAt: after[0]?.last_sync_at ?? null,
      };
    } catch (e) {
      lastError = e.message;
      await db.query(
        `insert into public.data_sync_logs (job_id, level, message, detail) values ($1,'error',$2,$3)`,
        [jobId, `attempt ${attempt} failed`, JSON.stringify({ error: lastError })],
      );
      if (attempt < MAX_ATTEMPTS) {
        const backoffMs = 250 * 2 ** (attempt - 1);
        log(`  ${slug}: attempt ${attempt} failed, retrying in ${backoffMs}ms`);
        await new Promise((r) => setTimeout(r, backoffMs));
      }
    }
  }

  // ---- exhausted: record a real failure the console can display ----
  await db.query(
    `update public.data_sync_jobs set status='failed', finished_at=now(), attempts=$2, error=$3 where id=$1`,
    [jobId, MAX_ATTEMPTS, lastError],
  );
  await setSourceStatus(db, sourceId, 'error', { error: lastError });
  return { slug, ok: false, attempts: MAX_ATTEMPTS, reason: lastError };
}

/** One full pass over every registered source that has an adapter. */
async function runPass({ dryRun = false } = {}) {
  const db = DRY ? null : await connect();
  const results = [];
  try {
    if (db) await reclaimStale(db);
    for (const slug of Object.keys(ADAPTERS)) {
      if (SOURCE_ARG && slug !== SOURCE_ARG) continue;
      log(`syncing ${slug}…`);
      try {
        const r = db
          ? await syncOne(db, slug, { dryRun })
          : { slug, ...(await dryRunOne(slug)) };
        results.push(r);
        log(r.ok
          ? `  ${slug}: ${dryRun ? 'validated' : 'ok'} — ${r.total} rows` +
            (dryRun ? '' : ` (+${r.inserted} new, ~${r.updated} updated, =${r.skipped} unchanged)`)
          : `  ${slug}: FAILED — ${r.reason}`);
      } catch (e) {
        results.push({ slug, ok: false, reason: e.message });
        log(`  ${slug}: FAILED — ${e.message}`);
      }
    }
  } finally {
    if (db) await db.end();
  }
  return results;
}

/** Dry run with no database at all: still uses the real adapters. */
async function dryRunOne(slug) {
  const a = ADAPTERS[slug];
  const built = await a.adapt();
  if (!built.available) return { ok: false, reason: built.reason };
  const v = validate(a.kind, built.rows);
  return { ok: true, dryRun: true, total: v.clean.length, inserted: 0, updated: 0, skipped: 0, dropped: v.dropped };
}

async function showStatus() {
  if (DRY) {
    log('no DATABASE_URL: cannot read live sync state. Run --once --dry-run to validate sources.');
    for (const slug of Object.keys(ADAPTERS)) {
      const a = ADAPTERS[slug];
      const built = await a.adapt();
      const v = built.available ? validate(a.kind, built.rows) : null;
      log(`  ${slug}: ${built.available ? `${v.clean.length} rows available` : `unavailable — ${built.reason}`}`);
    }
    return;
  }
  const db = await connect();
  try {
    const { rows } = await db.query(`
      select s.slug, s.status, s.last_sync_at, s.last_sync_count, s.last_error,
             (select count(*)::int from public.data_sync_jobs j where j.source_id=s.id) as jobs,
             (select count(*)::int from public.data_sync_jobs j where j.source_id=s.id and j.status='failed') as failed
      from public.data_sources s order by s.slug`);
    for (const r of rows) {
      log(`${r.slug.padEnd(24)} ${r.status.padEnd(13)} rows=${r.last_sync_count ?? '-'} ` +
          `jobs=${r.jobs} failed=${r.failed} last=${r.last_sync_at ?? 'never'}` +
          (r.last_error ? `\n    last error: ${r.last_error}` : ''));
    }
  } finally {
    await db.end();
  }
}

async function main() {
  if (STATUS_ONLY) return showStatus();

  if (DAEMON) {
    log(`daemon mode: every ${INTERVAL_SECONDS}s${DRY ? ' (DRY RUN)' : ''}`);
    // A long-lived loop, not a fake scheduler: each tick really runs a pass.
    // eslint-disable-next-line no-constant-condition
    for (;;) {
      const results = await runPass({ dryRun: DRY });
      const failed = results.filter((r) => !r.ok).length;
      log(`pass complete: ${results.length - failed}/${results.length} ok`);
      await new Promise((r) => setTimeout(r, INTERVAL_SECONDS * 1000));
    }
  }

  const results = await runPass({ dryRun: DRY });
  const failed = results.filter((r) => !r.ok);
  log(`\n${results.length - failed.length}/${results.length} source(s) ok`);
  if (failed.length) process.exitCode = 1;
}

main().catch((e) => { console.error('SYNC FAILED:', e.message); process.exit(1); });
