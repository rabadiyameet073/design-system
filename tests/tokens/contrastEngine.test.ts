import { describe, it, expect } from 'vitest';
import { ratio, grade, nudgeToContrast, auditSemanticContrast, computeApcaLc, autoFixSemantic } from '../../src/tokens/contrastEngine';
import { createDefaultTokens } from '../../src/tokens/defaultTokens';
import { oklch } from 'culori';

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

  it('correctly handles mid-grey background contrast direction toward achievable contrast', () => {
    // On mid-grey #808080, black reaches ~5.3:1 while white can never reach 4.5:1
    const fixed = nudgeToContrast('#777777', '#808080', 4.5);
    const r = ratio(fixed, '#808080');
    expect(r).toBeGreaterThanOrEqual(4.5);
  });

  it('fixes failing chromatic pair to target contrast without changing hue by > 3 degrees', () => {
    const chromaticColor = '#38BDF8'; // Light sky blue, low contrast on white
    const bg = '#FFFFFF';
    const initialRatio = ratio(chromaticColor, bg);
    expect(initialRatio).toBeLessThan(4.5);

    const fixed = nudgeToContrast(chromaticColor, bg, 4.5);
    const fixedRatio = ratio(fixed, bg);
    expect(fixedRatio).toBeGreaterThanOrEqual(4.5);

    const initialHue = oklch(chromaticColor)?.h ?? 0;
    const fixedHue = oklch(fixed)?.h ?? 0;
    const hueDiff = Math.abs(initialHue - fixedHue);

    // Hue difference must be minimal (<= 3 degrees)
    expect(hueDiff).toBeLessThanOrEqual(3);
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

  it('computes APCA Lightness Contrast (Lc) perceptual second opinion', () => {
    const blackOnWhiteLc = computeApcaLc('#000000', '#FFFFFF');
    expect(blackOnWhiteLc).toBeGreaterThan(95);

    const whiteOnBlackLc = computeApcaLc('#FFFFFF', '#000000');
    expect(whiteOnBlackLc).toBeLessThan(-95);

    const identicalLc = computeApcaLc('#FFFFFF', '#FFFFFF');
    expect(identicalLc).toBe(0);

    // Supports named colors and rgb strings without NaN
    const rgbLc = computeApcaLc('rgb(0, 0, 0)', 'rgb(255, 255, 255)');
    expect(rgbLc).toBeGreaterThan(95);

    const namedLc = computeApcaLc('black', 'white');
    expect(namedLc).toBeGreaterThan(95);
  });

  it('autoFixSemantic fixes failing semantic colors to 100% WCAG AA compliance', () => {
    const badSemantic = {
      bgDefault: '#FFFFFF',
      bgSurface: '#F5F5F5',
      bgElevated: '#FFFFFF',
      fgDefault: '#999999', // Low contrast on white ~2.8:1
      fgMuted: '#BBBBBB',   // Low contrast on white ~1.8:1
      borderDefault: '#EEEEEE',
      actionPrimary: '#7799CC',
      actionPrimaryFg: '#FFFFFF',
      actionPrimaryHover: '#6688BB',
      focusRing: '#DDDDDD',
      statusSuccess: '#0a0',
      statusSuccessBg: '#E6FFE6',
      statusSuccessFg: '#88CC88',
      statusWarning: '#fa0',
      statusWarningBg: '#FFF3CC',
      statusWarningFg: '#DDCC66',
      statusDanger: '#f00',
      statusDangerBg: '#FFE5E5',
      statusDangerFg: '#FF9999',
      statusInfo: '#06f',
      statusInfoBg: '#E5F0FF',
      statusInfoFg: '#99BBFF'
    };

    const before = auditSemanticContrast(badSemantic as any);
    expect(before.failCount).toBeGreaterThan(0);

    const fixed = autoFixSemantic(badSemantic as any);
    const after = auditSemanticContrast(fixed);

    expect(after.failCount).toBe(0);
    expect(after.scorePercent).toBe(100);
  });
});

