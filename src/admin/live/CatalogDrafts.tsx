import { useState, type FormEvent } from 'react';
import { useAdminContext } from '../context';
import { CursorPager, Field, Panel, StateNotice } from './common';
import { describeError, mutate, usePaged } from './useLive';

type Row = {id:string; resource_key:string; title:string; notes:string; source_label:string; license_code:string; row_version:number};
type Fields = {key:string; title:string; notes:string; source:string; license:string};
const blank: Fields = {key:'', title:'', notes:'', source:'', license:''};
const cursor=(row:Row|null)=>row?.id ?? null;

export default function CatalogDrafts({domain}: {domain:string}) {
  const {session}=useAdminContext();
  const list=usePaged<Row>(`/catalog-drafts?domain=${encodeURIComponent(domain)}&limit=25`,cursor);
  const [edit,setEdit]=useState<Row|null>(null), [fields,setFields]=useState<Fields>(blank);
  const [confirm,setConfirm]=useState<string|null>(null), [opened,setOpened]=useState(false);
  const [pending,setPending]=useState(false), [message,setMessage]=useState('');
  const writable=session?.sharedWrites===true && !pending && list.state==='ready';
  const field=(name:keyof Fields,value:string)=>setFields(f=>({...f,[name]:value}));
  function open(row:Row|null) {
    setEdit(row);setMessage('');setConfirm(null);setOpened(true);
    setFields(row?{key:row.resource_key,title:row.title,notes:row.notes,source:row.source_label,license:row.license_code}:blank);
  }
  function reset() {setOpened(false);setEdit(null);setFields(blank);setConfirm(null);}
  async function save(e:FormEvent) {
    e.preventDefault(); if(!writable)return; setPending(true);setMessage('');
    try {
      await mutate(edit?`/catalog-drafts/${edit.id}`:'/catalog-drafts',{domain,fields,...(edit?{expectedVersion:edit.row_version}:{})},edit?'PUT':'POST');
      reset();setMessage('Private draft saved. No published record changed.');list.reload();
    } catch(error){setMessage((error as {code?:string})?.code==='CONFLICT'?'The key exists or this version changed. Reload the drafts before trying again.':describeError(error));}
    finally{setPending(false);}
  }
  async function archive(row:Row) {
    if(!writable || confirm!==row.id)return;setPending(true);setMessage('');
    try {
      await mutate(`/catalog-drafts/${row.id}`,{domain,expectedVersion:row.row_version},'DELETE');
      reset();setMessage('Private draft archived. The record and audit entry were kept.');list.reload();
    } catch(error){setMessage(describeError(error));} finally{setPending(false);}
  }
  return <Panel title="My catalogue drafts" description="Private metadata proposals only. A draft does not publish content or verify redistribution rights." aside={<button className="ad-btn ad-btn--secondary" disabled={pending} onClick={()=>{reset();list.reload();}}>Reload drafts</button>}>
    <StateNotice state={list.state} error={list.error} reload={list.reload}/>
    {list.state==='ready' && <>
      {!list.data?.length && <p>No active private drafts in this module.</p>}
      {list.data?.map(row=><div key={row.id} className="ad-panel ad-catalog-draft">
        <strong>{row.title}</strong> <small>{row.resource_key} · v{row.row_version}</small>
        <p>{row.notes}</p><p>Source: {row.source_label} · Declared licence: {row.license_code}</p>
        {writable && <div className="ad-toolbar">
          <button className="ad-btn ad-btn--secondary" onClick={()=>open(row)}>Edit draft</button>
          {confirm===row.id?<><button className="ad-btn ad-btn--secondary" onClick={()=>void archive(row)}>Confirm archive</button><button className="ad-btn" onClick={()=>setConfirm(null)}>Keep draft</button></>:<button className="ad-btn" onClick={()=>setConfirm(row.id)}>Archive draft</button>}
        </div>}
      </div>)}
      <CursorPager count={list.data?.length??0} hasNext={list.hasMore} loading={list.loadingMore} onNext={list.loadMore} onReset={list.reload}/>
      {session?.sharedWrites===true && (!opened?<button className="ad-btn ad-btn--primary" disabled={!writable} onClick={()=>open(null)}>New private draft</button>:
        <form className="ad-form" onSubmit={save}>
          <div className="ad-form-grid">
            <Field label="Resource key"><input value={fields.key} pattern={'[a-z0-9][a-z0-9_\\-]{0,99}'} maxLength={100} required onChange={e=>field('key',e.target.value)}/></Field>
            <Field label="Draft title"><input value={fields.title} maxLength={200} required onChange={e=>field('title',e.target.value)}/></Field>
            <Field label="Source or attribution"><input value={fields.source} maxLength={300} required onChange={e=>field('source',e.target.value)}/></Field>
            <Field label="Declared licence"><input value={fields.license} maxLength={64} required onChange={e=>field('license',e.target.value)}/></Field>
          </div>
          <Field label="Draft notes"><textarea value={fields.notes} maxLength={4000} onChange={e=>field('notes',e.target.value)}/></Field>
          <div className="ad-toolbar"><button className="ad-btn ad-btn--primary" disabled={!writable}>{edit?'Save changes':'Create private draft'}</button><button className="ad-btn" disabled={pending} type="button" onClick={reset}>Cancel</button></div>
        </form>)}
    </>}
    {message && <p role="status">{message}</p>}
  </Panel>;
}
