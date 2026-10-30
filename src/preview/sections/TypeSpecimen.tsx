import React from 'react';

export interface TypeSpecimenProps {
  id?: string;
}

export const TypeSpecimen: React.FC<TypeSpecimenProps> = ({ id = 'type-specimen' }) => {
  return (
    <section
      id={id}
      className="w-full py-16 px-6 sm:px-12 border-t border-[var(--color-border-default)] bg-[var(--color-bg-default)]"
      style={{
        backgroundColor: 'var(--color-bg-default)',
        borderColor: 'var(--color-border-default)'
      }}
    >
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="border-b border-[var(--color-border-default)] pb-4">
          <span className="text-xs uppercase font-bold tracking-widest text-[var(--color-action-primary)] font-[var(--font-mono)]">
            Typography System
          </span>
          <h2
            className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-fg-default)] mt-1"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Fluid Type Scale & Hierarchy
          </h2>
        </div>

        <div className="space-y-8">
          {/* Display & H1 */}
          <div className="space-y-1">
            <div className="text-[11px] font-mono text-[var(--color-fg-muted)]">
              Display / Hero Heading · var(--font-display)
            </div>
            <h1
              className="font-bold tracking-tight text-[var(--color-fg-default)] leading-none"
              style={{
                fontFamily: 'var(--font-display, var(--font-heading))',
                fontSize: 'var(--text-5xl, clamp(2.5rem, 5vw, 4rem))'
              }}
            >
              Editorial Architecture in Fluid Harmony
            </h1>
          </div>

          {/* H2 */}
          <div className="space-y-1">
            <div className="text-[11px] font-mono text-[var(--color-fg-muted)]">
              Heading 2 · var(--font-heading)
            </div>
            <h2
              className="font-bold tracking-tight text-[var(--color-fg-default)] leading-tight"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-3xl, clamp(1.75rem, 3.5vw, 2.5rem))'
              }}
            >
              Bespoke typography that speaks with intentional craft
            </h2>
          </div>

          {/* H3 */}
          <div className="space-y-1">
            <div className="text-[11px] font-mono text-[var(--color-fg-muted)]">
              Heading 3 · var(--font-heading)
            </div>
            <h3
              className="font-semibold tracking-tight text-[var(--color-fg-default)]"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-xl, clamp(1.25rem, 2vw, 1.75rem))'
              }}
            >
              Consistent modular mathematical ratio across all viewport sizes
            </h3>
          </div>

          {/* Body Copy */}
          <div className="space-y-2 max-w-3xl">
            <div className="text-[11px] font-mono text-[var(--color-fg-muted)]">
              Body Copy · var(--font-body) · Reading Measure: 65ch
            </div>
            <p
              className="leading-relaxed text-[var(--color-fg-default)] opacity-90"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-base, 1rem)',
                maxWidth: '65ch'
              }}
            >
              Typography is the emotional voice of software. By locking body copy to fluid mathematical clamps and ensuring minimum 4.5:1 WCAG 2.2 AA contrast ratios, text remains effortlessly legible on compact 375px smartphones as well as ultra-wide 4K workstations.
            </p>
          </div>

          {/* Monospace Code Block */}
          <div className="space-y-2">
            <div className="text-[11px] font-mono text-[var(--color-fg-muted)]">
              Monospace Token Definition · var(--font-mono)
            </div>
            <pre
              className="p-4 rounded-[var(--radius-md)] border text-xs overflow-x-auto"
              style={{
                fontFamily: 'var(--font-mono)',
                backgroundColor: 'var(--color-bg-surface)',
                borderColor: 'var(--color-border-default)',
                color: 'var(--color-action-primary)'
              }}
            >
              <code>{`@theme inline {
  --font-heading: var(--font-heading);
  --font-body: var(--font-body);
  --text-base: var(--text-base);
  --radius-md: var(--radius-md);
}`}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
};

