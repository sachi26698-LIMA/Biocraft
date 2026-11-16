const { chromium } = require('playwright-core');
const path = require('node:path');
const fs = require('node:fs');
const assert = require('node:assert/strict');

const ALL_PREVIEW_PARTS = [
  'bios',
  'categories',
  'collections',
  'platforms',
  'generators',
  'content',
  'users',
  'analytics',
  'audit-logs',
  'security',
  'settings',
  'backup',
];

async function assertStrictLightTheme(page, label) {
  assert.equal(await page.locator('.ad-dark').count(), 0, `${label}: .ad-dark must never exist`);
  assert.equal(
    await page.getByRole('button', { name: /dark mode/i }).count(),
    0,
    `${label}: dark mode toggle must not exist`,
  );
  const bg = await page.evaluate(() => {
    const style = getComputedStyle(document.body);
    const m = style.backgroundColor.match(/\d+/g);
    if (!m) return { r: 255, g: 255, b: 255 };
    return { r: Number(m[0]), g: Number(m[1]), b: Number(m[2]) };
  });
  const luminance = (bg.r + bg.g + bg.b) / 3;
  assert.ok(luminance >= 220, `${label}: body background must stay bright light theme, got ${JSON.stringify(bg)}`);
}

(async () => {
  const base = process.env.ADMIN_BASE_URL || 'http://127.0.0.1:4178';
  const executablePath = process.env.BROWSER_EXECUTABLE_PATH;
  const browser = await chromium.launch({
    executablePath,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
    headless: true,
  });
  const results = [];

  for (const [name, width, height] of [
    ['desktop', 1440, 900],
    ['tablet', 820, 1100],
    ['mobile', 390, 844],
  ]) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
    const errors = [];
    const requests = [];
    let navigations = 0;

    page.on('pageerror', e => errors.push(e.message));
    page.on('request', r => {
      if (/supabase|\/api\/admin/.test(r.url())) requests.push(r.url());
    });

    navigations++;
    await page.goto(`${base}/admin`, { waitUntil: 'networkidle' });
    await page.getByRole('heading', { name: /Good (morning|afternoon|evening), Admin/i }).waitFor();
    await assertStrictLightTheme(page, `${name} overview`);

    if (process.env.CAPTURE_DIR) {
      fs.mkdirSync(process.env.CAPTURE_DIR, { recursive: true });
      await page.screenshot({ path: path.join(process.env.CAPTURE_DIR, `${name}.png`), fullPage: true });
    }

    assert.equal(await page.locator('header .ad-preview-pill').count(), 1);
    assert.equal(await page.locator('header .ad-breadcrumb').count(), 1);

    await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
    const overviewAudit = await page.evaluate(() =>
      window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] } }),
    );
    assert.deepEqual(
      overviewAudit.violations.map(v => `${v.id}: ${v.nodes.map(n => n.html).join(' | ')}`),
      [],
      `${name} overview light accessibility`,
    );

    const overflow = await page.evaluate(() => ({
      document: document.documentElement.scrollWidth,
      viewport: innerWidth,
    }));
    assert.ok(overflow.document <= overflow.viewport, `overflow ${name} ${JSON.stringify(overflow)}`);

    if (width <= 900) {
      await page.getByRole('button', { name: 'Open navigation' }).click();
      assert.equal(await page.getByRole('button', { name: 'Close navigation' }).count(), 1);
      await page.locator('.ad-sidebar').getByRole('link', { name: 'Bios Library' }).click();
    } else {
      await page.locator('.ad-sidebar').getByRole('link', { name: 'Bios Library' }).click();
    }

    await page.getByRole('heading', { name: 'Bio library' }).waitFor();
    await page.getByRole('searchbox', { name: 'Search bios or collections' }).fill('gamer');
    const matching = await page.locator('tbody tr').count();
    assert.ok(matching > 0);
    await page.getByRole('searchbox', { name: 'Search bios or collections' }).fill('no-bio-should-ever-match-0000');
    assert.match(await page.locator('main').innerText(), /No bios match/);
    await page.getByRole('searchbox', { name: 'Search bios or collections' }).fill('');
    await page.getByRole('combobox', { name: 'Filter by language' }).selectOption('hi');
    const langs = await page.locator('tbody tr').allTextContents();
    assert.ok(langs.length > 0 && langs.every(x => x.includes('Hindi')));
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    assert.match(await page.locator('.ad-pagination').innerText(), /Page 2/);

    for (const part of ALL_PREVIEW_PARTS) {
      navigations++;
      const response = await page.goto(`${base}/admin/${part}`, { waitUntil: 'networkidle' });
      assert.equal(response.status(), 200);
      assert.equal(await page.locator('meta[name=robots]').getAttribute('content'), 'noindex, nofollow');
      assert.equal(await page.locator('.ad-app').count(), 1);
      assert.equal(await page.locator('.ad-main h1').count(), 1);
      await assertStrictLightTheme(page, `${name} ${part}`);
      const dims = await page.evaluate(() => ({
        document: document.documentElement.scrollWidth,
        viewport: innerWidth,
      }));
      assert.ok(dims.document <= dims.viewport, `${name} /admin/${part} overflow ${JSON.stringify(dims)}`);

      await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
      const audit = await page.evaluate(() =>
        window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] } }),
      );
      assert.deepEqual(
        audit.violations.map(v => `${v.id}: ${v.nodes.map(n => n.target.join(' ')).join(', ')}`),
        [],
        `${name} ${part} light accessibility`,
      );
    }

    navigations++;
    await page.goto(`${base}/admin/platforms`, { waitUntil: 'networkidle' });
    await page.getByRole('searchbox', { name: 'Search platforms' }).fill('linkedin');
    assert.equal(await page.locator('.ad-platform-card').count(), 1);
    assert.match(await page.locator('.ad-platform-card').innerText(), /2,600/);

    navigations++;
    await page.goto(`${base}/admin/categories`, { waitUntil: 'networkidle' });
    await page.getByRole('searchbox', { name: 'Search collections' }).fill('gamer');
    assert.equal(await page.getByRole('region', { name: 'Scrollable collections table' }).locator('tbody tr').count(), 1);
    await page.getByRole('searchbox', { name: 'Search generator categories' }).fill('developer');
    assert.equal(await page.getByRole('region', { name: 'Scrollable generator categories table' }).locator('tbody tr').count(), 1);

    navigations++;
    await page.goto(`${base}/admin/generators`, { waitUntil: 'networkidle' });
    await page.getByRole('searchbox', { name: 'Search tools' }).fill('headline');
    assert.equal(await page.locator('tbody tr').count(), 1);

    await page.goto(`${base}/`, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('.ad-app').count(), 0);

    assert.deepEqual(errors, []);
    assert.deepEqual(
      requests.filter(u => !new RegExp(`^${base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/api/admin/v1/health$`).test(u)),
      [],
      `non-health privileged requests: ${JSON.stringify(requests)}`,
    );
    assert.equal(requests.length, navigations, `expected one probe per console navigation (${navigations}), saw ${requests.length}`);

    results.push({ name, width, height, overflow, errors, navigations, adminOrSupabaseRequests: requests.length });
    await page.close();
  }

  await browser.close();
  console.log(JSON.stringify(results, null, 2));
})().catch(e => {
  console.error(e);
  process.exit(1);
});
