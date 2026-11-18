import { useId, useState, type ReactNode } from 'react';

/**
 * Accessible collapsible section (progressive disclosure).
 *
 *  - Button + `aria-expanded` + `aria-controls`, region with `role="region"`.
 *  - Keyboard: Enter/Space toggle (native button), Escape collapses.
 *  - Content unmounts when closed (no hidden-but-focusable controls).
 *  - `defaultOpen` for first-visit discoverability; state is per-instance.
 */
export default function Accordion({
  title,
  description,
  defaultOpen = false,
  children,
  className = '',
  level = 2,
}: {
  title: string;
  description?: string;
  defaultOpen?: boolean;
  children: ReactNode;
  className?: string;
  /** Heading level — 2 by default so the h1 → h2 → h3 order never skips. */
  level?: 2 | 3;
}) {
  const HeadingTag = level === 3 ? 'h3' : 'h2';
  const [open, setOpen] = useState(defaultOpen);
  const base = useId().replace(/[^a-zA-Z0-9]/g, '');
  const buttonId = `acc-btn-${base}`;
  const panelId = `acc-panel-${base}`;

  return (
    <div className={`accordion ${className}`}>
      <HeadingTag className="accordion-head">
        <button
          type="button"
          id={buttonId}
          className="accordion-toggle"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          onKeyDown={(event) => {
            if (event.key === 'Escape' && open) {
              setOpen(false);
              event.currentTarget.focus();
            }
          }}
        >
          <span className="accordion-toggle-text">
            <span className="accordion-title">{title}</span>
            {description && <span className="accordion-desc">{description}</span>}
          </span>
          <span className={`accordion-chevron${open ? ' is-open' : ''}`} aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" focusable="false">
              <path d="M6.5 9.5 12 15l5.5-5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </button>
      </HeadingTag>
      {open && (
        <div
          id={panelId}
          role="region"
          aria-labelledby={buttonId}
          className="accordion-panel"
        >
          {children}
        </div>
      )}
    </div>
  );
}
