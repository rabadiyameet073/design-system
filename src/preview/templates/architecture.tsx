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
import { TemplateProps } from './index';

export const ArchitectureTemplate: React.FC<TemplateProps> = ({
  brandName = 'Mies & Thorne Spatial',
  headline,
  subtitle,
  badge = 'Architectural Practice & Spatial Research',
  heroImage = '/src/assets/images/preview_editorial_arch_1792316647413.jpg',
  components
}) => {
  const enabled = components?.enabledComponents;
  const isEnabled = (key: string) => !enabled || enabled.length === 0 || enabled.includes(key);

  return (
    <div className="w-full min-h-screen flex flex-col bg-[var(--color-bg-default)] text-[var(--color-fg-default)]">
      <Header brandName={brandName} actionLabel="Commission Studio" />
      <main className="flex-1">
        {isEnabled('hero') && (
          <Hero
            badge={badge}
            title={headline || 'Structures formed by raw stone, timber, and calibrated sunlight'}
            subtitle={subtitle || 'We engineer private residences, cultural institutions, and public pavilions celebrating tectonic clarity.'}
            primaryAction="Monograph Index"
            secondaryAction="Studio Process"
            imageUrl={heroImage}
          />
        )}
        {(isEnabled('projects') || isEnabled('projectGrid')) && <ProjectGrid />}
        {isEnabled('gallery') && <Gallery title="Physical Material Studies & Site Castings" />}
        {isEnabled('testimonials') && <Testimonials />}
        {(isEnabled('components') || isEnabled('componentsShowcase')) && <ComponentsShowcase />}
        <TypeSpecimen />
      </main>
      <Footer brandName={brandName} />
    </div>
  );
};

