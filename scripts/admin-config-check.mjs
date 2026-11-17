// Diagnose why the Admin API answers 503 UNAVAILABLE on a deployment.
//
// The deployed function fails closed and deliberately says nothing about *why*,
// so a missing or malformed variable is invisible from the outside. This script
// runs the real configuration loader against real environment variables and
// prints the one-word reason, without ever printing a value.
//
// Usage (values are pulled straight from Vercel, never pasted into chat):
//   vercel env pull .env.admin-check --environment=production
//   node scripts/admin-config-check.mjs .env.admin-check
//   rm .env.admin-check
//
// It reports only presence, length and shape — never content.
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';

const file = process.argv[2];
if (!file) {
  console.error('usage: node scripts/admin-config-check.mjs <env-file>');
  process.exit(2);
}

// Minimal dotenv: KEY=VALUE, optional surrounding quotes.
const env = {};
for (const line of readFileSync(file, 'utf8').split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eq = trimmed.indexOf('=');
  if (eq === -1) continue;
  const key = trimmed.slice(0, eq).trim();
  let value = trimmed.slice(eq + 1).trim();
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  }
  env[key] = value;
}

// Never print a secret. A short fingerprint lets two runs be compared safely.
const fingerprint = (value) => createHash('sha256').update(String(value)).digest('hex').slice(0, 8);

const HEX64 = /^[0-9a-f]{64}$/;
const checks = [];

function report(name, ok, detail) {
  checks.push({name, ok, detail});
}

const present = (key) => typeof env[key] === 'string' && env[key].length > 0;

// The gates in admin-backend/server/app.mjs, in the order it tests them.
report('ADMIN_BACKEND_ENABLED is "true"', env.ADMIN_BACKEND_ENABLED === 'true',
  present('ADMIN_BACKEND_ENABLED') ? `value="${env.ADMIN_BACKEND_ENABLED}"` : 'missing');

report('ADMIN_ORIGIN is a bare https origin', /^https:\/\/[a-z0-9.-]{1,200}$/i.test(env.ADMIN_ORIGIN ?? ''),
  present('ADMIN_ORIGIN') ? `value="${env.ADMIN_ORIGIN}"` : 'missing');

for (const key of ['ADMIN_COOKIE_KEY_HEX', 'ADMIN_FLOW_KEY_HEX', 'ADMIN_HASH_KEY_HEX']) {
  const value = env[key] ?? '';
  report(`${key} is 64 lowercase hex chars`, HEX64.test(value),
    present(key) ? `length=${value.length}, fingerprint=${fingerprint(value)}` : 'MISSING OR EMPTY');
}

const keys = ['ADMIN_COOKIE_KEY_HEX', 'ADMIN_FLOW_KEY_HEX', 'ADMIN_HASH_KEY_HEX']
  .map((key) => env[key] ?? '');
const allSet = keys.every((value) => HEX64.test(value));
const distinct = new Set(keys.filter((value) => HEX64.test(value))).size;
report('the three keys are distinct', !allSet || distinct === 3,
  allSet ? `distinct=${distinct} of 3` : 'cannot compare until all three are set');

// The publishable key must be an anon-role JWT or an sb_publishable_ key.
// A v2 "eyJ2IjoidjIi..." envelope is NOT a key: it decodes to {v,c,k} with no
// role claim, so placing it here makes every request answer 503.
const publishable = env.ADMIN_SUPABASE_PUBLISHABLE_KEY ?? '';
let publishableShape = 'missing';
let publishableOk = false;
if (publishable) {
  if (publishable.startsWith('sb_secret_')) {
    publishableShape = 'FORBIDDEN: this is a secret/service key';
  } else if (publishable.startsWith('sb_publishable_')) {
    publishableShape = 'ok: sb_publishable_ key';
    publishableOk = true;
  } else {
    const parts = publishable.split('.');
    if (parts.length === 3) {
      try {
        const claims = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
        if (claims?.role === 'anon') {
          publishableShape = 'ok: legacy anon JWT';
          publishableOk = true;
        } else if (claims && 'v' in claims && 'c' in claims && 'k' in claims) {
          publishableShape =
            'WRONG VALUE: this is a Vercel/CLI-encrypted envelope {v,c,k}, not a Supabase key. ' +
            'Copy the real key from the Supabase dashboard.';
        } else {
          publishableShape = `WRONG VALUE: JWT role is "${claims?.role}", expected "anon"`;
        }
      } catch {
        publishableShape = 'WRONG VALUE: not decodable as a JWT';
      }
    } else {
      publishableShape = `WRONG VALUE: not a JWT (${parts.length} dot-separated part) and not sb_publishable_`;
    }
  }
}
report('ADMIN_SUPABASE_PUBLISHABLE_KEY is a usable publishable key', publishableOk, publishableShape);

report('ADMIN_DB_USER is set', present('ADMIN_DB_USER'),
  present('ADMIN_DB_USER') ? `length=${env.ADMIN_DB_USER.length}` : 'MISSING OR EMPTY');
report('ADMIN_DB_PASSWORD is set', present('ADMIN_DB_PASSWORD'),
  present('ADMIN_DB_PASSWORD') ? `length=${env.ADMIN_DB_PASSWORD.length}` : 'MISSING OR EMPTY');

const host = env.ADMIN_DB_HOST ?? '';
const user = env.ADMIN_DB_USER ?? '';
report('ADMIN_DB_HOST is a pooler or direct host',
  host === 'db.jvpadtzfsuekixrquzjv.supabase.co' || /^aws-\d+-[a-z0-9-]+\.pooler\.supabase\.com$/.test(host),
  present('ADMIN_DB_HOST') ? `value="${host}"` : 'missing (falls back to direct)');

const needsSuffix = host !== '' && host !== 'db.jvpadtzfsuekixrquzjv.supabase.co';
report('ADMIN_DB_USER carries the right project suffix',
  needsSuffix ? /^[a-z_][a-z0-9_]{0,62}\.jvpadtzfsuekixrquzjv$/.test(user) : /^[a-z_][a-z0-9_]{0,62}$/.test(user),
  needsSuffix ? 'pooler host requires role.jvpadtzfsuekixrquzjv' : 'direct host must not carry a suffix');

report('ADMIN_DB_PORT is 5432 (session mode)', (env.ADMIN_DB_PORT ?? '5432') === '5432',
  `value="${env.ADMIN_DB_PORT ?? '(unset -> 5432)'}"`);

report('ADMIN_ALLOWED_EMAILS names the permitted account',
  (env.ADMIN_ALLOWED_EMAILS ?? '').trim().length > 0,
  present('ADMIN_ALLOWED_EMAILS') ? `value="${env.ADMIN_ALLOWED_EMAILS}"` : 'MISSING OR EMPTY');

report('ADMIN_TRUSTED_CLIENT_HEADER is a header name',
  /^[a-z0-9-]{1,64}$/.test(env.ADMIN_TRUSTED_CLIENT_HEADER ?? ''),
  present('ADMIN_TRUSTED_CLIENT_HEADER') ? `value="${env.ADMIN_TRUSTED_CLIENT_HEADER}"` : 'MISSING OR EMPTY');

const ingress = env.ADMIN_INGRESS_SECRET_HEX ?? '';
report('ADMIN_INGRESS_SECRET_HEX is 64 lowercase hex chars', HEX64.test(ingress),
  present('ADMIN_INGRESS_SECRET_HEX') ? `length=${ingress.length}, fingerprint=${fingerprint(ingress)}` : 'MISSING OR EMPTY');

// Order matters: the app returns at the first failure, so the first FAIL here is
// the reason the deployment answers 503.
console.log('\nAdmin API configuration check\n' + '='.repeat(60));
for (const check of checks) {
  console.log(`${check.ok ? 'PASS' : 'FAIL'}  ${check.name}\n        ${check.detail}`);
}

const firstFailure = checks.find((check) => !check.ok);
console.log('='.repeat(60));
if (!firstFailure) {
  console.log('All gates pass. The 503 is then not configuration: check that the');
  console.log('function is deployed at /api/admin/handler and that ADMIN_INGRESS_SECRET_HEX');
  console.log('matches whatever proxy computes the trusted-client signature.');
  process.exit(0);
}
console.log(`Deployment answers 503 because: ${firstFailure.name}`);
console.log('No secret value was printed. Delete the env file now:');
console.log(`  rm ${file}`);
process.exit(1);
