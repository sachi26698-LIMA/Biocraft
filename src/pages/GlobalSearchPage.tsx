import { useCallback, useEffect, useRef, useState } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import { useSearch } from '../lib/router';
import { SearchIcon } from '../components/icons';
import {
  DOMAINS,
  DOMAIN_LABELS,
  SEARCH_PAGE_SIZE,
  hrefForHit,
  searchGlobal,
  type GlobalHit,
  type SearchOutcome,
} from '../lib/globalSearch';

/**
 * Global library search.
 *
 * One box across every bundled library. Results are real entries from content
 * that ships with the application, so the page needs no backend and works with
 * the database unreachable.
 *
 * Design notes:
 *  - Debounced, and every in-flight request is abandoned when a newer one starts,
 *    so fast typing cannot show stale results.
 *  - "Load more" is keyset-free here because `search_global` orders by relevance
 *    and offset paging is correct for a bounded result page; the client never
 *    pulls the whole library.
 *  - Skeleton placeholders keep the layout from shifting, and the list is a plain
 *    semantic list so screen readers get a real count via aria-live.
 */
export default function GlobalSearchPage() {
  // Honour ?q= deep links from the header overlay and shared URLs.
  const search = useSearch();
  const deepLink = new URLSearchParams(search).get('q') ?? '';
  const [query, setQuery] = useState(deepLink);
  const [domain, setDomain] = useState<string | null>(null);
  const [hits, setHits] = useState<GlobalHit[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');
  const [notice, setNotice] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const requestId = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const run = useCallback(async (q: string, d: string | null, offset: number) => {
    const id = ++requestId.current;
    if (offset === 0) setStatus('loading'); else setLoadingMore(true);

    // The index is bundled, so this cannot fail on a network error. The try
    // remains as a guard against a malformed entry rather than a backend state.
    let outcome: SearchOutcome;
    try {
      outcome = await searchGlobal({ query: q, domain: d, offset, limit: SEARCH_PAGE_SIZE });
    } catch {
      if (id !== requestId.current) return;
      setNotice('Search could not read the bundled library.');
      setStatus('done');
      setLoadingMore(false);
      return;
    }

    // A newer keystroke has superseded this response.
    if (id !== requestId.current) return;

    setNotice(null);
    setHits((prev) => (offset === 0 ? outcome.hits : [...prev, ...outcome.hits]));
    setHasMore(outcome.hasMore);
    setStatus('done');
    setLoadingMore(false);
  }, []);

  // Debounce typing so a keystroke is not a query.
  useEffect(() => {
    const timer = window.setTimeout(() => void run(query, domain, 0), query ? 260 : 0);
    return () => window.clearTimeout(timer);
  }, [query, domain, run]);

  // Infinite scroll, but only as an accelerator: the button below always works.
  useEffect(() => {
    const node = sentinel.current;
    if (!node || !hasMore || status === 'loading' || loadingMore) return undefined;
    if (typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) void run(query, domain, hits.length);
      },
      { rootMargin: '320px' },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [hasMore, status, loadingMore, hits.length, query, domain, run]);

  const loading = status === 'loading';

  return (
    <div className="gsearch">
      <Breadcrumbs trail={[{ label: 'Home', href: '/' }, { label: 'Search library' }]} />
      <header className="gsearch-head">
        <h1>Search every library</h1>
        <p>
          Bios, captions, hashtags, symbols, fonts and emoji — one search. Every result is a real
          entry from BioCraft’s own library, loaded with the page.
        </p>
      </header>

      <div className="gsearch-bar">
        <SearchIcon />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Try “travel”, “grinning”, “ABeeZee”, or a hashtag…"
          aria-label="Search all content libraries"
          autoComplete="off"
          spellCheck={false}
        />
        {loading && <span className="gsearch-spinner" role="status" aria-label="Searching" />}
      </div>

      <div className="gsearch-filters" role="group" aria-label="Filter by library">
        <button
          type="button"
          className={`gsearch-chip${domain === null ? ' is-active' : ''}`}
          onClick={() => setDomain(null)}
          aria-pressed={domain === null}
        >
          All
        </button>
        {DOMAINS.map((d) => (
          <button
            key={d}
            type="button"
            className={`gsearch-chip${domain === d ? ' is-active' : ''}`}
            onClick={() => setDomain(domain === d ? null : d)}
            aria-pressed={domain === d}
          >
            {DOMAIN_LABELS[d]}
          </button>
        ))}
      </div>

      {notice && (
        <p className="gsearch-notice" role="status">
          {notice}
        </p>
      )}

      {/* aria-live reports the real number of loaded rows, never an estimate. */}
      <p className="gsearch-count" aria-live="polite">
        {notice
          ? ''
          : loading
            ? 'Searching…'
            : hits.length === 0
              ? 'No stored entries match yet.'
              : `${hits.length}${hasMore ? '+' : ''} ${hits.length === 1 ? 'entry' : 'entries'}`}
      </p>

      <ul className="gsearch-list">
        {loading &&
          hits.length === 0 &&
          Array.from({ length: 6 }).map((_, i) => (
            <li key={`sk-${i}`} className="gsearch-skeleton" aria-hidden="true" />
          ))}

        {hits.map((hit) => (
          <li key={hit.id} className="gsearch-item">
            <a href={hrefForHit(hit)} className="gsearch-item-link">
              <span className="gsearch-badge">{DOMAIN_LABELS[hit.domain] ?? hit.domain}</span>
              <span className="gsearch-body">
                {hit.title && <strong>{hit.title}</strong>}
                <span className="gsearch-text">{hit.body}</span>
              </span>
              {hit.language && <span className="gsearch-lang">{hit.language}</span>}
            </a>
          </li>
        ))}
      </ul>

      <div ref={sentinel} aria-hidden="true" />

      {hasMore && (
        <button
          type="button"
          className="gsearch-more"
          onClick={() => void run(query, domain, hits.length)}
          disabled={loadingMore}
        >
          {loadingMore ? 'Loading…' : 'Load more'}
        </button>
      )}
    </div>
  );
}
