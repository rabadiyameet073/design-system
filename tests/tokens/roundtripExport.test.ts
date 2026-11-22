import { describe, it, expect } from 'vitest';
import { exportProjectJson } from '../../src/utils/tokenExporters';
import { createDefaultTokens } from '../../src/tokens/defaultTokens';
import { DesignTokens, DesignTokensSchema } from '../../src/tokens/types';
import { SAMPLE_PROJECT_CERAMICS } from '../../src/data/sampleProjects';

describe('Round-Trip Export & Import Identity', () => {
  it('exports default tokens and validates schema identity on re-import', () => {
    const originalTokens = createDefaultTokens('commerce', 'ecommerce', 'Artisan Bakery');
    
    // Step 1: Export to DSS JSON
    const exportedJson1 = exportProjectJson(originalTokens);
    expect(typeof exportedJson1).toBe('string');
    expect(exportedJson1.length).toBeGreaterThan(100);

    // Step 2: Parse back
    const parsedObj = JSON.parse(exportedJson1);

    // Step 3: Validate via Zod schema
    const validation = DesignTokensSchema.safeParse(parsedObj);
    expect(validation.success).toBe(true);

    if (validation.success) {
      const validatedTokens = validation.data;

      // Verify core semantic fields identity
      expect(validatedTokens.meta.projectName).toBe(originalTokens.meta.projectName);
      expect(validatedTokens.color.semantic.light.actionPrimary).toBe(
        originalTokens.color.semantic.light.actionPrimary
      );
      expect(validatedTokens.typography.roles.heading?.family).toBe(
        originalTokens.typography.roles.heading?.family
      );
      expect(validatedTokens.radius.md).toBe(originalTokens.radius.md);

      // Step 4: Re-export validated tokens
      const exportedJson2 = exportProjectJson(validatedTokens as unknown as DesignTokens);

      // Step 5: Assert identical serialization structure
      const parsed2 = JSON.parse(exportedJson2);
      expect(parsed2.meta.projectName).toBe(parsedObj.meta.projectName);
      expect(parsed2.color.semantic.light.actionPrimary).toBe(parsedObj.color.semantic.light.actionPrimary);
      expect(parsed2.radius.md).toBe(parsedObj.radius.md);
    }
  });

  it('preserves sample project tokens through serialization round-trip', () => {
    const sampleTokens = SAMPLE_PROJECT_CERAMICS.tokens;
    const jsonStr = exportProjectJson(sampleTokens);
    const parsed = JSON.parse(jsonStr);

    const validation = DesignTokensSchema.safeParse(parsed);
    expect(validation.success).toBe(true);
    if (validation.success) {
      expect(validation.data.color.primitives.brand[600]).toBe(sampleTokens.color.primitives.brand[600]);
      expect(validation.data.typography.scale.base.css).toBe(sampleTokens.typography.scale.base.css);
    }
  });
});
