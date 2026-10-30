import { describe, it, expect } from 'vitest';
import {
  CATEGORIES_LIST,
  GENRE_CONFIGS,
  getGenresForCategory,
  getGenreById
} from '../../src/preview/genres';
import { TEMPLATE_REGISTRY } from '../../src/preview/templates';
import { CategoryId } from '../../src/tokens/types';
import fs from 'fs';
import path from 'path';

describe('Template System & Genre Matrix (Doc 02)', () => {
  const EXPECTED_CATEGORIES: CategoryId[] = [
    'commerce',
    'saas',
    'portfolio',
    'publishing',
    'hospitality',
    'education',
    'architecture',
    'finance'
  ];

  it('declares exactly 8 industry categories', () => {
    expect(CATEGORIES_LIST).toHaveLength(8);
    const ids = CATEGORIES_LIST.map(c => c.id);
    for (const cat of EXPECTED_CATEGORIES) {
      expect(ids).toContain(cat);
    }
  });

  it('declares exactly 32 genre configs with 4 genres per category', () => {
    const genreEntries = Object.entries(GENRE_CONFIGS);
    expect(genreEntries).toHaveLength(32);

    for (const cat of EXPECTED_CATEGORIES) {
      const genres = getGenresForCategory(cat);
      expect(genres).toHaveLength(4);
      for (const g of genres) {
        expect(g.id).toBeDefined();
        expect(g.label).toBeDefined();
        expect(g.description).toBeDefined();
        expect(g.heroImage).toBeDefined();
        expect(g.fontRecommendationTags.length).toBeGreaterThan(0);
        expect(['airy', 'balanced', 'compact']).toContain(g.density);
      }
    }
  });

  it('getGenreById falls back safely for unknown id', () => {
    const fallback = getGenreById('unknown-id-xyz');
    expect(fallback).toBeDefined();
    expect(fallback.id).toBe('ceramics-atelier');
  });

  it('exports all 8 category templates in TEMPLATE_REGISTRY', () => {
    for (const cat of EXPECTED_CATEGORIES) {
      expect(TEMPLATE_REGISTRY[cat]).toBeDefined();
      expect(typeof TEMPLATE_REGISTRY[cat]).toBe('function');
    }
  });

  it('enforces token-only rules in src/preview/sections/ and src/preview/templates/ (no hardcoded hex colors)', () => {
    const sectionsDir = path.resolve(__dirname, '../../src/preview/sections');
    const templatesDir = path.resolve(__dirname, '../../src/preview/templates');

    const checkDir = (dir: string) => {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        if (!file.endsWith('.tsx')) continue;
        const fullPath = path.join(dir, file);
        const content = fs.readFileSync(fullPath, 'utf8');

        // Look for hardcoded style={{ backgroundColor: '#...' }} or style={{ color: '#...' }}
        // Valid exceptions: default prop fallbacks (like imageUrl or default text)
        const hardcodedHexStyleRegex = /style=\{\{[^}]*(?:color|background|borderColor):\s*['"]#(?!var)[0-9a-fA-F]{3,6}['"][^}]*\}\}/g;
        const matches = content.match(hardcodedHexStyleRegex);
        expect(matches, `Found hardcoded hex style in ${file}: ${matches?.join(', ')}`).toBeNull();
      }
    };

    checkDir(sectionsDir);
    checkDir(templatesDir);
  });
});
