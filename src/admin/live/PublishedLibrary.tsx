import { useState } from 'react';
import { EmptyState, Panel, SegmentedControl, StateNotice } from './common';
import { usePaged } from './useLive';

export type Kind = 'captions' | 'hashtags' | 'fonts' | 'designs' | 'templates' | 'emoji' | 'symbols' | 'languages';
const endpoints: Record<Kind, string> = {captions:'captions', hashtags:'hashtags', fonts:'fonts', designs:'designs', templates:'templates', emoji:'published/emoji', symbols:'published/symbols', languages:'published/languages'};
type Row = { id: string; title?: string | null; text?: string | null; language?: string; tone?: string; font_type?: string; popularity?: string; detail?: string; license_code?: string; attribution?: string };
const takeId = (row: Row | null) => row?.id ?? null;
const options = [
  { value: 'captions', label: 'Captions' },
  { value: 'hashtags', label: 'Hashtags' },
  { value: 'fonts', label: 'Fonts' },
] as const;

export default function PublishedLibrary() {
  const [kind, setKind] = useState<Kind>('captions');
  return <Panel title="Published catalogue" description="Active database entries. Public tools use bundled content; this view does not change it.">
    <SegmentedControl ariaLabel="Catalogue type" value={kind} onChange={value => setKind(value as Kind)} options={[...options]} />
    <Entries key={kind} kind={kind} />
  </Panel>;
}

export function Entries({ kind }: { kind: Kind }) {
  const list = usePaged<Row>(`/${endpoints[kind]}?limit=25`, takeId);
  const entries = list.data ?? [];
  return <>
    <StateNotice state={list.state} error={list.error} reload={list.reload} />
    {list.state === 'ready' && (entries.length === 0 ? <EmptyState icon="bios" title="No active entries" text="The published catalogue returned no rows." /> :
      <div className="ad-table-wrap" tabIndex={0} role="region" aria-label={`Published ${kind}`}>
        <table className="ad-table">
          <thead><tr><th>Entry</th><th>Details</th></tr></thead>
          <tbody>{entries.map(row => <tr key={row.id}>
            <td style={{ overflowWrap: 'anywhere', whiteSpace: 'pre-wrap' }}>{row.title && <strong>{row.title} </strong>}{row.text}</td>
            <td>{[row.language, row.tone, row.popularity, row.font_type, row.detail, row.license_code, row.attribution].filter(Boolean).join(' · ')}</td>
          </tr>)}</tbody>
        </table>
      </div>)}
    {list.state === 'ready' && list.error && <p role="status">{list.error}</p>}
    {list.hasMore && <button type="button" className="ad-btn ad-btn--secondary" disabled={list.loadingMore} onClick={list.loadMore}>{list.loadingMore ? 'Loading…' : list.error ? 'Retry page' : 'Load more'}</button>}
  </>;
}
