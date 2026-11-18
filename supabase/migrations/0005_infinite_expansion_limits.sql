-- BioCraft — Infinite Expansion: configurable limits + growth indexes
--
-- Additive only. No table is dropped, no column is removed, no existing row is
-- changed, and every existing policy and grant is left exactly as it is.
--
-- Why this migration exists
-- -------------------------
-- `search_bios` ended with `limit greatest(1, least(p_limit, 100))`. That 100 was
-- an arbitrary product cap baked into SQL: any client wanting more than 100 rows
-- in one page had no way to ask, and raising it required a migration. This
-- replaces the literal with a configurable row in `public.app_limits`.
--
-- The ceiling is not removed, because an unbounded `limit` lets one request ask
-- the database to materialise the whole library. It is made *configurable and
-- disclosed*, which is what the policy requires: an infrastructure limit that is
-- transparent and adjustable without a code change. Raising it is a single
-- UPDATE, not a deployment.
--
-- Nothing here fabricates data, counts, or "unlimited" claims.

begin;

-- 1. A place to keep adjustable numeric limits, readable by anyone (the values
--    are not secret) and writable only by the service role.
create table if not exists public.app_limits (
  key         text primary key,
  value       bigint not null check (value >= 1),
  -- Shown to clients so a limit is never a mystery.
  description text not null default '',
  updated_at  timestamptz not null default now()
);

alter table public.app_limits enable row level security;

drop policy if exists app_limits_public_read on public.app_limits;
create policy app_limits_public_read
  on public.app_limits
  for select
  to anon, authenticated
  using (true);

-- Only the trusted server role may change a limit. `anon`/`authenticated` get no
-- write policy, so RLS denies them by default.
revoke all on public.app_limits from anon, authenticated;
grant select on public.app_limits to anon, authenticated;
grant all on public.app_limits to service_role;

insert into public.app_limits (key, value, description) values
  ('search_page_max', 500,  'Maximum rows search_bios returns in one page. Infrastructure ceiling, not a content cap.'),
  ('search_page_default', 24, 'Rows returned when a caller does not specify a limit.')
on conflict (key) do nothing;

-- 2. Replace the hardcoded 100 with the configured value.
--    Falls back to 500 if the row is ever missing, so the function cannot fail
--    closed into returning nothing.
create or replace function public.search_bios(
  p_query     text default null,
  p_platform  text default null,
  p_category  text default null,
  p_language  text default null,
  p_emoji_only boolean default false,
  p_styled_only boolean default false,
  p_featured  boolean default false,
  p_trending  boolean default false,
  p_limit     integer default 24,
  p_offset    integer default 0
)
returns table (
  id uuid, content text, language text, style_type text,
  category_slug text, platform_slug text,
  is_featured boolean, is_trending boolean, character_count integer
)
language sql
stable
as $$
  select b.id, b.content, b.language, b.style_type,
         c.slug as category_slug, p.slug as platform_slug,
         b.is_featured, b.is_trending, b.character_count
  from public.bios b
  left join public.categories c on c.id = b.category_id
  left join public.platforms p on p.id = b.platform_id
  where b.is_active
    and (p_platform is null or p.slug = p_platform)
    and (p_category is null or c.slug = p_category)
    and (p_language is null or b.language = p_language)
    and (not p_emoji_only or b.emoji_rich)
    and (not p_styled_only or b.is_styled)
    and (not p_featured or b.is_featured)
    and (not p_trending or b.is_trending)
    and (p_query is null or p_query = ''
         or coalesce(b.plain_content, b.content) ilike '%' || p_query || '%')
  order by b.is_featured desc, b.is_trending desc, b.created_at asc, b.id asc
  limit greatest(1, least(
    p_limit,
    coalesce((select value from public.app_limits where key = 'search_page_max'), 500)::integer
  ))
  offset greatest(0, p_offset);
$$;

-- 3. Indexes that keep the platform fast as content grows without bound.
--    The reader pages by (created_at, id) keyset; search filters by these
--    columns. Without them every page is a sequential scan once the library is
--    large, which is the real reason people add artificial caps.
create index if not exists bios_active_created_id_idx
  on public.bios (is_active, created_at, id);

create index if not exists bios_source_active_created_id_idx
  on public.bios (source_slug, is_active, created_at, id);

create index if not exists bios_language_idx
  on public.bios (language) where is_active;

create index if not exists bios_category_id_idx
  on public.bios (category_id) where is_active;

create index if not exists bios_platform_id_idx
  on public.bios (platform_id) where is_active;

create index if not exists bios_featured_idx
  on public.bios (is_featured) where is_active and is_featured;

create index if not exists bios_trending_idx
  on public.bios (is_trending) where is_active and is_trending;

comment on table public.app_limits is
  'Adjustable numeric ceilings. Raise a limit with UPDATE, no deployment needed.';
comment on function public.search_bios is
  'Paged library search. The page ceiling is read from public.app_limits.search_page_max.';

commit;
