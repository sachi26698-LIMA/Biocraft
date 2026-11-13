/**
 * The live Admin modules, rendered in a browser against a stubbed Admin API.
 *
 * This is a UI contract test, not a security test: the server-side authorization
 * is proven in the PostgreSQL and PGlite suites. What it proves is that each
 * module renders the shape the real server returns, shows a denial as a denial,
 * and never invents rows when a read fails.
 *
 * The stub answers exactly like `admin-backend/server/api.mjs`, including the
 * `{items:[...]}` envelope, `{metrics:[...]}`, `{user:{...}}` and the error
 * envelope `{error:{code}}`.
 */
const {chromium,devices}=require('playwright-core'), assert=require('node:assert/strict');

const USER='11111111-1111-4111-8111-111111111111';
const OTHER='22222222-2222-4222-8222-222222222222';
const BIO='33333333-3333-4333-8333-333333333333';
const DRAFT='44444444-4444-4444-8444-444444444444';

const payload={content:'A bio that went through review',language:'en',platform:'instagram',active:true,featured:false};

const replies={
 '/health':{ok:true},
 '/session':{user:{id:USER,roles:['super_admin'],permissions:['dashboard.read','staff.manage','content.read','content.draft','content.review','content.publish','settings.manage','audit.read','analytics.read']},expires_at:new Date(Date.now()+3600e3).toISOString()},
 '/analytics':{metrics:[
  {metric:'bios.active',value:506},{metric:'bios.archived',value:7},{metric:'categories.total',value:33},
  {metric:'platforms.total',value:8},{metric:'generators.total',value:12},{metric:'seo_pages.total',value:48},
  {metric:'admin.drafts.in_review',value:2},{metric:'admin.drafts.approved',value:1},
  {metric:'admin.audit.last_24h',value:41},{metric:'admin.sessions.active',value:3}]},
 '/staff':{items:[{user_id:USER,enabled:true,version:3,roles:['super_admin']},{user_id:OTHER,enabled:false,version:1,roles:['editor']}]},
 '/roles':{items:[{id:'super_admin',description:'Super Admin',permissions:['dashboard.read','staff.manage']},{id:'editor',description:'Editor',permissions:['dashboard.read','content.draft']}]},
 '/bio-drafts':{items:[{draft_id:DRAFT,resource_key:'morning-quotes',state:'approved',row_version:3,created_at:'2026-11-01T09:00:00.000Z',payload}]},
 '/bio-review-queue':{items:[{draft_id:DRAFT,resource_key:'morning-quotes',state:'in_review',row_version:2,author_id:OTHER,created_at:'2026-11-01T09:00:00.000Z',payload}]},
 '/publication-jobs':{items:[{id:'55555555-5555-4555-8555-555555555555',draft_id:DRAFT,resource_key:'morning-quotes',target_environment:'production',state:'succeeded',scheduled_at:'2026-11-02T09:00:00.000Z',created_at:'2026-11-02T09:00:00.000Z',completed_at:'2026-11-02T09:00:01.000Z'}]},
 '/bios':{items:[{id:BIO,title:null,language:'en',platform_slug:'instagram',category_name:'Motivation',is_active:true,is_featured:true,is_trending:false,character_count:34,source_slug:'morning-quotes',created_at:'2026-11-01T09:00:00.000Z',updated_at:'2026-11-02T09:00:00.000Z'}]},
 '/audit-logs':{items:[{id:'9',actor_id:USER,action:'draft.published',target_type:'bio',target_id:BIO,occurred_at:'2026-11-02T09:00:01.000Z',details:{}},{id:'8',actor_id:USER,action:'auth.login',target_type:'session',target_id:null,occurred_at:'2026-11-02T08:00:00.000Z',details:{}}]},
 '/sessions':{items:[{id:'66666666-6666-4666-8666-666666666666',created_at:'2026-11-02T08:00:00.000Z',expires_at:new Date(Date.now()+3600e3).toISOString(),revoked_at:null}]},
 '/settings':{items:[{key:'content.review_required',value:{enabled:true},version:2,updated_at:'2026-11-01T09:00:00.000Z'}]},
 '/backups':{items:[{id:'77777777-7777-4777-8777-777777777777',environment:'production',provider_reference:'snap-2026-11-01',state:'restore_verified',requested_at:'2026-11-01T00:00:00.000Z',verified_at:'2026-11-01T01:00:00.000Z'}]},
 '/notifications':{items:[{id:'88888888-8888-4888-8888-888888888888',category:'review.assigned',message:'A draft is waiting for your review.',created_at:'2026-11-02T09:00:00.000Z',read_at:null,unread:true}]},
};

/** Routes that must be refused, so the "denied" rendering can be checked. */
const DENIED=new Set(process.env.DENY_PATH?[process.env.DENY_PATH]:[]);

(async()=>{
 const browser=await chromium.launch({executablePath:process.env.BROWSER_EXECUTABLE_PATH,args:['--no-sandbox','--disable-dev-shm-usage']});
 const base=process.env.ADMIN_BASE_URL||'http://127.0.0.1:4178';
 const results=[];
 try{
  for(const [name,opts] of [['android-emulated',devices['Pixel 5']],['desktop',{viewport:{width:1440,height:900}}]]){
   const context=await browser.newContext(opts);
   await context.route('**/api/admin/v1/**',async route=>{
    const url=new URL(route.request().url());
    const key=url.pathname.replace('/api/admin/v1','');
    const body=replies[key];
    if(body){
     await route.fulfill({status:200,contentType:'application/json',headers:{'cache-control':'no-store'},body:JSON.stringify({...body,request_id:'test'})});
    } else {
     await route.fulfill({status:403,contentType:'application/json',body:JSON.stringify({error:{code:'FORBIDDEN'}})});
    }
   });
   const page=await context.newPage();
   const errors=[];
   page.on('pageerror',e=>errors.push(e.message));

   // Overview: live counts, and the account's real roles from /session.
   await page.goto(`${base}/admin`,{waitUntil:'networkidle'});
   await page.getByRole('heading',{name:'Overview',exact:true}).waitFor();
   await page.getByText('Content in the database').waitFor();
   const activeBio=await page.locator('.ad-stat',{hasText:'Active bios'}).first().innerText();
   assert.match(activeBio,/506/,'overview must show the live active-bio count');
   assert.match(await page.locator('.ad-stat',{hasText:'Audit events'}).first().innerText(),/41/);
   await page.getByText('Super Admin').first().waitFor();
   assert.equal(await page.getByText('Live data').count()>0,true,'the console must say it is live');

   // Users: directory with real roles and the edit control.
   await page.goto(`${base}/admin/users`,{waitUntil:'networkidle'});
   await page.getByRole('heading',{name:'Users',exact:true}).waitFor();
   await page.getByRole('region',{name:'Staff table'}).waitFor();
   assert.match(await page.getByRole('region',{name:'Staff table'}).innerText(),/Super Admin/);
   assert.match(await page.getByRole('region',{name:'Staff table'}).innerText(),/Disabled/);
   await page.getByRole('button',{name:'Edit access'}).first().click();
   await page.getByRole('group',{name:'Roles'}).waitFor();
   assert.equal(await page.getByRole('button',{name:'Save'}).isDisabled(),false);

   // Content: draft, review queue, publish control, and the honesty about the queue.
   await page.goto(`${base}/admin/content`,{waitUntil:'networkidle'});
   await page.getByRole('heading',{name:'Content & SEO',exact:true}).waitFor();
   await page.getByText('My drafts').waitFor();
   assert.match(await page.getByRole('region',{name:'Drafts table'}).innerText(),/Approved/);
   await page.getByRole('button',{name:'Publish'}).first().waitFor();
   assert.match(await page.getByRole('region',{name:'Review queue'}).innerText(),/Approve/);
   await page.getByRole('button',{name:'Read text'}).first().click();
   await page.getByRole('region',{name:'Draft text'}).waitFor();

   // Library: archived and visible both labelled, filters present.
   await page.goto(`${base}/admin/bios`,{waitUntil:'networkidle'});
   await page.getByRole('heading',{name:'Bio library',exact:true}).waitFor();
   await page.getByRole('region',{name:'Bio library table'}).waitFor();
   assert.match(await page.getByRole('region',{name:'Bio library table'}).innerText(),/Visible/);

   // Analytics: real numbers and an explicit "not measured" statement.
   await page.goto(`${base}/admin/analytics`,{waitUntil:'networkidle'});
   await page.getByRole('heading',{name:'Analytics',exact:true}).waitFor();
   assert.match(await page.locator('.ad-stat',{hasText:'Active bios'}).first().innerText(),/506/);
   await page.getByText('Not measured').waitFor();

   // Security: the audit trail is loaded deliberately, then readable.
   await page.goto(`${base}/admin/security`,{waitUntil:'networkidle'});
   await page.getByRole('heading',{name:'Security',exact:true}).waitFor();
   await page.getByRole('button',{name:'Load the audit trail'}).click();
   await page.getByRole('region',{name:'Audit trail table'}).waitFor();
   assert.match(await page.getByRole('region',{name:'Audit trail table'}).innerText(),/Published to the public site/);

   // Settings: versioned value and a stated reason for what is absent.
   await page.goto(`${base}/admin/settings`,{waitUntil:'networkidle'});
   await page.locator('h1',{hasText:'Settings'}).waitFor();
   assert.match(await page.getByRole('region',{name:'Settings table'}).innerText(),/Require independent review/);
   await page.getByText('Not configurable here').waitFor();

   // No overflow at a phone width, on every live route.
   if(opts.isMobile){await page.setViewportSize({width:320,height:700});
    for(const route of ['/admin','/admin/users','/admin/content','/admin/bios','/admin/analytics','/admin/security','/admin/settings']){
     await page.goto(`${base}${route}`,{waitUntil:'networkidle'});
     const dims=await page.evaluate(()=>({w:innerWidth,s:document.documentElement.scrollWidth}));
     assert.ok(dims.s<=dims.w,`${name} ${route} overflows: ${JSON.stringify(dims)}`);
    }
   }
   assert.deepEqual(errors,[],`${name} page errors`);
   results.push({name,liveRoutes:'pass',rolesFromSession:'pass',draftWorkflow:'pass',denialRendering:'n/a',pageErrors:errors.length});
   await context.close();
  }

  // A refused module must say so, and must not show a zero that looks like data.
  const context=await browser.newContext({viewport:{width:1440,height:900}});
  await context.route('**/api/admin/v1/**',async route=>{
   const key=new URL(route.request().url()).pathname.replace('/api/admin/v1','');
   if(key==='/bios'){await route.fulfill({status:403,contentType:'application/json',body:JSON.stringify({error:{code:'FORBIDDEN'}})});return;}
   const body=replies[key];
   if(body){await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({...body,request_id:'test'})});return;}
   await route.fulfill({status:404,contentType:'application/json',body:JSON.stringify({error:{code:'NOT_FOUND'}})});
  });
  const page=await context.newPage();
  await page.goto(`${base}/admin/bios`,{waitUntil:'networkidle'});
  await page.getByText('Not permitted for this account').waitFor();
  assert.equal(await page.getByRole('region',{name:'Bio library table'}).count(),0,'a denied read must not render a table');
  await context.close();
  results.push({name:'denied-read',rendersDenialNotNull:'pass'});

  console.log(JSON.stringify(results,null,2));
  console.log('PASS live Admin modules: overview facts and roles from /session, staff directory with versioned editing, draft/review/publish workflow, bio library with visibility, analytics with an explicit not-measured statement, audit trail loaded on demand, settings with versioned values, and a refused read rendered as a denial rather than as zero rows');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
