import {checkPublicContent} from '../../shared/public-content-check.mjs';
export {checkPublicContent};

let cached;
export default async function handler(req,res) {
  res.setHeader('Cache-Control','no-store');
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Content-Type','application/json; charset=utf-8');
  if (req.method!=='GET') {
    res.statusCode=405;
    res.setHeader('Allow','GET');
    res.end(JSON.stringify({error:{code:'METHOD_NOT_ALLOWED'}}));
    return;
  }
  // Coalesce concurrent probes and briefly reuse the result per instance.
  if (!cached || cached.expires<=Date.now()) cached={expires:Date.now()+10_000,result:checkPublicContent()};
  const ok=await cached.result;
  res.statusCode=ok?200:503;
  res.end(JSON.stringify({ok}));
}
