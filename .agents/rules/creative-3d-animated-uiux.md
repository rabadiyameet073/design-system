---
name: creative-3d-animated-uiux
description: Mandatory rules and guidelines for humanized, creative, animated 3D web design and luxury UI/UX engineering
trigger: always_on
---

# Creative Animated 3D & Humanized UI/UX Design System Rules

## 1. Philosophical Core: Humanized & Emotional Design
- **Eliminate Sterile Template Aesthetics**: Break away from generic, boring grey-card SaaS templates. Every interface must radiate character, warmth, intentionality, and editorial craft.
- **Three Levels of Emotional Design (Don Norman)**:
  1. *Visceral*: First 50ms impression. Rich color palettes (HSL/OKLCH), depth, glassmorphic sheen, subtle gradients, and physical weight.
  2. *Behavioral*: Tactile delight. Smooth feedback on hover, drag, click, and toggle. Fluid spring physics without mechanical jerks.
  3. *Reflective*: Storytelling and pride of ownership. Copywriting that sounds like an inspiring design director, not a database schema.

## 2. 3D Spatial & WebGL Standards (Three.js & Canvas)
- **Canvas Integration**:
  - Always clean up Three.js scenes, geometries, materials, renderers, and requestAnimationFrame loops in `useEffect` cleanup return functions.
  - Always support responsive resizing using `ResizeObserver` or window listeners with proper aspect ratio updates (`camera.aspect = width / height; camera.updateProjectionMatrix(); renderer.setSize(width, height)`).
  - Use `alpha: true` and `antialias: true` for seamless blending with ambient UI backgrounds.
  - Keep polycount optimized for 60fps across mobile and desktop.
- **Lighting & Aesthetics**:
  - Combine ambient light with directional accent lights (e.g. primary brand color keylight + subtle contrasting rim light).
  - Use materials with rich specular response (`MeshPhysicalMaterial` or `MeshStandardMaterial` with roughness 0.2–0.4 and metalness 0.1–0.3).
- **Interactive Mouse Parallax**:
  - Dampen mouse/gyroscope coordinates with linear interpolation (`lerp`) so camera movements feel organic, weighted, and silky smooth.

## 3. Cinematic Motion & Choreography (Motion / Framer Motion)
- **Physics over Durations**:
  - Default to spring animations (`type: "spring", stiffness: 260, damping: 20`) instead of linear or ease-in-out curves.
- **Choreographed Entrances**:
  - Use staggered reveals (`staggerChildren: 0.06`) for lists, cards, and grids so elements arrive in rhythm.
- **Micro-Interactions**:
  - Buttons must have scale states (`whileHover={{ scale: 1.02 }}`, `whileTap={{ scale: 0.97 }}`).
  - Subtle magnetic tilt or luminous glow following cursor coordinates on interactive cards.

## 4. Typography & Spatial Hierarchy
- **Editorial Typography Scale**:
  - Pair modern expressive display typefaces with crisp, highly legible body fonts.
  - Maintain fluid typography (`clamp(1.25rem, 2vw + 1rem, 2.5rem)`).
- **Spatial Rhythm**:
  - Use 4px / 8px grid baseline.
  - Generous whitespace around high-impact visuals to allow designs to breathe.

## 5. Accessibility & Performance Guardrails
- Respect `prefers-reduced-motion` media queries.
- Maintain WCAG 2.1 AA contrast ratio (minimum 4.5:1 for normal text, 3:1 for large text).
- Full keyboard focus rings (`focus-visible:ring-2 focus-visible:ring-offset-2`).
- Never block interactive UI with heavy 3D calculations.
