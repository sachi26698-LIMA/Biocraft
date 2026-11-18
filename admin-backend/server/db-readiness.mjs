// Operator diagnostics must be safe for an unauthenticated health response.
// Supavisor uses XX000 for multiple failures *before* a Postgres session exists.
// Match known driver messages privately; never return the message, detail, role,
// host or an arbitrary driver code. Unknown failures stay unknown.
import {assertLimitedRole} from './database.mjs';

const knownCodes = new Set(['XX000','28P01','28000','42501','53300','57014','57P03','08001','08006',
  'ENOTFOUND','ENETUNREACH','ECONNREFUSED','ECONNRESET','ETIMEDOUT','SELF_SIGNED_CERT_IN_CHAIN',
  'UNABLE_TO_VERIFY_LEAF_SIGNATURE','ERR_TLS_CERT_ALTNAME_INVALID']);
function safeCode(error) { return knownCodes.has(error?.code) ? error.code : 'unknown'; }
function connectionIssue(error) {
  const message = typeof error?.message === 'string' ? error.message.slice(0,1024) : '';
  if (error?.code === '28P01' || /password authentication failed|\(EWRONGPASSWORD\)/i.test(message)) return 'login_rejected';
  if (/tenant or user not found|tenant\/user .+ not found|\(ENOTFOUND\)|no tenant identifier/i.test(message)) return 'tenant_or_user_lookup';
  if (/auth_query|authentication query|authentication secrets|\(EAUTHQUERY\)|user not found in the database|SCRAM secret/i.test(message)) return 'pooler_role_lookup';
  if (/circuit breaker|\(ECIRCUITBREAKER\)|tenant is banned/i.test(message)) return 'temporarily_blocked';
  if (/allow.?list|pg_hba\.conf|\(EADDRNOTALLOWED\)/i.test(message)) return 'network_policy';
  if (error?.code === '53300' || /max client|max pools|\(EMAXCONN\)/i.test(message)) return 'connection_capacity';
  return 'unknown';
}

// No actor claims, content access or writes. Readiness uses exactly one limited
// connection and releases it even if a role/command check fails.
export async function inspectAdminDatabase(pool) {
  let client;
  try { client = await pool.connect(); }
  catch (error) { return {database:'unreachable', sqlstate:safeCode(error), connection_issue:connectionIssue(error)}; }
  const report = {database:'reachable', limited_role:'unchecked', commands:'unchecked'};
  try {
    await client.query('begin read only');
    await client.query("set local statement_timeout = '3000ms'");
    report.limited_role = 'failed';
    await assertLimitedRole(client);
    report.limited_role = 'ok';
    const {rows} = await client.query(`select pg_catalog.has_schema_privilege(current_user,'bc_admin_v1','USAGE')
      and bool_and(coalesce(pg_catalog.has_function_privilege(current_user,pg_catalog.to_regprocedure(signature),'EXECUTE'),false)) as ready
      from unnest($1::text[]) as signatures(signature)`,[[
      'bc_admin_v1.consume_rate_limit(text,bytea)', 'bc_admin_v1.require_actor(text)',
      'bc_admin_v1.store_login_flow(bytea,bytea,integer)', 'bc_admin_v1.take_login_flow(bytea)',
      'bc_admin_v1.factor_gate(uuid)', 'bc_admin_v1.open_admin_session(uuid)', 'bc_admin_v1.session_identity()',
    ]]);
    report.commands = rows[0]?.ready === true ? 'ok' : 'unavailable';
  } catch (error) { report.sqlstate = safeCode(error); }
  finally {
    let broken = false;
    try { await client.query('rollback'); } catch { broken = true; report.commands = 'unavailable'; }
    client.release(broken);
  }
  return report;
}
export const databaseReady = report => report.database === 'reachable' && report.limited_role === 'ok' && report.commands === 'ok';
export async function verifyAdminDatabase(pool) {
  if (!databaseReady(await inspectAdminDatabase(pool))) throw new Error('Admin database not ready');
}
