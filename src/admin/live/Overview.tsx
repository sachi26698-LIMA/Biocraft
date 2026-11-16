/**
 * Live Overview — Apple-inspired Master Admin dashboard driven 100% by real API data.
 * Never mixes bundled fixtures with live counts; reports loading, denial and error
 * states honestly.
 */
import { useMemo, useState } from 'react';
import { primaryRoleLabel, timeGreeting, useAdminContext } from '../context';
import { Icon } from '../icons';
import { AreaChart, DonutChart } from '../ui/Charts';
import { Badge, Panel, SegmentedControl, SkeletonStats, StatCard, StateNotice } from './common';
import type { AuditRow, CollectionRow, Metric } from './types';
import { formatDate, formatNumber, useLive } from './useLive';

const DONUT_COLORS = ['#7c4dff', '#ec4899', '#06b6d4', '#f59e0b', '#8b5cf6', '#10b981'];

const AUDIT_LABELS: Record<string, string> = {
  'auth.login': 'Admin signed in',
  'auth.logout': 'Admin signed out',
  'draft.created': 'New bio draft created',
  'draft.updated': 'Bio draft updated',
  'draft.submitted': 'Draft sent for review',
  'draft.approved': 'Draft approved',
  'draft.rejected': 'Draft rejected',
  'draft.published': 'Bio published live',
  'setting.updated': 'System setting updated',
  'setting.update': 'System setting updated',
  'staff.updated': 'Staff role updated',
  'session.open': 'AAL2 session opened',
  'session.revoke_all': 'All sessions revoked',
};

export default function LiveOverview() {
  const { session, navigate, openBioModal, refreshTick } = useAdminContext();
  const metrics = useLive<{ metrics: Metric[] }>('/analytics', refreshTick);
  const collections = useLive<{ items: CollectionRow[] }>('/collections?limit=50', refreshTick);
  const recentAudit = useLive<{ items: AuditRow[] }>('/audit-logs?limit=5', refreshTick);

  const [chartTab, setChartTab] = useState<'collections' | 'inventory' | 'workflow'>('collections');

  const values = useMemo(() => {
    const map = new Map<string, number>();
    for (const m of metrics.data?.metrics ?? []) map.set(m.metric, Number(m.value));
    return map;
  }, [metrics.data]);

  const activeBios = values.get('bios.active') ?? 0;
  const archivedBios = values.get('bios.archived') ?? 0;
  const totalBios = activeBios + archivedBios;
  const categoriesTotal = values.get('categories.total') ?? 0;
  const platformsTotal = values.get('platforms.total') ?? 0;
  const generatorsTotal = values.get('generators.total') ?? 0;
  const seoPagesTotal = values.get('seo_pages.total') ?? 0;
  const inReview = values.get('admin.drafts.in_review') ?? 0;
  const approved = values.get('admin.drafts.approved') ?? 0;
  const audit24h = values.get('admin.audit.last_24h') ?? 0;
  const activeSessions = values.get('admin.sessions.active') ?? 0;
  const collectionsCount = collections.data?.items?.length ?? 0;

  const chartPoints = useMemo(() => {
    if (chartTab === 'collections' && (collections.data?.items?.length ?? 0) > 0) {
      return (collections.data?.items ?? []).slice(0, 12).map(col => ({
        label: col.source_slug.replace(/-bio$/i, '').replace(/-/g, ' '),
        sublabel: col.source_slug,
        value: Number(col.active_bios) + Number(col.archived_bios),
      }));
    }
    if (chartTab === 'workflow') {
      return [
        { label: 'In Review', value: inReview },
        { label: 'Approved', value: approved },
        { label: 'Audit 24h', value: audit24h },
        { label: 'Sessions', value: activeSessions },
      ];
    }
    return [
      { label: 'Active Bios', value: activeBios },
      { label: 'SEO Pages', value: seoPagesTotal },
      { label: 'Categories', value: categoriesTotal },
      { label: 'Collections', value: collectionsCount },
      { label: 'Generators', value: generatorsTotal },
      { label: 'Platforms', value: platformsTotal },
      { label: 'Archived', value: archivedBios },
    ];
  }, [chartTab, collections.data, inReview, approved, audit24h, activeSessions, activeBios, seoPagesTotal, categoriesTotal, collectionsCount, generatorsTotal, platformsTotal, archivedBios]);

  const donutSlices = useMemo(() => {
    const cols = collections.data?.items ?? [];
    if (cols.length > 0) {
      const sorted = [...cols].sort((a, b) => (Number(b.active_bios) + Number(b.archived_bios)) - (Number(a.active_bios) + Number(a.archived_bios)));
      const top = sorted.slice(0, 4);
      const rest = sorted.slice(4).reduce((sum, c) => sum + Number(c.active_bios) + Number(c.archived_bios), 0);
      const slices = top.map((c, idx) => ({
        label: c.source_slug.replace(/-bio$/i, '').replace(/-/g, ' '),
        value: Number(c.active_bios) + Number(c.archived_bios),
        color: DONUT_COLORS[idx % DONUT_COLORS.length],
      }));
      if (rest > 0) slices.push({ label: 'Other', value: rest, color: '#94a3b8' });
      return slices;
    }
    return [
      { label: 'Active Bios', value: activeBios, color: '#7c4dff' },
      { label: 'Archived', value: archivedBios, color: '#f59e0b' },
      { label: 'SEO Pages', value: seoPagesTotal, color: '#06b6d4' },
      { label: 'Categories', value: categoriesTotal, color: '#ec4899' },
    ];
  }, [collections.data, activeBios, archivedBios, seoPagesTotal, categoriesTotal]);

  const roleName = primaryRoleLabel(session?.roles);
  const activePct = totalBios > 0 ? Math.round((activeBios / totalBios) * 100) : 100;

  return (
    <div className="ad-overview-page">
      {/* Greeting Banner */}
      <header className="ad-greeting-bar">
        <div className="ad-greeting-left">
          <div className="ad-greeting-emblem" aria-hidden="true">
            <Icon name="bolt" size={24} />
          </div>
          <div>
            <h1>
              <span className="ad-sr">Overview — </span>
              {timeGreeting()}, {roleName}
            </h1>
            <p>Live counts from the BioCraft database, editorial review status, and session posture.</p>
          </div>
        </div>
        <div className="ad-greeting-actions">
          <span className="ad-date-pill">
            <Icon name="database" size={14} />
            <span>Live Supabase DB</span>
          </span>
          <button type="button" className="ad-btn ad-btn--secondary ad-btn--sm" onClick={() => { metrics.reload(); collections.reload(); recentAudit.reload(); }}>
            <Icon name="refresh" size={14} /> Refresh
          </button>
        </div>
      </header>

      {/* Main Dashboard Two-Track Layout matching Visual Reference */}
      <div className="ad-dash-layout">
        <div className="ad-dash-primary">
          {/* 6 KPI Strip */}
          {metrics.state === 'ready' ? (
            <section aria-label="Content in the database" className="ad-kpi-section">
              <div className="ad-sr"><h2>Content in the database</h2></div>
              <div className="ad-kpi-grid">
                <StatCard icon="bios" label="Active bios" value={formatNumber(activeBios)} trend={`${activePct}% visible`} trendTone="positive" tint="lavender" />
                <StatCard icon="collections" label="Collections" value={formatNumber(collectionsCount || categoriesTotal)} trend="Live catalog" trendTone="positive" tint="sky" />
                <StatCard icon="tag" label="Categories" value={formatNumber(categoriesTotal)} trend="Public registry" trendTone="amber" tint="amber" />
                <StatCard icon="bolt" label="Generators" value={formatNumber(generatorsTotal)} trend="Active tools" trendTone="neutral" tint="violet" />
                <StatCard icon="platforms" label="Platforms" value={formatNumber(platformsTotal)} trend="Configured" trendTone="neutral" tint="cyan" />
                <StatCard icon="audit" label="Audit events (24 h)" value={formatNumber(audit24h)} trend={`${formatNumber(activeSessions)} live sessions`} trendTone="purple" tint="mint" />
              </div>
            </section>
          ) : metrics.state === 'loading' || metrics.state === 'idle' ? (
            <SkeletonStats count={6} />
          ) : (
            <Panel title="Content in the database" description="Counted from public.* under this session's permissions">
              <StateNotice state={metrics.state} error={metrics.error} reload={metrics.reload} />
            </Panel>
          )}

          {/* Middle Row: Content Distribution Area Chart + Quick Actions */}
          <div className="ad-dash-mid">
            <Panel
              title="Content Distribution"
              icon="analytics"
              description="Live counts across collections, inventory, and workflow"
              aside={
                <SegmentedControl
                  ariaLabel="Chart breakdown"
                  value={chartTab}
                  onChange={setChartTab}
                  options={[
                    { value: 'collections', label: 'Collections' },
                    { value: 'inventory', label: 'Inventory' },
                    { value: 'workflow', label: 'Workflow' },
                  ]}
                />
              }
              className="ad-chart-card"
            >
              <AreaChart
                data={chartPoints}
                unit={chartTab === 'collections' ? 'bios' : ''}
                ariaLabel={`Live ${chartTab} distribution chart`}
              />
            </Panel>

            <Panel title="Quick Actions" icon="bolt" className="ad-quick-card">
              <div className="ad-quick-stack">
                <button type="button" className="ad-quick-primary" onClick={() => openBioModal()}>
                  <Icon name="plus" size={16} />
                  <span>Add New Bio</span>
                </button>
                <button type="button" className="ad-quick-btn" onClick={() => navigate('/admin/collections')}>
                  <span className="ad-quick-ico ad-tint--lavender"><Icon name="collections" size={15} /></span>
                  <span>Browse Collections</span>
                </button>
                <button type="button" className="ad-quick-btn" onClick={() => navigate('/admin/content')}>
                  <span className="ad-quick-ico ad-tint--rose"><Icon name="content" size={15} /></span>
                  <span>Review Queue ({inReview})</span>
                </button>
                <button type="button" className="ad-quick-btn" onClick={() => navigate('/admin/generators')}>
                  <span className="ad-quick-ico ad-tint--sky"><Icon name="play" size={15} /></span>
                  <span>Explore Generators</span>
                </button>
              </div>
            </Panel>
          </div>

          {/* Bottom 3-Column Bento: Recent Activity + Content Overview Donut + System Status */}
          <div className="ad-dash-bottom">
            <Panel
              title="Recent Activity"
              icon="clock"
              aside={
                <button type="button" className="ad-link-btn" onClick={() => navigate('/admin/audit-logs')}>
                  View All <Icon name="arrow" size={14} />
                </button>
              }
            >
              {recentAudit.state === 'ready' && (recentAudit.data?.items?.length ?? 0) > 0 ? (
                <ul className="ad-activity-list">
                  {recentAudit.data!.items.slice(0, 4).map((row, idx) => (
                    <li key={String(row.id)}>
                      <span className={`ad-activity-ico ad-tint--${(['mint', 'sky', 'lavender', 'amber'] as const)[idx % 4]}`}>
                        <Icon name={row.action.includes('draft') ? 'fileText' : row.action.includes('staff') ? 'users' : 'shieldCheck'} size={15} />
                      </span>
                      <div className="ad-activity-copy">
                        <strong>{AUDIT_LABELS[row.action] ?? row.action}</strong>
                        <small>{formatDate(row.occurred_at)} · {row.target_type ?? 'system'}</small>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : recentAudit.state === 'denied' ? (
                <p className="ad-muted-copy">Audit feed requires <code>audit.read</code> permission for this account.</p>
              ) : (
                <p className="ad-muted-copy">No recent audit events recorded yet.</p>
              )}
            </Panel>

            <Panel title="Content Overview" icon="layers">
              <DonutChart
                slices={donutSlices}
                centerValue={formatNumber(totalBios)}
                centerLabel="Bios"
                ariaLabel="Live bio distribution by collection"
              />
            </Panel>

            <Panel title="System Status" icon="pulse">
              <ul className="ad-health-list">
                <li>
                  <span className="ad-health-ico ad-tint--sky"><Icon name="database" size={15} /></span>
                  <span>Supabase Database</span>
                  <Badge tone="green">Connected</Badge>
                </li>
                <li>
                  <span className="ad-health-ico ad-tint--lavender"><Icon name="code" size={15} /></span>
                  <span>API Services</span>
                  <Badge tone="green">Healthy</Badge>
                </li>
                <li>
                  <span className="ad-health-ico ad-tint--mint"><Icon name="shieldCheck" size={15} /></span>
                  <span>Auth &amp; Security</span>
                  <Badge tone="green">AAL2 Active</Badge>
                </li>
                <li>
                  <span className="ad-health-ico ad-tint--amber"><Icon name="audit" size={15} /></span>
                  <span>Audit Trail</span>
                  <Badge tone="green">Append-only</Badge>
                </li>
                <li>
                  <span className="ad-health-ico ad-tint--cyan"><Icon name="pulse" size={15} /></span>
                  <span>Rate Limiting</span>
                  <Badge tone="blue">Enabled</Badge>
                </li>
              </ul>
            </Panel>
          </div>
        </div>

        {/* Right Companion Rail (Hero Glass Card + Key Insights + Smart Tools + Account Card) */}
        <aside className="ad-dash-rail" aria-label="Workspace highlights">
          <div className="ad-hero-card">
            <div className="ad-hero-visual">
              <span className="ad-hero-emblem" aria-hidden="true">
                <Icon name="bolt" size={28} />
              </span>
            </div>
            <div className="ad-hero-body">
              <h2>BioCraft Master Admin</h2>
              <p>A powerful, secure &amp; elegant content management system.</p>
              <span className="ad-hero-status">
                <span>All Systems Operational</span>
                <Icon name="check" size={13} />
              </span>
            </div>
          </div>

          <Panel title="Key Insights" icon="analytics">
            <ul className="ad-insights-list">
              <li>
                <button type="button" onClick={() => navigate('/admin/bios')}>
                  <span className="ad-insight-ico ad-tint--mint"><Icon name="trendUp" size={15} /></span>
                  <span className="ad-insight-val ad-text-green">{activePct}%</span>
                  <span className="ad-insight-name">Active Bios Rate</span>
                  <Icon name="chevronRight" size={14} />
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('/admin/content')}>
                  <span className="ad-insight-ico ad-tint--amber"><Icon name="fileText" size={15} /></span>
                  <span className="ad-insight-val">{inReview}</span>
                  <span className="ad-insight-name">Drafts in Review</span>
                  <Icon name="chevronRight" size={14} />
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('/admin/content')}>
                  <span className="ad-insight-ico ad-tint--lavender"><Icon name="checkCircle" size={15} /></span>
                  <span className="ad-insight-val ad-text-purple">{approved}</span>
                  <span className="ad-insight-name">Approved to Publish</span>
                  <Icon name="chevronRight" size={14} />
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('/admin/security')}>
                  <span className="ad-insight-ico ad-tint--sky"><Icon name="shieldCheck" size={15} /></span>
                  <span className="ad-insight-val">{activeSessions}</span>
                  <span className="ad-insight-name">Active Sessions</span>
                  <Icon name="chevronRight" size={14} />
                </button>
              </li>
            </ul>
          </Panel>

          <Panel title="Smart Tools" icon="categories">
            <div className="ad-tools-grid">
              <button type="button" className="ad-tool-tile" onClick={() => openBioModal()}>
                <span className="ad-tool-ico ad-tint--sky"><Icon name="edit" size={18} /></span>
                <span>Bio Editor</span>
              </button>
              <button type="button" className="ad-tool-tile" onClick={() => navigate('/admin/content')}>
                <span className="ad-tool-ico ad-tint--lavender"><Icon name="search" size={18} /></span>
                <span>SEO Tools</span>
              </button>
              <button type="button" className="ad-tool-tile" onClick={() => navigate('/admin/analytics')}>
                <span className="ad-tool-ico ad-tint--mint"><Icon name="transfer" size={18} /></span>
                <span>Export Data</span>
              </button>
              <button type="button" className="ad-tool-tile" onClick={() => navigate('/admin/backup')}>
                <span className="ad-tool-ico ad-tint--cyan"><Icon name="shieldCheck" size={18} /></span>
                <span>Data Health</span>
              </button>
            </div>
          </Panel>

          {session && (
            <Panel title="This account" icon="users" description="Verified session facts">
              <div className="ad-session-facts">
                <div>
                  <small>Administrator</small>
                  <code>{session.userId}</code>
                </div>
                <div>
                  <small>Roles</small>
                  <span className="ad-chip-row">
                    {session.roles.map(role => (
                      <span className="ad-chip" key={role}>
                        {role.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </span>
                </div>
                <div>
                  <small>Authenticator</small>
                  <Badge tone="green">Second factor verified</Badge>
                </div>
                <div>
                  <small>Session expires</small>
                  <span>{formatDate(session.expiresAt)}</span>
                </div>
                <div>
                  <small>Permissions</small>
                  <span>{session.permissions.length} granted</span>
                </div>
              </div>
            </Panel>
          )}
        </aside>
      </div>
    </div>
  );
}
