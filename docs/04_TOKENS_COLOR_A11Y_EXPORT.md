# 04 — TOKENS, COLOR, ACCESSIBILITY & EXPORT

## 1. Token architecture (3 tiers)
```
PRIMITIVE (raw values)        SEMANTIC (meaning)             COMPONENT (usage)
color.brand.500  ───────────► color.action.primary  ───────► button.primary.bg
color.neutral.50 ───────────► color.bg.default      ───────► card.bg
space.4 (16px)   ───────────► space.stack.md        ───────► card.padding
radius.200       ───────────► radius.control        ───────► button.radius
```
- **Primitives** never used directly in components.
- **Semantic** tokens are what templates/components consume; **dark mode swaps semantic → primitive mappings**, not the components.
- **Component** tokens are optional overrides (button/card/input/badge/alert).

### 1.1 Master type (single source of truth)
```ts
interface DesignTokens {
  schemaVersion: 1;
  meta: { projectName: string; slug: string; genreId: string; category: CategoryId;
          goal: string; audience: string; scripts: string[]; darkMode: 'none'|'auto'|'manual';
          personality: { energy:number; craft:number; voice:number; formality:number; density:number } };
  color: {
    primitives: Record<'brand'|'accent'|'neutral'|'success'|'warning'|'danger'|'info', Scale>; // 11 steps each
    semantic: { light: SemanticColors; dark: SemanticColors };
  };
  typography: TypographyTokens;                 // doc 03
  space: { base: 4|8; scale: number[] };        // [0,4,8,12,16,24,32,48,64,96,128]
  radius: { none:number; sm:number; md:number; lg:number; xl:number; full:number };
  shadow: { sm:string; md:string; lg:string };  // generated from one "elevation" preference
  border: { width:number; style:'solid'|'dashed' };
  layout: { container: number; gutter: number; columns: 4|8|12; breakpoints: Record<'sm'|'md'|'lg'|'xl', number> };
  motion: { level:'none'|'subtle'|'expressive'; duration: Record<'fast'|'base'|'slow', number>; easing: Record<'standard'|'emphasized', string> };
  imagery: { overlay:number; grain:number; radius:keyof DesignTokens['radius']; treatment:'natural'|'duotone'|'mono' };
  icon: { library:'lucide'|'phosphor'|'tabler'; style:'outline'|'filled'|'duotone'; strokeWidth:number };
  component: ComponentTokens;
}
type Scale = Record<50|100|200|300|400|500|600|700|800|900|950, string>; // OKLCH strings
```
Rules:
- All mutations go through a reducer / `updateTokens(path, value)` so history (undo/redo) works.
- Validate with **Zod** on load/import; migrate older `schemaVersion` with a `migrate()` function.

## 2. Color system

### 2.1 Generating a scale (OKLCH)
- Use the **`culori`** library (OKLCH conversion, gamut mapping, contrast helpers).
- Input: one brand color. Output: 11 steps with perceptually even lightness.
```ts
// L targets for 50→950 (OKLCH lightness 0..1)
const L = [0.97,0.93,0.86,0.78,0.70,0.62,0.54,0.46,0.38,0.30,0.22];
// Chroma: peak near 500–600, taper at both ends; clamp to sRGB gamut (culori.clampChroma / toGamut('rgb'))
```
- Keep **hue constant** (optionally shift ±4° toward warm/cool at extremes for richness).
- Neutrals: use the brand hue at chroma 0.005–0.015 so grays feel "tinted", not dead.
- Semantic colors (success/warning/danger/info): fixed hues (≈145/85/25/240 in OKLCH), chroma tuned per personality.

### 2.2 Harmony options
Complementary, analogous, triadic, split-complementary, monochrome. Compute in OKLCH (not HSL) so lightness stays consistent. Let users **lock** a color and regenerate others.

### 2.3 Semantic roles (light + dark)
| Role | Light mapping (example) | Dark mapping (example) |
|---|---|---|
| `bg.default` | neutral.50 | neutral.950 |
| `bg.surface` | white / neutral.100 | neutral.900 |
| `bg.elevated` | white | neutral.800 |
| `fg.default` | neutral.900 | neutral.50 |
| `fg.muted` | neutral.600 | neutral.400 |
| `border.default` | neutral.200 | neutral.700 |
| `action.primary` | brand.600 | brand.400 |
| `action.primary.fg` | on-color (auto: white/black by contrast) | auto |
| `action.primary.hover` | brand.700 | brand.300 |
| `focus.ring` | brand.500 (≥ 3:1 vs adjacent) | brand.300 |
| `status.success/warning/danger/info` + `.bg` + `.fg` | mapped | mapped |

**Dark mode is NOT simple inversion.** Generate dark semantic mapping separately: lower chroma slightly, avoid pure `#000`/`#fff` (use neutral.950 / neutral.50), raise elevation lightness (not shadows) to show depth.

### 2.4 Contrast engine (computed, never hardcoded)
```ts
import { wcagContrast } from 'culori';
export const ratio = (fg: string, bg: string) => wcagContrast(fg, bg);

export function grade(r: number, large = false) {
  if (r >= 7)   return 'AAA';
  if (r >= 4.5) return large ? 'AAA' : 'AA';
  if (r >= 3)   return large ? 'AA' : 'Fail';
  return 'Fail';
}
// Auto-fix: step lightness toward more contrast in 0.01 OKLCH-L increments until ratio ≥ target (4.5 normal, 3 UI/large)
export function nudgeToContrast(fg: string, bg: string, target = 4.5): string { /* loop, keep hue & chroma */ }
```
**Audit pairs (minimum):** fg/bg, muted/bg, primary-fg/primary, link/bg, border/bg (UI ≥ 3:1), focus-ring/bg (≥ 3:1), each status fg/bg — in **both** light and dark.
Show a table with ratio, grade, and a **"Fix"** button using `nudgeToContrast`.
*Optional:* display APCA Lc as an informational second opinion (WCAG 2.x is still the legal standard).

### 2.5 Colorblind simulation (nice to have)
Toggle in the preview toolbar: protanopia / deuteranopia / tritanopia via SVG `feColorMatrix` filters on the iframe. Warn when status colors rely on hue alone (always pair with icon/text).

## 3. Spacing, radius, shadow, motion

- **Spacing:** base 4 px (or 8). Scale: `[0,4,8,12,16,24,32,48,64,96,128]`. Density option multiplies component padding (airy 1.25×, balanced 1×, compact 0.8×).
- **Radius presets:** `sharp: 0/2/4/6`, `subtle: 2/4/8/12`, `rounded: 6/10/16/24`, `playful: 12/20/28/40` (sm/md/lg/xl); `full: 9999`.
- **Shadow:** generate from one "elevation" choice (flat / soft / crisp / dramatic) using layered shadows with low-alpha **tinted** (brand-hue) color, not pure black.
- **Motion:** `none` → durations 0; `subtle` → 120/200/320 ms, `cubic-bezier(.2,0,0,1)`; `expressive` → 150/280/450 ms + spring for interactive controls (Motion lib `stiffness:280, damping:22`).
  **Always** honor `prefers-reduced-motion: reduce` (fallback to opacity-only/0 ms).
- **Touch targets:** interactive elements ≥ 44×44 px recommended (WCAG 2.2 minimum is 24×24 CSS px, but 44 is the practical standard).

## 4. Components (Step 8)
Per component, define **variants × sizes × states**:
| Component | Variants | Sizes | States |
|---|---|---|---|
| Button | filled, outline, subtle, ghost, destructive | sm, md, lg | default, hover, focus-visible, active, disabled, loading |
| Input / Select / Textarea | outline, filled | sm, md, lg | default, hover, focus, error, disabled, with helper text |
| Card | flat, outlined, elevated | — | default, interactive-hover |
| Badge | solid, subtle, outline | sm, md | neutral, success, warning, danger, info |
| Alert/Toast | subtle, solid | — | info, success, warning, danger |
| Link | inline, standalone | — | default, hover, visited, focus |
Show all of these in `ComponentsShowcase` inside the preview. Each must use only tokens.
Focus style: 2–3 px ring, offset 2 px, contrast ≥ 3:1 (WCAG 2.2 focus appearance spirit).

## 5. Export formats (final list)
| # | Format | File | Notes |
|---|---|---|---|
| 1 | **Tailwind CSS 4 theme** | `theme.css` | `@theme` block + dark overrides |
| 2 | **CSS custom properties** | `tokens.css` | `:root` + `[data-theme="dark"]` / `.dark` |
| 3 | **W3C Design Tokens (DTCG) JSON** | `tokens.json` | `$value`, `$type`, `$description`, aliases like `{color.brand.500}` |
| 4 | **TypeScript definitions** | `tokens.ts` | `as const` + exported types |
| 5 | **shadcn/ui theme** | `shadcn-theme.css` | maps semantic tokens to `--background`, `--foreground`, `--primary`, `--primary-foreground`, `--muted`, `--border`, `--ring`, `--radius`… |
| 6 | **Figma-compatible tokens** | `tokens.studio.json` | Tokens Studio structure (importable into Figma) |
| 7 | **PDF specification** | `design-spec.pdf` | color ramps, contrast audit, type ladder, components, spacing |
| 8 | **Specimen board PNG** | `board@2x.png` | 1600×1000 |
| 9 | **Project file** | `project.dss.json` | full state with `schemaVersion` (re-importable) |
| 10 | **Starter ZIP** | `starter.zip` | all of the above + `README.md` + font install block + sample components |

### 5.1 Tailwind 4 output example
```css
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));

:root {
  --bg: oklch(0.97 0.01 80);
  --fg: oklch(0.22 0.02 60);
  --primary: oklch(0.54 0.16 45);
  --primary-fg: oklch(0.99 0 0);
  --radius: 0.5rem;
}
.dark {
  --bg: oklch(0.22 0.02 60);
  --fg: oklch(0.97 0.01 80);
  --primary: oklch(0.70 0.15 45);
  --primary-fg: oklch(0.20 0.02 60);
}
@theme inline {
  --color-bg: var(--bg);
  --color-fg: var(--fg);
  --color-primary: var(--primary);
  --color-primary-fg: var(--primary-fg);
  --radius-md: var(--radius);
  --font-heading: "Fraunces", ui-serif, Georgia, serif;
  --font-body: "DM Sans", ui-sans-serif, system-ui, sans-serif;
}
```
(`@theme inline` lets Tailwind utilities reference runtime variables so dark mode works.)

### 5.2 DTCG JSON example
```json
{
  "color": {
    "brand": { "500": { "$type": "color", "$value": "#b4532a", "$description": "Primary brand" } },
    "action": { "primary": { "$type": "color", "$value": "{color.brand.600}" } }
  },
  "radius": { "md": { "$type": "dimension", "$value": "8px" } }
}
```
(Hex fallback is used because many tools don't read OKLCH yet. Provide both: OKLCH in CSS, sRGB hex in JSON.)

### 5.3 Exporter requirements
- Each exporter is a **pure function**: `(tokens: DesignTokens) => string | Blob`.
- **Snapshot tests** for every format with a fixed sample token set.
- **Round-trip test:** export JSON → import → deep-equal original.
- **Validation:** Tailwind output compiled in a test with `@tailwindcss/cli`; CSS parsed with `postcss`; DTCG validated against schema; TypeScript output passes `tsc --noEmit`.
- PDF/PNG: generated in-browser (jsPDF, html2canvas) — lazy-load these libs only when Step 11 opens. For PDF include real, computed values.
- Provide **Copy** and **Download** for every format, and **Download all (ZIP)** via JSZip.

## 6. Acceptance checklist (Phase 1 & 5)
- [ ] `DesignTokens` is the only state source; Zod-validated; `schemaVersion` + `migrate()` present.
- [ ] Scale generator produces 11 in-gamut steps for any hex input (unit-tested on 50 random colors).
- [ ] Light + dark semantic maps generated; contrast table computed for both.
- [ ] `nudgeToContrast` fixes any failing pair to ≥ target without changing hue by > 3°.
- [ ] All 10 export formats produced; snapshot + round-trip tests pass.
- [ ] Tailwind output compiles; shadcn export renders shadcn Button correctly (manual check).
- [ ] No literal color values anywhere in templates or components.
