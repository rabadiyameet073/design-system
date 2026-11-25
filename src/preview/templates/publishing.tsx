import React, { useState } from 'react';
import {
  BookOpen,
  Feather,
  Clock,
  Radio,
  CheckCircle2,
  ArrowRight,
  Play,
  Pause,
  Volume2,
  FileText,
  Mail,
  ChevronDown,
  ChevronUp,
  Award,
  Sparkles,
  Check,
  Bookmark,
  Share2,
  Headphones,
  Printer
} from 'lucide-react';
import {
  ComponentsShowcase,
  TypeSpecimen,
  GenreOfferings
} from '../sections';
import { TemplateProps } from './index';

export const PublishingTemplate: React.FC<TemplateProps> = ({
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
  const brandName = content?.brandName || brandNameProp || 'CHRONICLE Journal of Ideas & Culture';
  const headline = headlineProp || content?.headline;
  const subtitle = subtitleProp || content?.subtitle;
  const badge = content?.badge || badgeProp || 'Volume XVI · Issue 04 · Autumn Critical Essays';
  const heroImage = content?.heroImage || heroImageProp;
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState<'1x' | '1.25x' | '1.5x'>('1x');
  const [selectedTier, setSelectedTier] = useState<'digital' | 'patron' | 'fellow'>('patron');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribedSuccess, setSubscribedSuccess] = useState(false);

  const enabled = components?.enabledComponents;
  const isSectionEnabled = (section: string) => {
    if (section === 'hero' || section === 'announcement' || section === 'components' || section === 'type') {
      return true;
    }
    if (!enabled || enabled.length === 0) return true;

    const moduleMapping: Record<string, string[]> = {
      essays: ['product-card', 'essays', 'articles', 'articleList', 'news', 'stories'],
      audio: ['metrics-row', 'audio', 'features', 'podcast'],
      print: ['product-card', 'print', 'gallery', 'monograph'],
      subscription: ['pricing-matrix', 'subscription', 'pricing', 'pricing-tier'],
      testimonials: ['reviews-grid', 'testimonials', 'reviews', 'customer-review'],
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

  const ESSAYS = [
    {
      category: 'Color Science & Computation',
      title: 'The Perceptual Color Revolution: Why OKLCH Replaced Thirty Years of Broken RGB Mathematics',
      author: 'Dr. Elena Rostova',
      readTime: '8 min read',
      date: 'October 14, 2026',
      excerpt: 'Human eyes do not perceive electromagnetic wavelengths in linear coordinates. An inside look at how perceptual color spaces transformed browser typography, display gamuts, and algorithmic accessibility.'
    },
    {
      category: 'Sustainable Architecture',
      title: 'Monolithic Mass Timber & The Structural Evolution of Low-Carbon Alpine High-Rises',
      author: 'Marcus Lindholm',
      readTime: '12 min read',
      date: 'October 8, 2026',
      excerpt: 'Cross-laminated timber towers are sequestering thousands of tons of atmospheric carbon while re-introducing organic grain, acoustic tranquility, and biophilic tactile warmth into dense urban skylines.'
    },
    {
      category: 'Typography & Materiality',
      title: 'Tactile Typography: Reviving Dutch Metal Punch-Cutting in Modern Variable Web Fonts',
      author: 'Astrid de Vries',
      readTime: '9 min read',
      date: 'September 29, 2026',
      excerpt: 'How variable font axes, sub-pixel optical sizing, and high-DPI displays are finally achieving the nuanced physical ink-trapping and optical weight of sixteenth-century movable lead type.'
    },
    {
      category: 'Digital Philosophy',
      title: 'The Death of the Sterile Grey SaaS Card: Toward Emotional Craft and Spatial Stillness',
      author: 'Soren Thorne',
      readTime: '11 min read',
      date: 'September 22, 2026',
      excerpt: 'A critical manifest on overcoming algorithmic homogeny in modern digital design systems in favor of visceral warmth, intentional friction, and editorial dignity.'
    }
  ];

  const FAQ_ITEMS = [
    {
      q: 'How often are physical print editions published and shipped?',
      a: 'CHRONICLE publishes four heirloom print editions annually corresponding with the solstices and equinoxes. Each issue is printed in Verona, Italy on 140gsm FSC-certified Mohawk Superfine uncoated paper with foil-stamped linen hardcovers, shipped worldwide via tracked courier.'
    },
    {
      q: 'What is included in the digital patron subscription?',
      a: 'Digital subscribers receive unrestricted access to our complete historical archive dating back to 2018, full-length audio narrations of all long-form essays recorded by professional voice actors, and our weekly Sunday Morning Dispatch.'
    },
    {
      q: 'Can university libraries and research institutions license institutional access?',
      a: 'Yes. We offer IP-based campus-wide site licenses, EZproxy authentication, and complete digital DOI archives for academic institutions, design faculties, and public libraries globally.'
    },
    {
      q: 'How can independent essayists and researchers pitch contributions?',
      a: 'We welcome unsolicited long-form pitches exploring architecture, computational culture, typography, and aesthetic philosophy. Pitches should be 400 words outlining the core thesis, primary research sources, and narrative arc.'
    }
  ];

  const handleSubscribeNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribedSuccess(true);
    setTimeout(() => {
      setSubscribedSuccess(false);
      setNewsletterEmail('');
    }, 4000);
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-[var(--color-bg-default)] text-[var(--color-fg-default)] font-sans antialiased selection:bg-[var(--color-action-primary)] selection:text-[var(--color-action-primary-fg)]">
      {/* 1. Masthead / Ticker Bar */}
      {isEnabled('announcement') && (
        <aside
          aria-label="Editorial Dispatch Notice"
          className="w-full py-2.5 px-4 bg-[var(--color-bg-surface)] text-[var(--color-fg-muted)] border-b border-[var(--color-border-default)] text-xs text-center font-serif tracking-widest flex items-center justify-center gap-2"
        >
          <Feather className="w-3.5 h-3.5 text-[var(--color-action-primary)]" />
          <span className="truncate">
            VOLUME XVI · ISSUE 04 · THE MACHINE &amp; THE HAND · CIRCULATED IN 48 COUNTRIES · PRINT &amp; AUDIO DISPATCHES NOW ACCESSIBLE
          </span>
        </aside>
      )}

      {/* 2. Classical Editorial Header */}
      <header className="w-full border-b sticky top-0 z-40 backdrop-blur-md bg-[var(--color-bg-default)]/90 border-[var(--color-border-default)]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--color-action-primary)] text-[var(--color-action-primary-fg)] flex items-center justify-center shadow-md">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif italic font-extrabold text-xl tracking-tight">{brandName}</span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-mono uppercase tracking-widest text-[var(--color-fg-muted)] border-l pl-2 border-[var(--color-border-default)]">
                Ideas &amp; Monograph Press
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--color-fg-muted)]">
            <a href="#essays" className="hover:text-[var(--color-fg-default)] transition-colors">Critical Essays</a>
            <a href="#audio" className="hover:text-[var(--color-fg-default)] transition-colors">Audio Dispatches</a>
            <a href="#print" className="hover:text-[var(--color-fg-default)] transition-colors">Print Monograph</a>
            <a href="#membership" className="hover:text-[var(--color-fg-default)] transition-colors">Membership</a>
            <a href="#faq" className="hover:text-[var(--color-fg-default)] transition-colors">Submissions</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="text-xs font-semibold px-3 py-2 text-[var(--color-fg-muted)] hover:text-[var(--color-fg-default)] transition-colors"
            >
              Sign In
            </button>
            <a
              href="#membership"
              style={getPrimaryBtnStyle()}
              className="px-4 py-2 text-xs font-bold shadow-sm hover:opacity-95"
            >
              Subscribe
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* 3. Grand Lead Essay / Hero Feature */}
        {isEnabled('hero') && (
          <section className="relative w-full py-16 sm:py-24 px-6 border-b border-[var(--color-border-default)]">
            <div className="max-w-5xl mx-auto space-y-10">
              <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-wider text-[var(--color-action-primary)] font-bold">
                <span className="px-2.5 py-1 rounded-md bg-[var(--color-action-primary)]/10">COVER MONOGRAPH</span>
                <span>{badge}</span>
              </div>

              <h1
                className="text-3xl sm:text-5xl md:text-6xl font-serif font-extrabold tracking-tight leading-[1.12] text-[var(--color-fg-default)]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {headline || 'The Architecture of Silence: Why modern software must learn from stone, shadow, and monastic craft'}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-xs text-[var(--color-fg-muted)] pb-6 border-b border-[var(--color-border-default)]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-action-primary)]/20 text-[var(--color-action-primary)] font-bold text-xs flex items-center justify-center font-mono">
                    JV
                  </div>
                  <div>
                    <span className="font-bold text-[var(--color-fg-default)]">Julian Vance</span>
                    <p className="text-[10px]">Senior Fellow, Spatial Systems Institute</p>
                  </div>
                </div>
                <span>·</span>
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5" /> 14 min read
                </span>
                <span>·</span>
                <span className="flex items-center gap-1 font-mono text-emerald-600">
                  <Headphones className="w-3.5 h-3.5" /> Audio Edition: 22:40
                </span>
              </div>

              {/* Lead Paragraph with Drop Cap */}
              <div className="max-w-3xl space-y-6 text-base sm:text-lg text-[var(--color-fg-muted)] leading-relaxed font-serif">
                <p>
                  <span className="float-left text-5xl sm:text-6xl font-serif font-bold text-[var(--color-fg-default)] mr-3 leading-none select-none">
                    A
                  </span>
                  s algorithmic social feeds and synthetic telemetry fragment human cognition into frantic micro-stimuli, a quiet counter-revolution is emerging among software architects, typographers, and spatial designers. They are looking beyond ephemeral software templates to the permanence of monolithic stone, the thermal serenity of alpine timber, and the enduring dignity of physical print.
                </p>
                <p>
                  The modern screen does not suffer from a lack of pixels; it suffers from a deficit of reverence. When every interface looks like an identical grey dashboard created by an indifferent committee, we lose the tactile humanity that makes creative technology worth pursuing.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#essays"
                  style={getPrimaryBtnStyle()}
                  className="px-6 py-3.5 text-xs font-bold shadow-md hover:opacity-95 flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Read Full Essay Monograph</span>
                </a>
                <a
                  href="#audio"
                  className="px-6 py-3.5 text-xs font-bold rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] text-[var(--color-fg-default)] hover:bg-[var(--color-bg-default)] transition-colors flex items-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 text-[var(--color-action-primary)]" />
                  <span>Listen to Audio Narration (22m)</span>
                </a>
              </div>
            </div>
          </section>
        )}

        {/* 4. CRITICAL ESSAYS GRID */}
        {isEnabled('essays') && (
          <section id="essays" className="w-full py-18 px-6 border-b border-[var(--color-border-default)]">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[var(--color-border-default)]">
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--color-action-primary)]">
                    Autumn 2026 Table of Contents
                  </span>
                  <h2
                    className="text-2xl sm:text-4xl font-serif font-bold tracking-tight text-[var(--color-fg-default)]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    Featured critical dispatches &amp; investigations
                  </h2>
                </div>
                <span className="text-xs font-mono text-[var(--color-fg-muted)]">
                  Published Weekly · Fully Open-Access Archives
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {ESSAYS.map((essay, idx) => (
                  <article
                    key={idx}
                    style={getCardStyle()}
                    className="p-8 border shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-[var(--color-action-primary)] font-bold uppercase tracking-wider">
                          {essay.category}
                        </span>
                        <span className="text-[var(--color-fg-muted)]">{essay.date}</span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-[var(--color-fg-default)] hover:text-[var(--color-action-primary)] transition-colors cursor-pointer leading-snug">
                        {essay.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] leading-relaxed font-serif">
                        {essay.excerpt}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[var(--color-border-default)] flex items-center justify-between text-xs font-mono text-[var(--color-fg-muted)]">
                      <span className="font-semibold text-[var(--color-fg-default)]">By {essay.author}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {essay.readTime}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 5. INTERACTIVE AUDIO DISPATCH / PODCAST PLAYER */}
        {isEnabled('audio') && (
          <section id="audio" className="w-full py-16 px-6 border-b border-[var(--color-border-default)] bg-[var(--color-bg-surface)]">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--color-fg-default)]">
                    Chronicle Audio Dispatches · Episode 42
                  </span>
                </div>
                <span className="text-xs font-mono text-[var(--color-fg-muted)]">Recorded at Alpine Studio</span>
              </div>

              {/* Audio Player Card */}
              <div
                style={getCardStyle()}
                className="p-6 sm:p-8 border shadow-lg space-y-6 bg-[var(--color-bg-default)]"
              >
                <div className="space-y-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-[var(--color-action-primary)] font-bold">
                    Now Playing Audio Essay
                  </span>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-[var(--color-fg-default)]">
                    The Geometry of Type &amp; Spatial Aesthetics with Hermann Zapf Archive Curator
                  </h3>
                  <p className="text-xs text-[var(--color-fg-muted)]">
                    Narrated by Astrid Lindemann · High-Fidelity 24-bit Flac Master Available
                  </p>
                </div>

                {/* Scrubber Bar */}
                <div className="space-y-2">
                  <div className="w-full h-2 rounded-full bg-[var(--color-bg-surface)] overflow-hidden cursor-pointer relative">
                    <div className="h-full bg-[var(--color-action-primary)] w-1/3 rounded-full" />
                  </div>
                  <div className="flex justify-between text-[11px] font-mono text-[var(--color-fg-muted)]">
                    <span>11:24</span>
                    <span>34:12</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                      style={getPrimaryBtnStyle()}
                      className="w-12 h-12 rounded-full flex items-center justify-center shadow-md hover:opacity-95"
                    >
                      {isPlayingAudio ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                    </button>
                    <div>
                      <span className="text-xs font-bold font-mono block">
                        {isPlayingAudio ? 'Playing Audio' : 'Paused'}
                      </span>
                      <span className="text-[10px] text-[var(--color-fg-muted)] font-mono">Stereo 48kHz</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[var(--color-fg-muted)] mr-1">Speed:</span>
                    {(['1x', '1.25x', '1.5x'] as const).map(speed => (
                      <button
                        key={speed}
                        type="button"
                        onClick={() => setAudioSpeed(speed)}
                        className={`px-2.5 py-1 text-xs font-mono font-bold rounded border transition-all ${
                          audioSpeed === speed
                            ? 'bg-[var(--color-action-primary)] text-[var(--color-action-primary-fg)] border-[var(--color-action-primary)]'
                            : 'bg-[var(--color-bg-surface)] text-[var(--color-fg-muted)] border-[var(--color-border-default)]'
                        }`}
                      >
                        {speed}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 6. MONOGRAPH PRINT EDITION SHOWCASE */}
        {isEnabled('print') && (
          <section id="print" className="w-full py-18 px-6 border-b border-[var(--color-border-default)]">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[var(--color-action-primary)]/10 text-xs font-mono font-bold text-[var(--color-action-primary)]">
                    <Printer className="w-3.5 h-3.5" />
                    <span>QUARTERLY PRINT MONOGRAPH · ISSUE 04</span>
                  </div>

                  <h2
                    className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-[var(--color-fg-default)] leading-tight"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    Crafted to be held, annotated, and preserved on the physical shelf
                  </h2>

                  <p className="text-sm text-[var(--color-fg-muted)] leading-relaxed font-serif">
                    Printed in Verona, Italy on heavy 140gsm FSC-certified Mohawk Superfine uncoated stock. Features smyth-sewn lay-flat bookbinding, custom foil-embossed linen bookcloth, and zero chemical laminates.
                  </p>

                  <div className="grid grid-cols-2 gap-4 text-xs font-mono pt-2">
                    <div className="p-3 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-surface)]">
                      <span className="font-bold text-[var(--color-fg-default)] block">240 Pages</span>
                      <span className="text-[10px] text-[var(--color-fg-muted)]">Heirloom Monograph</span>
                    </div>
                    <div className="p-3 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-surface)]">
                      <span className="font-bold text-[var(--color-fg-default)] block">Mohawk 140gsm</span>
                      <span className="text-[10px] text-[var(--color-fg-muted)]">Uncoated Pure White</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <a
                      href="#membership"
                      style={getPrimaryBtnStyle()}
                      className="px-7 py-3.5 text-xs font-bold shadow-md hover:opacity-95 inline-flex items-center gap-2"
                    >
                      <span>Acquire Single Copy ($38) or Subscribe</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Print Book Mockup Graphic */}
                <div
                  style={getCardStyle()}
                  className="p-8 sm:p-12 border shadow-2xl bg-[var(--color-bg-surface)] text-center space-y-6"
                >
                  <div className="w-56 h-72 mx-auto rounded-xl bg-neutral-900 text-neutral-100 p-6 shadow-2xl flex flex-col justify-between text-left font-serif border border-neutral-800">
                    <div className="space-y-1">
                      <span className="text-[10px] tracking-widest uppercase font-mono text-neutral-400">CHRONICLE XVI</span>
                      <h4 className="text-base font-bold italic tracking-wide text-neutral-100">THE MACHINE &amp; THE HAND</h4>
                    </div>
                    <div className="space-y-1 text-[9px] font-mono text-neutral-400 border-t border-neutral-800 pt-3">
                      <p>AUTUMN MONOGRAPH</p>
                      <p>VERONA · ZURICH · TOKYO</p>
                    </div>
                  </div>
                  <p className="text-xs font-mono text-[var(--color-fg-muted)]">
                    Worldwide DHL Express tracked delivery included with annual patron membership.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 7. PATRON MEMBERSHIP & SUBSCRIPTION TIERS */}
        {isEnabled('subscription') && (
          <section id="membership" className="w-full py-18 px-6 border-b border-[var(--color-border-default)] bg-[var(--color-bg-surface)]">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-2 max-w-2xl mx-auto">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--color-action-primary)]">
                  Reader Supported
                </span>
                <h2
                  className="text-2xl sm:text-4xl font-serif font-bold tracking-tight text-[var(--color-fg-default)]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Join the Chronicle Patron Society
                </h2>
                <p className="text-sm text-[var(--color-fg-muted)]">
                  Independent journalism funded 100% by readers. Zero programmatic tracking, zero corporate banner advertising.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Tier 1: Digital */}
                <div
                  style={getCardStyle()}
                  className="p-8 border shadow-sm space-y-6 flex flex-col justify-between bg-[var(--color-bg-default)]"
                >
                  <div className="space-y-4">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-fg-muted)]">
                      Digital Reader
                    </span>
                    <div className="space-y-1">
                      <span className="text-3xl font-serif font-bold text-[var(--color-fg-default)]">$9 / mo</span>
                      <p className="text-xs text-[var(--color-fg-muted)]">Billed annually or monthly</p>
                    </div>
                    <ul className="text-xs text-[var(--color-fg-muted)] space-y-2.5 pt-4 border-t border-[var(--color-border-default)]">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Unlimited access to full digital monograph archive</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>All audio essay narrations in lossless audio</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Weekly Sunday Morning Dispatch email</span>
                      </li>
                    </ul>
                  </div>
                  <button
                    type="button"
                    style={getPrimaryBtnStyle()}
                    className="w-full py-3 text-xs font-bold"
                  >
                    Select Digital
                  </button>
                </div>

                {/* Tier 2: Print & Digital Patron */}
                <div
                  style={getCardStyle()}
                  className="p-8 border-2 shadow-xl space-y-6 flex flex-col justify-between relative bg-[var(--color-bg-default)] border-[var(--color-action-primary)]"
                >
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[var(--color-action-primary)] text-[var(--color-action-primary-fg)] text-[10px] font-mono font-bold uppercase tracking-wider shadow-md">
                    Most Cherished
                  </div>
                  <div className="space-y-4">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-action-primary)]">
                      Print &amp; Digital Patron
                    </span>
                    <div className="space-y-1">
                      <span className="text-3xl font-serif font-bold text-[var(--color-fg-default)]">$24 / mo</span>
                      <p className="text-xs text-[var(--color-fg-muted)]">($240 / year billed annually)</p>
                    </div>
                    <ul className="text-xs text-[var(--color-fg-muted)] space-y-2.5 pt-4 border-t border-[var(--color-border-default)]">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Four clothbound quarterly print monographs shipped</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Full unlimited digital archive and audio narrations</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Invitations to private editorial salons in Zurich &amp; Tokyo</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Worldwide tracked courier delivery included</span>
                      </li>
                    </ul>
                  </div>
                  <button
                    type="button"
                    style={getPrimaryBtnStyle()}
                    className="w-full py-3 text-xs font-bold shadow-md"
                  >
                    Join as Patron
                  </button>
                </div>

                {/* Tier 3: Founding Fellow */}
                <div
                  style={getCardStyle()}
                  className="p-8 border shadow-sm space-y-6 flex flex-col justify-between bg-[var(--color-bg-default)]"
                >
                  <div className="space-y-4">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-fg-muted)]">
                      Founding Fellow
                    </span>
                    <div className="space-y-1">
                      <span className="text-3xl font-serif font-bold text-[var(--color-fg-default)]">$180 / yr</span>
                      <p className="text-xs text-[var(--color-fg-muted)]">Heirloom supporter endowment</p>
                    </div>
                    <ul className="text-xs text-[var(--color-fg-muted)] space-y-2.5 pt-4 border-t border-[var(--color-border-default)]">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>All print and digital patron privileges</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Name credited in the printed monograph masthead</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Annual limited-edition letterpress art print</span>
                      </li>
                    </ul>
                  </div>
                  <button
                    type="button"
                    className="w-full py-3 text-xs font-bold rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] text-[var(--color-fg-default)] hover:bg-[var(--color-bg-default)] transition-colors"
                  >
                    Endow as Fellow
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 8. READER & CRITIC ACCLAIM */}
        {isEnabled('testimonials') && (
          <section className="w-full py-18 px-6 border-b border-[var(--color-border-default)]">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-2 max-w-2xl mx-auto">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--color-action-primary)]">
                  Critical Esteem
                </span>
                <h2
                  className="text-2xl sm:text-4xl font-serif font-bold tracking-tight text-[var(--color-fg-default)]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  What the international press says
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div style={getCardStyle()} className="p-8 border space-y-4">
                  <p className="text-xs sm:text-sm text-[var(--color-fg-default)] italic font-serif leading-relaxed">
                    &ldquo;In an age of five-second viral attention spans, CHRONICLE represents a courageous return to depth, philosophical rigor, and impeccable physical bookcraft.&rdquo;
                  </p>
                  <div className="pt-2 border-t border-[var(--color-border-default)]">
                    <p className="text-xs font-bold text-[var(--color-fg-default)]">The London Review</p>
                    <p className="text-[10px] text-[var(--color-fg-muted)] font-mono">Literary Review of the Year</p>
                  </div>
                </div>

                <div style={getCardStyle()} className="p-8 border space-y-4">
                  <p className="text-xs sm:text-sm text-[var(--color-fg-default)] italic font-serif leading-relaxed">
                    &ldquo;The typography alone makes the print monograph worth preserving for decades. Uncompromising editorial standards.&rdquo;
                  </p>
                  <div className="pt-2 border-t border-[var(--color-border-default)]">
                    <p className="text-xs font-bold text-[var(--color-fg-default)]">Monocle Magazine</p>
                    <p className="text-[10px] text-[var(--color-fg-muted)] font-mono">Top Independent Press 2026</p>
                  </div>
                </div>

                <div style={getCardStyle()} className="p-8 border space-y-4">
                  <p className="text-xs sm:text-sm text-[var(--color-fg-default)] italic font-serif leading-relaxed">
                    &ldquo;The audio dispatches have become an indispensable weekly ritual. Deep thinking paired with masterful voice craftsmanship.&rdquo;
                  </p>
                  <div className="pt-2 border-t border-[var(--color-border-default)]">
                    <p className="text-xs font-bold text-[var(--color-fg-default)]">The Paris Review Salon</p>
                    <p className="text-[10px] text-[var(--color-fg-muted)] font-mono">Cultural Podcast Recommendation</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 9. SUBMISSIONS & CIRCULATION FAQ */}
        {isEnabled('faq') && (
          <section id="faq" className="w-full py-18 px-6 border-b border-[var(--color-border-default)] bg-[var(--color-bg-surface)]">
            <div className="max-w-4xl mx-auto space-y-10">
              <div className="text-center space-y-2">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--color-action-primary)]">
                  Submissions &amp; Details
                </span>
                <h2
                  className="text-2xl sm:text-4xl font-serif font-bold tracking-tight text-[var(--color-fg-default)]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Frequently asked editorial questions
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

        {/* 10. NEWSLETTER CALLOUT BANNER */}
        {isEnabled('cta') && (
          <section className="w-full py-20 px-6 border-b border-[var(--color-border-default)] bg-[var(--color-action-primary)] text-[var(--color-action-primary-fg)] relative overflow-hidden">
            <div className="max-w-3xl mx-auto text-center space-y-6 relative z-10">
              <h2
                className="text-3xl sm:text-5xl font-serif font-extrabold tracking-tight"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Receive the Sunday Morning Dispatch
              </h2>
              <p className="text-sm sm:text-base opacity-90 max-w-xl mx-auto leading-relaxed font-serif">
                Join 65,000 discerning readers. One curated long-form essay, three architectural monographs, and one musical composition every Sunday morning.
              </p>

              <form onSubmit={handleSubscribeNewsletter} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  value={newsletterEmail}
                  onChange={e => setNewsletterEmail(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-lg text-xs bg-[var(--color-bg-default)] text-[var(--color-fg-default)] border border-transparent focus:outline-none focus:ring-2 focus:ring-current"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-lg text-xs font-bold bg-[var(--color-bg-default)] text-[var(--color-fg-default)] shadow-lg hover:opacity-95"
                >
                  {subscribedSuccess ? 'Subscribed!' : 'Subscribe Free'}
                </button>
              </form>

              {subscribedSuccess && (
                <p className="text-xs font-mono opacity-90">
                  ✓ Welcome to the Sunday Dispatch. Please check your inbox for our introductory monograph.
                </p>
              )}
            </div>
          </section>
        )}

        {/* 11. Components & Type Specimen (Doc 02 §4.3 mandatory) */}
        <GenreOfferings content={content} />
        {(isEnabled('components') || isEnabled('componentsShowcase')) && <ComponentsShowcase />}
        <TypeSpecimen />
      </main>

      {/* 12. Classic Masthead Footer */}
      <footer className="w-full py-16 px-6 bg-[var(--color-bg-default)] text-[var(--color-fg-muted)] text-xs border-t border-[var(--color-border-default)] font-serif">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[var(--color-action-primary)] text-[var(--color-action-primary-fg)] flex items-center justify-center">
                  <BookOpen className="w-3.5 h-3.5" />
                </div>
                <span className="font-serif italic font-extrabold text-sm tracking-tight text-[var(--color-fg-default)]">
                  {brandName}
                </span>
              </div>
              <p className="text-[11px] max-w-sm leading-relaxed">
                CHRONICLE is an independent quarterly journal of computational aesthetics, architecture, and cultural critique. Published in Zurich and Verona. ISSN 2841-9204.
              </p>
            </div>

            <div className="space-y-3 font-sans">
              <span className="font-bold text-[var(--color-fg-default)] uppercase tracking-wider text-[10px] font-mono">Sections</span>
              <ul className="space-y-2 text-[11px]">
                <li><a href="#essays" className="hover:text-[var(--color-fg-default)] transition-colors">Critical Essays</a></li>
                <li><a href="#audio" className="hover:text-[var(--color-fg-default)] transition-colors">Audio Dispatches</a></li>
                <li><a href="#print" className="hover:text-[var(--color-fg-default)] transition-colors">Print Monograph</a></li>
                <li><a href="#essays" className="hover:text-[var(--color-fg-default)] transition-colors">Architecture Archives</a></li>
              </ul>
            </div>

            <div className="space-y-3 font-sans">
              <span className="font-bold text-[var(--color-fg-default)] uppercase tracking-wider text-[10px] font-mono">Society</span>
              <ul className="space-y-2 text-[11px]">
                <li><a href="#membership" className="hover:text-[var(--color-fg-default)] transition-colors">Patron Membership</a></li>
                <li><a href="#membership" className="hover:text-[var(--color-fg-default)] transition-colors">University Library Access</a></li>
                <li><a href="#faq" className="hover:text-[var(--color-fg-default)] transition-colors">Editorial Guidelines</a></li>
                <li><a href="#faq" className="hover:text-[var(--color-fg-default)] transition-colors">Pitch Contributions</a></li>
              </ul>
            </div>

            <div className="space-y-3 font-sans">
              <span className="font-bold text-[var(--color-fg-default)] uppercase tracking-wider text-[10px] font-mono">Archives</span>
              <ul className="space-y-2 text-[11px]">
                <li><a href="#print" className="hover:text-[var(--color-fg-default)] transition-colors">Issue XVI: The Machine</a></li>
                <li><a href="#print" className="hover:text-[var(--color-fg-default)] transition-colors">Issue XV: Monolithic Stone</a></li>
                <li><a href="#print" className="hover:text-[var(--color-fg-default)] transition-colors">Issue XIV: Color Science</a></li>
                <li><a href="#print" className="hover:text-[var(--color-fg-default)] transition-colors">Print Back Catalog</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[var(--color-border-default)] flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono">
            <span>&copy; {new Date().getFullYear()} {brandName}. Printed on Mohawk Superfine.</span>
            <div className="flex gap-4">
              <span>ISSN 2841-9204</span>
              <span>Member Ethical Journalism Initiative</span>
              <span>Zero Tracking Policy</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
