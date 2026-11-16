// Tests a restricted prototype in local PGlite only; not a Supabase security audit.
const {PGlite} = require('@electric-sql/pglite');
const fs = require('node:fs'); const path = require('node:path'); const assert = require('node:assert/strict');
(async () => {
 const db=new PGlite();
 try {
  await db.exec(`create role anon; create role authenticated; create schema auth;
   create table auth.users(id uuid primary key);
   create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
   create function auth.jwt() returns jsonb language sql stable as $$select jsonb_build_object('aal',current_setting('request.jwt.claim.aal',true))$$;
   create table public.bios(id uuid primary key,content text not null,language text not null,is_active boolean not null,is_featured boolean not null,platform_id uuid);
   alter table public.bios enable row level security;
   grant select on public.bios to anon,authenticated;
   create policy guest_read on public.bios for select to anon,authenticated using(is_active);
   insert into auth.users values ('10000000-0000-0000-0000-000000000001'),('10000000-0000-0000-0000-000000000002'),('10000000-0000-0000-0000-000000000003'),('10000000-0000-0000-0000-000000000004');
   insert into public.bios values('20000000-0000-0000-0000-000000000001','Original','en',true,false,null);`);
  await db.exec(fs.readFileSync(path.join(__dirname,'../docs/admin-package/010-bio-workflow-DRAFT.sql'),'utf8'));
  await db.exec(`insert into biocraft_control.members(user_id,role) values
   ('10000000-0000-0000-0000-000000000001','editor'),('10000000-0000-0000-0000-000000000002','admin'),
   ('10000000-0000-0000-0000-000000000003','analyst');`);
  const who=async (id,aal='aal2')=>db.exec(`reset role; set role authenticated; set request.jwt.claim.sub='10000000-0000-0000-0000-00000000000${id}'; set request.jwt.claim.aal='${aal}'`);
  const denied=async(q,args=[],code='42501')=>assert.rejects(db.query(q,args),e=>e.code===code);
  const target='20000000-0000-0000-0000-000000000001';
  await db.exec('set role anon'); await denied('select public.bc_control_create_draft($1)',[target]);
  assert.equal((await db.query('select content from public.bios')).rows[0].content,'Original');
  await who(4); await denied('select public.bc_control_create_draft($1)',[target]);
  await who(3); await denied('select public.bc_control_create_draft($1)',[target]);
  await who(1,'aal1'); await denied('select public.bc_control_create_draft($1)',[target]);
  await who(1); await denied('select * from biocraft_control.bio_revisions');
  const id=(await db.query('select public.bc_control_create_draft($1) as id',[target])).rows[0].id;
  let v={content:'Changed',language:'en',is_active:true,is_featured:false,platform_id:null};
  await denied('select public.bc_control_update_draft($1,$2)',[id,{...v,unknown:1}],'22023');
  await denied('select public.bc_control_update_draft($1,$2)',[id,{...v,platform_id:'30000000-0000-0000-0000-000000000001'}],'22023');
  await db.query('select public.bc_control_update_draft($1,$2)',[id,v]);
  await db.query('select public.bc_control_submit($1)',[id]);
  await denied('select public.bc_control_review($1,true)',[id]);
  await who(2); await db.query('select public.bc_control_review($1,true)',[id]);
  await denied('select public.bc_control_publish($1)',[id],'55000');
  await db.exec("reset role; update biocraft_control.settings set publish_enabled=true; update public.bios set content='Concurrent' where id='20000000-0000-0000-0000-000000000001'; set role authenticated");
  await denied('select public.bc_control_publish($1)',[id],'40001');
  await db.exec("reset role; update public.bios set content='Original' where id='20000000-0000-0000-0000-000000000001'; set role authenticated");
  await db.query('select public.bc_control_publish($1)',[id]);
  assert.equal((await db.query('select content from public.bios')).rows[0].content,'Changed');
  await db.exec('reset role');
  assert.equal((await db.query('select count(*)::int n from biocraft_control.audit_events')).rows[0].n,5);
  await assert.rejects(db.query('delete from biocraft_control.audit_events'));
  await assert.rejects(db.query('truncate biocraft_control.audit_events'));
  await db.exec("update biocraft_control.members set enabled=false where role='editor'; set role authenticated; set request.jwt.claim.sub='10000000-0000-0000-0000-000000000001'");
  await denied('select public.bc_control_create_draft($1)',[target]);
  console.log('PASS local bio workflow: roles, MFA, denial, review, disabled publish, conflicts, audit, revocation');
 } finally {await db.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
