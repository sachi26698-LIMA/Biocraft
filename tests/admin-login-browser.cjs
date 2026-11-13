// Local Chromium test of the /admin/login surface. This is emulated viewport
// testing of a local static build, not a hosted or physical-device test, and it
// asserts the login form fails closed while no Admin backend is deployed.
const {chromium}=require('playwright-core');const assert=require('node:assert/strict');
(async()=>{const base=process.env.ADMIN_BASE_URL||'http://127.0.0.1:4178';const browser=await chromium.launch({executablePath:process.env.BROWSER_EXECUTABLE_PATH,args:['--no-sandbox','--disable-dev-shm-usage'],headless:true});
for(const [name,width,height] of [['desktop',1440,900],['tablet',820,1100],['mobile',390,844]]){
 const page=await browser.newPage({viewport:{width,height}});const errors=[],requests=[],posted=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('request',r=>{const u=r.url();if(/supabase/.test(u))requests.push(u);if(r.method()!=='GET'&&/\/api\/admin/.test(u))posted.push(u)});
 const response=await page.goto(`${base}/admin/login`,{waitUntil:'networkidle'});assert.equal(response.status(),200);
 assert.equal(await page.locator('meta[name=robots]').getAttribute('content'),'noindex, nofollow');
 await page.getByRole('heading',{name:'Sign in',exact:true}).waitFor();
 // Without a deployed Admin backend the form must refuse to accept credentials.
 await page.getByRole('heading',{name:'Sign-in is not available'}).waitFor();
 assert.equal(await page.locator('#admin-email').count(),0);
 assert.equal(await page.locator('#admin-password').count(),0);
 const overflow=await page.evaluate(()=>({document:document.documentElement.scrollWidth,viewport:innerWidth}));assert.ok(overflow.document<=overflow.viewport,`overflow ${name}`);
 await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
 const audit=await page.evaluate(()=>window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']}}));
 assert.deepEqual(audit.violations.map(v=>v.id),[],`${name} accessibility`);
 assert.deepEqual(errors,[]);assert.deepEqual(requests,[]);assert.deepEqual(posted,[]);
 // Theme toggle and navigation still work on this route, and the page never
 // advertises a credential form.
 assert.equal(await page.locator('form').count(),0);
 await page.getByRole('button',{name:'Switch to dark mode'}).click();assert.equal(await page.locator('.ad-dark').count(),1);
 await page.getByRole('button',{name:'Switch to light mode'}).click();
 // On narrow viewports the sidebar is collapsed, so the in-page route link is
 // asserted instead of a sidebar entry.
 if(width>=700) await page.locator('.ad-sidebar').getByRole('link',{name:'Admin sign-in'}).waitFor();
 else await page.locator('.ad-main h1').waitFor();
 console.log(JSON.stringify({name,width,height,overflow,failClosed:true}));await page.close();
}
// The sign-in surface must never be published to the public app.
const publicPage=await browser.newPage();await publicPage.goto(`${base}/`,{waitUntil:'networkidle'});
assert.equal(await publicPage.locator('.ad-auth').count(),0);await publicPage.close();await browser.close();})().catch(e=>{console.error(e);process.exit(1)});
