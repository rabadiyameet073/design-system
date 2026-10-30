import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { getContrastRatio } from '../../utils/contrast';
import {
  Palette,
  Type,
  ShieldCheck,
  Layers,
  Sparkles,
  ArrowRight,
  Check,
  Copy,
  Sliders,
  Sun,
  Moon,
  Eye,
  Zap,
  CheckCircle2,
  Workflow,
  Compass,
  Code2
} from 'lucide-react';

interface DesignSystemAnatomyProps {
  onStartNew: () => void;
}

export const DesignSystemAnatomy: React.FC<DesignSystemAnatomyProps> = ({ onStartNew }) => {
  const reduceMotion = useReducedMotion();
  const [activePillar, setActivePillar] = useState<number>(1);
  const [copied, setCopied] = useState(false);
  
  // Interactive Pillar 1 state (Brand Soul)
  const [selectedSoul, setSelectedSoul] = useState<'warm' | 'tech' | 'minimal'>('warm');
  
  // Interactive Pillar 2 state (Color & Contrast)
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Interactive Pillar 3 state (Typography Scale & Luxury Pairing)
  const [activeScaleRatio, setActiveScaleRatio] = useState<number>(1.25); // Major Third
  const [activeAnatomyFont, setActiveAnatomyFont] = useState<{
    name: string;
    heading: string;
    body: string;
    quote: string;
    badge: string;
  }>({
    name: 'Cormorant Garamond + Lato',
    heading: 'Cormorant Garamond',
    body: 'Lato',
    quote: 'Premium typography adds value to your brand.',
    badge: '10 · Luxury & Premium'
  });

  const pillars = [
    {
      id: 1,
      numStr: '01',
      badge: 'Reflective Soul',
      title: 'Brand Soul & Visual Direction',
      subtitle: 'Energy, emotional tone & artistic personality',
      icon: Compass,
      accent: 'from-amber-500 to-rose-500',
      activeColor: '#D9552B',
    },
    {
      id: 2,
      numStr: '02',
      badge: 'Visceral Depth',
      title: 'Color Science & Contrast Audit',
      subtitle: 'Mathematical harmony & verified WCAG 2.1 AA',
      icon: Palette,
      accent: 'from-blue-600 to-indigo-600',
      activeColor: '#2563EB',
    },
    {
      id: 3,
      numStr: '03',
      badge: 'Cognitive Rhythm',
      title: 'Fluid Typographic Hierarchy',
      subtitle: 'Editorial font pairing & modular scale clamp()',
      icon: Type,
      accent: 'from-purple-600 to-violet-600',
      activeColor: '#9333EA',
    },
    {
      id: 4,
      numStr: '04',
      badge: 'Engineering Core',
      title: 'Zero-Drift Code Token Engine',
      subtitle: 'Direct export to Tailwind 4, CSS vars & JSON',
      icon: Code2,
      accent: 'from-emerald-600 to-teal-600',
      activeColor: '#059669',
    },
  ];

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="anatomy"
      className="relative w-full border-b border-rule bg-white text-ink overflow-hidden py-16 sm:py-20 lg:py-28"
    >
      {/* Subtle Studio Architectural Background Grid */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <div className="absolute -top-40 right-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-clay/5 via-amber-500/5 to-transparent blur-3xl pointer-events-none" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* ======================= EDITORIAL SECTION HEADER ======================= */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100/90 border border-ink/10 shadow-2xs mb-3 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-clay animate-pulse" />
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-ink/75">
              The Architecture of Cohesion
            </span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-[46px] font-bold tracking-tight text-ink leading-[1.08] text-balance">
            Four foundational pillars.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-clay via-rose-600 to-indigo-600">
              Zero guesswork.
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-ink/70 font-light leading-relaxed max-w-2xl text-pretty">
            Most websites feel disjointed because colors, typography, and code are picked in isolation.
            Studio connects brand personality, perceptual color science, spatial rhythm, and production tokens into one unbroken system.
          </p>
        </div>

        {/* ======================= PILLAR NAVIGATION TABS ======================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8 sm:mb-10">
          {pillars.map((pillar) => {
            const isActive = pillar.id === activePillar;
            const Icon = pillar.icon;
            return (
              <button
                key={pillar.id}
                onClick={() => setActivePillar(pillar.id)}
                className={`group relative text-left p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer select-none overflow-hidden ${
                  isActive
                    ? 'bg-stone-50 border-ink/20 shadow-sm ring-1 ring-ink/10'
                    : 'bg-white hover:bg-stone-50/70 border-rule hover:border-ink/15 shadow-2xs'
                }`}
              >
                {/* Active Indicator Bar on Top */}
                {isActive && (
                  <motion.div
                    layoutId="activePillarTabIndicator"
                    className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-clay via-rose-500 to-indigo-600"
                    transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 350, damping: 28 }}
                  />
                )}

                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`font-mono text-xs font-black px-2 py-0.5 rounded-md transition-colors ${
                      isActive ? 'bg-ink text-white' : 'bg-stone-100 text-ink/50 group-hover:text-ink'
                    }`}
                  >
                    {pillar.numStr}
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-ink/50 font-bold">
                    {pillar.badge}
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isActive ? 'bg-clay/10 text-clay' : 'bg-stone-100 text-ink/40 group-hover:text-ink/70'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className={`font-display text-sm sm:text-base font-bold tracking-tight transition-colors ${isActive ? 'text-ink' : 'text-ink/80'}`}>
                    {pillar.title}
                  </h3>
                </div>

                <p className="mt-2 text-xs text-ink/60 font-light line-clamp-1">
                  {pillar.subtitle}
                </p>
              </button>
            );
          })}
        </div>

        {/* ======================= INTERACTIVE PILLAR WORKBENCH STAGE ======================= */}
        <div className="rounded-3xl border border-ink/15 bg-stone-50/70 p-6 sm:p-8 lg:p-10 shadow-sm relative overflow-hidden backdrop-blur-sm">
          
          <AnimatePresence mode="wait">
            
            {/* ----------------- PILLAR 01: BRAND SOUL & TEMPERAMENT ----------------- */}
            {activePillar === 1 && (
              <motion.div
                key="pillar-1"
                initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
              >
                <div className="lg:col-span-5 space-y-4">
                  <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-clay uppercase tracking-widest">
                    <span>Pillar 01 • Reflective Level</span>
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink leading-tight">
                    Calibrate the soul before writing a single line of CSS.
                  </h3>
                  <p className="text-sm text-ink/70 font-light leading-relaxed">
                    A website’s emotional tone is felt in the first 50 milliseconds. Studio captures brand energy,
                    temperament, and artistic intent first—so colors, type scale, and micro-interactions never fight each other.
                  </p>

                  <div className="pt-2 flex flex-col gap-2">
                    <span className="font-mono text-xs font-bold text-ink/80 uppercase tracking-wider">
                      Explore Brand Archetypes:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelectedSoul('warm')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          selectedSoul === 'warm'
                            ? 'bg-clay text-white shadow-xs'
                            : 'bg-white border border-ink/10 text-ink/70 hover:text-ink'
                        }`}
                      >
                        Warm Editorial (Artisanal)
                      </button>
                      <button
                        onClick={() => setSelectedSoul('tech')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          selectedSoul === 'tech'
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-white border border-ink/10 text-ink/70 hover:text-ink'
                        }`}
                      >
                        High-Velocity Tech (SaaS)
                      </button>
                      <button
                        onClick={() => setSelectedSoul('minimal')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          selectedSoul === 'minimal'
                            ? 'bg-stone-900 text-white shadow-xs'
                            : 'bg-white border border-ink/10 text-ink/70 hover:text-ink'
                        }`}
                      >
                        Architectural Minimal (Mono)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Interactive Card Preview */}
                <div className="lg:col-span-7">
                  <div className="p-6 sm:p-8 rounded-2xl bg-white border border-ink/10 shadow-sm space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-rule">
                      <div>
                        <div className="font-mono text-[10px] uppercase font-bold text-clay tracking-wider">
                          Active System Blueprint
                        </div>
                        <div className="font-display text-xl font-bold text-ink">
                          {selectedSoul === 'warm' && 'Mediterranean Terracotta & Heritage Serif'}
                          {selectedSoul === 'tech' && 'Electric Indigo & High-Performance Sans'}
                          {selectedSoul === 'minimal' && 'Obsidian Chrome & Swiss Spatial Grid'}
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Synthesized
                      </span>
                    </div>

                    {/* Calibrated Temperament Sliders */}
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs font-mono mb-1.5">
                          <span className="text-ink/60">Brand Energy</span>
                          <span className="font-bold text-ink">
                            {selectedSoul === 'warm' ? 'Calm & Contemplative (35%)' : selectedSoul === 'tech' ? 'High Kinetic Velocity (85%)' : 'Stoic & Balanced (50%)'}
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                          <motion.div
                            animate={{
                              width: selectedSoul === 'warm' ? '35%' : selectedSoul === 'tech' ? '85%' : '50%',
                              backgroundColor: selectedSoul === 'warm' ? '#D9552B' : selectedSoul === 'tech' ? '#4F46E5' : '#18181B'
                            }}
                            className="h-full rounded-full"
                            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-mono mb-1.5">
                          <span className="text-ink/60">Craft & Materiality</span>
                          <span className="font-bold text-ink">
                            {selectedSoul === 'warm' ? 'Organic Artisanal (90%)' : selectedSoul === 'tech' ? 'Computational (20%)' : 'Brutalist Swiss (95%)'}
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                          <motion.div
                            animate={{
                              width: selectedSoul === 'warm' ? '90%' : selectedSoul === 'tech' ? '20%' : '95%',
                              backgroundColor: selectedSoul === 'warm' ? '#D9552B' : selectedSoul === 'tech' ? '#4F46E5' : '#18181B'
                            }}
                            className="h-full rounded-full"
                            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-mono mb-1.5">
                          <span className="text-ink/60">Voice & Copywriting</span>
                          <span className="font-bold text-ink">
                            {selectedSoul === 'warm' ? 'Poetic Editorial (80%)' : selectedSoul === 'tech' ? 'Direct & Prescriptive (90%)' : 'Understated Monograph (75%)'}
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                          <motion.div
                            animate={{
                              width: selectedSoul === 'warm' ? '80%' : selectedSoul === 'tech' ? '90%' : '75%',
                              backgroundColor: selectedSoul === 'warm' ? '#D9552B' : selectedSoul === 'tech' ? '#4F46E5' : '#18181B'
                            }}
                            className="h-full rounded-full"
                            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 text-xs font-mono text-ink/50 bg-stone-50 p-3 rounded-xl border border-ink/5">
                      💡 <strong>Key Takeaway:</strong> In Studio, these three dials directly determine default button radius, typography scale ratios, and primary color saturation automatically.
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ----------------- PILLAR 02: COLOR SCIENCE & CONTRAST ----------------- */}
            {activePillar === 2 && (
              <motion.div
                key="pillar-2"
                initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
              >
                <div className="lg:col-span-5 space-y-4">
                  <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-blue-600 uppercase tracking-widest">
                    <span>Pillar 02 • Visceral Level</span>
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink leading-tight">
                    Mathematical lightness curves with guaranteed WCAG AA.
                  </h3>
                  <p className="text-sm text-ink/70 font-light leading-relaxed">
                    Most brand palettes fail accessibility audits when tested in the real world. Studio maps your primary
                    and accent hues across calibrated lightness ramps, verifying 4.5:1 (normal text) and 7:1 (AAA) ratios automatically.
                  </p>

                  <div className="pt-2 flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-ink/80 uppercase tracking-wider">
                      Test Ambient Lighting:
                    </span>
                    <button
                      onClick={() => setIsDarkMode(!isDarkMode)}
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-ink/15 bg-white text-xs font-bold text-ink hover:bg-stone-50 transition-all cursor-pointer shadow-2xs"
                    >
                      {isDarkMode ? (
                        <>
                          <Sun className="w-3.5 h-3.5 text-amber-500" />
                          <span>Light Mode Preview</span>
                        </>
                      ) : (
                        <>
                          <Moon className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Dark Mode Preview</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Right Interactive Color Workbench */}
                <div className="lg:col-span-7">
                  <motion.div
                    animate={{
                      backgroundColor: isDarkMode ? '#0F141C' : '#FFFFFF',
                      color: isDarkMode ? '#FFFFFF' : '#18181B'
                    }}
                    transition={{ duration: 0.3 }}
                    className="p-6 sm:p-8 rounded-2xl border border-ink/10 shadow-sm space-y-6"
                  >
                    <div className="flex items-center justify-between pb-4 border-b border-rule/60">
                      <div>
                        <div className="font-mono text-[10px] uppercase font-bold text-blue-500 tracking-wider">
                          Luminance Verification Matrix
                        </div>
                        <div className="font-display text-lg font-bold">
                          Primary Token Ramp: #2563EB
                        </div>
                      </div>

                      {(() => {
                        const activeBg = isDarkMode ? '#0B0F19' : '#FFFFFF';
                        const primaryHex = '#2563EB';
                        const ratio = getContrastRatio(primaryHex, activeBg);
                        const ratioFormatted = `${ratio.toFixed(1)}:1`;
                        const isAA = ratio >= 4.5;
                        const isAAA = ratio >= 7.0;
                        return (
                          <div className="flex items-center gap-2">
                            <ShieldCheck className={`w-4 h-4 ${isAA ? 'text-emerald-500' : 'text-amber-500'}`} />
                            <span className={`font-mono text-xs font-bold ${isAA ? 'text-emerald-500' : 'text-amber-500'}`}>
                              {ratioFormatted} {isAAA ? 'AAA Verified' : isAA ? 'AA Verified' : 'Standard UI'}
                            </span>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Color Swatches Ramp */}
                    <div className="grid grid-cols-6 gap-2">
                      {[
                        { shade: '100', hex: '#DBEAFE', text: 'text-blue-900' },
                        { shade: '300', hex: '#93C5FD', text: 'text-blue-900' },
                        { shade: '500', hex: '#3B82F6', text: 'text-white' },
                        { shade: '600', hex: '#2563EB', text: 'text-white' },
                        { shade: '800', hex: '#1E40AF', text: 'text-white' },
                        { shade: '950', hex: '#172554', text: 'text-white' },
                      ].map((step) => (
                        <div key={step.shade} className="flex flex-col items-center">
                          <div
                            className={`w-full h-12 rounded-lg flex items-center justify-center font-mono text-[10px] font-bold shadow-2xs ${step.text}`}
                            style={{ backgroundColor: step.hex }}
                          >
                            {step.shade}
                          </div>
                          <span className="font-mono text-[9px] text-ink/40 mt-1">{step.hex}</span>
                        </div>
                      ))}
                    </div>

                    {/* Interactive Component Render Test */}
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-stone-100/40 border border-ink/10">
                      <div>
                        <div className="text-xs font-bold">Live Component Specimen:</div>
                        <div className="text-[11px] text-ink/60 font-light">
                          Testing focus ring, tactile spring, and contrast ratio.
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-sans text-xs font-bold shadow-sm transition-all hover:scale-102 active:scale-98 cursor-pointer">
                          Confirm Order
                        </button>
                        <button className="px-3.5 py-2 rounded-xl border border-ink/20 text-xs font-bold hover:bg-stone-100 transition-colors cursor-pointer">
                          Cancel
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* ----------------- PILLAR 03: FLUID TYPOGRAPHY HIERARCHY ----------------- */}
            {activePillar === 3 && (
              <motion.div
                key="pillar-3"
                initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
              >
                <div className="lg:col-span-5 space-y-4">
                  <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-purple-600 uppercase tracking-widest">
                    <span>Pillar 03 • Cognitive Rhythm</span>
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink leading-tight">
                    Text is 90% of the web. Type scale with mathematical harmony.
                  </h3>
                  <p className="text-sm text-ink/70 font-light leading-relaxed">
                    Arbitrary font sizes cause visual friction. Studio calculates headline and body scales using proven
                    musical intervals (Major Third, Golden Ratio) paired with fluid clamp() formulas that adapt smoothly from phone to monitor.
                  </p>

                  {/* Curated Luxury Font Pairing Switcher */}
                  <div className="pt-1 flex flex-col gap-2">
                    <span className="font-mono text-xs font-bold text-ink/80 uppercase tracking-wider">
                      Test Luxury Editorial Pairing:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        {
                          name: 'Cormorant Garamond',
                          heading: 'Cormorant Garamond',
                          body: 'Lato',
                          quote: 'Premium typography adds value to your brand.',
                          badge: '10 · Luxury & Premium'
                        },
                        {
                          name: 'Playfair Display',
                          heading: 'Playfair Display',
                          body: 'Montserrat',
                          quote: 'Good design is not just what it looks like, but how it works.',
                          badge: '01 · Modern & Clean'
                        },
                        {
                          name: 'Bodoni Moda',
                          heading: 'Bodoni Moda',
                          body: 'Poppins',
                          quote: 'Timeless fonts never go out of style.',
                          badge: '03 · Elegant & Classic'
                        },
                        {
                          name: 'Fraunces',
                          heading: 'Fraunces',
                          body: 'Inter',
                          quote: 'Fresh fonts for fresh perspectives.',
                          badge: '12 · Fresh & Modern'
                        }
                      ].map((f) => (
                        <button
                          key={f.name}
                          onClick={() => setActiveAnatomyFont(f)}
                          className={`px-2.5 py-2 rounded-xl text-left border transition-all cursor-pointer ${
                            activeAnatomyFont.name.includes(f.name)
                              ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                              : 'bg-white border-ink/10 text-ink/80 hover:border-ink/30'
                          }`}
                        >
                          <span className="block text-[10px] font-mono opacity-80">{f.badge}</span>
                          <span className="block text-xs font-bold truncate" style={{ fontFamily: f.heading }}>{f.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <span className="font-mono text-xs font-bold text-ink/80 uppercase tracking-wider">
                      Select Modular Scale Interval:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { ratio: 1.200, name: '1.200 Minor Third' },
                        { ratio: 1.250, name: '1.250 Major Third' },
                        { ratio: 1.333, name: '1.333 Perfect Fourth' },
                        { ratio: 1.618, name: '1.618 Golden Ratio' },
                      ].map((item) => (
                        <button
                          key={item.ratio}
                          onClick={() => setActiveScaleRatio(item.ratio)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            activeScaleRatio === item.ratio
                              ? 'bg-purple-600 text-white shadow-xs'
                              : 'bg-white border border-ink/10 text-ink/70 hover:text-ink'
                          }`}
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Interactive Typography Hierarchy Preview */}
                <div className="lg:col-span-7">
                  <div className="p-6 sm:p-8 rounded-2xl bg-white border border-ink/10 shadow-sm space-y-5">
                    <div className="flex items-center justify-between pb-3 border-b border-rule">
                      <span className="font-mono text-xs text-purple-600 font-bold uppercase tracking-wider">
                        Live Fluid Scale Ladder (Ratio: {activeScaleRatio})
                      </span>
                      <span className="font-mono text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md font-bold">
                        clamp() Active
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-baseline justify-between gap-4 border-b border-stone-100 pb-2">
                        <div
                          className="font-bold text-ink tracking-tight truncate"
                          style={{
                            fontFamily: activeAnatomyFont.heading,
                            fontSize: `${Math.round(16 * Math.pow(activeScaleRatio, 4))}px`
                          }}
                        >
                          {activeAnatomyFont.heading} Title
                        </div>
                        <span className="font-mono text-[11px] text-ink/40 shrink-0">
                          {Math.round(16 * Math.pow(activeScaleRatio, 4))}px · {activeAnatomyFont.badge}
                        </span>
                      </div>

                      <div className="flex items-baseline justify-between gap-4 border-b border-stone-100 pb-2">
                        <div
                          className="font-bold text-ink tracking-tight truncate"
                          style={{
                            fontFamily: activeAnatomyFont.heading,
                            fontSize: `${Math.round(16 * Math.pow(activeScaleRatio, 3))}px`
                          }}
                        >
                          Heading Level 1
                        </div>
                        <span className="font-mono text-[11px] text-ink/40 shrink-0">
                          {Math.round(16 * Math.pow(activeScaleRatio, 3))}px · 700 Weight
                        </span>
                      </div>

                      <div className="flex items-baseline justify-between gap-4 border-b border-stone-100 pb-2">
                        <div
                          className="font-semibold text-ink tracking-tight truncate"
                          style={{
                            fontFamily: activeAnatomyFont.heading,
                            fontSize: `${Math.round(16 * Math.pow(activeScaleRatio, 2))}px`
                          }}
                        >
                          Subheading Level 2 ({activeAnatomyFont.body} Body)
                        </div>
                        <span className="font-mono text-[11px] text-ink/40 shrink-0">
                          {Math.round(16 * Math.pow(activeScaleRatio, 2))}px · 600 Weight
                        </span>
                      </div>

                      <div className="flex items-baseline justify-between gap-4">
                        <div
                          className="text-sm text-ink/80 leading-relaxed max-w-md"
                          style={{ fontFamily: activeAnatomyFont.body }}
                        >
                          "{activeAnatomyFont.quote}"
                        </div>
                        <span className="font-mono text-[11px] text-ink/40 shrink-0">
                          16px · {activeAnatomyFont.body}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 text-xs font-mono text-purple-900 bg-purple-50/70 p-3 rounded-xl border border-purple-100">
                      📐 <strong>Spatial Rule:</strong> Every line-height and margin snaps directly to an 8px grid baseline so typography never breaks layout flow.
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ----------------- PILLAR 04: ZERO-DRIFT CODE TOKEN ENGINE ----------------- */}
            {activePillar === 4 && (
              <motion.div
                key="pillar-4"
                initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
              >
                <div className="lg:col-span-5 space-y-4">
                  <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-emerald-600 uppercase tracking-widest">
                    <span>Pillar 04 • Engineering Layer</span>
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink leading-tight">
                    One single source of truth. Synchronized between design & code.
                  </h3>
                  <p className="text-sm text-ink/70 font-light leading-relaxed">
                    Design specifications that live only in slide decks get forgotten. Studio compiles every decision into
                    native Tailwind CSS 4 theme blocks, CSS variables, and TypeScript definitions ready for immediate git commit.
                  </p>

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      onClick={() => handleCopyCode(`@theme {
  --color-brand-primary: #D9552B;
  --color-brand-accent: #F59E0B;
  --font-display: "Fraunces", serif;
  --font-body: "Plus Jakarta Sans", sans-serif;
  --radius-card: 16px;
  --ease-spring: linear(0, 0.006, 0.025, 0.058, 0.104, 0.163, 0.233, 0.312, 0.398, 0.488, 0.579, 0.668, 0.751, 0.826, 0.891, 0.943, 0.981, 1.004, 1.015, 1.016, 1.009, 1);
}`)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white font-sans text-xs font-bold hover:bg-emerald-700 transition-all cursor-pointer shadow-xs"
                    >
                      {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                      <span>{copied ? 'Copied Tokens!' : 'Copy Tailwind 4 Theme'}</span>
                    </button>
                  </div>
                </div>

                {/* Right Interactive Code Terminal */}
                <div className="lg:col-span-7">
                  <div className="rounded-2xl border border-stone-800 bg-[#0A0D14] text-white shadow-xl overflow-hidden font-mono text-xs">
                    <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                        <span className="ml-2 text-white/50 text-[11px]">tailwind.theme.css</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                        Single Source of Truth
                      </span>
                    </div>

                    <div className="p-5 overflow-x-auto text-emerald-300 leading-relaxed">
                      <pre>
                        <code>{`@theme {
  /* Brand Identity Tokens */
  --color-brand-primary: #D9552B;
  --color-brand-accent: #F59E0B;
  
  /* Fluid Typographic Scales */
  --font-display: "Fraunces", serif;
  --font-body: "Plus Jakarta Sans", sans-serif;
  
  /* 8px Spatial Rhythm & Shapes */
  --radius-card: 16px;
  --radius-button: 12px;
  
  /* Kinetic Motion Physics */
  --ease-spring: linear(0, 0.006, 0.025, 0.058, 0.104, 0.163, 0.233, 0.312, 0.398, 0.488, 0.579, 0.668, 0.751, 0.826, 0.891, 0.943, 0.981, 1.004, 1.015, 1.016, 1.009, 1);
}`}</code>
                      </pre>
                    </div>

                    <div className="px-5 py-2.5 bg-white/[0.02] border-t border-white/5 flex items-center justify-between text-[11px] text-white/50">
                      <span>✓ Ready for Vite, Next.js & React 19</span>
                      <span>5 export targets available</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

        </div>

        {/* ======================= BOTTOM CONVERSATIONAL CTA BANNER ======================= */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-clay-wash via-white to-stone-50 border border-clay/20 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="max-w-xl">
            <h4 className="font-display text-xl sm:text-2xl font-bold text-ink">
              Ready to create your cohesive design system?
            </h4>
            <p className="text-xs sm:text-sm text-ink/70 font-light mt-1">
              Answer 14 guided questions to generate your custom brand soul, color ramps, typography scale, and exportable tokens.
            </p>
          </div>

          <button
            onClick={onStartNew}
            className="group inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-clay via-clay to-clay-deep px-6 py-3.5 text-sm font-bold text-white shadow-md hover:shadow-lg hover:shadow-clay/30 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer font-sans shrink-0"
          >
            <Sparkles className="w-4 h-4 text-white/90" />
            <span>Start 14-Step Studio</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>

      </div>
    </section>
  );
};
