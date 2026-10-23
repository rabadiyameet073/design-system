import { TypographyConfig } from '../types/designSystem';

export interface TypographyPairingOption {
  id: string;
  name: string;
  vibe: string;
  displayFont: string;
  headingFont: string;
  bodyFont: string;
  monoFont: string;
  scaleRatio: number;
  headingWeight: '500' | '600' | '700' | '800';
  bodyWeight: '400' | '500';
  description: string;
}

export const TYPOGRAPHY_PAIRINGS: TypographyPairingOption[] = [
  {
    id: 'zen-dots-michroma',
    name: 'Zen Dots + Michroma',
    vibe: 'Cyberpunk & Sci-Fi Minimal',
    displayFont: 'Zen Dots',
    headingFont: 'Zen Dots',
    bodyFont: 'Michroma',
    monoFont: 'JetBrains Mono',
    scaleRatio: 1.333,
    headingWeight: '600',
    bodyWeight: '400',
    description: 'High-tech robotic geometry designed by Yoshimichi Ohira. Gives headers an instantly recognizable futuristic electronic punch.'
  },
  {
    id: 'michroma-premium',
    name: 'Michroma + Plus Jakarta Sans',
    vibe: 'Futuristic & Premium High-Tech',
    displayFont: 'Michroma',
    headingFont: 'Michroma',
    bodyFont: 'Plus Jakarta Sans',
    monoFont: 'JetBrains Mono',
    scaleRatio: 1.25,
    headingWeight: '600',
    bodyWeight: '400',
    description: 'Ultra-modern, wide geometric architectural display typeface engineered by Vernon Adams. Conveys cutting-edge technology and premium luxury.'
  },
  {
    id: 'outfit-jakarta',
    name: 'Outfit + Plus Jakarta Sans',
    vibe: 'Modern & Confident',
    displayFont: 'Outfit',
    headingFont: 'Outfit',
    bodyFont: 'Plus Jakarta Sans',
    monoFont: 'JetBrains Mono',
    scaleRatio: 1.25,
    headingWeight: '600',
    bodyWeight: '400',
    description: 'Crisp geometric clarity paired with warm scannable body prose. Built for SaaS, digital agencies, and modern startups.'
  },
  {
    id: 'playfair-dmsans',
    name: 'Playfair Display + DM Sans',
    vibe: 'Refined Editorial',
    displayFont: 'Playfair Display',
    headingFont: 'Playfair Display',
    bodyFont: 'DM Sans',
    monoFont: 'JetBrains Mono',
    scaleRatio: 1.333,
    headingWeight: '600',
    bodyWeight: '400',
    description: 'High-contrast luxury serif headlines grounded by a clean, balanced grotesque body font. Ideal for fashion, lifestyle, and artisan goods.'
  },
  {
    id: 'fraunces-dmsans',
    name: 'Fraunces + DM Sans',
    vibe: 'Artisan & Warm',
    displayFont: 'Fraunces',
    headingFont: 'Fraunces',
    bodyFont: 'DM Sans',
    monoFont: 'JetBrains Mono',
    scaleRatio: 1.25,
    headingWeight: '600',
    bodyWeight: '400',
    description: 'Distinctive variable serif with tactile organic curves. Perfect for boutique coffee, ceramics, architecture, and bookstores.'
  },
  {
    id: 'jakarta-clean',
    name: 'Plus Jakarta Sans Dual',
    vibe: 'Clean Product-Led',
    displayFont: 'Plus Jakarta Sans',
    headingFont: 'Plus Jakarta Sans',
    bodyFont: 'Plus Jakarta Sans',
    monoFont: 'JetBrains Mono',
    scaleRatio: 1.25,
    headingWeight: '700',
    bodyWeight: '400',
    description: 'Unified contemporary neo-grotesque across display, headings, and UI. Seamless readability and bulletproof consistency.'
  },
  {
    id: 'outfit-technical',
    name: 'Outfit + JetBrains Mono Lead',
    vibe: 'Technical & Futuristic',
    displayFont: 'Outfit',
    headingFont: 'Outfit',
    bodyFont: 'Plus Jakarta Sans',
    monoFont: 'JetBrains Mono',
    scaleRatio: 1.20,
    headingWeight: '600',
    bodyWeight: '400',
    description: 'Sharp, geometric proportions paired with precision monospaced accents. Built for developer consoles and AI products.'
  }
];

export const AVAILABLE_FONTS = [
  'Plus Jakarta Sans',
  'Outfit',
  'DM Sans',
  'Playfair Display',
  'Fraunces',
  'JetBrains Mono'
];
