// Real local HTTP socket test of the Admin app wrapper. Disposable PostgreSQL
// cluster only (already migrated by the integration script), stubbed provider
// network is never contacted because these routes fail before Auth.
import assert from 'node:assert/strict';import fs from 'node:fs';import http from 'node:http';import {randomBytes,createHmac} from 'node:crypto';import pg from 'pg';
import {createAdminApp} from '../admin-backend/server/app.mjs';
const socket=process.env.BIOCRAFT_TEST_PG_SOCKET;
if(!socket||!fs.realpathSync(socket).startsWith('/tmp/biocraft-pg-'))throw Error('Disposable local socket required');
const origin='https://preview.example',secret=randomBytes(32),pool=new pg.Pool({host:socket,user:'bc_fixture_executor',database:'postgres',max:2});
const app=createAdminApp({env:{ADMIN_BACKEND_ENABLED:'true',ADMIN_ORIGIN:origin,ADMIN_SUPABASE_PUBLISHABLE_KEY:'sb_publishable_local_fixture',
 ADMIN_DB_USER:'bc_fixture_executor',ADMIN_DB_PASSWORD:'fixture',ADMIN_COOKIE_KEY_HEX:randomBytes(32).toString('hex'),
 ADMIN_FLOW_KEY_HEX:randomBytes(32).toString('hex'),ADMIN_HASH_KEY_HEX:randomBytes(32).toString('hex'),
 ADMIN_TRUSTED_CLIENT_HEADER:'x-forwarded-for',ADMIN_INGRESS_SECRET_HEX:secret.toString('hex')},poolFactory:()=>pool});
assert.equal(app.configuration.enabled,true);
// Minimal proxy stand-in: it alone knows the ingress secret.
const server=http.createServer(async (req,res)=>{
 const client=req.socket.remoteAddress??'unknown',headers=new Headers();
 for(const [k,v] of Object.entries(req.headers)) if(typeof v==='string') headers.set(k,v);
 headers.set('x-forwarded-for',client);headers.set('x-admin-ingress-signature',createHmac('sha256',secret).update(client).digest('hex'));
 headers.set('host',new URL(origin).host);
 let body;if(!['GET','HEAD'].includes(req.method)){const parts=[];for await(const c of req)parts.push(c);body=Buffer.concat(parts)}
 const response=await app(new Request(origin+(req.url??'/'),{method:req.method,headers,body}));
 const out={};for(const [k,v] of response.headers) if(k.toLowerCase()!=='set-cookie') out[k]=v;
 res.writeHead(response.status,out);for(const c of response.headers.getSetCookie()) res.appendHeader('set-cookie',c);
 res.end(Buffer.from(await response.arrayBuffer()));
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base=`http://127.0.0.1:${server.address().port}`;
try {
 const health=await fetch(base+'/api/admin/v1/health');assert.equal(health.status,200);assert.deepEqual(await health.json(),{ok:true});
 assert.equal(health.headers.get('cache-control'),'no-store');
 const unauth=await fetch(base+'/api/admin/v1/bio-drafts');assert.equal(unauth.status,401);
 const badCookie=await fetch(base+'/api/admin/v1/bio-drafts',{headers:{cookie:'__Host-biocraft-admin=not-a-cookie'}});assert.equal(badCookie.status,401);
 assert.equal((await fetch(base+'/nope')).status,404);
 const post=await fetch(base+'/api/admin/v1/auth/login',{method:'POST',headers:{origin,'content-type':'application/json'},body:'{}'});
 assert.equal(post.status,400); // shape validation before any provider call
 const wrongOrigin=await fetch(base+'/api/admin/v1/auth/login',{method:'POST',headers:{origin:'https://attacker.example','content-type':'application/json'},body:'{}'});
 assert.equal(wrongOrigin.status,403);
 console.log('PASS local HTTP admin app over a real (non-hosted) socket: health, trusted-proxy signing, unauthenticated denial, origin and body validation');
} finally {server.close();await pool.end()}
