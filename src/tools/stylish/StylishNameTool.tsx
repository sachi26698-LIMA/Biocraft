import { useMemo, useState } from 'react';
import { UNICODE_STYLES, hasDevanagari } from '../../lib/unicodeStyles';
import { DISPLAY_NAME_LIMIT, bioLength, tidy } from '../../lib/text';
import StyleGallery from '../../components/StyleGallery';
import CharCounter from '../../components/CharCounter';

/**
 * Stylish Name Generator — your display name in styled Unicode alphabets,
 * each variant copy-able. Rule-based, nothing leaves the browser.
 */
export default function StylishNameTool() {
  const [name, setName] = useState('');
  const trimmed = tidy(name);

  const items = useMemo(
    () =>
      trimmed
        ? UNICODE_STYLES.map((style) => ({
            id: style.id,
            label: style.label,
            text: style.transform(trimmed),
          }))
        : [],
    [trimmed],
  );

  const showDevanagariNote = hasDevanagari(trimmed);
  const count = bioLength(trimmed);

  return (
    <div className="tool-card">
      <div className="styles-layout">
        <div className="styles-sidebar">
          <div className="field">
            <label htmlFor="stylish-name-input">Your display name</label>
            <input
              id="stylish-name-input"
              name="stylish-name"
              type="text"
              autoComplete="off"
              maxLength={80}
              placeholder="e.g. Priya Sharma"
              value={name}
              aria-describedby="stylish-name-hint"
              onChange={(event) => setName(event.target.value)}
            />
            <div className="field-meta">
              <p className="field-hint" id="stylish-name-hint">
                Latin letters and digits get the full treatment; other characters pass through.
              </p>
              <CharCounter
                count={count}
                limit={DISPLAY_NAME_LIMIT}
                ariaLabel="Display name length against Instagram's 30-character limit"
              />
            </div>
          </div>

          {showDevanagariNote && (
            <p className="tool-note" role="note">
              Devanagari text can’t be restyled — Unicode has no styled Devanagari alphabets.
              Devanagari characters will appear unchanged.
            </p>
          )}

          <p className="tool-note">
            Instagram display names are capped at {DISPLAY_NAME_LIMIT} characters. If a variant
            goes over, Instagram truncates it.
          </p>
        </div>

        <div className="styles-main" aria-live="polite">
          {items.length > 0 ? (
            <StyleGallery
              items={items}
              copyLabel={(label) => `Copy ${label} style`}
              copyAllText={items.map((item) => `${item.label}: ${item.text}`).join('\n')}
              copyAllAriaLabel={"Copy all styles to clipboard"}
            />
          ) : (
            <p className="empty-state-text styles-empty">
              Type your name to see it in {UNICODE_STYLES.length} styles.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
