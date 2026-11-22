import React from 'react';
import {
  Header,
  Hero,
  ArticleList,
  ArticleBody,
  FAQ,
  FeatureGrid,
  ComponentsShowcase,
  TypeSpecimen,
  Footer
} from '../sections';
import { TemplateProps } from './index';

export const PublishingTemplate: React.FC<TemplateProps> = ({
  brandName = 'The Spatial Monograph',
  headline,
  subtitle,
  badge = 'Quarterly Editorial & Critical Theory',
  heroImage = '/src/assets/images/preview_editorial_arch_1792316647413.jpg',
  components
}) => {
  const enabled = components?.enabledComponents;
  const isEnabled = (key: string) => !enabled || enabled.length === 0 || enabled.includes(key);

  return (
    <div className="w-full min-h-screen flex flex-col bg-[var(--color-bg-default)] text-[var(--color-fg-default)]">
      <Header brandName={brandName} actionLabel="Subscribe Weekly" />
      <main className="flex-1">
        {isEnabled('hero') && (
          <Hero
            badge={badge}
            title={headline || 'Essays on architecture, computation, and material aesthetics'}
            subtitle={subtitle || 'Long-form journalism exploring the convergence of spatial design, mathematical color science, and tactile software.'}
            primaryAction="Read Latest Issue"
            secondaryAction="Print Archives"
            imageUrl={heroImage}
          />
        )}
        {(isEnabled('articles') || isEnabled('articleList')) && <ArticleList />}
        {(isEnabled('article-body') || isEnabled('articleBody') || isEnabled('editorial')) && <ArticleBody />}
        {(isEnabled('features') || isEnabled('featureGrid')) && (
          <FeatureGrid
            title="Curatorial Pillars"
            subtitle="In-depth investigations into digital craftsmanship, material longevity, and open systems."
          />
        )}
        {isEnabled('faq') && <FAQ title="Editorial Submissions & Circulation FAQ" />}
        {(isEnabled('components') || isEnabled('componentsShowcase')) && <ComponentsShowcase />}
        <TypeSpecimen />
      </main>
      <Footer brandName={brandName} />
    </div>
  );
};
