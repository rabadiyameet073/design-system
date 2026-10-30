import { DesignTokens, DesignTokensSchema } from './types';
import { createDefaultTokens } from './defaultTokens';

export class TokenMigrationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TokenMigrationError';
  }
}

/**
 * Validates and migrates an arbitrary token structure into the current schemaVersion (v1).
 * Supports older token representations and auto-fills missing modern structural properties.
 */
export function migrateTokens(raw: unknown): DesignTokens {
  if (!raw || typeof raw !== 'object') {
    throw new TokenMigrationError('Invalid tokens payload: expected an object.');
  }

  const obj = raw as Record<string, any>;
  const defaults = createDefaultTokens();

  // If already at schemaVersion 1 and parses cleanly, return directly
  if (obj.schemaVersion === 1) {
    const parseResult = DesignTokensSchema.safeParse(obj);
    if (parseResult.success) {
      return parseResult.data as DesignTokens;
    }
  }

  // Perform migration to schemaVersion 1
  const migrated: any = {
    schemaVersion: 1,
    meta: {
      ...defaults.meta,
      ...(obj.meta || {}),
      projectName: obj.meta?.projectName || obj.name || 'Migrated Design System',
      slug: obj.meta?.slug || obj.slug || 'migrated-design-system',
      genreId: obj.meta?.genreId || obj.websiteType?.id || 'ceramics-atelier',
      category: obj.meta?.category || obj.websiteType?.category || 'commerce',
      scripts: obj.meta?.scripts || ['latin'],
      darkMode: obj.meta?.darkMode || 'auto',
      personality: {
        ...defaults.meta.personality,
        ...(obj.meta?.personality || {})
      }
    },
    color: {
      primitives: {
        ...defaults.color.primitives,
        ...(obj.color?.primitives || {})
      },
      semantic: {
        light: {
          ...defaults.color.semantic.light,
          ...(obj.color?.semantic?.light || {})
        },
        dark: {
          ...defaults.color.semantic.dark,
          ...(obj.color?.semantic?.dark || {})
        }
      }
    },
    typography: {
      ...defaults.typography,
      ...(obj.typography || {}),
      roles: {
        ...defaults.typography.roles,
        ...(obj.typography?.roles || {})
      }
    },
    space: {
      base: obj.space?.base === 8 ? 8 : 4,
      scale: Array.isArray(obj.space?.scale) ? obj.space.scale : defaults.space.scale
    },
    radius: {
      ...defaults.radius,
      ...(obj.radius || {})
    },
    shadow: {
      ...defaults.shadow,
      ...(obj.shadow || {})
    },
    border: {
      width: typeof obj.border?.width === 'number' ? obj.border.width : defaults.border.width,
      style: obj.border?.style === 'dashed' ? 'dashed' : 'solid'
    },
    layout: {
      ...defaults.layout,
      ...(obj.layout || {})
    },
    motion: {
      ...defaults.motion,
      ...(obj.motion || {})
    },
    imagery: {
      ...defaults.imagery,
      ...(obj.imagery || {})
    },
    icon: {
      ...defaults.icon,
      ...(obj.icon || {})
    },
    component: {
      ...defaults.component,
      ...(obj.component || {})
    }
  };

  const validated = DesignTokensSchema.parse(migrated);
  return validated as DesignTokens;
}

/**
 * Safely parses and migrates a JSON string with a 2MB payload guard per Doc 05 §2.
 */
export function importDesignTokensFromJson(jsonString: string): DesignTokens {
  if (jsonString.length > 2 * 1024 * 1024) {
    throw new TokenMigrationError('File payload exceeds maximum limit of 2 MB.');
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonString);
  } catch {
    throw new TokenMigrationError('Invalid JSON formatting.');
  }

  return migrateTokens(parsed);
}

