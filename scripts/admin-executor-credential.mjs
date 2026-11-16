#!/usr/bin/env node
// D3: generate the `bc_admin_executor` password and print the exact activation
// and rotation commands. Prints secrets to STDOUT ONLY, never to a file, a log,
// the repository or a shell history file: pipe it into your password manager or
// paste it straight into the Vercel dashboard, then clear the terminal.
//
//   node scripts/admin-executor-credential.mjs            # create
//   node scripts/admin-executor-credential.mjs --rotate   # rotate (two-role)
//
// Nothing here connects to a database or to Vercel. It only produces text a human
// with project access must run deliberately.
import {randomBytes} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

// The grant statements are taken verbatim from the canonical file, never
// retyped here: a copied list is exactly how the published counts drifted
// (25 -> 28 -> 31) before test:admin-grant-inventory existed.
const grantSource = readFileSync(
  fileURLToPath(new URL('../admin-backend/grants/executor-grants.sql', import.meta.url)), 'utf8')
  .split('\n').filter(line => !line.startsWith('--')).join('\n').trim();
// The canonical file names `bc_admin_executor`; the rotation creates the successor
// first, so the same statements are re-targeted rather than retyped.
const grantBlock = role => grantSource.replace(/\bbc_admin_executor\b/g, role);

const ALPHABET = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const LENGTH = 48; // > 40 as decided in D3, ~283 bits of entropy.

/** Rejection-sampled so every character is uniform (no modulo bias). */
function generate(length = LENGTH) {
  const out = [];
  while (out.length < length) {
    for (const byte of randomBytes(64)) {
      if (byte >= 256 - (256 % ALPHABET.length)) continue; // reject the biased tail
      out.push(ALPHABET[byte % ALPHABET.length]);
      if (out.length === length) break;
    }
  }
  return out.join('');
}

const rotate = process.argv.includes('--rotate');
const password = generate();

if (rotate) {
  // Rotation uses a second role so no request ever fails mid-switch and the old
  // credential can be retired only after the new one is proven.
  console.log(`-- D3 ROTATION (two-role, zero downtime). Run each block deliberately.
-- 1. Create the successor and give it exactly the same privileges as the old one.
create role bc_admin_executor_next login password '${password}'
  nosuperuser nocreatedb nocreaterole noreplication nobypassrls inherit;
${grantBlock('bc_admin_executor_next')}`);
} else {
  console.log(`-- D3 ACTIVATION. Review the whole report first; nothing here is executed.
-- 1. Create the executor with a generated 48-character password.
create role bc_admin_executor login password '${password}'
  nosuperuser nocreatedb nocreaterole noreplication nobypassrls inherit;
-- 2. Grant EXECUTE on exactly the reviewed signatures, read from the canonical
--    grant file (admin-backend/grants/executor-grants.sql) so this script can
--    never drift from what the approval report and the tests describe.
--    The trigger bodies reject_mutation, guard_draft, guard_approval and
--    stamp_mfa_enrolled are deliberately NOT granted.
${grantBlock('bc_admin_executor')}
-- 3. Store the password ONLY in Vercel Preview env vars (ADMIN_DB_PASSWORD).
--    Never in the repository, a VITE_* variable, a log or a chat message.
alter role bc_admin_executor password '<rotate with --rotate after any exposure>';`);
}

console.error(`\npassword length: ${password.length} characters (D3 minimum: 40)
Run as a role that may CREATE ROLE (the project owner), never as the executor.
Clear this terminal when you are done.`);
