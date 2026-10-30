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
