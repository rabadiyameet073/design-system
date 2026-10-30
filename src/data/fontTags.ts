export const FONT_TAGS: Record<string, string[]> = {
  // Serifs / Editorial / Luxury
  'Fraunces': ['luxury', 'editorial', 'serif', 'warm', 'artisanal'],
  'Playfair Display': ['luxury', 'editorial', 'serif', 'formal', 'high-contrast'],
  'Cormorant Garamond': ['luxury', 'editorial', 'serif', 'literary', 'refined'],
  'Newsreader': ['editorial', 'literary', 'serif', 'long-form', 'academic'],
  'Source Serif 4': ['editorial', 'formal', 'serif', 'book', 'structured'],
  'Instrument Serif': ['editorial', 'luxury', 'serif', 'arts', 'expressive'],
  'Cinzel': ['luxury', 'formal', 'serif', 'classical'],
  'Bodoni Moda': ['luxury', 'fashion', 'serif', 'high-contrast'],
  'Prata': ['luxury', 'editorial', 'serif'],

  // Sans / Geometric / Tech / Modern
  'Inter': ['neutral', 'clean', 'tech', 'ui', 'geometric', 'highly-legible'],
  'DM Sans': ['geometric', 'friendly', 'modern', 'humanist', 'ui'],
  'Plus Jakarta Sans': ['geometric', 'modern', 'tech', 'warm', 'ui'],
  'Geist': ['tech', 'geometric', 'minimal', 'dev-tools', 'modern'],
  'Space Grotesk': ['tech', 'futuristic', 'geometric', 'brutalist'],
  'Syne': ['creative', 'arts', 'bold', 'expressive', 'avant-garde'],
  'Bricolage Grotesque': ['creative', 'quirky', 'editorial', 'modern'],
  'Outfit': ['geometric', 'minimal', 'modern', 'friendly', 'architectural'],
  'Manrope': ['geometric', 'commerce', 'modern', 'clean', 'ui'],
  'Work Sans': ['humanist', 'clean', 'versatile', 'modern'],
  'Lexend': ['accessible', 'education', 'friendly', 'reading-optimized'],
  'Nunito': ['friendly', 'rounded', 'playful', 'soft'],
  'Atkinson Hyperlegible': ['accessible', 'education', 'high-legibility'],
  'Michroma': ['tech', 'futuristic', 'automotive', 'display', 'cyber'],

  // Monospace / Code
  'JetBrains Mono': ['mono', 'tech', 'code', 'precise'],
  'IBM Plex Mono': ['mono', 'tech', 'code', 'structured', 'industrial'],
  'Fira Code': ['mono', 'tech', 'code'],
  'Space Mono': ['mono', 'brutalist', 'editorial'],

  // Multi-script: Indic / Devanagari / Gujarati
  'Noto Sans Devanagari': ['devanagari', 'indic', 'neutral', 'accessible'],
  'Noto Serif Devanagari': ['devanagari', 'indic', 'editorial', 'serif'],
  'Noto Sans Gujarati': ['gujarati', 'indic', 'neutral', 'accessible'],
  'Noto Serif Gujarati': ['gujarati', 'indic', 'editorial', 'serif'],
  'Poppins': ['geometric', 'devanagari', 'modern', 'friendly', 'ui'],
  'Mukta': ['devanagari', 'humanist', 'clean', 'ui'],
  'Hind': ['devanagari', 'ui', 'neutral', 'clean']
};

export function tagsFor(family: string, category?: string): string[] {
  if (FONT_TAGS[family]) return FONT_TAGS[family];
  const cat = category || 'sans-serif';
  if (cat === 'serif') return ['editorial', 'classic', 'serif'];
  if (cat === 'monospace') return ['mono', 'tech', 'code'];
  if (cat === 'display') return ['display', 'bold', 'expressive'];
  if (cat === 'handwriting') return ['handwriting', 'playful', 'casual'];
  return ['neutral', 'modern', 'ui'];
}

