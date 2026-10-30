import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, FileText, Lock, Globe, Check } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'terms' | 'privacy';
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'privacy'
}) => {
  const [tab, setTab] = useState<'terms' | 'privacy'>(initialTab);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-neutral-950/60 backdrop-blur-xs cursor-pointer"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden z-10 flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-neutral-800" />
              <h2 className="font-bold text-sm text-neutral-900">
                Design System Studio · Legal & Privacy
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tab Switcher */}
          <div className="px-6 pt-4 flex gap-2 border-b border-neutral-100">
            <button
              onClick={() => setTab('privacy')}
              className={`flex items-center gap-1.5 pb-3 px-1 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                tab === 'privacy'
                  ? 'border-neutral-900 text-neutral-900'
                  : 'border-transparent text-neutral-400 hover:text-neutral-700'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Privacy Policy</span>
            </button>
            <button
              onClick={() => setTab('terms')}
              className={`flex items-center gap-1.5 pb-3 px-1 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                tab === 'terms'
                  ? 'border-neutral-900 text-neutral-900'
                  : 'border-transparent text-neutral-400 hover:text-neutral-700'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Terms of Service</span>
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto space-y-4 text-xs leading-relaxed text-neutral-600">
            {tab === 'privacy' ? (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-900 text-xs">
                  <strong>Zero Cross-Site Tracking:</strong> We do not track you across the web, use advertising cookies, or sell any project data. Your creative decisions remain entirely yours.
                </div>

                <div>
                  <h3 className="font-bold text-neutral-900 text-sm mb-1">1. Local-First Storage</h3>
                  <p>
                    All design tokens, color configurations, and project preferences are stored locally in your browser's localStorage. You can work completely offline, export your project JSON, and clear your storage at any time.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-neutral-900 text-sm mb-1">2. Google Authentication & Cloud Sync</h3>
                  <p>
                    When choosing to authenticate with Google, we request strictly read-only profile information (name, email, avatar). We never request access to Google Drive, files, contacts, or sensitive account data.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-neutral-900 text-sm mb-1">3. Typography & Subsetting Privacy</h3>
                  <p>
                    Font specimens previewed in the font picker use Google Fonts' dynamic text subsetting (`&text=`), requesting only the minimum required glyphs. Exported starter kits prioritize self-hosted Fontsource packages so production applications make zero external font requests.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-900 text-xs">
                  <strong>Complete Ownership of Output:</strong> Every design token, Tailwind theme, CSS variable, TypeScript definition, and ZIP package generated by Design System Studio is 100% your property with full commercial use rights.
                </div>

                <div>
                  <h3 className="font-bold text-neutral-900 text-sm mb-1">1. License & Ownership</h3>
                  <p>
                    You retain full intellectual property rights to the design systems, color palettes, and component configurations you author. You may freely use, sublicense, or distribute generated code in commercial or open-source projects without attribution.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-neutral-900 text-sm mb-1">2. Open Source Font & Asset Hygiene</h3>
                  <p>
                    Fonts referenced by the system are distributed under open licenses (SIL Open Font License 1.1 or Apache 2.0). If you upload custom fonts or assets, you are responsible for maintaining valid licenses for your proprietary assets.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-neutral-900 text-sm mb-1">3. Accessibility Compliance</h3>
                  <p>
                    The studio provides mathematical contrast verification tools based on WCAG 2.2 AA standards. While DSS helps achieve mathematically verified compliance, overall digital accessibility remains the responsibility of the implementing team.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-between">
            <span className="text-[11px] text-neutral-400 font-mono">
              Version 1.0.0 · Updated October 2026
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

