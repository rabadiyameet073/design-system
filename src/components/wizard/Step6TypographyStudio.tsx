import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Sliders,
  Type,
  Check,
  ChevronRight,
  AlertTriangle,
  Info,
  ShieldAlert,
  Code2,
  Quote,
  Layers,
  ArrowRight
} from 'lucide-react';
import { DesignProject } from '../../types/designSystem';
import { FontPickerModal } from './FontPickerModal';
import {
  FontMeta,
  getRecommendedBodyFonts,
  generateFullTypeScale
} from '../../utils/typeScale';
import { auditTypographyTokens } from '../../tokens/typographyGuardrails';
import { FontRole, RoleStyle } from '../../tokens/types';
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
  const [activePickerRole, setActivePickerRole] = useState<FontRole | null>(null);

  const typography = project.tokens.typography;
  const headingFamily = typography.roles.heading?.family || 'Fraunces';
  const bodyFamily = typography.roles.body?.family || 'DM Sans';
  const monoFamily = typography.roles.mono?.family || 'JetBrains Mono';
  const accentFamily = typography.roles.accent?.family || 'Instrument Serif';
  const hasMono = !!typography.roles.mono;
  const hasAccent = !!typography.roles.accent;

  const currentRatio = typography.scaleRatio || 1.25;
  const baseSize = typography.baseSizePx || 16;

  const allFonts = fontsSnapshot as unknown as FontMeta[];
  const fontsMetaMap = useMemo(() => {
    const map = new Map<string, FontMeta>();
    allFonts.forEach(f => map.set(f.family, f));
    return map;
  }, [allFonts]);

  // Current heading font meta
  const currentHeadingMeta = fontsMetaMap.get(headingFamily) || {
    family: headingFamily,
    category: 'serif',
    variants: ['400', '600', '700'],
    subsets: ['latin'],
    variable: true,
    source: 'google'
  };

  // Recommended body fonts filtered by required scripts
  const recommendedBodies = useMemo(() => {
    return getRecommendedBodyFonts(
      currentHeadingMeta as FontMeta,
      allFonts,
      project.tokens.meta.category ? [project.tokens.meta.category] : ['modern', 'editorial'],
      project.tokens.meta.scripts || ['latin']
    );
  }, [currentHeadingMeta, allFonts, project.tokens.meta.category, project.tokens.meta.scripts]);

  // Run guardrails audit (Doc 03 §8)
  const auditResult = useMemo(() => {
    return auditTypographyTokens(typography, fontsMetaMap);
  }, [typography, fontsMetaMap]);

  // Real-time hover preview on template (Doc 03 §5: "hover = preview in the site")
  const handleHoverFont = (font: FontMeta) => {
    if (!onPreviewDraft || !activePickerRole) return;
    const fallback =
      activePickerRole === 'mono'
        ? ['ui-monospace', 'monospace']
        : font.category === 'serif'
        ? ['ui-serif', 'Georgia', 'serif']
        : ['ui-sans-serif', 'system-ui', 'sans-serif'];

    const draftRoles = { ...typography.roles };
    if (activePickerRole === 'heading') {
      draftRoles.heading = {
        family: font.family,
        fallback,
        weight: 600,
        lineHeight: 1.15,
        letterSpacing: '-0.02em'
      };
      draftRoles.display = {
        family: font.family,
        fallback,
        weight: 700,
        lineHeight: 1.08,
        letterSpacing: '-0.03em'
      };
    } else if (activePickerRole === 'body') {
      draftRoles.body = {
        family: font.family,
        fallback,
        weight: 400,
        lineHeight: 1.6,
        letterSpacing: '0em'
      };
      draftRoles.ui = {
        family: font.family,
        fallback: ['ui-sans-serif', 'system-ui', 'sans-serif'],
        weight: 500,
        lineHeight: 1.25,
        letterSpacing: '0.01em'
      };
    } else {
      const existing = draftRoles[activePickerRole] || {
        weight: 400,
        lineHeight: 1.5,
        letterSpacing: '0em'
      };
      draftRoles[activePickerRole] = {
        ...existing,
        family: font.family,
        fallback
      };
    }

    onPreviewDraft(
      {
        tokens: {
          ...project.tokens,
          typography: {
            ...project.tokens.typography,
            roles: draftRoles
          }
        }
      },
      `Previewing: ${font.family}`
    );
  };

  const handleClearHover = () => {
    if (onClearDraft) onClearDraft();
  };

  const handleSelectHeading = (font: FontMeta) => {
    if (onClearDraft) onClearDraft();
    const fallback = font.category === 'serif' ? ['ui-serif', 'Georgia', 'serif'] : ['ui-sans-serif', 'system-ui', 'sans-serif'];
    const updatedRoles = {
      ...typography.roles,
      heading: {
        family: font.family,
        fallback,
        weight: 600,
        lineHeight: 1.15,
        letterSpacing: '-0.02em'
      },
      display: {
        family: font.family,
        fallback,
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
    if (onClearDraft) onClearDraft();
    const fallback = font.category === 'serif' ? ['ui-serif', 'Georgia', 'serif'] : ['ui-sans-serif', 'system-ui', 'sans-serif'];
    const updatedRoles = {
      ...typography.roles,
      body: {
        family: font.family,
        fallback,
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

  const handleSelectGenericRole = (role: FontRole, font: FontMeta) => {
    if (onClearDraft) onClearDraft();
    const fallback =
      role === 'mono'
        ? ['ui-monospace', 'monospace']
        : font.category === 'serif'
        ? ['ui-serif', 'Georgia', 'serif']
        : ['ui-sans-serif', 'system-ui', 'sans-serif'];

    const existing = typography.roles[role] || {
      weight: 400,
      lineHeight: 1.5,
      letterSpacing: '0em'
    };

    const updatedRoles = {
      ...typography.roles,
      [role]: {
        ...existing,
        family: font.family,
        fallback
      }
    };

    onChange({
      tokens: {
        ...project.tokens,
        typography: {
          ...project.tokens.typography,
          roles: updatedRoles
        }
      }
    });
  };

  const handleToggleMono = (enabled: boolean) => {
    const nextRoles = { ...typography.roles };
    if (enabled) {
      nextRoles.mono = {
        family: 'JetBrains Mono',
        fallback: ['ui-monospace', 'monospace'],
        weight: 400,
        lineHeight: 1.5,
        letterSpacing: '0em'
      };
    } else {
      nextRoles.mono = null;
    }

    onChange({
      tokens: {
        ...project.tokens,
        typography: {
          ...project.tokens.typography,
          roles: nextRoles
        }
      }
    });
  };

  const handleToggleAccent = (enabled: boolean) => {
    const nextRoles = { ...typography.roles };
    if (enabled) {
      nextRoles.accent = {
        family: 'Instrument Serif',
        fallback: ['Georgia', 'serif'],
        weight: 400,
        lineHeight: 1.2,
        letterSpacing: '0em'
      };
    } else {
      nextRoles.accent = null;
    }

    onChange({
      tokens: {
        ...project.tokens,
        typography: {
          ...project.tokens.typography,
          roles: nextRoles
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

  const handleRoleStyleChange = (role: FontRole, key: keyof RoleStyle, val: any) => {
    const current = typography.roles[role];
    if (!current) return;

    const nextRoles = {
      ...typography.roles,
      [role]: {
        ...current,
        [key]: val
      }
    };

    onChange({
      tokens: {
        ...project.tokens,
        typography: {
          ...project.tokens.typography,
          roles: nextRoles
        }
      }
    });
  };

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
          Assign families to semantic roles (heading, body, ui, mono, accent). Studio verifies script compatibility and evaluates payload budgets against production guardrails.
        </p>
      </div>

      {/* Mode Switcher: Pair Mode vs Advanced Mode */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-neutral-200">
        <div className="flex items-center gap-2 bg-neutral-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setMode('pair')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              mode === 'pair' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Pair Mode (Curated)
          </button>
          <button
            type="button"
            onClick={() => setMode('advanced')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              mode === 'advanced' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Advanced (Per-Role)
          </button>
        </div>

        {/* Performance budget badge (Doc 03 §5: Performance: 2 families • 5 files • ~74 KB ✅) */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-neutral-700">
            Performance: <span className="font-bold">{auditResult.totalFamiliesCount}</span> {auditResult.totalFamiliesCount === 1 ? 'family' : 'families'} • <span className="font-bold">{auditResult.totalFontFiles}</span> files • <span className="font-bold">≈ {auditResult.estimatedPayloadKb} KB</span>
          </span>
          <span
            className={`px-2 py-0.5 rounded-full font-bold ${
              auditResult.issues.filter(i => i.severity === 'error' || i.severity === 'warning').length === 0
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {auditResult.issues.filter(i => i.severity === 'error' || i.severity === 'warning').length === 0 ? 'Budget OK ✅' : 'Review Warnings ⚠️'}
          </span>
        </div>
      </div>

      {/* Typography Guardrails Notice Banner (Doc 03 §8) */}
      {auditResult.issues.length > 0 && (
        <div className="space-y-2">
          {auditResult.issues.map(issue => (
            <div
              key={issue.id}
              className={`p-3.5 rounded-xl border flex items-start gap-3 text-xs ${
                issue.severity === 'error'
                  ? 'bg-rose-50 border-rose-200 text-rose-900'
                  : issue.severity === 'warning'
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-neutral-50 border-neutral-200 text-neutral-800'
              }`}
            >
              {issue.severity === 'error' ? (
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              ) : issue.severity === 'warning' ? (
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              ) : (
                <Info className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-semibold">{issue.message}</p>
                {issue.recommendation && (
                  <p className="text-[11px] opacity-80 mt-0.5">{issue.recommendation}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PAIR MODE WORKBENCH */}
      {mode === 'pair' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Heading Font Card */}
            <div className="p-5 rounded-2xl border border-neutral-200 bg-white shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase font-bold text-neutral-500">
                  Role: Heading (Display & H1–H4)
                </span>
                <button
                  type="button"
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
                <div className="text-2xl font-bold text-neutral-900" style={{ fontFamily: headingFamily }}>
                  {headingFamily}
                </div>
                <div className="text-xs text-neutral-500 font-mono">
                  Weights: 500, 600, 700 · Display & H1–H4
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
                  type="button"
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
                <div className="text-2xl font-bold text-neutral-900" style={{ fontFamily: bodyFamily }}>
                  {bodyFamily}
                </div>
                <div className="text-xs text-neutral-500 font-mono">
                  Weights: 400 (Regular), 600 (Semibold)
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Body Pairings Bar (Doc 03 §6) */}
          <div className="space-y-3 bg-neutral-50 p-5 rounded-2xl border border-neutral-200">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-neutral-800">
                Recommended Body Pairings for {headingFamily}
              </div>
              <span className="text-[11px] font-mono text-neutral-500">Scored via contrast & legibility math</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {recommendedBodies.map(font => {
                const isSelected = bodyFamily === font.family;
                return (
                  <button
                    key={font.family}
                    type="button"
                    onClick={() => handleSelectBody(font)}
                    onMouseEnter={() => {
                      if (onPreviewDraft) {
                        onPreviewDraft({
                          tokens: {
                            ...project.tokens,
                            typography: {
                              ...project.tokens.typography,
                              roles: {
                                ...project.tokens.typography.roles,
                                body: {
                                  family: font.family,
                                  fallback: ['system-ui', 'sans-serif'],
                                  weight: 400,
                                  lineHeight: 1.6,
                                  letterSpacing: '0em'
                                },
                                ui: {
                                  family: font.family,
                                  fallback: ['system-ui', 'sans-serif'],
                                  weight: 500,
                                  lineHeight: 1.25,
                                  letterSpacing: '0.01em'
                                }
                              }
                            }
                          }
                        }, `${headingFamily} + ${font.family}`);
                      }
                    }}
                    onMouseLeave={() => onClearDraft && onClearDraft()}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
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

          {/* Optional Monospace & Accent Font Toggles (Doc 03 §1 & §5) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Monospace Toggle */}
            <div className="p-4 rounded-2xl border border-neutral-200 bg-white shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-neutral-700" />
                  <span className="text-xs font-bold text-neutral-900">Monospace Font</span>
                </div>
                <input
                  type="checkbox"
                  checked={hasMono}
                  onChange={e => handleToggleMono(e.target.checked)}
                  className="rounded text-neutral-900 focus:ring-0 cursor-pointer"
                />
              </div>
              <p className="text-[11px] text-neutral-500">
                For data metrics, code snippets, and terminal blocks (e.g. JetBrains Mono).
              </p>
              {hasMono && (
                <div
                  onClick={() => setActivePickerRole('mono')}
                  className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200 text-xs font-mono cursor-pointer hover:bg-neutral-100 flex items-center justify-between"
                >
                  <span>{monoFamily}</span>
                  <span className="text-[10px] text-neutral-400">Change ▾</span>
                </div>
              )}
            </div>

            {/* Accent Font Toggle */}
            <div className="p-4 rounded-2xl border border-neutral-200 bg-white shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Quote className="w-4 h-4 text-neutral-700" />
                  <span className="text-xs font-bold text-neutral-900">Accent Font</span>
                </div>
                <input
                  type="checkbox"
                  checked={hasAccent}
                  onChange={e => handleToggleAccent(e.target.checked)}
                  className="rounded text-neutral-900 focus:ring-0 cursor-pointer"
                />
              </div>
              <p className="text-[11px] text-neutral-500">
                For pulling quotes, signature taglines, or editorial accents (e.g. Instrument Serif).
              </p>
              {hasAccent && (
                <div
                  onClick={() => setActivePickerRole('accent')}
                  className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200 text-xs font-serif italic cursor-pointer hover:bg-neutral-100 flex items-center justify-between"
                >
                  <span>{accentFamily}</span>
                  <span className="text-[10px] text-neutral-400 font-sans not-italic">Change ▾</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ADVANCED PER-ROLE WORKBENCH (Doc 03 §1 & §5) */}
      {mode === 'advanced' && (
        <div className="space-y-4">
          <div className="text-xs text-neutral-500">
            Configure typography properties independently for all 6 functional roles.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(['display', 'heading', 'body', 'ui', 'mono', 'accent'] as FontRole[]).map(role => {
              const roleStyle = typography.roles[role];
              const isEnabled = !!roleStyle;

              return (
                <div
                  key={role}
                  className={`p-5 rounded-2xl border transition-all ${
                    isEnabled ? 'bg-white border-neutral-200 shadow-xs' : 'bg-neutral-50/70 border-neutral-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-700 font-mono">
                      Role: {role}
                    </span>
                    <button
                      type="button"
                      onClick={() => setActivePickerRole(role)}
                      className="text-xs font-bold text-neutral-900 hover:underline cursor-pointer"
                    >
                      {roleStyle ? 'Change Family ▾' : 'Assign Font ▾'}
                    </button>
                  </div>

                  {roleStyle ? (
                    <div className="space-y-3">
                      <div className="font-bold text-base text-neutral-900 truncate" style={{ fontFamily: roleStyle.family }}>
                        {roleStyle.family}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <label className="text-[10px] text-neutral-400 uppercase font-mono block">Weight</label>
                          <select
                            value={roleStyle.weight}
                            onChange={e => handleRoleStyleChange(role, 'weight', parseInt(e.target.value, 10))}
                            className="w-full px-2 py-1 text-xs border border-neutral-200 rounded bg-white"
                          >
                            <option value={400}>400 (Regular)</option>
                            <option value={500}>500 (Medium)</option>
                            <option value={600}>600 (Semibold)</option>
                            <option value={700}>700 (Bold)</option>
                            <option value={800}>800 (Extra Bold)</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] text-neutral-400 uppercase font-mono block">Line Height</label>
                          <input
                            type="number"
                            step="0.05"
                            min="1.0"
                            max="2.0"
                            value={roleStyle.lineHeight}
                            onChange={e => handleRoleStyleChange(role, 'lineHeight', parseFloat(e.target.value))}
                            className="w-full px-2 py-1 text-xs border border-neutral-200 rounded bg-white font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-neutral-400 italic">Role currently unassigned.</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

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
                type="button"
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
        </div>
      </div>

      {/* Font Picker Modal with real-time hover-to-preview per Doc 03 §5 */}
      {activePickerRole && (
        <FontPickerModal
          isOpen={!!activePickerRole}
          roleName={activePickerRole}
          selectedFamily={
            activePickerRole === 'heading'
              ? headingFamily
              : activePickerRole === 'body'
              ? bodyFamily
              : activePickerRole === 'mono'
              ? monoFamily
              : activePickerRole === 'accent'
              ? accentFamily
              : (typography.roles[activePickerRole]?.family || headingFamily)
          }
          onClose={() => {
            handleClearHover();
            setActivePickerRole(null);
          }}
          onHoverFont={handleHoverFont}
          onClearHover={handleClearHover}
          onSelectFont={font => {
            handleClearHover();
            if (activePickerRole === 'heading') handleSelectHeading(font);
            else if (activePickerRole === 'body') handleSelectBody(font);
            else handleSelectGenericRole(activePickerRole, font);
          }}
          allowedScripts={project.tokens.meta.scripts}
        />
      )}
    </div>
  );
};
