-- LOCAL SYNTHETIC FIXTURES ONLY. NOT APPROVED FOR SHARED PROJECT EXECUTION.
-- Depends on 001,002,003 and trusted Supabase request identity context.
-- No client EXECUTE grants or public APIs; no user/session bootstrap, login,
-- publish, or permission/role changes. SECURITY DEFINER owner is the migration
-- executor until a reviewed dedicated owner is configured. auth.uid()/auth.jwt()
-- are safe only when the request context is verified by an authenticated gateway;
-- a SQL-capable caller can spoof request GUCs. Do not expose these functions.
begin;
create function bc_admin_v1.require_actor(p_permission text) returns uuid
language plpgsql security definer set search_path=pg_catalog as $$
declare uid uuid; sid uuid;
begin
 uid := auth.uid();
 begin sid := (auth.jwt()->>'session_id')::uuid;
 exception when invalid_text_representation then raise exception 'not authorized' using errcode='42501'; end;
 if uid is null or sid is null or coalesce(auth.jwt()->>'aal','') <> 'aal2' then
  raise exception 'not authorized' using errcode='42501';
 end if;
 -- All future membership/role update operations must take this same user lock.
 perform 1 from bc_admin_v1.admin_users u where u.id=uid and u.enabled for update;
 if not found then raise exception 'not authorized' using errcode='42501'; end if;
 perform 1 from bc_admin_v1.admin_sessions s where s.id=sid and s.user_id=uid and s.revoked_at is null and s.expires_at > now() for update;
 if not found or not exists (select 1 from auth.sessions ps where ps.id=sid and ps.user_id=uid) or not exists (
  select 1 from bc_admin_v1.admin_user_roles ur join bc_admin_v1.admin_role_permissions rp on rp.role_id=ur.role_id
  where ur.user_id=uid and rp.permission_id=p_permission
 ) then raise exception 'not authorized' using errcode='42501'; end if;
 return uid;
end $$;

-- v1 content is a private draft only; no publication into public.bios exists.
-- Platform limits and user-facing adapter integration remain separate gates.
create function bc_admin_v1.create_bio_draft(p_key text,p_payload jsonb,p_request_id uuid) returns uuid
language plpgsql security definer set search_path=pg_catalog as $$
declare actor uuid; vid uuid; did uuid; version_no bigint; cnt integer;
begin
 actor := bc_admin_v1.require_actor('content.draft');
 if p_request_id is null or p_key is null or p_key !~ '^[a-z0-9][a-z0-9_-]{0,99}$'
    or p_payload is null or jsonb_typeof(p_payload) <> 'object' then
  raise exception 'invalid draft' using errcode='22023';
 end if;
 select count(*) into cnt from jsonb_object_keys(p_payload);
 if cnt <> 5 or not (p_payload ?& array['content','language','platform','active','featured'])
    or jsonb_typeof(p_payload->'content') is distinct from 'string'
    or length(btrim(p_payload->>'content'))=0 or octet_length(p_payload->>'content')>12000
    or jsonb_typeof(p_payload->'language') is distinct from 'string' or p_payload->>'language' not in ('en','hi','hg')
    or jsonb_typeof(p_payload->'platform') is distinct from 'string' or p_payload->>'platform' !~ '^[a-z][a-z0-9_-]{0,49}$'
    or jsonb_typeof(p_payload->'active') is distinct from 'boolean'
    or jsonb_typeof(p_payload->'featured') is distinct from 'boolean' then
  raise exception 'invalid bio fields' using errcode='22023';
 end if;
 -- Serialize version allocation for the same logical key within this database.
 perform pg_advisory_xact_lock(hashtextextended('bc_admin_v1:bio:' || p_key,0));
 select coalesce(max(version_number),0)+1 into version_no from bc_admin_v1.admin_content_versions
  where resource_type='bio' and resource_key=p_key;
 insert into bc_admin_v1.admin_content_versions(resource_type,resource_key,version_number,payload,payload_sha256,created_by)
 values('bio',p_key,version_no,p_payload,sha256(convert_to(p_payload::text,'UTF8')),actor) returning id into vid;
 insert into bc_admin_v1.admin_drafts(version_id,author_id) values(vid,actor) returning id into did;
 insert into bc_admin_v1.admin_audit_logs(actor_id,request_id,action,target_type,target_id)
 values(actor,p_request_id,'draft.create','draft',did::text);
 return did;
end $$;
create function bc_admin_v1.submit_draft(p_draft uuid,p_expected bigint,p_reviewer uuid,p_request_id uuid) returns void
language plpgsql security definer set search_path=pg_catalog as $$
declare actor uuid; d bc_admin_v1.admin_drafts%rowtype;
begin
 actor:=bc_admin_v1.require_actor('content.draft');
 if p_request_id is null then raise exception 'invalid request' using errcode='22023'; end if;
 select * into d from bc_admin_v1.admin_drafts where id=p_draft for update;
 if not found or d.author_id<>actor or d.state<>'draft' then raise exception 'not authorized' using errcode='42501'; end if;
 if p_expected is null or d.row_version<>p_expected then raise exception 'stale version' using errcode='40001'; end if;
 if p_reviewer is null or p_reviewer=actor or not exists(select 1 from bc_admin_v1.admin_users where id=p_reviewer and enabled) then
  raise exception 'invalid reviewer' using errcode='22023'; end if;
 update bc_admin_v1.admin_drafts set assigned_reviewer_id=p_reviewer,state='in_review',row_version=row_version+1,updated_at=now() where id=p_draft;
 insert into bc_admin_v1.admin_audit_logs(actor_id,request_id,action,target_type,target_id) values(actor,p_request_id,'draft.submit','draft',p_draft::text);
end $$;
create function bc_admin_v1.review_draft(p_draft uuid,p_expected bigint,p_approve boolean,p_request_id uuid) returns void
language plpgsql security definer set search_path=pg_catalog as $$
declare actor uuid; d bc_admin_v1.admin_drafts%rowtype; result text;
begin
 if p_approve is null or p_request_id is null then raise exception 'invalid request' using errcode='22023'; end if;
 actor:=bc_admin_v1.require_actor(case when p_approve then 'content.review' else 'content.reject' end);
 select * into d from bc_admin_v1.admin_drafts where id=p_draft for update;
 if not found or d.state<>'in_review' or d.author_id=actor or d.assigned_reviewer_id<>actor then
  raise exception 'not authorized' using errcode='42501'; end if;
 if p_expected is null or d.row_version<>p_expected then raise exception 'stale version' using errcode='40001'; end if;
 result := case when p_approve then 'approved' else 'rejected' end;
 insert into bc_admin_v1.admin_approvals(draft_id,reviewer_id,decision) values(p_draft,actor,result);
 update bc_admin_v1.admin_drafts set state=result,row_version=row_version+1,updated_at=now() where id=p_draft;
 insert into bc_admin_v1.admin_audit_logs(actor_id,request_id,action,target_type,target_id) values(actor,p_request_id,'draft.'||result,'draft',p_draft::text);
end $$;
-- Keyset pages contain only the caller's own bio drafts. Each page is a fresh
-- read, not a snapshot. This function is not granted to client roles.
create function bc_admin_v1.list_my_bio_drafts(p_limit integer,p_before_time timestamptz,p_before_id uuid)
returns table(draft_id uuid,resource_key text,state text,row_version bigint,created_at timestamptz,payload jsonb)
language plpgsql security definer set search_path=pg_catalog as $$
declare actor uuid;
begin
 actor:=bc_admin_v1.require_actor('content.read');
 if p_limit is null or p_limit<1 or p_limit>100 or (p_before_time is null) <> (p_before_id is null) then
  raise exception 'invalid page' using errcode='22023'; end if;
 return query select d.id,v.resource_key,d.state,d.row_version,d.created_at,v.payload
 from bc_admin_v1.admin_drafts d join bc_admin_v1.admin_content_versions v on v.id=d.version_id
 where d.author_id=actor and v.resource_type='bio'
   and (p_before_time is null or (d.created_at,d.id)<(p_before_time,p_before_id))
 order by d.created_at desc,d.id desc limit p_limit;
end $$;
revoke all on function bc_admin_v1.require_actor(text),bc_admin_v1.create_bio_draft(text,jsonb,uuid),bc_admin_v1.submit_draft(uuid,bigint,uuid,uuid),bc_admin_v1.review_draft(uuid,bigint,boolean,uuid),bc_admin_v1.list_my_bio_drafts(integer,timestamptz,uuid) from public,anon,authenticated;
commit;
