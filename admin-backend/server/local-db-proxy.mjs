// Authenticated proxy between the deployed Admin API and the LOCAL PostgreSQL.
//
// Why this exists: Vercel cannot reach a developer machine, and it must never
// try. This service runs on whatever host actually holds the local database (a
// persistent server or a tunnel endpoint), and it is the only thing that speaks
// to that socket. The deployed function calls it over HTTPS with a signed
// request; nothing about the local socket, host or credential is sent to a
// browser or embedded in the frontend.
//
// Security posture, deliberately conservative:
//   * allow-listed SQL. The caller names an operation; it never supplies SQL.
//     A read-only, reviewed query set is the entire surface — no ad-hoc queries,
//     no writes, no DDL. That is what keeps an edge-exposed service from becoming
//     a remote shell into the database.
//   * HMAC-signed requests with a timestamp window, so a captured request cannot
//     be replayed later.
//   * fail-closed. No secret configured means no service, not an open one.
//   * binds to an explicit interface; never 0.0.0.0 by default.
import {createHmac, timingSafeEqual, randomUUID} from 'node:crypto';
import {createServer} from 'node:http';

const MAX_BODY = 8192;
const CLOCK_SKEW_MS = 60_000;

/** The complete set of read operations. Each is a fixed statement. */
export const OPERATIONS = {
  health: 'select now() as server_time, current_database() as database',
  counts: `select 'bios' as table_name, count(*)::bigint as rows from public.bios
           union all select 'captions', count(*) from public.captions
           union all select 'hashtags', count(*) from public.hashtags
           union all select 'symbols', count(*) from public.symbols
           union all select 'fonts', count(*) from public.fonts
           union all select 'global_content', count(*) from public.global_content
           order by 1`,
  sync_status: `select status, count(*)::bigint as events from public.sync_outbox group by status order by status`,
  sync_lag: `select table_name, last_revision, last_synced_at,
                    extract(epoch from (now() - last_synced_at))::bigint as lag_seconds,
                    last_row_count
               from public.sync_state order by table_name`,
};

/** Constant-time compare of two hex strings of equal expected length. */
function sameHex(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  if (a.length !== b.length) return false;
  try { return timingSafeEqual(Buffer.from(a, 'hex'), Buffer.from(b, 'hex')); } catch { return false; }
}

/** Verify a signed request. Exported so the test suite can exercise it directly
 * without opening a socket. */
export function verifyRequest({headers, body, secret, now = Date.now()}) {
  if (!Buffer.isBuffer(secret) || secret.length !== 32) return {ok: false, reason: 'service not configured'};
  const signature = headers['x-proxy-signature'];
  const timestamp = headers['x-proxy-timestamp'];
  const nonce = headers['x-proxy-nonce'];
  if (typeof signature !== 'string' || typeof timestamp !== 'string') return {ok: false, reason: 'unsigned'};
  const sent = Number(timestamp);
  if (!Number.isFinite(sent) || Math.abs(now - sent) > CLOCK_SKEW_MS) return {ok: false, reason: 'stale request'};
  const expected = createHmac('sha256', secret).update(`${timestamp}.${nonce ?? ''}.${body}`).digest('hex');
  if (!sameHex(signature, expected)) return {ok: false, reason: 'bad signature'};
  return {ok: true};
}

export function createProxy({pool, secret, host = '127.0.0.1', port = 8787, now = Date.now} = {}) {
  if (!pool || typeof pool.query !== 'function') throw new Error('pool required');
  if (!Buffer.isBuffer(secret) || secret.length !== 32) throw new Error('secret must be 32 bytes');
  const server = createServer((req, res) => {
    const send = (status, payload) => {
      const body = JSON.stringify(payload);
      res.writeHead(status, {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'no-store',
        'x-content-type-options': 'nosniff',
        'content-length': Buffer.byteLength(body),
      });
      res.end(body);
    };
    if (req.method !== 'POST') return send(405, {error: 'method not allowed'});
    let size = 0, chunks = [];
    req.on('data', chunk => {
      size += chunk.length;
      if (size > MAX_BODY) { req.destroy(); return; }
      chunks.push(chunk);
    });
    req.on('end', async () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      // The signature covers the exact bytes received, so the body is never
      // re-serialised before verification.
      const check = verifyRequest({headers: req.headers, body: raw, secret, now: now()});
      if (!check.ok) return send(401, {error: check.reason});
      let parsed;
      try { parsed = JSON.parse(raw || '{}'); } catch { return send(400, {error: 'invalid JSON'}); }
      const statement = OPERATIONS[parsed.operation];
      // An unknown operation is refused outright; the caller can never supply SQL.
      if (!statement) return send(404, {error: 'unknown operation'});
      try {
        const result = await pool.query(statement);
        send(200, {ok: true, operation: parsed.operation, rows: result.rows, request_id: randomUUID()});
      } catch {
        // No driver message is returned: it can disclose schema details.
        send(502, {error: 'database query failed'});
      }
    });
  });
  server.listen(port, host);
  return {
    server,
    close: () => new Promise(resolve => server.close(resolve)),
    address: () => server.address(),
  };
}

export default createProxy;
