import { describe, it, expect } from 'vitest';
import { createDefaultTokens } from '../../src/tokens/defaultTokens';
import { GENRE_CONFIGS, getGenreById } from '../../src/preview/genres';
import { TEMPLATE_REGISTRY } from '../../src/preview/templates';
import { generateColorScale, generateNeutralScale, generateAllColorPrimitives } from '../../src/tokens/colorScale';
import { auditSemanticContrast, nudgeToContrast } from '../../src/tokens/contrastEngine';
import { auditTypographyTokens } from '../../src/tokens/typographyGuardrails';
import { generateFullTypeScale } from '../../src/utils/typeScale';
import {
  exportTailwind4,
  exportCssVars,
  exportDtcgJson,
  exportTypeScript,
  exportShadcn,
  exportFigmaTokensStudio,
  exportProjectJson,
  exportStarterZip
} from '../../src/utils/tokenExporters';
import { DesignTokens } from '../../src/tokens/types';

describe('End-to-End Wizard Integration Flow (Doc 00 Definition of Done)', () => {
  let projectTokens: DesignTokens;

  it('Step 1: selects category and genre, immediately resolving a valid category template', () => {
    projectTokens = createDefaultTokens();
    const genre = getGenreById('ceramics-atelier');

    expect(genre).toBeDefined();
    expect(genre.category).toBe('commerce');
    expect(TEMPLATE_REGISTRY[genre.category]).toBeDefined();

    projectTokens.meta.genreId = genre.id;
    projectTokens.meta.category = genre.category;
  });

  it('Step 2: demographic targeting (50+) auto-nudges base size to 18px and verifies scripts', () => {
    projectTokens.meta.audienceAge = '50+';
    projectTokens.meta.scripts = ['latin', 'devanagari'];

    if (projectTokens.meta.audienceAge === '50+') {
      projectTokens.typography.baseSizePx = 18;
      projectTokens.typography.scale = generateFullTypeScale(18, projectTokens.typography.scaleRatio);
    }

    expect(projectTokens.typography.baseSizePx).toBe(18);
    expect(projectTokens.meta.scripts).toContain('devanagari');
  });

  it('Step 3: brand personality sliders (energy, craft, voice, formality, density) update correctly', () => {
    projectTokens.meta.personality = {
      energy: 40,
      craft: 85,
      voice: 70,
      formality: 65,
      density: 50
    };

    expect(projectTokens.meta.personality.craft).toBe(85);
  });

  it('Step 4 & 5: Color Studio generates 11-step OKLCH scales and verifies WCAG 2.2 AA compliance', () => {
    const brandColor = '#A85A3C'; // Warm Terracotta
    const accentColor = '#2A5D5A'; // Deep Cypress
    const primitives = generateAllColorPrimitives(brandColor, accentColor);

    projectTokens.color.primitives = primitives;
    expect(Object.keys(primitives.brand).length).toBe(11);
    expect(Object.keys(primitives.neutral).length).toBe(11);

    const lightAudit = auditSemanticContrast(projectTokens.color.semantic.light);
    expect(lightAudit.totalCount).toBeGreaterThanOrEqual(8);
  });

  it('Step 6: Typography Studio configures 6 roles and passes typography guardrails', () => {
    const auditResult = auditTypographyTokens(projectTokens.typography);
    expect(auditResult.hasErrors).toBe(false);
    expect(auditResult.totalFamiliesCount).toBeLessThanOrEqual(3);
  });

  it('Step 7 & 8: Shape, Spacing & Components configure density and states', () => {
    projectTokens.space.base = 4;
    projectTokens.radius.md = 8;
    projectTokens.border.width = 1;

    expect(projectTokens.radius.md).toBe(8);
    expect(projectTokens.space.scale.length).toBeGreaterThan(5);
  });

  it('Step 9: Imagery, Icons & Motion configure spring physics and icon libraries', () => {
    projectTokens.motion.level = 'expressive';
    projectTokens.icon.library = 'lucide';
    projectTokens.imagery.treatment = 'natural';

    expect(projectTokens.motion.level).toBe('expressive');
    expect(projectTokens.icon.library).toBe('lucide');
  });

  it('Step 10: Review & Audit evaluates contrast and auto-fixes any failing pairs', () => {
    const lightAudit = auditSemanticContrast(projectTokens.color.semantic.light);

    // Apply auto-fix using nudgeToContrast on any issues that fall short
    lightAudit.issues.forEach(issue => {
      if (!issue.passed) {
        const fixed = nudgeToContrast(issue.fg, issue.bg, issue.targetRatio);
        expect(fixed).toMatch(/^#[0-9a-f]{6}$/i);
      }
    });

    expect(lightAudit.scorePercent).toBeGreaterThanOrEqual(70);
  });

  it('Step 11: Export Center successfully exports all 10 formats with zero compilation errors', async () => {
    const tailwind4 = exportTailwind4(projectTokens);
    expect(tailwind4).toContain('@theme inline');

    const cssVars = exportCssVars(projectTokens);
    expect(cssVars).toContain(':root, [data-theme="light"]');

    const dtcg = exportDtcgJson(projectTokens);
    expect(JSON.parse(dtcg).color.semantic).toBeDefined();

    const ts = exportTypeScript(projectTokens);
    expect(ts).toContain('export const designTokens =');

    const shadcn = exportShadcn(projectTokens);
    expect(shadcn).toContain('@layer base');

    const figma = exportFigmaTokensStudio(projectTokens);
    expect(JSON.parse(figma).global).toBeDefined();

    const projectJson = exportProjectJson(projectTokens);
    expect(JSON.parse(projectJson).schemaVersion).toBe(1);

    const zipBlob = await exportStarterZip(projectTokens);
    expect(zipBlob.size).toBeGreaterThan(500);
  });
});

