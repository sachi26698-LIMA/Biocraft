-- Rollback for 013. Drops only the three functions and the table this file
-- creates. It never touches `public.bios`: rows that were published stay exactly
-- as they are, because reversing a permission is not the same as deleting a
-- visitor's content. If an operator wants a published row hidden, that is an
-- ordinary reviewed archive (is_active = false), not a rollback side effect.
--
-- It refuses while publication history exists, because that history is the only
-- record of which bio came from which draft and by whose approval.
begin;
do $$
declare n integer;
begin
 select count(*) into n from bc_admin_v1.admin_bio_publications;
 if n > 0 then raise exception 'refusing rollback: % publication records exist', n; end if;
end $$;
drop function bc_admin_v1.create_revert_draft(bigint,uuid);
drop function bc_admin_v1.list_bio_publications(uuid,integer,bigint);
drop function bc_admin_v1.publish_bio_draft(uuid,bigint,uuid,uuid);
drop table bc_admin_v1.admin_bio_publications;
-- Restore 002's guard, which refused every transition to queued/published. Doing
-- this before the function that performs the transition is dropped would leave a
-- window where nothing can publish but the state remains reachable; doing it here
-- leaves the schema exactly as 001-012 describe it.
create or replace function bc_admin_v1.guard_draft() returns trigger
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
  -- No transition to queued/published without the bridge from 013.
  raise exception 'invalid or unavailable transition' using errcode='23514';
 end if;
 return new;
end $$;
commit;
