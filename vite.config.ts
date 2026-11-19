import { defineConfig, loadEnv } from 'vite';
import { localApiProxy } from './shared/local-proxy.mjs';
import { publicSupabaseConfig } from './shared/supabase-config.mjs';
import react from '@vitejs/plugin-react';

// The Admin console is emitted into whichever scope has been explicitly enabled.
//
// This used to be a hardcoded set of two branch names, which meant every new work
// branch produced a Preview with no Admin entry at all: /admin served a shell that
// referenced a chunk that was never built, i.e. a blank page with a 404. A branch
// list is a trap the next branch always falls into, so the decision is now a flag
// per scope and nothing else.
//
//   BIOCRAFT_ADMIN_ENABLED=true  -> build the console in preview AND production
//   BIOCRAFT_ADMIN_PRODUCTION=true -> production only (kept for compatibility)
//   BIOCRAFT_ADMIN_PREVIEW=true  -> preview only (kept for local work)
//
// With no flag set nothing is built, so a plain public deploy can never grow an
// Admin entry by accident.
const envFlag = name => process.env[name] === 'true';
const adminInPreview = envFlag('BIOCRAFT_ADMIN_ENABLED') || envFlag('BIOCRAFT_ADMIN_PREVIEW');
const adminInProduction =
  envFlag('BIOCRAFT_ADMIN_ENABLED') || envFlag('BIOCRAFT_ADMIN_PRODUCTION');
// Local builds (no VERCEL_ENV) follow the preview flag so `npm run build` can be
// exercised without pretending to be Vercel.
const adminPreview =
  (process.env.VERCEL_ENV === 'production' ? adminInProduction : adminInPreview);

export default defineConfig(({ mode, command }) => {
  // Only the local dev/preview process knows the API's loopback address. A
  // deployed bundle always uses /api on its own origin (see vercel.json).
  const localProxy = command === 'serve' && envFlag('BIOCRAFT_LOCAL_API') ? localApiProxy() : undefined;
  // Match only the exact private preview host for a connected dev stack; IP
  // literals and localhost remain accepted by Vite. A separate HTTPS reverse
  // proxy can supply its public hostname here without loading any API secrets.
  const sandboxId=process.env.E2B_SANDBOX_ID;
  const allowedHosts=localProxy ? [process.env.BIOCRAFT_DEV_WEB_HOST,
    /^[a-z0-9-]+$/.test(sandboxId || '') ? `5173-${sandboxId}.e2b.app` : undefined].filter(Boolean) : true;
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const key = env.VITE_SUPABASE_PUBLISHABLE_KEY;
  // Public pages use only the bundled catalogue. Legacy optional settings and
  // Admin's public provider key must still be scoped to the correct project.
  const url = env.VITE_SUPABASE_URL;
  if ((url !== undefined || key) && !publicSupabaseConfig(url, key)) {
    throw new Error('Use a publishable or matching anon key for the BioCraft project. Omit both public Supabase variables for a bundled-only build.');
  }
  // Vite exposes every VITE_ variable; reject unexpected Supabase variables
  // before producing any client asset, including a mistakenly prefixed secret.
  if (Object.keys(env).some(name => name.startsWith('VITE_SUPABASE_') && !['VITE_SUPABASE_URL', 'VITE_SUPABASE_PUBLISHABLE_KEY'].includes(name))) {
    throw new Error('Unexpected VITE_SUPABASE_* variable. Only the URL and publishable key belong in public configuration.');
  }
  return {
  envPrefix: ['VITE_SUPABASE_URL', 'VITE_SUPABASE_PUBLISHABLE_KEY', 'VITE_GENERATION_MAX_PER_REQUEST', 'VITE_CONTENT_PAGE_SIZE', 'VITE_SEARCH_PAGE_SIZE', 'VITE_SEARCH_MAX_PAGE_SIZE'],
  plugins: [react(), {
    name: 'admin-preview-shell',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const [pathname, query] = (req.url ?? '').split('?', 2);
        if (/^\/admin(?:\/.*)?$/.test(pathname) && !pathname.endsWith('.html')) {
          req.url = `/admin-preview.html${query ? `?${query}` : ''}`;
        }
        next();
      });
    },
    configurePreviewServer(server) {
      // vite preview's SPA fallback ignores folder shells without a trailing
      // slash; use the noindex shell for admin deep links instead.
      server.middlewares.use((req, _res, next) => {
        const [pathname, query] = (req.url ?? '').split('?', 2);
        if (/^\/admin(?:\/.*)?$/.test(pathname) && !pathname.endsWith('.html')) {
          // Keep the browser URL intact while serving the dedicated noindex
          // document for known and unknown admin deep links.
          req.url = `/admin/${query ? `?${query}` : ''}`;
        }
        next();
      });
    },
  }],
  // Emit the independent Admin entry only in explicitly enabled scopes.
  build: adminPreview ? { rollupOptions: { input: { main: 'index.html', admin: 'admin-preview.html' } } } : undefined,
  server: {
    proxy: localProxy,
    cors: localProxy ? false : undefined,
    host: true,
    port: 5173,
    allowedHosts,
  },
  preview: {
    proxy: localProxy,
    cors: localProxy ? false : undefined,
    host: true,
    port: 4173,
    allowedHosts,
  },
  };
});
