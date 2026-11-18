/**
 * Live Analytics — Real database inventory & workflow measures, interactive vector
 * charts, CSV/JSON export, and transparent "Not measured" disclosure.
 */
import { useMemo } from 'react';
import { Icon, type IconName } from '../icons';
import { DonutChart, HorizontalBars } from '../ui/Charts';
import { useToast } from '../ui/Toast';
import { Badge, EmptyState, PageHead, Panel, SkeletonStats, StatCard, StateNotice } from './common';
import type { Metric } from './types';
import { downloadCsv, formatNumber, useLive } from './useLive';

const GROUPS: {
  key: string;
  title: string;
  icon: IconName;
  description: string;
  metrics: { id: string; label: string; caption: string; icon: IconName; tint: 'lavender' | 'sky' | 'amber' | 'violet' | 'cyan' | 'mint' | 'rose' }[];
}[] = [
  {
    key: 'content',
    title: 'Content Inventory',
    icon: 'bios',
    description: 'Live counts across the public tables read by BioCraft',
    metrics: [
      { id: 'bios.active', label: 'Active bios', caption: 'Visible to guests', icon: 'bios', tint: 'lavender' },
      { id: 'bios.archived', label: 'Archived bios', caption: 'Hidden from guests', icon: 'lock', tint: 'rose' },
      { id: 'categories.total', label: 'Categories', caption: 'All categories', icon: 'categories', tint: 'amber' },
      { id: 'platforms.total', label: 'Platforms', caption: 'Supported platforms', icon: 'platforms', tint: 'sky' },
      { id: 'generators.total', label: 'Generators', caption: 'Registered tools', icon: 'generators', tint: 'violet' },
      { id: 'seo_pages.total', label: 'SEO pages', caption: 'Indexable metadata', icon: 'search', tint: 'mint' },
    ],
  },
  {
    key: 'workflow',
    title: 'Editorial Workflow',
    icon: 'content',
    description: 'Drafts currently moving through independent review',
    metrics: [
      { id: 'admin.drafts.in_review', label: 'In review', caption: 'Waiting on a reviewer', icon: 'clock', tint: 'amber' },
      { id: 'admin.drafts.approved', label: 'Approved', caption: 'Cleared to publish', icon: 'checkCircle', tint: 'mint' },
    ],
  },
  {
    key: 'security',
    title: 'Security & Sessions',
    icon: 'security',
    description: 'Privileged activity from the append-only audit trail',
    metrics: [
      { id: 'admin.audit.last_24h', label: 'Audit events (24 h)', caption: 'Every privileged action', icon: 'audit', tint: 'sky' },
      { id: 'admin.sessions.active', label: 'Active sessions', caption: 'Live AAL2 sessions', icon: 'shieldCheck', tint: 'lavender' },
    ],
  },
];

export default function LiveAnalytics({intelligence = false}: {intelligence?: boolean}) {
  const toast = useToast();
  const live = useLive<{ metrics: Metric[] }>('/analytics');

  const values = useMemo(() => {
    const map = new Map<string, number>();
    for (const metric of live.data?.metrics ?? []) map.set(metric.metric, Number(metric.value));
    return map;
  }, [live.data]);

  const rows = useMemo(
    () => (live.data?.metrics ?? []).map(metric => ({ metric: metric.metric, value: metric.value })),
    [live.data],
  );

  const exportJson = () => {
    const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), metrics: rows }, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'biocraft-metrics.json';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    toast.push('Exported metrics JSON', { tone: 'success' });
  };

  const activeBios = values.get('bios.active') ?? 0;
  const archivedBios = values.get('bios.archived') ?? 0;

  return (
    <>
      <PageHead
        eyebrow="INSIGHTS & MEASUREMENT"
        title={intelligence ? 'Global Content Intelligence' : 'Analytics'}
        description="Real database counts and editorial workflow volume. No fabricated traffic or visitor telemetry."
        actions={
          rows.length > 0 && (
            <div className="ad-action-row">
              <button
                type="button"
                className="ad-btn ad-btn--secondary"
                onClick={() => {
                  downloadCsv('admin-metrics.csv', rows, ['metric', 'value']);
                  toast.push('Exported metrics CSV', { tone: 'success' });
                }}
              >
                <Icon name="download" size={14} /> Export CSV
              </button>
              <button type="button" className="ad-btn ad-btn--secondary" onClick={exportJson}>
                <Icon name="code" size={14} /> Export JSON
              </button>
            </div>
          )
        }
      />

      {live.state === 'loading' || live.state === 'idle' ? (
        <SkeletonStats count={6} />
      ) : live.state !== 'ready' ? (
        <Panel title="Metrics" description="Read from the Admin database">
          <StateNotice state={live.state} error={live.error} reload={live.reload} />
        </Panel>
      ) : rows.length === 0 ? (
        <Panel title="Metrics">
          <EmptyState
            icon="analytics"
            title="The database returned no metrics"
            text="The analytics function succeeded with zero rows. This is reported honestly rather than filled with zeros."
          />
        </Panel>
      ) : (
        <>
          <div className="ad-two-col">
            <Panel title="Content Mix" icon="layers" description="Proportional distribution across live public tables">
              <DonutChart
                ariaLabel="Public table records distribution"
                centerValue={formatNumber(activeBios + archivedBios)}
                centerLabel="Total Bios"
                slices={[
                  { label: 'Active Bios', value: activeBios, color: '#7c4dff' },
                  { label: 'SEO Pages', value: values.get('seo_pages.total') ?? 0, color: '#0ea5e9' },
                  { label: 'Categories', value: values.get('categories.total') ?? 0, color: '#f59e0b' },
                  { label: 'Generators', value: values.get('generators.total') ?? 0, color: '#10b981' },
                  { label: 'Archived', value: archivedBios, color: '#ec4899' },
                ]}
              />
            </Panel>

            <Panel title="Operational Pulse" icon="pulse" description="Current editorial queue and 24-hour security volume">
              <HorizontalBars
                ariaLabel="Workflow and security activity counts"
                items={[
                  { label: 'Audit events (24 h)', value: values.get('admin.audit.last_24h') ?? 0, color: '#7c4dff' },
                  { label: 'Active Admin sessions', value: values.get('admin.sessions.active') ?? 0, color: '#0ea5e9' },
                  { label: 'Drafts in review', value: values.get('admin.drafts.in_review') ?? 0, color: '#f59e0b' },
                  { label: 'Approved drafts', value: values.get('admin.drafts.approved') ?? 0, color: '#10b981' },
                ]}
              />
            </Panel>
          </div>

          {GROUPS.map(group => (
            <Panel
              key={group.key}
              title={group.title}
              icon={group.icon}
              description={group.description}
              aside={<Badge tone="purple">{group.metrics.length} measures</Badge>}
            >
              <div className={`ad-stats-grid ${group.metrics.length <= 2 ? 'ad-stats-grid--2' : 'ad-stats-grid--3'}`}>
                {group.metrics.map(m => (
                  <StatCard
                    key={m.id}
                    icon={m.icon}
                    label={m.label}
                    value={values.has(m.id) ? formatNumber(values.get(m.id)) : '—'}
                    caption={m.caption}
                    tint={m.tint}
                  />
                ))}
              </div>
            </Panel>
          ))}

          <Panel
            title="Not measured"
            icon="info"
            description="Privacy-first transparency — uncollected telemetry is never invented"
            aside={<Badge tone="amber">No telemetry source</Badge>}
          >
            <p className="ad-muted-copy">
              Page views, unique visitors, generation counts, referrers, and time-on-site are not collected by BioCraft
              and therefore never shown as synthetic numbers. Adding visitor analytics requires a separate privacy review
              and retention policy.
            </p>
          </Panel>
        </>
      )}
    </>
  );
}
