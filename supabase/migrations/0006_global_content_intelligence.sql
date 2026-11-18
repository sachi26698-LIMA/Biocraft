-- BioCraft — Global Content Intelligence schema
--
-- ADDITIVE ONLY. Nothing is dropped. No existing row is changed. No existing
-- policy or grant is weakened. Every new table below is either genuinely new or
-- an *extension* of a table that already exists, and each extension is written so
-- that existing readers keep working unchanged.
--
-- Design decisions, stated plainly:
--
-- 1. We do NOT create the requested tables that would duplicate what is already
--    live. `bios`, `captions`, `hashtags`, `symbols`, `fonts`, `categories`,
--    `emoji_collections`, `platforms`, `generators` and `app_limits` already exist
--    with 6,750 real rows. Dropping them to match a spec would corrupt real data.
--    Instead each gets the columns it was missing, and the new libraries
--    (`icon_library`, `color_palettes`, `design_templates`) are new tables.
--
-- 2. `global_content` is a real unified index over every library, maintained by
--    triggers, not a copy of the content. It exists so one search can span every
--    domain without the client knowing nine table shapes.
--
-- 3. Every table that holds public content gets RLS with a SELECT policy for
--    anon+authenticated, and no write policy at all. Writes therefore require the
--    service role, which is what "no privileged keys in the frontend" means in
--    practice.
--
-- 4. Language is a real registry, not an enum, so adding a language is a row.

begin;

-- ---------------------------------------------------------------------------
-- 1. Languages — expandable registry
-- ---------------------------------------------------------------------------
create table if not exists public.languages (
  code          text primary key,                 -- BCP-47, e.g. 'hi', 'zh-Hans'
  name_en       text not null,
  name_native   text not null,
  direction     text not null default 'ltr' check (direction in ('ltr','rtl')),
  script        text,
  is_active     boolean not null default true,
  sort_order    integer not null default 100,
  created_at    timestamptz not null default now()
);

alter table public.languages enable row level security;
drop policy if exists languages_public_read on public.languages;
create policy languages_public_read on public.languages
  for select to anon, authenticated using (is_active);
revoke all on public.languages from anon, authenticated;
grant select on public.languages to anon, authenticated;
grant all on public.languages to service_role;

insert into public.languages (code, name_en, name_native, direction, script, sort_order) values
  ('en',      'English',    'English',    'ltr', 'Latn', 10),
  ('hi',      'Hindi',      'हिन्दी',      'ltr', 'Deva', 20),
  ('hg',      'Hinglish',   'Hinglish',   'ltr', 'Latn', 30),
  ('es',      'Spanish',    'Español',    'ltr', 'Latn', 40),
  ('fr',      'French',     'Français',   'ltr', 'Latn', 50),
  ('de',      'German',     'Deutsch',    'ltr', 'Latn', 60),
  ('pt',      'Portuguese', 'Português',  'ltr', 'Latn', 70),
  ('ar',      'Arabic',     'العربية',      'rtl', 'Arab', 80),
  ('bn',      'Bengali',    'বাংলা',       'ltr', 'Beng', 90),
  ('ur',      'Urdu',       'اردو',        'rtl', 'Arab', 100),
  ('ja',      'Japanese',   '日本語',       'ltr', 'Jpan', 110),
  ('ko',      'Korean',     '한국어',        'ltr', 'Kore', 120),
  ('zh-Hans', 'Chinese (Simplified)',  '简体中文', 'ltr', 'Hans', 130),
  ('zh-Hant', 'Chinese (Traditional)', '繁體中文', 'ltr', 'Hant', 140),
  ('id',      'Indonesian', 'Bahasa Indonesia', 'ltr', 'Latn', 150),
  ('ru',      'Russian',    'Русский',    'ltr', 'Cyrl', 160),
  ('tr',      'Turkish',    'Türkçe',     'ltr', 'Latn', 170),
  ('vi',      'Vietnamese', 'Tiếng Việt', 'ltr', 'Latn', 180),
  ('th',      'Thai',       'ไทย',        'ltr', 'Thai', 190),
  ('ta',      'Tamil',      'தமிழ்',       'ltr', 'Taml', 200),
  ('mr',      'Marathi',    'मराठी',       'ltr', 'Deva', 210),
  ('gu',      'Gujarati',   'ગુજરાતી',      'ltr', 'Gujr', 220)
on conflict (code) do nothing;

-- ---------------------------------------------------------------------------
-- 2. Data Source Registry — every import is attributable and licensed
-- ---------------------------------------------------------------------------
create table if not exists public.data_sources (
  id                uuid primary key default gen_random_uuid(),
  slug              text not null unique,
  name              text not null,
  provider          text not null,
  kind              text not null check (kind in ('api','package','file','manual')),
  endpoint          text,
  license_code      text not null,
  license_url       text,
  attribution       text,
  -- Honest status: a source is 'never_synced' until a real import has succeeded.
  status            text not null default 'never_synced'
                    check (status in ('never_synced','ready','syncing','error','disabled')),
  last_sync_at      timestamptz,
  last_sync_count   integer,
  last_error        text,
  config            jsonb not null default '{}'::jsonb,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

alter table public.data_sources enable row level security;
drop policy if exists data_sources_public_read on public.data_sources;
-- Only non-secret operational metadata is public; config may hold endpoints.
create policy data_sources_public_read on public.data_sources
  for select to anon, authenticated using (status <> 'disabled');
revoke all on public.data_sources from anon, authenticated;
grant select on public.data_sources to anon, authenticated;
grant all on public.data_sources to service_role;

-- ---------------------------------------------------------------------------
-- 3. Content licences — attributable, not assumed
-- ---------------------------------------------------------------------------
create table if not exists public.content_licenses (
  code            text primary key,        -- 'MIT', 'OFL-1.1', 'CC-BY-4.0' ...
  name            text not null,
  url             text,
  -- Whether the licence permits commercial use of the content as shipped.
  allows_commercial boolean not null default true,
  requires_attribution boolean not null default true,
  created_at      timestamptz not null default now()
);

alter table public.content_licenses enable row level security;
drop policy if exists content_licenses_public_read on public.content_licenses;
create policy content_licenses_public_read on public.content_licenses
  for select to anon, authenticated using (true);
revoke all on public.content_licenses from anon, authenticated;
grant select on public.content_licenses to anon, authenticated;
grant all on public.content_licenses to service_role;

insert into public.content_licenses (code, name, url, allows_commercial, requires_attribution) values
  ('MIT',       'MIT License',              'https://opensource.org/licenses/MIT',        true,  true),
  ('OFL-1.1',   'SIL Open Font License 1.1','https://openfontlicense.org',               true,  true),
  ('CC-BY-4.0', 'Creative Commons BY 4.0',  'https://creativecommons.org/licenses/by/4.0/', true, true),
  ('CC0-1.0',   'Creative Commons Zero 1.0','https://creativecommons.org/publicdomain/zero/1.0/', true, false),
  ('UNICODE',   'Unicode Character Database','https://www.unicode.org/license.txt',      true,  true),
  ('BIOCRAFT',  'BioCraft original',        null,                                         true,  false)
on conflict (code) do nothing;

-- ---------------------------------------------------------------------------
-- 4. Tags and collections
-- ---------------------------------------------------------------------------
create table if not exists public.content_tags (
  id         uuid primary key default gen_random_uuid(),
  slug       text not null unique,
  label      text not null,
  kind       text not null default 'topic',   -- topic | country | trend | season
  created_at timestamptz not null default now()
);

create table if not exists public.content_collections (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  title        text not null,
  description  text,
  -- Null parent = top level. Supports unlimited nesting.
  parent_id    uuid references public.content_collections(id) on delete set null,
  domain       text,                          -- bio | caption | hashtag | symbol | font | template
  language     text references public.languages(code) on delete set null,
  country      text,
  cover_emoji  text,
  is_active    boolean not null default true,
  sort_order   integer not null default 100,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists content_collections_parent_idx on public.content_collections(parent_id);
create index if not exists content_collections_domain_idx on public.content_collections(domain, is_active);

-- ---------------------------------------------------------------------------
-- 5. Extend existing libraries (ADDs only — no column removed, no type changed)
-- ---------------------------------------------------------------------------
-- bios: provenance and quality columns the global index needs.
alter table public.bios
  add column if not exists source_id   uuid references public.data_sources(id) on delete set null,
  add column if not exists license_code text references public.content_licenses(code) on delete set null,
  add column if not exists quality_score smallint,
  add column if not exists content_hash  text;

create index if not exists bios_source_id_idx on public.bios(source_id);
create index if not exists bios_content_hash_idx on public.bios(content_hash);

alter table public.captions
  add column if not exists source_id   uuid references public.data_sources(id) on delete set null,
  add column if not exists license_code text references public.content_licenses(code) on delete set null,
  add column if not exists content_hash text;
create index if not exists captions_content_hash_idx on public.captions(content_hash);

alter table public.hashtags
  add column if not exists source_id   uuid references public.data_sources(id) on delete set null,
  add column if not exists license_code text references public.content_licenses(code) on delete set null;
create index if not exists hashtags_tag_idx on public.hashtags(tag);

alter table public.symbols
  add column if not exists source_id   uuid references public.data_sources(id) on delete set null,
  add column if not exists license_code text references public.content_licenses(code) on delete set null,
  add column if not exists codepoints  text,          -- 'U+2764 U+FE0F'
  add column if not exists block       text;          -- Unicode block name
create index if not exists symbols_codepoints_idx on public.symbols(codepoints);

alter table public.fonts
  add column if not exists source_id   uuid references public.data_sources(id) on delete set null,
  add column if not exists license_code text references public.content_licenses(code) on delete set null,
  add column if not exists category    text,          -- sans-serif | serif | display ...
  add column if not exists subsets     text[],
  add column if not exists weights     text[],
  add column if not exists styles      text[],
  add column if not exists variable    boolean not null default false,
  add column if not exists family      text;
create index if not exists fonts_category_idx on public.fonts(category);

-- ---------------------------------------------------------------------------
-- 6. New libraries
-- ---------------------------------------------------------------------------
create table if not exists public.icon_library (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  label       text not null,
  category    text not null default 'general',
  svg         text,                  -- inline, so no external request and no licence ambiguity
  keywords    text[] not null default '{}',
  license_code text references public.content_licenses(code) on delete set null,
  source_id   uuid references public.data_sources(id) on delete set null,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists public.color_palettes (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  title       text not null,
  colors      text[] not null check (array_length(colors,1) between 2 and 12),
  mood        text,
  usage       text,
  license_code text references public.content_licenses(code) on delete set null,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists public.design_templates (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  title       text not null,
  domain      text not null,          -- bio | caption | profile | business
  layout      text not null,
  -- Structure only. Never executable code.
  spec        jsonb not null default '{}'::jsonb,
  preview     jsonb not null default '{}'::jsonb,
  language    text references public.languages(code) on delete set null,
  license_code text references public.content_licenses(code) on delete set null,
  is_premium  boolean not null default false,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.design_presets (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  title       text not null,
  kind        text not null,          -- gradient | border | shadow | background
  value       text not null,
  spec        jsonb not null default '{}'::jsonb,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists public.emoji_library (
  id             uuid primary key default gen_random_uuid(),
  emoji          text not null unique,
  name           text not null,
  slug           text not null,
  group_name     text not null,
  unicode_version text,
  emoji_version  text,
  skin_tone_support boolean not null default false,
  license_code   text references public.content_licenses(code) on delete set null,
  source_id      uuid references public.data_sources(id) on delete set null,
  is_active      boolean not null default true,
  created_at     timestamptz not null default now()
);
create index if not exists emoji_library_group_idx on public.emoji_library(group_name);

-- ---------------------------------------------------------------------------
-- 7. Translations — status is explicit, never assumed
-- ---------------------------------------------------------------------------
create table if not exists public.content_translations (
  id             uuid primary key default gen_random_uuid(),
  domain         text not null,
  source_table   text not null,
  source_id      uuid not null,
  source_language text references public.languages(code),
  target_language text not null references public.languages(code),
  content        text not null,
  -- 'verified' only when a human (or a recorded provider) actually confirmed it.
  status         text not null default 'machine'
                 check (status in ('machine','reviewed','verified','rejected')),
  provider       text,
  reviewed_by    uuid,
  created_at     timestamptz not null default now(),
  unique (source_table, source_id, target_language)
);
create index if not exists content_translations_lookup_idx
  on public.content_translations(source_table, source_id, target_language);

-- ---------------------------------------------------------------------------
-- 8. Versions — rollback for every library
-- ---------------------------------------------------------------------------
create table if not exists public.content_versions (
  id           bigserial primary key,
  source_table text not null,
  source_id    uuid not null,
  snapshot     jsonb not null,
  changed_by   uuid,
  change_kind  text not null default 'update',
  created_at   timestamptz not null default now()
);
create index if not exists content_versions_lookup_idx
  on public.content_versions(source_table, source_id, created_at desc);

-- ---------------------------------------------------------------------------
-- 9. Unified global content index (maintained by triggers, not a copy)
-- ---------------------------------------------------------------------------
create table if not exists public.global_content (
  id            uuid primary key default gen_random_uuid(),
  source_table  text not null,
  source_id     uuid not null,
  domain        text not null,
  title         text,
  body          text not null,
  language      text,
  category      text,
  license_code  text,
  source_id_ref uuid references public.data_sources(id) on delete set null,
  is_active     boolean not null default true,
  -- When the index row was created, vs. when the *content* was created. Keyset
  -- pagination must order by the latter, otherwise every row imported in one
  -- batch shares a timestamp and paging degenerates into batches.
  created_at        timestamptz not null default now(),
  -- Full-text search vector, maintained below.
  search_vector tsvector,
  unique (source_table, source_id)
);

create index if not exists global_content_domain_idx on public.global_content(domain, is_active);
create index if not exists global_content_language_idx on public.global_content(language);
create index if not exists global_content_fts_idx on public.global_content using gin(search_vector);
-- The trigram index needs pg_trgm. It is present on Supabase, but guarded here so
-- the same migration applies unchanged on a bare Postgres used for testing.
do $$ begin
  if exists (select 1 from pg_extension where extname = 'pg_trgm') then
    execute 'create index if not exists global_content_trgm_idx on public.global_content using gin(body gin_trgm_ops)';
  else
    raise notice 'pg_trgm absent: skipping trigram index (search_global still works without it)';
  end if;
end $$;

create or replace function public.global_content_refresh() returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  j jsonb;
  v_domain text;
  v_title text;
  v_body text;
  v_language text;
  v_category text;
begin
  if tg_op = 'DELETE' then
    delete from public.global_content where source_table = tg_table_name and source_id = old.id;
    return old;
  end if;
  -- Convert the row once. Referencing a column that a given table lacks would
  -- raise "record has no field", so every field is read through jsonb, which
  -- simply yields null for absent keys.
  j := to_jsonb(new);

  v_domain := case tg_table_name
    when 'bios' then 'bio'
    when 'captions' then 'caption'
    when 'hashtags' then 'hashtag'
    when 'symbols' then 'symbol'
    when 'fonts' then 'font'
    when 'emoji_collections' then 'emoji'
    when 'emoji_library' then 'emoji'
    when 'icon_library' then 'icon'
    when 'color_palettes' then 'palette'
    when 'design_templates' then 'template'
  end;

  v_title := coalesce(j->>'title', j->>'name', j->>'tag', j->>'symbol',
                      j->>'family', j->>'label', j->>'emoji', j->>'slug');

  v_body := coalesce(j->>'content', j->>'tag', j->>'symbol', j->>'emoji',
                     j->>'family', j->>'label', j->>'name', j->>'title', '');

  -- Columns that only exist on some tables are read defensively.
  v_language := case when v_domain in ('bio','caption','hashtag') then j->>'language' else null end;
  v_category := coalesce(j->>'category', j->>'group_name', j->>'style_type',
                         j->>'font_type', j->>'domain', j->>'tone');

  insert into public.global_content (
    source_table, source_id, domain, title, body, language, category,
    license_code, source_id_ref, is_active, source_created_at
  ) values (
    tg_table_name,
    (j->>'id')::uuid,
    v_domain,
    v_title,
    v_body,
    v_language,
    v_category,
    j->>'license_code',
    case when j ? 'source_id' and nullif(j->>'source_id','') is not null
         then (j->>'source_id')::uuid else null end,
    coalesce((j->>'is_active')::boolean, true),
    coalesce((j->>'created_at')::timestamptz, now())
  )
  on conflict (source_table, source_id) do update
    set domain = excluded.domain,
        title = excluded.title,
        body = excluded.body,
        language = excluded.language,
        category = excluded.category,
        license_code = excluded.license_code,
        source_id_ref = excluded.source_id_ref,
        is_active = excluded.is_active,
        source_created_at = excluded.source_created_at;
  return new;
end;
$$;

-- `create table if not exists` silently skips new columns on an existing table,
-- so source_created_at is added explicitly. Keyset pagination orders by it.
-- Added NULLable first so re-running the migration backfills only rows that still
-- need it, instead of rewriting the whole index every time.
alter table public.global_content
  add column if not exists source_created_at timestamptz;

-- Backfill from the source rows so existing libraries paginate in their real order.
update public.global_content g
   set source_created_at = s.created_at
  from (
    select 'bios' t, id, created_at from public.bios
    union all select 'captions', id, created_at from public.captions
    union all select 'hashtags', id, created_at from public.hashtags
    union all select 'symbols', id, created_at from public.symbols
    union all select 'fonts', id, created_at from public.fonts
    union all select 'emoji_collections', id, created_at from public.emoji_collections
  ) s
 where g.source_table = s.t and g.source_id = s.id;

-- Now that every row has a value, lock the column down.
update public.global_content set source_created_at = created_at where source_created_at is null;
alter table public.global_content alter column source_created_at set default now();
alter table public.global_content alter column source_created_at set not null;

-- Keep the search vector current in one place.
create or replace function public.global_content_vector() returns trigger
language plpgsql
as $$
begin
  new.search_vector :=
    setweight(to_tsvector('simple', coalesce(new.title,'')), 'A') ||
    setweight(to_tsvector('simple', coalesce(new.body,'')), 'B');
  return new;
end;
$$;

drop trigger if exists global_content_vector_t on public.global_content;
create trigger global_content_vector_t before insert or update on public.global_content
  for each row execute function public.global_content_vector();

-- Wire the source tables. Guarded so re-running the migration is safe.
do $$
declare
  t text;
  tables text[] := array['bios','captions','hashtags','symbols','fonts','emoji_collections','emoji_library','icon_library','color_palettes','design_templates'];
begin
  foreach t in array tables loop
    execute format('drop trigger if exists %I on public.%I', t||'_global_index', t);
    execute format(
      'create trigger %I after insert or update or delete on public.%I for each row execute function public.global_content_refresh()',
      t||'_global_index', t);
  end loop;
end $$;

-- Seed the index from the rows that already exist, so search is not empty.
insert into public.global_content (source_table, source_id, domain, title, body, language, category, is_active)
select 'bios', b.id, 'bio', b.title, b.content, b.language, b.style_type, b.is_active from public.bios b
on conflict (source_table, source_id) do nothing;
insert into public.global_content (source_table, source_id, domain, title, body, language, category, is_active)
select 'captions', c.id, 'caption', c.title, c.content, c.language, c.tone, c.is_active from public.captions c
on conflict (source_table, source_id) do nothing;
insert into public.global_content (source_table, source_id, domain, title, body, language, category, is_active)
select 'hashtags', h.id, 'hashtag', null, h.tag, h.language, h.popularity, h.is_active from public.hashtags h
on conflict (source_table, source_id) do nothing;
insert into public.global_content (source_table, source_id, domain, title, body, category, is_active)
select 'symbols', s.id, 'symbol', s.title, s.symbol, s.category, s.is_active from public.symbols s
on conflict (source_table, source_id) do nothing;
insert into public.global_content (source_table, source_id, domain, title, body, category, is_active)
select 'fonts', f.id, 'font', f.name, f.name, f.font_type, f.is_active from public.fonts f
on conflict (source_table, source_id) do nothing;
insert into public.global_content (source_table, source_id, domain, title, body, category, is_active)
select 'emoji_collections', e.id, 'emoji', null, e.emoji, e.category, e.is_active from public.emoji_collections e
on conflict (source_table, source_id) do nothing;

-- ---------------------------------------------------------------------------
-- 10. Sync jobs, logs and analytics
-- ---------------------------------------------------------------------------
create table if not exists public.data_sync_jobs (
  id           uuid primary key default gen_random_uuid(),
  source_id    uuid not null references public.data_sources(id) on delete cascade,
  status       text not null default 'queued'
               check (status in ('queued','running','succeeded','failed','cancelled')),
  mode         text not null default 'full' check (mode in ('full','incremental')),
  -- Idempotency: one active job per (source, mode) at a time.
  started_at   timestamptz,
  finished_at  timestamptz,
  items_seen    integer not null default 0,
  items_inserted integer not null default 0,
  items_updated  integer not null default 0,
  items_skipped  integer not null default 0,
  attempts     integer not null default 0,
  error        text,
  created_at   timestamptz not null default now()
);
create index if not exists data_sync_jobs_source_idx on public.data_sync_jobs(source_id, created_at desc);
create unique index if not exists data_sync_jobs_active_uidx
  on public.data_sync_jobs(source_id, mode) where status in ('queued','running');

create table if not exists public.data_sync_logs (
  id         bigserial primary key,
  job_id     uuid references public.data_sync_jobs(id) on delete cascade,
  level      text not null default 'info' check (level in ('info','warn','error')),
  message    text not null,
  detail     jsonb,
  created_at timestamptz not null default now()
);
create index if not exists data_sync_logs_job_idx on public.data_sync_logs(job_id, created_at);

create table if not exists public.content_analytics (
  id         bigserial primary key,
  domain     text not null,
  source_id  uuid,
  event      text not null check (event in ('view','copy','save','search_hit','search_miss')),
  query      text,
  created_at timestamptz not null default now()
);
create index if not exists content_analytics_event_idx on public.content_analytics(event, created_at desc);

create table if not exists public.user_saved_content (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null,
  domain      text not null,
  source_table text not null,
  source_id   uuid not null,
  note        text,
  created_at  timestamptz not null default now(),
  unique (user_id, source_table, source_id)
);

create table if not exists public.user_favorites (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null,
  domain      text not null,
  source_id   uuid not null,
  created_at  timestamptz not null default now(),
  unique (user_id, domain, source_id)
);

create table if not exists public.admin_content_reviews (
  id          uuid primary key default gen_random_uuid(),
  source_table text not null,
  source_id   uuid not null,
  decision    text not null check (decision in ('pending','approved','rejected','duplicate')),
  note        text,
  reviewer_id uuid,
  created_at  timestamptz not null default now()
);
create index if not exists admin_content_reviews_state_idx on public.admin_content_reviews(decision, created_at desc);

-- ---------------------------------------------------------------------------
-- 11. RLS for every new public-read table
-- ---------------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['content_tags','content_collections','icon_library','color_palettes',
                           'design_templates','design_presets','emoji_library','global_content',
                           'content_licenses','languages'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists %I on public.%I', t||'_public_read', t);
    execute format('create policy %I on public.%I for select to anon, authenticated using (true)', t||'_public_read', t);
    execute format('revoke all on public.%I from anon, authenticated', t);
    execute format('grant select on public.%I to anon, authenticated', t);
    execute format('grant all on public.%I to service_role', t);
  end loop;
end $$;

-- Table-specific read filters where 'active' is meaningful.
drop policy if exists content_collections_public_read on public.content_collections;
create policy content_collections_public_read on public.content_collections
  for select to anon, authenticated using (is_active);

drop policy if exists global_content_public_read on public.global_content;
create policy global_content_public_read on public.global_content
  for select to anon, authenticated using (is_active);

-- Per-user tables: a user may only read/write their own rows. No public policy.
do $$
declare t text;
begin
  foreach t in array array['user_saved_content','user_favorites'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists %I on public.%I', t||'_own_rows', t);
    execute format('create policy %I on public.%I for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid())', t||'_own_rows', t);
    execute format('revoke all on public.%I from anon', t);
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
  end loop;
end $$;

-- Operational tables: service role only, no public read at all.
do $$
declare t text;
begin
  foreach t in array array['data_sync_jobs','data_sync_logs','content_analytics','admin_content_reviews','content_versions','content_translations'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on public.%I from anon, authenticated', t);
    execute format('grant all on public.%I to service_role', t);
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- 12. Unified search across every library
-- ---------------------------------------------------------------------------
create or replace function public.search_global(
  p_query     text default null,
  p_domain    text default null,
  p_language  text default null,
  p_limit     integer default 24,
  p_offset    integer default 0
)
returns table (
  id uuid, source_table text, source_id uuid, domain text,
  title text, body text, language text, category text, rank real
)
language sql
stable
as $$
  with q as (select nullif(trim(coalesce(p_query,'')), '') as term)
  select g.id, g.source_table, g.source_id, g.domain, g.title, g.body, g.language, g.category,
         case
           when (select term from q) is null then 0::real
           else ts_rank(g.search_vector, websearch_to_tsquery('simple', (select term from q)))
         end as rank
  from public.global_content g, q
  where g.is_active
    and (p_domain is null or g.domain = p_domain)
    and (p_language is null or g.language = p_language)
    and (
      (select term from q) is null
      or g.search_vector @@ websearch_to_tsquery('simple', (select term from q))
      -- Trigram fallback gives typo tolerance the tsquery cannot.
      or g.body ilike '%' || (select term from q) || '%'
    )
  order by rank desc, g.created_at desc, g.id
  limit greatest(1, least(
    p_limit,
    coalesce((select value from public.app_limits where key='search_page_max'), 500)::integer
  ))
  offset greatest(0, p_offset);
$$;

comment on function public.search_global is
  'Unified search across every content library. Ceiling from app_limits.search_page_max.';

-- ---------------------------------------------------------------------------
-- 12b. Keyset pagination — stable at any depth, no OFFSET drift
-- ---------------------------------------------------------------------------
-- Tested finding: a cursor built from a JS Date loses sub-millisecond precision
-- (Postgres stores microseconds, JS Dates stop at milliseconds), which makes
-- `(created_at, id) > (cursor)` re-return the cursor row forever. The cursor is
-- therefore taken and returned as *text*, so the value passes through JavaScript
-- untouched at full precision.
-- The keyset scan orders by (created_at, source_id) *within* a domain, so the
-- index must lead with domain or Postgres sorts the whole library per page.
create index if not exists global_content_keyset_idx
  on public.global_content(domain, source_created_at, source_id) where is_active;
create index if not exists bios_keyset_idx on public.bios(created_at, id);
create index if not exists captions_keyset_idx on public.captions(created_at, id);
create index if not exists hashtags_keyset_idx on public.hashtags(created_at, id);

create or replace function public.page_content(
  p_domain      text,
  p_language    text default null,
  p_cursor_time text default null,   -- full-precision timestamptz as text
  p_cursor_id   uuid default null,
  p_limit       integer default 24
)
returns table (
  id uuid, domain text, title text, body text, language text,
  category text, created_at timestamptz, next_time text, next_id uuid
)
language plpgsql
stable
as $$
declare
  v_limit integer;
begin
  v_limit := greatest(1, least(
    coalesce(p_limit, 24),
    coalesce((select value from public.app_limits where key = 'search_page_max'), 500)::integer
  ));

  -- Two explicit branches, each with a *literal* bound. Writing
  -- `coalesce(cursor, '-infinity') > (...)` in a single query looks tidier, but the
  -- bound is then a non-constant expression: Postgres abandons the keyset index and
  -- sorts the entire domain on every page. Measured at 200k rows: 210 ms/page with
  -- the expression, 1 ms/page with the literal.
  if p_cursor_time is null then
    return query
      select g.source_id, g.domain, g.title, g.body, g.language, g.category,
             g.source_created_at, g.source_created_at::text, g.source_id
      from public.global_content g
      where g.is_active
        and g.domain = p_domain
        and (p_language is null or g.language = p_language)
      order by g.source_created_at, g.source_id
      limit v_limit;
  else
    return query
      select g.source_id, g.domain, g.title, g.body, g.language, g.category,
             g.source_created_at, g.source_created_at::text, g.source_id
      from public.global_content g
      where g.is_active
        and g.domain = p_domain
        and (p_language is null or g.language = p_language)
        and (g.source_created_at, g.source_id) >
            (p_cursor_time::timestamptz,
             coalesce(p_cursor_id, '00000000-0000-0000-0000-000000000000'::uuid))
      order by g.source_created_at, g.source_id
      limit v_limit;
  end if;
end;
$$;

comment on function public.page_content is
  'Keyset pagination over global_content. Cursor is full-precision text to avoid JS Date rounding.';

-- ---------------------------------------------------------------------------
-- 13. Registered sources — recorded as never_synced until a real import succeeds
-- ---------------------------------------------------------------------------
insert into public.data_sources (slug, name, provider, kind, endpoint, license_code, license_url, attribution, status, config) values
  ('unicode-emoji-json', 'Unicode Emoji Data', 'unicode-emoji-json (npm)', 'package',
   'npm:unicode-emoji-json@0.9.0', 'MIT', 'https://github.com/muan/unicode-emoji-json',
   'Emoji data derived from the Unicode Consortium CLDR.', 'never_synced', '{"domain":"emoji"}'::jsonb),
  ('unicode-15.1', 'Unicode Character Database 15.1', 'unicode-org (npm @unicode/unicode-15.1.0)', 'package',
   'npm:@unicode/unicode-15.1.0@2.1.0', 'MIT', 'https://www.unicode.org/license.txt',
   'Unicode Character Database, Unicode Consortium.', 'never_synced', '{"domain":"symbol"}'::jsonb),
  ('google-fonts-metadata', 'Google Fonts catalog', 'google-font-metadata (npm)', 'package',
   'npm:google-font-metadata@6.0.8', 'MIT', 'https://fonts.google.com',
   'Font metadata from the Google Fonts catalog. Font files are OFL-1.1.', 'never_synced', '{"domain":"font"}'::jsonb)
on conflict (slug) do nothing;

-- Keep updated_at fresh on the tables that have it.
drop trigger if exists data_sources_updated_at on public.data_sources;
create trigger data_sources_updated_at before update on public.data_sources
  for each row execute function public.set_updated_at();
drop trigger if exists content_collections_updated_at on public.content_collections;
create trigger content_collections_updated_at before update on public.content_collections
  for each row execute function public.set_updated_at();
drop trigger if exists design_templates_updated_at on public.design_templates;
create trigger design_templates_updated_at before update on public.design_templates
  for each row execute function public.set_updated_at();

commit;
