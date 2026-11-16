// Vercel Node function entry for the Admin API.
//
// Vercel's filesystem routing cannot express `/api/admin/v1/<anything>` with a
// single file outside Next.js, so `vercel.json` rewrites every Admin API path to
// this function and forwards the remainder of the path in `__admin_path`.
// This module rebuilds the original request path and strips the marker, so the
// application sees exactly the URL the browser called (including its query
// string, which the API validates strictly).
//
// With no reviewed configuration (ADMIN_BACKEND_ENABLED unset) every request
// receives 503 and no database or provider client is created. No secret is read
// at module scope, and nothing here can serve a file from disk.
import handler from '../../admin-backend/server/handler.mjs';

const PREFIX = '/api/admin/v1';
const MARKER = '__admin_path';

/** Rebuild the browser-facing URL from the rewrite marker.
 * `/api/admin/handler?__admin_path=health` -> `/api/admin/v1/health`.
 * Client query parameters are preserved; the marker never reaches the app. */
export function restoreAdminUrl(url) {
  const raw = typeof url === 'string' ? url : '';
  const index = raw.indexOf('?');
  const query = index === -1 ? '' : raw.slice(index + 1);
  const params = new URLSearchParams(query);
  const forwarded = params.get(MARKER);
  if (forwarded === null) {
    // No rewrite marker: the legacy single-path rewrite is in use.
    return raw.startsWith(`${PREFIX}/proxy`) ? PREFIX + raw.slice(PREFIX.length + '/proxy'.length) : raw;
  }
  params.delete(MARKER);
  // Vercel's rewrite also emits `path=$1` (`?__admin_path=$1&path=$1`). That
  // second parameter is the captured route, not a client parameter, so it must
  // be dropped: the API rejects unknown query keys outright, and leaving it in
  // made every paged read answer 400 INVALID on the real deployment. It is only
  // removed when it duplicates the captured route, so a genuine client `path`
  // parameter is never silently swallowed.
  if (params.get('path') === forwarded) params.delete('path');
  // A captured path is a relative remainder and must never escape the prefix.
  const remainder = forwarded.replace(/^\/+/, '');
  if (remainder.split('/').some(segment => segment === '..' || segment === '.')) return `${PREFIX}/`;
  const search = params.toString();
  return `${PREFIX}/${remainder}${search ? `?${search}` : ''}`;
}

export default function entry(req, res) {
  try { req.url = restoreAdminUrl(req.url); } catch { req.url = `${PREFIX}/`; }
  return handler(req, res);
}
