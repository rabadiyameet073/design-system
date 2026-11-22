import React from 'react';
import {
  Header,
  Hero,
  StatsRow,
  FeatureGrid,
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

export const SaasTemplate: React.FC<TemplateProps> = ({
  brandName = 'Apex Engine',
  headline,
  subtitle,
  badge = 'High-Velocity Cloud Infrastructure',
  heroImage = '/src/assets/images/preview_saas_metrics_1792316645998.jpg',
  components
}) => {
  const enabled = components?.enabledComponents;
  const isEnabled = (key: string) => !enabled || enabled.length === 0 || enabled.includes(key);

  return (
    <div className="w-full min-h-screen flex flex-col bg-[var(--color-bg-default)] text-[var(--color-fg-default)]">
      <Header brandName={brandName} actionLabel="Start Free Trial" />
      <main className="flex-1">
        {isEnabled('hero') && (
          <Hero
            badge={badge}
            title={headline || 'The mathematical runtime for modern engineering teams'}
            subtitle={subtitle || 'Deploy resilient design systems, distributed token pipelines, and real-time synchronization in single-digit milliseconds.'}
            primaryAction="Deploy in 60s"
            secondaryAction="Read Docs"
            imageUrl={heroImage}
          />
        )}
        <StatsRow />
        {(isEnabled('features') || isEnabled('featureGrid')) && (
          <FeatureGrid
            title="Built for Extreme Developer Ergonomics"
            subtitle="Eliminate friction across build steps, CI pipelines, and production release branches."
          />
        )}
        {(isEnabled('pricing') || isEnabled('pricingTable')) && <PricingTable />}
        {isEnabled('testimonials') && <Testimonials />}
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

