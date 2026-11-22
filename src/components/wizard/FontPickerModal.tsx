import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, X, Check, Filter, Sparkles, Globe, Sliders, ArrowUpDown } from 'lucide-react';
import { FontMeta } from '../../utils/typeScale';
import fontsSnapshot from '../../data/fonts.snapshot.json';
import { useFocusTrap } from '../../utils/useFocusTrap';

interface FontPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFont: (font: FontMeta) => void;
  onHoverFont?: (font: FontMeta) => void;
  onClearHover?: () => void;
  selectedFamily: string;
  roleName: string;
  allowedScripts?: string[];
}

// Track loaded font link elements to avoid duplicate DOM entries
const loadedFontTags = new Set<string>();

const LazyFontRow: React.FC<{
  font: FontMeta;
  isSelected: boolean;
  isFocused?: boolean;
  previewText: string;
  missingScripts?: string[];
  onSelect: () => void;
  onHover?: () => void;
  onLeave?: () => void;
}> = ({ font, isSelected, isFocused, previewText, missingScripts = [], onSelect, onHover, onLeave }) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [isFontLoaded, setIsFontLoaded] = useState(false);

  useEffect(() => {
    if (isFocused && rowRef.current) {
      rowRef.current.scrollIntoView({ block: 'nearest' });
    }
  }, [isFocused]);

  useEffect(() => {
    const el = rowRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '120px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Lazy-load glyph-subsetted CSS via Google Fonts &text=
  useEffect(() => {
    if (!isInView || typeof document === 'undefined') return;

    const sampleString = `${font.family} ${previewText}`;
    const fontId = `dss-font-preview-${font.family.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

    if (!loadedFontTags.has(fontId)) {
      loadedFontTags.add(fontId);
      const link = document.createElement('link');
      link.id = fontId;
      link.rel = 'stylesheet';
      const encodedFamily = encodeURIComponent(font.family).replace(/%20/g, '+');
      const encodedText = encodeURIComponent(sampleString);
      link.href = `https://fonts.googleapis.com/css2?family=${encodedFamily}&text=${encodedText}&display=swap`;
      link.onload = () => setIsFontLoaded(true);
      document.head.appendChild(link);
    } else {
      setIsFontLoaded(true);
    }
  }, [isInView, font.family, previewText]);

  return (
    <div
      ref={rowRef}
      onClick={onSelect}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
        isSelected
          ? 'bg-neutral-900 text-white border-neutral-900 shadow-md ring-2 ring-neutral-900/10'
          : isFocused
          ? 'bg-neutral-100 border-neutral-400 ring-2 ring-neutral-900/20 text-neutral-900'
          : 'bg-white hover:bg-neutral-50 hover:border-neutral-300 border-neutral-200 text-neutral-800'
      }`}
    >
      <div className="space-y-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-sm tracking-tight">{font.family}</span>
          <span
            className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded ${
              isSelected ? 'bg-white/10 text-neutral-300' : 'bg-neutral-100 text-neutral-600'
            }`}
          >
            {font.category}
          </span>
          {font.variable && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
              Variable
            </span>
          )}
          {font.popularityRank && font.popularityRank <= 50 && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-bold">
              Top #{font.popularityRank}
            </span>
          )}
          {missingScripts.length > 0 && (
            <span
              title={`Does not support required script: ${missingScripts.join(', ')}`}
              className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-semibold"
            >
              Missing {missingScripts.join(', ')}
            </span>
          )}
        </div>
        <div
          className={`text-sm truncate max-w-xl transition-opacity duration-200 ${
            isSelected ? 'text-neutral-200' : 'text-neutral-700'
          } ${isFontLoaded ? 'opacity-100' : 'opacity-85'}`}
          style={{ fontFamily: `"${font.family}", system-ui, sans-serif` }}
        >
          {previewText}
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className={`text-[11px] font-mono ${isSelected ? 'text-neutral-400' : 'text-neutral-500'}`}>
          {font.variants.length} styles
        </span>
        {isSelected && (
          <span className="p-1 rounded-full bg-emerald-500 text-white">
            <Check className="w-3.5 h-3.5" />
          </span>
        )}
      </div>
    </div>
  );
};

export const FontPickerModal: React.FC<FontPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectFont,
  onHoverFont,
  onClearHover,
  selectedFamily,
  roleName,
  allowedScripts = ['latin']
}) => {
  const [fonts, setFonts] = useState<FontMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedScript, setSelectedScript] = useState<string>(
    allowedScripts.find(s => s !== 'latin') || 'all'
  );
  const [variableOnly, setVariableOnly] = useState(false);
  const [minWeightsOnly, setMinWeightsOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'popularity' | 'alpha'>('popularity');
  const [previewText, setPreviewText] = useState('Sphinx of black quartz, judge my vow.');
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);

    fetch('/api/fonts')
      .then(res => res.json())
      .then((data: FontMeta[]) => {
        setFonts(data || []);
        setLoading(false);
      })
      .catch(() => {
        setFonts(fontsSnapshot as unknown as FontMeta[]);
        setLoading(false);
      });
  }, [isOpen]);

  const filteredFonts = useMemo(() => {
    let result = fonts.filter(font => {
      // Category filter
      if (selectedCategory !== 'all' && font.category !== selectedCategory) {
        return false;
      }

      // Script filter
      if (selectedScript !== 'all') {
        const hasScript = font.subsets.some(s => s.toLowerCase().includes(selectedScript.toLowerCase()));
        if (!hasScript) return false;
      }

      // Variable filter
      if (variableOnly && !font.variable) {
        return false;
      }

      // Has >= 4 weights filter (Doc 03 §5)
      if (minWeightsOnly && !font.variable && font.variants.length < 4) {
        return false;
      }

      // Search query
      if (search.trim()) {
        const q = search.toLowerCase();
        return font.family.toLowerCase().includes(q) || font.category.toLowerCase().includes(q);
      }

      return true;
    });

    if (sortBy === 'alpha') {
      result = [...result].sort((a, b) => a.family.localeCompare(b.family));
    } else {
      result = [...result].sort((a, b) => (a.popularityRank || 999) - (b.popularityRank || 999));
    }

    return result;
  }, [fonts, search, selectedCategory, selectedScript, variableOnly, minWeightsOnly, sortBy]);

  // Reset keyboard focus index when filtered results change
  useEffect(() => {
    setFocusedIndex(-1);
  }, [search, selectedCategory, selectedScript, variableOnly, minWeightsOnly]);

  // Keyboard navigation per Doc 03 §5
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClearHover?.();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIndex(prev => {
          const next = Math.min(prev + 1, filteredFonts.length - 1);
          if (filteredFonts[next]) {
            onHoverFont?.(filteredFonts[next]);
          }
          return next;
        });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedIndex(prev => {
          const next = Math.max(prev - 1, 0);
          if (filteredFonts[next]) {
            onHoverFont?.(filteredFonts[next]);
          }
          return next;
        });
      } else if (e.key === 'Enter' && focusedIndex >= 0 && filteredFonts[focusedIndex]) {
        e.preventDefault();
        onSelectFont(filteredFonts[focusedIndex]);
        onClearHover?.();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredFonts, focusedIndex, onClose, onSelectFont, onHoverFont, onClearHover]);

  const modalRef = useFocusTrap<HTMLDivElement>(isOpen, () => {
    onClearHover?.();
    onClose();
  });

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="font-picker-title"
      onClick={e => {
        if (e.target === e.currentTarget) {
          onClearHover?.();
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-neutral-200 flex flex-col max-h-[85vh] overflow-hidden focus:outline-none"
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-neutral-200 flex items-center justify-between shrink-0">
          <div>
            <div className="text-[11px] font-mono uppercase font-bold text-neutral-500">
              Font Catalog · Choosing for {roleName.toUpperCase()}
            </div>
            <h2 id="font-picker-title" className="text-lg font-bold text-neutral-900">
              Select Verified Web Font
            </h2>
          </div>
          <button
            onClick={() => {
              onClearHover?.();
              onClose();
            }}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
            aria-label="Close font picker dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filters */}
        <div className="p-4 border-b border-neutral-100 space-y-3 bg-neutral-50/50 shrink-0">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search font family name (e.g. Fraunces, Inter, Poppins, Lexend)..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>

            {/* Custom sample preview text */}
            <input
              type="text"
              value={previewText}
              onChange={e => setPreviewText(e.target.value)}
              placeholder="Sample specimen text..."
              className="w-full sm:w-64 px-3 py-2 text-xs bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 font-mono text-neutral-600"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Category Filter */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-neutral-200">
              {['all', 'sans-serif', 'serif', 'monospace', 'display', 'handwriting'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium capitalize transition-colors cursor-pointer ${
                    selectedCategory === cat ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Script Filter */}
            <select
              value={selectedScript}
              onChange={e => setSelectedScript(e.target.value)}
              className="px-2.5 py-1 text-xs bg-white border border-neutral-200 rounded-lg text-neutral-700"
            >
              <option value="all">All Scripts</option>
              <option value="latin">Latin</option>
              <option value="devanagari">Devanagari (Hindi, Marathi)</option>
              <option value="gujarati">Gujarati (ગુજરાતી)</option>
              <option value="arabic">Arabic (العربية)</option>
              <option value="cyrillic">Cyrillic</option>
            </select>

            {/* Sort Toggle */}
            <button
              type="button"
              onClick={() => setSortBy(sortBy === 'popularity' ? 'alpha' : 'popularity')}
              className="flex items-center gap-1 px-2.5 py-1 bg-white border border-neutral-200 rounded-lg text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <ArrowUpDown className="w-3 h-3 text-neutral-400" />
              <span>{sortBy === 'popularity' ? 'Popularity' : 'A–Z'}</span>
            </button>

            {/* Variable Only Filter Checkbox */}
            <label className="flex items-center gap-1.5 text-[11px] text-neutral-600 cursor-pointer">
              <input
                type="checkbox"
                checked={variableOnly}
                onChange={e => setVariableOnly(e.target.checked)}
                className="rounded text-neutral-900 focus:ring-0"
              />
              <span>Variable</span>
            </label>

            {/* Has >= 4 weights Filter Checkbox (Doc 03 §5) */}
            <label className="flex items-center gap-1.5 text-[11px] text-neutral-600 cursor-pointer">
              <input
                type="checkbox"
                checked={minWeightsOnly}
                onChange={e => setMinWeightsOnly(e.target.checked)}
                className="rounded text-neutral-900 focus:ring-0"
              />
              <span>≥ 4 weights</span>
            </label>
          </div>
        </div>

        {/* Font List */}
        <div
          className="flex-1 overflow-y-auto p-4 space-y-2"
          onMouseLeave={() => onClearHover?.()}
        >
          {loading ? (
            <div className="py-12 text-center text-xs text-neutral-400 font-mono animate-pulse">
              Loading verified typography catalog...
            </div>
          ) : filteredFonts.length === 0 ? (
            <div className="py-12 text-center text-xs text-neutral-500">
              No font families found matching your criteria.
            </div>
          ) : (
            filteredFonts.map((font, idx) => {
              // Calculate missing required scripts
              const missing = (allowedScripts || []).filter(
                req => req !== 'latin' && !font.subsets.some(s => s.toLowerCase().includes(req.toLowerCase()))
              );

              return (
                <LazyFontRow
                  key={font.family}
                  font={font}
                  isSelected={selectedFamily === font.family}
                  isFocused={focusedIndex === idx}
                  previewText={previewText}
                  missingScripts={missing}
                  onHover={() => onHoverFont?.(font)}
                  onLeave={() => onClearHover?.()}
                  onSelect={() => {
                    onSelectFont(font);
                    onClearHover?.();
                    onClose();
                  }}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
