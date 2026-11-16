-- Keep offset-based pages deterministic when timestamps and flags tie.
-- This changes only ordering; it does not change data, filters, or RLS.
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
  limit greatest(1, least(p_limit, 100))
  offset greatest(0, p_offset);
$$;
