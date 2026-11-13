-- EXACT PROPOSED SQL FOR REVIEW ONLY. DO NOT APPLY TO ANY PROJECT.
-- Depends on 001-003. This is an integrity guard, NOT authorization, auditing,
-- concurrent publication, step-up, payload validation or a complete workflow.
-- Existing data must be checked for compatibility before any approved apply.
begin;
create function bc_admin.guard_revision_transition() returns trigger
language plpgsql set search_path=pg_catalog as $$
begin
  if tg_op = 'DELETE' then
    raise exception 'revisions cannot be deleted by the ordinary workflow' using errcode='23514';
  end if;
  if tg_op = 'INSERT' then
    if new.state <> 'draft' or new.reviewer_id is not null or new.reviewed_at is not null then
      raise exception 'a revision must begin as a draft' using errcode='23514';
    end if;
    return new;
  end if;
  if new.id is distinct from old.id or new.document_id is distinct from old.document_id
     or new.revision_number is distinct from old.revision_number
     or new.base_revision_id is distinct from old.base_revision_id
     or new.author_id is distinct from old.author_id or new.created_at is distinct from old.created_at then
    raise exception 'revision identity cannot change' using errcode='23514';
  end if;
  if old.state <> 'draft' or new.state <> 'draft' then
    if new.payload is distinct from old.payload or new.payload_sha256 is distinct from old.payload_sha256 then
      raise exception 'submitted revision payload cannot change' using errcode='23514';
    end if;
  end if;
  if old.state = 'draft' and new.state in ('draft','submitted') then
    null;
  elsif old.state = 'submitted' and new.state in ('approved','rejected') then
    null;
  elsif old.state = 'approved' and new.state = 'published' then
    if new.reviewer_id is distinct from old.reviewer_id or new.reviewed_at is distinct from old.reviewed_at then
      raise exception 'review evidence cannot be changed at publication' using errcode='23514';
    end if;
  elsif old.state = 'published' and new.state = 'superseded' then
    if new.reviewer_id is distinct from old.reviewer_id or new.reviewed_at is distinct from old.reviewed_at then
      raise exception 'review evidence cannot be changed after publication' using errcode='23514';
    end if;
  else
    raise exception 'invalid revision transition' using errcode='23514';
  end if;
  return new;
end $$;
create trigger revision_transition_guard before insert or update or delete on bc_admin.revisions
  for each row execute function bc_admin.guard_revision_transition();
-- Lock the parent revision while modifying any sidecar so submission and
-- sidecar mutation serialize on the same row. This prevents modifications
-- after submission but does not ensure sidecars match the payload/hash or kind.
create function bc_admin.guard_revision_sidecar() returns trigger
language plpgsql set search_path=pg_catalog as $$
declare v_revision_id uuid; v_state text;
begin
  if tg_op = 'DELETE' then v_revision_id := old.revision_id;
  else v_revision_id := new.revision_id; end if;
  if tg_op = 'UPDATE' and new.revision_id is distinct from old.revision_id then
    raise exception 'sidecar revision cannot change' using errcode='23514';
  end if;
  select state into v_state from bc_admin.revisions where id=v_revision_id for update;
  if v_state is distinct from 'draft' then
    raise exception 'sidecars may change only while parent is draft' using errcode='23514';
  end if;
  if tg_op = 'DELETE' then return old; end if;
  return new;
end $$;
create trigger bio_revision_guard before insert or update or delete on bc_admin.bio_revision_fields
  for each row execute function bc_admin.guard_revision_sidecar();
create trigger setting_revision_guard before insert or update or delete on bc_admin.setting_revision_fields
  for each row execute function bc_admin.guard_revision_sidecar();
create trigger dependency_revision_guard before insert or update or delete on bc_admin.revision_dependencies
  for each row execute function bc_admin.guard_revision_sidecar();
revoke all on function bc_admin.guard_revision_sidecar() from public,anon,authenticated;
revoke all on function bc_admin.guard_revision_transition() from public,anon,authenticated;
commit;
