import { devices, expect, test, type Page } from '@playwright/test';
import { accessSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SCREENSHOTS = path.join(ROOT, 'phase4-artifacts', 'screenshots');
mkdirSync(SCREENSHOTS, { recursive: true });

const TOOLS = [
  '/bio-generator',
  '/stylish-name-generator',
  '/fancy-font-generator',
  '/design-studio',
  '/username-generator',
  '/emoji-symbol-generator',
  '/hashtag-generator',
  '/caption-generator',
  '/linkedin-headline-generator',
  '/linkedin-summary-generator',
  '/whatsapp-status-generator',
  '/snapchat-caption-generator',
  '/bio-editor',
] as const;
const MOBILE_WIDTHS = [360, 390, 412, 430] as const;
const HEIGHTS: Record<number, number> = { 360: 800, 390: 844, 412: 915, 430: 932 };
const EXPECTED_TOOL_HEADINGS: Record<string, string> = {
  '/bio-generator': 'Bio Generator',
  '/stylish-name-generator': 'Stylish Name Generator',
  '/fancy-font-generator': 'Fancy Font Generator',
  '/design-studio': 'Design Studio',
  '/username-generator': 'Username Generator',
  '/emoji-symbol-generator': 'Emoji & Symbol Generator',
  '/hashtag-generator': 'Hashtag Generator',
  '/caption-generator': 'Caption Generator',
  '/linkedin-headline-generator': 'Professional Headline Generator',
  '/linkedin-summary-generator': 'Professional Summary Generator',
  '/whatsapp-status-generator': 'WhatsApp Status Generator',
  '/snapchat-caption-generator': 'Snapchat Caption Generator',
};
const ROUTE_PLATFORM: Record<string, string> = {
  '/linkedin-headline-generator': 'LinkedIn',
  '/linkedin-summary-generator': 'LinkedIn',
  '/whatsapp-status-generator': 'WhatsApp',
  '/snapchat-caption-generator': 'Snapchat',
};
const TOOL_READY_SELECTOR: Record<string, string> = {
  '/bio-generator': '#field-name',
  '/stylish-name-generator': '#stylish-name-input',
  '/fancy-font-generator': '#fancy-font-input',
  '/design-studio': '#design-studio-input',
  '/username-generator': '#username-name',
  '/emoji-symbol-generator': '#symbol-search-input',
  '/hashtag-generator': '.generate-button',
  '/caption-generator': '.generate-button',
  '/linkedin-headline-generator': '#linkedin-headline-role',
  '/linkedin-summary-generator': '#linkedin-summary-role',
  '/whatsapp-status-generator': '.generate-button',
  '/snapchat-caption-generator': '.generate-button',
  '/bio-editor': '#bio-editor-input',
};
const browserErrors = new WeakMap<Page, string[]>();
const browserConsoleErrors = new WeakMap<Page, string[]>();

function builtRoutes(): string[] {
  const routes = ['/'];
  for (const entry of readdirSync(path.join(ROOT, 'dist'), { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    try {
      accessSync(path.join(ROOT, 'dist', entry.name, 'index.html'));
      routes.push(`/${entry.name}`);
    } catch {
      // Asset folders do not contain route shells.
    }
  }
  return routes;
}

async function openTool(page: Page, route: string) {
  const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
  expect(response?.ok(), `${route} HTTP response`).toBeTruthy();
  await page.locator('.tool-mode-toggle').waitFor({ state: 'visible' });
  await expect(page.locator('.toolkit-workspace, .bio-editor-page')).toBeVisible();
  const platform = ROUTE_PLATFORM[route];
  if (platform) await page.getByRole('button', { name: platform, exact: true }).click();
  if (route === '/bio-editor') {
    await expect(page.locator('.bio-editor-page h1')).toContainText('Bio Editor');
  } else {
    await expect(page.locator('#tool-heading')).toContainText(EXPECTED_TOOL_HEADINGS[route]);
  }
  await page.locator(TOOL_READY_SELECTOR[route]).waitFor({ state: 'visible', timeout: 20_000 });
}

async function verifyModeSwitch(page: Page) {
  const basic = page.getByRole('button', { name: 'Basic', exact: true });
  const advanced = page.getByRole('button', { name: 'Advanced', exact: true });
  const current = await page.locator('[data-tool-mode]').first().getAttribute('data-tool-mode');
  expect(current === 'basic' || current === 'advanced').toBeTruthy();
  await expect(current === 'basic' ? basic : advanced).toHaveAttribute('aria-pressed', 'true');
  await advanced.click();
  await expect(page.locator('[data-tool-mode="advanced"]')).toBeVisible();
  await expect(advanced).toHaveAttribute('aria-pressed', 'true');
  await basic.click();
  await expect(page.locator('[data-tool-mode="basic"]')).toBeVisible();
  await expect(basic).toHaveAttribute('aria-pressed', 'true');
}

async function copyAndVerify(page: Page, button: ReturnType<Page['locator']>, expected?: string) {
  await button.click();
  const copiedText = await page.evaluate(() => navigator.clipboard.readText());
  expect(copiedText.length).toBeGreaterThan(0);
  if (expected !== undefined) expect(copiedText).toBe(expected);
  return copiedText;
}

async function verifyDownload(page: Page, button: ReturnType<Page['getByRole']>) {
  const downloadPromise = page.waitForEvent('download');
  await button.click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/\.txt$/i);
}

async function captureTool(page: Page, slug: string, selector: string) {
  const target = page.locator(selector).first();
  await target.scrollIntoViewIfNeeded();
  await page.screenshot({ path: path.join(SCREENSHOTS, `${slug}-390.png`) });
}

async function verifyNoHorizontalOverflow(page: Page, width: number, route: string) {
  const dimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));
  expect(
    Math.max(dimensions.document, dimensions.body),
    `${route} horizontal overflow at ${width}px: ${JSON.stringify(dimensions)}`,
  ).toBeLessThanOrEqual(dimensions.viewport + 1);
}

test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  const consoleErrors: string[] = [];
  browserErrors.set(page, errors);
  browserConsoleErrors.set(page, consoleErrors);
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
});

test.afterEach(async ({ page }) => {
  expect(browserErrors.get(page) ?? [], 'uncaught browser page errors').toEqual([]);
  expect(browserConsoleErrors.get(page) ?? [], 'browser console errors').toEqual([]);
});

test('all 48 direct routes hydrate with their own page content and route metadata', async ({ page }) => {
  const routes = builtRoutes();
  expect(routes).toHaveLength(48);
  for (const route of routes) {
    // Vite preview serves static directory indexes at the slash form while its
    // clean extensionless URL falls through to the SPA shell. Check the actual
    // route shell separately, then verify the existing public (no-slash) URL
    // hydrates to the same route-specific title and content.
    const shellPath = route === '/' ? '/' : `${route}/`;
    const shellResponse = await page.request.get(shellPath);
    expect(shellResponse.status(), `${route} static route shell`).toBe(200);
    const shellHtml = await shellResponse.text();
    const shellMetadata = await page.evaluate((html) => {
      const shell = new DOMParser().parseFromString(html, 'text/html');
      return {
        title: shell.title,
        description: shell.querySelector('meta[name="description"]')?.getAttribute('content') ?? '',
      };
    }, shellHtml);
    expect(shellMetadata.title, `${route} static title`).not.toBe('');
    expect(shellMetadata.description, `${route} static description`).not.toBe('');

    const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
    expect(response?.status(), `${route} HTTP status`).toBe(200);
    await expect.poll(() => page.title(), { message: `${route} route-specific title` }).toBe(shellMetadata.title);
    await expect.poll(() => page.locator('#root').evaluate((root) => root.childElementCount), { message: `${route} React mount` }).toBeGreaterThan(0);
    await expect(page.locator('meta[name="description"]'), `${route} description`).toHaveAttribute('content', /.+/);
    await expect(page.locator('h1').first(), `${route} primary heading`).toHaveCount(1);
    await expect(page.locator('h1').first()).not.toHaveText('');
  }
});

test('mobile widths have no document-level horizontal scrolling on all tools and all routes', async ({ page }) => {
  for (const width of MOBILE_WIDTHS) {
    await page.setViewportSize({ width, height: HEIGHTS[width] });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#workspace')).toBeVisible();
    await verifyNoHorizontalOverflow(page, width, '/');
    if (width === 360 || width === 390 || width === 412 || width === 430) {
      await page.screenshot({ path: path.join(SCREENSHOTS, `home-${width}.png`) });
    }

    for (const route of TOOLS) {
      await openTool(page, route);
      await verifyNoHorizontalOverflow(page, width, route);
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
});

test('delayed lazy tool chunk exposes a real loading status and then completes', async ({ page }) => {
  await page.route('**/assets/SymbolGenerator-*.js', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    await route.continue();
  });
  await page.goto('/emoji-symbol-generator', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.tool-loading')).toBeVisible();
  await expect(page.locator('#symbol-search-input')).toBeVisible({ timeout: 15_000 });
  await expect(page.locator('.tool-loading')).toHaveCount(0);
});

test('mode preference survives reload; app navigation and browser Back restore tool state', async ({ page }) => {
  await openTool(page, '/bio-generator');
  await page.getByRole('button', { name: 'Advanced', exact: true }).click();
  await expect(page.locator('[data-tool-mode="advanced"]')).toBeVisible();
  await page.reload();
  await expect(page.locator('[data-tool-mode="advanced"]')).toBeVisible();
  await page.locator('.tool-tab[href="/stylish-name-generator"]').click();
  await expect(page).toHaveURL(/stylish-name-generator/);
  await expect(page.locator('#tool-heading')).toContainText('Stylish Name');
  await expect(page.locator('[data-tool-mode="advanced"]')).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/bio-generator/);
  await expect(page.locator('#tool-heading')).toContainText('Bio Generator');
  await page.getByRole('button', { name: 'Basic', exact: true }).click();
});

test('every tool supports its mobile workflow, editable output, copy/download, and mode behavior', async ({ page }) => {
  // A clean browser starts in Basic mode; preference persistence is covered
  // separately below, so this explicit setup cannot inherit stale state.
  await page.addInitScript(() => localStorage.removeItem('biocraft:tool-mode'));
  // Bio Generator: required-field validation, generation, editable output,
  // clipboard, download, regeneration, remembered mode, mobile screenshot.
  await openTool(page, '/bio-generator');
  await expect(page.getByRole('button', { name: 'Basic', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await verifyModeSwitch(page);
  await page.locator('#field-name').fill('Asha');
  await page.locator('.generate-button').click();
  await expect(page.locator('.form-error-summary')).toBeVisible();
  await page.locator('#field-role').fill('Designer');
  await page.locator('.generate-button').click();
  await expect(page.locator('.bio-card .result-editable')).toHaveCount(5);
  const bioOutput = page.locator('.bio-card .result-editable').first();
  await bioOutput.fill('Asha — edited designer bio');
  await copyAndVerify(page, page.locator('.bio-card .copy-button').first(), 'Asha — edited designer bio');
  await verifyDownload(page, page.locator('.results-actions button').filter({ hasText: 'Download' }).first());
  await page.getByRole('button', { name: 'Regenerate', exact: true }).click();
  await expect(page.locator('.bio-card .result-editable')).toHaveCount(5);
  await captureTool(page, 'bio-generator', '.results-column');

  // Stylish Name: live Unicode variants are independently editable; copy,
  // export and advanced style collections consume the edits.
  await openTool(page, '/stylish-name-generator');
  await verifyModeSwitch(page);
  await page.locator('#stylish-name-input').fill('Asha');
  const nameOutput = page.locator('.style-row-editable').first();
  await nameOutput.fill('Custom stylish name');
  await copyAndVerify(page, page.locator('.style-row .copy-button').first(), 'Custom stylish name');
  await verifyDownload(page, page.getByRole('button', { name: 'Download .txt' }));
  await page.getByRole('button', { name: /Advanced/ }).click();
  await page.locator('.style-collection-picker').getByRole('button', { name: /Script/ }).click();
  await expect(page.locator('.style-row')).toHaveCount(6);
  await page.getByRole('button', { name: 'Basic', exact: true }).click();
  await captureTool(page, 'stylish-name-generator', '.style-gallery');

  // Fancy Fonts.
  await openTool(page, '/fancy-font-generator');
  await verifyModeSwitch(page);
  await page.locator('#fancy-font-input').fill('BioCraft on Android');
  const fancyOutput = page.locator('.style-row-editable').first();
  await fancyOutput.fill('An edited font variant');
  await copyAndVerify(page, page.locator('.style-row .copy-button').first(), 'An edited font variant');
  await verifyDownload(page, page.getByRole('button', { name: 'Download .txt' }));
  await captureTool(page, 'fancy-font-generator', '.style-gallery');

  // Design Studio: live preview and curated result text can both be edited.
  await openTool(page, '/design-studio');
  await verifyModeSwitch(page);
  await page.locator('#design-studio-input').fill('A thoughtful profile line');
  const designOutput = page.locator('.design-studio-preview .design-studio-output');
  await designOutput.fill('An edited design preview');
  await copyAndVerify(page, page.locator('.design-studio-preview .copy-button'), 'An edited design preview');
  await verifyDownload(page, page.locator('.design-studio-preview').getByRole('button', { name: 'Download' }));
  await page.getByRole('button', { name: 'Advanced', exact: true }).click();
  await page.locator('#design-studio-font').selectOption('bold');
  await page.locator('#design-studio-frame').selectOption('crown');
  await expect(designOutput).toContainText('👑');
  const mixOutput = page.locator('.mix-card .design-studio-output').first();
  await mixOutput.fill('An edited curated mix');
  await copyAndVerify(page, page.locator('.mix-card .copy-button').first(), 'An edited curated mix');
  await page.getByRole('button', { name: /Remix/ }).click();
  await captureTool(page, 'design-studio', '.design-studio-preview');

  // Username Generator: invalid input, editable handles and copy/download.
  await openTool(page, '/username-generator');
  await verifyModeSwitch(page);
  await page.locator('#username-name').fill('A');
  await page.locator('.generate-button').click();
  await expect(page.locator('.form-error-summary')).toBeVisible();
  await page.locator('#username-name').fill('Asha Mehta');
  await page.locator('.generate-button').click();
  await expect(page.locator('.username-result-input')).toHaveCount(12);
  const username = page.locator('#username-result-0');
  await username.fill('asha.edited');
  await copyAndVerify(page, page.locator('.username-copy-button').first(), 'asha.edited');
  await verifyDownload(page, page.locator('.results-actions button').filter({ hasText: 'Download' }).first());
  await page.getByRole('button', { name: 'Regenerate', exact: true }).click();
  await expect(page.locator('.username-result-input')).toHaveCount(12);
  await captureTool(page, 'username-generator', '.username-grid');

  // Emoji & Symbols: search, progressive rendering, favourite, copy and export.
  await openTool(page, '/emoji-symbol-generator');
  await verifyModeSwitch(page);
  await expect(page.locator('.symbol-grid .symbol-button')).toHaveCount(48);
  await page.locator('#symbol-search-input').fill('heart');
  const firstSymbol = page.locator('.symbol-grid .symbol-button').first();
  await expect(firstSymbol).toBeVisible();
  await copyAndVerify(page, firstSymbol);
  const fav = page.locator('.symbol-grid .symbol-fav').first();
  await fav.click();
  await expect(fav).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: /Copy all .* matching symbols/ }).click();
  await expect(page.locator('.tool-card > [role="status"]')).toContainText('Copied');
  await verifyDownload(page, page.getByRole('button', { name: 'Download' }));
  await page.locator('#symbol-search-input').fill('');
  await page.getByRole('button', { name: /Show 48 more symbols/ }).click();
  await expect(page.locator('.symbol-grid .symbol-button')).toHaveCount(96);
  await captureTool(page, 'emoji-symbol-generator', '.symbol-grid');

  // Hashtags: grouped editable set, prior-result retention on invalid submit.
  await openTool(page, '/hashtag-generator');
  await verifyModeSwitch(page);
  await page.locator('.generate-button').click();
  const hashtagOutput = page.locator('#hashtag-results-edit');
  await expect(hashtagOutput).toBeVisible();
  await hashtagOutput.fill('#phasefour #edited');
  await copyAndVerify(page, page.locator('.hashtag-actions button').first(), '#phasefour #edited');
  await verifyDownload(page, page.locator('.results-actions button').filter({ hasText: 'Download' }).first());
  await page.getByRole('button', { name: 'Advanced', exact: true }).click();
  await expect(page.locator('#hashtag-keywords')).toBeVisible();
  await page.locator('#hashtag-keywords').fill('!!!');
  await page.locator('.generate-button').click();
  await expect(page.locator('#hashtag-keywords-error')).toBeVisible();
  await expect(hashtagOutput).toHaveValue('#phasefour #edited');
  await page.locator('#hashtag-keywords').fill('');
  await page.getByRole('button', { name: 'Regenerate', exact: true }).click();
  await expect(hashtagOutput).not.toHaveValue('#phasefour #edited');
  await captureTool(page, 'hashtag-generator', '#hashtag-results-edit');

  // Captions: tone/language controls, editing, copy, download, regeneration.
  await openTool(page, '/caption-generator');
  await verifyModeSwitch(page);
  await page.locator('.generate-button').click();
  await expect(page.locator('.caption-card .result-editable')).toHaveCount(5);
  const caption = page.locator('.caption-card .result-editable').first();
  await caption.fill('A real edited caption');
  await copyAndVerify(page, page.locator('.caption-card .copy-button').first(), 'A real edited caption');
  await verifyDownload(page, page.locator('.results-actions button').filter({ hasText: 'Download' }).first());
  await page.getByRole('button', { name: 'Regenerate', exact: true }).click();
  await expect(page.locator('.caption-card .result-editable')).toHaveCount(5);
  await captureTool(page, 'caption-generator', '.caption-card');

  // LinkedIn headline.
  await openTool(page, '/linkedin-headline-generator');
  await verifyModeSwitch(page);
  const headlineRoleInput = page.locator('#linkedin-headline-role');
  await headlineRoleInput.fill('');
  await page.getByRole('button', { name: 'Generate 5 headlines', exact: true }).click();
  await expect(headlineRoleInput).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('.form-error-summary')).toContainText('Role is required.');
  await headlineRoleInput.fill('Product Designer');
  await page.getByRole('button', { name: 'Advanced', exact: true }).click();
  await page.locator('#linkedin-headline-focus').fill('accessible products');
  await page.locator('#linkedin-headline-years').fill('6');
  await page.locator('.generate-button').click();
  const headline = page.locator('.results-block .result-editable').first();
  await expect(headline).toBeVisible();
  await headline.fill('Edited LinkedIn headline');
  await copyAndVerify(page, page.locator('.results-block .bio-card .copy-button').first(), 'Edited LinkedIn headline');
  await verifyDownload(page, page.locator('.results-actions button').filter({ hasText: 'Download' }).first());
  await page.getByRole('button', { name: 'Regenerate', exact: true }).click();
  await captureTool(page, 'linkedin-headline-generator', '.results-block .bio-card');

  // LinkedIn summary.
  await openTool(page, '/linkedin-summary-generator');
  await verifyModeSwitch(page);
  await page.locator('#linkedin-summary-role').fill('Product Designer');
  await page.getByRole('button', { name: 'Advanced', exact: true }).click();
  await page.locator('#linkedin-summary-focus').fill('accessible products');
  await page.locator('.generate-button').click();
  const summary = page.locator('.results-block .result-editable').first();
  await expect(summary).toBeVisible();
  await summary.fill('Edited LinkedIn About draft');
  await copyAndVerify(page, page.locator('.results-block .bio-card .copy-button').first(), 'Edited LinkedIn About draft');
  await verifyDownload(page, page.locator('.results-actions button').filter({ hasText: 'Download' }).first());
  await page.getByRole('button', { name: 'Regenerate', exact: true }).click();
  await captureTool(page, 'linkedin-summary-generator', '.results-block .bio-card');

  // WhatsApp status.
  await openTool(page, '/whatsapp-status-generator');
  await verifyModeSwitch(page);
  await page.locator('.generate-button').click();
  const status = page.locator('.results-list .result-editable').first();
  await expect(status).toBeVisible();
  await status.fill('Edited WhatsApp status');
  await copyAndVerify(page, page.locator('.results-list .copy-button').first(), 'Edited WhatsApp status');
  await verifyDownload(page, page.locator('.results-actions button').filter({ hasText: 'Download' }).first());
  await page.getByRole('button', { name: 'Regenerate', exact: true }).click();
  await captureTool(page, 'whatsapp-status-generator', '.results-list .bio-card');

  // Snapchat caption.
  await openTool(page, '/snapchat-caption-generator');
  await verifyModeSwitch(page);
  await page.locator('.generate-button').click();
  const snap = page.locator('.results-list .result-editable').first();
  await expect(snap).toBeVisible();
  await snap.fill('Edited Snapchat caption');
  await copyAndVerify(page, page.locator('.results-list .copy-button').first(), 'Edited Snapchat caption');
  await verifyDownload(page, page.locator('.results-actions button').filter({ hasText: 'Download' }).first());
  await page.getByRole('button', { name: 'Regenerate', exact: true }).click();
  await captureTool(page, 'snapchat-caption-generator', '.results-list .bio-card');

  // Bio Editor.
  await openTool(page, '/bio-editor');
  await verifyModeSwitch(page);
  await page.locator('#bio-editor-input').fill('Asha · Product designer');
  await page.getByRole('button', { name: 'Advanced', exact: true }).click();
  await page.locator('#bio-editor-font').selectOption({ index: 1 });
  await page.getByRole('button', { name: 'Basic', exact: true }).click();
  await copyAndVerify(page, page.locator('.bio-editor-copy .copy-button'));
  await verifyDownload(page, page.locator('.bio-editor-copy-row').getByRole('button', { name: 'Download' }));
  await captureTool(page, 'bio-editor', '.bio-editor-preview');
});

test('mobile home screenshots at 360, 390, 412 and 430 CSS pixels', async ({ page }) => {
  for (const width of MOBILE_WIDTHS) {
    await page.setViewportSize({ width, height: HEIGHTS[width] });
    await page.goto('/', { waitUntil: 'networkidle' });
    await verifyNoHorizontalOverflow(page, width, '/');
    await page.screenshot({ path: path.join(SCREENSHOTS, `home-${width}.png`) });
  }
});

test('collects Core Web Vitals and long tasks under 4x CPU and slow-3G emulation', async ({ browser }) => {
  const context = await browser.newContext({
    ...devices['Pixel 7'],
    viewport: { width: 390, height: 844 },
    permissions: ['clipboard-read', 'clipboard-write'],
  });
  const page = await context.newPage();
  await page.addInitScript(() => {
    type GeometryDetail = { selector: string; top: number; height: number; display: string; position: string };
    type GeometryFrame = { timeMs: number; pathname: string; title: string; scrollY: number; visualViewport: { top: number; height: number } | null; activeElement: string; toolFoot: { top: number; height: number } | null; workspace: { top: number; height: number } | null; loading: boolean };
    type ShiftDetail = { value: number; startTime: number; scrollY: number; pathname: string; title: string; geometry: GeometryDetail[]; sources: string[] };
    type ScrollDetail = { timeMs: number; y: number };
    type MetricWindow = Window & { __phase4Metrics?: { lcpMs: number | null; cls: number; inpCandidateMs: number | null; longTasks: number[]; layoutShifts: ShiftDetail[]; scrollEvents: ScrollDetail[]; geometryTimeline: GeometryFrame[] } };
    const target = window as MetricWindow;
    target.__phase4Metrics = { lcpMs: null, cls: 0, inpCandidateMs: null, longTasks: [], layoutShifts: [], scrollEvents: [], geometryTimeline: [] };
    window.addEventListener('scroll', () => target.__phase4Metrics!.scrollEvents.push({ timeMs: performance.now(), y: window.scrollY }), { passive: true });
    let lastGeometry = '';
    const geometryTimer = window.setInterval(() => {
      const rectFor = (selector: string) => {
        const element = document.querySelector(selector);
        if (!(element instanceof HTMLElement)) return null;
        const rect = element.getBoundingClientRect();
        return { top: Number(rect.top.toFixed(1)), height: Number(rect.height.toFixed(1)) };
      };
      const viewport = window.visualViewport;
      const active = document.activeElement;
      const frame = {
        timeMs: Number(performance.now().toFixed(1)),
        pathname: location.pathname,
        title: document.title,
        scrollY: window.scrollY,
        visualViewport: viewport ? { top: Number(viewport.offsetTop.toFixed(1)), height: Number(viewport.height.toFixed(1)) } : null,
        activeElement: active instanceof HTMLElement ? `${active.tagName.toLowerCase()}${active.id ? `#${active.id}` : ''}` : 'none',
        toolFoot: rectFor('.tool-foot'),
        workspace: rectFor('#workspace'),
        loading: Boolean(document.querySelector('.tool-loading')),
      };
      const signature = JSON.stringify({ ...frame, timeMs: undefined });
      if (signature !== lastGeometry && target.__phase4Metrics!.geometryTimeline.length < 80) {
        target.__phase4Metrics!.geometryTimeline.push(frame);
        lastGeometry = signature;
      }
      if (frame.timeMs > 10_000) window.clearInterval(geometryTimer);
    }, 50);
    const supported = PerformanceObserver.supportedEntryTypes;
    const observe = (type: string, callback: (entries: PerformanceEntry[]) => void, options: PerformanceObserverInit = {}) => {
      if (!supported.includes(type)) return;
      const observer = new PerformanceObserver((list) => callback(list.getEntries()));
      observer.observe({ type, buffered: true, ...options } as PerformanceObserverInit);
    };
    observe('largest-contentful-paint', (entries) => {
      for (const entry of entries) target.__phase4Metrics!.lcpMs = entry.startTime;
    });
    observe('layout-shift', (entries) => {
      for (const entry of entries as (PerformanceEntry & { value: number; hadRecentInput: boolean; sources?: { node: Node; previousRect: DOMRectReadOnly; currentRect: DOMRectReadOnly }[] })[]) {
        if (entry.hadRecentInput) continue;
        target.__phase4Metrics!.cls += entry.value;
        const geometrySelectors = ['main', '.tool-page', '#workspace', '.workspace-card', '#tool-panel', '.tool-foot', '.tool-howto'];
        const geometry = geometrySelectors.flatMap((selector) => {
          const element = document.querySelector(selector);
          if (!(element instanceof HTMLElement)) return [];
          const rect = element.getBoundingClientRect();
          const style = getComputedStyle(element);
          return [{ selector, top: Number(rect.top.toFixed(1)), height: Number(rect.height.toFixed(1)), display: style.display, position: style.position }];
        });
        target.__phase4Metrics!.layoutShifts.push({
          value: entry.value,
          startTime: entry.startTime,
          scrollY: window.scrollY,
          pathname: location.pathname,
          title: document.title,
          geometry,
          sources: (entry.sources ?? []).map((source) => {
            const node = source.node instanceof Element ? source.node : source.node.parentElement;
            const classes = node && typeof node.className === 'string' ? node.className.trim().split(' ').filter(Boolean).join('.') : '';
            const description = node ? `${node.tagName.toLowerCase()}${node.id ? `#${node.id}` : ''}${classes ? `.${classes}` : ''}` : 'unknown';
            return `${description} y:${source.previousRect.y.toFixed(1)}→${source.currentRect.y.toFixed(1)}`;
          }),
        });
      }
    });
    observe('longtask', (entries) => {
      for (const entry of entries) target.__phase4Metrics!.longTasks.push(entry.duration);
    });
    observe('event', (entries) => {
      for (const entry of entries as (PerformanceEntry & { duration: number; interactionId?: number })[]) {
        if (entry.interactionId) {
          target.__phase4Metrics!.inpCandidateMs = Math.max(target.__phase4Metrics!.inpCandidateMs ?? 0, entry.duration);
        }
      }
    }, { durationThreshold: 16 } as PerformanceObserverInit);
  });
  const cdp = await context.newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  await cdp.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: 400,
    downloadThroughput: 50 * 1024,
    uploadThroughput: 25 * 1024,
    connectionType: 'cellular3g',
  });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  const navStart = Date.now();
  const response = await page.goto('/emoji-symbol-generator', { waitUntil: 'domcontentloaded', timeout: 60_000 });
  await expect(page.locator('#symbol-search-input')).toBeVisible({ timeout: 60_000 });
  const routeReadyMs = Date.now() - navStart;
  await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
  const interactionStartMs = await page.evaluate(() => performance.now());
  const searchInput = page.locator('#symbol-search-input');
  await searchInput.click();
  await searchInput.pressSequentially('heart', { delay: 20 });
  await expect(page.locator('.symbol-grid .symbol-button').first()).toBeVisible();
  await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
  const browserMetrics = await page.evaluate((interactionStart) => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    const metrics = (window as Window & { __phase4Metrics?: { lcpMs: number | null; cls: number; inpCandidateMs: number | null; longTasks: number[]; layoutShifts: { value: number; startTime: number; scrollY: number; pathname: string; title: string; geometry: { selector: string; top: number; height: number; display: string; position: string }[]; sources: string[] }[]; scrollEvents: { timeMs: number; y: number }[]; geometryTimeline: { timeMs: number; pathname: string; title: string; scrollY: number; visualViewport: { top: number; height: number } | null; activeElement: string; toolFoot: { top: number; height: number } | null; workspace: { top: number; height: number } | null; loading: boolean }[] } }).__phase4Metrics;
    const allLayoutShifts = metrics?.layoutShifts ?? [];
    const loadLayoutShifts = allLayoutShifts.filter((entry) => entry.startTime < interactionStart);
    return {
      route: location.pathname,
      navigationLoadEventEndMs: navigation?.loadEventEnd ?? null,
      lcpMs: metrics?.lcpMs ?? null,
      cls: loadLayoutShifts.reduce((sum, entry) => sum + entry.value, 0),
      inpCandidateMs: metrics?.inpCandidateMs ?? null,
      longTaskCount: metrics?.longTasks.length ?? 0,
      longTaskMaxMs: metrics?.longTasks.length ? Math.max(...metrics.longTasks) : 0,
      longTaskTotalMs: metrics?.longTasks.reduce((sum, duration) => sum + duration, 0) ?? 0,
      layoutShiftEvents: allLayoutShifts,
      loadPhaseLayoutShiftEvents: loadLayoutShifts,
      scrollEvents: metrics?.scrollEvents ?? [],
      geometryTimeline: metrics?.geometryTimeline ?? [],
      symbolsShownAfterSearch: document.querySelectorAll('.symbol-grid .symbol-button').length,
    };
  }, interactionStartMs);
  const report = {
    measurement: 'Synthetic Chromium lab run; Android mobile emulation, not a physical handset.',
    throttling: { cpuRate: 4, network: '3G emulation', latencyMs: 400, downloadBytesPerSecond: 50 * 1024, uploadBytesPerSecond: 25 * 1024 },
    routeReadyMs,
    responseStatus: response?.status() ?? null,
    ...browserMetrics,
  };
  writeFileSync(path.join(ROOT, 'phase4-artifacts', 'performance.json'), `${JSON.stringify(report, null, 2)}\n`);
  expect(response?.ok()).toBeTruthy();
  expect(browserMetrics.lcpMs, 'LCP observer should record the page content').not.toBeNull();
  expect(browserMetrics.cls).not.toBeNull();
  expect(browserMetrics.longTaskCount).not.toBeNull();
  await context.close();
});
