# Design System Studio — Engineering & UI/UX Standards

## Core Tenets
1. **Humanized & Creative Aesthetics**:
   - Every interface must feel bespoke, luxury-grade, and emotionally engaging.
   - Avoid generic bootstrap/monotone patterns. Use curated color palettes, ambient glassmorphism, dynamic lighting, and expressive typography.
2. **Interactive 3D & Canvas Integration**:
   - Leverage Three.js and WebGL for spatial depth, particle fields, ambient floating geometry, and mouse-reactive parallax.
   - Target 60fps (measure it before claiming it); always clean up the canvas on unmount and keep sizing responsive.
3. **Motion Choreography**:
   - Use `motion` (Framer Motion) physics-based springs (`type: "spring", stiffness: 280, damping: 22`).
   - Stagger page elements and provide tactile micro-feedback on buttons, cards, and modal dialogs.
4. **Vercel & Full-Stack Reliability**:
   - Frontend is built via Vite into `dist/`.
   - Backend APIs are exported as Vercel serverless functions in `api/index.ts`.
   - Local development is unified via `npm run dev` (`tsx server.ts`).
   - Strict TypeScript (`tsc --noEmit`) with zero unresolved types.
5. **Accessibility**:
   - Target WCAG 2.2 AA (contrast, focus appearance and 24×24px touch targets); respect `prefers-reduced-motion`.
