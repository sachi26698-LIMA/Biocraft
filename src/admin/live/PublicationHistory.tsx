import { useState } from 'react';
import { useAdminContext } from '../context';
import { ConfirmDialog } from '../ui/Modal';
import { Badge, EmptyState, Panel, StateNotice } from './common';
import { describeError, formatDate, mutate, usePaged } from './useLive';
import type { PublicationRow } from './types';

const takeId = (entry: PublicationRow | null) => entry ? String(entry.id) : null;

export default function PublicationHistory({bioId, close}: {bioId: string; close?: () => void}) {
  const {session} = useAdminContext();
  const page = usePaged<PublicationRow>(`/publications?bio_id=${encodeURIComponent(bioId)}&limit=20`, takeId, 'before');
  const [chosen, setChosen] = useState<PublicationRow | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const canDraft = session?.sharedWrites !== false && session?.permissions.includes('content.draft');
  async function restore() {
    if (!chosen || busy) return;
    setBusy(true);
    try {
      await mutate(`/publications/${encodeURIComponent(String(chosen.id))}/revert`, {});
      setMessage('A private restore draft was opened. Find it under My drafts. The public bio was not changed.');
      setChosen(null);
    } catch (error) { setMessage(describeError(error)); setChosen(null); }
    finally { setBusy(false); }
  }
  return <Panel title="Publication history" description="This history is keyed by the public bio ID. Restoring a snapshot opens a new private draft that still requires review and publication." aside={close && <button type="button" className="ad-btn ad-btn--secondary" onClick={close}>Close history</button>}>
    <StateNotice state={page.state} error={page.error} reload={page.reload} />
    {page.state === 'ready' && (page.data?.length ? <div className="ad-table-wrap" role="region" aria-label="Publication history" tabIndex={0}>
      <table className="ad-table"><thead><tr><th>Snapshot</th><th>Action</th><th>Published</th><th>Restore</th></tr></thead>
        <tbody>{page.data.map(row => <tr key={String(row.id)}>
          <td style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere'}}>{row.payload?.content ?? '—'}</td>
          <td><Badge>{row.action}</Badge></td><td>{formatDate(row.published_at)}</td>
          <td>{canDraft ? <button type="button" className="ad-btn ad-btn--secondary ad-btn--sm" onClick={() => setChosen(row)}>Open restore draft</button> : 'Not available'}</td>
        </tr>)}</tbody>
      </table>
    </div> : <EmptyState title="No publication history" text="No editorial publication is recorded for this bio." />)}
    {page.state === 'ready' && page.error && <p role="status">{page.error}</p>}
    {page.hasMore && <button type="button" className="ad-btn ad-btn--secondary" disabled={page.loadingMore} onClick={page.loadMore}>{page.loadingMore ? 'Loading…' : page.error ? 'Retry page' : 'Load more snapshots'}</button>}
    {message && <p role="status">{message}</p>}
    <ConfirmDialog open={chosen !== null} onClose={() => setChosen(null)} onConfirm={restore} busy={busy}
      title="Open a restore draft?" description="This copies a recorded snapshot into a new draft. It does not restore or change the public bio until independent review and publication." confirmLabel="Open private draft" />
  </Panel>;
}
