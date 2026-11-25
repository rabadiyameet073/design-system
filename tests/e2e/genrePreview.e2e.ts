import { expect, test } from '@playwright/test';
import { PREVIEW_IFRAME_SELECTOR, startNewProjectFromLanding } from './helpers';

test('Step 1: selecting Luxury Fashion & Apparel changes the live preview h1', async ({ page }) => {
  await startNewProjectFromLanding(page);

  const heroHeading = page.frameLocator(PREVIEW_IFRAME_SELECTOR).locator('h1').first();
  await expect(heroHeading).toBeVisible();
  const initialH1 = (await heroHeading.textContent())?.trim() ?? '';
  expect(initialH1.length).toBeGreaterThan(0);

  await page.getByRole('button', { name: /Luxury Fashion & Apparel/i }).click();

  // Wait for the reactive iframe to re-render with the selected genre.
  await expect
    .poll(async () => (await heroHeading.textContent())?.trim() ?? '', { timeout: 10_000 })
    .not.toBe(initialH1);

  const updatedH1 = (await heroHeading.textContent())?.trim() ?? '';
  expect(updatedH1).not.toBe(initialH1);
});
