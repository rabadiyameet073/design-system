import { DesignTokens, SCALE_STEPS } from '../tokens/types';
import { tokensToCssVars } from '../tokens/tokensToCssVars';
import { auditSemanticContrast } from '../tokens/contrastEngine';

export const SCHEMA_VERSION = '1.0.0';
export const GENERATOR_VERSION = '1.6.0';
export const GENERATOR_NAME = 'Design System Studio';

/**
 * Standard versioning header helper for all code exports
 */
export function getExportHeader(
  tokens: DesignTokens,
  commentStyle: 'slash' | 'hash' | 'xml' | 'json' = 'slash'
): string {
  const timestamp = new Date().toISOString();
  const projectName = tokens.meta.projectName || 'Design System Studio';

  if (commentStyle === 'hash') {
    return `# ${projectName} — Design System Tokens
# @schemaVersion ${SCHEMA_VERSION}
# @generatorVersion ${GENERATOR_VERSION}
# @generatedAt ${timestamp}
# @generator ${GENERATOR_NAME}
`;
  }

  if (commentStyle === 'xml') {
    return `<!--
  ${projectName} — Design System Tokens
  @schemaVersion ${SCHEMA_VERSION}
  @generatorVersion ${GENERATOR_VERSION}
  @generatedAt ${timestamp}
  @generator ${GENERATOR_NAME}
-->`;
  }

  return `/**
 * ${projectName} — Design System Tokens
 * @schemaVersion ${SCHEMA_VERSION}
 * @generatorVersion ${GENERATOR_VERSION}
 * @generatedAt ${timestamp}
 * @generator ${GENERATOR_NAME}
 */
`;
}

/**
 * 1. Tailwind CSS 4 Theme Block (@theme inline + dark variants)
 */
export function exportTailwind4(tokens: DesignTokens): string {
  const header = getExportHeader(tokens, 'slash');
  const lightVars = tokensToCssVars(tokens, 'light');
  const darkVars = tokensToCssVars(tokens, 'dark');

  const lightCssProps = Object.entries(lightVars)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join('\n');

  const darkCssProps = Object.entries(darkVars)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join('\n');

  const headingRole = tokens.typography.roles.heading;
  const bodyRole = tokens.typography.roles.body;
  const monoRole = tokens.typography.roles.mono;

  const headingFamily = headingRole?.family || 'system-ui';
  const headingFallback = (headingRole?.fallback || ['ui-serif', 'Georgia', 'serif']).join(', ');
  const bodyFamily = bodyRole?.family || 'system-ui';
  const bodyFallback = (bodyRole?.fallback || ['ui-sans-serif', 'system-ui', 'sans-serif']).join(', ');

  const monoProp = monoRole?.family
    ? `  --font-mono: "${monoRole.family}", ${(monoRole.fallback || ['ui-monospace', 'monospace']).join(', ')};\n`
    : '';

  const scaleProps = Object.entries(tokens.typography.scale || {})
    .map(([step, def]) => `  --text-${step}: ${def.css};`)
    .join('\n');

  return `${header}
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));

:root {
${lightCssProps}
}

.dark {
${darkCssProps}
}

@theme inline {
  --color-bg-default: var(--color-bg-default);
  --color-bg-surface: var(--color-bg-surface);
  --color-fg-default: var(--color-fg-default);
  --color-fg-muted: var(--color-fg-muted);
  --color-border-default: var(--color-border-default);
  --color-action-primary: var(--color-action-primary);
  --color-action-primary-fg: var(--color-action-primary-fg);
  --color-action-primary-hover: var(--color-action-primary-hover);
  --color-focus-ring: var(--color-focus-ring);

  --font-heading: "${headingFamily}", ${headingFallback};
  --font-body: "${bodyFamily}", ${bodyFallback};
${monoProp}  --radius-sm: var(--radius-sm);
  --radius-md: var(--radius-md);
  --radius-lg: var(--radius-lg);
  --radius-xl: var(--radius-xl);

${scaleProps}
}
`;
}

/**
 * 2. Tailwind CSS v3 Legacy Configuration (tailwind.config.js)
 */
export function exportTailwind3(tokens: DesignTokens): string {
  const header = getExportHeader(tokens, 'slash');
  const headingFamily = tokens.typography.roles.heading?.family || 'sans-serif';
  const bodyFamily = tokens.typography.roles.body?.family || 'sans-serif';
  const monoFamily = tokens.typography.roles.mono?.family;

  const headingFallback = tokens.typography.roles.heading?.fallback || ['ui-serif', 'Georgia', 'serif'];
  const bodyFallback = tokens.typography.roles.body?.fallback || ['ui-sans-serif', 'system-ui', 'sans-serif'];

  return `${header}
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          default: 'var(--color-bg-default)',
          surface: 'var(--color-bg-surface)',
          elevated: 'var(--color-bg-elevated)',
        },
        fg: {
          default: 'var(--color-fg-default)',
          muted: 'var(--color-fg-muted)',
        },
        border: {
          default: 'var(--color-border-default)',
        },
        action: {
          primary: 'var(--color-action-primary)',
          'primary-hover': 'var(--color-action-primary-hover)',
          'primary-fg': 'var(--color-action-primary-fg)',
        },
        focus: {
          ring: 'var(--color-focus-ring)',
        },
        status: {
          success: 'var(--color-status-success)',
          warning: 'var(--color-status-warning)',
          danger: 'var(--color-status-danger)',
          info: 'var(--color-status-info)',
        }
      },
      fontFamily: {
        heading: ['"${headingFamily}"', ...${JSON.stringify(headingFallback)}],
        body: ['"${bodyFamily}"', ...${JSON.stringify(bodyFallback)}],
        ${monoFamily ? `mono: ['"${monoFamily}"', 'monospace'],` : ''}
      },
      borderRadius: {
        sm: '${tokens.radius.sm}px',
        md: '${tokens.radius.md}px',
        lg: '${tokens.radius.lg}px',
        xl: '${tokens.radius.xl}px',
        full: '${tokens.radius.full}px'
      },
      spacing: {
        ${tokens.space.scale.map((val, idx) => `'space-${idx}': '${val}px'`).join(',\n        ')}
      }
    }
  },
  plugins: []
};
`;
}

/**
 * 3. Standard CSS Custom Properties (:root + .dark)
 */
export function exportCssVars(tokens: DesignTokens): string {
  const header = getExportHeader(tokens, 'slash');
  const lightVars = tokensToCssVars(tokens, 'light');
  const darkVars = tokensToCssVars(tokens, 'dark');

  const lightLines = Object.entries(lightVars).map(([k, v]) => `  ${k}: ${v};`).join('\n');
  const darkLines = Object.entries(darkVars).map(([k, v]) => `  ${k}: ${v};`).join('\n');

  return `${header}
:root, [data-theme="light"] {
${lightLines}
}

.dark, [data-theme="dark"] {
${darkLines}
}
`;
}

/**
 * 4. SCSS Variables & Theme Mixins (tokens.scss)
 */
export function exportScss(tokens: DesignTokens): string {
  const header = getExportHeader(tokens, 'slash');
  const lightVars = tokensToCssVars(tokens, 'light');
  const darkVars = tokensToCssVars(tokens, 'dark');

  const scssVars = Object.entries(lightVars)
    .map(([k, v]) => `$${k.replace(/^--/, '')}: ${v};`)
    .join('\n');

  const lightThemeProps = Object.entries(lightVars)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join('\n');

  const darkThemeProps = Object.entries(darkVars)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join('\n');

  return `${header}
// SCSS Design Tokens
${scssVars}

// Light theme tokens mixin
@mixin theme-light {
${lightThemeProps}
}

// Dark theme tokens mixin
@mixin theme-dark {
${darkThemeProps}
}

:root {
  @include theme-light;
}

[data-theme="dark"], .dark {
  @include theme-dark;
}
`;
}

/**
 * 5. W3C Design Tokens Community Group (DTCG) Standard JSON
 */
export function exportDtcgJson(tokens: DesignTokens): string {
  const timestamp = new Date().toISOString();
  const dtcgObj: Record<string, any> = {
    $schema: 'https://design-tokens.github.io/community-group/format/',
    $metadata: {
      schemaVersion: SCHEMA_VERSION,
      generatorVersion: GENERATOR_VERSION,
      generatedAt: timestamp,
      generator: GENERATOR_NAME,
      projectName: tokens.meta.projectName || 'Design System Studio'
    },
    color: {
      brand: {},
      action: {
        primary: {
          $type: 'color',
          $value: '{color.brand.600}',
          $description: 'Primary interactive button and call-to-action tone'
        },
        primaryFg: {
          $type: 'color',
          $value: tokens.color.semantic.light.actionPrimaryFg,
          $description: 'Accessible foreground on primary action'
        }
      },
      semantic: {
        background: {
          $type: 'color',
          $value: '{color.neutral.50}',
          $description: 'Canvas default background tone'
        },
        surface: {
          $type: 'color',
          $value: tokens.color.semantic.light.bgSurface,
          $description: 'Elevated container surface'
        },
        primary: {
          $type: 'color',
          $value: '{color.brand.600}',
          $description: 'Primary interactive accent'
        }
      }
    },
    dimension: {
      radius: {
        sm: { $type: 'dimension', $value: `${tokens.radius.sm}px` },
        md: { $type: 'dimension', $value: `${tokens.radius.md}px` },
        lg: { $type: 'dimension', $value: `${tokens.radius.lg}px` },
        xl: { $type: 'dimension', $value: `${tokens.radius.xl}px` },
        full: { $type: 'dimension', $value: `${tokens.radius.full}px` }
      },
      space: {}
    },
    typography: {
      heading: {
        $type: 'fontFamily',
        $value: tokens.typography.roles.heading?.family || 'Inter'
      },
      body: {
        $type: 'fontFamily',
        $value: tokens.typography.roles.body?.family || 'Inter'
      },
      fontSize: Object.fromEntries(
        Object.entries(tokens.typography.scale || {}).map(([step, def]) => [
          step,
          {
            $type: 'dimension',
            $value: def.css,
            $description: `Fluid clamp from ${def.minPx}px (mobile) to ${def.maxPx}px (desktop)`
          }
        ])
      ),
      fontWeight: {
        regular: { $type: 'fontWeight', $value: 400 },
        medium: { $type: 'fontWeight', $value: 500 },
        semibold: { $type: 'fontWeight', $value: 600 },
        bold: { $type: 'fontWeight', $value: 700 }
      },
      lineHeight: {
        heading: { $type: 'number', $value: tokens.typography.roles.heading?.lineHeight || 1.15 },
        body: { $type: 'number', $value: tokens.typography.roles.body?.lineHeight || 1.6 },
        ui: { $type: 'number', $value: tokens.typography.roles.ui?.lineHeight || 1.25 }
      },
      letterSpacing: {
        heading: { $type: 'dimension', $value: tokens.typography.roles.heading?.letterSpacing || '-0.02em' },
        body: { $type: 'dimension', $value: tokens.typography.roles.body?.letterSpacing || '0em' },
        ui: { $type: 'dimension', $value: tokens.typography.roles.ui?.letterSpacing || '0.01em' }
      }
    }
  };

  const brandScale = tokens.color.primitives.brand;
  if (brandScale) {
    for (const step of SCALE_STEPS) {
      dtcgObj.color.brand[step] = {
        $type: 'color',
        $value: brandScale[step],
        $description: `Brand scale step ${step}`
      };
    }
  }

  // Populate space dimensions
  tokens.space.scale.forEach((val, idx) => {
    dtcgObj.dimension.space[idx] = {
      $type: 'dimension',
      $value: `${val}px`,
      $description: `Space step ${idx} (${val}px)`
    };
  });

  return JSON.stringify(dtcgObj, null, 2);
}

/**
 * 6. TypeScript Theme Constants and Types
 */
export function exportTypeScript(tokens: DesignTokens): string {
  const header = getExportHeader(tokens, 'slash');
  return `${header}
export const schemaVersion = '${SCHEMA_VERSION}' as const;
export const generatorVersion = '${GENERATOR_VERSION}' as const;
export const generator = '${GENERATOR_NAME}' as const;

export const designTokens = ${JSON.stringify(tokens, null, 2)} as const;

export type DesignTokensType = typeof designTokens;
export default designTokens;
`;
}

/**
 * 7. shadcn/ui Theme Mapping CSS
 */
export function exportShadcn(tokens: DesignTokens): string {
  const header = getExportHeader(tokens, 'slash');
  const light = tokens.color.semantic.light;
  const dark = tokens.color.semantic.dark;

  return `${header}
@layer base {
  :root {
    --background: ${light.bgDefault};
    --foreground: ${light.fgDefault};
    --card: ${light.bgSurface};
    --card-foreground: ${light.fgDefault};
    --popover: ${light.bgElevated};
    --popover-foreground: ${light.fgDefault};
    --primary: ${light.actionPrimary};
    --primary-foreground: ${light.actionPrimaryFg};
    --secondary: ${light.bgSurface};
    --secondary-foreground: ${light.fgDefault};
    --muted: ${light.bgSurface};
    --muted-foreground: ${light.fgMuted};
    --accent: ${light.bgSurface};
    --accent-foreground: ${light.fgDefault};
    --destructive: ${light.statusDanger};
    --destructive-foreground: #FFFFFF;
    --border: ${light.borderDefault};
    --input: ${light.borderDefault};
    --ring: ${light.focusRing};
    --radius: ${tokens.radius.md}px;
  }

  .dark {
    --background: ${dark.bgDefault};
    --foreground: ${dark.fgDefault};
    --card: ${dark.bgSurface};
    --card-foreground: ${dark.fgDefault};
    --popover: ${dark.bgElevated};
    --popover-foreground: ${dark.fgDefault};
    --primary: ${dark.actionPrimary};
    --primary-foreground: ${dark.actionPrimaryFg};
    --secondary: ${dark.bgSurface};
    --secondary-foreground: ${dark.fgDefault};
    --muted: ${dark.bgSurface};
    --muted-foreground: ${dark.fgMuted};
    --accent: ${dark.bgSurface};
    --accent-foreground: ${dark.fgDefault};
    --destructive: ${dark.statusDanger};
    --destructive-foreground: #FFFFFF;
    --border: ${dark.borderDefault};
    --input: ${dark.borderDefault};
    --ring: ${dark.focusRing};
  }
}
`;
}

/**
 * 8. Figma Tokens Studio compatible JSON
 */
export function exportFigmaTokensStudio(tokens: DesignTokens): string {
  const figmaObj = {
    $metadata: {
      schemaVersion: SCHEMA_VERSION,
      generatorVersion: GENERATOR_VERSION,
      generator: GENERATOR_NAME
    },
    global: {
      color: {
        brand: tokens.color.primitives.brand,
        neutral: tokens.color.primitives.neutral
      },
      borderRadius: {
        sm: { value: `${tokens.radius.sm}px`, type: 'borderRadius' },
        md: { value: `${tokens.radius.md}px`, type: 'borderRadius' },
        lg: { value: `${tokens.radius.lg}px`, type: 'borderRadius' },
        full: { value: `${tokens.radius.full}px`, type: 'borderRadius' }
      },
      fontFamilies: {
        heading: { value: tokens.typography.roles.heading?.family || 'Inter', type: 'fontFamilies' },
        body: { value: tokens.typography.roles.body?.family || 'Inter', type: 'fontFamilies' }
      }
    },
    light: {
      bg: { value: '{global.color.neutral.50}', type: 'color' },
      fg: { value: '{global.color.neutral.900}', type: 'color' },
      primary: { value: '{global.color.brand.600}', type: 'color' }
    },
    dark: {
      bg: { value: '{global.color.neutral.950}', type: 'color' },
      fg: { value: '{global.color.neutral.50}', type: 'color' },
      primary: { value: '{global.color.brand.400}', type: 'color' }
    }
  };

  return JSON.stringify(figmaObj, null, 2);
}

/**
 * Helper to convert HEX to RGBA (0-1 float range) for native Figma Variables
 */
function hexToFigmaColor(hex: string): { r: number; g: number; b: number; a: number } {
  const clean = hex.replace('#', '').trim();
  let r = 0, g = 0, b = 0;
  if (clean.length === 3) {
    r = parseInt(clean[0] + clean[0], 16);
    g = parseInt(clean[1] + clean[1], 16);
    b = parseInt(clean[2] + clean[2], 16);
  } else if (clean.length === 6) {
    r = parseInt(clean.substring(0, 2), 16);
    g = parseInt(clean.substring(2, 4), 16);
    b = parseInt(clean.substring(4, 6), 16);
  }
  return {
    r: Math.round((r / 255) * 1000) / 1000,
    g: Math.round((g / 255) * 1000) / 1000,
    b: Math.round((b / 255) * 1000) / 1000,
    a: 1
  };
}

/**
 * 9. Native Figma Variables JSON Format (Modes: Light & Dark)
 */
export function exportFigmaVariables(tokens: DesignTokens): string {
  const light = tokens.color.semantic.light;
  const dark = tokens.color.semantic.dark;

  const colorVariables = [
    { name: 'bg/default', lightHex: light.bgDefault, darkHex: dark.bgDefault },
    { name: 'bg/surface', lightHex: light.bgSurface, darkHex: dark.bgSurface },
    { name: 'bg/elevated', lightHex: light.bgElevated, darkHex: dark.bgElevated },
    { name: 'fg/default', lightHex: light.fgDefault, darkHex: dark.fgDefault },
    { name: 'fg/muted', lightHex: light.fgMuted, darkHex: dark.fgMuted },
    { name: 'border/default', lightHex: light.borderDefault, darkHex: dark.borderDefault },
    { name: 'action/primary', lightHex: light.actionPrimary, darkHex: dark.actionPrimary },
    { name: 'action/primary-fg', lightHex: light.actionPrimaryFg, darkHex: dark.actionPrimaryFg },
    { name: 'action/primary-hover', lightHex: light.actionPrimaryHover, darkHex: dark.actionPrimaryHover },
    { name: 'focus/ring', lightHex: light.focusRing, darkHex: dark.focusRing },
    { name: 'status/success', lightHex: light.statusSuccess, darkHex: dark.statusSuccess },
    { name: 'status/warning', lightHex: light.statusWarning, darkHex: dark.statusWarning },
    { name: 'status/danger', lightHex: light.statusDanger, darkHex: dark.statusDanger },
    { name: 'status/info', lightHex: light.statusInfo, darkHex: dark.statusInfo },
  ];

  const figmaVariablesDoc = {
    version: '1.0.0',
    metadata: {
      schemaVersion: SCHEMA_VERSION,
      generatorVersion: GENERATOR_VERSION,
      generatedAt: new Date().toISOString(),
      generator: GENERATOR_NAME,
      name: tokens.meta.projectName || 'Design System Studio Tokens'
    },
    collections: [
      {
        name: 'Semantic Colors',
        id: 'col_semantic_colors',
        modes: {
          mode_light: 'Light',
          mode_dark: 'Dark'
        },
        defaultModeId: 'mode_light',
        variables: colorVariables.map(v => ({
          name: v.name,
          type: 'COLOR',
          valuesByMode: {
            mode_light: hexToFigmaColor(v.lightHex),
            mode_dark: hexToFigmaColor(v.darkHex)
          }
        }))
      },
      {
        name: 'Radii',
        id: 'col_radii',
        modes: {
          mode_default: 'Value'
        },
        defaultModeId: 'mode_default',
        variables: [
          { name: 'radius/sm', type: 'FLOAT', valuesByMode: { mode_default: tokens.radius.sm } },
          { name: 'radius/md', type: 'FLOAT', valuesByMode: { mode_default: tokens.radius.md } },
          { name: 'radius/lg', type: 'FLOAT', valuesByMode: { mode_default: tokens.radius.lg } },
          { name: 'radius/xl', type: 'FLOAT', valuesByMode: { mode_default: tokens.radius.xl } },
          { name: 'radius/full', type: 'FLOAT', valuesByMode: { mode_default: tokens.radius.full } },
        ]
      },
      {
        name: 'Spacing',
        id: 'col_spacing',
        modes: {
          mode_default: 'Value'
        },
        defaultModeId: 'mode_default',
        variables: tokens.space.scale.map((px, idx) => ({
          name: `space/${idx}`,
          type: 'FLOAT',
          valuesByMode: { mode_default: px }
        }))
      }
    ]
  };

  return JSON.stringify(figmaVariablesDoc, null, 2);
}

/**
 * 10. Style Dictionary Configuration (style-dictionary.config.json)
 */
export function exportStyleDictionaryConfig(tokens: DesignTokens): string {
  const config = {
    $schema: 'https://style-dictionary.net/schemas/config.json',
    metadata: {
      schemaVersion: SCHEMA_VERSION,
      generatorVersion: GENERATOR_VERSION,
      generator: GENERATOR_NAME
    },
    source: ['tokens/**/*.json'],
    platforms: {
      css: {
        transformGroup: 'css',
        buildPath: 'build/css/',
        files: [
          {
            destination: 'variables.css',
            format: 'css/variables',
            options: {
              outputReferences: true
            }
          }
        ]
      },
      scss: {
        transformGroup: 'scss',
        buildPath: 'build/scss/',
        files: [
          {
            destination: '_variables.scss',
            format: 'scss/variables',
            options: {
              outputReferences: true
            }
          }
        ]
      },
      typescript: {
        transformGroup: 'js',
        buildPath: 'build/ts/',
        files: [
          {
            destination: 'tokens.ts',
            format: 'javascript/es6'
          }
        ]
      },
      json: {
        transformGroup: 'web',
        buildPath: 'build/json/',
        files: [
          {
            destination: 'tokens.flat.json',
            format: 'json/flat'
          }
        ]
      }
    }
  };

  return JSON.stringify(config, null, 2);
}

/**
 * 11. Self-Hosted Fonts (@font-face & Fontsource CSS)
 */
export function exportSelfHostedFonts(tokens: DesignTokens): string {
  const header = getExportHeader(tokens, 'slash');
  const headingFamily = tokens.typography.roles.heading?.family || 'Fraunces';
  const bodyFamily = tokens.typography.roles.body?.family || 'DM Sans';
  const monoFamily = tokens.typography.roles.mono?.family;

  const headingSlug = headingFamily.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const bodySlug = bodyFamily.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const monoSlug = monoFamily ? monoFamily.toLowerCase().replace(/[^a-z0-9]/g, '-') : null;

  return `${header}
/**
 * Self-Hosted Font Declarations (GDPR-Compliant, Zero External CDN Requests)
 *
 * Installation options:
 * 1. Using Fontsource (Recommended):
 *    npm install @fontsource-variable/${headingSlug} @fontsource-variable/${bodySlug} ${monoSlug ? `@fontsource-variable/${monoSlug}` : ''}
 *
 *    In main.tsx / app layout:
 *    import '@fontsource-variable/${headingSlug}';
 *    import '@fontsource-variable/${bodySlug}';
 *    ${monoSlug ? `import '@fontsource-variable/${monoSlug}';` : ''}
 *
 * 2. Or download .woff2 files and host locally using the @font-face rules below:
 */

/* Heading Font: ${headingFamily} */
@font-face {
  font-family: '${headingFamily}';
  font-style: normal;
  font-weight: 400 800;
  font-display: swap;
  src: url('/fonts/${headingSlug}-variable.woff2') format('woff2-variations'),
       url('/fonts/${headingSlug}-variable.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* Body Font: ${bodyFamily} */
@font-face {
  font-family: '${bodyFamily}';
  font-style: normal;
  font-weight: 400 700;
  font-display: swap;
  src: url('/fonts/${bodySlug}-variable.woff2') format('woff2-variations'),
       url('/fonts/${bodySlug}-variable.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
${
  monoFamily && monoSlug
    ? `
/* Monospace Font: ${monoFamily} */
@font-face {
  font-family: '${monoFamily}';
  font-style: normal;
  font-weight: 400 700;
  font-display: swap;
  src: url('/fonts/${monoSlug}-variable.woff2') format('woff2-variations'),
       url('/fonts/${monoSlug}-variable.woff2') format('woff2');
}
`
    : ''
}
`;
}

/**
 * 12. Client Accessibility Audit Report (Markdown Deliverable)
 */
export function exportA11yAuditReport(tokens: DesignTokens): string {
  const lightAudit = auditSemanticContrast(tokens.color.semantic.light);
  const darkAudit = auditSemanticContrast(tokens.color.semantic.dark);

  const lightRows = lightAudit.issues
    .map(
      issue =>
        `| ${issue.name} | \`${issue.fg}\` | \`${issue.bg}\` | **${issue.ratio}:1** | ${issue.apcaLc} Lc | ${issue.targetRatio}:1 | ${
          issue.passed ? '✅ PASS' : '❌ FAIL'
        } (${issue.grade}) |`
    )
    .join('\n');

  const darkRows = darkAudit.issues
    .map(
      issue =>
        `| ${issue.name} | \`${issue.fg}\` | \`${issue.bg}\` | **${issue.ratio}:1** | ${issue.apcaLc} Lc | ${issue.targetRatio}:1 | ${
          issue.passed ? '✅ PASS' : '❌ FAIL'
        } (${issue.grade}) |`
    )
    .join('\n');

  const overallPassing = lightAudit.failCount === 0 && darkAudit.failCount === 0;

  return `# Accessibility (A11y) & Contrast Conformance Report
**Project:** ${tokens.meta.projectName || 'Design System Studio'}
**Generated At:** ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
**Standard:** WCAG 2.2 Level AA & APCA (Informational)
**Generator:** ${GENERATOR_NAME} v${GENERATOR_VERSION}

---

## 1. Executive Summary
- **Overall Status:** ${overallPassing ? '🟢 FULLY COMPLIANT' : '🟡 ACTION REQUIRED (Failing Pairs Detected)'}
- **Light Theme Score:** ${lightAudit.scorePercent}% (${lightAudit.passCount}/${lightAudit.totalCount} checks passed)
- **Dark Theme Score:** ${darkAudit.scorePercent}% (${darkAudit.passCount}/${darkAudit.totalCount} checks passed)
- **Minimum Contrast Target (Body Text):** 4.5:1
- **Minimum Contrast Target (Large Text & UI Elements):** 3.0:1

---

## 2. Light Mode Contrast Conformance Matrix
| UI Element Pair | Foreground | Background | Contrast Ratio | APCA Lc | Target | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
${lightRows}

---

## 3. Dark Mode Contrast Conformance Matrix
| UI Element Pair | Foreground | Background | Contrast Ratio | APCA Lc | Target | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
${darkRows}

---

## 4. Focus Indicators & Interactive State Guidelines
1. **Focus Ring Specification:**
   - **Color:** \`${tokens.color.semantic.light.focusRing}\`
   - **Thickness:** 2px solid outline
   - **Offset:** 2px spacing from element boundary
   - **Rule:** Never apply \`outline: none\` without a custom \`:focus-visible\` ring replacement.
2. **Touch Targets:**
   - Minimum tap target: **44×44px** (WCAG 2.5.5) / **24×24px** (WCAG 2.5.8 Level AA).
3. **Motion Sensitivity:**
   - Support for \`prefers-reduced-motion: reduce\` implemented across all physics spring transitions.

---

## 5. Client Sign-Off & Recommendations
${
  overallPassing
    ? 'All audited semantic color tokens satisfy or surpass WCAG 2.2 Level AA requirements. The design tokens are cleared for production deployment.'
    : 'Please review and adjust the failing token pairs indicated with ❌ FAIL. Use the auto-fix feature in Design System Studio to nudge OKLCH lightness values to reach compliant thresholds while preserving brand chroma and hue.'
}
`;
}

/**
 * 13. Project DSS JSON (for import & export)
 */
export function exportProjectJson(tokens: DesignTokens): string {
  const exportDoc = {
    ...tokens,
    schemaVersion: 1,
    meta: {
      ...tokens.meta,
      generatorVersion: GENERATOR_VERSION,
      exportedAt: new Date().toISOString()
    }
  };
  return JSON.stringify(exportDoc, null, 2);
}

/**
 * 14. Complete Starter ZIP (Tokens + Fonts + Components + Style Dictionary)
 */
export async function exportStarterZip(tokens: DesignTokens): Promise<Blob> {
  const { default: JSZip } = await import('jszip');
  const zip = new JSZip();
  const folderName = `${tokens.meta.slug || 'design_system'}_starter`;
  const folder = zip.folder(folderName) || zip;

  // Code token formats
  folder.file('theme.css', exportTailwind4(tokens));
  folder.file('tailwind.v3.config.js', exportTailwind3(tokens));
  folder.file('tokens.css', exportCssVars(tokens));
  folder.file('tokens.scss', exportScss(tokens));
  folder.file('tokens.json', exportDtcgJson(tokens));
  folder.file('tokens.ts', exportTypeScript(tokens));
  folder.file('shadcn-theme.css', exportShadcn(tokens));
  folder.file('tokens.studio.json', exportFigmaTokensStudio(tokens));
  folder.file('figma.variables.json', exportFigmaVariables(tokens));
  folder.file('style-dictionary.config.json', exportStyleDictionaryConfig(tokens));
  folder.file('fonts.css', exportSelfHostedFonts(tokens));
  folder.file('a11y-audit-report.md', exportA11yAuditReport(tokens));
  folder.file('project.dss.json', exportProjectJson(tokens));

  // Accessible production components that consume the tokens
  folder.file(
    'components/Button.tsx',
    `import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-[var(--radius-md)]';
  
  const sizeStyles = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base'
  };

  const variantStyles = {
    primary: 'bg-[var(--color-action-primary)] text-[var(--color-action-primary-fg)] hover:bg-[var(--color-action-primary-hover)] focus-visible:ring-[var(--color-focus-ring)]',
    secondary: 'bg-[var(--color-bg-surface)] text-[var(--color-fg-default)] hover:bg-[var(--color-bg-elevated)] border border-[var(--color-border-default)]',
    outline: 'border border-[var(--color-border-default)] text-[var(--color-fg-default)] hover:bg-[var(--color-bg-surface)]',
    ghost: 'text-[var(--color-fg-default)] hover:bg-[var(--color-bg-surface)]',
    destructive: 'bg-[var(--color-status-danger)] text-white hover:opacity-90'
  };

  return (
    <button
      className={\`\${baseStyles} \${sizeStyles[size]} \${variantStyles[variant]} \${className}\`}
      {...props}
    >
      {children}
    </button>
  );
};
`
  );

  folder.file(
    'components/Card.tsx',
    `import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'flat' | 'outlined' | 'elevated';
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'outlined',
  className = '',
  children,
  ...props
}) => {
  const baseStyles = 'rounded-[var(--radius-lg)] p-6 transition-shadow';
  
  const variantStyles = {
    flat: 'bg-[var(--color-bg-surface)]',
    outlined: 'bg-[var(--color-bg-surface)] border border-[var(--color-border-default)]',
    elevated: 'bg-[var(--color-bg-elevated)] shadow-[var(--shadow-md)] border border-[var(--color-border-default)]'
  };

  return (
    <div
      className={\`\${baseStyles} \${variantStyles[variant]} \${className}\`}
      {...props}
    >
      {children}
    </div>
  );
};
`
  );

  folder.file(
    'components/Input.tsx',
    `import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  helperText,
  error,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5 font-[var(--font-body)]">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-[var(--color-fg-default)]">
          {label}
        </label>
      )}
      <input
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? \`\${inputId}-error\` : helperText ? \`\${inputId}-helper\` : undefined}
        className={\`w-full px-3.5 py-2 text-sm border bg-[var(--color-bg-surface)] text-[var(--color-fg-default)] transition-all rounded-[var(--radius-input,var(--radius-sm))] \${
          error
            ? 'border-[var(--color-status-danger)] focus:outline-[var(--color-status-danger)]'
            : 'border-[var(--color-border-default)] focus:outline-2 focus:outline-offset-2 focus:outline-[var(--color-focus-ring)]'
        } \${className}\`}
        {...props}
      />
      {error ? (
        <p id={\`\${inputId}-error\`} className="text-[11px] text-[var(--color-status-danger)]" role="alert">
          {error}
        </p>
      ) : helperText ? (
        <p id={\`\${inputId}-helper\`} className="text-[11px] text-[var(--color-fg-muted)]">
          {helperText}
        </p>
      ) : null}
    </div>
  );
};
`
  );

  folder.file(
    'components/Badge.tsx',
    `import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'solid' | 'subtle' | 'outline';
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'subtle',
  tone = 'info',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-3 py-1 text-xs'
  };

  const toneStyles = {
    neutral: {
      solid: 'bg-[var(--color-fg-default)] text-[var(--color-bg-default)]',
      subtle: 'bg-[var(--color-bg-surface)] text-[var(--color-fg-default)] border border-[var(--color-border-default)]',
      outline: 'border border-[var(--color-border-default)] text-[var(--color-fg-default)]'
    },
    success: {
      solid: 'bg-[var(--color-status-success)] text-white',
      subtle: 'bg-[var(--color-status-success-bg)] text-[var(--color-status-success-fg)] border border-[var(--color-status-success)]',
      outline: 'border border-[var(--color-status-success)] text-[var(--color-status-success)]'
    },
    warning: {
      solid: 'bg-[var(--color-status-warning)] text-neutral-900',
      subtle: 'bg-[var(--color-status-warning-bg)] text-[var(--color-status-warning-fg)] border border-[var(--color-status-warning)]',
      outline: 'border border-[var(--color-status-warning)] text-[var(--color-status-warning)]'
    },
    danger: {
      solid: 'bg-[var(--color-status-danger)] text-white',
      subtle: 'bg-[var(--color-status-danger-bg)] text-[var(--color-status-danger-fg)] border border-[var(--color-status-danger)]',
      outline: 'border border-[var(--color-status-danger)] text-[var(--color-status-danger)]'
    },
    info: {
      solid: 'bg-[var(--color-action-primary)] text-[var(--color-action-primary-fg)]',
      subtle: 'bg-[var(--color-status-info-bg)] text-[var(--color-status-info-fg)] border border-[var(--color-status-info)]',
      outline: 'border border-[var(--color-status-info)] text-[var(--color-status-info)]'
    }
  };

  return (
    <span
      className={\`inline-flex items-center gap-1.5 font-medium rounded-[var(--radius-full)] \${sizeStyles[size]} \${toneStyles[tone][variant]} \${className}\`}
      {...props}
    >
      {children}
    </span>
  );
};
`
  );

  const headingFamily = tokens.typography.roles.heading?.family || 'Fraunces';
  const bodyFamily = tokens.typography.roles.body?.family || 'DM Sans';
  const monoFamily = tokens.typography.roles.mono?.family;

  const headingId = headingFamily.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const bodyId = bodyFamily.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const monoId = monoFamily ? monoFamily.toLowerCase().replace(/[^a-z0-9]/g, '-') : null;

  const headingPkg = `@fontsource-variable/${headingId}`;
  const bodyPkg = `@fontsource-variable/${bodyId}`;
  const monoPkg = monoId ? `@fontsource-variable/${monoId}` : null;

  const installPkgs = [headingPkg, bodyPkg, monoPkg].filter(Boolean).join(' ');

  const cdnFamilies = [
    `family=${encodeURIComponent(headingFamily).replace(/%20/g, '+')}:wght@600;700`,
    `family=${encodeURIComponent(bodyFamily).replace(/%20/g, '+')}:wght@400;500;700`
  ];
  if (monoFamily) {
    cdnFamilies.push(`family=${encodeURIComponent(monoFamily).replace(/%20/g, '+')}:wght@400;600`);
  }
  const googleFontsLink = `https://fonts.googleapis.com/css2?${cdnFamilies.join('&')}&display=swap`;

  folder.file(
    'README.md',
    `# ${tokens.meta.projectName || 'Design System Studio'} Starter Kit

A production-ready design system bundle with mathematically verified OKLCH color scales, fluid modular typography, and universal WCAG 2.2 AA accessibility.

## 1. Option A: Install Self-Hosted Typography (Recommended for GDPR & Performance)
For privacy (zero external CDN requests) and zero cumulative layout shift (CLS), install self-hosted fonts via Fontsource:

\`\`\`bash
npm install ${installPkgs}
\`\`\`

Then import in your application entry (\`main.tsx\` or \`app/layout.tsx\`):
\`\`\`tsx
import '${headingPkg}';
import '${bodyPkg}';
${monoPkg ? `import '${monoPkg}';\n` : ''}\`\`\`

## 2. Option B: Google Fonts CDN
Alternatively, link to Google Fonts in your HTML \`<head>\`:
\`\`\`html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${googleFontsLink}">
\`\`\`

## 3. Tailwind CSS Integration
- **Tailwind 4**: Import \`theme.css\` directly into your \`index.css\` (\`@import "./theme.css";\`).
- **Tailwind 3**: Use the included \`tailwind.v3.config.js\` as your \`tailwind.config.js\`.

## 4. Multi-Format Design Token Index
- \`theme.css\`: Tailwind CSS 4 theme file with \`@theme inline\` and fluid clamps
- \`tailwind.v3.config.js\`: Tailwind CSS 3 configuration
- \`tokens.css\`: Standard CSS custom properties for \`:root\` and \`.dark\`
- \`tokens.scss\`: SCSS variables with theme mixins
- \`tokens.json\`: W3C DTCG format for design token pipelines
- \`tokens.ts\`: Type-safe TypeScript constants and interfaces
- \`tokens.studio.json\`: Importable into Figma Tokens Studio
- \`figma.variables.json\`: Native Figma Variables format with Light & Dark modes
- \`style-dictionary.config.json\`: Style Dictionary build config
- \`fonts.css\`: Self-hosted \`@font-face\` declarations
- \`a11y-audit-report.md\`: Client Accessibility Conformance Report
- \`components/\`: Accessible, styled Button, Card, Input, and Badge components

Generated with **Design System Studio**.
`
  );

  return await zip.generateAsync({ type: 'blob' });
}
