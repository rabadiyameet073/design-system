import React from 'react';
import { renderToString } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { GENRE_CONFIGS, getGenresForCategory } from '../../src/preview/genres';
import {
  resolveGenreContent,
  ResolvedGenreContent
} from '../../src/preview/genres/genreContent';
import { TEMPLATE_REGISTRY } from '../../src/preview/templates';
import { CategoryId } from '../../src/tokens/types';

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

describe('Genre content resolver (F-02 / F-03)', () => {
  it('resolves all 32 genre configs to complete, valid content', () => {
    const ids = Object.keys(GENRE_CONFIGS);
    expect(ids).toHaveLength(32);

    for (const id of ids) {
      const config = GENRE_CONFIGS[id];
      const content = resolveGenreContent(id);

      expect(content.genreId, `${id} genreId`).toBe(id);
      expect(content.category, `${id} category`).toBe(config.category);
      expect(content.brandName, `${id} brandName`).toBeTruthy();
      expect(content.headline, `${id} headline`).toBeTruthy();
      expect(content.subtitle, `${id} subtitle`).toBeTruthy();
      expect(content.badge, `${id} badge`).toBeTruthy();
      expect(content.heroImage, `${id} heroImage`).toBe(config.heroImage);
      expect(content.primaryAction, `${id} primaryAction`).toBeTruthy();
      expect(content.secondaryAction, `${id} secondaryAction`).toBeTruthy();
      expect(content.items.length, `${id} items`).toBeGreaterThan(0);
      expect(content.highlights.length, `${id} highlights`).toBeGreaterThan(0);
      expect(content.quotes.length, `${id} quotes`).toBeGreaterThan(0);
      expect(content.faqs.length, `${id} faqs`).toBeGreaterThan(0);

      for (const item of content.items) {
        expect(item.id, `${id} item.id`).toBeTruthy();
        expect(item.title, `${id} item.title`).toBeTruthy();
        expect(item.description, `${id} item.description`).toBeTruthy();
        expect(item.image, `${id} item.image`).toBeTruthy();
        expect(item.specs.length, `${id} item.specs`).toBeGreaterThan(0);
      }
      for (const highlight of content.highlights) {
        expect(highlight.title).toBeTruthy();
        expect(highlight.stats.length).toBeGreaterThan(0);
      }
      for (const faq of content.faqs) {
        expect(faq.q).toBeTruthy();
        expect(faq.a).toBeTruthy();
      }
    }
  });

  it('gives every genre a distinct brand and headline', () => {
    const contents: ResolvedGenreContent[] = Object.keys(GENRE_CONFIGS).map(id =>
      resolveGenreContent(id)
    );
    expect(new Set(contents.map(c => c.brandName)).size).toBe(contents.length);
    expect(new Set(contents.map(c => c.headline)).size).toBe(contents.length);
  });

  it('yields visibly different copy for two genres in the same category', () => {
    const ceramics = resolveGenreContent('ceramics-atelier');
    const fashion = resolveGenreContent('fashion-store');
    expect(fashion.brandName).not.toBe(ceramics.brandName);
    expect(fashion.headline).not.toBe(ceramics.headline);
    expect(fashion.subtitle).not.toBe(ceramics.subtitle);
    expect(fashion.items.map(i => i.title)).not.toEqual(ceramics.items.map(i => i.title));
    expect(fashion.items.join(' ')).not.toMatch(/stoneware|tea bowl|kiln/i);

    const dashboard = resolveGenreContent('dashboard-app');
    const ai = resolveGenreContent('ai-product');
    expect(ai.brandName).not.toBe(dashboard.brandName);
    expect(ai.headline).not.toBe(dashboard.headline);
    expect(ai.items[0].title).toContain('Agent');
  });

  it('covers all 4 genres in each of the 8 categories', () => {
    for (const category of CATEGORIES) {
      const genres = getGenresForCategory(category);
      expect(genres).toHaveLength(4);
      for (const genre of genres) {
        expect(resolveGenreContent(genre.id).category).toBe(category);
      }
    }
  });

  it('falls back safely for unknown ids and honours explicit overrides', () => {
    const fallback = resolveGenreContent('not-a-real-genre-xyz');
    expect(fallback.genreId).toBe('ceramics-atelier');
    expect(fallback.brandName).toBeTruthy();

    const overridden = resolveGenreContent('ai-product', {
      brandName: 'Acme Studio',
      headline: 'A custom headline',
      subtitle: 'A custom subtitle',
      badge: 'Verified',
      heroImage: '/custom-hero.jpg'
    });
    expect(overridden.brandName).toBe('Acme Studio');
    expect(overridden.headline).toBe('A custom headline');
    expect(overridden.subtitle).toBe('A custom subtitle');
    expect(overridden.badge).toBe('Verified');
    expect(overridden.heroImage).toBe('/custom-hero.jpg');
    // Non-overridden fields still come from the genre.
    expect(overridden.genreId).toBe('ai-product');
    expect(overridden.items.length).toBeGreaterThan(0);
  });

  it('renders all 8 templates with genre-resolved content without throwing', () => {
    for (const category of CATEGORIES) {
      const content = resolveGenreContent(getGenresForCategory(category)[0].id);
      const Template = TEMPLATE_REGISTRY[category];
      const html = renderToString(
        React.createElement(Template, {
          content,
          brandName: content.brandName,
          headline: content.headline,
          subtitle: content.subtitle,
          badge: content.badge,
          heroImage: content.heroImage,
          genreId: content.genreId
        })
      );
      expect(html.length).toBeGreaterThan(500);
      expect(html).toContain(content.brandName);
      expect(html).toContain(content.items[0].title);
    }
  });

  it('renders each of the 32 genres with its own brand and offering', () => {
    for (const id of Object.keys(GENRE_CONFIGS)) {
      const content = resolveGenreContent(id);
      const Template = TEMPLATE_REGISTRY[content.category];
      const html = renderToString(
        React.createElement(Template, {
          content,
          brandName: content.brandName,
          headline: content.headline,
          subtitle: content.subtitle,
          badge: content.badge,
          heroImage: content.heroImage,
          genreId: content.genreId
        })
      );
      const rendered = html.replace(/&amp;/g, '&');
      expect(rendered, `${id} brand`).toContain(content.brandName);
      expect(rendered, `${id} offering`).toContain(content.items[0].title);
    }
  });

  it('commerce template shows the selected genre offering, not Aether headphones', () => {
    const fashion = resolveGenreContent('fashion-store');
    const html = renderToString(
      React.createElement(TEMPLATE_REGISTRY.commerce, {
        content: fashion,
        brandName: fashion.brandName,
        headline: fashion.headline,
        subtitle: fashion.subtitle,
        badge: fashion.badge,
        heroImage: fashion.heroImage,
        genreId: fashion.genreId
      })
    );

    expect(html).toContain('MAISON ÉLAN');
    expect(html).toContain('The Atelier Trench');
    expect(html).not.toMatch(/Aether|Headphones|Planar|Beryllium/i);
  });

  it('saas template shows the chosen AI genre identity instead of Apex copy', () => {
    const ai = resolveGenreContent('ai-product');
    const html = renderToString(
      React.createElement(TEMPLATE_REGISTRY.saas, {
        content: ai,
        brandName: ai.brandName,
        headline: ai.headline,
        subtitle: ai.subtitle,
        badge: ai.badge,
        heroImage: ai.heroImage,
        genreId: ai.genreId
      })
    );

    expect(html).toContain('NEXUS Neural Workspace');
    expect(html).toContain('Agent Runtime');
    expect(html).not.toMatch(/APEX|Apex|apex/i);
  });
});
