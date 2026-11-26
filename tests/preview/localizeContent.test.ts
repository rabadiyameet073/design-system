import { describe, it, expect } from 'vitest';
import { localizeGenreContent, getScriptMeta, SCRIPT_CONFIGS } from '../../src/preview/i18n/localizeContent';
import { resolveGenreContent } from '../../src/preview/genres/genreContent';

describe('Multi-Script & Writing System Localization Engine', () => {
  const baseCeramics = resolveGenreContent('ceramics-atelier');

  it('provides complete script metadata for all 5 supported writing systems', () => {
    expect(SCRIPT_CONFIGS.latin).toBeDefined();
    expect(SCRIPT_CONFIGS.gujarati).toBeDefined();
    expect(SCRIPT_CONFIGS.devanagari).toBeDefined();
    expect(SCRIPT_CONFIGS.arabic).toBeDefined();
    expect(SCRIPT_CONFIGS.cyrillic).toBeDefined();

    expect(getScriptMeta('gujarati').lang).toBe('gu');
    expect(getScriptMeta('arabic').dir).toBe('rtl');
    expect(getScriptMeta('devanagari').lang).toBe('hi');
  });

  it('correctly localizes commerce content into authentic Gujarati', () => {
    const localized = localizeGenreContent(baseCeramics, 'gujarati', 'commerce');

    expect(localized.scriptMeta.lang).toBe('gu');
    expect(localized.scriptMeta.dir).toBe('ltr');
    expect(localized.scriptMeta.fonts.display).toBe('Noto Serif Gujarati');
    expect(localized.scriptMeta.fonts.heading).toBe('Noto Sans Gujarati');

    expect(localized.brandName).toBe('કોમોરેબી સિરામિક સ્ટુડિયો');
    expect(localized.headline).toContain('હાથે બનાવેલા માટીના કલાત્મક પાત્રો');
    expect(localized.primaryAction).toBe('સંગ્રહ જુઓ');
    expect(localized.ui?.addToCart).toBe('કાર્ટમાં ઉમેરો');
    expect(localized.ui?.cart).toBe('કાર્ટ');
    expect(localized.ui?.announcement).toContain('મફત એક્સપ્રેસ ડિલિવરી');
    expect(localized.items[0].title).toBe('હાથે બનાવેલ સિરામિક ટી સેટ');
    expect(localized.faqs[0].q).toContain('વાસણો');
  });

  it('correctly localizes content into authentic Devanagari', () => {
    const localized = localizeGenreContent(baseCeramics, 'devanagari', 'commerce');

    expect(localized.scriptMeta.lang).toBe('hi');
    expect(localized.scriptMeta.fonts.heading).toBe('Poppins');
    expect(localized.brandName).toBe('कोमोरेबी सिरेमिक स्टूडियो');
    expect(localized.ui?.addToCart).toBe('कार्ट में जोड़ें');
  });

  it('correctly localizes content into Arabic with RTL direction', () => {
    const localized = localizeGenreContent(baseCeramics, 'arabic', 'commerce');

    expect(localized.scriptMeta.lang).toBe('ar');
    expect(localized.scriptMeta.dir).toBe('rtl');
    expect(localized.scriptMeta.fonts.display).toBe('Amiri');
    expect(localized.brandName).toBe('استوديو كوموريبي للخزف الفاخر');
    expect(localized.ui?.addToCart).toBe('أضف إلى السلة');
  });

  it('preserves user custom brand name when user provides an explicit custom name', () => {
    const localized = localizeGenreContent(baseCeramics, 'gujarati', 'commerce', 'કલાત્મક વાસણો');
    expect(localized.brandName).toBe('કલાત્મક વાસણો');
  });
});
