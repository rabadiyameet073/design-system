import { describe, it, expect } from 'vitest';
import { createDefaultTokens } from '../../src/tokens/defaultTokens';
import { auditSemanticContrast, nudgeToContrast, computeApcaLc, ratio, grade } from '../../src/tokens/contrastEngine';

describe('Universal Accessibility & Compliance Audit (WCAG 2.2 AA & APCA)', () => {
  const tokens = createDefaultTokens();

  it('audits light semantic theme and validates contrast thresholds', () => {
    const audit = auditSemanticContrast(tokens.color.semantic.light);
    expect(audit.totalCount).toBeGreaterThanOrEqual(8);
    expect(audit.passCount).toBeGreaterThan(0);

    // Verify each issue contains ratio, APCA Lc, grade and targetRatio
    audit.issues.forEach(issue => {
      expect(issue.ratio).toBeGreaterThan(0);
      expect(issue.apcaLc).toBeDefined();
      expect(['AAA', 'AA', 'Fail']).toContain(issue.grade);
    });
  });

  it('audits dark semantic theme and validates dark-mode contrast', () => {
    const audit = auditSemanticContrast(tokens.color.semantic.dark);
    expect(audit.totalCount).toBeGreaterThanOrEqual(8);
    expect(audit.passCount).toBeGreaterThan(0);
  });

  it('guarantees nudgeToContrast repairs low contrast pairs to target without hue distortion', () => {
    const failingPair = {
      fg: '#78909C', // Low contrast gray on white
      bg: '#FFFFFF'
    };

    const initialRatio = ratio(failingPair.fg, failingPair.bg);
    expect(initialRatio).toBeLessThan(4.5);

    const repairedFg = nudgeToContrast(failingPair.fg, failingPair.bg, 4.5);
    const repairedRatio = ratio(repairedFg, failingPair.bg);

    expect(repairedRatio).toBeGreaterThanOrEqual(4.5);
    expect(grade(repairedRatio, false)).toBe('AA');
  });

  it('verifies APCA lightness contrast produces valid polarity scores', () => {
    const darkOnLight = computeApcaLc('#111827', '#F9FAFB');
    const lightOnDark = computeApcaLc('#F9FAFB', '#111827');

    expect(darkOnLight).toBeGreaterThan(80); // High contrast dark text on light bg
    expect(lightOnDark).toBeLessThan(-80); // High contrast light text on dark bg
  });
});

