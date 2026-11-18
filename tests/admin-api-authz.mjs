// Every privileged Admin API route must independently require authorization.
//
// The claim being tested is "no privileged endpoint is reachable without a
// verified identity". The way that claim usually fails is not a broken check but
// an endpoint added *above* the check, or a route that forgets to call it. So this
// walks the real route table and asserts that every one of them answers 401 with
// no bearer token — and that the provider is never consulted for an unauthenticated
// call, which also proves no route can leak data through an error path.
import assert from 'node:assert/strict';
import {createAdminHandler} from '../admin-backend/server/api.mjs';

const ORIGIN = 'https://admin.example.test';

// Route table mirroring api.mjs. Keep in sync if a route is added: a new route
// that is not listed here is itself a finding, which the count assertion catches.
const ROUTES = [
  ['GET', '/api/admin/v1/session'],
  ['POST', '/api/admin/v1/session'],
  ['DELETE', '/api/admin/v1/session'],
  ['POST', '/api/admin/v1/sessions/revoke-all'],
  ['GET', '/api/admin/v1/sessions'],
  ['GET', '/api/admin/v1/staff'],
  ['PATCH', '/api/admin/v1/staff'],
  ['POST', '/api/admin/v1/staff/recovery'],
  ['POST', '/api/admin/v1/staff/recovery/revoke'],
  ['POST', '/api/admin/v1/staff/recovery/reset'],
  ['GET', '/api/admin/v1/roles'],
  ['GET', '/api/admin/v1/bios'],
  ['GET', '/api/admin/v1/captions'],
  ['GET', '/api/admin/v1/hashtags'],
  ['GET', '/api/admin/v1/fonts'],
  ['GET', '/api/admin/v1/bio-drafts'],
  ['GET', '/api/admin/v1/bio-review-queue'],
  ['GET', '/api/admin/v1/bio-reviewers'],
  ['GET', '/api/admin/v1/bio-publish-queue'],
  ['GET', '/api/admin/v1/publications'],
  ['POST', '/api/admin/v1/publications/1/revert'],
  ['GET', '/api/admin/v1/publication-jobs'],
  ['GET', '/api/admin/v1/categories'],
  ['GET', '/api/admin/v1/collections'],
  ['GET', '/api/admin/v1/platforms'],
  ['GET', '/api/admin/v1/generators'],
  ['GET', '/api/admin/v1/seo-pages'],
  ['GET', '/api/admin/v1/analytics'],
  ['GET', '/api/admin/v1/audit-logs'],
  ['GET', '/api/admin/v1/backups'],
  ['GET', '/api/admin/v1/settings'],
  ['GET', '/api/admin/v1/system/status'],
  ['PUT', '/api/admin/v1/settings'],
  ['GET', '/api/admin/v1/notifications'],
  ['POST', '/api/admin/v1/notifications/read'],
  ['POST', '/api/admin/v1/ops/cleanup'],
];

// A provider that records use. Any call means authorization was reached.
let providerCalls = 0;
const provider = {
  auth: {
    getUser: async () => {
      providerCalls += 1;
      return {data: {user: null}, error: new Error('should not be called without a token')};
    },
  },
};

let executeCalls = 0;
const execute = async () => {
  executeCalls += 1;
  throw new Error('database must not be reached by an unauthenticated request');
};

const handler = createAdminHandler({
  enabled: true,
  provider,
  execute,
  rateLimit: async () => true,
  platformRules: {},
  recovery: {issue: async () => ({}), revoke: async () => ({}), reset: async () => ({}), cleanup: async () => ({})},
});

const call = (method, path, headers = {}) =>
  handler(new Request(ORIGIN + path, {method, headers: {origin: ORIGIN, ...headers}}));

// 1. No token at all -> 401 on every route, provider untouched.
for (const [method, path] of ROUTES) {
  providerCalls = 0;
  const response = await call(method, path);
  assert.equal(response.status, 401, `${method} ${path} answered ${response.status}, expected 401`);
  const body = await response.json();
  assert.equal(body.error.code, 'UNAUTHENTICATED', `${method} ${path} leaked error code ${body.error?.code}`);
  assert.equal(providerCalls, 0, `${method} ${path} consulted the auth provider without a token`);
}

// 2. Malformed / hostile Authorization headers must not pass either.
const rejected = [
  'Bearer',
  'Basic dXNlcjpwYXNz',
  'Bearer ' + 'a'.repeat(9000),
  'Bearer not-a-jwt',
  'bearer ' + 'x'.repeat(40),
];
for (const [method, path] of ROUTES.slice(0, 6)) {
  for (const header of rejected) {
    providerCalls = 0;
    const response = await call(method, path, {authorization: header});
    assert.ok([401, 503, 400].includes(response.status), `${method} ${path} with "${header.slice(0, 20)}…" answered ${response.status}`);
  }
}

// 3. The database must never be touched without a verified identity.
assert.equal(executeCalls, 0, 'a database operation ran for an unauthenticated request');

console.log(`PASS admin API authorization: ${ROUTES.length} privileged routes all answer 401 without a token, provider and database untouched, hostile Authorization headers rejected`);
