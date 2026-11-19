// Shared by Vite, the guest client, and server functions. Never pass a
// privileged key through these settings. Legacy JWT claims here are only a
// configuration check; Supabase validates the signature on every request.
export const SUPABASE_URL = 'https://jvpadtzfsuekixrquzjv.supabase.co';

// A key-only deployment is unambiguous: BioCraft supports just this project.
// An explicitly set empty/wrong URL is still a configuration error.
export function publicSupabaseConfig(url = SUPABASE_URL, key) {
  if (typeof url !== 'string' || url.trim().replace(/\/$/, '') !== SUPABASE_URL || typeof key !== 'string') return null;
  const candidate = key.trim();
  if (/^sb_publishable_[A-Za-z0-9_-]+$/.test(candidate)) return { url: SUPABASE_URL, key: candidate };
  if (!/^[\w-]+\.[\w-]+\.[\w-]+$/.test(candidate)) return null;
  try {
    const payload = candidate.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const { role, ref } = JSON.parse(atob(payload));
    if (role === 'anon' && ref === 'jvpadtzfsuekixrquzjv') return { url: SUPABASE_URL, key: candidate };
  } catch { /* Invalid legacy JWT. */ }
  return null;
}
