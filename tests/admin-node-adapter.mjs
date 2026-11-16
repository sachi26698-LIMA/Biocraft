// Adapter tests: Node-like request objects -> Web Request, client-supplied
// signature stripped, rate-limit identity derived only from the platform header.
import assert from 'node:assert/strict';import {randomBytes,createHmac} from 'node:crypto';
import {toWebRequest,deriveClientAddress,sendResponse,signedProxyHeaders} from '../admin-backend/server/node-adapter.mjs';
const origin='https://preview.example',secret=randomBytes(32);
const base={method:'POST',url:'/api/admin/v1/auth/login',headers:{'x-real-ip':'203.0.113.9','x-forwarded-for':'203.0.113.9','x-admin-ingress-signature':'f'.repeat(64),origin,'content-type':'application/json',cookie:'a=b'},body:{email:'x@y.z'}};
const request=toWebRequest(base,{origin,secret});
assert.equal(request.url,origin+'/api/admin/v1/auth/login');
assert.equal(request.headers.get('x-admin-ingress-signature'),createHmac('sha256',secret).update('203.0.113.9').digest('hex'));
assert.equal(request.headers.get('x-admin-ingress-signature')==='f'.repeat(64),false);
assert.equal(request.headers.has('x-real-ip'),false);
assert.equal(await request.text(),JSON.stringify({email:'x@y.z'}));
// A client that sends only a forged forwarded-for header still gets signed by us
// from the platform value; we never use the client's own signature.
const noIp=toWebRequest({...base,headers:{...base.headers,'x-real-ip':undefined,'x-forwarded-for':'198.51.100.4, 10.0.0.1'}},{origin,secret});
assert.equal(noIp.headers.get('x-forwarded-for'),'198.51.100.4');
assert.equal(await noIp.text(),'{"email":"x@y.z"}');
const none=toWebRequest({...base,headers:{}},{origin,secret});
assert.equal(none.headers.get('x-forwarded-for'),null);
assert.equal(none.headers.has('x-admin-ingress-signature'),false);
assert.equal(deriveClientAddress({'x-forwarded-for':['1.1.1.1, 2.2.2.2']}),'1.1.1.1');
assert.equal(deriveClientAddress({}),null);
const signed=signedProxyHeaders({address:'1.2.3.4',origin,secret});
assert.equal(signed.host,'preview.example');
assert.equal(signed['x-admin-ingress-signature'],createHmac('sha256',secret).update('1.2.3.4').digest('hex'));
// Response conversion preserves status, headers and multiple Set-Cookie values.
const res={headers:{},setHeader(k,v){this.headers[k.toLowerCase()]=v},end(b){this.body=b}};
await sendResponse(res,new Response(JSON.stringify({ok:true}),{status:201,headers:{'set-cookie':'a=1; Path=/','content-type':'application/json','x-test':'y'}}));
assert.equal(res.statusCode,201);assert.equal(res.headers['x-test'],'y');assert.deepEqual(res.headers['set-cookie'],['a=1; Path=/']);assert.equal(res.body.toString(),'{"ok":true}');
console.log('PASS Node adapter: platform-derived client identity, forged signature stripped, body/response mapping');
{
 const {createHandler}=await import('../admin-backend/server/handler.mjs');
 const disabled=await import('../admin-backend/server/handler.mjs');
 const res=()=>({headers:{},setHeader(k,v){this.headers[k]=v},end(b){this.body=b}});
 // Default export with no env configured returns 503 before parsing anything.
 const r1=res();await disabled.default({method:'POST',url:'/api/admin/v1/auth/login',headers:{'x-real-ip':'1.2.3.4'},body:{}},r1);
 assert.equal(r1.statusCode,503);assert.equal(r1.body.toString(),'{"error":{"code":"UNAVAILABLE"}}');
 const fake=async function(){};fake.configuration={enabled:true,origin};
 const handler=createHandler(fake,{secret});
 const r2=res();await handler({method:'GET',url:'/api/admin/v1/health',headers:{'x-real-ip':'1.2.3.4'}},r2);
 assert.equal(r2.statusCode,503); // non-function instance body is rejected
 let seen;const ok=async function(request){seen=request;return new Response(JSON.stringify({ok:true}),{status:200,headers:{'content-type':'application/json'}})};ok.configuration={enabled:true,origin};
 const r3=res();await createHandler(ok,{secret:Buffer.alloc(32,1)})({method:'GET',url:'/api/admin/v1/health',headers:{'x-real-ip':'1.2.3.4'}},r3);
 assert.equal(r3.statusCode,200);assert.equal(r3.body.toString(),'{"ok":true}');assert.equal(seen.headers.get('x-forwarded-for'),'1.2.3.4');
 assert(seen.headers.get('x-admin-ingress-signature'));
 const r4=res();await createHandler(ok,{secret:'short'})({method:'GET',url:'/api/admin/v1/health',headers:{}},r4);
 assert.equal(r4.statusCode,503);
 console.log('PASS serverless handler: disabled-by-default 503, injected app with signed identity, invalid secret rejected');
}
