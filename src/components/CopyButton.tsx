import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import { CheckIcon, ClipboardIcon } from './icons';

interface CopyButtonProps {
  /** The exact text written to the clipboard. */
  text: string;
  /** Accessible label, e.g. "Copy bio option 1 to clipboard". */
  ariaLabel: string;
  /** Optional visible text; defaults to Copy / Copied / Try again. */
  className?: string;
}

/**
 * One shared copy button with clipboard feedback and an sr-only live region.
 * Used by every tool in the toolkit.
 */
export default function CopyButton({ text, ariaLabel, className }: CopyButtonProps) {
  const { state, copy } = useCopyToClipboard(2000);

  const visible =
    state === 'copied' ? 'Copied' : state === 'failed' ? 'Try again' : 'Copy';

  return (
    <span className={`copy-button-wrap${className ? ` ${className}` : ''}`}>
      <button
        type="button"
        className={`copy-button copy-button-${state}`}
        onClick={() => void copy(text)}
        aria-label={ariaLabel}
      >
        {state === 'copied' ? <CheckIcon size={16} /> : <ClipboardIcon size={16} />}
        <span>{visible}</span>
      </button>
      <span className="sr-only" role="status">
        {state === 'copied'
          ? 'Copied to clipboard.'
          : state === 'failed'
            ? 'Copying failed. Please select the text and copy it manually.'
            : ''}
      </span>
    </span>
  );
}
