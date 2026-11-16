// PRIVATE SERVER HANDLER — NOT mounted, deployed, or enabled by default.
// Bearer-only (never cookies): no ambient credentials, no permissive CORS.
// Preview still points at production-connected Supabase: all DB grants,
// identity/session setup and endpoint enablement require separate review.
import {randomUUID} from 'node:crypto';
import {verifyProviderIdentity,AccessError} from './identity.mjs';
import {validateBio,ValidationError} from '../domain/bio.mjs';
const uid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const head={'Cache-Control':'no-store','Content-Type':'application/json; charset=utf-8','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'};
class ApiError extends Error { constructor(status,code){super(code);this.status=status;this.code=code;} }
const fail=(status,code)=>{throw new ApiError(status,code)};
function json(status,value){return new Response(JSON.stringify(value),{status,headers:head});}
async function bodyJson(request) {
 if (!/^application\/json(?:\s*;|$)/i.test(request.headers.get('content-type') ?? '')) fail(415,'INVALID_CONTENT_TYPE');
 const len=request.headers.get('content-length');
 if(len && (!/^\d+$/.test(len) || Number(len)>32768)) fail(413,'TOO_LARGE');
 if(!request.body) fail(400,'INVALID');
 const reader=request.body.getReader();let size=0,parts=[];
 try {for(;;){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>32768){await reader.cancel();fail(413,'TOO_LARGE')}parts.push(value)}} finally {reader.releaseLock()}
 try {const value=JSON.parse(Buffer.concat(parts.map(p=>Buffer.from(p))).toString('utf8'));if(!value||typeof value!=='object'||Array.isArray(value))fail(422,'INVALID');return value}
 catch(e){if(e instanceof ApiError)throw e;fail(400,'INVALID_JSON')}
}
function keys(value,allowed) {if(Object.keys(value).some(k=>!allowed.includes(k))) fail(422,'INVALID')}
function integer(value,min,max){if(!Number.isSafeInteger(value)||value<min||value>max)fail(422,'INVALID');return value}
function requestId(){return randomUUID()}
// Bounded paging shared by read-only module endpoints. Unknown, repeated or
// malformed parameters are rejected rather than silently ignored.
function pageLimit(url,min=1,max=100,fallback=50){const raw=url.searchParams.get('limit')??String(fallback);if(!/^\d{1,4}$/.test(raw))fail(422,'INVALID');return integer(Number(raw),min,max)}
function paging(url,allowed,expect={}) {
 for(const key of url.searchParams.keys()) if(!allowed.includes(key)) fail(400,'INVALID');
 for(const key of new Set(url.searchParams.keys())) if(url.searchParams.getAll(key).length!==1) fail(400,'INVALID');
 for(const [key,type] of Object.entries(expect)) {
  const value=url.searchParams.get(key); if(value===null) continue;
  if(type==='time'&&(!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{1,6})?Z$/.test(value)||!Number.isFinite(Date.parse(value))))fail(422,'INVALID');
  if(type==='bigint'&&! /^\d{1,18}$/.test(value))fail(422,'INVALID');
  if(type==='slug'&&!/^[a-z0-9][a-z0-9-]{0,199}$/.test(value))fail(422,'INVALID');
  if(type==='uuid'&&!uid.test(value))fail(422,'INVALID');
  if(type==='text'&&value.length>120)fail(422,'INVALID');
  if(type==='boolean'&&value!=='true'&&value!=='false')fail(422,'INVALID');
 }
}
export function createAdminHandler({provider,execute,rateLimit,platformRules,recovery=null,enabled=false}={}) {
 return async function handle(request) {
  const id=requestId();
  try {
   if(!enabled || typeof execute!=='function' || typeof rateLimit!=='function' || !provider?.auth?.getUser) fail(503,'UNAVAILABLE');
   const url=new URL(request.url);
   if(url.search.length>2000)fail(400,'INVALID');
   const match=request.headers.get('authorization')?.match(/^Bearer ([A-Za-z0-9_.-]{1,8192})$/);
   if(!match)fail(401,'UNAUTHENTICATED');
   const identity=await verifyProviderIdentity({token:match[1],provider});
   let permitted;try{permitted=await rateLimit({userId:identity.userId,operation:'admin-api'});}catch{fail(503,'UNAVAILABLE')}
   if(permitted!==true)fail(429,'RATE_LIMITED');
   let operation,args;
   if(url.pathname==='/api/admin/v1/session' && request.method==='POST' && !url.search) {
    operation='sessionOpen';args=[id];
   } else if(url.pathname==='/api/admin/v1/session' && request.method==='DELETE' && !url.search) {
    // `revoke_admin_session(p_request_id)` closes the caller's *own* session: the
    // target comes from the verified JWT session id inside SQL, and the argument
    // is only the request id recorded in the audit row. Passing the session id
    // here would be wrong — it would be recorded as if it were a request.
    operation='sessionRevoke';args=[id];
   } else if(url.pathname==='/api/admin/v1/sessions/revoke-all' && request.method==='POST' && !url.search) {
    // "Sign out everywhere". Step-up protected, because it is a destructive act on
    // every live session this account holds, including the calling one.
    operation='sessionRevokeAll';args=[id];
   } else if(url.pathname==='/api/admin/v1/session' && request.method==='GET' && !url.search) {
    // Returns the account and what it may do, so a console can decide what to show
    // before requesting module data. Server-side checks still run per call.
    operation='sessionIdentity';args=[];
   } else if(url.pathname==='/api/admin/v1/sessions' && request.method==='GET') {
    paging(url,['limit','before'],{before:'time'});
    operation='mySessions';args=[pageLimit(url),url.searchParams.get('before')];
   } else if(url.pathname==='/api/admin/v1/roles' && request.method==='GET' && !url.search) {
    operation='roleCatalog';args=[];
   } else if(url.pathname==='/api/admin/v1/audit-logs' && request.method==='GET') {
    paging(url,['limit','before'],{before:'bigint'});
    operation='auditLogs';args=[pageLimit(url),url.searchParams.get('before')===null?null:Number(url.searchParams.get('before'))];
   } else if(url.pathname==='/api/admin/v1/notifications' && request.method==='GET') {
    // The caller's own inbox. The recipient is the session, never a parameter.
    paging(url,['limit','before'],{before:'time'});
    operation='notificationList';args=[pageLimit(url),url.searchParams.get('before')];
   } else if(url.pathname==='/api/admin/v1/notifications/read' && request.method==='POST' && !url.search) {
    const body=await bodyJson(request);keys(body,['before']);
    if(body.before!==undefined&&body.before!==null&&(typeof body.before!=='string'||Number.isNaN(Date.parse(body.before))))fail(422,'INVALID');
    operation='notificationRead';args=[body.before??null];
   } else if(url.pathname==='/api/admin/v1/publication-jobs' && request.method==='GET') {
    paging(url,['limit','before'],{before:'uuid'});
    operation='publicationJobList';args=[pageLimit(url),url.searchParams.get('before')];
   } else if(url.pathname==='/api/admin/v1/backups' && request.method==='GET') {
    paging(url,['limit','before'],{before:'time'});
    operation='backupList';args=[pageLimit(url),url.searchParams.get('before')];
   } else if(url.pathname==='/api/admin/v1/bios' && request.method==='GET') {
    paging(url,['limit','after','search','language','active'],{after:'uuid',search:'text',language:'text',active:'boolean'});
    operation='bioList';
    args=[pageLimit(url),url.searchParams.get('after'),url.searchParams.get('search'),url.searchParams.get('language'),
      url.searchParams.get('active')===null?null:url.searchParams.get('active')==='true'];
   } else if(url.pathname==='/api/admin/v1/analytics' && request.method==='GET' && !url.search) {
    operation='analytics';args=[];
   } else if(['/api/admin/v1/platforms','/api/admin/v1/categories','/api/admin/v1/generators','/api/admin/v1/seo-pages'].includes(url.pathname) && request.method==='GET') {
    paging(url,['limit','after'],{after:'uuid'});
    operation={platforms:'platformList',categories:'categoryList',generators:'generatorList','seo-pages':'seoList'}[url.pathname.split('/').at(-1)];
    args=[pageLimit(url),url.searchParams.get('after')];
   } else if(['/api/admin/v1/collections','/api/admin/v1/settings'].includes(url.pathname) && request.method==='GET') {
    paging(url,['limit','after'],{after:'slug'});
    operation=url.pathname.endsWith('collections')?'collectionList':'settingList';
    args=[pageLimit(url),url.searchParams.get('after')];
   } else if(url.pathname==='/api/admin/v1/settings' && request.method==='PUT') {
    const body=await bodyJson(request);keys(body,['key','value','expectedVersion']);integer(body.expectedVersion,1,Number.MAX_SAFE_INTEGER);
    if(typeof body.key!=='string'||!/^[a-z][a-z0-9_.-]{0,99}$/.test(body.key))fail(422,'INVALID');
    if(!body.value||typeof body.value!=='object'||Array.isArray(body.value))fail(422,'INVALID');
    operation='settingUpdate';args=[body.key,JSON.stringify(body.value),body.expectedVersion,id];
   } else if(url.pathname==='/api/admin/v1/staff' && request.method==='GET') {
    if([...url.searchParams.keys()].some(k=>!['limit','after'].includes(k)) || [...new Set(url.searchParams.keys())].some(k=>url.searchParams.getAll(k).length!==1))fail(400,'INVALID');
    const raw=url.searchParams.get('limit')??'50',after=url.searchParams.get('after');
    if(!/^\d{1,3}$/.test(raw)||(after!==null&&!uid.test(after)))fail(422,'INVALID');
    operation='staffList';args=[integer(Number(raw),1,100),after];
   } else if(url.pathname==='/api/admin/v1/staff' && request.method==='PATCH' && !url.search) {
    // Membership administration (007). The SQL refuses a self-edit, a super-admin
    // promotion, the last super-admin demotion and a stale version, so this route
    // only has to validate shape.
    const body=await bodyJson(request);keys(body,['userId','expectedVersion','enabled','roles']);
    if(typeof body.userId!=='string'||!uid.test(body.userId))fail(422,'INVALID');
    integer(body.expectedVersion,1,Number.MAX_SAFE_INTEGER);
    if(typeof body.enabled!=='boolean')fail(422,'INVALID');
    if(!Array.isArray(body.roles)||body.roles.length<1||body.roles.length>8||body.roles.some(r=>typeof r!=='string'||!/^[a-z][a-z0-9_]{1,40}$/.test(r)))fail(422,'INVALID');
    operation='staffUpdate';args=[body.userId,body.expectedVersion,body.enabled,body.roles,id];
   } else if(url.pathname==='/api/admin/v1/staff/recovery' && request.method==='POST') {
    // Super Admin authorises one account, one time. The code is generated and
    // hashed outside the SQL call, so this route needs the recovery service.
    if(!recovery) fail(503,'UNAVAILABLE');
    const body=await bodyJson(request);keys(body,['userId','ttlSeconds']);
    if(typeof body.userId!=='string'||!uid.test(body.userId))fail(422,'INVALID');
    const ttl=body.ttlSeconds===undefined?900:integer(body.ttlSeconds,60,900);
    const issued=await recovery.issue({identity,targetUserId:body.userId,ttlSeconds:ttl,requestId:id});
    return new Response(JSON.stringify({grant_id:issued.grantId,code:issued.code,expires_in_seconds:issued.expiresInSeconds,request_id:id}),{status:201,headers:{...head,'Cache-Control':'no-store, no-cache, must-revalidate','Pragma':'no-cache'}});
   } else if(url.pathname==='/api/admin/v1/staff/recovery/revoke' && request.method==='POST') {
    if(!recovery) fail(503,'UNAVAILABLE');
    const body=await bodyJson(request);keys(body,['grantId']);
    if(typeof body.grantId!=='string'||!uid.test(body.grantId))fail(422,'INVALID');
    const revoked=await recovery.revoke({identity,grantId:body.grantId,requestId:id});
    return json(200,{revoked,request_id:id});
   } else if(url.pathname==='/api/admin/v1/staff/recovery/reset' && request.method==='POST') {
    // Completes a recovery: the operator has deleted the stale factor at the
    // provider, so the enrolment record can be cleared and the account returns to
    // first-enrolment. Privileged, audited, and never a side effect of redeeming.
    if(!recovery||typeof recovery.reset!=='function') fail(503,'UNAVAILABLE');
    const body=await bodyJson(request);keys(body,['userId']);
    if(typeof body.userId!=='string'||!uid.test(body.userId))fail(422,'INVALID');
    const reset=await recovery.reset({identity,targetUserId:body.userId,requestId:id});
    return json(200,{reset,request_id:id,next:reset?'re_enrol':'unchanged'});
   } else if(url.pathname==='/api/admin/v1/ops/cleanup' && request.method==='POST') {
    // Bounded maintenance. The target is validated again inside the SQL function,
    // which can only ever name the two operational tables.
    if(!recovery) fail(503,'UNAVAILABLE');
    const body=await bodyJson(request);keys(body,['target','limit']);
    if(!['admin_login_flows','admin_rate_limits'].includes(body.target))fail(422,'INVALID');
    const limit=body.limit===undefined?500:integer(body.limit,1,1000);
    const cleaned=await recovery.cleanup({identity,target:body.target,limit,requestId:id});
    return json(200,{deleted:cleaned.deleted,request_id:id});
   } else if(['/api/admin/v1/bio-drafts','/api/admin/v1/bio-review-queue'].includes(url.pathname) && request.method==='GET') {
    if([...url.searchParams.keys()].some(k=>!['limit','before_time','before_id'].includes(k)) || [...new Set(url.searchParams.keys())].some(k=>url.searchParams.getAll(k).length!==1))fail(400,'INVALID');
    const raw=url.searchParams.get('limit')??'20';if(!/^\d{1,3}$/.test(raw))fail(422,'INVALID');const limit=integer(Number(raw),1,100);
    const time=url.searchParams.get('before_time'),beforeId=url.searchParams.get('before_id');
    if((time===null)!==(beforeId===null) || (time!==null && (!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{1,6})?Z$/.test(time) || !Number.isFinite(Date.parse(time)) || !uid.test(beforeId))))fail(422,'INVALID');
    operation=url.pathname.endsWith('bio-drafts')?'list':'reviewQueue';args=[limit,time,beforeId];
   } else if(url.pathname==='/api/admin/v1/publications' && request.method==='GET') {
    // Publication history for one bio (013). Newest first, keyset paged.
    if([...url.searchParams.keys()].some(k=>!['bio_id','limit','before'].includes(k)) || [...new Set(url.searchParams.keys())].some(k=>url.searchParams.getAll(k).length!==1))fail(400,'INVALID');
    const bioId=url.searchParams.get('bio_id');
    if(bioId===null||!uid.test(bioId))fail(422,'INVALID');
    const raw=url.searchParams.get('limit')??'50';if(!/^\d{1,3}$/.test(raw))fail(422,'INVALID');
    const before=url.searchParams.get('before');
    if(before!==null&&!/^\d{1,18}$/.test(before))fail(422,'INVALID');
    operation='publications';args=[bioId,integer(Number(raw),1,100),before===null?null:Number(before)];
   } else if(url.pathname==='/api/admin/v1/bio-drafts' && request.method==='POST') {
    const body=await bodyJson(request);keys(body,['key','bio']);
    if(typeof body.key!=='string'||!/^[a-z0-9][a-z0-9_-]{0,99}$/.test(body.key))fail(422,'INVALID');
    const bio=validateBio(body.bio,platformRules); // rules are server configuration, not request data
    const {count,...payload}=bio; void count;
    operation='create';args=[body.key,JSON.stringify(payload),id];
   } else if(/^\/api\/admin\/v1\/bio-drafts\/[0-9a-f-]{36}$/i.test(url.pathname) && !url.search && ['GET','PUT'].includes(request.method)) {
    const draftId=url.pathname.split('/').at(-1);if(!uid.test(draftId))fail(422,'INVALID');
    if(request.method==='GET'){operation='draftGet';args=[draftId];}
    else {const body=await bodyJson(request);keys(body,['expectedVersion','bio']);integer(body.expectedVersion,1,Number.MAX_SAFE_INTEGER);
     const {count,...payload}=validateBio(body.bio,platformRules);void count;
     operation='draftUpdate';args=[draftId,body.expectedVersion,JSON.stringify(payload),id];}
   } else if((url.pathname.match(/^\/api\/admin\/v1\/bio-drafts\/[0-9a-f-]{36}\/(publish|revert)$/i)) && request.method==='POST' && !url.search) {
    // Two reviewed operations with different bodies, so they are checked apart.
    const action=url.pathname.split('/').at(-1);
    const draftId=url.pathname.split('/').at(-2);
    if(!uid.test(draftId))fail(422,'INVALID');
    const body=await bodyJson(request);
    integer(body.expectedVersion,1,Number.MAX_SAFE_INTEGER);
    if(action==='publish') {
     keys(body,['expectedVersion','bioId']);
     if(body.bioId!==null&&body.bioId!==undefined&&(typeof body.bioId!=='string'||!uid.test(body.bioId)))fail(422,'INVALID');
     operation='publish';args=[draftId,body.expectedVersion,body.bioId??null,id];
    } else {
     // A revert is anchored on the draft being reverted, so the body also names
     // the publication whose payload is being restored.
     keys(body,['expectedVersion','publicationId']);
     if(!Number.isSafeInteger(body.publicationId)||body.publicationId<1)fail(422,'INVALID');
     operation='revert';args=[body.publicationId,id];
    }
   } else {
    const path=url.pathname.match(/^\/api\/admin\/v1\/bio-drafts\/([0-9a-f-]{36})\/(submit|review)$/i);
    if(!path || request.method!=='POST' || url.search)fail(404,'NOT_FOUND');
    if(!uid.test(path[1]))fail(422,'INVALID');
    const body=await bodyJson(request);
    if(path[2]==='submit') {
     keys(body,['expectedVersion','reviewerId']);integer(body.expectedVersion,1,Number.MAX_SAFE_INTEGER);
     if(typeof body.reviewerId!=='string'||!uid.test(body.reviewerId))fail(422,'INVALID');
     operation='submit';args=[path[1],body.expectedVersion,body.reviewerId,id];
    } else {
     keys(body,['expectedVersion','decision']);integer(body.expectedVersion,1,Number.MAX_SAFE_INTEGER);
     if(!['approve','reject'].includes(body.decision))fail(422,'INVALID');
     operation=body.decision==='approve'?'reviewApprove':'reviewReject';args=[path[1],body.expectedVersion,id];
    }
   }
   const rows=await execute({identity,operation,args});
   if(!Array.isArray(rows))fail(503,'UNAVAILABLE');
   // "Revoke all my sessions" must name the caller's own action, not another one.
   if(operation==='sessionRevokeAll') {
    const revoked=Number(rows[0]?.revoked);
    if(rows.length!==1||!Number.isSafeInteger(revoked)||revoked<0)fail(503,'UNAVAILABLE');
    return json(200,{revoked,request_id:id});
   }
   if(operation==='sessionOpen') {
    const expiry=rows[0]?.expires_at;
    if(rows.length!==1 || !expiry || !Number.isFinite(Date.parse(expiry)))fail(503,'UNAVAILABLE');
    return json(200,{expires_at:new Date(expiry).toISOString(),request_id:id});
   }
   if(['list','staffList','reviewQueue','platformList','categoryList','collectionList','generatorList','seoList','settingList','mySessions','auditLogs','roleCatalog','publications','notificationList','publicationJobList','backupList','bioList'].includes(operation))return json(200,{items:rows,request_id:id});
   if(operation==='notificationRead'){
    // An UPDATE with no matching rows still returns exactly one row, so the count
    // is read from a single value column rather than inferred from row count.
    if(rows.length!==1)fail(503,'UNAVAILABLE');
    const marked=Number(rows[0]?.marked);
    if(!Number.isSafeInteger(marked)||marked<0)fail(503,'UNAVAILABLE');
    return json(200,{marked,request_id:id});
   }
   if(operation==='staffUpdate'){if(rows.length!==1||!Number.isSafeInteger(Number(rows[0]?.row_version)))fail(503,'UNAVAILABLE');return json(200,{row_version:Number(rows[0].row_version),request_id:id});}
   if(operation==='publish'){
    if(rows.length!==1||typeof rows[0]?.bio_id!=='string'||!['created','updated','archived','restored'].includes(rows[0]?.action))fail(503,'UNAVAILABLE');
    return json(200,{bio_id:rows[0].bio_id,action:rows[0].action,request_id:id});
   }
   if(operation==='revert'){if(rows.length!==1||typeof rows[0]?.revert_draft!=='string'||!uid.test(rows[0].revert_draft))fail(503,'UNAVAILABLE');return json(201,{draft_id:rows[0].revert_draft,request_id:id});}
   if(operation==='sessionIdentity'){
    if(rows.length!==1)fail(503,'UNAVAILABLE');
    const row=rows[0];
    if(typeof row?.user_id!=='string'||!Array.isArray(row.roles)||!Array.isArray(row.permissions))fail(503,'UNAVAILABLE');
    const expires=typeof row.session_expires_at==='string'?row.session_expires_at:new Date(row.session_expires_at).toISOString();
    return json(200,{user:{id:row.user_id,roles:row.roles,permissions:row.permissions},
      expires_at:expires,created_at:row.session_created_at,request_id:id});
   }
   if(operation==='analytics')return json(200,{metrics:rows,request_id:id});

   if(operation==='settingUpdate'){if(rows.length!==1||!Number.isSafeInteger(rows[0]?.version))fail(503,'UNAVAILABLE');return json(200,{version:rows[0].version,request_id:id});}
   if(operation==='draftGet'){if(rows.length!==1)fail(404,'NOT_FOUND');return json(200,{item:rows[0],request_id:id});}
   if(operation==='draftUpdate'){if(rows.length!==1)fail(503,'UNAVAILABLE');return json(200,{row_version:rows[0].row_version,request_id:id});}
   if(operation==='create'){
    if(rows.length!==1 || typeof rows[0]?.draft_id!=='string' || !uid.test(rows[0].draft_id))fail(503,'UNAVAILABLE');
    return json(201,{draft_id:rows[0].draft_id,request_id:id});
   }
   return json(200,{ok:true,request_id:id});
  } catch(e) {
   if(e instanceof ApiError)return json(e.status,{error:{code:e.code,request_id:id}});
   if(e instanceof ValidationError)return json(422,{error:{code:'INVALID',field:e.field,request_id:id}});
   if(e instanceof AccessError){const status={UNAUTHENTICATED:401,FORBIDDEN:403,UNAVAILABLE:503}[e.code]??503;return json(status,{error:{code:e.code,request_id:id}})}
   const code=typeof e?.code==='string'?e.code:'';
   if(code==='42501')return json(403,{error:{code:'FORBIDDEN',request_id:id}});
   if(code==='40001'||code==='23505')return json(409,{error:{code:'CONFLICT',request_id:id}});
   if(code==='22023'||code==='23514')return json(422,{error:{code:'INVALID',request_id:id}});
   if(code==='28000')return json(403,{error:{code:'STEP_UP_REQUIRED',request_id:id}});
   // P0002: the named resource does not exist (as opposed to a malformed one).
   if(code==='P0002')return json(404,{error:{code:'NOT_FOUND',request_id:id}});
   return json(503,{error:{code:'UNAVAILABLE',request_id:id}});
  }
 };
}
