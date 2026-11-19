/**
 * Premium bio library — data access layer.
 *
 * The records live in a JSON module that is imported ONLY by the premium
 * library page. Nothing here is imported by the shell, the homepage or any
 * generator, so a visitor who never opens the library downloads none of it.
 *
 * Search is the reason this file exists. Filtering by scanning every record on
 * each keystroke is fine at 500 entries and painful at 50,000, so the filter
 * pipeline is:
 *
 *   1. Facets reduce the candidate set to record *ids* (cheap integer arrays).
 *   2. A precomputed lowercase haystack per record is only touched for the ids
 *      that survive step 1.
 *   3. Only the requested page is materialised into full record objects.
 *
 * That means opening the page costs one pass to build indexes, and every
 * keystroke after that costs a substring test over an int array — never 50,000
 * object allocations.
 */

import rawRecords from '../data/bios/records.json';
import rawIndex from '../data/bios/index.json';

export type BioLangCode = 'en' | 'hi' | 'hg';

/**
 * Packed record layout — must match scripts/build-bio-library.mjs.
 *  0 id · 1 text · 2 lang · 3 category · 4 subcategory · 5 tone
 *  6 tags · 7 script · 8 chars · 9 platforms · 10 created · 11 source · 12 fingerprint
 */
type PackedRecord = [
  string, string, BioLangCode, string, string, string,
  string[], string, number, string[], string, string, string,
];

export interface PremiumBio {
  id: string;
  text: string;
  lang: BioLangCode;
  category: string;
  subcategory: string;
  tone: string;
  tags: string[];
  script: string;
  chars: number;
  platforms: string[];
  created: string;
  source: string;
  fingerprint: string;
}

export interface PremiumStats {
  total: number;
  byLang: Record<BioLangCode, number>;
  byCategory: Record<string, number>;
  byScript: Record<string, number>;
  categories: string[];
  complete: boolean;
  shortfall: { en: number; hi: number; hg: number; total: number };
}

export const PREMIUM_STATS = rawIndex as unknown as PremiumStats;

const PACKED = rawRecords as unknown as PackedRecord[];

/** Materialise one record on demand — never the whole set. */
export function toBio(record: PackedRecord): PremiumBio {
  return {
    id: record[0], text: record[1], lang: record[2], category: record[3],
    subcategory: record[4], tone: record[5], tags: record[6], script: record[7],
    chars: record[8], platforms: record[9], created: record[10],
    source: record[11], fingerprint: record[12],
  };
}

/* ------------------------------------------------------------------ index */

/**
 * Lowercase search haystack per record. Built once, lazily, on first search —
 * the page renders its first screen without paying for it.
 */
let haystackCache: string[] | null = null;

function haystacks(): string[] {
  if (haystackCache) return haystackCache;
  haystackCache = PACKED.map((r) =>
    `${r[1]}\n${r[3]}\n${r[4]}\n${r[5]}\n${r[6].join(' ')}`.toLowerCase(),
  );
  return haystackCache;
}

/** Category → record indices. Built once. */
let categoryIndex: Map<string, number[]> | null = null;

function byCategoryIndex(): Map<string, number[]> {
  if (categoryIndex) return categoryIndex;
  const map = new Map<string, number[]>();
  PACKED.forEach((record, index) => {
    const list = map.get(record[3]);
    if (list) list.push(index);
    else map.set(record[3], [index]);
  });
  categoryIndex = map;
  return map;
}

let langIndex: Map<string, number[]> | null = null;

function byLangIndex(): Map<string, number[]> {
  if (langIndex) return langIndex;
  const map = new Map<string, number[]>();
  PACKED.forEach((record, index) => {
    const list = map.get(record[2]);
    if (list) list.push(index);
    else map.set(record[2], [index]);
  });
  langIndex = map;
  return map;
}

/* ----------------------------------------------------------------- query */

export type PremiumSort = 'curated' | 'shortest' | 'longest' | 'az';

export interface PremiumQuery {
  q: string;
  lang: string;
  category: string;
  tone: string;
  sort: PremiumSort;
}

export const EMPTY_PREMIUM_QUERY: PremiumQuery = {
  q: '', lang: 'all', category: 'all', tone: 'all', sort: 'curated',
};

export const PREMIUM_SORTS: Array<{ value: PremiumSort; label: string }> = [
  { value: 'curated', label: 'Curated order' },
  { value: 'shortest', label: 'Shortest first' },
  { value: 'longest', label: 'Longest first' },
  { value: 'az', label: 'A–Z' },
];

export const LANG_FILTERS: Array<{ value: string; label: string }> = [
  { value: 'all', label: 'All languages' },
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'हिंदी (Hindi)' },
  { value: 'hg', label: 'Hinglish' },
];

/** Distinct tones, derived from the data rather than a hand-kept list. */
let toneCache: string[] | null = null;
export function allTones(): string[] {
  if (toneCache) return toneCache;
  toneCache = [...new Set(PACKED.map((r) => r[5]))].sort((a, b) => a.localeCompare(b));
  return toneCache;
}

/**
 * Resolve a query to record indices. Returns indices, not records, so callers
 * can paginate before materialising anything.
 */
export function queryIndices(query: PremiumQuery): number[] {
  let candidates: number[];

  // Start from the smallest facet bucket available.
  if (query.category !== 'all') candidates = byCategoryIndex().get(query.category) ?? [];
  else if (query.lang !== 'all') candidates = byLangIndex().get(query.lang) ?? [];
  else candidates = PACKED.map((_, index) => index);

  if (query.category !== 'all' && query.lang !== 'all') {
    const langSet = new Set(byLangIndex().get(query.lang) ?? []);
    candidates = candidates.filter((index) => langSet.has(index));
  }

  if (query.tone !== 'all') {
    candidates = candidates.filter((index) => PACKED[index][5] === query.tone);
  }

  const needle = query.q.trim().toLowerCase();
  if (needle) {
    const stacks = haystacks();
    candidates = candidates.filter((index) => stacks[index].includes(needle));
  }

  switch (query.sort) {
    case 'shortest':
      return [...candidates].sort((a, b) => PACKED[a][8] - PACKED[b][8] || a - b);
    case 'longest':
      return [...candidates].sort((a, b) => PACKED[b][8] - PACKED[a][8] || a - b);
    case 'az':
      return [...candidates].sort((a, b) => PACKED[a][1].localeCompare(PACKED[b][1]) || a - b);
    default:
      return candidates;
  }
}

/** Materialise one page of a result set. This is the only allocation per view. */
export function pageOf(indices: number[], offset: number, size: number): PremiumBio[] {
  return indices.slice(offset, offset + size).map((index) => toBio(PACKED[index]));
}

/** Parse the URL query into a validated premium query. */
export function parsePremiumQuery(search: string): PremiumQuery {
  const params = new URLSearchParams(search);
  const categories = new Set(PREMIUM_STATS.categories);
  const langs = new Set(['en', 'hi', 'hg']);
  const tones = new Set(allTones());
  const sorts = new Set(PREMIUM_SORTS.map((s) => s.value));
  const pick = (key: string, allowed: Set<string>) => {
    const value = params.get(key) ?? 'all';
    return value === 'all' || allowed.has(value) ? value : 'all';
  };
  const sort = params.get('sort') ?? 'curated';
  return {
    q: (params.get('q') ?? '').slice(0, 80),
    lang: pick('lang', langs),
    category: pick('category', categories),
    tone: pick('tone', tones),
    sort: (sorts.has(sort as PremiumSort) ? sort : 'curated') as PremiumSort,
  };
}

export function premiumQueryToSearch(query: PremiumQuery): string {
  const params = new URLSearchParams();
  if (query.q.trim()) params.set('q', query.q.trim());
  if (query.lang !== 'all') params.set('lang', query.lang);
  if (query.category !== 'all') params.set('category', query.category);
  if (query.tone !== 'all') params.set('tone', query.tone);
  if (query.sort !== 'curated') params.set('sort', query.sort);
  const value = params.toString();
  return value ? `?${value}` : '';
}

export function activePremiumFilters(query: PremiumQuery): number {
  let count = 0;
  if (query.q.trim()) count += 1;
  if (query.lang !== 'all') count += 1;
  if (query.category !== 'all') count += 1;
  if (query.tone !== 'all') count += 1;
  return count;
}

/** Count labels for the category chips. */
export function categoryCounts(): Array<{ name: string; count: number }> {
  return Object.entries(PREMIUM_STATS.byCategory)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}
