import React from 'react';

export interface ProjectGridProps {
  id?: string;
  title?: string;
}

export const ProjectGrid: React.FC<ProjectGridProps> = ({
  id = 'projects',
  title = 'Selected Spatial Commissions'
}) => {
  const projects = [
    {
      name: 'The Pavilion at Oakhaven',
      location: 'Zurich, Switzerland',
      year: '2026',
      image: '/src/assets/images/preview_editorial_arch_1792316647413.jpg'
    },
    {
      name: 'Resonator Sound Studio',
      location: 'Kyoto, Japan',
      year: '2025',
      image: '/src/assets/images/preview_ecommerce_ceramics_1792316645917.jpg'
    }
  ];

  return (
    <section
      id={id}
      className="w-full py-16 px-6 sm:px-12 border-t"
      style={{
        backgroundColor: 'var(--color-bg-default)',
        borderColor: 'var(--color-border-default)'
      }}
    >
      <div className="max-w-6xl mx-auto space-y-10">
        <h2
          className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-fg-default)]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((p, idx) => (
            <div
              key={idx}
              className="rounded-[var(--radius-xl)] border overflow-hidden shadow-[var(--shadow-md)] group"
              style={{
                backgroundColor: 'var(--color-bg-surface)',
                borderColor: 'var(--color-border-default)'
              }}
            >
              <div className="h-72 overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  width={800}
                  height={600}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6 flex items-center justify-between">
                <div>
                  <h3
                    className="text-lg font-semibold text-[var(--color-fg-default)]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {p.name}
                  </h3>
                  <div className="text-xs text-[var(--color-fg-muted)] font-[var(--font-body)]">
                    {p.location}
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-[var(--color-action-primary)]">
                  {p.year}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
