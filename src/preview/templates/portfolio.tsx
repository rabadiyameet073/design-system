import React from 'react';
import {
  Header,
  Hero,
  ProjectGrid,
  Gallery,
  Testimonials,
  FeatureGrid,
  ComponentsShowcase,
  TypeSpecimen,
  Footer
} from '../sections';
import { TemplateProps } from './index';

export const PortfolioTemplate: React.FC<TemplateProps> = ({
  brandName = 'Julian Thorne',
  headline,
  subtitle,
  badge = 'Design Director & Spatial Architect',
  heroImage = '/src/assets/images/preview_editorial_arch_1792316647413.jpg',
  components
}) => {
  const enabled = components?.enabledComponents;
  const isEnabled = (key: string) => !enabled || enabled.length === 0 || enabled.includes(key);

  return (
    <div className="w-full min-h-screen flex flex-col bg-[var(--color-bg-default)] text-[var(--color-fg-default)]">
      <Header brandName={brandName} actionLabel="Inquire Availability" />
      <main className="flex-1">
        {isEnabled('hero') && (
          <Hero
            badge={badge}
            title={headline || 'Curating human interfaces through spatial silence and physical craft'}
            subtitle={subtitle || 'Specializing in design system architecture, luxury editorial aesthetics, and high-performance interactive experiences.'}
            primaryAction="View Selected Work"
            secondaryAction="About Studio"
            imageUrl={heroImage}
          />
        )}
        {(isEnabled('projects') || isEnabled('projectGrid')) && <ProjectGrid />}
        {(isEnabled('gallery') || isEnabled('galleryGrid')) && <Gallery title="Process Archive & Spatial Models" />}
        {(isEnabled('features') || isEnabled('featureGrid')) && (
          <FeatureGrid
            title="Design Principles & Methodologies"
            subtitle="Bridging mathematical color theory, fluid spatial choreography, and production token pipelines."
          />
        )}
        {isEnabled('testimonials') && <Testimonials />}
        {(isEnabled('components') || isEnabled('componentsShowcase')) && <ComponentsShowcase />}
        <TypeSpecimen />
      </main>
      <Footer brandName={brandName} />
    </div>
  );
};
