/**
 * Small shared presentational parts used by every Admin module.
 *
 * They were previously defined inside AdminApp.tsx, which meant a live module
 * could not use them without importing the whole app shell (and its lazy routes)
 * into its own chunk. Moving them here keeps each module self-contained.
 */
import type { ReactNode } from 'react';

export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'purple' | 'green' | 'amber' | 'red' }) {
  return <span className={`ad-badge ad-badge--${tone}`}>{children}</span>;
}

export function Panel({ title, description, aside, children, className = '' }: { title: string; description?: string; aside?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`ad-panel ${className}`}>
      <div className="ad-panel-head">
        <div><h2>{title}</h2>{description && <p>{description}</p>}</div>
        {aside}
      </div>
      {children}
    </section>
  );
}

export function Stat({ label, value, caption }: { label: string; value: string | number; caption: string }) {
  return (
    <div className="ad-stat">
      <div className="ad-stat-top"><span>{label}</span></div>
      <strong>{value}</strong>
      <small>{caption}</small>
    </div>
  );
}
