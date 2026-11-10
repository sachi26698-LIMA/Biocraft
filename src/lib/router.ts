import { useSyncExternalStore } from 'react';

/**
 * Minimal History-API router. Zero dependencies.
 *
 * Routes are static paths (e.g. "/fancy-font-generator"). The production build
 * emits a static HTML shell per route (scripts/build-shells.mjs), so deep links
 * work on any static host without rewrite rules. "/" always means the homepage.
 *
 * The platform selection travels in the query string (?platform=linkedin) and
 * survives tool navigation because the toolkit context is kept alive.
 */

interface UrlParts {
  path: string;
  search: string;
  hash: string;
}

const parse = (to: string): UrlParts => {
  const hashIndex = to.indexOf('#');
  const pathAndSearch = hashIndex === -1 ? to : to.slice(0, hashIndex);
  const hash = hashIndex === -1 ? '' : to.slice(hashIndex);
  const searchIndex = pathAndSearch.indexOf('?');
  let path = searchIndex === -1 ? pathAndSearch : pathAndSearch.slice(0, searchIndex);
  const search = searchIndex === -1 ? '' : pathAndSearch.slice(searchIndex);
  if (!path.startsWith('/')) path = `/${path}`;
  if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
  return { path: path || '/', search, hash };
};

const isBrowser = typeof window !== 'undefined';

const readLocation = (): UrlParts => {
  if (!isBrowser) return { path: '/', search: '', hash: '' };
  const current = parse(window.location.pathname + window.location.search + window.location.hash);
  return current;
};

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((listener) => listener());
const searchListeners = new Set<() => void>();
const notifySearch = () => {
  searchListeners.forEach((listener) => listener());
  if (isBrowser) window.dispatchEvent(new window.CustomEvent('biocraft:search'));
};

let currentParts: UrlParts = readLocation();

export function getPath(): string {
  return currentParts.path;
}

export function getSearch(): string {
  return currentParts.search;
}

const scrollToTarget = (hash: string) => {
  if (!isBrowser) return;
  if (hash) {
    const target = document.getElementById(hash.slice(1));
    if (target) {
      target.scrollIntoView({ block: 'start' });
      return;
    }
  }
  window.scrollTo(0, 0);
};

export function navigate(to: string, options: { replace?: boolean } = {}): void {
  if (!isBrowser) return;
  const next = parse(to);
  const url = next.path + next.search + next.hash;
  const sameUrl =
    next.path === currentParts.path &&
    next.search === currentParts.search &&
    url === window.location.pathname + window.location.search + window.location.hash;

  if (sameUrl) {
    scrollToTarget(next.hash);
    return;
  }

  if (options.replace) {
    window.history.replaceState(null, '', url);
  } else {
    window.history.pushState(null, '', url);
  }
  const searchChanged = next.search !== currentParts.search;
  currentParts = next;
  notify();
  if (searchChanged) notifySearch();
  scrollToTarget(next.hash);
  const panel = document.getElementById('tool-panel');
  if (panel) panel.focus({ preventScroll: true });
}

export function usePath(): string {
  return useSyncExternalStore(
    (callback) => {
      listeners.add(callback);
      return () => {
        listeners.delete(callback);
      };
    },
    () => currentParts.path,
    () => '/',
  );
}

export function useSearch(): string {
  return useSyncExternalStore(
    (callback) => {
      searchListeners.add(callback);
      return () => {
        searchListeners.delete(callback);
      };
    },
    () => currentParts.search,
    () => '',
  );
}

if (isBrowser) {
  window.addEventListener('popstate', () => {
    const previousSearch = currentParts.search;
    currentParts = readLocation();
    notify();
    if (currentParts.search !== previousSearch) notifySearch();
    scrollToTarget(currentParts.hash);
  });
}

/**
 * Intercepts plain <a href> clicks for in-app navigation. Returns true when the
 * click was handled client-side (so the caller can skip its own handling).
 */
export function handleAnchorClick(event: React.MouseEvent<HTMLAnchorElement>): boolean {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return false;
  }
  const href = event.currentTarget.getAttribute('href');
  if (!href || !href.startsWith('/')) return false;
  event.preventDefault();
  navigate(href);
  return true;
}
