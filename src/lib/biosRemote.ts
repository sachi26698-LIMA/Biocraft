/**
 * BioCraft — Supabase data access for bio collections.
 *
 * Every function degrades gracefully: when Supabase is unconfigured or
 * unreachable, callers keep the bundled registry output and get a typed
 * `source: 'local'` result instead of an exception storm. No fabricated
 * content ever appears — if the fetch fails we say so (see BioCollectionPage).
 */
import { supabase } from './supabase';
import type { BioEntry, BioLang } from './bioCollections';

export type BioSource = 'local' | 'supabase';

export interface RemoteBioResult {
  bios: BioEntry[];
  source: BioSource;
}

interface BioRow {
  content: string;
  plain_content: string | null;
  language: BioLang;
  style_type: string | null;
}

const rowToEntry = (row: BioRow): BioEntry => ({
  text: row.content,
  plain: row.plain_content ?? undefined,
  lang: row.language,
  style: row.style_type ?? undefined,
});

/** Fetch every published bio of one collection. Throws on network/DB errors. */
export async function fetchCollectionBios(slug: string): Promise<RemoteBioResult> {
  if (!supabase) return { bios: [], source: 'local' };
  const { data, error } = await supabase
    .from('bios')
    .select('content, plain_content, language, style_type')
    .eq('source_slug', slug)
    .eq('is_active', true)
    .order('created_at', { ascending: true })
    .limit(500);
  if (error) throw new Error(error.message);
  return { bios: (data as BioRow[]).map(rowToEntry), source: 'supabase' };
}

export interface BioSearchFilters {
  query?: string;
  platformSlug?: string;
  categorySlug?: string;
  language?: BioLang;
  emojiOnly?: boolean;
  styledOnly?: boolean;
  featuredOnly?: boolean;
  trendingOnly?: boolean;
  limit?: number;
  offset?: number;
}

export interface BioSearchRow {
  id: string;
  content: string;
  language: BioLang;
  style_type: string | null;
  category_slug: string | null;
  platform_slug: string | null;
  is_featured: boolean;
  is_trending: boolean;
  character_count: number;
}

/**
 * Server-side search/filter over the whole bio library via the
 * search_bios() RPC (keyword + platform + category + language + style,
 * featured/trending, pagination). Returns null when Supabase is off.
 */
export async function searchBios(filters: BioSearchFilters): Promise<BioSearchRow[] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.rpc('search_bios', {
    p_query: filters.query ?? null,
    p_platform: filters.platformSlug ?? null,
    p_category: filters.categorySlug ?? null,
    p_language: filters.language ?? null,
    p_emoji_only: filters.emojiOnly ?? false,
    p_styled_only: filters.styledOnly ?? false,
    p_featured: filters.featuredOnly ?? false,
    p_trending: filters.trendingOnly ?? false,
    p_limit: Math.min(Math.max(filters.limit ?? 24, 1), 100),
    p_offset: Math.max(filters.offset ?? 0, 0),
  });
  if (error) throw new Error(error.message);
  return (data ?? []) as BioSearchRow[];
}

/** Featured bios across the library (for future surfaces). Null when off. */
export async function fetchFeaturedBios(limit = 6): Promise<BioSearchRow[] | null> {
  return searchBios({ featuredOnly: true, limit });
}

/** Trending bios across the library (for future surfaces). Null when off. */
export async function fetchTrendingBios(limit = 6): Promise<BioSearchRow[] | null> {
  return searchBios({ trendingOnly: true, limit });
}
