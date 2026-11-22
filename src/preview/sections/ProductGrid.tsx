import React from 'react';
import { ShoppingBag, Star } from 'lucide-react';

export interface ProductGridProps {
  id?: string;
  title?: string;
  subtitle?: string;
  products?: Array<{ title: string; price: string; image: string; tag: string }>;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  id = 'products',
  title = 'Selected Artifacts & Vessels',
  subtitle = 'Curated stoneware crafted in limited batch editions.',
  products = [
    {
      title: 'Terracotta Amphora Vase',
      price: '$185',
      image: '/src/assets/images/preview_ecommerce_ceramics_1792316645917.jpg',
      tag: 'New Edition'
    },
    {
      title: 'Monolith Stoneware Basin',
      price: '$240',
      image: '/src/assets/images/preview_editorial_arch_1792316647413.jpg',
      tag: 'Limited 20'
    },
    {
      title: 'Nordic Clay Pourer',
      price: '$95',
      image: '/src/assets/images/hero_founder_studio_1792316645323.jpg',
      tag: 'Restocked'
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
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs uppercase font-bold tracking-widest text-[var(--color-action-primary)] font-[var(--font-mono)]">
              Curated Catalog
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
          <button
            className="self-start sm:self-auto px-4 py-2 text-xs font-semibold border transition-all hover:bg-[var(--color-bg-surface)] cursor-pointer"
            style={{
              borderColor: 'var(--color-border-default)',
              color: 'var(--color-fg-default)',
              borderRadius: 'var(--radius-button, var(--radius-md))'
            }}
          >
            View Full Inventory
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((item, idx) => (
            <div
              key={idx}
              className="group relative border overflow-hidden transition-all duration-300 hover:shadow-[var(--shadow-md)] flex flex-col"
              style={{
                backgroundColor: 'var(--color-bg-surface)',
                borderColor: 'var(--color-border-default)',
                borderRadius: 'var(--radius-card, var(--radius-lg))'
              }}
            >
              <div className="relative h-64 overflow-hidden bg-[var(--color-bg-default)]">
                <img
                  src={item.image}
                  alt={item.title}
                  width={600}
                  height={400}
                  style={{ filter: 'var(--image-filter, none)' }}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span
                  className="absolute top-3 left-3 px-2.5 py-1 text-[11px] font-bold rounded-[var(--radius-full)] backdrop-blur-sm"
                  style={{
                    backgroundColor: 'var(--color-bg-default)',
                    color: 'var(--color-fg-default)'
                  }}
                >
                  {item.tag}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3
                    className="text-base font-semibold text-[var(--color-fg-default)]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {item.title}
                  </h3>
                  <div className="text-sm font-bold text-[var(--color-action-primary)] font-[var(--font-mono)] mt-1">
                    {item.price}
                  </div>
                </div>

                <button
                  className="w-full py-2.5 text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-[var(--shadow-sm)] hover:opacity-90 active:scale-98 cursor-pointer"
                  style={{
                    backgroundColor: 'var(--button-bg, var(--color-action-primary))',
                    color: 'var(--button-fg, var(--color-action-primary-fg))',
                    border: 'var(--button-border, none)',
                    borderRadius: 'var(--radius-button, var(--radius-md))',
                    fontFamily: 'var(--font-ui, var(--font-body))'
                  }}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Acquire Piece</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

