import { BIO_LIMIT } from '../lib/text';

interface CharCounterProps {
  count: number;
  /** Defaults to Instagram's bio limit of 150. */
  limit?: number;
  /** Accessible name for the progress element. */
  ariaLabel?: string;
}

/**
 * Live character counter: "count/limit" plus a thin progress bar.
 * Turns the error colour if the count ever exceeds the limit.
 */
export default function CharCounter({
  count,
  limit = BIO_LIMIT,
  ariaLabel = `Text length against the ${limit}-character limit`,
}: CharCounterProps) {
  const overLimit = count > limit;
  const percent = Math.min(100, Math.round((count / limit) * 100));

  return (
    <span className={`char-counter${overLimit ? ' is-over' : ''}`}>
      <span className="char-count">
        {count}/{limit}
      </span>
      <span
        className="char-bar"
        role="progressbar"
        aria-label={ariaLabel}
        aria-valuemin={0}
        aria-valuemax={limit}
        aria-valuenow={Math.min(count, limit)}
        aria-valuetext={`${count} of ${limit} characters`}
      >
        <span className="char-bar-fill" style={{ width: `${percent}%` }} />
      </span>
    </span>
  );
}
