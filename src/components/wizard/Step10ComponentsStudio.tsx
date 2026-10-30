import React, { useState } from 'react';
import {
  Sparkles,
  Check,
  CheckSquare,
  Square,
  Layers,
  MousePointer,
  Plus,
  Loader2,
  AlertCircle,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { DesignProject, ComponentConfig } from '../../types/designSystem';

interface Step10ComponentsStudioProps {
  project: DesignProject;
  onChange: (updated: Partial<DesignProject>) => void;
}

export const Step10ComponentsStudio: React.FC<Step10ComponentsStudioProps> = ({ project, onChange }) => {
  const [customCompName, setCustomCompName] = useState('');
  const [activeTab, setActiveTab] = useState<'buttons' | 'inputs' | 'badges' | 'modules'>('buttons');

  const brandHex = project.tokens?.color?.primitives?.brand?.[600] || project.colorPalette?.primary || '#B7410E';
  const radiusMd = project.tokens?.radius?.md ?? 8;
  const radiusSm = project.tokens?.radius?.sm ?? 4;
  const radiusLg = project.tokens?.radius?.lg ?? 12;

  const updateComponentConfig = (key: keyof ComponentConfig, val: any) => {
    onChange({
      components: {
        ...project.components,
        [key]: val
      }
    });
  };

  const toggleComponent = (compId: string) => {
    const current = project.components.enabledComponents || [];
    const next = current.includes(compId)
      ? current.filter(c => c !== compId)
      : [...current, compId];

    updateComponentConfig('enabledComponents', next);
  };

  const handleAddCustomComponent = () => {
    if (customCompName.trim()) {
      const sanitized = customCompName.trim().toLowerCase().replace(/[^a-z0-9]/g, '-');
      const current = project.components.enabledComponents || [];
      if (!current.includes(sanitized)) {
        updateComponentConfig('enabledComponents', [...current, sanitized]);
      }
      setCustomCompName('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 text-white text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Step 8 of 11 · Website Components & UI Kit</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          Component variants, interactive states & modules
        </h1>
        <p className="text-sm text-neutral-600 leading-relaxed max-w-2xl">
          Preview how your tokens govern buttons, input fields, badges, and cards across all states (default, hover, focus, disabled, loading).
        </p>
      </div>

      {/* Navigation tabs between component types */}
      <div className="flex items-center gap-1.5 p-1 bg-white border border-neutral-200 rounded-xl overflow-x-auto shadow-xs">
        {[
          { id: 'buttons', label: 'Buttons (Variants × Sizes × States)' },
          { id: 'inputs', label: 'Form Controls & Inputs' },
          { id: 'badges', label: 'Badges & Status Alerts' },
          { id: 'modules', label: 'Active Site Modules' }
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* BUTTONS SHOWCASE */}
      {activeTab === 'buttons' && (
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="border-b border-neutral-100 pb-3">
            <h3 className="text-sm font-bold text-neutral-900">
              Button Hierarchy & Interactive States
            </h3>
            <p className="text-xs text-neutral-500">
              Tested for touch-target standards (min 44px on mobile) and 2px focus-visible rings with ≥3:1 contrast.
            </p>
          </div>

          {/* Sizes (sm, md, lg) */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">
              Sizes (sm, md, lg)
            </span>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="px-3 py-1.5 text-xs font-bold text-white shadow-xs"
                style={{ backgroundColor: brandHex, borderRadius: `${radiusSm}px` }}
              >
                Small (sm · 32px)
              </button>
              <button
                type="button"
                className="px-4 py-2.5 text-sm font-bold text-white shadow-xs"
                style={{ backgroundColor: brandHex, borderRadius: `${radiusMd}px` }}
              >
                Medium (md · 40px)
              </button>
              <button
                type="button"
                className="px-6 py-3.5 text-base font-bold text-white shadow-sm"
                style={{ backgroundColor: brandHex, borderRadius: `${radiusLg}px` }}
              >
                Large (lg · 48px)
              </button>
            </div>
          </div>

          {/* Variants (Filled, Outline, Subtle, Ghost, Destructive) */}
          <div className="space-y-2 pt-2 border-t border-neutral-100">
            <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">
              Variants (Filled, Outline, Subtle, Ghost, Destructive)
            </span>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="px-4 py-2 text-xs font-bold text-white shadow-xs"
                style={{ backgroundColor: brandHex, borderRadius: `${radiusMd}px` }}
              >
                Primary Filled
              </button>
              <button
                type="button"
                className="px-4 py-2 text-xs font-bold bg-white border-2 shadow-xs"
                style={{ color: brandHex, borderColor: brandHex, borderRadius: `${radiusMd}px` }}
              >
                Outline Hairline
              </button>
              <button
                type="button"
                className="px-4 py-2 text-xs font-bold shadow-2xs"
                style={{
                  backgroundColor: `${brandHex}18`,
                  color: brandHex,
                  borderRadius: `${radiusMd}px`
                }}
              >
                Subtle Tinted
              </button>
              <button
                type="button"
                className="px-4 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-100 transition-colors"
                style={{ borderRadius: `${radiusMd}px` }}
              >
                Ghost Minimal
              </button>
              <button
                type="button"
                className="px-4 py-2 text-xs font-bold bg-rose-600 text-white shadow-xs hover:bg-rose-700"
                style={{ borderRadius: `${radiusMd}px` }}
              >
                Destructive
              </button>
            </div>
          </div>

          {/* Interactive States (Default, Hover, Focus-Visible, Disabled, Loading) */}
          <div className="space-y-2 pt-2 border-t border-neutral-100">
            <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">
              Component States (:hover, :focus-visible, disabled, loading)
            </span>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="px-4 py-2 text-xs font-bold text-white shadow-xs"
                style={{ backgroundColor: brandHex, borderRadius: `${radiusMd}px` }}
              >
                Default State
              </button>
              <button
                type="button"
                className="px-4 py-2 text-xs font-bold text-white ring-4 ring-neutral-900/20 shadow-xs"
                style={{ backgroundColor: brandHex, borderRadius: `${radiusMd}px` }}
              >
                Focus Visible Ring
              </button>
              <button
                type="button"
                disabled
                className="px-4 py-2 text-xs font-bold bg-neutral-200 text-neutral-400 cursor-not-allowed shadow-none"
                style={{ borderRadius: `${radiusMd}px` }}
              >
                Disabled State
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white opacity-90 shadow-xs"
                style={{ backgroundColor: brandHex, borderRadius: `${radiusMd}px` }}
              >
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Processing...</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FORM INPUTS SHOWCASE */}
      {activeTab === 'inputs' && (
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="border-b border-neutral-100 pb-3">
            <h3 className="text-sm font-bold text-neutral-900">
              Form Controls, Textarea & Input States
            </h3>
            <p className="text-xs text-neutral-500">
              Clear visual feedback across empty, active typing, and error validation states.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Default Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700">Default Input</label>
              <input
                type="text"
                placeholder="Enter email address..."
                className="w-full px-3.5 py-2 text-xs border border-neutral-300 bg-white text-neutral-900 shadow-2xs"
                style={{ borderRadius: `${radiusSm}px` }}
                readOnly
              />
              <span className="text-[10px] text-neutral-400">Helper text providing guidance.</span>
            </div>

            {/* Active / Focus State */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700">Focused Input Ring</label>
              <input
                type="text"
                defaultValue="hello@example.com"
                className="w-full px-3.5 py-2 text-xs border bg-white text-neutral-900 shadow-xs outline-none"
                style={{
                  borderRadius: `${radiusSm}px`,
                  borderColor: brandHex,
                  boxShadow: `0 0 0 3px ${brandHex}33`
                }}
                readOnly
              />
              <span className="text-[10px] text-neutral-500">High-contrast focus ring active.</span>
            </div>

            {/* Error Validation State */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-rose-700 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-rose-600" />
                <span>Error Validation State</span>
              </label>
              <input
                type="text"
                defaultValue="invalid-email-format"
                className="w-full px-3.5 py-2 text-xs border-2 border-rose-500 bg-rose-50/50 text-rose-900 shadow-2xs outline-none"
                style={{ borderRadius: `${radiusSm}px` }}
                readOnly
              />
              <span className="text-[10px] text-rose-600 font-medium">Please enter a valid email format.</span>
            </div>

            {/* Disabled State */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-400">Disabled State</label>
              <input
                type="text"
                value="System locked parameter"
                disabled
                className="w-full px-3.5 py-2 text-xs border border-neutral-200 bg-neutral-100 text-neutral-400 cursor-not-allowed"
                style={{ borderRadius: `${radiusSm}px` }}
              />
              <span className="text-[10px] text-neutral-400">Field cannot be edited.</span>
            </div>
          </div>
        </div>
      )}

      {/* BADGES & ALERTS SHOWCASE */}
      {activeTab === 'badges' && (
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="border-b border-neutral-100 pb-3">
            <h3 className="text-sm font-bold text-neutral-900">
              Status Badges, Tags & System Alerts
            </h3>
            <p className="text-xs text-neutral-500">
              Functional status indicators for success, warning, danger, and neutral categories.
            </p>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">
              Solid & Subtle Badges
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-neutral-900 text-white">
                Neutral Dark
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Success · Verified
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                Warning · Low Stock
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                Danger · Canceled
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-200">
                Info · Beta Release
              </span>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-neutral-100">
            <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">
              System Alerts (Info & Warning)
            </span>
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900">
                <strong className="font-bold">Shipping schedule note:</strong> Deliveries are scheduled for dispatch within 2 business days.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE SITE MODULES CHECKLIST */}
      {activeTab === 'modules' && (
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-neutral-900">
                Active Sections & Modules for {project.name}
              </h3>
              <p className="text-xs text-neutral-500">
                Select which sections to render inside your live template and export starter.
              </p>
            </div>
            <span className="text-xs font-semibold text-neutral-600 bg-neutral-100 px-2.5 py-1 rounded-full tabular-nums">
              {project.components.enabledComponents.length} Enabled
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'product-card', label: 'Product & Showcase Card', tech: 'catalog card', desc: 'Photo frame with price, title, and 1-click cart action.' },
              { id: 'pricing-matrix', label: 'Pricing Comparison Table', tech: 'tier comparison', desc: 'Clear tier comparison cards with explicit limits and billing cycles.' },
              { id: 'reviews-grid', label: 'Customer Reviews & Proof', tech: 'social proof grid', desc: 'Verified customer ratings with full name and outcome statements.' },
              { id: 'metrics-row', label: 'Statistics & Key Numbers', tech: 'kpi metric strip', desc: 'Big bold numbers with tabular figures for revenue, speed, and members.' },
              { id: 'curriculum-accordion', label: 'Frequently Asked Questions', tech: 'accordion list', desc: 'Expandable question list answering customer questions before buying.' },
              { id: 'newsletter', label: 'Email Capture & Waitlist', tech: 'lead capture form', desc: 'Single-line email capture box with instant confirmation feedback.' }
            ].map(comp => {
              const isEnabled = project.components.enabledComponents.includes(comp.id);
              return (
                <div
                  key={comp.id}
                  onClick={() => toggleComponent(comp.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                    isEnabled
                      ? 'border-neutral-900 bg-neutral-50/70 shadow-2xs'
                      : 'border-neutral-200 bg-white hover:border-neutral-300'
                  }`}
                >
                  <div className="mt-0.5 text-neutral-900 shrink-0">
                    {isEnabled ? (
                      <CheckSquare className="w-4 h-4 fill-neutral-900 text-white" />
                    ) : (
                      <Square className="w-4 h-4 text-neutral-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900">{comp.label}</h4>
                    <span className="text-[9px] font-mono text-neutral-400 block">{comp.tech}</span>
                    <p className="text-[11px] text-neutral-500 leading-relaxed mt-0.5">
                      {comp.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add custom module */}
          <div className="pt-3 border-t border-neutral-100 flex gap-2">
            <input
              type="text"
              value={customCompName}
              onChange={e => setCustomCompName(e.target.value)}
              placeholder="Add custom module (e.g. Booking Widget, Project Specimen)..."
              className="w-full px-3.5 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
            <button
              type="button"
              onClick={handleAddCustomComponent}
              className="px-4 py-2 text-xs font-bold bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors shrink-0 cursor-pointer"
            >
              Add Module
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
