/**
 * Public content status.
 *
 * Historically this probed Supabase REST to report whether the *database-backed*
 * public catalogue was reachable. That dependency is gone: public content now
 * ships in the bundle, so there is no remote content service to probe and a
 * database outage cannot degrade the site.
 *
 * Reporting `{ok:true}` because a database happens to be up would now be
 * misleading, so the response states what is actually true: content is bundled,
 * therefore always available, and deliberately not dependent on any database.
 *
 * The route is kept (rather than deleted) so existing monitors and
 * `scripts/smoke-hosted.mjs` keep a stable endpoint to call.
 */
let cached;

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.setHeader('Allow', 'GET');
    res.end(JSON.stringify({ error: { code: 'METHOD_NOT_ALLOWED' } }));
    return;
  }

  if (!cached || cached.expires <= Date.now()) {
    cached = {
      expires: Date.now() + 10_000,
      result: { ok: true, source: 'bundled', database_required: false },
    };
  }

  res.statusCode = 200;
  res.end(JSON.stringify(cached.result));
}
