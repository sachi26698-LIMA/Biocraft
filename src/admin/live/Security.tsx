/**
 * Security — the audit trail and the sessions that produced it.
 *
 * An audit log is only worth having if it cannot be edited, and this one is
 * append-only at the database level: a trigger refuses UPDATE and DELETE on
 * `admin_audit_logs` outright. So this screen offers no edit or delete control,
 * because there is nothing it could honestly do.
 *
 * The log is paged by id, newest first. That is a keyset cursor, not an offset: a
 * new event arriving between two pages cannot shift a row onto a page twice or
 * skip one entirely.
 */
import { useCallback, useMemo, useState } from 'react';
import { Badge, Panel } from '../parts';
import { formatDate, formatNumber, mutate, request, useLive } from './useLive';
import { CursorPager, EmptyState, MessageBox, SearchField, StateNotice, Toolbar } from './ui';
import { downloadCsv } from './useLive';
import type { AuditRow, SessionRow } from './types';

const PAGE = 50;

/** Turn an audit action into a sentence a person can read. The raw action is
 * still shown next to it, because the exact name is what an investigator searches. */
const ACTION_LABEL: Record<string, string> = {
  'auth.login': 'Signed in',
  'auth.logout': 'Signed out',
  'auth.recovery.factor_reset': 'Authenticator reset by an operator',
  'session.open': 'Session opened',
  'session.revoke_all': 'All sessions revoked',
  'draft.created': 'Draft created',
  'draft.updated': 'Draft updated',
  'draft.submitted': 'Sent for review',
  'draft.approved': 'Approved by a reviewer',
  'draft.rejected': 'Rejected by a reviewer',
  'draft.published': 'Published to the public site',
  'draft.revert_opened': 'Revert draft opened',
  'notifications.read': 'Inbox marked read',
  'setting.updated': 'Setting changed',
  'staff.updated': 'Membership changed',
};

export default function Security() {
  const sessions = useLive<{ items: SessionRow[] }>('/sessions?limit=50');
  const [entries, setEntries] = useState<AuditRow[] | null>(null);
  const [state, setState] = useState<'idle' | 'loading' | 'ready' | 'denied' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [failure, setFailure] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [action, setAction] = useState('');

  const load = useCallback(async (before?: string | number) => {
    setBusy(true);
    if (!before) setState('loading');
    setError(null);
    try {
      const suffix = before === undefined ? `?limit=${PAGE}` : `?limit=${PAGE}&before=${before}`;
      const page = await request<{ items: AuditRow[] }>(`/audit-logs${suffix}`);
      const items = page.items ?? [];
      setEntries(previous => before ? [...(previous ?? []), ...items] : items);
      setState('ready');
    } catch (cause) {
      const code = (cause as { code?: string } | null)?.code;
      setState(code === 'FORBIDDEN' ? 'denied' : 'error');
      setError(code === 'FORBIDDEN' ? 'Your account does not have permission to read the audit trail.' : 'The audit trail could not be read.');
    } finally { setBusy(false); }
  }, []);

  const filtered = useMemo(() => {
    const list = entries ?? [];
    const needle = query.trim().toLowerCase();
    return list.filter(row => (action === '' || row.action === action)
      && (needle === '' || row.action.toLowerCase().includes(needle)
        || (row.actor_id ?? '').toLowerCase().includes(needle)
        || (row.target_id ?? '').toLowerCase().includes(needle)));
  }, [entries, query, action]);

  const availableActions = useMemo(() => [...new Set((entries ?? []).map(row => row.action))].sort(), [entries]);

  const lastId = entries && entries.length > 0 ? entries[entries.length - 1].id : null;

  async function revokeAll() {
    setBusy(true); setMessage(null); setFailure(null);
    try {
      const result = await mutate<{ revoked: number }>('/sessions/revoke-all', {});
      setMessage(`${result.revoked} session${result.revoked === 1 ? '' : 's'} revoked, including this one. Sign in again to continue.`);
      sessions.reload();
    } catch {
      setFailure('Sessions were not revoked. Your current session is still active.');
    } finally { setBusy(false); }
  }

  return (
    <>
      <header className="ad-page-head">
        <span className="ad-eyebrow">ACCOUNTABILITY</span>
        <h1>Security</h1>
        <p>Every privileged action is recorded in an append-only trail. This screen can read it; nothing can rewrite it.</p>
      </header>

      <Panel
        title="Audit trail"
        description="Newest first. Append-only at the database level — editing or deleting an entry is refused by a trigger."
        aside={entries && <Badge tone="green">{formatNumber(entries.length)} loaded</Badge>}
      >
        {state === 'idle' && (
          <div className="ad-action-row">
            <button type="button" onClick={() => void load()} disabled={busy}>Load the audit trail</button>
            <span className="ad-muted-copy" style={{ margin: 0 }}>Not loaded automatically, so a large trail is not fetched on every visit.</span>
          </div>
        )}
        {state !== 'idle' && state !== 'ready' && <StateNotice state={state} error={error} reload={() => void load()} />}
        {state === 'ready' && (entries ?? []).length === 0 && (
          <EmptyState title="No audit events yet" text="Nothing privileged has happened since the trail was created. An empty trail is different from an unreadable one." />
        )}
        {state === 'ready' && (entries ?? []).length > 0 && (
          <>
            <Toolbar>
              <SearchField value={query} onChange={setQuery} placeholder="Filter by action, actor or target" label="Filter audit trail" />
              <label className="ad-select-label">
                <span className="ad-sr">Filter by action</span>
                <select value={action} onChange={event => setAction(event.target.value)} aria-label="Filter by action">
                  <option value="">All actions</option>
                  {availableActions.map(name => <option key={name} value={name}>{ACTION_LABEL[name] ?? name}</option>)}
                </select>
              </label>
              <button type="button" onClick={() => downloadCsv('audit-trail.csv', filtered as unknown as Record<string, unknown>[], ['id', 'occurred_at', 'action', 'actor_id', 'target_type', 'target_id'])} disabled={filtered.length === 0}>
                Download {filtered.length} rows
              </button>
            </Toolbar>
            <div className="ad-table-wrap" tabIndex={0} role="region" aria-label="Audit trail table">
              <table className="ad-table">
                <thead><tr><th>When</th><th>What happened</th><th>Actor</th><th>Target</th></tr></thead>
                <tbody>
                  {filtered.map(row => (
                    <tr key={String(row.id)}>
                      <td className="ad-nowrap">{formatDate(row.occurred_at)}</td>
                      <td>
                        <strong>{ACTION_LABEL[row.action] ?? row.action}</strong>
                        <div className="ad-mono ad-muted-copy" style={{ margin: 0 }}>{row.action}</div>
                      </td>
                      <td><code className="ad-mono">{row.actor_id ?? 'system'}</code></td>
                      <td>
                        {row.target_type ?? '—'}
                        {row.target_id && <div className="ad-mono ad-muted-copy" style={{ margin: 0 }}>{row.target_id}</div>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && <EmptyState title="No entry matches this filter" text="Clear the filter to see the whole loaded page." />}
            <CursorPager
              count={filtered.length}
              hasNext={(entries ?? []).length >= PAGE}
              loading={busy}
              onNext={() => { if (lastId !== null) void load(lastId); }}
              onReset={() => void load()}
            />
          </>
        )}
      </Panel>

      <Panel
        title="Your sessions"
        description="Where this account is signed in. A revoked session cannot be used again, even if its token has not expired."
        aside={sessions.state === 'ready' ? <Badge tone={((sessions.data?.items ?? []).length > 1) ? 'amber' : 'green'}>{(sessions.data?.items ?? []).length} sessions</Badge> : undefined}
      >
        {sessions.state !== 'ready'
          ? <StateNotice state={sessions.state} error={sessions.error} reload={sessions.reload} />
          : (
            <div className="ad-table-wrap" tabIndex={0} role="region" aria-label="Sessions table">
              <table className="ad-table">
                <thead><tr><th>Opened</th><th>Expires</th><th>State</th></tr></thead>
                <tbody>
                  {(sessions.data?.items ?? []).map(session => {
                    const expired = Date.parse(session.expires_at) <= Date.now();
                    return (
                      <tr key={session.id}>
                        <td className="ad-nowrap">{formatDate(session.created_at)}</td>
                        <td className="ad-nowrap">{formatDate(session.expires_at)}</td>
                        <td>{session.revoked_at ? <Badge tone="red">Revoked</Badge> : expired ? <Badge tone="amber">Expired</Badge> : <Badge tone="green">Active</Badge>}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        <div className="ad-action-row" style={{ marginTop: 14 }}>
          <button type="button" onClick={() => void revokeAll()} disabled={busy}>
            {busy ? 'Working…' : 'Revoke all sessions'}
          </button>
        </div>
        <p className="ad-muted-copy">This signs out every administrator session for this account, including the one you are using. It cannot be undone; you will need your password and authenticator again.</p>
        <MessageBox message={message} failure={failure} />
      </Panel>
    </>
  );
}
