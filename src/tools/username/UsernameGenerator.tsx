import { useEffect, useRef, useState } from 'react';
import {
  generateUsernames,
  prepareTokens,
  validateUsernameForm,
  USERNAME_TARGET,
  HANDLE_PATTERN,
  type UsernameSuggestion,
  type UsernameFormValues,
  type UsernameVibe,
} from './lib/usernameGenerator';
import { copyText } from '../../lib/clipboard';
import { CheckIcon, ClipboardIcon, RefreshIcon } from '../../components/icons';
import DownloadButton from '../../components/DownloadButton';
import { useToolMode } from '../../lib/toolMode';

const VIBE_OPTIONS: Array<{ id: UsernameVibe; en: string; hi: string }> = [
  { id: 'aesthetic', en: 'Aesthetic', hi: 'सौंदर्य' },
  { id: 'professional', en: 'Professional', hi: 'प्रो' },
  { id: 'short', en: 'Short', hi: 'छोटा' },
  { id: 'playful', en: 'Playful', hi: 'मज़ेदार' },
];

const FIELD_ORDER: Array<keyof UsernameFormValues> = ['name', 'keyword'];
const fieldId = (field: keyof UsernameFormValues) => `username-${field}`;

/**
 * Username Generator — twelve unique Instagram handle suggestions per run.
 * Rule-based: Unicode-aware validation, Devanagari transliteration, eight
 * handle styles, strict deduplication. Availability on Instagram is never
 * guaranteed — Instagram decides what is taken.
 */
export default function UsernameGenerator() {
  const { mode: toolMode } = useToolMode();
  const [values, setValues] = useState<UsernameFormValues>({ name: '', keyword: '' });
  const [vibe, setVibe] = useState<UsernameVibe>('aesthetic');
  const [maxLength, setMaxLength] = useState(12);
  const [errors, setErrors] = useState<Partial<Record<keyof UsernameFormValues, string>>>({});
  const [showSummary, setShowSummary] = useState(false);
  const [results, setResults] = useState<UsernameSuggestion[] | null>(null);
  const [copiedHandle, setCopiedHandle] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const generationValues = toolMode === 'basic' ? { ...values, keyword: '' } : values;
  const copyTimer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (copyTimer.current !== null) window.clearTimeout(copyTimer.current);
    },
    [],
  );

  const errorMessages = FIELD_ORDER.map((field) => errors[field]).filter(
    (message): message is string => Boolean(message),
  );

  const runGeneration = () => {
    const nextErrors = validateUsernameForm(generationValues);
    setErrors(nextErrors);
    const hasFailures = Object.keys(nextErrors).length > 0;
    setShowSummary(hasFailures);
    if (hasFailures) {
      const first = FIELD_ORDER.find((field) => nextErrors[field]);
      if (first) document.getElementById(fieldId(first))?.focus();
      return;
    }
    const suggestions = generateUsernames(generationValues, { vibe: toolMode === 'basic' ? 'aesthetic' : vibe, maxLength: toolMode === 'basic' ? 12 : maxLength });
    setResults(suggestions);
    setStatusMessage(`${suggestions.length} usernames generated.`);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    runGeneration();
  };

  const handleChange = (field: keyof UsernameFormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[field];
        return next;
      });
    }
  };

  const copyHandle = async (handle: string) => {
    const succeeded = await copyText(handle);
    if (copyTimer.current !== null) window.clearTimeout(copyTimer.current);
    setCopiedHandle(succeeded ? handle : null);
    setStatusMessage(
      succeeded
        ? `Copied ${handle} to clipboard.`
        : 'Copying failed. Please long-press the handle and copy it manually.',
    );
    copyTimer.current = window.setTimeout(() => setCopiedHandle(null), 1600);
  };

  const tokens = results ? prepareTokens(generationValues) : null;

  return (
    <div className="tool-card">
      <form className="generator-form" onSubmit={handleSubmit} noValidate>
        {showSummary && errorMessages.length > 0 && (
          <div className="form-error-summary" role="alert">
            <p className="form-error-title">Please fix the following:</p>
            <ul>
              {FIELD_ORDER.filter((field) => errors[field]).map((field) => (
                <li key={field}>
                  <a href={`#${fieldId(field)}`}>{errors[field]}</a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="form-grid">
          <div className="field">
            <label htmlFor={fieldId('name')}>
              Your name <span className="required" aria-hidden="true">*</span>
              <span className="sr-only">(required)</span>
            </label>
            <input
              id={fieldId('name')}
              name="username-name"
              type="text"
              autoComplete="name"
              maxLength={60}
              placeholder="e.g. Priya Sharma or प्रिया शर्मा"
              value={values.name}
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={`${fieldId('name')}-${errors.name ? 'error' : 'hint'}`}
              onChange={(event) => handleChange('name', event.target.value)}
            />
            {errors.name ? (
              <p className="field-error" id={`${fieldId('name')}-error`} role="alert">
                {errors.name}
              </p>
            ) : (
              <p className="field-hint" id={`${fieldId('name')}-hint`}>
                Hindi (Devanagari) is fine — it is transliterated for the handle.
              </p>
            )}
          </div>

          <div className="field tool-advanced">
            <label htmlFor={fieldId('keyword')}>Keyword or niche</label>
            <input
              id={fieldId('keyword')}
              name="username-keyword"
              type="text"
              autoComplete="off"
              maxLength={40}
              placeholder="e.g. fashion, photography (optional)"
              value={values.keyword}
              aria-invalid={errors.keyword ? true : undefined}
              aria-describedby={`${fieldId('keyword')}-${errors.keyword ? 'error' : 'hint'}`}
              onChange={(event) => handleChange('keyword', event.target.value)}
            />
            {errors.keyword ? (
              <p className="field-error" id={`${fieldId('keyword')}-error`} role="alert">
                {errors.keyword}
              </p>
            ) : (
              <p className="field-hint" id={`${fieldId('keyword')}-hint`}>
                Adds keyword blends like <code>priya.fashion</code> to the mix.
              </p>
            )}
          </div>
        </div>


        <div className="fieldset-row tool-advanced">
          <fieldset className="plain-fieldset plain-fieldset-grow">
            <legend className="option-label" id="vibe-legend">Vibe <span lang="hi" className="option-label-hi">वाइब</span></legend>
            <div className="chip-row" role="group" aria-labelledby="vibe-legend">
              {VIBE_OPTIONS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`chip chip-bilingual${item.id === vibe ? ' is-selected' : ''}`}
                  aria-pressed={item.id === vibe}
                  onClick={() => setVibe(item.id)}
                >
                  {item.en}
                  <small lang="hi">{item.hi}</small>
                </button>
              ))}
            </div>
          </fieldset>

          <div className="field field-select">
            <label className="option-label" htmlFor="username-length">
              Length <span lang="hi" className="option-label-hi">लंबाई</span>
            </label>
            <select
              id="username-length"
              className="select"
              value={maxLength}
              onChange={(event) => setMaxLength(Number(event.target.value))}
            >
              <option value={10}>Short — 10</option>
              <option value={12}>Default — 12</option>
              <option value={18}>Long — 18</option>
            </select>
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-large generate-button">
          Generate {USERNAME_TARGET} usernames
        </button>
        <p className="form-footnote">$0 forever · No sign-up · Your text never leaves this page</p>
      </form>

      <div className="results-block" role="region" aria-label="Generated usernames">
        <div className="results-header">
          <h2 className="results-title">
            Your twelve handles{' '}
            <span className="results-count">{results ? results.length : USERNAME_TARGET}</span>
          </h2>
          {results && (
            <div className="results-actions">
              <button
                type="button"
                className="btn btn-secondary btn-small"
                onClick={() => {
                  const text = results.map((item) => item.username).join('\n');
                  void copyText(text).then((ok) =>
                    setStatusMessage(ok ? 'All twelve handles copied to clipboard.' : 'Copying failed.'),
                  );
                }}
              >
                <ClipboardIcon size={16} />
                Copy all
              </button>
              <DownloadButton text={results.map((item) => item.username).join('\n')} filename="biocraft-usernames.txt" />
              <button type="button" className="btn btn-secondary btn-small" onClick={() => setResults(null)}>Reset results</button>
              <button type="button" className="btn btn-secondary btn-small" onClick={runGeneration}>
                <RefreshIcon size={16} />
                Regenerate
              </button>
            </div>
          )}
        </div>

        {results ? (
          <>
            {tokens?.transliterated && (
              <p className="results-note">
                Devanagari transliterated as “{tokens.base}”{tokens.keyword ? (
                  <> · keyword “{tokens.keyword}”</>
                ) : null}
                . Transliteration is approximate.
              </p>
            )}
            <ol className="username-grid">
              {results.map((suggestion, index) => (
                <li key={index}>
                  <article className="username-item">
                    <span className="username-text">
                      <label className="sr-only" htmlFor={`username-result-${index}`}>Edit username idea {index + 1}</label>
                      <input id={`username-result-${index}`} className="username-handle username-result-input" value={suggestion.username} maxLength={30} spellCheck={false} aria-invalid={!HANDLE_PATTERN.test(suggestion.username)} aria-label={`Edit username idea ${index + 1}`} onChange={(event) => { const username = event.target.value; setResults((current) => current?.map((item, i) => i === index ? { ...item, username } : item) ?? null); }} />
                      <span className="username-style">{suggestion.style}</span>
                    </span>
                    <button type="button" className="username-copy-button" onClick={() => void copyHandle(suggestion.username)} disabled={!HANDLE_PATTERN.test(suggestion.username)} aria-label={`Copy handle ${suggestion.username} to clipboard`}>
                      {copiedHandle === suggestion.username ? <CheckIcon size={16} /> : <ClipboardIcon size={16} />}
                    </button>
                  </article>
                </li>
              ))}
            </ol>
            <p className="results-note">
              Edit any handle directly; copying is enabled while it follows Instagram’s format.
              Availability is never guaranteed — Instagram decides what is taken.
            </p>
          </>
        ) : (
          <div className="empty-state">
            <p className="empty-state-title">Your twelve handles will appear here.</p>
            <p className="empty-state-text">
              Type your name — add a keyword if you like — and press “Generate {USERNAME_TARGET} usernames”.
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
