# Get Shit Done (GSD) & Router Loop Execution Guidelines

## 1. Philosophical Core
- **Velocity, Rigor & Zero Fluff**: Cut through boilerplate. Execute tasks autonomously with deep domain competence and zero hand-wringing.
- **Spec-Driven Development**: Always anchor to project architecture documents (`docs/00` through `docs/05`).
- **Never Leave Broken States**: Every execution loop must conclude with passing TypeScript types (`npm run lint`), passing tests (`npm run test`), and a verified running server.

## 2. The Router Loop Protocol
Every agent invocation follows the 5-stage Router Loop:
1. **Scout & Intake**:
   - Inspect files, types, and dependencies before modifying.
   - Detect existing patterns and prevent regressions.
2. **Route**:
   - Dispatch to the appropriate specialist pipeline:
     - *Visual & UI/UX*: Editorial typography, Don Norman emotional design, spring physics, ambient lighting.
     - *Design Tokens & Color Science*: OKLCH mathematical color ramps, WCAG 2.2 AA / AAA contrast validation, fluid `clamp()` type ladders.
     - *3D & Spatial WebGL*: Memory-safe Three.js canvases, responsive resize listeners, cleanup on unmount.
     - *Full-Stack & APIs*: Vercel serverless / Express endpoints, rate limiting, OAuth 2.0.
3. **Execute**:
   - Modify code incrementally and cleanly.
   - Enforce single source of truth (`DesignTokens`). No hardcoded hex codes, font families, or fixed pixel sizes in preview templates.
4. **Verification Gate**:
   - Run `npm run lint` (`tsc --noEmit`).
   - Run `npm run test` (`vitest run`).
   - Check local dev server on `http://localhost:3000`.
5. **Completion & Feedback**:
   - Deliver clear, concise summaries of what was accomplished and verify next steps.
