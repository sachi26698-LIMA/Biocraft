-- Forward repair for the split hosted 0006. Do not replay the foundation or
-- rewrite supabase_migrations. The two public RPCs remain invoker/RLS reads.
begin;
set local lock_timeout = '3s';

insert into public.data_sources (slug,name,provider,kind,endpoint,license_code,license_url,attribution,config) values
 ('unicode-emoji-json','Unicode Emoji Data','unicode-emoji-json (npm)','package','npm:unicode-emoji-json@0.9.0','MIT','https://github.com/muan/unicode-emoji-json','Emoji data derived from the Unicode Consortium CLDR.','{"domain":"emoji"}'),
 ('unicode-15.1','Unicode Character Database 15.1','unicode-org (npm @unicode/unicode-15.1.0)','package','npm:@unicode/unicode-15.1.0@2.1.0','MIT','https://www.unicode.org/license.txt','Unicode Character Database, Unicode Consortium.','{"domain":"symbol"}'),
 ('google-fonts-metadata','Google Fonts catalog','google-font-metadata (npm)','package','npm:google-font-metadata@6.0.8','MIT','https://fonts.google.com','Google Fonts catalogue metadata, not font files.','{"domain":"font"}'),
 ('biocraft-catalogue','BioCraft published catalogue','BioCraft','manual',null,'BIOCRAFT',null,'Derived search index for the six original BioCraft content tables.','{"domain":"catalogue"}')
on conflict (slug) do nothing;

create or replace trigger data_sources_updated_at before update on public.data_sources
 for each row execute function public.set_updated_at();
create or replace trigger content_collections_updated_at before update on public.content_collections
 for each row execute function public.set_updated_at();
create or replace trigger design_templates_updated_at before update on public.design_templates
 for each row execute function public.set_updated_at();

create or replace function public.search_global(p_query text default null, p_domain text default null, p_language text default null, p_limit integer default 24, p_offset integer default 0)
returns table(id uuid,source_table text,source_id uuid,domain text,title text,body text,language text,category text,rank real)
language sql stable security invoker set search_path = pg_catalog as $$
 with q as (select nullif(btrim(p_query),'') term)
 select g.id,g.source_table,g.source_id,g.domain,g.title,g.body,g.language,g.category,
        case when q.term is null then 0::real else ts_rank(g.search_vector,websearch_to_tsquery('simple',q.term)) end as rank
 from public.global_content g cross join q
 where g.is_active and (p_domain is null or g.domain=p_domain) and (p_language is null or g.language=p_language)
   and (q.term is null or g.search_vector @@ websearch_to_tsquery('simple',q.term) or g.body ilike '%'||q.term||'%')
 order by rank desc,g.created_at desc,g.id
 limit greatest(1,least(coalesce(p_limit,24),coalesce((select value::integer from public.app_limits where key='search_page_max'),500))) offset greatest(0,p_offset);
$$;

-- 0007's existing keyset reader is the same contract plus a licence column.
create or replace function public.page_content(p_domain text,p_language text default null,p_cursor_time text default null,p_cursor_id uuid default null,p_limit integer default 24)
returns table(id uuid,domain text,title text,body text,language text,category text,created_at timestamptz,next_time text,next_id uuid)
language sql stable security invoker set search_path = pg_catalog as $$
 select p.id,p.domain,p.title,p.body,p.language,p.category,p.created_at,p.next_time,p.next_id
 from public.library_page(p_domain,p_language,p_cursor_time,p_cursor_id,p_limit) p;
$$;
revoke all on function public.search_global(text,text,text,integer,integer), public.page_content(text,text,text,uuid,integer) from public;
grant execute on function public.search_global(text,text,text,integer,integer), public.page_content(text,text,text,uuid,integer) to anon, authenticated;
commit;
