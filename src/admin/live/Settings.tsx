/**
 * Live Settings — Versioned non-secret system settings with Modal JSON editor,
 * operational maintenance cleanup, and explicit security boundaries.
 */
import { useState } from 'react';
import { useAdminContext } from '../context';
import { Icon } from '../icons';
import { ConfirmDialog, Modal } from '../ui/Modal';
import { useToast } from '../ui/Toast';
import { Badge, EmptyState, Field, MessageBox, PageHead, Panel, StateNotice } from './common';
import type { SettingRow } from './types';
import { formatDate, mutate, useLive } from './useLive';

const FRIENDLY: Record<string, string> = {
  'site.maintenance': 'Maintenance mode',
  'content.review_required': 'Require independent review',
  'publishing.enabled': 'Publishing enabled',
};

export default function LiveSettings() {
  const { navigate } = useAdminContext();
  const toast = useToast();
  const settings = useLive<{ items: SettingRow[] }>('/settings?limit=100');

  const [editing, setEditing] = useState<SettingRow | null>(null);
  const [draftJson, setDraftJson] = useState('');
  const [confirmCleanup, setConfirmCleanup] = useState<'admin_login_flows' | 'admin_rate_limits' | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [failure, setFailure] = useState<string | null>(null);

  async function save() {
    if (!editing) return;
    let parsed: unknown;
    try {
      parsed = JSON.parse(draftJson);
    } catch {
      setFailure('Invalid JSON syntax — nothing was saved.');
      return;
    }
    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
      setFailure('A setting value must be a JSON object, for example {"enabled": true}.');
      return;
    }
    setBusy(editing.key);
    setMessage(null);
    setFailure(null);
    try {
      const result = await mutate<{ version: number }>(
        '/settings',
        {
          key: editing.key,
          value: parsed,
          expectedVersion: Number(editing.version),
        },
        'PUT',
      );
      const msg = `Saved "${FRIENDLY[editing.key] ?? editing.key}" at version ${result.version}.`;
      setMessage(msg);
      toast.push('Setting updated', { description: msg, tone: 'success' });
      setEditing(null);
      setDraftJson('');
      settings.reload();
    } catch (error) {
      const code = (error as { code?: string } | null)?.code;
      const err =
        code === 'CONFLICT'
          ? 'Someone else changed this setting first. Reload and try again.'
          : code === 'STEP_UP_REQUIRED'
            ? 'Your second factor is older than this change allows. Sign in again with your authenticator.'
            : code === 'FORBIDDEN'
              ? 'Your account is not permitted to change settings.'
              : 'The setting was not saved.';
      setFailure(err);
      toast.push('Update blocked', { description: err, tone: 'error' });
    } finally {
      setBusy(null);
    }
  }

  async function runCleanup(target: 'admin_login_flows' | 'admin_rate_limits') {
    setBusy(target);
    setMessage(null);
    setFailure(null);
    try {
      const result = await mutate<{ deleted: number }>('/ops/cleanup', { target, limit: 500 });
      const msg = `${result.deleted} expired row${result.deleted === 1 ? '' : 's'} removed from ${target.replace('admin_', '').replace('_', ' ')}. Audit evidence untouched.`;
      setMessage(msg);
      toast.push('Maintenance completed', { description: msg, tone: 'success' });
      setConfirmCleanup(null);
    } catch {
      const err = 'Cleanup did not run.';
      setFailure(err);
      toast.push('Cleanup failed', { description: err, tone: 'error' });
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      <PageHead
        eyebrow="SYSTEM CONFIGURATION"
        title="Settings"
        description="Non-secret configuration held in the database with optimistic concurrency and step-up protection."
        actions={
          <button type="button" className="ad-btn ad-btn--secondary" onClick={() => navigate('/admin/backup')}>
            <Icon name="backup" size={14} /> Backup &amp; Recovery
          </button>
        }
      />

      <Panel
        title="Settings"
        icon="settings"
        description="Every change is versioned, requires a fresh second factor, and is written to the audit trail."
        aside={settings.state === 'ready' ? <Badge tone="green">{settings.data?.items.length ?? 0} keys</Badge> : undefined}
      >
        {settings.state !== 'ready' ? (
          <StateNotice state={settings.state} error={settings.error} reload={settings.reload} />
        ) : (settings.data?.items.length ?? 0) === 0 ? (
          <EmptyState icon="settings" title="No settings recorded" text="The settings table is empty. Defaults apply until a value is written." />
        ) : (
          <div className="ad-table-wrap" tabIndex={0} role="region" aria-label="Settings table">
            <table className="ad-table">
              <thead>
                <tr>
                  <th>Setting</th>
                  <th>Value</th>
                  <th>Version</th>
                  <th>Changed</th>
                  <th className="ad-right">Edit</th>
                </tr>
              </thead>
              <tbody>
                {settings.data!.items.map(row => (
                  <tr key={row.key}>
                    <td>
                      <strong>{FRIENDLY[row.key] ?? row.key}</strong>
                      {FRIENDLY[row.key] && <small className="ad-cell-sub ad-mono">{row.key}</small>}
                    </td>
                    <td><code className="ad-mono">{JSON.stringify(row.value)}</code></td>
                    <td className="ad-nowrap">v{String(row.version)}</td>
                    <td className="ad-nowrap">{formatDate(row.updated_at)}</td>
                    <td className="ad-right">
                      <button
                        type="button"
                        className="ad-btn ad-btn--secondary ad-btn--sm"
                        onClick={() => {
                          setEditing(row);
                          setDraftJson(JSON.stringify(row.value, null, 2));
                          setMessage(null);
                          setFailure(null);
                        }}
                      >
                        <Icon name="edit" size={13} /> Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <MessageBox message={message} failure={failure} />
      </Panel>

      <div className="ad-two-col">
        <Panel
          title="Operational maintenance"
          icon="refresh"
          description="Removes expired sign-in handoffs and stale rate-limit windows in bounded batches. Audit evidence is never touched."
        >
          <div className="ad-action-row">
            <button
              type="button"
              className="ad-btn ad-btn--secondary"
              onClick={() => setConfirmCleanup('admin_login_flows')}
              disabled={busy !== null}
            >
              Clear expired sign-in handoffs
            </button>
            <button
              type="button"
              className="ad-btn ad-btn--secondary"
              onClick={() => setConfirmCleanup('admin_rate_limits')}
              disabled={busy !== null}
            >
              Clear stale rate limits
            </button>
          </div>
          <p className="ad-muted-copy">Idempotent operations — safe to re-run at any time.</p>
        </Panel>

        <Panel title="Not configurable here" icon="shieldCheck" description="Protected architectural boundaries" aside={<Badge tone="amber">By design</Badge>}>
          <ul className="ad-clean-list">
            <li><strong>Database credentials</strong> live strictly in server environment variables.</li>
            <li><strong>Provider &amp; HMAC keys</strong> are never readable from the browser console.</li>
            <li><strong>Role definitions</strong> are managed by reviewed SQL migrations, not UI forms.</li>
            <li><strong>Backup restores</strong> require provider-level approval outside the browser.</li>
          </ul>
        </Panel>
      </div>

      <Modal
        open={Boolean(editing)}
        onClose={busy ? () => {} : () => { setEditing(null); setDraftJson(''); }}
        title={editing ? `Edit ${FRIENDLY[editing.key] ?? editing.key}` : 'Edit setting'}
        subtitle={editing ? `Key: ${editing.key} · expected version ${editing.version}` : ''}
        footer={
          <>
            <button type="button" className="ad-btn ad-btn--secondary" onClick={() => { setEditing(null); setDraftJson(''); }} disabled={busy !== null}>
              Cancel
            </button>
            <button type="button" className="ad-btn ad-btn--primary" onClick={() => void save()} disabled={busy !== null}>
              {busy ? 'Saving…' : 'Save setting'}
            </button>
          </>
        }
      >
        {editing && (
          <Field label="JSON object value" hint="Validated server-side before writing.">
            <textarea
              className="ad-mono-textarea"
              value={draftJson}
              onChange={e => setDraftJson(e.target.value)}
              rows={6}
              spellCheck={false}
              aria-label="Setting value as JSON"
            />
          </Field>
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(confirmCleanup)}
        onClose={() => setConfirmCleanup(null)}
        onConfirm={async () => {
          if (confirmCleanup) await runCleanup(confirmCleanup);
        }}
        title="Run bounded maintenance cleanup?"
        description={
          confirmCleanup === 'admin_login_flows'
            ? 'Remove up to 500 expired sign-in handoff rows from admin_login_flows.'
            : 'Remove up to 500 stale rate-limit window rows from admin_rate_limits.'
        }
        consequence="Audit logs, active sessions, drafts, and public content are never touched."
        confirmLabel="Run cleanup"
        tone="primary"
        busy={busy !== null}
      />
    </>
  );
}
