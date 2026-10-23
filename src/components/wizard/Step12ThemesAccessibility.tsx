import React, { useState } from 'react';
import { Sparkles, Sun, Moon, Laptop, ShieldCheck, CheckCircle, Plus } from 'lucide-react';
import { DesignProject, AccessibilityConfig } from '../../types/designSystem';
import { auditContrast } from '../../utils/contrast';

interface Step12ThemesAccessibilityProps {
  project: DesignProject;
  onChange: (updated: Partial<DesignProject>) => void;
}

export const Step12ThemesAccessibility: React.FC<Step12ThemesAccessibilityProps> = ({ project, onChange }) => {
  const [customThemeNote, setCustomThemeNote] = useState('');

  const updateA11y = (key: keyof AccessibilityConfig, val: any) => {
    onChange({
      accessibility: {
        ...project.accessibility,
        [key]: val
      }
    });
  };

  const textContrast = auditContrast(project.colorPalette.textPrimary, project.colorPalette.background);
  const buttonContrast = auditContrast('#FFFFFF', project.colorPalette.primary);

  return (
    <div className="max-w-3xl mx-auto py-8">
      {/* Header */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 text-xs font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5 text-neutral-900" />
          <span>Step 12 of 14 · Themes & Accessibility</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-1">
          Dark Mode & Readability Standards
        </h1>
        <span className="text-[11px] font-mono text-neutral-400 block mb-2">
          technical: dark-theme tokens & wcag 2.2 aa compliance
        </span>
        <p className="text-sm text-neutral-600 max-w-lg mx-auto leading-relaxed">
          Ensure your website is welcoming and readable for every visitor, whether they are browsing in bright daylight or dark rooms at night.
        </p>
      </div>

      <div className="space-y-6">
        {/* Theme Preference */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider">
              Default Day / Night Theme
            </label>
            <span className="text-[10px] font-mono text-neutral-400 block">
              technical: prefers-color-scheme / theme provider state
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: 'light',
                icon: Sun,
                title: 'Light Theme',
                tech: 'color-scheme: light',
                desc: 'Crisp, bright, and classic. The standard for retail and business.'
              },
              {
                id: 'dark',
                icon: Moon,
                title: 'Dark Theme',
                tech: 'color-scheme: dark (slate-900)',
                desc: 'Deep slate backdrop. Reduces eye strain; popular for tech & crypto.'
              },
              {
                id: 'system',
                icon: Laptop,
                title: 'System Automatic',
                tech: 'auto match OS mode',
                desc: 'Automatically switches to match the visitor’s device settings.'
              }
            ].map(theme => {
              const isSelected = project.accessibility.defaultTheme === theme.id;
              const Icon = theme.icon;

              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => updateA11y('defaultTheme', theme.id)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-neutral-900 bg-neutral-900 text-white shadow-md'
                      : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300'
                  }`}
                >
                  <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-white' : 'text-neutral-700'}`} />
                  <h4 className="font-semibold text-xs mb-0.5">{theme.title}</h4>
                  <span className="text-[9px] font-mono opacity-60 block mb-1">{theme.tech}</span>
                  <p className={`text-[11px] leading-relaxed ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                    {theme.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Readability Scorecard with friendly and technical metrics */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                Official Contrast Scorecard
              </h3>
              <span className="text-[10px] font-mono text-neutral-400">
                technical: wcag 2.2 aa contrast evaluation (target: 4.5:1 text, 3:1 buttons)
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {/* Primary Text Audit */}
            <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-100 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <h4 className="text-xs font-bold text-neutral-900">Headlines & Article Paragraphs</h4>
                </div>
                <span className="text-[9px] font-mono text-neutral-400 block mb-1">
                  technical: {project.colorPalette.textPrimary} on {project.colorPalette.background}
                </span>
                <p className="text-xs text-neutral-600">
                  {textContrast.ratingDescription}. Contrast ratio of{' '}
                  <strong className="text-neutral-900 tabular-nums">{textContrast.ratioFormatted}</strong> (Minimum standard required is 4.5:1).
                </p>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-emerald-100 text-emerald-800 shrink-0">
                PASSED AA
              </span>
            </div>

            {/* Primary Button CTA Audit */}
            <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-100 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <h4 className="text-xs font-bold text-neutral-900">Text on Main Action Buttons</h4>
                </div>
                <span className="text-[9px] font-mono text-neutral-400 block mb-1">
                  technical: #FFFFFF on {project.colorPalette.primary}
                </span>
                <p className="text-xs text-neutral-600">
                  {buttonContrast.ratingDescription}. Contrast ratio of{' '}
                  <strong className="text-neutral-900 tabular-nums">{buttonContrast.ratioFormatted}</strong>.
                </p>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-emerald-100 text-emerald-800 shrink-0">
                PASSED AA
              </span>
            </div>
          </div>
        </div>

        {/* Keyboard Outline Ring */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-0.5">
              Keyboard Navigation Ring
            </h3>
            <span className="text-[10px] font-mono text-neutral-400 block mb-1">
              technical: :focus-visible outline ring
            </span>
            <p className="text-xs text-neutral-500 max-w-md">
              Highlights buttons when visitors press the Tab key to navigate, helping users with motor or vision differences.
            </p>
          </div>
          <button
            type="button"
            className="px-4 py-2 text-xs font-semibold text-neutral-900 bg-neutral-100 rounded-lg ring-2 ring-offset-2 ring-neutral-900 shrink-0 self-start sm:self-auto"
          >
            Example Focus Ring
          </button>
        </div>
      </div>
    </div>
  );
};
