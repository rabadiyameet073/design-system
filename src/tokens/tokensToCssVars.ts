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
  if (tokens.space?.scale && Array.isArray(tokens.space.scale)) {
    tokens.space.scale.forEach((px, i) => {
      vars[`--space-${i}`] = `${px}px`;
    });
  }

  // 4. Border Radius
  if (tokens.radius) {
    if (tokens.radius.none !== undefined) vars['--radius-none'] = `${tokens.radius.none}px`;
    if (tokens.radius.sm !== undefined) vars['--radius-sm'] = `${tokens.radius.sm}px`;
    if (tokens.radius.md !== undefined) vars['--radius-md'] = `${tokens.radius.md}px`;
    if (tokens.radius.lg !== undefined) vars['--radius-lg'] = `${tokens.radius.lg}px`;
    if (tokens.radius.xl !== undefined) vars['--radius-xl'] = `${tokens.radius.xl}px`;
    if (tokens.radius.full !== undefined) vars['--radius-full'] = `${tokens.radius.full}px`;
  }

  // 5. Typography Roles
  const roles = tokens.typography?.roles || {};
  const getFallbackString = (fb?: string[]) =>
    Array.isArray(fb) && fb.length > 0 ? fb.join(', ') : 'system-ui, sans-serif';

  vars['--font-display'] = roles.display?.family
    ? `"${roles.display.family}", ${getFallbackString(roles.display.fallback)}`
    : 'inherit';
  vars['--font-heading'] = roles.heading?.family
    ? `"${roles.heading.family}", ${getFallbackString(roles.heading.fallback)}`
    : 'inherit';
  vars['--font-body'] = roles.body?.family
    ? `"${roles.body.family}", ${getFallbackString(roles.body.fallback)}`
    : 'inherit';
  vars['--font-ui'] = roles.ui?.family
    ? `"${roles.ui.family}", ${getFallbackString(roles.ui.fallback)}`
    : 'inherit';
  vars['--font-mono'] = roles.mono?.family
    ? `"${roles.mono.family}", ${Array.isArray(roles.mono.fallback) && roles.mono.fallback.length > 0 ? roles.mono.fallback.join(', ') : 'ui-monospace, monospace'}`
    : 'monospace';

  // 6. Fluid Scale Steps
  if (tokens.typography?.scale) {
    for (const [stepKey, entry] of Object.entries(tokens.typography.scale)) {
      if (entry?.css) {
        vars[`--text-${stepKey}`] = entry.css;
      }
    }
  }

  // 7. Motion & Elevation
  if (tokens.motion) {
    if (tokens.motion.duration) {
      vars['--duration-fast'] = `${tokens.motion.duration.fast ?? 150}ms`;
      vars['--duration-base'] = `${tokens.motion.duration.base ?? 250}ms`;
      vars['--duration-slow'] = `${tokens.motion.duration.slow ?? 400}ms`;
    }
    if (tokens.motion.easing) {
      vars['--ease-standard'] = tokens.motion.easing.standard || 'cubic-bezier(0.2, 0, 0, 1)';
      vars['--ease-emphasized'] = tokens.motion.easing.emphasized || 'cubic-bezier(0.2, 0, 0, 1)';
    }
  }

  if (tokens.shadow) {
    if (tokens.shadow.sm) vars['--shadow-sm'] = tokens.shadow.sm;
    if (tokens.shadow.md) vars['--shadow-md'] = tokens.shadow.md;
    if (tokens.shadow.lg) vars['--shadow-lg'] = tokens.shadow.lg;
  }

  // 8. Components & Button Style
  const buttonRad = tokens.component?.buttonRadius || (tokens.radius?.md !== undefined ? `${tokens.radius.md}px` : '8px');
  const cardRad = tokens.component?.cardRadius || (tokens.radius?.lg !== undefined ? `${tokens.radius.lg}px` : '16px');
  const inputRad = tokens.component?.inputRadius || (tokens.radius?.sm !== undefined ? `${tokens.radius.sm}px` : '6px');

  vars['--radius-button'] = buttonRad;
  vars['--radius-card'] = cardRad;
  vars['--radius-input'] = inputRad;

  const btnStyle = (tokens.component as any)?.buttonStyle || 'solid';
  vars['--button-style'] = btnStyle;
  if (btnStyle === 'outline') {
    vars['--button-bg'] = 'transparent';
    vars['--button-fg'] = 'var(--color-action-primary)';
    vars['--button-border'] = '2px solid var(--color-action-primary)';
  } else if (btnStyle === 'subtle') {
    vars['--button-bg'] = 'var(--color-bg-surface)';
    vars['--button-fg'] = 'var(--color-action-primary)';
    vars['--button-border'] = '1px solid var(--color-border-default)';
  } else if (btnStyle === 'minimal') {
    vars['--button-bg'] = 'transparent';
    vars['--button-fg'] = 'var(--color-action-primary)';
    vars['--button-border'] = 'none';
  } else {
    // solid (default)
    vars['--button-bg'] = 'var(--color-action-primary)';
    vars['--button-fg'] = 'var(--color-action-primary-fg)';
    vars['--button-border'] = 'none';
  }

  // 9. Imagery Treatment
  const treatment = tokens.imagery?.treatment || 'natural';
  if (treatment === 'duotone') {
    vars['--image-filter'] = 'grayscale(100%) contrast(1.15) brightness(0.95)';
    vars['--image-tint-opacity'] = '0.35';
  } else if (treatment === 'mono') {
    vars['--image-filter'] = 'grayscale(100%) contrast(1.1)';
    vars['--image-tint-opacity'] = '0';
  } else {
    vars['--image-filter'] = 'none';
    vars['--image-tint-opacity'] = '0';
  }

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

