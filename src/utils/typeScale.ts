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
  // Luxury hospitality, editorial
  { genre: 'luxury', heading: 'Fraunces', body: 'DM Sans' },
  { genre: 'luxury', heading: 'Fraunces', body: 'Inter' },
  { genre: 'luxury', heading: 'Playfair Display', body: 'Inter' },
  { genre: 'luxury', heading: 'Playfair Display', body: 'DM Sans' },
  { genre: 'luxury', heading: 'Cormorant Garamond', body: 'Inter' },
  { genre: 'luxury', heading: 'Cormorant Garamond', body: 'Plus Jakarta Sans' },

  // SaaS, dev tools
  { genre: 'saas', heading: 'Geist', body: 'Geist', mono: 'Geist Mono' },
  { genre: 'saas', heading: 'Geist', body: 'Inter', mono: 'Geist Mono' },
  { genre: 'saas', heading: 'Inter', body: 'Inter', mono: 'JetBrains Mono' },
  { genre: 'saas', heading: 'Plus Jakarta Sans', body: 'Plus Jakarta Sans', mono: 'JetBrains Mono' },

  // Tech / futuristic
  { genre: 'tech', heading: 'Michroma', body: 'Plus Jakarta Sans', mono: 'JetBrains Mono' },
  { genre: 'tech', heading: 'Michroma', body: 'Inter', mono: 'JetBrains Mono' },
  { genre: 'tech', heading: 'Space Grotesk', body: 'Inter', mono: 'JetBrains Mono' },
  { genre: 'tech', heading: 'Space Grotesk', body: 'Plus Jakarta Sans', mono: 'JetBrains Mono' },

  // Portfolio, creative
  { genre: 'creative', heading: 'Syne', body: 'Inter' },
  { genre: 'creative', heading: 'Bricolage Grotesque', body: 'Inter' },
  { genre: 'creative', heading: 'Bricolage Grotesque', body: 'DM Sans' },

  // Publishing, magazine
  { genre: 'publishing', heading: 'Newsreader', body: 'Inter' },
  { genre: 'publishing', heading: 'Source Serif 4', body: 'Inter' },
  { genre: 'publishing', heading: 'Instrument Serif', body: 'Inter' },

  // Finance, trust
  { genre: 'finance', heading: 'IBM Plex Sans', body: 'IBM Plex Sans', mono: 'IBM Plex Mono' },
  { genre: 'finance', heading: 'IBM Plex Serif', body: 'IBM Plex Sans', mono: 'IBM Plex Mono' },
  { genre: 'finance', heading: 'Plus Jakarta Sans', body: 'Inter', mono: 'IBM Plex Mono' },

  // Education, friendly
  { genre: 'education', heading: 'Nunito', body: 'Lexend' },
  { genre: 'education', heading: 'Outfit', body: 'Lexend' },
  { genre: 'education', heading: 'Outfit', body: 'Atkinson Hyperlegible' },

  // Commerce, modern
  { genre: 'commerce', heading: 'Manrope', body: 'DM Sans' },
  { genre: 'commerce', heading: 'Manrope', body: 'Inter' },
  { genre: 'commerce', heading: 'DM Sans', body: 'Inter' },

  // Architecture, minimal
  { genre: 'architecture', heading: 'Outfit', body: 'Inter' },
  { genre: 'architecture', heading: 'Inter Tight', body: 'Inter' },

  // Warm artisanal
  { genre: 'artisanal', heading: 'Fraunces', body: 'Plus Jakarta Sans' },
  { genre: 'artisanal', heading: 'Fraunces', body: 'Nunito Sans' },

  // Indic / Multi-script
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
 * Evaluates pairing suitability between heading font and body font per Doc 03 §6.2.
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

  // Contrast principle: pair different categories, avoid two similar ones
  if (h.category !== b.category) s += 15;
  if (h.category === b.category && h.family !== b.family) s -= 15; // two near-identical sans = muddy
  if (h.family === b.family) s += 8; // single-family system is always safe

  // Body quality
  const hasReg = b.variants.some(v => v === 'regular' || v === '400');
  const hasBold = b.variants.some(v => v === '700' || v === '600' || v === 'bold');
  if (hasReg && hasBold) s += 5;
  if (b.variants.some(v => v.includes('italic'))) s += 3;
  if (b.variable) s += 3;

  // Popularity ranking bonus (proven readability)
  s += Math.max(0, 10 - (b.popularityRank ?? 999) / 30);

  // Genre / personality tag overlap
  const hTags = tagsFor(h.family, h.category);
  const bTags = tagsFor(b.family, b.category);
  s += 6 * intersection(ctx.tags, hTags).length;
  s += 4 * intersection(ctx.tags, bTags).length;

  return s;
}

/**
 * Returns top recommended body fonts for a selected heading font,
 * respecting hard filters (sans/serif only, supported scripts, required weights)
 * and ranking by scorePair().
 */
export function getRecommendedBodyFonts(
  headingFont: FontMeta,
  allFonts: FontMeta[],
  tags: string[] = ['modern', 'editorial'],
  requiredScripts: string[] = ['latin']
): FontMeta[] {
  // Hard filters per Doc 03 §6.1:
  // 1. Body role: category in {sans-serif, serif}; not display/handwriting
  // 2. Supports all required scripts
  // 3. Has weights 400 and 700 (or variable)
  const candidates = allFonts.filter(f => {
    if (f.category !== 'sans-serif' && f.category !== 'serif') return false;

    if (requiredScripts && requiredScripts.length > 0) {
      const allSupported = requiredScripts.every(reqScript => {
        if (reqScript === 'latin') return true;
        return f.subsets.some(s => s.toLowerCase().includes(reqScript.toLowerCase()));
      });
      if (!allSupported) return false;
    }

    const hasReg = f.variants.some(v => v === 'regular' || v === '400');
    const hasBold = f.variants.some(v => v === '700' || v === '600' || v === 'bold');
    if (!f.variable && (!hasReg || !hasBold)) return false;

    return true;
  });

  const scored = candidates.map(font => ({
    font,
    score: scorePair(headingFont, font, { tags })
  }));

  scored.sort((a, b) => b.score - a.score);

  // Return top 6 distinct recommendations ensuring variety
  const results: FontMeta[] = [];
  const seenFamilies = new Set<string>();
  for (const item of scored) {
    if (!seenFamilies.has(item.font.family)) {
      seenFamilies.add(item.font.family);
      results.push(item.font);
      if (results.length >= 6) break;
    }
  }

  return results;
}

