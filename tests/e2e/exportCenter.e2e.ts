import { expect, test } from '@playwright/test';
import { gotoExportCenter } from './helpers';

test.describe('Export Center', () => {
  test.use({ permissions: ['clipboard-read', 'clipboard-write'] });

  test('validation gate, copy shareable link and starter ZIP download smoke', async ({ page }) => {
    await gotoExportCenter(page);

    // The pre-export gate is always rendered: either cleared or listing failing pairs.
    await expect(page.getByText(/Pre-Export (Verification Passed|Accessibility Notice)/i)).toBeVisible();

    // A fresh project can start with one failing default pair; the gate blocks the
    // production ZIP until it is fixed, so exercise the auto-fix before downloading.
    const autoFix = page.getByRole('button', { name: 'Auto-Fix All Ratios' });
    if (await autoFix.isVisible()) {
      await autoFix.click();
      await expect(page.getByText(/Pre-Export Verification Passed/i)).toBeVisible();
    }

    const copyLinkButton = page.getByRole('button', { name: 'Copy Shareable Preview Link' });
    await copyLinkButton.click();
    await expect(page.getByRole('button', { name: /Link Copied to Clipboard/i })).toBeVisible();
    await expect(page.getByText('Shareable hosted preview URL copied to clipboard!')).toBeVisible();

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download Starter ZIP' }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/starter\.zip$/);
  });
});
