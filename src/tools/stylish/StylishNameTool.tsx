import { useMemo, useState } from 'react';
import { UNICODE_STYLES, hasDevanagari } from '../../lib/unicodeStyles';
import { DISPLAY_NAME_LIMIT, bioLength, tidy } from '../../lib/text';
import StyleGallery from '../../components/StyleGallery';
import CharCounter from '../../components/CharCounter';
import { NAME_DESIGNS, applyNameDesign } from './nameDesigns';

const DEMO = 'BioCraft';

/**
 * Stylish Name Generator — your display name in styled Unicode alphabets,
 * each variant copy-able. Rule-based, nothing leaves the browser.
 */
export default function StylishNameTool() {
  const [name, setName] = useState('');
  const [design, setDesign] = useState('none');
  const trimmed = tidy(name);

  const items = useMemo(
    () =>
      UNICODE_STYLES.map((style) =>
        trimmed
          ? {
              id: style.id,
              label: style.label,
              text: applyNameDesign(style.transform(trimmed), design),
              demo: applyNameDesign(style.transform(DEMO), design),
            }
          : {
              id: style.id,
              label: style.label,
              text: applyNameDesign(style.transform(DEMO), design),
            },
      ),
    [trimmed, design],
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
            <div className="field-inline-select">
              <label htmlFor="stylish-design-select" className="option-label">
                Name design <span className="optional">(optional)</span>
              </label>
              <select
                id="stylish-design-select"
                className="select"
                value={design}
                onChange={(event) => setDesign(event.target.value)}
              >
                {NAME_DESIGNS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="field-hint">
                Wraps the styled name in a ready-made frame — crown, gaming, attitude and more.
              </p>
            </div>
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
          {!trimmed && (
            <p className="tool-note" role="note">
              Showing “{DEMO}” in all {UNICODE_STYLES.length} styles — type your name to replace it.
            </p>
          )}
          <StyleGallery
            items={items}
            copyLabel={(label) => `Copy ${label} style`}
            copyAllText={items.map((item) => `${item.label}: ${item.text}`).join('\n')}
            copyAllAriaLabel={"Copy all styles to clipboard"}
          />
        </div>
      </div>
    </div>
  );
}
