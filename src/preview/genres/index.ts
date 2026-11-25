import { CategoryId, DesignTokens } from '../../tokens/types';
import { SECTION_REGISTRY } from '../sections';
import { createGenreDefaults } from './defaultsHelper';

export interface SectionRef {
  id: string;
  component: keyof typeof SECTION_REGISTRY;
  props?: Record<string, unknown>;
}

export interface GenreConfig {
  id: string;
  category: CategoryId;
  label: string;
  description: string;
  heroImage: string;
  fontRecommendationTags: string[];
  density: 'airy' | 'balanced' | 'compact';
  componentPack: string[];
  copyFile?: string;
  sections?: SectionRef[];
  defaults?: Partial<DesignTokens>;
}

export const GENRE_CONFIGS: Record<string, GenreConfig> = {
  // ================= 1. COMMERCE (4) =================
  'ceramics-atelier': {
    id: 'ceramics-atelier',
    category: 'commerce',
    label: 'Ceramics Atelier & Craft',
    description: 'Handcrafted stoneware vessels, mineral glazes, and physical craft.',
    heroImage: '/src/assets/images/preview_ecommerce_ceramics_1792316645917.jpg',
    fontRecommendationTags: ['luxury', 'editorial', 'humanist'],
    density: 'airy',
    componentPack: ['cards', 'buttons', 'badges'],
    copyFile: 'commerce.json',
    defaults: createGenreDefaults({
      brandHex: '#B7410E',
      accentHex: '#2563EB',
      displayFont: 'Cormorant Garamond',
      headingFont: 'Cormorant Garamond',
      bodyFont: 'Lato',
      scaleRatio: 1.333,
      radiusKey: 'subtle',
      density: 'airy',
      buttonStyle: 'solid',
      imageryTreatment: 'natural'
    })
  },
  'fashion-store': {
    id: 'fashion-store',
    category: 'commerce',
    label: 'Luxury Fashion & Apparel',
    description: 'Minimalist editorial runway releases, seasonal lookbooks, and garments.',
    heroImage: '/src/assets/images/preview_editorial_arch_1792316647413.jpg',
    fontRecommendationTags: ['luxury', 'editorial', 'minimal'],
    density: 'airy',
    componentPack: ['cards', 'buttons', 'badges'],
    copyFile: 'commerce.json',
    defaults: createGenreDefaults({
      brandHex: '#18181B',
      accentHex: '#A1824A',
      displayFont: 'Playfair Display',
      headingFont: 'Playfair Display',
      bodyFont: 'DM Sans',
      scaleRatio: 1.333,
      radiusKey: 'subtle',
      density: 'airy',
      buttonStyle: 'minimal',
      imageryTreatment: 'mono'
    })
  },
  'electronics-hardware': {
    id: 'electronics-hardware',
    category: 'commerce',
    label: 'Precision Hardware & Audio',
    description: 'Anodized aluminum acoustics, industrial ergonomics, and technical specs.',
    heroImage: '/src/assets/images/preview_saas_metrics_1792316645998.jpg',
    fontRecommendationTags: ['tech', 'geometric', 'minimal'],
    density: 'compact',
    componentPack: ['badges', 'buttons', 'tables'],
    copyFile: 'commerce.json',
    defaults: createGenreDefaults({
      brandHex: '#1E293B',
      accentHex: '#06B6D4',
      displayFont: 'Outfit',
      headingFont: 'Outfit',
      bodyFont: 'JetBrains Mono',
      monoFont: 'JetBrains Mono',
      scaleRatio: 1.2,
      radiusKey: 'rounded',
      density: 'compact',
      buttonStyle: 'solid',
      imageryTreatment: 'natural'
    })
  },
  'beauty-skincare': {
    id: 'beauty-skincare',
    category: 'commerce',
    label: 'Organic Botanical Skincare',
    description: 'Clean clinical formulations, botanical serums, and gentle aesthetics.',
    heroImage: '/src/assets/images/preview_ecommerce_ceramics_1792316645917.jpg',
    fontRecommendationTags: ['soft', 'luxury', 'humanist'],
    density: 'balanced',
    componentPack: ['cards', 'badges', 'buttons'],
    copyFile: 'commerce.json',
    defaults: createGenreDefaults({
      brandHex: '#9F4A54',
      accentHex: '#4D7C0F',
      displayFont: 'Fraunces',
      headingFont: 'Fraunces',
      bodyFont: 'Plus Jakarta Sans',
      scaleRatio: 1.25,
      radiusKey: 'rounded',
      density: 'balanced',
      buttonStyle: 'subtle',
      imageryTreatment: 'natural'
    })
  },

  // ================= 2. SAAS (4) =================
  'dashboard-app': {
    id: 'dashboard-app',
    category: 'saas',
    label: 'Cloud Analytics & Dashboard',
    description: 'Real-time telemetry, visual metrics, and high-density operator tables.',
    heroImage: '/src/assets/images/preview_saas_metrics_1792316645998.jpg',
    fontRecommendationTags: ['tech', 'geometric', 'neutral'],
    density: 'compact',
    componentPack: ['tables', 'badges', 'inputs'],
    copyFile: 'saas.json',
    defaults: createGenreDefaults({
      brandHex: '#4F46E5',
      accentHex: '#10B981',
      displayFont: 'Inter',
      headingFont: 'Inter',
      bodyFont: 'Inter',
      scaleRatio: 1.2,
      radiusKey: 'rounded',
      density: 'compact',
      buttonStyle: 'solid'
    })
  },
  'dev-tools': {
    id: 'dev-tools',
    category: 'saas',
    label: 'Developer Platform & CLI',
    description: 'Command line APIs, monorepo orchestration, and token pipelines.',
    heroImage: '/src/assets/images/preview_saas_metrics_1792316645998.jpg',
    fontRecommendationTags: ['tech', 'mono', 'geometric'],
    density: 'compact',
    componentPack: ['code', 'inputs', 'buttons'],
    copyFile: 'saas.json',
    defaults: createGenreDefaults({
      brandHex: '#0F172A',
      accentHex: '#8B5CF6',
      displayFont: 'JetBrains Mono',
      headingFont: 'Inter',
      bodyFont: 'Inter',
      monoFont: 'JetBrains Mono',
      scaleRatio: 1.2,
      radiusKey: 'subtle',
      density: 'compact',
      buttonStyle: 'outline'
    })
  },
  'ai-product': {
    id: 'ai-product',
    category: 'saas',
    label: 'Generative AI Workspace',
    description: 'Neural agent runtime, multimodal intelligence, and conversational flow.',
    heroImage: '/src/assets/images/hero_founder_studio_1792316645323.jpg',
    fontRecommendationTags: ['tech', 'bold', 'futuristic'],
    density: 'balanced',
    componentPack: ['inputs', 'buttons', 'badges'],
    copyFile: 'saas.json',
    defaults: createGenreDefaults({
      brandHex: '#6366F1',
      accentHex: '#06B6D4',
      displayFont: 'Plus Jakarta Sans',
      headingFont: 'Plus Jakarta Sans',
      bodyFont: 'Inter',
      scaleRatio: 1.25,
      radiusKey: 'rounded',
      density: 'balanced',
      buttonStyle: 'solid'
    })
  },
  'b2b-platform': {
    id: 'b2b-platform',
    category: 'saas',
    label: 'Enterprise Supply Platform',
    description: 'Multilateral trade logistics, compliance workflows, and global ledger.',
    heroImage: '/src/assets/images/preview_saas_metrics_1792316645998.jpg',
    fontRecommendationTags: ['formal', 'neutral', 'geometric'],
    density: 'balanced',
    componentPack: ['tables', 'inputs', 'buttons'],
    copyFile: 'saas.json',
    defaults: createGenreDefaults({
      brandHex: '#1E3A8A',
      accentHex: '#0284C7',
      displayFont: 'Inter',
      headingFont: 'Inter',
      bodyFont: 'Inter',
      scaleRatio: 1.25,
      radiusKey: 'rounded',
      density: 'balanced',
      buttonStyle: 'solid'
    })
  },

  // ================= 3. PORTFOLIO (4) =================
  'designer-portfolio': {
    id: 'designer-portfolio',
    category: 'portfolio',
    label: 'Product Design Monograph',
    description: 'Case studies, typography systems, and interaction design portfolios.',
    heroImage: '/src/assets/images/preview_editorial_arch_1792316647413.jpg',
    fontRecommendationTags: ['editorial', 'luxury', 'geometric'],
    density: 'airy',
    componentPack: ['gallery', 'cards'],
    copyFile: 'portfolio.json',
    defaults: createGenreDefaults({
      brandHex: '#09090B',
      accentHex: '#F59E0B',
      displayFont: 'Space Grotesk',
      headingFont: 'Space Grotesk',
      bodyFont: 'Plus Jakarta Sans',
      scaleRatio: 1.333,
      radiusKey: 'rounded',
      density: 'airy',
      buttonStyle: 'minimal'
    })
  },
  'photographer-portfolio': {
    id: 'photographer-portfolio',
    category: 'portfolio',
    label: 'Photographic Archive',
    description: 'Medium format exhibitions, natural lighting, and high-res photo grids.',
    heroImage: '/src/assets/images/hero_founder_studio_1792316645323.jpg',
    fontRecommendationTags: ['minimal', 'editorial', 'neutral'],
    density: 'airy',
    componentPack: ['gallery', 'cards'],
    copyFile: 'portfolio.json',
    defaults: createGenreDefaults({
      brandHex: '#121212',
      accentHex: '#E5E7EB',
      displayFont: 'Playfair Display',
      headingFont: 'Playfair Display',
      bodyFont: 'Lato',
      scaleRatio: 1.333,
      radiusKey: 'sharp',
      density: 'airy',
      buttonStyle: 'minimal',
      imageryTreatment: 'duotone'
    })
  },
  'developer-portfolio': {
    id: 'developer-portfolio',
    category: 'portfolio',
    label: 'Systems Architect Portfolio',
    description: 'Open source repositories, WebGL spatial prototypes, and engineering logs.',
    heroImage: '/src/assets/images/preview_saas_metrics_1792316645998.jpg',
    fontRecommendationTags: ['mono', 'tech', 'geometric'],
    density: 'compact',
    componentPack: ['code', 'badges'],
    copyFile: 'portfolio.json',
    defaults: createGenreDefaults({
      brandHex: '#18181B',
      accentHex: '#10B981',
      displayFont: 'JetBrains Mono',
      headingFont: 'JetBrains Mono',
      bodyFont: 'Inter',
      monoFont: 'JetBrains Mono',
      scaleRatio: 1.2,
      radiusKey: 'rounded',
      density: 'compact',
      buttonStyle: 'outline'
    })
  },
  'creative-agency': {
    id: 'creative-agency',
    category: 'portfolio',
    label: 'Multidisciplinary Agency',
    description: 'Brand identity, creative direction, spatial installations, and digital flagship sites.',
    heroImage: '/src/assets/images/preview_editorial_arch_1792316647413.jpg',
    fontRecommendationTags: ['bold', 'editorial', 'luxury'],
    density: 'balanced',
    componentPack: ['gallery', 'buttons'],
    copyFile: 'portfolio.json',
    defaults: createGenreDefaults({
      brandHex: '#E11D48',
      accentHex: '#2563EB',
      displayFont: 'Space Grotesk',
      headingFont: 'Space Grotesk',
      bodyFont: 'DM Sans',
      scaleRatio: 1.25,
      radiusKey: 'rounded',
      density: 'balanced',
      buttonStyle: 'solid'
    })
  },

  // ================= 4. PUBLISHING (4) =================
  'literary-magazine': {
    id: 'literary-magazine',
    category: 'publishing',
    label: 'Literary & Cultural Quarterly',
    description: 'Long-form fiction, philosophical criticism, and typographic essays.',
    heroImage: '/src/assets/images/preview_editorial_arch_1792316647413.jpg',
    fontRecommendationTags: ['editorial', 'serif', 'luxury'],
    density: 'airy',
    componentPack: ['article', 'badges'],
    copyFile: 'publishing.json',
    defaults: createGenreDefaults({
      brandHex: '#1C1917',
      accentHex: '#991B1B',
      displayFont: 'Newsreader',
      headingFont: 'Newsreader',
      bodyFont: 'Georgia',
      scaleRatio: 1.333,
      radiusKey: 'subtle',
      density: 'airy',
      buttonStyle: 'minimal'
    })
  },
  'tech-blog': {
    id: 'tech-blog',
    category: 'publishing',
    label: 'Engineering Tech Journal',
    description: 'Deep dives on compiler design, distributed systems, and UI architecture.',
    heroImage: '/src/assets/images/preview_saas_metrics_1792316645998.jpg',
    fontRecommendationTags: ['geometric', 'mono', 'tech'],
    density: 'balanced',
    componentPack: ['code', 'article'],
    copyFile: 'publishing.json',
    defaults: createGenreDefaults({
      brandHex: '#262626',
      accentHex: '#0891B2',
      displayFont: 'Outfit',
      headingFont: 'Outfit',
      bodyFont: 'JetBrains Mono',
      monoFont: 'JetBrains Mono',
      scaleRatio: 1.25,
      radiusKey: 'rounded',
      density: 'balanced',
      buttonStyle: 'subtle'
    })
  },
  'news-journal': {
    id: 'news-journal',
    category: 'publishing',
    label: 'Independent News Daily',
    description: 'Investigative reporting, multi-column dispatches, and urgent analysis.',
    heroImage: '/src/assets/images/preview_editorial_arch_1792316647413.jpg',
    fontRecommendationTags: ['editorial', 'formal', 'serif'],
    density: 'compact',
    componentPack: ['article', 'badges'],
    copyFile: 'publishing.json',
    defaults: createGenreDefaults({
      brandHex: '#0A0A0A',
      accentHex: '#1D4ED8',
      displayFont: 'Merriweather',
      headingFont: 'Merriweather',
      bodyFont: 'Inter',
      scaleRatio: 1.2,
      radiusKey: 'sharp',
      density: 'compact',
      buttonStyle: 'solid'
    })
  },
  'curated-newsletter': {
    id: 'curated-newsletter',
    category: 'publishing',
    label: 'Curated Weekly Digest',
    description: 'Design theory, startup memos, and cultural recommendations in your inbox.',
    heroImage: '/src/assets/images/hero_founder_studio_1792316645323.jpg',
    fontRecommendationTags: ['humanist', 'friendly', 'editorial'],
    density: 'balanced',
    componentPack: ['inputs', 'buttons'],
    copyFile: 'publishing.json',
    defaults: createGenreDefaults({
      brandHex: '#44403C',
      accentHex: '#C2410C',
      displayFont: 'Fraunces',
      headingFont: 'Fraunces',
      bodyFont: 'DM Sans',
      scaleRatio: 1.25,
      radiusKey: 'rounded',
      density: 'balanced',
      buttonStyle: 'solid'
    })
  },

  // ================= 5. HOSPITALITY (4) =================
  'boutique-hotel': {
    id: 'boutique-hotel',
    category: 'hospitality',
    label: 'Boutique Heritage Hotel',
    description: 'Historic stone courtyards, custom linens, and secluded private gardens.',
    heroImage: '/src/assets/images/hero_founder_studio_1792316645323.jpg',
    fontRecommendationTags: ['luxury', 'editorial', 'serif'],
    density: 'airy',
    componentPack: ['booking', 'gallery'],
    copyFile: 'hospitality.json',
    defaults: createGenreDefaults({
      brandHex: '#365314',
      accentHex: '#A16207',
      displayFont: 'Playfair Display',
      headingFont: 'Playfair Display',
      bodyFont: 'Cormorant Garamond',
      scaleRatio: 1.333,
      radiusKey: 'subtle',
      density: 'airy',
      buttonStyle: 'outline'
    })
  },
  'fine-dining': {
    id: 'fine-dining',
    category: 'hospitality',
    label: 'Michelin-Starred Restaurant',
    description: 'Foraged micro-seasonal menus, rare cellar vintages, and chef pairings.',
    heroImage: '/src/assets/images/preview_ecommerce_ceramics_1792316645917.jpg',
    fontRecommendationTags: ['luxury', 'serif', 'formal'],
    density: 'airy',
    componentPack: ['booking', 'cards'],
    copyFile: 'hospitality.json',
    defaults: createGenreDefaults({
      brandHex: '#020617',
      accentHex: '#CA8A04',
      displayFont: 'Cormorant Garamond',
      headingFont: 'Cormorant Garamond',
      bodyFont: 'Lato',
      scaleRatio: 1.333,
      radiusKey: 'sharp',
      density: 'airy',
      buttonStyle: 'minimal'
    })
  },
  'artisanal-cafe': {
    id: 'artisanal-cafe',
    category: 'hospitality',
    label: 'Specialty Roastery & Café',
    description: 'Single-origin espresso, sourdough pastries, and sunlit community spaces.',
    heroImage: '/src/assets/images/preview_ecommerce_ceramics_1792316645917.jpg',
    fontRecommendationTags: ['friendly', 'humanist', 'playful'],
    density: 'balanced',
    componentPack: ['cards', 'buttons'],
    copyFile: 'hospitality.json',
    defaults: createGenreDefaults({
      brandHex: '#451A03',
      accentHex: '#D97706',
      displayFont: 'Outfit',
      headingFont: 'Outfit',
      bodyFont: 'Plus Jakarta Sans',
      scaleRatio: 1.25,
      radiusKey: 'rounded',
      density: 'balanced',
      buttonStyle: 'solid'
    })
  },
  'luxury-resort': {
    id: 'luxury-resort',
    category: 'hospitality',
    label: 'Alpine Wellness Sanctuary',
    description: 'Thermal mineral baths, panoramic mountain chalets, and restorative retreats.',
    heroImage: '/src/assets/images/hero_founder_studio_1792316645323.jpg',
    fontRecommendationTags: ['luxury', 'editorial', 'soft'],
    density: 'airy',
    componentPack: ['booking', 'gallery'],
    copyFile: 'hospitality.json',
    defaults: createGenreDefaults({
      brandHex: '#134E4A',
      accentHex: '#D97706',
      displayFont: 'Fraunces',
      headingFont: 'Fraunces',
      bodyFont: 'DM Sans',
      scaleRatio: 1.333,
      radiusKey: 'rounded',
      density: 'airy',
      buttonStyle: 'subtle'
    })
  },

  // ================= 6. EDUCATION (4) =================
  'online-masterclass': {
    id: 'online-masterclass',
    category: 'education',
    label: 'Executive Design Masterclass',
    description: 'Master practical design engineering alongside global industry leaders.',
    heroImage: '/src/assets/images/preview_saas_metrics_1792316645998.jpg',
    fontRecommendationTags: ['editorial', 'bold', 'geometric'],
    density: 'balanced',
    componentPack: ['courses', 'pricing'],
    copyFile: 'education.json',
    defaults: createGenreDefaults({
      brandHex: '#1D4ED8',
      accentHex: '#F59E0B',
      displayFont: 'Plus Jakarta Sans',
      headingFont: 'Plus Jakarta Sans',
      bodyFont: 'Inter',
      scaleRatio: 1.25,
      radiusKey: 'rounded',
      density: 'balanced',
      buttonStyle: 'solid'
    })
  },
  'university-school': {
    id: 'university-school',
    category: 'education',
    label: 'Institute of Architecture & Arts',
    description: 'Accredited degree faculties, studio research fellowships, and exhibitions.',
    heroImage: '/src/assets/images/preview_editorial_arch_1792316647413.jpg',
    fontRecommendationTags: ['formal', 'serif', 'academic'],
    density: 'balanced',
    componentPack: ['courses', 'article'],
    copyFile: 'education.json',
    defaults: createGenreDefaults({
      brandHex: '#881337',
      accentHex: '#1E3A8A',
      displayFont: 'Merriweather',
      headingFont: 'Merriweather',
      bodyFont: 'Plus Jakarta Sans',
      scaleRatio: 1.25,
      radiusKey: 'subtle',
      density: 'balanced',
      buttonStyle: 'solid'
    })
  },
  'developer-bootcamp': {
    id: 'developer-bootcamp',
    category: 'education',
    label: 'Full-Stack Engineering Foundry',
    description: 'High-intensity curriculum transforming students into production software engineers.',
    heroImage: '/src/assets/images/preview_saas_metrics_1792316645998.jpg',
    fontRecommendationTags: ['tech', 'geometric', 'mono'],
    density: 'compact',
    componentPack: ['courses', 'badges'],
    copyFile: 'education.json',
    defaults: createGenreDefaults({
      brandHex: '#090D16',
      accentHex: '#10B981',
      displayFont: 'JetBrains Mono',
      headingFont: 'JetBrains Mono',
      bodyFont: 'Inter',
      monoFont: 'JetBrains Mono',
      scaleRatio: 1.2,
      radiusKey: 'rounded',
      density: 'compact',
      buttonStyle: 'solid'
    })
  },
  'coaching-academy': {
    id: 'coaching-academy',
    category: 'education',
    label: 'Leadership Coaching Collective',
    description: 'Mindset conditioning, venture strategy, and high-performance founder guidance.',
    heroImage: '/src/assets/images/hero_founder_studio_1792316645323.jpg',
    fontRecommendationTags: ['humanist', 'friendly', 'bold'],
    density: 'balanced',
    componentPack: ['pricing', 'testimonials'],
    copyFile: 'education.json',
    defaults: createGenreDefaults({
      brandHex: '#7C3AED',
      accentHex: '#D97706',
      displayFont: 'Outfit',
      headingFont: 'Outfit',
      bodyFont: 'DM Sans',
      scaleRatio: 1.25,
      radiusKey: 'rounded',
      density: 'balanced',
      buttonStyle: 'solid'
    })
  },

  // ================= 7. ARCHITECTURE (4) =================
  'spatial-studio': {
    id: 'spatial-studio',
    category: 'architecture',
    label: 'Contemporary Architecture Practice',
    description: 'Private residences, civic pavilions, and monolithic stone structures.',
    heroImage: '/src/assets/images/preview_editorial_arch_1792316647413.jpg',
    fontRecommendationTags: ['minimal', 'editorial', 'geometric'],
    density: 'airy',
    componentPack: ['projects', 'gallery'],
    copyFile: 'architecture.json',
    defaults: createGenreDefaults({
      brandHex: '#27272A',
      accentHex: '#FAFAFA',
      displayFont: 'Space Grotesk',
      headingFont: 'Space Grotesk',
      bodyFont: 'Inter',
      scaleRatio: 1.333,
      radiusKey: 'sharp',
      density: 'airy',
      buttonStyle: 'minimal'
    })
  },
  'real-estate-estate': {
    id: 'real-estate-estate',
    category: 'architecture',
    label: 'Architectural Real Estate',
    description: 'Curated architectural listings, modernist villas, and private islands.',
    heroImage: '/src/assets/images/hero_founder_studio_1792316645323.jpg',
    fontRecommendationTags: ['luxury', 'formal', 'serif'],
    density: 'airy',
    componentPack: ['cards', 'gallery'],
    copyFile: 'architecture.json',
    defaults: createGenreDefaults({
      brandHex: '#0F172A',
      accentHex: '#B45309',
      displayFont: 'Playfair Display',
      headingFont: 'Playfair Display',
      bodyFont: 'DM Sans',
      scaleRatio: 1.333,
      radiusKey: 'subtle',
      density: 'airy',
      buttonStyle: 'outline'
    })
  },
  'interior-design': {
    id: 'interior-design',
    category: 'architecture',
    label: 'Bespoke Interior Studio',
    description: 'Textile curation, custom millwork, and private residence styling.',
    heroImage: '/src/assets/images/preview_ecommerce_ceramics_1792316645917.jpg',
    fontRecommendationTags: ['luxury', 'humanist', 'soft'],
    density: 'airy',
    componentPack: ['gallery', 'testimonials'],
    copyFile: 'architecture.json',
    defaults: createGenreDefaults({
      brandHex: '#57534E',
      accentHex: '#65A30D',
      displayFont: 'Fraunces',
      headingFont: 'Fraunces',
      bodyFont: 'Plus Jakarta Sans',
      scaleRatio: 1.333,
      radiusKey: 'rounded',
      density: 'airy',
      buttonStyle: 'subtle'
    })
  },
  'landscape-pavilion': {
    id: 'landscape-pavilion',
    category: 'architecture',
    label: 'Ecological Landscape Practice',
    description: 'Botanical sanctuaries, restored wetlands, and sustainable public parks.',
    heroImage: '/src/assets/images/preview_editorial_arch_1792316647413.jpg',
    fontRecommendationTags: ['organic', 'humanist', 'editorial'],
    density: 'balanced',
    componentPack: ['projects', 'gallery'],
    copyFile: 'architecture.json',
    defaults: createGenreDefaults({
      brandHex: '#14532D',
      accentHex: '#B45309',
      displayFont: 'Outfit',
      headingFont: 'Outfit',
      bodyFont: 'Lato',
      scaleRatio: 1.25,
      radiusKey: 'rounded',
      density: 'balanced',
      buttonStyle: 'solid'
    })
  },

  // ================= 8. FINANCE (4) =================
  'fintech-app': {
    id: 'fintech-app',
    category: 'finance',
    label: 'Global Payments & Multi-Currency',
    description: 'Cross-border remittances, business corporate cards, and treasury yield.',
    heroImage: '/src/assets/images/preview_saas_metrics_1792316645998.jpg',
    fontRecommendationTags: ['geometric', 'tech', 'neutral'],
    density: 'compact',
    componentPack: ['stats', 'pricing', 'tables'],
    copyFile: 'finance.json',
    defaults: createGenreDefaults({
      brandHex: '#2563EB',
      accentHex: '#059669',
      displayFont: 'Plus Jakarta Sans',
      headingFont: 'Plus Jakarta Sans',
      bodyFont: 'Inter',
      scaleRatio: 1.2,
      radiusKey: 'rounded',
      density: 'compact',
      buttonStyle: 'solid'
    })
  },
  'venture-capital': {
    id: 'venture-capital',
    category: 'finance',
    label: 'Venture Syndicate & Early Fund',
    description: 'Backing foundational technology founders from genesis to public liquidity.',
    heroImage: '/src/assets/images/hero_founder_studio_1792316645323.jpg',
    fontRecommendationTags: ['formal', 'editorial', 'bold'],
    density: 'balanced',
    componentPack: ['stats', 'testimonials'],
    copyFile: 'finance.json',
    defaults: createGenreDefaults({
      brandHex: '#09090B',
      accentHex: '#D97706',
      displayFont: 'Newsreader',
      headingFont: 'Newsreader',
      bodyFont: 'DM Sans',
      scaleRatio: 1.25,
      radiusKey: 'subtle',
      density: 'balanced',
      buttonStyle: 'minimal'
    })
  },
  'asset-custody': {
    id: 'asset-custody',
    category: 'finance',
    label: 'Institutional Asset Custody',
    description: 'Cryptographic security vaults, multi-signatory quorum, and audit assurance.',
    heroImage: '/src/assets/images/preview_saas_metrics_1792316645998.jpg',
    fontRecommendationTags: ['tech', 'formal', 'mono'],
    density: 'compact',
    componentPack: ['stats', 'badges'],
    copyFile: 'finance.json',
    defaults: createGenreDefaults({
      brandHex: '#0F172A',
      accentHex: '#0284C7',
      displayFont: 'JetBrains Mono',
      headingFont: 'JetBrains Mono',
      bodyFont: 'Inter',
      monoFont: 'JetBrains Mono',
      scaleRatio: 1.2,
      radiusKey: 'rounded',
      density: 'compact',
      buttonStyle: 'outline'
    })
  },
  'neobank': {
    id: 'neobank',
    category: 'finance',
    label: 'Next-Generation Private Bank',
    description: 'Concierge wealth management, digital equities, and family trusts.',
    heroImage: '/src/assets/images/preview_editorial_arch_1792316647413.jpg',
    fontRecommendationTags: ['luxury', 'geometric', 'formal'],
    density: 'balanced',
    componentPack: ['stats', 'pricing'],
    copyFile: 'finance.json',
    defaults: createGenreDefaults({
      brandHex: '#4F46E5',
      accentHex: '#10B981',
      displayFont: 'Outfit',
      headingFont: 'Outfit',
      bodyFont: 'Plus Jakarta Sans',
      scaleRatio: 1.25,
      radiusKey: 'rounded',
      density: 'balanced',
      buttonStyle: 'solid'
    })
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

export const WEBSITE_TYPE_GENRE_ALIASES: Record<string, string> = {
  // Commerce
  'ecommerce': 'ceramics-atelier',
  'fashion': 'fashion-store',
  'electronics': 'electronics-hardware',
  'beauty': 'beauty-skincare',
  'luxury': 'fashion-store',
  'membership': 'fashion-store',
  'marketplace': 'ceramics-atelier',

  // SaaS & Tech
  'saas-product': 'dashboard-app',
  'ai-tool': 'ai-product',
  'admin-dashboard': 'dashboard-app',
  'startup-landing': 'dev-tools',
  'job-board': 'b2b-platform',
  'community': 'b2b-platform',
  'custom': 'dashboard-app',

  // Publishing & Media
  'documentation': 'tech-blog',
  'blog-editorial': 'literary-magazine',
  'news-media': 'news-journal',
  'nonprofit': 'curated-newsletter',

  // Education & Academies
  'education-platform': 'online-masterclass',
  'online-course': 'online-masterclass',
  'university': 'university-school',
  'academic-research': 'developer-bootcamp',

  // Portfolio & Creative
  'personal-portfolio': 'designer-portfolio',
  'developer-portfolio': 'developer-portfolio',
  'creative-portfolio': 'photographer-portfolio',
  'digital-agency': 'creative-agency',
  'corporate-business': 'creative-agency',

  // Hospitality & Dining
  'restaurant': 'fine-dining',
  'travel-booking': 'boutique-hotel',
  'healthcare': 'luxury-resort',
  'event-website': 'fine-dining',

  // Finance & Legal
  'fintech': 'fintech-app',

  // Architecture & Spaces
  'real-estate': 'real-estate-estate',
};

export function getGenresForCategory(category: CategoryId): GenreConfig[] {
  return Object.values(GENRE_CONFIGS).filter(g => g.category === category);
}

export function getGenreById(id: string): GenreConfig {
  if (!id) return GENRE_CONFIGS['ceramics-atelier'];
  if (GENRE_CONFIGS[id]) return GENRE_CONFIGS[id];
  const normalized = id.toLowerCase().trim();
  if (GENRE_CONFIGS[normalized]) return GENRE_CONFIGS[normalized];

  const aliasId = WEBSITE_TYPE_GENRE_ALIASES[normalized] || WEBSITE_TYPE_GENRE_ALIASES[id];
  if (aliasId && GENRE_CONFIGS[aliasId]) return GENRE_CONFIGS[aliasId];

  // Match if normalized matches category directly
  const byCat = Object.values(GENRE_CONFIGS).find(g => g.category.toLowerCase() === normalized);
  if (byCat) return byCat;

  // Match if any genre contains the normalized string
  const partial = Object.values(GENRE_CONFIGS).find(
    g => g.id.includes(normalized) || normalized.includes(g.id) || g.category.includes(normalized)
  );
  if (partial) return partial;

  return GENRE_CONFIGS['ceramics-atelier'];
}
