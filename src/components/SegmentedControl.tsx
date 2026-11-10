interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  /** Optional BCP-47 tag for the option's content language (e.g. "hi"). */
  lang?: string;
}

interface SegmentedControlProps<T extends string> {
  /** Accessible name for the group, e.g. "Bio language". */
  label: string;
  /** Visible (small-caps) group label. */
  visibleLabel: string;
  options: readonly SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

/**
 * Shared segmented control used across tools (e.g. English / हिन्दी).
 * Implements the same pressed-button group pattern as the bio tool's
 * language switch: role="group" + aria-pressed buttons.
 */
export default function SegmentedControl<T extends string>({
  label,
  visibleLabel,
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <div className="option-group" role="group" aria-label={label}>
      <span className="option-label">{visibleLabel}</span>
      <div className="segmented">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            lang={option.lang}
            className={`segmented-option${option.value === value ? ' is-active' : ''}`}
            aria-pressed={option.value === value}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
