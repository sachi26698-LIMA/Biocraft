/**
 * Library — every bio row in the database, including the ones guests cannot see.
 *
 * The bundled preview lists the bios shipped in the build. This lists what is
 * actually in the public table: active, archived, featured, trending, with the
 * collection it came from. The distinction matters because "not visible to a
 * guest" and "not in the database" are different facts and an editor needs to
 * tell them apart.
 *
 * Search is a plain case-insensitive substring match done in SQL, so `%` is a
 * percent sign here, not a wildcard.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Badge, Panel } from '../parts';
import { downloadCsv, formatDate, request } from './useLive';
import { EmptyState, SearchField, SelectField, StateNotice, Toolbar } from './ui';
import { LANGUAGE_LABEL, type BioRow } from './types';

const PAGE = 50;

export default function Library() {
  const [rows, setRows] = useState<BioRow[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'denied' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [language, setLanguage] = useState('');
  const [active, setActive] = useState('');
  const [busy, setBusy] = useState(false);
  const [detail, setDetail] = useState<string | null>(null);

  const load = useCallback(async (append = false) => {
    setBusy(true);
    if (!append) setState('loading');
    try {
      const params = new URLSearchParams({ limit: String(PAGE) });
      if (search.trim()) params.set('search', search.trim());
      if (language) params.set('language', language);
      if (active) params.set('active', active);
      if (append && rows.length > 0) params.set('after', rows[rows.length - 1].id);
      const page = await request<{ items: BioRow[] }>(`/bios?${params.toString()}`);
      setRows(previous => append ? [...previous, ...(page.items ?? [])] : (page.items ?? []));
      setState('ready');
      setError(null);
    } catch (cause) {
      const code = (cause as { code?: string } | null)?.code;
      setState(code === 'FORBIDDEN' ? 'denied' : 'error');
      setError(code === 'FORBIDDEN' ? 'Your account does not have permission to read the bio library.' : 'The bio library could not be read.');
    } finally { setBusy(false); }
  }, [search, language, active, rows]);

  // Debounced so typing does not fire one query per keystroke.
  useEffect(() => {
    const timer = setTimeout(() => { void load(false); }, 250);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, language, active]);

  const counts = useMemo(() => ({
    active: rows.filter(row => row.is_active).length,
    archived: rows.filter(row => !row.is_active).length,
    featured: rows.filter(row => row.is_featured).length,
  }), [rows]);

  const selected = rows.find(row => row.id === detail) ?? null;

  return (
    <>
      <header className="ad-page-head">
        <span className="ad-eyebrow">CONTENT LIBRARY</span>
        <h1>Bio library</h1>
        <p>Every bio row in the public table, with its real visibility. Editing happens through drafts, not here.</p>
      </header>

      <Panel
        title="Bios"
        description={`Loaded in pages of ${PAGE}. Totals below describe what is on screen, not the whole table.`}
        aside={state === 'ready' ? <Badge tone="green">{rows.length} loaded</Badge> : undefined}
      >
        <Toolbar>
          <SearchField value={search} onChange={setSearch} placeholder="Search title or text" label="Search bios" />
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
        </Toolbar>

        {state !== 'ready'
          ? <StateNotice state={state === 'loading' ? 'loading' : state} error={error} reload={() => void load(false)} />
          : rows.length === 0
            ? <EmptyState
                title={search || language || active ? 'No bio matches these filters' : 'The bio table is empty'}
                text={search || language || active
                  ? 'Loosen the filters to see more. Search is a plain text match, so punctuation is matched literally.'
                  : 'The public table returned no rows. That is different from a refused read, and both are reported separately.'}
              />
            : (
              <>
                <div className="ad-stats ad-stats--tight">
                  <div className="ad-stat"><div className="ad-stat-top"><span>Visible on screen</span></div><strong>{counts.active}</strong><small>Guests can read these</small></div>
                  <div className="ad-stat"><div className="ad-stat-top"><span>Hidden on screen</span></div><strong>{counts.archived}</strong><small>Archived, still stored</small></div>
                  <div className="ad-stat"><div className="ad-stat-top"><span>Featured</span></div><strong>{counts.featured}</strong><small>Marked featured</small></div>
                  <div className="ad-stat"><div className="ad-stat-top"><span>Collections</span></div><strong>{new Set(rows.map(row => row.source_slug ?? '—')).size}</strong><small>Distinct sources on screen</small></div>
                </div>

                <div className="ad-table-wrap" tabIndex={0} role="region" aria-label="Bio library table">
                  <table className="ad-table">
                    <thead><tr><th>Collection</th><th>Language</th><th>Platform</th><th>Characters</th><th>Visibility</th><th>Updated</th><th></th></tr></thead>
                    <tbody>
                      {rows.map(row => (
                        <tr key={row.id}>
                          <td><strong>{row.source_slug ?? 'untitled'}</strong></td>
                          <td>{LANGUAGE_LABEL[row.language] ?? row.language}</td>
                          <td>{row.platform_slug ?? '—'}</td>
                          <td>{row.character_count}</td>
                          <td>
                            {row.is_active ? <Badge tone="green">Visible</Badge> : <Badge tone="red">Hidden</Badge>}
                            {row.is_featured && <span style={{ marginLeft: 6 }}><Badge tone="purple">Featured</Badge></span>}
                            {row.is_trending && <span style={{ marginLeft: 6 }}><Badge tone="amber">Trending</Badge></span>}
                          </td>
                          <td className="ad-nowrap">{formatDate(row.updated_at)}</td>
                          <td><button type="button" onClick={() => setDetail(detail === row.id ? null : row.id)}>{detail === row.id ? 'Hide' : 'Details'}</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="ad-pagination">
                  <span>{rows.length} loaded{busy ? ' — loading…' : ''}</span>
                  <div>
                    <button type="button" onClick={() => downloadCsv('bios.csv', rows as unknown as Record<string, unknown>[], ['id', 'source_slug', 'language', 'platform_slug', 'character_count', 'is_active', 'is_featured', 'updated_at'])} disabled={rows.length === 0}>
                      Download these {rows.length}
                    </button>
                    <button type="button" onClick={() => void load(true)} disabled={busy || rows.length < PAGE}>Load more</button>
                  </div>
                </div>
              </>
            )}
      </Panel>

      {selected && (
        <Panel title={`Bio ${selected.source_slug ?? selected.id.slice(0, 8)}`} description="Read-only. Changes must go through a reviewed draft." aside={<button type="button" onClick={() => setDetail(null)}>Close</button>}>
          <dl className="ad-detail" style={{ margin: 0 }}>
            <dt>Identifier</dt><dd><code className="ad-mono">{selected.id}</code></dd>
            <dt>Collection</dt><dd>{selected.source_slug ?? '—'}</dd>
            <dt>Language</dt><dd>{LANGUAGE_LABEL[selected.language] ?? selected.language}</dd>
            <dt>Category</dt><dd>{selected.category_name ?? '—'}</dd>
            <dt>Visibility</dt><dd>{selected.is_active ? 'Visible to guests' : 'Hidden from guests'}</dd>
            <dt>Created</dt><dd>{formatDate(selected.created_at)}</dd>
            <dt>Updated</dt><dd>{formatDate(selected.updated_at)}</dd>
          </dl>
          <p className="ad-muted-copy">To change this text, open a draft of the same collection, submit it for independent review, and publish it. There is deliberately no edit field on this screen.</p>
        </Panel>
      )}
    </>
  );
}
