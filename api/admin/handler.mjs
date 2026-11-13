// Vercel Node function entry for the Admin API.
//
// Vercel rewrites only the fixed path `/api/admin/v1/proxy` here, so the
// function cannot be reached at arbitrary URLs. The original Admin API path is
// re-attached below. With no reviewed configuration (ADMIN_BACKEND_ENABLED
// unset) every request receives 503 and no database or provider client is
// created. No secret is read at module scope.
import handler from '../../admin-backend/server/handler.mjs';

export default function entry(req, res) {
  // Only the query string is preserved from the rewrite target; the Admin API
  // currently uses none, and the app rejects any unexpected query on auth routes.
  if (req.url?.startsWith('/api/admin/v1/proxy')) {
    const query = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
    req.url = '/api/admin/v1' + query;
  }
  return handler(req, res);
}
