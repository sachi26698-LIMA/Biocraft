import { useEffect, useId, useRef, useState } from 'react';

/**
 * Accessible dropdown menu for secondary / overflow actions.
 *
 *  - Button with `aria-haspopup="menu"`, `aria-expanded`, `aria-controls`.
 *  - Menu with `role="menu"`; items are `role="menuitem"` buttons.
 *  - Keyboard: Enter/Space opens, ↑/↓ moves, Home/End jumps, Escape closes
 *    and returns focus, Tab closes. Type-ahead on first letter.
 *  - Closes on outside click. Mobile-safe: menu never overflows viewport
 *    (right-aligned, max-width 100vw - 2rem).
 */
export interface DropdownItem {
  id: string;
  label: string;
  onSelect: () => void;
  disabled?: boolean;
}

export default function Dropdown({
  label,
  items,
  className = '',
  align = 'end',
}: {
  /** Visible button text, e.g. "More options". */
  label: string;
  items: DropdownItem[];
  className?: string;
  align?: 'start' | 'end';
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const base = useId().replace(/[^a-zA-Z0-9]/g, '');
  const menuId = `dd-menu-${base}`;

  const close = (returnFocus = true) => {
    setOpen(false);
    setActiveIndex(-1);
    if (returnFocus) buttonRef.current?.focus();
  };

  // Outside click closes (without stealing focus).
  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (event: PointerEvent) => {
      const target = event.target as Node;
      if (menuRef.current?.contains(target) || buttonRef.current?.contains(target)) return;
      setOpen(false);
      setActiveIndex(-1);
    };
    document.addEventListener('pointerdown', onPointer);
    return () => document.removeEventListener('pointerdown', onPointer);
  }, [open]);

  const enabledIndexes = items
    .map((item, i) => (item.disabled ? -1 : i))
    .filter((i) => i >= 0);

  const move = (delta: number) => {
    if (enabledIndexes.length === 0) return;
    setActiveIndex((current) => {
      const pos = enabledIndexes.indexOf(current);
      const nextPos =
        pos === -1
          ? delta > 0
            ? 0
            : enabledIndexes.length - 1
          : (pos + delta + enabledIndexes.length) % enabledIndexes.length;
      return enabledIndexes[nextPos];
    });
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (!open) {
      if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setOpen(true);
        setActiveIndex(enabledIndexes[0] ?? -1);
      }
      return;
    }
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        close();
        break;
      case 'ArrowDown':
        event.preventDefault();
        move(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        move(-1);
        break;
      case 'Home':
        event.preventDefault();
        setActiveIndex(enabledIndexes[0] ?? -1);
        break;
      case 'End':
        event.preventDefault();
        setActiveIndex(enabledIndexes[enabledIndexes.length - 1] ?? -1);
        break;
      case 'Tab':
        setOpen(false);
        setActiveIndex(-1);
        break;
      default:
        // Type-ahead: jump to first enabled item starting with the letter.
        if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
          const letter = event.key.toLowerCase();
          const found = enabledIndexes.find((i) =>
            items[i].label.toLowerCase().startsWith(letter),
          );
          if (found !== undefined) setActiveIndex(found);
        }
    }
  };

  // Keep the active item focused for screen readers / visible focus.
  useEffect(() => {
    if (!open || activeIndex < 0) return;
    const el = menuRef.current?.querySelector<HTMLElement>(
      `[data-dd-index="${activeIndex}"]`,
    );
    el?.focus();
  }, [open, activeIndex]);

  return (
    <span className={`dropdown ${className}`} onKeyDown={onKeyDown}>
      <button
        ref={buttonRef}
        type="button"
        className="btn btn-secondary btn-small dropdown-toggle"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => {
          setOpen((v) => !v);
          setActiveIndex(-1);
        }}
      >
        {label}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
          <path d="M6.5 9.5 12 15l5.5-5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <span
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-label={label}
          className={`dropdown-menu dropdown-menu--${align}`}
        >
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              role="menuitem"
              data-dd-index={i}
              tabIndex={i === activeIndex ? 0 : -1}
              disabled={item.disabled}
              className="dropdown-item"
              onClick={() => {
                setOpen(false);
                setActiveIndex(-1);
                item.onSelect();
                buttonRef.current?.focus();
              }}
            >
              {item.label}
            </button>
          ))}
        </span>
      )}
    </span>
  );
}
