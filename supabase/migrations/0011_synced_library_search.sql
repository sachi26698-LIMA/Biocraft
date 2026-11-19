-- The legacy reader only knew about emoji_collections and returned placeholder
-- provenance even for source-owned fonts/symbols. Keep its signature and RLS.
-- No table rewrites, policies, new privileges or content changes.
begin;
set local lock_timeout='3s';
create or replace function public.search_library(
  p_query text default null, p_domain text default null, p_category text default null,
  p_language text default null, p_sort text default 'relevance', p_cursor_time text default null,
  p_cursor_id uuid default null, p_limit integer default 48
) returns table (
  id uuid, domain text, slug text, label text, category text, language text, license_code text,
  source_slug text, attribution text, verification_status text, preview text,
  created_at timestamptz, next_time text, next_id uuid
) language plpgsql stable security invoker set search_path=pg_catalog as $$
declare
  q text := nullif(btrim(p_query),'');
  d text := nullif(btrim(p_domain),'');
  lim integer := greatest(1, least(coalesce(p_limit,48),coalesce((select value from public.app_limits where key='search_page_max'),500)::integer));
  cursor_at timestamptz := p_cursor_time::timestamptz;
  cursor_id uuid := coalesce(p_cursor_id,'00000000-0000-0000-0000-000000000000'::uuid);
begin
  return query
  with catalogue(id,domain,slug,label,category,language,license_code,source_id,credit,verification,preview,created_at) as not materialized (
    select i.id,'icon'::text,i.slug,i.label,i.category,i.language,i.license_code,i.source_id,i.attribution,i.verification_status,null::text,i.created_at from public.icon_library i where i.is_active
    union all
    select p.id,'palette',p.slug,p.title,p.mood,p.language,p.license_code,p.source_id,p.attribution,p.verification_status,array_to_string(p.colors,' '),p.created_at from public.color_palettes p where p.is_active
    union all
    select t.id,'template',t.slug,t.title,t.domain,t.language,t.license_code,null::uuid,t.attribution,t.verification_status,t.layout,t.created_at from public.design_templates t where t.is_active
    union all
    select b.id,'preset',b.slug,b.title,b.kind,b.language,null::text,null::uuid,b.attribution,b.verification_status,b.value,b.created_at from public.design_presets b where b.is_active
    union all
    select f.id,'font',f.slug,f.name,f.category,f.language,f.license_code,f.source_id,f.attribution,f.verification_status,f.preview_text,f.created_at from public.fonts f where f.is_active
    union all
    select y.id,'symbol',y.id::text,coalesce(y.title,y.symbol),y.category,y.language,y.license_code,y.source_id,y.attribution,y.verification_status,y.symbol,y.created_at from public.symbols y where y.is_active
    union all
    select e.id,'emoji',e.id::text,e.emoji,e.category,e.language,'UNICODE',null::uuid,e.attribution,e.verification_status,e.keywords,e.created_at from public.emoji_collections e where e.is_active
    union all
    select e.id,'emoji',e.slug,e.name,e.group_name,e.language,e.license_code,e.source_id,e.attribution,e.verification_status,e.emoji,e.created_at from public.emoji_library e where e.is_active
  ), ranked as not materialized (
    select c.*,s.slug as provider_slug,coalesce(c.credit,s.attribution) as display_credit,
           case when p_sort='relevance' and q is not null and c.label ilike q||'%' then 0 else 1 end as bucket,
           case when p_sort='az' then c.label else '' end as alpha
    from catalogue c left join public.data_sources s on s.id=c.source_id
    where (c.source_id is null or s.status<>'disabled')
      and (d is null or c.domain=d) and (p_category is null or c.category=p_category)
      and (p_language is null or c.language is null or c.language=p_language)
      and (q is null or c.label ilike '%'||q||'%' or c.slug ilike '%'||q||'%'
           or (c.domain='emoji' and c.preview ilike '%'||q||'%') or (c.domain='symbol' and c.preview=q))
  ), anchor as (
    select a.bucket,a.alpha from ranked a where a.id=p_cursor_id and a.created_at=cursor_at
  )
  select r.id,r.domain,r.slug,r.label,r.category,r.language,r.license_code,r.provider_slug,
         r.display_credit,r.verification,r.preview,r.created_at,r.created_at::text,r.id
  from ranked r
  where cursor_at is null or case
    when p_sort='az' or (p_sort='relevance' and q is not null) then exists (
      select 1 from anchor a where (r.bucket,r.alpha)>(a.bucket,a.alpha)
        or ((r.bucket,r.alpha)=(a.bucket,a.alpha) and (r.created_at,r.id)<(cursor_at,cursor_id)))
    else (r.created_at,r.id)<(cursor_at,cursor_id) end
  order by r.bucket,r.alpha,r.created_at desc,r.id desc limit lim;
end $$;
-- CREATE OR REPLACE preserves 0008's ACL (anon/authenticated execute, not PUBLIC).
commit;
