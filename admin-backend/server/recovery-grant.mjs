// Server-only building blocks for Super-Admin-authorised TOTP recovery (D2) and
// for the bounded cleanup schedule (D4). Not an HTTP endpoint on its own.
//
// Recovery design, matching migration 012:
//   * there is no password-only route back in for an account that ever had a
//     verified factor — a second, fully authenticated Super Admin must authorise
//     one specific account, one time;
//   * the code is bound to that account, single use, at most 15 minutes, at most
//     five attempts, and only one live grant per account;
//   * the plaintext code exists only in the issuing Super Admin's browser and the
//     recovering user's browser; the database stores an 8-byte salt and a 32-byte
//     salted digest, so a database reader cannot recover the code;
//   * redeeming does NOT sign anyone in and does NOT remove a factor by itself.
//     It produces an audited authorisation; the stale factor is then deleted by
//     the project operator (the only holder of the Auth admin surface), after
//     which the ordinary first-factor enrolment in 011 applies. No silent bypass.
//   * every issuance, revocation, attempt and cleanup run is audited in the
//     database, including denials and rate-limited requests.
import {createHash, randomBytes, timingSafeEqual, randomUUID} from 'node:crypto';
import {AccessError} from './identity.mjs';

/** Crockford base32: exactly 32 symbols, no vowels (so a code cannot spell a
 * word) and no I/L/O/U, which keeps 0/1 unambiguous when read aloud. Decoding
 * folds the excluded letters onto their digits, so a misread O or I still works. */
const ALPHABET = '0123456789abcdefghjkmnpqrstvwxyz';
const DATA_SYMBOLS = 8;
const CHECK_SYMBOLS = 4;
const CODE_LENGTH = DATA_SYMBOLS + CHECK_SYMBOLS;
const RECOVERY_TTL_SECONDS = 900;
const MAX_ATTEMPTS = 5;
const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Lower-case, strip separators, and fold the four symbols Crockford excludes
 * (I, L, O, U) onto the characters a reader most likely meant, so a code written
 * down from a screen still matches. */
export const normaliseRecoveryCode = value => typeof value === 'string'
  ? value.toLowerCase().replace(/[^0-9a-z]/g, '').replace(/[il]/g, '1').replace(/o/g, '0').replace(/u/g, 'v')
  : '';

/** Checksum over the 8 data symbols. Four symbols catch every single-character
 * substitution and most transpositions (~1 in 1.05e6 random strings passes), so
 * a typo is rejected locally instead of spending a rate-limited attempt. */
function checksum(data) {
  let h = 0x811c9dc5;
  for (const ch of data) { h ^= ch.charCodeAt(0); h = Math.imul(h, 0x01000193) >>> 0; }
  let out = '';
  for (let i = 0; i < CHECK_SYMBOLS; i += 1) { out += ALPHABET[h % 32]; h = Math.floor(h / 32); }
  return out;
}

/** True only for a well-formed code whose checksum matches. */
export function isWellFormedRecoveryCode(code) {
  const normalised = normaliseRecoveryCode(code);
  if (normalised.length !== CODE_LENGTH) return false;
  for (const ch of normalised) if (!ALPHABET.includes(ch)) return false;
  const expected = Buffer.from(checksum(normalised.slice(0, DATA_SYMBOLS)), 'ascii');
  const actual = Buffer.from(normalised.slice(DATA_SYMBOLS), 'ascii');
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

/** Salted digest. Only fixed-length bytes cross the boundary to the database. */
export function digestRecoveryCode(code, salt) {
  if (!Buffer.isBuffer(salt) || salt.length !== 8) throw new Error('Invalid recovery salt');
  const normalised = normaliseRecoveryCode(code);
  if (!isWellFormedRecoveryCode(normalised)) throw new Error('Invalid recovery code');
  return createHash('sha256').update(salt).update('\0').update(normalised, 'ascii').digest();
}

/** Generate a single-use code and its database digest. `code` is the only
 * plaintext: return it to the issuing Super Admin once, never store, log, or put
 * it in a URL. 40 bits of entropy, single use, five attempts, 15 minutes. */
export function issueRecoveryCode({random = randomBytes} = {}) {
  const raw = random(DATA_SYMBOLS);
  if (!Buffer.isBuffer(raw) || raw.length !== DATA_SYMBOLS) throw new Error('Invalid randomness');
  let data = '';
  for (let i = 0; i < DATA_SYMBOLS; i += 1) data += ALPHABET[raw[i] % 32];
  const salt = random(8);
  if (!Buffer.isBuffer(salt) || salt.length !== 8) throw new Error('Invalid randomness');
  const code = `${data.slice(0, 4)}-${data.slice(4)}-${checksum(data)}`;
  return Object.freeze({code, salt, codeHash: digestRecoveryCode(code, salt)});
}

/**
 * Super Admin recovery authorisation. The caller passes the identity of a fully
 * authenticated (AAL2) Super Admin; the database re-checks `staff.manage`,
 * refuses self-recovery, and replaces any previous live grant for the account.
 * Returns the plaintext code exactly once.
 */
export async function issueRecoveryGrant({execute, identity, targetUserId, ttlSeconds = RECOVERY_TTL_SECONDS, requestId = randomUUID(), generate = issueRecoveryCode}) {
  if (typeof execute !== 'function' || !identity || identity.assuranceLevel !== 'aal2') throw new AccessError('FORBIDDEN');
  if (typeof targetUserId !== 'string' || !uuidRe.test(targetUserId)) throw new AccessError('INVALID');
  if (targetUserId === identity.userId) throw new AccessError('FORBIDDEN');
  if (!Number.isSafeInteger(ttlSeconds) || ttlSeconds < 60 || ttlSeconds > RECOVERY_TTL_SECONDS) throw new AccessError('INVALID');
  const {code, salt, codeHash} = generate();
  const rows = await execute({identity, operation: 'recoveryIssue', args: [targetUserId, codeHash, salt, `${ttlSeconds} seconds`, requestId]});
  if (!Array.isArray(rows) || rows.length !== 1 || typeof rows[0]?.grant_id !== 'string') throw new AccessError('UNAVAILABLE');
  return Object.freeze({code, grantId: rows[0].grant_id, expiresInSeconds: ttlSeconds, requestId});
}

/** Withdraw a live grant before it is used. */
export async function revokeRecoveryGrant({execute, identity, grantId, requestId = randomUUID()}) {
  if (typeof execute !== 'function' || !identity || identity.assuranceLevel !== 'aal2') throw new AccessError('FORBIDDEN');
  if (typeof grantId !== 'string' || !uuidRe.test(grantId)) throw new AccessError('INVALID');
  const rows = await execute({identity, operation: 'recoveryRevoke', args: [grantId, requestId]});
  if (!Array.isArray(rows) || rows.length !== 1) throw new AccessError('UNAVAILABLE');
  return rows[0].revoked === true;
}

/** Live state of the caller's own grant: the salt (not a secret) so the client
 * can compute the digest, plus how many attempts remain. */
export async function recoveryGrantState({execute, identity, requestId = randomUUID()}) {
  if (typeof execute !== 'function' || !identity || !['aal1', 'aal2'].includes(identity.assuranceLevel)) throw new AccessError('FORBIDDEN');
  const rows = await execute({identity, operation: 'recoveryState', args: [requestId]});
  const row = Array.isArray(rows) && rows.length === 1 ? rows[0] : null;
  if (!row || row.salt == null) return null;
  const salt = Buffer.from(row.salt);
  if (salt.length !== 8) throw new AccessError('UNAVAILABLE');
  return Object.freeze({salt, attemptsRemaining: Number(row.attempts_remaining ?? 0), expiresAt: row.expires_at});
}

/**
 * The recovering account redeems its code. The identity is an AAL1 password
 * session for the account itself; enabled membership and a live provider session
 * are enforced inside the database, and the outcome is audited either way.
 *
 * On success this returns an authorisation only — it does not sign the account
 * in, mint a session, or delete a factor. The operator removes the stale factor
 * from the Auth admin surface, and the account then re-enrols through 011.
 */
/** Redeem against a salt the caller already holds (the pending recovery flow
 * keeps it in the server-side encrypted store, never in the browser). */
export async function redeemWithSalt({execute, identity, code, salt, requestId = randomUUID()}) {
  if (typeof execute !== 'function' || !identity || !['aal1', 'aal2'].includes(identity.assuranceLevel)) throw new AccessError('FORBIDDEN');
  if (!isWellFormedRecoveryCode(code)) throw new AccessError('INVALID');
  if (!Buffer.isBuffer(salt) || salt.length !== 8) throw new AccessError('UNAVAILABLE');
  const digest = digestRecoveryCode(code, salt);
  const rows = await execute({identity, operation: 'recoveryRedeem', args: [digest, requestId]});
  const outcome = Array.isArray(rows) && rows.length === 1 ? rows[0].outcome : null;
  if (outcome === 'ok') return Object.freeze({ok: true, next: 'factor_reset_required', requestId});
  if (outcome === 'exhausted') throw new AccessError('FORBIDDEN');
  throw new AccessError('UNAUTHENTICATED');
}

/** Convenience wrapper that looks the salt up through the audited state call. */
export async function redeemRecoveryCode({execute, identity, code, requestId = randomUUID()}) {
  const state = await recoveryGrantState({execute, identity, requestId});
  if (!state) throw new AccessError('UNAUTHENTICATED');
  if (state.attemptsRemaining < 1) throw new AccessError('FORBIDDEN');
  return redeemWithSalt({execute, identity, code, salt: state.salt, requestId});
}

/** Bounded cleanup. One target per call keeps the batch and the lock scope small;
 * the scheduler runs `admin_login_flows` then `admin_rate_limits`. Expired audit
 * evidence is never a target — the function can only name these two tables. */
export async function runCleanup({execute, identity, target, limit = 500, requestId = randomUUID()}) {
  if (typeof execute !== 'function' || !identity || identity.assuranceLevel !== 'aal2') throw new AccessError('FORBIDDEN');
  if (!['admin_login_flows', 'admin_rate_limits'].includes(target)) throw new AccessError('INVALID');
  if (!Number.isSafeInteger(limit) || limit < 1 || limit > 1000) throw new AccessError('INVALID');
  const rows = await execute({identity, operation: 'cleanupExpired', args: [target, limit, requestId]});
  if (!Array.isArray(rows) || rows.length !== 1) throw new AccessError('UNAVAILABLE');
  return Object.freeze({target, deleted: Number(rows[0].deleted ?? 0), requestId});
}

/** Scheduler used by the Preview. Vercel Cron targets production only, so the
 * Preview schedule is driven by an authenticated Super Admin request (the same
 * path used by the Settings module), and the plan for production is documented
 * rather than assumed. Returns one result per target; a failure in one target
 * does not skip the other. */
export async function runCleanupBatch({execute, identity, limit = 500, requestId = randomUUID()}) {
  const results = [];
  for (const target of ['admin_login_flows', 'admin_rate_limits']) {
    try { results.push(await runCleanup({execute, identity, target, limit, requestId})); }
    catch (error) { results.push({target, deleted: 0, error: error?.code ?? 'UNAVAILABLE', requestId}); }
  }
  return Object.freeze({results, requestId});
}

/** D2 decision for a password session that has no verified factor. Returns
 * 'enrol' only for an account that has never proven a factor, 'recover' for one
 * that has, and throws for anything the database does not explicitly allow. */
export async function factorGate({execute, identity, requestId = randomUUID()}) {
  if (typeof execute !== 'function' || !identity || !['aal1', 'aal2'].includes(identity.assuranceLevel)) throw new AccessError('FORBIDDEN');
  const rows = await execute({identity, operation: 'factorGate', args: [requestId]});
  const outcome = Array.isArray(rows) && rows.length === 1 ? rows[0].outcome : null;
  if (outcome !== 'enrol' && outcome !== 'recover') throw new AccessError('FORBIDDEN');
  return outcome;
}

export const RECOVERY = Object.freeze({CODE_LENGTH, DATA_SYMBOLS, CHECK_SYMBOLS, MAX_ATTEMPTS, TTL_SECONDS: RECOVERY_TTL_SECONDS, ALPHABET});
