import { expect, test } from '@playwright/test';

/**
 * Browser-level proof for the BioCraft Hindi Font Ecosystem.
 *
 * These assertions read the rendered page: computed font families, text advances
 * measured inside Chromium, the WOFF2 requests that were actually made, layout at
 * a phone width and a downloaded poster PNG. They complement the Skia suite in
 * tests/hindi-fonts-rendering.mjs; neither relies on a font's name alone.
 */

const SAMPLE = 'नमस्ते भारत, ज़िंदगी खूबसूरत है।';

async function renderedWidth(
  page: import('@playwright/test').Page,
  text: string,
  fontFamily: string,
) {
  return page.evaluate(
    ({ text, fontFamily }) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) return 0;
      context.font = `400 48px ${fontFamily}`;
      return context.measureText(text).width;
    },
    { text, fontFamily },
  );
}

test.describe('Hindi font library', () => {
  test('loads real Devanagari files and applies the family only after loading', async ({ page }) => {
    const fontRequests: string[] = [];
    page.on('request', request => {
      if (request.url().includes('/fonts/hindi/')) fontRequests.push(request.url());
    });

    await page.goto('/hindi-fonts');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('हिंदी');

    const firstCard = page.locator('[data-font-card]').first();
    await expect(firstCard).toBeVisible();
    // Cards load their WOFF2 only when close to the viewport (rootMargin 320px);
    // a phone viewport starts well above the first card, so bring it into view.
    await firstCard.scrollIntoViewIfNeeded();
    const preview = firstCard.locator('[data-font-loaded]').first();
    await expect(preview).toHaveAttribute('data-font-loaded', 'true', { timeout: 20_000 });

    const family = await preview.evaluate(element => getComputedStyle(element).fontFamily);
    expect(family).toContain('BioCraft Hindi');

    const slug = await preview.getAttribute('data-font-slug');
    expect(fontRequests.some(url => url.includes(`/fonts/hindi/${slug}/`))).toBe(true);

    // The font genuinely changes metrics instead of merely changing a label.
    const withFont = await renderedWidth(page, SAMPLE, family);
    const fallback = await renderedWidth(page, SAMPLE, 'sans-serif');
    expect(withFont).toBeGreaterThan(0);
    expect(Math.abs(withFont - fallback)).toBeGreaterThan(0.5);

    // Lazy loading: a page of 12 cards must not fetch all 62 families.
    expect(fontRequests.length).toBeLessThan(30);
  });

  test('renders the visitor’s own mixed Hindi/English preview text', async ({ page }) => {
    await page.goto('/hindi-fonts');
    await page.getByLabel('Your Hindi preview text').fill('BioCraft 2026 — नमस्ते दुनिया, क्ष त्र ज्ञ श्र');
    const card = page.locator('[data-font-card]').first();
    await card.scrollIntoViewIfNeeded();
    const preview = card.locator('[data-font-loaded]').first();
    await expect(preview).toHaveAttribute('data-font-loaded', 'true');
    await expect(preview).toContainText('क्ष त्र ज्ञ श्र');
    await expect(preview).toContainText('BioCraft 2026');
    const box = await preview.boundingBox();
    expect(box?.height ?? 0).toBeGreaterThan(20);
  });

  test('searches in Hindi, paginates and remembers favourites — with no API call', async ({ page }) => {
    const api: string[] = [];
    page.on('request', request => {
      if (/\/api\//.test(new URL(request.url()).pathname)) api.push(request.url());
    });
    await page.goto('/hindi-fonts');
    const cards = page.locator('[data-font-card]');
    await expect(cards.first()).toBeVisible();
    const initialCount = await cards.count();
    expect(initialCount).toBeGreaterThan(5);

    await page.getByLabel('Search Hindi fonts').fill('पोस्टर');
    await expect.poll(async () => cards.count(), { timeout: 10_000 }).toBeGreaterThan(0);
    await expect(page.locator('.bc-filter-note')).toContainText('families');
    const posterTexts = await cards.locator('.bc-card-sub .bc-tag').first().allTextContents();
    expect(posterTexts.length).toBeGreaterThan(0);

    await page.getByLabel('Search Hindi fonts').fill('');
    await page.getByRole('button', { name: /Load more families/i }).click();
    await expect.poll(async () => cards.count(), { timeout: 10_000 }).toBeGreaterThan(initialCount);

    await cards.first().getByRole('button', { name: /favourites/i }).click();
    await page.getByRole('button', { name: /Favourites \(1\)/ }).click();
    await expect(cards).toHaveCount(1);
    await expect(page.locator('.bc-empty')).toHaveCount(0);

    // The public catalogue is bundled: searching, filtering and paging must not
    // touch /api/fonts (or any other API) at all.
    expect(api).toEqual([]);
  });

  test('compares two families with the same text', async ({ page }) => {
    await page.goto('/hindi-fonts');
    const cards = page.locator('[data-font-card]');
    await cards.nth(0).scrollIntoViewIfNeeded();
    // Card previews grow from a placeholder to the painted line as each WOFF2
    // arrives; comparing two cards is only a stable click once those have settled.
    await expect(cards.nth(1).locator('[data-font-loaded="true"]')).toHaveCount(1, {
      timeout: 20_000,
    });
    await cards.nth(0).getByRole('button', { name: /Compare/i }).click();
    const compare = page.getByRole('region', { name: 'Font comparison' });
    await expect(compare).toBeVisible();
    // The comparison dock is fixed to the bottom of the viewport and the
    // sub-navigation is sticky at the top, so park the second card between them —
    // exactly what a visitor does when the dock covers the card they want next.
    await cards.nth(1).evaluate(element => {
      const top = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top - 220 });
    });
    await cards.nth(1).getByRole('button', { name: /Compare/i }).click();
    await expect(compare).toBeVisible();
    await expect(compare.locator('.bc-compare-cell')).toHaveCount(2);
    const widths = await compare
      .locator('.bc-compare-cell [data-font-loaded]')
      .evaluateAll(elements =>
        elements.map(element => ({
          family: getComputedStyle(element).fontFamily,
          width: (element as HTMLElement).getBoundingClientRect().width,
        })),
      );
    expect(widths.length).toBe(2);
    expect(widths[0].family).not.toBe(widths[1].family);
  });
});

test.describe('Hindi specimen & licence', () => {
  test('renders the glyph sheet and offers a licensed WOFF2 download', async ({ page }) => {
    await page.goto('/hindi-fonts/tiro-devanagari-hindi');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Tiro Devanagari Hindi');
    const specimen = page.locator('.bc-specimen-large');
    await expect(specimen).toHaveAttribute('data-font-loaded', 'true', { timeout: 20_000 });
    await expect(page.getByText('Glyph test sheet')).toBeVisible();
    await expect(page.getByText('क्ष', { exact: false }).first()).toBeVisible();
    const download = page.locator('.bc-download-row a').first();
    await expect(download).toHaveAttribute('download', '');
    await expect(download).toHaveAttribute('href', /\.woff2$/);
  });

  test('an unknown slug renders the shared 404 page, not a blank route', async ({ page }) => {
    await page.goto('/hindi-fonts/no-such-family');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('यह फ़ॉन्ट नहीं मिला');
    await expect(page.getByRole('link', { name: /Back to the Hindi font library/ })).toBeVisible();
    expect(await page.evaluate(() => document.body.innerText.trim().length)).toBeGreaterThan(200);
  });

  test('the licence index names every family and the withheld one', async ({ page }) => {
    await page.goto('/hindi-font-licenses');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Open fonts');
    await expect(page.getByText('62 families indexed')).toBeVisible();
    await expect(page.getByText('1 family withheld')).toBeVisible();
    const rows = page.locator('#licence-table');
    await expect(rows).toBeVisible();
    expect(await page.locator('tbody tr').count()).toBe(62);
  });
});

test.describe('Hindi studio tools', () => {
  test('switches font families and measures a real text change', async ({ page }) => {
    await page.goto('/hindi-font-studio');
    const output = page.locator('.bc-output[data-font-loaded]');
    await expect(output).toHaveAttribute('data-font-loaded', 'true', { timeout: 20_000 });
    const text = (await output.textContent())?.trim() ?? SAMPLE;
    const beforeFamily = await output.evaluate(element => getComputedStyle(element).fontFamily);
    const beforeWidth = await renderedWidth(page, text, beforeFamily);

    await page.locator('.bc-picker-trigger').click();
    const listbox = page.getByRole('listbox', { name: 'Hindi fonts' });
    await expect(listbox).toBeVisible();
    await listbox.getByRole('option').nth(1).click();

    await expect
      .poll(() => output.evaluate(element => getComputedStyle(element).fontFamily))
      .not.toBe(beforeFamily);
    const afterFamily = await output.evaluate(element => getComputedStyle(element).fontFamily);
    expect(afterFamily).toContain('BioCraft Hindi');
    const afterWidth = await renderedWidth(page, text, afterFamily);
    expect(Math.abs(afterWidth - beforeWidth)).toBeGreaterThan(0.5);
  });

  test('generates Hindi bios, shayari, quotes, captions, usernames and styles', async ({ page }) => {
    await page.goto('/hindi-font-studio');
    const output = page.locator('.bc-output[data-font-loaded]');

    await page.getByLabel('Your name').fill('सचिन');
    await page.getByRole('button', { name: /Generate bios/i }).click();
    await expect(output).toContainText('सचिन');

    await page.getByRole('tab', { name: /Shayari/i }).click();
    await expect(output).toContainText(/।|,/);

    await page.getByRole('tab', { name: /Quotes/i }).click();
    await page.getByRole('tab', { name: /Captions/i }).click();
    await expect(output).toContainText('#');

    await page.getByRole('tab', { name: /Usernames/i }).click();
    await page.getByLabel('Name or word').fill('sachin');
    await page.getByRole('button', { name: /Generate handles/i }).click();
    await expect(output).toContainText(/[a-z0-9._]{4,30}/);

    await page.getByRole('tab', { name: /Stylish text/i }).click();
    await expect(page.getByText('Bold', { exact: true })).toBeVisible();

    await page.getByRole('tab', { name: /Bio library/i }).click();
    await expect(page.getByText('Ready-made bio library')).toBeVisible();
  });

  test('downloads a real poster PNG painted with the chosen font', async ({ page }) => {
    await page.goto('/hindi-poster-studio');
    await page.getByLabel('Poster text').fill('नमस्ते भारत\nज़िंदगी खूबसूरत है।');
    const downloadPromise = page.waitForEvent('download', { timeout: 30_000 });
    await page.getByRole('button', { name: /Download PNG/i }).click();
    const download = await downloadPromise;
    const stream = await download.createReadStream();
    const chunks: Buffer[] = [];
    for await (const chunk of stream) chunks.push(Buffer.from(chunk));
    const png = Buffer.concat(chunks);
    expect(png.length).toBeGreaterThan(8_000);
    // PNG signature + IHDR width/height (1080 × 1350 portrait preset).
    expect(png.subarray(1, 4).toString('ascii')).toBe('PNG');
    expect(png.readUInt32BE(16)).toBe(1080);
    expect(png.readUInt32BE(20)).toBe(1350);
  });
});

test.describe('Hindi routes at a phone width', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('the library stays readable without horizontal overflow', async ({ page }) => {
    await page.goto('/hindi-fonts');
    await expect(page.locator('[data-font-card]').first()).toBeVisible();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
    const columns = await page
      .locator('.bc-grid')
      .evaluate(element => getComputedStyle(element).gridTemplateColumns);
    expect(columns.split(' ').length).toBe(1);
    await expect(page.getByLabel('Your Hindi preview text')).toBeVisible();
  });

  test('every Hindi route fits the viewport', async ({ page }) => {
    for (const route of [
      '/hindi-fonts',
      '/hindi-fonts/kalam',
      '/hindi-font-studio',
      '/hindi-poster-studio',
      '/hindi-font-licenses',
    ]) {
      await page.goto(route);
      await expect(page.locator('main h1').first()).toBeVisible();
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `${route} overflowed by ${overflow}px`).toBeLessThanOrEqual(1);
    }
  });
});

test.describe('existing BioCraft routes still work', () => {
  test('the Google Fonts library and design studio are untouched and cross-linked', async ({ page }) => {
    await page.goto('/font-library');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Font library/i);
    const hindiLink = page.getByRole('link', { name: 'Hindi Font Library' }).first();
    await expect(hindiLink).toHaveAttribute('href', '/hindi-fonts');
    await hindiLink.click();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('हिंदी फ़ॉन्ट लाइब्रेरी');
    await page.goBack();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Font library/i);

    await page.goto('/design-studio');
    await expect(page.locator('main')).toBeVisible();
  });
});
