/**
 * Admin overlays — device-local drafts, not a database.
 *
 * The public catalogue is the committed JSON produced by the import pipeline.
 * An operator can re-label, re-tag or withhold a family for a review session;
 * those decisions live in `localStorage` (schema-versioned) and are exported as
 * a JSON overlay that the pipeline can apply at build time. Nothing is uploaded
 * and Supabase is never involved — the console says so plainly on screen.
 */

const OVERRIDES_KEY = 'biocraft.hindiFonts.overrides.v1';

export type FontAdminStatus = 'approved' | 'pending' | 'rejected';

export type FontOverride = {
  status?: FontAdminStatus;
  family?: string;
  category?: string;
  tags?: string[];
  note?: string;
  updatedAt?: string;
};

export type FontOverridesFile = {
  updatedAt: string | null;
  fonts: Record<string, FontOverride>;
};

export const EMPTY_OVERRIDES: FontOverridesFile = { updatedAt: null, fonts: {} };

const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('biocraft:font-overrides-change'));
  }
}

export function subscribeFontOverrides(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function readFontOverrides(): FontOverridesFile {
  if (typeof window === 'undefined') return EMPTY_OVERRIDES;
  try {
    const raw = window.localStorage.getItem(OVERRIDES_KEY);
    if (!raw) return EMPTY_OVERRIDES;
    const parsed = JSON.parse(raw) as FontOverridesFile;
    if (!parsed || typeof parsed !== 'object' || typeof parsed.fonts !== 'object') {
      return EMPTY_OVERRIDES;
    }
    return { updatedAt: parsed.updatedAt ?? null, fonts: parsed.fonts };
  } catch {
    return EMPTY_OVERRIDES;
  }
}

function write(next: FontOverridesFile) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(OVERRIDES_KEY, JSON.stringify(next));
  } catch {
    // Private mode or a full quota: the review session is simply not persisted.
  }
  emit();
}

export function saveFontOverride(slug: string, override: FontOverride): FontOverridesFile {
  const current = readFontOverrides();
  const next: FontOverridesFile = {
    updatedAt: new Date().toISOString(),
    fonts: { ...current.fonts, [slug]: { ...current.fonts[slug], ...override } },
  };
  write(next);
  return next;
}

export function clearFontOverride(slug: string): FontOverridesFile {
  const current = readFontOverrides();
  const fonts = { ...current.fonts };
  delete fonts[slug];
  const next: FontOverridesFile = { updatedAt: new Date().toISOString(), fonts };
  write(next);
  return next;
}

export function resetFontOverrides(): FontOverridesFile {
  write({ updatedAt: new Date().toISOString(), fonts: {} });
  return readFontOverrides();
}
