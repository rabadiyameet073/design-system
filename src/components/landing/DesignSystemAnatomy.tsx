import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  Palette,
  Type,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Compass,
  Code2,
  Check,
  Copy,
  Sliders,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface DesignSystemAnatomyProps {
  onStartNew: () => void;
}

export const DesignSystemAnatomy: React.FC<DesignSystemAnatomyProps> = ({ onStartNew }) => {
  const reduceMotion = useReducedMotion();
  const [activePillar, setActivePillar] = useState<number>(1);
  const [copiedCode, setCopiedCode] = useState(false);

  // Interactive Blueprint Dials for Pillar 1
  const [brandEnergy, setBrandEnergy] = useState(35);
  const [craftMateriality, setCraftMateriality] = useState(90);
  const [voiceTone, setVoiceTone] = useState(80);

  const pillars = [
    {
      id: 1,
      numStr: '01',
      badge: 'Reflective Soul',
      shortTitle: 'Brand Soul',
      title: 'Brand Soul & Visual Direction',
      subtitle: 'Energy, emotional tone & artistic personality',
      summary:
        'A website’s emotional tone is felt in the first 50 milliseconds. Studio captures brand energy, temperament, and artistic intent first—so colors, type scale, and micro-interactions never fight each other.',
      pills: ['Warm Editorial', 'High-Velocity Tech', 'Architectural Minimal'],
      metricLabel: 'Craft & Materiality: 90% Organic Artisanal',
      icon: Compass,
      activeColor: 'var(--color-clay, #B7410E)',
      accentBorder: 'border-clay/40',
      activeGradient: 'from-amber-600 via-rose-500 to-indigo-600',
      bgWash: 'bg-clay/5'
    },
    {
      id: 2,
      numStr: '02',
      badge: 'Visceral Depth',
      shortTitle: 'Color Science',
      title: 'Color Science & Contrast Audit',
      subtitle: 'Mathematical harmony & verified WCAG 2.2 AA',
      summary:
        'Mathematical lightness curves with guaranteed WCAG AA. Studio maps your primary and accent hues across calibrated lightness ramps, verifying 4.5:1 (normal text) and 7:1 (AAA) ratios automatically.',
      pills: ['OKLCH Curves', '4.5:1 AA Verified', 'Zero Pure Grey'],
      metricLabel: 'Contrast Verification: 4.5:1 AA Passed',
      icon: Palette,
      activeColor: '#2563EB',
      accentBorder: 'border-blue-500/40',
      activeGradient: 'from-blue-600 via-indigo-500 to-cyan-500',
      bgWash: 'bg-blue-500/5'
    },
    {
      id: 3,
      numStr: '03',
      badge: 'Cognitive Rhythm',
      shortTitle: 'Typographic Scale',
      title: 'Fluid Typographic Hierarchy',
      subtitle: 'Editorial font pairing & modular scale clamp()',
      summary:
        'Arbitrary font sizes cause visual friction. Studio calculates headline and body scales using proven musical intervals (Major Third, Golden Ratio) paired with fluid clamp() formulas that adapt smoothly from phone to monitor.',
      pills: ['Cormorant + Lato', 'Major Third 1.250', '8px Spatial Grid'],
      metricLabel: 'Harmonic Scale Interval: 1.250 Major Third',
      icon: Type,
      activeColor: '#9333EA',
      accentBorder: 'border-purple-500/40',
      activeGradient: 'from-purple-600 via-fuchsia-500 to-pink-500',
      bgWash: 'bg-purple-500/5'
    },
    {
      id: 4,
      numStr: '04',
      badge: 'Engineering Core',
      shortTitle: 'Token Engine',
      title: 'Single Source of Truth Token Engine',
      subtitle: 'Direct export to Tailwind 4, CSS vars & JSON',
      summary:
        'One single source of truth. Design specifications that live in slide decks get forgotten. Studio compiles every decision into native Tailwind CSS 4 theme blocks, CSS variables, and TypeScript definitions ready for immediate git commit.',
      pills: ['Tailwind 4 @theme', ':root CSS Vars', 'DTCG JSON', 'TypeScript'],
      metricLabel: 'Export Synchronization: 10 Production Targets',
      icon: Code2,
      activeColor: '#059669',
      accentBorder: 'border-emerald-500/40',
      activeGradient: 'from-emerald-600 via-teal-500 to-cyan-600',
      bgWash: 'bg-emerald-500/5'
    }
  ];

  const currentPillar = pillars.find((p) => p.id === activePillar) || pillars[0];
  const CurrentIcon = currentPillar.icon;

  const handleCopyCode = () => {
    const code = `@theme {
  --color-brand-primary: #B7410E;
  --color-brand-accent: #2563EB;
  --font-display: "Fraunces", serif;
  --font-body: "Plus Jakarta Sans", sans-serif;
  --radius-card: 16px;
  --shadow-editorial: 0 20px 40px -15px rgba(0, 0, 0, 0.08);
}`;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handlePrev = () => {
    setActivePillar((prev) => (prev > 1 ? prev - 1 : 4));
  };

  const handleNext = () => {
    setActivePillar((prev) => (prev < 4 ? prev + 1 : 1));
  };

  return (
    <section
      id="anatomy"
      className="relative w-full border-b border-rule bg-white dark:bg-neutral-950 text-ink dark:text-neutral-100 py-16 sm:py-20 lg:py-28 overflow-hidden scroll-mt-16"
    >
      {/* Soft Ambient Ethereal Glow & Parallax Cloud Accent */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden select-none">
        <div className="absolute -top-24 left-4 sm:left-12 w-[340px] sm:w-[460px] opacity-25 dark:opacity-15 blur-sm">
          <img
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261021_093216_44218665-b15e-4566-a2d4-2676ab03609d.png"
            alt=""
            className="w-full h-auto object-contain"
          />
        </div>
        <div className="absolute -top-32 -right-20 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle_at_center,rgba(251,239,233,0.85),transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(40,25,20,0.4),transparent_70%)] blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* ======================= SECTION HEADER ======================= */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          {/* Section Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-lime-100 dark:bg-lime-950/60 text-lime-900 dark:text-lime-300 font-mono text-[11px] font-bold uppercase tracking-[0.18em] mb-4 border border-lime-400/40 shadow-2xs backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-clay animate-pulse" />
            <span>The Architecture of Cohesion</span>
          </div>

          {/* Main Headline */}
          <h2 className="font-display text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-ink dark:text-neutral-100 leading-[1.12] text-balance">
            Four foundational pillars.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-clay via-rose-600 to-indigo-600">
              Zero guesswork.
            </span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-ink/75 dark:text-neutral-300 font-normal leading-relaxed max-w-2xl mx-auto text-pretty">
            Most websites feel disjointed because colors, typography, and code are picked in isolation.
            Studio connects brand personality, perceptual color science, spatial rhythm, and production tokens into one unbroken system.
          </p>
        </div>

        {/* ======================= INTERACTIVE PILLAR SELECTOR TABS ======================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {pillars.map((pillar) => {
            const isSelected = pillar.id === activePillar;
            const Icon = pillar.icon;
            return (
              <button
                key={pillar.id}
                type="button"
                onClick={() => setActivePillar(pillar.id)}
                className={`group relative text-left p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer select-none overflow-hidden ${
                  isSelected
                    ? 'bg-white dark:bg-neutral-900 shadow-lg shadow-black/[0.04] dark:shadow-black/20 border-clay/50 ring-2 ring-clay/20'
                    : 'bg-stone-50/70 dark:bg-neutral-900/40 hover:bg-white dark:hover:bg-neutral-900 border-rule dark:border-neutral-800'
                }`}
              >
                {/* Active Top Gradient Indicator Bar */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${pillar.activeGradient} transition-opacity duration-300 ${
                    isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'
                  }`}
                />

                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`font-mono text-xs font-bold transition-colors ${
                      isSelected ? 'text-clay dark:text-amber-500' : 'text-ink/40 dark:text-neutral-500'
                    }`}
                  >
                    0{pillar.id}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-clay/10 text-clay dark:text-amber-400'
                        : 'bg-black/5 dark:bg-white/5 text-ink/60 dark:text-neutral-400 group-hover:text-ink'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink/50 dark:text-neutral-400 mb-1">
                  {pillar.badge}
                </div>
                <div className="font-display text-sm sm:text-base font-bold text-ink dark:text-neutral-100 tracking-tight group-hover:text-clay transition-colors line-clamp-1">
                  {pillar.shortTitle}
                </div>
              </button>
            );
          })}
        </div>

        {/* ======================= PILLAR SHOWCASE STAGE ======================= */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPillar.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-3xl border border-rule/80 dark:border-neutral-800 bg-gradient-to-b from-white via-white to-stone-50/60 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-950 p-6 sm:p-8 lg:p-10 shadow-xl shadow-black/[0.03] dark:shadow-black/20"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Architectural Explanation (5 cols) */}
              <div className="lg:col-span-5 flex flex-col justify-between">
                <div>
                  {/* Step Numeral + Pillar Pill */}
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className="font-display text-5xl sm:text-6xl font-black tracking-tighter leading-none"
                      style={{ color: currentPillar.activeColor }}
                    >
                      {currentPillar.numStr}
                    </span>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-100 dark:bg-lime-950/60 text-lime-900 dark:text-lime-300 font-mono text-[11px] font-bold uppercase tracking-wider border border-lime-400/40">
                      <CurrentIcon className="w-3.5 h-3.5" />
                      <span>{currentPillar.badge}</span>
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink dark:text-neutral-100 leading-snug mb-2">
                    {currentPillar.title}
                  </h3>
                  <div className="font-mono text-xs text-clay dark:text-amber-400 font-semibold mb-4">
                    {currentPillar.subtitle}
                  </div>

                  {/* Summary Text */}
                  <p className="text-sm text-ink/75 dark:text-neutral-300 font-normal leading-relaxed mb-6">
                    {currentPillar.summary}
                  </p>

                  {/* Characteristic Badges */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {currentPillar.pills.map((pill) => (
                      <span
                        key={pill}
                        className="px-3 py-1 rounded-lg bg-stone-100 dark:bg-neutral-800 border border-stone-200/80 dark:border-neutral-700 font-mono text-[11px] font-bold text-ink/80 dark:text-neutral-200 shadow-2xs"
                      >
                        {pill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Primary Action Button & Metric Proof */}
                <div className="pt-6 border-t border-rule dark:border-neutral-800 flex flex-wrap items-center justify-between gap-4">
                  <motion.button
                    whileHover={reduceMotion ? {} : { scale: 1.02 }}
                    whileTap={reduceMotion ? {} : { scale: 0.98 }}
                    onClick={onStartNew}
                    className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-ink dark:bg-white hover:bg-black dark:hover:bg-neutral-100 text-white dark:text-ink font-sans text-xs sm:text-sm font-bold shadow-md shadow-ink/15 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-white dark:text-ink" />
                    <span>Start Studio Flow</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="w-8 h-8 rounded-lg border border-rule dark:border-neutral-800 flex items-center justify-center text-ink/60 dark:text-neutral-400 hover:text-ink hover:border-ink/20 transition-all cursor-pointer"
                      title="Previous pillar"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="font-mono text-xs text-ink/40 dark:text-neutral-500 font-bold px-1">
                      {currentPillar.id} / 4
                    </span>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="w-8 h-8 rounded-lg border border-rule dark:border-neutral-800 flex items-center justify-center text-ink/60 dark:text-neutral-400 hover:text-ink hover:border-ink/20 transition-all cursor-pointer"
                      title="Next pillar"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Interactive Specimen (7 cols) */}
              <div className="lg:col-span-7">
                {/* Pillar 01 Specimen: Calibrated Dials Blueprint */}
                {currentPillar.id === 1 && (
                  <div className="p-6 sm:p-7 rounded-2xl bg-stone-50/90 dark:bg-neutral-900/90 border border-rule dark:border-neutral-800 shadow-sm space-y-5">
                    <div className="flex items-center justify-between pb-3.5 border-b border-rule dark:border-neutral-800">
                      <div>
                        <div className="font-mono text-[10px] uppercase font-bold text-clay tracking-wider">
                          Active System Blueprint
                        </div>
                        <div className="font-display text-lg font-bold text-ink dark:text-neutral-100 mt-0.5">
                          Mediterranean Terracotta & Heritage Serif
                        </div>
                      </div>
                      <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-lime-100 dark:bg-lime-950/60 text-lime-900 dark:text-lime-300 border border-lime-400/40">
                        Live Calibration
                      </span>
                    </div>

                    <div className="space-y-4">
                      {/* Interactive Slider 1: Brand Energy */}
                      <div>
                        <div className="flex justify-between text-xs font-mono mb-1.5">
                          <span className="text-ink/75 dark:text-neutral-400 font-medium">Brand Energy</span>
                          <span className="font-bold text-ink dark:text-neutral-200">
                            {brandEnergy < 40 ? 'Calm & Contemplative' : brandEnergy < 70 ? 'Balanced Modern' : 'High Energy'} ({brandEnergy}%)
                          </span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="95"
                          value={brandEnergy}
                          onChange={(e) => setBrandEnergy(Number(e.target.value))}
                          className="w-full accent-clay cursor-pointer h-2 bg-stone-200/80 dark:bg-neutral-800 rounded-lg"
                        />
                      </div>

                      {/* Interactive Slider 2: Craft & Materiality */}
                      <div>
                        <div className="flex justify-between text-xs font-mono mb-1.5">
                          <span className="text-ink/75 dark:text-neutral-400 font-medium">Craft & Materiality</span>
                          <span className="font-bold text-ink dark:text-neutral-200">
                            {craftMateriality > 75 ? 'Organic Artisanal' : 'Precision Minimal'} ({craftMateriality}%)
                          </span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="95"
                          value={craftMateriality}
                          onChange={(e) => setCraftMateriality(Number(e.target.value))}
                          className="w-full accent-clay cursor-pointer h-2 bg-stone-200/80 dark:bg-neutral-800 rounded-lg"
                        />
                      </div>

                      {/* Interactive Slider 3: Voice & Copywriting */}
                      <div>
                        <div className="flex justify-between text-xs font-mono mb-1.5">
                          <span className="text-ink/75 dark:text-neutral-400 font-medium">Voice & Copywriting</span>
                          <span className="font-bold text-ink dark:text-neutral-200">
                            {voiceTone > 70 ? 'Poetic Editorial' : 'Direct & Functional'} ({voiceTone}%)
                          </span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="95"
                          value={voiceTone}
                          onChange={(e) => setVoiceTone(Number(e.target.value))}
                          className="w-full accent-clay cursor-pointer h-2 bg-stone-200/80 dark:bg-neutral-800 rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono text-ink/70 dark:text-neutral-300 bg-white dark:bg-neutral-800/80 p-3 rounded-xl border border-rule dark:border-neutral-700">
                      <Sliders className="w-4 h-4 text-clay shrink-0" />
                      <span>These brand dials mathematically govern default border-radius, font-scale ratios, and primary saturation in real time.</span>
                    </div>
                  </div>
                )}

                {/* Pillar 02 Specimen: Luminance Verification Matrix */}
                {currentPillar.id === 2 && (
                  <div className="p-6 sm:p-7 rounded-2xl bg-stone-50/90 dark:bg-neutral-900/90 border border-rule dark:border-neutral-800 shadow-sm space-y-5">
                    <div className="flex items-center justify-between pb-3.5 border-b border-rule dark:border-neutral-800">
                      <div>
                        <div className="font-mono text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 tracking-wider">
                          Luminance Verification Matrix
                        </div>
                        <div className="font-display text-lg font-bold text-ink dark:text-neutral-100 mt-0.5">
                          Perceptual Color Ramp: #2563EB
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>WCAG 2.2 AA Verified (4.5:1)</span>
                      </span>
                    </div>

                    {/* Calibrated 6-Step Ramps */}
                    <div className="grid grid-cols-6 gap-2">
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
                            className={`w-full h-12 rounded-xl flex items-center justify-center font-mono text-[10px] font-bold shadow-2xs ${step.text}`}
                            style={{ backgroundColor: step.hex }}
                          >
                            {step.shade}
                          </div>
                          <span className="font-mono text-[9px] text-ink/60 dark:text-neutral-400 mt-1.5 font-medium">
                            {step.hex}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Live Component Specimen Button */}
                    <div className="flex flex-wrap items-center justify-between p-4 rounded-xl bg-white dark:bg-neutral-800/80 border border-rule dark:border-neutral-700 gap-3">
                      <div>
                        <div className="text-xs font-bold text-ink dark:text-neutral-100">Automated Contrast Guarantee</div>
                        <div className="text-[11px] text-ink/60 dark:text-neutral-400 font-mono">Contrast ratio: 7.2:1 against canvas</div>
                      </div>
                      <button
                        type="button"
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-sans text-xs font-bold shadow-sm transition-all"
                      >
                        Confirm Transaction
                      </button>
                    </div>
                  </div>
                )}

                {/* Pillar 03 Specimen: Fluid Typography Ladder */}
                {currentPillar.id === 3 && (
                  <div className="p-6 sm:p-7 rounded-2xl bg-stone-50/90 dark:bg-neutral-900/90 border border-rule dark:border-neutral-800 shadow-sm space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-rule dark:border-neutral-800">
                      <span className="font-mono text-xs text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider">
                        Fluid Modular Scale (1.250 Major Third)
                      </span>
                      <span className="font-mono text-[10px] bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 px-2.5 py-0.5 rounded-full font-bold border border-purple-200 dark:border-purple-800">
                        clamp() Active
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-baseline justify-between border-b border-stone-200/60 dark:border-neutral-800 pb-2">
                        <span className="text-2xl sm:text-3xl font-bold tracking-tight text-ink dark:text-neutral-100 font-serif">
                          Cormorant Display Title
                        </span>
                        <span className="font-mono text-xs text-ink/60 dark:text-neutral-400 font-bold">clamp(2rem, 3.8vw, 3rem)</span>
                      </div>
                      <div className="flex items-baseline justify-between border-b border-stone-200/60 dark:border-neutral-800 pb-2">
                        <span className="text-lg sm:text-xl font-bold tracking-tight text-ink dark:text-neutral-100 font-sans">
                          Section Heading Level 1
                        </span>
                        <span className="font-mono text-xs text-ink/60 dark:text-neutral-400 font-bold">clamp(1.4rem, 2.4vw, 2rem)</span>
                      </div>
                      <div className="flex items-baseline justify-between border-b border-stone-200/60 dark:border-neutral-800 pb-2">
                        <span className="text-sm sm:text-base font-semibold tracking-tight text-ink dark:text-neutral-100 font-sans">
                          Subheading Level 2 (Lato Body)
                        </span>
                        <span className="font-mono text-xs text-ink/60 dark:text-neutral-400 font-bold">clamp(1.1rem, 1.8vw, 1.4rem)</span>
                      </div>
                      <p className="text-xs text-ink/75 dark:text-neutral-300 italic pt-1">
                        "Deliberate typography scale ratios establish natural cognitive rhythm without arbitrary manual pixel overrides."
                      </p>
                    </div>
                  </div>
                )}

                {/* Pillar 04 Specimen: Token Engine Code Terminal */}
                {currentPillar.id === 4 && (
                  <div className="rounded-2xl border border-stone-800 bg-[#0A0D14] text-white shadow-lg overflow-hidden font-mono text-xs">
                    <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500/90" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/90" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/90" />
                        <span className="ml-2 text-xs text-white/80 font-bold">tailwind.theme.css</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyCode}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white/90 text-[11px] font-sans font-medium transition-all cursor-pointer"
                      >
                        {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedCode ? 'Copied' : 'Copy Theme'}</span>
                      </button>
                    </div>
                    <div className="p-5 overflow-x-auto text-emerald-300 text-xs leading-relaxed">
                      <pre>
                        <code>{`@theme {
  --color-brand-primary: var(--color-clay, #B7410E);
  --color-brand-accent: #2563EB;
  --font-display: "Fraunces", serif;
  --font-body: "Plus Jakarta Sans", sans-serif;
  --radius-card: 16px;
  --shadow-editorial: 0 20px 40px -15px rgba(0, 0, 0, 0.08);
}`}</code>
                      </pre>
                    </div>
                    <div className="px-5 py-2.5 bg-white/[0.02] border-t border-white/5 flex items-center justify-between text-[11px] text-white/50">
                      <span>Syncs 100% with CSS Variables & JSON Design Tokens</span>
                      <span className="text-emerald-400 font-bold">● Production Ready</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
