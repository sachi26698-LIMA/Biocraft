/**
 * Live Content & SEO — Drafts, Independent Review Queue, SEO Pages, and Publication History.
 * Enforces separation of duties, optimistic concurrency versions, searchable reviewer selection,
 * smart confirmation dialogs before publishing, and toast notifications.
 */
import { useCallback, useState } from 'react';
import { useAdminContext } from '../context';
import { Icon } from '../icons';
import { ConfirmDialog, Modal } from '../ui/Modal';
import { SearchableSelect } from '../ui/SearchableSelect';
import { useToast } from '../ui/Toast';
import { SeoPages } from './Catalog';
import PublishedLibrary from './PublishedLibrary';
import { Badge, EmptyState, Field, MessageBox, PageHead, Panel, SegmentedControl, StatCard, StateNotice } from './common';
import { LANGUAGE_LABEL, STATE_LABEL, type DraftRow, type JobRow, type PublicationRow } from './types';
import { downloadCsv, formatDate, mutate, request, useLive } from './useLive';

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
    case 'FORBIDDEN':
      return 'The database refused this step: your account lacks permission or is not independent of this draft.';
    case 'STEP_UP_REQUIRED':
      return 'Your second factor is older than this step allows. Sign in again with your authenticator.';
    case 'CONFLICT':
      return 'This draft changed since this page was loaded. Reload and re-check before retrying.';
    case 'NOT_FOUND':
      return 'That draft or publication no longer exists.';
    case 'INVALID':
      return 'The request was rejected as invalid. Nothing was written.';
    default:
      return 'The step did not complete. Nothing was written.';
  }
}

export default function LiveContent() {
  const { openBioModal, refreshTick } = useAdminContext();
  const toast = useToast();

  const drafts = useLive<{ items: DraftRow[] }>('/bio-drafts?limit=50', refreshTick);
  const queue = useLive<{ items: DraftRow[] }>('/bio-review-queue?limit=50', refreshTick);
  const jobs = useLive<{ items: JobRow[] }>('/publication-jobs?limit=25', refreshTick);
  const staff = useLive<{ items: { user_id: string; enabled: boolean; roles: string[] | null }[] }>('/staff?limit=100');

  const [tab, setTab] = useState<'all' | 'drafts' | 'review' | 'seo' | 'jobs' | 'catalogue'>('all');
  const [openDraft, setOpenDraft] = useState<DraftRow | null>(null);
  const [picking, setPicking] = useState<string | null>(null);
  const [reviewer, setReviewer] = useState('');
  const [confirmPublish, setConfirmPublish] = useState<DraftRow | null>(null);
  const [history, setHistory] = useState<PublicationRow[] | null>(null);
  const [historyFor, setHistoryFor] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [failure, setFailure] = useState<string | null>(null);

  const reviewers = (staff.data?.items ?? []).filter(
    member =>
      member.enabled &&
      (member.roles ?? []).some(role => ['admin', 'content_manager', 'super_admin', 'moderator'].includes(role)),
  );

  const run = useCallback(
    async (key: string, work: () => Promise<string>) => {
      setBusy(key);
      setMessage(null);
      setFailure(null);
      try {
        const msg = await work();
        setMessage(msg);
        toast.push(msg, { tone: 'success' });
        drafts.reload();
        queue.reload();
        jobs.reload();
        return true;
      } catch (error) {
        const err = reason(error);
        setFailure(err);
        toast.push('Workflow action blocked', { description: err, tone: 'error' });
        return false;
      } finally {
        setBusy(null);
      }
    },
    [drafts, queue, jobs, toast],
  );

  async function submit(row: DraftRow) {
    const target = reviewer.trim();
    if (!target) {
      setFailure('Choose the reviewer who should inspect this draft.');
      return;
    }
    const ok = await run(`submit:${row.draft_id}`, async () => {
      await mutate(`/bio-drafts/${row.draft_id}/submit`, { expectedVersion: Number(row.row_version), reviewerId: target });
      return 'Sent for independent review.';
    });
    if (ok) {
      setPicking(null);
      setReviewer('');
    }
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
      const verb =
        result.action === 'created'
          ? 'A new bio row was created'
          : result.action === 'updated'
            ? 'The existing bio was updated'
            : result.action === 'archived'
              ? 'The bio was archived (hidden from guests)'
              : 'Existing identical text was reused';
      return `Published. ${verb}. Visible on the public site immediately.`;
    });
    setConfirmPublish(null);
    setPicking(null);
  }

  async function showHistory(row: DraftRow) {
    setHistoryFor(row.draft_id);
    setHistory(null);
    try {
      const jobsPage = await request<{ items: JobRow[] }>('/publication-jobs?limit=100');
      const job = (jobsPage.items ?? []).find(item => item.draft_id === row.draft_id);
      if (!job) {
        setHistory([]);
        return;
      }
      const page = await request<{ items: PublicationRow[] }>(`/publications?bio_id=${job.draft_id}&limit=50`).catch(() => ({
        items: [] as PublicationRow[],
      }));
      setHistory(page.items ?? []);
    } catch {
      setHistory([]);
    }
  }

  const draftItems = drafts.data?.items ?? [];
  const queueItems = queue.data?.items ?? [];
  const jobItems = jobs.data?.items ?? [];

  return (
    <>
      <PageHead
        eyebrow="EDITORIAL WORKFLOW"
        title="Content & SEO"
        description="Drafts pass through independent review before publishing to the live public website."
        actions={
          <button type="button" className="ad-btn ad-btn--primary" onClick={() => openBioModal()}>
            <Icon name="plus" size={15} /> New Bio Draft
          </button>
        }
      />

      <div className="ad-stats-grid ad-stats-grid--3">
        <StatCard icon="fileText" label="My drafts" value={draftItems.length} caption="Private & submitted" tint="lavender" />
        <StatCard icon="clock" label="Waiting review" value={queueItems.length} caption="Assigned to reviewers" tint="amber" />
        <StatCard icon="checkCircle" label="Publication jobs" value={jobItems.length} caption="Recorded publish evidence" tint="mint" />
      </div>

      <div className="ad-tab-row">
        <SegmentedControl
          ariaLabel="Content and SEO sections"
          value={tab}
          onChange={setTab}
          options={[
            { value: 'all', label: 'All Views' },
            { value: 'drafts', label: 'My Drafts', count: draftItems.length },
            { value: 'review', label: 'Review Queue', count: queueItems.length },
            { value: 'seo', label: 'SEO Pages' },
            { value: 'catalogue', label: 'Published Catalogue' },
            { value: 'jobs', label: 'Publications', count: jobItems.length },
          ]}
        />
      </div>

      {(tab === 'all' || tab === 'drafts') && (
        <Panel
          title="My drafts"
          icon="fileText"
          description="Every draft this account can see, with optimistic version tracking"
          aside={drafts.state === 'ready' ? <Badge tone="green">{draftItems.length} drafts</Badge> : undefined}
        >
          {drafts.state !== 'ready' ? (
            <StateNotice state={drafts.state} error={drafts.error} reload={drafts.reload} />
          ) : draftItems.length === 0 ? (
            <EmptyState
              icon="fileText"
              title="No drafts yet"
              text="Create a private draft using the Rich Bio Editor. Drafts stay invisible to guests until reviewed and published."
              action={
                <button type="button" className="ad-btn ad-btn--primary ad-btn--sm" onClick={() => openBioModal()}>
                  <Icon name="plus" size={14} /> Create first draft
                </button>
              }
            />
          ) : (
            <>
              <div className="ad-table-wrap" tabIndex={0} role="region" aria-label="Drafts table">
                <table className="ad-table">
                  <thead>
                    <tr>
                      <th>Collection</th>
                      <th>State</th>
                      <th>Language</th>
                      <th>Chars</th>
                      <th>Version</th>
                      <th>Updated</th>
                      <th>Workflow</th>
                    </tr>
                  </thead>
                  <tbody>
                    {draftItems.map(row => (
                      <tr key={row.draft_id}>
                        <td><strong>{row.resource_key}</strong></td>
                        <td><Badge tone={STATE_TONE[row.state] ?? 'neutral'}>{STATE_LABEL[row.state] ?? row.state}</Badge></td>
                        <td>{LANGUAGE_LABEL[row.payload?.language] ?? row.payload?.language ?? '—'}</td>
                        <td className="ad-num">{row.payload?.content?.length ?? 0}</td>
                        <td className="ad-nowrap">v{String(row.row_version)}</td>
                        <td className="ad-nowrap">{formatDate(row.created_at)}</td>
                        <td>
                          <div className="ad-action-row">
                            <button type="button" className="ad-btn ad-btn--ghost ad-btn--sm" onClick={() => setOpenDraft(row)}>
                              Read text
                            </button>
                            {row.state === 'draft' && (
                              <>
                                <button
                                  type="button"
                                  className="ad-btn ad-btn--secondary ad-btn--sm"
                                  onClick={() =>
                                    openBioModal({
                                      draftId: row.draft_id,
                                      expectedVersion: Number(row.row_version),
                                      key: row.resource_key,
                                      content: row.payload?.content ?? '',
                                      language: row.payload?.language ?? 'en',
                                      platform: row.payload?.platform ?? 'instagram',
                                      active: row.payload?.active ?? true,
                                      featured: row.payload?.featured ?? false,
                                    })
                                  }
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  className="ad-btn ad-btn--primary ad-btn--sm"
                                  onClick={() => {
                                    setPicking(picking === row.draft_id ? null : row.draft_id);
                                    setReviewer('');
                                  }}
                                >
                                  {picking === row.draft_id ? 'Cancel' : 'Send for review'}
                                </button>
                              </>
                            )}
                            {row.state === 'approved' && (
                              <button
                                type="button"
                                className="ad-btn ad-btn--primary ad-btn--sm"
                                onClick={() => setConfirmPublish(row)}
                                disabled={busy !== null}
                              >
                                {busy === `publish:${row.draft_id}` ? 'Publishing…' : 'Publish'}
                              </button>
                            )}
                            {row.state === 'published' && (
                              <button type="button" className="ad-btn ad-btn--secondary ad-btn--sm" onClick={() => void showHistory(row)}>
                                History
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {picking && (() => {
                const row = draftItems.find(item => item.draft_id === picking);
                if (!row) return null;
                return (
                  <div className="ad-detail" role="group" aria-label="Choose a reviewer">
                    <h3>Assign an independent reviewer</h3>
                    <p className="ad-muted-copy">
                      The reviewer must be someone other than the author. Separation of duties is enforced inside PostgreSQL.
                    </p>
                    {reviewers.length === 0 ? (
                      <div className="ad-inline-alert ad-inline-alert--error" role="alert">
                        <Icon name="alert" size={16} />
                        <span>No eligible reviewer available. Another enabled staff member with review permission is required.</span>
                      </div>
                    ) : (
                      <div style={{ maxWidth: 420, marginTop: 12 }}>
                        <Field label="Reviewer" hint="Only enabled members with a reviewing role are listed.">
                          <SearchableSelect
                            label="Reviewer"
                            placeholder="Choose a reviewer…"
                            searchPlaceholder="Search staff ID or role…"
                            value={reviewer}
                            onChange={setReviewer}
                            options={reviewers.map(m => ({
                              value: m.user_id,
                              label: m.user_id.slice(0, 14) + '…',
                              sublabel: (m.roles ?? []).join(', '),
                            }))}
                          />
                        </Field>
                        <div className="ad-action-row" style={{ marginTop: 12 }}>
                          <button
                            type="button"
                            className="ad-btn ad-btn--primary ad-btn--sm"
                            onClick={() => void submit(row)}
                            disabled={busy !== null || !reviewer}
                          >
                            {busy === `submit:${row.draft_id}` ? 'Submitting…' : 'Submit for review'}
                          </button>
                          <button type="button" className="ad-btn ad-btn--secondary ad-btn--sm" onClick={() => setPicking(null)}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </>
          )}
          <MessageBox message={message} failure={failure} />
        </Panel>
      )}

      {(tab === 'all' || tab === 'review') && (
        <Panel
          title="Waiting for review"
          icon="clock"
          description="Drafts submitted for an independent decision. Authors cannot approve their own drafts."
          aside={queue.state === 'ready' ? <Badge tone="amber">{queueItems.length} waiting</Badge> : undefined}
        >
          {queue.state !== 'ready' ? (
            <StateNotice state={queue.state} error={queue.error} reload={queue.reload} />
          ) : queueItems.length === 0 ? (
            <EmptyState icon="checkCircle" title="Nothing waiting" text="Submitted drafts awaiting independent review appear here." />
          ) : (
            <div className="ad-table-wrap" tabIndex={0} role="region" aria-label="Review queue">
              <table className="ad-table">
                <thead>
                  <tr>
                    <th>Collection</th>
                    <th>Author</th>
                    <th>State</th>
                    <th>Submitted</th>
                    <th>Decision</th>
                  </tr>
                </thead>
                <tbody>
                  {queueItems.map(row => (
                    <tr key={row.draft_id}>
                      <td><strong>{row.resource_key}</strong></td>
                      <td><code className="ad-mono">{row.author_id ?? '—'}</code></td>
                      <td><Badge tone={STATE_TONE[row.state] ?? 'neutral'}>{STATE_LABEL[row.state] ?? row.state}</Badge></td>
                      <td className="ad-nowrap">{formatDate(row.created_at)}</td>
                      <td>
                        <div className="ad-action-row">
                          <button type="button" className="ad-btn ad-btn--ghost ad-btn--sm" onClick={() => setOpenDraft(row)}>
                            Inspect
                          </button>
                          <button
                            type="button"
                            className="ad-btn ad-btn--primary ad-btn--sm"
                            onClick={() => void review(row, 'approve')}
                            disabled={busy !== null}
                          >
                            {busy === `approve:${row.draft_id}` ? 'Approving…' : 'Approve'}
                          </button>
                          <button
                            type="button"
                            className="ad-btn ad-btn--danger ad-btn--sm"
                            onClick={() => void review(row, 'reject')}
                            disabled={busy !== null}
                          >
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
      )}

      {(tab === 'all' || tab === 'seo') && <SeoPages />}
      {tab === 'catalogue' && <PublishedLibrary />}

      {historyFor && (
        <Panel
          title="Publication history"
          icon="audit"
          description="Append-only record of what this draft published."
          aside={
            <button type="button" className="ad-btn ad-btn--secondary ad-btn--sm" onClick={() => { setHistoryFor(null); setHistory(null); }}>
              Close
            </button>
          }
        >
          {history === null ? (
            <StateNotice state="loading" />
          ) : history.length === 0 ? (
            <EmptyState title="No publication recorded for this id" text="Publication history is recorded against the published bio row." />
          ) : (
            <>
              <div className="ad-table-wrap" tabIndex={0} role="region" aria-label="Publication history table">
                <table className="ad-table">
                  <thead>
                    <tr>
                      <th>Action</th>
                      <th>Bio</th>
                      <th>By</th>
                      <th>When</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map(entry => (
                      <tr key={String(entry.id)}>
                        <td>
                          <Badge tone={entry.action === 'archived' ? 'red' : entry.action === 'restored' ? 'amber' : 'green'}>
                            {entry.action}
                          </Badge>
                        </td>
                        <td><code className="ad-mono">{entry.bio_id}</code></td>
                        <td><code className="ad-mono">{entry.actor_id}</code></td>
                        <td className="ad-nowrap">{formatDate(entry.published_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="ad-action-row" style={{ marginTop: 12 }}>
                <button
                  type="button"
                  className="ad-btn ad-btn--secondary ad-btn--sm"
                  onClick={() =>
                    downloadCsv('publications.csv', history as unknown as Record<string, unknown>[], [
                      'id', 'bio_id', 'draft_id', 'action', 'actor_id', 'published_at',
                    ])
                  }
                >
                  <Icon name="download" size={14} /> Download CSV
                </button>
              </div>
            </>
          )}
        </Panel>
      )}

      {(tab === 'all' || tab === 'jobs') && (
        <Panel
          title="Publication jobs"
          icon="checkCircle"
          description="Synchronous publication audit evidence recorded in the same transaction that writes to public.bios."
        >
          {jobs.state !== 'ready' ? (
            <StateNotice state={jobs.state} error={jobs.error} reload={jobs.reload} />
          ) : jobItems.length === 0 ? (
            <EmptyState icon="checkCircle" title="Nothing published yet" text="Each successful publish records one immutable row here." />
          ) : (
            <div className="ad-table-wrap" tabIndex={0} role="region" aria-label="Publication jobs">
              <table className="ad-table">
                <thead>
                  <tr>
                    <th>Collection</th>
                    <th>Target</th>
                    <th>State</th>
                    <th>Completed</th>
                  </tr>
                </thead>
                <tbody>
                  {jobItems.map(job => (
                    <tr key={job.id}>
                      <td><strong>{job.resource_key}</strong></td>
                      <td><Badge tone="blue">{job.target_environment}</Badge></td>
                      <td>
                        <Badge tone={job.state === 'succeeded' ? 'green' : job.state === 'failed' ? 'red' : 'amber'}>
                          {job.state}
                        </Badge>
                      </td>
                      <td className="ad-nowrap">{formatDate(job.completed_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      )}

      {/* Read Draft Modal */}
      <Modal
        open={Boolean(openDraft)}
        onClose={() => setOpenDraft(null)}
        title={openDraft ? `Draft · ${openDraft.resource_key}` : 'Draft text'}
        subtitle="Full draft payload stored privately in bc_admin_v1"
        footer={
          <button type="button" className="ad-btn ad-btn--secondary" onClick={() => setOpenDraft(null)}>
            Close
          </button>
        }
      >
        {openDraft && (
          <div role="region" aria-label="Draft text">
            <dl className="ad-detail-grid">
              <dt>State</dt><dd><Badge tone={STATE_TONE[openDraft.state] ?? 'neutral'}>{STATE_LABEL[openDraft.state] ?? openDraft.state}</Badge></dd>
              <dt>Language</dt><dd>{LANGUAGE_LABEL[openDraft.payload?.language] ?? '—'}</dd>
              <dt>Platform</dt><dd>{openDraft.payload?.platform ?? '—'}</dd>
              <dt>Visibility</dt><dd>{openDraft.payload?.active ? 'Visible when published' : 'Archived when published'}</dd>
              <dt>Bio Text</dt><dd className="ad-bio-text">{openDraft.payload?.content}</dd>
            </dl>
          </div>
        )}
      </Modal>

      {/* Smart Publish Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(confirmPublish)}
        onClose={() => setConfirmPublish(null)}
        onConfirm={async () => {
          if (confirmPublish) await publish(confirmPublish, null);
        }}
        title="Publish draft to public BioCraft?"
        description={
          confirmPublish
            ? `This will publish "${confirmPublish.resource_key}" (${LANGUAGE_LABEL[confirmPublish.payload?.language] ?? confirmPublish.payload?.language}) directly into public.bios.`
            : ''
        }
        consequence="The change is visible on the live public website immediately and permanently logged in the append-only audit trail."
        confirmLabel="Publish live"
        tone="primary"
        busy={Boolean(confirmPublish && busy === `publish:${confirmPublish.draft_id}`)}
      />
    </>
  );
}
