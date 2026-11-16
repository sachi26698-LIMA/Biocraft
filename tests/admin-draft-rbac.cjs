// Local PostgreSQL-compatible exercise of the unapplied read-only draft. This
// does not replace testing against a real Supabase/PostgREST deployment.
const { PGlite } = require('@electric-sql/pglite');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

async function main() {
  const db = new PGlite();
  try {
    await db.exec(`
      create role anon; create role authenticated;
      create schema auth; create table auth.users(id uuid primary key);
      create function auth.uid() returns uuid language sql stable as $$
        select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
      create table public.bios(id int,is_active boolean);
      create table public.categories(id int); create table public.platforms(id int);
      create table public.generators(id int);
      insert into public.bios values(1,true),(2,false);
      insert into public.categories values(1); insert into public.platforms values(1),(2);
      insert into public.generators values(1);
      alter table public.bios enable row level security;
      grant select on public.bios to anon,authenticated;
      create policy guest_active on public.bios for select to anon,authenticated using(is_active);
      insert into auth.users values
       ('00000000-0000-0000-0000-000000000001'),
       ('00000000-0000-0000-0000-000000000002');
    `);
    await db.exec(fs.readFileSync(path.join(__dirname, '../docs/admin-drafts/001-readonly-rbac.sql'), 'utf8'));
    await db.exec(`insert into biocraft_admin_private.members(user_id,role)
      values('00000000-0000-0000-0000-000000000001','super_admin')`);
    const denied = async (query) => assert.rejects(db.query(query), (error) => error.code === '42501');
    await db.exec('set role anon');
    assert.equal((await db.query('select * from public.bios')).rows.length, 1);
    await denied('select public.bc_admin_context()');
    await denied('select public.bc_admin_dashboard()');
    await denied('select * from biocraft_admin_private.members');
    await denied('insert into public.bios values(3,true)');
    await db.exec('reset role; set role authenticated');
    await denied('select public.bc_admin_context()');
    await db.exec("set request.jwt.claim.sub='00000000-0000-0000-0000-000000000002'");
    await denied('select public.bc_admin_dashboard()');
    await denied('select * from biocraft_admin_private.members');
    await db.exec("set request.jwt.claim.sub='00000000-0000-0000-0000-000000000001'");
    for (const role of ['super_admin', 'admin', 'editor', 'analyst']) {
      await db.exec(`reset role; update biocraft_admin_private.members set role='${role}'; set role authenticated`);
      const result = await db.query('select public.bc_admin_context() ctx, public.bc_admin_dashboard() dashboard');
      assert.deepEqual(result.rows[0].ctx, { role });
      assert.deepEqual(result.rows[0].dashboard, { active_bios: 1, inactive_bios: 1, categories: 1, platforms: 2, generators: 1 });
      // Membership alone must not bypass existing public write restrictions.
      await denied('insert into public.bios values(3,true)');
      await denied('update public.bios set is_active=false where id=1');
      await denied('select * from biocraft_admin_private.members');
    }
    await db.exec('reset role; update biocraft_admin_private.members set enabled=false; set role authenticated');
    await denied('select public.bc_admin_dashboard()');
    await denied('select public.bc_admin_context()');
    console.log('PASS: local draft read-only RBAC and guest RLS checks');
  } finally { await db.close(); }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
