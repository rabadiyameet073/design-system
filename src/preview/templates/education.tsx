import React from 'react';
import {
  Header,
  Hero,
  CourseCards,
  FeatureGrid,
  PricingTable,
  FAQ,
  ComponentsShowcase,
  TypeSpecimen,
  Footer
} from '../sections';

export interface TemplateProps {
  brandName?: string;
  heroImage?: string;
}

export const EducationTemplate: React.FC<TemplateProps> = ({
  brandName = 'Atelier Academy',
  heroImage = '/src/assets/images/preview_saas_metrics_1792316645998.jpg'
}) => {
  return (
    <div className="w-full min-h-screen flex flex-col bg-[var(--color-bg-default)] text-[var(--color-fg-default)]">
      <Header brandName={brandName} actionLabel="Explore Curriculum" />
      <main className="flex-1">
        <Hero
          badge="Cohort-Based Design Engineering"
          title="Master the art of design systems, spatial WebGL, and token pipelines"
          subtitle="Taught by principal designers and engineers from top creative studios. Intensive 6-week experiential learning."
          primaryAction="View Spring Cohort"
          secondaryAction="Download Syllabus"
          imageUrl={heroImage}
        />
        <CourseCards />
        <FeatureGrid
          title="Pedagogical Standards Designed for Mastery"
          subtitle="Real-world studio briefs, 1-on-1 code reviews, and production-ready portfolio deliverables."
        />
        <PricingTable title="Tuition & Fellowship Grants" subtitle="Transparent enrollment investment with flexible monthly installments." />
        <FAQ />
        <ComponentsShowcase />
        <TypeSpecimen />
      </main>
      <Footer brandName={brandName} />
    </div>
  );
};

