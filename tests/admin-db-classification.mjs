// The deployed Admin API answered a bare 503 for every failure, so an operator
// could not tell a closed configuration gate from a rejected database login.
// This pins the two behaviours that fix that: every gate names itself through
// the serverless handler, and every database refusal is classified from its
// SQLSTATE alone (never a credential, host or SQL statement).
import assert from 'node:assert/strict';
import {createAdminApp,databaseStage} from '../admin-backend/server/app.mjs';
import {createHandler} from '../admin-backend/server/handler.mjs';

const secret=Buffer.alloc(32,1);
const res=()=>({headers:{},setHeader(k,v){this.headers[k]=v},end(b){this.body=b}});

// 1. Every configuration gate reports its own fixed stage, and the body keeps
//    its leading {error:{code}} shape for existing clients.
const gates=[
  [{},'disabled'],
  [{ADMIN_BACKEND_ENABLED:'true'},'invalid origin'],
  [{ADMIN_BACKEND_ENABLED:'true',ADMIN_ORIGIN:'https://x.example'},'invalid keys'],
];
for (const [env,stage] of gates) {
  const app=createAdminApp({env});
  assert.equal(app.configuration.enabled,false,`${stage}: expected a closed gate`);
  assert.equal(app.configuration.reason,stage,`${stage}: wrong reason`);
}
{
  const env={
    ADMIN_BACKEND_ENABLED:'true',ADMIN_ORIGIN:'https://x.example',
    ADMIN_COOKIE_KEY_HEX:'a'.repeat(64),ADMIN_FLOW_KEY_HEX:'b'.repeat(64),ADMIN_HASH_KEY_HEX:'c'.repeat(64),
    ADMIN_SUPABASE_PUBLISHABLE_KEY:'sb_publishable_test',
  };
  const app=createAdminApp({env});
  assert.equal(app.configuration.reason,'missing database credentials');
}
{
  // A privileged or malformed login is still refused at start-up by the pool
  // factory: the executor role must be project-scoped on the pooler.
  const env={
    ADMIN_BACKEND_ENABLED:'true',ADMIN_ORIGIN:'https://x.example',
    ADMIN_COOKIE_KEY_HEX:'a'.repeat(64),ADMIN_FLOW_KEY_HEX:'b'.repeat(64),ADMIN_HASH_KEY_HEX:'c'.repeat(64),
    ADMIN_SUPABASE_PUBLISHABLE_KEY:'sb_publishable_test',
    ADMIN_DB_USER:'postgres',ADMIN_DB_PASSWORD:'x',
    ADMIN_DB_HOST:'aws-0-ap-southeast-2.pooler.supabase.com',
    // The allow-list gate runs before the pool factory, so it must be satisfied
    // for the role check to be the gate that closes.
    ADMIN_ALLOWED_EMAILS:'sachi26698@gmail.com',
    ADMIN_TRUSTED_CLIENT_HEADER:'x-forwarded-for',ADMIN_INGRESS_SECRET_HEX:'d'.repeat(64),
  };
  const app=createAdminApp({env});
  assert.equal(app.configuration.reason,'invalid database configuration');
}

// 2. The handler propagates the stage instead of discarding it.
{
  const app=createAdminApp({env:{}});
  const r=res();
  await createHandler(app,{secret})({method:'GET',url:'/api/admin/v1/health',headers:{}},r);
  assert.equal(r.statusCode,503);
  assert.equal(r.headers['x-admin-stage'],'disabled');
  assert.deepEqual(JSON.parse(r.body),{error:{code:'UNAVAILABLE',stage:'disabled'}});
}

// 3. Classification is derived from SQLSTATE, with a caller default when the
//    driver supplies no code (e.g. a socket failure before authentication).
const cases=[
  [{code:'28P01'},'database authentication rejected'],
  [{code:'28000'},'database authentication rejected'],
  [{code:'42501'},'database permission denied'],
  [{code:'3D000'},'database absent'],
  [{code:'57014'},'database timeout'],
  [{code:'08006'},'database unreachable'],
  [{code:'53300'},'database unreachable'],
  [{},'fallback'],
  [{code:'XX000'},'fallback'],
];
for (const [error,expected] of cases) {
  assert.equal(databaseStage(error,'fallback').stage, expected===undefined?'fallback':expected,
    `SQLSTATE ${error.code ?? 'none'}`);
}
// A stage is always from a fixed vocabulary: it never carries a value from the
// environment, so it cannot leak a host, user or password.
assert.match(databaseStage({code:'28P01'}).stage,/^[a-z][a-z0-9 ]{0,40}$/);

console.log('PASS admin database classification: each configuration gate names itself, the serverless handler propagates the stage instead of a bare 503, and database refusals classify by SQLSTATE only');
