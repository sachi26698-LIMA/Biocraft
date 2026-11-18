// Invoke from an environment allowed to reach Vercel. A deployment being READY
// is not evidence. This script never emits response bodies, cookies or secrets.
const base = process.argv[2] ? new URL(process.argv[2]) : null;
if (!base || base.protocol !== 'https:' || base.origin !== process.argv[2] || !base.hostname.endsWith('.vercel.app')) {
  throw new Error('Pass the exact https://…vercel.app deployment origin, without a trailing slash');
}
const admin = process.env.BIOCRAFT_SMOKE_ADMIN ?? 'disabled';
if (admin !== 'disabled' && admin !== 'enabled') throw new Error('BIOCRAFT_SMOKE_ADMIN must be disabled or enabled');
const headers = process.env.VERCEL_AUTOMATION_BYPASS_SECRET
  ? {'x-vercel-protection-bypass': process.env.VERCEL_AUTOMATION_BYPASS_SECRET} : {};
async function check(path, expectedStatus, contentType, validate) {
  const response = await fetch(new URL(path, base), {headers, redirect:'error', signal:AbortSignal.timeout(12_000)});
  if (response.status !== expectedStatus) throw new Error(`${path}: received HTTP ${response.status}, expected ${expectedStatus}`);
  if (!response.headers.get('content-type')?.includes(contentType)) throw new Error(`${path}: unexpected content type`);
  const content = contentType === 'application/json' ? await response.json() : await response.text();
  if (!validate(content)) throw new Error(`${path}: unexpected response`);
  console.log(`${path}: verified HTTP ${response.status}`);
}
await check('/',200,'text/html',body=>body.includes('BioCraft'));
await check('/admin',200,'text/html',body=>body.includes('noindex') && body.includes('Admin'));
await check('/api/status/content',200,'application/json',body=>body.ok===true);
await check('/api/admin/v1/health',admin==='enabled'?200:503,'application/json',body=>admin==='enabled'?body.ok===true:body.error?.code==='UNAVAILABLE');
if (admin==='enabled') await check('/api/admin/v1/session',401,'application/json',body=>body.error?.code==='UNAUTHENTICATED');
