import { VisualDirection } from '../types/designSystem';

export const VISUAL_DIRECTIONS: VisualDirection[] = [
  {
    id: 'modern-product',
    name: 'Modern Product-Led',
    tagline: 'Crisp, structured, and benefit-focused',
    description: 'Generous breathing room, clean hairline dividers, subtle surface elevations, and focused interactive highlights.',
    aesthetic: 'Geometric sans typography, neutral canvas with vivid action accents, structured grid rhythm.',
    recommendedPaletteId: 'indigo-flow',
    recommendedPairingId: 'outfit-jakarta'
  },
  {
    id: 'minimal-editorial',
    name: 'Minimal Editorial',
    tagline: 'Quiet luxury, literary typography, and deliberate spacing',
    description: 'Rooted in classic editorial art direction, spacious asymmetric columns, and timeless black, stone, and terracotta notes.',
    aesthetic: 'Display serifs, unboxed metadata, wide margins, and refined tactile textures.',
    recommendedPaletteId: 'warm-terracotta',
    recommendedPairingId: 'fraunces-dmsans'
  },
  {
    id: 'premium-luxury',
    name: 'Premium Luxury',
    tagline: 'Understated prestige, aged gold, and architectural restraint',
    description: 'Curated showcases, high-contrast dark accents, warm champagne tones, and deliberate micro-interactions.',
    aesthetic: 'Serif display typography, restrained color usage, hairline borders, and subtle gold accents.',
    recommendedPaletteId: 'champagne-noir',
    recommendedPairingId: 'playfair-dmsans'
  },
  {
    id: 'warm-approachable',
    name: 'Warm & Approachable',
    tagline: 'Friendly, inviting, human, and authentic',
    description: 'Warm cream backgrounds, soft terracotta or amber hues, comfortable typography, and rounded corners.',
    aesthetic: 'Soft neutral canvas, friendly grotesque sans, rounded cards, and natural daylight imagery.',
    recommendedPaletteId: 'amber-focus',
    recommendedPairingId: 'outfit-jakarta'
  },
  {
    id: 'clean-tech',
    name: 'Clean Technical',
    tagline: 'Precision engineered, data-dense, and futuristic',
    description: 'Graphite slate surfaces, cyan and teal data glows, tabular figures, and sharp modular cards.',
    aesthetic: 'Geometric sans with tabular mono accents, dark/slate contrast, and precision indicators.',
    recommendedPaletteId: 'electric-teal',
    recommendedPairingId: 'outfit-technical'
  },
  {
    id: 'bold-commercial',
    name: 'Bold Commercial',
    tagline: 'Energetic, high-contrast, and action-oriented',
    description: 'Dynamic orange accents, punchy headlines, clear social proof, and commanding call-to-actions.',
    aesthetic: 'Thick headline weights, high-saturation accents, tight card grids, and high velocity.',
    recommendedPaletteId: 'tangerine-energy',
    recommendedPairingId: 'jakarta-clean'
  },
  {
    id: 'clean-corporate',
    name: 'Authoritative Corporate',
    tagline: 'Institutional trust, structured compliance, and clarity',
    description: 'Deep navy tones, structured service rows, certified credibility badges, and predictable navigation.',
    aesthetic: 'Trustworthy corporate blues, crisp white surfaces, strict alignment, and executive polish.',
    recommendedPaletteId: 'corporate-navy',
    recommendedPairingId: 'outfit-jakarta'
  },
  {
    id: 'nature-inspired',
    name: 'Nature-Inspired Botanical',
    tagline: 'Organic, sustainable, tranquil, and grounded',
    description: 'Forest greens, natural clay, earth tones, and breathing space inspired by biophilic architecture.',
    aesthetic: 'Deep moss greens, linen backdrops, soft organic curves, and calm rhythm.',
    recommendedPaletteId: 'forest-clay',
    recommendedPairingId: 'fraunces-dmsans'
  }
];
