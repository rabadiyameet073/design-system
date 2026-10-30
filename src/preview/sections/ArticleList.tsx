import React from 'react';
import { ArrowRight } from 'lucide-react';

export interface ArticleListProps {
  id?: string;
  title?: string;
  articles?: Array<{ title: string; date: string; category: string; readTime: string }>;
}

export const ArticleList: React.FC<ArticleListProps> = ({
  id = 'articles',
  title = 'Dispatches & Monograph Essays',
  articles = [
    {
      title: 'The Tacit Intelligence of Stoneware Glaze Formulations',
      date: 'October 28, 2026',
      category: 'Materiality',
      readTime: '6 min read'
    },
    {
      title: 'Perceptual Uniformity in Human Computer Interfaces',
      date: 'October 14, 2026',
      category: 'Design Systems',
      readTime: '9 min read'
    },
    {
      title: 'Architectural Silence: Negative Space in Modern Typographic Scales',
      date: 'September 30, 2026',
      category: 'Typography',
      readTime: '5 min read'
    }
  ]
}) => {
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
          className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-fg-default)]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {title}
        </h2>

        <div className="divide-y divide-[var(--color-border-default)]">
          {articles.map((art, idx) => (
            <div key={idx} className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group cursor-pointer">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono text-[var(--color-action-primary)]">
                  <span>{art.category}</span>
                  <span>•</span>
                  <span className="text-[var(--color-fg-muted)]">{art.date}</span>
                </div>
                <h3
                  className="text-lg font-semibold text-[var(--color-fg-default)] group-hover:text-[var(--color-action-primary)] transition-colors"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {art.title}
                </h3>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-fg-muted)] group-hover:text-[var(--color-fg-default)] transition-colors shrink-0">
                <span>{art.readTime}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

