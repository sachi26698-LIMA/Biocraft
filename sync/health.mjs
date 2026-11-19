#!/usr/bin/env node
// Sync health: what is queued, what is failing, and how far behind each table is.
//
// Intended to run against the LOCAL side, which is where the outbox lives. It
// prints counts and ages only — never a connection string, never row contents.
//
//   node sync/health.mjs --url=<postgres-url> [--json]
//
// Exit code is 1 when the queue needs attention (permanent failures, or a table
// that has never synced), so it can be used directly as a monitoring check.
import pg from 'pg';

const args = process.argv.slice(2);
const url = (args.find(a => a.startsWith('--url=')) ?? '').slice(6);
const asJson = args.includes('--json');
if (!url) { console.error('usage: --url=<postgres-url> [--json]'); process.exit(2); }

// A socket path and a URL are both accepted; a socket path still needs an
// explicit database, otherwise the driver defaults it to the OS user name.
const isSocket = url.startsWith('/');
const pool = new pg.Pool(isSocket ? {host: url, database: 'postgres', max: 1} : {connectionString: url, max: 1});

try {
  const outbox = await pool.query(`
    select status, count(*)::bigint n,
           coalesce(max(attempts),0)::int worst_attempts,
           min(created_at) filter (where status in ('pending','failed')) as oldest_outstanding
      from public.sync_outbox group by status order by status`);
  const state = await pool.query(`
    select table_name, last_synced_at,
           extract(epoch from (now() - last_synced_at))::bigint lag_seconds, last_row_count
      from public.sync_state order by table_name`);
  const conflicts = await pool.query(`
    select count(*)::bigint n from public.sync_audit where action='conflict_lost'`);

  const byStatus = Object.fromEntries(outbox.rows.map(r => [r.status, Number(r.n)]));
  const failing = (byStatus.failed ?? 0) > 0;
  const neverSynced = state.rows.filter(r => !r.last_synced_at).length;
  const worstLag = state.rows.reduce((m, r) => Math.max(m, Number(r.lag_seconds ?? 0)), 0);

  const report = {
    outbox: byStatus,
    worst_attempts: Math.max(0, ...outbox.rows.map(r => r.worst_attempts)),
    oldest_outstanding: outbox.rows.find(r => r.oldest_outstanding)?.oldest_outstanding ?? null,
    tables_tracked: state.rows.length,
    tables_never_synced: neverSynced,
    worst_lag_seconds: worstLag,
    conflicts_recorded: Number(conflicts.rows[0].n),
    needs_attention: failing || neverSynced > 0,
  };

  if (asJson) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(`outbox: ${JSON.stringify(byStatus)}`);
    console.log(`permanently failed events: ${byStatus.failed ?? 0}   worst attempt count: ${report.worst_attempts}`);
    console.log(`oldest outstanding event: ${report.oldest_outstanding ?? 'none'}`);
    console.log(`tables tracked: ${report.tables_tracked}   never synced: ${neverSynced}   worst lag: ${worstLag}s`);
    console.log(`conflicts recorded: ${report.conflicts_recorded}`);
    console.log(report.needs_attention ? 'ATTENTION: queue is not clean' : 'OK: queue clean');
  }
  process.exitCode = report.needs_attention ? 1 : 0;
} finally {
  await pool.end().catch(() => {});
}
