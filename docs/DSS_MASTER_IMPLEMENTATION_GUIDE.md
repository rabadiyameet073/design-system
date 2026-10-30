# DESIGN SYSTEM STUDIO — MASTER IMPLEMENTATION GUIDE (All-in-One)

> Combined version of documents 00–05. Give this single file to your coding agent, or give the separate files.


---

# 00 — AGENT README (Read This First)

You are the coding agent implementing the **next version of Design System Studio (DSS)**.
The existing project is a React 19 + TypeScript + Vite + Tailwind CSS 4 wizard (14 steps, split-screen live preview, 5+ exports).
This documentation set tells you **what to change, what to add, what to remove, and in what order**.

## Documents (read in this order)
| File | Purpose |
|---|---|
| `01_PRODUCT_REVIEW_AND_ROADMAP.md` | Industry reality check, audit of the current project, step-by-step keep/merge/remove decisions, phases |
| `02_TEMPLATE_FIRST_FLOW_AND_LIVE_PREVIEW.md` | New flow: user picks a website category FIRST → template opens → every choice updates it live → preview-then-apply → next |
| `03_TYPOGRAPHY_FONT_SYSTEM.md` | Font API, font roles (heading/body/ui/mono), recommendation engine, loading, export |
| `04_TOKENS_COLOR_A11Y_EXPORT.md` | Token architecture, color science, accessibility, export formats |
| `05_QA_SECURITY_DEPLOY_AND_AGENT_PROMPTS.md` | Testing, security, performance, deployment, and the phase-by-phase prompts |

## Working rules for the agent
1. **Do not rewrite the whole app.** Refactor incrementally. After every phase: `npm run lint` and `npm run build` must pass with zero errors.
2. **One phase at a time.** Finish a phase's acceptance checklist before starting the next. Commit after each phase.
3. **Single source of truth.** All design decisions live in ONE typed `DesignTokens` object (see doc 04). The live preview, the review screen, and every exporter read from it. No component may hardcode a color, font, radius, or spacing value in the preview templates.
4. **No fake numbers.** Every contrast ratio, file-size estimate, or score shown in the UI must be *computed*, never a hardcoded string.
5. **Keep the studio UI separate from the preview UI.** The studio chrome (wizard, buttons, panels) uses fixed, own styles. Only the preview (inside an iframe) uses the user's tokens.
6. **Every new util gets a unit test** (Vitest). Every step gets at least one e2e test (Playwright) by Phase 6.
7. **Accessibility is a requirement, not a polish item.** Keyboard operable, visible focus, `prefers-reduced-motion` respected, in both the studio and exported output.
8. If something in these docs conflicts with the existing code, **prefer these docs**, and note the conflict in `CHANGELOG.md`.

## Definition of Done (whole project)
- [ ] User picks category → genre → matching template opens in the preview immediately.
- [ ] Every wizard choice updates the preview live (hover/tap = preview, Apply = commit).
- [ ] Viewport switcher (phone/tablet/desktop) and light/dark toggle always visible.
- [ ] Fonts are loaded from an API (searchable, filterable), assigned per role, with smart recommendations.
- [ ] Tokens are 3-tier (primitive → semantic → component), exported in all formats, and round-trip tested.
- [ ] WCAG 2.2 AA validated live, with auto-fix suggestions.
- [ ] Projects save locally, can export/import as JSON, schema is versioned.
- [ ] Lint, type-check, unit, e2e, and axe tests all pass in CI.


---

# 01 — PRODUCT REVIEW & ROADMAP

## 1. Where DSS sits in the real industry

**What a real production design system contains** (Material, Carbon, Polaris, Atlassian, Radix, shadcn/ui):
1. **Design tokens** in tiers: primitive → semantic → component.
2. **Components** with all states (default, hover, focus, active, disabled, loading, error), variants and sizes.
3. **Documentation** (usage rules, do/don't, accessibility notes).
4. **Accessibility baked in** (contrast, focus, keyboard, ARIA, reduced motion).
5. **Code + design-tool sync** (Figma variables ⇄ code tokens, via Style Dictionary / Tokens Studio).
6. **Versioning & governance** (changelog, semantic versions, deprecation).
7. **Testing** (unit, visual regression, a11y automation).
8. **Distribution** (npm package, CSS file, or copy-paste like shadcn/ui).

**Tools in your space (know your competition):**
- *Realtime Colors* — live color/font preview on a template site (closest to your idea).
- *shadcn/ui themes, tweakcn* — theme generators for shadcn components.
- *Radix Themes* — configurable theme panel.
- *Coolors, Huemint, Fontjoy* — palette / font-pair generators.
- *Style Dictionary, Tokens Studio, Supernova, zeroheight* — token pipelines and docs.

**Your differentiator (protect and sharpen it):**
> A *guided, brand-first* flow for **non-designers/founders**, **starting from a genre-specific template**, producing **production-ready tokens + code** — not just a palette.

Nobody does "pick business type → see a real site for that type → customize the whole system → export code" end-to-end. That is your product. Everything below supports that.

## 2. Honest audit of the current project

### Keep (strong)
- Split-screen live preview (this is the core value).
- Step-based guided flow and mathematical approach (modular scale, OKLCH, fluid `clamp`).
- Multi-format export, PDF spec, specimen board.
- Strict TypeScript, Tailwind 4 `@theme`, accessibility-first philosophy.

### Fix / risky claims
| Issue | Why it matters | Action |
|---|---|---|
| "0ms latency", "zero drift" | Not provable; erodes trust | Rewrite as "instant updates", "single source of truth" |
| "client-side encryption" of `localStorage` | Key lives in the same browser → no real protection; gives false security | Remove the claim; store plain JSON, offer export/import. Encrypt only if there is a real server-side key/account |
| "Verified 8.4:1 AAA" hardcoded in Anatomy section | Must be computed | Compute from real colors with the WCAG formula |
| WCAG **2.1** | Current is **2.2** (adds focus-appearance and target-size rules, 24×24 CSS px min) | Target WCAG 2.2 AA |
| "5 export formats" but 6 listed | Inconsistent docs | Fix counts; see doc 04 for final list |
| Q10/Q12 names differ between diagram and list | Confusing | Use the names in §4 below |
| "12 typography pairs" but 4 named | Hand-picked pairs don't scale | Replace with font API + recommendation engine (doc 03) |
| Typo `d:/desing system/` | Cosmetic | Rename folder `design-system-studio` |
| Google OAuth + cloud sync in MVP | High complexity, security surface | Phase it: local-first MVP, accounts in Phase 7 |
| Mobile preview likely a resized `div` | Tailwind `md:` breakpoints depend on **viewport**, not container width, so a narrow `div` will NOT trigger mobile styles | Render preview in an **iframe** (see doc 02) |
| 32 genres = 32 templates? | Unmaintainable | **8 category templates × genre configs** (see doc 02) |
| Three.js on the home page | ~600 KB+ and hurts mobile performance | Lazy-load + code-split; optional on low-power devices |

## 3. What the real industrial workflow looks like (and how DSS maps to it)

| Industry stage | Typical real world | DSS equivalent |
|---|---|---|
| Discovery | Brand workshop, audience research | Steps 2–3 |
| Brand direction | Moodboards, style tiles | Steps 3–4 |
| Foundations | Color, type, spacing, radius, elevation, motion tokens | Steps 5–7, 9 |
| Components | Button/input/card library with states | Step 8 |
| Validation | Contrast audit, responsive check, dark mode | Step 10 (+ always-on checks) |
| Handoff | Figma variables + code tokens + docs | Step 11 |
| Maintenance | Versioned package, changelog | Project versioning + import/export |

## 4. New step structure (14 → 11, plus always-on tools)

| # | New step | Replaces | Decision |
|---|---|---|---|
| 1 | **Category & Genre (template opens)** | old Step 2 (moved to FIRST) | MOVED + upgraded |
| 2 | **Project & Business** | old Steps 1 + 3 | MERGED (name, goal, audience, offering, trust signals, scripts/languages, platform) |
| 3 | **Brand Personality** | old Step 4 | KEEP, now generates preset suggestions |
| 4 | **Visual Direction** | old Step 5 | KEEP, sets defaults for radius/shadow/density/imagery |
| 5 | **Color Studio** | old Step 6 | KEEP, expanded (doc 04) |
| 6 | **Typography Studio** | old Step 7 | REBUILT with font API and roles (doc 03) |
| 7 | **Shape, Spacing & Layout** | old Step 9 | KEEP, add elevation/borders |
| 8 | **Components** | old Step 10 | KEEP, add states |
| 9 | **Imagery, Icons & Motion** | old Step 8 | EXPANDED (icon set, motion tokens) |
| 10 | **Review & Audit** | old Steps 11 + 12 + 13 | MERGED |
| 11 | **Export** | old Step 14 | KEEP |

**Removed as separate steps (became always-on):**
- *Mobile Test* → permanent **viewport switcher** (phone/tablet/desktop) above the preview.
- *Themes & Accessibility* → permanent **light/dark toggle** + live **A11y badge** (pass/fail count) on every step; full table in Step 10.

**Why:** fewer steps = higher completion rate. Anything the user must *check* should be visible *continuously*, not placed in a late step.

## 5. Questions to ADD (per step)
- **Step 2 Project & Business:** brand name; one-line description; primary goal; audience age range (older audiences → larger text, higher contrast defaults); **languages/scripts needed** (Latin, Devanagari, Gujarati, Arabic, CJK… this filters fonts); existing brand color or logo upload (extract color); 2–3 inspiration URLs or "sites I like" (optional); platform target (web only / web + app); framework target (Tailwind 4 / plain CSS / shadcn); dark mode required? (yes/no/auto).
- **Step 3 Personality:** keep the 3 sliders; add *Formality* (casual ↔ formal) and *Density* (airy ↔ compact). Each slider drives presets (see doc 02 §7).
- **Step 5 Color:** "start from": brand color / logo / preset family / AI-style prompt ("calm, trustworthy, warm").
- **Step 9:** icon style (outline/filled/duotone) + library (Lucide, Phosphor, Tabler), motion level (none / subtle / expressive).

## 6. Questions/features to REMOVE or simplify
- Separate "Mobile Test" and "WCAG" steps (see above).
- The hardcoded 12-pair font list (replace with API + engine).
- "Business discovery" as a separate long form (shorten; most fields optional).
- OAuth in MVP (Phase 7).
- Claims listed in §2.

## 7. Features to ADD (priority order)
1. **Preview-then-apply** on every option (hover/tap previews; "Apply" commits).
2. **Undo/redo + history**, **A/B compare**, **reset step to preset**.
3. **Project JSON export/import** with `schemaVersion`.
4. **Always-on viewport and dark-mode toggles**, A11y badge.
5. **Auto-fix contrast** ("Nudge to AA").
6. **shadcn/ui theme export** and **Figma Tokens (Tokens Studio) export**.
7. **Shareable preview link** (read-only; Phase 7, needs backend).
8. **Starter ZIP**: tokens + fonts (self-hosted) + sample components + README.
9. **Component states showcase** inside every template.
10. **Multi-script font support** (Devanagari/Gujarati/Arabic/CJK).
11. **Presets/"Start from a style"** so the user can finish in under 5 minutes.
12. **Onboarding + empty states + keyboard shortcuts** (← → steps, Z undo).

## 8. Roadmap (phases with acceptance criteria)

**Phase 0 — Cleanup (0.5 day)**
- Fix naming, folder, doc claims. Remove fake encryption. Add `schemaVersion`.
- ✅ Lint + build pass; CHANGELOG created.

**Phase 1 — Token core refactor (1–2 days)**
- Implement `DesignTokens` type, 3-tier model, `tokensToCssVars()`.
- ✅ Exports read only from `DesignTokens`; unit tests for color math + contrast.

**Phase 2 — Preview engine (2–3 days)**
- Iframe preview, postMessage bridge, viewport + dark toggles, preview/commit state.
- ✅ Changing a token updates the iframe < 100 ms; phone mode triggers real mobile breakpoints.

**Phase 3 — Template-first flow (3–5 days)**
- Step 1 category/genre; 8 templates; genre configs; section registry.
- ✅ Each category opens a visibly different template; all colors/fonts/radii come from tokens.

**Phase 4 — Typography system (2–3 days)**
- Font API route + snapshot fallback, role picker, recommender, loader, guardrails.
- ✅ See doc 03 checklist.

**Phase 5 — Color, shape, components, imagery (3–4 days)**
- Scale generation, semantic mapping, dark mode, component states, motion tokens.
- ✅ See doc 04 checklist.

**Phase 6 — Review, export, QA (3–4 days)**
- Merged review step, all exporters, tests, axe, Lighthouse.
- ✅ Doc 05 checklist.

**Phase 7 — Accounts & sharing (optional, later)**
- Google sign-in, cloud sync, share links, team projects.


---

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


---

# 03 — TYPOGRAPHY & FONT SYSTEM

## 1. What the industry actually does
- Most production sites use **1–2 font families** (often **one variable family** with different weights), plus **optional monospace** for code. A third family is rare and only for a special "accent" (logo-like headings, quotes).
- Examples: Material → Roboto; IBM Carbon → IBM Plex (Sans/Serif/Mono); Shopify Polaris → Inter; Atlassian → custom sans + mono.
- **Roles, not "fonts everywhere".** Each *role* has its own family, weight, size, line-height, letter-spacing, and case.

### Roles (the model your app must implement)
| Role | Used for | Typical choice | Notes |
|---|---|---|---|
| `display` | Hero titles, big numbers | Same as heading or an expressive font | Optional; only if different from heading |
| `heading` | H1–H4 | Serif/geometric/grotesk with character | Weights 500–700 |
| `body` | Paragraphs, long text | Highly readable sans/serif | Must have 400 + 700 (italic nice-to-have) |
| `ui` | Buttons, nav, inputs, labels, tables | Usually same as body, weights 500–600 | Keeps UI crisp |
| `mono` | Code, data, tags | JetBrains Mono, IBM Plex Mono | Optional |
| `accent` | Quotes, taglines | Italic serif / script | Optional; max 1 per site |

**Defaults:** `display = heading`, `ui = body`, `accent = null`, `mono = null`. So a normal user picks **2 fonts** and everything is assigned. Advanced users can override each role.

## 2. Data model
```ts
type FontRole = 'display'|'heading'|'body'|'ui'|'mono'|'accent';
type FontCategory = 'serif'|'sans-serif'|'display'|'handwriting'|'monospace';

interface FontMeta {
  family: string;
  category: FontCategory;
  variants: string[];            // '400','700','italic','700italic'…
  subsets: string[];             // 'latin','devanagari','gujarati','arabic'…
  variable: boolean;
  axes?: { tag: string; min: number; max: number }[];   // e.g. wght 100–900
  popularityRank?: number;
  source: 'google' | 'fontsource' | 'system' | 'custom';
}

interface RoleStyle {
  family: string;                // 'Fraunces'
  fallback: string[];            // ['ui-serif','Georgia','serif']
  weight: number;                // 600
  lineHeight: number;            // 1.15
  letterSpacing: string;         // '-0.02em'
  textTransform?: 'none'|'uppercase'|'capitalize';
}

interface TypographyTokens {
  roles: Record<FontRole, RoleStyle | null>;
  baseSizePx: number;            // 16 minimum for body
  scaleRatio: 1.2 | 1.25 | 1.333 | 1.5 | 1.618;
  fluid: { minVw: number; maxVw: number };  // 360 → 1280
  scale: Record<'xs'|'sm'|'base'|'lg'|'xl'|'2xl'|'3xl'|'4xl'|'5xl'|'6xl', { minPx: number; maxPx: number; css: string }>;
  scripts: string[];             // user's required scripts from Step 2
}
```

## 3. Where the font list comes from (API)

### Option A (recommended): Google Fonts Developer API, proxied by your server
- Endpoint: `https://www.googleapis.com/webfonts/v1/webfonts?key=YOUR_KEY&sort=popularity`
- Returns for each family: `family`, `category`, `variants`, `subsets`, `version`, `files`.
- **Never expose the API key to the browser.** Add a route:
  - `GET /api/fonts` → fetches (or reads cache), returns a trimmed list.
  - Cache in memory/Vercel KV/edge for 24 h (`Cache-Control: s-maxage=86400, stale-while-revalidate`).
  - **Fallback:** if the API fails or the key is missing, serve `src/data/fonts.snapshot.json` (top ~300–500 families, regenerated by a script `npm run fonts:snapshot`).
- Check the official docs for the current parameters (e.g. variable-font capability filters) before relying on them.

### Option B: Fontsource
- Open-source packages (`@fontsource/<id>`, `@fontsource-variable/<id>`) and a public metadata API (`https://api.fontsource.org/v1/fonts`).
- Great for **self-hosted** delivery in the exported starter project (no runtime call to Google).

### Option C: Static snapshot only
- Simplest/offline. Ship the JSON; regenerate periodically.

**Recommended combo:** metadata from Option A (fallback C) for *browsing*; **Fontsource for the exported code** so users self-host fonts (better privacy/GDPR posture and performance than runtime Google calls).

### Server route sketch
```ts
// api/fonts.ts (Express/Vercel)
export default async function handler(req, res) {
  try {
    const key = process.env.GOOGLE_FONTS_API_KEY;
    if (!key) throw new Error('no key');
    const r = await fetch(`https://www.googleapis.com/webfonts/v1/webfonts?key=${key}&sort=popularity`);
    if (!r.ok) throw new Error('upstream');
    const data = await r.json();
    const list = data.items.map((f: any, i: number) => ({
      family: f.family, category: f.category, variants: f.variants,
      subsets: f.subsets, popularityRank: i + 1,
      variable: f.variants?.length > 0 && !!f.axes, axes: f.axes, source: 'google',
    }));
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=604800');
    res.json(list);
  } catch {
    res.setHeader('Cache-Control', 's-maxage=3600');
    res.json(require('../src/data/fonts.snapshot.json'));
  }
}
```
(Add input validation, rate-limiting, and a 5 s upstream timeout.)

## 4. Loading fonts for preview
- Build a CSS URL per family: `https://fonts.googleapis.com/css2?family=Fraunces:wght@400;600;700&display=swap`.
- **In the picker list** (hundreds of rows): lazy-load with `IntersectionObserver`, and use the `&text=` parameter so each row downloads only the glyphs of its sample text/its own name. Never load all fonts at once.
- **In the preview iframe:** inject a `<link rel="stylesheet">` only for the **families currently selected** (committed + previewed), with the needed weights only.
- Remove `<link>`s for fonts no longer in use. Debounce while the user hovers quickly (150 ms).
- Show a **skeleton/fallback** until `document.fonts.load('600 1em "Fraunces"')` resolves (avoid flash of wrong font).
- Use `font-display: swap`.

## 5. Picker UI (Step 6)

```
┌ Typography ───────────────────────────────────────────┐
│ [Recommended]  [Browse all]                            │
│ Mode: (•) Pair mode   ( ) Advanced (per-role)          │
│                                                        │
│ Heading font:  [ Fraunces ▾ ]   ← click opens picker   │
│ Body font:     [ DM Sans  ▾ ]   (auto-suggested)       │
│ Weights: heading 600 • body 400/700                    │
│                                                        │
│ Scale ratio: ○1.2 ○1.25 ●1.333 ○1.5 ○1.618   Base 16px │
│ Performance: 2 families • 5 files • ~74 KB  ✅         │
└────────────────────────────────────────────────────────┘
```

**Picker modal:** search box; filters (category, script, "variable only", "has ≥ 4 weights"); sort (popularity/alphabetical/trending); editable sample text ("Type your headline…"); virtualized list (`@tanstack/react-virtual`); keyboard navigation; hover = preview in the site, click = select.

**Pair mode (default, best for founders):**
1. User picks the **heading** font (or accepts a recommendation).
2. App instantly lists **3–6 recommended body fonts** that pair well.
3. User picks one → all roles auto-assigned (`display=heading`, `ui=body`).
4. Optional: "Add monospace" / "Add accent" toggles.

**Advanced mode:** one selector per role, same picker, plus weight/line-height/letter-spacing per role.

## 6. Recommendation engine
Two layers: **curated pairs** (high quality) + **rule-based scoring** (covers the long tail).

### 6.1 Hard filters (must pass)
- Font supports **all scripts** from Step 2 (`subsets ⊇ scripts`). For Indian-language sites prefer families like *Noto Sans/Serif Devanagari/Gujarati*, *Hind*, *Mukta*, *Poppins* (Devanagari), etc.
- Body role: category ∈ {sans-serif, serif}; **not** `display`/`handwriting`; has weights 400 and 700.
- Mono role: category = monospace.

### 6.2 Scoring
```ts
function scorePair(h: FontMeta, b: FontMeta, ctx: { tags: string[]; pairs: CuratedPair[] }): number {
  let s = 0;
  const curated = ctx.pairs.find(p => p.heading === h.family && p.body === b.family);
  if (curated) s += 50;
  // contrast principle: pair different categories, avoid two similar ones
  if (h.category !== b.category) s += 15;
  if (h.category === b.category && h.family !== b.family) s -= 15;   // two near-identical sans = muddy
  if (h.family === b.family) s += 8;                                // single-family system is always safe
  // body quality
  if (b.variants.includes('regular') && b.variants.includes('700')) s += 5;
  if (b.variants.includes('italic')) s += 3;
  if (b.variable) s += 3;
  // popularity = proven readability
  s += Math.max(0, 10 - (b.popularityRank ?? 999) / 30);
  // genre/personality tags overlap
  s += 6 * intersection(ctx.tags, tagsFor(h)).length;
  s += 4 * intersection(ctx.tags, tagsFor(b)).length;
  return s;
}
```
- Sort descending, take top 6, ensure variety (not 6 near-duplicates).
- Keep `tagsFor(font)` in `src/data/fontTags.ts` (`'luxury'|'editorial'|'tech'|'friendly'|'geometric'|'humanist'|'playful'|'formal'|'minimal'|'bold'`) for ~80 popular families; unknown fonts get tags from category.

### 6.3 Curated starting pairs (all on Google Fonts)
| Genre / vibe | Heading | Body | Mono (opt.) |
|---|---|---|---|
| Luxury hospitality, editorial | Fraunces / Playfair Display / Cormorant Garamond | DM Sans / Inter | — |
| SaaS, dev tools | Geist / Inter / Plus Jakarta Sans | Same family | JetBrains Mono / Geist Mono |
| Tech / futuristic | Michroma / Space Grotesk | Plus Jakarta Sans / Inter | JetBrains Mono |
| Portfolio, creative | Syne / Bricolage Grotesque | Inter | — |
| Publishing, magazine | Newsreader / Source Serif 4 / Instrument Serif | Inter | — |
| Finance, trust | IBM Plex Sans (+ Plex Serif for headings) | IBM Plex Sans | IBM Plex Mono |
| Education, friendly | Nunito / Outfit | Lexend / Atkinson Hyperlegible | — |
| Commerce, modern | Manrope / DM Sans | Inter | — |
| Architecture, minimal | Outfit / Inter Tight | Inter | — |
| Warm artisanal | Fraunces | Plus Jakarta Sans / Nunito Sans | — |

> Verify each family still exists in the API at build time; if missing, skip the pair silently.

## 7. Type scale & fluid sizing
```ts
const STEPS = { xs:-2, sm:-1, base:0, lg:1, xl:2, '2xl':3, '3xl':4, '4xl':5, '5xl':6, '6xl':7 } as const;

export function scaleSize(basePx: number, ratio: number, step: number) {
  return basePx * Math.pow(ratio, step);
}

// Linear interpolation between two viewport widths → CSS clamp()
export function fluid(minPx: number, maxPx: number, minVw = 360, maxVw = 1280) {
  const slope = (maxPx - minPx) / (maxVw - minVw);        // px per px of viewport
  const intercept = minPx - slope * minVw;                 // px
  return `clamp(${(minPx/16).toFixed(3)}rem, ${(intercept/16).toFixed(4)}rem + ${(slope*100).toFixed(4)}vw, ${(maxPx/16).toFixed(3)}rem)`;
}
```
- Compute `minPx` using a **smaller ratio** (e.g. 1.2) and `maxPx` using the user's ratio, so mobile is calmer than desktop.
- Snap rounded results to 0.5 px (or to the 4 px grid for line heights).
- Defaults per role: heading line-height 1.1–1.25; body 1.5–1.65; ui 1.2–1.4; letter-spacing: large headings −0.01 to −0.03em, uppercase labels +0.05–0.12em.
- Reading measure for long text: `max-width: 65ch` (45–75 range).

## 8. Guardrails (show as inline warnings, not blockers)
| Condition | Message |
|---|---|
| > 2 families (excluding mono) | "More than 2 font families usually looks inconsistent and slows the page." |
| Total font files > 6 | "Consider fewer weights/styles to keep the page fast." |
| Estimated font payload > 150 KB | Show estimate in red |
| Body size < 16 px | "Body text under 16 px hurts readability on mobile." |
| `display`/`handwriting` category chosen for body | Block with explanation |
| Body font lacks weight 400 or 700 | Block/warn |
| Chosen font lacks a required script | Hide it from the list; show "Not available for Gujarati" tooltip in "show all" mode |
| Heading and body look too similar (same category, different family) | Suggest a contrasting pair |

**Estimating payload:** approximate ~15–30 KB per static woff2 weight (Latin), ~60–120 KB per variable font. Label as "≈ estimate". Don't invent precision.

## 9. Fallback stacks & layout shift
- Always output a fallback stack: serif → `ui-serif, Georgia, 'Times New Roman', serif`; sans → `ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`; mono → `ui-monospace, SFMono-Regular, Menlo, monospace`.
- For production CLS control, generate a **metric-matched fallback** (`size-adjust`, `ascent-override`, `descent-override`) — use `@capsizecss/core` or `fontaine` in the exported starter.
- Export `<link rel="preload" as="font" type="font/woff2" crossorigin>` for the single most important font file (the body regular).

## 10. Export of typography
**Tailwind 4**
```css
@theme {
  --font-heading: "Fraunces", ui-serif, Georgia, serif;
  --font-body: "DM Sans", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
  --text-base: clamp(1rem, 0.96rem + 0.18vw, 1.125rem);
  --text-4xl: clamp(2.2rem, 1.6rem + 2.4vw, 3.8rem);
}
```
**Self-hosted install block** (generated in README):
```bash
npm i @fontsource-variable/fraunces @fontsource-variable/dm-sans
# then in main.tsx:
# import '@fontsource-variable/fraunces'; import '@fontsource-variable/dm-sans';
```
(If a family has no variable package, generate imports for static weights: `@fontsource/<id>/400.css`.)
**Google CDN option:** include the exact `<link>` tag(s) with `display=swap` and only the weights used.
**DTCG JSON:** `typography` group with `fontFamily`, `fontWeight`, `fontSize`, `lineHeight`, `letterSpacing` tokens.

## 11. Licensing & custom fonts
- Google/Fontsource fonts are open-licensed (mostly SIL OFL) — safe for commercial use; include attribution list in the exported README.
- Custom upload (Phase 7): accept `.woff2` only, validate size (< 300 KB), warn "You are responsible for the license", never upload to a shared CDN.

## 12. Acceptance checklist (Phase 4)
- [ ] `/api/fonts` returns a list; works with and without API key (snapshot fallback).
- [ ] Picker: search, category/script filters, virtualized list, lazy font loading, no jank at 500+ rows.
- [ ] Choosing a heading font shows ≥ 3 recommended body fonts in < 200 ms.
- [ ] Roles resolve with defaults; Advanced mode overrides each role.
- [ ] Guardrail warnings appear correctly (unit-tested rules).
- [ ] Preview iframe loads only the used families/weights; no FOUT flash > 1 frame of wrong font after load.
- [ ] Gujarati/Devanagari selection filters out unsupported fonts.
- [ ] Exports include Tailwind, CSS vars, DTCG, TS, Fontsource install block, and fallback stacks.
- [ ] Unit tests: `fluid()`, `scaleSize()`, `scorePair()`, guardrails, script filtering.


---

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


---

# 05 — QA, SECURITY, PERFORMANCE, DEPLOY & AGENT PROMPTS

## 1. Testing strategy
| Layer | Tool | What to test |
|---|---|---|
| Unit | Vitest | color scale, contrast, `nudgeToContrast`, `fluid`, `scaleSize`, `scorePair`, guardrails, token reducer (undo/redo), exporters (snapshots), migrations |
| Component | Testing Library | Option cards (hover/click/keyboard), picker modal, step navigation |
| E2E | Playwright | Full flow: pick genre → color → fonts → export; reload persistence; mobile viewport; keyboard-only run |
| Accessibility | `@axe-core/playwright` | Studio pages AND the preview iframe in light + dark; zero serious/critical violations |
| Visual regression | Playwright screenshots | Each of 8 templates × light/dark × 3 viewports against baseline |
| Performance | Lighthouse CI | Landing + wizard budgets (see §3) |
| Export validation | scripts in CI | Compile Tailwind output, `tsc` the TS export, schema-validate DTCG |

CI (GitHub Actions): `lint → typecheck → unit → build → e2e → axe → lighthouse`. Block merge on failure.

## 2. Security & privacy
- **Remove the "client-side encryption" claim.** Local storage in the same browser can't be protected by a key stored there.
- Secrets (`GOOGLE_CLIENT_SECRET`, `GOOGLE_FONTS_API_KEY`) only on the server; never `VITE_`-prefixed.
- Google OAuth: use the authorization-code flow (with PKCE) or verified ID tokens; verify `aud`, `iss`, `exp` server-side; use `httpOnly`, `Secure`, `SameSite=Lax` session cookies.
- Validate every API input (Zod); rate-limit `/api/*` (e.g. 60 req/min/IP); set sensible CORS (same-origin only).
- Security headers: CSP (allow `fonts.googleapis.com`, `fonts.gstatic.com` only if using the CDN), `X-Content-Type-Options`, `Referrer-Policy`, `frame-ancestors` (preview iframe is same-origin).
- `postMessage`: always check `origin` and message `type`.
- Imported project JSON: validate with Zod, size-limit (e.g. 2 MB), never `eval`/inject as HTML.
- Privacy: no tracking by default; if analytics added, use cookieless (Plausible/Umami) and document it. Prefer self-hosted fonts in exports.
- Dependencies: `npm audit` in CI, Renovate/Dependabot weekly.

## 3. Performance budgets
- Landing: LCP < 2.5 s on mid-range mobile, JS < 250 KB gzip initial.
- Code-split: Three.js (landing only, lazy + `prefers-reduced-motion`/low-power fallback to a static image), jsPDF/html2canvas/JSZip (load on Export step), font picker (load on open).
- Preview updates: < 16 ms per token change (CSS-variable swap, no React re-render of templates if avoidable).
- Images: WebP/AVIF, `loading="lazy"`, explicit dimensions.
- Memoize heavy color computations; do scale generation in a `useMemo`/web worker if > 5 ms.

## 4. Studio UX requirements
- Autosave indicator ("Saved ✓ 2 s ago").
- Multi-project dashboard: create, duplicate, rename, delete (confirm), import/export.
- Keyboard shortcuts: `←/→` steps, `Cmd/Ctrl+Z` undo, `Shift+Cmd/Ctrl+Z` redo, `C` compare, `D` dark toggle, `?` shortcuts help.
- Empty/loading/error states for font API, export generation, import.
- Onboarding: 3-card intro + "Start from a preset (2-minute mode)".
- Mobile: bottom dock (Questions / Live Site), sticky Apply/Next bar, large touch targets.
- Copy tone: clear, short, no jargon; each step has a one-line "why this matters".
- Localization-ready strings (use a simple i18n layer; English first).

## 5. Deployment
- Vercel: static SPA + serverless `api/*` (fonts, auth). Environment variables set in dashboard.
- `server.ts` is for local dev only; keep API logic in `api/*` handlers shared by both.
- Preview route `/preview-frame` must be a normal SPA route served by the same build (no separate deploy).
- Add `/healthz`, error tracking (Sentry free tier), and a `CHANGELOG.md` with semantic versioning.
- Regenerate font snapshot weekly (GitHub Action) and commit if changed.

## 6. Legal & content hygiene
- Template images: use only licensed/free-to-use assets (e.g. Unsplash/Pexels license terms), bundle locally, keep an `ATTRIBUTIONS.md`.
- Exported README lists font licenses (OFL) and token-tool version.
- Terms/Privacy pages before accounts launch.

## 7. Agent prompts (copy-paste, one at a time)

**Prompt 0 — Cleanup**
> Read `/dss-docs/00_AGENT_README.md` and `01_PRODUCT_REVIEW_AND_ROADMAP.md`. Execute Phase 0 only: rename the folder to `design-system-studio`, fix documentation claims, remove the fake localStorage encryption, add `schemaVersion` to the project type, create `CHANGELOG.md`. Run lint and build. Report what changed.

**Prompt 1 — Token core**
> Read `04_TOKENS_COLOR_A11Y_EXPORT.md` sections 1–2. Implement Phase 1: the `DesignTokens` type with Zod schema, a reducer with undo/redo history, `tokensToCssVars()`, OKLCH scale generation using `culori`, semantic light/dark mapping, and the contrast engine with `nudgeToContrast`. Add Vitest tests. Do not touch UI yet except replacing hardcoded contrast numbers with computed ones.

**Prompt 2 — Preview engine**
> Read `02_TEMPLATE_FIRST_FLOW_AND_LIVE_PREVIEW.md` sections 2–3. Implement the iframe preview at `/preview-frame`, the postMessage protocol (origin-checked, rAF-throttled), viewport switcher (375/768/1280), light/dark toggle, and the preview/commit/draft state with Apply/Cancel ribbon. Use a placeholder template for now. Add a Playwright test proving the phone viewport triggers mobile breakpoints.

**Prompt 3 — Templates and flow**
> Read doc 02 sections 1, 4, 5, 6. Move category/genre selection to Step 1 and make it open a template. Build the section registry, the 8 category templates, the 32 `GenreConfig` objects, and `ComponentsShowcase` + `TypeSpecimen`. Enforce "no literal colors/fonts in `src/preview/**`" with a lint rule or CI grep. Merge steps per doc 01 §4 so the wizard has 11 steps. Keep the existing step components where possible; adapt them to the `StepDefinition` interface.

**Prompt 4 — Typography**
> Read `03_TYPOGRAPHY_FONT_SYSTEM.md` fully. Implement `/api/fonts` (with snapshot fallback and `npm run fonts:snapshot`), the font picker modal (virtualized, filters, lazy loading), Pair mode and Advanced mode, the recommendation engine with curated pairs and `scorePair`, the guardrails, fluid scale utilities, and the typography exports. Add unit tests. Verify Gujarati/Devanagari filtering.

**Prompt 5 — Color, shape, components, imagery**
> Read doc 04 sections 2–4 and doc 02 §5 rows 5–9. Build Steps 5, 7, 8, 9 with option cards that preview on hover and commit on Apply. Add harmony generation, lock colors, dark-mode preview, radius/shadow/motion presets, component variants and states, icon library selection, and imagery treatments. Wire the always-on A11y badge.

**Prompt 6 — Review, export, QA**
> Read doc 04 section 5 and doc 05. Merge old steps 11–13 into the Review & Audit step (three-viewport check, dark check, contrast table with Fix buttons). Implement all 10 exporters as pure functions with snapshot and round-trip tests, plus ZIP export. Lazy-load jsPDF/html2canvas/JSZip. Set up CI with Playwright, axe, and Lighthouse. Fix every failure.

**Prompt 7 — Accounts and sharing (optional)**
> Implement Google sign-in with a secure server-side flow, cloud project sync with conflict handling (last-write-wins plus version stamp), and read-only share links for previews. Add Terms and Privacy pages.

## 8. Final launch checklist
- [ ] All doc checklists (02, 03, 04) are green.
- [ ] CI passes: lint, types, unit, e2e, axe, Lighthouse.
- [ ] Manual test on a real phone (iOS Safari + Android Chrome).
- [ ] Keyboard-only run through all 11 steps.
- [ ] Export starter ZIP → fresh Vite + Tailwind 4 project → `npm i && npm run dev` renders correctly with the exported theme.
- [ ] Docs/README updated; CHANGELOG at v1.0.0.

