import { expect, test } from '@playwright/test';
import { PREVIEW_IFRAME_SELECTOR, startNewProjectFromLanding } from './helpers';

test.describe('Mobile wizard (390px)', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('Questions/Live Site dock is visible with no horizontal overflow', async ({ page }) => {
    await startNewProjectFromLanding(page);

    const questionsDock = page.getByRole('button', { name: /Questions \(1\/11\)/ });
    const liveSiteDock = page.getByRole('button', { name: /Live Site/ });
    await expect(questionsDock).toBeVisible();
    await expect(liveSiteDock).toBeVisible();

    const horizontalOverflow = () =>
      page.evaluate(() => {
        const doc = document.documentElement;
        return Math.max(doc.scrollWidth, document.body.scrollWidth) - doc.clientWidth;
      });

    expect(await horizontalOverflow()).toBeLessThanOrEqual(1);

    // The Live Site tab must also fit without introducing a sideways scroll.
    await liveSiteDock.click();
    await expect(page.locator(PREVIEW_IFRAME_SELECTOR)).toBeVisible();
    expect(await horizontalOverflow()).toBeLessThanOrEqual(1);
  });
});
