import { ColorPaletteConfig, ColorShades } from '../types/designSystem';
import { hexToRgb } from './contrast';

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const clamped = Math.max(0, Math.min(255, Math.round(n)));
    return clamped.toString(16).padStart(2, '0');
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0, g = 0, b = 0;
  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else {
    r = c; g = 0; b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255)
  };
}

export function hslToHex(h: number, s: number, l: number): string {
  const { r, g, b } = hslToRgb(h, s, l);
  return rgbToHex(r, g, b);
}

export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const rgb = hexToRgb(hex);
  if (!rgb) return { h: 24, s: 70, l: 50 };

  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / delta + (g < b ? 6 : 0)) * 60;
        break;
      case g:
        h = ((b - r) / delta + 2) * 60;
        break;
      case b:
        h = ((r - g) / delta + 4) * 60;
        break;
    }
  }

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

/**
 * Generates an accurate 50 - 900 shade ramp from any base color
 */
export function generateShadesFromBase(baseHex: string): ColorShades {
  const { h, s } = hexToHsl(baseHex);

  return {
    50: hslToHex(h, Math.max(20, s * 0.4), 97),
    100: hslToHex(h, Math.max(25, s * 0.5), 92),
    200: hslToHex(h, Math.max(30, s * 0.65), 82),
    300: hslToHex(h, Math.max(35, s * 0.8), 70),
    400: hslToHex(h, s, 58),
    500: baseHex,
    600: hslToHex(h, Math.min(100, s * 1.05), 42),
    700: hslToHex(h, Math.min(100, s * 1.1), 32),
    800: hslToHex(h, Math.min(100, s * 1.15), 23),
    900: hslToHex(h, Math.min(100, s * 1.2), 14)
  };
}

/**
 * Creates a complete harmonious design system palette from a chosen wheel color
 */
export function generateHarmoniousPalette(
  baseHex: string,
  paletteName: string = 'Custom Brand Palette'
): ColorPaletteConfig {
  const { h, s, l } = hexToHsl(baseHex);
  const shades = generateShadesFromBase(baseHex);

  // Secondary tone (analogous or deeper tone with ~30 deg offset)
  const secondaryHex = hslToHex((h + 25) % 360, Math.max(30, s * 0.85), Math.max(22, l * 0.65));

  // Accent highlight (harmonious split-complementary offset)
  const accentHex = hslToHex((h + 45) % 360, Math.min(100, s * 1.1), Math.min(75, l * 1.2));

  // Dominant 60% Canvas Background (clean, slightly warm/cool tinted neutral)
  const backgroundHex = hslToHex(h, Math.min(15, s * 0.15), 98);
  const backgroundAltHex = hslToHex(h, Math.min(18, s * 0.2), 95);

  // Surface & Borders
  const surfaceHex = '#FFFFFF';
  const surfaceBorderHex = hslToHex(h, Math.min(15, s * 0.15), 88);

  // Readable typography colors
  const textPrimary = hslToHex(h, Math.min(25, s * 0.25), 11);
  const textSecondary = hslToHex(h, Math.min(20, s * 0.2), 36);
  const textMuted = hslToHex(h, Math.min(15, s * 0.15), 58);

  return {
    id: `custom_${Date.now()}_${baseHex.replace('#', '')}`,
    name: paletteName,
    description: `Generated from chosen hue ${Math.round(h)}° (${baseHex}) with WCAG AA compliance.`,
    family: getFamilyNameFromHue(h),
    primary: baseHex,
    secondary: secondaryHex,
    accent: accentHex,
    background: backgroundHex,
    backgroundAlt: backgroundAltHex,
    surface: surfaceHex,
    surfaceBorder: surfaceBorderHex,
    textPrimary: textPrimary,
    textSecondary: textSecondary,
    textMuted: textMuted,
    link: baseHex,
    success: '#16A34A',
    warning: '#D97706',
    error: '#DC2626',
    info: '#2563EB',
    focusRing: baseHex,
    shades: shades
  };
}

export function getFamilyNameFromHue(hue: number): string {
  if (hue >= 15 && hue < 45) return 'Orange & Warm Terracotta';
  if (hue >= 45 && hue < 70) return 'Amber & Warm Gold';
  if (hue >= 70 && hue < 165) return 'Green & Botanical';
  if (hue >= 165 && hue < 200) return 'Teal & Cyan';
  if (hue >= 200 && hue < 255) return 'Blue & Indigo';
  if (hue >= 255 && hue < 300) return 'Violet & Purple';
  if (hue >= 300 && hue < 345) return 'Rose & Berry';
  return 'Red & Crimson';
}
