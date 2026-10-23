/**
 * Calculates WCAG 2.1 Contrast Ratio and Accessibility recommendations.
 */

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleanHex = hex.replace('#', '').trim();
  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16);
    const g = parseInt(cleanHex[1] + cleanHex[1], 16);
    const b = parseInt(cleanHex[2] + cleanHex[2], 16);
    return { r, g, b };
  }
  if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return { r, g, b };
  }
  return null;
}

export function getLuminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

export function getContrastRatio(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  if (!rgb1 || !rgb2) return 1;

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

export interface ContrastAuditResult {
  ratio: number;
  ratioFormatted: string;
  normalTextAA: boolean;
  largeTextAA: boolean;
  normalTextAAA: boolean;
  ratingDescription: string;
  suggestion?: string;
}

export function auditContrast(foregroundHex: string, backgroundHex: string): ContrastAuditResult {
  const ratio = getContrastRatio(foregroundHex, backgroundHex);
  const normalTextAA = ratio >= 4.5;
  const largeTextAA = ratio >= 3.0;
  const normalTextAAA = ratio >= 7.0;

  let ratingDescription = 'Excellent contrast (WCAG AAA)';
  let suggestion: string | undefined = undefined;

  if (ratio < 3.0) {
    ratingDescription = 'Low contrast — difficult to read';
    suggestion = 'Consider darkening this color for text or using a higher contrast background.';
  } else if (ratio < 4.5) {
    ratingDescription = 'Good for large headings (3:1+), but low for small body text';
    suggestion = 'Fine for headlines, but recommend a darker shade for paragraphs.';
  }

  return {
    ratio: Math.round(ratio * 100) / 100,
    ratioFormatted: `${(Math.round(ratio * 10) / 10).toFixed(1)}:1`,
    normalTextAA,
    largeTextAA,
    normalTextAAA,
    ratingDescription,
    suggestion
  };
}
