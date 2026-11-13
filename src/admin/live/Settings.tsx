/**
 * Settings — the non-secret configuration the database holds, plus the two
 * operational surfaces that belong with it: backup history and cleanup.
 *
 * Two rules this screen follows strictly:
 *
 *  - a setting is edited with the version it was read at, so a concurrent change
 *    produces a conflict instead of a silent overwrite;
 *  - nothing here is a credential. The database stores non-secret configuration
 *    only; keys and passwords live in the server environment and are never
 *    readable from, or writable to, this screen.
 */
import { useState } from 'react';
import { Badge, Panel } from '../parts';
import { formatDate, mutate, useLive } from './useLive';
import { EmptyState, Field, MessageBox, StateNotice } from './ui';
import type { BackupRow, SettingRow } from './types';

const FRIENDLY: Record<string, string> = {
  'site.maintenance': 'Maintenance mode',
  'content.review_required': 'Require independent review',
  'publishing.enabled': 'Publishing enabled',
};

export default function Settings() {
  const settings = useLive<{ items: SettingRow[] }>('/settings?limit=100');
  const backups = useLive<{ items: BackupRow[] }>('/backups?limit=25');

  const [editing, setEditing] = useState<string | null>(null);
  const [draftJson, setDraftJson] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [failure, setFailure] = useState<string | null>(null);

  async function save(row: SettingRow) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(draftJson);
    } catch {
      setFailure('That is not valid JSON, so nothing was saved.');
      return;
    }
    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
      setFailure('A setting value must be a JSON object, for example {"enabled": true}.');
      return;
    }
    setBusy(row.key); setMessage(null); setFailure(null);
    try {
      const result = await mutate<{ version: number }>('/settings', {
        key: row.key,
        value: parsed,
        expectedVersion: Number(row.version),
      }, 'PUT');
      setMessage(`Saved "${FRIENDLY[row.key] ?? row.key}" at version ${result.version}.`);
      setEditing(null);
      settings.reload();
    } catch (error) {
      const code = (error as { code?: string } | null)?.code;
      setFailure(code === 'CONFLICT'
        ? 'Someone else changed this setting first. Nothing was saved — reload and try again.'
        : code === 'STEP_UP_REQUIRED'
          ? 'Your second factor is older than this change allows. Sign in again with your authenticator.'
          : code === 'FORBIDDEN'
            ? 'Your account is not permitted to change settings.'
            : 'The setting was not saved.');
    } finally { setBusy(null); }
  }

  async function cleanup(target: 'admin_login_flows' | 'admin_rate_limits') {
    setBusy(target); setMessage(null); setFailure(null);
    try {
      const result = await mutate<{ deleted: number }>('/ops/cleanup', { target, limit: 500 });
      setMessage(`${result.deleted} expired row${result.deleted === 1 ? '' : 's'} removed from ${target.replace('admin_', '').replace('_', ' ')}. Audit evidence was not touched.`);
    } catch {
      setFailure('Cleanup did not run.');
    } finally { setBusy(null); }
  }

  return (
    <>
      <header className="ad-page-head">
        <span className="ad-eyebrow">CONFIGURATION</span>
        <h1>Settings</h1>
        <p>Non-secret configuration held in the database, and the operational history around it. Credentials are never stored here.</p>
      </header>

      <Panel
        title="Settings"
        description="Every change is versioned, requires a fresh second factor, and is written to the audit trail."
        aside={settings.state === 'ready' ? <Badge tone="green">{settings.data?.items.length ?? 0} keys</Badge> : undefined}
      >
        {settings.state !== 'ready'
          ? <StateNotice state={settings.state} error={settings.error} reload={settings.reload} />
          : (settings.data?.items.length ?? 0) === 0
            ? <EmptyState title="No settings recorded" text="The settings table is empty. Defaults apply until a value is written here." />
            : (
              <div className="ad-table-wrap" tabIndex={0} role="region" aria-label="Settings table">
                <table className="ad-table">
                  <thead><tr><th>Setting</th><th>Value</th><th>Version</th><th>Changed</th><th></th></tr></thead>
                  <tbody>
                    {settings.data!.items.map(row => (
                      <tr key={row.key}>
                        <td>
                          <strong>{FRIENDLY[row.key] ?? row.key}</strong>
                          {FRIENDLY[row.key] && <div className="ad-mono ad-muted-copy" style={{ margin: 0 }}>{row.key}</div>}
                        </td>
                        <td><code className="ad-mono">{JSON.stringify(row.value)}</code></td>
                        <td className="ad-nowrap">{String(row.version)}</td>
                        <td className="ad-nowrap">{formatDate(row.updated_at)}</td>
                        <td>
                          {editing === row.key
                            ? <div className="ad-action-row">
                                <button type="button" onClick={() => void save(row)} disabled={busy !== null}>{busy === row.key ? 'Saving…' : 'Save'}</button>
                                <button type="button" onClick={() => { setEditing(null); setDraftJson(''); }} disabled={busy !== null}>Cancel</button>
                              </div>
                            : <button type="button" onClick={() => { setEditing(row.key); setDraftJson(JSON.stringify(row.value, null, 2)); setMessage(null); setFailure(null); }}>Edit</button>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
        {editing && (
          <div className="ad-detail" role="group" aria-label="Edit setting value">
            <Field label={`New value for ${editing}`} hint="A JSON object. It is validated on the server before anything is written.">
              <textarea value={draftJson} onChange={event => setDraftJson(event.target.value)} rows={5} spellCheck={false} aria-label="Setting value as JSON" />
            </Field>
          </div>
        )}
        <MessageBox message={message} failure={failure} />
      </Panel>

      <Panel
        title="Backups"
        description="What was requested from the database provider and whether a restore was verified. Provider references only — never credentials."
        aside={backups.state === 'ready' ? <Badge tone={(backups.data?.items.length ?? 0) === 0 ? 'amber' : 'green'}>{backups.data?.items.length ?? 0} records</Badge> : undefined}
      >
        {backups.state !== 'ready'
          ? <StateNotice state={backups.state} error={backups.error} reload={backups.reload} />
          : (backups.data?.items.length ?? 0) === 0
            ? <EmptyState
                title="No backup recorded"
                text="This table is empty, which does not mean there is no backup — it means none was recorded here. Backups are taken by the database provider; this screen only shows what was logged."
              />
            : (
              <div className="ad-table-wrap" tabIndex={0} role="region" aria-label="Backup records">
                <table className="ad-table">
                  <thead><tr><th>Requested</th><th>Environment</th><th>Reference</th><th>State</th><th>Verified</th></tr></thead>
                  <tbody>
                    {backups.data!.items.map(row => (
                      <tr key={row.id}>
                        <td className="ad-nowrap">{formatDate(row.requested_at)}</td>
                        <td>{row.environment}</td>
                        <td><code className="ad-mono">{row.provider_reference}</code></td>
                        <td><Badge tone={row.state === 'restore_verified' ? 'green' : row.state === 'failed' ? 'red' : 'amber'}>{row.state.replace(/_/g, ' ')}</Badge></td>
                        <td className="ad-nowrap">{row.verified_at ? formatDate(row.verified_at) : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
      </Panel>

      <Panel
        title="Maintenance"
        description="Deletes only expired handoff and rate-limit rows, under a lock, in bounded batches. Audit evidence is never touched."
      >
        <div className="ad-action-row">
          <button type="button" onClick={() => void cleanup('admin_login_flows')} disabled={busy !== null}>
            {busy === 'admin_login_flows' ? 'Clearing…' : 'Clear expired sign-in handoffs'}
          </button>
          <button type="button" onClick={() => void cleanup('admin_rate_limits')} disabled={busy !== null}>
            {busy === 'admin_rate_limits' ? 'Clearing…' : 'Clear stale rate limits'}
          </button>
        </div>
        <p className="ad-muted-copy">Both operations are idempotent: running them twice removes nothing the first run did not already remove.</p>
      </Panel>

      <Panel title="Not configurable here" description="And why" aside={<Badge tone="amber">By design</Badge>}>
        <ul className="ad-muted-copy" style={{ paddingLeft: 18 }}>
          <li><strong>Database credentials</strong> live in the server environment. A console that could read them would be a bigger risk than any convenience it offered.</li>
          <li><strong>Provider and SMTP keys</strong> are server-side secrets with the same rule.</li>
          <li><strong>Role definitions</strong> are part of the reviewed SQL, not a text field. Changing them needs a migration and a review, not a save button.</li>
          <li><strong>Restoring a backup</strong> is a provider operation with its own approval. This screen shows history; it cannot start a restore.</li>
        </ul>
      </Panel>
    </>
  );
}
