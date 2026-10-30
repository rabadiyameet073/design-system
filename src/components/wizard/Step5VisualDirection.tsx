import React, { useState, useMemo } from 'react';
import { Sparkles, Check, ArrowRight, Plus, Star } from 'lucide-react';
import { DesignProject, VisualDirection } from '../../types/designSystem';
import { VISUAL_DIRECTIONS } from '../../data/visualDirections';
import { COLOR_PALETTES } from '../../data/palettes';
import { TYPOGRAPHY_PAIRINGS } from '../../data/typographyPairs';
import { generateAllColorPrimitives } from '../../tokens/colorScale';
import { createLightSemanticColors, createDarkSemanticColors } from '../../tokens/semanticMapping';

interface Step5VisualDirectionProps {
  project: DesignProject;
  onChange: (updated: Partial<DesignProject>) => void;
  onPreviewDraft?: (draft: Partial<DesignProject>, label: string) => void;
  onClearDraft?: () => void;
}

export const Step5VisualDirection: React.FC<Step5VisualDirectionProps> = ({
  project,
  onChange,
  onPreviewDraft,
  onClearDraft
}) => {
  const [customName, setCustomName] = useState('');
  const [customTagline, setCustomTagline] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);

  // Derive recommended directions deterministically from personality dials (Doc 02 §7)
  const personality = project.tokens?.meta?.personality || {
    energy: 50,
    craft: 50,
    voice: 50,
    formality: 50,
    density: 50
  };

  const recommendedIds = useMemo(() => {
    const list: string[] = [];
    if (personality.craft >= 50 && personality.energy < 55) {
      list.push('minimal-editorial', 'nature-inspired');
    }
    if (personality.energy >= 55) {
      list.push('bold-commercial', 'modern-product');
    }
    if (personality.formality >= 50) {
      list.push('clean-corporate', 'premium-luxury');
    }
    if (personality.voice >= 50 && personality.craft >= 50) {
      list.push('warm-approachable');
    }
    if (personality.craft < 50 && personality.energy >= 50) {
      list.push('clean-tech');
    }
    return Array.from(new Set(list)).slice(0, 3);
  }, [personality]);

  const handleSelectDirection = (dir: typeof VISUAL_DIRECTIONS[0]) => {
    setIsCustomMode(false);
    const recommendedPalette = COLOR_PALETTES.find(p => p.id === dir.recommendedPaletteId) || project.colorPalette;
    const recommendedPairing = TYPOGRAPHY_PAIRINGS.find(p => p.id === dir.recommendedPairingId) || TYPOGRAPHY_PAIRINGS[0];

    const primitives = generateAllColorPrimitives(recommendedPalette.primary, recommendedPalette.accent);
    const light = createLightSemanticColors(primitives);
    const dark = createDarkSemanticColors(primitives);

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
      },
      tokens: {
        ...project.tokens,
        color: {
          primitives,
          semantic: { light, dark }
        }
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
    <div className="max-w-4xl mx-auto py-4 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 text-white text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Step 4 of 11 · Visual Direction & Aesthetic Mood</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          Select an aesthetic mood archetype
        </h1>
        <p className="text-sm text-neutral-600 leading-relaxed max-w-2xl">
          Visual directions bundle baseline palettes, typography pairing hints, and layout attitudes. Hover any card to preview its atmosphere in the live template pane.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {VISUAL_DIRECTIONS.map(dir => {
          const isSelected = !isCustomMode && project.visualDirection.id === dir.id;
          const matchingPalette = COLOR_PALETTES.find(p => p.id === dir.recommendedPaletteId) || COLOR_PALETTES[0];
          const isRecommended = recommendedIds.includes(dir.id);

          return (
            <div
              key={dir.id}
              onClick={() => handleSelectDirection(dir)}
              onMouseEnter={() => {
                if (onPreviewDraft) {
                  const prims = generateAllColorPrimitives(matchingPalette.primary, matchingPalette.accent);
                  onPreviewDraft({
                    visualDirection: dir,
                    colorPalette: matchingPalette,
                    tokens: {
                      ...project.tokens,
                      color: {
                        primitives: prims,
                        semantic: {
                          light: createLightSemanticColors(prims),
                          dark: createDarkSemanticColors(prims)
                        }
                      }
                    }
                  }, dir.name);
                }
              }}
              onMouseLeave={() => onClearDraft && onClearDraft()}
              className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-neutral-900 bg-white ring-2 ring-neutral-900 shadow-md'
                  : 'border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    {isRecommended && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                        <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-600" />
                        <span>Recommended</span>
                      </span>
                    )}
                    <span className="text-[10px] font-mono text-neutral-400">
                      preset: {dir.id}
                    </span>
                  </div>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[2.5]" />
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-neutral-900 mb-1">
                  {dir.name}
                </h3>
                <span className="text-xs font-semibold text-neutral-500 block mb-2">
                  {dir.tagline}
                </span>
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
                <span className="text-xs font-bold text-neutral-600 flex items-center gap-1">
                  Apply <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* OTHER / CUSTOM VISUAL DIRECTION CARD */}
      <div
        className={`p-6 rounded-2xl border transition-all ${
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
            <span className="text-xs font-bold text-neutral-900 bg-neutral-200 px-2.5 py-0.5 rounded-full">
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
            className="px-3.5 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
          />
          <input
            type="text"
            value={customTagline}
            onChange={e => setCustomTagline(e.target.value)}
            placeholder="Short description (e.g. Tactile raw concrete, warm cedar, dark brass)"
            className="px-3.5 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
          />
        </div>

        <button
          type="button"
          onClick={handleApplyCustomDirection}
          className="px-4 py-2 text-xs font-bold bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          Use Custom Style
        </button>
      </div>
    </div>
  );
};
