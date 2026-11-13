/**
 * Contracts only: no endpoint, token or privileged client exists in this build.
 * Future implementations must perform authentication and permission checks on
 * the server for every operation; this interface is not an authorization gate.
 */
export type AdminRole = 'super_admin' | 'admin' | 'content_manager' | 'editor' | 'seo_manager' | 'moderator' | 'analyst' | 'auditor';
export interface AdminSession {
  userId: string;
  role: AdminRole;
  permissions: readonly string[];
  expiresAt: string;
  assuranceLevel: 'aal2';
}
export interface AdminError { code: string; message: string; requestId?: string }
export interface AdminPage<T> { items: T[]; nextCursor: string | null; asOf: string }
export interface AdminApi {
  /** The server must verify identity, MFA and live membership. */
  session(signal?: AbortSignal): Promise<AdminSession>;
  /** The server enforces scoped permissions; the browser must not infer them. */
  listBios(query: { search?: string; language?: 'en' | 'hi' | 'hg'; cursor?: string; limit?: number }, signal?: AbortSignal): Promise<AdminPage<unknown>>;
  logout(): Promise<void>;
}
/** Hard-coded fail-closed status until a separately reviewed adapter is approved. */
export const adminBackend = { status: 'unavailable', reason: 'Administrative access is not configured or enabled.' } as const;
