/**
 * Small client-side stores: favourite tools + recently used tools.
 * Persisted in localStorage (key `biocraft:favs` / `biocraft:recent`); no
 * accounts, no analytics — the data never leaves the browser.
 */
import { useMemo, useSyncExternalStore } from 'react';

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

/* ========== Symbol favourites + recently used (biocraft:symbol-favs / -recents) ========== */

const SYMBOL_FAV_KEY = 'biocraft:symbol-favs';
const SYMBOL_RECENT_KEY = 'biocraft:symbol-recents';
const MAX_SYMBOL_RECENTS = 18;

let symbolFavs = new Set<string>();
let symbolRecents: string[] = [];
let symbolHydrated = false;
const symbolListeners = new Set<() => void>();

function hydrateSymbols() {
  if (symbolHydrated || typeof window === 'undefined') return;
  symbolHydrated = true;
  symbolFavs = new Set(readStore<string[]>(SYMBOL_FAV_KEY, []));
  symbolRecents = readStore<string[]>(SYMBOL_RECENT_KEY, [])
    .filter((item) => typeof item === 'string')
    .slice(0, MAX_SYMBOL_RECENTS);
}

function emitSymbols() {
  for (const listener of symbolListeners) listener();
}

hydrateSymbols();

function subscribeSymbols(listener: () => void) {
  symbolListeners.add(listener);
  return () => {
    symbolListeners.delete(listener);
  };
}

function toggleSymbolFavourite(glyph: string) {
  hydrateSymbols();
  if (symbolFavs.has(glyph)) symbolFavs.delete(glyph);
  else symbolFavs.add(glyph);
  persist(SYMBOL_FAV_KEY, [...symbolFavs]);
  emitSymbols();
}

function recordSymbol(glyph: string) {
  hydrateSymbols();
  symbolRecents = [glyph, ...symbolRecents.filter((item) => item !== glyph)].slice(0, MAX_SYMBOL_RECENTS);
  persist(SYMBOL_RECENT_KEY, symbolRecents);
  emitSymbols();
}

/** Favourite glyphs — the glyph itself is the key (stable across sessions). */
export function useSymbolFavourites() {
  const snapshot = useSyncExternalStore(subscribeSymbols, () => {
    hydrateSymbols();
    return [...symbolFavs].sort().join('\u0001');
  });
  const favSet = useMemo(() => new Set(snapshot ? snapshot.split('\u0001') : []), [snapshot]);
  return {
    favs: favSet,
    isFav: (glyph: string) => favSet.has(glyph),
    toggle: toggleSymbolFavourite,
    count: favSet.size,
  };
}

/** Recently used glyphs, most recent first, capped at 18. */
export function useSymbolRecents() {
  const snapshot = useSyncExternalStore(subscribeSymbols, () => {
    hydrateSymbols();
    return symbolRecents.join('\u0001');
  });
  return {
    recents: snapshot ? snapshot.split('\u0001') : [],
    record: recordSymbol,
  };
}
