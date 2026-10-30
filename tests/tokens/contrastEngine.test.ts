import { describe, it, expect } from 'vitest';
import { ratio, grade, nudgeToContrast, auditSemanticContrast } from '../../src/tokens/contrastEngine';
import { createDefaultTokens } from '../../src/tokens/defaultTokens';

describe('WCAG 2.2 Contrast Engine', () => {
  it('correctly calculates known contrast ratios', () => {
    const blackOnWhite = ratio('#000000', '#FFFFFF');
    expect(Math.round(blackOnWhite)).toBe(21);

    const sameColor = ratio('#FFFFFF', '#FFFFFF');
    expect(Math.round(sameColor)).toBe(1);
  });

  it('correctly grades WCAG compliance', () => {
    expect(grade(8.5, false)).toBe('AAA');
    expect(grade(5.2, false)).toBe('AA');
    expect(grade(3.5, false)).toBe('Fail');
    expect(grade(3.5, true)).toBe('AA'); // Large text passes at 3.0:1
    expect(grade(2.1, true)).toBe('Fail');
  });

  it('nudges low-contrast color to pass target threshold', () => {
    const poorGreyOnWhite = '#94A3B8'; // around 2.6:1 on white
    const initialRatio = ratio(poorGreyOnWhite, '#FFFFFF');
    expect(initialRatio).toBeLessThan(4.5);

    const fixed = nudgeToContrast(poorGreyOnWhite, '#FFFFFF', 4.5);
    const fixedRatio = ratio(fixed, '#FFFFFF');

    expect(fixedRatio).toBeGreaterThanOrEqual(4.5);
  });

  it('runs complete audit on default semantic tokens', () => {
    const tokens = createDefaultTokens();
    const lightAudit = auditSemanticContrast(tokens.color.semantic.light);

    expect(lightAudit.totalCount).toBeGreaterThanOrEqual(8);
    expect(lightAudit.passCount).toBeGreaterThan(0);
    expect(lightAudit.scorePercent).toBeGreaterThanOrEqual(70);

    const darkAudit = auditSemanticContrast(tokens.color.semantic.dark);
    expect(darkAudit.totalCount).toBeGreaterThanOrEqual(8);
  });
});
