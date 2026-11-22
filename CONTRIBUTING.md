# Contributing to Design System Studio

Thank you for your interest in contributing to **Design System Studio**!

## 1. Development Principles
- **Local-First & Resilient**: Core design token engines and preview runners operate with zero external network dependencies.
- **Strict Accessibility (WCAG 2.2 AA)**: All generated tokens, components, and studio UI elements must pass WCAG 2.2 Level AA requirements (contrast ratios, focus rings, keyboard navigation).
- **Type-Safety & Performance**: Strict TypeScript (`tsc --noEmit`) with 0 unresolved types, sub-400 KB code-split bundle limits, and 60fps Three.js WebGL scenes.

---

## 2. Setup & Local Development

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Type-check with TypeScript compiler
npm run lint

# 4. Run full test suite with Vitest
npm test

# 5. Build production bundle
npm run build
```

---

## 3. Pull Request Guidelines
1. Ensure all 23+ test suites pass (`npm test`).
2. Ensure strict type-checking succeeds without warnings or errors (`npm run lint`).
3. Commit atomically following conventional commit guidelines (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`).
4. Update relevant documentation and `CHANGELOG.md` for any changes to export formats or token schemas.
