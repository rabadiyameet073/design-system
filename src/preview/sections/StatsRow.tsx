import React from 'react';

export interface StatsRowProps {
  id?: string;
  stats?: Array<{ label: string; value: string }>;
}

export const StatsRow: React.FC<StatsRowProps> = ({
  id = 'stats',
  stats = [
    { label: 'Annualized Token Volume', value: '$4.2B+' },
    { label: 'P99 Execution Latency', value: '1.4ms' },
    { label: 'Audited Smart Vaults', value: '140+' },
    { label: 'Uptime SLA Guarantee', value: '99.99%' }
  ]
}) => {
  return (
    <section
      id={id}
      className="w-full py-12 px-6 sm:px-12 border-t"
      style={{
        backgroundColor: 'var(--color-bg-surface)',
        borderColor: 'var(--color-border-default)'
      }}
    >
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s, idx) => (
          <div key={idx} className="space-y-1 text-center md:text-left">
            <div
              className="text-3xl sm:text-4xl font-extrabold text-[var(--color-fg-default)] font-[var(--font-mono)]"
            >
              {s.value}
            </div>
            <div className="text-xs text-[var(--color-fg-muted)] font-[var(--font-body)]">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
