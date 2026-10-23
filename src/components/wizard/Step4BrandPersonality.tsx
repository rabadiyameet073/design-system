import React, { useState } from 'react';
import { Sparkles, Sliders, Check, Plus } from 'lucide-react';
import { DesignProject } from '../../types/designSystem';

interface Step4BrandPersonalityProps {
  project: DesignProject;
  onChange: (updated: Partial<DesignProject>) => void;
}

export const Step4BrandPersonality: React.FC<Step4BrandPersonalityProps> = ({ project, onChange }) => {
  const [customPersonality, setCustomPersonality] = useState('');

  const personalities = [
    { name: 'Minimal and clean', tag: 'Restrained, spacious, and distraction-free.' },
    { name: 'Modern and professional', tag: 'Sharp, credible, and technology-focused.' },
    { name: 'Premium and luxurious', tag: 'Understated, prestigious, and deliberate.' },
    { name: 'Friendly and approachable', tag: 'Warm, human, and welcoming.' },
    { name: 'Bold and energetic', tag: 'Punchy, high-contrast, and action-driven.' },
    { name: 'Creative and expressive', tag: 'Artistic, tactile, and distinct.' },
    { name: 'Editorial and sophisticated', tag: 'Bookish, literary, and thoughtful.' },
    { name: 'Natural and organic', tag: 'Biophilic, botanical, and grounded.' }
  ];

  const handleSelectPrimary = (name: string) => {
    onChange({
      brandPersonality: {
        ...project.brandPersonality,
        primary: name
      }
    });
  };

  const handleAddCustomPersonality = () => {
    if (customPersonality.trim()) {
      handleSelectPrimary(customPersonality.trim());
      setCustomPersonality('');
    }
  };

  const updateTrait = (key: string, val: number) => {
    onChange({
      brandPersonality: {
        ...project.brandPersonality,
        [key]: val
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 text-xs font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5 text-neutral-900" />
          <span>Step 4 of 14 · Brand Personality</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-1">
          How Should Your Brand Feel to Visitors?
        </h1>
        <span className="text-[11px] font-mono text-neutral-400 block mb-2">
          technical: brand identity tokens & aesthetic weighting
        </span>
        <p className="text-sm text-neutral-600 max-w-lg mx-auto leading-relaxed">
          Your brand personality sets the emotional mood of your website. It directly informs whether your buttons are curved or sharp, and whether fonts are sleek sans or warm serifs.
        </p>
      </div>

      <div className="space-y-6">
        {/* Personality Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {personalities.map(p => {
            const isPrimary = project.brandPersonality.primary === p.name;
            const isSecondary = project.brandPersonality.secondary?.includes(p.name);

            return (
              <div
                key={p.name}
                onClick={() => handleSelectPrimary(p.name)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isPrimary
                    ? 'border-neutral-900 bg-neutral-900 text-white shadow-md'
                    : isSecondary
                    ? 'border-neutral-400 bg-neutral-50 text-neutral-900'
                    : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-xs tracking-tight">{p.name}</h3>
                  {isPrimary && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/20 text-white">
                      Selected
                    </span>
                  )}
                </div>
                <p className={`text-[11px] leading-relaxed ${isPrimary ? 'text-neutral-300' : 'text-neutral-500'}`}>
                  {p.tag}
                </p>
              </div>
            );
          })}
        </div>

        {/* OTHER / CUSTOM BRAND PERSONALITY CARD */}
        <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-xs">
          <div className="flex items-center gap-2 mb-1.5">
            <Plus className="w-4 h-4 text-neutral-800" />
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
              Other / Custom Brand Personality
            </h3>
            <span className="text-[10px] font-mono text-neutral-400">
              technical: bespoke identity tag
            </span>
          </div>
          <p className="text-xs text-neutral-500 mb-2">
            Have a specific word that captures your brand? Type it below:
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={customPersonality}
              onChange={e => setCustomPersonality(e.target.value)}
              placeholder="e.g. Wabi-Sabi Organic, Cyberpunk Tactical, Playful Scandinavian..."
              className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:bg-white"
            />
            <button
              type="button"
              onClick={handleAddCustomPersonality}
              className="px-4 py-2 text-xs font-semibold bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 shrink-0"
            >
              Use Custom
            </button>
          </div>
        </div>

        {/* Temperament Sliders with clear explanations */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2 mb-1">
            <Sliders className="w-4 h-4 text-neutral-800" />
            <div>
              <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                Fine-Tune Visual Sliders
              </h3>
              <span className="text-[10px] font-mono text-neutral-400">
                technical: geometric density & saturation weight
              </span>
            </div>
          </div>

          {/* Slider 1: Minimal vs Expressive */}
          <div>
            <div className="flex justify-between text-xs text-neutral-700 mb-1 font-medium">
              <span>Minimal & Restrained (Subtle accents)</span>
              <span>Expressive & Dynamic (Vibrant highlights)</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={project.brandPersonality.minimalToExpresive}
              onChange={e => updateTrait('minimalToExpresive', Number(e.target.value))}
              className="w-full accent-neutral-900 cursor-pointer h-2 bg-neutral-200 rounded-lg"
            />
          </div>

          {/* Slider 2: Calm vs Energetic */}
          <div>
            <div className="flex justify-between text-xs text-neutral-700 mb-1 font-medium">
              <span>Calm & Serene (Soft tones)</span>
              <span>Energetic & Bold (High-contrast CTAs)</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={project.brandPersonality.calmToEnergetic}
              onChange={e => updateTrait('calmToEnergetic', Number(e.target.value))}
              className="w-full accent-neutral-900 cursor-pointer h-2 bg-neutral-200 rounded-lg"
            />
          </div>

          {/* Slider 3: Compact vs Spacious */}
          <div>
            <div className="flex justify-between text-xs text-neutral-700 mb-1 font-medium">
              <span>Compact & Dense (More info per screen)</span>
              <span>Spacious & Airy (Generous margins)</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={project.brandPersonality.compactToSpacious}
              onChange={e => updateTrait('compactToSpacious', Number(e.target.value))}
              className="w-full accent-neutral-900 cursor-pointer h-2 bg-neutral-200 rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
