# Changelog

All notable changes to Design System Studio (DSS) will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0-alpha.1] - 2026-10-30

### Phase 0: Cleanup & Reality-Check Alignment
- **Claims Sanitization**:
  - Replaced unprovable claims ("0ms latency", "zero drift") with truthful engineering guarantees ("instant synchronous updates", "single source of truth").
  - Removed "client-side encryption" claims; storage is clearly defined as local-first browser `localStorage` with zero server telemetry by default.
  - Replaced hardcoded "Verified 8.4:1 AAA" contrast claim with dynamically computed WCAG 2.2 contrast math.
- **Standards Upgrade**:
  - Upgraded accessibility baseline to **WCAG 2.2 AA** (including 24×24px minimum touch targets and focus-appearance compliance).
- **Schema & Versioning**:
  - Enforced `schemaVersion: 1` across `DesignProject` and future `DesignTokens` data models.
  - Pinned `package.json` project name to `design-system-studio`.

### Planned Next (Phase 1)
- 3-Tier `DesignTokens` core model (Primitive → Semantic → Component).
- OKLCH color scale generation using `culori` with lightness curves.
- Computed WCAG 2.2 contrast engine with automated `nudgeToContrast()`.
- Tokens to CSS variables serialization engine.
