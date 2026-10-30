import { CategoryId, DesignTokens } from '../../tokens/types';

export interface GenreConfig {
  id: string;
  category: CategoryId;
  label: string;
  description: string;
  heroImage: string;
  fontRecommendationTags: string[];
  density: 'airy' | 'balanced' | 'compact';
  componentPack: string[];
  defaults?: Partial<DesignTokens>;
}

export const GENRE_CONFIGS: Record<string, GenreConfig> = {
  // 1. Commerce (4)
  'ceramics-atelier': {
    id: 'ceramics-atelier',
    category: 'commerce',
    label: 'Ceramics Atelier & Craft',
    description: 'Handcrafted stoneware vessels, mineral glazes, and physical craft.',
    heroImage: '/src/assets/images/preview_ecommerce_ceramics_1792316645917.jpg',
    fontRecommendationTags: ['luxury', 'editorial', 'humanist'],
    density: 'airy',
    componentPack: ['cards', 'buttons', 'badges']
  },
  'fashion-store': {
    id: 'fashion-store',
    category: 'commerce',
    label: 'Luxury Fashion & Apparel',
    description: 'Minimalist editorial runway releases, seasonal lookbooks, and garments.',
    heroImage: '/src/assets/images/preview_editorial_arch_1792316647413.jpg',
    fontRecommendationTags: ['luxury', 'editorial', 'minimal'],
    density: 'airy',
    componentPack: ['cards', 'buttons', 'badges']
  },
  'electronics-hardware': {
    id: 'electronics-hardware',
    category: 'commerce',
    label: 'Precision Hardware & Audio',
    description: 'Anodized aluminum acoustics, industrial ergonomics, and technical specs.',
    heroImage: '/src/assets/images/preview_saas_metrics_1792316645998.jpg',
    fontRecommendationTags: ['tech', 'geometric', 'minimal'],
    density: 'compact',
    componentPack: ['badges', 'buttons', 'tables']
  },
  'beauty-skincare': {
    id: 'beauty-skincare',
    category: 'commerce',
    label: 'Organic Botanical Skincare',
    description: 'Clean clinical formulations, botanical serums, and gentle aesthetics.',
    heroImage: '/src/assets/images/preview_ecommerce_ceramics_1792316645917.jpg',
    fontRecommendationTags: ['soft', 'luxury', 'humanist'],
    density: 'balanced',
    componentPack: ['cards', 'badges', 'buttons']
  },

  // 2. SaaS (4)
  'dashboard-app': {
    id: 'dashboard-app',
    category: 'saas',
    label: 'Cloud Analytics & Dashboard',
    description: 'Real-time telemetry, visual metrics, and high-density operator tables.',
    heroImage: '/src/assets/images/preview_saas_metrics_1792316645998.jpg',
    fontRecommendationTags: ['tech', 'geometric', 'neutral'],
    density: 'compact',
    componentPack: ['tables', 'badges', 'inputs']
  },
  'dev-tools': {
    id: 'dev-tools',
    category: 'saas',
    label: 'Developer Platform & CLI',
    description: 'Command line APIs, monorepo orchestration, and token pipelines.',
    heroImage: '/src/assets/images/preview_saas_metrics_1792316645998.jpg',
    fontRecommendationTags: ['tech', 'mono', 'geometric'],
    density: 'compact',
    componentPack: ['code', 'inputs', 'buttons']
  },
  'ai-product': {
    id: 'ai-product',
    category: 'saas',
    label: 'Generative AI Workspace',
    description: 'Neural agent runtime, multimodal intelligence, and conversational flow.',
    heroImage: '/src/assets/images/hero_founder_studio_1792316645323.jpg',
    fontRecommendationTags: ['tech', 'bold', 'futuristic'],
    density: 'balanced',
    componentPack: ['inputs', 'buttons', 'badges']
  },
  'b2b-platform': {
    id: 'b2b-platform',
    category: 'saas',
    label: 'Enterprise Supply Platform',
    description: 'Multilateral trade logistics, compliance workflows, and global ledger.',
    heroImage: '/src/assets/images/preview_saas_metrics_1792316645998.jpg',
    fontRecommendationTags: ['formal', 'neutral', 'geometric'],
    density: 'balanced',
    componentPack: ['tables', 'inputs', 'buttons']
  },

  // 3. Portfolio (4)
  'designer-portfolio': {
    id: 'designer-portfolio',
    category: 'portfolio',
    label: 'Product Design Monograph',
    description: 'Case studies, typography systems, and interaction design portfolios.',
    heroImage: '/src/assets/images/preview_editorial_arch_1792316647413.jpg',
    fontRecommendationTags: ['editorial', 'luxury', 'geometric'],
    density: 'airy',
    componentPack: ['gallery', 'cards']
  },
  'photographer-portfolio': {
    id: 'photographer-portfolio',
    category: 'portfolio',
    label: 'Photographic Archive',
    description: 'Medium format exhibitions, natural lighting, and high-res photo grids.',
    heroImage: '/src/assets/images/hero_founder_studio_1792316645323.jpg',
    fontRecommendationTags: ['minimal', 'editorial', 'neutral'],
    density: 'airy',
    componentPack: ['gallery', 'cards']
  },
  'developer-portfolio': {
    id: 'developer-portfolio',
    category: 'portfolio',
    label: 'Systems Architect Portfolio',
    description: 'Open source repositories, WebGL spatial prototypes, and engineering logs.',
    heroImage: '/src/assets/images/preview_saas_metrics_1792316645998.jpg',
    fontRecommendationTags: ['mono', 'tech', 'geometric'],
    density: 'compact',
    componentPack: ['code', 'badges']
  },
  'creative-agency': {
    id: 'creative-agency',
    category: 'portfolio',
    label: 'Multidisciplinary Agency',
    description: 'Brand identity, creative direction, spatial installations, and digital flagship sites.',
    heroImage: '/src/assets/images/preview_editorial_arch_1792316647413.jpg',
    fontRecommendationTags: ['bold', 'editorial', 'luxury'],
    density: 'balanced',
    componentPack: ['gallery', 'buttons']
  },

  // 4. Publishing (4)
  'literary-magazine': {
    id: 'literary-magazine',
    category: 'publishing',
    label: 'Literary & Cultural Quarterly',
    description: 'Long-form fiction, philosophical criticism, and typographic essays.',
    heroImage: '/src/assets/images/preview_editorial_arch_1792316647413.jpg',
    fontRecommendationTags: ['editorial', 'serif', 'luxury'],
    density: 'airy',
    componentPack: ['article', 'badges']
  },
  'tech-blog': {
    id: 'tech-blog',
    category: 'publishing',
    label: 'Engineering Tech Journal',
    description: 'Deep dives on compiler design, distributed systems, and UI architecture.',
    heroImage: '/src/assets/images/preview_saas_metrics_1792316645998.jpg',
    fontRecommendationTags: ['geometric', 'mono', 'tech'],
    density: 'balanced',
    componentPack: ['code', 'article']
  },
  'news-journal': {
    id: 'news-journal',
    category: 'publishing',
    label: 'Independent News Daily',
    description: 'Investigative reporting, multi-column dispatches, and urgent analysis.',
    heroImage: '/src/assets/images/preview_editorial_arch_1792316647413.jpg',
    fontRecommendationTags: ['editorial', 'formal', 'serif'],
    density: 'compact',
    componentPack: ['article', 'badges']
  },
  'curated-newsletter': {
    id: 'curated-newsletter',
    category: 'publishing',
    label: 'Curated Weekly Digest',
    description: 'Design theory, startup memos, and cultural recommendations in your inbox.',
    heroImage: '/src/assets/images/hero_founder_studio_1792316645323.jpg',
    fontRecommendationTags: ['humanist', 'friendly', 'editorial'],
    density: 'balanced',
    componentPack: ['inputs', 'buttons']
  },

  // 5. Hospitality (4)
  'boutique-hotel': {
    id: 'boutique-hotel',
    category: 'hospitality',
    label: 'Boutique Heritage Hotel',
    description: 'Historic stone courtyards, custom linens, and secluded private gardens.',
    heroImage: '/src/assets/images/hero_founder_studio_1792316645323.jpg',
    fontRecommendationTags: ['luxury', 'editorial', 'serif'],
    density: 'airy',
    componentPack: ['booking', 'gallery']
  },
  'fine-dining': {
    id: 'fine-dining',
    category: 'hospitality',
    label: 'Michelin-Starred Restaurant',
    description: 'Foraged micro-seasonal menus, rare cellar vintages, and chef pairings.',
    heroImage: '/src/assets/images/preview_ecommerce_ceramics_1792316645917.jpg',
    fontRecommendationTags: ['luxury', 'serif', 'formal'],
    density: 'airy',
    componentPack: ['booking', 'cards']
  },
  'artisanal-cafe': {
    id: 'artisanal-cafe',
    category: 'hospitality',
    label: 'Specialty Roastery & Café',
    description: 'Single-origin espresso, sourdough pastries, and sunlit community spaces.',
    heroImage: '/src/assets/images/preview_ecommerce_ceramics_1792316645917.jpg',
    fontRecommendationTags: ['friendly', 'humanist', 'playful'],
    density: 'balanced',
    componentPack: ['cards', 'buttons']
  },
  'luxury-resort': {
    id: 'luxury-resort',
    category: 'hospitality',
    label: 'Alpine Wellness Sanctuary',
    description: 'Thermal mineral baths, panoramic mountain chalets, and restorative retreats.',
    heroImage: '/src/assets/images/hero_founder_studio_1792316645323.jpg',
    fontRecommendationTags: ['luxury', 'editorial', 'soft'],
    density: 'airy',
    componentPack: ['booking', 'gallery']
  },

  // 6. Education (4)
  'online-masterclass': {
    id: 'online-masterclass',
    category: 'education',
    label: 'Executive Design Masterclass',
    description: 'Master practical design engineering alongside global industry leaders.',
    heroImage: '/src/assets/images/preview_saas_metrics_1792316645998.jpg',
    fontRecommendationTags: ['editorial', 'bold', 'geometric'],
    density: 'balanced',
    componentPack: ['courses', 'pricing']
  },
  'university-school': {
    id: 'university-school',
    category: 'education',
    label: 'Institute of Architecture & Arts',
    description: 'Accredited degree faculties, studio research fellowships, and exhibitions.',
    heroImage: '/src/assets/images/preview_editorial_arch_1792316647413.jpg',
    fontRecommendationTags: ['formal', 'serif', 'academic'],
    density: 'balanced',
    componentPack: ['courses', 'article']
  },
  'developer-bootcamp': {
    id: 'developer-bootcamp',
    category: 'education',
    label: 'Full-Stack Engineering Foundry',
    description: 'High-intensity curriculum transforming students into production software engineers.',
    heroImage: '/src/assets/images/preview_saas_metrics_1792316645998.jpg',
    fontRecommendationTags: ['tech', 'geometric', 'mono'],
    density: 'compact',
    componentPack: ['courses', 'badges']
  },
  'coaching-academy': {
    id: 'coaching-academy',
    category: 'education',
    label: 'Leadership Coaching Collective',
    description: 'Mindset conditioning, venture strategy, and high-performance founder guidance.',
    heroImage: '/src/assets/images/hero_founder_studio_1792316645323.jpg',
    fontRecommendationTags: ['humanist', 'friendly', 'bold'],
    density: 'balanced',
    componentPack: ['pricing', 'testimonials']
  },

  // 7. Architecture (4)
  'spatial-studio': {
    id: 'spatial-studio',
    category: 'architecture',
    label: 'Contemporary Architecture Practice',
    description: 'Private residences, civic pavilions, and monolithic stone structures.',
    heroImage: '/src/assets/images/preview_editorial_arch_1792316647413.jpg',
    fontRecommendationTags: ['minimal', 'editorial', 'geometric'],
    density: 'airy',
    componentPack: ['projects', 'gallery']
  },
  'real-estate-estate': {
    id: 'real-estate-estate',
    category: 'architecture',
    label: 'Architectural Real Estate',
    description: 'Curated architectural listings, modernist villas, and private islands.',
    heroImage: '/src/assets/images/hero_founder_studio_1792316645323.jpg',
    fontRecommendationTags: ['luxury', 'formal', 'serif'],
    density: 'airy',
    componentPack: ['cards', 'gallery']
  },
  'interior-design': {
    id: 'interior-design',
    category: 'architecture',
    label: 'Bespoke Interior Studio',
    description: 'Textile curation, custom millwork, and private residence styling.',
    heroImage: '/src/assets/images/preview_ecommerce_ceramics_1792316645917.jpg',
    fontRecommendationTags: ['luxury', 'humanist', 'soft'],
    density: 'airy',
    componentPack: ['gallery', 'testimonials']
  },
  'landscape-pavilion': {
    id: 'landscape-pavilion',
    category: 'architecture',
    label: 'Ecological Landscape Practice',
    description: 'Botanical sanctuaries, restored wetlands, and sustainable public parks.',
    heroImage: '/src/assets/images/preview_editorial_arch_1792316647413.jpg',
    fontRecommendationTags: ['organic', 'humanist', 'editorial'],
    density: 'balanced',
    componentPack: ['projects', 'gallery']
  },

  // 8. Finance (4)
  'fintech-app': {
    id: 'fintech-app',
    category: 'finance',
    label: 'Global Payments & Multi-Currency',
    description: 'Cross-border remittances, business corporate cards, and treasury yield.',
    heroImage: '/src/assets/images/preview_saas_metrics_1792316645998.jpg',
    fontRecommendationTags: ['geometric', 'tech', 'neutral'],
    density: 'compact',
    componentPack: ['stats', 'pricing', 'tables']
  },
  'venture-capital': {
    id: 'venture-capital',
    category: 'finance',
    label: 'Venture Syndicate & Early Fund',
    description: 'Backing foundational technology founders from genesis to public liquidity.',
    heroImage: '/src/assets/images/hero_founder_studio_1792316645323.jpg',
    fontRecommendationTags: ['formal', 'editorial', 'bold'],
    density: 'balanced',
    componentPack: ['stats', 'testimonials']
  },
  'asset-custody': {
    id: 'asset-custody',
    category: 'finance',
    label: 'Institutional Asset Custody',
    description: 'Cryptographic security vaults, multi-signatory quorum, and audit assurance.',
    heroImage: '/src/assets/images/preview_saas_metrics_1792316645998.jpg',
    fontRecommendationTags: ['tech', 'formal', 'mono'],
    density: 'compact',
    componentPack: ['stats', 'badges']
  },
  'neobank': {
    id: 'neobank',
    category: 'finance',
    label: 'Next-Generation Private Bank',
    description: 'Concierge wealth management, digital equities, and family trusts.',
    heroImage: '/src/assets/images/preview_editorial_arch_1792316647413.jpg',
    fontRecommendationTags: ['luxury', 'geometric', 'formal'],
    density: 'balanced',
    componentPack: ['stats', 'pricing']
  }
};

export const CATEGORIES_LIST: Array<{ id: CategoryId; label: string; description: string; icon: string }> = [
  { id: 'commerce', label: 'Commerce & Retail', description: 'Curated shops, stoneware ateliers, luxury goods', icon: 'ShoppingBag' },
  { id: 'saas', label: 'SaaS & Developer Tech', description: 'Cloud analytics, dev tools, AI platforms', icon: 'Layers' },
  { id: 'portfolio', label: 'Portfolio & Creative', description: 'Design directors, architects, studios, photographers', icon: 'Sparkles' },
  { id: 'publishing', label: 'Publishing & Editorial', description: 'Literary magazines, technical journals, essays', icon: 'BookOpen' },
  { id: 'hospitality', label: 'Hospitality & Dining', description: 'Boutique hotels, fine dining, private resorts', icon: 'Utensils' },
  { id: 'education', label: 'Education & Academies', description: 'Online cohorts, schools, masterclasses', icon: 'GraduationCap' },
  { id: 'architecture', label: 'Architecture & Spaces', description: 'Spatial studios, interior design, landscape pavilions', icon: 'Compass' },
  { id: 'finance', label: 'Finance & Capital', description: 'Fintech apps, venture syndicates, asset custody', icon: 'TrendingUp' }
];

export function getGenresForCategory(category: CategoryId): GenreConfig[] {
  return Object.values(GENRE_CONFIGS).filter(g => g.category === category);
}

export function getGenreById(id: string): GenreConfig {
  return GENRE_CONFIGS[id] || GENRE_CONFIGS['ceramics-atelier'];
}

