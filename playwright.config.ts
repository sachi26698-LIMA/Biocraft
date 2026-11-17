import { defineConfig, devices } from '@playwright/test';

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
    ...devices['Pixel 7'],
    viewport: { width: 390, height: 844 },
    permissions: ['clipboard-read', 'clipboard-write'],
    actionTimeout: 8_000,
    navigationTimeout: 30_000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
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
