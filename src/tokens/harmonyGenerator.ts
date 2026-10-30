import { oklch, formatHex, clampChroma, type Oklch } from 'culori';

export type HarmonyMode = 'complementary' | 'analogous' | 'triadic' | 'split-complementary' | 'monochrome';

export interface HarmonyResult {
  brand: string;
  accent: string;
  secondary?: string;
}

/**
 * Computes perceptually uniform harmonies in OKLCH space.
 * OKLCH ensures perceived lightness and saturation remain balanced across hue shifts.
 */
export function generateOklchHarmony(baseHex: string, mode: HarmonyMode): HarmonyResult {
  const parsed = oklch(baseHex);
  const hue = parsed?.h ?? 220;
  const lightness = parsed?.l ?? 0.6;
  const chroma = parsed?.c ?? 0.14;

  const makeHex = (h: number, l = lightness, c = chroma): string => {
    const candidate: Oklch = {
      mode: 'oklch',
      l,
      c,
      h: (h + 360) % 360
    };
    return formatHex(clampChroma(candidate, 'rgb'));
  };

  switch (mode) {
    case 'complementary':
      return {
        brand: baseHex,
        accent: makeHex(hue + 180)
      };

    case 'analogous':
      return {
        brand: baseHex,
        accent: makeHex(hue + 35),
        secondary: makeHex(hue - 35)
      };

    case 'triadic':
      return {
        brand: baseHex,
        accent: makeHex(hue + 120),
        secondary: makeHex(hue + 240)
      };

    case 'split-complementary':
      return {
        brand: baseHex,
        accent: makeHex(hue + 150),
        secondary: makeHex(hue + 210)
      };

    case 'monochrome':
      return {
        brand: baseHex,
        accent: makeHex(hue, Math.min(0.85, lightness + 0.15), chroma * 0.7)
      };

    default:
      return {
        brand: baseHex,
        accent: makeHex(hue + 180)
      };
  }
}

export interface MoodPreset {
  id: string;
  prompt: string;
  label: string;
  brandHex: string;
  accentHex: string;
  description: string;
}

export const MOOD_PALETTES: MoodPreset[] = [
  {
    id: 'calm-trustworthy',
    prompt: 'calm, trustworthy, warm',
    label: 'Calm & Trustworthy',
    brandHex: '#2563EB',
    accentHex: '#D97706',
    description: 'Deep cobalt blue with warm golden amber accents. Inspires dependability and clarity.'
  },
  {
    id: 'vibrant-electric',
    prompt: 'vibrant, energetic, electric',
    label: 'Electric & Energetic',
    brandHex: '#7C3AED',
    accentHex: '#F43F5E',
    description: 'Electric violet with intense neon rose accents. Dynamic and trend-forward.'
  },
  {
    id: 'luxury-editorial',
    prompt: 'luxury, editorial, artisanal',
    label: 'Editorial & Artisan Luxury',
    brandHex: '#B7410E',
    accentHex: '#334155',
    description: 'Terracotta earth with deep slate and warm ecru. Tactile, bespoke and architectural.'
  },
  {
    id: 'minimal-technical',
    prompt: 'minimal, technical, monochrome',
    label: 'Minimal & Technical',
    brandHex: '#0F172A',
    accentHex: '#38BDF8',
    description: 'Obsidian charcoal with precise sky cyan highlights. Engineering authority.'
  },
  {
    id: 'earthy-botanical',
    prompt: 'earthy, botanical, tactile',
    label: 'Botanical & Organic',
    brandHex: '#15803D',
    accentHex: '#B45309',
    description: 'Forest moss green with warm cedar accents. Grounded and natural.'
  }
];
