/**
 * BioCraft — library read API (browser side), served entirely from the bundle.
 *
 * This used to call three database functions (`library_facets`, `font_page`,
 * `language_coverage`). The font catalogue is now generated from the same
 * MIT-licensed `google-font-metadata` package that seeded the database, so the
 * page needs no backend and works with the database unreachable or unconfigured.
 *
 * The outcome type is retained so callers keep their existing error handling, but
 * a *local* read cannot fail on a network error — `ok: true` is the normal path.
 */
import { FONT_CATALOG, type FontRecord } from './fontCatalog';

export type LibraryOutcome<T> =
  | { ok: true; rows: T[] }
  | { ok: false; reason: 'not-configured' | 'unavailable' | 'error'; message: string };

/** Public row shape, unchanged so the font page did not need rewriting. */
export interface FontRow {
  slug: string;
  name: string;
  family: string;
  category: string | null;
  subsets: string[] | null;
  weights: string[] | null;
  styles: string[] | null;
  variable: boolean;
  next_cursor: string;
}

export interface FacetRow {
  domain: string;
  total: number | string;
}

export interface LanguageCoverageRow {
  code: string;
  name_en: string;
  name_native: string;
  direction: string;
  content_count: number | string;
}

export const FONT_CATEGORIES = ['sans-serif', 'serif', 'display', 'handwriting', 'monospace'] as const;

export const FONT_CATEGORY_LABELS: Record<string, string> = {
  'sans-serif': 'Sans serif',
  serif: 'Serif',
  display: 'Display',
  handwriting: 'Handwriting',
  monospace: 'Monospace',
};

/** Adapt the bundled record to the row shape the page consumes. */
function toRow(font: FontRecord): FontRow {
  return {
    slug: font.slug,
    name: font.family,
    family: font.family,
    category: font.category,
    subsets: [...font.subsets],
    weights: [...font.weights],
    styles: ['normal'],
    variable: font.variable,
    // The cursor is the slug: the catalogue is sorted by it, so it is a stable,
    // resumable position without needing a server-side keyset.
    next_cursor: font.slug,
  };
}

/**
 * One page of the catalogue.
 *
 * Filtering and paging happen in memory over an array that is already shipped, so
 * there is no request to debounce and no partial-page ambiguity. The signature is
 * kept identical to the database version to avoid touching the caller.
 */
export async function fetchFontPage(options: {
  category?: string | null;
  search?: string | null;
  cursor?: string | null;
  limit?: number;
}): Promise<LibraryOutcome<FontRow>> {
  const limit = Math.max(1, Math.min(options.limit ?? 48, 200));
  const needle = (options.search ?? '').trim().toLowerCase();

  let rows = FONT_CATALOG as readonly FontRecord[];
  if (options.category) rows = rows.filter((f) => f.category === options.category);
  if (needle) rows = rows.filter((f) => f.family.toLowerCase().includes(needle));
  if (options.cursor) {
    const after = options.cursor;
    rows = rows.filter((f) => f.slug > after);
  }

  return { ok: true, rows: rows.slice(0, limit).map(toRow) };
}

/** Real totals per domain, computed from bundled data rather than the database. */
export async function fetchFacets(): Promise<LibraryOutcome<FacetRow>> {
  const byCategory = new Map<string, number>();
  for (const font of FONT_CATALOG) {
    const key = font.category ?? 'other';
    byCategory.set(key, (byCategory.get(key) ?? 0) + 1);
  }
  const rows: FacetRow[] = [...byCategory.entries()]
    .map(([domain, total]) => ({ domain, total }))
    .sort((a, b) => Number(b.total) - Number(a.total));
  return { ok: true, rows };
}

/**
 * Language coverage of the bundled catalogue: how many families support each
 * script. Derived from the real `subsets` field of every family.
 */
export async function fetchLanguageCoverage(): Promise<LibraryOutcome<LanguageCoverageRow>> {
  const counts = new Map<string, number>();
  for (const font of FONT_CATALOG) {
    for (const subset of font.subsets) counts.set(subset, (counts.get(subset) ?? 0) + 1);
  }
  const rows: LanguageCoverageRow[] = [...counts.entries()]
    .map(([code, count]) => ({
      code,
      name_en: code.charAt(0).toUpperCase() + code.slice(1),
      name_native: code,
      direction: 'ltr',
      content_count: count,
    }))
    .sort((a, b) => Number(b.content_count) - Number(a.content_count));
  return { ok: true, rows };
}
