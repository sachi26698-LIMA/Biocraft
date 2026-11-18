// Shipped UI with intercepted API responses; no live email, Auth, or DB.
const {chromium} = require('playwright-core');
const assert = require('node:assert/strict');
(async () => {
  const base = process.env.ADMIN_BASE_URL || 'http://127.0.0.1:4178';
  const browser = await chromium.launch({ executablePath: process.env.BROWSER_EXECUTABLE_PATH, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  try {
    for (const width of [390, 1440]) {
      const page = await browser.newPage({viewport: {width, height: 900}});
      const hash = 'x'.repeat(64), csrf = 'c'.repeat(43), calls = [];
      let enabled = false;
      await page.route('**/api/admin/v1/**', route => {
        const req = route.request(), path = new URL(req.url()).pathname.split('/').at(-1);
        assert(!req.url().includes(hash));
        const json = (status, json) => route.fulfill({status,json});
        if (path === 'status') return json(enabled?200:503,{ok:enabled});
        if (path === 'health') return json(200,{ok:true});
        if (path === 'session') return json(401,{});
        assert(req.url().includes('/auth/password-reset/'));
        calls.push(path);
        if (path === 'request') {
          assert.deepEqual(req.postDataJSON(), {email:'synthetic@example.test'});
          return json(202,{ok:true});
        }
        if (path === 'exchange') {
          assert.deepEqual(req.postDataJSON(), {tokenHash:hash});
          return json(200,{mfa_required:true,csrf});
        }
        assert.equal(path,'complete');
        assert.deepEqual(req.postDataJSON(), {code:'123456',csrf,password:'synthetic test password'});
        return json(200,{ok:true});
      });
      await page.goto(`${base}/admin/login/`);
      await page.getByRole('link',{name:'Forgot your password?'}).click();
      await page.getByText('Password reset is not enabled on this deployment.', {exact:false}).waitFor();
      assert.deepEqual(calls,[]);
      enabled=true;
      await page.reload();
      await page.getByLabel('Admin email').fill('synthetic@example.test');
      await page.getByRole('button',{name:'Send recovery link'}).click();
      await page.getByText('If this account can recover by email', {exact:false}).waitFor();
      await page.goto(`${base}/admin/recovery/#token_hash=${hash}`);
      await page.getByRole('button',{name:'Continue recovery'}).waitFor();
      assert.equal(new URL(page.url()).hash,'');
      assert.deepEqual(calls,['request']);
      await page.getByRole('button',{name:'Continue recovery'}).click();
      await page.getByLabel('Authenticator code').fill('123456');
      await page.getByLabel('New password').fill('synthetic test password');
      await page.getByRole('button',{name:'Change password'}).click();
      await page.getByText('Password changed and Admin sessions revoked.', {exact:false}).waitFor();
      assert.deepEqual(calls,['request','exchange','complete']);
      assert.deepEqual(await page.evaluate(()=>[localStorage.length,sessionStorage.length]),[0,0]);
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
      await page.close();
    }
    console.log('PASS password-reset UI: disabled by default, fragment stripped before explicit submission, TOTP completion at mobile and desktop widths');
  } finally { await browser.close(); }
})().catch(error => {console.error(error);process.exitCode=1});
