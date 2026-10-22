import { defineConfig, devices } from '@playwright/test';
import { appBaseURL } from './src/config';

const browserProjects = [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  { name: 'webkit', use: { ...devices['Desktop Safari'] } },
] as const;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
  ],
  timeout: 180_000,
  expect: {
    timeout: 20_000,
  },
  use: {
    baseURL: appBaseURL,
    navigationTimeout: 60_000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
    },
    ...browserProjects.map((browser) => ({
      name: `${browser.name}-login`,
      testMatch: /login\.spec\.ts/,
      use: browser.use,
    })),
    ...browserProjects.map((browser) => ({
      name: browser.name,
      dependencies: ['setup'],
      testIgnore: [/auth\.setup\.ts/, /login\.spec\.ts/],
      use: browser.use,
    })),
  ],
});
