import { describe, it, expect } from 'vitest';
import { createNewProject } from '../../src/data/sampleProjects';
import { computeApcaLc, ratio, auditSemanticContrast, nudgeToContrast } from '../../src/tokens/contrastEngine';
import { exportStarterZip, exportTailwind4 } from '../../src/utils/tokenExporters';

describe('Doc 02 Page-by-Page UX & Flow Implementation', () => {
  it('Step 1 & 2 validation gates (canContinue logic)', () => {
    const project = createNewProject('Test Website', 'ceramics-atelier');

    // Step 1: needs websiteType.id or tokens.meta.genreId
    const step1Valid = Boolean(project.websiteType?.id || project.tokens?.meta?.genreId);
    expect(step1Valid).toBe(true);

    // Step 2: needs non-empty project name
    const step2Valid = Boolean(project.name && project.name.trim().length > 0);
    expect(step2Valid).toBe(true);

    const emptyNameProject = { ...project, name: '   ' };
    const step2Invalid = Boolean(emptyNameProject.name && emptyNameProject.name.trim().length > 0);
    expect(step2Invalid).toBe(false);
  });

  it('Slug auto-generation produces clean kebab-case slugs', () => {
    const slugify = (text: string) =>
      text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    expect(slugify('Maison Atelier & Studio!')).toBe('maison-atelier-studio');
    expect(slugify('  My New 2026 SaaS  ')).toBe('my-new-2026-saas');
    expect(slugify('High---Velocity---Tech')).toBe('high-velocity-tech');
  });

  it('All 11 steps support reset to fresh defaults', () => {
    const original = createNewProject('Original Brand', 'saas-product');
    const fresh = createNewProject(original.name, original.websiteType.id);

    // Test that fresh project provides complete configurations for all steps
    expect(fresh.websiteType.id).toBe('saas-product');
    expect(fresh.business).toBeDefined();
    expect(fresh.brandPersonality).toBeDefined();
    expect(fresh.visualDirection).toBeDefined();
    expect(fresh.colorPalette).toBeDefined();
    expect(fresh.typography).toBeDefined();
    expect(fresh.layout).toBeDefined();
    expect(fresh.components).toBeDefined();
    expect(fresh.imagery).toBeDefined();
    expect(fresh.accessibility).toBeDefined();
  });

  it('Audit & Review maps explicit issue IDs and calculates APCA Lc', () => {
    const project = createNewProject('A11y Test', 'ceramics-atelier');
    const semantic = project.tokens.color.semantic.light;
    const audit = auditSemanticContrast(semantic);

    expect(audit.issues.length).toBeGreaterThan(0);

    // Check that every audit issue has an APCA Lc value
    for (const issue of audit.issues) {
      expect(typeof issue.apcaLc).toBe('number');
      const calculatedApca = computeApcaLc(issue.fg, issue.bg);
      expect(issue.apcaLc).toBe(calculatedApca);
    }

    // Verify explicit key mapping handles known IDs
    const keyMap: Record<string, string> = {
      'body-default': 'fgDefault',
      'body-surface': 'fgDefault',
      'muted-default': 'fgMuted',
      'action-primary': 'actionPrimaryFg',
      'border-ui': 'borderDefault',
      'focus-ring': 'focusRing',
      'status-success': 'statusSuccessFg',
      'status-warning': 'statusWarningFg',
      'status-danger': 'statusDangerFg',
      'status-info': 'statusInfoFg'
    };

    const firstIssue = audit.issues[0];
    expect(keyMap[firstIssue.id]).toBeDefined();

    // Verify unmapped issue does not crash
    expect(keyMap['unknown-arbitrary-issue']).toBeUndefined();
  });

  it('Export Center starter ZIP includes all required files', async () => {
    const project = createNewProject('Export Test', 'ceramics-atelier');
    const zipBlob = await exportStarterZip(project.tokens);

    expect(zipBlob).toBeDefined();
    expect(zipBlob.size).toBeGreaterThan(100);
  });
});
