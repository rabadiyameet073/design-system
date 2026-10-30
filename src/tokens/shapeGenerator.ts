import { oklch, formatRgb } from 'culori';

export type RadiusPresetKey = 'sharp' | 'subtle' | 'rounded' | 'playful';
export type ElevationPresetKey = 'flat' | 'soft' | 'crisp' | 'dramatic';
export type DensityMultiplierKey = 'compact' | 'balanced' | 'airy';

export const RADIUS_PRESETS: Record<RadiusPresetKey, { none: number; sm: number; md: number; lg: number; xl: number; full: number }> = {
  sharp: { none: 0, sm: 2, md: 4, lg: 6, xl: 8, full: 9999 },
  subtle: { none: 0, sm: 2, md: 4, lg: 8, xl: 12, full: 9999 },
  rounded: { none: 0, sm: 6, md: 10, lg: 16, xl: 24, full: 9999 },
  playful: { none: 0, sm: 12, md: 20, lg: 28, xl: 40, full: 9999 }
};

export const DENSITY_MULTIPLIERS: Record<DensityMultiplierKey, number> = {
  compact: 0.8,
  balanced: 1.0,
  airy: 1.25
};

export const BASE_SPACE_SCALE = [0, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128];

export function generateSpaceScale(base: 4 | 8 = 4, density: DensityMultiplierKey = 'balanced'): number[] {
  const mult = DENSITY_MULTIPLIERS[density] || 1.0;
  return BASE_SPACE_SCALE.map(step => Math.round(step * mult));
}

/**
 * Generates brand-tinted box-shadow tokens based on the project's primary brand color.
 * Low-alpha brand-hue shadows give rich physical depth without muddy black stains.
 */
export function generateElevationShadows(
  brandHex: string,
  style: ElevationPresetKey = 'soft'
): { sm: string; md: string; lg: string } {
  // Convert brand hex to RGB tuple for rgba()
  const rgb = formatRgb(brandHex);
  // e.g. "rgb(183, 65, 14)" -> "183, 65, 14"
  const rgbTuple = rgb ? rgb.replace(/[rgba() ]/g, '') : '20, 20, 20';

  switch (style) {
    case 'flat':
      return {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.08)',
        lg: '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.08)'
      };

    case 'crisp':
      return {
        sm: `1px 1px 0px rgba(${rgbTuple}, 0.18)`,
        md: `2px 2px 0px rgba(${rgbTuple}, 0.22), 4px 4px 0px rgba(${rgbTuple}, 0.08)`,
        lg: `4px 4px 0px rgba(${rgbTuple}, 0.28), 8px 8px 0px rgba(${rgbTuple}, 0.12)`
      };

    case 'dramatic':
      return {
        sm: `0 2px 6px -1px rgba(${rgbTuple}, 0.12), 0 2px 4px -2px rgba(0, 0, 0, 0.08)`,
        md: `0 10px 20px -5px rgba(${rgbTuple}, 0.20), 0 6px 8px -4px rgba(0, 0, 0, 0.10)`,
        lg: `0 25px 40px -10px rgba(${rgbTuple}, 0.28), 0 12px 16px -6px rgba(0, 0, 0, 0.12)`
      };

    case 'soft':
    default:
      return {
        sm: `0 1px 3px 0 rgba(${rgbTuple}, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.05)`,
        md: `0 4px 12px -2px rgba(${rgbTuple}, 0.10), 0 2px 6px -1px rgba(0, 0, 0, 0.06)`,
        lg: `0 16px 28px -6px rgba(${rgbTuple}, 0.14), 0 6px 12px -3px rgba(0, 0, 0, 0.08)`
      };
  }
}
