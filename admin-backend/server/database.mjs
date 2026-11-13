// Server-only SQL adapter. Nothing in this file creates a listener or database
// connection. A reviewed non-owner/non-bypass pool must be explicitly supplied.
// Never expose database credentials or call this with an unverified identity.
// DB EXECUTE/schema grants and owner design need separate security review.
import pg from 'pg';
const {Pool}=pg;
// Version numbers and counts are non-negative and far below 2^53. Returning
// them as JavaScript numbers keeps API validation explicit instead of relying
// on string comparison of PostgreSQL int8 values.
pg.types.setTypeParser(20,value=>Number(value));
/** Only direct TLS connections to the specified existing project are supported.
 * Credentials must be injected server-side; never commit or log them. The pool
 * is lazy and does not connect until a request is executed. A dedicated limited
 * DB role must be reviewed/provisioned separately before any real use. */
const PROJECT_REF='jvpadtzfsuekixrquzjv';
// Accepted hosts are limited to this project's direct connection and its
// Supavisor session pooler (Vercel egress is IPv4-only, so the pooler is the
// realistic production path). Any other host is refused.
const DIRECT=`db.${PROJECT_REF}.supabase.co`;
const POOLER=/^aws-[0-9]+-[a-z0-9-]+\.pooler\.supabase\.com$/;
export function createPostgresPool({host,user,password,ca,port}={}) {
 if(typeof host!=='string'||(host!==DIRECT && !POOLER.test(host)) || typeof user!=='string' || !user || typeof password!=='string' || !password || (ca!==undefined && typeof ca!=='string')) throw new Error('Invalid database configuration');
 // A pooler login must be scoped to the project (postgres.<ref>) or explicit
 // project role (role.<ref>); a direct login must not carry a project suffix.
 const expected=host===DIRECT?/^[a-z_][a-z0-9_]{0,62}$/:new RegExp(`^[a-z_][a-z0-9_]{0,62}\\.${PROJECT_REF}$`);
 if(!expected.test(user)) throw new Error('Invalid database configuration');
 const resolvedPort=port===undefined?(host===DIRECT?5432:5432):port;
 if(!Number.isSafeInteger(resolvedPort)||resolvedPort<1||resolvedPort>65535) throw new Error('Invalid database configuration');
 return new Pool({host,port:resolvedPort,user,password,database:'postgres',ssl:{rejectUnauthorized:true,...(ca?{ca}:{})},max:3,connectionTimeoutMillis:5000,idleTimeoutMillis:10000});
}
export async function assertLimitedRole(client) {
 const roleCheck=await client.query(`select session_user=current_user
    and not me.rolsuper and not me.rolbypassrls and not me.rolcreaterole and not me.rolcreatedb and not me.rolreplication
    and not exists(select 1 from pg_catalog.pg_roles high where (high.rolsuper or high.rolbypassrls or high.rolcreaterole or high.rolcreatedb or high.rolreplication) and pg_catalog.pg_has_role(me.oid,high.oid,'MEMBER'))
    and not pg_catalog.pg_has_role(me.oid,n.nspowner,'MEMBER')
    and not pg_catalog.has_schema_privilege(me.oid,n.oid,'CREATE')
    and not exists(select 1 from pg_catalog.pg_proc p where p.pronamespace=n.oid and pg_catalog.pg_has_role(me.oid,p.proowner,'MEMBER'))
    and not exists(select 1 from pg_catalog.pg_class c where c.relnamespace=n.oid and c.relkind in ('r','p','v','m','f') and
      (pg_catalog.pg_has_role(me.oid,c.relowner,'MEMBER') or pg_catalog.has_table_privilege(me.oid,c.oid,'SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER') or pg_catalog.has_any_column_privilege(me.oid,c.oid,'SELECT,INSERT,UPDATE,REFERENCES')))
    and not exists(select 1 from pg_catalog.pg_class c where c.relnamespace=n.oid and c.relkind='S' and
      (pg_catalog.pg_has_role(me.oid,c.relowner,'MEMBER') or pg_catalog.has_sequence_privilege(me.oid,c.oid,'USAGE,SELECT,UPDATE'))) as safe
    from pg_catalog.pg_roles me join pg_catalog.pg_namespace n on n.nspname='bc_admin_v1' where me.rolname=current_user`);
 if(roleCheck.rows.length!==1 || roleCheck.rows[0].safe!==true) throw new Error('Unsafe database executor role');
}
const OPERATIONS = Object.freeze({
  sessionOpen: {permission:null,sql:'select bc_admin_v1.open_admin_session($1::uuid) as expires_at'},
  sessionRevoke: {permission:'dashboard.read',sql:'select bc_admin_v1.revoke_admin_session($1::uuid)'},
  sessionRevokeAll: {permission:'dashboard.read',sql:'select bc_admin_v1.revoke_my_sessions($1::uuid) as revoked'},
  sessionCheck: {permission:'dashboard.read',sql:'select true as active'},
  staffList: {permission:'staff.read',sql:'select * from bc_admin_v1.list_staff($1,$2::uuid)'},
  list: {permission:'content.read',sql:'select * from bc_admin_v1.list_my_bio_drafts($1,$2::timestamptz,$3::uuid)'},
  draftGet: {permission:'content.read',sql:'select * from bc_admin_v1.get_bio_draft($1::uuid)'},
  reviewQueue: {permission:'content.read',sql:'select * from bc_admin_v1.list_bio_review_queue($1,$2::timestamptz,$3::uuid)'},
  draftUpdate: {permission:'content.draft',sql:'select bc_admin_v1.update_bio_draft($1::uuid,$2::bigint,$3::jsonb,$4::uuid) as row_version'},
  create: {permission:'content.draft',sql:'select bc_admin_v1.create_bio_draft($1,$2::jsonb,$3::uuid) as draft_id'},
  submit: {permission:'content.draft',sql:'select bc_admin_v1.submit_draft($1::uuid,$2::bigint,$3::uuid,$4::uuid)'},
  reviewApprove: {permission:'content.review',sql:'select bc_admin_v1.review_draft($1::uuid,$2::bigint,true,$3::uuid)'},
  reviewReject: {permission:'content.reject',sql:'select bc_admin_v1.review_draft($1::uuid,$2::bigint,false,$3::uuid)'},
  // Read-only module lists. Authorization is rechecked inside each definer
  // function; require_actor here is defense in depth, not the only check.
  platformList: {permission:'content.read',sql:'select * from bc_admin_v1.list_platforms($1,$2::uuid)'},
  categoryList: {permission:'content.read',sql:'select * from bc_admin_v1.list_categories($1,$2::uuid)'},
  collectionList: {permission:'content.read',sql:'select * from bc_admin_v1.list_collections($1,$2::text)'},
  generatorList: {permission:'content.read',sql:'select * from bc_admin_v1.list_generators($1,$2::uuid)'},
  seoList: {permission:'content.read',sql:'select * from bc_admin_v1.list_seo_pages($1,$2::uuid)'},
  analytics: {permission:'analytics.read',sql:'select * from bc_admin_v1.analytics_overview()'},
  settingList: {permission:'settings.read',sql:'select * from bc_admin_v1.list_settings($1,$2::text)'},
  settingUpdate: {permission:'settings.manage',sql:'select bc_admin_v1.update_setting($1,$2::jsonb,$3::bigint,$4::uuid) as version'},
  roleCatalog: {permission:'staff.read',sql:'select * from bc_admin_v1.list_role_catalog()'},
  mySessions: {permission:'dashboard.read',sql:'select * from bc_admin_v1.list_my_sessions($1,$2::timestamptz)'},
  auditLogs: {permission:'audit.read',sql:'select * from bc_admin_v1.list_audit_logs($1,$2::bigint)'}
});
/** The trusted gateway verifies the provider token before calling this adapter.
 * DB locks and authorization checks occur within the same transaction as the
 * operation. set_config is transaction-local; all failures roll back. */
// Sensitive commands additionally require a recent, provider-observed TOTP
// event. Missing amr data fails closed. This is independent of, and does not
// replace, per-row permission checks and locks inside the transaction.
const STEP_UP = new Set(['create','draftUpdate','submit','reviewApprove','reviewReject','staffUpdate','sessionRevokeAll','settingUpdate']);
export function createDatabaseExecutor(pool,{maxMfaAgeMs=10*60*1000,now=Date.now}={}) {
 if (!pool || typeof pool.connect !== 'function' || !Number.isSafeInteger(maxMfaAgeMs) || maxMfaAgeMs<60000 || typeof now!=='function') throw new Error('Database pool required');
 return async function execute({identity,operation,args}) {
  const op=OPERATIONS[operation];
  if (!op || !identity || identity.assuranceLevel !== 'aal2' || !Array.isArray(args)) throw new Error('Invalid operation');
  if (STEP_UP.has(operation) && (!Number.isSafeInteger(identity.mfaVerifiedAt) || identity.mfaVerifiedAt*1000 > now() || identity.mfaVerifiedAt*1000 <= now()-maxMfaAgeMs)) {const e=new Error('Step-up authentication required');e.code='28000';throw e;}
  const client=await pool.connect(); let inTransaction=false;
  try {
   await client.query('begin'); inTransaction=true;
   // Refuse owner, superuser, BYPASSRLS or membership in privileged roles. This
   // is defense in depth, not a replacement for a complete effective-grant audit.
   await assertLimitedRole(client);
   // Only whitelisted identity fields produced after provider verification;
   // never copy client-provided claims or raw JWT into database context.
   const claims=JSON.stringify({sub:identity.userId,session_id:identity.sessionId,aal:'aal2'});
   await client.query("select set_config('request.jwt.claims',$1,true)",[claims]);
   if(op.permission!==null) {
    const auth=await client.query('select bc_admin_v1.require_actor($1) as user_id',[op.permission]);
    if (auth.rows.length!==1 || auth.rows[0].user_id!==identity.userId) throw new Error('Identity mismatch');
   }
   const result=await client.query(op.sql,args);
   await client.query('commit'); inTransaction=false;
   return result.rows;
  } catch(e) {
   if(inTransaction) {try {await client.query('rollback');} catch { /* preserve failure */ }}
   throw e;
  } finally {await client.release();}
 };
}
