import { bioLength } from '../../lib/text';
import CharCounter from '../../components/CharCounter';
import CopyButton from '../../components/CopyButton';
import { RefreshIcon } from '../../components/icons';

interface BioCardProps {
  bio: string;
  index: number;
  /** Card label prefix, e.g. "Bio" (default), "Caption", "Headline", "Summary". */
  label?: string;
  /** Counter limit shown next to the count (defaults to Instagram's 150). */
  limit?: number;
  /** Accessible description of the limit, e.g. "Instagram's 150-character limit". */
  limitDescription?: string;
  /** Optional per-card regenerate — replaces just this result. */
  onRegenerate?: () => void;
  regenerateDisabled?: boolean;
}

export default function BioCard({
  bio,
  index,
  label = 'Bio',
  limit = 150,
  limitDescription = "Instagram's 150-character limit",
  onRegenerate,
  regenerateDisabled = false,
}: BioCardProps) {
  const count = bioLength(bio);

  return (
    <article className="bio-card" aria-label={`${label} option ${index + 1}`}>
      <div className="bio-card-top">
        <span className="bio-index">
          {label} {index + 1}
        </span>
        <CharCounter count={count} limit={limit} ariaLabel={`${label} length against ${limitDescription}`} />
      </div>

      <p className="bio-text">{bio}</p>

      <div className="bio-card-actions">
        <CopyButton text={bio} ariaLabel={`Copy ${label.toLowerCase()} option ${index + 1} to clipboard`} />
        {onRegenerate && (
          <button
            type="button"
            className="bio-icon-button bio-regenerate"
            onClick={onRegenerate}
            disabled={regenerateDisabled}
            aria-label={`Regenerate ${label.toLowerCase()} option ${index + 1} with a fresh variation`}
            title="Fresh variation"
          >
            <RefreshIcon size={16} />
          </button>
        )}
      </div>
    </article>
  );
}
