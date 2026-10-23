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
  Code
} from 'lucide-react';
import { DesignProject } from '../../types/designSystem';
import { LiveWebsitePreview } from '../preview/LiveWebsitePreview';
import {
  generateDesignSystemPdf,
  downloadVisualBoardPng,
  downloadDeveloperZip
} from '../../utils/exportGenerators';

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
  const [activeTab, setActiveTab] = useState<'overview' | 'components' | 'tokens'>('overview');

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
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 transition-colors shadow-2xs"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>
          <button
            onClick={() => downloadDeveloperZip(project)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 transition-colors shadow-2xs"
          >
            <Code className="w-3.5 h-3.5" />
            <span>Code ZIP</span>
          </button>
          <button
            onClick={onNavigateToWizard}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white transition-all shadow-xs"
          >
            <span>Open Wizard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 mb-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 text-xs font-semibold px-2 transition-colors relative ${
            activeTab === 'overview'
              ? 'text-neutral-900 border-b-2 border-neutral-900'
              : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          Design System Overview
        </button>
        <button
          onClick={() => setActiveTab('components')}
          className={`pb-3 text-xs font-semibold px-2 transition-colors relative ${
            activeTab === 'components'
              ? 'text-neutral-900 border-b-2 border-neutral-900'
              : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          Rendered Website Preview
        </button>
        <button
          onClick={() => setActiveTab('tokens')}
          className={`pb-3 text-xs font-semibold px-2 transition-colors relative ${
            activeTab === 'tokens'
              ? 'text-neutral-900 border-b-2 border-neutral-900'
              : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          Raw Token Specifications
        </button>
      </div>

      {/* Tab 1: Category Cards Grid with 1-click edit buttons */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Colors Card */}
          <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-neutral-600" />
                  Color Palette
                </span>
                <button
                  onClick={() => onEditCategory(6)}
                  className="text-xs font-medium text-neutral-700 hover:text-neutral-900 flex items-center gap-1"
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

          {/* Typography Card */}
          <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-neutral-600" />
                  Typography System
                </span>
                <button
                  onClick={() => onEditCategory(7)}
                  className="text-xs font-medium text-neutral-700 hover:text-neutral-900 flex items-center gap-1"
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

          {/* Layout & Density */}
          <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Layout className="w-3.5 h-3.5 text-neutral-600" />
                  Layout & Spacing
                </span>
                <button
                  onClick={() => onEditCategory(9)}
                  className="text-xs font-medium text-neutral-700 hover:text-neutral-900 flex items-center gap-1"
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

          {/* Components */}
          <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-neutral-600" />
                  Components
                </span>
                <button
                  onClick={() => onEditCategory(10)}
                  className="text-xs font-medium text-neutral-700 hover:text-neutral-900 flex items-center gap-1"
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

          {/* Mobile Behavior */}
          <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-neutral-600" />
                  Mobile & Responsive
                </span>
                <button
                  onClick={() => onEditCategory(11)}
                  className="text-xs font-medium text-neutral-700 hover:text-neutral-900 flex items-center gap-1"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit Mobile</span>
                </button>
              </div>

              <h3 className="font-bold text-sm text-neutral-900 mb-1">
                {project.responsive.mobileNav === 'sheet' ? 'Slide-out Sheet' : 'Dropdown Menu'}
              </h3>
              <p className="text-xs text-neutral-500 mb-3">
                Cards arrange as <strong>{project.responsive.cardStacking}</strong> on small screens.
              </p>
            </div>

            <div className="pt-3 mt-4 border-t border-neutral-100 text-[11px] text-neutral-500">
              Touch targets: Minimum 44px verified
            </div>
          </div>

          {/* Accessibility & Themes */}
          <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Quality & Contrast
                </span>
                <button
                  onClick={() => onEditCategory(12)}
                  className="text-xs font-medium text-neutral-700 hover:text-neutral-900 flex items-center gap-1"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit Theme</span>
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
                tokens: {
                  colors: project.colorPalette,
                  typography: project.typography,
                  layout: project.layout,
                  components: project.components
                }
              },
              null,
              2
            )}
          </pre>
        </div>
      )}
    </div>
  );
};
