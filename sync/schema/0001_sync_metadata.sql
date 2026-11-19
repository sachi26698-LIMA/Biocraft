-- BioCraft hybrid sync — metadata schema (ADDITIVE ONLY).
--
-- Nothing here drops, renames or rewrites a column, and no statement touches a
-- row of application data. Every column added is nullable or has a default, so
-- applying it to a table with existing rows cannot fail or lose a record.
--
-- Apply to the LOCAL database first (it is a disposable replica), verify, and
-- only then consider the same script for Supabase — that is a separate,
-- approved step. See HYBRID_SYNC_APPROVAL.md.

-- ---------------------------------------------------------------------------
-- 1. Per-table sync metadata
-- ---------------------------------------------------------------------------
-- `record_version` increments on every applied change and gives a total order
-- that does not depend on two clocks agreeing. `updated_at` is the tie-break a
-- human can read. `origin` records which side produced the current value, so a
-- loop (A -> B -> A) can be recognised and stopped instead of ping-ponging.
do $$
declare t text;
begin
  foreach t in array array[
    'bios','captions','hashtags','symbols','fonts','emoji_library',
    'emoji_collections','color_palettes','design_templates','design_presets',
    'icon_library','categories','content_collections','platforms','generators',
    'languages','content_licenses','seo_pages','app_limits','global_content',
    'content_versions','content_translations','content_tags','content_analytics',
    'user_favorites','user_saved_content','admin_content_reviews'
  ] loop
    if not exists (select 1 from information_schema.tables
                   where table_schema='public' and table_name=t) then
      continue; -- a table this deployment does not have is simply skipped
    end if;
    execute format('alter table public.%I add column if not exists record_version bigint not null default 1', t);
    execute format('alter table public.%I add column if not exists sync_status text not null default ''synced''', t);
    execute format('alter table public.%I add column if not exists last_synced_at timestamptz', t);
    execute format('alter table public.%I add column if not exists origin text not null default ''supabase''', t);
    -- A stable, sortable change marker. Existing rows get "the beginning of
    -- time" rather than now(), so a first sync does not claim every historical
    -- row changed at the moment of migration.
    execute format('alter table public.%I add column if not exists sync_revision timestamptz not null default ''epoch''', t);
    execute format('create index if not exists %I on public.%I (sync_revision)', t||'_sync_revision_idx', t);
    execute format('create index if not exists %I on public.%I (sync_status)', t||'_sync_status_idx', t);
  end loop;
end $$;

-- The allowed sync states are fixed, so a typo cannot create a state that no
-- reconciler looks for. `pending` = queued, `failed` = in the retry queue.
do $$
begin
  if not exists (select 1 from pg_constraint where conname='sync_status_allowed') then
    alter table public.bios
      add constraint sync_status_allowed
      check (sync_status in ('synced','pending','failed','conflict'));
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- 2. Outbox — the ONLY thing the replicator reads
-- ---------------------------------------------------------------------------
-- Idempotent by construction: `event_id` is a deterministic hash of
-- (table, key, revision, operation), so re-queueing the same change is a no-op
-- and a crash between "apply" and "acknowledge" cannot double-apply. Applying an
-- event is what marks it acknowledged, in the same transaction.
create table if not exists public.sync_outbox (
  event_id      text primary key,
  table_name    text not null,
  row_pk        text not null,
  operation     text not null check (operation in ('upsert','delete')),
  revision      timestamptz not null,
  payload       jsonb,
  status        text not null default 'pending' check (status in ('pending','applied','failed','skipped')),
  attempts      integer not null default 0,
  last_error    text,
  next_attempt_at timestamptz not null default now(),
  created_at    timestamptz not null default now(),
  applied_at    timestamptz
);
create index if not exists sync_outbox_due_idx on public.sync_outbox (next_attempt_at) where status='pending';
create index if not exists sync_outbox_failed_idx on public.sync_outbox (status) where status in ('failed','pending');

-- A failed event is retried with exponential backoff. This function centralises
-- the schedule so the worker and the tests cannot disagree about it.
create or replace function public.sync_backoff_seconds(attempts integer)
returns integer language sql immutable as $$
  select least(3600, (power(2, greatest(0, least(attempts, 12))) * 5)::integer)
$$;

-- ---------------------------------------------------------------------------
-- 3. Deletion tombstones
-- ---------------------------------------------------------------------------
-- A delete has to be transmitted explicitly: a row missing from one side is
-- otherwise indistinguishable from a row that was never sent. The tombstone is
-- the delete record, and it outlives the row.
create table if not exists public.sync_tombstones (
  table_name  text not null,
  row_pk      text not null,
  revision    timestamptz not null default now(),
  origin      text not null,
  acknowledged boolean not null default false,
  created_at  timestamptz not null default now(),
  primary key (table_name, row_pk)
);

-- ---------------------------------------------------------------------------
-- 4. Replication cursor per table
-- ---------------------------------------------------------------------------
create table if not exists public.sync_state (
  table_name     text primary key,
  last_revision  timestamptz not null default 'epoch',
  last_synced_at timestamptz,
  last_row_count bigint,
  last_checksum  text
);

-- ---------------------------------------------------------------------------
-- 5. Audit trail for synchronisation itself
-- ---------------------------------------------------------------------------
-- Separate from bc_admin_v1's audit log: that records admin actions, this
-- records what the replicator did, including refusals (a conflict loser is
-- recorded with its reason rather than silently dropped).
create table if not exists public.sync_audit (
  id           bigserial primary key,
  event_id     text,
  table_name   text not null,
  row_pk       text not null,
  action       text not null,
  detail       text,
  origin       text,
  created_at   timestamptz not null default now()
);
create index if not exists sync_audit_recent_idx on public.sync_audit (created_at desc);

-- ---------------------------------------------------------------------------
-- 6. Locking — never two writers on the same table
-- ---------------------------------------------------------------------------
-- The engine takes this advisory lock for the duration of a table's batch. It is
-- what makes "uncontrolled simultaneous writes" impossible rather than merely
-- discouraged: a second writer blocks instead of racing.
create or replace function public.sync_try_lock(p_key text)
returns boolean language sql as $$
  select pg_try_advisory_lock(hashtext('biocraft-sync:'||p_key))
$$;

create or replace function public.sync_unlock(p_key text)
returns boolean language sql as $$
  select pg_advisory_unlock(hashtext('biocraft-sync:'||p_key))
$$;
