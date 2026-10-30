import React from 'react';
import { Star, Quote } from 'lucide-react';

export interface TestimonialsProps {
  id?: string;
  title?: string;
  testimonials?: Array<{ quote: string; author: string; role: string }>;
}

export const Testimonials: React.FC<TestimonialsProps> = ({
  id = 'testimonials',
  title = 'Trusted by Discerning Founders and Creative Directors',
  testimonials = [
    {
      quote: 'We cut our design system handoff from 6 weeks to 3 days. Our engineers get Tailwind tokens and Figma variables that match to the decimal.',
      author: 'Elena Rostova',
      role: 'VP Design, Vespera Commerce'
    },
    {
      quote: 'The mathematical lightness scale and live contrast check saved us from launching an inaccessible brand refresh. Invaluable tool.',
      author: 'Marcus Vance',
      role: 'Founder & Principal, Studio Koto'
    }
  ]
}) => {
  return (
    <section
      id={id}
      className="w-full py-16 px-6 sm:px-12 border-t"
      style={{
        backgroundColor: 'var(--color-bg-default)',
        borderColor: 'var(--color-border-default)'
      }}
    >
      <div className="max-w-6xl mx-auto space-y-12">
        <h2
          className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-fg-default)] text-center"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-8 rounded-[var(--radius-xl)] border space-y-6 flex flex-col justify-between"
              style={{
                backgroundColor: 'var(--color-bg-surface)',
                borderColor: 'var(--color-border-default)'
              }}
            >
              <div className="space-y-4">
                <Quote className="w-8 h-8 text-[var(--color-action-primary)] opacity-40" />
                <p
                  className="text-base sm:text-lg italic leading-relaxed text-[var(--color-fg-default)]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  "{t.quote}"
                </p>
              </div>

              <div className="border-t border-[var(--color-border-default)] pt-4">
                <div className="font-semibold text-sm text-[var(--color-fg-default)]">
                  {t.author}
                </div>
                <div className="text-xs text-[var(--color-fg-muted)] font-[var(--font-body)]">
                  {t.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
