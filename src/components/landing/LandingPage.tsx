import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  ChevronDown,
  Palette,
  Type,
  Sliders,
  Layers,
  Image as ImageIcon,
  ShieldCheck,
  Sparkles,
  Check,
  Search,
  Workflow,
  GitBranch,
  Boxes,
  FileCode2,
  FileText,
  FileJson,
  Monitor,
  Smartphone,
  Play,
  Zap,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Flag,
  TrendingUp,
  Cpu,
  LayoutGrid,
  Network,
  Compass,
  Users,
  Download
} from 'lucide-react';

import { DesignProject } from '../../types/designSystem';
import { LiveWebsitePreview } from '../preview/LiveWebsitePreview';
import { ALL_SHOWCASE_PRESETS, ShowcasePreset } from '../../data/showcasePresets';
import { WIZARD_STEPS } from '../common/WizardNav';
import { importProjectFromJson } from '../../utils/storage';
import { Interactive3DCanvas } from '../common/Interactive3DCanvas';

interface LandingPageProps {
  onStartNew: () => void;
  onExploreSample: (project: DesignProject) => void;
  onImportProject?: (project: DesignProject) => void;
}

/* ------------------------------------------------------------------ */
/*  Content model                                                      */
/* ------------------------------------------------------------------ */

const DECISIONS = [
  {
    id: 'colour',
    label: 'Colour',
    icon: Palette,
    accent: 'from-rose-500/10 to-amber-500/10 text-rose-600 border-rose-200/60',
    iconColor: 'text-rose-600',
    title: '14 curated palettes',
    badge: '50 to 900 ramps',
  },
  {
    id: 'type',
    label: 'Type',
    icon: Type,
    accent: 'from-blue-500/10 to-indigo-500/10 text-indigo-600 border-indigo-200/60',
    iconColor: 'text-indigo-600',
    title: '5 modular pairings',
    badge: 'modular scale',
  },
  {
    id: 'spacing',
    label: 'Spacing',
    icon: Sliders,
    accent: 'from-emerald-500/10 to-teal-500/10 text-teal-600 border-teal-200/60',
    iconColor: 'text-teal-600',
    title: '8pt rhythmic grid',
    badge: 'density · radius',
  },
  {
    id: 'components',
    label: 'Components',
    icon: Layers,
    accent: 'from-purple-500/10 to-violet-500/10 text-purple-600 border-purple-200/60',
    iconColor: 'text-purple-600',
    title: 'Production UI kit',
    badge: 'buttons · cards · nav',
  },
  {
    id: 'imagery',
    label: 'Imagery',
    icon: ImageIcon,
    accent: 'from-amber-500/10 to-orange-500/10 text-amber-600 border-amber-200/60',
    iconColor: 'text-amber-600',
    title: 'Art direction rules',
    badge: 'ratios · filters',
  },
  {
    id: 'accessibility',
    label: 'Accessibility',
    icon: ShieldCheck,
    accent: 'from-emerald-500/10 to-green-500/10 text-emerald-600 border-emerald-200/60',
    iconColor: 'text-emerald-600',
    title: 'WCAG AA 2.1 verified',
    badge: 'dark mode audit',
  },
];



interface StairQuestion {
  step: number;
  qNum: string;
  level: number;
  levelName: string;
  levelBadge: string;
  shortTag: string;
  title: string;
  subtitle: string;
  simpleExplanation: string;
  keyDecision: string;
  previewChips: { label: string; active?: boolean; colorDot?: string }[];
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  levelColor: string;
  levelGradient: string;
  levelLightBg: string;
  levelBorder: string;
  levelText: string;
  treadColor: string;
  elevation: string;
  timeEstimate: string;
}

const STAIRCASE_QUESTIONS: StairQuestion[] = [
  {
    step: 1,
    qNum: 'Q01',
    level: 1,
    levelName: 'Level 1: Foundation',
    levelBadge: 'Ground Floor',
    shortTag: 'Setup',
    title: 'Project Setup',
    subtitle: 'Name and initial goal',
    simpleExplanation: 'Give your website a memorable name and define its primary business purpose.',
    keyDecision: 'Project Scope & Identity',
    previewChips: [{ label: 'Brand Name: Studio', active: true }, { label: 'Goal: High-Conversion', active: false }],
    icon: FileText,
    levelColor: 'bg-blue-600',
    levelGradient: 'from-blue-700 via-blue-600 to-blue-500',
    levelLightBg: 'bg-blue-50/50 hover:bg-blue-100/60',
    levelBorder: 'border-blue-200',
    levelText: 'text-blue-700',
    treadColor: 'bg-blue-500',
    elevation: '0.0m',
    timeEstimate: '1 min',
  },
  {
    step: 2,
    qNum: 'Q02',
    level: 1,
    levelName: 'Level 1: Foundation',
    levelBadge: 'Ground Floor',
    shortTag: 'Type',
    title: 'Website Type',
    subtitle: '32 industry genres',
    simpleExplanation: 'Choose what kind of site you need—from Store and SaaS to Agency and Portfolio.',
    keyDecision: 'Site Architecture (32 Genres)',
    previewChips: [{ label: 'Store / Shop', active: true }, { label: 'SaaS App' }, { label: 'Portfolio' }, { label: '+29 Genres' }],
    icon: LayoutGrid,
    levelColor: 'bg-blue-600',
    levelGradient: 'from-blue-700 via-blue-600 to-blue-500',
    levelLightBg: 'bg-blue-50/50 hover:bg-blue-100/60',
    levelBorder: 'border-blue-200',
    levelText: 'text-blue-700',
    treadColor: 'bg-blue-500',
    elevation: '0.8m',
    timeEstimate: '2 min',
  },
  {
    step: 3,
    qNum: 'Q03',
    level: 1,
    levelName: 'Level 1: Foundation',
    levelBadge: 'Ground Floor',
    shortTag: 'Audience',
    title: 'Business Discovery',
    subtitle: 'Audience & offerings',
    simpleExplanation: 'Define who visits your website and the core products or services you provide.',
    keyDecision: 'Customer Persona & Value',
    previewChips: [{ label: 'Target Customers', active: true }, { label: 'Core Services' }, { label: 'Trust Badges' }],
    icon: Users,
    levelColor: 'bg-blue-600',
    levelGradient: 'from-blue-700 via-blue-600 to-blue-500',
    levelLightBg: 'bg-blue-50/50 hover:bg-blue-100/60',
    levelBorder: 'border-blue-200',
    levelText: 'text-blue-700',
    treadColor: 'bg-blue-500',
    elevation: '1.6m',
    timeEstimate: '2 min',
  },
  {
    step: 4,
    qNum: 'Q04',
    level: 2,
    levelName: 'Level 2: Identity',
    levelBadge: 'Brand Soul',
    shortTag: 'Mood',
    title: 'Brand Personality',
    subtitle: 'Mood & energy',
    simpleExplanation: 'Select the personality traits: Clean & Minimal, Bold Commercial, or Warm Editorial.',
    keyDecision: 'Brand Emotional Energy',
    previewChips: [{ label: 'Clean & Minimal', active: true }, { label: 'Bold Commercial' }, { label: 'Warm Editorial' }],
    icon: Sparkles,
    levelColor: 'bg-purple-600',
    levelGradient: 'from-purple-700 via-purple-600 to-purple-500',
    levelLightBg: 'bg-purple-50/50 hover:bg-purple-100/60',
    levelBorder: 'border-purple-200',
    levelText: 'text-purple-700',
    treadColor: 'bg-purple-500',
    elevation: '2.8m',
    timeEstimate: '2 min',
  },
  {
    step: 5,
    qNum: 'Q05',
    level: 2,
    levelName: 'Level 2: Identity',
    levelBadge: 'Brand Soul',
    shortTag: 'Style',
    title: 'Visual Direction',
    subtitle: 'Aesthetic tone',
    simpleExplanation: 'Set the visual tone: Modern Product, Luxury Editorial, or Friendly Consumer.',
    keyDecision: 'Stylistic Guardrails',
    previewChips: [{ label: 'Modern Product', active: true }, { label: 'Luxury Editorial' }, { label: 'Consumer Friendly' }],
    icon: Compass,
    levelColor: 'bg-purple-600',
    levelGradient: 'from-purple-700 via-purple-600 to-purple-500',
    levelLightBg: 'bg-purple-50/50 hover:bg-purple-100/60',
    levelBorder: 'border-purple-200',
    levelText: 'text-purple-700',
    treadColor: 'bg-purple-500',
    elevation: '3.6m',
    timeEstimate: '2 min',
  },
  {
    step: 6,
    qNum: 'Q06',
    level: 3,
    levelName: 'Level 3: Tokens',
    levelBadge: 'Style & Pieces',
    shortTag: 'Colors',
    title: 'Color Studio',
    subtitle: '14 curated palettes',
    simpleExplanation: 'Choose brand primary, secondary, and accent colors with auto-generated 50 to 900 ramps.',
    keyDecision: 'Tested 50-to-900 Color Ramps',
    previewChips: [{ label: 'Primary #B7410E', active: true, colorDot: '#b7410e' }, { label: 'Ink #0A0A0A', active: false, colorDot: '#0a0a0a' }, { label: 'Accent #3B82F6', active: false, colorDot: '#3b82f6' }],
    icon: Palette,
    levelColor: 'bg-amber-600',
    levelGradient: 'from-amber-700 via-amber-600 to-amber-500',
    levelLightBg: 'bg-amber-50/50 hover:bg-amber-100/60',
    levelBorder: 'border-amber-200',
    levelText: 'text-amber-700',
    treadColor: 'bg-amber-500',
    elevation: '4.8m',
    timeEstimate: '3 min',
  },
  {
    step: 7,
    qNum: 'Q07',
    level: 3,
    levelName: 'Level 3: Tokens',
    levelBadge: 'Style & Pieces',
    shortTag: 'Fonts',
    title: 'Typography Studio',
    subtitle: 'Modular font scales',
    simpleExplanation: 'Pair Google fonts for headings and body text using mathematical typographic ratios.',
    keyDecision: 'Modular Font Pairing Hierarchy',
    previewChips: [{ label: 'Heading: Michroma', active: true }, { label: 'Body: Sansation / Inter' }, { label: '1.25 Modular Scale' }],
    icon: Type,
    levelColor: 'bg-amber-600',
    levelGradient: 'from-amber-700 via-amber-600 to-amber-500',
    levelLightBg: 'bg-amber-50/50 hover:bg-amber-100/60',
    levelBorder: 'border-amber-200',
    levelText: 'text-amber-700',
    treadColor: 'bg-amber-500',
    elevation: '5.6m',
    timeEstimate: '3 min',
  },
  {
    step: 8,
    qNum: 'Q08',
    level: 3,
    levelName: 'Level 3: Tokens',
    levelBadge: 'Style & Pieces',
    shortTag: 'Photos',
    title: 'Website Imagery',
    subtitle: 'Photo rules & corners',
    simpleExplanation: 'Establish image aspect ratios, color grading filters, and corner border radiuses.',
    keyDecision: 'Photography Aspect & Radii',
    previewChips: [{ label: '16:9 Landscape', active: true }, { label: '12px Corner Radius' }, { label: 'Natural Warm Grading' }],
    icon: ImageIcon,
    levelColor: 'bg-amber-600',
    levelGradient: 'from-amber-700 via-amber-600 to-amber-500',
    levelLightBg: 'bg-amber-50/50 hover:bg-amber-100/60',
    levelBorder: 'border-amber-200',
    levelText: 'text-amber-700',
    treadColor: 'bg-amber-500',
    elevation: '6.4m',
    timeEstimate: '2 min',
  },
  {
    step: 9,
    qNum: 'Q09',
    level: 3,
    levelName: 'Level 3: Tokens',
    levelBadge: 'Style & Pieces',
    shortTag: 'Grid',
    title: 'Layout & Spacing',
    subtitle: '8pt rhythmic grid',
    simpleExplanation: 'Configure whitespace density, card padding, and page container maximum widths.',
    keyDecision: '8pt Rhythmic Spacing Grid',
    previewChips: [{ label: '8pt Base Grid', active: true }, { label: '1280px Max Container' }, { label: 'Balanced Density' }],
    icon: Sliders,
    levelColor: 'bg-amber-600',
    levelGradient: 'from-amber-700 via-amber-600 to-amber-500',
    levelLightBg: 'bg-amber-50/50 hover:bg-amber-100/60',
    levelBorder: 'border-amber-200',
    levelText: 'text-amber-700',
    treadColor: 'bg-amber-500',
    elevation: '7.2m',
    timeEstimate: '2 min',
  },
  {
    step: 10,
    qNum: 'Q10',
    level: 4,
    levelName: 'Level 4: Launch',
    levelBadge: 'The Summit',
    shortTag: 'UI Kit',
    title: 'UI Components',
    subtitle: 'Buttons, cards & nav',
    simpleExplanation: 'Review pre-assembled buttons, badges, navbars, and interactive cards in real time.',
    keyDecision: 'Production UI Component Library',
    previewChips: [{ label: 'Buttons (Solid/Ghost)', active: true }, { label: 'Glass Cards' }, { label: 'Header Navigation' }, { label: 'Form Inputs' }],
    icon: Layers,
    levelColor: 'bg-emerald-600',
    levelGradient: 'from-emerald-700 via-emerald-600 to-emerald-500',
    levelLightBg: 'bg-emerald-50/50 hover:bg-emerald-100/60',
    levelBorder: 'border-emerald-200',
    levelText: 'text-emerald-700',
    treadColor: 'bg-emerald-500',
    elevation: '8.2m',
    timeEstimate: '3 min',
  },
  {
    step: 11,
    qNum: 'Q11',
    level: 4,
    levelName: 'Level 4: Launch',
    levelBadge: 'The Summit',
    shortTag: 'Mobile',
    title: 'Screen Testing',
    subtitle: 'Phone, tablet & desktop',
    simpleExplanation: 'Ensure fluid responsiveness across mobile screens, iPads, and desktop displays.',
    keyDecision: 'Fluid Multi-Device Responsive',
    previewChips: [{ label: 'Mobile (390px)', active: true }, { label: 'Tablet (768px)' }, { label: 'Desktop (1440px)' }],
    icon: Smartphone,
    levelColor: 'bg-emerald-600',
    levelGradient: 'from-emerald-700 via-emerald-600 to-emerald-500',
    levelLightBg: 'bg-emerald-50/50 hover:bg-emerald-100/60',
    levelBorder: 'border-emerald-200',
    levelText: 'text-emerald-700',
    treadColor: 'bg-emerald-500',
    elevation: '9.0m',
    timeEstimate: '2 min',
  },
  {
    step: 12,
    qNum: 'Q12',
    level: 4,
    levelName: 'Level 4: Launch',
    levelBadge: 'The Summit',
    shortTag: 'Themes',
    title: 'Themes & Contrast',
    subtitle: 'Dark mode & WCAG AA',
    simpleExplanation: 'Audit accessibility contrast ratios and generate synchronized light/dark themes.',
    keyDecision: 'WCAG 2.1 AA Contrast Verified',
    previewChips: [{ label: 'Dark Mode Synced', active: true }, { label: 'WCAG AA 7.2:1 Pass' }, { label: 'Readable Body Copy' }],
    icon: ShieldCheck,
    levelColor: 'bg-emerald-600',
    levelGradient: 'from-emerald-700 via-emerald-600 to-emerald-500',
    levelLightBg: 'bg-emerald-50/50 hover:bg-emerald-100/60',
    levelBorder: 'border-emerald-200',
    levelText: 'text-emerald-700',
    treadColor: 'bg-emerald-500',
    elevation: '9.8m',
    timeEstimate: '2 min',
  },
  {
    step: 13,
    qNum: 'Q13',
    level: 4,
    levelName: 'Level 4: Launch',
    levelBadge: 'The Summit',
    shortTag: 'Review',
    title: 'Design Review',
    subtitle: 'Interactive live sandbox',
    simpleExplanation: 'Browse your generated website in an interactive sandbox with real navigation and forms.',
    keyDecision: 'Interactive Real-Time Preview',
    previewChips: [{ label: 'Live Website Sandbox', active: true }, { label: 'Simulate Clicks' }, { label: 'Inspect Styles' }],
    icon: Monitor,
    levelColor: 'bg-emerald-600',
    levelGradient: 'from-emerald-700 via-emerald-600 to-emerald-500',
    levelLightBg: 'bg-emerald-50/50 hover:bg-emerald-100/60',
    levelBorder: 'border-emerald-200',
    levelText: 'text-emerald-700',
    treadColor: 'bg-emerald-500',
    elevation: '10.5m',
    timeEstimate: '2 min',
  },
  {
    step: 14,
    qNum: 'Q14',
    level: 4,
    levelName: 'Level 4: Launch',
    levelBadge: 'The Summit',
    shortTag: 'Launch',
    title: 'Export Center',
    subtitle: 'Code, tokens & PDF',
    simpleExplanation: 'Export your production-ready Next.js 15 starter, JSON tokens, and PDF guide.',
    keyDecision: 'Five Deliverable Formats',
    previewChips: [{ label: 'Next.js 15 Starter', active: true }, { label: 'tokens.json' }, { label: 'PDF Spec (4pg)' }, { label: 'AI Prompt' }],
    icon: Download,
    levelColor: 'bg-emerald-600',
    levelGradient: 'from-emerald-700 via-emerald-600 to-emerald-500',
    levelLightBg: 'bg-emerald-50/50 hover:bg-emerald-100/60',
    levelBorder: 'border-emerald-200',
    levelText: 'text-emerald-700',
    treadColor: 'bg-emerald-500',
    elevation: '11.2m · Summit',
    timeEstimate: '1 min',
  },
];

interface StairwayFlight {
  id: number;
  numStr: string;
  badge: string;
  elevation: string;
  timeEstimate: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  gradient: string;
  accentColor: string;
  dotColor: string;
  stepRange: string;
  startStep: number;
  questions: StairQuestion[];
}

const STAIRWAY_FLIGHTS: StairwayFlight[] = [
  {
    id: 1,
    numStr: '01',
    badge: 'Ground Floor',
    elevation: '0.0m',
    timeEstimate: '6 min',
    title: 'Foundation Flight',
    subtitle: 'Project identity, website genre & market audience',
    description: 'Set the architectural bedrock of your product. Establish your brand naming, select from 32 proven industry website genres, and define your core target audience positioning.',
    image: '/images/stairway/flight_1_foundation.jpg',
    gradient: 'from-blue-600 to-indigo-600',
    accentColor: 'text-blue-600',
    dotColor: '#2563eb',
    stepRange: 'Q01–Q03 · 3 Decisions',
    startStep: 1,
    questions: STAIRCASE_QUESTIONS.filter(q => q.level === 1)
  },
  {
    id: 2,
    numStr: '02',
    badge: 'Brand Soul',
    elevation: '+3.0m Riser',
    timeEstimate: '5 min',
    title: 'Brand Soul Flight',
    subtitle: 'Energy, emotional tone & visual direction',
    description: 'Determine how your website feels in the first 50 milliseconds. Calibrate brand energy, temperament, and visual style from minimal editorial to bold modernist.',
    image: '/images/stairway/flight_2_brandsoul.jpg',
    gradient: 'from-purple-600 to-violet-600',
    accentColor: 'text-purple-600',
    dotColor: '#9333ea',
    stepRange: 'Q04–Q05 · 2 Decisions',
    startStep: 4,
    questions: STAIRCASE_QUESTIONS.filter(q => q.level === 2)
  },
  {
    id: 3,
    numStr: '03',
    badge: 'Design Engine',
    elevation: '+6.5m Engine',
    timeEstimate: '9 min',
    title: 'Tokens & Style Flight',
    subtitle: 'Color palettes, typography scales & 8pt rhythmic grid',
    description: 'Synthesize brand soul into mathematical design tokens: 14 harmonious color palettes, verified contrast ratios, bespoke typography pairings, and 8pt rhythmic spatial grids.',
    image: '/images/stairway/flight_3_tokens.jpg',
    gradient: 'from-amber-600 to-orange-600',
    accentColor: 'text-amber-600',
    dotColor: '#d97706',
    stepRange: 'Q06–Q09 · 4 Decisions',
    startStep: 6,
    questions: STAIRCASE_QUESTIONS.filter(q => q.level === 3)
  },
  {
    id: 4,
    numStr: '04',
    badge: 'The Summit',
    elevation: '+10.0m Summit',
    timeEstimate: '10 min',
    title: 'Summit & Launch Flight',
    subtitle: 'Production UI kit, mobile testing & multi-format code export',
    description: 'Assemble production UI components, test across phone/tablet/desktop, audit dark mode contrast, review in an interactive live sandbox, and export code in 5 formats.',
    image: '/images/stairway/flight_4_summit.jpg',
    gradient: 'from-emerald-600 to-teal-600',
    accentColor: 'text-emerald-600',
    dotColor: '#059669',
    stepRange: 'Q10–Q14 · 5 Decisions',
    startStep: 10,
    questions: STAIRCASE_QUESTIONS.filter(q => q.level === 4)
  }
];

const DELIVERABLES = [
  {
    id: 'pdf-spec',
    numStr: '01',
    kicker: 'PDF · 4 pages',
    title: 'Design System Specification',
    category: 'Specification',
    detail: '4 Pages · WCAG 2.1 AA Audit',
    year: '2025',
    format: 'PDF Vector Document',
    body: 'A typeset document with exact hex values, shade ramps, the type hierarchy, spacing rules and a WCAG AA contrast audit.',
    badge: 'Standard Handoff',
    specimens: ['Color Ramps & Contrast', 'Typography Scale Ratio', 'Border Radii & Shadows', 'Spacing 4px Baseline'],
  },
  {
    id: 'png-board',
    numStr: '02',
    kicker: 'PNG · 1600 x 1000',
    title: 'Visual Design Board',
    category: 'Visual Board',
    detail: '1600 × 1000 High-Res',
    year: '2025',
    format: 'PNG High-Res Board',
    body: 'A single shareable board with your palette, type pairing and every button and card state side by side.',
    badge: 'Figma & Pitch Ready',
    specimens: ['Light / Dark Switcher', 'Component Sandbox States', 'Interactive Hover States', 'Hero Layout Specimens'],
  },
  {
    id: 'ai-prompt',
    numStr: '03',
    kicker: 'Markdown',
    title: 'AI Website-Builder Prompt',
    category: 'AI System Prompt',
    detail: 'Cursor · Claude · v0 · ChatGPT',
    year: '2025',
    format: 'Markdown Prompt File',
    body: 'A system prompt for Claude, ChatGPT, Cursor or v0 that holds the build to your tokens instead of inventing new styles.',
    badge: 'LLM Orchestration',
    specimens: ['Token Strictness Guardrails', 'Component Hierarchy', 'Context Window Injection', 'Deterministic Theming'],
  },
  {
    id: 'tokens-pkg',
    numStr: '04',
    kicker: 'ZIP · 4 files',
    title: 'Developer Token Package',
    category: 'Token Package',
    detail: 'JSON + CSS + Tailwind + TS',
    year: '2025',
    format: 'Multi-Format Token ZIP',
    body: 'JSON design tokens, CSS custom properties, a Tailwind theme config and TypeScript constants.',
    badge: 'Engineers & Monorepo',
    specimens: ['tokens.json (W3C standard)', 'theme.css (Variables)', 'tailwind.config.ts', 'design-tokens.ts'],
  },
  {
    id: 'nextjs-starter',
    numStr: '05',
    kicker: 'ZIP · Next.js 15',
    title: 'Next.js Project Starter',
    category: 'Next.js Starter',
    detail: 'App Router · React 19',
    year: '2025',
    format: 'Production Next.js Template',
    body: 'A complete App Router project, with layout, page, globals and Tailwind config, pre-loaded with your system.',
    badge: 'Turnkey Launch',
    specimens: ['Next.js 15 App Router', 'React 19 Concurrent Mode', 'Zero-CSS-Debt Config', 'Production SEO Ready'],
  },
];

/* ------------------------------------------------------------------ */
/*  Motion helper                                                      */
/* ------------------------------------------------------------------ */

const Reveal: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({
  children,
  className,
  delay = 0,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

/* ------------------------------------------------------------------ */
/*  Landing page                                                       */
/* ------------------------------------------------------------------ */

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartNew,
  onExploreSample,
  onImportProject
}) => {
  const [selectedTypeId, setSelectedTypeId] = useState<string>('ecommerce');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeStairStep, setActiveStairStep] = useState<number>(1);
  const [activeFlight, setActiveFlight] = useState<number>(1);
  const [isFlightSectionHovered, setIsFlightSectionHovered] = useState(false);
  const [hoveredDeliverableId, setHoveredDeliverableId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [architectureTab, setArchitectureTab] = useState<'tokens' | '3d'>('tokens');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Scroll-driven active flight tracking (matching Infinite Automation .p3 behavior)
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const viewportFocus = window.innerHeight * 0.45;
          let bestFlight = 1;
          let bestDistance = Infinity;

          [1, 2, 3, 4].forEach((id) => {
            const el = document.getElementById(`flight-step-${id}`);
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const elementCenter = rect.top + rect.height / 2;
            const distance = Math.abs(elementCenter - viewportFocus);

            if (distance < bestDistance) {
              bestDistance = distance;
              bestFlight = id;
            }
          });

          setActiveFlight(bestFlight);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToFlight = (flightId: number) => {
    setActiveFlight(flightId);
    const el = document.getElementById(`flight-step-${flightId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDropdownOpen]);

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = event => {
        try {
          const content = event.target?.result as string;
          const imported = importProjectFromJson(content);
          if (onImportProject) {
            onImportProject(imported);
          } else {
            onExploreSample(imported);
          }
        } catch (err) {
          alert('Could not import design system JSON file. Please ensure it is a valid tokens JSON package.');
        }
      };
      reader.readAsText(file);
    }
  };

  const activePreset: ShowcasePreset =
    ALL_SHOWCASE_PRESETS.find((preset) => preset.id === selectedTypeId) ??
    ALL_SHOWCASE_PRESETS[0];

  const activeSample = activePreset.project;
  const activeSampleMeta = `${activePreset.category} · ${activePreset.typeName}`;

  const filteredPresets = ALL_SHOWCASE_PRESETS.filter((preset) => {
    const matchesSearch =
      preset.typeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      preset.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      preset.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      preset.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === 'All' || preset.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-paper font-dm text-ink antialiased">
      {/* =============================== HERO =============================== */}
      <section className="border-b border-rule">
        <div className="mx-auto max-w-7xl px-6 pt-14 pb-12 lg:pt-24 lg:pb-20">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
            {/* Copy — Luxury Founder-First Hero Component */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7"
            >
              {/* Product Badge Pill */}
              <div className="inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-white/90 border border-ink/10 shadow-xs hover:border-clay/40 transition-all group backdrop-blur-md mb-2">
                <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-amber-500/20 via-rose-500/20 to-clay/20 p-0.5 flex items-center justify-center shrink-0">
                  <img src="/icon.png" alt="D" className="w-full h-full object-contain rounded-sm drop-shadow-2xs" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold tracking-[0.16em] uppercase text-ink">
                    Design System Studio
                  </span>
                  <span className="w-1 h-1 rounded-full bg-ink/25" />
                  <span className="text-[10px] font-bold text-clay bg-clay-wash px-2 py-0.5 rounded-full border border-clay/15">
                    Founder-First
                  </span>
                </div>
              </div>

              {/* Main Headline */}
              <h1 className="mt-5 font-display text-[clamp(2.1rem,4.6vw,3.8rem)] font-bold leading-[1.08] tracking-[-0.025em] text-ink text-balance">
                Every great website starts with a <span className="text-transparent bg-clip-text bg-gradient-to-r from-clay via-rose-600 to-indigo-600">great design system</span>.
              </h1>

              {/* Subtitle in small font */}
              <p className="mt-4 max-w-xl text-[15px] sm:text-base leading-relaxed text-ink/70 text-pretty">
                Decide in just 14 questions.
              </p>

              {/* Value Highlight Pills */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-2.5 max-w-xl">
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/80 border border-rule/80 text-xs text-ink/75 font-semibold shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span>Live Website Render</span>
                </div>
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/80 border border-rule/80 text-xs text-ink/75 font-semibold shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                  <span>14 Guided Steps</span>
                </div>
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/80 border border-rule/80 text-xs text-ink/75 font-semibold shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                  <span>Universal Tokens</span>
                </div>
              </div>

              {/* CTA Actions */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  onClick={onStartNew}
                  className="group relative inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-clay via-clay to-clay-deep px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-clay/25 hover:shadow-xl hover:shadow-clay/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer overflow-hidden font-sansation tracking-wide"
                >
                  <Sparkles className="w-4 h-4 text-white/90 animate-pulse" />
                  <span>Start designing</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>

                {/* Secondary Action: Split-Chamber Import JSON / Tokens Button */}
                <label
                  className="group relative inline-flex items-stretch rounded-xl border border-ink/20 bg-white/95 hover:bg-stone-50 text-ink shadow-2xs hover:shadow-xs hover:border-ink/35 transition-all duration-200 active:scale-[0.98] cursor-pointer overflow-hidden font-sansation text-sm font-bold shrink-0"
                  title="Upload an existing Design System JSON tokens package"
                >
                  {/* Left Chamber: Upload SVG */}
                  <div className="flex items-center justify-center px-3 sm:px-3.5 py-3.5 bg-ink/[0.03] group-hover:bg-ink/[0.06] border-r border-ink/15 transition-colors">
                    <svg
                      className="w-4 h-4 text-ink/75 group-hover:text-ink transition-transform duration-200 group-hover:-translate-y-0.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </div>
                  {/* Right Chamber: Label */}
                  <div className="flex items-center justify-center px-4 sm:px-5 py-3.5 tracking-wide whitespace-nowrap">
                    <span>Import JSON / Tokens</span>
                  </div>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportJson}
                    className="hidden"
                  />
                </label>
              </div>
            </motion.div>

            {/* What you decide — Re-engineered Founder Architecture Board */}
            <Reveal className="lg:col-span-5 lg:pt-0">
              <div className="relative rounded-2xl border border-ink/10 bg-gradient-to-b from-white via-white to-stone-50/80 p-5 sm:p-6 shadow-xl shadow-ink/[0.04] backdrop-blur-md overflow-hidden">
                {/* Ambient Soft Glows */}
                <div
                  aria-hidden="true"
                  className="absolute -top-16 -right-16 w-56 h-56 bg-gradient-to-br from-amber-400/15 via-rose-400/10 to-transparent rounded-full blur-3xl pointer-events-none"
                />
                <div
                  aria-hidden="true"
                  className="absolute -bottom-16 -left-16 w-48 h-48 bg-gradient-to-tr from-blue-400/15 via-clay/10 to-transparent rounded-full blur-3xl pointer-events-none"
                />

                {/* Card Title & Value Proposition + 3D Mode Switcher */}
                <div className="relative flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-display text-lg sm:text-xl font-bold text-ink tracking-tight">
                      What You Decide
                    </h3>
                    <p className="mt-1 text-xs text-ink/55 leading-relaxed">
                      Six core dimensions in tokens & real-time 3D spatial models.
                    </p>
                  </div>
                  <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg border border-rule/60 text-[11px] font-semibold shrink-0">
                    <button
                      type="button"
                      onClick={() => setArchitectureTab('tokens')}
                      className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                        architectureTab === 'tokens'
                          ? 'bg-white text-ink shadow-2xs font-bold'
                          : 'text-ink/60 hover:text-ink'
                      }`}
                    >
                      Tokens
                    </button>
                    <button
                      type="button"
                      onClick={() => setArchitectureTab('3d')}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                        architectureTab === '3d'
                          ? 'bg-white text-ink shadow-2xs font-bold'
                          : 'text-ink/60 hover:text-ink'
                      }`}
                      title="Explore in real-time interactive 3D WebGL space"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-clay animate-pulse" />
                      <span>3D Space</span>
                    </button>
                  </div>
                </div>

                {architectureTab === '3d' ? (
                  <div className="relative mt-4 h-[330px] rounded-xl border border-ink/10 bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 overflow-hidden flex flex-col justify-between p-3.5 shadow-inner">
                    <Interactive3DCanvas
                      primaryColor={activeSample.colorPalette.primary}
                      accentColor={activeSample.colorPalette.accent}
                      className="absolute inset-0"
                    />
                    <div className="relative z-10 flex items-center justify-between pointer-events-none">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-white/80 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/15">
                        Interactive 3D WebGL
                      </span>
                      <span className="text-[10px] font-mono text-white/70 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded border border-white/10">
                        Move cursor to tilt
                      </span>
                    </div>
                    <div className="relative z-10 flex items-center justify-between pointer-events-none bg-black/35 backdrop-blur-md px-3 py-2 rounded-lg border border-white/10">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full ring-2 ring-white/20 shadow-xs"
                          style={{ backgroundColor: activeSample.colorPalette.primary }}
                        />
                        <span className="text-xs font-semibold text-white/95">
                          {activePreset.label} · 3D Knot Mesh
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-white/60">
                        Smooth 60 FPS
                      </span>
                    </div>
                  </div>
                ) : (
                  /* Decision Dimension Rows */
                  <div className="relative mt-4 space-y-2">
                    {DECISIONS.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.id}
                          className="group relative flex items-center justify-between gap-3 p-2.5 rounded-xl border border-rule/70 bg-white/70 hover:bg-white hover:border-ink/20 hover:shadow-xs transition-all duration-200"
                        >
                          {/* Left: Icon + Category + Subtitle */}
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.accent} border flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform`}
                            >
                              <Icon className={`w-4 h-4 ${item.iconColor}`} />
                            </div>
                            <div className="min-w-0">
                              <span className="text-xs sm:text-sm font-semibold text-ink tracking-tight block">
                                {item.label}
                              </span>
                              <p className="text-[11px] text-ink/50 truncate">
                                {item.title}
                              </p>
                            </div>
                          </div>

                          {/* Right: Visual Element & Badge */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            {item.id === 'colour' && (
                              <div className="flex items-center -space-x-1 mr-1">
                                {[
                                  activeSample.colorPalette.primary,
                                  activeSample.colorPalette.secondary,
                                  activeSample.colorPalette.accent,
                                  activeSample.colorPalette.textPrimary,
                                  activeSample.colorPalette.surface
                                ].map((hex, i) => (
                                  <span
                                    key={i}
                                    className="w-3.5 h-3.5 rounded-full ring-1 ring-white shadow-2xs"
                                    style={{ backgroundColor: hex }}
                                    title={hex}
                                  />
                                ))}
                              </div>
                            )}
                            {item.id === 'type' && (
                              <span className="px-1.5 py-0.5 rounded bg-ink/5 font-mono text-[10px] font-bold text-ink/80 mr-1 max-w-[120px] truncate" title={`${activeSample.typography.headingFont} / ${activeSample.typography.bodyFont}`}>
                                {activeSample.typography.headingFont.split(' ')[0]}
                              </span>
                            )}
                            {item.id === 'accessibility' && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-mono font-medium border border-emerald-200/60 mr-1">
                                <Check className="w-2.5 h-2.5 text-emerald-600 stroke-[3]" />
                                AA Pass
                              </span>
                            )}
                            <span className="font-mono text-[10px] sm:text-[11px] text-ink/50 bg-stone-100/80 px-2 py-0.5 rounded-md border border-rule/60">
                              {item.badge}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* =========================== LIVE RENDER =========================== */}
      <section id="live-render" className="border-b border-rule">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:py-20">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <Reveal>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink/45">
                Live render
              </p>
              <h2 className="mt-4 max-w-lg font-display text-[clamp(1.7rem,3.3vw,2.4rem)] font-semibold leading-[1.1] tracking-[-0.015em] text-ink text-balance">
                Every website type, running through the same live renderer.
              </h2>
            </Reveal>

            {/* Dropdown Selector & "Create Yours" Action Button */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              {/* Modern Borderless Dropdown Selector */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="group relative flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-stone-100/95 hover:bg-stone-200/80 active:bg-stone-200 text-ink shadow-xs transition-all duration-200 cursor-pointer select-none border border-transparent hover:border-ink/10"
                  aria-haspopup="listbox"
                  aria-expanded={isDropdownOpen}
                  title="Select website type to preview design system"
                >
                  {/* Live Glowing Color Beacon */}
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span
                      className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
                      style={{ backgroundColor: activePreset.project.colorPalette.primary }}
                    />
                    <span
                      className="relative inline-flex rounded-full h-2.5 w-2.5 shadow-2xs"
                      style={{ backgroundColor: activePreset.project.colorPalette.primary }}
                    />
                  </span>

                  {/* Brand & Type Label */}
                  <div className="flex items-center gap-1.5 text-left max-w-[140px] sm:max-w-[200px] truncate">
                    <span className="text-xs sm:text-sm font-bold font-sansation text-ink tracking-tight truncate">
                      {activePreset.label}
                    </span>
                  </div>

                  {/* Category Pill */}
                  <span className="hidden sm:inline-flex items-center text-[10px] px-2 py-0.5 rounded-full font-mono font-medium bg-black/[0.06] text-ink/65 shrink-0">
                    {activePreset.category}
                  </span>

                  {/* Chevron */}
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-ink/50 group-hover:text-ink transition-transform duration-200 shrink-0 ${
                      isDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Popup Panel */}
                {isDropdownOpen && (
                  <div
                    className="absolute right-0 sm:right-0 left-auto mt-2 w-[calc(100vw-3rem)] max-w-sm sm:w-96 rounded-2xl bg-white/95 backdrop-blur-2xl border border-ink/10 shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150 text-left"
                    style={{
                      boxShadow: '0 20px 40px -15px rgba(0,0,0,0.15), 0 0 1px 1px rgba(0,0,0,0.06)',
                    }}
                  >
                    {/* Search & Header */}
                    <div className="p-1 mb-2">
                      <div className="flex items-center justify-between px-2 pb-2 border-b border-rule/70">
                        <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-ink/45 font-semibold">
                          Website Types ({ALL_SHOWCASE_PRESETS.length})
                        </span>
                        <span className="text-[10px] font-mono text-clay font-bold">
                          Live Auto-Calibrate
                        </span>
                      </div>

                      <div className="relative mt-2">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink/40 pointer-events-none" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search types (e.g. fashion, saas, restaurant)..."
                          className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-stone-100/80 hover:bg-stone-100 focus:bg-white text-xs text-ink placeholder:text-ink/40 border border-transparent focus:border-clay/40 focus:outline-none transition-all"
                          autoFocus
                        />
                      </div>

                      {/* Quick Category Chips */}
                      <div className="mt-2 flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-[11px]">
                        {['All', 'Commerce', 'Software & Technology', 'Creative', 'Agency', 'Local'].map((catKey) => {
                          const label = catKey === 'Software & Technology' ? 'SaaS' : catKey;
                          const isCatActive =
                            (catKey === 'Creative' && activeCategory === 'Portfolio & Creative') ||
                            (catKey === 'Agency' && activeCategory === 'Business & Agency') ||
                            (catKey === 'Local' && activeCategory === 'Local & Services') ||
                            activeCategory === catKey;
                          return (
                            <button
                              key={catKey}
                              type="button"
                              onClick={() => {
                                if (catKey === 'Creative') setActiveCategory('Portfolio & Creative');
                                else if (catKey === 'Agency') setActiveCategory('Business & Agency');
                                else if (catKey === 'Local') setActiveCategory('Local & Services');
                                else setActiveCategory(catKey);
                              }}
                              className={`px-2.5 py-1 rounded-full whitespace-nowrap font-medium transition-all cursor-pointer ${
                                isCatActive
                                  ? 'bg-ink text-white font-semibold'
                                  : 'bg-stone-100/70 text-ink/65 hover:bg-stone-200/70'
                              }`}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Presets List */}
                    <div className="max-h-[300px] overflow-y-auto space-y-1 pr-1 overscroll-contain">
                      {filteredPresets.length === 0 ? (
                        <div className="p-6 text-center text-xs text-ink/50">
                          No website types found matching "{searchQuery}"
                        </div>
                      ) : (
                        filteredPresets.map((preset) => {
                          const isSelected = preset.id === activePreset.id;
                          return (
                            <button
                              key={preset.id}
                              type="button"
                              onClick={() => {
                                setSelectedTypeId(preset.id);
                                setIsDropdownOpen(false);
                                setSearchQuery('');
                              }}
                              className={`w-full group flex items-start gap-3 p-2.5 rounded-xl transition-all cursor-pointer text-left ${
                                isSelected
                                  ? 'bg-clay-wash/80 border border-clay/25'
                                  : 'hover:bg-stone-100/80 border border-transparent'
                              }`}
                            >
                              <span
                                className="w-3 h-3 rounded-full shrink-0 mt-0.5 shadow-2xs"
                                style={{ backgroundColor: preset.project.colorPalette.primary }}
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1.5">
                                  <span className="text-xs font-bold text-ink truncate group-hover:text-clay transition-colors">
                                    {preset.typeName}
                                  </span>
                                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/[0.04] text-ink/50 shrink-0">
                                    {preset.category}
                                  </span>
                                </div>
                                <p className="text-[11px] text-ink/55 truncate mt-0.5">
                                  <strong className="text-ink/80 font-medium">{preset.label}</strong> — {preset.description}
                                </p>
                              </div>
                              {isSelected && (
                                <Check className="w-4 h-4 text-clay stroke-[2.5] shrink-0 mt-0.5" />
                              )}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* High-Converting "Create Yours" Action Button */}
              <button
                type="button"
                onClick={onStartNew}
                className="group relative inline-flex items-center gap-2 px-5 py-2 sm:py-2.5 rounded-full bg-clay hover:bg-clay-deep text-white text-xs sm:text-sm font-bold font-sansation shadow-md shadow-clay/25 hover:shadow-lg hover:shadow-clay/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer select-none shrink-0"
                title="Create your own custom website design system"
              >
                <Sparkles className="w-3.5 h-3.5 text-white/90 animate-pulse" />
                <span className="tracking-wide">Create Yours</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>

          <Reveal>
            <div className="mt-10 border border-ink/15 p-2.5 sm:p-3">
              <div className="h-[600px] w-full">
                <LiveWebsitePreview project={activeSample} initialViewport="desktop" />
              </div>
            </div>
          </Reveal>

          <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-2 font-mono text-[11px] uppercase tracking-[0.12em] text-ink/45">
            <span>{activeSampleMeta}</span>
            {(['primary', 'secondary', 'accent'] as const).map((key) => (
              <span key={key} className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-[2px] border border-ink/15"
                  style={{ backgroundColor: activeSample.colorPalette[key] }}
                />
                {activeSample.colorPalette[key]}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* =========================== ARCHITECTURAL 14-QUESTION STAIRCASE (INFINITE AUTOMATION INSPIRED) =========================== */}
      <section
        id="steps"
        className="relative bg-[#07121B] text-white py-20 lg:py-32 border-b border-white/10"
      >
        <div className="mx-auto max-w-7xl px-6">
          {/* Header Row: Eyebrow + Split Title and Subtitle */}
          <Reveal>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pb-12 lg:pb-16 border-b border-white/10">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2.5 font-mono text-[11px] uppercase font-bold tracking-[0.2em] text-clay mb-3">
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-clay via-rose-500 to-indigo-500 shadow-2xs" />
                  <span>The 14-Step Stairway Architecture</span>
                </div>
                <h2 className="font-display text-[clamp(2.2rem,4.2vw,3.4rem)] font-bold leading-[1.06] tracking-[-0.03em] text-white text-balance">
                  Climb the 14-step staircase to your{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-clay via-rose-500 to-indigo-400">
                    finished website.
                  </span>
                </h2>
              </div>
              <p className="max-w-[420px] text-base sm:text-lg leading-relaxed text-white/65 text-pretty font-light">
                One connected system across strategy, typography, tokens, and code. Four ascending flights from initial idea to production-ready design system.
              </p>
            </div>
          </Reveal>

          {/* 2-Column Exact Infinite Automation Section: Left Sticky Visual, Right Scrollable Flights */}
          <div className="mt-12 lg:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start relative">
            
            {/* Left Column: STICKY Visual Showcase Card */}
            <div className="lg:col-span-6 flex flex-col">
              {(() => {
                const activeFlightData = STAIRWAY_FLIGHTS.find((f) => f.id === activeFlight) || STAIRWAY_FLIGHTS[0];
                return (
                  <div className="lg:sticky lg:top-24 w-full h-[460px] sm:h-[540px] lg:h-[calc(100vh-140px)] lg:max-h-[660px] lg:min-h-[480px] rounded-[32px] overflow-hidden bg-[#0E1E2A] border border-white/10 shadow-2xl flex flex-col justify-between relative select-none">
                    {/* Ambient studio soft radial lighting */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,#ffffff_0%,#E4EEF3_75%,#D0DFE8_100%)] pointer-events-none" />

                    {/* Active Flight Image with Smooth Crossfade Animation */}
                    <div className="absolute inset-0 flex items-center justify-center p-8 sm:p-14 pointer-events-none">
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={activeFlightData.id}
                          src={activeFlightData.image}
                          alt={activeFlightData.title}
                          initial={{ opacity: 0, scale: 0.93, y: 14 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 1.04, y: -14 }}
                          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                          className="w-full h-full object-contain drop-shadow-2xl select-none"
                        />
                      </AnimatePresence>
                    </div>

                    {/* Bottom Gradient Overlay & Flight Indicator Controls (Exact IA Layout) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#07121B]/95 via-[#07121B]/40 to-transparent pointer-events-none" />

                    {/* Bottom Row: Big Number on Left, 4 Dash Indicators on Right */}
                    <div className="relative z-10 p-6 sm:p-8 flex items-end justify-between text-white pointer-events-auto">
                      <div>
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={activeFlightData.numStr}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -14 }}
                            transition={{ duration: 0.3 }}
                            className="font-display text-7xl sm:text-8xl lg:text-9xl font-bold leading-[0.85] tracking-tight text-white select-none"
                          >
                            {activeFlightData.numStr}
                          </motion.div>
                        </AnimatePresence>
                      </div>

                      {/* 4-Flight Dash Bar Indicators */}
                      <div className="flex items-center gap-2">
                        {STAIRWAY_FLIGHTS.map((flight) => {
                          const isActive = flight.id === activeFlight;
                          return (
                            <button
                              key={flight.id}
                              type="button"
                              onClick={() => scrollToFlight(flight.id)}
                              aria-label={`Scroll to Flight ${flight.numStr}`}
                              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                                isActive
                                  ? 'w-10 sm:w-12 bg-white shadow-sm'
                                  : 'w-2.5 sm:w-3 bg-white/40 hover:bg-white/75'
                              }`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Right Column: Scrollable List of Flights with Active Vertical Indicator */}
            <div className="lg:col-span-6 relative border-l border-white/15 pl-8 sm:pl-12 lg:pl-16 space-y-28 sm:space-y-40 lg:space-y-48 pb-32 pt-8">
              {STAIRWAY_FLIGHTS.map((flight) => {
                const isActive = flight.id === activeFlight;
                return (
                  <div
                    key={flight.id}
                    id={`flight-step-${flight.id}`}
                    onClick={() => scrollToFlight(flight.id)}
                    className="min-h-[55vh] lg:min-h-[65vh] flex flex-col justify-center relative select-none cursor-pointer group transition-all"
                  >
                    {/* Active Vertical Indicator Line on Left Border */}
                    {isActive && (
                      <motion.span
                        layoutId="iaActiveFlightIndicator"
                        className="absolute -left-[33px] sm:-left-[49px] lg:-left-[65px] top-0 bottom-0 w-[3px] rounded-full bg-gradient-to-b from-clay via-rose-500 to-indigo-500 shadow-sm"
                        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                      />
                    )}

                    {/* Flight Metadata Row */}
                    <div className="flex items-center gap-3 sm:gap-4 mb-3">
                      <span
                        className={`font-mono text-base sm:text-lg font-bold transition-colors ${
                          isActive ? 'text-clay' : 'text-white/35'
                        }`}
                      >
                        {flight.numStr}
                      </span>
                      <span
                        className={`text-xs font-mono font-bold px-3 py-1 rounded-full border transition-all ${
                          isActive
                            ? 'bg-white/10 text-white border-white/25 shadow-xs'
                            : 'bg-white/4 text-white/45 border-white/8'
                        }`}
                      >
                        {flight.badge}
                      </span>
                      <span className="text-xs font-mono text-white/50 hidden sm:inline">
                        {flight.elevation}
                      </span>
                      <span className="text-xs font-mono text-white/40 hidden sm:inline">
                        ~{flight.timeEstimate}
                      </span>
                    </div>

                    {/* Flight Title */}
                    <h3
                      className={`font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight transition-all duration-400 mt-2 ${
                        isActive
                          ? 'text-white'
                          : 'text-white/30 group-hover:text-white/60'
                      }`}
                    >
                      {flight.title}
                    </h3>

                    {/* Flight Description */}
                    <p
                      className={`mt-4 text-base sm:text-lg leading-relaxed max-w-xl font-light transition-all duration-400 ${
                        isActive ? 'text-white/75' : 'text-white/30 line-clamp-2'
                      }`}
                    >
                      {flight.description}
                    </p>

                    {/* Active Question Decisions Chips */}
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-6 flex flex-wrap gap-2"
                      >
                        {flight.questions.map((q) => {
                          const Icon = q.icon;
                          return (
                            <div
                              key={q.step}
                              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/8 border border-white/12 backdrop-blur-md text-xs text-white/90 shadow-2xs"
                            >
                              <Icon className="w-3.5 h-3.5 text-clay stroke-[2]" />
                              <span className="font-mono font-bold text-clay">{q.qNum}</span>
                              <span className="font-medium text-white/95">{q.title}</span>
                              <span className="font-mono text-[10px] text-white/45 hidden md:inline">
                                ({q.keyDecision})
                              </span>
                            </div>
                          );
                        })}
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </section>

      {/* ============================ DELIVERABLES INDEX (INFINITE AUTOMATION PROJECT INDEX STYLE) ============================ */}
      <section
        id="exports"
        className="border-b border-rule bg-white relative py-20 lg:py-28"
        onMouseMove={(e) => {
          setMousePos({ x: e.clientX, y: e.clientY });
        }}
      >
        <div className="mx-auto max-w-7xl px-6">
          {/* Section Introduction: Editorial Context */}
          <div className="mb-14 lg:mb-16 max-w-3xl">
            <Reveal>
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-clay" />
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-clay font-bold">
                  WHAT YOU EXPORT
                </p>
              </div>
              <h2 className="font-display text-[clamp(2.2rem,4.2vw,3.4rem)] font-bold leading-[1.06] tracking-[-0.03em] text-ink text-balance">
                Five formats, one token set.
              </h2>
              <p className="mt-4 text-base sm:text-lg leading-relaxed text-ink/65 max-w-2xl font-light">
                Everything is generated from the same decisions, so the specification, the code
                and the rendered site can never disagree.
              </p>
            </Reveal>
          </div>

          {/* Table Header Row: Exact Infinite Automation Project Index Layout */}
          <Reveal delay={0.05}>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 pb-5 border-b border-ink/80">
              <div className="flex items-baseline gap-2.5">
                <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink">
                  Deliverables index
                </h3>
                <span className="font-display text-xl sm:text-2xl font-normal text-ink/40">
                  (5)
                </span>
              </div>
              <p className="text-xs sm:text-[13px] text-ink/50 font-normal">
                Hover to preview · click to open
              </p>
            </div>
          </Reveal>

          {/* List: Exact IA Micro-Animations and Micro-Interactions */}
          <div className="group/list relative">
            {DELIVERABLES.map((item) => {
              return (
                <div
                  key={item.id}
                  onMouseEnter={() => setHoveredDeliverableId(item.id)}
                  onMouseLeave={() => setHoveredDeliverableId(null)}
                  onClick={onStartNew}
                  className="group relative flex items-center justify-between py-6 sm:py-7 lg:py-8 border-b border-rule/75 cursor-pointer select-none transition-opacity duration-400 group-hover/list:opacity-35 hover:!opacity-100"
                >
                  {/* Left: 01-05 number + title */}
                  <div className="flex items-center gap-6 sm:gap-10 min-w-0 flex-1 pr-4">
                    <span className="font-mono text-sm sm:text-base font-bold text-clay shrink-0">
                      {item.numStr}
                    </span>
                    <div className="min-w-0">
                      <h4 className="font-display text-xl sm:text-2xl lg:text-[32px] font-bold text-ink leading-tight tracking-[-0.03em] transition-transform duration-600 ease-[0.22,1,0.36,1] group-hover:translate-x-3 truncate">
                        {item.title}
                      </h4>
                      <p className="mt-1 text-xs sm:text-sm text-ink/50 truncate max-w-xl hidden sm:block">
                        {item.body}
                      </p>
                    </div>
                  </div>

                  {/* Middle Metadata: Category & Detail / Year */}
                  <div className="hidden md:flex items-center gap-8 lg:gap-16 shrink-0 text-left">
                    <span className="text-sm font-medium text-ink/65 min-w-[130px]">
                      {item.category}
                    </span>
                    <span className="text-sm font-mono text-ink/50 min-w-[80px]">
                      {item.year || '2025'}
                    </span>
                  </div>

                  {/* Right: Circular Arrow Button that rotates -45deg and fills with gradient on hover */}
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-ink/20 flex items-center justify-center text-ink/75 group-hover:bg-gradient-to-r group-hover:from-clay group-hover:via-rose-600 group-hover:to-indigo-600 group-hover:border-transparent group-hover:text-white group-hover:-rotate-45 transition-all duration-450 ease-[0.22,1,0.36,1] shadow-2xs shrink-0 ml-4">
                    <ArrowRight className="w-4 h-4 stroke-[2.2] transition-transform duration-300" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Floating Hover Specimen Preview Window Following Cursor */}
          <AnimatePresence>
            {hoveredDeliverableId && (
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 12 }}
                transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                style={{
                  position: 'fixed',
                  left: mousePos.x + 28,
                  top: mousePos.y - 130,
                  pointerEvents: 'none',
                  zIndex: 60,
                }}
                className="hidden lg:block w-[360px] rounded-2xl bg-white/95 backdrop-blur-xl border border-ink/15 shadow-2xl p-5 overflow-hidden"
              >
                {(() => {
                  const item = DELIVERABLES.find((d) => d.id === hoveredDeliverableId);
                  if (!item) return null;
                  return (
                    <div>
                      <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-rule">
                        <span className="font-mono text-[11px] uppercase font-bold text-clay tracking-wider">
                          Deliverable {item.numStr} · {item.category}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[10px] font-mono text-emerald-600 font-bold uppercase">Ready</span>
                        </div>
                      </div>

                      <div className="font-display text-base font-bold text-ink">
                        {item.title}
                      </div>
                      <p className="mt-1.5 text-xs text-ink/65 leading-relaxed">
                        {item.body}
                      </p>

                      {/* Specimen pill checklist */}
                      <div className="mt-3.5 space-y-1.5">
                        <div className="text-[10px] font-mono uppercase tracking-wider text-ink/40 font-semibold">
                          Includes in package
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {(item.specimens || [item.detail]).map((spec, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md bg-stone-100 text-[10px] font-mono text-ink/75 border border-ink/8"
                            >
                              ✓ {spec}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 pt-2.5 border-t border-rule/60 flex items-center justify-between text-[11px] font-mono">
                        <span className="text-ink/50">{item.detail}</span>
                        <span className="text-clay font-bold flex items-center gap-1">
                          Click to open →
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ============================== CTA ============================== */}
      <section className="bg-clay">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:py-20">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-display text-[clamp(1.9rem,3.6vw,2.75rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-white">
                Ready when you are.
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-white/80">
                About thirty minutes, no sign-up, and everything saves to your browser as you go.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onStartNew}
                className="group inline-flex items-center gap-2.5 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-ink transition-colors hover:bg-white/90 active:scale-[0.99] font-sansation shadow-sm"
              >
                Create my design system
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </button>
              <button
                onClick={() => onExploreSample(activeSample)}
                className="inline-flex items-center gap-2 rounded-md border border-white/50 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Open the live demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================= FOOTER ============================= */}
      <footer className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center">
            <img
              src="/logo.png"
              alt="Design System Studio"
              className="h-10 sm:h-12 w-auto object-contain mix-blend-multiply select-none"
            />
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink/40">
            Runs locally in your browser
          </p>
        </div>
      </footer>
    </div>
  );
};
