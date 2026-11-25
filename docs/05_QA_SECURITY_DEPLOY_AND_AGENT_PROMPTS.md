# 05 — QA, SECURITY, PERFORMANCE, DEPLOY & AGENT PROMPTS

## 1. Testing strategy
> Status: only the Vitest unit/component layer is wired up today (151 passing tests). Playwright, axe, Lighthouse and the GitHub Actions workflow below are **targets being added in separate work**, not current CI.

| Layer | Tool | What to test |
|---|---|---|
| Unit | Vitest | color scale, contrast, `nudgeToContrast`, `fluid`, `scaleSize`, `scorePair`, guardrails, token reducer (undo/redo), exporters (snapshots), migrations |
| Component | Testing Library | Option cards (hover/click/keyboard), picker modal, step navigation |
| E2E | Playwright | Full flow: pick genre → color → fonts → export; reload persistence; mobile viewport; keyboard-only run |
| Accessibility | `@axe-core/playwright` | Studio pages AND the preview iframe in light + dark; zero serious/critical violations |
| Visual regression | Playwright screenshots | Each of 8 templates × light/dark × 3 viewports against baseline |
| Performance | Lighthouse CI | Landing + wizard budgets (see §3) |
| Export validation | scripts in CI | Compile Tailwind output, `tsc` the TS export, schema-validate DTCG |

Local verification available now: `npm run lint` (typecheck), `npm test`, `npm run build`. Target CI pipeline: `lint → typecheck → unit → build → e2e → axe → lighthouse`, blocking merge on failure — no workflow is committed yet.

## 2. Security & privacy
- **Do not claim client-side encryption** (already removed). A key stored in the same browser offers no real protection; projects stay plain JSON with explicit export/import.
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
- [ ] Local checks pass: `npm run lint`, `npm test` (151 tests), `npm run build`.
- [ ] Target CI once landed: lint, types, unit, build, e2e, axe, Lighthouse (the last three are being added in separate work).
- [ ] Manual test on a real phone (iOS Safari + Android Chrome).
- [ ] Keyboard-only run through all 11 steps.
- [ ] Export starter ZIP → fresh Vite + Tailwind 4 project → `npm i && npm run dev` renders correctly with the exported theme.
- [ ] Docs/README updated; CHANGELOG at v1.0.0.
