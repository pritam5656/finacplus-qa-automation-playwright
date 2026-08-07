// @ts-check
const { defineConfig, devices } = require('@playwright/test');
const { env } = require('./src/config/env');
const { timeouts } = require('./src/constants/timeouts');

// CLI has no --slow-mo; apply launch delay only for headed runs
const isHeaded = process.argv.includes('--headed');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: env.isCi,
  retries: env.isCi ? 2 : 1,
  workers: env.isCi ? 1 : undefined,
  outputDir: 'test-results',
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
  ],
  use: {
    // Artifacts on failure — no need to wait for a retry to get a trace
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: timeouts.action,
    navigationTimeout: timeouts.navigation,
    launchOptions: {
      slowMo: isHeaded ? 1000 : 0,
    },
  },
  projects: [
    {
      name: 'ui',
      testMatch: /ui\/.*\.spec\.js/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: env.demoqa.baseUrl,
        viewport: { width: 1280, height: 720 },
      },
      timeout: timeouts.uiTest,
    },
    {
      name: 'api',
      testMatch: /api\/.*\.spec\.js/,
      use: {
        baseURL: env.reqres.baseUrl,
        extraHTTPHeaders: {
          'Content-Type': 'application/json',
          // Key may be empty until .env is filled; client still validates at call time
          'x-api-key': process.env.REQRES_API_KEY || '',
        },
      },
      timeout: timeouts.apiTest,
    },
  ],
});
