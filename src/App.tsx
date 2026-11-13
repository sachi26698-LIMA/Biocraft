import { lazy, Suspense, useEffect } from 'react';
import { usePath } from './lib/router';
import Footer from './components/Footer';
import Header from './components/Header';
import ToolShell from './components/ToolShell';
import Toaster from './components/Toaster';
import { ToolkitProvider } from './lib/toolkit';

// Compiled only in the designated Vercel Preview branch. This is not an
// authorization boundary; no privileged backend is wired to this interface.
const PreviewAdmin = typeof __BIOCRAFT_PREVIEW_DIAGNOSTICS__ !== 'undefined' && __BIOCRAFT_PREVIEW_DIAGNOSTICS__
  ? lazy(() => import('./admin/AdminApp')) : null;

export default function App() {
  const path = usePath();
  // Honor an initial deep link like /?platform=linkedin#workspace.
  useEffect(() => {
    if (window.location.hash) {
      const target = document.getElementById(window.location.hash.slice(1));
      if (target) target.scrollIntoView({ block: 'start' });
    }
  }, []);

  if (PreviewAdmin && (path === '/admin' || path.startsWith('/admin/'))) {
    return <Suspense fallback={<main aria-busy="true">Loading workspace…</main>}><PreviewAdmin /></Suspense>;
  }

  return (
    <ToolkitProvider>
      <span id="top" />
      <Header />
      <main>
        <ToolShell />
      </main>
      <Footer />
      <Toaster />
    </ToolkitProvider>
  );
}
