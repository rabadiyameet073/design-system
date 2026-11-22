import React, { useState, useMemo } from 'react';
import { Sparkles, Check, ArrowRight, Plus, Star, Type, Layers, Box, Eye, CheckCircle2 } from 'lucide-react';
import { DesignProject, VisualDirection } from '../../types/designSystem';
import { VISUAL_DIRECTIONS } from '../../data/visualDirections';
import { TYPOGRAPHY_PAIRINGS } from '../../data/typographyPairs';
import { COLOR_PALETTES } from '../../data/palettes';
import { generateAllColorPrimitives } from '../../tokens/colorScale';
import { createLightSemanticColors, createDarkSemanticColors } from '../../tokens/semanticMapping';
import { RADIUS_PRESETS, RadiusPresetKey } from '../../tokens/shapeGenerator';

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
  const [hoveredDir, setHoveredDir] = useState<string | null>(null);

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

  const getBundleForDirection = (dir: typeof VISUAL_DIRECTIONS[0]) => {
    const matchingPairing = TYPOGRAPHY_PAIRINGS.find(p => p.id === dir.recommendedPairingId) || TYPOGRAPHY_PAIRINGS[0];
    const matchingPalette = COLOR_PALETTES.find(p => p.id === dir.recommendedPaletteId) || COLOR_PALETTES[0];

    const headingFont = matchingPairing.headingFont;
    const bodyFont = matchingPairing.bodyFont;
    const displayFont = matchingPairing.displayFont || headingFont;
    const monoFont = matchingPairing.monoFont || 'JetBrains Mono';

    const typographyRoles = {
      display: {
        family: displayFont,
        fallback: ['Georgia', 'serif'],
        weight: parseInt(matchingPairing.headingWeight, 10) || 600,
        lineHeight: 1.15,
        letterSpacing: '-0.02em'
      },
      heading: {
        family: headingFont,
        fallback: ['system-ui', 'sans-serif'],
        weight: parseInt(matchingPairing.headingWeight, 10) || 600,
        lineHeight: 1.25,
        letterSpacing: '-0.015em'
      },
      body: {
        family: bodyFont,
        fallback: ['system-ui', 'sans-serif'],
        weight: parseInt(matchingPairing.bodyWeight, 10) || 400,
        lineHeight: 1.6,
        letterSpacing: '-0.01em'
      },
      ui: {
        family: bodyFont,
        fallback: ['system-ui', 'sans-serif'],
        weight: 600,
        lineHeight: 1.2,
        letterSpacing: '0.01em'
      },
      mono: {
        family: monoFont,
        fallback: ['monospace'],
        weight: 400,
        lineHeight: 1.5,
        letterSpacing: '0'
      },
      accent: null
    };

    const radiusKey: RadiusPresetKey =
      dir.id === 'clean-tech'
        ? 'sharp'
        : dir.id === 'minimal-editorial' || dir.id === 'premium-luxury' || dir.id === 'clean-corporate'
        ? 'subtle'
        : 'rounded';
    const radii = RADIUS_PRESETS[radiusKey];

    const primitives = generateAllColorPrimitives(matchingPalette.primary, matchingPalette.accent);
    const semanticLight = createLightSemanticColors(primitives);
    const semanticDark = createDarkSemanticColors(primitives);

    return {
      visualDirection: dir,
      colorPalette: matchingPalette,
      typography: {
        ...project.typography,
        pairingId: matchingPairing.id,
        name: matchingPairing.name,
        displayFont: matchingPairing.displayFont,
        headingFont: matchingPairing.headingFont,
        bodyFont: matchingPairing.bodyFont,
        monoFont: matchingPairing.monoFont,
        scaleRatio: matchingPairing.scaleRatio,
        headingWeight: matchingPairing.headingWeight,
        bodyWeight: matchingPairing.bodyWeight
      },
      tokens: {
        ...project.tokens,
        color: {
          primitives,
          semantic: {
            light: semanticLight,
            dark: semanticDark
          }
        },
        typography: {
          ...project.tokens.typography,
          roles: typographyRoles,
          scaleRatio: matchingPairing.scaleRatio
        },
        radius: radii,
        component: {
          ...project.tokens.component,
          buttonRadius: `${radii.md}px`,
          cardRadius: `${radii.lg}px`,
          inputRadius: `${radii.sm}px`
        }
      }
    };
  };

  const handleSelectDirection = (dir: typeof VISUAL_DIRECTIONS[0]) => {
    setIsCustomMode(false);
    if (onClearDraft) onClearDraft();
    const bundle = getBundleForDirection(dir);
    onChange(bundle);
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
          Visual directions calibrate brand atmosphere and paired typography attitudes. All color scales, background canvases, and text tones are calibrated in the next step (Step 5 · Color Studio).
        </p>
      </div>

      {/* Visible Compare / Apply Bar (Doc 02 §7) */}
      <div className="p-3.5 rounded-xl bg-neutral-900 text-white flex items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-2.5 min-w-0">
          <Eye className="w-4 h-4 text-amber-400 shrink-0" />
          <div className="text-xs truncate">
            <span className="text-neutral-400">Current active mood: </span>
            <strong className="text-white font-semibold">{project.visualDirection.name}</strong>
          </div>
        </div>
        <span className="text-[11px] font-mono text-neutral-400 hidden sm:inline">
          Hover to test in live preview · Click to commit
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {VISUAL_DIRECTIONS.map(dir => {
          const isSelected = !isCustomMode && project.visualDirection.id === dir.id;
          const matchingPairing = TYPOGRAPHY_PAIRINGS.find(p => p.id === dir.recommendedPairingId) || TYPOGRAPHY_PAIRINGS[0];
          const matchingPalette = COLOR_PALETTES.find(p => p.id === dir.recommendedPaletteId) || COLOR_PALETTES[0];
          const isRecommended = recommendedIds.includes(dir.id);

          const radiusLabel = dir.id === 'clean-tech' ? 'Sharp 2px' : dir.id === 'bold-commercial' ? 'Pill 9999px' : 'Rounded 10px';

          return (
            <div
              key={dir.id}
              role="button"
              tabIndex={0}
              aria-pressed={isSelected}
              onClick={() => handleSelectDirection(dir)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSelectDirection(dir);
                }
              }}
              onMouseEnter={() => {
                setHoveredDir(dir.id);
                if (onPreviewDraft) {
                  const bundle = getBundleForDirection(dir);
                  onPreviewDraft(bundle, dir.name);
                }
              }}
              onMouseLeave={() => {
                setHoveredDir(null);
                if (onClearDraft) onClearDraft();
              }}
              className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:outline-none ${
                isSelected
                  ? 'border-neutral-900 bg-white ring-2 ring-neutral-900 shadow-md'
                  : 'border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
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
                <p className="text-xs text-neutral-600 leading-relaxed mb-3">
                  {dir.description}
                </p>

                {/* Direction Impact Summary Chips */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 text-neutral-700">
                    Radius: {radiusLabel}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 text-neutral-700">
                    Palette: {matchingPalette.name}
                  </span>
                </div>
              </div>

              {/* Typography pairing attitude bar */}
              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-neutral-600 font-medium">
                  <Type className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{matchingPairing.name}</span>
                </div>
                <span className="text-xs font-bold text-neutral-900 flex items-center gap-1">
                  {isSelected ? 'Active Selection' : 'Apply Direction'} <ArrowRight className="w-3 h-3" />
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
            <h3 className="text-sm font-bold text-neutral-900">Custom Visual Language</h3>
          </div>
          <span className="text-[11px] font-mono text-neutral-400">Bespoke Configuration</span>
        </div>
        <p className="text-xs text-neutral-500 mb-4">
          Want a completely unique aesthetic mood not covered by standard archetypes? Enter a custom title and aesthetic keyword.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <input
            type="text"
            placeholder="Custom Aesthetic Name (e.g. Neo-Solar Punk)"
            value={customName}
            onChange={e => setCustomName(e.target.value)}
            className="px-3.5 py-2 text-xs border border-neutral-200 rounded-xl bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
          />
          <input
            type="text"
            placeholder="Mood Tagline (e.g. Luminescent botanical tech)"
            value={customTagline}
            onChange={e => setCustomTagline(e.target.value)}
            className="px-3.5 py-2 text-xs border border-neutral-200 rounded-xl bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
          />
        </div>

        <button
          type="button"
          onClick={handleApplyCustomDirection}
          disabled={!customName.trim()}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            customName.trim()
              ? 'bg-neutral-900 text-white shadow-xs hover:bg-neutral-800'
              : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
          }`}
        >
          Apply Custom Visual Mood
        </button>
      </div>
    </div>
  );
};
