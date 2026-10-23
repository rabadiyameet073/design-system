import { DesignProject } from '../types/designSystem';
import { COLOR_PALETTES } from './palettes';
import { TYPOGRAPHY_PAIRINGS } from './typographyPairs';
import { VISUAL_DIRECTIONS } from './visualDirections';
import { WEBSITE_TYPES, WebsiteTypeDefinition } from './websiteTypes';
import { SAMPLE_PROJECT_CERAMICS, SAMPLE_PROJECT_SAAS } from './sampleProjects';

export interface ShowcasePreset {
  id: string; // websiteType.id
  projectId: string;
  label: string; // Brand Name
  typeName: string; // Website Type Title
  category: string;
  meta: string;
  description: string;
  project: DesignProject;
}

// Curated brand definitions for each website type
interface BrandProfile {
  brandName: string;
  offering: string;
  audience: string;
  primaryGoal: string;
  paletteId: string;
  directionId: string;
  pairingId: string;
  heroImage: string;
}

const BRAND_PROFILES: Record<string, BrandProfile> = {
  ecommerce: {
    brandName: 'Komorebi Studio & Ceramics',
    offering: 'Hand-thrown stoneware, tactile tea sets, and architectural pottery crafted in Kyoto and Portland.',
    audience: 'Design-conscious homeowners, architects, boutique restaurateurs, and thoughtful gift seekers.',
    primaryGoal: 'Shop Seasonal Ceramic Drops',
    paletteId: 'warm-terracotta',
    directionId: 'minimal-editorial',
    pairingId: 'fraunces-dmsans',
    heroImage: '/src/assets/images/preview_ecommerce_ceramics_1792316645917.jpg',
  },
  fashion: {
    brandName: 'Atelier Noir',
    offering: 'Architectural silhouettes, raw Japanese denim, and genderless tailoring made to outlast seasons.',
    audience: 'Designers, stylists, and conscious fashion enthusiasts.',
    primaryGoal: 'Explore Autumn Capsule Drop',
    paletteId: 'monochrome-luxury',
    directionId: 'minimal-editorial',
    pairingId: 'fraunces-dmsans',
    heroImage: '/src/assets/images/preview_ecommerce_ceramics_1792316645917.jpg',
  },
  electronics: {
    brandName: 'VoltAudio Labs',
    offering: 'Planar magnetic studio monitors and reference DACs engineered for acoustic transparency and zero distortion.',
    audience: 'Audio engineers, music producers, mastering studios, and discerning audiophiles.',
    primaryGoal: 'Discover Reference Monitors',
    paletteId: 'slate-cyan',
    directionId: 'clean-tech',
    pairingId: 'michroma-premium',
    heroImage: '/src/assets/images/preview_saas_metrics_1792316645998.jpg',
  },
  beauty: {
    brandName: 'Aura Botanica',
    offering: 'Cold-pressed botanical barrier serums formulated with clinical bioactives and fermented alpine herbs.',
    audience: 'Conscious skincare enthusiasts seeking clean, dermatologically backed restorative rituals.',
    primaryGoal: 'Shop Barrier Restorative Serums',
    paletteId: 'blush-sand',
    directionId: 'soft-neutral',
    pairingId: 'fraunces-dmsans',
    heroImage: '/src/assets/images/preview_ecommerce_ceramics_1792316645917.jpg',
  },
  luxury: {
    brandName: 'Aurelia Fine Jewelry & Horology',
    offering: 'Bespoke 18k recycled gold heirlooms and conflict-free solitaire diamonds handcrafted in Geneva.',
    audience: 'Haute horlogerie collectors, connoisseurs, and couples seeking timeless bespoke commissions.',
    primaryGoal: 'Book Atelier Consultation',
    paletteId: 'champagne-noir',
    directionId: 'premium-luxury',
    pairingId: 'playfair-dmsans',
    heroImage: '/src/assets/images/preview_editorial_arch_1792316647413.jpg',
  },
  membership: {
    brandName: 'Private Reserve Club',
    offering: 'Curated allocation of rare vintage cellars, private architectural salons, and global founder retreats.',
    audience: 'Global founders, collectors, and verified patrons.',
    primaryGoal: 'Apply For Membership Tier',
    paletteId: 'champagne-noir',
    directionId: 'premium-luxury',
    pairingId: 'playfair-dmsans',
    heroImage: '/src/assets/images/preview_editorial_arch_1792316647413.jpg',
  },
  'saas-product': {
    brandName: 'Synapse Data Flow',
    offering: 'Automated data transformation and telemetry pipelines with zero downtime and instant schema normalization.',
    audience: 'Data engineers, VP of Engineering, DevOps leads, and technical founders.',
    primaryGoal: 'Start Free Developer Trial',
    paletteId: 'indigo-flow',
    directionId: 'modern-product',
    pairingId: 'outfit-jakarta',
    heroImage: '/src/assets/images/preview_saas_metrics_1792316645998.jpg',
  },
  'ai-tool': {
    brandName: 'Cortex Neural Copilot',
    offering: 'Autonomous multi-agent workflows that inspect codebase architecture, refactor pull requests, and verify tests.',
    audience: 'AI engineers, technical leads, and rapid software shipping teams.',
    primaryGoal: 'Deploy First Autonomous Agent',
    paletteId: 'electric-teal',
    directionId: 'clean-tech',
    pairingId: 'zen-dots-michroma',
    heroImage: '/src/assets/images/preview_saas_metrics_1792316645998.jpg',
  },
  'admin-dashboard': {
    brandName: 'Pulse Telemetry Console',
    offering: 'Unified multi-cloud observability, latency anomaly detection, and executive SLA health reporting.',
    audience: 'Site reliability engineers, cloud architects, and engineering directors.',
    primaryGoal: 'Launch Real-Time Metrics Demo',
    paletteId: 'slate-cyan',
    directionId: 'clean-tech',
    pairingId: 'michroma-premium',
    heroImage: '/src/assets/images/preview_saas_metrics_1792316645998.jpg',
  },
  documentation: {
    brandName: 'Reflect API Engine',
    offering: 'Comprehensive REST and GraphQL API references, live sandboxes, and copyable webhook payload schemas.',
    audience: 'Software developers, integration architects, and enterprise partners.',
    primaryGoal: 'Explore Interactive API Explorer',
    paletteId: 'terminal-dark',
    directionId: 'clean-tech',
    pairingId: 'outfit-jakarta',
    heroImage: '/src/assets/images/preview_saas_metrics_1792316645998.jpg',
  },
  'education-platform': {
    brandName: 'Praxis Systems Academy',
    offering: 'Rigorous cohort-based courses in systems engineering, distributed databases, and high-scale architecture.',
    audience: 'Senior software developers leveling up to Staff and Principal engineering roles.',
    primaryGoal: 'Explore 2027 Cohort Curriculum',
    paletteId: 'scholar-navy',
    directionId: 'balanced-academic',
    pairingId: 'outfit-jakarta',
    heroImage: '/src/assets/images/preview_editorial_arch_1792316647413.jpg',
  },
  'online-course': {
    brandName: 'Motion Physics Mastery',
    offering: 'Interactive masterclasses on fluid web physics, WebGL fragment shaders, and micro-interaction engineering.',
    audience: 'Creative developers, UI designers, and creative technologists.',
    primaryGoal: 'Enroll In Spring Masterclass',
    paletteId: 'amber-focus',
    directionId: 'warm-approachable',
    pairingId: 'outfit-jakarta',
    heroImage: '/src/assets/images/preview_editorial_arch_1792316647413.jpg',
  },
  university: {
    brandName: 'Oxford Institute of Design',
    offering: 'Pioneering interdisciplinary research in human-computer symbiosis, computational typography, and material ethics.',
    audience: 'Undergraduate scholars, postgraduate researchers, and visiting design faculty.',
    primaryGoal: 'Discover Academic Programs',
    paletteId: 'oxford-crimson',
    directionId: 'clean-corporate',
    pairingId: 'fraunces-dmsans',
    heroImage: '/src/assets/images/preview_editorial_arch_1792316647413.jpg',
  },
  'academic-research': {
    brandName: 'BioQuantum Laboratory',
    offering: 'Open-access preprints, molecular dynamics datasets, and computational genomics publications.',
    audience: 'Biophysicists, computational biologists, and grant committees.',
    primaryGoal: 'Access Peer-Reviewed Preprints',
    paletteId: 'deep-emerald',
    directionId: 'academic-thoughtful',
    pairingId: 'fraunces-dmsans',
    heroImage: '/src/assets/images/preview_editorial_arch_1792316647413.jpg',
  },
  'personal-portfolio': {
    brandName: 'Elena Rostova',
    offering: 'Principal product designer crafting spatial interfaces, typography engines, and design systems for global brands.',
    audience: 'Product executives, early-stage founders, and design team leads.',
    primaryGoal: 'Review Selected Case Studies',
    paletteId: 'editorial-sand',
    directionId: 'minimal-editorial',
    pairingId: 'fraunces-dmsans',
    heroImage: '/src/assets/images/hero_founder_studio_1792316645323.jpg',
  },
  'developer-portfolio': {
    brandName: 'Marcus Chen',
    offering: 'Systems engineer building high-throughput consensus engines and open-source cryptographic toolkits.',
    audience: 'Core protocol developers, infrastructure recruiters, and open-source contributors.',
    primaryGoal: 'Inspect Open Source Repositories',
    paletteId: 'terminal-dark',
    directionId: 'clean-tech',
    pairingId: 'michroma-premium',
    heroImage: '/src/assets/images/preview_saas_metrics_1792316645998.jpg',
  },
  'creative-portfolio': {
    brandName: 'Studio Vektor',
    offering: 'Generative 3D art direction, architectural projections, and avant-garde brand identities.',
    audience: 'Curators, progressive fashion houses, and cultural institutions.',
    primaryGoal: 'Experience Interactive Gallery',
    paletteId: 'monochrome-luxury',
    directionId: 'artistic-portfolio',
    pairingId: 'fraunces-dmsans',
    heroImage: '/src/assets/images/preview_editorial_arch_1792316647413.jpg',
  },
  'corporate-business': {
    brandName: 'Vanguard Advisory Group',
    offering: 'Strategic corporate counsel, cross-border M&A advisory, and organizational capital transformation.',
    audience: 'Board members, enterprise CEOs, and institutional asset managers.',
    primaryGoal: 'Schedule Executive Consultation',
    paletteId: 'corporate-navy',
    directionId: 'clean-corporate',
    pairingId: 'outfit-jakarta',
    heroImage: '/src/assets/images/hero_founder_studio_1792316645323.jpg',
  },
  'digital-agency': {
    brandName: 'Kinetic Studio',
    offering: 'Full-service digital agency building category-defining brands, web applications, and hyper-growth products.',
    audience: 'Series A-C startups, scale-ups, and progressive consumer enterprises.',
    primaryGoal: 'Kickstart Project Discovery',
    paletteId: 'tangerine-energy',
    directionId: 'bold-commercial',
    pairingId: 'outfit-jakarta',
    heroImage: '/src/assets/images/hero_founder_studio_1792316645323.jpg',
  },
  'startup-landing': {
    brandName: 'Hyperscale Engine',
    offering: 'Next-generation cloud primitives that deploy autonomous serverless clusters in sub-millisecond speeds.',
    audience: 'Founders, engineering leads, and early technology adopters.',
    primaryGoal: 'Join Early Access Protocol',
    paletteId: 'indigo-flow',
    directionId: 'modern-product',
    pairingId: 'outfit-jakarta',
    heroImage: '/src/assets/images/preview_saas_metrics_1792316645998.jpg',
  },
  'blog-editorial': {
    brandName: 'The Monograph',
    offering: 'Critical essays on intentional computing, typographic history, and calm technology.',
    audience: 'Architects of culture, researchers, and thoughtful technologists.',
    primaryGoal: 'Read The Weekly Monograph',
    paletteId: 'editorial-sand',
    directionId: 'minimal-editorial',
    pairingId: 'fraunces-dmsans',
    heroImage: '/src/assets/images/preview_editorial_arch_1792316647413.jpg',
  },
  'news-media': {
    brandName: 'The Daily Wireframe',
    offering: 'Independent investigative journalism covering software design, venture dynamics, and digital privacy.',
    audience: 'Tech industry professionals, policymakers, and investigative readers.',
    primaryGoal: 'Read Today’s Front Page',
    paletteId: 'corporate-navy',
    directionId: 'clean-corporate',
    pairingId: 'fraunces-dmsans',
    heroImage: '/src/assets/images/preview_editorial_arch_1792316647413.jpg',
  },
  restaurant: {
    brandName: 'Savor & Embers Hearth',
    offering: 'Wood-fired gastronomy, biodynamic natural wines, and seasonal Pacific Northwest tasting menus.',
    audience: 'Culinary adventurers, natural wine collectors, and neighborhood epicureans.',
    primaryGoal: 'Reserve Evening Tasting Table',
    paletteId: 'warm-terracotta',
    directionId: 'warm-approachable',
    pairingId: 'fraunces-dmsans',
    heroImage: '/src/assets/images/preview_ecommerce_ceramics_1792316645917.jpg',
  },
  'travel-booking': {
    brandName: 'Villa Solarium',
    offering: 'Curated architectural sanctuaries, private clifftop hideaways, and slow travel expeditions across Italy.',
    audience: 'Discerning travelers seeking seclusion, heritage architecture, and restorative pauses.',
    primaryGoal: 'Reserve Sanctuary Dates',
    paletteId: 'forest-clay',
    directionId: 'nature-inspired',
    pairingId: 'playfair-dmsans',
    heroImage: '/src/assets/images/preview_editorial_arch_1792316647413.jpg',
  },
  healthcare: {
    brandName: 'Solace Integrative Health',
    offering: 'Evidence-based functional medicine, metabolic health diagnostics, and personalized longevity programs.',
    audience: 'Patients, busy executives, and families seeking compassionate preventive care.',
    primaryGoal: 'Book Initial Comprehensive Intake',
    paletteId: 'sage-mint',
    directionId: 'warm-approachable',
    pairingId: 'outfit-jakarta',
    heroImage: '/src/assets/images/hero_founder_studio_1792316645323.jpg',
  },
  fintech: {
    brandName: 'Moneta API Pay',
    offering: 'Programmable multi-currency settlement rails, automated merchant treasury, and sub-second payouts.',
    audience: 'Fintech founders, payments engineers, and global platforms.',
    primaryGoal: 'Integrate Live Sandbox API',
    paletteId: 'corporate-navy',
    directionId: 'clean-corporate',
    pairingId: 'outfit-jakarta',
    heroImage: '/src/assets/images/preview_saas_metrics_1792316645998.jpg',
  },
  'real-estate': {
    brandName: 'Aura Luxury Properties',
    offering: 'Exclusive private estates, mid-century architectural icons, and penthouse residences in Los Angeles.',
    audience: 'High-net-worth buyers, architects, and discerning property investors.',
    primaryGoal: 'Schedule Private Residence Tour',
    paletteId: 'champagne-noir',
    directionId: 'premium-luxury',
    pairingId: 'playfair-dmsans',
    heroImage: '/src/assets/images/preview_editorial_arch_1792316647413.jpg',
  },
  marketplace: {
    brandName: 'Artisan Guild',
    offering: 'Direct peer-to-peer marketplace uniting master craftspeople, woodworkers, and discerning collectors.',
    audience: 'Independent makers, collectors, and conscious design consumers.',
    primaryGoal: 'Explore Maker Workbenches',
    paletteId: 'warm-terracotta',
    directionId: 'modern-product',
    pairingId: 'fraunces-dmsans',
    heroImage: '/src/assets/images/preview_ecommerce_ceramics_1792316645917.jpg',
  },
  community: {
    brandName: 'Founders Guild',
    offering: 'Private peer mastermind community for bootstrapped software operators generating $1M+ ARR.',
    audience: 'Bootstrapped founders, indie developers, and SaaS entrepreneurs.',
    primaryGoal: 'Apply For Guild Membership',
    paletteId: 'tangerine-energy',
    directionId: 'warm-approachable',
    pairingId: 'outfit-jakarta',
    heroImage: '/src/assets/images/hero_founder_studio_1792316645323.jpg',
  },
  nonprofit: {
    brandName: 'CleanOceans Alliance',
    offering: 'Mobilizing autonomous cleanup vessels and restoring coral reef ecosystems in the South Pacific.',
    audience: 'Conservationists, philanthropic donors, and climate scientists.',
    primaryGoal: 'Support Marine Restoration',
    paletteId: 'forest-clay',
    directionId: 'nature-inspired',
    pairingId: 'outfit-jakarta',
    heroImage: '/src/assets/images/hero_founder_studio_1792316645323.jpg',
  },
  'event-website': {
    brandName: 'FRAME Design Summit 2027',
    offering: 'A three-day gathering of 1,200 systems designers, creative directors, and frontend engineers in Amsterdam.',
    audience: 'Product designers, design system engineers, and tech founders.',
    primaryGoal: 'Secure Early Bird Pass',
    paletteId: 'electric-teal',
    directionId: 'bold-commercial',
    pairingId: 'outfit-jakarta',
    heroImage: '/src/assets/images/preview_saas_metrics_1792316645998.jpg',
  },
  custom: {
    brandName: 'Nexus Modular Systems',
    offering: 'Bespoke high-performance digital ecosystems designed to accelerate founder vision and enterprise growth.',
    audience: 'Founders, innovators, and visionary operators.',
    primaryGoal: 'Design Custom Architecture',
    paletteId: 'indigo-flow',
    directionId: 'modern-product',
    pairingId: 'outfit-jakarta',
    heroImage: '/src/assets/images/hero_founder_studio_1792316645323.jpg',
  },
};

/**
 * Builds a complete, production-ready DesignProject tailored for any given website type.
 */
export function buildShowcaseProject(typeDef: WebsiteTypeDefinition): DesignProject {
  // Use pre-existing hand-crafted samples for ceramics & saas if exact matches
  if (typeDef.id === 'ecommerce') return SAMPLE_PROJECT_CERAMICS;
  if (typeDef.id === 'saas-product') return SAMPLE_PROJECT_SAAS;

  const profile = BRAND_PROFILES[typeDef.id] || {
    brandName: `${typeDef.name.split('&')[0].trim()} Studio`,
    offering: typeDef.description,
    audience: 'Discerning users, clients, and partners.',
    primaryGoal: 'Get In Touch',
    paletteId: typeDef.recommendedPaletteId,
    directionId: typeDef.recommendedDirection,
    pairingId: 'outfit-jakarta',
    heroImage: '/src/assets/images/hero_founder_studio_1792316645323.jpg',
  };

  const selectedPalette =
    COLOR_PALETTES.find((p) => p.id === profile.paletteId) ||
    COLOR_PALETTES.find((p) => p.id === typeDef.recommendedPaletteId) ||
    COLOR_PALETTES[0];

  const selectedDirection =
    VISUAL_DIRECTIONS.find((d) => d.id === profile.directionId) ||
    VISUAL_DIRECTIONS.find((d) => d.id === typeDef.recommendedDirection) ||
    VISUAL_DIRECTIONS[0];

  const selectedPairing =
    TYPOGRAPHY_PAIRINGS.find((tp) => tp.id === profile.pairingId) ||
    TYPOGRAPHY_PAIRINGS[0];

  return {
    id: `showcase_${typeDef.id}`,
    schemaVersion: 1,
    name: profile.brandName,
    createdAt: Date.now() - 86400000 * 3,
    updatedAt: Date.now() - 3600000 * 2,
    currentStep: 13,
    completedSteps: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    websiteType: {
      id: typeDef.id,
      name: typeDef.name,
      category: typeDef.category,
      description: typeDef.description,
      characteristics: [typeDef.category, typeDef.recommendedDirection, 'Production Verified'],
    },
    business: {
      name: profile.brandName,
      offering: profile.offering,
      audience: profile.audience,
      primaryGoal: profile.primaryGoal,
      contentType: typeDef.designTips,
      secondaryOfferings: typeDef.defaultComponents,
    },
    brandPersonality: {
      primary: selectedDirection.name,
      secondary: ['Clean and deliberate', 'Production grade'],
      minimalToExpresive: 35,
      calmToEnergetic: 50,
      traditionalToExperimental: 45,
      softToBold: 55,
      compactToSpacious: 65,
    },
    visualDirection: selectedDirection,
    colorPalette: selectedPalette,
    typography: {
      pairingId: selectedPairing.id,
      name: selectedPairing.name,
      displayFont: selectedPairing.displayFont,
      headingFont: selectedPairing.headingFont,
      bodyFont: selectedPairing.bodyFont,
      monoFont: selectedPairing.monoFont,
      scaleRatio: selectedPairing.scaleRatio,
      headingWeight: selectedPairing.headingWeight,
      bodyWeight: selectedPairing.bodyWeight,
      lineHeight: 'normal',
      letterSpacingDisplay: 'tight',
    },
    imagery: {
      style: 'photography',
      cornerRadius: 'medium',
      aspectRatio: '16:9',
      treatment: 'clean',
      customHeroUrl: profile.heroImage,
    },
    layout: {
      density: 'balanced',
      containerWidth: 'standard',
      cardElevation: 'subtle-border',
      sectionSpacing: 'normal',
      radius: 'rounded',
      headerLayout: 'standard',
    },
    components: {
      buttonStyle: 'solid',
      buttonSize: 'default',
      cardStyle: 'bordered',
      navStyle: 'clean-inline',
      inputStyle: 'bordered-focus',
      badgeStyle: 'subtle-dot',
      enabledComponents: typeDef.defaultComponents,
    },
    responsive: {
      mobileNav: 'sheet',
      cardStacking: 'stack',
      mobileHero: 'center-stacked',
      activeViewport: 'desktop',
    },
    accessibility: {
      defaultTheme: 'light',
      highContrast: false,
      reducedMotion: false,
      notes: [
        `${selectedPalette.name} verified against WCAG 2.1 AA standards`,
        'Semantic tokens calibrated across all interactive breakpoints',
      ],
    },
  };
}

/**
 * Pre-compiled list of all showcase options for every website type in the studio.
 */
export const ALL_SHOWCASE_PRESETS: ShowcasePreset[] = WEBSITE_TYPES.map((typeDef) => {
  const project = buildShowcaseProject(typeDef);
  return {
    id: typeDef.id,
    projectId: project.id,
    label: project.business.name || project.name,
    typeName: typeDef.name,
    category: typeDef.category,
    meta: `${typeDef.category} · ${typeDef.name}`,
    description: typeDef.description,
    project,
  };
});
