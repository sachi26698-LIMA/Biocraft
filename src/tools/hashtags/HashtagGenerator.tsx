import PublishedCatalog from '../../components/PublishedCatalog';
import { useMemo, useState } from 'react';
import DownloadButton from '../../components/DownloadButton';
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
import CountControl from '../../components/CountControl';
import { useToolMode } from '../../lib/toolMode';

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'हिन्दी', lang: 'hi' },
  { value: 'hg', label: 'Hinglish' },
] as const;

/**
 * Hashtag Generator — a deduplicated, curated mix of broad, medium and
 * focused hashtags per niche, in English, Hindi or Hinglish, optionally blended with
 * variants of your own keywords. No reach or virality is ever promised.
 */
export default function HashtagGenerator() {
  const { mode: toolMode } = useToolMode();
  const [nicheId, setNicheId] = useState('photography');
  const [language, setLanguage] = useState<Language>('en');
  const [size, setSize] = useState<HashtagSize>(20);
  const [rawKeywords, setRawKeywords] = useState('');
  const [keywordError, setKeywordError] = useState<string | null>(null);
  const [tags, setTags] = useState<string[] | null>(null);
  const [groups, setGroups] = useState({ keywords: [] as string[], broad: [] as string[], medium: [] as string[], focused: [] as string[], custom: [] as string[] });
  const [fromKeywords, setFromKeywords] = useState(0);
  const [copiedTag, setCopiedTag] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const generationNiche = toolMode === 'basic' ? 'photography' : nicheId;
  const generationLanguage: Language = toolMode === 'basic' ? 'en' : language;
  const generationSize: HashtagSize = toolMode === 'basic' ? 20 : size;
  const generationKeywords = toolMode === 'basic' ? '' : rawKeywords;

  const activeNiche = NICHES.find((niche) => niche.id === generationNiche) ?? NICHES[0];

  const runGeneration = () => {
    // The keyword field is optional but validated when present.
    const raw = generationKeywords.trim();
    if (raw && keywordTokens(raw).length === 0) {
      setKeywordError('Keywords need at least 2 letters or digits each — e.g. “street food”.');
      return;
    }
    if ([...raw].length > 200) {
      setKeywordError('Please keep keywords under 200 characters.');
      return;
    }
    setKeywordError(null);
    const result = generateHashtags(generationNiche, generationLanguage, generationSize, raw);
    // Avoid a visibly unchanged result after a rare same-order random draw,
    // while keeping each item in its relevance bucket.
    const sameOrder = tags?.length === result.tags.length && tags.every((tag, index) => tag === result.tags[index]);
    const nextGroups = {
      keywords: [...result.groups.keywords],
      broad: [...result.groups.broad],
      medium: [...result.groups.medium],
      focused: [...result.groups.focused],
      custom: [],
    };
    if (sameOrder) {
      const firstGroup = (['keywords', 'broad', 'medium', 'focused'] as const).find((key) => nextGroups[key].length > 1);
      if (firstGroup) nextGroups[firstGroup] = [...nextGroups[firstGroup].slice(1), nextGroups[firstGroup][0]];
    }
    const nextTags = [...nextGroups.keywords, ...nextGroups.broad, ...nextGroups.medium, ...nextGroups.focused];
    setTags(nextTags);
    setGroups(nextGroups);
    setFromKeywords(result.fromKeywords);
    setStatusMessage(`${nextTags.length} hashtags generated.`);
  };

  const handleKeywordChange = (value: string) => {
    setRawKeywords(value);
    if (keywordError) setKeywordError(null);
  };

  const handleTagsEdit = (value: string) => {
    const edited = value.split(/\s+/).filter(Boolean);
    setTags(edited);
    setGroups({ keywords: [], broad: [], medium: [], focused: [], custom: edited });
    setFromKeywords(0);
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
    generationLanguage === 'hi' ? activeNiche.labelHi : generationLanguage === 'hg' ? activeNiche.labelHg : activeNiche.labelEn;

  const copyAllText = useMemo(() => (tags ? tags.join(' ') : ''), [tags]);
  const visibleGroups = [
    { label: 'Your keywords', tags: groups.keywords },
    { label: 'Broad discovery', tags: groups.broad },
    { label: 'Medium niche', tags: groups.medium },
    { label: 'Focused community', tags: groups.focused },
    { label: 'Your edited set', tags: groups.custom },
  ].filter((group) => group.tags.length > 0);

  return (
    <div className="tool-card">
      <fieldset className="plain-fieldset tool-advanced">
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

      <div className="generator-options tool-advanced">
        <SegmentedControl
          label="Hashtag language"
          visibleLabel="Hashtag language"
          options={LANGUAGE_OPTIONS}
          value={language}
          onChange={setLanguage}
        />
        <CountControl
          label="Number of hashtags"
          noun="hashtags"
          value={size}
          onChange={setSize}
        />
      </div>

      <div className="field tool-advanced">
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
        Generate {generationSize} hashtags
      </button>

      <div className="results-block" role="region" aria-label="Generated hashtags">
        <div className="results-header">
          <h2 className="results-title">
            {nicheLabel} hashtags{' '}
            {tags && <span className="results-count">{tags.length}</span>}
          </h2>
          {tags && (
            <div className="results-actions">
              <DownloadButton text={tags.join(' ')} filename="biocraft-hashtags.txt" />
              <button type="button" className="btn btn-secondary btn-small" onClick={runGeneration}>
                <RefreshIcon size={16} /> Regenerate
              </button>
              <button type="button" className="btn btn-secondary btn-small" onClick={() => setTags(null)}>Reset results</button>
            </div>
          )}
        </div>

        {tags ? (
          <>
            <p className="results-note">
              A mix of broad, medium and focused tags{fromKeywords > 0 ? ' plus your keyword variants' : ''}. Edit below, or tap any tag to copy it.
            </p>
            <label className="sr-only" htmlFor="hashtag-results-edit">Edit generated hashtags</label>
            <textarea id="hashtag-results-edit" className="result-editable hashtag-editable" rows={3} value={tags.join(' ')} onChange={(event) => handleTagsEdit(event.target.value)} />
            <div className="hashtag-groups">
              {visibleGroups.map((group) => (
                <section className="hashtag-result-group" key={group.label} aria-label={group.label}>
                  <h3>{group.label}</h3>
                  <ul className="hashtag-grid">
                    {group.tags.map((tag) => (
                      <li key={`${group.label}-${tag}`}>
                        <button type="button" className="hashtag-chip" onClick={() => void copyWithFeedback(tag, tag)} aria-label={`Copy hashtag ${tag}`}>
                          <span>{tag}</span>
                          {copiedTag === tag ? <CheckIcon size={14} /> : <ClipboardIcon size={14} />}
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
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
      <PublishedCatalog kind="hashtags" language={toolMode === 'basic' ? 'en' : language} />
    </div>
  );
}
