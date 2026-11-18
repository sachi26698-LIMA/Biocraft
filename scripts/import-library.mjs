#!/usr/bin/env node
/**
 * BioCraft — library importer for the 2026 licensed content expansion.
 *
 * Reads three real, licensed npm packages and writes their records into the
 * library tables created by migration 0006 and extended by 0008/0010:
 *
 *   @iconify/json@2.2.558   → icon_library   (per-collection SPDX licence)
 *   simple-icons@16.38.0    → icon_library   (CC0-1.0 brand marks)
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
 *   For writes, inject DATABASE_URL and a confirmed BIOCRAFT_DB_BUDGET_MIB
 *   privately; plan a limited slice before attempting a full source.
 *
 * `--dry-run` (the default without DATABASE_URL) builds and validates every row
 * and prints real counts, but writes nothing.
 */

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
const DRY = has('dry-run') || !process.env.DATABASE_URL;
const LIMIT = opt('limit')===null ? null : Number(opt('limit'));
const BATCH = Number(opt('batch', '500'));

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
const PERMISSIVE = new Map([
  ['MIT', 'MIT'],
  ['Apache-2.0', 'Apache-2.0'],
  ['CC0-1.0', 'CC0-1.0'],
  ['CC-BY-4.0', 'CC-BY-4.0'],
  ['CC-BY-3.0', 'CC-BY-3.0'],
  ['BSD-3-Clause', 'BSD-3-Clause'],
  ['ISC', 'ISC'],
  ['Unlicense', 'Unlicense'],
  ['OFL-1.1', 'OFL-1.1'],
]);

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
  const licenceSkips = new Map();

  for (const { prefix, meta, collection } of iconifyCollections()) {
    const spdx = meta?.license?.spdx || meta?.license?.title || 'UNKNOWN';
    const mapped = PERMISSIVE.get(spdx);
    const icons = collection.icons || {};
    const aliases = collection.aliases || {};
    const count = Object.keys(icons).length + Object.keys(aliases).length;

    if (!mapped) {
      licenceSkips.set(spdx, (licenceSkips.get(spdx) || 0) + count);
      continue;
    }

    const width = collection.width || 24;
    const height = collection.height || 24;
    const setName = collection.info?.name || meta?.name || prefix;
    const attribution = `${setName} (${spdx}) via Iconify`;
    const rows = [];

    for (const [name, icon] of Object.entries(icons)) {
      if (limit !== null && written + rows.length >= limit) break;
      const body = icon.body;
      if (!body) continue;
      // Aliases resolve to another icon's geometry; skip them here and count them
      // as seen so the totals stay honest.
      const fp = fingerprint(['icon', prefix, name, body]);
      rows.push({
        slug: `${prefix}-${name}`.slice(0, 180),
        label: name.replace(/-/g, ' '),
        category: prefix,
        license_code: mapped,
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
    yield { rows, prefix, spdx: mapped, aliases: Object.keys(aliases).length, total: count };
    if (limit !== null && written >= limit) break;
  }
  yield { done: true, written, licenceSkips };
}

/** Simple Icons brand marks (CC0-1.0). */
function adaptSimpleIcons() {
  let pkg;
  try {
    pkg = require('simple-icons');
  } catch {
    return { available: false, reason: 'simple-icons absent', rows: [] };
  }
  const rows = [];
  for (const key of Object.keys(pkg)) {
    if (!/^si[A-Z]/.test(key)) continue;
    const s = pkg[key];
    if (!s || !s.path || !s.title) continue;
    rows.push({
      slug: `si-${s.slug}`.slice(0, 180),
      label: s.title,
      category: 'brand',
      license_code: 'CC0-1.0',
      source_slug: 'simple-icons',
      attribution: 'Simple Icons (CC0-1.0)',
      fingerprint: fingerprint(['brand', s.slug, s.path]),
      keywords: ['brand', s.title, s.slug, s.hex ? `#${s.hex}` : ''].filter(Boolean),
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="${s.path}"/></svg>`,
      language: null,
    });
  }
  return { available: true, rows };
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

const sources={icons:['iconify-json','icon'], brands:['simple-icons','icon'], colors:['color-name-list','palette']};
async function* batches(name,limit,batch) {
  if(name==='icons') {
    for await(const result of adaptIconify({limit})) {
      if(result.done) {yield {skipped_licences:Object.fromEntries(result.licenceSkips)};break;}
      for(let i=0;i<result.rows.length;i+=batch) yield {rows:result.rows.slice(i,i+batch)};
    }
  } else {
    const built=name==='brands'?adaptSimpleIcons():adaptColours();
    if(!built.available) throw new Error(built.reason);
    const n=limit===null?built.rows.length:Math.min(built.rows.length,limit);
    for(let i=0;i<n;i+=batch) yield {rows:built.rows.slice(i,Math.min(i+batch,n))};
  }
}

export async function planLibrary(name,limit=LIMIT,batch=BATCH) {
  let rows=0,payload_bytes=0,skipped_licences={};
  for await(const part of batches(name,limit,batch)) {
    if(part.skipped_licences) skipped_licences=part.skipped_licences;
    if(part.rows) {rows+=part.rows.length;payload_bytes+=Buffer.byteLength(JSON.stringify(part.rows));}
  }
  if(!rows) throw new Error(`No importable rows: ${name}`);
  // Conservative planning allowance, NOT a statement about the provider's plan.
  return {source:sources[name][0],rows,payload_bytes,estimated_growth_bytes:2*payload_bytes+2048*rows,skipped_licences};
}
const dbSize=async db=>Number((await db.query('select pg_database_size(current_database()) bytes')).rows[0].bytes);
export async function importLibrary(db,name,plan,{limit=LIMIT,batch=BATCH,budgetBytes}={}) {
  const [slug,kind]=sources[name];
  const src=(await db.query("select id from public.data_sources where slug=$1 and status<>'disabled'",[slug])).rows[0];
  if(!src) throw new Error(`Missing or disabled source: ${slug}`);
  const mode=limit===null?'full':'incremental';
  // Serialize budgeted library writers; two concurrent sources must not both
  // spend the same free space. Other DB users are outside this planning guard.
  const lockName='biocraft:library-import';
  const {rows:[lock]}=await db.query('select pg_try_advisory_lock(hashtext($1)) acquired',[lockName]);
  if(!lock.acquired) throw new Error(`Source already busy: ${slug}`);
  let job;
  try {
    if(!Number.isSafeInteger(budgetBytes) || budgetBytes < (await dbSize(db))+plan.estimated_growth_bytes) throw new Error('Confirmed database budget is insufficient');
    job=(await db.query("insert into public.data_sync_jobs(source_id,status,mode,started_at,attempts) values($1,'running',$2,now(),1) returning id",[src.id,mode])).rows[0].id;
    const sql=`${batchCtes(kind)} select a,c,n-a-c as skipped from counts`;
    let seen=0,inserted=0,updated=0,skipped=0;
    for await(const {rows} of batches(name,limit,batch)) {
      if(!rows) continue;
      const json=JSON.stringify(rows);
      if((await dbSize(db))+2*Buffer.byteLength(json)+2048*rows.length>budgetBytes) throw new Error('Confirmed database budget reached');
      // Checkpoint real counts with the batch. A failed import is resumable by
      // natural key and never reports a partially written source as fresh.
      await db.query('begin');
      if (!(await db.query("select id from public.data_sources where id=$1 and status<>'disabled' for update",[src.id])).rows.length) throw new Error('Source no longer enabled');
      const {rows:[r]}=await db.query(sql,[src.id,json]);
      seen+=rows.length; inserted+=r.a; updated+=r.c; skipped+=r.skipped;
      await db.query('update public.data_sync_jobs set items_seen=$2,items_inserted=$3,items_updated=$4,items_skipped=$5 where id=$1',[job,seen,inserted,updated,skipped]);
      await db.query('commit');
    }
    if(seen!==plan.rows) throw new Error('Source changed after preflight');
    await db.query('begin');
    await db.query("update public.data_sync_jobs set status='succeeded',finished_at=now() where id=$1",[job]);
    await db.query("insert into public.data_sync_logs(job_id,level,message) values($1,'info',$2)",[job,limit===null?'Full library sync completed':'Limited library batch completed']);
    if(limit===null) await db.query("update public.data_sources set status='ready',last_sync_at=now(),last_sync_count=$2,last_error=null where id=$1 and status<>'disabled'",[src.id,seen]);
    await db.query('commit');
    return {source:slug,rows:seen,inserted,updated,skipped,mode};
  } catch(error) {
    await db.query('rollback');
    if(job) {
      // No driver messages or connection details in public source metadata.
      const msg='Library sync did not complete';
      await db.query("update public.data_sync_jobs set status='failed',finished_at=now(),error=$2 where id=$1",[job,msg]);
      if(limit===null) await db.query("update public.data_sources set status='error',last_error=$2 where id=$1 and status<>'disabled'",[src.id,msg]);
    }
    throw error;
  } finally {await db.query('select pg_advisory_unlock(hashtext($1))',[lockName]);}
}

async function main() {
  const names=SOURCE==='all'?Object.keys(sources):[SOURCE];
  if(names.some(n=>!Object.hasOwn(sources,n)) || !Number.isSafeInteger(BATCH) || BATCH<1 || BATCH>5000 ||
    (LIMIT!==null && (!Number.isSafeInteger(LIMIT)||LIMIT<1))) throw new Error('Invalid source, limit or batch size');
  const plans=[];
  for(const name of names) { const plan=await planLibrary(name); plans.push(plan); log(JSON.stringify(plan)); }
  if(DRY) return;
  const budgetBytes=Number(process.env.BIOCRAFT_DB_BUDGET_MIB)*1024**2;
  if(!Number.isSafeInteger(budgetBytes)||budgetBytes<=0) throw new Error('Confirm your Supabase quota, then set BIOCRAFT_DB_BUDGET_MIB below the limit');
  const db=operatorClient();await db.connect();
  try {
    const used=await dbSize(db), projected=used+plans.reduce((n,p)=>n+p.estimated_growth_bytes,0);
    if(projected>budgetBytes) throw new Error(`Preflight stopped before any writes: estimated total ${Math.ceil(projected/1024**2)} MiB exceeds the confirmed budget`);
    for(let i=0;i<names.length;i++) log(JSON.stringify(await importLibrary(db,names[i],plans[i],{budgetBytes})));
  } finally {await db.end();}
}
if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href) main().catch(e=>{console.error('Library import failed:',e.message);process.exitCode=1;});
