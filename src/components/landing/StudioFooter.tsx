import React from 'react';
import { motion } from 'motion/react';
import {
  ArrowUp,
  Sparkles,
  ShieldCheck,
  Zap,
  Layers,
  FileCode2,
  FileJson,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  Terminal,
  Cpu,
  ArrowRight
} from 'lucide-react';

interface StudioFooterProps {
  onStartNew: () => void;
  onExploreSample?: () => void;
  onOpenLegal?: (tab: 'privacy' | 'terms') => void;
}

export const StudioFooter: React.FC<StudioFooterProps> = ({ onStartNew, onExploreSample, onOpenLegal }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#090C15] text-white border-t border-white/10 overflow-hidden font-sans">
      {/* Dynamic Ambient Background Sheen */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[300px] rounded-full bg-gradient-to-r from-clay/15 via-rose-500/10 to-indigo-600/10 blur-3xl" />
        <div className="absolute -bottom-20 right-10 w-[500px] h-[300px] rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      {/* ==================== ZONE 2: MAIN MULTI-COLUMN DIRECTORY ==================== */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          
          {/* Brand Anchor Column (4 Cols) */}
          <div className="lg:col-span-4 space-y-5">
            {/* Brand Logo with Clean Glassmorphic Frame */}
            <div className="inline-flex items-center gap-3 p-2.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md shadow-inner">
              <img
                src="/icon.png"
                alt="Design System Studio"
                className="w-8 h-8 rounded-lg object-contain drop-shadow-sm"
              />
              <div className="flex flex-col">
                <span className="font-display text-sm font-bold tracking-tight text-white leading-tight">
                  Design System Studio
                </span>
                <span className="font-mono text-[10px] text-clay uppercase tracking-widest font-bold">
                  System Architecture Engine
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-[13px] leading-relaxed text-white/70 font-light max-w-sm">
              An opinionated, founder-first design engineering environment. We eliminate weeks of fragmented token debates by synthesizing brand personality, perceptual color science, and fluid typography into production-ready code.
            </p>

            {/* System Status Badges */}
            <div className="space-y-2 pt-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white/80 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Tokens Engine: v1.6.0 · All 11 Steps Active</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-white/45 pl-1">
                <span>⚡ Built on Vite 8 & React 19</span>
                <span>•</span>
                <span>Tailwind 4 Engine</span>
              </div>
            </div>

            {/* Direct Quick Launch Button */}
            <div className="pt-2">
              <button
                onClick={onStartNew}
                className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-clay hover:bg-clay-deep text-white text-xs font-bold font-sans transition-all shadow-md hover:shadow-clay/30 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-white/90" />
                <span>Launch 11-Step Studio</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Col 2: The 11 Decisions (2 Cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-clay">
              The 11 Decisions
            </h4>
            <ul className="space-y-2 text-xs text-white/70 font-light">
              <li
                onClick={onStartNew}
                className="hover:text-white transition-colors cursor-pointer flex items-center justify-between group"
              >
                <span>01. Category & Genre</span>
                <span className="font-mono text-[10px] text-white/30 group-hover:text-clay">Q01</span>
              </li>
              <li
                onClick={onStartNew}
                className="hover:text-white transition-colors cursor-pointer flex items-center justify-between group"
              >
                <span>02. Project Scope</span>
                <span className="font-mono text-[10px] text-white/30 group-hover:text-clay">Q02</span>
              </li>
              <li
                onClick={onStartNew}
                className="hover:text-white transition-colors cursor-pointer flex items-center justify-between group"
              >
                <span>03. Brand Personality</span>
                <span className="font-mono text-[10px] text-white/30 group-hover:text-clay">Q03</span>
              </li>
              <li
                onClick={onStartNew}
                className="hover:text-white transition-colors cursor-pointer flex items-center justify-between group"
              >
                <span>04. Visual Direction</span>
                <span className="font-mono text-[10px] text-white/30 group-hover:text-clay">Q04</span>
              </li>
              <li
                onClick={onStartNew}
                className="hover:text-white transition-colors cursor-pointer flex items-center justify-between group"
              >
                <span>05. Color Studio</span>
                <span className="font-mono text-[10px] text-white/30 group-hover:text-clay">Q05</span>
              </li>
              <li
                onClick={onStartNew}
                className="hover:text-white transition-colors cursor-pointer flex items-center justify-between group"
              >
                <span>06. Typography</span>
                <span className="font-mono text-[10px] text-white/30 group-hover:text-clay">Q06</span>
              </li>
              <li
                onClick={onStartNew}
                className="hover:text-white transition-colors cursor-pointer flex items-center justify-between group"
              >
                <span>07. Shape & Spacing</span>
                <span className="font-mono text-[10px] text-white/30 group-hover:text-clay">Q07</span>
              </li>
              <li
                onClick={onStartNew}
                className="hover:text-white transition-colors cursor-pointer flex items-center justify-between group"
              >
                <span>08. Components</span>
                <span className="font-mono text-[10px] text-white/30 group-hover:text-clay">Q08</span>
              </li>
              <li
                onClick={onStartNew}
                className="hover:text-white transition-colors cursor-pointer flex items-center justify-between group"
              >
                <span>09. Imagery & Motion</span>
                <span className="font-mono text-[10px] text-white/30 group-hover:text-clay">Q09</span>
              </li>
              <li
                onClick={onStartNew}
                className="hover:text-white transition-colors cursor-pointer flex items-center justify-between group"
              >
                <span>10. Review & Audit</span>
                <span className="font-mono text-[10px] text-white/30 group-hover:text-clay">Q10</span>
              </li>
              <li
                onClick={onStartNew}
                className="hover:text-white transition-colors cursor-pointer flex items-center justify-between group"
              >
                <span>11. Export Center</span>
                <span className="font-mono text-[10px] text-white/30 group-hover:text-clay">Q11</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Export Formats (2 Cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-clay">
              Deliverables
            </h4>
            <ul className="space-y-2 text-xs text-white/70 font-light">
              <li className="flex items-center gap-2 hover:text-white transition-colors">
                <FileCode2 className="w-3.5 h-3.5 text-clay" />
                <span>Tailwind 4 (@theme)</span>
              </li>
              <li className="flex items-center gap-2 hover:text-white transition-colors">
                <FileCode2 className="w-3.5 h-3.5 text-blue-400" />
                <span>CSS Variables (:root)</span>
              </li>
              <li className="flex items-center gap-2 hover:text-white transition-colors">
                <FileJson className="w-3.5 h-3.5 text-amber-400" />
                <span>W3C Tokens JSON</span>
              </li>
              <li className="flex items-center gap-2 hover:text-white transition-colors">
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                <span>TypeScript Theme</span>
              </li>
              <li className="flex items-center gap-2 hover:text-white transition-colors">
                <FileText className="w-3.5 h-3.5 text-purple-400" />
                <span>4-Page PDF Spec</span>
              </li>
              <li className="flex items-center gap-2 hover:text-white transition-colors">
                <ImageIcon className="w-3.5 h-3.5 text-rose-400" />
                <span>PNG Design Board</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Curated Presets (2 Cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-clay">
              Presets & Genres
            </h4>
            <ul className="space-y-2 text-xs text-white/70 font-light">
              <li
                onClick={onExploreSample}
                className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-clay" />
                <span>Ceramics & Craft</span>
              </li>
              <li
                onClick={onStartNew}
                className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span>SaaS & Metrics</span>
              </li>
              <li
                onClick={onStartNew}
                className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                <span>Atelier Fashion</span>
              </li>
              <li
                onClick={onStartNew}
                className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <span>Audio Labs DAC</span>
              </li>
              <li
                onClick={onStartNew}
                className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Agency Portfolio</span>
              </li>
            </ul>
          </div>

          {/* Col 5: Core Standards (2 Cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-clay">
              Core Standards
            </h4>
            <ul className="space-y-2 text-xs text-white/70 font-light">
              <li className="hover:text-white transition-colors">WCAG 2.2 AA Audit</li>
              <li className="hover:text-white transition-colors">OKLCH Color Math</li>
              <li className="hover:text-white transition-colors">8px Harmonic Grid</li>
              <li className="hover:text-white transition-colors">Major Third Ratio</li>
              <li className="hover:text-white transition-colors">Spring Kinetics (280/22)</li>
              <li className="hover:text-white transition-colors">Fluid clamp() Scale</li>
            </ul>
          </div>

        </div>
      </div>

      {/* ==================== ZONE 3: BOTTOM TELEMETRY & BACK TO TOP BAR ==================== */}
      <div className="relative z-10 border-t border-white/10 bg-black/40 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/50 font-light">
            <span>© {new Date().getFullYear()} Design System Studio.</span>
            <span className="hidden sm:inline">•</span>
            <button
              onClick={() => onOpenLegal?.('privacy')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => onOpenLegal?.('terms')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <span className="hidden sm:inline">•</span>
            <span>Crafted for founders and engineers.</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-white/60">
            <span className="hidden md:inline-flex items-center gap-1.5 text-white/40">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Offline-First PWA</span>
            </span>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/15 hover:border-white/30 hover:text-white transition-all cursor-pointer bg-white/5 hover:bg-white/10"
              title="Scroll back to top of the page"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

