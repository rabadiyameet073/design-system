# Security Specification for Design System Studio

## 1. Scope and current architecture

This document describes the code as it exists today. **There is no Firestore database and no `/users/{userId}` or `/projects/{projectId}` document model in this repository**, so Firestore security rules do not apply here; the earlier draft describing them was aspirational and has been removed.

Current persistence model:

- Projects are local-first in browser `localStorage`, scoped per user, with `BroadcastChannel` and `storage` events for multi-tab sync.
- Signed-in projects are also written to a **server-side per-user JSON file store** through `/api/user/projects` (GET/POST/PUT/DELETE) and `/api/user/projects/sync`.
- That JSON file store is **being replaced by a REST-backed store in separate work**. The invariants in §3 are the contract the replacement must preserve and should be re-verified when it lands.
- Imported project JSON is Zod-validated and size-limited; it is never evaluated as code or injected as HTML.

There is **no client-side encryption claim**: a key held in the same browser provides no real protection, so project data is stored as plain JSON with explicit export/import instead.

## 2. Authentication and sessions

- Sessions use an HMAC-SHA256 signed token (`api/session.ts`) in a `dss_session` cookie: `HttpOnly`, `SameSite=Lax`, `Secure` in production, 7-day `Max-Age`. OAuth state uses a separate 10-minute `HttpOnly` cookie.
- Google sign-in verifies the ID token server-side via Google's `tokeninfo` endpoint and checks `aud` against the configured Client ID; the OAuth flow uses CSRF state and PKCE.
- Direct email sign-in is disabled in production. When enabled locally it derives a deterministic ID from the email (`usr_<sha256(email)[:16]>`); it does not prove inbox ownership and must not be treated as strong authentication.
- All `/api/user/projects*` handlers call `getAuthenticatedUser(req)` and return `401` when no valid session is present.

## 3. Data-isolation invariants

- A request may only read or mutate projects belonging to the authenticated user. `userId` must come from the verified session, **never** from the request body, query string or path.
- Project records must include `id` and `name`; `id` must be a bounded, safe token (`^[a-zA-Z0-9_-]+$`).
- Client-supplied `userId`, owner or role fields (e.g. `isAdmin`) must not reassign a project or escalate privileges; the server overwrites ownership from the session.
- Project listing is scoped server-side to the session user; there is no collection-wide listing endpoint.
- Unknown API routes return `404`; unsupported methods are not silently accepted.

## 4. Request hardening already in place

- `express.json` uses a 100 KB default body limit (raised only where a route needs more); project imports are additionally size-limited and Zod-validated.
- Per-IP rate limiting with periodic cleanup, with a tighter budget on authentication routes.
- Security headers: CSP, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `X-Frame-Options: SAMEORIGIN`, `Permissions-Policy`, and HSTS in production.
- Preview iframe `postMessage` handling checks `event.origin`; user-supplied text is escaped before being emitted into generated HTML.
- Secrets (`GOOGLE_CLIENT_SECRET`, session secret) stay server-side; no credentials are `VITE_`-prefixed.

## 5. Verification matrix (targets / regression tests)

Cover these cases with automated tests, especially after the REST store migration:

| # | Case | Expected result |
|---|---|---|
| 1 | Unauthenticated `GET /api/user/projects` | 401 |
| 2 | Unauthenticated `POST /api/user/projects` | 401 |
| 3 | Unauthenticated `PUT` / `DELETE /api/user/projects/:id` | 401 |
| 4 | Body supplies another user's `userId` | Ignored; session identity wins |
| 5 | Cross-user project `PUT` / `DELETE` by ID | Not found / 403; no mutation |
| 6 | Listing widened to all users | Only the session user's projects returned |
| 7 | Missing `id` or `name` | 400 |
| 8 | Oversized or malformed JSON payload | 413 / 400 |
| 9 | Injected `isAdmin` / ownership fields | Stripped or rejected; no privilege change |
| 10 | Invalid or expired session cookie | 401 |
| 11 | Mismatched OAuth state | Authentication rejected |
| 12 | Rate limit exceeded | 429 |

## 6. Out of scope / explicitly not implemented

Firestore rules, server-side encryption at rest, team sharing or cross-user permissions, and third-party analytics. No measured frame-rate or "zero latency" guarantee is claimed.
