// Server-side provider logout for the current access token; no service key.
// Supabase may leave already-issued JWTs valid until expiry: the local Admin
// session must be revoked first. Never log tokens or provider response bodies.
import {createProviderClient} from './identity.mjs';
export function createProviderLogout({url,publishableKey,fetchImpl=globalThis.fetch}={}) {
 createProviderClient(url,publishableKey); // validates fixed project and key type
 if(typeof fetchImpl!=='function')throw new Error('Provider unavailable');
 return async function(accessToken) {
  if(typeof accessToken!=='string'||accessToken.length<1||accessToken.length>8192)throw new Error('Invalid token');
  const response=await fetchImpl(`${url}/auth/v1/logout?scope=local`,{method:'POST',headers:{apikey:publishableKey,Authorization:`Bearer ${accessToken}`},redirect:'error',signal:AbortSignal.timeout(5000)});
  if(!response.ok)throw new Error('Provider logout failed');
 };
}
