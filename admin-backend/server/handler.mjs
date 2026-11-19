// Serverless entry point for the Admin API (Vercel Node runtime).
//
// The deployed rewrite routes /api/admin/v1/* to api/admin/handler.mjs, which
// calls this adapter. It returns 503 unless
// ADMIN_BACKEND_ENABLED=true and all reviewed server-only settings are present.
// It never serves static files and never exposes a provider or database secret.
import {createAdminApp} from './app.mjs';
import {toWebRequest,sendResponse} from './node-adapter.mjs';

let cached;
/** Test seam: build a handler with an injected app (no process cache). */
export function createHandler(instance,{secret}={}) {
  if (typeof instance!=='function') throw new Error('app required');
  if (typeof instance.configuration!=='object') throw new Error('app configuration required');
  return async function handle(req,res) {
    if (instance.configuration?.enabled!==true) return unavailable(res,instance.configuration?.reason);
    try {
      if (!Buffer.isBuffer(secret)||secret.length!==32) return unavailable(res,'missing trusted client header');
      const request=toWebRequest(req,{origin:instance.configuration.origin,secret});
      await sendResponse(res,await instance(request));
    } catch { unavailable(res,'runtime'); }
  };
}

/** Emit the unavailable response, naming the failing stage when it is known.
 *
 * Previously this function discarded the app's `configuration.reason`, so a
 * closed configuration gate and a failed database round-trip produced byte-for
 * byte identical 503 bodies. That made the deployed outage impossible to
 * diagnose from outside without reading the platform logs: the operator could
 * see "503" and nothing else. `stage` is a fixed identifier from app.mjs's own
 * vocabulary (disabled, invalid origin, missing database credentials, invalid
 * database configuration, ...) and never contains an environment value or a
 * secret, so reporting it is safe. The leading `{error:{code:'UNAVAILABLE'}}`
 * shape is preserved for clients and for the existing regression tests. */
const publicStages=new Set(['disabled','unverified TLS','invalid origin','invalid keys','missing publishable key',
  'missing database credentials','missing admin allow-list','missing trusted client header',
  'invalid provider configuration','invalid database configuration','invalid storage','invalid configuration','runtime']);
function unavailable(res,stage) {
  res.statusCode=503;
  res.setHeader('cache-control','no-store');
  res.setHeader('content-type','application/json; charset=utf-8');
  if (publicStages.has(stage)) {
    res.setHeader('x-admin-stage',stage);
    res.end(JSON.stringify({error:{code:'UNAVAILABLE',stage}}));
    return;
  }
  res.end(JSON.stringify({error:{code:'UNAVAILABLE'}}));
}

export default async function handler(req,res) {
  try {
    if (!cached) {
      const instance=createAdminApp();
      cached=createHandler(instance,{secret:instance.configuration.enabled ? Buffer.from(process.env.ADMIN_INGRESS_SECRET_HEX,'hex') : null});
    }
  } catch {
    return unavailable(res,'invalid configuration');
  }
  return cached(req,res);
}
