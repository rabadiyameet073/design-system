import React from 'react';
import { Layers, ShieldCheck, Zap, Compass } from 'lucide-react';

export interface FeatureGridProps {
  id?: string;
  title?: string;
  subtitle?: string;
  features?: Array<{ title: string; description: string }>;
}

export const FeatureGrid: React.FC<FeatureGridProps> = ({
  id = 'features',
  title = 'Engineered for Performance & Aesthetic Clarity',
  subtitle = 'Every detail is mathematically calibrated to deliver unrivaled resilience and visual elegance.',
  features = [
    {
      title: 'Perceptual Lightness Curves',
      description: 'Even visual pacing across OKLCH color spaces, preventing harsh transitions or muddy contrast.'
    },
    {
      title: 'Modular Responsive Fluidity',
      description: 'Continuous clamp typography and spatial spacing that adapts smoothly from smartphones to 4K displays.'
    },
    {
      title: 'Zero Latency Sync',
      description: 'Design decisions compile directly into CSS variables, ensuring immediate updates without frame dropping.'
    },
    {
      title: 'Guaranteed WCAG 2.2 AA',
      description: 'Built-in real-time auditing and automated contrast nudging for universal accessibility.'
    }
  ]
}) => {
  const icons = [Layers, Compass, Zap, ShieldCheck];

  return (
    <section
      id={id}
      className="w-full py-16 px-6 sm:px-12 border-t"
      style={{
        backgroundColor: 'var(--color-bg-surface)',
        borderColor: 'var(--color-border-default)'
      }}
    >
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="max-w-2xl space-y-3">
          <span className="text-xs uppercase font-bold tracking-widest text-[var(--color-action-primary)] font-[var(--font-mono)]">
            Core Architecture
          </span>
          <h2
            className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-fg-default)]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {title}
          </h2>
          <p className="text-sm text-[var(--color-fg-muted)] font-[var(--font-body)]">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => {
            const Icon = icons[idx % icons.length];
            return (
              <div
                key={idx}
                className="p-6 rounded-[var(--radius-lg)] border transition-all duration-300 hover:shadow-[var(--shadow-md)] flex flex-col justify-between"
                style={{
                  backgroundColor: 'var(--color-bg-default)',
                  borderColor: 'var(--color-border-default)'
                }}
              >
                <div className="space-y-4">
                  <div
                    className="w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center"
                    style={{
                      backgroundColor: 'var(--color-status-info-bg)',
                      color: 'var(--color-action-primary)'
                    }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3
                    className="text-base font-semibold text-[var(--color-fg-default)]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {feat.title}
                  </h3>
                  <p className="text-xs text-[var(--color-fg-muted)] leading-relaxed font-[var(--font-body)]">
                    {feat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
