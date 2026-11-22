import { describe, it, expect } from 'vitest';
import {
  suggestPreset,
  generateSuggestedBundles,
  normalizeDial,
  PersonalityDials
} from '../../src/tokens/personalityMapping';

describe('Doc 02 §7: Brand Personality to Preset Mapping', () => {
  it('normalizes 0..100 slider values into -1..+1 scale', () => {
    expect(normalizeDial(0)).toBe(-1);
    expect(normalizeDial(50)).toBe(0);
    expect(normalizeDial(100)).toBe(1);
    expect(normalizeDial(25)).toBe(-0.5);
    expect(normalizeDial(75)).toBe(0.5);
  });

  it('suggests calm & artisanal bundle for high craft and low energy', () => {
    const personality: PersonalityDials = {
      energy: 25, // calm (< 0)
      craft: 85,  // artisanal (> 0)
      voice: 70,  // poetic (> 0)
      formality: 45,
      density: 30 // airy (< 0)
    };

    const bundle = suggestPreset(personality);
    expect(bundle.typeTags).toEqual(['serif', 'editorial', 'soft']);
    expect(bundle.radius).toBe('rounded');
    expect(bundle.saturation).toBe(0.08); // OKLCH calm chroma
    expect(bundle.motion).toBe('subtle');
    expect(bundle.density).toBe('airy');
  });

  it('suggests kinetic & computational bundle for high energy and low craft', () => {
    const personality: PersonalityDials = {
      energy: 85, // energetic (> 0)
      craft: 20,  // computational (< 0)
      voice: 30,  // direct (< 0)
      formality: 40,
      density: 80 // compact (> 0)
    };

    const bundle = suggestPreset(personality);
    expect(bundle.typeTags).toEqual(['geometric', 'neutral', 'bold']);
    expect(bundle.radius).toBe('sharp');
    expect(bundle.saturation).toBe(0.18); // OKLCH kinetic chroma
    expect(bundle.motion).toBe('expressive');
    expect(bundle.density).toBe('compact');
  });

  it('generates 2-3 distinct suggested bundles spanning user calibration', () => {
    const personality: PersonalityDials = {
      energy: 50,
      craft: 60,
      voice: 50,
      formality: 50,
      density: 50
    };

    const bundles = generateSuggestedBundles(personality);
    expect(bundles.length).toBeGreaterThanOrEqual(2);
    expect(bundles.length).toBeLessThanOrEqual(3);
    for (const b of bundles) {
      expect(b.id).toBeDefined();
      expect(b.name).toBeDefined();
      expect(b.typeTags.length).toBe(3);
      expect(['rounded', 'subtle', 'sharp']).toContain(b.radius);
      expect(['airy', 'compact', 'balanced']).toContain(b.density);
    }
  });
});
