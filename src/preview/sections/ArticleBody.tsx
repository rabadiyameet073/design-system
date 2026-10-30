import React from 'react';

export interface ArticleBodyProps {
  id?: string;
}

export const ArticleBody: React.FC<ArticleBodyProps> = ({ id = 'article-body' }) => {
  return (
    <article
      id={id}
      className="w-full py-16 px-6 sm:px-12 border-t"
      style={{
        backgroundColor: 'var(--color-bg-default)',
        borderColor: 'var(--color-border-default)'
      }}
    >
      <div className="max-w-2xl mx-auto space-y-8" style={{ maxWidth: '65ch' }}>
        {/* Article Header */}
        <div className="space-y-4">
          <div className="text-xs uppercase font-mono tracking-widest text-[var(--color-action-primary)] font-bold">
            Essay 04 · Typographic Stress Test
          </div>
          <h1
            className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-fg-default)] leading-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            The Weight of Spatial Geometry: A Study in Materiality
          </h1>
          <div className="text-xs text-[var(--color-fg-muted)] font-mono border-b border-[var(--color-border-default)] pb-4">
            Published by Julian Thorne • 8 min read
          </div>
        </div>

        {/* Lead Paragraph */}
        <p
          className="text-lg leading-relaxed text-[var(--color-fg-default)] font-[var(--font-body)]"
        >
          <span
            className="float-left text-5xl font-bold pr-3 leading-none text-[var(--color-action-primary)]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            S
          </span>
          patial coherence is rarely accidental. When an architect proportions a threshold, the physical compression of the entryway dictates the psychological emotional arrival into the sanctuary. Software interfaces operate under identical laws of visceral momentum.
        </p>

        {/* Section Heading */}
        <h2
          className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--color-fg-default)] pt-4"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          1. The Lightness Ramp as Emotional Grammar
        </h2>

        <p className="leading-relaxed text-[var(--color-fg-default)] font-[var(--font-body)] opacity-90">
          Digital systems frequently rely on mechanical grey palettes that disregard human perceptual psychology. By calculating color lightness curves in OKLCH rather than antiquated sRGB hex codes, we retain consistent chroma and contrast across every tone.
        </p>

        {/* Pull Quote */}
        <blockquote
          className="p-6 my-6 border-l-4 rounded-r-[var(--radius-md)] italic text-base sm:text-lg"
          style={{
            borderColor: 'var(--color-action-primary)',
            backgroundColor: 'var(--color-bg-surface)',
            color: 'var(--color-fg-default)',
            fontFamily: 'var(--font-heading)'
          }}
        >
          "A design system is not a library of static UI widgets; it is the mathematical philosophy of your organization made tangible in code."
        </blockquote>

        <p className="leading-relaxed text-[var(--color-fg-default)] font-[var(--font-body)] opacity-90">
          When this philosophy is unified from primitive tokens to semantic components, engineering velocity accelerates exponentially without compromising aesthetic integrity.
        </p>
      </div>
    </article>
  );
};

