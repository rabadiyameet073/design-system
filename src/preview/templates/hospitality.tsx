import React, { useState } from 'react';
import {
  Star,
  MapPin,
  Calendar,
  Users,
  Compass,
  Wine,
  Sparkles,
  Check,
  CheckCircle2,
  Clock,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Flame,
  Droplets,
  Trees,
  Award,
  Sun,
  Moon,
  Coffee,
  HeartHandshake
} from 'lucide-react';
import {
  ComponentsShowcase,
  TypeSpecimen
} from '../sections';
import { TemplateProps } from './index';

export const HospitalityTemplate: React.FC<TemplateProps> = ({
  brandName = 'SANCTUARY Reserve & Retreats',
  headline,
  subtitle,
  badge = 'Three Michelin Stars · World’s 50 Best Hotels 2026',
  heroImage = '/src/assets/images/hero_founder_studio_1792316645323.jpg',
  genreId = '',
  components,
  buttonStyle
}) => {
  const [selectedPavilion, setSelectedPavilion] = useState(0);
  const [partySize, setPartySize] = useState(2);
  const [residencyNights, setResidencyNights] = useState(3);
  const [includeWinePairing, setIncludeWinePairing] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const enabled = components?.enabledComponents;
  const isSectionEnabled = (section: string) => {
    if (section === 'hero' || section === 'announcement' || section === 'components' || section === 'type') {
      return true;
    }
    if (!enabled || enabled.length === 0) return true;

    const moduleMapping: Record<string, string[]> = {
      booking: ['pricing-matrix', 'booking', 'reservations', 'pricing', 'calculator'],
      gallery: ['product-card', 'gallery', 'spaces', 'suites', 'features'],
      culinary: ['product-card', 'culinary', 'features', 'featureGrid', 'spec-table'],
      wellness: ['metrics-row', 'wellness', 'features', 'feature-grid'],
      testimonials: ['reviews-grid', 'testimonials', 'reviews', 'customer-review'],
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

  const PAVILIONS = [
    {
      name: 'The Cedar Forest Onsen Villa',
      size: '280 m² · Up to 4 Guests',
      description: 'Nested in a secluded stand of 300-year-old mountain pines. Private open-air geothermal onsen carved from black volcanic basalt, cantilevered yoga deck, and private fireplace salon.',
      rate: 2400,
      features: ['Private 39°C Basalt Onsen', 'Mountain Crest Panorama', 'Dedicated Sommelier Butler', 'Daily 14-Course In-Suite Hearth Dining']
    },
    {
      name: 'Monolith Alpine Ridge Suite',
      size: '190 m² · 2 Guests',
      description: 'Perched directly above the mist valley line at 1,840 meters elevation. Features floor-to-ceiling triple-glazed thermal glass, Finnish sauna, and sunken heated terrazzo soaking tub.',
      rate: 1850,
      features: ['Private Finnish Cedar Sauna', 'Zero-Light-Pollution Stargazing Deck', 'Custom Yakisugi Daybed', 'Sommelier Cellar Access']
    },
    {
      name: 'The Glacial Spring Solarium',
      size: '340 m² · Up to 6 Guests',
      description: 'Our premier estate pavilion with double-height timber ceilings, internal cascading mineral plunge pool, private tasting kitchen, and dedicated helicopter landing clearance.',
      rate: 3600,
      features: ['Private Mineral Plunge Pool', 'Personal Executive Chef On-Demand', 'Helipad Arrival Clearance', 'Full Grand Cru Cellar Allocation']
    }
  ];

  const TASTING_COURSES = [
    {
      course: 'Course 01 · Amuse',
      name: 'Smoked Dungeness Tartlet with Finger Lime & Kelp Emulsion',
      desc: 'Wild-foraged coastal seaweed and hand-picked crab with citrus oil pressed that morning.',
      pairing: '2020 Pierre Péters Blanc de Blancs Grand Cru Champagne'
    },
    {
      course: 'Course 03 · Deep Sea',
      name: 'Wild Hokkaido Diver Scallop with Dashi Glaze & Bafun Uni',
      desc: 'Flash-seared over binchotan embers and finished with 72-hour fermented mushroom garum.',
      pairing: '2022 Domaine Leflaive Puligny-Montrachet'
    },
    {
      course: 'Course 07 · Forest Hearth',
      name: 'Miyazaki A5 Wagyu over Binchotan with Pine-Cone Bone Reduction',
      desc: 'Aged 45 days in cedar bark, accompanied by charred matsutake and mountain shallots.',
      pairing: '2016 Château Pontet-Canet Pauillac'
    },
    {
      course: 'Course 11 · Botanical Cleanser',
      name: 'Wild Alpine Spruce Needle Granite with Fermented Spring Honey',
      desc: 'Crisp glacial infusion crafted from high-altitude spruce tips gathered at dawn.',
      pairing: 'Infused Herbal Tisane from Estate Botanical Garden'
    },
    {
      course: 'Course 14 · Dessert Finale',
      name: 'Oaxacan Criollo Cacao with Smoked Maldon Crystals & Bergamot Cream',
      desc: 'Single-origin wood-fired cacao paired with delicate sweet cream and smoked salt.',
      pairing: 'Rare 20-Year Aged Tawny Port'
    }
  ];

  const FAQ_ITEMS = [
    {
      q: 'How do guests arrange arrival and transportation to the mountain estate?',
      a: 'SANCTUARY is nestled within a secluded private alpine reserve. We offer private helicopter transfers directly to our on-property helipad from Zurich Airport (35 minutes) and Milan Malpensa (45 minutes). For guests arriving by car, complimentary chauffeured hybrid all-wheel-drive luxury transfers are provided from the nearest train terminal.'
    },
    {
      q: 'Are dietary preferences accommodated for the 14-course Michelin dining experience?',
      a: 'Yes. With 48 hours notice prior to arrival, our culinary brigade curates full plant-based, pescatarian, celiac-safe, or custom allergy-free 14-course tasting interpretations without compromising the gastronomic integrity of the experience.'
    },
    {
      q: 'What makes the geothermal mineral hot springs scientifically unique?',
      a: 'Our natural thermal springs originate from deep subterranean fissures at a constant 39.5°C (103°F). High in sulfur, silica, magnesium, and natural lithium minerals, the waters promote deep neuromuscular relaxation and circulatory restoration.'
    },
    {
      q: 'What is the minimum stay policy for private pavilions?',
      a: 'To preserve tranquility and deep biological rest, SANCTUARY maintains a 2-night minimum stay policy during autumn and spring seasons, and a 3-night minimum stay policy during peak winter solstice and summer harvest seasons.'
    },
    {
      q: 'Can the entire sanctuary be reserved for private celebrations or summits?',
      a: 'Yes. Private estate buyouts include all three residential villas, total exclusive access to the thermal springs, private executive chef brigade, and bespoke helicopter logistics for up to 18 resident guests.'
    }
  ];

  // Pricing calculations
  const currentPavilion = PAVILIONS[selectedPavilion];
  const totalBaseCost = currentPavilion.rate * residencyNights;
  const wineCost = includeWinePairing ? 175 * partySize * residencyNights : 0;
  const grandTotal = totalBaseCost + wineCost;

  const formatCurrency = (num: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);

  const handleBooking = () => {
    setBookingConfirmed(true);
    setTimeout(() => setBookingConfirmed(false), 4000);
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-[var(--color-bg-default)] text-[var(--color-fg-default)] font-sans antialiased selection:bg-[var(--color-action-primary)] selection:text-[var(--color-action-primary-fg)]">
      {/* 1. Accolades Bar */}
      {isEnabled('announcement') && (
        <aside
          aria-label="Accolades and Recognition"
          className="w-full py-2.5 px-4 bg-[var(--color-bg-surface)] text-[var(--color-fg-muted)] border-b border-[var(--color-border-default)] text-xs text-center font-mono tracking-wide flex items-center justify-center gap-2"
        >
          <span className="flex items-center gap-1.5 text-amber-500 font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-500" />
            <span>Three Michelin Stars · 2026 Selection</span>
          </span>
          <span className="text-[var(--color-border-default)]">·</span>
          <span>World&apos;s 50 Best Luxury Hotels</span>
          <span className="text-[var(--color-border-default)]">·</span>
          <span className="flex items-center gap-1 text-[var(--color-fg-default)]">
            <MapPin className="w-3 h-3 text-[var(--color-action-primary)]" />
            <span>Swiss Alpine Ridges & Thermal Springs</span>
          </span>
        </aside>
      )}

      {/* 2. Luxury Editorial Header */}
      <header className="w-full border-b sticky top-0 z-40 backdrop-blur-md bg-[var(--color-bg-default)]/90 border-[var(--color-border-default)]">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--color-action-primary)] text-[var(--color-action-primary-fg)] flex items-center justify-center shadow-md">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif italic font-bold text-lg tracking-tight">{brandName}</span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-mono uppercase tracking-widest text-[var(--color-fg-muted)] border-l pl-2 border-[var(--color-border-default)]">
                Alpine Onsen & Dining
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--color-fg-muted)]">
            <a href="#booking" className="hover:text-[var(--color-fg-default)] transition-colors">Residences</a>
            <a href="#culinary" className="hover:text-[var(--color-fg-default)] transition-colors">Michelin Dining</a>
            <a href="#wellness" className="hover:text-[var(--color-fg-default)] transition-colors">Thermal Springs</a>
            <a href="#reviews" className="hover:text-[var(--color-fg-default)] transition-colors">Press & Acclaim</a>
            <a href="#faq" className="hover:text-[var(--color-fg-default)] transition-colors">Concierge</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              style={getPrimaryBtnStyle()}
              className="px-4 py-2 text-xs font-bold shadow-sm hover:opacity-95"
            >
              Reserve Sanctuary
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* 3. Hero Section */}
        {isEnabled('hero') && (
          <section className="relative w-full py-20 sm:py-28 px-6 border-b border-[var(--color-border-default)] overflow-hidden">
            <div className="max-w-5xl mx-auto space-y-8 text-center relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] text-xs font-mono font-medium text-[var(--color-action-primary)] shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{badge}</span>
              </div>

              <h1
                className="text-3xl sm:text-5xl md:text-6xl font-serif font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.14]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {headline || 'A secluded alpine sanctuary of geothermal waters, monolithic stone, and elemental cuisine'}
              </h1>

              <p className="text-base sm:text-xl text-[var(--color-fg-muted)] max-w-2xl mx-auto font-normal leading-relaxed">
                {subtitle ||
                  'Perched high above the valley mist at 1,840 meters, SANCTUARY converges centuries-old hot springs hydrotherapy, architectural intimacy, and nightly 14-course fire-crafted tasting journeys.'}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <a
                  href="#booking"
                  style={getPrimaryBtnStyle()}
                  className="px-7 py-3.5 text-sm font-bold shadow-lg hover:opacity-95 flex items-center gap-2"
                >
                  <span>Check Seasonal Availability</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="#culinary"
                  className="px-7 py-3.5 text-sm font-semibold rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] text-[var(--color-fg-default)] hover:bg-[var(--color-bg-default)] transition-colors flex items-center gap-2"
                >
                  <Flame className="w-4 h-4 text-amber-500" />
                  <span>View 14-Course Tasting Menu</span>
                </a>
              </div>

              {/* Monograph Spec Row */}
              <div
                style={getCardStyle()}
                className="mt-12 p-6 sm:p-8 border shadow-xl grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto text-left"
              >
                <div className="space-y-1">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--color-fg-muted)]">Altitude</span>
                  <p className="text-xl sm:text-2xl font-bold font-mono">1,840 m</p>
                  <span className="text-[10px] text-[var(--color-fg-muted)]">Above Cloud Line</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--color-fg-muted)]">Thermal Water</span>
                  <p className="text-xl sm:text-2xl font-bold font-mono text-emerald-600">39.5°C</p>
                  <span className="text-[10px] text-[var(--color-fg-muted)]">Subterranean Mineral Spring</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--color-fg-muted)]">Daily Seating</span>
                  <p className="text-xl sm:text-2xl font-bold font-mono">18 Guests</p>
                  <span className="text-[10px] text-[var(--color-fg-muted)]">Exclusive Nightly Service</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--color-fg-muted)]">Forest Estate</span>
                  <p className="text-xl sm:text-2xl font-bold font-mono">420 Ha</p>
                  <span className="text-[10px] text-[var(--color-fg-muted)]">Protected Alpine Wilderness</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 4. INTERACTIVE RESIDENCY & RESERVATION BOOKING CONSOLE */}
        {isEnabled('booking') && (
          <section id="booking" className="w-full py-18 px-6 border-b border-[var(--color-border-default)] bg-[var(--color-bg-surface)]">
            <div className="max-w-5xl mx-auto space-y-10">
              <div className="text-center space-y-2">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--color-action-primary)]">
                  Private Pavilions & Suites
                </span>
                <h2
                  className="text-2xl sm:text-4xl font-serif font-bold tracking-tight text-[var(--color-fg-default)]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Reserve your private sanctuary residency
                </h2>
                <p className="text-sm text-[var(--color-fg-muted)] max-w-xl mx-auto">
                  Every reservation includes full access to the mineral springs, chauffeured helicopter or electric transfer, and daily gastronomic hearth dining.
                </p>
              </div>

              {/* Pavilion Selection Tabs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {PAVILIONS.map((pav, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedPavilion(idx)}
                    style={getCardStyle()}
                    className={`p-6 text-left border transition-all cursor-pointer ${
                      selectedPavilion === idx
                        ? 'border-[var(--color-action-primary)] shadow-md ring-2 ring-[var(--color-action-primary)]/20 bg-[var(--color-bg-default)]'
                        : 'border-[var(--color-border-default)] hover:border-[var(--color-fg-muted)] bg-[var(--color-bg-surface)]'
                    }`}
                  >
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-action-primary)] font-bold">
                      Pavilion 0{idx + 1}
                    </span>
                    <h3 className="text-base font-bold text-[var(--color-fg-default)] pt-1">{pav.name}</h3>
                    <p className="text-xs text-[var(--color-fg-muted)] pt-0.5">{pav.size}</p>
                    <div className="pt-3 border-t border-[var(--color-border-default)] mt-3 flex items-baseline justify-between">
                      <span className="text-sm font-extrabold font-mono text-[var(--color-fg-default)]">
                        {formatCurrency(pav.rate)}
                      </span>
                      <span className="text-[10px] text-[var(--color-fg-muted)] font-mono">per night</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Interactive Booking Calculator Card */}
              <div
                style={getCardStyle()}
                className="p-6 sm:p-10 border shadow-xl space-y-8 bg-[var(--color-bg-default)]"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[var(--color-border-default)]">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-[var(--color-action-primary)] font-bold">
                      Selected Accommodation
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold font-serif">{currentPavilion.name}</h3>
                    <p className="text-xs text-[var(--color-fg-muted)] mt-1 max-w-lg">{currentPavilion.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-2xl sm:text-3xl font-extrabold font-mono text-[var(--color-fg-default)]">
                      {formatCurrency(grandTotal)}
                    </span>
                    <p className="text-[10px] font-mono text-[var(--color-fg-muted)]">
                      Total for {residencyNights} nights ({partySize} guests)
                    </p>
                  </div>
                </div>

                {/* Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Party Size */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase text-[var(--color-fg-muted)] font-semibold flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[var(--color-action-primary)]" />
                      <span>Party Size</span>
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 4, 6].map(num => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setPartySize(num)}
                          className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                            partySize === num
                              ? 'bg-[var(--color-action-primary)] text-[var(--color-action-primary-fg)] border-transparent'
                              : 'bg-[var(--color-bg-surface)] text-[var(--color-fg-default)] border-[var(--color-border-default)]'
                          }`}
                        >
                          {num} {num === 1 ? 'Guest' : 'Guests'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Length of Stay */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase text-[var(--color-fg-muted)] font-semibold flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[var(--color-action-primary)]" />
                      <span>Residency Nights</span>
                    </label>
                    <div className="flex gap-2">
                      {[2, 3, 5, 7].map(nights => (
                        <button
                          key={nights}
                          type="button"
                          onClick={() => setResidencyNights(nights)}
                          className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                            residencyNights === nights
                              ? 'bg-[var(--color-action-primary)] text-[var(--color-action-primary-fg)] border-transparent'
                              : 'bg-[var(--color-bg-surface)] text-[var(--color-fg-default)] border-[var(--color-border-default)]'
                          }`}
                        >
                          {nights} Nts
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sommelier Pairing Add-on */}
                  <div className="space-y-2 sm:self-center">
                    <label className="text-xs font-mono uppercase text-[var(--color-fg-muted)] font-semibold flex items-center gap-1.5">
                      <Wine className="w-3.5 h-3.5 text-[var(--color-action-primary)]" />
                      <span>Grand Cru Cellar Pairing</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setIncludeWinePairing(!includeWinePairing)}
                      className={`w-full py-2 px-3 text-xs font-bold rounded-lg border flex items-center justify-between transition-all ${
                        includeWinePairing
                          ? 'border-[var(--color-action-primary)] bg-[var(--color-action-primary)]/10 text-[var(--color-action-primary)]'
                          : 'border-[var(--color-border-default)] bg-[var(--color-bg-surface)] text-[var(--color-fg-muted)]'
                      }`}
                    >
                      <span>$175 / guest / night</span>
                      <span className="font-mono text-[10px]">{includeWinePairing ? '✓ INCLUDED' : '+ ADD'}</span>
                    </button>
                  </div>
                </div>

                {/* Features Pill Row */}
                <div className="pt-2 border-t border-[var(--color-border-default)] flex flex-wrap gap-2">
                  {currentPavilion.features.map((feat, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-[var(--color-bg-surface)] border border-[var(--color-border-default)] text-[var(--color-fg-muted)] flex items-center gap-1.5"
                    >
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>{feat}</span>
                    </span>
                  ))}
                </div>

                {/* Action CTA */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <span className="text-xs text-[var(--color-fg-muted)]">
                    Complimentary cancellation up to 14 days before arrival. Helicopter coordinates dispatched upon booking.
                  </span>
                  <button
                    type="button"
                    onClick={handleBooking}
                    style={getPrimaryBtnStyle()}
                    className="w-full sm:w-auto px-8 py-3 text-xs font-bold shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    {bookingConfirmed ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Calendar className="w-4 h-4" />}
                    <span>{bookingConfirmed ? 'Reservation Requested!' : 'Reserve Sanctuary Dates'}</span>
                  </button>
                </div>

                {bookingConfirmed && (
                  <p className="text-xs text-emerald-600 font-mono text-center pt-2">
                    ✓ Thank you. Our private estate concierge will contact you within 2 hours to coordinate your arrival logistics.
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* 5. 14-COURSE MICHELIN CULINARY SHOWCASE */}
        {isEnabled('culinary') && (
          <section id="culinary" className="w-full py-18 px-6 border-b border-[var(--color-border-default)]">
            <div className="max-w-5xl mx-auto space-y-12">
              <div className="text-center space-y-2 max-w-2xl mx-auto">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--color-action-primary)]">
                  Gastronomic Pilgrimage
                </span>
                <h2
                  className="text-2xl sm:text-4xl font-serif font-bold tracking-tight text-[var(--color-fg-default)]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Fourteen-course fire-crafted tasting experience
                </h2>
                <p className="text-sm text-[var(--color-fg-muted)]">
                  Every evening, 18 guests gather around the volcanic stone hearth. Sourced exclusively from regeneratively farmed alpine gardens, deep sea divers, and indigenous charcoal woodcraft.
                </p>
              </div>

              <div className="space-y-4">
                {TASTING_COURSES.map((course, idx) => (
                  <div
                    key={idx}
                    style={getCardStyle()}
                    className="p-6 border shadow-sm space-y-3 bg-[var(--color-bg-default)]"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-action-primary)]">
                        {course.course}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--color-bg-surface)] text-[var(--color-fg-muted)] w-fit">
                        Fire-Crafted
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-[var(--color-fg-default)]">{course.name}</h3>
                    <p className="text-xs text-[var(--color-fg-muted)] leading-relaxed">{course.desc}</p>

                    <div className="pt-2 border-t border-[var(--color-border-default)] flex items-center gap-2 text-xs font-mono text-[var(--color-fg-muted)]">
                      <Wine className="w-3.5 h-3.5 text-[var(--color-action-primary)] shrink-0" />
                      <span>Sommelier Pairing: {course.pairing}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 6. GEOTHERMAL SPRINGS & WELLNESS PILLARS */}
        {isEnabled('wellness') && (
          <section id="wellness" className="w-full py-18 px-6 border-b border-[var(--color-border-default)] bg-[var(--color-bg-surface)]">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-2 max-w-2xl mx-auto">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--color-action-primary)]">
                  Biological Restoration
                </span>
                <h2
                  className="text-2xl sm:text-4xl font-serif font-bold tracking-tight text-[var(--color-fg-default)]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Ancient thermal hydrotherapy & somatic stillness
                </h2>
                <p className="text-sm text-[var(--color-fg-muted)]">
                  Designed around circadian rhythm restoration, deep cellular recovery, and the therapeutic warmth of high-mineral alpine hot springs.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div style={getCardStyle()} className="p-6 border space-y-3 bg-[var(--color-bg-default)]">
                  <div className="w-8 h-8 rounded-lg bg-[var(--color-action-primary)]/10 text-[var(--color-action-primary)] flex items-center justify-center">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-[var(--color-fg-default)]">39.5°C Basalt Hot Springs</h4>
                  <p className="text-xs text-[var(--color-fg-muted)] leading-relaxed">
                    Seven natural outdoor baths carved directly into stone ridges, rich in sulfur and natural lithium.
                  </p>
                </div>

                <div style={getCardStyle()} className="p-6 border space-y-3 bg-[var(--color-bg-default)]">
                  <div className="w-8 h-8 rounded-lg bg-[var(--color-action-primary)]/10 text-[var(--color-action-primary)] flex items-center justify-center">
                    <Flame className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-[var(--color-fg-default)]">Yakisugi Cedar Saunas</h4>
                  <p className="text-xs text-[var(--color-fg-muted)] leading-relaxed">
                    Dry heat infused with wild pine resin, followed by immediate immersion in a pristine glacial cascade.
                  </p>
                </div>

                <div style={getCardStyle()} className="p-6 border space-y-3 bg-[var(--color-bg-default)]">
                  <div className="w-8 h-8 rounded-lg bg-[var(--color-action-primary)]/10 text-[var(--color-action-primary)] flex items-center justify-center">
                    <Moon className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-[var(--color-fg-default)]">Circadian Architecture</h4>
                  <p className="text-xs text-[var(--color-fg-muted)] leading-relaxed">
                    Zero electromagnetic noise, blackout acoustic timber louvers, and bespoke organic hemp bedding.
                  </p>
                </div>

                <div style={getCardStyle()} className="p-6 border space-y-3 bg-[var(--color-bg-default)]">
                  <div className="w-8 h-8 rounded-lg bg-[var(--color-action-primary)]/10 text-[var(--color-action-primary)] flex items-center justify-center">
                    <Trees className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-[var(--color-fg-default)]">Somatic Forest Bathing</h4>
                  <p className="text-xs text-[var(--color-fg-muted)] leading-relaxed">
                    Guided meditative walks through 420 hectares of protected old-growth fir with our resident naturalist.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 7. CRITIC & GASTRONOMY ACCLAIM */}
        {isEnabled('testimonials') && (
          <section id="reviews" className="w-full py-18 px-6 border-b border-[var(--color-border-default)]">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-2 max-w-2xl mx-auto">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--color-action-primary)]">
                  Critical Reception
                </span>
                <h2
                  className="text-2xl sm:text-4xl font-serif font-bold tracking-tight text-[var(--color-fg-default)]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Acclaimed by the world&apos;s leading arbiters of taste
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div style={getCardStyle()} className="p-8 border space-y-4">
                  <p className="text-xs sm:text-sm text-[var(--color-fg-default)] italic leading-relaxed">
                    &ldquo;SANCTUARY redefines contemporary hospitality. The seamless integration of hot springs hydrotherapy with three-star fire-crafted gastronomy is utterly singular.&rdquo;
                  </p>
                  <div className="pt-2 border-t border-[var(--color-border-default)]">
                    <p className="text-xs font-bold text-[var(--color-fg-default)]">The Michelin Guide</p>
                    <p className="text-[10px] text-amber-500 font-mono">★★★ Three Michelin Stars · 2026</p>
                  </div>
                </div>

                <div style={getCardStyle()} className="p-8 border space-y-4">
                  <p className="text-xs sm:text-sm text-[var(--color-fg-default)] italic leading-relaxed">
                    &ldquo;Stepping into the cedar onsen after a six-hour journey feels like an instant nervous system recalibration. The silence here has physical weight.&rdquo;
                  </p>
                  <div className="pt-2 border-t border-[var(--color-border-default)]">
                    <p className="text-xs font-bold text-[var(--color-fg-default)]">Architectural Digest</p>
                    <p className="text-[10px] text-[var(--color-fg-muted)] font-mono">Design Award of the Year</p>
                  </div>
                </div>

                <div style={getCardStyle()} className="p-8 border space-y-4">
                  <p className="text-xs sm:text-sm text-[var(--color-fg-default)] italic leading-relaxed">
                    &ldquo;The Hokkaido scallop with dashi glaze and the 45-day cedar-aged Wagyu represent the absolute zenith of seasonal culinary discipline.&rdquo;
                  </p>
                  <div className="pt-2 border-t border-[var(--color-border-default)]">
                    <p className="text-xs font-bold text-[var(--color-fg-default)]">The World&apos;s 50 Best</p>
                    <p className="text-[10px] text-[var(--color-fg-muted)] font-mono">Top 5 Global Retreats 2026</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 8. CONCIERGE & EXPERIENCE FAQ */}
        {isEnabled('faq') && (
          <section id="faq" className="w-full py-18 px-6 border-b border-[var(--color-border-default)] bg-[var(--color-bg-surface)]">
            <div className="max-w-4xl mx-auto space-y-10">
              <div className="text-center space-y-2">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--color-action-primary)]">
                  Estate Information
                </span>
                <h2
                  className="text-2xl sm:text-4xl font-serif font-bold tracking-tight text-[var(--color-fg-default)]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Frequently asked concierge questions
                </h2>
              </div>

              <div className="space-y-4">
                {FAQ_ITEMS.map((item, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={idx}
                      style={getCardStyle()}
                      className="border overflow-hidden transition-all bg-[var(--color-bg-default)]"
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

        {/* 9. FINAL INVITATION CTA */}
        {isEnabled('cta') && (
          <section className="w-full py-20 px-6 border-b border-[var(--color-border-default)] bg-[var(--color-action-primary)] text-[var(--color-action-primary-fg)] relative overflow-hidden">
            <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
              <h2
                className="text-3xl sm:text-5xl font-serif font-extrabold tracking-tight"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Your sanctuary awaits amidst the clouds
              </h2>
              <p className="text-sm sm:text-base opacity-90 max-w-xl mx-auto leading-relaxed">
                Only eighteen guests each evening. Reserve your pavilion and dining table for the upcoming solstice season.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <a
                  href="#booking"
                  className="px-8 py-3.5 rounded-lg text-sm font-bold bg-[var(--color-bg-default)] text-[var(--color-fg-default)] shadow-xl hover:opacity-95"
                >
                  Reserve Private Pavilion
                </a>
                <a
                  href="#faq"
                  className="px-8 py-3.5 rounded-lg text-sm font-bold border border-current text-[var(--color-action-primary-fg)] hover:bg-black/10 transition-colors"
                >
                  Contact Chief Concierge
                </a>
              </div>
            </div>
          </section>
        )}

        {/* 10. Components Showcase & Type Specimen (Doc 02 §4.3 mandatory) */}
        {(isEnabled('components') || isEnabled('componentsShowcase')) && <ComponentsShowcase />}
        <TypeSpecimen />
      </main>

      {/* 11. Luxury Editorial Footer */}
      <footer className="w-full py-16 px-6 bg-[var(--color-bg-default)] text-[var(--color-fg-muted)] text-xs border-t border-[var(--color-border-default)]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[var(--color-action-primary)] text-[var(--color-action-primary-fg)] flex items-center justify-center">
                  <Compass className="w-3.5 h-3.5" />
                </div>
                <span className="font-serif italic font-bold text-sm tracking-tight text-[var(--color-fg-default)]">
                  {brandName}
                </span>
              </div>
              <p className="text-[11px] max-w-sm leading-relaxed">
                SANCTUARY Alpine Estate & Geothermal Mineral Springs. Member of Relais & Châteaux Grand Chef Trophy. Private Helipad Coordinates: 46°30&apos;12&quot;N 8°14&apos;45&quot;E.
              </p>
            </div>

            <div className="space-y-3">
              <span className="font-bold text-[var(--color-fg-default)] uppercase tracking-wider text-[10px] font-mono">The Estate</span>
              <ul className="space-y-2 text-[11px]">
                <li><a href="#booking" className="hover:text-[var(--color-fg-default)] transition-colors">Private Pavilions</a></li>
                <li><a href="#wellness" className="hover:text-[var(--color-fg-default)] transition-colors">Geothermal Hot Springs</a></li>
                <li><a href="#culinary" className="hover:text-[var(--color-fg-default)] transition-colors">Michelin 3-Star Dining</a></li>
                <li><a href="#wellness" className="hover:text-[var(--color-fg-default)] transition-colors">Yakisugi Forest Saunas</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <span className="font-bold text-[var(--color-fg-default)] uppercase tracking-wider text-[10px] font-mono">Experiences</span>
              <ul className="space-y-2 text-[11px]">
                <li><a href="#culinary" className="hover:text-[var(--color-fg-default)] transition-colors">14-Course Hearth Journey</a></li>
                <li><a href="#wellness" className="hover:text-[var(--color-fg-default)] transition-colors">Botanical Foraging Walks</a></li>
                <li><a href="#booking" className="hover:text-[var(--color-fg-default)] transition-colors">Grand Cru Cellar Tasting</a></li>
                <li><a href="#faq" className="hover:text-[var(--color-fg-default)] transition-colors">Private Heli-Ski Expeditions</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <span className="font-bold text-[var(--color-fg-default)] uppercase tracking-wider text-[10px] font-mono">Reservations</span>
              <ul className="space-y-2 text-[11px]">
                <li><a href="#booking" className="hover:text-[var(--color-fg-default)] transition-colors">Seasonal Booking Portal</a></li>
                <li><a href="#faq" className="hover:text-[var(--color-fg-default)] transition-colors">Full Estate Buyouts</a></li>
                <li><a href="#faq" className="hover:text-[var(--color-fg-default)] transition-colors">Helicopter Logistics</a></li>
                <li><a href="#faq" className="hover:text-[var(--color-fg-default)] transition-colors">Concierge Desk</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[var(--color-border-default)] flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono">
            <span>&copy; {new Date().getFullYear()} {brandName}. All rights reserved.</span>
            <div className="flex gap-4">
              <span>Relais & Châteaux</span>
              <span>Michelin Three Stars</span>
              <span>Certified Carbon Neutral Sanctuary</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
