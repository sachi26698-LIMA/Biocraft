-- REVIEW ONLY. Do not run. Separate explicit approval required.
-- Example for psql interactive use by an authorized project owner only.
-- Before running, verify the existing user's UUID through a trusted project
-- owner channel, ensure account control and AAL2 enrollment, and configure
-- the local psql variable verified_user_id without exposing credentials.
-- This creates no Auth user, password, token, or invitation.
\if :{?verified_user_id}
\else
\echo 'Set verified_user_id in your trusted psql session; aborting.'
\quit
\endif
begin;
select set_config('biocraft.bootstrap_user', :'verified_user_id', true);
lock table biocraft_control.members in access exclusive mode;
do $$
declare uid uuid := current_setting('biocraft.bootstrap_user')::uuid;
begin
 if exists(select 1 from biocraft_control.members) then
   raise exception 'Bootstrap requires an empty membership table';
 end if;
 if not exists(select 1 from auth.users where id=uid) then
   raise exception 'Verified user does not exist';
 end if;
 insert into biocraft_control.members(user_id,role) values(uid,'super_admin');
 insert into biocraft_control.audit_events(actor_id,action,target_id,details)
 values(uid,'bootstrap',uid,jsonb_build_object('method','owner-controlled'));
end $$;
commit;
