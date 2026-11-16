-- ISOLATED ADMIN DATABASE ONLY. Never apply to the existing public project.
-- Candidate migration: local synthetic tests only; independent security and
-- provider-specific ownership/default-ACL review required before deployment.
-- No client API, privileges, user accounts, or publication capability are created.
begin;
create schema bc_admin_v1;
revoke all on schema bc_admin_v1 from public, anon, authenticated;
-- Applies only to the executing creator role. Other creators require separate ACLs.
-- Per-schema revokes cannot remove the global default PUBLIC EXECUTE on new
-- functions. Every future function must explicitly revoke EXECUTE in the same
-- transaction; verify global and per-schema effective default ACLs. Do not
-- change global defaults on the shared project without separate approval.
alter default privileges in schema bc_admin_v1 revoke all on tables from public, anon, authenticated;
alter default privileges in schema bc_admin_v1 revoke all on sequences from public, anon, authenticated;
alter default privileges in schema bc_admin_v1 revoke execute on functions from public, anon, authenticated;

create table bc_admin_v1.admin_users (
 id uuid primary key references auth.users(id) on delete restrict,
 enabled boolean not null default false,
 version bigint not null default 1 check(version > 0),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 disabled_at timestamptz,
 check (enabled = false or disabled_at is null)
);
create table bc_admin_v1.admin_roles (
 id text primary key check(id in ('super_admin','admin','content_manager','editor','seo_manager','analyst','moderator','auditor')),
 description text not null check(length(description) between 1 and 200)
);
create table bc_admin_v1.admin_permissions (
 id text primary key check(id ~ '^[a-z][a-z0-9_.]{1,99}$'),
 description text not null check(length(description) between 1 and 200)
);
create table bc_admin_v1.admin_role_permissions (
 role_id text not null references bc_admin_v1.admin_roles(id) on delete restrict,
 permission_id text not null references bc_admin_v1.admin_permissions(id) on delete restrict,
 primary key(role_id,permission_id)
);
create table bc_admin_v1.admin_user_roles (
 user_id uuid not null references bc_admin_v1.admin_users(id) on delete restrict,
 role_id text not null references bc_admin_v1.admin_roles(id) on delete restrict,
 assigned_at timestamptz not null default now(),
 assigned_by uuid references bc_admin_v1.admin_users(id) on delete restrict,
 primary key(user_id,role_id)
);
create table bc_admin_v1.admin_sessions (
 id uuid primary key,
 user_id uuid not null references bc_admin_v1.admin_users(id) on delete restrict,
 created_at timestamptz not null default now(),
 expires_at timestamptz not null,
 revoked_at timestamptz,
 -- This field is evidence storage only; it must not be populated from a client claim.
 verified_mfa_at timestamptz,
 check(expires_at > created_at),
 check(revoked_at is null or revoked_at >= created_at),
 check(verified_mfa_at is null or verified_mfa_at >= created_at)
);
create index admin_sessions_user_idx on bc_admin_v1.admin_sessions(user_id,expires_at desc);
create table bc_admin_v1.admin_audit_logs (
 id bigint generated always as identity primary key,
 actor_id uuid references bc_admin_v1.admin_users(id) on delete restrict,
 request_id uuid not null,
 action text not null check(length(action) between 1 and 100),
 target_type text not null check(length(target_type) between 1 and 100),
 target_id text not null check(length(target_id) between 1 and 200),
 occurred_at timestamptz not null default now(),
 details jsonb not null default '{}'::jsonb check(jsonb_typeof(details)='object' and pg_column_size(details)<=4096)
);
create index admin_audit_time_idx on bc_admin_v1.admin_audit_logs(occurred_at desc,id desc);
create table bc_admin_v1.admin_settings (
 key text primary key check(key ~ '^[a-z][a-z0-9_.-]{0,99}$'),
 value jsonb not null check(pg_column_size(value)<=16384),
 version bigint not null default 1 check(version>0),
 updated_at timestamptz not null default now(),
 updated_by uuid references bc_admin_v1.admin_users(id) on delete restrict
);
create table bc_admin_v1.admin_content_versions (
 id uuid primary key default gen_random_uuid(),
 resource_type text not null check(resource_type in ('bio','category','collection','platform','generator','seo','setting')),
 resource_key text not null check(length(resource_key) between 1 and 200),
 version_number bigint not null check(version_number>0),
 payload jsonb not null check(jsonb_typeof(payload)='object' and pg_column_size(payload)<=262144),
 payload_sha256 bytea not null check(octet_length(payload_sha256)=32),
 created_by uuid not null references bc_admin_v1.admin_users(id) on delete restrict,
 created_at timestamptz not null default now(),
 unique(resource_type,resource_key,version_number)
);
create table bc_admin_v1.admin_drafts (
 id uuid primary key default gen_random_uuid(),
 version_id uuid not null unique references bc_admin_v1.admin_content_versions(id) on delete restrict,
 author_id uuid not null references bc_admin_v1.admin_users(id) on delete restrict,
 assigned_reviewer_id uuid references bc_admin_v1.admin_users(id) on delete restrict,
 state text not null default 'draft' check(state in ('draft','in_review','approved','rejected','queued','published')),
 row_version bigint not null default 1 check(row_version>0),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 check(assigned_reviewer_id is null or assigned_reviewer_id <> author_id)
);
create index admin_drafts_state_idx on bc_admin_v1.admin_drafts(state,updated_at desc,id);
create table bc_admin_v1.admin_approvals (
 id uuid primary key default gen_random_uuid(),
 draft_id uuid not null references bc_admin_v1.admin_drafts(id) on delete restrict,
 reviewer_id uuid not null references bc_admin_v1.admin_users(id) on delete restrict,
 decision text not null check(decision in ('approved','rejected')),
 reason_code text check(reason_code is null or reason_code ~ '^[a-z0-9_.-]{1,80}$'),
 created_at timestamptz not null default now()
);
create index admin_approvals_draft_idx on bc_admin_v1.admin_approvals(draft_id,created_at desc);
create table bc_admin_v1.admin_publication_jobs (
 id uuid primary key default gen_random_uuid(),
 draft_id uuid not null references bc_admin_v1.admin_drafts(id) on delete restrict,
 target_environment text not null check(target_environment in ('synthetic_preview','production')),
 state text not null default 'queued' check(state in ('queued','running','succeeded','failed','cancelled')),
 request_hash bytea not null check(octet_length(request_hash)=32),
 scheduled_at timestamptz not null,
 created_at timestamptz not null default now(),
 completed_at timestamptz,
 check ((state in ('succeeded','failed','cancelled')) = (completed_at is not null))
);
create index admin_jobs_state_schedule_idx on bc_admin_v1.admin_publication_jobs(state,scheduled_at,id);
create table bc_admin_v1.admin_notifications (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references bc_admin_v1.admin_users(id) on delete restrict,
 category text not null check(category ~ '^[a-z][a-z0-9_.-]{0,79}$'),
 message text not null check(length(message) between 1 and 1000),
 created_at timestamptz not null default now(), read_at timestamptz,
 check(read_at is null or read_at>=created_at)
);
create index admin_notifications_user_idx on bc_admin_v1.admin_notifications(user_id,created_at desc,id);
create table bc_admin_v1.admin_backup_records (
 id uuid primary key default gen_random_uuid(),
 environment text not null check(environment in ('synthetic_preview','production')),
 provider_reference text not null check(length(provider_reference) between 1 and 200),
 state text not null check(state in ('requested','completed','failed','restore_verified')),
 requested_at timestamptz not null default now(), verified_at timestamptz,
 check(state <> 'restore_verified' or verified_at is not null)
);
create table bc_admin_v1.admin_security_events (
 id bigint generated always as identity primary key,
 event_type text not null check(event_type ~ '^[a-z][a-z0-9_.-]{0,99}$'),
 request_id uuid, occurred_at timestamptz not null default now(),
 details jsonb not null default '{}'::jsonb check(jsonb_typeof(details)='object' and pg_column_size(details)<=4096)
);
create index admin_security_time_idx on bc_admin_v1.admin_security_events(occurred_at desc,id desc);

-- Immutable versions and audit/security evidence for ordinary database users.
-- Owners, superusers and BYPASSRLS remain privileged; external retention needed.
create function bc_admin_v1.reject_mutation() returns trigger
language plpgsql set search_path = pg_catalog as $$
begin raise exception 'append-only relation' using errcode='23514'; end $$;
create trigger content_no_change before update or delete on bc_admin_v1.admin_content_versions for each row execute function bc_admin_v1.reject_mutation();
create trigger content_no_truncate before truncate on bc_admin_v1.admin_content_versions for each statement execute function bc_admin_v1.reject_mutation();
create trigger approval_no_change before update or delete on bc_admin_v1.admin_approvals for each row execute function bc_admin_v1.reject_mutation();
create trigger approval_no_truncate before truncate on bc_admin_v1.admin_approvals for each statement execute function bc_admin_v1.reject_mutation();
create trigger audit_no_change before update or delete on bc_admin_v1.admin_audit_logs for each row execute function bc_admin_v1.reject_mutation();
create trigger audit_no_truncate before truncate on bc_admin_v1.admin_audit_logs for each statement execute function bc_admin_v1.reject_mutation();
create trigger security_no_change before update or delete on bc_admin_v1.admin_security_events for each row execute function bc_admin_v1.reject_mutation();
create trigger security_no_truncate before truncate on bc_admin_v1.admin_security_events for each statement execute function bc_admin_v1.reject_mutation();

-- No permissive policies, no client grants. Restrictive denial adds defense in
-- depth if a future permissive policy is accidentally introduced for clients.
do $$
declare r record;
begin
 for r in select tablename from pg_catalog.pg_tables where schemaname='bc_admin_v1' loop
  execute format('alter table bc_admin_v1.%I enable row level security',r.tablename);
  execute format('create policy deny_clients on bc_admin_v1.%I as restrictive for all to anon, authenticated using (false) with check (false)',r.tablename);
 end loop;
end $$;
revoke all on all tables in schema bc_admin_v1 from public, anon, authenticated;
revoke all on all sequences in schema bc_admin_v1 from public, anon, authenticated;
revoke all on all functions in schema bc_admin_v1 from public, anon, authenticated;
commit;
