/**
 * BioCraft — full-scale library import test.
 *
 * Proves on a DISPOSABLE PostgreSQL (PGlite, in-memory, thrown away) that the real
 * importers work at the scale the specification asks for:
 *
 *   1. every migration applies cleanly
 *   2. the icon importer writes a large real slice of @iconify/json without error
 *   3. a second run inserts nothing new (idempotent) — real duplicate counts, not a claim
 *   4. the fingerprint unique index means zero duplicate content rows exist
 *   5. re-running a *third* time after a deliberate change updates instead of duplicating
 *   6. per-mark licences, source and brand guidelines survive the write
 *   7. keyset pagination over the imported set returns every row exactly once
 *
 * Nothing here touches the shared database.
 */
import { readFileSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
import { pg_trgm } from '@electric-sql/pglite/contrib/pg_trgm';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';
import { execFileSync, spawnSync } from 'node:child_process';

let pass = 0, fail = 0;
const ok = (name, cond, extra = '') => {
  if (cond) { pass++; console.log(`  PASS  ${name}${extra ? ' — ' + extra : ''}`); }
  else { fail++; console.log(`  FAIL  ${name}${extra ? ' — ' + extra : ''}`); }
};
const section = (t) => console.log(`\n${t}`);

const FILES = [
  'supabase/migrations/0001_initial_schema.sql',
  'supabase/migrations/0002_rls_policies.sql',
  'supabase/migrations/0004_stable_bio_pagination.sql',
  'supabase/migrations/0005_infinite_expansion_limits.sql',
  'supabase/migrations/0006_global_content_intelligence.sql',
  'supabase/migrations/0008_library_provenance_and_search.sql',
  'supabase/migrations/0010_library_import_provenance.sql',
];

const db = new PGlite({ extensions: { pg_trgm, pgcrypto } });
await db.exec(`
  create role anon nologin;
  create role authenticated nologin;
  create role service_role nologin bypassrls;
  create schema if not exists auth;
  create or replace function auth.uid() returns uuid language sql stable as $$ select null::uuid $$;
`);
section('1. migrations');
for (const f of FILES) {
  try { await db.exec(readFileSync(f, 'utf8')); ok(f.split('/').pop(), true); }
  catch (e) { ok(f.split('/').pop(), false, e.message.slice(0, 200)); process.exit(1); }
}

// Check the real CLI report and exported writer, not a copy of its SQL.
const {planLibrary,importLibrary} = await import('../scripts/import-library.mjs');
const run = (source, limit) => {
  const out = execFileSync('node',
    ['scripts/import-library.mjs', `--source=${source}`, '--dry-run', ...(limit ? [`--limit=${limit}`] : [])],
    { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  const line = out.trim().split('\n').filter((l) => l.startsWith('{')).pop();
  return JSON.parse(line);
};

section('2. importer produces real rows (CLI, dry run)');
const brandReport = run('brands');
const {createRequire}=await import('node:module');
const marks=Object.values(createRequire(import.meta.url)('simple-icons')).filter(s=>s?.path && s.slug && s.title);
const codes=new Set(['MIT','Apache-2.0','CC0-1.0','CC-BY-4.0','CC-BY-3.0','BSD-3-Clause','ISC','Unlicense','OFL-1.1']);
const eligible=marks.filter(s=>codes.has(s.license?.type) && s.source && s.license.url);
ok('only marks with an individually declared permitted licence qualify',eligible.length>0 && brandReport.rows===eligible.length && marks.length===brandReport.rows+Object.values(brandReport.skipped_licences).reduce((a,b)=>a+b,0));
ok('absent and noncommercial licences are not labelled CC0',brandReport.skipped_licences.UNDECLARED===marks.filter(s=>!s.license).length && brandReport.skipped_licences['CC-BY-NC-4.0']>0);
// A DSN and budget by themselves are not write authorization. Never use the
// operator's real environment for these CLI admission tests.
const cliArgs=(extra)=>spawnSync(process.execPath,['scripts/import-library.mjs',...extra],{encoding:'utf8',env:{...process.env,DATABASE_URL:'not-a-real-dsn',BIOCRAFT_DB_BUDGET_MIB:'10'}});
ok('writer credentials alone still produce only a dry-run',cliArgs(['--source=colors','--limit=1']).status===0);
ok('mistyped dry-run and conflicting write options are rejected',cliArgs(['--source=colors','--dr-run']).status===1 && cliArgs(['--source=colors','--apply','--dry-run']).status===1);
const colorReport = run('colors');
ok('colour name count is real', colorReport.rows === 32004, `rows=${colorReport.rows}`);

section('3. bulk icon write at scale');
const TARGET=20000,opts={limit:TARGET,batch:500,budgetBytes:2**32};
const plan=await planLibrary('icons',TARGET,500);
ok('built the requested slice',plan.rows===TARGET);
const t0=Date.now(),first=await importLibrary(db,'icons',plan,opts),ms=Date.now()-t0;
ok('first run inserts the entire slice',first.inserted===TARGET,`inserted=${first.inserted}`);
const count1 = (await db.query('select count(*)::int n from public.icon_library')).rows[0].n;
ok('row count matches inserts', count1 === first.inserted, `count=${count1}`);
console.log(`  (${ms} ms for ${first.inserted} rows on disposable PGlite)`);

section('4. re-running is idempotent');
const second = await importLibrary(db,'icons',plan,opts);
ok('second run inserted nothing', second.inserted === 0, `inserted=${second.inserted}`);
ok('second run reported every row as duplicate', second.skipped === TARGET && second.updated===0, `skipped=${second.skipped}`);
const count2 = (await db.query('select count(*)::int n from public.icon_library')).rows[0].n;
ok('row count unchanged', count2 === count1, `${count1} -> ${count2}`);

section('5. the database itself rejects duplicate fingerprints');
const [dup]=(await db.query('select slug,fingerprint from public.icon_library order by id limit 1')).rows;
await db.query("update public.icon_library set label='fixture stale label' where slug=$1",[dup.slug]);
const third=await importLibrary(db,'icons',plan,opts);
ok('changed metadata updates once without duplicating',third.updated===1 && third.inserted===0 && third.skipped===TARGET-1);
let rejected = false;
try {
  await db.query(
    `insert into public.icon_library (slug,label,category,license_code,fingerprint)
     values ('forced-dup','Forced','x','MIT',$1)`, [dup.fingerprint]);
} catch (e) { rejected = /duplicate key|unique/i.test(e.message); }
ok('unique fingerprint index rejects reused content', rejected);

const dupes = (await db.query(
  `select count(*)::int n from (
     select fingerprint from public.icon_library where fingerprint is not null
     group by fingerprint having count(*) > 1) d`)).rows[0].n;
ok('zero duplicate fingerprints stored', dupes === 0, `groups=${dupes}`);

section('6. provenance is complete on every imported row');
const missing = (await db.query(
  `select count(*)::int n from public.icon_library
    where license_code is null or source_id is null or fingerprint is null
       or attribution is null or verification_status is null`)).rows[0].n;
ok('no row lacks licence/source/fingerprint/attribution/status', missing === 0, `missing=${missing}`);
const verified = (await db.query(
  `select count(*)::int n from public.icon_library where verification_status='verified'`)).rows[0].n;
ok('nothing is falsely marked verified', verified === 0, `verified=${verified}`);

section('7. keyset pagination covers every row exactly once');
// Walk the whole table in pages using the same cursor shape the app uses.
const total = (await db.query('select count(*)::int n from public.icon_library')).rows[0].n;
let seen = 0, cursorTime = null, cursorId = null, pages = 0;
const ids = new Set();
for (;;) {
  const page = await db.query(
    `select id, created_at::text as t from public.icon_library
      where ($1::timestamptz is null or (created_at, id) > ($1::timestamptz, $2::uuid))
      order by created_at, id limit 500`,
    [cursorTime, cursorId]);
  if (!page.rows.length) break;
  pages++;
  for (const r of page.rows) { ids.add(r.id); seen++; }
  cursorTime = page.rows[page.rows.length - 1].t;
  cursorId = page.rows[page.rows.length - 1].id;
  if (pages > 500) break;
}
ok('paged walk saw every row', seen === total, `seen=${seen} total=${total}`);
ok('no row returned twice', ids.size === seen, `unique=${ids.size}`);

section('8. search_library works over the imported set');
const s1 = await db.query(`select * from public.search_library(null,'icon',null,null,'newest',null,null,50)`);
ok('icon search returns a clamped page', s1.rows.length === 50, `rows=${s1.rows.length}`);
const s2 = await db.query(`select * from public.search_library('account','icon',null,null,'newest',null,null,10)`);
ok('text search matches imported labels', s2.rows.length > 0, `rows=${s2.rows.length}`);
ok('search carries attribution and licence',
   s2.rows.every((r) => r.license_code && r.attribution));

section('9. individual brand provenance and package pin');
await importLibrary(db,'brands',brandReport,{batch:500,limit:null,budgetBytes:2**32});
const marksInDb=(await db.query("select i.slug,i.license_code,i.attribution from public.icon_library i join public.data_sources s on i.source_id=s.id where s.slug='simple-icons'")).rows;
const bySlug=new Map(eligible.map(s=>['si-'+s.slug,s]));
ok('every imported brand points to its own licence and source, not the package grant',marksInDb.length===eligible.length && marksInDb.every(r=>{
 const item=bySlug.get(r.slug);return item && item.license.type===r.license_code && r.attribution.includes(item.source) && r.attribution.includes(item.license.url) && (!item.guidelines || r.attribution.includes(item.guidelines));
}));
console.log(`\n${pass} checks passed, ${fail} failed`);
await db.close();
process.exit(fail === 0 ? 0 : 1);
