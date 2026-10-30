import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Eye,
  Sliders,
  Sparkles,
  Maximize2,
  Minimize2,
  Columns2,
  Layout,
  Smartphone,
  Monitor,
  Tablet,
  Check,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  X
} from 'lucide-react';
import { DesignProject } from '../../types/designSystem';
import { LiveWebsitePreview } from '../preview/LiveWebsitePreview';

interface WizardWorkspaceStageProps {
  project: DesignProject;
  children: React.ReactNode; // The active wizard step form
  currentStep: number;
  totalSteps?: number;
}

export const WizardWorkspaceStage: React.FC<WizardWorkspaceStageProps> = ({
  project,
  children,
  currentStep,
  totalSteps = 14
}) => {
  // Desktop layout mode: 'split' (50/50 side by side) | 'focus-form' | 'focus-preview'
  const [layoutMode, setLayoutMode] = useState<'split' | 'focus-form' | 'focus-preview'>('split');
  
  // Mobile active tab: 'form' | 'preview'
  const [mobileTab, setMobileTab] = useState<'form' | 'preview'>('form');

  // Flash indicator when project properties change
  const [changeFlash, setChangeFlash] = useState(false);
  const prevProjectRef = useRef(project);

  useEffect(() => {
    // Detect changes in active project
    if (prevProjectRef.current !== project) {
      setChangeFlash(true);
      const timer = setTimeout(() => setChangeFlash(false), 1400);
      prevProjectRef.current = project;
      return () => clearTimeout(timer);
    }
  }, [project]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-neutral-100/70">
      
      {/* ================= TOP CONTEXTUAL CATEGORY & PREVIEW STATUS BANNER ================= */}
      <div className="bg-white border-b border-neutral-200 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 shrink-0 shadow-2xs z-20">
        
        {/* Left: Active Selected Website Category & Genre Identity */}
        <div className="flex items-center gap-2.5 flex-wrap min-w-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[11px] font-bold text-neutral-800 uppercase tracking-wider hidden sm:inline">
              Live Reactive Site:
            </span>
          </div>

          {/* Selected Category Pill */}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-neutral-900 text-white shadow-2xs shrink-0">
            <span className="text-neutral-400 font-normal">Category:</span>
            <span>{project.websiteType.category || 'General'}</span>
          </span>

          {/* Selected Genre Pill */}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-clay/10 text-clay border border-clay/25 shadow-2xs truncate max-w-[220px]">
            <span className="text-clay/60 font-mono font-normal">Type:</span>
            <span className="truncate">{project.websiteType.name}</span>
          </span>

          {/* Live Reactive Flash Badge */}
          <AnimatePresence>
            {changeFlash && (
              <motion.span
                initial={{ opacity: 0, scale: 0.9, y: 2 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -2 }}
                transition={{ duration: 0.2 }}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs shrink-0"
              >
                <Sparkles className="w-3 h-3 text-emerald-600 animate-spin" />
                <span>Site Updated Live</span>
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Desktop Split / Focus Layout Controls */}
        <div className="hidden lg:flex items-center gap-1.5 bg-neutral-100 p-1 rounded-xl border border-neutral-200 shrink-0">
          <button
            onClick={() => setLayoutMode('split')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              layoutMode === 'split'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
            title="Split screen: Questions on left, Live site on right"
          >
            <Columns2 className="w-3.5 h-3.5" />
            <span>Split Studio (50/50)</span>
          </button>

          <button
            onClick={() => setLayoutMode('focus-form')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              layoutMode === 'focus-form'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
            title="Focus Mode: Full width questions"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Questions Only</span>
          </button>

          <button
            onClick={() => setLayoutMode('focus-preview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              layoutMode === 'focus-preview'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
            title="Full Preview Mode: Inspect the complete website"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Full Site Preview</span>
          </button>
        </div>

        {/* Mobile View Toggle Buttons (< 1024px) */}
        <div className="flex lg:hidden items-center gap-1 bg-neutral-100 p-0.5 rounded-lg border border-neutral-200">
          <button
            onClick={() => setMobileTab('form')}
            className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
              mobileTab === 'form'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Form
          </button>
          <button
            onClick={() => setMobileTab('preview')}
            className={`px-2.5 py-1 rounded text-xs font-bold transition-all flex items-center gap-1 ${
              mobileTab === 'preview'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <span>Live Site</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </button>
        </div>

      </div>

      {/* ================= MAIN DUAL WORKBENCH STAGE ================= */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* LEFT PANE: QUESTIONS & OPTIONS FORM */}
        <main
          className={`overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 transition-all duration-300 ${
            // Desktop width behavior
            layoutMode === 'split'
              ? 'w-full lg:w-[48%] xl:w-[46%] shrink-0 border-r border-neutral-200 bg-white'
              : layoutMode === 'focus-form'
              ? 'w-full max-w-5xl mx-auto bg-white'
              : 'hidden'
          } ${
            // Mobile visibility
            mobileTab === 'form' ? 'block' : 'hidden lg:block'
          }`}
        >
          {children}
        </main>

        {/* RIGHT PANE: LIVE INTERACTIVE WEBSITE PREVIEW STAGE */}
        <aside
          className={`flex-col bg-[#0A0D14] transition-all duration-300 relative overflow-hidden ${
            // Desktop width behavior
            layoutMode === 'split'
              ? 'hidden lg:flex flex-1 min-w-0 p-4'
              : layoutMode === 'focus-preview'
              ? 'flex w-full h-full p-4 sm:p-6'
              : 'hidden'
          } ${
            // Mobile visibility
            mobileTab === 'preview' ? 'flex w-full h-full p-2' : 'hidden lg:flex'
          }`}
        >
          {/* Header Telemetry inside the Preview Frame */}
          <div className="pb-3 mb-2 flex items-center justify-between border-b border-neutral-800 text-white shrink-0">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-mono text-xs font-bold text-neutral-200">
                Live Reactive Sandbox
              </span>
              <span className="hidden sm:inline text-neutral-500 text-xs font-mono">•</span>
              <span className="hidden sm:inline font-mono text-xs text-neutral-400">
                Real-time re-render for: <strong className="text-white">{project.websiteType.name}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-neutral-400 bg-white/10 px-2 py-0.5 rounded border border-white/10 hidden xl:inline">
                Step {currentStep} of {totalSteps} Decisions
              </span>
              {layoutMode === 'split' && (
                <button
                  onClick={() => setLayoutMode('focus-preview')}
                  className="hidden lg:flex items-center gap-1 text-[11px] font-mono text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg border border-white/10 transition-colors cursor-pointer"
                  title="Expand to Fullscreen Preview"
                >
                  <Maximize2 className="w-3 h-3" />
                  <span>Expand</span>
                </button>
              )}
              {layoutMode === 'focus-preview' && (
                <button
                  onClick={() => setLayoutMode('split')}
                  className="flex items-center gap-1 text-[11px] font-mono text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg border border-white/10 transition-colors cursor-pointer"
                  title="Return to 50/50 Split View"
                >
                  <Columns2 className="w-3 h-3" />
                  <span>Return to Split</span>
                </button>
              )}
            </div>
          </div>

          {/* Embedded Real-Time Reactive Site */}
          <div className="flex-1 min-h-0 relative rounded-xl overflow-hidden shadow-2xl">
            <LiveWebsitePreview
              project={project}
              initialViewport="desktop"
              isEmbedded
            />
          </div>
        </aside>

      </div>

      {/* ================= MOBILE FLOATING NAVIGATION DOCK (< 1024px) ================= */}
      <div className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-neutral-900/95 backdrop-blur-xl border border-neutral-700 p-1.5 rounded-full shadow-2xl flex items-center gap-1">
        <button
          onClick={() => setMobileTab('form')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
            mobileTab === 'form'
              ? 'bg-white text-neutral-900 shadow-md'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Questions (Step {currentStep})</span>
        </button>

        <button
          onClick={() => setMobileTab('preview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
            mobileTab === 'preview'
              ? 'bg-clay text-white shadow-md'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Live Site ({project.websiteType.category})</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      </div>

    </div>
  );
};

