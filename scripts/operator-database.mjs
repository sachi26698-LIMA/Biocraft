// Import commands are operator-only. Remote DSNs must identify BioCraft and
// use verified TLS, independent of pg's connection-string sslmode defaults.
import pg from 'pg';
import {rootCertificates} from 'node:tls';
import {readFileSync} from 'node:fs';
import {SUPABASE_URL} from '../shared/supabase-config.mjs';
const ref=new URL(SUPABASE_URL).hostname.split('.')[0];
export function operatorConfig(dsn) {
  // Preserve pg's private Unix-socket DSNs for the disposable test cluster.
  if (/^postgres(?:ql)?:\/\/[\w%-]+@\/[\w-]+\?host=\/[\w/-]+$/.test(dsn)) return {connectionString:dsn};
  let url; try {url=new URL(dsn);} catch {throw new Error('Invalid operator database URL');}
  if (!['postgres:','postgresql:'].includes(url.protocol)) throw new Error('Expected a PostgreSQL URL');
  if (['127.0.0.1','localhost','[::1]'].includes(url.hostname) && !url.search) return {connectionString:dsn};
  const direct=url.hostname===`db.${ref}.supabase.co`;
  const pooler=/^aws-\d+-ap-southeast-2\.pooler\.supabase\.com$/.test(url.hostname);
  const user=decodeURIComponent(url.username);
  if (!(direct || (pooler && user.endsWith('.'+ref))) || url.pathname!=='/postgres' || (url.port && url.port!=='5432') ||
      (url.search && url.search!=='?sslmode=verify-full') || !url.password || !user) throw new Error('Use the BioCraft direct or session-pooler URL; no unverified TLS or connection overrides');
  return {host:url.hostname,port:5432,user,password:decodeURIComponent(url.password),database:'postgres',connectionTimeoutMillis:10000,
    ssl:{rejectUnauthorized:true,ca:[...rootCertificates,readFileSync(new URL('../admin-backend/certs/supabase-roots.pem',import.meta.url),'utf8')]}};
}
export const operatorClient=()=>new pg.Client(operatorConfig(process.env.DATABASE_URL));
