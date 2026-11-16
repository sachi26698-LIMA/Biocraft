-- CANDIDATE FOR THE SHARED PROJECT. Not executed anywhere yet.
-- 013: the reviewed publication bridge, plus the history needed to roll a
-- published bio back.
--
-- Until this file, a draft could be created, edited, submitted and approved —
-- and then stop. `guard_draft` deliberately refused every transition to
-- queued/published because no reviewed bridge existed. That left the workflow
-- honest but incomplete: "approve" produced nothing a visitor could see.
--
-- This file adds exactly one way for approved content to reach `public.bios`,
-- with the properties the review demanded:
--
--   * two independent people: the publisher may not be the author, and a
--     matching approval by a third identity must exist;
--   * approved state only: `draft`, `in_review` or `rejected` cannot publish;
--   * optimistic concurrency: a stale row_version refuses;
--   * one transaction: the `public.bios` write, the draft state change, the
--     publication record and the audit row all commit or none do;
--   * no deletion: archiving is an `is_active = false` update, never a DELETE,
--     so the 506 existing bios can be hidden but never destroyed;
--   * full history: every publication records the bio, the draft, the exact
--     content version and the actor, so a rollback can name what it restores.
--
-- Nothing here alters `public` schema, grants, RLS or policies. The only writes
-- to `public.bios` are row INSERT/UPDATE performed by this SECURITY DEFINER
-- function, which is itself reachable only by the limited executor role and only
-- after `require_actor('content.publish')` succeeds.
begin;

-- 002's guard refuses every transition to queued/published because no reviewed
-- bridge existed. The bridge is in this file, so the guard is replaced here with
-- the one additional edge it needs: approved -> published, and nothing else. It
-- stays a trigger enforced in the database, so a future command cannot skip it.
-- The transition is only reachable through publish_bio_draft below, which is the
-- only function that writes state='published'.
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
 elsif old.state='approved' and new.state='published' then
  -- 013: the publication bridge. The version and reviewer are frozen, exactly as
  -- for a review decision; the bridge itself checks separation of duties.
  if new.version_id is distinct from old.version_id or new.assigned_reviewer_id is distinct from old.assigned_reviewer_id then
   raise exception 'published version must not change' using errcode='23514'; end if;
 else
  raise exception 'invalid or unavailable transition' using errcode='23514';
 end if;
 return new;
end $$;

-- One row per publication event. Append-only, like every other evidence table.
create table bc_admin_v1.admin_bio_publications (
 id bigint generated always as identity primary key,
 bio_id uuid not null,
 draft_id uuid not null references bc_admin_v1.admin_drafts(id) on delete restrict,
 version_id uuid not null references bc_admin_v1.admin_content_versions(id) on delete restrict,
 action text not null check (action in ('created','updated','archived','restored')),
 actor_id uuid not null references bc_admin_v1.admin_users(id) on delete restrict,
 published_at timestamptz not null default now(),
 -- The payload as published, so a later revert restores exactly those bytes even
 -- if the version row is superseded by newer edits.
 payload jsonb not null check (jsonb_typeof(payload) = 'object')
);
create index admin_bio_publications_bio_idx on bc_admin_v1.admin_bio_publications(bio_id, id desc);
alter table bc_admin_v1.admin_bio_publications enable row level security;
create policy deny_clients on bc_admin_v1.admin_bio_publications as restrictive for all to anon, authenticated using (false) with check (false);
revoke all on bc_admin_v1.admin_bio_publications from public, anon, authenticated;
-- Publication records are evidence: refuse UPDATE and DELETE outright.
create trigger publication_no_change before update or delete on bc_admin_v1.admin_bio_publications
 for each row execute function bc_admin_v1.reject_mutation();
create trigger publication_no_truncate before truncate on bc_admin_v1.admin_bio_publications
 for each statement execute function bc_admin_v1.reject_mutation();

-- The bridge. p_bio_id null creates a new row; a value updates that exact row
-- (edit or archive). Both paths require the same approved two-person state.
create function bc_admin_v1.publish_bio_draft(p_draft uuid, p_expected bigint, p_bio_id uuid, p_request_id uuid)
returns table(bio_id uuid, action text)
language plpgsql security definer set search_path=pg_catalog as $$
declare actor uuid; d bc_admin_v1.admin_drafts%rowtype; v bc_admin_v1.admin_content_versions%rowtype;
 p jsonb; target uuid; act text; platform uuid; key_count integer;
begin
 if p_draft is null or p_expected is null or p_request_id is null then
  raise exception 'invalid publication request' using errcode='22023';
 end if;
 -- Publish capability is separate from review: an author cannot self-publish.
 actor := bc_admin_v1.require_actor('content.publish');

 select * into d from bc_admin_v1.admin_drafts where id = p_draft for update;
 if not found or d.state <> 'approved' then raise exception 'not authorized' using errcode='42501'; end if;
 if d.row_version <> p_expected then raise exception 'stale version' using errcode='40001'; end if;
 -- Separation of duties, checked here rather than trusted from the client: the
 -- publisher is not the author, and an approval by a third identity exists.
 if d.author_id = actor then raise exception 'self publication refused' using errcode='42501'; end if;
 if not exists (
   select 1 from bc_admin_v1.admin_approvals a
   where a.draft_id = d.id and a.decision = 'approved'
     and a.reviewer_id <> d.author_id and a.reviewer_id <> actor
 ) then raise exception 'independent approval required' using errcode='42501'; end if;

 select * into v from bc_admin_v1.admin_content_versions where id = d.version_id;
 if v.resource_type <> 'bio' then raise exception 'not authorized' using errcode='42501'; end if;
 p := v.payload;
 select count(*) into key_count from jsonb_object_keys(p);
 if key_count <> 5 or not (p ?& array['content','language','platform','active','featured']) then
  raise exception 'invalid bio payload' using errcode='22023';
 end if;
 -- The platform slug is resolved against the live table, so a draft cannot
 -- introduce a platform that does not exist, and the row keeps its foreign key.
 select pl.id into platform from public.platforms pl where pl.slug = p->>'platform';
 if platform is null then raise exception 'unknown platform' using errcode='22023'; end if;

 -- Serialize publication for one logical collection, matching the key the draft
 -- commands lock, so two publishers cannot race the same source_slug.
 perform pg_advisory_xact_lock(hashtextextended('bc_admin_v1:bio:' || v.resource_key, 0));

 if p_bio_id is null then
  -- New row. The unique (source_slug, md5(content)) index makes this idempotent:
  -- publishing the same text twice adds nothing rather than duplicating.
  insert into public.bios(platform_id, content, language, is_active, is_featured, source_slug)
  values (platform, p->>'content', p->>'language', (p->>'active')::boolean, (p->>'featured')::boolean, v.resource_key)
  on conflict (source_slug, md5(content)) do nothing
  returning id into target;
  if target is null then
   select b.id into target from public.bios b
    where b.source_slug = v.resource_key and md5(b.content) = md5(p->>'content');
   act := 'restored';
  else
   act := 'created';
  end if;
 else
  -- Existing row: edit or archive. `is_active` comes from the reviewed payload,
  -- so archiving is a reviewed act too, and no row is ever deleted.
  update public.bios b
   set platform_id = platform,
       content = p->>'content',
       language = p->>'language',
       is_active = (p->>'active')::boolean,
       is_featured = (p->>'featured')::boolean,
       source_slug = coalesce(b.source_slug, v.resource_key)
   where b.id = p_bio_id
   returning b.id into target;
  if target is null then raise exception 'unknown bio' using errcode='22023'; end if;
  act := case when (p->>'active')::boolean then 'updated' else 'archived' end;
 end if;

 update bc_admin_v1.admin_drafts
  set state = 'published', row_version = row_version + 1, updated_at = now()
  where id = d.id;
 insert into bc_admin_v1.admin_bio_publications(bio_id, draft_id, version_id, action, actor_id, payload)
 values (target, d.id, d.version_id, act, actor, p);
 insert into bc_admin_v1.admin_publication_jobs(draft_id, target_environment, state, request_hash, scheduled_at, completed_at)
 values (d.id, 'production', 'succeeded', sha256(convert_to(p::text, 'UTF8')), now(), now());
 insert into bc_admin_v1.admin_audit_logs(actor_id, request_id, action, target_type, target_id, details)
 values (actor, p_request_id, 'draft.published', 'bio', target::text,
         jsonb_build_object('draft_id', d.id, 'version_id', d.version_id, 'publication', act));
 return query select target, act;
end $$;

-- Publication history for one bio, newest first: what the rollback screen reads.
create function bc_admin_v1.list_bio_publications(p_bio_id uuid, p_limit integer, p_before_id bigint)
returns table(id bigint, bio_id uuid, draft_id uuid, version_id uuid, action text,
              actor_id uuid, published_at timestamptz, payload jsonb)
language plpgsql security definer set search_path=pg_catalog as $$
declare actor uuid;
begin
 actor := bc_admin_v1.require_actor('content.read');
 if p_bio_id is null or p_limit is null or p_limit < 1 or p_limit > 100
    or (p_before_id is not null and p_before_id < 0) then
  raise exception 'invalid page' using errcode='22023';
 end if;
 return query select pb.id, pb.bio_id, pb.draft_id, pb.version_id, pb.action,
                     pb.actor_id, pb.published_at, pb.payload
  from bc_admin_v1.admin_bio_publications pb
  where pb.bio_id = p_bio_id and (p_before_id is null or pb.id < p_before_id)
  order by pb.id desc limit p_limit;
end $$;

-- Rollback, done the safe way: it does not rewrite history, it opens a new draft
-- containing the older payload, which then needs the ordinary submit → review →
-- publish path. So a revert is reviewed by the same two people as any edit.
create function bc_admin_v1.create_revert_draft(p_publication_id bigint, p_request_id uuid) returns uuid
language plpgsql security definer set search_path=pg_catalog as $$
declare actor uuid; pb bc_admin_v1.admin_bio_publications%rowtype;
 key text; version_no bigint; vid uuid; did uuid;
begin
 actor := bc_admin_v1.require_actor('content.draft');
 if p_publication_id is null or p_request_id is null then
  raise exception 'invalid revert request' using errcode='22023';
 end if;
 select * into pb from bc_admin_v1.admin_bio_publications where id = p_publication_id;
 -- P0002 is the project-wide "no such resource" signal, so the HTTP layer can
 -- answer 404 instead of a vague 422. A malformed id stays 422 above.
 if not found then raise exception 'unknown publication' using errcode='P0002'; end if;
 -- The logical key comes from the version that was published, so a revert lands
 -- in the same collection as the original.
 select resource_key into key from bc_admin_v1.admin_content_versions where id = pb.version_id;
 if key is null then raise exception 'unknown publication' using errcode='P0002'; end if;
 perform pg_advisory_xact_lock(hashtextextended('bc_admin_v1:bio:' || key, 0));
 select coalesce(max(version_number), 0) + 1 into version_no
  from bc_admin_v1.admin_content_versions where resource_type = 'bio' and resource_key = key;
 insert into bc_admin_v1.admin_content_versions(resource_type, resource_key, version_number, payload, payload_sha256, created_by)
 values ('bio', key, version_no, pb.payload, sha256(convert_to(pb.payload::text, 'UTF8')), actor)
 returning id into vid;
 insert into bc_admin_v1.admin_drafts(version_id, author_id) values (vid, actor) returning id into did;
 insert into bc_admin_v1.admin_audit_logs(actor_id, request_id, action, target_type, target_id, details)
 values (actor, p_request_id, 'draft.revert_opened', 'draft', did::text,
         jsonb_build_object('publication_id', pb.id, 'bio_id', pb.bio_id, 'restored_version', pb.version_id));
 return did;
end $$;

revoke all on function bc_admin_v1.publish_bio_draft(uuid,bigint,uuid,uuid),
 bc_admin_v1.list_bio_publications(uuid,integer,bigint),
 bc_admin_v1.create_revert_draft(bigint,uuid) from public, anon, authenticated;
commit;
