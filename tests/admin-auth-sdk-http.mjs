// Real Supabase JS SDK with intercepted HTTP; this does not contact Supabase.
import assert from 'node:assert/strict';import {randomBytes} from 'node:crypto';
import {createProviderClient,verifyProviderIdentity} from '../admin-backend/server/identity.mjs';
import {createAuthController} from '../admin-backend/server/auth-controller.mjs';
import {createRecoveryController} from '../admin-backend/server/recovery-controller.mjs';
const url='https://jvpadtzfsuekixrquzjv.supabase.co',origin='https://preview.example',uid='11111111-1111-4111-8111-111111111111',sid='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',factor='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const expiry=Math.floor(Date.now()/1000)+300,token=aal=>['eyJhbGciOiJub25lIn0',Buffer.from(JSON.stringify({iss:url+'/auth/v1',aud:'authenticated',role:'authenticated',aal,is_anonymous:false,sub:uid,session_id:sid,exp:expiry})).toString('base64url'),Buffer.from('signature').toString('base64url')].join('.');
const user={id:uid,aud:'authenticated',role:'authenticated',is_anonymous:false,factors:[{id:factor,factor_type:'totp',status:'verified'}]},paths=[];
const orig=globalThis.fetch;
try {
 globalThis.fetch=async(resource,init={})=>{const u=new URL(String(resource)),method=init.method??'GET',body=init.body?JSON.parse(init.body):{};paths.push(`${method} ${u.pathname}${u.search}`);
  assert.equal(u.origin,url);let data;
  if(u.pathname==='/auth/v1/token'&&u.searchParams.get('grant_type')==='password')data={access_token:token('aal1'),refresh_token:'refresh-fixture',expires_in:300,token_type:'bearer',user};
  else if(u.pathname==='/auth/v1/user'&&method==='GET')data=user;
  else if(u.pathname==='/auth/v1/user'&&method==='PUT'){assert.equal(body.password,'synthetic new password');data=user;}
  else if(u.pathname==='/auth/v1/recover'){assert.equal(body.email,'synthetic@example.com');data={};}
  else if(u.pathname==='/auth/v1/verify'){assert.equal(body.type,'recovery');data={access_token:token('aal1'),refresh_token:'recovery-refresh',expires_in:300,token_type:'bearer',user};}
  else if(u.pathname==='/auth/v1/logout')data={};
  else if(u.pathname===`/auth/v1/factors/${factor}/challenge`)data={id:'cccccccc-cccc-4ccc-8ccc-cccccccccccc',type:'totp',expires_at:expiry};
  else if(u.pathname===`/auth/v1/factors/${factor}/verify`){assert.equal(body.code,'123456');data={access_token:token('aal2'),refresh_token:'new-refresh-fixture',expires_in:300,token_type:'bearer',user};}
  else throw Error(`Unexpected SDK HTTP call ${method} ${u.pathname}`);
  return new Response(JSON.stringify(data),{status:200,headers:{'Content-Type':'application/json'}});
 };
 const flows=new Map(),store={put:async(k,v)=>flows.set(k,v),take:async k=>{const v=flows.get(k);flows.delete(k);return v}};
 const mk=()=>createProviderClient(url,'sb_publishable_fixture');
 const handler=createAuthController({enabled:true,origin,key:randomBytes(32),createClient:mk,flowStore:store,limiter:async()=>true,
  sessionHandler:async request=>{const bearer=request.headers.get('authorization').slice(7);await verifyProviderIdentity({token:bearer,provider:mk()});return new Response('{}',{status:200});}});
 const post=(p,data,cookie)=>new Request(origin+p,{method:'POST',headers:{origin,'content-type':'application/json',...(cookie?{cookie}:{})},body:JSON.stringify(data)});
 const login=await handler(post('/api/admin/v1/auth/login',{email:'synthetic@example.com',password:'synthetic password'}),'synthetic-ip');assert.equal(login.status,200);
 const csrf=(await login.json()).csrf,cookie=login.headers.get('set-cookie').split(';')[0];
 const mfa=await handler(post('/api/admin/v1/auth/mfa',{csrf,code:'123456'},cookie),'synthetic-ip');assert.equal(mfa.status,200,JSON.stringify({status:mfa.status,paths,body:await mfa.clone().json()}));
 assert(mfa.headers.getSetCookie().some(c=>c.startsWith('__Host-biocraft-admin=')));assert(paths.some(p=>p.includes('/verify')));
 const ops=[];const recovery=createRecoveryController({enabled:true,origin,createClient:mk,flowStore:store,limiter:async()=>true,execute:async ({operation})=>{ops.push(operation);return []}});
 assert.equal((await recovery(post('/api/admin/v1/auth/recovery/request',{email:'synthetic@example.com'}),'synthetic-ip')).status,202);
 const exchange=await recovery(post('/api/admin/v1/auth/recovery/exchange',{tokenHash:'a'.repeat(64)}),'synthetic-ip');assert.equal(exchange.status,200);
 const recoveryCsrf=(await exchange.json()).csrf,recoveryCookie=exchange.headers.get('set-cookie').split(';')[0];
 const completed=await recovery(post('/api/admin/v1/auth/recovery/complete',{code:'123456',csrf:recoveryCsrf,password:'synthetic new password'},recoveryCookie),'synthetic-ip');
 assert.equal(completed.status,200,JSON.stringify({status:completed.status,paths,body:await completed.clone().json()}));
 assert.deepEqual(ops,['sessionOpen','sessionRevokeAll']);assert(paths.includes('PUT /auth/v1/user'));assert(paths.some(p=>p.startsWith('POST /auth/v1/logout')));
 console.log('PASS real Supabase SDK login/MFA/recovery HTTP shape with intercepted synthetic responses; no live Supabase Auth');
}finally{globalThis.fetch=orig}
