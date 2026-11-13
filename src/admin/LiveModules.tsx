/**
 * Read-only live module view. It only renders data fetched from the Admin API;
 * when the backend is absent (the current deployment) it renders nothing at all,
 * so the static bundled preview stays exactly as before instead of showing
 * fabricated "live" rows.
 */
import { useEffect, useState } from 'react';
import { probeBackend, request } from './backend';

type Metric = { metric: string; value: number };
type PlatformRow = { id: string; name: string; slug: string; is_active: boolean; sort_order: number };
type CategoryRow = { id: string; name: string; slug: string; platform_slug: string | null; is_active: boolean };

const LABELS: Record<string, string> = {
  'bios.active': 'Active bios',
  'bios.archived': 'Archived bios',
  'categories.total': 'Categories',
  'platforms.total': 'Platforms',
  'generators.total': 'Generators',
  'seo_pages.total': 'SEO pages',
  'admin.drafts.in_review': 'Drafts in review',
  'admin.drafts.approved': 'Approved drafts',
  'admin.audit.last_24h': 'Audit events (24 h)',
  'admin.sessions.active': 'Active Admin sessions',
};

export default function LiveModules() {
  const [state, setState] = useState<'idle' | 'loading' | 'ready' | 'error' | 'absent'>('idle');
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [platforms, setPlatforms] = useState<PlatformRow[]>([]);
  const [categories, setCategories] = useState<CategoryRow[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;
    (async () => {
      setState('loading');
      const status = await probeBackend(controller.signal);
      if (cancelled) return;
      if (status !== 'ready') { setState(status === 'unauthenticated' ? 'error' : 'absent'); return; }
      try {
        const [analytics, platformPage, categoryPage] = await Promise.all([
          request<{ metrics: Metric[] }>('/analytics'),
          request<{ items: PlatformRow[] }>('/platforms?limit=50'),
          request<{ items: CategoryRow[] }>('/categories?limit=50'),
        ]);
        if (cancelled) return;
        setMetrics(Array.isArray(analytics.metrics) ? analytics.metrics : []);
        setPlatforms(Array.isArray(platformPage.items) ? platformPage.items : []);
        setCategories(Array.isArray(categoryPage.items) ? categoryPage.items : []);
        setState('ready');
      } catch { if (!cancelled) setState('error'); }
    })().catch(() => { if (!cancelled) setState('absent'); });
    return () => { cancelled = true; controller.abort(); };
  }, []);

  if (state === 'absent' || state === 'idle') return null;
  if (state === 'loading') return <section className="ad-panel" aria-live="polite" style={{ marginTop: 18 }}><p role="status">Loading live Admin data…</p></section>;
  if (state === 'error') return <section className="ad-panel" style={{ marginTop: 18 }}><h2>Live data unavailable</h2><p>The Admin service is reachable but this session cannot read it. Sign in again to continue.</p></section>;

  return <>
    <section className="ad-panel" style={{ marginTop: 18 }}>
      <div className="ad-panel-head"><div><h2>Live database metrics</h2><p>Read-only aggregates from the connected Admin database</p></div><span className="ad-badge ad-badge--green">Live</span></div>
      <div className="ad-stats">{metrics.map(metric => <div className="ad-stat" key={metric.metric}><div className="ad-stat-top"><span>{LABELS[metric.metric] ?? metric.metric}</span></div><strong>{Number(metric.value).toLocaleString()}</strong></div>)}</div>
    </section>
    <section className="ad-panel" style={{ marginTop: 18 }}>
      <div className="ad-panel-head"><div><h2>Platforms (live)</h2><p>Including inactive rows, from the database</p></div></div>
      <div className="ad-table-wrap" tabIndex={0} role="region" aria-label="Live platforms table"><table className="ad-table"><thead><tr><th>Name</th><th>Slug</th><th>Active</th></tr></thead><tbody>{platforms.map(row => <tr key={row.id}><td>{row.name}</td><td>{row.slug}</td><td>{row.is_active ? 'Yes' : 'No'}</td></tr>)}</tbody></table></div>
    </section>
    <section className="ad-panel" style={{ marginTop: 18 }}>
      <div className="ad-panel-head"><div><h2>Categories (live)</h2><p>Including inactive rows and their platform</p></div></div>
      <div className="ad-table-wrap" tabIndex={0} role="region" aria-label="Live categories table"><table className="ad-table"><thead><tr><th>Name</th><th>Slug</th><th>Platform</th><th>Active</th></tr></thead><tbody>{categories.map(row => <tr key={row.id}><td>{row.name}</td><td>{row.slug}</td><td>{row.platform_slug ?? '—'}</td><td>{row.is_active ? 'Yes' : 'No'}</td></tr>)}</tbody></table></div>
    </section>
  </>;
}
