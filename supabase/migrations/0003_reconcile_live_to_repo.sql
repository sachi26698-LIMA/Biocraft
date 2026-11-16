-- BioCraft — reconcile the live schema to the reviewed repository definition
-- (0001_initial_schema.sql). The live database was initially created from a
-- draft that drifted from the reviewed file; this migration converges it.
-- All tables were empty when applied. Idempotent.

-- ============ bios: add is_styled (missing live) ============
alter table public.bios add column if not exists is_styled boolean not null default false;
update public.bios set is_styled = (style_type is not null) where is_styled = false and style_type is not null;
alter table public.bios alter column language set default 'en';

-- platform FK: cascade -> set null (deleting a platform must not wipe bios)
alter table public.bios drop constraint if exists bios_platform_id_fkey;
alter table public.bios add constraint bios_platform_id_fkey
  foreign key (platform_id) references public.platforms(id) on delete set null;

-- canonical bios indexes
drop index if exists public.bios_active_idx;
drop index if exists public.bios_language_idx;
drop index if exists public.bios_platform_idx;
drop index if exists public.bios_category_idx;
drop index if exists public.bios_style_idx;
drop index if exists public.bios_source_slug_idx;
drop index if exists public.bios_content_trgm_idx;
drop index if exists public.bios_source_content_uidx;
create index if not exists bios_active_lookup_idx on public.bios (is_active, platform_id, category_id, language);
drop index if exists public.bios_featured_idx;
create index bios_featured_idx on public.bios (is_featured) where is_featured and is_active;
drop index if exists public.bios_trending_idx;
create index bios_trending_idx on public.bios (is_trending) where is_trending and is_active;
drop index if exists public.bios_source_idx;
create index bios_source_idx on public.bios (source_slug);
create index if not exists bios_search_trgm_idx on public.bios
  using gin ((coalesce(plain_content, content)) gin_trgm_ops);
create unique index if not exists bios_source_content_uidx on public.bios (source_slug, md5(content));

-- canonical trigger name
drop trigger if exists bios_touch_updated_at on public.bios;
drop trigger if exists bios_set_updated_at on public.bios;
create trigger bios_set_updated_at before update on public.bios
  for each row execute function public.set_updated_at();

-- canonical search_bios (plain_content aware, styled uses is_styled)
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
  order by b.is_featured desc, b.is_trending desc, b.created_at asc
  limit greatest(1, least(p_limit, 100))
  offset greatest(0, p_offset);
$$;

-- ============ categories: drop draft-only extra index ============
drop index if exists public.categories_name_trgm_idx;

-- ============ generators: set-null FK + type CHECK ============
alter table public.generators drop constraint if exists generators_platform_id_fkey;
alter table public.generators add constraint generators_platform_id_fkey
  foreign key (platform_id) references public.platforms(id) on delete set null;
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'generators_type_check' and conrelid = 'public.generators'::regclass) then
    alter table public.generators add constraint generators_type_check
      check (generator_type in ('bio','name','font','design','username','symbols','hashtags','captions','headline','summary','status','image-caption','editor'));
  end if;
end $$;

-- ============ fonts: NOT NULL previews/mappings ============
alter table public.fonts alter column preview_text set not null;
alter table public.fonts alter column unicode_mapping set default '{}'::jsonb;
alter table public.fonts alter column unicode_mapping set not null;

-- ============ symbols: slug CHECK + canonical index ============
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'symbols_category_check' and conrelid = 'public.symbols'::regclass) then
    alter table public.symbols add constraint symbols_category_check check (category ~ '^[a-z0-9-]+$');
  end if;
end $$;
drop index if exists public.symbols_category_idx;
drop index if exists public.symbols_active_idx;
create index if not exists symbols_active_cat_idx on public.symbols (is_active, category, sort_order);

-- ============ emoji_collections: slug CHECK + composite index ============
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'emoji_collections_category_check' and conrelid = 'public.emoji_collections'::regclass) then
    alter table public.emoji_collections add constraint emoji_collections_category_check check (category ~ '^[a-z0-9-]+$');
  end if;
end $$;
drop index if exists public.emoji_collections_category_idx;
drop index if exists public.emoji_collections_active_idx;
create index if not exists emoji_collections_active_cat_idx on public.emoji_collections (is_active, category);

-- ============ hashtags: # CHECK, set-null FK, canonical lookup ============
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'hashtags_tag_check' and conrelid = 'public.hashtags'::regclass) then
    alter table public.hashtags add constraint hashtags_tag_check check (tag ~ '^#\S+$');
  end if;
end $$;
alter table public.hashtags drop constraint if exists hashtags_platform_id_fkey;
alter table public.hashtags add constraint hashtags_platform_id_fkey
  foreign key (platform_id) references public.platforms(id) on delete set null;
drop index if exists public.hashtags_active_idx;
drop index if exists public.hashtags_platform_idx;
drop index if exists public.hashtags_category_idx;
drop index if exists public.hashtags_language_idx;
drop index if exists public.hashtags_tag_trgm_idx;
create index if not exists hashtags_active_lookup_idx on public.hashtags (is_active, category_id, language, popularity);

-- ============ captions: tone CHECK, set-null FK, canonical lookup ============
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'captions_tone_check' and conrelid = 'public.captions'::regclass) then
    alter table public.captions add constraint captions_tone_check
      check (tone in ('witty','aesthetic','bold','inspirational','casual','professional','minimal','luxe'));
  end if;
end $$;
alter table public.captions drop constraint if exists captions_platform_id_fkey;
alter table public.captions add constraint captions_platform_id_fkey
  foreign key (platform_id) references public.platforms(id) on delete set null;
drop index if exists public.captions_active_idx;
drop index if exists public.captions_category_idx;
drop index if exists public.captions_language_idx;
drop index if exists public.captions_tone_idx;
create index if not exists captions_active_lookup_idx on public.captions (is_active, category_id, language, tone);

-- ============ seo_pages: slug CHECK, canonical trigger name ============
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'seo_pages_slug_check' and conrelid = 'public.seo_pages'::regclass) then
    alter table public.seo_pages add constraint seo_pages_slug_check check (page_slug ~ '^/[a-z0-9/-]*$');
  end if;
end $$;
drop trigger if exists seo_pages_touch_updated_at on public.seo_pages;
drop trigger if exists seo_pages_set_updated_at on public.seo_pages;
create trigger seo_pages_set_updated_at before update on public.seo_pages
  for each row execute function public.set_updated_at();
