import { useMemo, useState } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import { handleAnchorClick } from '../lib/router';
import {
  ArrowRightIcon,
  SearchIcon,
  CloseIcon,
  ChevronRightIcon,
  SparkIcon,
  TypeIcon,
  ListIcon,
  GlobeIcon,
  LayersIcon,
} from '../components/icons';
import CollectionIcon from '../components/CollectionIcon';
import {
  BIO_LANG_META,
  CATEGORY_SUMMARIES,
  COLLECTION_SUMMARIES,
  FEATURED_COLLECTIONS,
  FEATURED_DESIGNS,
  LANGUAGE_FACETS,
  PLATFORM_FACETS,
  READY_MADE_STATS,
  RECENT_COLLECTIONS,
  type CollectionSummary,
} from '../lib/readyMadeBios';

/** Platforms that exist on BioCraft's tools but have no bundled collection. */
const PLATFORM_TOOLS = [
  { id: 'instagram', label: 'Instagram', limit: '150 characters' },
  { id: 'facebook', label: 'Facebook', limit: '101-character intro' },
  { id: 'threads', label: 'Threads', limit: '150 characters' },
  { id: 'tiktok', label: 'TikTok', limit: '80 characters' },
  { id: 'x', label: 'X', limit: '160 characters' },
  { id: 'linkedin', label: 'LinkedIn', limit: '2,600 About' },
  { id: 'whatsapp', label: 'WhatsApp', limit: '139 About' },
  { id: 'snapchat', label: 'Snapchat', limit: '≈150 bio' },
] as const;

function SectionHead({
  id,
  eyebrow,
  title,
  sub,
  href,
  linkLabel,
}: {
  id: string;
  eyebrow: string;
  title: string;
  sub: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="rmb-section-head">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={id}>{title}</h2>
        <p className="rmb-section-sub">{sub}</p>
      </div>
      {href && linkLabel && (
        <a className="rmb-section-link" href={href} onClick={handleAnchorClick}>
          {linkLabel} <ArrowRightIcon size={15} aria-hidden="true" />
        </a>
      )}
    </div>
  );
}

function CollectionCard({
  collection,
  featured = false,
  recent = false,
}: {
  collection: CollectionSummary;
  featured?: boolean;
  recent?: boolean;
}) {
  return (
    <a
      className={`rmb-collection${featured ? ' rmb-collection--featured' : ''}`}
      href={collection.href}
      onClick={handleAnchorClick}
    >
      <span className="rmb-collection-icon" aria-hidden="true">
        <CollectionIcon name={collection.icon} size={featured ? 26 : 22} />
      </span>
      <span className="rmb-collection-body">
        <span className="rmb-collection-topline">
          <span className="rmb-collection-name">{collection.name}</span>
          {recent && <span className="rmb-badge rmb-badge--new">New</span>}
        </span>
        <span className="rmb-collection-desc">{collection.description}</span>
        <span className="rmb-collection-meta">
          <span>{collection.count} bios</span>
          <span aria-hidden="true">·</span>
          <span>{collection.categoryLabel}</span>
          <span aria-hidden="true">·</span>
          <span>{collection.updated}</span>
        </span>
      </span>
      <span className="rmb-collection-cta" aria-hidden="true">
        Explore <ChevronRightIcon size={16} />
      </span>
    </a>
  );
}

/**
 * /bio-collections — the Ready-Made Bios hub.
 *
 * Organised discovery, not a wall of cards:
 * header + search → featured collections → categories → recently added →
 * designs → platforms → languages → every collection → library CTA.
 * Nothing here duplicates a bio: cards link to collection pages or to the
 * filtered library, and all counts come from the registry.
 */
export default function BioCollectionsPage() {
  const [queryText, setQueryText] = useState('');

  const filteredCollections = useMemo(() => {
    const q = queryText.trim().toLowerCase();
    if (!q) return null;
    return COLLECTION_SUMMARIES.filter((collection) =>
      `${collection.name} ${collection.description} ${collection.categoryLabel} ${collection.languages}`
        .toLowerCase()
        .includes(q),
    );
  }, [queryText]);

  const libraryHref = queryText.trim()
    ? `/bio-library?q=${encodeURIComponent(queryText.trim())}`
    : '/bio-library';

  return (
    <section className="page bio-collections-page">
      <div className="container">
        <Breadcrumbs trail={[{ label: 'Home', href: '/' }, { label: 'Ready-Made Bios' }]} />

        {/* ---------- A. Header ---------- */}
        <header className="rmb-hero">
          <div className="rmb-hero-text">
            <p className="eyebrow">Ready-Made Bios</p>
            <h1>Copy-ready bios, organised by who you are</h1>
            <p className="rmb-lede">
              {READY_MADE_STATS.bios} original bios across {READY_MADE_STATS.collections} curated collections —{' '}
              {READY_MADE_STATS.languages} languages, {READY_MADE_STATS.designs} design styles. Copy any line in one
              tap, or filter the full library down to exactly what fits your profile.
            </p>
          </div>
          <dl className="rmb-stats">
            <div><dt>Bios</dt><dd>{READY_MADE_STATS.bios}</dd></div>
            <div><dt>Collections</dt><dd>{READY_MADE_STATS.collections}</dd></div>
            <div><dt>Categories</dt><dd>{READY_MADE_STATS.categories}</dd></div>
            <div><dt>Languages</dt><dd>{READY_MADE_STATS.languages}</dd></div>
          </dl>
        </header>

        <div className="rmb-search-row">
          <div className="bc-search rmb-search" role="search">
            <SearchIcon size={18} aria-hidden="true" />
            <input
              type="search"
              className="bc-search-input"
              placeholder="Search bios and collections — boys, chai, royal, Hindi…"
              aria-label="Search ready-made bios and collections"
              value={queryText}
              onChange={(event) => setQueryText(event.target.value)}
            />
            {queryText && (
              <button
                type="button"
                className="bc-search-clear"
                aria-label="Clear search"
                onClick={() => setQueryText('')}
              >
                <CloseIcon size={16} />
              </button>
            )}
          </div>
          <a className="btn btn-primary rmb-viewall" href={libraryHref} onClick={handleAnchorClick}>
            View all {READY_MADE_STATS.bios} bios <ArrowRightIcon size={16} aria-hidden="true" />
          </a>
        </div>

        {filteredCollections ? (
          <section className="rmb-section" aria-labelledby="rmb-results-title">
            <SectionHead
              id="rmb-results-title"
              eyebrow="Search results"
              title={`${filteredCollections.length} collection${filteredCollections.length === 1 ? '' : 's'} match`}
              sub={`Collections matching “${queryText.trim()}”.`}
              href={libraryHref}
              linkLabel="Search every bio instead"
            />
            {filteredCollections.length > 0 ? (
              <ul className="rmb-collection-grid">
                {filteredCollections.map((collection) => (
                  <li key={collection.slug}><CollectionCard collection={collection} /></li>
                ))}
              </ul>
            ) : (
              <div className="empty-state" role="status">
                <p className="empty-state-title">No collections match “{queryText.trim()}”</p>
                <p className="empty-state-text">
                  Try “attitude”, “Hindi”, “royal” or search individual bios in the library.
                </p>
                <div className="empty-state-action">
                  <a className="btn btn-secondary btn-small" href={libraryHref} onClick={handleAnchorClick}>
                    Search all {READY_MADE_STATS.bios} bios
                  </a>
                </div>
              </div>
            )}
          </section>
        ) : (
          <>
            {/* ---------- B. Featured collections ---------- */}
            <section className="rmb-section" aria-labelledby="rmb-featured-title">
              <SectionHead
                id="rmb-featured-title"
                eyebrow="Featured"
                title="Start with a featured collection"
                sub="The collections our visitors open first — each one copy-ready in English, Hindi and Hinglish."
                href="/bio-library"
                linkLabel="View all bios"
              />
              <ul className="rmb-featured-grid">
                {FEATURED_COLLECTIONS.map((collection) => (
                  <li key={collection.slug}><CollectionCard collection={collection} featured /></li>
                ))}
              </ul>
            </section>

            {/* ---------- C. Popular categories ---------- */}
            <section className="rmb-section">
              <SectionHead
                id="rmb-categories-title"
                eyebrow="Categories"
                title="Popular categories"
                sub={`${READY_MADE_STATS.categories} real content categories — every count is computed from the bundled bios.`}
                href="/bio-library"
                linkLabel="Filter the library"
              />
              <ul className="rmb-cat-grid">
                {CATEGORY_SUMMARIES.map((category) => (
                  <li key={category.id}>
                    <a className="rmb-cat" href={category.href} onClick={handleAnchorClick}>
                      <span className="rmb-cat-label">{category.label}</span>
                      <span className="rmb-cat-count">{category.bios} bios</span>
                      <span className="rmb-cat-desc">{category.description}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>

            {/* ---------- D. Recently added ---------- */}
            <section className="rmb-section">
              <SectionHead
                id="rmb-recent-title"
                eyebrow="Recently added"
                title="Fresh from the BioCraft studio"
                sub="The newest collections, reviewed and added most recently."
              />
              <ul className="rmb-collection-grid">
                {RECENT_COLLECTIONS.map((collection) => (
                  <li key={collection.slug}><CollectionCard collection={collection} recent /></li>
                ))}
              </ul>
            </section>

            {/* ---------- E. Popular designs ---------- */}
            <section className="rmb-section">
              <SectionHead
                id="rmb-designs-title"
                eyebrow="Popular designs"
                title="Pick a design language"
                sub="Royal, creative, aesthetic, VIP, devotional or dark — see the bios behind each style, or apply it in the editor."
                href="/design-studio"
                linkLabel="Open Design Studio"
              />
              <ul className="rmb-design-grid">
                {FEATURED_DESIGNS.map((design) => (
                  <li key={design.key}>
                    <div className={`rmb-design rmb-design--${design.key}`}>
                      <span className="rmb-design-swatch" aria-hidden="true" />
                      <span className="rmb-design-body">
                        <span className="rmb-design-label">{design.label}</span>
                        <span className="rmb-design-count">{design.count} bios</span>
                      </span>
                      <span className="rmb-design-actions">
                        <a href={design.libraryHref} onClick={handleAnchorClick}>Bios</a>
                        <a href={design.editorHref} onClick={handleAnchorClick}>Apply</a>
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* ---------- F. Platform-based ---------- */}
            <section className="rmb-section">
              <SectionHead
                id="rmb-platforms-title"
                eyebrow="Platforms"
                title="Bios for your platform"
                sub={`Bundled collections exist for ${PLATFORM_FACETS.map((facet) => facet.label).join(' and ')}; every other platform gets a live generator with its real character limit.`}
              />
              <ul className="rmb-platform-grid">
                {PLATFORM_FACETS.map((facet) => {
                  const collection = COLLECTION_SUMMARIES.find((item) => item.platform === facet.value);
                  return (
                    <li key={facet.value}>
                      <a
                        className="rmb-platform rmb-platform--collection"
                        href={`/bio-library?platform=${facet.value}`}
                        onClick={handleAnchorClick}
                      >
                        <span className="rmb-platform-icon" aria-hidden="true"><LayersIcon size={20} /></span>
                        <span className="rmb-platform-body">
                          <span className="rmb-platform-label">{facet.label}</span>
                          <span className="rmb-platform-note">{facet.count} ready-made bios</span>
                        </span>
                        {collection && <span className="rmb-platform-cta">Open {collection.name} <ChevronRightIcon size={15} /></span>}
                      </a>
                    </li>
                  );
                })}
                {PLATFORM_TOOLS.filter(
                  (platform) => !PLATFORM_FACETS.some((facet) => facet.value === platform.id),
                ).map((platform) => (
                  <li key={platform.id}>
                    <a
                      className="rmb-platform"
                      href={`/bio-generator?platform=${platform.id}#workspace`}
                      onClick={handleAnchorClick}
                    >
                      <span className="rmb-platform-icon" aria-hidden="true"><SparkIcon size={20} /></span>
                      <span className="rmb-platform-body">
                        <span className="rmb-platform-label">{platform.label}</span>
                        <span className="rmb-platform-note">Generate a live bio · {platform.limit}</span>
                      </span>
                      <span className="rmb-platform-cta">Generate <ChevronRightIcon size={15} /></span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>

            {/* ---------- G. Languages ---------- */}
            <section className="rmb-section">
              <SectionHead
                id="rmb-languages-title"
                eyebrow="Languages"
                title="Browse by language"
                sub="Every bio is tagged with its real language — Devanagari lines copy as-is, Hinglish stays Roman script."
                href="/bio-library"
                linkLabel="Open the library"
              />
              <ul className="rmb-lang-grid">
                {LANGUAGE_FACETS.map((facet) => (
                  <li key={facet.value}>
                    <a
                      className="rmb-lang-card"
                      href={`/bio-library?lang=${facet.value}`}
                      onClick={handleAnchorClick}
                    >
                      <span className="rmb-lang-icon" aria-hidden="true"><GlobeIcon size={20} /></span>
                      <span className="rmb-lang-body">
                        <span className="rmb-lang-label">{BIO_LANG_META[facet.value as keyof typeof BIO_LANG_META].label}</span>
                        <span className="rmb-lang-note">{BIO_LANG_META[facet.value as keyof typeof BIO_LANG_META].note}</span>
                      </span>
                      <span className="rmb-lang-count">{facet.count}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>

            {/* ---------- H. Complete collection list ---------- */}
            <section className="rmb-section">
              <SectionHead
                id="rmb-all-title"
                eyebrow="All collections"
                title={`Every one of the ${READY_MADE_STATS.collections} collections`}
                sub="Open any collection to copy individual bios, or jump into the library to search them all at once."
                href="/bio-library"
                linkLabel={`Browse ${READY_MADE_STATS.bios} bios`}
              />
              <ul className="rmb-collection-grid">
                {COLLECTION_SUMMARIES.map((collection) => (
                  <li key={collection.slug}><CollectionCard collection={collection} /></li>
                ))}
              </ul>
            </section>
          </>
        )}

        {/* ---------- Library CTA ---------- */}
        <aside className="rmb-library-cta">
          <span className="rmb-library-cta-icon" aria-hidden="true"><TypeIcon size={24} /></span>
          <div>
            <h2>Need a bio written for you?</h2>
            <p>
              The library is for copying. For something tailored, the Bio Generator writes five unique bios from
              your name and role, or the Bio Editor lets you build one by hand with Unicode fonts and dividers.
            </p>
          </div>
          <div className="rmb-library-cta-actions">
            <a className="btn btn-primary" href="/bio-generator" onClick={handleAnchorClick}>
              Generate a bio <ArrowRightIcon size={16} aria-hidden="true" />
            </a>
            <a className="btn btn-secondary" href="/bio-editor" onClick={handleAnchorClick}>
              <ListIcon size={16} aria-hidden="true" /> Build in the editor
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
}
