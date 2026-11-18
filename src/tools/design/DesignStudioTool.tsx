import { useMemo, useState, type CSSProperties } from 'react';
import { UNICODE_STYLES, hasDevanagari } from '../../lib/unicodeStyles';
import { CAPTION_LIMIT, bioLength } from '../../lib/text';
import { BIO_DESIGNS, designLabel, type BioDesignKey } from '../../lib/bioCollections';
import { EMOJI_FRAMES, MIX_COMBOS, MIXES_PER_PAGE, frameById } from './emojiFrames';
import CharCounter from '../../components/CharCounter';
import CopyButton from '../../components/CopyButton';
import DownloadButton from '../../components/DownloadButton';
import { RefreshIcon } from '../../components/icons';
import { useToolMode } from '../../lib/toolMode';
import AdvancedOptions from '../../components/ui/AdvancedOptions';

/**
 * Design Studio — type any sentence, get it back as ready-made designs:
 * Unicode fonts × decorative emoji frames × designer card styles. A builder
 * with a live preview on top, a gallery of hand-curated auto-mixes below.
 * Rule-based and fully client-side, like every BioCraft tool.
 */
export default function DesignStudioTool() {
  const { mode: toolMode } = useToolMode();
  const [text, setText] = useState('');
  const [styleId, setStyleId] = useState('none');
  const [frameId, setFrameId] = useState('none');
  const [design, setDesign] = useState<BioDesignKey>('minimal');
  const [page, setPage] = useState(0);
  const [previewEdit, setPreviewEdit] = useState<{ source: string; value: string } | null>(null);
  const [mixEdits, setMixEdits] = useState<Record<string, { source: string; value: string }>>({});

  const trimmed = text.trim();
  const effectiveStyleId = toolMode === 'basic' ? 'none' : styleId;
  const effectiveFrameId = toolMode === 'basic' ? 'none' : frameId;
  const effectiveDesign = toolMode === 'basic' ? 'minimal' : design;
  const count = bioLength(text);
  const showDevanagariNote = hasDevanagari(trimmed);

  const style = UNICODE_STYLES.find((item) => item.id === effectiveStyleId);
  const frame = frameById(effectiveFrameId);
  const styled = trimmed ? (style ? style.transform(trimmed) : trimmed) : '';
  const finalText = styled ? `${frame.before}${styled}${frame.after}` : '';
  const previewText = previewEdit?.source === finalText ? previewEdit.value : finalText;

  const styleLabel = style?.label ?? 'Original';
  const frameLabel = frame.id === 'none' ? null : frame.label;

  // Deterministic mix rotation — the same sentence always yields the same
  // curated page; Remix advances to the next tasteful page.
  const mixes = useMemo(() => {
    if (!trimmed) return [];
    return Array.from({ length: MIXES_PER_PAGE }, (_, i) => {
      const combo = MIX_COMBOS[(page * MIXES_PER_PAGE + i) % MIX_COMBOS.length];
      const mixStyle = UNICODE_STYLES.find((item) => item.id === combo.style);
      const mixFrame = frameById(combo.frame);
      const body = mixStyle ? mixStyle.transform(trimmed) : trimmed;
      return {
        combo,
        designLabel: designLabel(combo.design),
        styleLabel: mixStyle?.label ?? 'Original',
        frameLabel: mixFrame.id === 'none' ? null : mixFrame.label,
        text: `${mixFrame.before}${body}${mixFrame.after}`,
        key: `${combo.style}:${combo.frame}:${combo.design}`,
      };
    });
  }, [trimmed, page]);

  const remix = () => setPage((current) => current + 1);

  const mixTextFor = (mix: (typeof mixes)[number]) => {
    const edit = mixEdits[mix.key];
    return edit?.source === mix.text ? edit.value : mix.text;
  };
  const copyAllMixes = mixes.map((mix) => `${mix.styleLabel} · ${mix.combo.name}: ${mixTextFor(mix)}`).join('\n');

  return (
    <div className="tool-card">
      <div className="styles-layout">
        {/* ---------------- Sidebar: input + pickers ---------------- */}
        <div className="styles-sidebar">
          <div className="field">
            <label htmlFor="design-studio-input">Your sentence</label>
            <textarea
              id="design-studio-input"
              name="design-studio-text"
              rows={4}
              maxLength={CAPTION_LIMIT}
              placeholder="Type or paste any sentence — a bio, a caption, a line for your story…"
              value={text}
              aria-describedby="design-studio-hint"
              onChange={(event) => setText(event.target.value)}
            />
            <div className="field-meta">
              <p className="field-hint" id="design-studio-hint">
                Mix a font, an emoji frame and a card design — or scroll for ready-made mixes.
              </p>
              <CharCounter
                count={count}
                limit={CAPTION_LIMIT}
                ariaLabel="Text length against the 2200-character caption limit"
              />
            </div>
          </div>

          {showDevanagariNote && (
            <p className="tool-note" role="note">
              Devanagari text can’t be restyled — Unicode has no styled Devanagari alphabets.
              Devanagari characters pass through unchanged; emoji frames still wrap them beautifully.
            </p>
          )}

          <AdvancedOptions title="Customise the styling" description="Font style, emoji frame and card design" defaultOpen>
          <div className="field">
            <label htmlFor="design-studio-font">Font style</label>
            <select id="design-studio-font" value={styleId} onChange={(event) => setStyleId(event.target.value)}>
              <option value="none">Original (no style)</option>
              {UNICODE_STYLES.map((item) => (
                <option key={item.id} value={item.id}>{item.label}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="design-studio-frame">Emoji frame</label>
            <select id="design-studio-frame" value={frameId} onChange={(event) => setFrameId(event.target.value)}>
              {EMOJI_FRAMES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.id === 'none' ? item.label : `${item.label} — ${item.before.trim()} text ${item.after.trim()}`}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="design-studio-card">Card design</label>
            <select id="design-studio-card" value={design} onChange={(event) => setDesign(event.target.value as BioDesignKey)}>
              {BIO_DESIGNS.map((item) => (
                <option key={item.key} value={item.key}>{item.label}</option>
              ))}
            </select>
          </div>
          </AdvancedOptions>

          <p className="tool-note">
            Every design copies as plain text — styled Unicode characters and emoji, not images.
            Your sentence never leaves this page; nothing is uploaded, stored or logged.
          </p>
        </div>

        {/* ---------------- Main: preview + mixes ---------------- */}
        <div className="styles-main" aria-live="polite">
          <p className="option-label" id="design-studio-preview-label">Live preview</p>
          <div
            role="region"
            aria-labelledby="design-studio-preview-label"
            className={`bio-card bio-design bio-design-${effectiveDesign} design-studio-preview`}
          >
            <textarea
              className="bio-card-text result-editable design-studio-output"
              aria-label="Edit designed sentence output"
              rows={3}
              maxLength={CAPTION_LIMIT}
              placeholder="Your designed sentence will appear here…"
              value={previewText}
              onChange={(event) => setPreviewEdit({ source: finalText, value: event.target.value })}
            />
            <div className="bio-card-foot">
              <span className="bio-card-tags" aria-hidden="true">
                {styleLabel !== 'Original' && <span className="bio-badge bio-badge-style">{styleLabel}</span>}
                {frameLabel && <span className="bio-badge bio-badge-lang">{frameLabel}</span>}
                <span className="bio-badge bio-badge-style">{designLabel(effectiveDesign)}</span>
              </span>
              <CopyButton text={previewText} ariaLabel="Copy your designed sentence to clipboard" className="mix-copy" />
              <DownloadButton text={previewText} filename="biocraft-designed-text.txt" label="Download" />
            </div>
          </div>

          <div>
          <div className="mix-gallery-head">
            <p className="option-label" id="design-studio-mixes-label">Ready-made mixes</p>
            <div className="mix-gallery-actions">
              <button type="button" className="btn btn-secondary btn-small" onClick={remix}>
                <RefreshIcon size={15} aria-hidden="true" /> Remix
              </button>
              {mixes.length > 0 && (
                <>
                  <CopyButton text={copyAllMixes} ariaLabel="Copy all ready-made mixes to clipboard" className="mix-copy-all" />
                  <DownloadButton text={copyAllMixes} filename="biocraft-design-mixes.txt" label="Download" />
                </>
              )}
            </div>
          </div>

          {mixes.length > 0 ? (
            <ul className="bio-grid mix-grid" aria-label="Ready-made mix designs of your sentence">
              {mixes.map((mix) => (
                <li
                  key={mix.key}
                  className={`bio-card bio-design bio-design-${mix.combo.design} mix-card`}
                  style={{ '--mix-rotate': '0deg' } as CSSProperties}
                >
                  <textarea
                    className="bio-card-text result-editable design-studio-output"
                    aria-label={`Edit the ${mix.combo.name} mix output`}
                    rows={3}
                    maxLength={CAPTION_LIMIT}
                    value={mixTextFor(mix)}
                    onChange={(event) => setMixEdits((current) => ({
                      ...current,
                      [mix.key]: { source: mix.text, value: event.target.value },
                    }))}
                  />
                  <div className="bio-card-foot">
                    <span className="bio-card-tags" aria-hidden="true">
                      <span className="bio-badge bio-badge-style">{mix.styleLabel}</span>
                      {mix.frameLabel && <span className="bio-badge bio-badge-lang">{mix.frameLabel}</span>}
                      <span className="bio-badge bio-badge-style">{mix.designLabel}</span>
                    </span>
                    <CopyButton text={mixTextFor(mix)} ariaLabel={`Copy the ${mix.combo.name} mix to clipboard`} className="mix-copy" />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-state-text styles-empty">
              Type a sentence above — you’ll get {MIXES_PER_PAGE} hand-curated mixes here, ready to copy.
            </p>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
