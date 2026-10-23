import React, { useState } from 'react';
import { Sparkles, Check, Sliders, Layout, Square, Maximize, Plus } from 'lucide-react';
import { DesignProject, LayoutConfig } from '../../types/designSystem';

interface Step9LayoutSpacingProps {
  project: DesignProject;
  onChange: (updated: Partial<DesignProject>) => void;
}

export const Step9LayoutSpacing: React.FC<Step9LayoutSpacingProps> = ({ project, onChange }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customRadiusValue, setCustomRadiusValue] = useState('');

  const updateLayout = (key: keyof LayoutConfig, val: any) => {
    onChange({
      layout: {
        ...project.layout,
        [key]: val
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      {/* Header */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 text-xs font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5 text-neutral-900" />
          <span>Step 9 of 14 · Layout, Spacing & Margins</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-1">
          How Much Breathing Room Do You Want?
        </h1>
        <span className="text-[11px] font-mono text-neutral-400 block mb-2">
          technical: vertical whitespace math & container geometry
        </span>
        <p className="text-sm text-neutral-600 max-w-lg mx-auto leading-relaxed">
          Whitespace is the invisible foundation of great design. Choose whether your site feels open and relaxed, or compact and data-packed.
        </p>
      </div>

      <div className="space-y-6">
        {/* Layout Density */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider">
              Breathing Room Between Sections
            </label>
            <span className="text-[10px] font-mono text-neutral-400 block mb-1">
              technical: vertical rhythm / section padding-y (4rem vs 2rem)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: 'spacious',
                title: 'Spacious & Airy',
                tech: 'padding: 5rem - 6rem',
                desc: 'Generous margins creating relaxed luxury. Best for artisan brands and architecture.'
              },
              {
                id: 'balanced',
                title: 'Balanced & Modern',
                tech: 'padding: 3.5rem - 4.5rem',
                desc: 'The gold standard for modern products, courses, and agencies.'
              },
              {
                id: 'compact',
                title: 'Compact & Functional',
                tech: 'padding: 2rem - 3rem',
                desc: 'Maximizes information visible on screen without scrolling. Great for SaaS.'
              }
            ].map(density => {
              const isSelected = project.layout.density === density.id;
              return (
                <button
                  key={density.id}
                  type="button"
                  onClick={() => updateLayout('density', density.id)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-neutral-900 bg-neutral-900 text-white shadow-md'
                      : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300'
                  }`}
                >
                  <h4 className="font-semibold text-xs mb-0.5">{density.title}</h4>
                  <span className="text-[9px] font-mono opacity-60 block mb-1.5">{density.tech}</span>
                  <p className={`text-[11px] leading-relaxed ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                    {density.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Card Curvature */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider">
              Card & Button Corner Roundness
            </label>
            <span className="text-[10px] font-mono text-neutral-400 block mb-1">
              technical: border-radius scale (0px to 16px)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'sharp', title: 'Sharp (0px)', tech: 'rounded-none', desc: 'Stark, architectural, editorial' },
              { id: 'subtle', title: 'Subtle (4-6px)', tech: 'rounded-md', desc: 'Crisp precision & credibility' },
              { id: 'rounded', title: 'Friendly (8-12px)', tech: 'rounded-xl', desc: 'Warm, approachable standard' },
              { id: 'playful', title: 'Curved (16px+)', tech: 'rounded-2xl', desc: 'Soft, playful, modern' }
            ].map(r => {
              const isSelected = project.layout.radius === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => updateLayout('radius', r.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-neutral-900 bg-neutral-900 text-white'
                      : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300'
                  }`}
                >
                  <h4 className="font-semibold text-xs">{r.title}</h4>
                  <span className="text-[9px] font-mono opacity-60 block mb-1">{r.tech}</span>
                  <p className={`text-[11px] ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                    {r.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Container Width & Elevation */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider mb-0.5">
              Page Frame Width
            </label>
            <span className="text-[10px] font-mono text-neutral-400 block mb-2">
              technical: container max-width
            </span>
            <div className="space-y-2">
              {[
                { id: 'standard', title: 'Standard (1200px)', desc: 'Comfortable reading width on all laptops.' },
                { id: 'wide', title: 'Expansive (1440px)', desc: 'Full-bleed modern feel for widescreen monitors.' }
              ].map(w => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => updateLayout('containerWidth', w.id)}
                  className={`w-full p-3 rounded-lg border text-left transition-all ${
                    project.layout.containerWidth === w.id
                      ? 'border-neutral-900 bg-neutral-50 text-neutral-900 font-semibold'
                      : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  <div className="text-xs">{w.title}</div>
                  <div className="text-[11px] text-neutral-500 font-normal">{w.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider mb-0.5">
              Card Shadow & Depth
            </label>
            <span className="text-[10px] font-mono text-neutral-400 block mb-2">
              technical: box-shadow vs hairline border
            </span>
            <div className="space-y-2">
              {[
                { id: 'subtle-border', title: 'Clean 1px Hairline Border', desc: 'Flat surface without heavy drop shadows.' },
                { id: 'elevated-shadow', title: 'Gentle Ambient Lift', desc: 'Subtle soft shadow giving cards a light lift.' }
              ].map(e => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => updateLayout('cardElevation', e.id)}
                  className={`w-full p-3 rounded-lg border text-left transition-all ${
                    project.layout.cardElevation === e.id
                      ? 'border-neutral-900 bg-neutral-50 text-neutral-900 font-semibold'
                      : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  <div className="text-xs">{e.title}</div>
                  <div className="text-[11px] text-neutral-500 font-normal">{e.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
