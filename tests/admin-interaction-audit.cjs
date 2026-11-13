const {chromium,devices}=require('playwright-core'), assert=require('node:assert/strict');
(async()=>{let browser=await chromium.launch({executablePath:process.env.BROWSER_EXECUTABLE_PATH,args:['--no-sandbox','--disable-dev-shm-usage']});const base=process.env.ADMIN_BASE_URL||'http://127.0.0.1:4178';let output=[];
const nav=[['Overview','/admin','Good to see you.'],['Users','/admin/users','Users'],['Bio library','/admin/bios','Bio library'],['Categories & collections','/admin/categories','Categories & collections'],['Platforms','/admin/platforms','Platforms'],['Generators','/admin/generators','Generators'],['Content & SEO','/admin/content','Content & SEO'],['Analytics','/admin/analytics','Analytics'],['Security','/admin/security','Security'],['Settings','/admin/settings','Settings']];
try{for(const [label,opts] of [['android-emulated',devices['Pixel 5']],['tablet',{viewport:{width:820,height:1100}}],['desktop',{viewport:{width:1440,height:900}}]]) {const context=await browser.newContext(opts),p=await context.newPage();const errors=[],failures=[],badResponses=[],requests=[];
p.on('pageerror',e=>errors.push(e.message));p.on('console',msg=>{if(msg.type()==='error')errors.push(msg.text())});p.on('requestfailed',req=>failures.push({url:req.url(),failure:req.failure()?.errorText}));p.on('response',r=>{if(r.status()>=400)badResponses.push({url:r.url(),status:r.status()})});p.on('request',r=>{if(/supabase|\/api\/admin/.test(r.url()))requests.push(r.url())});
await p.goto(`${base}/admin`,{waitUntil:'networkidle'});
for(const [name,url,heading] of nav){if(opts.isMobile)await p.getByRole('button',{name:'Open navigation'}).click();let link=p.locator('.ad-sidebar').getByRole('link',{name,exact:true});await link.click();await p.getByRole('heading',{name:heading,exact:true}).waitFor();assert.equal(new URL(p.url()).pathname,url);assert.equal(await p.locator(`.ad-sidebar .ad-nav-link[href="${url}"]`).first().getAttribute('aria-current'),'page');}
if(opts.isMobile){
 await p.getByRole('button',{name:'Open navigation'}).click();assert.equal(await p.locator('.ad-brand').evaluate(e=>e===document.activeElement),true);
 await p.keyboard.press('Shift+Tab');assert.equal(await p.locator('.ad-back').evaluate(e=>e===document.activeElement),true);
 await p.keyboard.press('Tab');assert.equal(await p.locator('.ad-brand').evaluate(e=>e===document.activeElement),true);
 await p.keyboard.press('Escape');assert.equal(await p.getByRole('button',{name:'Open navigation'}).getAttribute('aria-expanded'),'false');assert.equal(await p.evaluate(()=>document.activeElement?.getAttribute('aria-label')),'Open navigation');
 await p.getByRole('button',{name:'Open navigation'}).click();await p.setViewportSize({width:820,height:1100});assert.equal(await p.getByRole('button',{name:'Close navigation'}).count(),0);await p.setViewportSize(opts.viewport);
}
await p.goto(`${base}/admin/bios`,{waitUntil:'networkidle'});await p.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));await p.waitForTimeout(100);const sticky=await p.locator('.ad-topbar').boundingBox();assert.ok(Math.abs(sticky.y)<1,`${label} header not sticky: ${sticky.y}`);await p.evaluate(()=>window.scrollTo(0,0));
for(const lang of ['en','hi','hg']){await p.getByRole('combobox',{name:'Filter by language'}).selectOption(lang);let text=await p.locator('tbody tr').allTextContents();assert.ok(text.length>0&&text.every(s=>s.includes(({en:'English',hi:'Hindi',hg:'Hinglish'})[lang])));}
await p.getByRole('combobox',{name:'Filter by language'}).selectOption('all');await p.getByRole('button',{name:'Next',exact:true}).click();await p.getByRole('button',{name:'Previous',exact:true}).click();assert.match(await p.locator('.ad-pagination').innerText(),/Page 1/);
await p.goto(`${base}/admin/unknown`,{waitUntil:'networkidle'});assert.equal(await p.locator('meta[name=robots]').getAttribute('content'),'noindex, nofollow');await p.getByRole('heading',{name:'Page not found'}).waitFor();await p.getByRole('link',{name:'Back to overview'}).click();assert.equal(new URL(p.url()).pathname,'/admin');
let toolLinks=0;
if(label==='desktop'){
 await p.getByRole('link',{name:'Explore library'}).click();assert.equal(new URL(p.url()).pathname,'/admin/bios');
 await p.goto(`${base}/admin`,{waitUntil:'networkidle'});await p.getByRole('link',{name:'View all'}).click();assert.equal(new URL(p.url()).pathname,'/admin/platforms');
 await p.goto(`${base}/admin`,{waitUntil:'networkidle'});await p.getByRole('link',{name:'View security'}).click();assert.equal(new URL(p.url()).pathname,'/admin/security');
 await p.locator('.ad-brand').click();assert.equal(new URL(p.url()).pathname,'/admin');
 await p.locator('.ad-back').click();await p.waitForLoadState('networkidle');assert.equal(new URL(p.url()).pathname,'/');assert.equal(await p.locator('.ad-app').count(),0);
 await p.goto(`${base}/admin/generators`,{waitUntil:'networkidle'});let hrefs=await p.locator('tbody tr a').evaluateAll(as=>as.map(a=>a.getAttribute('href')));
 for(const href of hrefs){await p.goto(`${base}/admin/generators`,{waitUntil:'networkidle'});await p.locator(`tbody a[href="${href}"]`).click();await p.waitForLoadState('networkidle');assert.equal(new URL(p.url()).pathname,href);assert.equal(await p.locator('.ad-app').count(),0);toolLinks++;}
}
assert.deepEqual(errors,[]);assert.deepEqual(failures,[]);assert.deepEqual(badResponses,[]);assert.deepEqual(requests,[]);output.push({label,sidebarLinks:nav.length,toolLinks,stickyTop:sticky.y,pageErrors:errors.length,failedRequests:failures.length,httpErrors:badResponses.length,privilegedOrSupabaseRequests:requests.length});await context.close();}console.log(JSON.stringify(output,null,2));}finally{await browser.close()}})().catch(e=>{console.error(e);process.exit(1)});
