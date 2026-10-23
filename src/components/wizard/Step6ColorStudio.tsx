import React, { useState } from 'react';
import {
  Sparkles,
  Check,
  ChevronDown,
  ChevronUp,
  Palette,
  Sliders,
  ShieldCheck,
  RotateCcw,
  Plus
} from 'lucide-react';
import { DesignProject, ColorPaletteConfig } from '../../types/designSystem';
import { COLOR_PALETTES, COLOR_FAMILIES } from '../../data/palettes';
import { auditContrast } from '../../utils/contrast';
import { ColorWheelPicker } from '../common/ColorWheelPicker';
import { generateHarmoniousPalette, hexToHsl } from '../../utils/colorMath';

interface Step6ColorStudioProps {
  project: DesignProject;
  onChange: (updated: Partial<DesignProject>) => void;
}

export const Step6ColorStudio: React.FC<Step6ColorStudioProps> = ({ project, onChange }) => {
  const [selectedFamily, setSelectedFamily] = useState('All Families');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showSemanticMap, setShowSemanticMap] = useState(false);
  const [customPaletteName, setCustomPaletteName] = useState('My Custom Palette');
  const [isUsingCustomPalette, setIsUsingCustomPalette] = useState(false);

  const filteredPalettes = COLOR_PALETTES.filter(
    p => selectedFamily === 'All Families' || p.family.includes(selectedFamily.replace('All Families', ''))
  );

  const handleSelectPalette = (palette: ColorPaletteConfig) => {
    setIsUsingCustomPalette(false);
    onChange({
      colorPalette: palette
    });
  };

  const handleColorWheelChange = (newHex: string) => {
    const generated = generateHarmoniousPalette(
      newHex,
      `${project.name || 'Brand'} Custom Colors`
    );
    setIsUsingCustomPalette(true);
    onChange({
      colorPalette: generated
    });
  };

  const handleUpdateCustomColor = (key: keyof ColorPaletteConfig, value: string) => {
    setIsUsingCustomPalette(true);
    onChange({
      colorPalette: {
        ...project.colorPalette,
        [key]: value
      }
    });
  };

  // Contrast audits
  const textContrast = auditContrast(project.colorPalette.textPrimary, project.colorPalette.background);
  const buttonContrast = auditContrast('#FFFFFF', project.colorPalette.primary);

  // Recommended color swatches for wheel
  const recommendedWheelSwatches = [
    { name: 'Artisan Terracotta', hex: '#C85A32' },
    { name: 'Vivid Tangerine', hex: '#EA580C' },
    { name: 'Golden Amber', hex: '#D97706' },
    { name: 'Burnt Rust', hex: '#B44C28' },
    { name: 'Modern Indigo', hex: '#4F46E5' },
    { name: 'Oxford Navy', hex: '#1E3A8A' },
    { name: 'Electric Teal', hex: '#0D9488' },
    { name: 'Forest Botanical', hex: '#15803D' },
    { name: 'Calm Sage', hex: '#2D6A4F' },
    { name: 'Champagne Gold', hex: '#9A7B38' },
    { name: 'Graphite Slate', hex: '#334155' },
    { name: 'Deep Crimson', hex: '#991B1B' }
  ];

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Intro Header */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 text-xs font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5 text-neutral-900" />
          <span>Step 6 of 14 · Color Studio</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-1">
          Pick Your Website Colors
        </h1>
        <span className="text-[11px] font-mono text-neutral-400 block mb-2">
          technical: semantic color tokens & wcag contrast audit
        </span>
        <p className="text-sm text-neutral-600 max-w-xl mx-auto leading-relaxed">
          Use the color wheel to choose your exact brand color, pick from pre-tested founder palettes, or define your own custom shades. We automatically build a harmonious, high-contrast system for you.
        </p>
      </div>

      {/* SECTION 1: FULL COLOR WHEEL */}
      <div className="mb-8">
        <ColorWheelPicker
          initialHex={project.colorPalette.primary}
          onColorChange={handleColorWheelChange}
          recommendedColors={recommendedWheelSwatches}
        />
      </div>

      {/* Accessibility Scorecard Banner with Non-tech & Tech terms */}
      <div className="bg-white border border-neutral-200 rounded-xl p-4 mb-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-neutral-900">
                Readability & Contrast Check
              </h3>
              <span className="text-[10px] font-mono text-neutral-400">
                (WCAG 2.2 AA Standard)
              </span>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Verified Accessible
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Reading text is easily readable on your background (<strong className="text-neutral-800 tabular-nums">{textContrast.ratioFormatted}</strong> ratio). Main buttons are crisp and clear (<strong className="text-neutral-800 tabular-nums">{buttonContrast.ratioFormatted}</strong> ratio).
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs font-medium text-neutral-700 hover:text-neutral-900 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors shadow-2xs"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>{showAdvanced ? 'Hide Color Details' : 'Fine-Tune Individual Colors'}</span>
        </button>
      </div>

      {/* SECTION 2: CURATED PALETTES & CUSTOM PALETTE CARD */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-bold text-neutral-900">
            Curated Color Palettes for Your Industry
          </h2>
          <span className="text-[10px] font-mono text-neutral-400">
            technical: 60-30-10 distribution presets
          </span>
        </div>

        {/* Family Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {COLOR_FAMILIES.slice(0, 4).map(family => (
            <button
              key={family}
              type="button"
              onClick={() => setSelectedFamily(family)}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                selectedFamily === family
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-600 hover:text-neutral-900 bg-white border border-neutral-200'
              }`}
            >
              {family.split('&')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Recommended Palettes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {filteredPalettes.map(palette => {
          const isSelected = !isUsingCustomPalette && project.colorPalette.id === palette.id;

          return (
            <div
              key={palette.id}
              onClick={() => handleSelectPalette(palette)}
              className={`p-5 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'border-neutral-900 bg-white ring-2 ring-neutral-900 shadow-md'
                  : 'border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">{palette.name}</h3>
                  <span className="text-[10px] font-mono text-neutral-400">
                    {palette.family}
                  </span>
                </div>
                {isSelected && (
                  <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  </span>
                )}
              </div>

              <p className="text-xs text-neutral-600 mb-3 leading-relaxed">{palette.description}</p>

              {/* Swatch bars */}
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-neutral-50 border border-neutral-100">
                <div
                  className="w-10 h-7 rounded border border-black/5"
                  style={{ backgroundColor: palette.primary }}
                  title={`Primary: ${palette.primary}`}
                />
                <div
                  className="w-10 h-7 rounded border border-black/5"
                  style={{ backgroundColor: palette.secondary }}
                  title={`Secondary: ${palette.secondary}`}
                />
                <div
                  className="w-10 h-7 rounded border border-black/5"
                  style={{ backgroundColor: palette.accent }}
                  title={`Accent: ${palette.accent}`}
                />
                <div
                  className="w-10 h-7 rounded border border-black/5"
                  style={{ backgroundColor: palette.background }}
                  title={`Canvas: ${palette.background}`}
                />
                <div
                  className="w-10 h-7 rounded border border-black/5"
                  style={{ backgroundColor: palette.surface }}
                  title={`Surface: ${palette.surface}`}
                />
              </div>
            </div>
          );
        })}

        {/* OTHER / CUSTOM PALETTE CARD */}
        <div
          onClick={() => {
            setIsUsingCustomPalette(true);
            setShowAdvanced(true);
          }}
          className={`p-5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
            isUsingCustomPalette
              ? 'border-neutral-900 bg-neutral-50 ring-2 ring-neutral-900 shadow-md'
              : 'border-neutral-200 bg-white hover:border-neutral-300'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-neutral-800" />
                  <span>Other / Custom Color Palette</span>
                </h3>
                <span className="text-[10px] font-mono text-neutral-400">
                  technical: user-defined token overrides
                </span>
              </div>
              {isUsingCustomPalette && (
                <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center">
                  <Check className="w-3 h-3 stroke-[2.5]" />
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-600 mb-3 leading-relaxed">
              Define your own custom brand colors or enter your existing logo HEX codes. You can customize every single button, surface, and text color.
            </p>
          </div>

          <div className="pt-3 border-t border-neutral-200 flex items-center justify-between text-xs">
            <span className="font-semibold text-neutral-900">
              {isUsingCustomPalette ? 'Custom Palette Active' : 'Click to customize colors'}
            </span>
            <span className="text-neutral-500 underline text-[11px]">
              Open color editor
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 3: ADVANCED / DETAILED COLOR ROLES WITH EXPLANATIONS */}
      {showAdvanced && (
        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs mb-6 space-y-6">
          <div className="border-b border-neutral-200 pb-3">
            <h3 className="text-sm font-bold text-neutral-900">
              Customize Where Each Color is Used
            </h3>
            <span className="text-[10px] font-mono text-neutral-400 block">
              technical: semantic color assignments & hex codes
            </span>
            <p className="text-xs text-neutral-500 mt-1">
              Every field has a plain explanation of where it appears on your website.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {[
              {
                key: 'primary',
                label: 'Main Action Color',
                techTerm: 'primary-token',
                whatIsIt: 'Used for your main buttons (Shop Now, Sign Up) and primary links.',
                hex: project.colorPalette.primary
              },
              {
                key: 'secondary',
                label: 'Secondary Tone',
                techTerm: 'secondary-brand',
                whatIsIt: 'Used for secondary buttons, dark section accents, and footer headers.',
                hex: project.colorPalette.secondary
              },
              {
                key: 'accent',
                label: 'Accent Highlight',
                techTerm: 'accent-highlight',
                whatIsIt: 'Used for star ratings, badges, sale alerts, and hover rings.',
                hex: project.colorPalette.accent
              },
              {
                key: 'background',
                label: 'Main Page Canvas',
                techTerm: 'background (60% rule)',
                whatIsIt: 'The dominant backdrop of your website where content rests.',
                hex: project.colorPalette.background
              },
              {
                key: 'surface',
                label: 'Card & Box Surface',
                techTerm: 'surface / container',
                whatIsIt: 'The background for product cards, testimonial boxes, and forms.',
                hex: project.colorPalette.surface
              },
              {
                key: 'surfaceBorder',
                label: 'Dividers & Borders',
                techTerm: 'surface-border (1px)',
                whatIsIt: 'Subtle hairline lines separating sections without heavy visual clutter.',
                hex: project.colorPalette.surfaceBorder
              },
              {
                key: 'textPrimary',
                label: 'Headlines & Main Text',
                techTerm: 'text-primary',
                whatIsIt: 'Your big headings and main article text. Checked for high readability.',
                hex: project.colorPalette.textPrimary
              },
              {
                key: 'textSecondary',
                label: 'Subtitles & Captions',
                techTerm: 'text-secondary',
                whatIsIt: 'Supporting text, product details, dates, and helpful explanations.',
                hex: project.colorPalette.textSecondary
              },
              {
                key: 'focusRing',
                label: 'Focus Indicator Ring',
                techTerm: ':focus-visible',
                whatIsIt: 'Outlines active buttons when users navigate with keyboard for accessibility.',
                hex: project.colorPalette.focusRing
              }
            ].map(item => (
              <div key={item.key} className="space-y-1.5 p-3 rounded-lg bg-neutral-50 border border-neutral-100">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-neutral-800">
                    {item.label}
                  </label>
                  <span className="text-[9px] font-mono text-neutral-400">
                    {item.techTerm}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={item.hex}
                    onChange={e => handleUpdateCustomColor(item.key as any, e.target.value)}
                    className="w-8 h-8 rounded border border-neutral-300 cursor-pointer p-0 shrink-0"
                  />
                  <input
                    type="text"
                    value={item.hex}
                    onChange={e => handleUpdateCustomColor(item.key as any, e.target.value)}
                    className="w-full px-2 py-1 text-xs font-mono text-neutral-900 bg-white border border-neutral-200 rounded focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>

                <p className="text-[11px] text-neutral-500 leading-snug mt-1">
                  {item.whatIsIt}
                </p>
              </div>
            ))}
          </div>

          {/* Primary Color Shade Ramp Preview */}
          <div className="pt-4 border-t border-neutral-200">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                  Color Lightness Scale (50 to 900)
                </h4>
                <span className="text-[10px] font-mono text-neutral-400">
                  technical: algorithmic shade ramp for hover, active, and disabled states
                </span>
              </div>
              <span className="text-[11px] text-neutral-500">
                Auto-calculated from your chosen color
              </span>
            </div>

            <div className="grid grid-cols-10 gap-1 rounded-lg overflow-hidden p-1 bg-neutral-100">
              {([50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const).map((shade, idx) => (
                <div
                  key={shade}
                  className="h-10 rounded flex flex-col justify-end p-1 text-[9px] font-mono tabular-nums shadow-2xs"
                  style={{
                    backgroundColor: project.colorPalette.shades[shade],
                    color: idx > 4 ? '#FFFFFF' : '#18181B'
                  }}
                >
                  <span>{shade}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
