import { useState, type FormEvent } from 'react';

type Scratch = { id: number; text: string; language: 'en' | 'hi' | 'hg'; state: 'draft' | 'review' };
const labels = { en: 'English', hi: 'Hindi', hg: 'Hinglish' };

/** A deliberately ephemeral UI exercise. Never talks to a database or storage. */
export default function DraftScratch() {
  const [items, setItems] = useState<Scratch[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [editing, setEditing] = useState<number | null>(null);
  const [text, setText] = useState('');
  const [language, setLanguage] = useState<Scratch['language']>('en');
  const [sequence, setSequence] = useState(0);
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('all');
  const reset = () => { setEditing(null); setText(''); setLanguage('en'); };
  function save(event: FormEvent) {
    event.preventDefault();
    const value = text.trim();
    if (!value) { setMessage('Enter text before saving a local draft.'); return; }
    if (editing !== null) {
      setItems(old => old.map(item => item.id === editing ? { ...item, text: value, language, state: 'draft' } : item));
      setMessage('Local draft updated. Its local review marker was cleared.');
    } else {
      const id = sequence + 1; setSequence(id);
      setItems(old => [...old, { id, text: value, language, state: 'draft' }]);
      setMessage('Local draft added in this browser tab only.');
    }
    reset();
  }
  const rows = items.filter(item => filter === 'all' || item.state === filter);
  const remove = (ids: number[]) => {
    setItems(old => old.filter(item => !ids.includes(item.id)));
    setSelected(old => old.filter(id => !ids.includes(id)));
    if (editing !== null && ids.includes(editing)) reset();
    setMessage(`${ids.length} local scratch ${ids.length === 1 ? 'item' : 'items'} discarded; public content was not changed.`);
  };
  return <section className="ad-panel ad-scratch" aria-labelledby="scratch-title">
    <div className="ad-panel-head"><div><h2 id="scratch-title">Browser-only draft scratchpad</h2><p>Practice the form only: data stays in memory, is lost when you leave this page or refresh, and is never sent, stored, reviewed by anyone, or published.</p></div><span className="ad-badge ad-badge--amber">Not connected</span></div>
    <form onSubmit={save} className="ad-form">
      <label>Bio text<textarea value={text} maxLength={3000} onChange={event => setText(event.target.value)} rows={4} required /></label>
      <label>Language<select value={language} onChange={event => setLanguage(event.target.value as Scratch['language'])}><option value="en">English</option><option value="hi">Hindi</option><option value="hg">Hinglish</option></select></label>
      <div className="ad-action-row"><button type="submit">{editing === null ? 'Add local draft' : 'Update local draft'}</button>{editing !== null && <button type="button" onClick={reset}>Cancel editing</button>}</div>
    </form>
    <p role="status" className="ad-status-message">{message}</p>
    <div className="ad-toolbar"><label className="ad-select-label"><span className="ad-sr">Filter local drafts by marker</span><select aria-label="Filter local drafts by marker" value={filter} onChange={e => setFilter(e.target.value)}><option value="all">All local markers</option><option value="draft">Local draft</option><option value="review">Local review marker</option></select></label><button type="button" disabled={!selected.length} onClick={() => remove(selected)}>Discard selected local items ({selected.length})</button></div>
    <div className="ad-table-wrap" role="region" aria-label="Local draft scratchpad" tabIndex={0}><table className="ad-table"><thead><tr><th scope="col">Select</th><th scope="col">Text</th><th scope="col">Language</th><th scope="col">Local marker</th><th scope="col">Actions</th></tr></thead><tbody>{rows.map(item => <tr key={item.id}><td><input type="checkbox" aria-label={`Select local item ${item.id}`} checked={selected.includes(item.id)} onChange={e => setSelected(old => e.target.checked ? [...old, item.id] : old.filter(id => id !== item.id))}/></td><td className="ad-bio-text">{item.text}</td><td>{labels[item.language]}</td><td>{item.state === 'draft' ? 'Local draft' : 'Local review marker'}</td><td><div className="ad-action-row"><button type="button" onClick={() => { setEditing(item.id); setText(item.text); setLanguage(item.language); setMessage('Editing a local scratch item.'); }}>Edit local item {item.id}</button><button type="button" onClick={() => { setItems(old => old.map(row => row.id === item.id ? {...row, state: row.state === 'draft' ? 'review' : 'draft'} : row)); setMessage('Only the local marker changed; no review request was sent.'); }}>{item.state === 'draft' ? 'Mark for local review' : 'Return to local draft'} {item.id}</button><button type="button" onClick={() => remove([item.id])}>Discard local item {item.id}</button></div></td></tr>)}</tbody></table>{!rows.length && <div className="ad-empty-table">No local scratch items match. Nothing here is saved to BioCraft.</div>}</div>
  </section>;
}
