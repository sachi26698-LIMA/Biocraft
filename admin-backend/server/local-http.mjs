// Development listener for the real Admin application, not the fixture server.
// Browsers use the frontend's origin; Vite proxies the relative /api paths.
import http from 'node:http';
import {createAdminApp} from './app.mjs';
import {createHandler} from './handler.mjs';
import contentStatus from '../../api/status/content.mjs';

export function localConfig(input) {
  if (input.VERCEL === '1' || input.VERCEL_ENV === 'production' || input.VERCEL_ENV === 'preview') throw Error('Local listener is not a deployment entrypoint');
  const sandbox = input.E2B_SANDBOX_ID;
  const origin = input.ADMIN_ORIGIN || (/^[a-z0-9-]+$/.test(sandbox || '') ? `https://5173-${sandbox}.e2b.app` : undefined);
  // Never derive a trusted origin, role, allow-list or password from a request.
  return {...input, ADMIN_ORIGIN:origin, ADMIN_BACKEND_ENABLED:input.ADMIN_BACKEND_ENABLED ?? 'true',
    ADMIN_TRUSTED_CLIENT_HEADER:'x-forwarded-for'};
}
function reply(res,status,body) {
  res.writeHead(status,{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'});
  res.end(JSON.stringify(body));
}
export function localServer(env, app=createAdminApp({env,localDevelopment:true})) {
  const delegate=createHandler(app,{secret:app.configuration.enabled ? Buffer.from(env.ADMIN_INGRESS_SECRET_HEX,'hex') : null});
  const server=http.createServer({requestTimeout:15000,headersTimeout:10000,maxHeaderSize:16384},async(req,res)=>{
    try {
      const path=req.url?.split('?')[0];
      if(req.headers.origin && req.headers.origin!==env.ADMIN_ORIGIN) return reply(res,403,{error:{code:'ORIGIN_DENIED'}});
      if(req.method==='GET' && ['/', '/api/status/live'].includes(path)) return reply(res,200,{service:'BioCraft Admin API',live:true,readiness:'/api/admin/v1/health'});
      if(path==='/api/status/content') return await contentStatus(req,res);
      if(!path?.startsWith('/api/admin/v1/')) return reply(res,404,{error:{code:'NOT_FOUND'}});
      // The direct API port is for diagnostics. Auth and cookies belong only to
      // the configured frontend origin, not every preview hostname on the port.
      if(path!=='/api/admin/v1/health' && (!env.ADMIN_ORIGIN || req.headers.host!==new URL(env.ADMIN_ORIGIN).host)) return reply(res,403,{error:{code:'ORIGIN_DENIED'}});
      if(!['GET','HEAD'].includes(req.method) && req.headers.origin!==env.ADMIN_ORIGIN) return reply(res,403,{error:{code:'ORIGIN_DENIED'}});
      // The raw Node listener is NOT Vercel's trusted ingress. Overwrite the
      // network identity before invoking the shared adapter; never trust XFF.
      req.headers['x-real-ip']=req.socket.remoteAddress;
      delete req.headers['x-forwarded-for']; delete req.headers['x-admin-ingress-signature'];
      if(!['GET','HEAD'].includes(req.method)) {
        if(Number(req.headers['content-length'])>32768) return reply(res,413,{error:{code:'TOO_LARGE'}});
        const chunks=[];let size=0;
        // Do not destroy the socket from an async-iterator return before the
        // caller can receive its 413, including for chunked transfer encoding.
        for await (const chunk of req.iterator({destroyOnReturn:false})) {
          size+=chunk.length;
          if(size>32768) {res.setHeader('connection','close');return reply(res,413,{error:{code:'TOO_LARGE'}});}
          chunks.push(chunk);
        }
        req.body=Buffer.concat(chunks);
      }
      await delegate(req,res);
    } catch {if(!res.headersSent) reply(res,503,{error:{code:'UNAVAILABLE'}}); else res.end();}
  });
  return {server,shutdown:async()=>{await new Promise(resolve=>server.close(resolve));await app.shutdown();}};
}
