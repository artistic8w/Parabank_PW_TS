import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, 'env/.env.qa'), quiet: true });

export default defineConfig({
  testDir: '../tests',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,

  reporter: [
    ['list'],
    ['html', { outputFolder: '../reports/html-report', open: 'never' }],
    ['allure-playwright', { resultsDir: '../reports/allure-results' }],
  ],

  use: {
    baseURL: process.env.BASE_URL || 'https://parabank.parasoft.com/parabank/',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
  },

  projects: [
    {
      name: 'chromium',
      testIgnore: '**/api/**',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      testIgnore: '**/api/**',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      testIgnore: '**/api/**',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'api',
      testDir: '../tests/api',
      use: {
        baseURL: process.env.API_BASE_URL || 'https://parabank.parasoft.com/parabank/services/bank/',
      },
    },
  ],

  outputDir: '../reports/test-results',
});