-- BioCraft — Phase 4/5: provenance, duplicate fingerprints and cross-domain search.
--
-- Purpose
--   Migration 0006 created the library tables (icon_library, color_palettes,
--   design_templates, design_presets) and the global index/trigger machinery, but
--   stored no per-record provenance beyond license_code + source_id. Part 4 of the
--   specification requires every record to carry: source, licence, attribution,
--   language, category, timestamps, verification status and a duplicate
--   fingerprint. Part 5 requires real cross-domain search that never loads a whole
--   table into the browser.
--
-- What this migration adds
--   1. `attribution`, `language`, `fingerprint`, `verification_status`,
--      `verified_at` on every catalogue table that stores imported content.
--   2. A UNIQUE index on `fingerprint` (where not null). This is the mechanism
--      that makes "no duplicated filler" enforceable by the database rather than
--      by trusting the importer.
--   3. `search_library()` — one paged, filtered, sorted read surface across every
--      library so the public site never has to fetch an entire table.
--   4. The missing `Apache-2.0` licence row plus registry entries for the real
--      npm packages used by the new importers.
--
-- Safety
--   * Additive only: no DROP TABLE, no DROP COLUMN, no DELETE, no UPDATE of
--     content. Existing rows are preserved and simply gain NULL provenance until a
--     real import fills it in.
--   * Re-runnable: every statement is IF NOT EXISTS / ON CONFLICT DO NOTHING.
--   * No policy is dropped or weakened. New columns inherit the table's existing
--     grants; anon keeps SELECT only.
--
-- Rollback (see MASTER_IMPLEMENTATION_TRACKER.md for the full script)
--   drop function if exists public.search_library(...);
--   drop index if exists ..._fingerprint_uidx;   (per table)
--   alter table ... drop column if exists fingerprint, ...;

begin;

-- ---------------------------------------------------------------------------
-- 1. Missing licence + sources for the newly verified packages
-- ---------------------------------------------------------------------------
-- 0006 seeded MIT/OFL-1.1/CC-BY-4.0/CC0-1.0/UNICODE/BIOCRAFT. Iconify ships a
-- large Apache-2.0 set (Material Symbols et al.), so the licence must exist or the
-- icon_library foreign key would reject those rows.
insert into public.content_licenses (code, name, url, allows_commercial, requires_attribution) values
  ('Apache-2.0', 'Apache License 2.0', 'https://www.apache.org/licenses/LICENSE-2.0', true,  true),
  ('CC-BY-3.0',  'Creative Commons BY 3.0', 'https://creativecommons.org/licenses/by/3.0/', true, true),
  ('BSD-3-Clause', 'BSD 3-Clause License', 'https://opensource.org/license/bsd-3-clause', true, true)
on conflict (code) do nothing;

-- Real, licensed packages. `endpoint` records the exact pinned version so an
-- import can be reproduced and audited. status stays 'never_synced' until a real
-- import has actually succeeded (Part 6 rule: never pre-label a job as active).
insert into public.data_sources (slug, name, provider, kind, endpoint, license_code, license_url, attribution, status, config) values
  ('iconify-json', 'Iconify icon sets', 'iconify (npm @iconify/json)', 'package',
   'npm:@iconify/json@2.2.558', 'MIT', 'https://iconify.design/license/',
   'Icons from the Iconify project; each collection keeps its own upstream licence, recorded per record.',
   'never_synced', '{"domain":"icon","per_collection_license":true}'::jsonb),
  ('color-name-list', 'Color Name List', 'color-name-list (npm)', 'package',
   'npm:color-name-list@14.86.0', 'MIT', 'https://github.com/meodai/color-names',
   'Named CSS colours collected by the Color Name List project.', 'never_synced',
   '{"domain":"palette"}'::jsonb),
  ('simple-icons', 'Simple Icons brand marks', 'simple-icons (npm)', 'package',
   'npm:simple-icons@16.38.0', 'CC0-1.0', 'https://github.com/simple-icons/simple-icons/blob/develop/LICENSE.md',
   'Brand icons from Simple Icons (CC0 1.0).', 'never_synced', '{"domain":"icon"}'::jsonb)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- 2. Provenance + dedupe columns on every catalogue table
-- ---------------------------------------------------------------------------
-- `verification_status` is deliberately constrained: content that has not been
-- checked must be labelled 'imported', never 'verified'.
do $$
declare
  t text;
  tables text[] := array[
    'icon_library','color_palettes','design_templates','design_presets',
    'fonts','symbols','emoji_collections','emoji_library'
  ];
begin
  foreach t in array tables loop
    -- Skip any table an earlier deployment did not create; never create it here.
    if to_regclass('public.'||t) is null then
      raise notice 'skipping provenance for absent table %', t;
      continue;
    end if;

    execute format('alter table public.%I add column if not exists language text', t);
    execute format('alter table public.%I add column if not exists attribution text', t);
    execute format('alter table public.%I add column if not exists fingerprint text', t);
    execute format('alter table public.%I add column if not exists verified_at timestamptz', t);
    execute format(
      'alter table public.%I add column if not exists verification_status text not null default ''imported''', t);

    -- Constrain once; re-running must not duplicate the constraint.
    if not exists (
      select 1 from pg_constraint
      where conrelid = ('public.'||t)::regclass
        and conname = t||'_verification_status_chk'
    ) then
      execute format(
        'alter table public.%I add constraint %I check (verification_status in (''imported'',''verified'',''quarantined''))',
        t, t||'_verification_status_chk');
    end if;

    -- One row per distinct content fingerprint. NULL is allowed (legacy rows that
    -- no importer has touched, and hand-authored content), and NULLs never collide
    -- in a Postgres unique index.
    execute format(
      'create unique index if not exists %I on public.%I (fingerprint) where fingerprint is not null',
      t||'_fingerprint_uidx', t);
  end loop;
end $$;

-- Fuzzy/full-text support for the columns the search surface filters on. pg_trgm
-- is present on Supabase; the guard keeps this migration portable to a bare
-- Postgres used for disposable testing.
do $$
begin
  if exists (select 1 from pg_extension where extname = 'pg_trgm') then
    execute 'create index if not exists icon_library_label_trgm_idx on public.icon_library using gin (label gin_trgm_ops)';
    execute 'create index if not exists icon_library_slug_trgm_idx on public.icon_library using gin (slug gin_trgm_ops)';
    execute 'create index if not exists color_palettes_title_trgm_idx on public.color_palettes using gin (title gin_trgm_ops)';
    execute 'create index if not exists design_templates_title_trgm_idx on public.design_templates using gin (title gin_trgm_ops)';
    execute 'create index if not exists design_presets_title_trgm_idx on public.design_presets using gin (title gin_trgm_ops)';
  else
    raise notice 'pg_trgm absent: skipping library trigram indexes (search still works, slower)';
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- 3. Cross-domain search surface
-- ---------------------------------------------------------------------------
-- One function, server-side filtering/sorting/paging. Every branch is clamped to
-- app_limits.search_page_max (0005) so a crafted request cannot pull the library
-- into the browser. `domain = null` searches everything.
create or replace function public.search_library(
  p_query       text default null,
  p_domain      text default null,
  p_category    text default null,
  p_language    text default null,
  p_sort        text default 'relevance',   -- relevance | newest | az
  p_cursor_time text default null,
  p_cursor_id   uuid default null,
  p_limit       integer default 48
)
returns table (
  id uuid,
  domain text,
  slug text,
  label text,
  category text,
  language text,
  license_code text,
  source_slug text,
  attribution text,
  verification_status text,
  preview text,
  created_at timestamptz,
  next_time text,
  next_id uuid
)
language plpgsql
stable
security invoker
as $$
declare
  v_limit  integer;
  v_query  text;
  v_domain text;
begin
  v_limit := greatest(1, least(
    coalesce(p_limit, 48),
    coalesce((select value from public.app_limits where key = 'search_page_max'), 500)::integer
  ));
  v_query  := nullif(btrim(coalesce(p_query, '')), '');
  v_domain := nullif(btrim(coalesce(p_domain, '')), '');

  return query
  with catalogue as (
    -- Each branch is filtered against its own table so the per-table indexes are
    -- usable; nothing is materialised beyond what the predicate allows.
    select i.id, 'icon'::text as domain, i.slug, i.label, i.category,
           i.language, i.license_code, s.slug as source_slug, i.attribution,
           i.verification_status, null::text as preview, i.created_at
    from public.icon_library i
    left join public.data_sources s on s.id = i.source_id
    where i.is_active
      and (p_category is null or i.category = p_category)
      and (p_language is null or i.language is null or i.language = p_language)
      and (v_query is null or i.label ilike '%'||v_query||'%' or i.slug ilike '%'||v_query||'%')

    union all

    select p.id, 'palette', p.slug, p.title, p.mood, p.language, p.license_code,
           null::text, null::text, 'imported'::text, array_to_string(p.colors, ' '), p.created_at
    from public.color_palettes p
    where p.is_active
      and (p_category is null or p.mood = p_category)
      and (p_language is null or p.language is null or p.language = p_language)
      and (v_query is null or p.title ilike '%'||v_query||'%' or p.slug ilike '%'||v_query||'%')

    union all

    select t.id, 'template', t.slug, t.title, t.domain, t.language, t.license_code,
           null::text, null::text, 'imported'::text, t.layout, t.created_at
    from public.design_templates t
    where t.is_active
      and (p_category is null or t.domain = p_category)
      and (p_language is null or t.language is null or t.language = p_language)
      and (v_query is null or t.title ilike '%'||v_query||'%' or t.slug ilike '%'||v_query||'%')

    union all

    -- design_presets stores `kind` (gradient|border|shadow|background) and `value`,
    -- not `domain`/`layout`, and 0006 gave it no licence column.
    select d.id, 'preset', d.slug, d.title, d.kind, d.language, null::text,
           null::text, d.attribution, d.verification_status, d.value, d.created_at
    from public.design_presets d
    where d.is_active
      and (p_category is null or d.kind = p_category)
      and (p_language is null or d.language is null or d.language = p_language)
      and (v_query is null or d.title ilike '%'||v_query||'%' or d.slug ilike '%'||v_query||'%')

    union all

    select f.id, 'font', f.slug, f.name, f.category, f.language, f.license_code,
           null::text, null::text, 'imported'::text, f.preview_text, f.created_at
    from public.fonts f
    where f.is_active
      and (p_category is null or f.category = p_category)
      and (p_language is null or f.language is null or f.language = p_language)
      and (v_query is null or f.name ilike '%'||v_query||'%' or f.slug ilike '%'||v_query||'%')

    union all

    select sym.id, 'symbol', sym.id::text, coalesce(sym.title, sym.symbol), sym.category,
           sym.language, sym.license_code, null::text, null::text, 'imported'::text,
           sym.symbol, sym.created_at
    from public.symbols sym
    where sym.is_active
      and (p_category is null or sym.category = p_category)
      and (p_language is null or sym.language is null or sym.language = p_language)
      and (v_query is null or coalesce(sym.title, '') ilike '%'||v_query||'%' or sym.symbol = v_query)

    union all

    -- emoji_collections (0001) has no licence column; its rows are Unicode emoji,
    -- so the licence is attributed to the Unicode Character Database here rather
    -- than reported as unknown.
    select e.id, 'emoji', e.id::text, e.emoji, e.category, e.language, 'UNICODE'::text,
           null::text, e.attribution, e.verification_status, e.keywords, e.created_at
    from public.emoji_collections e
    where e.is_active
      and (p_category is null or e.category = p_category)
      and (p_language is null or e.language is null or e.language = p_language)
      and (v_query is null or e.emoji = v_query or coalesce(e.keywords, '') ilike '%'||v_query||'%')
  )
  select c.id, c.domain, c.slug, c.label, c.category, c.language, c.license_code,
         c.source_slug, c.attribution, c.verification_status, c.preview, c.created_at,
         c.created_at::text, c.id
  from catalogue c
  where (v_domain is null or c.domain = v_domain)
    -- Keyset branch: only applied for time-ordered sorts, where the cursor and the
    -- ORDER BY use the same columns. Alphabetical sorting is served page 1 only and
    -- is documented as such rather than silently returning unstable pages.
    and (
      p_sort = 'az'
      or p_cursor_time is null
      or (c.created_at, c.id) > (p_cursor_time::timestamptz,
                                 coalesce(p_cursor_id, '00000000-0000-0000-0000-000000000000'::uuid))
    )
  order by
    case when p_sort = 'az' then c.label end asc nulls last,
    case when p_sort = 'relevance' and v_query is not null
         then (c.label ilike v_query||'%') end desc nulls last,
    c.created_at desc,
    c.id desc
  limit v_limit;
end;
$$;

comment on function public.search_library is
  'Paged, server-filtered search across every library domain. Page size clamped to app_limits.search_page_max; never returns a whole table.';

-- ---------------------------------------------------------------------------
-- 4. Grants — read-only for the public, writes stay service-role only
-- ---------------------------------------------------------------------------
revoke all on function public.search_library(text,text,text,text,text,text,uuid,integer) from public;
grant execute on function public.search_library(text,text,text,text,text,text,uuid,integer) to anon, authenticated;

-- The new columns must not widen what the browser can write. SELECT-only stands.
do $$
declare t text;
begin
  foreach t in array array['icon_library','color_palettes','design_templates',
                           'design_presets','fonts','symbols','emoji_collections'] loop
    if to_regclass('public.'||t) is not null then
      execute format('revoke insert, update, delete on public.%I from anon, authenticated', t);
      execute format('grant select on public.%I to anon, authenticated', t);
    end if;
  end loop;
end $$;

commit;
