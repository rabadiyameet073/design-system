# Design System Studio — Architectural & Product Documentation

> **A Founder-First Design Engineering Platform**  
> Transform brand strategy, visual direction, and aesthetic decisions into mathematical design tokens, accessible components, and production-ready code with a single source of truth.

---

## 1. Executive Summary & Vision

Building a bespoke, luxury-grade web application typically takes 4–8 weeks of fragmented meetings between founders, designers, and developers arguing over hex codes, font scales, button radiuses, and CSS variables. Hand-offs frequently drift: Figma variables disagree with Tailwind classes, dark mode contrast fails WCAG accessibility, and typography breaks across mobile screens.

**Design System Studio** solves this by turning design system creation into an opinionated, guided mathematical methodology. As choices are made, a **Live Simulated Website** updates live from a single source of truth, enabling founders and engineers to judge how their site looks across desktop, tablet, and mobile viewports before exporting production code in standard formats.

---

## 2. Core Technical Architecture & Stack

| Layer | Technologies | Key Features |
|---|---|---|
| **Core Framework** | React 19, TypeScript (Strict Mode) | Zero unresolved types, modern Hooks architecture, Context API state |
| **Build & Dev Server** | Vite 8, Rolldown bundler, `tsx` | Instant HMR, unified local dev server via `npm run dev` (`tsx server.ts`) |
| **Styling & Theme Engine** | Tailwind CSS 4 (`@theme`), PostCSS | Dynamic `@theme` custom properties, OKLCH / HSL mathematical color spaces |
| **Motion & Animation** | Motion 12 (`motion/react`) | Physics-based spring animations (`stiffness: 280, damping: 22`), AnimatePresence |
| **3D & Spatial WebGL** | Three.js (v0.186+) | Interactive 3D WebGL scenes, specular `MeshPhysicalMaterial`, mouse parallax |
| **Backend & Serverless** | Express 4, Vercel Serverless Functions | Unified API in `api/index.ts`, Google OAuth 2.0 endpoint, token verification |
| **Storage & Sync** | `localStorage`, BroadcastChannel, per-user JSON file store | Local-first browser storage with multi-tab sync; signed-in projects also persist to a server-side per-user JSON file (being replaced with a REST-backed store in separate work) |
| **Export Formats** | jsPDF, html2canvas, JSZip | 13 token/code formats (Tailwind 4/3, CSS vars, SCSS, DTCG JSON, TypeScript, shadcn/ui, Figma Tokens Studio & Variables, Style Dictionary, fonts CSS, a11y report, project JSON) plus PDF spec, PNG board and starter ZIP |

---

## 3. The 11 Guided Architecture Steps

The studio's engine is structured around four ascending architectural flights across 11 modular steps:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       THE 11-STEP ARCHITECTURE FLIGHTS                      │
├─────────────────┬─────────────────┬─────────────────────┬───────────────────┤
│ 01. FOUNDATION  │ 02. IDENTITY    │ 03. STYLE & SHAPE   │ 04. PRODUCTION    │
│ (Ground Floor)  │ (Soul)          │ (Design Engine)     │ (The Summit)      │
├─────────────────┼─────────────────┼─────────────────────┼───────────────────┤
│ 01 Category &   │ 03 Personality  │ 05 Color Studio     │ 08 Components     │
│    Genre (32)   │ 04 Visual       │ 06 Typography       │ 09 Imagery/Motion │
│ 02 Project      │    Direction    │ 07 Shape & Spacing  │ 10 Review & Audit │
│    Scope        │                 │                     │ 11 Export Center  │
└─────────────────┴─────────────────┴─────────────────────┴───────────────────┘
```

### Flight 01: Foundation
- **Step 1: Category & Genre** (`Step1CategoryGenre.tsx`): Select website category and specific genre from 32 tailored options. A reactive template opens in the preview pane immediately with archetype quiz assistance.
- **Step 2: Project Scope** (`Step2ProjectBusiness.tsx`): Establish brand name, slug, target audience, conversion goals, and target language scripts to calibrate base type scales and copy.

### Flight 02: Identity
- **Step 3: Brand Personality** (`Step3BrandPersonality.tsx`): Tune energy, craft, voice, formality, and density to synthesize recommended starter aesthetic presets with live impact chips.
- **Step 4: Visual Direction** (`Step5VisualDirection.tsx`): Select an aesthetic archetype bundling palette hints, corner radii, elevation, and typography styling with live A/B compare.

### Flight 03: Style & Shape
- **Step 5: Color Studio** (`Step6ColorStudio.tsx`): Fine-tune brand, accent, and neutral OKLCH scales, inspect live WCAG 2.2 AA contrast, APCA scoring, colorblind simulations, and light/dark modes.
- **Step 6: Typography Studio** (`Step6TypographyStudio.tsx`): Configure display, heading, body, and mono fonts with 1,800+ Google Fonts, multi-script subsets, and responsive fluid clamps.
- **Step 7: Shape & Spacing** (`Step9LayoutSpacing.tsx`): Calibrate border radius scales, component elevation shadows, container max-widths, and 4px/8px spatial grids.

### Flight 04: Production & The Summit
- **Step 8: Website Components** (`Step10ComponentsStudio.tsx`): Button variants (solid, outline, subtle, minimal), form controls, badges, and toggle active site modules.
- **Step 9: Imagery & Motion** (`Step8ImageryStudio.tsx`): Photo filters (duotone, monochrome, clean), corner rounding, and physics-based spring curves.
- **Step 10: Review & Audit** (`Step10ReviewAudit.tsx`): Comprehensive design system audit across contrast, focus-visible outlines, touch targets (24×24px), fluid clamps, and token completeness with auto-fix.
- **Step 11: Export Center** (`Step11ExportCenter.tsx`): Multi-format export center with interactive Starter ZIP bundle, 13 token/code formats, vector PDF spec, PNG specimen board, and shareable preview link.

---

## 4. Key Interactive Experiences & Innovations

### A. Split-Screen Reactive Studio Workbench (`WizardWorkspaceStage.tsx`)
- **Dual Pane Architecture (50/50 Desktop)**:
  - **Left Pane**: Step questionnaire with options, sliders, and controls.
  - **Right Pane**: The **Live Interactive Website** in a sandboxed iframe (`/preview-frame`), permanently visible in real time.
- **Contextual Ribbon**:
  - Displays Category and Genre.
  - Pulsing status indicator: `● Live Reactive Site • Changes update instantly`.
  - Micro-animated flash: `✨ Site Updated Live` upon every token update.
- **Responsive Navigation**:
  - Top progress tracker with accessible keyboard shortcuts (`?`, `←`, `→`, `Cmd+Z`, `Cmd+Shift+Z`, `C`, `D`).
  - Mobile step selector dropdown for seamless navigation on small screens.

### B. The 4 Foundational Pillars (`DesignSystemAnatomy.tsx`)
An editorial section on the home page explaining design theory and system consistency:
1. **Pillar 01 · Brand Soul & Visual Direction**: Interactive archetype selector (*Warm Editorial*, *High-Velocity Tech*, *Architectural Minimal*) showing real-time trait adjustments.
2. **Pillar 02 · Color Science & Contrast Audit**: Live light/dark mode switcher with real-time computed **WCAG 2.2 AA** contrast ratios and lightness ramps.
3. **Pillar 03 · Fluid Typographic Hierarchy**: Modular ratio switcher with fluid `clamp()` formula calculator and 8px grid snapping.
4. **Pillar 04 · Single Source of Truth Token Engine**: Live code inspector demonstrating synchronized token output with one-click copy.

### C. Live Interactive 3D Spatial Canvas (`Interactive3DCanvas.tsx`)
- Three.js WebGL spatial scene embedded in the hero's "3D Space" tab.
- Central smooth Torus Knot (`MeshPhysicalMaterial`) with outer architectural wireframe cage and 140 orbiting particles.
- Mouse parallax damped via linear interpolation (`lerp`).
- Respects `prefers-reduced-motion` by freezing animation loops and rendering a calm static view.
- Complete lifecycle cleanup on unmount disposing geometries, materials, and renderer.

### D. Multi-Format Deliverables Engine
The application compiles decisions into 13 synchronized token/code formats, plus PDF, PNG and ZIP assets:
1. **Tailwind CSS 4 Theme Block** (`theme.css`, `@theme inline` with dark variants).
2. **Tailwind CSS v3 Config** (`tailwind.v3.config.js`, legacy `module.exports`).
3. **CSS Custom Properties** (`tokens.css`, `:root` / `.dark`).
4. **SCSS Variables** (`tokens.scss`, light/dark mixins).
5. **W3C DTCG Tokens JSON** (`tokens.json`).
6. **TypeScript Definitions** (`tokens.ts`, `as const` constants).
7. **shadcn/ui Theme** (`shadcn-theme.css`).
8. **Figma Tokens Studio JSON** (`tokens.studio.json`).
9. **Native Figma Variables JSON** (`figma.variables.json`, Light/Dark modes).
10. **Style Dictionary Config** (`style-dictionary.config.json`).
11. **Self-Hosted Fonts CSS** (`fonts.css`, `@font-face` / Fontsource instructions).
12. **Accessibility Audit Report** (`a11y-audit-report.md`, WCAG 2.2 AA contrast matrix).
13. **Portable Project File** (`project.dss.json`, `schemaVersion: 1`).

Additional assets: a multi-page vector **PDF specification** (jsPDF), a 1600×1000 **PNG specimen board**, a **starter ZIP** bundling all 13 files with fonts and accessible React components, and a read-only **shareable preview link**.

---

## 5. Design Philosophy (Based on `.agents` Rules)

1. **Eliminate Sterile SaaS Templates**:
   - Interfaces avoid cold, generic monochrome cards. Curated warm porcelain palettes, bespoke typography (*Michroma*, *Fraunces*, *Plus Jakarta Sans*, *Zen Dots*), and subtle lighting create an editorial experience.
2. **Don Norman's Three Levels of Emotional Design**:
   - **Visceral**: Instantaneous 50ms impression through rich OKLCH/HSL palettes and glassmorphic sheen.
   - **Behavioral**: Tactile delight through physics-based springs (`type: "spring", stiffness: 280, damping: 22`) and interactive feedback.
   - **Reflective**: Inspiring, design-director copywriting and long-term brand equity.
3. **Accessibility First**:
   - WCAG 2.2 AA compliance (minimum 4.5:1 for body copy, 3:1 for large display titles, 24×24px minimum touch target size).
   - Full keyboard operability and accessible focus rings.
   - Strict `prefers-reduced-motion` compliance.

---

## 6. Project Directory Structure

```
d:/desing system/
├── api/
│   └── index.ts                 # Express API & Vercel Serverless Function entry point
├── public/
│   ├── icon.png                 # Studio brand favicon & app icon
│   ├── logo.png                 # Official brand logo
│   └── images/stairway/         # Architectural visual assets
├── src/
│   ├── assets/images/           # High-resolution website preview photographs
│   ├── components/
│   │   ├── auth/                # Google OAuth 2.0 authentication modals
│   │   ├── common/              # Header, WizardNav, Interactive3DCanvas, StepTransition
│   │   ├── dashboard/           # Multi-project management dashboard
│   │   ├── landing/             # LandingPage, DesignSystemAnatomy, StudioFooter
│   │   ├── preview/             # LiveWebsitePreview (dynamic multi-genre simulated website)
│   │   ├── wizard/              # Steps 1–11 & WizardWorkspaceStage (split-screen workbench)
│   │   └── workspace/           # Post-wizard project inspector & export center
│   ├── context/                 # AuthContext (Google OAuth & local session state)
│   ├── data/                    # Website types (32), palettes (14), typography pairs (12)
│   ├── services/                # ProjectSync (offline-first & multi-tab BroadcastChannel sync)
│   ├── types/                   # Strict TypeScript definitions (DesignProject, Tokens, etc.)
│   ├── utils/                   # Color math, contrast audits, storage debounce, Zod schemas, PDF generator
│   ├── App.tsx                  # Root application router and view orchestrator
│   ├── index.css                # Tailwind CSS 4 theme rules, typography, and base styles
│   └── main.tsx                 # React 19 root mounting
├── server.ts                    # Local Express development server with Vite SPA middleware
├── package.json                 # Dependencies & scripts
└── tsconfig.json                # Strict TypeScript configuration
```

---

## 7. Operational & Developer Guide

### Running Locally
```bash
# Start unified development server (Frontend Vite + Backend Express APIs)
npm run dev
# Server runs at: http://localhost:3000
```

### Production Build & Verification
```bash
# Run strict TypeScript linting (zero errors)
npm run lint

# Build optimized production bundle into dist/
npm run build

# Preview production build locally
npm run preview
```

### Key Environment Variables (`.env`)
```env
PORT=3000
NODE_ENV=development
# Google OAuth 2.0 Credentials (Optional for account sign-in)
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
SESSION_SECRET=your_strong_random_secret_at_least_32_chars
```

---

*Authored for Design System Studio • All 11 steps, reactive split-screen workbench, and 13-format export engine active.*

