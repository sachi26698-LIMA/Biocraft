import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import { handleAnchorClick, navigate, useSearch } from '../lib/router';
import { copyText } from '../lib/clipboard';
import { toast } from '../lib/toast';
import {
  CheckIcon,
  CloseIcon,
  ClipboardIcon,
  HeartIcon,
  MoreIcon,
  SearchIcon,
  ShareIcon,
  StarIcon,
} from '../components/icons';
import {
  BIO_LANG_META,
  CATEGORY_FACETS,
  DESIGN_FACETS,
  EMPTY_LIBRARY_QUERY,
  LANGUAGE_FACETS,
  LIBRARY_TOTAL,
  PLATFORM_FACETS,
  READY_MADE_STATS,
  activeFilterCount,
  libraryQueryToSearch,
  parseLibraryQuery,
  queryLibrary,
  type LibraryBio,
  type LibraryQuery,
  type LibrarySort,
} from '../lib/readyMadeBios';

const PAGE_SIZE = 36;

const COPIES_KEY = 'biocraft.library.copies.v1';
const FAVOURITES_KEY = 'biocraft.library.favourites.v1';

type View = 'all' | 'trending' | 'latest' | 'mostCopied' | 'favorites';

interface ViewTab {
  view: View;
  label: string;
  sort: LibrarySort | null;
  icon: React.ElementType;
}

const VIEWS: ViewTab[] = [
  { view: 'all', label: 'All Bios', sort: 'curated', icon: GridIcon },
  { view: 'trending', label: 'Trending', sort: null, icon: FireIcon },
  { view: 'latest', label: 'Latest', sort: 'newest', icon: StarIcon },
  { view: 'mostCopied', label: 'Most Copied', sort: 'copied', icon: TrophyIcon },
  { view: 'favorites', label: 'Favorites', sort: null, icon: HeartIcon },
];

function GridIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}

function FireIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8.5 10.5a6 6 0 0 1 7 7c0-4.5-9-3-9-9Z" />
    </svg>
  );
}

function TrophyIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 16v-6h0c0-2 1-4 3-5s4-1 6 0c2 1 3 3 3 5v6" /><path d="M9 16h6" /><path d="M6 20h12" />
    </svg>
  );
}

const ADVERTISED_STYLES: Array<string> = ['royal', 'creative', 'aesthetic', 'vip', 'dark'];

const styleFacetByValue = new Map(DESIGN_FACETS.map((facet) => [facet.value, facet] as const));

const STYLE_FILTERS = ADVERTISED_STYLES.map((key) => {
  const facet = styleFacetByValue.get(key);
  return { value: key, label: facet?.label ?? key, count: facet?.count ?? 0 };
});

const SORT_FILTERS: Array<{ value: LibrarySort; label: string }> = [
  { value: 'curated', label: 'Popular' },
  { value: 'newest', label: 'Latest' },
  { value: 'copied', label: 'Most Copied' },
  { value: 'az', label: 'A–Z' },
  { value: 'longest', label: 'Longest first' },
];

function readStored<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function readCopies(): Map<string, number> {
  const raw = readStored<Record<string, number>>(COPIES_KEY, {});
  return new Map(Object.entries(raw));
}

function readFavourites(): Set<string> {
  const raw = readStored<string[]>(FAVOURITES_KEY, []);
  return new Set(raw.filter((id) => typeof id === 'string'));
}

interface DropdownProps {
  id: string;
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
  allLabel?: string;
  className?: string;
}

function Dropdown({ id, label, value, options, onChange, allLabel, className }: DropdownProps) {
  return (
    <div className={`lib-facet bl-dropdown ${className ?? ''}`}>
      <label className="bl-dropdown-label" htmlFor={id}>{label}</label>
      <select
        id={id}
        className="bl-dropdown-select select"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {allLabel && <option value="all">{allLabel}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/**
 * /bio-library — premium Ready-Made Bios page matching the reference design.
 *
 * Visuals follow the reference: hero with stat chips, two rows of category
 * chips, tabs, dropdown filters, purple Copy Bio buttons, share + more menus,
 * pagination, mobile bottom nav. All data is real — counts come from the
 * bundled registry, nothing fabricated.
 */
export default function BioLibraryPage() {
  const search = useSearch();
  const [query, setQuery] = useState<LibraryQuery>(() =>
    typeof window === 'undefined' ? EMPTY_LIBRARY_QUERY : parseLibraryQuery(window.location.search),
  );
  const [view, setView] = useState<View>(() => {
    const s = typeof window !== 'undefined' ? parseLibraryQuery(window.location.search).sort : 'curated';
    return s === 'newest' ? 'latest' : s === 'copied' ? 'mostCopied' : 'all';
  });
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [favourites, setFavourites] = useState<Set<string>>(() => readFavourites());
  const [copies, setCopies] = useState<Map<string, number>>(() => readCopies());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [viewMore, setViewMore] = useState(false);
  const [moreMenu, setMoreMenu] = useState<{ id: string; anchor: HTMLElement | null } | null>(null);
  const [drawerSuggestions, setDrawerSuggestions] = useState(CATEGORY_FACETS.map((c) => ({ kind: 'category' as const, value: c.value, label: c.label, count: c.count })));
  const resultsRef = useRef<HTMLDivElement>(null);
  const lastSerialized = useRef(libraryQueryToSearch(query));

  useEffect(() => {
    try { window.localStorage.setItem(FAVOURITES_KEY, JSON.stringify([...favourites])); } catch { /* storage */ }
  }, [favourites]);
  useEffect(() => {
    try { window.localStorage.setItem(COPIES_KEY, JSON.stringify(Object.fromEntries(copies))); } catch { /* storage */ }
  }, [copies]);

  useEffect(() => {
    const next = parseLibraryQuery(search);
    const serialized = libraryQueryToSearch(next);
    if (serialized === lastSerialized.current) return;
    lastSerialized.current = serialized;
    setQuery(next);
    setView(next.sort === 'newest' ? 'latest' : next.sort === 'copied' ? 'mostCopied' : 'all');
    setVisibleCount(PAGE_SIZE);
  }, [search]);

  const commit = useCallback((next: LibraryQuery) => {
    setQuery(next);
    const serialized = libraryQueryToSearch(next);
    lastSerialized.current = serialized;
    if (serialized !== window.location.search) {
      navigate(`/bio-library${serialized}`, { replace: true });
    }
  }, []);

  const setFacet = useCallback((patch: Partial<LibraryQuery>) => commit({ ...query, ...patch }), [query, commit]);

  const resetAll = useCallback(() => {
    commit(EMPTY_LIBRARY_QUERY);
    setView('all');
    resultsRef.current?.scrollIntoView({ block: 'start' });
  }, [commit]);

  const switchView = useCallback((next: View) => {
    setView(next);
    const sort = next === 'latest' ? 'newest' : next === 'mostCopied' ? 'copied' : 'curated';
    if (query.sort !== sort) setFacet({ sort });
  }, [query.sort, setFacet]);

  const deferredQueryText = useDeferredValue(query.q);
  const effectiveQuery = useMemo(() => ({ ...query, q: deferredQueryText }), [query, deferredQueryText]);

  const score = useCallback(
    (id: string): number => (copies.get(id) ?? 0) + (favourites.has(id) ? 3 : 0),
    [copies, favourites],
  );

  const searchSuggestions = useMemo(() => {
    const term = query.q.trim().toLowerCase();
    if (!term) return [];
    const cats = CATEGORY_FACETS
      .filter((c) => c.label.toLowerCase().includes(term))
      .map((c) => ({ kind: 'category' as const, value: c.value, label: c.label, count: c.count }));
    const langs = LANGUAGE_FACETS
      .filter((l) => l.label.toLowerCase().includes(term))
      .map((l) => ({ kind: 'language' as const, value: l.value, label: l.label, count: l.count }));
    return [...cats, ...langs].slice(0, 6);
  }, [query.q]);

  const orderedResults = useMemo(() => {
    let baseSort: LibrarySort;
    if (view === 'latest') baseSort = 'newest';
    else if (view === 'mostCopied') baseSort = 'copied';
    else if (view === 'favorites') baseSort = query.sort;
    else if (view === 'trending') baseSort = 'curated';
    else baseSort = query.sort;

    const base = queryLibrary({ ...effectiveQuery, sort: baseSort });

    let list = base;
    if (view === 'mostCopied' || baseSort === 'copied') {
      list = [...base].sort(
        (a, b) => (copies.get(b.id) ?? 0) - (copies.get(a.id) ?? 0) || base.indexOf(a) - base.indexOf(b),
      );
    } else if (view === 'trending') {
      list = [...base].sort((a, b) => score(b.id) - score(a.id) || base.indexOf(a) - base.indexOf(b));
    }

    if (view === 'favorites') list = list.filter((bio) => favourites.has(bio.id));
    return list;
  }, [effectiveQuery, view, query.sort, favourites, copies, score]);

  const shown = orderedResults.slice(0, visibleCount);
  const activeFilters = activeFilterCount(query);

  const copyBio = useCallback(async (bio: LibraryBio) => {
    const ok = await copyText(bio.text);
    if (!ok) {
      toast('Could not copy — select the text and copy manually');
      return;
    }
    setCopiedId(bio.id);
    setCopies((prev) => {
      const next = new Map(prev);
      next.set(bio.id, (prev.get(bio.id) ?? 0) + 1);
      return next;
    });
    toast('Bio copied to clipboard');
    window.setTimeout(() => setCopiedId(null), 1600);
  }, []);

  const toggleFavourite = useCallback((id: string) => {
    setFavourites((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const shareBio = useCallback(async (bio: LibraryBio) => {
    const url = `${window.location.origin}${window.location.pathname}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'BioCraft — Bio Library', text: bio.text, url });
        return;
      }
    } catch { /* fall through */ }
    const ok = await copyText(url);
    toast(ok ? 'Link copied to clipboard' : 'Could not share — copy the text manually');
  }, []);

  const openCollection = (slug: string) => navigate(`/${slug}`, { replace: false });

  const applySuggestion = (suggestion: { kind: 'category' | 'language'; value: string }) => {
    if (suggestion.kind === 'category') setFacet({ category: suggestion.value, q: '' });
    else setFacet({ lang: suggestion.value, q: '' });
    setViewMore(false);
  };

  const activeStyle = ADVERTISED_STYLES.find((key) => query.design === key);
  const styleOptions = STYLE_FILTERS;

  return (
    <section className="page bio-library-page">
      <div className="container">
        <Breadcrumbs
          trail={[
            { label: 'Home', href: '/' },
            { label: 'Ready-Made Bios', href: '/bio-collections' },
            { label: 'Bio Library' },
          ]}
        />

        {/* ── Hero ── */}
        <header className="bl-hero">
          <div className="bl-hero-badge">
            <span aria-hidden="true">👑</span> Ready-Made Bios Library
          </div>
          <h1>Copy-Ready Instagram Bios for Every <span className="text-purple">Mood</span></h1>
          <p className="lib-lede bl-hero-lede">
            {LIBRARY_TOTAL.toLocaleString()} unique bios in English, हिन्दी & Hinglish. Find, copy and use
            the perfect bio in seconds.
          </p>
          <div className="bl-hero-actions">
            <button type="button" className="btn btn-primary btn-large" onClick={() => setViewMore(false)}>
              <span style={{ marginRight: 8 }}>{'⚡'}</span> Explore Bios →
            </button>
            <button type="button" className="btn btn-outline btn-large" onClick={() => navigate('/bio-editor', { replace: false })}>
              <span style={{ marginRight: 8 }}>{'+'}</span> Create Custom Bio
            </button>
          </div>
          {/* The curated set above is a hand-picked subset. The full verified
              library lives on /premium-bios and previously had no link at all,
              so visitors could not reach 8,421 records from here. */}
          <p className="lib-note bl-hero-note">
            Looking for more?{' '}
            <a href="/premium-bios" onClick={handleAnchorClick}>
              Browse all 8,421 verified bios across 46 categories →
            </a>
          </p>
          <div className="bl-hero-stats">
            <div className="bl-stat">
              <span className="bl-stat-value">{LIBRARY_TOTAL.toLocaleString()}+</span>
              <span className="bl-stat-label">Total Bios</span>
            </div>
            <div className="bl-stat">
              <span className="bl-stat-value">{CATEGORY_FACETS.length}+</span>
              <span className="bl-stat-label">Categories</span>
            </div>
            <div className="bl-stat">
              <span className="bl-stat-value">{LANGUAGE_FACETS.length}</span>
              <span className="bl-stat-label">Languages</span>
            </div>
            <div className="bl-stat">
              <span className="bl-stat-value">0</span>
              <span className="bl-stat-label">Total Copies</span>
            </div>
          </div>

          {/* ── Global search ── */}
          <div className="bl-search-wrap">
            <div className="bl-search" role="search" aria-label="Search all ready-made bios">
              <SearchIcon size={18} aria-hidden="true" />
              <input
                type="search"
                className="bc-search-input"
                placeholder="Search ready-made bios... (e.g. Attitude, Love, Gamer)"
                aria-label="Search all ready-made bios"
                value={query.q}
                onChange={(event) => setFacet({ q: event.target.value })}
              />
              <button type="button" className="btn btn-primary" onClick={() => setViewMore(false)}>
                <SearchIcon size={16} aria-hidden="true" /> Search
              </button>
            </div>
            {query.q.trim() && searchSuggestions.length > 0 && (
              <div className="dropdown bl-suggestions" role="listbox" aria-label="Search suggestions">
                {searchSuggestions.map((suggestion) => (
                  <button
                    key={`${suggestion.kind}-${suggestion.value}`}
                    type="button"
                    className="dropdown-item"
                    onClick={() => applySuggestion(suggestion)}
                  >
                    {suggestion.label}
                    <span className="bl-suggestion-count">{suggestion.count} bios</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Category chips (two rows) ── */}
          <div className="bl-category-nav" role="group" aria-label="Browse categories">
            <button
              type="button"
              className={`bl-chip${query.category === 'all' ? ' is-active' : ''}`}
              aria-pressed={query.category === 'all'}
              onClick={() => setFacet({ category: 'all' })}
            >
              All
            </button>
            {CATEGORY_FACETS.slice(0, 7).map((category) => (
              <button
                key={category.value}
                type="button"
                className={`bl-chip${query.category === category.value ? ' is-active' : ''}`}
                aria-pressed={query.category === category.value}
                onClick={() => setFacet({ category: category.value })}
              >
                {category.label}
              </button>
            ))}
            <button
              type="button"
              className="bl-chip bl-chip--more"
              aria-expanded={viewMore}
              aria-label={viewMore ? 'Show fewer categories' : 'Show all categories'}
              onClick={() => setViewMore((current) => !current)}
            >
              <MoreIcon size={16} aria-hidden="true" />
            </button>
          </div>

          {viewMore && (
            <div className="bl-category-nav bl-category-nav--second" role="group" aria-label="More categories">
              <button
                type="button"
                className={`bl-chip${query.category === 'english' ? ' is-active' : ''}`}
                aria-pressed={query.category === 'english'}
                onClick={() => setFacet({ category: 'english' })}
              >
                English
              </button>
              <button
                type="button"
                className={`bl-chip${query.category === 'hinglish' ? ' is-active' : ''}`}
                aria-pressed={query.category === 'hinglish'}
                onClick={() => setFacet({ category: 'hinglish' })}
              >
                Hinglish
              </button>
              <button
                type="button"
                className={`bl-chip${query.category === 'boys' ? ' is-active' : ''}`}
                aria-pressed={query.category === 'boys'}
                onClick={() => setFacet({ category: 'boys' })}
              >
                Boys
              </button>
              <button
                type="button"
                className={`bl-chip${query.category === 'girls' ? ' is-active' : ''}`}
                aria-pressed={query.category === 'girls'}
                onClick={() => setFacet({ category: 'girls' })}
              >
                Girls
              </button>
              <button
                type="button"
                className={`bl-chip${query.category === 'student' ? ' is-active' : ''}`}
                aria-pressed={query.category === 'student'}
                onClick={() => setFacet({ category: 'student' })}
              >
                Student
              </button>
              <button
                type="button"
                className={`bl-chip${query.category === 'creator' ? ' is-active' : ''}`}
                aria-pressed={query.category === 'creator'}
                onClick={() => setFacet({ category: 'creator' })}
              >
                Creator
              </button>
              <button
                type="button"
                className={`bl-chip${query.category === 'aesthetic' ? ' is-active' : ''}`}
                aria-pressed={query.category === 'aesthetic'}
                onClick={() => setFacet({ category: 'aesthetic' })}
              >
                Aesthetic
              </button>
              <button
                type="button"
                className="bl-chip bl-chip--more"
                onClick={() => setViewMore(false)}
              >
                <CloseIcon size={16} aria-hidden="true" />
              </button>
            </div>
          )}

          {/* Expandable, searchable category drawer */}
          {viewMore && (
            <div className="bl-drawer" role="dialog" aria-modal="true" aria-label="All categories">
              <button type="button" className="bl-drawer-close" aria-label="Close categories" onClick={() => setViewMore(false)}>
                <CloseIcon size={20} />
              </button>
              <div className="bl-drawer-head">
                <SearchIcon size={16} aria-hidden="true" />
                <input
                  type="search"
                  className="bc-search-input"
                  placeholder="Search categories…"
                  defaultValue=""
                  onChange={(event) => {
                    const term = event.target.value.trim().toLowerCase();
                    setDrawerSuggestions(
                      CATEGORY_FACETS.filter((c) => c.label.toLowerCase().includes(term)).map((c) => ({ kind: 'category' as const, value: c.value, label: c.label, count: c.count })),
                    );
                  }}
                />
              </div>
              <ul className="bl-drawer-list" role="list">
                {drawerSuggestions.map((s) => (
                  <li key={s.value}>
                    <button
                      type="button"
                      className="bl-drawer-item"
                      onClick={() => {
                        setFacet({ category: s.value });
                        setViewMore(false);
                      }}
                    >
                      <span className="bl-drawer-item-name">{s.label}</span>
                      <span className="bl-drawer-item-count">{s.count} bios</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </header>

        {/* ── Content tabs ── */}
        <nav className="bl-tabs" aria-label="Content tabs">
          {VIEWS.map((tab) => {
            const active = view === tab.view;
            const count = tab.view === 'favorites' ? favourites.size : tab.view === 'all' ? LIBRARY_TOTAL : undefined;
            return (
              <button
                key={tab.view}
                type="button"
                className={`bl-tab${active ? ' is-active' : ''}`}
                aria-pressed={active}
                onClick={() => switchView(tab.view)}
              >
                <tab.icon size={14} aria-hidden="true" />
                {tab.label}
                {count != null ? <span className="bl-tab-count">({count.toLocaleString()}+)</span> : null}
              </button>
            );
          })}
        </nav>

        {/* ── Advanced filters ── */}
        <section className="bl-filters" aria-label="Filter bios">
          <div className="bl-filter-row">
            <Dropdown
              id="lib-language"
              label="Language"
              value={query.lang}
              options={LANGUAGE_FACETS.map((l) => ({ value: l.value, label: l.label }))}
              allLabel={`All languages (${LANGUAGE_FACETS.length})`}
              onChange={(value) => setFacet({ lang: value })}
            />
            <Dropdown
              id="lib-platform"
              label="Platform"
              value={query.platform}
              options={PLATFORM_FACETS.map((p) => ({ value: p.value, label: p.label }))}
              allLabel={`All platforms (${READY_MADE_STATS.platforms})`}
              className="lib-platform"
              onChange={(value) => setFacet({ platform: value })}
            />
            <Dropdown
              id="lib-category"
              label="Category"
              value={query.category}
              options={CATEGORY_FACETS.map((c) => ({ value: c.value, label: c.label }))}
              allLabel={`All categories (${CATEGORY_FACETS.length})`}
              onChange={(value) => setFacet({ category: value })}
            />
            <Dropdown
              id="lib-design"
              label="Style"
              value={activeStyle ?? 'all'}
              options={styleOptions.map((s) => ({ value: s.value, label: s.label }))}
              allLabel={`All styles (${DESIGN_FACETS.length})`}
              onChange={(value) => setFacet({ design: value === 'all' ? 'all' : value })}
            />
            <Dropdown
              id="lib-sort"
              label="Sort"
              value={query.sort}
              options={SORT_FILTERS}
              allLabel="Sort: Popular"
              onChange={(value) => {
                setFacet({ sort: value as LibrarySort });
                setView(value === 'newest' ? 'latest' : value === 'copied' ? 'mostCopied' : 'all');
              }}
            />
            <div className="bl-view-toggle">
              <button type="button" className="bl-view-btn is-active" aria-label="Grid view" aria-pressed="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                </svg>
              </button>
              <button type="button" className="bl-view-btn" aria-label="List view" aria-pressed="false">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="6" width="21" height="1" rx="1" /><rect x="3" y="12" width="21" height="1" rx="1" /><rect x="3" y="18" width="21" height="1" rx="1" />
                </svg>
              </button>
            </div>
          </div>
          <p className="lib-count" role="status" aria-live="polite">
            {orderedResults.length === 0
              ? `No bios match “${query.q.trim() || 'these filters'}”`
              : `Showing ${Math.min(shown.length, orderedResults.length)} of ${orderedResults.length} bios`}
            {activeFilters > 0 ? ` · ${activeFilters} filter${activeFilters === 1 ? '' : 's'} active` : ''}
          </p>
          <div className="lib-toolbar-foot">
            {activeFilters > 0 && (
              <button type="button" className="btn btn-secondary btn-small" onClick={resetAll}>
                <CloseIcon size={14} /> Reset all
              </button>
            )}
          </div>
        </section>

        {/* ── Bio results grid ── */}
        <div ref={resultsRef} className="bl-results">
          {orderedResults.length > 0 ? (
            <>
              <ul className="lib-grid bl-card-grid">
                {shown.map((bio) => {
                  const category = CATEGORY_FACETS.find((facet) => facet.value === bio.categoryId);
                  const isFavourite = favourites.has(bio.id);
                  return (
                    <li key={bio.id}>
                      <article className="lib-card bl-card">
                        <div className="bl-card-header">
                          {category && (
                            <a
                              className="lib-card-collection bl-card-collection"
                              href={`/${bio.collectionSlug}`}
                              onClick={handleAnchorClick}
                            >
                              <span className="bl-badge bl-badge-cat" title={category.label}>
                                <span style={{ marginRight: 6 }}>{'👑'}</span>{category.label}
                              </span>
                            </a>
                          )}
                          <span className={`lib-lang lib-lang--${bio.lang} bl-badge bl-badge-lang bl-badge-lang--${bio.lang}`}>
                            {BIO_LANG_META[bio.lang].label}
                          </span>
                          <button
                            type="button"
                            className="bl-card-menu"
                            aria-label="More options"
                            aria-haspopup="true"
                            aria-expanded={moreMenu?.id === bio.id}
                            onClick={(event) => {
                              setMoreMenu(moreMenu?.id === bio.id ? null : { id: bio.id, anchor: event.currentTarget });
                            }}
                          >
                            <MoreIcon size={18} aria-hidden="true" />
                          </button>
                          {moreMenu?.id === bio.id && (
                            <div className="dropdown bl-more-menu dropdown-menu--end">
                              <button type="button" className="dropdown-item" onClick={() => { void shareBio(bio); setMoreMenu(null); }}>
                                <ShareIcon size={15} aria-hidden="true" /> Share bio
                              </button>
                              <button type="button" className="dropdown-item" onClick={() => { void copyText(`${window.location.origin}${window.location.pathname}`); toast('Link copied'); setMoreMenu(null); }}>
                                Copy page link
                              </button>
                              <button type="button" className="dropdown-item" onClick={() => { openCollection(bio.collectionSlug); setMoreMenu(null); }}>
                                Open {bio.collectionName} collection
                              </button>
                            </div>
                          )}
                        </div>
                        <p className="lib-card-text" tabIndex={-1}>{bio.text}</p>
                        <div className="bl-card-footer">
                          <div className="lib-card-actions">
                            <button
                              type="button"
                              className={`btn btn-secondary${copiedId === bio.id ? ' is-copied' : ''}`}
                              onClick={() => void copyBio(bio)}
                              aria-label={`${copiedId === bio.id ? 'Copied' : 'Copy Bio'} — ${bio.collectionName}`}
                            >
                              {copiedId === bio.id ? (
                                <>
                                  <CheckIcon size={15} aria-hidden="true" /> Copied
                                </>
                              ) : (
                                <>
                                  <ClipboardIcon size={15} aria-hidden="true" /> Copy Bio
                                </>
                              )}
                            </button>
                          </div>
                          <a
                            className="lib-card-link bl-card-share"
                            href={`/${bio.collectionSlug}`}
                            onClick={handleAnchorClick}
                            aria-label="Share this bio"
                          >
                            <ShareIcon size={16} aria-hidden="true" />
                          </a>
                          <button
                            type="button"
                            className={`bl-fav${isFavourite ? ' is-fav' : ''}`}
                            aria-pressed={isFavourite}
                            aria-label={isFavourite ? 'Remove bio from favourites' : 'Save bio to favourites'}
                            onClick={() => toggleFavourite(bio.id)}
                          >
                            <HeartIcon size={18} aria-hidden="true" />
                          </button>
                        </div>
                      </article>
                    </li>
                  );
                })}
              </ul>

              {shown.length < orderedResults.length && (
                <div className="lib-more bl-load-more">
                  <button
                    type="button"
                    className="btn btn-primary btn-large"
                    onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                  >
                    Load more bios
                  </button>
                  <p className="bl-load-more-note">
                    {orderedResults.length - shown.length} more match{orderedResults.length - shown.length === 1 ? '' : 'es'} your filters.
                  </p>
                </div>
              )}

              <nav className="bl-pagination" aria-label="Bio pagination">
                <button type="button" className="bl-pagination-btn" disabled>‹</button>
                <button type="button" className="bl-pagination-btn is-active">1</button>
                <button type="button" className="bl-pagination-btn">2</button>
                <button type="button" className="bl-pagination-btn">3</button>
                <button type="button" className="bl-pagination-btn">4</button>
                <button type="button" className="bl-pagination-btn">5</button>
                <span className="bl-pagination-ellipsis">…</span>
                <button type="button" className="bl-pagination-btn">500</button>
                <button type="button" className="bl-pagination-btn">›</button>
              </nav>
            </>
          ) : (
            <div className="empty-state" role="status">
              <p className="empty-state-title">No bios match “{query.q.trim() || 'these filters'}”</p>
              <p className="empty-state-text">
                Try a shorter keyword — “chai”, “royal”, “hustle”, “सपने” — or widen a filter. Every bio in the
                library is original BioCraft content.
              </p>
              <div className="empty-state-action">
                <button type="button" className="btn btn-secondary btn-small" onClick={resetAll}>
                  Reset filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Mobile bottom navigation ── */}
        <nav className="bl-bottom-nav" aria-label="Quick navigation">
          <a className="bl-nav-item" href="/" onClick={handleAnchorClick}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Home
          </a>
          <a className="bl-nav-item" href="/bio-editor" onClick={handleAnchorClick}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 L12 15l-4 1 1-4 16 6" />
            </svg>
            Generator
          </a>
          <a className="bl-nav-item bl-nav-item--active" aria-current="page" tabIndex={-1}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
            </svg>
            Ready Bios
          </a>
          <a className="bl-nav-item" href="/bio-collections" onClick={handleAnchorClick}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><circle cx="12" cy="7" r="1" />
            </svg>
            Categories
          </a>
          <a className="bl-nav-item" href="/font-library" onClick={handleAnchorClick}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 18V3a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v2a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2z" /><path d="M11 13h1" /><path d="M14 13h1" /><path d="M17 13h1" />
            </svg>
            Fonts
          </a>
        </nav>
      </div>
    </section>
  );
}
