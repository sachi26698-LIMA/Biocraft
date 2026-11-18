/**
 * Live Backup & Recovery — Snapshot history (/backups), live Data Health checks
 * from /analytics, bounded operational cleanup, and authenticator recovery guide.
 */
import { useMemo, useState } from 'react';
import { useAdminContext } from '../context';
import { Icon } from '../icons';
import { ConfirmDialog } from '../ui/Modal';
import { useToast } from '../ui/Toast';
import { Badge, EmptyState, MessageBox, PageHead, Panel, StatCard, StateNotice } from './common';
import type { BackupRow, Metric } from './types';
import { formatDate, formatNumber, mutate, useLive } from './useLive';

export default function LiveBackup() {
  const { navigate } = useAdminContext();
  const toast = useToast();
  const backups = useLive<{ items: BackupRow[] }>('/backups?limit=25');
  const metrics = useLive<{ metrics: Metric[] }>('/analytics');

  const [confirmTarget, setConfirmTarget] = useState<'admin_login_flows' | 'admin_rate_limits' | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [failure, setFailure] = useState<string | null>(null);

  const values = useMemo(() => {
    const map = new Map<string, number>();
    for (const m of metrics.data?.metrics ?? []) map.set(m.metric, Number(m.value));
    return map;
  }, [metrics.data]);

  const rows = backups.data?.items ?? [];
  const verifiedCount = rows.filter(r => r.state === 'restore_verified').length;

  async function runCleanup(target: 'admin_login_flows' | 'admin_rate_limits') {
    setBusy(true);
    setMessage(null);
    setFailure(null);
    try {
      const res = await mutate<{ deleted: number }>('/ops/cleanup', { target, limit: 500 });
      const msg = `Cleared ${res.deleted} expired row${res.deleted === 1 ? '' : 's'} from ${target}.`;
      setMessage(msg);
      toast.push('Maintenance succeeded', { description: msg, tone: 'success' });
      setConfirmTarget(null);
    } catch {
      const err = 'Maintenance cleanup could not complete.';
      setFailure(err);
      toast.push('Cleanup failed', { description: err, tone: 'error' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHead
        eyebrow="RESILIENCE & DATA HEALTH"
        title="Backup & Recovery"
        description="Provider backup references, restore verification history, live data health checks, and recovery operations."
        actions={
          <button type="button" className="ad-btn ad-btn--secondary" onClick={() => { backups.reload(); metrics.reload(); }}>
            <Icon name="refresh" size={14} /> Refresh status
          </button>
        }
      />

      <div className="ad-stats-grid ad-stats-grid--4">
        <StatCard icon="backup" label="Recorded Backups" value={backups.state === 'ready' ? formatNumber(rows.length) : '—'} caption="Provider references" tint="sky" />
        <StatCard icon="checkCircle" label="Restore Verified" value={backups.state === 'ready' ? formatNumber(verifiedCount) : '—'} caption="Tested snapshots" tint="mint" />
        <StatCard icon="database" label="Active Bios" value={formatNumber(values.get('bios.active'))} caption="Public catalog live" tint="lavender" />
        <StatCard icon="shieldCheck" label="Rollback Guard" value="Protected" caption="Evidence-preserving SQL" tint="amber" />
      </div>

      <Panel
        title="Backup records"
        icon="backup"
        description="Logged provider snapshot references and restore verification timestamps. Credentials are never stored."
        aside={backups.state === 'ready' ? <Badge tone={rows.length === 0 ? 'amber' : 'green'}>{rows.length} records</Badge> : undefined}
      >
        {backups.state !== 'ready' ? (
          <StateNotice state={backups.state} error={backups.error} reload={backups.reload} />
        ) : rows.length === 0 ? (
          <EmptyState
            icon="backup"
            title="No backup recorded in admin_backup_records"
            text="Provider backups run on Supabase infrastructure; this table tracks explicitly logged snapshots and restore verifications."
          />
        ) : (
          <div className="ad-table-wrap" tabIndex={0} role="region" aria-label="Backup records">
            <table className="ad-table">
              <thead>
                <tr>
                  <th>Requested</th>
                  <th>Environment</th>
                  <th>Provider Reference</th>
                  <th>State</th>
                  <th>Verified</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(row => (
                  <tr key={row.id}>
                    <td className="ad-nowrap">{formatDate(row.requested_at)}</td>
                    <td><Badge tone="blue">{row.environment}</Badge></td>
                    <td><code className="ad-mono">{row.provider_reference}</code></td>
                    <td>
                      <Badge tone={row.state === 'restore_verified' ? 'green' : row.state === 'failed' ? 'red' : 'amber'}>
                        {row.state.replace(/_/g, ' ')}
                      </Badge>
                    </td>
                    <td className="ad-nowrap">{row.verified_at ? formatDate(row.verified_at) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      <div className="ad-two-col">
        <Panel title="Data health checks" icon="shieldCheck" description="Live table counts and operational maintenance">
          <ul className="ad-health-list">
            <li>
              <span className="ad-health-ico ad-tint--lavender"><Icon name="bios" size={15} /></span>
              <span>Public bios integrity</span>
              <Badge tone="green">{formatNumber(values.get('bios.active'))} active</Badge>
            </li>
            <li>
              <span className="ad-health-ico ad-tint--sky"><Icon name="categories" size={15} /></span>
              <span>Categories &amp; platforms</span>
              <Badge tone="green">{formatNumber(values.get('categories.total') ?? 0)} / {formatNumber(values.get('platforms.total') ?? 0)}</Badge>
            </li>
            <li>
              <span className="ad-health-ico ad-tint--mint"><Icon name="search" size={15} /></span>
              <span>SEO page registry</span>
              <Badge tone="green">{formatNumber(values.get('seo_pages.total') ?? 0)} pages</Badge>
            </li>
          </ul>
          <div className="ad-action-row" style={{ marginTop: 14 }}>
            <button type="button" className="ad-btn ad-btn--secondary ad-btn--sm" onClick={() => setConfirmTarget('admin_login_flows')} disabled={busy}>
              Clear expired handoffs
            </button>
            <button type="button" className="ad-btn ad-btn--secondary ad-btn--sm" onClick={() => setConfirmTarget('admin_rate_limits')} disabled={busy}>
              Clear stale rate limits
            </button>
          </div>
          <MessageBox message={message} failure={failure} />
        </Panel>

        <Panel title="Authenticator & incident recovery" icon="key" description="Controlled recovery workflows">
          <ul className="ad-clean-list">
            <li><strong>Lost TOTP device:</strong> A Super Admin issues a single-use 15-minute recovery code from Users &amp; Staff.</li>
            <li><strong>Publication rollback:</strong> Bio updates are append-only; reverting opens a new reviewed draft instead of rewriting history.</li>
            <li><strong>Database restore:</strong> Point-in-time restores execute via Supabase provider controls with separate approval.</li>
          </ul>
          <div className="ad-action-row" style={{ marginTop: 14 }}>
            <button type="button" className="ad-btn ad-btn--secondary ad-btn--sm" onClick={() => navigate('/admin/users')}>
              <Icon name="users" size={14} /> Open Staff Recovery
            </button>
            <button type="button" className="ad-btn ad-btn--secondary ad-btn--sm" onClick={() => navigate('/admin/security')}>
              <Icon name="security" size={14} /> Security &amp; Roles
            </button>
          </div>
        </Panel>
      </div>

      <ConfirmDialog
        open={Boolean(confirmTarget)}
        onClose={() => setConfirmTarget(null)}
        onConfirm={async () => {
          if (confirmTarget) await runCleanup(confirmTarget);
        }}
        title="Run operational cleanup?"
        description={`Deletes up to 500 expired rows from ${confirmTarget ?? ''}.`}
        consequence="Only expired operational state is pruned; audit logs and content rows are never modified."
        confirmLabel="Run cleanup"
        busy={busy}
      />
    </>
  );
}
