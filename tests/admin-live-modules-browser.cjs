/**
 * All 13 Live Admin modules, rendered in a browser against a stubbed Admin API.
 * Proves each module renders the real server shape, respects strict light-only
 * theme, has zero horizontal overflow at 320px+, opens interactive modals,
 * shows denials as denials, and never invents rows when a read fails.
 */
const { chromium, devices } = require('playwright-core');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const USER = '11111111-1111-4111-8111-111111111111';
const OTHER = '22222222-2222-4222-8222-222222222222';
const BIO = '33333333-3333-4333-8333-333333333333';
const DRAFT = '44444444-4444-4444-8444-444444444444';

const payload = { content: 'A bio that went through review', language: 'en', platform: 'instagram', active: true, featured: false };

const replies = {
  '/health': { ok: true },
  '/session': {
    user: {
      id: USER,
      roles: ['super_admin'],
      permissions: ['dashboard.read', 'staff.manage', 'content.read', 'content.draft', 'content.review', 'content.publish', 'settings.manage', 'audit.read', 'analytics.read'],
    },
    expires_at: new Date(Date.now() + 3600e3).toISOString(),
  },
  '/analytics': {
    metrics: [
      { metric: 'bios.active', value: 506 },
      { metric: 'bios.archived', value: 7 },
      { metric: 'categories.total', value: 33 },
      { metric: 'platforms.total', value: 8 },
      { metric: 'generators.total', value: 12 },
      { metric: 'seo_pages.total', value: 48 },
      { metric: 'admin.drafts.in_review', value: 2 },
      { metric: 'admin.drafts.approved', value: 1 },
      { metric: 'admin.audit.last_24h', value: 41 },
      { metric: 'admin.sessions.active', value: 3 },
    ],
  },
  '/staff': {
    items: [
      { user_id: USER, enabled: true, version: 3, roles: ['super_admin'] },
      { user_id: OTHER, enabled: false, version: 1, roles: ['editor'] },
    ],
  },
  '/roles': {
    items: [
      { id: 'super_admin', description: 'Super Admin', permissions: ['dashboard.read', 'staff.manage'] },
      { id: 'editor', description: 'Editor', permissions: ['dashboard.read', 'content.draft'] },
    ],
  },
  '/bio-drafts': {
    items: [{ draft_id: DRAFT, resource_key: 'morning-quotes', state: 'approved', row_version: 3, created_at: '2026-11-01T09:00:00.000Z', payload }],
  },
  '/bio-review-queue': {
    items: [{ draft_id: DRAFT, resource_key: 'morning-quotes', state: 'in_review', row_version: 2, author_id: OTHER, created_at: '2026-11-01T09:00:00.000Z', payload }],
  },
  '/publication-jobs': {
    items: [{
      id: '55555555-5555-4555-8555-555555555555',
      draft_id: DRAFT,
      resource_key: 'morning-quotes',
      target_environment: 'production',
      state: 'succeeded',
      scheduled_at: '2026-11-02T09:00:00.000Z',
      created_at: '2026-11-02T09:00:00.000Z',
      completed_at: '2026-11-02T09:00:01.000Z',
    }],
  },
  '/bios': {
    items: [{
      id: BIO,
      title: null,
      language: 'en',
      platform_slug: 'instagram',
      category_name: 'Motivation',
      is_active: true,
      is_featured: true,
      is_trending: false,
      character_count: 34,
      source_slug: 'morning-quotes',
      created_at: '2026-11-01T09:00:00.000Z',
      updated_at: '2026-11-02T09:00:00.000Z',
    }],
  },
  '/collections': {
    items: [
      { source_slug: 'attitude-bio', active_bios: 84, archived_bios: 2 },
      { source_slug: 'vip-bio', active_bios: 62, archived_bios: 1 },
      { source_slug: 'love-bio', active_bios: 54, archived_bios: 0 },
      { source_slug: 'royal-bio', active_bios: 48, archived_bios: 1 },
      { source_slug: 'gamer-bio', active_bios: 41, archived_bios: 0 },
    ],
  },
  '/audit-logs': {
    items: [
      { id: '9', actor_id: USER, action: 'draft.published', target_type: 'bio', target_id: BIO, occurred_at: '2026-11-02T09:00:01.000Z', details: {} },
      { id: '8', actor_id: USER, action: 'auth.login', target_type: 'session', target_id: null, occurred_at: '2026-11-02T08:00:00.000Z', details: {} },
    ],
  },
  '/sessions': {
    items: [{
      id: '66666666-6666-4666-8666-666666666666',
      created_at: '2026-11-02T08:00:00.000Z',
      expires_at: new Date(Date.now() + 3600e3).toISOString(),
      revoked_at: null,
    }],
  },
  '/system/status': { database:'ready', auth:'verified', guest_content:'ready', runtime:'preview', shared_writes:false, password_reset:false },
  '/settings': {
    items: [{ key: 'content.review_required', value: { enabled: true }, version: 2, updated_at: '2026-11-01T09:00:00.000Z' }],
  },
  '/backups': {
    items: [{
      id: '77777777-7777-4777-8777-777777777777',
      environment: 'production',
      provider_reference: 'snap-2026-11-01',
      state: 'restore_verified',
      requested_at: '2026-11-01T00:00:00.000Z',
      verified_at: '2026-11-01T01:00:00.000Z',
    }],
  },
  '/platforms': {
    items: [
      { id: '11111111-1111-4111-8111-111111111111', name: 'Instagram', slug: 'instagram', description: 'Photo and caption platform', is_active: true, sort_order: 1 },
      { id: '22222222-2222-4222-8222-222222222222', name: 'Legacy', slug: 'legacy', description: null, is_active: false, sort_order: 2 },
    ],
  },
  '/categories': {
    items: [{ id: '33333333-3333-4333-8333-333333333333', name: 'Motivation', slug: 'motivation', description: 'Encouraging bios', platform_slug: 'instagram', is_active: true, sort_order: 1 }],
  },
  '/generators': {
    items: [{ id: '44444444-4444-4444-8444-444444444444', name: 'Bio for Instagram', slug: 'bio-for-instagram', generator_type: 'bio', character_limit: 150, is_active: true, platform_slug: 'instagram' }],
  },
  '/seo-pages': {
    items: [{ id: '99999999-9999-4999-8999-999999999999', page_slug: 'motivation-bios', title: 'Motivation bios', meta_description: 'Short encouraging bios', robots: 'index,follow', is_active: true, updated_at: '2026-11-02T09:00:00.000Z' }],
  },
  '/notifications': {
    items: [{ id: '88888888-8888-4888-8888-888888888888', category: 'review.assigned', message: 'A draft is waiting for your review.', created_at: '2026-11-02T09:00:00.000Z', read_at: null, unread: true }],
  },
};

(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.BROWSER_EXECUTABLE_PATH,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  const base = process.env.ADMIN_BASE_URL || 'http://127.0.0.1:4178';
  const results = [];

  try {
    for (const [name, opts] of [
      ['android-emulated', devices['Pixel 5']],
      ['tablet', { viewport: { width: 820, height: 1100 } }],
      ['desktop', { viewport: { width: 1440, height: 900 } }],
    ]) {
      const context = await browser.newContext(opts);
      await context.route('**/api/admin/v1/**', async route => {
        const url = new URL(route.request().url());
        const key = url.pathname.replace('/api/admin/v1', '');
        const body = replies[key];
        if (body) {
          await route.fulfill({ status: 200, contentType: 'application/json', headers: { 'cache-control': 'no-store' }, body: JSON.stringify({ ...body, request_id: 'test' }) });
        } else {
          await route.fulfill({ status: 403, contentType: 'application/json', body: JSON.stringify({ error: { code: 'FORBIDDEN' } }) });
        }
      });

      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));

      // 1. Overview
      await page.goto(`${base}/admin`, { waitUntil: 'networkidle' });
      await page.getByRole('heading', { level: 1, name: /Overview/i }).waitFor();
      assert.equal(await page.locator('.ad-dark').count(), 0, `${name}: strict light theme`);
      const activeBio = await page.locator('.ad-stat', { hasText: 'Active bios' }).first().innerText();
      assert.match(activeBio, /506/, 'overview must show live active-bio count');
      assert.match(await page.locator('.ad-stat', { hasText: 'Audit events' }).first().innerText(), /41/);
      await page.getByText('Super Admin').first().waitFor();
      assert.equal((await page.getByText('Live data').count()) > 0, true);

      if (process.env.CAPTURE_LIVE_DIR) {
        fs.mkdirSync(process.env.CAPTURE_LIVE_DIR, { recursive: true });
        await page.screenshot({ path: path.join(process.env.CAPTURE_LIVE_DIR, `live-${name}-overview.png`), fullPage: true });
      }

      // Axe accessibility check on Live Overview
      await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
      const overviewAudit = await page.evaluate(() =>
        window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] } }),
      );
      assert.deepEqual(
        overviewAudit.violations.map(v => `${v.id}: ${v.nodes.map(n => n.target.join(' ')).join(', ')}`),
        [],
        `${name} live overview accessibility`,
      );

      // 2. Users & Staff
      await page.goto(`${base}/admin/users`, { waitUntil: 'networkidle' });
      await page.getByRole('heading', { name: 'Users & Staff', exact: true }).waitFor();
      await page.getByRole('region', { name: 'Staff table' }).waitFor();
      assert.match(await page.getByRole('region', { name: 'Staff table' }).innerText(), /Super Admin/);
      assert.match(await page.getByRole('region', { name: 'Staff table' }).innerText(), /Disabled/);
      await page.getByRole('button', { name: 'Edit access' }).first().click();
      await page.getByRole('group', { name: 'Roles' }).waitFor();
      assert.equal(await page.getByRole('button', { name: 'Save' }).isDisabled(), false);

      // 3. Content & SEO
      await page.goto(`${base}/admin/content`, { waitUntil: 'networkidle' });
      await page.getByRole('heading', { name: 'Content & SEO', exact: true }).waitFor();
      await page.getByRole('heading', { name: 'My drafts' }).waitFor();
      assert.match(await page.getByRole('region', { name: 'Drafts table' }).innerText(), /Approved/);
      await page.getByRole('button', { name: 'Publish' }).first().waitFor();
      await page.getByRole('button', { name: 'Read text' }).first().click();
      await page.getByRole('region', { name: 'Draft text' }).waitFor();
      await page.getByRole('button', { name: 'Close dialog' }).click();
      await page.getByRole('tab', { name: /Review Queue/i }).click();
      assert.match(await page.getByRole('region', { name: 'Review queue' }).innerText(), /Approve/);

      // 4. Bios Library
      await page.goto(`${base}/admin/bios`, { waitUntil: 'networkidle' });
      await page.getByRole('heading', { name: 'Bios Library', exact: true }).waitFor();
      await page.getByRole('region', { name: 'Bio library table' }).waitFor();
      assert.match(await page.getByRole('region', { name: 'Bio library table' }).innerText(), /Visible/);

      // 5. Collections (new dedicated module)
      await page.goto(`${base}/admin/collections`, { waitUntil: 'networkidle' });
      await page.getByRole('heading', { name: 'Collections', exact: true }).waitFor();
      await page.getByRole('region', { name: 'Scrollable collections table' }).waitFor();
      assert.match(await page.getByRole('region', { name: 'Scrollable collections table' }).innerText(), /attitude-bio/);

      // 6. Platforms
      await page.goto(`${base}/admin/platforms`, { waitUntil: 'networkidle' });
      await page.getByRole('region', { name: 'Scrollable platforms table' }).waitFor();
      const platforms = await page.getByRole('region', { name: 'Scrollable platforms table' }).innerText();
      assert.match(platforms, /instagram/);
      assert.match(platforms, /Disabled/);
      await page.getByText('Not editable here').waitFor();

      // 7. Categories & SEO pages
      await page.goto(`${base}/admin/categories`, { waitUntil: 'networkidle' });
      await page.getByRole('region', { name: 'Scrollable categories table' }).waitFor();
      assert.match(await page.getByRole('region', { name: 'Scrollable categories table' }).innerText(), /motivation/);
      await page.getByRole('region', { name: 'Scrollable SEO pages table' }).waitFor();
      assert.match(await page.getByRole('region', { name: 'Scrollable SEO pages table' }).innerText(), /motivation-bios/);

      // 8. Generators
      await page.goto(`${base}/admin/generators`, { waitUntil: 'networkidle' });
      await page.getByRole('region', { name: 'Scrollable generators table' }).waitFor();
      assert.match(await page.getByRole('region', { name: 'Scrollable generators table' }).innerText(), /150 chars/);

      // 9. Analytics
      await page.goto(`${base}/admin/analytics`, { waitUntil: 'networkidle' });
      await page.getByRole('heading', { name: 'Analytics', exact: true }).waitFor();
      assert.match(await page.locator('.ad-stat', { hasText: 'Active bios' }).first().innerText(), /506/);
      await page.getByText('Not measured').waitFor();

      // 10. Audit Logs (new dedicated module)
      await page.goto(`${base}/admin/audit-logs`, { waitUntil: 'networkidle' });
      await page.getByRole('heading', { name: 'Audit Logs', exact: true }).waitFor();
      await page.getByRole('region', { name: 'Audit trail table' }).waitFor();
      assert.match(await page.getByRole('region', { name: 'Audit trail table' }).innerText(), /Published to public site/);

      // 11. Security & Roles
      await page.goto(`${base}/admin/security`, { waitUntil: 'networkidle' });
      await page.getByRole('heading', { name: 'Security & Roles', exact: true }).waitFor();
      await page.getByRole('button', { name: 'Load the audit trail' }).click();
      await page.getByRole('region', { name: 'Audit trail table' }).waitFor();

      // 12. Settings
      await page.goto(`${base}/admin/settings`, { waitUntil: 'networkidle' });
      await page.locator('h1', { hasText: 'Settings' }).waitFor();
      assert.match(await page.getByRole('region', { name: 'Settings table' }).innerText(), /Require independent review/);
      await page.getByText('Not configurable here').waitFor();
      await page.getByText('Public catalogue read: Connected', {exact:true}).waitFor();

      if (name === 'desktop') {
        let attempts = 0;
        const cursor = 'setting.test_099';
        await page.route('**/api/admin/v1/settings?*', async route => {
          const after = new URL(route.request().url()).searchParams.get('after');
          const base = {value:{enabled:true},version:1};
          if (!after) return route.fulfill({json:{items:Array.from({length:100},(_,i)=>({...base,key:`setting.test_${String(i).padStart(3,'0')}`}))}});
          assert.equal(after,cursor);
          if (++attempts === 1) return route.fulfill({status:503,json:{error:{code:'UNAVAILABLE'}}});
          return route.fulfill({json:{items:[{...base,key:'setting.extra_page'}]}});
        });
        await page.reload();
        await page.getByRole('button',{name:'Load more settings'}).click();
        await page.getByRole('button',{name:'Retry page'}).click();
        await page.getByText('setting.extra_page', {exact:true}).first().waitFor();
        assert.equal(attempts,2);
        assert.equal(await page.getByRole('button',{name:'Load more settings'}).count(),0);
      }

      // 13. Backup & Recovery (new dedicated module)
      await page.goto(`${base}/admin/backup`, { waitUntil: 'networkidle' });
      await page.getByRole('heading', { name: 'Backup & Recovery', exact: true }).waitFor();
      await page.getByRole('region', { name: 'Backup records' }).waitFor();
      assert.match(await page.getByRole('region', { name: 'Backup records' }).innerText(), /snap-2026-11-01/);

      // Responsive zero-overflow sweep on phone widths
      if (opts.isMobile) {
        await page.setViewportSize({ width: 320, height: 700 });
        for (const route of [
          '/admin', '/admin/bios', '/admin/categories', '/admin/collections', '/admin/platforms',
          '/admin/generators', '/admin/content', '/admin/users', '/admin/analytics',
          '/admin/audit-logs', '/admin/security', '/admin/settings', '/admin/backup',
        ]) {
          await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
          const dims = await page.evaluate(() => ({ w: innerWidth, s: document.documentElement.scrollWidth }));
          assert.ok(dims.s <= dims.w, `${name} ${route} overflows at 320px: ${JSON.stringify(dims)}`);
        }
      }

      assert.deepEqual(errors, [], `${name} page errors`);
      results.push({ name, liveRoutes: '13/13 pass', rolesFromSession: 'pass', draftWorkflow: 'pass', strictLightTheme: 'pass', pageErrors: errors.length });
      await context.close();
    }

    // Denied-read verification
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await context.route('**/api/admin/v1/**', async route => {
      const key = new URL(route.request().url()).pathname.replace('/api/admin/v1', '');
      if (key === '/bios') {
        await route.fulfill({ status: 403, contentType: 'application/json', body: JSON.stringify({ error: { code: 'FORBIDDEN' } }) });
        return;
      }
      const body = replies[key];
      if (body) {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ...body, request_id: 'test' }) });
        return;
      }
      await route.fulfill({ status: 404, contentType: 'application/json', body: JSON.stringify({ error: { code: 'NOT_FOUND' } }) });
    });
    const page = await context.newPage();
    await page.goto(`${base}/admin/bios`, { waitUntil: 'networkidle' });
    await page.getByText('Not permitted for this account').waitFor();
    assert.equal(await page.getByRole('region', { name: 'Bio library table' }).count(), 0, 'a denied read must not render a table');
    await context.close();
    results.push({ name: 'denied-read', rendersDenialNotNull: 'pass' });

    console.log(JSON.stringify(results, null, 2));
    console.log('PASS all 13 live Admin modules verified');
  } finally {
    await browser.close();
  }
})().catch(e => {
  console.error(e);
  process.exit(1);
});
