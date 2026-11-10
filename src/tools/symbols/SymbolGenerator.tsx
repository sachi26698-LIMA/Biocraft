import { useEffect, useMemo, useRef, useState } from 'react';
import { CheckIcon, SearchIcon } from '../../components/icons';
import { copyText } from '../../lib/clipboard';
import {
  SYMBOL_CATEGORIES,
  TOTAL_SYMBOLS,
  searchSymbols,
} from './data/symbols';

/**
 * Emoji & Symbol Generator — a curated library of Unicode symbols and emoji,
 * searchable and copyable. Language-neutral; rule-based; nothing leaves the
 * browser. Tapping any symbol copies it to the clipboard.
 */
export default function SymbolGenerator() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [copiedGlyph, setCopiedGlyph] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const timer = useRef<number | null>(null);

  useEffect(() => () => {
    if (timer.current !== null) window.clearTimeout(timer.current);
  }, []);

  const results = useMemo(
    () => searchSymbols(query, activeCategory),
    [query, activeCategory],
  );

  const copySymbol = async (glyph: string) => {
    const succeeded = await copyText(glyph);
    if (timer.current !== null) window.clearTimeout(timer.current);
    setCopiedGlyph(succeeded ? glyph : null);
    setStatusMessage(
      succeeded
        ? `Copied ${glyph} to clipboard.`
        : 'Copying failed. Please select the symbol and copy it manually.',
    );
    timer.current = window.setTimeout(() => setCopiedGlyph(null), 1600);
  };

  const copyAll = async () => {
    const succeeded = await copyText(results.map((symbol) => symbol.glyph).join(' '));
    if (timer.current !== null) window.clearTimeout(timer.current);
    setStatusMessage(
      succeeded
        ? `Copied ${results.length} symbols to clipboard.`
        : 'Copying failed. Please copy the grid manually.',
    );
  };

  const trimmedQuery = query.trim();

  return (
    <div className="tool-card">
      <div className="field symbol-search">
        <label htmlFor="symbol-search-input">Search symbols</label>
        <div className="symbol-search-box">
          <SearchIcon size={18} aria-hidden="true" />
          <input
            id="symbol-search-input"
            type="search"
            name="symbol-search"
            autoComplete="off"
            placeholder="heart या दिल, star या तारा…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-describedby="symbol-search-hint"
          />
        </div>
        <div className="field-meta">
          <p className="field-hint" id="symbol-search-hint">
            {results.length} of {TOTAL_SYMBOLS} symbols
            {trimmedQuery ? ` match “${trimmedQuery}”` : ''} · tap any symbol to copy it
          </p>
          <button
            type="button"
            className="btn btn-secondary btn-small copy-all-inline"
            onClick={() => void copyAll()}
            disabled={results.length === 0}
            aria-label={`Copy all ${results.length} visible symbols to clipboard`}
          >
            Copy all
          </button>
        </div>
      </div>

      <div className="symbol-categories" role="group" aria-label="Symbol category">
        <button
          type="button"
          className={`chip${activeCategory === 'all' ? ' is-selected' : ''}`}
          aria-pressed={activeCategory === 'all'}
          onClick={() => setActiveCategory('all')}
        >
          All
        </button>
        {SYMBOL_CATEGORIES.map((category) => (
          <button
            key={category.id}
            type="button"
            className={`chip${activeCategory === category.id ? ' is-selected' : ''}`}
            aria-pressed={activeCategory === category.id}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.label}
          </button>
        ))}
      </div>

      {results.length > 0 ? (
        <ul className="symbol-grid">
          {results.map((symbol, index) => (
            <li key={`${symbol.categoryId}-${index}-${symbol.glyph}`}>
              <button
                type="button"
                className="symbol-button"
                onClick={() => void copySymbol(symbol.glyph)}
                aria-label={`Copy ${symbol.glyph} to clipboard`}
                title={`${symbol.keywords} · ${symbol.categoryLabel}`}
              >
                <span aria-hidden="true">
                  {copiedGlyph === symbol.glyph ? <CheckIcon size={18} /> : symbol.glyph}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty-state-text styles-empty">
          No symbols match “{trimmedQuery}”. Try a simpler word — e.g. “heart” or “star”.
        </p>
      )}

      <p className="sr-only" role="status">
        {statusMessage}
      </p>
    </div>
  );
}
