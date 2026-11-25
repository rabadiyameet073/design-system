import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Eye,
  Sliders,
  Sparkles,
  Maximize2,
  Minimize2,
  Columns2,
  Smartphone,
  Monitor,
  Tablet,
  Check,
  Sun,
  Moon,
  RotateCcw,
  RotateCw,
  ShieldCheck,
  AlertTriangle,
  Glasses,
  X,
  Split
} from 'lucide-react';
import { DesignProject } from '../../types/designSystem';
import { DesignTokens } from '../../tokens/types';
import { auditSemanticContrast } from '../../tokens/contrastEngine';
import { getStepFocusSection } from './stepDefinitions';

interface WizardWorkspaceStageProps {
  project: DesignProject;
  children: React.ReactNode;
  currentStep: number;
  totalSteps?: number;
  draftLabel?: string | null;
  onApplyDraft?: () => void;
  onDiscardDraft?: () => void;
  onToggleCompare?: () => void;
  isComparing?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

export const WizardWorkspaceStage: React.FC<WizardWorkspaceStageProps> = ({
  project,
  children,
  currentStep,
  totalSteps = 11,
  draftLabel = null,
  onApplyDraft,
  onDiscardDraft,
  onToggleCompare,
  isComparing = false,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false
}) => {
  // Desktop layout mode: 'split' (50/50) | 'focus-form' | 'focus-preview'
  const [layoutMode, setLayoutMode] = useState<'split' | 'focus-form' | 'focus-preview'>('split');
  // Mobile active tab: 'form' | 'preview'
  const [mobileTab, setMobileTab] = useState<'form' | 'preview'>('form');

  // Preview viewport: 'mobile' (375px) | 'tablet' (768px) | 'desktop' (100%)
  const [viewport, setViewport] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  // Theme mode: 'light' | 'dark'
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  // Colorblind simulation mode
  const [colorblindMode, setColorblindMode] = useState<
    'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia'
  >('none');

  useEffect(() => {
    const handleCbMode = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail) {
        setColorblindMode(detail);
      }
    };
    window.addEventListener('dss:set-colorblind-mode', handleCbMode);
    return () => window.removeEventListener('dss:set-colorblind-mode', handleCbMode);
  }, []);

  // A11y live stats from preview
  const [a11yStats, setA11yStats] = useState<{ pass: number; fail: number }>({ pass: 14, fail: 0 });

  // Iframe ref
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isIframeReady = useRef(false);

  // Send message to iframe helper
  const sendToPreview = useCallback((message: any) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(message, window.location.origin);
    }
  }, []);

  // Handle messages from preview iframe
  useEffect(() => {
    const handlePreviewMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const data = event.data;
      if (!data) return;

      if (data.type === 'READY') {
        isIframeReady.current = true;
        sendToPreview({
          type: 'INIT',
          genreId: project.websiteType?.id || project.tokens?.meta?.genreId || 'ceramics-atelier',
          tokens: project.tokens,
          mode,
          project: {
            name: project.name || project.tokens?.meta?.projectName,
            business: project.business,
            websiteType: project.websiteType,
            visualDirection: project.visualDirection,
            components: project.components,
            imagery: project.imagery,
            category: project.websiteType?.category || project.tokens?.meta?.category || 'commerce'
          }
        });
      }

      if (data.type === 'A11Y_RESULT') {
        setA11yStats({ pass: data.pass || 0, fail: data.fail || 0 });
      }
    };

    window.addEventListener('message', handlePreviewMessage);
    return () => window.removeEventListener('message', handlePreviewMessage);
  }, [project, mode, sendToPreview]);

  // Outbound rAF throttler for TOKENS (Doc 02 §3.2)
  const pendingTokensRef = useRef<DesignTokens | null>(null);
  const rafIdRef = useRef<number | null>(null);

  // Synchronize tokens to iframe whenever project or tokens change (throttled to 1 per animation frame)
  useEffect(() => {
    if (project.tokens) {
      pendingTokensRef.current = project.tokens;

      if (rafIdRef.current === null) {
        rafIdRef.current = requestAnimationFrame(() => {
          if (pendingTokensRef.current) {
            sendToPreview({
              type: 'TOKENS',
              tokens: pendingTokensRef.current,
              genreId: project.websiteType?.id || project.tokens?.meta?.genreId,
              mode,
              project: {
                name: project.name || project.tokens?.meta?.projectName,
                business: project.business,
                websiteType: project.websiteType,
                visualDirection: project.visualDirection,
                components: project.components,
                imagery: project.imagery,
                category: project.websiteType?.category || project.tokens?.meta?.category || 'commerce'
              }
            });
            pendingTokensRef.current = null;
          }
          rafIdRef.current = null;
        });
      }

      // Local compute fallback for a11y
      if (project.tokens.color?.semantic) {
        const audit = auditSemanticContrast(project.tokens.color.semantic[mode]);
        setA11yStats({ pass: audit.passCount, fail: audit.failCount });
      }
    }

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [project, mode, sendToPreview]);

  // Synchronize genre when project genre changes
  const activeGenreId = project.websiteType?.id || project.tokens?.meta?.genreId;
  useEffect(() => {
    if (activeGenreId) {
      sendToPreview({
        type: 'INIT',
        genreId: activeGenreId,
        tokens: project.tokens,
        mode,
        project: {
          name: project.name || project.tokens?.meta?.projectName,
          business: project.business,
          websiteType: project.websiteType,
          visualDirection: project.visualDirection,
          components: project.components,
          imagery: project.imagery,
          category: project.websiteType?.category || project.tokens?.meta?.category || 'commerce'
        }
      });
    }
  }, [activeGenreId, project, mode, sendToPreview]);

  // Auto-scroll iframe preview to relevant section for active wizard step (Doc 02 §3.4 & §5)
  useEffect(() => {
    const targetSection = getStepFocusSection(currentStep);
    const timer = setTimeout(() => {
      sendToPreview({ type: 'SCROLL_TO', sectionId: targetSection });
    }, 200);
    return () => clearTimeout(timer);
  }, [currentStep, sendToPreview]);

  const toggleMode = () => {
    const nextMode = mode === 'light' ? 'dark' : 'light';
    setMode(nextMode);
    sendToPreview({ type: 'MODE', mode: nextMode });
  };

  useEffect(() => {
    const handleCustomToggle = () => toggleMode();
    window.addEventListener('dss:toggle-mode', handleCustomToggle);
    return () => window.removeEventListener('dss:toggle-mode', handleCustomToggle);
  }, [mode, project.tokens]);

  // Viewport container width style
  const getViewportWidth = () => {
    switch (viewport) {
      case 'mobile':
        return 'w-[375px] max-w-[375px]';
      case 'tablet':
        return 'w-[768px] max-w-[768px]';
      case 'desktop':
      default:
        return 'w-full max-w-full';
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-neutral-100/70">
      {/* ================= TOP PERMANENT WORKBENCH RIBBON ================= */}
      <div className="bg-white border-b border-neutral-200 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 shrink-0 shadow-2xs z-20">
        {/* Left: Active Website Identity & Draft Preview Status */}
        <div className="flex items-center gap-2.5 flex-wrap min-w-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse motion-reduce:animate-none" />
            <span className="font-mono text-[11px] font-bold text-neutral-800 uppercase tracking-wider hidden sm:inline">
              Live Preview:
            </span>
          </div>

          {/* Selected Category Pill */}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-neutral-900 text-white shadow-2xs shrink-0">
            <span className="text-neutral-400 font-normal">Category:</span>
            <span>{project.tokens?.meta?.category || project.websiteType?.category || 'Commerce'}</span>
          </span>

          {/* Selected Genre Pill */}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300 shadow-2xs truncate max-w-[200px]">
            <span className="text-amber-700/60 font-mono font-normal">Type:</span>
            <span className="truncate">{project.websiteType?.name || 'Ceramics Atelier'}</span>
          </span>

          {/* Draft Preview Ribbon (Apply / Discard / Compare) */}
          <AnimatePresence>
            {draftLabel && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -2 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -2 }}
                className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full shadow-2xs shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-spin motion-reduce:animate-none" />
                <span className="text-xs font-bold text-indigo-900">
                  {isComparing ? 'Comparing (A): Original' : `Previewing (B): ${draftLabel}`}
                </span>
                {onToggleCompare && (
                  <button
                    type="button"
                    onClick={onToggleCompare}
                    title="Toggle between original (A) and preview draft (B) [Hotkey: C]"
                    className={`ml-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition-colors cursor-pointer flex items-center gap-1 ${
                      isComparing
                        ? 'bg-amber-500 text-white border-amber-600 shadow-2xs'
                        : 'bg-indigo-100 text-indigo-900 border-indigo-300 hover:bg-indigo-200'
                    }`}
                  >
                    <span>{isComparing ? 'Showing: Original (A)' : 'Compare A/B (C)'}</span>
                  </button>
                )}
                {onApplyDraft && (
                  <button
                    onClick={onApplyDraft}
                    className="ml-1 px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[11px] font-bold hover:bg-indigo-700 transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                )}
                {onDiscardDraft && (
                  <button
                    onClick={onDiscardDraft}
                    className="px-2 py-0.5 rounded-full bg-white text-indigo-900 border border-indigo-200 text-[11px] font-bold hover:bg-neutral-100 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Undo/Redo & View Mode Switches */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Undo / Redo */}
          <div className="hidden sm:flex items-center gap-1 bg-neutral-100 p-0.5 rounded-lg border border-neutral-200">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              title="Undo (Ctrl+Z)"
              className={`p-1.5 rounded transition-all ${
                canUndo ? 'text-neutral-700 hover:bg-white hover:shadow-2xs cursor-pointer' : 'text-neutral-300 cursor-not-allowed'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              title="Redo (Ctrl+Shift+Z)"
              className={`p-1.5 rounded transition-all ${
                canRedo ? 'text-neutral-700 hover:bg-white hover:shadow-2xs cursor-pointer' : 'text-neutral-300 cursor-not-allowed'
              }`}
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Desktop Layout Split / Focus Buttons */}
          <div className="hidden lg:flex items-center gap-1 bg-neutral-100 p-1 rounded-xl border border-neutral-200">
            <button
              onClick={() => setLayoutMode('split')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                layoutMode === 'split' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
              }`}
              title="Split Studio (50/50)"
            >
              <Columns2 className="w-3.5 h-3.5" />
              <span>Split (50/50)</span>
            </button>

            <button
              onClick={() => setLayoutMode('focus-form')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                layoutMode === 'focus-form' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
              }`}
              title="Questions Only"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Questions</span>
            </button>

            <button
              onClick={() => setLayoutMode('focus-preview')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                layoutMode === 'focus-preview' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
              }`}
              title="Full Preview"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Full Preview</span>
            </button>
          </div>

          {/* Mobile Switcher (< 1024px) */}
          <div className="flex lg:hidden items-center gap-1 bg-neutral-100 p-0.5 rounded-lg border border-neutral-200">
            <button
              onClick={() => setMobileTab('form')}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                mobileTab === 'form' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500'
              }`}
            >
              Questions
            </button>
            <button
              onClick={() => setMobileTab('preview')}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-all flex items-center gap-1 ${
                mobileTab === 'preview' ? 'bg-neutral-900 text-white shadow-xs' : 'text-neutral-500'
              }`}
            >
              <span>Site</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse motion-reduce:animate-none" />
            </button>
          </div>
        </div>
      </div>

      {/* ================= MAIN DUAL WORKBENCH STAGE ================= */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* LEFT PANE: QUESTIONS & OPTIONS FORM */}
        <main
          className={`overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 transition-all duration-300 ${
            layoutMode === 'split'
              ? 'w-full lg:w-[48%] xl:w-[46%] shrink-0 border-r border-neutral-200 bg-white'
              : layoutMode === 'focus-form'
              ? 'w-full max-w-5xl mx-auto bg-white'
              : 'hidden'
          } ${mobileTab === 'form' ? 'block' : 'hidden lg:block'}`}
        >
          {children}
        </main>

        {/* RIGHT PANE: LIVE INTERACTIVE IFRAME PREVIEW STAGE */}
        <aside
          className={`flex-col bg-[#080B11] transition-all duration-300 relative overflow-hidden ${
            layoutMode === 'split'
              ? 'hidden lg:flex flex-1 min-w-0 p-4'
              : layoutMode === 'focus-preview'
              ? 'flex w-full h-full p-4 sm:p-6'
              : 'hidden'
          } ${mobileTab === 'preview' ? 'flex w-full h-full p-2' : 'hidden lg:flex'}`}
        >
          {/* Always-On Preview Toolbar: Viewports, Light/Dark, A11y Badge */}
          <div className="pb-3 mb-2 flex items-center justify-between border-b border-neutral-800 text-white shrink-0">
            {/* Viewport Switcher */}
            <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setViewport('mobile')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  viewport === 'mobile' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-300 hover:text-white'
                }`}
                title="Phone Viewport (375px)"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Phone (375px)</span>
              </button>
              <button
                onClick={() => setViewport('tablet')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  viewport === 'tablet' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-300 hover:text-white'
                }`}
                title="Tablet Viewport (768px)"
              >
                <Tablet className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tablet (768px)</span>
              </button>
              <button
                onClick={() => setViewport('desktop')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  viewport === 'desktop' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-300 hover:text-white'
                }`}
                title="Desktop Viewport (Fluid 100%)"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Desktop</span>
              </button>
            </div>

            {/* Middle: Colorblind Simulator, Light / Dark Toggle & A11y Badge */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              {/* Colorblind Vision Deficiency Simulator */}
              <div className="relative">
                <select
                  value={colorblindMode}
                  onChange={(e) => setColorblindMode(e.target.value as any)}
                  className="appearance-none pl-7 pr-3 py-1 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-bold text-neutral-200 transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-white/30"
                  title="Simulate Color Vision Deficiency (SVG feColorMatrix)"
                >
                  <option value="none" className="bg-neutral-900 text-white">Vision: Normal</option>
                  <option value="protanopia" className="bg-neutral-900 text-white">Protanopia (Red-blind)</option>
                  <option value="deuteranopia" className="bg-neutral-900 text-white">Deuteranopia (Green-blind)</option>
                  <option value="tritanopia" className="bg-neutral-900 text-white">Tritanopia (Blue-blind)</option>
                  <option value="achromatopsia" className="bg-neutral-900 text-white">Achromatopsia (Mono)</option>
                </select>
                <Glasses className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Light / Dark Mode Toggle */}
              <button
                onClick={toggleMode}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-bold text-neutral-200 transition-colors cursor-pointer"
                title="Toggle Light / Dark Ambient Theme"
              >
                {mode === 'dark' ? (
                  <>
                    <Moon className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Dark</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>Light</span>
                  </>
                )}
              </button>

              {/* Live WCAG A11y Badge */}
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-mono font-bold border ${
                  a11yStats.fail === 0
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                    : 'bg-amber-950/80 text-amber-300 border-amber-800'
                }`}
                title="Computed WCAG 2.2 AA Contrast Compliance"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>A11y: {a11yStats.pass}✓ {a11yStats.fail}✗</span>
              </div>
            </div>
          </div>

          {/* SVG Filter Matrix Definitions for Colorblind Simulation */}
          <svg className="hidden" aria-hidden="true">
            <defs>
              <filter id="dss-filter-protanopia">
                <feColorMatrix
                  type="matrix"
                  values="0.567, 0.433, 0,     0, 0
                          0.558, 0.442, 0,     0, 0
                          0,     0.242, 0.758, 0, 0
                          0,     0,     0,     1, 0"
                />
              </filter>
              <filter id="dss-filter-deuteranopia">
                <feColorMatrix
                  type="matrix"
                  values="0.625, 0.375, 0,   0, 0
                          0.7,   0.3,   0,   0, 0
                          0,     0.3,   0.7, 0, 0
                          0,     0,     0,   1, 0"
                />
              </filter>
              <filter id="dss-filter-tritanopia">
                <feColorMatrix
                  type="matrix"
                  values="0.95,  0.05,  0,     0, 0
                          0,     0.433, 0.567, 0, 0
                          0,     0.475, 0.525, 0, 0
                          0,     0,     0,     1, 0"
                />
              </filter>
              <filter id="dss-filter-achromatopsia">
                <feColorMatrix
                  type="matrix"
                  values="0.299, 0.587, 0.114, 0, 0
                          0.299, 0.587, 0.114, 0, 0
                          0.299, 0.587, 0.114, 0, 0
                          0,     0,     0,     1, 0"
                />
              </filter>
            </defs>
          </svg>

          {/* Iframe Viewport Container (True responsive width) */}
          <div className="flex-1 min-h-0 flex items-center justify-center relative overflow-hidden">
            <div
              className={`h-full transition-all duration-300 relative rounded-xl overflow-hidden shadow-2xl border border-neutral-800 bg-white ${getViewportWidth()}`}
              style={{
                filter: colorblindMode !== 'none' ? `url(#dss-filter-${colorblindMode})` : undefined
              }}
            >
              <iframe
                ref={iframeRef}
                src="/preview-frame"
                title="Live Reactive Template"
                className="w-full h-full border-0"
                onLoad={() => {
                  sendToPreview({
                    type: 'INIT',
                    genreId: project.tokens?.meta?.genreId || project.websiteType?.id || 'ceramics-atelier',
                    tokens: project.tokens,
                    mode,
                    project: {
                      name: project.name || project.tokens?.meta?.projectName,
                      business: project.business,
                      websiteType: project.websiteType,
                      visualDirection: project.visualDirection,
                      components: project.components,
                      imagery: project.imagery
                    }
                  });
                }}
              />
            </div>
          </div>
        </aside>
      </div>

      {/* ================= MOBILE FLOATING BOTTOM DOCK (< 1024px) ================= */}
      <div className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-neutral-900/95 backdrop-blur-xl border border-neutral-700 p-1.5 rounded-full shadow-2xl flex items-center gap-1">
        <button
          onClick={() => setMobileTab('form')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
            mobileTab === 'form' ? 'bg-white text-neutral-900 shadow-md' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Questions ({currentStep}/{totalSteps})</span>
        </button>

        <button
          onClick={() => setMobileTab('preview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
            mobileTab === 'preview' ? 'bg-amber-500 text-neutral-900 shadow-md' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Live Site</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse motion-reduce:animate-none" />
        </button>
      </div>
    </div>
  );
};
