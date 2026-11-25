import { DesignTokens } from './types';

export interface WizardTokenState {
  committed: DesignTokens;
  draft: Partial<DesignTokens> | null;
  history: DesignTokens[];
  future: DesignTokens[];
  activeMode: 'light' | 'dark';
  viewport: 'mobile' | 'tablet' | 'desktop';
}

export type TokenAction =
  | { type: 'PREVIEW_DRAFT'; draft: Partial<DesignTokens> }
  | { type: 'APPLY_DRAFT' }
  | { type: 'DISCARD_DRAFT' }
  | { type: 'SET_TOKEN_DIRECT'; tokens: DesignTokens }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SET_MODE'; mode: 'light' | 'dark' }
  | { type: 'SET_VIEWPORT'; viewport: 'mobile' | 'tablet' | 'desktop' }
  | { type: 'RESET_TO_PRESET'; preset: DesignTokens };

const MAX_HISTORY = 30;

/**
 * Deeply merges a partial DesignTokens object on top of a base DesignTokens object
 * without losing primitives, semantic colors, typography roles, or scales.
 */
export function mergeTokens(base: DesignTokens, partial?: Partial<DesignTokens> | null): DesignTokens {
  if (!partial) return base;
  return {
    ...base,
    ...partial,
    meta: {
      ...base.meta,
      ...(partial.meta || {})
    },
    color: {
      ...base.color,
      ...(partial.color || {}),
      primitives: {
        ...base.color?.primitives,
        ...(partial.color?.primitives || {})
      },
      semantic: {
        light: {
          ...base.color?.semantic?.light,
          ...(partial.color?.semantic?.light || {})
        },
        dark: {
          ...base.color?.semantic?.dark,
          ...(partial.color?.semantic?.dark || {})
        }
      }
    },
    typography: {
      ...base.typography,
      ...(partial.typography || {}),
      roles: {
        ...base.typography?.roles,
        ...(partial.typography?.roles || {})
      },
      scale: partial.typography?.scale || base.typography?.scale,
      fluid: {
        ...base.typography?.fluid,
        ...(partial.typography?.fluid || {})
      }
    },
    space: {
      ...base.space,
      ...(partial.space || {})
    },
    radius: {
      ...base.radius,
      ...(partial.radius || {})
    },
    shadow: {
      ...base.shadow,
      ...(partial.shadow || {})
    },
    border: {
      ...base.border,
      ...(partial.border || {})
    },
    layout: {
      ...base.layout,
      ...(partial.layout || {})
    },
    motion: {
      ...base.motion,
      ...(partial.motion || {})
    },
    imagery: {
      ...base.imagery,
      ...(partial.imagery || {})
    },
    icon: {
      ...base.icon,
      ...(partial.icon || {})
    },
    component: {
      ...base.component,
      ...(partial.component || {})
    }
  };
}

export function tokenReducer(
  state: WizardTokenState,
  action: TokenAction
): WizardTokenState {
  switch (action.type) {
    case 'PREVIEW_DRAFT':
      return {
        ...state,
        draft: action.draft
      };

    case 'APPLY_DRAFT': {
      if (!state.draft) return state;
      const nextCommitted = mergeTokens(state.committed, state.draft);
      const newHistory = [...state.history, state.committed].slice(-MAX_HISTORY);

      return {
        ...state,
        committed: nextCommitted,
        draft: null,
        history: newHistory,
        future: [] // Clear redo branch on new action
      };
    }

    case 'DISCARD_DRAFT':
      return {
        ...state,
        draft: null
      };

    case 'SET_TOKEN_DIRECT': {
      const newHistory = [...state.history, state.committed].slice(-MAX_HISTORY);
      return {
        ...state,
        committed: action.tokens,
        draft: null,
        history: newHistory,
        future: []
      };
    }

    case 'UNDO': {
      if (state.history.length === 0) return state;
      const previous = state.history[state.history.length - 1];
      const nextHistory = state.history.slice(0, -1);

      return {
        ...state,
        committed: previous,
        draft: null,
        history: nextHistory,
        future: [state.committed, ...state.future]
      };
    }

    case 'REDO': {
      if (state.future.length === 0) return state;
      const next = state.future[0];
      const nextFuture = state.future.slice(1);

      return {
        ...state,
        committed: next,
        draft: null,
        history: [...state.history, state.committed],
        future: nextFuture
      };
    }

    case 'SET_MODE':
      return {
        ...state,
        activeMode: action.mode
      };

    case 'SET_VIEWPORT':
      return {
        ...state,
        viewport: action.viewport
      };

    case 'RESET_TO_PRESET': {
      const newHistory = [...state.history, state.committed].slice(-MAX_HISTORY);
      return {
        ...state,
        committed: action.preset,
        draft: null,
        history: newHistory,
        future: []
      };
    }

    default:
      return state;
  }
}

/**
 * Calculates effective tokens by overlaying any active draft on top of committed tokens.
 */
export function getEffectiveTokens(state: WizardTokenState): DesignTokens {
  return mergeTokens(state.committed, state.draft);
}

