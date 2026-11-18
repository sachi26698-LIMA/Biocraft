import PublishedCatalog from '../../components/PublishedCatalog';
import { useDeferredValue, useMemo, useState } from 'react';
import { UNICODE_STYLES, hasDevanagari } from '../../lib/unicodeStyles';
import { CAPTION_LIMIT, bioLength } from '../../lib/text';
import StyleGallery from '../../components/StyleGallery';
import CharCounter from '../../components/CharCounter';
import StyleCollectionPicker from '../../components/StyleCollectionPicker';
import { STYLE_COLLECTIONS } from '../../lib/styleCollections';
import { useToolMode } from '../../lib/toolMode';

const DEMO = 'BioCraft';
const copyLabel = (label: string) => `Copy ${label} text`;

/** Unicode font variants are editable/copyable characters, not font files. */
export default function FancyFontTool() {
  const [text, setText] = useState('');
  const [collection, setCollection] = useState('all');
  const { mode } = useToolMode();
  const trimmed = text.trim();
  const previewText = useDeferredValue(trimmed);

  const items = useMemo(() => UNICODE_STYLES.map((style) => (
    previewText
      ? { id: style.id, label: style.label, text: style.transform(previewText), demo: style.transform(DEMO) }
      : { id: style.id, label: style.label, text: style.transform(DEMO) }
  )), [previewText]);
  const selectedIds = mode === 'advanced' ? STYLE_COLLECTIONS.find((item) => item.id === collection)?.ids : null;
  const visibleItems = selectedIds ? items.filter((item) => (selectedIds as readonly string[]).includes(item.id)) : items;
  const copyAllText = useMemo(() => visibleItems.map((item) => `${item.label}: ${item.text}`).join('\n'), [visibleItems]);
  const showDevanagariNote = hasDevanagari(trimmed);
  const count = bioLength(text);

  return (
    <div className="tool-card">
      <div className="styles-layout">
        <div className="styles-sidebar">
          <div className="field">
            <label htmlFor="fancy-font-input">Your text</label>
            <textarea
              id="fancy-font-input"
              name="fancy-font-text"
              rows={4}
              maxLength={2200}
              placeholder="Type or paste anything…"
              value={text}
              aria-describedby="fancy-font-hint"
              onChange={(event) => setText(event.target.value)}
            />
            <div className="field-meta">
              <p className="field-hint" id="fancy-font-hint">Copy any style below into a bio, caption or message.</p>
              <CharCounter count={count} limit={CAPTION_LIMIT} ariaLabel="Text length against Instagram's 2200-character caption limit" />
            </div>
          </div>
          {showDevanagariNote && (
            <p className="tool-note" role="note">
              Devanagari text can’t be restyled — Unicode has no styled Devanagari alphabets.
              Devanagari characters appear unchanged; Hinglish (Latin script) styles normally.
            </p>
          )}
          <p className="tool-note">
            These are styled Unicode characters, not downloadable font files. They render
            everywhere Unicode is supported — including Instagram bios, captions and DMs. Some
            very old devices may show boxes for the rarer styles.
          </p>
        </div>

        <div className="styles-main" aria-live="polite">
          {!previewText && (
            <p className="tool-note" role="note">
              Showing “{DEMO}” in all {UNICODE_STYLES.length} styles — type your own text to replace it.
            </p>
          )}
          <StyleCollectionPicker value={collection} onChange={setCollection} />
          <StyleGallery items={visibleItems} copyLabel={copyLabel} copyAllText={copyAllText} copyAllAriaLabel="Copy all styles to clipboard" />
        </div>
      </div>
      <PublishedCatalog kind="fonts" />
    </div>
  );
}
