import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Check, ArrowRight, HelpCircle, X, RotateCcw, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DesignProject } from '../../types/designSystem';
import { CATEGORIES_LIST, GENRE_CONFIGS, GenreConfig, getGenresForCategory } from '../../preview/genres';
import { CategoryId } from '../../tokens/types';

interface Step1CategoryGenreProps {
  project: DesignProject;
  onChange: (updated: Partial<DesignProject>) => void;
  onPreviewDraft?: (draft: Partial<DesignProject>, label: string) => void;
  onClearDraft?: () => void;
}

const RECENT_GENRES_KEY = 'dss_recent_genres_v1';

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
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  // Recently selected genres persisted in localStorage
  const [recentGenreIds, setRecentGenreIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(RECENT_GENRES_KEY);
      return raw ? JSON.parse(raw) : ['ceramics-atelier', 'b2b-saas', 'design-portfolio'];
    } catch {
      return ['ceramics-atelier', 'b2b-saas', 'design-portfolio'];
    }
  });

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState({
    purpose: '',
    mood: '',
    density: ''
  });

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
    if (onClearDraft) onClearDraft();
    const genreDefaults = genre.defaults || {};

    // Update recents
    const nextRecents = [genre.id, ...recentGenreIds.filter(id => id !== genre.id)].slice(0, 5);
    setRecentGenreIds(nextRecents);
    try {
      localStorage.setItem(RECENT_GENRES_KEY, JSON.stringify(nextRecents));
    } catch {
      // Storage unavailable
    }

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
        ...genreDefaults,
        meta: {
          ...project.tokens.meta,
          genreId: genre.id,
          category: genre.category,
          ...(genreDefaults.meta || {})
        }
      }
    });
  };

  // Derive Quiz recommendation
  const getQuizRecommendation = (): GenreConfig => {
    const { purpose, mood } = quizAnswers;
    if (purpose === 'commerce') {
      if (mood === 'warm') return GENRE_CONFIGS['ceramics-atelier'] || Object.values(GENRE_CONFIGS)[0];
      return GENRE_CONFIGS['curated-boutique'] || GENRE_CONFIGS['ceramics-atelier'];
    }
    if (purpose === 'saas') {
      if (mood === 'bold') return GENRE_CONFIGS['dev-tools'] || GENRE_CONFIGS['b2b-saas'];
      return GENRE_CONFIGS['b2b-saas'];
    }
    if (purpose === 'creative') {
      if (mood === 'warm') return GENRE_CONFIGS['architecture-firm'] || GENRE_CONFIGS['design-portfolio'];
      return GENRE_CONFIGS['design-portfolio'];
    }
    if (purpose === 'editorial') {
      return GENRE_CONFIGS['independent-press'] || GENRE_CONFIGS['digital-magazine'] || GENRE_CONFIGS['ceramics-atelier'];
    }
    if (purpose === 'services') {
      return GENRE_CONFIGS['consulting-partner'] || GENRE_CONFIGS['b2b-saas'];
    }
    return GENRE_CONFIGS['ceramics-atelier'];
  };

  const recommendedFromQuiz = getQuizRecommendation();

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-8">
      {/* Title & Context */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 text-white text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Step 1 of 11 · Category & Website Genre</span>
          </div>

          <button
            type="button"
            onClick={() => setIsQuizOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-300 bg-white hover:bg-neutral-50 text-xs font-semibold text-neutral-800 transition-colors shadow-2xs cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-indigo-600" />
            <span>Not sure? Take 30-sec archetype quiz</span>
          </button>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900">
          What kind of website is your design system for?
        </h1>
        <p className="text-sm text-neutral-600 leading-relaxed max-w-2xl">
          Pick your industry category and genre. A fully reactive, bespoke template for this archetype will open in the live preview pane immediately.
        </p>
      </div>

      {/* Recently Used Genres Row */}
      {recentGenreIds.length > 0 && (
        <div className="space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-semibold block">
            Recently Selected Genres
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            {recentGenreIds.map(gId => {
              const genreObj = GENRE_CONFIGS[gId];
              if (!genreObj) return null;
              const isSelected = currentGenreId === gId;
              return (
                <button
                  key={gId}
                  type="button"
                  onClick={() => {
                    setActiveCategory(genreObj.category);
                    handleSelectGenre(genreObj);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                      : 'bg-neutral-100 hover:bg-neutral-200 border-neutral-200 text-neutral-700'
                  }`}
                >
                  <span>{genreObj.label}</span>
                  {isSelected && <Check className="w-3 h-3 text-emerald-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

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
                type="button"
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
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                onClick={() => handleSelectGenre(genre)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelectGenre(genre);
                  }
                }}
                onMouseEnter={() => {
                  if (onPreviewDraft) {
                    const genreDefaults = genre.defaults || {};
                    onPreviewDraft({
                      websiteType: {
                        id: genre.id,
                        name: genre.label,
                        category: genre.category,
                        description: genre.description,
                        characteristics: [genre.density, ...genre.fontRecommendationTags]
                      },
                      tokens: {
                        ...project.tokens,
                        ...genreDefaults,
                        meta: {
                          ...project.tokens.meta,
                          genreId: genre.id,
                          category: genre.category,
                          ...(genreDefaults.meta || {})
                        }
                      }
                    }, genre.label);
                  }
                }}
                onMouseLeave={() => {
                  if (onClearDraft) onClearDraft();
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:outline-none ${
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

      {/* "I'm Not Sure" 3-Question Archetype Quiz Modal */}
      <AnimatePresence>
        {isQuizOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
            role="dialog"
            aria-modal="true"
            aria-labelledby="quiz-modal-title"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-lg bg-white rounded-2xl border border-neutral-200 shadow-2xl p-6 overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-neutral-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-neutral-900 text-white flex items-center justify-center">
                    <Compass className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <h3 id="quiz-modal-title" className="text-base font-bold text-neutral-900">
                      Genre Archetype Selector
                    </h3>
                    <p className="text-xs text-neutral-500">
                      Answer 3 quick questions to discover your ideal design foundation
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsQuizOpen(false)}
                  className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
                  aria-label="Close dialog"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Quiz Questions */}
              <div className="py-4 space-y-5 text-left">
                {/* Q1: Primary Purpose */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-800">
                    1. What is the primary purpose of your site?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { id: 'commerce', label: 'E-Commerce / Store', desc: 'Sell physical or digital products' },
                      { id: 'saas', label: 'SaaS / Developer Tool', desc: 'Software product or web application' },
                      { id: 'creative', label: 'Creative Portfolio', desc: 'Showcase design, art or architecture' },
                      { id: 'editorial', label: 'Editorial / Media', desc: 'Publish essays, journalism or news' },
                      { id: 'services', label: 'Agency / Advisory', desc: 'Consulting or client engagements' }
                    ].map(opt => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setQuizAnswers(prev => ({ ...prev, purpose: opt.id }))}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          quizAnswers.purpose === opt.id
                            ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                            : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-800'
                        }`}
                      >
                        <div className="text-xs font-semibold">{opt.label}</div>
                        <div className={`text-[10px] ${quizAnswers.purpose === opt.id ? 'text-neutral-300' : 'text-neutral-500'}`}>
                          {opt.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Q2: Mood */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-800">
                    2. What aesthetic mood best captures your brand?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { id: 'warm', label: 'Artisanal & Warm', desc: 'Serene earth tones, heritage serifs' },
                      { id: 'clean', label: 'Precise & Minimal', desc: 'Obsidian, Swiss typography, disciplined' },
                      { id: 'bold', label: 'Kinetic & High-Tech', desc: 'Electric accents, dark mode, vibrant' },
                      { id: 'trust', label: 'Corporate & Authoritative', desc: 'Crisp blues, dignified layout' }
                    ].map(opt => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setQuizAnswers(prev => ({ ...prev, mood: opt.id }))}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          quizAnswers.mood === opt.id
                            ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                            : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-800'
                        }`}
                      >
                        <div className="text-xs font-semibold">{opt.label}</div>
                        <div className={`text-[10px] ${quizAnswers.mood === opt.id ? 'text-neutral-300' : 'text-neutral-500'}`}>
                          {opt.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Q3: Density */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-800">
                    3. What spatial density do you prefer?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'airy', label: 'Airy & Spacious', desc: 'Generous whitespace' },
                      { id: 'balanced', label: 'Balanced Rhythm', desc: 'Standard comfortable spacing' },
                      { id: 'compact', label: 'High Density', desc: 'Compact data controls' }
                    ].map(opt => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setQuizAnswers(prev => ({ ...prev, density: opt.id }))}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          quizAnswers.density === opt.id
                            ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                            : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-800'
                        }`}
                      >
                        <div className="text-xs font-semibold">{opt.label}</div>
                        <div className={`text-[10px] ${quizAnswers.density === opt.id ? 'text-neutral-300' : 'text-neutral-500'}`}>
                          {opt.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Result Recommendation Card */}
                {quizAnswers.purpose && (
                  <div className="p-4 rounded-xl bg-neutral-900 text-white space-y-2 mt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400 font-bold">
                        Recommended Archetype
                      </span>
                      <span className="text-xs font-mono text-neutral-400">
                        {recommendedFromQuiz.category}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white">
                      {recommendedFromQuiz.label}
                    </h4>
                    <p className="text-xs text-neutral-300">
                      {recommendedFromQuiz.description}
                    </p>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveCategory(recommendedFromQuiz.category);
                          handleSelectGenre(recommendedFromQuiz);
                          setIsQuizOpen(false);
                        }}
                        className="w-full py-2 bg-white text-neutral-900 text-xs font-bold rounded-lg hover:bg-neutral-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>Apply {recommendedFromQuiz.label}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
