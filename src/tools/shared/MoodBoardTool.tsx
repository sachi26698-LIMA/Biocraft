import { useCallback, useMemo, useState, type FormEvent } from 'react';
import type { Language } from '../../types';
import SegmentedControl from '../../components/SegmentedControl';
import CopyButton from '../../components/CopyButton';
import CharCounter from '../../components/CharCounter';
import { RefreshIcon, ClipboardIcon } from '../../components/icons';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';
import {
  composeMoodBoard,
  freshLine,
  type MoodBoardCategory,
} from './moodBoard';
import type { MoodBoardPools } from './moodBoard';

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'हिन्दी', lang: 'hi' },
  { value: 'hg', label: 'Hinglish' },
] as const;

const COUNT_OPTIONS = [
  { value: '5', label: '5' },
  { value: '10', label: '10' },
  { value: '20', label: '20' },
] as const;

interface MoodBoardToolProps<C extends string> {
  /** Accessible title used in copy/aria strings, e.g. "status". */
  noun: string;
  /** Categories shown as chips, in display order. */
  categories: MoodBoardCategory[];
  /** Hand-written pools keyed by category id. */
  pools: MoodBoardPools<C>;
  /** Soft caption shown under the results (e.g. "Not AI — a rule-based variation engine"). */
  honestyNote: string;
  /** Counter limit for the cards. */
  limit?: number;
  /** Accessible description of the limit. */
  limitDescription?: string;
  /** Text on the primary button, e.g. "Generate statuses". */
  generateLabel: string;
}

/**
 * Shared UI for the WhatsApp Status and Snapchat Caption studios.
 * Rule-based variation engine — not AI — labelled honestly in the UI.
 */
export default function MoodBoardTool<C extends string>({
  noun,
  categories,
  pools,
  honestyNote,
  limit = 250,
  limitDescription,
  generateLabel,
}: MoodBoardToolProps<C>) {
  const [categoryId, setCategoryId] = useState<C>(categories[0].id as C);
  const [language, setLanguage] = useState<Language>('en');
  const [noEmoji, setNoEmoji] = useState(false);
  const [count, setCount] = useState<'5' | '10' | '20'>('5');
  const [lines, setLines] = useState<string[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const { copy } = useCopyToClipboard(2000);

  const activeCategory = useMemo(
    () => categories.find((item) => item.id === categoryId) ?? categories[0],
    [categories, categoryId],
  );
  const categoryText =
    language === 'hi' ? activeCategory.labelHi : language === 'hg' ? activeCategory.labelHg : activeCategory.label;

  const runGeneration = useCallback(
    (nextCount = Number(count)) => {
      const { lines: picked } = composeMoodBoard(pools, categoryId, language, nextCount, noEmoji);
      if (picked.length === 0) {
        setAnnouncement('Nothing usable in this pool with emojis off — turn emojis back on.');
        return;
      }
      setLines(picked);
      setHasGenerated(true);
      setAnnouncement(`${picked.length} ${noun} options generated.`);
    },
    [pools, categoryId, language, noEmoji, count, noun],
  );

  const regenerateOne = useCallback(
    (index: number) => {
      const replacement = freshLine(pools, categoryId, language, noEmoji, lines);
      if (!replacement) {
        setAnnouncement('Every option in this pool is already shown — try Regenerate all.');
        return;
      }
      setLines((current) => current.map((line, i) => (i === index ? replacement : line)));
      setAnnouncement(`${noun} ${index + 1} replaced with a fresh variation.`);
    },
    [pools, categoryId, language, noEmoji, lines, noun],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    runGeneration();
  };

  const handleCopyAll = () => {
    void copy(lines.join('\n\n'));
    setAnnouncement(`Copied all ${lines.length} ${noun} options.`);
  };


  return (
    <div className="generator-card">
      {/* ------- Left: controls ------- */}
      <div className="generator-panel">
        <fieldset className="plain-fieldset">
          <legend className="option-label" id="moodboard-category-legend">Pick a vibe</legend>
          <div className="chip-row" role="group" aria-labelledby="moodboard-category-legend">
            {categories.map((item) => {
              const text = language === 'hi' ? item.labelHi : language === 'hg' ? item.labelHg : item.label;
              const selected = item.id === categoryId;
              return (
                <button
                  key={item.id}
                  type="button"
                  lang={language === 'hi' ? 'hi' : undefined}
                  className={`chip${selected ? ' is-selected' : ''}`}
                  aria-pressed={selected}
                  onClick={() => setCategoryId(item.id as C)}
                >
                  {text}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="generator-options">
          <SegmentedControl
            label="Language"
            visibleLabel="Language"
            options={LANGUAGE_OPTIONS}
            value={language}
            onChange={setLanguage}
          />

          <div className="option-group option-group-inline">
            <span className="option-label" id="moodboard-emoji-label">
              Include emojis
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={!noEmoji}
              aria-labelledby="moodboard-emoji-label"
              className={`switch${!noEmoji ? ' is-on' : ''}`}
              onClick={() => setNoEmoji((current) => !current)}
            >
              <span className="switch-knob" aria-hidden="true" />
            </button>
          </div>
        </div>

        <form className="generator-form" onSubmit={handleSubmit} noValidate>
          <SegmentedControl
            label="How many options"
            visibleLabel="How many"
            options={COUNT_OPTIONS}
            value={count}
            onChange={setCount}
          />

          <button type="submit" className="btn btn-primary btn-large generate-button">
            {generateLabel.replace('{n}', count)}
          </button>
          <p className="form-footnote">$0 forever · No sign-up · Nothing leaves your browser</p>
          <p className="form-footnote moodboard-honesty">{honestyNote}</p>
        </form>
      </div>

      {/* ------- Right: results ------- */}
      <div className="results-column" role="region" aria-label={`Generated ${noun} options`}>
        <div className="results-header">
          <h2 className="results-title">
            {categoryText} {noun} <span className="results-count">{hasGenerated ? lines.length : count}</span>
          </h2>
          {hasGenerated && lines.length > 0 && (
            <div className="results-actions">
              <button type="button" className="btn btn-secondary btn-small" onClick={handleCopyAll}>
                <ClipboardIcon size={16} />
                Copy all
              </button>
              <button type="button" className="btn btn-secondary btn-small" onClick={() => runGeneration()}>
                <RefreshIcon size={16} />
                Regenerate
              </button>
            </div>
          )}
        </div>

        {hasGenerated && lines.length > 0 ? (
          <ol className="results-list">
            {lines.map((line, index) => (
              <li key={`${index}-${line.slice(0, 12)}`}>
                <article className="bio-card" aria-label={`${noun} option ${index + 1}`}>
                  <div className="bio-card-top">
                    <span className="bio-index">
                      {noun} {index + 1}
                    </span>
                    <CharCounter
                      count={line.length}
                      limit={limit}
                      ariaLabel={`${noun} length ${limitDescription ? `against ${limitDescription}` : `against the ${limit}-character reference`}`}
                    />
                  </div>
                  <p className="bio-text">{line}</p>
                  <div className="bio-card-actions">
                    <CopyButton text={line} ariaLabel={`Copy ${noun} option ${index + 1} to clipboard`} />
                    <button
                      type="button"
                      className="bio-icon-button bio-regenerate"
                      onClick={() => regenerateOne(index)}
                      aria-label={`Regenerate ${noun} option ${index + 1} with a fresh variation`}
                      title="Fresh variation"
                    >
                      <RefreshIcon size={16} />
                    </button>
                  </div>
                </article>
              </li>
            ))}
          </ol>
        ) : (
          <div className="empty-state">
            <p className="empty-state-title">Your {noun} options will appear here.</p>
            <p className="empty-state-text">
              Pick a vibe — or ask the studio for all three languages — press “Generate” and grab the one that fits.
            </p>
          </div>
        )}

        <p className="sr-only" role="status" aria-live="polite">
          {announcement}
        </p>
      </div>
    </div>
  );
}
