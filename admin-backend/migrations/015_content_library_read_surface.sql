-- 015. Master Admin read surface for the content-intelligence libraries.
--
-- Scope discipline, matching 014:
--   * creates no table in bc_admin, changes no RLS policy, grants nothing to a
--     client;
--   * every function is security definer, revokes EXECUTE from PUBLIC/anon/
--     authenticated, and re-checks its own permission inside SQL;
--   * reads public.* only. No writes to public.* are introduced here, so content
--     mutation still requires the service role.
--
-- What this unblocks: the Admin console had no way to see fonts, emoji, symbols,
-- the data-source registry, sync jobs or the language table, because those
-- libraries were added to public.* by 0006 and had no bc_admin_v1 reader. Without
-- this, five Phase 3 modules would have been screens with no data behind them.
--
-- Paging is keyset everywhere. A count(*) over a 200,000-row library on every
-- console page would be real work for a number nobody acts on; totals are exposed
-- once, by content_library_stats().
begin;

-- ---------------------------------------------------------------------------
-- 1. Library totals — one call, cheap aggregate
-- ---------------------------------------------------------------------------
create or replace function bc_admin_v1.content_library_stats()
returns table (domain text, total bigint, active bigint)
language plpgsql security definer set search_path=public,pg_catalog as $$
declare actor uuid;
begin
  actor := bc_admin_v1.require_actor('content.read');
  if actor is null then
    raise exception 'forbidden' using errcode='42501';
  end if;

  return query
    select g.domain,
           count(*)::bigint,
           count(*) filter (where g.is_active)::bigint
    from public.global_content g
    group by g.domain
    order by count(*) desc;
end $$;

-- ---------------------------------------------------------------------------
-- 2. Data source registry — licence, permissions, sync status
-- ---------------------------------------------------------------------------
create or replace function bc_admin_v1.list_data_sources(
  p_limit integer default 50,
  p_after text default null
)
returns table (
  id uuid, slug text, name text, provider text, kind text, endpoint text,
  license_code text, license_url text, attribution text,
  status text, last_sync_at timestamptz, last_sync_count integer,
  last_error text, next_cursor text
)
language plpgsql security definer set search_path=public,pg_catalog as $$
declare actor uuid; lim integer;
begin
  actor := bc_admin_v1.require_actor('content.read');
  if actor is null then
    raise exception 'forbidden' using errcode='42501';
  end if;
  lim := greatest(1, least(coalesce(p_limit, 50), 200));

  return query
    select s.id, s.slug, s.name, s.provider, s.kind, s.endpoint,
           s.license_code, s.license_url, s.attribution,
           s.status, s.last_sync_at, s.last_sync_count, s.last_error, s.slug
    from public.data_sources s
    where p_after is null or s.slug > p_after
    order by s.slug
    limit lim;
end $$;

-- ---------------------------------------------------------------------------
-- 3. Sync job history — what actually ran, and what failed
-- ---------------------------------------------------------------------------
create or replace function bc_admin_v1.list_sync_jobs(
  p_limit integer default 50,
  p_before timestamptz default null
)
returns table (
  id uuid, source_slug text, source_name text, status text, mode text,
  started_at timestamptz, finished_at timestamptz, attempts integer,
  items_seen integer, items_inserted integer, items_updated integer,
  items_skipped integer, error text
)
language plpgsql security definer set search_path=public,pg_catalog as $$
declare actor uuid; lim integer;
begin
  actor := bc_admin_v1.require_actor('content.read');
  if actor is null then
    raise exception 'forbidden' using errcode='42501';
  end if;
  lim := greatest(1, least(coalesce(p_limit, 50), 200));

  return query
    select j.id, s.slug, s.name, j.status, j.mode,
           j.started_at, j.finished_at, j.attempts,
           j.items_seen, j.items_inserted, j.items_updated, j.items_skipped,
           j.error
    from public.data_sync_jobs j
    join public.data_sources s on s.id = j.source_id
    where p_before is null or j.created_at < p_before
    order by j.created_at desc
    limit lim;
end $$;

-- ---------------------------------------------------------------------------
-- 4. Fonts library
-- ---------------------------------------------------------------------------
create or replace function bc_admin_v1.list_fonts(
  p_limit integer default 50,
  p_after text default null,
  p_category text default null,
  p_search text default null
)
returns table (
  id uuid, slug text, name text, family text, category text,
  subsets text[], weights text[], styles text[], variable boolean,
  license_code text, source_slug text, is_active boolean, next_cursor text
)
language plpgsql security definer set search_path=public,pg_catalog as $$
declare actor uuid; lim integer;
begin
  actor := bc_admin_v1.require_actor('content.read');
  if actor is null then
    raise exception 'forbidden' using errcode='42501';
  end if;
  lim := greatest(1, least(coalesce(p_limit, 50), 200));

  return query
    select f.id, f.slug, f.name, f.family, f.category,
           f.subsets, f.weights, f.styles, f.variable,
           f.license_code, s.slug, f.is_active, f.slug
    from public.fonts f
    left join public.data_sources s on s.id = f.source_id
    where (p_after is null or f.slug > p_after)
      and (p_category is null or f.category = p_category)
      and (p_search is null or f.name ilike '%' || p_search || '%')
    order by f.slug
    limit lim;
end $$;

-- ---------------------------------------------------------------------------
-- 5. Emoji and symbols libraries
-- ---------------------------------------------------------------------------
create or replace function bc_admin_v1.list_emoji(
  p_limit integer default 50,
  p_after text default null
)
returns table (
  id uuid, emoji text, name text, slug text, group_name text,
  unicode_version text, skin_tone_support boolean, license_code text,
  is_active boolean, next_cursor text
)
language plpgsql security definer set search_path=public,pg_catalog as $$
declare actor uuid; lim integer;
begin
  actor := bc_admin_v1.require_actor('content.read');
  if actor is null then
    raise exception 'forbidden' using errcode='42501';
  end if;
  lim := greatest(1, least(coalesce(p_limit, 50), 200));

  return query
    select e.id, e.emoji, e.name, e.slug, e.group_name,
           e.unicode_version, e.skin_tone_support, e.license_code,
           e.is_active, e.slug
    from public.emoji_library e
    where p_after is null or e.slug > p_after
    order by e.slug
    limit lim;
end $$;

create or replace function bc_admin_v1.list_symbols(
  p_limit integer default 50,
  p_after text default null,
  p_category text default null
)
returns table (
  id uuid, symbol text, title text, category text, codepoints text,
  license_code text, is_active boolean, sort_order integer, next_cursor text
)
language plpgsql security definer set search_path=public,pg_catalog as $$
declare actor uuid; lim integer;
begin
  actor := bc_admin_v1.require_actor('content.read');
  if actor is null then
    raise exception 'forbidden' using errcode='42501';
  end if;
  lim := greatest(1, least(coalesce(p_limit, 50), 200));

  return query
    select s.id, s.symbol, s.title, s.category, s.codepoints,
           s.license_code, s.is_active, s.sort_order, s.codepoints
    from public.symbols s
    where (p_after is null or s.codepoints > p_after)
      and (p_category is null or s.category = p_category)
    order by s.codepoints
    limit lim;
end $$;

-- ---------------------------------------------------------------------------
-- 6. Languages — registry plus real coverage
-- ---------------------------------------------------------------------------
create or replace function bc_admin_v1.list_languages()
returns table (
  code text, name_en text, name_native text, direction text, script text,
  is_active boolean, sort_order integer, content_count bigint
)
language plpgsql security definer set search_path=public,pg_catalog as $$
declare actor uuid;
begin
  actor := bc_admin_v1.require_actor('content.read');
  if actor is null then
    raise exception 'forbidden' using errcode='42501';
  end if;

  return query
    select l.code, l.name_en, l.name_native, l.direction, l.script,
           l.is_active, l.sort_order,
           coalesce(c.n, 0)::bigint
    from public.languages l
    left join (
      select g.language, count(*)::bigint n
      from public.global_content g
      where g.is_active and g.language is not null
      group by g.language
    ) c on c.language = l.code
    order by l.sort_order;
end $$;

-- ---------------------------------------------------------------------------
-- 7. Translation queue — status is real, never assumed
-- ---------------------------------------------------------------------------
create or replace function bc_admin_v1.list_translations(
  p_limit integer default 50,
  p_status text default null
)
returns table (
  id uuid, source_table text, source_id uuid, source_language text,
  target_language text, status text, provider text, created_at timestamptz
)
language plpgsql security definer set search_path=public,pg_catalog as $$
declare actor uuid; lim integer;
begin
  actor := bc_admin_v1.require_actor('content.read');
  if actor is null then
    raise exception 'forbidden' using errcode='42501';
  end if;
  lim := greatest(1, least(coalesce(p_limit, 50), 200));

  return query
    select t.id, t.source_table, t.source_id, t.source_language,
           t.target_language, t.status, t.provider, t.created_at
    from public.content_translations t
    where p_status is null or t.status = p_status
    order by t.created_at desc
    limit lim;
end $$;

-- ---------------------------------------------------------------------------
-- 8. Lock every function down to the admin role only
-- ---------------------------------------------------------------------------
do $$
declare f text;
begin
  foreach f in array array[
    'content_library_stats()',
    'list_data_sources(integer,text)',
    'list_sync_jobs(integer,timestamp with time zone)',
    'list_fonts(integer,text,text,text)',
    'list_emoji(integer,text)',
    'list_symbols(integer,text,text)',
    'list_languages()',
    'list_translations(integer,text)'
  ] loop
    execute format('revoke all on function bc_admin_v1.%s from public', f);
    execute format('revoke all on function bc_admin_v1.%s from anon', f);
    execute format('revoke all on function bc_admin_v1.%s from authenticated', f);
  end loop;
end $$;

commit;
