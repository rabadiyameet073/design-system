import React, { useState } from 'react';
import {
  Sparkles,
  FileText,
  Image,
  Code2,
  FileCode,
  Download,
  Copy,
  Check,
  Bot,
  Package,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion } from 'motion/react';
import { DesignProject } from '../../types/designSystem';
import {
  generateDesignSystemPdf,
  generateFounderHandoffBrief,
  generateAiWebsitePrompt,
  generateJsonTokens,
  generateCssVariables,
  generateTailwindConfig,
  generateTypeScriptDefinitions,
  downloadDeveloperZip,
  downloadVisualBoardPng,
  downloadNextJsStarterZip
} from '../../utils/exportGenerators';

interface Step14ExportCenterProps {
  project: DesignProject;
  onJumpToStep: (step: number) => void;
}

export const Step14ExportCenter: React.FC<Step14ExportCenterProps> = ({ project, onJumpToStep }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isPackagingZip, setIsPackagingZip] = useState(false);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadPdf = () => {
    setIsGeneratingPdf(true);
    try {
      generateDesignSystemPdf(project);
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.error('PDF generation error:', e);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleDownloadZip = async () => {
    setIsPackagingZip(true);
    try {
      await downloadDeveloperZip(project);
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.error('Zip generation error:', e);
    } finally {
      setIsPackagingZip(false);
    }
  };

  const [isPackagingNextJs, setIsPackagingNextJs] = useState(false);

  const handleDownloadNextJs = async () => {
    setIsPackagingNextJs(true);
    try {
      await downloadNextJsStarterZip(project);
      confetti({
        particleCount: 60,
        spread: 75,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.error('Next.js zip generation error:', e);
    } finally {
      setIsPackagingNextJs(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Intro */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-neutral-200 shadow-2xs text-neutral-800 text-xs font-medium mb-3">
          <img src="/icon.png" alt="D" className="w-4 h-4 rounded-xs object-contain" />
          <span>Step 14 of 14 · Complete Export Center</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-2">
          Download Your Design System
        </h1>
        <p className="text-sm text-neutral-600 max-w-lg mx-auto">
          Your complete brand specification is packaged and ready. Download the human-readable PDF, visual board, developer tokens, or AI website-builder prompt.
        </p>
      </div>

      <div className="space-y-6">
        {/* Deliverable 1: PDF Specification */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-bold text-neutral-900">
                  Complete Design System PDF Specification
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-100 text-neutral-700">
                  4 Pages · High-Res
                </span>
              </div>
              <p className="text-xs text-neutral-500 max-w-lg leading-relaxed">
                Includes project overview, brand principles, exact HEX color swatches, 50-900 shade ramps, typography hierarchy, layout spacing, and WCAG AA contrast audit.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white text-xs font-semibold rounded-lg hover:bg-neutral-800 transition-all shadow-xs shrink-0 self-start sm:self-auto"
          >
            <Download className="w-4 h-4" />
            <span>{isGeneratingPdf ? 'Typesetting PDF...' : 'Download PDF'}</span>
          </button>
        </div>

        {/* Deliverable 2: Visual Board PNG */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Image className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-bold text-neutral-900">
                  Visual Design System Board (PNG)
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-100 text-neutral-700">
                  1600 × 1000 Canvas
                </span>
              </div>
              <p className="text-xs text-neutral-500 max-w-lg leading-relaxed">
                A clean, shareable 16:9 mood board showcasing your brand colors, typography pairings, and interactive button & card states at a glance.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => downloadVisualBoardPng(project)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-neutral-200 text-neutral-800 text-xs font-semibold rounded-lg hover:bg-neutral-50 transition-all shadow-xs shrink-0 self-start sm:self-auto"
          >
            <Download className="w-4 h-4" />
            <span>Download Image</span>
          </button>
        </div>

        {/* Deliverable 3: AI Website Builder Prompt */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-900 mb-0.5">
                  AI Website-Builder System Prompt
                </h3>
                <p className="text-xs text-neutral-500">
                  Paste this into Claude, ChatGPT, Cursor, or v0 to build your website strictly using your design tokens.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleCopy('ai-prompt', generateAiWebsitePrompt(project))}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg border border-neutral-200 hover:bg-neutral-50 text-neutral-700 transition-colors shrink-0"
            >
              {copiedKey === 'ai-prompt' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'ai-prompt' ? 'Copied!' : 'Copy Prompt'}</span>
            </button>
          </div>

          <div className="bg-neutral-900 rounded-lg p-4 font-mono text-[11px] text-neutral-200 overflow-x-auto max-h-48 border border-neutral-800">
            <pre className="whitespace-pre-wrap">{generateAiWebsitePrompt(project)}</pre>
          </div>
        </div>

        {/* Deliverable 4: Next.js 15 Full-Stack App Router Starter */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center shrink-0 font-bold text-sm">
              ▲
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-bold text-neutral-900">
                  Next.js 15 (App Router) Complete Project Starter
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-900 text-white">
                  Next.js 15 + React 19
                </span>
              </div>
              <p className="text-xs text-neutral-500 max-w-lg leading-relaxed">
                Full production Next.js codebase containing <code>app/layout.tsx</code> with Google fonts, <code>app/page.tsx</code> with your design system layout, <code>app/globals.css</code>, and configured <code>tailwind.config.js</code>. Ready to run with <code>npm run dev</code>.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDownloadNextJs}
            disabled={isPackagingNextJs}
            className="flex items-center gap-2 px-5 py-2.5 bg-black text-white text-xs font-semibold rounded-lg hover:bg-neutral-800 transition-all shadow-xs shrink-0 self-start sm:self-auto cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isPackagingNextJs ? 'Generating Next.js...' : 'Download Next.js Starter'}</span>
          </button>
        </div>

        {/* Deliverable 5: Developer Assets & Full ZIP */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-900 mb-0.5">
                  Developer Code Package & Tokens (ZIP)
                </h3>
                <p className="text-xs text-neutral-500">
                  Ready-to-use tokens for engineers: JSON tokens, CSS variables, Tailwind config, and TypeScript constants.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownloadZip}
              disabled={isPackagingZip}
              className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white text-xs font-semibold rounded-lg hover:bg-neutral-800 transition-all shadow-xs shrink-0 self-start sm:self-auto"
            >
              <Download className="w-4 h-4" />
              <span>{isPackagingZip ? 'Packaging ZIP...' : 'Download Complete ZIP'}</span>
            </button>
          </div>

          {/* Quick Copy Tabs for Tokens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* CSS Variables */}
            <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-800 font-mono">variables.css</span>
                <button
                  type="button"
                  onClick={() => handleCopy('css-vars', generateCssVariables(project))}
                  className="text-xs font-medium text-neutral-600 hover:text-neutral-900 flex items-center gap-1"
                >
                  {copiedKey === 'css-vars' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'css-vars' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="text-[10px] font-mono text-neutral-600 overflow-x-auto max-h-24 bg-white p-2.5 rounded border border-neutral-200">
                {generateCssVariables(project)}
              </pre>
            </div>

            {/* Tailwind Config */}
            <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-800 font-mono">tailwind.config.js</span>
                <button
                  type="button"
                  onClick={() => handleCopy('tailwind-cfg', generateTailwindConfig(project))}
                  className="text-xs font-medium text-neutral-600 hover:text-neutral-900 flex items-center gap-1"
                >
                  {copiedKey === 'tailwind-cfg' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'tailwind-cfg' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="text-[10px] font-mono text-neutral-600 overflow-x-auto max-h-24 bg-white p-2.5 rounded border border-neutral-200">
                {generateTailwindConfig(project)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
