// tests/visual.spec.ts
// Baselines: npx playwright test visual --update-snapshots   (commit the result)
// Check:     npx playwright test visual
// Motion is frozen with reduced motion, and the live clocks are hidden, so images are stable.
import { test, expect } from '@playwright/test';

const pages = ['/', '/bespoke-sewing/', '/jewellery/', '/about/', '/lookbook/', '/contact/'];
test.use({ reducedMotion: 'reduce' });

for (const theme of ['ivory', 'navy']) {
  for (const path of pages) {
    test(`visual ${theme} ${path}`, async ({ page }) => {
      await page.addInitScript((t) => localStorage.setItem('theme', t), theme);
      await page.goto(path);
      await page.addStyleTag({ content: '[data-cluster], .tape, .wa-fab, body::after { visibility: hidden !important; }' });
      // load every lazy image first, or the page height changes between captures
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 70)); }
        window.scrollTo(0, 0); await document.fonts.ready;
      });
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);
      await expect(page).toHaveScreenshot(`${theme}-${path.replace(/\W+/g, '_') || 'home'}.png`, { fullPage: true });
    });
  }
}
