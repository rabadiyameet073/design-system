import { describe, it, expect } from 'vitest';
import { generateColorScale, generateNeutralScale, generateAllColorPrimitives } from '../../src/tokens/colorScale';
import { SCALE_STEPS } from '../../src/tokens/types';
import { oklch } from 'culori';

describe('OKLCH Color Scale Generator', () => {
  it('generates all 11 steps for a brand color', () => {
    const scale = generateColorScale('#B7410E');
    expect(scale).toBeDefined();

    for (const step of SCALE_STEPS) {
      expect(scale[step]).toBeDefined();
      expect(scale[step]).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it('verifies monotonic lightness descent from 50 to 950', () => {
    const scale = generateColorScale('#2563EB');
    const lightnesses = SCALE_STEPS.map(step => oklch(scale[step])?.l ?? 0);

    for (let i = 0; i < lightnesses.length - 1; i++) {
      expect(lightnesses[i]).toBeGreaterThan(lightnesses[i + 1]);
    }
  });

  it('generates neutral scale tinted with brand hue', () => {
    const neutrals = generateNeutralScale(220);
    expect(Object.keys(neutrals).length).toBe(11);
    expect(neutrals[50]).toBeDefined();
    expect(neutrals[950]).toBeDefined();
  });

  it('generates all 7 required color primitive groups', () => {
    const all = generateAllColorPrimitives('#B7410E', '#2563EB');
    expect(all.brand).toBeDefined();
    expect(all.accent).toBeDefined();
    expect(all.neutral).toBeDefined();
    expect(all.success).toBeDefined();
    expect(all.warning).toBeDefined();
    expect(all.danger).toBeDefined();
    expect(all.info).toBeDefined();
  });
});
