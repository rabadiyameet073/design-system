import React from 'react';
import { renderToString } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import {
  CATEGORIES_LIST,
  GENRE_CONFIGS,
  getGenresForCategory,
  getGenreById
} from '../../src/preview/genres';
import { TEMPLATE_REGISTRY } from '../../src/preview/templates';
import { CategoryId } from '../../src/tokens/types';
import { CATEGORY_TABS } from '../../src/components/landing/LandingPage';
import { ALL_SHOWCASE_PRESETS } from '../../src/data/showcasePresets';
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

  it('declares exactly 32 genre configs with 4 genres per category, each with rich defaults and copy', () => {
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
        expect(g.copyFile).toBeDefined();
        expect(g.fontRecommendationTags.length).toBeGreaterThan(0);
        expect(['airy', 'balanced', 'compact']).toContain(g.density);
        expect(g.defaults).toBeDefined();
        expect(g.defaults?.color?.semantic).toBeDefined();
        expect(g.defaults?.typography?.roles).toBeDefined();
        expect(g.defaults?.radius).toBeDefined();
        expect(g.defaults?.space).toBeDefined();
        expect(g.defaults?.component?.buttonStyle).toBeDefined();
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

  it('guarantees every template includes ComponentsShowcase and TypeSpecimen (Doc 02 §4.3)', () => {
    const templatesDir = path.resolve(__dirname, '../../src/preview/templates');
    const files = fs.readdirSync(templatesDir).filter(f => f.endsWith('.tsx') && f !== 'index.ts');

    for (const file of files) {
      const content = fs.readFileSync(path.join(templatesDir, file), 'utf8');
      expect(content).toContain('ComponentsShowcase');
      expect(content).toContain('TypeSpecimen');
    }
  });

  it('verifies all 8 copy JSON files exist in src/preview/genres/copy/', () => {
    const copyDir = path.resolve(__dirname, '../../src/preview/genres/copy');
    for (const cat of EXPECTED_CATEGORIES) {
      const copyFilePath = path.join(copyDir, `${cat}.json`);
      expect(fs.existsSync(copyFilePath), `Missing copy file for ${cat}: ${copyFilePath}`).toBe(true);
      const data = JSON.parse(fs.readFileSync(copyFilePath, 'utf8'));
      expect(data.category).toBe(cat);
      expect(data.hero).toBeDefined();
    }
  });

  it('guarantees all 8 templates protect core sections and support cardStyle & buttonStyle contracts', () => {
    const templatesDir = path.resolve(__dirname, '../../src/preview/templates');
    const files = fs.readdirSync(templatesDir).filter(f => f.endsWith('.tsx') && f !== 'index.ts');

    expect(files).toHaveLength(8);

    for (const file of files) {
      const content = fs.readFileSync(path.join(templatesDir, file), 'utf8');

      // Check section protection contract
      expect(content, `${file} must protect hero and announcement from disappearing`).toContain("section === 'hero'");
      expect(content, `${file} must protect announcement`).toContain("section === 'announcement'");
      expect(content, `${file} must protect componentsShowcase`).toContain("section === 'components'");
      expect(content, `${file} must protect typeSpecimen`).toContain("section === 'type'");

      // Check dynamic card styling contract
      expect(content, `${file} must support elevated cardStyle`).toContain("'elevated'");
      expect(content, `${file} must support flat-tint cardStyle`).toContain("'flat-tint'");

      // Check button style contract
      expect(content, `${file} must support outline buttonStyle`).toContain("'outline'");
      expect(content, `${file} must support subtle buttonStyle`).toContain("'subtle'");
      expect(content, `${file} must support minimal buttonStyle`).toContain("'minimal'");

      // Check image treatment filter contract
      expect(content, `${file} must support --image-filter`).toContain('--image-filter');
    }
  });

  it('renders all 8 templates end-to-end to HTML without throwing runtime exceptions', () => {
    for (const cat of EXPECTED_CATEGORIES) {
      const Template = TEMPLATE_REGISTRY[cat];
      expect(Template).toBeDefined();

      // Test with custom props and various component styles
      const html = renderToString(
        React.createElement(Template, {
          brandName: 'Veritas Benchmark Studio',
          headline: 'Next-Generation Design Engineering and Precision Architecture.',
          subtitle: 'Synthesizing verified tokens for high-performance interfaces.',
          badge: '2026 Selection',
          heroImage: '/test-hero.jpg',
          genreId: `${cat}-flagship`,
          buttonStyle: 'outline',
          components: {
            buttonStyle: 'outline',
            cardStyle: 'elevated',
            enabledComponents: ['product-card', 'pricing-matrix', 'reviews-grid', 'metrics-row', 'curriculum-accordion', 'newsletter']
          }
        })
      );

      expect(typeof html).toBe('string');
      expect(html.length).toBeGreaterThan(500);
      expect(html).toContain('Veritas Benchmark Studio');
    }
  });

  it('renders all 8 templates with flat-tint cardStyle, minimal buttonStyle, and custom headlines', () => {
    for (const cat of EXPECTED_CATEGORIES) {
      const Template = TEMPLATE_REGISTRY[cat];
      const html = renderToString(
        React.createElement(Template, {
          brandName: 'Minimalist Editorial',
          headline: 'Custom Headline Alpha',
          subtitle: 'Custom Subtitle Beta',
          badge: 'Verified',
          heroImage: '/hero.png',
          genreId: `${cat}-alt`,
          buttonStyle: 'minimal',
          components: {
            buttonStyle: 'minimal',
            cardStyle: 'flat-tint',
            enabledComponents: ['product-card', 'pricing-matrix']
          }
        })
      );

      expect(typeof html).toBe('string');
      expect(html).toContain('Minimalist Editorial');
      expect(html).toContain('Custom Headline Alpha');
    }
  });

  it('guarantees each category renders a distinct, dedicated homepage design with unique interactive sections', () => {
    // 1. Commerce: flagship product catalog, planar drivers, specifications
    const commerceHtml = renderToString(React.createElement(TEMPLATE_REGISTRY.commerce, {}));
    expect(commerceHtml).toContain('AETHER Sound &amp; Precision Gear');
    expect(commerceHtml).toContain('Planar');

    // 2. Education: 1-on-1 PhD research mentorship, lab opportunities callout
    const educationHtml = renderToString(React.createElement(TEMPLATE_REGISTRY.education, {}));
    expect(educationHtml).toContain('AURELIA Research Scholar Institute');
    expect(educationHtml).toContain('We welcome motivated students to join our research group as interns, Master’s students, and PhD researchers.');
    expect(educationHtml).toContain('PhD');

    // 3. SaaS: compute infrastructure, terminal tabs, latency metrics
    const saasHtml = renderToString(React.createElement(TEMPLATE_REGISTRY.saas, {}));
    expect(saasHtml).toContain('APEX Systems Engine');
    expect(saasHtml).toContain('The Autonomous Mathematical Runtime');

    // 4. Architecture: built works, floorplan levels, materiality palette
    const archHtml = renderToString(React.createElement(TEMPLATE_REGISTRY.architecture, {}));
    expect(archHtml).toContain('ATELIER MONOLITH Spatial Architecture');
    expect(archHtml).toContain('Structures Formed by Raw Stone');

    // 5. Finance: treasury vaults, APY calculator, cryptographic proof of reserves
    const financeHtml = renderToString(React.createElement(TEMPLATE_REGISTRY.finance, {}));
    expect(financeHtml).toContain('STRATA Wealth &amp; Global Treasury');
    expect(financeHtml).toContain('The institutional financial engine');

    // 6. Hospitality: alpine sanctuary, Michelin tasting courses, geothermal spa
    const hospHtml = renderToString(React.createElement(TEMPLATE_REGISTRY.hospitality, {}));
    expect(hospHtml).toContain('SANCTUARY Reserve &amp; Retreats');
    expect(hospHtml).toContain('A secluded alpine sanctuary');

    // 7. Portfolio: creative direction, project drawers, capability pillars
    const portfolioHtml = renderToString(React.createElement(TEMPLATE_REGISTRY.portfolio, {}));
    expect(portfolioHtml).toContain('STUDIO VORTEX Design &amp; Direction');
    expect(portfolioHtml).toContain('Designing visceral digital products');

    // 8. Publishing: critical essays, audio dispatch, quarterly monograph
    const pubHtml = renderToString(React.createElement(TEMPLATE_REGISTRY.publishing, {}));
    expect(pubHtml).toContain('CHRONICLE Journal of Ideas &amp; Culture');
    expect(pubHtml).toContain('The Architecture of Silence');
  });

  it('declares 8 industry category switcher tabs for the landing page with valid flagship presets', () => {
    expect(CATEGORY_TABS).toHaveLength(8);
    const tabCatIds = CATEGORY_TABS.map(t => t.id);
    for (const cat of EXPECTED_CATEGORIES) {
      expect(tabCatIds).toContain(cat);
    }

    for (const tab of CATEGORY_TABS) {
      expect(tab.id).toBeDefined();
      expect(tab.label).toBeDefined();
      expect(tab.flagshipId).toBeDefined();
      expect(tab.brand).toBeDefined();
      expect(tab.tagline).toBeDefined();
      expect(tab.description).toBeDefined();

      const matchedPreset = ALL_SHOWCASE_PRESETS.find(p => p.id === tab.flagshipId);
      expect(matchedPreset, `Flagship preset ${tab.flagshipId} not found in ALL_SHOWCASE_PRESETS`).toBeDefined();
      expect(matchedPreset?.canonicalCategory).toBe(tab.id);
    }
  });
});
