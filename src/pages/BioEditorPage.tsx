import { useEffect, useMemo, useRef, useState } from 'react';
import {
  BIO_COLLECTIONS,
  BIO_DESIGNS,
  designLabel,
  type BioDesignKey,
} from '../lib/bioCollections';
import { UNICODE_STYLES, applyStyle } from '../lib/unicodeStyles';
import { bioLength, tidyMultiline } from '../lib/text';
import { toast } from '../lib/toast';
import { PLATFORMS, type PlatformId } from '../tools/platforms';
import CharCounter from '../components/CharCounter';
import CopyButton from '../components/CopyButton';
import { useSymbolFavourites, useSymbolRecents } from '../lib/toolbox';
import { WandIcon, RefreshIcon, CloseIcon } from '../components/icons';

const QUICK_EMOJIS = ['😎', '🔥', '✨', '👑', '❤️', '🙌', '💯', '🎯', '☕', '🌸', '🎵', '💪', '🌙', '⚡', '📍', '📸'];

const DIVIDERS: ReadonlyArray<{ id: string; label: string; glyph: string }> = [
  { id: 'none', label: 'No divider', glyph: '' },
  { id: 'thin', label: 'Thin line', glyph: '──────────' },
  { id: 'heavy', label: 'Heavy line', glyph: '━━━━━━━━━━' },
  { id: 'sparkle', label: 'Sparkles', glyph: '✦ ✦ ✦' },
  { id: 'star', label: 'Stars', glyph: '⋆⋅⋆⋅⋆⋅⋆' },
  { id: 'royal', label: 'Royal brackets', glyph: '꧁༺ ༻꧂' },
  { id: 'wave', label: 'Wave', glyph: '~ ✿ ~' },
  { id: 'diamond', label: 'Diamonds', glyph: '─ ◆ ─' },
];

type DividerPlacement = 'none' | 'top' | 'bottom' | 'both';
const LINE_SPACINGS = [
  { value: '1.3', label: 'Tight' },
  { value: '1.6', label: 'Relaxed' },
  { value: '2.05', label: 'Airy' },
] as const;

/**
 * Bio Editor — build one perfect bio by hand: pick the platform, write the
 * text, style it with Unicode alphabets, add dividers and emoji, preview it
 * in every design, then copy the exact final text. The transformation is
 * rule-based (no AI) and fully client-side.
 */
export default function BioEditorPage() {
  const [platform, setPlatform] = useState<PlatformId>('instagram');
  const [text, setText] = useState('');
  const [styleId, setStyleId] = useState<string>('none');
  const [dividerId, setDividerId] = useState<string>('none');
  const [placement, setPlacement] = useState<DividerPlacement>('none');
  const [lineSpacing, setLineSpacing] = useState<(typeof LINE_SPACINGS)[number]['value']>('1.6');
  const [design, setDesign] = useState<BioDesignKey>('minimal');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Honor ?design=royal (used by the homepage "Recently Added Designs" rail).
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get('design');
    if (requested && BIO_DESIGNS.some((item) => item.key === requested)) {
      setDesign(requested as BioDesignKey);
    }
  }, []);
  const { favs } = useSymbolFavourites();
  const { recents, record } = useSymbolRecents();

  const config = PLATFORMS.find((item) => item.id === platform) ?? PLATFORMS[0];
  const divider = DIVIDERS.find((item) => item.id === dividerId) ?? DIVIDERS[0];

  const finalText = useMemo(() => {
    const styled = styleId === 'none' ? text : applyStyle(text, styleId);
    const lines: string[] = [];
    const withDivider = (line: string) => line;
    if (placement === 'top' || placement === 'both') lines.push(withDivider(divider.glyph));
    if (styled.trim()) lines.push(styled);
    if (placement === 'bottom' || placement === 'both') lines.push(withDivider(divider.glyph));
    return lines.join('\n');
  }, [text, styleId, divider.glyph, placement]);

  const count = bioLength(finalText);
  const over = count > config.bioLimit;
  const overflow = over ? count - config.bioLimit : 0;

  const insertAtCursor = (snippet: string) => {
    const area = textareaRef.current;
    if (!area) {
      setText((current) => current + snippet);
      return;
    }
    const start = area.selectionStart ?? text.length;
    const end = area.selectionEnd ?? text.length;
    const next = text.slice(0, start) + snippet + text.slice(end);
    setText(next);
    requestAnimationFrame(() => {
      area.focus();
      const caret = start + snippet.length;
      area.setSelectionRange(caret, caret);
    });
    if (/\p{Extended_Pictographic}/u.test(snippet)) record(snippet);
  };

  const insertReadyMade = () => {
    const pool = BIO_COLLECTIONS.flatMap((collection) => collection.bios);
    const pick = pool[Math.floor(Math.random() * pool.length)];
    setText(tidyMultiline(pick.text));
    toast('Ready-made bio inserted — make it yours');
  };

  const resetAll = () => {
    setText('');
    setStyleId('none');
    setDividerId('none');
    setPlacement('none');
    setLineSpacing('1.6');
    setDesign('minimal');
    toast('Editor reset');
  };

  const favouriteGlyphs = useMemo(() => [...favs].slice(0, 14), [favs]);
  const recentGlyphs = useMemo(() => recents.slice(0, 14), [recents]);

  return (
    <section className="page bio-editor-page">
      <div className="container narrow">
        <header className="bio-editor-head">
          <span className="hub-header-icon bc-hub-icon" aria-hidden="true"><WandIcon size={26} /></span>
          <div>
            <h1>Bio Editor</h1>
            <p className="bio-editor-lede">
              Build your bio by hand — platform limits, Unicode fonts, dividers, emoji and every
              design preview. Rule-based, private, nothing leaves your browser.
            </p>
          </div>
        </header>

        {/* ------- Platform picker ------- */}
        <fieldset className="plain-fieldset bio-editor-platforms">
          <legend className="option-label" id="editor-platform-label">Platform</legend>
          <div className="chip-row" role="group" aria-labelledby="editor-platform-label">
            {PLATFORMS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`chip${item.id === platform ? ' is-selected' : ''}`}
                aria-pressed={item.id === platform}
                onClick={() => setPlatform(item.id)}
              >
                {item.shortName}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="bio-editor-grid">
          {/* ------- Controls ------- */}
          <div className="bio-editor-controls">
            <div className="field">
              <label htmlFor="bio-editor-input">Your bio</label>
              <textarea
                ref={textareaRef}
                id="bio-editor-input"
                rows={5}
                placeholder="Write your story here — line breaks are welcome…"
                value={text}
                onChange={(event) => setText(event.target.value)}
                aria-describedby="bio-editor-counter"
              />
              <div className="field-meta">
                <span id="bio-editor-counter" className="bio-editor-counter-slot">
                  <CharCounter
                    count={count}
                    limit={config.bioLimit}
                    ariaLabel={`Bio length against the ${config.name} limit of ${config.bioLimit} characters`}
                  />
                </span>
                {over && (
                  <p className="field-hint bio-editor-over" role="status">
                    {config.name} would clip {overflow} character{overflow === 1 ? '' : 's'} — trim a little, or copy anyway (your call).
                  </p>
                )}
              </div>
            </div>

            <div className="field">
              <label htmlFor="bio-editor-font">Font style</label>
              <select id="bio-editor-font" value={styleId} onChange={(event) => setStyleId(event.target.value)}>
                <option value="none">Original (no style)</option>
                {UNICODE_STYLES.map((style) => (
                  <option key={style.id} value={style.id}>{style.label}</option>
                ))}
              </select>
              <p className="field-hint">Devanagari stays untouched — Unicode has no styled Devanagari alphabets.</p>
            </div>

            <div className="field-row">
              <div className="field">
                <label htmlFor="bio-editor-divider">Decorative divider</label>
                <select id="bio-editor-divider" value={dividerId} onChange={(event) => setDividerId(event.target.value)}>
                  {DIVIDERS.map((item) => (
                    <option key={item.id} value={item.id}>{item.label}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="bio-editor-placement">Divider placement</label>
                <select id="bio-editor-placement" value={placement} onChange={(event) => setPlacement(event.target.value as DividerPlacement)}>
                  <option value="none">Off</option>
                  <option value="top">Above bio</option>
                  <option value="bottom">Below bio</option>
                  <option value="both">Above & below</option>
                </select>
              </div>
            </div>

            <fieldset className="plain-fieldset">
              <legend className="option-label" id="editor-spacing-label">Line spacing <span className="field-hint-inline">(preview only)</span></legend>
              <div className="chip-row" role="group" aria-labelledby="editor-spacing-label">
                {LINE_SPACINGS.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    className={`chip${lineSpacing === item.value ? ' is-selected' : ''}`}
                    aria-pressed={lineSpacing === item.value}
                    onClick={() => setLineSpacing(item.value)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="field">
              <label htmlFor="bio-editor-design">Card design</label>
              <select id="bio-editor-design" value={design} onChange={(event) => setDesign(event.target.value as BioDesignKey)}>
                {BIO_DESIGNS.map((item) => (
                  <option key={item.key} value={item.key}>{item.label}</option>
                ))}
              </select>
            </div>

            {/* ------- Emoji insert ------- */}
            <div className="bio-editor-emojis">
              <p className="option-label">Add emoji</p>
              <div className="bio-editor-emoji-row" role="group" aria-label="Quick emojis">
                {QUICK_EMOJIS.map((emoji) => (
                  <button key={emoji} type="button" className="symbol-recent" onClick={() => insertAtCursor(emoji)} aria-label={`Insert ${emoji}`}>
                    {emoji}
                  </button>
                ))}
              </div>
              {recentGlyphs.length > 0 && (
                <>
                  <p className="field-hint bio-editor-emoji-sub">Recently used</p>
                  <div className="bio-editor-emoji-row" role="group" aria-label="Recently used symbols">
                    {recentGlyphs.map((glyph) => (
                      <button key={glyph} type="button" className="symbol-recent" onClick={() => insertAtCursor(glyph)} aria-label={`Insert ${glyph}`}>
                        {glyph}
                      </button>
                    ))}
                  </div>
                </>
              )}
              {favouriteGlyphs.length > 0 && (
                <>
                  <p className="field-hint bio-editor-emoji-sub">Your favourites</p>
                  <div className="bio-editor-emoji-row" role="group" aria-label="Favourite symbols">
                    {favouriteGlyphs.map((glyph) => (
                      <button key={glyph} type="button" className="symbol-recent" onClick={() => insertAtCursor(glyph)} aria-label={`Insert ${glyph}`}>
                        {glyph}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="bio-editor-actions">
              <button type="button" className="btn btn-secondary btn-small" onClick={() => void insertReadyMade()}>
                <RefreshIcon size={16} /> Insert ready-made bio
              </button>
              <button type="button" className="btn btn-secondary btn-small" onClick={resetAll}>
                <CloseIcon size={16} /> Reset
              </button>
            </div>
          </div>

          {/* ------- Live preview ------- */}
          <div className="bio-editor-preview-col">
            <p className="option-label" id="editor-preview-label">Live preview</p>
            <div
              role="region"
              aria-labelledby="editor-preview-label"
              className={`bio-card bio-design bio-design-${design} bio-editor-preview`}
              style={{ lineHeight: Number(lineSpacing) }}
            >
              <p className="bio-card-text">
                {finalText.trim() ? finalText : <span className="bio-editor-placeholder">Your styled bio will appear here…</span>}
              </p>
              <div className="bio-card-foot">
                <span className="bio-card-tags" aria-hidden="true">
                  <span className="bio-badge bio-badge-lang">{config.name}</span>
                  <span className="bio-badge bio-badge-style">{designLabel(design)}</span>
                </span>
              </div>
            </div>

            <div className="bio-editor-copy-row">
              <CopyButton
                text={finalText}
                ariaLabel="Copy the final styled bio to clipboard"
                className="bio-editor-copy"
              />
              <p className="form-footnote">Copies the exact styled text — including dividers and Unicode letters.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
