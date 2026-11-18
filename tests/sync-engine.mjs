/**
 * BioCraft — synchronisation engine regression test.
 *
 * Exercises scripts/sync.mjs against a real throwaway Postgres with the real
 * migrations and the real npm data sources. No fixtures, no mocked adapter.
 *
 * Requires TEST_DATABASE_URL pointing at a disposable database that already has
 * the migrations applied (tests/sync-bootstrap.mjs sets one up). When it is
 * absent the test says so and exits 77 (skip) rather than pretending to pass.
 *
 * Assertions, in order of what would actually break in production:
 *   1. a first sync writes the real catalogues
 *   2. a second sync inserts nothing (idempotent — the core safety property)
 *   3. a crashed job is reclaimed and recorded as failed
 *   4. a genuinely failing source is retried, then marked failed with the real error
 *   5. the source recovers to `ready` once the cause is fixed
 */

import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import pg from 'pg';
import {adaptEmoji} from '../scripts/import-data.mjs';

const run = promisify(execFile);
const URL_ = process.env.TEST_DATABASE_URL;

if (!URL_) {
  console.log('SKIP sync engine: TEST_DATABASE_URL is not set (no disposable database)');
  process.exit(77);
}

// This suite deliberately disturbs the catalogue. Require the disposable local
// bootstrap target rather than accepting an arbitrary TEST_DATABASE_URL.
const localSocket = /^postgres(?:ql)?:\/\/[\w%-]+@\/biocraft_sync_test(?:_[a-z0-9_]+)?\?host=\/[\w/-]+$/.test(URL_);
if (!localSocket) {
  const target = new URL(URL_);
  if (!['postgresql:','postgres:'].includes(target.protocol) || !['localhost','127.0.0.1','[::1]'].includes(target.hostname) || target.search || !/^\/biocraft_sync_test(?:_[a-z0-9_]+)?$/.test(target.pathname)) throw Error('Disposable local sync database required');
}
let pass = 0;
const ok = (name) => { pass++; console.log(`  PASS  ${name}`); };

const db = new pg.Client({ connectionString: URL_ });
await db.connect();

const sync = async (...extra) => {
  const { stdout, stderr } = await run('node', ['scripts/sync.mjs', '--once', ...extra], {
    env: { ...process.env, DATABASE_URL: URL_ },
    maxBuffer: 8 * 1024 * 1024,
  }).catch((e) => ({ stdout: e.stdout ?? '', stderr: e.stderr ?? String(e) }));
  return `${stdout}\n${stderr}`;
};

const count = async (table) => (await db.query(`select count(*)::int n from public.${table}`)).rows[0].n;

console.log('\n1. first sync writes the real catalogues');
const first = await sync();
assert.match(first, /3\/3 source\(s\) ok/, `first sync should succeed:\n${first}`);
const emoji = await count('emoji_library');
const symbols = await count('symbols');
const fonts = await count('fonts');
assert.equal(emoji, 1914, 'emoji rows');
assert.equal(symbols, 7775, 'symbol rows');
assert.equal(fonts, 1908, 'font rows');
ok(`emoji ${emoji}, symbols ${symbols}, fonts ${fonts}`);

const ready = (await db.query("select count(*)::int n from public.data_sources where status='ready'")).rows[0].n;
assert.equal(ready, 3, 'all three sources should be ready after a real sync');
ok('every source marked ready only after a real import');

console.log('\n2. second sync inserts nothing (idempotent)');
const second = await sync();
assert.match(second, /\+0 new/, `second sync must add nothing:\n${second}`);
assert.equal(await count('emoji_library'), emoji);
assert.equal(await count('symbols'), symbols);
assert.equal(await count('fonts'), fonts);
ok('re-running the scheduler is safe');

console.log('\n3. a crashed job is reclaimed, not left blocking');
await db.query(`
  insert into public.data_sync_jobs (source_id, status, mode, started_at, attempts)
  select id, 'running', 'full', now() - interval '90 minutes', 1
  from public.data_sources where slug = 'unicode-emoji-json'`);
const third = await sync('--source=unicode-emoji-json');
assert.match(third, /1\/1 source\(s\) ok/, `sync must proceed past a dead job:\n${third}`);
const abandoned = (await db.query(
  "select count(*)::int n from public.data_sync_jobs where status='failed' and error like 'abandoned%'",
)).rows[0].n;
assert.ok(abandoned >= 1, 'the stale job should be recorded as abandoned');
assert.equal((await db.query("select count(*)::int n from public.data_sync_jobs where status='running'")).rows[0].n, 0);
ok('stale running job reclaimed and recorded');

console.log('\n4. a failing source is retried, then marked failed with the real error');
await db.query('alter table public.emoji_library rename to emoji_library_hold');
let failedOutput;
try {
  failedOutput = await sync('--source=unicode-emoji-json', '--max-attempts=2');
} finally {
  await db.query('alter table public.emoji_library_hold rename to emoji_library');
}
assert.match(failedOutput, /FAILED/);
const failedJob = (await db.query(
  "select status, attempts, error from public.data_sync_jobs where status='failed' and error like '%unicode-emoji-json%' order by created_at desc limit 1",
)).rows[0];
assert.equal(failedJob.status, 'failed');
assert.equal(failedJob.attempts, 2, 'should have used both attempts');
assert.match(failedJob.error, /42P01/);
const errSource = (await db.query(
  "select status, last_error from public.data_sources where slug='unicode-emoji-json'",
)).rows[0];
assert.equal(errSource.status, 'error');
assert.match(errSource.last_error, /42P01/);
ok('bounded retries + real error preserved');

console.log('\n5. the source recovers once the cause is fixed');
const recovered = await sync('--source=unicode-emoji-json');
assert.match(recovered, /1\/1 source\(s\) ok/, recovered);
const after = (await db.query(
  "select status, last_error from public.data_sources where slug='unicode-emoji-json'",
)).rows[0];
assert.equal(after.status, 'ready');
assert.equal(after.last_error, null, 'the stale error must be cleared on recovery');
ok('returns to ready with the error cleared');

console.log('\n6. a later batch failure rolls back the whole standard source');
const catalogue = (await adaptEmoji()).rows;
const early = catalogue[0], late = catalogue.at(-1);
await db.query("update public.emoji_library set name='test out of date' where emoji=any($1)", [[early.emoji,late.emoji]]);
await db.query(`alter table public.emoji_library add constraint fail_late_test_batch check (emoji<>${pg.escapeLiteral(late.emoji)} or name='test out of date')`);
try {
  assert.match(await sync('--source=emoji','--max-attempts=1'),/FAILED/);
  assert.equal((await db.query('select name from public.emoji_library where emoji=$1',[early.emoji])).rows[0].name,'test out of date');
} finally { await db.query('alter table public.emoji_library drop constraint fail_late_test_batch'); }
const manual = await run('node',['scripts/import-data.mjs','--source=unicode-emoji'],{env:{...process.env,DATABASE_URL:URL_}});
assert.match(manual.stdout, /~2 updated/);
ok('manual and worker paths share atomic accounting across batches');

console.log('\n7. standard worker does not reclaim an unrelated library import');
await db.query(`insert into public.data_sync_jobs (source_id,status,mode,started_at,attempts)
  select id,'running','full',now()-interval '2 hours',1 from public.data_sources where slug='iconify-json'`);
assert.match(await sync('--source=fonts'),/1\/1 source\(s\) ok/);
assert.equal((await db.query("select j.status from public.data_sync_jobs j join public.data_sources s on s.id=j.source_id where s.slug='iconify-json'")).rows[0].status,'running');
ok('stale reclamation is confined to the requested standard sources');

await db.end();
console.log(`\nALL PASS — ${pass} checks passed`);
