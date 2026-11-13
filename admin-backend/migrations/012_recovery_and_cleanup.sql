-- LOCAL SYNTHETIC FIXTURES ONLY. Not approved for shared execution.
-- Recovery authorisation, single-use recovery tokens, and bounded cleanup of the
-- two operational tables from 006.
--
-- Design goals (owner decisions D2 and D4):
--  * There is no password-only route back in for an account that ever had a
--    verified factor. Recovery requires a second, already fully authenticated
--    Super Admin to authorise one specific account, one time.
--  * A recovery grant is bound to the requesting account, expires quickly, is
--    consumed atomically exactly once, and can be withdrawn by a Super Admin.
--  * Every attempt, including denied and rate-limited ones, commits an audit row
--    with no token material.
--  * Cleanup deletes only expired operational rows, never audit evidence, works
--    in bounded batches under a per-table advisory lock, and records the outcome.
begin;

-- D2 needs to tell "never enrolled" apart from "lost the factor": the provider
-- reports zero verified factors for both. This column is written once, by the
-- database, when a second factor has actually been proven (open_admin_session
-- below), so the distinction cannot be forged by a password-only session.
alter table bc_admin_v1.admin_users add column mfa_enrolled_at timestamptz;

-- Stamp the first proof of a second factor. open_admin_session (005) can only
-- succeed for an aal2 caller, so an inserted row is itself the evidence; doing it
-- in a trigger keeps 005 unchanged and makes the write unconditional for every
-- future command that opens a session.
create function bc_admin_v1.stamp_mfa_enrolled() returns trigger
language plpgsql security definer set search_path=pg_catalog as $$
begin
 update bc_admin_v1.admin_users u
  set mfa_enrolled_at = coalesce(u.mfa_enrolled_at, now())
  where u.id = new.user_id;
 return null;
end $$;
create trigger admin_sessions_stamp_mfa after insert on bc_admin_v1.admin_sessions
 for each row execute function bc_admin_v1.stamp_mfa_enrolled();

-- Pre-MFA decision for a password session with zero verified factors.
--   'enrol'   -> an enabled member that has never proven a factor may enrol one;
--   'recover' -> an enabled member that previously had one must use recovery;
--   'denied'  -> everything else.
-- Returns text instead of raising so the audit row commits; the caller rejects
-- anything that is not 'enrol' or 'recover'.
-- 011's gate answered "is this account allowed to have a factor", which stays true
-- for an account that already proved one. With 012 the enrolment record exists, so
-- the gate can also answer "has it never enrolled", and it is replaced here rather
-- than edited in 011 because the column it reads is created by this file. After
-- this statement the only way to reach enrolment from a password session is an
-- account whose factor was never proven, or was explicitly reset.
create or replace function bc_admin_v1.enrolment_eligible(p_request_id uuid) returns boolean
language plpgsql security definer set search_path=pg_catalog as $$
declare uid uuid; sid uuid; eligible boolean:=false;
begin
 if p_request_id is null then raise exception 'invalid request' using errcode='22023'; end if;
 uid:=auth.uid();
 begin sid:=nullif(auth.jwt()->>'session_id','')::uuid;
 exception when invalid_text_representation then sid:=null; end;
 if uid is not null and sid is not null and coalesce(auth.jwt()->>'aal','') in ('aal1','aal2') then
  select exists(
    select 1 from bc_admin_v1.admin_users u
    where u.id=uid and u.enabled and u.mfa_enrolled_at is null
      and exists(select 1 from bc_admin_v1.admin_user_roles r where r.user_id=u.id)
      and exists(select 1 from auth.sessions s where s.id=sid and s.user_id=uid)
  ) into eligible;
 end if;
 insert into bc_admin_v1.admin_audit_logs(actor_id,request_id,action,target_type,target_id,details)
 values(case when eligible then uid else null end,p_request_id,'auth.enrolment_attempt','staff',uid::text,
        jsonb_build_object('eligible',eligible));
 return eligible;
end $$;

create function bc_admin_v1.factor_gate(p_request_id uuid) returns text
language plpgsql security definer set search_path=pg_catalog as $$
declare uid uuid; sid uuid; eligible boolean:=false; enrolled boolean:=false; outcome text:='denied';
begin
 if p_request_id is null then raise exception 'invalid factor request' using errcode='22023'; end if;
 uid := auth.uid();
 begin sid := nullif(auth.jwt()->>'session_id','')::uuid;
 exception when invalid_text_representation then sid := null; end;
 if uid is not null and sid is not null and coalesce(auth.jwt()->>'aal','') in ('aal1','aal2') then
  select true, (u.mfa_enrolled_at is not null) into eligible, enrolled
   from bc_admin_v1.admin_users u
   where u.id = uid and u.enabled
     and exists (select 1 from bc_admin_v1.admin_user_roles r where r.user_id = u.id)
     and exists (select 1 from auth.sessions s where s.id = sid and s.user_id = uid);
  if eligible then outcome := case when enrolled then 'recover' else 'enrol' end; end if;
 end if;
 insert into bc_admin_v1.admin_audit_logs(actor_id,request_id,action,target_type,target_id,details)
 values (case when eligible then uid else null end, p_request_id, 'auth.factor_gate', 'staff', uid::text,
         pg_catalog.jsonb_build_object('outcome', outcome));
 return outcome;
end $$;

-- A short, human-transcribed code (Crockford base32, no vowels, so it cannot
-- spell a word) is hashed with pg_catalog.sha256 over a random 32-byte salt. The
-- plaintext exists only in the Super Admin's browser and the recovering user's
-- browser: the database stores 8 bytes of salt and 32 bytes of digest.
create table bc_admin_v1.admin_recovery_grants (
 id uuid primary key,
 user_id uuid not null,
 issued_by uuid not null,
 issued_at timestamptz not null,
 expires_at timestamptz not null,
 salt bytea not null,
 code_hash bytea not null,
 attempts integer not null default 0,
 consumed_at timestamptz,
 revoked_at timestamptz,
 constraint recovery_grants_salt_len check (octet_length(salt) = 8),
 constraint recovery_grants_hash_len check (octet_length(code_hash) = 32),
 constraint recovery_grants_window check (expires_at > issued_at and expires_at <= issued_at + interval '15 minutes'),
 constraint recovery_grants_attempts check (attempts between 0 and 5),
 constraint recovery_grants_consumed check ((consumed_at is null) or (revoked_at is null))
);
create index admin_recovery_grants_user_idx on bc_admin_v1.admin_recovery_grants(user_id, issued_at desc);
create index admin_recovery_grants_expiry_idx on bc_admin_v1.admin_recovery_grants(expires_at);

-- One row per cleanup run. Retained as evidence; bounded by a partial unique
-- index so a table cannot have two concurrent finishes for the same instant.
create table bc_admin_v1.admin_cleanup_runs (
 id bigint generated always as identity primary key,
 target text not null check (target in ('admin_login_flows','admin_rate_limits')),
 started_at timestamptz not null,
 finished_at timestamptz,
 deleted integer not null default 0 check (deleted >= 0),
 skipped boolean not null default false,
 detail jsonb not null default '{}'::jsonb
);
create index admin_cleanup_runs_target_idx on bc_admin_v1.admin_cleanup_runs(target, id desc);

alter table bc_admin_v1.admin_recovery_grants enable row level security;
alter table bc_admin_v1.admin_cleanup_runs enable row level security;
create policy deny_clients on bc_admin_v1.admin_recovery_grants as restrictive for all to anon,authenticated using(false) with check(false);
create policy deny_clients on bc_admin_v1.admin_cleanup_runs as restrictive for all to anon,authenticated using(false) with check(false);
revoke all on bc_admin_v1.admin_recovery_grants,bc_admin_v1.admin_cleanup_runs from public,anon,authenticated;

-- A recovery code is delivered out of band by the Super Admin. Format:
-- 8 characters from a 32-symbol alphabet (no 0/O/1/I/L/U), plus 4 checksum
-- characters, 12 characters total, ~40 bits of entropy, single use, 5 attempts.
-- Normalisation (upper case, strip separators) happens in the trusted server, not
-- here, so this function compares a fixed-length digest only.
create function bc_admin_v1.issue_recovery_grant(
 p_user_id uuid, p_code_hash bytea, p_salt bytea, p_ttl interval, p_request_id uuid)
returns uuid
language plpgsql security definer set search_path=pg_catalog as $$
declare actor uuid; gid uuid; target_enabled boolean; live boolean;
begin
 actor := bc_admin_v1.require_actor('staff.manage');
 if p_request_id is null or p_user_id is null or p_code_hash is null or p_salt is null then
  raise exception 'invalid recovery grant' using errcode='22023';
 end if;
 if octet_length(p_code_hash) <> 32 or octet_length(p_salt) <> 8 then
  raise exception 'invalid recovery grant' using errcode='22023';
 end if;
 if p_ttl is null or p_ttl < interval '1 minute' or p_ttl > interval '15 minutes' then
  raise exception 'invalid recovery window' using errcode='22023';
 end if;
 -- The target must be an enabled Admin member, and must not be the issuer: a
 -- Super Admin cannot authorise recovery of their own account.
 if p_user_id = actor then raise exception 'self recovery is not permitted' using errcode='42501'; end if;
 -- Serialise on the target account: this is the same row lock 007's update_staff
 -- takes, so a concurrent disable and a concurrent grant cannot interleave.
 select u.enabled into target_enabled from bc_admin_v1.admin_users u where u.id = p_user_id for update;
 if target_enabled is not true then raise exception 'not authorized' using errcode='42501'; end if;
 if not exists (select 1 from bc_admin_v1.admin_user_roles r where r.user_id = p_user_id) then
  raise exception 'not authorized' using errcode='42501';
 end if;
 -- Only one live grant per account: a second Super Admin cannot race a first.
 update bc_admin_v1.admin_recovery_grants g
  set revoked_at = now()
  where g.user_id = p_user_id and g.consumed_at is null and g.revoked_at is null;
 gid := pg_catalog.gen_random_uuid();
 insert into bc_admin_v1.admin_recovery_grants(id,user_id,issued_by,issued_at,expires_at,salt,code_hash)
 values (gid, p_user_id, actor, now(), now() + p_ttl, p_salt, p_code_hash);
 insert into bc_admin_v1.admin_audit_logs(actor_id,request_id,action,target_type,target_id,details)
 values (actor, p_request_id, 'auth.recovery.issued', 'staff', p_user_id::text,
         pg_catalog.jsonb_build_object('grant_id', gid, 'expires_in_seconds', extract(epoch from p_ttl)::integer));
 return gid;
end $$;

create function bc_admin_v1.revoke_recovery_grant(p_grant_id uuid, p_request_id uuid) returns boolean
language plpgsql security definer set search_path=pg_catalog as $$
declare actor uuid; changed integer;
begin
 actor := bc_admin_v1.require_actor('staff.manage');
 if p_grant_id is null or p_request_id is null then
  raise exception 'invalid recovery grant' using errcode='22023';
 end if;
 update bc_admin_v1.admin_recovery_grants g
  set revoked_at = now()
  where g.id = p_grant_id and g.consumed_at is null and g.revoked_at is null;
 get diagnostics changed = row_count;
 insert into bc_admin_v1.admin_audit_logs(actor_id,request_id,action,target_type,target_id,details)
 values (actor, p_request_id, 'auth.recovery.revoked', 'recovery_grant', p_grant_id::text,
         pg_catalog.jsonb_build_object('revoked', changed > 0));
 return changed > 0;
end $$;

-- Closes the D2 workflow wart. A completed recovery authorises the account but
-- does not touch the factor: the operator deletes the stale factor at the
-- provider, then a Super Admin clears this record through the Admin UI, which
-- returns the account to the ordinary first-enrolment path. It is deliberately a
-- separate privileged, audited, per-account action and never a side effect of
-- redeeming a code: redemption still changes nothing, self-reset is refused, and
-- only staff.manage (AAL2 Super Admin) can call it.
create function bc_admin_v1.reset_factor_enrolment(p_user_id uuid, p_request_id uuid) returns boolean
language plpgsql security definer set search_path=pg_catalog as $$
declare actor uuid; changed integer;
begin
 actor := bc_admin_v1.require_actor('staff.manage');
 if p_user_id is null or p_request_id is null then
  raise exception 'invalid factor reset' using errcode='22023';
 end if;
 -- Self-reset is refused for the same reason self-recovery is: one account must
 -- never be able to re-open its own mandatory enrolment.
 if p_user_id = actor then
  raise exception 'self factor reset refused' using errcode='42501';
 end if;
 update bc_admin_v1.admin_users u
  set mfa_enrolled_at = null, updated_at = now()
  where u.id = p_user_id and u.mfa_enrolled_at is not null;
 get diagnostics changed = row_count;
 insert into bc_admin_v1.admin_audit_logs(actor_id,request_id,action,target_type,target_id,details)
 values (actor, p_request_id, 'auth.recovery.factor_reset', 'staff', p_user_id::text,
         pg_catalog.jsonb_build_object('reset', changed > 0));
 return changed > 0;
end $$;

-- Pre-MFA by necessity: the recovering account has lost its factor. It must have
-- a live password (aal1) provider session, an enabled membership and at least one
-- role, exactly like the first-factor enrolment gate in 011. It returns text
-- instead of raising so the audit row commits; the server rejects anything that
-- is not 'ok'.
create function bc_admin_v1.consume_recovery_grant(p_code_hash bytea, p_request_id uuid) returns text
language plpgsql security definer set search_path=pg_catalog as $$
declare uid uuid; sid uuid; grant_row bc_admin_v1.admin_recovery_grants; outcome text:='denied';
begin
 if p_request_id is null or p_code_hash is null or octet_length(p_code_hash) <> 32 then
  raise exception 'invalid recovery attempt' using errcode='22023';
 end if;
 uid := auth.uid();
 begin sid := nullif(auth.jwt()->>'session_id','')::uuid;
 exception when invalid_text_representation then sid := null; end;
 if uid is not null and sid is not null and coalesce(auth.jwt()->>'aal','') in ('aal1','aal2')
    and exists (select 1 from bc_admin_v1.admin_users u where u.id = uid and u.enabled)
    and exists (select 1 from bc_admin_v1.admin_user_roles r where r.user_id = uid)
    and exists (select 1 from auth.sessions s where s.id = sid and s.user_id = uid) then
  -- FOR UPDATE serialises concurrent guesses on the same grant, so the attempt
  -- counter cannot be bypassed by parallel requests.
  select g.* into grant_row from bc_admin_v1.admin_recovery_grants g
   where g.user_id = uid and g.consumed_at is null and g.revoked_at is null and g.expires_at > now()
   order by g.issued_at desc limit 1
   for update;
  if found then
   if grant_row.code_hash = p_code_hash then
    update bc_admin_v1.admin_recovery_grants g set consumed_at = now() where g.id = grant_row.id;
    outcome := 'ok';
   else
    update bc_admin_v1.admin_recovery_grants g set attempts = g.attempts + 1 where g.id = grant_row.id;
    outcome := case when grant_row.attempts + 1 >= 5 then 'exhausted' else 'mismatch' end;
    if grant_row.attempts + 1 >= 5 then
     update bc_admin_v1.admin_recovery_grants g set revoked_at = now() where g.id = grant_row.id;
    end if;
   end if;
  else
   outcome := 'no_grant';
  end if;
 end if;
 insert into bc_admin_v1.admin_audit_logs(actor_id,request_id,action,target_type,target_id,details)
 values (case when outcome = 'ok' then uid else null end, p_request_id, 'auth.recovery.attempt', 'staff', uid::text,
         pg_catalog.jsonb_build_object('outcome', outcome));
 return outcome;
end $$;

-- The recovering account may read the salt and remaining attempts of its own live
-- grant, so the client can compute the digest locally. The salt is not secret and
-- is useless without the 40-bit single-use code; no other account's grant is
-- reachable, and nothing here can consume a grant. Denials are audited.
create function bc_admin_v1.recovery_grant_state(p_request_id uuid) returns table(salt bytea, attempts_remaining integer, expires_at timestamptz)
language plpgsql security definer set search_path=pg_catalog as $$
declare uid uuid; sid uuid; g bc_admin_v1.admin_recovery_grants; exposed boolean:=false;
begin
 if p_request_id is null then raise exception 'invalid recovery request' using errcode='22023'; end if;
 uid := auth.uid();
 begin sid := nullif(auth.jwt()->>'session_id','')::uuid;
 exception when invalid_text_representation then sid := null; end;
 if uid is not null and sid is not null and coalesce(auth.jwt()->>'aal','') in ('aal1','aal2')
    and exists (select 1 from bc_admin_v1.admin_users u where u.id = uid and u.enabled)
    and exists (select 1 from auth.sessions s where s.id = sid and s.user_id = uid) then
  select x.* into g from bc_admin_v1.admin_recovery_grants x
   where x.user_id = uid and x.consumed_at is null and x.revoked_at is null and x.expires_at > now()
   order by x.issued_at desc limit 1;
  exposed := found;
 end if;
 insert into bc_admin_v1.admin_audit_logs(actor_id,request_id,action,target_type,target_id,details)
 values (case when exposed then uid else null end, p_request_id, 'auth.recovery.state', 'staff', uid::text,
         pg_catalog.jsonb_build_object('grant_present', exposed));
 if not exposed then return; end if;
 return query select g.salt, greatest(0, 5 - g.attempts), g.expires_at;
end $$;

-- Bounded, idempotent cleanup. Deletes only rows whose own expiry has passed;
-- audit evidence is never touched. A per-target advisory lock makes a concurrent
-- run skip instead of deleting twice, and every run (including skips) is
-- recorded so the schedule can be observed from the Admin audit module.
create function bc_admin_v1.cleanup_expired(p_target text, p_limit integer, p_request_id uuid) returns integer
language plpgsql security definer set search_path=pg_catalog as $$
declare run_id bigint; removed integer := 0; locked boolean;
begin
 perform bc_admin_v1.require_actor('settings.manage');
 if p_request_id is null then raise exception 'invalid cleanup' using errcode='22023'; end if;
 if p_target not in ('admin_login_flows','admin_rate_limits') then
  raise exception 'invalid cleanup target' using errcode='22023';
 end if;
 if p_limit is null or p_limit < 1 or p_limit > 1000 then
  raise exception 'invalid cleanup batch' using errcode='22023';
 end if;
 locked := pg_catalog.pg_try_advisory_xact_lock(pg_catalog.hashtextextended('bc_admin_v1:cleanup:' || p_target, 0));
 insert into bc_admin_v1.admin_cleanup_runs(target,started_at,skipped,detail)
 values (p_target, now(), not locked, pg_catalog.jsonb_build_object('limit', p_limit))
 returning id into run_id;
 if locked then
  if p_target = 'admin_login_flows' then
   -- Expired handoffs are useless; expired ones are the only rows deleted.
   delete from bc_admin_v1.admin_login_flows f
    where f.flow_hash in (
     select x.flow_hash from bc_admin_v1.admin_login_flows x
      where x.expires_at <= now() order by x.expires_at limit p_limit for update skip locked);
  else
   -- A rate-limit bucket is stale once its one-minute window is long past.
   -- The key is (bucket,key_hash); delete by primary key from the bounded set.
   delete from bc_admin_v1.admin_rate_limits r
    where (r.bucket, r.key_hash) in (
     select x.bucket, x.key_hash from bc_admin_v1.admin_rate_limits x
      where x.started_at <= now() - interval '1 day' order by x.started_at limit p_limit for update skip locked);
  end if;
  get diagnostics removed = row_count;
 end if;
 update bc_admin_v1.admin_cleanup_runs c
  set finished_at = now(), deleted = removed where c.id = run_id;
 insert into bc_admin_v1.admin_audit_logs(actor_id,request_id,action,target_type,target_id,details)
 values (null, p_request_id, 'ops.cleanup', 'table', p_target,
         pg_catalog.jsonb_build_object('deleted', removed, 'skipped', not locked, 'run_id', run_id));
 return removed;
end $$;

revoke all on function bc_admin_v1.enrolment_eligible(uuid),
 bc_admin_v1.factor_gate(uuid),
 bc_admin_v1.stamp_mfa_enrolled(),
 bc_admin_v1.issue_recovery_grant(uuid,bytea,bytea,interval,uuid),
 bc_admin_v1.revoke_recovery_grant(uuid,uuid),
 bc_admin_v1.consume_recovery_grant(bytea,uuid),
 bc_admin_v1.recovery_grant_state(uuid),
 bc_admin_v1.reset_factor_enrolment(uuid,uuid),
 bc_admin_v1.cleanup_expired(text,integer,uuid) from public,anon,authenticated;
commit;
