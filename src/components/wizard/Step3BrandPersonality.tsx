import React from 'react';
import { Sparkles, Compass, Sliders, ArrowRight } from 'lucide-react';
import { DesignProject } from '../../types/designSystem';

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

  // Deterministic preset bundle suggestions based on personality math
  const presets = [
    {
      id: 'artisanal-warm',
      title: 'Warm Artisanal & Editorial',
      desc: 'Heritage serifs, subtle corner radii, terracotta earth tones, airy spatial rhythm.',
      tags: ['luxury', 'editorial', 'warm'],
      radius: 'subtle',
      density: 'airy'
    },
    {
      id: 'high-tech-kinetic',
      title: 'High-Velocity Tech & SaaS',
      desc: 'Geometric sans-serif, sharp corners, vibrant electric indigo, compact UI spacing.',
      tags: ['tech', 'geometric', 'modern'],
      radius: 'rounded',
      density: 'compact'
    },
    {
      id: 'minimal-monograph',
      title: 'Brutalist Swiss Monograph',
      desc: 'Architectural grotesque typography, obsidian stone tones, disciplined 8px grid.',
      tags: ['minimal', 'architectural', 'neutral'],
      radius: 'sharp',
      density: 'balanced'
    }
  ];

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

      {/* 5 Personality Sliders */}
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
            min="0"
            max="100"
            value={personality.energy}
            onChange={e => handleSliderChange('energy', parseInt(e.target.value, 10))}
            className="w-full accent-neutral-900 cursor-pointer"
          />
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
            min="0"
            max="100"
            value={personality.craft}
            onChange={e => handleSliderChange('craft', parseInt(e.target.value, 10))}
            className="w-full accent-neutral-900 cursor-pointer"
          />
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
            min="0"
            max="100"
            value={personality.voice}
            onChange={e => handleSliderChange('voice', parseInt(e.target.value, 10))}
            className="w-full accent-neutral-900 cursor-pointer"
          />
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
            min="0"
            max="100"
            value={personality.formality}
            onChange={e => handleSliderChange('formality', parseInt(e.target.value, 10))}
            className="w-full accent-neutral-900 cursor-pointer"
          />
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
            min="0"
            max="100"
            value={personality.density}
            onChange={e => handleSliderChange('density', parseInt(e.target.value, 10))}
            className="w-full accent-neutral-900 cursor-pointer"
          />
        </div>
      </div>

      {/* Suggested Style Preset Chips */}
      <div className="space-y-3">
        <div className="text-xs uppercase font-bold tracking-wider text-neutral-500 font-mono">
          Recommended Aesthetic Archetypes for these Dials
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {presets.map(p => (
            <div
              key={p.id}
              className="p-4 rounded-xl border border-neutral-200 bg-white hover:border-neutral-400 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <h3 className="font-bold text-xs text-neutral-900">{p.title}</h3>
                <p className="text-[11px] text-neutral-500 mt-1 leading-relaxed">{p.desc}</p>
              </div>
              <div className="flex items-center gap-1.5 pt-1">
                {p.tags.map(t => (
                  <span key={t} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
