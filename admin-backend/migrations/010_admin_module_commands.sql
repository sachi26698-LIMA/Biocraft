-- LOCAL SYNTHETIC FIXTURES ONLY. NOT APPROVED FOR SHARED PROJECT EXECUTION.
-- Read commands for authorized Admin modules plus reviewed setting/staff
-- mutations. Requires 001-003 and trusted request identity context. No client
-- grants. All functions are security definer owned by the migration executor;
-- a dedicated low-privilege owner and full grant review are required before any
-- shared use. A SQL-capable caller can spoof request GUCs.
begin;

-- Platforms are public configuration; Admin sees inactive rows as well.
create function bc_admin_v1.list_platforms(p_limit integer,p_after uuid)
returns table(id uuid,name text,slug text,description text,is_active boolean,sort_order integer)
language plpgsql security definer set search_path=pg_catalog as $$
begin
 perform bc_admin_v1.require_actor('content.read');
 if p_limit is null or p_limit<1 or p_limit>100 then raise exception 'invalid page' using errcode='22023'; end if;
 return query select p.id,p.name,p.slug,p.description,p.is_active,p.sort_order from public.platforms p
  where p_after is null or p.id>p_after order by p.id limit p_limit;
end $$;

-- Categories double as public collections for bios; the Admin list includes
-- inactive rows and the linked platform slug.
create function bc_admin_v1.list_categories(p_limit integer,p_after uuid)
returns table(id uuid,name text,slug text,description text,platform_slug text,is_active boolean,sort_order integer)
language plpgsql security definer set search_path=pg_catalog as $$
begin
 perform bc_admin_v1.require_actor('content.read');
 if p_limit is null or p_limit<1 or p_limit>100 then raise exception 'invalid page' using errcode='22023'; end if;
 return query select c.id,c.name,c.slug,c.description,p.slug,c.is_active,c.sort_order
  from public.categories c left join public.platforms p on p.id=c.platform_id
  where p_after is null or c.id>p_after order by c.id limit p_limit;
end $$;

-- Collection groups are derived from bios.source_slug, the same grouping the
-- public catalog uses. No separate collection table exists.
create function bc_admin_v1.list_collections(p_limit integer,p_after text)
returns table(source_slug text,active_bios bigint,archived_bios bigint)
language plpgsql security definer set search_path=pg_catalog as $$
begin
 perform bc_admin_v1.require_actor('content.read');
 if p_limit is null or p_limit<1 or p_limit>100 then raise exception 'invalid page' using errcode='22023'; end if;
 if p_after is not null and (p_after='' or length(p_after)>200 or p_after !~ '^[a-z0-9][a-z0-9-]*$') then
  raise exception 'invalid page' using errcode='22023'; end if;
 return query select b.source_slug,count(*) filter(where b.is_active),count(*) filter(where not b.is_active)
  from public.bios b where b.source_slug is not null
   and (p_after is null or b.source_slug>p_after)
  group by b.source_slug order by b.source_slug limit p_limit;
end $$;

create function bc_admin_v1.list_generators(p_limit integer,p_after uuid)
returns table(id uuid,name text,slug text,generator_type text,character_limit integer,is_active boolean,platform_slug text)
language plpgsql security definer set search_path=pg_catalog as $$
begin
 perform bc_admin_v1.require_actor('content.read');
 if p_limit is null or p_limit<1 or p_limit>100 then raise exception 'invalid page' using errcode='22023'; end if;
 return query select g.id,g.name,g.slug,g.generator_type,g.character_limit,g.is_active,p.slug
  from public.generators g left join public.platforms p on p.id=g.platform_id
  where p_after is null or g.id>p_after order by g.id limit p_limit;
end $$;

create function bc_admin_v1.list_seo_pages(p_limit integer,p_after uuid)
returns table(id uuid,page_slug text,title text,meta_description text,robots text,is_active boolean,updated_at timestamptz)
language plpgsql security definer set search_path=pg_catalog as $$
begin
 perform bc_admin_v1.require_actor('content.read');
 if p_limit is null or p_limit<1 or p_limit>100 then raise exception 'invalid page' using errcode='22023'; end if;
 return query select s.id,s.page_slug,s.title,s.meta_description,s.robots,s.is_active,s.updated_at
  from public.seo_pages s where p_after is null or s.id>p_after order by s.id limit p_limit;
end $$;

-- Aggregate-only reporting. No per-visitor data, no export and no retention
-- policy is implemented; values are database counts, not analytics telemetry.
create function bc_admin_v1.analytics_overview()
returns table(metric text,value bigint)
language plpgsql security definer set search_path=pg_catalog as $$
begin
 perform bc_admin_v1.require_actor('analytics.read');
 return query
  select 'bios.active',count(*) filter(where is_active) from public.bios
  union all select 'bios.archived',count(*) filter(where not is_active) from public.bios
  union all select 'categories.total',count(*) from public.categories
  union all select 'platforms.total',count(*) from public.platforms
  union all select 'generators.total',count(*) from public.generators
  union all select 'seo_pages.total',count(*) from public.seo_pages
  union all select 'admin.drafts.in_review',count(*) from bc_admin_v1.admin_drafts where state='in_review'
  union all select 'admin.drafts.approved',count(*) from bc_admin_v1.admin_drafts where state='approved'
  union all select 'admin.audit.last_24h',count(*) from bc_admin_v1.admin_audit_logs where occurred_at>now()-interval '24 hours'
  union all select 'admin.sessions.active',count(*) from bc_admin_v1.admin_sessions where revoked_at is null and expires_at>now();
end $$;

create function bc_admin_v1.list_settings(p_limit integer,p_after text)
returns table(key text,value jsonb,version bigint,updated_at timestamptz)
language plpgsql security definer set search_path=pg_catalog as $$
begin
 perform bc_admin_v1.require_actor('settings.read');
 if p_limit is null or p_limit<1 or p_limit>100 then raise exception 'invalid page' using errcode='22023'; end if;
 if p_after is not null and (p_after='' or length(p_after)>100) then raise exception 'invalid page' using errcode='22023'; end if;
 return query select s.key,s.value,s.version,s.updated_at from bc_admin_v1.admin_settings s
  where p_after is null or s.key>p_after order by s.key limit p_limit;
end $$;

-- Settings are configuration records only. They do not alter the public site,
-- provider account, deployment or RLS. Step-up freshness is enforced by the
-- server executor, not here.
create function bc_admin_v1.update_setting(p_key text,p_value jsonb,p_expected bigint,p_request uuid)
returns bigint
language plpgsql security definer set search_path=pg_catalog as $$
declare actor uuid; current_version bigint; next_version bigint;
begin
 actor:=bc_admin_v1.require_actor('settings.manage');
 if p_request is null or p_expected is null or p_key is null or p_key !~ '^[a-z][a-z0-9_.-]{0,99}$'
    or p_value is null or jsonb_typeof(p_value)<>'object' or pg_column_size(p_value)>16384 then
  raise exception 'invalid setting' using errcode='22023'; end if;
 -- Unknown keys may only be created by an explicit expected version 1; an
 -- existing key requires its exact current version. Absent rows are never
 -- silently created by a concurrent writer's stale expectation.
 select s.version into current_version from bc_admin_v1.admin_settings s where s.key=p_key for update;
 if current_version is null then
  if p_expected<>1 then raise exception 'setting unavailable' using errcode='42501'; end if;
  insert into bc_admin_v1.admin_settings(key,value,version,updated_by) values(p_key,p_value,1,actor);
  next_version:=1;
 else
  if current_version<>p_expected then raise exception 'stale version' using errcode='40001'; end if;
  next_version:=current_version+1;
  update bc_admin_v1.admin_settings set value=p_value,version=next_version,updated_at=now(),updated_by=actor where key=p_key;
 end if;
 insert into bc_admin_v1.admin_audit_logs(actor_id,request_id,action,target_type,target_id,details)
 values(actor,p_request,'setting.update','setting',p_key,jsonb_build_object('version',next_version));
 return next_version;
end $$;

-- Role catalog for the staff screen. Not an authorization boundary.
create function bc_admin_v1.list_role_catalog()
returns table(id text,description text,permissions text[])
language plpgsql security definer set search_path=pg_catalog as $$
begin
 perform bc_admin_v1.require_actor('staff.read');
 return query select r.id,r.description,
  coalesce(array_agg(rp.permission_id order by rp.permission_id) filter(where rp.permission_id is not null),array[]::text[])
  from bc_admin_v1.admin_roles r left join bc_admin_v1.admin_role_permissions rp on rp.role_id=r.id
  group by r.id,r.description order by r.id;
end $$;

-- Own session history only; users never enumerate other administrators here.
create function bc_admin_v1.list_my_sessions(p_limit integer,p_before timestamptz)
returns table(id uuid,created_at timestamptz,expires_at timestamptz,revoked_at timestamptz)
language plpgsql security definer set search_path=pg_catalog as $$
declare actor uuid;
begin
 actor:=bc_admin_v1.require_actor('dashboard.read');
 if p_limit is null or p_limit<1 or p_limit>100 or (p_before is not null and extract(epoch from p_before) is null) then raise exception 'invalid page' using errcode='22023'; end if;
 return query select s.id,s.created_at,s.expires_at,s.revoked_at from bc_admin_v1.admin_sessions s
  where s.user_id=actor and (p_before is null or s.created_at<p_before)
  order by s.created_at desc limit p_limit;
end $$;

-- Redacted audit view: no request payloads, only identifiers and outcomes.
create function bc_admin_v1.list_audit_logs(p_limit integer,p_before bigint)
returns table(id bigint,actor_id uuid,action text,target_type text,target_id text,occurred_at timestamptz,details jsonb)
language plpgsql security definer set search_path=pg_catalog as $$
begin
 perform bc_admin_v1.require_actor('audit.read');
 if p_limit is null or p_limit<1 or p_limit>100 or (p_before is not null and p_before<0) then
  raise exception 'invalid page' using errcode='22023'; end if;
 return query select a.id,a.actor_id,a.action,a.target_type,a.target_id,a.occurred_at,a.details
  from bc_admin_v1.admin_audit_logs a where p_before is null or a.id<p_before
  order by a.id desc limit p_limit;
end $$;

revoke all on function bc_admin_v1.list_platforms(integer,uuid),bc_admin_v1.list_categories(integer,uuid),
 bc_admin_v1.list_collections(integer,text),bc_admin_v1.list_generators(integer,uuid),
 bc_admin_v1.list_seo_pages(integer,uuid),bc_admin_v1.analytics_overview(),
 bc_admin_v1.list_settings(integer,text),bc_admin_v1.update_setting(text,jsonb,bigint,uuid),
 bc_admin_v1.list_role_catalog(),bc_admin_v1.list_my_sessions(integer,timestamptz),
 bc_admin_v1.list_audit_logs(integer,bigint)
 from public,anon,authenticated;
commit;
