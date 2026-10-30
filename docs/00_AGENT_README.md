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
