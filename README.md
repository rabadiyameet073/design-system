<div align="center">
  <h1>🎨 Design System Studio</h1>
  <p><strong>Founder-First Website Design System & Developer Tokens Studio</strong></p>
</div>

A full-stack web application for crafting complete, production-ready design systems, typography scales, accessible color palettes, UI components, code generators, and multi-format design specifications (PDF, JSON, CSS, Tailwind, SCSS, Figma Variables).

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+ or Node 20+
- npm, yarn, or pnpm

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Configure your credentials:
```env
# Optional Gemini AI API Key (Enables AI Brand-to-Tokens and Copy synthesis)
GEMINI_API_KEY="your_gemini_api_key"

# App URL (defaults to http://localhost:3000 locally)
APP_URL="http://localhost:3000"

# Google OAuth 2.0 Credentials (Identity only: profile & email)
OAUTH_CLIENT_ID="your_google_client_id"
OAUTH_CLIENT_SECRET="your_google_client_secret"
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚡ Deploy to Vercel

This repository is pre-configured for seamless zero-config deployment on [Vercel](https://vercel.com).

### Automatic Deployment (GitHub Integration)
1. Push this repository to GitHub: `https://github.com/rabadiyameet073/design-system`
2. Go to [Vercel Dashboard](https://vercel.com/new).
3. Import the `design-system` repository.
4. Framework Preset: **Vite** (automatically detected).
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Add Environment Variables in the Vercel project settings:
   - `OAUTH_CLIENT_ID`: Your Google OAuth Client ID
   - `OAUTH_CLIENT_SECRET`: Your Google OAuth Client Secret
   - `APP_URL`: Your Vercel domain (e.g. `https://your-project.vercel.app`)
   - `GEMINI_API_KEY`: (Optional) Your Gemini API Key
8. Click **Deploy**!

### Architecture on Vercel
- **Frontend**: Vite Single Page Application served globally at edge via Vercel CDN (`dist/`).
- **Serverless API**: Handled automatically by `/api/index.ts` serverless function for `/api/*` and `/auth/callback` endpoints.
- **Routing**: Managed cleanly through `vercel.json` rewrites.

---

## 🛠️ Scripts

- `npm run dev`: Starts Express full-stack engine with Vite development middleware.
- `npm run build`: Compiles production frontend bundle with Vite.
- `npm run lint`: Performs strict TypeScript type check (`tsc --noEmit`).
- `npm run test`: Runs the Vitest test suite (23 test files, 151 passing tests).
- `npm run fonts:snapshot`: Updates the local Google Fonts metadata snapshot.
- `npm run preview`: Previews built production assets locally.

---

## 📐 Architecture & Features

### 1. Template-First Live Preview Flow (11 Steps)
- **Step 1 — Category & Genre**: Pick from 8 industry categories and 32 genre configurations; opens corresponding responsive template immediately.
- **Step 2 — Project Scope & Business Context**: Brand identity, target audience with age-responsive base typography, multi-script selection (Latin, Devanagari, Gujarati, Arabic, Cyrillic).
- **Step 3 — Brand Personality**: 5 temperament dials (Energy, Craft, Voice, Formality, Density) driving deterministic preset recommendations.
- **Step 4 — Visual Direction**: Editorial moodboards with typography tags, palette hints, and radius styles.
- **Step 5 — Color Studio**: 11-step OKLCH scales with monotonic lightness descent, tinted neutrals, functional harmonies, and WCAG 2.2 AA contrast engine with auto-fix (`nudgeToContrast`).
- **Step 6 — Typography Studio**: Role-based font architecture (display, heading, body, ui, mono, accent), Google Fonts API proxy with snapshot fallback, font pairing recommendations (`scorePair`), and modular fluid scale clamps (`fluid()`).
- **Step 7 — Shape, Spacing & Layout**: 4px/8px baseline grid, airy/balanced/compact density multipliers, radius presets, and brand-tinted elevation shadows.
- **Step 8 — Website Components**: Complete matrix of buttons, form inputs, cards, status badges, alert banners, and links across all states.
- **Step 9 — Imagery, Icons & Motion**: Duotone/mono/natural photo filters, Lucide/Phosphor/Tabler icon libraries, and spring physics motion tokens.
- **Step 10 — Review & Pre-Flight Audit**: 10-pair contrast verification table for light & dark modes with one-click "Auto-Fix", viewport tests, and a11y health scoring.
- **Step 11 — Export Center**: Universal export center with real-time pre-export validation gate, shareable hosted preview link, multi-format code packages, vector PDF spec, specimen board PNG, project file, and starter ZIP.

### 2. Export Formats (13 Deliverables)
1. `theme.css` — Modern Tailwind CSS 4 `@theme inline` block with fluid typography and dark mode variants.
2. `tailwind.v3.config.js` — Legacy Tailwind CSS v3 `module.exports` configuration.
3. `tokens.css` — Framework-agnostic CSS custom properties for `:root` and `.dark`.
4. `tokens.scss` — SCSS variables with `@mixin theme-light` and `@mixin theme-dark` parity.
5. `tokens.json` — W3C Design Tokens Community Group (DTCG) specification format.
6. `tokens.ts` — Strictly-typed TypeScript definitions with `as const`.
7. `shadcn-theme.css` — Drop-in theme for shadcn/ui components (`@layer base`).
8. `tokens.studio.json` — Figma Tokens Studio plugin JSON.
9. `figma.variables.json` — Native Figma Variables format with Light and Dark mode collections.
10. `style-dictionary.config.json` — Amazon Style Dictionary configuration for multi-platform builds.
11. `fonts.css` — Self-hosted `@font-face` declarations and Fontsource variable package instructions.
12. `a11y-audit-report.md` — Client-ready accessibility audit report with WCAG 2.2 AA contrast matrix, APCA scores, and touch target rules.
13. `project.dss.json` — Portable project state file (`schemaVersion: 1`) for re-importing.

Additional assets:
- `starter.zip` — Comprehensive developer bundle with all 13 token files, README, font install guide, and accessible components (`Button.tsx`, `Card.tsx`, `Input.tsx`, `Badge.tsx`).
- `design-spec.pdf` — Multi-page vector PDF specification.
- `board@2x.png` — 1600×1000 high-resolution visual specimen board.
- **Shareable Hosted Link** — URL-encoded read-only link (`#/share?data=...`) for instant live preview and testing.

### 3. AI Design Assist & Privacy-Friendly Telemetry
- **Brand-to-Tokens Generator**: Generates primary colors, font pairings, and design briefs from brand descriptions.
- **Marketing Copy Synthesizer**: Generates headlines, subheadlines, and CTAs tailored to industry and tone.
- **Natural Language Palette Extractor**: Converts descriptive phrases into balanced OKLCH palettes.
- **Resilient Fallback Engine**: Deterministic offline heuristics keep the studio usable when API keys are omitted or the API is unavailable.
- **Local Telemetry**: Privacy-friendly event tracking stored locally in IndexedDB/LocalStorage with zero third-party trackers.

---

## 🔒 Security & Reliability
- Strict Content-Security-Policy (CSP), Permissions-Policy, and X-Content-Type-Options headers.
- Rate-limiting (60 req/min/IP) on API and authentication routes.
- Same-origin validation (`event.origin === window.location.origin`) for postMessage iframe communication.
- 2 MB payload size limit and Zod schema validation on project imports.
- Google OAuth 2.0 strictly requests identity verification scopes (`openid`, `profile`, `email`).
