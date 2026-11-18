/**
 * Live Security & Roles — AAL2 posture, live RBAC permission matrix (/roles),
 * active sessions (/sessions + revoke-all with ConfirmDialog), and on-demand Audit Trail.
 */
import { useCallback, useMemo, useState } from 'react';
import { useAdminContext } from '../context';
import { Icon } from '../icons';
import { ConfirmDialog } from '../ui/Modal';
import { useToast } from '../ui/Toast';
import { AUDIT_ACTION_LABELS } from './AuditLogs';
import { Badge, CursorPager, EmptyState, MessageBox, PageHead, Panel, SearchField, StatCard, StateNotice, Toolbar } from './common';
import type { AuditRow, RoleRow, SessionRow } from './types';
import { downloadCsv, formatDate, formatNumber, mutate, request, useLive } from './useLive';

const PAGE = 50;

export default function LiveSecurity() {
  const { session, navigate } = useAdminContext();
  const toast = useToast();

  const sessions = useLive<{ items: SessionRow[] }>('/sessions?limit=50');
  const roles = useLive<{ items: RoleRow[] }>('/roles');

  // On-demand Audit trail kept accessible directly from /admin/security as well as /admin/audit-logs
  const [entries, setEntries] = useState<AuditRow[] | null>(null);
  const [auditState, setAuditState] = useState<'idle' | 'loading' | 'ready' | 'denied' | 'error'>('idle');
  const [auditError, setAuditError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [confirmRevoke, setConfirmRevoke] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [failure, setFailure] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [action, setAction] = useState('');

  const loadAudit = useCallback(async (before?: string | number) => {
    setBusy(true);
    if (!before) setAuditState('loading');
    setAuditError(null);
    try {
      const suffix = before === undefined ? `?limit=${PAGE}` : `?limit=${PAGE}&before=${before}`;
      const page = await request<{ items: AuditRow[] }>(`/audit-logs${suffix}`);
      const items = page.items ?? [];
      setEntries(prev => (before ? [...(prev ?? []), ...items] : items));
      setAuditState('ready');
    } catch (cause) {
      const code = (cause as { code?: string } | null)?.code;
      setAuditState(code === 'FORBIDDEN' ? 'denied' : 'error');
      setAuditError(
        code === 'FORBIDDEN'
          ? 'Your account does not have permission to read the audit trail.'
          : 'The audit trail could not be read.',
      );
    } finally {
      setBusy(false);
    }
  }, []);

  const filtered = useMemo(() => {
    const list = entries ?? [];
    const needle = query.trim().toLowerCase();
    return list.filter(
      row =>
        (action === '' || row.action === action) &&
        (needle === '' ||
          row.action.toLowerCase().includes(needle) ||
          (row.actor_id ?? '').toLowerCase().includes(needle) ||
          (row.target_id ?? '').toLowerCase().includes(needle)),
    );
  }, [entries, query, action]);

  const availableActions = useMemo(() => [...new Set((entries ?? []).map(row => row.action))].sort(), [entries]);
  const lastId = entries && entries.length > 0 ? entries[entries.length - 1].id : null;

  async function revokeAll() {
    setBusy(true);
    setMessage(null);
    setFailure(null);
    try {
      const result = await mutate<{ revoked: number }>('/sessions/revoke-all', {});
      const msg = `${result.revoked} session${result.revoked === 1 ? '' : 's'} revoked, including this one. Sign in again to continue.`;
      setMessage(msg);
      toast.push('All sessions revoked', { description: msg, tone: 'warning' });
      setConfirmRevoke(false);
      sessions.reload();
    } catch {
      const err = 'Sessions were not revoked. Your current session is still active.';
      setFailure(err);
      toast.push('Revocation failed', { description: err, tone: 'error' });
    } finally {
      setBusy(false);
    }
  }

  const sessionRows = sessions.data?.items ?? [];
  const activeSessions = sessionRows.filter(s => !s.revoked_at && Date.parse(s.expires_at) > Date.now()).length;

  return (
    <>
      <PageHead
        eyebrow="PROTECTION & RBAC"
        title="Security & Roles"
        description="AAL2 session enforcement, server-side role permissions, and append-only audit visibility."
        actions={
          <button type="button" className="ad-btn ad-btn--secondary" onClick={() => navigate('/admin/audit-logs')}>
            <Icon name="audit" size={14} /> Full Audit Logs
          </button>
        }
      />

      <div className="ad-stats-grid ad-stats-grid--4">
        <StatCard icon="shieldCheck" label="Assurance Level" value="AAL2" caption="TOTP verified" tint="mint" />
        <StatCard icon="key" label="Active Sessions" value={sessions.state === 'ready' ? activeSessions : '—'} caption="Bound to HttpOnly cookie" tint="sky" />
        <StatCard icon="users" label="Roles Defined" value={roles.state === 'ready' ? (roles.data?.items.length ?? 0) : '—'} caption="Server-enforced RBAC" tint="lavender" />
        <StatCard icon="lock" label="Your Permissions" value={session?.permissions.length ?? '—'} caption="Verified per request" tint="violet" />
      </div>

      <Panel
        title="Your sessions"
        icon="key"
        description="Every session opened for this account. Revoked sessions stop working immediately."
        aside={
          sessions.state === 'ready' ? (
            <Badge tone={sessionRows.length > 1 ? 'amber' : 'green'}>{sessionRows.length} sessions</Badge>
          ) : undefined
        }
      >
        {sessions.state !== 'ready' ? (
          <StateNotice state={sessions.state} error={sessions.error} reload={sessions.reload} />
        ) : (
          <div className="ad-table-wrap" tabIndex={0} role="region" aria-label="Sessions table">
            <table className="ad-table">
              <thead>
                <tr>
                  <th>Opened</th>
                  <th>Expires</th>
                  <th>State</th>
                </tr>
              </thead>
              <tbody>
                {sessionRows.map(s => {
                  const expired = Date.parse(s.expires_at) <= Date.now();
                  return (
                    <tr key={s.id}>
                      <td className="ad-nowrap">{formatDate(s.created_at)}</td>
                      <td className="ad-nowrap">{formatDate(s.expires_at)}</td>
                      <td>
                        {s.revoked_at ? (
                          <Badge tone="red">Revoked</Badge>
                        ) : expired ? (
                          <Badge tone="amber">Expired</Badge>
                        ) : (
                          <Badge tone="green">Active</Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <div className="ad-action-row" style={{ marginTop: 14 }}>
          <button type="button" className="ad-btn ad-btn--danger" onClick={() => setConfirmRevoke(true)} disabled={busy}>
            <Icon name="logout" size={14} /> {busy ? 'Working…' : 'Revoke all sessions'}
          </button>
        </div>
        <p className="ad-muted-copy">
          Signs out every administrator session for your account, including this browser. Requires a fresh second factor.
        </p>
        <MessageBox message={message} failure={failure} />
      </Panel>

      <Panel
        title="Roles & permission matrix"
        icon="security"
        description="Live permission assignments from bc_admin_v1.admin_roles and admin_role_permissions."
        aside={roles.state === 'ready' ? <Badge tone="purple">{roles.data?.items?.length ?? 0} roles</Badge> : undefined}
      >
        {roles.state !== 'ready' ? (
          <StateNotice state={roles.state} error={roles.error} reload={roles.reload} />
        ) : (
          <div className="ad-role-grid">
            {(roles.data?.items ?? []).map(role => (
              <article className="ad-role-card" key={role.id}>
                <div className="ad-role-card-head">
                  <strong>{role.id.replace(/_/g, ' ')}</strong>
                  <Badge tone="purple">{(role.permissions ?? []).length} perms</Badge>
                </div>
                <p>{role.description}</p>
                <div className="ad-chip-row">
                  {(role.permissions ?? []).slice(0, 6).map(p => (
                    <span className="ad-chip ad-mono" key={p}>{p}</span>
                  ))}
                  {(role.permissions ?? []).length > 6 && (
                    <span className="ad-chip">+{(role.permissions ?? []).length - 6} more</span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </Panel>

      <Panel
        title="Audit trail"
        icon="audit"
        description="Newest first. Append-only at the database level — editing or deleting is refused by a SQL trigger."
        aside={entries && <Badge tone="green">{formatNumber(entries.length)} loaded</Badge>}
      >
        {auditState === 'idle' && (
          <div className="ad-action-row">
            <button type="button" className="ad-btn ad-btn--primary" onClick={() => void loadAudit()} disabled={busy}>
              Load the audit trail
            </button>
            <span className="ad-muted-copy" style={{ margin: 0 }}>
              Loaded on demand so a large ledger is never fetched unnecessarily.
            </span>
          </div>
        )}
        {auditState !== 'idle' && auditState !== 'ready' && (
          <StateNotice state={auditState} error={auditError} reload={() => void loadAudit()} />
        )}
        {auditState === 'ready' && (entries ?? []).length === 0 && (
          <EmptyState icon="audit" title="No audit events yet" text="Nothing privileged has been recorded yet." />
        )}
        {auditState === 'ready' && (entries ?? []).length > 0 && (
          <>
            <Toolbar>
              <SearchField value={query} onChange={setQuery} placeholder="Filter by action, actor or target…" label="Filter audit trail" />
              <label className="ad-select-label">
                <span className="ad-sr">Filter by action</span>
                <select value={action} onChange={event => setAction(event.target.value)} aria-label="Filter by action">
                  <option value="">All actions</option>
                  {availableActions.map(name => (
                    <option key={name} value={name}>
                      {AUDIT_ACTION_LABELS[name] ?? name}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                className="ad-btn ad-btn--secondary"
                onClick={() =>
                  downloadCsv('audit-trail.csv', filtered as unknown as Record<string, unknown>[], [
                    'id', 'occurred_at', 'action', 'actor_id', 'target_type', 'target_id',
                  ])
                }
                disabled={filtered.length === 0}
              >
                <Icon name="download" size={14} /> Download {filtered.length} rows
              </button>
            </Toolbar>
            <div className="ad-table-wrap" tabIndex={0} role="region" aria-label="Audit trail table">
              <table className="ad-table">
                <thead>
                  <tr>
                    <th>When</th>
                    <th>What happened</th>
                    <th>Actor</th>
                    <th>Target</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(row => (
                    <tr key={String(row.id)}>
                      <td className="ad-nowrap">{formatDate(row.occurred_at)}</td>
                      <td>
                        <strong>{AUDIT_ACTION_LABELS[row.action] ?? row.action}</strong>
                        <small className="ad-cell-sub ad-mono">{row.action}</small>
                      </td>
                      <td><code className="ad-mono">{row.actor_id ?? 'system'}</code></td>
                      <td>
                        {row.target_type ?? '—'}
                        {row.target_id && <small className="ad-cell-sub ad-mono">{row.target_id}</small>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <CursorPager
              count={filtered.length}
              hasNext={(entries ?? []).length >= PAGE}
              loading={busy}
              onNext={() => { if (lastId !== null) void loadAudit(lastId); }}
              onReset={() => void loadAudit()}
            />
          </>
        )}
      </Panel>

      <ConfirmDialog
        open={confirmRevoke}
        onClose={() => setConfirmRevoke(false)}
        onConfirm={revokeAll}
        title="Revoke every active session?"
        description="Every open BioCraft Master Admin session for your account — including this one — will be terminated immediately."
        consequence="You will need to sign in again with both your password and TOTP authenticator code."
        confirmLabel="Revoke all sessions"
        tone="danger"
        busy={busy}
      />
    </>
  );
}
