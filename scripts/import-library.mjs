#!/usr/bin/env node
/**
 * BioCraft — library importer for the 2026 licensed content expansion.
 *
 * Reads three real, licensed npm packages and writes their records into the
 * library tables created by migration 0006 and extended by 0008/0010:
 *
 *   @iconify/json@2.2.558   → icon_library   (per-collection SPDX licence)
 *   simple-icons@16.38.0    → icon_library   (per-mark declared licence; brand review still required)
 *   color-name-list@14.86.0 → color_palettes (MIT named colours)
 *
 * Design rules that are enforced in code, not just documented:
 *
 *  1. NOTHING IS INVENTED. Every row is derived from a field that exists in the
 *     upstream package. If a package is missing the source is reported
 *     unavailable and zero rows are written.
 *
 *  2. LICENCES ARE FILTERED, NOT ASSUMED. Iconify collections carry their own
 *     SPDX id (MIT, Apache-2.0, CC0-1.0, CC-BY-4.0, ... but also CC-BY-NC,
 *     CC-BY-SA and GPL). Only commercially-permissive ids are imported; the rest
 *     are counted and reported so the shortfall is visible.
 *
 *  3. DUPLICATES ARE IMPOSSIBLE. Every row carries a `fingerprint`
 *     (sha256 of the normalised content). Migration 0008 puts a UNIQUE index on
 *     it, so a duplicate is rejected by the database even if this script has a
 *     bug. Identical paths with distinct upstream names/sets remain distinct.
 *
 *  4. IT IS RESTARTABLE AND SAFE TO RE-RUN. Rows are upserted on
 *     (slug) / (fingerprint); re-running updates provenance and never duplicates.
 *
 *  5. IT STREAMS. Each collection is parsed, written and released before the next
 *     one is read, so importing 500k icons does not hold 500k rows in memory.
 *
 * Usage:
 *   node scripts/import-library.mjs --source=all --dry-run
 *   node scripts/import-library.mjs --source=icons --limit=20000 --dry-run
 *   For a stopped library job, pass --resume-job=<uuid> and the same source
 *   and --limit as before. The ordered input digest must match.
 *   For approved writes only, pass --apply and an explicit --source. Inject
 *   DATABASE_URL and a confirmed BIOCRAFT_DB_BUDGET_MIB
 *   privately; plan a limited slice before attempting a full source.
 *
 * `--dry-run` (the default even when DATABASE_URL is set) builds and validates every row
 * and prints real counts, but writes nothing.
 */

import policy from './library-import-policy.json' with {type:'json'};
import {operatorClient} from './operator-database.mjs';
import {batchCtes} from './standard-sync-sql.mjs';
import {pathToFileURL} from 'node:url';
import { createHash } from 'node:crypto';
import { readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const args = process.argv.slice(2);
const opt = (name, def = null) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : def;
};
const has = (name) => args.includes(`--${name}`);

const SOURCE = opt('source', 'all');
const APPLY = has('apply');
const LIMIT = opt('limit')===null ? null : Number(opt('limit'));
const BATCH = Number(opt('batch', '500'));
const RESUME = opt('resume-job');

const ICONIFY_DIR = 'node_modules/@iconify/json';
const log = (...a) => console.log(...a);

/* ------------------------------------------------------------------ licences */

/**
 * SPDX ids that permit commercial use and redistribution in a product.
 * Deliberately conservative: share-alike (CC-BY-SA) and non-commercial
 * (CC-BY-NC*) are excluded even though they are "open", because shipping them in
 * a commercial product changes the obligations. GPL is excluded for the same
 * reason. Anything not listed is counted as skipped and reported.
 */
const PERMISSIVE = new Set(policy.acceptedSpdx);
const sources = policy.sources;
const tally=(map,reason,n=1)=>map.set(reason,(map.get(reason)??0)+n);

/* ------------------------------------------------------------------- helpers */

/** Stable, collision-resistant content fingerprint used for dedupe (0008). */
function fingerprint(parts) {
  return createHash('sha256').update(parts.join('\u0000')).digest('hex');
}

/* -------------------------------------------------------------- source reads */

/** Iconify: one JSON file per collection. */
function* iconifyCollections() {
  const indexFile = `${ICONIFY_DIR}/collections.json`;
  if (!existsSync(indexFile)) throw new Error('Iconify package not available');
  const index = JSON.parse(readFileSync(indexFile, 'utf8'));
  for (const prefix of Object.keys(index)) {
    const file = `${ICONIFY_DIR}/json/${prefix}.json`;
    if (!existsSync(file)) throw new Error(`Missing Iconify collection: ${prefix}`);
    yield { prefix, meta: index[prefix], file, collection: JSON.parse(readFileSync(file, 'utf8')) };
  }
  return { available: true };
}

/* ------------------------------------------------------------------ adapters */

/**
 * Icons from Iconify. Yields {rows, skippedLicence, stats} per collection so the
 * caller can write and release each collection independently.
 */
async function* adaptIconify({ limit = null } = {}) {
  let written = 0;
  const licenceSkips = new Map(), reviewHolds = new Map();

  for (const { prefix, meta, collection } of iconifyCollections()) {
    const spdx = meta?.license?.spdx || 'UNKNOWN';
    const icons = collection.icons || {};
    const aliases = collection.aliases || {};
    const count = Object.keys(icons).length; // aliases have no independent geometry
    if (policy.reviewIconifyCategories.includes(meta.category) || policy.reviewIconifyPrefixes.includes(prefix)) {
      tally(reviewHolds,'brand collection, per-mark review required',count);
      continue;
    }

    if (!PERMISSIVE.has(spdx)) {
      tally(licenceSkips,spdx,count);
      continue;
    }

    const width = collection.width || 24;
    const height = collection.height || 24;
    const setName = collection.info?.name || meta?.name || prefix;
    if (!meta.author?.name || !meta.license?.url) {tally(reviewHolds,'incomplete attribution',count);continue;}
    const attribution = `${setName} by ${meta.author.name} (${spdx}: ${meta.license.url}) via Iconify`;
    const rows = [];

    for (const [name, icon] of Object.entries(icons)) {
      if (limit !== null && written + rows.length >= limit) break;
      const body = icon.body;
      if (!body) continue;
      const fp = fingerprint(['icon', prefix, name, body]);
      rows.push({
        // Iconify's canonical separator matters: `material-symbols:light-group`
        // and `material-symbols-light:group` are two different source records.
        slug: `${prefix}:${name}`,
        label: name.replace(/-/g, ' '),
        category: prefix,
        license_code: spdx,
        source_slug: 'iconify-json',
        attribution,
        fingerprint: fp,
        keywords: [prefix, setName, name],
        // Store the icon as a self-contained SVG. Delivery to the browser is via
        // the documented Iconify API in the app layer; the row is the source of
        // truth and is valid standalone.
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${icon.left ?? collection.left ?? 0} ${icon.top ?? collection.top ?? 0} ${icon.width ?? width} ${icon.height ?? height}">${body}</svg>`,
        language: null,
      });
    }

    written += rows.length;
    yield { rows, prefix, spdx, aliases: Object.keys(aliases).length, total: count };
    if (limit !== null && written >= limit) break;
  }
  yield { done: true, written, licenceSkips, reviewHolds };
}

/** The package is CC0, but individual marks are not necessarily CC0. */
function adaptSimpleIcons() {
  let pkg;
  try {
    pkg = require('simple-icons');
  } catch {
    return { available: false, reason: 'simple-icons absent', rows: [] };
  }
  const rows = [], licenceSkips=new Map(), reviewHolds=new Map();
  for (const s of Object.values(pkg)) {
    if (!s?.path || !s.title || !s.slug) continue;
    const spdx=s.license?.type || 'UNDECLARED';
    if (!PERMISSIVE.has(spdx)) {tally(licenceSkips,spdx);continue;}
    if (!s.source || !s.license.url) {tally(reviewHolds,'incomplete attribution');continue;}
    rows.push({
      slug: `si-${s.slug}`.slice(0, 180),
      label: s.title,
      category: 'brand',
      license_code: spdx,
      source_slug: 'simple-icons',
      attribution: `${s.title} via Simple Icons; source: ${s.source}; ${spdx}: ${s.license.url}${s.guidelines ? '; brand guidelines: '+s.guidelines : ''}`,
      fingerprint: fingerprint(['brand', s.slug, s.path]),
      keywords: ['brand', s.title, s.slug, s.hex ? `#${s.hex}` : ''].filter(Boolean),
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="${s.path}"/></svg>`,
      language: null,
    });
  }
  return { available: true, rows, licenceSkips, reviewHolds };
}

/** colour-name-list: named colours (MIT). */
function adaptColours() {
  const file = 'node_modules/color-name-list/dist/colornames.json';
  if (!existsSync(file)) return { available: false, reason: 'color-name-list absent', rows: [] };
  const parsed = JSON.parse(readFileSync(file, 'utf8'));
  const list = Array.isArray(parsed) ? parsed : parsed.default || [];
  const rows = [];
  const seen = new Set();
  for (const entry of list) {
    if (!entry || !entry.hex || !entry.name) continue;
    const hex = String(entry.hex).toLowerCase();
    // Hex values are unique upstream (asserted in the test); guard anyway.
    if (seen.has(hex)) continue;
    seen.add(hex);
    rows.push({
      slug: `color-${hex.replace('#', '')}`,
      title: entry.name,
      // A 2-colour swatch keeps the table's 2..12 check satisfied while the
      // canonical hex stays first. No invented "pairing": both entries are the
      // same measured colour, which is what a single named colour is.
      colors: [hex, hex],
      mood: 'named',
      language: null,
      license_code: 'MIT',
      source_slug: 'color-name-list',
      attribution: 'Color Name List (MIT)',
      fingerprint: fingerprint(['color', hex, entry.name.toLowerCase()]),
    });
  }
  return { available: true, rows };
}

/* -------------------------------------------------------------------- writes */

class ImportRefusal extends Error {} // Only deliberate, value-safe operator messages.
function packageEndpoint(name) {
  const pkg=sources[name].package,dir=`node_modules/${pkg}`;
  const pinned=JSON.parse(readFileSync('package-lock.json','utf8')).packages?.[dir]?.version;
  const installed=JSON.parse(readFileSync(`${dir}/package.json`,'utf8'));
  if(!pinned || installed.version!==pinned || installed.name!==pkg) throw new ImportRefusal('Installed package differs from the lockfile');
  return `npm:${pkg}@${pinned}`;
}
function validateSlice(name,limit,batch) {
  if(!Object.hasOwn(sources,name) || (limit!==null && (!Number.isSafeInteger(limit)||limit<1)) ||
     !Number.isSafeInteger(batch) || batch<1 || batch>5000) throw new ImportRefusal('Invalid source, limit or batch size');
}
async function* batches(name,limit,batch) {
  if(name==='icons') {
    for await(const result of adaptIconify({limit})) {
      if(result.done) {yield {skipped_licences:Object.fromEntries(result.licenceSkips),held_for_review:Object.fromEntries(result.reviewHolds)};break;}
      for(let i=0;i<result.rows.length;i+=batch) yield {rows:result.rows.slice(i,i+batch)};
    }
  } else {
    const built=name==='brands'?adaptSimpleIcons():adaptColours();
    if(!built.available) throw new ImportRefusal(built.reason);
    const n=limit===null?built.rows.length:Math.min(built.rows.length,limit);
    for(let i=0;i<n;i+=batch) yield {rows:built.rows.slice(i,Math.min(i+batch,n))};
    if(built.licenceSkips) yield {skipped_licences:Object.fromEntries(built.licenceSkips),held_for_review:Object.fromEntries(built.reviewHolds)};
  }
}

export async function planLibrary(name,limit=LIMIT,batch=BATCH) {
  validateSlice(name,limit,batch);
  const endpoint=packageEndpoint(name),digest=createHash('sha256');
  let rows=0,payload_bytes=0,skipped_licences={},held_for_review={};
  for await(const part of batches(name,limit,batch)) {
    if(part.skipped_licences) {skipped_licences=part.skipped_licences;held_for_review=part.held_for_review;}
    if(part.rows) {for(const row of part.rows) digest.update(JSON.stringify(row)).update('\n'); rows+=part.rows.length;payload_bytes+=Buffer.byteLength(JSON.stringify(part.rows));}
  }
  if(!rows) throw new ImportRefusal(`No importable rows: ${name}`);
  // Conservative planning allowance, NOT a statement about the provider's plan.
  return {source:sources[name].slug,endpoint,sha256:digest.digest('hex'),rows,payload_bytes,estimated_growth_bytes:2*payload_bytes+2048*rows,skipped_licences,held_for_review};
}
const dbSize=async db=>Number((await db.query('select pg_database_size(current_database()) bytes')).rows[0].bytes);
export async function importLibrary(db,name,plan,{limit=LIMIT,batch=BATCH,budgetBytes,resumeJob=null,onJob}={}) {
  validateSlice(name,limit,batch);
  const {slug,kind}=sources[name];
  if(!Number.isSafeInteger(budgetBytes)||budgetBytes<=0||plan?.source!==slug || plan.endpoint!==packageEndpoint(name) || !/^[a-f0-9]{64}$/.test(plan.sha256) ||
     !Number.isSafeInteger(plan.rows)||plan.rows<1 || !Number.isSafeInteger(plan.estimated_growth_bytes)||plan.estimated_growth_bytes<1) throw new ImportRefusal('Invalid budget or source preflight');
  const src=(await db.query("select id from public.data_sources where slug=$1 and endpoint=$2 and kind='package' and status<>'disabled'",[slug,plan.endpoint])).rows[0];
  if(!src) throw new ImportRefusal(`Missing or disabled source: ${slug}`);
  const mode=limit===null?'full':'incremental';
  // Serialize budgeted library writers; two concurrent sources must not both
  // spend the same free space. Other DB users are outside this planning guard.
  const lockName='biocraft:library-import';
  const {rows:[lock]}=await db.query('select pg_try_advisory_lock(hashtext($1)) acquired',[lockName]);
  if(!lock.acquired) throw new ImportRefusal(`Source already busy: ${slug}`);
  let job;
  try {
    const manifest={format:1,source:slug,endpoint:plan.endpoint,sha256:plan.sha256,rows:plan.rows,limit};
    let seen=0,inserted=0,updated=0,skipped=0;
    // The manifest and counters are private job metadata, not instructions from
    // a reader. Resume one explicitly named job, only for identical input.
    await db.query('begin');
    if(resumeJob) {
      const {rows:[prev]}=await db.query(`select j.items_seen,j.items_inserted,j.items_updated,j.items_skipped
        from public.data_sync_jobs j where j.id=$1 and j.source_id=$2 and j.mode=$3 and j.status in ('failed','running')
        and exists(select 1 from public.data_sync_logs l where l.job_id=j.id and l.message='Library input manifest' and l.detail=$4::jsonb)
        for update`,[resumeJob,src.id,mode,JSON.stringify(manifest)]);
      if(!prev) throw new ImportRefusal('Job is not resumable with this source, input and limit');
      ({items_seen:seen,items_inserted:inserted,items_updated:updated,items_skipped:skipped}=prev);
      if(seen>plan.rows || [seen,inserted,updated,skipped].some(n=>!Number.isSafeInteger(n)||n<0) || inserted+updated+skipped!==seen) throw new ImportRefusal('Invalid job checkpoint');
      let offset=seen, remainingBytes=0;
      for await(const part of batches(name,limit,batch)) {
        if(!part.rows) continue;
        const skip=Math.min(offset,part.rows.length);offset-=skip;
        if(skip<part.rows.length) {
          const tail=part.rows.slice(skip);
          remainingBytes+=2*Buffer.byteLength(JSON.stringify(tail))+2048*tail.length;
        }
      }
      if((await dbSize(db))+remainingBytes>budgetBytes) throw new ImportRefusal('Confirmed database budget is insufficient for remaining input');
      // A previous writer released its advisory lock. Do not clear other jobs
      // or mutate a source if admission fails, even when this row says running.
      await db.query(`update public.data_sync_jobs set status='running',attempts=attempts+1,finished_at=null,error=null where id=$1`,[resumeJob]);
    } else {
      if(budgetBytes < (await dbSize(db))+plan.estimated_growth_bytes) throw new ImportRefusal('Confirmed database budget is insufficient');
      const created=await db.query("insert into public.data_sync_jobs(source_id,status,mode,started_at,attempts) values($1,'running',$2,now(),1) returning id",[src.id,mode]);
      resumeJob=created.rows[0].id;
      await db.query("insert into public.data_sync_logs(job_id,level,message,detail) values($1,'info','Library input manifest',$2::jsonb)",[resumeJob,JSON.stringify(manifest)]);
    }
    await db.query('commit');job=resumeJob;onJob?.(job);
    const sql=`${batchCtes(kind)} select a,c,n-a-c as skipped from counts`;
    const digest=createHash('sha256');let prefix=seen;
    for await(const part of batches(name,limit,batch)) {
      if(!part.rows) continue;
      for(const row of part.rows) digest.update(JSON.stringify(row)).update('\n');
      const already=Math.min(prefix,part.rows.length); prefix-=already;
      const rows=part.rows.slice(already);if(!rows.length) continue;
      const json=JSON.stringify(rows);
      if((await dbSize(db))+2*Buffer.byteLength(json)+2048*rows.length>budgetBytes) throw new ImportRefusal('Confirmed database budget reached');
      // Checkpoint real counts with the batch. A failed import is resumable by
      // natural key and never reports a partially written source as fresh.
      await db.query('begin');
      if (!(await db.query("select id from public.data_sources where id=$1 and endpoint=$2 and status<>'disabled' for update",[src.id,plan.endpoint])).rows.length) throw new ImportRefusal('Source no longer enabled');
      const {rows:[r]}=await db.query(sql,[src.id,json]);
      seen+=rows.length; inserted+=r.a; updated+=r.c; skipped+=r.skipped;
      await db.query('update public.data_sync_jobs set items_seen=$2,items_inserted=$3,items_updated=$4,items_skipped=$5 where id=$1',[job,seen,inserted,updated,skipped]);
      await db.query('commit');
    }
    if(prefix!==0 || seen!==plan.rows || digest.digest('hex')!==plan.sha256) throw new ImportRefusal('Source changed after preflight');
    await db.query('begin');
    if (!(await db.query("select id from public.data_sources where id=$1 and endpoint=$2 and status<>'disabled' for update",[src.id,plan.endpoint])).rows.length) throw new ImportRefusal('Source no longer enabled');
    await db.query("update public.data_sync_jobs set status='succeeded',finished_at=now() where id=$1",[job]);
    await db.query("insert into public.data_sync_logs(job_id,level,message) values($1,'info',$2)",[job,limit===null?'Full library sync completed':'Limited library batch completed']);
    if(limit===null) await db.query("update public.data_sources set status='ready',last_sync_at=now(),last_sync_count=$2,last_error=null where id=$1 and status<>'disabled'",[src.id,seen]);
    await db.query('commit');
    return {job_id:job,source:slug,rows:seen,inserted,updated,skipped,mode};
  } catch(error) {
    await db.query('rollback');
    if(job) {
      // No driver messages or connection details in public source metadata.
      const msg='Library sync did not complete';
      await db.query("update public.data_sync_jobs set status='failed',finished_at=now(),error=$2 where id=$1",[job,msg]);
      if(limit===null) await db.query("update public.data_sources set status='error',last_error=$2 where id=$1 and endpoint=$3 and status<>'disabled'",[src.id,msg,plan.endpoint]);
    }
    throw error;
  } finally {await db.query('select pg_advisory_unlock(hashtext($1))',[lockName]);}
}

async function main() {
  const keys=args.map(a=>a.split('=',1)[0]);
  if(new Set(keys).size!==keys.length || args.some(a=>!/^--(?:apply|dry-run)$/.test(a) && !/^--(?:source|limit|batch|resume-job)=.+$/.test(a)))
    throw new ImportRefusal('Unknown or repeated library option');
  if(APPLY && (has('dry-run') || !opt('source') || !process.env.DATABASE_URL))
    throw new ImportRefusal('An approved write requires --apply, one explicit --source and a private writer; do not combine it with --dry-run');
  const names=SOURCE==='all'?Object.keys(sources):[SOURCE];
  if(RESUME!==null && (names.length!==1 || !/^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/i.test(RESUME))) throw new ImportRefusal('Resume requires one source and a job UUID');
  for(const name of names) validateSlice(name,LIMIT,BATCH);
  const plans=[];
  for(const name of names) { const plan=await planLibrary(name); plans.push(plan); log(JSON.stringify(plan)); }
  if(!APPLY) return;
  const budgetBytes=Number(process.env.BIOCRAFT_DB_BUDGET_MIB)*1024**2;
  if(!Number.isSafeInteger(budgetBytes)||budgetBytes<=0) throw new ImportRefusal('Confirm your Supabase quota, then set BIOCRAFT_DB_BUDGET_MIB below the limit');
  const db=operatorClient();await db.connect();
  try {
    const used=await dbSize(db), projected=used+plans.reduce((n,p)=>n+p.estimated_growth_bytes,0);
    if(!RESUME && projected>budgetBytes) throw new ImportRefusal(`Preflight stopped before any writes: estimated total ${Math.ceil(projected/1024**2)} MiB exceeds the confirmed budget`);
    for(let i=0;i<names.length;i++) log(JSON.stringify(await importLibrary(db,names[i],plans[i],{budgetBytes,resumeJob:RESUME,onJob:id=>log(JSON.stringify({running_job:id}))})));
  } finally {await db.end();}
}
if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href) main().catch(e=>{
  // Never print a driver message (may contain connection or source values).
  console.error('Library import failed:',e instanceof ImportRefusal?e.message:'Check the private writer, package installation and job status.');process.exitCode=1;
});
