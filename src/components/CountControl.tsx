/**
 * "How many" control shared by every generator.
 *
 * Replaces the fixed 5 / 10 / 20 segmented buttons that each tool used to carry.
 * Those presets were an arbitrary product cap: a user who wanted 50 results had
 * no way to ask for them, and the ceiling could only move by editing a constant
 * and rebuilding the whole site.
 *
 * Now the presets are a shortcut and the field is the answer. Any value up to
 * the disclosed per-request ceiling is accepted, and the ceiling itself comes
 * from configuration (src/lib/limits.ts), not from this file.
 *
 * Accessibility: a real <input type="number"> with a visible label, a described
 * ceiling, and an inline error rather than a silent clamp — a value that is too
 * large is refused with a message, never quietly reduced to the maximum.
 */
import { useEffect, useState } from 'react';
import {
  GENERATION_MAX_PER_REQUEST,
  GENERATION_PRESETS,
  clampGenerationCount,
} from '../lib/limits';

interface CountControlProps {
  /** Accessible group name, e.g. "How many bios". */
  label: string;
  value: number;
  onChange: (value: number) => void;
  /** Preset values shown as shortcuts. Defaults to the shared ladder. */
  presets?: readonly number[];
  /** Noun used in the hint, e.g. "bios", "captions". */
  noun: string;
}

export default function CountControl({
  label,
  value,
  onChange,
  presets = GENERATION_PRESETS,
  noun,
}: CountControlProps) {
  const [draft, setDraft] = useState(String(value));
  const [error, setError] = useState<string | null>(null);

  // Keep the field in step when a preset or a reset changes the value elsewhere.
  useEffect(() => {
    setDraft(String(value));
    setError(null);
  }, [value]);

  const commit = (raw: string) => {
    setDraft(raw);
    if (raw.trim() === '') {
      setError(null);
      return;
    }
    const parsed = Number(raw);
    if (!Number.isSafeInteger(parsed) || parsed < 1) {
      setError(`Enter a whole number of ${noun}, 1 or more.`);
      return;
    }
    if (parsed > GENERATION_MAX_PER_REQUEST) {
      // Refuse, do not clamp: silently returning fewer results than asked for is
      // the behaviour this policy exists to remove.
      setError(`Up to ${GENERATION_MAX_PER_REQUEST} ${noun} per run. Generate again for more.`);
      return;
    }
    setError(null);
    onChange(parsed);
  };

  const id = `count-${noun.replace(/\s+/g, '-')}`;

  return (
    <div className="option-group count-control" role="group" aria-label={label}>
      <span className="option-label">How many</span>
      <div className="count-control-row">
        <div className="segmented" role="group" aria-label={`${label} presets`}>
          {presets.map((preset) => (
            <button
              key={preset}
              type="button"
              className={`segmented-option${value === preset ? ' is-active' : ''}`}
              aria-pressed={value === preset}
              onClick={() => onChange(clampGenerationCount(preset))}
            >
              {preset}
            </button>
          ))}
        </div>
        <div className="field count-control-field">
          <label htmlFor={id} className="sr-only">
            {label}
          </label>
          <input
            id={id}
            type="number"
            inputMode="numeric"
            min={1}
            max={GENERATION_MAX_PER_REQUEST}
            step={1}
            value={draft}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : `${id}-hint`}
            onChange={(event) => commit(event.target.value)}
          />
        </div>
      </div>
      {error ? (
        <p className="field-error" role="alert" id={`${id}-error`}>
          {error}
        </p>
      ) : (
        <p className="panel-note" id={`${id}-hint`}>
          Presets are a shortcut. Type any number up to {GENERATION_MAX_PER_REQUEST} {noun} per run —
          there is no cap on how many runs or how much you keep.
        </p>
      )}
    </div>
  );
}
