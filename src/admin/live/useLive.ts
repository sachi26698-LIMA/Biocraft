/**
 * Shared live-data layer for the Admin modules.
 *
 * Every module reads through here, so there is exactly one place that decides
 * what "connected", "denied" and "failed" mean. The rules:
 *
 *  - a module never invents rows: while loading it says so, and on failure it
 *    says the read failed rather than showing an empty table that looks like
 *    "there is no data";
 *  - a 401/403 is reported as "not permitted for this account", never as zero
 *    results, because the two mean different things to the person reading it;
 *  - every fetch is abortable, so navigating away cannot write into unmounted
 *    state.
 *
 * Authorization is *not* decided here. The server re-checks identity, MFA
 * freshness, membership and permission for every request; this file only
 * presents the outcome honestly.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { currentSession, request, type AdminSession } from '../backend';

// Re-exported so a module can make one deliberate request without importing the
// backend layer directly and accidentally bypassing the shared error vocabulary.
export { request };

export type LiveState = 'idle' | 'loading' | 'ready' | 'denied' | 'error';

export interface LiveResult<T> {
  state: LiveState;
  data: T | null;
  error: string | null;
  reload: () => void;
}

export class PermissionError extends Error {
  constructor(message = 'Your account does not have permission for this module.') {
    super(message);
    this.name = 'PermissionError';
  }
}

/** True when a failure is an authorization decision rather than a fault. */
export function isDenied(error: unknown): boolean {
  const code = (error as { code?: unknown } | null)?.code;
  const status = (error as { status?: unknown } | null)?.status;
  return code === 'FORBIDDEN' || code === 'UNAUTHENTICATED' || status === 401 || status === 403;
}

export function describeError(error: unknown): string {
  const code = (error as { code?: unknown } | null)?.code;
  if (isDenied(error)) return 'Your account does not have permission for this module.';
  if (code === 'RATE_LIMITED') return 'Too many requests just now. Wait a moment and try again.';
  if (code === 'UNAVAILABLE') return 'The Admin service is not reachable right now.';
  if (code === 'INVALID') return 'The request was rejected as invalid.';
  if (typeof code === 'string' && code.length > 0) return `The request failed (${code}).`;
  return 'The request failed. Try again.';
}

/**
 * A paged read that can append.
 *
 * The server pages by cursor, so "next page" means "ask for what comes after the
 * last row I hold" — never an offset that could skip a row if something changed
 * in between. `loadMore` appends; `reload` starts over.
 */
export function usePaged<T>(path: string | null, take: (last: T | null) => string | null): LiveResult<T[]> & { loadMore: () => void; hasMore: boolean } {
  const [state, setState] = useState<LiveState>('idle');
  const [rows, setRows] = useState<T[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [cursor, setCursor] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);
  const [more, setMore] = useState(false);
  const [appending, setAppending] = useState(false);
  const live = useRef(true);

  useEffect(() => {
    live.current = true;
    return () => { live.current = false; };
  }, []);

  useEffect(() => {
    if (!path) { setState('idle'); setRows([]); setError(null); return; }
    const controller = new AbortController();
    setState('loading');
    setError(null);
    setCursor(null);
    setMore(false);
    request<{ items: T[] }>(path, { signal: controller.signal })
      .then(body => {
        if (!live.current || controller.signal.aborted) return;
        const items = Array.isArray(body.items) ? body.items : [];
        setRows(items);
        // A full page means the server may hold more; a short page means it does not.
        setMore(items.length > 0);
        setState('ready');
      })
      .catch((cause: unknown) => {
        if (!live.current || controller.signal.aborted) return;
        setRows([]);
        setState(isDenied(cause) ? 'denied' : 'error');
        setError(describeError(cause));
      });
    return () => controller.abort();
  }, [path, nonce]);

  const loadMore = useCallback(() => {
    if (!path || appending) return;
    const last = rows.length > 0 ? rows[rows.length - 1] : null;
    const next = take(last);
    if (!next) { setMore(false); return; }
    if (next === cursor) return;
    setAppending(true);
    setCursor(next);
    const separator = path.includes('?') ? '&' : '?';
    request<{ items: T[] }>(`${path}${separator}after=${encodeURIComponent(next)}`)
      .then(body => {
        if (!live.current) return;
        const items = Array.isArray(body.items) ? body.items : [];
        setRows(previous => [...previous, ...items]);
        setMore(items.length > 0);
      })
      .catch((cause: unknown) => { if (live.current) setError(describeError(cause)); })
      .finally(() => { if (live.current) setAppending(false); });
  }, [path, rows, cursor, appending, take]);

  const reload = useCallback(() => setNonce(value => value + 1), []);
  return { state, data: state === 'ready' ? rows : null, error, reload, loadMore, hasMore: more };
}

/** POST/PUT a write and report what happened, without pretending it worked. */
export async function mutate<T>(path: string, body: unknown, method: 'POST' | 'PUT' | 'PATCH' = 'POST'): Promise<T> {
  return request<T>(path, { method, body: JSON.stringify(body) });
}

/** GET a path and report the outcome without ever fabricating data. */
export function useLive<T>(path: string | null, signalKey = 0): LiveResult<T> {
  const [state, setState] = useState<LiveState>('idle');
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);
  const live = useRef(true);

  useEffect(() => {
    live.current = true;
    return () => { live.current = false; };
  }, []);

  useEffect(() => {
    if (!path) { setState('idle'); setData(null); setError(null); return; }
    const controller = new AbortController();
    setState('loading');
    setError(null);
    request<T>(path, { signal: controller.signal })
      .then(body => {
        if (!live.current || controller.signal.aborted) return;
        setData(body);
        setState('ready');
      })
      .catch((cause: unknown) => {
        if (!live.current || controller.signal.aborted) return;
        setData(null);
        setState(isDenied(cause) ? 'denied' : 'error');
        setError(describeError(cause));
      });
    return () => controller.abort();
  }, [path, signalKey, nonce]);

  const reload = useCallback(() => setNonce(value => value + 1), []);
  return { state, data, error, reload };
}

/** A write action with its own pending / message state, so a button can never
 * look like it succeeded while the request is still in flight. */
export function useAction() {
  const [pending, setPending] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [failure, setFailure] = useState<string | null>(null);

  const run = useCallback(async <R,>(key: string, work: () => Promise<R>, success: (result: R) => string): Promise<R | null> => {
    setPending(key);
    setMessage(null);
    setFailure(null);
    try {
      const result = await work();
      setMessage(success(result));
      return result;
    } catch (error) {
      setFailure(describeError(error));
      return null;
    } finally {
      setPending(null);
    }
  }, []);

  return { pending, message, failure, run, clear: () => { setMessage(null); setFailure(null); } };
}

export function formatNumber(value: unknown): string {
  const number = Number(value);
  return Number.isFinite(number) ? number.toLocaleString() : '—';
}

export function formatDate(value: unknown): string {
  if (typeof value !== 'string' && !(value instanceof Date)) return '—';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString(undefined, { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });
}

export function formatDay(value: unknown): string {
  if (typeof value !== 'string') return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
}

/** Download rows the user is already authorised to read. No new permission and
 * no server round-trip: this only serialises what is on screen. */
export function downloadCsv(name: string, rows: readonly Record<string, unknown>[], columns: readonly string[]): number {
  if (rows.length === 0) return 0;
  const escape = (value: unknown) => {
    const text = value === null || value === undefined ? '' : typeof value === 'object' ? JSON.stringify(value) : String(value);
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  const csv = [columns.join(','), ...rows.map(row => columns.map(column => escape(row[column])).join(','))].join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  return rows.length;
}

/**
 * The signed-in account, read once per mount.
 *
 * This is deliberately not `useLive('/session')`: the session endpoint answers
 * `null` for "no session", which is a different outcome from "the request
 * failed", and it is not a paged list. Reporting it separately keeps a signed-in
 * administrator from seeing an error where the truth is simply "signed out".
 */
export function useSession(): LiveResult<AdminSession> {
  const [state, setState] = useState<LiveState>('loading');
  const [data, setData] = useState<AdminSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);
  const live = useRef(true);

  useEffect(() => {
    live.current = true;
    return () => { live.current = false; };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setState('loading');
    setError(null);
    currentSession(controller.signal)
      .then(session => {
        if (!live.current || controller.signal.aborted) return;
        if (!session) { setData(null); setState('denied'); setError('You are not signed in to the Admin console.'); return; }
        setData(session);
        setState('ready');
      })
      .catch((cause: unknown) => {
        if (!live.current || controller.signal.aborted) return;
        setData(null);
        setState(isDenied(cause) ? 'denied' : 'error');
        setError(describeError(cause));
      });
    return () => controller.abort();
  }, [nonce]);

  const reload = useCallback(() => setNonce(value => value + 1), []);
  return { state, data, error, reload };
}
