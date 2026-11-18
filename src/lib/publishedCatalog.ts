import { supabase } from './supabase';
import type { Language } from '../types';

export type CatalogKind = 'captions' | 'hashtags' | 'fonts';
export type CatalogItem = { id: string; title: string | null; text: string };
const PAGE_SIZE = 12;
const UUID = /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i;

// RLS is the actual publication boundary, not this browser filter. This service
// never sends text typed into a generator, or queries a private Admin table.
export async function readPublishedCatalog(kind: CatalogKind, filters: { language?: Language; tone?: string } = {}, after?: string, signal?: AbortSignal) {
  if (!supabase) throw new Error('Public catalogue not configured');
  if (after && !UUID.test(after)) throw new Error('Invalid catalogue cursor');
  const columns: Record<CatalogKind, string> = {
    captions: 'id,title,text:content',
    hashtags: 'id,text:tag',
    fonts: 'id,title:name,text:preview_text',
  } as const;
  let query = supabase.from(kind).select(columns[kind]).eq('is_active', true).order('id').limit(PAGE_SIZE + 1).retry(false);
  if (kind !== 'fonts' && filters.language) query = query.eq('language', filters.language);
  if (kind === 'captions' && filters.tone) query = query.eq('tone', filters.tone);
  if (after) query = query.gt('id', after);
  const timeout = AbortSignal.timeout(7000);
  query = query.abortSignal(signal ? AbortSignal.any([signal, timeout]) : timeout);
  const { data, error } = await query.overrideTypes<Array<{id: string; text: string | null; title?: string | null}>, {merge: false}>();
  if (error || !data) throw new Error('Published catalogue unavailable');
  const items = data.slice(0, PAGE_SIZE).map(row => {
    if (!UUID.test(row.id) || (row.text !== null && typeof row.text !== 'string')) throw new Error('Invalid catalogue row');
    const title = 'title' in row && typeof row.title === 'string' ? row.title : null;
    const text = row.text || title || '';
    return { id: row.id, title, text: kind === 'hashtags' && !text.startsWith('#') ? `#${text}` : text };
  });
  return { items, next: data.length > PAGE_SIZE ? items[items.length - 1]?.id : undefined };
}
