-- BioCraft — Row Level Security.
-- Guest-first: anonymous visitors may READ active content only.
-- Nobody anonymous may write. Writes will go through a future secure admin
-- environment using the service role, which bypasses RLS by design.

alter table public.platforms         enable row level security;
alter table public.categories        enable row level security;
alter table public.bios              enable row level security;
alter table public.generators        enable row level security;
alter table public.fonts             enable row level security;
alter table public.symbols           enable row level security;
alter table public.emoji_collections enable row level security;
alter table public.hashtags          enable row level security;
alter table public.captions          enable row level security;
alter table public.seo_pages         enable row level security;

-- Drop pre-existing copies of the policies so the migration is re-runnable.
drop policy if exists "platforms_public_read"         on public.platforms;
drop policy if exists "categories_public_read"        on public.categories;
drop policy if exists "bios_public_read"              on public.bios;
drop policy if exists "generators_public_read"        on public.generators;
drop policy if exists "fonts_public_read"             on public.fonts;
drop policy if exists "symbols_public_read"           on public.symbols;
drop policy if exists "emoji_collections_public_read" on public.emoji_collections;
drop policy if exists "hashtags_public_read"          on public.hashtags;
drop policy if exists "captions_public_read"          on public.captions;
drop policy if exists "seo_pages_public_read"         on public.seo_pages;

create policy "platforms_public_read"         on public.platforms         for select to anon, authenticated using (is_active);
create policy "categories_public_read"        on public.categories        for select to anon, authenticated using (is_active);
create policy "bios_public_read"              on public.bios              for select to anon, authenticated using (is_active);
create policy "generators_public_read"        on public.generators        for select to anon, authenticated using (is_active);
create policy "fonts_public_read"             on public.fonts             for select to anon, authenticated using (is_active);
create policy "symbols_public_read"           on public.symbols           for select to anon, authenticated using (is_active);
create policy "emoji_collections_public_read" on public.emoji_collections for select to anon, authenticated using (is_active);
create policy "hashtags_public_read"          on public.hashtags          for select to anon, authenticated using (is_active);
create policy "captions_public_read"          on public.captions          for select to anon, authenticated using (is_active);
create policy "seo_pages_public_read"         on public.seo_pages         for select to anon, authenticated using (is_active);

-- No INSERT/UPDATE/DELETE policies are created for anon or authenticated roles.
-- Belt and braces: strip write privileges explicitly.
revoke insert, update, delete, truncate on public.platforms         from anon, authenticated;
revoke insert, update, delete, truncate on public.categories        from anon, authenticated;
revoke insert, update, delete, truncate on public.bios              from anon, authenticated;
revoke insert, update, delete, truncate on public.generators        from anon, authenticated;
revoke insert, update, delete, truncate on public.fonts             from anon, authenticated;
revoke insert, update, delete, truncate on public.symbols           from anon, authenticated;
revoke insert, update, delete, truncate on public.emoji_collections from anon, authenticated;
revoke insert, update, delete, truncate on public.hashtags          from anon, authenticated;
revoke insert, update, delete, truncate on public.captions          from anon, authenticated;
revoke insert, update, delete, truncate on public.seo_pages         from anon, authenticated;

-- The anon role should not be able to read inactive rows through any path;
-- the policies above already enforce that for direct table access.
