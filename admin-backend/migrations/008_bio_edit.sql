-- LOCAL DISPOSABLE FIXTURES ONLY; unapproved for the shared project.
-- Revision updates are private, optimistic and immutable; publication remains
-- unavailable. Platform-specific length enforcement remains at the gateway.
begin;
create function bc_admin_v1.update_bio_draft(p_draft uuid,p_expected bigint,p_payload jsonb,p_request uuid) returns bigint
language plpgsql security definer set search_path=pg_catalog as $$
declare actor uuid; d bc_admin_v1.admin_drafts%rowtype; old_version bc_admin_v1.admin_content_versions%rowtype;
 new_version uuid; version_number bigint; key_count integer;
begin
 actor:=bc_admin_v1.require_actor('content.draft');
 if p_draft is null or p_request is null or p_expected is null or p_payload is null or jsonb_typeof(p_payload)<>'object' then
  raise exception 'invalid update' using errcode='22023'; end if;
 select count(*) into key_count from jsonb_object_keys(p_payload);
 if key_count<>5 or not (p_payload ?& array['content','language','platform','active','featured'])
  or jsonb_typeof(p_payload->'content') is distinct from 'string' or length(btrim(p_payload->>'content'))=0 or octet_length(p_payload->>'content')>12000
  or jsonb_typeof(p_payload->'language') is distinct from 'string' or p_payload->>'language' not in ('en','hi','hg')
  or jsonb_typeof(p_payload->'platform') is distinct from 'string' or p_payload->>'platform' !~ '^[a-z][a-z0-9_-]{0,49}$'
  or jsonb_typeof(p_payload->'active') is distinct from 'boolean' or jsonb_typeof(p_payload->'featured') is distinct from 'boolean' then
  raise exception 'invalid bio fields' using errcode='22023'; end if;
 select * into d from bc_admin_v1.admin_drafts where id=p_draft for update;
 if not found or d.author_id<>actor or d.state<>'draft' then raise exception 'not authorized' using errcode='42501'; end if;
 if d.row_version<>p_expected then raise exception 'stale version' using errcode='40001'; end if;
 select * into old_version from bc_admin_v1.admin_content_versions where id=d.version_id;
 if old_version.resource_type<>'bio' then raise exception 'not authorized' using errcode='42501'; end if;
 perform pg_advisory_xact_lock(hashtextextended('bc_admin_v1:bio:'||old_version.resource_key,0));
 select coalesce(max(v.version_number),0)+1 into version_number from bc_admin_v1.admin_content_versions v
  where v.resource_type='bio' and v.resource_key=old_version.resource_key;
 insert into bc_admin_v1.admin_content_versions(resource_type,resource_key,version_number,payload,payload_sha256,created_by)
 values('bio',old_version.resource_key,version_number,p_payload,sha256(convert_to(p_payload::text,'UTF8')),actor) returning id into new_version;
 update bc_admin_v1.admin_drafts set version_id=new_version,row_version=row_version+1,updated_at=now() where id=p_draft;
 insert into bc_admin_v1.admin_audit_logs(actor_id,request_id,action,target_type,target_id,details)
 values(actor,p_request,'draft.update','draft',p_draft::text,jsonb_build_object('prior_version',old_version.id,'new_version',new_version));
 return d.row_version+1;
end $$;
create function bc_admin_v1.get_bio_draft(p_draft uuid)
returns table(draft_id uuid,resource_key text,state text,row_version bigint,author_id uuid,assigned_reviewer_id uuid,created_at timestamptz,payload jsonb)
language plpgsql security definer set search_path=pg_catalog as $$
declare actor uuid;
begin
 actor:=bc_admin_v1.require_actor('content.read');
 return query select d.id,v.resource_key,d.state,d.row_version,d.author_id,d.assigned_reviewer_id,d.created_at,v.payload
 from bc_admin_v1.admin_drafts d join bc_admin_v1.admin_content_versions v on v.id=d.version_id
 where d.id=p_draft and v.resource_type='bio' and (d.author_id=actor or d.assigned_reviewer_id=actor);
end $$;
create index admin_drafts_reviewer_page_idx on bc_admin_v1.admin_drafts(assigned_reviewer_id,created_at desc,id desc) where state='in_review';
create function bc_admin_v1.list_bio_review_queue(p_limit integer,p_before_time timestamptz,p_before_id uuid)
returns table(draft_id uuid,resource_key text,state text,row_version bigint,author_id uuid,created_at timestamptz,payload jsonb)
language plpgsql security definer set search_path=pg_catalog as $$
declare actor uuid;
begin
 actor:=bc_admin_v1.require_actor('content.read');
 if p_limit is null or p_limit<1 or p_limit>100 or (p_before_time is null)<>(p_before_id is null) then
  raise exception 'invalid page' using errcode='22023'; end if;
 return query select d.id,v.resource_key,d.state,d.row_version,d.author_id,d.created_at,v.payload
 from bc_admin_v1.admin_drafts d join bc_admin_v1.admin_content_versions v on v.id=d.version_id
 where d.assigned_reviewer_id=actor and d.state='in_review' and v.resource_type='bio'
  and (p_before_time is null or (d.created_at,d.id)<(p_before_time,p_before_id))
 order by d.created_at desc,d.id desc limit p_limit;
end $$;
revoke all on function bc_admin_v1.update_bio_draft(uuid,bigint,jsonb,uuid),bc_admin_v1.get_bio_draft(uuid),bc_admin_v1.list_bio_review_queue(integer,timestamptz,uuid) from public,anon,authenticated;
commit;
