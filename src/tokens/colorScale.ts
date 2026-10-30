import { oklch, formatHex, clampChroma, type Oklch } from 'culori';
import { ColorScale, ScaleStep, SCALE_STEPS } from './types';

// Perceptual OKLCH Lightness targets for 11-step scale (50 -> 950)
const L_TARGETS: Record<ScaleStep, number> = {
  50: 0.97,
  100: 0.93,
  200: 0.86,
  300: 0.78,
  400: 0.70,
  500: 0.62,
  600: 0.54,
  700: 0.46,
  800: 0.38,
  900: 0.30,
  950: 0.22
};

// Chroma tapering factors to prevent muddy shadows or blown-out highlights
const CHROMA_FACTORS: Record<ScaleStep, number> = {
  50: 0.22,
  100: 0.38,
  200: 0.65,
  300: 0.82,
  400: 0.95,
  500: 1.00,
  600: 0.96,
  700: 0.88,
  800: 0.78,
  900: 0.65,
  950: 0.50
};

/**
 * Generates an 11-step perceptually uniform OKLCH color scale from any input hex.
 */
export function generateColorScale(baseHex: string): ColorScale {
  const parsed = oklch(baseHex);
  const hue = parsed?.h ?? 0;
  const baseChroma = Math.max(parsed?.c ?? 0.12, 0.06);

  const scale: Partial<ColorScale> = {};

  for (const step of SCALE_STEPS) {
    const targetL = L_TARGETS[step];
    const targetC = baseChroma * CHROMA_FACTORS[step];

    const candidate: Oklch = {
      mode: 'oklch',
      l: targetL,
      c: targetC,
      h: hue
    };

    // Safely clamp within sRGB gamut
    const clamped = clampChroma(candidate, 'rgb');
    scale[step] = formatHex(clamped);
  }

  return scale as ColorScale;
}

/**
 * Generates a brand-tinted neutral scale (grays tinted with brand hue).
 * Neutral chroma is calibrated to 0.008–0.014 to avoid sterile dead grays.
 */
export function generateNeutralScale(brandHue: number): ColorScale {
  const scale: Partial<ColorScale> = {};

  for (const step of SCALE_STEPS) {
    const targetL = L_TARGETS[step];
    // Gentle neutral chroma curve
    const neutralC = 0.012 * CHROMA_FACTORS[step];

    const candidate: Oklch = {
      mode: 'oklch',
      l: targetL,
      c: neutralC,
      h: brandHue
    };

    const clamped = clampChroma(candidate, 'rgb');
    scale[step] = formatHex(clamped);
  }

  return scale as ColorScale;
}

/**
 * Standard functional hues in OKLCH:
 * Success (Emerald): ~145°
 * Warning (Amber): ~85°
 * Danger (Rose): ~25°
 * Info (Sky/Blue): ~240°
 */
export const FUNCTIONAL_HUES = {
  success: 145,
  warning: 85,
  danger: 25,
  info: 240
} as const;

export function generateFunctionalScale(hue: number, baseChroma = 0.14): ColorScale {
  const scale: Partial<ColorScale> = {};

  for (const step of SCALE_STEPS) {
    const targetL = L_TARGETS[step];
    const targetC = baseChroma * CHROMA_FACTORS[step];

    const candidate: Oklch = {
      mode: 'oklch',
      l: targetL,
      c: targetC,
      h: hue
    };

    const clamped = clampChroma(candidate, 'rgb');
    scale[step] = formatHex(clamped);
  }

  return scale as ColorScale;
}

/**
 * Generates all 7 primitive scales: brand, accent, neutral, and 4 functional scales.
 */
export function generateAllColorPrimitives(
  brandHex: string,
  accentHex?: string
): Record<'brand' | 'accent' | 'neutral' | 'success' | 'warning' | 'danger' | 'info', ColorScale> {
  const parsedBrand = oklch(brandHex);
  const brandHue = parsedBrand?.h ?? 220;

  // If no accent provided, generate harmonic complementary (+180°)
  const effectiveAccentHex = accentHex ?? formatHex(clampChroma({
    mode: 'oklch',
    l: 0.65,
    c: (parsedBrand?.c ?? 0.15),
    h: (brandHue + 180) % 360
  }, 'rgb'));

  return {
    brand: generateColorScale(brandHex),
    accent: generateColorScale(effectiveAccentHex),
    neutral: generateNeutralScale(brandHue),
    success: generateFunctionalScale(FUNCTIONAL_HUES.success),
    warning: generateFunctionalScale(FUNCTIONAL_HUES.warning),
    danger: generateFunctionalScale(FUNCTIONAL_HUES.danger),
    info: generateFunctionalScale(FUNCTIONAL_HUES.info)
  };
}
