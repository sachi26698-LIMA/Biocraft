import { useMemo, useState } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import { handleAnchorClick } from '../lib/router';
import { ArrowRightIcon, SearchIcon, CloseIcon, ChevronRightIcon } from '../components/icons';
import CollectionIcon from '../components/CollectionIcon';
import {
  BIO_COLLECTIONS,
  COLLECTION_NAV,
  POPULAR_COLLECTIONS,
  RECENTLY_ADDED_COLLECTIONS,
  TOTAL_BIOS,
  collectionBySlug,
} from '../lib/bioCollections';

/**
 * /bio-collections — browse every ready-made bio collection.
 * Search filters collections by name, description and slug; the quick-jump
 * chips filter the grid. Counts are computed from the registry.
 */
export default function BioCollectionsPage() {
  const [query, setQuery] = useState('');
  const [activeNav, setActiveNav] = useState<string | null>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return BIO_COLLECTIONS.filter((collection) => {
      if (activeNav && collection.slug !== activeNav) return false;
      if (!q) return true;
      const haystack = `${collection.name} ${collection.description} ${collection.slug} ${collection.languages} ${collection.audience}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [query, activeNav]);

  const popular = POPULAR_COLLECTIONS.map(collectionBySlug).filter(Boolean) as typeof BIO_COLLECTIONS;
  const recent = RECENTLY_ADDED_COLLECTIONS.map(collectionBySlug).filter(Boolean) as typeof BIO_COLLECTIONS;

  return (
    <section className="page bio-collections-page">
      <div className="container narrow">
        <Breadcrumbs
          trail={[
            { label: 'Home', href: '/' },
            { label: 'Bio Collections' },
          ]}
        />

        <header className="hub-header">
          <span className="hub-header-icon bc-hub-icon" aria-hidden="true"><CollectionIcon name="type" size={26} /></span>
          <span className="hub-header-body">
            <h1>Ready-Made Bio Collections</h1>
            <p>
              {BIO_COLLECTIONS.length} original, copy-ready collections — English, Hindi and Hinglish.
              Pick a category, copy a bio, paste it anywhere. Free, private and unlimited.
            </p>
          </span>
          <span className="hub-header-count" aria-label={`${BIO_COLLECTIONS.length} collections, ${TOTAL_BIOS} bios`}>
            {BIO_COLLECTIONS.length} collections · {TOTAL_BIOS} bios
          </span>
        </header>

        {/* Quick-jump category navigation */}
        <nav className="bc-nav" aria-label="Bio collection categories">
          <button
            type="button"
            className={`bc-nav-chip${activeNav === null ? ' is-active' : ''}`}
            aria-pressed={activeNav === null}
            onClick={() => setActiveNav(null)}
          >
            All
          </button>
          {COLLECTION_NAV.map((item) => (
            <button
              key={item.slug}
              type="button"
              className={`bc-nav-chip${activeNav === item.slug ? ' is-active' : ''}`}
              aria-pressed={activeNav === item.slug}
              onClick={() => setActiveNav((current) => (current === item.slug ? null : item.slug))}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Search */}
        <div className="bc-search" role="search">
          <SearchIcon size={18} aria-hidden="true" />
          <input
            type="search"
            className="bc-search-input"
            placeholder="Search collections — boys, girls, Hindi, attitude, love…"
            aria-label="Search bio collections"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          {query && (
            <button type="button" className="bc-search-clear" aria-label="Clear search" onClick={() => setQuery('')}>
              <CloseIcon size={16} />
            </button>
          )}
        </div>
        <p className="bc-result-count" role="status">
          {visible.length === 1 ? '1 collection' : `${visible.length} collections`}
          {activeNav ? ' in this category' : ''}
          {query.trim() ? ` for “${query.trim()}”` : ''}
        </p>

        {/* Collection grid */}
        {visible.length > 0 ? (
          <ul className="bc-grid">
            {visible.map((collection) => (
              <li key={collection.slug}>
                <a className="bc-card" href={`/${collection.slug}`} onClick={handleAnchorClick}>
                  <span className="bc-card-icon" aria-hidden="true"><CollectionIcon name={collection.icon} size={26} /></span>
                  <span className="bc-card-body">
                    <span className="bc-card-name">{collection.name}</span>
                    <span className="bc-card-desc">{collection.description}</span>
                    <span className="bc-card-meta">
                      {collection.bios.length} bios · {collection.languages}
                      <ChevronRightIcon size={15} aria-hidden="true" />
                    </span>
                  </span>
                  <span className="bc-card-cta" aria-hidden="true">Explore <ArrowRightIcon size={16} /></span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-state" role="status">
            <p className="empty-state-title">No collections match “{query.trim()}”</p>
            <p className="empty-state-text">Try a shorter keyword — “bio”, “Hindi”, “love” or “attitude” — or clear the category filter.</p>
            <button type="button" className="btn btn-secondary btn-small" onClick={() => { setQuery(''); setActiveNav(null); }}>
              Reset filters
            </button>
          </div>
        )}

        {/* Popular collections rail */}
        <section className="bc-rail" aria-labelledby="bc-popular-title">
          <div className="bc-rail-head">
            <h2 id="bc-popular-title">Popular collections</h2>
            <p>The ones our visitors open most.</p>
          </div>
          <ul className="bc-chip-row">
            {popular.map((collection) => (
              <li key={collection.slug}>
                <a className="chip bc-chip" href={`/${collection.slug}`} onClick={handleAnchorClick}>
                  <CollectionIcon name={collection.icon} size={16} /> {collection.name}
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* Recently added rail */}
        <section className="bc-rail" aria-labelledby="bc-recent-title">
          <div className="bc-rail-head">
            <h2 id="bc-recent-title">Recently added</h2>
            <p>Fresh from the BioCraft studio.</p>
          </div>
          <ul className="bc-chip-row">
            {recent.map((collection) => (
              <li key={collection.slug}>
                <a className="chip bc-chip" href={`/${collection.slug}`} onClick={handleAnchorClick}>
                  <CollectionIcon name={collection.icon} size={16} /> {collection.name}
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* Generator cross-link */}
        <p className="bc-generator-note">
          Want something written fresh for you instead?{' '}
          <a href="/bio-generator" onClick={handleAnchorClick}>Try the AI-free Bio Generator</a> — five unique bios from
          your own details, in English, Hindi or Hinglish.
        </p>
      </div>
    </section>
  );
}
