import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {planLibrary,importLibrary} from '../scripts/import-library.mjs';
import {operatorConfig} from '../scripts/operator-database.mjs';
import {exportSync} from '../scripts/export-standard-sync.mjs';
import {importRows, SOURCES} from '../scripts/import-data.mjs';
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
  await db.exec("insert into public.symbols(symbol,title,category,is_active) values ('★','Hand curated','stars',false)");
  for (const [name,source] of Object.entries(SOURCES)) {
    const built=await source.adapt();
    const statement=await exportSync(name);
    await db.exec(statement);
    const counts=(await db.query(`select items_seen,items_inserted from public.data_sync_jobs j join public.data_sources s on s.id=j.source_id where s.slug=$1`,[source.slug])).rows[0];
    assert.equal(counts.items_seen,built.rows.length);
    assert.equal(counts.items_inserted,built.rows.length-(name==='symbols'?1:0));
    const again=await importRows(db,source.kind,{slug:source.slug,license:built.license},built.rows);
    assert.deepEqual(again,{inserted:0,updated:0,skipped:built.rows.length});
  }
  assert.deepEqual((await db.query("select title,is_active,source_id from public.symbols where symbol='★'")).rows,[{title:'Hand curated',is_active:false,source_id:null}]);
  // The optional hosted data transport must normalize the pinned blobs exactly
  // like the Node adapter. Supply the npm bytes locally, without networking.
  const transfer=sql('supabase/ops/sync-pinned-packages.sql');
  await db.exec('begin; create temp table bc_package_payload(source text primary key,doc jsonb not null) on commit drop');
  for(const [source,path] of [['unicode-emoji-json','unicode-emoji-json/data-by-emoji.json'],['google-fonts-metadata','google-font-metadata/data/api-response.json']]) {
    const bytes=readFileSync('node_modules/'+path);
    assert.ok(transfer.includes(createHash('sha256').update(bytes).digest('hex')),'SQL transport pins the installed npm bytes');
    await db.query('insert into pg_temp.bc_package_payload values ($1,$2)',[source,bytes.toString('utf8')]);
  }
  await db.exec(transfer.slice(transfer.indexOf('-- Data phase.')));
  assert.deepEqual((await db.query('select items_inserted,items_updated from public.data_sync_jobs order by finished_at desc limit 2')).rows,[{items_inserted:0,items_updated:0},{items_inserted:0,items_updated:0}]);
  await db.exec(sql('supabase/migrations/0010_library_import_provenance.sql'));
  // Stop between batches: counters and rows from batch one survive together.
  // The explicitly named job can resume with a different batch size, never a
  // different dataset/limit, and must not replay the already-committed prefix.
  {
    const plan=await planLibrary('colors',40,10), opts={limit:40,batch:10,budgetBytes:2**32};
    await db.query("update public.data_sources set endpoint='npm:fixture@0' where slug=$1",[plan.source]);
    await assert.rejects(importLibrary(db,'colors',plan,opts),/Missing or disabled source/);
    await db.query('update public.data_sources set endpoint=$2 where slug=$1',[plan.source,plan.endpoint]);
    let batches=0;
    const cut={query:(sql,p)=>{if(sql.startsWith('with incoming') && ++batches===2) throw Error('fixture interruption'); return db.query(sql,p);}};
    await assert.rejects(importLibrary(cut,'colors',plan,opts),/fixture interruption/);
    const {id,items_seen,status}=(await db.query("select id,items_seen,status from public.data_sync_jobs where status='failed' and items_seen=10")).rows[0];
    assert.equal(items_seen,10);assert.equal(status,'failed');
    await assert.rejects(importLibrary(db,'colors',{...plan,sha256:'0'.repeat(64)},{...opts,resumeJob:id}),/not resumable/);
    const result=await importLibrary(db,'colors',plan,{...opts,batch:7,resumeJob:id});
    assert.equal(result.inserted,40);assert.equal(result.skipped,0);assert.equal(result.job_id,id);
    assert.equal((await db.query('select attempts from public.data_sync_jobs where id=$1',[id])).rows[0].attempts,2);
    await assert.rejects(importLibrary(db,'colors',plan,{...opts,resumeJob:id}),/not resumable/);
  }
  for (const name of ['colors','icons','brands']) {
    const plan=await planLibrary(name,32,10);
    assert.equal(plan.rows,32);
    const opts={limit:32,batch:10,budgetBytes:2**32};
    await assert.rejects(importLibrary(db,name,plan,{...opts,budgetBytes:1024}),/budget/);
    const first=await importLibrary(db,name,plan,opts), again=await importLibrary(db,name,plan,opts);
    assert.equal(first.inserted,name==='colors'?0:32);assert.equal(again.inserted,0);assert.equal(again.skipped,32);
    assert.equal((await db.query('select status from public.data_sources where slug=$1',[plan.source])).rows[0].status,'never_synced');
  }
  assert.throws(()=>operatorConfig('postgres://user:example@db.invalid:5432/postgres'));
  assert.throws(()=>operatorConfig('postgres://user:example@db.jvpadtzfsuekixrquzjv.supabase.co/postgres?sslmode=disable'));
  await db.exec(sql('supabase/migrations/0011_synced_library_search.sql'));
  await db.exec("update public.data_sources set status='disabled' where slug='color-name-list'");
  await db.exec('set role anon');
  const search = (q,d,sort,time,id,limit) => db.query(
    'select * from public.search_library($1,$2,null,null,$3,$4,$5,$6)',[q,d,sort,time,id,limit]);
  const [emoji]=(await search('😀','emoji','relevance',null,null,1)).rows;
  assert.deepEqual([emoji.slug,emoji.preview,emoji.source_slug,emoji.verification_status],['grinning_face','😀','unicode-emoji-json','imported']);
  assert.ok(emoji.attribution);
  assert.equal((await search('ABeeZee','font','newest',null,null,1)).rows[0].source_slug,'google-fonts-metadata');
  assert.equal((await search('★','symbol','newest',null,null,5)).rows.length,0,'inactive curated symbol remains hidden');
  assert.equal((await search(null,'palette','newest',null,null,5)).rows.length,0,'disabled source stays out of search');
  for(const sort of ['relevance','newest','az']) {
    const expected=(await search('face','emoji',sort,null,null,21)).rows.map(r=>r.id);
    const ids=[]; let time=null,id=null;
    for(let i=0;i<3;i++) {
      const {rows}=await search('face','emoji',sort,time,id,7);
      ids.push(...rows.map(r=>r.id)); ({next_time:time,next_id:id}=rows.at(-1));
    }
    assert.deepEqual(ids,expected); assert.equal(new Set(ids).size,21);
  }

  for (const fn of ["search_global('catalogue')", "page_content('bio')"]) {
    assert.deepEqual((await db.query(`select body from public.${fn}`)).rows,[{body:'visible catalogue row'}]);
  }
  await assert.rejects(db.query('select * from public.data_sync_jobs'), e=>e.code==='42501');
  console.log('PASS: catalogue repair, idempotent standard and limited imports, budget guard, real provenance, RLS and paged guest search');
} finally { await db.close(); }
