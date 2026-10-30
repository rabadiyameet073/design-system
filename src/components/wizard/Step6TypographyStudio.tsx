import React, { useState, useEffect } from 'react';
import { Sparkles, Sliders, Type, Check, ChevronRight, AlertCircle, Info } from 'lucide-react';
import { DesignProject } from '../../types/designSystem';
import { FontPickerModal } from './FontPickerModal';
import {
  FontMeta,
  getRecommendedBodyFonts,
  generateFullTypeScale
} from '../../utils/typeScale';
import fontsSnapshot from '../../data/fonts.snapshot.json';

interface Step6TypographyStudioProps {
  project: DesignProject;
  onChange: (updated: Partial<DesignProject>) => void;
  onPreviewDraft?: (draft: Partial<DesignProject>, label: string) => void;
  onClearDraft?: () => void;
}

const SCALE_RATIOS = [
  { value: 1.2, label: '1.200 · Minor Third (Calm / Mobile)' },
  { value: 1.25, label: '1.250 · Major Third (Balanced / Classic)' },
  { value: 1.333, label: '1.333 · Perfect Fourth (Expressive / Editorial)' },
  { value: 1.5, label: '1.500 · Perfect Fifth (Dramatic / Bold)' },
  { value: 1.618, label: '1.618 · Golden Ratio (Maximum Impact)' }
];

export const Step6TypographyStudio: React.FC<Step6TypographyStudioProps> = ({
  project,
  onChange,
  onPreviewDraft,
  onClearDraft
}) => {
  const [mode, setMode] = useState<'pair' | 'advanced'>('pair');
  const [activePickerRole, setActivePickerRole] = useState<'heading' | 'body' | 'display' | 'mono' | null>(null);

  const typography = project.tokens.typography;
  const headingFamily = typography.roles.heading?.family || 'Fraunces';
  const bodyFamily = typography.roles.body?.family || 'DM Sans';
  const currentRatio = typography.scaleRatio || 1.25;
  const baseSize = typography.baseSizePx || 16;

  const allFonts = fontsSnapshot as unknown as FontMeta[];

  // Current heading font meta
  const currentHeadingMeta = allFonts.find(f => f.family === headingFamily) || {
    family: headingFamily,
    category: 'serif',
    variants: ['400', '600', '700'],
    subsets: ['latin'],
    variable: true,
    source: 'google'
  };

  // Recommended body fonts
  const recommendedBodies = getRecommendedBodyFonts(
    currentHeadingMeta as FontMeta,
    allFonts,
    project.tokens.meta.category ? [project.tokens.meta.category] : ['modern', 'editorial']
  );

  const handleSelectHeading = (font: FontMeta) => {
    const updatedRoles = {
      ...typography.roles,
      heading: {
        family: font.family,
        fallback: font.category === 'serif' ? ['ui-serif', 'Georgia', 'serif'] : ['ui-sans-serif', 'system-ui', 'sans-serif'],
        weight: 600,
        lineHeight: 1.15,
        letterSpacing: '-0.02em'
      },
      display: {
        family: font.family,
        fallback: font.category === 'serif' ? ['ui-serif', 'Georgia', 'serif'] : ['ui-sans-serif', 'system-ui', 'sans-serif'],
        weight: 700,
        lineHeight: 1.08,
        letterSpacing: '-0.03em'
      }
    };

    const newScale = generateFullTypeScale(baseSize, currentRatio);

    onChange({
      typography: {
        ...project.typography,
        displayFont: font.family,
        headingFont: font.family
      },
      tokens: {
        ...project.tokens,
        typography: {
          ...project.tokens.typography,
          roles: updatedRoles,
          scale: newScale as any
        }
      }
    });
  };

  const handleSelectBody = (font: FontMeta) => {
    const updatedRoles = {
      ...typography.roles,
      body: {
        family: font.family,
        fallback: font.category === 'serif' ? ['ui-serif', 'Georgia', 'serif'] : ['ui-sans-serif', 'system-ui', 'sans-serif'],
        weight: 400,
        lineHeight: 1.6,
        letterSpacing: '0em'
      },
      ui: {
        family: font.family,
        fallback: ['ui-sans-serif', 'system-ui', 'sans-serif'],
        weight: 500,
        lineHeight: 1.25,
        letterSpacing: '0.01em'
      }
    };

    onChange({
      typography: {
        ...project.typography,
        bodyFont: font.family
      },
      tokens: {
        ...project.tokens,
        typography: {
          ...project.tokens.typography,
          roles: updatedRoles
        }
      }
    });
  };

  const handleRatioChange = (ratio: number) => {
    const newScale = generateFullTypeScale(baseSize, ratio);
    onChange({
      tokens: {
        ...project.tokens,
        typography: {
          ...project.tokens.typography,
          scaleRatio: ratio,
          scale: newScale as any
        }
      }
    });
  };

  const handleBaseSizeChange = (size: number) => {
    const newScale = generateFullTypeScale(size, currentRatio);
    onChange({
      tokens: {
        ...project.tokens,
        typography: {
          ...project.tokens.typography,
          baseSizePx: size,
          scale: newScale as any
        }
      }
    });
  };

  // Estimate performance payload
  const estimatedPayloadKb = 74; // ~35KB per family with variable woff2

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-8">
      {/* Title */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 text-white text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Step 6 of 11 · Typography Architecture & Roles</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          Assign font roles and fluid typographic scales
        </h1>
        <p className="text-sm text-neutral-600 leading-relaxed max-w-2xl">
          A coherent system typically pairs one expressive heading family with a highly legible body family. Choose your headline font; Studio automatically computes optimal body recommendations.
        </p>
      </div>

      {/* Mode Switcher: Pair Mode vs Advanced Mode */}
      <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
        <div className="flex items-center gap-2 bg-neutral-100 p-1 rounded-xl">
          <button
            onClick={() => setMode('pair')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              mode === 'pair' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Pair Mode (Curated)
          </button>
          <button
            onClick={() => setMode('advanced')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              mode === 'advanced' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Advanced (Per-Role)
          </button>
        </div>

        {/* Estimated payload badge */}
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-600">
          <span>Payload: ≈ {estimatedPayloadKb} KB</span>
          <span className="p-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold px-1.5">
            Optimal ✓
          </span>
        </div>
      </div>

      {/* Main Pair Selection Workbench */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Heading Font Card */}
        <div className="p-5 rounded-2xl border border-neutral-200 bg-white shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase font-bold text-neutral-500">
              Role: Heading (Display & H1–H4)
            </span>
            <button
              onClick={() => setActivePickerRole('heading')}
              className="text-xs font-bold text-neutral-900 hover:underline cursor-pointer"
            >
              Browse All ▾
            </button>
          </div>

          <div
            onClick={() => setActivePickerRole('heading')}
            className="p-4 rounded-xl border border-neutral-200 hover:border-neutral-400 bg-neutral-50 transition-all cursor-pointer space-y-1"
          >
            <div className="text-xl font-bold text-neutral-900" style={{ fontFamily: headingFamily }}>
              {headingFamily}
            </div>
            <div className="text-xs text-neutral-500 font-mono">
              Weights: 500, 600, 700 · Variable woff2
            </div>
          </div>
        </div>

        {/* Body Font Card */}
        <div className="p-5 rounded-2xl border border-neutral-200 bg-white shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase font-bold text-neutral-500">
              Role: Body & UI (Paragraphs, Nav, Inputs)
            </span>
            <button
              onClick={() => setActivePickerRole('body')}
              className="text-xs font-bold text-neutral-900 hover:underline cursor-pointer"
            >
              Browse All ▾
            </button>
          </div>

          <div
            onClick={() => setActivePickerRole('body')}
            className="p-4 rounded-xl border border-neutral-200 hover:border-neutral-400 bg-neutral-50 transition-all cursor-pointer space-y-1"
          >
            <div className="text-xl font-bold text-neutral-900" style={{ fontFamily: bodyFamily }}>
              {bodyFamily}
            </div>
            <div className="text-xs text-neutral-500 font-mono">
              Weights: 400 (Regular), 600 (Semibold), 700 (Bold)
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Body Pairs Bar */}
      <div className="space-y-3 bg-neutral-50 p-5 rounded-2xl border border-neutral-200">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-neutral-800">
            Smart Recommended Body Pairings for {headingFamily}
          </div>
          <span className="text-[11px] font-mono text-neutral-500">Scored for contrast & character</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {recommendedBodies.map(font => {
            const isSelected = bodyFamily === font.family;
            return (
              <button
                key={font.family}
                onClick={() => handleSelectBody(font)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                    : 'bg-white hover:bg-neutral-100 border-neutral-200 text-neutral-800'
                }`}
              >
                <div>
                  <div className="font-bold text-xs" style={{ fontFamily: font.family }}>
                    {font.family}
                  </div>
                  <div className={`text-[10px] uppercase font-mono ${isSelected ? 'text-neutral-400' : 'text-neutral-500'}`}>
                    {font.category}
                  </div>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Modular Type Scale Ratio & Base Size */}
      <div className="p-6 rounded-2xl border border-neutral-200 bg-white shadow-xs space-y-6">
        <div className="space-y-1">
          <h2 className="text-sm font-bold text-neutral-900">Modular Scale Ratio & Fluid Stepping</h2>
          <p className="text-xs text-neutral-500">
            A modular scale multiplies each ascending step by a fixed mathematical ratio. Fluid clamp formulas ensure headers shrink comfortably on mobile viewports.
          </p>
        </div>

        {/* Ratio Selector Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {SCALE_RATIOS.map(r => {
            const isSelected = currentRatio === r.value;
            return (
              <button
                key={r.value}
                onClick={() => handleRatioChange(r.value)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                    : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-800'
                }`}
              >
                <div className="font-mono font-bold text-xs">{r.value}</div>
                <div className={`text-[11px] mt-0.5 ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                  {r.label.split('·')[1]}
                </div>
              </button>
            );
          })}
        </div>

        {/* Base Size Slider */}
        <div className="pt-2 space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-neutral-600">Base Root Size:</span>
            <span className="font-mono text-neutral-900 font-bold">{baseSize}px (1.0rem)</span>
          </div>
          <input
            type="range"
            min="14"
            max="20"
            value={baseSize}
            onChange={e => handleBaseSizeChange(parseInt(e.target.value, 10))}
            className="w-full accent-neutral-900 cursor-pointer"
          />
          {baseSize < 16 && (
            <div className="flex items-center gap-1.5 text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Warning: Body text under 16px hurts legibility on mobile viewports.</span>
            </div>
          )}
        </div>
      </div>

      {/* Font Picker Modal */}
      {activePickerRole && (
        <FontPickerModal
          isOpen={!!activePickerRole}
          roleName={activePickerRole}
          selectedFamily={activePickerRole === 'heading' ? headingFamily : bodyFamily}
          onClose={() => setActivePickerRole(null)}
          onSelectFont={font => {
            if (activePickerRole === 'heading') handleSelectHeading(font);
            else handleSelectBody(font);
          }}
          allowedScripts={project.tokens.meta.scripts}
        />
      )}
    </div>
  );
};
