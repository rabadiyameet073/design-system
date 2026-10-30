import { DesignTokens, CategoryId } from './types';
import { generateAllColorPrimitives } from './colorScale';
import { createLightSemanticColors, createDarkSemanticColors } from './semanticMapping';

export function createDefaultTokens(
  category: CategoryId = 'commerce',
  genreId = 'ecommerce',
  brandName = 'Komorebi Studio',
  brandHex = '#B7410E'
): DesignTokens {
  const primitives = generateAllColorPrimitives(brandHex, '#2563EB');
  const lightSemantic = createLightSemanticColors(primitives);
  const darkSemantic = createDarkSemanticColors(primitives);

  return {
    schemaVersion: 1,
    meta: {
      projectName: brandName,
      slug: brandName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      genreId,
      category,
      goal: 'High-conversion sales with bespoke brand trust',
      audience: 'Design-conscious clients and buyers',
      scripts: ['latin'],
      darkMode: 'auto',
      personality: {
        energy: 45,
        craft: 80,
        voice: 60,
        formality: 50,
        density: 40
      }
    },
    color: {
      primitives,
      semantic: {
        light: lightSemantic,
        dark: darkSemantic
      }
    },
    typography: {
      roles: {
        display: {
          family: 'Cormorant Garamond',
          fallback: ['Georgia', 'serif'],
          weight: 600,
          lineHeight: 1.15,
          letterSpacing: '-0.02em'
        },
        heading: {
          family: 'Cormorant Garamond',
          fallback: ['Georgia', 'serif'],
          weight: 600,
          lineHeight: 1.25,
          letterSpacing: '-0.015em'
        },
        body: {
          family: 'Plus Jakarta Sans',
          fallback: ['system-ui', 'sans-serif'],
          weight: 400,
          lineHeight: 1.6,
          letterSpacing: '-0.01em'
        },
        ui: {
          family: 'Plus Jakarta Sans',
          fallback: ['system-ui', 'sans-serif'],
          weight: 600,
          lineHeight: 1.2,
          letterSpacing: '0.01em'
        },
        mono: {
          family: 'JetBrains Mono',
          fallback: ['monospace'],
          weight: 400,
          lineHeight: 1.5,
          letterSpacing: '0'
        },
        accent: null
      },
      baseSizePx: 16,
      scaleRatio: 1.25,
      fluid: {
        minVw: 360,
        maxVw: 1280
      },
      scale: {
        xs: { minPx: 11, maxPx: 12, css: 'clamp(0.6875rem, 0.65rem + 0.15vw, 0.75rem)' },
        sm: { minPx: 13, maxPx: 14, css: 'clamp(0.8125rem, 0.78rem + 0.18vw, 0.875rem)' },
        base: { minPx: 15, maxPx: 16, css: 'clamp(0.9375rem, 0.9rem + 0.2vw, 1rem)' },
        lg: { minPx: 18, maxPx: 20, css: 'clamp(1.125rem, 1.05rem + 0.35vw, 1.25rem)' },
        xl: { minPx: 22, maxPx: 25, css: 'clamp(1.375rem, 1.25rem + 0.6vw, 1.5625rem)' },
        '2xl': { minPx: 26, maxPx: 31, css: 'clamp(1.625rem, 1.45rem + 0.9vw, 1.9375rem)' },
        '3xl': { minPx: 32, maxPx: 39, css: 'clamp(2rem, 1.75rem + 1.2vw, 2.4375rem)' },
        '4xl': { minPx: 38, maxPx: 48, css: 'clamp(2.375rem, 2.05rem + 1.6vw, 3rem)' },
        '5xl': { minPx: 46, maxPx: 61, css: 'clamp(2.875rem, 2.4rem + 2.2vw, 3.8125rem)' },
        '6xl': { minPx: 56, maxPx: 76, css: 'clamp(3.5rem, 2.85rem + 3vw, 4.75rem)' }
      },
      scripts: ['latin']
    },
    space: {
      base: 4,
      scale: [0, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128]
    },
    radius: {
      none: 0,
      sm: 4,
      md: 8,
      lg: 12,
      xl: 16,
      full: 9999
    },
    shadow: {
      sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
    },
    border: {
      width: 1,
      style: 'solid'
    },
    layout: {
      container: 1280,
      gutter: 24,
      columns: 12,
      breakpoints: {
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280
      }
    },
    motion: {
      level: 'subtle',
      duration: {
        fast: 150,
        base: 250,
        slow: 400
      },
      easing: {
        standard: 'cubic-bezier(0.16, 1, 0.3, 1)',
        emphasized: 'cubic-bezier(0.32, 0.72, 0, 1)'
      }
    },
    imagery: {
      overlay: 0.1,
      grain: 0,
      radius: 'md',
      treatment: 'natural'
    },
    icon: {
      library: 'lucide',
      style: 'outline',
      strokeWidth: 2
    },
    component: {
      buttonRadius: '8px',
      cardRadius: '12px',
      inputRadius: '8px',
      buttonPadding: '10px 20px',
      cardPadding: '24px'
    }
  };
}

export const DEFAULT_DESIGN_TOKENS = createDefaultTokens();


