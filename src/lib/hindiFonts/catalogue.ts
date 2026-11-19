/**
 * BioCraft Hindi font catalogue — local-first.
 *
 * The whole index is the committed JSON produced by `scripts/fonts/build-catalogue.mjs`
 * from real imported WOFF2 files plus the HarfBuzz verification report. Nothing
 * here reads the network, the filesystem, or Supabase: a public page can search,
 * paginate, filter and render every family with the database switched off.
 *
 * Only Admin overlays (approval state, edited labels) are device-local drafts
 * stored in localStorage — see `overrides.ts`. The committed catalogue remains
 * the single public source of truth until a change is rebuilt by the pipeline.
 */
import catalogueJson from '../../data/hindi-fonts/catalogue.json';
import importReportJson from '../../data/hindi-fonts/import-report.json';
import licensesJson from '../../data/hindi-fonts/licenses.json';
import type {
  FontCatalogue,
  FontFacet,
  FontLicenseIndexEntry,
  FontListPage,
  FontListQuery,
  FontRecord,
  FontSort,
  RejectedFont,
} from './types';
import { matchesQuery, normalizeQuery } from './search';
import { readFontOverrides, type FontOverride } from './overrides';
import { readFontUsage } from './usage';

export const catalogue = catalogueJson as unknown as FontCatalogue;

export type ValidationReportFamily = {
  family: string;
  slug: string;
  status: 'verified' | 'rejected';
  score?: number;
  errors: string[];
  warnings: string[];
  coverage?: Record<string, { required: number; present: number; percent: number }>;
  conjuncts?: { text: string; singleGlyph: boolean; ok: boolean }[];
  nukta?: { text: string; ok: boolean; decomposedOk?: boolean }[];
  matras?: { text: string; ok: boolean }[];
  latin?: { required: number; present: number; percent: number };
  files?: { path: string; weight: number | null; bytes: number; glyphs: number }[];
};

export type ValidationReport = {
  generatedAt: string;
  verifier: {
    engine: string;
    fontTools: string;
    sampleText: string;
    checks: string[];
  };
  families: Record<string, ValidationReportFamily>;
  totals: {
    discovered: number;
    verified: number;
    rejected: number;
    scannedFiles: number;
    fontFamiliesWithDevanagari: number;
  };
};

export type ImportReport = {
  generatedAt: string;
  summary: FontCatalogue['stats'];
  imported: {
    family: string;
    slug: string;
    files: number;
    bytes: number;
    verified: boolean;
    score: number;
  }[];
  rejected: RejectedFont[];
};

export type LicenseIndex = {
  generatedAt: string;
  licenses: FontLicenseIndexEntry[];
};

/** Hash used only to tie a pagination cursor to the query it was issued for. */
function queryKey(
  query: Required<Pick<FontListQuery, 'q' | 'category' | 'tag' | 'sort'>>,
): string {
  const value = `${query.q}|${query.category}|${query.tag}|${query.sort}`;
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

/**
 * UTF-8 safe base64url without Node's Buffer. `btoa` only accepts Latin-1, so the
 * payload is percent-escaped first; the cursor contains only digits and a short
 * lowercase base-36 key, but escaping keeps this correct if that ever changes.
 */
function encodeBase64Url(value: string): string {
  if (typeof btoa === 'function') {
    return btoa(unescape(encodeURIComponent(value)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }
  // Node (tests, SSR pre-render) — no DOM dependency on the public path.
  return Buffer.from(value, 'utf8').toString('base64url');
}

function decodeBase64Url(value: string): string {
  if (typeof atob === 'function') {
    const normalised = value.replace(/-/g, '+').replace(/_/g, '/');
    return decodeURIComponent(escape(atob(normalised)));
  }
  return Buffer.from(value, 'base64url').toString('utf8');
}

export function encodeCursor(offset: number, key: string): string {
  return encodeBase64Url(JSON.stringify([offset, key]));
}

export function decodeCursor(
  cursor: string | null | undefined,
  key: string,
): { offset: number } | { error: 'invalid' | 'stale' } {
  if (!cursor) return { offset: 0 };
  try {
    const parsed = JSON.parse(decodeBase64Url(cursor));
    if (!Array.isArray(parsed) || typeof parsed[0] !== 'number') {
      return { error: 'invalid' };
    }
    if (parsed[1] !== key) return { error: 'stale' };
    return { offset: Math.max(0, Math.floor(parsed[0])) };
  } catch {
    return { error: 'invalid' };
  }
}

function applyOverride(record: FontRecord, override: FontOverride | undefined): FontRecord {
  if (!override) return record;
  const next: FontRecord = { ...record };
  if (override.family?.trim()) next.family = override.family.trim();
  if (override.category && override.category !== record.category) {
    next.category = override.category;
    next.categorySlug = override.category.toLowerCase().replace(/\s+/g, '-');
    next.tags = [...new Set([override.category, ...record.styleTags])];
  }
  if (override.tags?.length) {
    next.styleTags = [...override.tags];
    next.tags = [...new Set([next.category, ...override.tags])];
  }
  return next;
}

function isPubliclyVisible(override: FontOverride | undefined): boolean {
  return !override?.status || override.status === 'approved';
}

function activeOverrides(): Record<string, FontOverride> {
  return readFontOverrides().fonts;
}

export class FontCursorError extends Error {
  constructor(public readonly reason: 'invalid' | 'stale') {
    super(
      reason === 'stale'
        ? 'This font page cursor belongs to a different search. Start from the first page.'
        : 'Invalid font page cursor.',
    );
    this.name = 'FontCursorError';
  }
}

export function listFonts(query: FontListQuery = {}): FontListPage {
  const q = normalizeQuery(query.q ?? '');
  const category = (query.category ?? '').trim();
  const tag = (query.tag ?? '').trim();
  const sort: FontSort = query.sort ?? 'name';
  const limit = Math.min(48, Math.max(1, Math.floor(query.limit ?? 12)));
  const key = queryKey({ q, category, tag, sort });
  const decoded = decodeCursor(query.cursor, key);
  if ('error' in decoded) {
    throw new FontCursorError(decoded.error);
  }

  const overrides = activeOverrides();
  const usage = readFontUsage();
  const merged = catalogue.fonts
    .map((record) => applyOverride(record, overrides[record.slug]))
    .filter((record) => isPubliclyVisible(overrides[record.slug]))
    .filter((record) => {
      if (category && record.category !== category) return false;
      if (category === 'Variable' && !record.variable) return false;
      if (tag && !record.styleTags.includes(tag) && record.category !== tag) {
        return false;
      }
      return true;
    });

  const filtered = q
    ? merged.filter((record) =>
        matchesQuery(
          {
            family: record.family,
            tags: record.styleTags,
            category: record.category,
            description: record.description,
            source: `${record.source.provider} ${record.source.distributor}`,
          },
          q,
        ),
      )
    : merged;

  const sorted = [...filtered].sort((a, b) => {
    switch (sort) {
      case 'name-desc':
        return b.family.localeCompare(a.family);
      case 'recent':
        return (
          (b.updatedAt ?? '').localeCompare(a.updatedAt ?? '') || a.family.localeCompare(b.family)
        );
      case 'weight':
        return a.weightRange[0] - b.weightRange[0] || a.family.localeCompare(b.family);
      case 'popular':
        return (
          (usage.fonts[b.slug] ?? 0) - (usage.fonts[a.slug] ?? 0) ||
          (b.featuredRank >= 0 ? 1 : 0) - (a.featuredRank >= 0 ? 1 : 0) ||
          a.featuredRank - b.featuredRank ||
          a.family.localeCompare(b.family)
        );
      case 'name':
      default:
        return a.family.localeCompare(b.family);
    }
  });

  const offset = 'offset' in decoded ? decoded.offset : 0;
  const items = sorted.slice(offset, offset + limit);
  const nextOffset = offset + items.length;
  return {
    items,
    nextCursor: nextOffset < sorted.length ? encodeCursor(nextOffset, key) : null,
    total: sorted.length,
    query: { q, category, tag, sort, limit },
  };
}

export function getFont(slug: string): FontRecord | null {
  const overrides = activeOverrides();
  const record = catalogue.fonts.find((font) => font.slug === slug);
  if (!record || !isPubliclyVisible(overrides[slug])) return null;
  return applyOverride(record, overrides[slug]);
}

/** Catalogue lookup that ignores Admin drafts — used by the admin screens. */
export function getFontUnfiltered(slug: string): FontRecord | null {
  return catalogue.fonts.find((font) => font.slug === slug) ?? null;
}

export function featuredFonts(limit = 6): FontRecord[] {
  const overrides = activeOverrides();
  return catalogue.fonts
    .filter((font) => font.featured && isPubliclyVisible(overrides[font.slug]))
    .sort((a, b) => a.featuredRank - b.featuredRank)
    .slice(0, limit)
    .map((font) => applyOverride(font, overrides[font.slug]));
}

/** Families by slug, preserving the caller's order (favourites, recents). */
export function fontsBySlug(slugs: string[]): FontRecord[] {
  if (!slugs.length) return [];
  const overrides = activeOverrides();
  const bySlug = new Map<string, FontRecord>();
  for (const font of catalogue.fonts) {
    if (isPubliclyVisible(overrides[font.slug])) {
      bySlug.set(font.slug, applyOverride(font, overrides[font.slug]));
    }
  }
  return slugs
    .map((slug) => bySlug.get(slug))
    .filter((font): font is FontRecord => Boolean(font));
}

export type FontFilterFacets = {
  categories: FontFacet[];
  tags: FontFacet[];
  total: number;
  stats: FontCatalogue['stats'];
};

export function fontFacets(): FontFilterFacets {
  const overrides = activeOverrides();
  const visible = catalogue.fonts.filter((font) => isPubliclyVisible(overrides[font.slug]));
  const categories = new Map<string, number>();
  const tags = new Map<string, number>();
  for (const font of visible) {
    categories.set(font.category, (categories.get(font.category) ?? 0) + 1);
    for (const tag of font.styleTags) {
      tags.set(tag, (tags.get(tag) ?? 0) + 1);
    }
  }
  const sortFacet = (a: FontFacet, b: FontFacet) =>
    b.count - a.count || a.name.localeCompare(b.name);
  return {
    categories: [...categories.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort(sortFacet),
    tags: [...tags.entries()].map(([name, count]) => ({ name, count })).sort(sortFacet),
    total: visible.length,
    stats: { ...catalogue.stats, verified: visible.length },
  };
}

export function sampleText(): string {
  return catalogue.sampleText;
}

export function readImportReport(): ImportReport {
  return importReportJson as unknown as ImportReport;
}

export function readLicenses(): LicenseIndex {
  return licensesJson as unknown as LicenseIndex;
}

export type DuplicateGroup = {
  kind: 'family' | 'binary';
  key: string;
  fonts: { slug: string; family: string }[];
};

/** Conservative duplicate detection: identical normalised family names or
 * identical concatenated file hashes. Visually similar siblings such as
 * "Tiro Devanagari Hindi" and "Tiro Devanagari Marathi" are NOT duplicates. */
export function detectDuplicates(): DuplicateGroup[] {
  const groups: DuplicateGroup[] = [];
  const byFamily = new Map<string, FontRecord[]>();
  const byHash = new Map<string, FontRecord[]>();
  for (const font of catalogue.fonts) {
    const familyKey = font.family.toLowerCase().replace(/\s+/g, ' ').trim();
    byFamily.set(familyKey, [...(byFamily.get(familyKey) ?? []), font]);
    byHash.set(font.filesSha256, [...(byHash.get(font.filesSha256) ?? []), font]);
  }
  for (const [key, fonts] of byFamily) {
    if (fonts.length > 1) {
      groups.push({
        kind: 'family',
        key,
        fonts: fonts.map((font) => ({ slug: font.slug, family: font.family })),
      });
    }
  }
  for (const [key, fonts] of byHash) {
    if (fonts.length > 1) {
      groups.push({
        kind: 'binary',
        key,
        fonts: fonts.map((font) => ({ slug: font.slug, family: font.family })),
      });
    }
  }
  return groups;
}

export function fontFileForWeight(
  font: FontRecord,
  weight: number,
): { devanagari: FontRecord['primaryFile']; latin: FontRecord['latinFile'] } {
  const variable = font.files.devanagari.find((file) => file.weight === null);
  if (variable) {
    return {
      devanagari: variable,
      latin: font.files.latin.find((file) => file.weight === null) ?? font.latinFile,
    };
  }
  const available = font.files.devanagari
    .map((file) => file.weight)
    .filter((value): value is number => typeof value === 'number')
    .sort((a, b) => a - b);
  const closest = available.length
    ? available.reduce((best, candidate) =>
        Math.abs(candidate - weight) < Math.abs(best - weight) ? candidate : best,
      )
    : 400;
  const devanagari = font.files.devanagari.find((file) => file.weight === closest) ?? font.primaryFile;
  const latin = font.files.latin.find((file) => file.weight === closest) ?? font.latinFile;
  return { devanagari, latin };
}

export function clampWeight(font: FontRecord, weight: number): number {
  const [min, max] = font.weightRange;
  if (!Number.isFinite(weight)) return 400;
  return Math.min(max, Math.max(min, Math.round(weight)));
}
