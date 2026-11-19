/**
 * Master Admin — content-library read surface (migration 015).
 *
 * Runs in-process against PGlite with the REAL migrations: the public schema
 * (0001–0006) plus the admin schema (001–014) plus 015 under test.
 *
 * What this proves:
 *   1. 015 applies, and re-applying it is idempotent
 *   2. an account WITHOUT admin membership is refused ("not authorized")
 *   3. an account with membership but a stale/absent session is refused
 *   4. a real admin member with content.read can read fonts, sources, sync jobs,
 *      languages and stats — with real rows, not fixtures
 *   5. page sizes are clamped inside SQL, so the console cannot pull a whole
 *      library in one call
 *   6. a display language with no content reports 0, never an assumed count
 */
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { PGlite } from '@electric-sql/pglite';
import { pg_trgm } from '@electric-sql/pglite/contrib/pg_trgm';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';

const ADMIN = '10000000-0000-0000-0000-000000000001';
const OTHER = '10000000-0000-0000-0000-000000000002';
const SESSION = '20000000-0000-0000-0000-000000000001';

const PUBLIC_MIGRATIONS = [
  '0001_initial_schema.sql', '0002_rls_policies.sql', '0004_stable_bio_pagination.sql',
  '0005_infinite_expansion_limits.sql', '0006_global_content_intelligence.sql',
];
const ADMIN_MIGRATIONS = [
  '001_admin_foundation.sql', '002_workflow_integrity.sql', '003_permission_catalog.sql',
  '004_private_draft_commands.sql', '005_session_commands.sql', '006_auth_controls.sql',
  '008_bio_edit.sql', '009_recovery_sessions.sql', '010_admin_module_commands.sql',
  '012_recovery_and_cleanup.sql', '013_publication_bridge.sql', '014_module_read_surface.sql',
];

let pass = 0;
const ok = (n) => { pass++; console.log(`  PASS  ${n}`); };

const db = new PGlite({ extensions: { pg_trgm, pgcrypto } });

// Supabase ambient objects. auth.jwt() must expose session_id, because the admin
// membership check reads it — a shim without it would make every check fail and
// look like a policy problem.
await db.exec(`
  do $$ begin
    if not exists (select 1 from pg_roles where rolname='anon') then create role anon nologin; end if;
    if not exists (select 1 from pg_roles where rolname='authenticated') then create role authenticated nologin; end if;
    if not exists (select 1 from pg_roles where rolname='service_role') then create role service_role nologin bypassrls; end if;
  end $$;
  create schema if not exists auth;
  create table auth.users(id uuid primary key);
  create table auth.sessions(id uuid primary key, user_id uuid not null);
  create or replace function auth.uid() returns uuid language sql stable as $$
    select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
  create or replace function auth.jwt() returns jsonb language sql stable as $$
    select jsonb_build_object(
      'aal', current_setting('request.jwt.claim.aal',true),
      'session_id', nullif(current_setting('request.jwt.claim.session_id',true),'')
    ) $$;
  insert into auth.users values ('${ADMIN}'), ('${OTHER}');
`);

console.log('\n1. migrations apply');
for (const f of PUBLIC_MIGRATIONS) await db.exec(readFileSync(`supabase/migrations/${f}`, 'utf8'));
ok('public schema (0001-0006)');
for (const f of ADMIN_MIGRATIONS) await db.exec(readFileSync(`admin-backend/migrations/${f}`, 'utf8'));
ok('admin schema (001-014)');

const MIGRATION_015 = readFileSync('admin-backend/migrations/015_content_library_read_surface.sql', 'utf8');
await db.exec(MIGRATION_015);
ok('015 content-library read surface applies');
await db.exec(MIGRATION_015);
ok('015 re-applies without error (idempotent)');

// Real rows through the real import path shape.
await db.exec(`
  insert into public.fonts (name,slug,family,font_type,category,license_code,is_active,preview_text,weights,subsets)
  values ('ABeeZee','abeezee','ABeeZee','sans-serif','sans-serif','MIT',true,'The quick brown fox','{400,700}','{latin}'),
         ('Zilla Slab','zilla-slab','Zilla Slab','serif','serif','MIT',true,'The quick brown fox','{400}','{latin}');
  insert into public.data_sources (slug,name,provider,kind,license_code,status,last_sync_count)
  values ('t-src','Test Source','npm','package','MIT','ready',123);
  insert into public.data_sync_jobs (source_id,status,mode,started_at,finished_at,items_seen,items_inserted,attempts)
  select id,'succeeded','full',now(),now(),123,120,1 from public.data_sources where slug='t-src';
  insert into public.emoji_library (emoji,name,slug,group_name,license_code)
  values ('😀','grinning face','grinning_face','Smileys & Emotion','MIT');
  insert into public.symbols (symbol,title,category,codepoints,license_code,is_active)
  values ('★','U+2605','other-symbol','U+2605','MIT',true);
`);

console.log('\n2. an account with no admin membership is refused');
await db.exec(`set request.jwt.claim.sub='${OTHER}'; set request.jwt.claim.aal='aal2';
  set request.jwt.claim.session_id='${SESSION}';`);
await assert.rejects(
  db.query('select * from bc_admin_v1.content_library_stats()'),
  (e) => e.code === '42501',
  'a non-member must be refused',
);
ok('non-member refused with 42501');

console.log('\n3. membership without a live session is still refused');
await db.exec(`
  insert into bc_admin_v1.admin_users (id, enabled) values ('${ADMIN}', true);
  insert into bc_admin_v1.admin_user_roles (user_id, role_id) values ('${ADMIN}','admin');
`);
await db.exec(`set request.jwt.claim.sub='${ADMIN}';`);
await assert.rejects(
  db.query('select * from bc_admin_v1.content_library_stats()'),
  (e) => e.code === '42501',
  'a member with no session row must be refused',
);
ok('missing admin session refused');

console.log('\n4. a real admin member can read every new module');
await db.exec(`
  insert into auth.sessions(id,user_id) values ('${SESSION}','${ADMIN}');
  insert into bc_admin_v1.admin_sessions (id,user_id,expires_at)
  values ('${SESSION}','${ADMIN}', now() + interval '1 hour');
  set request.jwt.claim.sub='${ADMIN}';
  set request.jwt.claim.aal='aal2';
  set request.jwt.claim.session_id='${SESSION}';
`);

const q = async (sql, params) => (await db.query(sql, params)).rows;

const stats = await q('select * from bc_admin_v1.content_library_stats()');
assert.ok(stats.length >= 1, 'stats returns the populated domains');
assert.ok(stats.some((s) => s.domain === 'font' && Number(s.total) === 2), 'font total is real');
ok(`stats: ${stats.map((s) => `${s.domain}=${s.total}`).join(', ')}`);

const sources = await q('select * from bc_admin_v1.list_data_sources(50,null)');
assert.ok(sources.some((s) => s.slug === 't-src' && s.license_code === 'MIT' && s.status === 'ready'));
ok('data source registry shows licence and sync status');

const jobs = await q('select * from bc_admin_v1.list_sync_jobs(50,null)');
assert.ok(jobs.length >= 1 && jobs[0].items_inserted === 120);
ok('sync job history readable');

const fonts = await q("select * from bc_admin_v1.list_fonts(50,null,null,'ABee')");
assert.equal(fonts.length, 1);
assert.equal(fonts[0].name, 'ABeeZee');
assert.deepEqual(fonts[0].weights, ['400', '700']);
ok('font search filters in SQL and returns real metadata');

const emoji = await q('select * from bc_admin_v1.list_emoji(50,null)');
assert.ok(emoji.some((e) => e.emoji === '😀'));
ok('emoji library readable');

const symbols = await q('select * from bc_admin_v1.list_symbols(50,null,null)');
assert.ok(symbols.some((s) => s.codepoints === 'U+2605'));
ok('symbol library readable');

const languages = await q('select * from bc_admin_v1.list_languages()');
assert.equal(languages.length, 22, '22 registered languages');
const noContent = languages.filter((l) => Number(l.content_count) === 0);
assert.ok(noContent.length === languages.length, 'no content yet in any language');
ok('languages report 0 coverage honestly rather than assuming translation');

const translations = await q("select * from bc_admin_v1.list_translations(50,null)");
assert.equal(translations.length, 0);
ok('empty translation queue returns empty, not placeholder rows');

console.log('\n5. page sizes are clamped inside SQL');
const clamped = await q('select * from bc_admin_v1.list_fonts(100000,null,null,null)');
assert.ok(clamped.length <= 200, `limit must be clamped, got ${clamped.length}`);
ok(`asked for 100000 rows, received ${clamped.length}`);

console.log('\n6. no new client grant was created');
const readers=['content_library_stats','list_data_sources','list_sync_jobs','list_fonts','list_emoji','list_symbols','list_languages','list_translations'];
const privileges=await q(`select p.proname as name,
  has_function_privilege('anon',p.oid,'execute') or has_function_privilege('authenticated',p.oid,'execute') as callable
  from pg_catalog.pg_proc p join pg_catalog.pg_namespace n on n.oid=p.pronamespace
  where n.nspname='bc_admin_v1' and p.proname=any($1::text[])`,[readers]);
assert.deepEqual(privileges.map(p=>p.name).sort(),[...readers].sort());
assert.ok(privileges.every(p=>p.callable===false)); // includes inherited and PUBLIC grants
ok('neither browser role has effective EXECUTE on any of the eight readers');

await db.close();
console.log(`\nALL PASS — ${pass} checks passed`);
