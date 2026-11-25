import React, { useState } from 'react';
import { TemplateProps } from './index';
import { ContentItem, ResolvedGenreContent } from '../genres/genreContent';
import {
  ComponentsShowcase,
  TypeSpecimen
} from '../sections';
import {
  Sparkles,
  ShieldCheck,
  Truck,
  RefreshCw,
  ArrowRight,
  CheckCircle2,
  Gift,
  ShoppingBag,
  Star,
  Volume2,
  Sliders,
  Cpu,
  Layers,
  BatteryCharging,
  Wifi,
  ChevronDown,
  ChevronUp,
  Check,
  Plus,
  Play,
  Headphones,
  RotateCcw,
  Zap,
  SlidersHorizontal,
  Award,
  Radio
} from 'lucide-react';

interface ProductItem {
  id: string;
  name: string;
  tagline: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  badge?: string;
  category: string;
  specs: string[];
  image: string;
  colorways: { name: string; hex: string }[];
}

const FLAGSHIP_PRODUCTS: ProductItem[] = [
  {
    id: 'aether-pro-headphones',
    name: 'Aether Pro Planar Wireless',
    tagline: '50mm Planar Magnetic Drivers · Adaptive ANC · 65h Battery',
    price: 349,
    originalPrice: 399,
    rating: 5.0,
    reviewsCount: 1420,
    badge: 'Flagship Edition',
    category: 'headphones',
    specs: ['5Hz – 48kHz Frequency', '<0.02% THD', 'LDAC & aptX Lossless', '235g Titanium'],
    image: '/src/assets/images/preview_saas_metrics_1792316645998.jpg',
    colorways: [
      { name: 'Titanium Silver', hex: 'var(--color-neutral-300)' },
      { name: 'Space Obsidian', hex: 'var(--color-neutral-900)' },
      { name: 'Desert Sand', hex: 'var(--color-brand-400)' }
    ]
  },
  {
    id: 'aether-studio-earphones',
    name: 'Aether Studio In-Ear Reference',
    tagline: 'Dual Balanced Armature + Dynamic Hybrid · Zero Latency',
    price: 189,
    rating: 4.9,
    reviewsCount: 890,
    badge: 'Studio Pick',
    category: 'earphones',
    specs: ['Custom Quad Drivers', 'IPX5 Water Resistant', '40h Total Playtime', 'MagSafe Case'],
    image: '/src/assets/images/preview_ecommerce_ceramics_1792316645917.jpg',
    colorways: [
      { name: 'Matte Graphite', hex: 'var(--color-neutral-700)' },
      { name: 'Arctic Ceramic', hex: 'var(--color-neutral-100)' }
    ]
  },
  {
    id: 'aether-dac-streamer',
    name: 'Aether Precision Audio DAC & Amp',
    tagline: 'Discrete Dual R-2R Ladder Network · 32-Bit / 768kHz DSD512',
    price: 420,
    rating: 5.0,
    reviewsCount: 380,
    badge: 'Audiophile Spec',
    category: 'hardware',
    specs: ['CNC Billet Chassis', 'Balanced 4.4mm + XLR', '130dB SNR Output', 'OLED Scope'],
    image: '/src/assets/images/preview_editorial_arch_1792316647413.jpg',
    colorways: [
      { name: 'Anodized Black', hex: 'var(--color-neutral-950)' },
      { name: 'Silver Machined', hex: 'var(--color-neutral-200)' }
    ]
  },
  {
    id: 'aether-charging-dock',
    name: 'Aether MagSafe Studio Stand',
    tagline: 'Weighted Solid Brass Base with Fast Qi2 Wireless Charging',
    price: 85,
    rating: 4.8,
    reviewsCount: 650,
    badge: 'Essential Companion',
    category: 'accessories',
    specs: ['Solid Brass Core', '15W Fast Charge', 'Anti-Slip Micro-Suction', 'Braided Cable'],
    image: '/src/assets/images/hero_founder_studio_1792316645323.jpg',
    colorways: [
      { name: 'Raw Brass & Oak', hex: 'var(--color-accent-600)' },
      { name: 'Blackened Steel', hex: 'var(--color-neutral-800)' }
    ]
  }
];

const FLAGSHIP_PRESS = [
  { outlet: 'WIRED', quote: 'The new absolute benchmark in wireless planar acoustic engineering.' },
  { outlet: 'THE VERGE', quote: '9.6/10 — Impeccable industrial design with surgical acoustic depth.' },
  { outlet: 'WALLPAPER*', quote: 'Winner: Best Hardware Product Design Award 2026.' },
  { outlet: 'RED DOT', quote: 'Best of the Best: Excellence in Minimalist Consumer Hardware.' },
  { outlet: 'FAST COMPANY', quote: 'A masterclass in stripping away the unnecessary and elevating sound.' }
];

const FLAGSHIP_PILLARS = [
  {
    id: 'drivers',
    icon: Volume2,
    tabLabel: 'Planar Transducers',
    headline: '50mm Ultra-Thin Planar Beryllium Diaphragm',
    desc: 'Unlike traditional cone drivers that warp under dynamic peaks, our ultra-thin planar membrane moves uniformly in a push-pull magnetic field. The result is zero acoustic distortion, surgical transient speed, and bass extension down to 5Hz.',
    stats: [
      { label: 'Diaphragm Thickness', value: '1.2 μm' },
      { label: 'Frequency Span', value: '5Hz – 48kHz' },
      { label: 'Harmonic Distortion', value: '<0.018%' }
    ]
  },
  {
    id: 'anc',
    icon: Cpu,
    tabLabel: 'Neural Hybrid ANC',
    headline: '6-Mic Environmental Sampling with Real-Time Cancellation',
    desc: 'Dual acoustic processors calculate counter-phase wave frequencies 400,000 times per second. Street noise, cabin pressure, and office chatter disappear, leaving only pristine, uncolored musical detail.',
    stats: [
      { label: 'Noise Attenuation', value: '-42 dB' },
      { label: 'Sampling Rate', value: '400 kHz' },
      { label: 'Microphone Array', value: '6 MEMS' }
    ]
  },
  {
    id: 'materials',
    icon: Layers,
    tabLabel: 'Titanium & Italian Leather',
    headline: 'Aerospace-Grade Grade 5 Titanium Chassis',
    desc: 'Each headband is precision CNC-milled from titanium alloy for flex endurance without clamping pressure. The earcups are cushioned in slow-rebound memory foam wrapped in supple, breathable Italian lambskin.',
    stats: [
      { label: 'Total Weight', value: '235 grams' },
      { label: 'Tensile Strength', value: '880 MPa' },
      { label: 'Clamping Force', value: '4.2 N (Optimal)' }
    ]
  },
  {
    id: 'battery',
    icon: BatteryCharging,
    tabLabel: 'Continuous Playtime',
    headline: '65 Hours of High-Fidelity Playback on a Single Charge',
    desc: 'State-of-the-art solid-state battery chemistry provides unprecedented stamina. A rapid 10-minute USB-C quick charge yields 8 hours of active playback, with universal Qi wireless charging on any MagSafe surface.',
    stats: [
      { label: 'Total Playtime (ANC On)', value: '65 Hours' },
      { label: '10-Min Fast Charge', value: '8 Hours' },
      { label: 'Standby Longevity', value: '90 Days' }
    ]
  }
];

const FLAGSHIP_FAQS = [
  {
    q: 'How does the 30-Day In-Home Acoustic Audition work?',
    a: 'Experience Aether gear in your personal listening environment. If you are not thoroughly captivated by the soundstage and comfort within 30 days, return it in original packaging for a 100% full refund with complimentary insured return shipping.'
  },
  {
    q: 'What audio codecs and wireless protocols are supported?',
    a: 'All Aether wireless hardware supports Bluetooth 5.4 LE Audio, LDAC (up to 990kbps 24-bit/96kHz), aptX Lossless, AAC, and SBC. It also features a zero-latency USB-C direct DAC connection for pure uncompressed studio monitoring.'
  },
  {
    q: 'Can I connect to multiple devices simultaneously?',
    a: 'Yes. Advanced Multi-Point Bluetooth enables seamless concurrent connection between your laptop, tablet, and smartphone with instant, zero-click audio source switching.'
  },
  {
    q: 'What is covered under the 2-Year Full Hardware Warranty?',
    a: 'Our factory warranty covers all transducers, internal circuits, battery degradation below 80%, Bluetooth antennas, and structural chassis components with free repair or replacement.'
  }
];

export const CommerceTemplate: React.FC<TemplateProps> = ({
  content,
  brandName: brandNameProp,
  headline: headlineProp,
  subtitle: subtitleProp,
  badge: badgeProp,
  heroImage,
  genreId,
  components,
  buttonStyle
}) => {
  // Genre-resolved copy replaces the flagship Aether arrays when supplied.
  // With no content prop the original flagship experience is preserved.
  const brandName = content?.brandName || brandNameProp || 'AETHER Sound & Precision Gear';
  const headline = headlineProp || content?.headline;
  const subtitle = subtitleProp || content?.subtitle;
  const badge = content?.badge || badgeProp || 'Gen-3 Acoustic Reference';
  const effectiveHeroImage = heroImage || content?.heroImage;
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedColorway, setSelectedColorway] = useState<number>(0);
  const [activePillarIndex, setActivePillarIndex] = useState<number>(0);
  const [cartCount, setCartCount] = useState<number>(2);
  const [addedToast, setAddedToast] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [emailInput, setEmailInput] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const enabled = components?.enabledComponents;
  const isSectionEnabled = (section: string) => {
    if (section === 'hero' || section === 'announcement' || section === 'components' || section === 'type') {
      return true;
    }
    if (!enabled || enabled.length === 0) return true;

    const moduleMapping: Record<string, string[]> = {
      products: ['product-card', 'products', 'productGrid', 'catalog', 'hardware'],
      catalog: ['product-card', 'products', 'catalog'],
      specs: ['metrics-row', 'specs', 'features', 'spec-table', 'feature-grid'],
      matrix: ['pricing-matrix', 'matrix', 'pricing', 'features', 'spec-table'],
      reviews: ['reviews-grid', 'reviews', 'testimonials', 'customer-review'],
      marquee: ['reviews-grid', 'marquee', 'press', 'reviews'],
      faq: ['curriculum-accordion', 'faq', 'accordion'],
      newsletter: ['newsletter', 'leadCapture', 'cta', 'vip']
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

  const itemToProduct = (raw: ContentItem, index: number): ProductItem => ({
    id: raw.id,
    name: raw.title,
    tagline: raw.description,
    price: raw.price || 0,
    originalPrice: raw.originalPrice,
    rating: raw.rating || 4.8,
    reviewsCount: raw.reviewsCount || 100 + index * 37,
    badge: raw.badge,
    category: content ? `item-${index}` : 'accessories',
    specs: raw.specs && raw.specs.length ? raw.specs : [raw.description],
    image: raw.image,
    colorways: raw.colorways && raw.colorways.length
      ? raw.colorways
      : [{ name: 'Signature', hex: 'var(--color-brand-500)' }]
  });

  const PRODUCTS: ProductItem[] = content?.items && content.items.length
    ? content.items.map(itemToProduct)
    : FLAGSHIP_PRODUCTS;

  const PRESS_ACCOLADES = content?.quotes && content.quotes.length
    ? content.quotes
        .filter(quote => Boolean(quote.outlet))
        .map(quote => ({ outlet: quote.outlet || 'PRESS', quote: quote.quote }))
    : FLAGSHIP_PRESS;

  const pillarIcons = [Volume2, Cpu, Layers, BatteryCharging];
  const ENGINEERING_PILLARS = content?.highlights && content.highlights.length
    ? content.highlights.map((highlight, index) => ({
        id: highlight.id,
        icon: pillarIcons[index % pillarIcons.length],
        tabLabel: highlight.label,
        headline: highlight.title,
        desc: highlight.description,
        stats: highlight.stats
      }))
    : FLAGSHIP_PILLARS;

  const FAQS = content?.faqs && content.faqs.length ? content.faqs : FLAGSHIP_FAQS;

  const categoryTabs = content
    ? [
        { id: 'all', label: 'All' },
        ...content.items.map((item, index) => ({ id: `item-${index}`, label: item.title.split(' ').slice(0, 2).join(' ') }))
      ]
    : [
        { id: 'all', label: 'All Products' },
        { id: 'headphones', label: 'Headphones' },
        { id: 'earphones', label: 'Earphones' },
        { id: 'hardware', label: 'Studio DAC' },
        { id: 'accessories', label: 'Accessories' }
      ];

  const navLinks = content
    ? [
        { label: content.items[0]?.title || 'Collection', href: '#products' },
        { label: content.items[1]?.title || 'Details', href: '#products' },
        { label: content.featuresTitle, href: '#technology' },
        { label: content.sectionTitle, href: '#specs' },
        { label: 'Reviews', href: '#reviews' },
        { label: 'FAQ', href: '#faq' }
      ]
    : [
        { label: 'Headphones', href: '#products' },
        { label: 'Studio Gear', href: '#products' },
        { label: 'Acoustic Tech', href: '#technology' },
        { label: 'Specifications', href: '#specs' },
        { label: 'Reviews', href: '#reviews' },
        { label: 'FAQ', href: '#faq' }
      ];

  const specRows = content && content.items.length
    ? (content.items[0].specs || []).map((spec, index) => ({
        label: spec,
        a: spec,
        b: (content.items[1] && content.items[1].specs && content.items[1].specs[index]) || '—'
      }))
    : [];

  const filteredProducts = selectedCategory === 'all'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === selectedCategory);

  const handleAddToCart = (productName: string) => {
    setCartCount(prev => prev + 1);
    setAddedToast(`Added "${productName}" to your cart`);
    setTimeout(() => setAddedToast(null), 3000);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) return;
    setIsSubscribed(true);
    setTimeout(() => {
      setIsSubscribed(false);
      setEmailInput('');
    }, 4000);
  };

  const heroColors = content && content.items[0] && content.items[0].colorways && content.items[0].colorways.length
    ? content.items[0].colorways.map(colorway => ({
        name: colorway.name,
        hex: colorway.hex,
        desc: content.label
      }))
    : [
        { name: 'Titanium Silver', hex: 'var(--color-neutral-200)', desc: 'Satin bead-blasted aerospace titanium' },
        { name: 'Space Obsidian', hex: 'var(--color-neutral-900)', desc: 'Deep PVD scratch-resistant black' },
        { name: 'Desert Sand', hex: 'var(--color-brand-400)', desc: 'Warm champagne anodized finish' }
      ];

  return (
    <div className="w-full min-h-screen flex flex-col bg-[var(--color-bg-default)] text-[var(--color-fg-default)] selection:bg-[var(--color-action-primary)] selection:text-[var(--color-action-primary-fg)] font-sans antialiased">
      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-neutral-900 text-white shadow-2xl border border-neutral-700 flex items-center gap-3 text-xs font-medium animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{addedToast}</span>
        </div>
      )}

      {/* 1. Top Minimalist Announcement Bar */}
      {isSectionEnabled('announcement') && (
        <aside aria-label="Announcement" className="w-full py-2.5 px-4 bg-[var(--color-bg-surface)] border-b border-[var(--color-border-default)] text-xs text-center font-medium tracking-wide flex items-center justify-center gap-3 text-[var(--color-fg-muted)]">
          <span className="inline-flex items-center gap-1.5 font-semibold text-[var(--color-action-primary)]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Spring 2026 Release</span>
          </span>
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline">Complimentary Worldwide Express Air on Orders Over $150</span>
          <span>·</span>
          <span>30-Day Risk-Free Trial</span>
        </aside>
      )}

      {/* 2. Floating Sleek Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[var(--color-bg-default)]/90 border-b border-[var(--color-border-default)] transition-colors">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-16 flex items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[var(--color-action-primary)] text-[var(--color-action-primary-fg)] flex items-center justify-center font-black text-sm tracking-tighter">
              <Radio className="w-4 h-4" />
            </div>
            <span
              className="text-lg font-black tracking-wider uppercase text-[var(--color-fg-default)]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {brandName}
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-wide text-[var(--color-fg-muted)] uppercase">
            {navLinks.map((link, index) => (
              <a key={`${link.href}-${index}`} href={link.href} className="hover:text-[var(--color-fg-default)] transition-colors">{link.label}</a>
            ))}
          </nav>

          {/* Actions & Cart Badge */}
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono font-medium text-[var(--color-fg-muted)] hidden sm:inline">USD ($)</span>
            <button
              type="button"
              onClick={() => handleAddToCart(PRODUCTS[0]?.name || brandName)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] hover:bg-[var(--color-bg-default)] transition-all text-xs font-semibold cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[var(--color-action-primary)]" />
              <span>Cart</span>
              <span className="w-4 h-4 rounded-full bg-[var(--color-action-primary)] text-[var(--color-action-primary-fg)] text-[10px] flex items-center justify-center font-bold">
                {cartCount}
              </span>
            </button>
            <a
              href="#products"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-bold tracking-wide transition-all shadow-[var(--shadow-sm)] hover:opacity-90 cursor-pointer"
              style={getPrimaryBtnStyle()}
            >
              <span>{content?.primaryAction || 'Pre-Order Now'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* 3. Hero Section Inspired by Framer Product Landing */}
        <section className="relative w-full py-16 sm:py-24 px-6 sm:px-12 border-b border-[var(--color-border-default)] overflow-hidden">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Copy & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] text-[var(--color-action-primary)]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{badge}</span>
              </div>

              <h1
                className="text-4xl sm:text-6xl font-black tracking-tight text-[var(--color-fg-default)] leading-[1.08]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {headline || 'Silence the noise. Experience pure acoustic clarity.'}
              </h1>

              <p className="text-base sm:text-lg text-[var(--color-fg-muted)] max-w-xl leading-relaxed">
                {subtitle ||
                  'Machined from aerospace-grade titanium, custom 50mm planar magnetic drivers, and memory-foam Italian lambskin cushions. Zero acoustic distortion across every frequency.'}
              </p>

              {/* Colorway Switcher */}
              <div className="pt-2 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-fg-muted)]">
                  <span>Finish:</span>
                  <span className="text-[var(--color-fg-default)]">{heroColors[selectedColorway].name}</span>
                </div>
                <div className="flex items-center gap-3">
                  {heroColors.map((color, idx) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColorway(idx)}
                      title={color.name}
                      className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                        selectedColorway === idx
                          ? 'scale-110 border-[var(--color-action-primary)] ring-2 ring-[var(--color-action-primary)]/20'
                          : 'border-transparent hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.hex }}
                    />
                  ))}
                </div>
              </div>

              {/* CTAs */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => handleAddToCart(PRODUCTS[0]?.name || brandName)}
                  className="px-8 py-3.5 text-xs sm:text-sm font-bold tracking-wider uppercase transition-all shadow-[var(--shadow-md)] hover:opacity-95 cursor-pointer flex items-center gap-2"
                  style={getPrimaryBtnStyle()}
                >
                  <span>{content ? content.primaryAction : 'Pre-Order — $349'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href="#technology"
                  className="px-6 py-3.5 text-xs sm:text-sm font-semibold tracking-wide border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] hover:bg-[var(--color-bg-default)] text-[var(--color-fg-default)] transition-colors flex items-center gap-2"
                  style={{ borderRadius: 'var(--radius-button, var(--radius-md, 8px))' }}
                >
                  <Play className="w-3.5 h-3.5 text-[var(--color-action-primary)]" />
                  <span>{content?.secondaryAction || 'Acoustic Teardown'}</span>
                </a>
              </div>

              {/* Trust Micro-Row */}
              <div className="pt-4 flex items-center gap-6 text-xs text-[var(--color-fg-muted)] font-medium">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[var(--color-action-primary)]" />
                  Dispatches in 24 Hours
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-action-primary)]" />
                  2-Year Full Warranty
                </span>
                <span className="flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-[var(--color-action-primary)]" />
                  30-Day Home Trial
                </span>
              </div>
            </div>

            {/* Right Column: Hero Visual & Floating Hotspots */}
            <div className="lg:col-span-5 relative">
              <div
                className="relative aspect-square w-full overflow-hidden border border-[var(--color-border-default)] shadow-2xl bg-[var(--color-bg-surface)] flex items-center justify-center p-8 group"
                style={{ borderRadius: 'var(--radius-card, var(--radius-lg, 24px))' }}
              >
                <img
                  src={effectiveHeroImage || '/src/assets/images/preview_saas_metrics_1792316645998.jpg'}
                  alt={`${brandName} hero`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  style={{ borderRadius: 'calc(var(--radius-card, 24px) - 8px)', filter: 'var(--image-filter, none)' }}
                />

                {/* Floating Hotspot Callout 1 */}
                <div className="absolute top-6 left-6 p-3 rounded-2xl backdrop-blur-md bg-[var(--color-bg-default)]/90 border border-[var(--color-border-default)] shadow-xl text-left space-y-0.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[var(--color-action-primary)] uppercase">
                    <Volume2 className="w-3 h-3" />
                    <span>{content?.highlights[0]?.label || 'Planar Transducers'}</span>
                  </div>
                  <p className="text-xs font-bold text-[var(--color-fg-default)]">{content?.highlights[0]?.title || '50mm Beryllium Diaphragm'}</p>
                  <span className="text-[10px] text-[var(--color-fg-muted)] font-mono">{content?.highlights[0]?.stats[0]?.value || '5Hz – 48kHz Ultrawide'}</span>
                </div>

                {/* Floating Hotspot Callout 2 */}
                <div className="absolute bottom-6 right-6 p-3 rounded-2xl backdrop-blur-md bg-[var(--color-bg-default)]/90 border border-[var(--color-border-default)] shadow-xl text-left space-y-0.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[var(--color-status-success)] uppercase">
                    <BatteryCharging className="w-3 h-3" />
                    <span>{content?.highlights[1]?.label || 'Battery Stamina'}</span>
                  </div>
                  <p className="text-xs font-bold text-[var(--color-fg-default)]">{content?.highlights[1]?.title || '65 Hours Continuous'}</p>
                  <span className="text-[10px] text-[var(--color-fg-muted)] font-mono">{content?.highlights[1]?.stats[1]?.value || 'Qi2 Wireless Fast Charge'}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Press & Accolades Marquee Bar */}
        {isSectionEnabled('marquee') && (
          <section className="w-full py-8 px-6 sm:px-12 bg-[var(--color-bg-surface)] border-b border-[var(--color-border-default)]">
            <div className="max-w-6xl mx-auto">
              <p className="text-[11px] font-mono uppercase tracking-widest text-center text-[var(--color-fg-muted)] mb-6">
                {content?.ctaSubtitle || 'Recognized Worldwide by Leading Audio & Design Authorities'}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
                {PRESS_ACCOLADES.map((item, idx) => (
                  <div key={idx} className="space-y-1.5 p-3 rounded-xl hover:bg-[var(--color-bg-default)] transition-colors">
                    <span className="text-sm font-black tracking-wider text-[var(--color-fg-default)] block">
                      {item.outlet}
                    </span>
                    <p className="text-[11px] text-[var(--color-fg-muted)] italic leading-snug">
                      "{item.quote}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 5. Complete Hardware Collection / Catalog */}
        {isSectionEnabled('products') && (
        <section id="products" className="w-full py-16 sm:py-24 px-6 sm:px-12 border-b border-[var(--color-border-default)]">
          <div className="max-w-6xl mx-auto space-y-10">
            {/* Header & Category Filters */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 text-left">
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold tracking-widest text-[var(--color-action-primary)] uppercase">
                  {content?.sectionTitle || 'Hardware Ecosystem'}
                </span>
                <h2
                  className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-fg-default)]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {content?.featuresTitle || 'Engineered for Acoustic Truth'}
                </h2>
                <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] max-w-xl">
                  {content?.sectionSubtitle || 'Explore our complete collection of reference planar headphones, hybrid in-ear monitors, and machined studio hardware.'}
                </p>
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-full border border-[var(--color-border-default)] bg-[var(--color-bg-surface)]">
                {categoryTabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedCategory(tab.id as any)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      selectedCategory === tab.id
                        ? 'bg-[var(--color-action-primary)] text-[var(--color-action-primary-fg)] shadow-sm'
                        : 'text-[var(--color-fg-muted)] hover:text-[var(--color-fg-default)]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <div
                  key={product.id}
                  className="group border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  style={getCardStyle()}
                >
                  {/* Card Visual Header */}
                  <div className="relative aspect-square w-full bg-[var(--color-bg-default)] p-6 flex items-center justify-center overflow-hidden">
                    {product.badge && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-[var(--color-bg-default)]/90 backdrop-blur-md border border-[var(--color-border-default)] text-[var(--color-action-primary)]">
                        {product.badge}
                      </span>
                    )}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                      style={getImageStyle()}
                    />
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4 text-left">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-amber-500 text-xs">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="font-bold text-[var(--color-fg-default)]">{product.rating.toFixed(1)}</span>
                          <span className="text-[10px] text-[var(--color-fg-muted)] font-mono">({product.reviewsCount})</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {product.colorways.map((cw, i) => (
                            <span
                              key={i}
                              title={cw.name}
                              className="w-2.5 h-2.5 rounded-full border border-black/20"
                              style={{ backgroundColor: cw.hex }}
                            />
                          ))}
                        </div>
                      </div>

                      <h3 className="text-base font-bold text-[var(--color-fg-default)] leading-snug">
                        {product.name}
                      </h3>
                      <p className="text-xs text-[var(--color-fg-muted)] leading-relaxed">
                        {product.tagline}
                      </p>
                    </div>

                    {/* Specs Pills */}
                    <div className="flex flex-wrap gap-1.5">
                      {product.specs.slice(0, 2).map((sp, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[10px] font-mono bg-[var(--color-bg-default)] text-[var(--color-fg-muted)] border border-[var(--color-border-default)]"
                        >
                          {sp}
                        </span>
                      ))}
                    </div>

                    {/* Price & Action */}
                    <div className="pt-2 flex items-center justify-between border-t border-[var(--color-border-default)]">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-black text-[var(--color-fg-default)]">
                          ${product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-[var(--color-fg-muted)] line-through">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddToCart(product.name)}
                        className="px-3.5 py-1.5 text-xs font-bold tracking-wide transition-all shadow-sm hover:opacity-90 cursor-pointer flex items-center gap-1"
                        style={getPrimaryBtnStyle()}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        )}

        {/* 6. Interactive Acoustic Engineering Showcase Tabs */}
        {isSectionEnabled('specs') && (
        <section id="technology" className="w-full py-16 sm:py-24 px-6 sm:px-12 bg-[var(--color-bg-surface)] border-b border-[var(--color-border-default)]">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="text-xs font-mono font-bold tracking-widest text-[var(--color-action-primary)] uppercase">
                {content?.sectionTitle || 'Acoustic Architecture'}
              </span>
              <h2
                className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-fg-default)]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {content?.featuresTitle || 'Zero Compromise. Total Transparency.'}
              </h2>
              <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] leading-relaxed">
                {content?.featuresSubtitle || 'Click any engineering subsystem below to inspect driver physics, neural noise cancellation, and titanium metallurgy.'}
              </p>
            </div>

            {/* Pillar Selector Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {ENGINEERING_PILLARS.map((pillar, idx) => {
                const Icon = pillar.icon;
                const isActive = activePillarIndex === idx;
                return (
                  <button
                    key={pillar.id}
                    onClick={() => setActivePillarIndex(idx)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer border ${
                      isActive
                        ? 'bg-[var(--color-bg-default)] border-[var(--color-action-primary)] text-[var(--color-action-primary)] shadow-sm'
                        : 'bg-[var(--color-bg-surface)] border-[var(--color-border-default)] text-[var(--color-fg-muted)] hover:text-[var(--color-fg-default)]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{pillar.tabLabel}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Pillar Card */}
            {(() => {
              const current = ENGINEERING_PILLARS[activePillarIndex];
              return (
                <div className="p-8 sm:p-12 rounded-3xl border border-[var(--color-border-default)] bg-[var(--color-bg-default)] shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
                  <div className="lg:col-span-7 space-y-5">
                    <span className="text-xs font-mono font-bold tracking-widest text-[var(--color-action-primary)] uppercase">
                      Subsystem 0{activePillarIndex + 1}
                    </span>
                    <h3
                      className="text-2xl sm:text-3xl font-black text-[var(--color-fg-default)] leading-snug"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {current.headline}
                    </h3>
                    <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] leading-relaxed">
                      {current.desc}
                    </p>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[var(--color-border-default)]">
                      {current.stats.map((st, i) => (
                        <div key={i} className="space-y-1">
                          <span className="text-lg sm:text-2xl font-black text-[var(--color-fg-default)] font-mono">
                            {st.value}
                          </span>
                          <p className="text-[11px] text-[var(--color-fg-muted)]">{st.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Visual Blueprint Diagram Box */}
                  <div className="lg:col-span-5 aspect-square rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] p-6 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-xs font-mono text-[var(--color-fg-muted)]">
                      <span>{content ? `${content.genreId.toUpperCase()}_REVIEW` : 'ACOUSTIC_LAB_TEST_V3'}</span>
                      <span className="text-[var(--color-status-success)] font-bold">100% PASSED</span>
                    </div>

                    {/* Mock Frequency Response Curve Bars */}
                    <div className="flex items-end justify-between gap-1 h-32 pt-4">
                      {[35, 42, 58, 70, 82, 91, 95, 93, 89, 87, 86, 88, 92, 94, 90, 85, 78, 65, 52, 40].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-t transition-all duration-500"
                          style={{
                            height: `${h}%`,
                            backgroundColor: i === 7 ? 'var(--color-action-primary)' : 'var(--color-border-default)'
                          }}
                        />
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-[var(--color-fg-muted)] pt-2 border-t border-[var(--color-border-default)]">
                      <span>20 Hz</span>
                      <span>1 kHz (Linear Calibration)</span>
                      <span>40 kHz</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </section>
        )}

        {/* 7. Technical Specifications Matrix */}
        {isSectionEnabled('matrix') && (
        <section id="specs" className="w-full py-16 sm:py-24 px-6 sm:px-12 border-b border-[var(--color-border-default)]">
          <div className="max-w-4xl mx-auto space-y-8 text-left">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold tracking-widest text-[var(--color-action-primary)] uppercase">
                Laboratory Specifications
              </span>
              <h2
                className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-fg-default)]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Technical Comparison & Architecture
              </h2>
            </div>

            <div className="rounded-2xl border border-[var(--color-border-default)] overflow-hidden bg-[var(--color-bg-surface)]">
              {content && specRows.length ? (
                <table className="w-full text-xs text-left">
                  <thead className="bg-[var(--color-bg-default)] border-b border-[var(--color-border-default)] font-mono text-[var(--color-fg-muted)] uppercase text-[10px]">
                    <tr>
                      <th className="py-3 px-5">Detail</th>
                      <th className="py-3 px-5 font-bold text-[var(--color-action-primary)]">{content.items[0]?.title}</th>
                      <th className="py-3 px-5">{content.items[1]?.title || 'Alternative'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border-default)] text-[var(--color-fg-default)]">
                    {specRows.map((row, index) => (
                      <tr key={index}>
                        <td className="py-3.5 px-5 font-medium text-[var(--color-fg-muted)]">{row.label}</td>
                        <td className="py-3.5 px-5 font-bold">{row.a}</td>
                        <td className="py-3.5 px-5">{row.b}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="w-full text-xs text-left">
                  <thead className="bg-[var(--color-bg-default)] border-b border-[var(--color-border-default)] font-mono text-[var(--color-fg-muted)] uppercase text-[10px]">
                    <tr>
                      <th className="py-3 px-5">Specification</th>
                      <th className="py-3 px-5 font-bold text-[var(--color-action-primary)]">Aether Pro Planar</th>
                      <th className="py-3 px-5">Studio Earphones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border-default)] text-[var(--color-fg-default)]">
                    <tr>
                      <td className="py-3.5 px-5 font-medium text-[var(--color-fg-muted)]">Acoustic Driver</td>
                      <td className="py-3.5 px-5 font-bold">50mm Planar Beryllium</td>
                      <td className="py-3.5 px-5">Dual Balanced Armature + 10mm Dynamic</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-5 font-medium text-[var(--color-fg-muted)]">Frequency Range</td>
                      <td className="py-3.5 px-5 font-mono font-bold">5Hz – 48kHz</td>
                      <td className="py-3.5 px-5 font-mono">15Hz – 32kHz</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-5 font-medium text-[var(--color-fg-muted)]">Active Noise Cancelling</td>
                      <td className="py-3.5 px-5 font-bold">Neural Hybrid ANC (-42dB)</td>
                      <td className="py-3.5 px-5">Feedforward ANC (-34dB)</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-5 font-medium text-[var(--color-fg-muted)]">Total Playtime</td>
                      <td className="py-3.5 px-5 font-bold">65 Hours (ANC On)</td>
                      <td className="py-3.5 px-5">40 Hours (with Case)</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-5 font-medium text-[var(--color-fg-muted)]">Wireless Codecs</td>
                      <td className="py-3.5 px-5 font-bold">LDAC, aptX Lossless, AAC, SBC</td>
                      <td className="py-3.5 px-5">aptX Adaptive, AAC, SBC</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-5 font-medium text-[var(--color-fg-muted)]">Chassis Materials</td>
                      <td className="py-3.5 px-5 font-bold">Grade 5 Titanium & Italian Leather</td>
                      <td className="py-3.5 px-5">Anodized Aluminum & Bio-Polymer</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-5 font-medium text-[var(--color-fg-muted)]">Weight</td>
                      <td className="py-3.5 px-5 font-mono font-bold">235 grams</td>
                      <td className="py-3.5 px-5 font-mono">5.2g per earbud</td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </section>
        )}

        {/* 8. Verified Sound Engineer Reviews */}
        {isSectionEnabled('reviews') && (
        <section id="reviews" className="w-full py-16 sm:py-24 px-6 sm:px-12 bg-[var(--color-bg-surface)] border-b border-[var(--color-border-default)]">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <span className="text-xs font-mono font-bold tracking-widest text-[var(--color-action-primary)] uppercase">
                {content?.sectionTitle || 'Audio Engineer Acclaim'}
              </span>
              <h2
                className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-fg-default)]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {content?.ctaTitle || 'Trusted by Mastering Engineers & Artists'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {(content?.quotes && content.quotes.length
                ? content.quotes.map(quote => ({ ...quote, verified: true }))
                : [
                {
                  quote:
                    'The planar driver resolution on the Aether Pro is astonishing. I can hear reverb tails down to -70dB that were previously smeared on dynamic cans. They have become my reference for final album masters.',
                  author: 'Marcus Vance',
                  role: 'Grammy-Winning Mastering Engineer, London',
                  verified: true
                },
                {
                  quote:
                    'Zero clamping fatigue after an 8-hour mixing session. The titanium frame and memory-foam cushions feel practically weightless, while the acoustic stage sounds wider than open-back studio monitors.',
                  author: 'Elena Rostova',
                  role: 'Film Score Composer & Sound Designer, Los Angeles',
                  verified: true
                },
                {
                  quote:
                    'The USB-C uncompressed DAC mode is brilliant. I get studio laboratory transparency when docked at my workstation, and seamless LDAC wireless when traveling.',
                  author: 'Kenji Takahashi',
                  role: 'Electronic Music Producer, Tokyo',
                  verified: true
                }
                ]).map((rev, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-bg-default)] shadow-sm space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(5)].map((_, si) => (
                        <Star key={si} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs text-[var(--color-fg-default)] leading-relaxed italic">
                      "{rev.quote}"
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[var(--color-border-default)] flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-[var(--color-fg-default)]">{rev.author}</h4>
                      <p className="text-[11px] text-[var(--color-fg-muted)]">{rev.role}</p>
                    </div>
                    {rev.verified && (
                      <span className="flex items-center gap-1 text-[10px] font-mono font-semibold" style={{ color: 'var(--color-status-success-fg)', backgroundColor: 'var(--color-status-success-bg)', padding: '2px 6px', borderRadius: 6 }}>
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        )}

        {/* 9. Expandable FAQ Accordion */}
        {isSectionEnabled('faq') && (
        <section id="faq" className="w-full py-16 sm:py-24 px-6 sm:px-12 border-b border-[var(--color-border-default)]">
          <div className="max-w-3xl mx-auto space-y-8 text-left">
            <div className="text-center space-y-2">
              <span className="text-xs font-mono font-bold tracking-widest text-[var(--color-action-primary)] uppercase">
                Got Questions?
              </span>
              <h2
                className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-fg-default)]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Orders, Shipping & Warranty FAQ
              </h2>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] overflow-hidden transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full p-5 flex items-center justify-between text-left gap-4 cursor-pointer hover:bg-[var(--color-bg-default)]/50 transition-colors"
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

        {/* 10. VIP Drop Access & Newsletter Signup */}
        {isSectionEnabled('newsletter') && (
        <section className="w-full py-16 sm:py-20 px-6 sm:px-12 bg-[var(--color-bg-surface)] border-b border-[var(--color-border-default)]">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--color-bg-default)] border border-[var(--color-border-default)] text-[var(--color-action-primary)]">
              <Gift className="w-3.5 h-3.5" />
              <span>Private VIP Allocation</span>
            </div>

            <h2
              className="text-2xl sm:text-4xl font-black tracking-tight text-[var(--color-fg-default)]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {content?.ctaTitle || 'Join the Inner Acoustic Circle'}
            </h2>

            <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] leading-relaxed">
              {content?.ctaSubtitle || 'Receive private access to limited studio batch runs, early beta firmware drops, and invitations to acoustic listening salons.'}
            </p>

            {isSubscribed ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                <span>You are on the VIP allocation list. We have sent your welcome invitation.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={emailInput}
                  onChange={e => setEmailInput(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full px-4 py-3 rounded-full text-xs border border-[var(--color-border-default)] bg-[var(--color-bg-default)] text-[var(--color-fg-default)] focus:outline-none focus:ring-2 focus:ring-[var(--color-action-primary)]"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 rounded-full text-xs font-bold tracking-wide uppercase transition-all shadow-[var(--shadow-sm)] hover:opacity-90 shrink-0 cursor-pointer"
                  style={getPrimaryBtnStyle()}
                >
                  Join VIP
                </button>
              </form>
            )}
          </div>
        </section>
        )}
        {/* 10. Design System Showcase & Type Specimen (Doc 02 §4.3) */}
        {(isEnabled('components') || isEnabled('componentsShowcase')) && <ComponentsShowcase />}
        <TypeSpecimen />
      </main>

      {/* 11. Minimalist Architectural E-Commerce Footer */}
      <footer className="w-full py-12 px-6 sm:px-12 bg-[var(--color-bg-default)] border-t border-[var(--color-border-default)] text-xs text-[var(--color-fg-muted)]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-left">
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-black text-sm uppercase tracking-wider text-[var(--color-fg-default)]">
              <Radio className="w-4 h-4 text-[var(--color-action-primary)]" />
              <span>{brandName}</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              {content?.description || 'Precision acoustic hardware, planar transducers, and studio monitors crafted for uncompromised fidelity.'}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-[var(--color-fg-default)] font-mono uppercase text-[10px]">Products</h4>
            <ul className="space-y-1 text-[11px]">
              {(content?.items?.length
                ? content.items.map(item => item.title)
                : ['Aether Pro Planar', 'Studio In-Ear Reference', 'Precision DAC & Amp', 'MagSafe Brass Stand']
              ).map(label => (
                <li key={label}><a href="#products" className="hover:text-[var(--color-fg-default)]">{label}</a></li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-[var(--color-fg-default)] font-mono uppercase text-[10px]">{content?.sectionTitle || 'Acoustic Lab'}</h4>
            <ul className="space-y-1 text-[11px]">
              {(content?.highlights?.length
                ? content.highlights.map(highlight => highlight.label)
                : ['Planar Transducers', 'Neural ANC Tech', 'Specifications', '30-Day Trial Guarantee']
              ).map(label => (
                <li key={label}><a href="#technology" className="hover:text-[var(--color-fg-default)]">{label}</a></li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-[var(--color-fg-default)] font-mono uppercase text-[10px]">Assurance</h4>
            <p className="text-[11px] leading-relaxed">
              {content?.featuresSubtitle || 'Certified Hi-Res Audio · Bluetooth SIG 5.4 · 100% Carbon-Neutral Shipping · 2-Year Factory Warranty.'}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-[var(--color-border-default)] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© {new Date().getFullYear()} {brandName}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#faq" className="hover:text-[var(--color-fg-default)]">Privacy Policy</a>
            <a href="#faq" className="hover:text-[var(--color-fg-default)]">Terms of Service</a>
            <a href="#faq" className="hover:text-[var(--color-fg-default)]">Warranty Registration</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CommerceTemplate;
