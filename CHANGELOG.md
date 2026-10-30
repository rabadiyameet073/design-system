# Changelog

All notable changes to Design System Studio (DSS) will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-10-30

### Complete Industrial Implementation (Doc 01 Roadmap & Guidelines)
- **Three.js Performance & Code-Splitting**:
  - Code-split `Interactive3DCanvas` into a lazy chunk via `React.lazy()` and `<Suspense>`, reducing initial landing bundle size.
  - Implemented accessible static fallback for users with `prefers-reduced-motion` or low-power devices.
- **Step 2: Project Scope & Demographic Targeting**:
  - Audience age demographic selector (18–35, 35–50, 50+); picking 50+ auto-calibrates base typography scale to 18px and nudges body contrast target to AAA (7:1).
  - Brand Hex code input and Image Logo upload with HTML5 Canvas pixel color extraction (`extractDominantColorFromImage`).
  - Inspiration URLs reference input, Platform target selector (Web only vs Web + App), Framework target selector (Tailwind CSS 4, Plain CSS, shadcn/ui), and Dark Mode policy.
- **Step 5: Color Studio & OKLCH Harmonies**:
  - 4 Start-from modes: Brand Color Wheel, Logo Upload, Curated 60-30-10 Presets, and AI-Style Mood Prompts.
  - OKLCH perceptual harmonies (Complementary, Analogous, Triadic, Split-Complementary, Monochromatic).
  - Brand and Accent color lock toggles to cycle palettes while preserving signature colors.
  - Live WCAG 2.2 AA Contrast Scorecard with instant "Nudge to AA (Auto-Fix)" button powered by `nudgeToContrast`.
- **Step 7: Shape, Spacing & Elevation**:
  - Spacing density multiplier: Airy (1.25×), Balanced (1.0×), Compact (0.8×) with 4px / 8px grid selection.
  - 4 Corner radius presets (`sharp`, `subtle`, `rounded`, `playful`) with standard `full: 9999`.
  - 4 Elevation shadow presets (`flat`, `soft`, `crisp`, `dramatic`) featuring brand-tinted low-alpha shadows.
- **Step 8: Components Studio**:
  - Interactive component showcase for Buttons (variants: filled/outline/subtle/ghost/destructive × sizes: sm/md/lg × states: default/hover/focus/disabled/loading).
  - Form controls with default, focused outline ring, error validation state with helper text, and disabled state.
  - Status badges and system alerts across neutral, success, warning, danger, and info roles.
- **Step 9: Imagery, Icons & Motion Physics**:
  - Motion physics level selector: None (0ms), Subtle (120–320ms), and Expressive (150–450ms spring physics `stiffness: 280, damping: 22`).
  - Icon set selection: Lucide, Phosphor, Tabler.
  - Icon style selection: Outline (1.75px), Filled, and Duotone.
  - Photo treatments: Natural daylight, brand-tinted duotone, and architectural monochrome.
- **Studio Keyboard Shortcuts**:
  - Global hotkeys: `ArrowRight`/`ArrowLeft` step navigation, `Cmd/Ctrl+Z` undo, `Cmd/Ctrl+Shift+Z` / `Ctrl+Y` redo, `C` draft compare, and `?` modal dialog (`KeyboardShortcutsModal.tsx`).
  - Dedicated shortcuts help button in the application header.
- **Verification**:
  - 33/33 tests passing across 8 test suites in Vitest.
  - TypeScript strict typecheck (`tsc --noEmit`) passes with 0 errors.
  - Vite production build (`vite build`) successfully compiling with 0 errors.

---

## [1.0.0-beta.1] - 2026-10-30

### Phase 1: 3-Tier Token Core Architecture
- **Single Source of Truth**:
  - Implemented typed `DesignTokens` master interface and Zod validation schema (`src/tokens/types.ts`).
  - Tier 1: Primitive color scales (11-step OKLCH lightness ramps for `brand`, `accent`, `neutral`, `success`, `warning`, `danger`, `info`).
  - Tier 2: Semantic color mappings (`bgDefault`, `bgSurface`, `bgElevated`, `fgDefault`, `fgMuted`, `actionPrimary`, `focusRing`, etc.) with separate light and dark palettes.
  - Tier 3: Component-level tokens for button radius, card elevation, and input styling.
- **Color Science & Contrast Engine**:
  - OKLCH scale generation with perceptual lightness curves and brand-tinted neutrals (`src/tokens/colorScale.ts`).
  - Real-time WCAG 2.2 AA contrast calculation using `culori` with `ratio()`, `grade()`, and automated `nudgeToContrast()` auto-fix (`src/tokens/contrastEngine.ts`).
  - `tokensToCssVars()` serializer for CSS custom properties.

### Phase 2: Reactive Iframe Preview Engine
- **Iframe Architecture**:
  - Embedded same-origin iframe route at `/preview-frame` (`src/preview/PreviewFrame.tsx`).
  - Full `postMessage` protocol (`INIT`, `TOKENS`, `MODE`, `SCROLL_TO` and `A11Y_RESULT`) with origin validation and `requestAnimationFrame` throttling.
  - Sizing wrapper enabling true CSS media queries on Phone (375px), Tablet (768px), and Desktop (100%).
- **Always-On Studio Controls**:
  - Integrated Viewport Switcher (Phone / Tablet / Desktop) in preview header.
  - Integrated Light / Dark Mode toggle in preview header.
  - Live WCAG 2.2 A11y Badge displaying computed passing/warning counts (`A11y: 14✓ 0✗`).
  - Draft preview-then-apply ribbon with undo/redo history stack (`canUndo`, `canRedo`).

### Phase 3: Template-First Flow & 8 Industry Archetypes
- **Template-First Architecture**:
  - Moved Category & Genre selection to Step 1: picking an industry category immediately opens its bespoke template.
  - 8 distinct category templates (`commerce`, `saas`, `portfolio`, `publishing`, `hospitality`, `education`, `architecture`, `finance`) built from a shared section registry (`src/preview/sections/`).
  - 32 detailed `GenreConfig` definitions covering diverse business archetypes (`src/preview/genres/`).
  - Enforced token-only styling: zero hardcoded colors, radii, or fonts in template components.
  - Every template ends with `ComponentsShowcase` (all button states, inputs, badges, alerts) and `TypeSpecimen` (H1–H6, body copy, code).
- **Streamlined 11-Step Guided Wizard**:
  - Step 1: Category & Genre (Template opens)
  - Step 2: Project Scope & Language Scripts
  - Step 3: Brand Personality (5 sliders: Energy, Craft, Voice, Formality, Density + deterministic preset suggestions)
  - Step 4: Visual Direction
  - Step 5: Color Studio
  - Step 6: Typography Studio
  - Step 7: Shape & Spacing (Radius, density, elevation)
  - Step 8: Website Components
  - Step 9: Imagery & Motion
  - Step 10: Review & Audit (WCAG 2.2 AA matrix with "Nudge to AA" auto-fix)
  - Step 11: Export Center

### Phase 4: Modern Typography System
- **Font Catalog & API**:
  - Created `/api/fonts` endpoint proxying Google Fonts developer API with caching headers and snapshot fallback (`src/data/fonts.snapshot.json`).
  - Built interactive `FontPickerModal` with live search, category filtering, script filtering (Latin, Devanagari, Gujarati, Arabic, Cyrillic), and variable font toggle.
- **Recommendation Engine**:
  - `scorePair()` algorithm scoring curated pairs and personality tag resonance (`src/utils/typeScale.ts`).
  - Curated pairing presets spanning editorial serifs, modern geometrics, monospace, and Indic multi-scripts.
- **Fluid Modular Scaling**:
  - Modular ratio calculation (1.200 to 1.618) with continuous `clamp()` formulas for responsive typography without layout shifts.

### Phase 5 & 6: Production Exporters & Verification
- **10 Export Deliverables**:
  1. Tailwind CSS 4 theme (`theme.css` with `@theme inline` and dark variants)
  2. CSS Custom Properties (`tokens.css` with `:root` and `.dark`)
  3. W3C Design Tokens DTCG JSON (`tokens.json` with `$type` and `$value`)
  4. TypeScript type-safe token definitions (`tokens.ts`)
  5. shadcn/ui Theme CSS (`shadcn-theme.css`)
  6. Figma Tokens Studio JSON (`tokens.studio.json`)
  7. 4-Page Vector PDF specification (`design-spec.pdf` with computed real values)
  8. Specimen Board PNG (`board@2x.png` 1600×1000)
  9. Project State JSON (`project.dss.json` with `schemaVersion: 1`, importable & exportable)
  10. Complete Starter ZIP (`starter.zip` with self-hosted font installation guide and README)
- **Quality Assurance**:
  - 26/26 unit tests passing across all token, scale, contrast, and exporter suites.
  - Strict TypeScript check (`tsc --noEmit`) passing with 0 errors.
  - Production build (`vite build`) successfully compiling with 0 errors.

---

## [1.0.0] - 2026-10-30

### Complete Industrial Implementation (Doc 01 Roadmap & Guidelines)
- **Three.js Performance & Code-Splitting**:
  - Code-split `Interactive3DCanvas` into a lazy chunk via `React.lazy()` and `<Suspense>`, reducing initial landing bundle size.
  - Implemented accessible static fallback for users with `prefers-reduced-motion` or low-power devices.
- **Step 2: Project Scope & Demographic Targeting**:
  - Audience age demographic selector (18–35, 35–50, 50+); picking 50+ auto-calibrates base typography scale to 18px and nudges body contrast target to AAA (7:1).
  - Brand Hex code input and Image Logo upload with HTML5 Canvas pixel color extraction (`extractDominantColorFromImage`).
  - Inspiration URLs reference input, Platform target selector (Web only vs Web + App), Framework target selector (Tailwind CSS 4, Plain CSS, shadcn/ui), and Dark Mode policy.
- **Step 5: Color Studio & OKLCH Harmonies**:
  - 4 Start-from modes: Brand Color Wheel, Logo Upload, Curated 60-30-10 Presets, and AI-Style Mood Prompts.
  - OKLCH perceptual harmonies (Complementary, Analogous, Triadic, Split-Complementary, Monochromatic).
  - Brand and Accent color lock toggles to cycle palettes while preserving signature colors.
  - Live WCAG 2.2 AA Contrast Scorecard with instant "Nudge to AA (Auto-Fix)" button powered by `nudgeToContrast`.
- **Step 7: Shape, Spacing & Elevation**:
  - Spacing density multiplier: Airy (1.25×), Balanced (1.0×), Compact (0.8×) with 4px / 8px grid selection.
  - 4 Corner radius presets (`sharp`, `subtle`, `rounded`, `playful`) with standard `full: 9999`.
  - 4 Elevation shadow presets (`flat`, `soft`, `crisp`, `dramatic`) featuring brand-tinted low-alpha shadows.
- **Step 8: Components Studio**:
  - Interactive component showcase for Buttons (variants: filled/outline/subtle/ghost/destructive × sizes: sm/md/lg × states: default/hover/focus/disabled/loading).
  - Form controls with default, focused outline ring, error validation state with helper text, and disabled state.
  - Status badges and system alerts across neutral, success, warning, danger, and info roles.
- **Step 9: Imagery, Icons & Motion Physics**:
  - Motion physics level selector: None (0ms), Subtle (120–320ms), and Expressive (150–450ms spring physics `stiffness: 280, damping: 22`).
  - Icon set selection: Lucide, Phosphor, Tabler.
  - Icon style selection: Outline (1.75px), Filled, and Duotone.
  - Photo treatments: Natural daylight, brand-tinted duotone, and architectural monochrome.
- **Studio Keyboard Shortcuts**:
  - Global hotkeys: `ArrowRight`/`ArrowLeft` step navigation, `Cmd/Ctrl+Z` undo, `Cmd/Ctrl+Shift+Z` / `Ctrl+Y` redo, `C` draft compare, and `?` modal dialog (`KeyboardShortcutsModal.tsx`).
  - Dedicated shortcuts help button in the application header.
- **Verification**:
  - 33/33 tests passing across 8 test suites in Vitest.
  - TypeScript strict typecheck (`tsc --noEmit`) passes with 0 errors.
  - Vite production build (`vite build`) successfully compiling with 0 errors.

---

## [1.0.0-alpha.1] - 2026-10-30

### Phase 0: Cleanup & Reality-Check Alignment
- **Claims Sanitization**:
  - Replaced unprovable claims ("0ms latency", "zero drift") with truthful engineering guarantees ("instant synchronous updates", "single source of truth").
  - Removed "client-side encryption" claims; storage is clearly defined as local-first browser `localStorage` with zero server telemetry by default.
  - Replaced hardcoded "Verified 8.4:1 AAA" contrast claim with dynamically computed WCAG 2.2 contrast math.
- **Standards Upgrade**:
  - Upgraded accessibility baseline to **WCAG 2.2 AA** (including 24×24px minimum touch targets and focus-appearance compliance).
- **Schema & Versioning**:
  - Enforced `schemaVersion: 1` across `DesignProject` and future `DesignTokens` data models.
  - Pinned `package.json` project name to `design-system-studio`.
