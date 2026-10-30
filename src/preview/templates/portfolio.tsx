import React from 'react';
import {
  Header,
  Hero,
  ProjectGrid,
  Gallery,
  Testimonials,
  ComponentsShowcase,
  TypeSpecimen,
  Footer
} from '../sections';

export interface TemplateProps {
  brandName?: string;
  heroImage?: string;
}

export const PortfolioTemplate: React.FC<TemplateProps> = ({
  brandName = 'Julian Thorne',
  heroImage = '/src/assets/images/preview_editorial_arch_1792316647413.jpg'
}) => {
  return (
    <div className="w-full min-h-screen flex flex-col bg-[var(--color-bg-default)] text-[var(--color-fg-default)]">
      <Header brandName={brandName} actionLabel="Inquire Availability" />
      <main className="flex-1">
        <Hero
          badge="Design Director & Spatial Architect"
          title="Curating human interfaces through spatial silence and physical craft"
          subtitle="Specializing in design system architecture, luxury editorial aesthetics, and high-performance interactive experiences."
          primaryAction="View Selected Work"
          secondaryAction="About Studio"
          imageUrl={heroImage}
        />
        <ProjectGrid />
        <Gallery title="Process Archive & Spatial Models" />
        <Testimonials />
        <ComponentsShowcase />
        <TypeSpecimen />
      </main>
      <Footer brandName={brandName} />
    </div>
  );
};
