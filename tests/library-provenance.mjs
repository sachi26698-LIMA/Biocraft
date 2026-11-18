/**
 * BioCraft — migration 0008 (provenance, fingerprints, cross-domain search).
 *
 * Runs the REAL migration files against a throwaway in-process Postgres (PGlite).
 * No production data, no hand-copied schema: the SQL under test is the file that
 * will be applied.
 *
 * Proves by assertion:
 *   1. 0001..0008 apply from empty
 *   2. re-applying 0006+0008 is idempotent and preserves every row
 *   3. every catalogue table gained the provenance columns
 *   4. the fingerprint unique index really rejects a duplicate
 *   5. search_library returns stored rows, filters, and clamps an absurd limit
 *   6. anon may execute the read functions and still cannot write
 */
import { readFileSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
import { pg_trgm } from '@electric-sql/pglite/contrib/pg_trgm';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';

let pass = 0, fail = 0;
const ok = (name, cond, extra = '') => {
  if (cond) { pass++; console.log(`  PASS  ${name}`); }
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
];

const db = new PGlite({ extensions: { pg_trgm, pgcrypto } });
await db.exec(`
  create role anon nologin;
  create role authenticated nologin;
  create role service_role nologin bypassrls;
  create schema if not exists auth;
  create or replace function auth.uid() returns uuid language sql stable as $$ select null::uuid $$;
`);

section('1. migrations apply from an empty database');
for (const f of FILES) {
  try {
    await db.exec(readFileSync(f, 'utf8'));
    ok(f.split('/').pop(), true);
  } catch (e) {
    ok(f.split('/').pop(), false, e.message.slice(0, 300));
    process.exit(1);
  }
}

section('2. re-applying the migrations is idempotent');
// Seed content, then re-run the two migrations that a deployment may replay.
await db.exec(`
  insert into public.data_sources (slug,name,provider,kind,license_code,status)
  values ('test-src','Test','test','package','MIT','never_synced') on conflict (slug) do nothing;
  insert into public.icon_library (slug,label,category,license_code,fingerprint)
  values ('a-icon','A Icon','general','MIT','fp-a') on conflict (slug) do nothing;
`);
const before = (await db.query('select count(*)::int as n from public.icon_library')).rows[0].n;
for (const f of ['supabase/migrations/0006_global_content_intelligence.sql',
                 'supabase/migrations/0008_library_provenance_and_search.sql']) {
  try { await db.exec(readFileSync(f, 'utf8')); ok(`replay ${f.split('/').pop()}`, true); }
  catch (e) { ok(`replay ${f.split('/').pop()}`, false, e.message.slice(0, 300)); }
}
const after = (await db.query('select count(*)::int as n from public.icon_library')).rows[0].n;
ok('existing rows preserved across replay', before === after && after === 1, `${before} -> ${after}`);

section('3. provenance columns exist on every catalogue table');
const TABLES = ['icon_library', 'color_palettes', 'design_templates', 'design_presets',
                'fonts', 'symbols', 'emoji_collections'];
for (const t of TABLES) {
  const cols = (await db.query(
    `select column_name from information_schema.columns
      where table_schema='public' and table_name=$1
        and column_name in ('language','attribution','fingerprint','verified_at','verification_status')`,
    [t])).rows.map((r) => r.column_name).sort();
  ok(`${t} provenance`, cols.length === 5, cols.join(','));
}

section('4. duplicate fingerprints are rejected by the database');
let dupRejected = false;
try {
  await db.query(`insert into public.icon_library (slug,label,category,license_code,fingerprint)
                  values ('b-icon','B Icon','general','MIT','fp-a')`);
} catch (e) {
  dupRejected = /duplicate key|unique/i.test(e.message);
}
ok('duplicate fingerprint rejected', dupRejected);

// A second NULL fingerprint must still be allowed (legacy/hand-authored rows).
let nullOk = true;
try {
  await db.query(`insert into public.icon_library (slug,label,category,license_code)
                  values ('c-icon','C Icon','general','MIT')`);
  await db.query(`insert into public.icon_library (slug,label,category,license_code)
                  values ('d-icon','D Icon','general','MIT')`);
} catch (e) { nullOk = false; }
ok('NULL fingerprints coexist', nullOk);

let badStatusRejected = false;
try {
  await db.query(`insert into public.icon_library (slug,label,category,license_code,verification_status)
                  values ('e-icon','E','general','MIT','rumoured')`);
} catch (e) { badStatusRejected = /check|constraint/i.test(e.message); }
ok('unknown verification_status rejected', badStatusRejected);

section('5. search_library reads stored rows and clamps the page size');
const res = await db.query(`select * from public.search_library(null,'icon',null,null,'newest',null,null,100000)`);
const limitRow = (await db.query(`select value from public.app_limits where key='search_page_max'`)).rows[0];
ok('icon domain returns rows', res.rows.length > 0, `rows=${res.rows.length}`);
ok('page size clamped to app_limits',
   res.rows.length <= Number(limitRow.value),
   `returned=${res.rows.length} max=${limitRow.value}`);
ok('search returns provenance fields',
   res.rows.every((r) => 'license_code' in r && 'verification_status' in r));

const filtered = await db.query(`select * from public.search_library('D Icon','icon',null,null,'newest',null,null,50)`);
ok('text filter narrows results', filtered.rows.length === 1, `rows=${filtered.rows.length}`);

const noMatch = await db.query(`select * from public.search_library('zzz-no-such-icon','icon',null,null,'newest',null,null,50)`);
ok('unmatched query returns nothing (not filler)', noMatch.rows.length === 0);

const all = await db.query(`select * from public.search_library(null,null,null,null,'newest',null,null,100000)`);
ok('domain=null searches every library', all.rows.length >= res.rows.length);

section('6. public can read, public cannot write');
await db.exec(`set role anon`);
let anonRead = true, anonWrite = false;
try { await db.query(`select * from public.search_library(null,null,null,null,'newest',null,null,5)`); }
catch { anonRead = false; }
ok('anon may execute search_library', anonRead);
try {
  await db.query(`insert into public.icon_library (slug,label,category,license_code) values ('x','X','general','MIT')`);
  anonWrite = true;
} catch { anonWrite = false; }
ok('anon cannot insert into icon_library', !anonWrite);
await db.exec(`reset role`);

section('7. licences and sources required by the new importers exist');
const lic = (await db.query(`select code from public.content_licenses where code in ('MIT','Apache-2.0','CC0-1.0','CC-BY-4.0','OFL-1.1')`)).rows.map((r) => r.code).sort();
ok('required licences present', lic.length === 5, lic.join(','));
const src = (await db.query(`select slug,status from public.data_sources where slug in ('iconify-json','color-name-list','simple-icons')`)).rows;
ok('new sources registered', src.length === 3, src.map((r) => r.slug).join(','));
ok('new sources start as never_synced (not pre-labelled active)',
   src.every((r) => r.status === 'never_synced'));

console.log(`\n${pass} checks passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
