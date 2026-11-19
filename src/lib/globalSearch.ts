/**
 * BioCraft — unified library search, served from bundled content.
 *
 * This replaces the `search_global` database function. Every entry is derived
 * from data that already ships with the application, so the library page makes
 * no network request at all: it works offline, with the database unreachable,
 * and with no database environment variables configured.
 *
 * Honesty rules carried over from the previous implementation:
 *   1. Never claim more than it has. Counts are computed from the real index,
 *      never hard-coded, and `searched` is always true because the index is
 *      local — there is no "backend unavailable" state to fake.
 *   2. The whole index lives in the bundle, so results are instant; there is no
 *      pagination over a network and therefore no partial-page ambiguity.
 */
import { BIO_COLLECTIONS } from './bioCollections';
import { SYMBOL_CATEGORIES } from '../tools/symbols/data/symbols';
import { NICHES } from '../tools/hashtags/data/pools';
import { TEMPLATES } from '../tools/captions/data/pools';
import { UNICODE_STYLES } from './unicodeStyles';

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

/** Page size. A limit on what is rendered, not on what is searchable. */
export const SEARCH_PAGE_SIZE = 24;

export const DOMAIN_LABELS: Record<string, string> = {
  bio: 'Bio',
  caption: 'Caption',
  hashtag: 'Hashtag',
  symbol: 'Symbol',
  font: 'Font',
  emoji: 'Emoji',
};

export const DOMAINS = Object.keys(DOMAIN_LABELS);

export interface SearchOptions {
  query: string;
  domain?: string | null;
  language?: string | null;
  limit?: number;
  offset?: number;
}

interface IndexEntry {
  id: string;
  sourceTable: string;
  sourceId: string;
  domain: string;
  title: string | null;
  body: string;
  language: string | null;
  category: string | null;
  /** Pre-lowercased haystack, built once at module load. */
  haystack: string;
}

/**
 * Built once, lazily, on first search. Keeping the build out of the module's
 * top level means pages that never search do not pay for it.
 */
let INDEX: IndexEntry[] | null = null;

function buildIndex(): IndexEntry[] {
  const out: IndexEntry[] = [];
  const add = (entry: Omit<IndexEntry, 'haystack'>) => {
    out.push({ ...entry, haystack: `${entry.title ?? ''} ${entry.body} ${entry.category ?? ''}`.toLowerCase() });
  };

  // Bios — the full bundled registry (506 entries across every collection).
  for (const collection of BIO_COLLECTIONS) {
    collection.bios.forEach((bio, i) => {
      add({
        id: `bio:${collection.slug}:${i}`,
        sourceTable: 'bios',
        sourceId: `${collection.slug}:${i}`,
        domain: 'bio',
        title: collection.name,
        body: bio.plain ?? bio.text,
        language: bio.lang ?? null,
        category: collection.slug,
      });
    });
  }

  // Symbols and emoji. Both come from the same curated glyph library, so they
  // are indexed under whichever domain their category describes.
  for (const category of SYMBOL_CATEGORIES) {
    const isEmoji = /emoji/i.test(category.label) || /emoji/i.test(category.id);
    category.symbols.forEach((symbol, i) => {
      add({
        id: `symbol:${category.id}:${i}`,
        sourceTable: 'symbols',
        sourceId: `${category.id}:${i}`,
        domain: isEmoji ? 'emoji' : 'symbol',
        title: category.label,
        body: symbol.glyph,
        language: null,
        category: category.label,
      });
    });
  }

  // Hashtags — every niche, language and bucket.
  for (const niche of NICHES) {
    for (const language of Object.keys(niche.pools) as (keyof typeof niche.pools)[]) {
      for (const bucket of Object.keys(niche.pools[language]) as (keyof (typeof niche.pools)[keyof typeof niche.pools])[]) {
        for (const tag of niche.pools[language][bucket]) {
          add({
            id: `hashtag:${niche.id}:${language}:${bucket}:${tag}`,
            sourceTable: 'hashtags',
            sourceId: tag,
            domain: 'hashtag',
            title: niche.labelEn,
            body: tag,
            language,
            category: niche.labelEn,
          });
        }
      }
    }
  }

  // Caption templates — the phrase library the generator composes from.
  for (const tone of Object.keys(TEMPLATES) as (keyof typeof TEMPLATES)[]) {
    for (const language of Object.keys(TEMPLATES[tone]) as (keyof (typeof TEMPLATES)[keyof typeof TEMPLATES])[]) {
      TEMPLATES[tone][language].forEach((template, i) => {
        add({
          id: `caption:${tone}:${language}:${i}`,
          sourceTable: 'captions',
          sourceId: `${tone}:${language}:${i}`,
          domain: 'caption',
          title: String(tone),
          body: template,
          language,
          category: String(tone),
        });
      });
    }
  }

  // Fonts — the Unicode styles the font tool actually produces.
  UNICODE_STYLES.forEach((style) => {
    add({
      id: `font:${style.id}`,
      sourceTable: 'fonts',
      sourceId: style.id,
      domain: 'font',
      title: style.label,
      body: style.label,
      language: null,
      category: 'Unicode',
    });
  });

  return out;
}

function index(): IndexEntry[] {
  if (!INDEX) INDEX = buildIndex();
  return INDEX;
}

/** Real totals, used for honest counts in the UI. */
export function indexStats(): { total: number; byDomain: Record<string, number> } {
  const byDomain: Record<string, number> = {};
  for (const entry of index()) byDomain[entry.domain] = (byDomain[entry.domain] ?? 0) + 1;
  return { total: index().length, byDomain };
}

export async function searchGlobal(options: SearchOptions): Promise<SearchOutcome> {
  const { query, domain = null, language = null, limit = SEARCH_PAGE_SIZE, offset = 0 } = options;
  const trimmed = query.trim().toLowerCase();
  const want = Math.max(1, limit);

  // Rank: an exact prefix match beats a word-boundary match, which beats a
  // substring match. Ties fall back to the shorter body, which is usually the
  // more specific entry.
  const scored: { entry: IndexEntry; rank: number }[] = [];
  for (const entry of index()) {
    if (domain && entry.domain !== domain) continue;
    if (language && entry.language && entry.language !== language) continue;
    if (trimmed) {
      const at = entry.haystack.indexOf(trimmed);
      if (at < 0) continue;
      const boundary = at === 0 || /[\s\-_#@]/.test(entry.haystack[at - 1]);
      scored.push({ entry, rank: at === 0 ? 3 : boundary ? 2 : 1 });
    } else {
      scored.push({ entry, rank: 0 });
    }
  }

  scored.sort((a, b) =>
    b.rank - a.rank || a.entry.body.length - b.entry.body.length || a.entry.id.localeCompare(b.entry.id));

  const page = scored.slice(Math.max(0, offset), Math.max(0, offset) + want);
  const hits: GlobalHit[] = page.map(({ entry, rank }) => ({
    id: entry.id,
    source_table: entry.sourceTable,
    source_id: entry.sourceId,
    domain: entry.domain,
    title: entry.title,
    body: entry.body,
    language: entry.language,
    category: entry.category,
    rank,
  }));

  return { searched: true, hits, hasMore: scored.length > Math.max(0, offset) + want };
}

/** Which tool page a stored result belongs to. Every hit links to real content. */
export function hrefForHit(hit: GlobalHit): string {
  switch (hit.domain) {
    case 'bio':
      return hit.category ? `/${hit.category}` : '/bio-library';
    case 'caption':
      return '/caption-generator';
    case 'hashtag':
      return `/hashtag-generator?tag=${encodeURIComponent((hit.body || '').replace(/^#/, ''))}`;
    case 'symbol':
      return '/emoji-symbol-generator';
    case 'font':
      return '/fancy-font-generator';
    case 'emoji':
      return '/emoji-symbol-generator';
    default:
      return '/categories';
  }
}
