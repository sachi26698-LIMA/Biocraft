/**
 * Live Bios Library — reads every bio row in public.bios via /api/admin/v1/bios.
 * Includes rich filtering, bulk CSV export, detail modal, responsive mobile cards,
 * and direct launch of the Rich Bio Editor modal to open new private drafts.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAdminContext } from '../context';
import { Icon } from '../icons';
import { Modal } from '../ui/Modal';
import { useToast } from '../ui/Toast';
import { Badge, BulkActionBar, EmptyState, PageHead, Panel, SearchField, SelectField, StatCard, StateNotice, Toolbar } from './common';
import { LANGUAGE_LABEL, type BioRow } from './types';
import { downloadCsv, formatDate, request } from './useLive';

const PAGE = 50;

export default function LiveLibrary() {
  const { openBioModal, refreshTick } = useAdminContext();
  const toast = useToast();

  const [rows, setRows] = useState<BioRow[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'denied' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [language, setLanguage] = useState('');
  const [active, setActive] = useState('');
  const [busy, setBusy] = useState(false);
  const [detail, setDetail] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const load = useCallback(
    async (append = false) => {
      setBusy(true);
      if (!append) setState('loading');
      try {
        const params = new URLSearchParams({ limit: String(PAGE) });
        if (search.trim()) params.set('search', search.trim());
        if (language) params.set('language', language);
        if (active) params.set('active', active);
        if (append && rows.length > 0) params.set('after', rows[rows.length - 1].id);
        const page = await request<{ items: BioRow[] }>(`/bios?${params.toString()}`);
        setRows(previous => (append ? [...previous, ...(page.items ?? [])] : page.items ?? []));
        setState('ready');
        setError(null);
      } catch (cause) {
        const code = (cause as { code?: string } | null)?.code;
        setState(code === 'FORBIDDEN' ? 'denied' : 'error');
        setError(code === 'FORBIDDEN' ? 'Your account does not have permission to read the bio library.' : 'The bio library could not be read.');
      } finally {
        setBusy(false);
      }
    },
    [search, language, active, rows],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      void load(false);
    }, 220);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, language, active, refreshTick]);

  const counts = useMemo(
    () => ({
      active: rows.filter(row => row.is_active).length,
      archived: rows.filter(row => !row.is_active).length,
      featured: rows.filter(row => row.is_featured).length,
      collections: new Set(rows.map(row => row.source_slug ?? '—')).size,
    }),
    [rows],
  );

  const selectedRow = rows.find(row => row.id === detail) ?? null;

  function toggleRow(id: string) {
    setSelectedIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  }

  function exportSelected() {
    const chosen = rows.filter(r => selectedIds.includes(r.id));
    const n = downloadCsv('bios-selected.csv', chosen as unknown as Record<string, unknown>[], [
      'id', 'source_slug', 'language', 'platform_slug', 'character_count', 'is_active', 'is_featured', 'updated_at',
    ]);
    toast.push(`Exported ${n} selected bios`, { tone: 'success' });
  }

  return (
    <>
      <PageHead
        eyebrow="CONTENT LIBRARY"
        title="Bios Library"
        description="Every bio row in the live database with its real visibility. New bios and edits go through reviewed drafts."
        actions={
          <button type="button" className="ad-btn ad-btn--primary" onClick={() => openBioModal()}>
            <Icon name="plus" size={15} /> Add New Bio
          </button>
        }
      />

      {state === 'ready' && (
        <div className="ad-stats-grid ad-stats-grid--4">
          <StatCard icon="eye" label="Visible on screen" value={counts.active} caption="Guests can read these" tint="mint" />
          <StatCard icon="lock" label="Hidden on screen" value={counts.archived} caption="Archived in database" tint="rose" />
          <StatCard icon="sparkle" label="Featured" value={counts.featured} caption="Highlighted entries" tint="lavender" />
          <StatCard icon="collections" label="Collections" value={counts.collections} caption="Distinct sources loaded" tint="sky" />
        </div>
      )}

      <Panel
        title="Bios"
        icon="bios"
        description={`Loaded in pages of ${PAGE}. Search matches title and content literally without SQL wildcards.`}
        aside={state === 'ready' ? <Badge tone="green">{rows.length} loaded</Badge> : undefined}
      >
        <Toolbar>
          <SearchField value={search} onChange={setSearch} placeholder="Search title or bio text…" label="Search bios" />
          <SelectField value={language} onChange={setLanguage} label="Filter by language">
            <option value="">All languages</option>
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="hg">Hinglish</option>
          </SelectField>
          <SelectField value={active} onChange={setActive} label="Filter by visibility">
            <option value="">Visible and hidden</option>
            <option value="true">Visible to guests</option>
            <option value="false">Hidden from guests</option>
          </SelectField>
          <button
            type="button"
            className="ad-btn ad-btn--secondary"
            disabled={rows.length === 0}
            onClick={() => {
              const n = downloadCsv('bios.csv', rows as unknown as Record<string, unknown>[], [
                'id', 'source_slug', 'language', 'platform_slug', 'character_count', 'is_active', 'is_featured', 'updated_at',
              ]);
              toast.push(`Exported ${n} bios to CSV`, { tone: 'success' });
            }}
          >
            <Icon name="download" size={14} /> Export CSV
          </button>
        </Toolbar>

        <BulkActionBar count={selectedIds.length} onClear={() => setSelectedIds([])}>
          <button type="button" className="ad-btn ad-btn--primary ad-btn--sm" onClick={exportSelected}>
            <Icon name="download" size={14} /> Export selected
          </button>
        </BulkActionBar>

        {state !== 'ready' ? (
          <StateNotice state={state === 'loading' ? 'loading' : state} error={error} reload={() => void load(false)} />
        ) : rows.length === 0 ? (
          <EmptyState
            icon="bios"
            title={search || language || active ? 'No bio matches these filters' : 'The bio table is empty'}
            text={
              search || language || active
                ? 'Loosen your filters or clear the search term to see more entries.'
                : 'The public table returned no rows. This is distinct from a refused read.'
            }
          />
        ) : (
          <>
            <div className="ad-table-wrap" tabIndex={0} role="region" aria-label="Bio library table">
              <table className="ad-table">
                <thead>
                  <tr>
                    <th style={{ width: 38 }}>
                      <input
                        type="checkbox"
                        aria-label="Select all loaded bios"
                        checked={rows.length > 0 && selectedIds.length === rows.length}
                        onChange={e => setSelectedIds(e.target.checked ? rows.map(r => r.id) : [])}
                      />
                    </th>
                    <th>Collection</th>
                    <th>Language</th>
                    <th>Platform</th>
                    <th>Characters</th>
                    <th>Visibility</th>
                    <th>Updated</th>
                    <th className="ad-right">Inspect</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(row => (
                    <tr key={row.id}>
                      <td>
                        <input
                          type="checkbox"
                          aria-label={`Select bio ${row.source_slug ?? row.id}`}
                          checked={selectedIds.includes(row.id)}
                          onChange={() => toggleRow(row.id)}
                        />
                      </td>
                      <td>
                        <strong>{row.source_slug ?? 'untitled'}</strong>
                        {row.category_name && <small className="ad-cell-sub">{row.category_name}</small>}
                      </td>
                      <td><Badge>{LANGUAGE_LABEL[row.language] ?? row.language}</Badge></td>
                      <td>{row.platform_slug ?? '—'}</td>
                      <td className="ad-num">{row.character_count}</td>
                      <td>
                        <div className="ad-chip-row">
                          {row.is_active ? <Badge tone="green">Visible</Badge> : <Badge tone="red">Hidden</Badge>}
                          {row.is_featured && <Badge tone="purple">Featured</Badge>}
                          {row.is_trending && <Badge tone="amber">Trending</Badge>}
                        </div>
                      </td>
                      <td className="ad-nowrap">{formatDate(row.updated_at)}</td>
                      <td className="ad-right">
                        <button type="button" className="ad-btn ad-btn--ghost ad-btn--sm" onClick={() => setDetail(row.id)}>
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="ad-pagination">
              <span className="ad-pagination-meta">
                {rows.length} loaded{busy ? ' — loading…' : ''}
              </span>
              <div className="ad-pagination-controls">
                <button type="button" onClick={() => void load(true)} disabled={busy || rows.length < PAGE}>
                  Load more
                </button>
              </div>
            </div>
          </>
        )}
      </Panel>

      <Modal
        open={Boolean(selectedRow)}
        onClose={() => setDetail(null)}
        title={selectedRow ? `Bio · ${selectedRow.source_slug ?? selectedRow.id.slice(0, 8)}` : 'Bio Details'}
        subtitle="Read-only database record. Changes must go through a reviewed draft."
        footer={
          selectedRow && (
            <>
              <button type="button" className="ad-btn ad-btn--secondary" onClick={() => setDetail(null)}>
                Close
              </button>
              <button
                type="button"
                className="ad-btn ad-btn--primary"
                onClick={() => {
                  const row = selectedRow;
                  setDetail(null);
                  openBioModal({
                    key: row.source_slug ?? 'custom-bio',
                    language: (row.language as 'en' | 'hi' | 'hg') || 'en',
                    platform: row.platform_slug ?? 'instagram',
                    active: row.is_active,
                    featured: row.is_featured,
                  });
                }}
              >
                <Icon name="edit" size={14} /> Open draft for collection
              </button>
            </>
          )
        }
      >
        {selectedRow && (
          <dl className="ad-detail-grid">
            <dt>Identifier</dt><dd><code className="ad-mono">{selectedRow.id}</code></dd>
            <dt>Collection</dt><dd>{selectedRow.source_slug ?? '—'}</dd>
            <dt>Language</dt><dd>{LANGUAGE_LABEL[selectedRow.language] ?? selectedRow.language}</dd>
            <dt>Category</dt><dd>{selectedRow.category_name ?? '—'}</dd>
            <dt>Platform</dt><dd>{selectedRow.platform_slug ?? '—'}</dd>
            <dt>Characters</dt><dd>{selectedRow.character_count}</dd>
            <dt>Visibility</dt><dd>{selectedRow.is_active ? 'Visible to guests' : 'Hidden from guests'}</dd>
            <dt>Created</dt><dd>{formatDate(selectedRow.created_at)}</dd>
            <dt>Updated</dt><dd>{formatDate(selectedRow.updated_at)}</dd>
          </dl>
        )}
      </Modal>
    </>
  );
}
