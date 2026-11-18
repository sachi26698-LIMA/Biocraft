/**
 * Ready-Made Bios — discovery index.
 *
 * One derived, honest layer over `bioCollections.ts`. Nothing here invents
 * content: every count is computed from the registry, every card links to a
 * real route, and every facet value maps to bios that actually exist.
 *
 * Used by:
 *   /bio-collections   (hub: featured, categories, recent, designs, platforms, languages)
 *   /bio-library       (complete library: search + facets + sort + load more)
 *   /                  (homepage Ready-Made Bios block)
 */
import {
  BIO_COLLECTIONS,
  BIO_DESIGNS,
  RECENTLY_ADDED_COLLECTIONS,
  TOTAL_BIOS,
  collectionBySlug,
  designForBio,
  designLabel,
  type BioCollection,
  type BioDesignKey,
  type BioLang,
} from './bioCollections';

/** Platforms that genuinely have bundled collections. */
export type BioPlatform = 'instagram' | 'facebook';

export const BIO_PLATFORM_META: Record<BioPlatform, { label: string; description: string }> = {
  instagram: { label: 'Instagram', description: '150-character bios, styled text and emoji included.' },
  facebook: { label: 'Facebook', description: '101-character intro bios for the Facebook about field.' },
};

/** A single bio entry with the context needed to render and filter it. */
export interface LibraryBio {
  id: string;
  text: string;
  plain?: string;
  lang: BioLang;
  style?: string;
  collectionSlug: string;
  collectionName: string;
  collectionIcon: string;
  design: BioDesignKey;
  designName: string;
  platform: BioPlatform;
  categoryId: string;
  /** Human month/year from the collection (real metadata). */
  updated: string;
}

export interface BioCategory {
  id: string;
  label: string;
  description: string;
  slugs: string[];
}

/**
 * Content categories. Every collection appears in exactly one category, so
 * counts never double-count a bio.
 */
export const BIO_CATEGORIES: readonly BioCategory[] = [
  {
    id: 'boys',
    label: 'Boys & Men',
    description: 'Confidence-first bios for boys and men.',
    slugs: ['instagram-bio-for-boys'],
  },
  {
    id: 'girls',
    label: 'Girls & Women',
    description: 'Bold, soft and stylish bios for girls and women.',
    slugs: ['instagram-bio-for-girls'],
  },
  {
    id: 'attitude',
    label: 'Attitude & VIP',
    description: 'Swagger, royalty and main-character energy.',
    slugs: ['attitude-bio', 'vip-bio'],
  },
  {
    id: 'love',
    label: 'Love & Feelings',
    description: 'Romance, heartbreak and everything between.',
    slugs: ['love-bio', 'sad-bio'],
  },
  {
    id: 'stylish',
    label: 'Stylish & Royal',
    description: 'Unicode-styled lines that look different in a feed.',
    slugs: ['stylish-instagram-bio', 'royal-bio'],
  },
  {
    id: 'minimal',
    label: 'Simple & Minimal',
    description: 'Short, calm bios with nothing wasted.',
    slugs: ['simple-bio'],
  },
  {
    id: 'cool',
    label: 'Cool & Gaming',
    description: 'Clean cool and squad-ready gamer bios.',
    slugs: ['cool-bio', 'gamer-bio'],
  },
  {
    id: 'cute',
    label: 'Cute & Soft',
    description: 'Warm, playful bios for the soft hearts.',
    slugs: ['cute-bio'],
  },
  {
    id: 'creator',
    label: 'Creator & Photography',
    description: 'Bios for people who make and shoot things.',
    slugs: ['creator-bio', 'photographer-bio'],
  },
  {
    id: 'student',
    label: 'Student',
    description: 'School and college bios that still sound like you.',
    slugs: ['student-bio'],
  },
  {
    id: 'hindi',
    label: 'Hindi',
    description: 'Devanagari bios written for Hindi-first readers.',
    slugs: ['hindi-bio'],
  },
  {
    id: 'english',
    label: 'English',
    description: 'Clean English bios for every platform.',
    slugs: ['english-bio'],
  },
  {
    id: 'hinglish',
    label: 'Hinglish',
    description: 'Desi bios written the way India actually texts.',
    slugs: ['hinglish-bio'],
  },
  {
    id: 'devotional',
    label: 'Devotional',
    description: 'Faith-forward lines with respect and restraint.',
    slugs: ['shree-ram-bio'],
  },
  {
    id: 'facebook',
    label: 'Facebook',
    description: 'Short intros sized for the Facebook profile.',
    slugs: ['facebook-bio'],
  },
];

const CATEGORY_BY_SLUG = new Map<string, BioCategory>();
for (const category of BIO_CATEGORIES) {
  for (const slug of category.slugs) CATEGORY_BY_SLUG.set(slug, category);
}

export const BIO_LANG_META: Record<BioLang, { label: string; note: string }> = {
  en: { label: 'English', note: 'Plain English bios.' },
  hi: { label: 'हिन्दी', note: 'Devanagari bios, copy as-is.' },
  hg: { label: 'Hinglish', note: 'Roman-script Indian English.' },
};

const platformFor = (collection: BioCollection): BioPlatform =>
  collection.slug === 'facebook-bio' || collection.audience === 'Facebook' ? 'facebook' : 'instagram';

/**
 * Flat index of every bio. Built once at module load — 506 rows, no I/O,
 * so search and filtering stay synchronous and cheap.
 */
export const LIBRARY_BIOS: readonly LibraryBio[] = BIO_COLLECTIONS.flatMap((collection) => {
  const category = CATEGORY_BY_SLUG.get(collection.slug);
  const platform = platformFor(collection);
  return collection.bios.map((bio, index) => {
    const design = designForBio(collection.slug, index);
    return {
      id: `${collection.slug}--${index}`,
      text: bio.text,
      plain: bio.plain,
      lang: bio.lang,
      style: bio.style,
      collectionSlug: collection.slug,
      collectionName: collection.name,
      collectionIcon: collection.icon,
      design,
      designName: designLabel(design),
      platform,
      categoryId: category?.id ?? 'everything',
      updated: collection.updated,
    } satisfies LibraryBio;
  });
});

export const LIBRARY_TOTAL = LIBRARY_BIOS.length;

/** Guard: the flat index must never lose or duplicate a bundled bio. */
export const LIBRARY_MATCHES_REGISTRY = LIBRARY_TOTAL === TOTAL_BIOS;

export interface FacetOption {
  value: string;
  label: string;
  count: number;
}

const tally = (values: string[]): Map<string, number> => {
  const map = new Map<string, number>();
  for (const value of values) map.set(value, (map.get(value) ?? 0) + 1);
  return map;
};

export const LANGUAGE_FACETS: FacetOption[] = (['en', 'hi', 'hg'] as BioLang[])
  .map((lang) => ({
    value: lang,
    label: BIO_LANG_META[lang].label,
    count: LIBRARY_BIOS.filter((bio) => bio.lang === lang).length,
  }))
  .filter((option) => option.count > 0);

export const PLATFORM_FACETS: FacetOption[] = (['instagram', 'facebook'] as BioPlatform[])
  .map((platform) => ({
    value: platform,
    label: BIO_PLATFORM_META[platform].label,
    count: LIBRARY_BIOS.filter((bio) => bio.platform === platform).length,
  }))
  .filter((option) => option.count > 0);

export const CATEGORY_FACETS: FacetOption[] = BIO_CATEGORIES.map((category) => ({
  value: category.id,
  label: category.label,
  count: BIO_COLLECTIONS.filter((collection) => CATEGORY_BY_SLUG.get(collection.slug)?.id === category.id)
    .reduce((sum, collection) => sum + collection.bios.length, 0),
})).filter((option) => option.count > 0);

const DESIGN_TALLY = tally(LIBRARY_BIOS.map((bio) => bio.design));
export const DESIGN_FACETS: FacetOption[] = BIO_DESIGNS
  .map((design) => ({ value: design.key, label: design.label, count: DESIGN_TALLY.get(design.key) ?? 0 }))
  .filter((option) => option.count > 0);

const COLLECTION_TALLY = tally(LIBRARY_BIOS.map((bio) => bio.collectionSlug));
export const COLLECTION_FACETS: FacetOption[] = BIO_COLLECTIONS.map((collection) => ({
  value: collection.slug,
  label: collection.name,
  count: COLLECTION_TALLY.get(collection.slug) ?? 0,
})).filter((option) => option.count > 0);

/** Collections shown first on the hub — curated, not random. */
const FEATURED_SLUGS = [
  'instagram-bio-for-boys',
  'instagram-bio-for-girls',
  'attitude-bio',
  'stylish-instagram-bio',
  'hindi-bio',
  'gamer-bio',
] as const;

export interface CollectionSummary {
  slug: string;
  name: string;
  description: string;
  icon: string;
  count: number;
  languages: BioCollection['languages'];
  updated: string;
  categoryId: string;
  categoryLabel: string;
  platform: BioPlatform;
  /** Real destination for this card. */
  href: string;
  /** Library deep link that shows exactly this collection's bios. */
  libraryHref: string;
}

const summarize = (collection: BioCollection): CollectionSummary => {
  const category = CATEGORY_BY_SLUG.get(collection.slug);
  return {
    slug: collection.slug,
    name: collection.name,
    description: collection.description,
    icon: collection.icon,
    count: collection.bios.length,
    languages: collection.languages,
    updated: collection.updated,
    categoryId: category?.id ?? 'everything',
    categoryLabel: category?.label ?? 'Ready-made',
    platform: platformFor(collection),
    href: `/${collection.slug}`,
    libraryHref: `/bio-library?collection=${collection.slug}`,
  };
};

export const COLLECTION_SUMMARIES: readonly CollectionSummary[] = BIO_COLLECTIONS.map(summarize);

export const FEATURED_COLLECTIONS: readonly CollectionSummary[] = FEATURED_SLUGS
  .map((slug) => collectionBySlug(slug))
  .filter((collection): collection is BioCollection => Boolean(collection))
  .map(summarize);

export const RECENT_COLLECTIONS: readonly CollectionSummary[] = RECENTLY_ADDED_COLLECTIONS
  .map((slug) => collectionBySlug(slug))
  .filter((collection): collection is BioCollection => Boolean(collection))
  .map(summarize);

/** Designs that are worth surfacing first (they have real bios behind them). */
const FEATURED_DESIGN_KEYS: BioDesignKey[] = ['royal', 'creative', 'aesthetic', 'vip', 'devotional', 'dark'];

export interface DesignSummary {
  key: BioDesignKey;
  label: string;
  count: number;
  /** Library deep link filtered by this design. */
  libraryHref: string;
  /** Bio Editor deep link that applies this design. */
  editorHref: string;
}

export const FEATURED_DESIGNS: readonly DesignSummary[] = FEATURED_DESIGN_KEYS
  .map((key) => {
    const facet = DESIGN_FACETS.find((option) => option.value === key);
    if (!facet) return null;
    return {
      key,
      label: facet.label,
      count: facet.count,
      libraryHref: `/bio-library?design=${key}`,
      editorHref: `/bio-editor?design=${key}`,
    } satisfies DesignSummary;
  })
  .filter((design): design is DesignSummary => Boolean(design));

export interface CategorySummary {
  id: string;
  label: string;
  description: string;
  collections: number;
  bios: number;
  href: string;
}

export const CATEGORY_SUMMARIES: readonly CategorySummary[] = BIO_CATEGORIES.map((category) => {
  const collections = BIO_COLLECTIONS.filter((collection) => CATEGORY_BY_SLUG.get(collection.slug)?.id === category.id);
  return {
    id: category.id,
    label: category.label,
    description: category.description,
    collections: collections.length,
    bios: collections.reduce((sum, collection) => sum + collection.bios.length, 0),
    href: `/bio-library?category=${category.id}`,
  };
}).filter((category) => category.bios > 0);

/** Homepage/hub stats — always derived, never hard-coded. */
export const READY_MADE_STATS = {
  collections: BIO_COLLECTIONS.length,
  bios: LIBRARY_TOTAL,
  languages: LANGUAGE_FACETS.length,
  platforms: PLATFORM_FACETS.length,
  categories: CATEGORY_SUMMARIES.length,
  designs: DESIGN_FACETS.length,
} as const;

export type LibrarySort = 'curated' | 'az' | 'longest' | 'newest';

export const LIBRARY_SORTS: Array<{ value: LibrarySort; label: string }> = [
  { value: 'curated', label: 'Curated order' },
  { value: 'az', label: 'Collection A–Z' },
  { value: 'longest', label: 'Longest first' },
  { value: 'newest', label: 'Recently reviewed' },
];

export interface LibraryQuery {
  q: string;
  category: string;
  platform: string;
  lang: string;
  design: string;
  collection: string;
  sort: LibrarySort;
}

export const EMPTY_LIBRARY_QUERY: LibraryQuery = {
  q: '',
  category: 'all',
  platform: 'all',
  lang: 'all',
  design: 'all',
  collection: 'all',
  sort: 'curated',
};

const isValidSort = (value: string | null): value is LibrarySort =>
  Boolean(value) && LIBRARY_SORTS.some((option) => option.value === value);

/** Parse the URL query into a validated library query. */
export function parseLibraryQuery(search: string): LibraryQuery {
  const params = new URLSearchParams(search);
  const pick = (key: string, allowed?: Set<string>) => {
    const value = params.get(key) ?? 'all';
    if (allowed && value !== 'all' && !allowed.has(value)) return 'all';
    return value;
  };
  const sort = params.get('sort');
  return {
    q: (params.get('q') ?? '').slice(0, 80),
    category: pick('category', new Set(CATEGORY_FACETS.map((facet) => facet.value))),
    platform: pick('platform', new Set(PLATFORM_FACETS.map((facet) => facet.value))),
    lang: pick('lang', new Set(LANGUAGE_FACETS.map((facet) => facet.value))),
    design: pick('design', new Set(DESIGN_FACETS.map((facet) => facet.value))),
    collection: pick('collection', new Set(COLLECTION_FACETS.map((facet) => facet.value))),
    sort: isValidSort(sort) ? sort : 'curated',
  };
}

/** Serialise a query back to a URL search string (omitting defaults). */
export function libraryQueryToSearch(query: LibraryQuery): string {
  const params = new URLSearchParams();
  if (query.q.trim()) params.set('q', query.q.trim());
  if (query.category !== 'all') params.set('category', query.category);
  if (query.platform !== 'all') params.set('platform', query.platform);
  if (query.lang !== 'all') params.set('lang', query.lang);
  if (query.design !== 'all') params.set('design', query.design);
  if (query.collection !== 'all') params.set('collection', query.collection);
  if (query.sort !== 'curated') params.set('sort', query.sort);
  const search = params.toString();
  return search ? `?${search}` : '';
}

const MONTHS = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december',
];

/** Rank a real registry `updated` value ("November 2026") for sorting. */
const updatedRank = (value: string): number => {
  const match = /^([A-Za-z]+)\s+(\d{4})$/.exec(value.trim());
  if (!match) return 0;
  const month = MONTHS.indexOf(match[1].toLowerCase());
  return Number(match[2]) * 12 + (month < 0 ? 0 : month);
};

const normalize = (value: string): string =>
  value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

/**
 * Filter + sort the real library. Search matches the copyable text, its plain
 * twin (styled Unicode), the collection name and the design name.
 */
export function queryLibrary(query: LibraryQuery): LibraryBio[] {
  const needle = normalize(query.q.trim());
  const filtered = LIBRARY_BIOS.filter((bio) => {
    if (query.category !== 'all' && bio.categoryId !== query.category) return false;
    if (query.platform !== 'all' && bio.platform !== query.platform) return false;
    if (query.lang !== 'all' && bio.lang !== query.lang) return false;
    if (query.design !== 'all' && bio.design !== query.design) return false;
    if (query.collection !== 'all' && bio.collectionSlug !== query.collection) return false;
    if (!needle) return true;
    const haystack = normalize(`${bio.plain ?? ''}\n${bio.text}\n${bio.collectionName}\n${bio.designName}`);
    return haystack.includes(needle);
  });

  switch (query.sort) {
    case 'az':
      return [...filtered].sort(
        (a, b) => a.collectionName.localeCompare(b.collectionName) || a.id.localeCompare(b.id),
      );
    case 'longest':
      return [...filtered].sort((a, b) => b.text.length - a.text.length || a.id.localeCompare(b.id));
    case 'newest':
      // `updated` is real registry metadata ("November 2026"); ties keep curated order.
      return [...filtered].sort((a, b) => updatedRank(b.updated) - updatedRank(a.updated));
    default:
      return filtered;
  }
}

/** Number of active (non-default) filters — drives the Reset button state. */
export function activeFilterCount(query: LibraryQuery): number {
  let count = 0;
  if (query.q.trim()) count += 1;
  if (query.category !== 'all') count += 1;
  if (query.platform !== 'all') count += 1;
  if (query.lang !== 'all') count += 1;
  if (query.design !== 'all') count += 1;
  if (query.collection !== 'all') count += 1;
  return count;
}
