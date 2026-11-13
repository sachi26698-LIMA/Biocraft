/**
 * Analytics — what the database can actually count, and nothing else.
 *
 * The counts come from one SQL function that reads the public tables and the
 * Admin workflow tables directly. There is no traffic source, no session
 * recorder and no third-party analytics, so this screen does not invent page
 * views, engagement or "users reached". Saying "not measured" is the honest
 * answer and it is shown as such, rather than as a zero that looks like a
 * measurement of nothing.
 */
import { useMemo } from 'react';
import { Badge, Panel } from '../parts';
import { downloadCsv, formatNumber, useLive } from './useLive';
import { EmptyState, StateNotice } from './ui';
import type { Metric } from './types';

const GROUPS: { key: string; title: string; description: string; metrics: { id: string; label: string; caption: string }[] }[] = [
  {
    key: 'content',
    title: 'Content',
    description: 'Rows in the public tables the site reads, counted as they are now',
    metrics: [
      { id: 'bios.active', label: 'Active bios', caption: 'Visible to guests' },
      { id: 'bios.archived', label: 'Archived bios', caption: 'Hidden from guests' },
      { id: 'categories.total', label: 'Categories', caption: 'All categories' },
      { id: 'platforms.total', label: 'Platforms', caption: 'All platforms' },
      { id: 'generators.total', label: 'Generators', caption: 'All generator records' },
      { id: 'seo_pages.total', label: 'SEO pages', caption: 'Indexable metadata' },
    ],
  },
  {
    key: 'workflow',
    title: 'Editorial workflow',
    description: 'Where work is sitting right now',
    metrics: [
      { id: 'admin.drafts.in_review', label: 'In review', caption: 'Waiting on a reviewer' },
      { id: 'admin.drafts.approved', label: 'Approved', caption: 'Cleared, not yet published' },
    ],
  },
  {
    key: 'security',
    title: 'Security',
    description: 'Administrative activity, from the append-only audit trail',
    metrics: [
      { id: 'admin.audit.last_24h', label: 'Audit events (24 h)', caption: 'Every privileged action' },
      { id: 'admin.sessions.active', label: 'Active sessions', caption: 'Live Admin sessions' },
    ],
  },
];

export default function Analytics() {
  const live = useLive<{ metrics: Metric[] }>('/analytics');

  const values = useMemo(() => {
    const map = new Map<string, number>();
    for (const metric of live.data?.metrics ?? []) map.set(metric.metric, Number(metric.value));
    return map;
  }, [live.data]);

  const rows = useMemo(() => (live.data?.metrics ?? []).map(metric => ({ metric: metric.metric, value: metric.value })), [live.data]);

  const unknown = useMemo(() => (live.data?.metrics ?? []).length === 0, [live.data]);

  return (
    <>
      <header className="ad-page-head">
        <span className="ad-eyebrow">MEASUREMENT</span>
        <h1>Analytics</h1>
        <p>Counts of what is stored, and where editorial work is waiting. This is not visitor telemetry.</p>
      </header>

      {live.state !== 'ready'
        ? <Panel title="Metrics" description="Read from the Admin database"><StateNotice state={live.state} error={live.error} reload={live.reload} /></Panel>
        : unknown
          ? <Panel title="Metrics"><EmptyState title="The database returned no metrics" text="The analytics function ran but reported no rows. That is reported as an absence, not as zero activity." /></Panel>
          : (
            <>
              {GROUPS.map(group => (
                <Panel
                  key={group.key}
                  title={group.title}
                  description={group.description}
                  aside={<Badge tone="purple">{group.metrics.length} measures</Badge>}
                >
                  <div className="ad-stats">
                    {group.metrics.map(metric => (
                      <div className="ad-stat" key={metric.id}>
                        <div className="ad-stat-top"><span>{metric.label}</span></div>
                        <strong>{values.has(metric.id) ? formatNumber(values.get(metric.id)) : '—'}</strong>
                        <small>{metric.caption}</small>
                      </div>
                    ))}
                  </div>
                </Panel>
              ))}

              <Panel
                title="Not measured"
                description="Stated plainly so an empty chart is never mistaken for a measured zero"
                aside={<Badge tone="amber">No source</Badge>}
              >
                <p className="ad-muted-copy">
                  The following are not collected by this system and are therefore not shown: page views, unique visitors, generation counts,
                  engagement, referrers, devices, and time on site. There is no third-party analytics script on the site and no traffic table in
                  the database. Adding one would need a privacy review, a retention policy and a storage decision — not a chart.
                </p>
              </Panel>

              <Panel title="Export" description="The rows already on screen, serialised in the browser. No new permission is used.">
                <div className="ad-action-row">
                  <button type="button" onClick={() => downloadCsv('admin-metrics.csv', rows, ['metric', 'value'])} disabled={rows.length === 0}>
                    Download metrics as CSV
                  </button>
                  <span className="ad-muted-copy" style={{ margin: 0 }}>{rows.length} row{rows.length === 1 ? '' : 's'} ready</span>
                </div>
              </Panel>
            </>
          )}
    </>
  );
}
