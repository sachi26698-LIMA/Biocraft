/**
 * Users — the staff directory and membership administration.
 *
 * This screen can change who may do what, so it is deliberately conservative:
 *
 *  - it shows the version the server sent with every row, and sends it back with
 *    each edit, so two administrators editing the same person cannot silently
 *    overwrite each other;
 *  - a refusal comes from the database (self-edit, last Super Admin, super
 *    promotion, stale version), and the message says which rule stopped it rather
 *    than "something went wrong";
 *  - disabling a member is a row edit like any other, not a separate destructive
 *    button that looks safer than it is;
 *  - recovery stays in the Staff module of the maintenance panel because it issues
 *    a credential, and mixing that into a table of checkboxes would bury it.
 */
import { useCallback, useMemo, useState } from 'react';
import { Badge, Panel } from '../parts';
import { mutate, useLive } from './useLive';
import { EmptyState, Field, MessageBox, SearchField, StateNotice, Toolbar } from './ui';
import type { RoleRow, StaffRow } from './types';

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

export default function Users() {
  // The staff endpoint is a single bounded page (limit 50) with no cursor, so this
  // asks for one page and says so rather than offering a "next" that leads nowhere.
  const staff = useLive<{ items: StaffRow[] }>('/staff?limit=50');
  const catalog = useLive<{ items: RoleRow[] }>('/roles');
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<Editable | null>(null);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [failure, setFailure] = useState<string | null>(null);

  const rows = useMemo(() => {
    const list = staff.data?.items ?? [];
    const needle = query.trim().toLowerCase();
    if (!needle) return list;
    return list.filter(row => row.user_id.toLowerCase().includes(needle)
      || (row.roles ?? []).some(role => label(role).toLowerCase().includes(needle) || role.includes(needle))
      || (row.enabled ? 'enabled active' : 'disabled').includes(needle));
  }, [staff.data, query]);

  const describe = useCallback((error: unknown): string => {
    const code = (error as { code?: unknown } | null)?.code;
    switch (code) {
      case 'FORBIDDEN': return 'Your account is not permitted to change membership.';
      case 'STEP_UP_REQUIRED': return 'Your second factor is older than this action allows. Sign in again with your authenticator.';
      case 'CONFLICT': return 'Someone else changed this member first. Reload the directory and try again — nothing was saved.';
      case 'INVALID': return 'Those roles are not accepted. Pick at least one role from the list.';
      default: return 'The change was not saved. Nothing was modified.';
    }
  }, []);

  async function save(row: StaffRow) {
    if (!draft) return;
    setPending(true); setMessage(null); setFailure(null);
    try {
      const result = await mutate<{ row_version: number }>('/staff', {
        userId: row.user_id,
        expectedVersion: Number(row.version),
        enabled: draft.enabled,
        roles: draft.roles,
      }, 'PATCH');
      setMessage(`Saved. ${row.user_id.slice(0, 8)} is now ${draft.enabled ? 'enabled' : 'disabled'} with ${draft.roles.length} role${draft.roles.length === 1 ? '' : 's'} (version ${result.row_version}).`);
      setEditing(null); setDraft(null);
      staff.reload();
    } catch (error) {
      setFailure(describe(error));
    } finally { setPending(false); }
  }

  function start(row: StaffRow) {
    setEditing(row.user_id);
    setDraft({ enabled: row.enabled, roles: [...(row.roles ?? [])] });
    setMessage(null); setFailure(null);
  }

  function toggleRole(role: string) {
    if (!draft) return;
    setDraft({
      ...draft,
      roles: draft.roles.includes(role) ? draft.roles.filter(item => item !== role) : [...draft.roles, role],
    });
  }

  const roleIds = catalog.data?.items?.map(role => role.id) ?? [];

  return (
    <>
      <header className="ad-page-head">
        <span className="ad-eyebrow">ACCESS CONTROL</span>
        <h1>Users</h1>
        <p>Everyone who may sign in to this console, what they are allowed to do, and whether their access is currently open.</p>
      </header>

      <Panel
        title="Staff directory"
        description="Read from Admin membership. Every change is versioned and audited."
        aside={staff.state === 'ready' ? <Badge tone="green">{rows.length} shown</Badge> : undefined}
      >
        {staff.state !== 'ready'
          ? <StateNotice state={staff.state} error={staff.error} reload={staff.reload} />
          : rows.length === 0
            ? <EmptyState
                title={query ? 'No member matches that search' : 'No staff accounts exist yet'}
                text={query
                  ? 'Try a role name such as "Admin", or clear the search to see the whole directory.'
                  : 'The directory is empty because no Admin account has been provisioned. Creating the first Super Admin is an approval step, not something this screen can do.'}
              />
            : (
              <>
                <Toolbar>
                  <SearchField value={query} onChange={setQuery} placeholder="Search by id, role or state" label="Search staff" />
                </Toolbar>
                <div className="ad-table-wrap" tabIndex={0} role="region" aria-label="Staff table">
                  <table className="ad-table">
                    <thead><tr><th>Member</th><th>Roles</th><th>Access</th><th>Version</th><th>Manage</th></tr></thead>
                    <tbody>
                      {rows.map(row => (
                        <tr key={row.user_id}>
                          <td><code className="ad-mono">{row.user_id}</code></td>
                          <td>
                            {(row.roles ?? []).length === 0
                              ? <em>no roles</em>
                              : <span className="ad-chip-row">{(row.roles ?? []).map(role => <span className="ad-chip" key={role}>{label(role)}</span>)}</span>}
                          </td>
                          <td>{row.enabled ? <Badge tone="green">Enabled</Badge> : <Badge tone="red">Disabled</Badge>}</td>
                          <td className="ad-nowrap">{String(row.version)}</td>
                          <td>
                            {editing === row.user_id
                              ? <div className="ad-action-row">
                                  <button type="button" onClick={() => void save(row)} disabled={pending || !draft || draft.roles.length === 0}>
                                    {pending ? 'Saving…' : 'Save'}
                                  </button>
                                  <button type="button" onClick={() => { setEditing(null); setDraft(null); }} disabled={pending}>Cancel</button>
                                </div>
                              : <button type="button" onClick={() => start(row)}>Edit access</button>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
        <MessageBox message={message} failure={failure} />
      </Panel>

      {editing && draft && (
        <Panel title="Editing access" description="Only the roles chosen here apply. Nothing is saved until you press Save.">
          <div className="ad-form-grid">
            <Field label="Access" hint="A disabled member keeps their roles but cannot sign in.">
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
              <span>Roles</span>
              <div className="ad-chip-row" role="group" aria-label="Roles">
                {(roleIds.length > 0 ? roleIds : Object.keys(ROLE_LABEL)).map(role => {
                  const selected = draft.roles.includes(role);
                  return (
                    <button
                      key={role}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => toggleRole(role)}
                      className="ad-chip"
                      style={selected ? { borderColor: 'var(--ad-purple)', color: 'var(--ad-purple)', fontWeight: 700 } : undefined}
                    >
                      {selected ? '✓ ' : ''}{label(role)}
                    </button>
                  );
                })}
              </div>
              <small>At least one role is required. Promoting someone to Super Admin, or removing the last one, is refused by the database even from this screen.</small>
            </div>
          </div>
          {draft.roles.length === 0 && <p className="ad-auth-error" role="alert">Choose at least one role before saving.</p>}
        </Panel>
      )}

      <Panel title="What each role may do" description="Read from the permission catalog, not from this screen's assumptions">
        {catalog.state !== 'ready'
          ? <StateNotice state={catalog.state} error={catalog.error} reload={catalog.reload} />
          : <div className="ad-table-wrap" tabIndex={0} role="region" aria-label="Role catalog">
              <table className="ad-table">
                <thead><tr><th>Role</th><th>Purpose</th><th>Permissions</th></tr></thead>
                <tbody>
                  {(catalog.data?.items ?? []).map(role => (
                    <tr key={role.id}>
                      <td><strong>{label(role.id)}</strong></td>
                      <td>{role.description}</td>
                      <td>{(role.permissions ?? []).length} granted</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>}
      </Panel>
    </>
  );
}
