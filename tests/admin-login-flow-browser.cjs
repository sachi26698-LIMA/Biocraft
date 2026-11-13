// Local Chromium test of the sign-in, first-factor enrolment and TOTP surfaces.
// The Admin server is simulated with page.route so no real backend, database or
// Auth account is involved; only the shipped bundle is exercised.
const {chromium}=require('playwright-core');const assert=require('node:assert/strict');
const SECRET='JBSWY3DPEHPK3PXP';
(async()=>{
 const base=process.env.ADMIN_BASE_URL||'http://127.0.0.1:4178';
 const browser=await chromium.launch({executablePath:process.env.BROWSER_EXECUTABLE_PATH,args:['--no-sandbox','--disable-dev-shm-usage'],headless:true});
 for(const [name,width,height] of [['desktop',1440,900],['mobile',390,844]]){
  const page=await browser.newPage({viewport:{width,height}});
  const errors=[],calls=[];
  page.on('pageerror',e=>errors.push(e.message));
  // Mock server: only the documented envelope shapes, no tokens anywhere.
  await page.route('**/api/admin/v1/**',async route=>{
   const url=new URL(route.request().url());const path=url.pathname.replace('/api/admin/v1','');
   calls.push(`${route.request().method()} ${path}`);
   const json=(status,body)=>route.fulfill({status,contentType:'application/json',body:JSON.stringify(body)});
   if(path==='/health')return json(200,{ok:true});
   if(path==='/session')return json(401,{error:{code:'UNAUTHENTICATED'}});
   if(path==='/auth/login')return json(200,{mfa_required:false,enrolment:true,csrf:'C'.repeat(43)});
   if(path==='/auth/enroll')return json(200,{enrolment:true,mfa_required:false,csrf:'D'.repeat(43),otpauth_uri:`otpauth://totp/BioCraft:admin?secret=${SECRET}&issuer=BioCraft`});
   if(path==='/auth/enroll-confirm')return json(200,{ok:true,csrf:'E'.repeat(43)});
   return json(503,{error:{code:'UNAVAILABLE'}});
  });
  await page.goto(`${base}/admin/login`,{waitUntil:'networkidle'});
  await page.getByRole('heading',{name:'Admin sign-in'}).waitFor();
  await page.getByLabel('Email').fill('admin@example.com');
  await page.getByLabel('Password').fill('synthetic-password');
  await page.getByRole('button',{name:'Continue'}).click();
  // Stage 2: one-time setup key, no secret in the URL or storage.
  await page.getByRole('heading',{name:'Set up your authenticator'}).waitFor();
  await page.getByText(SECRET,{exact:true}).waitFor();
  assert.equal(page.url().includes('secret'),false);
  assert.deepEqual(await page.evaluate(()=>Object.keys(localStorage)),[]);
  assert.deepEqual(await page.evaluate(()=>Object.keys(sessionStorage)),[]);
  const overflow=await page.evaluate(()=>({document:document.documentElement.scrollWidth,viewport:innerWidth}));
  assert.ok(overflow.document<=overflow.viewport,`overflow ${name}`);
  await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
  for(const theme of ['light','dark']){
   if(theme==='dark')await page.getByRole('button',{name:'Switch to dark mode'}).click();
   const audit=await page.evaluate(()=>window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']}}));
   assert.deepEqual(audit.violations.map(v=>v.id),[],`${name} enrol ${theme} accessibility`);
  }
  await page.getByRole('button',{name:'Switch to light mode'}).click();
  await page.getByLabel('6–8 digit code').fill('123456');
  await page.getByRole('button',{name:'Confirm and sign in'}).click();
  await page.getByRole('heading',{name:'Signed in'}).waitFor();
  assert.equal(await page.getByText(SECRET).count(),0);
  assert.deepEqual(errors,[]);
  assert.deepEqual(calls,['GET /health','GET /session','POST /auth/login','POST /auth/enroll','POST /auth/enroll-confirm']);
  console.log(JSON.stringify({name,width,height,overflow,calls}));
  await page.close();
 }
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
