/**
 * Live Users & Staff — Directory, optimistic-concurrency role management,
 * and Super Admin authenticator recovery controls (issue, revoke, reset enrolment).
 */
import { useCallback, useMemo, useState } from 'react';
import { Icon } from '../icons';
import { ConfirmDialog, Modal } from '../ui/Modal';
import { useToast } from '../ui/Toast';
import { Badge, EmptyState, Field, MessageBox, PageHead, Panel, SearchField, SelectField, StatCard, StateNotice, Toolbar } from './common';
import type { RoleRow, StaffRow } from './types';
import { mutate, request, useLive } from './useLive';

const ROLE_LABEL: Record<string, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  content_manager: 'Content Manager',
  editor: 'Editor',
  seo_manager: 'SEO Manager',
  moderator: 'Moderator',
  analyst: 'Analyst',
  auditor: 'Read-only Auditor',
};

const label = (role: string) => ROLE_LABEL[role] ?? role;

type Editable = { enabled: boolean; roles: string[] };

export default function LiveUsers() {
  const toast = useToast();
  const staff = useLive<{ items: StaffRow[] }>('/staff?limit=50');
  const catalog = useLive<{ items: RoleRow[] }>('/roles');

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'enabled' | 'disabled'>('all');
  const [editing, setEditing] = useState<StaffRow | null>(null);
  const [draft, setDraft] = useState<Editable | null>(null);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [failure, setFailure] = useState<string | null>(null);

  // Super Admin TOTP Recovery controls
  const [issuedCode, setIssuedCode] = useState('');
  const [issuedFor, setIssuedFor] = useState('');
  const [grantId, setGrantId] = useState('');
  const [confirmReset, setConfirmReset] = useState<StaffRow | null>(null);
  const [recoveryBusy, setRecoveryBusy] = useState(false);

  const allStaff = staff.data?.items ?? [];
  const enabledCount = allStaff.filter(r => r.enabled).length;
  const disabledCount = allStaff.length - enabledCount;
  const superAdminCount = allStaff.filter(r => (r.roles ?? []).includes('super_admin')).length;

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return allStaff.filter(row => {
      if (statusFilter === 'enabled' && !row.enabled) return false;
      if (statusFilter === 'disabled' && row.enabled) return false;
      if (!needle) return true;
      return (
        row.user_id.toLowerCase().includes(needle) ||
        (row.roles ?? []).some(role => label(role).toLowerCase().includes(needle) || role.includes(needle)) ||
        (row.enabled ? 'enabled active' : 'disabled').includes(needle)
      );
    });
  }, [allStaff, query, statusFilter]);

  const describe = useCallback((error: unknown): string => {
    const code = (error as { code?: unknown } | null)?.code;
    switch (code) {
      case 'FORBIDDEN':
        return 'Your account is not permitted to change membership (or database guard prevented self-edit / last Super Admin removal).';
      case 'STEP_UP_REQUIRED':
        return 'Your second factor is older than this action allows. Sign in again with your authenticator.';
      case 'CONFLICT':
        return 'Someone else changed this member first. Reload the directory and try again.';
      case 'INVALID':
        return 'Those roles are not accepted. Pick at least one role from the catalog.';
      default:
        return 'The change was not saved. Nothing was modified.';
    }
  }, []);

  async function save() {
    if (!editing || !draft) return;
    setPending(true);
    setMessage(null);
    setFailure(null);
    try {
      const result = await mutate<{ row_version: number }>(
        '/staff',
        {
          userId: editing.user_id,
          expectedVersion: Number(editing.version),
          enabled: draft.enabled,
          roles: draft.roles,
        },
        'PATCH',
      );
      const msg = `Saved. ${editing.user_id.slice(0, 8)} is now ${draft.enabled ? 'enabled' : 'disabled'} with ${draft.roles.length} role${draft.roles.length === 1 ? '' : 's'} (version ${result.row_version}).`;
      setMessage(msg);
      toast.push('Staff access updated', { description: msg, tone: 'success' });
      setEditing(null);
      setDraft(null);
      staff.reload();
    } catch (error) {
      const err = describe(error);
      setFailure(err);
      toast.push('Update refused', { description: err, tone: 'error' });
    } finally {
      setPending(false);
    }
  }

  function start(row: StaffRow) {
    setEditing(row);
    setDraft({ enabled: row.enabled, roles: [...(row.roles ?? [])] });
    setMessage(null);
    setFailure(null);
  }

  function toggleRole(role: string) {
    if (!draft) return;
    setDraft({
      ...draft,
      roles: draft.roles.includes(role) ? draft.roles.filter(item => item !== role) : [...draft.roles, role],
    });
  }

  async function issueRecovery(userId: string) {
    setRecoveryBusy(true);
    setFailure(null);
    setMessage(null);
    try {
      const res = await request<{ grant_id: string; code: string; expires_in_seconds: number }>('/staff/recovery', {
        method: 'POST',
        body: JSON.stringify({ userId }),
      });
      setIssuedCode(res.code);
      setGrantId(res.grant_id);
      setIssuedFor(userId);
      toast.push('Single-use recovery code issued', { description: 'Expires in 15 minutes. Share out of band.', tone: 'warning' });
    } catch (error) {
      const err = describe(error);
      setFailure(err);
      toast.push('Recovery could not be issued', { description: err, tone: 'error' });
    } finally {
      setRecoveryBusy(false);
    }
  }

  async function revokeRecovery() {
    if (!grantId) return;
    setRecoveryBusy(true);
    try {
      await request('/staff/recovery/revoke', { method: 'POST', body: JSON.stringify({ grantId }) });
      setIssuedCode('');
      setGrantId('');
      setIssuedFor('');
      setMessage('Recovery grant revoked.');
      toast.push('Recovery grant revoked', { tone: 'info' });
    } catch {
      setFailure('The recovery grant could not be revoked.');
    } finally {
      setRecoveryBusy(false);
    }
  }

  async function resetEnrolment(userId: string) {
    setRecoveryBusy(true);
    setFailure(null);
    try {
      const res = await request<{ reset: boolean }>('/staff/recovery/reset', {
        method: 'POST',
        body: JSON.stringify({ userId }),
      });
      const msg = res.reset
        ? 'Enrolment record cleared — the member can enrol a new authenticator at next sign-in.'
        : 'Nothing to clear: that account has no recorded enrolment.';
      setMessage(msg);
      toast.push('Authenticator enrolment reset', { description: msg, tone: 'success' });
      setConfirmReset(null);
    } catch (error) {
      const err = describe(error);
      setFailure(err);
      toast.push('Reset refused', { description: err, tone: 'error' });
    } finally {
      setRecoveryBusy(false);
    }
  }

  const roleIds = catalog.data?.items?.map(role => role.id) ?? Object.keys(ROLE_LABEL);

  return (
    <>
      <PageHead
        eyebrow="PEOPLE & ACCESS CONTROL"
        title="Users & Staff"
        description="Manage BioCraft administrator membership, role assignments, and Super Admin authenticator recovery."
      />

      {staff.state === 'ready' && (
        <div className="ad-stats-grid ad-stats-grid--4">
          <StatCard icon="users" label="Total Staff" value={allStaff.length} caption="Provisioned accounts" tint="lavender" />
          <StatCard icon="checkCircle" label="Enabled" value={enabledCount} caption="Active sign-in access" tint="mint" />
          <StatCard icon="lock" label="Disabled" value={disabledCount} caption="Access suspended" tint="rose" />
          <StatCard icon="shieldCheck" label="Super Admins" value={superAdminCount} caption="Protected minimum ≥ 1" tint="sky" />
        </div>
      )}

      <Panel
        title="Staff directory"
        icon="users"
        description="Read from Admin membership. Every modification is versioned, step-up checked, and written to the audit log."
        aside={staff.state === 'ready' ? <Badge tone="green">{rows.length} shown</Badge> : undefined}
      >
        {staff.state !== 'ready' ? (
          <StateNotice state={staff.state} error={staff.error} reload={staff.reload} />
        ) : rows.length === 0 ? (
          <EmptyState
            icon="users"
            title={query || statusFilter !== 'all' ? 'No member matches your filters' : 'No staff accounts exist yet'}
            text={
              query || statusFilter !== 'all'
                ? 'Try another role name or clear your filters.'
                : 'No Admin accounts are provisioned in this database.'
            }
          />
        ) : (
          <>
            <Toolbar>
              <SearchField value={query} onChange={setQuery} placeholder="Search by member ID or role…" label="Search staff" />
              <SelectField value={statusFilter} onChange={v => setStatusFilter(v as 'all' | 'enabled' | 'disabled')} label="Filter by status">
                <option value="all">All statuses</option>
                <option value="enabled">Enabled only</option>
                <option value="disabled">Disabled only</option>
              </SelectField>
            </Toolbar>

            <div className="ad-table-wrap" tabIndex={0} role="region" aria-label="Staff table">
              <table className="ad-table">
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Roles</th>
                    <th>Access</th>
                    <th>Version</th>
                    <th className="ad-right">Manage</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(row => (
                    <tr key={row.user_id}>
                      <td>
                        <div className="ad-member-cell">
                          <span className="ad-mini-avatar" aria-hidden="true">
                            {(row.roles?.[0] ?? 'A').slice(0, 1).toUpperCase()}
                          </span>
                          <code className="ad-mono">{row.user_id}</code>
                        </div>
                      </td>
                      <td>
                        {(row.roles ?? []).length === 0 ? (
                          <em>no roles</em>
                        ) : (
                          <span className="ad-chip-row">
                            {(row.roles ?? []).map(role => (
                              <span className={`ad-chip ${role === 'super_admin' ? 'ad-chip--purple' : ''}`} key={role}>
                                {label(role)}
                              </span>
                            ))}
                          </span>
                        )}
                      </td>
                      <td>{row.enabled ? <Badge tone="green">Enabled</Badge> : <Badge tone="red">Disabled</Badge>}</td>
                      <td className="ad-nowrap">v{String(row.version)}</td>
                      <td className="ad-right">
                        <div className="ad-action-row ad-action-row--end">
                          <button type="button" className="ad-btn ad-btn--secondary ad-btn--sm" onClick={() => start(row)}>
                            Edit access
                          </button>
                          <button
                            type="button"
                            className="ad-btn ad-btn--ghost ad-btn--sm"
                            disabled={!row.enabled || recoveryBusy}
                            onClick={() => void issueRecovery(row.user_id)}
                          >
                            Recovery code
                          </button>
                          <button
                            type="button"
                            className="ad-btn ad-btn--ghost ad-btn--sm"
                            disabled={!row.enabled || recoveryBusy}
                            onClick={() => setConfirmReset(row)}
                          >
                            Reset 2FA
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {issuedCode && (
          <div className="ad-recovery-banner" role="status">
            <div className="ad-recovery-head">
              <strong>One-time recovery code for {issuedFor.slice(0, 12)}…</strong>
              <Badge tone="amber">Expires in 15 min</Badge>
            </div>
            <div className="ad-recovery-code-row">
              <code>{issuedCode}</code>
              <button
                type="button"
                className="ad-btn ad-btn--secondary ad-btn--sm"
                onClick={() => {
                  void navigator.clipboard?.writeText(issuedCode);
                  toast.push('Recovery code copied', { tone: 'success' });
                }}
              >
                <Icon name="copy" size={14} /> Copy
              </button>
              <button type="button" className="ad-btn ad-btn--danger ad-btn--sm" onClick={() => void revokeRecovery()} disabled={recoveryBusy}>
                Revoke grant
              </button>
            </div>
            <p className="ad-muted-copy">Share this out of band. It works once and will never be displayed again.</p>
          </div>
        )}

        <MessageBox message={message} failure={failure} />
      </Panel>

      <Panel title="Role permissions catalog" icon="shieldCheck" description="Authoritative roles and granted permission counts from bc_admin_v1">
        {catalog.state !== 'ready' ? (
          <StateNotice state={catalog.state} error={catalog.error} reload={catalog.reload} />
        ) : (
          <div className="ad-table-wrap" tabIndex={0} role="region" aria-label="Role catalog">
            <table className="ad-table">
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Purpose</th>
                  <th>Permissions</th>
                </tr>
              </thead>
              <tbody>
                {(catalog.data?.items ?? []).map(role => (
                  <tr key={role.id}>
                    <td><strong>{label(role.id)}</strong></td>
                    <td>{role.description}</td>
                    <td><Badge tone="purple">{(role.permissions ?? []).length} granted</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {/* Edit Staff Access Modal */}
      <Modal
        open={Boolean(editing && draft)}
        onClose={pending ? () => {} : () => { setEditing(null); setDraft(null); }}
        title="Edit Staff Access"
        subtitle={editing ? `Member ${editing.user_id} · version ${editing.version}` : ''}
        footer={
          <>
            <button type="button" className="ad-btn ad-btn--secondary" onClick={() => { setEditing(null); setDraft(null); }} disabled={pending}>
              Cancel
            </button>
            <button type="button" className="ad-btn ad-btn--primary" onClick={() => void save()} disabled={pending || !draft || draft.roles.length === 0}>
              {pending ? 'Saving…' : 'Save'}
            </button>
          </>
        }
      >
        {draft && (
          <div className="ad-form-grid">
            <Field label="Access status" hint="A disabled member keeps their role assignments but cannot sign in.">
              <select
                value={draft.enabled ? 'enabled' : 'disabled'}
                onChange={event => setDraft({ ...draft, enabled: event.target.value === 'enabled' })}
                aria-label="Access"
              >
                <option value="enabled">Enabled</option>
                <option value="disabled">Disabled</option>
              </select>
            </Field>
            <div className="ad-field ad-field--wide">
              <span>Assigned Roles</span>
              <div className="ad-chip-row" role="group" aria-label="Roles">
                {roleIds.map(role => {
                  const selected = draft.roles.includes(role);
                  return (
                    <button
                      key={role}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => toggleRole(role)}
                      className={`ad-role-toggle ${selected ? 'is-selected' : ''}`}
                    >
                      {selected && <Icon name="check" size={13} />}
                      <span>{label(role)}</span>
                    </button>
                  );
                })}
              </div>
              <small>
                At least one role is required. Promoting to Super Admin, editing yourself, or removing the last Super Admin is blocked in SQL.
              </small>
            </div>
            {draft.roles.length === 0 && (
              <div className="ad-inline-alert ad-inline-alert--error ad-field--wide" role="alert">
                <Icon name="alert" size={15} />
                <span>Choose at least one role before saving.</span>
              </div>
            )}
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(confirmReset)}
        onClose={() => setConfirmReset(null)}
        onConfirm={async () => {
          if (confirmReset) await resetEnrolment(confirmReset.user_id);
        }}
        title="Reset authenticator enrolment?"
        description={
          confirmReset
            ? `This clears the recorded TOTP enrolment for ${confirmReset.user_id.slice(0, 14)}… so the account returns to first-time authenticator setup.`
            : ''
        }
        consequence="Only run this after removing the lost factor at Supabase Auth. This action is permanently recorded in the audit log."
        confirmLabel="Clear enrolment record"
        tone="warning"
        busy={recoveryBusy}
      />
    </>
  );
}
