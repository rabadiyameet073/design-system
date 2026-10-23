import React, { useState } from 'react';
import { Sparkles, Users, HelpCircle, Layers, Plus } from 'lucide-react';
import { DesignProject } from '../../types/designSystem';

interface Step3BusinessDiscoveryProps {
  project: DesignProject;
  onChange: (updated: Partial<DesignProject>) => void;
}

export const Step3BusinessDiscovery: React.FC<Step3BusinessDiscoveryProps> = ({ project, onChange }) => {
  const [customAudience, setCustomAudience] = useState('');
  const [customContentType, setCustomContentType] = useState('');

  const updateBusiness = (field: string, value: any) => {
    onChange({
      business: {
        ...project.business,
        [field]: value
      }
    });
  };

  const audienceSuggestions = [
    'Design-conscious consumers & home curators',
    'Tech founders, engineers, and startup operators',
    'Small business owners & creative entrepreneurs',
    'Enterprise directors & procurement teams',
    'Students, self-directed learners, and educators',
    'Local families, patients, and health seekers'
  ];

  const contentFocusOptions = [
    { id: 'products', title: 'Product-Focused', desc: 'High-resolution showcases, clear pricing, and purchase actions.' },
    { id: 'services', title: 'Service & Portfolio', desc: 'Case studies, client testimonials, and booking inquiries.' },
    { id: 'content', title: 'Editorial & Articles', desc: 'Long-form essays, newsletters, guides, and thought leadership.' },
    { id: 'app', title: 'Interactive Web App', desc: 'Dashboards, input tools, data metrics, and account workflows.' }
  ];

  return (
    <div className="max-w-2xl mx-auto py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 text-xs font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5 text-neutral-900" />
          <span>Step 3 of 14 · Business Discovery</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-1">
          Tell Us About What You Do
        </h1>
        <span className="text-[11px] font-mono text-neutral-400 block mb-2">
          technical: audience profile & information architecture
        </span>
        <p className="text-sm text-neutral-600 max-w-lg mx-auto leading-relaxed">
          Understanding your audience and core offering shapes your typography scale, reading line width, and conversion hierarchy.
        </p>
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl p-6 md:p-8 space-y-6 shadow-xs">
        {/* Core Offering */}
        <div>
          <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider mb-0.5">
            What is your core product or service?
          </label>
          <span className="text-[10px] font-mono text-neutral-400 block mb-2">
            technical: value-proposition / hero headline content
          </span>
          <p className="text-xs text-neutral-500 mb-2">
            What are visitors coming to your website to buy, learn, or explore?
          </p>
          <textarea
            rows={3}
            value={project.business.offering}
            onChange={e => updateBusiness('offering', e.target.value)}
            placeholder="e.g. Handcrafted porcelain tableware made with sustainable clay; or a real-time data ingestion engine for DevOps teams..."
            className="w-full px-4 py-3 text-sm text-neutral-900 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white resize-none"
          />
        </div>

        {/* Primary Audience */}
        <div>
          <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider mb-0.5">
            Who is your ideal customer or visitor?
          </label>
          <span className="text-[10px] font-mono text-neutral-400 block mb-2">
            technical: target demographic & tone tuning
          </span>
          <p className="text-xs text-neutral-500 mb-2">
            Knowing who visits guides whether typography feels friendly and warm, or technical and dense.
          </p>

          <input
            type="text"
            value={project.business.audience}
            onChange={e => updateBusiness('audience', e.target.value)}
            placeholder="e.g. Interior architects, remote engineering leads, or passionate home cooks..."
            className="w-full px-4 py-2.5 text-sm text-neutral-900 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white mb-2"
          />

          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className="text-[11px] text-neutral-400 self-center mr-1">Quick Suggestions:</span>
            {audienceSuggestions.slice(0, 3).map(suggestion => (
              <button
                key={suggestion}
                type="button"
                onClick={() => updateBusiness('audience', suggestion)}
                className="text-[11px] px-2.5 py-1 rounded bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>

          {/* OTHER / CUSTOM AUDIENCE INPUT */}
          <div className="mt-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
            <span className="text-[11px] font-semibold text-neutral-800 block mb-1">
              Other / Custom Target Audience:
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                value={customAudience}
                onChange={e => setCustomAudience(e.target.value)}
                placeholder="Type your exact customer niche (e.g. Rare vinyl record collectors, biotech patent attorneys...)"
                className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-md focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
              <button
                type="button"
                onClick={() => {
                  if (customAudience.trim()) {
                    updateBusiness('audience', customAudience.trim());
                    setCustomAudience('');
                  }
                }}
                className="px-3 py-1.5 text-xs font-semibold bg-neutral-900 text-white rounded-md shrink-0"
              >
                Apply
              </button>
            </div>
          </div>
        </div>

        {/* Content Focus */}
        <div>
          <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider mb-0.5">
            What is the main format of your site?
          </label>
          <span className="text-[10px] font-mono text-neutral-400 block mb-2">
            technical: layout layout-model / primary section type
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            {contentFocusOptions.map(opt => {
              const isSelected = project.business.contentType.includes(opt.id) || project.business.contentType === opt.title;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => updateBusiness('contentType', opt.title)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    isSelected
                      ? 'border-neutral-900 bg-neutral-900 text-white'
                      : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300'
                  }`}
                >
                  <h4 className="font-semibold text-xs mb-1">{opt.title}</h4>
                  <p className={`text-[11px] leading-relaxed ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                    {opt.desc}
                  </p>
                </button>
              );
            })}
          </div>

          {/* OTHER / CUSTOM CONTENT FORMAT */}
          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
            <span className="text-[11px] font-semibold text-neutral-800 block mb-1">
              Other / Custom Content Format:
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                value={customContentType}
                onChange={e => setCustomContentType(e.target.value)}
                placeholder="Describe your custom layout (e.g. Interactive 3D gallery, multi-chapter whitepaper...)"
                className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-md focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
              <button
                type="button"
                onClick={() => {
                  if (customContentType.trim()) {
                    updateBusiness('contentType', customContentType.trim());
                    setCustomContentType('');
                  }
                }}
                className="px-3 py-1.5 text-xs font-semibold bg-neutral-900 text-white rounded-md shrink-0"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
