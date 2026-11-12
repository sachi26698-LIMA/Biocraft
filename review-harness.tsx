/**
 * DEV-ONLY verification entry for esbuild bundling. Mounts <App /> into the
 * jsdom document prepared by review-check.cjs. NOT part of the shipped app.
 */
import { act } from 'react';
import { createRoot } from 'react-dom/client';
// jsdom has no ResizeObserver; the app uses it for the hero/platform measure.
if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
}
import App from './src/App';

export { act };

export async function mount(): Promise<void> {
  const container = document.getElementById('root');
  if (!container) throw new Error('missing #root');
  const root = createRoot(container);
  await act(async () => {
    root.render(<App />);
  });
}
