/**
 * Preview Restricted modules — Honest fail-closed previews for Content & SEO,
 * Users & Staff, Analytics, Audit Logs, Security & Roles, Settings, and Backup & Recovery
 * when the Admin backend is not connected in Preview Mode.
 */
import { useMemo, useState } from 'react';
import { TOOLS } from '../../tools/registry';
import { Icon } from '../icons';
import { Badge, PageHead, Panel, SearchField, SelectField, Toolbar } from '../ui/Primitives';

const SECTIONS: Record<string, { eyebrow: string; title: string; description: string; panel: string; items: string[] }> = {
  users: {
    eyebrow: 'PEOPLE & ACCESS',
    title: 'Users & Staff',
    description: 'Manage administrator access, RBAC roles, and TOTP recovery from one secure place.',
    panel: 'User & Staff Management',
    items: ['Staff directory', 'Account status', '8-role RBAC matrix', 'TOTP recovery grants'],
  },
  content: {
    eyebrow: 'PUBLISHING',
    title: 'Content & SEO',
    description: 'Manage your site content with a secure independent-review and publishing workflow.',
    panel: 'Content & Publishing Workflow',
    items: ['Drafts & versioning', 'Two-person review queue', 'SEO metadata', 'Publication history'],
  },
  analytics: {
    eyebrow: 'INSIGHTS',
    title: 'Analytics',
    description: 'Understand inventory health and editorial throughput with real database measures.',
    panel: 'Live Metrics & Exports',
    items: ['Database inventory counts', 'Editorial throughput', 'CSV / JSON exports'],
  },
  'audit-logs': {
    eyebrow: 'ACCOUNTABILITY',
    title: 'Audit Logs',
    description: 'Tamper-evident append-only ledger of every privileged action.',
    panel: 'Append-Only Audit Trail',
    items: ['Keyset event history', 'Action & actor filters', 'SQL trigger immutability', 'CSV export'],
  },
  security: {
    eyebrow: 'PROTECTION & RBAC',
    title: 'Security & Roles',
    description: 'Keep access, AAL2 sessions, and server-side role permissions protected.',
    panel: 'Security Center',
    items: ['AAL2 TOTP enforcement', 'Active sessions & revocation', 'Server-side RBAC', 'Audit history'],
  },
  settings: {
    eyebrow: 'SYSTEM',
    title: 'Settings',
    description: 'Configure non-secret versioned workspace settings once the Admin service is connected.',
    panel: 'System Settings',
    items: ['Versioned config', 'Step-up confirmation', 'Operational maintenance'],
  },
  backup: {
    eyebrow: 'RESILIENCE',
    title: 'Backup & Recovery',
    description: 'Track provider snapshot references, restore verification records, and data health.',
    panel: 'Backup & Recovery Operations',
    items: ['Backup records', 'Restore verification', 'Data health checks', 'TOTP recovery'],
  },
};

function Blocked({ title, text, items }: { title: string; text: string; items: string[] }) {
  return (
    <Panel title={title} icon="lock" description={text} aside={<Badge tone="amber">Setup required</Badge>}>
      <div className="ad-blocked">
        <span className="ad-blocked-icon">
          <Icon name="lock" size={22} />
        </span>
        <div>
          <h3>Not connected yet</h3>
          <p>
            These capabilities require an approved, isolated Admin backend and server-side authorization. No live
            administrator session is active in this preview.
          </p>
          <div className="ad-blocked-list">
            {items.map(item => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </div>
    </Panel>
  );
}

export default function PreviewRestricted({ moduleKey }: { moduleKey: keyof typeof SECTIONS }) {
  const section = SECTIONS[moduleKey];
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('source');
  const [details, setDetails] = useState<string | null>(null);

  const seo = useMemo(() => {
    const rows = TOOLS.filter(t =>
      `${t.heading} ${t.path} ${t.title} ${t.description}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()),
    );
    if (sort === 'title') rows.sort((a, b) => a.title.localeCompare(b.title));
    return rows;
  }, [query, sort]);

  const selected = TOOLS.find(t => t.key === details);

  return (
    <>
      <PageHead eyebrow={section.eyebrow} title={section.title} description={section.description} />
      <Blocked title={section.panel} text="This module is not connected to a live Admin API in Preview mode." items={section.items} />

      {moduleKey === 'users' && (
        <Panel title="User directory" icon="users" description="Unavailable — no authenticated directory is connected.">
          <div className="ad-action-row">
            <button type="button" className="ad-btn ad-btn--secondary" disabled>Invite user</button>
            <button type="button" className="ad-btn ad-btn--secondary" disabled>Export users</button>
          </div>
          <p className="ad-muted-copy">
            User records, role changes, sessions and account controls cannot be queried or managed in this Preview.
            This is not an empty live directory.
          </p>
        </Panel>
      )}

      {moduleKey === 'content' && (
        <Panel
          title="Bundled tool SEO inventory"
          icon="search"
          description="Public tool metadata from this build only; not a live page or editable SEO registry."
          aside={<Badge>Read-only</Badge>}
        >
          <Toolbar>
            <SearchField value={query} onChange={setQuery} placeholder="Search bundled SEO" label="Search bundled SEO" />
            <SelectField value={sort} onChange={setSort} label="Sort SEO metadata">
              <option value="source">Bundled order</option>
              <option value="title">Title A–Z</option>
            </SelectField>
            <button type="button" className="ad-btn ad-btn--secondary" disabled>Edit SEO metadata</button>
          </Toolbar>

          <div className="ad-table-wrap" tabIndex={0} role="region" aria-label="Bundled tool SEO table">
            <table className="ad-table">
              <thead>
                <tr>
                  <th>Tool</th>
                  <th>Title</th>
                  <th>Route</th>
                  <th className="ad-right">Details</th>
                </tr>
              </thead>
              <tbody>
                {seo.map(t => (
                  <tr key={t.key}>
                    <td><strong>{t.heading}</strong></td>
                    <td>{t.title}</td>
                    <td><a className="ad-text-link" href={t.path}>{t.path}</a></td>
                    <td className="ad-right">
                      <button
                        type="button"
                        className="ad-btn ad-btn--ghost ad-btn--sm"
                        onClick={() => setDetails(t.key)}
                        aria-label={`View SEO details for ${t.heading}`}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!seo.length && <div className="ad-empty-table">No bundled tool metadata matches this search.</div>}
          </div>

          {selected && (
            <section className="ad-detail" aria-label="Bundled SEO details">
              <div className="ad-panel-head">
                <div>
                  <h3>{selected.heading}</h3>
                  <p>{selected.path}</p>
                </div>
                <button type="button" className="ad-btn ad-btn--secondary ad-btn--sm" onClick={() => setDetails(null)}>
                  Close SEO details
                </button>
              </div>
              <dl className="ad-detail-grid">
                <dt>Title</dt><dd>{selected.title}</dd>
                <dt>Description</dt><dd>{selected.description}</dd>
                <dt>Open Graph title</dt><dd>{selected.ogTitle}</dd>
                <dt>Open Graph description</dt><dd>{selected.ogDescription}</dd>
              </dl>
            </section>
          )}
        </Panel>
      )}

      {moduleKey === 'analytics' && (
        <Panel title="Analytics reports" icon="analytics" description="No telemetry source or reporting API is connected.">
          <div className="ad-action-row">
            <button type="button" className="ad-btn ad-btn--secondary" disabled>Export CSV</button>
            <button type="button" className="ad-btn ad-btn--secondary" disabled>Export JSON</button>
          </div>
          <p className="ad-muted-copy">
            Traffic, engagement, generation usage and performance are unavailable — not zero. Export requires an
            approved source, authorization and privacy review.
          </p>
        </Panel>
      )}

      {moduleKey === 'audit-logs' && (
        <Panel title="Audit log ledger" icon="audit" description="No live audit event source is connected in Preview mode.">
          <div className="ad-action-row">
            <button type="button" className="ad-btn ad-btn--secondary" disabled>Export audit log</button>
          </div>
          <p className="ad-muted-copy">
            When connected, every login, role edit, setting change, draft submission, review decision, and publication
            appears here in an append-only SQL ledger.
          </p>
        </Panel>
      )}

      {moduleKey === 'security' && (
        <>
          <Panel
            title="Proposed roles"
            icon="security"
            description="Design blueprint · no roles or permissions are enforced by this read-only preview screen."
          >
            <div className="ad-table-wrap" tabIndex={0} role="region" aria-label="Proposed role responsibilities">
              <table className="ad-table">
                <thead>
                  <tr>
                    <th>Proposed role</th>
                    <th>Intended responsibility</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td><strong>Super Admin</strong></td><td>Membership administration and protected operations</td></tr>
                  <tr><td><strong>Admin</strong></td><td>Authorized operations and reviewed publication</td></tr>
                  <tr><td><strong>Content Manager</strong></td><td>Content drafts and reviewed publication</td></tr>
                  <tr><td><strong>Editor</strong></td><td>Create drafts and submit for independent review</td></tr>
                  <tr><td><strong>SEO Manager</strong></td><td>SEO drafts and content metadata</td></tr>
                  <tr><td><strong>Moderator</strong></td><td>Reject content submissions, not publication</td></tr>
                  <tr><td><strong>Analyst</strong></td><td>Approved aggregate reporting</td></tr>
                  <tr><td><strong>Read-only Auditor</strong></td><td>Read permitted security and audit information</td></tr>
                </tbody>
              </table>
            </div>
            <p className="ad-muted-copy">
              Server-side permission checks, MFA and conflict-of-interest rules are enforced in bc_admin_v1 when live.
            </p>
          </Panel>

          <Panel title="Audit log" icon="audit" description="No event source is connected.">
            <button type="button" className="ad-btn ad-btn--secondary" disabled>Export audit log</button>
            <p className="ad-muted-copy">
              Audit events and session history are unavailable; no assertion is made about real activity.
            </p>
          </Panel>
        </>
      )}

      {moduleKey === 'settings' && (
        <Panel title="Configuration and recovery" icon="settings" description="Privileged operations are not connected.">
          <div className="ad-action-row">
            <button type="button" className="ad-btn ad-btn--secondary" disabled>Change settings</button>
            <button type="button" className="ad-btn ad-btn--secondary" disabled>Request backup</button>
          </div>
          <p className="ad-muted-copy">
            No provider, backup, restore or cache operations can be performed from this Preview.
          </p>
        </Panel>
      )}

      {moduleKey === 'backup' && (
        <Panel title="Backup & restore verification" icon="backup" description="No live database or backup ledger is connected.">
          <div className="ad-action-row">
            <button type="button" className="ad-btn ad-btn--secondary" disabled>Verify snapshot</button>
            <button type="button" className="ad-btn ad-btn--secondary" disabled>Run cleanup</button>
          </div>
          <p className="ad-muted-copy">
            Live environments surface provider backup records, restore verification dates, and bounded operational maintenance.
          </p>
        </Panel>
      )}
    </>
  );
}
