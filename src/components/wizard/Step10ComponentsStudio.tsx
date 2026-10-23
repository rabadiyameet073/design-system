import React, { useState } from 'react';
import { Sparkles, Check, CheckSquare, Square, Layers, MousePointer, Plus } from 'lucide-react';
import { DesignProject, ComponentConfig } from '../../types/designSystem';

interface Step10ComponentsStudioProps {
  project: DesignProject;
  onChange: (updated: Partial<DesignProject>) => void;
}

export const Step10ComponentsStudio: React.FC<Step10ComponentsStudioProps> = ({ project, onChange }) => {
  const [customCompName, setCustomCompName] = useState('');

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

  const buttonStyles: { id: ComponentConfig['buttonStyle']; label: string; tech: string; whatIsIt: string }[] = [
    {
      id: 'solid',
      label: 'Solid Filled Button',
      tech: 'bg-primary text-white',
      whatIsIt: 'Best for primary conversions (Buy Now, Register). High visibility.'
    },
    {
      id: 'outline',
      label: 'Outline Hairline Button',
      tech: 'border-2 border-primary',
      whatIsIt: 'Sophisticated 2px border. Great for secondary actions and luxury.'
    },
    {
      id: 'subtle',
      label: 'Subtle Tinted Button',
      tech: 'bg-primary-100 text-primary-900',
      whatIsIt: 'Gentle colored background. Perfect for tabs and secondary choices.'
    }
  ];

  const availableComponents = [
    { id: 'product-card', label: 'Product & Showcase Card', tech: 'catalog card', desc: 'Photo frame with price, title, and 1-click cart action.' },
    { id: 'pricing-matrix', label: 'Pricing Comparison Table', tech: 'tier comparison', desc: 'Clear tier comparison cards with explicit limits and billing cycles.' },
    { id: 'reviews-grid', label: 'Customer Reviews & Proof', tech: 'social proof grid', desc: 'Verified customer ratings with full name and outcome statements.' },
    { id: 'metrics-row', label: 'Statistics & Key Numbers', tech: 'kpi metric strip', desc: 'Big bold numbers with tabular figures for revenue, speed, and members.' },
    { id: 'curriculum-accordion', label: 'Frequently Asked Questions', tech: 'accordion list', desc: 'Expandable question list answering customer questions before buying.' },
    { id: 'newsletter', label: 'Email Capture & Waitlist', tech: 'lead capture form', desc: 'Single-line email capture box with instant confirmation feedback.' }
  ];

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Header */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 text-xs font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5 text-neutral-900" />
          <span>Step 10 of 14 · Website Components</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-1">
          Select Your Website Building Blocks
        </h1>
        <span className="text-[11px] font-mono text-neutral-400 block mb-2">
          technical: reusable UI component library & interactive variants
        </span>
        <p className="text-sm text-neutral-600 max-w-lg mx-auto leading-relaxed">
          Components are the reusable cards, buttons, and tables that make up your pages. Every selected component inherits your verified brand colors and fonts.
        </p>
      </div>

      <div className="space-y-6">
        {/* Button Style Variants */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider">
              Main Action Button Appearance
            </label>
            <span className="text-[10px] font-mono text-neutral-400 block">
              technical: cta button variant (:hover, :focus, :active)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {buttonStyles.map(style => {
              const isSelected = project.components.buttonStyle === style.id;
              return (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => updateComponentConfig('buttonStyle', style.id)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-neutral-900 bg-white ring-2 ring-neutral-900 shadow-sm'
                      : 'border-neutral-200 bg-white hover:border-neutral-300'
                  }`}
                >
                  <div className="mb-3">
                    <div
                      className={`inline-flex items-center px-4 py-2 text-xs font-semibold rounded-lg ${
                        style.id === 'solid'
                          ? 'text-white'
                          : style.id === 'outline'
                          ? 'border-2 bg-transparent'
                          : 'bg-opacity-15'
                      }`}
                      style={{
                        backgroundColor:
                          style.id === 'solid'
                            ? project.colorPalette.primary
                            : style.id === 'subtle'
                            ? project.colorPalette.shades[100]
                            : 'transparent',
                        color:
                          style.id === 'solid'
                            ? '#FFFFFF'
                            : project.colorPalette.primary,
                        borderColor: project.colorPalette.primary
                      }}
                    >
                      Click Action
                    </div>
                  </div>
                  <h4 className="font-bold text-xs text-neutral-900 mb-0.5">{style.label}</h4>
                  <span className="text-[9px] font-mono text-neutral-400 block mb-1">{style.tech}</span>
                  <p className="text-[11px] text-neutral-500 leading-relaxed">{style.whatIsIt}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Enabled Components Checklist */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-3">
            <div>
              <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                Active Modules for {project.websiteType.name}
              </h3>
              <span className="text-[10px] font-mono text-neutral-400 block">
                technical: component catalog specification
              </span>
            </div>
            <span className="text-xs font-semibold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded tabular-nums self-start sm:self-auto">
              {project.components.enabledComponents.length} Selected
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {availableComponents.map(comp => {
              const isEnabled = project.components.enabledComponents.includes(comp.id);
              return (
                <div
                  key={comp.id}
                  onClick={() => toggleComponent(comp.id)}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all flex items-start gap-3 ${
                    isEnabled
                      ? 'border-neutral-900 bg-neutral-50/50'
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

          {/* OTHER / CUSTOM COMPONENT WRITE-IN */}
          <div className="pt-3 border-t border-neutral-200">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Plus className="w-4 h-4 text-neutral-800" />
              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                Other / Custom Component
              </h4>
              <span className="text-[10px] font-mono text-neutral-400">
                technical: custom module specification
              </span>
            </div>
            <p className="text-xs text-neutral-500 mb-2">
              Need a custom component (e.g. interactive pricing slider, mortgage calculator, podcast player)?
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={customCompName}
                onChange={e => setCustomCompName(e.target.value)}
                placeholder="e.g. Interactive ROI Calculator, Reservation Date Picker..."
                className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-md focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
              <button
                type="button"
                onClick={handleAddCustomComponent}
                className="px-4 py-1.5 text-xs font-semibold bg-neutral-900 text-white rounded-md shrink-0"
              >
                Add Component
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
