import { useState, type ReactNode } from 'react';
import { useAdminContext } from '../context';
import { handleAnchorClick } from '../../lib/router';
import Analytics from './Analytics';
import { LiveCollections, SeoPages } from './Catalog';
import ImportPreflight from './ImportPreflight';
import { Entries, type Kind } from './PublishedLibrary';
import { Badge, EmptyState, PageHead, Panel, StateNotice } from './common';
import type { BackupRow, NotificationRow, RoleRow } from './types';
import { describeError, formatDate, mutate, useLive } from './useLive';

function Link({to, children}: {to: string; children: ReactNode}) {
  return <a className="ad-text-link" href={`/admin${to}`} onClick={handleAnchorClick}>{children}</a>;
}

function Table({title, columns, children}: {title: string; columns: string[]; children: ReactNode}) {
  return <div className="ad-table-wrap" role="region" aria-label={title} tabIndex={0}>
    <table className="ad-table"><thead><tr>{columns.map(column => <th scope="col" key={column}>{column}</th>)}</tr></thead><tbody>{children}</tbody></table>
  </div>;
}

function Roles({matrix}: {matrix: boolean}) {
  const list = useLive<{items: RoleRow[]}>('/roles');
  const roles = list.data?.items ?? [];
  const keys = Array.from(new Set(roles.flatMap(role => role.permissions ?? []))).sort();
  return <Panel title={matrix ? 'Granted permission matrix' : 'Live role catalog'} description={matrix ? 'Includes permissions granted to at least one role; unassigned permissions are not returned by this API.' : 'Role membership can be managed under Users & Staff. This view does not edit RBAC policy.'}>
    <StateNotice state={list.state} error={list.error} reload={list.reload} />
    {list.state === 'ready' && (roles.length === 0 ? <EmptyState title="No roles returned" text="The live role catalog returned no rows." /> : matrix ?
      <Table title="Granted permissions" columns={['Permission', 'Roles with this grant']}>
        {keys.map(permission => <tr key={permission}><th scope="row">{permission}</th><td>{roles.filter(role => role.permissions?.includes(permission)).map(role => role.id).join(', ')}</td></tr>)}
      </Table> : <Table title="Live roles" columns={['Role', 'Description', 'Granted permissions']}>
        {roles.map(role => <tr key={role.id}><th scope="row">{role.id}</th><td>{role.description}</td><td>{role.permissions?.length ?? 0}</td></tr>)}
      </Table>)}
    <p><Link to={matrix ? '/roles' : '/permissions'}>{matrix ? 'View roles' : 'View permissions'}</Link></p>
  </Panel>;
}

function Notifications() {
  const {session} = useAdminContext();
  const inbox = useLive<{items: NotificationRow[]}>('/notifications?limit=50');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const items = inbox.data?.items ?? [];
  async function markRead() {
    setBusy(true);
    setMessage('');
    try {
      const res = await mutate<{marked: number}>('/notifications/read', {});
      setMessage(`${res.marked} notifications marked as read.`);
      inbox.reload();
    } catch (error) { setMessage(describeError(error)); }
    finally { setBusy(false); }
  }
  return <Panel title="Recent inbox" description="Latest 50 records for this account; not a count of the full inbox." aside={
    <button type="button" className="ad-btn ad-btn--secondary" disabled={busy || session?.sharedWrites === false || !items.some(row => row.unread)} onClick={() => void markRead()}>Mark all read</button>
  }>
    <StateNotice state={inbox.state} error={inbox.error} reload={inbox.reload} />
    {message && <p role="status">{message}</p>}
    {inbox.state === 'ready' && (items.length === 0 ? <EmptyState title="No notifications returned" text="This account has no recent inbox records." /> :
      <Table title="Recent notifications" columns={['Category', 'Message', 'Received', 'Status']}>
        {items.map(row => <tr key={row.id}><td>{row.category}</td><td>{row.message}</td><td>{formatDate(row.created_at)}</td><td><Badge tone={row.unread ? 'amber' : 'neutral'}>{row.unread ? 'Unread' : 'Read'}</Badge></td></tr>)}
      </Table>)}
  </Panel>;
}

function RecordedBackups() {
  const list = useLive<{items: BackupRow[]}>('/backups?limit=25');
  const items = list.data?.items ?? [];
  return <Panel title="Recorded backups" description="Latest 25 recorded references; provider availability, actual snapshots and restoration are not checked here.">
    <StateNotice state={list.state} error={list.error} reload={list.reload} />
    {list.state === 'ready' && (items.length ? <Table title="Database backup records" columns={['Reference', 'Environment', 'Recorded state', 'Requested']}>
      {items.map(row => <tr key={row.id}><td>{row.provider_reference}</td><td>{row.environment}</td><td>{row.state}</td><td>{formatDate(row.requested_at)}</td></tr>)}
    </Table> : <EmptyState title="No backup records returned" text="There are no recent snapshot references in this directory." />)}
  </Panel>;
}

type Status = {database: string; auth: string; guest_content: string; runtime: string; revision: string | null; password_reset: boolean; shared_writes: boolean};
function StatusPanel({mode}: {mode: string}) {
  const status = useLive<Status>('/system/status');
  const s = status.state === 'ready' ? status.data : null;
  return <Panel title="Current runtime checks" aside={<button type="button" className="ad-btn ad-btn--secondary" onClick={status.reload}>Check again</button>}>
    <StateNotice state={status.state} error={status.error} reload={status.reload} />
    {s && <ul className="ad-health-list">
      {mode === 'vercel-status' ? <>
        <li>Environment: {s.runtime}</li><li>Build revision: {s.revision ?? 'Not reported'}</li>
        <li>Control-plane deployment state: not queried</li>
      </> : <>
        <li>Admin Postgres authorization: {s.database === 'ready' ? 'Verified' : 'Not verified'}</li>
        <li>Supabase Auth session: {s.auth === 'verified' ? 'Verified' : 'Not verified'}</li>
        <li>Guest catalogue REST: {s.guest_content === 'ready' ? 'Connected' : 'Unavailable'}</li>
        {mode === 'api-management' && <>
          <li>API version: v1</li><li>Shared writes: {s.shared_writes ? 'Subject to server permissions' : 'Disabled'}</li>
          <li>Password reset: {s.password_reset ? 'Enabled; mail delivery not checked' : 'Disabled'}</li>
        </>}
      </>}
    </ul>}
    {mode === 'supabase-health' && <p>Storage, Realtime, migration drift and email delivery are not measured by this check.</p>}
  </Panel>;
}

export default function ExtraModule({module, authorized}: {module: {key: string; label: string; description: string}; authorized: boolean}) {
  const {key, label, description} = module;
  let content: ReactNode;
  if (!authorized) content = <Panel title="Live Admin access required"><p>Sign in to an enabled Admin backend to use this module. No live data or controls are available in this view.</p><Link to="/login">Go to Admin sign-in</Link></Panel>;
  else switch (key) {
    case 'captions': case 'hashtags': case 'fonts': content = <Panel title={`Published ${label.toLowerCase()}`}><Entries kind={key as Kind} /></Panel>; break;
    case 'seo': content = <SeoPages />; break;
    case 'content-intelligence': return <Analytics intelligence />;
    case 'data-sources': content = <><p>These are existing bio provenance groups, not external source connections.</p><LiveCollections embedded /></>; break;
    case 'notifications': content = <Notifications />; break;
    case 'roles': case 'permissions': content = <Roles matrix={key === 'permissions'} />; break;
    case 'db-management': content = <><StatusPanel mode={key} /><RecordedBackups /></>; break;
    case 'api-management': case 'vercel-status': case 'supabase-health': content = <StatusPanel mode={key} />; break;
    case 'imports': content = <ImportPreflight />; break;
    case 'templates': content = <Panel title="Template store not connected"><p>A reviewed template store and publication workflow are not available yet. This module does not display placeholder records.</p></Panel>; break;
    case 'ai-configuration': content = <Panel title="AI integration not connected"><p>No provider is configured through this console. No prompts, credentials or content are sent to an AI service.</p></Panel>; break;
  }
  return <><PageHead eyebrow="ADMIN WORKSPACE" title={label} description={description} />{content}</>;
}
