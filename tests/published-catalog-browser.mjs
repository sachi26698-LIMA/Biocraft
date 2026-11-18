// Run against a Preview build configured with a public key, real or fixture.
// The browser intercepts REST; no hosted test data is read or written.
import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
const base=process.env.PUBLIC_BASE_URL??'http://127.0.0.1:4178';
const browser=await chromium.launch({executablePath:process.env.BROWSER_EXECUTABLE_PATH,args:['--no-sandbox','--disable-dev-shm-usage']});
try {
  for(const viewport of [{width:390,height:844},{width:1440,height:900}]) {
    const page=await browser.newPage({viewport});
    const consoleErrors=[];
    page.on('pageerror',error=>consoleErrors.push(error.message));
    for(const [path,table,title] of [['caption-generator','captions','Published captions'],['hashtag-generator','hashtags','Published hashtags'],['fancy-font-generator','fonts','Published font samples']]) {
      const calls=[];
      const uuid=i=>`11111111-1111-4111-8111-${i.toString().padStart(12,'0')}`;
      await page.route(`**/rest/v1/${table}?*`,async route=>{
        const request=route.request();
        calls.push({method:request.method(), params:new URL(request.url()).searchParams});
        if(calls.length===1) return route.fulfill({json:{message:'offline'},status:503});
        const numbers=calls.length===2?Array.from({length:13},(_,i)=>i+1):[13];
        await route.fulfill({json:numbers.map(i=>({id:uuid(i),text:`fixture_${i}`}))});
      });
      await page.goto(`${base}/${path}`);
      const shelf=page.getByRole('region',{name:title,exact:true});
      await shelf.getByRole('button',{name:'Browse published entries'}).click();
      await shelf.getByText('Could not load the published catalogue.',{exact:false}).waitFor();
      await shelf.getByRole('button',{name:'Retry catalogue'}).click();
      await shelf.getByText(/fixture_12/).waitFor();
      assert.equal(await shelf.locator('li').count(),12);
      await shelf.getByRole('button',{name:'Load more'}).click();
      await shelf.getByText(/fixture_13/).waitFor();
      assert.equal(await shelf.locator('li').count(),13);
      assert.equal(calls.length,3);
      assert.ok(calls.every(({method,params})=>method==='GET' && params.get('is_active')==='eq.true' && params.get('limit')==='13'));
      assert.equal(calls[2].params.get('id'),`gt.${uuid(12)}`);
      if(table!=='fonts') assert.equal(calls[1].params.get('language'),'eq.en');
      await page.unroute(`**/rest/v1/${table}?*`);
    }
    assert.deepEqual(consoleErrors,[]);
    await page.close();
  }
  console.log('PASS captions/hashtags/fonts on mobile and desktop: REST filters, error, retry, pagination, and real rendered rows (intercepted REST).');
} finally {await browser.close()}
