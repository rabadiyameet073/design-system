import React, { useState } from 'react';
import { TemplateProps } from './index';
import {
  ComponentsShowcase,
  TypeSpecimen
} from '../sections';
import {
  Compass,
  Layers,
  MapPin,
  Home,
  Maximize,
  Bed,
  Bath,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Eye,
  Building,
  TreePine,
  Sun,
  Shield,
  FileText,
  Clock,
  Award
} from 'lucide-react';

interface BuiltWork {
  id: string;
  title: string;
  location: string;
  year: string;
  typology: string;
  area: string;
  materials: string[];
  image: string;
  desc: string;
  award: string;
}

const BUILT_WORKS: BuiltWork[] = [
  {
    id: 'point-dume-residence',
    title: 'The Monolith Ocean Residence',
    location: 'Point Dume, Malibu, California',
    year: '2026',
    typology: 'Private Sanctuary',
    area: '4,200 sq.ft',
    materials: ['Board-Formed Concrete', 'Charred Cedar', 'Rift-Sawn Oak'],
    image: '/src/assets/images/preview_editorial_arch_1792316647413.jpg',
    desc: 'Cantilevered monolithic ocean bluff sanctuary framing infinite Pacific horizons with frameless floor-to-ceiling glass and geothermal thermal mass.',
    award: 'AIA National Honor Award 2026'
  },
  {
    id: 'kyoto-sound-atelier',
    title: 'Resonator Acoustic Studio',
    location: 'Higashiyama, Kyoto, Japan',
    year: '2025',
    typology: 'Acoustic Laboratory',
    area: '2,600 sq.ft',
    materials: ['Hinoki Cypress', 'Hand-Split Slate', 'Woven Tatami'],
    image: '/src/assets/images/preview_ecommerce_ceramics_1792316645917.jpg',
    desc: 'A secluded timber pavilion designed around natural reverberation acoustics and moss meditation courtyards.',
    award: 'Japan Design Space Gold'
  },
  {
    id: 'vals-alpine-pavilion',
    title: 'Vals Alpine Solarium',
    location: 'Graubünden, Switzerland',
    year: '2024',
    typology: 'Thermal Sanctuary',
    area: '3,800 sq.ft',
    materials: ['Valser Quartzite', 'Triple-Glazed Glass', 'Cast Bronze'],
    image: '/src/assets/images/hero_founder_studio_1792316645323.jpg',
    desc: 'Subterranean alpine retreat carved into mountain bedrock, harnessing passive geothermal springs and sub-zero solar capture.',
    award: 'European Architecture Laureate'
  },
  {
    id: 'copenhagen-tidal-gallery',
    title: 'Nordic Maritime Pavilion',
    location: 'Refshaleøen, Copenhagen, Denmark',
    year: '2023',
    typology: 'Cultural Institution',
    area: '7,400 sq.ft',
    materials: ['Recycled Ship Timber', 'Weathered Zinc', 'Tidal Basalt'],
    image: '/src/assets/images/preview_saas_metrics_1792316645998.jpg',
    desc: 'Public exhibition pavilion floating above historic maritime dry docks, powered 100% by offshore wind and seawater cooling.',
    award: 'Mies Crown Hall Americas Finalist'
  }
];

const FLOOR_PLANS = [
  {
    id: 'ground',
    name: 'Level 01: Ground Atrium & Reflecting Pool',
    sqft: '1,850 sq.ft',
    rooms: [
      { name: 'Great Room & Double-Height Atrium', dim: '28’ × 22’', desc: 'Frameless glass wall opening directly to the cantilevered infinity reflection basin.' },
      { name: 'Architectural Kitchen & Butler Scullery', dim: '18’ × 14’', desc: 'Honed Pietra di Cardoso quartzite island with concealed Gaggenau induction.' },
      { name: 'Guest Suite & Private Zen Garden', dim: '16’ × 14’', desc: 'Direct cedar terrace walkout and ensuite honed travertine walk-in bath.' }
    ]
  },
  {
    id: 'mezzanine',
    name: 'Level 02: Primary Ocean Suite & Library',
    sqft: '1,600 sq.ft',
    rooms: [
      { name: 'Primary Ocean Suite & Dressing Salon', dim: '24’ × 18’', desc: 'Custom white oak millwork, motorized linen louvers, and private suspended fireplace.' },
      { name: 'Basalt Spa Bath & Cold Plunge Basin', dim: '16’ × 12’', desc: 'Monolithic freestanding soaking bath carved from a single block of volcanic basalt.' },
      { name: 'Cantilevered Architectural Library', dim: '14’ × 12’', desc: 'Overlooks the double-height atrium with acoustic timber micro-slats.' }
    ]
  },
  {
    id: 'rooftop',
    name: 'Level 03: Horizon Observation Deck & Solarium',
    sqft: '750 sq.ft',
    rooms: [
      { name: '360° Pacific Horizon Deck', dim: '30’ × 20’', desc: 'Panoramic ocean sunset views with integrated natural stone gas hearth.' },
      { name: 'Open-Air Summer Kitchen & Bar', dim: '12’ × 10’', desc: 'Marine-grade stainless grill with motorized slatted teak pergola.' }
    ]
  }
];

const MATERIAL_STUDIES = [
  { name: 'Volcanic Basalt', origin: 'Etna Quarry, Sicily', treatment: 'Honed Matte 400-Grit', acousticRating: 'Sound Absorbing', desc: 'Deep charcoal stone with micro-porous texture that ages with atmospheric patina.' },
  { name: 'Yakisugi Charred Cedar', origin: 'Nagano, Japan', treatment: 'Hand-Torched & Natural Oil Sealed', acousticRating: 'Weather Resistant', desc: 'Traditional fire-preservation technique providing natural rot, insect, and fire resistance.' },
  { name: 'Mass Timber Spruce', origin: 'Black Forest, Germany', treatment: 'PEFC Certified Cross-Laminated', acousticRating: 'Negative Carbon Footprint', desc: 'Structural multi-ply timber engineered to replace high-emission structural steel.' },
  { name: 'Low-Iron Cast Glass', origin: 'Murano, Italy', treatment: 'Acid-Etched Satin Translucent', acousticRating: 'Thermal Break Double-Pane', desc: 'Transmits diffused natural daylight without directional glare or heat gain.' }
];

export const ArchitectureTemplate: React.FC<TemplateProps> = ({
  brandName = 'ATELIER MONOLITH Spatial Architecture',
  headline,
  subtitle,
  badge = 'Monolithic Spatial Architecture Atelier',
  heroImage = '/src/assets/images/preview_editorial_arch_1792316647413.jpg',
  genreId = '',
  components,
  buttonStyle
}) => {
  const [activeFloor, setActiveFloor] = useState<'ground' | 'mezzanine' | 'rooftop'>('ground');
  const [showingBooked, setShowingBooked] = useState(false);
  const [activeWork, setActiveWork] = useState<BuiltWork>(BUILT_WORKS[0]);

  const enabled = components?.enabledComponents;
  const isSectionEnabled = (section: string) => {
    if (section === 'hero' || section === 'announcement' || section === 'components' || section === 'type') {
      return true;
    }
    if (!enabled || enabled.length === 0) return true;

    const moduleMapping: Record<string, string[]> = {
      works: ['product-card', 'projects', 'projectGrid', 'built-works', 'works'],
      plans: ['pricing-matrix', 'plans', 'features', 'spec-table', 'floorplans'],
      materiality: ['product-card', 'materiality', 'gallery', 'photos'],
      philosophy: ['product-card', 'philosophy', 'about', 'features'],
      testimonials: ['reviews-grid', 'testimonials', 'reviews', 'customer-review'],
      faq: ['curriculum-accordion', 'faq', 'accordion'],
      cta: ['newsletter', 'cta', 'leadCapture', 'contact']
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

  const handleBookShowing = () => {
    setShowingBooked(true);
    setTimeout(() => setShowingBooked(false), 3500);
  };

  const currentFloorData = FLOOR_PLANS.find(f => f.id === activeFloor) || FLOOR_PLANS[0];

  return (
    <div className="w-full min-h-screen flex flex-col bg-[var(--color-bg-default)] text-[var(--color-fg-default)] selection:bg-[var(--color-action-primary)] selection:text-[var(--color-action-primary-fg)] font-sans antialiased">
      {/* 1. Practice Monograph Ticker */}
      {isEnabled('announcement') && (
        <aside aria-label="Monograph" className="w-full py-2.5 px-4 bg-[var(--color-bg-surface)] text-[var(--color-fg-muted)] border-b border-[var(--color-border-default)] text-xs text-center font-mono tracking-wide flex items-center justify-center gap-2">
          <Compass className="w-3.5 h-3.5 text-[var(--color-action-primary)]" />
          <span className="font-bold text-[var(--color-fg-default)]">Monograph Vol. IV:</span>
          <span>Active commissions in Zurich, Kyoto, Point Dume, and Copenhagen</span>
          <span className="hidden sm:inline">· Pritzker Architecture Prize Finalist</span>
        </aside>
      )}

      {/* 2. Refined Architectural Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[var(--color-bg-default)]/95 border-b border-[var(--color-border-default)] transition-colors">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-18 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-action-primary)] text-[var(--color-action-primary-fg)] flex items-center justify-center font-serif font-black text-sm shadow-sm">
              <Building className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span
                className="text-base sm:text-lg font-black tracking-tight text-[var(--color-fg-default)] block leading-none"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {brandName}
              </span>
              <span className="text-[10px] font-mono tracking-widest text-[var(--color-fg-muted)] uppercase">
                Spatial Architecture & Research
              </span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold tracking-wide text-[var(--color-fg-muted)]">
            <a href="#works" className="hover:text-[var(--color-fg-default)] transition-colors">Built Works</a>
            <a href="#floorplans" className="hover:text-[var(--color-fg-default)] transition-colors">Floor Plans</a>
            <a href="#materiality" className="hover:text-[var(--color-fg-default)] transition-colors">Material Studies</a>
            <a href="#philosophy" className="hover:text-[var(--color-fg-default)] transition-colors">Philosophy</a>
            <a href="#contact" className="hover:text-[var(--color-fg-default)] transition-colors">Commissions</a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className="px-5 py-2.5 text-xs font-bold tracking-wide transition-all shadow-[var(--shadow-sm)] hover:opacity-90 cursor-pointer flex items-center gap-2"
              style={getPrimaryBtnStyle()}
            >
              <span>Commission Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* 3. Monumental Spatial Hero Section */}
        {isEnabled('hero') && (
          <section className="relative w-full py-16 sm:py-24 px-6 sm:px-12 border-b border-[var(--color-border-default)] overflow-hidden">
            <div className="max-w-6xl mx-auto space-y-10 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] text-[var(--color-action-primary)] shadow-sm mx-auto">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{badge}</span>
              </div>

              <h1
                className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[var(--color-fg-default)] max-w-4xl mx-auto leading-[1.08]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {headline || 'Structures Formed by Raw Stone, Mass Timber, and Natural Light.'}
              </h1>

              <p
                className="text-base sm:text-xl text-[var(--color-fg-muted)] max-w-2xl mx-auto leading-relaxed"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {subtitle ||
                  'We engineer private oceanfront sanctuaries, cultural pavilions, and public institutions celebrating tectonic clarity, structural endurance, and sustainable mass-timber frames.'}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <a
                  href="#works"
                  className="px-8 py-4 text-xs sm:text-sm font-bold tracking-wide uppercase transition-all shadow-[var(--shadow-md)] hover:opacity-95 cursor-pointer flex items-center gap-2"
                  style={getPrimaryBtnStyle()}
                >
                  <span>Explore Built Works</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="#floorplans"
                  className="px-6 py-4 text-xs sm:text-sm font-semibold tracking-wide border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] hover:bg-[var(--color-bg-default)] text-[var(--color-fg-default)] transition-colors flex items-center gap-2"
                  style={{ borderRadius: 'var(--radius-button, var(--radius-md, 8px))' }}
                >
                  <MapPin className="w-4 h-4 text-[var(--color-action-primary)]" />
                  <span>Inspect Floor Plans</span>
                </a>
              </div>

              {/* Architectural Spec Metric Row */}
              <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
                <div className="p-4 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] space-y-1">
                  <span className="text-[11px] font-mono text-[var(--color-fg-muted)] uppercase">Commissions</span>
                  <span className="text-2xl sm:text-3xl font-mono font-bold text-[var(--color-fg-default)] block">42 Works</span>
                  <span className="text-[10px] text-[var(--color-fg-muted)]">Across 12 Global Cities</span>
                </div>

                <div className="p-4 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] space-y-1">
                  <span className="text-[11px] font-mono text-[var(--color-fg-muted)] uppercase">Primary Material</span>
                  <span className="text-2xl sm:text-3xl font-mono font-bold text-[var(--color-action-primary)] block">Basalt</span>
                  <span className="text-[10px] text-[var(--color-fg-muted)]">Honed Volcanic Stone</span>
                </div>

                <div className="p-4 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] space-y-1">
                  <span className="text-[11px] font-mono text-[var(--color-fg-muted)] uppercase">Sustainability</span>
                  <span className="text-2xl sm:text-3xl font-mono font-bold text-emerald-500 block">Net Zero</span>
                  <span className="text-[10px] text-[var(--color-fg-muted)]">Passivhaus Verified</span>
                </div>

                <div className="p-4 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] space-y-1">
                  <span className="text-[11px] font-mono text-[var(--color-fg-muted)] uppercase">Accreditation</span>
                  <span className="text-2xl sm:text-3xl font-mono font-bold text-[var(--color-fg-default)] block">AIA Gold</span>
                  <span className="text-[10px] text-[var(--color-fg-muted)]">National Design Honors</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 4. Selected Built Works & Spatial Commissions Portfolio */}
        {isEnabled('works') && (
          <section id="works" className="w-full py-16 sm:py-24 px-6 sm:px-12 border-b border-[var(--color-border-default)]">
            <div className="max-w-6xl mx-auto space-y-12 text-left">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold tracking-widest text-[var(--color-action-primary)] uppercase">
                    Spatial Portfolio
                  </span>
                  <h2
                    className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-fg-default)]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    Selected Built Works & Architectural Commissions
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] max-w-sm">
                  Monolithic residences, cultural pavilions, and spatial installations grounded in materiality and site topography.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {BUILT_WORKS.map((work) => (
                  <div
                    key={work.id}
                    className="group border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
                    style={getCardStyle()}
                  >
                    <div className="relative h-72 overflow-hidden bg-[var(--color-bg-default)]">
                      <img
                        src={work.image}
                        alt={work.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        style={getImageStyle()}
                      />
                      <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[var(--color-bg-default)] text-[var(--color-fg-default)] border border-[var(--color-border-default)] shadow-xs">
                        {work.year} · {work.typology}
                      </span>
                      <span className="absolute bottom-4 right-4 px-3 py-1 rounded-full text-[10px] font-mono font-semibold bg-emerald-500 text-white shadow-xs">
                        {work.award}
                      </span>
                    </div>

                    <div className="p-6 space-y-4">
                      <div>
                        <h3
                          className="text-xl font-bold text-[var(--color-fg-default)] group-hover:text-[var(--color-action-primary)] transition-colors"
                          style={{ fontFamily: 'var(--font-heading)' }}
                        >
                          {work.title}
                        </h3>
                        <p className="text-xs text-[var(--color-fg-muted)] font-mono mt-1 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[var(--color-action-primary)]" />
                          <span>{work.location} · {work.area}</span>
                        </p>
                      </div>

                      <p className="text-xs text-[var(--color-fg-muted)] leading-relaxed">
                        {work.desc}
                      </p>

                      <div className="pt-3 border-t border-[var(--color-border-default)] flex flex-wrap gap-1.5">
                        {work.materials.map((mat, mIdx) => (
                          <span
                            key={mIdx}
                            className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-[var(--color-bg-default)] text-[var(--color-fg-muted)] border border-[var(--color-border-default)]"
                          >
                            {mat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 5. Interactive Architectural Floor Plan Explorer */}
        {isEnabled('plans') && (
          <section id="floorplans" className="w-full py-16 sm:py-24 px-6 sm:px-12 bg-[var(--color-bg-surface)] border-b border-[var(--color-border-default)]">
            <div className="max-w-5xl mx-auto space-y-8 text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono font-bold tracking-widest text-[var(--color-action-primary)] uppercase">
                    Spatial Anatomy
                  </span>
                  <h2
                    className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-fg-default)]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    Architectural Floor Plans & Room Volumes
                  </h2>
                </div>

                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--color-bg-default)] border border-[var(--color-border-default)] text-xs">
                  {FLOOR_PLANS.map(plan => (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setActiveFloor(plan.id as any)}
                      className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                        activeFloor === plan.id
                          ? 'bg-[var(--color-action-primary)] text-[var(--color-action-primary-fg)] font-bold'
                          : 'text-[var(--color-fg-muted)] hover:text-[var(--color-fg-default)]'
                      }`}
                    >
                      {plan.id === 'ground' ? 'Level 01' : plan.id === 'mezzanine' ? 'Level 02' : 'Level 03'}
                    </button>
                  ))}
                </div>
              </div>

              <div
                className="p-8 rounded-3xl border border-[var(--color-border-default)] bg-[var(--color-bg-default)] space-y-6 shadow-md"
                style={getCardStyle()}
              >
                <div className="flex items-center justify-between pb-4 border-b border-[var(--color-border-default)]">
                  <div>
                    <h3 className="text-lg font-bold text-[var(--color-fg-default)]">{currentFloorData.name}</h3>
                    <p className="text-xs font-mono text-[var(--color-action-primary)] font-bold mt-0.5">{currentFloorData.sqft}</p>
                  </div>
                  <span className="text-[11px] font-mono text-[var(--color-fg-muted)]">Scale: 1/4” = 1’0”</span>
                </div>

                <div className="space-y-3">
                  {currentFloorData.rooms.map((room, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-0.5">
                        <h4 className="text-sm font-bold text-[var(--color-fg-default)]">{room.name}</h4>
                        <p className="text-xs text-[var(--color-fg-muted)] leading-relaxed">{room.desc}</p>
                      </div>
                      <span className="text-xs font-mono font-bold px-3 py-1 rounded bg-[var(--color-bg-default)] text-[var(--color-action-primary)] border border-[var(--color-border-default)] shrink-0">
                        {room.dim}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[var(--color-border-default)]">
                  <p className="text-xs text-[var(--color-fg-muted)]">
                    Private walk-throughs require 24 hours advance registration and verified patron credentials.
                  </p>
                  <button
                    type="button"
                    onClick={handleBookShowing}
                    className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    style={getPrimaryBtnStyle()}
                  >
                    {showingBooked ? <CheckCircle2 className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                    <span>{showingBooked ? 'Showing Registration Received!' : 'Request Private Walk-Through'}</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 6. Materiality & Tectonic Studies Gallery */}
        {isEnabled('materiality') && (
          <section id="materiality" className="w-full py-16 sm:py-24 px-6 sm:px-12 border-b border-[var(--color-border-default)]">
            <div className="max-w-6xl mx-auto space-y-12 text-left">
              <div className="text-center space-y-3 max-w-2xl mx-auto">
                <span className="text-xs font-mono font-bold tracking-widest text-[var(--color-action-primary)] uppercase">
                  Tectonic Archive
                </span>
                <h2
                  className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-fg-default)]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Physical Material Studies & Site Castings
                </h2>
                <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] leading-relaxed">
                  Every structure is an exploration of physical geology and raw materials sourced within 200 kilometers of the building site.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {MATERIAL_STUDIES.map((mat, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] space-y-4 shadow-sm flex flex-col justify-between"
                    style={getCardStyle()}
                  >
                    <div className="space-y-3">
                      <div className="text-xs font-mono uppercase font-bold text-[var(--color-action-primary)]">
                        Study 0{idx + 1}
                      </div>
                      <h3 className="text-lg font-bold text-[var(--color-fg-default)]">{mat.name}</h3>
                      <p className="text-[11px] font-mono text-[var(--color-fg-muted)]">Source: {mat.origin}</p>
                      <p className="text-xs text-[var(--color-fg-muted)] leading-relaxed">{mat.desc}</p>
                    </div>

                    <div className="pt-3 border-t border-[var(--color-border-default)] space-y-1">
                      <span className="text-[10px] font-mono uppercase text-[var(--color-fg-muted)] block">Treatment:</span>
                      <span className="text-[11px] font-semibold text-[var(--color-fg-default)] block">{mat.treatment}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 7. Architectural Philosophy & Sustainable Engineering */}
        {isEnabled('philosophy') && (
          <section id="philosophy" className="w-full py-16 sm:py-24 px-6 sm:px-12 bg-[var(--color-bg-surface)] border-b border-[var(--color-border-default)]">
            <div className="max-w-4xl mx-auto space-y-8 text-left">
              <div className="space-y-3">
                <span className="text-xs font-mono font-bold tracking-widest text-[var(--color-action-primary)] uppercase">
                  Studio Philosophy
                </span>
                <h2
                  className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-fg-default)]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Architecture as Tectonic Silence & Ecological Permanence
                </h2>
              </div>

              <div className="space-y-4 text-sm sm:text-base text-[var(--color-fg-muted)] leading-relaxed">
                <p>
                  We reject transient decorative novelty. Our buildings are conceived as physical topography—heavy, durable, and calibrated to catch the movement of the sun across seasonal solstices.
                </p>
                <p>
                  By harnessing mass timber and raw thermal stone, our built structures achieve full carbon-neutral lifecycle permanence while providing acoustic stillness from urban noise.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[var(--color-border-default)]">
                <div className="space-y-1">
                  <span className="text-lg font-bold text-[var(--color-fg-default)]">1. Topographic Resonance</span>
                  <p className="text-xs text-[var(--color-fg-muted)]">Structures follow natural contours and microclimates.</p>
                </div>
                <div className="space-y-1">
                  <span className="text-lg font-bold text-[var(--color-fg-default)]">2. Honest Tectonics</span>
                  <p className="text-xs text-[var(--color-fg-muted)]">Unpainted materials celebrate grain, casting, and joinery.</p>
                </div>
                <div className="space-y-1">
                  <span className="text-lg font-bold text-[var(--color-fg-default)]">3. 100-Year Longevity</span>
                  <p className="text-xs text-[var(--color-fg-muted)]">Engineered to endure weathering and patinate with dignity.</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 8. Architectural Commission Inquiries */}
        {isEnabled('cta') && (
          <section id="contact" className="w-full py-16 sm:py-24 px-6 sm:px-12 border-b border-[var(--color-border-default)]">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--color-bg-surface)] border border-[var(--color-border-default)] text-[var(--color-action-primary)]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Now Accepting Select 2027 Commissions</span>
              </div>

              <h2
                className="text-3xl sm:text-5xl font-black tracking-tight text-[var(--color-fg-default)] leading-tight"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Initiate an Architectural Commission
              </h2>

              <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] max-w-xl mx-auto leading-relaxed">
                We accept a limited number of residential sanctuaries and cultural commissions annually to ensure meticulous principal oversight.
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
                <a
                  href="#contact"
                  className="px-8 py-4 text-xs sm:text-sm font-bold tracking-wide uppercase transition-all shadow-[var(--shadow-md)] hover:opacity-90 cursor-pointer flex items-center gap-2"
                  style={getPrimaryBtnStyle()}
                >
                  <span>Submit Commission Folio</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  onClick={handleBookShowing}
                  className="px-6 py-4 text-xs sm:text-sm font-semibold tracking-wide border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] hover:bg-[var(--color-bg-default)] text-[var(--color-fg-default)] transition-colors flex items-center gap-2"
                  style={{ borderRadius: 'var(--radius-button, var(--radius-md, 8px))' }}
                >
                  <Calendar className="w-4 h-4 text-[var(--color-action-primary)]" />
                  <span>Request Private Consultation</span>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* 9. Design System Showcase & Type Specimen (Doc 02 §4.3) */}
        {(isEnabled('components') || isEnabled('componentsShowcase')) && <ComponentsShowcase />}
        <TypeSpecimen />
      </main>

      {/* 10. Monograph Architectural Footer */}
      <footer className="w-full py-12 px-6 sm:px-12 bg-[var(--color-bg-default)] border-t border-[var(--color-border-default)] text-xs text-[var(--color-fg-muted)]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-left">
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-serif font-black text-sm uppercase tracking-wider text-[var(--color-fg-default)]">
              <Building className="w-4 h-4 text-[var(--color-action-primary)]" />
              <span>{brandName}</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Atelier for spatial architecture, tectonic research, and monolithic construction. Studios in Zurich, Kyoto, and Malibu.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-[var(--color-fg-default)] font-mono uppercase text-[10px]">Studios</h4>
            <ul className="space-y-1 text-[11px]">
              <li>Zurich: Gotthardstrasse 24, CH-8002</li>
              <li>Kyoto: Higashiyama-ku, 605-0862</li>
              <li>Malibu: Point Dume Bluff Studio</li>
              <li>Copenhagen: Refshalevej 163</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-[var(--color-fg-default)] font-mono uppercase text-[10px]">Typologies</h4>
            <ul className="space-y-1 text-[11px]">
              <li><a href="#works" className="hover:text-[var(--color-fg-default)]">Private Sanctuaries</a></li>
              <li><a href="#works" className="hover:text-[var(--color-fg-default)]">Cultural Institutions</a></li>
              <li><a href="#works" className="hover:text-[var(--color-fg-default)]">Alpine Solariums</a></li>
              <li><a href="#materiality" className="hover:text-[var(--color-fg-default)]">Material Research</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-[var(--color-fg-default)] font-mono uppercase text-[10px]">Accreditation</h4>
            <p className="text-[11px] leading-relaxed">
              AIA Gold Medal Fellow · SIA Swiss Society of Engineers & Architects · LEED AP BD+C Certified.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-[var(--color-border-default)] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© {new Date().getFullYear()} {brandName}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#contact" className="hover:text-[var(--color-fg-default)]">Monograph Inquiries</a>
            <a href="#contact" className="hover:text-[var(--color-fg-default)]">Privacy Policy</a>
            <a href="#contact" className="hover:text-[var(--color-fg-default)]">Architectural Ethics</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ArchitectureTemplate;
