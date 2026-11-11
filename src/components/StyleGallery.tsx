import CopyButton from './CopyButton';

export interface StyleGalleryItem {
  id: string;
  label: string;
  text: string;
  /** Optional large preview line (e.g. a sample word rendered in this style). */
  demo?: string;
}

interface StyleGalleryProps {
  items: StyleGalleryItem[];
  /** e.g. "Copy Bold style" — composed per row. */
  copyLabel: (label: string) => string;
  /** When provided, renders a Copy-all button above the grid. */
  copyAllText?: string;
  copyAllAriaLabel?: string;
}

/**
 * Gallery of styled-text variants, each with its own copy button.
 * Rows with a `demo` render it large above the live output so the
 * style is recognisable at a glance.
 * Shared by the Stylish Name and Fancy Font tools.
 */
export default function StyleGallery({ items, copyLabel, copyAllText, copyAllAriaLabel }: StyleGalleryProps) {
  return (
    <div className="style-gallery-wrap">
      {copyAllText && items.length > 0 && (
        <div className="style-gallery-actions">
          <CopyButton
            text={copyAllText}
            ariaLabel={copyAllAriaLabel ?? 'Copy all styles to clipboard'}
          />
        </div>
      )}
      <ul className="style-gallery">
      {items.map((item) => (
        <li key={item.id} className="style-row">
          <span className="style-row-label">{item.label}</span>
          <span className="style-row-text">
            {item.demo && (
              <span className="style-row-text--demo" aria-hidden="true">{item.demo}</span>
            )}
            <span className="style-row-text-live">{item.text}</span>
          </span>
          <CopyButton text={item.text} ariaLabel={copyLabel(item.label)} />
        </li>
      ))}
    </ul>
    </div>
  );
}
