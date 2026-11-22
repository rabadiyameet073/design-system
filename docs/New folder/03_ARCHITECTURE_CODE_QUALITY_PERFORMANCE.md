# 03 — Architecture, Code Quality & Performance

## Code health
| Problem | Evidence | Fix |
|---|---|---|
| Dead code | 9 orphan step files (~2,000 lines), duplicate `Header`/preview paths | Delete; add `knip` or `ts-prune` to CI |
| Two preview systems | `src/components/preview/LiveWebsitePreview.tsx` (non-iframe, used by Landing + Workspace) vs `src/preview/PreviewFrame.tsx` (iframe) | Use the iframe path everywhere so Tailwind breakpoints work |
| God components | `LandingPage` 1,025 · `Step6Typography` 732 · `Step6Color` 650 · `App.tsx` 589 · `exportGenerators` 1,021 | Split by responsibility (<300 lines each) |
| `any` types | 41 uses across src/api | Replace with typed models; enable `noExplicitAny` lint |
| `console.log/error` | 15 | Use a small logger; strip in prod |
| Naming drift | `Step6TypographyStudio` renders at step 6, `Step9LayoutSpacing` at 7, `Step8Imagery` at 9 | Rename `StepNN` to match order, or use slug names (`ColorStep.tsx`) |
| Folder typo | `desing system`, docs say `d:/desing system/` | Rename to `design-system-studio` |
| Two lockfiles | `bun.lock` + `package-lock.json` | Keep one (npm, since CI uses `npm ci`) |

## State management (`App.tsx`)
- All project state, undo/redo, drafts, toasts, and routing live in one component with 15+ `useState`s.
- Navigation is `view` string state: no URLs, so refresh/back button/deep links don't work. Add React Router (or hash router): `/`, `/dashboard`, `/project/:id/step/:n`, `/project/:id/workspace`.
- Move project state to a store (Zustand or `useReducer` + context). You already have `tokenReducer.ts`; use it as the single mutation path.
- Undo history: only 15 states, memory only. Persist or switch to patch-based history (immer patches).

## Persistence
- `saveProject()` reads **and rewrites the whole project array** to `localStorage` on every update; no debounce → heavy on every slider drag.
- Add 300–500 ms debounce, write only the changed project, and move to IndexedDB (`idb-keyval`/Dexie) for size and async.
- `getStoredProjects` silently reseeds sample projects when storage is empty/corrupt → can mask data loss. Show a recovery prompt instead.
- `importProjectFromJson` spreads untrusted JSON (`...parsed`) into a project. Validate with the already-installed **Zod** before saving.
- Add schema versioning for the project object (tokens have migration; project does not).
- Handle `QuotaExceededError` visibly (currently only `console.error`).

## Performance
| Item | Finding | Fix |
|---|---|---|
| Main JS bundle | `dist/assets/index-*.js` ≈ **1.49 MB** | Route-level `React.lazy` for each step, Workspace, Dashboard; manual chunks |
| Three.js | ≈ 540 KB chunk (already lazy) | Load only on interaction/visibility; skip on mobile/reduced-motion |
| html2canvas / jsPDF | Loaded for export | Dynamic `import()` on click only |
| Images | 4 JPGs 0.7–0.9 MB; 7 PNG logos/icons ≈ 1.0–1.2 MB each (some duplicates: `logo.png`=`logo-tight.png` size, `favicon.png`=`icon.png`) | Convert to WebP/AVIF, resize, delete duplicates; favicon should be ~32–512 px, not 1.2 MB |
| Google Fonts in `index.html` | ~24 families preloaded for every visitor | Load only the 2–3 UI fonts; others on demand in the font picker |
| Preview updates | Re-render on each token change | `useDeferredValue`/rAF batching (rAF throttle exists for postMessage; extend it to the studio side) |
| Export work | PDF/PNG on main thread | Web Worker or show progress |

## Tooling & environment
- In my sandbox `tsc` and `vitest` could not start (missing Linux native binaries for TypeScript 7 / rolldown) — so I **could not run the type-check or tests**. This also means `node_modules` was zipped from another OS. Don't ship `node_modules` in archives; reinstall with `npm ci`.
- `typescript ^7.0.2`, `vite ^8`, `vitest ^5` are bleeding-edge; pin exact versions and confirm CI (Node 20) runs on them.
- CI runs lint → test → build but no: lockfile audit (`npm audit`), a11y tests, e2e, or bundle-size budget. Add them.
- Add ESLint + Prettier (there is none; `lint` is only `tsc --noEmit`) and `eslint-plugin-jsx-a11y`.
- `dist/` is in the archive though git-ignored; exclude it.

## Suggested target structure
```
src/
  app/            router, providers, store
  features/
    wizard/steps/  (one folder per step: Step.tsx, schema.ts, tests)
    dashboard/  workspace/  landing/  auth/
  engine/         tokens, color, type, contrast, exporters (pure, tested)
  preview/        iframe app + templates
  ui/             shared components (Modal, Toast, Slider, Tabs)
server/           api routes (split auth / fonts / ai)
```

## Priority order
1. Delete dead code, rename folder, single lockfile
2. Router + store, remove `view` string
3. Debounced IndexedDB persistence + Zod validation
4. Code-split (target main bundle < 400 KB)
5. Compress images/fonts
6. ESLint + jsx-a11y + bundle budget in CI
