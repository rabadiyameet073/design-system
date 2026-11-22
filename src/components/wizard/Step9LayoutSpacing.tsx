import React from 'react';
import { Sparkles, Check, Sliders, Layout, Square, Maximize, Box, Layers } from 'lucide-react';
import { DesignProject, LayoutConfig } from '../../types/designSystem';
import {
  RadiusPresetKey,
  ElevationPresetKey,
  DensityMultiplierKey,
  RADIUS_PRESETS,
  generateSpaceScale,
  generateElevationShadows
} from '../../tokens/shapeGenerator';

interface Step9LayoutSpacingProps {
  project: DesignProject;
  onChange: (updated: Partial<DesignProject>) => void;
  onPreviewDraft?: (draft: Partial<DesignProject>, label: string) => void;
  onClearDraft?: () => void;
}

export const Step9LayoutSpacing: React.FC<Step9LayoutSpacingProps> = ({
  project,
  onChange,
  onPreviewDraft,
  onClearDraft
}) => {
  const brandHex = project.tokens?.color?.primitives?.brand?.[600] || project.colorPalette?.primary || '#B7410E';
  const currentDensity = (project.layout?.density === 'spacious' ? 'airy' : project.layout?.density) || 'balanced';
  const currentRadius = (project.layout?.radius as RadiusPresetKey) || 'rounded';
  const currentBase = project.tokens?.space?.base || 4;

  const handleDensityChange = (densityKey: DensityMultiplierKey) => {
    const newScale = generateSpaceScale(currentBase, densityKey);
    const legacyDensity = densityKey === 'airy' ? 'spacious' : densityKey;

    onChange({
      layout: {
        ...project.layout,
        density: legacyDensity
      },
      tokens: {
        ...project.tokens,
        space: {
          ...project.tokens.space,
          scale: newScale
        }
      }
    });
  };

  const handleRadiusChange = (radiusKey: RadiusPresetKey) => {
    const radii = RADIUS_PRESETS[radiusKey];

    onChange({
      layout: {
        ...project.layout,
        radius: radiusKey
      },
      tokens: {
        ...project.tokens,
        radius: radii,
        component: {
          ...project.tokens.component,
          buttonRadius: `${radii.md}px`,
          cardRadius: `${radii.lg}px`,
          inputRadius: `${radii.sm}px`
        }
      }
    });
  };

  const handleElevationChange = (elevationKey: ElevationPresetKey) => {
    const shadows = generateElevationShadows(brandHex, elevationKey);
    const legacyElevation = elevationKey === 'flat' ? 'flat' : elevationKey === 'crisp' ? 'subtle-border' : 'elevated-shadow';

    onChange({
      layout: {
        ...project.layout,
        cardElevation: legacyElevation
      },
      tokens: {
        ...project.tokens,
        shadow: shadows
      }
    });
  };

  const handleBaseGridChange = (base: 4 | 8) => {
    const newScale = generateSpaceScale(base, currentDensity as DensityMultiplierKey);
    onChange({
      tokens: {
        ...project.tokens,
        space: {
          base,
          scale: newScale
        }
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-8">
      {/* Step Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 text-white text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Step 7 of 11 · Shape, Spacing & Elevation</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          Calibrate layout geometry, spacing & depth
        </h1>
        <p className="text-sm text-neutral-600 leading-relaxed max-w-2xl">
          Configure vertical rhythm density, corner curvature curves, and brand-tinted elevation shadows. All changes instantly update component padding and shadow tokens.
        </p>
      </div>

      {/* Spacing Density Multiplier */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-neutral-900">
              Spacing Density & Vertical Rhythm
            </h3>
            <p className="text-xs text-neutral-500">
              Multiplies padding and margins across the entire token scale.
            </p>
          </div>
          {/* Base Grid 4px vs 8px */}
          <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg text-xs font-bold">
            <button
              type="button"
              onClick={() => handleBaseGridChange(4)}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                currentBase === 4 ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              4px Base
            </button>
            <button
              type="button"
              onClick={() => handleBaseGridChange(8)}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                currentBase === 8 ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              8px Base
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              id: 'airy',
              label: 'Airy & Generous (1.25×)',
              tech: 'scale: 5rem - 7rem sections',
              desc: 'Expansive breathing room. Best for luxury goods, architecture, and editorial showcases.'
            },
            {
              id: 'balanced',
              label: 'Balanced (1.0× Standard)',
              tech: 'scale: 3.5rem - 4.5rem sections',
              desc: 'Optimal visual equilibrium for consumer commerce, agencies, and portfolios.'
            },
            {
              id: 'compact',
              label: 'Compact & Dense (0.8×)',
              tech: 'scale: 2rem - 3rem sections',
              desc: 'Maximizes information density above the fold. High utility for SaaS dashboards.'
            }
          ].map(d => {
            const isSelected = currentDensity === d.id;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => handleDensityChange(d.id as DensityMultiplierKey)}
                onMouseEnter={() => {
                  if (onPreviewDraft) {
                    const newScale = generateSpaceScale(currentBase, d.id as DensityMultiplierKey);
                    onPreviewDraft({
                      tokens: {
                        ...project.tokens,
                        space: {
                          ...project.tokens.space,
                          scale: newScale
                        }
                      }
                    }, d.label);
                  }
                }}
                onMouseLeave={() => onClearDraft && onClearDraft()}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                    : 'border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-800'
                }`}
              >
                <div className="text-xs font-bold">{d.label}</div>
                <div className="font-mono text-[10px] opacity-60 mb-1">{d.tech}</div>
                <p className={`text-[11px] leading-relaxed ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                  {d.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Corner Radius Presets */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-neutral-900">
            Corner Radius Curvature
          </h3>
          <p className="text-xs text-neutral-500">
            Calibrates button, card, and modal roundness from crisp razor-sharp to playful organic curves.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { id: 'sharp', label: 'Sharp (0–6px)', tech: 'radius-none/sm', desc: 'Editorial, architectural, brutalist.', sample: 'rounded-none' },
            { id: 'subtle', label: 'Subtle (2–12px)', tech: 'radius-sm/md', desc: 'Precision engineering & credibility.', sample: 'rounded-md' },
            { id: 'rounded', label: 'Friendly (6–24px)', tech: 'radius-md/lg', desc: 'Warm approachable consumer standard.', sample: 'rounded-xl' },
            { id: 'playful', label: 'Playful (12–40px)', tech: 'radius-xl/full', desc: 'Soft, playful, modern aesthetic.', sample: 'rounded-2xl' }
          ].map(r => {
            const isSelected = currentRadius === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => handleRadiusChange(r.id as RadiusPresetKey)}
                onMouseEnter={() => {
                  if (onPreviewDraft) {
                    const radii = RADIUS_PRESETS[r.id as RadiusPresetKey];
                    onPreviewDraft({
                      tokens: {
                        ...project.tokens,
                        radius: radii,
                        component: {
                          ...project.tokens.component,
                          buttonRadius: `${radii.md}px`,
                          cardRadius: `${radii.lg}px`,
                          inputRadius: `${radii.sm}px`
                        }
                      }
                    }, r.label);
                  }
                }}
                onMouseLeave={() => onClearDraft && onClearDraft()}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                    : 'border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold">{r.label}</span>
                    <div className={`w-5 h-5 border-2 ${isSelected ? 'border-white' : 'border-neutral-400'} ${r.sample}`} />
                  </div>
                  <div className="font-mono text-[10px] opacity-60 mb-1">{r.tech}</div>
                  <p className={`text-[11px] leading-relaxed ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                    {r.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Shadow Elevation & Brand-Tinted Depth */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-neutral-900">
              Elevation & Brand-Tinted Shadows
            </h3>
            <p className="text-xs text-neutral-500">
              Layered ambient drop-shadows infused with low-alpha brand hue for natural physical realism.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-100 font-mono text-[10px] text-neutral-600">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: brandHex }} />
            Tinted with {brandHex}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {[
            { id: 'flat', label: 'Flat (Hairline)', tech: 'box-shadow: none', desc: 'Zero drop-shadow; clean 1px borders.' },
            { id: 'soft', label: 'Soft & Ambient', tech: 'diffused brand blur', desc: 'Gentle layered lift with subtle brand glow.' },
            { id: 'crisp', label: 'Crisp & Graphic', tech: 'hard offset edge', desc: 'High-contrast graphic shadow offset.' },
            { id: 'dramatic', label: 'Dramatic Depth', tech: 'deep spatial lift', desc: 'High elevation for floating focal cards.' }
          ].map(e => {
            const isSelected = project.tokens?.shadow?.sm === generateElevationShadows(brandHex, e.id as ElevationPresetKey).sm;
            return (
              <button
                key={e.id}
                type="button"
                onClick={() => handleElevationChange(e.id as ElevationPresetKey)}
                onMouseEnter={() => {
                  if (onPreviewDraft) {
                    const shadows = generateElevationShadows(brandHex, e.id as ElevationPresetKey);
                    onPreviewDraft({
                      tokens: {
                        ...project.tokens,
                        shadow: shadows
                      }
                    }, e.label);
                  }
                }}
                onMouseLeave={() => onClearDraft && onClearDraft()}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                    : 'border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-800'
                }`}
              >
                <div className="text-xs font-bold mb-1">{e.label}</div>
                <div className="font-mono text-[10px] opacity-60 mb-2">{e.tech}</div>
                <p className={`text-[11px] leading-relaxed ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                  {e.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Page Container Width */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-neutral-900">
          Maximum Container Frame Width
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { id: 'standard', width: 1200, label: 'Standard Frame (1200px)', desc: 'Comfortable reading line length on all laptop displays.' },
            { id: 'wide', width: 1440, label: 'Expansive Frame (1440px)', desc: 'Full-bleed modern aesthetic for wide high-resolution screens.' }
          ].map(w => {
            const isSelected = project.layout?.containerWidth === w.id;
            return (
              <button
                key={w.id}
                type="button"
                onClick={() => {
                  onChange({
                    layout: { ...project.layout, containerWidth: w.id as any },
                    tokens: { ...project.tokens, layout: { ...project.tokens.layout, container: w.width } }
                  });
                }}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-neutral-900 bg-neutral-50 text-neutral-900 font-bold'
                    : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                <div className="text-xs">{w.label}</div>
                <div className="text-[11px] text-neutral-500 font-normal mt-0.5">{w.desc}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
