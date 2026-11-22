import { describe, it, expect } from 'vitest';
import { auditTypographyTokens } from '../../src/tokens/typographyGuardrails';
import { TypographyTokens } from '../../src/tokens/types';
import { FontMeta } from '../../src/utils/typeScale';
import { createDefaultTokens } from '../../src/tokens/defaultTokens';

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

  const createBaseTypography = (): TypographyTokens => {
    const base = createDefaultTokens().typography;
    return {
      ...base,
      baseSizePx: 16,
      roles: {
        ...base.roles,
        display: { family: 'Fraunces', fallback: ['serif'], weight: 700, lineHeight: 1.15, letterSpacing: '-0.02em' },
        heading: { family: 'Fraunces', fallback: ['serif'], weight: 600, lineHeight: 1.25, letterSpacing: '-0.01em' },
        body: { family: 'DM Sans', fallback: ['sans-serif'], weight: 400, lineHeight: 1.6, letterSpacing: '0em' },
        ui: { family: 'DM Sans', fallback: ['sans-serif'], weight: 500, lineHeight: 1.4, letterSpacing: '0.01em' },
        mono: { family: 'JetBrains Mono', fallback: ['monospace'], weight: 400, lineHeight: 1.5, letterSpacing: '0em' },
        accent: null
      },
      scripts: ['latin']
    };
  };

  it('passes a well-formed typography system with no errors', () => {
    const typo = createBaseTypography();
    const result = auditTypographyTokens(typo, mockFontsMap);

    expect(result.hasErrors).toBe(false);
    expect(result.issues.filter(i => i.severity === 'error')).toHaveLength(0);
    expect(result.totalFamiliesCount).toBeLessThanOrEqual(3); // Fraunces, DM Sans, JetBrains Mono
  });

  it('flags warning when more than 2 distinct non-mono families are used', () => {
    const typo = createBaseTypography();
    typo.roles.display = { family: 'Fraunces', fallback: ['serif'], weight: 700, lineHeight: 1.15, letterSpacing: '0' };
    typo.roles.heading = { family: 'Inter', fallback: ['sans-serif'], weight: 600, lineHeight: 1.25, letterSpacing: '0' };
    typo.roles.body = { family: 'DM Sans', fallback: ['sans-serif'], weight: 400, lineHeight: 1.6, letterSpacing: '0' };

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
    typo.roles.body = { family: 'Pacifico', fallback: ['cursive'], weight: 400, lineHeight: 1.6, letterSpacing: '0' };

    const result = auditTypographyTokens(typo, mockFontsMap);
    const issue = result.issues.find(i => i.id === 'invalid-body-category');

    expect(issue).toBeDefined();
    expect(issue?.severity).toBe('error');
    expect(result.hasErrors).toBe(true);
  });

  it('flags warning when body font lacks both regular and bold weights in static font', () => {
    const typo = createBaseTypography();
    typo.roles.body = { family: 'LightOnlyFont', fallback: ['sans-serif'], weight: 300, lineHeight: 1.6, letterSpacing: '0' };

    const result = auditTypographyTokens(typo, mockFontsMap);
    const issue = result.issues.find(i => i.id === 'missing-body-weights');

    expect(issue).toBeDefined();
    expect(issue?.severity).toBe('warning');
  });

  it('flags error when body font lacks a required non-latin script', () => {
    const typo = createBaseTypography();
    typo.scripts = ['latin', 'gujarati'];
    typo.roles.body = { family: 'DM Sans', fallback: ['sans-serif'], weight: 400, lineHeight: 1.6, letterSpacing: '0' };

    const result = auditTypographyTokens(typo, mockFontsMap);
    const issue = result.issues.find(i => i.id === 'missing-script-gujarati');

    expect(issue).toBeDefined();
    expect(issue?.severity).toBe('error');
    expect(result.hasErrors).toBe(true);

    // Now switch to Noto Sans Gujarati which supports it
    typo.roles.body = { family: 'Noto Sans Gujarati', fallback: ['sans-serif'], weight: 400, lineHeight: 1.6, letterSpacing: '0' };
    const fixedResult = auditTypographyTokens(typo, mockFontsMap);
    const fixedIssue = fixedResult.issues.find(i => i.id === 'missing-script-gujarati');
    expect(fixedIssue).toBeUndefined();
  });

  it('flags info when both heading and body are different families of the same category', () => {
    const typo = createBaseTypography();
    typo.roles.heading = { family: 'Inter', fallback: ['sans-serif'], weight: 600, lineHeight: 1.25, letterSpacing: '0' };
    typo.roles.body = { family: 'DM Sans', fallback: ['sans-serif'], weight: 400, lineHeight: 1.6, letterSpacing: '0' };

    const result = auditTypographyTokens(typo, mockFontsMap);
    const issue = result.issues.find(i => i.id === 'similar-categories');

    expect(issue).toBeDefined();
    expect(issue?.severity).toBe('info');
  });

  it('flags warning when estimated payload exceeds 150KB', () => {
    const typo = createBaseTypography();
    // 3 variable fonts = 3 * 70 = 210KB > 150KB
    typo.roles.display = { family: 'Fraunces', fallback: ['serif'], weight: 700, lineHeight: 1.15, letterSpacing: '0' };
    typo.roles.heading = { family: 'Inter', fallback: ['sans-serif'], weight: 600, lineHeight: 1.25, letterSpacing: '0' };
    typo.roles.body = { family: 'DM Sans', fallback: ['sans-serif'], weight: 400, lineHeight: 1.6, letterSpacing: '0' };

    const result = auditTypographyTokens(typo, mockFontsMap);
    const issue = result.issues.find(i => i.id === 'high-payload');

    expect(issue).toBeDefined();
    expect(issue?.severity).toBe('warning');
    expect(result.estimatedPayloadKb).toBeGreaterThan(150);
  });

  it('flags warning when total font files exceeds 6 (Doc 03 §8)', () => {
    const customMap = new Map(mockFontsMap);
    // Add 4 static fonts with multiple weights
    customMap.set('Static1', { family: 'Static1', category: 'serif', variants: ['400', '700'], subsets: ['latin'], variable: false, source: 'google' });
    customMap.set('Static2', { family: 'Static2', category: 'sans-serif', variants: ['400', '600', '700'], subsets: ['latin'], variable: false, source: 'google' });
    customMap.set('Static3', { family: 'Static3', category: 'sans-serif', variants: ['400', '500'], subsets: ['latin'], variable: false, source: 'google' });
    customMap.set('Static4', { family: 'Static4', category: 'monospace', variants: ['400'], subsets: ['latin'], variable: false, source: 'google' });

    const typo = createBaseTypography();
    typo.roles.display = { family: 'Static1', fallback: ['serif'], weight: 700, lineHeight: 1.15, letterSpacing: '0' };
    typo.roles.heading = { family: 'Static2', fallback: ['sans-serif'], weight: 600, lineHeight: 1.25, letterSpacing: '0' };
    typo.roles.body = { family: 'Static3', fallback: ['sans-serif'], weight: 400, lineHeight: 1.6, letterSpacing: '0' }; // body adds 400 and 700
    typo.roles.ui = { family: 'Static2', fallback: ['sans-serif'], weight: 500, lineHeight: 1.4, letterSpacing: '0' }; // adds 500 to Static2
    typo.roles.accent = { family: 'Static1', fallback: ['serif'], weight: 400, lineHeight: 1.2, letterSpacing: '0' }; // adds 400 to Static1
    typo.roles.mono = { family: 'Static4', fallback: ['monospace'], weight: 400, lineHeight: 1.5, letterSpacing: '0' };

    const result = auditTypographyTokens(typo, customMap);
    const issue = result.issues.find(i => i.id === 'total-font-files');

    expect(issue).toBeDefined();
    expect(issue?.severity).toBe('warning');
    expect(issue?.message).toBe('Consider fewer weights/styles to keep the page fast.');
    expect(result.totalFontFiles).toBeGreaterThan(6);
  });
});
