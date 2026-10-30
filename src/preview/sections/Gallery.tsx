import React from 'react';

export interface GalleryProps {
  id?: string;
  title?: string;
  images?: Array<{ src: string; caption: string }>;
}

export const Gallery: React.FC<GalleryProps> = ({
  id = 'gallery',
  title = 'Visual Atelier & Spatial Showcase',
  images = [
    { src: '/src/assets/images/preview_ecommerce_ceramics_1792316645917.jpg', caption: 'Atmospheric glaze firing' },
    { src: '/src/assets/images/preview_editorial_arch_1792316647413.jpg', caption: 'Pedestal installation' },
    { src: '/src/assets/images/hero_founder_studio_1792316645323.jpg', caption: 'Studio workbench' }
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
      <div className="max-w-6xl mx-auto space-y-8">
        <h2
          className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-fg-default)]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="rounded-[var(--radius-lg)] border overflow-hidden shadow-[var(--shadow-sm)] group"
              style={{
                borderColor: 'var(--color-border-default)',
                backgroundColor: 'var(--color-bg-surface)'
              }}
            >
              <div className="h-64 overflow-hidden">
                <img
                  src={img.src}
                  alt={img.caption}
                  width={600}
                  height={400}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-3 text-xs text-[var(--color-fg-muted)] font-[var(--font-body)]">
                {img.caption}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
