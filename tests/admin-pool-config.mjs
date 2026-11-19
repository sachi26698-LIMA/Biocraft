// Pool configuration guard: only this project's direct host or pooler, only a
// project-scoped login, no connection is opened by these assertions.
import assert from 'node:assert/strict';
import {X509Certificate} from 'node:crypto';
import {createPostgresPool} from '../admin-backend/server/database.mjs';
const ref='jvpadtzfsuekixrquzjv';
const okDirect=createPostgresPool({host:`db.${ref}.supabase.co`,user:'admin_executor',password:'x'});
assert.equal(okDirect.options.host,`db.${ref}.supabase.co`);
assert.equal(okDirect.options.ssl.rejectUnauthorized,true);
assert.equal(okDirect.options.ssl.ca,undefined,'direct host uses system trust');
const okPooler=createPostgresPool({host:'aws-0-ap-southeast-2.pooler.supabase.com',user:`admin_executor.${ref}`,password:'x'});
assert.equal(okPooler.options.ssl.rejectUnauthorized,true);
const roots=okPooler.options.ssl.ca.match(/-----BEGIN CERTIFICATE-----[^]*?-----END CERTIFICATE-----/g);
assert.deepEqual(roots.map(pem=>new X509Certificate(pem).fingerprint256),[
 '80:70:25:AD:50:D4:ED:21:9D:2C:9C:7D:29:9C:00:4F:82:4E:B0:0C:F7:F6:5A:FE:F6:07:D0:7B:72:E6:CA:FA',
 '5F:9B:77:95:1A:7A:A1:30:3F:9B:58:EE:A9:BF:A8:9E:35:8C:FD:C1:5F:97:86:FF:10:D4:93:0A:72:2C:9A:E2',
]);
assert.equal(okPooler.options.port,5432);
for(const bad of [
 {host:'aws-0-ap-southeast-2.pooler.supabase.com',user:`postgres.${ref}`,password:'x'},
 {host:`db.${ref}.supabase.co`,user:'service_role',password:'x'},
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

// Multiple Supavisor connection failures share XX000. Report fixed categories,
// never the raw driver message or a value hiding inside an arbitrary error code.
const {inspectAdminDatabase,databaseReady} = await import('../admin-backend/server/db-readiness.mjs');
for (const [code,message,issue] of [
 ['XX000','Tenant or user not found','tenant_or_user_lookup'],
 ['XX000','(ENOTFOUND) tenant/user private.user not found','tenant_or_user_lookup'],
 ['XX000','(EAUTHQUERY) failed to retrieve authentication secrets: private','pooler_role_lookup'],
 ['28P01','password authentication failed for user private','login_rejected'],
 ['not-for-the-response','private','unknown'],
]) {
 const report=await inspectAdminDatabase({connect:async()=>{throw Object.assign(Error(message),{code})}});
 assert.deepEqual(report,{database:'unreachable',sqlstate:code==='not-for-the-response'?'unknown':code,connection_issue:issue});
 assert.equal(databaseReady(report),false);
}
for (const [safe,ready] of [[false,true],[true,false],[true,true]]) {
 const calls=[];
 const report=await inspectAdminDatabase({connect:async()=>({query:async sql=>{calls.push(sql);return {rows:[{safe,ready}]};},release:()=>calls.push('released')})});
 assert.deepEqual(calls.slice(-2),['rollback','released']);
 assert.equal(calls[0],'begin read only');
 assert.equal(databaseReady(report),safe&&ready);
 assert.equal(report.limited_role,safe?'ok':'failed');
}
console.log('PASS single-connection readiness, fail-closed role/commands, redacted connection categories');
// The private control-plane cross-check reports ONLY the primary hostname.
const {primaryPoolerHost} = await import('../scripts/admin-pooler-host.mjs');
const host='aws-0-ap-southeast-2.pooler.supabase.com';
const meta = url => [{database_type:'REPLICA',connection_string:'ignored'},{database_type:'PRIMARY',connection_string:url}];
const req = data => async (url, opts) => {
 assert.equal(url,`https://api.supabase.com/v1/projects/${ref}/config/database/pooler`);
 assert.equal(opts.redirect,'error'); return Response.json(data);
};
assert.equal(await primaryPoolerHost('local-fixture',req(meta(`postgres://postgres.${ref}:fixture@${host}:6543/postgres`))),host);
await assert.rejects(primaryPoolerHost('local-fixture',req(meta(`postgres://postgres.other:fixture@${host}/postgres`))),/No recognized primary/);
await assert.rejects(primaryPoolerHost('local-fixture',req(meta('not-a-url'))),/No recognized primary/);
