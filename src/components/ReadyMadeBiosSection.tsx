import { handleAnchorClick } from '../lib/router';
import { ArrowRightIcon, ChevronRightIcon } from './icons';
import CollectionIcon from './CollectionIcon';
import {
  CATEGORY_SUMMARIES,
  FEATURED_COLLECTIONS,
  READY_MADE_STATS,
} from '../lib/readyMadeBios';

/**
 * Homepage Ready-Made Bios block.
 *
 * Two ideas only: six collections worth opening first, and the real category
 * list, then out to the hub or the library. The deeper rails (recently added,
 * designs, languages, platforms) live on `/bio-collections` — repeating them
 * here made the homepage long without adding a choice.
 *
 * Every link is a direct route: collections open their own page, categories open
 * the filtered library.
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
          <a className="rmb-home-chip rmb-home-chip--all" href="/bio-collections" onClick={handleAnchorClick}>
            All {READY_MADE_STATS.collections} collections <ChevronRightIcon size={14} aria-hidden="true" />
          </a>
        </div>

      </div>
    </section>
  );
}
