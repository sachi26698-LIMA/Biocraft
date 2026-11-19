-- Optional private catalogue workspace. Not applied to the shared project.
-- Run as the reviewed private schema owner; never grant table access to the API.
begin;
create table bc_admin_v1.catalog_drafts (
 id uuid primary key default gen_random_uuid(),
 author_id uuid not null references bc_admin_v1.admin_users(id) on delete restrict,
 domain text not null check (domain in ('templates','fonts','designs','categories','collections','platforms','generators','symbols','emoji','languages','seo')),
 resource_key text not null check (resource_key ~ '^[a-z0-9][a-z0-9_-]{0,99}$'),
 title text not null check (length(btrim(title))>0 and length(title)<=200),
 notes text not null check (length(notes)<=4000),
 source_label text not null check (length(btrim(source_label))>0 and length(source_label)<=300),
 license_code text not null check (license_code ~ '^[A-Za-z0-9][A-Za-z0-9.+_-]{0,63}$'),
 row_version bigint not null default 1 check (row_version>0),
 archived_at timestamptz
);
create unique index catalog_draft_active_key on bc_admin_v1.catalog_drafts(author_id,domain,resource_key) where archived_at is null;
create index catalog_draft_page on bc_admin_v1.catalog_drafts(author_id,domain,id) where archived_at is null;
alter table bc_admin_v1.catalog_drafts enable row level security;
revoke all on bc_admin_v1.catalog_drafts from public,anon,authenticated,service_role;

create function bc_admin_v1.list_catalog_drafts(p_domain text,p_limit integer,p_after uuid)
returns table(id uuid,resource_key text,title text,notes text,source_label text,license_code text,row_version bigint)
language plpgsql security definer set search_path=pg_catalog as $$
declare actor uuid;
begin
 actor:=bc_admin_v1.require_actor(case when p_domain='seo' then 'seo.draft' else 'content.draft' end);
 if p_limit is null or p_limit not between 1 and 100 then raise exception 'invalid page' using errcode='22023'; end if;
 return query select d.id,d.resource_key,d.title,d.notes,d.source_label,d.license_code,d.row_version
 from bc_admin_v1.catalog_drafts d where d.author_id=actor and d.domain=p_domain and d.archived_at is null
 and (p_after is null or d.id>p_after) order by d.id limit p_limit;
end $$;

create function bc_admin_v1.change_catalog_draft(p_domain text,p_action text,p_id uuid,p_expected bigint,p_fields jsonb,p_request uuid)
returns table(draft_id uuid,row_version bigint)
language plpgsql security definer set search_path=pg_catalog as $$
declare actor uuid; item uuid; version_no bigint;
begin
 actor:=bc_admin_v1.require_actor(case when p_domain='seo' then 'seo.draft' else 'content.draft' end);
 if p_action is null or p_action not in ('create','edit','archive') or p_domain is null or p_request is null then
  raise exception 'invalid change' using errcode='22023'; end if;
 if p_action<>'archive' then
  if jsonb_typeof(p_fields) is distinct from 'object' or octet_length(p_fields::text)>24000 then raise exception 'invalid fields' using errcode='22023'; end if;
  if not (p_fields ?& array['key','title','notes','source','license']) or
    exists(select 1 from jsonb_each(p_fields) f where f.key not in ('key','title','notes','source','license') or jsonb_typeof(f.value)<>'string') then
   raise exception 'invalid fields' using errcode='22023'; end if;
 elsif p_fields is not null then raise exception 'invalid archive' using errcode='22023'; end if;
 if p_action='create' then
  if p_id is not null or p_expected is not null then raise exception 'invalid create' using errcode='22023'; end if;
  insert into bc_admin_v1.catalog_drafts as d(author_id,domain,resource_key,title,notes,source_label,license_code)
  values(actor,p_domain,p_fields->>'key',p_fields->>'title',p_fields->>'notes',p_fields->>'source',p_fields->>'license') returning d.id,d.row_version into item,version_no;
 else
  if p_id is null or p_expected is null or p_expected<1 then raise exception 'invalid change' using errcode='22023'; end if;
  select d.id,d.row_version into item,version_no from bc_admin_v1.catalog_drafts d
   where d.id=p_id and d.author_id=actor and d.domain=p_domain and d.archived_at is null for update;
  if not found then raise exception 'draft not found' using errcode='P0002'; end if;
  if version_no<>p_expected then raise exception 'stale version' using errcode='40001'; end if;
  version_no:=version_no+1;
  if p_action='archive' then
   update bc_admin_v1.catalog_drafts set archived_at=now(),row_version=version_no where id=item;
  else
   update bc_admin_v1.catalog_drafts set resource_key=p_fields->>'key',title=p_fields->>'title',notes=p_fields->>'notes',
    source_label=p_fields->>'source',license_code=p_fields->>'license',row_version=version_no where id=item;
  end if;
 end if;
 insert into bc_admin_v1.admin_audit_logs(actor_id,request_id,action,target_type,target_id)
 values(actor,p_request,'catalog_draft.'||p_action,p_domain,item::text);
 return query select item,version_no;
end $$;
revoke all on function bc_admin_v1.list_catalog_drafts(text,integer,uuid),bc_admin_v1.change_catalog_draft(text,text,uuid,bigint,jsonb,uuid) from public,anon,authenticated,service_role;
commit;
