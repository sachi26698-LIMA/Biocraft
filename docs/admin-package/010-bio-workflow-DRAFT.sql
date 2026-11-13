-- REVIEW ONLY. NOT APPROVED OR DEPLOYED. Independent of 001-readonly-rbac.sql.
-- Narrow prototype: edits existing bio content only. Not the complete panel.
-- Publish is deliberately disabled, including for Super Admins.
begin;
create schema biocraft_control;
revoke all on schema biocraft_control from public, anon, authenticated;

create table biocraft_control.members (
 user_id uuid primary key references auth.users(id) on delete restrict,
 role text not null check (role in ('super_admin','admin','editor','analyst')),
 enabled boolean not null default true,
 created_at timestamptz not null default now()
);
create table biocraft_control.settings (
 singleton boolean primary key default true check (singleton),
 publish_enabled boolean not null default false
);
insert into biocraft_control.settings(singleton) values (true);
create table biocraft_control.bio_revisions (
 id uuid primary key default gen_random_uuid(),
 bio_id uuid not null references public.bios(id) on delete restrict,
 author_id uuid not null references auth.users(id) on delete restrict,
 reviewer_id uuid references auth.users(id) on delete restrict,
 state text not null default 'draft' check (state in ('draft','submitted','approved','published','rejected')),
 base_value jsonb not null check (jsonb_typeof(base_value)='object'),
 proposed_value jsonb not null check (jsonb_typeof(proposed_value)='object'),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 check ((state in ('approved','published','rejected')) = (reviewer_id is not null)),
 check (reviewer_id is null or reviewer_id <> author_id)
);
create index bio_revisions_state_created_idx on biocraft_control.bio_revisions(state, created_at desc, id);
create index bio_revisions_bio_created_idx on biocraft_control.bio_revisions(bio_id, created_at desc, id);
create table biocraft_control.audit_events (
 id bigint generated always as identity primary key,
 actor_id uuid references auth.users(id) on delete restrict,
 action text not null check (action in ('bootstrap','draft_create','draft_update','submit','approve','reject','publish')),
 target_id uuid,
 occurred_at timestamptz not null default now(),
 details jsonb not null default '{}'::jsonb check (jsonb_typeof(details)='object')
);
create index audit_events_time_idx on biocraft_control.audit_events(occurred_at desc, id desc);

-- No permissive policy: access is denied by default for all roles subject to
-- RLS. Explicit restrictive policies make the intended anon/auth denial clear.
alter table biocraft_control.members enable row level security;
alter table biocraft_control.settings enable row level security;
alter table biocraft_control.bio_revisions enable row level security;
alter table biocraft_control.audit_events enable row level security;
create policy members_deny on biocraft_control.members as restrictive for all to anon, authenticated using (false) with check (false);
create policy settings_deny on biocraft_control.settings as restrictive for all to anon, authenticated using (false) with check (false);
create policy bio_revisions_deny on biocraft_control.bio_revisions as restrictive for all to anon, authenticated using (false) with check (false);
create policy audit_events_deny on biocraft_control.audit_events as restrictive for all to anon, authenticated using (false) with check (false);
revoke all on all tables in schema biocraft_control from public, anon, authenticated;
revoke all on all sequences in schema biocraft_control from public, anon, authenticated;

create function biocraft_control.guard(p_roles text[]) returns uuid
language plpgsql stable security definer set search_path = pg_catalog as $$
declare uid uuid := auth.uid();
begin
 if uid is null or coalesce(auth.jwt()->>'aal','') <> 'aal2' or not exists (
   select 1 from biocraft_control.members where user_id=uid and enabled and role=any(p_roles)
 ) then raise exception 'Not authorized' using errcode='42501'; end if;
 return uid;
end $$;

-- Only editable fields are captured; platform/category association is not
-- editable in this prototype. Capturing platform_id prevents changing a bio's
-- platform after approval without triggering a publish conflict.
create function biocraft_control.bio_value(b public.bios) returns jsonb
language sql immutable set search_path=pg_catalog as $$
 select jsonb_build_object('content', b.content, 'language', b.language,
 'is_active', b.is_active, 'is_featured', b.is_featured, 'platform_id', b.platform_id)
$$;
create function biocraft_control.validate_value(v jsonb) returns void
language plpgsql immutable set search_path=pg_catalog as $$
begin
 if jsonb_typeof(v) <> 'object' or (select count(*) from jsonb_object_keys(v)) <> 5
    or not (v ?& array['content','language','is_active','is_featured','platform_id'])
    or jsonb_typeof(v->'content') <> 'string' or length(btrim(v->>'content'))=0
    or char_length(v->>'content') > 2600
    or jsonb_typeof(v->'language') <> 'string' or v->>'language' not in ('en','hi','hg')
    or jsonb_typeof(v->'is_active') <> 'boolean' or jsonb_typeof(v->'is_featured') <> 'boolean'
    or jsonb_typeof(v->'platform_id') not in ('string','null') then
   raise exception 'Invalid bio revision' using errcode='22023';
 end if;
end $$;
create function biocraft_control.audit(p_actor uuid,p_action text,p_target uuid) returns void
language sql security definer set search_path=pg_catalog as $$
 insert into biocraft_control.audit_events(actor_id,action,target_id) values(p_actor,p_action,p_target)
$$;
create function biocraft_control.prevent_audit_mutation() returns trigger
language plpgsql set search_path=pg_catalog as $$
begin raise exception 'Audit records are append-only'; end $$;
create trigger protect_audit_rows before update or delete on biocraft_control.audit_events
 for each row execute function biocraft_control.prevent_audit_mutation();
create trigger protect_audit_truncate before truncate on biocraft_control.audit_events
 for each statement execute function biocraft_control.prevent_audit_mutation();

create function public.bc_control_create_draft(p_bio_id uuid) returns uuid
language plpgsql security definer set search_path=pg_catalog as $$
declare actor uuid; b public.bios%rowtype; rid uuid; snapshot jsonb;
begin
 actor := biocraft_control.guard(array['super_admin','admin','editor']);
 select * into b from public.bios where id=p_bio_id;
 if not found then raise exception 'Bio not found' using errcode='P0002'; end if;
 snapshot := biocraft_control.bio_value(b);
 insert into biocraft_control.bio_revisions(bio_id,author_id,base_value,proposed_value)
 values(p_bio_id,actor,snapshot,snapshot) returning id into rid;
 perform biocraft_control.audit(actor,'draft_create',rid); return rid;
end $$;
create function public.bc_control_update_draft(p_id uuid,p_value jsonb) returns void
language plpgsql security definer set search_path=pg_catalog as $$
declare actor uuid; r biocraft_control.bio_revisions%rowtype;
begin
 actor := biocraft_control.guard(array['super_admin','admin','editor']);
 select * into r from biocraft_control.bio_revisions where id=p_id for update;
 if not found or r.state <> 'draft' or r.author_id <> actor then raise exception 'Not authorized' using errcode='42501'; end if;
 perform biocraft_control.validate_value(p_value);
 if p_value->'platform_id' is distinct from r.base_value->'platform_id' then
   raise exception 'Platform changes are not supported' using errcode='22023'; end if;
 update biocraft_control.bio_revisions set proposed_value=p_value, updated_at=now() where id=p_id;
 perform biocraft_control.audit(actor,'draft_update',p_id);
end $$;
create function public.bc_control_submit(p_id uuid) returns void
language plpgsql security definer set search_path=pg_catalog as $$
declare actor uuid; r biocraft_control.bio_revisions%rowtype;
begin
 actor := biocraft_control.guard(array['super_admin','admin','editor']);
 select * into r from biocraft_control.bio_revisions where id=p_id for update;
 if not found or r.state <> 'draft' or r.author_id <> actor then raise exception 'Not authorized' using errcode='42501'; end if;
 perform biocraft_control.validate_value(r.proposed_value);
 update biocraft_control.bio_revisions set state='submitted',updated_at=now() where id=p_id;
 perform biocraft_control.audit(actor,'submit',p_id);
end $$;
create function public.bc_control_review(p_id uuid,p_approve boolean) returns void
language plpgsql security definer set search_path=pg_catalog as $$
declare actor uuid; r biocraft_control.bio_revisions%rowtype;
begin
 actor := biocraft_control.guard(array['super_admin','admin']);
 select * into r from biocraft_control.bio_revisions where id=p_id for update;
 if not found or r.state <> 'submitted' or r.author_id=actor then raise exception 'Not authorized' using errcode='42501'; end if;
 if p_approve is null then raise exception 'Decision required' using errcode='22023'; end if;
 update biocraft_control.bio_revisions set state=case when p_approve then 'approved' else 'rejected' end,
 reviewer_id=actor,updated_at=now() where id=p_id;
 perform biocraft_control.audit(actor,case when p_approve then 'approve' else 'reject' end,p_id);
end $$;
create function public.bc_control_publish(p_id uuid) returns void
language plpgsql security definer set search_path=pg_catalog as $$
declare actor uuid; r biocraft_control.bio_revisions%rowtype; b public.bios%rowtype;
begin
 actor := biocraft_control.guard(array['super_admin','admin']);
 -- Safety switch is owned and changed only by a trusted database operator,
 -- never by any authenticated API role. Default off. No enable API exists.
 if not coalesce((select publish_enabled from biocraft_control.settings where singleton),false) then
   raise exception 'Publishing disabled' using errcode='55000'; end if;
 select * into r from biocraft_control.bio_revisions where id=p_id for update;
 if not found or r.state <> 'approved' or r.author_id=actor then raise exception 'Not authorized' using errcode='42501'; end if;
 select * into b from public.bios where id=r.bio_id for update;
 if not found or biocraft_control.bio_value(b) is distinct from r.base_value then
   raise exception 'Bio changed since draft creation' using errcode='40001'; end if;
 perform biocraft_control.validate_value(r.proposed_value);
 update public.bios set content=r.proposed_value->>'content',
  language=r.proposed_value->>'language', is_active=(r.proposed_value->>'is_active')::boolean,
  is_featured=(r.proposed_value->>'is_featured')::boolean where id=r.bio_id;
 update biocraft_control.bio_revisions set state='published',updated_at=now() where id=p_id;
 perform biocraft_control.audit(actor,'publish',p_id);
end $$;

revoke all on all functions in schema biocraft_control from public, anon, authenticated;
revoke all on function public.bc_control_create_draft(uuid), public.bc_control_update_draft(uuid,jsonb),
 public.bc_control_submit(uuid), public.bc_control_review(uuid,boolean), public.bc_control_publish(uuid)
 from public, anon, authenticated;
grant execute on function public.bc_control_create_draft(uuid), public.bc_control_update_draft(uuid,jsonb),
 public.bc_control_submit(uuid), public.bc_control_review(uuid,boolean), public.bc_control_publish(uuid) to authenticated;
commit;
