import React, { useState, useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion
} from 'motion/react';
import {
  Palette,
  Type,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Compass,
  Code2
} from 'lucide-react';

interface DesignSystemAnatomyProps {
  onStartNew: () => void;
}

export const DesignSystemAnatomy: React.FC<DesignSystemAnatomyProps> = ({ onStartNew }) => {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activePillar, setActivePillar] = useState<number>(1);
  const isHoveringRef = useRef<boolean>(false);

  // Scroll tracking across the pinned multi-viewport scroll container
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end']
  });

  // Parallax translation transforms ("all move" as user scrolls)
  const cloudX = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const cloudY = useTransform(scrollYProgress, [0, 1], [0, 20]);
  const ambientGlowScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 1]);

  // Sequential 1 -> 2 -> 3 -> 4 scroll progression
  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    // If the user is actively hovering on a specific panel, let hover hold until wheel or scroll
    if (isHoveringRef.current) return;

    if (progress < 0.25) {
      setActivePillar(1);
    } else if (progress < 0.5) {
      setActivePillar(2);
    } else if (progress < 0.75) {
      setActivePillar(3);
    } else {
      setActivePillar(4);
    }
  });

  // Wheel scrolling resets hover lock so mouse-wheel always drives progression
  const handleWheel = () => {
    isHoveringRef.current = false;
  };

  // Smooth scroll to a specific pillar step when clicked
  const scrollToPillar = (id: number) => {
    isHoveringRef.current = false;
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const scrollTop = window.scrollY + rect.top;
    const totalScroll = sectionRef.current.offsetHeight - window.innerHeight;
    const targetProgress = (id - 1) / 3.2; // place in comfortable middle of that step
    const targetScroll = scrollTop + totalScroll * Math.min(1, Math.max(0, targetProgress));
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    setActivePillar(id);
  };

  const handleMouseEnter = (id: number) => {
    isHoveringRef.current = true;
    setActivePillar(id);
  };

  const handleTrackMouseLeave = () => {
    isHoveringRef.current = false;
    // Resync with current scroll position
    const progress = scrollYProgress.get();
    if (progress < 0.25) setActivePillar(1);
    else if (progress < 0.5) setActivePillar(2);
    else if (progress < 0.75) setActivePillar(3);
    else setActivePillar(4);
  };

  const pillars = [
    {
      id: 1,
      numStr: '01',
      badge: 'Reflective Soul',
      title: 'Brand Soul & Visual Direction',
      subtitle: 'Energy, emotional tone & artistic personality',
      summary:
        'A website’s emotional tone is felt in the first 50 milliseconds. Studio captures brand energy, temperament, and artistic intent first—so colors, type scale, and micro-interactions never fight each other.',
      pills: ['Warm Editorial', 'High-Velocity Tech', 'Architectural Minimal'],
      metricLabel: 'Craft & Materiality: 90% Organic Artisanal',
      icon: Compass,
      activeColor: 'var(--color-clay, #B7410E)',
      activeGradient: 'from-amber-600 via-rose-500 to-indigo-600'
    },
    {
      id: 2,
      numStr: '02',
      badge: 'Visceral Depth',
      title: 'Color Science & Contrast Audit',
      subtitle: 'Mathematical harmony & verified WCAG 2.2 AA',
      summary:
        'Mathematical lightness curves with guaranteed WCAG AA. Studio maps your primary and accent hues across calibrated lightness ramps, verifying 4.5:1 (normal text) and 7:1 (AAA) ratios automatically.',
      pills: ['OKLCH Curves', '4.5:1 AA Verified', 'Zero Pure Grey'],
      metricLabel: 'Contrast Verification: 4.5:1 AA Passed',
      icon: Palette,
      activeColor: '#2563EB',
      activeGradient: 'from-blue-600 via-indigo-500 to-cyan-500'
    },
    {
      id: 3,
      numStr: '03',
      badge: 'Cognitive Rhythm',
      title: 'Fluid Typographic Hierarchy',
      subtitle: 'Editorial font pairing & modular scale clamp()',
      summary:
        'Arbitrary font sizes cause visual friction. Studio calculates headline and body scales using proven musical intervals (Major Third, Golden Ratio) paired with fluid clamp() formulas that adapt smoothly from phone to monitor.',
      pills: ['Cormorant + Lato', 'Major Third 1.250', '8px Spatial Grid'],
      metricLabel: 'Harmonic Scale Interval: 1.250 Major Third',
      icon: Type,
      activeColor: '#9333EA',
      activeGradient: 'from-purple-600 via-fuchsia-500 to-pink-500'
    },
    {
      id: 4,
      numStr: '04',
      badge: 'Engineering Core',
      title: 'Single Source of Truth Token Engine',
      subtitle: 'Direct export to Tailwind 4, CSS vars & JSON',
      summary:
        'One single source of truth. Design specifications that live in slide decks get forgotten. Studio compiles every decision into native Tailwind CSS 4 theme blocks, CSS variables, and TypeScript definitions ready for immediate git commit.',
      pills: ['Tailwind 4 @theme', ':root CSS Vars', 'DTCG JSON', 'TypeScript'],
      metricLabel: 'Export Synchronization: 10 Production Targets',
      icon: Code2,
      activeColor: '#059669',
      activeGradient: 'from-emerald-600 via-teal-500 to-cyan-600'
    }
  ];

  const headlineLead = 'Four foundational pillars.'.split(' ');
  const headlineAccent = 'Zero guesswork.'.split(' ');

  return (
    <div
      ref={sectionRef}
      id="anatomy"
      onWheel={handleWheel}
      className="relative w-full h-[360vh] bg-white dark:bg-neutral-950 text-ink dark:text-neutral-100"
    >
      {/* Pinned Sticky Viewport (100vh) */}
      <div className="sticky top-0 h-screen min-h-[680px] w-full overflow-hidden bg-white dark:bg-neutral-950 border-b border-rule dark:border-neutral-800 flex flex-col justify-between">
        {/* Floating Parallax Cloud with Frosted Glass Squares (Seen fully, never cut off) */}
        <motion.div
          style={{ x: reduceMotion ? 0 : cloudX, y: reduceMotion ? 0 : cloudY }}
          className="absolute top-2 sm:top-4 left-3 sm:left-6 lg:left-10 z-10 w-[min(38vw,500px)] pointer-events-none hidden sm:block opacity-95"
        >
          <div className="relative w-full">
            <img
              className="drift-a select-none pointer-events-none drop-shadow-md w-full h-auto object-contain"
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261021_093216_44218665-b15e-4566-a2d4-2676ab03609d.png"
              alt="Pastel cloud"
            />
            {/* Frosted Glass Squares (.glass from ai_studio_code.html) */}
            <div
              className="absolute rounded-xl pointer-events-none"
              style={{
                left: '6%',
                top: '30%',
                width: '15%',
                aspectRatio: '1',
                background: 'rgba(255, 255, 255, 0.4)',
                border: '1.5px solid rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(12px) saturate(1.2)',
                WebkitBackdropFilter: 'blur(12px) saturate(1.2)',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.7), 0 8px 24px rgba(0,0,0,0.05)'
              }}
            />
            <div
              className="absolute rounded-xl pointer-events-none"
              style={{
                left: '23%',
                top: '58%',
                width: '13%',
                aspectRatio: '1',
                background: 'rgba(255, 255, 255, 0.4)',
                border: '1.5px solid rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(12px) saturate(1.2)',
                WebkitBackdropFilter: 'blur(12px) saturate(1.2)',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.7), 0 8px 24px rgba(0,0,0,0.05)'
              }}
            />
            <div
              className="absolute rounded-xl pointer-events-none"
              style={{
                left: '38%',
                top: '24%',
                width: '13%',
                aspectRatio: '1',
                background: 'rgba(255, 255, 255, 0.4)',
                border: '1.5px solid rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(12px) saturate(1.2)',
                WebkitBackdropFilter: 'blur(12px) saturate(1.2)',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.7), 0 8px 24px rgba(0,0,0,0.05)'
              }}
            />
          </div>
        </motion.div>

        {/* Ambient Warm Atmosphere Glow */}
        <motion.div
          style={{ scale: reduceMotion ? 1 : ambientGlowScale }}
          className="absolute -top-32 -right-20 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle_at_center,rgba(251,239,233,0.7),transparent_70%)] blur-3xl pointer-events-none"
        />

        {/* ======================= SECTION HEADER (loop-head) ======================= */}
        <div className="relative z-30 pt-8 sm:pt-10 px-6 flex flex-col items-center text-center max-w-4xl mx-auto pointer-events-auto">
          {/* Section Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-lime-100 dark:bg-lime-950/60 text-lime-900 dark:text-lime-300 font-mono text-[11px] font-bold uppercase tracking-[0.18em] mb-2.5 border border-lime-400/40 shadow-2xs backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-clay animate-pulse" />
            <span>The Architecture of Cohesion</span>
          </div>

          {/* Headline with Staggered Word Reveal */}
          <h2 className="font-display text-2xl sm:text-3xl lg:text-[38px] font-bold tracking-tight text-ink dark:text-neutral-100 leading-[1.12] text-balance">
            {headlineLead.map((word, idx) => (
              <span key={`lead-${idx}`} className="inline-block mr-[0.25em]">
                {word}
              </span>
            ))}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-clay via-rose-600 to-indigo-600">
              {headlineAccent.map((word, idx) => (
                <span key={`accent-${idx}`} className="inline-block mr-[0.25em]">
                  {word}
                </span>
              ))}
            </span>
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-ink/70 dark:text-neutral-300 font-light leading-relaxed max-w-2xl text-pretty hidden sm:block">
            Most websites feel disjointed because colors, typography, and code are picked in isolation.
            Studio connects brand personality, perceptual color science, spatial rhythm, and production tokens into one unbroken system.
          </p>
        </div>

        {/* ======================= ACCORDION PANELS TRACK ======================= */}
        <div
          onMouseLeave={handleTrackMouseLeave}
          className="dss-accordion-track"
        >
          {pillars.map((pillar) => {
            const isActive = activePillar === pillar.id;
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                onMouseEnter={() => handleMouseEnter(pillar.id)}
                onClick={() => scrollToPillar(pillar.id)}
                tabIndex={0}
                onFocus={() => scrollToPillar(pillar.id)}
                aria-label={`Pillar ${pillar.id}: ${pillar.title}`}
                className={`dss-accordion-panel ${isActive ? 'is-active' : ''}`}
              >
                {/* Active Left Vertical Indicator Strip (Never cuts horizontally) */}
                <div
                  className={`absolute top-0 bottom-0 left-0 w-1 sm:w-1.5 bg-gradient-to-b ${pillar.activeGradient} transition-opacity duration-500 z-10 ${isActive ? 'opacity-100' : 'opacity-0'
                    }`}
                />

                {/* Collapsed Vertical Architectural Label */}
                <div className="dss-vertical-label">
                  Pillar 0{pillar.id} · {pillar.badge}
                </div>

                {/* Collapsed Panel Bottom Step Number */}
                <div className="dss-collapsed-num">
                  0{pillar.id}
                </div>

                {/* Internal Content (dss-panel-in) */}
                <div className="dss-panel-in">
                  {/* Left Column: Step Description */}
                  <div className="dss-step">
                    {/* Header Row: Numeral + Badge */}
                    <div className="flex items-center gap-3.5 mb-2.5">
                      <span
                        className="dss-num-badge"
                        style={{ color: pillar.activeColor }}
                      >
                        0{pillar.id}
                      </span>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime-100 dark:bg-lime-950/60 text-lime-900 dark:text-lime-300 font-mono text-[10px] font-bold uppercase tracking-wider">
                        <Icon className="w-3.5 h-3.5" />
                        <span>
                          Pillar 0{pillar.id} · {pillar.badge}
                        </span>
                      </div>
                    </div>

                    {/* Step Title */}
                    <h3 className="font-display text-xl sm:text-2xl lg:text-[28px] font-bold tracking-tight text-ink dark:text-neutral-100 leading-snug mb-2">
                      {pillar.title}
                    </h3>

                    {/* Step Summary */}
                    <p className="text-xs sm:text-sm text-ink/75 dark:text-neutral-300 font-light leading-relaxed mb-3.5 line-clamp-3">
                      {pillar.summary}
                    </p>

                    {/* Feature Pills */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {pillar.pills.map((p) => (
                        <span
                          key={p}
                          className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-neutral-800 border border-stone-200/60 dark:border-neutral-700 font-mono text-[10px] font-bold text-ink/80 dark:text-neutral-200 shadow-2xs"
                        >
                          {p}
                        </span>
                      ))}
                    </div>

                    {/* Action CTA */}
                    <div className="flex items-center gap-3">
                      <motion.button
                        whileHover={reduceMotion ? {} : { scale: 1.02 }}
                        whileTap={reduceMotion ? {} : { scale: 0.97 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onStartNew();
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-ink dark:bg-neutral-800 hover:bg-black dark:hover:bg-neutral-700 text-white font-sans text-xs font-bold shadow-sm transition-all cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-white/90" />
                        <span>Start Studio Flow</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </motion.button>
                      <span className="font-mono text-[10px] text-ink/45 dark:text-neutral-400 hidden sm:inline">
                        {pillar.metricLabel}
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Visual Specimen Card (Fills spacious width beautifully) */}
                  <div className="dss-specimen">
                    {/* Pillar 01 Specimen: Calibrated Dials Blueprint */}
                    {pillar.id === 1 && (
                      <div className="p-5 sm:p-6 rounded-2xl bg-stone-50/80 dark:bg-neutral-900/80 border border-rule dark:border-neutral-800 shadow-xs space-y-4 backdrop-blur-md">
                        <div className="flex items-center justify-between pb-3 border-b border-rule dark:border-neutral-800">
                          <div>
                            <div className="font-mono text-[10px] uppercase font-bold text-clay tracking-wider">
                              Active System Blueprint
                            </div>
                            <div className="font-display text-base font-bold text-ink dark:text-neutral-100 mt-0.5">
                              Mediterranean Terracotta & Heritage Serif
                            </div>
                          </div>
                          <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-lime-100 dark:bg-lime-950/60 text-lime-900 dark:text-lime-300 border border-lime-400/40">
                            Synthesized
                          </span>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-xs font-mono mb-1">
                              <span className="text-ink/60 dark:text-neutral-400">Brand Energy</span>
                              <span className="font-bold text-ink dark:text-neutral-200">Calm & Contemplative (35%)</span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-stone-200/60 dark:bg-neutral-800 overflow-hidden">
                              <div className="h-full rounded-full bg-clay w-[35%]" />
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-xs font-mono mb-1">
                              <span className="text-ink/60 dark:text-neutral-400">Craft & Materiality</span>
                              <span className="font-bold text-ink dark:text-neutral-200">Organic Artisanal (90%)</span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-stone-200/60 dark:bg-neutral-800 overflow-hidden">
                              <div className="h-full rounded-full bg-clay w-[90%]" />
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-xs font-mono mb-1">
                              <span className="text-ink/60 dark:text-neutral-400">Voice & Copywriting</span>
                              <span className="font-bold text-ink dark:text-neutral-200">Poetic Editorial (80%)</span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-stone-200/60 dark:bg-neutral-800 overflow-hidden">
                              <div className="h-full rounded-full bg-clay w-[80%]" />
                            </div>
                          </div>
                        </div>

                        <div className="text-[11px] font-mono text-ink/65 dark:text-neutral-300 bg-white/70 dark:bg-neutral-800/70 p-2.5 rounded-xl border border-rule dark:border-neutral-700">
                          💡 In Studio, these dials directly govern default button radius, typography scale ratios, and primary saturation.
                        </div>
                      </div>
                    )}

                    {/* Pillar 02 Specimen: Luminance Matrix & Lightness Ramp */}
                    {pillar.id === 2 && (
                      <div className="p-5 sm:p-6 rounded-2xl bg-stone-50/80 dark:bg-neutral-900/80 border border-rule dark:border-neutral-800 shadow-xs space-y-4 backdrop-blur-md">
                        <div className="flex items-center justify-between pb-3 border-b border-rule dark:border-neutral-800">
                          <div>
                            <div className="font-mono text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 tracking-wider">
                              Luminance Verification Matrix
                            </div>
                            <div className="font-display text-base font-bold text-ink dark:text-neutral-100 mt-0.5">
                              Primary Token Ramp: #2563EB
                            </div>
                          </div>
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>4.5:1 AA Verified (WCAG 2.2)</span>
                          </span>
                        </div>

                        <div className="grid grid-cols-6 gap-1.5">
                          {[
                            { shade: '100', hex: '#DBEAFE', text: 'text-blue-900' },
                            { shade: '300', hex: '#93C5FD', text: 'text-blue-900' },
                            { shade: '500', hex: '#3B82F6', text: 'text-white' },
                            { shade: '600', hex: '#2563EB', text: 'text-white' },
                            { shade: '800', hex: '#1E40AF', text: 'text-white' },
                            { shade: '950', hex: '#172554', text: 'text-white' }
                          ].map((step) => (
                            <div key={step.shade} className="flex flex-col items-center">
                              <div
                                className={`w-full h-10 rounded-lg flex items-center justify-center font-mono text-[9px] font-bold ${step.text}`}
                                style={{ backgroundColor: step.hex }}
                              >
                                {step.shade}
                              </div>
                              <span className="font-mono text-[8px] opacity-60 mt-1">{step.hex}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/70 dark:bg-neutral-800/70 border border-rule dark:border-neutral-700">
                          <span className="text-xs font-bold text-ink dark:text-neutral-100">Live Component Specimen:</span>
                          <button className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-sans text-xs font-bold shadow-2xs">
                            Confirm Order
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Pillar 03 Specimen: Fluid Typography Ladder */}
                    {pillar.id === 3 && (
                      <div className="p-5 sm:p-6 rounded-2xl bg-stone-50/80 dark:bg-neutral-900/80 border border-rule dark:border-neutral-800 shadow-xs space-y-3 backdrop-blur-md">
                        <div className="flex items-center justify-between pb-2.5 border-b border-rule dark:border-neutral-800">
                          <span className="font-mono text-xs text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider">
                            Live Fluid Scale Ladder (1.250 Major Third)
                          </span>
                          <span className="font-mono text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md font-bold">
                            clamp() Active
                          </span>
                        </div>

                        <div className="space-y-2 font-luxury">
                          <div className="flex items-baseline justify-between border-b border-stone-200/40 dark:border-neutral-700/40 pb-1.5">
                            <span className="text-2xl font-bold tracking-tight text-ink dark:text-neutral-100 font-cormorant">
                              Cormorant Garamond Display
                            </span>
                            <span className="font-mono text-[10px] text-ink/40 dark:text-neutral-400">39px</span>
                          </div>
                          <div className="flex items-baseline justify-between border-b border-stone-200/40 dark:border-neutral-700/40 pb-1.5">
                            <span className="text-lg font-bold tracking-tight text-ink dark:text-neutral-100">
                              Section Heading Level 1
                            </span>
                            <span className="font-mono text-[10px] text-ink/40 dark:text-neutral-400">31px</span>
                          </div>
                          <div className="flex items-baseline justify-between border-b border-stone-200/40 dark:border-neutral-700/40 pb-1.5">
                            <span className="text-sm font-semibold tracking-tight text-ink dark:text-neutral-100">
                              Subheading Level 2 (Lato Body)
                            </span>
                            <span className="font-mono text-[10px] text-ink/40 dark:text-neutral-400">25px</span>
                          </div>
                          <p className="text-xs text-ink/70 dark:text-neutral-300 italic pt-0.5">
                            "Premium typography adds lasting value to your brand."
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Pillar 04 Specimen: Token Engine Code Terminal */}
                    {pillar.id === 4 && (
                      <div className="rounded-2xl border border-stone-800 bg-[#0A0D14] text-white shadow-md overflow-hidden font-mono text-xs">
                        <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-rose-500/80" />
                            <span className="w-2 h-2 rounded-full bg-amber-500/80" />
                            <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
                            <span className="ml-1 text-[11px] text-white/50">tailwind.theme.css</span>
                          </div>
                          <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                            Single Source of Truth
                          </span>
                        </div>
                        <div className="p-4 overflow-x-auto text-emerald-300 text-[11px] leading-relaxed">
                          <pre>
                            <code>{`@theme {
  --color-brand-primary: var(--color-clay);
  --color-brand-accent: #F59E0B;
  --font-display: "Fraunces", serif;
  --font-body: "Plus Jakarta Sans", sans-serif;
  --radius-card: 16px;
}`}</code>
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
