#!/usr/bin/env node
// Run only on the operator's workstation if Dashboard Connect and the pooler
// disagree. Uses the same read-only Management API as `supabase link`. Does not
// connect to Postgres, read a DB password, write .temp files or change Vercel.
import {pathToFileURL} from 'node:url';
import {SUPABASE_URL} from '../shared/supabase-config.mjs';
const ref = new URL(SUPABASE_URL).hostname.split('.')[0];

class OperatorNotice extends Error {}
export async function primaryPoolerHost(token, request = fetch) {
  if (!token) throw new OperatorNotice('Use an authorized private shell with SUPABASE_ACCESS_TOKEN; do not send tokens in chat.');
  const res = await request(`https://api.supabase.com/v1/projects/${ref}/config/database/pooler`, {
    headers:{authorization:`Bearer ${token}`}, redirect:'error', signal:AbortSignal.timeout(10000),
  });
  if (!res.ok) throw new OperatorNotice(`Management API returned HTTP ${res.status}; no configuration changed.`);
  const configs = await res.json();
  const primary = Array.isArray(configs) && configs.find(c => c.database_type === 'PRIMARY');
  let url;
  // Do not propagate URL parser errors: they can contain the original DSN.
  try { url = new URL(primary.connection_string); } catch { /* checked below */ }
  if (!url || !['postgres:','postgresql:'].includes(url.protocol) || !url.username.endsWith(`.${ref}`) ||
      !/^aws-\d+-ap-southeast-2\.pooler\.supabase\.com$/.test(url.hostname)) {
    throw new OperatorNotice('No recognized primary BioCraft pooler. Ask Supabase to verify the assignment.');
  }
  return url.hostname;
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try { console.log(await primaryPoolerHost(process.env.SUPABASE_ACCESS_TOKEN)); }
  catch (e) {
    // A management error body or invalid JSON may contain configuration values.
    console.error(e instanceof OperatorNotice ? e.message : 'Could not read primary pooler metadata. No changes made.');
    process.exitCode = 1;
  }
}
