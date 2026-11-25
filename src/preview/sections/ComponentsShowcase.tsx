import React from 'react';
import {
  CheckCircle,
  AlertTriangle,
  Info,
  XCircle,
  ArrowRight,
  Loader2,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  ChevronDown,
  Eye
} from 'lucide-react';

export interface ComponentsShowcaseProps {
  id?: string;
}

export const ComponentsShowcase: React.FC<ComponentsShowcaseProps> = ({ id = 'components-showcase' }) => {
  return (
    <section
      id={id}
      className="w-full py-16 px-6 sm:px-12 border-t border-[var(--color-border-default)] bg-[var(--color-bg-surface)]"
      style={{
        backgroundColor: 'var(--color-bg-surface)',
        borderColor: 'var(--color-border-default)'
      }}
    >
      <div className="max-w-6xl mx-auto space-y-14">
        {/* Section Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[var(--radius-full)] text-xs font-semibold bg-[var(--color-action-primary)] text-[var(--color-action-primary-fg)]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Design System Token Showcase · Doc 04 §4</span>
          </div>
          <h2
            className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-fg-default)]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Components, Variants & State Matrix
          </h2>
          <p className="text-sm text-[var(--color-fg-muted)] max-w-2xl font-[var(--font-body)]">
            Every interactive control is styled purely with your active design tokens: dynamic OKLCH action colors, radii, layered tinted shadows, and accessible WCAG 2.2 focus rings.
          </p>
        </div>

        {/* 1. Buttons Matrix (Variants × Sizes × States) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs uppercase font-bold tracking-wider text-[var(--color-fg-muted)]">
              1. Buttons: Variants (Filled, Outline, Subtle, Ghost, Destructive) & States
            </h3>
            <span className="text-[11px] font-mono text-[var(--color-fg-muted)]">Touch targets ≥ 44×44px</span>
          </div>

          <div
            className="p-6 border border-[var(--color-border-default)] bg-[var(--color-bg-default)] space-y-6"
            style={{ borderRadius: 'var(--radius-card, var(--radius-lg))' }}
          >
            {/* Variants row */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Primary Filled */}
              <button
                className="px-4 py-2 text-sm font-medium transition-all shadow-[var(--shadow-sm)] hover:opacity-95 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)] cursor-pointer"
                style={{
                  backgroundColor: 'var(--color-action-primary)',
                  color: 'var(--color-action-primary-fg)',
                  borderRadius: 'var(--radius-button, var(--radius-md))'
                }}
              >
                Filled (Primary)
              </button>

              {/* Outline */}
              <button
                className="px-4 py-2 text-sm font-medium border transition-all hover:bg-[var(--color-bg-surface)] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)] cursor-pointer"
                style={{
                  borderColor: 'var(--color-border-default)',
                  color: 'var(--color-fg-default)',
                  borderRadius: 'var(--radius-button, var(--radius-md))'
                }}
              >
                Outline Button
              </button>

              {/* Subtle / Soft */}
              <button
                className="px-4 py-2 text-sm font-medium transition-all hover:opacity-90 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)] cursor-pointer"
                style={{
                  backgroundColor: 'var(--color-status-info-bg)',
                  color: 'var(--color-status-info-fg)',
                  borderRadius: 'var(--radius-button, var(--radius-md))'
                }}
              >
                Subtle Action
              </button>

              {/* Ghost */}
              <button
                className="px-4 py-2 text-sm font-medium transition-all hover:bg-[var(--color-bg-surface)] text-[var(--color-fg-default)] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)] cursor-pointer"
                style={{
                  borderRadius: 'var(--radius-button, var(--radius-md))'
                }}
              >
                Ghost Minimal
              </button>

              {/* Destructive */}
              <button
                className="px-4 py-2 text-sm font-medium transition-all hover:opacity-90 active:scale-95 cursor-pointer"
                style={{
                  color: 'var(--color-status-danger-fg)',
                  backgroundColor: 'var(--color-status-danger-bg)',
                  borderRadius: 'var(--radius-button, var(--radius-md))'
                }}
              >
                Destructive
              </button>

              {/* Loading */}
              <button
                disabled
                className="px-4 py-2 text-sm font-medium opacity-70 flex items-center gap-2 cursor-not-allowed"
                style={{
                  backgroundColor: 'var(--color-action-primary)',
                  color: 'var(--color-action-primary-fg)',
                  borderRadius: 'var(--radius-button, var(--radius-md))'
                }}
              >
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Loading...</span>
              </button>

              {/* Disabled */}
              <button
                disabled
                className="px-4 py-2 text-sm font-medium opacity-40 cursor-not-allowed border"
                style={{
                  borderColor: 'var(--color-border-default)',
                  color: 'var(--color-fg-muted)',
                  borderRadius: 'var(--radius-button, var(--radius-md))'
                }}
              >
                Disabled State
              </button>
            </div>

            {/* Sizes row */}
            <div className="pt-4 border-t border-[var(--color-border-default)] flex flex-wrap items-center gap-4">
              <span className="text-xs font-mono font-bold text-[var(--color-fg-muted)]">Sizes:</span>
              <button
                className="px-3 py-1.5 text-xs font-medium"
                style={{
                  backgroundColor: 'var(--color-action-primary)',
                  color: 'var(--color-action-primary-fg)',
                  borderRadius: 'var(--radius-button, var(--radius-md))'
                }}
              >
                Small (sm)
              </button>
              <button
                className="px-4 py-2 text-sm font-medium"
                style={{
                  backgroundColor: 'var(--color-action-primary)',
                  color: 'var(--color-action-primary-fg)',
                  borderRadius: 'var(--radius-button, var(--radius-md))'
                }}
              >
                Medium (md - Default)
              </button>
              <button
                className="px-6 py-3 text-base font-medium"
                style={{
                  backgroundColor: 'var(--color-action-primary)',
                  color: 'var(--color-action-primary-fg)',
                  borderRadius: 'var(--radius-button, var(--radius-md))'
                }}
              >
                Large (lg)
              </button>
            </div>
          </div>
        </div>

        {/* 2. Inputs, Select & Textarea */}
        <div className="space-y-4">
          <h3 className="text-xs uppercase font-bold tracking-wider text-[var(--color-fg-muted)]">
            2. Form Controls: Input, Select, Textarea & Focus States
          </h3>
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6 border border-[var(--color-border-default)] bg-[var(--color-bg-default)]"
            style={{ borderRadius: 'var(--radius-card, var(--radius-lg))' }}
          >
            {/* Outline Input */}
            <div className="space-y-1.5">
              <label htmlFor="showcase-outline-input" className="text-xs font-semibold text-[var(--color-fg-default)]">
                Outline Input
              </label>
              <input
                id="showcase-outline-input"
                type="text"
                defaultValue="Jane Doe"
                className="w-full px-3.5 py-2 text-sm border bg-[var(--color-bg-surface)] text-[var(--color-fg-default)] focus:outline-2 focus:outline-offset-2 focus:outline-[var(--color-focus-ring)] transition-all"
                style={{
                  borderColor: 'var(--color-border-default)',
                  borderRadius: 'var(--radius-input, var(--radius-sm))'
                }}
              />
              <span className="text-[11px] text-[var(--color-fg-muted)]">Helper label text</span>
            </div>

            {/* Filled Input */}
            <div className="space-y-1.5">
              <label htmlFor="showcase-filled-input" className="text-xs font-semibold text-[var(--color-fg-default)]">
                Filled Input
              </label>
              <input
                id="showcase-filled-input"
                type="text"
                defaultValue="Acme Studio"
                className="w-full px-3.5 py-2 text-sm border border-transparent bg-[var(--color-bg-surface)] text-[var(--color-fg-default)] focus:outline-2 focus:outline-offset-2 focus:outline-[var(--color-focus-ring)] transition-all"
                style={{
                  borderRadius: 'var(--radius-input, var(--radius-sm))'
                }}
              />
              <span className="text-[11px] text-[var(--color-fg-muted)]">Filled surface tone</span>
            </div>

            {/* Select Input */}
            <div className="space-y-1.5">
              <label htmlFor="showcase-select" className="text-xs font-semibold text-[var(--color-fg-default)]">
                Select Dropdown
              </label>
              <div className="relative">
                <select
                  id="showcase-select"
                  defaultValue="enterprise"
                  className="w-full appearance-none px-3.5 py-2 text-sm border bg-[var(--color-bg-surface)] text-[var(--color-fg-default)] focus:outline-2 focus:outline-offset-2 focus:outline-[var(--color-focus-ring)] transition-all cursor-pointer"
                  style={{
                    borderColor: 'var(--color-border-default)',
                    borderRadius: 'var(--radius-input, var(--radius-sm))'
                  }}
                >
                  <option value="starter">Starter License</option>
                  <option value="growth">Growth Tier</option>
                  <option value="enterprise">Enterprise Custom</option>
                </select>
                <ChevronDown className="w-4 h-4 text-[var(--color-fg-muted)] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <span className="text-[11px] text-[var(--color-fg-muted)]">Native accessible select</span>
            </div>

            {/* Error State */}
            <div className="space-y-1.5">
              <label htmlFor="showcase-error-input" className="text-xs font-semibold text-[var(--color-status-danger)]">
                Validation Error
              </label>
              <input
                id="showcase-error-input"
                type="text"
                defaultValue="invalid_slug#99"
                className="w-full px-3.5 py-2 text-sm border bg-[var(--color-bg-surface)] text-[var(--color-fg-default)] transition-all"
                style={{
                  borderColor: 'var(--color-status-danger)',
                  borderRadius: 'var(--radius-input, var(--radius-sm))'
                }}
              />
              <span className="text-[11px] text-[var(--color-status-danger)]">Format requires alphanumeric</span>
            </div>
          </div>
        </div>

        {/* 3. Cards Matrix (Flat, Outlined, Elevated) */}
        <div className="space-y-4">
          <h3 className="text-xs uppercase font-bold tracking-wider text-[var(--color-fg-muted)]">
            3. Card Surface Treatments: Flat, Outlined & Elevated
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Flat Card */}
            <div
              className="p-6 transition-all"
              style={{
                backgroundColor: 'var(--color-bg-surface)',
                borderRadius: 'var(--radius-card, var(--radius-lg))'
              }}
            >
              <span className="text-[10px] font-mono uppercase font-bold text-[var(--color-fg-muted)]">
                Treatment: Flat
              </span>
              <h4 className="text-base font-bold text-[var(--color-fg-default)] mt-1">
                Subtle Canvas Blend
              </h4>
              <p className="text-xs text-[var(--color-fg-muted)] mt-2 leading-relaxed">
                Uses the surface container color with no border, blending softly into the background canvas.
              </p>
            </div>

            {/* Outlined Card */}
            <div
              className="p-6 border transition-all hover:border-[var(--color-action-primary)] cursor-pointer"
              style={{
                backgroundColor: 'var(--color-bg-surface)',
                borderColor: 'var(--color-border-default)',
                borderRadius: 'var(--radius-card, var(--radius-lg))'
              }}
            >
              <span className="text-[10px] font-mono uppercase font-bold text-[var(--color-action-primary)]">
                Treatment: Outlined
              </span>
              <h4 className="text-base font-bold text-[var(--color-fg-default)] mt-1">
                Hairline Boundary
              </h4>
              <p className="text-xs text-[var(--color-fg-muted)] mt-2 leading-relaxed">
                Delimited by a 1px boundary with ≥ 3:1 contrast against adjacent background.
              </p>
            </div>

            {/* Elevated Card */}
            <div
              className="p-6 border transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-lg)] cursor-pointer"
              style={{
                backgroundColor: 'var(--color-bg-elevated, var(--color-bg-surface))',
                borderColor: 'var(--color-border-default)',
                boxShadow: 'var(--shadow-md)',
                borderRadius: 'var(--radius-card, var(--radius-lg))'
              }}
            >
              <span className="text-[10px] font-mono uppercase font-bold text-[var(--color-fg-default)]">
                Treatment: Elevated
              </span>
              <h4 className="text-base font-bold text-[var(--color-fg-default)] mt-1">
                Brand-Tinted Shadow
              </h4>
              <p className="text-xs text-[var(--color-fg-default)] mt-2 leading-relaxed">
                Multi-layer soft shadow with subtle brand hue tinting to avoid dead, dirty-black shadows.
              </p>
            </div>
          </div>
        </div>

        {/* 4. Badges & Alerts (Status Tones: Info, Success, Warning, Danger) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs uppercase font-bold tracking-wider text-[var(--color-fg-muted)]">
              4. Status Badges & Alert Banners (Always with Icon + Text)
            </h3>
            <span className="text-[11px] text-[var(--color-fg-muted)] flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              <span>Colorblind safe: Never relies on hue alone</span>
            </span>
          </div>

          <div
            className="p-6 border border-[var(--color-border-default)] bg-[var(--color-bg-default)] space-y-6"
            style={{ borderRadius: 'var(--radius-card, var(--radius-lg))' }}
          >
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Success */}
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium border"
                style={{
                  backgroundColor: 'var(--color-status-success-bg)',
                  color: 'var(--color-status-success-fg)',
                  borderColor: 'var(--color-status-success)',
                  borderRadius: 'var(--radius-full)'
                }}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Success (Confirmed)</span>
              </span>

              {/* Warning */}
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium border"
                style={{
                  backgroundColor: 'var(--color-status-warning-bg)',
                  color: 'var(--color-status-warning-fg)',
                  borderColor: 'var(--color-status-warning)',
                  borderRadius: 'var(--radius-full)'
                }}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Warning (Review)</span>
              </span>

              {/* Danger */}
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium border"
                style={{
                  backgroundColor: 'var(--color-status-danger-bg)',
                  color: 'var(--color-status-danger-fg)',
                  borderColor: 'var(--color-status-danger)',
                  borderRadius: 'var(--radius-full)'
                }}
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Critical (Alert)</span>
              </span>

              {/* Info */}
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium border"
                style={{
                  backgroundColor: 'var(--color-status-info-bg)',
                  color: 'var(--color-status-info-fg)',
                  borderColor: 'var(--color-status-info)',
                  borderRadius: 'var(--radius-full)'
                }}
              >
                <Info className="w-3.5 h-3.5" />
                <span>Information (Notice)</span>
              </span>
            </div>

            {/* Alert Notification Banners */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[var(--color-border-default)]">
              {/* Solid Banner */}
              <div
                className="p-4 flex items-center justify-between text-xs font-medium"
                style={{
                  backgroundColor: 'var(--color-action-primary)',
                  color: 'var(--color-action-primary-fg)',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Design tokens synchronized across all viewports.</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </div>

              {/* Subtle Banner */}
              <div
                className="p-4 border flex items-center justify-between text-xs font-medium"
                style={{
                  backgroundColor: 'var(--color-status-info-bg)',
                  color: 'var(--color-status-info-fg)',
                  borderColor: 'var(--color-status-info)',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  <span>WCAG 2.2 AA contrast verified for all color scales.</span>
                </div>
                <ExternalLink className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* 5. Typography Links & Focus Ring Indicator */}
        <div className="space-y-4">
          <h3 className="text-xs uppercase font-bold tracking-wider text-[var(--color-fg-muted)]">
            5. Text Links & Accessible Focus Outlines (WCAG 2.2 §2.4.11)
          </h3>
          <div
            className="p-6 border border-[var(--color-border-default)] bg-[var(--color-bg-default)] flex flex-wrap items-center gap-8 text-sm"
            style={{ borderRadius: 'var(--radius-card, var(--radius-lg))' }}
          >
            <a
              href="#components-showcase"
              className="text-[var(--color-action-primary)] underline hover:opacity-80 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]"
            >
              Inline Underlined Link
            </a>

            <a
              href="#components-showcase"
              className="inline-flex items-center gap-1.5 text-[var(--color-fg-default)] hover:text-[var(--color-action-primary)] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]"
            >
              <span>Standalone Arrow Link</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--color-fg-muted)]">Focus Ring:</span>
              <div
                className="w-5 h-5 rounded outline-2 outline-offset-2 shadow-xs"
                style={{
                  backgroundColor: 'var(--color-bg-surface)',
                  outlineColor: 'var(--color-focus-ring)'
                }}
                title="Focus ring color satisfies ≥ 3:1 contrast against adjacent background"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
