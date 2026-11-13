import assert from 'node:assert/strict';import {randomBytes} from 'node:crypto';
import {issueSessionCookie,clearSessionCookie,createCookieGateway} from '../admin-backend/server/session-cookie.mjs';
// Synthetic unsigned-format JWTs; the cookie wrapper only reads `exp`.
const jwt=seconds=>['eyJhbGciOiJub25lIn0',Buffer.from(JSON.stringify({exp:seconds})).toString('base64url'),'c2ln'].join('.');
const live=jwt(Math.floor(Date.now()/1000)+3600);
const key=randomBytes(32),origin='https://preview.example',issued=issueSessionCookie({key,accessToken:live,expiresAt:Date.now()+60000});
assert.match(issued.setCookie,/HttpOnly; Secure; SameSite=Strict/);assert(!issued.setCookie.includes('synthetic-token'));assert.match(clearSessionCookie(),/Max-Age=0/);
let received;const gateway=createCookieGateway({key,origin,delegate:async r=>{received=r;return new Response('ok')}});
const cookie=issued.setCookie.split(';')[0];const get=()=>new Request(`${origin}/api/admin/v1/csrf`,{headers:{cookie}});
let r=await gateway(get());assert.equal(r.status,200);assert.equal((await r.json()).csrf,issued.csrf);
const post=(headers={})=>new Request(`${origin}/api/admin/v1/bio-drafts`,{method:'POST',headers:{cookie,...headers},body:'{}'});
assert.equal((await gateway(post())).status,403);
assert.equal((await gateway(post({origin,'x-csrf-token':'x'.repeat(43)}))).status,403);
assert.equal((await gateway(post({origin:'https://evil.example','x-csrf-token':issued.csrf}))).status,403);
assert.equal((await gateway(post({origin,'x-csrf-token':issued.csrf}))).status,200);
assert.equal(received.headers.get('authorization'),`Bearer ${live}`);assert.equal(received.headers.has('cookie'),false);
assert.equal((await gateway(new Request(`${origin}/api/admin/v1/csrf`,{headers:{cookie:cookie+'; '+cookie}}))).status,401);
let invalid=cookie.slice(0,-1)+(cookie.endsWith('a')?'b':'a');assert.equal((await gateway(new Request(`${origin}/api/admin/v1/csrf`,{headers:{cookie:invalid}}))).status,401);
const expired=issueSessionCookie({key,accessToken:jwt(2),expiresAt:1001,now:1000}).setCookie.split(';')[0];assert.equal((await gateway(new Request(`${origin}/api/admin/v1/csrf`,{headers:{cookie:expired}}))).status,401);
// A cookie whose provider token expires before the cookie is refused, and a
// cookie may never exceed the one-hour hard cap.
const short=jwt(Math.floor(Date.now()/1000)+120);
const shortCookie=issueSessionCookie({key,accessToken:short,expiresAt:Date.now()+60000}).setCookie.split(';')[0];
assert.equal((await gateway(new Request(`${origin}/api/admin/v1/csrf`,{headers:{cookie:shortCookie}}))).status,200);
assert.throws(()=>issueSessionCookie({key,accessToken:short,expiresAt:Date.now()+300*1000}),/Invalid session/);
assert.throws(()=>issueSessionCookie({key,accessToken:jwt(Math.floor(Date.now()/1000)+7200),expiresAt:Date.now()+2*60*60*1000}));
assert.throws(()=>issueSessionCookie({key,accessToken:'not-a-jwt',expiresAt:Date.now()+60000}));
const deniedGateway=createCookieGateway({key,origin,delegate:async()=>new Response('',{status:403})});
assert.equal((await deniedGateway(get())).status,403); // CSRF endpoint must recheck live session
let calls=0;const failedLogout=createCookieGateway({key,origin,delegate:async()=>new Response('{}',{status:200}),providerLogout:async()=>{calls++;throw Error('offline')}});
const loggedOut=await failedLogout(new Request(`${origin}/api/admin/v1/session`,{method:'DELETE',headers:{cookie,origin,'x-csrf-token':issued.csrf}}));
assert.equal(loggedOut.status,503);assert.equal(calls,1);assert.match(loggedOut.headers.get('set-cookie'),/Max-Age=0/);
assert.throws(()=>createCookieGateway({key,origin:'http://preview.example',delegate:()=>{}}));
console.log('PASS encrypted-cookie wrapper: expiry, provider-token bound, tamper, strict origin, CSRF, credential stripping; no live session store or hosted test');
