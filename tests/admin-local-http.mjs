import assert from 'node:assert/strict';
import http from 'node:http';
import {once} from 'node:events';
import {randomBytes} from 'node:crypto';
import {localConfig,localServer} from '../admin-backend/server/local-http.mjs';
import {clientKey} from '../admin-backend/server/app.mjs';

const origin='https://console.example.test',host=new URL(origin).host;
const env=localConfig({ADMIN_ORIGIN:origin,ADMIN_INGRESS_SECRET_HEX:randomBytes(32).toString('hex')});
assert.throws(()=>localConfig({VERCEL:'1'}));
assert.equal(localConfig({ADMIN_BACKEND_ENABLED:'false'}).ADMIN_BACKEND_ENABLED,'false');
assert.equal(localConfig({E2B_SANDBOX_ID:'test-id'}).ADMIN_ORIGIN,'https://5173-test-id.e2b.app');
assert.equal(localConfig({}).ADMIN_ORIGIN,undefined);
const secret=Buffer.from(env.ADMIN_INGRESS_SECRET_HEX,'hex');
let calls=0,closed=false;
const app=async request=>{
  calls++;
  assert.equal(new URL(request.url).origin,origin);
  assert.equal(request.headers.get('x-forwarded-for'),'127.0.0.1');
  assert(clientKey(request,{trustedHeader:'x-forwarded-for',ingressSecret:secret}));
  return Response.json({size:(await request.arrayBuffer()).byteLength},{headers:{'set-cookie':'__Host-fixture=value; Secure; HttpOnly; Path=/'}});
};
app.configuration={enabled:true,origin}; app.shutdown=async()=>{closed=true;};
const {server,shutdown}=localServer(env,app);
server.listen(0,'127.0.0.1');await once(server,'listening');
const send=(path,{headers={},method='GET',body}={})=>new Promise((resolve,reject)=>{
  const req=http.request({host:'127.0.0.1',port:server.address().port,path,method,headers:{host,...headers}},res=>{
    const chunks=[];res.on('data',c=>chunks.push(c));res.on('end',()=>resolve({status:res.statusCode,headers:res.headers,body:JSON.parse(Buffer.concat(chunks))}));
  });
  req.on('error',reject); if(body) req.write(body);req.end();
});
try {
  assert.equal((await send('/api/status/live')).body.live,true);
  const bundled=await send('/api/status/content');
  assert.equal(bundled.status,200);assert.deepEqual(bundled.body,{ok:true,source:'bundled',database_required:false});
  assert.equal((await send('/else')).status,404);
  assert.equal((await send('/api/admin/v1/session',{headers:{host:'wrong.example'}})).status,403);
  assert.equal((await send('/api/admin/v1/auth/login',{method:'POST'})).status,403);
  const cross=await send('/api/admin/v1/session',{headers:{origin:'https://other.example'}});
  assert.equal(cross.status,403);assert.equal(cross.headers['access-control-allow-origin'],undefined);
  for(const length of [true,false]) {
    const res=await send('/api/admin/v1/auth/login',{method:'POST',headers:{origin,...(length?{'content-length':'32769'}:{})},body:Buffer.alloc(32769)});
    assert.equal(res.status,413);
  }
  assert.equal(calls,0);
  const res=await send('/api/admin/v1/auth/login',{method:'POST',body:'{}',headers:{origin,'content-type':'application/json','x-forwarded-for':'192.0.2.1','x-real-ip':'192.0.2.1'}});
  assert.equal(res.status,200);assert.equal(res.body.size,2);assert.match(res.headers['set-cookie'][0],/Secure; HttpOnly/);
  assert.equal(calls,1);
} finally {await shutdown();}
assert(closed);
console.log('PASS local listener: liveness, origin/host rejection, bounded raw/chunked body, observed-peer signature, cookies, shutdown and hosted-config refusal');
