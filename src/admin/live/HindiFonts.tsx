import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Panel, Badge, StatCard, SegmentedControl, EmptyState } from '../ui/Primitives';
import { Icon } from '../icons';
import { catalogue, detectDuplicates, readImportReport, readLicenses } from '../../lib/hindiFonts/catalogue';
import { readFontOverrides, saveFontOverride, clearFontOverride, resetFontOverrides, type FontAdminStatus } from '../../lib/hindiFonts/overrides';
import { readFontUsage } from '../../lib/hindiFonts/usage';
import {
  readImportQueue,
  setStagedStatus,
  removeStagedImport,
  clearImportQueue,
  stageImport,
  type StagedImport,
} from '../../lib/hindiFonts/import-queue';
import { inspectFontBuffer, sha256Hex } from '../../lib/hindiFonts/inspect';
import { loadValidationReport } from '../../lib/hindiFonts/validation';
import { fontFamilyName } from '../../lib/hindiFonts/loader';
import type { FontInspectionReport, FontLicenseIndexEntry, RejectedFont } from '../../lib/hindiFonts/types';
import type { ValidationReport } from '../../lib/hindiFonts/catalogue';

/**
 * Admin — Hindi font library (7 tabs).
 *
 * What this screen really does, stated without euphemism:
 *
 *  - Reads the committed catalogue, licence index, import report and the HarfBuzz
 *    validation report that ship with the build. Those numbers are measured.
 *  - Lets an operator review, re-label and withhold families for this session.
 *    Those decisions are browser-local overlays, exported as JSON — never a
 *    database write, and never a silent change to what the public site serves.
 *  - Inspects a font file the operator selects, in this tab, with fontkit. It is
 *    a pre-check; publication still requires the HarfBuzz gate in the pipeline.
 *
 * Supabase is used for administrator sign-in only. The public font catalogue is
 * local, so no font data ever reaches the database.
 */

const TABS = [
  { value: 'overview', label: 'Overview' },
  { value: 'catalogue', label: 'Catalogue' },
  { value: 'validation', label: 'Validation' },
  { value: 'imports', label: 'Imports' },
  { value: 'usage', label: 'Usage' },
  { value: 'licences', label: 'Licences' },
  { value: 'export', label: 'Export' },
] as const;

type TabId = (typeof TABS)[number]['value'];

type FontRow = {
  slug: string;
  family: string;
  category: string;
  tags: string[];
  weightRange: [number, number];
  variable: boolean;
  featured: boolean;
  coverage: number;
  conjunctSingleGlyph: number;
  conjunctTotal: number;
  licenseType: string;
  version: string;
  bytes: number;
  files: number;
  status: FontAdminStatus;
  overrideFamily: string;
  overrideCategory: string;
  overrideTags: string[];
  overrideNote: string;
};

function downloadJson(fileName: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

function downloadCsv(fileName: string, rows: (string | number)[][]) {
  const escaped = rows.map(row => row.map(cell => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\n');
  const blob = new Blob([`\ufeff${escaped}\n`], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

const kb = (bytes: number): string =>
  bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;

const toneFor = (status: FontAdminStatus) =>
  status === 'approved' ? 'green' : status === 'rejected' ? 'red' : 'amber';

export default function HindiFontAdmin({ authorized }: { authorized: boolean }) {
  const [tab, setTab] = useState<TabId>('overview');
  const [overrides, setOverrides] = useState(readFontOverrides);
  const [queue, setQueue] = useState<StagedImport[]>(() => readImportQueue().items);
  const [validation, setValidation] = useState<ValidationReport | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | FontAdminStatus>('all');
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const [editing, setEditing] = useState<FontRow | null>(null);
  const [reports, setReports] = useState<{ fileName: string; report: FontInspectionReport }[]>([]);
  const [inspecting, setInspecting] = useState(false);
  const fileInput = useRef<HTMLInputElement | null>(null);

  const licenses = useMemo<FontLicenseIndexEntry[]>(() => readLicenses().licenses, []);
  const importReport = useMemo(() => readImportReport(), []);
  const duplicates = useMemo(() => detectDuplicates(), []);
  const usage = useMemo(() => readFontUsage(), [tab]);

  // The 1.9 MB verification report is fetched only when the Validation tab is
  // opened or a row needs it, so the admin entry chunk stays small.
  useEffect(() => {
    if (validation || validationError) return;
    let cancelled = false;
    void loadValidationReport()
      .then(report => { if (!cancelled) setValidation(report); })
      .catch(error => { if (!cancelled) setValidationError(String(error?.message ?? error)); });
    return () => { cancelled = true; };
  }, [validation, validationError]);

  const reportFamily = useCallback(
    (slug: string) => validation?.families[slug] ?? null,
    [validation],
  );

  const rows = useMemo<FontRow[]>(
    () =>
      catalogue.fonts.map(font => {
        const override = overrides.fonts[font.slug];
        return {
          slug: font.slug,
          family: font.family,
          category: font.category,
          tags: font.styleTags,
          weightRange: font.weightRange,
          variable: Boolean(font.variable),
          featured: font.featured,
          coverage: font.verification.devanagariCoverage,
          conjunctSingleGlyph: font.verification.conjunctSingleGlyph,
          conjunctTotal: font.verification.conjunctTotal,
          licenseType: font.license.type,
          version: font.source.version,
          bytes: font.totalBytes,
          files: font.files.devanagari.length + font.files.latin.length,
          status: override?.status ?? 'approved',
          overrideFamily: override?.family ?? '',
          overrideCategory: override?.category ?? '',
          overrideTags: override?.tags ?? [],
          overrideNote: override?.note ?? '',
        };
      }),
    [overrides],
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return rows
      .filter(font => (statusFilter === 'all' ? true : font.status === statusFilter))
      .filter(font =>
        needle
          ? `${font.family} ${font.category} ${font.tags.join(' ')} ${font.slug}`.toLowerCase().includes(needle)
          : true,
      );
  }, [rows, query, statusFilter]);

  const usageRows = useMemo(() => {
    const total = Math.max(1, Object.values(usage.fonts).reduce((sum, count) => sum + count, 0));
    return Object.entries(usage.fonts)
      .map(([slug, count]) => ({
        slug,
        count,
        share: Math.round((count / total) * 100),
        family: rows.find(font => font.slug === slug)?.family ?? slug,
      }))
      .sort((a, b) => b.count - a.count);
  }, [usage, rows]);

  const stats = catalogue.stats;

  const setStatus = (slug: string, status: FontAdminStatus) => {
    setOverrides(saveFontOverride(slug, { status, updatedAt: new Date().toISOString() }));
    setMessage({
      kind: 'ok',
      text:
        status === 'approved'
          ? 'Approved for this browser session. The public bundle is unchanged until the catalogue is rebuilt.'
          : status === 'rejected'
            ? 'Hidden from this browser’s library. Visitors are unaffected until the overlay is committed and rebuilt.'
            : 'Marked pending. The overlay is exported from the Export tab.',
    });
  };

  const saveEdit = (slug: string, form: HTMLFormElement) => {
    const data = new FormData(form);
    setOverrides(
      saveFontOverride(slug, {
        family: String(data.get('family') ?? '').trim() || undefined,
        category: String(data.get('category') ?? '').trim() || undefined,
        tags: String(data.get('tags') ?? '')
          .split(',')
          .map(tag => tag.trim())
          .filter(Boolean),
        note: String(data.get('note') ?? '').trim(),
        updatedAt: new Date().toISOString(),
      }),
    );
    setEditing(null);
    setMessage({ kind: 'ok', text: 'Metadata overlay saved in this browser.' });
  };

  const inspectFiles = async (fileList: FileList | null) => {
    if (!fileList?.length) return;
    setInspecting(true);
    setMessage(null);
    const next: { fileName: string; report: FontInspectionReport }[] = [];
    for (const file of Array.from(fileList).slice(0, 12)) {
      try {
        const buffer = await file.arrayBuffer();
        const digest = await sha256Hex(buffer);
        const report = inspectFontBuffer(new Uint8Array(buffer), file.name, digest);
        next.push({ fileName: file.name, report });
        const staged = stageImport(file.name, report);
        if (staged.persisted) setQueue(readImportQueue().items);
        else
          setMessage({
            kind: 'error',
            text: 'The report is shown, but browser storage refused the queue entry. Nothing was saved.',
          });
      } catch (error) {
        setMessage({ kind: 'error', text: `${file.name} could not be read: ${String(error)}` });
      }
    }
    setReports(current => [...next, ...current].slice(0, 24));
    setInspecting(false);
  };

  const queueAction = (id: string, action: { status?: StagedImport['status']; remove?: boolean }) => {
    const result = action.remove ? removeStagedImport(id) : setStagedStatus(id, action.status ?? 'pending');
    setQueue(result.items);
    if (!result.persisted) {
      setMessage({ kind: 'error', text: 'Browser storage refused the change; the queue is unchanged.' });
    }
  };

  const publishPatch = () => {
    const approved = queue.filter(item => item.status === 'approved');
    downloadJson('biocraft-hindi-font-import-patch.json', {
      generatedAt: new Date().toISOString(),
      note: 'Publish with: npm run fonts:import → npm run fonts:verify → npm run fonts:build, then commit and deploy. This patch is a review artefact, not a deployment.',
      approved: approved.map(item => ({
        family: item.report.family,
        slug: item.report.suggestedTheme.slug,
        sha256: item.report.sha256,
        bytes: item.report.bytes,
        category: item.report.suggestedTheme.category,
        tags: item.report.suggestedTheme.tags,
        verifiedWith: 'fontkit pre-check in the Admin browser (full HarfBuzz gate still required)',
        fileName: item.fileName,
      })),
      pending: queue.filter(item => item.status === 'pending').map(item => ({ family: item.report.family, sha256: item.report.sha256 })),
    });
  };

  const overridesExport = () =>
    downloadJson('biocraft-hindi-font-overrides.json', {
      exportedAt: new Date().toISOString(),
      note: 'A browser-local review overlay. Rename to overrides.json under data/fonts/ and rebuild to apply it.',
      overrides,
    });

  return (
    <>
      {/* The Admin shell already renders this module's single page heading;
          repeating it here produced two <h1>s on one screen. */}
      <p className="ad-note" style={{ marginTop: 0 }}>
        {stats.verified} verified Devanagari families. The public catalogue is local and
        bundled with the site; Supabase is used for administrator sign-in only.
      </p>

      {!authorized && (
        <div className="ad-inline-alert ad-inline-alert--error" role="alert">
          Sign in to make review decisions. Everything below is read-only until the Admin session is verified.
        </div>
      )}

      <div className="ad-toolbar" style={{ marginBottom: 14 }}>
        <SegmentedControl
          options={TABS.map(item => ({ value: item.value, label: item.label, count: item.value === 'imports' ? queue.length : item.value === 'validation' ? catalogue.rejected.length : undefined }))}
          value={tab}
          onChange={value => setTab(value)}
          ariaLabel="Hindi font admin sections"
        />
      </div>

      {message && (
        <div className={`ad-inline-alert ${message.kind === 'ok' ? 'ad-inline-alert--success' : 'ad-inline-alert--error'}`} role="status">
          {message.text}
        </div>
      )}

      {tab === 'overview' && (
        <>
          <div className="ad-stats-grid ad-stats-grid--4" style={{ marginBottom: 16 }}>
            <StatCard icon="content" label="Verified families" value={stats.verified} tint="mint" caption={`${stats.discovered} discovered`} />
            <StatCard icon="database" label="WOFF2 files" value={stats.files} tint="sky" caption={kb(stats.woff2Bytes)} />
            <StatCard icon="security" label="Rejected by gate" value={stats.rejected} tint="rose" caption={catalogue.rejected.map(item => item.family).join(', ') || 'none'} />
            <StatCard icon="analytics" label="Variable families" value={stats.variableFamilies} tint="violet" caption="continuous wght axis" />
            <StatCard icon="overview" label="Duplicate groups" value={duplicates.length} tint="lavender" caption={duplicates.length ? 'inspect below' : 'no name or hash clash'} />
            <StatCard icon="users" label="Imports waiting" value={queue.filter(item => item.status === 'pending').length} tint="amber" caption="browser-local queue" />
            <StatCard icon="settings" label="Review overlays" value={Object.keys(overrides.fonts).length} tint="cyan" caption={overrides.updatedAt ? `saved ${overrides.updatedAt.slice(0, 16).replace('T', ' ')}` : 'none this session'} />
            <StatCard icon="generators" label="Licences" value={stats.licenses.join(' · ')} tint="mint" caption="every family indexed" />
          </div>

          <Panel title="Verification engine" description="The gate that decides what reaches the public library.">
            <p className="ad-note" style={{ marginTop: 0 }}>
              {validation?.verifier.engine ?? 'HarfBuzz + fontTools'} · fontTools {validation?.verifier.fontTools ?? '—'} · catalogue built{' '}
              {catalogue.generatedAt.slice(0, 10)}
            </p>
            <ul className="ad-clean-list">
              {(validation?.verifier.checks ?? []).map(check => (
                <li key={check}>
                  <Icon name="security" size={13} /> {check}
                </li>
              ))}
              {!validation && !validationError && <li>Loading the recorded checks…</li>}
              {validationError && <li>The verification report could not be read: {validationError}</li>}
            </ul>
            <p className="ad-note">
              Sample gate text: <span lang="hi">{validation?.verifier.sampleText ?? catalogue.sampleText}</span>
            </p>
          </Panel>

          <Panel title="Rejected imports" description="Withheld from the public library; the failing check is kept here rather than hidden.">
            {catalogue.rejected.length ? (
              <div className="ad-table-wrap">
                <table className="ad-table">
                  <thead>
                    <tr><th scope="col">Family</th><th scope="col">Reason</th><th scope="col">Findings</th></tr>
                  </thead>
                  <tbody>
                    {catalogue.rejected.map((item: RejectedFont) => (
                      <tr key={item.slug}>
                        <th scope="row">{item.family}</th>
                        <td>{item.reason}</td>
                        <td>{item.errors.join('; ') || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState title="Nothing rejected" text="Every discovered family passed the gate." />
            )}
          </Panel>

          <Panel title="Duplicate detection" description="Identical normalised family names or identical binary hashes. Similar siblings are not duplicates.">
            {duplicates.length ? (
              <div className="ad-table-wrap">
                <table className="ad-table">
                  <thead>
                    <tr><th scope="col">Kind</th><th scope="col">Key</th><th scope="col">Families</th></tr>
                  </thead>
                  <tbody>
                    {duplicates.map(group => (
                      <tr key={`${group.kind}-${group.key}`}>
                        <td>{group.kind === 'family' ? 'Same family name' : 'Identical files'}</td>
                        <td className="ad-mono">{group.key.slice(0, 24)}</td>
                        <td>{group.fonts.map(font => font.family).join(' · ')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="ad-note" style={{ margin: 0 }}>
                Duplicate check passed: no two families share a normalised name or a concatenated file hash.
              </p>
            )}
          </Panel>
        </>
      )}

      {tab === 'catalogue' && (
        <Panel
          title={`Catalogue (${filtered.length} of ${rows.length})`}
          description="Review decisions are browser-local overlays. Export them from the Export tab; the committed catalogue stays the public source of truth."
          aside={
            <button type="button" className="ad-btn ad-btn--secondary ad-btn--sm" onClick={overridesExport}>
              <Icon name="download" size={14} /> Export overlay
            </button>
          }
        >
          <div className="ad-toolbar">
            <label className="ad-search">
              <Icon name="search" size={16} />
              <span className="ad-sr">Search fonts</span>
              <input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search families, tags or slugs" />
            </label>
            <label className="ad-select-label">
              <span className="ad-sr">Filter by status</span>
              <select value={statusFilter} onChange={event => setStatusFilter(event.target.value as 'all' | FontAdminStatus)} aria-label="Filter by status">
                <option value="all">All statuses</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </label>
            <button type="button" className="ad-btn ad-btn--secondary ad-btn--sm" onClick={overridesExport}>
              <Icon name="download" size={14} /> Export
            </button>
          </div>
          <div className="ad-table-wrap">
            <table className="ad-table">
              <thead>
                <tr>
                  <th scope="col">Family</th>
                  <th scope="col">Status</th>
                  <th scope="col">Category</th>
                  <th scope="col">Weights</th>
                  <th scope="col">Coverage</th>
                  <th scope="col">Conjuncts</th>
                  <th scope="col">Files</th>
                  <th scope="col">Licence</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(font => (
                  <tr key={font.slug}>
                    <th scope="row">
                      <div>{font.overrideFamily || font.family}</div>
                      <div className="ad-cell-sub">{font.slug} · {font.version}</div>
                      {font.overrideNote && <div className="ad-cell-sub">Note: {font.overrideNote}</div>}
                    </th>
                    <td><Badge tone={toneFor(font.status)}>{font.status}</Badge></td>
                    <td>{font.overrideCategory || font.category}</td>
                    <td>{font.weightRange[0]}–{font.weightRange[1]}{font.variable ? ' · var' : ''}</td>
                    <td>{font.coverage}%</td>
                    <td>{font.conjunctSingleGlyph}/{font.conjunctTotal}</td>
                    <td>{font.files}<div className="ad-cell-sub">{kb(font.bytes)}</div></td>
                    <td>{font.licenseType}</td>
                    <td>
                      <div className="ad-actions">
                        <button type="button" className="ad-link-btn" onClick={() => setEditing(font)} disabled={!authorized}>
                          <Icon name="edit" size={13} /> Edit
                        </button>
                        {font.status !== 'approved' && (
                          <button type="button" className="ad-link-btn" onClick={() => setStatus(font.slug, 'approved')} disabled={!authorized}>
                            <Icon name="check" size={13} /> Approve
                          </button>
                        )}
                        {font.status !== 'rejected' && (
                          <button type="button" className="ad-link-btn" onClick={() => setStatus(font.slug, 'rejected')} disabled={!authorized}>
                            <Icon name="close" size={13} /> Reject
                          </button>
                        )}
                        {overrides.fonts[font.slug] && (
                          <button type="button" className="ad-link-btn" onClick={() => setOverrides(clearFontOverride(font.slug))} disabled={!authorized}>
                            <Icon name="refresh" size={13} /> Reset
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!filtered.length && <EmptyState title="No family matches" text="Try a different status filter or search term." />}
          <p className="ad-note" style={{ marginBottom: 0 }}>
            Overlays are stored in this browser under <span className="ad-mono">biocraft.hindiFonts.overrides.v1</span>. No database write, no upload.
            {Object.keys(overrides.fonts).length > 0 && (
              <button type="button" className="ad-link-btn" style={{ marginLeft: 8 }} onClick={() => setOverrides(resetFontOverrides())} disabled={!authorized}>
                Clear all overlays
              </button>
            )}
          </p>
        </Panel>
      )}

      {tab === 'validation' && (
        <Panel title="Validation report" description="Every family, the real coverage numbers and the probes that produced them.">
          {!validation && !validationError && <p className="ad-note">Loading the recorded verification report…</p>}
          {validationError && (
            <div className="ad-inline-alert ad-inline-alert--error" role="alert">
              The verification report could not be read: {validationError}
            </div>
          )}
          {validation && (
            <>
              <p className="ad-note" style={{ marginTop: 0 }}>
                {validation.totals.scannedFiles} Devanagari files scanned · {validation.totals.verified} verified · {validation.totals.rejected} rejected ·{' '}
                {validation.totals.discovered} discovered upstream · generated {validation.generatedAt.slice(0, 16).replace('T', ' ')}
              </p>
              <div className="ad-table-wrap">
                <table className="ad-table">
                  <thead>
                    <tr>
                      <th scope="col">Family</th>
                      <th scope="col">Status</th>
                      <th scope="col">Devanagari</th>
                      <th scope="col">Conjuncts</th>
                      <th scope="col">Latin</th>
                      <th scope="col">Findings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(font => {
                      const report = reportFamily(font.slug);
                      return (
                        <tr key={font.slug}>
                          <th scope="row">
                            <div>{font.family}</div>
                            <div className="ad-cell-sub">{font.slug}</div>
                          </th>
                          <td><Badge tone={report?.errors.length ? 'red' : 'green'}>{report?.errors.length ? 'rejected' : 'verified'}</Badge></td>
                          <td>{report?.coverage?.devanagari?.percent ?? font.coverage}%</td>
                          <td>{font.conjunctSingleGlyph}/{font.conjunctTotal}</td>
                          <td>{report?.latin ? `${report.latin.percent}%` : '—'}</td>
                          <td>
                            {report ? (
                              <details>
                                <summary>{report.errors.length ? `${report.errors.length} error(s)` : 'View probes'}</summary>
                                {report.errors.length > 0 && (
                                  <ul className="ad-clean-list">
                                    {report.errors.map(error => <li key={error}>{error}</li>)}
                                  </ul>
                                )}
                                {report.warnings.length > 0 && (
                                  <ul className="ad-clean-list">
                                    {report.warnings.map(warning => <li key={warning}>{warning}</li>)}
                                  </ul>
                                )}
                                <div className="ad-cell-sub">
                                  Conjuncts: {(report.conjuncts ?? []).map(test => test.text).join(' ')} · Matras:{' '}
                                  {(report.matras ?? []).map(test => `${test.text}${test.ok ? '' : '✗'}`).join(' ')} · Nukta:{' '}
                                  {(report.nukta ?? []).map(test => `${test.text}${test.ok ? '' : '✗'}`).join(' ')}
                                </div>
                              </details>
                            ) : (
                              <span className="ad-cell-sub">rejected — no published probe set</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </Panel>
      )}

      {tab === 'imports' && (
        <>
          <Panel
            title="Pre-flight inspection"
            description="Select up to 12 font files. Each is decoded and shaped with real Hindi text in this tab by fontkit — nothing is uploaded. The full HarfBuzz gate still runs before publication."
          >
            <div className="ad-toolbar">
              <input
                ref={fileInput}
                type="file"
                accept=".woff2,.woff,.ttf,.otf"
                multiple
                aria-label="Hindi font files"
                onChange={event => void inspectFiles(event.target.files)}
                className="ad-mono"
              />
              <button type="button" className="ad-btn ad-btn--secondary ad-btn--sm" onClick={() => fileInput.current?.click()} disabled={!authorized || inspecting}>
                <Icon name="upload" size={14} /> {inspecting ? 'Inspecting…' : 'Choose files'}
              </button>
              <button type="button" className="ad-btn ad-btn--secondary ad-btn--sm" onClick={publishPatch} disabled={!queue.length}>
                <Icon name="download" size={14} /> Export publish patch
              </button>
            </div>
            {!authorized && <p className="ad-note">Inspection is available after sign-in.</p>}
            {reports.length === 0 && (
              <EmptyState title="No files inspected yet" text="Choose a WOFF2, WOFF, TTF or OTF file to see its real coverage and shaping numbers." />
            )}
            {reports.map((entry, index) => (
              <div className="ad-review-card" key={`${entry.fileName}-${index}`}>
                <div className="ad-review-head">
                  <strong>{entry.report.family} <span className="ad-cell-sub">· {entry.fileName}</span></strong>
                  <Badge tone={entry.report.status === 'fail' ? 'red' : entry.report.status === 'warn' ? 'amber' : 'green'}>{entry.report.status}</Badge>
                </div>
                <div className="ad-cell-sub">
                  {entry.report.glyphCount} glyphs · {entry.report.cmapEntries} cmap entries · {entry.report.hasGsub ? 'GSUB' : 'no GSUB'} ·{' '}
                  {entry.report.hasGpos ? 'GPOS' : 'no GPOS'} · {Object.keys(entry.report.variableAxes).join(', ') || 'static'}
                </div>
                <dl className="ad-stat-grid">
                  <div><dt>Devanagari coverage</dt><dd>{entry.report.checks.devanagariCoverage}%</dd></div>
                  <div><dt>Single-glyph conjuncts</dt><dd>{entry.report.checks.conjunctsSingleGlyph}/{entry.report.checks.conjunctsTested}</dd></div>
                  <div><dt>Matras</dt><dd>{entry.report.checks.matrasRendered}/8</dd></div>
                  <div><dt>Devanagari numerals</dt><dd>{entry.report.checks.numeralsRendered}/10</dd></div>
                  <div><dt>Digest</dt><dd className="ad-mono">{entry.report.sha256 ? `${entry.report.sha256.slice(0, 16)}…` : 'unavailable'}</dd></div>
                  <div><dt>Size</dt><dd>{kb(entry.report.bytes)}</dd></div>
                </dl>
                {entry.report.issues.length > 0 ? (
                  <ul className="ad-clean-list">
                    {entry.report.issues.map(issue => (
                      <li key={`${issue.code}-${issue.message}`}><strong>{issue.severity}</strong> · {issue.message}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="ad-note ad-text-green" style={{ margin: 0 }}>Passed every pre-flight check.</p>
                )}
                <p className="ad-note" lang="hi" style={{ marginBottom: 0, fontFamily: `"${fontFamilyName('kalam')}", sans-serif` }}>
                  नमस्ते भारत — क्ष त्र ज्ञ श्र ०१२३४५६७८९
                </p>
              </div>
            ))}
          </Panel>

          <Panel
            title={`Review queue (${queue.length})`}
            description="Staged in this browser, metadata only. Approving here records a decision; it does not publish a font."
            aside={
              queue.length ? (
                <button type="button" className="ad-btn ad-btn--secondary ad-btn--sm" onClick={() => { clearImportQueue(); setQueue([]); }} disabled={!authorized}>
                  <Icon name="trash" size={14} /> Clear queue
                </button>
              ) : undefined
            }
          >
            {queue.length ? (
              <div className="ad-table-wrap">
                <table className="ad-table">
                  <thead>
                    <tr>
                      <th scope="col">Family</th>
                      <th scope="col">Status</th>
                      <th scope="col">Pre-flight</th>
                      <th scope="col">Size</th>
                      <th scope="col">Added</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {queue.map(item => (
                      <tr key={item.id}>
                        <th scope="row">
                          <div>{item.family}</div>
                          <div className="ad-cell-sub">{item.fileName}</div>
                        </th>
                        <td><Badge tone={toneFor(item.status)}>{item.status}</Badge></td>
                        <td>{item.report.status} · {item.report.checks.devanagariCoverage}%</td>
                        <td className="ad-mono">{kb(item.bytes)}</td>
                        <td className="ad-cell-sub">{item.addedAt.slice(0, 16).replace('T', ' ')}</td>
                        <td>
                          <div className="ad-actions">
                            {item.status !== 'approved' && (
                              <button type="button" className="ad-link-btn" onClick={() => queueAction(item.id, { status: 'approved' })} disabled={!authorized}>
                                <Icon name="check" size={13} /> Approve
                              </button>
                            )}
                            {item.status !== 'rejected' && (
                              <button type="button" className="ad-link-btn" onClick={() => queueAction(item.id, { status: 'rejected' })} disabled={!authorized}>
                                <Icon name="close" size={13} /> Reject
                              </button>
                            )}
                            <button type="button" className="ad-link-btn" onClick={() => queueAction(item.id, { remove: true })} disabled={!authorized}>
                              <Icon name="trash" size={13} /> Remove
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState title="No staged imports" text="Files you inspect appear here. The binary is never stored in the browser." />
            )}
            <p className="ad-note" style={{ marginBottom: 0 }}>
              To publish: <span className="ad-mono">npm run fonts:import</span> → <span className="ad-mono">npm run fonts:verify</span> →{' '}
              <span className="ad-mono">npm run fonts:build</span>, then commit and deploy. {importReport.rejected.length} import(s) were rejected by the last build.
            </p>
          </Panel>
        </>
      )}

      {tab === 'usage' && (
        <Panel title="Font usage" description="Anonymous, device-local counters from the library, specimen, studio and poster surfaces. No visitor identifier, no request.">
          {usageRows.length ? (
            <>
              <p className="ad-note" style={{ marginTop: 0 }}>
                {usage.updatedAt ? `Last recorded ${usage.updatedAt.slice(0, 16).replace('T', ' ')}` : 'No timestamps yet'} ·{' '}
                {usage.persisted ? 'stored on this device' : 'storage unavailable — counters are session-only'} ·{' '}
                {Object.keys(usage.surfaces).length} surface(s) used
              </p>
              <div className="ad-table-wrap">
                <table className="ad-table">
                  <thead>
                    <tr><th scope="col">Font</th><th scope="col">Uses</th><th scope="col">Share</th></tr>
                  </thead>
                  <tbody>
                    {usageRows.map(row => (
                      <tr key={row.slug}>
                        <th scope="row"><div>{row.family}</div><div className="ad-cell-sub">{row.slug}</div></th>
                        <td>{row.count}</td>
                        <td>{row.share}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <EmptyState title="No usage on this device" text="Open a family in the public library or studio and the tally appears here." />
          )}
        </Panel>
      )}

      {tab === 'licences' && (
        <Panel
          title={`Licences (${licenses.length})`}
          description="Attribution and provenance exactly as the import pipeline recorded them."
          aside={
            <button type="button" className="ad-btn ad-btn--secondary ad-btn--sm" onClick={() => downloadJson('biocraft-hindi-font-licences.json', licenses)}>
              <Icon name="download" size={14} /> Export licences
            </button>
          }
        >
          <div className="ad-table-wrap">
            <table className="ad-table">
              <thead>
                <tr>
                  <th scope="col">Family</th>
                  <th scope="col">Licence</th>
                  <th scope="col">Version</th>
                  <th scope="col">Author / copyright</th>
                  <th scope="col">Source</th>
                  <th scope="col">Licence file</th>
                </tr>
              </thead>
              <tbody>
                {licenses.map(license => (
                  <tr key={license.slug}>
                    <th scope="row"><div>{license.family}</div><div className="ad-cell-sub">{license.slug}</div></th>
                    <td>{license.type}</td>
                    <td>{license.version}</td>
                    <td>{license.attribution}</td>
                    <td><a href={license.source} target="_blank" rel="noreferrer">repository</a></td>
                    <td>
                      {license.downloadAllowed ? (
                        <a href={license.licenseFile ?? license.url} target="_blank" rel="noreferrer">licence text</a>
                      ) : 'not permitted'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      {tab === 'export' && (
        <Panel title="Export & reports" description="Machine-readable snapshots for backups, licence reviews and release notes. No visitor data is included.">
          <div className="ad-actions" style={{ flexWrap: 'wrap', gap: 10 }}>
            <button type="button" className="ad-btn ad-btn--secondary ad-btn--sm" onClick={() => downloadJson('biocraft-hindi-font-catalogue.json', { exportedAt: new Date().toISOString(), generatedAt: catalogue.generatedAt, overridesUpdatedAt: overrides.updatedAt, stats, fonts: rows })}>
              <Icon name="download" size={14} /> Catalogue JSON
            </button>
            <button type="button" className="ad-btn ad-btn--secondary ad-btn--sm" onClick={() => downloadCsv('biocraft-hindi-font-catalogue.csv', [['family', 'slug', 'category', 'weights', 'coverage', 'conjuncts', 'status', 'license'], ...rows.map(font => [font.family, font.slug, font.category, `${font.weightRange[0]}-${font.weightRange[1]}`, `${font.coverage}%`, `${font.conjunctSingleGlyph}/${font.conjunctTotal}`, font.status, font.licenseType])])}>
              <Icon name="download" size={14} /> Catalogue CSV
            </button>
            <button type="button" className="ad-btn ad-btn--secondary ad-btn--sm" onClick={() => downloadJson('biocraft-hindi-font-licences.json', licenses)}>
              <Icon name="fileText" size={14} /> Licences JSON
            </button>
            <button type="button" className="ad-btn ad-btn--secondary ad-btn--sm" onClick={overridesExport}>
              <Icon name="fileText" size={14} /> Review overlay
            </button>
            <button type="button" className="ad-btn ad-btn--secondary ad-btn--sm" disabled={!validation} onClick={() => downloadJson('biocraft-hindi-font-validation.json', validation)}>
              <Icon name="security" size={14} /> Validation report
            </button>
            <button type="button" className="ad-btn ad-btn--secondary ad-btn--sm" onClick={publishPatch}>
              <Icon name="upload" size={14} /> Import queue patch
            </button>
            <button type="button" className="ad-btn ad-btn--secondary ad-btn--sm" onClick={() => downloadJson('biocraft-hindi-font-usage.json', { exportedAt: new Date().toISOString(), ...readFontUsage() })}>
              <Icon name="fileText" size={14} /> Usage snapshot
            </button>
          </div>
          <p className="ad-note" style={{ marginBottom: 0 }}>
            Exporting is read-only and works without any write access. Nothing leaves this browser.
            {catalogue.rejected.map(item => item.family).join(', ') && ` ${catalogue.rejected.length} family (${catalogue.rejected.map(item => item.family).join(', ')}) stays withheld in every export.`}
          </p>
        </Panel>
      )}

      {editing && (
        <div className="ad-modal-backdrop" role="dialog" aria-modal="true" aria-label={`Edit ${editing.family}`} onClick={event => { if (event.target === event.currentTarget) setEditing(null); }}>
          <form className="ad-modal" onSubmit={event => { event.preventDefault(); saveEdit(editing.slug, event.currentTarget); }}>
            <div className="ad-modal-head"><h2>Edit metadata</h2></div>
            <p className="ad-note">Overlays change the label for this browser session and can be exported. The generated catalogue and the font binary are never modified here.</p>
            <label className="ad-field">
              <span>Family name</span>
              <input name="family" defaultValue={editing.overrideFamily || editing.family} maxLength={80} />
            </label>
            <label className="ad-field">
              <span>Category</span>
              <select name="category" defaultValue={editing.overrideCategory || editing.category}>
                {['Serif', 'Sans Serif', 'Handwriting', 'Display', 'Monospace'].map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </label>
            <label className="ad-field">
              <span>Tags (comma separated)</span>
              <input name="tags" defaultValue={(editing.overrideTags.length ? editing.overrideTags : editing.tags).join(', ')} />
            </label>
            <label className="ad-field">
              <span>Admin note</span>
              <textarea name="note" defaultValue={editing.overrideNote} maxLength={300} rows={3} />
            </label>
            <div className="ad-modal-foot">
              <button type="button" className="ad-btn ad-btn--secondary" onClick={() => setEditing(null)}>Cancel</button>
              <button type="submit" className="ad-btn ad-btn--primary">Save overlay</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
