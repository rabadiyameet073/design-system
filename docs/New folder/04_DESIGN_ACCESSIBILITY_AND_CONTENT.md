# 04 — Design, Accessibility & Content

## Accessibility (biggest gap vs. your own claims)
The product sells WCAG-compliant systems, but the studio itself has little a11y work:
- **Only ~12 `aria-*`/`role` attributes in the whole `src`**; 0 in 30 of the 37 component files.
- Only 1 `onKeyDown` handler in components; most clickable cards are likely `div`s/buttons without keyboard semantics.
- **Skip link / `sr-only`**: none. **`:focus-visible` styles**: none found in `index.css`.
- `prefers-reduced-motion` exists in CSS (good) — but Motion/Three.js animations need to honor it in JS too.
- `<img>` without `alt`: up to 11 of 14 (single-line check; verify).
- Modals (`OAuthModal`, `FontPickerModal`, `LegalModal`, Shortcuts) have no focus trap / `aria-modal` / return-focus.
- Sliders and color wheel lack `aria-valuetext`, keyboard arrows, and labels.
- Colour is the only signal in some audit pass/fail states — add icons/text.

**Fix list**
1. Add global `:focus-visible` ring (≥3:1 contrast, 2px) and a "Skip to content" link.
2. Use a headless library (Radix UI / React Aria) for Dialog, Tabs, Slider, Popover — fixes 80% at once.
3. Add `eslint-plugin-jsx-a11y` + `vitest-axe`/Playwright+axe tests per step.
4. Landmarks: `<header>`, `<nav aria-label="Wizard steps">`, `<main>`, live region for toasts (`role="status"`).
5. Make the preview iframe titled (`title="Live website preview"`).
6. Respect reduced motion for the 3D canvas and step transitions in JS.
7. Touch targets ≥ 24×24 px (many `text-xs` + `py-1.5` buttons are smaller).

## False / inconsistent claims to fix
| Where | Claim | Problem |
|---|---|---|
| Landing + Anatomy | "4.8:1 AAA Verified" | AAA normal text needs 7:1; value is hardcoded |
| Landing, Footer, Anatomy | "WCAG 2.1 AA" | App code/docs target **2.2**; be consistent |
| `PROJECT_DOCUMENTATION.md` | 14 steps, "5 deliverables" then lists 6, 12 font pairs but 4 named | Update (docs/01 already flagged these) |
| Docs | "client-side encryption", "0ms", "zero drift" | Remove (docs/01 says so) |
| Anything "cloud sync / real-time cloud" | Local-only | Rename |
| Starter ZIP/Export labels | "10 formats" (WizardNav) vs other counts | Generate the number from the export registry |

## Visual design system of the studio itself
- 63 hardcoded hex in `DesignSystemAnatomy`, 14 in `LiveWebsitePreview`, 14 in `ColorWheelPicker`: use CSS variables from `index.css` so the studio can dogfood its own tokens and support dark mode.
- Heavy use of arbitrary tiny text (`text-[11px]`, `text-xs`) — set minimum 12–14 px for body/labels.
- Add consistent shared primitives (Button, Card, Badge, Field) — currently each step re-styles inline Tailwind classes.
- Dark mode: `D` key toggles it, but landing/anatomy hex colors won't follow.
- Motion: define 3 motion tokens (fast/base/slow) and reuse the spring config in one place.

## Responsive / mobile
- Test at 320, 375, 768, 1024, 1440. Dock-based mobile layout hides the preview; add bottom-sheet preview.
- Wizard step pills (11) overflow on narrow screens — use a scrollable stepper or a "Step 5/11" dropdown.
- Color wheel needs pointer-events + touch support checks (`touch-action: none`).

## Internationalization
- No i18n framework; all strings hardcoded in English. Step 2 mentions "scripts/languages" for the *user's* site but the studio is English-only.
- Add `react-i18next` or Paraglide; start with extracting strings; check RTL for the preview (`dir="rtl"` option).

## Content & copy
- Voice is dense/jargon-heavy ("OKLCH scales", "semantic mapping") for a *founder-first* tool. Add plain-language subtitles and tooltips ("Why this matters").
- Add empty/error states with friendly copy and a next action.
- Add microcopy for each step: "~2 min", "What you'll get", "You can change this later".
- SEO: single-page app with one `<title>`; add prerender/OG per route and a real `og:image` (1200×630, not the 1 MB logo).
