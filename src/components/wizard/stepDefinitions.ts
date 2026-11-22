import React from 'react';
import { DesignProject } from '../../types/designSystem';

export interface StepProps {
  project: DesignProject;
  onChange: (updated: Partial<DesignProject>) => void;
  onPreviewDraft?: (draft: Partial<DesignProject>, label: string) => void;
  onClearDraft?: () => void;
}

export interface StepDefinition {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  category: 'Foundation' | 'Identity' | 'Style' | 'Structure' | 'Components' | 'Motion' | 'Quality' | 'Export';
  help: string;
  focusSection: string; // preview section to scroll to (Doc 02 §3.4 & §5)
  tokenPaths: string[]; // which DesignTokens paths this step edits
  estimatedTime?: string;
  whatYouGet?: string;
  whyItMatters?: string;
  Component?: React.ComponentType<any>;
  isComplete(project: DesignProject): boolean;
}

export const STEP_DEFINITIONS: StepDefinition[] = [
  {
    id: 'category-genre',
    number: 1,
    title: 'Category & Genre',
    subtitle: 'Choose your website genre',
    category: 'Foundation',
    help: 'Select your website category and specific genre. A tailored reactive template opens in the preview pane immediately.',
    focusSection: 'hero',
    tokenPaths: ['meta.genreId', 'meta.category'],
    estimatedTime: '~2 min',
    whatYouGet: 'A live interactive template matching your industry with tailored sections.',
    whyItMatters: 'Industry-specific layouts prime the visual hierarchy, typical reading depth, and component needs.',
    isComplete: (project) => Boolean(project.tokens?.meta?.genreId || project.websiteType?.id)
  },
  {
    id: 'project-business',
    number: 2,
    title: 'Project Scope',
    subtitle: 'Brand name, audience & languages',
    category: 'Foundation',
    help: 'Establish brand name, offering, audience age, and target language scripts to calibrate base type scales and copy.',
    focusSection: 'hero',
    tokenPaths: ['meta.projectName', 'meta.scripts', 'meta.audienceAge', 'meta.platformTarget', 'typography.baseSizePx'],
    estimatedTime: '~2 min',
    whatYouGet: 'Calibrated base type sizes and realistic AI copy in the preview.',
    whyItMatters: 'Audience age and language scripts determine minimum readable font sizes and optical spacing.',
    isComplete: (project) => Boolean(project.name || project.business?.name)
  },
  {
    id: 'brand-personality',
    number: 3,
    title: 'Brand Personality',
    subtitle: 'Temperament dials & presets',
    category: 'Identity',
    help: 'Tune energy, craft, voice, formality, and density to synthesize recommended starter aesthetic presets.',
    focusSection: 'hero',
    tokenPaths: ['meta.personality'],
    estimatedTime: '~2 min',
    whatYouGet: 'A harmonized starter aesthetic matching your brand emotional tone.',
    whyItMatters: 'Emotional consistency prevents disjointed design choices where colors clash with copywriting.',
    isComplete: (project) => Boolean(project.tokens?.meta?.personality)
  },
  {
    id: 'visual-direction',
    number: 4,
    title: 'Visual Direction',
    subtitle: 'Aesthetic mood and tone',
    category: 'Identity',
    help: 'Select an aesthetic archetype bundling palette hints, corner radii, elevation, and typography styling.',
    focusSection: 'hero',
    tokenPaths: ['visualDirection', 'typography.roles', 'radius', 'color.primitives'],
    estimatedTime: '~2 min',
    whatYouGet: 'Curated styling archetypes (Minimal, High-Velocity, Brutalist, etc.).',
    whyItMatters: 'Quickly test different design styles with 1-click A/B preview before fine-tuning.',
    isComplete: (project) => Boolean(project.visualDirection?.id)
  },
  {
    id: 'color-studio',
    number: 5,
    title: 'Color Studio',
    subtitle: 'Brand colors & accessible contrast',
    category: 'Style',
    help: 'Fine-tune brand, accent, and neutral OKLCH scales, inspect live WCAG 2.2 AA contrast, and verify light/dark modes.',
    focusSection: 'hero',
    tokenPaths: ['color.primitives', 'color.semantic'],
    estimatedTime: '~3 min',
    whatYouGet: 'Perceptually uniform color ramps with verified WCAG 2.2 AA contrast.',
    whyItMatters: 'Ensures text is effortlessly readable in bright sun, dark rooms, and by people with colorblindness.',
    isComplete: (project) => Boolean(project.tokens?.color?.semantic)
  },
  {
    id: 'typography-studio',
    number: 6,
    title: 'Typography Studio',
    subtitle: 'Font pairing & fluid scales',
    category: 'Style',
    help: 'Configure display, heading, body, and mono fonts with multi-script subsets and responsive fluid clamps.',
    focusSection: 'type-specimen',
    tokenPaths: ['typography.roles', 'typography.scaleRatio', 'typography.baseSizePx'],
    estimatedTime: '~3 min',
    whatYouGet: '4 verified Google Font selections with smooth mathematical screen-size scaling.',
    whyItMatters: 'Headings and text smoothly resize from mobile to 4K displays without breaking layouts.',
    isComplete: (project) => Boolean(project.tokens?.typography?.roles)
  },
  {
    id: 'shape-spacing',
    number: 7,
    title: 'Shape & Spacing',
    subtitle: 'Curvature, padding & shadows',
    category: 'Structure',
    help: 'Calibrate border radius scales, component elevation shadows, container max-widths, and 4px/8px spatial grids.',
    focusSection: 'components-showcase',
    tokenPaths: ['radius', 'space.scale', 'shadow', 'layout'],
    estimatedTime: '~2 min',
    whatYouGet: 'Consistent spatial padding, card rounding, and elevation tokens.',
    whyItMatters: 'Consistent spacing rhythms make websites feel structured, intentional, and high-quality.',
    isComplete: (project) => Boolean(project.tokens?.radius && project.tokens?.space)
  },
  {
    id: 'components-studio',
    number: 8,
    title: 'Website Components',
    subtitle: 'Buttons, inputs & active site modules',
    category: 'Components',
    help: 'Inspect button variants (solid, outline, subtle, minimal), form controls, badges, and toggle active site modules.',
    focusSection: 'components-showcase',
    tokenPaths: ['component.buttonStyle', 'component.buttonRadius', 'component.cardRadius', 'component.inputRadius'],
    estimatedTime: '~2 min',
    whatYouGet: 'Interactive preview of buttons, badges, forms, and enabled site sections.',
    whyItMatters: 'Verifies real interactive states (hover, focus, disabled) before writing code.',
    isComplete: (project) => Boolean(project.components?.buttonStyle)
  },
  {
    id: 'imagery-motion',
    number: 9,
    title: 'Imagery & Motion',
    subtitle: 'Photo treatments & animation springs',
    category: 'Motion',
    help: 'Set image treatments (clean, duotone, monochrome), corner rounding, icon styles, and physics-based spring curves.',
    focusSection: 'gallery',
    tokenPaths: ['imagery.treatment', 'imagery.cornerRadius', 'motion', 'icon'],
    estimatedTime: '~2 min',
    whatYouGet: 'Curated image filters, icon styles, and fluid spring animation curves.',
    whyItMatters: 'Spring animations create a natural, weighted feel that respects user motion preferences.',
    isComplete: (project) => Boolean(project.tokens?.imagery && project.tokens?.motion)
  },
  {
    id: 'review-audit',
    number: 10,
    title: 'Review & Audit',
    subtitle: 'WCAG 2.2 AA table & 1-click auto-fix',
    category: 'Quality',
    help: 'Run comprehensive design system audit across contrast, responsive viewports, colorblind simulations, and token completeness.',
    focusSection: 'components-showcase',
    tokenPaths: [],
    estimatedTime: '~1 min',
    whatYouGet: 'Health score across contrast, touch targets, and accessibility with 1-click fixes.',
    whyItMatters: 'Catches compliance issues early before handing off to developers or shipping to customers.',
    isComplete: () => true
  },
  {
    id: 'export-center',
    number: 11,
    title: 'Export Center',
    subtitle: '10 code formats & starter ZIP',
    category: 'Export',
    help: 'Generate and download your design system in CSS Variables, Tailwind v4, Style Dictionary, Figma Tokens, JSON, and more.',
    focusSection: 'components-showcase',
    tokenPaths: [],
    estimatedTime: '~1 min',
    whatYouGet: 'Ready-to-use ZIP file with production CSS, Tailwind config, tokens, and React components.',
    whyItMatters: 'No manual translation: your exact choices export into standard developer files in seconds.',
    isComplete: () => true
  }
];

export function getStepDefinition(stepNumber: number): StepDefinition {
  return STEP_DEFINITIONS.find(s => s.number === stepNumber) || STEP_DEFINITIONS[0];
}

export function getStepFocusSection(stepNumber: number): string {
  const def = getStepDefinition(stepNumber);
  return def.focusSection || 'hero';
}
