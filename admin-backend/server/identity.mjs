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
/** Provider getUser validates the token server-side. Resolve state every time;
 * if the resolver is absent, the admin backend fails closed. */
export async function authorizeRead({token, permission, provider, resolveSession, now = Date.now()}) {
  if (!permissionName.test(permission ?? '') || !provider?.auth?.getUser || typeof resolveSession !== 'function') denied('UNAVAILABLE');
  const claims = claimsFrom(token);
  if (claims.iss !== ISSUER || !(claims.aud === 'authenticated' || (Array.isArray(claims.aud) && claims.aud.includes('authenticated'))) ||
      claims.role !== 'authenticated' || claims.aal !== 'aal2' || claims.is_anonymous !== false ||
      !uuid.test(claims.sub ?? '') || !uuid.test(claims.session_id ?? '') ||
      !Number.isSafeInteger(claims.exp) || claims.exp * 1000 <= now ||
      (claims.nbf !== undefined && (!Number.isSafeInteger(claims.nbf) || claims.nbf * 1000 > now))) denied('UNAUTHENTICATED');
  let result;
  try { result = await provider.auth.getUser(token); } catch { denied('UNAVAILABLE'); }
  if (result?.error || !result?.data?.user || result.data.user.id !== claims.sub || result.data.user.is_anonymous === true) denied('UNAUTHENTICATED');
  let state;
  try { state = await resolveSession({userId: claims.sub, sessionId: claims.session_id}); } catch { denied('UNAVAILABLE'); }
  // Resolver must query live membership + an independently revocable server-side
  // session. An AAL2 JWT by itself is not a session-revocation or freshness check.
  if (!state || state.userId !== claims.sub || state.sessionId !== claims.session_id ||
      state.enabled !== true || state.revoked !== false || !Number.isFinite(state.expiresAt) || state.expiresAt <= now ||
      !Array.isArray(state.permissions) || !state.permissions.includes(permission)) denied('FORBIDDEN');
  return Object.freeze({userId: claims.sub, sessionId: claims.session_id});
}
