// Browser -> TLS Vite proxy -> real local listener -> actual limited PostgreSQL
// login. Only upstream GoTrue/PostgREST HTTP is intercepted (in Node, *not* in
// Chromium). No existing Supabase account, password, factor or session is used.
import assert from 'node:assert/strict';
import {readFileSync,realpathSync,mkdtempSync,rmSync} from 'node:fs';
import {createServer} from 'node:net';
import {once} from 'node:events';
import {randomBytes,randomUUID,createHash,X509Certificate} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {preview} from 'vite';
import {chromium} from 'playwright-core';
import pg from 'pg';
import {localConfig,localServer} from '../admin-backend/server/local-http.mjs';
import {createAdminApp} from '../admin-backend/server/app.mjs';
import {localApiProxy} from '../shared/local-proxy.mjs';
import {SUPABASE_URL} from '../shared/supabase-config.mjs';
const socket=realpathSync(process.env.BIOCRAFT_TEST_PG_SOCKET);assert(socket.startsWith('/tmp/biocraft-pg-'));
const dir=mkdtempSync('/tmp/biocraft-browser-tls-');
const pool=new pg.Pool({host:socket,user:'bc_fixture_executor',database:'postgres'});
const owner=new pg.Client({host:socket,user:process.env.USER,database:'postgres'});
const originalFetch=globalThis.fetch;
const uid=randomUUID(), sid=randomUUID(), factor=randomUUID(),email='editor@example.test',publicKey='sb_publishable_fixture_only';
const epoch=Math.floor(Date.now()/1000),exp=epoch+600;
const user={id:uid,email,email_confirmed_at:new Date().toISOString(),is_anonymous:false,factors:[{id:factor,factor_type:'totp',status:'verified'}]};
const token=aal=>['eyJhbGciOiJub25lIn0',Buffer.from(JSON.stringify({iss:SUPABASE_URL+'/auth/v1',sub:uid,session_id:sid,role:'authenticated',aud:'authenticated',is_anonymous:false,aal,exp,amr:aal==='aal2'?[{method:'totp',timestamp:epoch}]:[]})).toString('base64url'),'c3ludGhldGlj'].join('.');
const session=aal=>({access_token:token(aal),refresh_token:'unused-test-refresh',expires_in:600,token_type:'bearer',user});
let runtime,web,browser,challenged=false,verified=false,loggedOut=false;
try {
 await owner.connect();
 const {rows:[{data}]}=await owner.query("select current_setting('data_directory') data");
 assert.equal(readFileSync(data+'/BIOCRAFT_TEST_ONLY','utf8'),'Local disposable Biocraft test cluster only\n');
 await owner.query('insert into auth.users(id) values($1)',[uid]);await owner.query('insert into auth.sessions(id,user_id) values($1,$2)',[sid,uid]);
 await owner.query('insert into bc_admin_v1.admin_users(id,enabled) values($1,true)',[uid]);await owner.query("insert into bc_admin_v1.admin_user_roles(user_id,role_id) values($1,'editor')",[uid]);
 // The port must be known before building the exact origin; strictPort below
 // makes a race a test failure, never a silent change of trusted origin.
 const portProbe=createServer();portProbe.listen(0,'127.0.0.1');await once(portProbe,'listening');const port=portProbe.address().port;await new Promise(r=>portProbe.close(r));
 const origin=`https://127.0.0.1:${port}`;
 const env=localConfig({ADMIN_ORIGIN:origin,ADMIN_SUPABASE_PUBLISHABLE_KEY:publicKey,ADMIN_DB_USER:'bc_fixture_executor',ADMIN_DB_PASSWORD:'fixture-only',ADMIN_ALLOWED_EMAILS:email,
   ADMIN_CATALOG_DRAFTS_ENABLED:'true',ADMIN_SHARED_WRITES_ENABLED:'true',...Object.fromEntries(['COOKIE_KEY','FLOW_KEY','HASH_KEY','INGRESS_SECRET'].map(k=>[`ADMIN_${k}_HEX`,randomBytes(32).toString('hex')]))});
 globalThis.fetch=async(resource,init={})=>{
   const u=new URL(resource.url??resource),h=new Headers(init.headers),body=init.body?JSON.parse(init.body):{};
   assert.equal(u.origin,SUPABASE_URL); // no fallback to network allowed
   if(u.pathname==='/auth/v1/health')return Response.json({});
   if(u.pathname==='/auth/v1/token'&&u.searchParams.get('grant_type')==='password' && body.email===email && body.password==='fixture password')return Response.json(session('aal1'));
   if(u.pathname==='/auth/v1/user' && [token('aal1'),token('aal2')].includes(h.get('authorization')?.slice(7)))return Response.json(user);
   if(u.pathname===`/auth/v1/factors/${factor}/challenge`){challenged=true;return Response.json({id:factor,type:'totp',expires_at:exp});}
   if(u.pathname===`/auth/v1/factors/${factor}/verify` && challenged && body.code==='123456'){verified=true;return Response.json(session('aal2'));}
   if(u.pathname==='/auth/v1/logout' && verified){loggedOut=true;return new Response(null,{status:204});}
   if(u.pathname==='/rest/v1/design_templates'){
     assert.equal(h.get('apikey'),publicKey);assert.equal(h.get('authorization'),`Bearer ${publicKey}`);
     assert.equal(u.searchParams.get('is_active'),'eq.true');assert.match(u.searchParams.get('order'),/^id\.asc/);assert.equal(u.searchParams.get('limit'),'25');
     return Response.json([{id:factor,title:'Published template fixture',text:'template-fixture',license_code:'MIT'}]);
   }
   throw Error('Unexpected synthetic provider request: '+u.pathname);
 };
 const app=createAdminApp({env,localDevelopment:true,poolFactory:()=>pool});assert.equal(app.configuration.enabled,true);
 runtime=localServer(env,app);runtime.server.listen(0,'127.0.0.1');await once(runtime.server,'listening');
 execFileSync('openssl',['req','-x509','-newkey','rsa:2048','-nodes','-keyout',dir+'/key','-out',dir+'/cert','-days','1','-subj','/CN=127.0.0.1','-addext','subjectAltName=IP:127.0.0.1'],{stdio:'ignore'});
 const cert=readFileSync(dir+'/cert'),spki=createHash('sha256').update(new X509Certificate(cert).publicKey.export({type:'spki',format:'der'})).digest('base64');
 web=await preview({logLevel:'error',preview:{host:'127.0.0.1',port,strictPort:true,cors:false,https:{key:readFileSync(dir+'/key'),cert},proxy:localApiProxy(runtime.server.address().port)}});
 browser=await chromium.launch({executablePath:process.env.BROWSER_EXECUTABLE_PATH,args:['--no-sandbox','--disable-dev-shm-usage','--ignore-certificate-errors-spki-list='+spki]});
 const page=await browser.newPage({viewport:{width:820,height:900}});page.setDefaultTimeout(12000);
 const origins=[],errors=[];page.on('request',r=>{if(r.url().includes('/api/'))origins.push(new URL(r.url()).origin);});page.on('pageerror',e=>errors.push(e.message));
 await page.goto(origin+'/admin/login');await page.getByLabel('Email',{exact:true}).fill(email);await page.getByLabel('Password',{exact:true}).fill('fixture password');
 await page.getByRole('button',{name:'Continue'}).click();await page.getByRole('heading',{name:'Enter your authenticator code'}).waitFor();
 assert.equal(await page.evaluate(async()=>(await fetch('/api/admin/v1/session')).status),401);
 await page.getByLabel('6–8 digit code').fill('123456');await page.getByRole('button',{name:'Verify',exact:true}).click();await page.getByRole('heading',{name:'Signed in'}).waitFor();
 assert(challenged&&verified);
 const cookie=(await page.context().cookies()).find(c=>c.name==='__Host-biocraft-admin');assert(cookie?.secure&&cookie.httpOnly&&cookie.sameSite==='Strict');
 const statuses=await page.evaluate(async()=>{
   const results={};for(const path of ['session','bios','categories','collections','platforms','generators','seo-pages','staff','analytics','settings','audit-logs'])results[path]=(await fetch('/api/admin/v1/'+path)).status;
   return results;
 });
 assert.deepEqual(statuses,{session:200,bios:200,categories:200,collections:200,platforms:200,generators:200,'seo-pages':200,staff:403,analytics:403,settings:403,'audit-logs':403});
 await page.goto(origin+'/admin/templates');await page.getByText('Published template fixture',{exact:true}).waitFor();
 for(const width of [390,820,1440]) {
   await page.setViewportSize({width,height:900});
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 }
 await page.getByRole('button',{name:'New private draft'}).click();
 await page.getByLabel('Resource key').fill('browser-example');await page.getByLabel('Draft title').fill('First private title');await page.getByLabel('Source or attribution').fill('Original test metadata');await page.getByLabel('Declared licence').fill('CC0-1.0');
 await page.getByRole('button',{name:'Create private draft'}).click();await page.getByText('First private title',{exact:true}).waitFor();
 await page.getByRole('button',{name:'Edit draft'}).click();await page.getByLabel('Draft title').fill('Revised private title');await page.getByRole('button',{name:'Save changes'}).click();await page.getByText('Revised private title',{exact:true}).waitFor();
 await page.getByRole('button',{name:'Archive draft'}).click();await page.getByRole('button',{name:'Confirm archive'}).click();await page.getByText('No active private drafts in this module.').waitFor();
 assert.deepEqual((await owner.query('select title,row_version,archived_at is not null archived from bc_admin_v1.catalog_drafts where author_id=$1',[uid])).rows,[{title:'Revised private title',row_version:3,archived:true}]);
 assert.equal((await owner.query("select count(*)::int n from bc_admin_v1.admin_audit_logs where actor_id=$1 and action like 'catalog_draft.%'",[uid])).rows[0].n,3);
 const denied=await page.evaluate(async()=>(await fetch('/api/admin/v1/catalog-drafts',{method:'POST',headers:{'content-type':'application/json'},body:'{}'})).status);assert.equal(denied,403);
 const logout=await page.evaluate(async()=>{const {csrf}=await(await fetch('/api/admin/v1/csrf')).json();return (await fetch('/api/admin/v1/session',{method:'DELETE',headers:{'x-csrf-token':csrf}})).status;});assert.equal(logout,200);assert(loggedOut);
 assert.equal(await page.evaluate(async()=>(await fetch('/api/admin/v1/session')).status),401);assert(origins.length>10&&origins.every(o=>o===origin));assert.deepEqual(errors,[]);
 console.log('PASS browser → HTTPS Vite proxy → real Node listener → limited PostgreSQL: pre-MFA 401, mocked provider TOTP, secure session, module 200/403, UI private draft CRUD + audit, CSRF denial and logout 401; no browser request interception');
} finally {
 globalThis.fetch=originalFetch;await browser?.close();if(web)await new Promise(r=>web.httpServer.close(r));
 if(runtime)await runtime.shutdown();else await pool.end();await owner.end();rmSync(dir,{recursive:true,force:true});
}
