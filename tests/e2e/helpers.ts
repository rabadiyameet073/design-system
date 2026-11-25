import { expect, Page } from '@playwright/test';

export const PROJECTS_STORAGE_KEY = 'dss_projects_v1';
export const ACTIVE_PROJECT_STORAGE_KEY = 'dss_active_project_id_v1';
export const PREVIEW_IFRAME_SELECTOR = 'iframe[title="Live Reactive Template"]';

export interface StoredProject {
  id: string;
  name: string;
  currentStep: number;
  [key: string]: unknown;
}

/**
 * The demo persona has a deterministic backend id, so prior local runs could
 * otherwise leak projects into a fresh browser context via the cloud sync.
 * Keep e2e runs self-contained by stubbing the cloud project endpoints.
 */
export async function stubCloudProjectSync(page: Page): Promise<void> {
  await page.route('**/api/user/projects', (route) => {
    const body =
      route.request().method() === 'GET'
        ? { success: true, userId: 'e2e-demo', projects: [], count: 0 }
        : { success: true };
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(body),
    });
  });
  await page.route('**/api/user/projects/sync', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, count: 0 }),
    }),
  );
}

export async function readStoredProjects(page: Page): Promise<StoredProject[]> {
  return page.evaluate((key) => {
    try {
      const raw = window.localStorage.getItem(key);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, PROJECTS_STORAGE_KEY);
}

export async function readActiveProjectId(page: Page): Promise<string | null> {
  return page.evaluate((key) => window.localStorage.getItem(key), ACTIVE_PROJECT_STORAGE_KEY);
}

export async function openLanding(page: Page): Promise<void> {
  await stubCloudProjectSync(page);
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Start designing' })).toBeVisible();
}

export async function expectStepOne(page: Page): Promise<void> {
  await expect(
    page.getByRole('heading', { name: 'What kind of website is your design system for?' }),
  ).toBeVisible();
  await expect(page.getByRole('progressbar', { name: 'Step 1 of 11 progress' })).toBeVisible();
}

/** Landing -> Start designing -> freshly created local project at step 1 (no account required). */
export async function startNewProjectFromLanding(page: Page): Promise<void> {
  await openLanding(page);
  await page.getByRole('button', { name: 'Start designing' }).click();
  await expectStepOne(page);
}

/** Click Continue (and Proceed to Export) until `targetStep` is reached. */
export async function advanceToStep(page: Page, targetStep: number): Promise<void> {
  for (let current = 1; current < targetStep; current += 1) {
    const buttonName = current === 10 ? 'Proceed to Export' : 'Continue';
    await page.getByRole('button', { name: buttonName, exact: true }).click();
    await expect(
      page.getByRole('progressbar', { name: `Step ${current + 1} of 11 progress` }),
    ).toBeVisible();
  }
}

export async function gotoExportCenter(page: Page): Promise<void> {
  await startNewProjectFromLanding(page);
  await advanceToStep(page, 11);
  await expect(page.getByRole('heading', { name: 'Export your complete design system' })).toBeVisible();
}
