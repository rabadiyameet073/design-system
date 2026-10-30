import { describe, it, expect } from 'vitest';
import { tokensToCssVars, generateCssRuleString } from '../../src/tokens/tokensToCssVars';
import { createDefaultTokens } from '../../src/tokens/defaultTokens';

describe('Tokens to CSS Variables Serializer', () => {
  it('serializes primitives, semantics, spacing, radius, and fonts', () => {
    const tokens = createDefaultTokens();
    const vars = tokensToCssVars(tokens, 'light');

    expect(vars['--color-brand-500']).toBeDefined();
    expect(vars['--color-bg-default']).toBeDefined();
    expect(vars['--color-fg-default']).toBeDefined();
    expect(vars['--radius-md']).toBe('8px');
    expect(vars['--font-heading']).toContain('Cormorant Garamond');
    expect(vars['--font-body']).toContain('Plus Jakarta Sans');
  });

  it('swaps semantic variables when dark mode is requested', () => {
    const tokens = createDefaultTokens();
    const lightVars = tokensToCssVars(tokens, 'light');
    const darkVars = tokensToCssVars(tokens, 'dark');

    expect(lightVars['--color-bg-default']).not.toBe(darkVars['--color-bg-default']);
    expect(lightVars['--color-fg-default']).not.toBe(darkVars['--color-fg-default']);
  });

  it('generates formatted CSS rule block', () => {
    const tokens = createDefaultTokens();
    const css = generateCssRuleString(tokens, 'light', ':root');

    expect(css).toContain(':root {');
    expect(css).toContain('--color-brand-500:');
    expect(css).toContain('}');
  });
});
