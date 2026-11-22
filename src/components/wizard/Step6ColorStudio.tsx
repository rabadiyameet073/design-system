import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Check,
  Palette,
  Sliders,
  ShieldCheck,
  RotateCcw,
  Lock,
  Unlock,
  Wand2,
  Upload,
  AlertTriangle,
  Layers,
  ChevronDown,
  ChevronUp,
  Sun,
  Moon,
  RefreshCw
} from 'lucide-react';
import { DesignProject, ColorPaletteConfig } from '../../types/designSystem';
import { SemanticColors } from '../../tokens/types';
import { COLOR_PALETTES, COLOR_FAMILIES } from '../../data/palettes';
import { ColorWheelPicker } from '../common/ColorWheelPicker';
import { extractDominantColorFromImage } from '../../utils/imageColorExtractor';
import { generateAllColorPrimitives } from '../../tokens/colorScale';
import { createLightSemanticColors, createDarkSemanticColors } from '../../tokens/semanticMapping';
import {
  generateOklchHarmony,
  HarmonyMode,
  MOOD_PALETTES,
  MoodPreset
} from '../../tokens/harmonyGenerator';
import {
  auditSemanticContrast,
  nudgeToContrast,
  autoFixSemantic,
  ratio,
  grade,
  computeApcaLc
} from '../../tokens/contrastEngine';

interface Step6ColorStudioProps {
  project: DesignProject;
  onChange: (updated: Partial<DesignProject>) => void;
  onPreviewDraft?: (draft: Partial<DesignProject>, label: string) => void;
  onClearDraft?: () => void;
}

type StartFromMode = 'wheel' | 'logo' | 'presets' | 'mood';

export const Step6ColorStudio: React.FC<Step6ColorStudioProps> = ({
  project,
  onChange,
  onPreviewDraft,
  onClearDraft
}) => {
  const [startMode, setStartMode] = useState<StartFromMode>('wheel');
  const [selectedFamily, setSelectedFamily] = useState('All Families');
  const [harmonyMode, setHarmonyMode] = useState<HarmonyMode>('complementary');
  const [isBrandLocked, setIsBrandLocked] = useState(false);
  const [isAccentLocked, setIsAccentLocked] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isExtractingLogo, setIsExtractingLogo] = useState(false);
  const [autoFixMessage, setAutoFixMessage] = useState<string | null>(null);
  const [themeTab, setThemeTab] = useState<'light' | 'dark'>('light');

  const brandHex = project.tokens?.color?.primitives?.brand?.[600] || project.colorPalette?.primary || '#B7410E';
  const accentHex = project.tokens?.color?.primitives?.accent?.[500] || project.colorPalette?.accent || '#2563EB';

  // Active mode semantic tokens
  const activeSemantic = useMemo(() => {
    const existing = project.tokens?.color?.semantic?.[themeTab];
    if (existing) return existing;
    const prims = project.tokens?.color?.primitives || generateAllColorPrimitives(brandHex, accentHex);
    return themeTab === 'light' ? createLightSemanticColors(prims) : createDarkSemanticColors(prims);
  }, [project.tokens?.color?.semantic, themeTab, brandHex, accentHex]);

  const textCanvasRatio = useMemo(() => {
    return ratio(activeSemantic.fgDefault, activeSemantic.bgDefault);
  }, [activeSemantic.fgDefault, activeSemantic.bgDefault]);

  const textCanvasApca = useMemo(() => {
    return computeApcaLc(activeSemantic.fgDefault, activeSemantic.bgDefault);
  }, [activeSemantic.fgDefault, activeSemantic.bgDefault]);

  const [inStepColorblindMode, setInStepColorblindMode] = useState<string>('none');
  const handleColorblindChange = (mode: string) => {
    setInStepColorblindMode(mode);
    window.dispatchEvent(new CustomEvent('dss:set-colorblind-mode', { detail: mode }));
  };

  const textCanvasGrade = useMemo(() => {
    return grade(textCanvasRatio);
  }, [textCanvasRatio]);

  const isTextContrastLow = textCanvasRatio < 4.5;

  const handleSemanticColorChange = (
    mode: 'light' | 'dark',
    key: keyof SemanticColors,
    value: string
  ) => {
    if (onClearDraft) onClearDraft();
    const currentSemantic = project.tokens?.color?.semantic;
    if (!currentSemantic) return;

    const updatedMode = {
      ...currentSemantic[mode],
      [key]: value
    };

    const updatedPalette: ColorPaletteConfig = {
      ...project.colorPalette,
      ...(mode === 'light' && key === 'bgDefault' ? { background: value } : {}),
      ...(mode === 'light' && key === 'bgSurface' ? { surface: value } : {}),
      ...(mode === 'light' && key === 'fgDefault' ? { textPrimary: value } : {}),
      ...(mode === 'light' && key === 'fgMuted' ? { textSecondary: value } : {}),
      ...(mode === 'light' && key === 'borderDefault' ? { surfaceBorder: value } : {})
    };

    onChange({
      colorPalette: updatedPalette,
      tokens: {
        ...project.tokens,
        color: {
          ...project.tokens.color,
          semantic: {
            ...currentSemantic,
            [mode]: updatedMode
          }
        }
      }
    });
  };

  const handleNudgeCurrentThemeText = () => {
    if (onClearDraft) onClearDraft();
    const nudgedFg = nudgeToContrast(activeSemantic.fgDefault, activeSemantic.bgDefault, 4.5);
    handleSemanticColorChange(themeTab, 'fgDefault', nudgedFg);
  };

  const handleResetCurrentThemeSemantic = () => {
    if (onClearDraft) onClearDraft();
    const prims = project.tokens?.color?.primitives || generateAllColorPrimitives(brandHex, accentHex);
    const fresh = themeTab === 'light' ? createLightSemanticColors(prims) : createDarkSemanticColors(prims);
    const currentSemantic = project.tokens?.color?.semantic;
    if (!currentSemantic) return;

    onChange({
      tokens: {
        ...project.tokens,
        color: {
          ...project.tokens.color,
          semantic: {
            ...currentSemantic,
            [themeTab]: fresh
          }
        }
      }
    });
  };

  // Compute live semantic audit on current light theme
  const currentSemantic = project.tokens?.color?.semantic?.light;
  const auditSummary = useMemo(() => {
    if (!currentSemantic) {
      return { passCount: 14, failCount: 0, totalCount: 14, scorePercent: 100, issues: [] };
    }
    return auditSemanticContrast(currentSemantic);
  }, [currentSemantic]);

  // Synchronize master tokens when colors change
  const applyColors = (newBrand: string, newAccent: string) => {
    if (onClearDraft) onClearDraft();
    const primitives = generateAllColorPrimitives(newBrand, newAccent);
    const light = createLightSemanticColors(primitives);
    const dark = createDarkSemanticColors(primitives);

    // Also update legacy colorPalette for backward-compatibility
    const updatedPalette: ColorPaletteConfig = {
      ...project.colorPalette,
      primary: newBrand,
      accent: newAccent,
      secondary: primitives.brand[700],
      background: light.bgDefault,
      surface: light.bgSurface,
      surfaceBorder: light.borderDefault,
      textPrimary: light.fgDefault,
      textSecondary: light.fgMuted,
      focusRing: light.focusRing,
      shades: {
        50: primitives.brand[50],
        100: primitives.brand[100],
        200: primitives.brand[200],
        300: primitives.brand[300],
        400: primitives.brand[400],
        500: primitives.brand[500],
        600: primitives.brand[600],
        700: primitives.brand[700],
        800: primitives.brand[800],
        900: primitives.brand[900]
      }
    };

    onChange({
      colorPalette: updatedPalette,
      tokens: {
        ...project.tokens,
        color: {
          primitives,
          semantic: { light, dark }
        }
      }
    });
  };

  const handleBrandChange = (newHex: string) => {
    if (isBrandLocked) return;
    let nextAccent = accentHex;
    if (!isAccentLocked) {
      const harm = generateOklchHarmony(newHex, harmonyMode);
      nextAccent = harm.accent;
    }
    applyColors(newHex, nextAccent);
  };

  const handleAccentChange = (newHex: string) => {
    if (isAccentLocked) return;
    applyColors(brandHex, newHex);
  };

  const handleHarmonyChange = (mode: HarmonyMode) => {
    setHarmonyMode(mode);
    const harm = generateOklchHarmony(brandHex, mode);
    applyColors(brandHex, isAccentLocked ? accentHex : harm.accent);
  };

  const handleSelectPreset = (palette: ColorPaletteConfig) => {
    const nextBrand = isBrandLocked ? brandHex : palette.primary;
    const nextAccent = isAccentLocked ? accentHex : palette.accent;
    applyColors(nextBrand, nextAccent);
  };

  const handleSelectMood = (mood: MoodPreset) => {
    const nextBrand = isBrandLocked ? brandHex : mood.brandHex;
    const nextAccent = isAccentLocked ? accentHex : mood.accentHex;
    applyColors(nextBrand, nextAccent);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsExtractingLogo(true);
      const extractedHex = await extractDominantColorFromImage(file);
      handleBrandChange(extractedHex);
    } catch (err) {
      console.warn('Logo extraction warning:', err);
    } finally {
      setIsExtractingLogo(false);
    }
  };

  // Auto-Fix contrast using autoFixSemantic
  const handleAutoFixContrast = () => {
    if (onClearDraft) onClearDraft();
    if (!project.tokens?.color?.semantic) return;

    const light = autoFixSemantic(project.tokens.color.semantic.light);
    const dark = autoFixSemantic(project.tokens.color.semantic.dark);

    onChange({
      tokens: {
        ...project.tokens,
        color: {
          ...project.tokens.color,
          semantic: { light, dark }
        }
      }
    });

    setAutoFixMessage('All contrast pairs nudged to satisfy WCAG 2.2 AA standards ✓');
    setTimeout(() => setAutoFixMessage(null), 4000);
  };

  const filteredPalettes = COLOR_PALETTES.filter(
    p => selectedFamily === 'All Families' || p.family.includes(selectedFamily.replace('All Families', ''))
  );

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-6">
      {/* Step Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 text-white text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Step 5 of 11 · Color Studio & OKLCH Harmonies</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          Design your color system & verify contrast
        </h1>
        <p className="text-sm text-neutral-600 leading-relaxed max-w-2xl">
          Build perceptually uniform 11-step OKLCH scales. Choose to start from your brand color, logo upload, curated presets, or AI-style mood prompts. Lock individual hues while exploring harmonies.
        </p>
      </div>

      {/* Start From Method Switcher */}
      <div className="flex items-center gap-1.5 p-1 bg-white border border-neutral-200 rounded-xl overflow-x-auto shadow-xs">
        {[
          { id: 'wheel', label: 'Brand Color Wheel', icon: Palette },
          { id: 'logo', label: 'Logo Color Extraction', icon: Upload },
          { id: 'presets', label: 'Curated Presets', icon: Layers },
          { id: 'mood', label: 'AI Mood Prompts', icon: Wand2 }
        ].map(tab => {
          const Icon = tab.icon;
          const isSelected = startMode === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStartMode(tab.id as StartFromMode)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                isSelected
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Color Locks & Harmony Bar */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-100 pb-4">
          {/* Brand Color & Lock */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="color"
                value={brandHex}
                disabled={isBrandLocked}
                onChange={e => handleBrandChange(e.target.value)}
                className={`w-10 h-10 rounded-xl border border-black/10 p-0 ${
                  isBrandLocked ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
                }`}
                title="Change Primary Brand Color"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-neutral-900">Primary Brand</span>
                <button
                  type="button"
                  onClick={() => setIsBrandLocked(!isBrandLocked)}
                  className={`p-1 rounded transition-colors ${
                    isBrandLocked ? 'text-amber-600 bg-amber-50' : 'text-neutral-400 hover:text-neutral-700'
                  }`}
                  title={isBrandLocked ? 'Brand color locked' : 'Click to lock brand color'}
                >
                  {isBrandLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                </button>
              </div>
              <input
                type="text"
                value={brandHex}
                disabled={isBrandLocked}
                onChange={e => {
                  let val = e.target.value.trim();
                  if (!val.startsWith('#') && val.length > 0) val = '#' + val;
                  if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
                    handleBrandChange(val);
                  }
                }}
                className="font-mono text-xs text-neutral-800 font-bold uppercase w-20 px-1.5 py-0.5 rounded border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
                placeholder="#HEX"
              />
            </div>
          </div>

          {/* Accent Color & Lock */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="color"
                value={accentHex}
                disabled={isAccentLocked}
                onChange={e => handleAccentChange(e.target.value)}
                className={`w-10 h-10 rounded-xl border border-black/10 p-0 ${
                  isAccentLocked ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
                }`}
                title="Change Secondary Accent Color"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-neutral-900">Secondary Accent</span>
                <button
                  type="button"
                  onClick={() => setIsAccentLocked(!isAccentLocked)}
                  className={`p-1 rounded transition-colors ${
                    isAccentLocked ? 'text-amber-600 bg-amber-50' : 'text-neutral-400 hover:text-neutral-700'
                  }`}
                  title={isAccentLocked ? 'Accent color locked' : 'Click to lock accent color'}
                >
                  {isAccentLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                </button>
              </div>
              <input
                type="text"
                value={accentHex}
                disabled={isAccentLocked}
                onChange={e => {
                  let val = e.target.value.trim();
                  if (!val.startsWith('#') && val.length > 0) val = '#' + val;
                  if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
                    handleAccentChange(val);
                  }
                }}
                className="font-mono text-xs text-neutral-800 font-bold uppercase w-20 px-1.5 py-0.5 rounded border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
                placeholder="#HEX"
              />
            </div>
          </div>

          {/* OKLCH Harmony Mode Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-neutral-500">Harmony:</span>
            <select
              value={harmonyMode}
              onChange={e => handleHarmonyChange(e.target.value as HarmonyMode)}
              className="px-2.5 py-1.5 text-xs font-bold border border-neutral-300 rounded-lg bg-neutral-50 text-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900"
            >
              <option value="complementary">Complementary (+180°)</option>
              <option value="analogous">Analogous (±35°)</option>
              <option value="triadic">Triadic (+120° / +240°)</option>
              <option value="split-complementary">Split-Complementary (+150°)</option>
              <option value="monochrome">Monochromatic (Lightness Ramp)</option>
            </select>
          </div>
        </div>

        {/* 11-Step OKLCH Lightness Scale Ramp */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-neutral-500 font-medium">
            <span>Perceptual OKLCH Scale (50 → 950)</span>
            <span className="font-mono text-[10px]">Tapered chroma · Constant hue</span>
          </div>
          <div className="grid grid-cols-11 gap-1 rounded-xl overflow-hidden p-1 bg-neutral-100">
            {([50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const).map((step, idx) => {
              const hex = project.tokens?.color?.primitives?.brand?.[step] || project.colorPalette?.primary;
              return (
                <div
                  key={step}
                  className="h-11 rounded flex flex-col justify-end p-1 text-[9px] font-mono tabular-nums shadow-2xs"
                  style={{
                    backgroundColor: hex,
                    color: idx > 5 ? activeSemantic.bgDefault : activeSemantic.fgDefault
                  }}
                  title={`Step ${step}: ${hex}`}
                >
                  <span className="truncate">{step}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Direct Surface & Typography Color Calibration (Single Source of Truth) */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-neutral-700" />
              <span>Canvas, Surfaces & Typography Colors</span>
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Directly calibrate text contrast and background surfaces. Changes apply live to your preview.
            </p>
          </div>

          {/* Theme Switcher & Colorblind Vision Quick-Toggle */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 bg-neutral-100 p-1 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-neutral-400 pl-1">Vision:</span>
              <select
                value={inStepColorblindMode}
                onChange={(e) => handleColorblindChange(e.target.value)}
                className="bg-white text-[11px] font-semibold text-neutral-800 rounded-lg px-2 py-1 border border-neutral-200 focus:outline-none cursor-pointer"
                title="Colorblind Vision Simulation"
              >
                <option value="none">Normal Vision</option>
                <option value="protanopia">Protanopia (Red-blind)</option>
                <option value="deuteranopia">Deuteranopia (Green-blind)</option>
                <option value="tritanopia">Tritanopia (Blue-blind)</option>
                <option value="achromatopsia">Achromatopsia (Monochrome)</option>
              </select>
            </div>

            <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-xl">
              <button
                type="button"
                onClick={() => setThemeTab('light')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  themeTab === 'light'
                    ? 'bg-white text-neutral-900 shadow-2xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Light Theme</span>
              </button>
              <button
                type="button"
                onClick={() => setThemeTab('dark')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  themeTab === 'dark'
                    ? 'bg-neutral-900 text-white shadow-2xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                <span>Dark Theme</span>
              </button>
            </div>
          </div>
        </div>

        {/* 5 Core Color Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            {
              key: 'bgDefault' as keyof SemanticColors,
              label: 'Canvas Background',
              desc: 'Main page & viewport background',
              value: activeSemantic.bgDefault,
              badge: null
            },
            {
              key: 'bgSurface' as keyof SemanticColors,
              label: 'Card Surface',
              desc: 'Cards, modals & floating panels',
              value: activeSemantic.bgSurface,
              badge: `${ratio(activeSemantic.fgDefault, activeSemantic.bgSurface).toFixed(1)}:1 vs Text`
            },
            {
              key: 'fgDefault' as keyof SemanticColors,
              label: 'Primary Text',
              desc: 'Headings and high-contrast body',
              value: activeSemantic.fgDefault,
              badge: `${textCanvasRatio.toFixed(1)}:1 on Canvas`
            },
            {
              key: 'fgMuted' as keyof SemanticColors,
              label: 'Muted Text',
              desc: 'Captions, subtitles & placeholders',
              value: activeSemantic.fgMuted,
              badge: `${ratio(activeSemantic.fgMuted, activeSemantic.bgDefault).toFixed(1)}:1 on Canvas`
            },
            {
              key: 'borderDefault' as keyof SemanticColors,
              label: 'Border UI',
              desc: 'Card outlines, dividers & inputs',
              value: activeSemantic.borderDefault,
              badge: `${ratio(activeSemantic.borderDefault, activeSemantic.bgDefault).toFixed(1)}:1 vs Canvas`
            }
          ].map((item) => (
            <div
              key={item.key}
              className="p-3 rounded-xl border border-neutral-150 bg-neutral-50/60 hover:bg-neutral-50 transition-colors flex flex-col justify-between space-y-2.5"
            >
              <div>
                <div className="flex items-center justify-between gap-1">
                  <div className="text-xs font-bold text-neutral-900">{item.label}</div>
                  {item.badge && (
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-white border border-neutral-200 text-neutral-600 shadow-2xs">
                      {item.badge}
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-neutral-400 leading-tight mt-0.5">{item.desc}</div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={item.value}
                  onChange={(e) => handleSemanticColorChange(themeTab, item.key, e.target.value)}
                  className="w-8 h-8 rounded-lg border border-black/10 p-0 cursor-pointer shrink-0"
                  title={`Pick ${item.label}`}
                />
                <input
                  type="text"
                  value={item.value}
                  onChange={(e) => {
                    let val = e.target.value.trim();
                    if (!val.startsWith('#') && val.length > 0) val = '#' + val;
                    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
                      handleSemanticColorChange(themeTab, item.key, val);
                    }
                  }}
                  className="font-mono text-xs font-bold uppercase w-full px-2 py-1 rounded-md border border-neutral-200 bg-white text-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  placeholder="#HEX"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Live Contrast Verification Banner for Active Theme */}
        <div className="p-3 rounded-xl bg-neutral-100/70 border border-neutral-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div
              className="px-3 py-1.5 rounded-lg border font-medium text-xs shadow-2xs"
              style={{
                backgroundColor: activeSemantic.bgDefault,
                color: activeSemantic.fgDefault,
                borderColor: activeSemantic.borderDefault
              }}
            >
              Aa The quick brown fox jumps over the lazy dog
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-neutral-500 font-medium">Text/Canvas Contrast:</span>
              <span
                className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                  textCanvasRatio >= 4.5
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {textCanvasRatio.toFixed(1)}:1 ({textCanvasGrade}) · APCA Lc {textCanvasApca > 0 ? `+${textCanvasApca}` : textCanvasApca}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isTextContrastLow && (
              <button
                type="button"
                onClick={handleNudgeCurrentThemeText}
                className="px-2.5 py-1 rounded-lg bg-neutral-900 text-white text-[11px] font-bold hover:bg-neutral-800 cursor-pointer shadow-2xs"
              >
                Nudge Text to AA
              </button>
            )}
            <button
              type="button"
              onClick={handleResetCurrentThemeSemantic}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-neutral-200 hover:bg-white text-neutral-600 hover:text-neutral-900 text-[11px] font-semibold cursor-pointer transition-colors"
              title="Reset this theme's semantic colors from primitive color scales"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset to OKLCH Defaults</span>
            </button>
          </div>
        </div>
      </div>

      {/* WCAG 2.2 AA Contrast Scorecard & Auto-Fix */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              auditSummary.failCount === 0
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {auditSummary.failCount === 0 ? (
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-700" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-neutral-900">
                WCAG 2.2 AA Contrast Compliance
              </h3>
              <span
                className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  auditSummary.failCount === 0
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {auditSummary.passCount} Passing · {auditSummary.failCount} Failing
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              {auditSummary.failCount === 0
                ? 'All body text (≥4.5:1) and interactive UI borders (≥3:1) satisfy standard accessibility ratios.'
                : 'Some color pairs do not meet the minimum 4.5:1 text ratio. Click Auto-Fix to calibrate lightness.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {auditSummary.failCount > 0 && (
            <button
              type="button"
              onClick={handleAutoFixContrast}
              className="px-3.5 py-1.5 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition-colors cursor-pointer shadow-xs"
            >
              Nudge to AA (Auto-Fix)
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="px-3 py-1.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-xs font-bold text-neutral-700 transition-colors cursor-pointer"
          >
            {showAdvanced ? 'Hide Pairs' : 'Inspect Audit Table'}
          </button>
        </div>
      </div>

      {autoFixMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800">
          {autoFixMessage}
        </div>
      )}

      {/* Expanded Contrast Table */}
      {showAdvanced && (
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs overflow-x-auto space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
            Computed Semantic Color Pairs Audit
          </h3>
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 text-neutral-500 text-[11px] font-semibold">
                <th className="py-2">UI Element</th>
                <th className="py-2">Foreground</th>
                <th className="py-2">Background</th>
                <th className="py-2">Target</th>
                <th className="py-2">Ratio</th>
                <th className="py-2">Compliance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {auditSummary.issues.map(issue => (
                <tr key={issue.id} className="text-neutral-800">
                  <td className="py-2 font-medium">{issue.name}</td>
                  <td className="py-2 font-mono">
                    <span className="inline-block w-3 h-3 rounded-full mr-1.5 align-middle border border-black/10" style={{ backgroundColor: issue.fg }} />
                    {issue.fg}
                  </td>
                  <td className="py-2 font-mono">
                    <span className="inline-block w-3 h-3 rounded-full mr-1.5 align-middle border border-black/10" style={{ backgroundColor: issue.bg }} />
                    {issue.bg}
                  </td>
                  <td className="py-2 font-mono text-neutral-500">{issue.targetRatio}:1</td>
                  <td className="py-2 font-mono font-bold">{issue.ratio}:1</td>
                  <td className="py-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        issue.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {issue.passed ? `PASS (${issue.grade})` : 'FAIL'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mode-specific content */}
      {startMode === 'wheel' && (
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs">
          <ColorWheelPicker
            initialHex={brandHex}
            onColorChange={handleBrandChange}
          />
        </div>
      )}

      {startMode === 'logo' && (
        <div className="bg-white border border-neutral-200 rounded-2xl p-8 shadow-xs text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-neutral-800 flex items-center justify-center mx-auto">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-neutral-900">Upload Brand Logo for Color Extraction</h2>
            <p className="text-xs text-neutral-500 max-w-md mx-auto mt-1">
              Antigravity DSS will parse your logo via HTML5 Canvas, eliminate background noise, and extract your signature brand hue.
            </p>
          </div>
          <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 cursor-pointer shadow-xs transition-colors">
            <Upload className="w-4 h-4" />
            <span>{isExtractingLogo ? 'Analyzing Image Pixels...' : 'Choose Logo File (PNG/JPG/WEBP)'}</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
          </label>
        </div>
      )}

      {startMode === 'presets' && (
        <div className="space-y-4">
          {/* Family Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {COLOR_FAMILIES.map(family => (
              <button
                key={family}
                type="button"
                onClick={() => setSelectedFamily(family)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  selectedFamily === family
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-600 hover:text-neutral-900 bg-white border border-neutral-200'
                }`}
              >
                {family}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredPalettes.map(palette => {
              const isSelected = project.colorPalette?.id === palette.id;
              return (
                <div
                  key={palette.id}
                  onClick={() => handleSelectPreset(palette)}
                  onMouseEnter={() => {
                    if (onPreviewDraft) {
                      const prims = generateAllColorPrimitives(palette.primary, palette.accent);
                      onPreviewDraft({
                        colorPalette: palette,
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
                      }, palette.name);
                    }
                  }}
                  onMouseLeave={() => onClearDraft && onClearDraft()}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-neutral-900 bg-white ring-2 ring-neutral-900 shadow-md'
                      : 'border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="text-sm font-bold text-neutral-900">{palette.name}</h3>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[2.5]" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500 mb-3 leading-relaxed">{palette.description}</p>
                  <div className="flex items-center gap-1.5 p-2 rounded-xl bg-neutral-50 border border-neutral-100">
                    <div className="w-12 h-6 rounded-md border border-black/10" style={{ backgroundColor: palette.primary }} title="Primary" />
                    <div className="w-12 h-6 rounded-md border border-black/10" style={{ backgroundColor: palette.secondary }} title="Secondary" />
                    <div className="w-12 h-6 rounded-md border border-black/10" style={{ backgroundColor: palette.accent }} title="Accent" />
                    <div className="w-12 h-6 rounded-md border border-black/10" style={{ backgroundColor: palette.background }} title="Canvas" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {startMode === 'mood' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {MOOD_PALETTES.map(mood => {
            const isSelected = brandHex.toLowerCase() === mood.brandHex.toLowerCase();
            return (
              <div
                key={mood.id}
                onClick={() => handleSelectMood(mood)}
                onMouseEnter={() => {
                  if (onPreviewDraft) {
                    const prims = generateAllColorPrimitives(mood.brandHex, mood.accentHex);
                    onPreviewDraft({
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
                    }, mood.label);
                  }
                }}
                onMouseLeave={() => onClearDraft && onClearDraft()}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-neutral-900 bg-white ring-2 ring-neutral-900 shadow-md'
                    : 'border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <h3 className="text-sm font-bold text-neutral-900">{mood.label}</h3>
                  </div>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[2.5]" />
                    </span>
                  )}
                </div>
                <div className="text-[11px] font-mono text-neutral-400 italic mb-2">
                  "{mood.prompt}"
                </div>
                <p className="text-xs text-neutral-600 mb-3 leading-relaxed">{mood.description}</p>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-neutral-100 font-mono text-[10px]">
                    <span className="w-2.5 h-2.5 rounded-full border border-black/10" style={{ backgroundColor: mood.brandHex }} />
                    {mood.brandHex}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-neutral-100 font-mono text-[10px]">
                    <span className="w-2.5 h-2.5 rounded-full border border-black/10" style={{ backgroundColor: mood.accentHex }} />
                    {mood.accentHex}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
