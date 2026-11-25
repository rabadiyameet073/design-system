import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  TrendingUp,
  Building2,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  Landmark,
  Scale,
  Percent,
  CreditCard,
  Globe,
  Zap,
  ChevronDown,
  ChevronUp,
  FileText,
  Sliders,
  ExternalLink,
  Users,
  KeyRound,
  Check,
  Sparkles,
  ArrowUpRight,
  Clock,
  Layers,
  BarChart3
} from 'lucide-react';
import {
  ComponentsShowcase,
  TypeSpecimen
} from '../sections';
import { TemplateProps } from './index';

export const FinanceTemplate: React.FC<TemplateProps> = ({
  brandName = 'STRATA Wealth & Global Treasury',
  headline,
  subtitle,
  badge = 'Institutional Grade Treasury & Custody',
  heroImage = '/src/assets/images/preview_saas_metrics_1792316645998.jpg',
  genreId = '',
  components,
  buttonStyle
}) => {
  const [balanceAmount, setBalanceAmount] = useState(1250000);
  const [activeYieldTab, setActiveYieldTab] = useState<'liquid' | 'term'>('liquid');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [spendCurrency, setSpendCurrency] = useState<'USD' | 'EUR' | 'GBP'>('USD');

  const enabled = components?.enabledComponents;
  const isSectionEnabled = (section: string) => {
    if (section === 'hero' || section === 'announcement' || section === 'components' || section === 'type') {
      return true;
    }
    if (!enabled || enabled.length === 0) return true;

    const moduleMapping: Record<string, string[]> = {
      stats: ['metrics-row', 'stats', 'kpi', 'metrics'],
      calculator: ['pricing-matrix', 'calculator', 'pricing', 'pricingTable'],
      cards: ['product-card', 'cards', 'features', 'featureGrid'],
      vaults: ['pricing-matrix', 'vaults', 'pricing', 'pricingTable'],
      security: ['metrics-row', 'security', 'features', 'spec-table'],
      testimonials: ['reviews-grid', 'testimonials', 'reviews'],
      faq: ['curriculum-accordion', 'faq', 'accordion'],
      cta: ['newsletter', 'cta', 'banner']
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
    transition: 'filter 0.2s ease'
  });

  // Rates
  const LIQUID_APY = 0.0518; // 5.18%
  const TERM_APY = 0.0542; // 5.42%
  const TRADITIONAL_RATE = 0.0002; // 0.02%

  const activeRate = activeYieldTab === 'liquid' ? LIQUID_APY : TERM_APY;
  const annualYield = Math.round(balanceAmount * activeRate);
  const monthlyYield = Math.round(annualYield / 12);
  const traditionalYield = Math.round(balanceAmount * TRADITIONAL_RATE);
  const extraYieldEarned = annualYield - traditionalYield;

  const formatCurrency = (num: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);

  const TRUSTED_FIRMS = [
    { name: 'SYNTHETICA AI', sector: 'Frontier Compute' },
    { name: 'HORIZON DYNAMICS', sector: 'Aerospace Systems' },
    { name: 'SOLARIA ENERGY', sector: 'Clean Grid' },
    { name: 'VORTEX BIO', sector: 'Gene Therapeutics' },
    { name: 'MONOLITH ROBOTICS', sector: 'Automation Labs' },
    { name: 'KINETIC MOBILITY', sector: 'Autonomous Fleet' }
  ];

  const FAQ_ITEMS = [
    {
      q: 'How does the $5,000,000 FDIC deposit insurance sweep work?',
      a: 'STRATA partners with a network of over 20 programmatic FDIC-insured depository institutions. When you deposit operating funds, our algorithmic cash sweep automatically allocates balances above standard limits across partner banks in increments under $250,000. You maintain a single unified account statement while securing full aggregate FDIC coverage up to $5M.'
    },
    {
      q: 'What is the liquidity timeline for automated T-Bill investments?',
      a: 'Treasury funds invested in short-duration 30-day and 90-day US Government T-Bills settle with T+1 same-day or next-day liquidity. For urgent payroll or operating obligations, STRATA provides an instant automated collateral credit line against your Treasury portfolio with zero liquidation penalty.'
    },
    {
      q: 'Are there wire transfer fees, ACH limits, or monthly account minimums?',
      a: 'No. STRATA Prime accounts feature unlimited free domestic Fedwire transfers, free outgoing ACH payments, and zero foreign transaction fees. There are no monthly account maintenance fees or minimum holding requirements.'
    },
    {
      q: 'How does corporate card spend management integrate with our ERP?',
      a: 'Physical and virtual STRATA Corporate Cards sync in real time with NetSuite, QuickBooks Online, Xero, and Brex/Ramp export formats. Smart receipts are matched via automated OCR, and custom approval workflows can be configured for multi-tier management sign-off.'
    },
    {
      q: 'What cryptographic safeguards protect against unauthorized withdrawals?',
      a: 'All wire authorizations require WebAuthn/FIDO2 hardware security keys (e.g. YubiKey) or biometric authentication. Companies can enforce multi-sig dual-custody rules requiring two independent officers to approve any external transaction exceeding designated dollar thresholds.'
    },
    {
      q: 'Can international entities open multi-currency treasury accounts?',
      a: 'Yes. Eligible US and non-US corporate entities can hold native multi-currency accounts in USD, EUR, GBP, SGD, and JPY with localized IBAN and routing details, locking in wholesale institutional FX spreads at 0.15% above mid-market.'
    }
  ];

  return (
    <div className="w-full min-h-screen flex flex-col bg-[var(--color-bg-default)] text-[var(--color-fg-default)] font-sans antialiased selection:bg-[var(--color-action-primary)] selection:text-[var(--color-action-primary-fg)]">
      {/* 1. Regulatory & Compliance Banner */}
      {isEnabled('announcement') && (
        <aside
          aria-label="Regulatory Notice"
          className="w-full py-2.5 px-4 bg-[var(--color-action-primary)] text-[var(--color-action-primary-fg)] text-xs text-center font-medium tracking-wide flex items-center justify-center gap-2 border-b border-black/10"
        >
          <ShieldCheck className="w-4 h-4 shrink-0 opacity-90" />
          <span className="truncate">
            Member FDIC · Insured up to $5,000,000 via automated sweep networks · SEC Registered Investment Advisor · SOC 1 & 2 Type II Certified
          </span>
        </aside>
      )}

      {/* 2. Institutional Header */}
      <header className="w-full border-b sticky top-0 z-40 backdrop-blur-md bg-[var(--color-bg-default)]/90 border-[var(--color-border-default)]">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--color-action-primary)] text-[var(--color-action-primary-fg)] flex items-center justify-center shadow-md">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight font-mono">{brandName}</span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-mono uppercase tracking-widest text-[var(--color-fg-muted)] border-l pl-2 border-[var(--color-border-default)]">
                Capital Reserve
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--color-fg-muted)]">
            <a href="#yield" className="hover:text-[var(--color-fg-default)] transition-colors">Treasury Yield</a>
            <a href="#cards" className="hover:text-[var(--color-fg-default)] transition-colors">Corporate Cards</a>
            <a href="#vaults" className="hover:text-[var(--color-fg-default)] transition-colors">Global Vaults</a>
            <a href="#security" className="hover:text-[var(--color-fg-default)] transition-colors">Security</a>
            <a href="#faq" className="hover:text-[var(--color-fg-default)] transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="text-xs font-semibold px-3 py-2 text-[var(--color-fg-muted)] hover:text-[var(--color-fg-default)] transition-colors"
            >
              Client Login
            </button>
            <button
              type="button"
              style={getPrimaryBtnStyle()}
              className="px-4 py-2 text-xs font-bold shadow-sm hover:opacity-95"
            >
              Open Prime Account
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* 3. Hero Section */}
        {isEnabled('hero') && (
          <section className="relative w-full py-16 sm:py-24 px-6 border-b border-[var(--color-border-default)] overflow-hidden">
            {/* Ambient subtle glow */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[360px] bg-[var(--color-action-primary)]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-6xl mx-auto space-y-10 relative z-10 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] text-xs font-mono font-medium text-[var(--color-action-primary)] shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{badge} · 5.18% APY Daily Compounding</span>
              </div>

              <h1
                className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.12]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {headline || 'The institutional financial engine for modern enterprise capital'}
              </h1>

              <p className="text-base sm:text-xl text-[var(--color-fg-muted)] max-w-2xl mx-auto font-normal leading-relaxed">
                {subtitle ||
                  'Maximize return on non-operating reserves, issue physical matte obsidian cards with 1.75% cashback, and automate multi-entity cash sweeps with zero wire fees.'}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <button
                  type="button"
                  style={getPrimaryBtnStyle()}
                  className="px-6 py-3.5 text-sm font-bold shadow-lg hover:opacity-95 flex items-center gap-2"
                >
                  <span>Open Institutional Account</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="px-6 py-3.5 text-sm font-semibold rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] text-[var(--color-fg-default)] hover:bg-[var(--color-bg-default)] transition-colors flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-[var(--color-fg-muted)]" />
                  <span>Review SOC 2 Audits</span>
                </button>
              </div>

              {/* Telemetry Dashboard Preview Mockup */}
              <div
                style={getCardStyle()}
                className="mt-12 p-6 sm:p-8 border shadow-2xl text-left max-w-4xl mx-auto backdrop-blur-xl relative"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[var(--color-border-default)]">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-fg-muted)]">
                      STRATA Prime Active Custody Terminal
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-[var(--color-fg-muted)]">
                    <span>STATUS: SECURE_ENCLAVE</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold">LIVE 5.18% APY</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-[var(--color-fg-muted)]">Total Liquidity Administered</span>
                    <p className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight">$24,850,210.42</p>
                    <span className="text-[11px] font-mono text-emerald-600 font-medium flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> +$107,352.90 earned past 30 days
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-mono text-[var(--color-fg-muted)]">Government T-Bill Allocation</span>
                    <p className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight">85.4%</p>
                    <span className="text-[11px] font-mono text-[var(--color-fg-muted)]">
                      Backed 100% by US Sovereign Credit
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-mono text-[var(--color-fg-muted)]">Active Cash Sweeps</span>
                    <p className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight">$5,000,000</p>
                    <span className="text-[11px] font-mono text-[var(--color-action-primary)] font-medium">
                      Fully insured across 20 partner banks
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 4. Trusted Firms Ticker */}
        <section className="w-full py-8 px-6 border-b border-[var(--color-border-default)] bg-[var(--color-bg-surface)]">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--color-fg-muted)] shrink-0">
              Enterprise Treasury Partner To:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 w-full text-center">
              {TRUSTED_FIRMS.map((firm, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <span className="text-xs font-bold tracking-tight text-[var(--color-fg-default)]">{firm.name}</span>
                  <span className="text-[10px] text-[var(--color-fg-muted)] font-mono">{firm.sector}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Key Institutional Stats Row */}
        {isEnabled('stats') && (
          <section className="w-full py-12 px-6 border-b border-[var(--color-border-default)]">
            <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-3xl sm:text-4xl font-extrabold font-mono text-[var(--color-fg-default)]">$14.8B+</span>
                <p className="text-xs font-medium text-[var(--color-fg-muted)] uppercase tracking-wider">Assets Under Administration</p>
              </div>
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-600">5.18% APY</span>
                <p className="text-xs font-medium text-[var(--color-fg-muted)] uppercase tracking-wider">Automated Treasury Yield</p>
              </div>
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-3xl sm:text-4xl font-extrabold font-mono text-[var(--color-fg-default)]">$5,000,000</span>
                <p className="text-xs font-medium text-[var(--color-fg-muted)] uppercase tracking-wider">FDIC Sweep Insurance Cap</p>
              </div>
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-3xl sm:text-4xl font-extrabold font-mono text-[var(--color-fg-default)]">&lt;600ms</span>
                <p className="text-xs font-medium text-[var(--color-fg-muted)] uppercase tracking-wider">Internal Ledger Settlement</p>
              </div>
            </div>
          </section>
        )}

        {/* 6. INTERACTIVE 5.18% TREASURY YIELD SIMULATOR */}
        {isEnabled('calculator') && (
          <section id="yield" className="w-full py-18 px-6 border-b border-[var(--color-border-default)] bg-[var(--color-bg-surface)]">
            <div className="max-w-5xl mx-auto space-y-10">
              <div className="text-center space-y-3">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--color-action-primary)]">
                  Automated Yield Engine
                </span>
                <h2
                  className="text-2xl sm:text-4xl font-bold tracking-tight text-[var(--color-fg-default)]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Simulate your company&apos;s annual treasury returns
                </h2>
                <p className="text-sm text-[var(--color-fg-muted)] max-w-xl mx-auto">
                  Idle capital automatically sweeps into short-duration US Government Treasury bills with same-day liquidity and daily compounding interest.
                </p>

                {/* Yield Strategy Toggle */}
                <div className="inline-flex p-1 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-default)] text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => setActiveYieldTab('liquid')}
                    className={`px-4 py-2 rounded-lg font-bold transition-all ${
                      activeYieldTab === 'liquid'
                        ? 'bg-[var(--color-action-primary)] text-[var(--color-action-primary-fg)] shadow-sm'
                        : 'text-[var(--color-fg-muted)] hover:text-[var(--color-fg-default)]'
                    }`}
                  >
                    Liquid Sweeps (5.18% APY)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveYieldTab('term')}
                    className={`px-4 py-2 rounded-lg font-bold transition-all ${
                      activeYieldTab === 'term'
                        ? 'bg-[var(--color-action-primary)] text-[var(--color-action-primary-fg)] shadow-sm'
                        : 'text-[var(--color-fg-muted)] hover:text-[var(--color-fg-default)]'
                    }`}
                  >
                    Fixed 90-Day Notes (5.42% APY)
                  </button>
                </div>
              </div>

              {/* Interactive Simulator Box */}
              <div
                style={getCardStyle()}
                className="p-6 sm:p-10 border shadow-xl space-y-8 bg-[var(--color-bg-default)]"
              >
                {/* Balance Slider */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-[var(--color-fg-muted)] font-bold">
                      Operating Reserve Balance
                    </span>
                    <span className="text-3xl sm:text-4xl font-extrabold font-mono text-[var(--color-fg-default)]">
                      {formatCurrency(balanceAmount)}
                    </span>
                  </div>

                  <input
                    type="range"
                    min={100000}
                    max={10000000}
                    step={50000}
                    value={balanceAmount}
                    onChange={e => setBalanceAmount(Number(e.target.value))}
                    className="w-full h-3 rounded-lg appearance-none cursor-pointer bg-[var(--color-bg-surface)] accent-[var(--color-action-primary)]"
                  />

                  <div className="flex justify-between text-xs font-mono text-[var(--color-fg-muted)]">
                    <span>$100,000 (Seed)</span>
                    <span>$2,500,000 (Series A)</span>
                    <span>$5,000,000 (Series B)</span>
                    <span>$10,000,000+ (Growth)</span>
                  </div>
                </div>

                {/* Outcome Comparison Matrix */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  {/* STRATA Yield */}
                  <div
                    style={getCardStyle()}
                    className="p-6 border space-y-3 relative overflow-hidden bg-[var(--color-bg-surface)] border-[var(--color-action-primary)]/40"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-action-primary)]">
                        STRATA Programmatic Treasury
                      </span>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600">
                        {(activeRate * 100).toFixed(2)}% APY
                      </span>
                    </div>

                    <div className="space-y-1">
                      <p className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-600">
                        +{formatCurrency(annualYield)} / year
                      </p>
                      <p className="text-xs font-mono text-[var(--color-fg-muted)]">
                        ≈ {formatCurrency(monthlyYield)} per month in passive yield
                      </p>
                    </div>

                    <ul className="text-xs text-[var(--color-fg-muted)] space-y-1.5 pt-2 border-t border-[var(--color-border-default)]">
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Daily interest accrual with automated reinvestment</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Instant liquidity for payroll and vendor obligations</span>
                      </li>
                    </ul>
                  </div>

                  {/* Traditional Bank Comparison */}
                  <div
                    style={getCardStyle()}
                    className="p-6 border space-y-3 bg-[var(--color-bg-surface)]/60 opacity-90"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-fg-muted)]">
                        Traditional Commercial Bank
                      </span>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-black/5 text-[var(--color-fg-muted)]">
                        0.02% APY
                      </span>
                    </div>

                    <div className="space-y-1">
                      <p className="text-3xl sm:text-4xl font-extrabold font-mono text-[var(--color-fg-muted)]">
                        +{formatCurrency(traditionalYield)} / year
                      </p>
                      <p className="text-xs font-mono text-rose-500 font-semibold">
                        You lose {formatCurrency(extraYieldEarned)} every year
                      </p>
                    </div>

                    <ul className="text-xs text-[var(--color-fg-muted)] space-y-1.5 pt-2 border-t border-[var(--color-border-default)]">
                      <li className="flex items-center gap-2 text-rose-500">
                        <span className="text-xs font-mono font-bold">✕</span>
                        <span>$250k single-bank cap exposes reserves to risk</span>
                      </li>
                      <li className="flex items-center gap-2 text-rose-500">
                        <span className="text-xs font-mono font-bold">✕</span>
                        <span>Manual wire delays and costly foreign exchange fees</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[var(--color-fg-muted)]">
                  <span>* Yield rates subject to Federal Reserve target range changes. T-Bills held in segregated client custody.</span>
                  <button
                    type="button"
                    style={getPrimaryBtnStyle()}
                    className="px-5 py-2.5 text-xs font-bold"
                  >
                    Capture This Yield Now
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 7. Corporate Card & Spend Management Bento Grid */}
        {isEnabled('cards') && (
          <section id="cards" className="w-full py-18 px-6 border-b border-[var(--color-border-default)]">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-2 max-w-2xl mx-auto">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--color-action-primary)]">
                  Physical & Virtual Spend Engine
                </span>
                <h2
                  className="text-2xl sm:text-4xl font-bold tracking-tight text-[var(--color-fg-default)]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Matte obsidian cards with 1.75% unlimited cashback
                </h2>
                <p className="text-sm text-[var(--color-fg-muted)]">
                  Eliminate manual receipt chasing with programmatic card controls, custom per-employee limits, and real-time ERP reconciliation.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Bento Card 1: Physical Titanium Card */}
                <div
                  style={getCardStyle()}
                  className="p-8 border shadow-sm space-y-6 md:col-span-2 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--color-action-primary)]">
                        Matte Obsidian Card
                      </span>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600">
                        1.75% UNLIMITED CASHBACK
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                      Designed for executive teams and high-velocity engineering spend
                    </h3>
                    <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] leading-relaxed">
                      Heavyweight physical cards paired with instant virtual cards for AWS, OpenAI tokens, and software SaaS tooling. Zero international transaction fees globally.
                    </p>
                  </div>

                  {/* Visual Card Display */}
                  <div className="p-6 rounded-2xl bg-neutral-900 text-neutral-100 font-mono space-y-6 shadow-xl border border-neutral-800">
                    <div className="flex items-center justify-between text-xs text-neutral-400">
                      <span className="font-bold tracking-wider">{brandName.toUpperCase()} PRIME</span>
                      <CreditCard className="w-5 h-5 text-neutral-300" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-lg tracking-widest text-neutral-200">•••• •••• •••• 9204</span>
                      <div className="flex justify-between text-[10px] text-neutral-400 pt-1">
                        <span>EXECUTIVE CORP CARD</span>
                        <span>EXP 08/29</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bento Card 2: Multi-Currency Global Accounts */}
                <div
                  style={getCardStyle()}
                  className="p-8 border shadow-sm space-y-6 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-action-primary)]/10 text-[var(--color-action-primary)] flex items-center justify-center">
                      <Globe className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold tracking-tight">Multi-Currency Global Vaults</h3>
                    <p className="text-xs text-[var(--color-fg-muted)] leading-relaxed">
                      Collect, hold, and disburse in USD, EUR, GBP, and SGD with native domestic account details.
                    </p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="flex gap-2">
                      {(['USD', 'EUR', 'GBP'] as const).map(curr => (
                        <button
                          key={curr}
                          type="button"
                          onClick={() => setSpendCurrency(curr)}
                          className={`flex-1 py-1.5 text-xs font-mono font-bold rounded-lg border transition-all ${
                            spendCurrency === curr
                              ? 'bg-[var(--color-action-primary)] text-[var(--color-action-primary-fg)] border-[var(--color-action-primary)]'
                              : 'bg-[var(--color-bg-default)] text-[var(--color-fg-muted)] border-[var(--color-border-default)]'
                          }`}
                        >
                          {curr}
                        </button>
                      ))}
                    </div>
                    <div className="p-3 rounded-lg bg-[var(--color-bg-default)] border border-[var(--color-border-default)] text-xs font-mono space-y-1">
                      <div className="flex justify-between text-[var(--color-fg-muted)]">
                        <span>Local Routing:</span>
                        <span className="text-[var(--color-fg-default)] font-bold">IBAN ACTIVE</span>
                      </div>
                      <div className="flex justify-between text-[var(--color-fg-muted)]">
                        <span>FX Spread:</span>
                        <span className="text-emerald-600 font-bold">0.15% (Wholesale)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bento Card 3: Multi-Sig Governance */}
                <div
                  style={getCardStyle()}
                  className="p-8 border shadow-sm space-y-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-action-primary)]/10 text-[var(--color-action-primary)] flex items-center justify-center">
                    <Scale className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold tracking-tight">Multi-Sig Wire Governance</h3>
                  <p className="text-xs text-[var(--color-fg-muted)] leading-relaxed">
                    Set programmatic rules requiring dual-custody approval from two independent corporate officers for any transfer over $50,000.
                  </p>
                  <div className="p-3 rounded-xl bg-[var(--color-bg-default)] border border-[var(--color-border-default)] text-xs font-mono space-y-1.5">
                    <div className="flex items-center gap-2 text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Officer 1: Signed (YubiKey)</span>
                    </div>
                    <div className="flex items-center gap-2 text-amber-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Officer 2: Awaiting Biometric</span>
                    </div>
                  </div>
                </div>

                {/* Bento Card 4: Automated ERP & Bookkeeping */}
                <div
                  style={getCardStyle()}
                  className="p-8 border shadow-sm space-y-4 md:col-span-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-action-primary)]/10 text-[var(--color-action-primary)] flex items-center justify-center">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold tracking-tight">Zero-Touch ERP Synchronization</h3>
                      <p className="text-xs text-[var(--color-fg-muted)]">Real-time bi-directional ledger sync with NetSuite, QuickBooks, and Xero.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-mono">
                    <div className="p-2.5 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-default)] text-center">
                      <span className="font-bold text-[var(--color-fg-default)]">NetSuite</span>
                      <p className="text-[10px] text-emerald-600 font-semibold">2-Way Sync</p>
                    </div>
                    <div className="p-2.5 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-default)] text-center">
                      <span className="font-bold text-[var(--color-fg-default)]">QuickBooks</span>
                      <p className="text-[10px] text-emerald-600 font-semibold">Live Feed</p>
                    </div>
                    <div className="p-2.5 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-default)] text-center">
                      <span className="font-bold text-[var(--color-fg-default)]">Xero</span>
                      <p className="text-[10px] text-emerald-600 font-semibold">Direct Connect</p>
                    </div>
                    <div className="p-2.5 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-default)] text-center">
                      <span className="font-bold text-[var(--color-fg-default)]">CSV / API</span>
                      <p className="text-[10px] text-[var(--color-fg-muted)]">Custom Webhook</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 8. Institutional Vault Tiers */}
        {isEnabled('vaults') && (
          <section id="vaults" className="w-full py-18 px-6 border-b border-[var(--color-border-default)] bg-[var(--color-bg-surface)]">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-2 max-w-2xl mx-auto">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--color-action-primary)]">
                  Reserve Allocation Structure
                </span>
                <h2
                  className="text-2xl sm:text-4xl font-bold tracking-tight text-[var(--color-fg-default)]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Transparent fee schedule & custody tiers
                </h2>
                <p className="text-sm text-[var(--color-fg-muted)]">
                  No hidden wire markups, zero monthly maintenance fees. Institutional pricing with volume tiered bps.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Tier 1 */}
                <div
                  style={getCardStyle()}
                  className="p-8 border shadow-sm space-y-6 flex flex-col justify-between bg-[var(--color-bg-default)]"
                >
                  <div className="space-y-4">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-fg-muted)]">
                      Operating Prime
                    </span>
                    <div className="space-y-1">
                      <span className="text-3xl font-extrabold font-mono text-[var(--color-fg-default)]">$0 / mo</span>
                      <p className="text-xs text-[var(--color-fg-muted)]">For seed & venture-backed teams</p>
                    </div>
                    <ul className="text-xs text-[var(--color-fg-muted)] space-y-2.5 pt-4 border-t border-[var(--color-border-default)]">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Up to $1M automated FDIC insurance sweep</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>5.18% APY liquid treasury sweeps</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Unlimited physical & virtual cards (1.50% back)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Free domestic ACH & incoming wires</span>
                      </li>
                    </ul>
                  </div>
                  <button
                    type="button"
                    style={getPrimaryBtnStyle()}
                    className="w-full py-3 text-xs font-bold"
                  >
                    Open Prime
                  </button>
                </div>

                {/* Tier 2: Highlighted */}
                <div
                  style={getCardStyle()}
                  className="p-8 border-2 shadow-xl space-y-6 flex flex-col justify-between relative bg-[var(--color-bg-default)] border-[var(--color-action-primary)]"
                >
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[var(--color-action-primary)] text-[var(--color-action-primary-fg)] text-[10px] font-mono font-bold uppercase tracking-wider shadow-md">
                    Most Popular
                  </div>
                  <div className="space-y-4">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-action-primary)]">
                      Growth Treasury
                    </span>
                    <div className="space-y-1">
                      <span className="text-3xl font-extrabold font-mono text-[var(--color-fg-default)]">15 bps / yr</span>
                      <p className="text-xs text-[var(--color-fg-muted)]">For Series A–C companies ($2M+ reserves)</p>
                    </div>
                    <ul className="text-xs text-[var(--color-fg-muted)] space-y-2.5 pt-4 border-t border-[var(--color-border-default)]">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Up to $5M programmatic FDIC insurance sweep</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>5.18% APY sweeps + 5.42% APY 90-day T-Bills</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>1.75% unlimited cashback corporate cards</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Dedicated treasury director & Slack VIP channel</span>
                      </li>
                    </ul>
                  </div>
                  <button
                    type="button"
                    style={getPrimaryBtnStyle()}
                    className="w-full py-3 text-xs font-bold shadow-md"
                  >
                    Get Started
                  </button>
                </div>

                {/* Tier 3: Enterprise */}
                <div
                  style={getCardStyle()}
                  className="p-8 border shadow-sm space-y-6 flex flex-col justify-between bg-[var(--color-bg-default)]"
                >
                  <div className="space-y-4">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-fg-muted)]">
                      Enterprise & Family Office
                    </span>
                    <div className="space-y-1">
                      <span className="text-3xl font-extrabold font-mono text-[var(--color-fg-default)]">Custom bps</span>
                      <p className="text-xs text-[var(--color-fg-muted)]">For institutions with $25M+ balance</p>
                    </div>
                    <ul className="text-xs text-[var(--color-fg-muted)] space-y-2.5 pt-4 border-t border-[var(--color-border-default)]">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Custom segregated sub-accounts & multi-sig keys</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Direct primary dealer sovereign auction access</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Custom ERP webhook integration & dedicated API SLA</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Full quarterly board-ready financial packet</span>
                      </li>
                    </ul>
                  </div>
                  <button
                    type="button"
                    className="w-full py-3 text-xs font-bold rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] text-[var(--color-fg-default)] hover:bg-[var(--color-bg-default)] transition-colors"
                  >
                    Speak with Managing Director
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 9. Enterprise Security Architecture */}
        {isEnabled('security') && (
          <section id="security" className="w-full py-18 px-6 border-b border-[var(--color-border-default)]">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-2 max-w-2xl mx-auto">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--color-action-primary)]">
                  Cryptographic Defense
                </span>
                <h2
                  className="text-2xl sm:text-4xl font-bold tracking-tight text-[var(--color-fg-default)]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Institutional security standards built into every transaction
                </h2>
                <p className="text-sm text-[var(--color-fg-muted)]">
                  Zero compromise on asset safety. We deploy defense-in-depth across hardware enclaves, role privileges, and automated transaction anomaly screening.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div style={getCardStyle()} className="p-6 border space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--color-action-primary)]/10 text-[var(--color-action-primary)] flex items-center justify-center">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-[var(--color-fg-default)]">FIDO2 Hardware MFA</h4>
                  <p className="text-xs text-[var(--color-fg-muted)] leading-relaxed">
                    Mandatory WebAuthn and YubiKey biometric authentication prevents credential interception and phishing vectors.
                  </p>
                </div>

                <div style={getCardStyle()} className="p-6 border space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--color-action-primary)]/10 text-[var(--color-action-primary)] flex items-center justify-center">
                    <Lock className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-[var(--color-fg-default)]">256-Bit Ledger Encryption</h4>
                  <p className="text-xs text-[var(--color-fg-muted)] leading-relaxed">
                    All financial transaction logs and metadata are encrypted in transit and at rest using AES-256 GCM in HSM partitions.
                  </p>
                </div>

                <div style={getCardStyle()} className="p-6 border space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--color-action-primary)]/10 text-[var(--color-action-primary)] flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-[var(--color-fg-default)]">SOC 1 & 2 Type II</h4>
                  <p className="text-xs text-[var(--color-fg-muted)] leading-relaxed">
                    Independently audited annually by Big Four risk firms verifying internal operational controls and data integrity.
                  </p>
                </div>

                <div style={getCardStyle()} className="p-6 border space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--color-action-primary)]/10 text-[var(--color-action-primary)] flex items-center justify-center">
                    <Scale className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-[var(--color-fg-default)]">Segregated Asset Custody</h4>
                  <p className="text-xs text-[var(--color-fg-muted)] leading-relaxed">
                    Client funds are never commingled with operating capital and are held at regulated bankruptcy-remote custodian trusts.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 10. Verified CFO & Founder Testimonials */}
        {isEnabled('testimonials') && (
          <section className="w-full py-18 px-6 border-b border-[var(--color-border-default)] bg-[var(--color-bg-surface)]">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-2 max-w-2xl mx-auto">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--color-action-primary)]">
                  Verified Executive Acclaim
                </span>
                <h2
                  className="text-2xl sm:text-4xl font-bold tracking-tight text-[var(--color-fg-default)]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Trusted by finance leaders managing high-velocity capital
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div style={getCardStyle()} className="p-8 border space-y-4 bg-[var(--color-bg-default)]">
                  <p className="text-xs sm:text-sm text-[var(--color-fg-default)] italic leading-relaxed">
                    &ldquo;Moving our Series B reserves to STRATA generated over $240,000 in clean yield in our first year. The automated FDIC sweep network gives our board complete peace of mind.&rdquo;
                  </p>
                  <div className="pt-2 border-t border-[var(--color-border-default)] flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[var(--color-action-primary)]/20 text-[var(--color-action-primary)] font-bold text-xs flex items-center justify-center font-mono">
                      EC
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[var(--color-fg-default)]">Elena Chen</p>
                      <p className="text-[10px] text-[var(--color-fg-muted)] font-mono">CFO, Horizon Dynamics</p>
                    </div>
                  </div>
                </div>

                <div style={getCardStyle()} className="p-8 border space-y-4 bg-[var(--color-bg-default)]">
                  <p className="text-xs sm:text-sm text-[var(--color-fg-default)] italic leading-relaxed">
                    &ldquo;The physical matte cards, 1.75% cashback, and NetSuite two-way reconciliation cut our month-end financial close from four days to literally 35 minutes.&rdquo;
                  </p>
                  <div className="pt-2 border-t border-[var(--color-border-default)] flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[var(--color-action-primary)]/20 text-[var(--color-action-primary)] font-bold text-xs flex items-center justify-center font-mono">
                      MK
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[var(--color-fg-default)]">Marcus Vance</p>
                      <p className="text-[10px] text-[var(--color-fg-muted)] font-mono">VP Finance, Synthetica AI</p>
                    </div>
                  </div>
                </div>

                <div style={getCardStyle()} className="p-8 border space-y-4 bg-[var(--color-bg-default)]">
                  <p className="text-xs sm:text-sm text-[var(--color-fg-default)] italic leading-relaxed">
                    &ldquo;Setting up multi-sig approval workflows for seven-figure wire transactions was painless. STRATA delivers institutional treasury grade without the legacy bank bureaucracy.&rdquo;
                  </p>
                  <div className="pt-2 border-t border-[var(--color-border-default)] flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[var(--color-action-primary)]/20 text-[var(--color-action-primary)] font-bold text-xs flex items-center justify-center font-mono">
                      SA
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[var(--color-fg-default)]">Sofia Al-Mansoor</p>
                      <p className="text-[10px] text-[var(--color-fg-muted)] font-mono">Managing Partner, Solaria Capital</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 11. Compliance & Treasury FAQ Accordion */}
        {isEnabled('faq') && (
          <section id="faq" className="w-full py-18 px-6 border-b border-[var(--color-border-default)]">
            <div className="max-w-4xl mx-auto space-y-10">
              <div className="text-center space-y-2">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--color-action-primary)]">
                  Answers & Disclosures
                </span>
                <h2
                  className="text-2xl sm:text-4xl font-bold tracking-tight text-[var(--color-fg-default)]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Frequently asked financial questions
                </h2>
                <p className="text-xs sm:text-sm text-[var(--color-fg-muted)]">
                  Detailed information regarding deposit insurance, liquidity timelines, and account administration.
                </p>
              </div>

              <div className="space-y-4">
                {FAQ_ITEMS.map((item, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={idx}
                      style={getCardStyle()}
                      className="border overflow-hidden transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm hover:text-[var(--color-action-primary)] transition-colors"
                      >
                        <span>{item.q}</span>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 shrink-0 text-[var(--color-action-primary)]" />
                        ) : (
                          <ChevronDown className="w-4 h-4 shrink-0 text-[var(--color-fg-muted)]" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 text-xs text-[var(--color-fg-muted)] leading-relaxed border-t border-[var(--color-border-default)]">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* 12. Final Onboarding CTA Banner */}
        {isEnabled('cta') && (
          <section className="w-full py-20 px-6 border-b border-[var(--color-border-default)] bg-[var(--color-action-primary)] text-[var(--color-action-primary-fg)] relative overflow-hidden">
            <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
              <h2
                className="text-3xl sm:text-5xl font-extrabold tracking-tight"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Ready to optimize your company&apos;s balance sheet?
              </h2>
              <p className="text-sm sm:text-base opacity-90 max-w-xl mx-auto leading-relaxed">
                Open your institutional STRATA account in under 15 minutes. Start earning 5.18% APY on idle cash tomorrow.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <button
                  type="button"
                  className="px-8 py-3.5 rounded-lg text-sm font-bold bg-[var(--color-bg-default)] text-[var(--color-fg-default)] shadow-xl hover:opacity-95"
                >
                  Open Prime Account
                </button>
                <button
                  type="button"
                  className="px-8 py-3.5 rounded-lg text-sm font-bold border border-current text-[var(--color-action-primary-fg)] hover:bg-black/10 transition-colors"
                >
                  Schedule Private Briefing
                </button>
              </div>
            </div>
          </section>
        )}

        {/* 13. Component Showcase & Type Specimen (Doc 02 §4.3 mandatory) */}
        {(isEnabled('components') || isEnabled('componentsShowcase')) && <ComponentsShowcase />}
        <TypeSpecimen />
      </main>

      {/* 14. Institutional Footer */}
      <footer className="w-full py-16 px-6 bg-[var(--color-bg-default)] text-[var(--color-fg-muted)] text-xs border-t border-[var(--color-border-default)]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[var(--color-action-primary)] text-[var(--color-action-primary-fg)] flex items-center justify-center">
                  <Landmark className="w-3.5 h-3.5" />
                </div>
                <span className="font-extrabold text-sm tracking-tight text-[var(--color-fg-default)] font-mono">
                  {brandName}
                </span>
              </div>
              <p className="text-[11px] max-w-sm leading-relaxed">
                STRATA Technologies Inc. is a financial technology company, not an FDIC-insured bank. Banking services provided by partner depository networks, Members FDIC.
              </p>
              <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-600">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>All Systems Operational · 99.999% SLA</span>
              </div>
            </div>

            <div className="space-y-3">
              <span className="font-bold text-[var(--color-fg-default)] uppercase tracking-wider text-[10px] font-mono">Treasury Products</span>
              <ul className="space-y-2 text-[11px]">
                <li><a href="#yield" className="hover:text-[var(--color-fg-default)] transition-colors">Automated Yield (5.18%)</a></li>
                <li><a href="#yield" className="hover:text-[var(--color-fg-default)] transition-colors">Short-Term US T-Bills</a></li>
                <li><a href="#vaults" className="hover:text-[var(--color-fg-default)] transition-colors">$5M FDIC Sweep Network</a></li>
                <li><a href="#cards" className="hover:text-[var(--color-fg-default)] transition-colors">Corporate Cards (1.75%)</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <span className="font-bold text-[var(--color-fg-default)] uppercase tracking-wider text-[10px] font-mono">Security & Audits</span>
              <ul className="space-y-2 text-[11px]">
                <li><a href="#security" className="hover:text-[var(--color-fg-default)] transition-colors">SOC 2 Type II Report</a></li>
                <li><a href="#security" className="hover:text-[var(--color-fg-default)] transition-colors">FIDO2 Hardware MFA</a></li>
                <li><a href="#security" className="hover:text-[var(--color-fg-default)] transition-colors">Multi-Sig Custody Rules</a></li>
                <li><a href="#security" className="hover:text-[var(--color-fg-default)] transition-colors">Penetration Test Results</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <span className="font-bold text-[var(--color-fg-default)] uppercase tracking-wider text-[10px] font-mono">Compliance</span>
              <ul className="space-y-2 text-[11px]">
                <li><a href="#faq" className="hover:text-[var(--color-fg-default)] transition-colors">SEC RIA Disclosures</a></li>
                <li><a href="#faq" className="hover:text-[var(--color-fg-default)] transition-colors">FDIC Sweep Terms</a></li>
                <li><a href="#faq" className="hover:text-[var(--color-fg-default)] transition-colors">Privacy Policy</a></li>
                <li><a href="#faq" className="hover:text-[var(--color-fg-default)] transition-colors">Electronic Fund Transfer</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[var(--color-border-default)] flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono">
            <span>&copy; {new Date().getFullYear()} {brandName}. All rights reserved.</span>
            <div className="flex gap-4">
              <span>Member FDIC Sweep</span>
              <span>SIPC Insured Custody</span>
              <span>FinCEN Registered MSB</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
