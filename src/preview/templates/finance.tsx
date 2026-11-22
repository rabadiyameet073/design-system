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
import { TemplateProps } from './index';

export const FinanceTemplate: React.FC<TemplateProps> = ({
  brandName = 'Sovereign Capital',
  headline,
  subtitle,
  badge = 'Institutional Grade Treasury & Custody',
  heroImage = '/src/assets/images/preview_saas_metrics_1792316645998.jpg',
  components
}) => {
  const enabled = components?.enabledComponents;
  const isEnabled = (key: string) => !enabled || enabled.length === 0 || enabled.includes(key);

  return (
    <div className="w-full min-h-screen flex flex-col bg-[var(--color-bg-default)] text-[var(--color-fg-default)]">
      <Header brandName={brandName} actionLabel="Open Account" />
      <main className="flex-1">
        {isEnabled('hero') && (
          <Hero
            badge={badge}
            title={headline || 'Algorithmic liquidity and multi-jurisdiction asset protection'}
            subtitle={subtitle || 'Engineered for family offices, fintech protocols, and venture syndicates requiring mathematically verified security.'}
            primaryAction="Open Prime Account"
            secondaryAction="Security Audits"
            imageUrl={heroImage}
          />
        )}
        <StatsRow />
        {(isEnabled('features') || isEnabled('featureGrid')) && (
          <FeatureGrid
            title="Cryptographic Proof & Real-Time Settlement"
            subtitle="Audited smart contracts and deep liquidity pools operating 24/7/365."
          />
        )}
        {(isEnabled('pricing') || isEnabled('pricingTable')) && (
          <PricingTable title="Fee Structure & Custody Yield" subtitle="Transparent bps schedule with automated volume tiering." />
        )}
        {isEnabled('testimonials') && <Testimonials />}
        {isEnabled('faq') && <FAQ title="Regulatory Compliance & Treasury FAQ" />}
        {(isEnabled('components') || isEnabled('componentsShowcase')) && <ComponentsShowcase />}
        <TypeSpecimen />
      </main>
      <Footer brandName={brandName} />
    </div>
  );
};

