import { defineConfig, devices } from '@playwright/test';

// Browser binaries are normally downloaded by `npx playwright install`. In a
// restricted-egress sandbox that download is unavailable, so an operator can
// point the suite at a Chromium that already exists:
//
//   node scripts/prepare-headless-chromium.mjs
//   PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/tmp/chromium \
//   LD_LIBRARY_PATH=/tmp/quickkit-chromium/lib npx playwright test
//
// The variable is optional and unset in CI, where Playwright's own browser is used.
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 60_000,
  expect: { timeout: 8_000 },
  outputDir: 'phase4-artifacts/test-results',
  reporter: [
    ['list'],
    ['html', { outputFolder: 'phase4-artifacts/playwright-report', open: 'never' }],
    ['json', { outputFile: 'phase4-artifacts/playwright-results.json' }],
  ],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    browserName: 'chromium',
    headless: true,
    launchOptions: executablePath ? { executablePath, args: ['--no-sandbox', '--disable-dev-shm-usage'] } : {},
    ...devices['Pixel 7'],
    viewport: { width: 390, height: 844 },
    permissions: ['clipboard-read', 'clipboard-write'],
    actionTimeout: 8_000,
    navigationTimeout: 30_000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    // A custom executable (above) comes without Playwright's ffmpeg, so video
    // recording would fail context creation instead of recording anything.
    video: executablePath ? 'off' : 'retain-on-failure',
  },
  webServer: {
    command: 'npm run build && npm run preview -- --host 127.0.0.1 --port 4173 --strictPort',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
