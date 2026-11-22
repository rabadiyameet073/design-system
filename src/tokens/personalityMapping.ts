/**
 * Brand Personality to Preset Mapping Engine
 * Implements Doc 02 §7: Deterministic calibration from personality sliders (-1..+1 or 0..100)
 * to design token preset bundles.
 */

export interface PersonalityDials {
  energy: number;
  craft: number;
  voice: number;
  formality: number;
  density: number;
}

export interface PresetBundle {
  id: string;
  name: string;
  tagline: string;
  typeTags: string[];
  radius: 'rounded' | 'subtle' | 'sharp';
  saturation: number; // OKLCH chroma target
  motion: 'subtle' | 'expressive';
  density: 'airy' | 'compact' | 'balanced';
}

/**
 * Normalizes a 0..100 slider value into a -1..+1 scale.
 */
export function normalizeDial(val: number): number {
  const clamped = Math.max(0, Math.min(100, val));
  return (clamped - 50) / 50;
}

/**
 * Deterministically suggests a preset bundle based on personality dials.
 * Follows Doc 02 §7:
 * - calm: energy < 0
 * - artisanal: craft > 0 (handcrafted vs computational)
 * - poetic: voice > 0 (poetic vs direct)
 */
export function suggestPreset(p: PersonalityDials): PresetBundle {
  // Normalize if incoming is 0..100
  const energyNorm = p.energy > 1 || p.energy < -1 ? normalizeDial(p.energy) : p.energy;
  const craftNorm = p.craft > 1 || p.craft < -1 ? normalizeDial(p.craft) : p.craft;
  const voiceNorm = p.voice > 1 || p.voice < -1 ? normalizeDial(p.voice) : p.voice;
  const densityNorm = p.density > 1 || p.density < -1 ? normalizeDial(p.density) : p.density;

  const calm = energyNorm < 0;
  const artisanal = craftNorm > 0;
  const poetic = voiceNorm > 0;

  const typeTags: string[] = [
    artisanal ? 'serif' : 'geometric',
    poetic ? 'editorial' : 'neutral',
    calm ? 'soft' : 'bold'
  ];

  const radius: 'rounded' | 'subtle' | 'sharp' =
    calm && artisanal ? 'rounded' : artisanal ? 'subtle' : 'sharp';

  const saturation = calm ? 0.08 : 0.18;
  const motion: 'subtle' | 'expressive' = calm ? 'subtle' : 'expressive';
  const density: 'airy' | 'compact' | 'balanced' =
    densityNorm < -0.2 ? 'airy' : densityNorm > 0.2 ? 'compact' : 'balanced';

  const name =
    artisanal && calm
      ? 'Warm Artisanal & Editorial'
      : !artisanal && !calm
      ? 'High-Velocity Kinetic Tech'
      : calm
      ? 'Disciplined Architectural Monograph'
      : 'Modern Commercial Expressive';

  const tagline =
    artisanal && calm
      ? 'Tactile warmth, serif display titles, and spacious rhythm.'
      : !artisanal && !calm
      ? 'Electric accents, compact density, and high-velocity feedback.'
      : calm
      ? 'Understated restraint, hairline borders, and calm focus.'
      : 'Bold typography, saturated highlights, and confident presence.';

  return {
    id: `preset-${radius}-${density}`,
    name,
    tagline,
    typeTags,
    radius,
    saturation,
    motion,
    density
  };
}

/**
 * Returns 2-3 suggested bundles spanning the user's primary calibration plus adjacent nuances.
 */
export function generateSuggestedBundles(p: PersonalityDials): PresetBundle[] {
  const primary = suggestPreset(p);

  // Variant A: More artisanal / calm nuance
  const variantA = suggestPreset({
    energy: Math.max(0, p.energy - 25),
    craft: Math.min(100, p.craft + 20),
    voice: Math.min(100, p.voice + 15),
    formality: p.formality,
    density: Math.max(0, p.density - 20)
  });

  // Variant B: More precision / kinetic nuance
  const variantB = suggestPreset({
    energy: Math.min(100, p.energy + 25),
    craft: Math.max(0, p.craft - 20),
    voice: Math.max(0, p.voice - 15),
    formality: p.formality,
    density: Math.min(100, p.density + 20)
  });

  const map = new Map<string, PresetBundle>();
  map.set(primary.id, primary);
  if (!map.has(variantA.id)) map.set(variantA.id, variantA);
  if (!map.has(variantB.id)) map.set(variantB.id, variantB);

  return Array.from(map.values()).slice(0, 3);
}
