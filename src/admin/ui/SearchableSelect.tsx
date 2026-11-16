import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Icon } from '../icons';

export interface SelectOption {
  value: string;
  label: string;
  sublabel?: string;
}

/** Accessible searchable dropdown combobox in Apple light glass styling. */
export function SearchableSelect({
  options,
  value,
  onChange,
  label,
  placeholder = 'Select an option…',
  searchPlaceholder = 'Filter options…',
  disabled = false,
}: {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  const selected = options.find(o => o.value === value);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      o => o.label.toLowerCase().includes(q) || (o.sublabel ?? '').toLowerCase().includes(q) || o.value.toLowerCase().includes(q),
    );
  }, [options, query]);

  useEffect(() => {
    if (!open) return;
    setActiveIdx(0);
    window.setTimeout(() => inputRef.current?.focus(), 0);
    const onOutside = (event: MouseEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onOutside);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onOutside);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  function commit(opt: SelectOption) {
    onChange(opt.value);
    setOpen(false);
    setQuery('');
  }

  return (
    <div className="ad-sselect" ref={wrapRef}>
      <button
        type="button"
        className={`ad-sselect-trigger ${open ? 'is-open' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={label}
        disabled={disabled}
        onClick={() => setOpen(v => !v)}
      >
        <span className={selected ? '' : 'ad-sselect-placeholder'}>{selected ? selected.label : placeholder}</span>
        <Icon name="chevronDown" size={15} />
      </button>

      {open && (
        <div className="ad-sselect-pop" role="presentation">
          <div className="ad-sselect-search">
            <Icon name="search" size={14} />
            <input
              ref={inputRef}
              type="search"
              value={query}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              onChange={e => {
                setQuery(e.target.value);
                setActiveIdx(0);
              }}
              onKeyDown={e => {
                if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  setActiveIdx(i => Math.min(filtered.length - 1, i + 1));
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  setActiveIdx(i => Math.max(0, i - 1));
                } else if (e.key === 'Enter' && filtered[activeIdx]) {
                  e.preventDefault();
                  commit(filtered[activeIdx]);
                }
              }}
            />
          </div>
          <ul id={listId} role="listbox" aria-label={label} className="ad-sselect-list">
            {filtered.length === 0 ? (
              <li className="ad-sselect-empty">No matching options</li>
            ) : (
              filtered.map((opt, idx) => (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={opt.value === value}
                  className={`ad-sselect-item ${opt.value === value ? 'is-selected' : ''} ${idx === activeIdx ? 'is-highlighted' : ''}`}
                  onMouseEnter={() => setActiveIdx(idx)}
                  onClick={() => commit(opt)}
                >
                  <div>
                    <strong>{opt.label}</strong>
                    {opt.sublabel && <small>{opt.sublabel}</small>}
                  </div>
                  {opt.value === value && <Icon name="check" size={14} />}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
