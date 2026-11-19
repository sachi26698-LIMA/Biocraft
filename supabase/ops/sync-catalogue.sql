-- Operator-only reconciliation of the six original content tables to their
-- derived index. No source content or Admin/Auth records are modified. Normal
-- ongoing edits already maintain the index via each table's _global_index trigger.
-- On contention or failure the entire job (including freshness) rolls back.
begin;
set local lock_timeout='2s';
set local statement_timeout='30s';
lock table public.bios, public.captions, public.hashtags, public.symbols, public.fonts, public.emoji_collections in share mode;
do $$ begin
 if not exists (select 1 from public.data_sources where slug='biocraft-catalogue' and status <> 'disabled' for update) then
  raise exception 'BioCraft catalogue source missing or disabled';
 end if;
end $$;
with src(t,id,domain,title,body,language,category,license,provider,active,created) as materialized (
 select 'bios',id,'bio',title,content,language,style_type,license_code,source_id,is_active,created_at from public.bios
 union all select 'captions',id,'caption',title,content,language,tone,license_code,source_id,is_active,created_at from public.captions
 union all select 'hashtags',id,'hashtag',tag,tag,language,null,license_code,source_id,is_active,created_at from public.hashtags
 union all select 'symbols',id,'symbol',coalesce(title,symbol),symbol,null,category,license_code,source_id,is_active,created_at from public.symbols
 union all select 'fonts',id,'font',name,coalesce(family,name),null,coalesce(category,font_type),license_code,source_id,is_active,created_at from public.fonts
 union all select 'emoji_collections',id,'emoji',emoji,emoji,null,category,null,null,is_active,created_at from public.emoji_collections
), added as (
 insert into public.global_content(source_table,source_id,domain,title,body,language,category,license_code,source_id_ref,is_active,source_created_at)
 select s.* from src s where not exists (select 1 from public.global_content g where (g.source_table,g.source_id)=(s.t,s.id))
 returning 1
), corrected as (
 update public.global_content g set (domain,title,body,language,category,license_code,source_id_ref,is_active,source_created_at)=
 (s.domain,s.title,s.body,s.language,s.category,s.license,s.provider,s.active,s.created) from src s
 where (g.source_table,g.source_id)=(s.t,s.id) and
 (g.domain,g.title,g.body,g.language,g.category,g.license_code,g.source_id_ref,g.is_active,g.source_created_at) is distinct from
 (s.domain,s.title,s.body,s.language,s.category,s.license,s.provider,s.active,s.created)
 returning 1
), counts as (
 select (select count(*) from src)::int n,(select count(*) from added)::int a,(select count(*) from corrected)::int c
), job as (
 insert into public.data_sync_jobs(source_id,status,mode,started_at,finished_at,attempts,items_seen,items_inserted,items_updated,items_skipped)
 select s.id,'succeeded','full',transaction_timestamp(),clock_timestamp(),1,n,a,c,n-a-c from public.data_sources s cross join counts where s.slug='biocraft-catalogue'
 returning id,source_id,items_seen,finished_at
), logged as (
 insert into public.data_sync_logs(job_id,level,message) select id,'info','Reconciled the BioCraft public search index' from job
)
update public.data_sources s set status='ready',last_sync_at=j.finished_at,last_sync_count=j.items_seen,last_error=null from job j where s.id=j.source_id;
commit;
