// Serverless entry point for the Admin API (Vercel Node runtime).
//
// This file is NOT wired into the deployed Preview: it is only reachable if
// Vercel routes /api/admin/* to it, and it returns 503 for every request unless
// ADMIN_BACKEND_ENABLED=true and all reviewed server-only settings are present.
// It never serves static files and never exposes a provider or database secret.
import {createAdminApp} from './app.mjs';
import {toWebRequest,sendResponse} from './node-adapter.mjs';

let cached;

function app(env=process.env) {
  if (cached) return cached;
  cached=createAdminApp({env});
  return cached;
}
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
function unavailable(res,stage) {
  res.statusCode=503;
  res.setHeader('cache-control','no-store');
  res.setHeader('content-type','application/json; charset=utf-8');
  if (typeof stage==='string' && /^[a-z][a-z0-9 -]{0,63}$/.test(stage)) {
    res.setHeader('x-admin-stage',stage);
    res.end(JSON.stringify({error:{code:'UNAVAILABLE',stage}}));
    return;
  }
  res.end(JSON.stringify({error:{code:'UNAVAILABLE'}}));
}

export default async function handler(req,res) {
  let instance;
  try { instance=app(); }
  catch { return unavailable(res,'invalid configuration'); }
  if (instance.configuration?.enabled!==true) return unavailable(res,instance.configuration?.reason);
  try {
    const secret=Buffer.from(process.env.ADMIN_INGRESS_SECRET_HEX,'hex');if(secret.length!==32)throw Error('invalid ingress secret');
    const request=toWebRequest(req,{origin:instance.configuration.origin,secret});
    await sendResponse(res,await instance(request));
  } catch {
    unavailable(res,'runtime');
  }
}
