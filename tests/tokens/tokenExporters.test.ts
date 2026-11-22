import { describe, it, expect } from 'vitest';
import JSZip from 'jszip';
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
import { DEFAULT_DESIGN_TOKENS } from '../../src/tokens/defaultTokens';
import { DesignTokensSchema } from '../../src/tokens/types';

describe('tokenExporters pure functions', () => {
  it('generates valid Tailwind CSS 4 theme block', () => {
    const css = exportTailwind4(DEFAULT_DESIGN_TOKENS);
    expect(css).toContain('@theme inline');
    expect(css).toContain('--color-action-primary');
    expect(css).toContain('@custom-variant dark');
    expect(css).toContain('--font-heading:');
    expect(css).toContain('--font-body:');
    expect(css).toContain('--text-base: clamp(');
    expect(css).toContain('--text-4xl: clamp(');
  });

  it('generates CSS custom properties with light and dark blocks', () => {
    const css = exportCssVars(DEFAULT_DESIGN_TOKENS);
    expect(css).toContain(':root, [data-theme="light"]');
    expect(css).toContain('.dark, [data-theme="dark"]');
    expect(css).toContain('--color-bg-default');
  });

  it('generates valid DTCG JSON with $type and $value and aliases', () => {
    const jsonStr = exportDtcgJson(DEFAULT_DESIGN_TOKENS);
    const parsed = JSON.parse(jsonStr);
    expect(parsed.color.semantic.primary.$type).toBe('color');
    expect(parsed.color.semantic.primary.$value).toBeDefined();
    expect(parsed.color.action.primary.$value).toBe('{color.brand.600}');
    expect(parsed.dimension.radius.md.$type).toBe('dimension');
    expect(parsed.dimension.space[1].$value).toBe('4px');
    expect(parsed.typography.fontSize.base.$type).toBe('dimension');
    expect(parsed.typography.fontSize.base.$value).toContain('clamp(');
    expect(parsed.typography.fontWeight.bold.$value).toBe(700);
  });

  it('generates valid TypeScript output', () => {
    const tsCode = exportTypeScript(DEFAULT_DESIGN_TOKENS);
    expect(tsCode).toContain('export const designTokens =');
    expect(tsCode).toContain('as const;');
  });

  it('generates shadcn/ui compatible theme variables', () => {
    const css = exportShadcn(DEFAULT_DESIGN_TOKENS);
    expect(css).toContain('--primary:');
    expect(css).toContain('--background:');
    expect(css).toContain('--ring:');
  });

  it('generates Figma Tokens Studio JSON structure', () => {
    const jsonStr = exportFigmaTokensStudio(DEFAULT_DESIGN_TOKENS);
    const parsed = JSON.parse(jsonStr);
    expect(parsed.global.color.brand).toBeDefined();
    expect(parsed.global.borderRadius).toBeDefined();
  });

  it('round-trip test: project JSON parses back and validates with Zod schema', () => {
    const jsonStr = exportProjectJson(DEFAULT_DESIGN_TOKENS);
    const parsed = JSON.parse(jsonStr);
    const validation = DesignTokensSchema.safeParse(parsed);
    expect(validation.success).toBe(true);
    if (validation.success) {
      expect(validation.data.schemaVersion).toBe(1);
      expect(validation.data.meta.projectName).toBe(DEFAULT_DESIGN_TOKENS.meta.projectName);
    }
  });

  it('generates a complete Starter ZIP bundle with all token formats and sample components', async () => {
    const zipBlob = await exportStarterZip(DEFAULT_DESIGN_TOKENS);
    expect(zipBlob).toBeDefined();
    expect(zipBlob.size).toBeGreaterThan(500);

    const arrayBuffer = await zipBlob.arrayBuffer();
    const unzipped = await JSZip.loadAsync(arrayBuffer);
    const filenames = Object.keys(unzipped.files);

    expect(filenames.some(f => f.includes('theme.css'))).toBe(true);
    expect(filenames.some(f => f.includes('tokens.css'))).toBe(true);
    expect(filenames.some(f => f.includes('tokens.json'))).toBe(true);
    expect(filenames.some(f => f.includes('tokens.ts'))).toBe(true);
    expect(filenames.some(f => f.includes('shadcn-theme.css'))).toBe(true);
    expect(filenames.some(f => f.includes('tokens.studio.json'))).toBe(true);
    expect(filenames.some(f => f.includes('project.dss.json'))).toBe(true);
    expect(filenames.some(f => f.includes('README.md'))).toBe(true);
    expect(filenames.some(f => f.includes('components/Button.tsx'))).toBe(true);
    expect(filenames.some(f => f.includes('components/Card.tsx'))).toBe(true);
    expect(filenames.some(f => f.includes('components/Input.tsx'))).toBe(true);
    expect(filenames.some(f => f.includes('components/Badge.tsx'))).toBe(true);
  });
});

