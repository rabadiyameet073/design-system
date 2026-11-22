import React from 'react';
import {
  Header,
  Hero,
  BookingWidget,
  Gallery,
  Testimonials,
  FAQ,
  FeatureGrid,
  ComponentsShowcase,
  TypeSpecimen,
  Footer
} from '../sections';
import { TemplateProps } from './index';

export const HospitalityTemplate: React.FC<TemplateProps> = ({
  brandName = 'Villa Solarium',
  headline,
  subtitle,
  badge = 'Bespoke Coastal Retreat',
  heroImage = '/src/assets/images/hero_founder_studio_1792316645323.jpg',
  components
}) => {
  const enabled = components?.enabledComponents;
  const isEnabled = (key: string) => !enabled || enabled.length === 0 || enabled.includes(key);

  return (
    <div className="w-full min-h-screen flex flex-col bg-[var(--color-bg-default)] text-[var(--color-fg-default)]">
      <Header brandName={brandName} actionLabel="Reserve Table / Suite" />
      <main className="flex-1">
        {isEnabled('hero') && (
          <Hero
            badge={badge}
            title={headline || 'Sanctuary of natural stone, Mediterranean light, and culinary intimacy'}
            subtitle={subtitle || 'Immerse yourself in organic architecture, seasonal tasting menus, and tranquil panoramic sea terraces.'}
            primaryAction="Reserve Residency"
            secondaryAction="Explore Menus"
            imageUrl={heroImage}
          />
        )}
        {(isEnabled('booking') || isEnabled('bookingWidget')) && <BookingWidget />}
        {(isEnabled('gallery') || isEnabled('galleryGrid')) && <Gallery title="Atmospheric Spaces & Private Terraces" />}
        {(isEnabled('features') || isEnabled('featureGrid')) && (
          <FeatureGrid
            title="Curated Sensorial Moments"
            subtitle="Every detail—from hand-loomed linens to somatic soundscapes—is designed for restoration."
          />
        )}
        {isEnabled('testimonials') && <Testimonials />}
        {isEnabled('faq') && <FAQ title="Residency & Reservation FAQ" />}
        {(isEnabled('components') || isEnabled('componentsShowcase')) && <ComponentsShowcase />}
        <TypeSpecimen />
      </main>
      <Footer brandName={brandName} />
    </div>
  );
};
