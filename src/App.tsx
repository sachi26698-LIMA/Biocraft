import { useEffect } from 'react';
import Footer from './components/Footer';
import Header from './components/Header';
import ToolShell from './components/ToolShell';
import Toaster from './components/Toaster';
import { ToolkitProvider } from './lib/toolkit';

export default function App() {
  // Honor an initial deep link like /?platform=linkedin#workspace.
  useEffect(() => {
    if (window.location.hash) {
      const target = document.getElementById(window.location.hash.slice(1));
      if (target) target.scrollIntoView({ block: 'start' });
    }
  }, []);

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
