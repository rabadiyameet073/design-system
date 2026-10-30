import React from 'react';
import {
  Header,
  Hero,
  StatsRow,
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

export const FinanceTemplate: React.FC<TemplateProps> = ({
  brandName = 'Sovereign Capital',
  heroImage = '/src/assets/images/preview_saas_metrics_1792316645998.jpg'
}) => {
  return (
    <div className="w-full min-h-screen flex flex-col bg-[var(--color-bg-default)] text-[var(--color-fg-default)]">
      <Header brandName={brandName} actionLabel="Open Account" />
      <main className="flex-1">
        <Hero
          badge="Institutional Grade Treasury & Custody"
          title="Algorithmic liquidity and multi-jurisdiction asset protection"
          subtitle="Engineered for family offices, fintech protocols, and venture syndicates requiring mathematically verified security."
          primaryAction="Open Prime Account"
          secondaryAction="Security Audits"
          imageUrl={heroImage}
        />
        <StatsRow />
        <FeatureGrid
          title="Cryptographic Proof & Real-Time Settlement"
          subtitle="Audited smart contracts and deep liquidity pools operating 24/7/365."
        />
        <PricingTable title="Fee Structure & Custody Yield" subtitle="Transparent bps schedule with automated volume tiering." />
        <FAQ title="Regulatory Compliance & Treasury FAQ" />
        <ComponentsShowcase />
        <TypeSpecimen />
      </main>
      <Footer brandName={brandName} />
    </div>
  );
};

