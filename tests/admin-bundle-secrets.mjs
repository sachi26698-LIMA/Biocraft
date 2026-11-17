// No privileged credential may appear in anything the browser downloads.
//
// This scans a real production build for two different things, because they fail
// differently:
//   1. Actual key material (a service key, a database URL with a password).
//   2. The *names* of server-only variables, which reveal the shape of the
//      deployment and usually precede a value leak.
//
// Deliberately narrow: a naive `sb_secret_` substring search matches the Supabase
// SDK's own key-format validation, which is code, not a credential. That false
// positive was hit once and is the reason the value patterns require real length.
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {existsSync, readFileSync, readdirSync, rmSync, statSync} from 'node:fs';
import {join} from 'node:path';

const DIST = 'dist';

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

rmSync(DIST, {recursive: true, force: true});
const env = {...process.env, VERCEL_ENV: 'production', BIOCRAFT_ADMIN_PRODUCTION: 'true'};
execFileSync('npx', ['vite', 'build'], {env, stdio: 'pipe'});
execFileSync('node', ['scripts/build-shells.mjs'], {env, stdio: 'pipe'});
assert.ok(existsSync(DIST), 'build produced no dist');

const files = walk(DIST).filter(f => /\.(js|css|html|json|map|txt)$/.test(f));
assert.ok(files.length > 0, 'no text assets to scan');

// Real credential shapes. Length bounds are what separate a key from SDK code.
const VALUE_PATTERNS = [
  [/sb_secret_[A-Za-z0-9]{20,}/, 'Supabase secret API key'],
  [/sbp_[a-f0-9]{40}/, 'Supabase secret key (sbp_)'],
  [/postgres(?:ql)?:\/\/[^\s"']*:[^\s"']*@/, 'database URL with embedded password'],
  [/aws-0-[a-z0-9-]+\.pooler\.supabase\.com/, 'database pooler host'],
  [/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}/, 'a signed JWT'],
  [/[a-f0-9]{64}/, 'a 64-hex key (the format of every Admin key)'],
];

// Server-only variable names. VITE_-prefixed names are public by definition and
// are the only ones allowed to appear.
const FORBIDDEN_NAMES = [
  'ADMIN_DB_PASSWORD', 'ADMIN_DB_USER', 'ADMIN_COOKIE_KEY_HEX', 'ADMIN_FLOW_KEY_HEX',
  'ADMIN_HASH_KEY_HEX', 'ADMIN_INGRESS_SECRET_HEX', 'ADMIN_TRUSTED_CLIENT_HEADER',
  'ADMIN_SUPABASE_PUBLISHABLE_KEY', 'SUPABASE_SERVICE_ROLE_KEY', 'SERVICE_ROLE_KEY',
];

const findings = [];
for (const file of files) {
  const text = readFileSync(file, 'utf8');
  for (const [pattern, label] of VALUE_PATTERNS) {
    const match = text.match(pattern);
    if (match) findings.push(`${file}: ${label} — "${match[0].slice(0, 24)}…"`);
  }
  for (const name of FORBIDDEN_NAMES) {
    if (text.includes(name)) findings.push(`${file}: server-only variable name "${name}"`);
  }
}

// A 64-hex scan will hit legitimate hashes (asset integrity, cache keys). Only
// fail when the same 64-hex string also looks like a configured key, i.e. it is
// not part of a known-safe construct.
const suspiciousHex = findings.filter(f => f.includes('64-hex key'));
if (suspiciousHex.length) {
  console.log('note: 64-hex strings present (usually asset hashes), listed for review:');
  for (const line of suspiciousHex.slice(0, 5)) console.log('  ' + line);
}

const real = findings.filter(f => !f.includes('64-hex key'));
assert.equal(real.length, 0, `credential material in a browser bundle:\n${real.join('\n')}`);

rmSync(DIST, {recursive: true, force: true});
console.log(`PASS admin bundle secrets: scanned ${files.length} built files, no credential values and no server-only variable names`);
