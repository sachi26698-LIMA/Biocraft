// Grant/definition inventory. The security review claims three numbers about the
// SQL surface; this test derives all three from the files themselves, so no
// hand-written count can drift again (earlier drafts said 25, then 28, then 31).
//
//   tables, functions, SECURITY DEFINER functions, granted signatures,
//   trigger bodies (must be exactly the ungranted remainder)
//
// It also checks the properties the review asserts: every function fixes
// search_path, every migration revokes from public/anon/authenticated, and no
// migration touches the public or auth schemas.
import assert from 'node:assert/strict';
import fs from 'node:fs';

const dir = 'admin-backend/migrations';
const files = fs.readdirSync(dir).filter(name => name.endsWith('.sql')).sort();
assert.deepEqual(files.map(f => f.slice(0, 3)), ['001', '002', '003', '004', '005', '006', '007', '008', '009', '010', '011', '012'], 'migration set changed');

const sql = files.map(name => ({ name, body: fs.readFileSync(`${dir}/${name}`, 'utf8') }));

// 1. Definitions actually created by the migrations.
const created = [];
for (const { name, body } of sql) {
  for (const match of body.matchAll(/^create (?:or replace )?function (bc_admin_v1\.[a-z0-9_]+)\(([^)]*)\)\s*([\s\S]*?)(?=^create |^revoke |^commit;|^alter |^do \$\$)/gm)) {
    const [, fn, args, rest] = match;
    const types = args.split(',').map(a => a.trim()).filter(Boolean).map(a => a.split(/\s+/)[0].replace(/^p_[a-z_]+$/, '?'));
    created.push({
      name,
      fn,
      signature: `${fn}(${args.split(',').map(a => a.trim()).filter(Boolean).map(a => a.split(/\s+/).slice(-1)[0]).join(',')})`,
      securityDefiner: /security definer/.test(rest),
      fixedSearchPath: /set search_path\s*=\s*pg_catalog/.test(rest),
      types,
    });
  }
}
const tables = sql.flatMap(({ body }) => [...body.matchAll(/^create table (bc_admin_v1\.[a-z0-9_]+)/gm)].map(m => m[1]));

const triggerBodies = created.filter(f => /returns trigger/.test(
  fs.readFileSync(`${dir}/${f.name}`, 'utf8').split(f.fn)[1] ?? ''));
const functions = created.filter(f => !triggerBodies.includes(f));
const definer = created.filter(f => f.securityDefiner);
const invoker = created.filter(f => !f.securityDefiner && !triggerBodies.includes(f));

// 2. The canonical grant list.
const grants = fs.readFileSync('admin-backend/grants/executor-grants.sql', 'utf8');
const granted = [...grants.matchAll(/bc_admin_v1\.([a-z0-9_]+)\(([^)]*)\)/g)]
  .map(m => `bc_admin_v1.${m[1]}(${m[2].replace(/\s+/g, '')})`);

// 3. Numbers the review and the approval report must both state.
assert.equal(tables.length, 19, `expected 19 tables, found ${tables.length}`);
assert.equal(new Set(tables).size, 19, 'duplicate table definition');
assert.equal(created.length, 39, `expected 39 functions, found ${created.length}`);
assert.equal(triggerBodies.length, 4, `expected 4 trigger bodies, found ${triggerBodies.length}`);
assert.equal(granted.length, 35, `expected 35 granted signatures, found ${granted.length}`);
assert.equal(new Set(granted).size, granted.length, 'duplicate grant');
assert.equal(functions.length, 35, 'callable functions must equal the 35 grants');
assert.equal(invoker.length, 0, `unexpected SECURITY INVOKER function: ${invoker.map(f => f.fn)}`);

// 4. Every granted name exists in the migrations, and nothing else is granted.
const normalised = new Set(functions.map(f => f.signature.replace(/\s+/g, '')));
for (const signature of granted) assert.ok(normalised.has(signature), `granted but not defined: ${signature}`);
for (const f of functions) assert.ok(granted.includes(f.signature.replace(/\s+/g, '')), `defined but not granted: ${f.signature}`);

// 5. Trigger bodies are exactly the ungranted remainder.
const bodyNames = triggerBodies.map(f => f.fn).sort();
assert.deepEqual(bodyNames, ['bc_admin_v1.guard_approval', 'bc_admin_v1.guard_draft', 'bc_admin_v1.reject_mutation', 'bc_admin_v1.stamp_mfa_enrolled']);

// 6. Security properties the review asserts about every callable function.
for (const f of functions) {
  assert.ok(f.securityDefiner, `${f.fn} is not SECURITY DEFINER`);
  assert.ok(f.fixedSearchPath, `${f.fn} does not fix search_path=pg_catalog`);
}
for (const f of triggerBodies) {
  assert.ok(f.fixedSearchPath, `${f.fn} does not fix search_path=pg_catalog`);
  assert.ok(!granted.some(g => g.startsWith(f.fn)), `${f.fn} must not be granted`);
}

// 7. No migration touches the public or auth schemas. 010 only SELECTs from
//    public; nothing may create, alter, drop or grant there.
for (const { name, body } of sql) {
  const stripped = body.replace(/--[^\n]*/g, '');
  assert.ok(!/\b(create|alter|drop)\s+(table|view|index|policy|function|trigger|schema|role|extension)\s+(if not exists\s+)?(public|auth)\./i.test(stripped), `${name} modifies ${'public/auth'}`);
  assert.ok(!/\bgrant\b[^;]*\bpublic\./i.test(stripped), `${name} grants on public`);
  assert.ok(!/\b(revoke|grant)\b[^;]*\bon\s+(schema\s+)?(public|auth)\b/i.test(stripped), `${name} changes privileges on public/auth`);
  assert.ok(!/\binsert into (public|auth)\./i.test(stripped), `${name} writes to ${'public/auth'}`);
  assert.ok(!/\bdelete from (public|auth)\./i.test(stripped), `${name} deletes from ${'public/auth'}`);
  assert.ok(!/\bupdate (public|auth)\./i.test(stripped), `${name} updates ${'public/auth'}`);
  assert.ok(!/\bdrop\s+table\b/i.test(stripped), `${name} drops a table`);
}

// 8. Client-facing revocation: 001 revokes EXECUTE from PUBLIC by default
//    privilege for the whole schema; every later file that creates a function
//    must revoke again explicitly for the exact signatures it created.
assert.match(sql[0].body, /alter default privileges in schema bc_admin_v1 revoke execute on functions from public, anon, authenticated/);
for (const { name, body } of sql.slice(1)) {
  if (!/create function/.test(body)) continue;
  assert.match(body, /revoke all on function[\s\S]*from public,anon,authenticated/, `${name} does not revoke EXECUTE from clients`);
}

// 9. Rollback files exist for every migration and never cascade.
for (const name of files) {
  const rollback = fs.readFileSync(`admin-backend/rollback/${name}`, 'utf8');
  assert.ok(!/\bcascade\b/i.test(rollback.replace(/--[^\n]*/g, '')), `${name} rollback uses CASCADE`);
  assert.ok(!/\b(public|auth)\./i.test(rollback.replace(/--[^\n]*/g, '').replace(/auth\.(uid|jwt)\(\)/g, '')), `${name} rollback touches public/auth`);
}

// 10. The credential script must emit the canonical grant list, not a copy.
//     A retyped list is how the earlier published counts drifted; this asserts the
//     generated activation and rotation SQL contain exactly the 35 signatures from
//     the grant file, targeted at the right role, and never a secret in a file.
import {execFileSync} from 'node:child_process';
const runScript = args => execFileSync(process.execPath, ['scripts/admin-executor-credential.mjs', ...args], {encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore']});
const signatures = [...grants.matchAll(/bc_admin_v1\.([a-z0-9_]+)\(([^)]*)\)/g)].map(m => `${m[1]}(${m[2].replace(/\s+/g, '')})`);
for (const [args, role] of [[[], 'bc_admin_executor'], [['--rotate'], 'bc_admin_executor_next']]) {
  const out = runScript(args);
  const emitted = [...out.matchAll(/bc_admin_v1\.([a-z0-9_]+)\(([^)]*)\)/g)].map(m => `${m[1]}(${m[2].replace(/\s+/g, '')})`);
  for (const signature of signatures) assert.ok(emitted.includes(signature), `${args.join(' ') || 'create'} output omits ${signature}`);
  assert.equal(new Set(emitted).size, signatures.length, `${args.join(' ') || 'create'} output has a duplicate or extra signature`);
  assert.match(out, new RegExp(`to ${role};`), `grants are not targeted at ${role}`);
  assert.match(out, new RegExp(`create role ${role} login password '[A-Za-z0-9]{48}'`), 'password is not 48 characters');
  assert.ok(!/ADMIN_DB_PASSWORD=[^<]/.test(out), 'the script must not emit a shell env assignment');
}

// 11. Documentation cannot drift from the files: every migration, rollback and
//     the grant list must appear verbatim in the approval report, and every
//     SHA-256 quoted for them must match the bytes on disk.
import {createHash} from 'node:crypto';
const approval = fs.readFileSync('docs/CONSOLIDATED_APPROVAL_REPORT.md', 'utf8');
const review = fs.readFileSync('docs/FINAL_SECURITY_REVIEW.md', 'utf8');
const sha = text => createHash('sha256').update(text).digest('hex');
const sqlFiles = [
  ...files.map(f => `admin-backend/migrations/${f}`),
  ...files.map(f => `admin-backend/rollback/${f}`),
  'admin-backend/grants/executor-grants.sql',
];
for (const file of sqlFiles) {
  const body = fs.readFileSync(file, 'utf8').trimEnd();
  assert.ok(approval.includes(body), `${file} is not reproduced verbatim in the approval report`);
  const digest = sha(fs.readFileSync(file));
  assert.ok(approval.includes(digest), `${file} SHA-256 ${digest} missing from the approval report`);
  assert.ok(review.includes(digest), `${file} SHA-256 missing from the security review checklist`);
}

console.log(`PASS grant inventory: ${tables.length} tables, ${created.length} functions = ${functions.length} callable SECURITY DEFINER (all ${granted.length} granted) + ${triggerBodies.length} trigger bodies (none granted), every search_path fixed, no public/auth writes, no CASCADE; all ${sqlFiles.length} SQL files and their SHA-256 reproduced in both documents`);
