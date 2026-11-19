import { useState, type ReactNode } from 'react';
import { useAdminContext } from '../context';
import { handleAnchorClick } from '../../lib/router';
import Analytics from './Analytics';
import { SeoPages } from './Catalog';
import ImportPreflight from './ImportPreflight';
import BioLibraryDashboard from './BioLibrary';
import bioRecords from '../../data/bios/records.json';
import bioIndex from '../../data/bios/index.json';
import { Entries, type Kind } from './PublishedLibrary';
import { Badge, CursorPager, EmptyState, PageHead, Panel, StateNotice } from './common';
import type { BackupRow, NotificationRow, RoleRow } from './types';
import { describeError, formatDate, mutate, useLive, usePaged } from './useLive';

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

type Source = {id: string; name: string; license_code: string; status: string; last_sync_count: number | null; last_sync_at: string | null; next_cursor: string};
type SyncJob = {id: string; source_name: string; status: string; items_seen: number; items_inserted: number; items_updated: number; items_skipped: number; finished_at: string | null};
function SourceDirectory() {
  const sources = usePaged<Source>('/data-sources?limit=25', row => row?.next_cursor ?? null);
  const jobs = useLive<{items: SyncJob[]}>('/sync-jobs?limit=25');
  return <>
    <Panel title="Registered sources" description="Registration does not mean a source has synced. Counts and times come from the last successful run." aside={<button className="ad-btn ad-btn--secondary" onClick={() => { sources.reload(); jobs.reload(); }}>Refresh</button>}>
      <StateNotice state={sources.state} error={sources.error} reload={sources.reload} />
      {sources.state === 'ready' && (sources.data?.length ? <>
        <Table title="Registered sources" columns={['Source', 'Licence', 'Status', 'Rows checked', 'Last success']}>
          {sources.data.map(row => <tr key={row.id}><th scope="row">{row.name}</th><td>{row.license_code}</td><td>{row.status}</td><td>{row.last_sync_count ?? '—'}</td><td>{row.last_sync_at ? formatDate(row.last_sync_at) : 'Never'}</td></tr>)}
        </Table>
        <CursorPager count={sources.data.length} hasNext={sources.hasMore} loading={sources.loadingMore} onNext={sources.loadMore} onReset={sources.reload} />
      </> : <EmptyState title="No registered sources" text="The registry returned no rows." />)}
      <p><Link to="/collections">Browse bio collection groups</Link></p>
    </Panel>
    <Panel title="Recent sync jobs" description="Latest 25 database jobs. Refreshing this page reads history; it does not start an import.">
      <StateNotice state={jobs.state} error={jobs.error} reload={jobs.reload} />
      {jobs.state === 'ready' && (jobs.data?.items.length ?
        <Table title="Recent sync jobs" columns={['Source', 'Result', 'Seen', 'New', 'Updated', 'Skipped', 'Finished']}>
          {jobs.data.items.map(row => <tr key={row.id}><th scope="row">{row.source_name}</th><td>{row.status}</td><td>{row.items_seen}</td><td>{row.items_inserted}</td><td>{row.items_updated}</td><td>{row.items_skipped}</td><td>{formatDate(row.finished_at)}</td></tr>)}
        </Table> : <EmptyState title="No sync jobs yet" text="No jobs have been recorded." />)}
    </Panel>
  </>;
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
    case 'captions': case 'hashtags': case 'fonts': case 'templates': case 'designs': case 'symbols': case 'emoji': case 'languages': content = <Panel title={`Published ${label.toLowerCase()}`}><Entries kind={key as Kind} /></Panel>; break;
    case 'seo': content = <SeoPages />; break;
    case 'content-intelligence': return <Analytics intelligence />;
    case 'data-sources': content = <SourceDirectory />; break;
    case 'notifications': content = <Notifications />; break;
    case 'roles': case 'permissions': content = <Roles matrix={key === 'permissions'} />; break;
    case 'db-management': content = <><StatusPanel mode={key} /><RecordedBackups /></>; break;
    case 'api-management': case 'vercel-status': case 'supabase-health': content = <StatusPanel mode={key} />; break;
    case 'imports': content = <ImportPreflight />; break;
    case 'bio-library': content = <BioLibraryDashboard records={bioRecords as never} index={bioIndex as never} />; break;
    case 'ai-configuration': content = <Panel title="AI integration not connected"><p>No provider is configured through this console. No prompts, credentials or content are sent to an AI service.</p></Panel>; break;
  }
  return <><PageHead eyebrow="ADMIN WORKSPACE" title={label} description={description} />{content}</>;
}
