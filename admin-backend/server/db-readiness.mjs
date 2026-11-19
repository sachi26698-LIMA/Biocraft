// Operator diagnostics must be safe for an unauthenticated health response.
// Supavisor uses XX000 for multiple failures *before* a Postgres session exists.
// Match known driver messages privately; never return the message, detail, role,
// host or an arbitrary driver code. Unknown failures stay unknown.
import {assertLimitedRole} from './database.mjs';

const knownCodes = new Set(['XX000','28P01','28000','42501','53300','57014','57P03','08001','08006',
  '3D000','EAI_AGAIN','EHOSTUNREACH','DEPTH_ZERO_SELF_SIGNED_CERT','CERT_HAS_EXPIRED',
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
export async function inspectAdminDatabase(pool, clock=Date.now) {
  let client; const started=clock();
  try { client = await pool.connect(); }
  catch (error) {
    let code=safeCode(error);
    if (!error?.code) {
      const message=typeof error?.message==='string'?error.message.slice(0,1024):'';
      if(clock()-started>=4500 || /timeout/i.test(message)) code='ETIMEDOUT';
      else if(/terminat|closed|socket|econn/i.test(message)) code='ECONNRESET';
    }
    return {database:'unreachable',sqlstate:code,connection_issue:connectionIssue(error)};
  }
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
// Keep the ordinary health response actionable without doing a second login.
export function readinessStage(report) {
  if(report.connection_issue==='tenant_or_user_lookup') return 'database tenant or user lookup failed';
  if(report.connection_issue==='pooler_role_lookup') return 'database pooler role lookup failed';
  const fallback=report.database!=='reachable'?'database unreachable':
    report.limited_role==='failed'?'database role not limited':
    report.commands==='unavailable'?'database grants missing':'database unavailable';
  return databaseStage({code:report.sqlstate},fallback).stage;
}
export async function verifyAdminDatabase(pool,clock=Date.now) {
  const report=await inspectAdminDatabase(pool,clock);
  if(!databaseReady(report)) throw databaseStage({code:report.sqlstate},readinessStage(report));
}

/** Attach a fixed diagnostic stage to a database refusal.
 *
 * The stage is derived from the SQLSTATE alone, so it distinguishes the causes
 * an operator actually has to act on — a rejected login (28xxx), a role that is
 * not least-privilege (42501), a missing database, a timeout, an unreachable
 * server — without ever echoing a credential, host or SQL statement. The
 * caller's default is kept when the driver supplies no code (a network failure
 * before authentication completes, for example). */
export function databaseStage(error,fallback) {
 const code=typeof error?.code==='string'?error.code:'';
 // Transport failures are named individually: 'unreachable' alone cannot tell a
 // wrong hostname from a blocked network or an untrusted certificate, and those
 // need completely different fixes. Every stage is a fixed phrase, never a
 // driver message, host, user, password or SQL statement.
 const stage=
  code==='ENOTFOUND'||code==='EAI_AGAIN'?'database host not resolvable':
  code==='ECONNREFUSED'?'database refused connection':
  code==='ETIMEDOUT'?'database connection timed out':
  code==='ECONNRESET'||code==='EHOSTUNREACH'||code==='ENETUNREACH'?'database network blocked':
  code==='SELF_SIGNED_CERT_IN_CHAIN'||code==='DEPTH_ZERO_SELF_SIGNED_CERT'||
   code==='UNABLE_TO_VERIFY_LEAF_SIGNATURE'||code==='CERT_HAS_EXPIRED'||
   code==='ERR_TLS_CERT_ALTNAME_INVALID'?'database certificate untrusted':
  code.startsWith('28')?'database authentication rejected':
  code==='3D000'?'database absent':
  code==='42501'?'database permission denied':
  code==='57014'?'database timeout':
  code.startsWith('08')||code==='53300'||code==='57P03'?'database unreachable':
  fallback;
 const wrapped=new Error(stage);
 wrapped.stage=stage;
 wrapped.code=knownCodes.has(code)?code:undefined;
 return wrapped;
}
