/**
 * BioCraft — library read API (browser side).
 *
 * Wraps the read-only SQL functions from migration 0007. Same honesty rules as
 * globalSearch: if the backend is missing we say so, and no local catalogue is
 * substituted for a database result.
 *
 * The browser never receives more than one page. Page size is a request, not a
 * guarantee — the database clamps it to `app_limits.search_page_max`.
 */
import { supabase, isSupabaseConfigured } from './supabase';

export type LibraryOutcome<T> =
  | { ok: true; rows: T[] }
  | { ok: false; reason: 'not-configured' | 'unavailable' | 'error'; message: string };

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

function wrapError(error: { code?: string; message: string }): LibraryOutcome<never> {
  if (error.code === '42883' || /does not exist/i.test(error.message)) {
    return { ok: false, reason: 'unavailable', message: 'The content library is not deployed in this environment yet.' };
  }
  return { ok: false, reason: 'error', message: error.message };
}

const NOT_CONFIGURED = {
  ok: false as const,
  reason: 'not-configured' as const,
  message: 'The content library is not connected in this environment.',
};

export async function fetchFacets(): Promise<LibraryOutcome<FacetRow>> {
  if (!isSupabaseConfigured || !supabase) return NOT_CONFIGURED;
  const { data, error } = await supabase.rpc('library_facets');
  if (error) return wrapError(error);
  return { ok: true, rows: (data ?? []) as FacetRow[] };
}

export async function fetchFontPage(options: {
  category?: string | null;
  search?: string | null;
  cursor?: string | null;
  limit?: number;
}): Promise<LibraryOutcome<FontRow>> {
  if (!isSupabaseConfigured || !supabase) return NOT_CONFIGURED;
  const { data, error } = await supabase.rpc('font_page', {
    p_category: options.category ?? null,
    p_search: options.search ?? null,
    p_cursor: options.cursor ?? null,
    p_limit: options.limit ?? 48,
  });
  if (error) return wrapError(error);
  return { ok: true, rows: (data ?? []) as FontRow[] };
}

export async function fetchLanguageCoverage(): Promise<LibraryOutcome<LanguageCoverageRow>> {
  if (!isSupabaseConfigured || !supabase) return NOT_CONFIGURED;
  const { data, error } = await supabase.rpc('language_coverage');
  if (error) return wrapError(error);
  return { ok: true, rows: (data ?? []) as LanguageCoverageRow[] };
}

export const FONT_CATEGORIES = ['sans-serif', 'serif', 'display', 'handwriting', 'monospace'] as const;

export const FONT_CATEGORY_LABELS: Record<string, string> = {
  'sans-serif': 'Sans serif',
  serif: 'Serif',
  display: 'Display',
  handwriting: 'Handwriting',
  monospace: 'Monospace',
};
