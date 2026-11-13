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
  id: string;
  created_at: string;
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

// Deduplicate only concurrent reads. Results and failures are never retained,
// so navigation and explicit retries still fetch fresh active data under RLS.
const pendingCollections = new Map<string, Promise<RemoteBioResult>>();

/** Fetch every published bio of one collection. Throws on network/DB errors. */
export function fetchCollectionBios(slug: string): Promise<RemoteBioResult> {
  if (!supabase) return Promise.resolve({ bios: [], source: 'local' });
  const pending = pendingCollections.get(slug);
  if (pending) return pending;
  const request = readCollectionBios(slug);
  pendingCollections.set(slug, request);
  void request.then(() => pendingCollections.delete(slug), () => pendingCollections.delete(slug));
  return request;
}

const COLLECTION_PAGE_SIZE = 500;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function readCollectionBios(slug: string): Promise<RemoteBioResult> {
  const rows: BioRow[] = [];
  const ids = new Set<string>();
  let expected: number | null = null;
  let cursor: BioRow | null = null;
  let pages = 0;
  while (expected === null || rows.length < expected) {
    let query = supabase!
      .from('bios')
      .select('id, created_at, content, plain_content, language, style_type', cursor ? {} : { count: 'exact' })
      .eq('source_slug', slug)
      .eq('is_active', true)
      .order('created_at', { ascending: true })
      .order('id', { ascending: true });
    if (cursor) {
      // Values are returned by Postgres, not supplied by the visitor. Quote the
      // timestamp for PostgREST's filter grammar and reject malformed cursors.
      if (!UUID.test(cursor.id) || !/^\d{4}-\d\d-\d\d[T ][\d:.]+(?:Z|[+-]\d\d(?::?\d\d)?)$/.test(cursor.created_at)) {
        throw new Error('Invalid collection pagination cursor');
      }
      const timestamp = `"${cursor.created_at}"`;
      query = query.or(`created_at.gt.${timestamp},and(created_at.eq.${timestamp},id.gt.${cursor.id})`);
    }
    const { data, error, count } = await query.limit(COLLECTION_PAGE_SIZE);
    if (error) throw new Error(error.message);
    if (expected === null) {
      if (count === null || count === undefined) throw new Error('Collection count unavailable');
      expected = count;
    }
    const page = (data ?? []) as BioRow[];
    pages++;
    for (const row of page) {
      if (!UUID.test(row.id) || ids.has(row.id)) throw new Error('Invalid or repeated collection row');
      ids.add(row.id);
      rows.push(row);
    }
    if (rows.length > expected || (page.length === 0 && rows.length < expected)) {
      throw new Error('Collection changed while loading; please retry');
    }
    cursor = page[page.length - 1] ?? null;
  }
  if (pages > 1) {
    // Separate HTTP requests do not share a database snapshot. Detect changes
    // in the total rather than silently returning an obviously partial set.
    const { count, error } = await supabase!.from('bios')
      .select('id', { count: 'exact', head: true })
      .eq('source_slug', slug)
      .eq('is_active', true);
    if (error || count !== expected) throw new Error('Collection changed while loading; please retry');
  }
  return { bios: rows.map(rowToEntry), source: 'supabase' };
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
