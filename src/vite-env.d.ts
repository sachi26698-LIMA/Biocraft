/**
 * Minimal environment typing for the BioCraft static build.
 * Only the publishable Supabase pair is consumed; both are optional —
 * without them the site renders fully from the bundled registry.
 */
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
