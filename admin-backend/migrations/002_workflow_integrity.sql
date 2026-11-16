-- ISOLATED ADMIN DATABASE ONLY. Candidate integrity guards; no authorization,
-- identity verification, permission enforcement, audit commands or API grants.
-- Do not deploy until independently reviewed and provider-tested.
begin;
alter table bc_admin_v1.admin_approvals add constraint one_decision_per_draft unique(draft_id);
create function bc_admin_v1.guard_approval() returns trigger
language plpgsql set search_path=pg_catalog as $$
declare d bc_admin_v1.admin_drafts%rowtype;
begin
 select * into d from bc_admin_v1.admin_drafts where id=new.draft_id for update;
 if not found or d.state <> 'in_review' or d.author_id=new.reviewer_id
    or d.assigned_reviewer_id is distinct from new.reviewer_id
    or not exists (select 1 from bc_admin_v1.admin_users u where u.id=new.reviewer_id and u.enabled) then
  raise exception 'invalid reviewer or draft state' using errcode='23514';
 end if;
 return new;
end $$;
create trigger approval_guard before insert on bc_admin_v1.admin_approvals
 for each row execute function bc_admin_v1.guard_approval();
create function bc_admin_v1.guard_draft() returns trigger
language plpgsql set search_path=pg_catalog as $$
declare author uuid; decision text; old_kind text; old_key text; new_kind text; new_key text;
begin
 if tg_op='DELETE' then raise exception 'drafts cannot be deleted' using errcode='23514'; end if;
 select created_by into author from bc_admin_v1.admin_content_versions where id=new.version_id;
 if author is distinct from new.author_id then raise exception 'version author mismatch' using errcode='23514'; end if;
 if tg_op='INSERT' then
  if new.state <> 'draft' or new.row_version <> 1 then raise exception 'must start as draft' using errcode='23514'; end if;
  return new;
 end if;
 if new.id is distinct from old.id or new.author_id is distinct from old.author_id
    or new.created_at is distinct from old.created_at or new.row_version <> old.row_version+1 then
  raise exception 'invalid draft identity or version' using errcode='23514';
 end if;
 if old.state='draft' and new.state in ('draft','in_review') then
  select resource_type,resource_key into old_kind,old_key from bc_admin_v1.admin_content_versions where id=old.version_id;
  select resource_type,resource_key into new_kind,new_key from bc_admin_v1.admin_content_versions where id=new.version_id;
  if new_kind is distinct from old_kind or new_key is distinct from old_key then
   raise exception 'draft resource cannot change' using errcode='23514'; end if;
  if new.state='in_review' and new.assigned_reviewer_id is null then raise exception 'reviewer required' using errcode='23514'; end if;
 elsif old.state='in_review' and new.state in ('approved','rejected') then
  if new.version_id is distinct from old.version_id or new.assigned_reviewer_id is distinct from old.assigned_reviewer_id then
   raise exception 'reviewed version must not change' using errcode='23514'; end if;
  select a.decision into decision from bc_admin_v1.admin_approvals a
    where a.draft_id=old.id and a.reviewer_id=old.assigned_reviewer_id;
  if decision is distinct from new.state then raise exception 'matching decision required' using errcode='23514'; end if;
 else
  -- No transition to queued/published until a separately reviewed bridge exists.
  raise exception 'invalid or unavailable transition' using errcode='23514';
 end if;
 return new;
end $$;
create trigger draft_guard before insert or update or delete on bc_admin_v1.admin_drafts
 for each row execute function bc_admin_v1.guard_draft();
revoke all on function bc_admin_v1.guard_approval(), bc_admin_v1.guard_draft() from public,anon,authenticated;
commit;
