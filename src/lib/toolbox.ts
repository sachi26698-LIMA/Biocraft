/**
 * Small client-side stores: favourite tools + recently used tools.
 * Persisted in localStorage (key `biocraft:favs` / `biocraft:recent`); no
 * accounts, no analytics — the data never leaves the browser.
 */
import { useSyncExternalStore } from 'react';

const FAV_KEY = 'biocraft:favs';
const RECENT_KEY = 'biocraft:recent';
const MAX_RECENT = 6;

let favs = new Set<string>();
let recent: string[] = [];
let hydrated = false;
const listeners = new Set<() => void>();

function readStore<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function hydrate() {
  if (hydrated || typeof window === 'undefined') return;
  hydrated = true;
  favs = new Set(readStore<string[]>(FAV_KEY, []));
  recent = readStore<string[]>(RECENT_KEY, []).filter((item) => typeof item === 'string').slice(0, MAX_RECENT);
}

function persist(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable (private mode) — keep in-memory only */
  }
}

function emit() {
  for (const listener of listeners) listener();
}

hydrate();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useFavourites() {
  const snapshot = useSyncExternalStore(subscribe, () => {
    hydrate();
    return [...favs].sort().join(',');
  });
  const favList = snapshot ? snapshot.split(',') : [];
  return {
    favs: new Set(favList),
    isFav: (key: string) => favs.has(key),
    toggle: (key: string) => {
      hydrate();
      if (favs.has(key)) favs.delete(key);
      else favs.add(key);
      persist(FAV_KEY, [...favs]);
      emit();
    },
    count: favList.length,
  };
}

export function useRecentlyUsed() {
  const snapshot = useSyncExternalStore(subscribe, () => {
    hydrate();
    return recent.join(',');
  });
  return {
    recent: snapshot ? snapshot.split(',') : [],
    record: (key: string) => {
      hydrate();
      recent = [key, ...recent.filter((item) => item !== key)].slice(0, MAX_RECENT);
      persist(RECENT_KEY, recent);
      emit();
    },
  };
}
