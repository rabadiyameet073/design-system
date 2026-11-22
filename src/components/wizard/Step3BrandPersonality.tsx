import React from 'react';
import { Sparkles, Compass, Sliders, ArrowRight, Check, Activity, Zap, Shield, Feather, Box } from 'lucide-react';
import { DesignProject } from '../../types/designSystem';
import { RADIUS_PRESETS, RadiusPresetKey, generateSpaceScale, DensityMultiplierKey } from '../../tokens/shapeGenerator';

interface Step3BrandPersonalityProps {
  project: DesignProject;
  onChange: (updated: Partial<DesignProject>) => void;
  onPreviewDraft?: (draft: Partial<DesignProject>, label: string) => void;
  onClearDraft?: () => void;
}

export const Step3BrandPersonality: React.FC<Step3BrandPersonalityProps> = ({
  project,
  onChange,
  onPreviewDraft,
  onClearDraft
}) => {
  const personality = project.tokens?.meta?.personality || {
    energy: 50,
    craft: 75,
    voice: 60,
    formality: 40,
    density: 50
  };

  const handleSliderChange = (key: keyof typeof personality, val: number) => {
    const next = { ...personality, [key]: val };
    onChange({
      brandPersonality: {
        ...project.brandPersonality,
        [key]: val
      },
      tokens: {
        ...project.tokens,
        meta: {
          ...project.tokens.meta,
          personality: next
        }
      }
    });
  };

  // Deterministic preset bundle suggestions with real-world brand analogies (Doc 02 §5)
  const presets = [
    {
      id: 'artisanal-warm',
      title: 'Warm Artisanal & Editorial',
      brandAnalogy: 'like Kinfolk, Aesop & The Row',
      desc: 'Heritage serifs, subtle corner radii, terracotta earth tones, airy spatial rhythm.',
      tags: ['luxury', 'editorial', 'warm'],
      radius: 'subtle',
      density: 'airy',
      personality: { energy: 35, craft: 85, voice: 70, formality: 45, density: 35 }
    },
    {
      id: 'high-tech-kinetic',
      title: 'High-Velocity Tech & SaaS',
      brandAnalogy: 'like Linear, Stripe & Vercel',
      desc: 'Geometric sans-serif, sharp corners, vibrant electric indigo, compact UI spacing.',
      tags: ['tech', 'geometric', 'modern'],
      radius: 'rounded',
      density: 'compact',
      personality: { energy: 80, craft: 40, voice: 55, formality: 35, density: 75 }
    },
    {
      id: 'minimal-monograph',
      title: 'Brutalist Swiss Monograph',
      brandAnalogy: 'like Vitra, Braun & Swiss Style',
      desc: 'Architectural grotesque typography, obsidian stone tones, disciplined 8px grid.',
      tags: ['minimal', 'architectural', 'neutral'],
      radius: 'sharp',
      density: 'balanced',
      personality: { energy: 40, craft: 70, voice: 35, formality: 80, density: 50 }
    },
    {
      id: 'neo-pop-culture',
      title: 'Vibrant Neo-Pop & Culture',
      brandAnalogy: 'like Spotify, Figma & Arc Browser',
      desc: 'Expressive fluid curves, playful bounce springs, high-saturation accents, human warmth.',
      tags: ['expressive', 'creative', 'culture'],
      radius: 'pill',
      density: 'balanced',
      personality: { energy: 85, craft: 65, voice: 80, formality: 25, density: 45 }
    }
  ];

  const handleApplyPreset = (preset: typeof presets[0]) => {
    if (onClearDraft) onClearDraft();
    const radii = RADIUS_PRESETS[preset.radius as RadiusPresetKey] || RADIUS_PRESETS.rounded;
    const densityKey: DensityMultiplierKey = preset.density as DensityMultiplierKey;
    const spaceScale = generateSpaceScale(project.tokens?.space?.base || 4, densityKey);

    onChange({
      brandPersonality: {
        ...project.brandPersonality,
        ...preset.personality
      },
      layout: {
        ...project.layout,
        density: preset.density === 'airy' ? 'spacious' : (preset.density as any),
        radius: preset.radius as any
      },
      tokens: {
        ...project.tokens,
        meta: {
          ...project.tokens.meta,
          personality: preset.personality
        },
        radius: radii,
        component: {
          ...project.tokens.component,
          buttonRadius: `${radii.md}px`,
          cardRadius: `${radii.lg}px`,
          inputRadius: `${radii.sm}px`
        },
        space: {
          ...project.tokens.space,
          scale: spaceScale
        }
      }
    });
  };

  // Derive "What Changes" live token calculations
  const springStiffness = Math.round(180 + personality.energy * 1.5);
  const springDamping = Math.round(28 - personality.energy * 0.08);
  const calculatedDensityMultiplier = (0.75 + (personality.density / 100) * 0.5).toFixed(2);
  const recommendedRadiusMode = personality.craft > 70 ? 'Subtle 6px' : personality.energy > 75 ? 'Pill 9999px' : 'Rounded 10px';

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-8">
      {/* Title */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 text-white text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Step 3 of 11 · Brand Personality & Temperament</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          Calibrate the emotional voice of your brand
        </h1>
        <p className="text-sm text-neutral-600 leading-relaxed max-w-2xl">
          Interfaces evoke feelings within 50ms. Use these five dials to tune energy, craftsmanship, and density. They automatically synthesize starter styles for your design tokens.
        </p>
      </div>

      {/* Live Impact Chips: What Changes When Dials Move */}
      <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-neutral-800">
          <Activity className="w-4 h-4 text-indigo-600" />
          <span>Live Token Synthesis Impact</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-neutral-200 text-[11px] font-mono text-neutral-700 shadow-2xs">
            <Zap className="w-3 h-3 text-amber-500" />
            Motion Spring: {springStiffness} stiffness / {springDamping} damping
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-neutral-200 text-[11px] font-mono text-neutral-700 shadow-2xs">
            <Box className="w-3 h-3 text-blue-500" />
            Spatial Density: {calculatedDensityMultiplier}x baseline rhythm
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-neutral-200 text-[11px] font-mono text-neutral-700 shadow-2xs">
            <Feather className="w-3 h-3 text-emerald-500" />
            Corner Curvature: {recommendedRadiusMode}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-neutral-200 text-[11px] font-mono text-neutral-700 shadow-2xs">
            <Shield className="w-3 h-3 text-purple-500" />
            Formality: {personality.formality > 50 ? 'Structured Corporate Grid' : 'Expressive Casual'}
          </span>
        </div>
      </div>

      {/* 5 Personality Sliders with Accessibility */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-6">
        {/* 1. Energy */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-neutral-500">Contemplative & Calm</span>
            <span className="font-mono text-neutral-900 font-bold">Energy: {personality.energy}%</span>
            <span className="text-neutral-500">Kinetic & High-Velocity</span>
          </div>
          <input
            type="range"
            role="slider"
            min="0"
            max="100"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={personality.energy}
            aria-valuetext={`Energy: ${personality.energy}% (Contemplative to Kinetic)`}
            value={personality.energy}
            onChange={e => handleSliderChange('energy', parseInt(e.target.value, 10))}
            className="w-full accent-neutral-900 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-neutral-400">
            <span>0% (Calm)</span>
            <span>50% (Balanced)</span>
            <span>100% (Kinetic)</span>
          </div>
        </div>

        {/* 2. Craft */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-neutral-500">Computational & Digital</span>
            <span className="font-mono text-neutral-900 font-bold">Craft: {personality.craft}%</span>
            <span className="text-neutral-500">Organic & Handcrafted</span>
          </div>
          <input
            type="range"
            role="slider"
            min="0"
            max="100"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={personality.craft}
            aria-valuetext={`Craft: ${personality.craft}% (Computational to Handcrafted)`}
            value={personality.craft}
            onChange={e => handleSliderChange('craft', parseInt(e.target.value, 10))}
            className="w-full accent-neutral-900 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-neutral-400">
            <span>0% (Digital)</span>
            <span>50% (Standard)</span>
            <span>100% (Handcrafted)</span>
          </div>
        </div>

        {/* 3. Voice */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-neutral-500">Direct & Prescriptive</span>
            <span className="font-mono text-neutral-900 font-bold">Voice: {personality.voice}%</span>
            <span className="text-neutral-500">Poetic & Editorial</span>
          </div>
          <input
            type="range"
            role="slider"
            min="0"
            max="100"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={personality.voice}
            aria-valuetext={`Voice: ${personality.voice}% (Direct to Poetic Editorial)`}
            value={personality.voice}
            onChange={e => handleSliderChange('voice', parseInt(e.target.value, 10))}
            className="w-full accent-neutral-900 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-neutral-400">
            <span>0% (Direct)</span>
            <span>50% (Conversational)</span>
            <span>100% (Poetic)</span>
          </div>
        </div>

        {/* 4. Formality */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-neutral-500">Casual & Approachable</span>
            <span className="font-mono text-neutral-900 font-bold">Formality: {personality.formality}%</span>
            <span className="text-neutral-500">Structured & Ceremonial</span>
          </div>
          <input
            type="range"
            role="slider"
            min="0"
            max="100"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={personality.formality}
            aria-valuetext={`Formality: ${personality.formality}% (Casual to Ceremonial)`}
            value={personality.formality}
            onChange={e => handleSliderChange('formality', parseInt(e.target.value, 10))}
            className="w-full accent-neutral-900 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-neutral-400">
            <span>0% (Casual)</span>
            <span>50% (Professional)</span>
            <span>100% (Ceremonial)</span>
          </div>
        </div>

        {/* 5. Density */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-neutral-500">Expansive & Airy</span>
            <span className="font-mono text-neutral-900 font-bold">Density: {personality.density}%</span>
            <span className="text-neutral-500">Dense & High-Throughput</span>
          </div>
          <input
            type="range"
            role="slider"
            min="0"
            max="100"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={personality.density}
            aria-valuetext={`Density: ${personality.density}% (Airy to High-Throughput)`}
            value={personality.density}
            onChange={e => handleSliderChange('density', parseInt(e.target.value, 10))}
            className="w-full accent-neutral-900 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-neutral-400">
            <span>0% (Spacious)</span>
            <span>50% (Balanced)</span>
            <span>100% (Dense)</span>
          </div>
        </div>
      </div>

      {/* Suggested Style Preset Chips with Real-Brand Analogies */}
      <div className="space-y-3">
        <div className="text-xs uppercase font-bold tracking-wider text-neutral-500 font-mono">
          Recommended Aesthetic Archetypes for these Dials
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {presets.map(p => {
            const isSelected =
              personality.energy === p.personality.energy &&
              personality.craft === p.personality.craft &&
              personality.voice === p.personality.voice;

            return (
              <div
                key={p.id}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                onClick={() => handleApplyPreset(p)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleApplyPreset(p);
                  }
                }}
                onMouseEnter={() => {
                  if (onPreviewDraft) {
                    const radii = RADIUS_PRESETS[p.radius as RadiusPresetKey] || RADIUS_PRESETS.rounded;
                    const densityKey: DensityMultiplierKey = p.density as DensityMultiplierKey;
                    const spaceScale = generateSpaceScale(project.tokens?.space?.base || 4, densityKey);

                    onPreviewDraft({
                      tokens: {
                        ...project.tokens,
                        meta: {
                          ...project.tokens.meta,
                          personality: p.personality
                        },
                        radius: radii,
                        component: {
                          ...project.tokens.component,
                          buttonRadius: `${radii.md}px`,
                          cardRadius: `${radii.lg}px`,
                          inputRadius: `${radii.sm}px`
                        },
                        space: {
                          ...project.tokens.space,
                          scale: spaceScale
                        }
                      }
                    }, p.title);
                  }
                }}
                onMouseLeave={() => onClearDraft && onClearDraft()}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:outline-none ${
                  isSelected
                    ? 'border-neutral-900 bg-white ring-2 ring-neutral-900 shadow-md'
                    : 'border-neutral-200 bg-white hover:border-neutral-400 hover:shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-xs text-neutral-900">{p.title}</h3>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-neutral-900 text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] font-semibold text-indigo-600 mb-1">
                    {p.brandAnalogy}
                  </div>
                  <p className="text-[11px] text-neutral-500 leading-relaxed">{p.desc}</p>
                </div>
                <div className="flex items-center gap-1.5 pt-1">
                  {p.tags.map(t => (
                    <span key={t} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
