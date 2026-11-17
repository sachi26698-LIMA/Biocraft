/**
 * The Admin console's CSV export, in a real browser.
 *
 * `downloadCsv()` in src/admin/live/useLive.ts serialises rows the user is
 * already authorised to read — no extra permission, no extra server round-trip —
 * and is wired to buttons in Analytics, Content and Library. A download is the one
 * workflow that cannot be checked from the DOM alone: the button can look correct,
 * the click can fire, and still produce nothing. So this listens for the actual
 * download event and inspects the bytes.
 *
 * The Admin API is stubbed with the same `{metrics:[...]}` envelope the real
 * handler returns. What is under test is the client serialisation, not the server.
 */
const {chromium} = require('playwright-core');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const assert = require('node:assert/strict');

const BASE = process.env.ADMIN_BASE_URL || 'http://127.0.0.1:4178';

const session = {
  user: {
    id: '11111111-1111-4111-8111-111111111111',
    roles: ['super_admin'],
    permissions: ['dashboard.read', 'content.read', 'analytic.read', 'audit.read', 'settings.read'],
  },
};

(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.BROWSER_EXECUTABLE_PATH,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  try {
    const ctx = await browser.newContext({ acceptDownloads: true, viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();

    await page.route('**/api/admin/v1/**', async (route) => {
      const p = new URL(route.request().url()).pathname;
      const json = (body) =>
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body) });
      if (p.endsWith('/health')) return json({ ok: true });
      if (p.endsWith('/session')) return json(session);
      if (p.endsWith('/analytics'))
        return json({
          metrics: [
            { metric: 'Total bios', value: '506' },
            { metric: 'Categories', value: '33' },
            { metric: 'Platforms', value: '8' },
          ],
        });
      return json({ items: [] });
    });

    await page.goto(`${BASE}/admin/analytics`, { waitUntil: 'networkidle' });
    await page.getByRole('heading', { name: /analytics/i }).first().waitFor({ timeout: 20000 });

    const button = page.getByRole('button', { name: /Export CSV/i });
    assert.equal(await button.count(), 1, 'the CSV export control should be present');
    assert.equal(await button.isDisabled(), false, 'the export control should be enabled once rows exist');

    const [download] = await Promise.all([page.waitForEvent('download', { timeout: 20000 }), button.click()]);

    assert.equal(download.suggestedFilename(), 'admin-metrics.csv');
    const file = await download.path();
    assert.ok(file, 'the download should produce a file');
    const body = fs.readFileSync(file, 'utf8');

    // A real CSV: a header row, then one row per metric, comma-separated.
    const lines = body.trim().split('\n');
    assert.equal(lines[0], 'metric,value', 'header row');
    assert.equal(lines.length, 4, `expected header + 3 rows, got ${lines.length}`);
    assert.ok(lines.some((l) => l.startsWith('Total bios,')), 'metric rows are serialised');
    assert.ok(body.length > 0, 'the file is not empty');

    // Nothing may be left behind in the DOM after the download.
    assert.equal(await page.locator('a[download]').count(), 0, 'the temporary anchor is removed');

    console.log(
      `PASS CSV export: ${download.suggestedFilename()}, ${body.length} bytes, ${lines.length - 1} rows + header, anchor cleaned up`,
    );
    await ctx.close();
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error('FAILED:', e.message);
  process.exit(1);
});
