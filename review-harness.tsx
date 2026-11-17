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
import { downloadText } from './src/lib/download';
import { generatePersonalBios } from './src/tools/bio/lib/bioGenerator';
import { generateUsernames } from './src/tools/username/lib/usernameGenerator';
import { searchSymbols } from './src/tools/symbols/data/symbols';
import { generateHashtags } from './src/tools/hashtags/data/pools';
import { generateCaptions } from './src/tools/captions/data/pools';
import { generateHeadlines, generateSummaries } from './src/tools/linkedin/lib/linkedin';
import { composeMoodBoard } from './src/tools/shared/moodBoard';
import { STATUS_POOLS } from './src/tools/whatsapp-status/data/pools';
import { SNAP_POOLS } from './src/tools/snapchat-caption/data/pools';
import { UNICODE_STYLES } from './src/lib/unicodeStyles';

export { act, downloadText };

export function benchmarkGenerators(): Record<string, number> {
  const runs = 20;
  const measure = (operation: () => unknown) => {
    const start = performance.now();
    for (let i = 0; i < runs; i += 1) operation();
    return Number(((performance.now() - start) / runs).toFixed(3));
  };
  return {
    bio: measure(() => generatePersonalBios({ name: 'Asha', role: 'Creator', niche: 'travel', city: '' }, 'en', true)),
    stylishAndFancy: measure(() => UNICODE_STYLES.map((style) => style.transform('BioCraft sample 2026'))),
    username: measure(() => generateUsernames({ name: 'Asha Patel', keyword: 'travel' }, { vibe: 'aesthetic', maxLength: 12 })),
    symbolsSearch: measure(() => searchSymbols('heart', 'all')),
    hashtags: measure(() => generateHashtags('photography', 'en', 20, 'street food')),
    captions: measure(() => generateCaptions('photography', 'witty', 'en')),
    linkedinHeadline: measure(() => generateHeadlines({ role: 'Product Designer', focus: 'accessible products', years: '6' })),
    linkedinSummary: measure(() => generateSummaries({ role: 'Product Designer', focus: 'accessible products' })),
    whatsapp: measure(() => composeMoodBoard(STATUS_POOLS, 'good-morning', 'en', 5, false)),
    snapchat: measure(() => composeMoodBoard(SNAP_POOLS, 'streak', 'en', 5, false)),
  };
}

export async function mount(): Promise<void> {
  const container = document.getElementById('root');
  if (!container) throw new Error('missing #root');
  const root = createRoot(container);
  await act(async () => {
    root.render(<App />);
  });
}
