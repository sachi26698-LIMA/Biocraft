// REVIEW ONLY — not deployed. Deploy with JWT verification enabled, after
// independent security review and separate approval. Database RPCs remain the
// authorization boundary even if this gateway is bypassed.
// Required: SUPABASE_URL, SUPABASE_ANON_KEY, ADMIN_ALLOWED_ORIGIN (one exact origin).
const limit = 32 * 1024;
const responses = (body: unknown, status: number, cors: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff', vary: 'Origin', ...cors } });
const isObject = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const uuid = (v: unknown) => typeof v === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
const methods: Record<string, {rpc: string; valid: (x: Record<string, unknown>) => boolean}> = {
  create: {rpc: 'bc_control_create_draft', valid: x => Object.keys(x).length === 1 && uuid(x.p_bio_id)},
  update: {rpc: 'bc_control_update_draft', valid: x => Object.keys(x).length === 2 && uuid(x.p_id) && isObject(x.p_value)},
  submit: {rpc: 'bc_control_submit', valid: x => Object.keys(x).length === 1 && uuid(x.p_id)},
  review: {rpc: 'bc_control_review', valid: x => Object.keys(x).length === 2 && uuid(x.p_id) && typeof x.p_approve === 'boolean'},
  publish: {rpc: 'bc_control_publish', valid: x => Object.keys(x).length === 1 && uuid(x.p_id)},
};
async function readBounded(req: Request): Promise<string> {
  if (!req.body) return '';
  const reader = req.body.getReader(); let total = 0; const chunks: Uint8Array[] = [];
  while (true) { const {done,value}=await reader.read(); if (done) break; total+=value.length;
    if (total > limit) { await reader.cancel(); throw new Error('too large'); } chunks.push(value); }
  const bytes = new Uint8Array(total); let offset=0;
  for (const chunk of chunks) {bytes.set(chunk,offset);offset+=chunk.length;}
  return new TextDecoder('utf-8',{fatal:true}).decode(bytes);
}
Deno.serve(async (request: Request) => {
  const origin=request.headers.get('origin'); const allowed=Deno.env.get('ADMIN_ALLOWED_ORIGIN');
  const base=Deno.env.get('SUPABASE_URL'); const key=Deno.env.get('SUPABASE_ANON_KEY');
  if (!allowed || !base || !key) return responses({error:'Service unavailable'},503);
  if (origin && origin !== allowed) return responses({error:'Origin not allowed'},403);
  const cors = origin === allowed ? {'access-control-allow-origin':allowed} : {};
  if (request.method === 'OPTIONS') return new Response(null,{status:204,headers:{...cors,'access-control-allow-methods':'POST, OPTIONS','access-control-allow-headers':'authorization, content-type',vary:'Origin','cache-control':'no-store'}});
  if (request.method !== 'POST') return responses({error:'Method not allowed'},405,cors);
  const authorization=request.headers.get('authorization');
  if (!authorization || !/^Bearer [A-Za-z0-9._-]+$/.test(authorization)) return responses({error:'Unauthorized'},401,cors);
  let payload: unknown;
  try {payload=JSON.parse(await readBounded(request));} catch {return responses({error:'Invalid request'},400,cors);}
  if (!isObject(payload) || Object.keys(payload).length !== 2 || typeof payload.action !== 'string' || !isObject(payload.args)) return responses({error:'Invalid request'},400,cors);
  const method=Object.hasOwn(methods,payload.action) ? methods[payload.action] : undefined;
  if (!method || !method.valid(payload.args)) return responses({error:'Invalid request'},400,cors);
  try {
    // Verify with Auth, not by decoding untrusted JWT claims. Auth and PostgREST
    // both receive the caller token; no service role is used.
    const auth=await fetch(`${base}/auth/v1/user`,{headers:{apikey:key,authorization}});
    if (!auth.ok) return responses({error:'Unauthorized'},401,cors);
    const result=await fetch(`${base}/rest/v1/rpc/${method.rpc}`,{method:'POST',headers:{apikey:key,authorization,'content-type':'application/json'},body:JSON.stringify(payload.args)});
    if (!result.ok) return responses({error:'Request denied or unavailable'}, result.status === 401 ? 401 : result.status === 403 ? 403 : 400,cors);
    const resultText=await result.text();
    return responses(resultText ? JSON.parse(resultText) : null,200,cors);
  } catch {return responses({error:'Service unavailable'},503,cors);}
});
