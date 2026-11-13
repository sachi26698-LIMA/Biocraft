/**
 * Overview — the first screen an administrator sees.
 *
 * It answers three questions with real data: what is in the database now, what
 * the Admin workflow currently holds, and what this account is allowed to do.
 * When the backend is absent or the session is not authorised it says exactly
 * that, and never falls back to the bundled app inventory shown by the static
 * preview: a number that comes from the build is not a number that comes from the
 * database, and confusing the two is how an admin console loses trust.
 */
import { useMemo } from 'react';
import LiveModules from '../LiveModules';
import { formatDate, formatNumber, useLive, useSession } from './useLive';
import { Panel, Stat, StateNotice } from './common';

type Metric = { metric: string; value: number };

const METRICS: Record<string, { label: string; group: 'content' | 'workflow' | 'security'; caption: string }> = {
  'bios.active': { label: 'Active bios', group: 'content', caption: 'Publicly visible rows' },
  'bios.archived': { label: 'Archived bios', group: 'content', caption: 'Hidden from guests' },
  'categories.total': { label: 'Categories', group: 'content', caption: 'Public categories' },
  'platforms.total': { label: 'Platforms', group: 'content', caption: 'Supported platforms' },
  'generators.total': { label: 'Generators', group: 'content', caption: 'Generator records' },
  'seo_pages.total': { label: 'SEO pages', group: 'content', caption: 'Indexable page metadata' },
  'admin.drafts.in_review': { label: 'Drafts in review', group: 'workflow', caption: 'Waiting on a reviewer' },
  'admin.drafts.approved': { label: 'Approved drafts', group: 'workflow', caption: 'Cleared for publication' },
  'admin.audit.last_24h': { label: 'Audit events (24 h)', group: 'security', caption: 'Every privileged action' },
  'admin.sessions.active': { label: 'Active sessions', group: 'security', caption: 'Live Admin sessions' },
};

export default function Overview() {
  const metrics = useLive<{ metrics: Metric[] }>('/analytics');
  const session = useSession();

  const values = useMemo(() => {
    const map = new Map<string, number>();
    for (const metric of metrics.data?.metrics ?? []) map.set(metric.metric, Number(metric.value));
    return map;
  }, [metrics.data]);

  const content = Object.entries(METRICS).filter(([, meta]) => meta.group === 'content');
  const workflow = Object.entries(METRICS).filter(([, meta]) => meta.group === 'workflow');
  const security = Object.entries(METRICS).filter(([, meta]) => meta.group === 'security');

  return (
    <>
      <header className="ad-page-head">
        <span className="ad-eyebrow">YOUR WORKSPACE</span>
        <h1>Overview</h1>
        <p>Live counts from the Admin database, the state of the review workflow, and what this account may do.</p>
      </header>

      <section className="ad-panel">
        <div className="ad-panel-head">
          <div><h2>Content in the database</h2><p>Counted from <code>public.*</code> under this session&rsquo;s permissions</p></div>
          {metrics.state === 'ready' && <span className="ad-badge ad-badge--green">Live</span>}
        </div>
        {metrics.state === 'ready'
          ? <div className="ad-stats">{content.map(([key, meta]) => (
              <Stat key={key} label={meta.label} value={formatNumber(values.get(key))} caption={meta.caption} />
            ))}</div>
          : <StateNotice state={metrics.state} error={metrics.error} reload={metrics.reload} />}
      </section>

      {metrics.state === 'ready' && (
        <div className="ad-grid">
          <Panel title="Review workflow" description="Drafts are the only editable copy; publishing is a separate, reviewed step">
            <div className="ad-stats ad-stats--tight">{workflow.map(([key, meta]) => (
              <Stat key={key} label={meta.label} value={formatNumber(values.get(key))} caption={meta.caption} />
            ))}</div>
          </Panel>
          <Panel title="Security activity" description="Append-only audit trail and live sessions">
            <div className="ad-stats ad-stats--tight">{security.map(([key, meta]) => (
              <Stat key={key} label={meta.label} value={formatNumber(values.get(key))} caption={meta.caption} />
            ))}</div>
          </Panel>
        </div>
      )}

      <Panel title="This account" description="Roles and permissions as reported by the authenticated session">
        {session.state !== 'ready' || !session.data
          ? <StateNotice state={session.state} error={session.error} reload={session.reload} />
          : (
          <div className="ad-session-facts">
            <div><small>Administrator</small><code>{session.data.userId}</code></div>
            <div><small>Roles</small><span className="ad-chip-row">{session.data.roles.length === 0 ? <em>none</em> : session.data.roles.map(role => <span className="ad-chip" key={role}>{role.replace(/_/g, ' ')}</span>)}</span></div>
            <div><small>Authenticator</small><span className="ad-badge ad-badge--green">Second factor verified</span></div>
            <div><small>Session expires</small><span>{formatDate(session.data.expiresAt)}</span></div>
            <div><small>Permissions</small><span>{session.data.permissions.length} granted</span></div>
          </div>
        )}
      </Panel>

      <LiveModules />
    </>
  );
}
