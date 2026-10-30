import { tagsFor } from '../data/fontTags';

export interface FontMeta {
  family: string;
  category: 'serif' | 'sans-serif' | 'display' | 'handwriting' | 'monospace';
  variants: string[];
  subsets: string[];
  variable: boolean;
  axes?: { tag: string; min: number; max: number }[];
  popularityRank?: number;
  source: 'google' | 'fontsource' | 'system' | 'custom';
}

export interface CuratedPair {
  genre: string;
  heading: string;
  body: string;
  mono?: string;
}

export const CURATED_PAIRS: CuratedPair[] = [
  { genre: 'luxury', heading: 'Fraunces', body: 'DM Sans' },
  { genre: 'luxury', heading: 'Playfair Display', body: 'Inter' },
  { genre: 'luxury', heading: 'Cormorant Garamond', body: 'Plus Jakarta Sans' },
  { genre: 'saas', heading: 'Inter', body: 'Inter', mono: 'JetBrains Mono' },
  { genre: 'saas', heading: 'Plus Jakarta Sans', body: 'Plus Jakarta Sans', mono: 'JetBrains Mono' },
  { genre: 'tech', heading: 'Michroma', body: 'Plus Jakarta Sans', mono: 'JetBrains Mono' },
  { genre: 'tech', heading: 'Space Grotesk', body: 'Inter', mono: 'JetBrains Mono' },
  { genre: 'creative', heading: 'Syne', body: 'Inter' },
  { genre: 'creative', heading: 'Bricolage Grotesque', body: 'DM Sans' },
  { genre: 'publishing', heading: 'Newsreader', body: 'Inter' },
  { genre: 'publishing', heading: 'Source Serif 4', body: 'Inter' },
  { genre: 'finance', heading: 'Plus Jakarta Sans', body: 'Inter', mono: 'IBM Plex Mono' },
  { genre: 'education', heading: 'Outfit', body: 'Lexend' },
  { genre: 'commerce', heading: 'Manrope', body: 'DM Sans' },
  { genre: 'architecture', heading: 'Outfit', body: 'Inter' },
  { genre: 'devanagari', heading: 'Poppins', body: 'Noto Sans Devanagari' },
  { genre: 'gujarati', heading: 'Noto Serif Gujarati', body: 'Noto Sans Gujarati' }
];

export const TYPE_SCALE_STEPS = {
  xs: -2,
  sm: -1,
  base: 0,
  lg: 1,
  xl: 2,
  '2xl': 3,
  '3xl': 4,
  '4xl': 5,
  '5xl': 6,
  '6xl': 7
} as const;

export function scaleSize(basePx: number, ratio: number, step: number): number {
  return Number((basePx * Math.pow(ratio, step)).toFixed(2));
}

export function fluid(minPx: number, maxPx: number, minVw = 360, maxVw = 1280): string {
  const slope = (maxPx - minPx) / (maxVw - minVw);
  const intercept = minPx - slope * minVw;
  return `clamp(${(minPx / 16).toFixed(3)}rem, ${(intercept / 16).toFixed(4)}rem + ${(slope * 100).toFixed(4)}vw, ${(maxPx / 16).toFixed(3)}rem)`;
}

export function generateFullTypeScale(
  baseSizePx = 16,
  ratio = 1.25,
  minVw = 360,
  maxVw = 1280
) {
  const scaleObj: Record<string, { minPx: number; maxPx: number; css: string }> = {};

  // For mobile minPx, use a calmer ratio (e.g., 1.18 or 1.2) to prevent oversized text on phone screens
  const mobileRatio = Math.min(ratio, 1.2);

  for (const [key, step] of Object.entries(TYPE_SCALE_STEPS)) {
    const minPx = scaleSize(baseSizePx, mobileRatio, step);
    const maxPx = scaleSize(baseSizePx, ratio, step);
    const css = fluid(minPx, maxPx, minVw, maxVw);
    scaleObj[key] = { minPx, maxPx, css };
  }

  return scaleObj;
}

function intersection(a: string[], b: string[]): string[] {
  const setB = new Set(b);
  return a.filter(x => setB.has(x));
}

/**
 * Evaluates pairing suitability between heading font and body font based on contrast,
 * legibility, weight variety, and tag resonance.
 */
export function scorePair(
  h: FontMeta,
  b: FontMeta,
  ctx: { tags: string[]; pairs?: CuratedPair[] }
): number {
  let s = 0;
  const pairs = ctx.pairs || CURATED_PAIRS;
  const curated = pairs.find(p => p.heading === h.family && p.body === b.family);
  if (curated) s += 50;

  // Contrast principle: pair different categories (e.g. Serif Heading + Sans Body)
  if (h.category !== b.category) s += 15;
  // Two different sans-serif fonts often feel mismatched or muddy
  if (h.category === b.category && h.family !== b.family) s -= 12;
  // Single-family system (same family for heading and body) is always safe & unified
  if (h.family === b.family) s += 10;

  // Body font must have regular and 700 bold
  if (b.variants.includes('regular') || b.variants.includes('400')) s += 5;
  if (b.variants.includes('700') || b.variants.includes('600')) s += 5;
  if (b.variable) s += 4;

  // Popularity ranking bonus
  if (b.popularityRank) {
    s += Math.max(0, 10 - b.popularityRank / 30);
  }

  // Genre / personality tag overlap
  const hTags = tagsFor(h.family, h.category);
  const bTags = tagsFor(b.family, b.category);
  s += 6 * intersection(ctx.tags, hTags).length;
  s += 4 * intersection(ctx.tags, bTags).length;

  return s;
}

/**
 * Returns top recommended body fonts for a selected heading font.
 */
export function getRecommendedBodyFonts(
  headingFont: FontMeta,
  allFonts: FontMeta[],
  tags: string[] = ['modern', 'editorial']
): FontMeta[] {
  // Hard filters: Body font cannot be display or handwriting
  const candidates = allFonts.filter(
    f => f.category === 'sans-serif' || f.category === 'serif'
  );

  const scored = candidates.map(font => ({
    font,
    score: scorePair(headingFont, font, { tags })
  }));

  scored.sort((a, b) => b.score - a.score);

  // Return top 6 distinct recommendations
  return scored.slice(0, 6).map(item => item.font);
}

