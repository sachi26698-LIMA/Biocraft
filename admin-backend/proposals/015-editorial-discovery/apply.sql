-- Candidate only. No data or permission changes to existing objects.
begin;
create function bc_admin_v1.list_eligible_bio_reviewers(p_limit integer,p_after uuid)
returns table(user_id uuid)
language plpgsql stable security definer set search_path=pg_catalog as $$
declare actor uuid;
begin
 actor := bc_admin_v1.require_actor('content.draft');
 if p_limit is null or p_limit not between 1 and 100 then raise exception 'invalid page' using errcode='22023'; end if;
 return query select u.id from bc_admin_v1.admin_users u
 where u.enabled and u.id <> actor and (p_after is null or u.id > p_after)
  and exists(select 1 from bc_admin_v1.admin_user_roles ur
    join bc_admin_v1.admin_role_permissions rp on rp.role_id=ur.role_id
    where ur.user_id=u.id and rp.permission_id='content.review')
 order by u.id limit p_limit;
end $$;

create function bc_admin_v1.list_approved_bio_queue(p_limit integer,p_after uuid)
returns table(draft_id uuid,resource_key text,state text,row_version bigint,author_id uuid,created_at timestamptz,payload jsonb)
language plpgsql stable security definer set search_path=pg_catalog as $$
declare actor uuid;
begin
 actor := bc_admin_v1.require_actor('content.publish');
 if p_limit is null or p_limit not between 1 and 100 then raise exception 'invalid page' using errcode='22023'; end if;
 return query select d.id,v.resource_key,d.state,d.row_version,d.author_id,d.created_at,v.payload
 from bc_admin_v1.admin_drafts d join bc_admin_v1.admin_content_versions v on v.id=d.version_id
 where d.state='approved' and d.author_id<>actor and v.resource_type='bio' and (p_after is null or d.id>p_after)
  and exists(select 1 from bc_admin_v1.admin_approvals a where a.draft_id=d.id and a.decision='approved'
    and a.reviewer_id<>d.author_id and a.reviewer_id<>actor)
 order by d.id limit p_limit;
end $$;

revoke all on function bc_admin_v1.list_eligible_bio_reviewers(integer,uuid),bc_admin_v1.list_approved_bio_queue(integer,uuid) from public,anon,authenticated,service_role;
commit;
