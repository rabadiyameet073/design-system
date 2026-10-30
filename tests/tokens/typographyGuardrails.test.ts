import { describe, it, expect } from 'vitest';
import { auditTypographyTokens } from '../../src/tokens/typographyGuardrails';
import { TypographyTokens } from '../../src/tokens/types';
import { FontMeta } from '../../src/utils/typeScale';

describe('typographyGuardrails', () => {
  const mockFontsMap = new Map<string, FontMeta>([
    [
      'Fraunces',
      {
        family: 'Fraunces',
        category: 'serif',
        variants: ['400', '700'],
        subsets: ['latin'],
        variable: true,
        source: 'google'
      }
    ],
    [
      'DM Sans',
      {
        family: 'DM Sans',
        category: 'sans-serif',
        variants: ['400', '700'],
        subsets: ['latin'],
        variable: true,
        source: 'google'
      }
    ],
    [
      'Inter',
      {
        family: 'Inter',
        category: 'sans-serif',
        variants: ['400', '700'],
        subsets: ['latin', 'cyrillic'],
        variable: true,
        source: 'google'
      }
    ],
    [
      'Pacifico',
      {
        family: 'Pacifico',
        category: 'handwriting',
        variants: ['400'],
        subsets: ['latin'],
        variable: false,
        source: 'google'
      }
    ],
    [
      'Noto Sans Gujarati',
      {
        family: 'Noto Sans Gujarati',
        category: 'sans-serif',
        variants: ['400', '700'],
        subsets: ['latin', 'gujarati'],
        variable: true,
        source: 'google'
      }
    ],
    [
      'LightOnlyFont',
      {
        family: 'LightOnlyFont',
        category: 'sans-serif',
        variants: ['300'],
        subsets: ['latin'],
        variable: false,
        source: 'google'
      }
    ]
  ]);

  const createBaseTypography = (): TypographyTokens => ({
    scale: '1.250',
    baseSizePx: 16,
    roles: {
      display: { family: 'Fraunces', weight: '700', lineHeight: 1.15, letterSpacing: '-0.02em' },
      heading: { family: 'Fraunces', weight: '600', lineHeight: 1.25, letterSpacing: '-0.01em' },
      body: { family: 'DM Sans', weight: '400', lineHeight: 1.6, letterSpacing: '0em' },
      ui: { family: 'DM Sans', weight: '500', lineHeight: 1.4, letterSpacing: '0.01em' },
      mono: { family: 'JetBrains Mono', weight: '400', lineHeight: 1.5, letterSpacing: '0em' }
    },
    scripts: ['latin']
  });

  it('passes a well-formed typography system with no errors', () => {
    const typo = createBaseTypography();
    const result = auditTypographyTokens(typo, mockFontsMap);

    expect(result.hasErrors).toBe(false);
    expect(result.issues.filter(i => i.severity === 'error')).toHaveLength(0);
    expect(result.totalFamiliesCount).toBeLessThanOrEqual(3); // Fraunces, DM Sans, JetBrains Mono
  });

  it('flags warning when more than 2 distinct non-mono families are used', () => {
    const typo = createBaseTypography();
    typo.roles.display = { family: 'Fraunces', weight: '700', lineHeight: 1.15, letterSpacing: '0' };
    typo.roles.heading = { family: 'Inter', weight: '600', lineHeight: 1.25, letterSpacing: '0' };
    typo.roles.body = { family: 'DM Sans', weight: '400', lineHeight: 1.6, letterSpacing: '0' };

    const result = auditTypographyTokens(typo, mockFontsMap);
    const issue = result.issues.find(i => i.id === 'too-many-families');

    expect(issue).toBeDefined();
    expect(issue?.severity).toBe('warning');
  });

  it('flags warning when baseSizePx is less than 16px', () => {
    const typo = createBaseTypography();
    typo.baseSizePx = 14;

    const result = auditTypographyTokens(typo, mockFontsMap);
    const issue = result.issues.find(i => i.id === 'body-size-too-small');

    expect(issue).toBeDefined();
    expect(issue?.severity).toBe('warning');
  });

  it('flags error when handwriting or display category is used for body', () => {
    const typo = createBaseTypography();
    typo.roles.body = { family: 'Pacifico', weight: '400', lineHeight: 1.6, letterSpacing: '0' };

    const result = auditTypographyTokens(typo, mockFontsMap);
    const issue = result.issues.find(i => i.id === 'invalid-body-category');

    expect(issue).toBeDefined();
    expect(issue?.severity).toBe('error');
    expect(result.hasErrors).toBe(true);
  });

  it('flags warning when body font lacks both regular and bold weights in static font', () => {
    const typo = createBaseTypography();
    typo.roles.body = { family: 'LightOnlyFont', weight: '300', lineHeight: 1.6, letterSpacing: '0' };

    const result = auditTypographyTokens(typo, mockFontsMap);
    const issue = result.issues.find(i => i.id === 'missing-body-weights');

    expect(issue).toBeDefined();
    expect(issue?.severity).toBe('warning');
  });

  it('flags error when body font lacks a required non-latin script', () => {
    const typo = createBaseTypography();
    typo.scripts = ['latin', 'gujarati'];
    typo.roles.body = { family: 'DM Sans', weight: '400', lineHeight: 1.6, letterSpacing: '0' };

    const result = auditTypographyTokens(typo, mockFontsMap);
    const issue = result.issues.find(i => i.id === 'missing-script-gujarati');

    expect(issue).toBeDefined();
    expect(issue?.severity).toBe('error');
    expect(result.hasErrors).toBe(true);

    // Now switch to Noto Sans Gujarati which supports it
    typo.roles.body = { family: 'Noto Sans Gujarati', weight: '400', lineHeight: 1.6, letterSpacing: '0' };
    const fixedResult = auditTypographyTokens(typo, mockFontsMap);
    const fixedIssue = fixedResult.issues.find(i => i.id === 'missing-script-gujarati');
    expect(fixedIssue).toBeUndefined();
  });

  it('flags info when both heading and body are different families of the same category', () => {
    const typo = createBaseTypography();
    typo.roles.heading = { family: 'Inter', weight: '600', lineHeight: 1.25, letterSpacing: '0' };
    typo.roles.body = { family: 'DM Sans', weight: '400', lineHeight: 1.6, letterSpacing: '0' };

    const result = auditTypographyTokens(typo, mockFontsMap);
    const issue = result.issues.find(i => i.id === 'similar-categories');

    expect(issue).toBeDefined();
    expect(issue?.severity).toBe('info');
  });

  it('flags warning when estimated payload exceeds 150KB', () => {
    const typo = createBaseTypography();
    // 3 variable fonts = 3 * 70 = 210KB > 150KB
    typo.roles.display = { family: 'Fraunces', weight: '700', lineHeight: 1.15, letterSpacing: '0' };
    typo.roles.heading = { family: 'Inter', weight: '600', lineHeight: 1.25, letterSpacing: '0' };
    typo.roles.body = { family: 'DM Sans', weight: '400', lineHeight: 1.6, letterSpacing: '0' };

    const result = auditTypographyTokens(typo, mockFontsMap);
    const issue = result.issues.find(i => i.id === 'high-payload');

    expect(issue).toBeDefined();
    expect(issue?.severity).toBe('warning');
    expect(result.estimatedPayloadKb).toBeGreaterThan(150);
  });
});
