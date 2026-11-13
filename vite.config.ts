import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react(), {
    name: 'admin-preview-shell',
    configurePreviewServer(server) {
      // vite preview's SPA fallback ignores folder shells without a trailing
      // slash; use the noindex shell for admin deep links instead.
      server.middlewares.use((req, _res, next) => {
        const [pathname, query] = (req.url ?? '').split('?', 2);
        if (/^\/admin(?:\/(?:users|bios|categories|platforms|generators|content|analytics|security|settings))?$/.test(pathname)) {
          req.url = `${pathname}/${query ? `?${query}` : ''}`;
        }
        next();
      });
    },
  }],
  // Temporary diagnostics are only compiled into this branch's Vercel Preview.
  define: {
    __BIOCRAFT_PREVIEW_DIAGNOSTICS__: JSON.stringify(
      process.env.VERCEL_ENV === 'preview' &&
      process.env.VERCEL_GIT_COMMIT_REF === 'arena/5e351ec3-biocraft',
    ),
  },
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
