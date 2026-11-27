// tests/smoke.spec.ts
import { test, expect } from '@playwright/test';

const pages = ['/', '/privacy/', '/bespoke-sewing/', '/ready-to-wear/', '/jewellery/', '/sunglasses/', '/about/', '/lookbook/', '/contact/', '/offline/'];

for (const path of pages) {
  test(`loads cleanly: ${path}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.route('https://open.er-api.com/**', (r) => r.fulfill({ json: { result: 'success', rates: { NGN: 1500, GBP: 0.78, EUR: 0.92 } } }));
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    await page.goto(path);
    await expect(page.locator('h1').first()).toBeAttached();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
    expect(errors).toEqual([]);
  });
}

test('theme toggle switches and persists across pages', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'ivory');
  await page.locator('[data-theme-toggle]').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'navy');
  await page.goto('/about/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'navy');
});

test('enquiry drawer validates, then prefills from a piece card', async ({ page }) => {
  await page.goto('/bespoke-sewing/');
  await page.locator('[data-piece]').first().click();
  const drawer = page.locator('[data-drawer]');
  await expect(drawer).toHaveClass(/open/);
  await expect(drawer.locator('textarea[name=message]')).toHaveValue(/I would like to ask about/);
  await drawer.locator('button[type=submit]').click();
  await expect(drawer.locator('#e-name')).toBeVisible();
  await expect(drawer.locator('input[name=name]')).toHaveAttribute('aria-invalid', 'true');
  await page.keyboard.press('Escape');
  await expect(drawer).not.toHaveClass(/open/);
});

test('whatsapp link carries the right number', async ({ page }) => {
  await page.goto('/contact/');
  await expect(page.locator('main a[href^="https://wa.me/2347032852990"]').first()).toBeVisible();
});

test('lookbook filter and viewer', async ({ page }) => {
  await page.goto('/lookbook/');
  await page.locator('[data-filter="jewellery"]').click();
  await expect(page.locator('[data-look]:not([hidden])')).toHaveCount(2);
  await page.locator('[data-look]:not([hidden])').first().click();
  await expect(page.locator('[data-viewer]')).toHaveClass(/open/);
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-viewer]')).not.toHaveClass(/open/);
});

test('menu opens, every collection is reachable, and clicking one navigates', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-menu-btn]').click();
  await expect(page.locator('[data-menu]')).toHaveClass(/open/);
  for (const href of ['/bespoke-sewing', '/ready-to-wear', '/jewellery', '/sunglasses', '/about', '/lookbook', '/contact']) {
    await expect(page.locator(`[data-menu] a[href="${href}"]`)).toBeVisible();
  }
  await page.locator('[data-menu] a[href="/jewellery"]').click();
  await expect(page).toHaveURL(/\/jewellery\/?$/);
  await expect(page.locator('h1')).toContainText('Small things');
  await expect(page.locator('.piece')).toHaveCount(6);
});

test('home hero shows the four collections and cards', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.svc a')).toHaveCount(4);
  await expect(page.locator('[data-cluster="left"] [data-card]').first()).toBeAttached();
  await page.locator('.svc a[href="/sunglasses"]').click();
  await expect(page).toHaveURL(/\/sunglasses\/?$/);
});

test('piece quick view opens, shows the piece, and hands off to the enquiry form', async ({ page }) => {
  await page.goto('/jewellery/');
  await page.locator('[data-piece-open]').first().click();
  const pm = page.locator('[data-pm]');
  await expect(pm).toHaveClass(/open/);
  await expect(pm.locator('[data-pm-name]')).toHaveText('Statement earrings');
  await pm.locator('[data-pm-next]').click();
  await expect(pm.locator('[data-pm-name]')).toHaveText('Layered necklaces');
  await expect(pm.locator('[data-pm-wa]')).toHaveAttribute('href', /wa\.me\/2347032852990\?text=.*Layered/);
  await pm.locator('[data-pm-ask]').click();
  await expect(page.locator('[data-drawer]')).toHaveClass(/open/);
  await expect(page.locator('[data-drawer] textarea[name=message]')).toHaveValue(/Layered necklaces/);
});

test('AI and search files exist', async ({ request }) => {
  for (const f of ['/robots.txt', '/llms.txt', '/llms-full.txt', '/catalogue.json', '/sitemap.xml']) {
    const r = await request.get(f); expect(r.status(), f).toBe(200);
  }
  expect(await (await request.get('/robots.txt')).text()).toContain('ClaudeBot');
  expect(JSON.parse(await (await request.get('/catalogue.json')).text()).collections).toHaveLength(4);
});

const places: [string, string, string, RegExp][] = [['Europe/London', 'en-GB', 'GBP', /£/], ['Asia/Tokyo', 'ja-JP', 'JPY', /[¥￥]/], ['America/New_York', 'en-US', 'USD', /\$/], ['Europe/Berlin', 'de-DE', 'EUR', /€/], ['Asia/Shanghai', 'zh-CN', 'CNY', /¥/]];
for (const [tz, locale, code, symbol] of places) {
  test.describe(`prices for ${code}`, () => {
    test.use({ timezoneId: tz, locale });
    test(`shows ${code}`, async ({ page }) => {
      await page.route('https://open.er-api.com/**', (r) => r.abort());
      await page.goto('/jewellery/');
      await expect(page.locator('html')).toHaveAttribute('data-currency', code);
      await expect(page.locator('.piece .price').first()).toHaveText(symbol);
      await expect(page.locator('[data-piece-open] img').first()).toBeAttached(); // prices must never replace the photos
    });
  });
}

test('currency can be changed by hand and is remembered', async ({ page }) => {
  await page.route('https://open.er-api.com/**', (r) => r.abort());
  await page.goto('/ready-to-wear/');
  await page.locator('#pieces').scrollIntoViewIfNeeded();
  await page.locator('#pieces [data-currency]').selectOption('AED');
  await expect(page.locator('.piece .price').first()).toContainText(/AED|د\.إ/);
  await page.goto('/jewellery/');
  await expect(page.locator('html')).toHaveAttribute('data-currency', 'AED');
});

test('the tape measure crosses the page', async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('pl', '1'));
  await page.goto('/');
  await expect(page.locator('[data-tape-cross] svg')).toBeAttached();
  await expect.poll(async () => page.locator('[data-tape-cross] #tcBase').getAttribute('d'), { timeout: 12_000 }).not.toBeNull();
});
