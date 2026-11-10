import { useCallback, useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { generateCategoryBios, generatePersonalBios } from './lib/bioGenerator';
import {
  firstErrorField,
  hasErrors,
  validatePersonalForm,
} from '../../lib/validation';
import type { Language, Mode, PersonalFormErrors, PersonalFormValues } from '../../types';
import BioCard from './BioCard';
import CategoryPicker from './CategoryPicker';
import PersonalizedForm, { FIELD_ORDER, fieldId } from './PersonalizedForm';
import SegmentedControl from '../../components/SegmentedControl';
import { ClipboardIcon, RefreshIcon } from '../../components/icons';
import { copyText } from '../../lib/clipboard';
import { useToolkit } from '../../lib/toolkit';
import { useSearch } from '../../lib/router';
import { platformById } from '../platforms';
import { CATEGORIES } from './data/categories';

/**
 * Deep-link support: `/bio-generator?tab=category&category=fitness` opens the
 * category mode with the given niche preselected (used by the homepage
 * category chips). Unknown ids fall back to the current selection.
 */
const readBioDeepLink = (search: string): { categoryMode: boolean; categoryId: string | null } => {
  const params = new URLSearchParams(search);
  const requested = params.get('category');
  const valid = requested && CATEGORIES.some((c) => c.id === requested) ? requested : null;
  const categoryMode = params.get('tab') === 'category' || Boolean(valid);
  return { categoryMode, categoryId: valid };
};

const EMPTY_VALUES: PersonalFormValues = { name: '', role: '', niche: '', city: '' };

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'हिन्दी', lang: 'hi' },
] as const;

export default function BioTool() {
  const [mode, setMode] = useState<Mode>('personal');
  const [language, setLanguage] = useState<Language>('en');
  const [emojis, setEmojis] = useState(true);
  const [values, setValues] = useState<PersonalFormValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<PersonalFormErrors>({});
  const [showSummary, setShowSummary] = useState(false);
  const [categoryId, setCategoryId] = useState('creator');
  const [bios, setBios] = useState<string[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  const personalTabRef = useRef<HTMLButtonElement>(null);
  const categoryTabRef = useRef<HTMLButtonElement>(null);

  // Apply ?tab=category&category=<id> deep links whenever the search changes.
  const search = useSearch();
  useEffect(() => {
    const link = readBioDeepLink(search);
    if (link.categoryMode) setMode('category');
    if (link.categoryId) setCategoryId(link.categoryId);
  }, [search]);

  const { platform } = useToolkit();
  const platformConfig = platformById(platform);
  const bioLimit = platformConfig.bioLimit;
  const isLinkedIn = platformConfig.id === 'linkedin';
  const activeLanguage: Language = isLinkedIn ? 'en' : language;

  const runGeneration = useCallback((): boolean => {
    if (mode === 'personal') {
      const validation = validatePersonalForm(values);
      setErrors(validation);
      if (hasErrors(validation)) {
        setShowSummary(true);
        const target = firstErrorField(validation);
        if (target) {
          document.getElementById(fieldId(target))?.focus();
        }
        return false;
      }
    }

    const options = isLinkedIn ? { limit: bioLimit, poolSet: 'linkedin' as const } : { limit: bioLimit };
    const next =
      mode === 'personal'
        ? generatePersonalBios(values, activeLanguage, emojis, options)
        : generateCategoryBios(categoryId, activeLanguage, emojis, options);

    setBios(next);
    setHasGenerated(true);
    setAnnouncement('Five new bios generated.');
    return true;
  }, [mode, values, activeLanguage, emojis, categoryId, isLinkedIn, bioLimit]);

  // Switching mode invalidates the previous result set.
  const switchMode = useCallback((nextMode: Mode) => {
    setMode(nextMode);
    setBios([]);
    setHasGenerated(false);
    setShowSummary(false);
    setAnnouncement('');
  }, []);

  // Changing language / emoji / category after a successful run refreshes the
  // list in place so the output always matches the current settings. It never
  // shows errors or steals focus — it just skips refreshing while the form is
  // (temporarily) invalid and keeps the previous list instead.
  useEffect(() => {
    if (!hasGenerated) return;
    if (mode === 'personal' && hasErrors(validatePersonalForm(values))) return;

    const next =
      mode === 'personal'
        ? generatePersonalBios(values, activeLanguage, emojis, isLinkedIn ? { limit: bioLimit, poolSet: 'linkedin' as const } : { limit: bioLimit })
        : generateCategoryBios(categoryId, activeLanguage, emojis, isLinkedIn ? { limit: bioLimit, poolSet: 'linkedin' as const } : { limit: bioLimit });

    setBios(next);
    setAnnouncement('Bios refreshed to match your settings.');
    // Deliberately keyed on settings only — typing must not regenerate.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeLanguage, emojis, categoryId, isLinkedIn, bioLimit]);

  const handleFieldChange = useCallback(
    (field: keyof PersonalFormValues, value: string) => {
      setValues((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => {
        if (!prev[field]) return prev;
        const next = { ...prev };
        delete next[field];
        return next;
      });
    },
    [],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    runGeneration();
  };

  const handleTabKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    const order: Mode[] = ['personal', 'category'];
    const current = order.indexOf(mode);
    let next = current;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      next = (current + 1) % order.length;
    } else if (event.key === 'Home') {
      next = 0;
    } else if (event.key === 'End') {
      next = order.length - 1;
    }
    switchMode(order[next]);
    (order[next] === 'personal' ? personalTabRef : categoryTabRef).current?.focus();
  };

  const errorMessages = FIELD_ORDER.map((field) => errors[field]).filter(
    (message): message is string => Boolean(message),
  );

  return (
    <div className="generator-card">
      {/* ------- Left: controls ------- */}
      <div className="generator-panel">
        <div className="tabs" role="tablist" aria-label="Bio generation mode" onKeyDown={handleTabKeyDown}>
          <button
            ref={personalTabRef}
            type="button"
            role="tab"
            id="tab-personal"
            aria-selected={mode === 'personal'}
            aria-controls="panel-personal"
            tabIndex={mode === 'personal' ? 0 : -1}
            className={`tab${mode === 'personal' ? ' is-active' : ''}`}
            onClick={() => switchMode('personal')}
          >
            Personalized
          </button>
          <button
            ref={categoryTabRef}
            type="button"
            role="tab"
            id="tab-category"
            aria-selected={mode === 'category'}
            aria-controls="panel-category"
            tabIndex={mode === 'category' ? 0 : -1}
            className={`tab${mode === 'category' ? ' is-active' : ''}`}
            onClick={() => switchMode('category')}
          >
            By category
          </button>
        </div>

        <div className="generator-options">
          {isLinkedIn ? (
            <p className="tool-note tool-note-inline" role="note">
              LinkedIn professional bios are generated in English.
            </p>
          ) : (
            <SegmentedControl
              label="Bio language"
              visibleLabel="Bio language"
              options={LANGUAGE_OPTIONS}
              value={language}
              onChange={setLanguage}
            />
          )}

          <div className="option-group option-group-inline">
            <span className="option-label" id="emoji-label">
              Include emojis
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={emojis}
              aria-labelledby="emoji-label"
              className={`switch${emojis ? ' is-on' : ''}`}
              onClick={() => setEmojis((current) => !current)}
            >
              <span className="switch-knob" aria-hidden="true" />
            </button>
          </div>
        </div>

        <form className="generator-form" onSubmit={handleSubmit} noValidate>
          {mode === 'personal' && showSummary && errorMessages.length > 0 && (
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

          <div
            id="panel-personal"
            role="tabpanel"
            aria-labelledby="tab-personal"
            hidden={mode !== 'personal'}
          >
            <PersonalizedForm values={values} errors={errors} onChange={handleFieldChange} />
          </div>

          <div
            id="panel-category"
            role="tabpanel"
            aria-labelledby="tab-category"
            hidden={mode !== 'category'}
          >
            <CategoryPicker value={categoryId} language={activeLanguage} onChange={setCategoryId} />
            <p className="panel-note">
              Category mode writes bios from your niche’s common vocabulary.
            </p>
          </div>

          <button type="submit" className="btn btn-primary btn-large generate-button">
            Generate 5 bios
          </button>
          <p className="form-footnote">Free forever · No sign-up · Your text never leaves this page</p>
        </form>
      </div>

      {/* ------- Right: results ------- */}
      <div className="results-column" role="region" aria-label="Generated bios">
        <div className="results-header">
          <h2 className="results-title">
            Your five bios <span className="results-count">{hasGenerated ? bios.length : 5}</span>
          </h2>
          {hasGenerated && (
            <div className="results-actions">
              <button
                type="button"
                className="btn btn-secondary btn-small"
                onClick={() => {
                  const text = bios.join('\n\n');
                  void copyText(text).then((ok) =>
                    setAnnouncement(ok ? 'All five bios copied to clipboard.' : 'Copying failed.'),
                  );
                }}
              >
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

        {hasGenerated ? (
          <>
            <p className="results-note">
              Each bio stays within the {platformConfig.name} limit of {bioLimit} characters.
            </p>
            <ol className="results-list">
              {bios.map((bio, index) => (
                <li key={index}>
                  <BioCard
                    bio={bio}
                    index={index}
                    label="Bio"
                    limit={bioLimit}
                    limitDescription={`the ${platformConfig.name} limit (${bioLimit} characters)`}
                  />
                </li>
              ))}
            </ol>
          </>
        ) : (
          <div className="empty-state">
            <p className="empty-state-title">Your five bios will appear here.</p>
            <p className="empty-state-text">
              Fill in the form — or switch to Category mode — and press “Generate 5 bios”.
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
