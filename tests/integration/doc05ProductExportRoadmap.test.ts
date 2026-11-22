import { describe, it, expect } from 'vitest';
import {
  exportTailwind4,
  exportTailwind3,
  exportCssVars,
  exportScss,
  exportDtcgJson,
  exportTypeScript,
  exportShadcn,
  exportFigmaTokensStudio,
  exportFigmaVariables,
  exportStyleDictionaryConfig,
  exportSelfHostedFonts,
  exportA11yAuditReport,
  exportStarterZip,
  SCHEMA_VERSION,
  GENERATOR_VERSION
} from '../../src/utils/tokenExporters';
import { createDefaultTokens } from '../../src/tokens/defaultTokens';
import { createShareableUrl, decodeShareableData } from '../../src/utils/router';
import {
  generateBrandTokens,
  generateMarketingCopy,
  generatePaletteFromDescription
} from '../../src/services/aiDesignAssist';
import { trackEvent, getStoredTelemetryEvents, clearTelemetryEvents } from '../../src/utils/telemetry';

describe('Doc 05 — Product, Export, Testing & Roadmap Integration', () => {
  const tokens = createDefaultTokens('commerce', 'ecommerce', 'Elysian Studios');

  describe('Multi-Format Export & Dark Mode Parity', () => {
    it('generates legacy Tailwind v3 config with dark mode and semantic extensions', () => {
      const config = exportTailwind3(tokens);
      expect(config).toContain("darkMode: 'class'");
      expect(config).toContain("var(--color-bg-default)");
      expect(config).toContain("var(--color-action-primary)");
      expect(config).toContain(`@schemaVersion ${SCHEMA_VERSION}`);
      expect(config).toContain(`@generatorVersion ${GENERATOR_VERSION}`);
    });

    it('generates SCSS variables with light and dark theme mixins', () => {
      const scss = exportScss(tokens);
      expect(scss).toContain('@mixin theme-light');
      expect(scss).toContain('@mixin theme-dark');
      expect(scss).toContain('--color-bg-default');
      expect(scss).toContain('$color-bg-default');
    });

    it('generates native Figma Variables with multi-mode (Light & Dark) color collections', () => {
      const figmaJson = exportFigmaVariables(tokens);
      const parsed = JSON.parse(figmaJson);

      expect(parsed.version).toBe('1.0.0');
      expect(parsed.collections).toBeDefined();

      const colorCol = parsed.collections.find((c: any) => c.name === 'Semantic Colors');
      expect(colorCol).toBeDefined();
      expect(colorCol.modes.mode_light).toBe('Light');
      expect(colorCol.modes.mode_dark).toBe('Dark');

      const bgVar = colorCol.variables.find((v: any) => v.name === 'bg/default');
      expect(bgVar).toBeDefined();
      expect(bgVar.type).toBe('COLOR');
      expect(bgVar.valuesByMode.mode_light.r).toBeDefined();
      expect(bgVar.valuesByMode.mode_dark.r).toBeDefined();
    });

    it('generates Style Dictionary configuration for multi-platform transforms', () => {
      const sdConfig = exportStyleDictionaryConfig(tokens);
      const parsed = JSON.parse(sdConfig);

      expect(parsed.source).toContain('tokens/**/*.json');
      expect(parsed.platforms.css.transformGroup).toBe('css');
      expect(parsed.platforms.scss.transformGroup).toBe('scss');
      expect(parsed.platforms.typescript.transformGroup).toBe('js');
    });

    it('generates GDPR-compliant self-hosted @font-face rules and fontsource commands', () => {
      const fontsCss = exportSelfHostedFonts(tokens);
      expect(fontsCss).toContain('@font-face');
      expect(fontsCss).toContain('font-display: swap');
      expect(fontsCss).toContain('npm install @fontsource-variable/');
      expect(fontsCss).toContain(tokens.typography.roles.heading?.family);
    });

    it('generates client accessibility audit report deliverable in Markdown', () => {
      const report = exportA11yAuditReport(tokens);
      expect(report).toContain('# Accessibility (A11y) & Contrast Conformance Report');
      expect(report).toContain('WCAG 2.2 Level AA');
      expect(report).toContain('Light Mode Contrast Conformance Matrix');
      expect(report).toContain('Dark Mode Contrast Conformance Matrix');
      expect(report).toContain('Body Text on Canvas');
      expect(report).toContain('Focus Ring Specification');
    });

    it('embeds version headers in code exports', () => {
      const tw4 = exportTailwind4(tokens);
      const css = exportCssVars(tokens);
      const ts = exportTypeScript(tokens);

      expect(tw4).toContain(`@schemaVersion ${SCHEMA_VERSION}`);
      expect(css).toContain(`@generatorVersion ${GENERATOR_VERSION}`);
      expect(ts).toContain(`export const generatorVersion = '${GENERATOR_VERSION}'`);
    });
  });

  describe('Shareable Hosted Preview Links', () => {
    it('encodes tokens to shareable URL and decodes them back identically', () => {
      const shareUrl = createShareableUrl(tokens);
      expect(shareUrl).toContain('#/share?data=');

      const dataParam = decodeURIComponent(shareUrl.split('data=')[1]);
      const decodedTokens = decodeShareableData(dataParam);

      expect(decodedTokens).not.toBeNull();
      expect(decodedTokens?.meta.projectName).toBe(tokens.meta.projectName);
      expect(decodedTokens?.color.semantic.light.actionPrimary).toBe(
        tokens.color.semantic.light.actionPrimary
      );
    });

    it('safely handles corrupted or invalid shareable data string', () => {
      const corrupted = decodeShareableData('not-a-valid-base64-json-payload');
      expect(corrupted).toBeNull();
    });
  });

  describe('AI Design Assist (Deterministic Offline Heuristics)', () => {
    it('generates coherent brand tokens for Fintech prompt', async () => {
      const result = await generateBrandTokens({
        brandName: 'Apex Capital',
        industry: 'Fintech & Trading',
        vibe: 'Modern & Trustworthy'
      });

      expect(result.projectName).toBe('Apex Capital');
      expect(result.primaryColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(result.headingFamily).toBeDefined();
      expect(result.suggestedCopy.headline).toBeDefined();
      expect(result.suggestedCopy.ctaText).toBeDefined();
    });

    it('synthesizes marketing copy tailored to offering', async () => {
      const copy = await generateMarketingCopy({
        brandName: 'Lumina',
        offering: 'AI powered spatial lighting systems',
        tone: 'Luxury Minimalist'
      });

      expect(copy.headline).toBeDefined();
      expect(copy.subheadline).toBeDefined();
      expect(copy.ctaText).toBeDefined();
    });

    it('extracts coherent palette from natural language descriptions', async () => {
      const palette = await generatePaletteFromDescription('warm desert terracotta sunset');
      expect(palette.name).toContain('Terracotta');
      expect(palette.primary).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(palette.secondary).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });

  describe('Privacy-Friendly Local Telemetry', () => {
    it('records and retrieves telemetry events locally without third-party leaks', () => {
      clearTelemetryEvents();
      trackEvent('wizard_step_viewed', { step: 11 });
      trackEvent('export_bundle_downloaded', { format: 'starter-zip' });

      const events = getStoredTelemetryEvents();
      expect(events.length).toBe(2);
      expect(events[0].eventName).toBe('wizard_step_viewed');
      expect(events[1].properties?.format).toBe('starter-zip');
    });
  });
});
