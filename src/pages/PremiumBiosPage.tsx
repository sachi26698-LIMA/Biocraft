import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import { copyText } from '../lib/clipboard';
import { toast } from '../lib/toast';
import { handleAnchorClick } from '../lib/router';
import { CheckIcon, ClipboardIcon, HeartIcon, SearchIcon, CloseIcon } from '../components/icons';
import {
  EMPTY_PREMIUM_QUERY,
  LANG_FILTERS,
  PREMIUM_SORTS,
  PREMIUM_STATS,
  activePremiumFilters,
  allTones,
  categoryCounts,
  pageOf,
  parsePremiumQuery,
  premiumQueryToSearch,
  queryIndices,
  type PremiumBio,
  type PremiumQuery,
} from '../lib/premiumBios';

const PAGE_SIZE = 36;

/** Favourites live in the browser, like the rest of the toolkit. No account. */
const FAVOURITES_KEY = 'biocraft.premium.favourites.v1';

function readFavourites(): Set<string> {
  try {
    const raw = localStorage.getItem(FAVOURITES_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return new Set(Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : []);
  } catch {
    return new Set();
  }
}

function BioCard({
  bio, favourite, copied, onCopy, onFavourite,
}: {
  bio: PremiumBio; favourite: boolean; copied: boolean;
  onCopy: (bio: PremiumBio) => void; onFavourite: (id: string) => void;
}) {
  return (
    <li className="pm-bio-card">
      <p className="pm-bio-text">{bio.text}</p>
      <div className="pm-bio-meta">
        <span className={`pm-tag pm-tag--${bio.lang}`}>
          {bio.lang === 'hi' ? 'हिंदी' : bio.lang === 'hg' ? 'Hinglish' : 'English'}
        </span>
        <span className="pm-tag pm-tag--muted">{bio.category}</span>
        <span className="pm-tag pm-tag--muted">{bio.chars} chars</span>
      </div>
      <div className="pm-bio-actions">
        <button type="button" className="btn btn-secondary btn-small" onClick={() => onCopy(bio)}>
          {copied ? <CheckIcon size={14} /> : <ClipboardIcon size={14} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
        <button
          type="button"
          className={`pm-fav${favourite ? ' is-fav' : ''}`}
          aria-pressed={favourite}
          aria-label={favourite ? `Remove bio from favourites` : `Save bio to favourites`}
          onClick={() => onFavourite(bio.id)}
        >
          <HeartIcon size={15} />
        </button>
      </div>
    </li>
  );
}

/**
 * /premium-bios — the expanded premium ready-made bio library.
 *
 * Kept separate from /bio-library so the existing curated collection browse
 * experience is untouched. This page is the deep, filterable index: language,
 * category, tone, search, sort, pagination, favourites and copy.
 *
 * Rendering strategy: `queryIndices` resolves the filter to record ids without
 * materialising records, and only the visible page is turned into card objects.
 * Opening the page therefore never builds 50,000 React elements.
 */
export default function PremiumBiosPage() {
  const [query, setQuery] = useState<PremiumQuery>(() =>
    typeof window === 'undefined' ? EMPTY_PREMIUM_QUERY : parsePremiumQuery(window.location.search),
  );
  const deferredQ = useDeferredValue(query.q);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [favourites, setFavourites] = useState<Set<string>>(() => readFavourites());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const effectiveQuery = useMemo<PremiumQuery>(
    () => ({ ...query, q: deferredQ }),
    [query, deferredQ],
  );

  const indices = useMemo(() => queryIndices(effectiveQuery), [effectiveQuery]);

  // Reset paging whenever the result set changes shape.
  useEffect(() => { setVisible(PAGE_SIZE); }, [effectiveQuery]);

  // Mirror filter state into the URL so a view can be shared and reloaded.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const next = `/premium-bios${premiumQueryToSearch(query)}`;
    if (`${window.location.pathname}${window.location.search}` !== next) {
      window.history.replaceState(null, '', next);
    }
  }, [query]);

  const page = useMemo(() => pageOf(indices, 0, visible), [indices, visible]);

  const copy = useCallback(async (bio: PremiumBio) => {
    const ok = await copyText(bio.text);
    setCopiedId(ok ? bio.id : null);
    toast(ok ? 'Bio copied to clipboard' : 'Copying failed — select the text and copy manually');
    window.setTimeout(() => setCopiedId(null), 1600);
  }, []);

  const toggleFavourite = useCallback((id: string) => {
    setFavourites((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try { localStorage.setItem(FAVOURITES_KEY, JSON.stringify([...next])); } catch { /* storage full or blocked */ }
      return next;
    });
  }, []);

  const patch = (change: Partial<PremiumQuery>) => setQuery((prev) => ({ ...prev, ...change }));
  const activeFilters = activePremiumFilters(query);
  const categories = useMemo(() => categoryCounts(), []);
  const tones = useMemo(() => allTones(), []);

  return (
    <article className="page-shell">
      <div className="container">
        <Breadcrumbs trail={[{ label: 'Home', href: '/' }, { label: 'Premium bios' }]} />

        <header className="hub-header">
          <span className="hub-header-icon" aria-hidden="true">
            <HeartIcon size={26} />
          </span>
          <span className="hub-header-body">
            <h1 id="page-title">Premium Bio Library</h1>
            <p>
              {PREMIUM_STATS.total.toLocaleString()} verified, original bios —{' '}
              {PREMIUM_STATS.byLang.en.toLocaleString()} English,{' '}
              {PREMIUM_STATS.byLang.hi.toLocaleString()} Hindi and{' '}
              {PREMIUM_STATS.byLang.hg.toLocaleString()} Hinglish, across{' '}
              {Object.keys(PREMIUM_STATS.byCategory).length} categories.
            </p>
          </span>
          <span className="hub-header-count">
            {PREMIUM_STATS.total.toLocaleString()} bios
          </span>
        </header>

        <p className="pm-disclosure" role="note" style={{ marginBottom: 12 }}>
          Looking for hand-curated collection bios instead?{' '}
          <a href="/bio-library" onClick={handleAnchorClick}>
            The 506 ready-made bios
          </a>{' '}
          are grouped by collection, mood and platform.
        </p>

        {!PREMIUM_STATS.complete && (
          <p className="pm-disclosure" role="note">
            This library is being written in verified batches. It currently holds{' '}
            <strong>{PREMIUM_STATS.total.toLocaleString()}</strong> of the 50,000 target
            ({PREMIUM_STATS.shortfall.total.toLocaleString()} still to write). Only records that have
            passed duplicate, language and script checks are counted here.
          </p>
        )}

        <section className="pm-filters" aria-label="Filter bios">
          <div className="pm-search">
            <label className="sr-only" htmlFor="pm-q">Search bios</label>
            <div className="input-with-icon">
              <SearchIcon size={18} />
              <input
                id="pm-q"
                type="search"
                placeholder="Search bios, categories, tags…"
                value={query.q}
                onChange={(event) => patch({ q: event.target.value })}
              />
            </div>
          </div>

          <div className="pm-facet-row">
            <div className="lib-facet">
              <label htmlFor="pm-lang">Language</label>
              <select id="pm-lang" className="select" value={query.lang} onChange={(e) => patch({ lang: e.target.value })}>
                {LANG_FILTERS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                    {option.value !== 'all' ? ` (${PREMIUM_STATS.byLang[option.value as 'en' | 'hi' | 'hg'].toLocaleString()})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="lib-facet">
              <label htmlFor="pm-category">Category</label>
              <select id="pm-category" className="select" value={query.category} onChange={(e) => patch({ category: e.target.value })}>
                <option value="all">All categories ({PREMIUM_STATS.total.toLocaleString()})</option>
                {categories.map((category) => (
                  <option key={category.name} value={category.name}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>
            </div>

            <div className="lib-facet">
              <label htmlFor="pm-tone">Tone</label>
              <select id="pm-tone" className="select" value={query.tone} onChange={(e) => patch({ tone: e.target.value })}>
                <option value="all">Any tone</option>
                {tones.map((tone) => <option key={tone} value={tone}>{tone}</option>)}
              </select>
            </div>

            <div className="lib-facet">
              <label htmlFor="pm-sort">Sort</label>
              <select id="pm-sort" className="select" value={query.sort} onChange={(e) => patch({ sort: e.target.value as PremiumQuery['sort'] })}>
                {PREMIUM_SORTS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </div>

            {activeFilters > 0 && (
              <button type="button" className="btn btn-secondary btn-small pm-reset" onClick={() => setQuery(EMPTY_PREMIUM_QUERY)}>
                <CloseIcon size={14} /> Reset {activeFilters} filter{activeFilters === 1 ? '' : 's'}
              </button>
            )}
          </div>
        </section>

        <div className="pm-results-head">
          <p className="pm-count" role="status">
            {indices.length.toLocaleString()} bios
            {query.lang !== 'all' ? ` · ${LANG_FILTERS.find((l) => l.value === query.lang)?.label}` : ''}
            {query.category !== 'all' ? ` · ${query.category}` : ''}
            {favourites.size > 0 ? ` · ${favourites.size} saved` : ''}
          </p>
        </div>

        <div ref={resultsRef}>
          {page.length > 0 ? (
            <ul className="pm-bio-grid">
              {page.map((bio) => (
                <BioCard
                  key={bio.id}
                  bio={bio}
                  favourite={favourites.has(bio.id)}
                  copied={copiedId === bio.id}
                  onCopy={copy}
                  onFavourite={toggleFavourite}
                />
              ))}
            </ul>
          ) : (
            <div className="empty-state">
              <p className="empty-state-title">No bios match those filters.</p>
              <p className="empty-state-text">
                Try a broader search, or reset the filters to see all{' '}
                {PREMIUM_STATS.total.toLocaleString()} bios.
              </p>
              {activeFilters > 0 && (
                <button type="button" className="btn btn-primary" onClick={() => setQuery(EMPTY_PREMIUM_QUERY)}>
                  Reset filters
                </button>
              )}
            </div>
          )}
        </div>

        {page.length < indices.length && (
          <div className="pm-more">
            <button type="button" className="btn btn-secondary" onClick={() => setVisible((n) => n + PAGE_SIZE * 2)}>
              Show more ({(indices.length - page.length).toLocaleString()} remaining)
            </button>
          </div>
        )}

        <p className="tool-note">
          Every bio here was written for BioCraft and passed six duplicate checks plus a script
          check before it was counted.{' '}
          <a href="/bio-collections" onClick={handleAnchorClick}>Browse curated collections</a> for a
          hand-picked walkthrough instead.
        </p>
      </div>
    </article>
  );
}
