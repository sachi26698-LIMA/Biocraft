-- DRAFT ONLY. DO NOT APPLY to the shared project without explicit approval.
-- This is an additive read-only foundation, NOT the complete admin system.
-- It deliberately grants no write permissions on public content tables.
-- It requires Supabase Auth, and administrator bootstrap is a separate manual,
-- audited operation by the project owner after independent security review.

begin;
create schema if not exists biocraft_admin_private;
revoke all on schema biocraft_admin_private from public, anon, authenticated;

create table biocraft_admin_private.members (
  user_id uuid primary key references auth.users(id) on delete restrict,
  role text not null check (role in ('super_admin', 'admin', 'editor', 'analyst')),
  enabled boolean not null default true,
  created_at timestamptz not null default now()
);
alter table biocraft_admin_private.members enable row level security;
revoke all on biocraft_admin_private.members from public, anon, authenticated;

-- Helper is in a non-exposed schema and re-reads current membership on every
-- call; role claims or browser state are never trusted.
create function biocraft_admin_private.current_role() returns text
language sql stable security definer set search_path = pg_catalog as $$
  select m.role from biocraft_admin_private.members m
  where m.user_id = auth.uid() and m.enabled = true
$$;
revoke all on function biocraft_admin_private.current_role() from public, anon, authenticated;

create function public.bc_admin_context() returns jsonb
language plpgsql stable security definer set search_path = pg_catalog as $$
declare v_role text;
begin
  if auth.uid() is null then raise exception 'Not authorized' using errcode = '42501'; end if;
  v_role := biocraft_admin_private.current_role();
  if v_role is null then raise exception 'Not authorized' using errcode = '42501'; end if;
  return jsonb_build_object('role', v_role);
end;
$$;
revoke all on function public.bc_admin_context() from public, anon, authenticated;
grant execute on function public.bc_admin_context() to authenticated;

-- Counts are computed from existing content, not synthetic analytics. Access is
-- checked inside this function on every request, independent of client checks.
create function public.bc_admin_dashboard() returns jsonb
language plpgsql stable security definer set search_path = pg_catalog as $$
declare v_role text;
begin
  if auth.uid() is null then raise exception 'Not authorized' using errcode = '42501'; end if;
  v_role := biocraft_admin_private.current_role();
  if v_role not in ('super_admin','admin','editor','analyst') or v_role is null then
    raise exception 'Not authorized' using errcode = '42501';
  end if;
  return jsonb_build_object(
    'active_bios', (select count(*) from public.bios where is_active),
    'inactive_bios', (select count(*) from public.bios where not is_active),
    'categories', (select count(*) from public.categories),
    'platforms', (select count(*) from public.platforms),
    'generators', (select count(*) from public.generators)
  );
end;
$$;
revoke all on function public.bc_admin_dashboard() from public, anon, authenticated;
grant execute on function public.bc_admin_dashboard() to authenticated;
commit;
