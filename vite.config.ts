import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
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
