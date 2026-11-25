import { DesignTokens } from './types';

/**
 * Maximum number of project snapshots retained for undo. This is the single
 * source of truth for history depth — the wizard keeps one project-level history
 * stack, and every token mutation flows through `mergeTokens` below.
 */
export const MAX_HISTORY = 30;

/**
 * Deeply merges a partial DesignTokens object on top of a base DesignTokens object
 * without dropping primitives, semantic colors, typography roles, scales or any
 * other token group. Used for both committed updates and live draft previews.
 */
export function mergeTokens(base: DesignTokens, partial?: Partial<DesignTokens> | null): DesignTokens {
  if (!partial) return base;
  return {
    ...base,
    ...partial,
    meta: { ...base.meta, ...(partial.meta || {}) },
    color: {
      ...base.color,
      ...(partial.color || {}),
      primitives: { ...base.color?.primitives, ...(partial.color?.primitives || {}) },
      semantic: {
        light: { ...base.color?.semantic?.light, ...(partial.color?.semantic?.light || {}) },
        dark: { ...base.color?.semantic?.dark, ...(partial.color?.semantic?.dark || {}) }
      }
    },
    typography: {
      ...base.typography,
      ...(partial.typography || {}),
      roles: { ...base.typography?.roles, ...(partial.typography?.roles || {}) },
      scale: partial.typography?.scale || base.typography?.scale,
      fluid: { ...base.typography?.fluid, ...(partial.typography?.fluid || {}) }
    },
    space: { ...base.space, ...(partial.space || {}) },
    radius: { ...base.radius, ...(partial.radius || {}) },
    shadow: { ...base.shadow, ...(partial.shadow || {}) },
    border: { ...base.border, ...(partial.border || {}) },
    layout: { ...base.layout, ...(partial.layout || {}) },
    motion: { ...base.motion, ...(partial.motion || {}) },
    imagery: { ...base.imagery, ...(partial.imagery || {}) },
    icon: { ...base.icon, ...(partial.icon || {}) },
    component: { ...base.component, ...(partial.component || {}) }
  };
}
