import { useState } from 'react';
import BioCard from '../bio/BioCard';
import CopyButton from '../../components/CopyButton';
import { RefreshIcon } from '../../components/icons';
import { generateSummaries, SUMMARY_LIMIT, isSafeLinkedinInput } from './lib/linkedin';

/**
 * LinkedIn Professional Summary Generator — rule-based, no APIs.
 * Five structured About-section drafts ≤ 2,600 characters.
 */
export default function SummaryGenerator() {
  const [role, setRole] = useState('');
  const [focus, setFocus] = useState('');
  const [results, setResults] = useState<string[] | null>(null);
  const [errors, setErrors] = useState<{ role?: string; focus?: string }>({});
  const [status, setStatus] = useState('');

  const validate = () => {
    const next: { role?: string; focus?: string } = {};
    const trimmedRole = role.trim();
    if (!trimmedRole) next.role = 'Role is required.';
    else if (trimmedRole.length < 2) next.role = 'Role must be at least 2 characters.';
    else if (trimmedRole.length > 80) next.role = 'Role must be 80 characters or fewer.';
    else if (!isSafeLinkedinInput(trimmedRole))
      next.role = "Role can only contain letters, numbers and . , ' & ( ) / + | -";
    const trimmedFocus = focus.trim();
    if (trimmedFocus.length > 120) next.focus = 'Focus must be 120 characters or fewer.';
    else if (trimmedFocus && !isSafeLinkedinInput(trimmedFocus))
      next.focus = "Focus can only contain letters, numbers and . , ' & ( ) / + | -";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleGenerate = () => {
    if (!validate()) return;
    const next = generateSummaries({ role, focus });
    setResults(next);
    setStatus(`${next.length} summaries generated.`);
  };

  const combined = results ? results.join('\n\n') : '';
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
          <label htmlFor="linkedin-summary-role">
            Your role <span className="required" aria-hidden="true">*</span>
            <span className="sr-only">(required)</span>
          </label>
          <input
            id="linkedin-summary-role"
            type="text"
            value={role}
            maxLength={80}
            placeholder="e.g. Senior Software Engineer, Content Strategist, Operations Lead"
            aria-invalid={Boolean(errors.role)}
            aria-describedby={errors.role ? 'linkedin-summary-role-error' : undefined}
            onChange={(event) => setRole(event.target.value)}
          />
          {errors.role && (
            <p className="field-error" role="alert" id="linkedin-summary-role-error">
              {errors.role}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="linkedin-summary-focus">Focus or domain <span className="optional">(optional)</span></label>
          <input
            id="linkedin-summary-focus"
            type="text"
            value={focus}
            maxLength={120}
            placeholder="e.g. developer tools, retention growth, supply chain"
            aria-invalid={Boolean(errors.focus)}
            aria-describedby={errors.focus ? 'linkedin-summary-focus-error' : undefined}
            onChange={(event) => setFocus(event.target.value)}
          />
          {errors.focus && (
            <p className="field-error" role="alert" id="linkedin-summary-focus-error">
              {errors.focus}
            </p>
          )}
        </div>

        <p className="tool-note" role="note">
          Five structured drafts built from your inputs only — no invented employers, dates or
          metrics. Edit freely before pasting into your About section.
        </p>

        <button type="submit" className="btn btn-primary btn-large generate-button">
          Generate 5 summaries
        </button>
      </form>

      <div className="results-block" role="region" aria-label="Generated summaries">
        <div className="results-header">
          <h2 className="results-title">
            Your summary drafts <span className="results-count">{results ? results.length : 5}</span>
          </h2>
          {results && (
            <div className="results-actions">
              <CopyButton text={combined} ariaLabel="Copy all five summaries to clipboard" />
              <button type="button" className="btn btn-secondary btn-small" onClick={handleGenerate}>
                <RefreshIcon size={16} />
                Regenerate
              </button>
            </div>
          )}
        </div>

        {results ? (
          <ol className="results-list">
            {results.map((summary, index) => (
              <li key={`${summary.slice(0, 24)}-${index}`}>
                <BioCard
                  bio={summary}
                  index={index}
                  label="Summary"
                  limit={SUMMARY_LIMIT}
                  limitDescription="LinkedIn's 2,600-character About limit"
                />
              </li>
            ))}
          </ol>
        ) : (
          <div className="empty-state">
            <p className="empty-state-title">Your five summary drafts will appear here.</p>
            <p className="empty-state-text">Enter your role and focus, then press “Generate 5 summaries”.</p>
          </div>
        )}
        <p className="sr-only" role="status" aria-live="polite">
          {status}
        </p>
      </div>
    </div>
  );
}
