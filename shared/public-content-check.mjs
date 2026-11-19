import {publicSupabaseConfig} from './supabase-config.mjs';

// Admin-only diagnostic of its guest-readable database catalogue. The public
// site's bundled content and /api/status/content do not depend on this check.
export async function checkPublicContent(env=process.env, fetcher=fetch) {
  const config=publicSupabaseConfig(env.VITE_SUPABASE_URL,env.ADMIN_SUPABASE_PUBLISHABLE_KEY ?? env.VITE_SUPABASE_PUBLISHABLE_KEY);
  if (!config) return false;
  try {
    const response=await fetcher(`${config.url}/rest/v1/bios?select=id&is_active=eq.true&limit=1`,{
      headers:{apikey:config.key}, redirect:'error', signal:AbortSignal.timeout(3500), cache:'no-store',
    });
    if (!response.ok) { await response.body?.cancel(); return false; }
    const rows=await response.json();
    return Array.isArray(rows) && rows.length===1 && typeof rows[0]?.id==='string';
  } catch { return false; }
}

