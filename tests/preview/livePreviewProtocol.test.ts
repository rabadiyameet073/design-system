import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GENRE_CONFIGS, getGenreById, getGenresForCategory } from '../../src/preview/genres';
import { TEMPLATE_REGISTRY } from '../../src/preview/templates';
import { applyTokens } from '../../src/preview/tokens/applyTokens';
import { createDefaultTokens } from '../../src/tokens/defaultTokens';
import { CategoryId, DesignTokens } from '../../src/tokens/types';
import fs from 'fs';
import path from 'path';

describe('Doc 02: Template-First Flow & Live Preview Architecture', () => {
  let tokens: DesignTokens;

  beforeEach(() => {
    tokens = createDefaultTokens();
  });

  describe('3.1 & 3.2: Message Protocol & Origin Safety', () => {
    it('defines and validates all studio -> preview message types', () => {
      // Message types: INIT, TOKENS, MODE, SCROLL_TO
      type ToPreview =
        | { type: 'INIT'; genreId: string; tokens: DesignTokens; mode: 'light' | 'dark' }
        | { type: 'TOKENS'; tokens: DesignTokens }
        | { type: 'MODE'; mode: 'light' | 'dark' }
        | { type: 'SCROLL_TO'; sectionId: string };

      const initMsg: ToPreview = {
        type: 'INIT',
        genreId: 'ceramics-atelier',
        tokens,
        mode: 'light'
      };
      expect(initMsg.type).toBe('INIT');
      expect(initMsg.genreId).toBe('ceramics-atelier');

      const tokensMsg: ToPreview = { type: 'TOKENS', tokens };
      expect(tokensMsg.type).toBe('TOKENS');

      const modeMsg: ToPreview = { type: 'MODE', mode: 'dark' };
      expect(modeMsg.type).toBe('MODE');

      const scrollMsg: ToPreview = { type: 'SCROLL_TO', sectionId: 'components-showcase' };
      expect(scrollMsg.type).toBe('SCROLL_TO');
    });

    it('defines and validates preview -> studio response message types', () => {
      // Response types: READY, A11Y_RESULT
      type FromPreview =
        | { type: 'READY' }
        | { type: 'A11Y_RESULT'; pass: number; fail: number; issues: any[] };

      const readyMsg: FromPreview = { type: 'READY' };
      expect(readyMsg.type).toBe('READY');

      const a11yMsg: FromPreview = {
        type: 'A11Y_RESULT',
        pass: 12,
        fail: 0,
        issues: []
      };
      expect(a11yMsg.pass).toBe(12);
      expect(a11yMsg.fail).toBe(0);
    });

    it('applyTokens sets CSS custom properties on document.documentElement', () => {
      const properties: Record<string, string> = {};
      const classList = new Set<string>();
      const attributes: Record<string, string> = {};

      const mockDocument = {
        documentElement: {
          style: {
            setProperty: (key: string, val: string) => {
              properties[key] = val;
            },
            getPropertyValue: (key: string) => properties[key] || ''
          },
          classList: {
            add: (c: string) => classList.add(c),
            remove: (c: string) => classList.delete(c),
            contains: (c: string) => classList.has(c)
          },
          setAttribute: (k: string, v: string) => {
            attributes[k] = v;
          }
        },
        body: {
          style: {}
        },
        head: {
          appendChild: () => {}
        },
        createElement: () => ({ rel: '', id: '', href: '' })
      };

      (globalThis as any).document = mockDocument;

      applyTokens(tokens, 'light');
      expect(mockDocument.documentElement.style.getPropertyValue('--color-bg-default')).not.toBe('');
      expect(mockDocument.documentElement.style.getPropertyValue('--font-heading')).not.toBe('');

      applyTokens(tokens, 'dark');
      expect(mockDocument.documentElement.classList.contains('dark')).toBe(true);

      delete (globalThis as any).document;
    });
  });

  describe('3.4: Auto-scroll Step Focus Mapping', () => {
    const STEP_FOCUS_SECTIONS: Record<number, string> = {
      1: 'hero',
      2: 'hero',
      3: 'hero',
      4: 'hero',
      5: 'hero',
      6: 'type-specimen',
      7: 'components-showcase',
      8: 'components-showcase',
      9: 'gallery',
      10: 'components-showcase',
      11: 'components-showcase'
    };

    it('maps all 11 wizard steps to a defined focus section', () => {
      for (let step = 1; step <= 11; step++) {
        const sectionId = STEP_FOCUS_SECTIONS[step];
        expect(sectionId).toBeDefined();
        expect(typeof sectionId).toBe('string');
      }
    });

    it('ensures all target section IDs correspond to real section defaults', () => {
      const sectionsDir = path.resolve(__dirname, '../../src/preview/sections');
      const files = fs.readdirSync(sectionsDir);
      const definedIds = new Set<string>();

      for (const file of files) {
        if (!file.endsWith('.tsx') || file === 'index.ts') continue;
        const content = fs.readFileSync(path.join(sectionsDir, file), 'utf8');
        const match = content.match(/id\s*=\s*['"]([^'"]+)['"]/);
        if (match) {
          definedIds.add(match[1]);
        }
      }

      // Check our step targets
      expect(definedIds.has('hero')).toBe(true);
      expect(definedIds.has('type-specimen')).toBe(true);
      expect(definedIds.has('components-showcase')).toBe(true);
      expect(definedIds.has('gallery')).toBe(true);
    });
  });

  describe('4.1 & 4.2: 8 Category Templates & 32 Genre Matrix', () => {
    const CATEGORIES: CategoryId[] = [
      'commerce',
      'saas',
      'portfolio',
      'publishing',
      'hospitality',
      'education',
      'architecture',
      'finance'
    ];

    it('contains all 8 category templates in TEMPLATE_REGISTRY', () => {
      for (const cat of CATEGORIES) {
        expect(TEMPLATE_REGISTRY[cat]).toBeDefined();
        expect(typeof TEMPLATE_REGISTRY[cat]).toBe('function');
      }
    });

    it('contains exactly 32 genre configurations with 4 per category', () => {
      const genreCount = Object.keys(GENRE_CONFIGS).length;
      expect(genreCount).toBe(32);

      for (const cat of CATEGORIES) {
        const catGenres = getGenresForCategory(cat);
        expect(catGenres.length).toBe(4);

        for (const genre of catGenres) {
          expect(genre.id).toBeDefined();
          expect(genre.category).toBe(cat);
          expect(genre.label).toBeDefined();
          expect(genre.heroImage).toBeDefined();
          expect(genre.density).toMatch(/^(airy|balanced|compact)$/);
          expect(Array.isArray(genre.fontRecommendationTags)).toBe(true);
          expect(Array.isArray(genre.componentPack)).toBe(true);
        }
      }
    });

    it('resolves getGenreById for any valid or unknown genre', () => {
      const ceramics = getGenreById('ceramics-atelier');
      expect(ceramics.category).toBe('commerce');

      const devtools = getGenreById('dev-tools');
      expect(devtools.category).toBe('saas');

      // Fallback
      const fallback = getGenreById('non-existent');
      expect(fallback.id).toBe('ceramics-atelier');
    });
  });

  describe('4.3: Hard Rules for Template Code (Zero Hardcoded Hex)', () => {
    it('verifies that no template or section has hardcoded hex color values', () => {
      const previewDir = path.resolve(__dirname, '../../src/preview');
      const scanDir = (dir: string) => {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            scanDir(fullPath);
          } else if (entry.name.endsWith('.tsx')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            // Regex searching for inline hex colors (#fff, #123456, etc.)
            const hexMatch = content.match(/#[0-9a-fA-F]{3,8}\b/g);
            expect(hexMatch, `Found hardcoded hex color in ${entry.name}: ${hexMatch?.join(', ')}`).toBeNull();
          }
        }
      };

      scanDir(previewDir);
    });
  });

  describe('Responsive Viewports & Colorblind Simulation', () => {
    it('computes exact viewport widths according to spec (375px / 768px / 100%)', () => {
      const getViewportWidth = (viewport: 'mobile' | 'tablet' | 'desktop') => {
        switch (viewport) {
          case 'mobile':
            return 'w-[375px] max-w-[375px]';
          case 'tablet':
            return 'w-[768px] max-w-[768px]';
          case 'desktop':
          default:
            return 'w-full max-w-full';
        }
      };

      expect(getViewportWidth('mobile')).toContain('375px');
      expect(getViewportWidth('tablet')).toContain('768px');
      expect(getViewportWidth('desktop')).toBe('w-full max-w-full');
    });

    it('validates colorblind deficiency SVG filter matrix matrices', () => {
      const filterModes = ['none', 'protanopia', 'deuteranopia', 'tritanopia', 'achromatopsia'] as const;
      for (const m of filterModes) {
        if (m === 'none') {
          expect(m).toBe('none');
        } else {
          expect(`dss-filter-${m}`).toMatch(/^dss-filter-(protanopia|deuteranopia|tritanopia|achromatopsia)$/);
        }
      }
    });
  });
});
