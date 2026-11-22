import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface FAQProps {
  id?: string;
  title?: string;
  items?: Array<{ q: string; a: string }>;
}

export const FAQ: React.FC<FAQProps> = ({
  id = 'faq',
  title = 'Frequently Inquired Queries',
  items = [
    {
      q: 'How does the design token architecture prevent style drift?',
      a: 'All styles derive from a single three-tier DesignTokens JSON schema. Changing a primitive color automatically cascades across all semantic tokens, CSS custom properties, and Tailwind theme rules synchronously.'
    },
    {
      q: 'Can I export directly to existing Tailwind CSS 4 projects?',
      a: 'Yes. Studio outputs an optimized @theme inline configuration block that plugs directly into your index.css or global stylesheet with zero build configuration.'
    },
    {
      q: 'Is dark mode luminance handled with simple inversion?',
      a: 'No. Dark mode is generated using perceptual OKLCH lightness ramps and elevated surface tones, ensuring proper visual depth and verified WCAG 2.2 contrast without flat black backgrounds.'
    }
  ]
}) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section
      id={id}
      className="w-full py-16 px-6 sm:px-12 border-t"
      style={{
        backgroundColor: 'var(--color-bg-surface)',
        borderColor: 'var(--color-border-default)'
      }}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        <h2
          className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-fg-default)] text-center"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {title}
        </h2>

        <div className="space-y-4">
          {items.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="border overflow-hidden transition-colors"
                style={{
                  backgroundColor: 'var(--color-bg-default)',
                  borderColor: 'var(--color-border-default)',
                  borderRadius: 'var(--radius-card, var(--radius-lg))'
                }}
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-[var(--color-fg-default)] cursor-pointer"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[var(--color-fg-muted)] transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-[var(--color-fg-muted)] leading-relaxed font-[var(--font-body)]">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

