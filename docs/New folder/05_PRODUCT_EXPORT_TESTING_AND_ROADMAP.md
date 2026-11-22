# 05 — Product, Export, Testing & Roadmap

## Export improvements (`exportGenerators.ts`, `tokenExporters.ts`)
Existing: PDF spec, PNG board, CSS vars, Tailwind, TS types, W3C JSON, Figma Tokens Studio, dev ZIP, Next.js starter ZIP, handoff brief, AI prompt. Good base. Improve:
1. **Fonts:** export uses Google CDN links; add self-hosted `@font-face`/`fontsource` option (privacy + speed + GDPR).
2. **Style Dictionary config** and Figma *Variables* (not only Tokens Studio) output.
3. **Component code:** generate real shadcn/Radix-based Button/Card/Input using the tokens (not only tokens).
4. **Dark mode tokens** in every format (verify parity).
5. **Validation before export:** block/warn if audit has failing contrast pairs.
6. **Round-trip test:** import exported JSON → export again → must be identical.
7. **Versioning:** put `schemaVersion`, generator version, and timestamp in every file header.
8. **Heavy tasks** (PDF/PNG/ZIP): run lazily with progress and error toast; split the 1,021-line file per format.
9. **Shareable link / hosted preview** of the system (read-only) — big product value.
10. Tailwind output: confirm Tailwind 4 `@theme` syntax and add a v3 config option.

## Product gaps vs. competitors (Realtime Colors, tweakcn, Coolors)
- No AI assist (Gemini SDK installed, unused): AI brand-to-tokens suggestion, copy generation, palette from description/URL/image.
- No collaboration/sharing, version history, or comments.
- No "apply to my existing site" (paste URL → preview your content with new tokens).
- No accessibility *report* deliverable for clients.
- Monetization/limits undefined (free vs pro: projects, exports, AI).
- Analytics: privacy-friendly events (step drop-off, export usage) to learn where users leave.

## Testing
Current: ~17 vitest files (tokens, preview protocol, wizard flow, a11y audit logic). Strong on the engine; **missing** UI/e2e coverage.
- Add component tests (React Testing Library) for each step: render, change value, assert token update.
- Add Playwright e2e: landing → pick genre → finish 11 steps → export ZIP → verify files.
- Add axe a11y checks per step and per modal.
- Add visual regression (Playwright screenshots) for preview templates (8 templates × light/dark).
- Add API tests (supertest) for auth: state mismatch, XSS payload, session isolation.
- Property tests for color math (round-trip hex↔OKLCH, contrast monotonicity).
- Coverage gate in CI (e.g. 70% engine, 50% UI).
- Note: I could not execute the suite in my sandbox (see file 03), so pass/fail status is unverified.

## Documentation
- `PROJECT_DOCUMENTATION.md` is stale (14 steps, d:/ path). Regenerate from code or mark as legacy.
- 6 docs + 935-line master guide + CHANGELOG exist — consolidate into one `docs/` index with "current vs planned".
- `README.md`: add quick start, env var table, architecture diagram, screenshots, deploy steps.
- `GEMINI.md`, `AGENTS.md`, `.lyzo`, `.agents` are tooling files; keep out of public repo.
- Add `LICENSE`, `CONTRIBUTING.md`, `SECURITY.md`.

## Deployment
- Vercel config rewrites everything except `/api`, `/auth/callback` to SPA — fine; add cache headers for hashed assets (`immutable`).
- Ensure serverless-safe auth (see file 01) before deploying; set `APP_URL`.
- Add error monitoring (Sentry) and uptime check on `/health`.

## Roadmap
### Week 1 — Stop-the-bleeding
- Rotate secrets; remove `.env`/`client_secret` from any shared archive
- Fix auth (sessions, state, XSS, postMessage, custom-login)
- Delete orphan steps; fix "14→11" everywhere; fix false contrast/WCAG claims

### Weeks 2–3 — Quality foundation
- Router + store; debounced IndexedDB; Zod import validation
- Wire step validation (`canContinue`), modal replacement, save-status indicator
- Focus ring, skip link, Radix dialogs, alt text, aria on sliders
- Code-split + image/font optimization (bundle < 400 KB main)

### Weeks 4–6 — Product value
- Show all component states; colorblind & APCA in UI
- Export: self-hosted fonts, dark tokens, component code, pre-export audit gate
- Playwright e2e + axe + visual regression in CI

### Weeks 7–12 — Growth
- Real backend (DB + accounts) *or* officially local-first
- AI assist (Gemini) for brand→tokens
- Shareable read-only links, version history
- i18n + RTL, analytics, pricing

## Scorecard (my estimate from static review)
| Area | Now | After plan |
|---|---|---|
| Token/color/type engine | Strong | Strong |
| Security | Weak (critical) | Good |
| Accessibility of the studio | Weak | Good |
| Architecture/maintainability | Medium | Good |
| Performance | Medium (1.5 MB bundle) | Good |
| Docs accuracy | Weak (stale) | Good |
| Test coverage (UI/e2e) | Low | Good |

## Honest limits of this review
- I read the code statically; I could not run the app, `tsc`, or tests in my environment.
- I sampled every wired step, API, storage, sync, export, and config files in depth, but did not read all 26k lines line-by-line. Treat line-level claims (e.g. missing `alt`, `canContinue` never passed) as strong leads to confirm with a quick grep/test.
