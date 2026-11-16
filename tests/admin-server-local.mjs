// Local-only HTTP harness for the Admin app. Used by automated tests and for
// manual local inspection. It refuses to run against the shared project or any
// non-disposable database. Never deploy this file.
//
//   BIOCRAFT_TEST_PG_SOCKET=/tmp/biocraft-pg-xxx/socket node tests/admin-server-local.mjs
import http from 'node:http';
import {createHmac,randomBytes} from 'node:crypto';
import pg from 'pg';
import {createAdminApp,verifyAdminDatabase} from '../admin-backend/server/app.mjs';
const socket=process.env.BIOCRAFT_TEST_PG_SOCKET;
if(!socket) throw Error('Set BIOCRAFT_TEST_PG_SOCKET to a disposable local socket');
const secret=process.env.BIOCRAFT_TEST_INGRESS_SECRET??randomBytes(32).toString('hex');
const origin=process.env.BIOCRAFT_TEST_ORIGIN??'https://preview.example';
const port=Number(process.env.PORT??4190);
const pool=new pg.Pool({host:socket,user:process.env.BIOCRAFT_TEST_DB_USER??process.env.USER,database:'postgres',max:4});
await verifyAdminDatabase(pool).catch(e=>{console.error('Refusing to start:',e.message);process.exit(1)});
const app=createAdminApp({env:{
 ADMIN_BACKEND_ENABLED:'true',ADMIN_ORIGIN:origin,
 ADMIN_SUPABASE_PUBLISHABLE_KEY:process.env.ADMIN_SUPABASE_PUBLISHABLE_KEY??'sb_publishable_local_fixture',
 ADMIN_DB_USER:process.env.BIOCRAFT_TEST_DB_USER??process.env.USER,ADMIN_DB_PASSWORD:'local-fixture',
 ADMIN_COOKIE_KEY_HEX:randomBytes(32).toString('hex'),ADMIN_FLOW_KEY_HEX:randomBytes(32).toString('hex'),
 ADMIN_HASH_KEY_HEX:randomBytes(32).toString('hex'),ADMIN_TRUSTED_CLIENT_HEADER:'x-forwarded-for',
 ADMIN_INGRESS_SECRET_HEX:secret,
},poolFactory:()=>pool});
if(!app.configuration.enabled){console.error('App disabled:',app.configuration.reason);process.exit(1)}
const server=http.createServer(async (req,res)=>{
 // The harness itself acts as the trusted proxy: it signs the observed peer
 // address so the app can derive a trusted rate-limit key.
 const client=req.socket.remoteAddress??'unknown';
 const headers=new Headers();
 for(const [k,v] of Object.entries(req.headers)) if(typeof v==='string') headers.set(k,v);
 headers.set('x-forwarded-for',client);
 headers.set('x-admin-ingress-signature',createHmac('sha256',Buffer.from(secret,'hex')).update(client).digest('hex'));
 headers.set('host',new URL(origin).host);
 let body;if(!['GET','HEAD'].includes(req.method)){const chunks=[];let size=0;for await(const c of req){size+=c.length;if(size>65536){res.writeHead(413).end();return}chunks.push(c)}body=Buffer.concat(chunks)}
 const response=await app(new Request(origin+(req.url??'/'),{method:req.method,headers,body}));
 const out=[];for(const [k,v] of response.headers) if(k.toLowerCase()!=='set-cookie') out.push([k,v]);
 res.writeHead(response.status,Object.fromEntries(out));
 for(const c of response.headers.getSetCookie()) res.appendHeader('set-cookie',c);
 res.end(Buffer.from(await response.arrayBuffer()));
});
server.listen(port,'127.0.0.1',()=>console.log(`Admin local harness listening on http://127.0.0.1:${port} origin=${origin}`));
