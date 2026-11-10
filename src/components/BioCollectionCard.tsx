import { copyText } from '../lib/clipboard';
import { toast } from '../lib/toast';
import CopyButton from './CopyButton';
import { ShareIcon, RefreshIcon } from './icons';
import type { BioEntry, BioDesignKey } from '../lib/bioCollections';
import { designLabel } from '../lib/bioCollections';

const HAS_EMOJI = /\p{Extended_Pictographic}/u;
const DEVANAGARI = /[\u0900-\u097F]/;

/** Two badges on every card: language + style. */
function BioBadges({ bio, design }: { bio: BioEntry; design: BioDesignKey }) {
  const language =
    bio.lang === 'hi' ? 'हिंदी' : bio.lang === 'hg' ? 'Hinglish' : DEVANAGARI.test(bio.text) ? 'हिंदी' : 'English';
  const style = bio.style ? 'Styled Unicode' : designLabel(design);
  return (
    <span className="bio-card-tags" aria-hidden="true">
      <span className="bio-badge bio-badge-lang">{language}</span>
      <span className="bio-badge bio-badge-style">{style}</span>
      {HAS_EMOJI.test(bio.text) && <span className="bio-badge bio-badge-emoji">Emoji</span>}
    </span>
  );
}

const shareSupported =
  typeof navigator !== 'undefined' && typeof navigator.share === 'function';

/**
 * Premium glass card for a single ready-made bio — white / light-blue glass
 * with a blue gradient top border, navy text, and one of 14 design styles
 * assigned per collection+index (deterministic). Copy, Share and a per-card
 * “New variation” swap (another bio from the same collection) included.
 */
export default function BioCollectionCard({
  bio,
  label,
  design,
  onRegenerate,
}: {
  bio: BioEntry;
  label: string;
  design: BioDesignKey;
  onRegenerate?: () => void;
}) {
  const onShare = async () => {
    if (!shareSupported) return;
    try {
      await navigator.share({ text: bio.text });
    } catch {
      // User dismissed the sheet, or the channel rejected it — offer copy instead.
      const ok = await copyText(bio.text);
      toast(ok ? 'Bio copied to clipboard' : 'Could not copy — please select the text manually');
    }
  };

  return (
    <li className={`bio-card bio-design bio-design-${design}`}>
      <p className="bio-card-text" lang={DEVANAGARI.test(bio.text) ? 'hi' : undefined}>
        {bio.text}
      </p>
      <div className="bio-card-foot">
        <BioBadges bio={bio} design={design} />
        <span className="bio-card-actions">
          {onRegenerate && (
            <button
              type="button"
              className="bio-icon-button bio-regenerate"
              onClick={onRegenerate}
              aria-label={`Show a similar bio from this collection instead of ${label}`}
              title="New variation"
            >
              <RefreshIcon size={16} />
            </button>
          )}
          {shareSupported && (
            <button type="button" className="bio-icon-button" onClick={() => void onShare()} aria-label={`Share ${label}`}>
              <ShareIcon size={16} />
            </button>
          )}
          <CopyButton text={bio.text} ariaLabel={`Copy ${label} to clipboard`} className="bio-copy" />
        </span>
      </div>
    </li>
  );
}
