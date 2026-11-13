// Node (Vercel) <-> Web Request/Response adapter for the Admin app.
//
// The platform terminates TLS and sets `x-real-ip` / `x-forwarded-for` itself.
// This adapter is the trusted-proxy boundary: it derives the rate-limit client
// key from those platform headers and signs it with the server-only ingress
// secret. Any inbound signature header from a client is discarded, so a direct
// caller cannot pick its own rate-limit identity.
import {createHmac} from 'node:crypto';

const MAX_BODY=65536;

export function deriveClientAddress(headers) {
  const real=headers['x-real-ip'];
  if (typeof real==='string' && real.length>=1 && real.length<=200) return real;
  const forwarded=headers['x-forwarded-for'];
  const raw=Array.isArray(forwarded)?forwarded[0]:forwarded;
  if (typeof raw==='string') {
    const first=raw.split(',')[0]?.trim();
    if (first && first.length<=200) return first;
  }
  return null;
}

export function signedProxyHeaders({address,origin,secret}) {
  if (typeof address!=='string' || !address) return null;
  const signature=createHmac('sha256',secret).update(address).digest('hex');
  return {'x-forwarded-for':address,'x-admin-ingress-signature':signature,host:new URL(origin).host};
}

export function toWebRequest(req,{origin,secret}) {
  const address=deriveClientAddress(req.headers);
  const signature=address?createHmac('sha256',secret).update(address).digest('hex'):null;
  const headers=new Headers();
  for (const [key,value] of Object.entries(req.headers)) {
    if (key==='x-admin-ingress-signature' || key==='x-real-ip') continue; // never trust inbound
    if (typeof value==='string') headers.set(key,value);
    else if (Array.isArray(value)) headers.set(key,value.join(', '));
  }
  if (address) {headers.set('x-forwarded-for',address);headers.set('x-admin-ingress-signature',signature);headers.set('host',new URL(origin).host);}
  const method=(req.method??'GET').toUpperCase();
  let body;
  if (method!=='GET' && method!=='HEAD') {
    // Vercel pre-parses JSON bodies; re-serialize so the app sees the raw HTTP body.
    if (typeof req.body==='string') body=Buffer.from(req.body);
    else if (Buffer.isBuffer(req.body)) body=req.body;
    else if (req.body && typeof req.body==='object') body=Buffer.from(JSON.stringify(req.body));
    if (body && body.length>MAX_BODY) body=undefined; // controller rejects oversized bodies
  }
  return new Request(origin+(req.url??'/'),{method,headers,body});
}

export async function sendResponse(res,response) {
  res.statusCode=response.status;
  for (const [key,value] of response.headers) {
    if (key.toLowerCase()==='set-cookie') continue;
    res.setHeader(key,value);
  }
  const cookies=response.headers.getSetCookie?.() ?? [];
  if (cookies.length) res.setHeader('set-cookie',cookies);
  const buffer=Buffer.from(await response.arrayBuffer());
  res.setHeader('content-length',String(buffer.length));
  res.end(buffer);
}
