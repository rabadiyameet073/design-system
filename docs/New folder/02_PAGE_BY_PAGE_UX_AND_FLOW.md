# 02 — Page-by-Page UX & Flow Improvements

## First: the "14 pages" mismatch
`PROJECT_DOCUMENTATION.md`, `README`, the Landing page and several step files describe **14 steps**.
The running app (`App.tsx`, `WizardNav.tsx`) has **11 steps** (docs/01 intentionally merged 14→11).

| Legacy 14-step file | Status in app |
|---|---|
| Step1ProjectInit, Step3BusinessDiscovery | Orphan (merged into `Step2ProjectBusiness`) |
| Step2WebsiteType | Orphan (replaced by `Step1CategoryGenre`) |
| Step4BrandPersonality | Orphan (replaced by `Step3BrandPersonality`) |
| Step7TypographyStudio | Orphan (replaced by `Step6TypographyStudio`) |
| Step11MobileResponsive | Orphan (now a viewport switcher) |
| Step12ThemesAccessibility, Step13FinalReview | Orphan (merged into `Step10ReviewAudit`) |
| Step14ExportCenter | Orphan (replaced by `Step11ExportCenter`) |

**Action:** delete the 9 orphan files (≈2,000 lines), update every "14" in docs/UI to "11", and rename files so the number matches the step (e.g. `Step6TypographyStudio` is rendered at step 6 but `Step9LayoutSpacing` is step 7 and `Step8ImageryStudio` is step 9 — confusing).

## Global flow problems (affect every step)
1. **No validation anywhere.** `WizardNav` supports `canContinue`, but `App.tsx` never passes it, so "Continue" is always enabled. A user can finish with an empty project name.
2. **Free jumping between steps** (`handleSelectStep`) with no "incomplete" warning; progress % is just `step/11`, not real completion.
3. **Arrow-key navigation is global.** `←/→` change step unless focus is in an input; focus on a slider, radio group, tab, or the color wheel can still trigger navigation. Also `D` toggles dark mode anywhere.
4. **Native `window.confirm/alert`** used in 4 places (reset step, delete project…). Replace with an accessible modal + undo toast.
5. **Reset step** is a hard `confirm()` and only implemented for some steps (switch-case); others silently do nothing.
6. **Undo history** keeps only 15 states and is lost on refresh.
7. **No onboarding/empty state** for first-time users beyond two seeded sample projects.
8. **Mobile:** split-screen collapses to a floating dock; preview and questions can't be seen together — add a half-height bottom sheet preview.

---

## Page 1 — Landing (`LandingPage.tsx`, 1,025 lines)
- Split into sections (`Hero`, `HowItWorks`, `Showcase`, `Pricing/FAQ`) — one 1k-line component is hard to maintain.
- Hero 3D tab (Three.js ≈ 540 KB chunk) — keep lazy, but also skip on `prefers-reduced-motion`, low-end devices, and mobile.
- Claims are hardcoded (see file 04): "WCAG 2.1 AA Verified", "4.8:1 AAA Verified". Compute or remove.
- Add one clear primary CTA ("Start with your business type") and a visible 20-second demo/GIF.
- Add social proof/real examples (export outputs) instead of only feature copy.

## Page 2 — Design System Anatomy section (`DesignSystemAnatomy.tsx`)
- 63 hardcoded hex colors; contrast numbers (e.g. "4.8:1 AAA") are static text. **4.8:1 is not AAA** for normal text (needs 7:1) — this contradicts itself.
- Drive the demo from the real `contrastEngine.ts`, so numbers are always true.
- Add keyboard support to archetype/ratio toggles and `aria-pressed`.

## Page 3 — Auth modal (`OAuthModal.tsx`)
- "Sign in with email" has no verification (see Security S3). Replace with magic link or remove.
- Explain what login gives the user (since projects are local-only today).
- Add error states, loading states, and focus trap + `Esc` close.

## Page 4 — Dashboard (`ProjectDashboard.tsx`)
- Add search, sort (updated/created/name), tags, grid/list toggle.
- Delete uses `window.confirm`; add soft-delete "Undo" toast.
- Show completion % and last step per project; thumbnail of the live preview.
- Import JSON: show a validation report (what migrated/failed) rather than a thrown error string.
- Storage warning when `localStorage` nears ~5 MB (large projects can silently fail in `saveProjects`).

## Step 1 — Category & Genre (`Step1CategoryGenre`)
- Good: search + 8 categories × 32 genres.
- Add "I'm not sure" quiz (3 questions → recommended genre).
- Show a live thumbnail per genre card; keyboard arrow navigation in the grid.
- Persist "recently used genres".

## Step 2 — Project & Business (`Step2ProjectBusiness`, 455 lines)
- All fields are free text with no required marks, no length limits, no URL validation (competitor URLs are split by comma only).
- Add: required `*` markers, inline errors, slug auto-generation with uniqueness check, character counters.
- Offer AI-assisted autofill from a URL/description (the Gemini dependency is already installed but unused).
- `any` used 5× — type the form state.

## Step 3 — Brand Personality (`Step3BrandPersonality`)
- Sliders need labels for min/max, visible values, and `aria-valuetext`.
- Show *what changes* when a dial moves (before/after chips on the preview), not only a number.
- Add presets with real-brand analogies (e.g. "Calm & Editorial like Kinfolk").

## Step 4 — Visual Direction (`Step5VisualDirection`)
- Compare mode exists (draft/apply) — surface it in the UI with a visible "Compare / Apply" bar, not just the `C` shortcut.
- Show what each direction sets (radius, shadow, density) in a small summary.

## Step 5 — Color Studio (`Step6ColorStudio`, 650 lines)
- Strong engine (OKLCH, harmony, auto-fix). UI gaps:
  - Add colorblind simulation toggle in-step (exists in export tests but not visible in UI).
  - Show APCA next to WCAG ratio.
  - "Import from image / URL" palette extraction.
  - Lock individual colors when regenerating harmonies.
  - Add contrast badges (✓/✗ + ratio) directly on swatches.
- 4 hardcoded hex values; move to tokens.

## Step 6 — Typography Studio (`Step6TypographyStudio`, 732 lines — largest step)
- Split into `FontRoles`, `ScaleControls`, `Specimen`, `Guardrails` components.
- Fonts are injected as `<link>` tags per family; add a load-state skeleton and a failure fallback (offline / blocked Google Fonts).
- Self-host or `fontsource` the chosen fonts in exports (see file 05) — export currently relies on Google CDN.
- Show performance cost (number of weights/families) and a warning above a budget.
- `any` used 4×.

## Step 7 — Shape & Spacing (`Step9LayoutSpacing`)
- Add visual grid overlay toggle on preview, and a density preview (compact/comfortable/spacious).
- Show elevation scale (shadow levels 0–5) with dark-mode equivalents.

## Step 8 — Components (`Step10ComponentsStudio`, 431 lines)
- Show **all states** side-by-side (default, hover, focus, active, disabled, loading, error) — a real design-system expectation.
- Add component size scale (sm/md/lg) and copy-ready component snippets.
- 2× `any`.

## Step 9 — Imagery & Motion (`Step8ImageryStudio`)
- Motion tokens: let users set duration/easing scale and preview it live; add `prefers-reduced-motion` preview.
- Icon set choice (Lucide/Phosphor/Heroicons) with stroke width token.
- 4× `any` — type the image/motion config.

## Step 10 — Review & Audit (`Step10ReviewAudit`)
- Auto-fix maps issue IDs to token keys with nested ternaries (`body-text`, `primary-action`, `muted-text`, default → `fgDefault`). Unknown issue IDs silently modify `fgDefault`. Use an explicit map and report "could not auto-fix".
- Add: responsive check summary, dark-mode audit, focus-visible check, target-size (24×24) check, and a downloadable audit report.
- Show before/after for every auto-fix with undo.

## Step 11 — Export Center (`Step11ExportCenter`)
- Show file tree preview of the starter ZIP before download; per-format "what's inside".
- Add progress + error toast for PDF/PNG/ZIP (heavy `html2canvas`/`jsPDF` work blocks the UI thread).
- Add "Copy install command" and "Open in StackBlitz/CodeSandbox".

## Page 12 — Workspace (`WorkspaceView.tsx`)
- Only 3 tabs (overview/components/tokens). Add: Versions/history, Docs (auto-generated usage guide), Share link (read-only), Export history.
- Add inline token editing that writes back to the project (currently mainly viewing).

## Page 13 — Header & Shortcuts (`Header`, `KeyboardShortcutsModal`)
- Add a breadcrumb: Project › Step › Save status ("Saved 2s ago").
- Make the shortcuts modal focus-trapped and discoverable from a visible "?" button.

## Page 14 — Legal / Footer (`LegalModal`, `StudioFooter`)
- Footer lists "WCAG 2.1 AA Audit" — update to 2.2.
- Add real Privacy/Terms pages (not only a modal), a contact/support link, and a changelog link.

## Top 10 UX quick wins
1. Wire `canContinue` + inline validation
2. Delete orphan steps; fix "14" → "11"
3. Replace `window.confirm`
4. Real completion/progress indicator
5. Save-status indicator ("Saved ✓")
6. Show all component states
7. Colorblind toggle in Color step
8. File-tree preview in Export
9. Bottom-sheet preview on mobile
10. Compare/Apply bar visible
