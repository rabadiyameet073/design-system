import React from 'react';
import {
  Header,
  Hero,
  CourseCards,
  FeatureGrid,
  PricingTable,
  Testimonials,
  FAQ,
  ComponentsShowcase,
  TypeSpecimen,
  Footer
} from '../sections';
import { TemplateProps } from './index';

export const EducationTemplate: React.FC<TemplateProps> = ({
  brandName = 'Atelier Academy',
  headline,
  subtitle,
  badge = 'Cohort-Based Design Engineering',
  heroImage = '/src/assets/images/preview_saas_metrics_1792316645998.jpg',
  components
}) => {
  const enabled = components?.enabledComponents;
  const isEnabled = (key: string) => !enabled || enabled.length === 0 || enabled.includes(key);

  return (
    <div className="w-full min-h-screen flex flex-col bg-[var(--color-bg-default)] text-[var(--color-fg-default)]">
      <Header brandName={brandName} actionLabel="Explore Curriculum" />
      <main className="flex-1">
        {isEnabled('hero') && (
          <Hero
            badge={badge}
            title={headline || 'Master the art of design systems, spatial WebGL, and token pipelines'}
            subtitle={subtitle || 'Taught by principal designers and engineers from top creative studios. Intensive 6-week experiential learning.'}
            primaryAction="View Spring Cohort"
            secondaryAction="Download Syllabus"
            imageUrl={heroImage}
          />
        )}
        {(isEnabled('courses') || isEnabled('courseCards')) && <CourseCards />}
        {(isEnabled('features') || isEnabled('featureGrid')) && (
          <FeatureGrid
            title="Pedagogical Standards Designed for Mastery"
            subtitle="Real-world studio briefs, 1-on-1 code reviews, and production-ready portfolio deliverables."
          />
        )}
        {(isEnabled('pricing') || isEnabled('pricingTable')) && (
          <PricingTable title="Tuition & Fellowship Grants" subtitle="Transparent enrollment investment with flexible monthly installments." />
        )}
        {isEnabled('testimonials') && <Testimonials />}
        {isEnabled('faq') && <FAQ />}
        {(isEnabled('components') || isEnabled('componentsShowcase')) && <ComponentsShowcase />}
        <TypeSpecimen />
      </main>
      <Footer brandName={brandName} />
    </div>
  );
};

