import React, { useState } from 'react';
import {
  Sparkles,
  Image as ImageIcon,
  Check,
  Upload,
  Zap,
  Activity,
  Layers,
  Sparkle,
  Compass,
  Boxes
} from 'lucide-react';
import { DesignProject } from '../../types/designSystem';

interface Step8ImageryStudioProps {
  project: DesignProject;
  onChange: (updated: Partial<DesignProject>) => void;
  onPreviewDraft?: (draft: Partial<DesignProject>, label: string) => void;
  onClearDraft?: () => void;
}

export const Step8ImageryStudio: React.FC<Step8ImageryStudioProps> = ({
  project,
  onChange,
  onPreviewDraft,
  onClearDraft
}) => {
  const currentTreatment = project.tokens?.imagery?.treatment || 'natural';
  const currentIconLib = project.tokens?.icon?.library || 'lucide';
  const currentIconStyle = project.tokens?.icon?.style || 'outline';
  const currentMotionLevel = project.tokens?.motion?.level || 'subtle';

  const handleTreatmentChange = (treatment: 'natural' | 'duotone' | 'mono') => {
    onChange({
      tokens: {
        ...project.tokens,
        imagery: {
          ...project.tokens.imagery,
          treatment
        }
      }
    });
  };

  const handleIconLibChange = (library: 'lucide' | 'phosphor' | 'tabler') => {
    onChange({
      tokens: {
        ...project.tokens,
        icon: {
          ...project.tokens.icon,
          library
        }
      }
    });
  };

  const handleIconStyleChange = (style: 'outline' | 'filled' | 'duotone') => {
    onChange({
      tokens: {
        ...project.tokens,
        icon: {
          ...project.tokens.icon,
          style,
          strokeWidth: style === 'outline' ? 2 : 1.5
        }
      }
    });
  };

  const handleMotionLevelChange = (level: 'none' | 'subtle' | 'expressive') => {
    const duration =
      level === 'none'
        ? { fast: 0, base: 0, slow: 0 }
        : level === 'subtle'
        ? { fast: 120, base: 200, slow: 320 }
        : { fast: 150, base: 280, slow: 450 };

    onChange({
      tokens: {
        ...project.tokens,
        motion: {
          ...project.tokens.motion,
          level,
          duration
        }
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 text-white text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Step 9 of 11 · Imagery, Icons & Motion Physics</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          Visual asset treatment, icon style & animation physics
        </h1>
        <p className="text-sm text-neutral-600 leading-relaxed max-w-2xl">
          Define how hero imagery, iconography, and spring physics behave across the system. Motion settings automatically respect the user's system reduced-motion preferences.
        </p>
      </div>

      {/* 1. Motion Physics Level */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Motion & Micro-Interaction Physics</span>
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Controls spring stiffness, transition timing, and micro-hover tactile feedback.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-full">
            Level: {currentMotionLevel.toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              id: 'none',
              label: 'None (Instant 0ms)',
              tech: 'prefers-reduced-motion',
              desc: 'Instant transitions without spatial movement. Pure accessibility & low-power efficiency.'
            },
            {
              id: 'subtle',
              label: 'Subtle (120–320ms)',
              tech: 'cubic-bezier(.2,0,0,1)',
              desc: 'Smooth, understated ease curves. Crisp, professional and calm.'
            },
            {
              id: 'expressive',
              label: 'Expressive (Spring Physics)',
              tech: 'stiffness: 280, damping: 22',
              desc: 'Tactile organic springs on cards and buttons. Luxury editorial character.'
            }
          ].map(m => {
            const isSelected = currentMotionLevel === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => handleMotionLevelChange(m.id as any)}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                    : 'border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-800'
                }`}
              >
                <div className="text-xs font-bold mb-0.5">{m.label}</div>
                <div className="font-mono text-[10px] opacity-60 mb-1.5">{m.tech}</div>
                <p className={`text-[11px] leading-relaxed ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                  {m.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Icon System: Library & Style */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs space-y-6">
        <div>
          <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
            <Boxes className="w-4 h-4 text-neutral-700" />
            <span>Iconography Engine</span>
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Consistent iconography style across navigation, features, and cards.
          </p>
        </div>

        {/* Library Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">
            Icon Set Family
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'lucide', label: 'Lucide Icons', desc: 'Crisp, 24px grid, default modern standard.' },
              { id: 'phosphor', label: 'Phosphor Icons', desc: 'Versatile, geometric curves, multiple weights.' },
              { id: 'tabler', label: 'Tabler Icons', desc: 'Generous strokes, highly consistent open source.' }
            ].map(lib => {
              const isSelected = currentIconLib === lib.id;
              return (
                <button
                  key={lib.id}
                  type="button"
                  onClick={() => handleIconLibChange(lib.id as any)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                      : 'border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-800'
                  }`}
                >
                  <div className="text-xs font-bold">{lib.label}</div>
                  <div className={`text-[11px] mt-0.5 ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                    {lib.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Icon Style */}
        <div className="space-y-2 pt-2 border-t border-neutral-100">
          <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">
            Icon Render Style
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'outline', label: 'Clean Outline (Line)', desc: '1.75px vector stroke outline.' },
              { id: 'filled', label: 'Solid Filled (Silhouette)', desc: 'High visual weight, opaque filled silhouette.' },
              { id: 'duotone', label: 'Duotone (Two-Tone)', desc: 'Layered primary stroke with translucent fill.' }
            ].map(st => {
              const isSelected = currentIconStyle === st.id;
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => handleIconStyleChange(st.id as any)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                      : 'border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-800'
                  }`}
                >
                  <div className="text-xs font-bold">{st.label}</div>
                  <div className={`text-[11px] mt-0.5 ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                    {st.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Imagery Treatment */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-neutral-700" />
            <span>Photography & Image Treatment</span>
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Color grading and texture overlays applied to hero banners and card photos.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              id: 'natural',
              label: 'Natural Daylight',
              desc: 'True-to-life colors, clean documentary lighting, and crisp highlights.'
            },
            {
              id: 'duotone',
              label: 'Brand-Tinted Duotone',
              desc: 'Infuses shadows with brand hue and highlights with light tints.'
            },
            {
              id: 'mono',
              label: 'Architectural Monochrome',
              desc: 'High-contrast black & white with delicate micro-grain overlay.'
            }
          ].map(t => {
            const isSelected = currentTreatment === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => handleTreatmentChange(t.id as any)}
                onMouseEnter={() => {
                  if (onPreviewDraft) {
                    onPreviewDraft({
                      tokens: {
                        ...project.tokens,
                        imagery: {
                          ...project.tokens.imagery,
                          treatment: t.id as any
                        }
                      }
                    }, t.label);
                  }
                }}
                onMouseLeave={() => onClearDraft && onClearDraft()}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                    : 'border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-800'
                }`}
              >
                <div className="text-xs font-bold mb-1">{t.label}</div>
                <p className={`text-[11px] leading-relaxed ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                  {t.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
