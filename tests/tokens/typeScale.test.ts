import { describe, it, expect } from 'vitest';
import {
  scaleSize,
  fluid,
  generateFullTypeScale,
  scorePair,
  getRecommendedBodyFonts,
  FontMeta
} from '../../src/utils/typeScale';

describe('typeScale utilities', () => {
  it('correctly calculates modular scale sizes', () => {
    const base = 16;
    const ratio = 1.25; // Major Third
    expect(scaleSize(base, ratio, 0)).toBe(16);
    expect(scaleSize(base, ratio, 1)).toBe(20);
    expect(scaleSize(base, ratio, 2)).toBe(25);
  });

  it('generates fluid clamp formulas', () => {
    const res = fluid(16, 24, 360, 1280);
    expect(res).toContain('clamp(');
    expect(res).toContain('rem');
    expect(res).toContain('vw');
  });

  it('generates a full fluid type scale for standard steps', () => {
    const scale = generateFullTypeScale(16, 1.25);
    expect(scale.base).toBeDefined();
    expect(scale.xs).toBeDefined();
    expect(scale['6xl']).toBeDefined();
    expect(scale.base.css).toContain('clamp(');
  });

  it('scores curated pairs highest in font recommendations', () => {
    const heading: FontMeta = {
      family: 'Fraunces',
      category: 'serif',
      variants: ['400', '700'],
      subsets: ['latin'],
      variable: true,
      source: 'google'
    };

    const goodBody: FontMeta = {
      family: 'DM Sans',
      category: 'sans-serif',
      variants: ['400', '700'],
      subsets: ['latin'],
      variable: true,
      source: 'google'
    };

    const randomBody: FontMeta = {
      family: 'Random Sans',
      category: 'sans-serif',
      variants: ['400'],
      subsets: ['latin'],
      variable: false,
      source: 'google'
    };

    const scoreGood = scorePair(heading, goodBody, { tags: ['luxury', 'editorial'] });
    const scoreRandom = scorePair(heading, randomBody, { tags: ['luxury', 'editorial'] });
    expect(scoreGood).toBeGreaterThan(scoreRandom);
  });

  it('filters out display and handwriting fonts from body recommendations', () => {
    const heading: FontMeta = {
      family: 'Inter',
      category: 'sans-serif',
      variants: ['400', '700'],
      subsets: ['latin'],
      variable: true,
      source: 'google'
    };

    const allFonts: FontMeta[] = [
      { family: 'DM Sans', category: 'sans-serif', variants: ['400', '700'], subsets: ['latin'], variable: true, source: 'google' },
      { family: 'Michroma', category: 'display', variants: ['400'], subsets: ['latin'], variable: false, source: 'google' }
    ];

    const recommended = getRecommendedBodyFonts(heading, allFonts);
    const families = recommended.map(f => f.family);
    expect(families).toContain('DM Sans');
    expect(families).not.toContain('Michroma');
  });
});
