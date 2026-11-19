import { memo, useDeferredValue, useEffect, useMemo, useState } from 'react';
import { CheckIcon, ClipboardIcon, DownloadIcon, SearchIcon } from '../../components/icons';
import { copyText } from '../../lib/clipboard';
import { downloadText } from '../../lib/download';

/**
 * Icon Finder — 3,472 brand marks from simple-icons (CC0-1.0).
 *
 * The path data is ~4.6 MB, so it is imported inside this module (which is
 * itself lazy-loaded by the tool registry) rather than at module scope of the
 * app. A visitor who never opens this tool downloads none of it.
 *
 * Every icon is a real SVG: the same path renders in the grid, in the copied
 * markup, and in the downloaded .svg file. Nothing here is a placeholder.
 */

type IconRecord = { slug: string; title: string; hex: string; path: string; aka: string[] };

const PAGE_SIZE = 120;

interface Loaded {
  icons: readonly IconRecord[];
  license: { name: string; source: string; attribution: string };
}

const IconCell = memo(function IconCell({
  icon, copied, mono, onCopy, onDownload,
}: {
  icon: IconRecord; copied: string | null; mono: boolean;
  onCopy: (icon: IconRecord) => void; onDownload: (icon: IconRecord) => void;
}) {
  return (
    <li className="icon-cell">
      <button
        type="button"
        className="icon-cell-btn"
        onClick={() => onCopy(icon)}
        title={`${icon.title} — copy SVG`}
        aria-label={`Copy SVG markup for ${icon.title}`}
      >
        <svg viewBox="0 0 24 24" width={28} height={28} aria-hidden="true" focusable="false">
          <path d={icon.path} fill={mono ? 'currentColor' : `#${icon.hex}`} />
        </svg>
        <span className="icon-cell-title">{icon.title}</span>
        {copied === icon.slug ? <span className="icon-cell-check"><CheckIcon size={14} /></span> : null}
      </button>
      <button
        type="button"
        className="icon-cell-dl"
        onClick={() => onDownload(icon)}
        aria-label={`Download ${icon.title} as SVG`}
        title="Download .svg"
      >
        <DownloadIcon size={14} />
      </button>
    </li>
  );
});

export default function IconFinder() {
  const [data, setData] = useState<Loaded | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  // 'mono' does not filter the library — it re-renders the SAME icons in a
  // single colour, which is what a user actually needs for a monochrome UI.
  const [mono, setMono] = useState(false);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [copied, setCopied] = useState<string | null>(null);
  const [status, setStatus] = useState('');

  // Load the icon payload on mount of this tool only.
  useEffect(() => {
    let cancelled = false;
    import('./data/simpleIcons')
      .then((mod) => {
        if (cancelled) return;
        setData({ icons: mod.ICONS, license: mod.ICON_LICENSE });
      })
      .catch(() => {
        if (!cancelled) setLoadError('The icon library could not be loaded. Reload the page to try again.');
      });
    return () => { cancelled = true; };
  }, []);

  const results = useMemo(() => {
    if (!data) return [];
    const q = deferredQuery.trim().toLowerCase();
    let list = data.icons;
    if (q) {
      list = list.filter((icon) =>
        icon.title.toLowerCase().includes(q) ||
        icon.slug.includes(q) ||
        icon.aka.some((alias) => alias.toLowerCase().includes(q)));
    }
    return list;
  }, [data, deferredQuery]);

  // Reset pagination whenever the filter changes, so a new search starts at the top.
  useEffect(() => { setLimit(PAGE_SIZE); }, [deferredQuery, mono]);

  const visible = results.slice(0, limit);

  // In monochrome mode the copied markup uses currentColor so it inherits the
  // surrounding text colour — the same thing the grid renders.
  const svgFor = (icon: IconRecord) =>
    `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>${icon.title}</title><path d="${icon.path}" fill="${mono ? 'currentColor' : `#${icon.hex}`}" /></svg>`;

  const handleCopy = async (icon: IconRecord) => {
    const ok = await copyText(svgFor(icon));
    setCopied(ok ? icon.slug : null);
    setStatus(ok ? `Copied ${icon.title} SVG.` : 'Copying failed — use the download button instead.');
    window.setTimeout(() => setCopied(null), 1600);
  };

  const handleDownload = (icon: IconRecord) => {
    downloadText(svgFor(icon), `${icon.slug}.svg`);
    setStatus(`Downloaded ${icon.slug}.svg`);
  };

  const copyAll = async () => {
    const markup = visible.map(svgFor).join('\n');
    const ok = await copyText(markup);
    setStatus(ok ? `Copied ${visible.length} SVGs.` : 'Copying failed.');
  };

  if (loadError) {
    return (
      <div className="tool-card">
        <div className="empty-state" role="alert">
          <p className="empty-state-title">Icon library unavailable</p>
          <p className="empty-state-text">{loadError}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="tool-card">
        <div className="icon-skeleton" aria-busy="true" aria-live="polite">
          <p className="field-hint">Loading 3,472 icons…</p>
          <div className="icon-skeleton-grid">
            {Array.from({ length: 24 }, (_, i) => <span key={i} className="icon-skeleton-cell" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tool-card">
      <div className="field">
        <label htmlFor="icon-search">Search {data.icons.length.toLocaleString()} brand icons</label>
        <div className="input-with-icon">
          <SearchIcon size={18} />
          <input
            id="icon-search"
            type="search"
            autoComplete="off"
            placeholder="e.g. github, figma, spotify"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <p className="field-hint">
          {results.length.toLocaleString()} icon{results.length === 1 ? '' : 's'} match. Click an icon to copy its SVG markup.
        </p>
      </div>

      <fieldset className="plain-fieldset">
        <legend className="option-label" id="icon-color-legend">Colour</legend>
        <div className="chip-row" role="group" aria-labelledby="icon-color-legend">
          {([[false, 'Brand colours'], [true, 'Monochrome']] as const).map(([value, label]) => (
            <button key={label} type="button" className={`chip${mono === value ? ' is-selected' : ''}`}
              aria-pressed={mono === value} onClick={() => setMono(value)}>{label}</button>
          ))}
        </div>
        <p className="field-hint">Monochrome renders every icon in the surrounding text colour and copies <code>currentColor</code>, so it drops into any single-colour UI.</p>
      </fieldset>

      <div className="results-block" role="region" aria-label="Icon results" aria-busy={false}>
        <div className="results-header">
          <h2 className="results-title">Icons <span className="results-count">{visible.length}</span></h2>
          {visible.length > 0 && (
            <div className="results-actions">
              <button type="button" className="btn btn-secondary btn-small" onClick={() => void copyAll()}>
                <ClipboardIcon size={16} /> Copy visible SVGs
              </button>
            </div>
          )}
        </div>

        {visible.length > 0 ? (
          <>
            <ul className="icon-grid">
              {visible.map((icon) => (
                <IconCell key={icon.slug} icon={icon} copied={copied} mono={mono}
                  onCopy={(i) => void handleCopy(i)} onDownload={handleDownload} />
              ))}
            </ul>
            {results.length > visible.length && (
              <div className="results-actions results-actions--center">
                <button type="button" className="btn btn-secondary" onClick={() => setLimit((n) => n + PAGE_SIZE * 2)}>
                  Show more ({results.length - visible.length} remaining)
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <p className="empty-state-title">No icons match “{deferredQuery}”.</p>
            <p className="empty-state-text">Try a shorter word or the brand’s domain, e.g. “github” or “openai”.</p>
          </div>
        )}

        <p className="sr-only" role="status" aria-live="polite">{status}</p>
      </div>

      <p className="tool-note">
        {data.icons.length.toLocaleString()} brand marks from{' '}
        <a href="https://github.com/simple-icons/simple-icons" target="_blank" rel="noreferrer noopener">simple-icons</a>{' '}
        ({data.license.name}). Trademarks belong to their owners; confirm usage rights before publishing a logo.
      </p>
    </div>
  );
}
