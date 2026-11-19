// Real local HTTP socket test of the Admin app wrapper. Disposable PostgreSQL
// cluster only (already migrated by the integration script), stubbed provider
// network is never contacted because these routes fail before Auth.
import assert from 'node:assert/strict';import fs from 'node:fs';import http from 'node:http';import {randomBytes,randomUUID,createHmac} from 'node:crypto';import pg from 'pg';
import {createAdminApp} from '../admin-backend/server/app.mjs';
import {sendResponse} from '../admin-backend/server/node-adapter.mjs';
import {issueSessionCookie} from '../admin-backend/server/session-cookie.mjs';
import {createDatabaseExecutor} from '../admin-backend/server/database.mjs';
import {SUPABASE_URL} from '../shared/supabase-config.mjs';
const socket=process.env.BIOCRAFT_TEST_PG_SOCKET;
if(!socket||!fs.realpathSync(socket).startsWith('/tmp/biocraft-pg-'))throw Error('Disposable local socket required');
const origin='https://preview.example',secret=randomBytes(32),pool=new pg.Pool({host:socket,user:'bc_fixture_executor',database:'postgres',max:2});
const cookieKey=randomBytes(32), uid='11111111-1111-4111-8111-111111111111', sid=randomUUID();
const expiresAt=Date.now()+240_000;
const token='eyJhbGciOiJub25lIn0.'+Buffer.from(JSON.stringify({
 iss:SUPABASE_URL+'/auth/v1',aud:'authenticated',role:'authenticated',aal:'aal2',is_anonymous:false,sub:uid,session_id:sid,exp:Math.ceil(expiresAt/1000)
})).toString('base64url')+'.synthetic';
const originalFetch=globalThis.fetch;
let confirmed=false, providerLogout=false, authHealthy=false, clock=Date.now(), healthCalls=0;
globalThis.fetch=async (url,opts)=>{
 if(!String(url).startsWith(SUPABASE_URL+'/')) return originalFetch(url,opts);
 if(String(url)===SUPABASE_URL+'/auth/v1/health') {healthCalls++;return Response.json({}, {status:authHealthy?200:503});}
 assert.equal(new Headers(opts.headers).get('authorization'),`Bearer ${token}`);
 if(String(url)===SUPABASE_URL+'/auth/v1/user') return Response.json({id:uid,email:'fixture.admin@example.test',email_confirmed_at:confirmed?new Date().toISOString():null,is_anonymous:false});
 if(String(url)===SUPABASE_URL+'/auth/v1/logout?scope=local') {providerLogout=true;return new Response(null,{status:204});}
 throw Error('Unexpected provider call');
};
const app=createAdminApp({env:{VERCEL_ENV:'preview',ADMIN_PASSWORD_RESET_ENABLED:'true',ADMIN_BACKEND_ENABLED:'true',ADMIN_ORIGIN:origin,ADMIN_SUPABASE_PUBLISHABLE_KEY:'sb_publishable_local_fixture',
 ADMIN_DB_USER:'bc_fixture_executor',ADMIN_DB_PASSWORD:'fixture',ADMIN_COOKIE_KEY_HEX:cookieKey.toString('hex'),
 ADMIN_FLOW_KEY_HEX:randomBytes(32).toString('hex'),ADMIN_HASH_KEY_HEX:randomBytes(32).toString('hex'),
 ADMIN_TRUSTED_CLIENT_HEADER:'x-forwarded-for',ADMIN_INGRESS_SECRET_HEX:secret.toString('hex'),
 ADMIN_ALLOWED_EMAILS:'fixture.admin@example.test'},poolFactory:()=>pool,now:()=>clock});
assert.equal(app.configuration.enabled,true);
// Minimal proxy stand-in: it alone knows the ingress secret.
const server=http.createServer(async (req,res)=>{
 const client=req.socket.remoteAddress??'unknown',headers=new Headers();
 for(const [k,v] of Object.entries(req.headers)) if(typeof v==='string') headers.set(k,v);
 headers.set('x-forwarded-for',client);headers.set('x-admin-ingress-signature',createHmac('sha256',secret).update(client).digest('hex'));
 headers.set('host',new URL(origin).host);
 let body;if(!['GET','HEAD'].includes(req.method)){const parts=[];for await(const c of req)parts.push(c);body=Buffer.concat(parts)}
 const response=await app(new Request(origin+(req.url??'/'),{method:req.method,headers,body}));
 await sendResponse(res,response);
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base=`http://127.0.0.1:${server.address().port}`;
try {
 const unavailable=await fetch(base+'/api/admin/v1/health'); // DB reachable, Auth not healthy
 assert.equal(unavailable.status,503);assert.equal(unavailable.headers.get('x-admin-stage'),'auth provider unavailable');
 assert.deepEqual(await unavailable.json(),{error:{code:'UNAVAILABLE',stage:'auth provider unavailable'}});
 authHealthy=true;clock+=10_001;
 const health=await fetch(base+'/api/admin/v1/health');assert.equal(health.status,200);assert.deepEqual(await health.json(),{ok:true});
 assert.equal(health.headers.get('cache-control'),'no-store');
 assert.equal((await fetch(base+'/api/admin/v1/health?diagnose=1')).status,200);assert.equal(healthCalls,2);
 const unauth=await fetch(base+'/api/admin/v1/bio-drafts');assert.equal(unauth.status,401);
 const badCookie=await fetch(base+'/api/admin/v1/bio-drafts',{headers:{cookie:'__Host-biocraft-admin=not-a-cookie'}});assert.equal(badCookie.status,401);
 assert.equal((await fetch(base+'/nope')).status,404);
 const post=await fetch(base+'/api/admin/v1/auth/login',{method:'POST',headers:{origin,'content-type':'application/json'},body:'{}'});
 assert.equal(post.status,400); // shape validation before any provider call
 const wrongOrigin=await fetch(base+'/api/admin/v1/auth/login',{method:'POST',headers:{origin:'https://attacker.example','content-type':'application/json'},body:'{}'});
 assert.equal(wrongOrigin.status,403);
 const root=new pg.Client({host:socket,user:process.env.USER,database:'postgres'});
 await root.connect();
 try {
  const {rows}=await root.query("select current_setting('data_directory') path");
  assert.equal(fs.readFileSync(rows[0].path+'/BIOCRAFT_TEST_ONLY','utf8'),'Local disposable Biocraft test cluster only\n');
  await root.query('insert into auth.sessions(id,user_id) values($1,$2)',[sid,uid]);
 } finally {await root.end();}
 await createDatabaseExecutor(pool)({identity:{userId:uid,sessionId:sid,assuranceLevel:'aal2'},operation:'sessionOpen',args:[randomUUID()]});
 const session=issueSessionCookie({accessToken:token,expiresAt,key:cookieKey});
 const cookie=session.setCookie.split(';')[0];
 const getSession=()=>fetch(base+'/api/admin/v1/session',{headers:{cookie}});
 assert.equal((await getSession()).status,403);
 confirmed=true;
 const response=await getSession();assert.equal(response.status,200);
 const userSession=await response.json();assert.equal(userSession.user.id,uid);assert.equal(userSession.shared_writes,false);assert.equal(userSession.catalog_drafts,false);
 const noWrites=await fetch(base+'/api/admin/v1/bio-drafts',{method:'POST',headers:{cookie,origin,'x-csrf-token':session.csrf,'content-type':'application/json'},body:'{}'});
 assert.equal(noWrites.status,403);assert.equal((await noWrites.json()).error.code,'PREVIEW_READ_ONLY');
 assert.equal((await fetch(base+'/api/admin/v1/auth/password-reset/status')).status,503);
 const loggedOut=await fetch(base+'/api/admin/v1/session',{method:'DELETE',headers:{cookie,origin,'x-csrf-token':session.csrf}});
 assert.equal(loggedOut.status,200);assert.equal(providerLogout,true);
 assert.equal((await getSession()).status,403);
 console.log('PASS local HTTP admin app over a real (non-hosted) socket: health, trusted-proxy signing, unauthenticated denial, origin and body validation, confirmed-email check, DB limiter token-bound provider logout, Preview read-only guard and disabled recovery');
} finally {globalThis.fetch=originalFetch;server.close();await pool.end()}
