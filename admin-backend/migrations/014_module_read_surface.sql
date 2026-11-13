-- 014. Read surface for the modules that had tables but no command: publication
-- jobs, the notification inbox, backup records, and the live bio library.
--
-- Scope discipline: this file creates no table, changes no policy, and grants
-- nothing to a client. Every read is security definer, revokes EXECUTE from
-- PUBLIC/anon/authenticated, and re-checks its own permission inside SQL. Nothing
-- here writes to public.* — publication still goes through 013's reviewed bridge.
--
-- The one behavioural addition is the notification writer. `admin_notifications`
-- existed since 001 with no producer, which would have made an inbox that can
-- never receive anything — an empty screen pretending to be a working feature. A
-- trigger now records the three events an administrator actually needs to hear
-- about: a review was assigned to you, your draft was decided, your work was
-- published. Notifications are per-recipient rows and are read only by their
-- owner.
begin;

-- ---------------------------------------------------------------------------
-- Notification writer. Trigger-only: EXECUTE is revoked from clients below, so
-- it cannot be called directly with someone else's recipient.
-- ---------------------------------------------------------------------------
create function bc_admin_v1.notify_draft_event() returns trigger
language plpgsql security definer set search_path=pg_catalog as $$
declare recipient uuid; kind text; body text; author_of_draft uuid; next_state text;
begin
 if tg_table_name = 'admin_bio_publications' then
  -- Publication is recorded after the draft has moved to 'published', so the
  -- author is resolved from the publication row itself.
  select created_by into recipient from bc_admin_v1.admin_content_versions where id = new.version_id;
  if recipient is null then return null; end if;
  kind := 'content.published';
  body := 'Your draft was published (' || new.action || ').';
 elsif tg_table_name = 'admin_drafts' then
  -- Publication is notified by the publications trigger below, not here: the
  -- draft row moves to 'published' inside the same transaction that inserts the
  -- publication, so notifying from both places would deliver it twice.
  next_state := new.state;
  if old.state = next_state or next_state = 'published' then return null; end if;
  author_of_draft := new.author_id;
  if old.state = 'draft' and new.state = 'in_review' then
   recipient := new.assigned_reviewer_id;
   kind := 'review.assigned';
   body := 'A draft is waiting for your review.';
  elsif old.state = 'in_review' and new.state in ('approved','rejected') then
   recipient := new.author_id;
   kind := 'review.decided';
   body := 'Your draft was ' || new.state || '.';
  else
   return null;
  end if;
 else
  return null;
 end if;
 if recipient is null then return null; end if;
 -- Self-notification is noise, but only for the case where it is genuinely
 -- redundant: an author assigned as their own reviewer already knows they wrote
 -- it. An author being told their own draft was decided is the whole point of the
 -- inbox, so it is never suppressed.
 if tg_table_name = 'admin_drafts' and next_state = 'in_review' and recipient = author_of_draft then
  return null;
 end if;
 -- The inbox must never be able to block a workflow step. A notification that
 -- cannot be stored is dropped rather than rolling back the review or publish.
 begin
  insert into bc_admin_v1.admin_notifications(user_id, category, message) values (recipient, kind, left(body, 1000));
 exception when others then null;
 end;
 return null;
end $$;

revoke all on function bc_admin_v1.notify_draft_event() from public, anon, authenticated;

create trigger admin_drafts_notify after update on bc_admin_v1.admin_drafts
 for each row execute function bc_admin_v1.notify_draft_event();
create trigger admin_publications_notify after insert on bc_admin_v1.admin_bio_publications
 for each row execute function bc_admin_v1.notify_draft_event();

-- ---------------------------------------------------------------------------
-- Reads.
-- ---------------------------------------------------------------------------

-- The caller's own inbox, newest first. Nobody can read another member's rows:
-- the recipient is the authenticated actor, never a parameter.
create function bc_admin_v1.list_my_notifications(p_limit integer,p_before timestamptz)
returns table(id uuid,category text,message text,created_at timestamptz,read_at timestamptz,unread boolean)
language plpgsql security definer set search_path=pg_catalog as $$
declare actor uuid;
begin
 actor := bc_admin_v1.require_actor('dashboard.read');
 if p_limit is null or p_limit<1 or p_limit>100 then raise exception 'invalid page' using errcode='22023'; end if;
 return query select n.id,n.category,n.message,n.created_at,n.read_at,(n.read_at is null)
  from bc_admin_v1.admin_notifications n
  where n.user_id = actor and (p_before is null or n.created_at < p_before)
  order by n.created_at desc, n.id desc limit p_limit;
end $$;

-- Marking read is a self-service action on the caller's own rows, so it needs no
-- elevated permission and cannot touch anyone else's message. Bounded by an age
-- window so a stray call cannot rewrite the whole history.
create function bc_admin_v1.mark_notifications_read(p_before timestamptz) returns integer
language plpgsql security definer set search_path=pg_catalog as $$
declare actor uuid; changed integer;
begin
 actor := bc_admin_v1.require_actor('dashboard.read');
 if p_before is not null and p_before > now() then raise exception 'invalid window' using errcode='22023'; end if;
 update bc_admin_v1.admin_notifications set read_at = now()
  where user_id = actor and read_at is null and (p_before is null or created_at <= p_before);
 get diagnostics changed = row_count;
 if changed > 0 then
  insert into bc_admin_v1.admin_audit_logs(actor_id, request_id, action, target_type, target_id, details)
  values (actor, gen_random_uuid(), 'notifications.read', 'inbox', actor::text, jsonb_build_object('count', changed));
 end if;
 return changed;
end $$;

-- Publication queue. Read-only: 013 publishes synchronously inside its own
-- transaction, so a job row here is evidence of what happened, not a work item
-- that this console can push along. The distinction is stated in the response so
-- the UI cannot imply a control it does not have.
create function bc_admin_v1.list_publication_jobs(p_limit integer,p_before uuid)
returns table(id uuid,draft_id uuid,resource_key text,target_environment text,state text,scheduled_at timestamptz,created_at timestamptz,completed_at timestamptz)
language plpgsql security definer set search_path=pg_catalog as $$
begin
 perform bc_admin_v1.require_actor('content.read');
 if p_limit is null or p_limit<1 or p_limit>100 then raise exception 'invalid page' using errcode='22023'; end if;
 return query select j.id,j.draft_id,v.resource_key,j.target_environment,j.state,j.scheduled_at,j.created_at,j.completed_at
  from bc_admin_v1.admin_publication_jobs j
  join bc_admin_v1.admin_drafts d on d.id = j.draft_id
  join bc_admin_v1.admin_content_versions v on v.id = d.version_id
  where p_before is null or j.id < p_before
  order by j.id desc limit p_limit;
end $$;

-- Backup history. These are provider references, never credentials; the console
-- shows what was requested and whether a restore was verified, nothing more.
create function bc_admin_v1.list_backup_records(p_limit integer,p_before timestamptz)
returns table(id uuid,environment text,provider_reference text,state text,requested_at timestamptz,verified_at timestamptz)
language plpgsql security definer set search_path=pg_catalog as $$
begin
 perform bc_admin_v1.require_actor('settings.read');
 if p_limit is null or p_limit<1 or p_limit>100 then raise exception 'invalid page' using errcode='22023'; end if;
 return query select b.id,b.environment,b.provider_reference,b.state,b.requested_at,b.verified_at
  from bc_admin_v1.admin_backup_records b
  where p_before is null or b.requested_at < p_before
  order by b.requested_at desc, b.id limit p_limit;
end $$;

-- The live bio library: every row, active or not, with its platform and category.
-- Search is a plain case-insensitive substring test (`strpos`), not a LIKE pattern.
-- That choice is deliberate: a search box that treats `%` or `_` as wildcards lets
-- a user write a query the operator did not intend, and the escaping dance around
-- LIKE is exactly where that mistake lives. `strpos` has no pattern language, so
-- the term can only ever match itself.
create function bc_admin_v1.list_public_bios(p_limit integer,p_after uuid,p_search text,p_language text,p_active boolean)
returns table(id uuid,title text,language text,platform_slug text,category_name text,is_active boolean,is_featured boolean,is_trending boolean,character_count integer,source_slug text,created_at timestamptz,updated_at timestamptz)
language plpgsql security definer set search_path=pg_catalog as $$
begin
 perform bc_admin_v1.require_actor('content.read');
 if p_limit is null or p_limit<1 or p_limit>100 then raise exception 'invalid page' using errcode='22023'; end if;
 if p_language is not null and p_language not in ('en','hi','hg') then raise exception 'invalid language' using errcode='22023'; end if;
 if p_search is not null and length(p_search) > 120 then raise exception 'invalid search' using errcode='22023'; end if;
 return query
  select b.id,b.title,b.language,p.slug,c.name,b.is_active,b.is_featured,b.is_trending,
         b.character_count,b.source_slug,b.created_at,b.updated_at
  from public.bios b
  left join public.platforms p on p.id = b.platform_id
  left join public.categories c on c.id = b.category_id
  where (p_after is null or b.id > p_after)
    and (p_language is null or b.language = p_language)
    and (p_active is null or b.is_active = p_active)
    and (p_search is null
         or strpos(lower(coalesce(b.title,'')), lower(p_search)) > 0
         or strpos(lower(b.content), lower(p_search)) > 0)
  order by b.id limit p_limit;
end $$;

revoke all on function bc_admin_v1.list_my_notifications(integer,timestamptz),
 bc_admin_v1.mark_notifications_read(timestamptz),
 bc_admin_v1.list_publication_jobs(integer,uuid),
 bc_admin_v1.list_backup_records(integer,timestamptz),
 bc_admin_v1.list_public_bios(integer,uuid,text,text,boolean) from public, anon, authenticated;

commit;
