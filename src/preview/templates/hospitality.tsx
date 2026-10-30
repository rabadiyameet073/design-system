import React from 'react';
import {
  Header,
  Hero,
  BookingWidget,
  Gallery,
  Testimonials,
  FAQ,
  ComponentsShowcase,
  TypeSpecimen,
  Footer
} from '../sections';

export interface TemplateProps {
  brandName?: string;
  heroImage?: string;
}

export const HospitalityTemplate: React.FC<TemplateProps> = ({
  brandName = 'Villa Solarium',
  heroImage = '/src/assets/images/hero_founder_studio_1792316645323.jpg'
}) => {
  return (
    <div className="w-full min-h-screen flex flex-col bg-[var(--color-bg-default)] text-[var(--color-fg-default)]">
      <Header brandName={brandName} actionLabel="Reserve Table / Suite" />
      <main className="flex-1">
        <Hero
          badge="Bespoke Coastal Retreat"
          title="Sanctuary of natural stone, Mediterranean light, and culinary intimacy"
          subtitle="Immerse yourself in organic architecture, seasonal tasting menus, and tranquil panoramic sea terraces."
          primaryAction="Reserve Residency"
          secondaryAction="Explore Menus"
          imageUrl={heroImage}
        />
        <BookingWidget />
        <Gallery title="Atmospheric Spaces & Private Terraces" />
        <Testimonials />
        <FAQ title="Residency & Reservation FAQ" />
        <ComponentsShowcase />
        <TypeSpecimen />
      </main>
      <Footer brandName={brandName} />
    </div>
  );
};

