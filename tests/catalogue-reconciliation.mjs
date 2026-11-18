import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PGlite} from '@electric-sql/pglite';
import {pg_trgm} from '@electric-sql/pglite/contrib/pg_trgm';
import {pgcrypto} from '@electric-sql/pglite/contrib/pgcrypto';
const db = new PGlite({extensions:{pgcrypto,pg_trgm}});
const sql = file => readFileSync(file, 'utf8');
try {
  await db.exec(`create role anon; create role authenticated; create role service_role;
    create schema auth; create function auth.uid() returns uuid language sql as $$select null::uuid$$;`);
  for (const file of ['0001_initial_schema','0002_rls_policies','0004_stable_bio_pagination','0005_infinite_expansion_limits','0006_global_content_intelligence','0007_library_read_api','0008_library_provenance_and_search']) {
    await db.exec(sql(`supabase/migrations/${file}.sql`));
  }
  // Reproduce the observed split-migration drift, on a disposable DB only.
  await db.exec(`delete from public.data_sources where slug in ('unicode-emoji-json','unicode-15.1','google-fonts-metadata');
    drop function public.search_global(text,text,text,integer,integer); drop function public.page_content(text,text,text,uuid,integer);
    insert into public.bios(content,language,is_active) values ('visible catalogue row','en',true),('unpublished','en',false);
    delete from public.global_content where not is_active;
    update public.global_content set source_created_at='2000-01-01';`);
  const [before] = (await db.query('select jsonb_agg(to_jsonb(b) order by id) rows from public.bios b')).rows;
  for (let i=0;i<2;i++) {
    await db.exec(sql('supabase/migrations/0009_reconcile_catalogue_sync.sql'));
    await db.exec(sql('supabase/ops/sync-catalogue.sql'));
    const [job] = (await db.query('select items_seen,items_inserted,items_updated,items_skipped from public.data_sync_jobs order by finished_at desc limit 1')).rows;
    assert.deepEqual(job, {items_seen:2,items_inserted:i===0?1:0,items_updated:i===0?1:0,items_skipped:i===0?0:2});
  }
  assert.deepEqual((await db.query('select jsonb_agg(to_jsonb(b) order by id) rows from public.bios b')).rows[0],before);
  assert.equal((await db.query("select count(*)::int n from public.data_sources where status='never_synced'")).rows[0].n,6);
  await db.exec('set role anon');
  for (const fn of ["search_global('catalogue')", "page_content('bio')"]) {
    assert.deepEqual((await db.query(`select body from public.${fn}`)).rows,[{body:'visible catalogue row'}]);
  }
  await assert.rejects(db.query('select * from public.data_sync_jobs'), e=>e.code==='42501');
  console.log('PASS: drift repair, repeat sync counts, preserved source rows, RLS and both guest RPCs');
} finally { await db.close(); }
