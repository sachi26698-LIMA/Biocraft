-- LOCAL SYNTHETIC FIXTURES ONLY. No client grants, do not apply to shared DB.
-- Stores encrypted short-lived login handoffs and hashed rate-limit keys, never
-- passwords, raw tokens or raw IP addresses. Requires ingress limits and an
-- independently reviewed cleanup job before hosted use.
begin;
create table bc_admin_v1.admin_login_flows (
 flow_hash bytea primary key check(octet_length(flow_hash)=32),
 encrypted_data bytea not null check(octet_length(encrypted_data) between 29 and 8192),
 expires_at timestamptz not null
);
create index admin_login_flows_expiry_idx on bc_admin_v1.admin_login_flows(expires_at);
create table bc_admin_v1.admin_rate_limits (
 bucket text not null check(bucket in ('password-login','totp-verify','admin-api')),
 key_hash bytea not null check(octet_length(key_hash)=32),
 started_at timestamptz not null, attempts integer not null check(attempts>0),
 primary key(bucket,key_hash)
);
create index admin_rate_limits_time_idx on bc_admin_v1.admin_rate_limits(started_at);
alter table bc_admin_v1.admin_login_flows enable row level security;
alter table bc_admin_v1.admin_rate_limits enable row level security;
create policy deny_clients on bc_admin_v1.admin_login_flows as restrictive for all to anon,authenticated using(false) with check(false);
create policy deny_clients on bc_admin_v1.admin_rate_limits as restrictive for all to anon,authenticated using(false) with check(false);
revoke all on bc_admin_v1.admin_login_flows,bc_admin_v1.admin_rate_limits from public,anon,authenticated;
create function bc_admin_v1.store_login_flow(p_hash bytea,p_data bytea,p_ttl integer) returns void
language plpgsql security definer set search_path=pg_catalog as $$
begin
 if octet_length(p_hash) is distinct from 32 or octet_length(p_data) not between 29 and 8192 or p_ttl is null or p_ttl<1 or p_ttl>300 then
  raise exception 'invalid login flow' using errcode='22023'; end if;
 insert into bc_admin_v1.admin_login_flows(flow_hash,encrypted_data,expires_at) values(p_hash,p_data,now()+make_interval(secs=>p_ttl));
end $$;
create function bc_admin_v1.take_login_flow(p_hash bytea) returns bytea
language plpgsql security definer set search_path=pg_catalog as $$
declare result bytea;
begin
 if octet_length(p_hash) is distinct from 32 then raise exception 'invalid login flow' using errcode='22023'; end if;
 delete from bc_admin_v1.admin_login_flows where flow_hash=p_hash and expires_at>now() returning encrypted_data into result;
 return result;
end $$;
create function bc_admin_v1.consume_rate_limit(p_bucket text,p_hash bytea) returns boolean
language plpgsql security definer set search_path=pg_catalog as $$
declare cap integer; n integer;
begin
 if octet_length(p_hash) is distinct from 32 then raise exception 'invalid rate key' using errcode='22023'; end if;
 cap:=case p_bucket when 'password-login' then 5 when 'totp-verify' then 10 when 'admin-api' then 120 else null end;
 if cap is null then raise exception 'invalid bucket' using errcode='22023'; end if;
 insert into bc_admin_v1.admin_rate_limits(bucket,key_hash,started_at,attempts) values(p_bucket,p_hash,now(),1)
 on conflict(bucket,key_hash) do update set
 attempts=case when bc_admin_v1.admin_rate_limits.started_at<=now()-interval '1 minute' then 1 else bc_admin_v1.admin_rate_limits.attempts+1 end,
 started_at=case when bc_admin_v1.admin_rate_limits.started_at<=now()-interval '1 minute' then now() else bc_admin_v1.admin_rate_limits.started_at end
 returning attempts into n;
 return n<=cap;
end $$;
revoke all on function bc_admin_v1.store_login_flow(bytea,bytea,integer),bc_admin_v1.take_login_flow(bytea),bc_admin_v1.consume_rate_limit(text,bytea) from public,anon,authenticated;
commit;
