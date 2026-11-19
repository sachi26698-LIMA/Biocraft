// The local-database proxy is the ONLY component that talks to the local
// PostgreSQL from the deployed Admin API. It must be unreachable without a
// valid signature and must never accept arbitrary SQL.
import assert from 'node:assert/strict';
import {createHmac, randomBytes} from 'node:crypto';
import {verifyRequest, OPERATIONS, createProxy} from '../admin-backend/server/local-db-proxy.mjs';

const secret = randomBytes(32);
const sign = (body, timestamp, nonce = 'n1', key = secret) =>
  createHmac('sha256', key).update(`${timestamp}.${nonce}.${body}`).digest('hex');
const headers = (signature, timestamp, nonce = 'n1') =>
  ({'x-proxy-signature': signature, 'x-proxy-timestamp': String(timestamp), 'x-proxy-nonce': nonce});

// 1. A correctly signed, fresh request is accepted.
{
  const now = Date.now();
  const body = '{"operation":"health"}';
  const result = verifyRequest({headers: headers(sign(body, now), now), body, secret, now});
  assert.equal(result.ok, true, 'a valid signed request must be accepted');
}

// 2. An unsigned request is refused.
{
  const result = verifyRequest({headers: {}, body: '{}', secret, now: Date.now()});
  assert.equal(result.ok, false);
  assert.equal(result.reason, 'unsigned');
}

// 3. A forged signature is refused.
{
  const now = Date.now();
  const body = '{"operation":"counts"}';
  assert.equal(verifyRequest({headers: headers('0'.repeat(64), now), body, secret, now}).ok, false);
}

// 4. A replayed request outside the window is refused, and the SAME request is
//    accepted inside it — so the timestamp, not a guess, is what expires it.
{
  const now = Date.now();
  const body = '{"operation":"health"}';
  const old = now - 120_000;
  assert.equal(verifyRequest({headers: headers(sign(body, old), old), body, secret, now}).reason, 'stale request');
  const fresh = now - 30_000;
  assert.equal(verifyRequest({headers: headers(sign(body, fresh), fresh), body, secret, now}).ok, true);
}

// 5. A tampered body is refused: the signature covers the exact bytes.
{
  const now = Date.now();
  const signed = '{"operation":"health"}';
  const tampered = '{"operation":"counts"}';
  const result = verifyRequest({headers: headers(sign(signed, now), now), body: tampered, secret, now});
  assert.equal(result.ok, false);
  assert.equal(result.reason, 'bad signature');
}

// 6. A wrong key is refused.
{
  const now = Date.now();
  const body = '{"operation":"health"}';
  const wrong = randomBytes(32);
  assert.equal(verifyRequest({headers: headers(sign(body, now, 'n1', wrong), now), body, secret, now}).ok, false);
}

// 7. No configured secret means the service refuses everything (fail closed).
{
  const result = verifyRequest({headers: headers('a'.repeat(64), Date.now()), body: '{}', secret: Buffer.alloc(0)});
  assert.equal(result.ok, false);
  assert.equal(result.reason, 'service not configured');
}

// 8. The operation set is read-only and closed. This is the property that stops
//    an edge-exposed service from becoming a remote SQL console.
for (const [name, sql] of Object.entries(OPERATIONS)) {
  assert.match(sql, /^\s*select\s/i, `${name} must be a SELECT`);
  assert.ok(!/\b(insert|update|delete|drop|alter|create|truncate|grant|revoke)\s/i.test(sql),
    `${name} must not contain a write or DDL statement`);
  assert.ok(!/;/.test(sql.replace(/\s+$/,'')), `${name} must be a single statement`);
}
console.log(`PASS local-db proxy: signature, replay window, tamper detection, wrong key, fail-closed, and ${Object.keys(OPERATIONS).length} read-only operations`);

// 9. A live socket test: the real server rejects an unsigned call and answers a
//    signed one, using a stub pool so no database is required here.
{
  const pool = {query: async () => ({rows: [{server_time: 'now', database: 'postgres'}]})};
  const proxy = createProxy({pool, secret, host: '127.0.0.1', port: 0});
  await new Promise(r => proxy.server.once('listening', r));
  const {port} = proxy.address();
  const post = (body, headers) => fetch(`http://127.0.0.1:${port}/`, {method: 'POST', headers, body})
    .then(async r => ({status: r.status, json: await r.json()}));

  const unsigned = await post('{"operation":"health"}', {});
  assert.equal(unsigned.status, 401, 'an unsigned live request must be refused');

  const now = Date.now();
  const body = '{"operation":"health"}';
  const ok = await post(body, {...headers(sign(body, now), now), 'content-type': 'application/json'});
  assert.equal(ok.status, 200, 'a signed live request must be answered');
  assert.equal(ok.json.ok, true);

  // Arbitrary SQL must be impossible: only a named operation is accepted.
  const sqlish = '{"operation":"select * from auth.users"}';
  const rejected = await post(sqlish, {...headers(sign(sqlish, now), now), 'content-type': 'application/json'});
  assert.equal(rejected.status, 404, 'a caller cannot supply SQL');
  await proxy.close();
  console.log('PASS local-db proxy over a real socket: unsigned refused, signed answered, SQL injection impossible');
}
