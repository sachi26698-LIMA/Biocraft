// Phase 1 acceptance: every Admin route must load with no blank screen and no
// JavaScript error, on a hard navigation AND on a refresh.
//
// "Loads" is defined strictly, because a blank page is exactly what the previous
// build shipped: the shell existed but referenced a chunk that was never built.
// So each route must satisfy all of:
//   - HTTP 200
//   - the title is the Admin title, not the public site's
//   - React actually mounted children into #root (not merely an empty div)
//   - rendered text is non-trivial (a blank page fails this)
//   - the Admin chrome is present (.ad-app), proving the admin entry ran and not
//     the public entry
//   - no pageerror and no failed request (a 404 on the admin chunk fails here)
// Then the same URL is reloaded to prove a cold load works.
import assert from 'node:assert/strict';
import {chromium} from 'playwright-core';
import {readFileSync} from 'node:fs';

const BASE = process.env.ADMIN_BASE_URL || 'http://127.0.0.1:4190';
const ROUTES = [
  '/admin', '/admin/login', '/admin/users', '/admin/bios', '/admin/categories',
  '/admin/collections', '/admin/platforms', '/admin/generators', '/admin/content',
  '/admin/analytics', '/admin/audit-logs', '/admin/security', '/admin/settings',
  '/admin/backup', '/admin/recovery',
  ...JSON.parse(readFileSync(new URL('../shared/admin-extra-modules.json', import.meta.url),'utf8')).map(({key})=>`/admin/${key}`),
];

const browser = await chromium.launch({
  executablePath: process.env.BROWSER_EXECUTABLE_PATH,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
  headless: true,
});
const context = await browser.newContext({viewport: {width: 1440, height: 900}});
const page = await context.newPage();

let errors = [];
page.on('pageerror', e => errors.push(`pageerror: ${e.message}`));
page.on('requestfailed', r => {
  const pathname = new URL(r.url()).pathname;
  // /api/admin/v1/* is served by a serverless function that does not exist in a
  // static file preview, so its failure here is an artifact of the harness, not
  // of the route under test. Asset and document failures are still fatal.
  if (pathname.startsWith('/api/')) return;
  errors.push(`requestfailed: ${pathname}`);
});
page.on('response', r => {
  const url = new URL(r.url());
  // The API probe legitimately 404s with no serverless function in a static
  // preview, and /admin/session is expected to be unauthorised. Asset 404s are
  // NOT tolerated: that is the blank-page failure mode.
  if (r.status() >= 400 && /\/assets\/|\/admin\//.test(url.pathname) && !url.pathname.startsWith('/api/')) {
    errors.push(`http ${r.status()}: ${url.pathname}`);
  }
});

const failures = [];
for (const route of ROUTES) {
  for (const pass of ['navigate', 'reload']) {
    errors = [];
    let result;
    try {
      result = pass === 'navigate'
        ? await page.goto(BASE + route, {waitUntil: 'networkidle', timeout: 30000})
        : (await page.reload({waitUntil: 'networkidle', timeout: 30000}));
      const info = await page.evaluate(() => ({
        title: document.title,
        mounted: !!document.querySelector('#root')?.children.length,
        text: (document.body.innerText || '').replace(/\s+/g, ' ').trim(),
        adminChrome: !!document.querySelector('.ad-app'),
      }));
      assert.equal(result.status(), 200, 'HTTP status');
      assert.match(info.title, /Admin/i, `title was "${info.title}"`);
      assert.ok(info.mounted, 'React did not mount');
      assert.ok(info.text.length > 40, `rendered text too short (${info.text.length} chars) — looks blank`);
      assert.ok(info.adminChrome, 'admin chrome (.ad-app) missing — wrong entry ran');
      assert.equal(errors.length, 0, errors.join('; '));
    } catch (error) {
      failures.push(`${route} [${pass}]: ${error.message.split('\n')[0]}`);
      continue;
    }
    console.log(`ok  ${route} [${pass}]  "${result && (await page.title())}"`);
  }
}

await browser.close();
assert.equal(failures.length, 0, `\n${failures.join('\n')}`);
console.log(`PASS ${ROUTES.length} Admin routes: 200 + mounted + admin chrome + no errors, on navigation and reload`);
