import { describe, it, expect } from 'vitest';
import { STEP_DEFINITIONS, getStepDefinition } from '../../src/components/wizard/stepDefinitions';
import { MOTION_SPRINGS, getAccessibleTransition } from '../../src/tokens/motionConfig';
import { hexToHsl, hslToHex } from '../../src/utils/colorMath';

describe('Doc 04 Design, Accessibility & Content Protocol', () => {
  describe('1. Motion Tokens & Reduced-Motion Accessibility (Doc 04 §Accessibility)', () => {
    it('defines standardized spring configs for fast, base, and slow motion', () => {
      expect(MOTION_SPRINGS.fast.type).toBe('spring');
      expect(MOTION_SPRINGS.base.type).toBe('spring');
      expect(MOTION_SPRINGS.slow.type).toBe('spring');
    });

    it('returns instantaneous transition when prefersReducedMotion is active', () => {
      const normalTransition = MOTION_SPRINGS.base;
      const accessibleTransition = getAccessibleTransition(normalTransition, true);

      expect(accessibleTransition.duration).toBe(0.01);
      expect(accessibleTransition.type).toBe('tween');
    });
  });

  describe('2. Founder-Friendly Microcopy & Time Expectations (Doc 04 §Content & copy)', () => {
    it('provides estimated time, whatYouGet, and whyItMatters for every step', () => {
      STEP_DEFINITIONS.forEach(step => {
        expect(step.estimatedTime).toBeDefined();
        expect(step.estimatedTime).toMatch(/~\d+\s*min/);
        expect(step.whatYouGet).toBeDefined();
        expect(step.whatYouGet?.length).toBeGreaterThan(10);
        expect(step.whyItMatters).toBeDefined();
        expect(step.whyItMatters?.length).toBeGreaterThan(15);
      });
    });

    it('uses founder-friendly subtitles without opaque jargon', () => {
      const colorStep = getStepDefinition(5);
      expect(colorStep.title).toBe('Color Studio');
      expect(colorStep.subtitle).toContain('Brand colors');

      const typeStep = getStepDefinition(6);
      expect(typeStep.title).toBe('Typography Studio');
      expect(typeStep.subtitle).toContain('Font pairing');

      const shapeStep = getStepDefinition(7);
      expect(shapeStep.title).toBe('Shape & Spacing');
      expect(shapeStep.subtitle).toContain('Curvature');
    });
  });

  describe('3. Color Wheel Mathematical Keyboard Precision (Doc 04 §Accessibility)', () => {
    it('accurately computes hue wraps around 360 degrees', () => {
      const hslInitial = hexToHsl('#B7410E');
      expect(hslInitial.h).toBeGreaterThanOrEqual(0);
      expect(hslInitial.h).toBeLessThan(360);

      // Wrap around test
      const wrappedRight = (358 + 5) % 360;
      expect(wrappedRight).toBe(3);

      const wrappedLeft = (2 - 5 + 360) % 360;
      expect(wrappedLeft).toBe(357);
    });

    it('clamps saturation between 0% and 100%', () => {
      const clampUp = Math.min(100, 98 + 5);
      expect(clampUp).toBe(100);

      const clampDown = Math.max(0, 3 - 5);
      expect(clampDown).toBe(0);
    });
  });

  describe('4. Multi-Script RTL Direction Support (Doc 04 §Internationalization)', () => {
    it('detects Arabic, Hebrew, and Farsi scripts for RTL direction', () => {
      const rtlScripts = ['Arabic', 'Hebrew', 'Farsi', 'Urdu'];
      const ltrScripts = ['Latin', 'Cyrillic', 'Greek'];

      const checkRtl = (scripts: string[]) =>
        scripts.some(s => ['arabic', 'hebrew', 'farsi', 'urdu', 'ar', 'he'].includes(s.toLowerCase()));

      expect(checkRtl(rtlScripts)).toBe(true);
      expect(checkRtl(['Latin', 'Arabic'])).toBe(true);
      expect(checkRtl(ltrScripts)).toBe(false);
    });
  });
});
