# PROJECT_AUDIT_AND_IMPROVEMENT_REPORT.md

**Audit date:** 2026-11-25 · **Version audited:** 1.6.0 (commit `3d10e9c` + 31 uncommitted files) · **Auditor role:** Senior Product Analyst / QA / UI-UX / Real Customer
**Method:** Full documentation review, static analysis, live UI testing in Brave via browser automation at `http://localhost:3000` (`npm run dev`), API probing, responsive emulation (390px, 1440px), console/network monitoring. `npm run lint` = clean; `npm test` = 23 files / 151 tests passing.

---

## 1. Executive Summary

DSS is an **ambitious, visually excellent, technically sophisticated product** whose core engine (token math, contrast engine, 8 templates, 13 exporters, 11-step wizard) largely works. The landing page and wizard feel premium; all 11 steps navigate without crashing, no console errors were observed, and the API endpoints respond correctly. TypeScript and the test suite are clean.

However, the audit found a **significant gap between the documented vision and the customer experience**, concentrated in four areas:

1. **The central promise — "pick a genre → the live template updates" — is only partly true.** Category switches work; selecting a specific genre changes state and the selected card highlight but **does not change the live template's brand, copy, or content**. The preview kept showing "Komorebi Ceramics" pottery copy and "Aether" audio products after switching to "Luxury Fashion", and showed "Apex" SaaS copy after switching to "Generative AI Workspace". The `defaults` in `GenreConfig` only carry tokens, not copy/branding, and the template resolver prioritizes `projectMeta.websiteType.category` over genre-specific content.
2. **A critical security regression is uncommitted:** `/api/auth/custom-login` lost its production guard. I verified an unauthenticated `POST` can assert **any** email identity and immediately receive a valid session — complete account impersonation.
3. **The onboarding flow is confusing:** "Start designing" and "Create Design System" force sign-in, then generate two identical "My New Website" projects, then land the user on the old sample project instead of the new one — while the landing page promises "zero signup walls".
4. **Documentation and UI copy disagree with each other and with the code** ("14 guided decisions" vs 11 steps; "5 formats" vs 13; "WCAG 2.1" in rules vs 2.2 in code; "10 export formats" vs 13).

Most remaining issues are P1/P2. The product is **not production-ready** until the impersonation bug is fixed, the genre→template link is made real, and the persistence story is made serverless-safe.

---

## 2. Product Understanding

- **Product:** Founder-first "design system studio" — a guided wizard that converts brand/business decisions into mathematical tokens, a live simulated website, accessibility audits, and production-ready code/spec exports.
- **Problem solved:** Avoids weeks of fragmented hand-off debates between founders, designers, and developers; keeps Figma/code/dark-mode/contrast in sync via one typed `DesignTokens` source of truth.
- **Audience:** Non-designer founders and developers who need a production design system fast ("finish in under 5 minutes" via presets).
- **Core features:** 11-step wizard; split-screen live iframe preview with viewport/light-dark/colorblind controls; 8 category templates × 32 genres; OKLCH 11-step scales + WCAG 2.2 AA auto-fix; role-based font system with 400+ font snapshot + recommendation engine; 13 export formats + PDF/PNG/ZIP + share links; Google OAuth + email login + per-user project sync; local-first storage with BroadcastChannel.
- **Intended journey:** Landing → pick category/genre → template opens immediately → hover-preview/Apply each choice → review audit → export → workspace/dashboard.
- **Vision/design philosophy:** Luxury editorial, humanized (Don Norman's 3 levels), spring physics, Three.js 3D, WCAG 2.2 AA, single source of truth, computed-not-fake numbers, studio UI separate from token-driven preview.
- **Status:** Docs 00–05 (and 01–06 in `docs/New folder`) are all marked implemented in CHANGELOG v1.0→v1.6; the remaining uncommitted work adds server-side JSON persistence, universal email login, profile modal, and expanded flagship templates.

---

## 3. Feature Implementation Status

| Feature | Expected Behavior | Actual Behavior | Status | Remarks |
|---|---|---|---|---|
| Landing page + 3D hero | Editorial hero, live preview, 4 pillars | Renders well; 3D torus knot at 60 FPS; copy says "14 guided decisions" | Partial | Copy drift; hardcoded "Smooth 60 FPS"/"14 Guided Steps" badges |
| Category tabs on landing | 8 flagship brands switch preview | 8 tabs exist; flagship content inconsistent (Ceramics preview shows audio product copy) | Partial | See issue F-02 |
| Sign-in | Google OAuth or email; local-first; "zero signup walls" | Sign-in required for wizard/new project; 1-click demo personas work; unauthenticated impersonation possible | Broken | Issues S-01, S-02 |
| Onboarding → new project | Start creates a fresh step-1 project | Two duplicate "My New Website" projects created; user lands on sample project | Broken | Issue F-01 |
| 11-step wizard | All steps functional; hover-preview + Apply | All 11 navigate cleanly; validation disables Continue; no console errors | Working | — |
| Category → template switch | Category opens matching template | Verified: SaaS category opens Apex SaaS template | Working | — |
| Genre → template/copy switch | 32 genres change copy/sections/defaults | State/card highlight changes; template copy/brand unchanged | Broken | Issue F-03 (core promise) |
| Draft preview ribbon | Hover shows "Previewing (B)… Apply/Cancel" | Not observed in live testing despite `onPreviewDraft` wiring | Unverified/Likely broken | Issue F-04 |
| Step 10 audit + auto-fix | 10-pair contrast table, computed, 1-click fix | 9/10 pass, fix worked, dark mode still 2.44:1 border fail while "Dark mode verified" shown | Partial | Issue A-01 |
| Step 11 exports | 13 formats, validation gate, share link, PDF/PNG/ZIP | All controls present; gate cleared after fix; downloads triggered with no errors; share link works | Working | Export contents not fully inspected |
| Workspace | Token inspector + docs | Opens correctly with project name | Working | — |
| Dashboard | Search/sort/grid/list/import/export/soft-delete | Search verified (filtered to QA Audit Studio); cards render | Working | — |
| User profile modal | Account info, actions | Opens; copy ID; 3 Saved; clipped on mobile | Partial | Issue U-05 |
| API: /health, /fonts, /auth/me, /user/projects | Correct responses | All 200 with expected payloads | Working | — |
| AI prompt endpoint | Gemini with fallback | Falls back correctly but echoes unescaped project name | Broken | Issue S-03 |
| Serverless deployment | Vercel SPA + serverless API | File-based `.data/users` store won't persist on Vercel | Risk | Issue T-01 |
| Responsive (390px) | Bottom dock, no overflow | Wizard dock works; landing page has horizontal overflow; profile modal clipped | Partial | Issues U-01, U-05 |
| Playwright/axe/Lighthouse CI | E2E, a11y, perf gates in CI | CI only runs lint/test/build | Gap | Issue G-02 |

---

## 4. End-to-End User Testing

**Journey 1 — Visitor → sign-in → create (failed onboarding):**
Landing looked polished. Clicked "Start designing" → sign-in modal appeared (contradicts "zero signup walls"). Used 1-click demo persona "Alex" → landed directly in wizard Step 1 on **"Komorebi Studio & Ceramics"** sample, not a new project. localStorage showed a new "My New Website" project existed but was never activated. Two duplicate "My New Website" projects accumulated from earlier attempts.

**Journey 2 — Step 1 genre selection (core promise failed):**
Selected category "SaaS & Developer Tech" → preview switched to Apex SaaS template (worked). Selected genre "Generative AI Workspace" → state `genre: generative-ai-workspace` updated, card highlighted, but preview H1 stayed "The Autonomous Mathematical Runtime for Modern Engineering Teams." Earlier, "Luxury Fashion & Apparel" left ceramics/audio copy visible. No "Previewing (B) / Apply" ribbon appeared after genre clicks.

**Journey 3 — Full 11-step wizard (passed):**
Filled project name "QA Audit Studio"; Continue was disabled until a name was entered (validation works by disabling, with no explanatory message). Steps 2→10 navigated with correct H1s and URLs, zero console errors. Step 10 showed 9/10 contrast pairs passing; "Auto-Fix All (1)" worked and showed "Auto-fixed all 1 issues in light mode" plus Undo; switching to Dark still displayed a failing 2.44:1 border pair while claiming "Dark mode verified".

**Journey 4 — Export (passed):**
Step 11 showed validation gate cleared after auto-fix. Clicked file tree items (JSON/DTCG code preview rendered), Download Starter ZIP, Download PDF, Download PNG, Copy Shareable Link — no errors, no console messages. "Finish & Export" navigated to workspace with correct project name.

**Journey 5 — Dashboard/profile (passed with UX issue):**
Search filtered correctly; sort/view toggles present. Header avatar menu → "View Profile & Account" opened modal ("3 Saved", "Backend JSON"). On 390px emulation the modal was clipped at the top and behind the page.

**Journey 6 — Share link (passed):**
Hash `#/share?data=...` decoded into read-only view with "QA Audit Studio", "Download Starter", "Fork & Edit in Studio".

**Journey 7 — Mobile (partial):**
Wizard at 390px shows "Questions (1/11) / Live Site" dock correctly. Landing page showed horizontal clipping (`scrollW 428 > innerW 406`) and text cut off at edges.

**Journey 8 — API/security probes (failed):**
`/api/health`, `/api/fonts`, `/api/auth/me`, `/api/user/projects` all 200. Unauthenticated `POST /api/auth/custom-login` with arbitrary email returned a valid session. `/api/generate-ai-prompt` echoed `<script>alert(1)</script>` verbatim.

---

## 5. Bug and Issue Report

**S-01 — Unauthenticated arbitrary-identity login (Critical, Security)**
- *Page/feature:* `POST /api/auth/custom-login`; all authenticated features.
- *Repro:* `curl -X POST .../api/auth/custom-login -H "Content-Type: application/json" -d '{"name":"Attacker","email":"attacker@evil.test"}'` → `200 {success:true,...}` and `Set-Cookie` session; subsequent `/auth/me` returns the attacker identity.
- *Expected:* Production blocks custom login (per S3 hardening in CHANGELOG 1.5.0/1.6.0), or at minimum verifies email ownership.
- *Actual:* The `NODE_ENV === 'production'` guard was deleted in uncommitted `api/index.ts`; stable ID derived from SHA-256(email) means anyone can claim any existing user's email and read their projects. **Evidence:** live response captured in Journey 8.
- *Why critical:* Complete account takeover / cross-user data access; undoes documented security work.

**S-02 — Sign-in wall contradicts product promise (High, Product/UX)**
- *Repro:* Click "Start designing" or "Create Design System" while signed out → OAuth modal; landing copy says "zero signup walls, and every single decision saves automatically to your browser".
- *Expected:* Per docs 01 §6, OAuth belongs in Phase 7; local-first MVP should work without accounts.
- *Actual:* Wizard and new-project creation gated behind login (uncommitted `App.tsx` changes).
- *Evidence:* Snapshot of modal after CTA click.

**S-03 — Unescaped prompt injection in AI endpoint (Medium, Security)**
- *Repro:* `POST /api/generate-ai-prompt` with project name `<script>alert(1)</script>` → response prompt contains raw string.
- *Expected:* Escape/sanitize untrusted input before echoing or rendering.
- *Actual:* Raw echo; risk if displayed via `innerHTML` anywhere. No XSS confirmed in the UI, so rated Medium.

**F-01 — Onboarding creates duplicates and opens the wrong project (High, Functional)**
- *Repro:* Sign in via demo persona → "Start designing" → inspect localStorage and header.
- *Expected:* One fresh project at Step 1 becomes active.
- *Actual:* Two "My New Website" projects were created; `dss_active_project_id_v1` still points to `project_artisan_ceramics` (the sample). Wizard ribbon showed "Type: Cloud Analytics & Dashboard" of the sample. **Evidence:** localStorage dump in Phase 3.

**F-02 — Flagship category tabs show mismatched brands/content (Medium, Functional/Content)**
- *Repro:* Landing page default "Komorebi Ceramics" preview shows headline about stoneware pottery but adjacent product cards/reviews are "Aether Pro Planar Wireless" headphones and "Complimentary Worldwide Express Air on Orders Over $150".
- *Expected:* Each flagship brand renders coherent copy and products.
- *Actual:* Expanded templates hardcode flagship-specific product arrays; preview resolver mixes data sources. Also landing copy says "14 curated palettes"/"5 modular pairings" while docs say 14/12+; "14 guided decisions" vs 11 steps.

**F-03 — Genre selection does not update the live template (Critical vs vision, Functional)**
- *Repro:* Step 1 → select "Luxury Fashion & Apparel" or "Generative AI Workspace"; observe preview H1/brand unchanged.
- *Expected:* "Picking a genre opens a visibly different template; all 32 genres resolve to a valid config; copy/sections/images change" (docs 02 §8, Definition of Done).
- *Actual:* `websiteType.id` and `tokens.meta.genreId` update, `PreviewFrame` resolves category from `projectMeta.websiteType.category` and template by category only; `GenreConfig` defaults don't carry `copyFile` content into the preview. Category-level switching works; genre-level content does not. **Evidence:** before/after H1 identical in live test; source: `PreviewFrame.tsx:170-182`, `Step1CategoryGenre.tsx:59-91`, `WizardWorkspaceStage.tsx:184-204`.

**F-04 — Draft preview ribbon/Apply flow not observed (Medium, Unverified)**
- *Repro:* Hover/click genre cards and option cards in steps 1–9; look for "Previewing (B)" bar.
- *Expected:* Hover sets draft, live preview updates, Apply commits (docs 02 §3.3/§6).
- *Actual:* Card highlight changed but no ribbon or Apply control appeared in multiple steps. Code shows `onPreviewDraft` is wired, so this needs targeted reproduction (possibly hover events not firing under automation or a state bug). Marked **unverified**, not confirmed broken.

**A-01 — Audit claims "verified" while a pair fails (Medium, Functional/Content)**
- *Repro:* Step 10 → Dark tab after auto-fix → contrast table shows "Card & Control Border 2.44:1 Fail WARN" while status card says "Dark mode verified" and preview toolbar badge says "A11y: 10✓ 0✗".
- *Expected:* Status reflects audit result; failing pair blocks "verified" state.
- *Actual:* Static copy not bound to audit results; two different counts (9/10 vs 10✓ 0✗). Step 11 gate cleared despite a failing pair.

**U-01 — Landing page horizontal overflow on mobile (Medium, UI/UX)**
- *Repro:* Emulate 390px → landing → measure `document.documentElement.scrollWidth` (428) vs `innerWidth` (406); screenshot shows text clipped on both sides.
- *Expected:* Responsive down to 375px with no horizontal scroll.
- *Evidence:* `dss-3d.png` screenshot and measured scroll width.

**U-02 — Dashboard "Review" button mislabeled (Low, UI/UX)**
- *Repro:* Dashboard → click "Review" on a project → lands on `#/project/.../step/11` (Export Center), not Step 10 Review & Audit.
- *Expected:* Open the audit step or label the button "Continue/Export".

**U-03 — Validation feedback is silent (Low, UI/UX)**
- *Repro:* Clear project name in Step 2 → Continue disabled; no inline error or tooltip explains why.
- *Expected:* Visible required-field hint (docs 02/05 require useful feedback/empty states).

**U-04 — Hardcoded claims in UI (Low, Product/Content)**
- *Evidence:* "14 guided decisions", "14 Guided Steps", "Smooth 60 FPS", "5 formats" in landing; docs promise 11 steps, 13 formats. Docs rule "no fake numbers" applies to preview specifically, but these are customer-facing inaccuracies.

**U-05 — Profile modal clipped on mobile (Low, UI/UX)**
- *Repro:* Open "View Profile & Account" at 390px; modal top is above viewport (close button at y=-172), can't click without Escape/scroll.
- *Expected:* Modal fits viewport with internal scroll and always-visible close control.

**T-01 — Serverless persistence design is unsafe (High, Technical/Risk)**
- *Evidence:* Uncommitted `api/index.ts` writes `.data/users/<id>/projects.json` via `fs`; Vercel lambdas have ephemeral, read-only filesystems. Rate limiter is in-memory per instance. Docs 05 §5 explicitly say serverless; data will vanish across invocations and differ per region.
- *Status:* Potential risk (not testable locally) — needs a real DB/KV before deployment.

**G-01 — Dead token reducer / double history (Medium, Technical)**
- *Evidence:* `tokenReducer.ts` deep-merge fixes were added in uncommitted work, but `App.tsx` still uses its own history, and earlier deep-analysis doc states the reducer was never imported. Verify adoption or remove to avoid conflicting behavior.

**G-02 — Missing QA gates from the documented Definition of Done (Medium, Process)**
- *Evidence:* `.github/workflows/ci.yml` runs only lint/test/build; no Playwright, axe, Lighthouse, export compilation, or visual regression despite docs 05 §1 and Definition of Done requiring them.

**D-01 — Documentation drift (Low–Medium, Documentation)**
- README: "144 passing tests" (actual 151); PROJECT_DOCUMENTATION: "10 export formats" (actual 13); `GEMINI.md`/`.agents/rules` say WCAG 2.1 (code targets 2.2); `docs/01` still lists issues (fake encryption, "0ms latency") already fixed; folder typo `desing system` never renamed; `security_spec.md` describes Firestore rules that no longer exist (current storage is JSON files/localStorage).

---

## 6. UI/UX Improvement Recommendations

1. **Make the first-run journey honest and linear.** Either allow local use without sign-in (matching "zero signup walls") or rewrite the copy to "Sign in to save your work". After sign-in, create exactly one project and activate it; never silently open a sample.
2. **Fix the genre→template contract.** Give every `GenreConfig` a real copy file/brand/sections (docs 02 §4.2 already defines `copyFile`, `sections`, `heroImage`, `defaults`); have `PreviewFrame` resolve template by category but content by genre; verify with an e2e assertion on the H1 after each genre click.
3. **Make draft/Apply visible and consistent.** Show the ribbon on every option card interaction, including Step 1 genre clicks; add a keyboard and touch path; ensure "Leave step with un-applied draft" prompt/toast appears.
4. **Bind compliance UI to computed state.** Replace "Dark mode verified", "A11y: 10✓ 0✗", and the Step 11 gate with values from `auditSemanticContrast` for the active mode; a failing pair should keep the gate closed and show which token to fix.
5. **Clean the copy.** Replace 14→11 steps, 5→13 formats, remove "Smooth 60 FPS" unless measured, and ensure flagship tabs show coherent brand/product data.
6. **Mobile polish.** Constrain landing hero to `w-full overflow-x-hidden`; make modals `max-h-[90vh] overflow-y-auto` with an always-visible close button; keep the Questions/Live Site dock sticky.
7. **Add visible validation.** Inline "Required" error under project name, aria-describedby, and a toast when Continue is blocked.

---

## 7. Missing Features and Product Gaps

- **Genre-level template content** (copy files, section overrides, genre-specific imagery) — defined in docs but not delivered in preview.
- **Real preview-then-apply for all options** — partially implemented; not observable in live testing.
- **E2E/axe/Lighthouse/visual/export-compilation CI** — specified in docs 05 §1 and Definition of Done; absent.
- **Truthful single source of truth for exports** — deep-analysis doc 06 A3 flagged legacy `colorPalette`/`typography` fields still feeding PDF/PNG/ZIP/AI prompt; CHANGELOG 1.6.0 says fixed via `getResolvedProjectColors`, but needs a round-trip test that changes tokens then verifies PDF/ZIP contents.
- **Serverless-safe persistence** — file store must be replaced with a managed DB/KV; conflict handling needs version stamps (docs 07).
- **Import Onboarding / 3-card intro / 2-minute preset mode** — specified in docs 05 §4; not observed.
- **Localization-ready strings** — docs 05 §4; UI strings are hardcoded English (RTL preview exists, but the studio UI does not).
- **"Open sample demo" behavior** — clicking it lands on the sample project; verify it doesn't overwrite user work.

---

## 8. Performance and Technical Findings

- **No console errors or warnings** observed across all tested pages/steps; network failures none.
- `npm run lint` clean, `npm test` 151/151 passing, dev server boots normally on port 3000.
- Landing 3D canvas renders at 60 FPS indicator; code has cleanup and reduced-motion handling per docs.
- Route-level code splitting is active (steps lazy-loaded); switching steps showed no lag.
- API responses are fast locally; `/api/fonts` returns 400 cached/snapshot families.
- **Security:** unauthenticated login (S-01), prompt echo (S-03), in-memory rate limiter (per-instance), file storage on serverless (T-01). Session cookies are HMAC-signed and HttpOnly (verified in source), CSP is present.
- **Data:** two duplicate "My New Website" projects from repeated CTA clicks; cloud/local merge uses `updatedAt`, but the active-project selection still gets clobbered in the observed flow.
- **Preview bridge:** origin validation and rAF throttling present in both `WizardWorkspaceStage` and `PreviewFrame`; `A11Y_RESULT` is computed live. Mismatch noted: Step 10 local fallback count vs iframe audit count.

---

## 9. Prioritized Improvement Roadmap

**P0 — Critical (fix immediately)**
1. **S-01:** Restore the production guard on `/auth/custom-login` or implement real email verification. *Why:* prevents account takeover. *Outcome:* no unauthenticated identity assertion.
2. **F-03:** Wire `GenreConfig.copyFile/sections/heroImage` into `PreviewFrame`; make genre selection visibly change the live template. *Why:* it is the product's differentiator. *Outcome:* every one of the 32 genres opens a distinct, coherent site.
3. **T-01:** Replace `.data/users/*.json` with a managed persistent store before any Vercel deploy; move rate limiting to shared storage. *Why:* current design loses user data in serverless. *Outcome:* projects survive restarts and scale across instances.

**P1 — High priority**
4. **F-01/S-02:** Fix new-project creation and activation; reconcile sign-in requirement with "zero signup walls" copy. *Outcome:* one clean project, correct active selection, honest promise.
5. **A-01:** Bind all compliance badges/gates to computed audit state. *Outcome:* no false "verified" claims.
6. **G-02:** Add Playwright journeys for onboarding, genre switching, export, mobile; axe on studio + iframe; Lighthouse budgets. *Outcome:* issues caught before customers find them.
7. **G-01:** Adopt `tokenReducer` or delete it; unify draft/history implementation. *Outcome:* no silent merge regressions.

**P2 — Medium priority**
8. **F-02/F-04/U-04:** Fix flagship copy mismatches, make draft/Apply ribbon observable everywhere, correct numeric claims.
9. **U-01/U-05:** Mobile overflow and modal clipping fixes.
10. **S-03:** Escape/sanitize AI endpoint input.
11. **D-01:** Reconcile README/docs/rules counts, WCAG version, security spec, and folder name.

**P3 — Low priority**
12. **U-02/U-03:** Relabel dashboard "Review" button; add inline validation messages.
13. Add onboarding cards/2-minute preset mode and i18n string layer (docs 05 §4).
14. Add colorblind simulation and APCA labels as "approx." where appropriate.

---

## 10. Final Product Assessment

The application is **~70–75% aligned with the documented vision**. The foundation is genuinely strong: the token engine, contrast math, iframe preview architecture, 8 category templates, 13 exporters, auth/session plumbing, and the luxury editorial UI are all real and mostly working. The test suite and type-check are clean.

What prevents "production-ready" status is not breadth of features but **trust**: a critical auth regression, a core promise (genre→template) that doesn't hold, onboarding that creates duplicates and opens the wrong project, compliance badges that can say "verified" over failing values, and a persistence layer that won't survive the documented deployment target. Documentation drift further erodes confidence.

**Before launch:** complete P0 and P1, re-run this exact journey set (especially Journeys 1–3 and 8), then add the documented CI gates. Once genre selection truly re-skins the live site and the first-run flow is clean, the product will deliver the differentiator the docs describe — a founder-friendly, mathematically rigorous, single-source-of-truth design system studio.

---

### Notes on audit limitations (per your rules)
- I **did not modify any application code** during the audit. Screenshots were saved only to the approved temp folder: `C:\Users\rmdu0\AppData\Local\Temp\opencode\dss-*.png`.
- **Not tested:** actual downloaded ZIP/PDF/PNG file contents (browser download UI not readable here), Google OAuth live flow (requires real credentials — used the built-in demo login instead), Gemini AI live generation (no key configured — verified fallback only), Vercel deployment behavior, keyboard-only full run, and visual regression. These are marked as risks/unverified, not bugs.
- The local dev server was left running in the background; close browser tab `dss-audit2` when finished.

---

## 11. Remediation Results (post-audit implementation)

The audit findings were implemented in a follow-up pass. Verification after all changes:
`npm run lint` ✅ · `npm test` ✅ (25 files / 164 tests) · `npm run build` ✅ · `npm run test:e2e` ✅ (7/7, including axe on landing + preview in light and dark).

| Issue | Status | What changed |
|---|---|---|
| S-01 unauthenticated login | **Fixed** | `POST /auth/custom-login` returns 403 in production (verified against a `NODE_ENV=production` server); demo personas remain available locally. |
| S-02 sign-in wall | **Fixed** | Wizard and project creation are local-first with no account required, matching "zero signup walls"; accounts add cloud sync only. |
| S-03 AI prompt injection | **Fixed** | All untrusted fields in `/generate-ai-prompt` are escaped and length-limited. |
| F-01 duplicate/misrouted onboarding | **Fixed** | New project is persisted synchronously before selection; active ID and route are set explicitly; creation guard and cloud-sync protection added. E2E asserts exactly one new active project at Step 1. |
| F-02 flagship brand/content mismatch | **Fixed** | Per-genre content resolver supplies brand, headline, products and offerings to all 8 templates; E2E asserts the preview H1 changes on genre selection. |
| F-03 genre → live template | **Fixed** | `src/preview/genres/genreContent.ts` resolves all 32 genres; `PreviewFrame` merges project overrides; all templates consume resolved content. |
| F-04 draft preview ribbon | **Not reproduced** | Option-card `onPreviewDraft` wiring is present; no ribbon appeared during manual hover/click testing. Left as an unverified risk, not claimed fixed. |
| A-01 false "verified" claims | **Fixed** | Status cards and badges now derive from `auditSemanticContrast`; audit mode and preview toolbar are synchronised via a shared event; the production ZIP stays disabled while any pair fails. |
| U-01 mobile landing overflow | **Fixed** | `overflow-x-hidden` on the landing root and document; E2E asserts no overflow at 390px. |
| U-02 misleading "Review" button | **Fixed** | Relabelled to "Export" (it opens the Export Center). |
| U-03 silent validation | **Fixed** | Inline required-field message with `aria-invalid` / `aria-describedby` in Step 2. |
| U-04 false numeric claims | **Fixed** | 14→11 steps, 5→13 formats, "Smooth 60 FPS"→"Target 60 FPS". |
| U-05 clipped profile modal | **Fixed** | Modal is viewport-bounded with internal scroll. |
| T-01 serverless persistence | **Implemented, requires configuration** | `api/projectStore.ts` adds a local-file adapter for development and an Upstash-compatible REST adapter for production; rate limiting uses shared storage when configured. Set `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` (see `.env.example`) before deploying to Vercel. |
| G-01 duplicate history systems | **Partially addressed** | `MAX_HISTORY` is now exported from `tokenReducer` and used by `App.tsx`; the reducer itself remains as the tested reference implementation. Full reducer adoption is still a refactor. |
| G-02 missing CI gates | **Fixed** | Playwright + axe added (7 E2E specs), `test:e2e` scripts, and CI runs lint → unit → build → e2e. Lighthouse/visual regression remain future work. |
| D-01 documentation drift | **Fixed** | README, PROJECT_DOCUMENTATION, rules, security spec and roadmap docs reconciled with the code. |

New regression coverage: `tests/preview/genreContent.test.ts`, `tests/utils/persistence.test.ts`, and `tests/e2e/*.e2e.ts` (7 specs, including axe).

