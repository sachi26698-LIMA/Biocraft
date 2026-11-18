// Cover the dedicated Admin modules in the shipped bundle with intercepted API.
const assert = require('node:assert/strict');
const {chromium} = require('playwright-core');
const modules = require('../shared/admin-extra-modules.json');
const uid = '11111111-1111-4111-8111-111111111111';
const browserUrl = process.env.ADMIN_BASE_URL || 'http://127.0.0.1:4178';
const text = {
  captions:'Synthetic caption', hashtags:'#synthetic', fonts:'Synthetic font sample', seo:'Synthetic SEO title',
  'content-intelligence':'Content Mix', 'data-sources':'Unicode fixture', notifications:'Review completed',
  roles:'Review administrator', permissions:'content.review', 'db-management':'snapshot-fixture',
  'api-management':'API version: v1', 'vercel-status':'Build revision: abcdef012345', 'supabase-health':'Guest catalogue REST: Connected',
  'ai-configuration':'AI integration not connected', templates:'Template store not connected', imports:'Local validation only',
};
(async()=>{
  const browser=await chromium.launch({executablePath:process.env.BROWSER_EXECUTABLE_PATH,args:['--no-sandbox','--disable-dev-shm-usage']});
  try {
    for(const width of [390,820,1440]) {
      let signedIn=true, denied=false, expiresAt=new Date(Date.now()+3600e3).toISOString();
      const page=await browser.newPage({viewport:{width,height:900}}), errors=[];
      page.on('pageerror',error=>errors.push(error.message));
      await page.route('**/api/admin/v1/**',route=>{
        const path=new URL(route.request().url()).pathname.split('/v1/')[1];
        if(path==='session')return signedIn?route.fulfill({json:{user:{id:uid,roles:['editor'],permissions:['content.read']},expires_at:expiresAt}}):route.fulfill({status:401,json:{error:{code:'UNAUTHENTICATED'}}});
        if(path==='roles'&&denied)return route.fulfill({status:403,json:{error:{code:'FORBIDDEN'}}});
        const items={
          captions:[{id:uid,text:'Synthetic caption'}], hashtags:[{id:uid,text:'#synthetic'}], fonts:[{id:uid,text:'Synthetic font sample'}],
          'seo-pages':[{id:uid,title:'Synthetic SEO title',page_slug:'fixture-seo',is_active:true}],
          'data-sources':[{id:uid,name:'Unicode fixture',license_code:'MIT',status:'never_synced',last_sync_at:null,last_sync_count:null,next_cursor:'fixture'}],
          'sync-jobs':[{id:uid,source_name:'Index fixture',status:'succeeded',items_seen:7,items_inserted:1,items_updated:0,items_skipped:6,finished_at:new Date().toISOString()}],
          collections:[{source_slug:'fixture-source',active_bios:7,archived_bios:1}],
          notifications:[{id:uid,category:'review.decided',message:'Review completed',unread:true,created_at:new Date().toISOString()}],
          roles:[{id:'reviewer',description:'Review administrator',permissions:['content.review']}],
          backups:[{id:uid,provider_reference:'snapshot-fixture',state:'completed',environment:'synthetic_preview',requested_at:new Date().toISOString()}],
          bios:[{id:uid,source_slug:'fixture-source',language:'en',platform_slug:'instagram',character_count:7,is_active:true}],
          publications:[{id:'9007199254740993',bio_id:uid,action:'created',published_at:new Date().toISOString(),payload:{content:'Historic fixture bio'}}],
        }[path];
        if(path==='publications') assert.equal(new URL(route.request().url()).searchParams.get('bio_id'),uid);
        if(items)return route.fulfill({json:{items}});
        if(path==='health')return route.fulfill({json:{ok:true}});
        if(path==='analytics')return route.fulfill({json:{metrics:[{metric:'bios.active',value:7}]}});
        if(path==='system/status')return route.fulfill({json:{database:'ready',auth:'verified',guest_content:'ready',runtime:'preview',revision:'abcdef012345',shared_writes:false,password_reset:false}});
        return route.fulfill({status:404,json:{error:{code:'NOT_FOUND'}}});
      });
      for(const module of modules) {
        await page.goto(`${browserUrl}/admin/${module.key}`);
        await page.getByRole('heading',{name:module.label,exact:true,level:1}).waitFor();
        await page.getByText(text[module.key],{exact:true}).first().waitFor();
        if(module.key==='data-sources') { await page.getByText('Index fixture',{exact:true}).waitFor(); await page.getByText('Never',{exact:true}).waitFor(); }
        assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${module.key} at ${width}px overflowed`);
      }
      if(width===1440) {
        await page.goto(`${browserUrl}/admin/imports`);
        await page.getByLabel('Bio JSON file').setInputFiles({name:'test.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify([{content:'hi',language:'en',platform:'instagram',active:true,featured:false},{content:'bad'}]))});
        await page.getByText('1 valid; 1 invalid. No records were written.',{exact:true}).waitFor();
        await page.goto(`${browserUrl}/admin/bios`);
        await page.getByRole('button',{name:'Details',exact:true}).first().click();
        await page.getByRole('button',{name:'View publication history'}).click();
        await page.getByText('Historic fixture bio',{exact:true}).waitFor();
        denied=true;
        await page.goto(`${browserUrl}/admin/roles`);
        await page.getByText('Not permitted for this account',{exact:true}).first().waitFor();
        denied=false;
        expiresAt=new Date(Date.now()+2000).toISOString();
        await page.goto(`${browserUrl}/admin/roles`);
        await page.getByText('Review administrator',{exact:true}).waitFor();
        signedIn=false;
        await page.getByRole('heading',{name:'Live Admin access required'}).waitFor();
        assert.equal(await page.getByText('Review administrator',{exact:true}).count(),0);
      }
      assert.deepEqual(errors,[]);
      await page.close();
    }
    console.log(`PASS ${modules.length} dedicated routes at mobile/tablet/desktop, import preflight, publication history, permission denial and expiry`);
  }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
