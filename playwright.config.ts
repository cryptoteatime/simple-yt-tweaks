import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',
  fullyParallel: false,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  timeout: 30_000,
  use: {
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'unit',
      testMatch: /.*\.unit\.spec\.ts/,
    },
    {
      name: 'fixtures',
      testMatch: /.*\.fixture\.spec\.ts/,
    },
    {
      name: 'live',
      testMatch: /.*\.live\.spec\.ts/,
    },
  ],
});
