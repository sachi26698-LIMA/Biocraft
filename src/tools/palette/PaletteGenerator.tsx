import { memo, useDeferredValue, useMemo, useState } from 'react';
import { CheckIcon, ClipboardIcon, RefreshIcon, SearchIcon } from '../../components/icons';
import DownloadButton from '../../components/DownloadButton';
import { copyText } from '../../lib/clipboard';
import {
  COLOR_NAMES,
  type ColorRecord,
} from '../../data/colors';
import {
  HARMONY_KINDS,
  buildHarmony,
  contrastRatio,
  formatHsl,
  formatOklch,
  hslToHex,
  nearestColor,
  normalizeHex,
  parseHex,
  readableOn,
  rgbToHsl,
  rgbToOklch,
  tonalRamp,
  toCssVariables,
  toTailwind,
  type HarmonyKind,
} from '../../lib/colorMath';

/**
 * Colour Palette Generator.
 *
 * Three ways in, all of them real:
 *   1. Type a hex or a colour name and get the exact match plus nearest names.
 *   2. Pick a starting colour and generate a harmony (analogous … monochrome).
 *   3. Shuffle a seed drawn from the 32,004-name library.
 *
 * Everything downstream — HSL/OKLCH values, WCAG contrast pairs, the tonal ramp
 * and the copy-ready CSS/Tailwind output — is computed from the colours on
 * screen, so the export always matches what the user is looking at.
 *
 * The library is MIT-licensed (color-name-list); attribution is shown in the
 * tool note rather than hidden in a licence file.
 */

type Mode = 'search' | 'harmony';

const HEX_RE = /^#?[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/;

const Swatch = memo(function Swatch({
  hex, name, copied, onCopy, size = 'normal',
}: {
  hex: string; name?: string; copied: string | null; onCopy: (hex: string) => void; size?: 'normal' | 'small';
}) {
  const fg = readableOn(hex);
  return (
    <li className={`palette-swatch${size === 'small' ? ' palette-swatch--small' : ''}`}>
      <button
        type="button"
        className="palette-swatch-btn"
        style={{ background: hex, color: fg }}
        onClick={() => onCopy(hex)}
        aria-label={`Copy ${name ? `${name} ` : ''}${hex} to clipboard`}
        title="Click to copy"
      >
        <span className="palette-swatch-hex">
          {copied === hex ? <CheckIcon size={14} /> : null}
          {hex.toUpperCase()}
        </span>
        {name ? <span className="palette-swatch-name">{name}</span> : null}
      </button>
    </li>
  );
});

export default function PaletteGenerator() {
  const [mode, setMode] = useState<Mode>('search');
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const [base, setBase] = useState('#3b82f6');
  const [hexInput, setHexInput] = useState('');
  const [harmony, setHarmony] = useState<HarmonyKind>('analogous');
  const [harmonySize, setHarmonySize] = useState(5);
  const [copied, setCopied] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const [exportKind, setExportKind] = useState<'css' | 'tailwind' | 'hex'>('css');

  const trimmed = deferredQuery.trim();

  /** Library matches: name substring, exact hex, or hex prefix. */
  const matches = useMemo<ColorRecord[]>(() => {
    if (!trimmed) return [];
    const q = trimmed.toLowerCase();
    const wantedHex = normalizeHex(trimmed);
    const out: ColorRecord[] = [];
    for (const record of COLOR_NAMES) {
      if (wantedHex && record.hex === wantedHex) out.push(record);
      else if (record.name.toLowerCase().includes(q)) out.push(record);
      if (out.length >= 120) break;
    }
    return out;
  }, [trimmed]);

  const hexError = hexInput.trim().length > 0 && !HEX_RE.test(hexInput.trim());

  /** The palette currently being exported/viewed. */
  const palette = useMemo(() => {
    if (mode === 'harmony') return buildHarmony(base, harmony, harmonySize);
    if (matches.length > 0) return matches.slice(0, 12).map((m) => m.hex);
    return [base];
  }, [mode, base, harmony, harmonySize, matches]);

  const ramp = useMemo(() => tonalRamp(base, 10), [base]);
  const baseRgb = parseHex(base);
  const hsl = baseRgb ? rgbToHsl(baseRgb) : null;
  const oklch = baseRgb ? rgbToOklch(baseRgb) : null;
  const closest = useMemo(() => (baseRgb ? nearestColor(base, COLOR_NAMES, 3) : []), [base, baseRgb]);

  const copyWithFeedback = async (text: string, label: string) => {
    const ok = await copyText(text);
    setCopied(ok ? text : null);
    setStatus(ok ? `Copied ${label}.` : 'Copying failed — select the text and copy it manually.');
    window.setTimeout(() => setCopied(null), 1600);
  };

  const exportText = useMemo(() => {
    const entries = palette.map((hex) => ({ hex }));
    if (exportKind === 'css') return toCssVariables(entries);
    if (exportKind === 'tailwind') return toTailwind(entries);
    return palette.join('\n');
  }, [palette, exportKind]);

  const applyHex = () => {
    const normalized = normalizeHex(hexInput.trim());
    if (!normalized) {
      setStatus('That is not a valid hex colour. Use 3 or 6 digits, e.g. #3b82f6.');
      return;
    }
    setBase(normalized);
    setMode('harmony');
    setStatus(`Base colour set to ${normalized}.`);
  };

  const shuffle = () => {
    const pick = COLOR_NAMES[Math.floor(Math.random() * COLOR_NAMES.length)];
    setBase(pick.hex);
    setMode('harmony');
    setStatus(`Picked ${pick.name} (${pick.hex}).`);
  };

  return (
    <div className="tool-card">
      <div className="chip-row" role="group" aria-label="Palette source">
        <button
          type="button"
          className={`chip${mode === 'search' ? ' is-selected' : ''}`}
          aria-pressed={mode === 'search'}
          onClick={() => setMode('search')}
        >
          Search {COLOR_NAMES.length.toLocaleString()} names
        </button>
        <button
          type="button"
          className={`chip${mode === 'harmony' ? ' is-selected' : ''}`}
          aria-pressed={mode === 'harmony'}
          onClick={() => setMode('harmony')}
        >
          Build a harmony
        </button>
      </div>

      {mode === 'search' ? (
        <>
          <div className="field">
            <label htmlFor="palette-search">Colour name or hex</label>
            <div className="input-with-icon">
              <SearchIcon size={18} />
              <input
                id="palette-search"
                type="search"
                autoComplete="off"
                placeholder="e.g. teal, midnight, #3b82f6"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <p className="field-hint">
              {trimmed
                ? `${matches.length}${matches.length >= 120 ? '+' : ''} match${matches.length === 1 ? '' : 'es'}`
                : 'Names come from a 32,004-entry MIT-licensed colour dictionary.'}
            </p>
          </div>

          <div className="results-block" role="region" aria-label="Colour matches">
            {matches.length > 0 ? (
              <ul className="palette-grid">
                {matches.slice(0, 60).map((match) => (
                  <Swatch
                    key={`${match.hex}-${match.name}`}
                    hex={match.hex}
                    name={match.name}
                    copied={copied}
                    onCopy={(hex) => {
                      setBase(hex);
                      void copyWithFeedback(hex, hex);
                    }}
                  />
                ))}
              </ul>
            ) : (
              <div className="empty-state">
                <p className="empty-state-title">
                  {trimmed ? 'No colour by that name.' : 'Search the colour library.'}
                </p>
                <p className="empty-state-text">
                  {trimmed
                    ? 'Try a broader word, or switch to “Build a harmony” and paste any hex.'
                    : 'Type a colour name to see every shade, or paste a hex code to copy it.'}
                </p>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <fieldset className="plain-fieldset">
            <legend className="option-label" id="harmony-kind-legend">Harmony</legend>
            <div className="chip-row" role="group" aria-labelledby="harmony-kind-legend">
              {HARMONY_KINDS.map((kind) => (
                <button
                  key={kind.id}
                  type="button"
                  className={`chip${kind.id === harmony ? ' is-selected' : ''}`}
                  aria-pressed={kind.id === harmony}
                  title={kind.note}
                  onClick={() => setHarmony(kind.id)}
                >
                  {kind.label}
                </button>
              ))}
            </div>
            <p className="field-hint">{HARMONY_KINDS.find((k) => k.id === harmony)?.note}</p>
          </fieldset>

          <div className="generator-options">
            <div className="field">
              <label htmlFor="palette-base">Base colour</label>
              <div className="palette-base-row">
                <input
                  id="palette-base"
                  type="color"
                  aria-label="Pick a base colour"
                  value={base}
                  onChange={(event) => setBase(event.target.value)}
                />
                <input
                  type="text"
                  aria-label="Base colour hex"
                  value={hexInput || base}
                  aria-invalid={hexError ? true : undefined}
                  onChange={(event) => setHexInput(event.target.value)}
                  onKeyDown={(event) => { if (event.key === 'Enter') applyHex(); }}
                />
                <button type="button" className="btn btn-secondary btn-small" onClick={applyHex}>Apply</button>
              </div>
              {hexError ? <p className="field-error" role="alert">Use 3 or 6 hex digits, e.g. #3b82f6.</p> : null}
            </div>

            <div className="field">
              <label htmlFor="palette-size">Colours in palette: {harmonySize}</label>
              <input
                id="palette-size"
                type="range"
                min={2}
                max={12}
                step={1}
                value={harmonySize}
                onChange={(event) => setHarmonySize(Number(event.target.value))}
              />
            </div>
          </div>

          <div className="results-block" role="region" aria-label="Generated palette">
            <div className="results-header">
              <h2 className="results-title">Palette <span className="results-count">{palette.length}</span></h2>
              <div className="results-actions">
                <button type="button" className="btn btn-secondary btn-small" onClick={shuffle}>
                  <RefreshIcon size={16} /> Random base
                </button>
              </div>
            </div>
            <ul className="palette-grid">
              {palette.map((hex, index) => (
                <Swatch key={`${hex}-${index}`} hex={hex} copied={copied} onCopy={(value) => void copyWithFeedback(value, value)} />
              ))}
            </ul>

            <section className="palette-detail" aria-label="Colour values">
              <h3>Base colour values</h3>
              <dl className="palette-values">
                <div><dt>HEX</dt><dd>{base.toUpperCase()}</dd></div>
                <div><dt>RGB</dt><dd>{baseRgb ? `rgb(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b})` : '—'}</dd></div>
                <div><dt>HSL</dt><dd>{hsl ? formatHsl(hsl) : '—'}</dd></div>
                <div><dt>OKLCH</dt><dd>{oklch ? formatOklch(oklch) : '—'}</dd></div>
                <div><dt>vs white</dt><dd>{contrastRatio(base, '#ffffff')}:1</dd></div>
                <div><dt>vs black</dt><dd>{contrastRatio(base, '#000000')}:1</dd></div>
              </dl>
              <p className="field-hint">
                WCAG AA needs 4.5:1 for body text and 3:1 for large text. Black/white text on this colour
                would be {readableOn(base) === '#000000' ? 'black' : 'white'}.
              </p>
            </section>

            <section aria-label="Tonal ramp">
              <h3>Tonal ramp</h3>
              <ul className="palette-ramp">
                {ramp.map((hex) => (
                  <li key={hex}>
                    <button type="button" style={{ background: hex }} onClick={() => void copyWithFeedback(hex, hex)}
                      aria-label={`Copy ${hex}`} title={`${hex} — ${contrastRatio(hex, '#ffffff')}:1 vs white`} />
                  </li>
                ))}
              </ul>
            </section>

            {closest.length > 0 && (
              <section aria-label="Nearest named colours">
                <h3>Closest named colours</h3>
                <ul className="palette-grid">
                  {closest.map((near) => (
                    <Swatch key={near.hex + near.name} hex={near.hex} name={near.name} copied={copied}
                      size="small" onCopy={(value) => void copyWithFeedback(value, near.name)} />
                  ))}
                </ul>
              </section>
            )}

            <section aria-label="Export palette">
              <h3>Export</h3>
              <div className="chip-row" role="group" aria-label="Export format">
                {([['css', 'CSS variables'], ['tailwind', 'Tailwind'], ['hex', 'Hex list']] as const).map(([id, label]) => (
                  <button key={id} type="button" className={`chip${exportKind === id ? ' is-selected' : ''}`}
                    aria-pressed={exportKind === id} onClick={() => setExportKind(id)}>{label}</button>
                ))}
              </div>
              <label className="sr-only" htmlFor="palette-export">Palette export</label>
              <textarea id="palette-export" className="result-editable" rows={6} readOnly value={exportText} />
              <div className="results-actions">
                <button type="button" className="btn btn-secondary btn-small" onClick={() => void copyWithFeedback(exportText, 'palette export')}>
                  {copied === exportText ? <CheckIcon size={16} /> : <ClipboardIcon size={16} />}
                  {copied === exportText ? 'Copied' : 'Copy'}
                </button>
                <DownloadButton text={exportText} filename={`biocraft-palette.${exportKind === 'hex' ? 'txt' : exportKind === 'css' ? 'css' : 'js'}`} />
              </div>
            </section>
          </div>
        </>
      )}

      <p className="tool-note">
        Colour names from <a href="https://github.com/meodai/color-names" target="_blank" rel="noreferrer noopener">color-names</a> (MIT).
        Conversions, harmonies and contrast ratios are computed in your browser — nothing is uploaded.
      </p>
      <p className="sr-only" role="status" aria-live="polite">{status}</p>
    </div>
  );
}

/** Exported for the unit tests: harmony generation must be deterministic. */
export { buildHarmony, hslToHex };
