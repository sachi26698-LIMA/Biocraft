/**
 * BioCraft — optional Supabase client (database-only phase).
 *
 * Guest-first: no auth, no sessions, no sign-up. The client reads active
 * content through Row-Level-Security read-only policies. When the two
 * environment variables below are absent, the whole site runs exactly as
 * before from the bundled registry — nothing else changes.
 *
 * Only the publishable (anon) key may ever appear here. The service_role
 * key must never reach the browser.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const metaEnv: ImportMetaEnv | undefined =
  typeof import.meta !== 'undefined' ? import.meta.env : undefined;
const url = metaEnv?.VITE_SUPABASE_URL?.trim();
const publishableKey = metaEnv?.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();

export const isSupabaseConfigured: boolean = Boolean(url && publishableKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, publishableKey as string, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
      global: {
        headers: { 'x-client-info': 'biocraft-web' },
      },
    })
  : null;
