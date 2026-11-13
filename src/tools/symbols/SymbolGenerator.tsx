import { memo, useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { CheckIcon, SearchIcon } from '../../components/icons';
import { copyText } from '../../lib/clipboard';
import { useSymbolFavourites, useSymbolRecents } from '../../lib/toolbox';
import {
  SYMBOL_CATEGORIES,
  SYMBOL_COMBOS,
  TOTAL_SYMBOLS,
  searchSymbols,
} from './data/symbols';

type SymbolResult = ReturnType<typeof searchSymbols>[number];
const SymbolCell = memo(function SymbolCell({ symbol, copied, favourite, onCopy, onToggle }: {
  symbol: SymbolResult; copied: boolean; favourite: boolean;
  onCopy: (glyph: string) => void; onToggle: (glyph: string) => void;
}) {
  const isRow = [...symbol.glyph].length > 6;
  return <li className={`symbol-cell${isRow ? ' symbol-cell--row' : ''}`}>
    <button type="button" className={`symbol-button${isRow ? ' symbol-button--row' : ''}`}
      onClick={() => onCopy(symbol.glyph)}
      aria-label={isRow ? `Copy ${symbol.keywords} to clipboard` : `Copy ${symbol.glyph} to clipboard`}
      title={`${symbol.keywords} · ${symbol.categoryLabel}`}>
      <span aria-hidden="true">{copied ? <CheckIcon size={18} /> : symbol.glyph}</span>
    </button>
    <button type="button" className={`symbol-fav${favourite ? ' is-fav' : ''}`}
      onClick={() => onToggle(symbol.glyph)} aria-pressed={favourite}
      aria-label={favourite ? `Remove ${symbol.glyph} from favourites` : `Save ${symbol.glyph} to favourites`}
      title={favourite ? 'Unfavourite' : 'Favourite'}>{favourite ? '★' : '☆'}</button>
  </li>;
});

const SymbolGrid = memo(function SymbolGrid({ results, favs, copiedGlyph, onCopy, onToggle }: {
  results: SymbolResult[]; favs: Set<string>; copiedGlyph: string | null;
  onCopy: (glyph: string) => void; onToggle: (glyph: string) => void;
}) {
  return <ul className="symbol-grid">{results.map((symbol) => <SymbolCell
    key={`${symbol.categoryId}-${symbol.glyph}`} symbol={symbol}
    copied={copiedGlyph === symbol.glyph} favourite={favs.has(symbol.glyph)} onCopy={onCopy} onToggle={onToggle}
  />)}</ul>;
});

/**
 * Emoji & Symbol Generator — a curated library of Unicode symbols and emoji,
 * searchable and copyable. Favourite ★ the ones you love, recents fill in as
 * you copy, and ready-made signature combos sit on top. Nothing leaves the
 * browser.
 */
export default function SymbolGenerator() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [copiedGlyph, setCopiedGlyph] = useState<string | null>(null);
  const [copiedCombo, setCopiedCombo] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const timer = useRef<number | null>(null);
  const { favs, toggle: toggleFav, count: favCount } = useSymbolFavourites();
  const { recents, record } = useSymbolRecents();

  useEffect(() => () => {
    if (timer.current !== null) window.clearTimeout(timer.current);
  }, []);

  const results = useMemo(() => {
    if (activeCategory === 'favs') {
      const trimmed = deferredQuery.trim().toLowerCase();
      const favbed = searchSymbols('', 'all').filter((symbol) => favs.has(symbol.glyph));
      if (!trimmed) return favbed;
      return favbed.filter((symbol) =>
        `${symbol.keywords} ${symbol.categoryLabel}`.toLowerCase().includes(trimmed),
      );
    }
    return searchSymbols(deferredQuery, activeCategory);
  }, [deferredQuery, activeCategory, favs]);

  const announce = (message: string) => setStatusMessage(message);

  const copySymbol = useCallback(async (glyph: string) => {
    const succeeded = await copyText(glyph);
    if (timer.current !== null) window.clearTimeout(timer.current);
    setCopiedGlyph(succeeded ? glyph : null);
    record(glyph);
    announce(
      succeeded
        ? `Copied ${glyph} to clipboard.`
        : 'Copying failed. Please select the symbol and copy it manually.',
    );
    timer.current = window.setTimeout(() => setCopiedGlyph(null), 1600);
  }, [record]);

  const copyCombo = async (combo: { label: string; text: string }) => {
    const succeeded = await copyText(combo.text);
    if (timer.current !== null) window.clearTimeout(timer.current);
    setCopiedCombo(succeeded ? combo.text : null);
    announce(succeeded ? `Copied “${combo.label}” combo.` : 'Copying failed.');
    timer.current = window.setTimeout(() => setCopiedCombo(null), 1600);
  };

  const copyAll = async () => {
    const succeeded = await copyText(results.map((symbol) => symbol.glyph).join(' '));
    if (timer.current !== null) window.clearTimeout(timer.current);
    announce(
      succeeded
        ? `Copied ${results.length} symbols to clipboard.`
        : 'Copying failed. Please copy the grid manually.',
    );
  };

  const trimmedQuery = deferredQuery.trim();

  return (
    <div className="tool-card tool-card--split">
      <div className="symbol-side">
      {/* ------- Signature combos ------- */}
      <div className="symbol-combos">
        <p className="option-label symbol-combos-label" id="symbol-combos-label">
          Signature combos — one tap to copy
        </p>
        <div className="chip-row" role="group" aria-labelledby="symbol-combos-label">
          {SYMBOL_COMBOS.map((combo) => (
            <button
              key={combo.label}
              type="button"
              className="chip symbol-combo"
              onClick={() => void copyCombo(combo)}
              aria-label={`Copy the ${combo.label} combo: ${combo.text}`}
              title={combo.text}
            >
              {copiedCombo === combo.text ? (
                <CheckIcon size={14} aria-hidden="true" />
              ) : (
                <span aria-hidden="true">{combo.text}</span>
              )}
            </button>
          ))}
        </div>
      </div>

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
            {trimmedQuery ? ` match “${trimmedQuery}”` : ''} · tap any symbol to copy it · ★ saves a
            favourite
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
        <button
          type="button"
          className={`chip${activeCategory === 'favs' ? ' is-selected' : ''}`}
          aria-pressed={activeCategory === 'favs'}
          onClick={() => setActiveCategory('favs')}
        >
          ★ Favourites{favCount > 0 ? ` (${favCount})` : ''}
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

      {/* ------- Recently used ------- */}
      {recents.length > 0 && (
        <div className="symbol-recents">
          <p className="option-label symbol-recents-label">Recently used</p>
          <div className="symbol-recents-row">
            {recents.slice(0, 12).map((glyph) => (
              <button
                key={glyph}
                type="button"
                className="symbol-recent"
                onClick={() => void copySymbol(glyph)}
                aria-label={`Copy ${glyph} to clipboard`}
                title="Copy again"
              >
                {glyph}
              </button>
            ))}
          </div>
        </div>
      )}

      </div>

      <div className="symbol-main">
      {results.length > 0 ? (
        <SymbolGrid results={results} favs={favs} copiedGlyph={copiedGlyph} onCopy={copySymbol} onToggle={toggleFav} />
      ) : (
        <p className="empty-state-text styles-empty">
          {activeCategory === 'favs'
            ? favCount === 0
              ? 'No favourites yet — tap ☆ on any symbol to save it here.'
              : `No favourites match “${trimmedQuery}”.`
            : `No symbols match “${trimmedQuery}”. Try a simpler word — e.g. “heart” or “star”.`}
        </p>
      )}

      </div>

      <p className="sr-only" role="status">
        {statusMessage}
      </p>
    </div>
  );
}
