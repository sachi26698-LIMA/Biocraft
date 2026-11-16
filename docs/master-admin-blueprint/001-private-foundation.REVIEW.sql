-- REVIEW-ONLY SCHEMA PROPOSAL. DO NOT APPLY. No API functions, no bootstrap,
-- no public-table mutations, no privileges granted to browser roles.
-- This is NOT the complete set of migrations needed for the full panel.
-- Mutually exclusive with the earlier biocraft_control prototype, unless an
-- explicit integration/migration plan is reviewed. Do not run on shared DB.
begin;
create schema bc_admin;
revoke all on schema bc_admin from public, anon, authenticated;

create table bc_admin.members (
 user_id uuid primary key references auth.users(id) on delete restrict,
 role text not null check (role in ('super_admin','admin','editor','moderator','analyst')),
 enabled boolean not null default true,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create table bc_admin.safety_controls (
 singleton boolean primary key default true check (singleton),
 publish_enabled boolean not null default false,
 telemetry_enabled boolean not null default false,
 updated_at timestamptz not null default now()
);
insert into bc_admin.safety_controls(singleton) values(true);

-- A managed logical object need not duplicate a public row. The concrete
-- resource-specific adapter must validate and resolve external_key before use.
create table bc_admin.documents (
 id uuid primary key default gen_random_uuid(),
 kind text not null check (kind in ('bio','category','platform','generator','font','symbol','emoji','hashtag','caption','collection','page','seo','site_config','feature_flag')),
 external_key text not null check (length(external_key) between 1 and 200),
 current_revision_id uuid,
 created_at timestamptz not null default now(),
 unique(kind,external_key)
);
create table bc_admin.revisions (
 id uuid primary key default gen_random_uuid(),
 document_id uuid not null references bc_admin.documents(id) on delete restrict,
 revision_number bigint not null check (revision_number > 0),
 base_revision_id uuid,
 author_id uuid not null references auth.users(id) on delete restrict,
 reviewer_id uuid references auth.users(id) on delete restrict,
 state text not null default 'draft' check (state in ('draft','submitted','approved','rejected','published','superseded')),
 payload jsonb not null check (jsonb_typeof(payload)='object' and pg_column_size(payload) <= 262144),
 payload_sha256 bytea not null check (octet_length(payload_sha256)=32),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 reviewed_at timestamptz,
 unique(document_id, revision_number),
 unique(document_id, id),
 foreign key(document_id, base_revision_id) references bc_admin.revisions(document_id,id) on delete restrict,
 check (reviewer_id is null or reviewer_id <> author_id),
 check ((state in ('approved','rejected','published','superseded')) = (reviewer_id is not null and reviewed_at is not null)),
 check ((reviewer_id is null) = (reviewed_at is null))
);
alter table bc_admin.documents add constraint documents_current_revision_same_document_fk
 foreign key(id,current_revision_id) references bc_admin.revisions(document_id,id) on delete restrict;
create index revisions_state_updated_idx on bc_admin.revisions(state,updated_at desc,id desc);
create index revisions_author_updated_idx on bc_admin.revisions(author_id,updated_at desc,id desc);

create table bc_admin.publication_history (
 id uuid primary key default gen_random_uuid(),
 document_id uuid not null references bc_admin.documents(id) on delete restrict,
 revision_id uuid not null,
 previous_revision_id uuid,
 actor_id uuid not null references auth.users(id) on delete restrict,
 published_at timestamptz not null default now(),
 unique(revision_id),
 foreign key(document_id,revision_id) references bc_admin.revisions(document_id,id) on delete restrict,
 foreign key(document_id,previous_revision_id) references bc_admin.revisions(document_id,id) on delete restrict
);
create index publication_history_document_time_idx on bc_admin.publication_history(document_id,published_at desc,id desc);
create table bc_admin.audit_events (
 id bigint generated always as identity primary key,
 actor_id uuid references auth.users(id) on delete restrict,
 action text not null check (length(action) between 1 and 100),
 target_kind text check (target_kind is null or length(target_kind) <= 100),
 target_id text check (target_id is null or length(target_id) <= 200),
 request_id uuid not null,
 occurred_at timestamptz not null default now(),
 details jsonb not null default '{}'::jsonb check (jsonb_typeof(details)='object' and pg_column_size(details) <= 4096)
);
create index audit_events_time_idx on bc_admin.audit_events(occurred_at desc,id desc);
create index audit_events_actor_time_idx on bc_admin.audit_events(actor_id,occurred_at desc,id desc);
create function bc_admin.reject_audit_mutation() returns trigger language plpgsql set search_path=pg_catalog as $$
begin raise exception 'audit events are append-only'; end $$;
create trigger audit_no_update_delete before update or delete on bc_admin.audit_events for each row execute function bc_admin.reject_audit_mutation();
create trigger audit_no_truncate before truncate on bc_admin.audit_events for each statement execute function bc_admin.reject_audit_mutation();

-- Rollups only, no raw searches or user-generated input. Specific metric names,
-- dimensions, privacy thresholds, ingestion and retention remain unresolved.
create table bc_admin.metric_rollups (
 bucket_start timestamptz not null,
 bucket_interval text not null check (bucket_interval in ('hour','day')),
 metric_name text not null check (metric_name ~ '^[a-z][a-z0-9_]{0,63}$'),
 dimension_key text not null default '' check (length(dimension_key) <= 100),
 sample_count bigint not null check (sample_count >= 0),
 metric_value double precision not null check (metric_value >= 0 and metric_value < 'Infinity'::float8),
 primary key(bucket_start,bucket_interval,metric_name,dimension_key)
);
create index metric_rollups_metric_time_idx on bc_admin.metric_rollups(metric_name,bucket_interval,bucket_start desc);

-- Explicit deny on each proposed private table. No permissive policies and no
-- access grants: browser roles cannot directly read or mutate any of them.
alter table bc_admin.members enable row level security;
alter table bc_admin.safety_controls enable row level security;
alter table bc_admin.documents enable row level security;
alter table bc_admin.revisions enable row level security;
alter table bc_admin.publication_history enable row level security;
alter table bc_admin.audit_events enable row level security;
alter table bc_admin.metric_rollups enable row level security;
create policy deny_clients on bc_admin.members as restrictive for all to anon, authenticated using(false) with check(false);
create policy deny_clients on bc_admin.safety_controls as restrictive for all to anon, authenticated using(false) with check(false);
create policy deny_clients on bc_admin.documents as restrictive for all to anon, authenticated using(false) with check(false);
create policy deny_clients on bc_admin.revisions as restrictive for all to anon, authenticated using(false) with check(false);
create policy deny_clients on bc_admin.publication_history as restrictive for all to anon, authenticated using(false) with check(false);
create policy deny_clients on bc_admin.audit_events as restrictive for all to anon, authenticated using(false) with check(false);
create policy deny_clients on bc_admin.metric_rollups as restrictive for all to anon, authenticated using(false) with check(false);
revoke all on all tables in schema bc_admin from public, anon, authenticated;
revoke all on all sequences in schema bc_admin from public, anon, authenticated;
revoke all on all functions in schema bc_admin from public, anon, authenticated;
commit;
