import React from 'react';
import {
  Header,
  Hero,
  FeatureGrid,
  ProductGrid,
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

export const CommerceTemplate: React.FC<TemplateProps> = ({
  brandName = 'Maison Ceramics',
  heroImage = '/src/assets/images/preview_ecommerce_ceramics_1792316645917.jpg'
}) => {
  return (
    <div className="w-full min-h-screen flex flex-col bg-[var(--color-bg-default)] text-[var(--color-fg-default)]">
      <Header brandName={brandName} actionLabel="Shop Collection" />
      <main className="flex-1">
        <Hero
          badge="Handmade Studio Editions"
          title="Stoneware shaped with patience and natural mineral glazes"
          subtitle="Explore curated tableware, architectural vases, and one-of-a-kind artifacts fired in limited kilns."
          primaryAction="Shop Catalog"
          secondaryAction="Our Philosophy"
          imageUrl={heroImage}
        />
        <ProductGrid />
        <FeatureGrid
          title="Artisanal Integrity in Every Batch"
          subtitle="Zero mass-production shortcuts. Each object carries the organic signature of human craftsmanship."
        />
        <Testimonials />
        <FAQ />
        <ComponentsShowcase />
        <TypeSpecimen />
      </main>
      <Footer brandName={brandName} />
    </div>
  );
};

