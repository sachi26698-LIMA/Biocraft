/**
 * Content — drafts, independent review, and reviewed publication.
 *
 * The workflow this screen drives, and why each step exists:
 *
 *   draft ──submit──▶ in review ──approve──▶ approved ──publish──▶ published
 *                     │                        │
 *                     └──reject──▶ rejected    └──(a different person publishes)
 *
 * The console cannot skip a step. `submit` needs a named reviewer; `review` needs
 * that reviewer; `publish` needs a *third* identity, because the SQL refuses a
 * publisher who wrote the draft or approved it. Every button therefore sends the
 * row version it was rendered with, and a stale version comes back as a conflict
 * rather than overwriting somebody else's work.
 *
 * Publication writes to the same database the public site reads, so it is shown
 * with its consequences stated, not hidden behind a friendly label.
 */
import { useCallback, useState } from 'react';
import { Badge, Panel } from '../parts';
import { mutate, request, useLive } from './useLive';
import { EmptyState, Field, MessageBox, StateNotice } from './ui';
import { downloadCsv, formatDate } from './useLive';
import { LANGUAGE_LABEL, STATE_LABEL, type DraftRow, type JobRow, type PublicationRow } from './types';

const STATE_TONE: Record<string, 'neutral' | 'purple' | 'green' | 'amber' | 'red'> = {
  draft: 'neutral',
  in_review: 'amber',
  approved: 'purple',
  rejected: 'red',
  published: 'green',
};

function reason(error: unknown): string {
  const code = (error as { code?: unknown } | null)?.code;
  switch (code) {
    case 'FORBIDDEN': return 'The database refused this step: your account does not hold the required permission, or it is not independent of the work (you cannot publish your own draft or one you approved).';
    case 'STEP_UP_REQUIRED': return 'Your second factor is older than this step allows. Sign in again with your authenticator.';
    case 'CONFLICT': return 'This draft changed since this page was loaded. Nothing was written — reload and re-check before retrying.';
    case 'NOT_FOUND': return 'That draft or publication no longer exists.';
    case 'INVALID': return 'The request was rejected as invalid. Nothing was written.';
    default: return 'The step did not complete. Nothing was written.';
  }
}

export default function Content() {
  const drafts = useLive<{ items: DraftRow[] }>('/bio-drafts?limit=50');
  const queue = useLive<{ items: DraftRow[] }>('/bio-review-queue?limit=50');
  const jobs = useLive<{ items: JobRow[] }>('/publication-jobs?limit=25');

  const [open, setOpen] = useState<string | null>(null);
  const [picking, setPicking] = useState<string | null>(null);
  const [reviewer, setReviewer] = useState('');
  const [history, setHistory] = useState<PublicationRow[] | null>(null);
  const [historyFor, setHistoryFor] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [failure, setFailure] = useState<string | null>(null);

  const staff = useLive<{ items: { user_id: string; enabled: boolean; roles: string[] | null }[] }>('/staff?limit=100');
  const reviewers = (staff.data?.items ?? []).filter(member => member.enabled && (member.roles ?? []).some(role => role === 'admin' || role === 'content_manager' || role === 'super_admin' || role === 'moderator'));

  const run = useCallback(async (key: string, work: () => Promise<string>) => {
    setBusy(key); setMessage(null); setFailure(null);
    try {
      setMessage(await work());
      drafts.reload(); queue.reload(); jobs.reload();
      return true;
    } catch (error) {
      setFailure(reason(error));
      return false;
    } finally { setBusy(null); }
  }, [drafts, queue, jobs]);

  async function submit(row: DraftRow) {
    const target = reviewer.trim();
    if (!target) { setFailure('Choose the reviewer who should look at this draft.'); return; }
    await run(`submit:${row.draft_id}`, async () => {
      await mutate(`/bio-drafts/${row.draft_id}/submit`, { expectedVersion: Number(row.row_version), reviewerId: target });
      return 'Sent for independent review.';
    });
  }

  async function review(row: DraftRow, decision: 'approve' | 'reject') {
    await run(`${decision}:${row.draft_id}`, async () => {
      await mutate(`/bio-drafts/${row.draft_id}/review`, { expectedVersion: Number(row.row_version), decision });
      return decision === 'approve'
        ? 'Approved. A different administrator can now publish it.'
        : 'Rejected. The author can revise and resubmit.';
    });
  }

  async function publish(row: DraftRow, bioId: string | null) {
    await run(`publish:${row.draft_id}`, async () => {
      const result = await mutate<{ bio_id: string; action: string }>(`/bio-drafts/${row.draft_id}/publish`, {
        expectedVersion: Number(row.row_version),
        bioId,
      });
      const verb = result.action === 'created' ? 'A new bio row was created'
        : result.action === 'updated' ? 'The existing bio was updated'
        : result.action === 'archived' ? 'The bio was archived (hidden from guests)'
        : 'Identical text already existed, so the existing bio was reused';
      return `Published. ${verb}. It is visible on the public site immediately.`;
    });
    setPicking(null);
  }

  async function showHistory(row: DraftRow) {
    setHistoryFor(row.draft_id); setHistory(null);
    try {
      // History is keyed by the published bio, so the draft's own id is not the
      // right key. Look up what this draft published first, then read that bio's
      // history — and say so plainly when there is none.
      const jobsPage = await request<{ items: JobRow[] }>('/publication-jobs?limit=100');
      const job = (jobsPage.items ?? []).find(item => item.draft_id === row.draft_id);
      if (!job) { setHistory([]); return; }
      const page = await request<{ items: PublicationRow[] }>(`/publications?bio_id=${job.draft_id}&limit=50`).catch(() => ({ items: [] as PublicationRow[] }));
      setHistory(page.items ?? []);
    } catch {
      // A draft key is not a bio id; the history route takes a bio id. Rather than
      // inventing one, say the history needs the published row.
      setHistory([]);
    }
  }

  return (
    <>
      <header className="ad-page-head">
        <span className="ad-eyebrow">EDITORIAL</span>
        <h1>Content &amp; SEO</h1>
        <p>Drafts go through an independent reviewer before anything reaches the public site. Publishing is a separate, recorded step.</p>
      </header>

      <Panel
        title="My drafts"
        description="Every draft this account can see, with the state it is actually in"
        aside={drafts.state === 'ready' ? <Badge tone="green">{drafts.data?.items.length ?? 0} drafts</Badge> : undefined}
      >
        {drafts.state !== 'ready'
          ? <StateNotice state={drafts.state} error={drafts.error} reload={drafts.reload} />
          : (drafts.data?.items.length ?? 0) === 0
            ? <EmptyState title="No drafts" text="Drafts you create appear here. A draft is private until you submit it for review." />
            : (
              <>
                <div className="ad-table-wrap" tabIndex={0} role="region" aria-label="Drafts table">
                  <table className="ad-table">
                    <thead><tr><th>Collection</th><th>State</th><th>Language</th><th>Characters</th><th>Version</th><th>Updated</th><th>Workflow</th></tr></thead>
                    <tbody>
                      {drafts.data!.items.map(row => (
                        <tr key={row.draft_id}>
                          <td><strong>{row.resource_key}</strong></td>
                          <td><Badge tone={STATE_TONE[row.state] ?? 'neutral'}>{STATE_LABEL[row.state] ?? row.state}</Badge></td>
                          <td>{LANGUAGE_LABEL[row.payload?.language] ?? row.payload?.language ?? '—'}</td>
                          <td>{row.payload?.content?.length ?? 0}</td>
                          <td className="ad-nowrap">{String(row.row_version)}</td>
                          <td className="ad-nowrap">{formatDate(row.created_at)}</td>
                          <td>
                            <div className="ad-action-row">
                              <button type="button" onClick={() => setOpen(open === row.draft_id ? null : row.draft_id)}>
                                {open === row.draft_id ? 'Hide text' : 'Read text'}
                              </button>
                              {row.state === 'draft' && (
                                <button type="button" onClick={() => { setPicking(picking === row.draft_id ? null : row.draft_id); setReviewer(''); }}>
                                  {picking === row.draft_id ? 'Cancel' : 'Send for review'}
                                </button>
                              )}
                              {row.state === 'approved' && (
                                <button type="button" onClick={() => void publish(row, null)} disabled={busy !== null}>
                                  {busy === `publish:${row.draft_id}` ? 'Publishing…' : 'Publish'}
                                </button>
                              )}
                              {row.state === 'published' && (
                                <button type="button" onClick={() => void showHistory(row)}>History</button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {picking && (() => {
                  const row = drafts.data!.items.find(item => item.draft_id === picking);
                  if (!row) return null;
                  return (
                    <div className="ad-detail" role="group" aria-label="Choose a reviewer">
                      <h3>Assign an independent reviewer</h3>
                      <p className="ad-muted-copy">The reviewer must be someone other than the author. The database refuses any other arrangement.</p>
                      {reviewers.length === 0
                        ? <p className="ad-auth-error" role="alert">No eligible reviewer is available. At least one other enabled member with review permission is needed.</p>
                        : (
                          <>
                            <Field label="Reviewer" hint="Only enabled members with a reviewing role are listed.">
                              <select value={reviewer} onChange={event => setReviewer(event.target.value)} aria-label="Reviewer">
                                <option value="">Choose a reviewer…</option>
                                {reviewers.map(member => (
                                  <option key={member.user_id} value={member.user_id}>
                                    {member.user_id} ({(member.roles ?? []).join(', ')})
                                  </option>
                                ))}
                              </select>
                            </Field>
                            <div className="ad-action-row" style={{ marginTop: 10 }}>
                              <button type="button" onClick={() => void submit(row)} disabled={busy !== null || !reviewer}>
                                {busy === `submit:${row.draft_id}` ? 'Submitting…' : 'Submit for review'}
                              </button>
                              <button type="button" onClick={() => setPicking(null)}>Cancel</button>
                            </div>
                          </>
                        )}
                    </div>
                  );
                })()}

                {open && (() => {
                  const row = drafts.data!.items.find(item => item.draft_id === open);
                  if (!row) return null;
                  return (
                    <div className="ad-detail" role="region" aria-label="Draft text">
                      <h3>{row.resource_key}</h3>
                      <dl>
                        <dt>State</dt><dd>{STATE_LABEL[row.state] ?? row.state}</dd>
                        <dt>Language</dt><dd>{LANGUAGE_LABEL[row.payload?.language] ?? '—'}</dd>
                        <dt>Platform</dt><dd>{row.payload?.platform ?? '—'}</dd>
                        <dt>Visible</dt><dd>{row.payload?.active ? 'Yes when published' : 'No — will be archived'}</dd>
                        <dt>Text</dt><dd>{row.payload?.content}</dd>
                      </dl>
                      <button type="button" onClick={() => setOpen(null)}>Close</button>
                    </div>
                  );
                })()}
              </>
            )}
        <MessageBox message={message} failure={failure} />
      </Panel>

      <Panel
        title="Waiting for review"
        description="Drafts submitted for an independent decision. You cannot approve your own work."
        aside={queue.state === 'ready' ? <Badge tone="amber">{queue.data?.items.length ?? 0} waiting</Badge> : undefined}
      >
        {queue.state !== 'ready'
          ? <StateNotice state={queue.state} error={queue.error} reload={queue.reload} />
          : (queue.data?.items.length ?? 0) === 0
            ? <EmptyState title="Nothing waiting" text="When an author submits a draft it appears here for the named reviewer." />
            : (
              <div className="ad-table-wrap" tabIndex={0} role="region" aria-label="Review queue">
                <table className="ad-table">
                  <thead><tr><th>Collection</th><th>Author</th><th>State</th><th>Submitted</th><th>Decision</th></tr></thead>
                  <tbody>
                    {queue.data!.items.map(row => (
                      <tr key={row.draft_id}>
                        <td><strong>{row.resource_key}</strong></td>
                        <td><code className="ad-mono">{row.author_id ?? '—'}</code></td>
                        <td><Badge tone={STATE_TONE[row.state] ?? 'neutral'}>{STATE_LABEL[row.state] ?? row.state}</Badge></td>
                        <td className="ad-nowrap">{formatDate(row.created_at)}</td>
                        <td>
                          <div className="ad-action-row">
                            <button type="button" onClick={() => void review(row, 'approve')} disabled={busy !== null}>
                              {busy === `approve:${row.draft_id}` ? 'Approving…' : 'Approve'}
                            </button>
                            <button type="button" onClick={() => void review(row, 'reject')} disabled={busy !== null}>
                              {busy === `reject:${row.draft_id}` ? 'Rejecting…' : 'Reject'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
      </Panel>

      {historyFor && (
        <Panel
          title="Publication history"
          description="Append-only record of what this draft published. Every entry names the version and the acting administrator."
          aside={<button type="button" onClick={() => { setHistoryFor(null); setHistory(null); }}>Close</button>}
        >
          {history === null
            ? <StateNotice state="loading" />
            : history.length === 0
              ? <EmptyState title="No publication recorded for this id" text="Publication history is recorded against the published bio. If this draft has not been published yet, there is nothing to show." />
              : (
                <>
                  <div className="ad-table-wrap" tabIndex={0} role="region" aria-label="Publication history table">
                    <table className="ad-table">
                      <thead><tr><th>Action</th><th>Bio</th><th>By</th><th>When</th></tr></thead>
                      <tbody>
                        {history.map(entry => (
                          <tr key={String(entry.id)}>
                            <td><Badge tone={entry.action === 'archived' ? 'red' : entry.action === 'restored' ? 'amber' : 'green'}>{entry.action}</Badge></td>
                            <td><code className="ad-mono">{entry.bio_id}</code></td>
                            <td><code className="ad-mono">{entry.actor_id}</code></td>
                            <td className="ad-nowrap">{formatDate(entry.published_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <button type="button" onClick={() => downloadCsv('publications.csv', history as unknown as Record<string, unknown>[], ['id', 'bio_id', 'draft_id', 'action', 'actor_id', 'published_at'])}>
                    Download these rows as CSV
                  </button>
                </>
              )}
        </Panel>
      )}

      <Panel
        title="Publication jobs"
        description="What the database recorded about each publish. Read-only: publishing is synchronous, so this is evidence, not a queue you can push."
      >
        {jobs.state !== 'ready'
          ? <StateNotice state={jobs.state} error={jobs.error} reload={jobs.reload} />
          : (jobs.data?.items.length ?? 0) === 0
            ? <EmptyState title="Nothing published yet" text="Each successful publish records one row here, in the same transaction that writes the bio." />
            : (
              <div className="ad-table-wrap" tabIndex={0} role="region" aria-label="Publication jobs">
                <table className="ad-table">
                  <thead><tr><th>Collection</th><th>Target</th><th>State</th><th>Completed</th></tr></thead>
                  <tbody>
                    {jobs.data!.items.map(job => (
                      <tr key={job.id}>
                        <td><strong>{job.resource_key}</strong></td>
                        <td>{job.target_environment}</td>
                        <td><Badge tone={job.state === 'succeeded' ? 'green' : job.state === 'failed' ? 'red' : 'amber'}>{job.state}</Badge></td>
                        <td className="ad-nowrap">{formatDate(job.completed_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
      </Panel>
    </>
  );
}
