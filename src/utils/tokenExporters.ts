import JSZip from 'jszip';
import { DesignTokens, SCALE_STEPS } from '../tokens/types';
import { tokensToCssVars } from '../tokens/tokensToCssVars';

/**
 * 1. Tailwind CSS 4 Theme Block (@theme inline + dark variants)
 */
export function exportTailwind4(tokens: DesignTokens): string {
  const lightVars = tokensToCssVars(tokens, 'light');
  const darkVars = tokensToCssVars(tokens, 'dark');

  const lightCssProps = Object.entries(lightVars)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join('\n');

  const darkCssProps = Object.entries(darkVars)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join('\n');

  const headingFamily = tokens.typography.roles.heading?.family || 'system-ui';
  const bodyFamily = tokens.typography.roles.body?.family || 'system-ui';

  return `/* Design System Studio — Tailwind CSS 4 Theme */
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

  --font-heading: "${headingFamily}", system-ui, sans-serif;
  --font-body: "${bodyFamily}", system-ui, sans-serif;
  --radius-sm: var(--radius-sm);
  --radius-md: var(--radius-md);
  --radius-lg: var(--radius-lg);
  --radius-xl: var(--radius-xl);
}
`;
}

/**
 * 2. Standard CSS Custom Properties (:root + .dark)
 */
export function exportCssVars(tokens: DesignTokens): string {
  const lightVars = tokensToCssVars(tokens, 'light');
  const darkVars = tokensToCssVars(tokens, 'dark');

  const lightLines = Object.entries(lightVars).map(([k, v]) => `  ${k}: ${v};`).join('\n');
  const darkLines = Object.entries(darkVars).map(([k, v]) => `  ${k}: ${v};`).join('\n');

  return `/* Design System Studio — CSS Custom Properties */
:root, [data-theme="light"] {
${lightLines}
}

.dark, [data-theme="dark"] {
${darkLines}
}
`;
}

/**
 * 3. W3C Design Tokens Community Group (DTCG) Standard JSON
 */
export function exportDtcgJson(tokens: DesignTokens): string {
  const dtcgObj: Record<string, any> = {
    $schema: 'https://design-tokens.github.io/community-group/format/',
    color: {
      brand: {},
      semantic: {
        background: {
          $type: 'color',
          $value: tokens.color.semantic.light.bgDefault,
          $description: 'Canvas default background tone'
        },
        surface: {
          $type: 'color',
          $value: tokens.color.semantic.light.bgSurface,
          $description: 'Elevated container surface'
        },
        primary: {
          $type: 'color',
          $value: tokens.color.semantic.light.actionPrimary,
          $description: 'Primary interactive accent'
        }
      }
    },
    dimension: {
      radius: {
        sm: { $type: 'dimension', $value: `${tokens.radius.sm}px` },
        md: { $type: 'dimension', $value: `${tokens.radius.md}px` },
        lg: { $type: 'dimension', $value: `${tokens.radius.lg}px` }
      }
    },
    typography: {
      heading: {
        $type: 'fontFamily',
        $value: tokens.typography.roles.heading?.family || 'Inter'
      },
      body: {
        $type: 'fontFamily',
        $value: tokens.typography.roles.body?.family || 'Inter'
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

  return JSON.stringify(dtcgObj, null, 2);
}

/**
 * 4. TypeScript Theme Constants and Types
 */
export function exportTypeScript(tokens: DesignTokens): string {
  return `// Design System Studio — Type-Safe Design Tokens
export const designTokens = ${JSON.stringify(tokens, null, 2)} as const;

export type DesignTokensType = typeof designTokens;
export default designTokens;
`;
}

/**
 * 5. shadcn/ui Theme Mapping CSS
 */
export function exportShadcn(tokens: DesignTokens): string {
  const light = tokens.color.semantic.light;
  const dark = tokens.color.semantic.dark;

  return `@layer base {
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
 * 6. Figma Tokens Studio compatible JSON
 */
export function exportFigmaTokensStudio(tokens: DesignTokens): string {
  const figmaObj = {
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
 * 7. Project DSS JSON (for import & export)
 */
export function exportProjectJson(tokens: DesignTokens): string {
  return JSON.stringify(tokens, null, 2);
}

/**
 * 8. Complete Starter ZIP (Tokens + font install readme + components)
 */
export async function exportStarterZip(tokens: DesignTokens): Promise<Blob> {
  const zip = new JSZip();
  const folderName = `${tokens.meta.slug || 'design_system'}_starter`;
  const folder = zip.folder(folderName) || zip;

  folder.file('theme.css', exportTailwind4(tokens));
  folder.file('tokens.css', exportCssVars(tokens));
  folder.file('tokens.json', exportDtcgJson(tokens));
  folder.file('tokens.ts', exportTypeScript(tokens));
  folder.file('shadcn-theme.css', exportShadcn(tokens));
  folder.file('tokens.studio.json', exportFigmaTokensStudio(tokens));
  folder.file('project.dss.json', exportProjectJson(tokens));

  const headingFamily = tokens.typography.roles.heading?.family || 'Fraunces';
  const bodyFamily = tokens.typography.roles.body?.family || 'DM Sans';

  const headingPkg = `@fontsource-variable/${headingFamily.toLowerCase().replace(/\s+/g, '-')}`;
  const bodyPkg = `@fontsource-variable/${bodyFamily.toLowerCase().replace(/\s+/g, '-')}`;

  folder.file('README.md', `# ${tokens.meta.projectName || 'Design System Studio'} Starter Kit

A single source of truth design system with mathematically verified OKLCH color scales, fluid typography, and universal WCAG 2.2 AA accessibility.

## 1. Install Self-Hosted Typography
For optimal privacy (GDPR compliance) and zero cumulative layout shift (CLS), install self-hosted fonts:

\`\`\`bash
npm install ${headingPkg} ${bodyPkg}
\`\`\`

Then import in your application entry (\`main.tsx\` or \`app/layout.tsx\`):
\`\`\`tsx
import '${headingPkg}';
import '${bodyPkg}';
\`\`\`

## 2. Using with Tailwind CSS 4
Import \`theme.css\` directly into your \`index.css\`:
\`\`\`css
@import "./theme.css";
\`\`\`

## 3. Design Token Architecture
- \`tokens.json\`: W3C DTCG format for token transformation pipelines
- \`tokens.ts\`: Type-safe constants and interfaces
- \`tokens.studio.json\`: Importable directly into Figma Tokens Studio

Generated with **Design System Studio**.
`);

  return await zip.generateAsync({ type: 'blob' });
}

