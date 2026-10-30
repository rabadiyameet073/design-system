import { describe, it, expect } from 'vitest';
import { migrateTokens, importDesignTokensFromJson, TokenMigrationError } from '../../src/tokens/migration';
import { DEFAULT_DESIGN_TOKENS } from '../../src/tokens/defaultTokens';
import { DesignTokensSchema } from '../../src/tokens/types';

describe('Token Migration System (Doc 04 §1.1 & Doc 05 §2)', () => {
  it('validates already-valid schemaVersion 1 tokens directly', () => {
    const result = migrateTokens(DEFAULT_DESIGN_TOKENS);
    expect(result.schemaVersion).toBe(1);
    expect(result.meta.projectName).toBe(DEFAULT_DESIGN_TOKENS.meta.projectName);
    expect(DesignTokensSchema.safeParse(result).success).toBe(true);
  });

  it('migrates older token payload missing schemaVersion and populates required v1 fields', () => {
    const legacyPayload = {
      meta: {
        projectName: 'Legacy Brand',
        category: 'commerce',
        genreId: 'luxury-fashion'
      },
      color: {
        primitives: DEFAULT_DESIGN_TOKENS.color.primitives,
        semantic: DEFAULT_DESIGN_TOKENS.color.semantic
      }
    };

    const migrated = migrateTokens(legacyPayload);
    expect(migrated.schemaVersion).toBe(1);
    expect(migrated.meta.projectName).toBe('Legacy Brand');
    expect(migrated.meta.scripts).toEqual(['latin']);
    expect(migrated.space.scale).toBeDefined();
    expect(migrated.radius.md).toBeDefined();
    expect(DesignTokensSchema.safeParse(migrated).success).toBe(true);
  });

  it('throws TokenMigrationError on non-object inputs', () => {
    expect(() => migrateTokens(null)).toThrow(TokenMigrationError);
    expect(() => migrateTokens('invalid string')).toThrow(TokenMigrationError);
  });

  it('imports JSON string and validates correctly', () => {
    const jsonStr = JSON.stringify({
      ...DEFAULT_DESIGN_TOKENS,
      meta: { ...DEFAULT_DESIGN_TOKENS.meta, projectName: 'Imported Brand' }
    });

    const imported = importDesignTokensFromJson(jsonStr);
    expect(imported.meta.projectName).toBe('Imported Brand');
    expect(imported.schemaVersion).toBe(1);
  });

  it('rejects JSON payloads exceeding 2 MB size guard', () => {
    // Generate a payload over 2MB
    const largeStr = 'a'.repeat(2 * 1024 * 1024 + 100);
    expect(() => importDesignTokensFromJson(largeStr)).toThrow('File payload exceeds maximum limit of 2 MB.');
  });
});
