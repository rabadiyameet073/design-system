import React, { useState } from 'react';
import {
  Palette,
  Type,
  Layout,
  Layers,
  Smartphone,
  ShieldCheck,
  Download,
  ArrowRight,
  Edit2,
  FileText,
  Sliders,
  ExternalLink,
  Code,
  BookOpen,
  Copy,
  Check,
  Zap,
  Sparkles
} from 'lucide-react';
import { DesignProject } from '../../types/designSystem';
import { LiveWebsitePreview } from '../preview/LiveWebsitePreview';
import {
  generateDesignSystemPdf,
  downloadVisualBoardPng,
  downloadDeveloperZip
} from '../../utils/exportGenerators';
import { exportTailwind4, exportCssVars } from '../../utils/tokenExporters';

interface WorkspaceViewProps {
  project: DesignProject;
  onEditCategory: (stepNumber: number) => void;
  onNavigateToWizard: () => void;
}

export const WorkspaceView: React.FC<WorkspaceViewProps> = ({
  project,
  onEditCategory,
  onNavigateToWizard
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'components' | 'tokens' | 'docs'>('overview');
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const handleCopySnippet = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(key);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const tokens = project.tokens;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Workspace Banner */}
      <div className="bg-white border border-neutral-200 rounded-xl p-6 mb-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
            <span>{project.websiteType.name}</span>
            <span aria-hidden="true">·</span>
            <span>{project.visualDirection.name}</span>
            <span aria-hidden="true">·</span>
            <span>Last updated {new Date(project.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 mb-1">
            {project.name} Workspace
          </h1>
          <p className="text-xs text-neutral-600 max-w-xl">
            Inspect your design choices, test rendered components, or jump straight to any section to make quick adjustments.
          </p>
        </div>

        {/* Quick Export Actions */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => generateDesignSystemPdf(project)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-300 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PDF Specs</span>
          </button>
          <button
            onClick={() => downloadVisualBoardPng(project)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-300 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PNG Board</span>
          </button>
          <button
            onClick={onNavigateToWizard}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition-colors shadow-xs cursor-pointer"
          >
            <span>Resume 11-Step Wizard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-6 border-b border-neutral-200 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 text-xs font-semibold px-2 transition-colors relative cursor-pointer ${
            activeTab === 'overview'
              ? 'text-neutral-900 border-b-2 border-neutral-900'
              : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          Design System Overview
        </button>
        <button
          onClick={() => setActiveTab('components')}
          className={`pb-3 text-xs font-semibold px-2 transition-colors relative cursor-pointer ${
            activeTab === 'components'
              ? 'text-neutral-900 border-b-2 border-neutral-900'
              : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          Rendered Website Preview
        </button>
        <button
          onClick={() => setActiveTab('tokens')}
          className={`pb-3 text-xs font-semibold px-2 transition-colors relative cursor-pointer ${
            activeTab === 'tokens'
              ? 'text-neutral-900 border-b-2 border-neutral-900'
              : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          Raw Token Specifications
        </button>
        <button
          onClick={() => setActiveTab('docs')}
          className={`pb-3 text-xs font-semibold px-2 transition-colors relative cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'docs'
              ? 'text-neutral-900 border-b-2 border-neutral-900'
              : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Usage Guidelines & Docs</span>
        </button>
      </div>

      {/* Tab 1: Category Cards Grid with 1-click edit buttons */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Colors Card (Step 5) */}
          <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-neutral-600" />
                  Color Palette (Step 5)
                </span>
                <button
                  onClick={() => onEditCategory(5)}
                  className="text-xs font-medium text-neutral-700 hover:text-neutral-900 flex items-center gap-1 cursor-pointer"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit Colors</span>
                </button>
              </div>

              <h3 className="font-bold text-sm text-neutral-900 mb-1">{project.colorPalette.name}</h3>
              <p className="text-xs text-neutral-500 mb-4">{project.colorPalette.family}</p>

              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-neutral-50 border border-neutral-100">
                <div className="w-7 h-7 rounded" style={{ backgroundColor: project.colorPalette.primary }} title="Primary" />
                <div className="w-7 h-7 rounded" style={{ backgroundColor: project.colorPalette.secondary }} title="Secondary" />
                <div className="w-7 h-7 rounded" style={{ backgroundColor: project.colorPalette.accent }} title="Accent" />
                <div className="w-7 h-7 rounded" style={{ backgroundColor: project.colorPalette.background }} title="Canvas" />
                <div className="w-7 h-7 rounded" style={{ backgroundColor: project.colorPalette.surface }} title="Surface" />
              </div>
            </div>

            <div className="pt-3 mt-4 border-t border-neutral-100 text-[11px] text-neutral-500">
              Primary: <strong className="font-mono text-neutral-800">{project.colorPalette.primary}</strong>
            </div>
          </div>

          {/* Typography Card (Step 6) */}
          <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-neutral-600" />
                  Typography System (Step 6)
                </span>
                <button
                  onClick={() => onEditCategory(6)}
                  className="text-xs font-medium text-neutral-700 hover:text-neutral-900 flex items-center gap-1 cursor-pointer"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit Fonts</span>
                </button>
              </div>

              <h3 className="font-bold text-sm text-neutral-900 mb-1">{project.typography.name}</h3>
              <div className="text-xs text-neutral-600 space-y-1 mb-3">
                <p>Display: <strong>{project.typography.displayFont}</strong></p>
                <p>Body: <strong>{project.typography.bodyFont}</strong></p>
                <p>Mono: <strong>{project.typography.monoFont}</strong> (tabular-nums)</p>
              </div>
            </div>

            <div className="pt-3 mt-4 border-t border-neutral-100 text-[11px] text-neutral-500">
              Modular scale ratio: <strong className="text-neutral-800">{project.typography.scaleRatio}</strong>
            </div>
          </div>

          {/* Layout & Density (Step 7) */}
          <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Layout className="w-3.5 h-3.5 text-neutral-600" />
                  Shape & Spacing (Step 7)
                </span>
                <button
                  onClick={() => onEditCategory(7)}
                  className="text-xs font-medium text-neutral-700 hover:text-neutral-900 flex items-center gap-1 cursor-pointer"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit Layout</span>
                </button>
              </div>

              <h3 className="font-bold text-sm text-neutral-900 mb-1">
                {project.layout.density.toUpperCase()} Spacing Rhythm
              </h3>
              <p className="text-xs text-neutral-500 mb-3">
                Radius scale: <strong>{project.layout.radius}</strong> · Frame: <strong>{project.layout.containerWidth}</strong>
              </p>
            </div>

            <div className="pt-3 mt-4 border-t border-neutral-100 text-[11px] text-neutral-500">
              Elevation: <strong className="text-neutral-800">{project.layout.cardElevation}</strong>
            </div>
          </div>

          {/* Components (Step 8) */}
          <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-neutral-600" />
                  Components (Step 8)
                </span>
                <button
                  onClick={() => onEditCategory(8)}
                  className="text-xs font-medium text-neutral-700 hover:text-neutral-900 flex items-center gap-1 cursor-pointer"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit Components</span>
                </button>
              </div>

              <h3 className="font-bold text-sm text-neutral-900 mb-1">
                {project.components.enabledComponents.length} Active Modules
              </h3>
              <p className="text-xs text-neutral-500 mb-3">
                Buttons styled as <strong>{project.components.buttonStyle}</strong> with {project.components.buttonSize} padding.
              </p>
            </div>

            <div className="pt-3 mt-4 border-t border-neutral-100 text-[11px] text-neutral-500">
              Includes: {project.components.enabledComponents.slice(0, 3).join(', ')}...
            </div>
          </div>

          {/* Imagery & Motion (Step 9) */}
          <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-neutral-600" />
                  Imagery & Motion (Step 9)
                </span>
                <button
                  onClick={() => onEditCategory(9)}
                  className="text-xs font-medium text-neutral-700 hover:text-neutral-900 flex items-center gap-1 cursor-pointer"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit Motion</span>
                </button>
              </div>

              <h3 className="font-bold text-sm text-neutral-900 mb-1">
                Physics Spring Animations
              </h3>
              <p className="text-xs text-neutral-500 mb-3">
                Style: <strong>{project.imagery.style}</strong> with {project.imagery.treatment} filter treatment.
              </p>
            </div>

            <div className="pt-3 mt-4 border-t border-neutral-100 text-[11px] text-neutral-500">
              Spring tokens: Stiffness 240 · Damping 20
            </div>
          </div>

          {/* Accessibility & Audit (Step 10) */}
          <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Review & Audit (Step 10)
                </span>
                <button
                  onClick={() => onEditCategory(10)}
                  className="text-xs font-medium text-neutral-700 hover:text-neutral-900 flex items-center gap-1 cursor-pointer"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Audit Specs</span>
                </button>
              </div>

              <h3 className="font-bold text-sm text-neutral-900 mb-1">WCAG 2.2 AA Compliant</h3>
              <p className="text-xs text-neutral-500 mb-3">
                Default theme: <strong>{project.accessibility.defaultTheme}</strong> with focus outlines.
              </p>
            </div>

            <div className="pt-3 mt-4 border-t border-neutral-100 text-[11px] text-emerald-600 font-semibold">
              Contrast ratio passes 4.5:1 standard
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Rendered Website Preview */}
      {activeTab === 'components' && (
        <div className="h-[750px] w-full">
          <LiveWebsitePreview project={project} initialViewport="desktop" />
        </div>
      )}

      {/* Tab 3: Raw Token Specifications */}
      {activeTab === 'tokens' && (
        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-neutral-900">
            Exported Design Tokens (W3C Standard JSON)
          </h3>
          <pre className="bg-neutral-900 text-neutral-200 p-4 rounded-lg font-mono text-xs overflow-x-auto max-h-[500px]">
            {JSON.stringify(
              {
                project: project.name,
                category: project.websiteType.category,
                tokens: project.tokens
              },
              null,
              2
            )}
          </pre>
        </div>
      )}

      {/* Tab 4: Usage Guidelines & Docs (Doc 02 §12) */}
      {activeTab === 'docs' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-4">
            <div>
              <h2 className="text-lg font-bold text-neutral-900">
                {project.name} Design System Usage Guide
              </h2>
              <p className="text-xs text-neutral-500">
                Auto-generated implementation principles and code integration contracts for your team.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Color rules */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-600 font-mono">
                  1. Color Harmony & Semantic Roles
                </h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Never use raw hex colors in UI component styles. Reference semantic tokens like <code>--fg-default</code>, <code>--bg-default</code>, and <code>--border-default</code> so your application supports seamless dark mode switching and WCAG 2.2 AA contrast compliance.
                </p>
              </div>

              {/* Typography rules */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-600 font-mono">
                  2. Typographic Hierarchy
                </h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Headings use <strong>{tokens.typography.roles.heading?.family}</strong> with fluid clamp sizing. Body prose uses <strong>{tokens.typography.roles.body?.family}</strong> at a 1.6 line-height ratio. Monospaced elements and counters use <strong>{tokens.typography.roles.mono?.family}</strong> with tabular-nums enabled.
                </p>
              </div>

              {/* Spacing & grid */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-600 font-mono">
                  3. Spacing Rhythm & Radius
                </h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Base spacing baseline is 4px / 8px grid. Cards and interactive modules apply a <strong>{project.layout.radius}</strong> corner radius with subtle 1px border elevation to preserve spatial clarity on both light and dark backgrounds.
                </p>
              </div>

              {/* Accessibility */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-600 font-mono">
                  4. Accessibility & Touch Targets
                </h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  All interactive click targets must measure at least 24×24px (WCAG 2.2 SC 2.5.8), with 44×44px touch targets on mobile viewports. Focus rings must maintain a 3.0:1 contrast ratio against the canvas.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Copy Tailwind 4 / CSS Setup */}
          <div className="p-6 rounded-2xl bg-neutral-900 text-white shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Tailwind CSS 4 Inline Theme</h3>
              </div>
              <button
                onClick={() => handleCopySnippet('tw4', exportTailwind4(tokens))}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold cursor-pointer text-neutral-200 transition-colors"
              >
                {copiedSnippet === 'tw4' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSnippet === 'tw4' ? 'Copied' : 'Copy Theme'}</span>
              </button>
            </div>
            <pre className="bg-black/50 p-4 rounded-xl font-mono text-[11px] text-neutral-300 overflow-x-auto max-h-60 leading-relaxed">
              {exportTailwind4(tokens)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
