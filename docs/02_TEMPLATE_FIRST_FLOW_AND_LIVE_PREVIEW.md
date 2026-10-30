# 02 — TEMPLATE-FIRST FLOW & LIVE PREVIEW

## 1. The product idea (what must happen)
1. User lands in the wizard. **First question: "What kind of website is your design system for?"**
2. User picks a **category** (8) and then a **genre** (32). A **template for that category opens immediately** in the preview pane.
3. Each following step shows options on the left. **Hovering/tapping an option previews it live** on the template. Clicking **Apply** commits it. Then **Next**.
4. At every moment the user can switch **phone / tablet / desktop** and **light / dark**.

## 2. Screen layout
```
┌───────────────────────────────────────────────────────────────────────┐
│ Header: logo • project name • save status • undo/redo • export         │
├──────────────────────────┬────────────────────────────────────────────┤
│ LEFT: Step panel (45%)   │ RIGHT: Live preview (55%)                  │
│  - Step title + help     │  Toolbar: [📱][▭][🖥]  [☀/🌙]  A11y: 12✓ 0✗  │
│  - Options / controls    │  Ribbon: Category • Genre • "Previewing: X"│
│  - [Preview] [Apply]     │  ┌──────────────────────────────────────┐  │
│  - [Back]  [Next]        │  │  <iframe> template for this genre    │  │
│                          │  └──────────────────────────────────────┘  │
└──────────────────────────┴────────────────────────────────────────────┘
Mobile/tablet (<1024px): bottom dock toggles [✏️ Questions] / [👁 Live site].
```

## 3. Preview architecture (IMPORTANT)

### 3.1 Why an iframe
Tailwind responsive classes (`md:`, `lg:`) react to the **viewport**. A `div` resized to 375px does NOT trigger them. Therefore:
- Render the template in an **iframe** whose width is set to 375 / 768 / 1280+.
- The iframe loads a same-origin route (e.g. `/preview-frame`) that renders the template.
- The studio sends tokens via `postMessage`; the iframe applies them as CSS variables on `:root`.

### 3.2 Message protocol
```ts
// studio → preview
type ToPreview =
  | { type: 'INIT'; genreId: string; tokens: DesignTokens; mode: 'light'|'dark' }
  | { type: 'TOKENS'; tokens: DesignTokens }            // committed or previewed
  | { type: 'MODE'; mode: 'light'|'dark' }
  | { type: 'SCROLL_TO'; sectionId: string };            // jump to the section relevant to the step

// preview → studio
type FromPreview =
  | { type: 'READY' }
  | { type: 'A11Y_RESULT'; pass: number; fail: number; issues: A11yIssue[] };
```
- Validate `event.origin === window.location.origin` on both sides.
- Throttle `TOKENS` to one per animation frame (`requestAnimationFrame`).
- In the iframe: `tokensToCssVars(tokens)` → set on `document.documentElement.style`.

### 3.3 Preview vs commit state
```ts
interface WizardState {
  genreId: string | null;
  committed: DesignTokens;          // what the user has applied
  draft: Partial<DesignTokens> | null; // what the user is hovering/previewing
  history: DesignTokens[];          // for undo
  future: DesignTokens[];           // for redo
  stepIndex: number;
}
const effectiveTokens = merge(committed, draft ?? {});   // sent to the preview
```
Rules:
- `hover` (desktop) or `tap` (mobile) an option → `draft` set → preview updates, ribbon shows **"Previewing: Warm Editorial — [Apply] [Cancel]"**.
- `Apply` → `draft` merged into `committed`, pushed to `history`.
- Leaving a step with an un-applied draft → ask "Apply preview or discard?" (or auto-discard with toast "Preview discarded").
- **Next** is enabled when the step has a committed value OR a default preset was auto-applied (user may skip).
- Persist `committed` + `stepIndex` to `localStorage` on every commit (debounced 300 ms).
- Respect `prefers-reduced-motion` for the "✨ Site Updated" flash.

### 3.4 Auto-scroll to relevant section
Each step declares `focusSection` (e.g. Typography → `hero` + `article`; Components → `components-showcase`; Color → `hero` + `pricing`). On preview/apply, send `SCROLL_TO`.

## 4. Template system: 8 templates × 32 genre configs
Do NOT write 32 separate sites. Write **8 category templates** built from reusable **sections**, and let each **genre config** change the copy, section order, images, and default presets.

### 4.1 Folder structure
```
src/preview/
  PreviewFrame.tsx            # route: /preview-frame (iframe entry)
  tokens/applyTokens.ts       # tokens → CSS variables
  sections/                   # reusable, token-only components
    Header.tsx  Hero.tsx  FeatureGrid.tsx  ProductGrid.tsx  PricingTable.tsx
    Testimonials.tsx  FAQ.tsx  Gallery.tsx  ArticleList.tsx  ArticleBody.tsx
    BookingWidget.tsx  CourseCards.tsx  ProjectGrid.tsx  StatsRow.tsx
    ComponentsShowcase.tsx    # buttons, inputs, badges, alerts with all states
    TypeSpecimen.tsx          # H1–H6, body, caption, code
    Footer.tsx
  templates/
    commerce.tsx saas.tsx portfolio.tsx publishing.tsx
    hospitality.tsx education.tsx architecture.tsx finance.tsx
  genres/
    index.ts                  # 32 GenreConfig objects
    copy/*.json               # placeholder copy per genre
  assets/                     # local compressed images (WebP/AVIF), license-safe
```

### 4.2 Types
```ts
type CategoryId = 'commerce'|'saas'|'portfolio'|'publishing'|'hospitality'|'education'|'architecture'|'finance';

interface GenreConfig {
  id: string;                       // 'fashion-store'
  category: CategoryId;
  label: string;
  sections: SectionRef[];           // ordered list; overrides template default
  copyFile: string;                 // placeholder text
  heroImage: string;
  defaults: Partial<DesignTokens>;  // genre-appropriate starting preset
  fontRecommendationTags: string[]; // used by doc 03 engine, e.g. ['luxury','editorial']
  density: 'airy'|'balanced'|'compact';
  componentPack: string[];          // which component showcases to include
}
interface SectionRef { id: string; component: keyof typeof SECTION_REGISTRY; props?: Record<string, unknown> }
```

### 4.3 Hard rules for template code
- ❌ No hex colors, no `px` font sizes, no hardcoded `font-family`, no fixed radii in templates.
- ✅ Use semantic tokens only: `bg-[var(--color-bg)]`, or Tailwind classes mapped through `@theme inline` (`bg-surface`, `text-fg`, `rounded-md`, `font-heading`).
- ✅ Every template ends with **ComponentsShowcase** and **TypeSpecimen** so every token change is visible somewhere.
- ✅ Images are local, optimized, with `alt` text and explicit width/height (no layout shift).
- ✅ Each section has an `id` for `SCROLL_TO`.

### 4.4 Category → sections
| Category | Genres (examples) | Template sections |
|---|---|---|
| **Commerce** | Fashion, Electronics, Beauty, Marketplace | AnnouncementBar, Header+Cart, Hero, CategoryGrid, ProductGrid, ProductDetail, Reviews, Newsletter, Footer |
| **SaaS** | Dashboard app, Dev tool, AI product, B2B platform | Header, Hero+ProductShot, LogoCloud, FeatureGrid, Pricing, Testimonials, FAQ, CTA, MiniDashboard, Footer |
| **Portfolio** | Designer, Photographer, Developer, Agency | MinimalNav, HeroStatement, ProjectGrid, CaseStudy, About, Contact |
| **Publishing** | Blog, Magazine, News, Newsletter | Masthead, FeaturedStory, ArticleList, **ArticleBody (type stress test)**, Newsletter, Footer |
| **Hospitality** | Hotel, Restaurant, Café, Travel | FullBleedHero, BookingWidget, Rooms/Menu, Gallery, Reviews, Location, Footer |
| **Education** | Online course, School, University, Coaching | Hero, CourseCards, Curriculum(Accordion), Instructor, Pricing, FAQ, Footer |
| **Architecture & Real estate** | Studio, Property listing, Interior design | FullBleedHero, ProjectIndex, ProjectDetail, Team, Contact |
| **Finance** | Fintech app, Bank, Insurance, Investing | Hero+Trust, RatesCalculator, Features, Security/Compliance, Stats, FAQ, Disclaimers |

## 5. Step definitions (what each step controls)
Each step module exports a `StepDefinition`:
```ts
interface StepDefinition {
  id: string; title: string; help: string;
  focusSection: string;                 // preview section to scroll to
  tokenPaths: string[];                 // which DesignTokens paths this step edits
  Component: React.FC<StepProps>;
  isComplete(state: WizardState): boolean;
}
```

| # | Step | Left-panel controls | Preview reaction | Token paths |
|---|---|---|---|---|
| 1 | Category & Genre | 8 category cards → 32 genre chips, each with a thumbnail | Template swaps to the genre's template | `meta.genreId` |
| 2 | Project & Business | Name, goal, audience, offering, trust, **scripts**, platform, dark-mode need | Header logo text, hero copy update; font filter set | `meta.*` |
| 3 | Brand Personality | 5 sliders (energy, craft, voice, formality, density) | Preview shifts via suggested preset chips (not auto-applied) | `meta.personality` |
| 4 | Visual Direction | 6–8 style cards (Minimal Editorial, High-Velocity Tech, Brutalist Swiss, Warm Terracotta, Organic Modern, Luxury Noir…) | Applies bundle: palette hint + radius + shadow + type tags | many (bundle) |
| 5 | Color | Start-from (brand/logo/preset), wheel, harmony, scale viewer, semantic roles, dark preview | Colors recolor everything; A11y badge updates | `color.*` |
| 6 | Typography | Role-based font picker (doc 03), scale ratio, base size | Fonts + sizes change; scroll to hero + article | `typography.*` |
| 7 | Shape & Layout | Radius, density, container width, grid, borders, elevation | Cards, buttons, spacing change | `radius.*`, `space.*`, `layout.*`, `shadow.*` |
| 8 | Components | Button/card/input/badge/alert variants, sizes, states | ComponentsShowcase + real usage update | `component.*` |
| 9 | Imagery, Icons & Motion | Image treatment (overlay, grain, radius), icon set/style, motion level | Hero image + icons + hover/transition feel | `imagery.*`, `icon.*`, `motion.*` |
| 10 | Review & Audit | Summary of all decisions, A11y table, responsive check, dark check, "Fix issues" | All three viewports side-by-side option | — |
| 11 | Export | Format cards, download all, copy buttons, project JSON | — | — |

## 6. Option-card UX spec
- Each option is a card with a **mini visual** (swatch strip, font sample "Aa", radius sample, etc.), name, and one-line "best for".
- Desktop: `onPointerEnter` → preview (debounce 80 ms), `onPointerLeave` → clear draft (unless pinned). Click → **pin** + show **Apply**.
- Touch: tap = preview + pinned; Apply button appears sticky at the bottom of the panel.
- Keyboard: arrow keys move through options (preview), `Enter` applies. Visible focus ring.
- Always show **"Recommended for [Genre]"** badge on 1–3 options (from `GenreConfig.defaults` and personality).
- **Compare (A/B):** pin option A, hover option B, toggle with a button/`C` key.
- **Reset to preset** button per step.

## 7. Personality → preset mapping (simple, deterministic)
```ts
// Each slider is -1..+1
function suggestPreset(p: Personality): PresetBundle {
  const calm = p.energy < 0;           // calm vs energetic
  const artisanal = p.craft < 0;       // artisanal vs computational
  const poetic = p.voice < 0;          // poetic vs direct
  return {
    typeTags: [artisanal ? 'serif' : 'geometric', poetic ? 'editorial' : 'neutral', calm ? 'soft' : 'bold'],
    radius:   calm && artisanal ? 'rounded' : (artisanal ? 'subtle' : 'sharp'),
    saturation: calm ? 0.08 : 0.18,    // OKLCH chroma target
    motion:   calm ? 'subtle' : 'expressive',
    density:  p.density < 0 ? 'airy' : 'compact',
  };
}
```
Show 2–3 suggested bundles as cards in Step 4; never auto-apply without the user's action.

## 8. Acceptance checklist (Phases 2–3)
- [ ] Picking a category opens the right template in < 300 ms.
- [ ] 8 templates exist; all 32 genres resolve to a valid config.
- [ ] No hex/px/font-family literals in `src/preview/**` (add an ESLint rule or CI grep).
- [ ] Phone viewport triggers true mobile layout (verify in an e2e test).
- [ ] Hover preview, Apply, Cancel, Undo, Redo all work and are keyboard accessible.
- [ ] Iframe messages validate origin; throttled to 1/frame.
- [ ] Reloading the page restores the project and step.
