// The server gateway and the public app must agree on platform ids and limits.
// A drift here would let the Admin draft a bio the public UI cannot render.
const assert=require('node:assert/strict');const fs=require('node:fs');
(async()=>{
 const source=fs.readFileSync('src/tools/platforms.ts','utf8');
 const pairs=[...source.matchAll(/id:\s*'([a-z0-9-]+)'[\s\S]*?bioLimit:\s*(\d+)/g)].map(([,id,max])=>[id,Number(max)]);
 assert.ok(pairs.length>=8,`expected at least 8 platforms, found ${pairs.length}`);
 const {PLATFORM_BIO_LIMITS}=await import('../admin-backend/domain/platform-rules.mjs');
 assert.deepEqual(Object.fromEntries(pairs),{...PLATFORM_BIO_LIMITS});
 console.log(`PASS platform rules in sync for ${pairs.length} platforms`);
})().catch(e=>{console.error(e);process.exitCode=1});
