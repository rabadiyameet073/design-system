import AxeBuilder from '@axe-core/playwright';
import { expect, Page, test } from '@playwright/test';
import { openLanding, PREVIEW_IFRAME_SELECTOR, startNewProjectFromLanding } from './helpers';

// axe injects into every frame twice per test (light + dark preview).
test.setTimeout(120_000);

const SERIOUS_OR_CRITICAL = ['serious', 'critical'];

async function expectNoSeriousOrCritical(page: Page, label: string): Promise<void> {
  // axe-core automatically injects into same-origin frames, so the wizard scan
  // covers both the studio chrome and the live preview iframe.
  const results = await new AxeBuilder({ page }).analyze();
  const violations = results.violations.filter(
    (violation) => violation.impact && SERIOUS_OR_CRITICAL.includes(violation.impact),
  );
  const summary = violations.map(
    (violation) => `${violation.id}: ${violation.help} [${violation.nodes.map((n) => n.target.join(' ')).join(', ')}]`,
  );
  expect(summary, `${label}: serious/critical axe violations`).toEqual([]);
}

test('landing page has no serious or critical axe violations', async ({ page }) => {
  await openLanding(page);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  const preview = page.locator(PREVIEW_IFRAME_SELECTOR);
  if (await preview.count() > 0) {
    await preview.first().waitFor({ state: 'visible' });
    await page.waitForTimeout(600);
  }
  await expectNoSeriousOrCritical(page, 'landing (light)');
});

test('wizard preview iframe has no serious or critical axe violations in light and dark', async ({
  page,
}) => {
  await startNewProjectFromLanding(page);
  const previewHeading = page.frameLocator(PREVIEW_IFRAME_SELECTOR).locator('h1').first();
  await expect(previewHeading).toBeVisible();

  await expectNoSeriousOrCritical(page, 'wizard preview (light)');

  // Preview toolbar "Toggle Light / Dark Ambient Theme" button.
  await page.getByRole('button', { name: /^(Light|Dark)$/ }).click();
  await expect(page.getByRole('button', { name: 'Dark', exact: true })).toBeVisible();
  await expectNoSeriousOrCritical(page, 'wizard preview (dark)');
});
