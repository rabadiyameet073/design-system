import { describe, it, expect } from 'vitest';
import {
  exportTailwind4,
  exportCssVars,
  exportDtcgJson,
  exportTypeScript,
  exportShadcn,
  exportFigmaTokensStudio,
  exportProjectJson
} from '../../src/utils/tokenExporters';
import { DEFAULT_DESIGN_TOKENS } from '../../src/tokens/defaultTokens';
import { DesignTokensSchema } from '../../src/tokens/types';

describe('tokenExporters pure functions', () => {
  it('generates valid Tailwind CSS 4 theme block', () => {
    const css = exportTailwind4(DEFAULT_DESIGN_TOKENS);
    expect(css).toContain('@theme inline');
    expect(css).toContain('--color-action-primary');
    expect(css).toContain('@custom-variant dark');
  });

  it('generates CSS custom properties with light and dark blocks', () => {
    const css = exportCssVars(DEFAULT_DESIGN_TOKENS);
    expect(css).toContain(':root, [data-theme="light"]');
    expect(css).toContain('.dark, [data-theme="dark"]');
    expect(css).toContain('--color-bg-default');
  });

  it('generates valid DTCG JSON with $type and $value', () => {
    const jsonStr = exportDtcgJson(DEFAULT_DESIGN_TOKENS);
    const parsed = JSON.parse(jsonStr);
    expect(parsed.color.semantic.primary.$type).toBe('color');
    expect(parsed.color.semantic.primary.$value).toBeDefined();
    expect(parsed.dimension.radius.md.$type).toBe('dimension');
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
});
