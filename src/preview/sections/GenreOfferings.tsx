import React from 'react';
import { ResolvedGenreContent } from '../genres/genreContent';

interface GenreOfferingsProps {
  content?: ResolvedGenreContent;
}

/**
 * Renders the genre-resolved offering cards. Templates keep their own bespoke
 * flagship sections; this block makes the selected genre's product data visible
 * in every template whenever live-preview content is supplied.
 */
export const GenreOfferings: React.FC<GenreOfferingsProps> = ({ content }) => {
  if (!content || !content.items || content.items.length === 0) return null;

  return (
    <section
      id="genre-offerings"
      className="w-full py-16 px-6 sm:px-12 border-t border-[var(--color-border-default)] bg-[var(--color-bg-surface)]"
    >
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="space-y-2 text-left">
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-[var(--color-action-primary)]">
            {content.label}
          </span>
          <h2
            className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-fg-default)]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {content.sectionTitle}
          </h2>
          <p className="text-sm text-[var(--color-fg-muted)] max-w-2xl">{content.sectionSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {content.items.map(item => (
            <article
              key={item.id}
              className="overflow-hidden flex flex-col border border-[var(--color-border-default)] bg-[var(--color-bg-default)] transition-transform duration-300 hover:-translate-y-1"
              style={{ borderRadius: 'var(--radius-card, var(--radius-lg, 16px))' }}
            >
              <div className="aspect-square w-full overflow-hidden bg-[var(--color-bg-surface)]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  style={{ filter: 'var(--image-filter, none)' }}
                />
              </div>
              <div className="p-5 flex-1 flex flex-col gap-3 text-left">
                {item.badge && (
                  <span className="self-start px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[var(--color-bg-surface)] text-[var(--color-action-primary)]">
                    {item.badge}
                  </span>
                )}
                <h3 className="text-sm font-bold text-[var(--color-fg-default)]">{item.title}</h3>
                <p className="text-xs text-[var(--color-fg-muted)] leading-relaxed">{item.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-auto pt-2 border-t border-[var(--color-border-default)]">
                  {item.specs.slice(0, 3).map(spec => (
                    <span
                      key={spec}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-[var(--color-bg-surface)] text-[var(--color-fg-muted)]"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GenreOfferings;
