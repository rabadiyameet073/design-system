import React from 'react';
import { Check, Sparkles } from 'lucide-react';

export interface PricingTableProps {
  id?: string;
  title?: string;
  subtitle?: string;
}

export const PricingTable: React.FC<PricingTableProps> = ({
  id = 'pricing',
  title = 'Predictable, Transparent Investment Tiers',
  subtitle = 'Choose the tier suited to your team’s scale and operational demands.'
}) => {
  const tiers = [
    {
      name: 'Starter',
      price: '$29',
      period: '/month',
      desc: 'Ideal for independent founders and solo creators.',
      features: ['Up to 3 Active Design Systems', 'Tailwind 4 & CSS Export', 'Real-time WCAG 2.2 AA Audit', 'Standard Support'],
      highlighted: false
    },
    {
      name: 'Studio Pro',
      price: '$79',
      period: '/month',
      desc: 'Engineered for fast-moving product teams and design agencies.',
      features: ['Unlimited Design Systems', 'All 10 Production Exporters', 'Figma Tokens Studio Sync', 'Team Shared Palettes', 'Priority Slack Support'],
      highlighted: true
    },
    {
      name: 'Enterprise',
      price: '$199',
      period: '/month',
      desc: 'For multi-brand organizations requiring strict governance.',
      features: ['Dedicated Token Pipelines', 'SSO & Audit Logging', 'Custom WebGL Spatial Assets', 'Custom Font Subsets', 'SLA & Design Engineering Support'],
      highlighted: false
    }
  ];

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
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase font-bold tracking-widest text-[var(--color-action-primary)] font-[var(--font-mono)]">
            Subscription Plans
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((t, idx) => (
            <div
              key={idx}
              className={`relative p-8 border flex flex-col justify-between transition-all duration-300 ${
                t.highlighted ? 'shadow-[var(--shadow-lg)] ring-2 ring-[var(--color-action-primary)]' : 'shadow-[var(--shadow-sm)]'
              }`}
              style={{
                backgroundColor: 'var(--color-bg-default)',
                borderColor: t.highlighted ? 'var(--color-action-primary)' : 'var(--color-border-default)',
                borderRadius: 'var(--radius-card, var(--radius-xl))'
              }}
            >
              {t.highlighted && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-[var(--radius-full)] shadow-xs"
                  style={{
                    backgroundColor: 'var(--color-action-primary)',
                    color: 'var(--color-action-primary-fg)'
                  }}
                >
                  Most Recommended
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3
                    className="text-lg font-bold text-[var(--color-fg-default)]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {t.name}
                  </h3>
                  <p className="text-xs text-[var(--color-fg-muted)] mt-1 font-[var(--font-body)]">
                    {t.desc}
                  </p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span
                    className="text-4xl font-extrabold text-[var(--color-fg-default)] font-[var(--font-mono)]"
                  >
                    {t.price}
                  </span>
                  <span className="text-xs text-[var(--color-fg-muted)]">{t.period}</span>
                </div>

                <div className="space-y-3 pt-2">
                  {t.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2 text-xs text-[var(--color-fg-default)]">
                      <Check className="w-4 h-4 text-[var(--color-status-success)] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <button
                  className="w-full py-2.5 text-xs font-semibold transition-all shadow-[var(--shadow-sm)] hover:opacity-90 active:scale-98 cursor-pointer"
                  style={{
                    backgroundColor: t.highlighted ? 'var(--button-bg, var(--color-action-primary))' : 'var(--color-bg-surface)',
                    color: t.highlighted ? 'var(--button-fg, var(--color-action-primary-fg))' : 'var(--color-fg-default)',
                    borderColor: t.highlighted ? undefined : 'var(--color-border-default)',
                    border: t.highlighted ? 'var(--button-border, none)' : '1px solid var(--color-border-default)',
                    borderRadius: 'var(--radius-button, var(--radius-md))',
                    fontFamily: 'var(--font-ui, var(--font-body))'
                  }}
                >
                  Choose {t.name}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

