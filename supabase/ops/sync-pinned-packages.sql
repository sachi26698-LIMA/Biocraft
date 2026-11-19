-- Optional one-shot, operator-authorized transfer when there is no trusted
-- runner DSN. No credentials leave the database. No remote SQL is executed.
-- Requires the http extension to be AVAILABLE BUT NOT INSTALLED. Plain CREATE
-- fails on collisions: never remove an existing extension/schema. PostgreSQL
-- rolls back all DDL/data together. The private transport is dropped before
-- COMMIT and is never visible to other sessions. No permanent function or role.
begin;
set local lock_timeout='3s';
set local statement_timeout='45s';
create schema bc_catalogue_transfer_once;
revoke all on schema bc_catalogue_transfer_once from public, anon, authenticated;
create extension http with schema bc_catalogue_transfer_once;
set local http.curlopt_timeout_ms='10000';
set local http.curlopt_connecttimeout_ms='3000';
create temp table bc_package_payload(source text primary key, doc jsonb not null) on commit drop;
do $$
declare p record; reply bc_catalogue_transfer_once.http_response; bytes bytea;
begin
 for p in select * from (values
  ('unicode-emoji-json','https://api.github.com/repos/muan/unicode-emoji-json/git/blobs/66a1dd6dfc38d3873c1ede0239b6484f085968cb','2ebd44d5c66459b48aadbb34ad21161850da6c9b74036dce9097b2bfad9b2c23'),
  ('google-fonts-metadata','https://api.github.com/repos/fontsource/google-font-metadata/git/blobs/3216130f0f5de0a434c0f6bb2bf284853469ac00','2a6c23d5711386e9dd9c756a3c12f863b2f4056036614367646b6998c66c1f4e')
 ) v(source,uri,sha) loop
  select * into reply from bc_catalogue_transfer_once.http(('GET',p.uri,array[bc_catalogue_transfer_once.http_header('User-Agent','BioCraft-catalogue-import')],null,null)::bc_catalogue_transfer_once.http_request);
  if reply.status<>200 or octet_length(reply.content)>1000000 then raise exception 'Source download failed'; end if;
  bytes:=decode(reply.content::jsonb->>'content','base64');
  if encode(sha256(bytes),'hex') is distinct from p.sha then raise exception 'Source digest mismatch'; end if;
  insert into pg_temp.bc_package_payload values(p.source,convert_from(bytes,'UTF8')::jsonb);
 end loop;
end $$;
drop extension http restrict;
drop schema bc_catalogue_transfer_once restrict;
-- Data phase. The two immutable package blobs above are the same bytes as npm ci.
do $$ begin
 if not exists (select 1 from public.data_sources where slug='unicode-emoji-json' and status<>'disabled' for update) then raise exception 'Source missing or disabled'; end if;
 if exists (select 1 from public.data_sync_jobs where source_id=(select id from public.data_sources where slug='unicode-emoji-json') and status in ('queued','running')) then raise exception 'Source has an active sync'; end if;
end $$;
with incoming as materialized (select e.key emoji,e.value->>'name' name,e.value->>'slug' slug,e.value->>'group' group_name,e.value->>'unicode_version' unicode_version,e.value->>'emoji_version' emoji_version,coalesce((e.value->>'skin_tone_support')::boolean,false) skin_tone_support
 from pg_temp.bc_package_payload p cross join lateral jsonb_each(p.doc) e where p.source='unicode-emoji-json'),
added as (
 insert into public.emoji_library (emoji,name,slug,group_name,unicode_version,emoji_version,skin_tone_support,license_code,source_id)
 select s.emoji,s.name,s.slug,s.group_name,s.unicode_version,s.emoji_version,s.skin_tone_support,'MIT',(select id from public.data_sources where slug='unicode-emoji-json') from incoming s
 on conflict (emoji) do nothing returning 1
), changed as (
 update public.emoji_library t set (name,slug,group_name,unicode_version,emoji_version,skin_tone_support,license_code)=(s.name,s.slug,s.group_name,s.unicode_version,s.emoji_version,s.skin_tone_support,'MIT') from incoming s
 where t.emoji=s.emoji and t.source_id=(select id from public.data_sources where slug='unicode-emoji-json')
 and (t.name,t.slug,t.group_name,t.unicode_version,t.emoji_version,t.skin_tone_support,t.license_code) is distinct from (s.name,s.slug,s.group_name,s.unicode_version,s.emoji_version,s.skin_tone_support,'MIT') returning 1
), counts as (
 select (select count(*)::int from incoming) n,(select count(*)::int from added) a,(select count(*)::int from changed) c
), job as (
 insert into public.data_sync_jobs(source_id,status,mode,started_at,finished_at,attempts,items_seen,items_inserted,items_updated,items_skipped)
 select (select id from public.data_sources where slug='unicode-emoji-json'),'succeeded','full',transaction_timestamp(),clock_timestamp(),1,n,a,c,n-a-c from counts returning id,source_id,items_seen,finished_at
), logged as (insert into public.data_sync_logs(job_id,level,message) select id,'info','Synced the pinned package catalogue' from job)
update public.data_sources s set status='ready',last_sync_at=j.finished_at,last_sync_count=j.items_seen,last_error=null from job j where s.id=j.source_id;

do $$ begin
 if not exists (select 1 from public.data_sources where slug='google-fonts-metadata' and status<>'disabled' for update) then raise exception 'Source missing or disabled'; end if;
 if exists (select 1 from public.data_sync_jobs where source_id=(select id from public.data_sources where slug='google-fonts-metadata') and status in ('queued','running')) then raise exception 'Source has an active sync'; end if;
end $$;
with incoming as materialized (select trim(both '-' from regexp_replace(lower(f->>'family'),'[^a-z0-9]+','-','g')) slug,f->>'family' name,f->>'family' family,coalesce(nullif(f->>'category',''),'sans-serif') font_type,f->>'category' category,
 array(select jsonb_array_elements_text(f->'subsets')) subsets,
 array(select w from (select coalesce(substring(v from '^[0-9]{3}'),case when v in ('regular','italic') then '400' end) w,ord from jsonb_array_elements_text(f->'variants') with ordinality x(v,ord)) t where w is not null group by w order by min(ord)) weights,
 array(select case when v like '%italic%' then 'italic' else 'normal' end from jsonb_array_elements_text(f->'variants') with ordinality x(v,ord) group by 1 order by min(ord)) styles,
 exists(select 1 from jsonb_array_elements_text(f->'variants') x(v) where v like '%variable%' or strpos(v,'[')>0) variable,'The quick brown fox jumps over the lazy dog' preview_text
 from pg_temp.bc_package_payload p cross join lateral jsonb_array_elements(p.doc) f where p.source='google-fonts-metadata'),
added as (
 insert into public.fonts (slug,name,family,font_type,category,subsets,weights,styles,variable,preview_text,license_code,source_id)
 select s.slug,s.name,s.family,s.font_type,s.category,s.subsets,s.weights,s.styles,s.variable,s.preview_text,'MIT',(select id from public.data_sources where slug='google-fonts-metadata') from incoming s
 on conflict (slug) do nothing returning 1
), changed as (
 update public.fonts t set (name,family,font_type,category,subsets,weights,styles,variable,preview_text,license_code)=(s.name,s.family,s.font_type,s.category,s.subsets,s.weights,s.styles,s.variable,s.preview_text,'MIT') from incoming s
 where t.slug=s.slug and t.source_id=(select id from public.data_sources where slug='google-fonts-metadata')
 and (t.name,t.family,t.font_type,t.category,t.subsets,t.weights,t.styles,t.variable,t.preview_text,t.license_code) is distinct from (s.name,s.family,s.font_type,s.category,s.subsets,s.weights,s.styles,s.variable,s.preview_text,'MIT') returning 1
), counts as (
 select (select count(*)::int from incoming) n,(select count(*)::int from added) a,(select count(*)::int from changed) c
), job as (
 insert into public.data_sync_jobs(source_id,status,mode,started_at,finished_at,attempts,items_seen,items_inserted,items_updated,items_skipped)
 select (select id from public.data_sources where slug='google-fonts-metadata'),'succeeded','full',transaction_timestamp(),clock_timestamp(),1,n,a,c,n-a-c from counts returning id,source_id,items_seen,finished_at
), logged as (insert into public.data_sync_logs(job_id,level,message) select id,'info','Synced the pinned package catalogue' from job)
update public.data_sources s set status='ready',last_sync_at=j.finished_at,last_sync_count=j.items_seen,last_error=null from job j where s.id=j.source_id;

commit;
