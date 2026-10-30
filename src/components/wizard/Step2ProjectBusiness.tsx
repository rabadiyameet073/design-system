import React from 'react';
import { Sparkles, Globe, Target, Users, Shield, Layers } from 'lucide-react';
import { DesignProject } from '../../types/designSystem';

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
  const currentScripts: string[] = project.tokens?.meta?.scripts || ['latin'];

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
          Establish your brand name, core goals, and language scripts. Script selection ensures your typography engine only presents fonts that support your audience's writing systems.
        </p>
      </div>

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

        {/* Primary Business Goal */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-neutral-700">Primary Conversion Goal</label>
          <select
            value={project.businessDiscovery?.primaryOffering || 'High-Trust Direct Sales'}
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

        {/* Target Audience */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-neutral-700">Target Audience Profile</label>
          <input
            type="text"
            value={project.businessDiscovery?.targetAudience || 'Design-conscious collectors & founders'}
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
