// Server-side identity/authorization boundary. Not exposed by the Preview UI.
// Auth verifies the token remotely; session/membership lookups must be backed by
// a trustworthy server-controlled store. No role or permission is accepted from
// user-editable Auth metadata or from the client. This guard is not a transaction
// boundary: writes must re-check membership/session inside the write transaction.
import { createClient } from '@supabase/supabase-js';

const PROJECT_REF = 'jvpadtzfsuekixrquzjv';
const ISSUER = `https://${PROJECT_REF}.supabase.co/auth/v1`;
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const permissionName = /^[a-z][a-z0-9_.]{1,99}$/;

export class AccessError extends Error {
  constructor(code) { super(code); this.name = 'AccessError'; this.code = code; }
}
function denied(code) { throw new AccessError(code); }
function claimsFrom(token) {
  if (typeof token !== 'string' || token.length > 8192) denied('UNAUTHENTICATED');
  const parts = token.split('.');
  if (parts.length !== 3 || !parts.every(part => /^[A-Za-z0-9_-]+$/.test(part))) denied('UNAUTHENTICATED');
  try {
    const claims = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
    if (!claims || typeof claims !== 'object' || Array.isArray(claims)) denied('UNAUTHENTICATED');
    return claims;
  } catch { denied('UNAUTHENTICATED'); }
}
/** Create a server-only provider client using the existing project URL and a
 * publishable/anon key. Never pass a service-role or secret key to this function. */
export function createProviderClient(url, publishableKey) {
  if (url !== `https://${PROJECT_REF}.supabase.co` || typeof publishableKey !== 'string' || !publishableKey || publishableKey.length > 4096)
    throw new Error('Invalid admin Auth configuration');
  // Legacy JWT anon keys are permitted; secret keys and legacy service role keys
  // must never be used here. JWT claims are decoded only to reject unsafe keys,
  // not for authentication; unknown/malformed JWT keys are rejected.
  if (publishableKey.startsWith('sb_secret_')) throw new Error('Secret keys are forbidden');
  if (!publishableKey.startsWith('sb_publishable_')) {
    let role;
    try { role = claimsFrom(publishableKey).role; } catch { throw new Error('Invalid publishable key'); }
    if (role !== 'anon') throw new Error('Only publishable keys are permitted');
  }
  return createClient(url, publishableKey, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
}
/** Verify identity with the actual Supabase Auth user endpoint before using any
 * untrusted claim. No Admin authorization or session revocation is implied. */
export async function verifyProviderIdentity({token, provider, now = Date.now(), allowAal1 = false}) {
  if (!provider?.auth?.getUser) denied('UNAVAILABLE');
  const claims = claimsFrom(token);
  if (claims.iss !== ISSUER || !(claims.aud === 'authenticated' || (Array.isArray(claims.aud) && claims.aud.includes('authenticated'))) ||
      claims.role !== 'authenticated' || !(claims.aal === 'aal2' || (allowAal1 && claims.aal === 'aal1')) || claims.is_anonymous !== false ||
      !uuid.test(claims.sub ?? '') || !uuid.test(claims.session_id ?? '') ||
      !Number.isSafeInteger(claims.exp) || claims.exp * 1000 <= now ||
      (claims.nbf !== undefined && (!Number.isSafeInteger(claims.nbf) || claims.nbf * 1000 > now))) denied('UNAUTHENTICATED');
  let result;
  try { result = await provider.auth.getUser(token); } catch { denied('UNAVAILABLE'); }
  if (result?.error || !result?.data?.user || result.data.user.id !== claims.sub || result.data.user.is_anonymous === true) denied('UNAUTHENTICATED');
  // AAL2 does not itself prove fresh MFA. Extract only a provider-verified TOTP
  // event with a non-future Unix timestamp; missing/unknown AMR fails closed
  // for sensitive operations. Actual project claim semantics require live test.
  const seconds=Math.floor(now/1000);
  const times=Array.isArray(claims.amr)?claims.amr.filter(x=>x && x.method==='totp' && Number.isSafeInteger(x.timestamp) && x.timestamp>0 && x.timestamp<=seconds).map(x=>x.timestamp):[];
  return Object.freeze({userId: claims.sub, sessionId: claims.session_id, assuranceLevel: claims.aal, mfaVerifiedAt:times.length?Math.max(...times):null});
}
/** Enrolment-only verification: the account has a password session but may have
 * no verified factor yet, so AAL1 is accepted. The caller must still require an
 * enabled Admin membership and a live provider session inside the database
 * before any factor is created. Never use this for ordinary admin operations. */
export async function verifyEnrolmentIdentity({token, provider, now = Date.now()}) {
  return verifyProviderIdentity({token, provider, now, allowAal1: true});
}
/** Read-only guard; the resolver must query live membership and revocable session. */
export async function authorizeRead({token, permission, provider, resolveSession, now = Date.now()}) {
  if (!permissionName.test(permission ?? '') || typeof resolveSession !== 'function') denied('UNAVAILABLE');
  const identity = await verifyProviderIdentity({token, provider, now});
  let state;
  try { state = await resolveSession({userId: identity.userId, sessionId: identity.sessionId}); } catch { denied('UNAVAILABLE'); }
  if (!state || state.userId !== identity.userId || state.sessionId !== identity.sessionId ||
      state.enabled !== true || state.revoked !== false || !Number.isFinite(state.expiresAt) || state.expiresAt <= now ||
      !Array.isArray(state.permissions) || !state.permissions.includes(permission)) denied('FORBIDDEN');
  return Object.freeze({userId: identity.userId, sessionId: identity.sessionId});
}
