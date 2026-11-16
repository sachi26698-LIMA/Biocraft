/**
 * Live Audit Logs — Dedicated append-only audit trail module.
 * Reads /api/admin/v1/audit-logs with keyset cursor pagination, action filtering,
 * searchable actor/target lookup, detail JSON modal, and CSV export.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Icon } from '../icons';
import { Modal } from '../ui/Modal';
import { useToast } from '../ui/Toast';
import { Badge, CursorPager, EmptyState, PageHead, Panel, SearchField, SelectField, StatCard, StateNotice, Toolbar } from './common';
import type { AuditRow } from './types';
import { downloadCsv, formatDate, formatNumber, request } from './useLive';

const PAGE = 50;

export const AUDIT_ACTION_LABELS: Record<string, string> = {
  'auth.login': 'Signed in',
  'auth.logout': 'Signed out',
  'auth.recovery.factor_reset': 'Authenticator reset by operator',
  'session.open': 'Session opened',
  'session.revoke_all': 'All sessions revoked',
  'draft.created': 'Draft created',
  'draft.updated': 'Draft updated',
  'draft.submitted': 'Sent for review',
  'draft.approved': 'Approved by reviewer',
  'draft.rejected': 'Rejected by reviewer',
  'draft.published': 'Published to public site',
  'draft.revert_opened': 'Revert draft opened',
  'notifications.read': 'Inbox marked read',
  'setting.updated': 'Setting changed',
  'setting.update': 'Setting changed',
  'staff.updated': 'Membership changed',
};

export default function LiveAuditLogs() {
  const toast = useToast();
  const [entries, setEntries] = useState<AuditRow[] | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'denied' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState('');
  const [action, setAction] = useState('');
  const [inspectRow, setInspectRow] = useState<AuditRow | null>(null);

  const load = useCallback(async (before?: string | number) => {
    setBusy(true);
    if (before === undefined) setState('loading');
    setError(null);
    try {
      const suffix = before === undefined ? `?limit=${PAGE}` : `?limit=${PAGE}&before=${before}`;
      const page = await request<{ items: AuditRow[] }>(`/audit-logs${suffix}`);
      const items = page.items ?? [];
      setEntries(prev => (before !== undefined ? [...(prev ?? []), ...items] : items));
      setState('ready');
    } catch (cause) {
      const code = (cause as { code?: string } | null)?.code;
      setState(code === 'FORBIDDEN' ? 'denied' : 'error');
      setError(
        code === 'FORBIDDEN'
          ? 'Your account does not have permission to read the audit trail.'
          : 'The audit trail could not be read.',
      );
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const all = entries ?? [];
  const availableActions = useMemo(() => [...new Set(all.map(row => row.action))].sort(), [all]);
  const uniqueActors = useMemo(() => new Set(all.map(r => r.actor_id ?? 'system')).size, [all]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return all.filter(
      row =>
        (action === '' || row.action === action) &&
        (needle === '' ||
          row.action.toLowerCase().includes(needle) ||
          (AUDIT_ACTION_LABELS[row.action] ?? '').toLowerCase().includes(needle) ||
          (row.actor_id ?? '').toLowerCase().includes(needle) ||
          (row.target_id ?? '').toLowerCase().includes(needle)),
    );
  }, [all, query, action]);

  const lastId = all.length > 0 ? all[all.length - 1].id : null;

  return (
    <>
      <PageHead
        eyebrow="ACCOUNTABILITY"
        title="Audit Logs"
        description="Tamper-evident append-only ledger of every privileged action. Database triggers refuse UPDATE and DELETE."
        actions={
          <div className="ad-action-row">
            <button type="button" className="ad-btn ad-btn--secondary" onClick={() => void load()} disabled={busy}>
              <Icon name="refresh" size={14} /> Refresh
            </button>
            <button
              type="button"
              className="ad-btn ad-btn--secondary"
              disabled={filtered.length === 0}
              onClick={() => {
                const n = downloadCsv('audit-trail.csv', filtered as unknown as Record<string, unknown>[], [
                  'id', 'occurred_at', 'action', 'actor_id', 'target_type', 'target_id',
                ]);
                toast.push(`Exported ${n} audit events`, { tone: 'success' });
              }}
            >
              <Icon name="download" size={14} /> Export CSV
            </button>
          </div>
        }
      />

      {state === 'ready' && (
        <div className="ad-stats-grid ad-stats-grid--3">
          <StatCard icon="audit" label="Loaded events" value={formatNumber(all.length)} caption="Newest first keyset" tint="lavender" />
          <StatCard icon="users" label="Distinct actors" value={formatNumber(uniqueActors)} caption="In loaded window" tint="sky" />
          <StatCard icon="shieldCheck" label="Immutability" value="Append-only" caption="SQL trigger protected" tint="mint" />
        </div>
      )}

      <Panel
        title="Event ledger"
        icon="audit"
        description="Redacted audit events — identifiers and outcomes only, never credentials or request secrets."
        aside={state === 'ready' ? <Badge tone="green">{formatNumber(filtered.length)} matching</Badge> : undefined}
      >
        {state !== 'ready' ? (
          <StateNotice state={state} error={error} reload={() => void load()} />
        ) : all.length === 0 ? (
          <EmptyState icon="audit" title="No audit events yet" text="No privileged actions have been recorded yet." />
        ) : (
          <>
            <Toolbar>
              <SearchField value={query} onChange={setQuery} placeholder="Search action, actor or target…" label="Filter audit trail" />
              <SelectField value={action} onChange={setAction} label="Filter by action">
                <option value="">All actions</option>
                {availableActions.map(name => (
                  <option key={name} value={name}>
                    {AUDIT_ACTION_LABELS[name] ?? name}
                  </option>
                ))}
              </SelectField>
            </Toolbar>

            {filtered.length === 0 ? (
              <EmptyState icon="search" title="No entry matches this filter" text="Clear the search or action filter to view all loaded events." />
            ) : (
              <div className="ad-table-wrap" tabIndex={0} role="region" aria-label="Audit trail table">
                <table className="ad-table">
                  <thead>
                    <tr>
                      <th>When</th>
                      <th>Event</th>
                      <th>Actor</th>
                      <th>Target</th>
                      <th className="ad-right">Details</th>
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
                          <Badge>{row.target_type ?? '—'}</Badge>
                          {row.target_id && <small className="ad-cell-sub ad-mono">{row.target_id}</small>}
                        </td>
                        <td className="ad-right">
                          <button type="button" className="ad-btn ad-btn--ghost ad-btn--sm" onClick={() => setInspectRow(row)}>
                            Inspect
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <CursorPager
              count={filtered.length}
              hasNext={all.length >= PAGE}
              loading={busy}
              onNext={() => { if (lastId !== null) void load(lastId); }}
              onReset={() => void load()}
            />
          </>
        )}
      </Panel>

      <Modal
        open={Boolean(inspectRow)}
        onClose={() => setInspectRow(null)}
        title={inspectRow ? AUDIT_ACTION_LABELS[inspectRow.action] ?? inspectRow.action : 'Audit Event'}
        subtitle={inspectRow ? `Event #${inspectRow.id} · ${formatDate(inspectRow.occurred_at)}` : ''}
        footer={
          <button type="button" className="ad-btn ad-btn--secondary" onClick={() => setInspectRow(null)}>
            Close
          </button>
        }
      >
        {inspectRow && (
          <dl className="ad-detail-grid">
            <dt>Event ID</dt><dd><code className="ad-mono">{String(inspectRow.id)}</code></dd>
            <dt>Action</dt><dd><code className="ad-mono">{inspectRow.action}</code></dd>
            <dt>Actor</dt><dd><code className="ad-mono">{inspectRow.actor_id ?? 'system'}</code></dd>
            <dt>Target Type</dt><dd>{inspectRow.target_type ?? '—'}</dd>
            <dt>Target ID</dt><dd><code className="ad-mono">{inspectRow.target_id ?? '—'}</code></dd>
            <dt>Metadata</dt>
            <dd>
              <pre className="ad-code-block">{JSON.stringify(inspectRow.details ?? {}, null, 2)}</pre>
            </dd>
          </dl>
        )}
      </Modal>
    </>
  );
}
