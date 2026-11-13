// Server-only building blocks, not an HTTP endpoint or a complete login system.
// Use per-request Supabase clients with persistent browser/session storage OFF.
// Results may contain provider tokens and MUST remain in a trusted, encrypted,
// server-side session store; NEVER return them to the browser or application logs.
// Each entry point requires a durable shared rate limiter; no in-memory fallback.
// Membership/session checks in the database are still required after AAL2.
import {AccessError} from './identity.mjs';
import {createHash} from 'node:crypto';
const keyDigest=(prefix,value)=>`${prefix}:${createHash('sha256').update(value).digest('hex')}`;
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
async function limit(limiter, bucket, key) {
 if (typeof limiter !== 'function' || typeof key !== 'string' || key.length < 1 || key.length > 200) throw new AccessError('UNAVAILABLE');
 let allowed; try {allowed=await limiter({bucket,key});} catch {throw new AccessError('UNAVAILABLE');}
 if (allowed !== true) throw new AccessError('RATE_LIMITED');
}
function unavailable() {throw new AccessError('UNAVAILABLE');}
function invalid() {throw new AccessError('UNAUTHENTICATED');}
/** Stage password login and enumerate verified TOTP factors, using a provider
 * client dedicated to this attempt. It does not establish an admin session. */
export async function beginPasswordLogin({client,email,password,limiter,rateKey}) {
 if(typeof rateKey!=='string'||rateKey.length<1||rateKey.length>200) unavailable();
 await limit(limiter,'password-login',keyDigest('network',rateKey));
 if (typeof email !== 'string' || email.length>254 || !email.includes('@') || typeof password !== 'string' || password.length<1 || password.length>1024) invalid();
 // Separate account bucket also slows distributed guessing. Only digests are
 // passed to the persistent limiter; account lockouts are temporary and bounded.
 await limit(limiter,'password-login',keyDigest('account',email.trim().toLowerCase()));
 if (!client?.auth?.signInWithPassword || !client.auth.mfa?.listFactors) unavailable();
 let login; try {login=await client.auth.signInWithPassword({email:email.trim(),password});} catch {unavailable();}
 if (login.error || !login.data?.session?.access_token || !login.data?.session?.refresh_token) invalid();
 let factors;
 try {factors=await client.auth.mfa.listFactors();} catch {
  try {await client.auth.signOut({scope:'local'});} catch {} unavailable();
 }
 if (factors.error || !Array.isArray(factors.data?.totp)) {
  try {await client.auth.signOut({scope:'local'});} catch {} unavailable();
 }
 const verified=factors.data.totp.filter(f=>f.status==='verified' && typeof f.id==='string' && uuid.test(f.id));
 if (!verified.length) { try {await client.auth.signOut({scope:'local'});} catch {} throw new AccessError('MFA_REQUIRED'); }
 // Trusted-server value only, including tokens. Caller must protect and expire it.
 return {session:login.data.session,factorIds:verified.map(f=>f.id)};
}
/** Challenge and verify an existing verified factor. The resulting AAL2 session
 * is not Admin authorization: verify identity and membership separately. */
export async function verifyTotp({client,factorId,code,limiter,rateKey}) {
 if(typeof rateKey!=='string'||rateKey.length<1||rateKey.length>200) unavailable();
 await limit(limiter,'totp-verify',keyDigest('network',rateKey));
 if (typeof factorId!=='string' || !uuid.test(factorId) || typeof code!=='string' || !/^\d{6,8}$/.test(code)) invalid();
 await limit(limiter,'totp-verify',keyDigest('factor',factorId));
 if (!client?.auth?.mfa?.challengeAndVerify) unavailable();
 let response; try {response=await client.auth.mfa.challengeAndVerify({factorId,code});} catch {unavailable();}
 if (response.error || !response.data?.access_token || !response.data?.refresh_token) invalid();
 return response.data; // Trusted server only. Must be validated and stored safely.
}
/** Provider logout. Does not by itself revoke a JWT already issued; the
 * server-side Admin session must separately be revoked before accepting calls. */
export async function providerLogout(client) {
 if (!client?.auth?.signOut) unavailable();
 let response; try {response=await client.auth.signOut({scope:'global'});} catch {unavailable();}
 if (response?.error) unavailable();
}
