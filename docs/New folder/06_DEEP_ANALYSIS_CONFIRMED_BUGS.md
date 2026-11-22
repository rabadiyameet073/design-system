# 06 — Deep Analysis: Confirmed Bugs & Root Causes

Everything here was found by reading the code (file named for each). Items marked ✅ are fixed in `patches/confirmed-bugfixes.patch`; ⚠️ need your decision.
Test status: contrast fix executed and verified (10/10 failing pairs → 0/10). The rest is static review; `tsc`/`vitest` could not run in my sandbox.

## A. Product-breaking bugs

### A1 ✅ Step 10 "Fix" buttons corrupt colours; "Fix all" does nothing — `Step10ReviewAudit.tsx`
The audit (`contrastEngine.ts`) produces issue IDs `body-default, body-surface, muted-default, action-primary, border-ui, focus-ring, status-*`.
The Fix handlers look for IDs `body-text, primary-action, muted-text` — which **never exist**.
- **Fix one:** every click falls to the default branch and writes the nudged colour into `fgDefault` (body text). Fixing a failing *button label* silently changes your *body text colour* and leaves the button failing.
- **Fix all:** all three `if`s never match → no change at all, while the UI implies success.
- 7 of the 10 audited pairs (borders, focus ring, 4 status badges) had no fix path in Step 10 at all.
**Fix:** each audit issue now carries `fgKey` (the exact token to change); one shared `autoFixSemantic()` is used by Step 10 (Step 6 can reuse it). Test: 10 failing → 0 failing.

### A2 ✅ `nudgeToContrast` picks the wrong direction on mid-tone backgrounds — `contrastEngine.ts`
Direction was decided by `bg lightness > 0.5` only. On a mid-grey background it could walk toward a colour that can't reach the target, then jump to a fallback. Now it compares the achievable contrast of black vs white and moves toward the better one.

### A3 ⚠️ Two sources of truth — exports disagree with the studio
- New model: `project.tokens.*` (OKLCH, semantic light/dark). Used by Step 11 text exports (CSS vars, DTCG, shadcn, Figma, TS) ✔.
- Legacy model: `project.colorPalette / typography / layout`. Still used by the **PDF, PNG board, developer ZIP, Next.js starter ZIP, handoff brief, AI prompt** (`exportGenerators.ts`).
- No sync function exists between them (searched). Step 10 auto-fix edits only `tokens`, so the PDF/PNG/ZIP still show the **old, failing colours**. The legacy CSS export also has **no dark mode**.
- This contradicts the "single source of truth" promise.
**Decision needed:** migrate `exportGenerators.ts` to read `tokens` (recommended, ~1 day) and delete the legacy `colorPalette` fields.

### A4 ✅ Cloud merge can erase your newer edits — `App.tsx`, `projectSync.ts`
- On login, local projects are only added to the "cloud" store if the ID is missing (`syncLocalProjectsToCloud`), so edits made while logged out never replace the older stored copy.
- The subscriber then overwrote local state with the stored copy unconditionally → **newer local work lost**.
**Fix:** newest `updatedAt` wins in both places.

### A5 ✅ Saving a synced project silently changes your "active project" — `storage.ts`
`saveProject()` always calls `setActiveProjectId()`. The sync loop calls it for every cloud project, so after login the persisted active project becomes whichever was last in the loop; after refresh you open the wrong project. Now `makeActive` is opt-in.

### A6 ✅ Undo history leaks across projects — `App.tsx`
`history/future` are global, not per project. Open project B after editing A, press Ctrl+Z → it restores A's snapshot into A (invisibly) and pushes B onto redo. Now cleared when switching/creating projects.

### A7 ✅ Side effects inside a React state updater — `App.tsx`
`handleUpdateActiveProject` called `setHistory`, `setFuture`, `saveProject` and the cloud save **inside** `setProjects(updater)`. Updaters must be pure; React StrictMode (dev) runs them twice → duplicate undo entries and double writes. Redo history was also unbounded (`[...h, activeProject]`). Rewritten: compute `next` once, then set state and save outside; history capped; autosave timer cleared.

## B. Security (code-level confirmations; see file 01 for the full list)
- ✅ Callback page interpolated `error_description`, `err.message`, `name`, `email` into HTML unescaped → reflected XSS. Now escaped.
- ✅ User object was embedded in an inline `<script>` via `JSON.stringify` (breakout with `</script>`). Now `safeJson` (tested: no raw `<`, round-trips).
- ✅ `postMessage(..., '*')` → now `window.location.origin`; `accessToken` removed from the object sent to the browser.
- ⚠️ NOT patched (needs design choices): global `currentActiveSession`, `/auth/custom-login`, `/auth/google-session`, unchecked OAuth `state`, no CSP, rate-limit key. These need session cookies/ID-token verification — do them next (file 01).
- ✅ Exported `tokens.ts` interpolated `project.name` raw inside a string literal: a name containing `"` produces a **syntactically broken exported file** (and is an injection vector). Now `JSON.stringify`. (Other fields in `exportGenerators.ts` — font names, hex values — use the same pattern; apply `q()` everywhere.)

## C. Dead / misleading code
- `src/tokens/tokenReducer.ts` (161 lines, 30-step history, draft/apply) is **never imported**; `App.tsx` has a separate home-made history. Its unit tests pass while testing code the app doesn't run. Either adopt it (recommended: it is the better design) or delete it and its tests.
- 9 orphan step files (see file 02).
- `onSkip={handleNextStep}` in `App.tsx`: "Skip" marks the step **completed**. Pass a separate handler that doesn't add to `completedSteps`.
- "Reset step" (`handleResetCurrentStep`): steps 4, 7, 8, 9 reset the legacy field (`visualDirection`, `layout`, `components`, `imagery`) but not the matching `tokens.*`; if the preview reads tokens, nothing visibly changes (⚠️ verify in the UI). Steps 1, 2, 10, 11 do nothing but still show the confirm dialog.
- `createNewProject('My New Website','ceramics-atelier')` hardcodes a genre, so every "new project" starts as ceramics even though Step 1 is genre selection.

## D. Accuracy / quality notes on the engine
- `computeApcaLc` is an approximation, not APCA-W3: it lacks the soft black clamp and the 0.027 offset, and only parses `#rgb/#rrggbb` (an `rgba()` or named colour yields `NaN`). Label it "approx." or use the `apca-w3` package.
- `tokenReducer`/`getEffectiveTokens` merge only `meta`, `color`, `typography`; other groups (radius, space, motion) are replaced wholesale by a draft — a partial draft would wipe them.
- `grade()` treats `isLarge` UI pairs as "AA" at ≥3:1: fine for non-text contrast, but label it "UI 3:1", not "AA".

## E. What I did NOT verify
- Runtime behaviour (couldn't start Vite/Vitest here).
- Whether the live preview reads `tokens` or legacy fields in every template (affects C/Reset).
- Line-by-line review of the 8 preview templates, `FontPickerModal`, `Step6TypographyStudio` internals and `OAuthModal`.
