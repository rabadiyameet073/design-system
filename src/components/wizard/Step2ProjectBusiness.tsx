import React, { useState } from 'react';
import {
  Sparkles,
  Globe,
  Users,
  Palette,
  Link2,
  Monitor,
  Code2,
  Moon,
  AlertCircle,
  Wand2,
  Check
} from 'lucide-react';
import { DesignProject } from '../../types/designSystem';
import { generateFullTypeScale } from '../../utils/typeScale';
import { getScriptMeta } from '../../preview/i18n/localizeContent';

interface Step2ProjectBusinessProps {
  project: DesignProject;
  onChange: (updated: Partial<DesignProject>) => void;
}

const AVAILABLE_SCRIPTS = [
  { id: 'latin', label: 'Latin (English, Spanish, French, German)' },
  { id: 'devanagari', label: 'Devanagari (Hindi, Marathi, Sanskrit)' },
  { id: 'gujarati', label: 'Gujarati (ગુજરાતી)' },
  { id: 'arabic', label: 'Arabic (العربية, Persian, Urdu)' },
  { id: 'cyrillic', label: 'Cyrillic (Russian, Ukrainian, Bulgarian)' }
];

type AgeRange = '18-35' | '35-50' | '50+';
type PlatformTarget = 'web' | 'web-app';
type FrameworkTarget = 'tailwind' | 'shadcn' | 'css';
type DarkModePolicy = 'auto' | 'manual' | 'none';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const Step2ProjectBusiness: React.FC<Step2ProjectBusinessProps> = ({ project, onChange }) => {
  const currentScripts: string[] = project.tokens?.meta?.scripts || ['latin'];
  const ageRange: AgeRange = (project.tokens?.meta?.audienceAge as AgeRange) || '18-35';
  const platform: PlatformTarget = (project.tokens?.meta?.platformTarget as PlatformTarget) || 'web';
  const framework: FrameworkTarget = (project.tokens?.meta?.frameworkTarget as FrameworkTarget) || 'tailwind';
  const darkModePref: DarkModePolicy = (project.tokens?.meta?.darkMode as DarkModePolicy) || 'auto';
  const inspirationUrls = (project.tokens?.meta?.inspirationUrls || []).join(', ');

  const projectName = project.business?.name || project.name || '';
  const currentSlug = project.tokens.meta.slug || '';
  const description = project.business?.offering || project.tokens.meta.description || '';

  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [urlValidationError, setUrlValidationError] = useState<string | null>(null);
  const [nameTouched, setNameTouched] = useState(false);

  const isNameEmpty = !projectName.trim();
  const showNameError = isNameEmpty && nameTouched;

  const handleNameChange = (newName: string) => {
    setNameTouched(true);
    const trimmed = newName.slice(0, 60);
    // If slug was empty or matched previous slugified name, keep it in sync
    const previousSlugCandidate = slugify(projectName);
    const shouldUpdateSlug = !currentSlug || currentSlug === previousSlugCandidate;
    const newSlug = shouldUpdateSlug ? slugify(trimmed) : currentSlug;

    onChange({
      name: trimmed,
      business: {
        ...project.business,
        name: trimmed
      },
      tokens: {
        ...project.tokens,
        meta: {
          ...project.tokens.meta,
          projectName: trimmed,
          slug: newSlug,
          updatedAt: Date.now()
        }
      }
    });
  };

  const handleSlugChange = (val: string) => {
    const cleanSlug = slugify(val);
    onChange({
      tokens: {
        ...project.tokens,
        meta: {
          ...project.tokens.meta,
          slug: cleanSlug
        }
      }
    });
  };

  const handleDescriptionChange = (val: string) => {
    const trimmed = val.slice(0, 180);
    onChange({
      business: {
        ...project.business,
        offering: trimmed
      },
      tokens: {
        ...project.tokens,
        meta: {
          ...project.tokens.meta,
          description: trimmed,
          updatedAt: Date.now()
        }
      }
    });
  };

  const handleInspirationUrlsChange = (raw: string) => {
    const urls = raw.split(',').map(s => s.trim()).filter(Boolean);
    // Lightweight validation check
    const invalidUrl = urls.find(u => !u.includes('.') || u.includes(' '));
    if (invalidUrl) {
      setUrlValidationError(`"${invalidUrl}" doesn't look like a valid domain (e.g. stripe.com)`);
    } else {
      setUrlValidationError(null);
    }

    onChange({
      tokens: {
        ...project.tokens,
        meta: {
          ...project.tokens.meta,
          inspirationUrls: urls
        }
      }
    });
  };

  const toggleScript = (scriptId: string) => {
    let nextScripts: string[];
    if (currentScripts.includes(scriptId)) {
      if (currentScripts.length === 1) return; // Keep at least one
      nextScripts = currentScripts.filter((s: string) => s !== scriptId);
    } else {
      nextScripts = [...currentScripts, scriptId];
    }

    // Determine active script: prefer the script just clicked/toggled, or first non-latin, or latin
    const activeScript = nextScripts.includes(scriptId)
      ? scriptId
      : (nextScripts.find(s => s !== 'latin') || nextScripts[0] || 'latin');

    const scriptMeta = getScriptMeta(activeScript);

    // Auto-update typography roles with native glyph support when non-latin script is selected
    const currentRoles = project.tokens.typography.roles;
    const updatedRoles = {
      ...currentRoles,
      ...(activeScript !== 'latin' && scriptMeta.fonts ? {
        display: currentRoles.display ? {
          ...currentRoles.display,
          family: scriptMeta.fonts.display,
          fallback: ['serif']
        } : {
          family: scriptMeta.fonts.display,
          fallback: ['serif'],
          weight: 700,
          lineHeight: 1.1,
          letterSpacing: '-0.02em'
        },
        heading: currentRoles.heading ? {
          ...currentRoles.heading,
          family: scriptMeta.fonts.heading,
          fallback: ['sans-serif']
        } : {
          family: scriptMeta.fonts.heading,
          fallback: ['sans-serif'],
          weight: 600,
          lineHeight: 1.25,
          letterSpacing: '-0.01em'
        },
        body: currentRoles.body ? {
          ...currentRoles.body,
          family: scriptMeta.fonts.body,
          fallback: ['sans-serif']
        } : {
          family: scriptMeta.fonts.body,
          fallback: ['sans-serif'],
          weight: 400,
          lineHeight: 1.5,
          letterSpacing: '0em'
        }
      } : {})
    };

    onChange({
      tokens: {
        ...project.tokens,
        meta: {
          ...project.tokens.meta,
          scripts: nextScripts,
          activeScript
        },
        typography: {
          ...project.tokens.typography,
          scripts: nextScripts,
          roles: updatedRoles
        }
      }
    });
  };

  const handleAgeRangeChange = (age: AgeRange) => {
    const newBasePx = age === '50+' ? 18 : 16;
    const newScale = generateFullTypeScale(
      newBasePx,
      project.tokens?.typography?.scaleRatio || 1.25,
      project.tokens?.typography?.fluid?.minVw || 360,
      project.tokens?.typography?.fluid?.maxVw || 1280
    );

    onChange({
      tokens: {
        ...project.tokens,
        meta: {
          ...project.tokens.meta,
          audienceAge: age
        },
        typography: {
          ...project.tokens.typography,
          baseSizePx: newBasePx,
          scale: newScale
        }
      }
    });
  };

  // AI-assisted context suggestion synthesizer
  const handleAiAutofill = () => {
    setIsAiGenerating(true);
    const genre = project.websiteType?.name || 'Ceramics Atelier';

    setTimeout(() => {
      let suggestedDesc = `Handcrafted, bespoke design crafted for modern architectural collectors.`;
      let suggestedAudience = `Design directors, architects, and discerning collectors`;
      let suggestedGoal = `High-Trust Direct Sales (E-Commerce)`;

      if (genre.toLowerCase().includes('saas') || genre.toLowerCase().includes('dev') || genre.toLowerCase().includes('api')) {
        suggestedDesc = `Developer-first infrastructure designed for fast, type-safe API operations and cloud scale.`;
        suggestedAudience = `Full-stack engineers, technical founders, and platform architects`;
        suggestedGoal = `SaaS Free Trial & Subscription Velocity`;
      } else if (genre.toLowerCase().includes('portfolio') || genre.toLowerCase().includes('agency')) {
        suggestedDesc = `Award-winning independent creative studio specializing in bespoke digital identities and motion.`;
        suggestedAudience = `Innovative brands, startup founders, and design leaders`;
        suggestedGoal = `Lead Generation & Studio Inquiries`;
      } else if (genre.toLowerCase().includes('magazine') || genre.toLowerCase().includes('press')) {
        suggestedDesc = `Critical commentary on contemporary visual arts, architecture, and industrial design.`;
        suggestedAudience = `Cultured intellectuals, editorial writers, and visual researchers`;
        suggestedGoal = `Editorial Authority & Newsletter Readership`;
      }

      onChange({
        business: {
          ...project.business,
          offering: suggestedDesc
        },
        businessDiscovery: {
          ...project.businessDiscovery,
          targetAudience: suggestedAudience,
          primaryOffering: suggestedGoal
        },
        tokens: {
          ...project.tokens,
          meta: {
            ...project.tokens.meta,
            description: suggestedDesc,
            audience: suggestedAudience,
            goal: suggestedGoal,
            updatedAt: Date.now()
          }
        }
      });
      setIsAiGenerating(false);
    }, 450);
  };

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-8">
      {/* Title */}
      <div className="space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 text-white text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Step 2 of 11 · Project Scope & Business Context</span>
          </div>

          <button
            type="button"
            onClick={handleAiAutofill}
            disabled={isAiGenerating}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-300 bg-white hover:bg-neutral-50 text-xs font-semibold text-neutral-800 transition-colors shadow-2xs cursor-pointer"
          >
            <Wand2 className={`w-3.5 h-3.5 text-amber-500 ${isAiGenerating ? 'animate-spin' : ''}`} />
            <span>{isAiGenerating ? 'Generating...' : 'AI Context Autofill'}</span>
          </button>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          Define your project scope and audience
        </h1>
        <p className="text-sm text-neutral-600 leading-relaxed max-w-2xl">
          Establish your brand name, core goals, and language scripts. Selecting audience age and brand assets will calibrate typography scale and extract starting palettes automatically.
        </p>
      </div>

      {/* Basic Project & Business Profile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs">
        {/* Project Name */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="project-name" className="text-xs font-bold text-neutral-700">
              Project / Brand Name <span className="text-rose-500">*</span>
            </label>
            <span className="text-[10px] font-mono text-neutral-400">
              {projectName.length}/60
            </span>
          </div>
          <input
            id="project-name"
            type="text"
            required
            maxLength={60}
            value={projectName}
            onChange={e => handleNameChange(e.target.value)}
            onBlur={() => setNameTouched(true)}
            aria-invalid={showNameError}
            aria-describedby={showNameError ? 'project-name-error' : undefined}
            placeholder="e.g. Maison Atelier"
            className={`w-full px-3.5 py-2 text-xs border rounded-lg focus:outline-none focus:ring-2 ${
              showNameError
                ? 'border-rose-400 focus:ring-rose-500 bg-rose-50/20'
                : 'border-neutral-300 focus:ring-neutral-900 bg-white'
            }`}
          />
          {showNameError && (
            <p
              id="project-name-error"
              role="alert"
              className="flex items-center gap-1 text-[11px] text-rose-500 font-medium"
            >
              <AlertCircle className="w-3 h-3" />
              <span>Required — enter a project name to continue.</span>
            </p>
          )}
        </div>

        {/* Slug */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-neutral-700">
              System Slug / Identifier
            </label>
            <span className="text-[10px] font-mono text-neutral-400">auto-generated</span>
          </div>
          <input
            type="text"
            value={currentSlug || 'maison-atelier'}
            onChange={e => handleSlugChange(e.target.value)}
            className="w-full px-3.5 py-2 text-xs font-mono border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 bg-white"
          />
        </div>

        {/* One-Line Description */}
        <div className="space-y-1.5 sm:col-span-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-neutral-700">One-Line Brand Description / Headline</label>
            <span className="text-[10px] font-mono text-neutral-400">
              {description.length}/180
            </span>
          </div>
          <input
            type="text"
            maxLength={180}
            value={description}
            onChange={e => handleDescriptionChange(e.target.value)}
            placeholder="e.g. Handcrafted architectural ceramics made from local stoneware clay."
            className="w-full px-3.5 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 bg-white"
          />
        </div>

        {/* Primary Business Goal */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-neutral-700">Primary Conversion Goal</label>
          <select
            value={project.businessDiscovery?.primaryOffering || project.tokens.meta.goal || 'High-Trust Direct Sales'}
            onChange={e => onChange({
              businessDiscovery: {
                ...project.businessDiscovery,
                primaryOffering: e.target.value
              },
              tokens: {
                ...project.tokens,
                meta: { ...project.tokens.meta, goal: e.target.value }
              }
            })}
            className="w-full px-3.5 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 bg-white"
          >
            <option>High-Trust Direct Sales (E-Commerce)</option>
            <option>Lead Generation & Studio Inquiries</option>
            <option>SaaS Free Trial & Subscription Velocity</option>
            <option>Editorial Authority & Newsletter Readership</option>
            <option>Course Enrollment & Academy Community</option>
          </select>
        </div>

        {/* Target Audience Profile */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-neutral-700">Target Audience Profile</label>
          <input
            type="text"
            value={project.businessDiscovery?.targetAudience || project.tokens.meta.audience || 'Design-conscious collectors & founders'}
            onChange={e => onChange({
              businessDiscovery: {
                ...project.businessDiscovery,
                targetAudience: e.target.value
              },
              tokens: {
                ...project.tokens,
                meta: { ...project.tokens.meta, audience: e.target.value }
              }
            })}
            className="w-full px-3.5 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 bg-white"
          />
        </div>
      </div>

      {/* Audience Age Range & Accessibility Nudge */}
      <div className="space-y-3 bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-neutral-700" />
          <h2 className="text-sm font-bold text-neutral-900">
            Target Audience Age Demographic
          </h2>
        </div>
        <p className="text-xs text-neutral-500">
          Selecting a mature age group automatically recalibrates body type size (18px) and targets higher contrast levels for comfortable readability.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {[
            { id: '18-35', label: '18–35 (Digital Native)', desc: 'Standard 16px body scale, balanced spacing.' },
            { id: '35-50', label: '35–50 (Established Buyers)', desc: 'Optimized 16px text with crisp contrast.' },
            { id: '50+', label: '50+ (High Readability)', desc: 'Auto-nudges base text to 18px & AAA contrast.' }
          ].map(item => {
            const isSelected = ageRange === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleAgeRangeChange(item.id as AgeRange)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                    : 'border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-800'
                }`}
              >
                <div className="text-xs font-bold">{item.label}</div>
                <div className={`text-[11px] mt-1 ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                  {item.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Visual & Color System Stage Info Banner */}
      <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center shrink-0 mt-0.5">
          <Palette className="w-5 h-5 text-amber-400" />
        </div>
        <div className="space-y-1">
          <div className="text-sm font-bold text-neutral-900">
            Dedicated Color Studio in Step 5
          </div>
          <p className="text-xs text-neutral-600 leading-relaxed">
            All color calibration takes place in <strong>Step 5 (Color Studio)</strong> with an interactive OKLCH color wheel, logo image upload, curated harmonic presets, AI mood prompts, and real-time WCAG 2.2 AA contrast verification. Next up: dial in your brand personality!
          </p>
        </div>
      </div>

      {/* Target Platform & Framework Targets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs">
        {/* Platform Target */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <Monitor className="w-3.5 h-3.5 text-neutral-700" />
            <label className="text-xs font-bold text-neutral-700">Platform Target</label>
          </div>
          <select
            value={platform}
            onChange={e => onChange({
              tokens: { ...project.tokens, meta: { ...project.tokens.meta, platformTarget: e.target.value as PlatformTarget } }
            })}
            className="w-full px-3.5 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 bg-white"
          >
            <option value="web">Web Only (Responsive Desktop/Mobile)</option>
            <option value="web-app">Web + Native App (Shared Design Tokens)</option>
          </select>
        </div>

        {/* Framework Target */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-neutral-700" />
            <label className="text-xs font-bold text-neutral-700">Framework Target</label>
          </div>
          <select
            value={framework}
            onChange={e => onChange({
              tokens: { ...project.tokens, meta: { ...project.tokens.meta, frameworkTarget: e.target.value as FrameworkTarget } }
            })}
            className="w-full px-3.5 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 bg-white"
          >
            <option value="tailwind">Tailwind CSS 4 (@theme inline)</option>
            <option value="shadcn">shadcn/ui CSS Variables</option>
            <option value="css">Plain CSS Custom Properties (:root)</option>
          </select>
        </div>

        {/* Dark Mode Preference */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <Moon className="w-3.5 h-3.5 text-neutral-700" />
            <label className="text-xs font-bold text-neutral-700">Dark Mode Policy</label>
          </div>
          <select
            value={darkModePref}
            onChange={e => onChange({
              tokens: { ...project.tokens, meta: { ...project.tokens.meta, darkMode: e.target.value as DarkModePolicy } }
            })}
            className="w-full px-3.5 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 bg-white"
          >
            <option value="auto">Auto (Light + Dark with System Sync)</option>
            <option value="manual">Always Light (Manual Toggle Only)</option>
            <option value="none">Light Only (No Dark Mode)</option>
          </select>
        </div>
      </div>

      {/* Inspiration URLs */}
      <div className="space-y-2 bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs">
        <div className="flex items-center gap-2">
          <Link2 className="w-4 h-4 text-neutral-700" />
          <h2 className="text-sm font-bold text-neutral-900">
            Inspiration Sites & Aesthetic References (Optional)
          </h2>
        </div>
        <p className="text-xs text-neutral-500">
          Enter 2–3 website URLs or brands whose design language you admire (e.g. stripe.com, apple.com, linear.app).
        </p>
        <input
          type="text"
          value={inspirationUrls}
          onChange={e => handleInspirationUrlsChange(e.target.value)}
          placeholder="e.g. stripe.com, linear.app, acorn.io"
          className={`w-full px-3.5 py-2 text-xs border rounded-lg focus:outline-none focus:ring-2 ${
            urlValidationError ? 'border-amber-400 focus:ring-amber-500' : 'border-neutral-300 focus:ring-neutral-900'
          }`}
        />
        {urlValidationError && (
          <p className="text-[11px] text-amber-600 font-medium">
            {urlValidationError}
          </p>
        )}
      </div>

      {/* Language Scripts Selection */}
      <div className="space-y-3 bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-neutral-700" />
          <h2 className="text-sm font-bold text-neutral-900">
            Writing Systems & Language Scripts Needed
          </h2>
        </div>
        <p className="text-xs text-neutral-500">
          Selecting multi-script languages filters font recommendations automatically so you never pick a font lacking glyphs for your users.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
          {AVAILABLE_SCRIPTS.map(script => {
            const isChecked = currentScripts.includes(script.id);
            return (
              <button
                key={script.id}
                type="button"
                role="checkbox"
                aria-checked={isChecked}
                onClick={() => toggleScript(script.id)}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all text-left ${
                  isChecked
                    ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                    : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-800'
                }`}
              >
                <span className="text-xs font-medium">{script.label}</span>
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                    isChecked
                      ? 'bg-blue-600 text-white'
                      : 'border border-neutral-300 bg-white'
                  }`}
                >
                  {isChecked && (
                    <svg className="w-2.5 h-2.5 text-white stroke-[3]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
