// playwright.config.ts
// Run: npx playwright install chromium   then   npm run test:e2e
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 45_000,
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:4321',
    // CHROME_PATH lets CI or a locked down machine point at an existing Chromium
    launchOptions: process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH, args: ['--no-sandbox'] } : {},
  },
  webServer: { command: 'npm run build && npm run preview -- --port 4321', url: 'http://localhost:4321', reuseExistingServer: true, timeout: 180_000 },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
  ],
  expect: { timeout: 25_000, toHaveScreenshot: { maxDiffPixelRatio: 0.015 } },
});
