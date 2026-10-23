import React, { useState } from 'react';
import { Search, Check, Sparkles, Plus, Compass } from 'lucide-react';
import { DesignProject } from '../../types/designSystem';
import { WEBSITE_TYPES, CATEGORIES, WebsiteTypeDefinition } from '../../data/websiteTypes';
import { COLOR_PALETTES } from '../../data/palettes';
import { VISUAL_DIRECTIONS } from '../../data/visualDirections';

interface Step2WebsiteTypeProps {
  project: DesignProject;
  onChange: (updated: Partial<DesignProject>) => void;
}

export const Step2WebsiteType: React.FC<Step2WebsiteTypeProps> = ({ project, onChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [isCustomMode, setIsCustomMode] = useState(project.websiteType.id === 'custom');
  const [customTypeName, setCustomTypeName] = useState(
    project.websiteType.id === 'custom' ? project.websiteType.name : ''
  );
  const [customTypeDesc, setCustomTypeDesc] = useState(
    project.websiteType.id === 'custom' ? project.websiteType.description : ''
  );

  const filteredTypes = WEBSITE_TYPES.filter(type => {
    const matchesCategory = selectedCategory === 'All Categories' || type.category === selectedCategory;
    const matchesSearch =
      type.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      type.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      type.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectType = (type: WebsiteTypeDefinition) => {
    setIsCustomMode(false);
    const recommendedPalette = COLOR_PALETTES.find(p => p.id === type.recommendedPaletteId) || project.colorPalette;
    const recommendedDirection = VISUAL_DIRECTIONS.find(d => d.id === type.recommendedDirection) || project.visualDirection;

    onChange({
      websiteType: {
        id: type.id,
        name: type.name,
        category: type.category,
        description: type.description,
        characteristics: [type.category, 'Focused Experience']
      },
      visualDirection: recommendedDirection,
      colorPalette: recommendedPalette,
      components: {
        ...project.components,
        enabledComponents: type.defaultComponents
      }
    });
  };

  const handleApplyCustomType = () => {
    const name = customTypeName.trim() || 'Custom Business Website';
    const desc = customTypeDesc.trim() || 'A bespoke website designed specifically for your venture.';

    setIsCustomMode(true);
    onChange({
      websiteType: {
        id: 'custom',
        name: name,
        category: 'Custom & Bespoke',
        description: desc,
        characteristics: ['Bespoke Architecture', 'Founder-Tuned']
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      {/* Title & intro with non-tech title and small tech term */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 text-xs font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5 text-neutral-900" />
          <span>Step 2 of 14 · Website Type</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-1">
          What Kind of Website Are You Building?
        </h1>
        <span className="text-[11px] font-mono text-neutral-400 block mb-2">
          technical: website taxonomy & recommendation profile
        </span>
        <p className="text-sm text-neutral-600 max-w-xl mx-auto leading-relaxed">
          Selecting your website genre tailors your layout spacing, button sizes, and recommended component packs (e.g. product cards for online stores, course cards for education, or metric tables for SaaS).
        </p>
      </div>

      {/* Search & Category Filter Toolbar */}
      <div className="bg-white border border-neutral-200 rounded-xl p-4 mb-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search 33 website categories..."
            className="w-full pl-9 pr-4 py-2 text-xs text-neutral-900 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white"
          />
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {CATEGORIES.slice(0, 5).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                selectedCategory === cat
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 bg-neutral-50 hover:bg-neutral-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* OTHER / CUSTOM WEBSITE BUILDER BOX */}
      <div
        className={`mb-6 p-5 rounded-xl border transition-all ${
          isCustomMode
            ? 'border-neutral-900 bg-neutral-50 ring-2 ring-neutral-900 shadow-md'
            : 'border-neutral-200 bg-white hover:border-neutral-300'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-neutral-900" />
            <h3 className="text-sm font-bold text-neutral-900">
              Other / Custom Website Type
            </h3>
            <span className="text-[10px] font-mono text-neutral-400">
              technical: bespoke category definition
            </span>
          </div>
          {isCustomMode && (
            <span className="text-xs font-bold text-neutral-900 bg-neutral-200 px-2 py-0.5 rounded self-start sm:self-auto">
              Custom Type Selected
            </span>
          )}
        </div>

        <p className="text-xs text-neutral-500 mb-3">
          Building something unique that doesn't fit standard categories? Define your own website genre below.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
              Custom Category Name
            </label>
            <input
              type="text"
              value={customTypeName}
              onChange={e => setCustomTypeName(e.target.value)}
              placeholder="e.g. Artisan Woodworking & Bespoke Commissions"
              className="w-full px-3 py-2 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
              What does this website do?
            </label>
            <input
              type="text"
              value={customTypeDesc}
              onChange={e => setCustomTypeDesc(e.target.value)}
              placeholder="e.g. Highlights private architectural woodwork with commission inquiry forms."
              className="w-full px-3 py-2 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleApplyCustomType}
          className="px-4 py-2 text-xs font-semibold bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
        >
          Use Custom Website Type
        </button>
      </div>

      {/* Website Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTypes.map(type => {
          const isSelected = !isCustomMode && project.websiteType.id === type.id;

          return (
            <button
              key={type.id}
              type="button"
              onClick={() => handleSelectType(type)}
              className={`text-left p-5 rounded-xl border transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'border-neutral-900 bg-white ring-2 ring-neutral-900 shadow-md'
                  : 'border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[11px] font-semibold tracking-wider uppercase text-neutral-400 block">
                      {type.category}
                    </span>
                    <span className="text-[9px] font-mono text-neutral-400">
                      preset: {type.id}
                    </span>
                  </div>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[2.5]" />
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-neutral-900 mb-1.5">
                  {type.name}
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                  {type.description}
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-100 text-[11px] text-neutral-500 italic">
                {type.designTips}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
