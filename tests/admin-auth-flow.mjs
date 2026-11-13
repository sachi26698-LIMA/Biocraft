import assert from 'node:assert/strict';
import {beginPasswordLogin,verifyTotp,providerLogout} from '../admin-backend/server/auth-flow.mjs';
const f='11111111-1111-4111-8111-111111111111';let calls=[];
const limiter=async ({bucket})=>{calls.push(bucket);return true};
const client={auth:{signInWithPassword:async ()=>({data:{session:{access_token:'fixture-access',refresh_token:'fixture-refresh'}}}),
 mfa:{listFactors:async()=>({data:{totp:[{id:f,status:'verified'},{id:'broken',status:'verified'}]}}),challengeAndVerify:async({factorId,code})=>({data:factorId===f&&code==='123456'?{access_token:'aal2-access',refresh_token:'aal2-refresh'}:null,error:code==='123456'?null:{}})},
 signOut:async({scope})=>{calls.push(`logout:${scope}`);return {error:null}}}};
const login=await beginPasswordLogin({client,email:'test@example.com',password:'synthetic',limiter,rateKey:'fixture'});
assert.deepEqual(login.factorIds,[f]);assert.equal(login.session.access_token,'fixture-access');
const result=await verifyTotp({client,factorId:f,code:'123456',limiter,rateKey:'fixture'});assert.equal(result.access_token,'aal2-access');
await assert.rejects(verifyTotp({client,factorId:f,code:'123456',rateKey:'fixture'}),e=>e.code==='UNAVAILABLE');
await assert.rejects(verifyTotp({client,factorId:f,code:'bad',limiter,rateKey:'fixture'}),e=>e.code==='UNAUTHENTICATED');
await assert.rejects(beginPasswordLogin({client,email:'test@example.com',password:'synthetic',limiter:async()=>false,rateKey:'fixture'}),e=>e.code==='RATE_LIMITED');
const none={auth:{...client.auth,mfa:{...client.auth.mfa,listFactors:async()=>({data:{totp:[]}})}}};
await assert.rejects(beginPasswordLogin({client:none,email:'test@example.com',password:'synthetic',limiter,rateKey:'fixture'}),e=>e.code==='MFA_REQUIRED');
await providerLogout(client);assert(calls.includes('logout:local'));assert(calls.includes('logout:global'));
console.log('PASS mocked provider password/TOTP/logout building blocks; no real sessions, limiter, token store, HTTP endpoint or live Auth tested');
