import { useMemo, useState } from 'react';
import { CheckIcon, ClipboardIcon, RefreshIcon } from '../../components/icons';
import { copyText } from '../../lib/clipboard';
import {
  NICHES,
  generateHashtags,
  keywordTokens,
  type HashtagSize,
} from './data/pools';
import type { Language } from '../../types';
import SegmentedControl from '../../components/SegmentedControl';

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'हिन्दी', lang: 'hi' },
  { value: 'hg', label: 'Hinglish' },
] as const;

const SIZE_OPTIONS = [
  { value: '5', label: '5 (IG cap)' },
  { value: '10', label: '10' },
  { value: '20', label: '20' },
  { value: '30', label: '30' },
] as const;

/**
 * Hashtag Generator — a deduplicated, curated mix of broad, medium and
 * focused hashtags per niche, in English, Hindi or Hinglish, optionally blended with
 * variants of your own keywords. No reach or virality is ever promised.
 */
export default function HashtagGenerator() {
  const [nicheId, setNicheId] = useState('photography');
  const [language, setLanguage] = useState<Language>('en');
  const [size, setSize] = useState<HashtagSize>(20);
  const [rawKeywords, setRawKeywords] = useState('');
  const [keywordError, setKeywordError] = useState<string | null>(null);
  const [tags, setTags] = useState<string[] | null>(null);
  const [fromKeywords, setFromKeywords] = useState(0);
  const [copiedTag, setCopiedTag] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('');

  const activeNiche = NICHES.find((niche) => niche.id === nicheId) ?? NICHES[0];

  const runGeneration = () => {
    // The keyword field is optional but validated when present.
    const raw = rawKeywords.trim();
    if (raw && keywordTokens(raw).length === 0) {
      setKeywordError('Keywords need at least 2 letters or digits each — e.g. “street food”.');
      setTags(null);
      return;
    }
    if ([...raw].length > 200) {
      setKeywordError('Please keep keywords under 200 characters.');
      setTags(null);
      return;
    }
    setKeywordError(null);
    const result = generateHashtags(nicheId, language, size, raw);
    setTags(result.tags);
    setFromKeywords(result.fromKeywords);
    setStatusMessage(`${result.tags.length} hashtags generated.`);
  };

  const handleKeywordChange = (value: string) => {
    setRawKeywords(value);
    if (keywordError) setKeywordError(null);
  };

  const copyWithFeedback = async (value: string, label: string) => {
    const succeeded = await copyText(value);
    setCopiedTag(succeeded ? label : null);
    setStatusMessage(
      succeeded
        ? `Copied ${label === '__all__' ? 'all hashtags' : label} to clipboard.`
        : 'Copying failed. Please select the text and copy it manually.',
    );
    window.setTimeout(() => setCopiedTag(null), 1600);
  };

  const nicheLabel =
    language === 'hi' ? activeNiche.labelHi : language === 'hg' ? activeNiche.labelHg : activeNiche.labelEn;

  const copyAllText = useMemo(() => (tags ? tags.join(' ') : ''), [tags]);

  return (
    <div className="tool-card">
      <fieldset className="plain-fieldset">
        <legend className="option-label" id="hashtag-niche-legend">Niche</legend>
        <div className="chip-row" role="group" aria-labelledby="hashtag-niche-legend">
          {NICHES.map((niche) => (
            <button
              key={niche.id}
              type="button"
              className={`chip${niche.id === nicheId ? ' is-selected' : ''}`}
              aria-pressed={niche.id === nicheId}
              onClick={() => setNicheId(niche.id)}
            >
              {language === 'hi' ? niche.labelHi : language === 'hg' ? niche.labelHg : niche.labelEn}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="generator-options">
        <SegmentedControl
          label="Hashtag language"
          visibleLabel="Hashtag language"
          options={LANGUAGE_OPTIONS}
          value={language}
          onChange={setLanguage}
        />
        <SegmentedControl
          label="Number of hashtags"
          visibleLabel="How many"
          options={SIZE_OPTIONS}
          value={String(size)}
          onChange={(value) => setSize(Number(value) as HashtagSize)}
        />
      </div>

      <div className="field">
        <label htmlFor="hashtag-keywords">Your keywords (optional)</label>
        <input
          id="hashtag-keywords"
          name="hashtag-keywords"
          type="text"
          autoComplete="off"
          maxLength={200}
          placeholder="e.g. street food, यात्रा (comma separated)"
          value={rawKeywords}
          aria-invalid={keywordError ? true : undefined}
          aria-describedby={`hashtag-keywords-${keywordError ? 'error' : 'hint'}`}
          onChange={(event) => handleKeywordChange(event.target.value)}
        />
        {keywordError ? (
          <p className="field-error" id="hashtag-keywords-error" role="alert">
            {keywordError}
          </p>
        ) : (
          <p className="field-hint" id="hashtag-keywords-hint">
            Variants like <code>#travel · #travellife · #traveldaily</code> join the mix.
          </p>
        )}
      </div>

      <button type="button" className="btn btn-primary btn-large generate-button" onClick={runGeneration}>
        Generate {size} hashtags
      </button>

      <div className="results-block" role="region" aria-label="Generated hashtags">
        <div className="results-header">
          <h2 className="results-title">
            {nicheLabel} hashtags{' '}
            {tags && <span className="results-count">{tags.length}</span>}
          </h2>
          {tags && (
            <button type="button" className="btn btn-secondary btn-small" onClick={runGeneration}>
              <RefreshIcon size={16} />
              Regenerate
            </button>
          )}
        </div>

        {tags ? (
          <>
            <p className="results-note">
              A mix of broad, medium and focused tags{fromKeywords > 0 ? ' plus your keyword variants' : ''}. Tap any tag to copy it.
            </p>
            <ul className="hashtag-grid">
              {tags.map((tag) => (
                <li key={tag}>
                  <button
                    type="button"
                    className="hashtag-chip"
                    onClick={() => void copyWithFeedback(tag, tag)}
                    aria-label={`Copy hashtag ${tag}`}
                  >
                    <span>{tag}</span>
                    {copiedTag === tag ? <CheckIcon size={14} /> : <ClipboardIcon size={14} />}
                  </button>
                </li>
              ))}
            </ul>
            <div className="hashtag-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => void copyWithFeedback(copyAllText, '__all__')}
              >
                {copiedTag === '__all__' ? <CheckIcon size={16} /> : <ClipboardIcon size={16} />}
                {copiedTag === '__all__' ? 'Copied' : 'Copy all'}
              </button>
            </div>
            <p className="tool-note">
              Instagram caps Feed posts and Reels at 5 hashtags — use the 5 option for feeds.
              Hashtag volume changes constantly, so no tool can guarantee reach or virality.
              A blend of broad and focused tags is common practice, not a promise.
            </p>
          </>
        ) : (
          <div className="empty-state">
            <p className="empty-state-title">Your hashtags will appear here.</p>
            <p className="empty-state-text">
              Pick a niche and press “Generate {size} hashtags”.
            </p>
          </div>
        )}

        <p className="sr-only" role="status" aria-live="polite">
          {statusMessage}
        </p>
      </div>
    </div>
  );
}
