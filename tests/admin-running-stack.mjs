// Smoke the two already-running processes. No page.route, Auth credentials, or
// writes. Set ADMIN_EXPECT_READY=true only when testing an actually ready site.
import assert from 'node:assert/strict';
import {chromium} from 'playwright-core';
const base=process.env.ADMIN_BASE_URL || 'http://127.0.0.1:5173';
const ready=process.env.ADMIN_EXPECT_READY==='true';
const browser=await chromium.launch({executablePath:process.env.BROWSER_EXECUTABLE_PATH,args:['--no-sandbox','--disable-dev-shm-usage']});
try {
 for(const width of [390,820,1440]) {
  const page=await browser.newPage({viewport:{width,height:900}}),errors=[],calls=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('request',r=>{if(new URL(r.url()).pathname.startsWith('/api/'))calls.push([new URL(r.url()).origin,r.method()]);});
  assert.equal((await page.goto(base)).status(),200);
  await page.locator('main h1').first().waitFor();
  assert.equal(await page.locator('.ad-app').count(),0);
  const live=await page.evaluate(async()=>{const r=await fetch('/api/status/live');return {status:r.status,body:await r.json()};});
  assert.equal(live.status,200);assert.equal(live.body.live,true);
  const probe=()=>page.waitForResponse(r=>new URL(r.url()).pathname==='/api/admin/v1/health');
  const [health]=await Promise.all([probe(),page.goto(base+'/admin/login')]);
  assert.equal(health.status(),ready?200:503);assert.match(health.headers()['content-type'],/application\/json/);
  if(ready) await page.getByLabel('Password',{exact:true}).waitFor();
  else {
   await page.getByRole('heading',{name:'Sign-in is not available'}).waitFor();
   assert.equal(await page.locator('input[type=password]').count(),0);
   const [retry]=await Promise.all([probe(),page.getByRole('button',{name:'Check connection again'}).click()]);
   assert.equal(retry.status(),503);await page.getByRole('heading',{name:'Sign-in is not available'}).waitFor();
  }
  await page.waitForLoadState('networkidle',{timeout:6000}); // failed response bodies must settle
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  assert(calls.length>=2 && calls.every(([origin,method])=>origin===new URL(base).origin&&method==='GET'));
  assert.deepEqual(errors,[]);await page.close();
  console.log(`PASS real frontend → API at ${width}px: public page, same-origin live 200, Admin health ${health.status()}, no writes or horizontal overflow`);
 }
} finally {await browser.close();}
