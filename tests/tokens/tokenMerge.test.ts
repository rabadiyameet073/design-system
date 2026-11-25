import { describe, it, expect } from 'vitest';
import { mergeTokens, MAX_HISTORY } from '../../src/tokens/tokenMerge';
import { createDefaultTokens } from '../../src/tokens/defaultTokens';

describe('mergeTokens — single token merge implementation', () => {
  const base = createDefaultTokens('commerce', 'ecommerce', 'Initial Brand');

  it('returns the base unchanged when no draft is supplied', () => {
    expect(mergeTokens(base)).toBe(base);
  });

  it('overlays a partial draft without mutating the base', () => {
    const merged = mergeTokens(base, {
      radius: { ...base.radius, md: 16 },
      meta: { ...base.meta, projectName: 'Previewed Brand' }
    } as any);

    expect(merged.radius.md).toBe(16);
    expect(merged.meta.projectName).toBe('Previewed Brand');
    expect(base.radius.md).toBe(8);
  });

  it('deep-merges every token group instead of replacing them wholesale', () => {
    const merged = mergeTokens(base, {
      imagery: { treatment: 'duotone', overlay: 40, grain: 15, radius: 'lg' } as any,
      motion: { level: 'expressive' } as any,
      layout: { container: 1440 } as any,
      border: { width: 2 } as any,
      component: { buttonStyle: 'outline' } as any,
      color: { semantic: { light: { actionPrimary: '#123456' } } } as any
    } as any);

    expect(merged.imagery.treatment).toBe('duotone');
    expect(merged.imagery.grain).toBe(15);
    expect(merged.motion.level).toBe('expressive');
    expect(merged.motion.duration.fast).toBe(base.motion.duration.fast);
    expect(merged.layout.container).toBe(1440);
    expect(merged.layout.gutter).toBe(base.layout.gutter);
    expect(merged.border.width).toBe(2);
    expect(merged.component.buttonStyle).toBe('outline');
    expect(merged.color.semantic.light.actionPrimary).toBe('#123456');
    expect(merged.color.semantic.dark.actionPrimary).toBe(base.color.semantic.dark.actionPrimary);
  });

  it('defines a single bounded history depth', () => {
    expect(MAX_HISTORY).toBe(30);
  });
});
