import { useCallback, useEffect, useRef, useState } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import { SearchIcon } from '../components/icons';
import {
  DEVANAGARI_CATEGORY,
  FONT_CATEGORIES,
  FONT_CATEGORY_LABELS,
  FONT_CATEGORY_LABELS_WITH_SCRIPT,
  fetchFontPage,
  type FontRow,
} from '../lib/libraryApi';

const PAGE_SIZE = 48;

/**
 * Font library browser.
 *
 * Reads the bundled Google Fonts catalogue — 1,908 families, generated from the
 * MIT-licensed `google-font-metadata` package by scripts/build-font-catalog.mjs.
 * The catalogue ships with the application, so this page needs no backend and
 * works with the database unreachable or unconfigured. Paging is a rendering
 * limit, not a network limit.
 *
 * Preview honesty: we only render a family in its own typeface when the font is
 * actually available to the page. We do NOT @import 1,900 fonts from a third
 * party: that would be a slow, privacy-leaking request chain. Each card therefore
 * shows the family name in a neutral system stack plus its real metadata
 * (category, weights, subsets), and offers "load preview" which injects that one
 * family on demand.
 */
export default function FontLibraryPage() {
  const [category, setCategory] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [rows, setRows] = useState<FontRow[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [previews, setPreviews] = useState<Record<string, boolean>>({});

  const requestId = useRef(0);

  const load = useCallback(
    async (opts: { reset: boolean; cursor?: string | null }) => {
      const id = ++requestId.current;
      setLoading(true);
      const outcome = await fetchFontPage({
        category,
        search: search.trim() || null,
        cursor: opts.reset ? null : opts.cursor ?? null,
        limit: PAGE_SIZE,
      });
      if (id !== requestId.current) return;

      if (outcome.ok) {
        setNotice(null);
        // A full page means there may be more; the API clamps, so never assume.
        const full = outcome.rows.length === PAGE_SIZE;
        setRows((prev) => (opts.reset ? outcome.rows : [...prev, ...outcome.rows]));
        setCursor(full ? outcome.rows[outcome.rows.length - 1]?.next_cursor ?? null : null);
        setHasMore(full);
      } else {
        setNotice(outcome.message);
        if (opts.reset) setRows([]);
        setHasMore(false);
      }
      setLoading(false);
    },
    [category, search],
  );

  // Debounce the search box; refetch on category change immediately.
  useEffect(() => {
    const t = window.setTimeout(() => void load({ reset: true }), search ? 280 : 0);
    return () => window.clearTimeout(t);
  }, [search, category, load]);

  /** Load exactly one family from Google Fonts, only when asked. */
  const loadPreview = useCallback((family: string) => {
    const id = `font-preview-${family.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`;
    if (!document.getElementById(id)) {
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family).replace(/%20/g, '+')}&display=swap`;
      document.head.appendChild(link);
    }
    setPreviews((p) => ({ ...p, [family]: true }));
  }, []);

  const total = rows.length;

  return (
    <div className="fontlib">
      <Breadcrumbs trail={[{ label: 'Home', href: '/' }, { label: 'Font library' }]} />
      <header className="fontlib-head">
        <h1>Font library</h1>
        <p>
          Every font family in the BioCraft library, with its real category, weights and
          character subsets — loaded with the page, no backend required.
        </p>
      </header>

      <div className="fontlib-bar">
        <SearchIcon />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search font families…"
          aria-label="Search font families"
          autoComplete="off"
          spellCheck={false}
        />
        {loading && <span className="fontlib-spinner" role="status" aria-label="Loading fonts" />}
      </div>

      <div className="fontlib-filters" role="group" aria-label="Filter by category">
        <button
          type="button"
          className={`fontlib-chip${category === null ? ' is-active' : ''}`}
          onClick={() => setCategory(null)}
          aria-pressed={category === null}
        >
          All
        </button>
        {FONT_CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            className={`fontlib-chip${category === c ? ' is-active' : ''}`}
            onClick={() => setCategory(category === c ? null : c)}
            aria-pressed={category === c}
          >
            {FONT_CATEGORY_LABELS[c]}
          </button>
        ))}
        {/* Script, not style: the 62 Devanagari families are spread across
            sans-serif, serif and display, so the style chips above scatter
            them. This chip gathers them. */}
        <button
          type="button"
          className={`fontlib-chip fontlib-chip-script${category === DEVANAGARI_CATEGORY ? ' is-active' : ''}`}
          onClick={() =>
            setCategory(category === DEVANAGARI_CATEGORY ? null : DEVANAGARI_CATEGORY)
          }
          aria-pressed={category === DEVANAGARI_CATEGORY}
        >
          {FONT_CATEGORY_LABELS_WITH_SCRIPT[DEVANAGARI_CATEGORY]}
        </button>
      </div>

      {category === DEVANAGARI_CATEGORY && (
        <p className="fontlib-notice" role="status">
          Showing the families that ship a Devanagari subset. BioCraft also has a
          dedicated library of 62 self-hosted, HarfBuzz-verified Hindi families with
          specimen pages and downloadable WOFF2 —{' '}
          <a href="/hindi-fonts">browse the Hindi font library</a>.
        </p>
      )}

      {notice && (
        <p className="fontlib-notice" role="status">
          {notice}
        </p>
      )}

      <p className="fontlib-count" aria-live="polite">
        {notice
          ? ''
          : loading && total === 0
            ? 'Loading…'
            : total === 0
              ? 'No font families match yet.'
              : `${total}${hasMore ? '+' : ''} ${total === 1 ? 'family' : 'families'} loaded`}
      </p>

      {loading && total === 0 && (
        <div className="fontlib-grid" aria-hidden="true">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={`sk-${i}`} className="fontlib-skeleton" />
          ))}
        </div>
      )}

      <div className="fontlib-grid">
        {rows.map((font) => (
          <article className="fontlib-card" key={font.slug}>
            <div
              className="fontlib-sample"
              style={previews[font.family] ? { fontFamily: `"${font.family}", system-ui` } : undefined}
            >
              {font.family}
            </div>
            <div className="fontlib-meta">
              <span className="fontlib-badge">{FONT_CATEGORY_LABELS[font.category ?? ''] ?? font.category ?? 'Other'}</span>
              {font.weights && font.weights.length > 0 && (
                <span className="fontlib-detail">{font.weights.length} weights</span>
              )}
              {font.variable && <span className="fontlib-detail">Variable</span>}
            </div>
            {font.subsets && font.subsets.length > 0 && (
              <p className="fontlib-subsets">{font.subsets.slice(0, 4).join(' · ')}</p>
            )}
            {!previews[font.family] ? (
              <button type="button" className="fontlib-preview" onClick={() => loadPreview(font.family)}>
                Load preview
              </button>
            ) : (
              <span className="fontlib-loaded">Preview loaded</span>
            )}
          </article>
        ))}
      </div>

      {hasMore && (
        <button
          type="button"
          className="fontlib-more"
          onClick={() => void load({ reset: false, cursor })}
          disabled={loading}
        >
          {loading ? 'Loading…' : 'Load more families'}
        </button>
      )}
    </div>
  );
}
