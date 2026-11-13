/**
 * Read-only live module view. It only renders data fetched from the Admin API;
 * when the backend is absent (the current deployment) it renders nothing at all,
 * so the static bundled preview stays exactly as before instead of showing
 * fabricated "live" rows.
 */
import { useEffect, useState } from 'react';
import { probeBackend, request } from './backend';

type Metric = { metric: string; value: number };
type StaffRow = { user_id: string; display_name?: string | null; enabled: boolean; roles?: string[] | null; row_version?: number };
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
  // Staff + recovery (D2) and maintenance (D4) are separate write surfaces; each
  // has its own state so a denial in one cannot present as success in another.
  const [staff, setStaff] = useState<StaffRow[]>([]);
  const [staffState, setStaffState] = useState<'idle' | 'loading' | 'ready' | 'denied'>('idle');
  const [issuedCode, setIssuedCode] = useState('');
  const [issuedFor, setIssuedFor] = useState('');
  const [grantId, setGrantId] = useState('');
  const [recoveryMessage, setRecoveryMessage] = useState('');
  const [cleanup, setCleanup] = useState<{ target: string; deleted: number }[]>([]);
  const [cleanupMessage, setCleanupMessage] = useState('');

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
    (async () => {
      setStaffState('loading');
      try {
        const page = await request<{ items: StaffRow[] }>('/staff?limit=50');
        if (cancelled) return;
        setStaff(Array.isArray(page.items) ? page.items : []);
        setStaffState('ready');
      } catch { if (!cancelled) setStaffState('denied'); }
    })();
  }, []);

  if (state === 'absent' || state === 'idle') return null;
  if (state === 'loading') return <section className="ad-panel" aria-live="polite" style={{ marginTop: 18 }}><p role="status">Loading live Admin data…</p></section>;
  if (state === 'error') return <section className="ad-panel" style={{ marginTop: 18 }}><h2>Live data unavailable</h2><p>The Admin service is reachable but this session cannot read it. Sign in again to continue.</p></section>;

  async function issueRecovery(userId: string) {
    setRecoveryMessage(''); setIssuedCode(''); setGrantId('');
    try {
      const result = await request<{ grant_id: string; code: string; expires_in_seconds: number }>('/staff/recovery', { method: 'POST', body: JSON.stringify({ userId }) });
      setIssuedCode(result.code); setGrantId(result.grant_id); setIssuedFor(userId);
    } catch (error) {
      setRecoveryMessage(error instanceof Error && 'code' in error ? `Recovery could not be authorised (${String((error as { code: unknown }).code)}).` : 'Recovery could not be authorised.');
    }
  }

  async function revokeRecovery() {
    if (!grantId) return;
    try {
      await request('/staff/recovery/revoke', { method: 'POST', body: JSON.stringify({ grantId }) });
      setIssuedCode(''); setGrantId(''); setIssuedFor(''); setRecoveryMessage('Recovery grant revoked.');
    } catch { setRecoveryMessage('The grant could not be revoked.'); }
  }

  // Completes a recovery: after the operator has deleted the stale factor at the
  // provider, this clears the recorded enrolment so the account returns to the
  // ordinary first-enrolment path. Never offered by the account being recovered.
  async function resetEnrolment(userId: string) {
    setRecoveryMessage('');
    try {
      const result = await request<{ reset: boolean }>('/staff/recovery/reset', { method: 'POST', body: JSON.stringify({ userId }) });
      setRecoveryMessage(result.reset
        ? 'Enrolment record cleared — the member can now set up a new authenticator at next sign-in.'
        : 'Nothing to clear: that account has no recorded enrolment.');
    } catch (error) {
      setRecoveryMessage(error instanceof Error && 'code' in error ? `Enrolment was not cleared (${String((error as { code: unknown }).code)}).` : 'Enrolment was not cleared.');
    }
  }

  async function runCleanup(target: 'admin_login_flows' | 'admin_rate_limits') {
    setCleanupMessage('');
    try {
      const result = await request<{ deleted: number }>('/ops/cleanup', { method: 'POST', body: JSON.stringify({ target, limit: 500 }) });
      setCleanup(previous => [...previous.filter(item => item.target !== target), { target, deleted: result.deleted }]);
    } catch { setCleanupMessage(`Cleanup of ${target} did not run.`); }
  }

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
    {staffState === 'ready' && <section className="ad-panel" style={{ marginTop: 18 }}>
      <div className="ad-panel-head"><div><h2>Staff and authenticator recovery</h2><p>Super Admin only. A recovery code is shown once and expires in 15 minutes.</p></div></div>
      <div className="ad-table-wrap" tabIndex={0} role="region" aria-label="Staff table"><table className="ad-table"><thead><tr><th>Member</th><th>Roles</th><th>Enabled</th><th>Recovery</th></tr></thead><tbody>
        {staff.map(row => <tr key={row.user_id}><td>{row.display_name ?? row.user_id}</td><td>{Array.isArray(row.roles) ? row.roles.join(', ') : '—'}</td><td>{row.enabled ? 'Yes' : 'No'}</td>
          <td><div className="ad-action-row">
            <button type="button" onClick={() => void issueRecovery(row.user_id)} disabled={!row.enabled}>Issue code</button>
            <button type="button" onClick={() => void resetEnrolment(row.user_id)} disabled={!row.enabled}>Reset enrolment</button>
          </div></td></tr>)}
      </tbody></table></div>
      {issuedCode && <div className="ad-auth-uri" role="status">
        <span>Recovery code for {staff.find(row => row.user_id === issuedFor)?.display_name ?? issuedFor}</span>
        <code>{issuedCode}</code>
        <p className="ad-auth-note">Give this to the member out of band. It works once and cannot be shown again.</p>
        <div className="ad-action-row"><button type="button" onClick={() => void revokeRecovery()}>Revoke this grant</button></div>
      </div>}
      {recoveryMessage && <p className="ad-auth-error" role="alert">{recoveryMessage}</p>}
    </section>}
    {staffState === 'ready' && <section className="ad-panel" style={{ marginTop: 18 }}>
      <div className="ad-panel-head"><div><h2>Maintenance</h2><p>Deletes only expired handoff and rate-limit records; audit evidence is never touched</p></div></div>
      <div className="ad-action-row">
        <button type="button" onClick={() => void runCleanup('admin_login_flows')}>Clear expired handoffs</button>
        <button type="button" onClick={() => void runCleanup('admin_rate_limits')}>Clear stale rate limits</button>
      </div>
      {cleanup.length > 0 && <p className="ad-muted-copy" role="status">{cleanup.map(item => `${item.target}: ${item.deleted} removed`).join(' · ')}</p>}
      {cleanupMessage && <p className="ad-auth-error" role="alert">{cleanupMessage}</p>}
    </section>}
  </>;
}
