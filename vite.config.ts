import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const PREVIEW_BRANCHES = new Set([
  'arena/5e351ec3-biocraft',
  'arena/805e3bf3-biocraft',
]);
// The console is emitted when an operator turns it on for the scope being built.
// Production is opt-in through BIOCRAFT_ADMIN_PRODUCTION so a normal public
// deploy can never grow an Admin entry by accident, while the branch Preview
// keeps working as before.
const adminPreview =
  process.env.BIOCRAFT_ADMIN_PREVIEW === 'true' ||
  (process.env.VERCEL_ENV === 'preview' &&
    PREVIEW_BRANCHES.has(process.env.VERCEL_GIT_COMMIT_REF ?? '')) ||
  (process.env.VERCEL_ENV === 'production' &&
    process.env.BIOCRAFT_ADMIN_PRODUCTION === 'true');

export default defineConfig({
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
  // Temporary diagnostics are only compiled into this branch's Vercel Preview.
  define: {
    __BIOCRAFT_PREVIEW_DIAGNOSTICS__: JSON.stringify(
      adminPreview,
    ),
  },
  // Emit an independent admin entry only for this branch's Preview; the
  // public entry never imports the admin workspace.
  build: adminPreview ? { rollupOptions: { input: { main: 'index.html', admin: 'admin-preview.html' } } } : undefined,
  server: {
    host: true,
    port: 5173,
    // The sandboxed preview proxy serves the dev server through a host-specific
    // subdomain; allowing any host keeps the live preview working.
    allowedHosts: true,
  },
  preview: {
    host: true,
    port: 4173,
    allowedHosts: true,
  },
});
