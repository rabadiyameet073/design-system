import { DesignTokens, CategoryId } from '../../tokens/types';
import { generateAllColorPrimitives } from '../../tokens/colorScale';
import { createLightSemanticColors, createDarkSemanticColors } from '../../tokens/semanticMapping';
import { RADIUS_PRESETS, RadiusPresetKey, generateSpaceScale } from '../../tokens/shapeGenerator';
import { generateFullTypeScale } from '../../utils/typeScale';

export interface GenreDefaultsOptions {
  brandHex: string;
  accentHex: string;
  displayFont: string;
  headingFont: string;
  bodyFont: string;
  monoFont?: string;
  scaleRatio?: number;
  radiusKey: RadiusPresetKey;
  density: 'airy' | 'balanced' | 'compact';
  buttonStyle: 'solid' | 'outline' | 'subtle' | 'minimal';
  imageryTreatment?: 'natural' | 'duotone' | 'mono';
}

export function createGenreDefaults(opts: GenreDefaultsOptions): Partial<DesignTokens> {
  const primitives = generateAllColorPrimitives(opts.brandHex, opts.accentHex);
  const semanticLight = createLightSemanticColors(primitives);
  const semanticDark = createDarkSemanticColors(primitives);

  const radii = RADIUS_PRESETS[opts.radiusKey] || RADIUS_PRESETS.rounded;
  const spaceScale = generateSpaceScale(4, opts.density === 'airy' ? 'airy' : opts.density === 'compact' ? 'compact' : 'balanced');
  const scaleRatio = opts.scaleRatio || (opts.density === 'airy' ? 1.333 : opts.density === 'compact' ? 1.2 : 1.25);
  const baseSizePx = opts.density === 'airy' ? 17 : opts.density === 'compact' ? 15 : 16;
  const typeScale = generateFullTypeScale(baseSizePx, scaleRatio, 360, 1280);

  const monoFont = opts.monoFont || 'JetBrains Mono';

  return {
    color: {
      primitives,
      semantic: {
        light: semanticLight,
        dark: semanticDark
      }
    },
    typography: {
      baseSizePx,
      scaleRatio,
      scripts: ['latin'],
      fluid: {
        minVw: 360,
        maxVw: 1280
      },
      roles: {
        display: {
          family: opts.displayFont,
          fallback: ['Georgia', 'serif'],
          weight: 600,
          lineHeight: 1.12,
          letterSpacing: '-0.025em'
        },
        heading: {
          family: opts.headingFont,
          fallback: ['system-ui', 'sans-serif'],
          weight: 600,
          lineHeight: 1.25,
          letterSpacing: '-0.015em'
        },
        body: {
          family: opts.bodyFont,
          fallback: ['system-ui', 'sans-serif'],
          weight: 400,
          lineHeight: 1.6,
          letterSpacing: '-0.01em'
        },
        ui: {
          family: opts.bodyFont,
          fallback: ['system-ui', 'sans-serif'],
          weight: 600,
          lineHeight: 1.2,
          letterSpacing: '0.01em'
        },
        mono: {
          family: monoFont,
          fallback: ['ui-monospace', 'monospace'],
          weight: 400,
          lineHeight: 1.5,
          letterSpacing: '0'
        },
        accent: null
      },
      scale: typeScale as any
    },
    radius: radii,
    space: {
      base: 4,
      scale: spaceScale
    },
    component: {
      buttonRadius: `${radii.md}px`,
      cardRadius: `${radii.lg}px`,
      inputRadius: `${radii.sm}px`,
      buttonPadding: opts.density === 'compact' ? '6px 12px' : opts.density === 'airy' ? '12px 24px' : '10px 18px',
      cardPadding: opts.density === 'compact' ? '16px' : opts.density === 'airy' ? '32px' : '24px',
      buttonStyle: opts.buttonStyle
    },
    imagery: {
      overlay: 0,
      grain: 0,
      radius: opts.radiusKey === 'sharp' ? 'none' : opts.radiusKey === 'subtle' ? 'sm' : 'md',
      treatment: opts.imageryTreatment || 'natural'
    },
    motion: {
      level: opts.density === 'compact' ? 'subtle' : 'expressive',
      duration: {
        fast: 120,
        base: opts.density === 'compact' ? 200 : 260,
        slow: 380
      },
      easing: {
        standard: 'cubic-bezier(0.2, 0, 0, 1)',
        emphasized: 'cubic-bezier(0.16, 1, 0.3, 1)'
      }
    }
  };
}
