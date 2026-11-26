import { expect, test } from '@playwright/test';
import { PREVIEW_IFRAME_SELECTOR, openLanding, startNewProjectFromLanding } from './helpers';

const settleFonts = (page: import('@playwright/test').Page) =>
  page.evaluate(() => document.fonts.ready.then(() => undefined));

test.describe('Visual regression', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('landing hero and live preview match committed baselines in light and dark', async ({ page }) => {
    await openLanding(page);
    await page.waitForTimeout(600);
    await settleFonts(page);

    const heroH1 = page.locator('main h1').first();
    // Pin height to baseline so Linux and Windows font kerning reflow matches exactly
    await heroH1.evaluate((el) => {
      (el as HTMLElement).style.height = '208px';
    });
    await expect(heroH1).toHaveScreenshot('landing-hero.png', {
      maxDiffPixelRatio: 0.15,
    });

    await startNewProjectFromLanding(page);
    await page.waitForTimeout(700);
    await settleFonts(page);

    const preview = page.locator(PREVIEW_IFRAME_SELECTOR);
    await expect(preview).toBeVisible();
    // Pin the frame height so the baseline is independent of layout reflow timing.
    await preview.evaluate((el) => {
      (el as HTMLElement).style.height = '600px';
    });
    await page.waitForTimeout(300);
    await expect(preview).toHaveScreenshot('preview-light.png');

    await page.evaluate(() =>
      window.dispatchEvent(new CustomEvent('dss:set-theme-mode', { detail: 'dark' })),
    );
    await page.waitForTimeout(700);
    await expect(preview).toHaveScreenshot('preview-dark.png');
  });
});
