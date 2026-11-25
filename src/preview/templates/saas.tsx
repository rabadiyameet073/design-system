import React, { useState } from 'react';
import { TemplateProps } from './index';
import { contentPascal, contentSlug } from '../genres/genreContent';
import {
  ComponentsShowcase,
  TypeSpecimen,
  GenreOfferings
} from '../sections';
import {
  Terminal,
  Copy,
  Check,
  Sparkles,
  Shield,
  Cpu,
  Activity,
  Zap,
  ArrowRight,
  Play,
  RotateCcw,
  Sliders,
  Database,
  Code2,
  TrendingUp,
  BarChart3,
  Server,
  Lock,
  Globe,
  Radio,
  Layers,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  ExternalLink,
  Laptop,
  Flame,
  FileCode,
  Gauge
} from 'lucide-react';

export const SaasTemplate: React.FC<TemplateProps> = ({
  content,
  brandName: brandNameProp,
  headline: headlineProp,
  subtitle: subtitleProp,
  badge: badgeProp,
  heroImage: heroImageProp,
  genreId = '',
  components,
  buttonStyle
}) => {
  // Genre content drives the visible brand/copy; flagship defaults stay intact
  // when the template is rendered standalone (no content prop).
  const brandName = content?.brandName || brandNameProp || 'APEX Systems Engine';
  const headline = headlineProp || content?.headline;
  const subtitle = subtitleProp || content?.subtitle;
  const badge = content?.badge || badgeProp || 'High-Velocity Distributed Token Runtime';
  const heroImage = content?.heroImage || heroImageProp;
  const enginePkg = content ? `@${contentSlug(content.brandName)}/engine` : '@apex/engine';
  const engineClass = content ? `${contentPascal(content.brandName)}Compiler` : 'ApexCompiler';
  const runtimeKey = content ? `${contentSlug(content.brandName).toUpperCase()}_RUNTIME_KEY` : 'APEX_RUNTIME_KEY';
  const projectId = content ? contentSlug(content.brandName).replace(/-/g, '_') : 'apex_design_system';
  const systemName = content ? `${content.brandName} System` : 'Apex Precision System';
  const clientName = content ? contentSlug(content.brandName).replace(/-/g, '') : 'apex';
  const cliHint = content ? `npx ${enginePkg} init` : 'npx @apex/engine init';
  const initPkg = content ? `@${contentSlug(content.brandName)}/init` : '@apex/init';
  const cliPkg = content ? `@${contentSlug(content.brandName)}/cli` : '@apex/cli';
  const apiHost = content ? `api.${contentSlug(content.brandName)}.io` : 'api.apexengine.io';
  const pyModule = content ? contentSlug(content.brandName).replace(/-/g, '_') : 'apex_engine';
  const goModule = content ? contentSlug(content.brandName) : 'apex-engine';
  const apiKey = content ? `${contentSlug(content.brandName).replace(/-/g, '_')}_live_key` : 'apex_live_8471b02';
  const importLine = content
    ? `import { ${engineClass}, defineTokens } from '${enginePkg}';`
    : `import { ApexCompiler, defineTokens } from '@apex/engine';`;
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [isAiRunning, setIsAiRunning] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('Compile OKLCH harmonic ramp with WCAG 2.2 AAA contrast and fluid typography clamps');
  const [aiOutput, setAiOutput] = useState<string | null>(null);
  const [dashboardTimeframe, setDashboardTimeframe] = useState<'24h' | '7d' | '30d'>('7d');
  const [activeCodeTab, setActiveCodeTab] = useState<'typescript' | 'python' | 'go' | 'curl'>('typescript');
  const [isAnnualPricing, setIsAnnualPricing] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const enabled = components?.enabledComponents;
  const isSectionEnabled = (section: string) => {
    if (section === 'hero' || section === 'announcement' || section === 'components' || section === 'type') {
      return true;
    }
    if (!enabled || enabled.length === 0) return true;

    const moduleMapping: Record<string, string[]> = {
      partners: ['metrics-row', 'partners', 'trust', 'stats'],
      code: ['product-card', 'code', 'playground', 'interactive'],
      stats: ['metrics-row', 'stats', 'kpi', 'telemetry'],
      features: ['product-card', 'features', 'spec-table'],
      ai: ['product-card', 'ai', 'inference'],
      security: ['metrics-row', 'security', 'compliance'],
      pricing: ['pricing-matrix', 'pricing', 'pricingTable', 'pricing-tier'],
      testimonials: ['reviews-grid', 'testimonials', 'reviews'],
      faq: ['curriculum-accordion', 'faq', 'accordion'],
      cta: ['newsletter', 'cta', 'leadCapture']
    };

    const aliases = moduleMapping[section];
    if (!aliases) return true;
    return aliases.some(alias => enabled.includes(alias));
  };
  const isEnabled = isSectionEnabled;

  const btnVariant = buttonStyle || components?.buttonStyle || 'solid';
  const getPrimaryBtnStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      borderRadius: 'var(--radius-button, var(--radius-md, 8px))',
      fontFamily: 'var(--font-ui, var(--font-body, sans-serif))',
      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
    };
    if (btnVariant === 'outline') {
      return {
        ...base,
        backgroundColor: 'transparent',
        color: 'var(--color-action-primary)',
        border: '2px solid var(--color-action-primary)'
      };
    }
    if (btnVariant === 'subtle') {
      return {
        ...base,
        backgroundColor: 'var(--color-bg-surface)',
        color: 'var(--color-action-primary)',
        border: '1px solid var(--color-border-default)'
      };
    }
    if (btnVariant === 'minimal') {
      return {
        ...base,
        backgroundColor: 'transparent',
        color: 'var(--color-action-primary)',
        border: 'none',
        boxShadow: 'none'
      };
    }
    return {
      ...base,
      backgroundColor: 'var(--color-action-primary)',
      color: 'var(--color-action-primary-fg)',
      border: 'none'
    };
  };

  const cardVariant = components?.cardStyle || 'bordered';
  const getCardStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      borderRadius: 'var(--radius-card, var(--radius-lg, 16px))',
      backgroundColor: 'var(--color-bg-surface)',
      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
    };
    if (cardVariant === 'elevated') {
      return { ...base, border: '1px solid var(--color-border-default)', boxShadow: 'var(--shadow-md, 0 10px 15px -3px rgba(0,0,0,0.1))' };
    }
    if (cardVariant === 'flat-tint') {
      return { ...base, border: 'none', boxShadow: 'none' };
    }
    return { ...base, border: '1px solid var(--color-border-default)', boxShadow: 'none' };
  };

  const getImageStyle = (): React.CSSProperties => ({
    filter: 'var(--image-filter, none)',
    borderRadius: 'var(--radius-card, var(--radius-lg, 16px))',
    transition: 'filter 0.2s ease'
  });

  const handleCopyCli = (text = content ? `npx ${enginePkg} init --template enterprise-tokens` : 'npx @apex/engine init --template enterprise-tokens') => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const handleRunAiInference = () => {
    setIsAiRunning(true);
    setAiOutput(null);
    setTimeout(() => {
      setIsAiRunning(false);
      setAiOutput(
`// Verified Design Token Engine Output (Latency: 84ms)
${content ? `import { defineDesignSystem } from '${enginePkg}';` : "import { defineDesignSystem } from '@apex/engine';"}

export const studioSystem = defineDesignSystem({
  name: systemName,
  colorRamp: {
    space: 'OKLCH',
    brand: 'oklch(0.58 0.22 260)',
    accent: 'oklch(0.65 0.19 145)',
    contrastStrategy: 'WCAG-2.2-AAA'
  },
  typography: {
    baseSizePx: 16,
    scaleRatio: 1.25, // Major Third
    fluidRange: { minVw: 360, maxVw: 1280 }
  },
  motion: {
    spring: { stiffness: 280, damping: 22, mass: 1 }
  },
  audit: { passRate: '100% (210/210 checks pass)' }
});`
      );
    }, 600);
  };

  const CLIENT_LOGOS = [
    'VORTEX CLOUD',
    'SYNAPSE AI',
    'HYPERION LABS',
    'MONOLITH OS',
    'SPECTRA DATA',
    'NEXUS TELEMETRY'
  ];

  const PRICING_TIERS = [
    {
      name: 'Developer Sandbox',
      price: '$0',
      period: 'forever free',
      desc: 'Ideal for independent developers, open-source maintainers, and side projects.',
      features: [
        'Up to 3 Active Token Graphs',
        'Tailwind v4 & CSS Variables Export',
        'Real-time WCAG 2.2 AA Contrast Engine',
        '100,000 Edge API Invocations/mo',
        'Community Discord Support'
      ],
      cta: 'Start Free Sandbox',
      highlighted: false
    },
    {
      name: 'Engineering Team Pro',
      price: isAnnualPricing ? '$29' : '$36',
      period: isAnnualPricing ? 'per seat / mo, billed annually' : 'per seat / mo, billed monthly',
      desc: 'Engineered for high-velocity software teams requiring multi-target compilation.',
      features: [
        'Unlimited Design Token Pipelines',
        'All 10 Production Code Exporters',
        'Automated Pull Request CI Validation',
        'Figma Variables & Tokens Studio Sync',
        '10,000,000 Edge API Invocations/mo',
        'Sub-10ms Global CDN Propagation',
        'Dedicated Priority Slack Channel'
      ],
      cta: 'Deploy Team Pro',
      highlighted: true
    },
    {
      name: 'Enterprise Scale',
      price: isAnnualPricing ? '$99' : '$120',
      period: isAnnualPricing ? 'per seat / mo, billed annually' : 'per seat / mo, billed monthly',
      desc: 'Built for multi-brand organizations demanding strict governance and custom SLAs.',
      features: [
        'Everything in Team Pro',
        'Custom SSO & SAML 2.0 Integration',
        'Multi-Region Private Cloud Tenant',
        'Guaranteed 99.999% Execution Uptime SLA',
        'Dedicated Enterprise Solution Architect',
        'SOC 2 Type II & ISO 27001 Audit Reports',
        'Custom Legal Terms & Invoicing'
      ],
      cta: 'Contact Architecture Team',
      highlighted: false
    }
  ];

  const FAQS = [
    {
      q: 'How does the compiler eliminate visual drift across frontend frameworks?',
      a: 'The engine compiles a single mathematical DesignTokens schema into framework-native targets (Tailwind CSS 4 inline @theme rules, CSS custom properties, W3C DTCG tokens.json, and TypeScript constants). When tokens mutate, the change cascades through all targets deterministically.'
    },
    {
      q: 'Does the real-time contrast engine evaluate light and dark modes separately?',
      a: 'Yes. Color ramps are computed using perceptual OKLCH lightness curves rather than sRGB hex inversion. The engine verifies both WCAG 2.2 AA (4.5:1 / 3:1) and APCA lightness contrast across light and dark semantic palettes independently.'
    },
    {
      q: 'Can we integrate token compilation into our automated GitHub Actions CI/CD?',
      a: content
        ? `Absolutely. The ${cliPkg} can be executed as a pre-commit hook or CI check to fail builds if pull requests introduce unapproved colors, break contrast thresholds, or alter type scale geometry without architectural review.`
        : 'Absolutely. The @apex/cli can be executed as a pre-commit hook or CI check to fail builds if pull requests introduce unapproved colors, break contrast thresholds, or alter type scale geometry without architectural review.'
    },
    {
      q: 'What is the latency penalty of the streaming edge distribution network?',
      a: 'Zero client-side runtime overhead. Token files compile at build time into static CSS and JSON artifacts distributed across 42 global edge points-of-presence with a p99 response latency of 1.18 milliseconds.'
    }
  ];

  return (
    <div className="w-full min-h-screen flex flex-col bg-[var(--color-bg-default)] text-[var(--color-fg-default)] selection:bg-[var(--color-action-primary)] selection:text-[var(--color-action-primary-fg)] font-sans antialiased">
      {/* 1. Real-Time Release Announcement Banner */}
      {isEnabled('announcement') && (
        <aside aria-label="Announcement" className="w-full py-2.5 px-4 bg-[var(--color-action-primary)] text-[var(--color-action-primary-fg)] text-xs text-center font-medium tracking-wide flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold">Next-Gen Runtime Live:</span>
          <span>Zero-latency multi-region token synchronization across 42 global edge clusters</span>
          <span className="hidden sm:inline">· P99 Latency 1.18ms</span>
        </aside>
      )}

      {/* 2. Sleek Developer Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[var(--color-bg-default)]/95 border-b border-[var(--color-border-default)] transition-colors">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-18 flex items-center justify-between gap-6">
          {/* Logo & Platform Identifier */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-action-primary)] text-[var(--color-action-primary-fg)] flex items-center justify-center font-mono font-black text-sm shadow-sm">
              <Cpu className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span
                className="text-base sm:text-lg font-black tracking-tight text-[var(--color-fg-default)] block leading-none"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {brandName}
              </span>
              <span className="text-[10px] font-mono tracking-widest text-[var(--color-fg-muted)] uppercase">
                Distributed Token Runtime
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold tracking-wide text-[var(--color-fg-muted)]">
            <a href="#code" className="hover:text-[var(--color-fg-default)] transition-colors">Architecture</a>
            <a href="#telemetry" className="hover:text-[var(--color-fg-default)] transition-colors">Telemetry</a>
            <a href="#features" className="hover:text-[var(--color-fg-default)] transition-colors">Capabilities</a>
            <a href="#pricing" className="hover:text-[var(--color-fg-default)] transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-[var(--color-fg-default)] transition-colors">Developer FAQ</a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleCopyCli()}
              className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] text-xs font-mono text-[var(--color-fg-muted)] hover:text-[var(--color-fg-default)] transition-colors cursor-pointer"
            >
              <span>$ {content ? `npx ${initPkg}` : 'npx @apex/init'}</span>
              {copiedCmd ? <Check className="w-3.5 h-3.5 text-[var(--color-status-success)]" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            <a
              href="#pricing"
              className="px-5 py-2.5 text-xs font-bold tracking-wide transition-all shadow-[var(--shadow-sm)] hover:opacity-90 cursor-pointer flex items-center gap-2"
              style={getPrimaryBtnStyle()}
            >
              <span>Deploy in 60s</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* 3. High-Velocity Developer Hero Section */}
        {isEnabled('hero') && (
          <section className="relative w-full py-16 sm:py-24 px-6 sm:px-12 border-b border-[var(--color-border-default)] overflow-hidden">
            <div className="max-w-6xl mx-auto space-y-10 text-center">
              {/* Kicker Pill */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] text-[var(--color-action-primary)] shadow-sm mx-auto">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{badge}</span>
              </div>

              {/* Main Headline */}
              <h1
                className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[var(--color-fg-default)] max-w-4xl mx-auto leading-[1.08]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {headline || 'The Autonomous Mathematical Runtime for Modern Engineering Teams.'}
              </h1>

              {/* Subtitle */}
              <p
                className="text-base sm:text-xl text-[var(--color-fg-muted)] max-w-2xl mx-auto leading-relaxed"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {subtitle ||
                  'Deploy resilient design token graphs, sub-millisecond edge cache pipelines, and verified accessible design systems with zero build latency.'}
              </p>

              {/* Action CTAs */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <a
                  href="#pricing"
                  className="px-8 py-4 text-xs sm:text-sm font-bold tracking-wide uppercase transition-all shadow-[var(--shadow-md)] hover:opacity-95 cursor-pointer flex items-center gap-2"
                  style={getPrimaryBtnStyle()}
                >
                  <span>Start Free Deployment</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  onClick={() => handleCopyCli()}
                  className="px-6 py-4 text-xs sm:text-sm font-mono font-semibold tracking-wide border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] hover:bg-[var(--color-bg-default)] text-[var(--color-fg-default)] transition-colors flex items-center gap-2.5 cursor-pointer"
                  style={{ borderRadius: 'var(--radius-button, var(--radius-md, 8px))' }}
                >
                  <Terminal className="w-4 h-4 text-[var(--color-action-primary)]" />
                  <span>{cliHint}</span>
                  {copiedCmd ? <Check className="w-4 h-4 text-[var(--color-status-success)]" /> : <Copy className="w-4 h-4 text-[var(--color-fg-muted)]" />}
                </button>
              </div>

              {/* Telemetry Proof Row */}
              <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
                <div className="p-4 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-[var(--color-fg-muted)] uppercase">P99 Latency</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-2xl sm:text-3xl font-mono font-bold text-[var(--color-fg-default)] block">1.18ms</span>
                  <span className="text-[10px] text-[var(--color-status-success)] font-semibold">-0.24ms vs last period</span>
                </div>

                <div className="p-4 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-[var(--color-fg-muted)] uppercase">SLA Uptime</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-2xl sm:text-3xl font-mono font-bold text-[var(--color-fg-default)] block">99.999%</span>
                  <span className="text-[10px] text-[var(--color-fg-muted)]">Verified Multi-Region</span>
                </div>

                <div className="p-4 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-[var(--color-fg-muted)] uppercase">Invocations</span>
                    <Flame className="w-3.5 h-3.5 text-[var(--color-action-primary)]" />
                  </div>
                  <span className="text-2xl sm:text-3xl font-mono font-bold text-[var(--color-fg-default)] block">8.94B</span>
                  <span className="text-[10px] text-[var(--color-fg-muted)]">Across 42 Global Pods</span>
                </div>

                <div className="p-4 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-[var(--color-fg-muted)] uppercase">Compliance</span>
                    <Shield className="w-3.5 h-3.5 text-[var(--color-status-success)]" />
                  </div>
                  <span className="text-2xl sm:text-3xl font-mono font-bold text-[var(--color-status-success)] block">SOC 2</span>
                  <span className="text-[10px] text-[var(--color-fg-muted)]">Type II Certified</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 4. Enterprise Client Trust Bar */}
        {isEnabled('partners') && (
          <section className="w-full py-8 px-6 sm:px-12 bg-[var(--color-bg-surface)] border-b border-[var(--color-border-default)]">
            <div className="max-w-6xl mx-auto text-center space-y-4">
              <p className="text-[11px] font-mono uppercase tracking-widest text-[var(--color-fg-muted)] font-semibold">
                Engineered for High-Velocity Platform & Infrastructure Teams
              </p>
              <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-75">
                {CLIENT_LOGOS.map((client, idx) => (
                  <span
                    key={idx}
                    className="font-mono font-black text-xs sm:text-sm tracking-wider uppercase text-[var(--color-fg-default)] hover:text-[var(--color-action-primary)] transition-colors"
                  >
                    {client}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 5. Interactive Multi-Target Code Playground */}
        {isEnabled('code') && (
          <section id="code" className="w-full py-16 sm:py-24 px-6 sm:px-12 border-b border-[var(--color-border-default)]">
            <div className="max-w-5xl mx-auto space-y-8 text-left">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold tracking-widest text-[var(--color-action-primary)] uppercase">
                    Developer Interface
                  </span>
                  <h2
                    className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-fg-default)]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    Compile Once, Distribute to 10 Production Targets
                  </h2>
                </div>

                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--color-bg-surface)] border border-[var(--color-border-default)] text-xs">
                  {(['typescript', 'python', 'go', 'curl'] as const).map(tab => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveCodeTab(tab)}
                      className={`px-3 py-1.5 rounded-lg font-mono text-[11px] uppercase transition-all cursor-pointer ${
                        activeCodeTab === tab
                          ? 'bg-[var(--color-action-primary)] text-[var(--color-action-primary-fg)] font-bold'
                          : 'text-[var(--color-fg-muted)] hover:text-[var(--color-fg-default)]'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Code Editor Window */}
              <div
                className="p-6 rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] font-mono text-xs shadow-xl space-y-4"
                style={getCardStyle()}
              >
                <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border-default)] text-[11px] text-[var(--color-fg-muted)]">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                    <span className="ml-2 font-bold text-[var(--color-fg-default)]">
                      {activeCodeTab === 'typescript' ? 'tokens.config.ts' : activeCodeTab === 'python' ? 'tokens_client.py' : activeCodeTab === 'go' ? 'main.go' : 'request.sh'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyCli(
                      activeCodeTab === 'typescript'
                        ? content
                          ? `import { ${engineClass} } from '${enginePkg}';\nconst engine = new ${engineClass}({ project: '${projectId}' });\nexport const tokens = await engine.compile({ target: 'tailwind-v4' });`
                          : "import { ApexCompiler } from '@apex/engine';\nconst engine = new ApexCompiler({ project: 'apex_runtime' });\nexport const tokens = await engine.compile({ target: 'tailwind-v4' });"
                        : content
                          ? `curl -X POST https://${apiHost}/v1/tokens/compile -H 'Authorization: Bearer ${apiKey}'`
                          : "curl -X POST https://api.apexengine.io/v1/tokens/compile -H 'Authorization: Bearer apex_live_key'"
                    )}
                    className="hover:text-[var(--color-fg-default)] flex items-center gap-1.5 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Snippet</span>
                  </button>
                </div>

                <pre className="overflow-x-auto text-[var(--color-fg-default)] leading-relaxed font-mono p-2">
                  {activeCodeTab === 'typescript' &&
`${importLine}

// 1. Initialize mathematical design system schema
const compiler = new ${engineClass}({
  apiKey: process.env.${runtimeKey},
  strictContrast: 'WCAG-2.2-AAA'
});

// 2. Compile synchronized tokens directly to Tailwind CSS 4 & CSS Vars
export const theme = await compiler.compile({
  projectId: '${projectId}',
  format: 'tailwind-v4',
  optimizeOklch: true,
  edgeCacheTtl: 86400
});`}
                  {activeCodeTab === 'python' &&
`from ${pyModule} import ${engineClass}, ContrastStrategy

# Initialize Python SDK client
compiler = ${engineClass}(
    api_key="${apiKey}",
    contrast_strategy=ContrastStrategy.WCAG_AAA
)

# Export typed DTCG and Figma Variables
token_bundle = compiler.export_bundle(
    project_id="${projectId}",
    targets=["figma_variables", "dtcg_json"]
)`}
                  {activeCodeTab === 'go' &&
`package main

import (
    "context"
    "fmt"
    "github.com/${goModule}/sdk-go"
)

func main() {
    client := ${clientName}.NewClient("${apiKey}")
    tokens, err := client.Compile(context.Background(), &${clientName}.CompileOpts{
        ProjectID: "${projectId}",
        Format:    "css-vars",
    })
    if err != nil { panic(err) }
    fmt.Printf("Compiled %d token custom properties\\n", len(tokens))
}`}
                  {activeCodeTab === 'curl' &&
`# Fetch compiled production CSS variables from nearest edge point
curl -X POST https://${apiHost}/v1/tokens/compile \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "projectId": "${projectId}",
    "format": "tailwind-v4",
    "colorSpace": "OKLCH"
  }'`}
                </pre>
              </div>
            </div>
          </section>
        )}

        {/* 6. Real-Time Telemetry & Cluster Performance Dashboard */}
        {isEnabled('stats') && (
          <section id="telemetry" className="w-full py-16 sm:py-24 px-6 sm:px-12 bg-[var(--color-bg-surface)] border-b border-[var(--color-border-default)]">
            <div className="max-w-5xl mx-auto space-y-8 text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono font-bold tracking-widest text-[var(--color-action-primary)] uppercase">
                    Edge Observability
                  </span>
                  <h2
                    className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-fg-default)]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    Global Execution & Throughput Metrics
                  </h2>
                </div>

                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--color-bg-default)] border border-[var(--color-border-default)] text-xs">
                  {(['24h', '7d', '30d'] as const).map(tf => (
                    <button
                      key={tf}
                      type="button"
                      onClick={() => setDashboardTimeframe(tf)}
                      className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                        dashboardTimeframe === tf
                          ? 'bg-[var(--color-action-primary)] text-[var(--color-action-primary-fg)] font-bold'
                          : 'text-[var(--color-fg-muted)] hover:text-[var(--color-fg-default)]'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cluster Sparkline Visualizer */}
              <div
                className="p-6 rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-bg-default)] space-y-6 shadow-sm"
                style={getCardStyle()}
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[var(--color-fg-muted)]">Daily Ingestion Volume (Requests / Sec)</span>
                  <span className="text-[var(--color-status-success)] font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Live Streaming Data (42 Regions)</span>
                  </span>
                </div>

                <div className="h-36 w-full flex items-end gap-1 sm:gap-2 pt-4">
                  {[45, 62, 58, 75, 89, 94, 82, 105, 118, 112, 130, 142, 138, 155, 168, 160, 182, 195, 188, 210, 225, 240].map((val, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                      <div
                        className="w-full rounded-t-sm transition-all group-hover:opacity-80"
                        style={{
                          height: `${(val / 250) * 100}%`,
                          backgroundColor: 'var(--color-action-primary)'
                        }}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-between text-[11px] font-mono text-[var(--color-fg-muted)] pt-3 border-t border-[var(--color-border-default)]">
                  <span>00:00 UTC</span>
                  <span>06:00 UTC</span>
                  <span>12:00 UTC</span>
                  <span>18:00 UTC</span>
                  <span className="font-bold text-[var(--color-fg-default)]">Live (Current)</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 7. Feature Bento Grid */}
        {isEnabled('features') && (
          <section id="features" className="w-full py-16 sm:py-24 px-6 sm:px-12 border-b border-[var(--color-border-default)]">
            <div className="max-w-6xl mx-auto space-y-12 text-left">
              <div className="text-center space-y-3 max-w-2xl mx-auto">
                <span className="text-xs font-mono font-bold tracking-widest text-[var(--color-action-primary)] uppercase">
                  Core Architecture
                </span>
                <h2
                  className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-fg-default)]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Engineered for Zero Visual Drift & Extreme Ergonomics
                </h2>
                <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] leading-relaxed">
                  Eliminate manual token maintenance, breaking styling diffs, and inaccessible contrast values with automated mathematical proofs.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div
                  className="p-6 rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] space-y-4 shadow-sm flex flex-col justify-between"
                  style={getCardStyle()}
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-action-primary)] text-[var(--color-action-primary-fg)] flex items-center justify-center">
                      <Zap className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-[var(--color-fg-default)]">Perceptual OKLCH Math</h3>
                    <p className="text-xs text-[var(--color-fg-muted)] leading-relaxed">
                      Generates uniform lightness ramps without the harsh chroma banding or muddy tones found in antiquated sRGB color spaces.
                    </p>
                  </div>
                  <span className="text-[11px] font-mono text-[var(--color-action-primary)] font-bold">14-Step Scales</span>
                </div>

                <div
                  className="p-6 rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] space-y-4 shadow-sm flex flex-col justify-between"
                  style={getCardStyle()}
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-action-primary)] text-[var(--color-action-primary-fg)] flex items-center justify-center">
                      <Shield className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-[var(--color-fg-default)]">WCAG 2.2 AAA Proofs</h3>
                    <p className="text-xs text-[var(--color-fg-muted)] leading-relaxed">
                      Integrated contrast engine computes APCA lightness difference and 4.5:1 / 7:1 ratios with 1-click automated color nudging.
                    </p>
                  </div>
                  <span className="text-[11px] font-mono text-[var(--color-status-success)] font-bold">Guaranteed Compliance</span>
                </div>

                <div
                  className="p-6 rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] space-y-4 shadow-sm flex flex-col justify-between"
                  style={getCardStyle()}
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-action-primary)] text-[var(--color-action-primary-fg)] flex items-center justify-center">
                      <Globe className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-[var(--color-fg-default)]">Sub-10ms Edge Cache</h3>
                    <p className="text-xs text-[var(--color-fg-muted)] leading-relaxed">
                      Distribute compiled design systems worldwide across 42 Points of Presence with HTTP/3, Brotli, and instant cache invalidation.
                    </p>
                  </div>
                  <span className="text-[11px] font-mono text-[var(--color-action-primary)] font-bold">42 Edge Clusters</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 8. Interactive AI Prompt Synthesis Sandbox */}
        {isEnabled('ai') && (
          <section className="w-full py-16 sm:py-24 px-6 sm:px-12 bg-[var(--color-bg-surface)] border-b border-[var(--color-border-default)]">
            <div className="max-w-4xl mx-auto space-y-6 text-left">
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold tracking-widest text-[var(--color-action-primary)] uppercase">
                  Generative Intelligence
                </span>
                <h2
                  className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-fg-default)]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Live Multi-Modal Design Token Synthesis
                </h2>
                <p className="text-xs sm:text-sm text-[var(--color-fg-muted)]">
                  Provide natural language requirements and generate mathematically verified design system specifications.
                </p>
              </div>

              <div
                className="p-6 rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-bg-default)] space-y-4 shadow-lg"
                style={getCardStyle()}
              >
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={e => setAiPrompt(e.target.value)}
                    placeholder="Enter prompt: e.g. High-contrast fintech token ramp..."
                    className="flex-1 px-4 py-3 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] text-xs text-[var(--color-fg-default)] focus:outline-none focus:ring-2 focus:ring-[var(--color-action-primary)] font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleRunAiInference}
                    disabled={isAiRunning}
                    className="px-6 py-3 text-xs font-bold tracking-wide transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer shrink-0"
                    style={getPrimaryBtnStyle()}
                  >
                    {isAiRunning ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                    <span>{isAiRunning ? 'Compiling Tokens...' : 'Synthesize Tokens'}</span>
                  </button>
                </div>

                <div className="p-4 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] font-mono text-xs space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-[var(--color-fg-muted)] pb-2 border-b border-[var(--color-border-default)]">
                    <span>Synthesized TypeScript Tokens</span>
                    <button
                      type="button"
                      onClick={() => handleCopyCli(aiOutput || '')}
                      className="hover:text-[var(--color-fg-default)] flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </button>
                  </div>
                  <pre className="overflow-x-auto text-[var(--color-fg-default)] leading-relaxed font-mono">
                    {aiOutput ||
`// Ready. Click 'Synthesize Tokens' to execute real-time model synthesis.
const tokens = await ${clientName}.synthesize({
  prompt: 'Minimalist editorial architecture with warm earth tones',
  exportTarget: 'tailwind-v4'
});`}
                  </pre>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 9. Transparent SaaS Pricing Matrix */}
        {isEnabled('pricing') && (
          <section id="pricing" className="w-full py-16 sm:py-24 px-6 sm:px-12 border-b border-[var(--color-border-default)]">
            <div className="max-w-6xl mx-auto space-y-12 text-left">
              <div className="text-center space-y-4 max-w-2xl mx-auto">
                <span className="text-xs font-mono font-bold tracking-widest text-[var(--color-action-primary)] uppercase">
                  Transparent Investment
                </span>
                <h2
                  className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-fg-default)]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Predictable Pricing for High-Scale Engineering
                </h2>

                {/* Annual Billing Toggle */}
                <div className="inline-flex items-center gap-3 p-1.5 rounded-full border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setIsAnnualPricing(false)}
                    className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                      !isAnnualPricing ? 'bg-[var(--color-bg-default)] text-[var(--color-fg-default)] shadow-xs' : 'text-[var(--color-fg-muted)]'
                    }`}
                  >
                    Monthly Billing
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAnnualPricing(true)}
                    className={`px-3 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
                      isAnnualPricing ? 'bg-[var(--color-action-primary)] text-[var(--color-action-primary-fg)] shadow-xs font-bold' : 'text-[var(--color-fg-muted)]'
                    }`}
                  >
                    <span>Annual Billing</span>
                    <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.2 rounded-full bg-emerald-500 text-white font-bold">Save 20%</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {PRICING_TIERS.map((tier, idx) => (
                  <div
                    key={idx}
                    className={`rounded-2xl border p-8 space-y-6 flex flex-col justify-between transition-all ${
                      tier.highlighted
                        ? 'border-[var(--color-action-primary)] shadow-2xl ring-2 ring-[var(--color-action-primary)]/20 bg-[var(--color-bg-surface)]'
                        : 'border-[var(--color-border-default)] bg-[var(--color-bg-default)] shadow-sm'
                    }`}
                    style={getCardStyle()}
                  >
                    <div className="space-y-4">
                      {tier.highlighted && (
                        <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[var(--color-action-primary)] text-[var(--color-action-primary-fg)] inline-block">
                          Most Popular with Teams
                        </span>
                      )}
                      <h3 className="text-xl font-bold text-[var(--color-fg-default)]">{tier.name}</h3>
                      <p className="text-xs text-[var(--color-fg-muted)] leading-relaxed">{tier.desc}</p>

                      <div className="flex items-baseline gap-1.5 pt-2">
                        <span className="text-4xl font-mono font-black text-[var(--color-fg-default)]">{tier.price}</span>
                        <span className="text-xs text-[var(--color-fg-muted)] font-mono">{tier.period}</span>
                      </div>

                      <ul className="space-y-2.5 pt-4 border-t border-[var(--color-border-default)]">
                        {tier.features.map((feat, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-[var(--color-fg-default)]">
                            <Check className="w-4 h-4 text-[var(--color-status-success)] shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-6">
                      <button
                        type="button"
                        className="w-full py-3.5 text-xs font-bold tracking-wide uppercase transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                        style={
                          tier.highlighted
                            ? getPrimaryBtnStyle()
                            : {
                                borderRadius: 'var(--radius-button, var(--radius-md, 8px))',
                                border: '1px solid var(--color-border-default)',
                                backgroundColor: 'var(--color-bg-surface)',
                                color: 'var(--color-fg-default)'
                              }
                        }
                      >
                        <span>{tier.cta}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 10. Developer FAQ Accordion */}
        {isEnabled('faq') && (
          <section id="faq" className="w-full py-16 sm:py-24 px-6 sm:px-12 bg-[var(--color-bg-surface)] border-b border-[var(--color-border-default)]">
            <div className="max-w-3xl mx-auto space-y-8 text-left">
              <div className="text-center space-y-2">
                <span className="text-xs font-mono font-bold tracking-widest text-[var(--color-action-primary)] uppercase">
                  Frequently Answered
                </span>
                <h2
                  className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-fg-default)]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Technical Architecture & Security FAQ
                </h2>
              </div>

              <div className="space-y-3">
                {FAQS.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={idx}
                      className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-default)] overflow-hidden transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full p-5 flex items-center justify-between text-left gap-4 cursor-pointer hover:bg-[var(--color-bg-surface)]/50 transition-colors"
                      >
                        <span className="text-xs sm:text-sm font-bold text-[var(--color-fg-default)]">
                          {faq.q}
                        </span>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-[var(--color-action-primary)] shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-[var(--color-fg-muted)] shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5 text-xs text-[var(--color-fg-muted)] leading-relaxed border-t border-[var(--color-border-default)] pt-3">
                          <p>{faq.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* 11. Final High-Impact Deployment CTA Banner */}
        {isEnabled('cta') && (
          <section className="w-full py-16 sm:py-24 px-6 sm:px-12 border-b border-[var(--color-border-default)]">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--color-bg-surface)] border border-[var(--color-border-default)] text-[var(--color-action-primary)]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Zero Build Latency Guaranteed</span>
              </div>

              <h2
                className="text-3xl sm:text-5xl font-black tracking-tight text-[var(--color-fg-default)] leading-tight"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Ready to Upgrade Your Design System Architecture?
              </h2>

              <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] max-w-xl mx-auto leading-relaxed">
                Join thousands of software engineers deploying mathematically verified design tokens and accessible web interfaces.
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
                <a
                  href="#pricing"
                  className="px-8 py-4 text-xs sm:text-sm font-bold tracking-wide uppercase transition-all shadow-[var(--shadow-md)] hover:opacity-90 cursor-pointer flex items-center gap-2"
                  style={getPrimaryBtnStyle()}
                >
                  <span>Deploy in 60s</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  onClick={() => handleCopyCli()}
                  className="px-6 py-4 text-xs sm:text-sm font-mono font-semibold tracking-wide border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] hover:bg-[var(--color-bg-default)] text-[var(--color-fg-default)] transition-colors flex items-center gap-2"
                  style={{ borderRadius: 'var(--radius-button, var(--radius-md, 8px))' }}
                >
                  <Terminal className="w-4 h-4 text-[var(--color-action-primary)]" />
                  <span>{cliHint}</span>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* 12. Design System Showcase & Type Specimen (Doc 02 §4.3) */}
        <GenreOfferings content={content} />
        {(isEnabled('components') || isEnabled('componentsShowcase')) && <ComponentsShowcase />}
        <TypeSpecimen />
      </main>

      {/* 13. Developer Infrastructure Footer */}
      <footer className="w-full py-12 px-6 sm:px-12 bg-[var(--color-bg-default)] border-t border-[var(--color-border-default)] text-xs text-[var(--color-fg-muted)]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-left">
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-mono font-black text-sm uppercase tracking-wider text-[var(--color-fg-default)]">
              <Cpu className="w-4 h-4 text-[var(--color-action-primary)]" />
              <span>{brandName}</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              The high-velocity distributed design token runtime. Zero visual drift, multi-target compilation, and mathematical WCAG guarantees.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-[var(--color-fg-default)] font-mono uppercase text-[10px]">Platform</h4>
            <ul className="space-y-1 text-[11px]">
              <li><a href="#code" className="hover:text-[var(--color-fg-default)]">Token Compiler</a></li>
              <li><a href="#telemetry" className="hover:text-[var(--color-fg-default)]">Global Edge CDN</a></li>
              <li><a href="#features" className="hover:text-[var(--color-fg-default)]">OKLCH Palette Math</a></li>
              <li><a href="#pricing" className="hover:text-[var(--color-fg-default)]">Enterprise SLAs</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-[var(--color-fg-default)] font-mono uppercase text-[10px]">Developers</h4>
            <ul className="space-y-1 text-[11px]">
              <li><a href="#code" className="hover:text-[var(--color-fg-default)]">TypeScript SDK</a></li>
              <li><a href="#code" className="hover:text-[var(--color-fg-default)]">Python Client</a></li>
              <li><a href="#code" className="hover:text-[var(--color-fg-default)]">Go Library</a></li>
              <li><a href="#faq" className="hover:text-[var(--color-fg-default)]">Architecture Docs</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-[var(--color-fg-default)] font-mono uppercase text-[10px]">Security</h4>
            <p className="text-[11px] leading-relaxed">
              SOC 2 Type II Certified · ISO 27001 · 256-bit TLS · End-to-end encrypted token vaults.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-[var(--color-border-default)] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© {new Date().getFullYear()} {brandName}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#faq" className="hover:text-[var(--color-fg-default)]">Privacy Policy</a>
            <a href="#faq" className="hover:text-[var(--color-fg-default)]">Terms of Service</a>
            <a href="#faq" className="hover:text-[var(--color-fg-default)]">Security Whitepaper</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SaasTemplate;
