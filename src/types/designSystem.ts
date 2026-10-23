export interface ColorShades {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

export interface ColorPaletteConfig {
  id: string;
  name: string;
  description: string;
  family: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  backgroundAlt: string;
  surface: string;
  surfaceBorder: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  link: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  focusRing: string;
  shades: ColorShades;
}

export interface TypographyConfig {
  pairingId: string;
  name: string;
  displayFont: string;
  headingFont: string;
  bodyFont: string;
  monoFont: string;
  scaleRatio: number; // e.g. 1.25 (Major Third), 1.333 (Perfect Fourth)
  headingWeight: '500' | '600' | '700' | '800';
  bodyWeight: '400' | '500';
  lineHeight: 'tight' | 'normal' | 'relaxed';
  letterSpacingDisplay: 'tight' | 'normal' | 'wide';
}

export interface ImageryConfig {
  style: 'photography' | 'product' | 'editorial' | 'illustration' | 'minimal' | 'text-first';
  cornerRadius: 'none' | 'small' | 'medium' | 'large' | 'full';
  aspectRatio: '16:9' | '4:3' | '1:1' | '3:4';
  treatment: 'clean' | 'warm-filter' | 'monochrome' | 'soft-shadow';
  customLogoUrl?: string;
  customHeroUrl?: string;
}

export interface LayoutConfig {
  density: 'compact' | 'balanced' | 'spacious';
  containerWidth: 'narrow' | 'standard' | 'wide';
  cardElevation: 'flat' | 'subtle-border' | 'elevated-shadow';
  sectionSpacing: 'compact' | 'normal' | 'relaxed';
  radius: 'sharp' | 'subtle' | 'rounded' | 'playful';
  headerLayout: 'minimal' | 'centered' | 'standard';
}

export interface ComponentConfig {
  buttonStyle: 'solid' | 'outline' | 'subtle' | 'minimal';
  buttonSize: 'compact' | 'default' | 'large';
  cardStyle: 'bordered' | 'elevated' | 'flat-tint';
  navStyle: 'clean-inline' | 'floating' | 'bold-border';
  inputStyle: 'understated' | 'bordered-focus' | 'filled';
  badgeStyle: 'subtle-dot' | 'monochrome' | 'tinted';
  enabledComponents: string[];
}

export interface ResponsiveConfig {
  mobileNav: 'sheet' | 'dropdown';
  cardStacking: 'stack' | 'grid-2' | 'carousel';
  mobileHero: 'center-stacked' | 'image-below' | 'compact';
  activeViewport: 'mobile' | 'tablet' | 'desktop';
}

export interface AccessibilityConfig {
  defaultTheme: 'light' | 'dark' | 'system';
  highContrast: boolean;
  reducedMotion: boolean;
  notes: string[];
}

export interface BusinessDetails {
  name: string;
  offering: string;
  audience: string;
  primaryGoal: string;
  contentType: string;
  secondaryOfferings: string[];
  notes?: string;
}

export interface BrandPersonality {
  primary: string;
  secondary: string[];
  minimalToExpresive: number; // 0 to 100
  calmToEnergetic: number;    // 0 to 100
  traditionalToExperimental: number; // 0 to 100
  softToBold: number;         // 0 to 100
  compactToSpacious: number;  // 0 to 100
}

export interface VisualDirection {
  id: string;
  name: string;
  tagline: string;
  description: string;
  aesthetic: string;
  recommendedPaletteId: string;
  recommendedPairingId: string;
}

export interface DesignProject {
  id: string;
  schemaVersion: number;
  name: string;
  createdAt: number;
  updatedAt: number;
  currentStep: number; // 1 to 14
  completedSteps: number[];
  websiteType: {
    id: string;
    name: string;
    category: string;
    description: string;
    characteristics: string[];
  };
  business: BusinessDetails;
  brandPersonality: BrandPersonality;
  visualDirection: VisualDirection;
  colorPalette: ColorPaletteConfig;
  typography: TypographyConfig;
  imagery: ImageryConfig;
  layout: LayoutConfig;
  components: ComponentConfig;
  responsive: ResponsiveConfig;
  accessibility: AccessibilityConfig;
}

export type WizardStepId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;

export interface WizardStepMeta {
  number: WizardStepId;
  title: string;
  subtitle: string;
  category: string;
  estimatedMinutes: number;
}
