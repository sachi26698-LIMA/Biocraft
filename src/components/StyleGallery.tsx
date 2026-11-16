import { useState } from 'react';
import CopyButton from './CopyButton';
import DownloadButton from './DownloadButton';

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
  const [edits, setEdits] = useState<Record<string, { source: string; value: string }>>({});
  const valueFor = (item: StyleGalleryItem) => {
    const edit = edits[item.id];
    return edit?.source === item.text ? edit.value : item.text;
  };
  const editedCopyAllText = items.map((item) => `${item.label}: ${valueFor(item)}`).join('\n');

  return (
    <div className="style-gallery-wrap">
      {copyAllText && items.length > 0 && (
        <div className="style-gallery-actions">
          <CopyButton
            text={editedCopyAllText}
            ariaLabel={copyAllAriaLabel ?? 'Copy all styles to clipboard'}
          />
          <DownloadButton text={editedCopyAllText} filename="biocraft-styles.txt" />
        </div>
      )}
      <ul className="style-gallery">
      {items.map((item) => {
        const value = valueFor(item);
        return (
        <li key={item.id} className="style-row">
          <span className="style-row-label">{item.label}</span>
          <span className="style-row-text">
            {item.demo && (
              <span className="style-row-text--demo" aria-hidden="true">{item.demo}</span>
            )}
            <textarea
              className="style-row-editable"
              aria-label={`Edit ${item.label} style`}
              rows={2}
              maxLength={2200}
              value={value}
              onChange={(event) => setEdits((current) => ({
                ...current,
                [item.id]: { source: item.text, value: event.target.value },
              }))}
            />
            <span className="style-row-text-live sr-only">{value}</span>
          </span>
          <CopyButton text={value} ariaLabel={copyLabel(item.label)} />
        </li>
        );
      })}
    </ul>
    </div>
  );
}
