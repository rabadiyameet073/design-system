import { z } from 'zod';

export type CategoryId =
  | 'commerce'
  | 'saas'
  | 'portfolio'
  | 'publishing'
  | 'hospitality'
  | 'education'
  | 'architecture'
  | 'finance';

export const CategoryIdSchema = z.enum([
  'commerce',
  'saas',
  'portfolio',
  'publishing',
  'hospitality',
  'education',
  'architecture',
  'finance'
]);

export type FontRole = 'display' | 'heading' | 'body' | 'ui' | 'mono' | 'accent';
export const FontRoleSchema = z.enum(['display', 'heading', 'body', 'ui', 'mono', 'accent']);

export type ScaleStep = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;
export const SCALE_STEPS: ScaleStep[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

export type ColorScale = Record<ScaleStep, string>;
export const ColorScaleSchema = z.record(z.string(), z.string());

export interface SemanticColors {
  bgDefault: string;
  bgSurface: string;
  bgElevated: string;
  fgDefault: string;
  fgMuted: string;
  borderDefault: string;
  actionPrimary: string;
  actionPrimaryFg: string;
  actionPrimaryHover: string;
  focusRing: string;
  statusSuccess: string;
  statusSuccessBg: string;
  statusSuccessFg: string;
  statusWarning: string;
  statusWarningBg: string;
  statusWarningFg: string;
  statusDanger: string;
  statusDangerBg: string;
  statusDangerFg: string;
  statusInfo: string;
  statusInfoBg: string;
  statusInfoFg: string;
}

export const SemanticColorsSchema = z.object({
  bgDefault: z.string(),
  bgSurface: z.string(),
  bgElevated: z.string(),
  fgDefault: z.string(),
  fgMuted: z.string(),
  borderDefault: z.string(),
  actionPrimary: z.string(),
  actionPrimaryFg: z.string(),
  actionPrimaryHover: z.string(),
  focusRing: z.string(),
  statusSuccess: z.string(),
  statusSuccessBg: z.string(),
  statusSuccessFg: z.string(),
  statusWarning: z.string(),
  statusWarningBg: z.string(),
  statusWarningFg: z.string(),
  statusDanger: z.string(),
  statusDangerBg: z.string(),
  statusDangerFg: z.string(),
  statusInfo: z.string(),
  statusInfoBg: z.string(),
  statusInfoFg: z.string()
});

export interface RoleStyle {
  family: string;
  fallback: string[];
  weight: number;
  lineHeight: number;
  letterSpacing: string;
  textTransform?: 'none' | 'uppercase' | 'capitalize';
}

export const RoleStyleSchema = z.object({
  family: z.string(),
  fallback: z.array(z.string()),
  weight: z.number(),
  lineHeight: z.number(),
  letterSpacing: z.string(),
  textTransform: z.enum(['none', 'uppercase', 'capitalize']).optional()
});

export interface TypeScaleEntry {
  minPx: number;
  maxPx: number;
  css: string;
}

export interface TypographyTokens {
  roles: Record<FontRole, RoleStyle | null>;
  baseSizePx: number;
  scaleRatio: number;
  fluid: { minVw: number; maxVw: number };
  scale: Record<'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl', TypeScaleEntry>;
  scripts: string[];
}

export const TypographyTokensSchema = z.object({
  roles: z.record(FontRoleSchema, RoleStyleSchema.nullable()),
  baseSizePx: z.number().min(12).default(16),
  scaleRatio: z.number().default(1.25),
  fluid: z.object({
    minVw: z.number().default(360),
    maxVw: z.number().default(1280)
  }),
  scale: z.record(z.string(), z.object({
    minPx: z.number(),
    maxPx: z.number(),
    css: z.string()
  })),
  scripts: z.array(z.string()).default(['latin'])
});

export interface DesignTokens {
  schemaVersion: 1;
  meta: {
    projectName: string;
    slug: string;
    genreId: string;
    category: CategoryId;
    goal: string;
    audience: string;
    scripts: string[];
    darkMode: 'none' | 'auto' | 'manual';
    personality: {
      energy: number;
      craft: number;
      voice: number;
      formality: number;
      density: number;
    };
  };
  color: {
    primitives: Record<'brand' | 'accent' | 'neutral' | 'success' | 'warning' | 'danger' | 'info', ColorScale>;
    semantic: {
      light: SemanticColors;
      dark: SemanticColors;
    };
  };
  typography: TypographyTokens;
  space: {
    base: 4 | 8;
    scale: number[];
  };
  radius: {
    none: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
  };
  shadow: {
    sm: string;
    md: string;
    lg: string;
  };
  border: {
    width: number;
    style: 'solid' | 'dashed';
  };
  layout: {
    container: number;
    gutter: number;
    columns: 4 | 8 | 12;
    breakpoints: Record<'sm' | 'md' | 'lg' | 'xl', number>;
  };
  motion: {
    level: 'none' | 'subtle' | 'expressive';
    duration: Record<'fast' | 'base' | 'slow', number>;
    easing: Record<'standard' | 'emphasized', string>;
  };
  imagery: {
    overlay: number;
    grain: number;
    radius: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    treatment: 'natural' | 'duotone' | 'mono';
  };
  icon: {
    library: 'lucide' | 'phosphor' | 'tabler';
    style: 'outline' | 'filled' | 'duotone';
    strokeWidth: number;
  };
  component: {
    buttonRadius: string;
    cardRadius: string;
    inputRadius: string;
    buttonPadding: string;
    cardPadding: string;
  };
}

export const DesignTokensSchema = z.object({
  schemaVersion: z.literal(1).default(1),
  meta: z.object({
    projectName: z.string(),
    slug: z.string(),
    genreId: z.string(),
    category: CategoryIdSchema,
    goal: z.string().default(''),
    audience: z.string().default(''),
    scripts: z.array(z.string()).default(['latin']),
    darkMode: z.enum(['none', 'auto', 'manual']).default('auto'),
    personality: z.object({
      energy: z.number().min(0).max(100).default(50),
      craft: z.number().min(0).max(100).default(50),
      voice: z.number().min(0).max(100).default(50),
      formality: z.number().min(0).max(100).default(50),
      density: z.number().min(0).max(100).default(50)
    })
  }),
  color: z.object({
    primitives: z.record(z.enum(['brand', 'accent', 'neutral', 'success', 'warning', 'danger', 'info']), ColorScaleSchema),
    semantic: z.object({
      light: SemanticColorsSchema,
      dark: SemanticColorsSchema
    })
  }),
  typography: TypographyTokensSchema,
  space: z.object({
    base: z.union([z.literal(4), z.literal(8)]).default(4),
    scale: z.array(z.number()).default([0, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128])
  }),
  radius: z.object({
    none: z.number().default(0),
    sm: z.number().default(4),
    md: z.number().default(8),
    lg: z.number().default(12),
    xl: z.number().default(16),
    full: z.number().default(9999)
  }),
  shadow: z.object({
    sm: z.string(),
    md: z.string(),
    lg: z.string()
  }),
  border: z.object({
    width: z.number().default(1),
    style: z.enum(['solid', 'dashed']).default('solid')
  }),
  layout: z.object({
    container: z.number().default(1280),
    gutter: z.number().default(24),
    columns: z.union([z.literal(4), z.literal(8), z.literal(12)]).default(12),
    breakpoints: z.record(z.enum(['sm', 'md', 'lg', 'xl']), z.number()).default({
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280
    })
  }),
  motion: z.object({
    level: z.enum(['none', 'subtle', 'expressive']).default('subtle'),
    duration: z.object({
      fast: z.number().default(150),
      base: z.number().default(250),
      slow: z.number().default(400)
    }),
    easing: z.object({
      standard: z.string().default('cubic-bezier(0.16, 1, 0.3, 1)'),
      emphasized: z.string().default('cubic-bezier(0.32, 0.72, 0, 1)')
    })
  }),
  imagery: z.object({
    overlay: z.number().default(0.1),
    grain: z.number().default(0),
    radius: z.enum(['none', 'sm', 'md', 'lg', 'xl']).default('md'),
    treatment: z.enum(['natural', 'duotone', 'mono']).default('natural')
  }),
  icon: z.object({
    library: z.enum(['lucide', 'phosphor', 'tabler']).default('lucide'),
    style: z.enum(['outline', 'filled', 'duotone']).default('outline'),
    strokeWidth: z.number().default(2)
  }),
  component: z.object({
    buttonRadius: z.string().default('8px'),
    cardRadius: z.string().default('12px'),
    inputRadius: z.string().default('8px'),
    buttonPadding: z.string().default('10px 20px'),
    cardPadding: z.string().default('24px')
  })
});
