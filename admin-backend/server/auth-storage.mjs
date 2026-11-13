// Encrypted one-time pending-login handoffs + database-backed rate limiting.
// Requires explicit limited SQL grants and private keys; not deployed/configured.
import {createCipheriv,createDecipheriv,createHmac,randomBytes} from 'node:crypto';
import {assertLimitedRole} from './database.mjs';
function checkKey(key){if(!Buffer.isBuffer(key)||key.length!==32)throw new Error('Invalid storage key')}
function hash(key,purpose,value){return createHmac('sha256',key).update(purpose).update('\0').update(value).digest()}
async function query(pool,sql,args) {const c=await pool.connect();try{await assertLimitedRole(c);return await c.query(sql,args)}finally{await c.release()}}
export function createAuthStorage({pool,encryptionKey,hashKey}={}) {
 checkKey(encryptionKey);checkKey(hashKey);if(!pool||typeof pool.connect!=='function'||encryptionKey.equals(hashKey))throw new Error('Invalid storage configuration');
 return {
  async put(id,value,ttl) {
   if(typeof id!=='string'||!/^[A-Za-z0-9_-]{43}$/.test(id)||!Number.isInteger(ttl)||ttl<1||ttl>300)throw new Error('Invalid login flow');
   const iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',encryptionKey,iv);cipher.setAAD(Buffer.from('biocraft-auth-flow-v1'));
   const plaintext=Buffer.from(JSON.stringify(value));if(plaintext.length>7000)throw new Error('Flow too large');
   const body=Buffer.concat([cipher.update(plaintext),cipher.final()]);
   const sealed=Buffer.concat([iv,cipher.getAuthTag(),body]);
   await query(pool,'select bc_admin_v1.store_login_flow($1::bytea,$2::bytea,$3::integer)',[hash(hashKey,'flow',id),sealed,ttl]);
  },
  async take(id) {
   if(typeof id!=='string'||!/^[A-Za-z0-9_-]{43}$/.test(id))throw new Error('Invalid login flow');
   const result=await query(pool,'select bc_admin_v1.take_login_flow($1::bytea) as data',[hash(hashKey,'flow',id)]);
   const data=result.rows[0]?.data;if(data==null)return null;
   const buf=Buffer.from(data);if(buf.length<29||buf.length>8192)throw new Error('Invalid login flow');
   const decipher=createDecipheriv('aes-256-gcm',encryptionKey,buf.subarray(0,12));decipher.setAAD(Buffer.from('biocraft-auth-flow-v1'));decipher.setAuthTag(buf.subarray(12,28));
   return JSON.parse(Buffer.concat([decipher.update(buf.subarray(28)),decipher.final()]).toString('utf8'));
  },
  async limit({bucket,key,userId,operation}) {
   if(operation==='admin-api') {bucket='admin-api';key=userId;}
   if(!['password-login','totp-verify','admin-api'].includes(bucket)||typeof key!=='string'||key.length<1||key.length>200)throw new Error('Invalid rate key');
   const result=await query(pool,'select bc_admin_v1.consume_rate_limit($1,$2::bytea) as allowed',[bucket,hash(hashKey,`rate:${bucket}`,key)]);
   return result.rows[0]?.allowed===true;
  }
 };
}
