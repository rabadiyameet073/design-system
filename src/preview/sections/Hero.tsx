import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export interface HeroProps {
  id?: string;
  badge?: string;
  title?: string;
  subtitle?: string;
  primaryAction?: string;
  secondaryAction?: string;
  imageUrl?: string;
  imageAlt?: string;
}

export const Hero: React.FC<HeroProps> = ({
  id = 'hero',
  badge = 'Handcrafted Luxury Collection',
  title = 'Artisanal objects designed to endure generations',
  subtitle = 'Discover rare stoneware ceramics, bespoke studio glassware, and natural pigment glazes shaped by master artisans.',
  primaryAction = 'Explore Collection',
  secondaryAction = 'Studio Monograph',
  imageUrl = '/src/assets/images/preview_ecommerce_ceramics_1792316645917.jpg',
  imageAlt = 'Bespoke ceramics on architectural pedestal'
}) => {
  return (
    <section
      id={id}
      className="relative w-full py-16 sm:py-24 px-6 sm:px-12 overflow-hidden"
      style={{
        backgroundColor: 'var(--color-bg-default)',
        color: 'var(--color-fg-default)'
      }}
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Copy */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[var(--radius-full)] text-xs font-semibold border"
            style={{
              backgroundColor: 'var(--color-bg-surface)',
              borderColor: 'var(--color-border-default)',
              color: 'var(--color-action-primary)'
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{badge}</span>
          </div>

          <h1
            className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08] text-balance"
            style={{
              fontFamily: 'var(--font-display, var(--font-heading))'
            }}
          >
            {title}
          </h1>

          <p
            className="text-base sm:text-lg text-[var(--color-fg-muted)] font-light leading-relaxed max-w-xl text-pretty"
            style={{
              fontFamily: 'var(--font-body)'
            }}
          >
            {subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              className="px-6 py-3 text-sm font-semibold tracking-wide flex items-center gap-2 transition-all shadow-[var(--shadow-md)] hover:opacity-90 active:scale-95 cursor-pointer"
              style={{
                backgroundColor: 'var(--color-action-primary)',
                color: 'var(--color-action-primary-fg)',
                borderRadius: 'var(--radius-md)',
                fontFamily: 'var(--font-ui, var(--font-body))'
              }}
            >
              <span>{primaryAction}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              className="px-6 py-3 text-sm font-semibold tracking-wide border transition-all hover:bg-[var(--color-bg-surface)] active:scale-95 cursor-pointer"
              style={{
                borderColor: 'var(--color-border-default)',
                color: 'var(--color-fg-default)',
                borderRadius: 'var(--radius-md)',
                fontFamily: 'var(--font-ui, var(--font-body))'
              }}
            >
              {secondaryAction}
            </button>
          </div>

          <div className="pt-4 flex items-center gap-6 text-xs text-[var(--color-fg-muted)]">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[var(--color-status-success)]" />
              <span>Certified Sustainable</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[var(--color-status-success)]" />
              <span>Worldwide White-Glove Courier</span>
            </div>
          </div>
        </div>

        {/* Media */}
        <div className="lg:col-span-5">
          <div
            className="relative overflow-hidden shadow-[var(--shadow-lg)] border"
            style={{
              borderRadius: 'var(--radius-lg)',
              borderColor: 'var(--color-border-default)',
              backgroundColor: 'var(--color-bg-surface)'
            }}
          >
            <img
              src={imageUrl}
              alt={imageAlt}
              width={800}
              height={600}
              className="w-full h-80 sm:h-96 object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

