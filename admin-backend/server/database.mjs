// Server-only SQL adapter. Nothing in this file creates a listener or database
// connection. A reviewed non-owner/non-bypass pool must be explicitly supplied.
// Never expose database credentials or call this with an unverified identity.
// DB EXECUTE/schema grants and owner design need separate security review.
import pg from 'pg';
const {Pool}=pg;
/** Only direct TLS connections to the specified existing project are supported.
 * Credentials must be injected server-side; never commit or log them. The pool
 * is lazy and does not connect until a request is executed. A dedicated limited
 * DB role must be reviewed/provisioned separately before any real use. */
export function createPostgresPool({host,user,password,ca}={}) {
 if(host!=='db.jvpadtzfsuekixrquzjv.supabase.co' || typeof user!=='string' || !user || typeof password!=='string' || !password || (ca!==undefined && typeof ca!=='string')) throw new Error('Invalid database configuration');
 return new Pool({host,user,password,database:'postgres',ssl:{rejectUnauthorized:true,...(ca?{ca}:{})},max:3,connectionTimeoutMillis:5000,idleTimeoutMillis:10000});
}
export async function assertLimitedRole(client) {
 const roleCheck=await client.query(`select not me.rolsuper and not me.rolbypassrls
    and not exists(select 1 from pg_catalog.pg_roles high where (high.rolsuper or high.rolbypassrls) and pg_catalog.pg_has_role(me.oid,high.oid,'MEMBER'))
    and not pg_catalog.pg_has_role(me.oid,n.nspowner,'MEMBER')
    and not exists(select 1 from pg_catalog.pg_proc p where p.pronamespace=n.oid and pg_catalog.pg_has_role(me.oid,p.proowner,'MEMBER')) as safe
    from pg_catalog.pg_roles me join pg_catalog.pg_namespace n on n.nspname='bc_admin_v1' where me.rolname=current_user`);
 if(roleCheck.rows.length!==1 || roleCheck.rows[0].safe!==true) throw new Error('Unsafe database executor role');
}
const OPERATIONS = Object.freeze({
  sessionOpen: {permission:null,sql:'select bc_admin_v1.open_admin_session($1::uuid) as expires_at'},
  sessionRevoke: {permission:'dashboard.read',sql:'select bc_admin_v1.revoke_admin_session($1::uuid)'},
  sessionCheck: {permission:'dashboard.read',sql:'select true as active'},
  staffList: {permission:'staff.read',sql:'select * from bc_admin_v1.list_staff($1,$2::uuid)'},
  list: {permission:'content.read',sql:'select * from bc_admin_v1.list_my_bio_drafts($1,$2::timestamptz,$3::uuid)'},
  create: {permission:'content.draft',sql:'select bc_admin_v1.create_bio_draft($1,$2::jsonb,$3::uuid) as draft_id'},
  submit: {permission:'content.draft',sql:'select bc_admin_v1.submit_draft($1::uuid,$2::bigint,$3::uuid,$4::uuid)'},
  reviewApprove: {permission:'content.review',sql:'select bc_admin_v1.review_draft($1::uuid,$2::bigint,true,$3::uuid)'},
  reviewReject: {permission:'content.reject',sql:'select bc_admin_v1.review_draft($1::uuid,$2::bigint,false,$3::uuid)'}
});
/** The trusted gateway verifies the provider token before calling this adapter.
 * DB locks and authorization checks occur within the same transaction as the
 * operation. set_config is transaction-local; all failures roll back. */
export function createDatabaseExecutor(pool) {
 if (!pool || typeof pool.connect !== 'function') throw new Error('Database pool required');
 return async function execute({identity,operation,args}) {
  const op=OPERATIONS[operation];
  if (!op || !identity || identity.assuranceLevel !== 'aal2' || !Array.isArray(args)) throw new Error('Invalid operation');
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
