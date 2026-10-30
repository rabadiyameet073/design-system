import { DesignTokens, SCALE_STEPS } from './types';

/**
 * Serializes a DesignTokens object into a flat key-value dictionary of CSS custom properties.
 */
export function tokensToCssVars(
  tokens: DesignTokens,
  mode: 'light' | 'dark' = 'light'
): Record<string, string> {
  const vars: Record<string, string> = {};
  const semantic = tokens.color.semantic[mode];
  const primitives = tokens.color.primitives;

  // 1. Primitive Color Scales
  for (const group of ['brand', 'accent', 'neutral', 'success', 'warning', 'danger', 'info'] as const) {
    const scale = primitives[group];
    if (scale) {
      for (const step of SCALE_STEPS) {
        vars[`--color-${group}-${step}`] = scale[step];
      }
    }
  }

  // 2. Semantic Colors (Active Theme Mode)
  vars['--color-bg-default'] = semantic.bgDefault;
  vars['--color-bg-surface'] = semantic.bgSurface;
  vars['--color-bg-elevated'] = semantic.bgElevated;
  vars['--color-fg-default'] = semantic.fgDefault;
  vars['--color-fg-muted'] = semantic.fgMuted;
  vars['--color-border-default'] = semantic.borderDefault;
  vars['--color-action-primary'] = semantic.actionPrimary;
  vars['--color-action-primary-fg'] = semantic.actionPrimaryFg;
  vars['--color-action-primary-hover'] = semantic.actionPrimaryHover;
  vars['--color-focus-ring'] = semantic.focusRing;

  vars['--color-status-success'] = semantic.statusSuccess;
  vars['--color-status-success-bg'] = semantic.statusSuccessBg;
  vars['--color-status-success-fg'] = semantic.statusSuccessFg;

  vars['--color-status-warning'] = semantic.statusWarning;
  vars['--color-status-warning-bg'] = semantic.statusWarningBg;
  vars['--color-status-warning-fg'] = semantic.statusWarningFg;

  vars['--color-status-danger'] = semantic.statusDanger;
  vars['--color-status-danger-bg'] = semantic.statusDangerBg;
  vars['--color-status-danger-fg'] = semantic.statusDangerFg;

  vars['--color-status-info'] = semantic.statusInfo;
  vars['--color-status-info-bg'] = semantic.statusInfoBg;
  vars['--color-status-info-fg'] = semantic.statusInfoFg;

  // 3. Spacing Scale
  tokens.space.scale.forEach((px, i) => {
    vars[`--space-${i}`] = `${px}px`;
  });

  // 4. Border Radius
  vars['--radius-none'] = `${tokens.radius.none}px`;
  vars['--radius-sm'] = `${tokens.radius.sm}px`;
  vars['--radius-md'] = `${tokens.radius.md}px`;
  vars['--radius-lg'] = `${tokens.radius.lg}px`;
  vars['--radius-xl'] = `${tokens.radius.xl}px`;
  vars['--radius-full'] = `${tokens.radius.full}px`;

  // 5. Typography Roles
  const roles = tokens.typography.roles;
  vars['--font-display'] = roles.display?.family
    ? `"${roles.display.family}", ${roles.display.fallback.join(', ')}`
    : 'inherit';
  vars['--font-heading'] = roles.heading?.family
    ? `"${roles.heading.family}", ${roles.heading.fallback.join(', ')}`
    : 'inherit';
  vars['--font-body'] = roles.body?.family
    ? `"${roles.body.family}", ${roles.body.fallback.join(', ')}`
    : 'inherit';
  vars['--font-ui'] = roles.ui?.family
    ? `"${roles.ui.family}", ${roles.ui.fallback.join(', ')}`
    : 'inherit';
  vars['--font-mono'] = roles.mono?.family
    ? `"${roles.mono.family}", ${roles.mono.fallback.join(', ')}`
    : 'monospace';

  // 6. Fluid Scale Steps
  if (tokens.typography.scale) {
    for (const [stepKey, entry] of Object.entries(tokens.typography.scale)) {
      vars[`--text-${stepKey}`] = entry.css;
    }
  }

  // 7. Motion & Elevation
  vars['--duration-fast'] = `${tokens.motion.duration.fast}ms`;
  vars['--duration-base'] = `${tokens.motion.duration.base}ms`;
  vars['--duration-slow'] = `${tokens.motion.duration.slow}ms`;
  vars['--ease-standard'] = tokens.motion.easing.standard;
  vars['--ease-emphasized'] = tokens.motion.easing.emphasized;

  vars['--shadow-sm'] = tokens.shadow.sm;
  vars['--shadow-md'] = tokens.shadow.md;
  vars['--shadow-lg'] = tokens.shadow.lg;

  // 8. Components
  vars['--radius-button'] = tokens.component.buttonRadius;
  vars['--radius-card'] = tokens.component.cardRadius;
  vars['--radius-input'] = tokens.component.inputRadius;

  return vars;
}

/**
 * Formats CSS custom properties into a standard CSS rule block (e.g. `:root { ... }`).
 */
export function generateCssRuleString(
  tokens: DesignTokens,
  mode: 'light' | 'dark' = 'light',
  selector = ':root'
): string {
  const vars = tokensToCssVars(tokens, mode);
  const lines = Object.entries(vars).map(([k, v]) => `  ${k}: ${v};`);
  return `${selector} {\n${lines.join('\n')}\n}`;
}

