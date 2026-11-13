import { memo, useCallback, useDeferredValue, useEffect, useMemo, useState } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import BioCollectionCard from '../components/BioCollectionCard';
import { designForBio } from '../lib/bioCollections';
import ProfilePreview from '../components/ProfilePreview';
import { handleAnchorClick, navigate } from '../lib/router';
import { copyText } from '../lib/clipboard';
import { toast } from '../lib/toast';
import {
  ArrowRightIcon,
  ChevronRightIcon,
  ListIcon,
  SearchIcon,
  CloseIcon,
  WandIcon,
} from '../components/icons';
import CollectionIcon from '../components/CollectionIcon';
import { fetchCollectionBios } from '../lib/biosRemote';
import {
  COLLECTION_NAV,
  collectionBySlug,
  type BioEntry,
} from '../lib/bioCollections';

const HAS_EMOJI = /\p{Extended_Pictographic}/u;
const DEVANAGARI = /[\u0900-\u097F]/;
const slotKey = (index: number, original: BioEntry) => `${index}:${original.text.slice(0, 24)}`;

const BioGrid = memo(function BioGrid({ visible, displayed, swaps, slug, name, onRegenerate }: {
  visible: BioEntry[]; displayed: BioEntry[]; swaps: Record<string, BioEntry>; slug: string; name: string;
  onRegenerate: (index: number) => void;
}) {
  return <ul className="bio-grid">
    {displayed.map((bio, index) => (
      <BioCollectionCard
        key={`${index}-${bio.text.slice(0, 12)}-${swaps[slotKey(index, visible[index])] ? 'v' : 'o'}`}
        bio={bio} label={`bio ${index + 1} from ${name}`}
        design={designForBio(slug, index)} onRegenerate={() => onRegenerate(index)}
      />
    ))}
  </ul>;
});

type Filter = 'all' | 'emoji' | 'styled' | 'hi' | 'en';

const FILTERS: Array<{ id: Filter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'emoji', label: 'Emoji-rich' },
  { id: 'styled', label: 'Styled Unicode' },
  { id: 'hi', label: 'हिंदी' },
  { id: 'en', label: 'English' },
];

function matchesFilter(bio: BioEntry, filter: Filter): boolean {
  switch (filter) {
    case 'emoji':
      return HAS_EMOJI.test(bio.text);
    case 'styled':
      return Boolean(bio.style);
    case 'hi':
      return bio.lang === 'hi';
    case 'en':
      return bio.lang === 'en';
    default:
      return true;
  }
}

/**
 * One ready-made bio collection (e.g. /instagram-bio-for-boys).
 * Everything renders from the registry in bioCollections.ts — no per-route
 * duplication. Counts are real, computed from the data.
 */
export default function BioCollectionPage({ slug }: { slug: string }) {
  const collection = collectionBySlug(slug);
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const [filter, setFilter] = useState<Filter>('all');
  /** Per-slot variation swaps, keyed by slot id (query/filter changes reset). */
  const [swaps, setSwaps] = useState<Record<string, BioEntry>>({});
  /** Associate remote rows with their collection so navigation never shows stale bios. */
  const [remoteBios, setRemoteBios] = useState<{ slug: string; bios: BioEntry[] } | null>(null);
  const [remoteError, setRemoteError] = useState(false);
  const [retryTick, setRetryTick] = useState(0);

  useEffect(() => {
    setSwaps((current) => Object.keys(current).length ? {} : current);
  }, [deferredQuery, filter, slug]);

  useEffect(() => {
    let cancelled = false;
    setRemoteError(false);
    fetchCollectionBios(slug)
      .then((result) => {
        if (cancelled) return;
        // An empty successful live result is authoritative too: resurrecting
        // bundled rows would show stale content after all live rows are removed.
        if (result.source === 'supabase') {
          setRemoteBios({ slug, bios: result.bios });
        }
      })
      .catch(() => {
        if (cancelled) return;
        console.warn('Supabase unavailable — using the bundled collection.');
        setRemoteBios(null);
        setRemoteError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [slug, retryTick]);

  const sourceBios = (remoteBios?.slug === slug ? remoteBios.bios : null) ?? collection?.bios ?? [];

  const visible = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    if (!collection) return [] as BioEntry[];
    return sourceBios.filter((bio) => {
      if (!matchesFilter(bio, filter)) return false;
      if (!q) return true;
      const haystack = `${bio.plain ?? bio.text}\n${bio.text}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [collection, sourceBios, deferredQuery, filter]);

  const displayed = useMemo(() => visible.map((bio, index) => swaps[slotKey(index, bio)] ?? bio), [visible, swaps]);
  const previewBios = useMemo(() => sourceBios.filter((bio) => !DEVANAGARI.test(bio.text)).map((bio) => bio.text), [sourceBios]);

  /** Swaps that slot for another bio from the same collection not already on screen. */
  const regenerateAt = useCallback((index: number) => {
    if (!collection) return;
    const onScreen = new Set(displayed.map((bio) => bio.text));
    const pool = sourceBios.filter((candidate) => !onScreen.has(candidate.text));
    if (pool.length === 0) {
      toast('Every bio is already on screen — clear the filter for more variations.');
      return;
    }
    const replacement = pool[Math.floor(Math.random() * pool.length)];
    setSwaps((current) => ({ ...current, [slotKey(index, visible[index])]: replacement }));
  }, [collection, displayed, sourceBios, visible]);

  if (!collection) {
    // ToolShell replaces unknown paths with the homepage; render nothing meanwhile.
    return null;
  }

  const copyAll = async () => {
    if (visible.length === 0) return;
    const ok = await copyText(displayed.map((bio) => bio.text).join('\n\n'));
    toast(
      ok
        ? `Copied ${visible.length} ${visible.length === 1 ? 'bio' : 'bios'} to clipboard`
        : 'Could not copy — please copy a single bio instead',
    );
  };

  const related = collection.related
    .map((relatedSlug) => collectionBySlug(relatedSlug))
    .filter(Boolean) as typeof collection[];

  return (
    <section className="page bio-collection-page">
      <div className="container narrow">
        <Breadcrumbs
          trail={[
            { label: 'Home', href: '/' },
            { label: 'Bio Collections', href: '/bio-collections' },
            { label: collection.name },
          ]}
        />

        {/* Collection header */}
        <header className="bc-detail-head">
          <span className="bc-detail-icon" aria-hidden="true"><CollectionIcon name={collection.icon} size={34} /></span>
          <div className="bc-detail-body">
            <h1>{collection.name}</h1>
            <p className="bc-detail-lede">{collection.lede}</p>
            <p className="bc-detail-meta">
              <span>{sourceBios.length} bios</span>
              <span aria-hidden="true">·</span>
              <span>{collection.languages}</span>
              <span aria-hidden="true">·</span>
              <span>Reviewed {collection.updated}</span>
            </p>
          </div>
        </header>

        {/* Quick-jump category navigation */}
        <nav className="bc-nav" aria-label="Switch collection">
          {COLLECTION_NAV.map((item) => (
            <a
              key={item.slug}
              className={`bc-nav-chip${item.slug === slug ? ' is-active' : ''}`}
              href={`/${item.slug}`}
              onClick={handleAnchorClick}
              aria-current={item.slug === slug ? 'page' : undefined}
            >
              {item.label}
            </a>
          ))}
          <a className="bc-nav-chip bc-nav-all" href="/bio-collections" onClick={handleAnchorClick}>
            All collections <ChevronRightIcon size={14} aria-hidden="true" />
          </a>
        </nav>

        {/* Original introduction */}
        {collection.intro.map((paragraph, index) => (
          <p key={index} className="bc-intro">{paragraph}</p>
        ))}

        {/* Sample profile preview (boys & girls collections only) */}
        {collection.preview && (
          <ProfilePreview
            variant={collection.preview}
            bios={previewBios}
          />
        )}

        {/* Search + filter */}
        <div className="bc-toolbar">
          <div className="bc-search" role="search">
            <SearchIcon size={18} aria-hidden="true" />
            <input
              type="search"
              className="bc-search-input"
              placeholder={`Search ${sourceBios.length} ${collection.name.toLowerCase()}s…`}
              aria-label={`Search ${collection.name}`}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            {query && (
              <button type="button" className="bc-search-clear" aria-label="Clear search" onClick={() => setQuery('')}>
                <CloseIcon size={16} />
              </button>
            )}
          </div>
          <div className="bc-filters" role="group" aria-label="Filter bios">
            {FILTERS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`bc-filter-chip${filter === item.id ? ' is-active' : ''}`}
                aria-pressed={filter === item.id}
                onClick={() => setFilter(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="bc-toolbar-foot">
            <p className="bc-result-count" role="status">
              Showing {visible.length} of {sourceBios.length} bios
            </p>
            <button type="button" className="btn btn-secondary btn-small bc-copy-all" onClick={() => void copyAll()}>
              <ListIcon size={16} aria-hidden="true" /> Copy all shown
            </button>
          </div>
        </div>

        {remoteError && (
          <div className="bc-remote-notice" role="status">
            <p>The live library couldn’t be reached — showing the built-in collection instead.</p>
            <button type="button" className="btn btn-secondary btn-small" onClick={() => setRetryTick((tick) => tick + 1)}>
              Retry live library
            </button>
          </div>
        )}

        {/* Bio grid */}
        {visible.length > 0 ? (
          <BioGrid visible={visible} displayed={displayed} swaps={swaps} slug={collection.slug} name={collection.name} onRegenerate={regenerateAt} />
        ) : (
          <div className="empty-state" role="status">
            <p className="empty-state-title">{sourceBios.length === 0 ? 'No live bios are available in this collection.' : `No bios match “${deferredQuery.trim()}”`}</p>
            <p className="empty-state-text">{sourceBios.length === 0 ? 'Please check back later.' : 'Try fewer words, or clear the filter — Hindi minds like Hindi searches.'}</p>
            <button type="button" className="btn btn-secondary btn-small" onClick={() => { setQuery(''); setFilter('all'); }}>
              Reset filters
            </button>
          </div>
        )}

        {/* Generator cross-link */}
        <aside className="bc-upsell">
          <WandIcon size={22} aria-hidden="true" />
          <div>
            <p className="bc-upsell-title">Want one written fresh for you?</p>
            <p className="bc-upsell-text">The BioCraft Bio Generator turns your own name, niche and tone into five original bios — English, Hindi or Hinglish — respecting every platform’s character limit.</p>
            <button type="button" className="btn btn-primary btn-small" onClick={() => navigate('/bio-generator#workspace')}>
              Open Bio Generator <ArrowRightIcon size={16} aria-hidden="true" />
            </button>
          </div>
        </aside>

        {/* Related collections */}
        <section className="bc-related" aria-labelledby="bc-related-title">
          <h2 id="bc-related-title">Related collections</h2>
          <ul className="bc-chip-row">
            {related.map((item) => (
              <li key={item.slug}>
                <a className="chip bc-chip" href={`/${item.slug}`} onClick={handleAnchorClick}>
                  <CollectionIcon name={item.icon} size={16} /> {item.name}
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* FAQs */}
        <section className="bc-faqs" aria-labelledby="bc-faq-title">
          <h2 id="bc-faq-title">Frequently asked questions</h2>
          <div className="bc-faq-list">
            {collection.faqs.map((faq) => (
              <details key={faq.q} className="bc-faq">
                <summary>{faq.q}</summary>
                <p>{faq.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
