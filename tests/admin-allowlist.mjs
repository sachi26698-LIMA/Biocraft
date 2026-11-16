// Allow-list gate for Admin sign-in.
//
// The rule the operator asked for is "only this address may log in". This test
// pins the two halves that matter and are easy to get wrong:
//   1. isEmailAllowed must be case-insensitive and exact — no substring or prefix
//      matching, so `sachi26698@gmail.com.evil.test` is not "close enough".
//   2. The route must refuse BEFORE calling the provider, so a non-admin address
//      never has its password tested and never burns a real admin's rate limit.
// The second half is asserted by counting provider calls: zero must be observed.
import assert from 'node:assert/strict';
import {isEmailAllowed, normaliseEmail} from '../admin-backend/server/auth-flow.mjs';
import {createAuthController} from '../admin-backend/server/auth-controller.mjs';

const REAL = 'sachi26698@gmail.com';
const ALLOW = `someone@else.test, ${REAL} ,third@example.test`;

// --- 1. the predicate -------------------------------------------------------
assert.equal(isEmailAllowed(REAL, ALLOW), true, 'exact match must pass');
assert.equal(isEmailAllowed('SACHI26698@GMAIL.COM', ALLOW), true, 'case must not matter');
assert.equal(isEmailAllowed('  sachi26698@GMAIL.com  ', ALLOW), true, 'surrounding space must not matter');
assert.equal(
  isEmailAllowed(REAL, `${REAL}.evil.test`),
  false,
  'a longer address that merely starts with the admin address must be rejected',
);
assert.equal(isEmailAllowed(`${REAL}x`, ALLOW), false, 'suffix extension must be rejected');
assert.equal(isEmailAllowed('sachi26698@gmail.co', ALLOW), false, 'missing character must be rejected');
assert.equal(isEmailAllowed('attacker@example.test', ALLOW), false, 'unlisted address must be rejected');
assert.equal(isEmailAllowed('', ALLOW), false, 'empty email must be rejected');
assert.equal(isEmailAllowed(REAL, ''), false, 'empty allow-list must deny everyone (fail closed)');
assert.equal(isEmailAllowed(REAL, undefined), false, 'unset allow-list must deny everyone (fail closed)');
assert.equal(isEmailAllowed(REAL, '   '), false, 'whitespace-only allow-list must deny everyone');
assert.equal(isEmailAllowed(null, ALLOW), false, 'non-string email must be rejected');
assert.equal(normaliseEmail('  A@B.CO  '), 'a@b.co', 'normalisation trims and lowercases');

// --- 2. the route: denied before the provider is touched ---------------------
const ORIGIN = 'https://admin.example.test';
let providerCalls = 0;
const createClient = () => {
  providerCalls += 1;
  return {auth: {
    signInWithPassword: async () => ({data: {session: null}, error: {message: 'invalid credentials'}}),
    mfa: {listFactors: async () => ({data: {totp: []}, error: null})},
  }};
};
const store = new Map();
const flowStore = {
  put: async (id, v) => { store.set(id, v); },
  take: async (id) => store.get(id) ?? null,
  limit: async () => true,
};
const controller = createAuthController({
  enabled: true,
  origin: ORIGIN,
  key: Buffer.alloc(32, 7),
  createClient,
  flowStore,
  limiter: async () => true,
  sessionHandler: async () => new Response(null, {status: 401}),
  allowList: ALLOW,
});

const post = (pathname, body) =>
  new Request(ORIGIN + pathname, {
    method: 'POST',
    headers: {origin: ORIGIN, 'content-type': 'application/json'},
    body: JSON.stringify(body),
  });

// A denied address: 401, no provider call.
const denied = await controller(post('/api/admin/v1/auth/login', {email: 'attacker@example.test', password: 'x'}), 'k'.repeat(8));
assert.equal(denied.status, 401, 'unlisted address must be answered 401');
assert.equal((await denied.json()).error.code, 'UNAUTHENTICATED', 'denial must not reveal that the address is unlisted');
assert.equal(providerCalls, 0, 'provider must NOT be called for an unlisted address');

// The allowed address does reach the provider (here intentionally failing), which
// proves the gate is not simply blocking every request.
const allowed = await controller(post('/api/admin/v1/auth/login', {email: REAL.toUpperCase(), password: 'x'}), 'k'.repeat(8));
assert.equal(providerCalls, 1, 'allowed address must reach the provider exactly once');
assert.equal(allowed.status, 401, 'a failed provider login still answers 401');

console.log('PASS admin allow-list: exact case-insensitive matching, fail-closed on empty/unset list, rejected before the provider call (providerCalls=0 for a denied address)');
