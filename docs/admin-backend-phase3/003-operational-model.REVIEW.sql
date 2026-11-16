-- EXACT PROPOSED SQL FOR REVIEW ONLY. DO NOT APPLY TO ANY SHARED PROJECT.
-- Depends on docs/master-admin-blueprint/001-private-foundation.REVIEW.sql
-- and 002-authorization.REVIEW.sql, in an explicitly approved isolated clone
-- with auth.users and public.{bios,categories,platforms}. Not a complete admin
-- backend: grants, ownership, typed RPCs, provider integration and publication
-- functions do not exist. RLS here denies clients; no privileged feature is enabled.
-- This draft MUST be reviewed/revised after topology and workflow decisions.
begin;

-- Private operation metadata. Existing public rows and RLS are untouched.
alter table bc_admin.members add column version bigint not null default 1 check (version > 0);

-- One optional typed bio snapshot for a revision. public_id is null for new
-- records; existing IDs refer to the target database, not across environments.
create table bc_admin.bio_revision_fields (
 revision_id uuid primary key references bc_admin.revisions(id) on delete restrict,
 public_id uuid references public.bios(id) on delete restrict,
 platform_id uuid references public.platforms(id) on delete restrict,
 category_id uuid references public.categories(id) on delete restrict,
 title text check (title is null or length(title) <= 200),
 content text not null check (length(btrim(content)) > 0 and octet_length(content) <= 12000),
 plain_content text check (plain_content is null or octet_length(plain_content) <= 12000),
 language text not null check(language in ('en','hi','hg')),
 style_type text check(style_type is null or length(style_type) <= 100),
 source_slug text check(source_slug is null or length(source_slug) <= 200),
 emoji_rich boolean not null default false,
 is_styled boolean not null default false,
 is_featured boolean not null default false,
 is_trending boolean not null default false,
 is_active boolean not null default false
);
-- No generated character_count is accepted here. The future typed adapter must
-- check revision kind, match its canonical payload/hash, unique target mapping,
-- derive fields, validate per-platform counting and enforce per-kind constraints.

-- Administrative session registry is an additional deny/revocation control;
-- it cannot by itself verify an Auth session or manufacture MFA freshness.
-- Provider session_id format/availability and server-side attestation are an
-- explicit integration decision. Never store JWTs, refresh tokens or secrets.
create table bc_admin.admin_sessions (
 session_id uuid primary key,
 user_id uuid not null references bc_admin.members(user_id) on delete restrict,
 provider text not null check(length(provider) between 1 and 40),
 established_at timestamptz not null,
 expires_at timestamptz not null,
 last_verified_mfa_at timestamptz,
 revoked_at timestamptz,
 check(expires_at > established_at),
 check(last_verified_mfa_at is null or last_verified_mfa_at >= established_at),
 check(revoked_at is null or revoked_at >= established_at)
);
create index admin_sessions_member_idx on bc_admin.admin_sessions(user_id,expires_at desc);

-- Typed setting data is private and revisioned, never secret storage. The
-- eventual adapter validates a fixed key/value schema and rejects secret fields.
create table bc_admin.setting_revision_fields (
 revision_id uuid primary key references bc_admin.revisions(id) on delete restrict,
 setting_key text not null check(setting_key ~ '^[a-z][a-z0-9_.-]{0,99}$'),
 value jsonb not null check(pg_column_size(value) <= 16384)
);

-- Immutable revision-to-document edges should be verified at submit/publish by
-- a typed service; this table alone does not enforce graph acyclicity or kind.
create table bc_admin.revision_dependencies (
 revision_id uuid not null references bc_admin.revisions(id) on delete restrict,
 depends_on_document_id uuid not null references bc_admin.documents(id) on delete restrict,
 dependency_type text not null check(dependency_type in ('category','collection','platform','generator','page','other')),
 primary key(revision_id,depends_on_document_id,dependency_type)
);
create index revision_dependencies_document_idx on bc_admin.revision_dependencies(depends_on_document_id,revision_id);

-- Records an idempotency key and request digest; safe replay and atomic reserve
-- semantics must be implemented within the same transaction by future RPCs.
create table bc_admin.idempotency_requests (
 actor_id uuid not null references auth.users(id) on delete restrict,
 operation text not null check(operation ~ '^[a-z][a-z0-9_.-]{0,99}$'),
 idempotency_key uuid not null,
 request_hash bytea not null check(octet_length(request_hash)=32),
 state text not null check(state in ('started','completed')),
 response_code integer check(response_code between 200 and 299),
 response_body jsonb check(response_body is null or (jsonb_typeof(response_body)='object' and pg_column_size(response_body)<=16384)),
 created_at timestamptz not null default now(),
 expires_at timestamptz not null check(expires_at>created_at),
 primary key(actor_id,operation,idempotency_key),
 check ((state='started' and response_code is null and response_body is null) or
        (state='completed' and response_code is not null and response_body is not null))
);
create index idempotency_expiry_idx on bc_admin.idempotency_requests(expires_at);

-- State tables record metadata only, never backups or report files themselves.
-- Worker identity, scoped storage, leases, retries, transitions and delivery are
-- not implemented and require separately reviewed RPCs and external services.
create table bc_admin.jobs (
 id uuid primary key default gen_random_uuid(),
 kind text not null check(kind in ('bulk_draft','analytics_export','backup_request','cache_invalidation')),
 requested_by uuid not null references auth.users(id) on delete restrict,
 request_id uuid not null unique,
 state text not null default 'queued' check(state in ('queued','running','succeeded','failed','cancelled')),
 submitted_at timestamptz not null default now(),
 completed_at timestamptz,
 summary_code text check(summary_code is null or summary_code ~ '^[a-z0-9_.-]{1,80}$'),
 check ((state in ('succeeded','failed','cancelled')) = (completed_at is not null)),
 check (completed_at is null or completed_at >= submitted_at)
);
create index jobs_owner_time_idx on bc_admin.jobs(requested_by,submitted_at desc,id desc);
create table bc_admin.job_items (
 job_id uuid not null references bc_admin.jobs(id) on delete restrict,
 item_number integer not null check(item_number between 1 and 100),
 document_id uuid references bc_admin.documents(id) on delete restrict,
 state text not null default 'pending' check(state in ('pending','succeeded','failed')),
 result_code text check(result_code is null or result_code ~ '^[a-z0-9_.-]{1,80}$'),
 primary key(job_id,item_number)
);

-- An allowlist/registry proposal, not telemetry ingestion or privacy approval.
create table bc_admin.metric_definitions (
 name text primary key check(name ~ '^[a-z][a-z0-9_]{0,63}$'),
 unit text not null check(length(unit) between 1 and 40),
 source text not null check(length(source) between 1 and 100),
 minimum_samples integer not null check(minimum_samples > 0),
 retention_days integer not null check(retention_days between 1 and 3650),
 enabled boolean not null default false
);
-- Enforced metric allowlisting, consent, privacy thresholds, suppression and
-- approved data provider still require code and policy, not just this table.

-- Append-only event delivery checkpoint points to an existing committed audit
-- event. A delivery record is not proof of external immutable retention.
create table bc_admin.audit_delivery (
 event_id bigint not null references bc_admin.audit_events(id) on delete restrict,
 destination text not null check(destination ~ '^[a-z][a-z0-9_-]{0,63}$'),
 state text not null default 'pending' check(state in ('pending','delivered','failed')),
 attempts integer not null default 0 check(attempts >= 0),
 last_attempt_at timestamptz,
 primary key(event_id,destination)
);

-- Strict deny even if schema exposure or table grants are accidentally added.
-- RLS does not constrain table owners, BYPASSRLS, superusers, TRUNCATE, REFERENCES
-- or TRIGGER. Default privileges/ownership and server access remain unresolved.
alter table bc_admin.admin_sessions enable row level security;
alter table bc_admin.setting_revision_fields enable row level security;
alter table bc_admin.bio_revision_fields enable row level security;
alter table bc_admin.revision_dependencies enable row level security;
alter table bc_admin.idempotency_requests enable row level security;
alter table bc_admin.jobs enable row level security;
alter table bc_admin.job_items enable row level security;
alter table bc_admin.metric_definitions enable row level security;
alter table bc_admin.audit_delivery enable row level security;
create policy deny_clients on bc_admin.admin_sessions as restrictive for all to anon,authenticated using(false) with check(false);
create policy deny_clients on bc_admin.setting_revision_fields as restrictive for all to anon,authenticated using(false) with check(false);
create policy deny_clients on bc_admin.bio_revision_fields as restrictive for all to anon,authenticated using(false) with check(false);
create policy deny_clients on bc_admin.revision_dependencies as restrictive for all to anon,authenticated using(false) with check(false);
create policy deny_clients on bc_admin.idempotency_requests as restrictive for all to anon,authenticated using(false) with check(false);
create policy deny_clients on bc_admin.jobs as restrictive for all to anon,authenticated using(false) with check(false);
create policy deny_clients on bc_admin.job_items as restrictive for all to anon,authenticated using(false) with check(false);
create policy deny_clients on bc_admin.metric_definitions as restrictive for all to anon,authenticated using(false) with check(false);
create policy deny_clients on bc_admin.audit_delivery as restrictive for all to anon,authenticated using(false) with check(false);
revoke all on all tables in schema bc_admin from public,anon,authenticated;
revoke all on all sequences in schema bc_admin from public,anon,authenticated;
revoke all on all functions in schema bc_admin from public,anon,authenticated;
commit;
