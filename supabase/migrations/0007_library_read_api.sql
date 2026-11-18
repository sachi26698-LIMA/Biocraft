-- BioCraft — Phase 4/6: library read surface for the public site.
--
-- Everything here is READ-ONLY and reachable with the publishable key. No
-- service-role key is needed or exposed, and no new write path is created: all
-- writes still require the service role, exactly as migration 0006 established.
--
-- Why functions instead of plain table selects:
--
--  1. The browser must never be able to ask for the whole library. PostgREST
--     would happily return 200,000 rows for `select * from fonts`. Each function
--     here takes a page size and clamps it to app_limits.search_page_max, so the
--     ceiling is enforced in the database, is configurable, and cannot be
--     bypassed by a crafted request.
--  2. Keyset pagination needs a stable composite cursor. Doing it in SQL keeps
--     the (domain, source_created_at, source_id) index usable and avoids the
--     millisecond-precision bug documented in 0006.
--
-- Nothing fabricates rows: every function reads stored content.

begin;

-- ---------------------------------------------------------------------------
-- 1. Library facets — real counts, for filters and the "browse" experience
-- ---------------------------------------------------------------------------
create or replace function public.library_facets()
returns table (domain text, total bigint)
language sql
stable
as $$
  select g.domain, count(*)::bigint
  from public.global_content g
  where g.is_active
  group by g.domain
  order by count(*) desc;
$$;

comment on function public.library_facets is
  'Row counts per library domain, computed from stored rows only.';

-- ---------------------------------------------------------------------------
-- 2. Generic keyset page over one domain
-- ---------------------------------------------------------------------------
create or replace function public.library_page(
  p_domain      text,
  p_language    text default null,
  p_cursor_time text default null,
  p_cursor_id   uuid default null,
  p_limit       integer default 24
)
returns table (
  id uuid, domain text, title text, body text, language text,
  category text, license_code text, created_at timestamptz,
  next_time text, next_id uuid
)
language plpgsql
stable
as $$
declare
  v_limit integer;
begin
  v_limit := greatest(1, least(
    coalesce(p_limit, 24),
    coalesce((select value from public.app_limits where key='search_page_max'), 500)::integer
  ));

  -- Two literal-bound branches so the keyset index stays usable (see 0006).
  if p_cursor_time is null then
    return query
      select g.source_id, g.domain, g.title, g.body, g.language, g.category,
             g.license_code, g.source_created_at, g.source_created_at::text, g.source_id
      from public.global_content g
      where g.is_active and g.domain = p_domain
        and (p_language is null or g.language = p_language)
      order by g.source_created_at, g.source_id
      limit v_limit;
  else
    return query
      select g.source_id, g.domain, g.title, g.body, g.language, g.category,
             g.license_code, g.source_created_at, g.source_created_at::text, g.source_id
      from public.global_content g
      where g.is_active and g.domain = p_domain
        and (p_language is null or g.language = p_language)
        and (g.source_created_at, g.source_id) >
            (p_cursor_time::timestamptz,
             coalesce(p_cursor_id, '00000000-0000-0000-0000-000000000000'::uuid))
      order by g.source_created_at, g.source_id
      limit v_limit;
  end if;
end;
$$;

comment on function public.library_page is
  'Keyset page over one library domain. Page size clamped to app_limits.';

-- ---------------------------------------------------------------------------
-- 3. Font catalogue — filters that the font browser actually needs
-- ---------------------------------------------------------------------------
create or replace function public.font_page(
  p_category text default null,
  p_search   text default null,
  p_cursor   text default null,     -- slug
  p_limit    integer default 48
)
returns table (
  slug text, name text, family text, category text, subsets text[],
  weights text[], styles text[], variable boolean, next_cursor text
)
language plpgsql
stable
as $$
declare v_limit integer;
begin
  v_limit := greatest(1, least(
    coalesce(p_limit, 48),
    coalesce((select value from public.app_limits where key='search_page_max'), 500)::integer
  ));

  return query
    select f.slug, f.name, f.family, f.category, f.subsets, f.weights, f.styles,
           f.variable, f.slug
    from public.fonts f
    where f.is_active
      and (p_category is null or f.category = p_category)
      and (p_search is null or f.name ilike '%' || p_search || '%')
      and (p_cursor is null or f.slug > p_cursor)
    order by f.slug
    limit v_limit;
end;
$$;

comment on function public.font_page is
  'Font catalogue page, ordered by slug. Cursor is the last slug returned.';

-- ---------------------------------------------------------------------------
-- 4. Language coverage — which languages actually have content
-- ---------------------------------------------------------------------------
create or replace function public.language_coverage()
returns table (code text, name_en text, name_native text, direction text, content_count bigint)
language sql
stable
as $$
  select l.code, l.name_en, l.name_native, l.direction,
         coalesce(c.n, 0)::bigint
  from public.languages l
  left join (
    select g.language, count(*)::bigint n
    from public.global_content g
    where g.is_active and g.language is not null
    group by g.language
  ) c on c.language = l.code
  where l.is_active
  order by l.sort_order;
$$;

comment on function public.language_coverage is
  'Registered languages with the real number of stored entries in each. A language with 0 is reported as 0, never as covered.';

-- ---------------------------------------------------------------------------
-- 5. Grants — read-only, publishable key only
-- ---------------------------------------------------------------------------
revoke all on function public.library_facets() from public;
revoke all on function public.library_page(text,text,text,uuid,integer) from public;
revoke all on function public.font_page(text,text,text,integer) from public;
revoke all on function public.language_coverage() from public;

grant execute on function public.library_facets() to anon, authenticated;
grant execute on function public.library_page(text,text,text,uuid,integer) to anon, authenticated;
grant execute on function public.font_page(text,text,text,integer) to anon, authenticated;
grant execute on function public.language_coverage() to anon, authenticated;

commit;
