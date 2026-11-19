// Only run inside the private native PostgreSQL suite. No shared SQL/role changes.
import assert from 'node:assert/strict';
import {readFileSync,realpathSync} from 'node:fs';
import {randomUUID} from 'node:crypto';
import pg from 'pg';
import {createDatabaseExecutor} from '../admin-backend/server/database.mjs';
import domains from '../shared/admin-draft-domains.json' with {type:'json'};
const socket=realpathSync(process.env.BIOCRAFT_TEST_PG_SOCKET);assert(socket.startsWith('/tmp/biocraft-pg-'));
const root=new pg.Client({host:socket,user:process.env.USER,database:'postgres'});
const pool=new pg.Pool({host:socket,user:'bc_fixture_executor',database:'postgres'});
await root.connect();
const sql=file=>readFileSync('admin-backend/proposals/016-catalog-drafts/'+file+'.sql','utf8');
try {
 const {rows:[{dir}]}=await root.query("select current_setting('data_directory') dir");
 assert.equal(readFileSync(dir+'/BIOCRAFT_TEST_ONLY','utf8'),'Local disposable Biocraft test cluster only\n');
 await root.query(sql('apply'));await root.query(sql('rollback'));await root.query(sql('apply'));
 for(const role of ['anon','authenticated','service_role','bc_fixture_executor']) {
  const {rows:[p]}=await root.query(`select has_function_privilege($1,'bc_admin_v1.list_catalog_drafts(text,integer,uuid)','EXECUTE') l,has_table_privilege($1,'bc_admin_v1.catalog_drafts','SELECT,INSERT,UPDATE,DELETE') t,
    has_function_privilege($1,'bc_admin_v1.change_catalog_draft(text,text,uuid,bigint,jsonb,uuid)','EXECUTE') f`,[role]);
  assert.deepEqual(p,{t:false,f:false,l:false});
 }
 await root.query(sql('grant').replace('to bc_admin_executor','to bc_fixture_executor'));
 const execute=createDatabaseExecutor(pool);
 async function actor(role){
  const id=randomUUID(),sid=randomUUID();
  await root.query('insert into auth.users(id) values($1)',[id]);await root.query('insert into auth.sessions(id,user_id) values($1,$2)',[sid,id]);
  await root.query('insert into bc_admin_v1.admin_users(id,enabled) values($1,true)',[id]);await root.query('insert into bc_admin_v1.admin_user_roles(user_id,role_id) values($1,$2)',[id,role]);
  const identity={userId:id,sessionId:sid,assuranceLevel:'aal2',mfaVerifiedAt:Math.floor(Date.now()/1000)};
  await execute({identity,operation:'sessionOpen',args:[randomUUID()]});return identity;
 }
 const a=await actor('editor'),b=await actor('content_manager'),seo=await actor('seo_manager'),read=await actor('analyst');
 const fields={key:'example',title:'Draft',notes:'Structured text only',source:'Original',license:'CC0-1.0'};
 const change=(identity,domain,action,id=null,version=null,values=fields)=>execute({identity,operation:'catalogDraftChange',args:[domain,action,id,version,values===null?null:JSON.stringify(values),randomUUID()]});
 const list=(identity,domain,after=null)=>execute({identity,operation:'catalogDraftList',args:[domain,25,after]});
 const code=wanted=>e=>e.code===wanted;
 for(const [domain,perm] of Object.entries(domains)) {
  const writer=perm==='seo.draft'?seo:a;
  const [{draft_id:id,row_version:v}]=await change(writer,domain,'create');assert.equal(v,1);
  assert.equal((await list(writer,domain))[0].id,id);assert.deepEqual(await list(writer,domain,id),[]);
  await assert.rejects(change(writer,domain,'create'),code('23505'));
  const [edited]=await change(writer,domain,'edit',id,v,{...fields,title:'Revised draft'});assert.equal(edited.row_version,2);
  assert.equal((await list(writer,domain))[0].title,'Revised draft');
  await assert.rejects(change(writer,domain,'edit',id,v),code('40001'));
  assert.equal((await change(writer,domain,'archive',id,2,null))[0].row_version,3);
  assert.deepEqual(await list(writer,domain),[]);
 }
 const [{draft_id:id}]=await change(a,'templates','create');
 assert.deepEqual(await list(b,'templates'),[]);
 await assert.rejects(change(b,'templates','edit',id,1),code('P0002'));
 await assert.rejects(change(b,'templates','archive',id,1,null),code('P0002'));
 await assert.rejects(change(a,'designs','edit',id,1),code('P0002'));
 await assert.rejects(change(a,'seo','create'),code('42501'));await assert.rejects(change(seo,'fonts','create'),code('42501'));
 await assert.rejects(list(read,'templates'),code('42501'));
 await assert.rejects(change({...a,mfaVerifiedAt:null},'templates','edit',id,1),code('28000'));
 const [first,second]=await Promise.allSettled([change(a,'templates','edit',id,1),change(a,'templates','edit',id,1)]);
 assert.equal([first,second].filter(x=>x.status==='fulfilled').length,1);assert.equal([first,second].find(x=>x.status==='rejected').reason.code,'40001');
 assert.equal((await root.query("select count(*)::int n from bc_admin_v1.admin_audit_logs where action like 'catalog_draft.%'")).rows[0].n,3*Object.keys(domains).length+2);
 await assert.rejects(root.query(sql('rollback')),/draft history exists/);await root.query('rollback');
 assert.equal((await root.query('select count(*)::int n from bc_admin_v1.catalog_drafts where archived_at is not null')).rows[0].n,Object.keys(domains).length);
 console.log(`PASS native private draft CRUD in ${Object.keys(domains).length} domains; limited-role grants, own rows, SEO separation, concurrent versions, fresh MFA, audit and data-preserving rollback`);
} finally {await root.end();await pool.end();}
