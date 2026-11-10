import { useEffect, useMemo, useRef, useState } from 'react';
import { navigate } from '../lib/router';
import { TOOLS } from '../tools/registry';
import { PLATFORMS } from '../tools/platforms';
import { SearchIcon, ChevronRightIcon } from './icons';

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

const ALL_ENTRIES = [...TOOL_ENTRIES, ...PLATFORM_ENTRIES];

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
    if (!q) return ALL_ENTRIES;
    return ALL_ENTRIES.filter((entry) => entry.keywords.includes(q));
  }, [query]);

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
            if (results[0]) go(results[0].href);
          }}
        >
          <SearchIcon size={20} aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search tools, platforms, limits…"
            aria-label="Search tools and platforms"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="search-kbd">Esc</kbd>
        </form>
        <ul className="search-results" role="listbox" aria-label="Matching tools">
          {results.map((entry) => (
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
              No tools match “{query}”. Try “bio”, “username”, “hashtag” or a platform.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
