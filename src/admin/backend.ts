/**
 * Admin backend client contracts.
 *
 * The browser NEVER receives a provider access token, refresh token or database
 * credential: the server keeps those in an HttpOnly, encrypted cookie and a
 * server-side session row. This module therefore talks to same-origin
 * `/api/admin/v1/*` endpoints with `credentials: 'same-origin'` and a CSRF
 * header taken from the server.
 *
 * Coverage today: only the session/probe endpoints exist in this build. Every
 * write path fails closed with `backend_unavailable` until the reviewed server
 * is deployed and its database grants are approved. Nothing here is an
 * authorization gate — the server re-checks identity, MFA freshness, membership
 * and permissions for every request.
 */
export type AdminRole = 'super_admin' | 'admin' | 'content_manager' | 'editor' | 'seo_manager' | 'moderator' | 'analyst' | 'auditor';
export interface AdminSession {
  userId: string;
  roles: readonly AdminRole[];
  permissions: readonly string[];
  expiresAt: string;
  assuranceLevel: 'aal2';
}
export interface AdminError { code: string; message: string; requestId?: string }
export interface AdminPage<T> { items: T[]; nextCursor: string | null; asOf: string }
export interface AdminApi {
  session(signal?: AbortSignal): Promise<AdminSession>;
  listBios(query: { search?: string; language?: 'en' | 'hi' | 'hg'; cursor?: string; limit?: number }, signal?: AbortSignal): Promise<AdminPage<unknown>>;
  logout(): Promise<void>;
}

export const ADMIN_BASE = '/api/admin/v1';
export type BackendStatus = 'unavailable' | 'ready' | 'unauthenticated';

class AdminRequestError extends Error implements AdminError {
  code: string; requestId?: string; status: number;
  constructor(code: string, status: number, requestId?: string) { super(code); this.name = 'AdminRequestError'; this.code = code; this.status = status; this.requestId = requestId; }
}

let csrfToken: string | null = null;

/** Probe the deployed server. Absent endpoints (404 from the static host) and
 * network failures both resolve to `unavailable`: a missing backend must never
 * be presented as a working one. */
export async function probeBackend(signal?: AbortSignal): Promise<BackendStatus> {
  try {
    const response = await fetch(`${ADMIN_BASE}/health`, { credentials: 'same-origin', headers: { accept: 'application/json' }, signal });
    if (response.status === 503) return 'unavailable';
    if (!response.ok) return 'unavailable';
    const body = await response.json().catch(() => null);
    if (body?.ok !== true) return 'unavailable';
    const session = await currentSession(signal);
    return session ? 'ready' : 'unauthenticated';
  } catch { return 'unavailable'; }
}

export async function currentSession(signal?: AbortSignal): Promise<AdminSession | null> {
  const response = await fetch(`${ADMIN_BASE}/session`, { credentials: 'same-origin', headers: { accept: 'application/json' }, signal });
  if (response.status === 401 || response.status === 403) return null;
  if (!response.ok) throw new AdminRequestError('UNAVAILABLE', response.status);
  const body = await response.json().catch(() => null);
  const userId = body?.user?.id;
  if (typeof userId !== 'string') throw new AdminRequestError('INVALID_RESPONSE', response.status);
  return {
    userId,
    roles: Array.isArray(body.user.roles) ? body.user.roles : [],
    permissions: Array.isArray(body.user.permissions) ? body.user.permissions : [],
    expiresAt: String(body.expires_at ?? ''),
    assuranceLevel: 'aal2',
  };
}

async function csrf(): Promise<string> {
  if (csrfToken) return csrfToken;
  const response = await fetch(`${ADMIN_BASE}/csrf`, { credentials: 'same-origin', headers: { accept: 'application/json' } });
  if (!response.ok) throw new AdminRequestError('UNAUTHENTICATED', response.status);
  const body = await response.json().catch(() => null);
  if (typeof body?.csrf !== 'string') throw new AdminRequestError('INVALID_RESPONSE', response.status);
  csrfToken = body.csrf as string;
  return csrfToken;
}

export async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const method = (init.method ?? 'GET').toUpperCase();
  const headers = new Headers(init.headers);
  headers.set('accept', 'application/json');
  if (method !== 'GET' && method !== 'HEAD') {
    headers.set('content-type', 'application/json');
    headers.set('x-csrf-token', await csrf());
  }
  const response = await fetch(`${ADMIN_BASE}${path}`, { ...init, method, headers, credentials: 'same-origin' });
  if (response.status === 401 || response.status === 403 && method !== 'GET') csrfToken = null;
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new AdminRequestError(body?.error?.code ?? 'UNAVAILABLE', response.status, body?.error?.request_id);
  return body as T;
}

/** The Admin UI keeps every privileged module disabled until the server is
 * reachable, configured for this exact origin and the caller holds a session. */
export const adminBackend = {
  status: 'unavailable' as BackendStatus,
  reason: 'Administrative access is not enabled for this deployment.',
  probe: probeBackend,
  session: currentSession,
  request,
} as const;
