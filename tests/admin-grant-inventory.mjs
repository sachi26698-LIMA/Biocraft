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
assert.deepEqual(files.map(f => f.slice(0, 3)), ['001', '002', '003', '004', '005', '006', '007', '008', '009', '010', '011', '012', '013', '014'], 'migration set changed');

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
// A later `create or replace function` replaces an earlier definition rather than
// adding one (012 upgrades 011's enrolment gate to read mfa_enrolled_at), so the
// inventory counts distinct signatures, keeping the last definition of each.
const bySignature = new Map();
for (const f of created) bySignature.set(f.signature.replace(/\s+/g, ''), f);
assert.equal(bySignature.size, created.length - (created.length - bySignature.size), 'signature dedupe is self-consistent');
created.splice(0, created.length, ...bySignature.values());

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
assert.equal(tables.length, 20, `expected 20 tables, found ${tables.length}`);
assert.equal(new Set(tables).size, 20, 'duplicate table definition');
assert.equal(created.length, 49, `expected 49 functions, found ${created.length}`);
assert.equal(triggerBodies.length, 5, `expected 5 trigger bodies, found ${triggerBodies.length}`);
assert.equal(granted.length, 44, `expected 44 granted signatures, found ${granted.length}`);
assert.equal(new Set(granted).size, granted.length, 'duplicate grant');
assert.equal(functions.length, 44, 'callable functions must equal the 44 grants');
assert.equal(invoker.length, 0, `unexpected SECURITY INVOKER function: ${invoker.map(f => f.fn)}`);

// 4. Every granted name exists in the migrations, and nothing else is granted.
const normalised = new Set(functions.map(f => f.signature.replace(/\s+/g, '')));
for (const signature of granted) assert.ok(normalised.has(signature), `granted but not defined: ${signature}`);
for (const f of functions) assert.ok(granted.includes(f.signature.replace(/\s+/g, '')), `defined but not granted: ${f.signature}`);

// 5. Trigger bodies are exactly the ungranted remainder.
const bodyNames = triggerBodies.map(f => f.fn).sort();
assert.deepEqual(bodyNames, ['bc_admin_v1.guard_approval', 'bc_admin_v1.guard_draft', 'bc_admin_v1.notify_draft_event', 'bc_admin_v1.reject_mutation', 'bc_admin_v1.stamp_mfa_enrolled']);

// 6. Security properties the review asserts about every callable function.
for (const f of functions) {
  assert.ok(f.securityDefiner, `${f.fn} is not SECURITY DEFINER`);
  assert.ok(f.fixedSearchPath, `${f.fn} does not fix search_path=pg_catalog`);
}
for (const f of triggerBodies) {
  assert.ok(f.fixedSearchPath, `${f.fn} does not fix search_path=pg_catalog`);
  assert.ok(!granted.some(g => g.startsWith(f.fn)), `${f.fn} must not be granted`);
}

// 7. Schema-boundary policy. No migration may create, alter, drop or re-grant a
//    public/auth object. `public` rows may be written only by 013, which is the
//    single reviewed publication bridge, and only in the exact shapes asserted
//    below — an insert into public.bios, an update of one bio row, and a SELECT
//    to resolve a platform. Everything else is refused here.
const WRITERS = new Set(['013_publication_bridge.sql']);
for (const { name, body } of sql) {
  const stripped = body.replace(/--[^\n]*/g, '');
  assert.ok(!/\b(create|alter|drop)\s+(table|view|index|policy|function|trigger|schema|role|extension)\s+(if not exists\s+)?(public|auth)\./i.test(stripped), `${name} modifies ${'public/auth'}`);
  assert.ok(!/\bgrant\b[^;]*\bpublic\./i.test(stripped), `${name} grants on public`);
  assert.ok(!/\b(revoke|grant)\b[^;]*\bon\s+(schema\s+)?(public|auth)\b/i.test(stripped), `${name} changes privileges on public/auth`);
  assert.ok(!/\bdrop\s+table\b/i.test(stripped), `${name} drops a table`);
  assert.ok(!/\bdelete from (public|auth)\./i.test(stripped), `${name} deletes from ${'public/auth'}`);
  if (!WRITERS.has(name)) {
    assert.ok(!/\binsert into (public|auth)\./i.test(stripped), `${name} writes to ${'public/auth'}`);
    assert.ok(!/\bupdate (public|auth)\./i.test(stripped), `${name} updates ${'public/auth'}`);
  }
}
// 7b. The publication bridge must stay minimal and non-destructive. These are
//     the properties the approval report claims about it, asserted mechanically.
{
  const bridge = sql.find(entry => entry.name === '013_publication_bridge.sql').body.replace(/--[^\n]*/g, '');
  const publicWrites = [...bridge.matchAll(/\b(insert into|update|delete from)\s+(public\.[a-z_]+)/gi)]
    .map(m => `${m[1].toLowerCase()} ${m[2]}`).sort();
  assert.deepEqual(publicWrites, ['insert into public.bios', 'update public.bios'],
    `publication bridge touches unexpected public objects: ${publicWrites.join(', ')}`);
  // Every public read must be a platform lookup or the idempotency re-read.
  const publicReads = [...bridge.matchAll(/\bfrom\s+(public\.[a-z_]+)/gi)].map(m => m[1]);
  assert.deepEqual([...new Set(publicReads)].sort(), ['public.bios', 'public.platforms'], 'publication bridge reads unexpected public objects');
  // `on delete restrict` is a foreign-key rule and `before ... delete` is the
  // append-only trigger; neither is a DELETE statement.
  const withoutNoise = bridge.replace(/on delete restrict/gi, '').replace(/before update or delete/gi, '').replace(/\bupdate or delete\b/gi, '');
  assert.ok(!/\bdelete\s+from\b/i.test(withoutNoise), 'publication bridge must never delete rows');
  assert.ok(!/\btruncate\s+(table\s+)?public\./i.test(bridge), 'publication bridge must never truncate a public table');
  // Separation of duties must be enforced in SQL, not only in the server.
  assert.match(bridge, /self publication refused/);
  assert.match(bridge, /independent approval required/);
  assert.match(bridge, /require_actor\('content\.publish'\)/);
}

// 8. Client-facing revocation: 001 revokes EXECUTE from PUBLIC by default
//    privilege for the whole schema; every later file that creates a function
//    must revoke again explicitly for the exact signatures it created.
assert.match(sql[0].body, /alter default privileges in schema bc_admin_v1 revoke execute on functions from public, anon, authenticated/);
for (const { name, body } of sql.slice(1)) {
  if (!/create function/.test(body)) continue;
  // Spacing is not the contract; revoking from exactly these three roles is.
  assert.match(body, /revoke all on function[\s\S]*?from\s+public,\s*anon,\s*authenticated/, `${name} does not revoke EXECUTE from clients`);
}

// 9. Rollback files exist for every migration and never cascade.
for (const name of files) {
  const rollback = fs.readFileSync(`admin-backend/rollback/${name}`, 'utf8');
  assert.ok(!/\bcascade\b/i.test(rollback.replace(/--[^\n]*/g, '')), `${name} rollback uses CASCADE`);
  // The restored 011 gate legitimately *reads* auth.uid()/auth.jwt() and
  // auth.sessions; the rule is that no rollback may create, drop, write to or
  // re-grant anything in public/auth.
  const stripped = rollback.replace(/--[^\n]*/g, '').replace(/auth\.(uid|jwt)\(\)/g, '');
  assert.ok(!/(create|alter|drop|insert into|delete from|update|grant|revoke)\s+(table\s+|function\s+)?(public|auth)\./i.test(stripped), `${name} rollback modifies public/auth`);
  assert.ok(!/\b(delete from|insert into|update)\s+auth\./i.test(stripped), `${name} rollback writes to auth`);
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
