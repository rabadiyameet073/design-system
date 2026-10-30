import { describe, it, expect } from 'vitest';
import {
  generateOklchHarmony,
  MOOD_PALETTES
} from '../../src/tokens/harmonyGenerator';

describe('harmonyGenerator', () => {
  const brandHex = '#2563EB';

  it('generates complementary harmony with accent', () => {
    const result = generateOklchHarmony(brandHex, 'complementary');
    expect(result.brand).toBe(brandHex);
    expect(result.accent).toMatch(/^#[0-9a-fA-F]{6}$/);
    expect(result.accent.toLowerCase()).not.toBe(brandHex.toLowerCase());
  });

  it('generates analogous, triadic, and split-complementary harmonies with secondary', () => {
    const analogous = generateOklchHarmony(brandHex, 'analogous');
    expect(analogous.accent).toMatch(/^#[0-9a-fA-F]{6}$/);
    expect(analogous.secondary).toMatch(/^#[0-9a-fA-F]{6}$/);

    const triadic = generateOklchHarmony(brandHex, 'triadic');
    expect(triadic.accent).toMatch(/^#[0-9a-fA-F]{6}$/);
    expect(triadic.secondary).toMatch(/^#[0-9a-fA-F]{6}$/);

    const split = generateOklchHarmony(brandHex, 'split-complementary');
    expect(split.accent).toMatch(/^#[0-9a-fA-F]{6}$/);
    expect(split.secondary).toMatch(/^#[0-9a-fA-F]{6}$/);
  });

  it('generates monochromatic harmony', () => {
    const mono = generateOklchHarmony(brandHex, 'monochrome');
    expect(mono.accent).toMatch(/^#[0-9a-fA-F]{6}$/);
  });

  it('provides mood palettes with valid hex values', () => {
    expect(MOOD_PALETTES.length).toBeGreaterThanOrEqual(5);
    for (const mood of MOOD_PALETTES) {
      expect(mood.brandHex).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(mood.accentHex).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(mood.prompt).toBeDefined();
    }
  });
});
