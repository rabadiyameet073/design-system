import React, { useState } from 'react';
import {
  Sparkles,
  Globe,
  Target,
  Users,
  Shield,
  Layers,
  Palette,
  Upload,
  Link2,
  Monitor,
  Code2,
  Moon
} from 'lucide-react';
import { DesignProject } from '../../types/designSystem';
import { extractDominantColorFromImage } from '../../utils/imageColorExtractor';
import { generateAllColorPrimitives } from '../../tokens/colorScale';
import { createLightSemanticColors, createDarkSemanticColors } from '../../tokens/semanticMapping';
import { generateFullTypeScale } from '../../utils/typeScale';

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

export const Step2ProjectBusiness: React.FC<Step2ProjectBusinessProps> = ({ project, onChange }) => {
  const [isExtractingColor, setIsExtractingColor] = useState(false);
  const currentScripts: string[] = project.tokens?.meta?.scripts || ['latin'];
  const brandColor = project.tokens?.meta?.brandColorHex || project.colorPalette?.primary || '#B7410E';
  const ageRange = project.tokens?.meta?.audienceAge || '18-35';
  const platform = project.tokens?.meta?.platformTarget || 'web';
  const framework = project.tokens?.meta?.frameworkTarget || 'tailwind';
  const darkModePref = project.tokens?.meta?.darkMode || 'auto';
  const inspirationUrls = (project.tokens?.meta?.inspirationUrls || []).join(', ');

  const toggleScript = (scriptId: string) => {
    let nextScripts: string[];
    if (currentScripts.includes(scriptId)) {
      if (currentScripts.length === 1) return; // Keep at least one
      nextScripts = currentScripts.filter((s: string) => s !== scriptId);
    } else {
      nextScripts = [...currentScripts, scriptId];
    }

    onChange({
      tokens: {
        ...project.tokens,
        meta: {
          ...project.tokens.meta,
          scripts: nextScripts
        },
        typography: {
          ...project.tokens.typography,
          scripts: nextScripts
        }
      }
    });
  };

  const handleAgeRangeChange = (age: '18-35' | '35-50' | '50+') => {
    // Older audiences (50+) receive 18px base text size to guarantee high readability and comfort
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
          scale: newScale as any
        }
      }
    });
  };

  const handleBrandColorChange = (newHex: string) => {
    const primitives = generateAllColorPrimitives(newHex);
    const light = createLightSemanticColors(primitives);
    const dark = createDarkSemanticColors(primitives);

    onChange({
      colorPalette: {
        ...project.colorPalette,
        primary: newHex
      },
      tokens: {
        ...project.tokens,
        meta: {
          ...project.tokens.meta,
          brandColorHex: newHex
        },
        color: {
          primitives,
          semantic: { light, dark }
        }
      }
    });
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsExtractingColor(true);
      const extractedHex = await extractDominantColorFromImage(file);
      handleBrandColorChange(extractedHex);
    } catch (err) {
      console.warn('Logo color extraction error:', err);
    } finally {
      setIsExtractingColor(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-8">
      {/* Title */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 text-white text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Step 2 of 11 · Project Scope & Business Context</span>
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
          <label className="text-xs font-bold text-neutral-700">Project / Brand Name</label>
          <input
            type="text"
            value={project.name}
            onChange={e => onChange({ name: e.target.value, tokens: { ...project.tokens, meta: { ...project.tokens.meta, projectName: e.target.value } } })}
            placeholder="e.g. Maison Atelier"
            className="w-full px-3.5 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
          />
        </div>

        {/* Slug */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-neutral-700">System Slug / Identifier</label>
          <input
            type="text"
            value={project.tokens.meta.slug || 'maison-atelier'}
            onChange={e => onChange({ tokens: { ...project.tokens, meta: { ...project.tokens.meta, slug: e.target.value } } })}
            className="w-full px-3.5 py-2 text-xs font-mono border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
          />
        </div>

        {/* One-Line Description */}
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-xs font-bold text-neutral-700">One-Line Brand Description</label>
          <input
            type="text"
            value={project.tokens.meta.description || project.business?.offering || ''}
            onChange={e => onChange({
              tokens: { ...project.tokens, meta: { ...project.tokens.meta, description: e.target.value } }
            })}
            placeholder="e.g. Handcrafted architectural ceramics made from local stoneware clay."
            className="w-full px-3.5 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
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
            className="w-full px-3.5 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
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
                onClick={() => handleAgeRangeChange(item.id as any)}
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

      {/* Brand Color Input & Logo Upload with Extraction */}
      <div className="space-y-4 bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-neutral-700" />
          <h2 className="text-sm font-bold text-neutral-900">
            Existing Brand Color or Logo Upload
          </h2>
        </div>
        <p className="text-xs text-neutral-500">
          Have an existing brand color or company logo? Enter your exact hex code or upload your logo image to extract your signature color instantly.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Hex Input */}
          <div className="flex items-center gap-3 p-3 rounded-xl border border-neutral-200 bg-neutral-50">
            <input
              type="color"
              value={brandColor}
              onChange={e => handleBrandColorChange(e.target.value)}
              className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent p-0"
              title="Pick brand color"
            />
            <div className="flex-1 min-w-0">
              <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider block">
                Brand Hex Code
              </label>
              <input
                type="text"
                value={brandColor}
                onChange={e => handleBrandColorChange(e.target.value)}
                className="w-full font-mono text-xs font-bold text-neutral-900 bg-transparent focus:outline-none"
              />
            </div>
          </div>

          {/* Logo Upload Button */}
          <label className="flex items-center justify-center gap-2.5 p-3 rounded-xl border border-dashed border-neutral-300 hover:border-neutral-900 bg-neutral-50 hover:bg-neutral-100/80 cursor-pointer transition-all">
            <Upload className="w-4 h-4 text-neutral-600" />
            <div className="text-left">
              <span className="text-xs font-bold text-neutral-900 block">
                {isExtractingColor ? 'Sampling dominant color...' : 'Upload Logo (PNG/JPG)'}
              </span>
              <span className="text-[10px] text-neutral-500">Auto-samples dominant brand hue</span>
            </div>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              onChange={handleLogoUpload}
              className="hidden"
            />
          </label>
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
              tokens: { ...project.tokens, meta: { ...project.tokens.meta, platformTarget: e.target.value as any } }
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
              tokens: { ...project.tokens, meta: { ...project.tokens.meta, frameworkTarget: e.target.value as any } }
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
              tokens: { ...project.tokens, meta: { ...project.tokens.meta, darkMode: e.target.value as any } }
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
          onChange={e => {
            const urls = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
            onChange({
              tokens: {
                ...project.tokens,
                meta: { ...project.tokens.meta, inspirationUrls: urls }
              }
            });
          }}
          placeholder="e.g. stripe.com, linear.app, acorn.io"
          className="w-full px-3.5 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
        />
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
              <label
                key={script.id}
                onClick={() => toggleScript(script.id)}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  isChecked
                    ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                    : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-800'
                }`}
              >
                <span className="text-xs font-medium">{script.label}</span>
                <input
                  type="checkbox"
                  checked={isChecked}
                  readOnly
                  className="rounded text-neutral-900 focus:ring-0"
                />
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};
