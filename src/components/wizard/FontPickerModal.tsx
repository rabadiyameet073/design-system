import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, Check, Filter, Sparkles, Globe, Sliders } from 'lucide-react';
import { FontMeta } from '../../utils/typeScale';

interface FontPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFont: (font: FontMeta) => void;
  selectedFamily: string;
  roleName: string;
  allowedScripts?: string[];
}

export const FontPickerModal: React.FC<FontPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectFont,
  selectedFamily,
  roleName,
  allowedScripts = ['latin']
}) => {
  const [fonts, setFonts] = useState<FontMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedScript, setSelectedScript] = useState<string>('all');
  const [variableOnly, setVariableOnly] = useState(false);
  const [previewText, setPreviewText] = useState('Sphinx of black quartz, judge my vow.');

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
        // Fallback to static snapshot if needed
        import('../../data/fonts.snapshot.json')
          .then(mod => {
            setFonts((mod.default || mod) as unknown as FontMeta[]);
            setLoading(false);
          })
          .catch(() => setLoading(false));
      });
  }, [isOpen]);

  const filteredFonts = useMemo(() => {
    return fonts.filter(font => {
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

      // Search query
      if (search.trim()) {
        const q = search.toLowerCase();
        return font.family.toLowerCase().includes(q) || font.category.toLowerCase().includes(q);
      }

      return true;
    });
  }, [fonts, search, selectedCategory, selectedScript, variableOnly]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-neutral-200 flex flex-col max-h-[85vh] overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-neutral-200 flex items-center justify-between shrink-0">
          <div>
            <div className="text-[11px] font-mono uppercase font-bold text-neutral-500">
              Font Catalog · Choosing for {roleName.toUpperCase()}
            </div>
            <h2 className="text-lg font-bold text-neutral-900">
              Select Web Font
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
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
                placeholder="Search font family name (e.g. Fraunces, Inter, Poppins)..."
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
              {['all', 'sans-serif', 'serif', 'monospace', 'display'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium capitalize transition-colors ${
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
              <option value="devanagari">Devanagari</option>
              <option value="gujarati">Gujarati</option>
              <option value="arabic">Arabic</option>
              <option value="cyrillic">Cyrillic</option>
            </select>

            <label className="flex items-center gap-1.5 ml-auto text-[11px] text-neutral-600 cursor-pointer">
              <input
                type="checkbox"
                checked={variableOnly}
                onChange={e => setVariableOnly(e.target.checked)}
                className="rounded text-neutral-900 focus:ring-0"
              />
              <span>Variable Fonts Only</span>
            </label>
          </div>
        </div>

        {/* Font List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {loading ? (
            <div className="py-12 text-center text-xs text-neutral-400 font-mono animate-pulse">
              Loading verified typography catalog...
            </div>
          ) : filteredFonts.length === 0 ? (
            <div className="py-12 text-center text-xs text-neutral-500">
              No font families found matching your criteria.
            </div>
          ) : (
            filteredFonts.map(font => {
              const isSelected = selectedFamily === font.family;
              return (
                <div
                  key={font.family}
                  onClick={() => {
                    onSelectFont(font);
                    onClose();
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-neutral-900 text-white border-neutral-900 shadow-md'
                      : 'bg-white hover:bg-neutral-50 hover:border-neutral-300 border-neutral-200 text-neutral-800'
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm tracking-tight">{font.family}</span>
                      <span className={`text-[10px] uppercase font-mono px-1.5 py-0.2 rounded ${
                        isSelected ? 'bg-white/10 text-neutral-300' : 'bg-neutral-100 text-neutral-500'
                      }`}>
                        {font.category}
                      </span>
                      {font.variable && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">
                          Variable
                        </span>
                      )}
                    </div>
                    <div
                      className={`text-sm truncate max-w-lg ${isSelected ? 'text-neutral-300' : 'text-neutral-600'}`}
                      style={{ fontFamily: font.family }}
                    >
                      {previewText}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-[11px] font-mono ${isSelected ? 'text-neutral-400' : 'text-neutral-400'}`}>
                      {font.variants.length} weights
                    </span>
                    {isSelected && (
                      <span className="p-1 rounded-full bg-emerald-500 text-white">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
