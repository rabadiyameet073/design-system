import React from 'react';
import {
  CheckCircle,
  AlertTriangle,
  Info,
  XCircle,
  ArrowRight,
  Loader2,
  Sparkles
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
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[var(--radius-full)] text-xs font-semibold bg-[var(--color-action-primary)] text-[var(--color-action-primary-fg)]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Design System Token Showcase</span>
          </div>
          <h2
            className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-fg-default)]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Components & State Matrix
          </h2>
          <p className="text-sm text-[var(--color-fg-muted)] max-w-2xl font-[var(--font-body)]">
            Every interactive control is styled purely with your active design tokens: dynamic OKLCH action colors, radii, shadows, and accessible focus outlines.
          </p>
        </div>

        {/* 1. Buttons Matrix */}
        <div className="space-y-4">
          <h3 className="text-xs uppercase font-bold tracking-wider text-[var(--color-fg-muted)]">
            Buttons: Variants & States
          </h3>
          <div className="flex flex-wrap items-center gap-4 p-6 rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-bg-default)]">
            {/* Primary Filled */}
            <button
              className="px-4 py-2 text-sm font-medium transition-all shadow-[var(--shadow-sm)] hover:opacity-95 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)] cursor-pointer"
              style={{
                backgroundColor: 'var(--color-action-primary)',
                color: 'var(--color-action-primary-fg)',
                borderRadius: 'var(--radius-md)'
              }}
            >
              Primary Filled
            </button>

            {/* Outline */}
            <button
              className="px-4 py-2 text-sm font-medium border transition-all hover:bg-[var(--color-bg-surface)] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)] cursor-pointer"
              style={{
                borderColor: 'var(--color-border-default)',
                color: 'var(--color-fg-default)',
                borderRadius: 'var(--radius-md)'
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
                borderRadius: 'var(--radius-md)'
              }}
            >
              Subtle Action
            </button>

            {/* Destructive */}
            <button
              className="px-4 py-2 text-sm font-medium transition-all hover:opacity-90 active:scale-95 cursor-pointer"
              style={{
                backgroundColor: 'var(--color-status-danger)',
                color: '#FFFFFF',
                borderRadius: 'var(--radius-md)'
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
                borderRadius: 'var(--radius-md)'
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
                borderRadius: 'var(--radius-md)'
              }}
            >
              Disabled
            </button>
          </div>
        </div>

        {/* 2. Inputs & Form Fields */}
        <div className="space-y-4">
          <h3 className="text-xs uppercase font-bold tracking-wider text-[var(--color-fg-muted)]">
            Form Controls & Inputs
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-bg-default)]">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--color-fg-default)]">
                Default Input
              </label>
              <input
                type="text"
                defaultValue="Jane Doe"
                className="w-full px-3.5 py-2 text-sm border bg-[var(--color-bg-surface)] text-[var(--color-fg-default)] focus:outline-2 focus:outline-offset-1 focus:outline-[var(--color-focus-ring)] transition-all"
                style={{
                  borderColor: 'var(--color-border-default)',
                  borderRadius: 'var(--radius-md)'
                }}
              />
              <span className="text-[11px] text-[var(--color-fg-muted)]">Standard placeholder helper</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--color-fg-default)]">
                Active / Focused
              </label>
              <input
                type="email"
                defaultValue="jane@acme.org"
                className="w-full px-3.5 py-2 text-sm border bg-[var(--color-bg-surface)] text-[var(--color-fg-default)] outline-2 outline-offset-1 outline-[var(--color-focus-ring)] transition-all"
                style={{
                  borderColor: 'var(--color-action-primary)',
                  borderRadius: 'var(--radius-md)'
                }}
              />
              <span className="text-[11px] text-[var(--color-action-primary)]">Compliant focus ring</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--color-status-danger)]">
                Validation Error
              </label>
              <input
                type="text"
                defaultValue="invalid_slug#99"
                className="w-full px-3.5 py-2 text-sm border bg-[var(--color-bg-surface)] text-[var(--color-fg-default)] transition-all"
                style={{
                  borderColor: 'var(--color-status-danger)',
                  borderRadius: 'var(--radius-md)'
                }}
              />
              <span className="text-[11px] text-[var(--color-status-danger)]">Please enter a valid format</span>
            </div>
          </div>
        </div>

        {/* 3. Status Badges & Alerts */}
        <div className="space-y-4">
          <h3 className="text-xs uppercase font-bold tracking-wider text-[var(--color-fg-muted)]">
            Status Badges & Notification Banners
          </h3>
          <div className="flex flex-wrap gap-3">
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
              <span>Success Confirmed</span>
            </span>

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
              <span>Warning Required</span>
            </span>

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
              <span>Critical Alert</span>
            </span>

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
              <span>Informational Note</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

