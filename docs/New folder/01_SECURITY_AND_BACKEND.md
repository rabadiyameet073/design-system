# 01 — Security & Backend (Fix These First)

> Scope: `api/index.ts`, `server.ts`, `src/context/AuthContext.tsx`, `src/utils/storage.ts`, `src/services/projectSync.ts`, `.env`, `vercel.json`.
> Priority legend: 🔴 Critical (fix before any public deploy) · 🟠 High · 🟡 Medium

---

## 🔴 S1. Real secrets are inside the project archive
- `.env` (Gemini key, OAuth client secret) and `client_secret_…apps.googleusercontent.com.json` are present in the folder you zipped/shared.
- Good news: both are git-ignored and **not tracked** in git history.
- Bad news: anyone who received the `.rar` has them.

**Do now**
1. Rotate the Google OAuth client secret and the Gemini API key.
2. Never zip the project folder with `.env*` / `client_secret*.json` — export with `git archive` or add an exclude list.
3. Put secrets in Vercel/Cloud Run environment settings only.

## 🔴 S2. One global login session for the whole server (`currentActiveSession`)
`api/index.ts` stores the logged-in user in a **single module variable**. Consequences:
- User B logging in **overwrites** user A's session; `GET /auth/me` then returns B to everyone.
- Any visitor can call `/auth/me` and read the last user's name, email, and **OAuth `accessToken`**.
- On Vercel serverless, module state is not shared between instances, so behavior is random.

**Fix:** Issue a per-user session: signed, `HttpOnly; Secure; SameSite=Lax` cookie (e.g. `iron-session`/JWT with server secret) and look the user up per request. Never return `accessToken` to the browser; you only need identity (`sub`, `email`, `name`).

## 🔴 S3. `POST /auth/custom-login` lets anyone "be" any email
No password, no email verification. Typing `ceo@company.com` creates a session as that person. The UI ("sign in with email" in `OAuthModal.tsx`) exposes it.

**Fix:** Remove it, or replace with a real magic-link/OTP flow. If it is only for demos, gate it behind `NODE_ENV !== 'production'`.

## 🔴 S4. `/auth/google-session` trusts whatever the client sends
It accepts any `{user:{email,…}}` body and creates a session. There is no check that Google actually issued it.

**Fix:** Accept only the Google **ID token** (credential JWT), verify signature/audience/expiry server-side (`google-auth-library` `verifyIdToken`), then create the session from verified claims.

## 🔴 S5. OAuth `state` is predictable and never verified
`state: oauth_state_${Date.now()}` is generated but the callback never checks it → login CSRF. Also no PKCE.

**Fix:** Generate a random `state` (+ PKCE `code_verifier`), store in a short-lived cookie, compare in `/auth/callback`, reject mismatches.

## 🔴 S6. Reflected HTML injection in the callback page
`error_description`, `err.message`, `userProfile.name`, and `email` are interpolated directly into HTML. A crafted link such as `/auth/callback?error=<img src=x onerror=…>` executes script on your origin.
Also `JSON.stringify(userProfile)` is placed inside a `<script>` — a name containing `</script>` breaks out.

**Fix:** HTML-escape all interpolated values; avoid inline script data — return JSON via `postMessage` from a static page, or set cookie and redirect.

## 🟠 S7. `window.opener.postMessage(..., '*')`
The authenticated user object (with token) is posted to **any** opener origin.
Client side (`AuthContext.tsx` ~L167) also accepts messages from any `localhost` and any `*.run.app` origin.

**Fix:** Target `window.location.origin` explicitly; on receive, check `event.origin === window.location.origin` only.

## 🟠 S8. Access token persisted in `localStorage`
`dss_google_user_session_v2` stores the user including `accessToken`. Any XSS (see S6) steals it. You only request `openid profile email`, so the token isn't needed after login.

**Fix:** Drop the token entirely after fetching the profile.

## 🟠 S9. Rate limiter can be bypassed and leaks memory
- Uses the raw `x-forwarded-for` header (attacker-controlled, may be a comma list) as the key.
- `Map` never evicts old IPs → slow memory growth.
- In-memory per instance → ineffective on serverless.

**Fix:** `app.set('trust proxy', 1)` + use `req.ip`; use `express-rate-limit` with a shared store (Upstash/Redis) on Vercel; add a stricter limit on `/auth/*`.

## 🟠 S10. No Content-Security-Policy; third-party scripts unpinned
- Only 3 headers are set (nosniff, referrer, frame). No CSP, no HSTS, no `Permissions-Policy`.
- Google Identity script and a huge Google Fonts stylesheet are loaded from `index.html`.

**Fix:** Add a CSP (`default-src 'self'; script-src 'self' https://accounts.google.com/gsi/client; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data: https:; frame-src https://accounts.google.com`). Add HSTS on production.

## 🟡 S11. Smaller backend items
| Item | Detail | Fix |
|---|---|---|
| Hardcoded OAuth client ID fallback | Appears 3× as a string literal in `api/index.ts` | Remove fallback; fail loudly if env missing |
| `express.json({limit:'10mb'})` | Too large for endpoints that take small JSON | 100 kb default; raise per-route |
| `/generate-ai-prompt` | Stub that returns a one-line string; `@google/genai` is a dependency but unused | Implement or remove the route and dependency |
| Health endpoint exposes version/service strings | Minor info leak | Return `{status:'ok'}` only |
| Avatar fallbacks hit Unsplash/DiceBear | Third-party requests leak user email seed (`dicebear ... seed=email`) | Generate initials locally |
| GitHub provider | `/auth/url` supports GitHub but reuses the Google client ID as fallback; email fallback `login@github.com` is fake | Remove GitHub or configure properly |
| `/fonts` | Requires `GOOGLE_FONTS_API_KEY` but `.env.example` doesn't list it | Document it |

## 🟡 S12. "Cloud sync" is not cloud
`projectSync.ts` stores per-user data in **the same browser's `localStorage`** and syncs tabs via `BroadcastChannel`. Logging in on another device shows nothing. `security_spec.md` describes Firestore rules (`/users/{uid}`, `/projects/{id}`) but the app has **no Firebase / no database**.

**Fix (choose one):**
- Honest option: rename to "Local projects", remove "cloud" wording everywhere.
- Real option: add a database (Supabase / Neon + Drizzle / Firestore) with row-level ownership, then make `security_spec.md` real and test the "Dirty Dozen" cases.

## Checklist
- [ ] Rotate OAuth secret + Gemini key
- [ ] Per-user signed session cookies
- [ ] Remove/lock `custom-login` and `google-session`
- [ ] Verify Google ID token server-side
- [ ] Random `state` + PKCE, verified on callback
- [ ] Escape HTML in callback; no inline user JSON
- [ ] `postMessage` to exact origin only
- [ ] Stop storing `accessToken`
- [ ] `trust proxy` + shared rate-limit store
- [ ] CSP + HSTS headers
- [ ] Decide: local-only vs real cloud
