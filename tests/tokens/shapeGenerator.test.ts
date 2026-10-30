import { describe, it, expect } from 'vitest';
import {
  RADIUS_PRESETS,
  DENSITY_MULTIPLIERS,
  generateSpaceScale,
  generateElevationShadows
} from '../../src/tokens/shapeGenerator';

describe('shapeGenerator', () => {
  it('provides the 4 standard radius presets with full: 9999', () => {
    expect(RADIUS_PRESETS.sharp).toBeDefined();
    expect(RADIUS_PRESETS.subtle).toBeDefined();
    expect(RADIUS_PRESETS.rounded).toBeDefined();
    expect(RADIUS_PRESETS.playful).toBeDefined();

    expect(RADIUS_PRESETS.sharp.none).toBe(0);
    expect(RADIUS_PRESETS.sharp.full).toBe(9999);
    expect(RADIUS_PRESETS.rounded.md).toBe(10);
    expect(RADIUS_PRESETS.playful.full).toBe(9999);
  });

  it('generates space scale with correct density multipliers', () => {
    const balanced = generateSpaceScale(4, 'balanced');
    const compact = generateSpaceScale(4, 'compact');
    const airy = generateSpaceScale(4, 'airy');

    expect(balanced).toEqual([0, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128]);
    expect(compact[4]).toBe(Math.round(16 * 0.8)); // 13
    expect(airy[4]).toBe(Math.round(16 * 1.25)); // 20
  });

  it('generates brand-tinted elevation shadows', () => {
    const brandHex = '#B7410E';
    const soft = generateElevationShadows(brandHex, 'soft');
    const crisp = generateElevationShadows(brandHex, 'crisp');
    const dramatic = generateElevationShadows(brandHex, 'dramatic');

    expect(soft.sm).toContain('rgba(');
    expect(soft.md).toContain('rgba(');
    expect(soft.lg).toContain('rgba(');

    expect(crisp.sm).toContain('px 1px 0px');
    expect(dramatic.lg).toBeDefined();
  });
});
