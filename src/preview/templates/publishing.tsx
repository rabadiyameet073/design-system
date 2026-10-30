import React from 'react';
import {
  Header,
  Hero,
  ArticleList,
  ArticleBody,
  FAQ,
  ComponentsShowcase,
  TypeSpecimen,
  Footer
} from '../sections';

export interface TemplateProps {
  brandName?: string;
  heroImage?: string;
}

export const PublishingTemplate: React.FC<TemplateProps> = ({
  brandName = 'The Spatial Monograph',
  heroImage = '/src/assets/images/preview_editorial_arch_1792316647413.jpg'
}) => {
  return (
    <div className="w-full min-h-screen flex flex-col bg-[var(--color-bg-default)] text-[var(--color-fg-default)]">
      <Header brandName={brandName} actionLabel="Subscribe Weekly" />
      <main className="flex-1">
        <Hero
          badge="Quarterly Editorial & Critical Theory"
          title="Essays on architecture, computation, and material aesthetics"
          subtitle="Long-form journalism exploring the convergence of spatial design, mathematical color science, and tactile software."
          primaryAction="Read Latest Issue"
          secondaryAction="Print Archives"
          imageUrl={heroImage}
        />
        <ArticleList />
        <ArticleBody />
        <FAQ title="Editorial Submissions & Circulation FAQ" />
        <ComponentsShowcase />
        <TypeSpecimen />
      </main>
      <Footer brandName={brandName} />
    </div>
  );
};

