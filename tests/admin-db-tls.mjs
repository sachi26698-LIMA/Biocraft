// The deployed Admin API failed its database handshake with
// SELF_SIGNED_CERT_IN_CHAIN: Supabase's pooler chain ends at "Supabase Root 2021
// CA", a private root absent from Node's trust store, so verification failed
// before any credential was sent. The fix trusts that one published root — it
// does NOT disable verification. These assertions keep it that way.
import assert from 'node:assert/strict';
import {X509Certificate} from 'node:crypto';
import {SUPABASE_ROOT_CA} from '../admin-backend/server/database.mjs';
import {databaseCa} from '../admin-backend/server/app.mjs';

const POOLER='aws-0-ap-southeast-2.pooler.supabase.com';
const DIRECT='db.jvpadtzfsuekixrquzjv.supabase.co';

// 1. The bundled certificate is exactly the published Supabase Root 2021 CA.
//    A different or substituted root would silently change who can impersonate
//    the database, so the fingerprint is pinned rather than trusted by name.
const cert=new X509Certificate(SUPABASE_ROOT_CA);
assert.equal(cert.fingerprint256,
  '80:70:25:AD:50:D4:ED:21:9D:2C:9C:7D:29:9C:00:4F:82:4E:B0:0C:F7:F6:5A:FE:F6:07:D0:7B:72:E6:CA:FA',
  'bundled CA is not the published Supabase Root 2021 CA');
assert.match(cert.subject,/CN=Supabase Root 2021 CA/);
assert.equal(cert.ca,true,'bundled certificate is not a CA');
assert.ok(new Date(cert.validTo)>new Date('2031-01-01'),'bundled CA expires too soon to be useful');

// 2. A pooler login is verified against that root; the direct host keeps the
//    system store. Widening trust for the direct host would be gratuitous.
assert.equal(databaseCa({},POOLER),SUPABASE_ROOT_CA,'pooler must be verified against Supabase\'s root');
assert.equal(databaseCa({},DIRECT),undefined,'direct host must keep the system trust store');

// 3. An operator-supplied PEM wins, but only when it is actually a certificate.
const override='-----BEGIN CERTIFICATE-----\nMIIB\n-----END CERTIFICATE-----';
assert.equal(databaseCa({ADMIN_DB_CA_PEM:override},POOLER),override);
assert.equal(databaseCa({ADMIN_DB_CA_PEM:'not a certificate'},POOLER),SUPABASE_ROOT_CA,
  'a malformed override must not silently disable verification');

// 4. Verification is never turned off: the pool factory refuses a CA-less
//    request only by using the system store, and rejectUnauthorized stays true.
const poolSource=(await import('node:fs')).readFileSync('admin-backend/server/database.mjs','utf8');
assert.match(poolSource,/rejectUnauthorized:true/,'TLS verification must never be disabled');
assert.ok(!/rejectUnauthorized:\s*false/.test(poolSource),'rejectUnauthorized:false must not appear anywhere');

console.log('PASS admin database TLS: bundled CA is the published Supabase Root 2021 CA by fingerprint, the pooler is verified against it, the direct host keeps the system store, and verification is never disabled');
