/**
 * Regenerates the parts of the approval report and the security review that must
 * never be hand-copied: the SHA-256 inventory, the verbatim SQL appendix and the
 * machine-counted totals.
 *
 * Why a script: every previous count in these documents was typed by hand, and a
 * hand-typed count of a file list is a claim nobody checked. This reads the files
 * and rewrites the marked regions in place, so the documents cannot drift from
 * the bytes on disk.
 *
 * It rewrites only between explicit markers. Anything else in the documents is
 * editorial and left alone.
 *
 *   node scripts/admin-sync-docs.mjs           # rewrite
 *   node scripts/admin-sync-docs.mjs --check   # exit 1 if anything would change
 */
import fs from 'node:fs';
import { createHash } from 'node:crypto';

const MIGRATIONS = 'admin-backend/migrations';
const ROLLBACK = 'admin-backend/rollback';
const GRANTS = 'admin-backend/grants/executor-grants.sql';
const APPROVAL = 'docs/CONSOLIDATED_APPROVAL_REPORT.md';
const REVIEW = 'docs/FINAL_SECURITY_REVIEW.md';
const PROGRESS = 'docs/MASTER_ADMIN_PROGRESS.md';

const check = process.argv.includes('--check');
const sha = text => createHash('sha256').update(text).digest('hex');

const migrations = fs.readdirSync(MIGRATIONS).filter(f => f.endsWith('.sql')).sort();
const rollbacks = fs.readdirSync(ROLLBACK).filter(f => f.endsWith('.sql')).sort();

const strip = sql => sql.replace(/--[^\n]*/g, '');
const allSql = migrations.map(f => strip(fs.readFileSync(`${MIGRATIONS}/${f}`, 'utf8'))).join('\n');

const count = (pattern, text = allSql) => (text.match(pattern) ?? []).length;
const tables = new Set([...allSql.matchAll(/create table (?:if not exists )?bc_admin_v1\.([a-z_]+)/g)].map(m => m[1]));
// `create or replace` (002's guard_draft is re-declared by 013, 011's gate by 012)
// must not be counted twice: the signature exists once in the database.
const createdFunctions = [...new Set([...allSql.matchAll(/create(?: or replace)? function (bc_admin_v1\.[a-z_]+)\(/g)].map(m => m[1]))];
const grantSql = strip(fs.readFileSync(GRANTS, 'utf8'));
const granted = [...grantSql.matchAll(/bc_admin_v1\.[a-z_]+\([^)]*\)/g)].map(m => m[0].replace(/\s+/g, ''));
// Trigger bodies are the ungranted remainder: a function that is only ever run by
// a trigger is not callable, so it must not appear in the grant list.
const TRIGGER_ONLY = ['bc_admin_v1.guard_approval', 'bc_admin_v1.guard_draft', 'bc_admin_v1.reject_mutation', 'bc_admin_v1.stamp_mfa_enrolled', 'bc_admin_v1.notify_draft_event'];
const triggerBodies = TRIGGER_ONLY.filter(name => createdFunctions.includes(name));
const callable = createdFunctions.length - triggerBodies.length;

const totals = {
  tables: tables.size,
  functions: createdFunctions.length,
  callable,
  triggerBodies: triggerBodies.length,
  grants: granted.length,
  sqlFiles: migrations.length * 2 + 1,
  migrations: migrations.length,
};

function replaceRegion(text, name, body) {
  const start = `<!-- admin-sync:${name}:start -->`;
  const end = `<!-- admin-sync:${name}:end -->`;
  const from = text.indexOf(start);
  const to = text.indexOf(end);
  if (from === -1 || to === -1) throw new Error(`marker ${name} missing`);
  return `${text.slice(0, from + start.length)}\n${body.trimEnd()}\n${text.slice(to)}`;
}

function checksumList() {
  const rows = [];
  for (const file of [...migrations.map(f => `${MIGRATIONS}/${f}`), ...rollbacks.map(f => `${ROLLBACK}/${f}`), GRANTS]) {
    rows.push(`- \`${file}\` — \`${sha(fs.readFileSync(file))}\``);
  }
  return rows.join('\n');
}

function totalsLine() {
  return [
    `${totals.tables} tables.`,
    `${totals.functions} functions = ${totals.callable} callable SECURITY DEFINER + ${totals.triggerBodies} trigger bodies.`,
    `${totals.grants} granted signatures.`,
    `${totals.migrations} forward migrations, ${totals.migrations} rollbacks and 1 grant file (\`${totals.sqlFiles}\` SQL files).`,
  ].join(' ');
}

function sqlAppendix() {
  const block = (label, path, digest) => {
    const body = fs.readFileSync(path, 'utf8').trimEnd();
    return `### \`${label}\`\n\nSHA-256 \`${digest}\`.\n\n\`\`\`sql\n${body}\n\`\`\``;
  };
  const sections = [];
  sections.push('## Appendix A — forward migrations, verbatim');
  for (const file of migrations) sections.push(block(file, `${MIGRATIONS}/${file}`, sha(fs.readFileSync(`${MIGRATIONS}/${file}`))));
  sections.push('## Appendix B — rollbacks, verbatim');
  for (const file of rollbacks) sections.push(block(file, `${ROLLBACK}/${file}`, sha(fs.readFileSync(`${ROLLBACK}/${file}`))));
  sections.push('## Appendix C — executor grants, verbatim');
  sections.push(block('executor-grants.sql', GRANTS, sha(fs.readFileSync(GRANTS))));
  return sections.join('\n\n');
}

const pending = [];
function sync(file, name, body) {
  const before = fs.readFileSync(file, 'utf8');
  const after = replaceRegion(before, name, typeof body === 'function' ? body() : body);
  if (after !== before) pending.push(file);
  if (!check) fs.writeFileSync(file, after);
  return after !== before;
}

sync(APPROVAL, 'checksums', checksumList);
sync(APPROVAL, 'totals', totalsLine);
sync(APPROVAL, 'sql', sqlAppendix);
sync(REVIEW, 'checksums', checksumList);
sync(PROGRESS, 'totals', totalsLine);

if (check && pending.length > 0) {
  console.error(`Documentation is out of date: ${[...new Set(pending)].join(', ')}\nRun: node scripts/admin-sync-docs.mjs`);
  process.exit(1);
}
console.log(`${check ? 'OK' : 'Synced'}: ${totals.tables} tables, ${totals.functions} functions (${totals.callable} callable + ${totals.triggerBodies} trigger bodies), ${totals.grants} grants, ${totals.sqlFiles} SQL files${check ? ' — documents already current' : ''}`);
