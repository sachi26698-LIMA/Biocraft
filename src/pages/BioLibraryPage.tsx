import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import CollectionIcon from '../components/CollectionIcon';
import { handleAnchorClick, navigate, useSearch } from '../lib/router';
import { copyText } from '../lib/clipboard';
import { toast } from '../lib/toast';
import { ChevronRightIcon, ClipboardIcon, CloseIcon, SearchIcon } from '../components/icons';
import {
  CATEGORY_FACETS,
  COLLECTION_FACETS,
  DESIGN_FACETS,
  EMPTY_LIBRARY_QUERY,
  LANGUAGE_FACETS,
  LIBRARY_SORTS,
  LIBRARY_TOTAL,
  PLATFORM_FACETS,
  READY_MADE_STATS,
  activeFilterCount,
  libraryQueryToSearch,
  parseLibraryQuery,
  queryLibrary,
  type LibraryQuery,
  type LibrarySort,
} from '../lib/readyMadeBios';
import { BIO_LANG_META } from '../lib/readyMadeBios';

const PAGE_SIZE = 36;

interface FacetSelectProps {
  id: string;
  label: string;
  value: string;
  options: Array<{ value: string; label: string; count: number }>;
  allLabel: string;
  onChange: (value: string) => void;
}

function FacetSelect({ id, label, value, options, allLabel, onChange }: FacetSelectProps) {
  return (
    <div className="lib-facet">
      <label htmlFor={id}>{label}</label>
      <select id={id} className="select" value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="all">{allLabel}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label} ({option.count})
          </option>
        ))}
      </select>
    </div>
  );
}

/**
 * /bio-library — the complete Ready-Made Bio Library.
 *
 * Every row comes from the bundled registry (506 bios / 20 collections today),
 * counts are computed from that data, and every filter state is mirrored in the
 * URL so a filtered view can be shared, refreshed and reached by Back/Forward.
 */
export default function BioLibraryPage() {
  const search = useSearch();
  const [query, setQuery] = useState<LibraryQuery>(() =>
    typeof window === 'undefined' ? EMPTY_LIBRARY_QUERY : parseLibraryQuery(window.location.search),
  );
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const resultsRef = useRef<HTMLDivElement>(null);
  const lastSerialized = useRef(libraryQueryToSearch(query));

  // Adopt query-string changes that did not originate from this component
  // (hub deep links, footer links, browser Back/Forward).
  useEffect(() => {
    const next = parseLibraryQuery(search);
    const serialized = libraryQueryToSearch(next);
    if (serialized === lastSerialized.current) return;
    lastSerialized.current = serialized;
    setQuery(next);
    setVisibleCount(PAGE_SIZE);
  }, [search]);

  // Mirror user-driven filter changes into the URL without stacking history.
  const commit = useCallback((next: LibraryQuery) => {
    setQuery(next);
    setVisibleCount(PAGE_SIZE);
    const serialized = libraryQueryToSearch(next);
    lastSerialized.current = serialized;
    if (serialized !== window.location.search) {
      navigate(`/bio-library${serialized}`, { replace: true });
    }
  }, []);

  const deferredQueryText = useDeferredValue(query.q);
  const effectiveQuery = useMemo(
    () => ({ ...query, q: deferredQueryText }),
    [query, deferredQueryText],
  );
  const results = useMemo(() => queryLibrary(effectiveQuery), [effectiveQuery]);
  const shown = results.slice(0, visibleCount);
  const activeFilters = activeFilterCount(query);

  const setFacet = (patch: Partial<LibraryQuery>) => commit({ ...query, ...patch });

  const resetAll = () => {
    commit(EMPTY_LIBRARY_QUERY);
    resultsRef.current?.scrollIntoView({ block: 'start' });
  };

  const copyBio = async (text: string, label: string) => {
    const ok = await copyText(text);
    toast(ok ? `${label} copied to clipboard` : 'Could not copy — select the text and copy manually');
  };

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

        <header className="lib-header">
          <div className="lib-header-text">
            <p className="eyebrow">Complete bio library</p>
            <h1>Bio Library</h1>
            <p className="lib-lede">
              Search and filter all {LIBRARY_TOTAL} copy-ready bios across {READY_MADE_STATS.collections}{' '}
              collections — {READY_MADE_STATS.languages} languages, {READY_MADE_STATS.platforms} platforms and{' '}
              {READY_MADE_STATS.designs} design styles. Every result is real BioCraft content.
            </p>
          </div>
          <div className="lib-header-stats" aria-label="Library totals">
            <span><strong>{LIBRARY_TOTAL}</strong> bios</span>
            <span><strong>{READY_MADE_STATS.collections}</strong> collections</span>
            <span><strong>{READY_MADE_STATS.categories}</strong> categories</span>
          </div>
        </header>

        <div className="lib-toolbar" role="search">
          <div className="lib-search">
            <SearchIcon size={18} aria-hidden="true" />
            <input
              type="search"
              className="bc-search-input"
              placeholder="Search bios — travel, hustle, chai, royal, सपने…"
              aria-label="Search all ready-made bios"
              value={query.q}
              onChange={(event) => setFacet({ q: event.target.value })}
            />
            {query.q && (
              <button
                type="button"
                className="bc-search-clear"
                aria-label="Clear bio search"
                onClick={() => setFacet({ q: '' })}
              >
                <CloseIcon size={16} />
              </button>
            )}
          </div>

          <div className="lib-facets">
            <FacetSelect
              id="lib-category"
              label="Category"
              value={query.category}
              allLabel={`All categories (${READY_MADE_STATS.categories})`}
              options={CATEGORY_FACETS}
              onChange={(value) => setFacet({ category: value })}
            />
            <FacetSelect
              id="lib-platform"
              label="Platform"
              value={query.platform}
              allLabel={`All platforms (${READY_MADE_STATS.platforms})`}
              options={PLATFORM_FACETS}
              onChange={(value) => setFacet({ platform: value })}
            />
            <FacetSelect
              id="lib-language"
              label="Language"
              value={query.lang}
              allLabel={`All languages (${READY_MADE_STATS.languages})`}
              options={LANGUAGE_FACETS}
              onChange={(value) => setFacet({ lang: value })}
            />
            <FacetSelect
              id="lib-design"
              label="Design"
              value={query.design}
              allLabel={`All designs (${READY_MADE_STATS.designs})`}
              options={DESIGN_FACETS}
              onChange={(value) => setFacet({ design: value })}
            />
            <FacetSelect
              id="lib-collection"
              label="Collection"
              value={query.collection}
              allLabel={`All collections (${READY_MADE_STATS.collections})`}
              options={COLLECTION_FACETS}
              onChange={(value) => setFacet({ collection: value })}
            />
            <div className="lib-facet">
              <label htmlFor="lib-sort">Sort by</label>
              <select
                id="lib-sort"
                className="select"
                value={query.sort}
                onChange={(event) => setFacet({ sort: event.target.value as LibrarySort })}
              >
                {LIBRARY_SORTS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="lib-toolbar-foot">
            <p className="lib-count" role="status" aria-live="polite">
              {results.length === 0
                ? 'No bios match these filters'
                : `Showing ${Math.min(shown.length, results.length)} of ${results.length} bios`}
              {activeFilters > 0 ? ` · ${activeFilters} filter${activeFilters === 1 ? '' : 's'} active` : ''}
            </p>
            {activeFilters > 0 && (
              <button type="button" className="btn btn-secondary btn-small" onClick={resetAll}>
                Reset filters
              </button>
            )}
          </div>
        </div>

        <div ref={resultsRef} className="lib-results">
          {results.length > 0 ? (
            <>
              <ul className="lib-grid">
                {shown.map((bio) => (
                  <li key={bio.id}>
                    <article className="lib-card">
                      <div className="lib-card-top">
                        <a className="lib-card-collection" href={`/${bio.collectionSlug}`} onClick={handleAnchorClick}>
                          <span aria-hidden="true"><CollectionIcon name={bio.collectionIcon} size={15} /></span>
                          {bio.collectionName}
                        </a>
                        <span className={`lib-lang lib-lang--${bio.lang}`}>{BIO_LANG_META[bio.lang].label}</span>
                      </div>
                      <p className="lib-card-text">{bio.text}</p>
                      <div className="lib-card-foot">
                        <span className="lib-design">{bio.designName}</span>
                        <div className="lib-card-actions">
                          <button
                            type="button"
                            className="btn btn-secondary btn-small"
                            onClick={() => void copyBio(bio.text, 'Bio')}
                            aria-label={`Copy this bio from ${bio.collectionName}`}
                          >
                            <ClipboardIcon size={15} aria-hidden="true" /> Copy
                          </button>
                          <a className="lib-card-link" href={`/${bio.collectionSlug}`} onClick={handleAnchorClick}>
                            Open collection <ChevronRightIcon size={14} aria-hidden="true" />
                          </a>
                        </div>
                      </div>
                    </article>
                  </li>
                ))}
              </ul>

              {shown.length < results.length && (
                <div className="lib-more">
                  <button
                    type="button"
                    className="btn btn-primary btn-large"
                    onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                  >
                    Load {Math.min(PAGE_SIZE, results.length - shown.length)} more bios
                  </button>
                  <p className="lib-more-note">
                    {results.length - shown.length} more match{results.length - shown.length === 1 ? '' : 'es'} your filters.
                  </p>
                </div>
              )}
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

        <aside className="lib-crosslink">
          <p>
            Want a bio written fresh from your own details?{' '}
            <a href="/bio-generator" onClick={handleAnchorClick}>Try the Bio Generator</a> — five unique bios,
            English, Hindi or Hinglish. Prefer to build one by hand?{' '}
            <a href="/bio-editor" onClick={handleAnchorClick}>Open the Bio Editor</a>.
          </p>
          <a className="btn btn-secondary btn-small" href="/bio-collections" onClick={handleAnchorClick}>
            Browse collections instead
          </a>
        </aside>
      </div>
    </section>
  );
}
