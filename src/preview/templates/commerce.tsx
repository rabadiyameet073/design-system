import React from 'react';
import {
  Header,
  Hero,
  FeatureGrid,
  ProductGrid,
  PricingTable,
  BookingWidget,
  CourseCards,
  Testimonials,
  FAQ,
  ComponentsShowcase,
  TypeSpecimen,
  Footer
} from '../sections';
import { TemplateProps } from './index';

export const CommerceTemplate: React.FC<TemplateProps> = ({
  brandName = 'Maison Ceramics',
  headline,
  subtitle,
  badge = 'Handmade Studio Editions',
  heroImage = '/src/assets/images/preview_ecommerce_ceramics_1792316645917.jpg',
  components
}) => {
  const enabled = components?.enabledComponents;
  const isEnabled = (key: string) => !enabled || enabled.length === 0 || enabled.includes(key);

  return (
    <div className="w-full min-h-screen flex flex-col bg-[var(--color-bg-default)] text-[var(--color-fg-default)]">
      <Header brandName={brandName} actionLabel="Shop Collection" />
      <main className="flex-1">
        {isEnabled('hero') && (
          <Hero
            badge={badge}
            title={headline || 'Stoneware shaped with patience and natural mineral glazes'}
            subtitle={subtitle || 'Explore curated tableware, architectural vases, and one-of-a-kind artifacts fired in limited kilns.'}
            primaryAction="Shop Catalog"
            secondaryAction="Our Philosophy"
            imageUrl={heroImage}
          />
        )}
        {(isEnabled('products') || isEnabled('productGrid')) && <ProductGrid />}
        {(isEnabled('features') || isEnabled('featureGrid')) && (
          <FeatureGrid
            title="Artisanal Integrity in Every Batch"
            subtitle="Zero mass-production shortcuts. Each object carries the organic signature of human craftsmanship."
          />
        )}
        {isEnabled('testimonials') && <Testimonials />}
        {(isEnabled('pricing') || isEnabled('pricingTable')) && <PricingTable />}
        {isEnabled('faq') && <FAQ />}
        {(isEnabled('booking') || isEnabled('bookingWidget')) && <BookingWidget />}
        {(isEnabled('courses') || isEnabled('courseCards')) && <CourseCards />}
        {(isEnabled('components') || isEnabled('componentsShowcase')) && <ComponentsShowcase />}
        <TypeSpecimen />
      </main>
      <Footer brandName={brandName} />
    </div>
  );
};

