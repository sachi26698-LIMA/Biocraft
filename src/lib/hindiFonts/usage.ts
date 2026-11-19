/**
 * Anonymous, device-local font usage.
 *
 * The original implementation posted beacons to `/api/fonts/usage`. BioCraft is
 * local-first, so the counter is a localStorage tally instead: no request, no
 * visitor identifier, nothing to leak. It still powers the "Popular" sort for
 * the person browsing, which is the only place the number is shown.
 *
 * `persisted` reports whether the tally could actually be written, so a UI never
 * claims a saved count it does not have.
 */

const USAGE_KEY = 'biocraft.hindiFonts.usage.v1';

export type UsageSnapshot = {
  updatedAt: string | null;
  fonts: Record<string, number>;
  surfaces: Record<string, number>;
  persisted: boolean;
};

const EMPTY: UsageSnapshot = { updatedAt: null, fonts: {}, surfaces: {}, persisted: true };

export function readFontUsage(): UsageSnapshot {
  if (typeof window === 'undefined') return { ...EMPTY, persisted: false };
  try {
    const raw = window.localStorage.getItem(USAGE_KEY);
    if (!raw) return { ...EMPTY };
    const parsed = JSON.parse(raw) as Partial<UsageSnapshot>;
    return {
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : null,
      fonts: parsed.fonts && typeof parsed.fonts === 'object' ? parsed.fonts : {},
      surfaces: parsed.surfaces && typeof parsed.surfaces === 'object' ? parsed.surfaces : {},
      persisted: true,
    };
  } catch {
    return { ...EMPTY, persisted: false };
  }
}

export function recordFontUsage(slug: string, surface: string): { persisted: boolean } {
  if (!/^[a-z0-9-]{1,80}$/.test(slug)) return { persisted: false };
  if (typeof window === 'undefined') return { persisted: false };
  const safeSurface = /^[a-z0-9-]{1,40}$/.test(surface) ? surface : 'unknown';
  const current = readFontUsage();
  const next: UsageSnapshot = {
    updatedAt: new Date().toISOString(),
    fonts: { ...current.fonts, [slug]: (current.fonts[slug] ?? 0) + 1 },
    surfaces: { ...current.surfaces, [safeSurface]: (current.surfaces[safeSurface] ?? 0) + 1 },
    persisted: true,
  };
  try {
    window.localStorage.setItem(USAGE_KEY, JSON.stringify(next));
    return { persisted: true };
  } catch {
    return { persisted: false };
  }
}

export function clearFontUsage(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(USAGE_KEY);
  } catch {
    // Ignore storage failures.
  }
}
