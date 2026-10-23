import React, { useState } from 'react';
import { Sparkles, Check, ArrowRight, Plus } from 'lucide-react';
import { DesignProject, VisualDirection } from '../../types/designSystem';
import { VISUAL_DIRECTIONS } from '../../data/visualDirections';
import { COLOR_PALETTES } from '../../data/palettes';
import { TYPOGRAPHY_PAIRINGS } from '../../data/typographyPairs';

interface Step5VisualDirectionProps {
  project: DesignProject;
  onChange: (updated: Partial<DesignProject>) => void;
}

export const Step5VisualDirection: React.FC<Step5VisualDirectionProps> = ({ project, onChange }) => {
  const [customName, setCustomName] = useState('');
  const [customTagline, setCustomTagline] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);

  const handleSelectDirection = (dir: typeof VISUAL_DIRECTIONS[0]) => {
    setIsCustomMode(false);
    const recommendedPalette = COLOR_PALETTES.find(p => p.id === dir.recommendedPaletteId) || project.colorPalette;
    const recommendedPairing = TYPOGRAPHY_PAIRINGS.find(p => p.id === dir.recommendedPairingId) || TYPOGRAPHY_PAIRINGS[0];

    onChange({
      visualDirection: dir,
      colorPalette: recommendedPalette,
      typography: {
        ...project.typography,
        pairingId: recommendedPairing.id,
        name: recommendedPairing.name,
        displayFont: recommendedPairing.displayFont,
        headingFont: recommendedPairing.headingFont,
        bodyFont: recommendedPairing.bodyFont,
        monoFont: recommendedPairing.monoFont,
        scaleRatio: recommendedPairing.scaleRatio,
        headingWeight: recommendedPairing.headingWeight,
        bodyWeight: recommendedPairing.bodyWeight
      }
    });
  };

  const handleApplyCustomDirection = () => {
    if (customName.trim()) {
      const customDir: VisualDirection = {
        id: `custom_${Date.now()}`,
        name: customName.trim(),
        tagline: customTagline.trim() || 'Custom bespoke visual mood',
        description: `Bespoke visual language tailored specifically for ${project.name}.`,
        aesthetic: customTagline.trim() || 'Custom aesthetic styling',
        recommendedPaletteId: project.colorPalette.id,
        recommendedPairingId: project.typography.pairingId
      };

      setIsCustomMode(true);
      onChange({
        visualDirection: customDir
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 text-xs font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5 text-neutral-900" />
          <span>Step 5 of 14 · Visual Direction</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-1">
          Choose Your Visual Style
        </h1>
        <span className="text-[11px] font-mono text-neutral-400 block mb-2">
          technical: aesthetic archetype & stylistic baseline
        </span>
        <p className="text-sm text-neutral-600 max-w-lg mx-auto leading-relaxed">
          Visual direction establishes the baseline mood of your site — from editorial luxury with wide photo margins to clean product-led SaaS with crisp data lines.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {VISUAL_DIRECTIONS.map(dir => {
          const isSelected = !isCustomMode && project.visualDirection.id === dir.id;
          const matchingPalette = COLOR_PALETTES.find(p => p.id === dir.recommendedPaletteId) || COLOR_PALETTES[0];

          return (
            <div
              key={dir.id}
              onClick={() => handleSelectDirection(dir)}
              className={`p-5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-neutral-900 bg-white ring-2 ring-neutral-900 shadow-md'
                  : 'border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
                      {dir.tagline}
                    </span>
                    <span className="text-[9px] font-mono text-neutral-400">
                      preset: {dir.id}
                    </span>
                  </div>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[2.5]" />
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-neutral-900 mb-1.5">
                  {dir.name}
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                  {dir.description}
                </p>
              </div>

              {/* Mini visual mockup bar */}
              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-4 h-4 rounded-full border border-black/10"
                    style={{ backgroundColor: matchingPalette.primary }}
                    title={`Primary: ${matchingPalette.primary}`}
                  />
                  <span
                    className="w-4 h-4 rounded-full border border-black/10"
                    style={{ backgroundColor: matchingPalette.backgroundAlt }}
                    title={`Surface: ${matchingPalette.backgroundAlt}`}
                  />
                  <span className="text-[11px] text-neutral-500 font-medium ml-1">
                    {matchingPalette.name.split('&')[0]}
                  </span>
                </div>
                <span className="text-xs text-neutral-400 flex items-center gap-1">
                  Select <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* OTHER / CUSTOM VISUAL DIRECTION CARD */}
      <div
        className={`p-5 rounded-xl border transition-all ${
          isCustomMode
            ? 'border-neutral-900 bg-neutral-50 ring-2 ring-neutral-900 shadow-md'
            : 'border-neutral-200 bg-white hover:border-neutral-300'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-neutral-800" />
            <h3 className="text-sm font-bold text-neutral-900">
              Other / Custom Visual Direction
            </h3>
            <span className="text-[10px] font-mono text-neutral-400">
              technical: user-defined aesthetic guideline
            </span>
          </div>
          {isCustomMode && (
            <span className="text-xs font-bold text-neutral-900 bg-neutral-200 px-2 py-0.5 rounded">
              Active Direction
            </span>
          )}
        </div>

        <p className="text-xs text-neutral-500 mb-3">
          Want a bespoke visual theme? Name it and describe its mood below:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <input
            type="text"
            value={customName}
            onChange={e => setCustomName(e.target.value)}
            placeholder="Style name (e.g. Kyoto Brutalism, Neo-Deco...)"
            className="px-3 py-2 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
          />
          <input
            type="text"
            value={customTagline}
            onChange={e => setCustomTagline(e.target.value)}
            placeholder="Short description (e.g. Tactile raw concrete, warm cedar, dark brass)"
            className="px-3 py-2 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
          />
        </div>

        <button
          type="button"
          onClick={handleApplyCustomDirection}
          className="px-4 py-2 text-xs font-semibold bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
        >
          Use Custom Style
        </button>
      </div>
    </div>
  );
};
