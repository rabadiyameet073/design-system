# Security Policy & Vulnerability Reporting

Design System Studio takes application security, user privacy, and data isolation seriously.

---

## 1. Reporting a Vulnerability
If you discover a security issue or vulnerability in Design System Studio:
- Please **do not** create a public GitHub issue.
- Email your findings directly to the maintainers at `security@designsystemstudio.dev`.
- Provide reproduction steps, potential impact, and suggested mitigations.
- Maintainers will acknowledge receipt within 48 hours and coordinate a coordinated disclosure timeline.

---

## 2. Security Architecture Guardrails
- **Zero Third-Party Leaks**: Design System Studio is local-first. Tokens and project configurations are persisted locally in IndexedDB/LocalStorage.
- **Strict postMessage Origin Verification**: The preview iframe communication channel enforces origin checks on both inbound and outbound messages.
- **Input Sanitization**: All token imports, SVG paths, and custom fonts are strictly validated against Zod schemas to prevent XSS payloads.
- **Secure Serverless Sessions**: Backend endpoints enforce HMAC session signatures, CSRF validation states, and strict CORS headers.
