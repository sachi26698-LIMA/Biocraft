import { useEffect, useRef, useState } from 'react';
import CopyButton from './CopyButton';
import { isSupabaseConfigured } from '../lib/supabase';
import { readPublishedCatalog, type CatalogItem, type CatalogKind } from '../lib/publishedCatalog';
import type { Language } from '../types';

type Props = { kind: CatalogKind; language?: Language; tone?: string };
const titles = { captions: 'Published captions', hashtags: 'Published hashtags', fonts: 'Published font samples' };

export default function PublishedCatalog(props: Props) {
  if (!isSupabaseConfigured) return null;
  // A filter change must never append a response from the previous filter.
  return <Shelf key={`${props.kind}/${props.language}/${props.tone}`} {...props} />;
}

function Shelf({ kind, language, tone }: Props) {
  const request = useRef<AbortController>();
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [next, setNext] = useState<string>();
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => () => request.current?.abort(), []);

  async function load(after?: string) {
    if (request.current && !request.current.signal.aborted) return;
    const controller = new AbortController();
    request.current = controller;
    setBusy(true);
    setError(false);
    try {
      const page = await readPublishedCatalog(kind, { language, tone }, after, controller.signal);
      if (controller.signal.aborted) return;
      setItems(current => after ? [...current, ...page.items] : page.items);
      setNext(page.next);
      setLoaded(true);
    } catch {
      if (!controller.signal.aborted) setError(true);
    } finally {
      if (!controller.signal.aborted) {
        request.current = undefined;
        setBusy(false);
      }
    }
  }

  return (
    <section className="results-block" aria-label={titles[kind]}>
      <h2 className="results-title">{titles[kind]}</h2>
      <p className="tool-note">Browse active entries from the BioCraft catalogue. Your generator inputs stay on this device.</p>
      {items.length > 0 && <ul className="results-list">
        {items.map(item => <li key={item.id} className="bio-card">
          {item.title && item.title !== item.text && <strong>{item.title}</strong>}
          <p className="bio-content" style={{ overflowWrap: 'anywhere', whiteSpace: 'pre-wrap' }}>{item.text}</p>
          <CopyButton text={item.text} ariaLabel={`Copy ${kind === 'fonts' ? 'font sample' : kind.slice(0, -1)}`} />
        </li>)}
      </ul>}
      {loaded && items.length === 0 && <p role="status">No published entries match these options.</p>}
      {error && <p role="status">Could not load the published catalogue. You can still use the generator.</p>}
      {(!loaded || next) && <button type="button" className="btn btn-secondary" disabled={busy} onClick={() => void load(next)}>
        {busy ? 'Loading…' : error ? 'Retry catalogue' : loaded ? 'Load more' : 'Browse published entries'}
      </button>}
    </section>
  );
}
