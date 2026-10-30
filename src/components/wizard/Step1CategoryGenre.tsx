import React, { useState } from 'react';
import { Search, Sparkles, Check, ArrowRight } from 'lucide-react';
import { DesignProject } from '../../types/designSystem';
import { CATEGORIES_LIST, GENRE_CONFIGS, GenreConfig, getGenresForCategory } from '../../preview/genres';
import { CategoryId } from '../../tokens/types';

interface Step1CategoryGenreProps {
  project: DesignProject;
  onChange: (updated: Partial<DesignProject>) => void;
  onPreviewDraft?: (draft: Partial<DesignProject>, label: string) => void;
  onClearDraft?: () => void;
}

export const Step1CategoryGenre: React.FC<Step1CategoryGenreProps> = ({
  project,
  onChange,
  onPreviewDraft,
  onClearDraft
}) => {
  const currentCategory: CategoryId = (project.tokens?.meta?.category as CategoryId) || 'commerce';
  const currentGenreId = project.tokens?.meta?.genreId || 'ceramics-atelier';

  const [activeCategory, setActiveCategory] = useState<CategoryId>(currentCategory);
  const [searchQuery, setSearchQuery] = useState('');

  const genresForActive = getGenresForCategory(activeCategory);

  const filteredGenres = Object.values(GENRE_CONFIGS).filter(g => {
    if (searchQuery.trim()) {
      return (
        g.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return g.category === activeCategory;
  });

  const handleSelectGenre = (genre: GenreConfig) => {
    onChange({
      websiteType: {
        id: genre.id,
        name: genre.label,
        category: genre.category,
        description: genre.description,
        characteristics: [genre.density, ...genre.fontRecommendationTags]
      },
      tokens: {
        ...project.tokens,
        meta: {
          ...project.tokens.meta,
          genreId: genre.id,
          category: genre.category
        }
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-8">
      {/* Title & Context */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 text-white text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Step 1 of 11 · Category & Website Genre</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900">
          What kind of website is your design system for?
        </h1>
        <p className="text-sm text-neutral-600 leading-relaxed max-w-2xl">
          Pick your industry category and genre. A fully reactive, bespoke template for this archetype will open in the live preview pane immediately.
        </p>
      </div>

      {/* 8 Category Tabs */}
      <div className="space-y-3">
        <div className="text-xs uppercase font-bold tracking-wider text-neutral-500 font-mono">
          1. Select Primary Industry Category
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {CATEGORIES_LIST.map(cat => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setSearchQuery('');
                  // Auto-select first genre of category
                  const firstOfCat = getGenresForCategory(cat.id)[0];
                  if (firstOfCat) handleSelectGenre(firstOfCat);
                }}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-neutral-900 text-white border-neutral-900 shadow-md ring-2 ring-neutral-900/20'
                    : 'bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-800'
                }`}
              >
                <div className="font-semibold text-xs">{cat.label}</div>
                <div className={`text-[11px] mt-1 line-clamp-1 ${isSelected ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  {cat.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Input for Long-Tail */}
      <div className="relative">
        <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search 32 genres (e.g. fashion, dev tools, ceramics, fintech, masterclass)..."
          className="w-full pl-9 pr-4 py-2.5 text-xs text-neutral-900 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
        />
      </div>

      {/* Genre Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-neutral-500">
          <span>2. Choose Specific Website Genre ({filteredGenres.length} options)</span>
          <span className="text-[11px]">Hover or tap to test in live preview</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {filteredGenres.map(genre => {
            const isSelected = currentGenreId === genre.id;
            return (
              <div
                key={genre.id}
                onClick={() => handleSelectGenre(genre)}
                onMouseEnter={() => {
                  if (onPreviewDraft) {
                    onPreviewDraft({
                      tokens: {
                        ...project.tokens,
                        meta: { ...project.tokens.meta, genreId: genre.id, category: genre.category }
                      }
                    }, genre.label);
                  }
                }}
                onMouseLeave={() => {
                  if (onClearDraft) onClearDraft();
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                  isSelected
                    ? 'bg-neutral-900 text-white border-neutral-900 shadow-md ring-2 ring-neutral-900/10'
                    : 'bg-white hover:bg-neutral-50 hover:border-neutral-300 border-neutral-200 text-neutral-800'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{genre.label}</span>
                    {isSelected && (
                      <span className="p-0.5 rounded-full bg-emerald-500 text-white">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <p className={`text-xs leading-relaxed ${isSelected ? 'text-neutral-300' : 'text-neutral-600'}`}>
                    {genre.description}
                  </p>
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {genre.fontRecommendationTags.map(tag => (
                      <span
                        key={tag}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                          isSelected ? 'bg-white/10 text-neutral-200' : 'bg-neutral-100 text-neutral-600'
                        }`}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className={`shrink-0 p-1 rounded ${isSelected ? 'text-emerald-400' : 'text-neutral-400'}`}>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
