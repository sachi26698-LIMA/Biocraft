// Pool configuration guard: only this project's direct host or pooler, only a
// project-scoped login, no connection is opened by these assertions.
import assert from 'node:assert/strict';
import {createPostgresPool} from '../admin-backend/server/database.mjs';
const ref='jvpadtzfsuekixrquzjv';
const okDirect=createPostgresPool({host:`db.${ref}.supabase.co`,user:'admin_executor',password:'x'});
assert.equal(okDirect.options.host,`db.${ref}.supabase.co`);
assert.equal(okDirect.options.ssl.rejectUnauthorized,true);
const okPooler=createPostgresPool({host:'aws-0-ap-southeast-2.pooler.supabase.com',user:`admin_executor.${ref}`,password:'x'});
assert.equal(okPooler.options.port,5432);
for(const bad of [
 {host:`db.${ref}.supabase.co`,user:`admin_executor.${ref}`,password:'x'},
 {host:'aws-0-ap-southeast-2.pooler.supabase.com',user:'admin_executor',password:'x'},
 {host:'aws-0-ap-southeast-2.pooler.supabase.com',user:`admin_executor.otherref`,password:'x'},
 {host:'db.otherref.supabase.co',user:'admin_executor',password:'x'},
 {host:'evil.example',user:'admin_executor',password:'x'},
 {host:`db.${ref}.supabase.co`,user:'admin_executor',password:''},
 {host:`db.${ref}.supabase.co`,user:'Admin',password:'x'},
 {host:`db.${ref}.supabase.co`,user:'admin_executor',password:'x',port:0},
]) assert.throws(()=>createPostgresPool(bad),/Invalid database configuration/,JSON.stringify(bad));
for(const good of ['aws-1-us-east-1.pooler.supabase.com','aws-0-ap-southeast-2.pooler.supabase.com','aws-10-eu-central-1.pooler.supabase.com'])
 assert.equal(createPostgresPool({host:good,user:`admin_executor.${ref}`,password:'x',port:5432}).options.port,5432);
await okDirect.end();await okPooler.end();
console.log('PASS pool configuration guard: project direct/pooler hosts only, project-scoped login, TLS verification required; no connection opened');
