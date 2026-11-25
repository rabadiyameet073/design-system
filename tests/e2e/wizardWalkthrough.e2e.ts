import { expect, test } from '@playwright/test';
import { advanceToStep, startNewProjectFromLanding } from './helpers';

test('Continue walks all 11 steps from Category & Genre to the Export Center', async ({ page }) => {
  await startNewProjectFromLanding(page);
  await expect(
    page.getByRole('heading', { name: 'What kind of website is your design system for?' }),
  ).toBeVisible();

  // Nine "Continue" clicks (1 -> 10), then "Proceed to Export" (10 -> 11).
  await advanceToStep(page, 11);

  await expect(page.getByRole('progressbar', { name: 'Step 11 of 11 progress' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Export your complete design system' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Finish & Export design system' })).toBeVisible();
});
