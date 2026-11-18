/**
 * BioCraft — unified library search (browser side).
 *
 * One search across every content library: bios, captions, hashtags, symbols,
 * fonts, emoji. Results always come from rows that are really stored, via the
 * `search_global` function in migration 0006, which reads the trigger-maintained
 * `global_content` index.
 *
 * Two rules this module obeys:
 *
 *   1. Never claim more than it has. If Supabase is not configured, or the
 *      function is not deployed yet, `searched` is false and the UI says so. It
 *      does not fall back to a fake local catalogue and present it as a database
 *      result.
 *   2. Never load a library into the browser. Every query is a server-side
 *      search with a page size; there is no "fetch all 200k rows" path.
 */
import { supabase, isSupabaseConfigured } from './supabase';

export interface GlobalHit {
  id: string;
  source_table: string;
  source_id: string;
  domain: string;
  title: string | null;
  body: string;
  language: string | null;
  category: string | null;
  rank: number;
}

export type SearchOutcome =
  | { searched: true; hits: GlobalHit[]; hasMore: boolean }
  | { searched: false; reason: 'not-configured' | 'unavailable' | 'error'; message: string };

/** Page size. A limit, not a cap on the library — there is no fixed maximum. */
export const SEARCH_PAGE_SIZE = 24;

export const DOMAIN_LABELS: Record<string, string> = {
  bio: 'Bio',
  caption: 'Caption',
  hashtag: 'Hashtag',
  symbol: 'Symbol',
  font: 'Font',
  emoji: 'Emoji',
  icon: 'Icon',
  palette: 'Palette',
  template: 'Template',
};

export const DOMAINS = Object.keys(DOMAIN_LABELS);

export interface SearchOptions {
  query: string;
  domain?: string | null;
  language?: string | null;
  limit?: number;
  offset?: number;
}

/**
 * Run one page of unified search.
 *
 * `hasMore` is derived by asking for one row more than requested, which is
 * truthful whether or not the caller knows the total. We deliberately do not run
 * a `count(*)` for display: at library scale that is a full scan per keystroke,
 * and an inflated "N results" label would be worse than no number at all.
 */
export async function searchGlobal(options: SearchOptions): Promise<SearchOutcome> {
  const { query, domain = null, language = null, limit = SEARCH_PAGE_SIZE, offset = 0 } = options;

  if (!isSupabaseConfigured || !supabase) {
    return {
      searched: false,
      reason: 'not-configured',
      message: 'Library search is not connected in this environment.',
    };
  }

  const trimmed = query.trim();
  const want = Math.max(1, limit);

  const { data, error } = await supabase.rpc('search_global', {
    p_query: trimmed.length ? trimmed : null,
    p_domain: domain,
    p_language: language,
    p_limit: want + 1,
    p_offset: Math.max(0, offset),
  });

  if (error) {
    // 42883 = function does not exist: the migration is not applied here yet.
    if (error.code === '42883' || /does not exist/i.test(error.message)) {
      return {
        searched: false,
        reason: 'unavailable',
        message: 'The unified library is not deployed in this environment yet.',
      };
    }
    return { searched: false, reason: 'error', message: error.message };
  }

  const rows = (data ?? []) as GlobalHit[];
  const hasMore = rows.length > want;
  return { searched: true, hits: hasMore ? rows.slice(0, want) : rows, hasMore };
}

/** Which tool page a stored result belongs to. Every hit links to real content. */
export function hrefForHit(hit: GlobalHit): string {
  switch (hit.domain) {
    case 'bio':
      return `/bio-collections?q=${encodeURIComponent(hit.body.slice(0, 40))}`;
    case 'caption':
      return '/caption-generator';
    case 'hashtag':
      return `/hashtag-generator?tag=${encodeURIComponent((hit.body || '').replace(/^#/, ''))}`;
    case 'symbol':
      return '/fancy-font-generator';
    case 'font':
      return '/fancy-font-generator';
    case 'emoji':
      return '/emoji-symbol-generator';
    default:
      return '/categories';
  }
}
