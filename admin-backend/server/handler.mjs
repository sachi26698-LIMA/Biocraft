// Serverless entry point for the Admin API (Vercel Node runtime).
//
// This file is NOT wired into the deployed Preview: it is only reachable if
// Vercel routes /api/admin/* to it, and it returns 503 for every request unless
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
    if (instance.configuration.enabled!==true) {
      // The app's disabled handler only returns a fixed configuration-stage
      // label. Preserve it on the health probe; other routes stay opaque.
      if (req.method==='GET' && /^\/api\/admin\/v1\/health(?:\?diagnose=1)?$/.test(req.url)) {
        return sendResponse(res,await instance());
      }
      return unavailable(res);
    }
    try {
      if (!Buffer.isBuffer(secret)||secret.length!==32) return unavailable(res);
      const request=toWebRequest(req,{origin:instance.configuration.origin,secret});
      await sendResponse(res,await instance(request));
    } catch { unavailable(res); }
  };
}
function unavailable(res) {
  res.statusCode=503;
  res.setHeader('cache-control','no-store');
  res.setHeader('content-type','application/json; charset=utf-8');
  res.end(JSON.stringify({error:{code:'UNAVAILABLE'}}));
}

export default async function handler(req,res) {
  if (!cached) {
    const instance=createAdminApp();
    cached=createHandler(instance,{secret:instance.configuration.enabled ? Buffer.from(process.env.ADMIN_INGRESS_SECRET_HEX,'hex') : null});
  }
  return cached(req,res);
}
