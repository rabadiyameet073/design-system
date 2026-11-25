import { defineConfig } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

export default defineConfig({
  testDir: './tests/e2e',
  // `*.e2e.ts` keeps Playwright specs out of Vitest's default *.spec.ts glob.
  testMatch: '**/*.e2e.ts',
  // Each spec drives the 11-step wizard, so allow generous per-test headroom.
  timeout: 60_000,
  expect: {
    timeout: 10_000,
    toHaveScreenshot: {
      animations: 'disabled',
      maxDiffPixelRatio: 0.02,
      caret: 'hide'
    }
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  outputDir: 'test-results',

  use: {
    baseURL: BASE_URL,
    browserName: 'chromium',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    viewport: { width: 1280, height: 800 },
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  webServer: {
    command: 'npm run dev',
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
