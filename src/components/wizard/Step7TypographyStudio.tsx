import React, { useState } from 'react';
import { Sparkles, Check, Sliders, Type, Plus } from 'lucide-react';
import { DesignProject } from '../../types/designSystem';
import { TYPOGRAPHY_PAIRINGS, AVAILABLE_FONTS, TypographyPairingOption } from '../../data/typographyPairs';

interface Step7TypographyStudioProps {
  project: DesignProject;
  onChange: (updated: Partial<DesignProject>) => void;
}

export const Step7TypographyStudio: React.FC<Step7TypographyStudioProps> = ({ project, onChange }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customPairName, setCustomPairName] = useState('My Custom Font Pairing');

  const handleSelectPairing = (pair: TypographyPairingOption) => {
    setIsCustomMode(false);
    onChange({
      typography: {
        ...project.typography,
        pairingId: pair.id,
        name: pair.name,
        displayFont: pair.displayFont,
        headingFont: pair.headingFont,
        bodyFont: pair.bodyFont,
        monoFont: pair.monoFont,
        scaleRatio: pair.scaleRatio,
        headingWeight: pair.headingWeight,
        bodyWeight: pair.bodyWeight
      }
    });
  };

  const updateTypography = (key: string, value: any) => {
    setIsCustomMode(true);
    onChange({
      typography: {
        ...project.typography,
        [key]: value
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Header */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 text-xs font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5 text-neutral-900" />
          <span>Step 7 of 14 · Typography Studio</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-1">
          How Headings & Text Look
        </h1>
        <span className="text-[11px] font-mono text-neutral-400 block mb-2">
          technical: 2+1 font pairings & modular type scale hierarchy
        </span>
        <p className="text-sm text-neutral-600 max-w-lg mx-auto leading-relaxed">
          We use at most two harmonious fonts: one distinctive font for your titles and brand wordmark, and one ultra-readable font for body paragraphs.
        </p>
      </div>

      {/* Advanced Toggle */}
      <div className="flex justify-end mb-4">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs font-medium text-neutral-700 hover:text-neutral-900 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 transition-colors shadow-2xs"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>{showAdvanced ? 'Hide Font Controls' : 'Fine-Tune Font Weights & Scales'}</span>
        </button>
      </div>

      {/* Curated Typography Pairings */}
      <div className="space-y-4 mb-6">
        {TYPOGRAPHY_PAIRINGS.map(pair => {
          const isSelected = !isCustomMode && project.typography.pairingId === pair.id;

          return (
            <div
              key={pair.id}
              onClick={() => handleSelectPairing(pair)}
              className={`p-6 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'border-neutral-900 bg-white ring-2 ring-neutral-900 shadow-md'
                  : 'border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-xs'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-neutral-900">{pair.name}</h3>
                    <span className="text-[11px] font-semibold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
                      {pair.vibe}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400 block mt-0.5">
                    technical: display: {pair.displayFont} / body: {pair.bodyFont} / ratio: {pair.scaleRatio}
                  </span>
                  <p className="text-xs text-neutral-500 mt-1">{pair.description}</p>
                </div>
                {isSelected && (
                  <span className="w-6 h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </span>
                )}
              </div>

              {/* Specimen Box */}
              <div
                className="p-4 rounded-lg border border-neutral-100 bg-neutral-50 space-y-2"
                style={{ fontFamily: pair.bodyFont }}
              >
                <div
                  className="text-2xl font-bold tracking-tight text-neutral-900"
                  style={{ fontFamily: pair.displayFont }}
                >
                  Crafting Timeless Digital Foundations
                </div>
                <div
                  className="text-sm font-semibold text-neutral-800"
                  style={{ fontFamily: pair.headingFont }}
                >
                  Section heading tuned for quick scannability
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed max-w-2xl">
                  Paragraph text engineered with comfortable line-height. Numbers like <span className="font-mono tabular-nums text-neutral-900">$1,450.00</span> and <span className="font-mono tabular-nums text-neutral-900">99.9%</span> stay vertically aligned.
                </p>
              </div>
            </div>
          );
        })}

        {/* OTHER / CUSTOM FONT PAIRING CARD */}
        <div
          onClick={() => {
            setIsCustomMode(true);
            setShowAdvanced(true);
          }}
          className={`p-6 rounded-xl border cursor-pointer transition-all ${
            isCustomMode
              ? 'border-neutral-900 bg-neutral-50 ring-2 ring-neutral-900 shadow-md'
              : 'border-neutral-200 bg-white hover:border-neutral-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-neutral-900" />
              <div>
                <h3 className="text-base font-bold text-neutral-900">
                  Other / Custom Font Pairing
                </h3>
                <span className="text-[10px] font-mono text-neutral-400">
                  technical: custom font-family stack definition
                </span>
              </div>
            </div>
            {isCustomMode && (
              <span className="text-xs font-bold text-neutral-900 bg-neutral-200 px-2.5 py-1 rounded">
                Custom Fonts Active
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Want to use a specific font for headlines and another for body copy? Click here to choose your exact fonts in the editor below.
          </p>
        </div>
      </div>

      {/* Advanced Font Controls */}
      {showAdvanced && (
        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs space-y-6">
          <div className="border-b border-neutral-200 pb-3">
            <h3 className="text-sm font-bold text-neutral-900">
              Font Family & Scale Controls
            </h3>
            <span className="text-[10px] font-mono text-neutral-400 block">
              technical: typography tokens & modular scale ratio
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-0.5">
                Headlines & Title Font
              </label>
              <span className="text-[10px] font-mono text-neutral-400 block mb-1">
                technical: font-display / h1-h3
              </span>
              <p className="text-[11px] text-neutral-500 mb-1.5">
                Used for hero titles and section banners.
              </p>
              <select
                value={project.typography.displayFont}
                onChange={e => {
                  updateTypography('displayFont', e.target.value);
                  updateTypography('headingFont', e.target.value);
                }}
                className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:bg-white"
              >
                {AVAILABLE_FONTS.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-0.5">
                Body & Reading Font
              </label>
              <span className="text-[10px] font-mono text-neutral-400 block mb-1">
                technical: font-body / prose
              </span>
              <p className="text-[11px] text-neutral-500 mb-1.5">
                Used for article paragraphs, product details, and buttons.
              </p>
              <select
                value={project.typography.bodyFont}
                onChange={e => updateTypography('bodyFont', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:bg-white"
              >
                {AVAILABLE_FONTS.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-0.5">
                Numbers & Code Font
              </label>
              <span className="text-[10px] font-mono text-neutral-400 block mb-1">
                technical: font-mono / tabular-nums
              </span>
              <p className="text-[11px] text-neutral-500 mb-1.5">
                Used for prices, metrics, and data tables.
              </p>
              <select
                value={project.typography.monoFont}
                onChange={e => updateTypography('monoFont', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:bg-white"
              >
                <option value="JetBrains Mono">JetBrains Mono (Tabular)</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
