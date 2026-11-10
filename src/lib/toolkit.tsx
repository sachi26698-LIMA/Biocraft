/**
 * Toolkit-wide client state: the active platform and the active tool.
 * Synced to the URL search (?platform=linkedin&tool=... no — tool comes from
 * the path; only the platform rides in the query string). Plain anchors keep
 * the platform across tool navigation because the context survives in-app.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { usePath } from './router';
import { PLATFORMS, type PlatformId } from '../tools/platforms';

export interface ToolkitContextValue {
  platform: PlatformId;
  setPlatform: (platform: PlatformId) => void;
}

const ToolkitContext = createContext<ToolkitContextValue | null>(null);

const isPlatformId = (value: string | null): value is PlatformId =>
  Boolean(value) && PLATFORMS.some((platform) => platform.id === value);

const platformFromSearch = (search: string): PlatformId | null => {
  const value = new URLSearchParams(search).get('platform');
  return isPlatformId(value) ? value : null;
};

export function ToolkitProvider({ children }: { children: ReactNode }) {
  const path = usePath();
  const [platform, setPlatformState] = useState<PlatformId>(() => {
    if (typeof window === 'undefined') return 'instagram';
    return platformFromSearch(window.location.search) ?? 'instagram';
  });

  // Honor ?platform=<id> when navigation introduces/removes it (footer links,
  // deep links). Runs on path changes and on popstate via router notify.
  useEffect(() => {
    const apply = () => {
      const fromQuery = platformFromSearch(window.location.search);
      if (fromQuery && fromQuery !== platform) setPlatformState(fromQuery);
    };
    apply();
    window.addEventListener('biocraft:search', apply);
    window.addEventListener('popstate', apply);
    return () => {
      window.removeEventListener('biocraft:search', apply);
      window.removeEventListener('popstate', apply);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  const setPlatform = useCallback((next: PlatformId) => {
    setPlatformState(next);
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    url.searchParams.set('platform', next);
    window.history.replaceState(null, '', url.pathname + url.search + url.hash);
    window.dispatchEvent(new window.CustomEvent('biocraft:search'));
  }, []);

  const value = useMemo(() => ({ platform, setPlatform }), [platform, setPlatform]);
  return <ToolkitContext.Provider value={value}>{children}</ToolkitContext.Provider>;
}

export function useToolkit(): ToolkitContextValue {
  const ctx = useContext(ToolkitContext);
  if (!ctx) throw new Error('useToolkit must be used inside <ToolkitProvider>');
  return ctx;
}
