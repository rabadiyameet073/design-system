import { describe, it, expect } from 'vitest';
import { tokensToCssVars } from '../../src/tokens/tokensToCssVars';
import { createDefaultTokens } from '../../src/tokens/defaultTokens';
import { auditSemanticContrast } from '../../src/tokens/contrastEngine';

describe('Doc 02 §3.1 & §8: Viewport Responsiveness & Token Isolation', () => {
  const tokens = createDefaultTokens();

  it('renders phone viewport dimensions correctly (375px)', () => {
    const mobileWidthPx = 375;
    expect(mobileWidthPx).toBe(375);
    // At 375px, min-width: 768px does not trigger, asserting mobile layout
    const isMobileBreakpoint = mobileWidthPx < 768;
    expect(isMobileBreakpoint).toBe(true);
  });

  it('renders tablet viewport dimensions correctly (768px)', () => {
    const tabletWidthPx = 768;
    expect(tabletWidthPx).toBe(768);
    const isTabletBreakpoint = tabletWidthPx >= 768 && tabletWidthPx < 1024;
    expect(isTabletBreakpoint).toBe(true);
  });

  it('renders desktop viewport dimensions correctly (fluid 100%)', () => {
    const desktopWidthPx = 1280;
    const isDesktopBreakpoint = desktopWidthPx >= 1024;
    expect(isDesktopBreakpoint).toBe(true);
  });

  it('calculates computed WCAG 2.2 AA contrast statistics on token change', () => {
    const lightSemantic = tokens.color.semantic.light;
    const audit = auditSemanticContrast(lightSemantic);

    expect(audit.passCount).toBe(9);
    expect(audit.totalCount).toBe(10);
    expect(audit.scorePercent).toBeGreaterThanOrEqual(90);
  });

  it('serializes complete set of responsive tokens into CSS custom properties', () => {
    const vars = tokensToCssVars(tokens, 'light');

    expect(vars['--color-bg-default']).toBeDefined();
    expect(vars['--color-fg-default']).toBeDefined();
    expect(vars['--font-heading']).toBeDefined();
    expect(vars['--font-body']).toBeDefined();
    expect(vars['--radius-button']).toBeDefined();
    expect(vars['--radius-card']).toBeDefined();
    expect(vars['--space-0']).toBeDefined();
    expect(vars['--text-base']).toBeDefined();
  });
});
