import type { ReactNode } from 'react';
import { Icon, type IconName } from '../icons';
import type { LiveState } from '../live/useLive';

export type BadgeTone = 'neutral' | 'purple' | 'green' | 'amber' | 'red' | 'blue' | 'cyan';
export type StatTint = 'lavender' | 'sky' | 'amber' | 'violet' | 'cyan' | 'mint' | 'rose';

export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: BadgeTone }) {
  return <span className={`ad-badge ad-badge--${tone}`}>{children}</span>;
}

export function Panel({
  title,
  description,
  icon,
  aside,
  children,
  className = '',
}: {
  title: string;
  description?: string;
  icon?: IconName;
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`ad-panel ${className}`}>
      <div className="ad-panel-head">
        <div className="ad-panel-title-wrap">
          {icon && (
            <span className="ad-panel-icon" aria-hidden="true">
              <Icon name={icon} size={17} />
            </span>
          )}
          <div>
            <h2>{title}</h2>
            {description && <p>{description}</p>}
          </div>
        </div>
        {aside && <div className="ad-panel-aside">{aside}</div>}
      </div>
      {children}
    </section>
  );
}

export function PageHead({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <header className="ad-page-head">
      <div className="ad-page-head-copy">
        <span className="ad-eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {actions && <div className="ad-page-head-actions">{actions}</div>}
    </header>
  );
}

export function StatCard({
  icon,
  label,
  value,
  trend,
  trendTone = 'neutral',
  caption,
  tint = 'lavender',
  onClick,
}: {
  icon?: IconName;
  label: string;
  value: string | number;
  trend?: string;
  trendTone?: 'positive' | 'neutral' | 'purple' | 'amber' | 'green' | 'blue';
  caption?: string;
  tint?: StatTint;
  onClick?: () => void;
}) {
  const inner = (
    <>
      <div className="ad-stat-top">
        <span className="ad-stat-label">{label}</span>
        {icon && (
          <span className={`ad-stat-icon ad-tint--${tint}`} aria-hidden="true">
            <Icon name={icon} size={18} />
          </span>
        )}
      </div>
      <div className="ad-stat-val-row">
        <strong className="ad-stat-value">{value}</strong>
        {trend && <span className={`ad-badge ad-badge--${trendTone === 'positive' ? 'green' : trendTone}`}>{trend}</span>}
      </div>
      {caption && <small className="ad-stat-caption">{caption}</small>}
    </>
  );
  if (onClick) {
    return (
      <button type="button" className="ad-stat ad-stat--interactive" onClick={onClick}>
        {inner}
      </button>
    );
  }
  return <div className="ad-stat">{inner}</div>;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: { value: T; label: string; count?: number }[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
}) {
  return (
    <div className="ad-segmented" role="tablist" aria-label={ariaLabel}>
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          role="tab"
          aria-selected={value === opt.value}
          className={`ad-segmented-btn ${value === opt.value ? 'is-active' : ''}`}
          onClick={() => onChange(opt.value)}
        >
          <span>{opt.label}</span>
          {opt.count !== undefined && <span className="ad-segmented-count">{opt.count}</span>}
        </button>
      ))}
    </div>
  );
}

export function Pagination({
  page,
  pages,
  total,
  setPage,
}: {
  page: number;
  pages: number;
  total: number;
  setPage: (n: number) => void;
}) {
  const nums: (number | 'ellipsis')[] = [];
  if (pages <= 6) {
    for (let i = 1; i <= pages; i++) nums.push(i);
  } else {
    nums.push(1);
    if (page > 3) nums.push('ellipsis');
    for (let i = Math.max(2, page - 1); i <= Math.min(pages - 1, page + 1); i++) nums.push(i);
    if (page < pages - 2) nums.push('ellipsis');
    nums.push(pages);
  }

  return (
    <div className="ad-pagination">
      <span className="ad-pagination-meta">
        {total === 0 ? 'No results' : `Page ${page} of ${pages} · ${total.toLocaleString()} results`}
      </span>
      <div className="ad-pagination-controls">
        <button type="button" disabled={page <= 1} onClick={() => setPage(page - 1)}>
          Previous
        </button>
        <div className="ad-pagination-pages" aria-label="Pages">
          {nums.map((n, idx) =>
            n === 'ellipsis' ? (
              <span key={`e-${idx}`} className="ad-pagination-dots" aria-hidden="true">
                …
              </span>
            ) : (
              <button
                key={n}
                type="button"
                aria-current={n === page ? 'page' : undefined}
                className={n === page ? 'is-current' : ''}
                onClick={() => setPage(n)}
              >
                {n}
              </button>
            ),
          )}
        </div>
        <button type="button" disabled={page >= pages} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}

export function BulkActionBar({
  count,
  onClear,
  children,
}: {
  count: number;
  onClear: () => void;
  children: ReactNode;
}) {
  if (count === 0) return null;
  return (
    <div className="ad-bulk-bar" role="region" aria-label="Bulk actions">
      <div className="ad-bulk-count">
        <span className="ad-bulk-pill">{count}</span>
        <span>selected</span>
      </div>
      <div className="ad-bulk-actions">
        {children}
        <button type="button" className="ad-btn ad-btn--ghost ad-btn--sm" onClick={onClear}>
          Clear
        </button>
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="ad-skeleton-table" role="status" aria-live="polite" aria-label="Loading records">
      <span className="ad-sr">Loading from the Admin database…</span>
      {Array.from({ length: rows }, (_, i) => (
        <div className="ad-skeleton-row" key={i}>
          <span className="ad-skel" style={{ width: '34%' }} />
          <span className="ad-skel" style={{ width: '18%' }} />
          <span className="ad-skel" style={{ width: '16%' }} />
          <span className="ad-skel" style={{ width: '14%' }} />
        </div>
      ))}
    </div>
  );
}

export function SkeletonStats({ count = 4 }: { count?: number }) {
  return (
    <div className="ad-stats-grid" role="status" aria-live="polite" aria-label="Loading metrics">
      <span className="ad-sr">Loading metrics…</span>
      {Array.from({ length: count }, (_, i) => (
        <div className="ad-stat ad-stat--skel" key={i}>
          <span className="ad-skel ad-skel--sq" />
          <span className="ad-skel" style={{ width: '52%', height: 26, marginTop: 12 }} />
          <span className="ad-skel" style={{ width: '74%', height: 12, marginTop: 8 }} />
        </div>
      ))}
    </div>
  );
}

export function Loading({ label }: { label: string }) {
  return (
    <div className="ad-live-state" role="status" aria-live="polite">
      <span className="ad-spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

export function StateNotice({
  state,
  error,
  reload,
}: {
  state: LiveState;
  error?: string | null;
  reload?: () => void;
}) {
  if (state === 'idle' || state === 'loading') return <SkeletonTable rows={4} />;
  if (state === 'ready') return null;
  const denied = state === 'denied';
  return (
    <div className={`ad-live-state ${denied ? 'is-denied' : 'is-error'}`} role="alert">
      <span className={`ad-state-icon ${denied ? 'is-denied' : 'is-error'}`} aria-hidden="true">
        <Icon name={denied ? 'lock' : 'alert'} size={18} />
      </span>
      <div>
        <strong>{denied ? 'Not permitted for this account' : 'This module could not load'}</strong>
        <p>
          {denied
            ? 'Your roles do not include access to this data. Nothing was requested from the database beyond the permission check.'
            : error ?? 'The request failed.'}
        </p>
      </div>
      {reload && (
        <button type="button" className="ad-btn ad-btn--secondary ad-btn--sm" onClick={reload}>
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({
  title,
  text,
  icon = 'layers',
  action,
}: {
  title: string;
  text: string;
  icon?: IconName;
  action?: ReactNode;
}) {
  return (
    <div className="ad-empty-state" role="status">
      <span className="ad-empty-icon" aria-hidden="true">
        <Icon name={icon} size={22} />
      </span>
      <strong>{title}</strong>
      <p>{text}</p>
      {action && <div className="ad-empty-action">{action}</div>}
    </div>
  );
}

export function MessageBox({ message, failure }: { message?: string | null; failure?: string | null }) {
  if (!message && !failure) return null;
  return failure ? (
    <div className="ad-inline-alert ad-inline-alert--error" role="alert">
      <Icon name="alert" size={16} />
      <span>{failure}</span>
    </div>
  ) : (
    <div className="ad-inline-alert ad-inline-alert--success" role="status">
      <Icon name="checkCircle" size={16} />
      <span>{message}</span>
    </div>
  );
}

export function Toolbar({ children }: { children: ReactNode }) {
  return <div className="ad-toolbar">{children}</div>;
}

export function SearchField({
  value,
  onChange,
  placeholder,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label?: string;
}) {
  return (
    <label className="ad-search">
      <Icon name="search" size={16} />
      <span className="ad-sr">{label ?? placeholder}</span>
      <input
        type="search"
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

export function SelectField({
  value,
  onChange,
  label,
  children,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="ad-select-label">
      <span className="ad-sr">{label}</span>
      <select value={value} onChange={event => onChange(event.target.value)} aria-label={label}>
        {children}
      </select>
    </label>
  );
}

export function CursorPager({
  count,
  hasNext,
  loading,
  onNext,
  onReset,
}: {
  count: number;
  hasNext: boolean;
  loading: boolean;
  onNext: () => void;
  onReset: () => void;
}) {
  return (
    <div className="ad-pagination">
      <span className="ad-pagination-meta">
        {count === 0 ? 'No results' : `${count} loaded${hasNext ? ', more available' : ' — all results shown'}`}
      </span>
      <div className="ad-pagination-controls">
        <button type="button" onClick={onReset} disabled={loading}>
          Back to first page
        </button>
        <button type="button" onClick={onNext} disabled={loading || !hasNext}>
          {loading ? 'Loading…' : 'Next page'}
        </button>
      </div>
    </div>
  );
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="ad-field">
      <span>{label}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}
