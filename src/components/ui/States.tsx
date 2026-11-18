import type { ReactNode } from 'react';

/**
 * Unified empty / error / success states for tools and pages.
 * Every tool uses these so loading, empty, error and success look and
 * behave identically across the site.
 */

export function EmptyState({
  title,
  text,
  action,
}: {
  title: string;
  text: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty-state" role="status">
      <p className="empty-state-title">{title}</p>
      <p className="empty-state-text">{text}</p>
      {action && <div className="empty-state-action">{action}</div>}
    </div>
  );
}

export function ErrorState({
  title = 'Something went wrong',
  text,
  onRetry,
  retryLabel = 'Try again',
}: {
  title?: string;
  text: string;
  onRetry?: () => void;
  retryLabel?: string;
}) {
  return (
    <div className="error-state" role="alert">
      <p className="error-state-title">{title}</p>
      <p className="error-state-text">{text}</p>
      {onRetry && (
        <button type="button" className="btn btn-secondary btn-small" onClick={onRetry}>
          {retryLabel}
        </button>
      )}
    </div>
  );
}

export function SuccessNote({ text }: { text: string }) {
  return (
    <p className="success-note" role="status">
      {text}
    </p>
  );
}
