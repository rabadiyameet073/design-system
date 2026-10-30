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

export const ArchitectureTemplate: React.FC<TemplateProps> = ({
  brandName = 'Mies & Thorne Spatial',
  heroImage = '/src/assets/images/preview_editorial_arch_1792316647413.jpg'
}) => {
  return (
    <div className="w-full min-h-screen flex flex-col bg-[var(--color-bg-default)] text-[var(--color-fg-default)]">
      <Header brandName={brandName} actionLabel="Commission Studio" />
      <main className="flex-1">
        <Hero
          badge="Architectural Practice & Spatial Research"
          title="Structures formed by raw stone, timber, and calibrated sunlight"
          subtitle="We engineer private residences, cultural institutions, and public pavilions celebrating tectonic clarity."
          primaryAction="Monograph Index"
          secondaryAction="Studio Process"
          imageUrl={heroImage}
        />
        <ProjectGrid />
        <Gallery title="Physical Material Studies & Site Castings" />
        <Testimonials />
        <ComponentsShowcase />
        <TypeSpecimen />
      </main>
      <Footer brandName={brandName} />
    </div>
  );
};
