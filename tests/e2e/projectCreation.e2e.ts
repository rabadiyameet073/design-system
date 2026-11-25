import { expect, test } from '@playwright/test';
import {
  openLanding,
  readActiveProjectId,
  readStoredProjects,
} from './helpers';

test('landing -> Start designing creates exactly one new project at step 1 without sign-in', async ({
  page,
}) => {
  await openLanding(page);
  const before = await readStoredProjects(page);
  const beforeIds = new Set(before.map((project) => project.id));

  await page.getByRole('button', { name: 'Start designing' }).click();

  await expect(
    page.getByRole('heading', { name: 'What kind of website is your design system for?' }),
  ).toBeVisible();
  await expect(page.getByRole('progressbar', { name: 'Step 1 of 11 progress' })).toBeVisible();

  // Project persistence is debounced (~350ms), so wait for the write to land.
  await expect
    .poll(async () => {
      const projects = await readStoredProjects(page);
      return projects.filter((project) => !beforeIds.has(project.id)).length;
    }, { timeout: 10_000 })
    .toBe(1);

  const after = await readStoredProjects(page);
  const activeId = await readActiveProjectId(page);
  const newProjects = after.filter((project) => !beforeIds.has(project.id));

  expect(newProjects).toHaveLength(1);
  expect(activeId).toBeTruthy();
  expect(activeId).toBe(newProjects[0].id);
  expect(newProjects[0].name).toBe('My New Website');
  expect(newProjects[0].currentStep).toBe(1);
});
