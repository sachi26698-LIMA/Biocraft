// Real pinned inputs, real importer, fresh socket-only PostgreSQL. Never accept
// a DATABASE_URL for this test. Size/timing results are local, not hosted quota.
import assert from 'node:assert/strict';
import {readFileSync,realpathSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import pg from 'pg';
import {planLibrary,importLibrary} from '../scripts/import-library.mjs';
const socket=realpathSync(process.env.BIOCRAFT_TEST_PG_SOCKET);
assert(socket.startsWith('/tmp/biocraft-pg-'));
const user=process.env.USER;
const dbName='biocraft_sync_test_scale';
const root=new pg.Client({host:socket,user,database:'postgres'});
await root.connect();
try {
  const {rows:[{data}]}=await root.query("select current_setting('data_directory') data");
  assert.equal(readFileSync(`${data}/BIOCRAFT_TEST_ONLY`,'utf8'),'Local disposable Biocraft test cluster only\n');
} finally {await root.end();}
execFileSync(process.execPath,['tests/sync-bootstrap.mjs'],{env:{...process.env,TEST_PG_SOCKET:socket,TEST_DB_NAME:dbName,TEST_PG_USER:user}});
const db=new pg.Client({host:socket,user,database:dbName}); await db.connect();
try {
  const limit=Number(process.env.BIOCRAFT_SCALE_ROWS || 200_000), batch=500;
  assert(Number.isSafeInteger(limit)&&limit>0&&limit<=500_000);
  const plan=await planLibrary('icons',limit,batch);assert.equal(plan.rows,limit);
  const opts={batch,limit,budgetBytes:6*1024**3}; // disposable DB only
  const started=Date.now();
  const first=await importLibrary(db,'icons',plan,opts);
  const written=Date.now();
  assert.equal(first.inserted,limit);assert.equal(first.skipped,0);
  const repeat=await importLibrary(db,'icons',plan,opts);
  assert.equal(repeat.inserted,0);assert.equal(repeat.updated,0);assert.equal(repeat.skipped,limit);
  const repeated=Date.now();
  const {rows:[counts]}=await db.query(`select count(*)::int n,count(distinct fingerprint)::int unique_n,
    count(*) filter(where license_code is null or source_id is null or attribution is null)::int unlicensed from public.icon_library`);
  assert.deepEqual(counts,{n:limit,unique_n:limit,unlicensed:0});
  assert.equal((await db.query("select status from public.data_sources where slug='iconify-json'")).rows[0].status,'never_synced');
  await db.query('set role anon');
  let cursor=null,seen=0,pages=0;
  for(;;){
    const {rows}=await db.query('select id from public.icon_library where is_active and ($1::uuid is null or id>$1) order by id limit 1000',[cursor]);
    if(!rows.length)break;
    for(const {id} of rows){assert(cursor===null||id>cursor);cursor=id;seen++;} pages++;
  }
  assert.equal(seen,limit);
  await db.query('reset role');
  console.log('PASS disposable library scale:',JSON.stringify({rows:limit,inserted:first.inserted,repeat_skipped:repeat.skipped,unique:counts.unique_n,missing_provenance:0,guest_pages:pages,first_ms:written-started,repeat_ms:repeated-written,database_bytes:(await db.query('select pg_database_size(current_database()) n')).rows[0].n}));
} finally {await db.end();}
