import React, { useState } from 'react';
import {
  Sparkles,
  Award,
  ArrowUpRight,
  Mail,
  Code2,
  Terminal,
  ExternalLink,
  Copy,
  Check,
  Play,
  Layers,
  Cpu,
  Palette,
  Eye,
  Clock,
  ArrowRight,
  CheckCircle2,
  Sliders,
  Compass,
  Monitor
} from 'lucide-react';
import {
  ComponentsShowcase,
  TypeSpecimen,
  GenreOfferings
} from '../sections';
import { TemplateProps } from './index';

export const PortfolioTemplate: React.FC<TemplateProps> = ({
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
  const brandName = content?.brandName || brandNameProp || 'STUDIO VORTEX Design & Direction';
  const headline = headlineProp || content?.headline;
  const subtitle = subtitleProp || content?.subtitle;
  const badge = content?.badge || badgeProp || 'Awwwards Studio of the Year 2025 · D&AD Black Pencil';
  const heroImage = content?.heroImage || heroImageProp;
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [selectedScope, setSelectedScope] = useState<'flagship' | 'system' | 'spatial'>('flagship');
  const [selectedTimeline, setSelectedTimeline] = useState<'sprint' | 'full'>('full');
  const [inquirySent, setInquirySent] = useState(false);

  const enabled = components?.enabledComponents;
  const isSectionEnabled = (section: string) => {
    if (section === 'hero' || section === 'announcement' || section === 'components' || section === 'type') {
      return true;
    }
    if (!enabled || enabled.length === 0) return true;

    const moduleMapping: Record<string, string[]> = {
      projects: ['product-card', 'projects', 'projectGrid', 'works', 'case-studies'],
      capabilities: ['product-card', 'capabilities', 'features', 'featureGrid', 'feature-grid'],
      process: ['metrics-row', 'process', 'features', 'spec-table'],
      testimonials: ['reviews-grid', 'testimonials', 'reviews', 'customer-review'],
      cta: ['newsletter', 'pricing-matrix', 'cta', 'inquiry', 'pricing', 'calculator']
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
      return {
        ...base,
        border: '1px solid var(--color-border-default)',
        boxShadow: 'var(--shadow-md, 0 10px 15px -3px rgba(0,0,0,0.1))'
      };
    }
    if (cardVariant === 'flat-tint') {
      return {
        ...base,
        border: 'none',
        boxShadow: 'none'
      };
    }
    return {
      ...base,
      border: '1px solid var(--color-border-default)',
      boxShadow: 'none'
    };
  };

  const getImageStyle = (): React.CSSProperties => ({
    filter: 'var(--image-filter, none)',
    transition: 'filter 0.2s ease'
  });

  const contactEmail = 'commissions@vortex.studio';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contactEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  const CASE_STUDIES = [
    {
      title: 'NEBULA OS — Autonomous Vehicle Spatial Interface',
      client: 'Nebula Mobility Corp',
      year: '2026',
      tag: 'Spatial 3D & Embedded Systems',
      desc: 'Designed and built the real-time instrument cluster and heads-up display operating system. Implemented in Three.js and custom GLSL shaders running at steady 60fps on automotive-grade chipsets.',
      metric: '+180% Driver Ergonomic Task Speed',
      award: 'FWA of the Month & Tokyo TDC'
    },
    {
      title: 'AETHER PRECISION — Planar Acoustic Audio Flagship',
      client: 'Aether Sound',
      year: '2026',
      tag: 'Luxury E-Commerce & WebAudio',
      desc: 'An immersive digital flagship featuring interactive WebAudio frequency response visualizers, tactile 3D product customizer, and seamless Shopify Plus headless integration.',
      metric: '4.8% E-Commerce Conversion Rate',
      award: 'Awwwards Site of the Month'
    },
    {
      title: 'SOLARIA GRID — Planetary Energy Telemetry System',
      client: 'Solaria Energy',
      year: '2025',
      tag: 'Design System & OKLCH Color Science',
      desc: 'Engineered an institutional design system spanning 140 UI components, perceptual OKLCH color palettes, and sub-millisecond telemetry charts monitoring clean gigawatts across 4 continents.',
      metric: 'Zero Accessibility Regressions across 4M Daily Views',
      award: 'D&AD Graphite Pencil'
    },
    {
      title: 'CHRONICLE JOURNAL — Monograph Publishing Engine',
      client: 'Chronicle Press',
      year: '2025',
      tag: 'Editorial Typography & Performance',
      desc: 'Crafted a bespoke editorial reading experience featuring fluid mathematical type scales, zero-cumulative layout shift, and an offline PWA audio essay companion player.',
      metric: '14.2 min Avg Session Duration',
      award: 'Fast Company Innovation by Design'
    }
  ];

  const CLIENT_ROSTER = [
    'NIKE LAB',
    'STRIPE PRESS',
    'TEENAGE ENGINEERING',
    'POLESTAR',
    'LEICA CAMERA',
    'ACNE STUDIOS'
  ];

  // Budget calculations
  const scopeBasePrice = {
    flagship: 65000,
    system: 45000,
    spatial: 85000
  }[selectedScope];

  const timelineMultiplier = selectedTimeline === 'sprint' ? 1.25 : 1.0;
  const estimatedInvestment = Math.round(scopeBasePrice * timelineMultiplier);

  const formatCurrency = (num: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);

  const handleSendInquiry = () => {
    setInquirySent(true);
    setTimeout(() => setInquirySent(false), 4000);
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-[var(--color-bg-default)] text-[var(--color-fg-default)] font-sans antialiased selection:bg-[var(--color-action-primary)] selection:text-[var(--color-action-primary-fg)]">
      {/* 1. Availability Status Bar */}
      {isEnabled('announcement') && (
        <aside
          aria-label="Studio Availability"
          className="w-full py-2.5 px-4 bg-[var(--color-bg-surface)] text-[var(--color-fg-muted)] border-b border-[var(--color-border-default)] text-xs text-center font-mono tracking-wide flex items-center justify-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-[var(--color-fg-default)] font-bold">
            ● Now Booking Select Q2 2027 Commissions
          </span>
          <span className="text-[var(--color-border-default)]">·</span>
          <span>Awwwards Studio of the Year 2025</span>
          <span className="text-[var(--color-border-default)]">·</span>
          <span>D&amp;AD Black Pencil in Spatial Interaction</span>
        </aside>
      )}

      {/* 2. Editorial Header */}
      <header className="w-full border-b sticky top-0 z-40 backdrop-blur-md bg-[var(--color-bg-default)]/90 border-[var(--color-border-default)]">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--color-action-primary)] text-[var(--color-action-primary-fg)] flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-mono font-extrabold text-lg tracking-tight">{brandName}</span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-mono uppercase tracking-widest text-[var(--color-fg-muted)] border-l pl-2 border-[var(--color-border-default)]">
                Design &amp; Direction
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--color-fg-muted)]">
            <a href="#works" className="hover:text-[var(--color-fg-default)] transition-colors">Selected Works</a>
            <a href="#capabilities" className="hover:text-[var(--color-fg-default)] transition-colors">Capabilities</a>
            <a href="#process" className="hover:text-[var(--color-fg-default)] transition-colors">Process</a>
            <a href="#endorsements" className="hover:text-[var(--color-fg-default)] transition-colors">Accolades</a>
            <a href="#inquiry" className="hover:text-[var(--color-fg-default)] transition-colors">Inquiry Terminal</a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#inquiry"
              style={getPrimaryBtnStyle()}
              className="px-4 py-2 text-xs font-bold shadow-sm hover:opacity-95"
            >
              Initiate Project
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* 3. Hero Section */}
        {isEnabled('hero') && (
          <section className="relative w-full py-20 sm:py-28 px-6 border-b border-[var(--color-border-default)] overflow-hidden">
            <div className="max-w-5xl mx-auto space-y-8 text-center relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] text-xs font-mono font-medium text-[var(--color-action-primary)] shadow-sm">
                <Award className="w-3.5 h-3.5" />
                <span>{badge}</span>
              </div>

              <h1
                className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.14]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {headline || 'Designing visceral digital products, spatial 3D interfaces, and mathematical typography'}
              </h1>

              <p className="text-base sm:text-xl text-[var(--color-fg-muted)] max-w-2xl mx-auto font-normal leading-relaxed">
                {subtitle ||
                  'We collaborate with visionary founders and progressive technology leaders to transform high-complexity engineering into culturally indelible software and spatial experiences.'}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <a
                  href="#works"
                  style={getPrimaryBtnStyle()}
                  className="px-7 py-3.5 text-sm font-bold shadow-lg hover:opacity-95 flex items-center gap-2"
                >
                  <span>Explore Selected Works</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="#inquiry"
                  className="px-7 py-3.5 text-sm font-semibold rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] text-[var(--color-fg-default)] hover:bg-[var(--color-bg-default)] transition-colors flex items-center gap-2"
                >
                  <Terminal className="w-4 h-4 text-[var(--color-action-primary)]" />
                  <span>Interactive Scope Calculator</span>
                </a>
              </div>

              {/* Studio Metrics Row */}
              <div
                style={getCardStyle()}
                className="mt-12 p-6 sm:p-8 border shadow-xl grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto text-left"
              >
                <div className="space-y-1">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--color-fg-muted)]">Enterprise Value Created</span>
                  <p className="text-xl sm:text-3xl font-extrabold font-mono text-[var(--color-fg-default)]">$4.2B+</p>
                  <span className="text-[10px] text-[var(--color-fg-muted)]">Across 18 Portfolio Exits</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--color-fg-muted)]">International Honors</span>
                  <p className="text-xl sm:text-3xl font-extrabold font-mono text-[var(--color-action-primary)]">42</p>
                  <span className="text-[10px] text-[var(--color-fg-muted)]">Awwwards, FWA &amp; D&amp;AD</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--color-fg-muted)]">Average Conversion Uplift</span>
                  <p className="text-xl sm:text-3xl font-extrabold font-mono text-emerald-600">+210%</p>
                  <span className="text-[10px] text-[var(--color-fg-muted)]">First 90 Days Post-Launch</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--color-fg-muted)]">Partner Retention</span>
                  <p className="text-xl sm:text-3xl font-extrabold font-mono text-[var(--color-fg-default)]">98.4%</p>
                  <span className="text-[10px] text-[var(--color-fg-muted)]">Multi-Year Advisory Engagements</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 4. Client Roster Marquee */}
        <section className="w-full py-8 px-6 border-b border-[var(--color-border-default)] bg-[var(--color-bg-surface)]">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--color-fg-muted)] shrink-0">
              Trusted Creative Collaborator To:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 w-full text-center">
              {CLIENT_ROSTER.map((client, idx) => (
                <span
                  key={idx}
                  className="text-xs font-mono font-bold tracking-wider text-[var(--color-fg-default)] opacity-85 hover:opacity-100 transition-opacity"
                >
                  {client}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* 5. SELECTED CASE STUDIES */}
        {isEnabled('projects') && (
          <section id="works" className="w-full py-18 px-6 border-b border-[var(--color-border-default)]">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-2 max-w-2xl mx-auto">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--color-action-primary)]">
                  Selected Monograph
                </span>
                <h2
                  className="text-2xl sm:text-4xl font-bold tracking-tight text-[var(--color-fg-default)]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Category-defining digital systems &amp; spatial products
                </h2>
                <p className="text-sm text-[var(--color-fg-muted)]">
                  A curated selection of production flagships, automotive interfaces, and mathematical design infrastructure.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {CASE_STUDIES.map((project, idx) => (
                  <article
                    key={idx}
                    style={getCardStyle()}
                    className="p-8 border shadow-sm space-y-6 flex flex-col justify-between hover:shadow-lg transition-all"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-[var(--color-action-primary)]/10 text-[var(--color-action-primary)]">
                          {project.tag}
                        </span>
                        <span className="text-xs font-mono text-[var(--color-fg-muted)]">{project.year}</span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--color-fg-default)]">
                        {project.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] leading-relaxed">
                        {project.desc}
                      </p>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-[var(--color-border-default)]">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-emerald-600 font-bold">{project.metric}</span>
                        <span className="text-[var(--color-fg-muted)]">{project.award}</span>
                      </div>

                      <button
                        type="button"
                        className="w-full py-2.5 text-xs font-bold font-mono rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-default)] text-[var(--color-fg-default)] hover:bg-[var(--color-bg-surface)] transition-colors flex items-center justify-center gap-2"
                      >
                        <span>Inspect Architecture &amp; Case Study</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-[var(--color-action-primary)]" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 6. STUDIO CAPABILITIES BENTO GRID */}
        {isEnabled('capabilities') && (
          <section id="capabilities" className="w-full py-18 px-6 border-b border-[var(--color-border-default)] bg-[var(--color-bg-surface)]">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-2 max-w-2xl mx-auto">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--color-action-primary)]">
                  Discipline &amp; Craft
                </span>
                <h2
                  className="text-2xl sm:text-4xl font-bold tracking-tight text-[var(--color-fg-default)]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Core capabilities &amp; engineering stack
                </h2>
                <p className="text-sm text-[var(--color-fg-muted)]">
                  We don&apos;t produce static prototypes. We design natively in the browser using production code and mathematical models.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div style={getCardStyle()} className="p-8 border shadow-sm space-y-4 bg-[var(--color-bg-default)]">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-action-primary)]/10 text-[var(--color-action-primary)] flex items-center justify-center">
                    <Monitor className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold tracking-tight">Spatial 3D &amp; WebGL Shaders</h3>
                  <p className="text-xs text-[var(--color-fg-muted)] leading-relaxed">
                    Custom Three.js canvas integration, interactive mouse parallax, physics-based springs, and optimized GLSL render loops running at 60fps across mobile and desktop.
                  </p>
                </div>

                <div style={getCardStyle()} className="p-8 border shadow-sm space-y-4 bg-[var(--color-bg-default)]">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-action-primary)]/10 text-[var(--color-action-primary)] flex items-center justify-center">
                    <Palette className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold tracking-tight">Mathematical Design Systems</h3>
                  <p className="text-xs text-[var(--color-fg-muted)] leading-relaxed">
                    Perceptual OKLCH color spaces, APCA and WCAG 2.2 AAA contrast verification, and multi-format token export to CSS variables, Tailwind, iOS Swift, and Android XML.
                  </p>
                </div>

                <div style={getCardStyle()} className="p-8 border shadow-sm space-y-4 bg-[var(--color-bg-default)]">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-action-primary)]/10 text-[var(--color-action-primary)] flex items-center justify-center">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold tracking-tight">Production Full-Stack Engineering</h3>
                  <p className="text-xs text-[var(--color-fg-muted)] leading-relaxed">
                    React 19, TypeScript, Rust WebAssembly runtimes, Vite, and serverless edge deployments guaranteeing 100/100 Google Lighthouse Core Web Vitals.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 7. STUDIO METHODOLOGY & 4-STEP VELOCITY PROCESS */}
        {isEnabled('process') && (
          <section id="process" className="w-full py-18 px-6 border-b border-[var(--color-border-default)]">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-2 max-w-2xl mx-auto">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--color-action-primary)]">
                  Execution Velocity
                </span>
                <h2
                  className="text-2xl sm:text-4xl font-bold tracking-tight text-[var(--color-fg-default)]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  The four-step sprint methodology
                </h2>
                <p className="text-sm text-[var(--color-fg-muted)]">
                  No bloated committee meetings. Direct access to principal designers and engineers from kickoff to production release.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div style={getCardStyle()} className="p-6 border space-y-3">
                  <span className="text-xs font-mono font-extrabold text-[var(--color-action-primary)]">01 / DECONSTRUCT</span>
                  <h4 className="text-sm font-bold text-[var(--color-fg-default)]">Strategic Positioning</h4>
                  <p className="text-xs text-[var(--color-fg-muted)] leading-relaxed">
                    We audit your category competitors, extract your core technical moat, and define an uncompromising visual ethos.
                  </p>
                </div>

                <div style={getCardStyle()} className="p-6 border space-y-3">
                  <span className="text-xs font-mono font-extrabold text-[var(--color-action-primary)]">02 / CODE PROTOTYPE</span>
                  <h4 className="text-sm font-bold text-[var(--color-fg-default)]">Interactive Sandboxes</h4>
                  <p className="text-xs text-[var(--color-fg-muted)] leading-relaxed">
                    We skip static Figma click-throughs and prototype directly in the browser with real data, spring physics, and WebGL.
                  </p>
                </div>

                <div style={getCardStyle()} className="p-6 border space-y-3">
                  <span className="text-xs font-mono font-extrabold text-[var(--color-action-primary)]">03 / REFINE &amp; CHOREOGRAPH</span>
                  <h4 className="text-sm font-bold text-[var(--color-fg-default)]">Sensory Micro-Interaction</h4>
                  <p className="text-xs text-[var(--color-fg-muted)] leading-relaxed">
                    Choreographing staggered entrances, sound design triggers, and tactile haptic feedback across touch and mouse events.
                  </p>
                </div>

                <div style={getCardStyle()} className="p-6 border space-y-3">
                  <span className="text-xs font-mono font-extrabold text-[var(--color-action-primary)]">04 / SHIP &amp; SCALE</span>
                  <h4 className="text-sm font-bold text-[var(--color-fg-default)]">Global Release &amp; CI/CD</h4>
                  <p className="text-xs text-[var(--color-fg-muted)] leading-relaxed">
                    Deploying production-ready token libraries, automated test suites, and CDN edge assets ready for millions of visitors.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 8. CLIENT ENDORSEMENTS */}
        {isEnabled('testimonials') && (
          <section id="endorsements" className="w-full py-18 px-6 border-b border-[var(--color-border-default)] bg-[var(--color-bg-surface)]">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-2 max-w-2xl mx-auto">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--color-action-primary)]">
                  Founder Endorsements
                </span>
                <h2
                  className="text-2xl sm:text-4xl font-bold tracking-tight text-[var(--color-fg-default)]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Trusted by design directors and technical founders
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div style={getCardStyle()} className="p-8 border space-y-4 bg-[var(--color-bg-default)]">
                  <p className="text-xs sm:text-sm text-[var(--color-fg-default)] italic leading-relaxed">
                    &ldquo;STUDIO VORTEX transformed our complex telemetry data into an intuitive work of art. Our enterprise deal cycle shortened by 40% after the redesign.&rdquo;
                  </p>
                  <div className="pt-2 border-t border-[var(--color-border-default)]">
                    <p className="text-xs font-bold text-[var(--color-fg-default)]">Dr. Julian Thorne</p>
                    <p className="text-[10px] text-[var(--color-fg-muted)] font-mono">CEO, Solaria Energy Systems</p>
                  </div>
                </div>

                <div style={getCardStyle()} className="p-8 border space-y-4 bg-[var(--color-bg-default)]">
                  <p className="text-xs sm:text-sm text-[var(--color-fg-default)] italic leading-relaxed">
                    &ldquo;Their ability to write custom GLSL shaders that run flawlessly at 60fps on mobile while maintaining 100/100 Lighthouse scores is genuinely rare.&rdquo;
                  </p>
                  <div className="pt-2 border-t border-[var(--color-border-default)]">
                    <p className="text-xs font-bold text-[var(--color-fg-default)]">Seraphina Vance</p>
                    <p className="text-[10px] text-[var(--color-fg-muted)] font-mono">VP Product, Nebula Mobility</p>
                  </div>
                </div>

                <div style={getCardStyle()} className="p-8 border space-y-4 bg-[var(--color-bg-default)]">
                  <p className="text-xs sm:text-sm text-[var(--color-fg-default)] italic leading-relaxed">
                    &ldquo;The mathematical rigor behind their design system saved our engineering team six months of manual token refactoring. Simply masterclass.&rdquo;
                  </p>
                  <div className="pt-2 border-t border-[var(--color-border-default)]">
                    <p className="text-xs font-bold text-[var(--color-fg-default)]">Kenzo Takahashi</p>
                    <p className="text-[10px] text-[var(--color-fg-muted)] font-mono">Head of Design, Aether Sound</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 9. INTERACTIVE PROJECT INQUIRY TERMINAL */}
        {isEnabled('cta') && (
          <section id="inquiry" className="w-full py-18 px-6 border-b border-[var(--color-border-default)]">
            <div className="max-w-4xl mx-auto space-y-10">
              <div className="text-center space-y-2">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--color-action-primary)]">
                  Project Inquiry Terminal
                </span>
                <h2
                  className="text-2xl sm:text-4xl font-bold tracking-tight text-[var(--color-fg-default)]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Configure your commission scope &amp; investment
                </h2>
                <p className="text-sm text-[var(--color-fg-muted)] max-w-xl mx-auto">
                  Select your intended project parameters below for an immediate estimate and direct communication link.
                </p>
              </div>

              <div
                style={getCardStyle()}
                className="p-6 sm:p-10 border shadow-xl space-y-8 bg-[var(--color-bg-surface)]"
              >
                {/* Scope Selection */}
                <div className="space-y-3">
                  <label className="text-xs font-mono uppercase text-[var(--color-fg-muted)] font-bold">
                    1. Select Engagement Scope
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedScope('system')}
                      className={`p-4 rounded-xl text-left border transition-all ${
                        selectedScope === 'system'
                          ? 'border-[var(--color-action-primary)] bg-[var(--color-action-primary)]/10 ring-2 ring-[var(--color-action-primary)]/20'
                          : 'border-[var(--color-border-default)] bg-[var(--color-bg-default)]'
                      }`}
                    >
                      <span className="text-xs font-bold block text-[var(--color-fg-default)]">Design System Architecture</span>
                      <span className="text-[11px] text-[var(--color-fg-muted)] block mt-1">Tokens, OKLCH scales &amp; React library</span>
                      <span className="text-xs font-mono font-bold text-[var(--color-action-primary)] block mt-2">from $45,000</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedScope('flagship')}
                      className={`p-4 rounded-xl text-left border transition-all ${
                        selectedScope === 'flagship'
                          ? 'border-[var(--color-action-primary)] bg-[var(--color-action-primary)]/10 ring-2 ring-[var(--color-action-primary)]/20'
                          : 'border-[var(--color-border-default)] bg-[var(--color-bg-default)]'
                      }`}
                    >
                      <span className="text-xs font-bold block text-[var(--color-fg-default)]">Full Digital Flagship</span>
                      <span className="text-[11px] text-[var(--color-fg-muted)] block mt-1">Brand identity, 3D WebGL &amp; headless stack</span>
                      <span className="text-xs font-mono font-bold text-[var(--color-action-primary)] block mt-2">from $65,000</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedScope('spatial')}
                      className={`p-4 rounded-xl text-left border transition-all ${
                        selectedScope === 'spatial'
                          ? 'border-[var(--color-action-primary)] bg-[var(--color-action-primary)]/10 ring-2 ring-[var(--color-action-primary)]/20'
                          : 'border-[var(--color-border-default)] bg-[var(--color-bg-default)]'
                      }`}
                    >
                      <span className="text-xs font-bold block text-[var(--color-fg-default)]">Spatial 3D &amp; Automotive OS</span>
                      <span className="text-[11px] text-[var(--color-fg-muted)] block mt-1">Custom shaders, physics &amp; embedded runtimes</span>
                      <span className="text-xs font-mono font-bold text-[var(--color-action-primary)] block mt-2">from $85,000</span>
                    </button>
                  </div>
                </div>

                {/* Timeline Selection */}
                <div className="space-y-3">
                  <label className="text-xs font-mono uppercase text-[var(--color-fg-muted)] font-bold">
                    2. Delivery Cadence
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedTimeline('full')}
                      className={`flex-1 p-3.5 rounded-xl border text-left transition-all ${
                        selectedTimeline === 'full'
                          ? 'border-[var(--color-action-primary)] bg-[var(--color-action-primary)]/10'
                          : 'border-[var(--color-border-default)] bg-[var(--color-bg-default)]'
                      }`}
                    >
                      <span className="text-xs font-bold block">Standard Comprehensive Sprint (8–12 Weeks)</span>
                      <span className="text-[10px] text-[var(--color-fg-muted)] font-mono">Standard Studio Allocation</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedTimeline('sprint')}
                      className={`flex-1 p-3.5 rounded-xl border text-left transition-all ${
                        selectedTimeline === 'sprint'
                          ? 'border-[var(--color-action-primary)] bg-[var(--color-action-primary)]/10'
                          : 'border-[var(--color-border-default)] bg-[var(--color-bg-default)]'
                      }`}
                    >
                      <span className="text-xs font-bold block">Accelerated Velocity Sprint (4–6 Weeks)</span>
                      <span className="text-[10px] text-amber-500 font-mono">+25% Dedicated Concurrent Engineering</span>
                    </button>
                  </div>
                </div>

                {/* Investment Estimate & Inquiry Dispatch */}
                <div className="p-6 rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-bg-default)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-mono uppercase text-[var(--color-fg-muted)] font-semibold">
                      Target Estimated Investment
                    </span>
                    <p className="text-2xl sm:text-3xl font-extrabold font-mono text-[var(--color-fg-default)]">
                      {formatCurrency(estimatedInvestment)}
                    </p>
                    <span className="text-[11px] text-[var(--color-fg-muted)]">Includes architectural handover, IP transfer, and 60 days post-launch support.</span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="px-4 py-3 rounded-lg text-xs font-bold border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] hover:bg-[var(--color-bg-default)] transition-colors flex items-center justify-center gap-2"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>{copiedEmail ? 'Email Copied!' : 'Copy Direct Email'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleSendInquiry}
                      style={getPrimaryBtnStyle()}
                      className="px-6 py-3 text-xs font-bold shadow-md hover:opacity-95 flex items-center justify-center gap-2"
                    >
                      {inquirySent ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <ArrowRight className="w-4 h-4" />}
                      <span>{inquirySent ? 'Inquiry Transmitted!' : 'Dispatch Project Scope'}</span>
                    </button>
                  </div>
                </div>

                {inquirySent && (
                  <p className="text-xs text-emerald-600 font-mono text-center pt-1">
                    ✓ Project scope received. Partner director will review technical requirements and reply within 24 hours.
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* 10. Components & Type Specimen (Doc 02 §4.3 mandatory) */}
        <GenreOfferings content={content} />
        {(isEnabled('components') || isEnabled('componentsShowcase')) && <ComponentsShowcase />}
        <TypeSpecimen />
      </main>

      {/* 11. Elite Studio Footer */}
      <footer className="w-full py-16 px-6 bg-[var(--color-bg-default)] text-[var(--color-fg-muted)] text-xs border-t border-[var(--color-border-default)]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[var(--color-action-primary)] text-[var(--color-action-primary-fg)] flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span className="font-mono font-extrabold text-sm tracking-tight text-[var(--color-fg-default)]">
                  {brandName}
                </span>
              </div>
              <p className="text-[11px] max-w-sm leading-relaxed">
                Independent creative engineering practice operating globally across Zurich, Tokyo, and San Francisco.
              </p>
              <div className="flex gap-4 text-[10px] font-mono text-[var(--color-fg-muted)]">
                <span>ZURICH 11:45</span>
                <span>TOKYO 19:45</span>
                <span>SAN FRANCISCO 02:45</span>
              </div>
            </div>

            <div className="space-y-3">
              <span className="font-bold text-[var(--color-fg-default)] uppercase tracking-wider text-[10px] font-mono">Works</span>
              <ul className="space-y-2 text-[11px]">
                <li><a href="#works" className="hover:text-[var(--color-fg-default)] transition-colors">Nebula OS (Automotive)</a></li>
                <li><a href="#works" className="hover:text-[var(--color-fg-default)] transition-colors">Aether Sound Flagship</a></li>
                <li><a href="#works" className="hover:text-[var(--color-fg-default)] transition-colors">Solaria Telemetry System</a></li>
                <li><a href="#works" className="hover:text-[var(--color-fg-default)] transition-colors">Chronicle Journal Engine</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <span className="font-bold text-[var(--color-fg-default)] uppercase tracking-wider text-[10px] font-mono">Disciplines</span>
              <ul className="space-y-2 text-[11px]">
                <li><a href="#capabilities" className="hover:text-[var(--color-fg-default)] transition-colors">Spatial 3D &amp; Shaders</a></li>
                <li><a href="#capabilities" className="hover:text-[var(--color-fg-default)] transition-colors">Design Systems &amp; OKLCH</a></li>
                <li><a href="#capabilities" className="hover:text-[var(--color-fg-default)] transition-colors">Brand &amp; Creative Direction</a></li>
                <li><a href="#capabilities" className="hover:text-[var(--color-fg-default)] transition-colors">Front-End Engineering</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <span className="font-bold text-[var(--color-fg-default)] uppercase tracking-wider text-[10px] font-mono">Connect</span>
              <ul className="space-y-2 text-[11px]">
                <li><a href="#inquiry" className="hover:text-[var(--color-fg-default)] transition-colors">Inquiry Terminal</a></li>
                <li><a href="#endorsements" className="hover:text-[var(--color-fg-default)] transition-colors">Press &amp; Accolades</a></li>
                <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-fg-default)] transition-colors">GitHub Architecture</a></li>
                <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-fg-default)] transition-colors">Studio Dispatches</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[var(--color-border-default)] flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono">
            <span>&copy; {new Date().getFullYear()} {brandName}. All rights reserved.</span>
            <div className="flex gap-4">
              <span>TypeScript + Three.js</span>
              <span>WCAG 2.2 AAA Verified</span>
              <span>Carbon Neutral Studio</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
