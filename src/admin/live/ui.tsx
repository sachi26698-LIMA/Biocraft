/**
 * Shared presentational pieces for the live Admin modules.
 *
 * These are deliberately small and boring: one way to show a loading state, one
 * way to show a permission decision, one way to page a list. Every module uses
 * them so that "no data", "not permitted" and "still loading" can never look the
 * same on screen — the failure that matters most in an admin tool is a screen
 * that quietly implies success.
 */
import type { ReactNode } from 'react';
import type { LiveState } from './useLive';

export function Loading({ label }: { label: string }) {
  return (
    <div className="ad-live-state" role="status" aria-live="polite">
      <span className="ad-spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

export function StateNotice({ state, error, reload }: { state: LiveState; error?: string | null; reload?: () => void }) {
  if (state === 'idle' || state === 'loading') return <Loading label="Loading from the Admin database…" />;
  if (state === 'ready') return null;
  const denied = state === 'denied';
  return (
    <div className={`ad-live-state ${denied ? 'is-denied' : 'is-error'}`} role="alert">
      <div>
        <strong>{denied ? 'Not permitted for this account' : 'This module could not load'}</strong>
        <p>{denied ? 'Your roles do not include access to this data. Nothing was requested from the database beyond the permission check.' : error ?? 'The request failed.'}</p>
      </div>
      {reload && <button type="button" onClick={reload}>Try again</button>}
    </div>
  );
}

export function EmptyState({ title, text }: { title: string; text: string }) {
  return <div className="ad-live-state is-empty" role="status"><div><strong>{title}</strong><p>{text}</p></div></div>;
}

export function MessageBox({ message, failure }: { message?: string | null; failure?: string | null }) {
  if (!message && !failure) return null;
  return failure
    ? <p className="ad-auth-error" role="alert">{failure}</p>
    : <p className="ad-muted-copy" role="status">{message}</p>;
}

export function Toolbar({ children }: { children: ReactNode }) {
  return <div className="ad-toolbar">{children}</div>;
}

export function SearchField({ value, onChange, placeholder, label }: { value: string; onChange: (value: string) => void; placeholder: string; label?: string }) {
  return (
    <label className="ad-search">
      <span className="ad-sr">{label ?? placeholder}</span>
      <input type="search" value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} />
    </label>
  );
}

export function SelectField({ value, onChange, label, children }: { value: string; onChange: (value: string) => void; label: string; children: ReactNode }) {
  return (
    <label className="ad-select-label">
      <span className="ad-sr">{label}</span>
      <select value={value} onChange={event => onChange(event.target.value)} aria-label={label}>{children}</select>
    </label>
  );
}

/** Cursor paging that matches the server's contract: an opaque cursor for the
 * next page only. There is no "jump to page 40", because the server offers keyset
 * paging, not offsets — pretending otherwise would produce wrong pages. */
export function CursorPager({ count, hasNext, loading, onNext, onReset }: { count: number; hasNext: boolean; loading: boolean; onNext: () => void; onReset: () => void }) {
  return (
    <div className="ad-pagination">
      <span>{count === 0 ? 'No results' : `${count} loaded${hasNext ? ', more available' : ' — all results shown'}`}</span>
      <div>
        <button type="button" onClick={onReset} disabled={loading}>Back to first page</button>
        <button type="button" onClick={onNext} disabled={loading || !hasNext}>{loading ? 'Loading…' : 'Next page'}</button>
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
