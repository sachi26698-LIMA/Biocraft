-- BioCraft — initial schema (database-only phase).
-- PostgreSQL 15+/Supabase. Idempotent: safe to re-run.
-- No auth, no user tables — BioCraft is guest-first.

create extension if not exists pg_trgm;
create extension if not exists pgcrypto;

-- ============ updated_at trigger helper ============
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============ A. platforms ============
create table if not exists public.platforms (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  slug         text not null unique check (slug ~ '^[a-z0-9-]+$'),
  description  text,
  accent_color text check (accent_color is null or accent_color ~ '^#[0-9A-Fa-f]{6}$'),
  icon         text,
  is_active    boolean not null default true,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now()
);
create index if not exists platforms_active_sort_idx on public.platforms (is_active, sort_order);

-- ============ B. categories ============
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique check (slug ~ '^[a-z0-9-]+$'),
  description text,
  platform_id uuid references public.platforms(id) on delete set null,
  is_active   boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);
create index if not exists categories_active_sort_idx on public.categories (is_active, sort_order);
create index if not exists categories_platform_idx on public.categories (platform_id);

-- ============ C. bios ============
create table if not exists public.bios (
  id              uuid primary key default gen_random_uuid(),
  platform_id     uuid references public.platforms(id) on delete set null,   -- null = all platforms
  category_id     uuid references public.categories(id) on delete set null,  -- null = uncategorised
  title           text,
  content         text not null,
  plain_content   text,                                                      -- plain twin for search of styled bios
  language        text not null default 'en' check (language in ('en','hi','hg')),
  style_type      text,                                                      -- e.g. bold | monospace | null
  emoji_rich      boolean not null default false,
  is_styled       boolean not null default false,
  character_count integer generated always as (char_length(content)) stored,
  is_featured     boolean not null default false,
  is_trending     boolean not null default false,
  is_active       boolean not null default true,
  source_slug     text,                                                      -- collection slug, e.g. instagram-bio-for-boys
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists bios_active_lookup_idx on public.bios (is_active, platform_id, category_id, language);
create index if not exists bios_featured_idx on public.bios (is_featured) where is_featured and is_active;
create index if not exists bios_trending_idx on public.bios (is_trending) where is_trending and is_active;
create index if not exists bios_source_idx on public.bios (source_slug);
create index if not exists bios_search_trgm_idx on public.bios
  using gin ((coalesce(plain_content, content)) gin_trgm_ops);
-- Idempotent imports: one row per (collection, content) pair.
create unique index if not exists bios_source_content_uidx on public.bios (source_slug, md5(content));
drop trigger if exists bios_set_updated_at on public.bios;
create trigger bios_set_updated_at before update on public.bios
  for each row execute function public.set_updated_at();

-- ============ D. generators ============
create table if not exists public.generators (
  id              uuid primary key default gen_random_uuid(),
  platform_id     uuid references public.platforms(id) on delete set null,
  name            text not null,
  slug            text not null unique check (slug ~ '^[a-z0-9-]+$'),
  description     text,
  generator_type  text not null check (generator_type in
                    ('bio','name','font','design','username','symbols','hashtags','captions','headline','summary','status','image-caption','editor')),
  character_limit integer check (character_limit is null or character_limit > 0),
  is_active       boolean not null default true,
  sort_order      integer not null default 0,
  created_at      timestamptz not null default now()
);
create index if not exists generators_active_sort_idx on public.generators (is_active, sort_order);

-- ============ E. fonts (stylish Unicode presets, not downloadable files) ============
create table if not exists public.fonts (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  slug            text not null unique check (slug ~ '^[a-z0-9-]+$'),
  font_type       text not null,
  preview_text    text not null,
  unicode_mapping jsonb not null default '{}'::jsonb,
  is_active       boolean not null default true,
  sort_order      integer not null default 0,
  created_at      timestamptz not null default now()
);
create index if not exists fonts_active_sort_idx on public.fonts (is_active, sort_order);

-- ============ F. symbols ============
create table if not exists public.symbols (
  id         uuid primary key default gen_random_uuid(),
  symbol     text not null,
  category   text not null check (category ~ '^[a-z0-9-]+$'),
  title      text,
  is_active  boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists symbols_active_cat_idx on public.symbols (is_active, category, sort_order);
create unique index if not exists symbols_symbol_uidx on public.symbols (symbol);
create index if not exists symbols_search_trgm_idx on public.symbols using gin (coalesce(title, '') gin_trgm_ops);

-- ============ G. emoji_collections ============
create table if not exists public.emoji_collections (
  id         uuid primary key default gen_random_uuid(),
  emoji      text not null,
  category   text not null check (category ~ '^[a-z0-9-]+$'),
  keywords   text,
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists emoji_collections_active_cat_idx on public.emoji_collections (is_active, category);
create unique index if not exists emoji_collections_emoji_uidx on public.emoji_collections (emoji);

-- ============ H. hashtags ============
create table if not exists public.hashtags (
  id          uuid primary key default gen_random_uuid(),
  platform_id uuid references public.platforms(id) on delete set null,  -- null = all platforms
  category_id uuid references public.categories(id) on delete set null, -- niche/collection category
  tag         text not null check (tag ~ '^#\S+$'),
  language    text not null default 'en' check (language in ('en','hi','hg')),
  popularity  text not null default 'medium' check (popularity in ('broad','medium','focused')),
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);
create index if not exists hashtags_active_lookup_idx on public.hashtags (is_active, category_id, language, popularity);
create unique index if not exists hashtags_tag_lang_uidx on public.hashtags (lower(tag), language);

-- ============ I. captions ============
create table if not exists public.captions (
  id          uuid primary key default gen_random_uuid(),
  platform_id uuid references public.platforms(id) on delete set null,
  category_id uuid references public.categories(id) on delete set null,
  title       text,
  content     text not null,
  language    text not null default 'en' check (language in ('en','hi','hg')),
  tone        text not null check (tone in ('witty','aesthetic','bold','inspirational','casual','professional','minimal','luxe')),
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);
create index if not exists captions_active_lookup_idx on public.captions (is_active, category_id, language, tone);
create index if not exists captions_search_trgm_idx on public.captions using gin (content gin_trgm_ops);
create unique index if not exists captions_content_lang_uidx on public.captions (md5(content), language, tone);

-- ============ J. seo_pages ============
create table if not exists public.seo_pages (
  id               uuid primary key default gen_random_uuid(),
  page_slug        text not null unique check (page_slug ~ '^/[a-z0-9/-]*$'),
  title            text not null,
  meta_description text,
  canonical_url    text,
  robots           text not null default 'index,follow',
  og_title         text,
  og_description   text,
  is_active        boolean not null default true,
  updated_at       timestamptz not null default now()
);
create index if not exists seo_pages_active_idx on public.seo_pages (is_active);
drop trigger if exists seo_pages_set_updated_at on public.seo_pages;
create trigger seo_pages_set_updated_at before update on public.seo_pages
  for each row execute function public.set_updated_at();

-- ============ Search helper (keyword + filters, paginated) ============
create or replace function public.search_bios(
  p_query     text default null,
  p_platform  text default null,   -- platform slug
  p_category  text default null,   -- category slug
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
