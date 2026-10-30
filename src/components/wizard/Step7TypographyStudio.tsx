import React, { useState } from 'react';
import {
  Sparkles,
  Check,
  Sliders,
  Type,
  Plus,
  Lightbulb,
  CheckCircle2,
  Layers,
  Scale,
  Sparkle
} from 'lucide-react';
import { DesignProject } from '../../types/designSystem';
import {
  TYPOGRAPHY_PAIRINGS,
  AVAILABLE_FONTS,
  TypographyPairingOption
} from '../../data/typographyPairs';

interface Step7TypographyStudioProps {
  project: DesignProject;
  onChange: (updated: Partial<DesignProject>) => void;
}

export const Step7TypographyStudio: React.FC<Step7TypographyStudioProps> = ({
  project,
  onChange
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isCustomMode, setIsCustomMode] = useState(false);

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
    <div className="max-w-5xl mx-auto py-6 sm:py-8 font-sans">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-clay/10 text-clay text-xs font-bold mb-3 border border-clay/15">
          <Sparkles className="w-3.5 h-3.5 text-clay" />
          <span>Step 7 of 14 · Typography Studio</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 mb-2">
          Curated Editorial Font Pairings
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 max-w-xl mx-auto leading-relaxed">
          Select an intentional font pairing calibrated for luxury, balance, and high-readability. Watch your website on the right transform in real-time with 0ms delay.
        </p>

        {/* Quick Tips Ribbon (Direct from Graphic) */}
        <div className="mt-5 max-w-3xl mx-auto p-3.5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-neutral-100 text-xs font-bold text-neutral-900">
            <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Quick Tips for Better Font Pairing:</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            <div className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <span className="block text-[11px] font-bold text-neutral-900 leading-tight">Keep it simple</span>
                <span className="block text-[10px] text-neutral-500 leading-snug">Use 2-3 fonts max</span>
              </div>
            </div>
            <div className="flex items-start gap-1.5">
              <Scale className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <span className="block text-[11px] font-bold text-neutral-900 leading-tight">Create contrast</span>
                <span className="block text-[10px] text-neutral-500 leading-snug">Display + clean font</span>
              </div>
            </div>
            <div className="flex items-start gap-1.5">
              <Layers className="w-3.5 h-3.5 text-purple-500 shrink-0 mt-0.5" />
              <div>
                <span className="block text-[11px] font-bold text-neutral-900 leading-tight">Think hierarchy</span>
                <span className="block text-[10px] text-neutral-500 leading-snug">Use distinct weights</span>
              </div>
            </div>
            <div className="flex items-start gap-1.5">
              <Sparkle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="block text-[11px] font-bold text-neutral-900 leading-tight">Be consistent</span>
                <span className="block text-[10px] text-neutral-500 leading-snug">Same pair across brand</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Toggle */}
      <div className="flex items-center justify-between mb-5">
        <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
          {TYPOGRAPHY_PAIRINGS.length} Master Pairings Available
        </span>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs font-semibold text-neutral-700 hover:text-neutral-900 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 transition-all shadow-2xs cursor-pointer"
        >
          <Sliders className="w-3.5 h-3.5 text-neutral-600" />
          <span>{showAdvanced ? 'Hide Custom Sliders' : 'Fine-Tune Scale & Weights'}</span>
        </button>
      </div>

      {/* Curated Typography Cards Grid (Editorial Showcase) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {TYPOGRAPHY_PAIRINGS.map(pair => {
          const isSelected = !isCustomMode && project.typography.pairingId === pair.id;

          return (
            <div
              key={pair.id}
              onClick={() => handleSelectPairing(pair)}
              className={`group relative p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-neutral-950 bg-white ring-2 ring-neutral-950 shadow-md scale-[1.01]'
                  : 'border-neutral-200/80 bg-white hover:border-neutral-300 hover:shadow-xs hover:-translate-y-0.5'
              }`}
            >
              <div>
                {/* Top Badge: Number & Archetype Category */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-tight ${
                      isSelected
                        ? 'bg-neutral-900 text-white'
                        : 'bg-neutral-100 text-neutral-700 group-hover:bg-neutral-200/80'
                    }`}
                  >
                    {pair.categoryBadge}
                  </span>

                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </div>

                {/* Headings Font Name (Rendered in its real font!) */}
                <h3
                  className="text-2xl font-bold tracking-tight text-neutral-950 leading-tight mb-0.5"
                  style={{ fontFamily: pair.displayFont }}
                >
                  {pair.displayFont}
                </h3>

                {/* Body Font Name */}
                <div
                  className="text-sm font-medium text-neutral-600 mb-3"
                  style={{ fontFamily: pair.bodyFont }}
                >
                  {pair.bodyFont}
                </div>

                {/* Sample Quote Text (Rendered in its real body font) */}
                <p
                  className="text-xs text-neutral-700 leading-relaxed min-h-[36px] line-clamp-2 mb-3"
                  style={{ fontFamily: pair.bodyFont }}
                >
                  {pair.sampleQuote}
                </p>
              </div>

              {/* Bottom Row: Role Labels + 3 Palette Swatches */}
              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2 text-[11px] text-neutral-500">
                <span className="truncate text-[10px] font-medium">
                  <strong className="text-neutral-800">{pair.displayFont.split(' ')[0]}</strong> (Headings) ·{' '}
                  <strong className="text-neutral-800">{pair.bodyFont.split(' ')[0]}</strong> (Body)
                </span>

                {/* 3 Color Dots from Graphic */}
                <div className="flex items-center gap-1 shrink-0">
                  {pair.paletteColors.map((color, i) => (
                    <span
                      key={i}
                      className="w-2.5 h-2.5 rounded-full border border-black/10 shadow-2xs"
                      style={{ backgroundColor: color }}
                      title={`Harmonic Accent: ${color}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* OTHER / CUSTOM FONT PAIRING CARD */}
      <div
        onClick={() => {
          setIsCustomMode(true);
          setShowAdvanced(true);
        }}
        className={`p-5 rounded-2xl border cursor-pointer transition-all mb-6 ${
          isCustomMode
            ? 'border-neutral-950 bg-neutral-50 ring-2 ring-neutral-950 shadow-md'
            : 'border-dashed border-neutral-300 bg-white/80 hover:border-neutral-400 hover:bg-white'
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-700">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900">
                Custom Font Pairing Mode
              </h3>
              <p className="text-xs text-neutral-500">
                Select custom Google font families from our 23 supported typefaces for headings and body prose.
              </p>
            </div>
          </div>
          {isCustomMode && (
            <span className="text-xs font-bold text-neutral-900 bg-neutral-200 px-3 py-1 rounded-full shrink-0">
              Custom Active
            </span>
          )}
        </div>
      </div>

      {/* Advanced Font Controls */}
      {showAdvanced && (
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="border-b border-neutral-200 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-neutral-900">
                Custom Font Weights & Modular Scale Controls
              </h3>
              <span className="text-[11px] text-neutral-500 block">
                Direct control over the mathematical scale ladder and typographic variables
              </span>
            </div>
            <span className="text-xs font-mono font-bold bg-neutral-100 px-2.5 py-1 rounded-md text-neutral-700">
              Ratio: {project.typography.scaleRatio}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1">
                Headlines & Title Font
              </label>
              <p className="text-[11px] text-neutral-500 mb-2">
                Applied to hero displays, H1–H3 section headers.
              </p>
              <select
                value={project.typography.displayFont}
                onChange={e => {
                  updateTypography('displayFont', e.target.value);
                  updateTypography('headingFont', e.target.value);
                }}
                className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
              >
                {AVAILABLE_FONTS.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1">
                Body & Reading Font
              </label>
              <p className="text-[11px] text-neutral-500 mb-2">
                Applied to paragraphs, product copy, and UI text.
              </p>
              <select
                value={project.typography.bodyFont}
                onChange={e => updateTypography('bodyFont', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
              >
                {AVAILABLE_FONTS.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1">
                Modular Scale Ratio
              </label>
              <p className="text-[11px] text-neutral-500 mb-2">
                Mathematical ratio governing font-size steps.
              </p>
              <select
                value={project.typography.scaleRatio}
                onChange={e => updateTypography('scaleRatio', parseFloat(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
              >
                <option value="1.20">Minor Third (1.200) — Compact & Dense</option>
                <option value="1.25">Major Third (1.250) — Balanced & Modern</option>
                <option value="1.333">Perfect Fourth (1.333) — Editorial & Bold</option>
                <option value="1.414">Augmented Fourth (1.414) — Dramatic Drama</option>
                <option value="1.618">Golden Ratio (1.618) — Monumental Scale</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
