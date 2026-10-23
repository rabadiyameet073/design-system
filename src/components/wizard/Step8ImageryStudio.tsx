import React, { useState } from 'react';
import { Sparkles, Image, Upload, Check, Camera, Layers, Plus } from 'lucide-react';
import { DesignProject, ImageryConfig } from '../../types/designSystem';

interface Step8ImageryStudioProps {
  project: DesignProject;
  onChange: (updated: Partial<DesignProject>) => void;
}

export const Step8ImageryStudio: React.FC<Step8ImageryStudioProps> = ({ project, onChange }) => {
  const [customStyleText, setCustomStyleText] = useState('');
  const [isCustomStyle, setIsCustomStyle] = useState(false);

  const styles: { id: ImageryConfig['style']; title: string; tech: string; desc: string }[] = [
    {
      id: 'photography',
      title: 'Warm Natural Photography',
      tech: 'documentary daylight style',
      desc: 'Real daylight, tactile textures, and documentary warmth. Great for artisan and lifestyle.'
    },
    {
      id: 'product',
      title: 'Studio Product Photography',
      tech: 'diffused commercial studio lighting',
      desc: 'Clean stone and studio surfaces, crisp rim lighting, and commercial product focus.'
    },
    {
      id: 'editorial',
      title: 'Architectural & Editorial',
      tech: 'high-contrast window shadow',
      desc: 'Spacious framing, geometric window shadows, and sophisticated high-end aesthetic.'
    },
    {
      id: 'minimal',
      title: 'Minimal Geometric Graphics',
      tech: 'abstract vector composition',
      desc: 'Quiet shapes, subtle tinted containers, and calm spatial layout.'
    },
    {
      id: 'text-first',
      title: 'Typography & Text-First',
      tech: 'zero heavy photo assets',
      desc: 'No heavy images; your message leads with confident typographic scale.'
    }
  ];

  const updateImagery = (key: keyof ImageryConfig, val: any) => {
    onChange({
      imagery: {
        ...project.imagery,
        [key]: val
      }
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      updateImagery('customHeroUrl', url);
    }
  };

  const handleApplyCustomStyle = () => {
    if (customStyleText.trim()) {
      setIsCustomStyle(true);
      updateImagery('treatment', 'clean');
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      {/* Header */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 text-xs font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5 text-neutral-900" />
          <span>Step 8 of 14 · Website Imagery & Photos</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-1">
          How Should Photos & Images Look?
        </h1>
        <span className="text-[11px] font-mono text-neutral-400 block mb-2">
          technical: visual asset treatment & geometric framing
        </span>
        <p className="text-sm text-neutral-600 max-w-lg mx-auto leading-relaxed">
          Decide the visual style, photo shape, and corner roundness across your website so your product photos and banners stay consistent.
        </p>
      </div>

      <div className="space-y-6">
        {/* Style Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {styles.map(s => {
            const isSelected = !isCustomStyle && project.imagery.style === s.id;
            return (
              <div
                key={s.id}
                onClick={() => {
                  setIsCustomStyle(false);
                  updateImagery('style', s.id);
                }}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-neutral-900 bg-white ring-2 ring-neutral-900 shadow-md'
                    : 'border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <h3 className="font-semibold text-xs text-neutral-900">{s.title}</h3>
                    <span className="text-[9px] font-mono text-neutral-400">{s.tech}</span>
                  </div>
                  {isSelected && (
                    <span className="w-4 h-4 rounded-full bg-neutral-900 text-white flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-500 leading-relaxed mt-1">{s.desc}</p>
              </div>
            );
          })}
        </div>

        {/* OTHER / CUSTOM IMAGE STYLE */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            isCustomStyle
              ? 'border-neutral-900 bg-neutral-50 ring-2 ring-neutral-900'
              : 'border-neutral-200 bg-white hover:border-neutral-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-neutral-800" />
              <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                Other / Custom Visual Style
              </h3>
              <span className="text-[10px] font-mono text-neutral-400">
                technical: custom asset aesthetic
              </span>
            </div>
            {isCustomStyle && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-900 text-white">
                Active Style
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-500 mb-2">
            Want a specific artistic style (e.g. 3D clay render, retro film grain, or hand-drawn sketches)?
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={customStyleText}
              onChange={e => setCustomStyleText(e.target.value)}
              placeholder="e.g. 3D Isometric clay icons, warm 35mm film grain portraits..."
              className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-md focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
            <button
              type="button"
              onClick={handleApplyCustomStyle}
              className="px-3 py-1.5 text-xs font-semibold bg-neutral-900 text-white rounded-md shrink-0"
            >
              Apply
            </button>
          </div>
        </div>

        {/* Framing & Roundness Controls */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
              Photo Shape & Proportions
            </h3>
            <span className="text-[10px] font-mono text-neutral-400 block mb-3">
              technical: aspect-ratio & border-radius tokens
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-0.5">
                Image Proportions
              </label>
              <span className="text-[10px] font-mono text-neutral-400 block mb-2">
                technical: aspect-ratio (16:9, 4:3, 1:1)
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: '16:9', label: '16:9 Wide' },
                  { id: '4:3', label: '4:3 Balanced' },
                  { id: '1:1', label: '1:1 Square' }
                ].map(ratio => (
                  <button
                    key={ratio.id}
                    type="button"
                    onClick={() => updateImagery('aspectRatio', ratio.id)}
                    className={`py-2 px-2 text-xs font-medium rounded-lg border text-center transition-colors ${
                      project.imagery.aspectRatio === ratio.id
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    {ratio.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-0.5">
                Image Corner Curvature
              </label>
              <span className="text-[10px] font-mono text-neutral-400 block mb-2">
                technical: border-radius
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'none', label: 'Sharp' },
                  { id: 'medium', label: 'Curved' },
                  { id: 'full', label: 'Round' }
                ].map(r => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => updateImagery('cornerRadius', r.id)}
                    className={`py-2 px-2 text-xs font-medium rounded-lg border text-center transition-colors ${
                      project.imagery.cornerRadius === r.id
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Optional Upload */}
          <div className="pt-4 border-t border-neutral-200">
            <label className="block text-xs font-bold text-neutral-800 mb-0.5">
              Upload Your Own Image or Logo (Optional)
            </label>
            <span className="text-[10px] font-mono text-neutral-400 block mb-2">
              technical: user asset replacement
            </span>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-xs font-medium text-neutral-700 cursor-pointer transition-colors">
                <Upload className="w-4 h-4" />
                <span>Choose photo file</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {project.imagery.customHeroUrl && (
                <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  Custom image active in live preview
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
