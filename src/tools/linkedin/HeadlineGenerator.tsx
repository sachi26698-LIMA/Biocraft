import { useState } from 'react';
import BioCard from '../bio/BioCard';
import CopyButton from '../../components/CopyButton';
import { RefreshIcon } from '../../components/icons';
import { generateHeadlines, HEADLINE_LIMIT, isSafeLinkedinInput } from './lib/linkedin';

/**
 * LinkedIn Professional Headline Generator — rule-based, no APIs.
 * Five options ≤ 220 characters from Role | Value | Proof patterns.
 */
export default function HeadlineGenerator() {
  const [role, setRole] = useState('');
  const [focus, setFocus] = useState('');
  const [years, setYears] = useState('');
  const [results, setResults] = useState<string[] | null>(null);
  const [errors, setErrors] = useState<{ role?: string; focus?: string; years?: string }>({});
  const [status, setStatus] = useState('');

  const validate = () => {
    const next: { role?: string; focus?: string; years?: string } = {};
    const trimmedRole = role.trim();
    if (!trimmedRole) next.role = 'Role is required.';
    else if (trimmedRole.length < 2) next.role = 'Role must be at least 2 characters.';
    else if (trimmedRole.length > 80) next.role = 'Role must be 80 characters or fewer.';
    else if (!isSafeLinkedinInput(trimmedRole))
      next.role = "Role can only contain letters, numbers and . , ' & ( ) / + | -";
    const trimmedFocus = focus.trim();
    if (trimmedFocus.length > 80) next.focus = 'Focus must be 80 characters or fewer.';
    else if (trimmedFocus && !isSafeLinkedinInput(trimmedFocus))
      next.focus = "Focus can only contain letters, numbers and . , ' & ( ) / + | -";
    const trimmedYears = years.trim();
    if (trimmedYears && !/^\d{1,2}$/.test(trimmedYears))
      next.years = 'Years of experience must be a number between 0 and 45.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleGenerate = () => {
    if (!validate()) return;
    const next = generateHeadlines({ role, focus, years });
    setResults(next);
    setStatus(`${next.length} headlines generated.`);
  };

  const combined = results ? results.join('\n') : '';
  const errorList = Object.values(errors);

  return (
    <div className="tool-card">
      <form
        className="generator-form"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          handleGenerate();
        }}
      >
        {errorList.length > 0 && (
          <div className="form-error-summary" role="alert">
            <p className="form-error-title">Please fix the following:</p>
            <ul>
              {errorList.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="field">
          <label htmlFor="linkedin-headline-role">
            Your role <span className="required" aria-hidden="true">*</span>
            <span className="sr-only">(required)</span>
          </label>
          <input
            id="linkedin-headline-role"
            type="text"
            value={role}
            maxLength={80}
            placeholder="e.g. Product Manager, Frontend Engineer, Growth Marketer"
            aria-invalid={Boolean(errors.role)}
            aria-describedby={errors.role ? 'linkedin-headline-role-error' : undefined}
            onChange={(event) => setRole(event.target.value)}
          />
          {errors.role && (
            <p className="field-error" role="alert" id="linkedin-headline-role-error">
              {errors.role}
            </p>
          )}
        </div>

        <div className="field-grid">
          <div className="field">
            <label htmlFor="linkedin-headline-focus">Focus or domain <span className="optional">(optional)</span></label>
            <input
              id="linkedin-headline-focus"
              type="text"
              value={focus}
              maxLength={80}
              placeholder="e.g. developer tools, fintech, climate"
              aria-invalid={Boolean(errors.focus)}
              aria-describedby={errors.focus ? 'linkedin-headline-focus-error' : undefined}
              onChange={(event) => setFocus(event.target.value)}
            />
            {errors.focus && (
              <p className="field-error" role="alert" id="linkedin-headline-focus-error">
                {errors.focus}
              </p>
            )}
          </div>
          <div className="field">
            <label htmlFor="linkedin-headline-years">Years of experience <span className="optional">(optional)</span></label>
            <input
              id="linkedin-headline-years"
              type="number"
              min={0}
              max={45}
              inputMode="numeric"
              value={years}
              placeholder="e.g. 6"
              aria-invalid={Boolean(errors.years)}
              aria-describedby={errors.years ? 'linkedin-headline-years-error' : undefined}
              onChange={(event) => setYears(event.target.value)}
            />
            {errors.years && (
              <p className="field-error" role="alert" id="linkedin-headline-years-error">
                {errors.years}
              </p>
            )}
          </div>
        </div>

        <p className="tool-note" role="note">
          Drafts use only your role, focus and experience — no invented employers or metrics.
          Adapt them to your real story before posting.
        </p>

        <button type="submit" className="btn btn-primary btn-large generate-button">
          Generate 5 headlines
        </button>
      </form>

      <div className="results-block" role="region" aria-label="Generated headlines">
        <div className="results-header">
          <h2 className="results-title">
            Your headlines <span className="results-count">{results ? results.length : 5}</span>
          </h2>
          {results && (
            <div className="results-actions">
              <CopyButton text={combined} ariaLabel="Copy all five headlines to clipboard" />
              <button type="button" className="btn btn-secondary btn-small" onClick={handleGenerate}>
                <RefreshIcon size={16} />
                Regenerate
              </button>
            </div>
          )}
        </div>

        {results ? (
          <ol className="results-list">
            {results.map((headline, index) => (
              <li key={`${headline}-${index}`}>
                <BioCard
                  bio={headline}
                  index={index}
                  label="Headline"
                  limit={HEADLINE_LIMIT}
                  limitDescription="LinkedIn's 220-character headline limit"
                />
              </li>
            ))}
          </ol>
        ) : (
          <div className="empty-state">
            <p className="empty-state-title">Your five headlines will appear here.</p>
            <p className="empty-state-text">Enter your role and focus, then press “Generate 5 headlines”.</p>
          </div>
        )}
        <p className="sr-only" role="status" aria-live="polite">
          {status}
        </p>
      </div>
    </div>
  );
}
