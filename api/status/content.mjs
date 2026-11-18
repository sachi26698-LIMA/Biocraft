import {publicSupabaseConfig} from '../../shared/supabase-config.mjs';

// A bounded guest read, not a privileged probe. It checks the same REST and
// project credentials as the website, without exposing any row or error detail.
export async function checkPublicContent(env=process.env, fetcher=fetch) {
  const config=publicSupabaseConfig(env.VITE_SUPABASE_URL,env.VITE_SUPABASE_PUBLISHABLE_KEY);
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

let cached;
export default async function handler(req,res) {
  res.setHeader('Cache-Control','no-store');
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Content-Type','application/json; charset=utf-8');
  if (req.method!=='GET') {
    res.statusCode=405;
    res.setHeader('Allow','GET');
    res.end(JSON.stringify({error:{code:'METHOD_NOT_ALLOWED'}}));
    return;
  }
  // Coalesce concurrent probes and briefly reuse the result per instance.
  if (!cached || cached.expires<=Date.now()) cached={expires:Date.now()+10_000,result:checkPublicContent()};
  const ok=await cached.result;
  res.statusCode=ok?200:503;
  res.end(JSON.stringify({ok}));
}
