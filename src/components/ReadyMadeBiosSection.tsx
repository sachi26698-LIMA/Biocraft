import type { CSSProperties } from 'react';
import { handleAnchorClick } from '../lib/router';
import { ArrowRightIcon, ChevronRightIcon } from './icons';
import CollectionIcon from './CollectionIcon';
import Accordion from './ui/Accordion';
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
} from '../lib/readyMadeBios';

/**
 * Homepage Ready-Made Bios block.
 *
 * Premium discovery, not a card dump: one headline with real stats, featured
 * collections, popular categories, then the secondary rails (recently added,
 * designs, languages, platforms) tucked into collapsible sections so the
 * homepage stays calm. Every link is a direct route — collections open their
 * own page, categories/designs/languages open the filtered library.
 */
export default function ReadyMadeBiosSection() {
  return (
    <section className="section rmb-home" aria-labelledby="rmb-home-title" id="ready-made-bios">
      <div className="container">
        <div className="rmb-home-head">
          <div>
            <p className="eyebrow">Ready-Made Bios</p>
            <h2 id="rmb-home-title" className="section-title">Pick a bio that already fits</h2>
            <p className="rmb-home-lede">
              {READY_MADE_STATS.bios} original, copy-ready bios in {READY_MADE_STATS.collections} curated
              collections — {READY_MADE_STATS.languages} languages, {READY_MADE_STATS.designs} design styles.
              One tap to copy, zero editing required.
            </p>
          </div>
          <div className="rmb-home-actions">
            <a className="btn btn-primary" href="/bio-collections" onClick={handleAnchorClick}>
              Browse collections <ArrowRightIcon size={16} aria-hidden="true" />
            </a>
            <a className="btn btn-secondary" href="/bio-library" onClick={handleAnchorClick}>
              View all {READY_MADE_STATS.bios} bios
            </a>
          </div>
        </div>

        <ul className="rmb-home-featured">
          {FEATURED_COLLECTIONS.slice(0, 6).map((collection) => (
            <li key={collection.slug}>
              <a className="rmb-home-card" href={collection.href} onClick={handleAnchorClick}>
                <span className="rmb-home-card-icon" aria-hidden="true">
                  <CollectionIcon name={collection.icon} size={22} />
                </span>
                <span className="rmb-home-card-body">
                  <span className="rmb-home-card-name">{collection.name}</span>
                  <span className="rmb-home-card-desc">{collection.description}</span>
                  <span className="rmb-home-card-meta">
                    {collection.count} bios · {collection.categoryLabel}
                  </span>
                </span>
                <span className="rmb-home-card-cta" aria-hidden="true">
                  Explore <ChevronRightIcon size={15} />
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className="rmb-home-categories" role="group" aria-label="Popular bio categories">
          {CATEGORY_SUMMARIES.slice(0, 10).map((category) => (
            <a key={category.id} className="rmb-home-chip" href={category.href} onClick={handleAnchorClick}>
              {category.label}
              <span className="rmb-home-chip-count">{category.bios}</span>
            </a>
          ))}
          <a className="rmb-home-chip rmb-home-chip--all" href="/bio-library" onClick={handleAnchorClick}>
            All {READY_MADE_STATS.categories} categories
          </a>
        </div>

        <div className="rmb-home-secondary">
          <Accordion level={3} title="Recently added collections" description="The newest additions to the library">
            <ul className="rmb-home-rail">
              {RECENT_COLLECTIONS.map((collection) => (
                <li key={collection.slug}>
                  <a className="rmb-home-rail-link" href={collection.href} onClick={handleAnchorClick}>
                    <span aria-hidden="true"><CollectionIcon name={collection.icon} size={16} /></span>
                    {collection.name}
                    <span className="rmb-home-rail-count">{collection.count} bios</span>
                  </a>
                </li>
              ))}
            </ul>
          </Accordion>

          <Accordion level={3} title="Popular designs" description="Royal, creative, aesthetic, VIP, devotional, dark">
            <ul className="rmb-home-rail rmb-home-rail--designs">
              {FEATURED_DESIGNS.map((design) => (
                <li key={design.key}>
                  <a
                    className={`rmb-home-design rmb-home-design--${design.key}`}
                    href={design.libraryHref}
                    onClick={handleAnchorClick}
                    style={{ '--rmb-design': design.key } as CSSProperties}
                  >
                    <span className="rmb-home-design-swatch" aria-hidden="true" />
                    <span>{design.label}</span>
                    <span className="rmb-home-rail-count">{design.count}</span>
                  </a>
                </li>
              ))}
            </ul>
          </Accordion>

          <Accordion level={3} title="Languages & platforms" description="Filter the library by language or platform">
            <div className="rmb-home-facets">
              <div>
                <p className="rmb-home-facet-label">Languages</p>
                <ul className="rmb-home-rail">
                  {LANGUAGE_FACETS.map((facet) => (
                    <li key={facet.value}>
                      <a className="rmb-home-rail-link" href={`/bio-library?lang=${facet.value}`} onClick={handleAnchorClick}>
                        {BIO_LANG_META[facet.value as keyof typeof BIO_LANG_META].label}
                        <span className="rmb-home-rail-count">{facet.count} bios</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="rmb-home-facet-label">Platforms</p>
                <ul className="rmb-home-rail">
                  {PLATFORM_FACETS.map((facet) => (
                    <li key={facet.value}>
                      <a className="rmb-home-rail-link" href={`/bio-library?platform=${facet.value}`} onClick={handleAnchorClick}>
                        {facet.label}
                        <span className="rmb-home-rail-count">{facet.count} bios</span>
                      </a>
                    </li>
                  ))}
                  <li>
                    <a className="rmb-home-rail-link" href="/bio-collections" onClick={handleAnchorClick}>
                      Every platform generator
                      <span className="rmb-home-rail-count">{COLLECTION_SUMMARIES.length} collections</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </Accordion>
        </div>
      </div>
    </section>
  );
}
