import { DesignProject } from '../types/designSystem';
import { COLOR_PALETTES } from './palettes';
import { TYPOGRAPHY_PAIRINGS } from './typographyPairs';
import { VISUAL_DIRECTIONS } from './visualDirections';
import { WEBSITE_TYPES } from './websiteTypes';

export const SAMPLE_PROJECT_CERAMICS: DesignProject = {
  id: 'project_artisan_ceramics',
  schemaVersion: 1,
  name: 'Komorebi Studio & Ceramics',
  createdAt: Date.now() - 86400000 * 2,
  updatedAt: Date.now() - 3600000 * 4,
  currentStep: 13,
  completedSteps: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
  websiteType: {
    id: 'ecommerce',
    name: 'Online Store & E-commerce',
    category: 'Commerce',
    description: 'Sell physical or artisan products with high-trust checkout, product showcases, and clear shopping flows.',
    characteristics: ['Artisan ceramics', 'Direct-to-consumer', 'Sustainable packaging']
  },
  business: {
    name: 'Komorebi Ceramics',
    offering: 'Hand-thrown stoneware, tactile tea sets, and architectural pottery crafted in Kyoto and Portland.',
    audience: 'Design-conscious homeowners, architects, boutique restaurateurs, and thoughtful gift seekers.',
    primaryGoal: 'Showcase seasonal pottery collections and drive direct online studio sales.',
    contentType: 'High-resolution tactile product showcases with transparent artisan studio stories.',
    secondaryOfferings: ['Limited seasonal drops', 'Custom restaurant tableware commissions', 'Studio workshops']
  },
  brandPersonality: {
    primary: 'Warm & Approachable',
    secondary: ['Minimal and clean', 'Editorial and sophisticated'],
    minimalToExpresive: 35,
    calmToEnergetic: 25,
    traditionalToExperimental: 40,
    softToBold: 30,
    compactToSpacious: 75
  },
  visualDirection: VISUAL_DIRECTIONS[1], // Minimal Editorial
  colorPalette: COLOR_PALETTES[0], // Artisan Terracotta
  typography: {
    pairingId: TYPOGRAPHY_PAIRINGS[2].id, // Fraunces + DM Sans
    name: TYPOGRAPHY_PAIRINGS[2].name,
    displayFont: TYPOGRAPHY_PAIRINGS[2].displayFont,
    headingFont: TYPOGRAPHY_PAIRINGS[2].headingFont,
    bodyFont: TYPOGRAPHY_PAIRINGS[2].bodyFont,
    monoFont: TYPOGRAPHY_PAIRINGS[2].monoFont,
    scaleRatio: 1.25,
    headingWeight: '600',
    bodyWeight: '400',
    lineHeight: 'normal',
    letterSpacingDisplay: 'tight'
  },
  imagery: {
    style: 'photography',
    cornerRadius: 'small',
    aspectRatio: '4:3',
    treatment: 'clean',
    customHeroUrl: '/src/assets/images/preview_ecommerce_ceramics_1792316645917.jpg'
  },
  layout: {
    density: 'spacious',
    containerWidth: 'standard',
    cardElevation: 'subtle-border',
    sectionSpacing: 'relaxed',
    radius: 'subtle',
    headerLayout: 'standard'
  },
  components: {
    buttonStyle: 'solid',
    buttonSize: 'default',
    cardStyle: 'bordered',
    navStyle: 'clean-inline',
    inputStyle: 'bordered-focus',
    badgeStyle: 'subtle-dot',
    enabledComponents: ['product-card', 'pricing-tag', 'cart-drawer', 'reviews-grid', 'newsletter']
  },
  responsive: {
    mobileNav: 'sheet',
    cardStacking: 'stack',
    mobileHero: 'center-stacked',
    activeViewport: 'desktop'
  },
  accessibility: {
    defaultTheme: 'light',
    highContrast: false,
    reducedMotion: false,
    notes: ['Terracotta primary color meets 4.7:1 contrast on white canvas', 'All interactive buttons have visible focus outlines']
  }
};

export const SAMPLE_PROJECT_SAAS: DesignProject = {
  id: 'project_synapse_metrics',
  schemaVersion: 1,
  name: 'Synapse Data Flow',
  createdAt: Date.now() - 86400000 * 5,
  updatedAt: Date.now() - 3600000 * 12,
  currentStep: 13,
  completedSteps: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
  websiteType: {
    id: 'saas-product',
    name: 'SaaS Product',
    category: 'Software & Technology',
    description: 'Cloud software, productivity tools, automation workflows, and subscription web apps.',
    characteristics: ['Real-time pipeline', 'Developer-first', 'Enterprise scale']
  },
  business: {
    name: 'Synapse Data Flow',
    offering: 'Automated data transformation and telemetry pipelines with zero downtime and instant schema normalization.',
    audience: 'Data engineers, VP of Engineering, DevOps leads, and technical founders.',
    primaryGoal: 'Sign up for interactive developer trial and request enterprise demo.',
    contentType: 'Interactive architecture playground, throughput metrics, and developer documentation.',
    secondaryOfferings: ['Multi-cloud connector', 'SOC-2 compliant logs', 'Kafka bridge']
  },
  brandPersonality: {
    primary: 'Modern & Professional',
    secondary: ['Technical and futuristic', 'Trustworthy and corporate'],
    minimalToExpresive: 20,
    calmToEnergetic: 65,
    traditionalToExperimental: 70,
    softToBold: 75,
    compactToSpacious: 40
  },
  visualDirection: VISUAL_DIRECTIONS[0], // Modern Product-Led
  colorPalette: COLOR_PALETTES[4], // Modern Indigo & Steel
  typography: {
    pairingId: TYPOGRAPHY_PAIRINGS[0].id,
    name: TYPOGRAPHY_PAIRINGS[0].name,
    displayFont: TYPOGRAPHY_PAIRINGS[0].displayFont,
    headingFont: TYPOGRAPHY_PAIRINGS[0].headingFont,
    bodyFont: TYPOGRAPHY_PAIRINGS[0].bodyFont,
    monoFont: TYPOGRAPHY_PAIRINGS[0].monoFont,
    scaleRatio: 1.25,
    headingWeight: '600',
    bodyWeight: '400',
    lineHeight: 'normal',
    letterSpacingDisplay: 'tight'
  },
  imagery: {
    style: 'product',
    cornerRadius: 'medium',
    aspectRatio: '16:9',
    treatment: 'clean',
    customHeroUrl: '/src/assets/images/preview_saas_metrics_1792316645998.jpg'
  },
  layout: {
    density: 'balanced',
    containerWidth: 'wide',
    cardElevation: 'subtle-border',
    sectionSpacing: 'normal',
    radius: 'rounded',
    headerLayout: 'standard'
  },
  components: {
    buttonStyle: 'solid',
    buttonSize: 'default',
    cardStyle: 'bordered',
    navStyle: 'clean-inline',
    inputStyle: 'bordered-focus',
    badgeStyle: 'subtle-dot',
    enabledComponents: ['feature-grid', 'pricing-matrix', 'metrics-row', 'integrations-cloud', 'interactive-demo']
  },
  responsive: {
    mobileNav: 'sheet',
    cardStacking: 'stack',
    mobileHero: 'center-stacked',
    activeViewport: 'desktop'
  },
  accessibility: {
    defaultTheme: 'light',
    highContrast: false,
    reducedMotion: false,
    notes: ['Indigo primary color passes WCAG AA contrast (5.2:1)', 'Focus indicator ring is explicitly configured']
  }
};

export function createNewProject(name: string = 'Untitled Website', typeId: string = 'ecommerce'): DesignProject {
  const selectedType = WEBSITE_TYPES.find(t => t.id === typeId) || WEBSITE_TYPES[0];
  const selectedPalette = COLOR_PALETTES.find(p => p.id === selectedType.recommendedPaletteId) || COLOR_PALETTES[0];
  const selectedPairing = TYPOGRAPHY_PAIRINGS[0];
  const selectedDirection = VISUAL_DIRECTIONS.find(d => d.id === selectedType.recommendedDirection) || VISUAL_DIRECTIONS[0];

  return {
    id: `project_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    schemaVersion: 1,
    name: name,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    currentStep: 1,
    completedSteps: [1],
    websiteType: {
      id: selectedType.id,
      name: selectedType.name,
      category: selectedType.category,
      description: selectedType.description,
      characteristics: ['Focused experience', 'Mobile-first']
    },
    business: {
      name: name,
      offering: '',
      audience: '',
      primaryGoal: 'Showcase services and generate inbound inquiries',
      contentType: 'Clear visual sections and straightforward navigation',
      secondaryOfferings: []
    },
    brandPersonality: {
      primary: 'Modern & Professional',
      secondary: ['Minimal and clean'],
      minimalToExpresive: 40,
      calmToEnergetic: 40,
      traditionalToExperimental: 50,
      softToBold: 45,
      compactToSpacious: 60
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
      letterSpacingDisplay: 'tight'
    },
    imagery: {
      style: 'photography',
      cornerRadius: 'medium',
      aspectRatio: '16:9',
      treatment: 'clean',
      customHeroUrl: '/src/assets/images/hero_founder_studio_1792316645323.jpg'
    },
    layout: {
      density: 'balanced',
      containerWidth: 'standard',
      cardElevation: 'subtle-border',
      sectionSpacing: 'normal',
      radius: 'rounded',
      headerLayout: 'standard'
    },
    components: {
      buttonStyle: 'solid',
      buttonSize: 'default',
      cardStyle: 'bordered',
      navStyle: 'clean-inline',
      inputStyle: 'bordered-focus',
      badgeStyle: 'subtle-dot',
      enabledComponents: selectedType.defaultComponents
    },
    responsive: {
      mobileNav: 'sheet',
      cardStacking: 'stack',
      mobileHero: 'center-stacked',
      activeViewport: 'desktop'
    },
    accessibility: {
      defaultTheme: 'light',
      highContrast: false,
      reducedMotion: false,
      notes: ['Contrast ratio checked against WCAG AA standards']
    }
  };
}
