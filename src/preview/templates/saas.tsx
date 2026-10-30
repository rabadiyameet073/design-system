import React from 'react';
import {
  Header,
  Hero,
  StatsRow,
  FeatureGrid,
  PricingTable,
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

export const SaasTemplate: React.FC<TemplateProps> = ({
  brandName = 'Apex Engine',
  heroImage = '/src/assets/images/preview_saas_metrics_1792316645998.jpg'
}) => {
  return (
    <div className="w-full min-h-screen flex flex-col bg-[var(--color-bg-default)] text-[var(--color-fg-default)]">
      <Header brandName={brandName} actionLabel="Start Free Trial" />
      <main className="flex-1">
        <Hero
          badge="High-Velocity Cloud Infrastructure"
          title="The mathematical runtime for modern engineering teams"
          subtitle="Deploy resilient design systems, distributed token pipelines, and real-time synchronization in single-digit milliseconds."
          primaryAction="Deploy in 60s"
          secondaryAction="Read Docs"
          imageUrl={heroImage}
        />
        <StatsRow />
        <FeatureGrid
          title="Built for Extreme Developer Ergonomics"
          subtitle="Eliminate friction across build steps, CI pipelines, and production release branches."
        />
        <PricingTable />
        <Testimonials />
        <FAQ />
        <ComponentsShowcase />
        <TypeSpecimen />
      </main>
      <Footer brandName={brandName} />
    </div>
  );
};

