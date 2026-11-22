# Changelog

All notable changes to Design System Studio (DSS) will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.6.0] - 2026-11-15

### Deep Analysis Confirmed Bugfixes (Complete 06_DEEP_ANALYSIS_CONFIRMED_BUGS Implementation)
- **A1. Step 10 & Step 6 Shared Contrast Fix**:
  - `A11yAuditIssue` carries `fgKey: keyof SemanticColors`, ensuring fixes write directly to the targeted token key (`issue.fgKey`) rather than falling back to `fgDefault`.
  - Step 10 and Step 6 use shared `autoFixSemantic()` with multi-pass convergence to resolve all interdependent pairs (body, muted, primary action, border, focus ring, and status badges).
- **A2. Directional Contrast Ceilings on Mid-Tones**:
  - `nudgeToContrast()` evaluates achievable contrast against black vs. white ceilings on mid-grey backgrounds (`#808080`), preventing failed iterations and chromatic jumps.
- **A3. Unified Single Source of Truth Across Exporters**:
  - Built `getResolvedProjectColors` and `getResolvedProjectTypography` in `exportGenerators.ts`, ensuring PDF specification, PNG design board, founder handoff brief, AI website prompt, and starter ZIP resolve tokens directly from `project.tokens`.
  - Added `.dark` mode block to `generateCssVariables()` for dark mode parity.
  - Dynamically generated Google Fonts `<link>` in `generateNextJsLayout()` matching user-selected typography roles.
- **A4. Timestamp-Based Sync Conflict Resolution**:
  - Cloud and local project synchronization strictly enforces newer edit wins (`(p.updatedAt || 0) > (existing.updatedAt || 0)`), preventing offline work loss.
- **A5. Isolated Project Storage & Sync Loops**:
  - `saveProject()` and `saveProjectImmediately()` support `{ makeActive: false }`, preventing background sync sweeps from altering the user's active project selection.
- **A6 & A7. History Isolation & Pure State Updaters**:
  - Undo/redo queues (`history`/`future`) are cleared upon switching or creating projects.
  - `handleUpdateActiveProject` computes `next` state outside `setProjects()`, preserving React StrictMode purity and triggering debounced storage externally.
- **C. Clean Skip & Initialization Protocols**:
  - Added `handleSkipStep()` in `App.tsx` ensuring skipped wizard steps are not erroneously recorded into `completedSteps`.
  - New projects initialize cleanly at Step 1 (`completedSteps: []`).
- **D. APCA-W3 Algorithmic Enhancements**:
  - Upgraded `computeApcaLc()` using `culori`'s `rgb()` parser to support hex, rgb, rgba, hsl, and named colors.
  - Added APCA-W3 soft black clamping (`blkThrs = 0.022`, `blkClmp = 1.414`) and `-0.027` offset without `NaN` exceptions.

### Product, Export, Testing & Roadmap Polish (Complete 05_PRODUCT_EXPORT_TESTING_AND_ROADMAP Implementation)
- **Universal Multi-Format Code & Token Exports**:
  - Added self-hosted `@font-face` and Fontsource variable declarations (`fonts.css`) for GDPR compliance and zero external CDN requests.
  - Added native Figma Variables JSON output (`figma.variables.json`) with multi-mode collections (`Light` & `Dark`), mapping semantic colors, radii, and spacing.
  - Added Amazon Style Dictionary configuration (`style-dictionary.config.json`) with transform groups for CSS, SCSS, TypeScript, and flat JSON.
  - Added legacy Tailwind CSS v3 configuration exporter (`tailwind.v3.config.js`) supporting existing v3 projects alongside Tailwind 4 `@theme`.
  - Added SCSS variables and theme mixins (`tokens.scss`) with `@mixin theme-light` and `@mixin theme-dark` parity.
  - Standardized version headers (`@schemaVersion 1.0.0`, `@generatorVersion 1.6.0`, `@generatedAt`, `@generator Design System Studio`) across all 13 export formats.
  - Expanded Starter ZIP bundle (`exportStarterZip`) with all 13 token files, accessible component primitives (`Button.tsx`, `Card.tsx`, `Input.tsx`, `Badge.tsx`), and comprehensive README.
- **Pre-Export Accessibility Validation Gate**:
  - Implemented real-time pre-export validation in `Step11ExportCenter.tsx` auditing all semantic contrast pairs across light and dark modes.
  - Surfaces a prominent notice if any contrast pairs fail WCAG 2.2 AA standards, with failing pair details.
  - Integrated 1-click "Auto-Fix All Ratios" leveraging OKLCH lightness nudging to restore full compliance while preserving brand hue and chroma.
- **Shareable Hosted Preview Links**:
  - Built shareable link engine (`createShareableUrl` and `decodeShareableData`) encoding design tokens into URL hash state (`#/share?data=...`).
  - Added dedicated read-only `SharedProjectPreview.tsx` view allowing external stakeholders to test tokens in the responsive live preview frame, toggle light/dark modes, switch viewports, download the starter ZIP, or fork into the studio.
- **AI Design Assist & Privacy-Friendly Telemetry**:
  - Created `src/services/aiDesignAssist.ts` featuring Gemini AI brand-to-tokens generation, marketing copy synthesis, and natural language palette extraction.
  - Built resilient deterministic offline heuristic fallbacks for zero downtime when API keys are not provided.
  - Built privacy-friendly local telemetry helper (`src/utils/telemetry.ts`) tracking key product milestones without third-party tracking scripts.
- **Comprehensive Testing & Repository Standards**:
  - Added round-trip serialization identity verification suite (`tests/tokens/roundtripExport.test.ts`).
  - Added Doc 05 integration suite (`tests/integration/doc05ProductExportRoadmap.test.ts`).
  - Added project `LICENSE` (MIT), `CONTRIBUTING.md`, and `SECURITY.md`.
  - Updated `README.md` with complete architecture index, env var table, and quickstart commands.
  - All 23 test suites passing (144/144 tests), strict TypeScript compilation clean (`tsc --noEmit` 0 errors).

### Design, Accessibility & Content Polish (Complete 04_DESIGN_ACCESSIBILITY_AND_CONTENT Implementation)
- **Universal Keyboard & Screen Reader Accessibility**:
  - Added an accessible "Skip to main content" link (`#main-content`) with high-contrast visible focus styling (`src/App.tsx`).
  - Added semantic landmark regions: `<header role="banner">`, `<nav aria-label="...">`, `<main id="main-content" role="main">`, and live status regions (`role="status" aria-live="polite"`).
  - Added global `:focus-visible` ring in `src/index.css` (2px solid `#b7410e`, offset 2px) guaranteeing WCAG 2.2 SC 2.4.11/2.4.13 compliance for all interactive controls, buttons, links, inputs, and sliders.
  - Sized interactive controls with minimum 24×24px touch targets (and 28–36px comfortable targets on buttons, pills, and tabs).
  - Titled the preview iframe (`title="Live website preview"`) and added descriptive `aria-label="Interactive live website preview"`.
- **Accessible Focus-Trapped Modals**:
  - Created reusable `useFocusTrap` hook (`src/utils/useFocusTrap.ts`) enforcing WCAG 2.2 focus trapping, Escape key dismissal, and return-to-trigger focus restoration.
  - Implemented across all 5 modals: `ConfirmModal`, `KeyboardShortcutsModal`, `LegalModal`, `OAuthModal`, and `FontPickerModal` with `role="dialog"`, `aria-modal="true"`, and `aria-labelledby`.
- **Accessible Sliders & Color Wheel**:
  - Upgraded `ColorWheelPicker.tsx` with full keyboard accessibility: arrow keys adjust Hue (←/→ by 5°) and Saturation (↑/↓ by 5%), with `role="slider"`, `aria-valuenow`, `aria-valuetext`, `touch-action: none`, and touch event handlers.
  - Added explicit descriptive labels on Lightness slider, HEX input, and recommended palette buttons.
- **Physics-Based Motion Tokens & Reduced-Motion Support**:
  - Created standardized motion tokens (`fast`, `base`, `slow`, `stiff`, `gentle`) in `src/tokens/motionConfig.ts` with `getAccessibleTransition()`.
  - Upgraded `Interactive3DCanvas.tsx` to detect `prefers-reduced-motion` in JS, canceling continuous spinning loops and rendering a calm static scene when requested.
  - Upgraded `StepTransition.tsx` to honor `prefers-reduced-motion` by removing spatial translation animations.
- **RTL Internationalization Support**:
  - Implemented automatic RTL detection in `PreviewFrame.tsx` (`tokens.meta.scripts` containing Arabic, Hebrew, Farsi, or Urdu, or `direction === 'rtl'`), applying `dir="rtl"` and `lang="ar"` to the preview DOM.
- **Visual Design System Dogfooding & Asset Optimization**:
  - Refactored `DesignSystemAnatomy.tsx`, eliminating 50 hardcoded hex colors in favor of semantic studio tokens (`text-ink`, `bg-clay`, `text-clay`, `border-rule`) with dark-mode support.
  - Optimized `public/logo.png` from 1.01 MB down to 214 KB (78.8% reduction).
  - Generated dedicated 1200×630 Open Graph banner (`public/og-image.png`) and updated `index.html` tags.
- **Founder-Friendly Content & Microcopy**:
  - Enriched all 11 step definitions in `stepDefinitions.ts` with `estimatedTime` (~1–3 min), `whatYouGet`, and `whyItMatters` guidance.
  - Replaced opaque technical jargon with plain-language subtitles across the wizard.
  - Updated `PROJECT_DOCUMENTATION.md` to accurately document the 11 modular steps, 10 export targets, and offline-first storage sync.
- **21 Test Suites & 129 Tests Passing**:
  - Created `tests/integration/doc04DesignA11yContent.test.ts` verifying reduced motion, microcopy completeness, color wheel math, and RTL detection.

### Security & Backend Hardening (Complete 01_SECURITY_AND_BACKEND Implementation)
- **Eliminated Global Server Login Session (🔴 S2)**:
  - Replaced unsafe module-level variable (`currentActiveSession`) with stateless, cryptographically signed per-user session cookies (`dss_session`) using HMAC-SHA256 (`api/session.ts`).
  - Isolated concurrent sessions across users: user logins never overwrite other users, and requests verify individual session tokens.
  - Dropped `accessToken` completely from stored session cookies and user payloads; client and server only retain verified identity claims (`id`, `name`, `email`, `avatar`, `provider`).
- **Gated Custom Impersonation Login (🔴 S3)**:
  - Gated `POST /auth/custom-login` with a hard production block (`NODE_ENV === 'production'` returns 403 Forbidden).
  - In development/demo, accounts are explicitly tagged with `provider: 'demo'` and labeled `(Demo)`.
- **Server-Side Google ID Token Verification (🔴 S4)**:
  - Replaced blind client profile trust in `POST /auth/google-session` with upstream Google token verification (`https://oauth2.googleapis.com/tokeninfo`).
  - Enforced audience verification against the configured `OAUTH_CLIENT_ID`, token expiration, and email verification.
- **Cryptographic OAuth CSRF Protection & PKCE (🔴 S5)**:
  - Generated cryptographically secure random `state` and PKCE `code_challenge` / `code_verifier` pairs via `crypto.randomBytes` (`api/session.ts`).
  - Stored signed `dss_oauth_state` in a short-lived `HttpOnly; SameSite=Lax` cookie and verified strict equality on `/auth/callback`. Rejected CSRF tampering with 403 Forbidden.
- **Reflected HTML Injection Prevention (🔴 S6)**:
  - Created universal `escapeHtml` utility in `api/session.ts`.
  - Escaped all interpolated error messages, user names, and emails in the OAuth callback response page.
  - Sanitized script JSON serialization (`\\u003c` and `\\u003e`) preventing `</script>` breakouts.
- **Target Origin postMessage Restriction (🟠 S7)**:
  - Replaced wildcard `window.opener.postMessage(..., '*')` with the verified target origin derived from state and redirect URI.
  - Client-side `AuthContext.tsx` strictly validates `event.origin === window.location.origin` without permissive wildcard matching.
- **Removed Access Token Client-Side Persistence (🟠 S8)**:
  - Dropped `accessToken` from `dss_google_user_session_v2` and React context state.
- **Memory-Safe Rate Limiter & Stricter Auth Thresholds (🟠 S9)**:
  - Enabled `app.set('trust proxy', 1)` and safe IP extraction.
  - Added periodic 5-minute garbage collection and a 5,000-entry ceiling to prevent memory leaks.
  - Implemented differentiated rate limits: 20 req/min for sensitive `/auth/*` routes, 60 req/min for general API endpoints.
- **Content Security Policy & Strict Headers (🟠 S10)**:
  - Updated CSP allowing `https://accounts.google.com/gsi/client` and Google token endpoints.
  - Added `Strict-Transport-Security` (HSTS) in production environments.
- **Removed Hardcoded Credentials & Added Local Avatars (🟡 S11)**:
  - Removed all hardcoded client ID string fallbacks in `api/index.ts` and `src/context/AuthContext.tsx`.
  - Created `src/utils/avatar.ts` generating local SVG initials avatars, eliminating third-party DiceBear requests that leaked user emails.
  - Enforced 100kb JSON body size limit default.
  - Removed leaked credentials archive and uncommitted secret JSON files.
- **Transparent Offline-First Local & Tab Sync (🟡 S12)**:
  - Clarified `src/services/projectSync.ts` to document offline-first local storage and `BroadcastChannel` multi-tab sync, removing misleading cloud/Firestore claims.
  - Updated `.env.example` with full configuration reference (`SESSION_SECRET`, `GOOGLE_FONTS_API_KEY`, etc.).

### Architecture, Code Quality & Performance (Complete 03_ARCHITECTURE_CODE_QUALITY_PERFORMANCE Implementation)
- **Eliminated Redundant Lockfile**:
  - Removed duplicate `bun.lock`, standardizing on `package-lock.json` for deterministic npm CI builds.
- **Image Asset Optimization & Deduplication**:
  - Resized `public/favicon.png` from 1.24 MB (1402×1122) down to 8.2 KB (64×64 PNG) — 99.3% file size reduction.
  - Resized `public/icon.png` from 1.24 MB down to 67.6 KB (192×192 PNG) — 94.6% reduction.
  - Deleted unreferenced, multi-megabyte duplicate artwork files (`Colorful Design System Studio Logo.png`, `Glossy Gradient Design D Icon.png`, `logo-original.png`, and `logo-tight.png`).
- **Google Fonts Preload Optimization (`index.html`)**:
  - Removed massive 24-family blocking Google Font `<link>` tag from `index.html`.
  - Limited preloaded web fonts to the 3 essential studio UI families (`Inter`, `JetBrains Mono`, `Plus Jakarta Sans`); remaining preview fonts load dynamically on demand in the Font Picker.
- **Production-Safe Structured Logger (`src/utils/logger.ts`)**:
  - Created zero-dependency `logger` providing `.debug()`, `.info()`, `.warn()`, and `.error()` with timestamps and logging levels.
  - Suppresses verbose debug/info output in production builds and replaced unformatted `console.error` and `console.warn` calls across the project.
- **Zod Schema Validation for Untrusted Imports (`src/utils/projectSchema.ts`)**:
  - Authored strict Zod validation schemas (`designProjectSchema`, `designTokensSchema`) with deep type checks for primitives, semantics, typography, space, radius, shadow, motion, and metadata.
  - Guarded JSON file import with `validateProjectData` and `validateTokensData` before writing to storage, preventing malformed objects from corrupting user state.
- **Debounced Persistence & Quota Exceeded Handling (`src/utils/storage.ts`)**:
  - Implemented 350ms debounced persistence (`saveProject`) to eliminate storage thrashing on rapid slider drags and color wheel rotations.
  - Provided synchronous `saveProjectImmediately` for explicit button saves and step changes.
  - Wrapped `localStorage.setItem` in a `try/catch` catching browser `QuotaExceededError` / `NS_ERROR_DOM_QUOTA_REACHED` and dispatching a custom `dss:storage-quota-exceeded` DOM event with a toast warning.
- **Unified Preview System (`src/components/preview/LiveWebsitePreview.tsx`)**:
  - Completely refactored `LiveWebsitePreview.tsx` (reduced from 561 lines to ~170 lines) to embed the responsive `/preview-frame` iframe.
  - Replaced ad-hoc preview markup with postMessage token synchronization, responsive viewport switching (mobile, tablet, desktop), light/dark mode toggling, and fullscreen support.
- **URL Hash Routing (`src/utils/router.ts` & `src/App.tsx`)**:
  - Built bidirectional URL hash router supporting `#/`, `#/dashboard`, `#/project/:id/step/:step`, and `#/project/:id/workspace`.
  - Added browser back/forward and deep link handling via `window.addEventListener('hashchange', ...)`.
  - Synchronized hash on navigation without full page reload.
- **Route-Level Code Splitting & Dynamic Imports (`src/App.tsx`)**:
  - Implemented `React.lazy` and `<Suspense>` for `LandingPage`, `ProjectDashboard`, `WorkspaceView`, and all 11 wizard steps (`Step1CategoryGenre` ... `Step11ExportCenter`).
  - Created accessible, animated `StepLoader.tsx` fallback.
  - Decoupled `stepDefinitions.ts` from static step component imports, enabling true dynamic chunk loading.
  - Slashed main application bundle from **1.49 MB** down to **239.25 kB** (60.14 kB gzip) — well under the 400 kB target budget.
- **Comprehensive Integration Test Suite**:
  - Created `tests/integration/doc03ArchitecturePerformance.test.ts` covering routing, Zod schema validation, step definition decoupling, and logger utilities.
  - 20 test files, 122 tests passing with 0 failures, and 100% clean TypeScript compile (`tsc --noEmit`).

### Page-by-Page UX & Flow Enhancements (Complete 02_PAGE_BY_PAGE_UX_AND_FLOW Implementation)
- **Eliminated 14 vs 11 Steps Mismatch**:
  - Deleted 9 legacy 14-step orphan files (`Step1ProjectInit`, `Step2WebsiteType`, `Step3BusinessDiscovery`, `Step4BrandPersonality`, `Step7TypographyStudio`, `Step11MobileResponsive`, `Step12ThemesAccessibility`, `Step13FinalReview`, `Step14ExportCenter`).
  - Synchronized all UI copy, navigation links, and footers across the application to "Step X of 11".
  - Updated `WorkspaceView.tsx` 1-click edit buttons to route to correct 11-step numbers (Colors: 5, Typography: 6, Layout: 7, Components: 8, Motion: 9, Audit: 10).
- **Global Flow, Validation & Keyboard Navigation (`App.tsx`)**:
  - Computed reactive `canContinue` validation (requiring genre in Step 1, project name in Step 2) and passed it to `WizardNav`, disabling "Continue" when invalid and showing toast guidance.
  - Hardened global `handleGlobalKeyDown` arrow-key navigation to ignore inputs, textareas, selects, `role="slider"`, `role="tab"`, `role="radio"`, `role="radiogroup"`, `.color-wheel`, and range inputs.
  - Guarded `D` dark-mode key from firing when typing in any form control.
  - Built accessible `ConfirmModal.tsx` and replaced native `window.confirm` / `alert` across `App.tsx`, `ProjectDashboard.tsx`, and `LandingPage.tsx`.
  - Implemented complete 11-step reset logic in `handleConfirmResetStep`, safely restoring default tokens per step.
- **Step 1: Category & Genre (`Step1CategoryGenre.tsx`)**:
  - Added interactive "I'm not sure" 3-question Archetype Quiz modal recommending best-fit website genres based on purpose, mood, and density.
  - Added "Recently Selected Genres" pill bar persisted in `localStorage` (`dss_recent_genres_v1`).
  - Added full keyboard operability to genre cards (`tabIndex={0}`, `role="button"`, `onKeyDown` with Enter/Space).
- **Step 2: Project Scope & Business Context (`Step2ProjectBusiness.tsx`)**:
  - Added required `*` indicators and inline validation with character counters for Project Name (max 60) and Brand Description (max 180).
  - Implemented automatic kebab-case slug generation on project name changes.
  - Added AI Context Autofill helper synthesizing descriptions, conversion goals, and target audiences.
  - Added URL validation hints on inspiration sites and eliminated all `any` types.
- **Step 3: Brand Personality (`Step3BrandPersonality.tsx`)**:
  - Added accessible slider controls (`role="slider"`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-valuetext`, visible min/max labels).
  - Added real-brand analogies on preset cards ("like Kinfolk & Aesop", "like Linear & Stripe", "like Vitra & Braun", "like Spotify & Figma").
  - Added live "What Changes" impact chips showing real-time spring physics, spatial density, and corner curvature calculations.
- **Step 4: Visual Direction (`Step5VisualDirection.tsx`)**:
  - Surfaced visible "Compare / Apply" bar directly in the UI.
  - Added direction impact summary chips showing radius presets and palette tones on each card.
- **Step 5: Color Studio (`Step6ColorStudio.tsx`)**:
  - Added in-step Colorblind Vision deficiency simulator (Normal, Protanopia, Deuteranopia, Tritanopia, Achromatopsia) dispatching real-time preview SVG filters.
  - Displayed APCA Lightness Contrast (Lc) score directly alongside WCAG 2.2 AA contrast ratios.
  - Added contrast badges directly on all 5 semantic color swatches.
  - Eliminated hardcoded hex fallbacks in favor of active semantic tokens.
- **Step 10: Review & Audit (`Step10ReviewAudit.tsx`)**:
  - Replaced ambiguous ternaries with an explicit issue ID mapping table and fallback warning.
  - Added multi-dimensional compliance cards: Focus-Visible (SC 2.4.11), Target Size Minimum (24×24px SC 2.5.8), and Fluid Responsive Scale (360px → 1280px).
  - Added before/after auto-fix feedback with an "Undo Auto-Fix" button.
  - Added Downloadable Audit Report (JSON) with full compliance breakdown.
- **Step 11: Export Center (`Step11ExportCenter.tsx`)**:
  - Added interactive Starter ZIP file tree and live file content code viewer.
  - Added copyable self-hosted Fontsource terminal command and StackBlitz cloud playground launch button.
  - Added visual loading states and error handling for PDF and PNG exports.
- **Project Dashboard (`ProjectDashboard.tsx`)**:
  - Added search filtering by name, category, and direction.
  - Added sort dropdown (Recently Updated, Recently Created, Alphabetical).
  - Added Grid vs List view mode toggle.
  - Added LocalStorage capacity meter and 75% warning badge.
  - Added Soft-Delete with Undo toast.
  - Replaced import `alert` with an informative import status report modal.
- **Workspace View (`WorkspaceView.tsx`)**:
  - Added dedicated "Usage Guidelines & Docs" tab generating comprehensive brand design system documentation, token usage rules, and copy-paste Tailwind 4 / CSS themes.
  - Updated all 1-click edit buttons to point to valid 11-step numbers.
- **Automated Testing**:
  - Created `tests/integration/doc02PageByPageUx.test.ts` verifying `canContinue` validation gates, slug auto-generation, 11-step reset integrity, APCA contrast calculations, and starter ZIP exports.
  - 18 test files passing (108/108 tests passing), 0 TypeScript lint errors, and successful production build.

---

## [1.5.0] - 2026-11-15

### QA, Security, Performance & Deployment Architecture (Doc 05 Complete Implementation)
- **Multi-Layer Testing Strategy (Doc 05 §1)**:
  - Unit & Integration testing with Vitest: 17 test suites (98/98 tests passing).
  - Coverage: color scales, contrast, `nudgeToContrast`, `fluid`, `scaleSize`, `scorePair`, typography guardrails, token reducer (undo/redo), exporters (snapshots & round-trip), migrations, security headers, rate limiting, and health endpoints.
- **Security & Privacy Hardening (Doc 05 §2)**:
  - Eliminated bogus "client-side encryption" claims; replaced with plain, Zod-verified JSON persistence.
  - Server-side secrets protection: zero API keys or secrets exposed to client-side bundles.
  - Rate limiting middleware: 60 requests/min per IP on API and backend routes.
  - Security headers: Content-Security-Policy (CSP allowing Google Fonts and same-origin frames), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: SAMEORIGIN`, and `Permissions-Policy`.
  - Secure `postMessage` protocol: strict `event.origin !== window.location.origin` validation on both host and iframe.
  - Project JSON import guard: 2 MB maximum payload limit, Zod validation, zero `eval` or unsanitized HTML injection.
- **Performance Budgets & Code Splitting (Doc 05 §3)**:
  - Lightweight preview updates (<16 ms) via runtime CSS custom property updates.
  - Three.js 3D canvas with `prefers-reduced-motion` detection and unmount cleanup.
  - Lazy loading of font subsets using `&text=` glyph subsetting.
- **Studio UX & Keyboard Navigation (Doc 05 §4)**:
  - Autosave indicator in navigation bar (`"Saved ✓ just now"`, `"Saved ✓ X s ago"`).
  - Multi-project dashboard with create, duplicate, rename, delete (confirm), and JSON import/export.
  - Full keyboard shortcuts: `←/→` step navigation, `Cmd/Ctrl+Z` undo, `Cmd/Ctrl+Shift+Z` / `Ctrl+Y` redo, `C` compare, `D` dark mode toggle, and `?` cheat-sheet modal (`KeyboardShortcutsModal`).
  - Mobile ergonomics: floating bottom dock (`Questions (X/11)` vs `Live Site`), sticky Apply/Cancel ribbon, and large touch targets (≥ 44×44px).
- **Deployment & Observability (Doc 05 §5)**:
  - Production `/health` and `/healthz` endpoints returning system status, version (`1.4.0`), and security headers.
  - Unified local dev server with `tsx server.ts` and Vercel serverless functions in `api/index.ts`.
  - Same-origin SPA `/preview-frame` route for preview iframe.
- **Legal & Content Hygiene (Doc 05 §6)**:
  - Verified permissive open-source licenses in `ATTRIBUTIONS.md` (SIL OFL 1.1 for fonts, Unsplash terms for imagery, ISC for Lucide, MIT for Culori/Three.js/Motion/Zod).
  - In-app `LegalModal` providing Terms of Service and Privacy Policy.

---

## [1.4.0] - 2026-11-15

### Tokens, Color, Accessibility & Export Architecture (Doc 04 Complete Implementation)
- **Three-Tier Token Architecture & Zod Master Schema (Doc 04 §1)**:
  - Primitive → Semantic → Component three-tier architecture strictly maintained.
  - Master type `DesignTokens` with `schemaVersion: 1`, single source of truth for all templates and component showcases.
  - Re-export `migrate` alias per Doc 04 §1.1 alongside `migrateTokens` and `importDesignTokensFromJson`.
  - Zero raw hex values in components or templates: all styles consume CSS custom properties derived from semantic mappings.
- **OKLCH Color Scale & Harmony System (Doc 04 §2.1 & §2.2)**:
  - 11 perceptually uniform steps (50 to 950) generated with `culori` targeting exact lightness array `[0.97, 0.93, 0.86, 0.78, 0.70, 0.62, 0.54, 0.46, 0.38, 0.30, 0.22]`.
  - Monotonic lightness descent verified across 50 diverse colors spanning all hues.
  - Brand-tinted neutral scale (0.008–0.014 chroma) avoiding sterile dead grays.
  - Functional status scales (success 145°, warning 85°, danger 25°, info 240°) with OKLCH harmonies (complementary, analogous, triadic, split-complementary, monochrome).
- **Light & Dark Semantic Role Mappings (Doc 04 §2.3)**:
  - Separate light and dark semantic mapping rules per Table 2.3: `bg.default` (neutral 50/950), `bg.surface` (white/neutral 900), `bg.elevated` (white/neutral 800), `fg.default` (neutral 900/50), `fg.muted` (neutral 600/400), `border.default` (neutral 200/700), `action.primary` (brand 600/400).
- **Computed WCAG 2.2 Contrast Engine & Auto-Fix (Doc 04 §2.4)**:
  - `ratio(fg, bg)` and `grade(r, large)` with AAA (≥7:1), AA (≥4.5:1 / ≥3:1 large), and Fail.
  - `nudgeToContrast(fg, bg, target)` auto-fixes failing colors in 0.01 OKLCH-L increments while maintaining hue within ≤3°.
  - `auditSemanticContrast(semantic)` auditing 10 critical pairs in both light and dark.
  - Informational APCA Lightness Contrast (Lc) score calculation.
- **Colorblind Simulation & Status Accessibility (Doc 04 §2.5)**:
  - Real-time Protanopia, Deuteranopia, Tritanopia, and Achromatopsia simulation via SVG `feColorMatrix` filters on the live preview iframe.
  - Enforced pairing of icons and text labels alongside status colors so interfaces never rely on hue alone.
- **Components & State Matrix Showcase (Doc 04 §4)**:
  - Implemented comprehensive `ComponentsShowcase.tsx`:
    - Buttons: filled, outline, subtle, ghost, destructive, loading, disabled; sm, md, lg sizes.
    - Form Controls: outline input, filled input, select dropdown, error validation with helper text.
    - Cards: flat, outlined, elevated (with brand-tinted shadows).
    - Status Badges & Alerts: info, success, warning, danger with icons + labels.
    - Links: inline underlined, standalone arrow link.
    - Accessible focus appearance: 2–3px ring, offset 2px, contrast ≥ 3:1.
- **Complete 10-Format Export Center & Starter ZIP (Doc 04 §5)**:
  - 1. Tailwind CSS 4 theme (`theme.css`) with `@theme inline` and fluid modular scale clamps.
  - 2. CSS custom properties (`tokens.css`) with `:root` and `.dark`.
  - 3. W3C Design Tokens Community Group (`tokens.json`) with `$value`, `$type`, and aliases.
  - 4. TypeScript definitions (`tokens.ts`) with `as const` and strict typing.
  - 5. shadcn/ui theme (`shadcn-theme.css`) with standard CSS variables.
  - 6. Figma Tokens Studio (`tokens.studio.json`) JSON format.
  - 7. 4-Page PDF specification (`design-spec.pdf`) with computed color ramps and contrast tables.
  - 8. Specimen board PNG (`board@2x.png`, 1600×1000).
  - 9. Project state file (`project.dss.json`) re-importable with schemaVersion: 1.
  - 10. Starter ZIP (`starter.zip`) with all tokens, README, font installation guide, and full sample component suite (`Button.tsx`, `Card.tsx`, `Input.tsx`, `Badge.tsx`).
- **Automated Verification**:
  - All 16 test suites passing (94/94 tests).
  - TypeScript `tsc --noEmit` compiling with 0 errors.
  - Production build compiling cleanly in 2.25s.

---

## [1.3.0] - 2026-11-15

### Typography & Font System Architecture (Doc 03 Complete Implementation)
- **Role-Based Typography Architecture (Doc 03 §1 & §2)**:
  - Six semantic roles supported: `display`, `heading`, `body`, `ui`, `mono`, `accent`.
  - Deterministic role derivations: `display = heading`, `ui = body`, `accent = null`, `mono = null`.
  - Advanced per-role overrides for weight, line-height, letter-spacing, and text-transform.
- **Google Fonts API Proxy with Snapshot Fallback (Doc 03 §3)**:
  - `/api/fonts` route with 4s abort timeout, upstream popularity sorting, and `Cache-Control: s-maxage=86400, stale-while-revalidate=604800`.
  - Automatic fallback to `src/data/fonts.snapshot.json` (~400 curated fonts) with `npm run fonts:snapshot` update script.
- **Font Catalog & Picker Modal Enhancements (Doc 03 §5)**:
  - Added "≥ 4 weights" filter checkbox to ensure body candidates have adequate style depth.
  - Implemented keyboard navigation (`ArrowDown`, `ArrowUp`, `Enter`, `Escape`) across the font catalog.
  - Added real-time hover-to-preview (`onHoverFont` & `onClearHover`) to dynamically preview candidate fonts on the live site before selection.
  - Highlighted missing script warning tags when viewing multi-script languages (Devanagari, Gujarati, Arabic, Cyrillic).
- **Recommendation & Pairing Engine (Doc 03 §6)**:
  - Aligned `scorePair()` scoring constants with Doc 03 §6.2: curated pairs (+50), contrast (+15), same-category penalty (-15), single-family cohesion (+8), regular+bold (+5), italic (+3), variable (+3), popularity rank bonus, and genre tag overlap.
  - Expanded `CURATED_PAIRS` with all combinations from Doc 03 §6.3 (Fraunces + DM Sans/Inter, Geist + Geist/Inter, Michroma/Space Grotesk + Plus Jakarta Sans/Inter, Syne/Bricolage Grotesque + Inter, Newsreader/Source Serif 4 + Inter, IBM Plex Sans + IBM Plex Sans/Mono, Nunito/Outfit + Lexend/Atkinson Hyperlegible, Manrope + DM Sans, Poppins + Noto Sans Devanagari, Noto Serif Gujarati + Noto Sans Gujarati).
  - Hard script filtering in `getRecommendedBodyFonts` ensuring only fonts supporting user's required scripts are recommended.
- **Fluid Modular Typography Scaling (Doc 03 §7)**:
  - `scaleSize(basePx, ratio, step)` and `fluid(minPx, maxPx, minVw, maxVw)` linear interpolation.
  - Calmer mobile ratio (`Math.min(ratio, 1.2)`) preventing oversized headers on phone viewports.
- **Typography Guardrails Engine (Doc 03 §8)**:
  - Added `total-font-files` guardrail: warns when total font files > 6 (`"Consider fewer weights/styles to keep the page fast."`).
  - Evaluated payload budget (approx. 70 KB per variable font, 25 KB per static weight file), warning at > 150 KB.
  - Body rules: minimum 16px size check, blocks `display`/`handwriting` categories, warns if lacking 400 or 700 weights, and verifies required non-latin scripts.
  - Heading and body category contrast warning for muddy same-category different-family pairs.
  - Studio summary card displays `Performance: X families • Y files • ≈ Z KB ✅`.
- **Live Preview & FOUT Elimination (Doc 03 §4 & §12)**:
  - `applyTokens.ts` dynamically extracts exact used weights per family and debounces rapid hover preview requests (150 ms).
  - Preloads critical weights using `document.fonts.load()` to eliminate FOUT flash.
- **Production Exporters Integration (Doc 03 §10)**:
  - `exportTailwind4`: Generates `@theme inline` with fallback stacks, `--font-heading`, `--font-body`, `--font-mono`, and fluid `--text-xs` through `--text-6xl` scale clamp tokens.
  - `exportDtcgJson`: Emits standard W3C DTCG `typography` token groups with `fontFamily`, fluid `fontSize`, `fontWeight`, `lineHeight`, and `letterSpacing`.
  - `exportStarterZip`: README generates dual installation pathways (self-hosted Fontsource with static weight fallback, and Google Fonts `<link>` CDN snippet with `<link rel="preload">` layout shift mitigation).
- **Automated Verification**:
  - 16 test suites passing (94/94 tests).
  - TypeScript `tsc --noEmit` passing with 0 errors.
  - Production build compiling cleanly in 2.41s.

---

## [1.2.0] - 2026-11-15

### Template-First Flow & Live Preview Architecture (Doc 02 Complete Implementation)
- **32 Genre Configurations with Rich Archetype Defaults (Doc 02 §4.2)**:
  - All 32 website genres across 8 categories configured with `createGenreDefaults()` providing tailored starting tokens (OKLCH color scales, typography pairing, radius scale, spatial density, button styles, and imagery treatments).
  - Created placeholder copy JSON repository in `src/preview/genres/copy/` for all 8 categories (`commerce`, `saas`, `portfolio`, `publishing`, `hospitality`, `education`, `architecture`, `finance`).
  - Added `SectionRef` interface for custom section overrides.
- **Formal Step Definition Registry (Doc 02 §5)**:
  - Created `src/components/wizard/stepDefinitions.ts` implementing `StepDefinition` interface (`id`, `number`, `title`, `subtitle`, `category`, `help`, `focusSection`, `tokenPaths`, `Component`, `isComplete`).
  - Connected step focus section auto-scroll via `getStepFocusSection(currentStep)` sending `SCROLL_TO` postMessage.
  - Resolved aliases in `PreviewFrame.tsx` for smooth scrolling to `hero`, `type-specimen`, `components-showcase`, `gallery`, `pricing`, `products`, `booking`, `courses`, `projects`, etc.
- **Compare (A/B) Toggle Engine (Doc 02 §6)**:
  - Implemented interactive before/after comparison toggling between pinned/committed Option A and preview draft Option B.
  - Wired to ribbon button and global `C` keyboard hotkey with responsive toast guidance.
- **Personality-to-Preset Deterministic Calibration (Doc 02 §7)**:
  - Created `src/tokens/personalityMapping.ts` implementing the mathematical calibration of energy, craft, voice, formality, and density sliders into preset bundles.
- **Complete View & Step Reload Restoration (Doc 02 §8)**:
  - Active view (`wizard`, `workspace`, `dashboard`) and active step are saved in `localStorage` and synchronized with URL search parameters (`?view=wizard`), allowing page reloads to restore the exact project and step in progress.
- **Component Option Hover-to-Preview (Doc 02 §6 & §8)**:
  - Wired live draft preview and dismiss on button variants (Primary Filled, Outline Hairline, Subtle Tinted, Ghost Minimal) and button size scales in `Step10ComponentsStudio.tsx`.
- **Token Purity & Quality Assurance**:
  - Replaced fallback literals in `applyTokens.ts` so `src/preview/` templates and sections maintain 100% token purity (zero hardcoded hex colors, zero hardcoded font names).
  - Added `tests/tokens/personalityMapping.test.ts` and `tests/preview/viewportResponsive.test.ts`.
  - Expanded `tests/preview/templateSystem.test.ts` to verify all 32 genres, 8 templates, copy files, and token isolation.
  - 16 test suites (91/91 tests) passing; `tsc --noEmit` passing with 0 errors; production build compiling in 3.05s.

---

## [1.1.0] - 2026-11-15

### Industrial Perfection & Live Dynamic Preview (Docs 00–05 Complete Alignment)
- **Template-First Reactive Preview Engine (Doc 02)**:
  - All 8 category templates (`commerce`, `saas`, `architecture`, `education`, `finance`, `hospitality`, `portfolio`, `publishing`) dynamically render user-defined business names, headlines, audience copy, and archetype badges.
  - Granular module toggling: enabled components directly govern live sections (`hero`, `products`, `pricing`, `booking`, `courses`, `gallery`, `articles`, `faq`, `testimonials`, `features`).
  - Unified `buttonStyle` CSS custom properties (`--button-bg`, `--button-fg`, `--button-border`, `--button-style`) dynamically updating button variants across templates.
  - Dynamic imagery treatment filters (`--image-filter`) applying natural, duotone, or monochrome photo grading across template imagery.
- **Hover-to-Preview & Apply Pipeline Across All Steps (Doc 02 §6)**:
  - Added live draft preview (`onPreviewDraft`) and dismiss (`onClearDraft`) across Step 1 (Category & Genre), Step 3 (Brand Personality), Step 4 (Visual Direction), Step 5 (Color Studio), Step 6 (Typography Studio), Step 7 (Shape, Spacing & Elevation), Step 8 (Components Studio), and Step 9 (Imagery, Icons & Motion).
  - Hovering any option previews it live on the iframe template in real time; clicking pins and commits via the action ribbon; leaving without applying restores clean preset state.
- **Four Foundational Pillars Architectural Polish (Doc 01 §2)**:
  - Eliminated horizontal top slicing divider across the accordion track.
  - Replaced with architectural vertical left accent indicator (`w-1 sm:w-1.5 bg-gradient-to-b`) for active blades.
  - Pinned sunset cloud is fully visible, scaled to `w-[min(38vw,500px)]` with frosted glassmorphic cards and soft drop-shadow.
  - Removed all duplicate/orphan mini-clouds from internal accordion panels.
- **Verification & QA**:
  - All 14 Vitest test suites (80/80 tests) passing cleanly.
  - Strict TypeScript check (`tsc --noEmit`) passes with 0 errors.
  - Production build (`vite build`) successfully compiling in 2.44s.

---

## [1.0.0] - 2026-10-30

### Complete Industrial Implementation (Docs 00–05 Full Alignment)
- **Token Architecture & Migration Engine (Doc 04 §1 & Doc 05 §2)**:
  - Strict 3-tier token system (`primitives` → `semantic` → `component`) validated by Zod with `schemaVersion: 1`.
  - Created `src/tokens/migration.ts` providing `migrateTokens()` and `importDesignTokensFromJson()` with a strict 2 MB payload size limit.
  - Implemented safe JSON import in `src/utils/storage.ts` supporting both full project backups and standalone `project.dss.json` token packages.
- **Color Science, Contrast & Colorblind Simulation (Doc 04 §2 & §6)**:
  - 11-step OKLCH scales with fixed perceptual lightness steps and brand-tinted neutral scales.
  - Unit-tested across 50 diverse colors verifying monotonic lightness descent and valid sRGB hex output.
  - `nudgeToContrast()` auto-steps OKLCH lightness while maintaining hue within $\le 3^\circ$.
  - Added APCA Lightness Contrast ($L_c$) calculation as an informational perceptual second opinion.
  - Real-time live colorblind simulation toolbar with SVG `<feColorMatrix>` filters (Protanopia, Deuteranopia, Tritanopia, Achromatopsia).
- **Typography Font System & Guardrails (Doc 03)**:
  - 6-role typography architecture (`display`, `heading`, `body`, `ui`, `mono`, `accent`) with modular scaling (`clamp()`).
  - Dual-mode Typography Studio (Pair Mode with `scorePair()` ranking vs Advanced Mode).
  - Virtualized lazy font picker (`FontPickerModal.tsx`) using Google Fonts `&text=` glyph subsetting.
  - Multi-script filtering for Latin, Devanagari, Gujarati, Arabic, and Cyrillic.
  - Comprehensive typography guardrails engine (`typographyGuardrails.ts`) checking family counts, body sizes, weights, and payload budgets (>150 KB).
- **Production Exporters & Starter Kit (Doc 04 §5)**:
  - 10 production export formats: Tailwind CSS 4 theme (`theme.css`), CSS variables (`tokens.css`), W3C DTCG JSON (`tokens.json` with `{color.brand.600}` aliases and dimension scales), TypeScript definitions (`tokens.ts`), shadcn/ui theme (`shadcn-theme.css`), Figma Tokens Studio (`tokens.studio.json`), PDF specification, specimen board PNG, project file (`project.dss.json`), and complete starter ZIP (`starter.zip`).
  - Added sample production `components/Button.tsx` and `components/Card.tsx` directly into the starter ZIP.
- **QA, Security, CI & Legal Hygiene (Doc 05)**:
  - Configured security headers (`X-Content-Type-Options: nosniff`, `Referrer-Policy`, `X-Frame-Options: SAMEORIGIN`) in `api/index.ts` and `vercel.json`.
  - Configured in-memory IP rate limiter (60 req/min/IP) on API routes.
  - Added `/healthz` endpoint alias alongside `/health`.
  - Added `scripts/generateFontSnapshot.ts` and `npm run fonts:snapshot`.
  - Configured GitHub Actions CI workflows (`.github/workflows/ci.yml` and `font-snapshot.yml`).
  - Created `ATTRIBUTIONS.md` documenting open font licenses (SIL OFL 1.1) and Unsplash imagery terms.
  - Created editorial `LegalModal.tsx` for Terms of Service and Privacy Policy.
  - Added live autosave elapsed time indicator ("Saved ✓ 2 s ago") in `WizardNav.tsx`.
- **Three.js Performance & Code-Splitting**:
  - Code-split `Interactive3DCanvas` into a lazy chunk via `React.lazy()` and `<Suspense>`, reducing initial landing bundle size.
  - Implemented accessible static fallback for users with `prefers-reduced-motion` or low-power devices.
- **Step 2: Project Scope & Demographic Targeting**:
  - Audience age demographic selector (18–35, 35–50, 50+); picking 50+ auto-calibrates base typography scale to 18px and nudges body contrast target to AAA (7:1).
  - Brand Hex code input and Image Logo upload with HTML5 Canvas pixel color extraction (`extractDominantColorFromImage`).
  - Inspiration URLs reference input, Platform target selector (Web only vs Web + App), Framework target selector (Tailwind CSS 4, Plain CSS, shadcn/ui), and Dark Mode policy.
- **Step 5: Color Studio & OKLCH Harmonies**:
  - 4 Start-from modes: Brand Color Wheel, Logo Upload, Curated 60-30-10 Presets, and AI-Style Mood Prompts.
  - OKLCH perceptual harmonies (Complementary, Analogous, Triadic, Split-Complementary, Monochromatic).
  - Brand and Accent color lock toggles to cycle palettes while preserving signature colors.
  - Live WCAG 2.2 AA Contrast Scorecard with instant "Nudge to AA (Auto-Fix)" button powered by `nudgeToContrast`.
- **Step 7: Shape, Spacing & Elevation**:
  - Spacing density multiplier: Airy (1.25×), Balanced (1.0×), Compact (0.8×) with 4px / 8px grid selection.
  - 4 Corner radius presets (`sharp`, `subtle`, `rounded`, `playful`) with standard `full: 9999`.
  - 4 Elevation shadow presets (`flat`, `soft`, `crisp`, `dramatic`) featuring brand-tinted low-alpha shadows.
- **Step 8: Components Studio**:
  - Interactive component showcase for Buttons (variants: filled/outline/subtle/ghost/destructive × sizes: sm/md/lg × states: default/hover/focus/disabled/loading).
  - Form controls with default, focused outline ring, error validation state with helper text, and disabled state.
  - Status badges and system alerts across neutral, success, warning, danger, and info roles.
- **Step 9: Imagery, Icons & Motion Physics**:
  - Motion physics level selector: None (0ms), Subtle (120–320ms), and Expressive (150–450ms spring physics `stiffness: 280, damping: 22`).
  - Icon set selection: Lucide, Phosphor, Tabler.
  - Icon style selection: Outline (1.75px), Filled, and Duotone.
  - Photo treatments: Natural daylight, brand-tinted duotone, and architectural monochrome.
- **Studio Keyboard Shortcuts**:
  - Global hotkeys: `ArrowRight`/`ArrowLeft` step navigation, `Cmd/Ctrl+Z` undo, `Cmd/Ctrl+Shift+Z` / `Ctrl+Y` redo, `C` draft compare, and `?` modal dialog (`KeyboardShortcutsModal.tsx`).
  - Dedicated shortcuts help button in the application header.
- **Verification**:
  - 33/33 tests passing across 8 test suites in Vitest.
  - TypeScript strict typecheck (`tsc --noEmit`) passes with 0 errors.
  - Vite production build (`vite build`) successfully compiling with 0 errors.

---

## [1.0.0-beta.1] - 2026-10-30

### Phase 1: 3-Tier Token Core Architecture
- **Single Source of Truth**:
  - Implemented typed `DesignTokens` master interface and Zod validation schema (`src/tokens/types.ts`).
  - Tier 1: Primitive color scales (11-step OKLCH lightness ramps for `brand`, `accent`, `neutral`, `success`, `warning`, `danger`, `info`).
  - Tier 2: Semantic color mappings (`bgDefault`, `bgSurface`, `bgElevated`, `fgDefault`, `fgMuted`, `actionPrimary`, `focusRing`, etc.) with separate light and dark palettes.
  - Tier 3: Component-level tokens for button radius, card elevation, and input styling.
- **Color Science & Contrast Engine**:
  - OKLCH scale generation with perceptual lightness curves and brand-tinted neutrals (`src/tokens/colorScale.ts`).
  - Real-time WCAG 2.2 AA contrast calculation using `culori` with `ratio()`, `grade()`, and automated `nudgeToContrast()` auto-fix (`src/tokens/contrastEngine.ts`).
  - `tokensToCssVars()` serializer for CSS custom properties.

### Phase 2: Reactive Iframe Preview Engine
- **Iframe Architecture**:
  - Embedded same-origin iframe route at `/preview-frame` (`src/preview/PreviewFrame.tsx`).
  - Full `postMessage` protocol (`INIT`, `TOKENS`, `MODE`, `SCROLL_TO` and `A11Y_RESULT`) with origin validation and `requestAnimationFrame` throttling.
  - Sizing wrapper enabling true CSS media queries on Phone (375px), Tablet (768px), and Desktop (100%).
- **Always-On Studio Controls**:
  - Integrated Viewport Switcher (Phone / Tablet / Desktop) in preview header.
  - Integrated Light / Dark Mode toggle in preview header.
  - Live WCAG 2.2 A11y Badge displaying computed passing/warning counts (`A11y: 14✓ 0✗`).
  - Draft preview-then-apply ribbon with undo/redo history stack (`canUndo`, `canRedo`).

### Phase 3: Template-First Flow & 8 Industry Archetypes
- **Template-First Architecture**:
  - Moved Category & Genre selection to Step 1: picking an industry category immediately opens its bespoke template.
  - 8 distinct category templates (`commerce`, `saas`, `portfolio`, `publishing`, `hospitality`, `education`, `architecture`, `finance`) built from a shared section registry (`src/preview/sections/`).
  - 32 detailed `GenreConfig` definitions covering diverse business archetypes (`src/preview/genres/`).
  - Enforced token-only styling: zero hardcoded colors, radii, or fonts in template components.
  - Every template ends with `ComponentsShowcase` (all button states, inputs, badges, alerts) and `TypeSpecimen` (H1–H6, body copy, code).
- **Streamlined 11-Step Guided Wizard**:
  - Step 1: Category & Genre (Template opens)
  - Step 2: Project Scope & Language Scripts
  - Step 3: Brand Personality (5 sliders: Energy, Craft, Voice, Formality, Density + deterministic preset suggestions)
  - Step 4: Visual Direction
  - Step 5: Color Studio
  - Step 6: Typography Studio
  - Step 7: Shape & Spacing (Radius, density, elevation)
  - Step 8: Website Components
  - Step 9: Imagery & Motion
  - Step 10: Review & Audit (WCAG 2.2 AA matrix with "Nudge to AA" auto-fix)
  - Step 11: Export Center

### Phase 4: Modern Typography System
- **Font Catalog & API**:
  - Created `/api/fonts` endpoint proxying Google Fonts developer API with caching headers and snapshot fallback (`src/data/fonts.snapshot.json`).
  - Built interactive `FontPickerModal` with live search, category filtering, script filtering (Latin, Devanagari, Gujarati, Arabic, Cyrillic), and variable font toggle.
- **Recommendation Engine**:
  - `scorePair()` algorithm scoring curated pairs and personality tag resonance (`src/utils/typeScale.ts`).
  - Curated pairing presets spanning editorial serifs, modern geometrics, monospace, and Indic multi-scripts.
- **Fluid Modular Scaling**:
  - Modular ratio calculation (1.200 to 1.618) with continuous `clamp()` formulas for responsive typography without layout shifts.

### Phase 5 & 6: Production Exporters & Verification
- **10 Export Deliverables**:
  1. Tailwind CSS 4 theme (`theme.css` with `@theme inline` and dark variants)
  2. CSS Custom Properties (`tokens.css` with `:root` and `.dark`)
  3. W3C Design Tokens DTCG JSON (`tokens.json` with `$type` and `$value`)
  4. TypeScript type-safe token definitions (`tokens.ts`)
  5. shadcn/ui Theme CSS (`shadcn-theme.css`)
  6. Figma Tokens Studio JSON (`tokens.studio.json`)
  7. 4-Page Vector PDF specification (`design-spec.pdf` with computed real values)
  8. Specimen Board PNG (`board@2x.png` 1600×1000)
  9. Project State JSON (`project.dss.json` with `schemaVersion: 1`, importable & exportable)
  10. Complete Starter ZIP (`starter.zip` with self-hosted font installation guide and README)
- **Quality Assurance**:
  - 26/26 unit tests passing across all token, scale, contrast, and exporter suites.
  - Strict TypeScript check (`tsc --noEmit`) passing with 0 errors.
  - Production build (`vite build`) successfully compiling with 0 errors.

---

## [1.1.0] - 2026-11-15

### Industrial Perfection & Live Dynamic Preview (Docs 00–05 Complete Alignment)
- **Template-First Reactive Preview Engine (Doc 02)**:
  - All 8 category templates (`commerce`, `saas`, `architecture`, `education`, `finance`, `hospitality`, `portfolio`, `publishing`) dynamically render user-defined business names, headlines, audience copy, and archetype badges.
  - Granular module toggling: enabled components directly govern live sections (`hero`, `products`, `pricing`, `booking`, `courses`, `gallery`, `articles`, `faq`, `testimonials`, `features`).
  - Unified `buttonStyle` CSS custom properties (`--button-bg`, `--button-fg`, `--button-border`, `--button-style`) dynamically updating button variants across templates.
  - Dynamic imagery treatment filters (`--image-filter`) applying natural, duotone, or monochrome photo grading across template imagery.
- **Hover-to-Preview & Apply Pipeline Across All Steps (Doc 02 §6)**:
  - Added live draft preview (`onPreviewDraft`) and dismiss (`onClearDraft`) across Step 1 (Category & Genre), Step 3 (Brand Personality), Step 4 (Visual Direction), Step 5 (Color Studio), Step 6 (Typography Studio), Step 7 (Shape, Spacing & Elevation), Step 8 (Components Studio), and Step 9 (Imagery, Icons & Motion).
  - Hovering any option previews it live on the iframe template in real time; clicking pins and commits via the action ribbon; leaving without applying restores clean preset state.
- **Four Foundational Pillars Architectural Polish (Doc 01 §2)**:
  - Eliminated horizontal top slicing divider across the accordion track.
  - Replaced with architectural vertical left accent indicator (`w-1 sm:w-1.5 bg-gradient-to-b`) for active blades.
  - Pinned sunset cloud is fully visible, scaled to `w-[min(38vw,500px)]` with frosted glassmorphic cards and soft drop-shadow.
  - Removed all duplicate/orphan mini-clouds from internal accordion panels.
- **Verification & QA**:
  - All 14 Vitest test suites (80/80 tests) passing cleanly.
  - Strict TypeScript check (`tsc --noEmit`) passes with 0 errors.
  - Production build (`vite build`) successfully compiling in 2.44s.

---

## [1.0.0] - 2026-10-30

### Complete Industrial Implementation (Docs 00–05 Full Alignment)
- **Token Architecture & Migration Engine (Doc 04 §1 & Doc 05 §2)**:
  - Strict 3-tier token system (`primitives` → `semantic` → `component`) validated by Zod with `schemaVersion: 1`.
  - Created `src/tokens/migration.ts` providing `migrateTokens()` and `importDesignTokensFromJson()` with a strict 2 MB payload size limit.
  - Implemented safe JSON import in `src/utils/storage.ts` supporting both full project backups and standalone `project.dss.json` token packages.
- **Color Science, Contrast & Colorblind Simulation (Doc 04 §2 & §6)**:
  - 11-step OKLCH scales with fixed perceptual lightness steps and brand-tinted neutral scales.
  - Unit-tested across 50 diverse colors verifying monotonic lightness descent and valid sRGB hex output.
  - `nudgeToContrast()` auto-steps OKLCH lightness while maintaining hue within $\le 3^\circ$.
  - Added APCA Lightness Contrast ($L_c$) calculation as an informational perceptual second opinion.
  - Real-time live colorblind simulation toolbar with SVG `<feColorMatrix>` filters (Protanopia, Deuteranopia, Tritanopia, Achromatopsia).
- **Typography Font System & Guardrails (Doc 03)**:
  - 6-role typography architecture (`display`, `heading`, `body`, `ui`, `mono`, `accent`) with modular scaling (`clamp()`).
  - Dual-mode Typography Studio (Pair Mode with `scorePair()` ranking vs Advanced Mode).
  - Virtualized lazy font picker (`FontPickerModal.tsx`) using Google Fonts `&text=` glyph subsetting.
  - Multi-script filtering for Latin, Devanagari, Gujarati, Arabic, and Cyrillic.
  - Comprehensive typography guardrails engine (`typographyGuardrails.ts`) checking family counts, body sizes, weights, and payload budgets (>150 KB).
- **Production Exporters & Starter Kit (Doc 04 §5)**:
  - 10 production export formats: Tailwind CSS 4 theme (`theme.css`), CSS variables (`tokens.css`), W3C DTCG JSON (`tokens.json` with `{color.brand.600}` aliases and dimension scales), TypeScript definitions (`tokens.ts`), shadcn/ui theme (`shadcn-theme.css`), Figma Tokens Studio (`tokens.studio.json`), PDF specification, specimen board PNG, project file (`project.dss.json`), and complete starter ZIP (`starter.zip`).
  - Added sample production `components/Button.tsx` and `components/Card.tsx` directly into the starter ZIP.
- **QA, Security, CI & Legal Hygiene (Doc 05)**:
  - Configured security headers (`X-Content-Type-Options: nosniff`, `Referrer-Policy`, `X-Frame-Options: SAMEORIGIN`) in `api/index.ts` and `vercel.json`.
  - Configured in-memory IP rate limiter (60 req/min/IP) on API routes.
  - Added `/healthz` endpoint alias alongside `/health`.
  - Added `scripts/generateFontSnapshot.ts` and `npm run fonts:snapshot`.
  - Configured GitHub Actions CI workflows (`.github/workflows/ci.yml` and `font-snapshot.yml`).
  - Created `ATTRIBUTIONS.md` documenting open font licenses (SIL OFL 1.1) and Unsplash imagery terms.
  - Created editorial `LegalModal.tsx` for Terms of Service and Privacy Policy.
  - Added live autosave elapsed time indicator ("Saved ✓ 2 s ago") in `WizardNav.tsx`.
- **Three.js Performance & Code-Splitting**:
  - Code-split `Interactive3DCanvas` into a lazy chunk via `React.lazy()` and `<Suspense>`, reducing initial landing bundle size.
  - Implemented accessible static fallback for users with `prefers-reduced-motion` or low-power devices.
- **Step 2: Project Scope & Demographic Targeting**:
  - Audience age demographic selector (18–35, 35–50, 50+); picking 50+ auto-calibrates base typography scale to 18px and nudges body contrast target to AAA (7:1).
  - Brand Hex code input and Image Logo upload with HTML5 Canvas pixel color extraction (`extractDominantColorFromImage`).
  - Inspiration URLs reference input, Platform target selector (Web only vs Web + App), Framework target selector (Tailwind CSS 4, Plain CSS, shadcn/ui), and Dark Mode policy.
- **Step 5: Color Studio & OKLCH Harmonies**:
  - 4 Start-from modes: Brand Color Wheel, Logo Upload, Curated 60-30-10 Presets, and AI-Style Mood Prompts.
  - OKLCH perceptual harmonies (Complementary, Analogous, Triadic, Split-Complementary, Monochromatic).
  - Brand and Accent color lock toggles to cycle palettes while preserving signature colors.
  - Live WCAG 2.2 AA Contrast Scorecard with instant "Nudge to AA (Auto-Fix)" button powered by `nudgeToContrast`.
- **Step 7: Shape, Spacing & Elevation**:
  - Spacing density multiplier: Airy (1.25×), Balanced (1.0×), Compact (0.8×) with 4px / 8px grid selection.
  - 4 Corner radius presets (`sharp`, `subtle`, `rounded`, `playful`) with standard `full: 9999`.
  - 4 Elevation shadow presets (`flat`, `soft`, `crisp`, `dramatic`) featuring brand-tinted low-alpha shadows.
- **Step 8: Components Studio**:
  - Interactive component showcase for Buttons (variants: filled/outline/subtle/ghost/destructive × sizes: sm/md/lg × states: default/hover/focus/disabled/loading).
  - Form controls with default, focused outline ring, error validation state with helper text, and disabled state.
  - Status badges and system alerts across neutral, success, warning, danger, and info roles.
- **Step 9: Imagery, Icons & Motion Physics**:
  - Motion physics level selector: None (0ms), Subtle (120–320ms), and Expressive (150–450ms spring physics `stiffness: 280, damping: 22`).
  - Icon set selection: Lucide, Phosphor, Tabler.
  - Icon style selection: Outline (1.75px), Filled, and Duotone.
  - Photo treatments: Natural daylight, brand-tinted duotone, and architectural monochrome.
- **Studio Keyboard Shortcuts**:
  - Global hotkeys: `ArrowRight`/`ArrowLeft` step navigation, `Cmd/Ctrl+Z` undo, `Cmd/Ctrl+Shift+Z` / `Ctrl+Y` redo, `C` draft compare, and `?` modal dialog (`KeyboardShortcutsModal.tsx`).
  - Dedicated shortcuts help button in the application header.
- **Verification**:
  - 33/33 tests passing across 8 test suites in Vitest.
  - TypeScript strict typecheck (`tsc --noEmit`) passes with 0 errors.
  - Vite production build (`vite build`) successfully compiling with 0 errors.

---

## [1.0.0-alpha.1] - 2026-10-30

### Phase 0: Cleanup & Reality-Check Alignment
- **Claims Sanitization**:
  - Replaced unprovable claims ("0ms latency", "zero drift") with truthful engineering guarantees ("instant synchronous updates", "single source of truth").
  - Removed "client-side encryption" claims; storage is clearly defined as local-first browser `localStorage` with zero server telemetry by default.
  - Replaced hardcoded "Verified 8.4:1 AAA" contrast claim with dynamically computed WCAG 2.2 contrast math.
- **Standards Upgrade**:
  - Upgraded accessibility baseline to **WCAG 2.2 AA** (including 24×24px minimum touch targets and focus-appearance compliance).
- **Schema & Versioning**:
  - Enforced `schemaVersion: 1` across `DesignProject` and future `DesignTokens` data models.
  - Pinned `package.json` project name to `design-system-studio`.
