// Local Chromium test of the D2 recovery surface.
// The Admin server is simulated with page.route: no real backend, database or
// Auth account is involved, and only the shipped bundle is exercised. Asserts
// that a password session for an account that lost its factor can ONLY reach the
// recovery form, that the code is never stored, and that recovery issues no
// session or "signed in" state.
const {chromium} = require('playwright-core');
const assert = require('node:assert/strict');

const RECOVERY_CODE = 'abcd-efgh-2345';

(async () => {
  const base = process.env.ADMIN_BASE_URL || 'http://127.0.0.1:4178';
  const browser = await chromium.launch({ executablePath: process.env.BROWSER_EXECUTABLE_PATH, args: ['--no-sandbox', '--disable-dev-shm-usage'], headless: true });
  try {
    for (const [name, width, height] of [['desktop', 1440, 900], ['mobile', 390, 844]]) {
      const page = await browser.newPage({ viewport: { width, height } });
      const errors = [], calls = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.route('**/api/admin/v1/**', async route => {
        const url = new URL(route.request().url());
        const path = url.pathname.replace('/api/admin/v1', '');
        calls.push(`${route.request().method()} ${path}`);
        const json = (status, body) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
        if (path === '/health') return json(200, { ok: true });
        if (path === '/session') return json(401, { error: { code: 'UNAUTHENTICATED' } });
        // The server decided this account must recover, not re-enrol.
        if (path === '/auth/login') return json(200, { mfa_required: false, enrolment: false, recovery: true, csrf: 'C'.repeat(43) });
        if (path === '/auth/recovery/complete') {
          const body = JSON.parse(route.request().postData() || '{}');
          if (body.code !== RECOVERY_CODE) return json(401, { error: { code: 'UNAUTHENTICATED' } });
          return json(200, { ok: true, next: 'contact_operator' });
        }
        return json(503, { error: { code: 'UNAVAILABLE' } });
      });
      await page.goto(`${base}/admin/login`, { waitUntil: 'networkidle' });
      await page.getByRole('heading', { name: 'Admin sign-in' }).waitFor();
      await page.getByLabel('Email').fill('admin@example.com');
      await page.getByLabel('Password').fill('synthetic-password');
      await page.getByRole('button', { name: 'Continue' }).click();

      // 1. The recovery form is the only way forward: no enrolment, no code form.
      await page.getByRole('heading', { name: 'Authenticator recovery' }).waitFor();
      assert.equal(await page.getByRole('heading', { name: 'Set up your authenticator' }).count(), 0, 'recovery must not offer re-enrolment');
      assert.equal(await page.getByLabel('6–8 digit code').count(), 0, 'recovery must not offer TOTP entry');
      await page.getByText('Sign-in stays closed until then.').waitFor();

      // 2. Nothing secret is retained, and nothing is pre-filled.
      assert.equal(await page.getByLabel('Recovery code').inputValue(), '');
      assert.equal(page.url().includes('code'), false);
      assert.deepEqual(await page.evaluate(() => Object.keys(localStorage)), []);
      assert.deepEqual(await page.evaluate(() => Object.keys(sessionStorage)), []);

      // 3. A wrong code is refused and the form stays open.
      await page.getByLabel('Recovery code').fill('zzzz');
      assert.equal(await page.getByRole('button', { name: 'Submit recovery code' }).isEnabled(), false, 'a partially typed code must not be submittable');
      await page.getByLabel('Recovery code').fill('aaaa-bbbb-cccc');
      await page.getByRole('button', { name: 'Submit recovery code' }).click();
      await page.getByRole('alert').waitFor();
      assert.match(await page.getByRole('alert').innerText(), /could not|invalid|not accepted/i);

      // 4. Accessibility of the recovery view, in both themes.
      await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
      for (const theme of ['light', 'dark']) {
        if (theme === 'dark') await page.getByRole('button', { name: 'Switch to dark mode' }).click();
        const audit = await page.evaluate(() => window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] } }));
        assert.deepEqual(audit.violations.map(v => v.id), [], `${name} recovery ${theme} accessibility`);
      }
      await page.getByRole('button', { name: 'Switch to light mode' }).click();

      // 5. No horizontal overflow at either width.
      const overflow = await page.evaluate(() => ({ document: document.documentElement.scrollWidth, viewport: innerWidth }));
      assert.ok(overflow.document <= overflow.viewport, `overflow ${name}`);

      // 6. A correct code records authorisation but never signs the user in.
      await page.getByLabel('Recovery code').fill(RECOVERY_CODE);
      await page.getByRole('button', { name: 'Submit recovery code' }).click();
      await page.getByRole('heading', { name: 'Recovery authorised' }).waitFor();
      assert.equal(await page.getByRole('heading', { name: 'Signed in' }).count(), 0, 'recovery must not sign anyone in');
      await page.getByText('No session was created by this step').waitFor();
      // No Admin cookie may be set by the recovery step (the pending cookie is
      // cleared server-side; the page holds no session of its own).
      const adminCookies = (await page.context().cookies()).filter(cookie => cookie.name.startsWith('__Host-biocraft-admin'));
      assert.deepEqual(adminCookies, [], 'recovery must not set an admin cookie');
      assert.deepEqual(await page.evaluate(() => Object.keys(localStorage)), []);

      assert.deepEqual(errors, []);
      assert.deepEqual(calls, ['GET /health', 'GET /session', 'POST /auth/login', 'POST /auth/recovery/complete', 'POST /auth/recovery/complete']);
      console.log(JSON.stringify({ name, width, height, overflow, calls, signedIn: false }));
      await page.close();
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
