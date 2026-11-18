/**
 * Creates a disposable database for the sync test and prints its URL.
 *
 * Prints `SKIP` and exits 0 when no Postgres is reachable, so the test runner can
 * report an environment gap honestly instead of failing or silently passing.
 *
 * Connection is taken from TEST_PG_SOCKET (a unix socket directory, as used by an
 * embedded Postgres) or TEST_DATABASE_ADMIN_URL. Never points at production.
 */
import { readFileSync } from 'node:fs';
import pg from 'pg';

const SOCKET = process.env.TEST_PG_SOCKET;
const ADMIN_URL = process.env.TEST_DATABASE_ADMIN_URL;
const DBNAME = process.env.TEST_DB_NAME || 'biocraft_sync_test';
const user = process.env.TEST_PG_USER || process.env.USER;

const adminConfig = SOCKET
  ? { host: SOCKET, database: 'postgres', user }
  : ADMIN_URL
    ? { connectionString: ADMIN_URL }
    : null;

if (!adminConfig) {
  console.log('SKIP no disposable Postgres configured (set TEST_PG_SOCKET)');
  process.exit(0);
}

const MIGRATIONS = [
  '0001_initial_schema.sql',
  '0002_rls_policies.sql',
  '0004_stable_bio_pagination.sql',
  '0005_infinite_expansion_limits.sql',
  '0006_global_content_intelligence.sql',
];

let admin;
try {
  admin = new pg.Client(adminConfig);
  await admin.connect();
} catch (e) {
  console.log(`SKIP disposable Postgres not reachable: ${e.message}`);
  process.exit(0);
}

try {
  await admin.query(`drop database if exists ${DBNAME}`);
  await admin.query(`create database ${DBNAME}`);
} finally {
  // keep the connection for the URL below, then close
}

// Explicit fields rather than `...adminConfig`: spreading a config that carries a
// `connectionString` keeps that DSN and ignores the `database` override.
const db = new pg.Client(SOCKET
  ? { host: SOCKET, user, database: DBNAME }
  : { connectionString: ADMIN_URL, database: DBNAME });
await db.connect();
// Supabase provides these roles and schema; a bare Postgres does not.
// Roles are cluster-wide: recreating the database does not remove them, so each
// creation is guarded rather than failing the bootstrap on a second run.
await db.query(`
  do $$ begin
    if not exists (select 1 from pg_roles where rolname='anon') then create role anon nologin; end if;
    if not exists (select 1 from pg_roles where rolname='authenticated') then create role authenticated nologin; end if;
    if not exists (select 1 from pg_roles where rolname='service_role') then create role service_role nologin bypassrls; end if;
  end $$;
  create schema if not exists auth;
  create or replace function auth.uid() returns uuid language sql stable as $$ select null::uuid $$;
`);
await db.query('create extension if not exists pgcrypto');
await db.query('create extension if not exists pg_trgm');
for (const f of MIGRATIONS) {
  await db.query(readFileSync(`supabase/migrations/${f}`, 'utf8'));
}
await db.end();
await admin.end();

const url = SOCKET
  ? `postgres://${encodeURIComponent(user)}@/${DBNAME}?host=${SOCKET}`
  : ADMIN_URL.replace(/\/[^/]*$/, `/${DBNAME}`);
console.log(url);
