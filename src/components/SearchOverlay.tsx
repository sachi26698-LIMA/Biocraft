import { useEffect, useMemo, useRef, useState } from 'react';
import { navigate } from '../lib/router';
import { TOOLS } from '../tools/registry';
import { PLATFORMS } from '../tools/platforms';
import { SearchIcon, ChevronRightIcon } from './icons';
import { CATEGORY_SUMMARIES, COLLECTION_SUMMARIES, READY_MADE_STATS } from '../lib/readyMadeBios';

interface Entry {
  label: string;
  hint: string;
  href: string;
  keywords: string;
}

const TOOL_ENTRIES: Entry[] = TOOLS.map((tool) => ({
  label: tool.heading,
  hint: 'Tool',
  href: tool.path,
  keywords: `${tool.heading} ${tool.tabLabel} ${tool.key}`.toLowerCase(),
}));

const PLATFORM_ENTRIES: Entry[] = PLATFORMS.map((platform) => ({
  label: `${platform.name} workspace`,
  hint: 'Platform',
  href: `/bio-generator?platform=${platform.id}#workspace`,
  keywords: `${platform.name} ${platform.shortName} bio limit ${platform.bioLimit}`.toLowerCase(),
}));

const COLLECTION_ENTRIES: Entry[] = COLLECTION_SUMMARIES.map((collection) => ({
  label: collection.name,
  hint: `Ready-made · ${collection.count} bios`,
  href: collection.href,
  keywords: `${collection.name} ${collection.description} ${collection.categoryLabel} ready-made bio collection`
    .toLowerCase(),
}));

const CATEGORY_ENTRIES: Entry[] = CATEGORY_SUMMARIES.map((category) => ({
  label: `${category.label} bios`,
  hint: `Category · ${category.bios} bios`,
  href: category.href,
  keywords: `${category.label} ${category.description} category bios`.toLowerCase(),
}));

const LIBRARY_ENTRY: Entry = {
  label: 'Bio Library — search every bio',
  hint: 'Library',
  href: '/bio-library',
  keywords: `bio library all ${READY_MADE_STATS.bios} bios search filter copy ready-made`.toLowerCase(),
};

// Tools and platforms rank first, then collections/categories, so a query like
// "username" still lands on the tool before a similarly-named collection.
const ALL_ENTRIES = [...TOOL_ENTRIES, ...PLATFORM_ENTRIES, LIBRARY_ENTRY, ...COLLECTION_ENTRIES, ...CATEGORY_ENTRIES];

/** Keep the listbox short enough to scan on a phone. */
const MAX_RESULTS = 12;

/**
 * Global tool search. Opens from the navbar search button, filters the real
 * tool registry and platform workspaces as you type, navigates on click or
 * Enter. Escape or backdrop-click closes and restores focus to the trigger.
 */
export default function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL_ENTRIES.slice(0, MAX_RESULTS);
    return ALL_ENTRIES.filter((entry) => entry.keywords.includes(q));
  }, [query]);
  const visibleResults = results.slice(0, MAX_RESULTS);
  const librarySearchHref = query.trim()
    ? `/bio-library?q=${encodeURIComponent(query.trim())}`
    : '/bio-library';

  useEffect(() => {
    if (open) {
      triggerRef.current = window.document.activeElement as HTMLElement | null;
      setQuery('');
      window.requestAnimationFrame(() => inputRef.current?.focus());
    } else if (triggerRef.current) {
      triggerRef.current.focus();
      triggerRef.current = null;
    }
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const go = (href: string) => {
    onClose();
    navigate(href);
  };

  return (
    <div className="search-overlay" role="dialog" aria-modal="true" aria-label="Search BioCraft tools">
      <button type="button" className="search-backdrop" tabIndex={-1} aria-label="Close search" onClick={onClose} />
      <div className="search-panel">
        <form
          className="search-form"
          onSubmit={(event) => {
            event.preventDefault();
            if (visibleResults[0]) go(visibleResults[0].href);
          }}
        >
          <SearchIcon size={20} aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search tools, collections, bios…"
            aria-label="Search tools, collections and bios"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="search-kbd">Esc</kbd>
        </form>
        <ul className="search-results" role="listbox" aria-label="Matching tools">
          {visibleResults.map((entry) => (
            <li key={entry.href}>
              <button type="button" className="search-result" role="option" aria-selected="false" onClick={() => go(entry.href)}>
                <span className="search-result-label">{entry.label}</span>
                <span className="search-result-hint">{entry.hint}</span>
                <ChevronRightIcon size={16} aria-hidden="true" />
              </button>
            </li>
          ))}
          {results.length === 0 && (
            <li className="search-empty" role="status">
              No tools, collections or categories match “{query}”. Try “bio”, “username”, “hindi” or a platform —
              or search every bio in the library.
            </li>
          )}
        </ul>
        <div className="search-foot">
          <button type="button" className="search-foot-link" onClick={() => go(librarySearchHref)}>
            {query.trim() ? `Search all ${READY_MADE_STATS.bios} bios for “${query.trim()}”` : `Browse all ${READY_MADE_STATS.bios} bios`}
            <ChevronRightIcon size={15} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
