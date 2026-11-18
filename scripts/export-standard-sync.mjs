// Credential-free transport for an operator using the Supabase SQL editor.
// Emits ONE atomic, re-runnable data sync. Nothing is written by this script.
// Example: node scripts/export-standard-sync.mjs symbols > /tmp/symbols.sql
import pg from 'pg';
import {pathToFileURL} from 'node:url';
import {SOURCES,validate} from './import-data.mjs';
import {batchCtes} from './standard-sync-sql.mjs';
const literal=pg.escapeLiteral;

// Compact lossless representation of the verified Unicode code-point sets.
// No generation from guessed Unicode blocks: the lockfile's UCD is the input.
function symbolInput(rows) {
  function ranges(category) {
    const ranges=[];
    for(const {sort_order:cp} of rows.filter(r=>r.category===category)) {
      if(ranges.at(-1)?.[1]===cp) ranges.at(-1)[1]++;
      else ranges.push([cp,cp+1]);
    }
    return literal('{'+ranges.map(([a,b])=>`[${a},${b})`).join(',')+'}');
  }
  return `select chr(cp) symbol,code title,category,code codepoints,cp sort_order
 from (values ('symbol',${ranges('symbol')}::int4multirange),('other-symbol',${ranges('other-symbol')}::int4multirange)) v(category,ranges)
 cross join lateral unnest(ranges) r cross join lateral generate_series(lower(r),upper(r)-1) cp
 cross join lateral (select 'U+'||upper(lpad(to_hex(cp),greatest(4,length(to_hex(cp))),'0')) code) u`;
}

export async function exportSync(name) {
  if(!Object.hasOwn(SOURCES,name)) throw new Error('Choose emoji, symbols or fonts');
  const {kind,adapt,slug}=SOURCES[name];
  const built=await adapt();
  if(!built.available) throw new Error(built.reason);
  const {clean,errors}=validate(kind,built.rows);
  if(!clean.length || errors.length) throw new Error('Source validation failed');
  const lookup=`(select id from public.data_sources where slug=${literal(slug)})`;
  let ctes=batchCtes(kind,{sourceId:lookup,license:literal(built.license),input:kind==='symbol'?symbolInput(clean):undefined});
  if (kind!=='symbol') ctes=ctes.replace('$3::jsonb',()=>literal(JSON.stringify(clean))+'::jsonb');
  return `begin;
set local lock_timeout='3s';
set local statement_timeout='60s';
do $$ begin
 if not exists (select 1 from public.data_sources where slug=${literal(slug)} and status<>'disabled' for update) then raise exception 'Source missing or disabled'; end if;
 if exists (select 1 from public.data_sync_jobs where source_id=${lookup} and status in ('queued','running')) then raise exception 'Source has an active sync'; end if;
end $$;
${ctes}, job as (
 insert into public.data_sync_jobs(source_id,status,mode,started_at,finished_at,attempts,items_seen,items_inserted,items_updated,items_skipped)
 select ${lookup},'succeeded','full',transaction_timestamp(),clock_timestamp(),1,n,a,c,n-a-c from counts returning id,source_id,items_seen,finished_at
), logged as (insert into public.data_sync_logs(job_id,level,message) select id,'info','Synced the pinned package catalogue' from job)
update public.data_sources s set status='ready',last_sync_at=j.finished_at,last_sync_count=j.items_seen,last_error=null from job j where s.id=j.source_id;
commit;`;
}
if (process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href) console.log(await exportSync(process.argv[2]));
